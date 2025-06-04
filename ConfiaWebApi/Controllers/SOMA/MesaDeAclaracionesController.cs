using System.Data.Common;
using System.Net;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;

using DBContext.DBConfia;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Seguridad;
using DBContext.DBConfia.dbo;

using System.Net.Http;
using System.Collections.Generic;
using System.Text.Json;
using System.Collections;

namespace ConfiaWebApi.Controllers.Sistema
{
    [Authorize]
    [ApiController]
    [Route("api/mesadeaclaraciones/[controller]")]
    public class MesaDeAclaracionesController : ControllerBase
    {
        // TODO::

        // Validar funcion de eliminar cuenta... ??, valido, util ?
        // Segundo, se pueden eliminar las bovedas ??, se pueden actualizar hasta que nivel? (Nombre y Clave o solo nombre?)
        /// <summary>
        /// Conexion a base de datos
        /// </summary>
        private DBConfiaContext ConexionBD;

        /// <summary>
        /// Constructor del contr   olador
        /// </summary>
        /// <param name="_DBContext">Conexión de datos para el controlador</param>
        public MesaDeAclaracionesController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }
        // Obtenemos los balances

        [HttpGet]
        [Route("obtenerTiposSolicitudes")]
        [Authorize]
        [Code.TProteccionProducto]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> ObtenerTiposSolicitudes()
        {
            try
            {
                var TiposSolicitudes = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Aclaraciones.TipoSolicitud>();
                await ConexionBD.Destroy();
                return Ok(TiposSolicitudes);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("actualizarTipoSolicitud")]
        [Authorize]
        public async Task<IActionResult> ActualizarTipoSolicitud()
        {
            try
            {
                var Solicitudes = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Aclaraciones.TipoSolicitud>();
                await ConexionBD.Destroy();
                return Ok(Solicitudes);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("agregarTipoSolicitud")]
        [Authorize]
        public async Task<IActionResult> AgregarTipoSolicitud()
        {
            try
            {
                var Solicitudes = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Aclaraciones.TipoSolicitud>();
                await ConexionBD.Destroy();
                return Ok(Solicitudes);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }
    }
}