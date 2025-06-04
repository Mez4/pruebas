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
    public class CatArchivosDispersion : ControllerBase
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
        public CatArchivosDispersion(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        // Obtenemos los agrupaciones
        [HttpGet]
        [Route("find-all")]
        [Authorize]
        public async Task<IActionResult> Obtener()
        {
            var dispersion = await DBContext.database.FetchAsync<DBContext.DBConfia.Catalogos.TipoArchivoDispersion>();
            var res = dispersion.Select(sc => new { archivoDispersionID = sc.ArchivoDispersionID, clave = sc.Clave, descripcion = sc.Descripcion }).ToArray();
            await DBContext.Destroy();
            return Ok(res);

        }

        [HttpGet]
        [Route("find/{ArchivoDispersionID}")]
        [Authorize]
        public async Task<IActionResult> ObtenerPorId(int ArchivoDispersionID)
        {
            var dispersion = await DBContext.database.FetchAsync<DBContext.DBConfia.Catalogos.TipoArchivoDispersion>();
            var res = dispersion.Where(wer => wer.ArchivoDispersionID == ArchivoDispersionID).Select(sc => new { archivoDispersionID = sc.ArchivoDispersionID, clave = sc.Clave, descripcion = sc.Descripcion }).SingleOrDefault();
            await DBContext.Destroy();
            return Ok(res);
        }


        // Agrega una caja a la base de datos
        [HttpPost]
        [Route("create")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Agregar(PeticionesRest.SOMA.TipoArchivosDispersion.Agregar parData)
        {
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();
            var Agrupaciones = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.Agrupaciones>();

            //Se genera el registro de la dispersion
            var dispersion = new DBContext.DBConfia.Catalogos.TipoArchivoDispersion()
            {
                Clave = parData.Clave,
                Descripcion = parData.Descripcion,

            };
            try
            {
                // Ingresamos la agrupacion a la bd
                await DBContext.database.InsertAsync(dispersion);
                await DBContext.Destroy();
                return Ok(dispersion);

            }
            catch (Exception e)
            {
                await DBContext.Destroy();
                return BadRequest(e.Message);
            }


        }

        //Método para actualizar una dispersion
        [HttpPut]
        [Route("update/{ArchivoDispersionID}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Actualizar(PeticionesRest.SOMA.TipoArchivosDispersion.Actualizar parData, int ArchivoDispersionID)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            // Generamos el registro de la agrupacuon
            var dispersion = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Catalogos.TipoArchivoDispersion>(ArchivoDispersionID);

            try
            {
                // Actualizamos el registro
                dispersion.Clave = parData.Clave;
                dispersion.Descripcion = parData.Descripcion;


                // Ingresamos la bobeda a la bd
                await DBContext.database.UpdateAsync(dispersion);

                // Regresamos el registro a la UI
                await DBContext.Destroy();
                return Ok(dispersion);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest("Error al actualizar la agrupación: " + ex.Message);
            }
        }

        [HttpPost]
        [Route("delete/{DispersionID}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> EliminarRegistro(int DispersionID)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            var dispersion = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Catalogos.TipoArchivoDispersion>(DispersionID);
            try
            {
                // Eliminamos el registro
                await DBContext.database.ExecuteAsync("DELETE FROM Catalogos.TipoArchivoDispersion WHERE ArchivoDispersionID=@0", DispersionID);
                await DBContext.Destroy();
                return Ok(true);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest("Error al elimnar la dispersion: " + ex.Message);
            }
        }

    }
}