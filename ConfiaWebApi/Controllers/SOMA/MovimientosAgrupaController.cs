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
    public class MovimientosAgrupaController : ControllerBase
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
        public MovimientosAgrupaController(DBConfiaContext _DBContext)
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
            var bancos = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.MovimientosAgrupa>();
            var bancosResult = bancos.Select(sc => new
            {
                movAgrupaId = sc.MovAgrupaId,
                clave = sc.Clave,
                nombre = sc.Nombre,
                estatus = sc.Estatus
            }).ToArray();
            await DBContext.Destroy();
            return Ok(bancosResult);
        }


        [HttpPost]
        [Route("create")]
        [Authorize]
        [Code.TProteccionProducto]

        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Agregar(PeticionesRest.SOMA.MovimientosAgrupa.Add parData)
        {
            // Obtenemos el email del usuario de los claims
            /*    var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
               var UsuarioActual = await DBContext.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
               var PersonaActual = await DBContext.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.ID).FirstOrDefaultAsync();
               ArrayList res = new();
    */
            // Generamos el registro de el estado civil
            var movDdetalle = new DBContext.DBConfia.Bancos.MovimientosAgrupa()
            {
                Clave = parData.clave,
                Nombre = parData.nombre,
                Estatus = parData.estatus
            };
            try
            {
                // Ingresamos la el movimiento  a la bd
                await DBContext.database.InsertAsync(movDdetalle);
                await DBContext.Destroy();
                // Regresamos el registro a la UI
                return Ok(movDdetalle);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest("Error al ingresar el movimiento agrupa: " + ex.Message);
            }
        }

        //Método para actualizar una denominación
        [HttpPut]
        [Route("update/{movAgrupaId}")]
        [Authorize]
        [Code.TProteccionProducto]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Actualizar(PeticionesRest.SOMA.MovimientosAgrupa.Update parData, int movAgrupaId)
        {
            /*  var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
             var UsuarioActual = await DBContext.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
             var PersonaActual = await DBContext.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.ID).FirstOrDefaultAsync();
  */

            // Generamos el registro de bobeda
            var movBancario = await DBContext.database.QueryAsync<DBContext.DBConfia.Bancos.MovimientosAgrupa>("WHERE MovAgrupaId=@0", movAgrupaId).SingleOrDefaultAsync();

            try
            {
                // Actualizamos el movimiento
                movBancario.Clave = parData.clave;
                movBancario.Nombre = parData.nombre;
                movBancario.Estatus = parData.estatus;


                // Ingresamos la bobeda a la bd
                await DBContext.database.UpdateAsync(movBancario);
                await DBContext.Destroy();
                // Regresamos el registro a la UI
                return Ok(movBancario);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest("Error al actualizar el movimiento agrupa: " + ex.Message);
            }
        }

        [HttpDelete]
        [Route("delete/{movAgrupaId}")]
        [Authorize]
        [Code.TProteccionProducto]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> EliminarRegistro(int movAgrupaId)
        {
            // Obtenemos el email del usuario de los claims
            try
            {
                var res = await DBContext.database.ExecuteAsync("DELETE FROM Bancos.MovimientosAgrupa WHERE MovAgrupaId=@0", movAgrupaId);
                await DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest("Error al elimnar el movimiento agrupa: " + ex.Message);
            }
        }

    }
}