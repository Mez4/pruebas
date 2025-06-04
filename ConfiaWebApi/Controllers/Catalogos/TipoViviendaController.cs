using DBContext.DBConfia;
using DBContext.DBConfia.Catalogos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;
using ConfiaWebApi.PeticionesRest.Catalogos;

namespace ConfiaWebApi.Controllers.Catalogos
{
    [Authorize]
    [ApiController]
    [Route("api/Catalogos/[controller]")]
    public class TipoViviendaController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public TipoViviendaController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Catalogos.TipoVivienda.Get parData)
        {
            if (parData.Id != 0)
            {
                var res = await DBContext.database.SingleByIdAsync<ViviendasTipos>(parData.Id);
                await DBContext.Destroy();
                return Ok(res);
            }
            var res2 = await DBContext.database.FetchAsync<ViviendasTipos>();
            await DBContext.Destroy();
            return Ok(res2);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Catalogos.TipoVivienda.Add parData)
        {
            try
            {
                var ViviendaTipo = new ViviendasTipos() { ViviendaTipo = parData.ViviendaTipo, Activa = parData.Activa };
                await DBContext.database.InsertAsync(ViviendaTipo);
                await DBContext.Destroy();
                return Ok(ViviendaTipo);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Catalogos.TipoVivienda.Update parData)
        {
            try
            {
                var ViviendaTipo = await DBContext.database.SingleByIdAsync<ViviendasTipos>(parData.ViviendaTipoId);
                ViviendaTipo.Activa = parData.Activa;
                ViviendaTipo.ViviendaTipo = parData.ViviendaTipo;
                await DBContext.database.UpdateAsync(ViviendaTipo);
                await DBContext.Destroy();
                return Ok(ViviendaTipo);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}