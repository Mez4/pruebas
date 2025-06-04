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
    public class TipoTraspasoController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public TipoTraspasoController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpGet]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get()
        {
            try
            {

                var res = await DBContext.database.FetchAsync<TipoTraspaso>("WHERE Activo = 1  ORDER BY TipoTraspasoID ASC");
                await DBContext.Destroy();

                return Ok(res);
            }
            catch (System.Exception e)
            {

                return BadRequest(new
                {
                    message = "Error al obtener los tipos de traspaso",
                    error = e.Message,
                    data = new { }
                });
            }
        }
    }
}
