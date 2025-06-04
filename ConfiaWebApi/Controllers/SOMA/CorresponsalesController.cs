using System.Data.Common;
using System.Net;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using System.Diagnostics; //Método de Debugusing System.Text.Json;


using DBContext.DBConfia;
using DBContext.DBConfia.Bancos;
using DBContext.DBConfia.dbo;
using DBContext.DBConfia.Custom.Tesoreria;
using DBContext.DBConfia.Custom.Creditos;
using System.Net.Http;
using System.Collections.Generic;
using System.Text.Json;
using System.Collections;
using DBContext.DBConfia.Tesoreria;
using System.Data;
using DBContext.DBConfia.Seguridad;
using registraOrden;
using System.Text.RegularExpressions;
using System.Text;
using DBContext.DBConfia.STP;
using System.Globalization;
using System.IO;
using ConfiaWebApi.Code;

namespace ConfiaWebApi.Controllers.Tesoreria 
{
    [ApiController]
    [Route("api/Tesoreria/[controller]")]
    public class CorresponsalesController : ControllerBase
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
        public CorresponsalesController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        [HttpGet]
        [Route("obtenerCorresponsales")]
        public async Task<IActionResult> ObtenerCorresponsales () 
        {
            var data = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Tesoreria.Corresponsales_View>();
            
            try
            {
                var result = data.Select(c => new
                {
                    CorresponsalID = c.CorresponsalID,
                    Nombre = c.Nombre,
                    TipoConciliacion = c.TipoConciliacion,
                    TipoComision = c.TipoComision,
                    TipoComisionID = c.TipoComisionID,
                    TipoMontoCorte = c.TipoMontoCorte,
                    Activo = c.Activo,
                    Creado = c.Creado.ToString("dd/MM/yyyy", CultureInfo.InvariantCulture),
                    Modificado = c.Modificado?.ToString("dd/MM/yyyy", CultureInfo.InvariantCulture),
                    MontoFijo = c.MontoFijo?.ToString("C", new CultureInfo("en-us")),
                    MontoCorte = c.MontoCorte?.ToString("C", new CultureInfo("en-us"))
                }).ToArray();

                await ConexionBD.Destroy();
                return Ok(result);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex); 
            }
            
        }

        [HttpGet]
        [Route("obtenerCorresponsalesTipo")]
        public async Task<IActionResult> ObtenerCorresponsalesTipo () 
        {
            var data = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Tesoreria.CorresponsalesTipoComision>();
            
            try
            {
                var result = data.Select(c => new
                {
                    TipoComisionID = c.TipoComisionID,
                    TipoComision = c.TipoComision,
                    TipoPorcentaje = c.TipoPorcentaje,
                    TipoMontoFijo = c.TipoMontoFijo,
                    TipoMontoCorte = c.TipoMontoCorte
                }).ToArray();

                await ConexionBD.Destroy();
                return Ok(result);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex); 
            }
            
        }

        [HttpPost]
        [Route("actualizarCorresponsales")]
        [Authorize]
        public async Task<IActionResult> actualizarCorresponsales(ConfiaWebApi.PeticionesRest.Tesoreria.Corresponsales.ActualizarCorresponsales parData)
        {
            try 
            {
                var corresponsalActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.Corresponsales>("WHERE CorresponsalID=@0", parData.CorresponsalID).FirstOrDefaultAsync();

                corresponsalActual.Nombre = parData.Nombre;
                corresponsalActual.TipoConciliacion = parData.TipoConciliacion;
                corresponsalActual.TipoComisionID = parData.TipoComisionID;
                corresponsalActual.MontoFijo = parData.MontoFijo;
                corresponsalActual.MontoCorte = parData.MontoCorte;
                corresponsalActual.Modificado = DateTime.Now;
                corresponsalActual.Activo = parData.Activo;

                await ConexionBD.database.UpdateAsync(corresponsalActual);
                await ConexionBD.Destroy();
                return Ok(corresponsalActual);
            }
            catch ( Exception ex )
            {
                await ConexionBD.Destroy();
                Console.WriteLine("Error " + ex.Message);
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("actualizarCorresponsalesTipo")]
        [Authorize]
        public async Task<IActionResult> actualizarCorresponsalesTipo(ConfiaWebApi.PeticionesRest.Tesoreria.Corresponsales.ActualizarCorresponsalesTipoComiison parData)
        {
            try 
            {
                var corresponsalTipoComisionActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.CorresponsalesTipoComision>("WHERE TipoComisionID=@0", parData.TipoComisionID).FirstOrDefaultAsync();

                corresponsalTipoComisionActual.TipoComision = parData.TipoComision;
                corresponsalTipoComisionActual.TipoMontoCorte = parData.TipoMontoCorte;
                corresponsalTipoComisionActual.TipoMontoFijo = parData.TipoMontoFijo;
                corresponsalTipoComisionActual.TipoPorcentaje = parData.TipoPorcentaje;

                await ConexionBD.database.UpdateAsync(corresponsalTipoComisionActual);
                await ConexionBD.Destroy();
                return Ok(corresponsalTipoComisionActual);
            }
            catch ( Exception ex )
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("agregarCorresponsales")]
        [Authorize]
        public async Task<IActionResult> agregarCorresponsales(ConfiaWebApi.PeticionesRest.Tesoreria.Corresponsales.ActualizarCorresponsalesTipoComiison parData)
        {
            try 
            {
                var corresponsalTipoComisionActual = new DBContext.DBConfia.Tesoreria.CorresponsalesTipoComision();
                
                corresponsalTipoComisionActual.TipoComision = parData.TipoComision;
                corresponsalTipoComisionActual.TipoMontoCorte = parData.TipoMontoCorte;
                corresponsalTipoComisionActual.TipoMontoFijo = parData.TipoMontoFijo;
                corresponsalTipoComisionActual.TipoPorcentaje = parData.TipoPorcentaje;

                await ConexionBD.database.InsertAsync(corresponsalTipoComisionActual);

                await ConexionBD.Destroy();
                return Ok(corresponsalTipoComisionActual);
            }
            catch ( Exception ex )
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("agregarCorresponsalesTipo")]
        [Authorize]
        public async Task<IActionResult> agregarCorresponsalesTipo(ConfiaWebApi.PeticionesRest.Tesoreria.Corresponsales.ActualizarCorresponsales parData)
        {
            try 
            {
                var corresponsal = new DBContext.DBConfia.Tesoreria.Corresponsales();

                corresponsal.Nombre = parData.Nombre;
                corresponsal.TipoComisionID = parData.TipoComisionID;
                corresponsal.TipoConciliacion = parData.TipoConciliacion;
                corresponsal.MontoCorte = parData.MontoCorte;
                corresponsal.MontoFijo = parData.MontoFijo;
                corresponsal.Creado = DateTime.Now;

                await ConexionBD.database.InsertAsync(corresponsal);

                await ConexionBD.Destroy();
                return Ok(corresponsal);
            }
            catch ( Exception ex )
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}