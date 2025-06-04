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
    public class PantallasController : ControllerBase
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
        public PantallasController(DBConfiaContext _ConexionBD, IConfiguration _Configuration)
        {
            this.ConexionBD = _ConexionBD;
            this.Configuracion = _Configuration;
        }



        [HttpGet]
        [Route("{id:int}")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> Obtener(int id)
        {
            try
            {
                // Obtenemos los usuarios
                var pantalla = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Sistema.Pantallas_VW>().Where(x => x.PantallaID == id).FirstOrDefault();

                // Validacion
                if (pantalla == null)
                    throw new Exception("No se pudo obtener el rol");

                // Cerramos las conexiones
                await this.ConexionBD.Destroy();

                // Regresamos los usuarios
                return Ok(pantalla);
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
                var resultado = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Sistema.Pantallas_VW>().OrderBy(x => x.ModuloNombre).ThenBy(x => x.PantallaNombre).ToArray();

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
        public async Task<IActionResult> Agregar(PeticionesRest.Sistema.RolesPermisos.Pantalla pdata)
        {
            try
            {
                var nuevoPermiso = new DBContext.DBConfia.Sistema.Pantallas()
                {
                    CreacionFecha = DateTime.Now,
                    Descripcion = pdata.Descripcion,
                    Nombre = pdata.Nombre,
                    ModuloID = pdata.ModuloID,
                    Ruta = pdata.Ruta
                };

                // Insertamos el rol en la base de datos
                await this.ConexionBD.database.InsertAsync(nuevoPermiso);

                // Obtenemos el permiso de la vista
                var permiso = await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Sistema.Permisos_VW>().Where(x => x.PermisoID == nuevoPermiso.PantallaID).FirstOrDefault();

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
        public async Task<IActionResult> Editar(int id, PeticionesRest.Sistema.RolesPermisos.Pantalla pdata)
        {
            try
            {
                // Obtenemos el rol en la base de datos
                var pantallaEditar = await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Sistema.Pantallas>().Where(x => x.PantallaID == id).FirstOrDefault();

                // Editamos el rol
                pantallaEditar.Nombre = pdata.Nombre;
                pantallaEditar.CreacionFecha = DateTime.Now;
                pantallaEditar.Descripcion = pdata.Descripcion;
                pantallaEditar.Nombre = pdata.Nombre;
                pantallaEditar.Ruta = pdata.Ruta;

                // Eliminamos las membresias del usuario
                await this.ConexionBD.database.UpdateAsync(pantallaEditar);

                // Obtenemos el permiso de la vista
                var pantalla = await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Sistema.Pantallas_VW>().Where(x => x.PantallaID == pantallaEditar.PantallaID).FirstOrDefault();

                // Destruimos la transacción
                await this.ConexionBD.Destroy();

                // Regresamos los usuarios
                return Ok(pantalla);
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

                // Obtenemos los IDs de los permisos a eliminar
                var PermisosIDs = (await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Sistema.Permisos_VW>().Where(x => x.PantallaID == id).ToArray()).Select(x => x.PermisoID).ToArray();

                // Eliminamos las membresias del usuario
                await this.ConexionBD.database.ExecuteAsync("DELETE FROM Seguridad.Roles_Permisos WHERE PermisoID IN (@0)", PermisosIDs);

                // Eliminamos el registro del rol
                await this.ConexionBD.database.ExecuteAsync("DELETE FROM Sistema.Permisos WHERE PermisoID IN (@0)", PermisosIDs);

                // Eliminamos el registro del rol
                await this.ConexionBD.database.ExecuteAsync("DELETE FROM Sistema.Pantallas WHERE PantallaID = @0", id);

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