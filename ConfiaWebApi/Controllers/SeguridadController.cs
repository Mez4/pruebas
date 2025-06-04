using System.Text;
using System.Security.Claims;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using DBContext.DBConfia.Seguridad;
using DBContext.DBConfia;

// Namespace
namespace ConfiaWebApi.Controllers
{
    /// <summary>
    /// Controlador para manejar las rutinas de seguridad:
    /// Login
    /// Validate
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class SeguridadController : ControllerBase
    {
        /// <summary>
        /// Conexion a base de datos
        /// </summary>
        private DBConfiaContext ConexionBD;

        /// <summary>
        /// Obtiene acceso al archivo appsettings.json, accediendo a las opciones
        /// de JWT
        /// </summary>
        private IConfiguration Configuracion;

        /// <summary>
        /// Constructor del controlador
        /// </summary>
        /// <param name="_ConexionBD">Conexión de datos para el controlador</param>
        public SeguridadController(IConfiguration _Configuration, DBConfiaContext _ConexionBD)
        {
            this.Configuracion = _Configuration;
            this.ConexionBD = _ConexionBD;
        }

        //         /// <summary>
        /// Confirmamos un usuario
        /// </summary>
        /// <param name="parData">Nombre de usuario</param>
        /// <returns>Usuario bloqueado</returns>
        [HttpPost]
        [Route("confirmar")]
        public async Task<IActionResult> Confirmar(ConfiaWebApi.PeticionesRest.Sistema.Usuarios.Confirmar parData)
        {
            try
            {
                // Obtenemos el usuario activo
                var UsuarioBD = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE Usuario=@0", parData.Usuario).SingleOrDefaultAsync();

                // Obtenemos el ID del usuario
                if (UsuarioBD is null || string.IsNullOrEmpty(UsuarioBD.ValidacionCodigo))
                    return BadRequest("No se encontro el usuario o no espera validación");


                if (UsuarioBD.Bloqueado)
                    return BadRequest("El usuario ha sido bloqueado, valide con soporte");

                // Se deja de validar Usuario.Validacion par dar soporte a recuperar usuario, tambien se limpia el codigo en inicio de sesión
                if (string.IsNullOrEmpty(UsuarioBD.ValidacionCodigo))
                    return BadRequest("El usuario ya ha sido validado o no se encuentra un codigo de validación");

                if (!BCrypt.Net.BCrypt.Verify(parData.Codigo, UsuarioBD.ValidacionCodigo))
                    return BadRequest("El codigo no es valido");


                // Validamos el codigo de confirmación
                UsuarioBD.ValidacionCodigo = null;
                UsuarioBD.Contrasena = BCrypt.Net.BCrypt.HashPassword(parData.Contrasena, 12);
                UsuarioBD.Validacion = true;
                UsuarioBD.ValidacionFecha = DateTime.Now;
                await ConexionBD.database.UpdateAsync(UsuarioBD);


                // Regresa el usuario
                var res = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE UsuarioID=@0", UsuarioBD.UsuarioID).FirstOrDefaultAsync();
                await this.ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await this.ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Inicia el proceso de reseteo de contraseña
        /// </summary>
        /// <returns>LoginGetReturn parsed to JSON [Sin</returns>
        [HttpPost]
        [Route("recuperar")]
        public async Task<IActionResult> Recuperar(ConfiaWebApi.PeticionesRest.Login.Recuperar Confirmar)
        {
            // Obtener el usuario
            var Usuario = await this.ConexionBD.database.QueryAsync<Usuarios>().Where(x => x.Usuario == Confirmar.Usuario).FirstOrDefault();
            if (Usuario is null)
                return BadRequest("Usuario no encontrado");

            if (Usuario.Bloqueado)
                return BadRequest("El usuario ha sido bloqueado, validar con callcenter");

            // Generamos un codigo de validación aleatorio
            var CodigoValidacion = Guid.NewGuid().ToString().Replace("-", "").Substring(new Random().Next(0, 25), 5);

            // Actualizar la validacion
            Usuario.ValidacionFecha = DateTime.Now;
            Usuario.Validacion = false;
            Usuario.ValidacionCodigo = BCrypt.Net.BCrypt.HashPassword(CodigoValidacion);

            // Guardar en BD
            await ConexionBD.database.UpdateAsync(Usuario);

            // Enviamos correo de validación
            await Code.MailSender.Usuarios__OlvidoPassword(Usuario.Usuario, CodigoValidacion);

            // Regresa nuestro objecto
            await this.ConexionBD.Destroy();
            return Ok("Correcto");
        }
    }
}