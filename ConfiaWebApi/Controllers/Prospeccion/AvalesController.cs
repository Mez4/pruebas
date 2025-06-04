using ConfiaWebApi.Code;
using ConfiaWebApi.ModlesSP.Prospeccion;
using ConfiaWebApi.PeticionesRest.Prospeccion.Documentos;
using DBContext.DBConfia;
using DBContext.DBConfia.Prospeccion;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.Prospeccion
{
    [Authorize]
    [ApiController]
    [Route("api/Prospeccion/[controller]")]
    public class AvalesController : ControllerBase
    {
        private DBConfiaContext ConexionBD;

        private IConfiguration Configuracion;

        public AvalesController(IConfiguration _Configuration, DBConfiaContext _DBContext)
        {
            this.Configuracion = _Configuration;
            ConexionBD = _DBContext;
        }

        [HttpPost]
        [Route("getByProspecto")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetByProspecto(ConfiaWebApi.PeticionesRest.Prospeccion.Avales.getByProspecto parData)
        {
            try
            {
                var res = await ConexionBD.database.QueryAsync<Avales_VW>("WHERE ProspectoID = @ProspectoID", parData).ToArrayAsync();
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
        /*titular es PROSPECTO  ProspectosVw*/
        [Route("getByProspectoAval")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getByProspectoAval(ConfiaWebApi.PeticionesRest.Prospeccion.Avales.getByProspecto parData)
        {
            try
            {
                //var logmsj = await ConexionBD.database.QueryAsync<LogMensajesProspectos_VW>("WHERE ProspectoID=@0 AND StatusProcesoID=15", parData.ProspectoID).ToArrayAsync();   
                var avales = await ConexionBD.database.QueryAsync<Avales_VW>("WHERE ProspectoID=@0", parData.ProspectoID).ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(new { avales });


            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }

        }

        [HttpPost]
        [Route("getDocs")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetDocs(ConfiaWebApi.PeticionesRest.Prospeccion.Avales.GetDocs parData)
        {
            var Docs = await ConexionBD.database.QueryAsync<ObtenerDocAval>("EXEC Prospeccion.pa_ObtenerDocsAval @AvalID", parData).ToArrayAsync();
            await ConexionBD.Destroy();
            return Ok(Docs);
        }

        [HttpPost]
        [Route("getDoc")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetDoc(ConfiaWebApi.PeticionesRest.Prospeccion.Avales.GetDoc parData)
        {
            try
            {
                var src = "";
                var Documento = await ConexionBD.database.SingleByIdAsync<DocumentosAval>(parData.DocumentoID);

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
                        return BadRequest(response.StatusCode);
                    }
                }
                var res = new
                {
                    res = 1,
                    msj = $"Consulta correcta del documento {parData.DocumentoID}",
                    src = $"{src}"
                };
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("ERROR AL GUARDAR LOS DATOS ECONOMICOS DE LA PERSONA: " + ex.Message);
            }

        }

        [Consumes("multipart/form-data")]
        [HttpPost]
        [Route("subirExpediente")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> SubirExpediente([FromForm] ConfiaWebApi.PeticionesRest.Prospeccion.Avales.UploadFile parData)
        {
            try
            {

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var DocValida = new DocumentosAval();
                if (parData.DocumentoAvalID > 0)
                {
                    DocValida = await ConexionBD.database.SingleByIdAsync<DocumentosAval>(parData.DocumentoAvalID);
                    if (DocValida.Autorizado == true)
                        return BadRequest("Este Documento ya fue validado por Mesa de Crédito y no puede ser actualizado");
                }

                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                var basicToken = Convert.ToBase64String(plainTextBytes);
                string path = $"{Configuracion["BucketApi:AwsPath_DocsExpediente"]}/{parData.PersonaID}";
                var ext = Path.GetExtension(parData.doc.FileName);
                string file_name = $"{parData.PersonaID}_{parData.TipoDocumentoAvalID}{ext}";
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
                        if (parData.DocumentoAvalID == 0)
                        {
                            var Documento = new DocumentosAval()
                            {
                                PersonaID = Int64.Parse(parData.PersonaID),
                                TipoPersonaID = Int16.Parse(parData.TipoPersonaID),
                                TipoDocumentoAvalID = parData.TipoDocumentoAvalID,
                                Ruta = $"{path}/{file_name}",
                                Status = "ACTIVO"
                            };
                            await ConexionBD.database.InsertAsync<DocumentosAval>(Documento);
                            DocumentoIDAux = Documento.DocumentoAvalID;
                        }
                        else
                        {
                            //var Documento = await ConexionBD.database.SingleByIdAsync<DocumentosAval>(parData.DocumentoAvalID);
                            ConexionBD.database.BeginTransaction();
                            if (DocValida.Autorizado == false)
                            {
                                var avalRel = await ConexionBD.database.QueryAsync<Avales>("WHERE AvalID = @PersonaID", parData).SingleOrDefaultAsync();
                                var ValidacionMesa = await ConexionBD.database.QueryAsync<ValidacionMesa>("WHERE ProspectoID = @ProspectoID", avalRel).SingleOrDefaultAsync();
                                var mensaje = new LogMensajes()
                                {
                                    Mensaje = $"DOCUMENTO CORREGIDO ({parData.NombreDocumento})",
                                    Fecha_hora = DateTime.Now,
                                    ValidacionMesaID = ValidacionMesa.ValidacionMesaID,
                                    PersonaID = (long)UsuarioActual.PersonaID,
                                    UsuarioID = UsuarioActual.UsuarioID,
                                    EnviadoDesdeMesa = false
                                };
                                await ConexionBD.database.InsertAsync<LogMensajes>(mensaje);
                            }

                            var Documento = DocValida;
                            Documento.PersonaID = Int64.Parse(parData.PersonaID);
                            Documento.TipoPersonaID = Int16.Parse(parData.TipoPersonaID);
                            Documento.TipoDocumentoAvalID = parData.TipoDocumentoAvalID;
                            Documento.Ruta = $"{path}/{file_name}";
                            Documento.Status = "ACTIVO";
                            Documento.Autorizado = null;
                            await ConexionBD.database.UpdateAsync(Documento);
                            DocumentoIDAux = Documento.DocumentoAvalID;
                            ConexionBD.database.CompleteTransaction();
                        }
                    }
                    else
                    {
                        await ConexionBD.Destroy();
                        return BadRequest(response.StatusCode);
                    }
                }
                bool? autAux = null;
                var res = new
                {
                    Clave = parData.Clave,
                    Descripcion = parData.Descripcion,
                    DocumentoAvalID = DocumentoIDAux,
                    NombreDocumento = parData.NombreDocumento,
                    Orden = parData.Orden,
                    PersonaID = parData.PersonaID,
                    Ruta = $"{path}/{file_name}",
                    TipoDocumentoAvalID = parData.TipoDocumentoAvalID,
                    TipoPersonaID = parData.TipoPersonaID,
                    Autorizado = autAux
                };
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("GetVerDocumentosAvales")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetDoc(ConfiaWebApi.PeticionesRest.Prospeccion.Avales.GetVerDocumentosAvales parData)
        {
            try
            {
                var src = "";
                var Documento = await ConexionBD.database.QueryAsync<DocumentosNotasAvales>("WHERE  (DocumentoAvalID = @DocumentoAvalID)", parData).LastOrDefaultAsync();
                var tipoDocumento = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Catalogos.TipoDocumento>("SELECT td1.TipoDocumentoID, td1.NombreDocumento, td1.Clave FROM Prospeccion.DocumentosAval d INNER JOIN Prospeccion.TipoDocumentoAval td ON d.TipoDocumentoAvalID = td.TipoDocumentoAvalID INNER JOIN Catalogos.TipoDocumento td1 ON td.CatalogoTipoDocumentoID = td1.TipoDocumentoID WHERE d.DocumentoAvalID = @0", parData.DocumentoAvalID);

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
                        return BadRequest(response.StatusCode);
                    }
                }
                var res = new
                {
                    res = 1,
                    msj = $"Consulta correcta del documento {parData.DocumentoAvalID}",
                    src = $"{src}",
                    Nota = Documento.Observacion,
                    CatalogoTipoDocumentoID = tipoDocumento[0]?.TipoDocumentoID,
                };
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("ERROR AL GUARDAR LOS DATOS ECONOMICOS DE LA PERSONA: " + ex.Message);
            }

        }

        [HttpPost]
        [Route("updateConfirmarDocumentosAvales")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetDocs(ConfiaWebApi.PeticionesRest.Prospeccion.Avales.updateConfirmarDocumentosAvales parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, ProspectoID = parData.ProspectoID, Identificador = parData.Identificador, regresa = parData.regresa, msj = parData.msj };
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.ModlesSP.Prospeccion.Confirmar>("EXEC Prospeccion.pa_TuberiaProceso @Usu, @ProspectoID, @Identificador, @regresa, @msj", obj).FirstOrDefaultAsync();
                await ConexionBD.Destroy();
                if (res.regresa == 1)
                    return Ok(res);
                else
                    return BadRequest(res.msj);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }

        }

        [HttpPost]
        [Route("updateAutorizaDocumetoAval")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetDocs(ConfiaWebApi.PeticionesRest.Prospeccion.Avales.updateAutorizaDocumetoAval parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, DocumentoAvalID = parData.DocumentoAvalID, regresa = parData.regresa, msj = parData.msj };
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.ModlesSP.Prospeccion.spDocumentosAvales>("EXEC Prospeccion.pa_AutorizarDocumentoAval @Usu, @DocumentoAvalID, @regresa, @msj", obj).FirstOrDefaultAsync();

                await ConexionBD.Destroy();
                if (res.regresa == 1)
                    return Ok(res.msj);
                else
                    return BadRequest(res.msj);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("updateRechazaDocumetoAval")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetDocs(ConfiaWebApi.PeticionesRest.Prospeccion.Avales.updateRechazaDocumetoAval parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, DocumentoAvalID = parData.DocumentoAvalID, Nota = parData.Nota, regresa = parData.regresa, msj = parData.msj };
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.ModlesSP.Prospeccion.spDocumentosAvales>("EXEC Prospeccion.pa_RechazarDocumentoAval @Usu, @DocumentoAvalID, @Nota, @regresa, @msj", obj).FirstOrDefaultAsync();

                await ConexionBD.Destroy();
                if (res.regresa == 1)
                    return Ok(res.msj);
                else
                    return BadRequest(res.msj);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("updateValidarDocumentosAval")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetDocs(ConfiaWebApi.PeticionesRest.Prospeccion.Avales.updateValidarDocumentosAval parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, ProspectoID = parData.ProspectoID, regresa = parData.regresa, msj = parData.msj };
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.ModlesSP.Prospeccion.Confirmar>("EXEC Prospeccion.pa_ValidarDocumentosAvales @ProspectoID, @regresa, @msj", obj).FirstOrDefaultAsync();
                await ConexionBD.Destroy();
                if (res.regresa == 1)
                    return Ok(res);
                else
                    return BadRequest(res.msj);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }



        /*--------------------------------------------------------------------VALIDA aval---------------------------------------------*/
        [HttpPost]
        [Route("updateProcesoAval")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> updateProcesoAval(ConfiaWebApi.PeticionesRest.Prospeccion.Avales.updateProcesoAval parData)
        {
            try
            {
                var prospectoValida = await ConexionBD.database.SingleByIdAsync<Prospectos>(parData.ProspectoID);
                if (!prospectoValida.Activo)
                {
                    await ConexionBD.Destroy();
                    return BadRequest("Este prospecto esta cancelado");//throw new Exception("Este prospecto esta cancelado");
                }
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, ProspectoID = parData.ProspectoID, Identificador = parData.Identificador, regresa = parData.regresa, msj = parData.msj };
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.ModlesSP.Prospeccion.Confirmar>("EXEC Prospeccion.pa_TuberiaProceso @Usu, @ProspectoID, @Identificador, @regresa, @msj", obj).FirstOrDefaultAsync();
                await ConexionBD.Destroy();
                if (res.regresa == 1)
                    return Ok(res);
                // return Ok(res.msj);
                else
                    return BadRequest(res.msj);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("updateValidaAval")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> updateValidaAval(ConfiaWebApi.PeticionesRest.Prospeccion.Avales.updateValidaAval parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, AvalID = parData.AvalID, regresa = parData.regresa, msj = parData.msj };
                //HACER SP DE VALIDAR AUTORIZA TITULAR Y SP MODELO
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.ModlesSP.Prospeccion.ValidaAval>("EXEC Prospeccion.pa_ValidaAval @Usu, @AvalID, @regresa, @msj", obj).FirstOrDefaultAsync();
                await ConexionBD.Destroy();
                if (res.regresa == 1)
                    return Ok(res);
                else
                    return BadRequest(res.msj);

            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("updateRechazAval")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> updateRechazAval(ConfiaWebApi.PeticionesRest.Prospeccion.Avales.updateRechazaAval parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, AvalID = parData.AvalID, Nota = parData.Nota, regresa = parData.regresa, msj = parData.msj };
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.ModlesSP.Prospeccion.RechazaAval>("EXEC Prospeccion.pa_RechazaAval @Usu, @AvalID, @Nota, @regresa, @msj", obj).FirstOrDefaultAsync();

                await ConexionBD.Destroy();
                if (res.regresa == 1)
                    return Ok(res);
                else
                    return BadRequest(res.msj);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        ///AVALES----------------------------------------------------------------------------


        [HttpPost]
        [Route("updateVerificaAvales")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> updateVerificaAvales(ConfiaWebApi.PeticionesRest.Prospeccion.Avales.updateVerificaAval parData)
        {
            try
            {

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, ProspectoID = parData.ProspectoID, regresa = parData.regresa, msj = parData.msj };
                //HACER SP DE VALIDAR AUTORIZA TITULAR Y SP MODELO
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.ModlesSP.Prospeccion.Confirmar>("EXEC Prospeccion.pa_VerificarAval @Usu, @ProspectoID, @regresa, @msj", obj).FirstOrDefaultAsync();
                var EstatusProceso = await ConexionBD.database.FirstAsync<DBContext.DBConfia.Prospeccion.Prospectos_VW>("WHERE ProspectoID=@0", parData.ProspectoID);
                var EstatusProceso2 = await ConexionBD.database.FirstAsync<DBContext.DBConfia.Prospeccion.Prospectos>("WHERE ProspectoID=@0", parData.ProspectoID);
                await ConexionBD.Destroy();
                if (res.regresa == 1)
                    try
                    {

                        if (EstatusProceso.VerificaTitular == 1 & EstatusProceso.RevisionRefTitular == 1 & EstatusProceso.RevisionRefAval == 1 & EstatusProceso.VerificaAval == 1)
                        {
                            EstatusProceso2.StatusProcesoID = 22;
                            await ConexionBD.database.UpdateAsync(EstatusProceso2);
                            ConexionBD.database.CompleteTransaction();
                            await ConexionBD.Destroy();
                        }
                        return Ok(res);

                    }
                    catch (Exception ex)
                    {
                        return Ok(res);
                    }

                else
                    return BadRequest(res.msj);

            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("updateRechazarAvales")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> updateRechazarAvales(ConfiaWebApi.PeticionesRest.Prospeccion.Avales.updateRechazarAvales parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, ProspectoID = parData.ProspectoID, Nota = parData.Nota, regresa = parData.regresa, msj = parData.msj };
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.ModlesSP.Prospeccion.Confirmar>("EXEC Prospeccion.pa_RechazarAvales @Usu, @ProspectoID, @Nota, @regresa, @msj", obj).FirstOrDefaultAsync();

                await ConexionBD.Destroy();
                if (res.regresa == 1)
                    return Ok(res);
                else
                    return BadRequest(res.msj);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        /*titular es PROSPECTO  ProspectosVw*/
        [Route("getByAvalReferencias")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getByAvalReferencias(ConfiaWebApi.PeticionesRest.Prospeccion.Avales.getByAvalRefs parData)
        {
            try
            {
                var referencias = await ConexionBD.database.QueryAsync<Referencias>("WHERE PersonaID=@0", parData.AvalID).ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(new { referencias });

            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }

        }

        [HttpPost]
        [Route("updateValidaAvalRef")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> updateValidaAvalRef(ConfiaWebApi.PeticionesRest.Prospeccion.Avales.updateValidaRefAval parData)
        {
            try
            {

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, ReferenciaID = parData.ReferenciaID, regresa = parData.regresa, msj = parData.msj };
                //HACER SP DE VALIDAR AUTORIZA TITULAR Y SP MODELO
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.ModlesSP.Prospeccion.ValidarReferenciasAvales>("EXEC Prospeccion.pa_ValidaReferenciaAval @Usu, @ReferenciaID, @regresa, @msj", obj).FirstOrDefaultAsync();
                await ConexionBD.Destroy();
                if (res.regresa == 1)
                    return Ok(res);
                else
                    return BadRequest(res.msj);

            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("updateRechazRefAval")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> updateRechazRefAval(ConfiaWebApi.PeticionesRest.Prospeccion.Avales.updateRechazaRefAval parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, ReferenciaID = parData.ReferenciaID, Nota = parData.Nota, regresa = parData.regresa, msj = parData.msj };
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.ModlesSP.Prospeccion.RechazaReferenciaAval>("EXEC Prospeccion.pa_RechazarReferenciaAval @Usu, @ReferenciaID, @Nota, @regresa, @msj", obj).FirstOrDefaultAsync();

                await ConexionBD.Destroy();
                if (res.regresa == 1)
                    return Ok(res);
                else
                    return BadRequest(res.msj);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }


        [HttpPost]
        [Route("updateVerificaRefsAvales")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> updateVerificaRefsAvales(ConfiaWebApi.PeticionesRest.Prospeccion.Avales.updateVerificaAval parData)
        {
            try
            {

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, ProspectoID = parData.ProspectoID, regresa = parData.regresa, msj = parData.msj };
                //HACER SP DE VALIDAR AUTORIZA TITULAR Y SP MODELO
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.ModlesSP.Prospeccion.Confirmar>("EXEC Prospeccion.pa_VerificarReferenciasAval @Usu, @ProspectoID, @regresa, @msj", obj).FirstOrDefaultAsync();
                var EstatusProceso = await ConexionBD.database.FirstAsync<DBContext.DBConfia.Prospeccion.Prospectos_VW>("WHERE ProspectoID=@0", parData.ProspectoID);
                var EstatusProceso2 = await ConexionBD.database.FirstAsync<DBContext.DBConfia.Prospeccion.Prospectos>("WHERE ProspectoID=@0", parData.ProspectoID);
                var EstatusActualizado = 22;
                await ConexionBD.Destroy();
                if (res.regresa == 1)
                    try
                    {

                        if (EstatusProceso.VerificaTitular == 1 & EstatusProceso.RevisionRefTitular == 1 & EstatusProceso.RevisionRefAval == 1 & EstatusProceso.VerificaAval == 1)
                        {
                            EstatusProceso2.StatusProcesoID = EstatusActualizado;
                            ConexionBD.database.BeginTransaction();
                            await ConexionBD.database.UpdateAsync(EstatusProceso2);
                            await ConexionBD.Destroy();
                        }
                        return Ok(res);

                    }
                    catch (Exception ex)
                    {
                        return Ok(res);
                    }

                else
                    return BadRequest(res.msj);

            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("updateRechazarRefsAvales")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> updateRechazarRefsAvales(ConfiaWebApi.PeticionesRest.Prospeccion.Avales.updateRechazarAvales parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, ProspectoID = parData.ProspectoID, Nota = parData.Nota, regresa = parData.regresa, msj = parData.msj };
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.ModlesSP.Prospeccion.Confirmar>("EXEC Prospeccion.pa_RechazaReferenciasAval @Usu, @ProspectoID, @Nota, @regresa, @msj", obj).FirstOrDefaultAsync();

                await ConexionBD.Destroy();
                if (res.regresa == 1)
                    return Ok(res);
                else
                    return BadRequest(res.msj);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }


        [HttpPost]
        [Route("getFirmaAval")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetFirmaAval(PeticionesRest.Prospeccion.Prospecto.GetFirmaAval parData)
        {
            try
            {
                var src = "";
                var Documento = await ConexionBD.database.QueryAsync<AvalesDocumentos_VW>("WHERE PersonaID = @0 AND Clave = 'D045'", parData.AvalID).FirstOrDefaultAsync();
                //var Documento = await ConexionBD.database.SingleByIdAsync<ProspectosDocumentos_VW>(parData.DocumentoID);
                if (Documento == null) throw new Exception("SIN FIRMA");
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
                        return BadRequest("Error al consultar Firma de Aval");
                    }
                }

                var resp = new { src };
                await ConexionBD.Destroy();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}
