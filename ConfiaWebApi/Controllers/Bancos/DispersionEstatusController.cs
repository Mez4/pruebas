/*
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Bancos;
using DBContext.DBConfia.Sistema;

//namespace ConfiaWebApi.Controllers.Bancos
//{
//    [Authorize]
//    [ApiController]
//    [Route("api/Bancos/[controller]")]
//    public class DispersionEstatusController : ControllerBase
//    {
//        private DBConfiaContext DBContext;

//        public DispersionEstatusController(DBConfiaContext _DBContext)
//        {
//            DBContext = _DBContext;
//        }

//        [HttpPost]
//        [Route("get")]
//        [Authorize]
//        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "BANCOS_USUARIO_ADMIN" })]
//        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Bancos.DispersionEstatus.Get parData)
//        {
//            if (parData.DispersionEstatusID != 0)
//            {
//                try
//                {
//                    return Ok(await DBContext.database.SingleByIdAsync<DispersionesEstatus>(parData.DispersionEstatusID));
//                }
//                catch (Exception ex)
//                {
//                    return NotFound(ex.Message);
//                }

//            }

//            return Ok(await DBContext.database.FetchAsync<DispersionesEstatus>());
//        }

//        [HttpPost]
//        [Route("add")]
//        [Authorize]
//        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "BANCOS_USUARIO_ADMIN" })]
//        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Bancos.DispersionEstatus.Add parData)
//        {
//            try
//            {
//                var DispersionEstatus = new DispersionesEstatus() { DispersionDesc = parData.DispersionDesc };
//                await DBContext.database.InsertAsync(DispersionEstatus);
//                return Ok(DispersionEstatus);
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(ex.Message);
//            }
//        }

        [HttpPost]
        [Route("update")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "BANCOS_USUARIO_ADMIN" })]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Bancos.DispersionEstatus.Update parData)
        {
            try
            {
                var DispersionEstatus = await DBContext.database.SingleByIdAsync<DispersionesEstatus>(parData.DispersionEstatusID);
                DispersionEstatus.DispersionDesc = parData.DispersionDesc;
                await DBContext.database.UpdateAsync(DispersionEstatus);
                return Ok(DispersionEstatus);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
*/
