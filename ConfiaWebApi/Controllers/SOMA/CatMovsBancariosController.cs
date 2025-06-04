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
    public class CatMovsBancariosController : ControllerBase
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
        public CatMovsBancariosController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        // Obtenemos los balances
        [HttpGet]
        [Route("find-all")]
        [Authorize]
        public async Task<IActionResult> Obtener()
        {

            //SOMA RETORNA MOVIMENTO VALIDAR ORTOGRAFIA
            var denoms = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.CatalogoTipoMovimiento>();
            var result = denoms.Select(c => new { movimientoID = c.CatTipoMovID, clave = c.Clave, descripcion = c.Descripcion }).ToArray();
            await DBContext.Destroy();
            return Ok(result);
        }

        [HttpGet]
        [Route("find-by-id/{CatTipoMovID}")]
        [Authorize]
        public async Task<IActionResult> ObtenerPorId(int CatTipoMovID)
        {
            var denoms = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.CatalogoTipoMovimiento>();
            var result = denoms.Where(ws => ws.CatTipoMovID == CatTipoMovID).Select(c => new { movimientoID = c.CatTipoMovID, clave = c.Clave, descripcion = c.Descripcion }).ToArray();
            await DBContext.Destroy();
            return Ok(result);
        }


        // Agrega una caja a la base de datos
        [HttpPost]
        [Route("create")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Agregar(PeticionesRest.SOMA.CatMovsBancarios.Add parData)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            // Generamos el registro de el estado civil
            var catMov = new DBContext.DBConfia.Tesoreria.CatalogoTipoMovimiento()
            {
                Clave = parData.Clave,
                Descripcion = parData.Descripcion,
            };
            try
            {
                // Ingresamos el registro civil a la bd
                await DBContext.database.InsertAsync(catMov);

                // Regresamos el registro a la UI
                await DBContext.Destroy();
                return Ok(catMov);
            }
            catch (Exception ex)
            {
                return BadRequest("Error al ingresar el tipo de movimiento al sistema: " + ex.Message);
            }
        }

        //Método para actualizar una denominación
        [HttpPut]
        [Route("update/{CatTipoMovID}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Actualizar(PeticionesRest.SOMA.CatMovsBancarios.Update parData, int CatTipoMovID)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            // Generamos el registro de bobeda
            var catMovs = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Tesoreria.CatalogoTipoMovimiento>(CatTipoMovID);

            try
            {
                // Actualizamos el registro
                catMovs.Clave = parData.Clave;
                catMovs.Descripcion = parData.Descripcion;


                // Ingresamos la bobeda a la bd
                await DBContext.database.UpdateAsync(catMovs);

                // Regresamos el registro a la UI
                await DBContext.Destroy();
                return Ok(catMovs);
            }
            catch (Exception ex)
            {
                return BadRequest("Error al actualizar el tipo de movimiento: " + ex.Message);
            }
        }

        [HttpDelete]
        [Route("delete/{CatTipoMovID}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> EliminarRegistro(int CatTipoMovID)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            //var agrupacion = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Tesoreria.CatalogoDenomEfectivo>(CatDenomEfectivoID);
            try
            {
                // Eliminamos el registro
                await DBContext.database.ExecuteAsync("DELETE FROM Tesoreria.CatalogoTipoMovimiento WHERE CatTipoMovID=@0", CatTipoMovID);
                await DBContext.Destroy();
                return Ok(true);
            }
            catch (Exception ex)
            {
                return BadRequest("Error al elimnar el tipo de movimiento: " + ex.Message);
            }
        }

    }
}