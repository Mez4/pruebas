using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using System.Linq;
using ConfiaWebApi.PeticionesRest.Creditos.Gerente;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Seguridad;

namespace ConfiaWebApi.Controllers.Creditos
{
    [Authorize]
    [ApiController]
    [Route("api/Creditos/[controller]")]
    public class GerenteController : ControllerBase
    {
        private DBConfiaContext ConexionBD;

        public GerenteController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        //Obtener Gerentes
        [HttpPost]
        [Route("getGerentes")]
        [Authorize]
        public async Task<IActionResult> GetGerentesAdm()
        {
            try
            {
                var idProducto = HttpContext.Request.Headers["ProductoID"].ToString();
                var parametros = new { ProductoID = idProducto };
                var res = await ConexionBD.database.QueryAsync<dynamic>("EXEC General.pa_GetAdminGerentes @ProductoID", parametros).ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }

        //Obtener las sucursales de un producto específico
        [HttpPost]
        [Route("getSucursalesGerentes")]
        [Authorize]
        public async Task<IActionResult> getSucursalesGerentes()
        {
            try
            {
                var idProducto = HttpContext.Request.Headers["ProductoID"].ToString();
                var res = await ConexionBD.database.FetchAsync<SucursalesProductos_VW>("WHERE  (ProductoID = @0)", idProducto);
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }

        //Obtener usuarios que no sean gerentes y sean de un producto específico
        [HttpPost]
        [Route("getUsuariosAdminGerentes")]
        [Authorize]
        public async Task<IActionResult> getUsuariosAdminGerentes()
        {
            try
            {
                var idProducto = HttpContext.Request.Headers["ProductoID"].ToString();
                var ProductoID = new { ProductoID = idProducto };
                var res = await ConexionBD.database.FetchAsync<dynamic>("EXEC Seguridad.pa_GetUsuariosAdminGerentes @ProductoID", ProductoID);
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }

        //Registrar gerente
        [HttpPost]
        [Route("AddGerente")]
        [Authorize]
        public async Task<IActionResult> AddGerente(ConfiaWebApi.PeticionesRest.Creditos.Gerente.Add gerenteInfo)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                if (UsuarioActual == null)
                {
                    return BadRequest("Usuario no encontrado.");
                }

                var registros = gerenteInfo.SucursalesIDs.Select(sucursalID => new
                {
                    SucursalID = sucursalID,
                    PersonaIDRegistro = UsuarioActual.PersonaID,
                    UsuarioIDRegistro = UsuarioActual.UsuarioID,
                    UsuarioID = gerenteInfo.UsuarioID,
                }).ToList();

                var jsonRegistros = System.Text.Json.JsonSerializer.Serialize(registros);

                var parametros = new
                {
                    JsonData = jsonRegistros
                };

                var res = await ConexionBD.database.QueryAsync<dynamic>("EXEC General.pa_AddGerente @JsonData", parametros).ToListAsync();

                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }

        //Actualizar gerente
        [HttpPost]
        [Route("UpdateGerente")]
        [Authorize]
        public async Task<IActionResult> UpdateGerente(ConfiaWebApi.PeticionesRest.Creditos.Gerente.Update gerenteInfo)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                if (UsuarioActual == null)
                {
                    return BadRequest("Usuario no encontrado.");
                }

                var registros = gerenteInfo.SucursalesIDs.Select(sucursalID => new
                {
                    SucursalID = sucursalID,
                    PersonaIDRegistro = UsuarioActual.PersonaID,
                    UsuarioIDRegistro = UsuarioActual.UsuarioID,
                    UsuarioID = gerenteInfo.UsuarioID
                }).ToList();

                var jsonRegistros = System.Text.Json.JsonSerializer.Serialize(registros);

                var parametros = new
                {
                    JsonData = jsonRegistros,
                    UsuarioID = gerenteInfo.UsuarioID,
                    ProductoID = gerenteInfo.ProductoID
                };

                var res = await ConexionBD.database.QueryAsync<dynamic>("EXEC General.pa_UpdateGerente @JsonData, @ProductoID, @UsuarioID", parametros).ToListAsync();

                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }
    }
}
