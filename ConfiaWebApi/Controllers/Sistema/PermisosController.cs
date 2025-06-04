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

namespace ConfiaWebApi.Controllers.Sistema
{
    [Authorize]
    [ApiController]
    [Route("api/Sistema/[controller]")]
    public class PermisosController : ControllerBase
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
        public PermisosController(DBConfiaContext _ConexionBD, IConfiguration _Configuration)
        {
            this.ConexionBD = _ConexionBD;
            this.Configuracion = _Configuration;
        }

        #region Roles

        [HttpGet]
        [Route("permisos_rol/{id:int}")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> ObtenerPorRol(int id)
        {
            try
            {

                // Obtenemos los Id de los permisos del rol presentado
                var PermisosRol = (await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.Roles_Permisos>().Where(x => x.RolID == id).ToArray()).Select(x => x.PermisoID).ToArray();

                // Obtenemos los usuarios
                var Permisos = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Sistema.Permisos_VW>().Where(x => PermisosRol.Contains(x.PermisoID)).ToArray();

                // Validacion
                if (Permisos == null)
                    throw new Exception("No se pudo obtener el rol");

                // Cerramos las conexiones
                await this.ConexionBD.Destroy();

                // Regresamos los usuarios
                return Ok(Permisos);
            }
            catch (Exception ex)
            {
                return BadRequest("Error al obtener los roles: " + ex.Message);
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
                var permiso = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Sistema.Permisos_VW>().Where(x => x.PermisoID == id).FirstOrDefault();

                // Validacion
                if (permiso == null)
                    throw new Exception("No se pudo obtener el rol");

                // Cerramos las conexiones
                await this.ConexionBD.Destroy();

                // Regresamos los usuarios
                return Ok(permiso);
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
                var resultado = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Sistema.Permisos_VW>().OrderBy(x => x.ModuloNombre).ThenBy(x => x.PantallaNombre).ThenBy(x => x.PermisoNombre).ToArray();

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
        public async Task<IActionResult> Agregar(PeticionesRest.Sistema.RolesPermisos.Permiso pdata)
        {
            try
            {
                var nuevoPermiso = new DBContext.DBConfia.Sistema.Permisos()
                {
                    CreacionFecha = DateTime.Now,
                    Descripcion = pdata.Descripcion,
                    Nombre = pdata.Nombre,
                    Especial = pdata.Especial,
                    PantallaID = pdata.PantallaID,
                    RestMetodo = pdata.Metodo,
                    RestUrl = pdata.Url
                };

                // Insertamos el rol en la base de datos
                await this.ConexionBD.database.InsertAsync(nuevoPermiso);

                // Obtenemos el permiso de la vista
                var permiso = await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Sistema.Permisos_VW>().Where(x => x.PermisoID == nuevoPermiso.PermisoID).FirstOrDefault();

                // Reportamos
                await this.ConexionBD.Destroy();
                return Ok(permiso);
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
        public async Task<IActionResult> Editar(int id, PeticionesRest.Sistema.RolesPermisos.Permiso pdata)
        {
            try
            {
                // Obtenemos el rol en la base de datos
                var permisoEditar = await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Sistema.Permisos>().Where(x => x.PermisoID == id).FirstOrDefault();

                // Editamos el rol
                permisoEditar.Nombre = pdata.Nombre;
                permisoEditar.CreacionFecha = DateTime.Now;
                permisoEditar.Descripcion = pdata.Descripcion;
                permisoEditar.Nombre = pdata.Nombre;
                permisoEditar.Especial = pdata.Especial;
                permisoEditar.PantallaID = pdata.PantallaID;
                permisoEditar.RestMetodo = pdata.Metodo;
                permisoEditar.RestUrl = pdata.Url;

                // Eliminamos las membresias del usuario
                await this.ConexionBD.database.UpdateAsync(permisoEditar);

                // Obtenemos el permiso de la vista
                var permiso = await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Sistema.Permisos_VW>().Where(x => x.PermisoID == permisoEditar.PermisoID).FirstOrDefault();

                // Destruimos la transacción
                await this.ConexionBD.Destroy();

                // Regresamos los usuarios
                return Ok(permiso);
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
                await this.ConexionBD.database.ExecuteAsync("DELETE FROM Seguridad.Roles_Permisos WHERE PermisoID=" + id.ToString());

                // Eliminamos el registro del rol
                await this.ConexionBD.database.ExecuteAsync("DELETE FROM Sistema.Permisos WHERE PermisoID=" + id.ToString());

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

                await this.ConexionBD.Destroy();

                // Mandamos un error a la UII
                return BadRequest("Error al eliminar el registro: " + ex.Message);
            }
        }
    }
}