using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Distribuidores;

using DBContext.DBConfia.Sistema;
using System.Collections;
using ConfiaWebApi.Code;

namespace ConfiaWebApi.Controllers.Creditos
{
    [Authorize]
    [ApiController]
    [Route("api/Creditos/[controller]")]
    public class NivelesDisController : ControllerBase
    {
        private DBConfiaContext DBContext;
        public NivelesDisController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpGet]
        [Route("obtenerProdMesaAclaracion")]
        [Authorize]
        public async Task<IActionResult> Get()
        {
            try
            {
                var obj = await DBContext.database.FetchAsync<DBContext.DBConfia.Creditos.ProductosVW>();
                await DBContext.Destroy();
                return Ok(obj);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("addProducto")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> AddProductoNew(PeticionesRest.Creditos.Producto.AddProducto parData)
        {
            try
            {
                var prod = new Productos();
                prod.ProductoID = parData.ProductoID;
                prod.Producto = parData.Producto;
                await DBContext.database.InsertAsync(prod);
                var prodActualizado = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.ProductosVW>("WHERE ProductoID = @0", prod.ProductoID).SingleOrDefaultAsync();
                await DBContext.Destroy();
                return Ok(prodActualizado);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.Creditos.Producto.Get parData)
        {
            if (parData.ProductoID != 0)
            {
                try
                {
                    var res = await DBContext.database.SingleByIdAsync<Productos>(parData.ProductoID);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }
            }
            else
            {
                try
                {
                    var Productos = await DBContext.database.FetchAsync<ProductosVW>();
                    var Empresas = await DBContext.database.FetchAsync<Empresas>();
                    var TasasTipos = await DBContext.database.FetchAsync<TasasTipos>();

                    ArrayList res = new();

                    foreach (var Producto in Productos)
                    {
                        var Empresa = Empresas.Where(x => x.empresaId == Producto.EmpresaId).FirstOrDefault();
                        var TasaTipo = TasasTipos.Where(x => x.TasaTipoId == Producto.TasaTipoId).FirstOrDefault();

                        var Logo = Producto.Logo != null ? Convert.ToBase64String(Producto.Logo) : null;

                        res.Add(new
                        {
                            Producto.ProductoID,
                            Producto.EmpresaId,
                            Producto.Producto,
                            Producto.Activo,
                            Producto.TasaTipoId,
                            Producto.DiasPago,
                            Producto.DiaParaCorte,
                            Producto.PrioridadCobranza,
                            Producto.RequiereDistribuidor,
                            Producto.RequiereGrupo,
                            Producto.ValidaDisponible,
                            Producto.Restructura,
                            Producto.GeneraDesembolso,
                            Producto.SeguroFinanciado,
                            Producto.Canje,
                            Producto.DesglosarIVA,
                            Producto.EdadMinima,
                            Producto.EdadMaxima,
                            Producto.CapitalAlFinal,
                            Producto.CargoFinanciado,
                            Producto.CargoAlInicio,
                            Producto.ActivaCredito,
                            Producto.CreditosLiquidadosReq,
                            Producto.PermisoEspecial,
                            Producto.ValidarCondiciones,
                            FhRegitro = Producto.FhRegitro.ToString("dd/MM/yyyy"),
                            FhMoficiacion = Producto.FhMoficiacion.ToString("dd/MM/yyyy"),
                            Producto.AplicaIVAInteres,
                            Producto.AplicaIVASeguro,
                            Producto.AplicaIVAManejoCuenta,
                            Producto.AdicProductoId,
                            Producto.CuentaMaestraId,
                            Producto.CtaCapitalId,
                            Producto.CtaInteresNormalId,
                            Producto.CtaInteresMoraId,
                            Producto.CtaIvaId,
                            Producto.CtaInteresNormDeudorId,
                            Producto.CtaInteresNormAcreedorId,
                            Producto.CtaInteresMoraDeudorId,
                            Producto.CtaInteresMoraAcreedorId,
                            Logo,
                            Empresa,
                            TasaTipo,
                            Producto.PersonaResponsableID,
                            Producto.NombreCompleto
                        });
                    }
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }
            }
        }

        [HttpPost]
        [Route("getbyhead")]
        [Authorize]
        // [Code.TProteccionProducto]
        public async Task<IActionResult> GetbyHead([FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                var res = await DBContext.database.SingleByIdAsync<Productos>(producto);
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
        [Route("getprodpresper")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetProdPresPer(PeticionesRest.Creditos.Producto.Get parData)
        {
            try
            {
                var res = await DBContext.database.QueryAsync<ProductosVW>("WHERE ProductoID IN (@AccesoProductos)", parData).Where(x => x.PrestamoPersonal == true).ToArrayAsync();
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
        [Route("getprodpresperProd")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetProdPresPerProd(PeticionesRest.Creditos.Producto.Get parData)
        {
            try
            {
                var res = await DBContext.database.QueryAsync<ProductosVW>("WHERE ProductoID IN (@AccesoProductos)", parData).Where(x => x.PrestamoPersonal == true).ToArrayAsync();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }


        [Consumes("multipart/form-data")]
        [HttpPost]
        [Route("update")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Update([FromForm] PeticionesRest.Creditos.Producto.Update parData)
        {
            try
            {
                var Producto = await DBContext.database.SingleByIdAsync<Productos>(parData.ProductoID);
                Producto.EmpresaId = parData.EmpresaId;
                Producto.Producto = parData.Producto;
                Producto.Activo = parData.Activo;
                Producto.TasaTipoId = parData.TasaTipoId;
                Producto.DiasPago = parData.DiasPago;
                Producto.DiaParaCorte = parData.DiaParaCorte;
                Producto.PrioridadCobranza = parData.PrioridadCobranza;
                Producto.RequiereDistribuidor = parData.RequiereDistribuidor;
                Producto.RequiereGrupo = parData.RequiereGrupo;
                Producto.ValidaDisponible = parData.ValidaDisponible;
                Producto.Restructura = parData.Restructura;
                Producto.GeneraDesembolso = parData.GeneraDesembolso;
                Producto.SeguroFinanciado = parData.SeguroFinanciado;
                Producto.Canje = parData.Canje;
                Producto.DesglosarIVA = parData.DesglosarIVA;
                Producto.EdadMinima = parData.EdadMinima;
                Producto.EdadMaxima = parData.EdadMaxima;
                Producto.CapitalAlFinal = parData.CapitalAlFinal;
                Producto.CargoFinanciado = parData.CargoFinanciado;
                Producto.CargoAlInicio = parData.CargoAlInicio;
                Producto.ActivaCredito = parData.ActivaCredito;
                Producto.CreditosLiquidadosReq = parData.CreditosLiquidadosReq;
                Producto.PermisoEspecial = parData.PermisoEspecial;
                Producto.ValidarCondiciones = parData.ValidarCondiciones;
                Producto.FhMoficiacion = DateTime.Now;
                Producto.AplicaIVAInteres = parData.AplicaIVAInteres;
                Producto.AplicaIVASeguro = parData.AplicaIVASeguro;
                Producto.AplicaIVAManejoCuenta = parData.AplicaIVAManejoCuenta;
                Producto.AdicProductoId = parData.AdicProductoId;
                Producto.CuentaMaestraId = parData.CuentaMaestraId;
                Producto.CtaCapitalId = parData.CtaCapitalId;
                Producto.CtaInteresNormalId = parData.CtaInteresNormalId;
                Producto.CtaInteresMoraId = parData.CtaInteresMoraId;
                Producto.CtaIvaId = parData.CtaIvaId;
                Producto.CtaInteresNormDeudorId = parData.CtaInteresNormDeudorId;
                Producto.CtaInteresNormAcreedorId = parData.CtaInteresNormAcreedorId;
                Producto.CtaInteresMoraDeudorId = parData.CtaInteresMoraDeudorId;
                Producto.CtaInteresMoraAcreedorId = parData.CtaInteresMoraAcreedorId;
                Producto.Logo = FilesManager.ConvertFiletoByteArray(parData.Logo);
                Producto.PersonaResponsableID = parData.PersonaResponsableID;
                await DBContext.database.UpdateAsync(Producto);
                var Empresa = await DBContext.database.SingleByIdAsync<Empresas>(Producto.EmpresaId);
                var TasaTipo = await DBContext.database.SingleByIdAsync<TasasTipos>(Producto.TasaTipoId);
                var Logo = Producto.Logo != null ? Convert.ToBase64String(Producto.Logo) : null;
                var NombreCompleto = await DBContext.database.SingleByIdAsync<Personas>(Producto.PersonaResponsableID);
                var res = new
                {
                    Producto.ProductoID,
                    Producto.EmpresaId,
                    Producto.Producto,
                    Producto.Activo,
                    Producto.TasaTipoId,
                    Producto.DiasPago,
                    Producto.DiaParaCorte,
                    Producto.PrioridadCobranza,
                    Producto.RequiereDistribuidor,
                    Producto.RequiereGrupo,
                    Producto.ValidaDisponible,
                    Producto.Restructura,
                    Producto.GeneraDesembolso,
                    Producto.SeguroFinanciado,
                    Producto.Canje,
                    Producto.DesglosarIVA,
                    Producto.EdadMinima,
                    Producto.EdadMaxima,
                    Producto.CapitalAlFinal,
                    Producto.CargoFinanciado,
                    Producto.CargoAlInicio,
                    Producto.ActivaCredito,
                    Producto.CreditosLiquidadosReq,
                    Producto.PermisoEspecial,
                    Producto.ValidarCondiciones,
                    FhRegitro = Producto.FhRegitro.ToString("dd/MM/yyyy"),
                    FhMoficiacion = Producto.FhMoficiacion.ToString("dd/MM/yyyy"),
                    Producto.AplicaIVAInteres,
                    Producto.AplicaIVASeguro,
                    Producto.AplicaIVAManejoCuenta,
                    Producto.AdicProductoId,
                    Producto.CuentaMaestraId,
                    Producto.CtaCapitalId,
                    Producto.CtaInteresNormalId,
                    Producto.CtaInteresMoraId,
                    Producto.CtaIvaId,
                    Producto.CtaInteresNormDeudorId,
                    Producto.CtaInteresNormAcreedorId,
                    Producto.CtaInteresMoraDeudorId,
                    Producto.CtaInteresMoraAcreedorId,
                    Empresa,
                    TasaTipo,
                    Logo,
                    Producto.PersonaResponsableID,
                    NombreCompleto.NombreCompleto
                };
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("getprodpresempl")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetProdPresEmpl([FromHeader(Name = "ProductoID")] int producto, PeticionesRest.Creditos.Producto.GetProdEmpl parData)
        {
            try
            {
                var res = await DBContext.database.QueryAsync<Productos>("WHERE (EsNomina = 1) AND (EmpresaId = @0)", parData.EmpresaId).FirstOrDefaultAsync();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }
        [HttpGet]
        [Route("obtener")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Obtener()
        {
            var transaccion = false;
            try
            {
                DBContext.database.BeginTransaction();
                transaccion = true;
                var Niveles = await DBContext.database.FetchAsync<Niveles>();
                DBContext.database.CompleteTransaction();
                await DBContext.Destroy();
                return Ok(Niveles);
            }
            catch (Exception ex)
            {
                if (transaccion) ; DBContext.database.AbortTransaction();
                return BadRequest(ex.Message);
            }
        }
        [HttpGet]
        [Route("obtenerProducto")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> obtenerProducto()
        {
            var transaccion = false;
            try
            {
                DBContext.database.BeginTransaction();
                transaccion = true;
                var producto = await DBContext.database.FetchAsync<Productos>();
                DBContext.database.CompleteTransaction();
                await DBContext.Destroy();
                return Ok(producto);
            }
            catch (Exception ex)
            {
                if (transaccion) ; DBContext.database.AbortTransaction();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("insertar")]
        [Code.TProteccionProducto]
        [Authorize]
        public async Task<IActionResult> insertar(ConfiaWebApi.PeticionesRest.Creditos.Niveles.Agregar parData)
        {
            var transaccion = false;
            try
            {
                var registro = new DBContext.DBConfia.Distribuidores.Niveles();
                {
                    registro.DistribuidorNivel = parData.DistribuidorNivel;
                    registro.PorcComisionBase = parData.PorcComisionBase;
                    registro.CapitalColocadoMinimo = parData.CapitalColocadoMinimo;
                    registro.CapitalColocadoMaximo = parData.CapitalColocadoMaximo;
                    registro.ImporteProteccionSaldo = parData.ImporteProteccionSaldo;
                    registro.importeMaxCanje = parData.importeMaxCanje;
                    registro.maximoPrestamoPersonal = parData.maximoPrestamoPersonal;
                    registro.maximoImporteCanjeCliente = parData.maximoImporteCanjeCliente;
                    registro.maximoImporteCanjeAval = parData.maximoImporteCanjeAval;

                };

                await DBContext.database.InsertAsync(registro);
                await DBContext.Destroy();
                return Ok(registro);
            }
            catch (Exception ex)
            {
                if (transaccion) ; DBContext.database.AbortTransaction();
                return BadRequest(ex.Message);
            }
        }
        [HttpPost]
        [Route("update")]
        [Code.TProteccionProducto]
        [Authorize]
        public async Task<IActionResult> update(ConfiaWebApi.PeticionesRest.Creditos.Niveles.Update parData)
        {
            var transaccion = false;
            try
            {
                var registro = await DBContext.database.SingleByIdAsync<Niveles>(parData.DistribuidorNivelID);
                if (registro != null)
                {
                    registro.DistribuidorNivel = parData.DistribuidorNivel;
                    registro.PorcComisionBase = parData.PorcComisionBase;
                    registro.CapitalColocadoMinimo = parData.CapitalColocadoMinimo;
                    registro.CapitalColocadoMaximo = parData.CapitalColocadoMaximo;
                    registro.ImporteProteccionSaldo = parData.ImporteProteccionSaldo;
                    registro.importeMaxCanje = parData.importeMaxCanje;
                    registro.maximoPrestamoPersonal = parData.maximoPrestamoPersonal;
                    registro.maximoImporteCanjeCliente = parData.maximoImporteCanjeCliente;
                    registro.maximoImporteCanjeAval = parData.maximoImporteCanjeAval;

                };

                await DBContext.database.UpdateAsync(registro);
                await DBContext.Destroy();
                return Ok(registro);
            }
            catch (Exception ex)
            {
                if (transaccion) ; DBContext.database.AbortTransaction();
                return BadRequest(ex.Message);
            }
        }
    }
}