using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Sistema;
using System.Collections;
using ConfiaWebApi.Code;
using IdentityModel;

namespace ConfiaWebApi.Controllers.Creditos
{
    [Authorize]
    [ApiController]
    [Route("api/Creditos/[controller]")]
    public class ProductosController : ControllerBase
    {
        private DBConfiaContext DBContext;
        public ProductosController(DBConfiaContext _DBContext)
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
                            Producto.EsOperativo,
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
                            Producto.NombreCompleto,
                            Producto.DiasCaducidadVale,
                            Producto.DiasCaducidadFolio,
                            Producto.EmpresaNombre,
                            Producto.TipoProducto,
                            Producto.TipoProductoID,
                            Logo,
                            Empresa,
                            TasaTipo,
                            Producto.PersonaResponsableID,
                            Producto.AplicaComision,

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
        [Code.TProteccionProducto]
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

        [HttpPost]
        [Route("getbydirector")]
        [Authorize]
        //[Code.TProteccionProducto]
        public async Task<IActionResult> GetByDirector(PeticionesRest.Creditos.Producto.Get parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var res = await DBContext.database.QueryAsync<ProductosVW>("WHERE (PersonaResponsableID = @0 OR @0 = 0) AND ProductoID IN (@1) AND Principal = 1", parData.DirectorID, parData.AccesoProductos).ToArrayAsync();//.OrderBy(x => x.DistribuidorID)
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
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add([FromForm] PeticionesRest.Creditos.Producto.Add parData)
        {
            try
            {


                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                if (parData.TipoProductoID == 1)
                {
                    var Principal2 = await DBContext.database.QueryAsync<Productos>("WHERE EmpresaId=@0 AND Principal=1", parData.EmpresaId).FirstOrDefaultAsync();
                    if (Principal2 != null)
                    {
                        await DBContext.Destroy();
                        return BadRequest("Este tipo de producto ya existe en la empresa seleccionada");
                    }
                    //Principal3 = true;
                }
                if (parData.TipoProductoID == 2)
                {
                    var Principal2 = await DBContext.database.QueryAsync<Productos>("WHERE EmpresaId=@0 AND PrestamoPersonal=1", parData.EmpresaId).FirstOrDefaultAsync();
                    if (Principal2 != null)
                    {
                        await DBContext.Destroy();
                        return BadRequest("Este tipo de producto ya existe en la empresa seleccionada");
                    }
                    //PrestamoPersonal3 = true;
                }
                if (parData.TipoProductoID == 3)
                {
                    var Principal2 = await DBContext.database.QueryAsync<Productos>("WHERE EmpresaId=@0 AND Tiendita=1", parData.EmpresaId).FirstOrDefaultAsync();
                    if (Principal2 != null)
                    {
                        await DBContext.Destroy();
                        return BadRequest("Este tipo de producto ya existe en la empresa seleccionada");
                    }
                    //Tiendita3 = true;
                }
                if (parData.TipoProductoID == 4)
                {
                    var Principal2 = await DBContext.database.QueryAsync<Productos>("WHERE EmpresaId=@0 AND EsNomina=1", parData.EmpresaId).FirstOrDefaultAsync();
                    if (Principal2 != null)
                    {
                        await DBContext.Destroy();
                        return BadRequest("Este tipo de producto ya existe en la empresa seleccionada");
                    }
                    //EsNomina3 = true;
                }
                if (parData.TipoProductoID == 5)
                {
                    var Principal2 = await DBContext.database.QueryAsync<Productos>("WHERE EmpresaId=@0 AND PPI=1", parData.EmpresaId).FirstOrDefaultAsync();
                    if (Principal2 != null)
                    {
                        await DBContext.Destroy();
                        return BadRequest("Este tipo de producto ya existe en la empresa seleccionada");
                    }
                    //PPI3 = true;
                }
                if (parData.TipoProductoID == 6)
                {
                    var Principal2 = await DBContext.database.QueryAsync<Productos>("WHERE EmpresaId=@0 AND ProteccionSaldo=1", parData.EmpresaId).FirstOrDefaultAsync();
                    if (Principal2 != null)
                    {
                        await DBContext.Destroy();
                        return BadRequest("Este tipo de producto ya existe en la empresa seleccionada");
                    }
                    //ProteccionSaldos3 = true;
                }

                var Producto = new Productos()
                {
                    EmpresaId = parData.EmpresaId,
                    Producto = parData.Producto,
                    Activo = parData.Activo,
                    EsOperativo = parData.EsOperativo,
                    TasaTipoId = parData.TasaTipoId,
                    DiasPago = parData.DiasPago,
                    DiaParaCorte = parData.DiaParaCorte,
                    PrioridadCobranza = parData.PrioridadCobranza,
                    RequiereDistribuidor = parData.RequiereDistribuidor,
                    RequiereGrupo = parData.RequiereGrupo,
                    ValidaDisponible = parData.ValidaDisponible,
                    Restructura = parData.Restructura,
                    GeneraDesembolso = parData.GeneraDesembolso,
                    SeguroFinanciado = parData.SeguroFinanciado,
                    Canje = parData.Canje,
                    DesglosarIVA = parData.DesglosarIVA,
                    EdadMinima = parData.EdadMinima,
                    EdadMaxima = parData.EdadMaxima,
                    CapitalAlFinal = parData.CapitalAlFinal,
                    CargoFinanciado = parData.CargoFinanciado,
                    CargoAlInicio = parData.CargoAlInicio,
                    ActivaCredito = parData.ActivaCredito,
                    CreditosLiquidadosReq = parData.CreditosLiquidadosReq,
                    PermisoEspecial = parData.PermisoEspecial,
                    ValidarCondiciones = parData.ValidarCondiciones,
                    FhRegitro = DateTime.Now,
                    FhMoficiacion = DateTime.Now,
                    AplicaIVAInteres = parData.AplicaIVAInteres,
                    AplicaIVASeguro = parData.AplicaIVASeguro,
                    AplicaIVAManejoCuenta = parData.AplicaIVAManejoCuenta,
                    AplicaComision = parData.AplicaComision,
                    AdicProductoId = parData.AdicProductoId,
                    CuentaMaestraId = parData.CuentaMaestraId,
                    CtaCapitalId = parData.CtaCapitalId,
                    CtaInteresNormalId = parData.CtaInteresNormalId,
                    CtaInteresMoraId = parData.CtaInteresMoraId,
                    CtaIvaId = parData.CtaIvaId,
                    CtaInteresNormDeudorId = parData.CtaInteresNormDeudorId,
                    CtaInteresNormAcreedorId = parData.CtaInteresNormAcreedorId,
                    CtaInteresMoraDeudorId = parData.CtaInteresMoraDeudorId,
                    CtaInteresMoraAcreedorId = parData.CtaInteresMoraAcreedorId,
                    Logo = FilesManager.ConvertFiletoByteArray(parData.Logo),
                    PersonaResponsableID = parData.PersonaResponsableID,
                    DiasCaducidadFolio = parData.DiasCaducidadFolio,
                    DiasCaducidadVale = parData.DiasCaducidadVale,
                    Principal = parData.TipoProductoID == 1 ? true : false,
                    PrestamoPersonal = parData.TipoProductoID == 2 ? true : false,
                    Tiendita = parData.TipoProductoID == 3 ? true : false,
                    EsNomina = parData.TipoProductoID == 4 ? true : false,
                    PPI = parData.TipoProductoID == 5 ? true : false,
                    ProteccionSaldo = parData.TipoProductoID == 6 ? true : false,
                    TipoProductoID = parData.TipoProductoID,
                    UsuarioRegistro = UsuarioActual.UsuarioID
                
                };
                await DBContext.database.InsertAsync(Producto);
                var Empresa = await DBContext.database.SingleByIdAsync<Empresas>(Producto.EmpresaId);
                var TasaTipo = await DBContext.database.SingleByIdAsync<TasasTipos>(Producto.TasaTipoId);
                var ProductoTipo = await DBContext.database.SingleByIdAsync<TipoProductos>(Producto.TipoProductoID);
                var Logo = Producto.Logo != null ? Convert.ToBase64String(Producto.Logo) : null;
                var NombreCompleto = await DBContext.database.SingleByIdAsync<Personas>(Producto.PersonaResponsableID);
                var res = new
                {
                    Producto.ProductoID,
                    Producto.EmpresaId,
                    Producto.Producto,
                    Producto.Activo,
                    Producto.EsOperativo,
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
                    Producto.DiasCaducidadVale,
                    Producto.DiasCaducidadFolio,
                    Empresa,
                    TasaTipo,
                    ProductoTipo.TipoProducto,
                    Logo,
                    Producto.PersonaResponsableID,
                    NombreCompleto.NombreCompleto,
                    Producto.TipoProductoID,
                    Producto.AplicaComision,
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
                Producto.EsOperativo = parData.EsOperativo;
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
                Producto.AplicaComision = parData.AplicaComision;
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
                Producto.DiasCaducidadVale = parData.DiasCaducidadVale;
                Producto.DiasCaducidadFolio = parData.DiasCaducidadFolio;
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
                    Producto.EsOperativo,
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
                    NombreCompleto.NombreCompleto,
                    Producto.DiasCaducidadVale,
                    Producto.DiasCaducidadFolio,
                    Producto.TipoProductoID,
                    Producto.AplicaComision,
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

        [HttpPost]
        [Route("getprodpresdist")]
        /*  [Authorize]
         [Code.TProteccionProducto] */
        public async Task<IActionResult> GetProdPresDist([FromHeader(Name = "ProductoID")] int producto, PeticionesRest.Creditos.Producto.GetProdDist parData)
        {
            try
            {
                var res = await DBContext.database.QueryAsync<Productos>("WHERE (PrestamoPersonal = 1) AND (EmpresaId = @0)", parData.EmpresaId).FirstOrDefaultAsync();
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
        [Route("getprodtiendita")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetProdTiendita([FromHeader(Name = "ProductoID")] int producto, PeticionesRest.Creditos.Producto.Get parData)
        {
            try
            {
                var ProdPrinc = await DBContext.database.SingleByIdAsync<Productos>(producto);
                var res = await DBContext.database.QueryAsync<Productos>("WHERE (Tiendita = 1) AND (EmpresaId = @0)", ProdPrinc.EmpresaId).FirstOrDefaultAsync();
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
        [Route("getTiposProductos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetTiposProductos()
        {
            var res = await DBContext.database.FetchAsync<TipoProductos>();
            await DBContext.Destroy();
            return Ok(res);
        }
    }
}
