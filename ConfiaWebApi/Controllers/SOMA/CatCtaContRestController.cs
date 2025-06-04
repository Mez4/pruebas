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
using DBContext.DBConfia.Seguridad;
using DBContext.DBConfia.dbo;

using System.Net.Http;
using System.Collections.Generic;
using System.Text.Json;
using System.Collections;
using ConfiaWebApi.Code;

namespace ConfiaWebApi.Controllers.Sistema
{
    [Authorize]
    [ApiController]
    [Route("api/SOMA/[controller]")]
    public class CatCtaContRest : ControllerBase
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
        public CatCtaContRest(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpGet]
        [Route("cuentas-contables-boveda-disponible")]
        [Authorize]
        public async Task<IActionResult> GetCuentasParaBoveda()
        {
            var res = await DBContext.database.FetchAsync<CuentasPBovedaDisponibles_VW>();
            await DBContext.Destroy();
            return Ok(res);

        }


        [HttpGet]
        [Route("cuentas-contables2")]
        [Authorize]
        public async Task<IActionResult> GetSelect()
        {
            var res1 = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.CuentasContables>();
            await DBContext.Destroy();
            return Ok(res1);

        }

        [HttpGet]
        [Route("cuentas-contables-dispersan")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetSelectDispersan()
        {
            var res2 = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CuentasContables>("WHERE Dispersa = 1").ToArrayAsync();
            await DBContext.Destroy();
            return Ok(res2);

        }


        [HttpGet]
        [Route("cuentas-contables")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ListarCuentas()
        {
            var ctasContables = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CuentasContables>("WHERE Activa=1").ToArrayAsync();

            try
            {

                var cuentasContables = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.CuentasContables_VW>();
                await DBContext.Destroy();
                return Ok(cuentasContables);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("cuentas-contables/{CuentaID}")]
        [Authorize]
        public async Task<IActionResult> ObtenerTodosActivos(int CuentaID)
        {
            var T = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CuentasContables>("WHERE CuentaID=@0", CuentaID).SingleOrDefaultAsync();
            var vTipoCuenta = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.TipoCuenta>();
            var vNaturaleza = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.Naturaleza>();
            var vRubro = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.Rubro>();
            var vEmpresas = await DBContext.database.FetchAsync<DBContext.DBConfia.General.Empresas>();
            var vMoneda = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.MonedaSAT>();
            var vBancosTipo = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.CatalogoTipoBanco>();
            ArrayList res = new();

            try
            {

                res.Add(new
                {
                    id = T.CuentaID,
                    cuenta = T.Cuenta,
                    nombre = T.Nombre,
                    acumulaCuenta = T.AcumulaCuentaID,
                    tipoCuenta = vTipoCuenta.Where(ws => ws.TipoID == T.TipoID).Select(sc => new
                    {
                        id = sc.TipoID,
                        descripcion = sc.Descripcion
                    }).SingleOrDefault(),
                    naturaleza = vNaturaleza.Where(ws => ws.NaturalezaID == T.NaturalezaID).Select(sc => new
                    {
                        id = sc.NaturalezaID,
                        descripcion = sc.Descripcion,
                    }).SingleOrDefault(),
                    rubro = vRubro.Where(ws => ws.RubroID == T.RubroID).Select(sc => new
                    {
                        id = sc.RubroID,
                        descripcion = sc.Descripcion,
                    }).SingleOrDefault(),
                    empresa = vEmpresas.Where(ws => ws.empresaId == T.EmpresaID).Select(sc => new
                    {
                        id = sc.empresaId,
                        descripcion = sc.empresaNombre,
                    }).SingleOrDefault(),
                    monedaSat = vMoneda.Where(ws => ws.MonedaSatID == T.CatMonedaSatID).Select(sc => new
                    {
                        id = sc.MonedaSatID,
                        descripcion = sc.NombreMoneda,
                    }).SingleOrDefault(),
                    activa = T.Activa,
                    fechaRegistro = T.FechaRegistro,
                    tipoBanco = vBancosTipo.Where(ws => ws.TipoBancoId == T.TipoBancoId).Select(sc => new
                    {
                        tipoBancoID = sc.TipoBancoId,
                        descripcion = sc.Descripcion
                    }).SingleOrDefault()
                });

                await DBContext.Destroy();
                return Ok(res);


            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("cuentas-contables")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Agregar(PeticionesRest.SOMA.CuentasContables.Add parData)
        {
            //var Cajas = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.CatalogoCajas>();
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();
            //var Bancos = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.CatalogoBancos>();

            //Se genera el registro de la cta cont
            var CuentaContable = new DBContext.DBConfia.Tesoreria.CuentasContables()
            {
                Cuenta = parData.Cuenta,
                AcumulaCuentaID = parData.AcumulaCuentaID,
                Nombre = parData.Nombre,
                TipoID = parData.TipoID,
                NaturalezaID = parData.NaturalezaID,
                RubroID = parData.RubroID,
                EmpresaID = parData.EmpresaID,
                CatMonedaSatID = parData.CatMonedaSatID,
                Activa = parData.Activa,
                FechaRegistro = parData.FechaRegistro,
                TipoBancoId = parData.TipoBancoId,
                SucursalID = parData.SucursalID
            };

            try
            {
                await DBContext.database.InsertAsync(CuentaContable);
                await DBContext.Destroy();
                return Ok(CuentaContable);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest("Error al agregar el registro en el sistema: " + ex.Message);
            }
        }

        [HttpPut]
        [Route("cuentas-contables/{CuentaID}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Actualizar(PeticionesRest.SOMA.CuentasContables.Update parData, int CuentaID)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            // Generamos el registro de caja
            var cuenta = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Tesoreria.CuentasContables>(CuentaID);
            try
            {
                cuenta.Cuenta = parData.Cuenta;
                cuenta.AcumulaCuentaID = parData.AcumulaCuentaID;
                cuenta.Nombre = parData.Nombre;
                cuenta.TipoID = parData.TipoID;
                cuenta.NaturalezaID = parData.NaturalezaID;
                cuenta.RubroID = parData.RubroID;
                cuenta.EmpresaID = parData.EmpresaID;
                cuenta.CatMonedaSatID = parData.CatMonedaSatID;
                cuenta.Activa = parData.Activa;
                cuenta.FechaRegistro = parData.FechaRegistro;
                cuenta.TipoBancoId = parData.TipoBancoId;
                if (parData.SucursalID != -1)
                {
                    cuenta.SucursalID = parData.SucursalID;
                }

                // Ingresamos la caja a la bd
                await DBContext.database.UpdateAsync(cuenta);
                await DBContext.Destroy();
                // Regresamos el registro a la UI
                return Ok(cuenta);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest("Error al actualizar el registro en el sistema: " + ex.Message);
            }
        }


        [HttpDelete]
        [Route("cuentas-contables/{CuentaID}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> EliminarRegistroCta(int CuentaID)
        {
            // Obtenemos el email del usuario de los claims
            /*  var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
             var usuarioActual = await DBContext.database.QueryAsync<PersonasUsuarios_VW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();
  */
            var dispersion = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Tesoreria.CuentasContables>(CuentaID);
            try
            {
                // Eliminamos el registro
                await DBContext.database.ExecuteAsync("DELETE FROM Tesoreria.CuentasContables WHERE CuentaID=@0", CuentaID);
                await DBContext.Destroy();
                return Ok(true);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest("Error al elimnar la cuenta contable: " + ex.Message);
            }
        }


        [HttpGet]
        [Route("cuentas-contables/cuentas")]
        [Authorize]
        [Code.TProteccionProducto]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> ObtenerCuentasContables()
        {


            try
            {
                var cuentas = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.CuentasContables>();
                /*    var TipoID = 2;
                   var result = cuentas.Where(r => r.TipoID == TipoID).Select(sc => new
                   {
                       id = sc.CuentaID,
                       cuenta = sc.Cuenta,
                       nombre = sc.Nombre,
                       tipoId = sc.TipoID,
                       tipoBancoId = sc.TipoBancoId
                   }).ToArray(); */
                await DBContext.Destroy();
                return Ok(cuentas);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpGet]
        [Route("cuentas-contables/acumula")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> ObtenerAcumulaCuenta()
        {


            var cuentas = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.CuentasContables>();
            try
            {

                var TipoID = 2;
                var result = cuentas.Where(r => r.TipoID == TipoID).Select(sc => new
                {
                    id = sc.CuentaID,
                    nombre = sc.Nombre
                });
                await DBContext.Destroy();
                return Ok(result);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }

        }


        [HttpGet]
        [Route("cuentas-contables/empresas")]
        [Authorize]
        [Code.TProteccionProducto]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> ObtenerEmpresas()
        {

            //var empresas = await DBContext.database.FetchAsync<DBContext.DBConfia.General.Empresas>();

            try
            {
                var Empresas = await DBContext.database.FetchAsync<DBContext.DBConfia.General.Empresas>();
                var res = Empresas.Select(sc => new
                {
                    id = sc.empresaId,
                    nombre = sc.empresaNombre,
                    rfc = sc.empresaRfc,
                    dirFiscal = sc.empresaDireccionFiscal,
                    regPatronal = sc.empresaRegistroPatronal,
                    razonSocial = sc.empresaRazonSocial
                }).ToArray();
                await DBContext.Destroy();
                return Ok(res);


            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpGet]
        [Route("cuentas-contables/monedas")]
        [Authorize]
        [Code.TProteccionProducto]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> ObtenerMonedas()
        {

            //var empresas = await DBContext.database.FetchAsync<DBContext.DBConfia.General.Empresas>();

            try
            {
                var monedas = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.MonedaSAT>();
                var res = monedas.Select(sc => new
                {
                    monedaId = sc.MonedaSatID,
                    nombreMoneda = sc.NombreMoneda,
                    tipoCambio = sc.TipoCambio,
                    fecha = sc.Fecha,
                    cveMonedaSat = sc.ClaveMonedaSat,
                }).ToArray();
                await DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }

        }
        [HttpGet]
        [Route("cuentas-contables/naturalezas")]
        [Authorize]
        [Code.TProteccionProducto]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> ObtenerNaturalezas()
        {

            //var empresas = await DBContext.database.FetchAsync<DBContext.DBConfia.General.Empresas>();

            try
            {
                var naturalezas = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.Naturaleza>();
                var res = naturalezas.Select(sc => new
                {
                    id = sc.NaturalezaID,
                    descripcion = sc.Descripcion

                }).ToArray();
                await DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpGet]
        [Route("cuentas-contables/naturalezas2")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> CatalogoNaturalezas()
        {

            //var empresas = await DBContext.database.FetchAsync<DBContext.DBConfia.General.Empresas>();

            try
            {
                var naturalezas = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.Naturaleza>();
                await DBContext.Destroy();
                return Ok(naturalezas);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpGet]
        [Route("cuentas-contables/rubros")]
        [Authorize]
        [Code.TProteccionProducto]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> ObtenerRubros()
        {

            //var empresas = await DBContext.database.FetchAsync<DBContext.DBConfia.General.Empresas>();

            try
            {
                var rubros = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.Rubro>();
                var res = rubros.Select(sc => new
                {
                    id = sc.RubroID,
                    descripcion = sc.Descripcion
                }).ToArray();
                await DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpGet]
        [Route("cuentas-contables/tipo-cuentas")]
        [Authorize]
        [Code.TProteccionProducto]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> ObtenerTipoCuentas()
        {

            //var empresas = await DBContext.database.FetchAsync<DBContext.DBConfia.General.Empresas>();

            try
            {
                var rubros = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.TipoCuenta>();
                var res = rubros.Select(sc => new
                {
                    id = sc.TipoID,
                    descripcion = sc.Descripcion
                }).ToArray();
                await DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }

        }
        [HttpGet]
        [Route("cuentas-contables/cuentas/{TipoBancoId}")]
        [Authorize]
        [Code.TProteccionProducto]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> ObtenerCuentaId(int TipoBancoId)
        {

            //var empresas = await DBContext.database.FetchAsync<DBContext.DBConfia.General.Empresas>();
            try
            {
                var cuentas = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.CuentasContables>();
                await DBContext.Destroy();
                // var result = cuentas.Where(r => r.TipoBancoId == TipoBancoId).Select(sc => new { id = sc.CuentaID, cuenta = sc.Cuenta, nombre = sc.Nombre, tipoId = sc.TipoID, tipoBancoId = sc.TipoBancoId, sucursalID = sc.SucursalID }).ToArray();
                return Ok(cuentas);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpGet]
        [Route("cajas/{sucursalID}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> ObtenerCajas(int sucursalID)
        {

            //var empresas = await DBContext.database.FetchAsync<DBContext.DBConfia.General.Empresas>();
            try
            {

                var cuentas = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CatalogoCajas>("WHERE SucursalID=@0", sucursalID).ToArrayAsync();
                var cuentas2 = cuentas.Select(sc => new { value = sc.CajaID, label = sc.Descripcion }).ToArray();

                var sucursal = await DBContext.database.QueryAsync<DBContext.DBConfia.General.Sucursales>("WHERE SucursalID=@0", sucursalID).SingleOrDefaultAsync();

                var res = new
                {
                    sucursal = sucursal.Nombre,
                    cajas = cuentas2
                };
                await DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

    }
}