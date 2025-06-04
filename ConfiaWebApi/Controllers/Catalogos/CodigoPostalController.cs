using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Catalogos;
using DBContext.DBConfia.Sistema;
using System.Linq;

namespace ConfiaWebApi.Controllers.Catalogos
{
    [Authorize]
    [ApiController]
    [Route("api/Catalogos/[controller]")]
    public class CodigoPostalController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public CodigoPostalController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        // [Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(PeticionesRest.Catalogos.Municipio.Get parData)
        {
            if (parData.EstadoId != 0 && parData.MunicipioId != 0)
            {
                var res = await DBContext.database.QueryAsync<CodigosPostales_VW>("WHERE  (id_estado = @0) AND (id_municipio = @1)", parData.EstadoId, parData.MunicipioId).ToArrayAsync();
                await DBContext.Destroy();
                return Ok(res);
            }
            var res2 = await DBContext.database.FetchAsync<CodigosPostales_VW>();
            await DBContext.Destroy();
            return Ok(res2);
        }
    }
}
