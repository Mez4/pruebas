/*
using DBContext.DBConfia;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

//namespace ConfiaWebApi.Controllers.Balances
//{
//    [Authorize]
//    [ApiController]
//    [Route("api/tesoreria/[controller]")]
//    public class BalancesCierresController : ControllerBase
//    {
//        private DBConfiaContext DBContext;

//        public BalancesCierresController(DBConfiaContext _DBContext)
//        {
//            DBContext = _DBContext;
//        }

//        [HttpPost]
//        [Route("get")]
//        [Authorize]
//        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "BALANCES_USUARIO_ADMIN" })]
//        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Balances.BalancesCierres.Get parData)
//        {
//            try
//            {
//                if (parData.balanceCierreid != 0)
//                    return Ok(await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Balances.BalancesCierres>(parData.balanceCierreid));


//                return Ok(await DBContext.database.FetchAsync<DBContext.DBConfia.Balances.BalancesCierres>());
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(ex.Message);
//            }
//        }

//        [HttpPost]
//        [Route("add")]
//        [Authorize]
//        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "BALANCES_USUARIO_ADMIN" })]
//        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Balances.BalancesCierres.Add parData)
//        {
//            try
//            {
//                var balances = new DBContext.DBConfia.Balances.BalancesCierres() { balanceId = parData.balanceId, importeTotal = parData.importeTotal, fhRegistro = parData.fhRegistro, importeAjustes = parData.importeAjustes, importeCreditos = parData.importeCreditos, importeMovsCancelaciones = parData.importeMovsCancelaciones, importeMovsBancos = parData.importeMovsBancos, improteCargosAdicionales = parData.improteCargosAdicionales };
//                await DBContext.database.InsertAsync(balances);
//                return Ok(balances);
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(ex.Message);
//            }
//        }

//        [HttpPost]
//        [Route("update")]
//        [Authorize]
//        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "BALANCES_USUARIO_ADMIN" })]
//        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Balances.Balances.Update parData)
//        {
//            try
//            {
//                var balance = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Balances.Balances>(parData.balanceId);
//                balance.balanceNombre = parData.balanceNombre;
//                balance.balanceCancelado = parData.balanceCancelado;
//                await DBContext.database.UpdateAsync(balance);
//                return Ok(balance);
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(ex.Message);
//            }
//        }


    }
}
*/
