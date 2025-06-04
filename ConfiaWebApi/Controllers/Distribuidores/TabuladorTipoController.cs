using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Distribuidores;
using DBContext.DBConfia.Seguridad;
using System.Collections;

namespace ConfiaWebApi.Controllers.Distribuidores
{
    [Authorize]
    [ApiController]
    [Route("api/Distribuidores/[controller]")]
    public class TabuladorTipoController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public TabuladorTipoController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        //[Code.TProteccionProducto]
        public async Task<IActionResult> Get()
        {
            var res = await DBContext.database.FetchAsync<TabuladoresTipos>();
            await DBContext.Destroy();
            return Ok(res);
        }
    }
}
