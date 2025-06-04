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
//    public class CuentaCorteDenominacionController : ControllerBase
//    {
//        private DBConfiaContext DBContext;

//        public CuentaCorteDenominacionController(DBConfiaContext _DBContext)
//        {
//            DBContext = _DBContext;
//        }

//        [HttpPost]
//        [Route("get")]
//        [Authorize]
//        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "BANCOS_USUARIO_ADMIN" })]
//        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Bancos.CuentaCorteDenominacion.Get parData)
//        {
//            if (parData.Id != 0)
//            {
//                try
//                {
//                    return Ok(await DBContext.database.SingleByIdAsync<CuentasCortesDenominaciones>(parData.Id));
//                }
//                catch (Exception ex)
//                {
//                    return NotFound(ex.Message);
//                }

//            }

//            return Ok(await DBContext.database.FetchAsync<CuentasCortesDenominaciones>());
//        }

//        [HttpPost]
//        [Route("add")]
//        [Authorize]
//        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "BANCOS_USUARIO_ADMIN" })]
//        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Bancos.CuentaCorteDenominacion.Add parData)
//        {
//            try
//            {
//                var CuentasCortesDenominacion = new CuentasCortesDenominaciones()
//                {
//                    denomicacionDesc = parData.denomicacionDesc,
//                    factor = parData.factor,
//                    activo = parData.activo
//                };
//                await DBContext.database.InsertAsync(CuentasCortesDenominacion);
//                return Ok(CuentasCortesDenominacion);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Bancos.CuentaCorteDenominacion.Update parData)
        {
            try
            {
                var CuentasCortesDenominacion = await DBContext.database.SingleByIdAsync<CuentasCortesDenominaciones>(parData.denominacionId);
                CuentasCortesDenominacion.denomicacionDesc = parData.denomicacionDesc;
                CuentasCortesDenominacion.factor = parData.factor;
                CuentasCortesDenominacion.activo = parData.activo;
                await DBContext.database.UpdateAsync(CuentasCortesDenominacion);
                return Ok(CuentasCortesDenominacion);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
*/
