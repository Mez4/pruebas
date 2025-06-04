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
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Catalogos;

namespace ConfiaWebApi.Controllers.Sistema
{

    [ApiController]
    [Route("api/SOMA/[controller]")]
    public class DispersionController : ControllerBase
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
        public DispersionController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }


        [HttpPost]
        [Route("cancelarCreditoAntesDispersion")]
        [Code.TProteccionProducto]
        [Authorize]
        public async Task<ActionResult> cancelarCredito(ConfiaWebApi.PeticionesRest.SOMA.Dispersiones.CancelarCredito pardata)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var creditoXcancelar = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoID=@0", pardata.CreditoID).FirstOrDefaultAsync();
                if (creditoXcancelar != null)
                {
                    creditoXcancelar.EstatusID = "C";
                    creditoXcancelar.UsuarioIDModifico = UsuarioActual.UsuarioID;
                    creditoXcancelar.FechaHoraModificacion = DateTime.Now;
                    var movimientoBanco = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Bancos.Movimientos>("WHERE MovimientoID=@0", creditoXcancelar.MovimientoID).FirstOrDefaultAsync();
                    if (movimientoBanco != null)
                    {
                        movimientoBanco.CatEstatusMovID = 3;
                    }
                    ConexionBD.database.BeginTransaction();
                    await ConexionBD.database.UpdateAsync(creditoXcancelar);
                    await ConexionBD.database.UpdateAsync(movimientoBanco);
                    ConexionBD.database.CompleteTransaction();
                }
                await ConexionBD.Destroy();
                return Ok();
            }
            catch (Exception ex)
            {
                ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("dispersionManualReintento")]
        [Code.TProteccionProducto]
        [Authorize]
        public async Task<ActionResult> dispersionXreintento(ConfiaWebApi.PeticionesRest.SOMA.Dispersiones.Dispersiones pardata)
        {
            try
            {


                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var userAgent = HttpContext.Request.Headers["User-Agent"];
                var ipAgent = HttpContext.Connection.RemoteIpAddress;
                string objetoString = Newtonsoft.Json.JsonConvert.SerializeObject(pardata);

                string nombreSinAcentos = Regex.Replace(pardata.NombreCompleto.Normalize(NormalizationForm.FormD), @"[^a-zA-z0-9 ]+", "");
                string nombreSinN = nombreSinAcentos.Replace('ñ', 'n');
                var fecha = DateTime.Now;
                long unixTime = ((DateTimeOffset)fecha).ToUnixTimeSeconds();
                var fechaFormateada = fecha.ToString("yyyyMMdd");
                var productoID = string.Format("{0:000}", pardata.ProductoID);
                var empresaID = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Creditos.Productos>(pardata.ProductoID);
                var empresaID_2 = string.Format("{0:000}", empresaID.EmpresaId);
                var creditoID = string.Format("{0:00000000000000}", pardata.CreditoID);
                var claveRastreo = fechaFormateada + "RR" + productoID + empresaID_2 + creditoID;
                int longClave = claveRastreo.Length;
                var fechaNumero = Convert.ToInt32(fechaFormateada);
                var clienteID = string.Format("{0:0000000}", pardata.ClienteID);
                var clienteIdNumero = Convert.ToInt32(clienteID);
                var cantidad = string.Format("{0:0.00}", pardata.Capital);
                CryptoHandler cryptoHandler = new CryptoHandler();
                string url = "https://demo.stpmex.com:7024/speiws/rest/ordenPago/registra";
                var client = new HttpClient();
                OrdenPagoWS ordenPagoWS = new OrdenPagoWS();
                String firma = "";
                int tipoCuenta = 0;

                if (pardata.datoTipoID == 1) { tipoCuenta = 40; }
                if (pardata.datoTipoID == 2) { tipoCuenta = 3; }

                ordenPagoWS.setClaveRastreo(claveRastreo);
                ordenPagoWS.setConceptoPago("" + pardata.CreditoID + "");
                ordenPagoWS.setCuentaBeneficiario(pardata.datoBancario);
                ordenPagoWS.setCuentaOrdenante("646180324800000008");
                ordenPagoWS.setEmpresa("EMPRENDEDORES_C");
                ordenPagoWS.setFechaOperacion(fechaNumero);
                ordenPagoWS.setFolioOrigen(claveRastreo);
                ordenPagoWS.setInstitucionContraparte(pardata.BancoStpID);
                ordenPagoWS.setInstitucionOperante(90646);
                ordenPagoWS.setMonto(cantidad);
                ordenPagoWS.setNombreBeneficiario(nombreSinAcentos);
                ordenPagoWS.setNombreOrdenante("EMPRENDEDORES_C");
                ordenPagoWS.setReferenciaNumerica(clienteIdNumero);
                ordenPagoWS.setRfcCurpBeneficiario(pardata.CURP);
                ordenPagoWS.setRfcCurpOrdenante("XAXX010101000");
                ordenPagoWS.setTipoCuentaBeneficiario(tipoCuenta);
                ordenPagoWS.setTipoCuentaOrdenante(40);
                ordenPagoWS.setTipoPago(1);
                firma = new CryptoHandler().cadenaOriginal(ordenPagoWS);
                ConexionBD.database.BeginTransaction();

                //FInd CreditoID in Dispersiones with Estatus LQ or TLQ
                var creditoDispersado = await ConexionBD.database.QueryAsync<DBContext.DBConfia.STP.Dispersiones>("WHERE CreditoID=@0 AND (ClaveEstatus='LQ' OR ClaveEstatus='TLQ')", pardata.CreditoID).FirstOrDefaultAsync();

                if (creditoDispersado != null)
                {
                    ConexionBD.database.AbortTransaction();
                    await ConexionBD.Destroy();
                    return BadRequest("El crédito ya fue dispersado");
                }


                var stpDisp = new DBContext.DBConfia.STP.Dispersiones()
                {
                    ClaveRastreo = claveRastreo,
                    ClaveDispersionSTP = 1,
                    CreditoID = pardata.CreditoID,
                    ConceptoPago = "Dispersion de crédito No. " + pardata.CreditoID,
                    CuentaBeneficiario = pardata.datoBancario,
                    CuentaOrdenante = "646180324800000008",
                    Empresa = "EMPRENDEDORES_C",
                    FechaOperacion = fechaNumero.ToString(),
                    FechaRegistro = DateTime.Now,
                    FolioOrigen = claveRastreo,
                    InstitucionContraparte = pardata.BancoStpID,
                    InstitucionOperante = 90646,
                    Monto = pardata.Capital,
                    NombreBeneficiario = pardata.NombreCompleto,
                    NombreOrdenante = "EMPRENDEDORES_C",
                    ReferenciaNumerica = clienteIdNumero.ToString(),
                    CurpRfcBeneficiario = pardata.CURP != null ? pardata.CURP : "XAXX010101000",
                    CurpRfcOrdenante = "XAXX010101000",
                    TipoCuentaBeneficiario = tipoCuenta,
                    TipoCuentaOrdenante = 40,
                    TipoPago = 1,
                    Firma = firma,
                    UsuarioDispersaID = UsuarioActual.UsuarioID,
                    ClaveEstatus = "A",
                    BancoClaveSTP = pardata.BancoStpID,
                };
                await ConexionBD.database.InsertAsync(stpDisp);

                Post post = new Post()
                {
                    claveRastreo = ordenPagoWS.getClaveRastreo(),
                    conceptoPago = ordenPagoWS.getConceptoPago(),
                    cuentaBeneficiario = ordenPagoWS.getCuentaBeneficiario(),
                    cuentaOrdenante = ordenPagoWS.getCuentaOrdenante(),
                    empresa = ordenPagoWS.getEmpresa(),
                    fechaOperacion = ordenPagoWS.getFechaOperacion(),
                    firma = firma,
                    folioOrigen = ordenPagoWS.getFolioOrigen(),
                    institucionContraparte = ordenPagoWS.getInstitucionContraparte(),
                    institucionOperante = ordenPagoWS.getInstitucionOperante(),
                    monto = ordenPagoWS.getMonto(),
                    nombreBeneficiario = ordenPagoWS.getNombreBeneficiario(),
                    nombreOrdenante = ordenPagoWS.getNombreOrdenante(),
                    referenciaNumerica = ordenPagoWS.getReferenciaNumerica(),
                    rfcCurpBeneficiario = ordenPagoWS.getRfcCurpBeneficiario(),
                    rfcCurpOrdenante = ordenPagoWS.getRfcCurpOrdenante(),
                    tipoCuentaBeneficiario = ordenPagoWS.getTipoCuentaBeneficiario(),
                    tipoCuentaOrdenante = ordenPagoWS.getTipoCuentaOrdenante(),
                    tipoPago = ordenPagoWS.getTipoPago(),
                };
                var data = JsonSerializer.Serialize<Post>(post);

                /**
                * * Peticion a STP para registrar la orden de pago 
                 */
                HttpContent content = new StringContent(data, System.Text.Encoding.UTF8, "application/json");
                var httpResponse = await client.PutAsync(url, content);
                string myContent = content.ReadAsStringAsync().Result;
                Debug.WriteLine(myContent);
                var result = "";

                /**
                * * Estatus de la petición 
                */
                if (httpResponse.IsSuccessStatusCode)
                {
                    result = await httpResponse.Content.ReadAsStringAsync();
                    var postResult = JsonSerializer.Deserialize<Respuesta>(result);
                    var id = postResult.resultado.id.ToString().Length;

                    if (id > 3)
                    {
                        //TODO: Proceso Interno
                        ConexionBD.database.CompleteTransaction();
                        //dispersionesRegistradas++;
                        var stpDispersion = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.STP.Dispersiones>(stpDisp.DispersionID);
                        stpDispersion.ClaveDispersionSTP = postResult.resultado.id;
                        ConexionBD.database.BeginTransaction();
                        await ConexionBD.database.UpdateAsync(stpDispersion);
                        ConexionBD.database.CompleteTransaction();
                        string objetoString2 = Newtonsoft.Json.JsonConvert.SerializeObject(postResult);

                        var evento = new DBContext.DBConfia.STP.LogEventos()
                        {
                            TipoEventoID = 1,
                            Origen = userAgent,
                            IP = ipAgent.ToString(),
                            FechaRegistro = DateTime.Now,
                            BodyRequest = objetoString2,
                        };
                        await ConexionBD.database.InsertAsync(evento);

                        var credito = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Creditos.Creditos>(pardata.CreditoID);

                        if (credito != null)
                        {
                            credito.ReintentoDispersion = credito.ReintentoDispersion;
                            credito.ReintentosDeDispersion = credito.ReintentosDeDispersion;
                            credito.DispersionID = stpDisp.DispersionID;
                            var movimientoBanco = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Bancos.Movimientos>(credito.MovimientoID);
                            if (movimientoBanco != null) { movimientoBanco.CatEstatusMovID = 1; };
                            await ConexionBD.database.UpdateAsync(movimientoBanco);
                            await ConexionBD.database.UpdateAsync(credito);
                        }



                    }
                    else
                    {
                        //TODO: Petición correcta, pero no se pudo dispersar
                        ConexionBD.database.AbortTransaction();
                        string objetoString2 = Newtonsoft.Json.JsonConvert.SerializeObject(postResult);
                        var evento = new DBContext.DBConfia.STP.LogEventos()
                        {
                            TipoEventoID = 3,
                            Origen = userAgent,
                            IP = ipAgent.ToString(),
                            FechaRegistro = DateTime.Now,
                            BodyRequest = objetoString2,
                        };
                        await ConexionBD.database.InsertAsync(evento);

                    }
                }
                else
                {

                    //TODO: Error en la petición
                    ConexionBD.database.AbortTransaction();
                    var evento = new DBContext.DBConfia.STP.LogEventos()
                    {
                        TipoEventoID = 3,
                        Origen = userAgent,
                        IP = ipAgent.ToString(),
                        FechaRegistro = DateTime.Now,
                        BodyRequest = objetoString,
                    };
                    await ConexionBD.database.InsertAsync(evento);
                    await ConexionBD.Destroy();
                    return BadRequest();
                }
                return Ok();
            }


            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("dispersarOrdenesPendientes")]
        [Code.TProteccionProducto]
        public async Task<ActionResult> dispersarOrdenesPendientes()
        {
            try
            {
                var res = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.DispersarCreditos_VW>("WHERE FechaRegistro = ").ToArrayAsync();
                await ConexionBD.Destroy();
                var res2 = res;
                return Ok(res2);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("consultaHistorico/{tipo}")]
        [Authorize]
        public async Task<IActionResult> consultaSaldo(string tipoConsulta)
        {
            var userAgent = HttpContext.Request.Headers["User-Agent"];
            var ipAgent = HttpContext.Connection.RemoteIpAddress;
            try
            {
                /**
                **Preparación de datos
                */
                string url = "https://efws-dev.stpmex.com/efws/API/conciliacion";
                var client = new HttpClient();
                PostConsultaConciliacion post = new PostConsultaConciliacion()
                {
                    empresa = "EMPRENDEDORES_C",
                    page = 0,
                    size = 500,
                    tipoOrden = "E",
                    firma = new CryptoHandler().firmaConsultaConciliacion(tipoConsulta),
                };
                var data = JsonSerializer.Serialize<PostConsultaConciliacion>(post);
                HttpContent content = new StringContent(data, System.Text.Encoding.UTF8, "application/json");

                /**
                **Peticion al servicio
                */

                var httpResponse = await client.PostAsync(url, content);
                var result = "";

                if (httpResponse.IsSuccessStatusCode)
                {
                    /**
                    **Peticion exitosa
                    */
                    result = await httpResponse.Content.ReadAsStringAsync();
                    var postResult = JsonSerializer.Deserialize<resultadoConsultaConciliacion>(result);
                    /*  var saldoCuenta = new DBContext.DBConfia.STP.SaldosCuentas()
                     {
                         Cuenta = "646180324800000008",
                         Saldo = postResult.resultado.saldoCuenta.saldo,
                         CargosPendientes = postResult.resultado.saldoCuenta.cargosPendientes,
                         FechaConsulta = DateTime.Now,
                     };
                     await ConexionBD.database.InsertAsync(saldoCuenta); */

                    await ConexionBD.Destroy();
                    return Ok();
                }
                else
                {
                    result = await httpResponse.Content.ReadAsStringAsync();

                    /**
                     **Peticion no exitosa
                     */
                    await ConexionBD.Destroy();
                    return BadRequest(result);
                }
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }


        [HttpGet]
        [Route("ultimoSaldo")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult<List<Dispersiones>>> GetDispersiones()
        {
            try
            {
                var ultimosSaldo = await ConexionBD.database.SingleAsync<DBContext.DBConfia.STP.SaldosCuentas>("select TOP 1 * FROM STP.SaldosCuentas sc ORDER BY sc.FechaConsulta desc");
                await ConexionBD.Destroy();
                return Ok(ultimosSaldo);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Authorize]
        [Route("conciliacionV2")]
        public async Task<IActionResult> conciliacionV2()
        {
            var userAgent = HttpContext.Request.Headers["User-Agent"];
            var ipAgent = HttpContext.Connection.RemoteIpAddress;
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            try
            {
                /**
                **Preparación de datos
                */
                string url = "https://efws-dev.stpmex.com/efws/API/V2/conciliacion";
                var client = new HttpClient();
                var Da = DateTime.Now.ToString("yyyyMMdd");
                int DaInt = Convert.ToInt32(Da);

                PostConciliacionV2 post = new PostConciliacionV2()
                {
                    empresa = "EMPRENDEDORES_C",
                    page = 0,
                    tipoOrden = "E",
                    fechaOperacion = DaInt,
                    firma = new CryptoHandler().firmaConsultaConciliacionV2("E", DaInt),
                };
                var data = JsonSerializer.Serialize<PostConciliacionV2>(post);

                HttpContent content = new StringContent(data, System.Text.Encoding.UTF8, "application/json");

                /**
                **Peticion al servicio
                */
                var httpResponse = await client.PostAsync(url, content);
                var result = "";

                if (httpResponse.IsSuccessStatusCode)
                {
                    /**
                    **Peticion exitosa
                    */
                    result = await httpResponse.Content.ReadAsStringAsync();
                    Debug.WriteLine(result);
                    var postResult = JsonSerializer.Deserialize<resultadoConsultaConciliacionv2>(result);
                    var diaOperativoActual = DateTime.Now.ToString("yyyyMMdd");
                    ConexionBD.database.BeginTransaction();
                    var cabecero = new DBContext.DBConfia.STP.ConciliacionV2()
                    {
                        FechaConsulta = DateTime.Now,
                        UsuarioConsulta = UsuarioActual.UsuarioID,
                        FechaOperativa = DateTime.Now.ToString("yyyyMMdd")
                    };

                    await ConexionBD.database.InsertAsync(cabecero);

                    foreach (var item in postResult.datos)
                    {
                        var detalle = new DBContext.DBConfia.STP.ConciliacionV2Detalle()
                        {
                            ConciliacionID = cabecero.ConciliacionID,
                            idEF = item.idEF,
                            causaDevolucion = item.causaDevolucion > 0 ? item.causaDevolucion.ToString() : null,
                            claveRastreo = item.claveRastreo,
                            claveRastreoDevolucion = item.claveRastreoDevolucion,
                            conceptoPago = item.conceptoPago,
                            cuentaBeneficiario = item.cuentaBeneficiario,
                            cuentaOrdenante = item.cuentaOrdenante,
                            empresa = item.empresa,
                            fechaOperacion = item.fechaOperacion.ToString(),
                            estado = item.estado,
                            institucionContraparte = item.institucionContraparte > 0 ? item.institucionContraparte?.ToString() : null,
                            institucionOperante = item.institucionOperante > 0 ? item.institucionContraparte?.ToString() : null,
                            medioEntrega = item.medioEntrega > 0 ? item.medioEntrega.ToString() : null,
                            monto = item.monto.ToString(),
                            nombreBeneficiario = item.nombreBeneficiario,
                            nombreOrdenante = item.nombreOrdenante,
                            referenciaNumerica = item.referenciaNumerica.ToString(),
                            nombreCep = item.nombreCep,
                            tipoCuentaBeneficiario = item.tipoCuentaBeneficiario.ToString(),
                            tipoCuentaOrdenante = item.tipoCuentaOrdenante.ToString(),
                            rfcCep = item.rfcCep,
                            rfcCurpBeneficiario = item.rfcCurpBeneficiario,
                            rfcCurpOrdenante = item.rfcCurpOrdenante,
                            tsCaptura = item.tsCaptura.ToString(),
                            tsLiquidacion = item.tsLiquidacion.ToString(),
                            sello = item.sello,
                            urlCEP = item.urlCEP,
                        };

                        await ConexionBD.database.InsertAsync(detalle);
                    }

                    ConexionBD.database.CompleteTransaction();
                    var diserpsionesSistemaCV = await ConexionBD.database.QueryAsync<DBContext.DBConfia.STP.Dispersiones>("WHERE FechaOperacion=@0", diaOperativoActual).ToListAsync();

                    postResult.datos.RemoveAll(x => x.estado != "TLQ" && x.estado != "LQ");

                    foreach (var item in postResult.datos)
                    {
                        var existe = diserpsionesSistemaCV.Find(x => x.ClaveDispersionSTP == item.idEF);
                        if (existe != null) { item.conciliado = true; }
                        else { item.conciliado = false; }
                    }
                    await ConexionBD.Destroy();

                    return Ok(postResult.datos);
                }
                else
                {
                    result = await httpResponse.Content.ReadAsStringAsync();
                    /**
                     **Peticion no exitosa
                     */
                    var evento = new DBContext.DBConfia.STP.LogEventos()
                    {
                        TipoEventoID = 6,
                        Origen = userAgent.ToString(),
                        IP = ipAgent.ToString(),
                        FechaRegistro = DateTime.Now,
                        BodyRequest = "NA",
                    };
                    await ConexionBD.database.InsertAsync(evento);
                    await ConexionBD.Destroy();
                    return BadRequest(result);
                }
            }
            catch (Exception ex)
            {
                ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("dispersarEfectivo")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> consultaHistoricoFecha(ConfiaWebApi.PeticionesRest.SOMA.Dispersiones.dispersionEfectivo parData)
        {
            var userAgent = HttpContext.Request.Headers["User-Agent"];
            var ipAgent = HttpContext.Connection.RemoteIpAddress;
            string objetoString = Newtonsoft.Json.JsonConvert.SerializeObject(parData);
            try
            {

                var bancosMovimientos = await ConexionBD.database.SingleByIdAsync<Movimientos>(parData.MovimientoID);
                if (bancosMovimientos != null)
                {
                    bancosMovimientos.CatEstatusMovID = 2;
                    bancosMovimientos.Observaciones = "Dispersión del crédito " + parData.CreditoID + " cambiada a efectivo, movimiento cancelado.";
                }
                await ConexionBD.database.UpdateAsync(bancosMovimientos);
                var creditoSeleccionado = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Creditos.Creditos>(parData.CreditoID);
                if (creditoSeleccionado != null)
                {
                    creditoSeleccionado.TipoDesembolsoID = 3;
                    creditoSeleccionado.EstatusID = "P";
                    creditoSeleccionado.MovimientoID = null;
                }
                await ConexionBD.database.UpdateAsync(creditoSeleccionado);
                await ConexionBD.Destroy();
                return Ok();

            }
            catch (Exception ex)
            {

                await ConexionBD.Destroy();
                return BadRequest(ex);

            }
        }

        [HttpGet]
        [Route("consultaSaldo")]
        public async Task<IActionResult> consultaSaldo()
        {
            var userAgent = HttpContext.Request.Headers["User-Agent"];
            var ipAgent = HttpContext.Connection.RemoteIpAddress;
            try
            {
                /**
                **Preparación de datos
                */
                string url = "https://demo.stpmex.com:7024/speiws/rest/ordenPago/consSaldoCuenta";
                var client = new HttpClient();


                PostSaldoCuenta post = new PostSaldoCuenta()
                {
                    cuentaOrdenante = "646180324800000008",
                    firma = new CryptoHandler().firmaSaldoCuentaOrdenante("646180324800000008"),
                };
                var data = JsonSerializer.Serialize<PostSaldoCuenta>(post);
                HttpContent content = new StringContent(data, System.Text.Encoding.UTF8, "application/json");
                /**
                **Peticion al servicio
                */
                var httpResponse = await client.PostAsync(url, content);
                var result = "";

                if (httpResponse.IsSuccessStatusCode)
                {
                    /**
                    **Peticion exitosa
                    */
                    result = await httpResponse.Content.ReadAsStringAsync();
                    var postResult = JsonSerializer.Deserialize<RespuestaSaldoOrdenante>(result);
                    if (postResult.resultado.id != 0)
                    {
                        var saldoCuenta = new DBContext.DBConfia.STP.SaldosCuentas()
                        {
                            Cuenta = "646180324800000008",
                            Saldo = postResult.resultado.saldoCuenta.saldo,
                            CargosPendientes = postResult.resultado.saldoCuenta.cargosPendientes,
                            FechaConsulta = DateTime.Now,
                        };
                        await ConexionBD.database.InsertAsync(saldoCuenta);
                        var obj = new
                        {
                            TipoRespuesta = 1,
                            CargosPendientes = postResult.resultado.saldoCuenta.cargosPendientes,
                            Saldo = postResult.resultado.saldoCuenta.saldo
                        };
                        await ConexionBD.Destroy();
                        return Ok(obj);
                    }
                    else
                    {
                        /**
                        **Error en la petición
                        */
                        var obj = new
                        {
                            TipoRespuesta = 2,
                            Descripcion = postResult.resultado.descripcionError,
                        };
                        await ConexionBD.Destroy();
                        return Ok(obj);
                    }
                }
                else
                {
                    /**
                     **Peticion no exitosa
                     */
                    await ConexionBD.Destroy();
                    return BadRequest(httpResponse.StatusCode);
                }
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("consultaXrastreo")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> consultaXrastreo(ConfiaWebApi.PeticionesRest.SOMA.Dispersiones.consultaXrastreo parData)
        {

            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            var userAgent = HttpContext.Request.Headers["User-Agent"];
            var ipAgent = HttpContext.Connection.RemoteIpAddress;
            try
            {
                /**
                ** Prepación de datos
                */
                string url = "https://demo.stpmex.com:7024/speiws/rest/ordenPago/consOrdEnvRastreo";
                var client = new HttpClient();
                var fecha = parData.fechaOperacion.ToString("yyyyMMdd");

                PostClaveRastreo post = new PostClaveRastreo()
                {
                    claveRastreo = parData.claveRastreo,
                    fechaOperacion = Convert.ToInt32(fecha),
                    institucionOperante = 90646,
                    empresa = "EMPRENDEDORES_C",
                    firma = new CryptoHandler().firmaBuscarXRastreo(parData.claveRastreo, Convert.ToInt32(fecha), "EMPRENDEDORES_C"),
                };
                /**
                ** Petición a STP
                */
                var data = JsonSerializer.Serialize<PostClaveRastreo>(post);
                HttpContent content = new StringContent(data, System.Text.Encoding.UTF8, "application/json");
                var httpResponse = await client.PostAsync(url, content);
                var result = "";
                /**
                ** Estatus de la petición
                */
                if (httpResponse.IsSuccessStatusCode)
                {
                    result = await httpResponse.Content.ReadAsStringAsync();
                    var postResult = JsonSerializer.Deserialize<RespuestaConsXrastreo>(result);
                    /**
                    ** Peticón y respesta exitosa
                    */
                    if (postResult.resultado.id != 0)
                    {
                        var catalogoBancos = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Bancos.CatalogoBancos>("WHERE BancoSTPID=@0", postResult.resultado.ordenPago.institucionContraparte).SingleOrDefaultAsync();
                        var estadoDispersion = await ConexionBD.database.QueryAsync<DBContext.DBConfia.STP.CatalogoEstadoDispersion>("WHERE Clave=@0", postResult.resultado.ordenPago.estado).SingleOrDefaultAsync();
                        var tipoCuentaBneficiario = await ConexionBD.database.QueryAsync<DBContext.DBConfia.STP.CatalogoTipoCuenta>("WHERE Clave=@0", postResult.resultado.ordenPago.tipoCuentaBeneficiario).SingleOrDefaultAsync();
                        var fechaString = postResult.resultado.ordenPago.fechaOperacion.ToString();
                        var obj = new
                        {
                            TipoRespuesta = 1,
                            ClaveRastreo = postResult.resultado.ordenPago.claveRastreo,
                            FechaOperacion = fechaString.Substring(6, 2) + "-" + fechaString.Substring(4, 2) + "-" + fechaString.Substring(0, 4),
                            ConceptoPago = postResult.resultado.ordenPago.conceptoPago,
                            Estado = estadoDispersion.Estado,
                            FolioOrigen = postResult.resultado.ordenPago.folioOrigen,
                            NombreBeneficiario = postResult.resultado.ordenPago.nombreBeneficiario,
                            NombreOrdenante = postResult.resultado.ordenPago.nombreOrdenante,
                            CuentaOrdenante = postResult.resultado.ordenPago.cuentaOrdenante,
                            CuentaBeneficiario = postResult.resultado.ordenPago.cuentaBeneficiario,
                            Monto = postResult.resultado.ordenPago.monto,
                            TipoCuentaBeneficiario = tipoCuentaBneficiario.Descripcion
                        };
                        await ConexionBD.Destroy();
                        return Ok(obj);
                    }
                    else
                    {  /**
                        ** Petición correcta pero respuesta no exitosa
                        */
                        var obj = new
                        {
                            TipoRespuesta = 2,
                            Mensaje = "Orden no existe"
                        };
                        await ConexionBD.Destroy();
                        return Ok(obj);
                    }
                }
                else

                {
                    /*
                    * Petición no exitosa 
                    */
                    await ConexionBD.Destroy();
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("consultaHistoricoFecha")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> consultaHistoricoFecha(ConfiaWebApi.PeticionesRest.SOMA.Dispersiones.consultaOrdenesFecha parData)
        {

            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            var userAgent = HttpContext.Request.Headers["User-Agent"];
            var ipAgent = HttpContext.Connection.RemoteIpAddress;
            try
            {
                /**
                ** Prepación de datos
                */
                string url = "https://demo.stpmex.com:7024/speiws/rest/ordenPago/consOrdenesFech";
                var client = new HttpClient();
                var fecha = parData.Fecha.ToString("yyyyMMdd");

                PostHistoricoFecha post = new PostHistoricoFecha()
                {
                    estado = "E",
                    empresa = "EMPRENDEDORES_C",
                    fechaOperacion = Convert.ToInt32(fecha),
                    firma = new CryptoHandler().firmaHistoricoFecha("EMPRENDEDORES_C", Convert.ToInt32(fecha)),
                };
                var data = JsonSerializer.Serialize<PostHistoricoFecha>(post);
                Console.WriteLine(data);
                HttpContent content = new StringContent(data, System.Text.Encoding.UTF8, "application/json");

                switch (parData.TipoConsulta)
                {
                    case 1:
                        var consultaHoy = await ConexionBD.database.QueryAsync<ConsultaOrdenes>("WHERE TipoConsulta = 1 AND DATEADD(dd, 0, DATEDIFF(dd, 0, FechaRegistro)) = DATEADD(dd, 0, DATEDIFF(dd, 0, GETDATE()))").ToArrayAsync();

                        if (consultaHoy.Length > 0)
                        {
                            var ultimaConsultaHoy = consultaHoy.FirstOrDefault();
                            var consultaDetalles = await ConexionBD.database.QueryAsync<ConsultaOrdenesDetalle_VW>("WHERE OrdenID = @0", ultimaConsultaHoy.OrdenID).ToArrayAsync();
                            await ConexionBD.Destroy();
                            var obj1 = new
                            {
                                TipoRespuesta = 1,
                                FechaGenerada = ultimaConsultaHoy.FechaRegistro,
                                DetalleOrdenes = consultaDetalles,
                                FechaConsultada = ultimaConsultaHoy.FechaConsultada,
                            };
                            await ConexionBD.Destroy();
                            return Ok(obj1);
                        }
                        else
                        {
                            var obj1 = new
                            {
                                TipoRespuesta = 2,
                            };
                            await ConexionBD.Destroy();
                            return Ok(obj1);
                        }

                    case 2:
                        /**
                        ** Petición al servicio
                        */
                        var httpResponse2 = await client.PostAsync(url, content);
                        var result2 = "";
                        var idOrdenRegistrada2 = 0;


                        if (httpResponse2.IsSuccessStatusCode)
                        {
                            /**
                            ** Respuesta exitosa
                            */
                            result2 = await httpResponse2.Content.ReadAsStringAsync();
                            var postResult = JsonSerializer.Deserialize<RespuestaHistoricoOperativo>(result2);
                            var consulta = new ConsultaOrdenes()
                            {
                                UsuarioID = UsuarioActual.UsuarioID,
                                FechaRegistro = DateTime.Now,
                                TipoConsulta = 1,
                                FechaConsultada = parData.Fecha,
                            };
                            await ConexionBD.database.InsertAsync(consulta);

                            idOrdenRegistrada2 = consulta.OrdenID;
                            if (postResult.resultado.lst != null)
                            {
                                if (postResult.resultado.lst.Count() > 0)
                                {
                                    /**
                                    **Proceso interno de conciliación
                                    */
                                    foreach (var item in postResult.resultado.lst)
                                    {
                                        var monto = Convert.ToDecimal(item.monto);
                                        var consultaDetalle = new ConsultaOrdenesDetalle()
                                        {
                                            OrdenID = consulta.OrdenID,
                                            CLavePago = "",
                                            ClaveRastreo = item.claveRastreo,
                                            ConceptoPago = item.conceptoPago,
                                            CuentaBeneficiario = item.cuentaBeneficiario,
                                            CuentaOrdenante = item.cuentaOrdenante,
                                            Empresa = item.empresa,
                                            Estado = item.estado,
                                            FechaOperacion = item.fechaOperacion.ToString(),
                                            FolioOrigen = item.folioOrigen,
                                            IdCliente = item.idCliente,
                                            IdEf = item.idEF.ToString(),
                                            InstitucionContraparte = item.institucionContraparte,
                                            InstitucionOperante = item.institucionOperante,
                                            MedioEntrega = item.medioEntrega,
                                            Monto = monto,
                                            NombreBeneficiario = item.nombreBeneficiario,
                                            NombreOrdenante = item.nombreOrdenante,
                                            Prioridad = item.prioridad,
                                            ReferenciaNumerica = item.referenciaNumerica.ToString(),
                                            CurpRfcBeneficiario = item.rfcCurpBeneficiario,
                                            CurpRfcOrdenante = item.rfcCurpOrdenante,
                                            TipoCuentaBeneficiario = item.tipoCuentaBeneficiario,
                                            TipoPago = item.tipoPago,
                                            Topologia = item.topologia,
                                            TsCaptura = item.tsCaptura.ToString(),
                                            Usuario = item.usuario,
                                        };
                                        await ConexionBD.database.InsertAsync(consultaDetalle);
                                    }

                                }

                            }
                            var evento = new DBContext.DBConfia.STP.LogEventos()
                            {
                                TipoEventoID = 5,
                                Origen = userAgent.ToString(),
                                IP = ipAgent.ToString(),
                                FechaRegistro = DateTime.Now,
                                BodyRequest = "NA",
                            };
                            await ConexionBD.database.InsertAsync(evento);
                        }
                        else
                        {
                            /**
                            ** Respuesta fallida
                            */
                            var evento = new DBContext.DBConfia.STP.LogEventos()
                            {
                                TipoEventoID = 6,
                                Origen = userAgent.ToString(),
                                IP = ipAgent.ToString(),
                                FechaRegistro = DateTime.Now,
                                BodyRequest = "NA",
                            };
                            await ConexionBD.database.InsertAsync(evento);
                            await ConexionBD.Destroy();
                            return BadRequest(result2);
                        }

                        var detalleOrdenes2 = await ConexionBD.database.QueryAsync<ConsultaOrdenesDetalle_VW>("WHERE OrdenID = @0", idOrdenRegistrada2).ToArrayAsync();
                        await ConexionBD.Destroy();
                        var obj2 = new
                        {
                            TipoRespuesta = 2,
                            FechaGenerada = DateTime.Now,
                            DetalleOrdenes = detalleOrdenes2,
                            FechaConsultada = parData.Fecha,
                        };
                        await ConexionBD.Destroy();
                        return Ok(obj2);

                    case 3:
                        var consultaHoy2 = await ConexionBD.database.QueryAsync<ConsultaOrdenes>("WHERE TipoConsulta = 1 AND DATEADD(dd, 0, DATEDIFF(dd, 0, FechaRegistro)) = DATEADD(dd, 0, DATEDIFF(dd, 0, GETDATE()))").ToArrayAsync();
                        if (consultaHoy2.Length > 1)
                        {
                            var ultimaConsultaHoy = consultaHoy2.OrderByDescending(x => x.FechaRegistro).FirstOrDefault();
                            var consultaDetalles = await ConexionBD.database.QueryAsync<ConsultaOrdenesDetalle_VW>("WHERE OrdenID = @0", ultimaConsultaHoy.OrdenID).ToArrayAsync();
                            await ConexionBD.Destroy();
                            var obj3 = new
                            {
                                TipoRespuesta = 3,
                                FechaGenerada = ultimaConsultaHoy.FechaRegistro,
                                DetalleOrdenes = consultaDetalles,
                                FechaConsultada = ultimaConsultaHoy.FechaConsultada,
                            };
                            await ConexionBD.Destroy();
                            return Ok(obj3);
                        }
                        else
                        {
                            var obj3 = new
                            {
                                TipoRespuesta = 4,
                            };
                            await ConexionBD.Destroy();
                            return Ok(obj3);
                        }
                    case 4:
                        var httpResponse4 = await client.PostAsync(url, content);
                        var result4 = "";
                        var idOrdenRegistrada4 = 0;

                        if (httpResponse4.IsSuccessStatusCode)
                        {
                            result4 = await httpResponse4.Content.ReadAsStringAsync();
                            var postResult = JsonSerializer.Deserialize<RespuestaHistoricoOperativo>(result4);
                            var consulta = new ConsultaOrdenes()
                            {
                                UsuarioID = UsuarioActual.UsuarioID,
                                FechaRegistro = DateTime.Now,
                                TipoConsulta = 1,
                                FechaConsultada = parData.Fecha,
                            };
                            await ConexionBD.database.InsertAsync(consulta);

                            idOrdenRegistrada4 = consulta.OrdenID;
                            if (postResult.resultado.lst != null)
                            {
                                if (postResult.resultado.lst.Count() > 0)
                                {
                                    foreach (var item in postResult.resultado.lst)
                                    {
                                        var monto = Convert.ToDecimal(item.monto);
                                        var consultaDetalle = new ConsultaOrdenesDetalle()
                                        {
                                            OrdenID = consulta.OrdenID,
                                            CLavePago = "",
                                            ClaveRastreo = item.claveRastreo,
                                            ConceptoPago = item.conceptoPago,
                                            CuentaBeneficiario = item.cuentaBeneficiario,
                                            CuentaOrdenante = item.cuentaOrdenante,
                                            Empresa = item.empresa,
                                            Estado = item.estado,
                                            FechaOperacion = item.fechaOperacion.ToString(),
                                            FolioOrigen = item.folioOrigen,
                                            IdCliente = item.idCliente,
                                            IdEf = item.idEF.ToString(),
                                            InstitucionContraparte = item.institucionContraparte,
                                            InstitucionOperante = item.institucionOperante,
                                            MedioEntrega = item.medioEntrega,
                                            Monto = monto,
                                            NombreBeneficiario = item.nombreBeneficiario,
                                            NombreOrdenante = item.nombreOrdenante,
                                            Prioridad = item.prioridad,
                                            ReferenciaNumerica = item.referenciaNumerica.ToString(),
                                            CurpRfcBeneficiario = item.rfcCurpBeneficiario,
                                            CurpRfcOrdenante = item.rfcCurpOrdenante,
                                            TipoCuentaBeneficiario = item.tipoCuentaBeneficiario,
                                            TipoPago = item.tipoPago,
                                            Topologia = item.topologia,
                                            TsCaptura = item.tsCaptura.ToString(),
                                            Usuario = item.usuario,
                                        };
                                        await ConexionBD.database.InsertAsync(consultaDetalle);
                                    }

                                }
                            }

                            var evento = new DBContext.DBConfia.STP.LogEventos()
                            {
                                TipoEventoID = 5,
                                Origen = userAgent.ToString(),
                                IP = ipAgent.ToString(),
                                FechaRegistro = DateTime.Now,
                                BodyRequest = "NA",
                            };
                            await ConexionBD.database.InsertAsync(evento);
                        }

                        var detalleOrdenes4 = await ConexionBD.database.QueryAsync<ConsultaOrdenesDetalle_VW>("WHERE OrdenID = @0", idOrdenRegistrada4).ToArrayAsync();
                        await ConexionBD.Destroy();
                        var obj4 = new
                        {
                            TipoRespuesta = 4,
                            FechaGenerada = DateTime.Now,
                            DetalleOrdenes = detalleOrdenes4,
                            FechaConsultada = parData.Fecha,
                        };
                        await ConexionBD.Destroy();
                        return Ok(obj4);

                    default:
                        return BadRequest("Opción no disponible");
                }
            }
            catch (Exception ex)
            {
                var evento = new DBContext.DBConfia.STP.LogEventos()
                {
                    TipoEventoID = 6,
                    Origen = userAgent.ToString(),
                    IP = ipAgent.ToString(),
                    FechaRegistro = DateTime.Now,
                    BodyRequest = "NA",
                };
                await ConexionBD.database.InsertAsync(evento);
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("consultaHistoricoOperativo")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> consultaHistoricoOperativo(ConfiaWebApi.PeticionesRest.SOMA.Dispersiones.consultaOrdenes parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            var userAgent = HttpContext.Request.Headers["User-Agent"];
            var ipAgent = HttpContext.Connection.RemoteIpAddress;
            try
            {
                /**
                * * Preparación de la petición
                */
                string url = "https://demo.stpmex.com:7024/speiws/rest/ordenPago/consOrdenesFech";
                var client = new HttpClient();
                PostHistoricoOperativo post = new PostHistoricoOperativo()
                {
                    estado = "E",
                    empresa = "EMPRENDEDORES_C",
                    firma = new CryptoHandler().firmaHistorico("EMPRENDEDORES_C"),
                };
                var data = JsonSerializer.Serialize<PostHistoricoOperativo>(post);
                HttpContent content = new StringContent(data, System.Text.Encoding.UTF8, "application/json");

                switch (parData.TipoConsulta)
                {

                    case 1:
                        var consultaHoy = await ConexionBD.database.QueryAsync<ConsultaOrdenes>("WHERE TipoConsulta = 2 AND DATEADD(dd, 0, DATEDIFF(dd, 0, FechaRegistro)) = DATEADD(dd, 0, DATEDIFF(dd, 0, GETDATE()))").ToArrayAsync();

                        if (consultaHoy.Length > 0)
                        {
                            var ultimaConsultaHoy = consultaHoy.FirstOrDefault();
                            var consultaDetalles = await ConexionBD.database.QueryAsync<ConsultaOrdenesDetalle_VW>("WHERE OrdenID = @0", ultimaConsultaHoy.OrdenID).ToArrayAsync();
                            var obj = new
                            {
                                TipoRespuesta = 1,
                                FechaGenerada = ultimaConsultaHoy.FechaRegistro,
                                DetalleOrdenes = consultaDetalles,
                                FechaConsultada = ultimaConsultaHoy.FechaConsultada
                            };
                            await ConexionBD.Destroy();
                            return Ok(obj);
                        }
                        else
                        {
                            var obj = new
                            {
                                TipoRespuesta = 2,
                            };
                            await ConexionBD.Destroy();
                            return Ok(obj);
                        }

                    case 2:
                        /**
                        * * Ejecución de la petición
                        */

                        var httpResponse2 = await client.PostAsync(url, content);
                        var result2 = "";
                        var idOrdenRegistrada2 = 0;

                        if (httpResponse2.IsSuccessStatusCode)
                        {
                            /**
                            **Petición exitosa
                            */
                            result2 = await httpResponse2.Content.ReadAsStringAsync();
                            var postResult = JsonSerializer.Deserialize<RespuestaHistoricoOperativo>(result2);
                            var consulta = new ConsultaOrdenes()
                            {
                                UsuarioID = UsuarioActual.UsuarioID,
                                FechaRegistro = DateTime.Now,
                                TipoConsulta = 2,
                            };
                            await ConexionBD.database.InsertAsync(consulta);

                            idOrdenRegistrada2 = consulta.OrdenID;

                            if (postResult.resultado.lst != null)
                            {
                                /**
                                * * Proceso interno para conciliación de datos
                                */
                                foreach (var item in postResult.resultado.lst)
                                {
                                    var monto = Convert.ToDecimal(item.monto);
                                    var consultaDetalle = new ConsultaOrdenesDetalle()
                                    {
                                        OrdenID = consulta.OrdenID,
                                        CLavePago = "",
                                        ClaveRastreo = item.claveRastreo,
                                        ConceptoPago = item.conceptoPago,
                                        CuentaBeneficiario = item.cuentaBeneficiario,
                                        CuentaOrdenante = item.cuentaOrdenante,
                                        Empresa = item.empresa,
                                        Estado = item.estado,
                                        FechaOperacion = item.fechaOperacion.ToString(),
                                        FolioOrigen = item.folioOrigen,
                                        IdCliente = item.idCliente,
                                        IdEf = item.idEF.ToString(),
                                        InstitucionContraparte = item.institucionContraparte,
                                        InstitucionOperante = item.institucionOperante,
                                        MedioEntrega = item.medioEntrega,
                                        Monto = monto,
                                        NombreBeneficiario = item.nombreBeneficiario,
                                        NombreOrdenante = item.nombreOrdenante,
                                        Prioridad = item.prioridad,
                                        ReferenciaNumerica = item.referenciaNumerica.ToString(),
                                        CurpRfcBeneficiario = item.rfcCurpBeneficiario,
                                        CurpRfcOrdenante = item.rfcCurpOrdenante,
                                        TipoCuentaBeneficiario = item.tipoCuentaBeneficiario,
                                        TipoPago = item.tipoPago,
                                        Topologia = item.topologia,
                                        TsCaptura = item.tsCaptura.ToString(),
                                        Usuario = item.usuario,
                                    };
                                    await ConexionBD.database.InsertAsync(consultaDetalle);
                                }
                            }
                            var evento = new DBContext.DBConfia.STP.LogEventos()
                            {
                                TipoEventoID = 5,
                                Origen = userAgent.ToString(),
                                IP = ipAgent.ToString(),
                                FechaRegistro = DateTime.Now,
                                BodyRequest = "NA",
                            };
                            await ConexionBD.database.InsertAsync(evento);
                        }
                        else
                        {
                            /**
                            **Petición fallida
                            */
                            var evento = new DBContext.DBConfia.STP.LogEventos()
                            {
                                TipoEventoID = 6,
                                Origen = userAgent.ToString(),
                                IP = ipAgent.ToString(),
                                FechaRegistro = DateTime.Now,
                                BodyRequest = "NA",
                            };
                            await ConexionBD.database.InsertAsync(evento);
                            return BadRequest(result2);
                        }

                        var detalleOrdenes2 = await ConexionBD.database.QueryAsync<ConsultaOrdenesDetalle_VW>("WHERE OrdenID = @0", idOrdenRegistrada2).ToArrayAsync();
                        var ordenFecha = await ConexionBD.database.QueryAsync<ConsultaOrdenes>("WHERE OrdenID = @0", idOrdenRegistrada2).FirstOrDefaultAsync();
                        var obj2 = new
                        {
                            TipoRespuesta = 2,
                            FechaGenerada = ordenFecha.FechaRegistro,
                            DetalleOrdenes = detalleOrdenes2,
                            FechaConsultada = ordenFecha.FechaConsultada
                        };
                        await ConexionBD.Destroy();
                        return Ok(obj2);

                    case 3:
                        var consultaHoy2 = await ConexionBD.database.QueryAsync<ConsultaOrdenes>("WHERE TipoConsulta = 2 AND DATEADD(dd, 0, DATEDIFF(dd, 0, FechaRegistro)) = DATEADD(dd, 0, DATEDIFF(dd, 0, GETDATE()))").ToArrayAsync();
                        if (consultaHoy2.Length > 1)
                        {
                            var ultimaConsultaHoy = consultaHoy2.OrderByDescending(x => x.FechaRegistro).FirstOrDefault();
                            var consultaDetalles = await ConexionBD.database.QueryAsync<ConsultaOrdenesDetalle_VW>("WHERE OrdenID = @0", ultimaConsultaHoy.OrdenID).ToArrayAsync();
                            var obj = new
                            {
                                TipoRespuesta = 3,
                                FechaGenerada = ultimaConsultaHoy.FechaRegistro,
                                DetalleOrdenes = consultaDetalles,
                            };
                            await ConexionBD.Destroy();
                            return Ok(obj);
                        }
                        else
                        {
                            var obj = new
                            {
                                TipoRespuesta = 4,
                            };
                            await ConexionBD.Destroy();
                            return Ok(obj);
                        }
                    case 4:
                        var httpResponse4 = await client.PostAsync(url, content);
                        var result4 = "";
                        var idOrdenRegistrada4 = 0;
                        if (httpResponse4.IsSuccessStatusCode)
                        {
                            result4 = await httpResponse4.Content.ReadAsStringAsync();
                            var postResult = JsonSerializer.Deserialize<RespuestaHistoricoOperativo>(result4);
                            var consulta = new ConsultaOrdenes()
                            {
                                UsuarioID = UsuarioActual.UsuarioID,
                                FechaRegistro = DateTime.Now,
                                TipoConsulta = 2,
                            };
                            await ConexionBD.database.InsertAsync(consulta);
                            idOrdenRegistrada4 = consulta.OrdenID;

                            if (postResult.resultado.lst != null)
                            {
                                if (postResult.resultado.lst.Count() > 0)
                                {
                                    foreach (var item in postResult.resultado.lst)
                                    {
                                        var monto = Convert.ToDecimal(item.monto);
                                        var consultaDetalle = new ConsultaOrdenesDetalle()
                                        {
                                            OrdenID = consulta.OrdenID,
                                            CLavePago = "",
                                            ClaveRastreo = item.claveRastreo,
                                            ConceptoPago = item.conceptoPago,
                                            CuentaBeneficiario = item.cuentaBeneficiario,
                                            CuentaOrdenante = item.cuentaOrdenante,
                                            Empresa = item.empresa,
                                            Estado = item.estado,
                                            FechaOperacion = item.fechaOperacion.ToString(),
                                            FolioOrigen = item.folioOrigen,
                                            IdCliente = item.idCliente,
                                            IdEf = item.idEF.ToString(),
                                            InstitucionContraparte = item.institucionContraparte,
                                            InstitucionOperante = item.institucionOperante,
                                            MedioEntrega = item.medioEntrega,
                                            Monto = monto,
                                            NombreBeneficiario = item.nombreBeneficiario,
                                            NombreOrdenante = item.nombreOrdenante,
                                            Prioridad = item.prioridad,
                                            ReferenciaNumerica = item.referenciaNumerica.ToString(),
                                            CurpRfcBeneficiario = item.rfcCurpBeneficiario,
                                            CurpRfcOrdenante = item.rfcCurpOrdenante,
                                            TipoCuentaBeneficiario = item.tipoCuentaBeneficiario,
                                            TipoPago = item.tipoPago,
                                            Topologia = item.topologia,
                                            TsCaptura = item.tsCaptura.ToString(),
                                            Usuario = item.usuario,
                                        };
                                        await ConexionBD.database.InsertAsync(consultaDetalle);
                                    }
                                }
                            }

                            var evento = new DBContext.DBConfia.STP.LogEventos()
                            {
                                TipoEventoID = 5,
                                Origen = userAgent.ToString(),
                                IP = ipAgent.ToString(),
                                FechaRegistro = DateTime.Now,
                                BodyRequest = "NA",
                            };
                            await ConexionBD.database.InsertAsync(evento);
                        }

                        var detalleOrdenes4 = await ConexionBD.database.QueryAsync<ConsultaOrdenesDetalle_VW>("WHERE  OrdenID = @0", idOrdenRegistrada4).ToArrayAsync();
                        var ordenFecha4 = await ConexionBD.database.QueryAsync<ConsultaOrdenes>("WHERE OrdenID = @0", idOrdenRegistrada4).FirstOrDefaultAsync();
                        var obj4 = new
                        {
                            TipoRespuesta = 1,
                            FechaGenerada = ordenFecha4.FechaRegistro,
                            DetalleOrdenes = detalleOrdenes4,
                        };
                        await ConexionBD.Destroy();
                        return Ok(obj4);

                    default:
                        return BadRequest("Opción no disponible");
                }


            }
            catch (Exception ex)
            {
                var evento = new DBContext.DBConfia.STP.LogEventos()
                {
                    TipoEventoID = 6,
                    Origen = userAgent.ToString(),
                    IP = ipAgent.ToString(),
                    FechaRegistro = DateTime.Now,
                    BodyRequest = "NA",
                };
                await ConexionBD.database.InsertAsync(evento);
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("consultaDispersiones")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> consultaDispersiones(ConfiaWebApi.PeticionesRest.SOMA.Dispersiones.consultaDispersion parData)
        {
            try
            {
                var res = await ConexionBD.database.FetchAsync<DBContext.DBConfia.STP.Dispersiones_VW>("WHERE NombreCompleto LIKE  '%' + UPPER(@NombreBeneficiario) +'%' AND ((FechaRegistro >= @FechaInicio OR @FechaInicio IS NULL) AND (FechaRegistro <= @FechaFin OR @FechaFin IS NULL) AND (CuentaOrdenante = @CuentaOrdenante OR " +
                         "@CuentaOrdenante = '')AND (NombreOrdenante = @NombreOrdenante OR " +
                         "@NombreOrdenante = '')AND (EstadoDispersionID = @EstadoDispersionID OR " +
                         "@EstadoDispersionID = 0)AND (ClaveTipoCuenta = @ClaveTipoCuenta OR " +
                         "@ClaveTipoCuenta = 0)   ) ", parData);
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
        [Route("actualizaOrden")]
        public async Task<IActionResult> den(ConfiaWebApi.PeticionesRest.SOMA.Dispersiones.actualizaOrden pardata)
        {

            var userAgent = HttpContext.Request.Headers["User-Agent"];
            var ipAgent = HttpContext.Connection.RemoteIpAddress;
            string objetoString = Newtonsoft.Json.JsonConvert.SerializeObject(pardata);

            try
            {
                ConexionBD.database.BeginTransaction();
                var dispersion = await ConexionBD.database.QueryAsync<DBContext.DBConfia.STP.Dispersiones>("WHERE FolioOrigen=@0", pardata.folioOrigen).FirstOrDefaultAsync();
                if (dispersion != null)
                {
                    /**
                    ** Actualizar la orden interna
                    */
                    dispersion.ClaveEstatus = pardata.estado;
                    if (pardata.estado == "CN" || pardata.estado == "D")
                    {
                        int intentosDisp = 0;
                        if (pardata.causaDevolucion != "0")
                        {
                            dispersion.CausaDevolucion = pardata.causaDevolucion;
                        }
                        var creditoReversa = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoID = @0", dispersion.CreditoID).SingleOrDefaultAsync();
                        intentosDisp = creditoReversa.ReintentosDeDispersion;
                        creditoReversa.DispersionID = null;
                        creditoReversa.ReintentoDispersion = true;
                        creditoReversa.ReintentosDeDispersion = intentosDisp + 1;
                        var movimientoReversa = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Bancos.Movimientos>("WHERE MovimientoID = @0", creditoReversa.MovimientoID).SingleOrDefaultAsync();
                        movimientoReversa.CatEstatusMovID = 3;
                        movimientoReversa.Estatus = "P";
                        await ConexionBD.database.UpdateAsync(movimientoReversa);
                        await ConexionBD.database.UpdateAsync(creditoReversa);
                    }
                    dispersion.FechaActualizacion = DateTime.Now;
                    await ConexionBD.database.UpdateAsync(dispersion);
                    ConexionBD.database.CompleteTransaction();
                    var evento = new DBContext.DBConfia.STP.LogEventos()
                    {
                        TipoEventoID = 2,
                        Origen = userAgent,
                        IP = ipAgent.ToString(),
                        FechaRegistro = DateTime.Now,
                        BodyRequest = objetoString,
                    };
                    await ConexionBD.database.InsertAsync(evento);
                    await ConexionBD.Destroy();

                    return StatusCode(200, new
                    {
                        mensaje = "recibido",
                    });
                }


                else
                {
                    ConexionBD.database.AbortTransaction();
                    var evento = new DBContext.DBConfia.STP.LogEventos()
                    {
                        TipoEventoID = 4,
                        Origen = userAgent,
                        IP = ipAgent.ToString(),
                        FechaRegistro = DateTime.Now,
                        BodyRequest = objetoString,
                    };
                    await ConexionBD.database.InsertAsync(evento);
                    await ConexionBD.Destroy();

                    return StatusCode(200, new
                    {
                        mensaje = "recibido",
                    });
                }
            }
            catch (Exception ex)
            {
                ConexionBD.database.AbortTransaction();
                var evento = new DBContext.DBConfia.STP.LogEventos()
                {
                    TipoEventoID = 4,
                    Origen = userAgent,
                    IP = ipAgent.ToString(),
                    FechaRegistro = DateTime.Now,
                    BodyRequest = objetoString,
                };
                await ConexionBD.database.InsertAsync(evento);
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("registraOrdenSTP")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> registraOrdenSTP(ConfiaWebApi.PeticionesRest.SOMA.Dispersiones.GenerarDispersiones pardata)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            var userAgent = HttpContext.Request.Headers["User-Agent"];
            var ipAgent = HttpContext.Connection.RemoteIpAddress;
            string objetoString = Newtonsoft.Json.JsonConvert.SerializeObject(pardata);

            try
            {
                if (pardata.Dispersiones != null)
                {
                    ArrayList listaDispersiones = new();
                    int cantidadDispersiones = pardata.Dispersiones.Count();
                    int dispersionesRegistradas = 0;
                    foreach (var item in pardata.Dispersiones)
                    {

                        /**
                        * * Preparación objeto con los datos de dispersión
                        */
                        string nombreSinAcentos = Regex.Replace(item.NombreCompleto.Normalize(NormalizationForm.FormD), @"[^a-zA-z0-9 ]+", "");
                        string nombreSinN = nombreSinAcentos.Replace('ñ', 'n');
                        var fecha = DateTime.Now;
                        long unixTime = ((DateTimeOffset)fecha).ToUnixTimeSeconds();
                        var fechaFormateada = fecha.ToString("yyyyMMdd");
                        var productoID = string.Format("{0:000}", item.ProductoID);
                        var empresaID = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Creditos.Productos>(item.ProductoID);
                        var empresaID_2 = string.Format("{0:000}", empresaID.EmpresaId);
                        var creditoID = string.Format("{0:00000000000000}", item.CreditoID);
                        var claveRastreo = fechaFormateada + "00" + productoID + empresaID_2 + creditoID;
                        int longClave = claveRastreo.Length;
                        var fechaNumero = Convert.ToInt32(fechaFormateada);
                        var clienteID = string.Format("{0:0000000}", item.ClienteID);
                        var clienteIdNumero = Convert.ToInt32(clienteID);
                        var cantidad = string.Format("{0:0.00}", item.Capital);
                        CryptoHandler cryptoHandler = new CryptoHandler();
                        string url = "https://demo.stpmex.com:7024/speiws/rest/ordenPago/registra";
                        var client = new HttpClient();
                        OrdenPagoWS ordenPagoWS = new OrdenPagoWS();
                        String firma = "";
                        int tipoCuenta = 0;

                        if (item.datoTipoID == 1) { tipoCuenta = 40; }
                        if (item.datoTipoID == 2) { tipoCuenta = 3; }

                        ordenPagoWS.setClaveRastreo(claveRastreo);
                        ordenPagoWS.setConceptoPago("" + item.CreditoID + "");
                        ordenPagoWS.setCuentaBeneficiario(item.datoBancario);
                        ordenPagoWS.setCuentaOrdenante("646180324800000008");
                        ordenPagoWS.setEmpresa("EMPRENDEDORES_C");
                        ordenPagoWS.setFechaOperacion(fechaNumero);
                        ordenPagoWS.setFolioOrigen(claveRastreo);
                        ordenPagoWS.setInstitucionContraparte(item.BancoStpID);
                        ordenPagoWS.setInstitucionOperante(90646);
                        ordenPagoWS.setMonto(cantidad);
                        ordenPagoWS.setNombreBeneficiario(nombreSinAcentos);
                        ordenPagoWS.setNombreOrdenante("EMPRENDEDORES_C");
                        ordenPagoWS.setReferenciaNumerica(clienteIdNumero);
                        ordenPagoWS.setRfcCurpBeneficiario(item.CURP);
                        ordenPagoWS.setRfcCurpOrdenante("XAXX010101000");
                        ordenPagoWS.setTipoCuentaBeneficiario(tipoCuenta);
                        ordenPagoWS.setTipoCuentaOrdenante(40);
                        ordenPagoWS.setTipoPago(1);
                        firma = new CryptoHandler().cadenaOriginal(ordenPagoWS);
                        ConexionBD.database.BeginTransaction();

                        var stpDisp = new DBContext.DBConfia.STP.Dispersiones()
                        {
                            ClaveRastreo = claveRastreo,
                            ClaveDispersionSTP = 1,
                            CreditoID = item.CreditoID,
                            ConceptoPago = "Dispersion de crédito No. " + item.CreditoID,
                            CuentaBeneficiario = item.datoBancario,
                            CuentaOrdenante = "646180324800000008",
                            Empresa = "EMPRENDEDORES_C",
                            FechaOperacion = fechaNumero.ToString(),
                            FechaRegistro = DateTime.Now,
                            FolioOrigen = claveRastreo,
                            InstitucionContraparte = item.BancoStpID,
                            InstitucionOperante = 90646,
                            Monto = item.Capital,
                            NombreBeneficiario = item.NombreCompleto,
                            NombreOrdenante = "EMPRENDEDORES_C",
                            ReferenciaNumerica = clienteIdNumero.ToString(),
                            CurpRfcBeneficiario = item.CURP != null ? item.CURP : "XAXX010101000",
                            CurpRfcOrdenante = "XAXX010101000",
                            TipoCuentaBeneficiario = tipoCuenta,
                            TipoCuentaOrdenante = 40,
                            TipoPago = 1,
                            Firma = firma,
                            UsuarioDispersaID = UsuarioActual.UsuarioID,
                            ClaveEstatus = "A",
                            BancoClaveSTP = item.BancoStpID,
                        };
                        await ConexionBD.database.InsertAsync(stpDisp);

                        Post post = new Post()
                        {
                            claveRastreo = ordenPagoWS.getClaveRastreo(),
                            conceptoPago = ordenPagoWS.getConceptoPago(),
                            cuentaBeneficiario = ordenPagoWS.getCuentaBeneficiario(),
                            cuentaOrdenante = ordenPagoWS.getCuentaOrdenante(),
                            empresa = ordenPagoWS.getEmpresa(),
                            fechaOperacion = ordenPagoWS.getFechaOperacion(),
                            firma = firma,
                            folioOrigen = ordenPagoWS.getFolioOrigen(),
                            institucionContraparte = ordenPagoWS.getInstitucionContraparte(),
                            institucionOperante = ordenPagoWS.getInstitucionOperante(),
                            monto = ordenPagoWS.getMonto(),
                            nombreBeneficiario = ordenPagoWS.getNombreBeneficiario(),
                            nombreOrdenante = ordenPagoWS.getNombreOrdenante(),
                            referenciaNumerica = ordenPagoWS.getReferenciaNumerica(),
                            rfcCurpBeneficiario = ordenPagoWS.getRfcCurpBeneficiario(),
                            rfcCurpOrdenante = ordenPagoWS.getRfcCurpOrdenante(),
                            tipoCuentaBeneficiario = ordenPagoWS.getTipoCuentaBeneficiario(),
                            tipoCuentaOrdenante = ordenPagoWS.getTipoCuentaOrdenante(),
                            tipoPago = ordenPagoWS.getTipoPago(),
                        };
                        var data = JsonSerializer.Serialize<Post>(post);

                        /**
                        * * Peticion a STP para registrar la orden de pago 
                         */
                        HttpContent content = new StringContent(data, System.Text.Encoding.UTF8, "application/json");
                        var httpResponse = await client.PutAsync(url, content);
                        string myContent = content.ReadAsStringAsync().Result;
                        Debug.WriteLine(myContent);
                        var result = "";

                        /**
                        * * Estatus de la petición 
                        */
                        if (httpResponse.IsSuccessStatusCode)
                        {
                            result = await httpResponse.Content.ReadAsStringAsync();
                            var postResult = JsonSerializer.Deserialize<Respuesta>(result);
                            var id = postResult.resultado.id.ToString().Length;

                            if (id > 3)
                            {
                                //TODO: Proceso Interno
                                ConexionBD.database.CompleteTransaction();
                                dispersionesRegistradas++;
                                var stpDispersion = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.STP.Dispersiones>(stpDisp.DispersionID);
                                stpDispersion.ClaveDispersionSTP = postResult.resultado.id;
                                ConexionBD.database.BeginTransaction();
                                await ConexionBD.database.UpdateAsync(stpDispersion);
                                ConexionBD.database.CompleteTransaction();
                                string objetoString2 = Newtonsoft.Json.JsonConvert.SerializeObject(postResult);

                                var evento = new DBContext.DBConfia.STP.LogEventos()
                                {
                                    TipoEventoID = 1,
                                    Origen = userAgent,
                                    IP = ipAgent.ToString(),
                                    FechaRegistro = DateTime.Now,
                                    BodyRequest = objetoString2,
                                };
                                await ConexionBD.database.InsertAsync(evento);

                                var credito = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Creditos.Creditos>(item.CreditoID);

                                if (credito != null)
                                {
                                    credito.ReintentoDispersion = credito.ReintentoDispersion;
                                    credito.ReintentosDeDispersion = credito.ReintentosDeDispersion;
                                    credito.DispersionID = stpDisp.DispersionID;
                                    var movimientoBanco = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Bancos.Movimientos>(credito.MovimientoID);
                                    if (movimientoBanco != null) { movimientoBanco.CatEstatusMovID = 1; };
                                    await ConexionBD.database.UpdateAsync(movimientoBanco);
                                    await ConexionBD.database.UpdateAsync(credito);
                                }


                                listaDispersiones.Add(new
                                {
                                    CreditoID = item.CreditoID,
                                    ClaveSTP = postResult.resultado.id,
                                    DispersionID = stpDisp.DispersionID,
                                    Monto = item.Capital,
                                });
                            }
                            else
                            {
                                //TODO: Petición correcta, pero no se pudo dispersar
                                ConexionBD.database.AbortTransaction();
                                string objetoString2 = Newtonsoft.Json.JsonConvert.SerializeObject(postResult);
                                var evento = new DBContext.DBConfia.STP.LogEventos()
                                {
                                    TipoEventoID = 3,
                                    Origen = userAgent,
                                    IP = ipAgent.ToString(),
                                    FechaRegistro = DateTime.Now,
                                    BodyRequest = objetoString2,
                                };
                                await ConexionBD.database.InsertAsync(evento);

                            }
                        }
                        else
                        {

                            //TODO: Error en la petición
                            ConexionBD.database.AbortTransaction();
                            var evento = new DBContext.DBConfia.STP.LogEventos()
                            {
                                TipoEventoID = 3,
                                Origen = userAgent,
                                IP = ipAgent.ToString(),
                                FechaRegistro = DateTime.Now,
                                BodyRequest = objetoString,
                            };
                            await ConexionBD.database.InsertAsync(evento);
                            await ConexionBD.Destroy();
                            return BadRequest();
                        }
                    }

                    await ConexionBD.Destroy();
                    /**
                     * * Proceso interno
                     */
                    return StatusCode(200, new
                    {
                        DispersioneRecibidas = cantidadDispersiones,
                        DispersionesRegistradas = dispersionesRegistradas,
                        MensajeID = dispersionesRegistradas > 0 ? 1 : 2,
                        Mensaje = dispersionesRegistradas > 0 ? "Dispersiones registradas correctamente" : "No se registraron dispersiones",
                        Dispersiones = listaDispersiones

                    });
                }

                else
                {
                    return BadRequest("Nada que dispersar");
                }

            }
            catch (Exception ex)
            {
                var evento = new DBContext.DBConfia.STP.LogEventos()
                {
                    TipoEventoID = 3,
                    Origen = userAgent,
                    IP = ipAgent.ToString(),
                    FechaRegistro = DateTime.Now,
                    BodyRequest = objetoString,
                };
                await ConexionBD.database.InsertAsync(evento);
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("registraOrdenSTP-automatico")]

        public async Task<IActionResult> registraOrdenSTPautomatico()
        {

            var userAgent = HttpContext.Request.Headers["User-Agent"];
            var ipAgent = HttpContext.Connection.RemoteIpAddress;
            var TiempoActual = DateTime.Now;
            var PendientesDeDispersar = await ConexionBD.database.QueryAsync<DispersarCreditos_VW>("WHERE EstatusID='A'").ToArrayAsync();
            var TiempoSistema = await ConexionBD.database.QueryAsync<VariablesGlobales>("WHERE varName='TIEMPO_DISPERSION_MINUTOS' ").FirstOrDefaultAsync();
            var TIEMPO_DISPERSION_MINUTOS = Convert.ToInt32(TiempoSistema.varValue);
            string objetoString = Newtonsoft.Json.JsonConvert.SerializeObject(PendientesDeDispersar);


            try
            {
                if (PendientesDeDispersar != null)
                {
                    ArrayList listaDispersiones = new();
                    /* int cantidadDispersiones = CreditoID.Dispersiones.Count(); */
                    int dispersionesRegistradas = 0;
                    foreach (var item in PendientesDeDispersar)
                    {
                        if (item.MinutosDiferencia >= TIEMPO_DISPERSION_MINUTOS)
                        {
                            /**
                        * * Preparación objeto con los datos de dispersión
                        */
                            string nombreSinAcentos = Regex.Replace(item.NombreCompleto.Normalize(NormalizationForm.FormD), @"[^a-zA-z0-9 ]+", "");
                            string nombreSinN = nombreSinAcentos.Replace('ñ', 'n');
                            var fecha = DateTime.Now;
                            long unixTime = ((DateTimeOffset)fecha).ToUnixTimeSeconds();
                            var fechaFormateada = fecha.ToString("yyyyMMdd");
                            var productoID = string.Format("{0:000}", item.ProductoID);
                            var empresaID = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Creditos.Productos>(item.ProductoID);
                            var empresaID_2 = string.Format("{0:000}", empresaID.EmpresaId);
                            var creditoID = string.Format("{0:00000000000000}", item.CreditoID);
                            var claveRastreo = fechaFormateada + "00" + productoID + empresaID_2 + creditoID;
                            int longClave = claveRastreo.Length;
                            var fechaNumero = Convert.ToInt32(fechaFormateada);
                            var clienteID = string.Format("{0:0000000}", item.ClienteID);
                            var clienteIdNumero = Convert.ToInt32(clienteID);
                            var cantidad = string.Format("{0:0.00}", item.Capital);
                            CryptoHandler cryptoHandler = new CryptoHandler();
                            string url = "https://demo.stpmex.com:7024/speiws/rest/ordenPago/registra";
                            var client = new HttpClient();
                            OrdenPagoWS ordenPagoWS = new OrdenPagoWS();
                            String firma = "";
                            int tipoCuenta = 0;

                            if (item.datoTipoID == 1) { tipoCuenta = 40; }
                            if (item.datoTipoID == 2) { tipoCuenta = 3; }

                            ordenPagoWS.setClaveRastreo(claveRastreo);
                            ordenPagoWS.setConceptoPago("" + item.CreditoID + "");
                            ordenPagoWS.setCuentaBeneficiario(item.datoBancario);
                            ordenPagoWS.setCuentaOrdenante("646180324800000008");
                            ordenPagoWS.setEmpresa("EMPRENDEDORES_C");
                            ordenPagoWS.setFechaOperacion(fechaNumero);
                            ordenPagoWS.setFolioOrigen(claveRastreo);
                            ordenPagoWS.setInstitucionContraparte((int)item.BancoStpID);
                            ordenPagoWS.setInstitucionOperante(90646);
                            ordenPagoWS.setMonto(cantidad);
                            ordenPagoWS.setNombreBeneficiario(nombreSinAcentos);
                            ordenPagoWS.setNombreOrdenante("EMPRENDEDORES_C");
                            ordenPagoWS.setReferenciaNumerica(clienteIdNumero);
                            ordenPagoWS.setRfcCurpBeneficiario(item.CURP);
                            ordenPagoWS.setRfcCurpOrdenante("XAXX010101000");
                            ordenPagoWS.setTipoCuentaBeneficiario(tipoCuenta);
                            ordenPagoWS.setTipoCuentaOrdenante(40);
                            ordenPagoWS.setTipoPago(1);
                            firma = new CryptoHandler().cadenaOriginal(ordenPagoWS);
                            ConexionBD.database.BeginTransaction();

                            var stpDisp = new DBContext.DBConfia.STP.Dispersiones()
                            {
                                ClaveRastreo = claveRastreo,
                                ClaveDispersionSTP = 1,
                                CreditoID = item.CreditoID,
                                ConceptoPago = "Dispersion de crédito No. " + item.CreditoID,
                                CuentaBeneficiario = item.datoBancario,
                                CuentaOrdenante = "646180324800000008",
                                Empresa = "EMPRENDEDORES_C",
                                FechaOperacion = fechaNumero.ToString(),
                                FechaRegistro = DateTime.Now,
                                FolioOrigen = claveRastreo,
                                InstitucionContraparte = (int)item.BancoStpID,
                                InstitucionOperante = 90646,
                                Monto = item.Capital,
                                NombreBeneficiario = item.NombreCompleto,
                                NombreOrdenante = "EMPRENDEDORES_C",
                                ReferenciaNumerica = clienteIdNumero.ToString(),
                                CurpRfcBeneficiario = item.CURP != null ? item.CURP : "XAXX010101000",
                                CurpRfcOrdenante = "XAXX010101000",
                                TipoCuentaBeneficiario = tipoCuenta,
                                TipoCuentaOrdenante = 40,
                                TipoPago = 1,
                                Firma = firma,
                                UsuarioDispersaID = (int)item.PersonaIDRegistro,
                                ClaveEstatus = "A",
                                BancoClaveSTP = item.BancoStpID,
                            };
                            await ConexionBD.database.InsertAsync(stpDisp);

                            Post post = new Post()
                            {
                                claveRastreo = ordenPagoWS.getClaveRastreo(),
                                conceptoPago = ordenPagoWS.getConceptoPago(),
                                cuentaBeneficiario = ordenPagoWS.getCuentaBeneficiario(),
                                cuentaOrdenante = ordenPagoWS.getCuentaOrdenante(),
                                empresa = ordenPagoWS.getEmpresa(),
                                fechaOperacion = ordenPagoWS.getFechaOperacion(),
                                firma = firma,
                                folioOrigen = ordenPagoWS.getFolioOrigen(),
                                institucionContraparte = ordenPagoWS.getInstitucionContraparte(),
                                institucionOperante = ordenPagoWS.getInstitucionOperante(),
                                monto = ordenPagoWS.getMonto(),
                                nombreBeneficiario = ordenPagoWS.getNombreBeneficiario(),
                                nombreOrdenante = ordenPagoWS.getNombreOrdenante(),
                                referenciaNumerica = ordenPagoWS.getReferenciaNumerica(),
                                rfcCurpBeneficiario = ordenPagoWS.getRfcCurpBeneficiario(),
                                rfcCurpOrdenante = ordenPagoWS.getRfcCurpOrdenante(),
                                tipoCuentaBeneficiario = ordenPagoWS.getTipoCuentaBeneficiario(),
                                tipoCuentaOrdenante = ordenPagoWS.getTipoCuentaOrdenante(),
                                tipoPago = ordenPagoWS.getTipoPago(),
                            };
                            var data = JsonSerializer.Serialize<Post>(post);

                            /**
                            * * Peticion a STP para registrar la orden de pago 
                             */
                            HttpContent content = new StringContent(data, System.Text.Encoding.UTF8, "application/json");
                            var httpResponse = await client.PutAsync(url, content);
                            string myContent = content.ReadAsStringAsync().Result;
                            Debug.WriteLine(myContent);
                            var result = "";

                            /**
                            * * Estatus de la petición 
                            */
                            if (httpResponse.IsSuccessStatusCode)
                            {
                                result = await httpResponse.Content.ReadAsStringAsync();
                                var postResult = JsonSerializer.Deserialize<Respuesta>(result);
                                var id = postResult.resultado.id.ToString().Length;

                                if (id > 3)
                                {
                                    //TODO: Proceso Interno
                                    ConexionBD.database.CompleteTransaction();
                                    dispersionesRegistradas++;
                                    var stpDispersion = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.STP.Dispersiones>(stpDisp.DispersionID);
                                    stpDispersion.ClaveDispersionSTP = postResult.resultado.id;
                                    ConexionBD.database.BeginTransaction();
                                    await ConexionBD.database.UpdateAsync(stpDispersion);
                                    ConexionBD.database.CompleteTransaction();
                                    string objetoString2 = Newtonsoft.Json.JsonConvert.SerializeObject(postResult);

                                    var evento = new DBContext.DBConfia.STP.LogEventos()
                                    {
                                        TipoEventoID = 1,
                                        Origen = userAgent,
                                        IP = ipAgent.ToString(),
                                        FechaRegistro = DateTime.Now,
                                        BodyRequest = objetoString2,
                                    };
                                    await ConexionBD.database.InsertAsync(evento);

                                    var credito = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Creditos.Creditos>(item.CreditoID);

                                    if (credito != null)
                                    {
                                        credito.ReintentoDispersion = credito.ReintentoDispersion;
                                        credito.ReintentosDeDispersion = credito.ReintentosDeDispersion;
                                        credito.DispersionID = stpDisp.DispersionID;
                                        var movimientoBanco = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Bancos.Movimientos>(credito.MovimientoID);
                                        if (movimientoBanco != null) { movimientoBanco.CatEstatusMovID = 1; };
                                        await ConexionBD.database.UpdateAsync(movimientoBanco);
                                        await ConexionBD.database.UpdateAsync(credito);
                                    }


                                    listaDispersiones.Add(new
                                    {
                                        CreditoID = item.CreditoID,
                                        ClaveSTP = postResult.resultado.id,
                                        DispersionID = stpDisp.DispersionID,
                                        Monto = item.Capital,
                                    });
                                }
                                else
                                {
                                    //TODO: Petición correcta, pero no se pudo dispersar
                                    ConexionBD.database.AbortTransaction();
                                    string objetoString2 = Newtonsoft.Json.JsonConvert.SerializeObject(postResult);
                                    var evento = new DBContext.DBConfia.STP.LogEventos()
                                    {
                                        TipoEventoID = 3,
                                        Origen = userAgent,
                                        IP = ipAgent.ToString(),
                                        FechaRegistro = DateTime.Now,
                                        BodyRequest = objetoString2,
                                    };
                                    await ConexionBD.database.InsertAsync(evento);

                                }
                            }
                            else
                            {

                                //TODO: Error en la petición
                                ConexionBD.database.AbortTransaction();
                                var evento = new DBContext.DBConfia.STP.LogEventos()
                                {
                                    TipoEventoID = 3,
                                    Origen = userAgent,
                                    IP = ipAgent.ToString(),
                                    FechaRegistro = DateTime.Now,
                                    BodyRequest = objetoString,
                                };
                                await ConexionBD.database.InsertAsync(evento);
                                await ConexionBD.Destroy();
                                return BadRequest();
                            }
                        }
                        else
                        {
                            return BadRequest("Nada que dispersar");
                        }

                    }

                    await ConexionBD.Destroy();
                    /**
                     * * Proceso interno
                     */
                    return StatusCode(200, new
                    {
                        /*                         DispersioneRecibidas = cantidadDispersiones,
                         */
                        DispersionesRegistradas = dispersionesRegistradas,
                        MensajeID = dispersionesRegistradas > 0 ? 1 : 2,
                        Mensaje = dispersionesRegistradas > 0 ? "Dispersiones registradas correctamente" : "No se registraron dispersiones",
                        Dispersiones = listaDispersiones

                    });
                }

                else
                {
                    return BadRequest("Nada que dispersar");
                }

            }
            catch (Exception ex)
            {
                var evento = new DBContext.DBConfia.STP.LogEventos()
                {
                    TipoEventoID = 3,
                    Origen = userAgent,
                    IP = ipAgent.ToString(),
                    FechaRegistro = DateTime.Now,
                    BodyRequest = "NA",
                };
                await ConexionBD.database.InsertAsync(evento);
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("getbyfiltros")]
        [Authorize]
        // [Code.KeycloakSecurityAttributes(new string[] { "CREDITOS" })]
        public async Task<IActionResult> GetbyFiltros(PeticionesRest.Creditos.CreditoDispersion.Get parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            parData.UsuarioID = UsuarioActual.UsuarioID;


            try
            {
                var res = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.DispersarCreditos_VW>("WHERE  (ProductoID = @ProductoID OR @ProductoID = 0) AND (ClienteID = @ClienteID OR " +
                         "@ClienteID = 0) AND (SucursalID = @SucursalID OR " +
                         "@SucursalID = 0) AND (ZonaID = @ZonaID OR " +
                         "@ZonaID = 0) AND (DistribuidorNivelID = @DistribuidorNivelID OR " +
                         "@DistribuidorNivelID = 0) AND (DistribuidorID = @DistribuidorID OR " +
                         "@DistribuidorID = 0) AND (EstatusID = @EstatusID OR " +
                         "@EstatusID = '') AND (ContratoID = @ContratoID OR " +
                         "@ContratoID = 0) AND (CoordinadorID = @CoordinadorID OR " +
                         "@CoordinadorID = 0) AND TipoDesembolsoID = 7 AND ((FechaHoraRegistro >= CAST(@FechaInicio AS DATETIME) OR @FechaInicio IS NULL) " +
                         "AND (FechaHoraRegistro <= CAST(@FechaFin AS DATETIME) OR @FechaFin IS NULL)) " +
                         "AND (EmpresaId = @EmpresaId OR @EmpresaId = 0)", parData).ToArrayAsync();

                await ConexionBD.Destroy();
                var res2 = res;
                return Ok(res2);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpGet]
        [Route("crearDispersion/{CreditoID}")]
        [Authorize]
        //[Code.KeycloakSecurityAttributes(new string[] { "CREDITOS" })]
        public async Task<ActionResult> crearDisp(int CreditoID)
        {
            try
            {

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                // var UsuarioActual = await ConexionBD.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
                var PersonaActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE UsuarioID=@0", UsuarioActual.UsuarioID).FirstOrDefaultAsync();

                ConexionBD.database.BeginTransaction(IsolationLevel.ReadUncommitted);

                var credito = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoID=@0", CreditoID).SingleOrDefaultAsync();
                credito.EstatusID = "C";
                await ConexionBD.database.UpdateAsync(credito);

                var movBanco = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Bancos.Movimientos>(credito.MovimientoID);
                movBanco.CatEstatusMovID = 2;
                movBanco.Estatus = "C";
                movBanco.cancelacionObservacion = "Cancelación de crédito " + credito.CreditoID + " por dispersión STP Fallida";
                movBanco.FechaCancelacion = DateTime.Now;
                await ConexionBD.database.UpdateAsync(movBanco);

                var DatosDisp = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.DatosDeDispersion_VW>("WHERE CreditoID=@0", CreditoID).SingleOrDefaultAsync();

                var valeraDetalle = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Distribuidores.ValeraDetalle>("WHERE Folio=@0", DatosDisp.ValeCanje).SingleOrDefaultAsync();
                valeraDetalle.Estatus = "A";
                await ConexionBD.database.UpdateAsync(valeraDetalle);

                string Stored = "";
                Stored = "EXEC Creditos.pa_CanjeaVale_Ins @0, @1, @2, @3, @4, @5, @6, @7, @8, @9, @10, @11";
                var res = await ConexionBD.database.QueryAsync<CanjeaValeRes>(Stored, DatosDisp.ProductoID, DatosDisp.DistribuidorID, DatosDisp.ClienteID, DatosDisp.SucursalID, DatosDisp.SerieId,
                DatosDisp.ValeCanje, DatosDisp.Capital, DatosDisp.Plazos, PersonaActual.UsuarioID, DatosDisp.TipoDesembolsoID, PersonaActual.UsuarioID, null).FirstOrDefaultAsync();

                if (res.regresa != 1)
                {
                    ConexionBD.database.AbortTransaction();
                    return Ok(res);
                }

                var dispersion_det = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.ArchivoDispersionDetalle>("WHERE CreditoID=@0", DatosDisp.CreditoID).SingleOrDefaultAsync();
                dispersion_det.Observaciones = "Dispersada en efectivo por devolución. Crédito Nro. " + res.CreditoId;
                dispersion_det.FechaReasignado = DateTime.Now;
                dispersion_det.FechaReasignado = DateTime.Now;
                dispersion_det.Estatus = 5;
                dispersion_det.Reasignado = true;
                await ConexionBD.database.UpdateAsync(dispersion_det);

                ConexionBD.database.CompleteTransaction();
                return Ok(res);
            }
            catch (Exception ex)
            {
                ConexionBD.database.AbortTransaction();
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        [Route("devueltas")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> DispersionesDevueltas()
        {
            try
            {
                var res = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.ArchivoDispersionDetalle>("WHERE Estatus=6 AND Reasignado=0").ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception err)
            {
                await ConexionBD.Destroy();
                return BadRequest(err.Message);
            }
        }


        [HttpPost]
        [Route("generacion-archivodisp")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GenerarArchivoDispersion(PeticionesRest.SOMA.GeneraDispersion.Get parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            //parData.UsuarioID = UsuarioActual.UsuarioID;
            try
            {
                var res = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Creditos.DispersarCreditos_Archivos_VW>("WHERE  (ProductoID = @ProductoID OR @ProductoID = 0) AND (ClienteID = @ClienteID OR " +
                         "@ClienteID = 0) AND (SucursalID = @SucursalID OR " +
                         "@SucursalID = 0) AND (ZonaID = @ZonaID OR " +
                         "@ZonaID = 0) AND (DistribuidorNivelID = @DistribuidorNivelID OR " +
                         "@DistribuidorNivelID = 0) AND (DistribuidorID = @DistribuidorID OR " +
                         "@DistribuidorID = 0) AND (EstatusID = @EstatusID OR " +
                         "@EstatusID = '') AND (ContratoID = @ContratoID OR " +
                         "@ContratoID = 0) AND (CoordinadorID = @CoordinadorID OR " +
                         "@CoordinadorID = 0) AND TipoDesembolsoID = 12 AND ((FechaHoraRegistro >= @FechaInicio OR @FechaInicio IS NULL) AND (FechaHoraRegistro <= @FechaFin OR @FechaFin IS NULL)) " +
                         "AND (EmpresaId = @EmpresaId OR @EmpresaId = 0 AND TipoDesembolsoID = @TipoDesembolsoID ) ", parData);

                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }

        }


        [HttpPost]
        [Route("generacion-archivodispODP")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GenerarArchivoDispersionODP(PeticionesRest.SOMA.GeneraDispersion.Get parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            //parData.UsuarioID = UsuarioActual.UsuarioID;
            try
            {
                var res = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Creditos.DispersarCreditos_Archivos_VW>("WHERE  (ProductoID = @ProductoID OR @ProductoID = 0) AND (ClienteID = @ClienteID OR " +
                         "@ClienteID = 0) AND (SucursalID = @SucursalID OR " +
                         "@SucursalID = 0) AND (ZonaID = @ZonaID OR " +
                         "@ZonaID = 0) AND (DistribuidorNivelID = @DistribuidorNivelID OR " +
                         "@DistribuidorNivelID = 0) AND (DistribuidorID = @DistribuidorID OR " +
                         "@DistribuidorID = 0) AND (EstatusID = @EstatusID OR " +
                         "@EstatusID = '') AND (ContratoID = @ContratoID OR " +
                         "@ContratoID = 0) " +
                         " AND TipoDesembolsoID = 6 AND ((FechaHoraRegistro >= @FechaInicio OR @FechaInicio IS NULL) AND (FechaHoraRegistro <= @FechaFin OR @FechaFin IS NULL)) " +
                         "AND (EmpresaId = @EmpresaId OR @EmpresaId = 0 ) ", parData);

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
        [Route("dispersion/get/{productoID}/{tipoDesembolsoID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> CorteCajaSucursal(int productoID, int tipoDesembolsoID)
        {

            try
            {
                var corteDeCaja = await ConexionBD.database.QueryAsync<FnsDispersionW>("SELECT * FROM Tesoreria.FnsDispersion2(@0, @1)", productoID, tipoDesembolsoID).ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(corteDeCaja);
            }
            catch (Exception err)
            {
                await ConexionBD.Destroy();
                return BadRequest(err.Message);
            }


        }

        [HttpGet]
        [Route("dispersion")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerArchivosGenerados()
        {

            try
            {
                var dispersiones = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Tesoreria.ArchivoDispersion2>();
                await ConexionBD.Destroy();
                return Ok(dispersiones);
            }
            catch (Exception err)
            {
                await ConexionBD.Destroy();
                return BadRequest(err.Message);
            }


        }

        [HttpGet]
        [Route("dispersion/{DispersionID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerDetalle(int DispersionID)
        {

            try
            {
                var dispersiones = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.ArchivoDispersionDetalle>("WHERE ArchivoDispersionID=@0", DispersionID).ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(dispersiones);
            }
            catch (Exception err)
            {
                await ConexionBD.Destroy();
                return BadRequest(err.Message);
            }


        }

        [HttpGet]
        [Route("imprimir/{DispersionID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ActualizarContadorImpresion(int DispersionID)
        {

            try
            {
                ConexionBD.database.BeginTransaction();
                var dispersiones = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Tesoreria.ArchivoDispersion2>(DispersionID);
                dispersiones.Impresa += 1;
                await ConexionBD.database.UpdateAsync(dispersiones);
                var dispersionesDetalle = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.ArchivoDispersionDetalle>("WHERE ArchivoDispersionID=@0", DispersionID).ToArrayAsync();
                ConexionBD.database.CompleteTransaction();
                return Ok(dispersionesDetalle);
            }
            catch (Exception err)
            {
                ConexionBD.database.AbortTransaction();
                return BadRequest(err.Message);
            }


        }

        [HttpPost]
        [Route("aplicar-dispersion")]
        [Authorize]
        public async Task<IActionResult> aplicarDispersion(PeticionesRest.Administracion.Dispersion.AplicarDisp parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            // var UsuarioActual = await ConexionBD.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
            var PersonaActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE UsuarioID=@0", UsuarioActual.UsuarioID).FirstOrDefaultAsync();

            try
            {
                ConexionBD.database.BeginTransaction();
                var dispersionID = 0;
                foreach (var item in parData.Dispersiones_Aplicar)
                {
                    var dispersion_por_clave = await ConexionBD.database.QueryAsync<ArchivoDispersionDetalle>("WHERE Clave_Rastreo=@0", item.clave_rastreo).SingleOrDefaultAsync();
                    dispersionID = dispersion_por_clave.ArchivoDispersionID;
                    if (dispersion_por_clave.Estatus == 3)
                    {
                        if (item.estado == "Liquidada")
                        {
                            dispersion_por_clave.Estatus = 2;
                            dispersion_por_clave.FechaAplicacion = DateTime.Now;
                            await ConexionBD.database.UpdateAsync(dispersion_por_clave);

                            var credito = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoID=@0", dispersion_por_clave.CreditoID).SingleOrDefaultAsync();

                            var banco_movimiento = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Bancos.Movimientos>("WHERE MovimientoID=@0", credito.MovimientoID).SingleOrDefaultAsync();

                            banco_movimiento.Estatus = "A";
                            banco_movimiento.CatEstatusMovID = 1;
                            await ConexionBD.database.UpdateAsync(banco_movimiento);
                        }

                        if (item.estado == "Devuelta")
                        {
                            dispersion_por_clave.Estatus = 6;
                            dispersion_por_clave.ObservacionesDevuelta = item.causa_dev;
                            await ConexionBD.database.UpdateAsync(dispersion_por_clave);

                        }

                    }
                }
                var estatus = await ConexionBD.database.QueryAsync<ArchivoDispersionDetalle>("WHERE ArchivoDispersionID=@0 AND Estatus=3 OR Estatus=4 OR Estatus=5 OR Estatus=6", dispersionID).ToArrayAsync();
                bool archivoCompleto = estatus.Length > 0 ? false : true;
                if (archivoCompleto)
                {
                    var archivoDispersion = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Tesoreria.ArchivoDispersion2>(dispersionID);
                    archivoDispersion.EstatusArchivoID = 2;
                    await ConexionBD.database.UpdateAsync(archivoDispersion);

                }
                ConexionBD.database.CompleteTransaction();
                return StatusCode(200, new
                {
                    completo = archivoCompleto,
                    dispersionID = dispersionID
                });
            }
            catch (Exception ex)
            {
                ConexionBD.database.AbortTransaction();
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        [Route("dispersion")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> guardarDispersion(PeticionesRest.Administracion.Dispersion.Save parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            // var PersonaActual = await DBContext.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.ID).FirstOrDefaultAsync();
            var consecutivos = await ConexionBD.database.QueryAsync<ArchivoDispersionDetalle>("WHERE CONVERT(DATE, [FechaRegistro]) = CONVERT(DATE, CURRENT_TIMESTAMP)").ToArrayAsync();
            var consecutivoInicial = 0;
            consecutivoInicial = (consecutivos.Length == 0 ? 1 : consecutivos.Length + 1);

            try
            {
                ConexionBD.database.BeginTransaction();

                var archivoDis = new ArchivoDispersion2()
                {
                    TipoDesembolso = parData.TipoDesembolsoID,
                    Fecha = DateTime.Now,
                    UsuarioRealiza = UsuarioActual.UsuarioID,
                    ProductoID = parData.ProductoID,
                    EstatusArchivoID = 1,
                    Impresa = 1
                };
                await ConexionBD.database.InsertAsync(archivoDis);

                foreach (var item in parData.lArchivoDispersion)
                {
                    var detalleDisp = new ArchivoDispersionDetalle()
                    {
                        ArchivoDispersionID = archivoDis.ArchivoDispersionID,
                        CantidadMovimientos = 1,
                        TotalDispersion = item.totalDispersion,
                        Estatus = 3,
                        CatConciliacionID = 1,
                        CreditoID = item.creditoID,
                        ConsecutivoDia = consecutivoInicial,
                        FechaRegistro = DateTime.Now,
                        Clave_Rastreo = item.Clave_Rastreo,
                        Concepto_Pago = item.Concepto_Pago,
                        Cuenta_Beneficiario = item.Cuenta_Benificiario,
                        Email_Benificiario = item.Email_Beneficiario,
                        Empresa = item.Empresa,
                        Institucion_Contraparte = item.Institucion_Contraparte,
                        Institucion_Operante = item.Institucion_Operante,
                        Monto = item.Monto,
                        Nombre_Beneficiario = item.Nombre_Beneficiario,
                        Referencia_Numerica = item.Referencia_Numerica,
                        Rfc_Curp_Beneficiario = item.Rfc_Curp_Benificiario,
                        Tipo_Cuenta_Beneficiario = item.Tipo_Cuenta_Beneficiario,
                        Tipo_Pago = item.Tipo_Pago

                    };
                    consecutivoInicial += 1;
                    await ConexionBD.database.InsertAsync(detalleDisp);

                    var bMov = new Movimientos()
                    {
                        //PENDIENTE DEFINIR CUENTAS DE DISPERSIÓN
                    };

                    var creditoUpdate = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoID = @0", item.creditoID).SingleOrDefaultAsync();
                    creditoUpdate.DispersionID = archivoDis.ArchivoDispersionID;
                    await ConexionBD.database.UpdateAsync(creditoUpdate);

                }

                ConexionBD.database.CompleteTransaction();
                return Ok(consecutivoInicial);

            }
            catch (Exception err)
            {
                ConexionBD.database.AbortTransaction();
                return BadRequest(err.Message);
            }
        }
        [HttpPut]
        [Route("actualizartiempoDA")]
        [Code.TProteccionProducto]
        public async Task<IActionResult> actualizartiempoDA(ConfiaWebApi.PeticionesRest.SOMA.Dispersiones.UPDTiempoAD parData)
        {

            var tiempo = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Catalogos.VariablesGlobales>("WHERE Id=54", parData).SingleOrDefaultAsync();
            try
            {
                if (tiempo != null)
                {
                    tiempo.varValue = parData.varValue;
                    ConexionBD.database.BeginTransaction();
                    await ConexionBD.database.UpdateAsync(tiempo);
                    ConexionBD.database.CompleteTransaction();
                }
                return Ok(tiempo);
            }

            catch (Exception ex)
            {
                ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}