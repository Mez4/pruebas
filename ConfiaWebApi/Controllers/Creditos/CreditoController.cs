using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Distribuidores;
using DBContext.DBConfia.General;
using System.Collections;
using System.Collections.Generic;
using DBContext.DBConfia.Seguridad;
using DBContext.DBConfia.Custom.Creditos;
using DBContext.DBConfia.dbo;
using DBContext.DBConfia.Bancos;
using DBContext.DBConfia.Tesoreria;
using Microsoft.Data.SqlClient;
using System.Data;
using NPoco;
using ConfiaWebApi.Controllers.General;
using Microsoft.AspNetCore.Hosting;
using ConfiaWebApi.PeticionesRest.General.CodigoSMS;
using DBContext.DBConfia.Catalogos;
using iText.Kernel.Pdf.Canvas;
using iText.Kernel.Pdf;
using iText.Layout.Element;
using DBContext.DBConfia.Balances;
using ConfiaWebApi.PeticionesRest.SOMA.ArqueosV2;
using Path = System.IO.Path;
using System.IO;
using ConfiaWebApi.Code;
using System.Diagnostics;
using System.Web;
using System.Globalization;
using ConfiaWebApi.PeticionesRest.Creditos.Credito;
using System.Drawing.Imaging;
using Chilkat;

namespace ConfiaWebApi.Controllers.Creditos
{
    [Authorize]
    [ApiController]
    [Route("api/Creditos/[controller]")]
    public class CreditoController : ControllerBase
    {
        private DBConfiaContext ConexionBD;
        private readonly IWebHostEnvironment env;

        public CreditoController(DBConfiaContext _ConexionBD)
        {
            ConexionBD = _ConexionBD;
        }


