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
    public class CatOcupacionesController : ControllerBase
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
        public CatOcupacionesController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        // Obtenemos los balances
        [HttpGet]
        [Route("find-all")]
        [Authorize]
        public async Task<IActionResult> Obtener()
        {
            var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Catalogos.Ocupaciones>().ToArray();
            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpGet]
        [Route("find-by-id/{Id}")]
        [Authorize]
        public async Task<IActionResult> ObtenerPorId(int Id)
        {
            var res2 = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Catalogos.Ocupaciones>(Id);
            await DBContext.Destroy();
            return Ok(res2);
        }


        // Agrega una caja a la base de datos
        [HttpPost]
        [Route("create")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Agregar(PeticionesRest.SOMA.CatOcupaciones.Add parData)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            // Generamos el registro de el estado civil
            var catOcup = new DBContext.DBConfia.Catalogos.Ocupaciones()
            {
                Ocupacion = parData.Ocupacion
            };
            try
            {
                // Ingresamos la ocupación a la bd
                await DBContext.database.InsertAsync(catOcup);

                // Regresamos el registro a la UI
                await DBContext.Destroy();
                return Ok(catOcup);
            }
            catch (Exception ex)
            {
                return BadRequest("Error al ingresar la ocupación al sistema: " + ex.Message);
            }
        }

        //Método para actualizar una denominación
        [HttpPut]
        [Route("update/{Id}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Actualizar(PeticionesRest.SOMA.CatOcupaciones.Update parData, int Id)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            // Generamos el registro de bobeda
            var catOcups = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Catalogos.Ocupaciones>(Id);

            try
            {
                // Actualizamos el registro
                catOcups.Ocupacion = parData.Ocupacion;


                // Ingresamos la bobeda a la bd
                await DBContext.database.UpdateAsync(catOcups);

                // Regresamos el registro a la UI
                await DBContext.Destroy();
                return Ok(catOcups);
            }
            catch (Exception ex)
            {
                return BadRequest("Error al actualizar el tipo de ocupacióh: " + ex.Message);
            }
        }

        [HttpDelete]
        [Route("delete/{Id}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> EliminarRegistro(int Id)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            //var agrupacion = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Tesoreria.CatalogoDenomEfectivo>(CatDenomEfectivoID);
            try
            {
                // Eliminamos el registro
                await DBContext.database.ExecuteAsync("DELETE FROM Catalogos.Ocupaciones WHERE Id=@0", Id);
                await DBContext.Destroy();
                return Ok(true);
            }
            catch (Exception ex)
            {
                return BadRequest("Error al elimnar la ocupación: " + ex.Message);
            }
        }

    }
}