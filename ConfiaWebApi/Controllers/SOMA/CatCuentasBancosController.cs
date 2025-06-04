using System.Data.Common;
using System.Net;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using DBContext.DBConfia.Catalogos;

using DBContext.DBConfia;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Bancos;
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
    public class CatCuentasBancosController : ControllerBase
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
        public CatCuentasBancosController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }
        [HttpGet]
        [Route("cuentaCobranzaSucursal")]
        [Authorize]
        public async Task<IActionResult> CuentasCobranzaSucursal()
        {
            try
            {
                var cuentaCobranzaSucursal = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.CuentaNominaSucursal_VW>();
                await DBContext.Destroy();
                return Ok(cuentaCobranzaSucursal);
            }
            catch (Exception error)
            {
                await DBContext.Destroy();
                return BadRequest(error.Message);
            }
        }

        [HttpGet]
        [Route("tipos-cuentasbancos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerTiposCuenta()
        {
            try
            {
                var res = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.TiposCuentaBancarias>();
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
        [Route("bancos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerBancos()
        {
            try
            {
                var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Bancos.CatalogoBancos>("WHERE Activo = 1").ToArrayAsync();
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
        [Route("cuentas")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> cuentas()
        {
            try
            {
                var res = await DBContext.database.QueryAsync<CatalogoCuentasBancos>("WHERE  Activo=1 Order By NumeroCuenta").ToArrayAsync();
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
        [Route("movimientos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> movimientos()
        {
            try
            {
                var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.MovCargosAbonos>("Select Top 10 * From Tesoreria.MovCargosAbonos Where TipoMovimientoID IN (40,60) Order by MovimientoID Desc").ToArrayAsync();
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
        [Route("cuentas-bancarias-principal")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerPrincipales()
        {
            try
            {
                var res = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.CuentasBancariasPrincipal_VW>();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
        [HttpPost]
        [Route("agregar-movimiento")]
        [Authorize]
        public async Task<IActionResult> Agregarmovimiento(PeticionesRest.SOMA.CuentasBancariasPrincipal.AddMovimiento parData)
        {
            try
            {

                var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
                var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();
                var periodo = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.Periodo2>("SELECT TOP 1 * FROM Tesoreria.Periodo2 ORDER BY FechaApertura DESC").SingleOrDefaultAsync();
                var sucursal = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CatalogoCajas>("Where CuentaID =@0", parData.CatalogoCuentaID).SingleOrDefaultAsync();
                var boveda = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CatalogoBoveda>("Where CuentaID =@0", parData.CatalogoCuentaID).SingleOrDefaultAsync();

                if (parData.CargoAbono == true)
                {
                    DBContext.database.BeginTransaction();
                    var CuentaPrincipal = new DBContext.DBConfia.Bancos.Movimientos()
                    {
                        CuentaID = parData.CatalogoCuentaID,
                        SucursalId = 2,
                        FechaAfectacion = DateTime.Now,
                        FechaCaptura = DateTime.Now,
                        Importe = parData.Monto,
                        TipoMovimientoID = 40,
                        Observaciones = parData.Observaciones != null ? parData.Observaciones : "Sin Observaciones",
                        ProductoId = 38,
                        Estatus = "A",
                        PersonaIDRegistro = usuarioActual.PersonaID,
                        PeriodoID = periodo.PeriodoID,
                        CatEstatusMovID = 1,
                        UsuarioIDRegistra = usuarioActual.UsuarioID,

                    };
                    await DBContext.database.InsertAsync(CuentaPrincipal);
                    DBContext.database.CompleteTransaction();
                    var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Bancos.Movimientos>("WHERE MovimientoID = @0", CuentaPrincipal.MovimientoID).SingleOrDefaultAsync();
                    await DBContext.Destroy();
                    return Ok(res);
                }
                else
                {
                    DBContext.database.BeginTransaction();
                    var CuentaPrincipal = new DBContext.DBConfia.Bancos.Movimientos()
                    {
                        CuentaID = parData.CatalogoCuentaID,
                        SucursalId = 2,
                        FechaAfectacion = DateTime.Now,
                        FechaCaptura = DateTime.Now,
                        Importe = parData.Monto * -1,
                        TipoMovimientoID = 60,
                        Observaciones = parData.Observaciones != null ? parData.Observaciones : "Sin Observaciones",
                        ProductoId = 38,
                        Estatus = "A",
                        PersonaIDRegistro = usuarioActual.PersonaID,
                        PeriodoID = periodo.PeriodoID,
                        CatEstatusMovID = 1,
                        UsuarioIDRegistra = usuarioActual.UsuarioID,

                    };
                    await DBContext.database.InsertAsync(CuentaPrincipal);
                    DBContext.database.CompleteTransaction();
                    var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Bancos.Movimientos>("WHERE MovimientoID = @0", CuentaPrincipal.MovimientoID).SingleOrDefaultAsync();
                    await DBContext.Destroy();
                    return Ok(res);
                }

            }
            catch (Exception ex)
            {
                DBContext.database.AbortTransaction();
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("agregar-cuentas-bancarias-principal")]
        [Authorize]
        public async Task<IActionResult> AgregarCuentasPrincipal(PeticionesRest.SOMA.CuentasBancariasPrincipal.Add parData)
        {
            try
            {
                DBContext.database.BeginTransaction();
                var CuentaPrincipal = new DBContext.DBConfia.Bancos.CuentasBancariasPrincipal()
                {
                    NumeroCuenta = parData.NumeroCuenta,
                    EsReal = parData.EsReal,
                    BancoID = parData.BancoID,
                    Activa = parData.Activa,
                    TipoCuentaBancoID = parData.TipoCuentaBancoID,
                    DescripcionCuenta = parData.DescripcionCuenta,
                };
                await DBContext.database.InsertAsync(CuentaPrincipal);
                DBContext.database.CompleteTransaction();
                var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Bancos.CuentasBancariasPrincipal_VW>("WHERE CuentaBancariaPrincipalID = @0", CuentaPrincipal.CuentaBancariaPrincipalID).SingleOrDefaultAsync();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                DBContext.database.AbortTransaction();
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetUltMov")]
        [Authorize]
        public async Task<IActionResult> GetUltMov(PeticionesRest.SOMA.CuentasBancariasPrincipal.Add parData)
        {
            try
            {
                var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Bancos.AbonosCargosCuentas>().ToArray();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                DBContext.database.AbortTransaction();
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("actualizar-cuentas-bancarias-principal")]
        [Authorize]
        public async Task<IActionResult> ActualizarCuentasPrincipal(PeticionesRest.SOMA.CuentasBancariasPrincipal.Add parData)
        {
            try
            {
                DBContext.database.BeginTransaction();

                var cuenta = await DBContext.database.QueryAsync<DBContext.DBConfia.Bancos.CuentasBancariasPrincipal>("WHERE CuentaBancariaPrincipalID = @0", parData.CuentaBancariaPrincipalID).SingleOrDefaultAsync();

                cuenta.NumeroCuenta = parData.NumeroCuenta;
                cuenta.EsReal = parData.EsReal;
                cuenta.BancoID = parData.BancoID;
                cuenta.Activa = parData.Activa;
                cuenta.TipoCuentaBancoID = parData.TipoCuentaBancoID;
                cuenta.DescripcionCuenta = parData.DescripcionCuenta;

                await DBContext.database.UpdateAsync(cuenta);

                DBContext.database.CompleteTransaction();

                var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Bancos.CuentasBancariasPrincipal_VW>("WHERE CuentaBancariaPrincipalID = @0", cuenta.CuentaBancariaPrincipalID).SingleOrDefaultAsync();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                DBContext.database.AbortTransaction();
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }



        [HttpPost]
        [Route("agregar-cuentas")]
        [Authorize]
        public async Task<IActionResult> AgregarCuentas(PeticionesRest.SOMA.CajaTipoOperacion.AgregarCuentas parData)
        {
            try
            {
                DBContext.database.BeginTransaction();
                if (parData.CajaID != 0)
                {
                    foreach (var item in parData.CuentasCaja)
                    {
                        if (item.Estatus == 3)
                        {
                            var CuentasCaja = new DBContext.DBConfia.Tesoreria.CuentasCaja()
                            {
                                CajaId = parData.CajaID,
                                CuentaBancoId = item.CuentaBancoID,
                                Disponible = true
                            };
                            await DBContext.database.InsertAsync(CuentasCaja);
                        }
                    }
                }
                DBContext.database.CompleteTransaction();
                await DBContext.Destroy();
                return Ok();

            }
            catch (Exception ex)
            {
                DBContext.database.AbortTransaction();
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("actualizar-cuentas")]
        [Authorize]
        public async Task<IActionResult> ActualizarCuentas(PeticionesRest.SOMA.CajaTipoOperacion.AgregarCuentas parData)
        {
            try
            {
                if (parData.CajaID != 0)
                {
                    foreach (var item in parData.CuentasCaja)
                    {
                        DBContext.database.BeginTransaction();
                        if (item.Estatus == 3)
                        {
                            var CuentasCaja = new DBContext.DBConfia.Tesoreria.CuentasCaja()
                            {
                                CajaId = parData.CajaID,
                                CuentaBancoId = item.CuentaBancoID,
                                Disponible = true

                            };
                            await DBContext.database.InsertAsync(CuentasCaja);
                        }
                        if (item.Estatus == 2)
                        {
                            var registros_movimientos = await DBContext.database.QueryAsync<DBContext.DBConfia.Bancos.Movimientos>("WHERE CuentaID=@0", item.CuentaBancoID).ToArrayAsync();
                            if (registros_movimientos.Length == 0)
                            {
                                var registro_caja_tipo = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CajaTipoOperacion>("WHERE CuentaBancoId=@0 AND CajaID=@1", item.CuentaBancoID, parData.CajaID).SingleOrDefaultAsync();

                                if (registro_caja_tipo == null)
                                {
                                    var registro = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CuentasCaja>("WHERE CuentaBancoId=@0 AND CajaId=@1", item.CuentaBancoID, parData.CajaID).SingleOrDefaultAsync();
                                    if (registro != null)
                                    {
                                        await DBContext.database.DeleteAsync(registro);
                                    }
                                    else
                                    {
                                        DBContext.database.AbortTransaction();
                                        await DBContext.Destroy();
                                        return BadRequest();
                                    }
                                }
                                else
                                {
                                    var cuenta_error = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Bancos.CatalogoCuentasBancos>(item.CuentaBancoID);
                                    DBContext.database.AbortTransaction();
                                    await DBContext.Destroy();
                                    return StatusCode(206, new
                                    {
                                        data = "No es posible desligar la cuenta [" + cuenta_error.CuentaBancoID + " : " + cuenta_error.NumeroCuenta + "], la cuenta se encuentra en una operación."
                                    });
                                }
                            }
                            else
                            {
                                var cuenta_error = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Bancos.CatalogoCuentasBancos>(item.CuentaBancoID);
                                DBContext.database.AbortTransaction();
                                await DBContext.Destroy();
                                return StatusCode(206, new
                                {
                                    data = "No es posible desligar la cuenta [" + cuenta_error.CuentaBancoID + " : " + cuenta_error.NumeroCuenta + "], la cuenta registra movimientos."
                                });
                            }
                        }
                        DBContext.database.CompleteTransaction();
                        await DBContext.Destroy();
                    }
                }
                await DBContext.Destroy();
                return StatusCode(200, new
                {
                    data = "Cambios guardados correctamente"
                });
            }
            catch (Exception ex)
            {
                DBContext.database.AbortTransaction();
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        [Route("cuentas-pcaja")]
        [Authorize]
        public async Task<IActionResult> CuentasPorCaja()
        {
            try
            {
                var cajas = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CuentasAsignadasCaja_VW>("	SELECT DISTINCT CajaID, NombreCaja, SucursalID FROM Tesoreria.CuentasAsignadasCaja_VW vw").ToArrayAsync();
                ArrayList res = new();
                foreach (var item in cajas)
                {
                    res.Add(new
                    {
                        CajaID = item.CajaId,
                        NombreCaja = item.NombreCaja,
                        NumeroCuentas = (await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CuentasAsignadasCaja_VW>("WHERE CajaID=@0", item.CajaId).CountAsync()),
                        SucursalID = item.SucursalID,
                        Cuentas = (await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CuentasAsignadasCaja_VW>("WHERE CajaID=@0", item.CajaId).ToArrayAsync())
                    });

                }
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
        [Route("cuentas-disponibles-pasignar/{SucursalID}")]
        [Authorize]
        public async Task<IActionResult> CuentasDisponibles(int SucursalID)
        {
            try
            {
                var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CuentasBancoDisponibles_VW>("WHERE SucursalID=@0 AND EsBoveda = 0", SucursalID).ToArrayAsync();
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
        [Route("cajas-scuenta")]
        [Authorize]
        public async Task<IActionResult> CajasSinCuentas()
        {
            try
            {
                var res = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.CajasActivasSinCuentas_VW>();

                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }



        [HttpPost]
        [Route("actualizar-producto")]
        [Authorize]
        public async Task<IActionResult> ActualizarProducto(PeticionesRest.SOMA.CatalogoCuentasBancos.ActualizarProductoCuenta parData)
        {
            try
            {
                var cuentaSeleccionada = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Bancos.CatalogoCuentasBancos>(parData.CuentaBancoID);
                var registrosMovs = await DBContext.database.QueryAsync<DBContext.DBConfia.Bancos.Movimientos>("WHERE CuentaID=@0", parData.CuentaBancoID).ToArrayAsync();

                if (registrosMovs.Length == 0)
                {
                    DBContext.database.BeginTransaction();
                    cuentaSeleccionada.ProductoID = parData.ProductoID;
                    await DBContext.database.UpdateAsync(cuentaSeleccionada);
                    DBContext.database.CompleteTransaction();
                    var producto = DBContext.database.SingleById<DBContext.DBConfia.Creditos.Productos>(parData.ProductoID);
                    var res = new
                    {
                        estatus = 1,
                        cuentaBancoID = cuentaSeleccionada.CuentaBancoID,
                        producto = producto,
                    };
                    await DBContext.Destroy();
                    return Ok(res);
                }
                var res2 = new
                {
                    estatus = 2,
                    mensaje = "No se puede cambiar, existen movimientos"

                };
                await DBContext.Destroy();
                return Ok(res2);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpGet]
        [Route("find-all")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ListarCuentas()
        {
            try
            {
                var res = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.CatalogoCuentasBancos_VW>();
                await DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet]
        [Route("cuentas-pbovedas")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> CuentasBancosActivasBovedas()
        {
            try
            {
                var res2 = await DBContext.database.QueryAsync<DBContext.DBConfia.Bancos.CatalogoCuentasBancos_VW>("WHERE Activo=1 AND EsBoveda=1 AND Disponible = 1").ToArrayAsync();
                await DBContext.Destroy();
                return Ok(res2);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("activas")]
        [Authorize]
        public async Task<IActionResult> CuentasBancosActivas()
        {
            try
            {
                var res3 = await DBContext.database.QueryAsync<DBContext.DBConfia.Bancos.CatalogoCuentasBancos_VW>("WHERE Activo=1").ToArrayAsync();
                await DBContext.Destroy();
                return Ok(res3);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("find-all-active")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ListarCuentasActivas()
        {
            //var empresas = await DBContext.database.FetchAsync<DBContext.DBConfia.General.Empresas>();
            var ctasBancos = await DBContext.database.QueryAsync<DBContext.DBConfia.Bancos.CatalogoCuentasBancos>("WHERE Activo=1").ToArrayAsync();
            var vCtasContables = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.CuentasContables>();
            var vBancos = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.CatalogoBancos>();
            var vBancosTipo = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.CatalogoTipoBanco>();
            var vDispersion = await DBContext.database.FetchAsync<DBContext.DBConfia.Catalogos.TipoArchivoDispersion>();
            var vAgrupaciones = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.Agrupaciones>();

            ArrayList res = new();
            try
            {
                foreach (var T in ctasBancos)
                {
                    res.Add(new
                    {
                        cuentaBancoID = T.CuentaBancoID,
                        numeroCuenta = T.NumeroCuenta,
                        descripcionCuenta = T.DescripcionCuenta,
                        cuentaID = vCtasContables.Select(sc => new
                        {
                            id = sc.CuentaID,
                            cuenta = sc.Cuenta,
                            nombre = sc.Nombre,
                            activa = sc.Activa,
                            fechaRegistro = sc.FechaRegistro,
                            tipoBanco = vBancosTipo.Where(ws => ws.TipoBancoId == sc.TipoBancoId).Select(sel => new { tipoBancoID = sel.TipoBancoId, descripcion = sel.Descripcion }).SingleOrDefault()
                        }).Where(ws => ws.id == T.CuentaID).SingleOrDefault(),
                        bancoID = vBancos.Where(we => we.BancoID == T.BancoID).Select(selc => new
                        {
                            bancoID = selc.BancoID,
                            nombre = selc.Nombre,
                            activo = selc.Activo,
                            archivoDispersion = vDispersion.Where(we => we.ArchivoDispersionID == selc.ArchivoDispersionID).Select(sel2 => new
                            {
                                archivoDispersionID = sel2.ArchivoDispersionID,
                                clave = sel2.Clave,
                                descripcion = sel2.Descripcion
                            }).SingleOrDefault(),
                            tipoBanco = vBancosTipo.Where(we => we.TipoBancoId == selc.TipoBancoId).Select(s3 => new
                            {
                                tipoBancoID = s3.TipoBancoId,
                                descripcion = s3.Descripcion
                            }).SingleOrDefault()
                        }).SingleOrDefault(),
                        activo = T.Activo,
                        dispersionConvenio = T.DispersionConvenio,
                        cobranzaConvenio = T.CobranzaConvenio,
                        global = T.Global,
                        puedeDispersar = T.PuedeDispersar,
                        saldoMin = T.SaldoMinimo,
                        saldoMax = T.SaldoMaximo,
                        excedenteSaldo = T.ExcedenteSaldo,

                    });
                }
                await DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpGet]
        [Route("find-by-bank/{CuentaBancoID}")]
        [Authorize]
        public async Task<IActionResult> ObtenerPorId(int CuentaBancoID)
        {
            var ctasBancos = await DBContext.database.QueryAsync<DBContext.DBConfia.Bancos.CatalogoCuentasBancos>("WHERE BancoID =@0", CuentaBancoID).ToArrayAsync();
            var vCtasContables = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.CuentasContables>();
            var vBancos = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.CatalogoBancos>();
            var vBancosTipo = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.CatalogoTipoBanco>();
            var vDispersion = await DBContext.database.FetchAsync<DBContext.DBConfia.Catalogos.TipoArchivoDispersion>();
            var vAgrupaciones = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.Agrupaciones>();

            ArrayList res = new();
            try
            {
                foreach (var T in ctasBancos)
                {
                    res.Add(new
                    {
                        cuentaBancoID = T.CuentaBancoID,
                        numeroCuenta = T.NumeroCuenta,
                        cuentaID = vCtasContables.Select(sc => new
                        {
                            id = sc.CuentaID,
                            cuenta = sc.Cuenta,
                            nombre = sc.Nombre,
                            activa = sc.Activa,
                            fechaRegistro = sc.FechaRegistro,
                            tipoBanco = vBancosTipo.Where(ws => ws.TipoBancoId == sc.TipoBancoId).Select(sel => new { tipoBancoID = sel.TipoBancoId, descripcion = sel.Descripcion }).SingleOrDefault()
                        }).Where(ws => ws.id == T.CuentaID).SingleOrDefault(),
                        bancoID = vBancos.Where(we => we.BancoID == T.BancoID).Select(selc => new
                        {
                            bancoID = selc.BancoID,
                            nombre = selc.Nombre,
                            activo = selc.Activo,
                            archivoDispersion = vDispersion.Where(we => we.ArchivoDispersionID == selc.ArchivoDispersionID).Select(sel2 => new
                            {
                                archivoDispersionID = sel2.ArchivoDispersionID,
                                clave = sel2.Clave,
                                descripcion = sel2.Descripcion
                            }).SingleOrDefault(),
                            tipoBanco = vBancosTipo.Where(we => we.TipoBancoId == selc.TipoBancoId).Select(s3 => new
                            {
                                tipoBancoID = s3.TipoBancoId,
                                descripcion = s3.Descripcion
                            }).SingleOrDefault()
                        }).SingleOrDefault(),
                        activo = T.Activo,
                        dispersionConvenio = T.DispersionConvenio,
                        global = T.Global,
                        puedeDispersar = T.PuedeDispersar,
                        saldoMin = T.SaldoMinimo,
                        saldoMax = T.SaldoMaximo,
                        excedenteSaldo = T.ExcedenteSaldo,

                    });
                }
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);

            }
        }

        [HttpGet]
        [Route("find-by-account/{CuentaID}")]
        [Authorize]
        public async Task<IActionResult> ObtenerPorCuenta(int CuentaID)
        {
            var T = await DBContext.database.QueryAsync<DBContext.DBConfia.Bancos.CatalogoCuentasBancos>("WHERE CuentaBancoID =@0", CuentaID).SingleOrDefaultAsync();
            var vCtasContables = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.CuentasContables>();
            var vBancos = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.CatalogoBancos>();
            var vBancosTipo = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.CatalogoTipoBanco>();
            var vDispersion = await DBContext.database.FetchAsync<DBContext.DBConfia.Catalogos.TipoArchivoDispersion>();
            var vAgrupaciones = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.Agrupaciones>();

            ArrayList res = new();
            try
            {

                res.Add(new
                {
                    cuentaBancoID = T.CuentaBancoID,
                    numeroCuenta = T.NumeroCuenta,
                    cuentaID = vCtasContables.Select(sc => new
                    {
                        id = sc.CuentaID,
                        cuenta = sc.Cuenta,
                        nombre = sc.Nombre,
                        activa = sc.Activa,
                        fechaRegistro = sc.FechaRegistro,
                        tipoBanco = vBancosTipo.Where(ws => ws.TipoBancoId == sc.TipoBancoId).Select(sel => new { tipoBancoID = sel.TipoBancoId, descripcion = sel.Descripcion }).SingleOrDefault()
                    }).Where(ws => ws.id == T.CuentaID).SingleOrDefault(),
                    bancoID = vBancos.Where(we => we.BancoID == T.BancoID).Select(selc => new
                    {
                        bancoID = selc.BancoID,
                        nombre = selc.Nombre,
                        activo = selc.Activo,
                        archivoDispersion = vDispersion.Where(we => we.ArchivoDispersionID == selc.ArchivoDispersionID).Select(sel2 => new
                        {
                            archivoDispersionID = sel2.ArchivoDispersionID,
                            clave = sel2.Clave,
                            descripcion = sel2.Descripcion
                        }).SingleOrDefault(),
                        tipoBanco = vBancosTipo.Where(we => we.TipoBancoId == selc.TipoBancoId).Select(s3 => new
                        {
                            tipoBancoID = s3.TipoBancoId,
                            descripcion = s3.Descripcion
                        }).SingleOrDefault()
                    }).SingleOrDefault(),
                    activo = T.Activo,
                    dispersionConvenio = T.DispersionConvenio,
                    global = T.Global,
                    puedeDispersar = T.PuedeDispersar,
                    saldoMin = T.SaldoMinimo,
                    saldoMax = T.SaldoMaximo,
                    excedenteSaldo = T.ExcedenteSaldo,

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

        /*  [HttpGet]
         [Route("boveda-disponible")]
         [Authorize]
         public async Task<IActionResult> ObtenerBovedasDispobibles()
         {
             try
             {
                 var query = NPoco.Sql.Builder.Append("SELECT CB.CuentaBancoID, CB.NumeroCuenta, CB.CuentaID, CB.BancoID, CB.Activo, "
                 + "CB.DispersionConvenio, CB.Global, CB.PuedeDispersar, CB.SaldoMinimo, CB.SaldoMaximo, CB.ExcedenteSaldo, "
                 + "CB.ProductoID FROM Bancos.CatalogoCuentasBancos CB "
                 + "JOIN Bancos.CatalogoBancos B ON CB.BancoID = B.BancoID"
                 + " WHERE CuentaBancoID NOT IN (SELECT CuentaBancoID FROM Tesoreria.CuentasBoveda) AND B.TipoBancoId = 2");
                 var res = (await DBContext.database.QueryAsync<DBContext.DBConfia.Bancos.CatalogoCuentasBancos>(query).ToArrayAsync());
                 res.Select(sc => new
                 {
                     cuentaBancoID = sc.CuentaBancoID,
                     numeroCuenta = sc.NumeroCuenta
                 }).ToArray();
                 return Ok(res);

             }
             catch (Exception ex)
             {
                 return BadRequest(ex.Message);
             }
         } */

        [HttpGet]
        [Route("caja-disponible/{ProductoID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerCajasDisponibles(int ProductoID)
        {
            try
            {
                var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CuentasBancariasLibre_VW>("WHERE ProductoID = @0", ProductoID).ToArrayAsync();
                if (res.LongCount() < 1)
                {
                    return StatusCode(404, new
                    {
                        mensaje = "No hay cuentas disponibles para la caja, debe agregar una nueva cuenta de banco."
                    });
                }
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("create")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Agregar(PeticionesRest.SOMA.CatalogoCuentasBancos.Agregar parData)
        {
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();
            //var cajas = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.CatalogoCajas>();
            try
            {
                var detalleCuenta = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CuentasContables>("WHERE CuentaID = @0", parData.cuentaID).SingleOrDefaultAsync();

                var ctaContable = new DBContext.DBConfia.Bancos.CatalogoCuentasBancos()
                {
                    CuentaBancariaPrincipalID = parData.CuentaBancariaPrincipalID,
                    NumeroCuenta = parData.numeroCuenta,
                    CuentaID = parData.cuentaID,
                    BancoID = parData.bancoID,
                    Activo = parData.activo,
                    DispersionConvenio = parData.dispersionConvenio,
                    CobranzaConvenio = parData.cobranzaConvenio,
                    Global = parData.global,
                    DescripcionCuenta = parData.descripcionCuenta,
                    PuedeDispersar = parData.puedeDispersar,
                    SaldoMaximo = (decimal)parData.saldoMax,
                    SaldoMinimo = (decimal)parData.saldoMin,
                    SaldoActual = (decimal)parData.saldoActual,
                    ExcedenteSaldo = (decimal)parData.excedenteSaldo,
                    ProductoID = parData.productoID,
                    SucursalID = parData.sucursalID,
                    Disponible = true,
                    EsBoveda = parData.EsBoveda
                };

                await DBContext.database.InsertAsync(ctaContable);

                var bitacoraCambios = new BitacoraCambios()
                {
                    Accion = "Creación de Cuenta Banco ID: " + ctaContable.CuentaBancoID + " " + ctaContable.NumeroCuenta,
                    Modulo = "Bancos",
                    PersonaID = (long)usuarioActual.PersonaID,
                    FechaAfectacion = DateTime.Now
                };
                await DBContext.database.InsertAsync(bitacoraCambios);

                await DBContext.Destroy();
                return Ok(ctaContable);
            }
            catch (Exception ex)
            {
                return BadRequest("Error al ingresar la cuenta al sistema: " + ex.Message);
            }
        }

        //Método para actualizar una cuenta
        [HttpPut]
        [Route("update/{CuentaBancoID}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Actualizar(PeticionesRest.SOMA.CatalogoCuentasBancos.Actualizar parData, int CuentaBancoID)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();
            var cuenta_actual = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Bancos.CatalogoCuentasBancos>(CuentaBancoID);
            var cuenta_principal = await DBContext.database.QueryAsync<DBContext.DBConfia.Bancos.CuentasBancariasPrincipal>("WHERE CuentaBancariaPrincipalID =@0", cuenta_actual.CuentaBancariaPrincipalID).SingleOrDefaultAsync();
            var bancoActivo = await DBContext.database.QueryAsync<DBContext.DBConfia.Bancos.CatalogoBancos>("WHERE Activo=1 AND BancoID=@0", cuenta_principal.BancoID).LongCountAsync(); ;
            var cuentas = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.CatalogoCuentasBancos>("SELECT * FROM  Bancos.CatalogoCuentasBancos AS cb JOIN Tesoreria.CajaTipoOperacion cto on cb.CuentaBancoID = cto.CuentaBancoId WHERE cb.NumeroCuenta = @0", cuenta_actual.NumeroCuenta);
            var tipoOperacionCant = cuentas.LongCount();
            var bovedas = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.CatalogoCuentasBancos>("SELECT * FROM Bancos.CatalogoCuentasBancos cb JOIN Tesoreria.CuentasBoveda cub on cb.CuentaBancoID = cub.CuentaBancoId WHERE cb.NumeroCuenta = @0", cuenta_actual.NumeroCuenta);
            var cuentaBovedaCant = bovedas.LongCount();

            var cuentaNomAnt = cuenta_actual.NumeroCuenta;
            var cuentaDscAnt = cuenta_actual.DescripcionCuenta;
            var cuentaBovedaAnt = cuenta_actual.EsBoveda;
            var cuentaActivoAnt = cuenta_actual.Activo;
            var cuentaGlobalAnt = cuenta_actual.Global;
            var cuentaDispersaAnt = cuenta_actual.PuedeDispersar;
            var cuentaConvDispAnt = cuenta_actual.DispersionConvenio;
            var cuentaConvCobAnt = cuenta_actual.CobranzaConvenio;
            var cuentaSaldMinAnt = ((double)cuenta_actual.SaldoMinimo);
            var cuentaSaldMaxAnt = ((double)cuenta_actual.SaldoMaximo);
            var cuentaSaldExAnt = ((double)cuenta_actual.ExcedenteSaldo);

            ArrayList res = new();
            try
            {
                cuenta_actual.NumeroCuenta = parData.numeroCuenta;
                cuenta_actual.CuentaID = parData.cuentaID;
                //cuenta_actual.BancoID = parData.bancoID;
                cuenta_actual.CuentaBancariaPrincipalID = parData.CuentaBancariaPrincipalID;
                cuenta_actual.Activo = parData.activo;
                cuenta_actual.CobranzaConvenio = parData.cobranzaConvenio;
                cuenta_actual.DispersionConvenio = parData.dispersionConvenio;
                cuenta_actual.Global = parData.global;
                cuenta_actual.DescripcionCuenta = parData.descripcionCuenta;
                cuenta_actual.PuedeDispersar = parData.puedeDispersar;
                cuenta_actual.SaldoMaximo = (decimal)parData.saldoMax;
                cuenta_actual.SaldoMinimo = (decimal)parData.saldoMin;
                cuenta_actual.ExcedenteSaldo = (decimal)parData.excedenteSaldo;
                cuenta_actual.ProductoID = parData.productoID;
                cuenta_actual.EsBoveda = cuenta_actual.EsBoveda;
                if (cuenta_actual.Activo == true && bancoActivo == 1

                || cuenta_actual.Activo == false && bancoActivo == 1)

                {
                    if (cuenta_actual.Activo == false && tipoOperacionCant == 0
                                        || cuenta_actual.Activo == true)
                    {
                        if (cuenta_actual.Activo == false && cuentaBovedaCant == 0
                                                    || cuenta_actual.Activo == true)
                        {
                            await DBContext.database.UpdateAsync(cuenta_actual);
                        }
                        else
                        {
                            return StatusCode(400, new
                            {
                                error = "Error al desactivar la cuenta de banco, cuenta con bovedas"
                            });

                        }
                    }
                    else
                    {
                        return StatusCode(400, new
                        {
                            error = "Error al desactivar la cuenta de banco, cuenta con operaciones"
                        });

                    }
                }
                else
                {
                    return StatusCode(400, new
                    {
                        error = "Error al activar la cuenta del banco, el banco se encuentra desactivado"
                    });
                }

                if (!cuentaNomAnt.Equals(parData.numeroCuenta))
                {
                    var bitacoraCambios = new BitacoraCambios()
                    {
                        Accion = "Actualización de Nombre de Cuenta Banco ID: " + cuenta_actual.CuentaBancoID + " '" + cuentaNomAnt + "' a '" + parData.numeroCuenta + "'",
                        Modulo = "Bancos",
                        PersonaID = (long)usuarioActual.PersonaID,
                        FechaAfectacion = DateTime.Now,
                        Dato = "Nombre",
                        DatoAnt = cuentaNomAnt,
                        DatoNvo = parData.numeroCuenta

                    };
                    await DBContext.database.InsertAsync(bitacoraCambios);
                }
                if (!cuentaDscAnt.Equals(parData.descripcionCuenta))
                {
                    var bitacoraCambios = new BitacoraCambios()
                    {
                        Accion = "Actualización de Descripción de Cuenta Banco ID: " + cuenta_actual.CuentaBancoID + " '" + cuentaDscAnt + "' a '" + parData.descripcionCuenta + "'",
                        Modulo = "Bancos",
                        PersonaID = (long)usuarioActual.PersonaID,
                        FechaAfectacion = DateTime.Now,
                        Dato = "Descripción",
                        DatoAnt = cuentaDscAnt,
                        DatoNvo = parData.descripcionCuenta

                    };
                    await DBContext.database.InsertAsync(bitacoraCambios);
                }
                if (!cuentaBovedaAnt == parData.EsBoveda)
                {
                    var bitacoraCambios = new BitacoraCambios()
                    {
                        Accion = "Actualización de Es Boveda de Cuenta Banco ID: " + cuenta_actual.CuentaBancoID + " de " + cuentaBovedaAnt + " a " + cuenta_actual.EsBoveda,
                        Modulo = "Bancos",
                        PersonaID = (long)usuarioActual.PersonaID,
                        FechaAfectacion = DateTime.Now,
                        Dato = "EsBoveda",
                        DatoAnt = cuentaBovedaAnt.ToString(),
                        DatoNvo = cuenta_actual.EsBoveda.ToString()

                    };
                    await DBContext.database.InsertAsync(bitacoraCambios);

                }
                if (!cuentaActivoAnt == parData.activo)
                {
                    var bitacoraCambios = new BitacoraCambios()
                    {
                        Accion = "Actualización de Activo de Cuenta Banco ID: " + cuenta_actual.CuentaBancoID + " de " + cuentaActivoAnt + " a " + cuenta_actual.Activo,
                        Modulo = "Bancos",
                        PersonaID = (long)usuarioActual.PersonaID,
                        FechaAfectacion = DateTime.Now,
                        Dato = "Activo",
                        DatoAnt = cuentaActivoAnt.ToString(),
                        DatoNvo = cuenta_actual.Activo.ToString()

                    };
                    await DBContext.database.InsertAsync(bitacoraCambios);

                }
                if (!cuentaGlobalAnt == parData.global)
                {
                    var bitacoraCambios = new BitacoraCambios()
                    {
                        Accion = "Actualización de Global de Cuenta Banco ID: " + cuenta_actual.CuentaBancoID + " de " + cuentaGlobalAnt + " a " + cuenta_actual.Global,
                        Modulo = "Bancos",
                        PersonaID = (long)usuarioActual.PersonaID,
                        FechaAfectacion = DateTime.Now,
                        Dato = "Global",
                        DatoAnt = cuentaGlobalAnt.ToString(),
                        DatoNvo = cuenta_actual.Global.ToString()

                    };
                    await DBContext.database.InsertAsync(bitacoraCambios);

                }
                if (!cuentaDispersaAnt == parData.puedeDispersar)
                {
                    var bitacoraCambios = new BitacoraCambios()
                    {
                        Accion = "Actualización de Puede Dispersar de Cuenta Banco ID: " + cuenta_actual.CuentaBancoID + " de " + cuentaDispersaAnt + " a " + cuenta_actual.PuedeDispersar,
                        Modulo = "Bancos",
                        PersonaID = (long)usuarioActual.PersonaID,
                        FechaAfectacion = DateTime.Now,
                        Dato = "PuedeDispersar",
                        DatoAnt = cuentaDispersaAnt.ToString(),
                        DatoNvo = cuenta_actual.PuedeDispersar.ToString()

                    };
                    await DBContext.database.InsertAsync(bitacoraCambios);

                }
                if (!cuentaConvDispAnt.Equals(parData.dispersionConvenio))
                {
                    var bitacoraCambios = new BitacoraCambios()
                    {
                        Accion = "Actualización de Dispersión Convenio de Cuenta Banco ID: " + cuenta_actual.CuentaBancoID + " '" + cuentaConvDispAnt + "' a '" + parData.dispersionConvenio + "'",
                        Modulo = "Bancos",
                        PersonaID = (long)usuarioActual.PersonaID,
                        FechaAfectacion = DateTime.Now,
                        Dato = "DispersionConvenio",
                        DatoAnt = cuentaConvDispAnt,
                        DatoNvo = parData.dispersionConvenio

                    };
                    await DBContext.database.InsertAsync(bitacoraCambios);
                }
                if (!cuentaConvCobAnt.Equals(parData.cobranzaConvenio))
                {
                    var bitacoraCambios = new BitacoraCambios()
                    {
                        Accion = "Actualización de Cobranza Convenio de Cuenta Banco ID: " + cuenta_actual.CuentaBancoID + " '" + cuentaConvDispAnt + "' a '" + parData.cobranzaConvenio + "'",
                        Modulo = "Bancos",
                        PersonaID = (long)usuarioActual.PersonaID,
                        FechaAfectacion = DateTime.Now,
                        Dato = "CobranzaConvenio",
                        DatoAnt = cuentaConvCobAnt,
                        DatoNvo = parData.cobranzaConvenio

                    };
                    await DBContext.database.InsertAsync(bitacoraCambios);
                }
                if (!cuentaSaldMinAnt.Equals((double)parData.saldoMin))
                {
                    var bitacoraCambios = new BitacoraCambios()
                    {
                        Accion = "Actualización de Saldo Mínimo de Cuenta Banco ID: " + cuenta_actual.CuentaBancoID + " '" + cuentaSaldMinAnt + "' a '" + parData.saldoMin + "'",
                        Modulo = "Bancos",
                        PersonaID = (long)usuarioActual.PersonaID,
                        FechaAfectacion = DateTime.Now,
                        Dato = "SaldoMinimo",
                        DatoAnt = cuentaSaldMinAnt.ToString(),
                        DatoNvo = parData.saldoMin.ToString()

                    };
                    await DBContext.database.InsertAsync(bitacoraCambios);
                }
                if (!cuentaSaldMaxAnt.Equals((double)parData.saldoMax))
                {
                    var bitacoraCambios = new BitacoraCambios()
                    {
                        Accion = "Actualización de Saldo Máximo de Cuenta Banco ID: " + cuenta_actual.CuentaBancoID + " '" + cuentaSaldMaxAnt + "' a '" + parData.saldoMax + "'",
                        Modulo = "Bancos",
                        PersonaID = (long)usuarioActual.PersonaID,
                        FechaAfectacion = DateTime.Now,
                        Dato = "SaldoMaximo",
                        DatoAnt = cuentaSaldMaxAnt.ToString(),
                        DatoNvo = parData.saldoMax.ToString()

                    };
                    await DBContext.database.InsertAsync(bitacoraCambios);
                }
                if (!cuentaSaldExAnt.Equals((double)parData.excedenteSaldo))
                {
                    var bitacoraCambios = new BitacoraCambios()
                    {
                        Accion = "Actualización de Saldo Excedente de Cuenta Banco ID: " + cuenta_actual.CuentaBancoID + " '" + cuentaSaldExAnt + "' a '" + parData.excedenteSaldo + "'",
                        Modulo = "Bancos",
                        PersonaID = (long)usuarioActual.PersonaID,
                        FechaAfectacion = DateTime.Now,
                        Dato = "ExcedenteSaldo",
                        DatoAnt = cuentaSaldExAnt.ToString(),
                        DatoNvo = parData.excedenteSaldo.ToString()

                    };
                    await DBContext.database.InsertAsync(bitacoraCambios);
                }

                return Ok(cuenta_actual);

            }
            catch (Exception ex)
            {
                return BadRequest("Error al actualizar la cuenta contable: " + ex.Message);
            }
        }



    }
}