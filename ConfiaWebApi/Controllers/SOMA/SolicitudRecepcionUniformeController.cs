using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;

using DBContext.DBConfia;
using DBContext.DBConfia.Compras;
using DBContext.DBConfia.Seguridad;

using System.Net.Http;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Diagnostics;
using System.Globalization;
using ConfiaWebApi.Code;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using ConfiaWebApi.PeticionesRest.Prospeccion.Documentos;
using System.Net;

namespace ConfiaWebApi.Controllers.Sistema
{
    [ApiController]
    [Route("api/SOMA/[controller]")]

    public class SolicitudRecepcionUniformeController : ControllerBase
    {
        // TODO::
        // Validar funcion de eliminar cuenta... ??, valido, util ?
        // Segundo, se pueden eliminar las bovedas ??, se pueden actualizar hasta que nivel? (Nombre y Clave o solo nombre?)

        /// <summary>
        /// Conexion a base de datos
        /// </summary>
        private DBConfiaContext ConexionBD;
        private IConfiguration Configuracion;
        /// <summary>
        /// Constructor del controlador
        /// </summary>
        /// <param name="_DBContext">Conexión de datos para el controlador</param>
        public SolicitudRecepcionUniformeController(IConfiguration _Configuration, DBConfiaContext _DBContext)
        {
            this.Configuracion = _Configuration;
            ConexionBD = _DBContext;
        }


        // Obtenemos los balances
        [HttpGet]
        [Route("obtenerSolicitudes")]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Obtener()
        {
            try
            {
                ArrayList solsDetalle = new();
                var obj = new object();
                var Recepcionvw = await ConexionBD.database.FetchAsync<Recepcion_VW>();
                if (Recepcionvw != null)
                {
                    foreach (var item in Recepcionvw)
                    {
                        var resultado = await ConexionBD.database.QueryAsync<Producto>("WHERE ProductoUniformeID=@0", item.ProductoID).SingleOrDefaultAsync();

                        var existencia = 0;
                        if (resultado != null)
                        {
                            existencia = resultado.Existencia;
                        }
                        else
                        {
                            existencia = 0;

                        }

                        solsDetalle.Add(new
                        {
                            RecepcionID = item.RecepcionID,
                            SolicitudID = item.SolicitudID,
                            SurteID = item.SurteID,
                            NombreSurte = item.NombreSurte,
                            RecibeID = item.RecibeID,
                            NombreRecibe = item.NombreRecibe,
                            CancelaID = item.CancelaID,
                            NombreCancela = item.NombreCancela,
                            DevuelveID = item.DevuelveID,
                            NombreDevolucion = item.NombreDevolucion,
                            FechaSurtido = item.FechaSurtido,
                            FechaRecepcion = item.FechaRecepcion,
                            FechaCancelacion = item.FechaCancelacion,
                            FechaDevolucion = item.FechaDevolucion,
                            EstatusID = item.EstatusID,
                            EstatusDes = item.EstatusDes,
                            Descripcion = item.Descripcion,
                            Cancelada = item.Cancelada,
                            RecepcionParcial = item.RecepcionParcial,
                            Devolucion = item.Devolucion,
                            OrdenID = item.OrdenID,
                            ReOrdenID = item.ReOrdenID,
                            SurtidoID = item.SurtidoID,
                            DevolucionID = item.DevolucionID,
                            ComprobanteDoc = item.ComprobanteDoc,
                            DocumentoID = item.DocumentoID,
                            ComprobanteFirma = item.ComprobanteFirma,
                            FirmaDocID = item.FirmaDocID,
                            ProductoID = item.ProductoID,
                            EmpresaId = item.EmpresaId,
                            Pendientes = item.Pendientes,
                            InventarioPieza = existencia,
                            DetalleRecepcion = (await ConexionBD.database.QueryAsync<RecepcionDetalle_VW>("WHERE RecepcionID=@0", item.RecepcionID).ToArrayAsync())
                        });
                    }
                }
                await ConexionBD.Destroy();
                return Ok(solsDetalle);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("getDoc")]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetDoc(ConfiaWebApi.PeticionesRest.SOMA.SolicitudRecepcionUniforme.GetDoc parData)
        {
            var transaccion = false;

            try
            {
                var src = "";
                var srcBC = "";
                var Documento = await ConexionBD.database.QueryAsync<DocumentosUniformes>("WHERE RecepcionID=@0 AND Firmado IS NULL", parData.RecepcionID).SingleOrDefaultAsync();

                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                var basicToken = Convert.ToBase64String(plainTextBytes);
                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicToken); ;
                    var response = await client.GetAsync($"{Configuracion["BucketApi:url"]}{Configuracion["BucketApi:getRequest"]}?expireIn=10&path={Documento.Ruta}");
                    if (response.IsSuccessStatusCode)
                    {
                        var jsonString = await response.Content.ReadAsStringAsync();
                        var request = JsonConvert.DeserializeObject<BucketGet>(jsonString);
                        src = request.url;

                        srcBC = request.url;

                        WebClient MyWebClient = new WebClient();
                        MyWebClient.Credentials = new NetworkCredential(Configuracion["userFtpConfia"], Configuracion["passFtpConfia"]);
                        byte[] BytesFile = MyWebClient.DownloadData(srcBC);
                        string srcB64 = Convert.ToBase64String(BytesFile, 0, BytesFile.Length);
                        ConexionBD.database.BeginTransaction();
                        transaccion = true;
                        var res = new
                        {
                            res = 2,
                            msj = $"Consulta correcta del documento {parData.DocumentoID}",
                            src = $"{srcB64}"
                        };

                        ConexionBD.database.CompleteTransaction();
                        await ConexionBD.Destroy();
                        return Ok(res);
                    }
                    else
                    {
                        if (transaccion) ; ConexionBD.database.AbortTransaction();
                        await ConexionBD.Destroy();
                        return BadRequest(response.StatusCode);
                    }
                }

            }
            catch (Exception ex)
            {
                if (transaccion) ; ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest("ERROR AL GUARDAR LOS DATOS: " + ex.Message);
            }

        }

