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
    public class CajaTipoOperacionRestController : ControllerBase
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
        public CajaTipoOperacionRestController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        // Obtenemos los balances
        [HttpGet]
        [Route("obtener")]
        [Authorize]
        public async Task<IActionResult> Obtener()
        {
            var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CatalogoCajas>().ToArray();
            await DBContext.Destroy();
            return Ok(res);
            //Pendiente nest de objetos 20 JULIO
        }

        [HttpPost]
        [Route("obtener/{CajaID}")]
        [Authorize]
        public async Task<IActionResult> ObtenerPorId(int CajaID)
        {
            var res1 = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Tesoreria.CatalogoCajas>(CajaID);
            await DBContext.Destroy();
            return Ok(res1);
        }


        // Agrega una caja a la base de datos
        [HttpPost]
        [Route("agregar")]
        [Authorize]
        public async Task<IActionResult> Agregar(PeticionesRest.SOMA.CajaTipoOperacion.Agregar parData)
        {
            try
            {
                DBContext.database.BeginTransaction();

                var cajaActualizada = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CajasOperando_VW>("Where CajaID=@0", parData.CajaID).SingleOrDefaultAsync();

                foreach (var item in parData.TiposOperaciones)
                {
                    if (item.CajaTipoOperacionID == 0)
                    {
                        if (item.CuentaBancoIdNueva > 0)
                        {
                            var tipoOperacion = new CajaTipoOperacion()
                            {
                                CajaID = item.CajaID,
                                TipoMovimientoID = item.Id,
                                Activa = item.Activa,
                                PuedeSacar = item.PuedeSacar,
                                PuedeRecibir = item.PuedeRecibir,
                                CuentaBancoId = item.CuentaBancoIdNueva
                            };
                            await DBContext.database.InsertAsync(tipoOperacion);
                            var cuentaNueva = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Bancos.CatalogoCuentasBancos>(item.CuentaBancoIdNueva);
                            cuentaNueva.Disponible = false;
                            await DBContext.database.UpdateAsync(cuentaNueva);
                        }
                    }
                }
                if (cajaActualizada != null)
                {
                    var caja = new
                    {
                        CajaID = cajaActualizada.CajaID,
                        DescripcionCaja = cajaActualizada.Descripcion,
                        Nombre = cajaActualizada.Nombre,
                        Clave = cajaActualizada.Clave,
                        Activa = cajaActualizada.Estatus,
                        Boveda = cajaActualizada.BovedaID,
                        TiposOperacion = (await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.TipoOperacion_VW>("WHERE CajaID=@0", parData.CajaID).ToArrayAsync())
                    };
                }
                else
                {
                    var cajaActualizada2 = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CajasOperando_VW>("Where CajaID=@0", parData.CajaID).SingleOrDefaultAsync();
                    var caja = new
                    {
                        CajaID = cajaActualizada2.CajaID,
                        DescripcionCaja = cajaActualizada2.Descripcion,
                        Nombre = cajaActualizada2.Nombre,
                        Clave = cajaActualizada2.Clave,
                        Activa = cajaActualizada2.Estatus,
                        Boveda = cajaActualizada2.BovedaID,
                        TiposOperacion = (await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.TipoOperacion_VW>("WHERE CajaID=@0", parData.CajaID).ToArrayAsync())
                    };
                }

                DBContext.database.CompleteTransaction();
                await DBContext.Destroy();
                return Ok();
            }
            catch (Exception ex)
            {
                DBContext.database.AbortTransaction();
                return BadRequest("Error al ingresar el registro al sistema: " + ex.Message);
            }
        }

        //Método para actualizar una caja
        [HttpPut]
        [Route("actualizar/{CajaID}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Actualizar(PeticionesRest.SOMA.CajaTipoOperacion.Actualizar parData, int CajaID)
        {
            try
            {
                DBContext.database.BeginTransaction();
                var CajaIDVista = 0;
                foreach (var item in parData.TiposOperaciones)
                {
                    CajaIDVista = item.CajaID;
                    if (item.CajaTipoOperacionID == 0)
                    {
                        var tipoOperacion = new CajaTipoOperacion()
                        {
                            CajaID = item.CajaID,
                            TipoMovimientoID = item.Id,
                            Activa = item.Activa,
                            PuedeSacar = item.PuedeSacar,
                            PuedeRecibir = item.PuedeRecibir,
                            CuentaBancoId = item.CuentaBancoIdNueva,

                        };
                        await DBContext.database.InsertAsync(tipoOperacion);
                        var cuentaNueva = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Bancos.CatalogoCuentasBancos>(item.CuentaBancoIdNueva);
                        cuentaNueva.Disponible = false;
                        await DBContext.database.UpdateAsync(cuentaNueva);
                    }
                    else
                    {
                        int? cuentaBancoAnterior = 0;
                        var tipoOperacion = await DBContext.database.SingleByIdAsync<CajaTipoOperacion>(item.CajaTipoOperacionID);
                        tipoOperacion.Activa = item.Activa;
                        tipoOperacion.PuedeRecibir = item.PuedeRecibir;
                        tipoOperacion.PuedeSacar = item.PuedeSacar;
                        if (item.CuentaBancoIdNueva > 0)
                        {
                            var registros_movimientos = await DBContext.database.QueryAsync<DBContext.DBConfia.Bancos.Movimientos>("WHERE CuentaID=@0", item.CuentaBancoId).ToArrayAsync();
                            if (registros_movimientos.Length == 0)
                            {
                                cuentaBancoAnterior = tipoOperacion.CuentaBancoId;
                                tipoOperacion.CuentaBancoId = item.CuentaBancoIdNueva;
                                /*  var cuentaAnterior = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CuentasCaja>("WHERE CajaId=@0 AND CuentaBancoId=@1", CajaIDVista, cuentaBancoAnterior).SingleOrDefaultAsync();
                                 cuentaAnterior.Disponible = true;
                                 await DBContext.database.UpdateAsync(cuentaAnterior);
                                 var cuentaNueva = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CuentasCaja>("WHERE CajaId=@0 AND CuentaBancoId=@1", CajaIDVista, item.CuentaBancoIdNueva).SingleOrDefaultAsync();
                                 cuentaNueva.Disponible = false;
                                 await DBContext.database.UpdateAsync(cuentaNueva);
                   */
                            }
                            else
                            {
                                var cuenta_error = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Bancos.CatalogoCuentasBancos>(item.CuentaBancoId);
                                DBContext.database.AbortTransaction();
                                return StatusCode(206, new
                                {
                                    data = "No es posible desligar la cuenta [" + cuenta_error.CuentaBancoID + " : " + cuenta_error.NumeroCuenta + "], la cuenta registra movimientos."
                                });
                            }

                        }
                        else
                        {
                            tipoOperacion.CuentaBancoId = item.CuentaBancoId;
                        }
                        await DBContext.database.UpdateAsync(tipoOperacion);
                    }
                }
                var cajaActualizada = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CajasOperando_VW>("Where CajaID=@0", CajaIDVista).SingleOrDefaultAsync();
                var caja = new
                {
                    CajaID = cajaActualizada.CajaID,
                    DescripcionCaja = cajaActualizada.Descripcion,
                    Nombre = cajaActualizada.Nombre,
                    Clave = cajaActualizada.Clave,
                    Activa = cajaActualizada.Estatus,
                    Boveda = cajaActualizada.BovedaID,
                    TiposOperacion = (await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.TipoOperacion_VW>("WHERE CajaID=@0", CajaIDVista).ToArrayAsync())
                };
                DBContext.database.CompleteTransaction();
                return Ok(caja);
            }
            catch (Exception ex)
            {
                DBContext.database.AbortTransaction();
                return BadRequest("Error al ingresar el registro al sistema: " + ex.Message);
            }
        }

    }
}