using DBContext.DBConfia;
using DBContext.DBConfia.Catalogos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;
using ConfiaWebApi.PeticionesRest.Catalogos;

namespace ConfiaWebApi.Controllers.Catalogos
{
    [Authorize]
    [ApiController]
    [Route("api/Catalogos/[controller]")]
    public class EstadosCoordinadorController : ControllerBase
    {
        private DBConfiaContext ConexionDB;

        public EstadosCoordinadorController(DBConfiaContext _ConexionDB)
        {
            ConexionDB = _ConexionDB;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Catalogos.EstadoDistribuidor.Get parData)
        {
            if (!string.IsNullOrEmpty(parData.EstadoCoordinadorId))
            {
                var res = await ConexionDB.database.SingleByIdAsync<EstadosCoordinador>(parData.EstadoCoordinadorId);
                await ConexionDB.Destroy();
                return Ok(res);
            }
            var res2 = await ConexionDB.database.FetchAsync<EstadosCoordinador>();
            await ConexionDB.Destroy();
            return Ok(res2);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Catalogos.EstadoDistribuidor.Add parData)
        {
            try
            {
                // Obtenemos el email del usuario de los claims
                var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
                var UsuarioActual = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", usuarioActualEmail).FirstOrDefaultAsync();
                // var UsuarioActual = await ConexionDB.database.QueryAsync<DBContext.DBConfia.IntegracionKeycloak.PersonasUsuarios_VW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

                // Generamos el registro
                var EstadoDistribuidor = new EstadosCoordinador()
                {
                    EstadoCoordinadorId = parData.EstadoCoordinadorId,
                    Nombre = parData.Nombre,
                    Color = parData.Color,
                    CreacionUsuarioId = UsuarioActual.UsuarioID,
                    CreacionPersonaId = (long)UsuarioActual.UsuarioID, // VALIDAR QUE SIEMPRE EXISTA, PROCESO DEBE DE GARANTIZAR
                    CreacionFecha = DateTime.Now
                };
                await ConexionDB.database.InsertAsync(EstadoDistribuidor);
                await ConexionDB.Destroy();
                return Ok(EstadoDistribuidor);
            }
            catch (Exception ex)
            {
                await ConexionDB.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("update")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Catalogos.EstadoDistribuidor.Add parData)
        {
            try
            {
                // Obtenemos el email del usuario de los claims
                var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
                var UsuarioActual = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", usuarioActualEmail).FirstOrDefaultAsync();

                // Obtenemos el registro
                var EstadoDistribuidor = await ConexionDB.database.SingleByIdAsync<EstadosCoordinador>(parData.EstadoCoordinadorId);

                // Actualizamos los datos
                EstadoDistribuidor.Nombre = parData.Nombre;
                EstadoDistribuidor.Color = parData.Color;
                EstadoDistribuidor.ModificacionUsuarioId = UsuarioActual.UsuarioID;
                EstadoDistribuidor.ModificacionPersonaId = UsuarioActual.UsuarioID;
                EstadoDistribuidor.ModificacionFecha = DateTime.Now;

                // Actualizamos el registro en la BD
                await ConexionDB.database.UpdateAsync(EstadoDistribuidor);

                // Regresamos el objeto
                await ConexionDB.Destroy();
                return Ok(EstadoDistribuidor);
            }
            catch (Exception ex)
            {
                await ConexionDB.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}