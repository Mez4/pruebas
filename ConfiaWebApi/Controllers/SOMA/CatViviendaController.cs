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
    public class CatViviendaController : ControllerBase
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
        public CatViviendaController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        // Obtenemos los balances
        [HttpGet]
        [Route("find-all")]
        [Authorize]
        public async Task<IActionResult> Obtener()
        {
            var viviendas = await DBContext.database.FetchAsync<DBContext.DBConfia.Catalogos.ViviendasTipos>();

            try
            {

                var result = viviendas.Select(c => new
                {
                    viviendaTipoid = c.ViviendaTipoId,
                    viviendaTipo = c.ViviendaTipo,
                    activa = c.Activa

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

        [HttpGet]
        [Route("find-by-id/{ViviendaTipoId}")]
        [Authorize]
        public async Task<IActionResult> ObtenerPorID(int ViviendaTipoId)
        {
            var viviendas = await DBContext.database.FetchAsync<DBContext.DBConfia.Catalogos.ViviendasTipos>();

            try
            {

                var result = viviendas.Where(w => w.ViviendaTipoId == ViviendaTipoId).Select(c => new
                {
                    viviendaTipoid = c.ViviendaTipoId,
                    viviendaTipo = c.ViviendaTipo,
                    activa = c.Activa

                }).SingleOrDefault();
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
        [Route("create")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Agregar(PeticionesRest.SOMA.CatViviendaTipo.Add parData)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            // Generamos el registro del tipo de movimiento
            var vivienda = new DBContext.DBConfia.Catalogos.ViviendasTipos()
            {
                ViviendaTipo = parData.ViviendaTipo,
                Activa = parData.Activa
            };
            try
            {
                await DBContext.database.InsertAsync(vivienda);
                // Regresamos el registro a la UI
                await DBContext.Destroy();
                return Ok(vivienda);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
                //return BadRequest("Error al ingresar el tipo de movimiento al sistema: " + ex.Message);
            }
        }

        [HttpPut]
        [Route("update/{ViviendaTipoId}")]
        [Authorize]

        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Actualizar(PeticionesRest.SOMA.CatViviendaTipo.Update parData, int ViviendaTipoId)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            // Generamos el registro de bobeda
            var vivienda = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Catalogos.ViviendasTipos>(ViviendaTipoId);

            try
            {
                // Actualizamos el registro
                vivienda.ViviendaTipo = parData.ViviendaTipo;
                vivienda.Activa = parData.Activa;

                // Ingresamos la bobeda a la bd
                await DBContext.database.UpdateAsync(vivienda);

                // Regresamos el registro a la UI
                await DBContext.Destroy();
                return Ok(vivienda);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest("Error al actualizar el sexo: " + ex.Message);
            }
        }

        [HttpDelete]
        [Route("delete/{ViviendaTipoId}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> EliminarRegistro(int ViviendaTipoId)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            //var agrupacion = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Tesoreria.CatalogoDenomEfectivo>(CatDenomEfectivoID);
            try
            {
                // Eliminamos el registro
                await DBContext.database.ExecuteAsync("DELETE FROM Catalogos.ViviendasTipos WHERE ViviendaTipoId=@0", ViviendaTipoId);
                await DBContext.Destroy();
                return Ok(true);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest("Error al elimnar el tipo de banco: " + ex.Message);
            }
        }

    }
}
