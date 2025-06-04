

using System.Collections.Generic;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using Chilkat;
using ConfiaWebApi.PeticionesRest.Reestructura.HDR;
using ConfiaWebApi.PeticionesRest.Distribuidores.ValerasCabecera;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Reestructura;
using Microsoft.Extensions.Configuration;
using ConfiaWebApi.Code;
using System.IO;
using System.Net.Http;
using System.Net.Http.Headers;
using ConfiaWebApi.PeticionesRest.Prospeccion.Documentos;
using Newtonsoft.Json;
using ConfiaWebApi.PeticionesRest.Catalogos.Sexos;
using ConfiaWebApi.PeticionesRest.SOMA.ArqueosDesembolso;
using DBContext.DBConfia.General;

using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using Microsoft.AspNetCore.Hosting;
using ConfiaWebApi.ModlesSP.Creditos;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Kernel.Geom;
using iText.Layout.Element;
using System.IO;
using iText.IO.Image;
using iText.Layout.Properties;
using iText.Kernel.Pdf.Canvas.Draw;
using iText.Layout.Borders;
using iText.Kernel.Colors;
using ConfiaWebApi.Code;
using System.Globalization;
using Path = System.IO.Path;
using DBContext.DBConfia.Catalogos;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Seguridad;
using DBContext.DBConfia.Bancos;
using Movimientos_VW = DBContext.DBConfia.Catalogos.Movimientos_VW;
using BMovimientos_VW = DBContext.DBConfia.Bancos.Movimientos_VW;
using System.Collections;

namespace ConfiaWebApi.Controllers

{
    [ApiController]
    [Route("api/Reestructura/[controller]")]
    public class SHDRController : ControllerBase
    {
        private DBConfiaContext DBContext;
        //DEFINCION DE ARCHVIOS DE CONFIGURACION
        private IConfiguration Configuracion;
        public SHDRController(IConfiguration _Configuration, DBConfiaContext _DBContext)
        {

            this.Configuracion = _Configuration;
            DBContext = _DBContext;
        }

