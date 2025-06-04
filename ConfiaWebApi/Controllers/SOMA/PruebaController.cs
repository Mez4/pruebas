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
using DBContext.DBConfia;
using DBContext.DBConfia.Tesoreria;
using DBContext.DBConfia.Bancos;
using DBContext.DBConfia.Balances;



using DBContext.DBConfia.dbo;
using DBContext.DBConfia.Custom.Tesoreria;

using System.Net.Http;
using System.Collections.Generic;
using System.Text.Json;
using System.Collections;

namespace ConfiaWebApi.Controllers.Sistema
{
    [ApiController]
    [Route("api/SOMA/[controller]")]

    public class PruebaController : ControllerBase
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
        public PruebaController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }
        // Obtenemos los balances
        [HttpGet]
        [Route("obtener")]
        [Authorize]
        public async Task<IActionResult> Obtener()
        {
            var transaccion = false;
            try
            {
                    ConexionBD.database.BeginTransaction();
                    transaccion= true;
                    var periodosConBalance = await ConexionBD.database.QueryAsync<PeriodosConBalance>("WHERE Estatus = 'C' AND ReAbierto=0").ToArrayAsync();
                    ConexionBD.database.CompleteTransaction();
                    await ConexionBD.Destroy();
                    return Ok(periodosConBalance);
            }
            catch (Exception ex)
            {
                if(transaccion); ConexionBD.database.AbortTransaction();
                return BadRequest(ex.Message);
            }
        }
    }
}
