using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.General;
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
using Path = System.IO.Path;
using System.Diagnostics;
using DBContext.DBConfia.Catalogos;
//using iTextSharp.text.pdf;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Xobject;
using iText.Pdfa;
using ConfiaWebApi.PeticionesRest.Creditos.CanjeaVale;
using ConfiaWebApi.PeticionesRest.Tesoreria.Corresponsales;
using static iText.Svg.SvgConstants;
using System.Collections;
using NPoco.fastJSON;
using PDF = ConfiaWebApi.Code.PDF;
using Newtonsoft.Json;
using Microsoft.Data.SqlClient;
using System.Data;
using NPoco;
using ConfiaWebApi.PeticionesRest.Aclaraciones.AnalistaSucursal;
using DBContext.DBConfia.Compras;
using DBContext.DBConfia.Seguridad;
using DBContext.DBConfia.Tesoreria;
using Microsoft.IdentityModel.Tokens;

namespace ConfiaWebApi.Controllers.Creditos
{
    [Authorize]
    [ApiController]
    [Route("api/Creditos/[controller]")]
    public class CanjeaValeController : ControllerBase
    {
        private DBConfiaContext ConexionDB;

        private readonly IWebHostEnvironment _env;

        public CanjeaValeController(DBConfiaContext _DBContext, IWebHostEnvironment env)
        {
            ConexionDB = _DBContext;
            _env = env;
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> Add(PeticionesRest.Creditos.CanjeaVale.Add parData)
        {

            try
            {
                //var userName = HttpContext.User.Claims.Where(x => x.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier").FirstOrDefault().Value;

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                // var PersonaVw = await ConexionDB.database.QueryAsync<DBContext.DBConfia.General.Personas_VW>("WHERE PersonaID=@0", UsuarioActual.PersonaID).FirstOrDefaultAsync();
                // var UsuarioActual = await DBContext.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
                // var UsuarioActual = await DBContext.database.QueryAsync<USER_ENTITY>("WHERE EMAIL=@0", UserName).FirstOrDefaultAsync();
                // var PersonaActual = await ConexionDB.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.ID).FirstOrDefaultAsync();

                parData.UsuarioId = UsuarioActual.UsuarioID;
                parData.PersonaID = UsuarioActual.PersonaID.Value;

                //var Caja = await DBContext.database.QueryAsync<CatalogoCuentasBancos>("SELECT cb.NumeroCuenta FROM Tesoreria.CatalogoCajas AS c INNER JOIN Tesoreria.CuentasCaja AS cc ON c.CajaID = cc.CajaId INNER JOIN Bancos.CatalogoCuentasBancos AS cb ON cc.CuentaBancoId = cb.CuentaBancoID WHERE(c.SucursalID = @SucursalID) AND(c.Estatus = 1) AND(c.UsuarioID = @UsuarioID)", parData.SucursalId, userName).FirstOrDefaultAsync();

                //parData.Cuenta = Caja.NumeroCuenta;
                var resVW = await ConexionDB.database.QueryAsync<CatalogoCajasUsuarios_VW>("WHERE (UsuarioID = @0) AND (SucursalID = @1) AND (ProductoID = @2)", parData.UsuarioId, parData.SucursalId, parData.ProductoID).FirstOrDefaultAsync();

                if (!resVW.Activo)
                {
                    await ConexionDB.Destroy();
                    return Ok(new
                    {
                        status = false,
                        msj = "La caja esta cerrada, intente mas tarde"
                    });
                }

                ConexionDB.database.BeginTransaction();

                if (parData.VentaId == 0)
                {
                    var Venta = new Ventas()
                    {
                        UsuarioIDRegistro = UsuarioActual.UsuarioID,
                        PersonaIDRegistro = (long)UsuarioActual.UsuarioID, // VALIDAR
                        FechaHoraRegistro = DateTime.Now
                    };

                    await ConexionDB.database.InsertAsync(Venta);

                    parData.VentaId = Venta.VentaId;
                }

                int? DistribuidorId = parData.DistribuidorId == 0 ? null : parData.DistribuidorId;
                int? ClienteId = parData.ClienteId == 0 ? null : parData.ClienteId;
                long? SerieId = parData.SerieId == 0 ? null : parData.SerieId;
                long? Folio = parData.Folio == 0 ? null : parData.Folio;

                var detalle = new ArrayList();

                switch (parData.Sucursal.sistema)
                {
                    case "VR":
                        parData.LetraSistema = "C";
                        break;
                    case "GYT":
                        parData.LetraSistema = "G";
                        break;
                    case "S3":
                        parData.LetraSistema = "S";
                        break;
                    case "LS4":
                        parData.LetraSistema = "L";
                        break;
                    case "CV":
                        parData.LetraSistema = "CV";
                        break;
                    case "RPS":
                        parData.LetraSistema = "S9_";
                        break;
                    case "PS":
                        parData.LetraSistema = "H";
                        break;
                    default:
                        break;
                }

                foreach (Articulos item in parData.articles)
                {

                    detalle.Add(new
                    {
                        id_sku = item.id,
                        cantidad = item.qty
                    });

                }

                if (parData.articles.Count > 0)
                {
                    if (parData.Monto < 0)
                    {
                        await ConexionDB.Destroy();
                        return BadRequest("Verifique el monto del Artículo");
                    }
                    var Json = new
                    {
                        id_empresa = 1,
                        fecha = DateTime.Now.ToString("yyyy/MM/dd"),
                        sucursal = parData.SucursalId,
                        tipo_usuario1 = "4",
                        id_usuario = parData.LetraSistema.ToString() + parData.DistribuidorId.ToString(),
                        sistema1 = parData.Sucursal.sistema,
                        id_forma_pago = 10,
                        referencia_forma_pago = 0,
                        monedero = 0,
                        detalle
                    };

                    parData.Json = JsonConvert.SerializeObject(Json);
                }
                var parms = new
                {
                    parData.ProductoID,
                    parData.SucursalId,
                    parData.CajaID,
                    parData.Capital,
                    parData.Plazos,
                    parData.UsuarioId,
                    parData.TipoDesembolsoID,
                    parData.PersonaID,
                    parData.MovimientoID,
                    parData.CuentaId,
                    parData.JsonTda,
                    DistribuidorId,
                    ClienteId,
                    SerieId,
                    Folio,
                    parData.FechaExpedicion,
                    parData.NombreBeneficiario,
                    parData.ApellidoPaternoBeneficiario,
                    parData.ApellidoMaternoBeneficiario,
                    parData.ParentescoBeneficiario,
                    parData.FechaNacimientoBeneficiario,
                    parData.Monto,
                    parData.Json
                };

                string Stored = "";

                switch (parData.TipoCanje)
                {
                    case 1:
                        Stored = "EXEC Creditos.pa_CanjeaVale_Ins @ProductoID, @DistribuidorId, @ClienteId, @SucursalId, @CajaID, @SerieId, @Folio, @Capital, @Plazos, @UsuarioId, @TipoDesembolsoID, @PersonaID, @MovimientoID, @FechaExpedicion, @NombreBeneficiario, @ApellidoPaternoBeneficiario, @ApellidoMaternoBeneficiario,@ParentescoBeneficiario, @FechaNacimientoBeneficiario, @Monto, @Json, @Validado";
                        break;

                    case 2:
                        Stored = "EXEC Creditos.pa_VentaTienditaCliente_Ins @ProductoID ,@DistribuidorId ,@ClienteId ,@SucursalId ,@CajaID ,@Capital ,@Plazos ,@UsuarioId ,@TipoDesembolsoID ,@PersonaID ,@MovimientoID ,@JsonTda";
                        break;

                    case 3:
                        Stored = "EXEC Creditos.pa_VentaTiendita_Ins @ProductoID ,@DistribuidorId ,@ClienteId ,@SucursalId ,@CajaID ,@Capital ,@Plazos ,@UsuarioId ,@TipoDesembolsoID ,@PersonaID ,@MovimientoID ,@JsonTda, @PrestamoNomina";
                        break;

                    case 4:
                        Stored = "EXEC Creditos.pa_VentaTienditaContado_Ins @ProductoID ,@DistribuidorId ,@ClienteId ,@CuentaId ,@SucursalId ,@CajaID ,@Capital ,@Plazos ,@UsuarioId ,@TipoDesembolsoID ,@PersonaID ,@MovimientoID ,@JsonTda";
                        break;

                    case 5:
                        Stored = "EXEC Creditos.pa_PrestamoDistribuidor_Ins @ProductoID ,@DistribuidorId ,@ClienteId ,@CuentaId ,@SucursalId ,@CajaID ,@Capital ,@Plazos ,@UsuarioId ,@TipoDesembolsoID ,@PersonaID ,@MovimientoID ,@JsonTda";
                        break;

                    default:
                        ConexionDB.database.AbortTransaction();
                        return BadRequest(new
                        {
                            status = false,
                            msj = "Opcion no disponible"
                        });
                }

                var res = await ConexionDB.database.QueryAsync<CanjeaValeRes>(Stored, parData).FirstOrDefaultAsync();

                if (res.regresa != 1)
                {
                    ConexionDB.database.AbortTransaction();
                    return Ok(res);
                }

                var Credito = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoID = @0", res.CreditoId).FirstOrDefaultAsync();


                Credito.VentaId = parData.VentaId;

                if (parData.personasDatosBancariosID != 0)
                {
                    Credito.personasDatosBancariosID = parData.personasDatosBancariosID;
                }

                await ConexionDB.database.UpdateAsync(Credito);

                //if (parData.FechaExpedicion != null) 
                //{
                //    var Credito = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoID = @0", res.CreditoId).FirstOrDefaultAsync();

                //}
                // crear una variable de tipo lista para guardar los articulos de la tiendita
                foreach (Articulos item in parData.articles)
                {
                    //Mapear pardata.articles para insertar en la tabla CreditoTiendita
                    var tiendita = new CreditoTiendita()
                    {
                        CreditoID = Credito.CreditoID,
                        SKU = item.id.ToString(),
                        Unidades = item.qty,
                        PrecioUnitario = item.price,
                        Descripcion = item.desc,
                        FechaRegistra = DateTime.Now,
                        UsuarioRegistra = UsuarioActual.UsuarioID,
                        PersonaRegistra = UsuarioActual.PersonaID.Value,
                        PrecioOriginal = item.precioOrg,
                        PrecioDescuento = item.price,
                        CodigoSKU = item.code,
                    };

                    if (item.code != null && item.code != "")
                    {
                        var estatusCodigo = new
                        {
                            UsuarioID = UsuarioActual.UsuarioID,
                            CodigoID = 0,
                            Codigo = item.code,
                            Estatus = 'N',
                        };
                        string storedCodigos = "EXEC Creditos.pa_CambiarEstatusCodigosTiendita @UsuarioID,@CodigoID,@Codigo,@Estatus";
                        await ConexionDB.database.QueryAsync<ConfiaWebApi.ModlesSP.Creditos.CodigosTienditaRes>(storedCodigos, estatusCodigo).FirstOrDefaultAsync();
                    }

                    await ConexionDB.database.InsertAsync(tiendita);
                }

                //Mapear pardata.articles para insertar en la tabla CreditoTiendita


                // var tiendita = new CreditoTiendita(){
                //     CreditoID = res.CreditoId,
                //     SKU =  

                // };

                ConexionDB.database.CompleteTransaction();

                res.VentaId = parData.VentaId;

                await ConexionDB.Destroy();

                return Ok(res);

            }
            catch (Exception ex)
            {
                ConexionDB.database.AbortTransaction();
                await ConexionDB.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        [Route("addProductoTiendita")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> AddProductoTiendita(PeticionesRest.Creditos.CanjeaVale.AddProductoTiendita parData, [FromHeader(Name = "ProductoID")] int producto)
        {

            try
            {
                parData.ProductoID = producto;
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                parData.UsuarioId = UsuarioActual.UsuarioID;
                parData.PersonaID = UsuarioActual.PersonaID.Value;

                var resVW = await ConexionDB.database.QueryAsync<CatalogoCajasUsuarios_VW>("WHERE (UsuarioID = @0) AND (SucursalID = @1) AND (ProductoID = @2)", parData.UsuarioId, parData.SucursalId, parData.ProductoID).FirstOrDefaultAsync();

                if (!resVW.Activo)
                {
                    await ConexionDB.Destroy();
                    return Ok(new
                    {
                        status = false,
                        msj = "La caja esta cerrada, intente mas tarde"
                    });
                }

                ConexionDB.database.BeginTransaction();

                int? DistribuidorId = parData.DistribuidorId == 0 ? null : parData.DistribuidorId;
                int? ClienteId = parData.ClienteId == 0 ? null : parData.ClienteId;

                var detalle = new ArrayList();

                switch (parData.Sucursal.sistema)
                {
                    case "VR":
                        parData.LetraSistema = "C";
                        break;
                    case "GYT":
                        parData.LetraSistema = "G";
                        break;
                    case "S3":
                        parData.LetraSistema = "S";
                        break;
                    case "LS4":
                        parData.LetraSistema = "L";
                        break;
                    case "CV":
                        parData.LetraSistema = "CV";
                        break;
                    case "RPS":
                        parData.LetraSistema = "S9_";
                        break;
                    case "PS":
                        parData.LetraSistema = "H";
                        break;
                    default:
                        break;
                }

                foreach (Articulos item in parData.articles)
                {
                    detalle.Add(new
                    {
                        id_sku = item.id,
                        cantidad = item.qty
                    });
                }

                if (parData.articles.Count > 0)
                {
                    if (parData.Monto < 0)
                    {
                        await ConexionDB.Destroy();
                        return BadRequest("Verifique el monto del Artículo");
                    }
                    var Json = new
                    {
                        id_empresa = 1,
                        fecha = DateTime.Now.ToString("yyyy/MM/dd"),
                        sucursal = parData.SucursalId,
                        tipo_usuario1 = "4",
                        id_usuario = parData.LetraSistema.ToString() + parData.DistribuidorId.ToString(),
                        sistema1 = parData.Sucursal.sistema,
                        id_forma_pago = 10,
                        referencia_forma_pago = 0,
                        monedero = 0,
                        detalle
                    };

                    parData.Json = JsonConvert.SerializeObject(Json);
                }

                string Stored = "";

                switch (parData.TipoCanje)
                {
                    case 1:
                        Stored = "EXEC Creditos.pa_AgregarTienditaCreditoCF_Ins @CreditoID, @ProductoID, @DistribuidorId, @CajaID, @ClienteId, @SucursalId, @UsuarioId, @PersonaID, @Monto, @Json, @Validado";
                        break;
                    default:
                        ConexionDB.database.AbortTransaction();
                        return BadRequest(new
                        {
                            status = false,
                            msj = "Opcion no disponible"
                        });
                }

                var res = await ConexionDB.database.QueryAsync<AgregarProductoCreditoRes>(Stored, parData).FirstOrDefaultAsync();

                if (res.regresa != 1)
                {
                    ConexionDB.database.AbortTransaction();
                    return Ok(res);
                }

                // crear una variable de tipo lista para guardar los articulos de la tiendita
                foreach (Articulos item in parData.articles)
                {
                    //Mapear pardata.articles para insertar en la tabla CreditoTiendita
                    var tiendita = new CreditoTiendita()
                    {
                        CreditoID = parData.CreditoID,
                        SKU = item.id.ToString(),
                        Unidades = item.qty,
                        PrecioUnitario = item.price,
                        Descripcion = item.desc,
                        FechaRegistra = DateTime.Now,
                        UsuarioRegistra = UsuarioActual.UsuarioID,
                        PersonaRegistra = UsuarioActual.PersonaID.Value,
                    };

                    await ConexionDB.database.InsertAsync(tiendita);
                }
                var Credito = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Creditos.CreditosCaja_VW>("WHERE CreditoID = @0", parData.CreditoID).FirstOrDefaultAsync();
                res.Credito = Credito;
                ConexionDB.database.CompleteTransaction();
                await ConexionDB.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                ConexionDB.database.AbortTransaction();
                await ConexionDB.Destroy();
                return BadRequest(ex.Message);
            }

        }


        [HttpPost]
        [Route("valezona")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> ValeZona(PeticionesRest.Creditos.CanjeaVale.AddZonal parData)
        {

            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                parData.UsuarioId = UsuarioActual.UsuarioID;
                parData.PersonaID = UsuarioActual.PersonaID.Value;

                ConexionDB.database.BeginTransaction();

                if (parData.VentaId == 0)
                {
                    var Venta = new Ventas()
                    {
                        UsuarioIDRegistro = UsuarioActual.UsuarioID,
                        PersonaIDRegistro = (long)UsuarioActual.PersonaID, // VALIDAR
                        FechaHoraRegistro = DateTime.Now
                    };

                    await ConexionDB.database.InsertAsync(Venta);

                    parData.VentaId = Venta.VentaId;
                }

                int? DistribuidorId = parData.DistribuidorId == 0 ? null : parData.DistribuidorId;
                int? ClienteId = parData.ClienteId == 0 ? null : parData.ClienteId;
                long? SerieId = parData.SerieId == 0 ? null : parData.SerieId;
                long? Folio = parData.Folio == 0 ? null : parData.Folio;
                var detalle = new ArrayList();

                switch (parData.Sucursal.sistema)
                {
                    case "VR":
                        parData.LetraSistema = "C";
                        break;
                    case "GYT":
                        parData.LetraSistema = "G";
                        break;
                    case "S3":
                        parData.LetraSistema = "S";
                        break;
                    case "LS4":
                        parData.LetraSistema = "L";
                        break;
                    case "CV":
                        parData.LetraSistema = "CV";
                        break;
                    case "RPS":
                        parData.LetraSistema = "S9_";
                        break;
                    case "PS":
                        parData.LetraSistema = "H";
                        break;
                    default:
                        break;
                }

                foreach (Articulos item in parData.articles)
                {

                    detalle.Add(new
                    {
                        id_sku = item.id,
                        cantidad = item.qty
                    });

                }

                if (parData.articles.Count > 0)
                {
                    if (parData.Monto < 0)
                    {
                        await ConexionDB.Destroy();
                        return BadRequest("Verifique el monto del Artículo");
                    }
                    var Json = new
                    {
                        id_empresa = 1,
                        fecha = DateTime.Now.ToString("yyyy/MM/dd"),
                        sucursal = parData.SucursalId,
                        tipo_usuario1 = "4",
                        id_usuario = parData.LetraSistema.ToString() + parData.DistribuidorId.ToString(),
                        sistema1 = parData.Sucursal.sistema,
                        id_forma_pago = 10,
                        referencia_forma_pago = 0,
                        monedero = 0,
                        detalle
                    };

                    parData.Json = JsonConvert.SerializeObject(Json);
                }

                string Stored = "";

                switch (parData.TipoCanje)
                {
                    case 1:
                        Stored = "EXEC Creditos.pa_CanjeaValeZona_Ins @ProductoID, @DistribuidorId, @ClienteId, @SucursalId, @SucursalDistID, @CajaID, @SerieId, @Folio, @Capital, @Plazos, @UsuarioId, @TipoDesembolsoID, @PersonaID, @MovimientoID, @FechaExpedicion, @NombreBeneficiario, @ApellidoPaternoBeneficiario, @ApellidoMaternoBeneficiario,@ParentescoBeneficiario, @FechaNacimientoBeneficiario, @Monto, @Json, @Validado";
                        break;

                    default:
                        ConexionDB.database.AbortTransaction();
                        return BadRequest("Opción no disponible");
                }

                var res = await ConexionDB.database.QueryAsync<CanjeaValeRes>(Stored, parData).FirstOrDefaultAsync();

                if (res.regresa != 1)
                {
                    ConexionDB.database.AbortTransaction();
                    return Ok(res);
                }

                var Credito = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoID = @0", res.CreditoId).FirstOrDefaultAsync();

                Credito.VentaId = parData.VentaId;

                if (parData.personasDatosBancariosID != 0)
                {
                    Credito.personasDatosBancariosID = parData.personasDatosBancariosID;
                }

                await ConexionDB.database.UpdateAsync(Credito);

                //if (parData.FechaExpedicion != null) 
                //{
                //    var Credito = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoID = @0", res.CreditoId).FirstOrDefaultAsync();

                //}
                // crear una variable de tipo lista para guardar los articulos de la tiendita
                foreach (Articulos item in parData.articles)
                {
                    //Mapear pardata.articles para insertar en la tabla CreditoTiendita
                    var tiendita = new CreditoTiendita()
                    {
                        CreditoID = Credito.CreditoID,
                        SKU = item.id.ToString(),
                        Unidades = item.qty,
                        PrecioUnitario = item.price,
                        Descripcion = item.desc,
                        FechaRegistra = DateTime.Now,
                        UsuarioRegistra = UsuarioActual.UsuarioID,
                        PersonaRegistra = UsuarioActual.PersonaID.Value,
                        PrecioOriginal = item.precioOrg,
                        PrecioDescuento = item.price,
                        CodigoSKU = item.code,
                    };

                    if (item.code != null && item.code != "")
                    {
                        var estatusCodigo = new
                        {
                            UsuarioID = UsuarioActual.UsuarioID,
                            CodigoID = 0,
                            Codigo = item.code,
                            Estatus = 'N',
                        };
                        string storedCodigos = "EXEC Creditos.pa_CambiarEstatusCodigosTiendita @UsuarioID,@CodigoID,@Codigo,@Estatus";
                        await ConexionDB.database.QueryAsync<ConfiaWebApi.ModlesSP.Creditos.CodigosTienditaRes>(storedCodigos, estatusCodigo).FirstOrDefaultAsync();
                    }

                    await ConexionDB.database.InsertAsync(tiendita);
                }

                ConexionDB.database.CompleteTransaction();

                res.VentaId = parData.VentaId;

                await ConexionDB.Destroy();

                return Ok(res);

            }
            catch (Exception ex)
            {
                ConexionDB.database.AbortTransaction();
                await ConexionDB.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        [Route("update")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> Update(PeticionesRest.Creditos.CanjeaVale.Update parData)
        {

            try
            {
                //var userName = HttpContext.User.Claims.Where(x => x.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier").FirstOrDefault().Value;

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                // var PersonaVw = await ConexionDB.database.QueryAsync<DBContext.DBConfia.General.Personas_VW>("WHERE PersonaID=@0", UsuarioActual.PersonaID).FirstOrDefaultAsync();
                // var UsuarioActual = await DBContext.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
                // var UsuarioActual = await DBContext.database.QueryAsync<USER_ENTITY>("WHERE EMAIL=@0", UserName).FirstOrDefaultAsync();
                // var PersonaActual = await ConexionDB.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.ID).FirstOrDefaultAsync();

                parData.UsuarioId = UsuarioActual.UsuarioID;
                parData.PersonaID = UsuarioActual.PersonaID.Value;

                //var Caja = await DBContext.database.QueryAsync<CatalogoCuentasBancos>("SELECT cb.NumeroCuenta FROM Tesoreria.CatalogoCajas AS c INNER JOIN Tesoreria.CuentasCaja AS cc ON c.CajaID = cc.CajaId INNER JOIN Bancos.CatalogoCuentasBancos AS cb ON cc.CuentaBancoId = cb.CuentaBancoID WHERE(c.SucursalID = @SucursalID) AND(c.Estatus = 1) AND(c.UsuarioID = @UsuarioID)", parData.SucursalId, userName).FirstOrDefaultAsync();

                //parData.Cuenta = Caja.NumeroCuenta;

                ConexionDB.database.BeginTransaction();

                int? DistribuidorId = parData.DistribuidorId == 0 ? null : parData.DistribuidorId;
                int? ClienteId = parData.ClienteId == 0 ? null : parData.ClienteId;
                long? SerieId = parData.SerieId == 0 ? null : parData.SerieId;
                long? Folio = parData.Folio == 0 ? null : parData.Folio;

                var parms = new
                {
                    parData.CreditoId,
                    parData.ProductoID,
                    parData.SucursalId,
                    parData.CajaID,
                    parData.Capital,
                    parData.Plazos,
                    parData.UsuarioId,
                    parData.TipoDesembolsoID,
                    parData.PersonaID,
                    parData.MovimientoID,
                    parData.CuentaId,
                    parData.JsonTda,
                    DistribuidorId,
                    ClienteId,
                    SerieId,
                    Folio,
                    PrestamoNomina = 0,
                    parData.NombreBeneficiario,
                    parData.ParentescoBeneficiario,
                    parData.FechaNacimientoBeneficiario
                };

                string Stored = "";

                switch (parData.TipoCanje)
                {
                    case 1:
                        Stored = "EXEC Creditos.pa_CanjeaVale_Upd @CreditoId, @ProductoID, @DistribuidorId, @ClienteId, @SucursalId, @CajaID, @SerieId, @Folio, @Capital, @Plazos, @UsuarioId, @TipoDesembolsoID, @PersonaID, @MovimientoID";
                        break;

                    //case 2:
                    //    Stored = "EXEC Creditos.pa_VentaTienditaCliente_Ins @ProductoID ,@DistribuidorId ,@ClienteId ,@SucursalId ,@CajaID ,@Capital ,@Plazos ,@UsuarioId ,@TipoDesembolsoID ,@PersonaID ,@MovimientoID ,@JsonTda";
                    //    break;

                    //case 3:
                    //    Stored = "EXEC Creditos.pa_VentaTiendita_Ins @ProductoID ,@DistribuidorId ,@ClienteId ,@SucursalId ,@CajaID ,@Capital ,@Plazos ,@UsuarioId ,@TipoDesembolsoID ,@PersonaID ,@MovimientoID ,@JsonTda, @PrestamoNomina";
                    //    break;

                    //case 4:
                    //    Stored = "EXEC Creditos.pa_VentaTienditaContado_Ins @ProductoID ,@DistribuidorId ,@ClienteId ,@CuentaId ,@SucursalId ,@CajaID ,@Capital ,@Plazos ,@UsuarioId ,@TipoDesembolsoID ,@PersonaID ,@MovimientoID ,@JsonTda";
                    //    break;

                    case 5:
                        Stored = "EXEC Creditos.pa_PrestamoDistribuidor_Upd @CreditoId, @ProductoID ,@DistribuidorId ,@ClienteId ,@SucursalId ,@CajaID ,@Capital ,@Plazos ,@UsuarioId ,@TipoDesembolsoID ,@PersonaID ,@MovimientoID ,@PrestamoNomina";
                        break;

                    default:
                        ConexionDB.database.AbortTransaction();
                        return BadRequest("Opción no disponible");
                }

                var res = await ConexionDB.database.QueryAsync<CanjeaValeRes>(Stored, parData).FirstOrDefaultAsync();

                if (res.regresa != 1)
                {
                    ConexionDB.database.AbortTransaction();
                    return Ok(res);
                }

                var Credito = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoID = @0", res.CreditoId).FirstOrDefaultAsync();

                //Credito.VentaId = parData.VentaId;

                if (parData.personasDatosBancariosID != 0)
                {
                    Credito.personasDatosBancariosID = parData.personasDatosBancariosID;
                }

                await ConexionDB.database.UpdateAsync(Credito);

                ConexionDB.database.CompleteTransaction();

                res.Credito = await ConexionDB.database.QueryAsync<Creditos_VW>("WHERE CreditoID = @0", res.CreditoId).FirstOrDefaultAsync();

                //res.VentaId = parData.VentaId;

                await ConexionDB.Destroy();

                return Ok(res);

            }
            catch (Exception ex)
            {
                ConexionDB.database.AbortTransaction();
                await ConexionDB.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        [Route("tienditacliente")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> TienditaCliente(PeticionesRest.Creditos.CanjeaVale.Add parData, [FromHeader(Name = "ProductoID")] int producto)
        {

            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                parData.UsuarioId = UsuarioActual.UsuarioID;
                parData.PersonaID = UsuarioActual.PersonaID.Value;
                parData.ProductoID = producto;

                ConexionDB.database.BeginTransaction();

                if (parData.VentaId == 0)
                {
                    var Venta = new Ventas()
                    {
                        UsuarioIDRegistro = UsuarioActual.UsuarioID,
                        PersonaIDRegistro = (long)UsuarioActual.UsuarioID, // VALIDAR
                        FechaHoraRegistro = DateTime.Now
                    };

                    await ConexionDB.database.InsertAsync(Venta);

                    parData.VentaId = Venta.VentaId;
                }

                int? DistribuidorId = parData.DistribuidorId == 0 ? null : parData.DistribuidorId;
                int? ClienteId = parData.ClienteId == 0 ? null : parData.ClienteId;
                long? SerieId = parData.SerieId == 0 ? null : parData.SerieId;
                long? Folio = parData.Folio == 0 ? null : parData.Folio;
                var Json = JsonConvert.DeserializeObject<dynamic>(parData.JsonTda)!;

                //var parms = new
                //{
                //    parData.ProductoID,
                //    parData.ProductoTiendita,
                //    parData.SucursalId,
                //    parData.CajaID,
                //    parData.Capital,
                //    parData.Plazos,
                //    parData.UsuarioId,
                //    parData.TipoDesembolsoID,
                //    parData.PersonaID,
                //    parData.MovimientoID,
                //    parData.CuentaId,
                //    parData.JsonTda,
                //    DistribuidorId,
                //    ClienteId,
                //    SerieId,
                //    Folio
                //};

                string Stored = "";

                Stored = "EXEC Creditos.pa_VentaTienditaCliente_Ins @ProductoID ,@ProductoTiendita ,@DistribuidorId ,@ClienteId ,@SucursalId ,@CajaID ,@Capital ,@Plazos ,@UsuarioId ,@TipoDesembolsoID ,@PersonaID ,@MovimientoID ,@JsonTda ,@regresa OUTPUT ,@msj OUTPUT ,@CreditoId OUTPUT";

                //var telefonia = new ArrayList();
                var otros = new ArrayList();
                ArrayList Creditos = new();
                //decimal telCapital = 0;
                decimal otroCapital = 0;

                foreach (Articulos item in parData.articles)
                {
                    //var tiendita = await ConexionDB.database.QueryAsync<TienditaCelulares_VW>("WHERE id_sku = @0", item.id).FirstOrDefaultAsync();

                    //if (tiendita != null)
                    //{
                    //    telefonia.Add(new
                    //    {
                    //        id_sku = item.id,
                    //        cantidad = item.qty
                    //    });

                    //    telCapital += item.qty * item.price;
                    //}
                    //else
                    //{
                    otros.Add(new
                    {
                        id_sku = item.id,
                        cantidad = item.qty
                    });

                    otroCapital += item.qty * item.price;
                    //}
                }

                var aux = (string)Json.sucursal;
                var sucursal = "";

                if (!String.IsNullOrWhiteSpace(aux))
                {
                    int charLocation = aux.IndexOf("|", StringComparison.Ordinal);

                    if (charLocation > 0)
                    {
                        sucursal = aux.Substring(0, charLocation);
                    }
                }

                //if (telefonia.Count > 0)
                //{
                //    var JsonTda = new
                //    {
                //        id_empresa = (int)Json.id_empresa,
                //        sucursal,
                //        tipo_usuario1 = "4",
                //        id_usuario = $"CV{parData.ClienteId}",
                //        sistema1 = (string)Json.sistema1,
                //        id_forma_pago = "10",
                //        referencia_forma_pago = "@Credito",
                //        detalle = telefonia
                //    };

                //    parData.JsonTda = JsonConvert.SerializeObject(JsonTda);

                //    parData.Plazos = 18;

                //    parData.Compra = telCapital;

                //    //var res = await ConexionDB.database.QueryAsync<CanjeaValeRes>(Stored, parData).FirstOrDefaultAsync();

                //    SqlParameter regresa = new("@regresa", SqlDbType.Int)
                //    {
                //        Direction = ParameterDirection.Output
                //    };

                //    SqlParameter msj = new("@msj", SqlDbType.VarChar)
                //    {
                //        Direction = ParameterDirection.Output,
                //        Size = 250
                //    };

                //    SqlParameter CreditoId = new("@CreditoId", SqlDbType.BigInt)
                //    {
                //        Direction = ParameterDirection.Output
                //    };

                //    Sql sql = Sql.Builder.Append(Stored, new
                //    {
                //        parData.ProductoID,
                //        parData.ProductoTiendita,
                //        parData.DistribuidorId,
                //        parData.ClienteId,
                //        parData.SucursalId,
                //        parData.CajaID,
                //        Capital = parData.Compra,
                //        parData.Plazos,
                //        parData.UsuarioId,
                //        parData.TipoDesembolsoID,
                //        parData.PersonaID,
                //        parData.MovimientoID,
                //        parData.JsonTda,
                //        parData.PrestamoNomina,
                //        regresa,
                //        msj,
                //        CreditoId
                //    });

                //    var res = await ConexionDB.database.QueryAsync<TienditaRes>(sql).ToArrayAsync();

                //    var skus = res.Where(x => x.id_sku > 0).Select(x => x).ToArray();

                //    if ((int)regresa.Value != 1)
                //    {
                //        var errRes = new
                //        {
                //            //res = res.regresa,
                //            //res.msj,
                //            res = (int)regresa.Value,
                //            msj = (string)msj.Value,
                //            Data = new { }
                //        };

                //        ConexionDB.database.AbortTransaction();
                //        return Ok(errRes);
                //    }

                //    foreach (var sku in skus)
                //    {
                //        TienditaRes mo = new()
                //        {
                //            CreditoId = (long)CreditoId.Value,
                //            id_sku = sku.id_sku,
                //            id_ticket = sku.id_ticket
                //        };

                //        Creditos.Add(mo);
                //    }

                //}

                if (otros.Count > 0)
                {
                    var JsonTda = new
                    {
                        id_empresa = (int)Json.id_empresa,
                        sucursal,
                        tipo_usuario1 = "4",
                        id_usuario = $"CV{parData.ClienteId}",
                        sistema1 = (string)Json.sistema1,
                        id_forma_pago = "10",
                        referencia_forma_pago = "@Credito",
                        detalle = otros
                    };

                    parData.JsonTda = JsonConvert.SerializeObject(JsonTda);

                    parData.Compra = otroCapital;

                    //var res = await ConexionDB.database.QueryAsync<CanjeaValeRes>(Stored, parData).FirstOrDefaultAsync();

                    SqlParameter regresa = new("@regresa", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };

                    SqlParameter msj = new("@msj", SqlDbType.VarChar)
                    {
                        Direction = ParameterDirection.Output,
                        Size = 250
                    };

                    SqlParameter CreditoId = new("@CreditoId", SqlDbType.BigInt)
                    {
                        Direction = ParameterDirection.Output
                    };

                    Sql sql = Sql.Builder.Append(Stored, new
                    {
                        parData.ProductoID,
                        parData.ProductoTiendita,
                        parData.DistribuidorId,
                        parData.ClienteId,
                        parData.SucursalId,
                        parData.CajaID,
                        Capital = parData.Compra,
                        parData.Plazos,
                        parData.UsuarioId,
                        parData.TipoDesembolsoID,
                        parData.PersonaID,
                        parData.MovimientoID,
                        parData.JsonTda,
                        regresa,
                        msj,
                        CreditoId
                    });

                    var res = await ConexionDB.database.QueryAsync<TienditaRes>(sql).ToArrayAsync();

                    var skus = res.Where(x => x.id_sku > 0).Select(x => x).ToArray();

                    if ((int)regresa.Value != 1)
                    {
                        var errRes = new
                        {
                            //res = res.regresa,
                            //res.msj,
                            res = (int)regresa.Value,
                            msj = (string)msj.Value,
                            Data = new { }
                        };

                        ConexionDB.database.AbortTransaction();
                        return Ok(errRes);
                    }

                    foreach (var sku in skus)
                    {
                        TienditaRes mo = new()
                        {
                            CreditoId = (long)CreditoId.Value,
                            id_sku = sku.id_sku,
                            id_ticket = sku.id_ticket
                        };

                        Creditos.Add(mo);
                    }

                }

                long caux = 0;

                foreach (object o in Creditos)
                {
                    TienditaRes Credit = (TienditaRes)o;

                    if (caux != Credit.CreditoId.Value)
                    {
                        caux = Credit.CreditoId.Value;

                        var Credito = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoID = @0", Credit.CreditoId.Value).FirstOrDefaultAsync();

                        Credito.VentaId = parData.VentaId;

                        if (parData.personasDatosBancariosID != 0)
                        {
                            Credito.personasDatosBancariosID = parData.personasDatosBancariosID;
                        }

                        await ConexionDB.database.UpdateAsync(Credito);
                    }

                    // var CreditoTiendita = new CreditosTiendita
                    // {
                    //     CreditoID = caux,
                    //     id_sku = Credit.id_sku,
                    //     id_ticket = Credit.id_ticket,
                    //     UsuarioRegistroID = parData.UsuarioId,
                    //     FechaHoraRegistro = DateTime.Now
                    // };

                    // await ConexionDB.database.InsertAsync(CreditoTiendita);

                    //await ConexionDB.database.InsertAsync(CreditoTiendita);
                }

                //ConexionDB.database.CompleteTransaction();

                //res.VentaId = parData.VentaId;

                await ConexionDB.Destroy();

                return Ok(new
                {
                    regresa = 1,
                    msj = "Exito",
                    CreditoId = caux
                });


                //var res = await ConexionDB.database.QueryAsync<CanjeaValeRes>(Stored, parData).FirstOrDefaultAsync();

                //if (res.regresa != 1)
                //{
                //    ConexionDB.database.AbortTransaction();
                //    return Ok(res);
                //}

                //var Credito = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoID = @0", res.CreditoId).FirstOrDefaultAsync();

                //Credito.VentaId = parData.VentaId;

                //if (parData.personasDatosBancariosID != 0)
                //{
                //    Credito.personasDatosBancariosID = parData.personasDatosBancariosID;
                //}

                //await ConexionDB.database.UpdateAsync(Credito);

                //ConexionDB.database.CompleteTransaction();

                //res.VentaId = parData.VentaId;

                //await ConexionDB.Destroy();

                //return Ok(res);

            }
            catch (Exception ex)
            {
                ConexionDB.database.AbortTransaction();
                await ConexionDB.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        [Route("tiendita")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> Tiendita(PeticionesRest.Creditos.CanjeaVale.Add parData, [FromHeader(Name = "ProductoID")] int producto)
        {

            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                parData.UsuarioId = UsuarioActual.UsuarioID;
                parData.PersonaID = UsuarioActual.PersonaID.Value;
                parData.ProductoID = producto;

                ConexionDB.database.BeginTransaction();

                if (parData.VentaId == 0)
                {
                    var Venta = new Ventas()
                    {
                        UsuarioIDRegistro = UsuarioActual.UsuarioID,
                        PersonaIDRegistro = (long)UsuarioActual.UsuarioID,
                        FechaHoraRegistro = DateTime.Now
                    };

                    await ConexionDB.database.InsertAsync(Venta);

                    parData.VentaId = Venta.VentaId;
                }

                int? DistribuidorId = parData.DistribuidorId == 0 ? null : parData.DistribuidorId;
                int? ClienteId = parData.ClienteId == 0 ? null : parData.ClienteId;
                long? SerieId = parData.SerieId == 0 ? null : parData.SerieId;
                long? Folio = parData.Folio == 0 ? null : parData.Folio;
                var Json = JsonConvert.DeserializeObject<dynamic>(parData.JsonTda)!;

                //var parms = new
                //{
                //    parData.ProductoID,
                //    parData.ProductoTiendita,
                //    parData.SucursalId,
                //    parData.CajaID,
                //    parData.Capital,
                //    parData.Plazos,
                //    parData.UsuarioId,
                //    parData.TipoDesembolsoID,
                //    parData.PersonaID,
                //    parData.MovimientoID,
                //    parData.CuentaId,
                //    parData.JsonTda,
                //    DistribuidorId,
                //    ClienteId,
                //    SerieId,
                //    Folio
                //};

                if (parData.PrestamoNomina)
                {

                    if (parData.Capital > 6000)
                    {
                        var rEmp = new CanjeaValeRes
                        {
                            regresa = -1,
                            msj = $"El limite de compra en tiendita es de ${parData.Capital}."
                        };
                        ConexionDB.database.AbortTransaction();
                        return Ok(rEmp);
                    }

                    var Empleado = await ConexionDB.database.QueryAsync<Empleado_VW>("WHERE (PersonaID = @ClienteId)", parData).SingleOrDefaultAsync();

                    DateTime startDate = Empleado.Emp_fecha_ingreso.Value;
                    DateTime endDate = DateTime.Today;

                    int nbMonths = ((endDate.Year - startDate.Year) * 12) + endDate.Month - startDate.Month;

                    if (nbMonths < 4)
                    {
                        var rEmp = new CanjeaValeRes
                        {
                            regresa = -2,
                            msj = "El empleado debe tener una antigüedad de 4 meses para poder comprar en tiendita."
                        };
                        ConexionDB.database.AbortTransaction();
                        return Ok(rEmp);
                    }

                    var Credi = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE (ClienteID = @ClienteId) AND (EstatusID = 'A' OR EstatusID = 'P')", parData).FirstOrDefaultAsync();

                    if (Credi != null)
                    {
                        var rEmp = new CanjeaValeRes
                        {
                            regresa = -3,
                            msj = "El empleado ya tiene un crédito de tiendita, no es posible comprar."
                        };
                        ConexionDB.database.AbortTransaction();
                        return Ok(rEmp);
                    }

                    var SueldoMensual = (Empleado.Emp_sueldo_fiscal.Value + Empleado.Emp_sueldo_nfiscal.Value) * 30;

                    var Limite = SueldoMensual * 0.25M;

                    if (parData.Capital > Limite)
                    {
                        var rEmp = new CanjeaValeRes
                        {
                            regresa = -4,
                            msj = $"El empleado tiene como limite {Limite} crédito en tiendita, no es podible comprar."
                        };
                        ConexionDB.database.AbortTransaction();
                        return Ok(rEmp);
                    }

                }

                string Stored = "";

                Stored = "EXEC Creditos.pa_VentaTiendita_Ins @ProductoID ,@ProductoTiendita ,@DistribuidorId ,@ClienteId ,@SucursalId ,@CajaID ,@Capital ,@Plazos ,@UsuarioId ,@TipoDesembolsoID ,@PersonaID ,@MovimientoID ,@JsonTda ,@PrestamoNomina ,@regresa OUTPUT ,@msj OUTPUT ,@CreditoId OUTPUT";

                //List<Articulos> telefonia = null;
                //List<Articulos> otros = null; 
                var telefonia = new ArrayList();
                var otros = new ArrayList();
                ArrayList Creditos = new ArrayList();
                decimal telCapital = 0;
                decimal otroCapital = 0;

                foreach (Articulos item in parData.articles)
                {
                    var tiendita = await ConexionDB.database.QueryAsync<TienditaCelulares_VW>("WHERE id_sku = @0", item.id).FirstOrDefaultAsync();

                    if (tiendita != null)
                    {
                        telefonia.Add(new
                        {
                            id_sku = item.id,
                            cantidad = item.qty
                        });

                        telCapital += item.qty * item.price;
                    }
                    else
                    {
                        otros.Add(new
                        {
                            id_sku = item.id,
                            cantidad = item.qty
                        });

                        otroCapital += item.qty * item.price;
                    }
                }

                var aux = (string)Json.sucursal;
                var sucursal = "";

                if (!String.IsNullOrWhiteSpace(aux))
                {
                    int charLocation = aux.IndexOf("|", StringComparison.Ordinal);

                    if (charLocation > 0)
                    {
                        sucursal = aux.Substring(0, charLocation);
                    }
                }

                if (telefonia.Count > 0)
                {
                    var JsonTda = new
                    {
                        id_empresa = (int)Json.id_empresa,
                        sucursal,
                        tipo_usuario1 = (string)Json.tipo_usuario1,
                        id_usuario = $"CV{parData.ClienteId}",
                        sistema1 = (string)Json.sistema1,
                        id_forma_pago = "10",
                        referencia_forma_pago = "@Credito",
                        detalle = telefonia
                    };

                    parData.JsonTda = JsonConvert.SerializeObject(JsonTda);

                    parData.Plazos = 18;

                    parData.Compra = telCapital;

                    //var res = await ConexionDB.database.QueryAsync<CanjeaValeRes>(Stored, parData).FirstOrDefaultAsync();

                    SqlParameter regresa = new("@regresa", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };

                    SqlParameter msj = new("@msj", SqlDbType.VarChar)
                    {
                        Direction = ParameterDirection.Output,
                        Size = 250
                    };

                    SqlParameter CreditoId = new("@CreditoId", SqlDbType.BigInt)
                    {
                        Direction = ParameterDirection.Output
                    };

                    Sql sql = Sql.Builder.Append(Stored, new
                    {
                        parData.ProductoID,
                        parData.ProductoTiendita,
                        parData.DistribuidorId,
                        parData.ClienteId,
                        parData.SucursalId,
                        parData.CajaID,
                        Capital = parData.Compra,
                        parData.Plazos,
                        parData.UsuarioId,
                        parData.TipoDesembolsoID,
                        parData.PersonaID,
                        parData.MovimientoID,
                        parData.JsonTda,
                        parData.PrestamoNomina,
                        regresa,
                        msj,
                        CreditoId
                    });

                    var res = await ConexionDB.database.QueryAsync<TienditaRes>(sql).ToArrayAsync();

                    var skus = res.Where(x => x.id_sku > 0).Select(x => x).ToArray();

                    if ((int)regresa.Value != 1)
                    {
                        var errRes = new
                        {
                            //res = res.regresa,
                            //res.msj,
                            res = (int)regresa.Value,
                            msj = (string)msj.Value,
                            Data = new { }
                        };

                        ConexionDB.database.AbortTransaction();
                        return Ok(errRes);
                    }

                    foreach (var sku in skus)
                    {
                        TienditaRes mo = new()
                        {
                            CreditoId = (long)CreditoId.Value,
                            id_sku = sku.id_sku,
                            id_ticket = sku.id_ticket
                        };

                        Creditos.Add(mo);
                    }

                }

                if (otros.Count > 0)
                {
                    var JsonTda = new
                    {
                        id_empresa = (int)Json.id_empresa,
                        sucursal,
                        tipo_usuario1 = (string)Json.tipo_usuario1,
                        id_usuario = $"CV{parData.ClienteId}",
                        sistema1 = (string)Json.sistema1,
                        id_forma_pago = "10",
                        referencia_forma_pago = "@Credito",
                        detalle = otros
                    };

                    parData.JsonTda = JsonConvert.SerializeObject(JsonTda);

                    parData.Compra = otroCapital;

                    //var res = await ConexionDB.database.QueryAsync<CanjeaValeRes>(Stored, parData).FirstOrDefaultAsync();

                    SqlParameter regresa = new("@regresa", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };

                    SqlParameter msj = new("@msj", SqlDbType.VarChar)
                    {
                        Direction = ParameterDirection.Output,
                        Size = 250
                    };

                    SqlParameter CreditoId = new("@CreditoId", SqlDbType.BigInt)
                    {
                        Direction = ParameterDirection.Output
                    };

                    Sql sql = Sql.Builder.Append(Stored, new
                    {
                        parData.ProductoID,
                        parData.ProductoTiendita,
                        parData.DistribuidorId,
                        parData.ClienteId,
                        parData.SucursalId,
                        parData.CajaID,
                        Capital = parData.Compra,
                        parData.Plazos,
                        parData.UsuarioId,
                        parData.TipoDesembolsoID,
                        parData.PersonaID,
                        parData.MovimientoID,
                        parData.JsonTda,
                        parData.PrestamoNomina,
                        regresa,
                        msj,
                        CreditoId
                    });

                    var res = await ConexionDB.database.QueryAsync<TienditaRes>(sql).ToArrayAsync();

                    var skus = res.Where(x => x.id_sku > 0).Select(x => x).ToArray();

                    if ((int)regresa.Value != 1)
                    {
                        var errRes = new
                        {
                            //res = res.regresa,
                            //res.msj,
                            res = (int)regresa.Value,
                            msj = (string)msj.Value,
                            Data = new { }
                        };

                        ConexionDB.database.AbortTransaction();
                        return Ok(errRes);
                    }

                    foreach (var sku in skus)
                    {
                        TienditaRes mo = new()
                        {
                            CreditoId = (long)CreditoId.Value,
                            id_sku = sku.id_sku,
                            id_ticket = sku.id_ticket
                        };

                        Creditos.Add(mo);
                    }

                }

                long caux = 0;

                foreach (object o in Creditos)
                {
                    TienditaRes Credit = (TienditaRes)o;

                    if (caux != Credit.CreditoId.Value)
                    {
                        caux = Credit.CreditoId.Value;

                        var Credito = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoID = @0", Credit.CreditoId.Value).FirstOrDefaultAsync();

                        Credito.VentaId = parData.VentaId;

                        if (parData.personasDatosBancariosID != 0)
                        {
                            Credito.personasDatosBancariosID = parData.personasDatosBancariosID;
                        }

                        await ConexionDB.database.UpdateAsync(Credito);
                    }

                    // var CreditoTiendita = new CreditosTiendita
                    // {
                    //     CreditoID = caux,
                    //     id_sku = Credit.id_sku,
                    //     id_ticket = Credit.id_ticket,
                    //     UsuarioRegistroID = parData.UsuarioId,
                    //     FechaHoraRegistro = DateTime.Now
                    // };

                    // await ConexionDB.database.InsertAsync(CreditoTiendita);

                }

                ConexionDB.database.CompleteTransaction();

                //res.VentaId = parData.VentaId;

                await ConexionDB.Destroy();

                return Ok(new
                {
                    regresa = 1,
                    msj = "Exito"
                });

            }
            catch (Exception ex)
            {
                ConexionDB.database.AbortTransaction();
                await ConexionDB.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        [Route("tienditacontado")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> TienditaContado(PeticionesRest.Creditos.CanjeaVale.Add parData, [FromHeader(Name = "ProductoID")] int producto)
        {

            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                parData.UsuarioId = UsuarioActual.UsuarioID;
                parData.PersonaID = UsuarioActual.PersonaID.Value;
                parData.ProductoID = producto;

                ConexionDB.database.BeginTransaction();

                if (parData.VentaId == 0)
                {
                    var Venta = new Ventas()
                    {
                        UsuarioIDRegistro = UsuarioActual.UsuarioID,
                        PersonaIDRegistro = (long)UsuarioActual.UsuarioID,
                        FechaHoraRegistro = DateTime.Now
                    };

                    await ConexionDB.database.InsertAsync(Venta);

                    parData.VentaId = Venta.VentaId;
                }

                int? DistribuidorId = parData.DistribuidorId == 0 ? null : parData.DistribuidorId;
                int? ClienteId = parData.ClienteId == 0 ? null : parData.ClienteId;
                long? SerieId = parData.SerieId == 0 ? null : parData.SerieId;
                long? Folio = parData.Folio == 0 ? null : parData.Folio;
                var Json = JsonConvert.DeserializeObject<dynamic>(parData.JsonTda)!;

                string Stored = "";

                Stored = "EXEC Creditos.pa_VentaTienditaContado_Ins @ProductoID ,@ProductoTiendita ,@DistribuidorId ,@ClienteId ,@CuentaId ,@SucursalId ,@CajaID ,@Capital ,@Plazos ,@UsuarioId ,@TipoDesembolsoID ,@PersonaID ,@MovimientoID ,@JsonTda ,@regresa OUTPUT ,@msj OUTPUT ,@CreditoId OUTPUT ";

                //var telefonia = new ArrayList();
                var otros = new ArrayList();
                ArrayList Creditos = new ArrayList();
                //decimal telCapital = 0;
                decimal otroCapital = 0;

                foreach (Articulos item in parData.articles)
                {
                    otros.Add(new
                    {
                        id_sku = item.id,
                        cantidad = item.qty
                    });

                    otroCapital += item.qty * item.price;
                }

                var aux = (string)Json.sucursal;
                var sucursal = "";

                if (!String.IsNullOrWhiteSpace(aux))
                {
                    int charLocation = aux.IndexOf("|", StringComparison.Ordinal);

                    if (charLocation > 0)
                    {
                        sucursal = aux.Substring(0, charLocation);
                    }
                }

                if (otros.Count > 0)
                {
                    var JsonTda = new
                    {
                        id_empresa = (int)Json.id_empresa,
                        sucursal,
                        tipo_usuario1 = (string)Json.tipo_usuario1,
                        id_usuario = $"CV{parData.ClienteId}",
                        sistema1 = (string)Json.sistema1,
                        id_forma_pago = "10",
                        referencia_forma_pago = "@Credito",
                        detalle = otros
                    };

                    parData.JsonTda = JsonConvert.SerializeObject(JsonTda);

                    parData.Compra = otroCapital;

                    //var res = await ConexionDB.database.QueryAsync<CanjeaValeRes>(Stored, parData).FirstOrDefaultAsync();

                    SqlParameter regresa = new("@regresa", SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };

                    SqlParameter msj = new("@msj", SqlDbType.VarChar)
                    {
                        Direction = ParameterDirection.Output,
                        Size = 250
                    };

                    SqlParameter CreditoId = new("@CreditoId", SqlDbType.BigInt)
                    {
                        Direction = ParameterDirection.Output
                    };

                    Sql sql = Sql.Builder.Append(Stored, new
                    {
                        parData.ProductoID,
                        parData.ProductoTiendita,
                        parData.DistribuidorId,
                        parData.ClienteId,
                        parData.CuentaId,
                        parData.SucursalId,
                        parData.CajaID,
                        Capital = parData.Compra,
                        Plazos = 1,//parData.Plazos,
                        parData.UsuarioId,
                        parData.TipoDesembolsoID,
                        parData.PersonaID,
                        parData.MovimientoID,
                        parData.JsonTda,
                        regresa,
                        msj,
                        CreditoId
                    });

                    var res = await ConexionDB.database.QueryAsync<TienditaRes>(sql).ToArrayAsync();

                    var skus = res.Where(x => x.id_sku > 0).Select(x => x).ToArray();

                    if ((int)regresa.Value != 1)
                    {
                        var errRes = new
                        {
                            //res = res.regresa,
                            //res.msj,
                            res = (int)regresa.Value,
                            msj = (string)msj.Value,
                            Data = new { }
                        };

                        ConexionDB.database.AbortTransaction();
                        return Ok(errRes);
                    }

                    foreach (var sku in skus)
                    {
                        TienditaRes mo = new()
                        {
                            CreditoId = (long)CreditoId.Value,
                            id_sku = sku.id_sku,
                            id_ticket = sku.id_ticket
                        };

                        Creditos.Add(mo);
                    }

                }

                long caux = 0;

                foreach (object o in Creditos)
                {
                    TienditaRes Credit = (TienditaRes)o;

                    if (caux != Credit.CreditoId.Value)
                    {
                        caux = Credit.CreditoId.Value;

                        var Credito = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoID = @0", Credit.CreditoId.Value).FirstOrDefaultAsync();

                        Credito.VentaId = parData.VentaId;

                        if (parData.personasDatosBancariosID != 0)
                        {
                            Credito.personasDatosBancariosID = parData.personasDatosBancariosID;
                        }

                        await ConexionDB.database.UpdateAsync(Credito);
                    }

                    // var CreditoTiendita = new CreditosTiendita
                    // {
                    //     CreditoID = caux,
                    //     id_sku = Credit.id_sku,
                    //     id_ticket = Credit.id_ticket,
                    //     UsuarioRegistroID = parData.UsuarioId,
                    //     FechaHoraRegistro = DateTime.Now
                    // };

                    // await ConexionDB.database.InsertAsync(CreditoTiendita);

                    //await ConexionDB.database.InsertAsync(CreditoTiendita);
                }

                ConexionDB.database.CompleteTransaction();

                //res.VentaId = parData.VentaId;

                await ConexionDB.Destroy();

                return Ok(new
                {
                    regresa = 1,
                    msj = "Exito"
                });

            }
            catch (Exception ex)
            {
                ConexionDB.database.AbortTransaction();
                await ConexionDB.Destroy();
                return BadRequest(ex.Message);
            }

        }

        // [HttpPost]
        // [Route("tienditacontado")]
        // [Authorize]
        // [Code.TProteccionProducto]
        // public async Task<ActionResult> TienditaContado(PeticionesRest.Creditos.CanjeaVale.Add parData, [FromHeader(Name = "ProductoID")] int producto)
        // {

        //     try
        //     {
        //         var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
        //         var UsuarioActual = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
        //         parData.UsuarioId = UsuarioActual.UsuarioID;
        //         parData.PersonaID = UsuarioActual.PersonaID.Value;
        //         parData.ProductoID = producto;

        //         ConexionDB.database.BeginTransaction();

        //         if (parData.VentaId == 0)
        //         {
        //             var Venta = new Ventas()
        //             {
        //                 UsuarioIDRegistro = UsuarioActual.UsuarioID,
        //                 PersonaIDRegistro = (long)UsuarioActual.UsuarioID,
        //                 FechaHoraRegistro = DateTime.Now
        //             };

        //             await ConexionDB.database.InsertAsync(Venta);

        //             parData.VentaId = Venta.VentaId;
        //         }

        //         int? DistribuidorId = parData.DistribuidorId == 0 ? null : parData.DistribuidorId;
        //         int? ClienteId = parData.ClienteId == 0 ? null : parData.ClienteId;
        //         long? SerieId = parData.SerieId == 0 ? null : parData.SerieId;
        //         long? Folio = parData.Folio == 0 ? null : parData.Folio;
        //         var Json = JsonConvert.DeserializeObject<dynamic>(parData.JsonTda)!;

        //         string Stored = "";

        //         Stored = "EXEC Creditos.pa_VentaTienditaContado_Ins @ProductoID ,@ProductoTiendita ,@DistribuidorId ,@ClienteId ,@CuentaId ,@SucursalId ,@CajaID ,@Capital ,@Plazos ,@UsuarioId ,@TipoDesembolsoID ,@PersonaID ,@MovimientoID ,@JsonTda ,@regresa OUTPUT ,@msj OUTPUT ,@CreditoId OUTPUT ";

        //         //var telefonia = new ArrayList();
        //         var otros = new ArrayList();
        //         ArrayList Creditos = new ArrayList();
        //         //decimal telCapital = 0;
        //         decimal otroCapital = 0;

        //         foreach (Articulos item in parData.articles)
        //         {
        //             otros.Add(new
        //             {
        //                 id_sku = item.id,
        //                 cantidad = item.qty
        //             });

        //             otroCapital += item.qty * item.price;
        //         }

        //         var aux = (string)Json.sucursal;
        //         var sucursal = "";

        //         if (!String.IsNullOrWhiteSpace(aux))
        //         {
        //             int charLocation = aux.IndexOf("|", StringComparison.Ordinal);

        //             if (charLocation > 0)
        //             {
        //                 sucursal = aux.Substring(0, charLocation);
        //             }
        //         }

        //         if (otros.Count > 0)
        //         {
        //             var JsonTda = new
        //             {
        //                 id_empresa = (int)Json.id_empresa,
        //                 sucursal,
        //                 tipo_usuario1 = (string)Json.tipo_usuario1,
        //                 id_usuario = $"CV{parData.ClienteId}",
        //                 sistema1 = (string)Json.sistema1,
        //                 id_forma_pago = "10",
        //                 referencia_forma_pago = "@Credito",
        //                 detalle = otros
        //             };

        //             parData.JsonTda = JsonConvert.SerializeObject(JsonTda);

        //             parData.Compra = otroCapital;

        //             //var res = await ConexionDB.database.QueryAsync<CanjeaValeRes>(Stored, parData).FirstOrDefaultAsync();

        //             SqlParameter regresa = new("@regresa", SqlDbType.Int)
        //             {
        //                 Direction = ParameterDirection.Output
        //             };

        //             SqlParameter msj = new("@msj", SqlDbType.VarChar)
        //             {
        //                 Direction = ParameterDirection.Output,
        //                 Size = 250
        //             };

        //             SqlParameter CreditoId = new("@CreditoId", SqlDbType.BigInt)
        //             {
        //                 Direction = ParameterDirection.Output
        //             };

        //             Sql sql = Sql.Builder.Append(Stored, new
        //             {
        //                 parData.ProductoID,
        //                 parData.ProductoTiendita,
        //                 parData.DistribuidorId,
        //                 parData.ClienteId,
        //                 parData.CuentaId,
        //                 parData.SucursalId,
        //                 parData.CajaID,
        //                 Capital = parData.Compra,
        //                 Plazos = 1,//parData.Plazos,
        //                 parData.UsuarioId,
        //                 parData.TipoDesembolsoID,
        //                 parData.PersonaID,
        //                 parData.MovimientoID,
        //                 parData.JsonTda,
        //                 regresa,
        //                 msj,
        //                 CreditoId
        //             });

        //             var res = await ConexionDB.database.QueryAsync<TienditaRes>(sql).ToArrayAsync();

        //             var skus = res.Where(x => x.id_sku > 0).Select(x => x).ToArray();

        //             if ((int)regresa.Value != 1)
        //             {
        //                 var errRes = new
        //                 {
        //                     //res = res.regresa,
        //                     //res.msj,
        //                     res = (int)regresa.Value,
        //                     msj = (string)msj.Value,
        //                     Data = new { }
        //                 };

        //                 ConexionDB.database.AbortTransaction();
        //                 return Ok(errRes);
        //             }

        //             foreach (var sku in skus)
        //             {
        //                 TienditaRes mo = new()
        //                 {
        //                     CreditoId = (long)CreditoId.Value,
        //                     id_sku = sku.id_sku,
        //                     id_ticket = sku.id_ticket
        //                 };

        //                 Creditos.Add(mo);
        //             }

        //         }

        //         long caux = 0;

        //         foreach (object o in Creditos)
        //         {
        //             TienditaRes Credit = (TienditaRes)o;

        //             if (caux != Credit.CreditoId.Value)
        //             {
        //                 caux = Credit.CreditoId.Value;

        //                 var Credito = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoID = @0", Credit.CreditoId.Value).FirstOrDefaultAsync();

        //                 Credito.VentaId = parData.VentaId;

        //                 if (parData.personasDatosBancariosID != 0)
        //                 {
        //                     Credito.personasDatosBancariosID = parData.personasDatosBancariosID;
        //                 }

        //                 await ConexionDB.database.UpdateAsync(Credito);
        //             }

        //             /*var CreditoTiendita = new CreditosTiendita
        //             {
        //                 CreditoID = caux,
        //                 id_sku = Credit.id_sku,
        //                 id_ticket = Credit.id_ticket,
        //                 UsuarioRegistroID = parData.UsuarioId,
        //                 FechaHoraRegistro = DateTime.Now
        //             };

        //             await ConexionDB.database.InsertAsync(CreditoTiendita); */

        //         //res.VentaId = parData.VentaId;

        //         await ConexionDB.Destroy();

        //             return Ok(new
        //             {
        //                 regresa = 1,
        //                 msj = "Exito"
        //             });

        //         }}
        //     catch (Exception ex)
        //     {
        //         ConexionDB.database.AbortTransaction();
        //         await ConexionDB.Destroy();
        //         return BadRequest(ex.Message);
        //     }

        // }

        [HttpPost]
        [Route("presdist")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> PresDist(PeticionesRest.Creditos.CanjeaVale.Add parData)
        {

            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                parData.UsuarioId = UsuarioActual.UsuarioID;
                parData.PersonaID = UsuarioActual.PersonaID.Value;

                var MontoGlobal = await ConexionDB.database.QueryAsync<VariablesGlobales>("WHERE (varName = @0)", "MontoMaximoPrestamoPersonal").FirstOrDefaultAsync();
                int Monto = Int32.Parse((string)MontoGlobal.varValue);

                if (parData.Capital < Monto)
                {
                    ConexionDB.database.BeginTransaction();

                    if (parData.VentaId == 0)
                    {
                        var Venta = new Ventas()
                        {
                            UsuarioIDRegistro = UsuarioActual.UsuarioID,
                            PersonaIDRegistro = (long)UsuarioActual.UsuarioID,
                            FechaHoraRegistro = DateTime.Now
                        };

                        await ConexionDB.database.InsertAsync(Venta);

                        parData.VentaId = Venta.VentaId;
                    }

                    int? DistribuidorId = parData.DistribuidorId == 0 ? null : parData.DistribuidorId;
                    int? ClienteId = parData.ClienteId == 0 ? null : parData.ClienteId;
                    long? SerieId = parData.SerieId == 0 ? null : parData.SerieId;
                    long? Folio = parData.Folio == 0 ? null : parData.Folio;

                    var parms = new
                    {
                        parData.ProductoID,
                        parData.SucursalId,
                        parData.CajaID,
                        parData.Capital,
                        parData.Plazos,
                        parData.UsuarioId,
                        parData.TipoDesembolsoID,
                        parData.PersonaID,
                        parData.MovimientoID,
                        parData.CuentaId,
                        parData.JsonTda,
                        DistribuidorId,
                        ClienteId,
                        SerieId,
                        Folio
                    };

                    string Stored = "";

                    Stored = "EXEC Creditos.pa_PrestamoDistribuidor_Ins @ProductoID ,@DistribuidorId ,@ClienteId ,@SucursalId ,@CajaID ,@Capital ,@Plazos ,@UsuarioId ,@TipoDesembolsoID ,@PersonaID ,@MovimientoID ,@PrestamoNomina ";

                    var res = await ConexionDB.database.QueryAsync<CanjeaValeRes>(Stored, parData).FirstOrDefaultAsync();

                    if (res.regresa != 1)
                    {
                        ConexionDB.database.AbortTransaction();
                        return Ok(res);
                    }

                    var Credito = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoID = @0", res.CreditoId).FirstOrDefaultAsync();

                    Credito.VentaId = parData.VentaId;

                    if (parData.personasDatosBancariosID != 0)
                    {
                        Credito.personasDatosBancariosID = parData.personasDatosBancariosID;
                    }

                    await ConexionDB.database.UpdateAsync(Credito);

                    ConexionDB.database.CompleteTransaction();

                    res.VentaId = parData.VentaId;

                    await ConexionDB.Destroy();

                    return Ok(res);
                }
                else if (parData.Capital > Monto && parData.TipoDesembolsoID == 6)
                {
                    var Solicitud = new DBContext.DBConfia.Creditos.SolicitudCreditosPersonales()
                    {
                        ProductoId = parData.ProductoID,
                        SucursalId = parData.SucursalId,
                        CajaID = parData.CajaID,
                        DistribuidorId = parData.DistribuidorId,
                        Capital = parData.Capital,
                        Plazos = parData.Plazos,
                        TipoDesembolsoID = parData.TipoDesembolsoID,
                        UsuarioSolicitaID = UsuarioActual.UsuarioID,
                        PersonaSolicitaID = (long)UsuarioActual.PersonaID,
                        FechaSolicita = DateTime.Now,

                    };
                    await ConexionDB.database.InsertAsync(Solicitud);

                    var res = new
                    {
                        msj = "SE HA GENERADO LA SOLICITUD CORRECTAMENTE(ODP)",
                        regresa = 22

                    };
                    await ConexionDB.Destroy();
                    return Ok(res);
                }
                else if (parData.Capital > Monto && parData.TipoDesembolsoID == 7)
                {
                    var Solicitud = new DBContext.DBConfia.Creditos.SolicitudCreditosPersonales()
                    {
                        ProductoId = parData.ProductoID,
                        SucursalId = parData.SucursalId,
                        CajaID = parData.CajaID,
                        DistribuidorId = parData.DistribuidorId,
                        Capital = parData.Capital,
                        Plazos = parData.Plazos,
                        TipoDesembolsoID = parData.TipoDesembolsoID,
                        UsuarioSolicitaID = UsuarioActual.UsuarioID,
                        PersonaSolicitaID = (long)UsuarioActual.PersonaID,
                        personaDatosBancariosID = parData.personasDatosBancariosID,
                    };
                    await ConexionDB.database.InsertAsync(Solicitud);

                    var res = new
                    {
                        msj = "SE HA GENERADO LA SOLICITUD CORRECTAMENTE(SPEI POR STP)",
                        regresa = 23

                    };
                    await ConexionDB.Destroy();
                    return Ok(res);
                }
                else
                {
                    var res = new
                    {
                        msj = "LA CANTIDAD INGRESADA NO PUEDE SER CON TIPO DE DESEMBOLSO: EFECTIVO EN CAJA",
                        regresa = 21

                    };
                    await ConexionDB.Destroy();
                    return Ok(res);
                }

            }
            catch (Exception ex)
            {
                ConexionDB.database.AbortTransaction();
                await ConexionDB.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        [Route("getByProducto")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetByProducto(PeticionesRest.Creditos.CanjeaVale.GetPlanDePago parData)
        {
            try
            {
                var res = await ConexionDB.database.QueryAsync<PlanPagos>("WHERE CreditoID = @0", parData.CreditoID).ToArrayAsync();
                await ConexionDB.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionDB.Destroy();
                return NotFound(ex.Message);
            }

        }

        [HttpPost]
        [Route("pdf")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Pdf(PeticionesRest.Creditos.CanjeaVale.PDF parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                parData.ProductoID = producto;

                var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");

                string dest = Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf"));

                //MemoryStream ms = new();

                PdfWriter pw = new(dest);

                PdfDocument pdfDocument = new(pw);

                Document doc = new(pdfDocument, PageSize.LETTER);

                doc.SetMargins(40, 55, 40, 55);

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;

                var UsuarioActual = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var PersonaActual = await ConexionDB.database.QueryAsync<Personas_VW>("WHERE PersonaID=@0", UsuarioActual.PersonaID).FirstOrDefaultAsync();
                // var UsuarioActual = await ConexionDB.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
                // var PersonaActual = await ConexionDB.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.ID).FirstOrDefaultAsync();

                var Producto = await ConexionDB.database.SingleByIdAsync<Productos>(parData.ProductoID);

                var Credito = await ConexionDB.database.QueryAsync<Creditos_VW>("WHERE CreditoID = @CreditoID", parData).FirstOrDefaultAsync();

                var Credito2 = await ConexionDB.database.QueryAsync<Creditos_VW>("WHERE CreditoID = @CreditoID_2", parData).FirstOrDefaultAsync();

                var Pagos = await ConexionDB.database.FetchAsync<PlanPagos>("WHERE CreditoID = @CreditoID", parData);

                var Pagos2 = await ConexionDB.database.FetchAsync<PlanPagos>("WHERE CreditoID = @CreditoID_2", parData);

                var DscDistribuidor = await ConexionDB.database.QueryAsync<VariablesGlobales>("WHERE (varName = @0)", "DESCRIPCION_DISTRIBUIDOR").FirstOrDefaultAsync();

                var varfz = await ConexionDB.database.QueryAsync<VariablesGlobales>("WHERE (varName = @0)", "FONTSIZE_REG_22").FirstOrDefaultAsync();

                var varsr = await ConexionDB.database.QueryAsync<VariablesGlobales>("WHERE (varName = @0)", "SIZE_RANGE").FirstOrDefaultAsync();

                var varrd = await ConexionDB.database.QueryAsync<VariablesGlobales>("WHERE (varName = @0)", "RANGE_DIFF").FirstOrDefaultAsync();

                var logo = Producto.Logo;

                LogImpresionDocumentos LogImpresion;

                float fontSize = float.Parse(varfz.varValue.ToString(), CultureInfo.InvariantCulture.NumberFormat);

                float sizeRange = float.Parse(varsr.varValue.ToString(), CultureInfo.InvariantCulture.NumberFormat);

                float rangeDiff = float.Parse(varrd.varValue.ToString(), CultureInfo.InvariantCulture.NumberFormat);

                LogImpresion = new LogImpresionDocumentos() { UsuarioId = UsuarioActual.UsuarioID, PersonaId = (long)UsuarioActual.UsuarioID, Fecha = DateTime.Now, CreditoID = Credito.CreditoID, TipoDocumentoId = 1 };

                await ConexionDB.database.InsertAsync(LogImpresion);

                if (!parData.SoloFormatoExtra)
                {
                    GenerarArchivo(ref doc, pdfDocument, Credito, Pagos, logo, Credito2, Pagos2, DscDistribuidor.varValue.ToString().ToUpper(), fontSize, sizeRange, rangeDiff);
                }

                if (Credito.FormatoImpresionExtra == true && !parData.Reimpresion)
                {
                    var Movimiento = await ConexionDB.database.QueryAsync<Movimientos_VW>("WHERE MovimientoID = @MovimientoID", Credito).FirstOrDefaultAsync();

                    if (Movimiento != null)
                    {
                        switch (Movimiento.CveMovimientoID)
                        {
                            case "DSM":
                                //var Movimiento = await ConexionDB.database.QueryAsync<Movimientos_VW>("WHERE MovimientoID = @MovimientoID", Credito).FirstOrDefaultAsync();

                                LogImpresion = new LogImpresionDocumentos() { UsuarioId = UsuarioActual.UsuarioID, PersonaId = (long)UsuarioActual.UsuarioID, Fecha = DateTime.Now, CreditoID = Credito.CreditoID, TipoDocumentoId = 3 };

                                await ConexionDB.database.InsertAsync(LogImpresion);

                                if (!parData.SoloFormatoExtra)
                                {
                                    AreaBreak aB = new();

                                    doc.Add(aB);
                                }

                                PdfPage pdfPage = pdfDocument.AddNewPage();

                                PdfCanvas canvas = new(pdfPage);

                                canvas.Rectangle(30, 40, 550, 720);

                                canvas.Stroke();

                                MOVCTA(ref doc, pdfDocument, Movimiento, LogImpresion, PersonaActual, logo);

                                break;
                            case "DSMS":
                                //var Movimiento = await ConexionDB.database.QueryAsync<Movimientos_VW>("WHERE MovimientoID = @MovimientoID", Credito).FirstOrDefaultAsync();

                                LogImpresion = new LogImpresionDocumentos() { UsuarioId = UsuarioActual.UsuarioID, PersonaId = (long)UsuarioActual.UsuarioID, Fecha = DateTime.Now, CreditoID = Credito.CreditoID, TipoDocumentoId = 3 };

                                await ConexionDB.database.InsertAsync(LogImpresion);

                                if (!parData.SoloFormatoExtra)
                                {
                                    AreaBreak aB = new();

                                    doc.Add(aB);
                                }

                                PdfPage pdfPage2 = pdfDocument.AddNewPage();

                                PdfCanvas canvas2 = new(pdfPage2);

                                canvas2.Rectangle(30, 40, 550, 720);

                                canvas2.Stroke();

                                MOVCTA(ref doc, pdfDocument, Movimiento, LogImpresion, PersonaActual, logo);

                                break;
                            case "SPEI":
                                Console.WriteLine("SPEI");
                                break;
                            case "ODP":
                                LogImpresion = new LogImpresionDocumentos() { UsuarioId = UsuarioActual.UsuarioID, PersonaId = PersonaActual.PersonaID, Fecha = DateTime.Now, CreditoID = Credito.CreditoID, TipoDocumentoId = 2 };

                                await ConexionDB.database.InsertAsync(LogImpresion);

                                ODP(ref doc, pdfDocument, Credito, logo);
                                break;
                            default:
                                break;
                        }
                    }
                }

                //var otro = true;

                //if (parData.CreditoID_2 > 0)
                //{

                //    AreaBreak aB = new();

                //    doc.Add(aB);

                //    var Credito2 = await DBContext.database.QueryAsync<Creditos_VW>("WHERE CreditoID = 10").FirstOrDefaultAsync();

                //    var Pagos2 = await DBContext.database.FetchAsync<PlanPagos>("WHERE CreditoID = 10");

                //    LogImpresion = new LogImpresionDocumentos() { UsuarioId = UsuarioActual.ID, PersonaId = PersonaActual.PersonaID, Fecha = DateTime.Now, CreditoID = Credito2.CreditoID, TipoDocumentoId = 1 };

                //    await DBContext.database.InsertAsync(LogImpresion);

                //    GenerarArchivo(ref doc, Credito2, Pagos2, logo);
                //}                

                doc.Close();

                //Process p2 = new()
                //{
                //    StartInfo = new ProcessStartInfo("java")
                //};
                //p2.StartInfo.Arguments = string.Concat(
                //    "-jar ",
                //    PDF.RUTA_JSIGNPDF, " ",
                //    Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")), " ",
                //    "-ksf ", Path.Combine(PDF.RUTA_BASE, "keystore", "confia.pdf.keystore"), " ",
                //    "-ksp Mexico2021 ",
                //    "-ka confia_pdf ",
                //    "-ksp Mexico2021 ",
                //    "-d ", PDF.RUTA_BASE, " ",
                //    "-r 'Validación de documentos' ",
                //    "-l 'Torreon Coahuila' ",
                //    "-c 'Detalle de contacto' ",
                //    "-cl CERTIFIED_NO_CHANGES_ALLOWED ",
                //    "-ha SHA512 ",
                //    "-pg 1 ",
                //    "-llx 35.0 ",
                //    "-lly 830.0 ",
                //    "-urx 345 ",
                //    "-ury 762 ",
                //    "--render-mode DESCRIPTION_ONLY ",
                //    "-fs 8.0 ",
                //    "-V ",
                //    "-q"
                //);
                //p2.StartInfo.CreateNoWindow = true;
                //p2.Start();
                //await p2.WaitForExitAsync();

                // Obtenemos el contenido de nuestro archivo de PDF
                var pdf = await System.IO.File.ReadAllBytesAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
                //var pdf = await System.IO.File.ReadAllBytesAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF_signed.pdf")));

                // Obtenemos nuestro PDF
                var pdfStream = new MemoryStream();
                pdfStream.Write(pdf, 0, pdf.Length);
                pdfStream.Position = 0;

                System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
                System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF_signed.pdf")));

                //byte[] byteStream = ms.ToArray();
                //ms = new MemoryStream();
                //ms.Write(byteStream, 0, byteStream.Length);
                //ms.Position = 0;

                await ConexionDB.Destroy();

                return File(pdfStream, "application/pdf");

            }
            catch (Exception ex)
            {
                await ConexionDB.Destroy();
                return BadRequest(ex.Message);
            }
        }

        //private static Image GetWatermarkedImage(PdfDocument pdfDoc, Image img, String watermark)
        //{
        //    float width = img.GetImageScaledWidth();
        //    float height = img.GetImageScaledHeight();
        //    PdfFormXObject template = new PdfFormXObject(new Rectangle(width, height));
        //    new Canvas(template, pdfDoc)
        //        .Add(img)
        //        .SetFontColor(DeviceGray.WHITE)
        //        .ShowTextAligned(watermark, width / 2, height / 2, TextAlignment.CENTER, (float)Math.PI / 6)
        //        .Close();
        //    return new Image(template);
        //}

        private void ODP(ref Document doc, PdfDocument pdfDoc, Creditos_VW Credito, byte[] Logo)
        {
            LineSeparator ls = new(new SolidLine());

            //var imageFile = System.IO.Path.Combine(_env.ContentRootPath, "wwwroot/Archivos/LogoBancos", "5a270db16c215158268.png");

            //ImageData data = ImageDataFactory.Create(imageFile);

            ImageData data = ImageDataFactory.Create(Credito.LogoBanco);

            Image img = new(data);

            img.SetHeight(40);

            float[] pointColumnWidths = { 200, 150F, 150F };

            Table table = new(pointColumnWidths);

            Cell c1 = new();
            c1.SetBackgroundColor(ColorConstants.WHITE);
            c1.SetBorder(Border.NO_BORDER);
            c1.Add(img.SetAutoScale(true));

            Cell c2 = new();
            c2.Add(new Paragraph("ORDEN DE PAGO PARA COBRO EN " + Credito.NombreBanco.ToUpper()));
            c2.SetBackgroundColor(ColorConstants.WHITE);
            c2.SetBorder(Border.NO_BORDER);
            c2.SetTextAlignment(TextAlignment.CENTER);
            c2.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c2.SetFontSize(11);
            c2.SetBold();

            Cell c3 = new();
            c3.Add(new Paragraph(Credito.empresaNombre.ToUpper()));
            c3.SetBackgroundColor(ColorConstants.WHITE);
            c3.SetBorder(Border.NO_BORDER);
            c3.SetTextAlignment(TextAlignment.CENTER);
            c3.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c3.SetFontSize(10);
            c3.SetBold();

            table.AddCell(c1);
            table.AddCell(c2);
            table.AddCell(c3);


            float[] pointColumnWidths2 = { 375, 85, 300 };
            Table table2 = new(pointColumnWidths2);

            Text text1 = new("CRÉDITO:              " + Credito.CreditoID.ToString());

            Text text2 = new("CONVENIO:         " + Credito.DispersionConvenio);

            Text text3 = new("BENEFICIARIO:     " + Credito.NombreCompleto);

            Text text4 = new Text("IMPORTE:            " + Funciones.Truncate(Credito.Capital, 2).ToString("C", CultureInfo.CurrentCulture))
                .SetBold();

            Text text5 = new Text("REFERENCIA:       " + Credito.Referencia)
                .SetBold();

            Text text6 = new Text("CONCEPTO:         " + Credito.Concepto)
                .SetBold();

            Text text7 = new("GRUPO:            ");

            Text text8 = new("IMPRESION:          " + DateTime.Now.ToString("yyyy/MM/dd hh:mm:ss tt"));

            Cell c4 = new();
            c4.Add(new Paragraph(text1));
            c4.SetBorder(Border.NO_BORDER);
            c4.SetFontSize(9);

            Cell c5 = new();
            c5.Add(new Paragraph(text2));
            c5.SetBorder(Border.NO_BORDER);
            c5.SetBold();
            c5.SetFontSize(9);

            Cell c6 = new();
            c6.Add(new Paragraph(text3));
            c6.SetBorder(Border.NO_BORDER);
            c6.SetFontSize(9);

            Cell c7 = new();
            c7.Add(new Paragraph(text4));
            c7.SetBorder(Border.NO_BORDER);
            c7.SetBold();
            c7.SetFontSize(9);

            Cell c8 = new();
            c8.Add(new Paragraph(text5));
            c8.SetBorder(Border.NO_BORDER);
            c8.SetBold();
            c8.SetFontSize(9);

            Cell c9 = new();
            c9.Add(new Paragraph(text6));
            c9.SetBorder(Border.NO_BORDER);
            c9.SetBold();
            c9.SetFontSize(9);

            Cell c10 = new();
            c10.Add(new Paragraph(text7));
            c10.SetBorder(Border.NO_BORDER);
            c10.SetFontSize(9);

            Cell c11 = new();
            c11.Add(new Paragraph(text8));
            c11.SetBorder(Border.NO_BORDER);
            c11.SetFontSize(9);

            table2.AddCell(c4);
            table2.AddCell(new Cell().SetBorder(Border.NO_BORDER));
            table2.AddCell(c5);
            table2.AddCell(c6);
            table2.AddCell(new Cell().SetBorder(Border.NO_BORDER));
            table2.AddCell(c7);
            table2.AddCell(c8);
            table2.AddCell(new Cell().SetBorder(Border.NO_BORDER));
            table2.AddCell(c9);

            if (Credito.RequiereGrupo == true)
            {
                table2.AddCell(c10);
                table2.AddCell(new Cell());
                table2.AddCell(new Cell());
            }

            table2.AddCell(c11);

            Paragraph parr1 = new Paragraph("SE REQUIERE IDENTIFICACION OFICIAL VIGENTE PARA EL COBRO EN BANCO.\nVERIFIQUE QUE EL NOMBRE EN ESTE FORMATO SEA IGUAL AL DE SU IDENTIFICACION OFICIAL.\nVALIDO SOLO 5 DIAS NATURALES DESPUES DE SU FECHA DE EXPECION.")
             .SetFontSize(8)
             .SetTextAlignment(TextAlignment.CENTER);

            AreaBreak aB = new();

            doc.Add(aB);
            doc.Add(table);
            doc.Add(new Paragraph());
            doc.Add(table2);
            doc.Add(new Paragraph());
            doc.Add(parr1);
            doc.Add(ls);

            data = ImageDataFactory.Create(Logo);

            Image wmImg = new(data);

            float pWith = pdfDoc.GetDefaultPageSize().GetWidth();

            float iWith = wmImg.GetImageWidth();

            float pHeight = pdfDoc.GetDefaultPageSize().GetHeight();

            float iHeight = wmImg.GetImageHeight();

            wmImg.SetFixedPosition((pWith / 2f) - (iWith / 2f), (pHeight / 2f) - (iHeight / 2f));
            wmImg.SetOpacity(0.3f);

            doc.Add(wmImg);
        }

        private void MOVCTA(ref Document doc, PdfDocument pdfDoc, Movimientos_VW Movimiento, LogImpresionDocumentos LogImpresion, Personas_VW Persona, byte[] Logo)
        {
            LineSeparator ls = new(new SolidLine());

            Paragraph salto1 = new(new Text("\n"));

            Paragraph salto3 = new(new Text("\n\n\n"));

            Paragraph salto4 = new(new Text("\n\n\n\n"));

            Paragraph title = new Paragraph("DETALLE DE MOVIMIENTO DE CUENTA")
                .SetFontSize(14)
                .SetBold()
                .SetTextAlignment(TextAlignment.CENTER);


            float[] pointColumnWidths = { 25, 100, 175, 50, 150 };

            Table table = new(pointColumnWidths);

            Cell c1 = new();
            c1.Add(new Paragraph("ID:"));
            c1.SetBackgroundColor(ColorConstants.WHITE);
            //c1.SetBorder(Border.NO_BORDER);
            c1.SetTextAlignment(TextAlignment.CENTER);
            c1.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c1.SetFontSize(10);
            c1.SetBold();

            Cell c2 = new();
            c2.Add(new Paragraph(Movimiento.MovimientoID.ToString()));
            c2.SetBackgroundColor(ColorConstants.WHITE);
            //c2.SetBorder(Border.NO_BORDER);
            c2.SetTextAlignment(TextAlignment.CENTER);
            c2.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c2.SetFontSize(10);
            //c2.SetBold();

            Cell c3 = new();
            c3.Add(new Paragraph());
            c3.SetBackgroundColor(ColorConstants.WHITE);
            c3.SetBorder(Border.NO_BORDER);

            Cell c4 = new();
            c4.Add(new Paragraph("TIPO MOVIMIENTO:"));
            c4.SetBackgroundColor(ColorConstants.WHITE);
            //c1.SetBorder(Border.NO_BORDER);
            c4.SetTextAlignment(TextAlignment.CENTER);
            c4.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c4.SetFontSize(10);
            c4.SetBold();

            Cell c5 = new();
            c5.Add(new Paragraph(Movimiento.CveMovimientoID));
            c5.SetBackgroundColor(ColorConstants.WHITE);
            //c2.SetBorder(Border.NO_BORDER);
            c5.SetTextAlignment(TextAlignment.CENTER);
            c5.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c5.SetFontSize(10);
            //c2.SetBold();

            Cell c6 = new();
            c6.Add(new Paragraph(Movimiento.TipoMovimiento));
            c6.SetBackgroundColor(ColorConstants.WHITE);
            //c2.SetBorder(Border.NO_BORDER);
            c6.SetTextAlignment(TextAlignment.CENTER);
            c6.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c6.SetFontSize(10);
            //c2.SetBold();

            table.AddCell(c1);
            table.AddCell(c2);
            //table.AddCell(c3);
            table.AddCell(c4);
            table.AddCell(c5);
            table.AddCell(c6);

            float[] pointColumnWidths2 = { 200, 100, 300 };
            Table table2 = new(pointColumnWidths2);

            Cell c7 = new();
            c7.Add(new Paragraph("CUENTA:"));
            c7.SetBackgroundColor(ColorConstants.WHITE);
            c7.SetTextAlignment(TextAlignment.CENTER);
            c7.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c7.SetFontSize(10);
            c7.SetBold();

            Cell c8 = new();
            c8.Add(new Paragraph(Movimiento.NumeroCuenta));
            c8.SetBackgroundColor(ColorConstants.WHITE);
            c8.SetTextAlignment(TextAlignment.CENTER);
            c8.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c8.SetFontSize(10);

            Cell c9 = new();
            c9.Add(new Paragraph(Movimiento.Descripcion));
            c9.SetBackgroundColor(ColorConstants.WHITE);
            c9.SetTextAlignment(TextAlignment.CENTER);
            c9.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c9.SetFontSize(10);

            table2.AddCell(c7);
            table2.AddCell(c8);
            table2.AddCell(c9);

            float[] pointColumnWidths4 = { 100, 225, 25, 150 };
            Table table4 = new(pointColumnWidths4);

            Cell c13 = new();
            c13.Add(new Paragraph("PRODUCTO:"));
            c13.SetBackgroundColor(ColorConstants.WHITE);
            c13.SetTextAlignment(TextAlignment.CENTER);
            c13.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c13.SetFontSize(10);
            c13.SetBold();

            Cell c14 = new();
            c14.Add(new Paragraph(Movimiento.Producto));
            c14.SetBackgroundColor(ColorConstants.WHITE);
            c14.SetTextAlignment(TextAlignment.CENTER);
            c14.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c14.SetFontSize(10);

            Cell c15 = new();
            c15.Add(new Paragraph("IMPORTE:"));
            c15.SetBackgroundColor(ColorConstants.WHITE);
            c15.SetTextAlignment(TextAlignment.CENTER);
            c15.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c15.SetFontSize(10);
            c15.SetBold();

            Cell c16 = new();
            c16.Add(new Paragraph("DESCRIPCION:"));
            c16.SetBackgroundColor(ColorConstants.WHITE);
            c16.SetTextAlignment(TextAlignment.CENTER);
            c16.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c16.SetFontSize(10);
            c16.SetBold();

            Cell c17 = new();
            c17.Add(new Paragraph("PAG. P.I. " + Movimiento.CreditoID.ToString() + " / " + Movimiento.Cliente));
            c17.SetBackgroundColor(ColorConstants.WHITE);
            c17.SetTextAlignment(TextAlignment.CENTER);
            c17.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c17.SetFontSize(10);

            Cell c18 = new();
            c18.Add(new Paragraph(Funciones.Truncate(Movimiento.Importe, 2).ToString("C", CultureInfo.CurrentCulture)));
            c18.SetBackgroundColor(ColorConstants.WHITE);
            c18.SetTextAlignment(TextAlignment.CENTER);
            c18.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c18.SetFontSize(10);

            table4.AddCell(c13);
            table4.AddCell(c14);
            table4.AddCell(c3);
            table4.AddCell(c15);
            table4.AddCell(c16);
            table4.AddCell(c17);
            table4.AddCell(c3);
            table4.AddCell(c18);

            float[] pointColumnWidths5 = { 70, 55, 200 };
            Table table5 = new(pointColumnWidths5);

            Cell c19 = new();
            c19.Add(new Paragraph("CAPTURA:"));
            c19.SetBackgroundColor(ColorConstants.WHITE);
            c19.SetTextAlignment(TextAlignment.CENTER);
            c19.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c19.SetFontSize(10);
            c19.SetBold();

            Cell c20 = new();
            c20.Add(new Paragraph(Movimiento.PersonaIDRegistro.ToString()));
            c20.SetBackgroundColor(ColorConstants.WHITE);
            c20.SetTextAlignment(TextAlignment.CENTER);
            c20.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c20.SetFontSize(10);

            Cell c21 = new();
            c21.Add(new Paragraph(Movimiento.capturo));
            c21.SetBackgroundColor(ColorConstants.WHITE);
            c21.SetTextAlignment(TextAlignment.CENTER);
            c21.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c21.SetFontSize(10);

            table5.AddCell(c19);
            table5.AddCell(c20);
            table5.AddCell(c21);

            float[] pointColumnWidths6 = { 100, 100, 200, 200 };
            Table table6 = new(pointColumnWidths6);

            var fechaAfectacion = Movimiento.FechaCaptura.Year == 1900 ? String.Empty : Movimiento.FechaAfectacion?.ToString("dd/MM/yyyy hh:mm:ss tt");

            Cell c22 = new();
            c22.Add(new Paragraph("FECHA MOV:"));
            c22.SetBackgroundColor(ColorConstants.WHITE);
            c22.SetTextAlignment(TextAlignment.CENTER);
            c22.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c22.SetFontSize(10);
            c22.SetBold();

            Cell c23 = new();
            c23.Add(new Paragraph(fechaAfectacion));
            c23.SetBackgroundColor(ColorConstants.WHITE);
            c23.SetTextAlignment(TextAlignment.CENTER);
            c23.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c23.SetFontSize(10);

            var fechaCaptura = Movimiento.FechaCaptura.Year == 1900 ? String.Empty : Movimiento.FechaCaptura.ToString("dd/MM/yyyy hh:mm:ss tt");

            Cell c24 = new();
            c24.Add(new Paragraph("FECHA CAPTURA:"));
            c24.SetBackgroundColor(ColorConstants.WHITE);
            c24.SetTextAlignment(TextAlignment.CENTER);
            c24.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c24.SetFontSize(10);
            c24.SetBold();

            Cell c25 = new();
            c25.Add(new Paragraph(fechaCaptura));
            c25.SetBackgroundColor(ColorConstants.WHITE);
            c25.SetTextAlignment(TextAlignment.CENTER);
            c25.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c25.SetFontSize(10);

            table6.AddCell(c22);
            table6.AddCell(c23);
            table6.AddCell(c24);
            table6.AddCell(c25);

            float[] pointColumnWidths7 = { 75, 75, 185, 90, 75 };
            Table table7 = new(pointColumnWidths7);

            Cell c26 = new();
            c26.Add(new Paragraph("CLIENTE:"));
            c26.SetBackgroundColor(ColorConstants.WHITE);
            c26.SetTextAlignment(TextAlignment.CENTER);
            c26.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c26.SetFontSize(10);
            c26.SetBold();

            Cell c27 = new();
            c27.Add(new Paragraph(Movimiento.ClienteID.ToString()));
            c27.SetBackgroundColor(ColorConstants.WHITE);
            c27.SetTextAlignment(TextAlignment.CENTER);
            c27.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c27.SetFontSize(10);

            Cell c28 = new();
            c28.Add(new Paragraph(Movimiento.Cliente));
            c28.SetBackgroundColor(ColorConstants.WHITE);
            c28.SetTextAlignment(TextAlignment.CENTER);
            c28.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c28.SetFontSize(10);

            Cell c29a = new();
            c29a.Add(new Paragraph("MOVIMIENTOS:"));
            c29a.SetBackgroundColor(ColorConstants.WHITE);
            c29a.SetTextAlignment(TextAlignment.CENTER);
            c29a.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c29a.SetFontSize(10);
            c29a.SetBold();

            Cell c29 = new();
            c29.Add(new Paragraph(Movimiento.CreditosActivos.ToString()));
            c29.SetBackgroundColor(ColorConstants.WHITE);
            c29.SetTextAlignment(TextAlignment.CENTER);
            c29.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c29.SetFontSize(10);

            table7.AddCell(c26);
            table7.AddCell(c27);
            table7.AddCell(c28);
            table7.AddCell(c29a);
            table7.AddCell(c29);

            float[] pointColumnWidths8 = { 100, 50, 200 };
            Table table8 = new(pointColumnWidths8);

            if (Movimiento.RequiereGrupo == true)
            {
                Cell c30 = new();
                c30.Add(new Paragraph("GRUPO:"));
                c30.SetBackgroundColor(ColorConstants.WHITE);
                c30.SetTextAlignment(TextAlignment.CENTER);
                c30.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c30.SetFontSize(10);
                c30.SetBold();

                Cell c31 = new();
                c31.Add(new Paragraph(Movimiento.GrupoID.ToString()));
                c31.SetBackgroundColor(ColorConstants.WHITE);
                c31.SetTextAlignment(TextAlignment.CENTER);
                c31.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c31.SetFontSize(10);

                Cell c32 = new();
                c32.Add(new Paragraph(Movimiento.NombreGrupo));
                c32.SetBackgroundColor(ColorConstants.WHITE);
                c32.SetTextAlignment(TextAlignment.CENTER);
                c32.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c32.SetFontSize(10);

                table8.AddCell(c30);
                table8.AddCell(c31);
                table8.AddCell(c32);
            }

            float[] pointColumnWidths9 = { 100, 100, 100 };
            Table table9 = new(pointColumnWidths9);

            Cell c33 = new();
            c33.Add(new Paragraph("REFERENCIAS:"));
            c33.SetBackgroundColor(ColorConstants.WHITE);
            c33.SetTextAlignment(TextAlignment.CENTER);
            c33.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c33.SetFontSize(10);
            c33.SetBold();

            Cell c34 = new();
            c34.Add(new Paragraph("Crédito"));
            c34.SetBackgroundColor(ColorConstants.WHITE);
            c34.SetTextAlignment(TextAlignment.CENTER);
            c34.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c34.SetFontSize(10);

            Cell c35 = new();
            c35.Add(new Paragraph(Movimiento.CreditoID.ToString()));
            c35.SetBackgroundColor(ColorConstants.WHITE);
            c35.SetTextAlignment(TextAlignment.CENTER);
            c35.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c35.SetFontSize(10);

            table9.AddCell(c33);
            table9.AddCell(c34);
            table9.AddCell(c35);

            float[] pointColumnWidths10 = { 100, 200, 75, 225 };
            Table table10 = new(pointColumnWidths10);

            Cell c36 = new();
            c36.Add(new Paragraph("IMPRESION:"));
            c36.SetBackgroundColor(ColorConstants.WHITE);
            c36.SetTextAlignment(TextAlignment.CENTER);
            c36.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c36.SetFontSize(10);
            c36.SetBold();

            Cell c37 = new();
            c37.Add(new Paragraph(LogImpresion.Fecha.ToString("dd/MM/yyyy hh:mm:ss tt")));
            c37.SetBackgroundColor(ColorConstants.WHITE);
            c37.SetTextAlignment(TextAlignment.CENTER);
            c37.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c37.SetFontSize(10);

            Cell c38 = new();
            c38.Add(new Paragraph(LogImpresion.PersonaId.ToString()));
            c38.SetBackgroundColor(ColorConstants.WHITE);
            c38.SetTextAlignment(TextAlignment.CENTER);
            c38.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c38.SetFontSize(10);

            Cell c39 = new();
            c39.Add(new Paragraph(Persona.NombreCompleto));
            c39.SetBackgroundColor(ColorConstants.WHITE);
            c39.SetTextAlignment(TextAlignment.CENTER);
            c39.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c39.SetFontSize(10);

            table10.AddCell(c36);
            table10.AddCell(c37);
            table10.AddCell(c38);
            table10.AddCell(c39);

            float[] pointColumnWidths11 = { 250, 250 };
            Table table11 = new(pointColumnWidths11);

            LineSeparator rl = new(new SolidLine());
            //rl.SetMarginRight(250);

            LineSeparator lfl = new(new SolidLine());
            //lfl.SetMarginLeft(250);

            Cell c40 = new();
            c40.Add(new Paragraph("ENTREGUE"));
            c40.SetBackgroundColor(ColorConstants.WHITE);
            c40.SetTextAlignment(TextAlignment.CENTER);
            c40.SetVerticalAlignment(VerticalAlignment.TOP);
            c40.SetBorder(Border.NO_BORDER);
            c40.SetFontSize(10);

            Cell c41 = new();
            c41.Add(new Paragraph("RECIBI"));
            c41.SetBackgroundColor(ColorConstants.WHITE);
            c41.SetTextAlignment(TextAlignment.CENTER);
            c41.SetVerticalAlignment(VerticalAlignment.TOP);
            c41.SetBorder(Border.NO_BORDER);
            c41.SetFontSize(10);

            Cell c42 = new();
            c42.Add(rl);
            c42.SetBackgroundColor(ColorConstants.WHITE);
            c42.SetTextAlignment(TextAlignment.CENTER);
            c42.SetVerticalAlignment(VerticalAlignment.BOTTOM);
            c42.SetBorder(Border.NO_BORDER);
            c42.SetFontSize(10);

            Cell c43 = new();
            c43.Add(lfl);
            c43.SetBackgroundColor(ColorConstants.WHITE);
            c43.SetTextAlignment(TextAlignment.CENTER);
            c43.SetVerticalAlignment(VerticalAlignment.BOTTOM);
            c43.SetBorder(Border.NO_BORDER);
            c43.SetFontSize(10);

            table11.AddCell(c42);
            table11.AddCell(c43);
            table11.AddCell(c40);
            table11.AddCell(c41);

            //AreaBreak aB = new();

            //doc.Add(aB);
            doc.Add(ls);
            doc.Add(title);
            doc.Add(ls);
            doc.Add(salto3);
            doc.Add(table);
            doc.Add(salto1);
            doc.Add(table2);
            doc.Add(salto1);
            doc.Add(table4);
            doc.Add(salto1);
            doc.Add(table5);
            doc.Add(salto1);
            doc.Add(table6);
            doc.Add(salto1);
            doc.Add(table7);
            doc.Add(salto1);
            if (Movimiento.RequiereGrupo == true)
            {
                doc.Add(table8);
                doc.Add(salto1);
            }
            doc.Add(table9);
            doc.Add(salto1);
            doc.Add(table10);
            doc.Add(salto4);
            doc.Add(table11);

            ImageData data = ImageDataFactory.Create(Logo);

            Image wmImg = new(data);

            float pWith = pdfDoc.GetDefaultPageSize().GetWidth();

            float iWith = wmImg.GetImageWidth();

            float pHeight = pdfDoc.GetDefaultPageSize().GetHeight();

            float iHeight = wmImg.GetImageHeight();

            wmImg.SetFixedPosition((pWith / 2f) - (iWith / 2f), (pHeight / 2f) - (iHeight / 2f));
            wmImg.SetOpacity(0.3f);

            doc.Add(wmImg);

        }

        private void GenerarArchivo(ref Document doc, PdfDocument pdfDoc, Creditos_VW Credito, List<PlanPagos> Pagos, byte[] Logo, Creditos_VW Credito2, List<PlanPagos> Pagos2, string DscDistribuidor, float fontSize, float sizeRange, float rangeDiff)
        {
            decimal Capital2 = 0;
            decimal Importe2 = 0;

            if (Credito2 != null)
            {
                Capital2 = Credito2.Capital;
                Importe2 = Credito2.ImporteTotal;
            }

            LineSeparator ls = new(new SolidLine());

            ls.SetMarginLeft(100);

            ls.SetMarginRight(100);

            LineSeparator lfl = new(new SolidLine());

            lfl.SetMarginLeft(255);

            //lfl.SetMarginRight(150);

            LineSeparator dl = new(new DashedLine());

            SolidLine line = new(1f);
            line.SetColor(ColorConstants.LIGHT_GRAY);

            LineSeparator sl = new(line);

            Paragraph salto2 = new(new Text("\n"));

            Paragraph salto3 = new(new Text("\n\n\n"));

            Paragraph salto4 = new(new Text("\n\n\n\n"));

            //PdfPage pdfPage = pdfDocument.AddNewPage();

            //PdfCanvas canvas = new(pdfPage);

            //canvas.MoveTo(150, 200);

            //canvas.LineTo(450, 200);

            //canvas.ClosePathStroke();

            //var imageFile = System.IO.Path.Combine(_env.ContentRootPath, "wwwroot/Sources", "logoVale.png");

            ImageData data = ImageDataFactory.Create(Logo);

            Image img = new(data);

            /*    img.SetHeight(60); */

            //PdfFont font = PdfFontFactory.CreateFont(FontConstants.HELVETICA);

            /*    Paragraph date = new Paragraph(DateTime.Now.ToString("yyyy/MM/dd hh:mm:ss tt"))
                   .SetTextAlignment(TextAlignment.RIGHT)
                   .SetFontSize(7); */

            /* Text titletext1 = new Text("Estimado(a): ")
                .SetBold();

            Text titletext2 = new(Credito.NombreCompleto.ToUpper());

            Text titletext3 = new Text("                                                                                            ")
                .SetBold();

            Text titletext4 = new Text("\nN° Crédito: ")
                .SetBold();

            Text titletext5 = new(Credito.CreditoID.ToString());

            Text titletext6 = new Text("Folio Vale: ")
                .SetBold();

            Text titletext7 = new(Credito.ValeCanje.ToString());

            Paragraph title = new Paragraph()
               .SetFontSize(9);

            title.Add(titletext1);
            title.Add(titletext2);
            title.Add(titletext3);
            title.Add(titletext4);
            title.Add(titletext5);
            title.Add("\n");
            title.Add(titletext6);
            title.Add(titletext7); */

            /*   Paragraph parr1 = new Paragraph("LA " + DscDistribuidor + ":" + Credito.Distribuidor.ToUpper() + ", HA ENTREGADO UN VALE PARA QUE LO PUEDAS CANJEAR EN NUESTRAS SUCURSALES. EL VALOR DE TU PRESTAMO ES DE: " + Funciones.Truncate((Credito.Capital + Capital2), 2).ToString() + " PESOS M.N., Y HAS DECIDIDO PAGARLO EN " + Credito.Plazos.ToString() + " PLAZOS DE FORMA " + Credito.TasaTipo.ToUpper() + ". ES TU RESPONSABILIDAD ABONARLE A " + Credito.Distribuidor.ToUpper() + " ANTES DE CADA MARTES DE LA SEMANA EL MONTO SEÑALADO EN LA TABLA QUE SE ENCUENTRA A CONTINUACION:")
              .SetTextAlignment(TextAlignment.JUSTIFIED)
              .SetFontSize(8);

              Paragraph parr2 = new Paragraph("DE TUS PAGOS PUNTUALES DEPENDERÁ TU BUEN HISTORIAL Y LA POSIBILIDAD DE ACCEDER A FUTUROS CREDITOS.")
              .SetTextAlignment(TextAlignment.JUSTIFIED)
              .SetFontSize(9)
              .SetBold(); */

            /*   float[] pointColumnWidths = { 75F, 250F, 150F, 125F, 150F };
              Table table = new(pointColumnWidths); */

            /*  Cell c1 = new();
             c1.Add(new Paragraph("# PAGO"));
             c1.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
             c1.SetBorder(Border.NO_BORDER);
             c1.SetTextAlignment(TextAlignment.CENTER);
             c1.SetBold();

             Cell c2 = new();
             c2.Add(new Paragraph("FECHA LIMITE DE PAGO"));
             c2.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
             c2.SetBorder(Border.NO_BORDER);
             c2.SetTextAlignment(TextAlignment.CENTER);
             c2.SetBold();

             Cell c3 = new();
             c3.Add(new Paragraph("SALDO INICIAL"));
             c3.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
             c3.SetBorder(Border.NO_BORDER);
             c3.SetTextAlignment(TextAlignment.CENTER);
             c3.SetBold();

             Cell c4 = new();
             c4.Add(new Paragraph("ABONO"));
             c4.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
             c4.SetBorder(Border.NO_BORDER);
             c4.SetTextAlignment(TextAlignment.CENTER);
             c4.SetBold();

             Cell c5 = new();
             c5.Add(new Paragraph("SALDO FINAL"));
             c5.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
             c5.SetBorder(Border.NO_BORDER);
             c5.SetTextAlignment(TextAlignment.CENTER);
             c5.SetBold();

             // Adding cells to the table       
             table.AddCell(c1);
             table.AddCell(c2);
             table.AddCell(c3);
             table.AddCell(c4);
             table.AddCell(c5); */

            /*    var importe = Credito.ImporteTotal + Importe2;

               var c = 0; */

            /* foreach (var Pago in Pagos)
            { */
            /*          decimal abono2 = 0;

                     if (Pagos2.Count > 0)
                     {
                         abono2 = Pagos2[c].ImporteTotal.Value;
                     }

                     c++;

                     var abono = Pago.ImporteTotal + abono2; */

            /*    Cell nP = new();
               nP.Add(new Paragraph(Pago.NoPago.ToString()));
               nP.SetBackgroundColor(ColorConstants.WHITE);
               nP.SetBorder(Border.NO_BORDER);
               nP.SetTextAlignment(TextAlignment.CENTER);

               Cell fch = new();
               fch.Add(new Paragraph(Pago.FechaVencimientoClienteFinal.Value.ToString("yyyy/MM/dd")));
               fch.SetBackgroundColor(ColorConstants.WHITE);
               fch.SetBorder(Border.NO_BORDER);
               fch.SetTextAlignment(TextAlignment.CENTER);

               Cell sI = new();
               sI.Add(new Paragraph(Funciones.Truncate((decimal)importe, 2).ToString()));
               sI.SetBackgroundColor(ColorConstants.WHITE);
               sI.SetBorder(Border.NO_BORDER);
               sI.SetTextAlignment(TextAlignment.CENTER);

               Cell ab = new();
               ab.Add(new Paragraph(Funciones.Truncate((decimal)abono, 2).ToString()));
               ab.SetBackgroundColor(ColorConstants.WHITE);
               ab.SetBorder(Border.NO_BORDER);
               ab.SetTextAlignment(TextAlignment.CENTER);

               importe -= abono;

               Cell sf = new();
               sf.Add(new Paragraph(Funciones.Truncate((decimal)importe, 2).ToString()));
               sf.SetBackgroundColor(ColorConstants.WHITE);
               sf.SetBorder(Border.NO_BORDER);
               sf.SetTextAlignment(TextAlignment.CENTER); */
            /* 

                            table.AddCell(nP);
                            table.AddCell(fch);
                            table.AddCell(sI);
                            table.AddCell(ab);
                            table.AddCell(sf); */


            /* if (Pagos.Count > 21)
            { */
            /*  float diff = (Pagos.Count - 22);

             var Diff = (diff) * (sizeRange - ((diff * 2) / 100f));

             if (Diff > rangeDiff)
             {
                 Diff = rangeDiff;
             } */
            /* 
                            table.SetFontSize(fontSize - Diff); */



            /*  var dia = DateTime.Now.Day;
             var mes = DateTime.Now.Month;
             var año = DateTime.Now.Year; */
            /* 
                        var diaf = Pagos[c - 1].FechaVencimientoClienteFinal.Value.Day;
                        var mesf = Pagos[c - 1].FechaVencimientoClienteFinal.Value.Month;
                        var añof = Pagos[c - 1].FechaVencimientoClienteFinal.Value.Year; */

            //var diaf = Credito.UltimoVencimiento.Value.Day;
            //var mesf = Credito.UltimoVencimiento.Value.Month;
            //var añof = Credito.UltimoVencimiento.Value.Year;

            /* Paragraph parr3 = new Paragraph("EN_____________________,____________________, A LOS " + dia.ToString() + " (" + Funciones.NumeroALetras(dia, false) + ") DIAS DEL MES DE " + Funciones.ObtenerNombreMesNumero(mes).ToUpper() + " DE " + año.ToString() + " (" + Funciones.NumeroALetras(año, false) + "), POR ESTE PAGARÉ DEBO Y ME OBLIGO INCONDICIONALMENTE A PAGAR A LA ORDEN DE_________________________________, EN SUS OFICINAS UBICADAS EN______________________________, EN_____________________________, ___________________________, EL DÍA " + diaf.ToString() + " (" + Funciones.NumeroALetras(diaf, false) + ") DEL MES DE " + Funciones.ObtenerNombreMesNumero(mesf).ToUpper() + " DE " + añof.ToString() + " (" + Funciones.NumeroALetras(añof, false) + "), LA CANTIDAD DE " + (Credito.ImporteTotal.Value + Importe2).ToString("C", CultureInfo.CurrentCulture) + " (" + Funciones.NumeroALetras((decimal)Credito.ImporteTotal + Importe2, true) + "), CANTIDAD RECIBIDA A MI ENTERA SATISFACCIÓN. SI EL IMPORTE DEL PRESENTE NO FUERE CUBIERTO A LA FECHA DE SU VENCIMIENTO, CAUSARA INTERESES MORATORIOS AL TIPO DEL_____________% MENSUAL.")
                .SetTextAlignment(TextAlignment.JUSTIFIED)
                .SetFontSize(8);

            Paragraph sign = new Paragraph()
              .SetFontSize(7)
              .SetBold()
              .SetTextAlignment(TextAlignment.CENTER)
              .Add(titletext2);

            Paragraph parr4 = new Paragraph("REALIZA EL PAGO A: " + Credito.Distribuidor.ToUpper() + ", TELÉFONO: " + Credito.CelularDistribuidor.ToUpper())
             .SetFontSize(8)
             .SetBold();


            Paragraph title2 = new Paragraph("Beneficiario")
             .SetFontSize(15)
             .SetBold()
             .SetTextAlignment(TextAlignment.CENTER);

            Paragraph parr5 = new Paragraph("DESIGNACIÓN DE BENEFICIARIO")
            .SetFontSize(9)
            .SetBold();


            Text titletext8 = new Text("NOMBRE: ")
                .SetBold();

            Text titletext9 = new Text("___________________________________________________________________________________________")
                .SetFontColor(ColorConstants.LIGHT_GRAY);

            Paragraph parr6 = new Paragraph()
              .SetFontSize(9);

            Text titletext10 = new Text("PARENTESCO: ")
               .SetBold();

            Text titletext11 = new Text("__________________________________________")
                .SetFontColor(ColorConstants.LIGHT_GRAY);

            Text titletext12 = new Text(" FECHA DE NACIMIENTO: ")
              .SetBold();

            Text titletext13 = new Text("______________________")
                .SetFontColor(ColorConstants.LIGHT_GRAY);

            Paragraph parr7 = new Paragraph()
              .SetFontSize(9);

            parr6.Add(titletext8);
            parr6.Add(titletext9);

            parr7.Add(titletext10);
            parr7.Add(titletext11);
            parr7.Add(titletext12);
            parr7.Add(titletext13);

            float[] pointColumnWidths2 = { 375, 372 };
            Table table2 = new(pointColumnWidths2);

            Paragraph sign2 = new Paragraph()
            .SetFontSize(7)
            .SetBold()
            .SetTextAlignment(TextAlignment.CENTER)
            .Add(new Text("FIRMA DE AUTORIZACIÓN POR PARTE DEL CLIENTE\nACEPTO LAS CONDICIONES DE ENTREGA DE IMPORTE\nAL BENEFICIARIO EN CASO DE MI FALLECIMIENTO."));

            Cell t2c1 = new();
            t2c1.Add(new Paragraph(""));
            t2c1.SetBorder(Border.NO_BORDER);
            t2c1.SetTextAlignment(TextAlignment.CENTER);
            t2c1.SetBold();

            Cell t2c2 = new();
            t2c2.Add(sign2);
            t2c2.SetBorder(Border.NO_BORDER);
            t2c2.SetTextAlignment(TextAlignment.CENTER);
            t2c2.SetBold();

            table2.AddCell(t2c1);
            table2.AddCell(t2c2);

            Paragraph parr8 = new Paragraph("Nota: El apoyo de gastos funerarios será por la cantidad de $ 6,000 (son Seis mil pesos 00/100 mn), de la cual se descontará el adeudo vigente a la fecha del deceso, no aplica en casos de Muerte Violenta (Homicidio, Suicidio o accidentes de cualquier tipo) o Enfermedad Terminal (Cáncer, Diabetes, Cardiovasculares o sida). El tramite deberá realizarse en un plazo no mayor a 30 días naturales a partir de la fecha de la defunción.")
             .SetFontSize(8)
             .SetBold()
             .SetTextAlignment(TextAlignment.JUSTIFIED); */

            Paragraph title3 = new Paragraph("CARTA RESPONSIVA")
           .SetFontSize(14)
           .SetBold()
           .SetTextAlignment(TextAlignment.CENTER);

            Text text1 = new Text("Aceptar ser ")
                .SetFontColor(ColorConstants.DARK_GRAY);

            Text text2 = new Text("testaferro ")
                .SetFontColor(ColorConstants.DARK_GRAY)
                .SetBold();

            Text text3 = new Text("o ")
                .SetFontColor(ColorConstants.DARK_GRAY);

            Text text4 = new Text("prestanombres")
               .SetFontColor(ColorConstants.DARK_GRAY)
               .SetBold();

            Text text5 = new Text(", puede traer consecuencias graves como ser acusado de cómplice en diversos delitos fiscales o fraudes, por eso la ")
               .SetFontColor(ColorConstants.DARK_GRAY);

            Text text6 = new Text("Comisión Nacional para la Protección y Defensa de los Usuarios de Servicios Financieros (Condusef) ")
               .SetFontColor(ColorConstants.DARK_GRAY)
               .SetBold();

            Text text7 = new Text("recomienda pensar dos veces antes de aceptar serlo.")
                .SetFontColor(ColorConstants.DARK_GRAY);

            Paragraph parr9 = new Paragraph()
              .SetTextAlignment(TextAlignment.JUSTIFIED)
              .SetFontSize(12);

            parr9.Add(text1);
            parr9.Add(text2);
            parr9.Add(text3);
            parr9.Add(text4);
            parr9.Add(text5);
            parr9.Add(text6);
            parr9.Add(text7);

            Text text8 = new Text("Prestanombres")
              .SetFontColor(ColorConstants.DARK_GRAY)
              .SetBold();

            Text text9 = new Text(", es aquel individuo que finge realizar transacciones financieras por cuenta propia asumiendo las obligaciones como si fueran suyas, pero el dinero es para otra persona.")
              .SetFontColor(ColorConstants.DARK_GRAY);

            Paragraph parr10 = new Paragraph()
              .SetFontSize(12)
              .SetTextAlignment(TextAlignment.JUSTIFIED);

            parr10.Add(text8);
            parr10.Add(text9);

            Paragraph parr11 = new Paragraph("Además, corre el riesgo de robo de identidad y se pueden adquirir endeudamientos ajenos a la voluntad.")
              .SetTextAlignment(TextAlignment.JUSTIFIED)
              .SetFontColor(ColorConstants.DARK_GRAY)
              .SetFontSize(12);

            Paragraph parr12 = new Paragraph("Toma en cuenta que si solicitas un préstamo a tu nombre y el sujeto que te pidió el favor de hacerlo, se retrasa o no lo paga, TÚ serás el único responsable de la deuda.")
              .SetTextAlignment(TextAlignment.JUSTIFIED)
              .SetFontColor(ColorConstants.DARK_GRAY)
              .SetFontSize(12);

            Paragraph parr13 = new Paragraph("NO PERMITAS QUE TUS DATOS PERSONALES SEAN ROBADOS")
             .SetTextAlignment(TextAlignment.JUSTIFIED)
             .SetFontColor(ColorConstants.DARK_GRAY)
             .SetFontSize(12);

            Paragraph parr16 = new Paragraph(Credito.NombreCompleto)
      .SetFontColor(ColorConstants.DARK_GRAY)
      .SetFontSize(12)
      .SetTextAlignment(TextAlignment.CENTER);

            Paragraph parr14 = new Paragraph("Firma del cliente: ")
             .SetFontColor(ColorConstants.DARK_GRAY)
             .SetFontSize(12)
             .SetTextAlignment(TextAlignment.CENTER);

            Paragraph parr15 = new Paragraph("A la firma de este documento hago constar que los datos personales proporcionados son verídicos, así mismo asumo responsabilidad en la obligación de pago que he contraído.")
             .SetFontColor(ColorConstants.DARK_GRAY)
             .SetFontSize(10)
             .SetTextAlignment(TextAlignment.CENTER);

            AreaBreak aB = new();

            /*  doc.Add(date);
             doc.Add(img);
             doc.Add(title);
             doc.Add(parr1);
             doc.Add(parr2);
             doc.Add(new Paragraph());
             doc.Add(table) */
            ;

            Image wmImg = new(data);

            float pWith = pdfDoc.GetDefaultPageSize().GetWidth();

            float iWith = wmImg.GetImageWidth();

            float pHeight = pdfDoc.GetDefaultPageSize().GetHeight();

            float iHeight = wmImg.GetImageHeight();

            wmImg.SetFixedPosition((pWith / 2f) - (iWith / 2f), (pHeight / 2f) - (iHeight / 2f));
            wmImg.SetOpacity(0.3f);

            /*          doc.Add(wmImg);

                     doc.Add(aB);

                     doc.Add(parr3);
                     doc.Add(salto3);
                     doc.Add(ls);
                     doc.Add(sign);
                     doc.Add(new Paragraph());
                     doc.Add(parr4);
                     doc.Add(dl);
                     doc.Add(title2);
                     doc.Add(sl);
                     doc.Add(parr5);
                     doc.Add(parr6);
                     doc.Add(parr7);
                     doc.Add(salto2);
                     doc.Add(lfl);
                     doc.Add(table2);
                     doc.Add(parr8); */

            /* doc.Add(wmImg);
            doc.Add(aB); */

            img.SetHeight(80);
            doc.Add(img);
            doc.Add(salto2);
            doc.Add(title3);
            doc.Add(salto2);
            doc.Add(parr9);
            doc.Add(new Paragraph());
            doc.Add(parr10);
            doc.Add(new Paragraph());
            doc.Add(parr11);
            doc.Add(new Paragraph());
            doc.Add(parr12);
            doc.Add(new Paragraph());
            doc.Add(parr13);
            doc.Add(salto4);
            ls.SetMarginLeft(175);
            ls.SetMarginRight(175);
            doc.Add(ls);
            doc.Add(parr14);
            doc.Add(parr16);
            doc.Add(salto4);
            doc.Add(parr15);

            doc.Add(wmImg);
        }

        //[HttpPost]
        //[Route("pdf")]
        //[Authorize]
        //[Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        //public async Task<ActionResult> Pdf(PeticionesRest.Creditos.CanjeaVale.Get parData)
        //{
        //    try
        //    {

        //        MemoryStream ms = new();

        //        PdfWriter pw = new(ms);

        //        PdfDocument pdfDocument = new(pw);

        //        Document doc = new(pdfDocument, PageSize.LETTER);

        //        var Producto = await DBContext.database.SingleByIdAsync<Productos>(parData.ProductoID);

        //        var logo = Producto.Logo;

        //        var Credito = await DBContext.database.QueryAsync<Creditos_VW>("WHERE CreditoID = @CreditoID", parData).FirstOrDefaultAsync();

        //        var Pagos = await DBContext.database.FetchAsync<PlanPagos>("WHERE CreditoID = @CreditoID", parData);

        //        LineSeparator ls = new(new SolidLine());

        //        ls.SetMarginLeft(100);

        //        ls.SetMarginRight(100);

        //        LineSeparator lfl = new(new SolidLine());

        //        lfl.SetMarginLeft(255);

        //        //lfl.SetMarginRight(150);

        //        LineSeparator dl = new(new DashedLine());

        //        SolidLine line = new(1f);
        //        line.SetColor(ColorConstants.LIGHT_GRAY);

        //        LineSeparator sl = new(line);

        //        Paragraph salto2 = new(new Text("\n"));

        //        Paragraph salto3 = new(new Text("\n\n\n"));

        //        Paragraph salto4 = new(new Text("\n\n\n\n"));

        //        //PdfPage pdfPage = pdfDocument.AddNewPage();

        //        //PdfCanvas canvas = new(pdfPage);

        //        //canvas.MoveTo(150, 200);

        //        //canvas.LineTo(450, 200);

        //        //canvas.ClosePathStroke();

        //        //var imageFile = System.IO.Path.Combine(_env.ContentRootPath, "wwwroot/Sources", "logoVale.png");

        //        ImageData data = ImageDataFactory.Create(logo);

        //        Image img = new(data);

        //        img.SetHeight(60);

        //        //PdfFont font = PdfFontFactory.CreateFont(FontConstants.HELVETICA);

        //        Paragraph date = new Paragraph(DateTime.Now.ToString("yyyy/MM/dd hh:mm:ss"))
        //            .SetTextAlignment(TextAlignment.RIGHT)
        //            .SetFontSize(7);

        //        Text titletext1 = new Text("Estimado(a): ")
        //            .SetBold();

        //        Text titletext2 = new Text(Credito.NombreCompleto.ToUpper());

        //        Text titletext3 = new Text("                                                                                            ")
        //            .SetBold();

        //        Text titletext4 = new Text("N° Crédito: ")
        //            .SetBold();

        //        Text titletext5 = new(Credito.CreditoID.ToString());

        //        Text titletext6 = new Text("Folio Vale: ")
        //            .SetBold();

        //        Text titletext7 = new(Credito.ValeCanje.ToString());

        //        Paragraph title = new Paragraph()
        //           .SetFontSize(9);

        //        title.Add(titletext1);
        //        title.Add(titletext2);
        //        title.Add(titletext3);
        //        title.Add(titletext4);
        //        title.Add(titletext5);
        //        title.Add("\n");
        //        title.Add(titletext6);
        //        title.Add(titletext7);

        //        Paragraph parr1 = new Paragraph("LA SOCIA: " + Credito.Distribuidor.ToUpper() + ", HA ENTREGADO UN VALE PARA QUE LO PUEDAS CANJEAR EN NUESTRAS SUCURSALES. EL VALOR DE TU PRESTAMO ES DE: " + Funciones.Truncate(Credito.Capital, 2).ToString() + " PESOS M.N., Y HAS DECIDIDO PAGARLO EN " + Credito.Plazos.ToString() + " PLAZOS DE FORMA " + Credito.TasaTipoId.ToUpper() + ". ES TU RESPONSABILIDAD ABONARLE A " + Credito.Distribuidor.ToUpper() + " ANTES DE CADA MARTES DE LA SEMANA EL MONTO SEÑALADO EN LA TABLA QUE SE ENCUENTRA A CONTINUACION:")
        //        .SetTextAlignment(TextAlignment.JUSTIFIED)
        //        .SetFontSize(8);

        //        Paragraph parr2 = new Paragraph("DE TUS PAGOS PUNTUALES DEPENDERÁ TU BUEN HISTORIAL Y LA POSIBILIDAD DE ACCEDER A FUTUROS CREDITOS.")
        //        .SetTextAlignment(TextAlignment.JUSTIFIED)
        //        .SetFontSize(9)
        //        .SetBold();

        //        float[] pointColumnWidths = { 75F, 250F, 150F, 125F, 150F };
        //        Table table = new(pointColumnWidths);

        //        Cell c1 = new();
        //        c1.Add(new Paragraph("# PAGO"));
        //        c1.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
        //        c1.SetBorder(Border.NO_BORDER);
        //        c1.SetTextAlignment(TextAlignment.CENTER);
        //        c1.SetBold();

        //        Cell c2 = new();
        //        c2.Add(new Paragraph("FECHA LIMITE DE PAGO"));
        //        c2.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
        //        c2.SetBorder(Border.NO_BORDER);
        //        c2.SetTextAlignment(TextAlignment.CENTER);
        //        c2.SetBold();

        //        Cell c3 = new();
        //        c3.Add(new Paragraph("SALDO INICIAL"));
        //        c3.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
        //        c3.SetBorder(Border.NO_BORDER);
        //        c3.SetTextAlignment(TextAlignment.CENTER);
        //        c3.SetBold();

        //        Cell c4 = new();
        //        c4.Add(new Paragraph("ABONO"));
        //        c4.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
        //        c4.SetBorder(Border.NO_BORDER);
        //        c4.SetTextAlignment(TextAlignment.CENTER);
        //        c4.SetBold();

        //        Cell c5 = new();
        //        c5.Add(new Paragraph("SALDO FINAL"));
        //        c5.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
        //        c5.SetBorder(Border.NO_BORDER);
        //        c5.SetTextAlignment(TextAlignment.CENTER);
        //        c5.SetBold();

        //        // Adding cells to the table       
        //        table.AddCell(c1);
        //        table.AddCell(c2);
        //        table.AddCell(c3);
        //        table.AddCell(c4);
        //        table.AddCell(c5);

        //        var importe = Credito.ImporteTotal;

        //        foreach (var Pago in Pagos)
        //        {
        //            var abono = Pago.ImporteTotal;

        //            Cell nP = new();
        //            nP.Add(new Paragraph(Pago.NoPago.ToString()));
        //            nP.SetBackgroundColor(ColorConstants.WHITE);
        //            nP.SetBorder(Border.NO_BORDER);
        //            nP.SetTextAlignment(TextAlignment.CENTER);

        //            Cell fch = new();
        //            fch.Add(new Paragraph(Pago.FechaVencimiento.ToString("yyyy/MM/dd")));
        //            fch.SetBackgroundColor(ColorConstants.WHITE);
        //            fch.SetBorder(Border.NO_BORDER);
        //            fch.SetTextAlignment(TextAlignment.CENTER);

        //            Cell sI = new();
        //            sI.Add(new Paragraph(Funciones.Truncate((decimal)importe, 2).ToString()));
        //            sI.SetBackgroundColor(ColorConstants.WHITE);
        //            sI.SetBorder(Border.NO_BORDER);
        //            sI.SetTextAlignment(TextAlignment.CENTER);

        //            Cell ab = new();
        //            ab.Add(new Paragraph(Funciones.Truncate((decimal)abono, 2).ToString()));
        //            ab.SetBackgroundColor(ColorConstants.WHITE);
        //            ab.SetBorder(Border.NO_BORDER);
        //            ab.SetTextAlignment(TextAlignment.CENTER);

        //            importe -= abono;

        //            Cell sf = new();
        //            sf.Add(new Paragraph(Funciones.Truncate((decimal)importe, 2).ToString()));
        //            sf.SetBackgroundColor(ColorConstants.WHITE);
        //            sf.SetBorder(Border.NO_BORDER);
        //            sf.SetTextAlignment(TextAlignment.CENTER);

        //            table.AddCell(nP);
        //            table.AddCell(fch);
        //            table.AddCell(sI);
        //            table.AddCell(ab);
        //            table.AddCell(sf);
        //        }

        //        var dia = DateTime.Now.Day;
        //        var mes = DateTime.Now.Month;
        //        var año = DateTime.Now.Year;

        //        var diaf = Credito.UltimoVencimiento.Value.Day;
        //        var mesf = Credito.UltimoVencimiento.Value.Month;
        //        var añof = Credito.UltimoVencimiento.Value.Year;

        //        Paragraph parr3 = new Paragraph("EN_____________________,____________________, A LOS " + dia.ToString() + " (" + Funciones.NumeroALetras(dia, false) + ") DIAS DEL MES DE " + Funciones.ObtenerNombreMesNumero(mes).ToUpper() + " DE " + año.ToString() + " (" + Funciones.NumeroALetras(año, false) + "), POR ESTE PAGARÉ DEBO Y ME OBLIGO INCONDICIONALMENTE A PAGAR A LA ORDEN DE_________________________________, EN SUS OFICINAS UBICADAS EN______________________________, EN_____________________________, ___________________________, EL DÍA " + diaf.ToString() + " (" + Funciones.NumeroALetras(diaf, false) + ") DEL MES DE " + Funciones.ObtenerNombreMesNumero(mesf).ToUpper() + " DE " + añof.ToString() + " (" + Funciones.NumeroALetras(añof, false) + "), LA CANTIDAD DE " + Credito.ImporteTotal.Value.ToString("C", CultureInfo.CurrentCulture) + " (" + Funciones.NumeroALetras((decimal)Credito.ImporteTotal, true) + "), CANTIDAD RECIBIDA A MI ENTERA SATISFACCIÓN. SI EL IMPORTE DEL PRESENTE NO FUERE CUBIERTO A LA FECHA DE SU VENCIMIENTO, CAUSARA INTERESES MORATORIOS AL TIPO DEL_____________% MENSUAL.")
        //            .SetTextAlignment(TextAlignment.JUSTIFIED)
        //            .SetFontSize(8);

        //        Paragraph sign = new Paragraph()
        //          .SetFontSize(7)
        //          .SetBold()
        //          .SetTextAlignment(TextAlignment.CENTER)
        //          .Add(titletext2);

        //        Paragraph parr4 = new Paragraph("REALIZA EL PAGO A: " + Credito.Distribuidor.ToUpper() + ", TELÉFONO: " + Credito.CelularDistribuidor.ToUpper())
        //         .SetFontSize(8)
        //         .SetBold();

        //        Paragraph title2 = new Paragraph("Beneficiario")
        //         .SetFontSize(15)
        //         .SetBold()
        //         .SetTextAlignment(TextAlignment.CENTER);

        //        Paragraph parr5 = new Paragraph("DESIGNACIÓN DE BENEFICIARIO")
        //        .SetFontSize(9)
        //        .SetBold();


        //        Text titletext8 = new Text("NOMBRE: ")
        //            .SetBold();

        //        Text titletext9 = new Text("_______________________________________________________________________________________________")
        //            .SetFontColor(ColorConstants.LIGHT_GRAY);

        //        Paragraph parr6 = new Paragraph()
        //          .SetFontSize(9);

        //        Text titletext10 = new Text("PARENTESCO: ")
        //           .SetBold();

        //        Text titletext11 = new Text("_____________________________________________")
        //            .SetFontColor(ColorConstants.LIGHT_GRAY);

        //        Text titletext12 = new Text(" FECHA DE NACIMIENTO: ")
        //          .SetBold();

        //        Text titletext13 = new Text("_______________________")
        //            .SetFontColor(ColorConstants.LIGHT_GRAY);

        //        Paragraph parr7 = new Paragraph()
        //          .SetFontSize(9);

        //        parr6.Add(titletext8);
        //        parr6.Add(titletext9);

        //        parr7.Add(titletext10);
        //        parr7.Add(titletext11);
        //        parr7.Add(titletext12);
        //        parr7.Add(titletext13);

        //        float[] pointColumnWidths2 = { 375, 372 };
        //        Table table2 = new(pointColumnWidths2);

        //        Paragraph sign2 = new Paragraph()
        //        .SetFontSize(7)
        //        .SetBold()
        //        .SetTextAlignment(TextAlignment.CENTER)
        //        .Add(new Text("FIRMA DE AUTORIZACIÓN POR PARTE DEL CLIENTE\nACEPTO LAS CONDICIONES DE ENTREGA DE IMPORTE\nAL BENEFICIARIO EN CASO DE MI FALLECIMIENTO."));

        //        Cell t2c1 = new();
        //        t2c1.Add(new Paragraph(""));
        //        t2c1.SetBorder(Border.NO_BORDER);
        //        t2c1.SetTextAlignment(TextAlignment.CENTER);
        //        t2c1.SetBold();

        //        Cell t2c2 = new();
        //        t2c2.Add(sign2);
        //        t2c2.SetBorder(Border.NO_BORDER);
        //        t2c2.SetTextAlignment(TextAlignment.CENTER);
        //        t2c2.SetBold();

        //        table2.AddCell(t2c1);
        //        table2.AddCell(t2c2);

        //        Paragraph parr8 = new Paragraph("Nota: El apoyo de gastos funerarios será por la cantidad de $ 6,000 (son Seis mil pesos 00/100 mn), de la cual se descontará el adeudo vigente a la fecha del deceso, no aplica en casos de Muerte Violenta (Homicidio, Suicidio o accidentes de cualquier tipo) o Enfermedad Terminal (Cáncer, Diabetes, Cardiovasculares o sida). El tramite deberá realizarse en un plazo no mayor a 30 días naturales a partir de la fecha de la defunción.")
        //         .SetFontSize(8)
        //         .SetBold()
        //         .SetTextAlignment(TextAlignment.JUSTIFIED);

        //        Paragraph title3 = new Paragraph("CARTA RESPONSIVA")
        //       .SetFontSize(14)
        //       .SetBold()
        //       .SetTextAlignment(TextAlignment.CENTER);

        //        Text text1 = new Text("Aceptar ser ")
        //            .SetFontColor(ColorConstants.DARK_GRAY);

        //        Text text2 = new Text("testaferro ")
        //            .SetFontColor(ColorConstants.DARK_GRAY)
        //            .SetBold();

        //        Text text3 = new Text("o ")
        //            .SetFontColor(ColorConstants.DARK_GRAY);

        //        Text text4 = new Text("prestanombres")
        //           .SetFontColor(ColorConstants.DARK_GRAY)
        //           .SetBold();

        //        Text text5 = new Text(", puede traer consecuencias graves como ser acusado de cómplice en diversos delitos fiscales o fraudes, por eso la ")
        //           .SetFontColor(ColorConstants.DARK_GRAY);

        //        Text text6 = new Text("Comisión Nacional para la Protección y Defensa de los Usuarios de Servicios Financieros (Condusef) ")
        //           .SetFontColor(ColorConstants.DARK_GRAY)
        //           .SetBold();

        //        Text text7 = new Text("recomienda pensar dos veces antes de aceptar serlo.")
        //            .SetFontColor(ColorConstants.DARK_GRAY);

        //        Paragraph parr9 = new Paragraph()
        //          .SetTextAlignment(TextAlignment.JUSTIFIED)
        //          .SetFontSize(12);

        //        parr9.Add(text1);
        //        parr9.Add(text2);
        //        parr9.Add(text3);
        //        parr9.Add(text4);
        //        parr9.Add(text5);
        //        parr9.Add(text6);
        //        parr9.Add(text7);

        //        Text text8 = new Text("Prestanombres")
        //          .SetFontColor(ColorConstants.DARK_GRAY)
        //          .SetBold();

        //        Text text9 = new Text(", es aquel individuo que finge realizar transacciones financieras por cuenta propia asumiendo las obligaciones como si fueran suyas, pero el dinero es para otra persona.")
        //          .SetFontColor(ColorConstants.DARK_GRAY);

        //        Paragraph parr10 = new Paragraph()
        //          .SetFontSize(12)
        //          .SetTextAlignment(TextAlignment.JUSTIFIED);

        //        parr10.Add(text8);
        //        parr10.Add(text9);

        //        Paragraph parr11 = new Paragraph("Además, corre el riesgo de robo de identidad y se pueden adquirir endeudamientos ajenos a la voluntad.")
        //          .SetTextAlignment(TextAlignment.JUSTIFIED)
        //          .SetFontColor(ColorConstants.DARK_GRAY)
        //          .SetFontSize(12);

        //        Paragraph parr12 = new Paragraph("Toma en cuenta que si solicitas un préstamo a tu nombre y el sujeto que te pidió el favor de hacerlo, se retrasa o no lo paga, TÚ serás el único responsable de la deuda.")
        //          .SetTextAlignment(TextAlignment.JUSTIFIED)
        //          .SetFontColor(ColorConstants.DARK_GRAY)
        //          .SetFontSize(12);

        //        Paragraph parr13 = new Paragraph("NO PERMITAS QUE TUS DATOS PERSONALES SEAN ROBADOS")
        //         .SetTextAlignment(TextAlignment.JUSTIFIED)
        //         .SetFontColor(ColorConstants.DARK_GRAY)
        //         .SetFontSize(12);

        //        Paragraph parr14 = new Paragraph("Nombre y firma del cliente")
        //         .SetFontColor(ColorConstants.DARK_GRAY)
        //         .SetFontSize(12)
        //         .SetTextAlignment(TextAlignment.CENTER);

        //        Paragraph parr15 = new Paragraph("A la firma de este documento hago constar que los datos personales proporcionados son verídicos, así mismo asumo responsabilidad en la obligación de pago que he contraído.")
        //         .SetFontColor(ColorConstants.DARK_GRAY)
        //         .SetFontSize(10)
        //         .SetTextAlignment(TextAlignment.CENTER);

        //        AreaBreak aB = new();

        //        doc.SetMargins(25, 55, 50, 35);
        //        doc.Add(date);
        //        doc.Add(img);
        //        doc.Add(title);
        //        doc.Add(parr1);
        //        doc.Add(parr2);
        //        doc.Add(table);

        //        doc.Add(aB);

        //        doc.Add(parr3);
        //        doc.Add(salto3);
        //        doc.Add(ls);
        //        doc.Add(sign);
        //        doc.Add(new Paragraph());
        //        doc.Add(parr4);
        //        doc.Add(dl);
        //        doc.Add(title2);
        //        doc.Add(sl);
        //        doc.Add(parr5);
        //        doc.Add(parr6);
        //        doc.Add(parr7);
        //        doc.Add(salto2);
        //        doc.Add(lfl);
        //        doc.Add(table2);
        //        doc.Add(parr8);

        //        doc.Add(aB);

        //        img.SetHeight(80);
        //        doc.Add(img);
        //        doc.Add(salto2);
        //        doc.Add(title3);
        //        doc.Add(salto2);
        //        doc.Add(parr9);
        //        doc.Add(new Paragraph());
        //        doc.Add(parr10);
        //        doc.Add(new Paragraph());
        //        doc.Add(parr11);
        //        doc.Add(new Paragraph());
        //        doc.Add(parr12);
        //        doc.Add(new Paragraph());
        //        doc.Add(parr13);
        //        doc.Add(salto4);
        //        ls.SetMarginLeft(175);
        //        ls.SetMarginRight(175);
        //        doc.Add(ls);
        //        doc.Add(parr14);
        //        doc.Add(salto4);
        //        doc.Add(parr15);

        //        doc.Close();

        //        byte[] byteStream = ms.ToArray();
        //        ms = new MemoryStream();
        //        ms.Write(byteStream, 0, byteStream.Length);
        //        ms.Position = 0;

        //        return new FileStreamResult(ms, "application/pdf");
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }

        //}


        [HttpPost]
        [Route("addTiendita")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> addTiendita(PeticionesRest.Creditos.CanjeaVale.addTienditaSocia parData)
        {

            try
            {

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                parData.UsuarioId = UsuarioActual.UsuarioID;
                parData.PersonaID = UsuarioActual.PersonaID.Value;

                var resVW = await ConexionDB.database.QueryAsync<CatalogoCajasUsuarios_VW>("WHERE (UsuarioID = @0) AND (SucursalID = @1) AND (ProductoID = @2)", parData.UsuarioId, parData.SucursalId, parData.ProductoID).FirstOrDefaultAsync();

                if (!resVW.Activo)
                {
                    await ConexionDB.Destroy();
                    return Ok(new
                    {
                        status = false,
                        msj = "La caja esta cerrada, intente mas tarde"
                    });
                }

                ConexionDB.database.BeginTransaction();
                parData.ClienteId = parData.DistribuidorId;
                int? DistribuidorId = parData.DistribuidorId == 0 ? null : parData.DistribuidorId;
                int? ClienteId = parData.ClienteId == 0 ? null : parData.ClienteId;

                var detalle = new ArrayList();

                switch (parData.Sucursal.sistema)
                {
                    case "VR":
                        parData.LetraSistema = "C";
                        break;
                    case "GYT":
                        parData.LetraSistema = "G";
                        break;
                    case "S3":
                        parData.LetraSistema = "S";
                        break;
                    case "LS4":
                        parData.LetraSistema = "L";
                        break;
                    case "CV":
                        parData.LetraSistema = "CV";
                        break;
                    case "RPS":
                        parData.LetraSistema = "S9_";
                        break;
                    case "PS":
                        parData.LetraSistema = "H";
                        break;
                    default:
                        break;
                }

                foreach (Articulos item in parData.articles)
                {

                    detalle.Add(new
                    {
                        id_sku = item.id,
                        cantidad = item.qty
                    });

                }

                if (parData.articles.Count > 0)
                {
                    foreach (Articulos item in parData.articles)
                    {
                        if (item.qty <= 0)
                        {
                            await ConexionDB.Destroy();
                            return BadRequest("Verifique la disponibilidad de Artículo(s)");
                        }

                    }
                    var Json = new
                    {
                        id_empresa = 1,
                        fecha = DateTime.Now.ToString("yyyy/MM/dd"),
                        sucursal = parData.SucursalId,
                        tipo_usuario1 = "4",
                        id_usuario = parData.LetraSistema.ToString() + parData.DistribuidorId.ToString(),
                        sistema1 = parData.Sucursal.sistema,
                        id_forma_pago = 10,
                        referencia_forma_pago = 0,
                        monedero = 0,
                        detalle
                    };

                    parData.Json = JsonConvert.SerializeObject(Json);
                }
                var parms = new
                {
                    ProductoId = parData.ProductoID,
                    ProductoTienditaID = parData.ProductoTienditaID,
                    SucursalId = parData.SucursalId,
                    CajaID = parData.CajaID,
                    Capital = parData.Capital,
                    Plazos = parData.Plazos,
                    UsuarioId = parData.UsuarioId,
                    TipoDesembolsoID = parData.TipoDesembolsoID,
                    PersonaID = parData.PersonaID,
                    DistribuidorId = DistribuidorId,
                    ClienteId = ClienteId,
                    Json = parData.Json
                };

                string Stored = "";

                Stored = "EXEC Creditos.pa_CreaCreditoTienditaSocia_Ins @ProductoId, @ProductoTienditaID ,@DistribuidorId ,@ClienteId ,@SucursalId, @CajaID, @Capital,@Plazos, @UsuarioId, @TipoDesembolsoID, @PersonaID, @Json";


                var res = await ConexionDB.database.QueryAsync<CompraTiendita>(Stored, parms).FirstOrDefaultAsync();

                if (res.regresa != 1)
                {
                    ConexionDB.database.AbortTransaction();
                    return Ok(res);
                }

                var Credito = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoID = @0", res.CreditoId).FirstOrDefaultAsync();


                await ConexionDB.database.UpdateAsync(Credito);

                // crear una variable de tipo lista para guardar los articulos de la tiendita
                foreach (Articulos item in parData.articles)
                {
                    //Mapear pardata.articles para insertar en la tabla CreditoTiendita
                    var tiendita = new CreditoTiendita()
                    {
                        CreditoID = Credito.CreditoID,
                        SKU = item.id.ToString(),
                        Unidades = item.qty,
                        PrecioUnitario = item.price,
                        Descripcion = item.desc,
                        FechaRegistra = DateTime.Now,
                        UsuarioRegistra = UsuarioActual.UsuarioID,
                        PersonaRegistra = UsuarioActual.PersonaID.Value,
                        PrecioOriginal = item.precioOrg,
                        PrecioDescuento = item.price,
                        CodigoSKU = item.code,
                    };



                    if (item.code != null && item.code != "")
                    {
                        var estatusCodigo = new
                        {
                            UsuarioID = UsuarioActual.UsuarioID,
                            CodigoID = 0,
                            Codigo = item.code,
                            Estatus = 'N',
                        };
                        string storedCodigos = "EXEC Creditos.pa_CambiarEstatusCodigosTiendita @UsuarioID,@CodigoID,@Codigo,@Estatus";
                        await ConexionDB.database.QueryAsync<ConfiaWebApi.ModlesSP.Creditos.CodigosTienditaRes>(storedCodigos, estatusCodigo).FirstOrDefaultAsync();
                    }

                    await ConexionDB.database.InsertAsync(tiendita);
                }

                ConexionDB.database.CompleteTransaction();

                await ConexionDB.Destroy();

                return Ok(res);

            }
            catch (Exception ex)
            {
                ConexionDB.database.AbortTransaction();
                await ConexionDB.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        [Route("addVentaContado")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> addVentaContado(PeticionesRest.Creditos.CanjeaVale.addVentaContado parData)
        {

            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                parData.UsuarioId = UsuarioActual.UsuarioID;
                parData.PersonaID = UsuarioActual.PersonaID.Value;

                var resVW = await ConexionDB.database.QueryAsync<CatalogoCajasUsuarios_VW>("WHERE (UsuarioID = @0) AND (SucursalID = @1) AND (ProductoID = @2)", parData.UsuarioId, parData.SucursalId, parData.ProductoID).FirstOrDefaultAsync();

                if (!resVW.Activo)
                {
                    await ConexionDB.Destroy();
                    return Ok(new
                    {
                        status = false,
                        msj = "La caja esta cerrada, intente mas tarde"
                    });
                }

                ConexionDB.database.BeginTransaction();

                var detalle = new ArrayList();

                switch (parData.Sucursal.sistema)
                {
                    case "VR":
                        parData.LetraSistema = "C";
                        break;
                    case "GYT":
                        parData.LetraSistema = "G";
                        break;
                    case "S3":
                        parData.LetraSistema = "S";
                        break;
                    case "LS4":
                        parData.LetraSistema = "L";
                        break;
                    case "CV":
                        parData.LetraSistema = "CV";
                        break;
                    case "RPS":
                        parData.LetraSistema = "S9_";
                        break;
                    case "PS":
                        parData.LetraSistema = "H";
                        break;
                    default:
                        break;
                }

                foreach (Articulos item in parData.articles)
                {

                    detalle.Add(new
                    {
                        id_sku = item.id,
                        cantidad = item.qty
                    });

                }

                if (parData.articles.Count > 0)
                {
                    foreach (Articulos item in parData.articles)
                    {
                        if (item.qty <= 0)
                        {
                            await ConexionDB.Destroy();
                            return BadRequest("Verifique la disponibilidad de Artículo(s)");
                        }

                    }
                    var Json = new
                    {
                        id_empresa = 1,
                        fecha = DateTime.Now.ToString("yyyy/MM/dd"),
                        sucursal = parData.SucursalId,
                        tipo_usuario1 = "4",
                        id_usuario = parData.LetraSistema.ToString() + parData.UsuarioId.ToString(),
                        sistema1 = parData.Sucursal.sistema,
                        id_forma_pago = 10,
                        referencia_forma_pago = 0,
                        monedero = 0,
                        detalle
                    };

                    parData.Json = JsonConvert.SerializeObject(Json);
                }
                var parms = new
                {
                    ProductoID = parData.ProductoID,
                    ProductoTienditaID = parData.ProductoTienditaID,
                    SucursalId = parData.SucursalId,
                    CajaID = parData.CajaID,
                    Capital = parData.Capital,
                    UsuarioId = parData.UsuarioId,
                    TipoDesembolsoID = parData.TipoDesembolsoID,
                    PersonaID = parData.PersonaID,
                    Json = parData.Json
                };

                string Stored = "";

                Stored = "EXEC Creditos.pa_CreaCreditoVentaContado_Ins @ProductoID,@SucursalId,@CajaID,@Capital,@UsuarioId,@PersonaID,@Json";


                var res = await ConexionDB.database.QueryAsync<CompraTiendita>(Stored, parms).FirstOrDefaultAsync();

                if (res.regresa != 1)
                {
                    ConexionDB.database.AbortTransaction();
                    return Ok(res);
                }

                var Credito = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoID = @0", res.CreditoId).FirstOrDefaultAsync();


                await ConexionDB.database.UpdateAsync(Credito);

                // crear una variable de tipo lista para guardar los articulos de la tiendita
                foreach (Articulos item in parData.articles)
                {
                    //Mapear pardata.articles para insertar en la tabla CreditoTiendita
                    var tiendita = new CreditoTiendita()
                    {
                        CreditoID = Credito.CreditoID,
                        SKU = item.id.ToString(),
                        Unidades = item.qty,
                        PrecioUnitario = item.price,
                        Descripcion = item.desc,
                        FechaRegistra = DateTime.Now,
                        UsuarioRegistra = UsuarioActual.UsuarioID,
                        PersonaRegistra = UsuarioActual.PersonaID.Value,
                        PrecioOriginal = item.precioOrg,
                        PrecioDescuento = item.price
                    };

                    if (item.code != null && item.code != "")
                    {
                        var estatusCodigo = new
                        {
                            UsuarioID = UsuarioActual.UsuarioID,
                            CodigoID = 0,
                            Codigo = item.code,
                            Estatus = 'N',
                        };
                        string storedCodigos = "EXEC Creditos.pa_CambiarEstatusCodigosTiendita @UsuarioID,@CodigoID,@Codigo,@Estatus";
                        await ConexionDB.database.QueryAsync<ConfiaWebApi.ModlesSP.Creditos.CodigosTienditaRes>(storedCodigos, estatusCodigo).FirstOrDefaultAsync();
                    }

                    await ConexionDB.database.InsertAsync(tiendita);
                }

                ConexionDB.database.CompleteTransaction();

                await ConexionDB.Destroy();

                return Ok(res);

            }
            catch (Exception ex)
            {
                ConexionDB.database.AbortTransaction();
                await ConexionDB.Destroy();
                return BadRequest(ex.Message);
            }

        }


        [HttpPost]
        [Route("addVentaContadoMonedero")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> addVentaContadoMonedero(PeticionesRest.Creditos.CanjeaVale.addVentaContadoMonedero parData)
        {

            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                parData.UsuarioId = UsuarioActual.UsuarioID;
                /* parData.PersonaID = UsuarioActual.PersonaID.Value; */

                var resVW = await ConexionDB.database.QueryAsync<CatalogoCajasUsuarios_VW>("WHERE (UsuarioID = @0) AND (SucursalID = @1) AND (ProductoID = @2)", parData.UsuarioId, parData.SucursalId, parData.ProductoID).FirstOrDefaultAsync();

                if (!resVW.Activo)
                {
                    await ConexionDB.Destroy();
                    return Ok(new
                    {
                        status = false,
                        msj = "La caja esta cerrada, intente mas tarde"
                    });
                }

                ConexionDB.database.BeginTransaction();

                var detalle = new ArrayList();

                switch (parData.Sucursal.sistema)
                {
                    case "VR":
                        parData.LetraSistema = "C";
                        break;
                    case "GYT":
                        parData.LetraSistema = "G";
                        break;
                    case "S3":
                        parData.LetraSistema = "S";
                        break;
                    case "LS4":
                        parData.LetraSistema = "L";
                        break;
                    case "CV":
                        parData.LetraSistema = "CV";
                        break;
                    case "RPS":
                        parData.LetraSistema = "S9_";
                        break;
                    case "PS":
                        parData.LetraSistema = "H";
                        break;
                    default:
                        break;
                }

                foreach (Articulos item in parData.articles)
                {

                    detalle.Add(new
                    {
                        id_sku = item.id,
                        cantidad = item.qty
                    });

                }

                if (parData.articles.Count > 0)
                {
                    foreach (Articulos item in parData.articles)
                    {
                        if (item.qty <= 0)
                        {
                            await ConexionDB.Destroy();
                            return BadRequest("Verifique la disponibilidad de Artículo(s)");
                        }

                    }
                    var Json = new
                    {
                        id_empresa = 1,
                        fecha = DateTime.Now.ToString("yyyy/MM/dd"),
                        sucursal = parData.SucursalId,
                        tipo_usuario1 = "4",
                        id_usuario = parData.LetraSistema.ToString() + parData.UsuarioId.ToString(),
                        sistema1 = parData.Sucursal.sistema,
                        id_forma_pago = 10,
                        referencia_forma_pago = 0,
                        monedero = 0,
                        detalle
                    };

                    parData.Json = JsonConvert.SerializeObject(Json);
                }
                var parms = new
                {
                    ProductoID = parData.ProductoID,
                    ProductoTienditaID = parData.ProductoTienditaID,
                    SucursalId = parData.SucursalId,
                    CajaID = parData.CajaID,
                    Capital = parData.Capital,
                    UsuarioId = parData.UsuarioId,
                    TipoDesembolsoID = parData.TipoDesembolsoID,
                    PersonaID = parData.DistribuidorID,
                    Json = parData.Json
                };

                string Stored = "";

                Stored = "EXEC Creditos.pa_CreaCreditoVentaMonedero @ProductoID,@SucursalId,@CajaID,@Capital,@UsuarioId,@PersonaID,@Json";


                var res = await ConexionDB.database.QueryAsync<CompraTiendita>(Stored, parms).FirstOrDefaultAsync();

                if (res.regresa != 1)
                {
                    ConexionDB.database.AbortTransaction();
                    return Ok(res);
                }

                var Credito = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoID = @0", res.CreditoId).FirstOrDefaultAsync();


                await ConexionDB.database.UpdateAsync(Credito);

                // crear una variable de tipo lista para guardar los articulos de la tiendita
                foreach (Articulos item in parData.articles)
                {
                    //Mapear pardata.articles para insertar en la tabla CreditoTiendita
                    var tiendita = new CreditoTiendita()
                    {
                        CreditoID = Credito.CreditoID,
                        SKU = item.id.ToString(),
                        Unidades = item.qty,
                        PrecioUnitario = item.price,
                        Descripcion = item.desc,
                        FechaRegistra = DateTime.Now,
                        UsuarioRegistra = UsuarioActual.UsuarioID,
                        PersonaRegistra = UsuarioActual.PersonaID.Value,
                        PrecioOriginal = item.precioOrg,
                        PrecioDescuento = item.price
                    };

                    if (item.code != null && item.code != "")
                    {
                        var estatusCodigo = new
                        {
                            UsuarioID = UsuarioActual.UsuarioID,
                            CodigoID = 0,
                            Codigo = item.code,
                            Estatus = 'N',
                        };
                        string storedCodigos = "EXEC Creditos.pa_CambiarEstatusCodigosTiendita @UsuarioID,@CodigoID,@Codigo,@Estatus";
                        await ConexionDB.database.QueryAsync<ConfiaWebApi.ModlesSP.Creditos.CodigosTienditaRes>(storedCodigos, estatusCodigo).FirstOrDefaultAsync();
                    }

                    await ConexionDB.database.InsertAsync(tiendita);
                }

                ConexionDB.database.CompleteTransaction();

                await ConexionDB.Destroy();

                return Ok(res);

            }
            catch (Exception ex)
            {
                ConexionDB.database.AbortTransaction();
                await ConexionDB.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        [Route("pdfVentaContado")]
        [Authorize]
        public async Task<IActionResult> pdfVentaContado(PeticionesRest.Creditos.CanjeaVale.PDF parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var Credito = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoID = @CreditoID", parData).FirstOrDefaultAsync();
                var Articulos = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Creditos.CreditoTiendita>("WHERE CreditoID = @CreditoID", parData).ToArrayAsync();
                if (Articulos.Length == 0)
                {
                    await ConexionDB.Destroy();
                    throw new Exception("No se encontró información");
                }
                var TipoCredito = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Creditos.CatalogoTipoCredito>("WHERE TipoCreditoID = @0", Credito.TipoCreditoID).FirstOrDefaultAsync();
                var CajaMovimiento = await ConexionDB.database.QueryAsync<CatalogoCajas>("WHERE CajaID = @0", Credito.CajaID).FirstOrDefaultAsync();
                parData.ProductoID = producto;
                var Producto = await ConexionDB.database.SingleByIdAsync<Productos>(parData.ProductoID);

                var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");
                string dest = Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf"));

                NumberFormatInfo nfi = new CultureInfo(CultureInfo.CurrentCulture.ToString(), false).NumberFormat;
                nfi.PercentDecimalDigits = 0;

                PdfWriter pw = new(dest);

                PdfDocument pdfDocument = new(pw);

                Document doc = new(pdfDocument, PageSize.LETTER);

                doc.SetMargins(40, 55, 40, 55);

                PdfPage pdfPage = pdfDocument.AddNewPage();

                PdfCanvas canvas = new(pdfPage);

                canvas.Rectangle(30, 40, 550, 720);
                canvas.Stroke();

                LineSeparator ls = new(new SolidLine());

                Paragraph salto1 = new(new Text("\n"));

                Paragraph salto3 = new(new Text("\n\n\n"));

                Paragraph salto4 = new(new Text("\n\n\n\n"));

                doc.Add(ls);
                Paragraph title = new Paragraph("DETALLE DE VENTA CONTADO")
                    .SetFontSize(14)
                    .SetBold()
                    .SetTextAlignment(TextAlignment.CENTER);
                doc.Add(title);
                doc.Add(ls);
                doc.Add(salto1);

                Cell cParafo = new();
                cParafo.Add(new Paragraph());
                cParafo.SetBackgroundColor(ColorConstants.WHITE);
                cParafo.SetBorder(Border.NO_BORDER);

                float[] pointColumnWidths = { 100, 100, 100, 50, 250 };
                Table table = new(pointColumnWidths);

                Cell c0 = new();
                c0.Add(new Paragraph("CREDITO ID:"));
                c0.SetBackgroundColor(ColorConstants.WHITE);
                c0.SetTextAlignment(TextAlignment.CENTER);
                c0.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c0.SetFontSize(10);
                c0.SetBold();

                Cell creditoID = new();
                creditoID.Add(new Paragraph(Credito.CreditoID.ToString()));
                creditoID.SetBackgroundColor(ColorConstants.WHITE);
                creditoID.SetTextAlignment(TextAlignment.CENTER);
                creditoID.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                creditoID.SetFontSize(10);

                Cell c1 = new();
                c1.Add(new Paragraph("TIPO VENTA:"));
                c1.SetBackgroundColor(ColorConstants.WHITE);
                c1.SetTextAlignment(TextAlignment.CENTER);
                c1.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c1.SetFontSize(10);
                c1.SetBold();

                Cell c2 = new();
                c2.Add(new Paragraph(TipoCredito.Clave));
                c2.SetBackgroundColor(ColorConstants.WHITE);
                c2.SetTextAlignment(TextAlignment.CENTER);
                c2.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c2.SetFontSize(10);

                Cell c3 = new();
                c3.Add(new Paragraph(TipoCredito.Descripcion));
                c3.SetBackgroundColor(ColorConstants.WHITE);
                c3.SetTextAlignment(TextAlignment.CENTER);
                c3.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c3.SetFontSize(10);

                table.AddCell(c0);
                table.AddCell(creditoID);
                table.AddCell(c1);
                table.AddCell(c2);
                table.AddCell(c3);
                doc.Add(table);
                doc.Add(salto1);

                float[] pointColumnWidths2 = { 200, 100, 300 };
                Table table2 = new(pointColumnWidths2);

                Cell c7 = new();
                c7.Add(new Paragraph("CAJA:"));
                c7.SetBackgroundColor(ColorConstants.WHITE);
                c7.SetTextAlignment(TextAlignment.CENTER);
                c7.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c7.SetFontSize(10);
                c7.SetBold();

                Cell c8 = new();
                c8.Add(new Paragraph(CajaMovimiento.Nombre));
                c8.SetBackgroundColor(ColorConstants.WHITE);
                c8.SetTextAlignment(TextAlignment.CENTER);
                c8.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c8.SetFontSize(10);

                Cell c9 = new();
                c9.Add(new Paragraph(CajaMovimiento.Descripcion));
                c9.SetBackgroundColor(ColorConstants.WHITE);
                c9.SetTextAlignment(TextAlignment.CENTER);
                c9.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c9.SetFontSize(10);

                table2.AddCell(c7);
                table2.AddCell(c8);
                table2.AddCell(c9);
                doc.Add(table2);
                doc.Add(salto1);

                float[] pointColumnWidths4 = { 50, 200, 100, 100, 100 };
                Table table4 = new(pointColumnWidths4);

                Cell c13 = new();
                c13.Add(new Paragraph("SKU"));
                c13.SetBackgroundColor(ColorConstants.WHITE);
                c13.SetTextAlignment(TextAlignment.CENTER);
                c13.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c13.SetFontSize(10);
                c13.SetBold();

                Cell c14 = new();
                c14.Add(new Paragraph("DESCRIPCION"));
                c14.SetBackgroundColor(ColorConstants.WHITE);
                c14.SetTextAlignment(TextAlignment.CENTER);
                c14.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c14.SetFontSize(10);
                c14.SetBold();

                Cell c15 = new();
                c15.Add(new Paragraph("UNIDADES"));
                c15.SetBackgroundColor(ColorConstants.WHITE);
                c15.SetTextAlignment(TextAlignment.CENTER);
                c15.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c15.SetFontSize(10);
                c15.SetBold();

                Cell c16 = new();
                c16.Add(new Paragraph("PRECIO"));
                c16.SetBackgroundColor(ColorConstants.WHITE);
                c16.SetTextAlignment(TextAlignment.CENTER);
                c16.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c16.SetFontSize(10);
                c16.SetBold();

                Cell c17 = new();
                c17.Add(new Paragraph("IMPORTE"));
                c17.SetBackgroundColor(ColorConstants.WHITE);
                c17.SetTextAlignment(TextAlignment.CENTER);
                c17.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c17.SetFontSize(10);
                c17.SetBold();

                table4.AddCell(c13);
                table4.AddCell(c14);
                table4.AddCell(c15);
                table4.AddCell(c16);
                table4.AddCell(c17);

                foreach (var item in Articulos)
                {
                    Cell tempSKU = new();
                    tempSKU.Add(new Paragraph(item.SKU));
                    tempSKU.SetBackgroundColor(ColorConstants.WHITE);
                    tempSKU.SetTextAlignment(TextAlignment.CENTER);
                    tempSKU.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                    tempSKU.SetFontSize(10);

                    Cell tempDesc = new();
                    tempDesc.Add(new Paragraph(item.Descripcion));
                    tempDesc.SetBackgroundColor(ColorConstants.WHITE);
                    tempDesc.SetTextAlignment(TextAlignment.CENTER);
                    tempDesc.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                    tempDesc.SetFontSize(10);

                    Cell tempUnidades = new();
                    tempUnidades.Add(new Paragraph(item.Unidades.ToString()));
                    tempUnidades.SetBackgroundColor(ColorConstants.WHITE);
                    tempUnidades.SetTextAlignment(TextAlignment.CENTER);
                    tempUnidades.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                    tempUnidades.SetFontSize(10);

                    Cell tempPrecio = new();
                    tempPrecio.Add(new Paragraph(item.PrecioOriginal?.ToString("C", CultureInfo.CurrentCulture)));
                    tempPrecio.SetBackgroundColor(ColorConstants.WHITE);
                    tempPrecio.SetTextAlignment(TextAlignment.CENTER);
                    tempPrecio.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                    tempPrecio.SetFontSize(10);

                    Cell tempImporte = new();
                    tempImporte.Add(new Paragraph(item.ImporteTotal?.ToString("C", CultureInfo.CurrentCulture)));
                    tempImporte.SetBackgroundColor(ColorConstants.WHITE);
                    tempImporte.SetTextAlignment(TextAlignment.CENTER);
                    tempImporte.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                    tempImporte.SetFontSize(10);

                    table4.AddCell(tempSKU);
                    table4.AddCell(tempDesc);
                    table4.AddCell(tempUnidades);
                    table4.AddCell(tempPrecio);
                    table4.AddCell(tempImporte);
                }
                Cell totalText = new(1, 4);
                totalText.Add(new Paragraph("TOTAL"));
                totalText.SetBackgroundColor(ColorConstants.WHITE);
                totalText.SetTextAlignment(TextAlignment.CENTER);
                totalText.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                totalText.SetFontSize(10);

                Cell totalNumber = new();
                totalNumber.Add(new Paragraph(Credito.ImporteTotal?.ToString("C", CultureInfo.CurrentCulture)));
                totalNumber.SetBackgroundColor(ColorConstants.WHITE);
                totalNumber.SetTextAlignment(TextAlignment.CENTER);
                totalNumber.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                totalNumber.SetFontSize(10);
                table4.AddCell(totalText);
                table4.AddCell(totalNumber);

                doc.Add(table4);
                doc.Add(salto1);

                float[] pointColumnWidths5 = { 150, 250, 200 };
                Table table5 = new(pointColumnWidths5);

                Cell c19 = new();
                c19.Add(new Paragraph("CAPTURA:"));
                c19.SetBackgroundColor(ColorConstants.WHITE);
                c19.SetTextAlignment(TextAlignment.CENTER);
                c19.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c19.SetFontSize(10);
                c19.SetBold();

                Cell c20 = new();
                c20.Add(new Paragraph(UsuarioActual != null ? UsuarioActual.NombreCompleto : " - "));
                c20.SetBackgroundColor(ColorConstants.WHITE);
                c20.SetTextAlignment(TextAlignment.CENTER);
                c20.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c20.SetFontSize(10);

                Cell c21 = new();
                c21.Add(new Paragraph(UsuarioActual != null ? UsuarioActual.PersonaID.ToString() : "Sistema"));
                c21.SetBackgroundColor(ColorConstants.WHITE);
                c21.SetTextAlignment(TextAlignment.CENTER);
                c21.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c21.SetFontSize(10);

                table5.AddCell(c19);
                table5.AddCell(c20);
                table5.AddCell(c21);
                doc.Add(table5);
                doc.Add(salto1);

                float[] pointColumnWidths6 = { 300, 300 };
                Table table6 = new(pointColumnWidths6);

                var fechaVenta = Credito.FechaHoraRegistro.Year == 1900 ? String.Empty : Credito.FechaHoraRegistro.ToString("dd/MM/yyyy hh:mm:ss tt");

                Cell c22 = new();
                c22.Add(new Paragraph("FECHA COMPRA:"));
                c22.SetBackgroundColor(ColorConstants.WHITE);
                c22.SetTextAlignment(TextAlignment.CENTER);
                c22.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c22.SetFontSize(9);
                c22.SetBold();

                Cell c23 = new();
                c23.Add(new Paragraph(fechaVenta));
                c23.SetBackgroundColor(ColorConstants.WHITE);
                c23.SetTextAlignment(TextAlignment.CENTER);
                c23.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c23.SetFontSize(9);

                table6.AddCell(c22);
                table6.AddCell(c23);
                doc.Add(table6);
                doc.Add(salto1);

                float[] pointColumnWidths10 = { 100, 200, 75, 225 };
                Table table10 = new(pointColumnWidths10);

                Cell c36 = new();
                c36.Add(new Paragraph("IMPRESION:"));
                c36.SetBackgroundColor(ColorConstants.WHITE);
                c36.SetTextAlignment(TextAlignment.CENTER);
                c36.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c36.SetFontSize(10);
                c36.SetBold();

                Cell c37 = new();
                c37.Add(new Paragraph(DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt")));
                c37.SetBackgroundColor(ColorConstants.WHITE);
                c37.SetTextAlignment(TextAlignment.CENTER);
                c37.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c37.SetFontSize(10);

                Cell c38 = new();
                c38.Add(new Paragraph(UsuarioActual.PersonaID.ToString()));
                c38.SetBackgroundColor(ColorConstants.WHITE);
                c38.SetTextAlignment(TextAlignment.CENTER);
                c38.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c38.SetFontSize(10);

                Cell c39 = new();
                c39.Add(new Paragraph(UsuarioActual.NombreCompleto));
                c39.SetBackgroundColor(ColorConstants.WHITE);
                c39.SetTextAlignment(TextAlignment.CENTER);
                c39.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c39.SetFontSize(10);

                table10.AddCell(c36);
                table10.AddCell(c37);
                table10.AddCell(c38);
                table10.AddCell(c39);
                doc.Add(table10);
                doc.Add(salto1);

                float[] pointColumnWidths11 = { 250, 250 };
                Table table11 = new(pointColumnWidths11);

                LineSeparator rl = new(new SolidLine());

                LineSeparator lfl = new(new SolidLine());

                Cell c40 = new();
                c40.Add(new Paragraph("ENTREGUE"));
                c40.SetBackgroundColor(ColorConstants.WHITE);
                c40.SetTextAlignment(TextAlignment.CENTER);
                c40.SetVerticalAlignment(VerticalAlignment.TOP);
                c40.SetBorder(Border.NO_BORDER);
                c40.SetFontSize(10);

                Cell c41 = new();
                c41.Add(new Paragraph("RECIBI"));
                c41.SetBackgroundColor(ColorConstants.WHITE);
                c41.SetTextAlignment(TextAlignment.CENTER);
                c41.SetVerticalAlignment(VerticalAlignment.TOP);
                c41.SetBorder(Border.NO_BORDER);
                c41.SetFontSize(10);

                Cell c42 = new();
                c42.Add(rl);
                c42.SetBackgroundColor(ColorConstants.WHITE);
                c42.SetTextAlignment(TextAlignment.CENTER);
                c42.SetVerticalAlignment(VerticalAlignment.BOTTOM);
                c42.SetBorder(Border.NO_BORDER);
                c42.SetFontSize(10);

                Cell c43 = new();
                c43.Add(lfl);
                c43.SetBackgroundColor(ColorConstants.WHITE);
                c43.SetTextAlignment(TextAlignment.CENTER);
                c43.SetVerticalAlignment(VerticalAlignment.BOTTOM);
                c43.SetBorder(Border.NO_BORDER);
                c43.SetFontSize(10);

                table11.AddCell(c42);
                table11.AddCell(c43);
                table11.AddCell(c40);
                table11.AddCell(c41);
                doc.Add(salto4);
                doc.Add(table11);

                ImageData data = ImageDataFactory.Create(Producto.Logo);
                Image wmImg = new(data);

                float pWidth = pdfDocument.GetDefaultPageSize().GetWidth();
                float pHeight = pdfDocument.GetDefaultPageSize().GetHeight();

                float iWidth = wmImg.GetImageWidth();
                float iHeight = wmImg.GetImageHeight();

                float scaleWidth = pWidth / iWidth;
                float scaleHeight = pHeight / iHeight;
                float scale = Math.Min(scaleWidth, scaleHeight) * 0.5f;

                wmImg.ScaleToFit(iWidth * scale, iHeight * scale);

                float xPosition = (pWidth - wmImg.GetImageScaledWidth()) / 2f;
                float yPosition = (pHeight - wmImg.GetImageScaledHeight()) / 2f;

                wmImg.SetFixedPosition(xPosition, yPosition);
                wmImg.SetOpacity(0.3f);

                doc.Add(wmImg);
                doc.Close();

                // Obtenemos el contenido de nuestro archivo de PDF
                var pdf = await System.IO.File.ReadAllBytesAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));

                // Obtenemos nuestro PDF
                var pdfStream = new MemoryStream();
                pdfStream.Write(pdf, 0, pdf.Length);
                pdfStream.Position = 0;

                System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));

                await ConexionDB.Destroy();

                return File(pdfStream, "application/pdf");
            }
            catch (Exception ex)
            {
                await ConexionDB.Destroy();
                return BadRequest(new
                {
                    message = ex.Message,
                });
            }
        }
    }
}

