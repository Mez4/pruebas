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
    public class CatTiposMovimientosRestController : ControllerBase
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
        public CatTiposMovimientosRestController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        // Obtenemos los balances
        [HttpGet]
        [Route("show")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Obtener()
        {

            try
            {
                var tiposMovs = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.TiposMovs_VW>();
                await DBContext.Destroy();
                return Ok(tiposMovs);
            }
            catch (Exception error)
            {
                await DBContext.Destroy();
                return BadRequest(error.Message);
            }

        }

        [HttpGet]
        [Route("show-activo")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerActivos()
        {
            try
            {
                var activo = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.TiposMovsActivos_VW>();
                await DBContext.Destroy();
                return Ok(activo);
            }
            catch (Exception error)
            {
                await DBContext.Destroy();
                return BadRequest(error.Message);
            }
        }


        [HttpGet]
        [Route("tipo-movimiento")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerCatMovs()
        {
            try
            {
                var movsAgrupa = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.MovimientosAgrupa>();
                var res = movsAgrupa.Select(mv => new
                {
                    movAgrupaId = mv.MovAgrupaId,
                    clave = mv.Clave,
                    nombre = mv.Nombre,
                    estatus = mv.Estatus
                }).ToArray();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception error)
            {
                await DBContext.Destroy();
                return BadRequest(error.Message);
            }
        }
        [HttpGet]
        [Route("corresponsal-pago")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerCorresponsales()
        {
            try
            {
                var corresponsales = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.CorresponsalesPago>();
                var res = corresponsales.Select(mv => new
                {
                    corresponsalId = mv.CorresponsalId,
                    corresponsalDesc = mv.CorresponsalDesc,
                    comision = mv.comision,
                    ordenEnTabla = mv.ordenEnTabla,
                    mostrarEnTabla = mv.mostrarEnTabla,
                    montoMaximoPago = mv.montoMaximoPago
                }).ToArray();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception error)
            {
                await DBContext.Destroy();
                return BadRequest(error.Message);
            }
        }

        [HttpGet]
        [Route("gastos-rubro")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerRubros()
        {
            try
            {
                var rubros = await DBContext.database.FetchAsync<DBContext.DBConfia.Catalogos.GastosRubros>();
                var res = rubros.Select(mv => new
                {
                    gastosRubroID = mv.gastosRubroID,
                    gastosRubroDesc = mv.gastosRubroDesc,
                    activo = mv.activo
                }).ToArray();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception error)
            {
                await DBContext.Destroy();
                return BadRequest(error.Message);
            }
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Agregar(PeticionesRest.SOMA.CatTiposMovimientosRest.Add parData)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            // Generamos el registro del tipo de movimiento
            var tipoMovs = new DBContext.DBConfia.Bancos.TiposMovimientos()
            {
                CveMovimientoID = parData.CveMovimientoID,
                TipoMovimiento = parData.TipoMovimiento,
                Cargo = parData.Cargo,
                AceptaDepositos = parData.AceptaDepositos,
                AceptaRetiros = parData.AceptaRetiros,
                Activa = parData.Activa,
                MovAgrupaID = parData.MovAgrupaID,
                ManejaEfectivo = parData.ManejaEfectivo
            };

            try
            {
                await DBContext.database.InsertAsync(tipoMovs);

                var tipoMov = await DBContext.database.SingleOrDefaultAsync<DBContext.DBConfia.Bancos.TiposMovs_VW>("WHERE CveMovimientoID=@0", parData.CveMovimientoID);

                await DBContext.Destroy();
                // Regresamos el registro a la UI
                return Ok(tipoMov);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
                //return BadRequest("Error al ingresar el tipo de movimiento al sistema: " + ex.Message);
            }
        }


        //Método para actualizar una denominación
        [HttpPut]
        [Route("update/{Id}")]
        [Authorize]
        [Code.TProteccionProducto]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Actualizar(PeticionesRest.SOMA.CatTiposMovimientosRest.Update parData, int Id)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            // Generamos el registro de bobeda
            var tipoMov = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Bancos.TiposMovimientos>(Id);

            try
            {
                tipoMov.CveMovimientoID = parData.CveMovimientoID;
                tipoMov.TipoMovimiento = parData.TipoMovimiento;
                tipoMov.Cargo = parData.Cargo;
                tipoMov.AceptaDepositos = parData.AceptaDepositos;
                tipoMov.AceptaRetiros = parData.AceptaRetiros;
                tipoMov.Activa = parData.Activa;
                tipoMov.MovAgrupaID = parData.MovAgrupaID;
                tipoMov.ManejaEfectivo = parData.ManejaEfectivo;
                await DBContext.database.UpdateAsync(tipoMov);
                await DBContext.Destroy();
                // Regresamos el registro a la UI
                return Ok(tipoMov);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest("Error al actualizar el registro: " + ex.Message);
            }
        }

        [HttpDelete]
        [Route("delete/{SexoID}")]
        [Authorize]
        [Code.TProteccionProducto]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> EliminarRegistro(string SexoID)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            //var agrupacion = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Tesoreria.CatalogoDenomEfectivo>(CatDenomEfectivoID);
            try
            {
                // Eliminamos el registro
                await DBContext.database.ExecuteAsync("DELETE FROM Catalogos.Sexos WHERE SexoID=@0", SexoID);
                await DBContext.Destroy();
                return Ok(true);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest("Error al elimnar el sexo: " + ex.Message);
            }
        }


    }
}