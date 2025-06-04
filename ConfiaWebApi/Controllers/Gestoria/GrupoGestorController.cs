using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Sistema;
using DBContext.DBConfia.Gestoria;

namespace ConfiaWebApi.Controllers.Gestoria
{
    [Authorize]
    [ApiController]
    [Route("api/Gestoria/[controller]")]
    public class GrupoGestorController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public GrupoGestorController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.Creditos.Grupos.Get parData)
        {

            var res = await DBContext.database.QueryAsync<dynamic>("EXEC Gestoria.pa_GestoresUsuarios").ToArrayAsync();
            await DBContext.Destroy();
            return Ok(res);
        }
    }

}
