using System.Data.Common;
using System.Net;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using ConfiaWebApi.ModlesSP.Creditos;

using DBContext.DBConfia;
using DBContext.DBConfia.Custom.Creditos;
using DBContext.DBConfia.General;
using DBContext.DBConfia.dbo;

using System.Net.Http;
using System.Collections.Generic;
using System.Text.Json;
using System.Collections;

namespace ConfiaWebApi.Controllers.Sistema
{
    [Authorize]
    [ApiController]
    public class BitacoraCambiosController : ControllerBase
    {
        // TODO::
        // Validar funcion de eliminar cuenta... ??, valido, util ?
        // Segundo, se pueden eliminar las bovedas ??, se pueden actualizar hasta que nivel? (Nombre y Clave o solo nombre?)

        /// <summary>
        /// Conexion a base de datos
        /// </summary>
        private DBConfiaContext ConexionBD;

        /// <summary>
        /// Constructor del controlador
        /// </summary>
        /// <param name="_DBContext">Conexión de datos para el controlador</param>
        public BitacoraCambiosController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        // Obtenemos los balances
        [HttpPost]
        [Route("datosmodificados")]
        [Authorize]
        public async Task<IActionResult> guardarCambio(ConfiaWebApi.PeticionesRest.SOMA.BitacoraCambios.Agregar parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            // var UsuarioActual = await DBContext.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
            var PersonaActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            var cambios = new BitacoraCambios()
            {
                PersonaID = PersonaActual.UsuarioID,
                Accion = parData.Accion,
                Modulo = parData.Modulo
            };


            await ConexionBD.database.InsertAsync(cambios);
            await ConexionBD.Destroy();
            return Ok(cambios);

        }

    }
}