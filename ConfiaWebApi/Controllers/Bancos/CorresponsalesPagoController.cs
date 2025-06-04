/*
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Catalogos;
using DBContext.DBConfia.Sistema;
using DBContext.DBConfia.Bancos;

//namespace ConfiaWebApi.Controllers.Bancos
//{
//    [Authorize]
//    [ApiController]
//    [Route("api/bancos/[controller]")]
//    public class CorresponsalesPagoController : ControllerBase
//    {
//        private DBConfiaContext DBContext;

//        public CorresponsalesPagoController(DBConfiaContext _DBContext)
//        {
//            DBContext = _DBContext;
//        }

//        [HttpPost]
//        [Route("get")]
//        [Authorize]
//        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "BANCOS_USUARIO_ADMIN" })]
//        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Bancos.CorresponsalesPago.Get parData)
//        {
//            try
//            {
//                if (parData.CorresponsalId != 0)
//                    return Ok(await DBContext.database.SingleByIdAsync<CorresponsalesPago>(parData.CorresponsalId));


//                return Ok(await DBContext.database.FetchAsync<CorresponsalesPago>());
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(ex.Message);
//            }
//        }


//        [HttpPost]
//        [Route("add")]
//        [Authorize]
//        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
//        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Bancos.CorresponsalesPago.Add parData)
//        {
//            try
//            {
//                var CorresponsalPago = new CorresponsalesPago() { CorresponsalDesc = parData.CorresponsalDesc, comision = parData.comision, ordenEnTabla = parData.ordenEnTabla, mostrarEnTabla = parData.mostrarEnTabla, montoMaximoPago = parData.montoMaximoPago };
//                await DBContext.database.InsertAsync(CorresponsalPago);
//                return Ok(CorresponsalPago);
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
//        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Bancos.CorresponsalesPago.Update parData)
//        {
//            try
//            {
//                var CorresponsalPago = await DBContext.database.SingleByIdAsync<CorresponsalesPago>(parData.CorresponsalId);
//                CorresponsalPago.CorresponsalDesc = parData.CorresponsalDesc;
//                CorresponsalPago.comision = parData.comision;
//                CorresponsalPago.ordenEnTabla = parData.ordenEnTabla;
//                CorresponsalPago.mostrarEnTabla = parData.mostrarEnTabla;
//                CorresponsalPago.montoMaximoPago = parData.montoMaximoPago;
//                await DBContext.database.UpdateAsync(CorresponsalPago);
//                return Ok(CorresponsalPago);
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(ex.Message);
//            }
//        }


    }
}
*/
