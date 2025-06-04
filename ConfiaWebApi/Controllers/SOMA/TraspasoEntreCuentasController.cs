using System.Data.Common;
using System.Net;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

using DBContext.DBConfia;
using DBContext.DBConfia.Tesoreria;


namespace ConfiaWebApi.Controllers.Sistema
{
    [Authorize]
    [ApiController]
    [Route("api/SOMA/[controller]")]
    public class TraspasoEntreCuentasController : ControllerBase

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
        public TraspasoEntreCuentasController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }
        // Obtenemos los balances
        [HttpPost]
        [Route("obtenerCuentasMovimientosRetiro")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> cuentasMovimientosRetiro(ConfiaWebApi.PeticionesRest.SOMA.TraspasoEntreCuentas.cuentasMovimientosRetiro parData)
        {
            try
            {
                var cuentasMovimientosRetiro = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.MovimientosCuentasRetiros_VW>("WHERE CajaID = @0", parData.CajaID).ToArrayAsync();
                await DBContext.Destroy();
                return Ok(cuentasMovimientosRetiro);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        [Route("obtenerCuentasMovimientosDeposito")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> cuentasMovimientosDeposito(ConfiaWebApi.PeticionesRest.SOMA.TraspasoEntreCuentas.cuentasMovimientosDeposito parData)
        {
            try
            {


                var cuentasMovimientosRetiro = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.MovimientosCuentasDepositos_VW>
                ("WHERE CajaID = @0 and empresaId=@1", parData.CajaID, parData.EmpresaID).ToArrayAsync();
                await DBContext.Destroy();
                return Ok(cuentasMovimientosRetiro);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }

        }

    }
}