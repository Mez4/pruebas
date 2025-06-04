using DBContext.DBConfia;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.MesaCredito
{
    [Authorize]
    [ApiController]
    [Route("api/MesaCredito/[controller]")]
    public class LogTiemposController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public LogTiemposController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }


        [HttpPost]
        [Route("GetLogTiempos")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> GetLogTiempos(ConfiaWebApi.PeticionesRest.MesaCredito.LogTiempos.GetParams parData)
        {

            try
            {
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.PeticionesRest.MesaCredito.LogTiempos.GetLogTiempos>("EXEC sp_LogTiempos  @AsignaAnalistaID,@Tiempo,@Motivo", parData).ToListAsync();
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
        [Route("GetTiempos")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> GetTiempos(ConfiaWebApi.PeticionesRest.MesaCredito.LogTiempos.GetTiemposParams parData)
        {
            try
            {
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.PeticionesRest.MesaCredito.LogTiempos.GetTiempos>("EXEC sp_GetLogTiempos  @SolicitudMesaCreditoID", parData).ToListAsync();
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
}

