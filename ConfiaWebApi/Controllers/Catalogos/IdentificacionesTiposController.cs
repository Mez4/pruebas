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
    public class IdentificacionesTiposController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public IdentificacionesTiposController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }


        [HttpPost]
        [Route("get")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Catalogos.IdentificacionesTipos.Get parData)
        {
            if (parData.IdentificacionTipoId != 0)
            {
                var res = await DBContext.database.SingleByIdAsync<IdentificacionesTipos>(parData.IdentificacionTipoId);
                await DBContext.Destroy();
                return Ok(res);
            }
            // return Ok(DBContext.database.QueryAsync<Viviendastipos>("WHERE Id IN @0", parData).ToListAsync());
            var res2 = await DBContext.database.FetchAsync<IdentificacionesTipos>();
            await DBContext.Destroy();
            return Ok(res2);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Catalogos.IdentificacionesTipos.Add parData)
        {
            try
            {
                var IdentificacionesTipo = new IdentificacionesTipos() { identificacionDesc = parData.IdentificacionDesc, activo = parData.Activo };
                await DBContext.database.InsertAsync(IdentificacionesTipo);
                await DBContext.Destroy();
                return Ok(IdentificacionesTipo);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Catalogos.IdentificacionesTipos.Update parData)
        {
            try
            {
                var identificacionestipo = await DBContext.database.SingleByIdAsync<IdentificacionesTipos>(parData.IdentificacionTipoId);
                identificacionestipo.activo = parData.Activo;
                identificacionestipo.identificacionDesc = parData.IdentificacionDesc;
                await DBContext.database.UpdateAsync(identificacionestipo);
                await DBContext.Destroy();
                return Ok(identificacionestipo);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}
