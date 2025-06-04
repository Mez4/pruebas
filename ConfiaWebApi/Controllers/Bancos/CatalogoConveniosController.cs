using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Bancos;

namespace ConfiaWebApi.Controllers.Bancos
{
    [Authorize]
    [ApiController]
    [Route("api/Bancos/[controller]")]
    public class CatalogoConveniosController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public CatalogoConveniosController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(PeticionesRest.Bancos.Convenio.Get parData)
        {
            if (parData.ProductoID != 0)
            {
                var res = await DBContext.database.FetchAsync<CatalogoConvenios>("WHERE (ProductoID = @ProductoID)", parData);
                await DBContext.Destroy();
                return Ok(res);
            }
            var res1 = await DBContext.database.FetchAsync<CatalogoConvenios>();
            return Ok(res1);

        }
    }
}
