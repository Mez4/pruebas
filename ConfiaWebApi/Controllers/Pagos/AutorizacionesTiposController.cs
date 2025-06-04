using DBContext.DBConfia;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DBContext.DBConfia.Pagos;

namespace ConfiaWebApi.Controllers.Pagos
{
    [Authorize]
    [ApiController]
    [Route("api/Pagos/[controller]")]
    public class AutorizacionesTiposController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public AutorizacionesTiposController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.KeycloakSecurityAttributes(new string[] { "CREDITOS" })]
        public async Task<IActionResult> Get(PeticionesRest.Pagos.AutorizacionTipo.Get parData)
        {
            if (parData.Id != 0)
            {
                try
                {
                    var resS = await DBContext.database.SingleByIdAsync<AutorizacionesTipos>(parData.Id);
                    await DBContext.Destroy();
                    return Ok(resS);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            var res = await DBContext.database.FetchAsync<AutorizacionesTipos>();
            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.KeycloakSecurityAttributes(new string[] { "CREDITOS" })]
        public async Task<IActionResult> Add(PeticionesRest.Pagos.AutorizacionTipo.Add parData)
        {
            try
            {
                var AutorizacionesTipos = new AutorizacionesTipos() { AutorizacionTipo = parData.AutorizacionTipo, Parametro = parData.Parametro, Activo = parData.Activo, Parametro2 = parData.Parametro2 };
                await DBContext.database.InsertAsync(AutorizacionesTipos);
                await DBContext.Destroy();
                return Ok(AutorizacionesTipos);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("update")]
        [Authorize]
        [Code.KeycloakSecurityAttributes(new string[] { "CREDITOS" })]
        public async Task<IActionResult> Update(PeticionesRest.Pagos.AutorizacionTipo.Update parData)
        {
            try
            {
                var AutorizacionesTipos = await DBContext.database.SingleByIdAsync<AutorizacionesTipos>(parData.AutorizacionTipoID);
                AutorizacionesTipos.AutorizacionTipo = parData.AutorizacionTipo;
                AutorizacionesTipos.Parametro = parData.Parametro;
                AutorizacionesTipos.Activo = parData.Activo;
                AutorizacionesTipos.Parametro2 = parData.Parametro2;
                await DBContext.database.UpdateAsync(AutorizacionesTipos);
                await DBContext.Destroy();
                return Ok(AutorizacionesTipos);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

    }
}
