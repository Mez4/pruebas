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
    public class CatAgrupacion : ControllerBase
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
        public CatAgrupacion(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        // Obtenemos los agrupaciones
        [HttpGet]
        [Route("find-all")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Obtener()
        {
            var rAgrupaciones = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.Agrupaciones>();
            var res = rAgrupaciones.Select(sc => new { agrupacionID = sc.AgrupacionID, clave = sc.Clave, descripcion = sc.Descripcion, activo = sc.Activo }).ToArray();
            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpGet]
        [Route("find-by-agrupacion/{AgrupacionID}")]
        [Authorize]
        public async Task<IActionResult> ObtenerPorId(int AgrupacionID)
        {
            var rAgrupaciones = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.Agrupaciones>();
            var res = rAgrupaciones.Where(we => we.AgrupacionID == AgrupacionID).Select(sc => new { agrupacionID = sc.AgrupacionID, clave = sc.Clave, descripcion = sc.Descripcion, activo = sc.Activo }).SingleOrDefault();
            await DBContext.Destroy();
            return Ok(res);
        }


        // Agrega una caja a la base de datos
        [HttpPost]
        [Route("create")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Agregar(PeticionesRest.SOMA.Agrupaciones.Agregar parData)
        {
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            var Agrupaciones = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.Agrupaciones>();
            var MAX = Agrupaciones.Max(u => u.Clave);
            int NuevaClave = int.Parse(MAX) + 1;
            string NuevaClaveGen = NuevaClave.ToString().PadLeft(3, '0');

            //Se genera el registro de la agrupacion
            var agrupacion = new DBContext.DBConfia.Bancos.Agrupaciones()
            {
                Clave = NuevaClaveGen,
                Descripcion = parData.descripcion,
                Activo = parData.activo,

            };
            try
            {
                // Ingresamos la agrupacion a la bd
                await DBContext.database.InsertAsync(agrupacion);
                await DBContext.Destroy();
                return Ok(agrupacion);

            }
            catch (Exception e)
            {
                await DBContext.Destroy();
                return BadRequest(e.Message);
            }


        }

        //Método para actualizar una agrupacion
        [HttpPut]
        [Route("update/{AgrupacionId}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Actualizar(PeticionesRest.SOMA.Agrupaciones.Actualizar parData, int AgrupacionId)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            // Generamos el registro de la agrupacuon
            var agrupacion = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Bancos.Agrupaciones>(AgrupacionId);

            try
            {
                // Actualizamos el registro
                agrupacion.Descripcion = parData.descripcion;
                agrupacion.Activo = parData.activo;


                // Ingresamos la bobeda a la bd
                await DBContext.database.UpdateAsync(agrupacion);

                // Regresamos el registro a la UI
                return Ok(agrupacion);
            }
            catch (Exception ex)
            {
                return BadRequest("Error al actualizar la agrupación: " + ex.Message);
            }
        }

        [HttpPost]
        [Route("delete/{AgrupacionId}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> EliminarRegistro(int AgrupacionId)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            var agrupacion = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Bancos.Agrupaciones>(AgrupacionId);
            try
            {
                // Eliminamos el registro
                await DBContext.database.ExecuteAsync("DELETE FROM Bancos.Agrupaciones WHERE AgrupacionID=@0", AgrupacionId);

                return Ok(true);
            }
            catch (Exception ex)
            {
                return BadRequest("Error al elimnar la agrupacion: " + ex.Message);
            }
        }

    }
}