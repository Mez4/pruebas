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
    public class TipoOrientacionVialidad : ControllerBase
    {
        private DBConfiaContext DBContext;

        public TipoOrientacionVialidad(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Catalogos.TipoOrientacionVialidad.Get parData)
        {
            if (parData.id != 0)
            {
                var res = await DBContext.database.SingleByIdAsync<OrientacionVialidadTipos>(parData.id);
                await DBContext.Destroy();
                return Ok(res);
            }
            var res2 = await DBContext.database.FetchAsync<OrientacionVialidadTipos>();
            await DBContext.Destroy();
            return Ok(res2);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Catalogos.TipoOrientacionVialidad.Add parData)
        {
            try
            {
                var OrientacionVialidadTipo = new OrientacionVialidadTipos() { orientacionVialidadTipo = parData.orientacionVialidadTipo };
                await DBContext.database.InsertAsync(OrientacionVialidadTipo);
                await DBContext.Destroy();
                return Ok(OrientacionVialidadTipo);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("update")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Catalogos.TipoOrientacionVialidad.Update parData)
        {
            try
            {
                var OrientacionVialidadTipo = await DBContext.database.SingleByIdAsync<OrientacionVialidadTipos>(parData.orientacionVialidadTipoId);
                OrientacionVialidadTipo.orientacionVialidadTipo = parData.orientacionVialidadTipo;
                await DBContext.database.UpdateAsync(OrientacionVialidadTipo);
                await DBContext.Destroy();
                return Ok(OrientacionVialidadTipo);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }
    }
}