        [HttpPost]
        [Route("cancel")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Cancelar(PeticionesRest.Creditos.Credito.Cancel parData)
        {
            try
            {

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var Credito = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoID = @CreditoID", parData).FirstOrDefaultAsync();

                var existMovimientos = await ConexionBD.database.QueryAsync<Movimientos>("WHERE MovimientoID=@0", Credito.MovimientoID).ToArrayAsync();

                var obj = new
                {
                    CreditoID = parData.CreditoID,
                    Motivo = parData.MvCancelacion,
                    TipoCancelacionID = parData.TipoCancelacionID,
                    UsuarioID = UsuarioActual.UsuarioID
                };

                string Stored = "EXEC Creditos.pa_CancelarCredito_Ins @CreditoID, @Motivo, @TipoCancelacionID, @UsuarioID";

                var res = await ConexionBD.database.QueryAsync<CancelRes>(Stored, obj).FirstOrDefaultAsync();

                //var res = await ConexionBD.database.QueryAsync<CancelRes>(Stored, obj).FirstOrDefaultAsync();

                await ConexionBD.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }



        [HttpPost]
        [Route("updateSpeiaEfectivo")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> updateSpeiaEfectivo(PeticionesRest.Creditos.Credito.CambioTipoDesembolso parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<Usuarios>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var Credito = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoID = @CreditoID", parData).FirstOrDefaultAsync();

                var obj = new
                {
                    CreditoID = parData.CreditoID,
                    CajaID = parData.CajaID,
                    UsuarioID = UsuarioActual.UsuarioID,
                    PersonaID = UsuarioActual.PersonaID,
                };

                string Stored = "EXEC dbo.pa_UpdateCreditosSpeiaEfectivo @CreditoID, @CajaID, @UsuarioID, @PersonaID";

                var res = await ConexionBD.database.QueryAsync<CambioTipoDesembolsoRes>(Stored, obj).FirstOrDefaultAsync();
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        [Route("getTipoDesembolsoSPEI")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getTipoDesembolsoSPEI()
        {
            try
            {
                var res = await ConexionBD.database.QueryAsync<TiposDesembolso>("EXEC pa_TiposDesembolso").ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        //CREAR PERMISO PENDIENTE PARA ROL
        [HttpGet]
        [Route("obtenerQuitaPorcentaje")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerQuitaPorcentaje()
        {
            try
            {
                // string sql = "SELECT * FROM Reestructura.QuitaPorcentajes";
                var quita = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Reestructura.QuitaPorcentajes>();
                await ConexionBD.Destroy();
                // return Ok(new
                // {
                //     status = true,
                //     msg = "OK",
                //     data = quita
                // });
                return Ok(quita);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
                // return BadRequest(new
                // {
                //     status = false,
                //     msg = ex.Message,
                //     data = new { }
                // });
            }
        }
        // CREAR PERMISO PENDIENTE PARA ROL
        [HttpPost]
        [Route("obtenerDistribuidor")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> obtenerDistribuidor(DBContext.DBConfia.Distribuidores.Distribuidores parData)
        {
            try
            {
                // var credito = (await ConexionBD.database.QueryAsync<DBContext.DBConfia.Reestructu>("SELECT SUM(cv.SaldoActual) 'SaldoActual', SUM(cv.SaldoAtrasado) 'DiasAtraso' FROM Creditos.Creditos_VW cv WHERE DistribuidorID = @0 AND Activo = 1", parData.DistribuidorID).SingleOrDefaultAsync());

                var credito = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos_VW>("WHERE DistribuidorID = @0 AND Activo = 1 AND EstatusID = 'A' AND CondicionesID <> 0 AND SaldoActual > 0.9 ", parData.DistribuidorID).ToArrayAsync();

                var creditoSalida = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("select * from Creditos.Creditos c " +
                "join Creditos.Contratos cc on c.ContratoID = cc.ContratoID " +
                "join Distribuidores.Distribuidores d on d.DistribuidorID = cc.DistribuidorID " +
                "where d.DistribuidorID=@0 and c.EstatusID='A' AND c.SaldoActual > 0.9 ", parData.DistribuidorID).ToArrayAsync();

                var saldoreconvenio = await ConexionBD.database.QueryAsync<ConfiaWebApi.ModlesSP.Reestructuras.SaldoReconvenio>("EXEC Reestructura.pa_SaldoReconvenio @DistribuidorID", parData).ToArrayAsync();

                var saldoEmerg = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Cortes.RelacionCortes>("SELECT TOP 1 * from Cortes.RelacionCortes WHERE DistribuidorID = @0 ORDER BY fechacorte desc", parData.DistribuidorID).ToArrayAsync();

                var EstatusID = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Distribuidores.Distribuidores>("WHERE DistribuidorID = @0", parData.DistribuidorID).FirstOrDefaultAsync();

                //retornar un objeto
                var obj = new
                {
                    saldoActual = credito.Sum(x => x.SaldoActual),
                    saldoAtrasado = credito.Sum(x => x.SaldoAtrasado),
                    saldoActualEmergencia = saldoEmerg.Sum(x => x.SaldoActual),
                    saldoAtrasadoEmergencia = saldoEmerg.Sum(x => x.saldoAtrasado),
                    saldoActualSalida = creditoSalida.Sum(x => x.SaldoActual),
                    saldoAtrasadoSalida = creditoSalida.Sum(x => x.SaldoAtrasado),
                    saldoReconvenio = saldoreconvenio.Sum(x => x.TotalCapital),
                    saldoAtrasadoReconvenio = saldoreconvenio.Sum(x => x.SaldoAtrasado),
                    EstatusID = EstatusID == null ? "" : EstatusID.DistribuidoresEstatusID,
                };
                //close connection
                await ConexionBD.Destroy();
                return Ok(obj);
                // return Ok("Hola");
            }
            catch (Exception e)
            {
                return BadRequest(new
                {
                    status = false,
                    msg = e.Message,
                    data = new { }
                });

            }
        }


        [HttpPost]
        [Route("getTipoCancelacion")]
        [Authorize]
        public async Task<IActionResult> GetTipoCancelacion()
        {
            try
            {
                var Credito = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Creditos.TiposCancelacion>();
                await ConexionBD.Destroy();
                return Ok(Credito);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("getUltimoBeneficiario")]
        [Authorize]
        public async Task<IActionResult> GetUltimoBeneficiario(PeticionesRest.Creditos.Credito.Get parData)
        {
            try
            {
                var Credito = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE ClienteID = @0 ORDER BY FechaHoraRegistro DESC", parData.ClienteID).ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(Credito[0]);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("cambiarsuccaja")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> CambiarSucCaja(PeticionesRest.Creditos.Credito.Modificar parData)
        {
            try
            {
                var Credito = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoID = @CreditoID", parData).FirstOrDefaultAsync();

                if (Credito.MovimientoID == null)
                {
                    if (Credito.CreditoZona == false)
                    {
                        Credito.SucursalID = parData.SucursalID;
                        Credito.CajaID = parData.CajaID;
                        await ConexionBD.database.UpdateAsync(Credito);
                    }
                    
                    var res = new
                    {
                        res = 1,
                        msj = "Se modifico el Crédito con el Id: " + Credito.CreditoID.ToString(),
                        Data = Credito
                    };
                    await ConexionBD.Destroy();
                    return Ok(res);
                }
                else
                {
                    var res = new
                    {
                        res = 0,
                        msj = "El crédito ya ha sido desembolsado por lo que no es posible modificar lo, id del movimiento: " + Credito.MovimientoID.ToString(),
                        Data = Credito
                    };
                    await ConexionBD.Destroy();
                    return Ok(res);
                }
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("Autorizar")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Autorizar(PeticionesRest.Creditos.Credito.Cancel parData)
        {
            try
            {
                var Credito = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoID = @CreditoID", parData).FirstOrDefaultAsync();

                if (Credito.MovimientoID == null)
                {
                    Credito.Autorizado = true;
                    await ConexionBD.database.UpdateAsync(Credito);

                    var Cliente = await ConexionBD.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE PersonaID = @ClienteID", Credito).FirstOrDefaultAsync();
                    CodigoSMSController CodSMS = new(ConexionBD, env);
                    var desembolsoString = Credito.TipoDesembolsoID == 5 ? "Por favor acuda a Sucursal para continuar con el tramite" : "";

                    SMS DataSMS = new()
                    {
                        PersonaID = Credito.ClienteID,
                        TelefonoMovil = Cliente.TelefonoMovil,
                        MSG = $"Hola {Cliente.Nombre}, tu crédito prestamo personal fue autorizado. {desembolsoString}",
                        Referencia = "CODIGO",
                    };

                    var r = await CodSMS.SMS(DataSMS);
                    var res = new
                    {
                        res = 1,
                        msj = "Se autorizó el Crédito con el Id: " + Credito.CreditoID.ToString(),
                        Data = Credito
                    };
                    await ConexionBD.Destroy();
                    return Ok(res);
                }
                else
                {
                    var res = new
                    {
                        res = 0,
                        msj = "El crédito ya ha sido desembolsado por lo que no es posible autorizarlo, id del movimiento: " + Credito.MovimientoID.ToString(),
                        Data = Credito
                    };
                    await ConexionBD.Destroy();
                    return Ok(res);
                }
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("desembolsar")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> Desembolsar(PeticionesRest.Creditos.Credito.Desembolso parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {   
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                // var UsuarioActual = await ConexionBD.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
                // var PersonaActual = await ConexionBD.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.ID).FirstOrDefaultAsync();

                var Credito = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoID = @0", parData.CreditoID).FirstOrDefaultAsync();
var socia = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Contratos>("WHERE ContratoID = @0",Credito.ContratoID).FirstOrDefaultAsync();
                var Producto = await ConexionBD.database.QueryAsync<Productos>("WHERE ProductoID = @0", Credito.ProductoID).FirstOrDefaultAsync();

                if (Producto.Canje)
                {

                    var VarDiasCad = await ConexionBD.database.QueryAsync<VariablesGlobales>("WHERE (varName = @0)", "DIAS_CADUCIDAD_JERARQUIA").FirstOrDefaultAsync();

                    decimal DiasCad = 0M;

                    if (VarDiasCad == null)
                    {
                        var errVar = new
                        {
                            res = 0,
                            msj = "No existe la variable global DIAS_CADUCIDAD_JERARQUIA repórtelo a sistemas.",
                            Data = new { }
                        };

                        await ConexionBD.Destroy();
                        return Ok(errVar);
                    }
                    else
                    {

                        
var Vale = await ConexionBD.database.QueryAsync<ValeraDetalle_VW>("WHERE  (serieId = @0) AND (Folio = @1) AND DistribuidorID = @2", Credito.SerieId,Credito.ValeCanje,socia.DistribuidorID).FirstOrDefaultAsync();
                        switch (VarDiasCad.varValue.ToString())
                        {
                            case "P":

                                if (Vale.ValeDigital)
                                {
                                    DiasCad = Producto.DiasCaducidadFolio.Value;
                                }
                                else
                                {
                                    DiasCad = Producto.DiasCaducidadVale.Value;
                                }

                                break;
                            case "V":

                                DiasCad = Vale.DiasCaducidad.Value;

                                break;
                            default:
                                var errVar = new
                                {
                                    res = 0,
                                    msj = "No existe implementacion para la variable global DIAS_CADUCIDAD_JERARQUIA con el valor: " + VarDiasCad.varValue.ToString() + ", repórtelo a sistemas.",
                                    Data = new { }
                                };

                                await ConexionBD.Destroy();
                                return Ok(errVar);
                        }
                        
                        // Variables Globales 1
                        var RangoDiasIncial08 = await ConexionBD.database.QueryAsync<VariablesGlobales>("WHERE (varName = @0)", "RANGO_DIAS_FINAL_CORTE_08").FirstOrDefaultAsync();
                        var RangoDiasIncial23 = await ConexionBD.database.QueryAsync<VariablesGlobales>("WHERE (varName = @0)", "RANGO_DIAS_FINAL_CORTE_23").FirstOrDefaultAsync();
                        // Variables Globales 2
                        var RangoDiasFinal1 = await ConexionBD.database.QueryAsync<VariablesGlobales>("WHERE (varName = @0)", "RANGO_DIAS_INICIAL_CORTE1").FirstOrDefaultAsync();
                        var RangoDiasFinal2 = await ConexionBD.database.QueryAsync<VariablesGlobales>("WHERE (varName = @0)", "RANGO_DIAS_INICIAL_CORTE2").FirstOrDefaultAsync();


                         // Verificar si las varables Globales Existen.
                        if (RangoDiasIncial08 == null || RangoDiasIncial23 == null || RangoDiasFinal1 == null ||RangoDiasFinal2 == null)
                        {
                            var errVar = new
                                {
                                    res = 0,
                                    msj = "No existe implementacion para la variable global 'DIAS_CADUCIDAD_CORTE_DIA8 o DIAS_CADUCIDAD_CORTE_DIA23' con el día: 08 o 23, repórtelo a sistemas.",
                                    Data = new { }
                                };

                                await ConexionBD.Destroy();
                                return Ok(errVar);
                        }
                        
                        // Convierte los varValue (object) a un entero.
                        int diasCorteFinal08 = Convert.ToInt32(RangoDiasIncial08.varValue);//8
                        int diasCorteFinal23 = Convert.ToInt32(RangoDiasIncial23.varValue);//23
                        int diasCorteIncial1 = Convert.ToInt32(RangoDiasFinal1.varValue); //24
                        int diasCorteIncial2 = Convert.ToInt32(RangoDiasFinal2.varValue); //9

                        // Fecha actual global
                        DateTime FechaActual = DateTime.Now;

                        // Fecha de corte el 08 Incluye todo el día, permitiendo canjes hasta las 11:59:59 PM
                        DateTime Fecha08 = new DateTime(FechaActual.Year, FechaActual.Month, diasCorteFinal08, 23, 59, 59);

                        // Fecha de corte el 23 Incluye todo el día, permitiendo canjes hasta las 11:59:59 PM
                        DateTime Fecha23 = new DateTime(FechaActual.Year, FechaActual.Month, diasCorteFinal23, 23, 59, 59);

                        // Rango 1: del 24 del mes anterior al 08 del mes actual (inclusive hasta las 23:59)
                        DateTime PrimerDiaMesAnterior = new DateTime(FechaActual.Year, FechaActual.Month, 1).AddMonths(-1);

                        // Validar que el 24 existe en el mes anterior (en caso de meses cortos)
                        int diasMesAnterior = DateTime.DaysInMonth(PrimerDiaMesAnterior.Year, PrimerDiaMesAnterior.Month);
                        int diaInicio = Math.Min(diasCorteIncial1, diasMesAnterior); // Verfica dias existentes.
                        
                        DateTime FechaInicioRango = new DateTime(PrimerDiaMesAnterior.Year, PrimerDiaMesAnterior.Month, diaInicio, 0, 0, 0);
                        DateTime FechaFinRango = Fecha08;  // termina el 08 a las 23:59:59

                        // Rango 2: del 09 al 23 del mes actual (inclusive hasta las 23:59:59)
                        DateTime FechaInicioRango2 = new DateTime(FechaActual.Year, FechaActual.Month, diasCorteIncial2, 0, 0, 0);
                        DateTime FechaFinRango2 = Fecha23;  // termina el 23 a las 23:59:59

                        // Fecha del Vale
                        //var FechaVale = Vale.FechaExpedicion ?? Credito.FechaHoraRegistro;
                        var FechaVale = Vale.FechaExpedicion != null ? Vale.FechaExpedicion.Value : Credito.FechaHoraRegistro;
                    
                        if (FechaVale >= FechaInicioRango && FechaVale <= FechaFinRango)
                        {
                            var ExitoCre = new
                            {
                                res = 1,
                                msj = "Vale con fecha vigente para desembolsor 1",
                                Data = new { }  
                            };
                            //return Ok(ExitoCre);
                        }
                        else if (FechaVale >= FechaInicioRango2 && FechaVale <= FechaFinRango2)
                        {
                            var ExitoCre = new
                            {
                                res = 1,
                                msj = "Vale con fecha vigente para desembolsor 2",
                                Data = new { }
                            };
                            //return Ok(ExitoCre);
                        }
                        else{
                            var errVar1 = new
                            {
                                res = 0,
                                msj = "El vale caduco, no es posible desembolsarlo.",
                                Data = new { }
                            };

                            await ConexionBD.Destroy();
                            return Ok(errVar1);
                        }


                    // anterior.
                        // var FechaCanje1 = Vale.FechaExpedicion != null ? Vale.FechaExpedicion.Value : Credito.FechaHoraRegistro;

                        // var FechaCaduca = FechaCanje1.AddDays((double)DiasCad);

                        // var Fecha = DateTime.Now;

                        // if (Fecha >= FechaCaduca)
                        // {
                        //     var errVar = new
                        //     {
                        //         res = 0,
                        //         msj = "El vale caduco el dia " + FechaCaduca.ToString("dd/MM/yyyy") + " no es posible desembolsarlo.",
                        //         Data = new { }
                        //     };
                        // }


                    }
                }

                //var Caja = await ConexionBD.database.QueryAsync<CatalogoCajas>("FROM Tesoreria.CatalogoCajas AS c INNER JOIN Tesoreria.CuentasCaja AS cc ON c.CajaID = cc.CajaId INNER JOIN Bancos.CatalogoCuentasBancos AS cb ON cc.CuentaBancoId = cb.CuentaBancoID WHERE(c.SucursalID = @0) AND (c.UsuarioID = @1) AND (c.Estatus = 1)", Credito.SucursalID, UsuarioActual.ID).FirstOrDefaultAsync();

                var Caja = await ConexionBD.database.QueryAsync<CatalogoCajasUsuarios_VW>("WHERE (SucursalID = @0) AND (UsuarioID = @1) AND (CajaID = @2) AND (ProductoID = @3) AND (Estatus = 1)", Credito.SucursalID, UsuarioActual.UsuarioID, Credito.CajaID, producto).FirstOrDefaultAsync();

                if (Caja == null && Credito.CreditoZona == false)
                {
                    var errCaja = new
                    {
                        res = 0,
                        msj = "El Usuario(" + UsuarioActual.UsuarioID.ToString() + ") no tiene permiso a la caja: " + Credito.CajaID.ToString(),
                        Data = new { }
                    };

                    await ConexionBD.Destroy();
                    return Ok(errCaja);
                }

                //int? MovimientoID = null;

                ConexionBD.database.BeginTransaction();

                //var parms = new
                //{
                //    ProductoId = Credito.ProductoID,
                //    CreditoId = Credito.CreditoID,
                //    Credito.SucursalID,
                //    CajaId = Caja.CajaID,
                //    UsuarioId = UsuarioActual.ID,
                //    sw_transaccion = 0,
                //    regresa = 0,
                //    msj = "",
                //    MovimientoID,
                //    PersonaIDRegistro = PersonaActual.PersonaID
                //};

                //var DesembolsoRes = await ConexionBD.database.QueryAsync<DesembolsoRes>("EXEC Creditos.pa_Desembolso_Ins @ProductoId, @CreditoId, @SucursalID, @CajaId, @UsuarioId, @sw_transaccion, @regresa OUT, @msj OUT, @MovimientoID OUT, @PersonaIDRegistro", parms).FirstOrDefaultAsync();

                SqlParameter regresa = new("@regresa", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };

                SqlParameter msj = new("@msj", SqlDbType.VarChar)
                {
                    Direction = ParameterDirection.Output,
                    Size = 250
                };

                SqlParameter MovimientoID = new("@MovimientoID", SqlDbType.BigInt)
                {
                    Direction = ParameterDirection.Output
                };

                Sql sql = Sql.Builder.Append("EXEC Creditos.pa_Desembolso_Ins @ProductoId, @CreditoId, @SucursalID, @CajaId, @UsuarioId, @sw_transaccion, @regresa OUT, @msj OUT, @MovimientoID OUT, @PersonaIDRegistro", new
                {
                    ProductoId = Credito.ProductoID,
                    CreditoId = Credito.CreditoID,
                    Credito.SucursalID,
                    CajaId = parData.CajaID,
                    UsuarioId = UsuarioActual.UsuarioID,
                    sw_transaccion = 0,
                    regresa,
                    msj,
                    MovimientoID,
                    PersonaIDRegistro = (long)UsuarioActual.PersonaID
                });

                var DesembolsoRes = await ConexionBD.database.SingleOrDefaultAsync<DesembolsoRes>(sql);

                if ((int)regresa.Value == 0)
                {
                    var errDes = new
                    {
                        res = (int)regresa.Value,
                        msj = (string)msj.Value,
                        Data = new { }
                    };

                    await ConexionBD.Destroy();
                    return Ok(errDes);
                }

                Credito.MovimientoID = (long)MovimientoID.Value;
                Credito.EstatusID = "A";
                Credito.fechaHoraActivacion = DateTime.Now;

                if (Credito.TipoCreditoID == 5) // Agrego Mike
                {
                 Credito.CajaID  = parData.CajaID;   
                }
                

                await ConexionBD.database.UpdateAsync(Credito);

                ConexionBD.database.CompleteTransaction();

                var Creditos_VW = await ConexionBD.database.QueryAsync<Creditos_VW>("WHERE (CreditoID = @0)", Credito.CreditoID).FirstOrDefaultAsync();

                var res = new
                {
                    res = (int)regresa.Value,
                    msj = "Se efectuo el desembolso del crédito con el id de Movimiento: " + Credito.MovimientoID.ToString(),
                    Data = Creditos_VW
                };

                await ConexionBD.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        [Route("GetArticulos")]
        [Authorize]
        public async Task<IActionResult> GetArticulos(PeticionesRest.Creditos.Credito.GetArticulos parData)
        {
            try
            {
                var stored = "EXEC Creditos.pa_ExistenciaArticulos @SucursalID";
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.CanjeaVale.ArticulosExistentes>(stored, parData).ToArrayAsync();


                // ArrayList res2 = new();
                // foreach (var T in res)
                // {
                //     var descuento = 0;
                //     var obj = new
                //     {
                //         SKU = T.id_sku

                //     };

                //     var resArt = await ConexionBD.database.QueryAsync<ConfiaWebApi.ModlesSP.Creditos.DescuentoTiendita>("EXEC Creditos.pa_ObtenerDescuentoTiendita @SKU", obj).FirstOrDefaultAsync();

                //     if (resArt != null)
                //     {
                //         descuento = resArt.Descuento;
                //     }
                //     else
                //     {
                //         descuento = 0;
                //     }

                //     res2.Add(new
                //     {
                //         T.id_empresa,
                //         T.id_sucursal,
                //         T.sucursal,
                //         T.id_sku,
                //         T.codigo_barras,
                //         T.id_estructura,
                //         T.marca,
                //         T.estilo,
                //         T.color,
                //         T.talla,
                //         T.jerarquia01,
                //         T.jerarquia02,
                //         T.jerarquia03,
                //         T.jerarquia04,
                //         T.existencia,
                //         T.precio,
                //         T.imagen,
                //         descuento
                //     });
                // }

                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }
        [HttpGet]
        [Route("getTipoCredito")]
        [Authorize]
        public async Task<IActionResult> GetTipoCredito()
        {
            try
            {
                var Credito = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Creditos.CatalogoTipoCredito>();
                await ConexionBD.Destroy();
                return Ok(Credito);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }
        [HttpGet]
        [Route("getByIdSucursal")]
        [Authorize]
        public async Task<IActionResult> GetByIdSucursal()
        {
            try
            {
                //  var Credito = await ConexionBD.database.QueryAsync<SucursalesCreditos>("WHERE SucursalID = @0", SucursalID).FirstOrDefaultAsync();
                var Credito = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Creditos.SucursalesCreditos>();
                await ConexionBD.Destroy();
                return Ok(Credito);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }


        private string FormatDireccionVista(Direcciones_VW direccion)
        {
            var partes = new List<string>();

            if (!string.IsNullOrWhiteSpace(direccion.Municipio))
            {
                partes.Add(direccion.Municipio.ToUpper());
            }
            if (!string.IsNullOrWhiteSpace(direccion.Ciudad))
            {
                partes.Add(direccion.Ciudad.ToUpper());
            }
            if (!string.IsNullOrWhiteSpace(direccion.Estado))
            {
                partes.Add(direccion.Estado.ToUpper());
            }

            return string.Join(", ", partes);
        }

        [HttpPost]
        [Route("getplanpagospdf")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> PlanPagosPdf(PeticionesRest.Creditos.Credito.PDFRelacionPago parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            // ----------------------------------------    PRUEBAS -----------------------------------------------------------
            // parData.CreditoID = 236304;
            // parData.ProductoID = 38; 
            // ConexionBD.database.CommandTimeout = 9999;
            parData.ProductoID = producto;
            try
            {
                var Creditos_VW = await ConexionBD.database.QueryAsync<Creditos_VW>("WHERE CreditoID = @0", parData.CreditoID).SingleOrDefaultAsync();
                var Producto = await ConexionBD.database.SingleOrDefaultByIdAsync<Productos>(parData.ProductoID);
                var PlanesPago = await ConexionBD.database.QueryAsync<PlanPagos>("WHERE CreditoID = @0", parData.CreditoID).ToArrayAsync();
                var PlanesPagoPagados = PlanesPago.Where(x => x.FechaLiquidacion != null).ToArray();
                var PlanesPagoPendientes = PlanesPago.Where(x => x.FechaLiquidacion == null).ToArray();
                parData.SucursalID = Creditos_VW.SucursalID;
                var Sucursal = await ConexionBD.database.QueryAsync<Sucursales_VW>("WHERE SucursalID = @SucursalID", parData).SingleOrDefaultAsync();
                var SucursalFisica = await ConexionBD.database.QueryAsync<SucursalesFisicas_VW>("WHERE SucursalFisicaID = @0", Sucursal.SucursalFisicaID).SingleOrDefaultAsync();

                var Tiendita = await ConexionBD.database.QueryAsync<CreditoTiendita>("WHERE CreditoID = @CreditoID", parData).ToArrayAsync();
                var Direccion = await ConexionBD.database.QueryAsync<Direcciones_VW>("WHERE (PersonaID = @0)", Creditos_VW.ClienteID).SingleOrDefaultAsync();
                var DireccionMigradaCliente = await ConexionBD.database.QueryAsync<DireccionesMigradas>("WHERE PersonaID IN(@0)", Creditos_VW.ClienteID).SingleOrDefaultAsync();
                Direcciones_VW DireccionAval = null;
                DireccionesMigradas DireccionMigradaAval = null;
                var Distribuidores_Consulta = await ConexionBD.database.QueryAsync<Distribuidores_VW>("WHERE DistribuidorID=@0", Creditos_VW.ClienteID).FirstOrDefaultAsync();
                try
                {
                    DireccionAval = await ConexionBD.database.QueryAsync<Direcciones_VW>("WHERE (PersonaID = @0)", Creditos_VW.AvalPersona).SingleOrDefaultAsync();
                    DireccionMigradaAval = await ConexionBD.database.QueryAsync<DireccionesMigradas>("WHERE (PersonaID = @0)", Creditos_VW.AvalPersona).SingleOrDefaultAsync();
                }
                catch (System.Exception)
                {
                    DireccionAval = null;
                    DireccionMigradaAval = null;
                }

                if (Sucursal != null && Sucursal.Eslogan != null)
                {
                    byte[] bytes = System.Text.Encoding.Default.GetBytes(Sucursal.Eslogan);
                    Sucursal.Eslogan = System.Text.Encoding.UTF8.GetString(bytes);
                    Sucursal.Eslogan = HttpUtility.HtmlEncode(Sucursal.Eslogan);
                }

                // // Generamos un prefijo del nombre de archivo
                var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");
                var listado_archivos = new List<string>();
                var listado_imagenes = new List<string>();
                var Count = 1;

                var colorDocumento = "";
                switch (Producto.EmpresaId)
                {
                    case 10:
                    case 15:
                        colorDocumento = "#F7944C";
                        break;
                    case 9:
                        colorDocumento = "#BE56BE";
                        break;
                    default:
                        colorDocumento = "#1DA1F2";
                        break;
                }

                var logo = Producto.Logo;

                Guid g = Guid.NewGuid();

                var logoname = string.Concat("logo", "_" + g.ToString() + ".jpeg");

                NumberFormatInfo nfi = new CultureInfo(CultureInfo.CurrentCulture.ToString(), false).NumberFormat;
                nfi.PercentDecimalDigits = 0;

                await System.IO.File.WriteAllBytesAsync(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "LogoImg", logoname), logo);
                listado_imagenes.Add(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "LogoImg", logoname));

                // SE EMPIEZA A REEMPLAZAR LAS VARIABLES DE LA PLANTILLA DEL HTML
                var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Distribuidores", "PlanPagos.html"));
                html = html.Replace("@@SUCURSAL", Sucursal.Nombre);
                html = html.Replace("@@LOGO", logoname);
                html = html.Replace("@@ESLOGAN", Sucursal.Eslogan == null ? "" : Sucursal.Eslogan);
                html = html.Replace("@@COLOR", colorDocumento);
                html = html.Replace("@@JQUERY", "<script type=\"text/javascript\" src=\"https://code.jquery.com/jquery.min.js\"></script>");

                html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                html = html.Replace("@@DVCF", Distribuidores_Consulta != null ? "DISTRIBUIDORA" : "CLIENTE");
                html = html.Replace("@@IMPRIMIO", UsuarioActual.Nombre.ToString());
                html = html.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                html = html.Replace("@@ID_CLIENTE", Creditos_VW.ClienteID.ToString());
                html = html.Replace("@@NOMBRE_CLIENTE", Creditos_VW.NombreCompleto.ToUpper());
                html = html.Replace("@@TELEFONO_CLIENTE", Creditos_VW.TelefonoMovil);
                if (Direccion != null)
                {
                    html = html.Replace("@@DOMICILIOCLIENTE", Direccion.NombreVialidad.ToUpper() + " " + Direccion?.NumeroInterior?.ToUpper() + ", " + Direccion.Asentamiento.ToUpper() + ", C.P." + Direccion.CodigoPostal);
                    html = html.Replace("@@POBLACIONCLIENTE", FormatDireccionVista(Direccion));
                }
                else if (DireccionMigradaCliente != null)
                {
                    html = html.Replace("@@DOMICILIOCLIENTE", DireccionMigradaCliente.Direccion.ToUpper() + ", " + DireccionMigradaCliente.Ciudad.ToUpper());
                    html = html.Replace("@@POBLACIONCLIENTE", DireccionMigradaCliente.Ciudad.ToUpper());
                }
                else
                {
                    html = html.Replace("@@DOMICILIOCLIENTE", "");
                    html = html.Replace("@@POBLACIONCLIENTE", "");
                }

                html = html.Replace("@@NumeroCredito", Creditos_VW.CreditoID.ToString());
                html = html.Replace("@@EstatusCredito", Creditos_VW.EstatusNombre);
                html = html.Replace("@@PORCENTAJEMENSUAL", "3.5");

                html = html.Replace("@@PRODUCTOID", Creditos_VW.ProductoID.ToString());
                html = html.Replace("@@PRODUCTONOMBRE", Creditos_VW.Producto.ToString());

                html = html.Replace("@@ValeCanje", (Creditos_VW.ValeCanje != 0 && Creditos_VW.ValeCanje != null) ? Creditos_VW.ValeCanje.ToString() : "N/A");
                html = html.Replace("@@MovimientoID", Creditos_VW.MovimientoID.ToString());
                html = html.Replace("@@Plazos", Creditos_VW.Plazos.ToString());
                html = html.Replace("@@Total", Creditos_VW.ImporteTotal.ToString("C", CultureInfo.CurrentCulture));

                html = html.Replace("@@AVALNOMBRE", Creditos_VW.Aval != null && Creditos_VW.Aval != "" ? Creditos_VW.Aval.ToString() : "Sin información");
                html = html.Replace("@@AVALTELEFONO", Creditos_VW.AvalTelefono?.ToString() ?? "Sin información");

                if (DireccionAval != null)
                {
                    html = html.Replace("@@AVALDIRECCION", FormatDireccionVista(DireccionAval));
                }
                else if (DireccionMigradaAval != null)
                {
                    html = html.Replace("@@AVALDIRECCION", DireccionMigradaAval.Ciudad.ToUpper());
                }
                else
                {
                    html = html.Replace("@@AVALDIRECCION", "Sin información");
                }

                html = html.Replace("@@TipoPlazos", Creditos_VW.TasaTipo.ToString());
                html = html.Replace("@@Condicion", "Vale en condición fijo");
                html = html.Replace("@@FormaPago", "EFECTIVO");
                html = html.Replace("@@TablaTotal", Creditos_VW.ImporteTotal.ToString("C", CultureInfo.CurrentCulture));
                html = html.Replace("@@Pagos", Creditos_VW.Abonos.ToString("C", CultureInfo.CurrentCulture));

                html = html.Replace("@@SaldoActual", Creditos_VW.SaldoActual.ToString("C", CultureInfo.CurrentCulture));
                html = html.Replace("@@Atrasos", Creditos_VW.PagosAtrasados.ToString());
                html = html.Replace("@@SaldoAtrasado", Creditos_VW.SaldoAtrasado.ToString("C", CultureInfo.CurrentCulture));
                html = html.Replace("@@DiasAtraso", Creditos_VW.DiasAtraso.ToString());
                html = html.Replace("@@CHEntregados", PlanesPagoPagados.Length.ToString());
                html = html.Replace("@@CHPendientes", PlanesPagoPendientes.Length.ToString());
                html = html.Replace("@@CHMontoGarantia", 0.ToString("C", CultureInfo.CurrentCulture));

                html = html.Replace("@@CHPendientes", "0.00");
                html = html.Replace("@@InnerEstatus", Creditos_VW.EstatusNombre);
                html = html.Replace("@@Balance", (Creditos_VW.Bal_Apl != 0 && Creditos_VW.Bal_Apl != null) ? Creditos_VW.Bal_Apl.ToString() : "N/A");
                html = html.Replace("@@FechaActivacion", Creditos_VW.fechaHoraActivacion?.ToString("dd/MM/yyyy hh:mm:ss tt"));
                html = html.Replace("@@FechaCorte", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                html = html.Replace("@@TOTALLETRA", Funciones.NumeroALetras(Creditos_VW.ImporteTotal, true));
                html = html.Replace("@@LugarSucursal", SucursalFisica.Estado);


                var filasTablaProducto = "";
                decimal pagoPorPlazo = 0;
                var totalCantidad = 0;
                decimal totalImporte = 0;
                bool mostrarTienditaSeparado = true;
                //  RENDER DATOS ROWS DEL CREDITO
                if (true)
                {
                    //PRINT VALE
                    var descripcionProducto = "";
                    if (Creditos_VW.TipoCreditoDescripcion == "CONFIA HOME" && Tiendita.Any())
                    {
                        mostrarTienditaSeparado = false;
                        descripcionProducto = Tiendita[0].SKU + " - " + Tiendita[0].Descripcion;
                        pagoPorPlazo = Creditos_VW.Capital / Creditos_VW.Plazos;
                        filasTablaProducto += "<tr class=\"text-center\" style=\"border:none\">";
                        filasTablaProducto += "<td>" + 1 + "</td>";
                        filasTablaProducto += "<td>" + Creditos_VW.TipoCreditoDescripcion + "</td>";
                        filasTablaProducto += "<td>" + Creditos_VW.Capital.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                        filasTablaProducto += "<td>" + Creditos_VW.Plazos.ToString() + "</td>";
                        filasTablaProducto += "<td>" + Creditos_VW.Capital.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                        filasTablaProducto += "<td>" + Creditos_VW.Capital.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                        filasTablaProducto += "<td>" + pagoPorPlazo.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                        filasTablaProducto += "<td>" + descripcionProducto + "</td>";
                        filasTablaProducto += "</tr>";
                        totalCantidad++;
                        totalImporte += Creditos_VW.Capital;
                    }

                    pagoPorPlazo = Creditos_VW.Interes / Creditos_VW.Plazos;
                    if (pagoPorPlazo != 0)
                    {
                        filasTablaProducto += "<tr class=\"text-center\" style=\"border:none\">";
                        filasTablaProducto += "<td>" + 1 + "</td>";
                        filasTablaProducto += "<td>INTERESES</td>";
                        filasTablaProducto += "<td>" + Creditos_VW.Interes.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                        filasTablaProducto += "<td>" + Creditos_VW.Plazos.ToString() + "</td>";
                        filasTablaProducto += "<td>" + Creditos_VW.Interes.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                        filasTablaProducto += "<td>" + Creditos_VW.Interes.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                        filasTablaProducto += "<td>" + pagoPorPlazo.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                        filasTablaProducto += "<td></td>";
                        filasTablaProducto += "</tr>";
                        totalCantidad++;
                        totalImporte += Creditos_VW.Interes;
                    }

                    pagoPorPlazo = Creditos_VW.IVA / Creditos_VW.Plazos;
                    if (pagoPorPlazo != 0)
                    {
                        filasTablaProducto += "<tr class=\"text-center\" style=\"border:none\">";
                        filasTablaProducto += "<td>" + 1 + "</td>";
                        filasTablaProducto += "<td>IVA INTERESES</td>";
                        filasTablaProducto += "<td>" + Creditos_VW.IVA.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                        filasTablaProducto += "<td>" + Creditos_VW.Plazos.ToString() + "</td>";
                        filasTablaProducto += "<td>" + Creditos_VW.IVA.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                        filasTablaProducto += "<td>" + Creditos_VW.IVA.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                        filasTablaProducto += "<td>" + pagoPorPlazo.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                        filasTablaProducto += "<td></td>";
                        filasTablaProducto += "</tr>";
                        totalCantidad++;
                        totalImporte += Creditos_VW.IVA;
                    }

                    pagoPorPlazo = Creditos_VW.Cargo / Creditos_VW.Plazos;
                    if (pagoPorPlazo != 0)
                    {
                        filasTablaProducto += "<tr class=\"text-center\" style=\"border:none\">";
                        filasTablaProducto += "<td>" + 1 + "</td>";
                        filasTablaProducto += "<td>IVA INTERESES</td>";
                        filasTablaProducto += "<td>" + Creditos_VW.Cargo.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                        filasTablaProducto += "<td>" + Creditos_VW.Plazos.ToString() + "</td>";
                        filasTablaProducto += "<td>" + Creditos_VW.Cargo.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                        filasTablaProducto += "<td>" + Creditos_VW.Cargo.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                        filasTablaProducto += "<td>" + pagoPorPlazo.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                        filasTablaProducto += "<td></td>";
                        filasTablaProducto += "</tr>";
                        totalCantidad++;
                        totalImporte += Creditos_VW.Cargo;
                    }

                    pagoPorPlazo = Creditos_VW.Seguro / Creditos_VW.Plazos;
                    if (pagoPorPlazo != 0)
                    {
                        filasTablaProducto += "<tr class=\"text-center\" style=\"border:none\">";
                        filasTablaProducto += "<td>" + 1 + "</td>";
                        filasTablaProducto += "<td>USV</td>";
                        filasTablaProducto += "<td>" + Creditos_VW.Seguro.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                        filasTablaProducto += "<td>" + Creditos_VW.Plazos.ToString() + "</td>";
                        filasTablaProducto += "<td>" + Creditos_VW.Seguro.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                        filasTablaProducto += "<td>" + Creditos_VW.Seguro.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                        filasTablaProducto += "<td>" + pagoPorPlazo.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                        filasTablaProducto += "<td></td>";
                        filasTablaProducto += "</tr>";
                        totalCantidad++;
                        totalImporte += Creditos_VW.Seguro;
                    }
                }

                //  RENDER PRODUCTOS EN CASO DE TENER
                if (Tiendita.Length > 0 && mostrarTienditaSeparado)
                {
                    foreach (var item in Tiendita)
                    {
                        if (item.ImporteTotal == 0) continue;
                        pagoPorPlazo = (decimal)item.ImporteTotal / Creditos_VW.Plazos;
                        filasTablaProducto += "<tr class=\"text-center\" style=\"border:none\">";
                        filasTablaProducto += "<td>" + item.Unidades.ToString() + "</td>";
                        filasTablaProducto += "<td>TIENDITA</td>";
                        filasTablaProducto += "<td>" + item.PrecioUnitario.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                        filasTablaProducto += "<td>" + Creditos_VW.Plazos.ToString() + "</td>";
                        filasTablaProducto += "<td>" + item.ImporteTotal?.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                        filasTablaProducto += "<td>" + item.PrecioUnitario.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                        filasTablaProducto += "<td>" + pagoPorPlazo.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                        filasTablaProducto += "<td>" + item.SKU + " - " + item.Descripcion.ToString() + "</td>";
                        filasTablaProducto += "</tr>";
                        totalCantidad += item.Unidades;
                        totalImporte += (decimal)item.ImporteTotal;
                    }
                }
                else if (Creditos_VW.Tiendita != null && Creditos_VW.Tiendita != 0 && mostrarTienditaSeparado)
                {
                    pagoPorPlazo = (decimal)Creditos_VW.Tiendita / Creditos_VW.Plazos;
                    decimal tempTiendita = (decimal)Creditos_VW.Tiendita;
                    filasTablaProducto += "<tr class=\"text-center\" style=\"border:none\">";
                    filasTablaProducto += "<td>" + 1 + "</td>";
                    filasTablaProducto += "<td>TIENDITA</td>";
                    filasTablaProducto += "<td>" + tempTiendita.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                    filasTablaProducto += "<td>" + Creditos_VW.Plazos.ToString() + "</td>";
                    filasTablaProducto += "<td>" + Creditos_VW.Tiendita?.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                    filasTablaProducto += "<td>" + Creditos_VW.Tiendita?.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                    filasTablaProducto += "<td>" + pagoPorPlazo.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                    filasTablaProducto += "<td>" + "</td>";
                    filasTablaProducto += "</tr>";
                    totalCantidad += 1;
                    totalImporte += (decimal)Creditos_VW.Tiendita;
                }


                filasTablaProducto += "<tr class=\"text-center\" style=\"border:none\">";
                filasTablaProducto += "<td>" + totalCantidad.ToString() + "</td>";
                filasTablaProducto += "<td>TOTAL</td>";
                filasTablaProducto += "<td></td>";
                filasTablaProducto += "<td></td>";
                filasTablaProducto += "<td>" + totalImporte.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                filasTablaProducto += "<td></td>";
                filasTablaProducto += "<td></td>";
                filasTablaProducto += "<td></td>";
                filasTablaProducto += "</tr>";
                html = html.Replace("@@RowsConceptos", filasTablaProducto);

                var tablaPlanPagosLeft = "";
                var tablaPlanPagosRight = "";
                var indiceCiclo = 0;
                var filaTablaPlanPagos = "";
                var planesPagoMitad = (int)Math.Ceiling(PlanesPago.Length / 2.0);
                foreach (var PlanPago in PlanesPago)
                {
                    filaTablaPlanPagos = "";
                    filaTablaPlanPagos += "<tr class=\"text-center\" style=\"border:none\">";
                    filaTablaPlanPagos += "<td>" + PlanPago.NoPago.ToString() + "</td>";
                    filaTablaPlanPagos += "<td>" + PlanPago.FechaVencimiento.ToString("dd/MM/yyyy") + "</td>";
                    filaTablaPlanPagos += "<td>" + (Creditos_VW.ValeCanje != 0 ? Creditos_VW.ValeCanje.ToString() : "N/A") + "</td>";
                    filaTablaPlanPagos += "<td>" + PlanPago.ImporteTotal?.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                    filaTablaPlanPagos += "<td>" + PlanPago.SaldoActual?.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                    filaTablaPlanPagos += "<td>" + PlanPago.FechaVencimientoClienteFinal?.ToString("dd/MM/yyyy") + "</td>";
                    filaTablaPlanPagos += "</tr>";

                    // if (indiceCiclo % 2 != 0)
                    if (indiceCiclo >= planesPagoMitad)
                    {
                        tablaPlanPagosRight += filaTablaPlanPagos;
                    }
                    else
                    {
                        tablaPlanPagosLeft += filaTablaPlanPagos;
                    }

                    indiceCiclo++;
                }
                html = html.Replace("@@PLANPAGOSRIGHTTABLE", tablaPlanPagosRight);
                html = html.Replace("@@PLANPAGOSLEFTTABLE", tablaPlanPagosLeft);

                await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1.html")), html);
                listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1.html")));

                if (Count > 0)
                {
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

                    // Obtenemos nuestro PDF
                    var pdfStream = new MemoryStream();
                    pdfStream.Write(pdf, 0, pdf.Length);
                    pdfStream.Position = 0;

                    // Limpiamos los archivos que se utilizaron
                    foreach (var archivo in listado_archivos)
                        System.IO.File.Delete(archivo);

                    foreach (var imagen in listado_imagenes)
                        System.IO.File.Delete(imagen);

                    // Eliminamos el PDF
                    System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));

                    await ConexionBD.Destroy();

                    // Enviamos el PDF a la UI
                    return new FileStreamResult(pdfStream, "application/pdf");
                }

                await ConexionBD.Destroy();

                return Ok("No se encontro información");
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("ERROR: " + ex.Message);
            }
        }

        [HttpPost]
        [Route("getfichapagoclientefinal")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> FichaPagoClienteFinal(PeticionesRest.Creditos.Credito.PDFFichaPagoCF parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            parData.ProductoID = producto;

            try
            {
                var resSP = await ConexionBD.database.QueryAsync<DatosFichaPagoCF>("EXEC Creditos.pa_GetDatosFichaPagoCF @CreditoID", parData).SingleOrDefaultAsync();
                var resSPFicha = await ConexionBD.database.QueryAsync<DatosFichaPagoCF>("EXEC Creditos.GenerarReferenciaCredito @CreditoID", parData).SingleOrDefaultAsync();

                if (resSP.Eslogan != null)
                {
                    byte[] bytes = System.Text.Encoding.Default.GetBytes(resSP.Eslogan);
                    resSP.Eslogan = System.Text.Encoding.UTF8.GetString(bytes);
                    resSP.Eslogan = HttpUtility.HtmlEncode(resSP.Eslogan);
                }

                // // Generamos un prefijo del nombre de archivo
                var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");
                var listado_archivos = new List<string>();
                var listado_imagenes = new List<string>();

                var colorDocumento = "";
                switch (resSP.EmpresaId)
                {
                    case 10:
                    case 15:
                        colorDocumento = "#F7944C";
                        break;
                    case 9:
                        colorDocumento = "#BE56BE";
                        break;
                    default:
                        colorDocumento = "#1DA1F2";
                        break;
                }

                var logo = resSP.Logo;

                Guid g = Guid.NewGuid();

                var logoname = string.Concat("logo", "_" + g.ToString() + ".jpeg");

                NumberFormatInfo nfi = new CultureInfo(CultureInfo.CurrentCulture.ToString(), false).NumberFormat;
                nfi.PercentDecimalDigits = 0;

                await System.IO.File.WriteAllBytesAsync(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "LogoImg", logoname), logo);
                listado_imagenes.Add(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "LogoImg", logoname));

                // SE EMPIEZA A REEMPLAZAR LAS VARIABLES DE LA PLANTILLA DEL HTML
                var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Clientes", "FichaPagoClienteV1.html"));
                html = html.Replace("@@SUCURSAL", resSP.SucursalNombre);
                html = html.Replace("@@LOGO", logoname);
                html = html.Replace("@@COLOR", colorDocumento);
                html = html.Replace("@@JQUERY", "<script type=\"text/javascript\" src=\"https://code.jquery.com/jquery.min.js\"></script>");
                html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                html = html.Replace("@@IMPRIMIO", UsuarioActual.Nombre.ToString());
                html = html.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                html = html.Replace("@@ESLOGAN", resSP.Eslogan == null ? "" : resSP.Eslogan);
                html = html.Replace("@@ID_CLIENTE", resSP.PersonaID.ToString());
                html = html.Replace("@@NOMBRE_CLIENTE", resSP.NombreCompleto.ToUpper());
                html = html.Replace("@@TELEFONO_CLIENTE", resSP.TelefonoMovil);
                html = html.Replace("@@CREDITO", resSP.CreditoID.ToString());
                html = html.Replace("@@CONTRATO_CIE", resSP.ContratoCIE);
                html = html.Replace("@@REF_BANCOMER", resSP.refBancomer);


                if (resSPFicha.refSoriana != null)
                {
                    var code = Funciones.Barcode(resSPFicha.refSoriana, 600, 200);

                    var image = string.Concat(prefijo_archivo, "refSoriana_", resSP.PersonaID.ToString(), ".png");

#pragma warning disable CA1416 // Validar la compatibilidad de la plataforma
                    code.Save(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "ImageBarcode", image), ImageFormat.Png);
#pragma warning restore CA1416 // Validar la compatibilidad de la plataforma

                    //Mostrar codigo de barras soriana
                    listado_imagenes.Add(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "ImageBarcode", image));
                    html = html.Replace("@@REF_SORIANA", image);
                }

                await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1.html")), html);
                listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1.html")));
                if (resSP != null)
                {
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

                    // Obtenemos nuestro PDF
                    var pdfStream = new MemoryStream();
                    pdfStream.Write(pdf, 0, pdf.Length);
                    pdfStream.Position = 0;

                    // Limpiamos los archivos que se utilizaron
                    foreach (var archivo in listado_archivos)
                        System.IO.File.Delete(archivo);

                    foreach (var imagen in listado_imagenes)
                        System.IO.File.Delete(imagen);

                    // Eliminamos el PDF
                    System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));

                    await ConexionBD.Destroy();

                    // Enviamos el PDF a la UI
                    return new FileStreamResult(pdfStream, "application/pdf");
                }

                await ConexionBD.Destroy();
                return Ok("No se encontro información");
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("ERROR: " + ex.Message);
            }
        }
    }
}
