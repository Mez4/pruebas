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
    public class ModulosController : ControllerBase
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
        public ModulosController(DBConfiaContext _ConexionBD, IConfiguration _Configuration)
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
                var pantalla = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Sistema.Modulos>().Where(x => x.ModuloID == id).FirstOrDefault();

                // Validacion
                if (pantalla == null)
                    throw new Exception("No se pudo obtener el modulo");

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
                var resultado = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Sistema.Modulos>().OrderBy(x => x.Nombre).ToArray();

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
    }
}