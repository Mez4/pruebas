using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.dbo;
using DBContext.DBConfia.Seguridad;
using System.Linq;

namespace ConfiaWebApi.Controllers.General
{
    [Authorize]
    [ApiController]
    [Route("api/General/[controller]")]
    public class EmpleadoController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public EmpleadoController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("getBySucursal")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.General.Empleado.Get parData)
        {
            if (parData.Nombre != null)
            {
                try
                {
                    parData.Nombre += "%";

                    var res = await DBContext.database.FetchAsync<Empleado_VW>("SELECT TOP (100) * FROM Empleado_VW AS e WHERE (NombreCompleto LIKE @Nombre) AND (IdSucRenta = @SucursalID)", parData);

                    await DBContext.Destroy();
                    return Ok(res);

                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            else
            {
                try
                {
                    var res = await DBContext.database.FetchAsync<Empleado_VW>("WHERE (IdSucRenta = @0)", parData.SucursalID);
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

        [HttpPost]
        [Route("getById")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetById(PeticionesRest.General.Empleado.Get parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                parData.PersonaID = UsuarioActual.PersonaID;

                var res = await DBContext.database.FetchAsync<Empleado_VW>("WHERE (PersonaID = @PersonaID)", parData);
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
