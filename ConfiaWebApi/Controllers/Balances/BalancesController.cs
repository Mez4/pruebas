/*
using DBContext.DBConfia;
using DBContext.DBConfia.Balances;
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
//    public class BalancesController : ControllerBase
//    {
//        private DBConfiaContext DBContext;

//        public BalancesController(DBConfiaContext _DBContext)
//        {
//            DBContext = _DBContext;
//        }


//        [HttpPost]
//        [Route("get")]
//        [Authorize]
//        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "BALANCES_USUARIO_ADMIN" })]
//        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Balances.Balances.Get parData)
//        {
//            try
//            {
//                if (parData.balanceId != 0)
//                    return Ok(await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Balances.Balances>(parData.balanceId));


//                return Ok(await DBContext.database.FetchAsync<DBContext.DBConfia.Balances.Balances>());
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
//        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Balances.Balances.Add parData)
//        {
//            try
//            {
//                var balances = new DBContext.DBConfia.Balances.Balances() { balanceNombre = parData.balanceNombre, balanceCancelado = parData.balanceCancelado };
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
//        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Balances.BalancesCierres.Update parData)
//        {
//            try
//            {
//                var balance = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Balances.BalancesCierres>(parData.balanceCierreid);
//                balance.balanceId = parData.balanceId;
//                balance.importeTotal = parData.importeTotal;
//                balance.fhRegistro = parData.fhRegistro;
//                balance.importeAjustes = parData.importeAjustes;
//                balance.importeCreditos = parData.importeCreditos;
//                balance.importeMovsCancelaciones = parData.importeMovsCancelaciones;
//                balance.importeMovsBancos = parData.importeMovsBancos;
//                balance.improteCargosAdicionales = parData.improteCargosAdicionales;

                await DBContext.database.UpdateAsync(balance);
                return Ok(balance);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
*/
