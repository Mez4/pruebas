using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Distribuidores;
using DBContext.DBConfia.General;
using System.Collections;
using System.Collections.Generic;
using DBContext.DBConfia.Seguridad;
using DBContext.DBConfia.Custom.Creditos;
using DBContext.DBConfia.AppVale;
using DBContext.DBConfia.Tesoreria;
using DBContext.DBConfia.Catalogos;
using ConfiaWebApi.PeticionesRest.Creditos.CanjeaVale;

namespace ConfiaWebApi.Controllers.Creditos
{
    [Authorize]
    [ApiController]
    [Route("api/Creditos/[controller]")]
    public class Credito_VWController : ControllerBase
    {
        private DBConfiaContext ConexionBD;

        public Credito_VWController(DBConfiaContext _ConexionBD)
        {
            ConexionBD = _ConexionBD;
        }

        [HttpGet]
        [Route("get/{CreditoID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerPorId(int CreditoID)
        {
            var Credito = await ConexionBD.database.QueryAsync<CreditosPlanPagos>("WHERE CreditoID = @0", CreditoID).FirstOrDefaultAsync();
            var PlanPagos = await ConexionBD.database.FetchAsync<PlanPagos>("WHERE CreditoID = @0", CreditoID);
            Credito.PlanPagos = PlanPagos;
            await ConexionBD.Destroy();
            return Ok(Credito);
        }

        [HttpGet]
        [Route("get")]
        [Authorize]
        [Code.KeycloakSecurityAttributes(new string[] { "CREDITOS" })]
        public async Task<IActionResult> Get(PeticionesRest.Creditos.Credito.Get parData)
        {
            return Ok();
        }


        [HttpPost]
        [Route("getbyfiltros")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetbyFiltros(PeticionesRest.Creditos.Credito.Get parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            parData.UsuarioID = UsuarioActual.UsuarioID;

            try
            {

                if (parData.top)
                {
                    parData.Credito += "%";

                    var TOP = await ConexionBD.database.QueryAsync<VariablesGlobales>("WHERE (varName = @0)", "TOP_CREDITOS").FirstOrDefaultAsync();

                    var res = await ConexionBD.database.FetchAsync<CreditosCaja_VW>("SELECT TOP (" + TOP.varValue.ToString() + ") * FROM Creditos.CreditosCaja_VW WHERE (UsuarioID = @UsuarioID) AND (CAST(CreditoID AS varchar(MAX)) LIKE @Credito) ORDER BY CreditoID", parData);

                    await ConexionBD.Destroy();

                    return Ok(res);
                }
                else
                {
                    var res = await ConexionBD.database.FetchAsync<CreditosCaja_VW>("WHERE  ((ProductoID = @ProductoID OR @ProductoID = 0) AND (ClienteID = @ClienteID OR " +
                   "@ClienteID = 0) AND (SucursalID = @SucursalID OR " +
                   "@SucursalID = 0) AND (ZonaID = @ZonaID OR " +
                   "@ZonaID = 0) AND (DistribuidorNivelID = @DistribuidorNivelID OR " +
                   "@DistribuidorNivelID = 0) AND (DistribuidorID = @DistribuidorID OR " +
                   "@DistribuidorID = 0) AND (EstatusID = @EstatusID OR " +
                   "@EstatusID = '') AND (ContratoID = @ContratoID OR " +
                   "@ContratoID = 0) AND (CoordinadorID = @CoordinadorID OR " +
                   "@CoordinadorID = 0) AND ((CAST(FechaHoraRegistro AS DATE) >= CAST(@FechaInicio AS DATE) OR CAST(@FechaInicio AS DATE) IS NULL) AND (CAST(FechaHoraRegistro AS DATE) <= CAST(@FechaFin AS DATE) OR CAST(@FechaFin AS DATE) IS NULL)) " +
                   "AND (UsuarioID = @UsuarioID) " +
                   "AND (CajaID = @CajaID OR @CajaID = 0) " +
                   "AND (CreditoID = @CreditoID OR @CreditoID = 0) " +
                   "AND (EmpresaId = @EmpresaId OR @EmpresaId = 0)" +
                    "AND TipoDesembolsoID IN (5,6,21)" +
                   "AND (PPI IS NULL OR PPI = 0))ORDER BY CreditoID DESC", parData);

                    await ConexionBD.Destroy();

                    return Ok(res);
                }
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }
        [HttpPost]
        [Route("getbyfiltrosCancelacion")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetbyFiltrosCancelacion(PeticionesRest.Creditos.Credito.Get parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            parData.UsuarioID = UsuarioActual.UsuarioID;

            try
            {

                if (parData.top)
                {
                    parData.Credito += "%";

                    var TOP = await ConexionBD.database.QueryAsync<VariablesGlobales>("WHERE (varName = @0)", "TOP_CREDITOS").FirstOrDefaultAsync();

                    var res = await ConexionBD.database.FetchAsync<CreditosCaja_VW>("SELECT TOP (" + TOP.varValue.ToString() + ") * FROM Creditos.CreditosCaja_VW WHERE (UsuarioID = @UsuarioID) AND (CAST(CreditoID AS varchar(MAX)) LIKE @Credito) ORDER BY CreditoID", parData);

                    await ConexionBD.Destroy();

                    return Ok(res);
                }
                else
                {
                    var res = await ConexionBD.database.FetchAsync<CreditosCaja_VW>("WHERE  ((ProductoID = @ProductoID OR @ProductoID = 0) AND (ClienteID = @ClienteID OR " +
                   "@ClienteID = 0) AND (SucursalID = @SucursalID OR " +
                   "@SucursalID = 0) AND (ZonaID = @ZonaID OR " +
                   "@ZonaID = 0) AND (DistribuidorNivelID = @DistribuidorNivelID OR " +
                   "@DistribuidorNivelID = 0) AND (DistribuidorID = @DistribuidorID OR " +
                   "@DistribuidorID = 0) AND (EstatusID = @EstatusID OR " +
                   "@EstatusID = '') AND (ContratoID = @ContratoID OR " +
                   "@ContratoID = 0) AND (CoordinadorID = @CoordinadorID OR " +
                   "@CoordinadorID = 0) AND ((CAST(FechaHoraRegistro AS DATE) >= CAST(@FechaInicio AS DATE) OR CAST(@FechaInicio AS DATE) IS NULL) AND (CAST(FechaHoraRegistro AS DATE) <= CAST(@FechaFin AS DATE) OR CAST(@FechaFin AS DATE) IS NULL)) " +
                   "AND (UsuarioID = @UsuarioID) " +
                   "AND (CajaID = @CajaID OR @CajaID = 0) " +
                   "AND (CreditoID = @CreditoID OR @CreditoID = 0) " +
                   "AND (EmpresaId = @EmpresaId OR @EmpresaId = 0)" +
                    "AND TipoDesembolsoID IN (5,6,21,10,25,8,7,26)" +
                   "AND (PPI IS NULL OR PPI = 0))ORDER BY CreditoID DESC", parData);

                    await ConexionBD.Destroy();

                    return Ok(res);
                }
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("getbyfiltrosSPEIaEfectivo")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getbyfiltrosSPEIaEfectivo(PeticionesRest.Creditos.Credito.Get parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            int ProductoID = 9999;
            int.TryParse(Request.Headers["ProductoID"], out ProductoID);

            parData.UsuarioID = UsuarioActual.UsuarioID;
            // parData.ProductoID = ProductoID;

            try
            {

                if (parData.top)
                {
                    parData.Credito += "%";

                    var TOP = await ConexionBD.database.QueryAsync<VariablesGlobales>("WHERE (varName = @0)", "TOP_CREDITOS").FirstOrDefaultAsync();

                    var res = await ConexionBD.database.FetchAsync<CreditosCaja_VW>("SELECT TOP (" + TOP.varValue.ToString() + ") * FROM Creditos.CreditosCaja_VW WHERE (UsuarioID = @UsuarioID) AND (CAST(CreditoID AS varchar(MAX)) LIKE @Credito) ORDER BY CreditoID", parData);

                    await ConexionBD.Destroy();

                    return Ok(res);
                }
                else
                {
                    var res = await ConexionBD.database.FetchAsync<CreditosCaja_VW>("WHERE  ((ProductoID = @ProductoID OR @ProductoID = 0) AND (ClienteID = @ClienteID OR " +
                   "@ClienteID = 0) AND (SucursalID = @SucursalID OR " +
                   "@SucursalID = 0) AND (ZonaID = @ZonaID OR " +
                   "@ZonaID = 0) AND (DistribuidorNivelID = @DistribuidorNivelID OR " +
                   "@DistribuidorNivelID = 0) AND (DistribuidorID = @DistribuidorID OR " +
                   "@DistribuidorID = 0) AND (EstatusID = @EstatusID OR " +
                   "@EstatusID = '') AND (ContratoID = @ContratoID OR " +
                   "@ContratoID = 0) AND (CoordinadorID = @CoordinadorID OR " +
                   "@CoordinadorID = 0) AND ((CAST(FechaHoraRegistro AS DATE) >= CAST(@FechaInicio AS DATE) OR CAST(@FechaInicio AS DATE) IS NULL) AND (CAST(FechaHoraRegistro AS DATE) <= CAST(@FechaFin AS DATE) OR CAST(@FechaFin AS DATE) IS NULL)) " +
                   "AND (UsuarioID = @UsuarioID) " +
                   "AND (CajaID = @CajaID OR @CajaID = 0) " +
                   "AND (CreditoID = @CreditoID OR @CreditoID = 0) " +
                   "AND (EmpresaId = @EmpresaId OR @EmpresaId = 0)" +
                    "AND TipoDesembolsoID IN (7)" +
                   "AND (PPI IS NULL OR PPI = 0))ORDER BY CreditoID DESC", parData);

                    await ConexionBD.Destroy();

                    return Ok(res);
                }
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("getbyfiltrosTiendita")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getbyfiltrosTiendita(PeticionesRest.Creditos.Credito.Get parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            parData.UsuarioID = UsuarioActual.UsuarioID;

            try
            {

                if (parData.top)
                {
                    parData.Credito += "%";

                    var TOP = await ConexionBD.database.QueryAsync<VariablesGlobales>("WHERE (varName = @0)", "TOP_CREDITOS").FirstOrDefaultAsync();
                    
                    var stored = "EXEC  Creditos.pa_CreditosTiedita @CreditoID, @ProductoID, @SucursalID, @CajaID, @DistribuidorID, @ClienteID, @EstatusID, @FechaInicial, @FechaFinal";
                    
                    var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Credito.CreditosTiendita>(stored,parData).ToArrayAsync();

                    await ConexionBD.Destroy();

                    return Ok(res);
                }
                else
                {
                
                 var stored = "EXEC  Creditos.pa_CreditosTiedita @CreditoID, @ProductoID, @SucursalID, @CajaID, @DistribuidorID, @ClienteID, @EstatusID, @FechaInicio, @FechaFin";
                    
                    var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Credito.CreditosTiendita>(stored,parData).ToArrayAsync();

                    await ConexionBD.Destroy();

                    return Ok(res);
                }
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("getbyfiltrosTesoreria")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getbyfiltrosTesoreria(PeticionesRest.Creditos.Credito.Get parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            parData.UsuarioID = UsuarioActual.UsuarioID;

            try
            {
                 var stored = "EXEC  Creditos.pa_CreditosTesoreria @CreditoID, @ClienteID";
                    
                    var res = await ConexionBD.database.QueryAsync<dynamic>(stored,parData).ToArrayAsync();

                    await ConexionBD.Destroy();

                    return Ok(res);
                
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }
        


        [HttpPost]
        [Route("getbyfiltrosPersonal")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getbyfiltrosPersonal(PeticionesRest.Creditos.Credito.FiltroPrestamoP parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());

            // parData.UsuarioID = UsuarioActual.UsuarioID;
            // parData.ProductoID = ProductoID;

            var productoPrincipal = await ConexionBD.database.QueryAsync<Productos>("WHERE ProductoID=@0", ProductoID).SingleOrDefaultAsync();
            var productoPPersonal = await ConexionBD.database.QueryAsync<Productos>("WHERE EmpresaId=@0 AND PrestamoPersonal = 1", productoPrincipal.EmpresaId).SingleOrDefaultAsync();
            // parData.ProductoID = productoPPersonal.ProductoID;
            ProductoID = productoPPersonal.ProductoID;

            try
            {
                // var res = await ConexionBD.database.FetchAsync<CreditosCaja_VW>("WHERE  (ProductoID = @ProductoID OR @ProductoID = 0) AND (ClienteID = @ClienteID OR " +
                //     "@ClienteID = 0) AND (SucursalID = @SucursalID OR " +
                //     "@SucursalID = 0) AND (ZonaID = @ZonaID OR " +
                //     "@ZonaID = 0) AND (DistribuidorNivelID = @DistribuidorNivelID OR " +
                //     "@DistribuidorNivelID = 0) AND (DistribuidorID = @DistribuidorID OR " +
                //     "@DistribuidorID = 0) AND (EstatusID = @EstatusID OR " +
                //     "@EstatusID = '') AND (ContratoID = @ContratoID OR " +
                //     "@ContratoID = 0) AND (CoordinadorID = @CoordinadorID OR " +
                //     "@CoordinadorID = 0) AND ((FechaHoraRegistro >= @FechaInicio OR @FechaInicio IS NULL) AND (FechaHoraRegistro <= @FechaFin OR @FechaFin IS NULL)) " +
                //     "AND (UsuarioID = @UsuarioID) " +
                //     "AND (CajaID = @CajaID OR @CajaID = 0) " +
                //     "AND (EmpresaId = @EmpresaId OR @EmpresaId = 0)", parData);
                // var respuesta = await ConexionBD.database.FetchAsync<CreditosCaja_VW>("WHERE (ProductoID = @0 OR @0 = 0)", ProductoID);

                //     var res = await ConexionBD.database.FetchAsync<SolicitudesPrestamos_VW>(
                //     "WHERE (ProductoID = @ProductoID OR @ProductoID = 0) " +
                //    "AND (SucursalID = @SucursalID OR @SucursalID = 0) " +
                //     "AND (DistribuidorID = @DistribuidorID OR @DistribuidorID = 0) " +
                //     "AND (FechaSolicitud BETWEEN @FechaInicio AND @FechaFin) " +
                //     "AND EstatusID IN (1 ,2)"
                //     , obj);

                // var query = @"
                // WHERE (ProductoID = @ProductoID OR @ProductoID = 0) 
                // AND (SucursalID = @SucursalID OR @SucursalID = 0)  
                // AND (DistribuidorID = @DistribuidorID OR @DistribuidorID = 0)
                // AND (FechaSolicitud BETWEEN @FechaInicio AND @FechaFin) 
                // AND EstatusID IN (1 ,2)";

                var obj = new
                {
                    ProductoID = ProductoID,
                    SucursalID = parData.SucursalID,
                    DistribuidorID = parData.DistribuidorID,
                    FechaInicio = parData.FechaInicio.ToString("dd/MM/yyyy 00:00:00"),
                    FechaFin = parData.FechaFin.ToString("dd/MM/yyyy 23:59:59"),
                    EstatusID = parData.EstatusID,
                    UsuarioID = UsuarioActual.UsuarioID
                };
                string Stored = "EXEC Distribuidores.pa_SolicitudesPPCajera @ProductoID, @SucursalID, @DistribuidorID, @FechaInicio, @FechaFin, @EstatusID, @UsuarioID";

                var res = await ConexionBD.database.QueryAsync<dynamic>(Stored, obj).ToArrayAsync();

                await ConexionBD.Destroy(); 

                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("getbyfiltrosAdmin")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetbyfiltrosAdmin(PeticionesRest.Creditos.Credito.Get parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE  Usuario=@0", UserName).FirstOrDefaultAsync();

            parData.UsuarioID = UsuarioActual.UsuarioID;

            try
            {
                var res = await ConexionBD.database.FetchAsync<CreditosPermisos_VW>("WHERE  (ProductoID = @ProductoID OR @ProductoID = 0) AND (ClienteID = @ClienteID OR " +
                    "@ClienteID = 0) AND (SucursalID = @SucursalID OR " +
                    "@SucursalID = 0) AND (ZonaID = @ZonaID OR " +
                    "@ZonaID = 0) AND (DistribuidorNivelID = @DistribuidorNivelID OR " +
                    "@DistribuidorNivelID = 0) AND (DistribuidorID = @DistribuidorID OR " +
                    "@DistribuidorID = 0) AND (EstatusID = @EstatusID OR " +
                    "@EstatusID = '') AND (ContratoID = @ContratoID OR " +
                    "@ContratoID = 0) AND (CoordinadorID = @CoordinadorID OR " +
                    "@CoordinadorID = 0) AND ((FechaHoraRegistro >= @FechaInicio OR @FechaInicio IS NULL) AND (FechaHoraRegistro <= @FechaFin OR @FechaFin IS NULL)) " +
                    "AND (UsuarioID = @UsuarioID) " +
                    "AND (EmpresaId = @EmpresaId OR @EmpresaId = 0)", parData);

                await ConexionBD.Destroy();

                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("GetCreditosSpei")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetCreditosSpei(PeticionesRest.Creditos.Credito.GetCreditosSpei parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                parData.UsuarioID = UsuarioActual.UsuarioID;

                string query = "EXEC Creditos.pa_GetCreditosParaSpei @SucursalID, @UsuarioID, @FechaInicio, @FechaFin";
                var res = await ConexionBD.database.FetchAsync<dynamic>(query, parData);

                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("GetSpeiFile")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetSpeiFile(PeticionesRest.Creditos.Credito.ImpresionSpei parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                parData.UsuarioID = UsuarioActual.UsuarioID;

                var res = await ConexionBD.database.QueryAsync<dynamic>("EXEC Creditos.pa_CrearArchivoSpei @UsuarioID,@Creditos", parData).ToArrayAsync();
                var values = res.Select(x => x.header);
                string nameFile = DateTime.Now.ToString("ddMyyyyHHmm") +"_"+ UsuarioActual.UsuarioID.ToString() + ".csv";
                string rawString = "";
                foreach (var reg in values)
                {
                    rawString += reg + "\n";
                }
                await ConexionBD.Destroy();

                return Ok(new
                {
                    CsvString = rawString,
                    NameFile = nameFile
                });
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }

    }
}
