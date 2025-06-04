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
using DBContext.DBConfia.Creditos;

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
    public class CredCreditosController : ControllerBase
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
        public CredCreditosController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        // Obtenemos los balances
        [HttpGet]
        [Route("find-all")]
        [Authorize]
        public async Task<IActionResult> Obtener()
        {

            try
            {
                var res = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>().ToArray();
                await ConexionBD.Destroy();
                return Ok(res);

            }

            catch (Exception error)
            {
                await ConexionBD.Destroy();
                return BadRequest(error.Message);
            }
        }

        [HttpGet]
        [Route("find-by-id/{CreditoID}")]
        [Authorize]
        public async Task<IActionResult> ObtenerPorID(int CreditoID)
        {
            var creds = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Creditos.Creditos>();

            try
            {

                var result = creds.Where(w => w.CreditoID == CreditoID).SingleOrDefault();
                await ConexionBD.Destroy();
                return Ok(result);
            }

            catch (Exception error)
            {
                await ConexionBD.Destroy();
                return BadRequest(error.Message);
            }
        }

        /////PENDIENTE AVERIGUAR PARA QUE NECESITAN UN ID AL CREAR EL CREDITO
        [HttpPost]
        [Route("createsssss")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Agregar(PeticionesRest.SOMA.CatViviendaTipo.Add parData)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", usuarioActualEmail).FirstOrDefaultAsync();

            // Generamos el registro del tipo de movimiento
            var vivienda = new DBContext.DBConfia.Catalogos.ViviendasTipos()
            {
                ViviendaTipo = parData.ViviendaTipo,
                Activa = parData.Activa
            };
            try
            {
                await ConexionBD.database.InsertAsync(vivienda);
                // Regresamos el registro a la UI
                return Ok(vivienda);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
                //return BadRequest("Error al ingresar el tipo de movimiento al sistema: " + ex.Message);
            }
        }

        [HttpPut]
        [Route("update/{CreditoID}")]
        [Authorize]

        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Actualizar(PeticionesRest.SOMA.CredCreditos.Update parData, int CreditoID)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", usuarioActualEmail).FirstOrDefaultAsync();

            // Generamos el registro de bobeda
            var cr = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Creditos.Creditos>(CreditoID);

            try
            {
                // Actualizamos el registro
                cr.ContratoID = parData.ContratoID;
                cr.EstatusID = parData.EstatusID;
                cr.ClienteID = parData.ClienteID;
                cr.Plazos = parData.Plazos;
                cr.ProductoID = parData.ProductoID;
                cr.CondicionesID = parData.CondicionesID;
                cr.CondicionesRenglonId = parData.CondicionesRenglonId;
                cr.SucursalID = parData.SucursalID;
                cr.DistribuidorNivelID = parData.DistribuidorNivelID;
                cr.Capital = parData.Capital;
                cr.Interes = parData.Interes;
                cr.ManejoCuenta = parData.ManejoCuenta;
                cr.Seguro = parData.Seguro;
                cr.Cargo = parData.Cargo;
                cr.IVA = parData.IVA;
                cr.ImporteTotal = parData.ImporteTotal;
                cr.Abonos = parData.Abonos;
                cr.Comision = parData.Comision;
                cr.SaldoActual = parData.SaldoActual;
                cr.DiasAtraso = parData.DiasAtraso;
                cr.DiasAtrasoMaximo = parData.DiasAtrasoMaximo;
                cr.SaldoAtrasado = parData.SaldoAtrasado;
                cr.FechaHoraRegistro = parData.FechaHoraRegistro;
                cr.FechaHoraDesembolso = parData.FechaHoraDesembolso;
                cr.FechaHoraUltimoPago = parData.FechaHoraUltimoPago;
                cr.SerieId = parData.SerieId;
                cr.ValeCanje = parData.ValeCanje;
                cr.CapitalPagado = parData.CapitalPagado;
                cr.CapitalPendientes = parData.CapitalPendientes;
                cr.UsuarioIDRegistro = parData.UsuarioIDRegistro;
                cr.MovimientoID = parData.MovimientoID;
                cr.PagosAtrasados = parData.PagosAtrasados;
                cr.TipoDesembolsoID = parData.TipoDesembolsoID;
                cr.InteresPagado = parData.InteresPagado;
                cr.IVAPagado = parData.IVAPagado;
                cr.ManejoCuentaPagado = parData.ManejoCuentaPagado;
                cr.SeguroPagado = parData.SeguroPagado;
                cr.CargoPagado = parData.CargoPagado;
                cr.PorcCapital = parData.PorcCapital;
                cr.PorcInteres = parData.PorcInteres;
                cr.PorcManejoCuenta = parData.PorcManejoCuenta;
                cr.PorcCargo = parData.PorcCargo;
                cr.PorcIVA = parData.PorcIVA;
                cr.PorcSeguro = parData.Seguro;
                cr.MotivoCancelacionID = parData.MotivoCancelacionID;
                cr.TasaInteres = parData.TasaInteres;
                cr.TasaIVA = parData.TasaIVA;
                cr.CostoSeguroPlazo = parData.CostoSeguroPlazo;
                cr.DispersionID = parData.DispersionID;
                cr.PuedeDispersar = parData.PuedeDispersar;
                cr.CostoSeguroDistribuidorXMil = parData.CostoSeguroDistribuidorXMil;
                cr.PrimerVencimiento = parData.PrimerVencimiento;
                cr.UltimoVencimiento = parData.UltimoVencimiento;
                cr.PlazosAdicionales = parData.PlazosAdicionales;
                cr.FHGeneracionPlazosAdicionales = parData.FHGeneracionPlazosAdicionales;
                cr.LineaAdicionalTipoID = parData.LineaAdicionalTipoID;
                cr.referenciaMigracion = parData.referenciaMigracion;
                cr.creditoClasificacionId = parData.creditoClasificacionId;
                cr.fechaPP = parData.fechaPP;
                cr.primaSeguro = parData.primaSeguro;
                cr.capitalPendienteDisponible = parData.capitalPendienteDisponible;
                cr.fechaHoraActivacion = parData.fechaHoraActivacion;
                cr.pagoModa = parData.pagoModa;
                cr.PersonaIDRegistro = parData.PersonaIDRegistro;
                cr.Reestructura = parData.Reestructura;
                cr.ReestructuraCreditoID = parData.ReestructuraCreditoID;

                // Ingresamos la bobeda a la bd
                await ConexionBD.database.UpdateAsync(cr);

                // Regresamos el registro a la UI
                await ConexionBD.Destroy();
                return Ok(cr);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("Error al actualizar el sexo: " + ex.Message);
            }
        }


        [HttpPost]
        [Route("update/{CreditoID}/persona/{PersonaID}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> ActualizarPersonaCredito(int CreditoID, int PersonaID)
        {
            var per = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.General.Personas>(PersonaID);

            try
            {
                var cr = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Creditos.Creditos>(CreditoID);

                cr.PersonaIDRegistro = per.PersonaID;
                await ConexionBD.database.UpdateAsync(cr);
                await ConexionBD.Destroy();
                return Ok(cr);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("Error al actualizar el registro, persona no existe?: " + ex.Message);
            }
        }

        [HttpDelete]
        [Route("delete/{CreditoID}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> EliminarRegistro(int CreditoID)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", usuarioActualEmail).FirstOrDefaultAsync();

            //var agrupacion = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Tesoreria.CatalogoDenomEfectivo>(CatDenomEfectivoID);
            try
            {
                // Eliminamos el registro
                await ConexionBD.database.ExecuteAsync("DELETE FROM Creditos.Creditos WHERE Credito=@0", CreditoID);
                await ConexionBD.Destroy();
                return Ok(true);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("Error al elimnar el credito: " + ex.Message);
            }
        }

    }
}
