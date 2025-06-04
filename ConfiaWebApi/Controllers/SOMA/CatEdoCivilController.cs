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
    public class CatEdoCivilController : ControllerBase
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
        public CatEdoCivilController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        // Obtenemos los balances
        [HttpGet]
        [Route("find-all")]
        [Authorize]
        public async Task<IActionResult> Obtener()
        {
            var denoms = await DBContext.database.FetchAsync<DBContext.DBConfia.Catalogos.EstadosCiviles>();
            var result = denoms.Select(c => new { estadoCivilID = c.EstadoCivilID, estadoCivil = c.EstadoCivil }).ToArray();
            await DBContext.Destroy();
            return Ok(result);
        }

        [HttpGet]
        [Route("find-by-id/{EstadoCivilID}")]
        [Authorize]
        public async Task<IActionResult> ObtenerPorId(string EstadoCivilID)
        {
            var denoms = await DBContext.database.FetchAsync<DBContext.DBConfia.Catalogos.EstadosCiviles>();
            var result = denoms.Where(ws => ws.EstadoCivilID == EstadoCivilID).Select(c => new { estadoCivilID = c.EstadoCivilID, estadoCivil = c.EstadoCivil }).ToArray();
            await DBContext.Destroy();
            return Ok(result);

        }


        // Agrega una caja a la base de datos
        [HttpPost]
        [Route("create")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Agregar(PeticionesRest.SOMA.CatEdoCivil.Add parData)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            // Generamos el registro de el estado civil
            var edoCivil = new DBContext.DBConfia.Catalogos.EstadosCiviles()
            {
                EstadoCivilID = parData.EstadoCivilID,
                EstadoCivil = parData.EstadoCivil,
            };
            try
            {
                // Ingresamos el registro civil a la bd
                await DBContext.database.InsertAsync(edoCivil);
                await DBContext.Destroy();
                // Regresamos el registro a la UI
                return Ok(edoCivil);
            }
            catch (Exception ex)
            {
                return BadRequest("Error al ingresar el estado civil al sistema al sistema: " + ex.Message);
            }
        }

        //Método para actualizar una denominación
        [HttpPut]
        [Route("update/{EstadoCivilID}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Actualizar(PeticionesRest.SOMA.CatEdoCivil.Update parData, string EstadoCivilID)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            // Generamos el registro de bobeda
            var edoCivil = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Catalogos.EstadosCiviles>(EstadoCivilID);

            try
            {
                // Actualizamos el registro
                edoCivil.EstadoCivilID = parData.EstadoCivilID;
                edoCivil.EstadoCivil = parData.EstadoCivil;


                // Ingresamos la bobeda a la bd
                await DBContext.database.UpdateAsync(edoCivil);
                await DBContext.Destroy();
                // Regresamos el registro a la UI
                return Ok(edoCivil);
            }
            catch (Exception ex)
            {
                return BadRequest("Error al actualizar el estado civil: " + ex.Message);
            }
        }

        [HttpDelete]
        [Route("delete/{EstadoCivilID}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> EliminarRegistro(string EstadoCivilID)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            //var agrupacion = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Tesoreria.CatalogoDenomEfectivo>(CatDenomEfectivoID);
            try
            {
                // Eliminamos el registro
                await DBContext.database.ExecuteAsync("DELETE FROM Catalogos.EstadosCiviles WHERE EstadoCivilID=@0", EstadoCivilID);
                await DBContext.Destroy();
                return Ok(true);
            }
            catch (Exception ex)
            {
                return BadRequest("Error al elimnar la denominación: " + ex.Message);
            }
        }

    }
}