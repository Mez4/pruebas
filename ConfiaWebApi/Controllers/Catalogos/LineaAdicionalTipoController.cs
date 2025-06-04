using DBContext.DBConfia;
using DBContext.DBConfia.Catalogos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.Catalogos
{
    [Authorize]
    [ApiController]
    [Route("api/Catalogos/[controller]")]
    public class LineaAdicionalTipoController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public LineaAdicionalTipoController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Catalogos.LineaAdicionalTipo.Get parData)
        {
            if (parData.Id != 0)
            {
                try
                {
                    var res = await DBContext.database.SingleByIdAsync<LineasAdicionalesTipos>(parData.Id);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            var res2 = await DBContext.database.FetchAsync<LineasAdicionalesTipos>();
            await DBContext.Destroy();
            return Ok(res2);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Catalogos.LineaAdicionalTipo.Add parData)
        {
            try
            {
                var Lineasadicionalestipos = new LineasAdicionalesTipos() { LineaAdicionalTipoDesc = parData.LineaAdicionalTipoDesc };
                await DBContext.database.InsertAsync(Lineasadicionalestipos);
                await DBContext.Destroy();
                return Ok(Lineasadicionalestipos);
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
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Catalogos.LineaAdicionalTipo.Update parData)
        {
            try
            {
                var Lineasadicionalestipos = await DBContext.database.SingleByIdAsync<LineasAdicionalesTipos>(parData.Id);
                Lineasadicionalestipos.LineaAdicionalTipoDesc = parData.LineaAdicionalTipoDesc;
                await DBContext.database.UpdateAsync(Lineasadicionalestipos);
                await DBContext.Destroy();
                return Ok(Lineasadicionalestipos);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}
