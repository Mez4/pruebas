using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Tesoreria;
using DBContext.DBConfia.dbo;
using DBContext.DBConfia.Custom.Tesoreria;
using System.Diagnostics;
using Path = System.IO.Path;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using ConfiaWebApi.Code;
using System.Collections;

namespace ConfiaWebApi.Controllers.Sistema
{
    [Authorize]
    [ApiController]
    [Route("api/SOMA/[controller]")]
    public class TotalEfectivoCajaController : ControllerBase
    {
        // TODO:
        /// <summary>

        /// Conexion a base de datos

        /// </summary>
        private DBConfiaContext ConexionBD;


        /// <summary>
        /// Constructor del controlador
        /// </summary>
        /// <param name="_DBContext">Conexión de datos para el controlador</param>
        public TotalEfectivoCajaController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        [HttpGet]
        [Route("demominaciones")]
        [Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> CuentasEnOperacionCaja(ConfiaWebApi.PeticionesRest.SOMA.ArqueosV2.CuentasEnOperacionCaja parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var cuentasEnOperacion = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.CajaTipoOperacion_VW>("WHERE CajaID=@0", parData.CajaID).ToArrayAsync();
                await this.ConexionBD.Destroy();
                return Ok(cuentasEnOperacion);
            }
            catch (Exception ex)
            {
                await this.ConexionBD.Destroy();
                return BadRequest(ex);
            }

        }

        [HttpPost]
        [Route("obtenerCuentasCaja")]
        [Authorize]
        [Code.TProteccionProducto]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> ADDD(ConfiaWebApi.PeticionesRest.SOMA.ArqueosV2.CuentasEnOperacionCaja parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var cuentasCaja = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.CajaTipoOperacion_VW>("WHERE CajaID=@0 AND ManejaEfectivo = 1", parData.CajaID).ToArrayAsync();
                ArrayList res = new();

                foreach (var T in cuentasCaja)
                {
                    res.Add(new
                    {
                        CajaID = T.CajaID,
                        CuentaBancoID = T.CuentaBancoID,
                        DescCuentaBanco = T.NumeroCuentaCB,
                        NumeroCuenta = T.NumeroCuentaCB,
                        TipoMovimiento = T.TipoMovimiento,
                        Producto = T.Producto,
                        ProductoID = T.ProductoID,
                        Denominaciones = (await ConexionBD.database.FetchAsync<DBContext.DBConfia.Tesoreria.CatalogoDenomEfectivo_VW>())
                    });
                }

                var res2 = new
                {
                    ValoresCaja = res,
                    CajaNombre = cuentasCaja.FirstOrDefault().Nombre,
                    CajaID = cuentasCaja.FirstOrDefault().CajaID
                };
                await this.ConexionBD.Destroy();
                return Ok(res2);
            }
            catch (Exception ex)
            {
                await this.ConexionBD.Destroy();
                return BadRequest(ex);
            }

        }

