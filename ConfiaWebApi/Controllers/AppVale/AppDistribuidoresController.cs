using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Distribuidores;
using System.Collections;
using DBContext.DBConfia.General;
using DBContext.DBConfia.AppVale;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Cortes;
using DBContext.DBConfia.Tesoreria;
using DBContext.DBConfia.Seguridad;
using System.Collections.Generic;
using DBContext.DBConfia.Custom.Creditos;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Kernel.Geom;
using iText.Layout.Element;
using System.IO;
using iText.IO.Image;
using Microsoft.AspNetCore.Hosting;
using iText.Layout.Properties;
using iText.Kernel.Pdf.Canvas.Draw;
using iText.Layout.Borders;
using iText.Kernel.Colors;
using ConfiaWebApi.Code;
using System.Globalization;
using DBContext.DBConfia.dbo;
using iText.Kernel.Pdf.Canvas;
using System.Diagnostics;
using Path = System.IO.Path;
using System.Web;
using MimeKit;
using MailKit.Net.Smtp;
using MimeKit.Text;
using MailKit.Security;
using Newtonsoft.Json;
using ConfiaWebApi.RespuestasPersonalizadas.Distribuidores.Lealtad;
using Microsoft.Extensions.Configuration;
using DBContext.DBConfia.Catalogos;
using System.Drawing.Imaging;
using System.Net.Http;
using ConfiaWebApi.Controllers.General;
using ConfiaWebApi.PeticionesRest.General.CodigoSMS;
using ConfiaWebApi.ModlesSP.Creditos;
using ConfiaWebApi.ModlesSP.Cortes;
using DBContext.DBConfia.Custom.AppVale;
namespace ConfiaWebApi.Controllers.AppDistribuidores
{
    //[Authorize]
    [ApiController]
    [Route("api/AppVale/[controller]")]
    public class AppDistribuidoresController : ControllerBase
    {
        private DBConfiaContext DBContext;

        private IConfiguration Configuracion;

        private readonly IWebHostEnvironment env;

        public AppDistribuidoresController(IConfiguration _Configuration, DBConfiaContext _DBContext, IWebHostEnvironment _env)
        {
            Configuracion = _Configuration;
            DBContext = _DBContext;
            env = _env;
        }

        [HttpPost]
        [Route("GetBanner")]
        [Authorize]
        // [Code.TProteccionProducto]
        // [Code.TProteccionAppVales]
        public async Task<IActionResult> GetBanner([FromHeader(Name = "TipoEmpresaID")] int? TipoEmpresaID)
        {
            try
            {
                if (TipoEmpresaID == null)
                {
                    TipoEmpresaID = 1;
                }
                var Banner = await DBContext.database.QueryAsync<DBContext.DBConfia.General.BannerApp>("WHERE Mostrar = 1 AND TipoEmpresaID = @0", TipoEmpresaID).ToArrayAsync();


                if (Banner.Length == 0)
                {
                    return NotFound();
                }

                var data = Banner.Select(banner => new
                {
                    ImageID = banner.ImageID,
                    Imagen = banner.Imagen,
                    DescBanner = banner.Descripcion != null ? banner.Descripcion : "",
                    tituloBanner = banner.Titulo != null ? banner.Titulo : "",
                }).ToArray();

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };



                await DBContext.Destroy();

                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }

        }


        [HttpPost]
        [Route("get")]
        [Authorize]
        // [Code.TProteccionProducto]
        // [Code.TProteccionAppVales]
        public async Task<IActionResult> Get(PeticionesRest.AppValePeticiones.AppDistribuidores.Get parData, [FromHeader(Name = "ProductoID")] int producto, [FromHeader(Name = "EmpresaId")] int empresa)
        {
            try
            {
                parData.ProductoID = producto;
                var Distribuidor = await DBContext.database.QueryAsync<AppDistribuidores_VW>("WHERE (DistribuidorID = @DistribuidorID) AND (ProductoID = @ProductoID) AND (Estatus = 1)", parData).SingleOrDefaultAsync();
                var Nivel = await DBContext.database.SingleByIdAsync<Niveles>(Distribuidor.categoriaId);
                var Direcciones = await DBContext.database.QueryAsync<AppDirecciones_VW>("WHERE (PersonaID = @0)", Distribuidor.DistribuidorID).OrderByDescending(x => x.CreacionFecha).ToArrayAsync();
                var GrupoDetalle = await DBContext.database.QueryAsync<GruposDetalle_VW>("WHERE (DistribuidorID = @0) AND (ProductoID = @1) AND (Estatus = 1)", Distribuidor.DistribuidorID, producto).SingleOrDefaultAsync();
                var Empresa = await DBContext.database.SingleByIdAsync<Empresas>(empresa);
                var NumeroDistribuidor = (empresa == 6) ? Distribuidor.DistribuidorID : Distribuidor.DistribuidorID;
                var infoSistema = new
                {
                    categoriaDesc = Nivel.DistribuidorNivel,
                    sistemaId = "C",
                    sistemaDesc = Empresa.empresaNombre,
                    direccionActualizada = true,
                    versionAndroid = 3.4,
                    versionIOS = 6.6

                };

                var telefonos = new ArrayList();

                telefonos.Add(new
                {

                    id = Distribuidor.telefonoId,
                    telefonoTipo = Distribuidor.telefonoTipo,
                    telefono = Distribuidor.telefono

                });

                var direcciones = new ArrayList();
                var ultimaDireccion = true;

                foreach (var Direccion in Direcciones)
                {
                    direcciones.Add(new
                    {

                        Direccion.calle,
                        Direccion.numExterior,
                        Direccion.numInterior,
                        Direccion.colonia,
                        codigoPostal = Direccion.CodigoPostal,
                        municipio = Direccion.Municipio,
                        ciudad = Direccion.Ciudad,
                        estado = Direccion.Estado,
                        ultimaDireccion,
                    });
                    ultimaDireccion = false;
                }

                var credito = new
                {
                    estadoId = Distribuidor.DistribuidoresEstatusID,
                    estadoString = Distribuidor.DistribuidoresEstatus,
                    Distribuidor.fechaAutorizado
                };

                var categoria = new
                {
                    Distribuidor.categoriaId,
                    categoriaDesc = Nivel.DistribuidorNivel
                };

                var coordinador = new
                {
                    coordinadorId = GrupoDetalle.CoordinadorID,
                    coordinadorDesc = GrupoDetalle.Coordinador
                };

                var sucursal = new
                {
                    sucursalId = GrupoDetalle.SucursalID,
                    sucursalDesc = GrupoDetalle.Sucursal
                };
                if (Distribuidor.PrimerCanjeDig == null)
                {
                    Distribuidor.PrimerCanjeDig = false;
                }
                var data = new
                {
                    distribuidorId = Distribuidor.DistribuidorID,
                    NumeroDistribuidor,
                    Distribuidor.primerNombre,
                    Distribuidor.segundoNombre,
                    Distribuidor.primerApellido,
                    Distribuidor.segundoApellido,
                    fechaNacimiento = Distribuidor.FechaNacimiento,
                    curp = Distribuidor.CURP,
                    rfc = Distribuidor.RFC,
                    Distribuidor.edad,
                    Distribuidor.categoriaId,
                    infoSistema,
                    telefonos,
                    direcciones,
                    credito,
                    categoria,
                    coordinador,
                    Distribuidor.PrimerCanjeDig,
                    sucursal,
                    Estatus = Distribuidor.DistribuidoresEstatusID,
                };

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                await DBContext.Destroy();

                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }

        }

