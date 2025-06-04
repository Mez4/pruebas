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
    public class ReferenciasTiposController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public ReferenciasTiposController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }


        [HttpPost]
        [Route("get")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Catalogos.ReferenciasTipos.Get parData)
        {
            if (parData.referenciaTipoId != 0)
            {
                var res = await DBContext.database.SingleByIdAsync<ReferenciasTipos>(parData.referenciaTipoId);
                await DBContext.Destroy();
                return Ok(res);
            }
            // return Ok(DBContext.database.QueryAsync<Viviendastipos>("WHERE Id IN @0", parData).ToListAsync());
            var res2 = await DBContext.database.FetchAsync<ReferenciasTipos>();
            await DBContext.Destroy();
            return Ok(res2);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Catalogos.ReferenciasTipos.Add parData)
        {
            try
            {
                var referenciastipos = new ReferenciasTipos() { referenciaTipo = parData.referenciaTipo, Activo = parData.Activo, esFamiliar = parData.esFamiliar, esAval = parData.esAval };
                await DBContext.database.InsertAsync(referenciastipos);
                await DBContext.Destroy();
                return Ok(referenciastipos);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Catalogos.ReferenciasTipos.Update parData)
        {
            try
            {
                var referenciastipos = await DBContext.database.SingleByIdAsync<ReferenciasTipos>(parData.referenciaTipoId);
                referenciastipos.referenciaTipo = parData.referenciaTipo;
                referenciastipos.Activo = parData.Activo;
                referenciastipos.esFamiliar = parData.esFamiliar;
                referenciastipos.esAval = parData.esAval;

                await DBContext.database.UpdateAsync(referenciastipos);
                await DBContext.Destroy();
                return Ok(referenciastipos);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}
