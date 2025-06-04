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
    public class sp_ReferenciasController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public sp_ReferenciasController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }


        [HttpPost]
        [Route("GetReferencias")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> GetReferencias(ConfiaWebApi.PeticionesRest.MesaCredito.sp_Referencias.GetParams parData)
        {

            try
            {
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.PeticionesRest.MesaCredito.sp_Referencias.GetReferencias>("EXEC sp_Referencias @SolicitudMesaCreditoID,@Tipo,@TipoPersonaid", parData).ToListAsync();
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
        [Route("GetReferenciasInsert")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> GetReferenciasInsert(ConfiaWebApi.PeticionesRest.MesaCredito.sp_Referencias.GetParams parData)
        {

            try
            {
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.PeticionesRest.MesaCredito.sp_Referencias.GetReferenciasInsert>("EXEC sp_Referencias @SolicitudMesaCreditoID,@Tipo,@TipoPersonaid", parData).ToListAsync();
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

