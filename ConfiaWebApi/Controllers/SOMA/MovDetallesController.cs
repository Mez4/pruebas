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
    public class MovDetallesController : ControllerBase
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
        public MovDetallesController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        // Obtenemos los balances
        [HttpGet]
        [Route("find-all")]
        [Authorize]
        public async Task<IActionResult> Obtener()
        {
            var bancos = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Bancos.MovimientosDetalle>();
            var bancosResult = bancos.Select(sc => new
            {
                movimientoDetalleID = sc.MovimientoDetalleID,
                creditoID = sc.CreditoID,
                noPago = sc.NoPago,
                capital = sc.Capital,
                interes = sc.Interes,
                comisionn = sc.Comision,
                seguro = sc.Seguro,
                cargo = sc.Cargo,
                iva = sc.IVA,
                importe = sc.Importe,
                noPagoCan = sc.noPagoCan,
                capitalCan = sc.capitalCan,
                interesCan = sc.interesCan,
                comisionCan = sc.comisionCan,
                seguroCan = sc.seguroCan,
                cargoCan = sc.cargoCan,
                ivaCan = sc.IVACan,
                polizaMovId = sc.PolizaMovId
            }).ToArray();
            await ConexionBD.Destroy();
            return Ok(bancosResult);
        }

        [HttpGet]
        [Route("find-by-id/{MovimientoID}")]
        [Authorize]
        public async Task<IActionResult> ObtenerPorId(int MovimientoID)
        {
            var movsBa = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Bancos.MovimientosDetalle>();
            var movsBaResult = movsBa.Where(ws => ws.MovimientoID == MovimientoID).Select(sc => new
            {
                movimientoDetalleID = sc.MovimientoDetalleID,
                creditoID = sc.CreditoID,
                noPago = sc.NoPago,
                capital = sc.Capital,
                interes = sc.Interes,
                comisionn = sc.Comision,
                seguro = sc.Seguro,
                cargo = sc.Cargo,
                iva = sc.IVA,
                importe = sc.Importe,
                noPagoCan = sc.noPagoCan,
                capitalCan = sc.capitalCan,
                interesCan = sc.interesCan,
                comisionCan = sc.comisionCan,
                seguroCan = sc.seguroCan,
                cargoCan = sc.cargoCan,
                ivaCan = sc.IVACan,
                polizaMovId = sc.PolizaMovId
            }).ToArray();
            await ConexionBD.Destroy();
            return Ok(movsBaResult);
        }



        [HttpPost]
        [Route("create")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Agregar(PeticionesRest.SOMA.MovDetalles.Add parData)
        {
            // Obtenemos el email del usuario de los claims
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            // var UsuarioActual = await DBContext.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
            // var PersonaActual = await ConexionBD.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.ID).FirstOrDefaultAsync();
            ArrayList res = new();

            // Generamos el registro de el estado civil
            var movDdetalle = new DBContext.DBConfia.Bancos.MovimientosDetalle()
            {
                MovimientoID = parData.movimientoID,
                CreditoID = parData.creditoID,
                NoPago = parData.noPago,
                Capital = parData.capital,
                Interes = parData.interes,
                Comision = parData.comision,
                Seguro = parData.seguro,
                Cargo = parData.cargo,
                IVA = parData.iva,
                noPagoCan = parData.noPagoCan,
                capitalCan = parData.capitalCan,
                interesCan = parData.interesCan,
                comisionCan = parData.comisionCan,
                seguroCan = parData.seguroCan,
                cargoCan = parData.cargoCan,
                IVACan = parData.ivaCan,
                PolizaMovId = parData.polizaMovId
            };
            try
            {
                // Ingresamos la el movimiento  a la bd
                await ConexionBD.database.InsertAsync(movDdetalle);

                // Regresamos el registro a la UI
                await ConexionBD.Destroy();
                return Ok(movDdetalle);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("Error al ingresar el movimiento detalle: " + ex.Message);
            }
        }

        //Método para actualizar una denominación
        [HttpPut]
        [Route("update/{MovimientoDetalleID}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Actualizar(PeticionesRest.SOMA.MovDetalles.Update parData, int MovimientoDetalleID)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            // var UsuarioActual = await ConexionBD.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
            // var PersonaActual = await ConexionBD.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.UsuarioID).FirstOrDefaultAsync();


            // Generamos el registro de bobeda
            var movBancario = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Bancos.MovimientosDetalle>("WHERE MovimientoDetalle=@0", MovimientoDetalleID).SingleOrDefaultAsync();

            try
            {
                // Actualizamos el movimiento
                movBancario.MovimientoID = parData.movimientoID;
                movBancario.CreditoID = parData.creditoID;
                movBancario.NoPago = parData.noPago;
                movBancario.Capital = parData.capital;
                movBancario.Interes = parData.interes;
                movBancario.Comision = parData.comision;
                movBancario.Seguro = parData.seguro;
                movBancario.Cargo = parData.cargo;
                movBancario.IVA = parData.iva;
                movBancario.noPagoCan = parData.noPagoCan;
                movBancario.capitalCan = parData.capitalCan;
                movBancario.interesCan = parData.interesCan;
                movBancario.comisionCan = parData.comisionCan;
                movBancario.seguroCan = parData.seguroCan;
                movBancario.cargoCan = parData.cargoCan;
                movBancario.IVACan = parData.ivaCan;
                movBancario.PolizaMovId = parData.polizaMovId;

                // Ingresamos la bobeda a la bd
                await ConexionBD.database.UpdateAsync(movBancario);

                // Regresamos el registro a la UI
                await ConexionBD.Destroy();
                return Ok(movBancario);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("Error al actualizar el movimiento detalle: " + ex.Message);
            }
        }

        [HttpDelete]
        [Route("delete/{MovBancarioID}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> EliminarRegistro(int MovBancarioID)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            try
            {
                var res = await ConexionBD.database.ExecuteAsync("DELETE FROM Bancos.MovimientosBancarios WHERE MovBancarioID=@0", MovBancarioID);
                await ConexionBD.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("Error al elimnar el movimiento bancario: " + ex.Message);
            }
        }

    }
}