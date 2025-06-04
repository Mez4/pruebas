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
    public class sp_DictamenController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public sp_DictamenController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }


        [HttpPost]
        [Route("GetDictamen")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> GetDictamen(ConfiaWebApi.PeticionesRest.MesaCredito.sp_Dictamen.GetParams parData)
        {

            try
            {
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.PeticionesRest.MesaCredito.sp_Dictamen.GetDictamen>("EXEC sp_Dictamen @SolicitudMesaCreditoID  ,@Monto ", parData).ToListAsync();
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
