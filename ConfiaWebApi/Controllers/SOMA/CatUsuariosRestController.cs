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
    [Route("api/SOMA/[controller]")]
    public class CatUsuariosRestController : ControllerBase
    {
        // TODO::
        // Validar funcion de eliminar cuenta... ??, valido, util ?
        // Segundo, se pueden eliminar las bovedas ??, se pueden actualizar hasta que nivel? (Nombre y Clave o solo nombre?)

        /// <summary>
        /// Conexion a base de datos
        /// </summary>
        private DBConfiaContext DBContext;

        /// <summary>
        /// Constructor del controlador
        /// </summary>
        /// <param name="_DBContext">Conexión de datos para el controlador</param>
        public CatUsuariosRestController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        // Obtenemos los balances
        [HttpGet]
        [Route("show")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Obtener()
        {
            var tiposMovs = await DBContext.database.FetchAsync<DBContext.DBConfia.General.Personas_VW>();

            try
            {

                var result = tiposMovs.Select(c => new
                {
                    personaID = c.PersonaID,
                    nombre = c.Nombre,
                    apellidoPaterno = c.ApellidoPaterno,
                    apellidoMaterno = c.ApellidoMaterno,
                    usuarioID = c.CreacionUsuarioID
                }).ToArray();
                await DBContext.Destroy();
                return Ok(result);
            }

            catch (Exception error)
            {
                await DBContext.Destroy();
                return BadRequest(error.Message);
            }
        }

        [HttpPost]
        [Route("show")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerAsyncrono(PeticionesRest.Distribuidores.Cliente.Get parData)
        {
            parData.Nombre += "%";
            var tiposMovs = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Nombre LIKE @0", parData.Nombre).ToArrayAsync();

            try
            {

                var result = tiposMovs.Select(c => new
                {
                    usuarioID = c.UsuarioID,
                    nombre = c.NombreCompleto,
                    /*   apellidoPaterno = c.ApellidoPaterno,
                      apellidoMaterno = c.ApellidoMaterno,
                      usuarioID = c.CreacionUsuarioID */
                }).ToArray();
                await DBContext.Destroy();
                return Ok(result);
            }

            catch (Exception error)
            {
                await DBContext.Destroy();
                return BadRequest(error.Message);
            }
        }

        [HttpPost]
        [Route("GetGastos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetGastos(PeticionesRest.Distribuidores.Cliente.GetGastos parData)
        {

            try
            {
                var Gastos = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.SolicitudesGastosXCaja_VW>("WHERE CajaID= @0 AND EstatusSolicitudID!=6 ", parData.CajaID).ToArrayAsync();
                return Ok(Gastos);
            }


            catch (Exception error)
            {
                await DBContext.Destroy();
                return BadRequest(error.Message);
            }
        }
        [HttpPost]
        [Route("GetGastosDetalle")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetGastosDetalle(PeticionesRest.Distribuidores.Cliente.GetGastosDetalle parData)
        {

            try
            {
                var Gastos = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.SolicitudGastosDetalle_VW>("WHERE SolicitudGastoID= @0", parData.SolicitudGastoID).ToArrayAsync();
                return Ok(Gastos);
            }


            catch (Exception error)
            {
                await DBContext.Destroy();
                return BadRequest(error.Message);
            }
        }
    }
}
