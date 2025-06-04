using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Sistema;
using DBContext.DBConfia.Seguridad;
using System.Collections;

namespace ConfiaWebApi.Controllers.Creditos
{
    [Authorize]
    [ApiController]
    [Route("api/Creditos/[controller]")]
    public class CoordinadorController : ControllerBase
    {
        private DBConfiaContext DBContext;
        public CoordinadorController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpGet]
        [Route("buscar/{textoBusqueda}")]
        [Authorize]
        public async Task<IActionResult> Buscar(string textoBusqueda)
        {
            textoBusqueda = textoBusqueda.ToUpper();
            int IdBusqueda = 0;
            int.TryParse(textoBusqueda, out IdBusqueda);
            try
            {
                ///Buscamos el coordinador dentro de la base de datos
                var res = await DBContext.database.QueryAsync<Coordinadores_VW>().Where(
                    x =>
                    x.CoordinadorID == IdBusqueda
                    || x.NombreCompleto.ToUpper().Contains(textoBusqueda)
                    || x.TelefonoDomicilio.ToUpper().Contains(textoBusqueda)
                    || x.TelefonoMovil.ToUpper().Contains(textoBusqueda)
                    || x.RFC.ToUpper().Contains(textoBusqueda)
                    || x.NombreConyuge.ToUpper().Contains(textoBusqueda)
                ).ToArray();
                // Destruimos la conexion
                await DBContext.Destroy();
                // Regresamos el listado
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpGet]
        [Route("grupos/{CoordinadorID}")]
        [Authorize]
        public async Task<IActionResult> ObtenerGrupos(int CoordinadorID)
        {
            try
            {
                ///Buscamos el coordinador dentro de la base de datos
                var res = await DBContext.database.QueryAsync<Grupos_VW>().Where(x => x.CoordinadorID == CoordinadorID).ToArray();
                // Destruimos la conexion
                await DBContext.Destroy();
                // Regresamos el listado
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.Creditos.Coordinador.Get parData)
        {
            try
            {
                var res = await DBContext.database.FetchAsync<Coordinadores_VW>();
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
        public async Task<IActionResult> GetBySucursal(PeticionesRest.Creditos.Coordinador.Get parData)
        {
            try
            {
                var res = await DBContext.database.FetchAsync<Coordinadores_VW>("WHERE  (SucursalID = @SucursalID)", parData);
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpGet]
        [Route("getCoordinador/{DistribuidorID}")]
        [Authorize]
        [Code.TProteccionAdmin]
        // [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> getCoordinador(int DistribuidorID)
        {
            try
            {
                // var dist = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Distribuidores>("WHERE  (DistribuidorID = @0)", DistribuidorID).FirstOrDefaultAsync();
                var coordi = await DBContext.database.FetchAsync<DBContext.DBConfia.Distribuidores.GpoDistribuidorCoordinador>("WHERE (DistribuidorID = @0)", DistribuidorID);
                await DBContext.Destroy();
                return Ok(coordi);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpGet]
        [Route("getCoord/{DistribuidorID}")]
        [Authorize]
        [Code.TProteccionProducto]
        // [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> getCoord(int DistribuidorID)
        {
            try
            {
                // var dist = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Distribuidores>("WHERE  (DistribuidorID = @0)", DistribuidorID).FirstOrDefaultAsync();
                var coordi = await DBContext.database.FetchAsync<DBContext.DBConfia.Distribuidores.GpoDistribuidorCoordinador>("WHERE (DistribuidorID = @0)", DistribuidorID);
                await DBContext.Destroy();
                return Ok(coordi);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        //Obtener usuarios que no sean coordinadores y sean de un producto específico
        [HttpPost]
        [Route("getUsuariosAdminCoordinadores")]
        [Authorize]
        public async Task<IActionResult> getUsuariosAdminCoordinadores()
        {
            try
            {
                var idProducto = HttpContext.Request.Headers["ProductoID"].ToString();
                var ProductoID = new { ProductoID = idProducto };
                var res = await DBContext.database.FetchAsync<dynamic>("EXEC Seguridad.pa_GetUsuariosAdminCoordinadores @ProductoID", ProductoID);
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        //Obtener coordinadores para modulo admin coordinadores
        [HttpPost]
        [Route("getAdminCoordinadores")]
        [Authorize]
        public async Task<IActionResult> getAdminCoordinadores()
        {
            try
            {
                var idProducto = HttpContext.Request.Headers["ProductoID"].ToString();
                var ProductoID = new { ProductoID = idProducto };
                var res = await DBContext.database.FetchAsync<dynamic>("EXEC Seguridad.pa_GetAdminCoordinadores @ProductoID", ProductoID);
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        //Registrar coordinador
        [HttpPost]
        [Route("AddCoordinador")]
        [Authorize]
        public async Task<IActionResult> AddCoordinador(PeticionesRest.Creditos.Coordinador.Add parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var newCoordinadorData = new
                {
                    PersonaID = parData.PersonaID,
                    Producto = parData.ProductoID,
                    SucursalID = parData.SucursalID,
                    ClasificadorGrupoID = parData.ClasificadorGrupoID,
                    UsuarioRegistraID = UsuarioActual.UsuarioID,
                    PersonaRegistraID = UsuarioActual.PersonaID
                };
                string storedProdcedure = "EXEC Creditos.pa_AddCoordinador @Producto, @SucursalID, @ClasificadorGrupoID, @PersonaID, @PersonaRegistraID, @UsuarioRegistraID";
                var res = await DBContext.database.QueryAsync<dynamic>(storedProdcedure, newCoordinadorData).ToListAsync();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        //Actualizar coordinador
        [HttpPost]
        [Route("UpdateCoordinador")]
        [Authorize]
        public async Task<IActionResult> UpdateCoordinador(PeticionesRest.Creditos.Coordinador.Update parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var coordinadorNewData = new
                {
                    CoordinadorID = parData.CoordinadorID,
                    SucursalID = parData.SucursalID,
                    ClasificadorGrupoID = parData.ClasificadorGrupoID,
                    UsuarioModificoID = UsuarioActual.UsuarioID,
                };
                string storedProdcedure = "EXEC Creditos.pa_UpdateCoordinador @CoordinadorID, @ClasificadorGrupoID, @SucursalID, @UsuarioModificoID";
                var res = await DBContext.database.QueryAsync<dynamic>(storedProdcedure, coordinadorNewData).FirstOrDefaultAsync();

                await DBContext.Destroy();
                if (res.regresa != 1)
                {
                    return BadRequest(res.msj);
                }
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