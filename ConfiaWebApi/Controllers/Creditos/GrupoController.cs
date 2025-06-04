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
    public class GrupoController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public GrupoController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.Creditos.Grupos.Get parData)
        {
            //  parData.Permiso = true;
            if (parData.Permiso == true)
            {
                try
                {
                    var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                    var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                    // var dat = await DBContext.database.QueryAsync<GruposUsuarios_VW>("WHERE (UsuarioID = @0)", UsuarioActual.UsuarioID).FirstOrDefaultAsync();
                    var dat = await DBContext.database.QueryAsync<GruposUsuarios_VW>("WHERE (ProductoID = @0 OR @0 = 0) AND (SucursalID = @1 OR @1 = 0) AND (UsuarioID = @2)", parData.ProductoID, parData.SucursalID, UsuarioActual.UsuarioID).ToArrayAsync();
                    await DBContext.Destroy();
                    return Ok(dat);


                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }
            }
            if (parData.Id != 0)
            {
                try
                {
                    var resS = await DBContext.database.QueryAsync<Grupos_VW>("WHERE (GrupoID = @0)", parData.Id).FirstOrDefaultAsync();
                    await DBContext.Destroy();
                    return Ok(resS);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }

            var res = await DBContext.database.FetchAsync<Grupos_VW>("WHERE (ProductoID = @ProductoID OR @ProductoID = 0) AND (SucursalID = @SucursalID OR @SucursalID = 0) AND (CoordinadorID = @CoordinadorID OR @CoordinadorID = 0) AND (GrupoID = @GrupoID OR @GrupoID = 0)", parData);
            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("get2")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get2(PeticionesRest.Creditos.Grupos.Get2 parData)
        {
            var res = await DBContext.database.QueryAsync<Grupos_VW>("WHERE  (ProductoID = @ProductoID OR @ProductoID = 0) AND (SucursalID = @SucursalID OR " +
                    "@SucursalID = 0) AND (CoordinadorID = @CoordinadorID OR " +
                    "@CoordinadorID = 0) AND (GrupoID = @GrupoID OR " +
                    "@GrupoID = 0)", parData).ToArrayAsync();
            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
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
        [Code.TProteccionProducto]
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
