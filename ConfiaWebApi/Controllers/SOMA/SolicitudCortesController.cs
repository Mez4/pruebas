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
using DBContext.DBConfia.Tesoreria;
using DBContext.DBConfia.Bancos;
using DBContext.DBConfia.Balances;
using DBContext.DBConfia.Compras;



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

    public class SolicitudCortesController : ControllerBase
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
        public SolicitudCortesController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }
        // Obtenemos los balances
        [HttpGet]
        [Route("obtenerProducto")]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Obtener()
        {
            var transaccion = false;
            try
            {
                ConexionBD.database.BeginTransaction();
                transaccion = true;
                var Corte = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Compras.Producto>();
                ConexionBD.database.CompleteTransaction();
                await ConexionBD.Destroy();
                return Ok(Corte);
            }
            catch (Exception ex)
            {
                if (transaccion) ; ConexionBD.database.AbortTransaction();
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("insertar")]
        [Code.TProteccionProducto]
        public async Task<IActionResult> insertar(ConfiaWebApi.PeticionesRest.SOMA.SolicitudCortes.Agregar parData)
        {
            var transaccion = false;
            try
            {
                var NuevoCorte = new DBContext.DBConfia.Compras.Producto()
                {
                    ProductoUniformeDesc = parData.Cortes,
                    Clave = parData.Clave
                };

                await ConexionBD.database.InsertAsync(NuevoCorte);
                await ConexionBD.Destroy();

                return Ok(NuevoCorte);
            }
            catch (Exception ex)
            {
                if (transaccion) ; ConexionBD.database.AbortTransaction();
                return BadRequest(ex.Message);
            }
        }


        [HttpPut]
        [Route("actualizar")]
        [Code.TProteccionProducto]
        public async Task<IActionResult> actualizar(ConfiaWebApi.PeticionesRest.SOMA.SolicitudCortes.Actualizar parData)
        {
            var transaccion = false;
            try
            {
                var SolicitudEncontrada = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Compras.Producto>(parData.CorteID);
                if (SolicitudEncontrada != null)
                {
                    SolicitudEncontrada.ProductoUniformeDesc = parData.Cortes;
                    SolicitudEncontrada.Clave = parData.Clave;
                    ConexionBD.database.BeginTransaction();
                    transaccion = true;
                    await ConexionBD.database.UpdateAsync(SolicitudEncontrada);
                    ConexionBD.database.CompleteTransaction();
                    await ConexionBD.Destroy();
                }
                return Ok(SolicitudEncontrada);
            }
            catch (Exception ex)
            {
                if (transaccion) ; ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }

}


