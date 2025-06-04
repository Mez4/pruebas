/*
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;

//using DBContext.DBConfia;
//using DBContext.DBConfia.Catalogos;
//using DBContext.DBConfia.Sistema;

//namespace ConfiaWebApi.Controllers.Catalogos
//{
//    [Authorize]
//    [ApiController]
//    [Route("api/Catalogos/[controller]")]
//    public class GastosRubrosController : ControllerBase
//    {
//        private DBConfiaContext DBContext;

//        public GastosRubrosController(DBConfiaContext _DBContext)
//        {
//            DBContext = _DBContext;
//        }

//        [HttpPost]
//        [Route("get")]
//        [Authorize]
//        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
//        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Catalogos.GastoRubro.Get parData)
//        {
//            if (parData.Id != 0)
//                return Ok(await DBContext.database.SingleByIdAsync<GastosRubros>(parData.Id));
//            return Ok(await DBContext.database.FetchAsync<GastosRubros>());



//        }

//        [HttpPost]
//        [Route("add")]
//        [Authorize]
//        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
//        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Catalogos.GastoRubro.Add parData)
//        {
//            try
//            {
//                var GastoRubro = new GastosRubros() { gastosRubroDesc = parData.gastosRubroDesc, activo = parData.activo };
//                await DBContext.database.InsertAsync(GastoRubro);
//                return Ok(GastoRubro);
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(ex.Message);
//            }
//        }

//        [HttpPost]
//        [Route("update")]
//        [Authorize]
//        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
//        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Catalogos.GastoRubro.Update parData)
//        {
//            try
//            {
//                var GastoRubro = await DBContext.database.SingleByIdAsync<GastosRubros>(parData.gastosRubrosID);
//                GastoRubro.gastosRubroDesc = parData.gastosRubroDesc;
//                GastoRubro.activo = parData.activo;
//                await DBContext.database.UpdateAsync(GastoRubro);
//                return Ok(GastoRubro);
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(ex.Message);
//            }
//        }

    }
}
*/
