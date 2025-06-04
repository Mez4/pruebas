using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;

namespace ConfiaWebApi.Controllers.Creditos
{
    [Authorize]
    [ApiController]
    [Route("api/Creditos/[controller]")]
    public class ClasificadorGrupoController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public ClasificadorGrupoController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.Creditos.ClasificadorGrupo.Get parData)
        {
            if (parData.Id != 0)
            {
                try
                {
                    var resS = await DBContext.database.SingleByIdAsync<ClasificadorGrupos>(parData.Id);

                    await DBContext.Destroy();

                    return Ok(resS);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();

                    return NotFound(ex.Message);
                }

            }

            var res = await DBContext.database.FetchAsync<ClasificadorGrupos>();

            await DBContext.Destroy();

            return Ok(res);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(PeticionesRest.Creditos.ClasificadorGrupo.Add parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var ClasificadorGrupo = new ClasificadorGrupos() { Descripcion = parData.Descripcion, UsuarioCreoID = UsuarioActual.UsuarioID, Fecha = DateTime.Now };
                await DBContext.database.InsertAsync(ClasificadorGrupo);
                await DBContext.Destroy();
                return Ok(ClasificadorGrupo);
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
        [Code.TProteccionProducto]
        public async Task<IActionResult> Update(PeticionesRest.Creditos.ClasificadorGrupo.Update parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var ClasificadorGrupo = await DBContext.database.SingleByIdAsync<ClasificadorGrupos>(parData.ClasificadorGrupoID);
                ClasificadorGrupo.Descripcion = parData.Descripcion;
                ClasificadorGrupo.UsuarioModID = UsuarioActual.UsuarioID;
                ClasificadorGrupo.FechaMod = DateTime.Now;
                await DBContext.database.UpdateAsync(ClasificadorGrupo);
                await DBContext.Destroy();
                return Ok(ClasificadorGrupo);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}
