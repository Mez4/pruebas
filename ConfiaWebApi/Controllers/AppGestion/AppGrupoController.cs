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
    [Route("api/AppGestion/[controller]")]
    public class AppGrupoController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public AppGrupoController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        public async Task<IActionResult> Get(PeticionesRest.Creditos.Grupos.Get parData)
        {
            //  parData.Permiso = true;
            if (parData.Permiso == true)
            {
                try
                {
                    var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                    var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                    var data = await DBContext.database.QueryAsync<GruposUsuarios_VW>("WHERE (ProductoID = @0 OR @0 = 0) AND (SucursalID = @1 OR @1 = 0) AND (UsuarioID = @2)", parData.ProductoID, parData.SucursalID, UsuarioActual.UsuarioID).ToArrayAsync();
                    var resp = new
                    {
                        resultCode = 0,
                        resultDesc = "OK.",
                        data = data
                    };

                    await DBContext.Destroy();
                    return Ok(resp);


                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(new
                    {
                        resultCode = -1,
                        resultDesc = ex.Message,
                        data = new { error = "Error al obtener grupos" }
                    });
                }
            }
            if (parData.Id != 0)
            {
                try
                {
                    var data = await DBContext.database.QueryAsync<Grupos_VW>("WHERE (GrupoID = @0)", parData.Id).FirstOrDefaultAsync();
                    var respS = new
                    {
                        resultCode = 0,
                        resultDesc = "OK.",
                        data = data
                    };

                    await DBContext.Destroy();
                    return Ok(respS);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(new
                    {
                        resultCode = -1,
                        resultDesc = ex.Message,
                        data = new { error = "Error al obtener grupos" }
                    });
                }

            }

            var dataf = await DBContext.database.FetchAsync<Grupos_VW>("WHERE (ProductoID = @ProductoID OR @ProductoID = 0) AND (SucursalID = @SucursalID OR @SucursalID = 0) AND (CoordinadorID = @CoordinadorID OR @CoordinadorID = 0) AND (GrupoID = @GrupoID OR @GrupoID = 0)", parData);
            var respf = new
            {
                resultCode = 0,
                resultDesc = "OK.",
                data = dataf
            };

            await DBContext.Destroy();
            return Ok(respf);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        public async Task<IActionResult> Add(PeticionesRest.Creditos.Grupos.Add parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var Grupos = new Grupos()
                {
                    ProductoID = parData.ProductoID,
                    SucursalID = parData.SucursalID,
                    CoordinadorID = parData.CoordinadorID,
                    Estatus = parData.Estatus,
                    ClasificadorGrupoID = parData.ClasificadorGrupoID,
                    UsuarioCreoID = UsuarioActual.UsuarioID,
                    FechaCreacion = DateTime.Now
                };
                await DBContext.database.InsertAsync(Grupos);
                var res = await DBContext.database.QueryAsync<Grupos_VW>("WHERE (GrupoID = @0)", Grupos.GrupoID).FirstOrDefaultAsync();
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
        public async Task<IActionResult> Update(PeticionesRest.Creditos.Grupos.Update parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var Grupos = await DBContext.database.SingleByIdAsync<Grupos>(parData.GrupoID);
                Grupos.ProductoID = parData.ProductoID;
                Grupos.SucursalID = parData.SucursalID;
                Grupos.CoordinadorID = parData.CoordinadorID;
                Grupos.Estatus = parData.Estatus;
                Grupos.ClasificadorGrupoID = parData.ClasificadorGrupoID;
                Grupos.UsuarioModificoID = UsuarioActual.UsuarioID;
                Grupos.FechaModificacion = DateTime.Now;
                await DBContext.database.UpdateAsync(Grupos);
                var res = await DBContext.database.QueryAsync<Grupos_VW>("WHERE (GrupoID = @0)", Grupos.GrupoID).FirstOrDefaultAsync();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}
