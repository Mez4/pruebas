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
    public class MovPolizasController : ControllerBase
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
        public MovPolizasController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        // Obtenemos los balances
        [HttpGet]
        [Route("find-all")]
        [Authorize]
        public async Task<IActionResult> Obtener()
        {
            var polizas = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Tesoreria.Movimientopolizas>();
            var vCtasContables = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Tesoreria.CuentasContables>();
            var vEstatus = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Tesoreria.EstatusMovimiento>();
            ArrayList res = new();

            foreach (var sc in polizas)
            {

                res.Add(new
                {
                    movPolID = sc.MovimientoPolizaID,
                    descripcion = sc.Descripcion,
                    cuenta = vCtasContables.Where(ws => ws.CuentaID == sc.CuentaID).Select(sc => new
                    {
                        id = sc.CuentaID,
                        cuenta = sc.Cuenta,
                        nombre = sc.Nombre,
                        tipoId = sc.TipoID,
                        tipoBancoId = sc.TipoBancoId
                    }).SingleOrDefault(),
                    referencia = sc.Referencia,
                    estatus = vEstatus.Where(ws => ws.CatEstatusMovID == sc.CatEstatusMovID).Select(sce => new
                    {
                        estatusMovId = sce.CatEstatusMovID,
                        caracter = sce.Caracter,
                        descripcion = sce.Descripcion
                    }).SingleOrDefault(),
                    debe = sc.Debe,
                    haber = sc.Haber



                });
            }
            await ConexionBD.Destroy();
            return Ok(res);
        }

        [HttpGet]
        [Route("find-by-id/{MovimientoPolizaID}")]
        [Authorize]
        public async Task<IActionResult> ObtenerPorId(int MovimientoPolizaID)
        {
            var sc = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.Movimientopolizas>
            ("WHERE MovimientoPolizaID =@0", MovimientoPolizaID).SingleOrDefaultAsync();
            ArrayList res = new();
            var vCtasContables = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Tesoreria.CuentasContables>();
            var vEstatus = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Tesoreria.EstatusMovimiento>();

            res.Add(new
            {
                movPolID = sc.MovimientoPolizaID,
                descripcion = sc.Descripcion,
                cuenta = vCtasContables.Where(ws => ws.CuentaID == sc.CuentaID).Select(sc => new
                {
                    id = sc.CuentaID,
                    cuenta = sc.Cuenta,
                    nombre = sc.Nombre,
                    tipoId = sc.TipoID,
                    tipoBancoId = sc.TipoBancoId
                }).SingleOrDefault(),
                referencia = sc.Referencia,
                estatus = vEstatus.Where(ws => ws.CatEstatusMovID == sc.CatEstatusMovID).Select(sce => new
                {
                    estatusMovId = sce.CatEstatusMovID,
                    caracter = sce.Caracter,
                    descripcion = sce.Descripcion
                }).SingleOrDefault(),
                debe = sc.Debe,
                haber = sc.Haber
            });

            await ConexionBD.Destroy();
            return Ok(res);
        }


        [HttpPost]
        [Route("create/{crPoliza}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Agregar(PeticionesRest.SOMA.MovPolizas.Add parData, int crPoliza)
        {
            // Obtenemos el email del usuario de los claims
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            // var UsuarioActual = await DBContext.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
            // var PersonaActual = await ConexionBD.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.ID).FirstOrDefaultAsync();
            ArrayList res = new();
            try
            {
                if (crPoliza != 0)
                {
                    var movPoliza = new DBContext.DBConfia.Tesoreria.Movimientopolizas()
                    {
                        PolizaID = crPoliza,
                        Descripcion = parData.descripcion,
                        CuentaID = parData.cuenta,
                        Referencia = parData.referencia,
                        CatEstatusMovID = parData.estatus,
                        Debe = parData.debe,
                        Haber = parData.haber
                    };
                    await ConexionBD.database.InsertAsync(movPoliza);
                    // Regresamos el registro a la UI
                    await ConexionBD.Destroy();
                    return Ok(movPoliza);
                }
                // Generamos el registro de el estado civil
                else
                {
                    return BadRequest("Póliza inválida");
                }
                // Ingresamos la poliza  a la bd

            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("Error al ingresar el movimiento: " + ex.Message);
            }
        }

        //Método para actualizar una denominación
        [HttpPut]
        [Route("update/{MovimientoPolizaID}/{PolizaID}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Actualizar(PeticionesRest.SOMA.MovPolizas.Update parData, int MovimientoPolizaID, int PolizaID)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            // var UsuarioActual = await ConexionBD.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
            var PersonaActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE UsuarioID=@0", UsuarioActual.UsuarioID).FirstOrDefaultAsync();


            // Generamos el registro de bobeda
            var movsPolizas = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.Movimientopolizas>
            ("WHERE MovimientoPolizaID=@0 AND PolizaID=@1 ", MovimientoPolizaID, PolizaID).SingleOrDefaultAsync();

            try
            {
                // Actualizamos el movimiento
                movsPolizas.Descripcion = parData.descripcion;
                movsPolizas.CuentaID = parData.cuenta;
                movsPolizas.Referencia = parData.referencia;
                movsPolizas.CatEstatusMovID = parData.estatus;
                movsPolizas.Debe = parData.debe;
                movsPolizas.Haber = parData.haber;

                // Ingresamos la bobeda a la bd
                await ConexionBD.database.UpdateAsync(movsPolizas);

                // Regresamos el registro a la UI
                await ConexionBD.Destroy();
                return Ok(movsPolizas);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("Error al actualizar el movimiento: " + ex.Message);
            }
        }

        [HttpDelete]
        [Route("delete/{MovimientoPolizaID}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> EliminarRegistro(int MovimientoPolizaID)
        {
            // Obtenemos el email del usuario de los claims
            try
            {
                var res = await ConexionBD.database.ExecuteAsync("DELETE FROM Tesoreria.Movimientopolizas WHERE MovimientoPolizaID=@0", MovimientoPolizaID);
                await ConexionBD.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("Error al elimnar el movimiento: " + ex.Message);
            }
        }

    }
}