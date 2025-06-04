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
    public class GruposUsuariosController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public GruposUsuariosController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.Creditos.GruposUsuarios.Get parData)
        {
            if (parData.UsuarioID != 0)
            {
                try
                {
                    var resS = await DBContext.database.FetchAsync<GruposUsuarios_VW>("WHERE (UsuarioID = @0)", parData.UsuarioID);
                    await DBContext.Destroy();
                    return Ok(resS);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            var res = await DBContext.database.FetchAsync<GruposUsuarios_VW>();
            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(PeticionesRest.Creditos.GruposUsuarios.Add parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var GruposUsuarios = new GruposUsuarios()
                {
                    GrupoID = parData.GrupoID,
                    UsuarioID = parData.UsuarioID,
                    Estatus = parData.Estatus,
                    UsuarioCreoID = UsuarioActual.UsuarioID,
                    FechaCreacion = DateTime.Now
                };
                await DBContext.database.InsertAsync(GruposUsuarios);
                var res = await DBContext.database.QueryAsync<GruposUsuarios_VW>("WHERE (UsuarioID = @0) AND (GrupoID = @1)", GruposUsuarios.UsuarioID, GruposUsuarios.GrupoID).FirstOrDefaultAsync();
                await DBContext.Destroy();
                return Ok(res);
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
        public async Task<IActionResult> Update(PeticionesRest.Creditos.GruposUsuarios.Update parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var GruposUsuarios = await DBContext.database.QueryAsync<GruposUsuarios>("WHERE (UsuarioID = @0) AND (GrupoID = @1)", parData.UsuarioID, parData.GrupoID).FirstOrDefaultAsync();

                GruposUsuarios.Estatus = parData.Estatus;
                GruposUsuarios.UsuarioModificoID = UsuarioActual.UsuarioID;
                GruposUsuarios.FechaModificacion = DateTime.Now;

                await DBContext.database.UpdateAsync(GruposUsuarios);
                var res = await DBContext.database.QueryAsync<GruposUsuarios_VW>("WHERE (UsuarioID = @0) AND (GrupoID = @1)", GruposUsuarios.UsuarioID, GruposUsuarios.GrupoID).FirstOrDefaultAsync();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Authorize]
        [Route("getusuarios")]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetUsuarios()
        {
            try
            {
                var resultado = await DBContext.database.FetchAsync<DBContext.DBConfia.Seguridad.UsuariosVW>();

                await this.DBContext.Destroy();
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest("Error al obtener los usuarios: " + ex.Message);
            }
        }
    }
}
