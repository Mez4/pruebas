//using System.Data.Common;
//using System.Net;
//using System;
//using System.Linq;
//using System.Threading.Tasks;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.Extensions.Configuration;
//using ConfiaWebApi.ModlesSP.Creditos;

//using DBContext.DBConfia;
//using DBContext.DBConfia.Custom.Creditos;
//using DBContext.DBConfia.Tesoreria;
//
//using DBContext.DBConfia.dbo;

//using System.Net.Http;
//using System.Collections.Generic;
//using System.Text.Json;
//using System.Collections;

//namespace ConfiaWebApi.Controllers.Sistema
//{
//    [Authorize]
//    [ApiController]
//    public class AplicarPagoCreditoController : ControllerBase
//    {
//        // TODO::
//        // En desuso se creo otro en Creditos
//        // Validar funcion de eliminar cuenta... ??, valido, util ?
//        // Segundo, se pueden eliminar las bovedas ??, se pueden actualizar hasta que nivel? (Nombre y Clave o solo nombre?)

//        /// <summary>
//        /// Conexion a base de datos
//        /// </summary>
//        private DBConfiaContext DBContext;

//        /// <summary>
//        /// Constructor del controlador
//        /// </summary>
//        /// <param name="_DBContext">Conexión de datos para el controlador</param>
//        public AplicarPagoCreditoController(DBConfiaContext _DBContext)
//        {
//            DBContext = _DBContext;
//        }

//        // Obtenemos los balances
//        [HttpPost]
//        [Route("liquidarCredito")]
//        public async Task<IActionResult> Obtener(ConfiaWebApi.PeticionesRest.Distribuidores.ValerasCabecera.Add parData)
//        {
//            var res = await DBContext.database.QueryAsync<AplicarPagoSP>("EXEC Creditos.pa_AplicacionPago_Ins @ProductoId, @DistribuidorId, @SucursalId, @FechaPago, @Importe, @UsuarioId, @GenerarDNI", parData).FirstOrDefaultAsync();
//            if (res.regresa == 1)
//            {
//                return Ok(new
//                {
//                    mensaje = "Crédito liquidado correctamente"
//                });
//            }
//            else
//            {
//                return StatusCode(500, new
//                {
//                    mensaje = "Ocurrió un problema al liquidar el crédito"
//                });
//            }
//        }

//    }
//}