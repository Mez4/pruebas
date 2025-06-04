using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;

using DBContext.DBConfia;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Seguridad;


using System.Net.Http;
using System.Collections.Generic;
using System.Collections;
using DBContext.DBConfia.Tesoreria;
using System.IO;
using System.Diagnostics;
using ConfiaWebApi.Code;
using System.Globalization;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using ConfiaWebApi.PeticionesRest.Prospeccion.Documentos;
using ConfiaWebApi.PeticionesRest.SOMA.Cajas;

namespace ConfiaWebApi.Controllers.Sistema
{
    [Authorize]
    [ApiController]
    [Route("api/SOMA/[controller]")]
    public class RubrosGastosController : ControllerBase
    {
        // TODO::

        /// <summary>
        /// Clase para procesar los modelos
        /// </summary>
        private class clsProducto
        {
            public int ProductoID { get; set; }
            public clsModulo[] Modulos { get; set; }
        }

        /// <summary>
        /// Clase para procesar los modelos
        /// </summary>
        private class clsModulo
        {
            public int ModuloID { get; set; }
            public clsRol[] Roles { get; set; }
        }

        /// <summary>
        /// Clase para procesar los roles
        /// </summary>
        private class clsRol
        {
            public int ModuloID { get; set; }
            public int RolID { get; set; }
            public clsPermiso[] Permisos { get; set; }
        }

        /// <summary>
        /// Clase para procesar los permisos
        /// </summary>
        private class clsPermiso
        {
            public int ModuloID { get; set; }
            public int RolID { get; set; }
            public int PermisoID { get; set; }
        }


        /// <summary>
        /// Conexion a base de datos
        /// </summary>
        private DBConfiaContext DBContext;

        private IConfiguration Configuracion;

        /// <summary>
        /// Constructor del controlador
        /// </summary>
        /// <param name="_DBContext">Conexión de datos para el controlador</param>
        public RubrosGastosController(IConfiguration _Configuration, DBConfiaContext _DBContext)
        {
            this.Configuracion = _Configuration;
            DBContext = _DBContext;
        }