        [HttpPost]
        [Route("getImagenDistribuidor")]
        [Authorize]
        // [Code.TProteccionProducto]
        // [Code.TProteccionAppVales]
        public async Task<IActionResult> getImagenDistribuidor(PeticionesRest.Distribuidores.Distribuidor.UpdateImageDistribuidora parData)
        {
            try
            {
                var Distribuidor = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Distribuidores.Distribuidores>(parData.Id);
                await DBContext.Destroy();
                return Ok(Distribuidor);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    data = new { }
                });
            }

        }
        [HttpPost]
        [Route("getVideosDistribuidor")]
        [Authorize]
        // [Code.TProteccionProducto]
        // [Code.TProteccionAppVales]
        public async Task<IActionResult> getVideosDistribuidor([FromHeader(Name = "TipoEmpresaID")] int? TipoEmpresaID)
        {
            try
            {
                if (TipoEmpresaID == null)
                {
                    TipoEmpresaID = 1;
                }
                var VideosDistribuidor = await DBContext.database.QueryAsync<VideosMarketing>("WHERE Mostrar = 1 AND TipoEmpresaID = @0 Order by Prioridad", TipoEmpresaID).ToArrayAsync();

                await DBContext.Destroy();
                var response = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = VideosDistribuidor
                };
                return Ok(response);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }

        }
        [HttpPost]
        [Route("getReferenciaPago")]
        [Authorize]
        // [Code.TProteccionProducto]
        // [Code.TProteccionAppVales]
        public async Task<IActionResult> getReferenciaPago(PeticionesRest.AppValePeticiones.AppDistribuidores.Get parData, [FromHeader(Name = "ProductoID")] int producto, [FromHeader(Name = "EmpresaId")] int empresa)
        {
            try
            {
                String reference = "N/A";
                var Distribuidor = await DBContext.database.QueryAsync<ReferenciasConektaApp_VW>("WHERE DistribuidorID = @0", parData.DistribuidorID).SingleOrDefaultAsync();
                if (Distribuidor != null && Distribuidor.Reference != null)
                {
                    reference = Distribuidor.Reference;
                }
                await DBContext.Destroy();
                var response = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = new
                    {

                        referencePago = reference,
                        referenceCodeURL = (Distribuidor == null || Distribuidor.Barcode_url == "") ? "" : Distribuidor.Barcode_url,
                        comisionOxxo = (Distribuidor == null || Distribuidor.ComisionOxxo == 0) ? 0 : Distribuidor.ComisionOxxo,
                        IsConekta = true

                    }
                };
                return Ok(response);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }

        }

        [HttpPost]
        [Route("getlineas")]
        [Authorize]
        // [Code.TProteccionProducto]
        // [Code.TProteccionAppVales]
        public async Task<IActionResult> GetLineas(PeticionesRest.AppValePeticiones.AppDistribuidores.Get parData, [FromHeader(Name = "ProductoID")] int producto, [FromHeader(Name = "EmpresaId")] int empresa)
        {
            try
            {
                parData.ProductoID = producto;
                parData.EmpresaId = empresa;

                var Contratos = await DBContext.database.FetchAsync<AppContratos_VW>("WHERE (DistribuidorID = @DistribuidorID) AND (Activo = 1) AND (EmpresaId = @EmpresaId)", parData);

                var RelacionCortes = await DBContext.database.FetchAsync<RelacionCortes_VW>("WHERE (DistribuidorID = @DistribuidorID) AND (ProductoID = @ProductoID) ORDER BY fechaCorte DESC", parData);

                var atraso = (Contratos.Where(x => x.SaldoAtrasado > 0 || x.DiasAtraso > 0).Count() > 0) ? true : false;

                var relacionDisponible = (RelacionCortes.Count > 0 && RelacionCortes != null) ? true : false;
                var productoBloqueo = await DBContext.database.QueryAsync<Productos>("WHERE  (ProductoID = @0)", parData.ProductoID).FirstOrDefaultAsync();
                var GlobalRelacion = await DBContext.database.QueryAsync<VariablesGlobales>("WHERE  (varName = @0)", "Bloqueo_Relaciones").FirstOrDefaultAsync();
                bool bloqueoRelacion = false;
                if (GlobalRelacion.varValue.ToString() == "1" || productoBloqueo.Relacionesbloqueadas == true)
                {
                    bloqueoRelacion = true;
                }
                var detalle = new ArrayList();

                foreach (var Contrato in Contratos)
                {
                    detalle.Add(new
                    {

                        caption = Contrato.Producto,
                        disponible = Contrato.LineaCreditoDisponible,
                        limite = Contrato.LineaCredito,
                        saldoActual = Contrato.SaldoActual,
                        colocacion = Contrato.CapitalPendiente

                    });
                }

                var data = new
                {
                    disponibleTotal = Contratos.Select(x => x.LineaCreditoDisponible).Sum(),
                    limiteTotal = Contratos.Select(x => x.LineaCredito).Sum(),
                    saldoActualTotal = Contratos.Select(x => x.CapitalPendiente).Sum(),
                    atraso,
                    relacionDisponible,
                    accesoConfiaShop = true,
                    mensaje = "ACTUALIZA TU APP A LA ULTIMA VERSION.",
                    versionAndroid = 3.4000,
                    versionIOS = 6.6000,
                    TipoPago = "PA",
                    detalle,
                    bloqueoRelacion
                };

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                await DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }

        }

        [HttpPost]
        [Route("getsaldorelacion")]
        [Authorize]
        // [Code.TProteccionProducto]
        // [Code.TProteccionAppVales]
        public async Task<IActionResult> GetSaldoRelacion(PeticionesRest.AppValePeticiones.AppDistribuidores.Get parData, [FromHeader(Name = "ProductoID")] int producto, [FromHeader(Name = "EmpresaId")] int empresa)
        {
            try
            {
                parData.ProductoID = producto;
                var GlobalRelacion = await DBContext.database.QueryAsync<VariablesGlobales>("WHERE  (varName = @0)", "Bloqueo_Relaciones").FirstOrDefaultAsync();
                var productoBloqueo = await DBContext.database.QueryAsync<Productos>("WHERE  (ProductoID = @0)", parData.ProductoID).FirstOrDefaultAsync();
                bool bloqueo_relacion = false;
                if (GlobalRelacion.varValue.ToString() == "1" || productoBloqueo.Relacionesbloqueadas == true)
                {
                    bloqueo_relacion = true;
                }

                if (bloqueo_relacion)
                {
                    var bonificaciones2 = new ArrayList();
                    var relaciones2 = new ArrayList();
                    var detalleLineaCredito2 = new
                    {
                        valesColocados = 0,
                        importeLineaCredito = 0,
                        capitalLineaCredito = 0,
                        interesLineaCredito = 0,
                        seguroLineaCredito = 0,
                        saldoActualLineaCredito = 0,
                        importePagoLineaCredito = 0,
                        saldoAbonadoLineaCredito = 0,
                        saldoAtrasadoLineaCredito = 0,
                        diasAtrasoLineaCredito = 0
                    };
                    var detallePrestamoPersonal2 = new
                    {

                        numPrestamos = 0,
                        importePrestamoPersonal = 0,
                        capitalPrestamoPersonal = 0,
                        interesPrestamoPersonal = 0,
                        seguroPrestamoPersonal = 0,
                        saldoActualPrestamoPersonal = 0,
                        importePagoPrestamoPersonal = 0,
                        saldoAbonadoPrestamoPersonal = 0,
                        saldoAtrasadoPrestamoPersonal = 0,
                        diasAtrasoPrestamoPersonal = 0
                    };
                    var prontoPago2 = new
                    {
                        PagoTotal = (decimal)0,
                        PagoComision = (decimal)0,
                        SaldoPlazo = (decimal)0

                    };
                    var data2 = new
                    {
                        bonificaciones = bonificaciones2,
                        relaciones = relaciones2,
                        detalleLineaCredito = detalleLineaCredito2,
                        detallePrestamoPersonal = detallePrestamoPersonal2,
                        prontoPago = prontoPago2,
                        bloqueoRelaciones = bloqueo_relacion
                    };

                    var res3 = new
                    {
                        resultCode = 0,
                        resultDesc = "OK.",
                        data = data2
                    };

                    await DBContext.Destroy();

                    return Ok(res3);
                }




                parData.EmpresaId = empresa;
                var ProdPresP = (empresa == 6) ? await DBContext.database.QueryAsync<VariablesGlobales>("WHERE  (varName = @0)", "PROD_PREST_PERSONAL_PS").FirstOrDefaultAsync() : await DBContext.database.QueryAsync<VariablesGlobales>("WHERE  (varName = @0)", "PROD_PREST_PERSONAL_CV").FirstOrDefaultAsync();
                parData.ProductoPrestamoID = int.Parse(ProdPresP.varValue.ToString());

                var Distribuidor = await DBContext.database.QueryAsync<AppDistribuidores_VW>("WHERE (DistribuidorID = @DistribuidorID) AND (ProductoID = @ProductoID)", parData).SingleOrDefaultAsync();
                var Distribuidor2 = await DBContext.database.QueryAsync<Distribuidores_VW>("WHERE (DistribuidorID = @DistribuidorID) AND (ProductoID = @ProductoID)", parData).SingleOrDefaultAsync();
                var RelacionCortes = await DBContext.database.QueryAsync<AppRelacionCortes_VW>("WHERE (DistribuidorID = @0) AND (ProductoID = @1)", parData.DistribuidorID, producto).SingleOrDefaultAsync();
                var ContratoVale = await DBContext.database.QueryAsync<AppContratos_VW>("WHERE (DistribuidorID = @DistribuidorID) AND (Activo = 1) AND (ProductoID = @ProductoID)", parData).SingleOrDefaultAsync();
                var PrestamoPersonal = await DBContext.database.QueryAsync<AppContratos_VW>("WHERE (DistribuidorID = @DistribuidorID) AND (Activo = 1) AND (ProductoID = @ProductoPrestamoID) AND (EmpresaId = @EmpresaId)", parData).SingleOrDefaultAsync();
                var Vales = await DBContext.database.FetchAsync<AppValesDistribuidor_VW>("WHERE (EstatusValera = 'C') AND (DistribuidorID = @0) AND (ProductoID = @1)", parData.DistribuidorID, producto);
                var RelacionCortesDet = await DBContext.database.QueryAsync<decimal>("SELECT SUM (rcd.InteresPlazo  + rcd.CapitalPlazo ) FROM Cortes.RelacionCortesDetalle rcd WHERE rcd.fechaCorte = @0 AND rcd.DistribuidorID = @1 AND rcd.ComisionesId > 0", RelacionCortes.fechaCorte, parData.DistribuidorID).SingleOrDefaultAsync();
                var RelacionCortesSaldo = await DBContext.database.QueryAsync<decimal>("SELECT SUM (rcd.saldoPlazo) FROM Cortes.RelacionCortesDetalle rcd WHERE rcd.fechaCorte = @0 AND rcd.DistribuidorID = @1", RelacionCortes.fechaCorte, parData.DistribuidorID).SingleOrDefaultAsync();

                RelacionCortesTablaDias_VW[] RelacionCortesTablaDias = null;


                string fechaCorteString = RelacionCortes == null ? DateTime.Now.ToString("yyyy-MM-dd") : RelacionCortes.fechaCorte.ToString().Substring(0, 10);
                string formato = "dd/MM/yyyy";
                int format = 0;
                DateTime fecha = DateTime.ParseExact(fechaCorteString, formato, CultureInfo.InvariantCulture);
                int diasmes = DateTime.DaysInMonth(fecha.Year, fecha.Month);
                if (fecha.Day == 23 && diasmes == 31)
                {
                    format = 14;
                }
                else
                {
                    format = 13;
                }

                var parm = new
                {
                    parData.ProductoID,
                    parData.DistribuidorID,
                    DistribuidorNivelID = Distribuidor2.DistribuidorNivelID,
                    fecha = fechaCorteString,
                    Distribuidor.SucursalID,
                    DistribuidorNivelIDOrigen = Distribuidor2.DistribuidorNivelOrigenID,
                    formato = format

                };
                RelacionCortesTablaDias = await DBContext.database.QueryAsync<RelacionCortesTablaDias_VW>(@"SELECT top 4 * 
                                            FROM Cortes.RelacionCortesTablaDias_VW 
                                            WHERE (fechaCorte = CONVERT(DATETIME, @fecha, 103)) 
                                            AND (DistribuidorNivelID = @DistribuidorNivelID) 
                                            AND (DistribuidorNivelIDOrigen = @DistribuidorNivelIDOrigen) 
                                            AND (Renglon between 10 AND @formato) 
                                            AND (ProductoID = @ProductoID) 
                                            AND (SucursalID = @SucursalID)", parm).ToArrayAsync();

                var bonificaciones = new ArrayList();

                if (RelacionCortesTablaDias != null && RelacionCortesTablaDias.Length > 0)
                {
                    foreach (var RelacionCorteTablaDia in RelacionCortesTablaDias)
                    {
                        if (RelacionCortesSaldo > 0.9m && RelacionCorteTablaDia != null)
                        {
                            bonificaciones.Add(new
                            {
                                FechaPago = RelacionCorteTablaDia.FechaPago.Value.ToString("yyyy-MM-dd"),
                                Porcentaje = RelacionCorteTablaDia.PorcComision,
                                Bonificacion = (RelacionCorteTablaDia.PorcComision * RelacionCortesDet),
                                Pago = (RelacionCortesSaldo - (RelacionCorteTablaDia.PorcComision * RelacionCortesDet))
                            });
                        }
                        else
                        {
                            bonificaciones.Add(new
                            {
                                FechaPago = DateTime.Now.ToString("yyyy-MM-dd"),
                                Porcentaje = 0,
                                Bonificacion = 0,
                                Pago = 0
                            });
                        }

                    }
                }

                var relaciones = new ArrayList();

                if (RelacionCortes != null)
                {
                    relaciones.Add(new
                    {

                        RelacionCortes.fechaCorte,
                        RelacionCortes.fechaRelacion,
                        RelacionCortes.limiteCredito,
                        RelacionCortes.saldoColocado,
                        RelacionCortes.saldoDisponible,
                        importeTotal = RelacionCortes.capital + RelacionCortes.interes + RelacionCortes.seguro, //+ RelacionCortes.ManejoCuentaPlazo + RelacionCortes.CargoPlazo + RelacionCortes.IvaPlazo,
                        RelacionCortes.capital,
                        RelacionCortes.interes,
                        RelacionCortes.seguro,
                        RelacionCortes.SaldoActual,
                        RelacionCortes.importePago,
                        RelacionCortes.saldoAbonado,
                        RelacionCortes.saldoAtrasado,
                        RelacionCortes.DiasAtraso

                    });
                }

                var detalleLineaCredito = new
                {
                    valesColocados = (Vales != null) ? Vales.Count() : 0,
                    importeLineaCredito = (ContratoVale != null) ? ContratoVale.ImporteTotal : 0,
                    capitalLineaCredito = (ContratoVale != null) ? ContratoVale.Capital : 0,
                    interesLineaCredito = (ContratoVale != null) ? ContratoVale.Interes : 0,
                    seguroLineaCredito = (ContratoVale != null) ? ContratoVale.Seguro : 0,
                    saldoActualLineaCredito = (ContratoVale != null) ? ContratoVale.SaldoActual : 0,
                    importePagoLineaCredito = (ContratoVale != null) ? ContratoVale.CargoPagado + ContratoVale.SeguroPagado + ContratoVale.CapitalPagado + ContratoVale.InteresPagado + ContratoVale.ManejoCuentaPagado : 0,
                    saldoAbonadoLineaCredito = (ContratoVale != null) ? ContratoVale.Abonos : 0,
                    saldoAtrasadoLineaCredito = (ContratoVale != null) ? ContratoVale.SaldoAtrasado : 0,
                    diasAtrasoLineaCredito = (ContratoVale != null) ? ContratoVale.DiasAtraso : 0
                };

                var detallePrestamoPersonal = new
                {
                    numPrestamos = (PrestamoPersonal != null) ? PrestamoPersonal.NoCreditosActivos : 0,
                    importePrestamoPersonal = (PrestamoPersonal != null) ? PrestamoPersonal.ImporteTotal : 0,
                    capitalPrestamoPersonal = (PrestamoPersonal != null) ? PrestamoPersonal.Capital : 0,
                    interesPrestamoPersonal = (PrestamoPersonal != null) ? PrestamoPersonal.Interes : 0,
                    seguroPrestamoPersonal = (PrestamoPersonal != null) ? PrestamoPersonal.Seguro : 0,
                    saldoActualPrestamoPersonal = (PrestamoPersonal != null) ? PrestamoPersonal.SaldoActual : 0,
                    importePagoPrestamoPersonal = (PrestamoPersonal != null) ? PrestamoPersonal.CargoPagado + PrestamoPersonal.SeguroPagado + PrestamoPersonal.CapitalPagado + PrestamoPersonal.InteresPagado + PrestamoPersonal.ManejoCuentaPagado : 0,
                    saldoAbonadoPrestamoPersonal = (PrestamoPersonal != null) ? PrestamoPersonal.Abonos : 0,
                    saldoAtrasadoPrestamoPersonal = (PrestamoPersonal != null) ? PrestamoPersonal.SaldoAtrasado : 0,
                    diasAtrasoPrestamoPersonal = (PrestamoPersonal != null) ? PrestamoPersonal.DiasAtraso : 0
                };
                var obj = new
                {
                    ProductoId = parData.ProductoID,
                    DistribuidorId = parData.DistribuidorID,
                    SucursalId = Distribuidor.SucursalID,
                    CuentaId = 0,
                    Importe = 0,
                    FechaPago = DateTime.Now,
                    UsuarioId = parData.DistribuidorID,
                    CodigoAut = "",
                    GenPPI = 0,
                };
                string Stored = "EXEC AppVale.pa_SaldosRelacionDistribuidor @ProductoId, @DistribuidorId, @SucursalId, @CuentaId, @FechaPago, @Importe, @UsuarioId, @CodigoAut, @GenPPI";
                var res2 = await DBContext.database.QueryAsync<AplicaPagoRes>(Stored, obj).FirstOrDefaultAsync();

                var prontoPago = new
                {
                    PagoTotal = res2.PagoTotal != null ? res2.PagoTotal : (decimal)0,
                    PagoComision = res2.PagoComision != null ? res2.PagoComision : (decimal)0,
                    SaldoPlazo = res2.saldoPlazo != null ? res2.saldoPlazo : (decimal)0

                };


                var data = new
                {
                    bonificaciones,
                    relaciones,
                    detalleLineaCredito,
                    detallePrestamoPersonal,
                    prontoPago
                };

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                await DBContext.Destroy();

                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }

        }

        [HttpPost]
        [Route("getFoliosDigitales")]
        [Authorize]
        //// [Code.TProteccionProducto]
        ////[Code.TProteccionAppVales]
        public async Task<IActionResult> GetFoliosDigitales(PeticionesRest.AppValePeticiones.AppDistribuidores.GetFolios parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var Usuario = await DBContext.database.QueryAsync<UsuariosVW>("WHERE  (UsuarioID = @0) AND (Estatus = 1)", UserName).FirstOrDefaultAsync();

                var Cajas = await DBContext.database.QueryAsync<CatalogoCajas>("WHERE (UsuarioID = @0) AND (Estatus = 1)", Usuario.UsuarioID).FirstOrDefaultAsync();

                parData.SucursalID = Cajas.SucursalID;

                parData.Folio += "%";
                var res = await DBContext.database.FetchAsync<AppValesDistribuidor_VW>("SELECT TOP (100) * FROM  AppVale.AppValesDistribuidor_VW WHERE (ProductoID = @ProductoID) AND (AsignaSucursalId = @SucursalID) AND (Estatus = 'A') AND (ValeDigital = 1) AND (CAST(Folio AS varchar(MAX)) LIKE @Folio) ORDER BY Folio", parData);
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }

        }

        [HttpPost]
        [Route("getQrDistribuidor")]
        [Authorize]

        public async Task<IActionResult> getQrDistribuidor(ConfiaWebApi.PeticionesRest.Distribuidores.Distribuidor.QRGet parData, [FromHeader(Name = "ProductoID")] int productoID)
        {

            try
            {

                string Stored = "EXEC AppVale.pa_QR_Socia @ProductoID ,@DistribuidorID";

                var data = await DBContext.database.QueryAsync<AppValeQR>(Stored, parData).FirstOrDefaultAsync();
                await DBContext.Destroy();

                return Ok(new
                {
                    resultCode = 0,
                    resultDesc = "Ok.",
                    data
                });
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(new
                {
                    resultCode = -2,
                    resultDesc = ex.Message,
                    data = new AppValeQR { }
                });
            }

        }
        [HttpPost]
        [Route("VerificarAtraso")]
        [Authorize]
        public async Task<IActionResult> VerificarAtraso(PeticionesRest.Distribuidores.Distribuidor.ValidaAtraso parData)
        {

            try
            {
                var Distribuidor = await DBContext.database.QueryAsync<DistribuidoresRelaciones>("WHERE DistribuidorID = @0", parData.DistribuidorID).FirstOrDefaultAsync();

                if (Distribuidor == null)
                {
                    await DBContext.Destroy();
                    return BadRequest(new
                    {
                        resultCode = -2,
                        resultDesc = "Distribuidor Not Found",
                        data = new { }
                    });
                }

                return Ok(new
                {
                    resultCode = 0,
                    resultDesc = "Oks.",
                    data = new
                    {
                        atraso = Distribuidor.CortesAtrasados > 0
                    }
                });
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(new
                {
                    resultCode = -2,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }

        }


        [HttpPost]
        [Route("actualizarFotoPerfil")]
        [Authorize]
        // [Code.TProteccionProducto]
        // [Code.TProteccionAppVales]
        public async Task<IActionResult> ActualizarFotoPerfil(PeticionesRest.Distribuidores.Distribuidor.UpdateImageDistribuidora parData)
        {

            try
            {
                var Distribuidor = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Distribuidores.Distribuidores>(parData.Id);
                Distribuidor.DistribuidorImagen = parData.Image;
                await DBContext.database.UpdateAsync(Distribuidor);
                await DBContext.Destroy();
                return Ok(Distribuidor);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }

        }

        [HttpPost]
        [Route("descargarelacion")]
        // [Code.TProteccionProducto]
        // [Code.TProteccionAppVales]
        [Authorize]
        //public async Task<IActionResult> Print(PeticionesRest.Cortes.Relacion.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        //public async Task<IActionResult> DescargaRelacion(PeticionesRest.AppValePeticiones.AppDistribuidores.GetRelacion parData, [FromHeader(Name = "ProductoID")] int producto, [FromHeader(Name = "EmpresaId")] int empresa)
        public async Task<IActionResult> DescargaRelacion(PeticionesRest.Cortes.Relacion.Get parData, [FromHeader(Name = "ProductoID")] int producto, [FromHeader(Name = "EmpresaId")] int empresa)
        {

            try
            {
                var RelacionBloqueada = await DBContext.database.QueryAsync<VariablesGlobales>("WHERE varName = 'Bloqueo_Relaciones'", parData).SingleOrDefaultAsync();
                string bloquedo = RelacionBloqueada.varValue.ToString();
                var UserName2 = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual2 = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName2).FirstOrDefaultAsync();
                parData.DistribuidorID = parData.Distribuidores[0];
                //  parData.formato = 1;
                if (bloquedo == "0" || UsuarioActual2.MasterUser == true)
                {
                    DBContext.database.CommandTimeout = 9999;
                    parData.ProductoID = producto;
                    var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                    var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                    var Producto = await DBContext.database.SingleOrDefaultByIdAsync<Productos>(parData.ProductoID);

                    if (Producto.Relacionesbloqueadas == true & UsuarioActual2.MasterUser == false)
                    {
                        throw new Exception("RELACIONES BLOQUEADAS");
                    }
                    else
                    {
                        var ProductoTiendita = await DBContext.database.QueryAsync<Productos>("WHERE EmpresaId = @0 AND Tiendita = 1", Producto.EmpresaId).SingleOrDefaultAsync();
                        var ProductoPrestamoPersonal = await DBContext.database.QueryAsync<Productos>("WHERE EmpresaId = @0 AND PrestamoPersonal = 1", Producto.EmpresaId).SingleOrDefaultAsync();
                        var Sucursal = await DBContext.database.QueryAsync<Sucursales_VW>("WHERE SucursalID = @SucursalID", parData).SingleOrDefaultAsync();
                        if (Sucursal != null && Sucursal.Eslogan != null)
                        {
                            byte[] bytes = System.Text.Encoding.Default.GetBytes(Sucursal.Eslogan);
                            Sucursal.Eslogan = System.Text.Encoding.UTF8.GetString(bytes);
                            Sucursal.Eslogan = HttpUtility.HtmlEncode(Sucursal.Eslogan);
                        }

                        //var RelacionCortes = await DBContext.database.QueryAsync<RelacionCortes_VW>("WHERE (ProductoID = @0) AND (SucursalID = @1) AND (fechaCorte = CONVERT(DATETIME, @2, 103)) AND DistribuidorID IN (@3)", parData.ProductoID, parData.SucursalID, parData.fecha, parData.Distribuidores).OrderBy(x => x.DistribuidorID).ToArrayAsync();
                        // var RelacionCortesDetalle = await DBContext.database.QueryAsync<RelacionCortesDetalle2_VW>("WHERE (SucursalID = @0) AND (DistribuidorID IN (@1)) AND (saldoPlazo >= 0) AND (fechaCorte = CONVERT(DATETIME, @2, 103)) ORDER BY CreditoID, PagoPlazo ASC ", parData.SucursalID, parData.Distribuidores, parData.fecha, producto).OrderBy(x => x.DistribuidorID).ToArrayAsync();

                        string listaDist = string.Join(",", parData.Distribuidores);
                        var RelacionCortes = await DBContext.database.QueryAsync<RelacionesCortesData>("EXEC Cortes.getRelacionesCorteNuevo @0, @1, @2, @3", parData.fecha, parData.SucursalID, parData.ProductoID, listaDist).ToArrayAsync();
                        var Corresponsales = await DBContext.database.FetchAsync<Corresponsales_VW>("WHERE (Activo = 1)");

                        var token = JsonConvert.DeserializeObject<Auth>(ConfiaShop.LealtadAuth("jjaramillo@fconfia.com", "jjaramillo"));

                        var variale = await DBContext.database.QueryAsync<VariablesGlobales>("WHERE  (varName = @0)", "RELACIONES_LIMITE_DETALLE_NUEVO").FirstOrDefaultAsync();
                        var costGlobal = await DBContext.database.QueryAsync<VariablesGlobales>("WHERE varName ='VALERAS_COSTO'").SingleOrDefaultAsync();
                        var DscDistribuidor = await DBContext.database.QueryAsync<VariablesGlobales>("WHERE (varName = @0)", "DESCRIPCION_DISTRIBUIDOR").FirstOrDefaultAsync();

                        int limiteReg = int.Parse(variale.varValue.ToString());

                        // Generamos un prefijo del nombre de archivo
                        var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");
                        var listado_archivos = new List<string>();
                        var listado_imagenes = new List<string>();
                        var Count = 0;

                        var colorDocumento = "";
                        var nombreTiendita = "";
                        var nombreConfiaHome = "";
                        var nombreTienditaEncabezado = "";
                        var nombreConfiaHomeEncabezado = "";
                        var esVision = false;
                        var estiloCampaniaCancun = "";
                        var datosImproductivos = "";
                        var datosCancun2025 = "";
                        var IMAGENBANNER = "";
                        var SucursalesCampaniaCancun2025 = await DBContext.database.QueryAsync<dynamic>("EXEC Cortes.SucursalesCampaniaCancun2025").ToArrayAsync();
                        var SociasImp2025 = await DBContext.database.QueryAsync<dynamic>("EXEC Cortes.ObtenerSociasImp2025").ToArrayAsync();
                        switch (Producto.EmpresaId)
                        {
                            case 9:
                                IMAGENBANNER = "BANNERPRESTASTAR2.jpg";
                                nombreTienditaEncabezado = "Tienda Estelar";
                                nombreTiendita = nombreTienditaEncabezado;
                                nombreConfiaHomeEncabezado = "StarShop";
                                nombreConfiaHome = "Cr&eacute;dito " + nombreConfiaHomeEncabezado;
                                DscDistribuidor.varValue = "Estrella";
                                colorDocumento = "#BE56BE";
                                estiloCampaniaCancun = "";
                                break;
                            case 10:
                            case 15:
                                nombreTienditaEncabezado = "Tiendita";
                                nombreTiendita = nombreTienditaEncabezado;
                                nombreConfiaHomeEncabezado = "";
                                nombreConfiaHome = nombreConfiaHomeEncabezado;
                                colorDocumento = "#F7944C";
                                esVision = true;
                                estiloCampaniaCancun = "";
                                break;
                            case 16:
                                nombreTienditaEncabezado = "La Tiendita";
                                nombreTiendita = nombreTienditaEncabezado;
                                nombreConfiaHomeEncabezado = "ConfiaHome";
                                nombreConfiaHome = "Cr&eacute;dito " + nombreConfiaHomeEncabezado;
                                colorDocumento = "#1DA1F2";
                                estiloCampaniaCancun = "";
                                break;
                            default:
                                colorDocumento = "#1DA1F2";
                                estiloCampaniaCancun = "";
                                break;
                        }

                        var logo = Producto.Logo;

                        Guid g = Guid.NewGuid();

                        var logoname = string.Concat("logo", "_" + g.ToString() + ".jpeg");

                        await System.IO.File.WriteAllBytesAsync(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "LogoImg", logoname), logo);

                        listado_imagenes.Add(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "LogoImg", logoname));

                        NumberFormatInfo nfi = new CultureInfo(CultureInfo.CurrentCulture.ToString(), false).NumberFormat;
                        nfi.PercentDecimalDigits = 0;

                        string fechaCorteString = parData.fecha;
                        string formato = "dd/MM/yyyy";
                        DateTime fecha = DateTime.ParseExact(fechaCorteString, formato, CultureInfo.InvariantCulture);
                        int diasmes = DateTime.DaysInMonth(fecha.Year, fecha.Month);

                        var formato2 = parData.formato;
                        if (parData.tipo == 1)
                        {
                            if (parData.formato == 1)
                            {
                                if (fecha.Day == 23 && diasmes == 31)
                                {
                                    parData.formato = 14;
                                }
                                else
                                {
                                    parData.formato = 13;
                                }
                            }

                            else if (parData.formato == 2)
                            {
                                if (fecha.Day == 23 && diasmes == 31)
                                {
                                    parData.formato = 17;
                                }
                                else
                                {
                                    parData.formato = 16;
                                }
                            }
                            else
                            {
                                if (fecha.Day == 23 && diasmes == 31)
                                {
                                    parData.formato = 21;
                                }
                                else
                                {
                                    parData.formato = 20;
                                }
                            }

                            // CICLO FOR CONTENIENDO LA CABECERA RELACION CORTE DE LOS DVS SELECCIONADOS
                            foreach (var RelacionCorte in RelacionCortes)
                            {
                                var sucursalValidar = RelacionCorte.SucursalID;
                                var sociaIDValidar = RelacionCorte.DistribuidorID;
                                var colocado = SociasImp2025.FirstOrDefault(item => item.DistribuidorID == sociaIDValidar);
                                datosImproductivos = "";
                                datosCancun2025 = "";
                                if (SociasImp2025.Any(s => s.DistribuidorID == sociaIDValidar))
                                {
                                    IMAGENBANNER = "BANNERIMPRODUCTIVAS.jpg";
                                    datosImproductivos = "<p style=\"position: absolute; left: 115px; top: 200px; margin: 0;\">" + sociaIDValidar.ToString() + "</p>" +
                             "<br>" +
                             "<p style=\"position: absolute; left: 115px; top: 240px; margin: 0;\">" + colocado.Colocado.ToString() + "</p>";
                                    IMAGENBANNER = "BANNERIMPRODUCTIVAS.jpg";

                                }

                                if (SucursalesCampaniaCancun2025.Any(s => s.SucursalID == sucursalValidar))
                                {
                                    datosCancun2025 = "<p style=\"position: absolute; left: 205px; top: 1165px; margin: 0;\">" + sociaIDValidar.ToString() + "</p>" +
                            "<br>" +
                            "<p style=\"position: absolute; left: 600px; top: 1165px; margin: 0;\">0.00</p>";
                                    estiloCampaniaCancun = "" +
                                    ".imageDIV2 {" +
                                        "page-break-inside: avoid;" +
                                        "break-inside: avoid;" +
                                        "position: relative;" +
                                        "width: 100%;" +
                                        "height: 100%;" +
                                        "overflow: hidden;" +
                                    "}" +

                                    ".imageDIV2::before {" +
                                        "border-radius: 25px;" +
                                        "content: \"\";" +
                                        "position: absolute;" +
                                        "top: 0;" +
                                        "left: 0;" +
                                        "width: 100%;" +
                                        "height: 100%;" +
                                        "background: url(\"https://@@SERVER/pdf/CampanaCancun.jpeg\");" +
                                        "background-repeat: no-repeat;" +
                                        "background-position: center;" +
                                        "background-size: 100% 100%;" +
                                        "opacity: 1;" +
                                        "z-index: 1;" +
                                        "transform: scale(1);" +
                                        "overflow: hidden;" +
                                    "}";
                                }

                                parData.DistribuidorID = RelacionCorte.DistribuidorID;

                                var LineaCredito = await DBContext.database.QueryAsync<Contratos_VW>("WHERE DistribuidorID=@0 AND Principal=1", RelacionCorte.DistribuidorID).FirstOrDefaultAsync();
                                var LineaCreditoPrestamo = await DBContext.database.QueryAsync<Contratos_VW>("WHERE DistribuidorID=@0 AND ProductoID=@1", RelacionCorte.DistribuidorID, ProductoPrestamoPersonal.ProductoID).FirstOrDefaultAsync();
                                var LineaCreditoTiendita = await DBContext.database.QueryAsync<Contratos_VW>("WHERE DistribuidorID=@0 AND ProductoID=@1", RelacionCorte.DistribuidorID, ProductoTiendita.ProductoID).FirstOrDefaultAsync();

                                if (RelacionCorte != null)
                                {
                                    Count++;
                                    parData.DistribuidorNivelID = RelacionCorte.DistribuidorNivelID.Value;
                                    parData.DistribuidorNivelIDOrigen = RelacionCorte.DistribuidorNivelIDOrigen.Value;
                                    // var RelacionCortesTablaDias = formato2 == 1 ? await DBContext.database.FetchAsync<RelacionCortesTablaDias_VW>("SELECT top 4 * FROM Cortes.RelacionCortesTablaDias_VW WHERE  (fechaCorte = CONVERT(DATETIME, @fecha, 103)) AND (DistribuidorNivelID = @DistribuidorNivelID) AND (DistribuidorNivelIDOrigen = @DistribuidorNivelIDOrigen) AND (Renglon between 10 and @formato) AND (ProductoID = @ProductoID) AND (SucursalID = @SucursalID)", parData) : formato2 == 2 ? await DBContext.database.FetchAsync<RelacionCortesTablaDias_VW>("SELECT top 7 * FROM Cortes.RelacionCortesTablaDias_VW WHERE  (fechaCorte = CONVERT(DATETIME, @fecha, 103)) AND (DistribuidorNivelID = @DistribuidorNivelID) AND (DistribuidorNivelIDOrigen = @DistribuidorNivelIDOrigen) AND (Renglon between 10 and @formato) AND (ProductoID = @ProductoID) AND (SucursalID = @SucursalID)", parData) : await DBContext.database.FetchAsync<RelacionCortesTablaDias_VW>("SELECT top 9 * FROM Cortes.RelacionCortesTablaDias_VW WHERE  (fechaCorte = CONVERT(DATETIME, @fecha, 103)) AND (DistribuidorNivelID = @DistribuidorNivelID) AND (DistribuidorNivelIDOrigen = @DistribuidorNivelIDOrigen) AND (Renglon between 10 and @formato) AND (ProductoID = @ProductoID) AND (SucursalID = @SucursalID)", parData);
                                    //CambioParaDiasRelacion
                                    List<RelacionCortesTablaDias_VW> RelacionCortesTablaDias = null;
                                    switch (formato2)
                                    {
                                        case 1:
                                            RelacionCortesTablaDias = await DBContext.database.FetchAsync<RelacionCortesTablaDias_VW>(@"SELECT top 4 * 
                                            FROM Cortes.RelacionCortesTablaDias_VW 
                                            WHERE (fechaCorte = CONVERT(DATETIME, @fecha, 103)) 
                                            AND (DistribuidorNivelID = @DistribuidorNivelID) 
                                            AND (DistribuidorNivelIDOrigen = @DistribuidorNivelIDOrigen) 
                                            AND (Renglon between 10 AND @formato) 
                                            AND (ProductoID = @ProductoID) 
                                            AND (SucursalID = @SucursalID)", parData);
                                            break;
                                        case 2:
                                            RelacionCortesTablaDias = await DBContext.database.FetchAsync<RelacionCortesTablaDias_VW>(@"SELECT top 7 * 
                                            FROM Cortes.RelacionCortesTablaDias_VW 
                                            WHERE (fechaCorte = CONVERT(DATETIME, @fecha, 103)) 
                                            AND (DistribuidorNivelID = @DistribuidorNivelID) 
                                            AND (DistribuidorNivelIDOrigen = @DistribuidorNivelIDOrigen) 
                                            AND (Renglon between 10 AND @formato) 
                                            AND (ProductoID = @ProductoID) 
                                            AND (SucursalID = @SucursalID)", parData);
                                            break;
                                        case 3:
                                            RelacionCortesTablaDias = await DBContext.database.FetchAsync<RelacionCortesTablaDias_VW>(@"SELECT top 9 * 
                                            FROM Cortes.RelacionCortesTablaDias_VW WHERE (fechaCorte = CONVERT(DATETIME, @fecha, 103)) 
                                            AND (DistribuidorNivelID = @DistribuidorNivelID) 
                                            AND (DistribuidorNivelIDOrigen = @DistribuidorNivelIDOrigen) 
                                            AND (Renglon between 11 AND @formato)
                                            AND (ProductoID = @ProductoID) 
                                            AND (SucursalID = @SucursalID)", parData);
                                            break;
                                        default:
                                            throw new Exception("FORMATO NO VALIDO");
                                    }
                                    var RelacionCorteTablaDiasFirst = RelacionCortesTablaDias[0];
                                    var monederoSociaFromSP = await DBContext.database.QueryAsync<MonederoSocia>("EXEC Cortes.GetMonederoSocia @0, @1", RelacionCorte.DistribuidorID, RelacionCorte.SucursalID).ToArrayAsync();

                                    UsuarioActual.Nombre = HttpUtility.HtmlEncode(UsuarioActual.Nombre);
                                    // SE EMPIEZA A REEMPLAZAR LAS VARIABLES DE LA PLANTILLA DEL HTML
                                    var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Relacion", "RelacionCortePag1.html"));
                                    html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                                    html = html.Replace("@@IMPRIMIO", UsuarioActual.Nombre.ToString());
                                    html = html.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                                    html = html.Replace("@@ID_DIST", RelacionCorte.DistribuidorID.ToString());
                                    if (RelacionCorte != null && RelacionCorte.NombreCompleto != null)
                                    {
                                        byte[] bytes = System.Text.Encoding.Default.GetBytes(RelacionCorte.NombreCompleto);
                                        RelacionCorte.NombreCompleto = System.Text.Encoding.UTF8.GetString(bytes);
                                        RelacionCorte.NombreCompleto = HttpUtility.HtmlEncode(RelacionCorte.NombreCompleto);
                                    }
                                    html = html.Replace("@@NOMBRE_DIST", RelacionCorte.NombreCompleto.ToUpper());
                                    html = html.Replace("@@TELEFONO_DIST", RelacionCorte.TelefonoMovil);
                                    html = html.Replace("@@FECHA_CORTE", RelacionCorte.fechaCorte);
                                    if (RelacionCorte?.FechaVencimiento != null)
                                    {
                                        DateOnly fechaVencimiento = DateOnly.FromDateTime(RelacionCorte.FechaVencimiento.Value);
                                        fechaVencimiento = fechaVencimiento.AddDays(-5);
                                        html = html.Replace("@@FECHA_LIMITE", fechaVencimiento.ToString("dd/MM/yyyy"));
                                    }
                                    else
                                    {
                                        html = html.Replace("@@FECHA_LIMITE", "");
                                    }
                                    decimal acumuladoValue = 0m;

                                    // Accumulate values if the result is not null
                                    if (monederoSociaFromSP != null)
                                    {
                                        foreach (var item in monederoSociaFromSP)
                                        {
                                            if (decimal.TryParse(item.Monedero, out decimal parsedValue))
                                            {
                                                acumuladoValue += parsedValue;
                                            }
                                        }
                                    }

                                    // Replace @@ACUMULADO in the HTML string with the formatted currency value
                                    html = html.Replace("@@ACUMULADO", acumuladoValue.ToString("C", CultureInfo.CurrentCulture));

                                    html = html.Replace("@@AHORRO", "$0.00");
                                    html = html.Replace("@@DISPONIBLE", LineaCredito.LineaCreditoDisponible.Value.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@LINEAPRESTAMO", LineaCreditoPrestamo.LineaCreditoDisponible.Value.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@LINEATIENDITA", LineaCreditoTiendita.LineaCreditoDisponible.Value.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@NOMBREENCABEZADOTIENDITA", nombreTienditaEncabezado);
                                    html = html.Replace("@@NOMBREENCABEZADOCONFIAHOME", nombreConfiaHomeEncabezado);

                                    html = html.Replace("@@DscDist", DscDistribuidor.varValue.ToString());
                                    html = html.Replace("@@LOGO", logoname);
                                    html = html.Replace("@@ESLOGAN", Sucursal.Eslogan == null ? "" : Sucursal.Eslogan);
                                    html = html.Replace("@@COLOR", colorDocumento);
                                    if (Count == 1)
                                    {
                                        html = html.Replace("@@JQUERY", "<script type=\"text/javascript\" src=\"https://code.jquery.com/jquery.min.js\"></script>");
                                    }
                                    else
                                    {
                                        html = html.Replace("@@JQUERY", "");
                                    }

                                    var registros_detalle_producto_principal = 0;
                                    decimal pagoT = 0;
                                    decimal pagoCom = 0;
                                    decimal importe = 0;
                                    decimal saldo = 0;
                                    decimal pago = 0;
                                    decimal remanente = 0;

                                    decimal importeCreditosPersonales = 0;
                                    decimal importeAtrasoCreditosPersonales = 0;
                                    decimal saldoCreditosPersonales = 0;
                                    decimal pagoCreditosPersonales = 0;
                                    decimal remanenteCreditosPersonales = 0;

                                    decimal proteccionCorte = 0;
                                    decimal totalCobranza = 0;

                                    decimal cobroValera = 0;
                                    decimal cobroFaltante = 0;
                                    decimal saldoFavor = 0;
                                    decimal creditoTienditaTotal = 0;
                                    decimal creditoPrestamoConfiaHome = 0;

                                    string tabla_creditosPersonales = "";
                                    tabla_creditosPersonales += "<div class=\"d-table-row\" style=\"width: 100%\">";
                                    tabla_creditosPersonales += "  <div class=\"text-center d-table-cell\">";
                                    tabla_creditosPersonales += "    <figure class=\"text-center\">";
                                    tabla_creditosPersonales += "      <div";
                                    tabla_creditosPersonales += "        class=\"card-subtitle\"";
                                    tabla_creditosPersonales += "        style=\"color: black; background-color:" + colorDocumento + "\"";
                                    tabla_creditosPersonales += "      >";
                                    tabla_creditosPersonales += "        <h8><strong>Cr&eacute;ditos Personales</strong></h8>";
                                    tabla_creditosPersonales += "      </div>";
                                    tabla_creditosPersonales += "      <table class=\"table table-sm\" style=\"border: #ffffff; width: 100%;font-size: 12px\">";
                                    tabla_creditosPersonales += "        <thead>";
                                    tabla_creditosPersonales += "          <tr>";
                                    tabla_creditosPersonales += "            <th class=\"text-center\">Producto</th>";
                                    tabla_creditosPersonales += "            <th class=\"text-center\">Fecha de cr&eacute;dito</th>";
                                    tabla_creditosPersonales += "            <th class=\"text-center\">NoCda</th>";
                                    tabla_creditosPersonales += "            <th class=\"text-center\">Importe</th>";
                                    tabla_creditosPersonales += "            <th class=\"text-center\">Saldo</th>";
                                    tabla_creditosPersonales += "            <th class=\"text-center\">Atraso</th>";
                                    tabla_creditosPersonales += "            <th class=\"text-center\">Pago Plazo</th>";
                                    tabla_creditosPersonales += "            <th class=\"text-center\">Saldo desp. de pago</th>";
                                    tabla_creditosPersonales += "            <th class=\"text-center\">Plazo</th>";
                                    tabla_creditosPersonales += "          </tr>";
                                    tabla_creditosPersonales += "        </thead>";
                                    tabla_creditosPersonales += "        <tbody>";
                                    tabla_creditosPersonales += "          @@DETALLE_CREDITOS_PERSONALES";
                                    tabla_creditosPersonales += "        </tbody>";
                                    tabla_creditosPersonales += "        <tfoot>";
                                    tabla_creditosPersonales += "          @@FOOTERROWCREDITOSPERSONALES";
                                    tabla_creditosPersonales += "        </tfoot>";
                                    tabla_creditosPersonales += "      </table>";
                                    tabla_creditosPersonales += "    </figure>";
                                    tabla_creditosPersonales += "  </div>";
                                    tabla_creditosPersonales += "</div>";
                                    string tabla_cobranza = "";
                                    tabla_cobranza += "<div class=\"d-table-row\" style=\"width: 100%\">";
                                    tabla_cobranza += "  <div class=\"text-center d-table-cell\">";
                                    tabla_cobranza += "    <figure class=\"text-center\">";
                                    tabla_cobranza += "      <div";
                                    tabla_cobranza += "        class=\"card-subtitle\"";
                                    tabla_cobranza += "        style=\"color: black; background-color:" + colorDocumento + "\"";
                                    tabla_cobranza += "      >";
                                    tabla_cobranza += "        <h8><strong>VALE DE COBRANZA</strong></h8>";
                                    tabla_cobranza += "      </div>";
                                    tabla_cobranza += "      <table class=\"table table-sm\" style=\"border: #ffffff; width: 100%\">";
                                    tabla_cobranza += "        <thead style=\"font-size: 12px\">";
                                    tabla_cobranza += "          <tr>";
                                    tabla_cobranza += "            <th class=\"text-center\">Capital + Inter&eacute;s</th>";
                                    tabla_cobranza += "            <th class=\"text-center\">Complementos (USV + IVA)</th>";
                                    tabla_cobranza += "            <th class=\"text-center\">Tienda CF</th>";
                                    tabla_cobranza += "            <th class=\"text-center\">Total</th>";
                                    tabla_cobranza += "          </tr>";
                                    tabla_cobranza += "        </thead>";
                                    tabla_cobranza += "        <tbody>";
                                    tabla_cobranza += "          @@DETALLE_COBRANZA";
                                    tabla_cobranza += "        </tbody>";
                                    tabla_cobranza += "      </table>";
                                    tabla_cobranza += "    </figure>";
                                    tabla_cobranza += "  </div>";
                                    tabla_cobranza += "</div>";
                                    string footer_tabla_creditos_personales = "";
                                    var fila_relacion_detalle = "";
                                    var fila_relacion_detalle_2 = "";
                                    var fila_creditos_personales = "";
                                    var fila_tabla_cobranza = "";

                                    var relacionCorteFromSP = await DBContext.database.QueryAsync<ParteArribaRelacion>("EXEC Cortes.ParteArribaRelacion @0, @1", RelacionCorte.fechaCorte, RelacionCorte.DistribuidorID).ToArrayAsync();
                                    var detalleProductoPrincipal = relacionCorteFromSP.Where(x => x.EsPersonal == false && x.SaldoPlazo > 0.90m);
                                    var detalleProductoCreditosPersonales = relacionCorteFromSP.Where(x => x.EsPersonal == true && x.SaldoPlazo > 0.90m);

                                    decimal basecomisionCorte = 0;
                                    decimal basecomisionTiendita = 0;
                                    decimal baseComisionTienditaCorteActual = 0;
                                    decimal complementosCorte = 0;
                                    decimal creditoPrestamoPersonal = 0;
                                    decimal interesPagado = 0;
                                    decimal capitalPagado = 0;
                                    decimal otros = 0;
                                    int ultimoCredito = 0;
                                    foreach (var detalle in detalleProductoPrincipal)
                                    {
                                        var CreditoOtraSocia = await DBContext.database.QueryAsync<Creditos_VW>("WHERE ClienteID = @0 AND DistribuidorID != @1", detalle.ClienteID, RelacionCorte.DistribuidorID).FirstOrDefaultAsync();
                                        // var textoMasDeUnVale = CreditoOtraSocia != null ? "Si" : "";
                                        var textoMasDeUnVale = "";
                                        var PlanPagosDetalle = await DBContext.database.QueryAsync<PlanPagos>("WHERE CreditoID = @0 AND NoPago = @1", detalle.CreditoID, detalle.NoPago).FirstOrDefaultAsync();

                                        decimal baseComisionUnitario = detalle.CapitalPendiente + detalle.InteresPendiente;
                                        decimal complementoCorteUnitario = detalle.IvaPendiente + detalle.SeguroPendiente + detalle.CargoPendiente + detalle.ManejoCuentaPendiente;

                                        if (detalle.FechaVencimiento == RelacionCorte.FechaVencimiento)
                                        {
                                            pagoCom += baseComisionUnitario;
                                            interesPagado += detalle.CapitalAbonado;
                                            capitalPagado += detalle.InteresAbonado;
                                            baseComisionTienditaCorteActual += detalle.TienditaPendiente;
                                        }

                                        basecomisionTiendita += detalle.TienditaPendiente;
                                        basecomisionCorte += baseComisionUnitario;
                                        complementosCorte += complementoCorteUnitario;

                                        registros_detalle_producto_principal += 1;
                                        pagoT += detalle.SaldoPlazo;
                                        decimal saldoDespuesPago = detalle.SaldoActual - detalle.SaldoPlazo;
                                        importe += detalle.ImporteTotal;
                                        saldo += detalle.SaldoActual;
                                        pago += detalle.SaldoPlazo;
                                        remanente += Math.Abs(saldoDespuesPago);

                                        if (registros_detalle_producto_principal < (limiteReg + 1))
                                        {
                                            fila_relacion_detalle += "<tr style=\"font-size:12px;\">";
                                            fila_relacion_detalle += "<td class=\"text-center\">" + textoMasDeUnVale + "</td>";
                                            fila_relacion_detalle += "<td class=\"text-center\"></td>";
                                            fila_relacion_detalle += "<td class=\"text-center\"></td>";
                                            fila_relacion_detalle += "<td class=\"text-center\">" + detalle.FechaCanje.ToString("dd/MM/yyyy") + "</td>";
                                            fila_relacion_detalle += "<td class=\"text-center\">" + detalle.CreditoID.ToString() + "</td>";
                                            fila_relacion_detalle += "<td class=\"text-center\">" + detalle.ValeCanje.ToString() + "</td>";
                                            fila_relacion_detalle += "<td class=\"text-center\" style=\"font-size:10px;\">" + HttpUtility.HtmlEncode(detalle.NombreCompleto) + "</td>";
                                            fila_relacion_detalle += "<td class=\"text-center\">0</td>";
                                            fila_relacion_detalle += "<td class=\"text-center\">" + detalle.ImporteTotal.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                            fila_relacion_detalle += "<td class=\"text-center\">" + detalle.SaldoActual.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                            fila_relacion_detalle += "<td class=\"text-center\">" + detalle.SaldoPlazo.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                            fila_relacion_detalle += "<td class=\"text-center\">" + saldoDespuesPago.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                            fila_relacion_detalle += "<td class=\"text-center\" style=\"white-space:nowrap;" + (ultimoCredito == detalle.CreditoID ? "background:#d3d3d3;" : "") + "\">" + detalle.NoPago + " / " + detalle.Plazos + "</td>";
                                            fila_relacion_detalle += "</tr>";
                                        }
                                        else
                                        {
                                            fila_relacion_detalle_2 += "<tr style=\"font-size:12px;\">";
                                            fila_relacion_detalle_2 += "<td class=\"text-center\">" + textoMasDeUnVale + "</td>";
                                            fila_relacion_detalle_2 += "<td class=\"text-center\"></td>";
                                            fila_relacion_detalle_2 += "<td class=\"text-center\"></td>";
                                            fila_relacion_detalle_2 += "<td class=\"text-center\">" + detalle.FechaCanje.ToString("dd/MM/yyyy") + "</td>";
                                            fila_relacion_detalle_2 += "<td class=\"text-center\">" + detalle.CreditoID.ToString() + "</td>";
                                            fila_relacion_detalle_2 += "<td class=\"text-center\">" + detalle.ValeCanje.ToString() + "</td>";
                                            fila_relacion_detalle_2 += "<td class=\"text-center\" style=\"font-size:10px;\">" + HttpUtility.HtmlEncode(detalle.NombreCompleto) + "</td>";
                                            fila_relacion_detalle_2 += "<td class=\"text-center\">0</td>";
                                            fila_relacion_detalle_2 += "<td class=\"text-center\">" + detalle.ImporteTotal.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                            fila_relacion_detalle_2 += "<td class=\"text-center\">" + detalle.SaldoActual.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                            fila_relacion_detalle_2 += "<td class=\"text-center\">" + detalle.SaldoPlazo.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                            fila_relacion_detalle_2 += "<td class=\"text-center\">" + saldoDespuesPago.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                            fila_relacion_detalle_2 += "<td class=\"text-center\" style=\"white-space:nowrap;" + (ultimoCredito == detalle.CreditoID ? "background:#d3d3d3;" : "") + "\">" + detalle.NoPago + " / " + detalle.Plazos + "</td>";
                                            fila_relacion_detalle_2 += "</tr>";
                                        }
                                        ultimoCredito = detalle.CreditoID;
                                    }

                                    foreach (var detalle in detalleProductoCreditosPersonales)
                                    {
                                        switch (detalle.TipoCreditoID)
                                        {
                                            case 5:
                                                creditoPrestamoPersonal += detalle.SaldoPlazo;
                                                break;
                                            case 6:
                                                creditoTienditaTotal += detalle.SaldoPlazo;
                                                break;
                                            case 8:
                                                proteccionCorte += detalle.SaldoPlazo;
                                                break;
                                            case 7:
                                                cobroValera += detalle.SaldoPlazo;
                                                break;
                                            case 10:
                                                cobroFaltante += detalle.SaldoPlazo;
                                                break;
                                            case 3:
                                            case 19:
                                                creditoPrestamoConfiaHome += detalle.SaldoPlazo;
                                                break;
                                            case 9:
                                            case 11:
                                            case 12:
                                            case 13:
                                            case 15:
                                            case 17:
                                            case 18:
                                                otros += detalle.SaldoPlazo;
                                                break;
                                        }
                                        pagoT += detalle.SaldoPlazo;
                                        decimal saldoDespuesPago = detalle.SaldoActual - detalle.SaldoPlazo;
                                        importeCreditosPersonales += detalle.ImporteTotal;
                                        importeAtrasoCreditosPersonales += detalle.SaldoAtrasado;
                                        saldoCreditosPersonales += detalle.SaldoActual;
                                        pagoCreditosPersonales += detalle.SaldoPlazo;
                                        remanenteCreditosPersonales += Math.Abs(saldoDespuesPago);

                                        fila_creditos_personales += "<tr style=\"font-size:12px;\">";
                                        fila_creditos_personales += "<td class=\"text-center\">" + detalle.Descripcion.ToString() + "</td>";
                                        fila_creditos_personales += "<td class=\"text-center\">" + detalle.FechaCanje.ToString("dd/MM/yyyy") + "</td>";
                                        fila_creditos_personales += "<td class=\"text-center\">" + detalle.CreditoID.ToString() + "</td>";
                                        fila_creditos_personales += "<td class=\"text-center\">" + detalle.ImporteTotal.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                        fila_creditos_personales += "<td class=\"text-center\">" + detalle.SaldoActual.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                        fila_creditos_personales += "<td class=\"text-center\">" + detalle.SaldoAtrasado.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                        fila_creditos_personales += "<td class=\"text-center\">" + detalle.SaldoPlazo.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                        fila_creditos_personales += "<td class=\"text-center\">" + saldoDespuesPago.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                        fila_creditos_personales += "<td class=\"text-center\" style=\"white-space:nowrap;\">" + detalle.NoPago + " / " + detalle.Plazos + "</td>";
                                        fila_creditos_personales += "</tr>";
                                    }

                                    footer_tabla_creditos_personales += "<tr>";
                                    footer_tabla_creditos_personales += "<th class=\"text-center\" colspan=\"3\" scope=\"row\">TOTAL</th>";
                                    footer_tabla_creditos_personales += $"<th class=\"text-center\">{importeCreditosPersonales.ToString("C", CultureInfo.CurrentCulture)}</th>";
                                    footer_tabla_creditos_personales += $"<th class=\"text-center\">{saldoCreditosPersonales.ToString("C", CultureInfo.CurrentCulture)}</th>";
                                    footer_tabla_creditos_personales += $"<th class=\"text-center\">{importeAtrasoCreditosPersonales.ToString("C", CultureInfo.CurrentCulture)}</th>";
                                    footer_tabla_creditos_personales += $"<th class=\"text-center\">{pagoCreditosPersonales.ToString("C", CultureInfo.CurrentCulture)}</th>";
                                    footer_tabla_creditos_personales += $"<th class=\"text-center\">{remanenteCreditosPersonales.ToString("C", CultureInfo.CurrentCulture)}</th>";
                                    footer_tabla_creditos_personales += "<th class=\"text-center\"></th>";
                                    footer_tabla_creditos_personales += "</tr>";

                                    totalCobranza = basecomisionCorte + complementosCorte + basecomisionTiendita;
                                    fila_tabla_cobranza += "<tr>";
                                    fila_tabla_cobranza += "<td class=\"text-center\">" + basecomisionCorte.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                    fila_tabla_cobranza += $"<td class=\"text-center\">{complementosCorte.ToString("C", CultureInfo.CurrentCulture)}</td>";
                                    fila_tabla_cobranza += $"<td class=\"text-center\">{basecomisionTiendita.ToString("C", CultureInfo.CurrentCulture)}</td>";
                                    fila_tabla_cobranza += $"<td class=\"text-center\">{totalCobranza.ToString("C", CultureInfo.CurrentCulture)}</td>";
                                    fila_tabla_cobranza += "</tr>";
                                    tabla_cobranza = tabla_cobranza.Replace("@@DETALLE_COBRANZA", fila_tabla_cobranza);

                                    tabla_creditosPersonales = tabla_creditosPersonales.Replace("@@DETALLE_CREDITOS_PERSONALES", fila_creditos_personales);
                                    tabla_creditosPersonales = tabla_creditosPersonales.Replace("@@FOOTERROWCREDITOSPERSONALES", footer_tabla_creditos_personales);

                                    if (registros_detalle_producto_principal >= limiteReg)
                                    {
                                        html = html.Replace("@@CREDITOSPERSONALESTABLA", "");
                                        html = html.Replace("@@VALECOBRANZATABLA", "");
                                    }
                                    else
                                    {
                                        html = html.Replace("@@CREDITOSPERSONALESTABLA", tabla_creditosPersonales);
                                        html = html.Replace("@@VALECOBRANZATABLA", tabla_cobranza);
                                    }
                                    html = html.Replace("@@DETALLE_RELACION", fila_relacion_detalle);
                                    html = html.Replace("@@COUNT", registros_detalle_producto_principal.ToString());
                                    html = html.Replace("@@TIMPORTE", importe.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@TSALDO", saldo.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@TPAGO", pago.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@TREMANENTE", remanente.ToString("C", CultureInfo.CurrentCulture));
                                    decimal LINEACONFIAHOME = (LineaCredito.LineaCreditoDisponible.Value * 0.60m) - creditoPrestamoConfiaHome;
                                    html = html.Replace("@@LINEACONFIAHOME", !esVision ? LINEACONFIAHOME.ToString("C", CultureInfo.CurrentCulture) : "");

                                    // Guardamos los archivos temporalmente
                                    await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")), html);
                                    listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")));


                                    if (registros_detalle_producto_principal >= limiteReg)
                                    {
                                        html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Relacion", "RelacionCortePagIntermedia.html"));
                                        html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                                        html = html.Replace("@@IMPRIMIO", UsuarioActual.Nombre.ToString());
                                        html = html.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                                        html = html.Replace("@@ID_DIST", RelacionCorte.DistribuidorID.ToString());

                                        html = html.Replace("@@LOGO", logoname);
                                        html = html.Replace("@@ESLOGAN", Sucursal.Eslogan == null ? "" : Sucursal.Eslogan);
                                        html = html.Replace("@@COLOR", colorDocumento);

                                        html = html.Replace("@@DETALLE_RELACION_2", fila_relacion_detalle_2);
                                        html = html.Replace("@@COUNT", registros_detalle_producto_principal.ToString());
                                        html = html.Replace("@@TIMPORTE", importe.ToString("C", CultureInfo.CurrentCulture));
                                        html = html.Replace("@@TSALDO", saldo.ToString("C", CultureInfo.CurrentCulture));
                                        html = html.Replace("@@TPAGO", pago.ToString("C", CultureInfo.CurrentCulture));
                                        html = html.Replace("@@TREMANENTE", remanente.ToString("C", CultureInfo.CurrentCulture));
                                        html = html.Replace("@@CREDITOSPERSONALESTABLA", tabla_creditosPersonales);
                                        html = html.Replace("@@VALECOBRANZATABLA", tabla_cobranza);

                                        // Guardamos los archivos temporalmente
                                        await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "5_" + Count.ToString() + ".html")), html);
                                        listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "5_" + Count.ToString() + ".html")));
                                    }

                                    // html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Relacion", "Pagina2.html"));
                                    html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Relacion", "RelacionCortePagFinal.html"));

                                    html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                                    html = html.Replace("@@COLOR", colorDocumento);
                                    html = html.Replace("@@LOGO", logoname);

                                    var fila_tabla_bonificacion = "";
                                    var fila_tabla_corresponsales = "";

                                    //var cult = CultureInfo.CurrentCulture.ToString();
                                    decimal PorcComisionAnterior = 0;
                                    decimal bonificacionTiendita = baseComisionTienditaCorteActual * RelacionCorteTablaDiasFirst.PorcComision;
                                    pagoCom += baseComisionTienditaCorteActual;
                                    pagoCom += interesPagado;
                                    pagoCom += capitalPagado;

                                    foreach (var detalle in RelacionCortesTablaDias)
                                    {
                                        if (fecha.Day == 23 && diasmes == 31)
                                        {
                                            DateTime fechaActual = detalle.FechaPago ?? DateTime.MinValue;
                                            int diasmes2 = DateTime.DaysInMonth(fechaActual.Year, fechaActual.Month);

                                            // Obtener el día del mes
                                            int dia = fechaActual.Day;

                                            fila_tabla_bonificacion += "<tr class=\"text-center\">";
                                            fila_tabla_bonificacion += "<td>" + detalle.FechaPago.Value.ToString("dd/MM/yyyy") + "</td>";
                                            fila_tabla_bonificacion += "<td>" + pagoT.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                            //PREGUNTAMOS SI EL PAGO ES POR TENER EL 22.09 DE LA VALERA

                                            // decimal n2 = Math.Round(pagoT, 2);
                                            if (costGlobal != null)
                                            {
                                                var costValera = costGlobal.varValue;
                                                var costValeraNumber = decimal.Parse((string)costValera);
                                                detalle.PorcComision = Math.Round(pagoT, 2) == costValeraNumber ? 0 : detalle.PorcComision;
                                            }

                                            fila_tabla_bonificacion += "<td>" + (dia >= 31 ? PorcComisionAnterior.ToString("P", nfi) : detalle.PorcComision.ToString("P", nfi)) + "</td>";
                                            // COLUMNA DE BONIFICACION
                                            fila_tabla_bonificacion += "<td>" + (dia == 31 ? (PorcComisionAnterior * pagoCom).ToString("C", CultureInfo.CurrentCulture) : (detalle.PorcComision * pagoCom).ToString("C", CultureInfo.CurrentCulture)) + "</td>";
                                            var porPagar = dia == 31 ? pagoT - (PorcComisionAnterior * pagoCom) : pagoT - (detalle.PorcComision * pagoCom);
                                            porPagar = porPagar < 0 ? 0.1m : porPagar;
                                            fila_tabla_bonificacion += "<td>" + porPagar.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                            fila_tabla_bonificacion += "</tr>";


                                            fila_tabla_corresponsales += "<tr class=\"text-center\">";
                                            fila_tabla_corresponsales += "<td>" + detalle.FechaPago.Value.ToString("dd/MM/yyyy") + "</td>";
                                            foreach (var Corresponsal in Corresponsales.OrderBy(x => x.CorresponsalID))
                                            {
                                                var pagcom = dia >= 31 ? pagoT - PorcComisionAnterior * pagoCom : pagoT - detalle.PorcComision * pagoCom;

                                                var PagoCorresponsal = 0.0m;

                                                if (Corresponsal.TipoPorcentaje)
                                                {
                                                    try
                                                    {
                                                        PagoCorresponsal = pagcom + (pagcom * Corresponsal.Porcentaje.Value);
                                                    }
                                                    catch (Exception)
                                                    {
                                                        PagoCorresponsal = 0.0m;
                                                    }
                                                }
                                                else if (Corresponsal.TipoMontoFijo && Corresponsal.TipoMontoCorte)
                                                {
                                                    try
                                                    {
                                                        var quot = Math.Truncate(pagcom / Corresponsal.MontoCorte.Value);
                                                        var mod = pagcom % Corresponsal.MontoCorte.Value;
                                                        var corte = quot + (mod > 0 ? 1 : 0);

                                                        PagoCorresponsal = pagcom + (Corresponsal.MontoFijo.Value * corte);
                                                    }
                                                    catch (Exception)
                                                    {
                                                        PagoCorresponsal = 0.0m;
                                                    }
                                                }
                                                else if (Corresponsal.TipoMontoFijo && !Corresponsal.TipoMontoCorte)
                                                {
                                                    try
                                                    {
                                                        PagoCorresponsal = pagcom + Corresponsal.MontoFijo.Value;
                                                    }
                                                    catch (Exception)
                                                    {
                                                        PagoCorresponsal = 0.0m;
                                                    }
                                                }
                                                PagoCorresponsal = PagoCorresponsal < 0 ? 0.1m : PagoCorresponsal;
                                                fila_tabla_corresponsales += "<td>" + PagoCorresponsal.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                            }
                                            fila_tabla_corresponsales += "</tr>";
                                        }
                                        else
                                        {
                                            fila_tabla_bonificacion += "<tr class=\"text-center\">";
                                            fila_tabla_bonificacion += "<td>" + detalle.FechaPago.Value.ToString("dd/MM/yyyy") + "</td>";
                                            fila_tabla_bonificacion += "<td>" + pagoT.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                            //PREGUNTAMOS SI EL PAGO ES POR TENER EL 22.09 DE LA VALERA

                                            // decimal n2 = Math.Round(pagoT, 2);
                                            if (costGlobal != null)
                                            {
                                                var costValera = costGlobal.varValue;
                                                var costValeraNumber = decimal.Parse((string)costValera);
                                                detalle.PorcComision = Math.Round(pagoT, 2) == costValeraNumber ? 0 : detalle.PorcComision;
                                            }

                                            fila_tabla_bonificacion += "<td>" + detalle.PorcComision.ToString("P", nfi) + "</td>";
                                            // COLUMNA DE BONIFICACION
                                            fila_tabla_bonificacion += "<td>" + (detalle.PorcComision * pagoCom).ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                            var porPagar = pagoT - (detalle.PorcComision * pagoCom);
                                            porPagar = porPagar < 0 ? 0.1m : porPagar;
                                            fila_tabla_bonificacion += "<td>" + porPagar.ToString("C", CultureInfo.CurrentCulture) + "</td>";

                                            fila_tabla_corresponsales += "<tr class=\"text-center\">";
                                            fila_tabla_corresponsales += "<td>" + detalle.FechaPago.Value.ToString("dd/MM/yyyy") + "</td>";
                                            foreach (var Corresponsal in Corresponsales.OrderBy(x => x.CorresponsalID))
                                            {
                                                var pagcom = pagoT - detalle.PorcComision * pagoCom;

                                                var PagoCorresponsal = 0.0m;

                                                if (Corresponsal.TipoPorcentaje)
                                                {
                                                    try
                                                    {
                                                        PagoCorresponsal = pagcom + (pagcom * Corresponsal.Porcentaje.Value);
                                                    }
                                                    catch (Exception)
                                                    {
                                                        PagoCorresponsal = 0.0m;
                                                    }
                                                }
                                                else if (Corresponsal.TipoMontoFijo && Corresponsal.TipoMontoCorte)
                                                {
                                                    try
                                                    {
                                                        var quot = Math.Truncate(pagcom / Corresponsal.MontoCorte.Value);
                                                        var mod = pagcom % Corresponsal.MontoCorte.Value;
                                                        var corte = quot + (mod > 0 ? 1 : 0);

                                                        PagoCorresponsal = pagcom + (Corresponsal.MontoFijo.Value * corte);
                                                    }
                                                    catch (Exception)
                                                    {
                                                        PagoCorresponsal = 0.0m;
                                                    }
                                                }
                                                else if (Corresponsal.TipoMontoFijo && !Corresponsal.TipoMontoCorte)
                                                {
                                                    try
                                                    {
                                                        PagoCorresponsal = pagcom + Corresponsal.MontoFijo.Value;
                                                    }
                                                    catch (Exception)
                                                    {
                                                        PagoCorresponsal = 0.0m;
                                                    }
                                                }

                                                PagoCorresponsal = PagoCorresponsal < 0 ? 0.1m : PagoCorresponsal;
                                                fila_tabla_corresponsales += "<td>" + PagoCorresponsal.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                            }
                                            fila_tabla_corresponsales += "</tr>";
                                        }

                                        PorcComisionAnterior = detalle.PorcComision;
                                        // PagComisionAnterior = detalle.pa
                                    }
                                    pagoCom -= baseComisionTienditaCorteActual;
                                    html = html.Replace("@@TABLA_BONIFICACION", fila_tabla_bonificacion);
                                    html = html.Replace("@@BASECOMISION", basecomisionCorte.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@PORCENTAJECOMISION", RelacionCorteTablaDiasFirst.PorcComision.ToString("P", nfi));
                                    decimal bonificacionSobreComision = RelacionCorteTablaDiasFirst.PorcComision * pagoCom;
                                    html = html.Replace("@@BONIFICACIONSOBRECOMISION", bonificacionSobreComision.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@TOTALTIENDITA", basecomisionTiendita.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@BONIFICACIONTIENDITA", bonificacionTiendita.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@SUBTOTAL", (pagoCom - bonificacionSobreComision + basecomisionTiendita - bonificacionTiendita).ToString("C", CultureInfo.CurrentCulture));

                                    html = html.Replace("@@COMPLEMENTOS", complementosCorte.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@PROTECCIONSALDO", proteccionCorte.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@COSTOVALERA", cobroValera.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@TOTALFALTANTE", cobroFaltante.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@PRESTAMOSPERSONALES", creditoPrestamoPersonal.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@CREDITOTIENDITA", creditoTienditaTotal.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@CREDITOCONFIAHOME", creditoPrestamoConfiaHome.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@CREDITOSOTROS", otros.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@SALDOFAVOR", saldoFavor.ToString("C", CultureInfo.CurrentCulture));
                                    decimal porPagarDesglose = totalCobranza - bonificacionSobreComision - bonificacionTiendita + proteccionCorte + cobroValera + cobroFaltante + creditoPrestamoPersonal + creditoTienditaTotal + creditoPrestamoConfiaHome + otros;
                                    porPagarDesglose = porPagarDesglose < 0 ? 0.1m : porPagarDesglose;
                                    html = html.Replace("@@TOTALACOBRAR", porPagarDesglose.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@NOMBRETIENDITA", nombreTiendita);
                                    html = html.Replace("@@NOMBRECONFIAHOME", nombreConfiaHome);

                                    // INTERPOLACION METAS CAMPAÑA PON TU META EN ALTO (EN PAUSA DE MOMENTO)
                                    // html = html.Replace("@@METABAJA", 10.ToString());
                                    // html = html.Replace("@@METAMEDIA", 10.ToString());
                                    // html = html.Replace("@@METAALTA", 10.ToString());
                                    // html = html.Replace("@@METAACUMULADA", 10.ToString());
                                    html = html.Replace("@@IMAGENBANNER", IMAGENBANNER);
                                    html = html.Replace("@@estiloCampaniaCancun", estiloCampaniaCancun);
                                    html = html.Replace("@@datosImproductivas", datosImproductivos);
                                    html = html.Replace("@@datosCancun2025", datosCancun2025);


                                    html = html.Replace("@@ID_DIST", RelacionCorte.DistribuidorID.ToString());
                                    html = html.Replace("@@TABLA_CORRESPONDIENTE", fila_tabla_corresponsales);
                                    html = html.Replace("@@NOMBRE_DIST", RelacionCorte.NombreCompleto.ToUpper());
                                    html = html.Replace("@@CONTRATO_CIE", RelacionCorte.ContratoCIE);
                                    html = html.Replace("@@REF_BANCOMER", RelacionCorte.refBancomer);
                                    //Show
                                    html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                                    html = html.Replace("@@NOMBRE_DIST", RelacionCorte.NombreCompleto.ToUpper());
                                    html = html.Replace("@@REF_OXXO", RelacionCorte.refOxxo);

                                    html = html.Replace("@@CONTRATO_CIE", RelacionCorte.ContratoCIE);
                                    html = html.Replace("@@COLOR", colorDocumento);
                                    html = html.Replace("@@LOGO", logoname);

                                    var textoSpei = @"<h6 style=""text-align: center"">
                                    <strong> NO DISPONIBLE </strong>
                                    </h6>";
                                    if (RelacionCorte.refSPEI != null)
                                    {
                                        textoSpei = @"
                                    <h6>Si lo prefieres, puedes hacer tu pago por:</h6>
                                    <img
                                        style=""max-height: 120px; max-width: 120px""
                                        src=""https://" + HttpContext.Request.Host.Value + @"/pdf/image-012.jpg""
                                    />
                                    <h6>CLABE: <strong>" + RelacionCorte.refSPEI + @"</strong></h6>";
                                    }
                                    html = html.Replace("@@INTERPOLARSPEI", textoSpei);

                                    // Conekkkkta
                                    if (RelacionCorte.refOxxo != null)
                                    {
                                        var code = Funciones.Barcode(RelacionCorte.refOxxo, 200, 100);

                                        var image = string.Concat(prefijo_archivo, "refOxxo_", RelacionCorte.DistribuidorID.ToString(), ".png");

#pragma warning disable CA1416 // Validar la compatibilidad de la plataforma
                                        code.Save(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "ImageBarcode", image), ImageFormat.Png);
#pragma warning restore CA1416 // Validar la compatibilidad de la plataforma

                                        listado_imagenes.Add(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "ImageBarcode", image));

                                        html = html.Replace("@@REFOXXOCODE", image);
                                    }

                                    if (RelacionCorte.refSoriana != null)
                                    {
                                        var code = Funciones.Barcode(RelacionCorte.refSoriana, 600, 200);

                                        var image = string.Concat(prefijo_archivo, "refSoriana_", RelacionCorte.DistribuidorID.ToString(), ".png");

#pragma warning disable CA1416 // Validar la compatibilidad de la plataforma
                                        code.Save(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "ImageBarcode", image), ImageFormat.Png);
#pragma warning restore CA1416 // Validar la compatibilidad de la plataforma

                                        //Mostrar codigo de barras soriana
                                        listado_imagenes.Add(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "ImageBarcode", image));
                                        html = html.Replace("@@REF_SORIANA", image);
                                    }

                                    // Guardamos los archivos temporalmente
                                    await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "4_" + Count.ToString() + ".html")), html);
                                    listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "4_" + Count.ToString() + ".html")));
                                }
                            }
                        }
                        else
                        {
                            var recibos = "";

                            var rc = 0;
                            var rch2 = 0;
                            foreach (var RelacionCorte in RelacionCortes)
                            {
                                parData.DistribuidorID = RelacionCorte.DistribuidorID;
                                if (RelacionCorte != null)
                                {
                                    Count++;
                                    rch2 = 0;
                                    var RelacionCortesDetalle = await DBContext.database.FetchAsync<RelacionCortesDetalle2_VW>("WHERE DistribuidorID = @0 AND fechaCorte = CONVERT(DATETIME, @1, 103)", RelacionCorte.DistribuidorID, RelacionCorte.fechaCorte);

                                    foreach (var detalle in RelacionCortesDetalle.Where(x => x.DistribuidorID == RelacionCorte.DistribuidorID && x.saldoPlazo > 0.9m))
                                    {
                                        if (parData.formato == 1)
                                        {
                                            if (rc % 2 == 0)
                                            {
                                                switch (rch2)
                                                {
                                                    case 0:
                                                        if (rc == 0)
                                                        {
                                                            recibos += "<div class=\"d-table d-table-third-class\" style=\"width: 100%;margin-bottom:5rem;\">";
                                                            recibos += "<div class=\"d-table-row\" style=\"width: 100%\">";
                                                            recibos += "<div class=\"d-table-cell\" style=\"width: 100%\">";
                                                            recibos += "&nbsp;";
                                                            recibos += "</div>";
                                                            recibos += "</div>";
                                                            recibos += "</div>";
                                                        }
                                                        else
                                                        {
                                                            recibos += "<div class=\"d-table d-table-third-class\" style=\"width: 100%;margin-bottom:5rem;margin-top:6rem;\">";
                                                            recibos += "<div class=\"d-table-row\" style=\"width: 100%\">";
                                                            recibos += "<div class=\"d-table-cell\" style=\"width: 100%\">";
                                                            recibos += "&nbsp;";
                                                            recibos += "</div>";
                                                            recibos += "</div>";
                                                            recibos += "</div>";
                                                        }
                                                        break;
                                                    case 2:
                                                    case 4:
                                                        recibos += "<div class=\"d-table d-table-third-class\" style=\"width: 100%;margin-bottom:8rem;\">";
                                                        recibos += "<div class=\"d-table-row\" style=\"width: 100%\">";
                                                        recibos += "<div class=\"d-table-cell\" style=\"width: 100%\">";
                                                        recibos += "&nbsp;";
                                                        recibos += "</div>";
                                                        recibos += "</div>";
                                                        recibos += "</div>";
                                                        break;
                                                    default:
                                                        recibos += "";
                                                        break;
                                                }

                                                recibos += "<div class=\"d-table\" style=\"width:100%;\">";
                                                recibos += "<div class=\"d-table-row\">";
                                            }

                                            recibos += "<div class=\"d-table-cell d-table-first-class\" style=\"width:46%; height:100%;\">";//TABLE CELL OPEN
                                            recibos += "<div class=\"d-table d-table-second-class\" style=\"width:100%;\">";//TABLE OPEN

                                            recibos += "<div class=\"d-table-row text-end\"><strong>" + detalle.fechaCorte + "</strong></div>";
                                            recibos += "</br>";
                                            recibos += "</br>";

                                            recibos += "<div class=\"d-table-row\">";
                                            recibos += "<div class=\"d-table-cell\">";
                                            recibos += "<div class=\"text-center\">" + HttpUtility.HtmlEncode(RelacionCorte.NombreCompleto) + "</div>";
                                            recibos += "</div>";
                                            recibos += "</div>";
                                            recibos += "</br>";

                                            recibos += "<div class=\"d-table-row\">";
                                            recibos += "<div class=\"d-table-cell\">";
                                            recibos += "<div class=\"text-center\">CLIENTE: " + detalle.ClienteID.ToString() + " - " + HttpUtility.HtmlEncode(detalle.Cliente) + "</div>";
                                            recibos += "</div>";
                                            recibos += "</div>";
                                            recibos += "</br>";
                                            recibos += "</br>";

                                            recibos += "<table style=\"width:100%;font-size:13px;\">";
                                            recibos += "<thead>";
                                            recibos += "<th></th><th></th><th></th><th></th>";
                                            recibos += "</thead>";
                                            recibos += "<tbody>";
                                            recibos += "<tr><td colspan=\"1\"><strong>NUM. DE VALE:</strong></td>";
                                            recibos += "<td colspan=\"1\">" + (detalle.ValeCanje != null ? detalle.ValeCanje.Value.ToString() : "NA") + "</td>";
                                            recibos += "<td colspan=\"1\"><strong>SALDO ANTERIOR:</strong></td>";
                                            recibos += "<td colspan=\"1\" class=\"text-end\" >" + detalle.saldoCredito.Value.ToString("C", CultureInfo.CurrentCulture) + "</td></tr>";
                                            recibos += "<tr><td><strong>CR&Eacute;DITO:</strong></td>";
                                            recibos += "<td>" + detalle.CreditoID.ToString().Trim() + "</td>";
                                            recibos += "<td><strong>ATRASADO:</strong></td>";
                                            recibos += "<td class=\"text-end\" >" + detalle.saldoAtrasado.Value.ToString("C", CultureInfo.CurrentCulture) + "</td></tr>";
                                            recibos += "<tr><td><strong>PLAZO:</strong></td>";
                                            recibos += "<td>" + detalle.PagoPlazo + "</td>";
                                            recibos += "<td><strong>PAGO:</strong></td>";
                                            recibos += "<td class=\"text-end\">" + detalle.saldoPlazo.Value.ToString("C", CultureInfo.CurrentCulture) + "</td></tr>";
                                            recibos += "<tr><td><strong>FECHA LIMITE DE PAGO:</strong></td>";
                                            recibos += "<td>" + detalle.FechaVencimiento.Value.AddDays(-5).ToString("dd/MM/yyyy") + "</td>";
                                            recibos += "<td><strong>SALDO NUEVO:</strong></td>";
                                            recibos += "<td class=\"text-end\">" + detalle.SldDspPago.Value.ToString("C", CultureInfo.CurrentCulture) + " </td></tr>";
                                            recibos += "</tbody></table>";

                                            recibos += "</div>";//TABLE CLOSE
                                            recibos += "</div>";//TABLE CELL CLOSE

                                            rch2++;
                                            rc++;
                                            if (rc % 2 == 0)
                                            {
                                                recibos += "</div>";
                                                recibos += "</div>";
                                                if (rch2 >= 5)
                                                {
                                                    rch2 = 0;
                                                }
                                            }
                                            else
                                            {
                                                recibos += "<div class=\"d-table-cell d-table-first-class\" style=\"width:8%;\">";
                                                recibos += "</div>";
                                            }
                                        }
                                        else
                                        {
                                            switch (rch2)
                                            {
                                                case 0:
                                                case 2:
                                                    recibos += "<div class=\"d-table d-table-second-class\" style=\"width: 100%;\">";
                                                    recibos += "<div class=\"d-table-row\" style=\"width: 100%\">";
                                                    recibos += "<div class=\"d-table-cell\" style=\"width: 100%\">";
                                                    recibos += "&nbsp;";
                                                    recibos += "</div>";
                                                    recibos += "</div>";
                                                    recibos += "</div>";
                                                    break;
                                                case 4:
                                                case 6:
                                                    recibos += "<div class=\"d-table d-table-first-class\" style=\"width: 100%;\">";
                                                    recibos += "<div class=\"d-table-row\" style=\"width: 100%\">";
                                                    recibos += "<div class=\"d-table-cell\" style=\"width: 100%\">";
                                                    recibos += "&nbsp;";
                                                    recibos += "</div>";
                                                    recibos += "</div>";
                                                    recibos += "</div>";
                                                    break;
                                                default:
                                                    recibos += "";
                                                    break;
                                            }
                                            if (rc % 2 == 0)
                                            {
                                                recibos += "<div class=\"d-table\" style=\"width: 100%;\">";
                                                recibos += "<div class=\"d-table-row\" style=\"width: 100%\">";
                                            }
                                            recibos += "<div class=\"d-table-cell w-block\" style=\"width: 40%\">";
                                            recibos += "<div class=\"text-end\">";
                                            recibos += "<h2><strong>" + detalle.fechaCorte + "</strong></h2>";
                                            recibos += "</div>";
                                            recibos += "<div>";
                                            recibos += "<h1>&nbsp;</h1>";
                                            recibos += "</div>";
                                            recibos += "<table style=\"width:100%;font-size:13px;\">";
                                            recibos += "<thead>";
                                            recibos += "<th></th><th></th><th></th><th></th>";
                                            recibos += "</thead>";
                                            recibos += "<tbody>";
                                            recibos += "<tr style=\"font-size:16px;\"><td colspan=\"4\">" + HttpUtility.HtmlEncode(RelacionCorte.NombreCompleto) + "</td></tr>";
                                            recibos += "<tr style=\"font-size:13px;\"><td colspan=\"1\"><strong>CLIENTE:</strong></td>";
                                            recibos += "<td colspan=\"3\" style=\"font-size:10px;\">" + detalle.ClienteID.ToString() + " - " + HttpUtility.HtmlEncode(detalle.Cliente) + "</td></tr>";
                                            recibos += "<tr><td colspan=\"1\"><strong>NUM. DE VALE:</strong></td>";
                                            recibos += "<td colspan=\"1\">" + (detalle.ValeCanje != null ? detalle.ValeCanje.Value.ToString() : "NA") + "</td>";
                                            recibos += "<td colspan=\"1\"><strong>SALDO ANTERIOR:</strong></td>";
                                            recibos += "<td colspan=\"1\" class=\"text-end\" >" + detalle.saldoCredito.Value.ToString("C", CultureInfo.CurrentCulture) + "</td></tr>";
                                            recibos += "<tr><td><strong>CR&Eacute;DITO:</strong></td>";
                                            recibos += "<td>" + detalle.CreditoID.ToString().Trim() + "</td>";
                                            recibos += "<td><strong>ATRASADO:</strong></td>";
                                            recibos += "<td class=\"text-end\" >" + detalle.saldoAtrasado.Value.ToString("C", CultureInfo.CurrentCulture) + "</td></tr>";
                                            recibos += "<tr><td><strong>PLAZO:</strong></td>";
                                            recibos += "<td>" + detalle.PagoPlazo + "</td>";
                                            recibos += "<td><strong>PAGO:</strong></td>";
                                            recibos += "<td class=\"text-end\">" + detalle.saldoPlazo.Value.ToString("C", CultureInfo.CurrentCulture) + "</td></tr>";
                                            recibos += "<tr><td><strong>FECHA LIMITE DE PAGO:</strong></td>";
                                            recibos += "<td>" + detalle.FechaVencimiento.Value.AddDays(-5).ToString("dd/MM/yyyy") + "</td>";
                                            recibos += "<td><strong>SALDO NUEVO:</strong></td>";
                                            recibos += "<td class=\"text-end\">" + detalle.SldDspPago.Value.ToString("C", CultureInfo.CurrentCulture) + " </td></tr>";
                                            recibos += "</tbody></table>";
                                            recibos += "</div>";

                                            rc++;
                                            rch2++;
                                            if (rc % 2 == 0)
                                            {
                                                recibos += "</div>";
                                                recibos += "</div>";
                                                recibos += "<div class=\"d-table d-table-third-class\" style=\"width: 100%;\">";
                                                recibos += "<div class=\"d-table-row\" style=\"width: 100%\">";
                                                recibos += "<div class=\"d-table-cell\" style=\"width: 100%\">";
                                                recibos += "&nbsp;";
                                                recibos += "</div>";
                                                recibos += "</div>";
                                                recibos += "</div>";
                                                if (rch2 >= 7)
                                                {
                                                    rch2 = 0;
                                                }
                                            }
                                            else
                                            {
                                                recibos += "<div class=\"d-table-cell w-block p-2\" style=\"width: 10%\">";
                                                recibos += "&nbsp;";
                                                recibos += "</div>";
                                            }
                                        }
                                    }
                                }
                            }

                            if (rc % 2 != 0)
                            {
                                if (parData.formato == 1)
                                {
                                    recibos += "<div class=\"d-table-cell d-table-first-class\" style=\"width:46%; height:100%;\">";
                                    recibos += "</div>";
                                }
                                else
                                {
                                    recibos += "<div class=\"d-table-cell w-block\" style=\"width: 40%\">";
                                    recibos += "</div>";
                                }
                                recibos += "</div>";
                            }

                            ////path = Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Relacion", "Pagina1", "Pagina1.html");
                            var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Relacion", "Recibo_" + parData.formato.ToString() + ".html"));
                            html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                            html = html.Replace("@@RECIBOS", recibos);
                            html = html.Replace("@@LOGO", logoname);

                            //// Guardamos los archivos temporalmente
                            ///_" + Count.ToString() + "
                            await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1.html")), html);

                            listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1.html")));
                        }

                        if (Count > 0)
                        {
                            // Ejecutamos el proceso de wkhtmltopdf
                            Process p = new()
                            {
                                StartInfo = new ProcessStartInfo(PDF.RUTA_WKHTMLTOPDF())
                            };
                            p.StartInfo.Arguments = string.Concat("", string.Join(" ", listado_archivos), " ", Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
                            p.StartInfo.CreateNoWindow = true;
                            p.Start();
                            await p.WaitForExitAsync();

                            // Obtenemos el contenido de nuestro archivo de PDF
                            var pdf = await System.IO.File.ReadAllBytesAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));

                            // Obtenemos nuestro PDF
                            var pdfStream = new MemoryStream();
                            pdfStream.Write(pdf, 0, pdf.Length);
                            pdfStream.Position = 0;

                            // Limpiamos los archivos que se utilizaron
                            foreach (var archivo in listado_archivos)
                                System.IO.File.Delete(archivo);

                            foreach (var imagen in listado_imagenes)
                                System.IO.File.Delete(imagen);

                            // Eliminamos el PDF
                            System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
                            //System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF_signed.pdf")));

                            await DBContext.Destroy();

                            // Enviamos el PDF a la UI
                            return new FileStreamResult(pdfStream, "application/pdf");
                        }
                        else
                        {
                            await DBContext.Destroy();
                            throw new Exception("No se encontro información");
                        }
                    }
                }
                else
                {
                    throw new Exception("RELACIONES BLOQUEADAS");
                }
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return Ok(new
                {
                    resultCode = -2,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }

        }


        [HttpPost]
        [Route("CodigoValidarSocia")]
        public async Task<IActionResult> CodigoValidarSocia(PeticionesRest.AppValePeticiones.AppDistribuidores.CodigoValidarSocia pardata)
        {
            try
            {
                //Verificar si el usuario es un distribuidor
                var Distribuidor = await DBContext.database.QueryAsync<Distribuidores_VW>("WHERE DistribuidorID = @0", pardata.PersonaID).SingleOrDefaultAsync();

                if (Distribuidor == null)
                {
                    await DBContext.Destroy();
                    return BadRequest(new
                    {
                        resultCode = -1,
                        resultDesc = "No existe la socia",
                    });
                }

                //Verificar que el telefono sea el mismo
                var Persona = await DBContext.database.QueryAsync<Personas>("WHERE PersonaID = @0", Distribuidor.PersonaID).SingleOrDefaultAsync();

                if (pardata.Telefono != Persona.TelefonoMovil)
                {
                    await DBContext.Destroy();
                    return BadRequest(new
                    {
                        resultCode = -1,
                        resultDesc = "El teléfono proporcionado es diferente al que se le registró a la socia, verifique",
                    });
                }

                var usuario = await DBContext.database.QueryAsync<Usuarios>("WHERE PersonaID = @0", pardata.PersonaID).SingleOrDefaultAsync();

                //Validamos que no este validado
                if (usuario != null)
                {
                    if (usuario.Validacion)
                    {
                        await DBContext.Destroy();
                        return BadRequest(new
                        {
                            resultCode = -1,
                            resultDesc = "Este usuario ya ha sido activado",
                        });
                    }
                }


                //Si pasa todas las validaciones, generamos el codigo de validacion
                var variable = await DBContext.database.QueryAsync<VariablesGlobales>("WHERE  (varName = @0)", "TIEMPO_EXPIRACION_CODIGO_SMS").FirstOrDefaultAsync();

                int tiempoExp = Int32.Parse((string)variable.varValue);

                //Generamos el codigo
                Random generator = new();
                var code = generator.Next(1000000, 9999999).ToString("D6");

                var LogCelular = new LogCelular()
                {
                    PersonaID = pardata.PersonaID,
                    Celular = pardata.Telefono,
                    PersonaIDModifica = 1,
                    UsuarioIDModifica = 1,
                    FechaHora = DateTime.Now,
                };

                //Tipo de codigo
                var tipoCodigo = await DBContext.database.QueryAsync<TipoCodigoSMS>("WHERE (clave = @0)", "ACT").SingleOrDefaultAsync();

                var CodigoSMS = new CodigoSMS()
                {
                    PersonaID = pardata.PersonaID,
                    Codigo = code,
                    FechaEnvio = DateTime.Now,
                    FechaCaduca = DateTime.Now.AddMinutes(tiempoExp),
                    TipoID = tipoCodigo.TipoID,
                    Confirmado = false,
                    SMSId = null,
                };

                await DBContext.database.InsertAsync(CodigoSMS);
                var empresa = await DBContext.database.QueryAsync<Empresas>("WHERE (empresaId = @0)", Distribuidor.EmpresaId).SingleOrDefaultAsync();
                pardata.src = empresa == null ? "" : empresa.TipoEmpresaID == 1 ? "VALE CONFIA" : empresa.TipoEmpresaID == 2 ? "PRESTA STAR" : "VALE VISION";

                CodigoSMSController CodSMS = new(DBContext, env);

                SMS DataSMS = new()
                {
                    PersonaID = pardata.PersonaID,
                    TelefonoMovil = pardata.Telefono.Replace("(", "").Replace(")", "").Replace("-", "").Trim(),
                    MSG = $"{pardata.src}: INGRESA EL SIG. CODIGO PARA ACTIVAR TU CUENTA. {code}.",
                    Referencia = "CODIGO",
                };

                int r = await CodSMS.SMS(DataSMS);

                if (r < 1)
                {
                    return BadRequest(new
                    {
                        resultCode = -1,
                        resultDesc = "No fue posible enviar el código por SMS, intentelo de nuevo mas tarde",
                    });
                }

                CodigoSMS.SMSId = r;

                await DBContext.database.UpdateAsync(CodigoSMS);
                await DBContext.Destroy();


                return Ok(new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = CodigoSMS
                });

            }
            catch (Exception ex)
            {
                DBContext.database.AbortTransaction();
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = "Error al generar el codigo, intente de nuevo más tarde",
                });

            }

        }
    }
}
