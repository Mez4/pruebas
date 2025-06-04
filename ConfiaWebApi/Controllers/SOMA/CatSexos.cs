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
    public class CatSexosController : ControllerBase
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
        public CatSexosController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        // Obtenemos los balances
        [HttpGet]
        [Route("find-all")]
        [Authorize]
        public async Task<IActionResult> Obtener()
        {
            var denoms = await DBContext.database.FetchAsync<DBContext.DBConfia.Catalogos.Sexos>();
            var result = denoms.Select(c => new { sexoID = c.SexoID, sexo = c.Sexo }).ToArray();
            await DBContext.Destroy();
            return Ok(result);
        }

        [HttpGet]
        [Route("find-by-id/{SexoID}")]
        [Authorize]
        public async Task<IActionResult> ObtenerPorId(String SexoID)
        {
            var denoms = await DBContext.database.FetchAsync<DBContext.DBConfia.Catalogos.Sexos>();
            var result = denoms.Where(ws => String.Equals(ws.SexoID, SexoID, StringComparison.OrdinalIgnoreCase)).Select(c => new { sexoID = c.SexoID, sexo = c.Sexo }).SingleOrDefault();
            await DBContext.Destroy();
            return Ok(result);
        }


        // Agrega una caja a la base de datos
        [HttpPost]
        [Route("create")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Agregar(PeticionesRest.SOMA.CatSexos.Add parData)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            // Generamos el registro de el estado civil
            var catSexo = new DBContext.DBConfia.Catalogos.Sexos()
            {
                SexoID = parData.SexoID,
                Sexo = parData.Sexo
            };
            try
            {
                // Ingresamos la ocupación a la bd
                await DBContext.database.InsertAsync(catSexo);

                // Regresamos el registro a la UI
                await DBContext.Destroy();
                return Ok(catSexo);
            }
            catch (Exception ex)
            {
                return BadRequest("Error al ingresar el sexo al sistema: " + ex.Message);
            }
        }

        //Método para actualizar una denominación
        [HttpPut]
        [Route("update/{SexoID}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Actualizar(PeticionesRest.SOMA.CatSexos.Update parData, String SexoID)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            // Generamos el registro de bobeda
            var sexo = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Catalogos.Sexos>(SexoID);

            try
            {
                // Actualizamos el registro
                sexo.SexoID = parData.SexoID;
                sexo.Sexo = parData.Sexo;

                // Ingresamos la bobeda a la bd
                await DBContext.database.UpdateAsync(sexo);

                // Regresamos el registro a la UI
                await DBContext.Destroy();
                return Ok(sexo);
            }
            catch (Exception ex)
            {
                return BadRequest("Error al actualizar el sexo: " + ex.Message);
            }
        }

        [HttpDelete]
        [Route("delete/{SexoID}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> EliminarRegistro(string SexoID)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            //var agrupacion = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Tesoreria.CatalogoDenomEfectivo>(CatDenomEfectivoID);
            try
            {
                // Eliminamos el registro
                await DBContext.database.ExecuteAsync("DELETE FROM Catalogos.Sexos WHERE SexoID=@0", SexoID);
                await DBContext.Destroy();
                return Ok(true);
            }
            catch (Exception ex)
            {
                return BadRequest("Error al elimnar el sexo: " + ex.Message);
            }
        }

    }
}