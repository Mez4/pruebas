using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;

using Newtonsoft.Json;
using ConfiaWebApi.PeticionesRest.Sistema.Usuarios;

using DBContext.DBConfia;
using System.Collections.Generic;
using ConfiaWebApi.PeticionesRest.Sistema.RolesPermisos;

namespace ConfiaWebApi.Controllers.Sistema
{
    [Authorize]
    [ApiController]
    [Route("api/Sistema/[controller]")]
    public class RolesController : ControllerBase
    {
        /// <summary>
        /// Conexion a base de datos
        /// </summary>
        private DBConfiaContext ConexionBD;

        /// <summary>
        /// Configuracion del servicio
        /// </summary>
        private IConfiguration Configuracion;

        /// <summary>
        /// Constructor del controlador
        /// </summary>
        /// <param name="_ConexionBD">Conexión de datos para el controlador</param>
        public RolesController(DBConfiaContext _ConexionBD, IConfiguration _Configuration)
        {
            this.ConexionBD = _ConexionBD;
            this.Configuracion = _Configuration;
        }

        #region Permisos

        [HttpPut]
        [Authorize]
        [Route("asignar_permiso/{RolID:int}")]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> AsignarPermiso(int RolID, AsignarPermiso pData)
        {
            try
            {
                // Validamos nuestro usuario actual
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                // Generamos el Insert
                var RolPermiso = new DBContext.DBConfia.Seguridad.Roles_Permisos()
                {
                    RolID = RolID,
                    PermisoID = pData.PermisoID,
                    Creacion = DateTime.Now,
                    CreacionUsuarioID = UsuarioActual.UsuarioID
                };

                // Intentamos insertar el permisoID en la tabla
                await this.ConexionBD.database.InsertAsync(RolPermiso);

                // Obtenemos el permiso completo
                var Permiso = await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Sistema.Permisos_VW>().Where(x => x.PermisoID == pData.PermisoID).FirstOrDefault();

                // Destroy
                await this.ConexionBD.Destroy();

                // Reportamos
                return Ok(Permiso);
            }
            catch (Exception ex)
            {
                await this.ConexionBD.Destroy();
                return BadRequest("Error:" + ex.Message);
            }
        }

        [HttpPost]
        [Authorize]
        [Route("asignar_permiso/{RolID:int}")]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> EliminarPermiso(int RolID, AsignarPermiso pData)
        {
            try
            {
                // Query
                var query = string.Format("DELETE FROM Seguridad.Roles_Permisos WHERE RolID={0} AND PermisoID={1}", RolID, pData.PermisoID);

                // Intentamos eliminar el permisoID de la tabla de permisos
                await this.ConexionBD.database.ExecuteAsync(query);

                await this.ConexionBD.Destroy();

                // Reportamos
                return Ok(true);
            }
            catch (Exception ex)
            {
                await this.ConexionBD.Destroy();
                return BadRequest("Error:" + ex.Message);
            }
        }

        #endregion

        [HttpGet]
        [Route("{id:int}")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> Obtener(int id)
        {
            try
            {
                // Obtenemos los usuarios
                var rol = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.Roles>().Where(x => x.RolID == id).FirstOrDefault();

                // Validacion
                if (rol == null)
                    throw new Exception("No se pudo obtener el rol");

                // Cerramos las conexiones
                await this.ConexionBD.Destroy();

                // Regresamos los usuarios
                return Ok(rol);
            }
            catch (Exception ex)
            {
                return BadRequest("Error al obtener los roles: " + ex.Message);
            }
        }

        [HttpGet]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> Obtener()
        {
            try
            {
                // Obtenemos los usuarios
                var resultado = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Seguridad.Roles>();

                // Cerramos las conexiones
                await this.ConexionBD.Destroy();

                // Regresamos los usuarios
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return BadRequest("Error al obtener los roles: " + ex.Message);
            }
        }

        [HttpPut]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> Agregar(PeticionesRest.Sistema.RolesPermisos.Rol pdata)
        {
            try
            {
                var nuevoRol = new DBContext.DBConfia.Seguridad.Roles()
                {
                    CreacionFecha = DateTime.Now,
                    Descripcion = pdata.Descripcion,
                    Icono = pdata.Icono,
                    Nombre = pdata.Nombre,
                    RequiereProducto = pdata.Tipo == 1
                };

                // Insertamos el rol en la base de datos
                await this.ConexionBD.database.InsertAsync(nuevoRol);

                // Reportamos
                await this.ConexionBD.Destroy();
                return Ok(nuevoRol);
            }
            catch (Exception ex)
            {
                return BadRequest("Error:" + ex.Message);
            }
        }

        [HttpPost]
        [Route("{id:int}")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> Editar(int id, PeticionesRest.Sistema.RolesPermisos.Rol pdata)
        {
            try
            {
                // Obtenemos el rol en la base de datos
                var rolEditar = await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.Roles>().Where(x => x.RolID == id).FirstOrDefault();

                // Editamos el rol
                rolEditar.Nombre = pdata.Nombre;
                rolEditar.Descripcion = pdata.Descripcion;
                rolEditar.Icono = pdata.Icono;
                rolEditar.RequiereProducto = pdata.Tipo != 1;

                // Eliminamos las membresias del usuario
                await this.ConexionBD.database.UpdateAsync(rolEditar);

                // Destruimos la transacción
                await this.ConexionBD.Destroy();

                // Regresamos los usuarios
                return Ok(rolEditar);
            }
            catch (Exception ex)
            {
                // Commit
                this.ConexionBD.database.AbortTransaction();

                // Mandamos un error a la UII
                return BadRequest("Error al eliminar el registro: " + ex.Message);
            }
        }

        [HttpDelete]
        [Route("{id:int}")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> Eliminar(int id)
        {
            try
            {
                // Comenzamos una trasnacción
                this.ConexionBD.database.BeginTransaction();

                // Eliminamos las membresias del usuario
                await this.ConexionBD.database.ExecuteAsync("DELETE FROM Seguridad.Usuarios_Roles WHERE RolID=" + id.ToString());

                // Eliminamos el registro del rol
                await this.ConexionBD.database.ExecuteAsync("DELETE FROM Seguridad.Roles WHERE RolID=" + id.ToString());

                // Commit
                this.ConexionBD.database.CompleteTransaction();

                // Destruimos la transacción
                await this.ConexionBD.Destroy();

                // Regresamos los usuarios
                return Ok(true);
            }
            catch (Exception ex)
            {
                // Commit
                this.ConexionBD.database.AbortTransaction();

                // Mandamos un error a la UII
                return BadRequest("Error al eliminar el registro: " + ex.Message);
            }
        }
    }
}