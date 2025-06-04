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
    public class CatDenomEfectivoController : ControllerBase
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
        public CatDenomEfectivoController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        // Obtenemos los balances
        [HttpGet]
        [Route("find-all")]
        [Authorize]
        [Code.TProteccionProducto]

        public async Task<IActionResult> Obtener()
        {
            var denoms = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.CatalogoDenomEfectivo>();
            var result = denoms.Select(c => new { catDenomEfectivoID = c.CatDenomEfectivoID, clave = c.Clave, concepto = c.Concepto, valorMonetario = c.ValorMonetario }).ToArray();
            await DBContext.Destroy();
            return Ok(result);
        }

        [HttpGet]
        [Route("find-all-ArqueoBoveda")]
        [Authorize]
        [Code.TProteccionProducto]

        public async Task<IActionResult> ArqueoBoveda()
        {
            var denoms = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.CatalogoDenomEfectivo>();
            var result = denoms.Select(c => new { catDenomEfectivoID = c.CatDenomEfectivoID, clave = c.Clave, concepto = c.Concepto, valorMonetario = c.ValorMonetario }).ToArray();
            await DBContext.Destroy();
            return Ok(result);
        }

        [HttpGet]
        [Route("find/{CatDenomEfectivoID}")]
        [Authorize]
        public async Task<IActionResult> ObtenerPorId(int CatDenomEfectivoID)
        {
            var res = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Tesoreria.CatalogoDenomEfectivo>(CatDenomEfectivoID);
            await DBContext.Destroy();
            return Ok(res);
        }


        // Agrega una caja a la base de datos
        [HttpPost]
        [Route("create")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Agregar(PeticionesRest.SOMA.CatDenomEfectivo.Agregar parData)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            // Generamos el registro de denominacion
            var denomEfectivo = new DBContext.DBConfia.Tesoreria.CatalogoDenomEfectivo()
            {
                Clave = parData.Clave,
                Concepto = parData.Concepto,
                ValorMonetario = (decimal)parData.ValorMonetario

            };

            try
            {
                // Ingresamos la denom a la bd
                await DBContext.database.InsertAsync(denomEfectivo);
                await DBContext.Destroy();
                // Regresamos el registro a la UI
                return Ok(denomEfectivo);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest("Error al ingresar la denominación al sistema: " + ex.Message);
            }
        }

        //Método para actualizar una denominación
        [HttpPut]
        [Route("update/{CatDenomEfectivoID}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Actualizar(PeticionesRest.SOMA.CatDenomEfectivo.Actualizar parData, int CatDenomEfectivoID)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            // Generamos el registro de bobeda
            var denomEfectivo = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Tesoreria.CatalogoDenomEfectivo>(CatDenomEfectivoID);

            try
            {
                // Actualizamos el registro
                denomEfectivo.Clave = parData.Clave;
                denomEfectivo.Concepto = parData.Concepto;
                denomEfectivo.ValorMonetario = (decimal)parData.ValorMonetario;


                // Ingresamos la bobeda a la bd
                await DBContext.database.UpdateAsync(denomEfectivo);
                await DBContext.Destroy();
                // Regresamos el registro a la UI
                return Ok(denomEfectivo);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest("Error al actualizar la denominación: " + ex.Message);
            }
        }

        [HttpDelete]
        [Route("delete/{CatDenomEfectivoID}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> EliminarRegistro(int CatDenomEfectivoID)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            //var agrupacion = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Tesoreria.CatalogoDenomEfectivo>(CatDenomEfectivoID);
            try
            {
                // Eliminamos el registro
                await DBContext.database.ExecuteAsync("DELETE FROM Tesoreria.CatalogoDenomEfectivo WHERE CatDenomEfectivoID=@0", CatDenomEfectivoID);
                await DBContext.Destroy();
                return Ok(true);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest("Error al elimnar la denominación: " + ex.Message);
            }
        }

    }
}