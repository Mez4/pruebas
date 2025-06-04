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
    public class MunicipioController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public MunicipioController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(PeticionesRest.Catalogos.Municipio.Get parData)
        {
            if (parData.EstadoId != 0)
            {
                var res = await DBContext.database.QueryAsync<Municipios_VW>("WHERE (id_estado = @0) ORDER BY id_estado, id_municipio", parData.EstadoId).ToArrayAsync();
                await DBContext.Destroy();
                return Ok(res);
            }
            var res2 = await DBContext.database.FetchAsync<Municipios_VW>();
            await DBContext.Destroy();
            return Ok(res2);
        }
    }
}
