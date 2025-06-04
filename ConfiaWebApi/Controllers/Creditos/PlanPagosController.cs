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
using ConfiaWebApi.ModlesSP.Creditos;

namespace ConfiaWebApi.Controllers.Creditos
{
    [Authorize]
    [ApiController]
    [Route("api/Creditos/[controller]")]
    public class PlanPagosController : ControllerBase
    {
        private DBConfiaContext DBContext;
        public PlanPagosController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.Creditos.PlanPagos.Get parData)
        {
            try
            {
                var res = await DBContext.database.FetchAsync<PlanPagos>("WHERE CreditoID = @CreditoID", parData);
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
        [Route("getPlanPagos")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> PlanPago(PeticionesRest.Creditos.PlanPagos.Get parData)
        {
            try
            {
                var res = await DBContext.database.FetchAsync<PlanPagos>("WHERE CreditoID = @CreditoID", parData);
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
        [Route("getTiendita")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getTiendita(PeticionesRest.Creditos.PlanPagos.Get parData)
        {
            try
            {
                var res = await DBContext.database.FetchAsync<CreditoTiendita>("WHERE CreditoID = @CreditoID", parData);
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
        [Route("getPlanPagosProd")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> PlanPagoProd(PeticionesRest.Creditos.PlanPagos.Get parData)
        {
            try
            {
                var res = await DBContext.database.FetchAsync<PlanPagos>("WHERE CreditoID = @CreditoID", parData);
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
        [Route("getAdmin")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetAdmin(PeticionesRest.Creditos.PlanPagos.Get parData)
        {
            try
            {
                var res = await DBContext.database.FetchAsync<PlanPagos>("WHERE CreditoID = @CreditoID", parData);
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
        [Route("getAdminAdmin")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> GetAdminAdmin(PeticionesRest.Creditos.PlanPagos.Get parData)
        {
            try
            {
                var res = await DBContext.database.FetchAsync<PlanPagos>("WHERE CreditoID = @CreditoID", parData);
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
        [Route("getPlanPagosDistr")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getPlanPagosDistr(PeticionesRest.Creditos.PlanPagos.Get parData)
        {
            try
            {
                string query = @"WHERE CreditoID=@0";
                var planPagos = await DBContext.database.QueryAsync<PlanPagos>(query, parData.CreditoID).ToArrayAsync();
                var credito = await DBContext.database.FirstAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoID=@0", parData.CreditoID);
                await DBContext.Destroy();
                var res = new
                {
                    PlanPagos = planPagos,
                    Credito = credito
                };
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("updatePlanPagosCredito")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> updatePlanPagosCredito(PeticionesRest.Creditos.PlanPagos.ActualizarPlanPagos parData)
        {
            try
            {
                
                // var res = await DBContext.database.QueryAsync<PlanPagos>("exec Creditos.pa_ActualizarPlanPagosDist @CreditoID, @PlanPagoArray", parData).ToArrayAsync();
                var res = await DBContext.database.FirstAsync<DistribuirPlanPagos>("exec Creditos.pa_ActualizarPlanPagosDist @CreditoID, @PlanPagoArray", parData);
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }
    }
}