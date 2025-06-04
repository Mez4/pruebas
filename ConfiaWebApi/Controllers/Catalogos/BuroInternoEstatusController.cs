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
    public class BuroInternoEstatusController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public BuroInternoEstatusController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }


        [HttpPost]
        [Route("get")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Catalogos.BuroInternoEstatus.Get parData)
        {
            if (parData.BuroInternoEstatusID != 0)

            {
                var res2 = await DBContext.database.SingleByIdAsync<BuroInternoEstatus>(parData.BuroInternoEstatusID);
                await DBContext.Destroy();
                return Ok(res2);
            }
            // return Ok(DBContext.database.QueryAsync<Viviendastipos>("WHERE Id IN @0", parData).ToListAsync());
            var res = (await DBContext.database.FetchAsync<BuroInternoEstatus>());
            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Catalogos.BuroInternoEstatus.Add parData)
        {
            try
            {
                var burointernoestatus = new BuroInternoEstatus() { Nombre = parData.Nombre, Color = parData.Color };
                await DBContext.database.InsertAsync(burointernoestatus);
                await DBContext.Destroy();
                return Ok(burointernoestatus);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Catalogos.BuroInternoEstatus.Update parData)
        {
            try
            {
                var burointernoestatus = await DBContext.database.SingleByIdAsync<BuroInternoEstatus>(parData.BuroInternoEstatusID);
                burointernoestatus.Nombre = parData.Nombre;
                burointernoestatus.Color = parData.Color;
                await DBContext.database.UpdateAsync(burointernoestatus);
                await DBContext.Destroy();
                return Ok(burointernoestatus);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }


    }
}
