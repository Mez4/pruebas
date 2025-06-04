using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Sistema;

namespace ConfiaWebApi.Controllers.Creditos
{
    [Authorize]
    [ApiController]
    [Route("api/Creditos/[controller]")]
    public class IncrementosDecrementosController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public IncrementosDecrementosController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Creditos.IncrementosDecrementos.Get parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                parData.UsuarioID = UsuarioActual.UsuarioID;
                parData.Upd = 0;
                parData.Observaciones = "";
                

                string query = "EXEC Creditos.pa_IncrementoDecrementoLineas @UsuarioID, @LineasString, @Tipo, @Observaciones, @Upd, @ProductoID";
                var res = await DBContext.database.FetchAsync<dynamic>(query, parData);
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
        [Route("ActualizarLineas")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ActualizarLineas(ConfiaWebApi.PeticionesRest.Creditos.IncrementosDecrementos.Get parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                parData.UsuarioID = UsuarioActual.UsuarioID;
                parData.Upd = 1;

                string query = "EXEC Creditos.pa_IncrementoDecrementoLineas @UsuarioID, @LineasString, @Tipo, @Observaciones, @Upd, @ProductoID";
                var res = await DBContext.database.QueryAsync<dynamic>(query, parData).FirstOrDefaultAsync();
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