        [HttpPost]
        [Route("obtenerCuentasBoveda")]
        [Authorize]
        [Code.TProteccionProducto]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> CuentasBoveda(ConfiaWebApi.PeticionesRest.SOMA.ArqueosV2.CuentasEnOperacionCajaBovedas parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var cuentasCaja = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.CajaTipoOperacion_VW>("WHERE CajaID=@0 AND ManejaEfectivo = 1 AND CveMovimientoID='BOV' ", parData.CajaID).ToArrayAsync();
                ArrayList res = new();

                foreach (var T in cuentasCaja)
                {
                    res.Add(new
                    {
                        CajaID = T.CajaID,
                        CuentaBancoID = T.CuentaBancoID,
                        DescCuentaBanco = T.NumeroCuentaCB,
                        NumeroCuenta = T.NumeroCuentaCB,
                        TipoMovimiento = T.TipoMovimiento,
                        Producto = T.Producto,
                        ProductoID = T.ProductoID,
                        Denominaciones = (await ConexionBD.database.FetchAsync<DBContext.DBConfia.Tesoreria.CatalogoDenomEfectivo_VW>())
                    });
                }

                var res2 = new
                {
                    ValoresCaja = res,
                    CajaNombre = cuentasCaja.FirstOrDefault().Nombre,
                    CajaID = cuentasCaja.FirstOrDefault().CajaID
                };
                await this.ConexionBD.Destroy();
                return Ok(res2);
            }
            catch (Exception ex)
            {
                await this.ConexionBD.Destroy();
                return BadRequest(ex);
            }

        }


        [HttpPost]
        [Route("generar-arqueo-v3")]
        [Authorize]
        [Code.TProteccionProducto]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> CrearArqueov3(ConfiaWebApi.PeticionesRest.SOMA.ArqueosV2.ArqueoV3 parData)
        {
            try
            {   
                // VARIABLE PARA COMPROBAR EL DIA DE LA SEMANA
                // DateTime week = DateTime.Now;
                // // SE OBTIENE EL NUMERO DEL DIA
                // int number_Day = ((int)week.DayOfWeek);
                // // int number_Day = 7;
                // // SI EL DIA ES SABADO
                // if (number_Day == 6)
                // {
                //     bool checkWeekend = await this.checkWeekend();
                //     if (!checkWeekend)
                //         return BadRequest("Solo se puede generar el arqueo entre la 1:30 p.m a 04:00 p.m");
                //         // return checkWeekend ? BadRequest("Solo se puede generar el arqueo entre la 1:30 pm a 04:00 pm") : null;
                // }
                // // SI ES DIFERENTE DEL DOMINGO
                // if (number_Day != 7)
                // {
                //     bool  checkWeek = await this.checkWeek();
                //     if (!checkWeek)
                //         return BadRequest("Solo se puede generar el arqueo entre las 6:00 p.m a 09:00 p.m");   
                // }
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                ConexionBD.database.BeginTransaction();
                var res = await ConexionBD.database.QueryAsync<GeneraArqueoCaja>("EXEC Tesoreria.pa_CierreCaja_INS @0, @1", parData.CajaID, UsuarioActual.NombreCompleto).SingleOrDefaultAsync();

                if (res.MensajeID == 1)
                {
                    foreach (var item in parData.ValoresCaja)
                    {
                        foreach (var item2 in item.Denominaciones)
                        {
                            var totalXefectivo = new ArqueosDetalle()
                            {
                                CatDenomEfectivoID = item2.CatDenomEfectivoID,
                                Cantidad = item2.Cantidad,
                                TotalXEfectivo = item2.Total,
                                CajaID = item.CajaID,
                                Fecha = DateTime.Now,
                                ArqueoID = res.ArqueoID,
                                CuentaBancoID = item.CuentaBancoID,
                            };
                            await ConexionBD.database.InsertAsync(totalXefectivo);
                        }
                    }
                    ConexionBD.database.CompleteTransaction();
                    await this.ConexionBD.Destroy();
                    return Ok(res);
                }
                else
                {
                    ConexionBD.database.AbortTransaction();
                    await this.ConexionBD.Destroy();
                    return Ok(res);
                }
            }
            catch (Exception ex)
            {
                ConexionBD.database.AbortTransaction();
                await this.ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }


        [HttpPost]
        [Route("generar-arqueo-boveda")]
        [Authorize]
        [Code.TProteccionProducto]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> CrearArqueoBoveda(ConfiaWebApi.PeticionesRest.SOMA.ArqueosV2.ArqueoBoveda parData)
        {
            try
            {
                //if (DateTime.Now.Hour < 18 && DateTime.Now.Hour > 21)
                //  return BadRequest("Solo se puede generar el arqueo entre las 6:00 pm a 10:00 pm");

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var caja = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.CatalogoCajas>("WHERE CajaID =@0", parData.CajaID).ToArrayAsync();
                var contcajas = caja.Count();

                ConexionBD.database.BeginTransaction();

                if (contcajas == 1)
                {
                    foreach (var item in parData.ValoresCaja)
                    {
                        var res = await ConexionBD.database.QueryAsync<GeneraArqueoBoveda>("EXEC Tesoreria.pa_ArqueoBoveda_INS @0, @1, @2, @3", parData.CajaID, UsuarioActual.NombreCompleto, UsuarioActual.UsuarioID, item.CuentaBancoID).SingleOrDefaultAsync();

                        if (res.MensajeID == 1)
                        {
                            foreach (var item2 in item.Denominaciones)
                            {
                                var totalXefectivo = new ArqueosBovedasDetalle2()
                                {
                                    CatDenomEfectivoID = item2.CatDenomEfectivoID,
                                    Cantidad = item2.Cantidad,
                                    TotalXEfectivo = item2.Total,
                                    CajaID = item.CajaID,
                                    Fecha = DateTime.Now,
                                    ArqueoBovedaID = res.ArqueoBovedaID,
                                    CuentaBancoID = item.CuentaBancoID,
                                };
                                await ConexionBD.database.InsertAsync(totalXefectivo);
                            }
                        }
                        ConexionBD.database.CompleteTransaction();
                        await this.ConexionBD.Destroy();
                        return Ok(res);
                    }
                    var res2 = "Arqueo Exitoso";
                    ConexionBD.database.CompleteTransaction();
                    await this.ConexionBD.Destroy();
                    return Ok(res2);
                }
                else
                {
                    var res2 = "No existe caja";
                    ConexionBD.database.AbortTransaction();
                    await this.ConexionBD.Destroy();
                    return Ok(res2);
                }
            }
            catch (Exception ex)
            {
                ConexionBD.database.AbortTransaction();
                await this.ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpGet]
        [Route("cerrar-boveda/{BovedaID}")]
        [Authorize]
        public async Task<IActionResult> CerrarBoveda(int BovedaID)
        {
            try
            {
                var fechaNow = DateTime.Now.ToString("yyyy-MM-dd");

                ConexionBD.database.BeginTransaction();
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var boveda = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Tesoreria.CatalogoBoveda>(BovedaID);
                if (boveda == null)
                {
                    ConexionBD.database.AbortTransaction();
                    return NotFound();
                }
                else
                {
                    int CuentaBancoId = boveda.CuentaID;
                    boveda.Cerrada = true;
                    await ConexionBD.database.UpdateAsync(boveda);
                    var CuentaBancaria = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Bancos.CatalogoCuentasBancos>(CuentaBancoId);
                    var ArqueosBovedasAnterior = await ConexionBD.database.QueryAsync<ArqueosBovedas>("	SELECT TOP(1) * FROM Tesoreria.ArqueosBovedas a WHERE BovedaID = @0 order by Fecha desc", BovedaID).SingleOrDefaultAsync();


                    var ArqueoBoveda = new DBContext.DBConfia.Tesoreria.ArqueosBovedas()
                    {
                        BovedaID = boveda.BovedaID,
                        Fecha = DateTime.Now,
                        UsuarioRealiza = UsuarioActual.Usuario,
                        FechaCaptura = DateTime.Now,
                        UsuarioID = UsuarioActual.UsuarioID
                    };
                    await ConexionBD.database.InsertAsync(ArqueoBoveda);

                    if (ArqueosBovedasAnterior != null)
                    {
                        var saldosAnterior = await ConexionBD.database.QueryAsync<ArqueosBovedasSaldosCierre>("WHERE ArqueoBovedaID = @0", ArqueosBovedasAnterior.ArqueoBovedaID).SingleOrDefaultAsync();
                        var cuentaBan = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Bancos.CatalogoCuentasBancos>(boveda.CuentaID);
                        var arqueoMovimientos = new ArqueosBovedasSaldos()
                        {
                            ArqueoBovedaID = ArqueoBoveda.ArqueoBovedaID,
                            TipoMovimiento = "SI",
                            FechaCaptura = DateTime.Now,
                            BovedaID = boveda.BovedaID,
                            CuentaBancoID = boveda.CuentaID,
                            SaldoCuenta = saldosAnterior.SaldoCierre
                        };

                        await ConexionBD.database.InsertAsync(arqueoMovimientos);
                    }

                    var SaldoCierreCuentaBoveda = new ArqueosBovedasSaldosCierre()
                    {
                        ArqueoBovedaID = ArqueoBoveda.ArqueoBovedaID,
                        FechaCaptura = DateTime.Now,
                        CuentaBancoID = boveda.CuentaID,
                        SaldoCierre = (decimal)CuentaBancaria.SaldoActual
                    };
                    await ConexionBD.database.InsertAsync(SaldoCierreCuentaBoveda);

                    var movimientosDeBoveda = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Bancos.Movimientos>("SELECT * FROM Bancos.Movimientos m WHERE MovimientoBoveda = 1 AND CuentaID= @0  AND CAST(m.FechaCaptura as date) IN (CAST(@1 as date)) AND m.MovimientoID NOT IN "
                    + " (SELECT amd.MovimientoID FROM Tesoreria.ArqueosBovedasDetalle amd WHERE amd.BovedaID= @2 AND cast(amd.FechaCaptura as date) IN (cast(@3 as date)) )", CuentaBancoId, fechaNow, BovedaID, fechaNow).ToArrayAsync();

                    foreach (var item in movimientosDeBoveda)
                    {
                        var arqueoMovimientos1 = new ArqueosBovedasDetalle()
                        {
                            MovimientoID = item.MovimientoID,
                            ArqueoBovedaID = ArqueoBoveda.ArqueoBovedaID,
                            CuentaBancoID = boveda.CuentaID,
                            FechaCaptura = item.FechaCaptura,
                            BovedaID = boveda.BovedaID,
                        };
                        await ConexionBD.database.InsertAsync(arqueoMovimientos1);
                    }

                    var movAgrupados = await ConexionBD.database.QueryAsync<ArqueoMovSistemaBovedasW>("SELECT ccb.CuentaBancoID  ,ccb.NumeroCuenta	"
                    + ",tm.CveMovimientoID ,   tm.TipoMovimiento  ,SUM(m.Importe) as Total	 ,ccb.EsBoveda "
                    + "FROM Bancos.Movimientos m "
                    + "LEFT JOIN Bancos.CatalogoCuentasBancos ccb "
                    + "ON ccb.CuentaBancoID = m.CuentaID "
                    + "LEFT JOIN Bancos.TiposMovimientos tm "
                    + "ON m.TipoMovimientoID = tm.Id "
                    + "WHERE m.MovimientoID  IN "
                    + "(SELECT amd.MovimientoID FROM Tesoreria.ArqueosBovedasDetalle amd "
                    + "WHERE amd.ArqueoBovedaID = @0) "
                    + "GROUP BY  ccb.CuentaBancoID, ccb.NumeroCuenta, tm.CveMovimientoID, tm.TipoMovimiento, ccb.EsBoveda   ", ArqueoBoveda.ArqueoBovedaID).ToArrayAsync();

                    foreach (var item in movAgrupados)
                    {
                        var s = new ArqueosBovedasSaldos()
                        {
                            ArqueoBovedaID = ArqueoBoveda.ArqueoBovedaID,
                            TipoMovimiento = "MS",
                            FechaCaptura = DateTime.Now,
                            BovedaID = boveda.BovedaID,
                            CuentaBancoID = boveda.CuentaID,
                            SaldoCuenta = item.Total
                        };
                        await ConexionBD.database.InsertAsync(s);
                    }



                    ConexionBD.database.CompleteTransaction();
                    await this.ConexionBD.Destroy();
                    return Ok(ArqueoBoveda);
                }
            }
            catch (Exception ex)
            {
                ConexionBD.database.AbortTransaction();
                await this.ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        // Obtenemos los balances

        [HttpGet]
        [Route("listar/{cajaID}/{fecha}")]
        [Authorize]
        public async Task<IActionResult> Boveda(int cajaID, string fecha)
        {
            try
            {
                var totalEfectivo = await ConexionBD.database.QueryAsync<TotalEfectivoCaja>("WHERE CajaID=@0 AND Fecha IN (@1)", cajaID, fecha).ToArrayAsync();
                await this.ConexionBD.Destroy();
                return Ok(totalEfectivo);
            }
            catch (Exception er)
            {
                await this.ConexionBD.Destroy();
                return BadRequest(er.Message);
            }
        }

        [HttpGet]
        [Route("corte-caja/{cajaID}/{fecha}")]
        [Authorize]
        public async Task<IActionResult> Cajas(int cajaID, string fecha)
        {

            try
            {
                var corteDeCaja = await ConexionBD.database.QueryAsync<FnsCorteCajaW>("SELECT * FROM Tesoreria.FnsCorteCaja(@0,@1)", cajaID, fecha).ToArrayAsync();
                await this.ConexionBD.Destroy();
                return Ok(corteDeCaja);
            }
            catch (Exception err)
            {
                await this.ConexionBD.Destroy();
                return BadRequest(err.Message);
            }


        }

        [HttpGet]
        [Route("corte-caja-suc/{cajaID}/{fecha}/{fechaFin}")]
        [Authorize]
        public async Task<IActionResult> CorteCajaSucursal(int cajaID, string fecha, string fechaFin)
        {

            try
            {
                var corteDeCaja = await ConexionBD.database.QueryAsync<FnsCorteCajaW>("SELECT * FROM Tesoreria.FnsCorteCajaSucursal(@0,@1,@2)", cajaID, fecha, fechaFin).ToArrayAsync();
                await this.ConexionBD.Destroy();
                return Ok(corteDeCaja);
            }
            catch (Exception err)
            {
                await this.ConexionBD.Destroy();
                return BadRequest(err.Message);
            }


        }

        [HttpGet]
        [Route("corte-caja-sucursal/{cajaID}/{fecha}/{fechaFin}")]
        [Authorize]
        public async Task<IActionResult> CorteCajaSucursalH(int cajaID, string fecha, string fechaFin)
        {

            try
            {
                var corteDeCaja = await ConexionBD.database.QueryAsync<HeaderCorteCajaSucursal>("SELECT DISTINCT "
            + "			s.Nombre Sucursal,"
            + "			cc.CajaID,"
            + "			c.Cuenta,"
            + "			cc.Nombre 'NombreCaja',"
            + "			tec.fecha,"
            + "			convert(varchar(max),u.PersonaID) +'    '+ u.NombreCompleto  'RealizaArqueo'"
            + "		FROM Tesoreria.TotalEfectivoCaja tec "
            + "			JOIN Tesoreria.CatalogoDenomEfectivo cde ON tec.CatDenomEfectivoID = cde.CatDenomEfectivoID "
            + "			JOIN Tesoreria.CatalogoCajas cc ON tec.CajaID=cc.CajaID "
            + "			JOIN Tesoreria.CuentasContables c ON cc.CuentaID = c.CuentaID "
            + "			JOIN General.Personas_VW u ON cc.PersonaID = u.PersonaID "
            + "			JOIN General.Sucursales s ON cc.SucursalID = s.SucursalID "
            + "			WHERE cc.SucursalID in(@0) AND tec.Fecha  BETWEEN @1 AND @2", cajaID, fecha, fechaFin).ToArrayAsync();
                await this.ConexionBD.Destroy();
                return Ok(corteDeCaja);
            }
            catch (Exception err)
            {
                await this.ConexionBD.Destroy();
                return BadRequest(err.Message);
            }


        }

        [HttpGet]
        [Route("corte-caja-sucursales/{fecha}/{fechaFin}")]
        [Authorize]
        public async Task<IActionResult> CorteCajaSucursalesH(string fecha, string fechaFin)
        {

            try
            {
                var corteDeCaja = await ConexionBD.database.QueryAsync<HeaderCorteCajaSucursal>("SELECT DISTINCT "
            + " s.Nombre Sucursal, "
            + "	cc.CajaID, "
            + "	c.Cuenta, "
            + "	cc.Nombre 'NombreCaja', "
            + "	tec.Fecha, "
            + "	convert(varchar(max),u.PersonaID) +'    '+ u.NombreCompleto  'RealizaArqueo' "
            + "FROM Tesoreria.TotalEfectivoCaja tec "
            + "	JOIN Tesoreria.CatalogoDenomEfectivo cde ON tec.CatDenomEfectivoID = cde.CatDenomEfectivoID "
            + "	JOIN Tesoreria.CatalogoCajas cc ON tec.CajaID=cc.CajaID "
            + "	JOIN Tesoreria.CuentasContables c ON cc.CuentaID = c.CuentaID "
            + "	JOIN General.Personas_VW u ON cc.PersonaID = u.PersonaID "
            + " JOIN General.Sucursales s ON cc.SucursalID = s.SucursalID "
            + "WHERE tec.Fecha BETWEEN @0 AND @1", fecha, fechaFin).ToArrayAsync();
                await this.ConexionBD.Destroy();
                return Ok(corteDeCaja);
            }
            catch (Exception err)
            {
                await this.ConexionBD.Destroy();
                return BadRequest(err.Message);
            }


        }

        [HttpGet]
        [Route("saldo-inicial/{cajaID}/{fecha}")]
        [Authorize]
        public async Task<IActionResult> SaldoInicial(int cajaID, string fecha)
        {

            try
            {
                var corteDeCaja = await ConexionBD.database.QueryAsync<SaldoInicialW>("SELECT  COALESCE(SUM(tm.Factor * m.Importe),0) AS Total "
            + "FROM Bancos.Movimientos m  JOIN Bancos.TiposMovimientos tm ON m.TipoMovimientoID=tm.Id "
            + "WHERE m.CajaID = @0 AND m.Estatus IN ('A')  and m.FechaCaptura IN (cast(@1 as date)) "
            + "and m.Observaciones = 'Deposito Automático de Boveda a Caja'", cajaID, fecha).SingleOrDefaultAsync();
                await this.ConexionBD.Destroy();
                return Ok(corteDeCaja);
            }
            catch (Exception err)
            {
                await this.ConexionBD.Destroy();
                return BadRequest(err.Message);
            }


        }

        [HttpGet]
        [Route("arqueosGenerados/{fechaInicial}/{fechaFinal}/{cajaID}")]
        [Authorize]
        [Code.TProteccionProducto]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> ArqueosGenerados(string fechaInicial, string fechaFinal, int cajaID)
        {
            try
            {
                var st = await ConexionBD.database.ExecuteAsync("SET DATEFORMAT 'YMD'");
                var res = await ConexionBD.database.QueryAsync<Arqueos>("WHERE CajaID=@0 AND (Fecha >= @1 AND Fecha <=dateadd(day, 1, @2))", cajaID, fechaInicial, fechaFinal).ToArrayAsync();
                await this.ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception e)
            {
                await this.ConexionBD.Destroy();
                return BadRequest(e.Message);
            }
        }
        [HttpGet]
        [Route("arqueosGeneradosBovedas/{fechaInicial}/{fechaFinal}/{BovedaID}")]
        [Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> ArqueosGeneradosBovedas(string fechaInicial, string fechaFinal, int BovedaID)
        {
            try
            {
                var st = await ConexionBD.database.ExecuteAsync("SET DATEFORMAT 'YMD'");
                var arqueosBovedas = await ConexionBD.database.QueryAsync<ArqueosBovedas>("WHERE BovedaID=@0 AND (Fecha >= @1 AND Fecha <=dateadd(day, 1, @2))", BovedaID, fechaInicial, fechaFinal).ToArrayAsync();
                await this.ConexionBD.Destroy();
                return Ok(arqueosBovedas);
            }
            catch (Exception e)
            {
                await this.ConexionBD.Destroy();
                return BadRequest(e.Message);
            }
        }
        [HttpPost]
        [Route("generar-arqueo-v2")]
        [Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> CrearArqueo(ConfiaWebApi.PeticionesRest.SOMA.ArqueosV2.CrearArqueos parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var arqueoAnterior = await ConexionBD.database.QueryAsync<Arqueos>("SELECT TOP (1)* FROM Tesoreria.Arqueos a WHERE CajaID = @0 ORDER BY a.Fecha DESC", parData.CajaID).SingleOrDefaultAsync();

                if (arqueoAnterior != null)
                {
                    var fecha = arqueoAnterior.Fecha;
                    var movsBancos = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.MovimientosArqueos_VW>("WHERE FechaCaptura BETWEEN CAST(@0 AS DATETIME) AND CAST(GETDATE() AS DATETIME) AND CajaID = @1", fecha, parData.CajaID).ToArrayAsync();
                    var saldosCuentas = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.CuentasOpCaja_VW>("WHERE CajaID = @0", parData.CajaID).ToArrayAsync();

                    var arqueo = new Arqueos
                    {
                        Fecha = DateTime.Now,
                        CajaID = parData.CajaID,
                        UsuarioRealiza = UsuarioActual.Usuario
                    };

                    await ConexionBD.database.InsertAsync(arqueo);

                    var caja = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.CatalogoCajas>("WHERE CajaID = @0", parData.CajaID).SingleOrDefaultAsync();
                    caja.Cerrada = true;
                    await ConexionBD.database.UpdateAsync(caja);

                    foreach (var item in saldosCuentas)
                    {
                        var arqueoSaldoCuenta = new DBContext.DBConfia.Tesoreria.ArqueoSaldosCuentas()
                        {
                            ArqueoID = arqueo.ArqueoID,
                            FechaCaptura = DateTime.Now,
                            CuentaBancoID = item.CuentaBancoID,
                            SaldoCierre = item.SaldoActual,
                            UsuarioID = 0,
                            TipoMovimiento = (int)item.Id,
                            NumeroCuenta = item.NumeroCuenta,
                            Producto = item.Producto,
                            ProductoID = item.ProductoID,
                            CveMovDesc = item.TipoMovimiento
                        };
                        await ConexionBD.database.InsertAsync(arqueoSaldoCuenta);
                    }



                    await this.ConexionBD.Destroy();
                    return Ok(movsBancos);

                }
                else
                {

                }
                await this.ConexionBD.Destroy();
                return Ok();
            }
            catch (Exception e)
            {
                await this.ConexionBD.Destroy();
                return BadRequest(e.Message);
            }
        }


        [HttpPost]
        [Route("create")]
        [Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.SOMA.TotalEfectivoCaja.Add parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;

            ConexionBD.database.BeginTransaction();
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            var fechaNow = DateTime.Now.ToString("yyyy-MM-dd");
            try
            {

                var movSis = await ConexionBD.database.QueryAsync<ArqueoMovSistemaW>("SELECT m.CajaID, m.MovimientoID, ccb.CuentaBancoID , ccb.NumeroCuenta,UPPER(A.Producto) as Producto,tm.CveMovimientoID, "
    + "         UPPER(tm.TipoMovimiento) as DescMovimiento, "
    + "	        convert(varchar(max),CAST((SUM(m.Importe))AS MONEY),1) as Total "
    + "			FROM Tesoreria.CatalogoCajas cc "
    + "			JOIN Bancos.Movimientos m on cc.CajaID=m.CajaID "
    + "			JOIN Bancos.TiposMovimientos tm ON m.TipoMovimientoID=tm.Id "
    + "			JOIN Bancos.CatalogoCuentasBancos CCB ON m.CuentaID = CCB.CuentaBancoID "
    + "			JOIN Creditos.Productos A ON CCB.ProductoID = A.ProductoID "
    + "		    WHERE cc.CajaID = @0 AND m.CatEstatusMovID = 1  and cast(m.FechaCaptura as date) IN (cast(@1 as date)) "
    + "         AND m.MovimientoID NOT IN (SELECT amd.MovimientoID FROM Tesoreria.ArqueosMovsDetalle amd WHERE amd.CajaID= @2 AND cast(amd.FechaCaptura as date) IN (cast(@3 as date)) ) "
    + "		    GROUP BY m.CajaID, m.MovimientoID ,ccb.cuentaBancoId, ccb.NumeroCuenta, A.Producto, tm.CveMovimientoID, tm.TipoMovimiento, tm.Factor", parData.cajaID, fechaNow, parData.cajaID, fechaNow).ToArrayAsync();

                var saldosIniciales = await ConexionBD.database.QueryAsync<ArqueoMovSistemaW>("SELECT ccb.NumeroCuenta,UPPER(a.Producto) as Producto,'_SINI' as CveMovimiento,"
     + "          'SALDO INICIAL:', "
     + "	        convert(varchar(max),CAST(COALESCE(SUM(tm.Factor * m.Importe),0)AS MONEY),1) as Total"
     + "	        FROM Bancos.Movimientos m"
     + "	        JOIN Bancos.TiposMovimientos tm ON m.TipoMovimientoID = tm.Id"
     + "	        JOIN Bancos.CatalogoCuentasBancos ccb ON m.CuentaID = ccb.CuentaBancoID"
     + "	        JOIN Creditos.Productos a ON a.ProductoID = m.ProductoID"
     + "	        WHERE CONVERT(DATETIME, FLOOR(CONVERT(FLOAT, m.FechaCaptura))) = @0 "
     + "	        AND m.Observaciones = 'Deposito Automático de Boveda a Caja'"
     + "	        AND m.CajaId =@1 GROUP BY ccb.NumeroCuenta,a.Producto", fechaNow, parData.cajaID).ToArrayAsync();

                var Arqueos = await ConexionBD.database.QueryAsync<Arqueos>("select TOP(1) * from Tesoreria.Arqueos a order by Fecha desc").SingleOrDefaultAsync();

                var Caja = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.CatalogoCajas>("WHERE CajaID=@0", parData.cajaID).SingleOrDefaultAsync();
                Caja.Cerrada = true;
                await ConexionBD.database.UpdateAsync(Caja);

                var arqueoNvo = new Arqueos()
                {
                    UsuarioRealiza = UsuarioActual.Nombre,
                    Fecha = DateTime.Now,
                    CajaID = parData.cajaID
                };
                await ConexionBD.database.InsertAsync(arqueoNvo);

                foreach (var item in movSis)
                {
                    var arqueoMov = new ArqueosMovsDetalle
                    {
                        ArqueoID = arqueoNvo.ArqueoID,
                        MovimientoID = item.MovimientoID,
                        CuentaBancoID = item.CuentaBancoID,
                        Total = (decimal)Convert.ToDouble(item.Total),
                        CajaID = item.CajaID,
                        FechaCaptura = DateTime.Now
                    };
                    await ConexionBD.database.InsertAsync(arqueoMov);
                }


                if (Arqueos != null)
                {
                    var saldosAperturaCaja = await ConexionBD.database.QueryAsync<ArqueoSaldosCuentas>("WHERE ArqueoID=@0", Arqueos.ArqueoID).ToArrayAsync();

                    foreach (var item in saldosAperturaCaja)
                    {
                        var totalC = item.SaldoCierre;
                        var arqueoSaldo = new ArqueosSaldos()
                        {
                            TipoMovimiento = "SI",
                            Cuenta = item.NumeroCuenta,
                            Producto = item.Producto,
                            CveMovDesc = item.CveMovDesc,
                            Total = Convert.ToDecimal(totalC),
                            ArqueoID = arqueoNvo.ArqueoID
                        };
                        await ConexionBD.database.InsertAsync(arqueoSaldo);
                    }
                }


                var CuentasEnOperacion = await ConexionBD.database.QueryAsync<SaldosOperacionesCaja_VW>("WHERE CajaID = @0", parData.cajaID).ToArrayAsync();

                foreach (var item in CuentasEnOperacion)
                {
                    var arqueoCuentasOperacion = new ArqueoSaldosCuentas()
                    {
                        ArqueoID = arqueoNvo.ArqueoID,
                        FechaCaptura = DateTime.Now,
                        CuentaBancoID = (int)item.CuentaBancoId,
                        NumeroCuenta = item.NumeroCuenta,
                        SaldoCierre = (decimal)item.SaldoActual,
                        TipoMovimiento = item.TipoMovimientoID,
                        CveMovDesc = item.TipoMovimiento,
                        Producto = item.Producto,
                        ProductoID = item.ProductoID

                    };
                    await ConexionBD.database.InsertAsync(arqueoCuentasOperacion);
                }

                foreach (var item in movSis)
                {
                    var totalC = item.Total;
                    var arqueoMovimientos = new ArqueosSaldos()
                    {
                        TipoMovimiento = "MS",
                        Cuenta = item.NumeroCuenta,
                        Producto = item.Producto,
                        CveMovDesc = item.DescMovimiento,
                        Total = Convert.ToDecimal(totalC),
                        ArqueoID = arqueoNvo.ArqueoID
                    };
                    await ConexionBD.database.InsertAsync(arqueoMovimientos);

                }

                foreach (var item in parData.totalEfectivoCaja)
                {
                    var totalXefectivo = new ArqueosDetalle()
                    {
                        CatDenomEfectivoID = item.catDenomEfectivoID,
                        Cantidad = item.cantidad,
                        TotalXEfectivo = item.totalXEfectivo,
                        CajaID = item.CajaID,
                        Fecha = DateTime.Now,
                        ArqueoID = arqueoNvo.ArqueoID,
                    };
                    await ConexionBD.database.InsertAsync(totalXefectivo);

                }
                ConexionBD.database.CompleteTransaction();
                await this.ConexionBD.Destroy();
                return Ok();
            }
            catch (Exception ex)
            {
                ConexionBD.database.AbortTransaction();
                await this.ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }


        ////// * PENDIENTE BANDERA PARA SABER SI YA ESTA HECHO EL CIERRE O NO * 
        [HttpPut]
        [Route("update/{id}/{fecha}")]
        [Authorize]
        //   [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.SOMA.TotalEfectivoCaja.Update parData, int id, string fecha)
        {
            try
            {
                var totalEfectivo = await ConexionBD.database.SingleByIdAsync<TotalEfectivoCaja>(id);
                await this.ConexionBD.Destroy();
                return Ok(totalEfectivo);
            }
            catch (Exception ex)
            {
                await this.ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }
        [HttpGet]
        [Route("printBoveda/{BovedaID}/{ArqueoBovedaID}")]
        [Authorize]
        public async Task<IActionResult> PrintArqueoBoveda(int BovedaID, int ArqueoBovedaId)
        {
            try
            {

                var arqueoBoveda = await ConexionBD.database.QueryAsync<ArqueosBovedas_VW>("WHERE ArqueoBovedaID = @0", ArqueoBovedaId).SingleOrDefaultAsync();
                if (arqueoBoveda != null)
                {
                    var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                    var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                    var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");
                    var listado_archivos = new List<string>();
                    var Count = 0;

                    NumberFormatInfo nfi = new CultureInfo(CultureInfo.CurrentCulture.ToString(), false).NumberFormat;
                    var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "ArqueosBovedas", "Caratula.html"));
                    html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                    html = html.Replace("@@IMPRIMIO", UsuarioActual.Nombre);
                    html = html.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                    html = html.Replace("@@NOMBRE_REALIZA_ARQUEO", arqueoBoveda.Nombre.ToString());
                    html = html.Replace("@@FECHA_CORTE", arqueoBoveda.FechaCaptura.ToString());
                    html = html.Replace("@@OBSERVACIONES", "-");
                    html = html.Replace("@@SUCURSAL", "N/A");
                    html = html.Replace("@@CAJA", arqueoBoveda.NombreBoveda.ToString());



                    await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")), html);
                    listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")));

                    Process p = new()
                    {
                        StartInfo = new ProcessStartInfo(PDF.RUTA_WKHTMLTOPDF())
                    };
                    p.StartInfo.Arguments = string.Concat("", string.Join(" ", listado_archivos), " ", Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
                    p.StartInfo.CreateNoWindow = true;
                    p.Start();
                    await p.WaitForExitAsync();

                    var pdf = await System.IO.File.ReadAllBytesAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));

                    var pdfStream = new MemoryStream();
                    pdfStream.Write(pdf, 0, pdf.Length);
                    pdfStream.Position = 0;

                    // Limpiamos los archivos que se utilizaron
                    foreach (var archivo in listado_archivos)
                        System.IO.File.Delete(archivo);

                    // Eliminamos el PDF
                    System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
                    //System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF_signed.pdf")));

                    // Enviamos el PDF a la UI
                    return new FileStreamResult(pdfStream, "application/pdf");
                }
                else
                {
                    await this.ConexionBD.Destroy();
                    return BadRequest();
                }


            }
            catch (Exception ex)
            {
                await this.ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("printv3/{cajaID}/{arqueoId}")]
        [Authorize]
        public async Task<IActionResult> ImprimirArqueo(int cajaId, int arqueoId)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");
                var listado_archivos = new List<string>();
                var Count = 0;
                var detalleRealiza = await ConexionBD.database.QueryAsync<ArqueoRealiza>("SELECT DISTINCT s.Nombre 'Sucursal',"
                  + "	     cc.Nombre 'NombreCaja', convert(varchar(max),tec.Fecha) Fecha, a.UsuarioRealiza 'Realiza' FROM Tesoreria.ArqueosDetalle tec "
                  + "       JOIN Tesoreria.CatalogoDenomEfectivo cde ON tec.CatDenomEfectivoID = cde.CatDenomEfectivoID "
                  + "	     JOIN Tesoreria.CatalogoCajas cc ON tec.CajaID=cc.CajaID "
                  + "	     JOIN General.Personas_VW u ON cc.PersonaID = u.PersonaID "
                  + "	     JOIN General.Sucursales s ON cc.SucursalID = s.SucursalID "
                  + "        JOIN Tesoreria.Arqueos a ON a.ArqueoID = tec.ArqueoID"
                  + "       WHERE tec.CajaID = @0 and tec.ArqueoID = @1", cajaId, arqueoId).SingleOrDefaultAsync();

                var cantidadesFisicas = await ConexionBD.database.QueryAsync<ArqueosDinFisico>("SELECT top 16 cde.Clave, cde.Concepto,convert(varchar(max),"
                 + "         tec.Cantidad) as Cantidad, convert(varchar(max),cde.ValorMonetario) as ValorMonetario,"
                 + "		   convert(varchar(max), CAST(tec.TotalXEfectivo AS money),1) as Total FROM Tesoreria.ArqueosDetalle tec"
                 + "		   JOIN Tesoreria.CatalogoDenomEfectivo cde ON tec.CatDenomEfectivoID = cde.CatDenomEfectivoID "
                 + "		   JOIN Tesoreria.CatalogoCajas cc on tec.CajaID=cc.CajaID "
                 + "	       JOIN General.Personas_VW u ON cc.PersonaID = u.PersonaID "
                 + "	       WHERE tec.CajaID = @0 and tec.ArqueoID = @1", cajaId, arqueoId).ToArrayAsync();

                var SaldosCuentasArqueos = await ConexionBD.database.
                    QueryAsync<SaldosCuentasArqueos>("SELECT DISTINCT * FROM Tesoreria.SaldosCuentasArqueos ts INNER JOIN Bancos.CatalogoCuentasBancos ccb ON ts.NumeroCuenta = ccb.NumeroCuenta WHERE  ccb.CuentaBancoID <> 15 AND CajaID=@0", cajaId).ToArrayAsync();
                // var SaldosCuentasArqueos = await ConexionBD.database.QueryAsync<SaldosCuentasArqueos>("WHERE CajaID=@0", cajaId).ToArrayAsync();

                var MovimientosArqueos = await ConexionBD.database.QueryAsync<ArqueosMovimientosCajas_VW>
                ("SELECT NumeroCuentaPrincipal, Producto, CuentaBancoID "
                + "	       , CajaID, NumeroCuenta, SUM(vw.Total) 'Total', TipoMovimiento"
                + "       FROM Tesoreria.ArqueosMovimientosCajas_VW vw"
                + "	       WHERE vw.ArqueoID = 85"
                + "       GROUP BY NumeroCuentaPrincipal, Producto, CuentaBancoID,"
                + "     CajaId, NumeroCuenta, TipoMovimiento", cajaId).ToArrayAsync();


                var GastosOperativos = await ConexionBD.database.QueryAsync<SolicitudesGastosXCaja_VW>
                (" SELECT Observaciones, FechaSolicitud, FechaAutorizada, MontoSolicitado, MontoAutorizado"
                + " FROM Tesoreria.SolicitudesGastosXCaja_VW Where EstatusClave = 'DOCS'", cajaId).ToArrayAsync();


                NumberFormatInfo nfi = new CultureInfo(CultureInfo.CurrentCulture.ToString(), false).NumberFormat;
                nfi.PercentDecimalDigits = 0;
                var fila_relacion_detalle = "";
                var registros_detalle = 0;
                var registros_saldos_iniciales = "";
                var registros_movs_sistema = "";
                var registros_gastos_operativos = "";
                var footer_mov_sistema = "";
                var footer_diferencia = "";
                var tipo_mov_anterior = "";
                var producto = "";
                decimal TotalCaja = 0;
                decimal TotalInicial = 0;
                decimal TotalMovsSitema = 0;
                decimal Operativosgastos = 0;


                foreach (var detalle in cantidadesFisicas)
                {
                    registros_detalle += 1;
                    fila_relacion_detalle += "<tr>";
                    fila_relacion_detalle += "<td class=\"text-center fs-6\">" + detalle.Clave.ToString() + "</td>";
                    fila_relacion_detalle += "<td class=\"text-center fs-6\">" + detalle.Concepto.ToString() + "</td>";
                    fila_relacion_detalle += "<td class=\"text-center fs-6\">" + detalle.Cantidad.ToString() + "</td>";
                    fila_relacion_detalle += "<td class=\"text-center fs-6\">" + detalle.ValorMonetario.ToString() + "</td>";
                    fila_relacion_detalle += "<td class=\"text-center fs-6\">" + detalle.Total.ToString() + "</td>";
                    fila_relacion_detalle += "</tr>";
                    TotalCaja += decimal.Parse(detalle.Total);
                }

                foreach (var item in SaldosCuentasArqueos)
                {
                    
                    decimal saldoCierreN = 0;
                    if (item.SaldoCierre != null)
                    { saldoCierreN = item.SaldoCierre.Value; }
                    else { saldoCierreN = 0; }
                    registros_detalle += 1;
                    registros_saldos_iniciales += "<tr>";
                    registros_saldos_iniciales += "<td class=\"text-center fs-6\">" + item.NumeroCuenta.ToString() + "</td>";
                    registros_saldos_iniciales += "<td class=\"text-center fs-6\">" + System.Web.HttpUtility.HtmlEncode(item.Producto.ToString()) + "</td>";
                    registros_saldos_iniciales += "<td class=\"text-center fs-6\">" + item.CveMovDesc.ToString() + "</td>";
                    registros_saldos_iniciales += "<td class=\"text-center fs-6\">" + saldoCierreN.ToString("C", new CultureInfo("en-US")) + "</td>";
                    registros_saldos_iniciales += "</tr>";
                    TotalInicial += item.SaldoCierre.Value;


                }
                foreach (var item in MovimientosArqueos)
                {

                    registros_movs_sistema += "<tr>";
                    registros_movs_sistema += "<td class=\"text-center fs-6\">" + item.NumeroCuenta.ToString() + "</td>";
                    registros_movs_sistema += "<td class=\"text-center fs-6\">" + item.Producto.ToString() + "</td>";
                    registros_movs_sistema += "<td class=\"text-center fs-6\">" + item.TipoMovimiento.ToString() + "</td>";
                    registros_movs_sistema += "<td class=\"text-center fs-6\">" + item.Total.ToString("C", new CultureInfo("en-US")) + "</td>";
                    registros_movs_sistema += "</tr>";
                    TotalMovsSitema += item.Total;

                }

                foreach (var item in GastosOperativos)
                {
                    registros_gastos_operativos += "<tr>";
                    registros_gastos_operativos += "<td class=\"text-center fs-6\">" + item.DescGasto.ToString() + "</td>";
                    registros_gastos_operativos += "<td class=\"text-center fs-6\">" + item.FechaSolicitud.ToString() + "</td>";
                    registros_gastos_operativos += "<td class=\"text-center fs-6\">" + item.FechaAutorizada.ToString() + "</td>";
                    registros_gastos_operativos += "<td class=\"text-center fs-6\">" + item.MontoSolicitado.ToString("C", new CultureInfo("en-US")) + "</td>";
                    registros_gastos_operativos += "<td class=\"text-center fs-6\">" + item.MontoAutorizado.ToString("C", new CultureInfo("en-US")) + "</td>";
                    registros_gastos_operativos += "</tr>";
                    Operativosgastos += item.MontoAutorizado;
                }

                footer_mov_sistema += "<tfoot>";
                footer_mov_sistema += "<tr>";
                footer_mov_sistema += " <th class=\"text-center fs-6\"></th>";
                footer_mov_sistema += " <th class=\"text-center fs-6\"></th>";
                footer_mov_sistema += "<th class=\"text-center fs-6\">Total Sistema</th>";
                footer_mov_sistema += "<th class=\"text-center fs-6\">@@TOTAL_MOVS_SISTEMA</th>";
                footer_mov_sistema += "</tr>";
                footer_mov_sistema += "</tfoot>";

                footer_diferencia += "<tfoot>";
                footer_diferencia += "<tr>";
                footer_diferencia += " <th class=\"text-center fs-6\"></th>";
                footer_diferencia += " <th class=\"text-center fs-6\"></th>";
                footer_diferencia += "<th class=\"text-center fs-6\">Diferencia</th>";
                footer_diferencia += "<th class=\"text-center fs-6\">@@TOTAL_DIFERENCIA</th>";
                footer_diferencia += "</tr>";
                footer_diferencia += "</tfoot>";

                var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Cortes", "Caratula.html"));
                html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                html = html.Replace("@@IMPRIMIO", UsuarioActual.Nombre);
                html = html.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                html = html.Replace("@@NOMBRE_REALIZA_ARQUEO", detalleRealiza.Realiza.ToString());
                html = html.Replace("@@FECHA_CORTE", detalleRealiza.Fecha.ToString());
                html = html.Replace("@@OBSERVACIONES", "-");
                html = html.Replace("@@LIMITE", UsuarioActual.Nombre.ToString());
                html = html.Replace("@@CAJA", detalleRealiza.NombreCaja.ToString());
                html = html.Replace("@@SUCURSAL", detalleRealiza.Sucursal.ToString());
                html = html.Replace("@@DETALLE_RELACION", fila_relacion_detalle);
                html = html.Replace("@@TOTALFISICO", TotalCaja.ToString("C", new CultureInfo("en-US")));
                html = html.Replace("@@SALDOS_INICIALES", registros_saldos_iniciales);
                html = html.Replace("@@TOTAL_SALDOS_INICIALES", TotalInicial.ToString("C", new CultureInfo("en-US")));

                await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")), html);

                listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")));

                html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Cortes", "Detalle.html"));
                html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                html = html.Replace("@@MOVS_SISTEMA", registros_movs_sistema);
                html = html.Replace("@@GASTOS", registros_gastos_operativos);
                html = html.Replace("@@FOOTER_MOVS_SISTEMA", footer_mov_sistema);
                html = html.Replace("@@TOTAL_MOVS_SISTEMA", TotalMovsSitema.ToString("C", new CultureInfo("en-US")));
                html = html.Replace("@@FOOTER_DIFERENCIA", footer_diferencia);
                html = html.Replace("@@TOTAL_SISTEMA_FINAL", (TotalMovsSitema + TotalInicial).ToString("C", new CultureInfo("en-US")));
                html = html.Replace("@@TOTAL_FISICO_FINAL", TotalCaja.ToString("C", new CultureInfo("en-US")));
                html = html.Replace("@@OPERATIVOS", Operativosgastos.ToString("C", new CultureInfo("en-US")));
                html = html.Replace("@@TOTAL_DIFERENCIA", ((TotalInicial + TotalMovsSitema + Operativosgastos) - TotalCaja).ToString("C", new CultureInfo("en-US")));

                await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "2_" + Count.ToString() + ".html")), html);
                listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "2_" + Count.ToString() + ".html")));

                // Ejecutamos el proceso de wkhtmltopdf
                Process p = new()
                {
                    StartInfo = new ProcessStartInfo(PDF.RUTA_WKHTMLTOPDF())
                };
                p.StartInfo.Arguments = string.Concat("", string.Join(" ", listado_archivos), " ", Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
                p.StartInfo.CreateNoWindow = true;
                p.Start();
                await p.WaitForExitAsync();

                // Obtenemos el contenido de nuestro archivo de PDF
                var pdf = await System.IO.File.ReadAllBytesAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
                //var pdf = await System.IO.File.ReadAllBytesAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF_signed.pdf")));

                // Obtenemos nuestro PDF
                var pdfStream = new MemoryStream();
                pdfStream.Write(pdf, 0, pdf.Length);
                pdfStream.Position = 0;

                // Limpiamos los archivos que se utilizaron
                foreach (var archivo in listado_archivos)
                    System.IO.File.Delete(archivo);

                // Eliminamos el PDF
                System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
                //System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF_signed.pdf")));

                // Enviamos el PDF a la UI
                return new FileStreamResult(pdfStream, "application/pdf");


            }
            catch (Exception ex)
            {
                await this.ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("print/{cajaID}/{arqueoId}")]
        [Authorize]
        public async Task<IActionResult> Print(int cajaId, int arqueoId)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");
                var listado_archivos = new List<string>();
                var Count = 0;

                var detalleRealiza = await ConexionBD.database.QueryAsync<ArqueoRealiza>("SELECT DISTINCT s.Nombre 'Sucursal',"
       + "	     cc.Nombre 'NombreCaja', convert(varchar(max),tec.Fecha) Fecha, UPPER(convert(varchar(max), u.PersonaID) +'    '+ u.NombreCompleto ) 'Realiza' FROM Tesoreria.ArqueosDetalle tec "
       + "       JOIN Tesoreria.CatalogoDenomEfectivo cde ON tec.CatDenomEfectivoID = cde.CatDenomEfectivoID "
       + "	     JOIN Tesoreria.CatalogoCajas cc ON tec.CajaID=cc.CajaID "
       + "	     JOIN General.Personas_VW u ON cc.PersonaID = u.PersonaID "
       + "	     JOIN General.Sucursales s ON cc.SucursalID = s.SucursalID "
       + "       WHERE tec.CajaID = @0 and tec.ArqueoID = @1", cajaId, arqueoId).SingleOrDefaultAsync();

                var cantidadesFisicas = await ConexionBD.database.QueryAsync<ArqueosDinFisico>("SELECT cde.Clave, cde.Concepto,convert(varchar(max),"
       + "         tec.Cantidad) as Cantidad, convert(varchar(max),cde.ValorMonetario) as ValorMonetario,"
       + "		   convert(varchar(max), CAST(tec.TotalXEfectivo AS money),1) as Total FROM Tesoreria.ArqueosDetalle tec"
       + "		   JOIN Tesoreria.CatalogoDenomEfectivo cde ON tec.CatDenomEfectivoID = cde.CatDenomEfectivoID "
       + "		   JOIN Tesoreria.CatalogoCajas cc on tec.CajaID=cc.CajaID "
       //+ "	       JOIN Tesoreria.CuentasContables c on cc.CuentaID = c.CuentaID "
       + "	       JOIN General.Personas_VW u ON cc.PersonaID = u.PersonaID "
       + "	       WHERE tec.CajaID = @0 and tec.ArqueoID = @1", cajaId, arqueoId).ToArrayAsync();

                var detalleSaldosCorte = await ConexionBD.database.QueryAsync<ArqueosSaldos>("WHERE ArqueoID = @0", arqueoId).ToArrayAsync();

                NumberFormatInfo nfi = new CultureInfo(CultureInfo.CurrentCulture.ToString(), false).NumberFormat;
                nfi.PercentDecimalDigits = 0;
                var fila_relacion_detalle = "";
                var registros_detalle = 0;
                var registros_saldos_iniciales = "";
                var registros_movs_sistema = "";
                var footer_mov_sistema = "";
                var footer_diferencia = "";
                var tipo_mov_anterior = "";
                var producto = "";
                decimal TotalCaja = 0;
                decimal TotalInicial = 0;
                decimal TotalMovsSitema = 0;


                foreach (var detalle in cantidadesFisicas)
                {
                    registros_detalle += 1;
                    fila_relacion_detalle += "<tr>";
                    fila_relacion_detalle += "<td class=\"text-center fs-6\">" + detalle.Clave.ToString() + "</td>";
                    fila_relacion_detalle += "<td class=\"text-center fs-6\">" + detalle.Concepto.ToString() + "</td>";
                    fila_relacion_detalle += "<td class=\"text-center fs-6\">" + detalle.Cantidad.ToString() + "</td>";
                    fila_relacion_detalle += "<td class=\"text-center fs-6\">" + detalle.ValorMonetario.ToString() + "</td>";
                    fila_relacion_detalle += "<td class=\"text-center fs-6\">" + detalle.Total.ToString() + "</td>";
                    fila_relacion_detalle += "</tr>";
                    TotalCaja += decimal.Parse(detalle.Total);
                }
                foreach (var item in detalleSaldosCorte)
                {


                    if (item.TipoMovimiento.Equals("SI"))
                    {
                        registros_saldos_iniciales += "<tr>";
                        registros_saldos_iniciales += "<td class=\"text-center fs-6\">" + item.Cuenta.ToString() + "</td>";
                        registros_saldos_iniciales += "<td class=\"text-center fs-6\">" + item.Producto.ToString() + "</td>";
                        registros_saldos_iniciales += "<td class=\"text-center fs-6\">" + item.CveMovDesc.ToString() + "</td>";
                        registros_saldos_iniciales += "<td class=\"text-center fs-6\">" + item.Total.ToString("C", new CultureInfo("en-US")) + "</td>";
                        registros_saldos_iniciales += "</tr>";
                        TotalInicial += item.Total;
                    }
                    if (item.TipoMovimiento.Equals("MS"))
                    {
                        if (tipo_mov_anterior.Equals(""))
                        {
                            tipo_mov_anterior = item.Cuenta.ToString();
                            registros_movs_sistema += "<tr>";
                            registros_movs_sistema += "<td class=\"text-center fs-6\">" + item.Cuenta.ToString() + "</td>";
                            registros_movs_sistema += "<td class=\"text-center fs-6\">" + item.Producto.ToString() + "</td>";
                            registros_movs_sistema += "<td class=\"text-center fs-6\">" + item.CveMovDesc.ToString() + "</td>";
                            registros_movs_sistema += "<td class=\"text-center fs-6\">" + item.Total.ToString("C", new CultureInfo("en-US")) + "</td>";
                            registros_movs_sistema += "</tr>";
                            TotalMovsSitema += item.Total;
                        }
                        else
                        {
                            if (tipo_mov_anterior.Equals(item.Cuenta.ToString()))
                            {
                                registros_movs_sistema += "<tr>";
                                registros_movs_sistema += "<td class=\"text-center fs-6\">" + "</td>";
                                registros_movs_sistema += "<td class=\"text-center fs-6\">" + "</td>";
                                registros_movs_sistema += "<td class=\"text-center fs-6\">" + item.CveMovDesc.ToString() + "</td>";
                                registros_movs_sistema += "<td class=\"text-center fs-6\">" + item.Total.ToString("C", new CultureInfo("en-US")) + "</td>";
                                registros_movs_sistema += "</tr>";
                                TotalMovsSitema += item.Total;
                            }
                            else
                            {
                                tipo_mov_anterior = item.Cuenta.ToString();
                                registros_movs_sistema += "<tr>";
                                registros_movs_sistema += "<td class=\"text-center fs-6\">" + item.Cuenta.ToString() + "</td>";
                                registros_movs_sistema += "<td class=\"text-center fs-6\">" + item.Producto.ToString() + "</td>";
                                registros_movs_sistema += "<td class=\"text-center fs-6\">" + item.CveMovDesc.ToString() + "</td>";
                                registros_movs_sistema += "<td class=\"text-center fs-6\">" + item.Total.ToString("C", new CultureInfo("en-US")) + "</td>";
                                registros_movs_sistema += "</tr>";
                                TotalMovsSitema += item.Total;
                            }
                        }

                    }
                }

                footer_mov_sistema += "<tfoot>";
                footer_mov_sistema += "<tr>";
                footer_mov_sistema += " <th class=\"text-center fs-6\"></th>";
                footer_mov_sistema += " <th class=\"text-center fs-6\"></th>";
                footer_mov_sistema += "<th class=\"text-center fs-6\">Total Sistema</th>";
                footer_mov_sistema += "<th class=\"text-center fs-6\">@@TOTAL_MOVS_SISTEMA</th>";
                footer_mov_sistema += "</tr>";
                footer_mov_sistema += "</tfoot>";

                footer_diferencia += "<tfoot>";
                footer_diferencia += "<tr>";
                footer_diferencia += " <th class=\"text-center fs-6\"></th>";
                footer_diferencia += " <th class=\"text-center fs-6\"></th>";
                footer_diferencia += "<th class=\"text-center fs-6\">Diferencia</th>";
                footer_diferencia += "<th class=\"text-center fs-6\">@@TOTAL_DIFERENCIA</th>";
                footer_diferencia += "</tr>";
                footer_diferencia += "</tfoot>";
                var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Cortes", "Caratula.html"));
                html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                html = html.Replace("@@IMPRIMIO", UsuarioActual.Nombre);
                html = html.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                html = html.Replace("@@NOMBRE_REALIZA_ARQUEO", detalleRealiza.Realiza.ToString());
                html = html.Replace("@@FECHA_CORTE", detalleRealiza.Fecha.ToString());
                html = html.Replace("@@OBSERVACIONES", "-");
                html = html.Replace("@@LIMITE", UsuarioActual.Nombre.ToString());
                html = html.Replace("@@CAJA", detalleRealiza.NombreCaja.ToString());
                html = html.Replace("@@SUCURSAL", detalleRealiza.Sucursal.ToString());
                html = html.Replace("@@DETALLE_RELACION", fila_relacion_detalle);
                html = html.Replace("@@TOTALFISICO", TotalCaja.ToString("C", new CultureInfo("en-US")));
                html = html.Replace("@@SALDOS_INICIALES", registros_saldos_iniciales);
                html = html.Replace("@@TOTAL_SALDOS_INICIALES", TotalInicial.ToString("C", new CultureInfo("en-US")));

                await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")), html);

                listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")));



                html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Cortes", "Detalle.html"));
                html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                html = html.Replace("@@MOVS_SISTEMA", registros_movs_sistema);
                html = html.Replace("@@FOOTER_MOVS_SISTEMA", footer_mov_sistema);
                html = html.Replace("@@TOTAL_MOVS_SISTEMA", TotalMovsSitema.ToString("C", new CultureInfo("en-US")));
                html = html.Replace("@@FOOTER_DIFERENCIA", footer_diferencia);
                html = html.Replace("@@TOTAL_SISTEMA_FINAL", TotalMovsSitema.ToString("C", new CultureInfo("en-US")));
                html = html.Replace("@@TOTAL_FISICO_FINAL", TotalCaja.ToString("C", new CultureInfo("en-US")));
                html = html.Replace("@@TOTAL_DIFERENCIA", (TotalInicial - Math.Abs(TotalMovsSitema)).ToString("C", new CultureInfo("en-US")));

                await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "2_" + Count.ToString() + ".html")), html);
                listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "2_" + Count.ToString() + ".html")));

                // Ejecutamos el proceso de wkhtmltopdf
                Process p = new()
                {
                    StartInfo = new ProcessStartInfo(PDF.RUTA_WKHTMLTOPDF())
                };
                p.StartInfo.Arguments = string.Concat("", string.Join(" ", listado_archivos), " ", Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
                p.StartInfo.CreateNoWindow = true;
                p.Start();
                await p.WaitForExitAsync();

                // Obtenemos el contenido de nuestro archivo de PDF
                var pdf = await System.IO.File.ReadAllBytesAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
                //var pdf = await System.IO.File.ReadAllBytesAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF_signed.pdf")));

                // Obtenemos nuestro PDF
                var pdfStream = new MemoryStream();
                pdfStream.Write(pdf, 0, pdf.Length);
                pdfStream.Position = 0;

                // Limpiamos los archivos que se utilizaron
                foreach (var archivo in listado_archivos)
                    System.IO.File.Delete(archivo);

                // Eliminamos el PDF
                System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
                //System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF_signed.pdf")));

                // Enviamos el PDF a la UI
                return new FileStreamResult(pdfStream, "application/pdf");


                //return new NotFoundObjectResult(new { Id = 2, error = "No se encontro intormación" });
            }
            catch (Exception ex)
            {
                await this.ConexionBD.Destroy();
                return BadRequest("ERROR: " + ex.Message);
            }
        }
    }
}