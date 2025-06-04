/*
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Bancos;

//namespace ConfiaWebApi.Controllers.Bancos
//{
//    [Authorize]
//    [ApiController]
//    [Route("api/Bancos/[controller]")]
//    public class TipoMovimientoController : ControllerBase
//    {
//        private DBConfiaContext DBContext;

//        public TipoMovimientoController(DBConfiaContext _DBContext)
//        {
//            DBContext = _DBContext;
//        }

//        [HttpPost]
//        [Route("get")]
//        [Authorize]
//        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "BANCOS_USUARIO_ADMIN" })]
//        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Bancos.TipoMovimiento.Get parData)
//        {
//            if (parData.Id != 0)
//            {
//                try
//                {
//                    return Ok(await DBContext.database.SingleByIdAsync<TiposMovimientos>(parData.Id));
//                }
//                catch (Exception ex)
//                {
//                    return NotFound(ex.Message);
//                }

//            }

//            return Ok(await DBContext.database.FetchAsync<TiposMovimientos>());
//        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "BANCOS_USUARIO_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Bancos.TipoMovimiento.Add parData)
        {
            try
            {
                var TipoMovimiento = new TiposMovimientos()
                {
                    CveMovimientoID = parData.CveMovimientoID,
                    TipoMovimiento = parData.TipoMovimiento,
                    Cargo = parData.Cargo,
                    usuario = parData.usuario
                };
                await DBContext.database.InsertAsync(TipoMovimiento);
                return Ok(TipoMovimiento);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("update")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "BANCOS_USUARIO_ADMIN" })]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Bancos.TipoMovimiento.Update parData)
        {
            try
            {
                var TipoMovimiento = await DBContext.database.SingleByIdAsync<TiposMovimientos>(parData.Id);
                TipoMovimiento.CveMovimientoID = parData.CveMovimientoID;
                TipoMovimiento.TipoMovimiento = parData.TipoMovimiento;
                TipoMovimiento.Cargo = parData.Cargo;
                TipoMovimiento.usuario = parData.usuario;
                await DBContext.database.UpdateAsync(TipoMovimiento);
                return Ok(TipoMovimiento);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
*/