        [HttpGet]
        [Route("listaEvidencias/{SolicitudDetalleID}/{Cotizacion}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> listaEvidencias(int SolicitudDetalleID, bool Cotizacion)
        {
            try
            {
                var cotizaciones = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.DocumentosGastos>("WHERE SolicitudDetalleID = @0 AND Cotizacion=@1", SolicitudDetalleID, Cotizacion ? 1 : 0);
                await DBContext.Destroy();
                return Ok(cotizaciones);
            }
            catch (Exception ex)
            {
                DBContext.database.AbortTransaction();
                await this.DBContext.Destroy();
                return BadRequest(ex);
            }
        }


        [HttpPut]
        [Route("cancelar-solicitud-v2")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> CancelarSolicitud(ConfiaWebApi.PeticionesRest.SOMA.Rubros.CancelarSolicitud parData)
        {
            try
            {
                DBContext.database.BeginTransaction();
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var _Solicitud = await DBContext.database.QueryAsync<SolicitudesGastos>("WHERE SolicitudGastoID=@0", parData.SolicitudGastoID).SingleOrDefaultAsync();
                var _Estatus = await DBContext.database.QueryAsync<EstatusSolicitudesGastos>("WHERE Estatus = @0", "CANC").SingleOrDefaultAsync();
                var _BancoMov = await DBContext.database.QueryAsync<DBContext.DBConfia.Bancos.Movimientos>("WHERE MovimientoID = @0", _Solicitud.MovimientoID).SingleOrDefaultAsync();

                var _Periodo = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.Periodo2>("WHERE PeriodoID = @0", _BancoMov.PeriodoID).SingleOrDefaultAsync();

                if (_Periodo != null)
                {
                    if (_Periodo.Estatus == "A" && _Periodo.ReAbierto == 0)
                    {
                        if (_BancoMov.Contabilizado == false && _BancoMov.PolizaId == null)
                        {
                            var _BalanceTemp = await DBContext.database.QueryAsync<BalanceTempDetalle>("WHERE MovimientoID = @0", _Solicitud.MovimientoID).SingleOrDefaultAsync();
                            if (_BalanceTemp != null)
                            {
                                var _Balance = await DBContext.database.QueryAsync<DBContext.DBConfia.Balances.Balance2>("WHERE BalanceTempID = @0", _BalanceTemp.BalanceTempID).SingleOrDefaultAsync();

                                if (_Balance != null)
                                {
                                    DBContext.database.CompleteTransaction();
                                    await this.DBContext.Destroy();
                                    return Ok(new { success = false, message = "Ocurrió un problema al cancelar la solicitud. El movimiento se encuentra en un balance y no se puede cancelar." });
                                }
                                else
                                {
                                    _Solicitud.EstatusSolicitudID = _Estatus.EstatusSolicitudID;
                                    _Solicitud.FechaCancelado = DateTime.Now;
                                    _Solicitud.CanceladoID = UsuarioActual.UsuarioID;
                                    await DBContext.database.UpdateAsync(_Solicitud);

                                    _BancoMov.Contabilizado = false;
                                    _BancoMov.CatEstatusMovID = 2;
                                    _BancoMov.FechaCancelacion = DateTime.Now;
                                    _BancoMov.cancelacionUsuario = Convert.ToInt64(UsuarioActual.UsuarioID);
                                    _BancoMov.cancelacionObservacion = "Cancelado por el usuario " + UsuarioActual.Nombre;
                                    await DBContext.database.UpdateAsync(_BancoMov);

                                    DBContext.database.CompleteTransaction();
                                    await this.DBContext.Destroy();
                                    return Ok(new { success = true, message = "La solicitud se canceló correctamente.", data = _Solicitud });
                                }
                            }
                            else
                            {
                                _Solicitud.EstatusSolicitudID = _Estatus.EstatusSolicitudID;
                                _Solicitud.FechaCancelado = DateTime.Now;
                                _Solicitud.CanceladoID = UsuarioActual.UsuarioID;
                                await DBContext.database.UpdateAsync(_Solicitud);

                                _BancoMov.Contabilizado = false;
                                _BancoMov.CatEstatusMovID = 2;
                                _BancoMov.FechaCancelacion = DateTime.Now;
                                _BancoMov.cancelacionUsuario = Convert.ToInt64(UsuarioActual.UsuarioID);
                                _BancoMov.cancelacionObservacion = "Cancelado por el usuario " + UsuarioActual.Nombre;
                                await DBContext.database.UpdateAsync(_BancoMov);

                                DBContext.database.CompleteTransaction();
                                await this.DBContext.Destroy();
                                return Ok(new { success = true, message = "La solicitud se canceló correctamente.", data = _Solicitud });
                            }


                        }
                        else
                        {
                            DBContext.database.CompleteTransaction();
                            await this.DBContext.Destroy();
                            return Ok(new { success = false, message = "Ocurrió un problema al cancelar la solicitud. La solicitud ya fue contabilizada." });
                        }

                    }
                    else
                    {
                        DBContext.database.CompleteTransaction();
                        await this.DBContext.Destroy();
                        return Ok(new { success = false, message = "Ocurrió un problema al cancelar la solicitud. El periodo ya fue cerrado." });
                    }
                }
                else
                {
                    DBContext.database.CompleteTransaction();
                    await this.DBContext.Destroy();
                    return Ok(new { success = false, message = "Ocurrió un problema al cancelar la solicitud. El periodo no existe." });
                }

            }
            catch (Exception ex)
            {
                DBContext.database.AbortTransaction();
                await this.DBContext.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpGet]
        [Route("getSucursales")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> AplicarSolicitud()
        {
            try
            {
                var sucursales = await DBContext.database.FetchAsync<Sucursales_VW>();
                return Ok(sucursales);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpGet]
        [Route("getRubros")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getRubros()
        {
            try
            {
                var Rubros = await DBContext.database.FetchAsync<RubrosGastos>();
                return Ok(Rubros);
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
        [HttpGet]
        [Route("getEstatus")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Estatus()
        {
            try
            {
                var Estatus = await DBContext.database.FetchAsync<EstatusSolicitudesGastos>();
                await DBContext.Destroy();
                return Ok(Estatus);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("aplicar-solicitud")]
        [Authorize]
        public async Task<IActionResult> AplicarSolicitud(ConfiaWebApi.PeticionesRest.SOMA.Rubros.AplicarSolicitud parData)
        {
            try
            {
                //Begin
                DBContext.database.BeginTransaction();
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var soliGasto = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.SolicitudesGastos>("WHERE SolicitudGastoID=@0", parData.SolicitudGastoID).FirstOrDefaultAsync();
                var estatusCan = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.EstatusSolicitudesGastos>("WHERE Estatus=@0", "APLI").FirstOrDefaultAsync();
                var totalAceptado = parData.DetalleSolicitud.Where(x => x.Aceptado == true).Sum(x => x.Total);

                soliGasto.EstatusSolicitudID = estatusCan.EstatusSolicitudID;
                soliGasto.MontoAutorizado = totalAceptado;
                soliGasto.AplicadoID = UsuarioActual.UsuarioID;
                soliGasto.FechaAplicado = DateTime.Now;


                var cajaSec = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CatalogoCajas>("WHERE CajaID=@0", soliGasto.CajaID).SingleOrDefaultAsync();
                var tipoMov = await DBContext.database.QueryAsync<DBContext.DBConfia.Bancos.TiposMovimientos>("WHERE CveMovimientoID='GAST'").SingleOrDefaultAsync();
                var prodCuenta = await DBContext.database.QueryAsync<DBContext.DBConfia.Bancos.CatalogoCuentasBancos>("WHERE CuentaBancoID=@0", soliGasto.CuentaBancoID).SingleOrDefaultAsync();
                var periodoId = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.Periodo2>("WHERE ProductoID=@0 order by FechaApertura desc", prodCuenta.ProductoID).ToArrayAsync();

                var periodo = periodoId.FirstOrDefault();

                var bancoMov = new DBContext.DBConfia.Bancos.Movimientos();
                {
                    bancoMov.CuentaID = soliGasto.CuentaBancoID;
                    bancoMov.SucursalId = cajaSec.SucursalID;
                    bancoMov.FechaAfectacion = DateTime.Now;
                    bancoMov.FechaCaptura = DateTime.Now;
                    bancoMov.Importe = (totalAceptado * tipoMov.Factor);
                    bancoMov.Observaciones = "Gastos de Caja";
                    bancoMov.TipoMovimientoID = tipoMov.Id;
                    bancoMov.ProductoId = prodCuenta.ProductoID;
                    bancoMov.Contabilizado = false;
                    bancoMov.CajaId = cajaSec.CajaID;
                    bancoMov.PeriodoID = periodo.PeriodoID;
                    bancoMov.CatEstatusMovID = 1;
                    bancoMov.UsuarioIDRegistra = UsuarioActual.UsuarioID;
                }
                await DBContext.database.InsertAsync(bancoMov);

                soliGasto.MovimientoID = bancoMov.MovimientoID;

                await DBContext.database.UpdateAsync(soliGasto);


                var item = await DBContext.database.QueryAsync<SolicitudesGastosXCaja_VW>("WHERE SolicitudGastoID=@0", soliGasto.SolicitudGastoID).SingleOrDefaultAsync();
                var res = new
                {
                    SolicitudGastoID = item.SolicitudGastoID,
                    FechaSolicitud = item.FechaSolicitud,
                    FechaAutorizada = item.FechaAutorizada,
                    FechaCancelado = item.FechaCancelado,
                    FechaRechazado = item.FechaRechazado,
                    FechaAplicado = item.FechaAplicado,
                    FechaDocumentosCon = item.FechaDocumentosCon,
                    Estatus = item.Estatus,
                    EstatusClave = item.EstatusClave,
                    Descripcion = item.Descripcion,
                    CajaID = item.CajaID,
                    DocumentosConfirmados = item.DocumentosConfirmados,
                    NombreCaja = item.NombreCaja,
                    NombreSucursal = item.NombreSucursal,
                    CuentaBancoID = item.CuentaBancoID,
                    NumeroCuenta = item.NumeroCuenta,
                    MontoSolicitado = item.MontoSolicitado,
                    MontoAutorizado = item.MontoAutorizado,
                    Solicitante = item.Solicitante,
                    Observaciones = item.Observaciones,
                    ObservacionesTesoreria = item.ObservacionesTesoreria,
                    DetalleSaldos = (await DBContext.database.QueryAsync<GastosXSolicitud_VW>("WHERE SolicitudGastoID=@0", item.SolicitudGastoID).ToArrayAsync())
                };

                DBContext.database.CompleteTransaction();

                await this.DBContext.Destroy();

                return Ok(res);
            }
            catch (Exception ex)
            {
                DBContext.database.AbortTransaction();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("rechazar-solicitud")]
        [Authorize]
        public async Task<IActionResult> RechazarSolicitud(ConfiaWebApi.PeticionesRest.SOMA.Rubros.RechazarSolicitud parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var soliGasto = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.SolicitudesGastos>("WHERE SolicitudGastoID=@0", parData.SolicitudGastoID).FirstOrDefaultAsync();
                var estatusCan = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.EstatusSolicitudesGastos>("WHERE Estatus=@0", "RECH").FirstOrDefaultAsync();

                soliGasto.EstatusSolicitudID = estatusCan.EstatusSolicitudID;
                soliGasto.MontoAutorizado = 0;
                soliGasto.RechazadoID = UsuarioActual.UsuarioID;
                soliGasto.FechaRechazado = DateTime.Now;
                await DBContext.database.UpdateAsync(soliGasto);

                foreach (var it in parData.DetalleSolicitud)
                {
                    var detalle = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.SolicitudGastosDetalle>("WHERE SolicitudDetalleID=@0", it.SolicitudDetalleID).FirstOrDefaultAsync();
                    detalle.Aceptado = false;
                    await DBContext.database.UpdateAsync(detalle);
                }

                var item = await DBContext.database.QueryAsync<SolicitudesGastosXCaja_VW>("WHERE SolicitudGastoID=@0", soliGasto.SolicitudGastoID).SingleOrDefaultAsync();
                var res = new
                {
                    SolicitudGastoID = item.SolicitudGastoID,
                    FechaSolicitud = item.FechaSolicitud,
                    FechaAutorizada = item.FechaAutorizada,
                    FechaCancelado = item.FechaCancelado,
                    FechaRechazado = item.FechaRechazado,
                    FechaAplicado = item.FechaAplicado,
                    FechaDocumentosCon = item.FechaDocumentosCon,
                    Estatus = item.Estatus,
                    EstatusClave = item.EstatusClave,
                    Descripcion = item.Descripcion,
                    CajaID = item.CajaID,
                    DocumentosConfirmados = item.DocumentosConfirmados,
                    NombreCaja = item.NombreCaja,
                    NombreSucursal = item.NombreSucursal,
                    CuentaBancoID = item.CuentaBancoID,
                    NumeroCuenta = item.NumeroCuenta,
                    MontoSolicitado = item.MontoSolicitado,
                    MontoAutorizado = item.MontoAutorizado,
                    Solicitante = item.Solicitante,
                    Observaciones = item.Observaciones,
                    ObservacionesTesoreria = item.ObservacionesTesoreria,
                    DetalleSaldos = (await DBContext.database.QueryAsync<GastosXSolicitud_VW>("WHERE SolicitudGastoID=@0", item.SolicitudGastoID).ToArrayAsync())
                };

                await this.DBContext.Destroy();

                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("getDoc")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetDoc(ConfiaWebApi.PeticionesRest.SOMA.Rubros.GetDoc parData)
        {
            try
            {
                var src = "";
                var Documento = await DBContext.database.SingleByIdAsync<DocumentosGastos>(parData.DocumentoID);

                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                var basicToken = Convert.ToBase64String(plainTextBytes);
                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicToken); ;
                    var response = await client.GetAsync($"{Configuracion["BucketApi:url"]}{Configuracion["BucketApi:getRequest"]}?expireIn=1&path={Documento.Ruta}");
                    if (response.IsSuccessStatusCode)
                    {
                        var jsonString = await response.Content.ReadAsStringAsync();
                        var request = JsonConvert.DeserializeObject<BucketGet>(jsonString);
                        src = request.url;
                    }
                    else
                    {
                        await DBContext.Destroy();
                        return BadRequest(response.StatusCode);
                    }
                }
                var res = new
                {
                    res = 1,
                    msj = $"Consulta correcta del documento {parData.DocumentoID}",
                    src = $"{src}"
                };
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest("ERROR AL GUARDAR LOS DATOS ECONOMICOS DE LA PERSONA: " + ex.Message);
            }

        }
        [HttpPost]
        [Route("getDoc2")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetDoc2(ConfiaWebApi.PeticionesRest.SOMA.Rubros.GetDoc parData)
        {
            try
            {
                var src = "";
                var Documento = await DBContext.database.QueryAsync<DocumentosGastos>("WHERE DocumentoID=@0 AND Cotizacion=0", parData.DocumentoID).SingleOrDefaultAsync();

                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                var basicToken = Convert.ToBase64String(plainTextBytes);
                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicToken); ;
                    var response = await client.GetAsync($"{Configuracion["BucketApi:url"]}{Configuracion["BucketApi:getRequest"]}?expireIn=1&path={Documento.Ruta}");
                    if (response.IsSuccessStatusCode)
                    {
                        var jsonString = await response.Content.ReadAsStringAsync();
                        var request = JsonConvert.DeserializeObject<BucketGet>(jsonString);
                        src = request.url;
                    }
                    else
                    {
                        await DBContext.Destroy();
                        return BadRequest(response.StatusCode);
                    }
                }
                var res = new
                {
                    res = 1,
                    msj = $"Consulta correcta del documento {parData.DocumentoID}",
                    src = $"{src}"
                };
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest("ERROR AL GUARDAR LOS DATOS ECONOMICOS DE LA PERSONA: " + ex.Message);
            }

        }

        [Consumes("multipart/form-data")]
        [HttpPost]
        [Route("subirEvidencia")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> SubirExpediente([FromForm] ConfiaWebApi.PeticionesRest.SOMA.Rubros.UploadFile parData)
        {
            try
            {

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                var basicToken = Convert.ToBase64String(plainTextBytes);
                string path = $"{Configuracion["BucketApi:AwsPath_DocsGastos"]}/S{parData.SolicitudGastoID}SD{parData.SolicitudDetalleID}";
                var ext = Path.GetExtension(parData.doc.FileName);
                string file_name = $"{parData.SolicitudGastoID}_{DateTime.Now.ToString("dd_MM_yyyy_hh_mm_ss") + "_EVD"}{ext}";
                byte[] file_byte = FilesManager.ConvertFiletoByteArray(parData.doc);

                long DocumentoIDAux = 0;

                HttpContent bytesContent = new ByteArrayContent(file_byte);
                HttpContent stringContent = new StringContent(path);

                using (var client = new HttpClient())
                using (var formData = new MultipartFormDataContent())
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicToken); ;
                    formData.Add(stringContent, "path");
                    formData.Add(bytesContent, "file", $"{file_name}");
                    var response = await client.PostAsync($"{Configuracion["BucketApi:url"]}{Configuracion["BucketApi:uploadRequest"]}", formData);
                    if (response.IsSuccessStatusCode)
                    {
                        if (parData.DocumentoID == 0)
                        {
                            var Documento = new DocumentosGastos()
                            {
                                SolicitudGastoID = parData.SolicitudGastoID,
                                SolicitudDetalleID = parData.SolicitudDetalleID,
                                Ruta = $"{path}/{file_name}",
                                Autorizado = true,
                                Cotizacion = false,
                                FechaSubida = DateTime.Now,
                            };
                            await DBContext.database.InsertAsync<DocumentosGastos>(Documento);
                            DocumentoIDAux = Documento.DocumentoID;
                        }
                        else

                        {
                            var Documento = new DocumentosGastos()
                            {
                                SolicitudGastoID = parData.SolicitudGastoID,
                                SolicitudDetalleID = parData.SolicitudDetalleID,
                                Ruta = $"{path}/{file_name}",
                                Autorizado = true,
                                Cotizacion = false,
                                FechaSubida = DateTime.Now,
                            };
                            await DBContext.database.InsertAsync<DocumentosGastos>(Documento);
                            DocumentoIDAux = Documento.DocumentoID;
                        }

                    }
                    else
                    {
                        await DBContext.Destroy();
                        return BadRequest(response.StatusCode);
                    }
                }

                var res = await DBContext.database.QueryAsync<GastosXSolicitud_VW>("WHERE SolicitudDetalleID=@0", parData.SolicitudDetalleID).SingleOrDefaultAsync();
                await DBContext.Destroy();
                return Ok(res);


            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [Consumes("multipart/form-data")]
        [HttpPost]
        [Route("FNSubirEvidenciaCot")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> SubirCotizacion([FromForm] ConfiaWebApi.PeticionesRest.SOMA.Rubros.UploadFile parData)
        {
            try
            {
                var solGasID = await DBContext.database.QueryAsync<GastosXSolicitud_VW>("WHERE SolicitudDetalleID=@0", parData.SolicitudDetalleID).FirstOrDefaultAsync();
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                var basicToken = Convert.ToBase64String(plainTextBytes);
                string path = $"{Configuracion["BucketApi:AwsPath_DocsGastos"]}/S{solGasID.SolicitudGastoID}SD{parData.SolicitudDetalleID}";
                var ext = Path.GetExtension(parData.doc.FileName);
                string file_name = $"{solGasID.SolicitudGastoID}_{DateTime.Now.ToString("dd_MM_yyyy_hh_mm_ss") + "_COT"}{ext}";
                byte[] file_byte = FilesManager.ConvertFiletoByteArray(parData.doc);

                long DocumentoIDAux = 0;

                HttpContent bytesContent = new ByteArrayContent(file_byte);
                HttpContent stringContent = new StringContent(path);

                using (var client = new HttpClient())
                using (var formData = new MultipartFormDataContent())
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicToken); ;
                    formData.Add(stringContent, "path");
                    formData.Add(bytesContent, "file", $"{file_name}");
                    var response = await client.PostAsync($"{Configuracion["BucketApi:url"]}{Configuracion["BucketApi:uploadRequest"]}", formData);
                    if (response.IsSuccessStatusCode)
                    {
                        if (parData.DocumentoID == 0)
                        {
                            var SolicitudGastoID = await DBContext.database.QueryAsync<GastosXSolicitud_VW>("WHERE SolicitudDetalleID = @0", parData.SolicitudDetalleID).FirstOrDefaultAsync();
                            var Documento = new DocumentosGastos()
                            {
                                SolicitudGastoID = SolicitudGastoID.SolicitudGastoID,
                                SolicitudDetalleID = parData.SolicitudDetalleID,
                                Ruta = $"{path}/{file_name}",
                                Autorizado = false,
                                Cotizacion = true,
                                FechaSubida = DateTime.Now,

                            };
                            await DBContext.database.InsertAsync<DocumentosGastos>(Documento);
                            return Ok();
                        }
                        else
                        {
                            await DBContext.Destroy();
                            return BadRequest(response.StatusCode);
                        }
                    }

                }
                return Ok();

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("rubros")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerRubros()
        {
            try
            {
                var rubros = await DBContext.database.FetchAsync<RubrosGastos_VW>();
                await this.DBContext.Destroy();
                return Ok(rubros);
            }
            catch (Exception ex)
            {
                await this.DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("rubros")]
        [Authorize]
        public async Task<IActionResult> GuardarRubro(ConfiaWebApi.PeticionesRest.SOMA.Rubros.GuardarRubro pardata)
        {
            try
            {
                DBContext.database.BeginTransaction();
                var usuarioActualEmail = Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

                var nuevoRubro = new RubrosGastos()
                {
                    Activo = pardata.Activo,
                    AfectaUtilidad = pardata.AfectaUtilidad,
                    Cargo = pardata.Cargo,
                    Clave = pardata.Clave,
                    Descripcion = pardata.Descripcion,
                    RegistraID = UsuarioActual.UsuarioID,
                    //Factor = pardata.Factor,
                    GastoCorporativo = pardata.GastoCorporativo,
                };
                await DBContext.database.InsertAsync(nuevoRubro);

                var rubroGuardado = await DBContext.database.QueryAsync<RubrosGastos_VW>("WHERE RubroGastosID=@0", nuevoRubro.RubroGastosID).SingleOrDefaultAsync();
                DBContext.database.CompleteTransaction();
                await this.DBContext.Destroy();
                return Ok(rubroGuardado);
            }
            catch (Exception ex)
            {
                DBContext.database.AbortTransaction();
                await this.DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("confirmar-documentos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ConfirmarDocumentos(ConfiaWebApi.PeticionesRest.SOMA.Rubros.ConfirmarDocumentos pardata)
        {
            try
            {
                DBContext.database.BeginTransaction();
                var usuarioActualEmail = Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

                var solicitudGasto = await DBContext.database.SingleByIdAsync<SolicitudesGastos>(pardata.SolicitudGastoID);

                if (solicitudGasto == null)
                {
                    DBContext.database.AbortTransaction();
                    await this.DBContext.Destroy();
                    return BadRequest("No se encontro la solicitud de gasto");
                }
                else
                {
                    var estatusClave = await DBContext.database.QueryAsync<EstatusSolicitudesGastos>("Where Estatus=@0", "DOCS").SingleOrDefaultAsync();
                    if (estatusClave == null)
                    {
                        DBContext.database.AbortTransaction();
                        await this.DBContext.Destroy();
                        return BadRequest("No se encontro el estatus de documentos");
                    }
                    else
                    {
                        solicitudGasto.EstatusSolicitudID = estatusClave.EstatusSolicitudID;
                        solicitudGasto.DocumentosConfirmados = true;
                        solicitudGasto.FechaDocumentosCon = DateTime.Now;
                        await DBContext.database.UpdateAsync(solicitudGasto);
                    }
                    var item = await DBContext.database.QueryAsync<SolicitudesGastosXCaja_VW>("WHERE SolicitudGastoID=@0", pardata.SolicitudGastoID).SingleOrDefaultAsync();
                    //Crear arreglo
                    //Object res = new();

                    var res = new
                    {
                        SolicitudGastoID = item.SolicitudGastoID,
                        FechaSolicitud = item.FechaSolicitud,
                        FechaAutorizada = item.FechaAutorizada,
                        FechaCancelado = item.FechaCancelado,
                        FechaRechazado = item.FechaRechazado,
                        FechaAplicado = item.FechaAplicado,
                        FechaDocumentosCon = item.FechaDocumentosCon,
                        Estatus = item.Estatus,
                        EstatusClave = item.EstatusClave,
                        Descripcion = item.Descripcion,
                        CajaID = item.CajaID,
                        DocumentosConfirmados = item.DocumentosConfirmados,
                        NombreCaja = item.NombreCaja,
                        NombreSucursal = item.NombreSucursal,
                        CuentaBancoID = item.CuentaBancoID,
                        NumeroCuenta = item.NumeroCuenta,
                        MontoSolicitado = item.MontoSolicitado,
                        MontoAutorizado = item.MontoAutorizado,
                        Solicitante = item.Solicitante,
                        Observaciones = item.Observaciones,
                        ObservacionesTesoreria = item.ObservacionesTesoreria,
                        DetalleSaldos = (await DBContext.database.QueryAsync<GastosXSolicitud_VW>("WHERE SolicitudGastoID=@0", item.SolicitudGastoID).ToArrayAsync())
                    };

                    DBContext.database.CompleteTransaction();
                    await this.DBContext.Destroy();
                    return Ok(res);

                }

            }
            catch (Exception ex)
            {
                DBContext.database.AbortTransaction();
                await this.DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpPut]
        [Route("rubros")]
        [Authorize]
        public async Task<IActionResult> ActualizarRubro(ConfiaWebApi.PeticionesRest.SOMA.Rubros.ActualizarRubro pardata)
        {
            try
            {
                DBContext.database.BeginTransaction();
                var usuarioActualEmail = Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

                var rubroActualizado = await DBContext.database.QueryAsync<RubrosGastos>("WHERE RubroGastosID=@0", pardata.RubroGastosID).SingleOrDefaultAsync();

                if (rubroActualizado == null)
                {
                    DBContext.database.AbortTransaction();
                    await this.DBContext.Destroy();
                    return BadRequest("El rubro no existe");
                }
                else
                {
                    rubroActualizado.Activo = pardata.Activo;
                    rubroActualizado.AfectaUtilidad = pardata.AfectaUtilidad;
                    rubroActualizado.Cargo = pardata.Cargo;
                    rubroActualizado.Clave = pardata.Clave;
                    rubroActualizado.Descripcion = pardata.Descripcion;
                    rubroActualizado.RegistraID = UsuarioActual.UsuarioID;
                    //rubroActualizado.Factor = pardata.Factor;
                    rubroActualizado.GastoCorporativo = pardata.GastoCorporativo;
                    await DBContext.database.UpdateAsync(rubroActualizado);
                    var rubroUpt = await DBContext.database.QueryAsync<RubrosGastos_VW>("WHERE RubroGastosID=@0", pardata.RubroGastosID).SingleOrDefaultAsync();
                    DBContext.database.CompleteTransaction();
                    await this.DBContext.Destroy();
                    return Ok(rubroUpt);
                }

            }
            catch (Exception ex)
            {
                DBContext.database.AbortTransaction();
                await this.DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
        [HttpPost]
        [Route("solicitud-gastos-v2")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> OtenerSolsCaja(ConfiaWebApi.PeticionesRest.SOMA.Rubros.SolicitudesCaja pardata)
        {
            try
            {

                DBContext.database.BeginTransaction();
                var st = await DBContext.database.ExecuteAsync("SET DATEFORMAT 'YMD'");
                var solicitudes = await DBContext.database.FetchAsync<SolicitudesGastosXCaja_VW>("WHERE SucursalCajaID=@0 AND FechaSolicitud BETWEEN cast(@1 as date) AND DATEADD(s,-1,DATEADD(d,1,@2))AND (EstatusClave=@3 OR @3='')", pardata.SucursalCajaID, pardata.FechaInicial, pardata.FechaFinal, pardata.EstatusClave);
                //Crear arreglo
                ArrayList res = new();
                foreach (var item in solicitudes)
                {
                    res.Add(new
                    {
                        SolicitudGastoID = item.SolicitudGastoID,
                        FechaSolicitud = item.FechaSolicitud,
                        FechaAutorizada = item.FechaAutorizada,
                        FechaCancelado = item.FechaCancelado,
                        FechaRechazado = item.FechaRechazado,
                        FechaAplicado = item.FechaAplicado,
                        FechaDocumentosCon = item.FechaDocumentosCon,
                        Estatus = item.Estatus,
                        EstatusClave = item.EstatusClave,
                        Descripcion = item.Descripcion,
                        CajaID = item.CajaID,
                        ObservacionesTesoreria = item.ObservacionesTesoreria,
                        DocumentosConfirmados = item.DocumentosConfirmados,
                        NombreCaja = item.NombreCaja,
                        NombreSucursal = item.NombreSucursal,
                        CuentaBancoID = item.CuentaBancoID,
                        NumeroCuenta = item.NumeroCuenta,
                        MontoSolicitado = item.MontoSolicitado,
                        MontoAutorizado = item.MontoAutorizado,
                        Solicitante = item.Solicitante,
                        Observaciones = item.Observaciones,
                        DetalleSaldos = (await DBContext.database.QueryAsync<GastosXSolicitud_VW>("WHERE SolicitudGastoID=@0", item.SolicitudGastoID).ToArrayAsync())
                    });

                }
                DBContext.database.CompleteTransaction();
                await this.DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                DBContext.database.AbortTransaction();
                await this.DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        [Route("solicitud-gastos/{CajaID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerSolicitudes(int CajaID)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                if (CajaID == 0)
                {
                    var solicitudes = await DBContext.database.FetchAsync<SolicitudesGastosXCaja_VW>();
                    //Crear arreglo
                    ArrayList res = new();
                    foreach (var item in solicitudes)
                    {
                        res.Add(new
                        {
                            SolicitudGastoID = item.SolicitudGastoID,
                            FechaSolicitud = item.FechaSolicitud,
                            FechaAutorizada = item.FechaAutorizada,
                            FechaCancelado = item.FechaCancelado,
                            FechaRechazado = item.FechaRechazado,
                            FechaAplicado = item.FechaAplicado,
                            FechaDocumentosCon = item.FechaDocumentosCon,
                            Estatus = item.Estatus,
                            EstatusClave = item.EstatusClave,
                            Descripcion = item.Descripcion,
                            CajaID = item.CajaID,
                            ObservacionesTesoreria = item.ObservacionesTesoreria,
                            DocumentosConfirmados = item.DocumentosConfirmados,
                            NombreCaja = item.NombreCaja,
                            NombreSucursal = item.NombreSucursal,
                            CuentaBancoID = item.CuentaBancoID,
                            NumeroCuenta = item.NumeroCuenta,
                            MontoSolicitado = item.MontoSolicitado,
                            MontoAutorizado = item.MontoAutorizado,
                            Solicitante = item.Solicitante,
                            Observaciones = item.Observaciones,
                            DetalleSaldos = (await DBContext.database.QueryAsync<GastosXSolicitud_VW>("WHERE SolicitudGastoID=@0", item.SolicitudGastoID).ToArrayAsync())
                        });

                    }
                    await this.DBContext.Destroy();
                    return Ok(res);
                }
                else
                {
                    var solicitudes = await DBContext.database.QueryAsync<SolicitudesGastosXCaja_VW>("WHERE SolicitanteID=@0", UsuarioActual.UsuarioID).ToArrayAsync();
                    //Crear arreglo
                    ArrayList res = new();
                    foreach (var item in solicitudes)
                    {
                        res.Add(new
                        {
                            SolicitudGastoID = item.SolicitudGastoID,
                            FechaSolicitud = item.FechaSolicitud,
                            FechaAutorizada = item.FechaAutorizada,
                            FechaCancelado = item.FechaCancelado,
                            FechaRechazado = item.FechaRechazado,
                            FechaAplicado = item.FechaAplicado,
                            FechaDocumentosCon = item.FechaDocumentosCon,
                            Estatus = item.Estatus,
                            EstatusClave = item.EstatusClave,
                            Descripcion = item.Descripcion,
                            CajaID = item.CajaID,
                            DocumentosConfirmados = item.DocumentosConfirmados,
                            ObservacionesTesoreria = item.ObservacionesTesoreria,
                            NombreCaja = item.NombreCaja,
                            NombreSucursal = item.NombreSucursal,
                            CuentaBancoID = item.CuentaBancoID,
                            NumeroCuenta = item.NumeroCuenta,
                            MontoSolicitado = item.MontoSolicitado,
                            MontoAutorizado = item.MontoAutorizado,
                            Solicitante = item.Solicitante,
                            Observaciones = item.Observaciones,
                            DetalleSaldos = (await DBContext.database.QueryAsync<GastosXSolicitud_VW>("WHERE SolicitudGastoID=@0", item.SolicitudGastoID).ToArrayAsync())
                        });

                    }
                    await this.DBContext.Destroy();
                    return Ok(res);
                }

            }
            catch (Exception ex)
            {
                await this.DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
        [HttpGet]
        [Route("obtenerMovimientos2")]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Obtener2()
        {
            try
            {
                var Mov = await DBContext.database.FetchAsync<GastosXSolicitud_VW>();
                await DBContext.Destroy();
                return Ok(Mov);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("obtenerMovimientos")]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Obtener()
        {
            try
            {
                ArrayList solsDetalle = new();
                var obj = new object();
                var GastosxSoli_VW = await DBContext.database.FetchAsync<GastosXSolicitud_VW>();
                if (GastosxSoli_VW != null)
                {
                    foreach (var item in GastosxSoli_VW)
                    {
                        solsDetalle.Add(new
                        {
                            Clave = item.Clave,
                            Descripcion = item.Descripcion,
                            SolicitudDetalleID = item.SolicitudDetalleID,
                            SolicitudGastoID = item.SolicitudGastoID,
                            RubroGastosID = item.RubroGastosID,
                            Total = item.Total,
                            Revisado = item.Revisado,
                            Aceptado = item.Aceptado,
                        }
                        );
                    }
                }
                await DBContext.Destroy();
                return Ok(solsDetalle);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("autorizar-solicitud-gastos")]
        [Authorize]
        public async Task<IActionResult> DetalleSolicitudGastos(ConfiaWebApi.PeticionesRest.SOMA.Rubros.AutorizarSolicitud pardata)
        {
            try
            {
                //Begin
                DBContext.database.BeginTransaction();
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                decimal TotalAutoriza = 0;
                foreach (var item in pardata.DetalleSolicitud)
                {
                    var solicitudDetalle = await DBContext.database.QueryAsync<SolicitudGastosDetalle>("WHERE SolicitudDetalleID=@0 ", item.SolicitudDetalleID).FirstOrDefaultAsync();
                    solicitudDetalle.Revisado = true;
                    solicitudDetalle.Aceptado = item.Aceptado;

                    if (item.Aceptado)
                    {
                        TotalAutoriza += solicitudDetalle.Total;
                    }

                    await DBContext.database.UpdateAsync(solicitudDetalle);
                }
                //Suma de los rubros aceptados
                var solEst = await DBContext.database.QueryAsync<EstatusSolicitudesGastos>("WHERE Estatus=@0", "AUTZ").FirstOrDefaultAsync();

                var solicitudGasto = await DBContext.database.QueryAsync<SolicitudesGastos>("WHERE SolicitudGastoID=@0", pardata.SolicitudGastoID).FirstOrDefaultAsync();
                solicitudGasto.EstatusSolicitudID = solEst.EstatusSolicitudID;
                solicitudGasto.FechaAutorizada = DateTime.Now;
                solicitudGasto.AutorizadoID = UsuarioActual.UsuarioID;
                solicitudGasto.MontoAutorizado = TotalAutoriza;
                solicitudGasto.ObservacionesTesoreria = pardata.ObservacionesTesoreria;

                await DBContext.database.UpdateAsync(solicitudGasto);
                DBContext.database.CompleteTransaction();

                var sol = await DBContext.database.QueryAsync<SolicitudesGastosXCaja_VW>("WHERE SolicitudGastoID=@0", pardata.SolicitudGastoID).FirstOrDefaultAsync();


                var res = new
                {
                    SolicitudGastoID = sol.SolicitudGastoID,
                    FechaSolicitud = sol.FechaSolicitud,
                    FechaAutorizada = sol.FechaAutorizada,
                    FechaCancelado = sol.FechaCancelado,
                    FechaRechazado = sol.FechaRechazado,
                    FechaAplicado = sol.FechaAplicado,
                    FechaDocumentosCon = sol.FechaDocumentosCon,
                    Estatus = sol.Estatus,
                    EstatusClave = sol.EstatusClave,
                    Descripcion = sol.Descripcion,
                    CajaID = sol.CajaID,
                    ObservacionesTesoreria = sol.ObservacionesTesoreria,
                    DocumentosConfirmados = sol.DocumentosConfirmados,
                    NombreCaja = sol.NombreCaja,
                    NombreSucursal = sol.NombreSucursal,
                    CuentaBancoID = sol.CuentaBancoID,
                    NumeroCuenta = sol.NumeroCuenta,
                    MontoSolicitado = sol.MontoSolicitado,
                    MontoAutorizado = sol.MontoAutorizado,
                    Solicitante = sol.Solicitante,
                    Observaciones = sol.Observaciones,
                    DetalleSaldos = (await DBContext.database.QueryAsync<GastosXSolicitud_VW>("WHERE SolicitudGastoID=@0", sol.SolicitudGastoID).ToArrayAsync())
                };
                await this.DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                DBContext.database.AbortTransaction();
                await this.DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        /* [HttpPost]
        [Route("update")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.SOMA.Rubros.update parData)
        {
            try
            {
                var TotalActualizado = await DBContext.database.SingleByIdAsync<SolicitudesGastos>(parData.SolicitudGastoID);
                TotalActualizado.MontoAutorizado = parData.MontoAutorizado;
                await DBContext.database.UpdateAsync(TotalActualizado);
                await DBContext.Destroy();
                return Ok(TotalActualizado);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        } */
        //Get para obtener CuentasBancariasGastosXSuc_VW
        [HttpGet]
        [Route("obtener-cuentas-bancarias/{CajaID}")]
        [Authorize]
        [Code.TProteccionProducto]

        public async Task<IActionResult> GetCuentasBancarias(int CajaID)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var cuentas = await DBContext.database.QueryAsync<CajaTipoOperacion_VW>("WHERE CajaID=@0 AND CveMovimientoID='GAST' AND PuedeGenGastos=1", CajaID).ToArrayAsync();
                await this.DBContext.Destroy();
                return Ok(cuentas);
            }
            catch (Exception ex)
            {
                await this.DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("sucursales")]
        [Authorize]
        [Code.TProteccionProducto]

        public async Task<IActionResult> GetSucursales()
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var cuentas = await DBContext.database.FetchAsync<Sucursales_VW>();
                await this.DBContext.Destroy();
                return Ok(cuentas);
            }
            catch (Exception ex)
            {
                await this.DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("generar-solicitud-gastos")]
        [Authorize]
        [Code.TProteccionProducto]

        public async Task<IActionResult> GenerarSolicitud(ConfiaWebApi.PeticionesRest.SOMA.Rubros.GenerarSolicitud pardata)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                DBContext.database.BeginTransaction();

                var estatusPend = await DBContext.database.QueryAsync<EstatusSolicitudesGastos>("WHERE Estatus=@0", "PEND").SingleOrDefaultAsync();

                var solicitud = new SolicitudesGastos();
                {
                    solicitud.SolicitanteID = UsuarioActual.UsuarioID;
                    solicitud.EstatusSolicitudID = estatusPend.EstatusSolicitudID;
                    solicitud.Observaciones = pardata.Observaciones;
                    solicitud.CajaID = pardata.CajaID;
                    solicitud.CuentaBancoID = pardata.CuentaBancoID;
                    solicitud.FechaSolicitud = DateTime.Now;
                    solicitud.MontoSolicitado = pardata.MontoSolicitado;
                    solicitud.MontoAutorizado = 0;
                    solicitud.OrigenSucursalID = pardata.OrigenSucursalID;
                    if (pardata.GeneraGastoSucursal)
                    {
                        solicitud.AfectaSucursal = true;
                        solicitud.SucursalID = pardata.SucursalID;
                    }
                    else
                    {
                        solicitud.AfectaSucursal = false;
                        solicitud.SucursalID = null;
                    }

                    if (pardata.Util)
                    {
                        solicitud.Util = true;
                    }
                    else
                    {
                        solicitud.Util = false;
                    }

                };
                await DBContext.database.InsertAsync(solicitud);

                foreach (var item2 in pardata.Rubros)
                {
                    var SolicitudGastosDetalle = new DBContext.DBConfia.Tesoreria.SolicitudGastosDetalle();
                    {
                        SolicitudGastosDetalle.SolicitudGastoID = solicitud.SolicitudGastoID;
                        SolicitudGastosDetalle.RubroGastosID = item2.RubroID;
                        SolicitudGastosDetalle.Total = item2.Total;
                        SolicitudGastosDetalle.Revisado = false;
                        SolicitudGastosDetalle.Aceptado = false;
                    };
                    await DBContext.database.InsertAsync(SolicitudGastosDetalle);
                }

                var item = await DBContext.database.QueryAsync<SolicitudesGastosXCaja_VW>("WHERE SolicitudGastoID=@0", solicitud.SolicitudGastoID).FirstOrDefaultAsync();

                var res = new
                {
                    SolicitudGastoID = item.SolicitudGastoID,
                    FechaSolicitud = item.FechaSolicitud,
                    FechaAutorizada = item.FechaAutorizada,
                    FechaCancelado = item.FechaCancelado,
                    FechaRechazado = item.FechaRechazado,
                    FechaAplicado = item.FechaAplicado,
                    FechaDocumentosCon = item.FechaDocumentosCon,
                    Estatus = item.Estatus,
                    EstatusClave = item.EstatusClave,
                    Descripcion = item.Descripcion,
                    CajaID = item.CajaID,
                    ObservacionesTesoreria = item.ObservacionesTesoreria,
                    DocumentosConfirmados = item.DocumentosConfirmados,
                    NombreCaja = item.NombreCaja,
                    NombreSucursal = item.NombreSucursal,
                    CuentaBancoID = item.CuentaBancoID,
                    NumeroCuenta = item.NumeroCuenta,
                    MontoSolicitado = item.MontoSolicitado,
                    MontoAutorizado = item.MontoAutorizado,
                    Solicitante = item.Solicitante,
                    Observaciones = item.Observaciones,
                    DetalleSaldos = (await DBContext.database.QueryAsync<GastosXSolicitud_VW>("WHERE SolicitudGastoID=@0", item.SolicitudGastoID).ToArrayAsync())
                };

                DBContext.database.CompleteTransaction();
                await this.DBContext.Destroy();

                return Ok(res);
            }
            catch (Exception ex)
            {
                DBContext.database.AbortTransaction();
                await this.DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
        [HttpPut]
        [Route("actualizar")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> actualizar(ConfiaWebApi.PeticionesRest.SOMA.Rubros.UpdateTotal parData)
        {
            var transaccion = false;
            try
            {
                var SolicitudEncontrada = await DBContext.database.QueryAsync<SolicitudGastosDetalle>("WHERE SolicitudDetalleID =@0", parData.SolicitudDetalleID).SingleAsync();

                if (SolicitudEncontrada != null)
                {
                    if (parData.Total != 0)
                    {
                        SolicitudEncontrada.Total = parData.Total;
                        await DBContext.database.UpdateAsync(SolicitudEncontrada);
                    }

                    if (parData.RubroGastosID != 0)
                    {
                        SolicitudEncontrada.RubroGastosID = parData.RubroGastosID;
                        await DBContext.database.UpdateAsync(SolicitudEncontrada);

                    }

                    DBContext.database.CompleteTransaction();
                    await DBContext.Destroy();
                }
                return Ok(SolicitudEncontrada);
            }
            catch (Exception ex)
            {
                if (transaccion) ; DBContext.database.AbortTransaction();
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("actualizarProrrateo")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> actualizarProrrateo(ConfiaWebApi.PeticionesRest.SOMA.Rubros.UpdateProrrateo parData)
        {
            var transaccion = false;
            try
            {
                var SolicitudEncontrada = await DBContext.database.QueryAsync<SolicitudesGastos>("WHERE SolicitudGastoID =@0", parData.SolicitudGastoID).SingleAsync();

                SolicitudEncontrada.Meses = parData.Meses;
                SolicitudEncontrada.ProrratearGasto = true;

                await DBContext.database.UpdateAsync(SolicitudEncontrada);

                return Ok();

            }
            catch (Exception ex)
            {
                if (transaccion) ; DBContext.database.AbortTransaction();
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }

        }


        [HttpPut]
        [Route("actualizarSucursal")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> actualizarSucursal(ConfiaWebApi.PeticionesRest.SOMA.Rubros.UpdateTotal parData)
        {
            var transaccion = false;
            try
            {
                var SolicitudEncontrada = await DBContext.database.QueryAsync<SolicitudesGastos>("WHERE SolicitudGastoID=@0", parData.SolicitudGastoID).SingleAsync();

                if (SolicitudEncontrada != null)
                {

                    SolicitudEncontrada.AfectaSucursal = true;
                    SolicitudEncontrada.SucursalID = parData.SucursalID;
                    await DBContext.database.UpdateAsync(SolicitudEncontrada);
                    DBContext.database.CompleteTransaction();
                    await DBContext.Destroy();
                }
                return Ok(SolicitudEncontrada);
            }
            catch (Exception ex)
            {
                if (transaccion) ; DBContext.database.AbortTransaction();
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("imprimirSolgas")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> imprimirSolgas(ConfiaWebApi.PeticionesRest.SOMA.Rubros.ImprimirSolicitud pardata)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                // var UsuarioActual = await DBContext.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
                // var PersonaActual = await DBContext.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.ID).FirstOrDefaultAsync();
                var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");
                var listado_archivos = new List<string>();
                var Count = 0;
                var headerConDetalle = "";
                var DatosConDetalle = "";
                var FooterDetalle = "";
                decimal TotalDebe = 0;
                decimal TotalHaber = 0;

                var solGas = await DBContext.database.QueryAsync<SolicitudesGastosXCaja_VW>("WHERE SolicitudGastoID=@0", pardata.SolicitudGastoID).FirstOrDefaultAsync();
                // var DetalleSolicitudGastos = await DBContext.database.QueryAsync<GastosXSolicitud_VW>("WHERE SolicitudGastoID=@0", pardata.SolicitudGastoID).ToArrayAsync();
                var DetalleSolicitudGastos = await DBContext.database.QueryAsync<algo>(@"SELECT gxv.*, sg.Observaciones FROM Tesoreria.GastosXSolicitud_VW gxv 
                JOIN Tesoreria.SolicitudesGastos sg ON sg.SolicitudGastoID = gxv.SolicitudGastoID 
                WHERE gxv.SolicitudGastoID =@0", pardata.SolicitudGastoID).ToArrayAsync();
                // NumberFormatInfo nfi = new CultureInfo(CultureInfo.CurrentCulture.ToString(), false).NumberFormat;
                var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "SolicitudGastos", "Caratula.html"));


                headerConDetalle += "<tr>";
                headerConDetalle += "<th class=\"text-center fs-6\">" + "ID" + "</th>";
                headerConDetalle += "<th class=\"text-center fs-6\">" + "Clave" + "</th>";
                headerConDetalle += "<th class=\"text-center fs-6\">" + "Descripción" + "</th>";
                headerConDetalle += "<th class=\"text-center fs-6\">" + "Total" + "</th>";
                headerConDetalle += "<th class=\"text-center fs-6\">" + "Aceptado" + "</th>";
                headerConDetalle += "</tr>";


                foreach (var item in DetalleSolicitudGastos)
                {
                    DatosConDetalle += "<tr>";
                    DatosConDetalle += "<td class=\"text-center fs-6\">" + item.SolicitudDetalleID.ToString() + "</td>";
                    DatosConDetalle += "<td class=\"text-center fs-6\">" + item.Clave + "</td>";
                    // DatosConDetalle += "<td class=\"text-center fs-6\">" + item.Descripcion.ToString() +"</td>";;
                    DatosConDetalle += "<td class=\"text-center fs-6\">" + item.Descripcion.ToString() + " - " + item.Observaciones.ToString() + "</td>";
                    DatosConDetalle += "<td class=\"text-center fs-6\">" + item.Total.ToString("F0") + "</td>";
                    DatosConDetalle += "<td class=\"text-center fs-6\">" + (item.Aceptado ? "Si" : "No") + "</td>";
                    DatosConDetalle += "</tr>";
                    TotalDebe += item.Total;
                }
                FooterDetalle += "<tr>";
                FooterDetalle += "<th class=\"text-center fs-6\"></th>";
                FooterDetalle += "<th class=\"text-center fs-6\"></th>";
                FooterDetalle += "<th class=\"text-center fs-6\"></th>";
                FooterDetalle += "<th class=\"text-center fs-6\">" + "Totales" + "</th>";
                FooterDetalle += "<th class=\"text-center fs-6\">" + TotalDebe.ToString("F0") + "</th>";
                FooterDetalle += "</tr>";

                var usuarioAutoriza = new DBContext.DBConfia.Seguridad.UsuariosVW();
                var usuarioRechaza = new DBContext.DBConfia.Seguridad.UsuariosVW();
                var usuarioCancelado = new DBContext.DBConfia.Seguridad.UsuariosVW();
                var usuarioAplicado = new DBContext.DBConfia.Seguridad.UsuariosVW();

                var accion = 0;
                var estatusSol = solGas.EstatusSolicitudID;

                if (solGas.Estatus == "RECH")
                {
                    usuarioRechaza = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("wHERE UsuarioID=@0", solGas.RechazadoID).FirstOrDefaultAsync();
                    accion = 1;
                }
                else if (solGas.Estatus == "AUTZ")
                {
                    usuarioAutoriza = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE UsuarioID=@0", solGas.AutorizadoID).FirstOrDefaultAsync();
                    accion = 2;
                }
                else if (solGas.Estatus == "APLI")
                {
                    usuarioAplicado = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE UsuarioID=@0", solGas.AplicadoID).FirstOrDefaultAsync();
                    accion = 3;
                }
                else if (solGas.Estatus == "CANC")
                {
                    usuarioCancelado = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE UsuarioID=@0", solGas.CanceladoID).FirstOrDefaultAsync();
                    accion = 4;
                }
                else
                {
                    accion = 5;
                }

                html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                html = html.Replace("@@IMPRIMIO", UsuarioActual.Nombre);
                html = html.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                html = html.Replace("@@INT", pardata.SolicitudGastoID.ToString());
                html = html.Replace("@@CAJA", solGas.NombreCaja.ToString());
                html = html.Replace("@@SUCURSAL", solGas.NombreSucursal.ToString());
                html = html.Replace("@@GASTOAFECTA", solGas.SucursalAfecta == null ? "N/A" : solGas.SucursalAfecta.ToString());
                if (accion == 1)
                {
                    html = html.Replace("@@ESTATUS", solGas.EstatusClave + " - " + usuarioRechaza.NombreCompleto);
                }
                else if (accion == 2)
                {
                    html = html.Replace("@@ESTATUS", solGas.EstatusClave + " - " + usuarioAutoriza.NombreCompleto);
                }
                else if (accion == 3)
                {
                    html = html.Replace("@@ESTATUS", solGas.EstatusClave + " - " + usuarioAplicado.NombreCompleto);
                }
                else if (accion == 4)
                {
                    html = html.Replace("@@ESTATUS", solGas.EstatusClave + " - " + usuarioCancelado.NombreCompleto);
                }
                else
                {
                    html = html.Replace("@@ESTATUS", solGas.EstatusClave);
                }

                html = html.Replace("@@USR_CREA", solGas.Solicitante.ToString());
                html = html.Replace("@@FCH_CREA", solGas.FechaSolicitud.ToString());
                html = html.Replace("@@HEADER_DETALLE", headerConDetalle);
                html = html.Replace("@@DATOS_DETALLE", DatosConDetalle);
                html = html.Replace("@@FOOTER_DETALLE", FooterDetalle);
                html = html.Replace("@@ESTATUS", solGas.EstatusClave.ToString());


                await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")), html);

                listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")));

                /* html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Balances", "Detalle.html"));
                html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);


                await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "2_" + Count.ToString() + ".html")), html);
                listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "2_" + Count.ToString() + ".html")));
        */

                // Ejecutamos el proceso de wkhtmltopdf
                Process p = new()
                {
                    StartInfo = new ProcessStartInfo(PDF.RUTA_WKHTMLTOPDF())
                };
                p.StartInfo.Arguments = string.Concat("-O landscape --encoding utf-8", " ",
                string.Join(" ", listado_archivos), " ",
                Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
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
                await this.DBContext.Destroy();
                return BadRequest(ex.Message);
            }

        }
    }
}
