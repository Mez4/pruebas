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

    public class SolicitudTiposController : ControllerBase
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
        public SolicitudTiposController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }
        // Obtenemos los balances
        [HttpGet]
        [Route("obtener")]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Obtener()
        {
            var transaccion = false;
            try
            {
                ConexionBD.database.BeginTransaction();
                transaccion = true;
                var Tipos = await ConexionBD.database.FetchAsync<Tipo>();
                ConexionBD.database.CompleteTransaction();
                await ConexionBD.Destroy();
                return Ok(Tipos);
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
        public async Task<IActionResult> insertar(ConfiaWebApi.PeticionesRest.SOMA.SolicitudTipos.Agregar parData)
        {
            var transaccion = false;
            try
            {
                var NuevoTipo = new Tipo()
                {
                    Tipos = parData.Tipos
                };

                await ConexionBD.database.InsertAsync(NuevoTipo);
                await ConexionBD.Destroy();

                return Ok(NuevoTipo);
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
        public async Task<IActionResult> actualizar(ConfiaWebApi.PeticionesRest.SOMA.SolicitudTipos.Actualizar parData)
        {
            var transaccion = false;
            try
            {
                var SolicitudEncontrada = await ConexionBD.database.SingleByIdAsync<Tipo>(parData.TipoID);
                if (SolicitudEncontrada != null)
                {
                    SolicitudEncontrada.Tipos = parData.Tipos;
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
