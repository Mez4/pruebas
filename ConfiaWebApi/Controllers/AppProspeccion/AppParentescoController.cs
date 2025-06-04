using DBContext.DBConfia;
using DBContext.DBConfia.Prospeccion;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.AppProspeccion
{
    [Authorize]
    [ApiController]
    [Route("api/AppProspeccion/[controller]")]
    public class AppParentesco : ControllerBase
    {
        private DBConfiaContext DBContext;

        public AppParentesco(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("getCatalogoParentesco")]
        [Authorize]
        public async Task<IActionResult> GetCatalogoParentesco(ConfiaWebApi.PeticionesRest.Prospeccion.Parentesco.get parData)
        {
            try
            {
                var parentesco = await DBContext.database.FetchAsync<parentesco>();
                var resp = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = parentesco
                };

                await DBContext.Destroy();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { error = "Error el catalogo " }
                });
            }
        }

    }
}