        [HttpGet]
        [Route("comprobarSolicitud/{distribuidorID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> comprobarSolicitud(int distribuidorID)
        {
            try
            {
                var res = await DBContext.database.QueryAsync<SolicitudReestructurasConvenios>("WHERE DistribuidorID = @0 AND Estatus = 'P' AND Completado = 0", distribuidorID).FirstOrDefaultAsync();
                await DBContext.Destroy();
                if (res == null)
                {
                    var obj = new
                    {
                        Accion = -1
                    };
                    return Ok(obj);
                }

                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("GenerarSolicitud")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> obtenerPlazoSimulacion2(ConfiaWebApi.PeticionesRest.Reestructura.HDR.Solicitud parData)
        {
            try
            {
                var usuarioActualEmail = Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

                int ProductoID = 9999;
                int.TryParse(Request.Headers["ProductoID"], out ProductoID);

                // var solicitudID = await DBContext.database.QueryAsync<SolicitudReestructurasConvenios>("WHERE DistribuidorID = @0 AND Estatus = 'P'", parData.DistribuidorID).FirstOrDefaultAsync();
                // if (solicitudID != null)
                // {
                //     await DBContext.Destroy();
                //     return BadRequest("Ya existe una solicitud pendiente para este distribuidor");
                // }

                var HerramientaID = 0;
                //Guardar el tipo de herramientaID de la tabal tiposHerramientaRescate dependiendo de la accion
                if (parData.accion == 1)
                {
                    var consulta = await DBContext.database.QueryAsync<TiposHerramientaRescate>("WHERE Clave= 'ConvSal'").FirstOrDefaultAsync();
                    HerramientaID = consulta.TipoHerramientaID;
                }
                if (parData.accion == 2)
                {
                    var consulta = await DBContext.database.QueryAsync<TiposHerramientaRescate>("WHERE Clave= 'Res'").FirstOrDefaultAsync();
                    HerramientaID = consulta.TipoHerramientaID;
                }
                if (parData.accion == 3)
                {
                    var consulta = await DBContext.database.QueryAsync<TiposHerramientaRescate>("WHERE Clave= 'ResSal'").FirstOrDefaultAsync();
                    HerramientaID = consulta.TipoHerramientaID;
                }
                if (parData.accion == 4)
                {
                    var consulta = await DBContext.database.QueryAsync<TiposHerramientaRescate>("WHERE Clave= 'ResCF'").FirstOrDefaultAsync();
                    HerramientaID = consulta.TipoHerramientaID;

                    parData.SaldoActual = parData.CreditosIDs.Sum(x => x.SaldoActual);

                }

                var obj = new SolicitudReestructurasConvenios()
                {
                    SaldoAtrasado = parData.SaldoAtrasado,
                    SaldoActual = parData.SaldoActual,
                    QuitaID = parData.QuitaID,
                    MontoIntencion = parData.MontoIntencion,
                    PlazoID = parData.PlazoID,
                    Motivo = parData.Motivo == null ? "N/A" : parData.Motivo,
                    ProductoID = ProductoID,
                    DistribuidorID = parData.DistribuidorID,
                    FechaRegistro = DateTime.Now,
                    UsuarioID = UsuarioActual.UsuarioID,
                    PersonaRegistraID = (long)UsuarioActual.PersonaID,
                    Accion = parData.accion,
                    TipoReestructura = parData.TipoReestructura ?? null,
                    Estatus = "P",
                    Completado = parData.accion == 4 ? true : false,
                    TipoHerramientaID = HerramientaID,
                    DNI = parData.DNI
                };
                await DBContext.database.InsertAsync(obj);

                var solicitud = await DBContext.database.QueryAsync<SolicitudReestructurasConvenios>("WHERE SolicitudRCID = @0", obj.SolicitudRCID).SingleOrDefaultAsync();

                if (parData.accion == 4)
                {
                    foreach (var item in parData.CreditosIDs)
                    {
                        var credito = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoID=@0", item.CreditoID).FirstOrDefaultAsync();

                        var insert = new ClientesFinales()
                        {
                            SolicitudID = obj.SolicitudRCID,
                            ClienteID = credito.ClienteID,
                            CreditoID = credito.CreditoID,
                            SaldoActual = credito.SaldoActual,
                            PersonaRegistraID = UsuarioActual.PersonaID,
                            UsuarioRegistraID = UsuarioActual.UsuarioID,
                            FechaRegistra = DateTime.Now
                        };
                        await DBContext.database.InsertAsync(insert);
                    }
                }

                await DBContext.Destroy();
                return Ok(solicitud);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetDocsSolicitud/{SolicitudRCID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> getDocsSolicitud(int SolicitudRCID)
        {
            try
            {

                int ProductoID = 9999;
                int.TryParse(Request.Headers["ProductoID"], out ProductoID);

                var res = await DBContext.database.QueryAsync<SolicitudDocumentosiCRS_VW>("WHERE ProductoID = @0 AND SolicitudRCID = @1 ", ProductoID, SolicitudRCID).ToArrayAsync();
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
        [Route("GetDocs")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> getDocs()
        {
            try
            {
                int ProductoID = 9999;
                int.TryParse(Request.Headers["ProductoID"], out ProductoID);
                var res = await DBContext.database.QueryAsync<Documentos_VW>("WHERE ProductoID = @0", ProductoID).ToArrayAsync();
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
        [Route("subirArchivo")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> subirArchivo([FromForm] ConfiaWebApi.PeticionesRest.Reestructura.HDR.UploadFile parData)
        {
            try
            {

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var DocValida = new Documentos();
                DocValida = await DBContext.database.QueryAsync<Documentos>("WHERE DocumentoID = @0", parData.DocumentoID).FirstOrDefaultAsync();

                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                var basicToken = Convert.ToBase64String(plainTextBytes);
                // CONCATENAR CON VARIABLE GLOBAL DE BASE DE DATOS
                string path = $"{Configuracion["BucketApi:AwsPath_ReestructuraDocumento"]}/{parData.DistribuidorID}";
                var ext = Path.GetExtension(parData.file.FileName);
                string file_name = $"{parData.Accion}_{parData.NombreDocumento}_{parData.TipoDocumentoID}{ext}";
                byte[] file_byte = FilesManager.ConvertFiletoByteArray(parData.file);

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
                            var Documento = new Documentos()
                            {
                                DistribuidorID = parData.DistribuidorID,
                                // TipoPersonaID = Int16.Parse(parData.TipoPersonaID),
                                TipoDocumentoID = parData.TipoDocumentoID,
                                Ruta = $"{path}/{file_name}",
                                Autorizado = true,
                                Status = "ACTIVO",
                                SolicitudRCID = parData.SolicitudRCID
                            };
                            await DBContext.database.InsertAsync<Documentos>(Documento);
                            DocumentoIDAux = Documento.DocumentoID;
                        }
                        else
                        {
                            DBContext.database.BeginTransaction();


                            var Documento = DocValida;
                            Documento.DistribuidorID = parData.DistribuidorID;
                            Documento.TipoDocumentoID = parData.TipoDocumentoID;
                            Documento.Ruta = $"{path}/{file_name}";
                            Documento.Status = "ACTIVO";
                            Documento.Autorizado = true;
                            Documento.SolicitudRCID = parData.SolicitudRCID;
                            await DBContext.database.UpdateAsync(Documento);
                            DocumentoIDAux = Documento.DocumentoID;
                            DBContext.database.CompleteTransaction();
                        }
                    }
                    else
                    {
                        await DBContext.Destroy();
                        return BadRequest(response.StatusCode);
                    }
                }
                var res = new
                {
                    // Clave = parData.Clave,
                    // Descripcion = parData.Descripcion,
                    DocumentoID = DocumentoIDAux,
                    NombreDocumento = parData.NombreDocumento,
                    // Orden = parDat a.Orden,
                    Distribuidor = parData.DistribuidorID,
                    Ruta = $"{path}/{file_name}",
                    TipoDocumentoID = parData.TipoDocumentoID,
                    // TipoPersonaID = parData.TipoPersonaID,
                    Autorizado = true,
                };
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }


        [HttpGet]
        [Route("GetDocID/{DocumentoID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> getDocID(int DocumentoID)
        {
            try
            {
                var src = "";
                var Documento = await DBContext.database.SingleByIdAsync<Documentos>(DocumentoID);

                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                var basicToken = Convert.ToBase64String(plainTextBytes);
                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicToken);
                    var response = await client.GetAsync($"{Configuracion["BucketApi:url"]}{Configuracion["BucketApi:getRequest"]}?path={Documento.Ruta}");
                    if (response.IsSuccessStatusCode)
                    {
                        var jsonString = await response.Content.ReadAsStringAsync();
                        var request = JsonConvert.DeserializeObject<BucketGet>(jsonString);
                        src = request.url;
                    }
                    else
                    {
                        return BadRequest(response.StatusCode);
                    }
                    var res = new
                    {
                        Ruta = src
                    };
                    await DBContext.Destroy();
                    return Ok(res);
                }
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("CompletarSolicitud")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> CompletarSolicitud(ConfiaWebApi.PeticionesRest.Reestructura.HDR.Solicitud parData)
        {
            try
            {


                int ProductoID = 9999;
                int.TryParse(Request.Headers["ProductoID"], out ProductoID);
                var DocumentosProducto = await DBContext.database.QueryAsync<Documentos_VW>("WHERE ProductoID = @0", ProductoID).ToArrayAsync();
                //TRAER SOLO LOS DOCUMENTOS QUE SON OBLIGATORIOS
                var DocumentosObligatorios = DocumentosProducto.Where(x => x.Opcional == false).ToArray();

                var DocumentosSocia = await DBContext.database.QueryAsync<SolicitudDocumentosiCRS_VW>("WHERE ProductoID = @0 AND SolicitudRCID = @1 ", ProductoID, parData.SolicitudRCID).ToArrayAsync();
                //Comprobar si DocumentosSocia contiene en cada fila la ruta de los documentos obligatorios
                foreach (var item in DocumentosObligatorios)
                {
                    var doc = DocumentosSocia.Where(x => x.TipoDocumentoID == item.TipoDocumentoID).FirstOrDefault();
                    if (doc == null)
                    {
                        await DBContext.Destroy();
                        return BadRequest("Falta el documento " + item.NombreDocumento);
                    }
                }


                //Actualizar el campo Completado de la socia
                var Socia = await DBContext.database.QueryAsync<SolicitudReestructurasConvenios>("WHERE DistribuidorID = @0 AND Completado = 0", parData.DistribuidorID).FirstOrDefaultAsync();
                if (Socia == null)
                {
                    await DBContext.Destroy();
                    return BadRequest("No se encontró la solicitud");
                }

                Socia.QuitaID = parData.QuitaID;
                Socia.MontoIntencion = parData.MontoIntencion;
                Socia.PlazoID = parData.PlazoID;
                Socia.TipoReestructura = parData.TipoReestructura;
                Socia.Motivo = parData.Motivo == null ? Socia.Motivo : parData.Motivo;
                Socia.Completado = true;

                await DBContext.database.UpdateAsync(Socia);
                await DBContext.Destroy();
                return Ok(new
                {
                    status = true,
                    data = new { },
                    msg = "Solicitud completada"
                });
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetSolicitudesRC")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> GetSolicitudes()
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                int ProductoID = 9999;
                int.TryParse(Request.Headers["ProductoID"], out ProductoID);
                var PersonaID = (long)UsuarioActual.PersonaID;

                var analista = await DBContext.database.QueryAsync<Analista>("WHERE PersonaID = @0", PersonaID).FirstOrDefaultAsync();

                var tipoanalista = await DBContext.database.SingleByIdAsync<TipoAnalista>(analista.TipoAnalistaID);

                if (tipoanalista.Clave == "DIR")
                {

                    var res = await DBContext.database.QueryAsync<SolicitudReestructurasConvenios_VW>("WHERE Completado = 1 AND ProductoID = @0 AND PersonaID = @1 AND Estatus in ('X','A') ORDER BY FechaRegistro ASC ", ProductoID, PersonaID).ToArrayAsync();

                    await DBContext.Destroy();
                    return Ok(res);
                }
                if (tipoanalista.Clave == "ANL")
                {
                    var res = await DBContext.database.QueryAsync<SolicitudReestructurasConvenios_VW>("WHERE Completado = 1 AND ProductoID = @0 AND PersonaID = @1 AND Estatus in ('V','C','A') ORDER BY FechaRegistro ASC ", ProductoID, PersonaID).ToArrayAsync();

                    await DBContext.Destroy();
                    return Ok(res);
                }
                if (tipoanalista.Clave == "AEC")
                {
                    var res = await DBContext.database.QueryAsync<SolicitudReestructurasConvenios_VW>("WHERE Completado = 1 AND ProductoID = @0 AND PersonaID = @1 AND Estatus in ('V','C','A') AND ValidoAnalista = 1 ORDER BY FechaRegistro ASC ", ProductoID, PersonaID).ToArrayAsync();

                    await DBContext.Destroy();
                    return Ok(res);
                }

                await DBContext.Destroy();
                return Ok();


            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("GetSolicitudesConvenioCartera")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> GetSolicitudesConvenioCartera(ConfiaWebApi.PeticionesRest.Reestructura.HDR.FiltroConveniosReestructurasCartera parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                parData.UsuarioID = UsuarioActual.UsuarioID;
                int ProductoID = 9999;
                int.TryParse(Request.Headers["ProductoID"], out ProductoID);
                parData.ProductoID = ProductoID;
                var res = await DBContext.database.QueryAsync<SolicitudReestructurasConvenios_VW>(@"SELECT sp.* 
                    FROM Reestructura.SolicitudReestructurasConvenios_VW sp
                    JOIN Creditos.GruposDetalle gd ON sp.DistribuidorID = gd.DistribuidorID
                    JOIN Creditos.GruposUsuarios gu ON gd.GrupoID = gu.GrupoID
                    AND gu.UsuarioID = @UsuarioID
                    WHERE sp.FechaRegistro BETWEEN @FechaInicio AND @FechaFin
                    AND sp.Completado = 1 AND ProductoID = @ProductoID 
                    AND sp.Estatus in ('V','C','A') ORDER BY sp.FechaRegistro ASC", parData).ToArrayAsync();

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
        [Route("GetTipoAnalista")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> GetTipoAnalista()
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                int ProductoID = 9999;
                int.TryParse(Request.Headers["ProductoID"], out ProductoID);
                var PersonaID = (long)UsuarioActual.PersonaID;

                var analista = await DBContext.database.QueryAsync<Analista>("WHERE PersonaID = @0", PersonaID).FirstOrDefaultAsync();

                var tipoanalista = await DBContext.database.SingleByIdAsync<TipoAnalista>(analista.TipoAnalistaID);

                await DBContext.Destroy();
                return Ok(tipoanalista);


            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetAnalistas")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> GetAnalistas()
        {
            try
            {
                int ProductoID = 9999;
                int.TryParse(Request.Headers["ProductoID"], out ProductoID);

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var res = await DBContext.database.QueryAsync<Personas>("SELECT p.PersonaID , p.NombreCompleto FROM Reestructura.Analista a INNER JOIN General.Personas p ON a.PersonaID = p.PersonaID WHERE p.PersonaID = @0", UsuarioActual.PersonaID).ToArrayAsync();

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
        [Route("AprobarSolicitud")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> AprobarSolicitud(ConfiaWebApi.PeticionesRest.Reestructura.HDR.AddHDR parData)
        {
            try
            {


                int ProductoID = 9999;
                int.TryParse(Request.Headers["ProductoID"], out ProductoID);

                var Socia = await DBContext.database.QueryAsync<SolicitudReestructurasConvenios>("WHERE DistribuidorID = @0 AND Completado = 1", parData.DistribuidorID).ToArrayAsync();
                if (Socia.Length == 0)
                {
                    await DBContext.Destroy();
                    return BadRequest("No se encontró la solicitud");
                }
                Socia[0].Estatus = "A";
                await DBContext.database.UpdateAsync(Socia[0]);
                await DBContext.Destroy();
                return Ok(new
                {
                    status = true,
                    data = new { },
                    msg = "Solicitud aprobada"
                });
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("cancelarSolicitud")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> cancelarSolicitud(ConfiaWebApi.PeticionesRest.Reestructura.HDR.Cancelacion parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                int ProductoID = 9999;
                int.TryParse(Request.Headers["ProductoID"], out ProductoID);
                var solicitud = await DBContext.database.QueryAsync<SolicitudReestructurasConvenios>("WHERE SolicitudRCID = @0", parData.SolicitudRCID).FirstOrDefaultAsync();
                if (solicitud == null)
                {
                    await DBContext.Destroy();
                    return BadRequest("No se encontró la solicitud");
                }
                solicitud.FechaCancelacion = DateTime.Now;
                solicitud.ComentariosCancelacion = parData.ComentariosCancelacion;
                solicitud.Estatus = "C";
                solicitud.PersonaCancelaID = (long)UsuarioActual.PersonaID;
                await DBContext.database.UpdateAsync(solicitud);
                //Consultar la vista 
                var solicitudVista = await DBContext.database.QueryAsync<SolicitudReestructurasConvenios_VW>("WHERE Completado = 1 AND ProductoID = @0", ProductoID).ToArrayAsync();
                await DBContext.Destroy();

                return Ok(solicitudVista);

                ;
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("GetSucursales")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> GetSolicitudesAprobadas()
        {
            try
            {

                int ProductoID = 9999;
                int.TryParse(Request.Headers["ProductoID"], out ProductoID);

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();



                var res = await DBContext.database.QueryAsync<AnalistaSucursales_VW>("WHERE ProductoID = @0 AND PersonaID = @1", ProductoID, UsuarioActual.PersonaID).ToArrayAsync();
                //     await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("VerNotas")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> VerNotas(ConfiaWebApi.PeticionesRest.Reestructura.HDR.Notas parData)
        {
            try
            {
                var res = await DBContext.database.QueryAsync<NotasRapidas_VW>("").ToArrayAsync();
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
        [Route("ResCF")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ResCF(ConfiaWebApi.PeticionesRest.Reestructura.HDR.GetResCF parData)
        {
            try
            {
                var res2 = await DBContext.database.QueryAsync<SolicitudReestructurasConvenios>("WHERE SolicitudRCID = @SolicitudRCID", parData).FirstOrDefaultAsync();

                var clientes = await DBContext.database.FetchAsync<DBContext.DBConfia.Reestructura.ClientesFinales>("WHERE SolicitudID = @0", res2.SolicitudRCID);

                var plazos = await DBContext.database.QueryAsync<DBContext.DBConfia.Reestructura.Plazos>("WHERE PlazoID = @0", res2.PlazoID).FirstOrDefaultAsync();

                ArrayList res = new();

                foreach (var client in clientes)
                {
                    var nombrecliente = await DBContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE PersonaID = @0", client.ClienteID).FirstOrDefaultAsync();

                    var nombresolicita = await DBContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE PersonaID = @0", client.PersonaRegistraID).FirstOrDefaultAsync();

                    res.Add(new
                    {
                        CreditoID = client.CreditoID,
                        Cliente = nombrecliente.NombreCompleto,
                        ClienteID = client.ClienteID,
                        SaldoActual = client.SaldoActual,
                        PlazosSolicita = plazos.Quincenas,
                        PersonaSolicita = nombresolicita.NombreCompleto,
                        FechaSolicita = client.FechaRegistra
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

        [HttpPost]
        [Route("ValidarSolicitud")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ValidarSolicitud(ConfiaWebApi.PeticionesRest.Reestructura.HDR.GetResCF parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var solicitiud = await DBContext.database.QueryAsync<SolicitudReestructurasConvenios>("WHERE SolicitudRCID = @SolicitudRCID", parData).FirstOrDefaultAsync();

                solicitiud.ValidoAnalista = true;
                solicitiud.FechaValidaAnalista = DateTime.Now;
                solicitiud.AnalistaValidaID = (long)UsuarioActual.PersonaID;

                await DBContext.database.UpdateAsync(solicitiud);

                await DBContext.Destroy();
                return Ok();
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

    }

}