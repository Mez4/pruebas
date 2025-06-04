using DBContext.DBConfia;
using DBContext.DBConfia.Catalogos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.Catalogos
{
    [Authorize]
    [ApiController]
    [Route("api/Catalogos/[controller]")]
    public class TipoVialidadController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public TipoVialidadController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Authorize]
        [Route("get")]
        // [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Catalogos.TipoVialidad.get parData)
        {
            if (parData.Id != 0)
            {
                var res = await DBContext.database.SingleByIdAsync<VialidadesTipos>(parData.Id);
                await DBContext.Destroy();
                return Ok(res);
            }
            var res2 = await DBContext.database.FetchAsync<VialidadesTipos>();
            await DBContext.Destroy();
            return Ok(res2);
        }

        [HttpPost]
        [Authorize]
        [Route("add")]
        // [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Catalogos.TipoVialidad.add parData)
        {
            try
            {
                var VialidadTipo = new VialidadesTipos() { vialidadTipo = parData.vialidadTipo };
                await DBContext.database.InsertAsync(VialidadTipo);
                await DBContext.Destroy();
                return Ok(VialidadTipo);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Authorize]
        [Route("update")]
        // [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Catalogos.TipoVialidad.update parData)
        {
            try
            {
                var VialidadTipo = await DBContext.database.SingleByIdAsync<VialidadesTipos>(parData.vialidadTipoId);
                VialidadTipo.vialidadTipo = parData.vialidadTipo;
                await DBContext.Destroy();
                await DBContext.database.UpdateAsync(VialidadTipo);
                await DBContext.Destroy();
                return Ok(VialidadTipo);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }
    }
}
