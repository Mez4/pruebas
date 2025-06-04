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
    public class PagareEstatusController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public PagareEstatusController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }


        [HttpPost]
        [Route("get")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Catalogos.PagareEstatus.Get parData)
        {
            if (parData.pagareEstatusId != 0)
            {
                var res = await DBContext.database.SingleByIdAsync<PagareEstatus>(parData.pagareEstatusId);
                await DBContext.Destroy();
                return Ok(res);
            }
            // return Ok(DBContext.database.QueryAsync<Viviendastipos>("WHERE Id IN @0", parData).ToListAsync());
            var res2 = await DBContext.database.FetchAsync<PagareEstatus>();
            await DBContext.Destroy();
            return Ok(res2);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Catalogos.PagareEstatus.Add parData)
        {
            try
            {
                var pagareestatus = new PagareEstatus() { pagareEstatusDesc = parData.pagareEstatusDesc };
                await DBContext.database.InsertAsync(pagareestatus);
                await DBContext.Destroy();
                return Ok(pagareestatus);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Catalogos.PagareEstatus.Update parData)
        {
            try
            {
                var pagareestatus = await DBContext.database.SingleByIdAsync<PagareEstatus>(parData.pagareEstatusId);
                pagareestatus.pagareEstatusDesc = parData.pagareEstatusDesc;
                await DBContext.database.UpdateAsync(pagareestatus);
                await DBContext.Destroy();
                return Ok(pagareestatus);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}
