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
    public class GestorController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public GestorController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpGet]
        [Route("getAll")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetAll()
        {
            try
            {
                var res = await DBContext.database.FetchAsync<Gestores_VW>();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("getBySucursal")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetBySucursal(PeticionesRest.Gestoria.Gestor.Get parData)
        {
            try
            {
                var res = await DBContext.database.FetchAsync<Gestores_VW>("WHERE  (SucursalID = @SucursalID)", parData);
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }
    }
}
