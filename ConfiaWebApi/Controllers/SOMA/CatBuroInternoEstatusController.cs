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
using ConfiaWebApi.Code;

namespace ConfiaWebApi.Controllers.Sistema
{
    [Authorize]
    [ApiController]
    [Route("api/SOMA/[controller]")]
    public class CatBuroInternoEstatus : ControllerBase
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
        public CatBuroInternoEstatus(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        // Obtenemos los agrupaciones
        [HttpGet]
        [Route("find-all")]
        [Authorize]
        public async Task<IActionResult> Obtener()
        {
            var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Catalogos.BuroInternoEstatus>().ToArray();
            await DBContext.Destroy();
            return Ok(res);
        }


        [HttpPost]
        [Route("find-by-id/{BuroInternoEstatusID}")]
        [Authorize]
        public async Task<IActionResult> ObtenerPorID(int BuroInternoEstatusID)
        {
            try
            {
                var res1 = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Catalogos.BuroInternoEstatus>(BuroInternoEstatusID);
                await DBContext.Destroy();
                return Ok(res1);


            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        [Route("create")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Add(PeticionesRest.SOMA.BuroInternoEstatus.Agregar parData)
        {
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();
            //var Buros = await DBContext.database.FetchAsync<DBContext.DBConfia.Catalogos.BuroInternoEstatus>();

            //Se genera el registro del nuevo estatus de buro
            var buroEstatus = new DBContext.DBConfia.Catalogos.BuroInternoEstatus()
            {
                Nombre = parData.Nombre,
                Color = parData.Color,
                PuedeCanjear = parData.PuedeCanjear

            };
            try
            {
                // Ingresamos la agrupacion a la bd
                await DBContext.database.InsertAsync(buroEstatus);
                await DBContext.Destroy();
                return Ok(buroEstatus);

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }


        }

        [HttpPost]
        [Route("update/{BuroInternoEstatusID}")]
        [Authorize]
        public async Task<IActionResult> Update(PeticionesRest.SOMA.BuroInternoEstatus.Actualizar parData, int BuroInternoEstatusID)
        {
            try
            {
                var buro = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Catalogos.BuroInternoEstatus>(BuroInternoEstatusID);

                buro.Nombre = parData.Nombre;
                buro.Color = parData.Color;
                buro.PuedeCanjear = parData.PuedeCanjear;

                await DBContext.database.UpdateAsync(buro);
                await DBContext.Destroy();
                return Ok(buro);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("delete/{BuroInternoEstatusID}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> EliminarRegistro(int BuroInternoEstatusID)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            var dispersion = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Catalogos.BuroInternoEstatus>(BuroInternoEstatusID);
            try
            {
                // Eliminamos el registro
                await DBContext.database.ExecuteAsync("DELETE FROM Catalogos.BuroInternoEstatus WHERE BuroInternoEstatusID=@0", BuroInternoEstatusID);
                await DBContext.Destroy();
                return Ok(true);
            }
            catch (Exception ex)
            {
                return BadRequest("Error al elimnar la dispersion: " + ex.Message);
            }
        }

    }
}