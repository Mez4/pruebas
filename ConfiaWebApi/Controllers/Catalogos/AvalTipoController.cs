using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Catalogos;
using DBContext.DBConfia.Sistema;

namespace ConfiaWebApi.Controllers.Catalogos
{
    [Authorize]
    [ApiController]
    [Route("api/Catalogos/[controller]")]
    public class AvalTipoController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public AvalTipoController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(PeticionesRest.Catalogos.AvalTipo.Get parData)
        {
            if (parData.Id != 0)
            {
                try
                {
                    var res = (await DBContext.database.SingleByIdAsync<AvalTipos>(parData.Id));
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }

            var res1 = (await DBContext.database.FetchAsync<AvalTipos>());
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Catalogos.AvalTipo.Add parData)
        {
            try
            {
                var Avaltipo = new AvalTipos() { avalTipo = parData.avalTipo, activo = parData.activo, color = parData.color };
                await DBContext.database.InsertAsync(Avaltipo);
                await DBContext.Destroy();
                return Ok(Avaltipo);
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
        // [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Catalogos.AvalTipo.Update parData)
        {

            try
            {

                var Avaltipo = await DBContext.database.SingleByIdAsync<AvalTipos>(parData.avalTipoId);
                Avaltipo.avalTipo = parData.avalTipo;
                Avaltipo.activo = parData.activo;
                Avaltipo.color = parData.color;
                await DBContext.database.UpdateAsync(Avaltipo);
                await DBContext.Destroy();
                return Ok(Avaltipo);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

    }
}