        [Consumes("multipart/form-data")]
        [HttpPost]
        [Route("subirEvidencia")]
        [Code.TProteccionProducto]
        public async Task<IActionResult> SubirExpediente([FromForm] ConfiaWebApi.PeticionesRest.SOMA.SolicitudRecepcionUniforme.UploadFile parData)

        {
            var transaccion = false;
            try
            {

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                var basicToken = Convert.ToBase64String(plainTextBytes);
                string path = Configuracion["BucketApi:AwsPath_DocsUniforme"];
                string file_name = $"RD{parData.RecepcionID}_{DateTime.Now.ToString("dd_MM_yyyy")}.pdf";
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
                            var Documento = new DocumentosUniformes()
                            {
                                RecepcionID = parData.RecepcionID,
                                Ruta = $"{path}/{file_name}",
                                Autorizado = true,
                            };
                            await ConexionBD.database.InsertAsync<DocumentosUniformes>(Documento);
                            DocumentoIDAux = Documento.DocumentoID;
                        }
                        else
                        {
                            var Documento = await ConexionBD.database.SingleByIdAsync<DocumentosUniformes>(parData.DocumentoID);
                            Documento.Ruta = $"{path}/{file_name}";
                            Documento.Autorizado = true;
                            await ConexionBD.database.UpdateAsync(Documento);
                            DocumentoIDAux = Documento.DocumentoID;
                        }
                    }
                    else
                    {
                        return BadRequest(response.StatusCode);
                    }
                }
                var resSolici = await ConexionBD.database.QueryAsync<Recepcion>("WHERE RecepcionID=@0", parData.RecepcionID).SingleOrDefaultAsync();
                resSolici.ComprobanteDoc = $"{path}/{file_name}";
                resSolici.DocumentoID = ((int)DocumentoIDAux);

                ConexionBD.database.BeginTransaction();
                transaccion = true;

                await ConexionBD.database.UpdateAsync(resSolici);

                ConexionBD.database.CompleteTransaction();
                await ConexionBD.Destroy();

                return Ok(resSolici);
            }
            catch (Exception ex)
            {
                if (transaccion) ; ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [Consumes("multipart/form-data")]
        [HttpPost]
        [Route("subirFirma")]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetFirma([FromForm] ConfiaWebApi.PeticionesRest.SOMA.SolicitudRecepcionUniforme.UploadFiles parData)
        {
            var transaccion = false;
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                var basicToken = Convert.ToBase64String(plainTextBytes);
                string path = Configuracion["BucketApi:AwsPath_DocsUniforme"];
                string file_name = $"RF{parData.RecepcionID}_{DateTime.Now.ToString("dd_MM_yyyy")}.png";
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
                            var Documento = new DocumentosUniformes()
                            {
                                RecepcionID = parData.RecepcionID,
                                Ruta = $"{path}/{file_name}",
                                Autorizado = true,
                                Firmado = true
                            };
                            await ConexionBD.database.InsertAsync<DocumentosUniformes>(Documento);
                            DocumentoIDAux = Documento.DocumentoID;
                        }
                        else
                        {
                            var Documento = await ConexionBD.database.SingleByIdAsync<DocumentosUniformes>(parData.DocumentoID);
                            Documento.Ruta = $"{path}/{file_name}";
                            Documento.Autorizado = true;
                            await ConexionBD.database.UpdateAsync(Documento);
                            DocumentoIDAux = Documento.DocumentoID;
                        }
                    }
                    else
                    {
                        return BadRequest(response.StatusCode);
                    }
                }
                var resSolici = await ConexionBD.database.QueryAsync<Recepcion>("WHERE RecepcionID=@0", parData.RecepcionID).SingleOrDefaultAsync();
                resSolici.ComprobanteFirma = $"{path}/{file_name}";
                resSolici.FirmaDocID = ((int)DocumentoIDAux);

                ConexionBD.database.BeginTransaction();
                transaccion = true;

                await ConexionBD.database.UpdateAsync(resSolici);

                ConexionBD.database.CompleteTransaction();
                await ConexionBD.Destroy();

                return Ok(resSolici);
            }
            catch (Exception ex)
            {
                if (transaccion) ; ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("getFirma")]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetFirma(ConfiaWebApi.PeticionesRest.SOMA.SolicitudRecepcionUniforme.GetFirma parData)
        {
            var transaccion = false;

            try
            {

                var src = "";
                var srcBC = "";
                var Documento = await ConexionBD.database.QueryAsync<DocumentosUniformes>("WHERE Firmado = 1 AND RecepcionID=@0", parData.RecepcionID).SingleOrDefaultAsync();

                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                var basicToken = Convert.ToBase64String(plainTextBytes);
                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicToken); ;
                    var response = await client.GetAsync($"{Configuracion["BucketApi:url"]}{Configuracion["BucketApi:getRequest"]}?expireIn=10&path={Documento.Ruta}");
                    if (response.IsSuccessStatusCode)
                    {
                        var jsonString = await response.Content.ReadAsStringAsync();
                        var request = JsonConvert.DeserializeObject<BucketGet>(jsonString);
                        src = request.url;

                        srcBC = request.url;

                        WebClient MyWebClient = new WebClient();
                        MyWebClient.Credentials = new NetworkCredential(Configuracion["userFtpConfia"], Configuracion["passFtpConfia"]);
                        byte[] BytesFile = MyWebClient.DownloadData(srcBC);
                        string srcB64 = Convert.ToBase64String(BytesFile, 0, BytesFile.Length);
                        ConexionBD.database.BeginTransaction();
                        transaccion = true;
                        var res = new
                        {
                            res = 2,
                            msj = $"Consulta correcta del documento {parData.FirmaDocID}",
                            src = $"{srcBC}"
                        };

                        ConexionBD.database.CompleteTransaction();
                        await ConexionBD.Destroy();
                        return Ok(res);
                    }
                    else
                    {
                        if (transaccion) ; ConexionBD.database.AbortTransaction();
                        await ConexionBD.Destroy();
                        return BadRequest(response.StatusCode);
                    }
                }

            }
            catch (Exception ex)
            {
                if (transaccion) ; ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest("ERROR AL GUARDAR LOS DATOS: " + ex.Message);
            }

        }
        [HttpPost]
        [Route("actualizar")]
        [Code.TProteccionProducto]
        public async Task<IActionResult> actualizar(ConfiaWebApi.PeticionesRest.SOMA.SolicitudRecepcionUniforme.Agregar parData)
        {
            var usuarioActualEmail = Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();
            try
            {
                ConexionBD.database.BeginTransaction();

                var recepcionCabecero = await ConexionBD.database.SingleByIdAsync<Recepcion>(parData.RecepcionID);
                if (recepcionCabecero != null)
                {
                    recepcionCabecero.FechaRecepcion = DateTime.Now;
                    recepcionCabecero.RecibeID = UsuarioActual.UsuarioID;

                    foreach (var item in parData.DetalleRecepcion)
                    {
                        var piezasPendientes = false;
                        var registroInvUniformes = new DBContext.DBConfia.Compras.InventarioUniformes()
                        {
                            TipoMov = "SAL",
                            FechaCaptura = DateTime.Now,
                            NumeroPiezas = item.PiezasRecepcionadas * -1,
                            ProductoUniformeID = item.ProductoUniformeID,
                            PersonaID = (long)UsuarioActual.PersonaID
                        };

                        var recepcionDetalleInd = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Compras.RecepcionDetalle>("WHERE RecepcionID=@0 AND ProductoUniformeID=@1", parData.RecepcionID, item.ProductoUniformeID).SingleOrDefaultAsync();
                        recepcionDetalleInd.PiezasRecepcionadas = item.PiezasRecepcionadas;

                        if (item.PiezasRecepcionadas < item.PiezasSurtidas)
                        {
                            recepcionDetalleInd.PiezasPendientes = item.PiezasSurtidas - item.PiezasRecepcionadas;
                            piezasPendientes = true;
                        }
                        else
                        {
                            recepcionDetalleInd.PiezasPendientes = 0;
                        }
                        recepcionCabecero.EstatusID = piezasPendientes ? 9 : 13;
                        await ConexionBD.database.InsertAsync(registroInvUniformes);
                        await ConexionBD.database.UpdateAsync(recepcionDetalleInd);
                    }

                    var Recepdetalle = await ConexionBD.database.QueryAsync<RecepcionDetalle>("WHERE RecepcionID =  @0", parData.RecepcionID).ToArrayAsync();

                    if (Recepdetalle != null)
                    {
                        var sumaPiezas = 0;
                        foreach (var item in Recepdetalle)
                        {
                            if (item.PiezasPendientes > 1) sumaPiezas += item.PiezasPendientes;
                        }
                        var resultProductoID = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Compras.Solicitud>(recepcionCabecero.SolicitudID);
                        if (recepcionCabecero.EstatusID == 9)
                        {
                            var Solicitud = new DBContext.DBConfia.Compras.Solicitud()
                            {
                                SolicitanteID = UsuarioActual.UsuarioID,
                                FechaSolicitud = DateTime.Now,
                                EstatusID = 1,
                                Piezas = sumaPiezas,
                                Descripcion = "GENERADA AUTOMATICAMENTE POR SISTEMA, ORDEN ANTERIOR N° " + recepcionCabecero.OrdenID,
                                ProductoID = resultProductoID.ProductoID,
                                ReOrdenID = recepcionCabecero.SolicitudID
                            };
                            await ConexionBD.database.InsertAsync(Solicitud);

                            var Aprobacion = new DBContext.DBConfia.Compras.Aprobacion()
                            {
                                SolicitudID = Solicitud.SolicitudID,
                                SolicitanteID = UsuarioActual.UsuarioID,
                                FechaSolicitud = DateTime.Now,
                                EstatusID = 1,
                                Descripcion = "GENERADA AUTOMATICAMENTE POR SISTEMA, ORDEN ANTERIOR N° " + recepcionCabecero.OrdenID,
                                ProductoID = resultProductoID.ProductoID,
                            };
                            await ConexionBD.database.InsertAsync(Aprobacion);

                            foreach (var item in Recepdetalle)
                            {
                                if (item.PiezasPendientes > 0)
                                {
                                    var solDetallePendiente = new DBContext.DBConfia.Compras.SolicitudDetalle()
                                    {
                                        SolicitudID = Solicitud.SolicitudID,
                                        ProductoUniformeID = item.ProductoUniformeID,
                                        PiezasSolicitadas = item.PiezasPendientes,
                                        PiezasAprobadas = 0,
                                        PiezasRecepcionadas = 0,
                                    };
                                    await ConexionBD.database.InsertAsync(solDetallePendiente);

                                    var aprodetallePen = new DBContext.DBConfia.Compras.AprobacionDetalle()
                                    {
                                        AprobadoID = Aprobacion.AprobadoID,
                                        SolicitudDetalleID = solDetallePendiente.SolicitudDetalleID,
                                        ProductoUniformeID = solDetallePendiente.ProductoUniformeID,
                                        PiezasSolicitadas = solDetallePendiente.PiezasSolicitadas,
                                        PiezasAprobadas = solDetallePendiente.PiezasSolicitadas,
                                    };
                                    await ConexionBD.database.InsertAsync(aprodetallePen);
                                }
                            }
                        };
                    }

                    var ActualizaSolicitud = await ConexionBD.database.SingleByIdAsync<Solicitud>(recepcionCabecero.SolicitudID);
                    if (recepcionCabecero.EstatusID == 13)
                    {
                        ActualizaSolicitud.EstatusID = 13;
                        await ConexionBD.database.UpdateAsync(ActualizaSolicitud);
                    }
                    var ActualizaSolicitud2 = await ConexionBD.database.SingleByIdAsync<Solicitud>(recepcionCabecero.SolicitudID);
                    if (recepcionCabecero.EstatusID == 9)
                    {
                        ActualizaSolicitud2.EstatusID = 9;
                        await ConexionBD.database.UpdateAsync(ActualizaSolicitud2);
                    }
                    var ActualizaAprobacion = await ConexionBD.database.SingleByIdAsync<Aprobacion>(recepcionCabecero.SolicitudID);
                    if (recepcionCabecero.EstatusID == 13)
                    {
                        ActualizaAprobacion.EstatusID = 13;
                        await ConexionBD.database.UpdateAsync(ActualizaAprobacion);
                    }
                    var ActualizaAprobacion2 = await ConexionBD.database.SingleByIdAsync<Aprobacion>(recepcionCabecero.SolicitudID);
                    if (recepcionCabecero.EstatusID == 9)
                    {
                        ActualizaAprobacion2.EstatusID = 9;
                        await ConexionBD.database.UpdateAsync(ActualizaAprobacion2);
                    }
                    var ActualizaOrden = await ConexionBD.database.SingleByIdAsync<Orden>(recepcionCabecero.SolicitudID);
                    if (recepcionCabecero.EstatusID == 9)
                    {
                        ActualizaOrden.EstatusID = 9;
                        await ConexionBD.database.UpdateAsync(ActualizaOrden);
                    }
                    var ActualizaOrden2 = await ConexionBD.database.SingleByIdAsync<Orden>(recepcionCabecero.SolicitudID);
                    if (recepcionCabecero.EstatusID == 13)
                    {
                        ActualizaOrden2.EstatusID = 13;
                        await ConexionBD.database.UpdateAsync(ActualizaOrden2);
                    }
                    var ActualizaSurtido = await ConexionBD.database.SingleByIdAsync<Surtido>(recepcionCabecero.SurtidoID);
                    if (recepcionCabecero.EstatusID == 13)
                    {
                        ActualizaSurtido.EstatusID = 13;
                        await ConexionBD.database.UpdateAsync(ActualizaSurtido);
                    }
                    var ActualizaSurtido2 = await ConexionBD.database.SingleByIdAsync<Surtido>(recepcionCabecero.SurtidoID);
                    if (recepcionCabecero.EstatusID == 9)
                    {
                        ActualizaSurtido2.EstatusID = 9;
                        await ConexionBD.database.UpdateAsync(ActualizaSurtido2);
                    }
                    await ConexionBD.database.UpdateAsync(recepcionCabecero);
                }
                else
                {
                    ConexionBD.database.AbortTransaction();
                    return BadRequest("No se encontro la recepcion");
                }
                ConexionBD.database.CompleteTransaction();
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
    }
}


