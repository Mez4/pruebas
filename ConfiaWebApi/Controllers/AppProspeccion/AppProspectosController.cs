using ConfiaWebApi.Code;
using ConfiaWebApi.ModlesSP.Prospeccion;
using ConfiaWebApi.PeticionesRest.Prospeccion.Documentos;
using ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Prospeccion;
using DBContext.DBConfia.Seguridad;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Net.Http.Json;
using System.Linq;
using System.Text;
using System.Net.Http;
using Microsoft.Data.SqlClient;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using IdentityServer4.Extensions;



namespace ConfiaWebApi.Controllers.AppProspeccion
{
    [Authorize]
    [ApiController]
    [Route("api/AppProspeccion/[controller]")]
    public class AppProspectosController : ControllerBase
    {
        private DBConfiaContext ConexionBD;
        private IConfiguration Configuracion;

        //Consultas en DBConfia_Personas
        private readonly SqlConnection _sqlConnection;

        public AppProspectosController(IConfiguration _Configuration, DBConfiaContext _DBContext)
        {
            Configuracion = _Configuration;
            ConexionBD = _DBContext;

            //Datos de configuracion 
            _sqlConnection = new SqlConnection(_Configuration.GetSection("ConnectionStrings").GetSection("DBConfia_Personas").Value);

        }


        [HttpPost]
        [Route("getPerfilProspecto")]
        [Authorize]
        public async Task<IActionResult> GetPerfilProspecto(GetPerfil parData)
        {
            if (parData.ProspectoID != null)
            {
                try
                {
                    var ValidadoAMesa = await ConexionBD.database.QueryAsync<Tuberia>("WHERE PersonaID=@0 AND StatusProcesoID = 8", parData.ProspectoID).SingleOrDefaultAsync();
                    var DatosGenerales = await ConexionBD.database.QueryAsync<ProspectosDatosGeneralesApp_VW>("WHERE PersonaID=@0", parData.ProspectoID).SingleOrDefaultAsync();
                    var DatosSocioeconomicos = await ConexionBD.database.QueryAsync<ProspectosDatosSocioeconomicosApp_VW>("WHERE PersonaID=@0", parData.ProspectoID).SingleOrDefaultAsync();
                    var descripcion = await ConexionBD.database.QueryAsync<ProspectosApp_VW>("Where ProspectoID = @ProspectoID", parData).SingleOrDefaultAsync();
                    var Vehiculos = await ConexionBD.database.QueryAsync<RelacionAutoMotoApp_VW>("WHERE PersonaID=@0 AND TipoPersonaID = 1", parData.ProspectoID).ToArrayAsync();
                    var Experiencia = await ConexionBD.database.QueryAsync<ProspectosExperienciaVentasApp_VW>("WHERE PersonaID=@0 AND TipoPersonaID = 1", parData.ProspectoID).ToArrayAsync();
                    var Referencias = await ConexionBD.database.QueryAsync<ReferenciasApp_VW>("WHERE PersonaID=@0 AND TipoPersonaID = 1", parData.ProspectoID).ToArrayAsync();
                    var Documentos = await ConexionBD.database.QueryAsync<ProspectosDocumentosApp_VW>("WHERE PersonaID=@0 AND TipoPersonaID = 1", parData.ProspectoID).ToArrayAsync();
                    var Avales = await ConexionBD.database.QueryAsync<AvalesaApp_VW>("WHERE ProspectoID=@0", parData.ProspectoID).ToArrayAsync();
                    var Firma = await GetFirma(parData.ProspectoID);

                    var res = new
                    {
                        Descripcion = descripcion.StatusProcesoID,
                        Validado = ValidadoAMesa != null,
                        DatosGenerales,
                        DatosSocioeconomicos,
                        Vehiculos,
                        Experiencia,
                        Referencias,
                        Documentos,
                        Avales,
                        Firma = "",
                        EnMesa = descripcion.EnMesa,
                    };

                    var resp = new
                    {
                        resultCode = 0,
                        resultDesc = "OK.",
                        data = res
                    };

                    await ConexionBD.Destroy();
                    return Ok(resp);
                }
                catch (Exception ex)
                {
                    await ConexionBD.Destroy();
                    return BadRequest(new
                    {
                        resultCode = -1,
                        resultDesc = ex.Message,
                        data = new { error = "Error al obtener info " }
                    });
                }
            }
            else
            {
                await ConexionBD.Destroy();
                return BadRequest("Acción No Valida");
            }
        }


        [HttpPost]
        [Route("getProspectos")]
        [Authorize]
        public async Task<IActionResult> GetProspectos()
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosApp_VW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            var obj = new { PromotorUsuarioID = UsuarioActual.UsuarioID };
            try
            {
                var data = await ConexionBD.database.QueryAsync<ProspectosApp_VW>("WHERE PromotorUsuarioID = @0 AND (Descartado=0 or Descartado is null) AND StatusProcesoID NOT IN (18) ORDER BY ProspectoID desc", obj.PromotorUsuarioID).ToArrayAsync();

                var resp = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                await ConexionBD.Destroy();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { error = "Error al obtener la lista de Prospectos " }
                });
            }
        }
        [HttpPost]
        [Route("getProspectosConsolidados")]
        [Authorize]
        public async Task<IActionResult> getProspectosConsolidados()
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosApp_VW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            var obj = new { PromotorUsuarioID = UsuarioActual.UsuarioID };
            try
            {
                var data = await ConexionBD.database.QueryAsync<ProspectosApp_VW>("WHERE PromotorUsuarioID = @0 AND (Descartado=0 or Descartado is null) AND StatusProcesoID = 18 ORDER BY 1 desc", obj.PromotorUsuarioID).ToArrayAsync();
                var resp = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                await ConexionBD.Destroy();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { error = "Error al obtener la lista de prospectos consolidados" }
                });
            }
        }
        [HttpPost]
        [Route("getProspectosDescartados")]
        [Authorize]
        public async Task<IActionResult> getProspectosDescartados()
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosApp_VW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            var obj = new { PromotorUsuarioID = UsuarioActual.UsuarioID };
            try
            {
                var data = await ConexionBD.database.QueryAsync<ProspectosApp_VW>("WHERE PromotorUsuarioID = @0 AND Descartado=1 AND StatusProcesoID NOT IN (18) ORDER BY 1 desc", obj.PromotorUsuarioID).ToArrayAsync();
                var resp = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                await ConexionBD.Destroy();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { error = "Error al obtener la lista de prospectos descartados " }
                });
            }
        }
        [HttpPost]
        [Route("setDescartadoByIdProspecto")]
        [Authorize]
        public async Task<IActionResult> setDescartadoByIdProspecto(UpdateProspectoDescartado parData)
        {
            try
            {
                ConexionBD.database.BeginTransaction();
                var prospectos = await ConexionBD.database.QueryAsync<Prospectos>("WHERE (ProspectoID = @0) AND StatusProcesoID NOT IN (18)", parData.ProspectoID).FirstOrDefaultAsync();
                if (parData.Descartado == true && prospectos != null)
                {
                    prospectos.FechaDescarte = DateTime.Now;
                    prospectos.ObservacionesDescartado = parData.ObservacionesDescartado;
                    prospectos.Descartado = true;
                    await ConexionBD.database.UpdateAsync(prospectos);
                }
                else if (prospectos == null)
                {
                    var resps = new
                    {
                        resultCode = -1,
                        resultDesc = "OK.",
                        msj = "Prospecto no encontrado",
                        data = new { }
                    };

                    await ConexionBD.Destroy();
                    return Ok(resps);
                }
                else
                {
                    prospectos.FechaDescarte = DateTime.Parse("01-01-1990");
                    prospectos.ObservacionesDescartado = "N/A";
                    prospectos.Descartado = false;
                    await ConexionBD.database.UpdateAsync(prospectos);
                }


                ConexionBD.database.CompleteTransaction();

                var resp = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = new { }
                };

                await ConexionBD.Destroy();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { error = "Error al actualizar la informacion" }
                });
            }
        }
        protected async Task<string> GetFirma(int? ProspectoID)
        {
            try
            {
                var src = "";
                var Documento = await ConexionBD.database.QueryAsync<ProspectosDocumentosApp_VW>("WHERE PersonaID = @0 AND Clave = 'D044'", ProspectoID).FirstOrDefaultAsync();
                //var Documento = await ConexionBD.database.SingleByIdAsync<ProspectosDocumentos_VW>(parData.DocumentoID);
                if (Documento == null) throw new Exception("SIN FIRMA");
                var plainTextBytes = Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
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
                        return src;
                    }
                }
                await ConexionBD.Destroy();
                return src;
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return ex.Message;
            }

        }

        [HttpPost]
        [Route("ValidarDocumentos")]
        [Authorize]
        public async Task<IActionResult> ValidarDocumentos(ValidarDocumentos parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosApp_VW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var obj = new { parData.ProspectoID, UsuarioActual.UsuarioID };
                var validacion = await ConexionBD.database.QueryAsync<Confirmar>("EXEC Prospeccion.pa_Validacion_DocumentosCaptura @ProspectoID, @UsuarioID", obj).FirstOrDefaultAsync();

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    //data = validacion.regresa,
                    msj = validacion.regresa == 1 ? $"Se Validó la Subida de Documentos del Prospecto {parData.ProspectoID} correctamente" : validacion.msj

                };
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
        [Route("ValidarDocumentosCompletos")]
        [Authorize]
        public async Task<IActionResult> ValidarDocumentosCompletos(ValidarDocumentosApp parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosApp_VW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                //
                int ProductoID = parData.ProductoID;/*int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());*/

                var obj = new { parData.ProspectoID, UsuarioActual.UsuarioID, ProductoID };
                var validacion = await ConexionBD.database.QueryAsync<Confirmar>("EXEC Prospeccion.pa_ValidarDocumentacionCompleta @ProspectoID, @ProductoID", obj).FirstOrDefaultAsync();

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    //data = validacion.regresa,
                    msj = validacion.regresa == 1 ? $"Se Validó la Subida de Documentos del Prospecto {parData.ProspectoID} correctamente" : validacion.msj
                };

                var obj2 = new { parData.ProspectoID, Nota = "TODOS LOS DOCUMENTOS SE HAN SUBIDO CORRECTAMENTE", UsuarioActual.UsuarioID, TipoMesa = 4 };
                var validacion2 = await ConexionBD.database.QueryAsync<LogMensajesVW>("EXEC Prospeccion.pa_AgregarNota @ProspectoID, @Nota, 0, @UsuarioID, @TipoMesa", obj2).FirstOrDefaultAsync();

                var updateproceso = await ConexionBD.database.QueryAsync<Prospectos>("WHERE ProspectoID=@0 ", parData.ProspectoID).SingleOrDefaultAsync();
                if (updateproceso != null)
                {
                    updateproceso.PantallaProcesoID = 3;
                    await ConexionBD.database.UpdateAsync(updateproceso);
                }

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
        [Route("ValidarProspecto")]
        [Authorize]
        public async Task<IActionResult> ValidarProspecto(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.ValidarProspecto parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosApp_VW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var obj = new { parData.ProspectoID, UsuarioActual.UsuarioID };
                var validacion = await ConexionBD.database.QueryAsync<ModlesSP.Prospeccion.ValidarProspecto>("EXEC Prospeccion.pa_Validacion_Prospecto @ProspectoID, @UsuarioID", obj).FirstOrDefaultAsync();

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    //res = validacion.regresa,
                    msj = validacion.regresa == 1 ? $"Se Validó el Prospecto {parData.ProspectoID} correctamente, ahora esta en proceso de validación en Mesa de Crédito" : validacion.msj
                };
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [Consumes("multipart/form-data")]
        [HttpPost]
        [Route("subirDocumentosProspecto")]
        [Authorize]
        public async Task<IActionResult> SubirDocumentosProspecto([FromForm] ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.UploadFile parData)
        {
            try
            {

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosApp_VW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var DocValida = new Documentos();
                if (parData.DocumentoID > 0)
                {
                    DocValida = await ConexionBD.database.SingleByIdAsync<Documentos>(parData.DocumentoID); ;
                    if (DocValida.Autorizado == true)
                    {
                        await ConexionBD.Destroy();
                        return BadRequest("Este Documento ya fue validado por Mesa de Crédito y no puede ser actualizado");
                    }
                }

                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                var basicToken = Convert.ToBase64String(plainTextBytes);
                string path = $"{Configuracion["BucketApi:AwsPath_DocsExpediente"]}/{parData.PersonaID}";
                var ext = Path.GetExtension(parData.doc.FileName);
                string file_name = $"{parData.PersonaID}_{parData.TipoDocumentoID}{ext}";
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
                            var Documento = new Documentos()
                            {
                                PersonaID = Int64.Parse(parData.PersonaID),
                                TipoPersonaID = Int16.Parse(parData.TipoPersonaID),
                                TipoDocumentoID = parData.TipoDocumentoID,
                                Ruta = $"{path}/{file_name}",
                                Status = "ACTIVO"
                            };
                            await ConexionBD.database.InsertAsync<Documentos>(Documento);
                            DocumentoIDAux = Documento.DocumentoID;
                        }
                        else
                        {
                            //var Documento = await ConexionBD.database.SingleByIdAsync<Documentos>(parData.DocumentoID);
                            ConexionBD.database.BeginTransaction();
                            if (DocValida.Autorizado == false)
                            {
                                var ValidacionMesa = await ConexionBD.database.QueryAsync<ValidacionMesa>("WHERE ProspectoID = @PersonaID", parData).SingleOrDefaultAsync();
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
                            Documento.TipoDocumentoID = parData.TipoDocumentoID;
                            Documento.Ruta = $"{path}/{file_name}";
                            Documento.Status = "ACTIVO";
                            Documento.Autorizado = null;
                            await ConexionBD.database.UpdateAsync(Documento);
                            DocumentoIDAux = Documento.DocumentoID;
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
                    DocumentoID = DocumentoIDAux,
                    NombreDocumento = parData.NombreDocumento,
                    Orden = parData.Orden,
                    PersonaID = parData.PersonaID,
                    Ruta = $"{path}/{file_name}",
                    TipoDocumentoID = parData.TipoDocumentoID,
                    TipoPersonaID = parData.TipoPersonaID,
                    Autorizado = autAux,
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
        [Route("addAval")]
        [Authorize]
        // [Code.TProteccionProducto]
        public async Task<IActionResult> AddAval(PeticionesRest.Prospeccion.Prospecto.AddAval parData)
        {
            var Person = await ConexionBD.database.QueryAsync<Personas>("WHERE  (CURP = @CURP) AND (RFC = @RFC)", parData).SingleOrDefaultAsync();
            if (Person?.PersonaID > 0)
            {
                var res = new
                {
                    res = 2,
                    msj = "La persona ya existe con el ID: " + Person.PersonaID.ToString(),
                    Data = new { }
                };
            }

            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosApp_VW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            try
            {
                ConexionBD.database.BeginTransaction();

                var Persona = new Personas()
                {
                    Nombre = parData.Nombre?.ToUpper(),
                    ApellidoPaterno = parData.ApellidoPaterno?.ToUpper(),
                    ApellidoMaterno = parData.ApellidoMaterno?.ToUpper(),
                    FechaNacimiento = parData.FechaNacimiento,
                    CURP = parData.CURP?.ToUpper(),
                    RFC = parData.RFC?.ToUpper(),
                    SexoID = parData.SexoID,
                    EstadoCivilID = parData.EstadoCivilID,
                    EscolaridadID = parData.EscolaridadID,
                    DependientesEconomicos = parData.DependientesEconomicos,
                    TelefonoDomicilio = parData.TelefonoDomicilio,
                    TelefonoMovil = parData.TelefonoMovil,
                    LugarNacimiento = parData.LugarNacimiento,
                    CorreoElectronico = parData.CorreoElectronico?.ToUpper(),
                    NombreConyuge = parData.NombreConyuge?.ToUpper(),
                    Observaciones = parData.Observaciones ?? "",
                    identificacionTipoId = parData.identificacionTipoId,
                    identificacionNumero = parData.identificacionNumero,
                    CreacionPersonaID = (long)UsuarioActual.PersonaID,
                    CreacionUsuarioID = UsuarioActual.UsuarioID,
                    CreacionFecha = DateTime.Now
                };
                await ConexionBD.database.InsertAsync(Persona);

                var Aval = new DBContext.DBConfia.Prospeccion.Avales()
                {
                    AvalID = Persona.PersonaID,
                    ProspectoID = parData.AgregarAval.PersonaID,
                    Activo = true,
                };
                await ConexionBD.database.InsertAsync(Aval);

                parData.AgregarAval.PersonaID = Persona.PersonaID;
                var resIP = await AddAvalInfo(parData.AgregarAval);
                if (resIP == 0)
                {
                    await ConexionBD.Destroy();
                    throw new Exception("Error al guardar la info del Aval");
                }

                var prospecto = await ConexionBD.database.SingleByIdAsync<Prospectos>(Aval.ProspectoID);
                prospecto.StatusProcesoID = 4;
                await ConexionBD.database.UpdateAsync(prospecto);

                var TuberiaHistory = await ConexionBD.database.QueryAsync<Tuberia>("WHERE PersonaID=@0 AND StatusProcesoID = 4", Aval.ProspectoID).SingleOrDefaultAsync();

                if (TuberiaHistory == null)
                {
                    var Tuberia = new Tuberia()
                    {
                        PersonaID = Aval.ProspectoID,
                        TipoPersonaID = 1,
                        StatusProcesoID = 4,
                        TuberiaResultadoID = 2,
                        Validado = true,
                        FechaRegistro = DateTime.Now,
                        FechaValidacion = DateTime.Now,
                        PersonaAnalistaID = (long)UsuarioActual.PersonaID,
                        UsuarioAnalistaID = UsuarioActual.UsuarioID,
                    };
                    await ConexionBD.database.InsertAsync(Tuberia);
                }
                ConexionBD.database.CompleteTransaction();

                var Data = await ConexionBD.database.QueryAsync<PersonasApp_VW>("WHERE PersonaID=@0", Persona.PersonaID).SingleOrDefaultAsync();

                var res = new
                {
                    res = 1,
                    msj = "Se creó la persona (aval) con el id: " + Persona.PersonaID,
                    data = Data,
                    resultCode = 0,
                    resultDesc = "Oks."
                };
                await ConexionBD.Destroy();
                return Ok(res);


            }
            catch (Exception ex)
            {
                ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest("ERROR AL GUARDAR LA PERSONA: " + ex.Message);
            }
        }
        protected async Task<int> AddAvalInfo(PeticionesRest.Prospeccion.Prospecto.Agregar parData)
        {
            try
            {
                // Comenzamos una transaccion
                ConexionBD.database.BeginTransaction();

                var direccionAval = new Domicilios()
                {
                    PersonaID = parData.PersonaID,
                    TipoPersonaID = 3,

                    AsentamientoID = parData.DireccionPersona_AsentamientoID,
                    calle = parData.DireccionPersona_NombreVialidad?.ToUpper(),
                    localidad = parData.DireccionPersona_Localidad?.ToUpper(),
                    numeroExterior = parData.DireccionPersona_NumeroExterior?.ToUpper(),
                };
                await ConexionBD.database.InsertAsync(direccionAval);

                if (parData.Laboral_Trabaja)
                {
                    var empleoAval = new InformacionLaboral()
                    {
                        PersonaID = parData.PersonaID,
                        TipoPersonaID = 3,

                        Antiguedad = parData.Laboral__Antiguedad,
                        Empresa = parData.Laboral__Empresa?.ToUpper(),
                        OcupacionID = parData.Laboral__OcupacionID,
                        Sueldo = parData.Laboral__SueldoMensual,
                        Telefono = parData.Laboral__Telefono,

                        AsentamientoID = parData.DireccionLaboral_AsentamientoID,
                        Calle = parData.DireccionLaboral_NombreVialidad?.ToUpper(),
                        localidad = parData.DireccionLaboral_LocalidadLaboral?.ToUpper(),
                        NumeroExterior = parData.DireccionLaboral_NumeroExterior?.ToUpper(),
                    };
                    await ConexionBD.database.InsertAsync(empleoAval);
                }

                if (parData.Conyuge_Trabaja)
                {
                    var empleoConyuge = new InformacionLaboral()
                    {
                        PersonaID = parData.PersonaID,
                        TipoPersonaID = 4,

                        Antiguedad = parData.Conyuge_AntiguedadConyuge.ToUpper(),
                        Empresa = parData.Conyuge_EmpresaConyuge?.ToUpper(),
                        OcupacionID = parData.Conyuge_OcupacionIDConyuge,
                        Sueldo = parData.Conyuge_SueldoMensualConyuge,
                        Telefono = parData.Conyuge_TelefonoLaboralConyuge,

                        AsentamientoID = parData.Conyuge_AsentamientoIDLaboralConyuge,
                        Calle = parData.Conyuge_CalleLaboralConyuge?.ToUpper(),
                        localidad = parData.Conyuge_LocalidadLaboralConyuge?.ToUpper(),
                        NumeroExterior = parData.Conyuge_NumeroExteriorLaboralConyuge?.ToUpper(),
                    };
                    await ConexionBD.database.InsertAsync(empleoConyuge);
                }

                // Hacemos el commit a la transaccion
                ConexionBD.database.CompleteTransaction();
                //await ConexionBD.Destroy();
                return 1;
            }
            catch (Exception)
            {
                ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return 0;
                throw new Exception("Error al guardar AddProspectoInfo"); ;
            }

        }

        [HttpPost]
        [Route("EditAval")]
        [Authorize]
        public async Task<IActionResult> EditAval(PeticionesRest.Prospeccion.Prospecto.AddAval parData)
        {
            try
            {
                ConexionBD.database.BeginTransaction();

                //PERSONA
                var personaProspecto = await ConexionBD.database.SingleByIdAsync<Personas>(parData.AgregarAval.PersonaID);
                personaProspecto.Nombre = parData.Nombre?.ToUpper();
                personaProspecto.ApellidoPaterno = parData.ApellidoPaterno?.ToUpper();
                personaProspecto.ApellidoMaterno = parData.ApellidoMaterno?.ToUpper();
                personaProspecto.FechaNacimiento = parData.FechaNacimiento;
                personaProspecto.CURP = parData.CURP?.ToUpper();
                personaProspecto.RFC = parData.RFC?.ToUpper();
                personaProspecto.SexoID = parData.SexoID;
                personaProspecto.EstadoCivilID = parData.EstadoCivilID;
                personaProspecto.EscolaridadID = parData.EscolaridadID;
                personaProspecto.DependientesEconomicos = parData.DependientesEconomicos;
                personaProspecto.TelefonoDomicilio = parData.TelefonoDomicilio;
                personaProspecto.TelefonoMovil = parData.TelefonoMovil;
                personaProspecto.LugarNacimiento = parData.LugarNacimiento;
                personaProspecto.CorreoElectronico = parData.CorreoElectronico?.ToUpper();
                personaProspecto.NombreConyuge = parData.NombreConyuge?.ToUpper();
                await ConexionBD.database.UpdateAsync(personaProspecto);

                //DOMICILIO
                var domicilioProspecto = await ConexionBD.database.QueryAsync<Domicilios>("WHERE PersonaID=@0 AND TipoPersonaID = 3", parData.AgregarAval.PersonaID).SingleOrDefaultAsync();
                domicilioProspecto.AsentamientoID = parData.AgregarAval.DireccionPersona_AsentamientoID;
                domicilioProspecto.calle = parData.AgregarAval.DireccionPersona_NombreVialidad?.ToUpper();
                domicilioProspecto.localidad = parData.AgregarAval.DireccionPersona_Localidad?.ToUpper();
                domicilioProspecto.numeroExterior = parData.AgregarAval.DireccionPersona_NumeroExterior?.ToUpper();
                await ConexionBD.database.UpdateAsync(domicilioProspecto);

                //EMPLEO
                if (parData.AgregarAval.Laboral_Trabaja)
                {
                    var infoLaboralProspecto = await ConexionBD.database.QueryAsync<InformacionLaboral>("WHERE PersonaID=@0 AND TipoPersonaID = 3", parData.AgregarAval.PersonaID).SingleOrDefaultAsync();
                    if (infoLaboralProspecto != null)
                    {
                        infoLaboralProspecto.Antiguedad = parData.AgregarAval.Laboral__Antiguedad;
                        infoLaboralProspecto.Empresa = parData.AgregarAval.Laboral__Empresa?.ToUpper();
                        infoLaboralProspecto.OcupacionID = parData.AgregarAval.Laboral__OcupacionID;
                        infoLaboralProspecto.Sueldo = parData.AgregarAval.Laboral__SueldoMensual;
                        infoLaboralProspecto.Telefono = parData.AgregarAval.Laboral__Telefono;

                        infoLaboralProspecto.AsentamientoID = parData.AgregarAval.DireccionLaboral_AsentamientoID;
                        infoLaboralProspecto.Calle = parData.AgregarAval.DireccionLaboral_NombreVialidad?.ToUpper();
                        infoLaboralProspecto.localidad = parData.AgregarAval.DireccionLaboral_LocalidadLaboral?.ToUpper();
                        infoLaboralProspecto.NumeroExterior = parData.AgregarAval.DireccionLaboral_NumeroExterior?.ToUpper();
                        await ConexionBD.database.UpdateAsync(infoLaboralProspecto);
                    }
                    else
                    {
                        var empleoProspecto = new InformacionLaboral()
                        {
                            PersonaID = parData.AgregarAval.PersonaID,
                            TipoPersonaID = 3,

                            Antiguedad = parData.AgregarAval.Laboral__Antiguedad,
                            Empresa = parData.AgregarAval.Laboral__Empresa?.ToUpper(),
                            OcupacionID = parData.AgregarAval.Laboral__OcupacionID,
                            Sueldo = parData.AgregarAval.Laboral__SueldoMensual,
                            Telefono = parData.AgregarAval.Laboral__Telefono,

                            AsentamientoID = parData.AgregarAval.DireccionLaboral_AsentamientoID,
                            Calle = parData.AgregarAval.DireccionLaboral_NombreVialidad?.ToUpper(),
                            localidad = parData.AgregarAval.DireccionLaboral_LocalidadLaboral?.ToUpper(),
                            NumeroExterior = parData.AgregarAval.DireccionLaboral_NumeroExterior?.ToUpper(),
                        };
                        await ConexionBD.database.InsertAsync(empleoProspecto);
                    }
                }
                else
                {
                    var infoLaboralProspecto = await ConexionBD.database.QueryAsync<InformacionLaboral>("WHERE PersonaID=@0 AND TipoPersonaID = 3", parData.AgregarAval.PersonaID).SingleOrDefaultAsync();
                    if (infoLaboralProspecto != null)
                    {
                        await ConexionBD.database.DeleteAsync(infoLaboralProspecto);
                    }
                }

                //EMPLEO CONYUGE
                if (parData.AgregarAval.Conyuge_Trabaja)
                {
                    var infoLaboralConyuge = await ConexionBD.database.QueryAsync<InformacionLaboral>("WHERE PersonaID=@0 AND TipoPersonaID = 4", parData.AgregarAval.PersonaID).SingleOrDefaultAsync();
                    if (infoLaboralConyuge != null)
                    {
                        infoLaboralConyuge.Antiguedad = parData.AgregarAval.Conyuge_AntiguedadConyuge.ToUpper();
                        infoLaboralConyuge.Empresa = parData.AgregarAval.Conyuge_EmpresaConyuge?.ToUpper();
                        infoLaboralConyuge.OcupacionID = parData.AgregarAval.Conyuge_OcupacionIDConyuge;
                        infoLaboralConyuge.Sueldo = parData.AgregarAval.Conyuge_SueldoMensualConyuge;
                        infoLaboralConyuge.Telefono = parData.AgregarAval.Conyuge_TelefonoLaboralConyuge;

                        infoLaboralConyuge.AsentamientoID = parData.AgregarAval.Conyuge_AsentamientoIDLaboralConyuge;
                        infoLaboralConyuge.Calle = parData.AgregarAval.Conyuge_CalleLaboralConyuge?.ToUpper();
                        infoLaboralConyuge.localidad = parData.AgregarAval.Conyuge_LocalidadLaboralConyuge?.ToUpper();
                        infoLaboralConyuge.NumeroExterior = parData.AgregarAval.Conyuge_NumeroExteriorLaboralConyuge?.ToUpper();
                        await ConexionBD.database.UpdateAsync(infoLaboralConyuge);
                    }
                    else
                    {
                        var empleoConyuge = new InformacionLaboral()
                        {
                            PersonaID = parData.AgregarAval.PersonaID,
                            TipoPersonaID = 4,

                            Antiguedad = parData.AgregarAval.Conyuge_AntiguedadConyuge.ToUpper(),
                            Empresa = parData.AgregarAval.Conyuge_EmpresaConyuge?.ToUpper(),
                            OcupacionID = parData.AgregarAval.Conyuge_OcupacionIDConyuge,
                            Sueldo = parData.AgregarAval.Conyuge_SueldoMensualConyuge,
                            Telefono = parData.AgregarAval.Conyuge_TelefonoLaboralConyuge,

                            AsentamientoID = parData.AgregarAval.Conyuge_AsentamientoIDLaboralConyuge,
                            Calle = parData.AgregarAval.Conyuge_CalleLaboralConyuge?.ToUpper(),
                            localidad = parData.AgregarAval.Conyuge_LocalidadLaboralConyuge?.ToUpper(),
                            NumeroExterior = parData.AgregarAval.Conyuge_NumeroExteriorLaboralConyuge?.ToUpper(),
                        };
                        await ConexionBD.database.InsertAsync(empleoConyuge);
                    }
                }
                else
                {
                    var infoLaboralConyuge = await ConexionBD.database.QueryAsync<InformacionLaboral>("WHERE PersonaID=@0 AND TipoPersonaID = 4", parData.AgregarAval.PersonaID).SingleOrDefaultAsync();
                    if (infoLaboralConyuge != null)
                    {
                        await ConexionBD.database.DeleteAsync(infoLaboralConyuge);
                    }
                }

                ConexionBD.database.CompleteTransaction();

                var res = new
                {
                    resultCode = 0,
                    res = 1,
                    msj = $"Se actualizo la informacion del AVAL {parData.AgregarAval.PersonaID}"
                };
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest("ERROR AL EDITAR LOS DATOS GENERALES DEL AVAL: " + ex.Message);
            }
        }

        [HttpPost]
        [Route("AddDatosEconomicos")]
        [Authorize]
        public async Task<IActionResult> AddDatosEconomicos(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.DatosEconomicos parData)
        {
            try
            {
                var usuarioActualEmail = Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosApp_VW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();
                var ingresoMensual = (parData.ingresoSueldo + parData.ingresoGananciasDV + parData.ingresoConyuge + parData.ingresoOtro);
                ConexionBD.database.BeginTransaction();

                var prospecto = await ConexionBD.database.SingleByIdAsync<Prospectos>(parData.prospectoID);
                prospecto.StatusProcesoID = 2;
                prospecto.tieneAutoMoto = parData.tieneVehiculo;
                prospecto.tieneExperiencia = parData.tieneExperiencia;
                prospecto.tieneDependientes = parData.dependientesEconomicos > 0;
                prospecto.DistribuidorTiposID = parData.distribuidorTipoID;
                await ConexionBD.database.UpdateAsync(prospecto);
                var DatosSocioeconomicos = await ConexionBD.database.QueryAsync<ProspectosDatosSocioeconomicos_VW>("WHERE PersonaID=@0", parData.prospectoID).SingleOrDefaultAsync();

                //  bool something = true;
                if (DatosSocioeconomicos.numeroPersonasHabitan == null)
                {
                    await insertDatosEconomicos(parData, UsuarioActual, ingresoMensual);
                }
                else
                {
                    await updateDatosEconomicos(parData, ingresoMensual);
                }

                ConexionBD.database.CompleteTransaction();

                var resp = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = new { }
                };

                await ConexionBD.Destroy();
                return Ok(resp);

            }
            catch (Exception ex)
            {
                ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { error = "Error al guardar la informacion" }
                });
            }
        }

        [HttpPost]
        [Route("EditDatosEconomicos")]
        [Authorize]

        public async Task<IActionResult> EditDatosEconomicos(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.DatosEconomicos parData)
        {
            try
            {
                var usuarioActualEmail = Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);

                var ingresoMensual = (parData.ingresoSueldo + parData.ingresoGananciasDV + parData.ingresoConyuge + parData.ingresoOtro);
                ConexionBD.database.BeginTransaction();

                var validaProspecto = await ConexionBD.database.QueryAsync<Prospectos_VW>("WHERE ProspectoID=@0", parData.prospectoID).SingleOrDefaultAsync();
                var personaProspecto = await ConexionBD.database.SingleByIdAsync<Personas>(parData.prospectoID);
                if (validaProspecto.EstatusConsultaBuroID != 2)
                    personaProspecto.RFC = parData.rfc?.ToUpper();
                personaProspecto.DependientesEconomicos = parData.dependientesEconomicos;
                personaProspecto.IngresosMensuales = ingresoMensual;
                await ConexionBD.database.UpdateAsync(personaProspecto);

                var prospecto = await ConexionBD.database.SingleByIdAsync<Prospectos>(parData.prospectoID);
                prospecto.StatusProcesoID = 2;
                prospecto.tieneAutoMoto = parData.tieneVehiculo;
                prospecto.tieneExperiencia = parData.tieneExperiencia;
                prospecto.tieneDependientes = parData.dependientesEconomicos > 0;
                prospecto.DistribuidorTiposID = parData.distribuidorTipoID;
                await ConexionBD.database.UpdateAsync(prospecto);

                //INFO VIVIENDA
                var infoVivienda = await ConexionBD.database.QueryAsync<InformacionVivienda>("WHERE PersonaID=@0 AND TipoPersonaID = 1", parData.prospectoID).SingleOrDefaultAsync();
                infoVivienda.TipoViviendaID = parData.tipoViviendaID;
                infoVivienda.tieneOtraVivienda = parData.otraVivienda;
                infoVivienda.numeroPersonasHabitan = parData.habitantes;
                infoVivienda.valorAproximado = parData.valorAproxVivienda;
                await ConexionBD.database.UpdateAsync(infoVivienda);

                //OTRA VIVIEDA
                if (parData.otraVivienda)
                {
                    var otraVivienda = await ConexionBD.database.QueryAsync<InformacionOtraVivienda>("WHERE PersonaID=@0 AND TipoPersonaID = 1", parData.prospectoID).SingleOrDefaultAsync();
                    if (otraVivienda != null)
                    {
                        otraVivienda.TipoViviendaID = parData.tipoOtraViviendaID;
                        otraVivienda.Calle = parData.calleOtraVivienda?.ToUpper();
                        otraVivienda.NumeroExterior = parData.numeroOtraVivienda?.ToUpper();
                        otraVivienda.NumeroInterior = "";
                        otraVivienda.AsentamientoID = parData.asentamientoIDOtra;
                        otraVivienda.localidad = parData.localidadOtraVivienda?.ToUpper();
                        otraVivienda.valorAproximado = parData.valorAproxOtra;
                        await ConexionBD.database.UpdateAsync(otraVivienda);
                    }
                    else
                    {
                        var infoOtraVivienda = new InformacionOtraVivienda()
                        {
                            PersonaID = parData.prospectoID,
                            TipoPersonaID = 1,
                            TipoViviendaID = parData.tipoOtraViviendaID,
                            Calle = parData.calleOtraVivienda?.ToUpper(),
                            NumeroExterior = parData.numeroOtraVivienda?.ToUpper(),
                            NumeroInterior = "",
                            AsentamientoID = parData.asentamientoIDOtra,
                            localidad = parData.localidadOtraVivienda?.ToUpper(),
                            valorAproximado = parData.valorAproxOtra
                        };
                        await ConexionBD.database.InsertAsync(infoOtraVivienda);
                    }
                }

                //INGRESOS
                var ingresos = await ConexionBD.database.QueryAsync<Ingresos>("WHERE PersonaID=@0 AND TipoPersonaID = 1", parData.prospectoID).SingleOrDefaultAsync();
                ingresos.ingresoSueldo = parData.ingresoSueldo;
                ingresos.gananciasDV = parData.ingresoGananciasDV;
                ingresos.ingresoConyuge = parData.ingresoConyuge;
                ingresos.otrosIngresos = parData.ingresoOtro;
                ingresos.ingresoTotal = ingresoMensual;
                await ConexionBD.database.UpdateAsync(ingresos);

                //EGRESOS
                var egresos = await ConexionBD.database.QueryAsync<Egresos>("WHERE PersonaID=@0 AND TipoPersonaID = 1", parData.prospectoID).SingleOrDefaultAsync();
                egresos.TipoViviendaID = parData.tipoViviendaID;
                egresos.Alimentacion = parData.egresoAlimentacion;
                egresos.TarjetaCreido = parData.egresotarjetas;
                egresos.RentaPagoVivienda = parData.egresoVivienda;
                egresos.ServiciosDomesticos = parData.egresoDomestico;
                egresos.Otros = parData.egresoOtros;
                egresos.EgresoTotal = (parData.egresoAlimentacion + parData.egresotarjetas + parData.egresoVivienda + parData.egresoDomestico + parData.egresoOtros);
                await ConexionBD.database.UpdateAsync(egresos);

                //VEHICULOS
                if (parData.tieneVehiculo)
                {
                    var vehiculos = await ConexionBD.database.QueryAsync<RelacionAutoMoto>("WHERE PersonaID=@0 AND TipoPersonaID = 1", parData.prospectoID).ToArrayAsync();
                    if (vehiculos.Length > 0)
                    {
                        foreach (var vehiculo in vehiculos)
                            await ConexionBD.database.DeleteAsync(vehiculo);
                    }
                    foreach (var vehiculo in parData.vehiculos)
                    {
                        var vehi = new RelacionAutoMoto()
                        {
                            PersonaID = parData.prospectoID,
                            TipoPersonaID = 1,
                            Marca = vehiculo.marca?.ToUpper(),
                            Modelo = vehiculo.modelo?.ToUpper(),
                            Status = "ACTIVO",
                        };
                        await ConexionBD.database.InsertAsync(vehi);
                    }
                }
                else
                {
                    var vehiculos = await ConexionBD.database.QueryAsync<RelacionAutoMoto>("WHERE PersonaID=@0 AND TipoPersonaID = 1", parData.prospectoID).ToArrayAsync();
                    if (vehiculos.Length > 0)
                    {
                        foreach (var vehiculo in vehiculos)
                            await ConexionBD.database.DeleteAsync(vehiculo);
                    }
                }

                //EXPERIENCIA
                if (parData.tieneExperiencia)
                {
                    var experiencias = await ConexionBD.database.QueryAsync<ExperienciaVentas>("WHERE PersonaID=@0 AND TipoPersonaID = 1", parData.prospectoID).ToArrayAsync();
                    if (experiencias.Length > 0)
                    {
                        foreach (var experiencia in experiencias)
                            await ConexionBD.database.DeleteAsync(experiencia);
                    }
                    foreach (var experiencia in parData.experiencias)
                    {
                        var exp = new ExperienciaVentas()
                        {
                            PersonaID = parData.prospectoID,
                            TipoPersonaID = 1,
                            EmpresaExperienciaID = experiencia.empresa,
                            FechaIngreso = DateTime.Parse(experiencia.fecha),
                            LimiteCredito = experiencia.limite,
                            CreditoDisponible = experiencia.dispo,
                            Status = "ACTIVO",
                        };
                        await ConexionBD.database.InsertAsync(exp);
                    }
                }
                else
                {
                    var experiencias = await ConexionBD.database.QueryAsync<ExperienciaVentas>("WHERE PersonaID=@0 AND TipoPersonaID = 1", parData.prospectoID).ToArrayAsync();
                    if (experiencias.Length > 0)
                    {
                        foreach (var experiencia in experiencias)
                            await ConexionBD.database.DeleteAsync(experiencia);
                    }
                }

                ConexionBD.database.CompleteTransaction();

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = new { },
                    res = 1,
                    msj = $"Se actualizó la informacion del Prospecto {parData.prospectoID}"
                };
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest("ERROR AL EDITAR LOS DATOS ECONOMICOS DE LA PERSONA: " + ex.Message);
            }
        }

        private async Task insertDatosEconomicos(DatosEconomicos parData, UsuariosApp_VW UsuarioActual, Decimal ingresoMensual)
        {
            var personaProspecto = await ConexionBD.database.SingleByIdAsync<Personas>(parData.prospectoID);
            personaProspecto.RFC = parData.rfc?.ToUpper();
            personaProspecto.DependientesEconomicos = parData.dependientesEconomicos;
            personaProspecto.IngresosMensuales = ingresoMensual;
            await ConexionBD.database.UpdateAsync(personaProspecto);

            var infoVivienda = new InformacionVivienda()
            {
                PersonaID = parData.prospectoID,
                TipoPersonaID = 1,
                TipoViviendaID = parData.tipoViviendaID,
                tieneOtraVivienda = parData.otraVivienda,
                numeroPersonasHabitan = parData.habitantes,
                valorAproximado = parData.valorAproxVivienda
            };
            await ConexionBD.database.InsertAsync(infoVivienda);

            if (parData.otraVivienda)
            {
                var otraVivienda = new InformacionOtraVivienda()
                {
                    PersonaID = parData.prospectoID,
                    TipoPersonaID = 1,
                    TipoViviendaID = parData.tipoOtraViviendaID,
                    Calle = parData.calleOtraVivienda?.ToUpper(),
                    NumeroExterior = parData.numeroOtraVivienda?.ToUpper(),
                    NumeroInterior = "",
                    AsentamientoID = parData.asentamientoIDOtra,
                    localidad = parData.localidadOtraVivienda?.ToUpper(),
                    valorAproximado = parData.valorAproxOtra
                };
                await ConexionBD.database.InsertAsync(otraVivienda);
            }

            var ingresos = new Ingresos()
            {
                PersonaID = parData.prospectoID,
                TipoPersonaID = 1,
                ingresoSueldo = parData.ingresoSueldo,
                gananciasDV = parData.ingresoGananciasDV,
                ingresoConyuge = parData.ingresoConyuge,
                otrosIngresos = parData.ingresoOtro,
                ingresoTotal = ingresoMensual
            };
            await ConexionBD.database.InsertAsync(ingresos);



            var egresos = new Egresos()
            {
                PersonaID = parData.prospectoID,
                TipoPersonaID = 1,
                TipoViviendaID = parData.tipoViviendaID,
                Alimentacion = parData.egresoAlimentacion,
                TarjetaCreido = parData.egresotarjetas,
                RentaPagoVivienda = parData.egresoVivienda,
                ServiciosDomesticos = parData.egresoDomestico,
                Otros = parData.egresoOtros,
                EgresoTotal = (parData.egresoAlimentacion + parData.egresotarjetas + parData.egresoVivienda + parData.egresoDomestico + parData.egresoOtros)
            };
            await ConexionBD.database.InsertAsync(egresos);

            if (parData.tieneVehiculo)
            {
                foreach (var vehiculo in parData.vehiculos)
                {
                    var vehi = new RelacionAutoMoto()
                    {
                        PersonaID = parData.prospectoID,
                        TipoPersonaID = 1,
                        Marca = vehiculo.marca?.ToUpper(),
                        Modelo = vehiculo.modelo?.ToUpper(),
                        Status = "ACTIVO",
                    };
                    await ConexionBD.database.InsertAsync(vehi);
                }
            }

            if (parData.tieneExperiencia)
            {
                foreach (var experiencia in parData.experiencias)
                {
                    var exp = new ExperienciaVentas()
                    {
                        PersonaID = parData.prospectoID,
                        TipoPersonaID = 1,
                        EmpresaExperienciaID = experiencia.empresa,
                        FechaIngreso = DateTime.Parse(experiencia.fecha),
                        LimiteCredito = experiencia.limite,
                        CreditoDisponible = experiencia.dispo,
                        Status = "ACTIVO",
                    };
                    await ConexionBD.database.InsertAsync(exp);
                }
            }

            var Tuberia = new Tuberia()
            {
                PersonaID = parData.prospectoID,
                TipoPersonaID = 1,
                StatusProcesoID = 2,
                TuberiaResultadoID = 2,
                Validado = true,
                FechaRegistro = DateTime.Now,
                FechaValidacion = DateTime.Now,
                PersonaAnalistaID = (long)UsuarioActual.PersonaID,
                UsuarioAnalistaID = UsuarioActual.UsuarioID,
            };
            await ConexionBD.database.InsertAsync(Tuberia);
        }

        private async Task updateDatosEconomicos(DatosEconomicos parData, decimal ingresoMensual)
        {
            var validaProspecto = await ConexionBD.database.QueryAsync<Prospectos_VW>("WHERE ProspectoID=@0", parData.prospectoID).SingleOrDefaultAsync();
            var personaProspecto = await ConexionBD.database.SingleByIdAsync<Personas>(parData.prospectoID);
            if (validaProspecto.EstatusConsultaBuroID != 2)
                personaProspecto.RFC = parData.rfc?.ToUpper();
            personaProspecto.DependientesEconomicos = parData.dependientesEconomicos;
            personaProspecto.IngresosMensuales = ingresoMensual;
            await ConexionBD.database.UpdateAsync(personaProspecto);

            //INFO VIVIENDA
            var infoVivienda = await ConexionBD.database.QueryAsync<InformacionVivienda>("WHERE PersonaID=@0 AND TipoPersonaID = 1", parData.prospectoID).SingleOrDefaultAsync();
            infoVivienda.TipoViviendaID = parData.tipoViviendaID;
            infoVivienda.tieneOtraVivienda = parData.otraVivienda;
            infoVivienda.numeroPersonasHabitan = parData.habitantes;
            infoVivienda.valorAproximado = parData.valorAproxVivienda;
            await ConexionBD.database.UpdateAsync(infoVivienda);

            //OTRA VIVIEDA
            if (parData.otraVivienda)
            {
                var otraVivienda = await ConexionBD.database.QueryAsync<InformacionOtraVivienda>("WHERE PersonaID=@0 AND TipoPersonaID = 1", parData.prospectoID).SingleOrDefaultAsync();
                if (otraVivienda != null)
                {
                    otraVivienda.TipoViviendaID = parData.tipoOtraViviendaID;
                    otraVivienda.Calle = parData.calleOtraVivienda?.ToUpper();
                    otraVivienda.NumeroExterior = parData.numeroOtraVivienda?.ToUpper();
                    otraVivienda.NumeroInterior = "";
                    otraVivienda.AsentamientoID = parData.asentamientoIDOtra;
                    otraVivienda.localidad = parData.localidadOtraVivienda?.ToUpper();
                    otraVivienda.valorAproximado = parData.valorAproxOtra;
                    await ConexionBD.database.UpdateAsync(otraVivienda);
                }
                else
                {
                    var infoOtraVivienda = new InformacionOtraVivienda()
                    {
                        PersonaID = parData.prospectoID,
                        TipoPersonaID = 1,
                        TipoViviendaID = parData.tipoOtraViviendaID,
                        Calle = parData.calleOtraVivienda?.ToUpper(),
                        NumeroExterior = parData.numeroOtraVivienda?.ToUpper(),
                        NumeroInterior = "",
                        AsentamientoID = parData.asentamientoIDOtra,
                        localidad = parData.localidadOtraVivienda?.ToUpper(),
                        valorAproximado = parData.valorAproxOtra
                    };
                    await ConexionBD.database.InsertAsync(infoOtraVivienda);
                }
            }

            //INGRESOS
            var ingresos = await ConexionBD.database.QueryAsync<Ingresos>("WHERE PersonaID=@0 AND TipoPersonaID = 1", parData.prospectoID).SingleOrDefaultAsync();
            ingresos.ingresoSueldo = parData.ingresoSueldo;
            ingresos.gananciasDV = parData.ingresoGananciasDV;
            ingresos.ingresoConyuge = parData.ingresoConyuge;
            ingresos.otrosIngresos = parData.ingresoOtro;
            ingresos.ingresoTotal = ingresoMensual;
            await ConexionBD.database.UpdateAsync(ingresos);

            //EGRESOS
            var egresos = await ConexionBD.database.QueryAsync<Egresos>("WHERE PersonaID=@0 AND TipoPersonaID = 1", parData.prospectoID).SingleOrDefaultAsync();
            egresos.TipoViviendaID = parData.tipoViviendaID;
            egresos.Alimentacion = parData.egresoAlimentacion;
            egresos.TarjetaCreido = parData.egresotarjetas;
            egresos.RentaPagoVivienda = parData.egresoVivienda;
            egresos.ServiciosDomesticos = parData.egresoDomestico;
            egresos.Otros = parData.egresoOtros;
            egresos.EgresoTotal = (parData.egresoAlimentacion + parData.egresotarjetas + parData.egresoVivienda + parData.egresoDomestico + parData.egresoOtros);
            await ConexionBD.database.UpdateAsync(egresos);

            //VEHICULOS
            if (parData.tieneVehiculo)
            {
                var vehiculos = await ConexionBD.database.QueryAsync<RelacionAutoMoto>("WHERE PersonaID=@0 AND TipoPersonaID = 1", parData.prospectoID).ToArrayAsync();
                if (vehiculos.Length > 0)
                {
                    foreach (var vehiculo in vehiculos)
                        await ConexionBD.database.DeleteAsync(vehiculo);
                }
                foreach (var vehiculo in parData.vehiculos)
                {
                    var vehi = new RelacionAutoMoto()
                    {
                        PersonaID = parData.prospectoID,
                        TipoPersonaID = 1,
                        Marca = vehiculo.marca?.ToUpper(),
                        Modelo = vehiculo.modelo?.ToUpper(),
                        Status = "ACTIVO",
                    };
                    await ConexionBD.database.InsertAsync(vehi);
                }
            }
            else
            {
                var vehiculos = await ConexionBD.database.QueryAsync<RelacionAutoMoto>("WHERE PersonaID=@0 AND TipoPersonaID = 1", parData.prospectoID).ToArrayAsync();
                if (vehiculos.Length > 0)
                {
                    foreach (var vehiculo in vehiculos)
                        await ConexionBD.database.DeleteAsync(vehiculo);
                }
            }

            //EXPERIENCIA
            if (parData.tieneExperiencia)
            {
                var experiencias = await ConexionBD.database.QueryAsync<ExperienciaVentas>("WHERE PersonaID=@0 AND TipoPersonaID = 1", parData.prospectoID).ToArrayAsync();
                if (experiencias.Length > 0)
                {
                    foreach (var experiencia in experiencias)
                        await ConexionBD.database.DeleteAsync(experiencia);
                }
                foreach (var experiencia in parData.experiencias)
                {
                    var exp = new ExperienciaVentas()
                    {
                        PersonaID = parData.prospectoID,
                        TipoPersonaID = 1,
                        EmpresaExperienciaID = experiencia.empresa,
                        FechaIngreso = DateTime.ParseExact(experiencia.fecha, "dd/MM/yyyy", null),
                        LimiteCredito = experiencia.limite,
                        CreditoDisponible = experiencia.dispo,
                        Status = "ACTIVO",
                    };
                    await ConexionBD.database.InsertAsync(exp);
                }
            }
            else
            {
                var experiencias = await ConexionBD.database.QueryAsync<ExperienciaVentas>("WHERE PersonaID=@0 AND TipoPersonaID = 1", parData.prospectoID).ToArrayAsync();
                if (experiencias.Length > 0)
                {
                    foreach (var experiencia in experiencias)
                        await ConexionBD.database.DeleteAsync(experiencia);
                }
            }
        }

        [HttpPost]
        [Route("GetMesajesByProspectoID")]
        [Authorize]
        public async Task<IActionResult> GetMesajesByProspectoID(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.GetNotificaciones parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosApp_VW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var obj = new { parData.ProspectoID, UsuarioActual.UsuarioID };

                // var validaUser = await ConexionBD.database.QueryAsync<ProspectosAsignaciones_VW>("WHERE ProspectoID = @ProspectoID AND (AnalistaBuroUsuarioID = @UsuarioID OR AnalistaLlamadaUsuarioID = @UsuarioID OR AnalistaMesaUsuarioID = @UsuarioID) ", obj).FirstOrDefaultAsync();
                // if (validaUser == null)
                // {
                //     await ConexionBD.Destroy();
                //     return BadRequest($"El usuario actual no esta asignado a este Prospecto {parData.ProspectoID}");
                // }
                var Notificaciones = await ConexionBD.database.QueryAsync<LogMensajesApp_VW>("WHERE ProspectoID = @ProspectoID", obj)/*.OrderByDescending(x => x.LogMensajeID)*/.ToArrayAsync();
                await ConexionBD.Destroy();
                var resp = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = Notificaciones
                };
                return Ok(resp);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }
        [HttpPost]
        [Route("NotificacionLeida")]
        [Authorize]
        public async Task<IActionResult> NotificacionLeida(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.NotificacionLeida parData)
        {
            try
            {
                var obj = new { parData.ProspectoID };
                var validacion = await ConexionBD.database.QueryAsync<LogMensajesVW>("EXEC Prospeccion.pa_ActualizaMensajesMesa @ProspectoID", obj).FirstOrDefaultAsync();

                if (validacion.regresa == 1)
                {
                    await ConexionBD.Destroy();
                    return Ok(validacion);
                }
                else
                {
                    await ConexionBD.Destroy();
                    return BadRequest(validacion.msj);
                }
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("EnviarMsjPromotorSucursal")]
        [Authorize]
        public async Task<IActionResult> EnviarMsjPromotorSucursal(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.AddMsjSucursalPromotor parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosApp_VW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var obj = new { parData.ProspectoID, parData.Nota, UsuarioActual.UsuarioID, parData.TipoMesa };
                var validacion = await ConexionBD.database.QueryAsync<LogMensajesVW>("EXEC Prospeccion.pa_AgregarNota @ProspectoID, @Nota, 0, @UsuarioID, @TipoMesa", obj).FirstOrDefaultAsync();

                if (validacion.regresa == 1)
                {
                    await ConexionBD.Destroy();
                    var resp = new
                    {
                        resultCode = 0,
                        resultDesc = "OK.",
                        data = validacion
                    };
                    return Ok(resp);
                }
                else
                {
                    await ConexionBD.Destroy();
                    var resp = new
                    {
                        resultCode = 2,
                        resultDesc = validacion.msj.ToUpper().Replace("ERROR:", ""),
                        data = validacion
                    };

                    return Ok(resp);
                }
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("GetNotificaciones")]
        [Authorize]

        public async Task<IActionResult> GetNotificaciones(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.GetNotificacionesApp parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosApp_VW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                int ProductoID = parData.ProductoID;

                //var promotor = await ConexionBD.database.SingleByIdAsync<Promotores>(UsuarioActual.PersonaID);
                //  var RolID = 82;
                var esGerente = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios_Roles>("WHERE UsuarioID=@0 AND RolID=82", UsuarioActual.UsuarioID).ToArrayAsync();

                var promotor = await ConexionBD.database.QueryAsync<Promotores>("WHERE creditoPromotorId = @0 AND ProductoID = @1", UsuarioActual.PersonaID, ProductoID).FirstOrDefaultAsync();
                if (promotor == null & esGerente == null)
                {
                    throw new Exception($"ERROR, EL USUARIO ACTUAL ({UsuarioActual.PersonaID}) NO ES PROMOTOR EN ESTE PRODUCTO ({ProductoID})");
                }

                var query = "";
                if (esGerente.Length >= 1)
                    query = "WHERE ProductoID = @ProductoID AND ProspectoID = @ProspectoID";
                else
                    query = "WHERE PromotorUsuarioID = @UsuarioID AND ProspectoID = @ProspectoID AND ProductoID = @ProductoID";
                var obj = new { UsuarioActual.UsuarioID, parData.ProspectoID, ProductoID };

                var Notificaciones = await ConexionBD.database.QueryAsync<LogMensajesApp_VW>(query, obj)/*.OrderByDescending(x => x.LogMensajeID)*/.ToArrayAsync();

                var NotifNoLeidas = await ConexionBD.database.QueryAsync<LogMensajesApp_VW>("WHERE PromotorUsuarioID =@0 AND (Leido IS NULL OR Leido = 0) AND EnviadoDesdeMesa = 1 AND ProductoID = @1", UsuarioActual.UsuarioID, ProductoID).ToArrayAsync();

                var Prospectos = await ConexionBD.database.QueryAsync<LogMensajesNoLeidosProspectoApp_VW>("WHERE PromotorUsuarioID =@0 AND ProductoID = @1", UsuarioActual.UsuarioID, ProductoID).ToArrayAsync();
                await ConexionBD.Destroy();
                var response = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = Prospectos,
                    cantidad = NotifNoLeidas.Count(),

                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("GetProcesos")]
        [Authorize]
        public async Task<IActionResult> GetProcesos(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.GetProcesos parData)
        {
            var Procesos = await ConexionBD.database.QueryAsync<ProcesoProspecto>("EXEC Prospeccion.pa_Proceso_Prospecto @ProspectoID", parData).ToArrayAsync();
            await ConexionBD.Destroy();

            var res = new
            {
                resultCode = 0,
                resultDesc = "OK.",
                data = Procesos
            };

            return Ok(res);
        }

        [HttpPost]
        [Route("ValidarReferenciasAvales")]
        [Authorize]
        public async Task<IActionResult> ValidarReferenciasAvales(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.ValidarReferenciasAvales parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosApp_VW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var obj = new { parData.ProspectoID, UsuarioActual.UsuarioID };
                var validacion = await ConexionBD.database.QueryAsync<ModlesSP.Prospeccion.ValidarReferenciasAvales>("EXEC Prospeccion.pa_Validacion_ReferenciasAvalCaptura @ProspectoID, @UsuarioID", obj).FirstOrDefaultAsync();

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    //res = validacion.regresa,
                    msj = validacion.regresa == 1 ? $"Se Validó la captura de Referencias de los Avales del Prospecto {parData.ProspectoID} correctamente" : validacion.msj
                };
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
        [Route("ValidarDocumentosAvales")]
        [Authorize]
        public async Task<IActionResult> ValidarDocumentosAvales(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.ValidarDocumentosAvales parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosApp_VW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var obj = new { parData.ProspectoID, UsuarioActual.UsuarioID };
                var validacion = await ConexionBD.database.QueryAsync<Confirmar>("EXEC Prospeccion.pa_Validacion_DocumentosAvalCaptura @ProspectoID, @UsuarioID", obj).FirstOrDefaultAsync();

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    //res = validacion.regresa,
                    msj = validacion.regresa == 1 ? $"Se Validó la Subida de Documentos de lo Avales del Prospecto {parData.ProspectoID} correctamente" : validacion.msj
                };
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        //TODO: Verificacion CURP
        [HttpPost]
        [Route("verificarCURP")]
        [Authorize]
        public async Task<IActionResult> VerificarCURP(PeticionesRest.Prospeccion.Interesados.VerificarCURP parData)
        {
            try
            {
                var resp = new object();
                parData.CURP = parData.CURP.ToUpper();
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosApp_VW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new
                {
                    PromotorUsuarioID = UsuarioActual.UsuarioID,
                    parData.CURP
                };

                var data2 = await ConexionBD.database.QueryAsync<ProspectosApp_VW>("WHERE CURP = @CURP AND PromotorUsuarioID = @PromotorUsuarioID", obj).FirstOrDefaultAsync();

                //Encontramos la CURP
                if (data2 != null)
                {
                    resp = new
                    {
                        resultCode = 2,
                        resultDesc = "Este persona ya se encuentra registrada.",
                        data = new
                        {
                            Nombre = data2.Nombre,
                            ApellidoPaterno = data2.ApellidoPaterno,
                            ApellidoMaterno = data2.ApellidoMaterno,
                            FechaNacimiento = DateTime.Now.ToString("dd/MM/yyyy"),
                        }
                    };
                    await ConexionBD.Destroy();
                    return Ok(resp);
                }


                //Verificacion en curpConsultas
                _sqlConnection.Open();
                SqlCommand cmd = new SqlCommand("SELECT * FROM dbo.CurpConsultadas WHERE Curp = @CURP", _sqlConnection);
                cmd.Parameters.AddWithValue("@CURP", parData.CURP);
                SqlDataReader reader = await cmd.ExecuteReaderAsync();

                //Encontramos la CURP en CurpConsultadas
                if (reader.HasRows)
                {
                    string nombre = "";
                    string apellidoPaterno = "";
                    string apellidoMaterno = "";
                    string fechaNacimiento = "";

                    while (reader.Read())
                    {
                        nombre = reader["nombre"].ToString();
                        apellidoPaterno = reader["apellidoPaterno"].ToString();
                        apellidoMaterno = (reader["apellidoMaterno"] == DBNull.Value || reader["apellidoMaterno"] == null) ? "N/A" : reader["apellidoMaterno"].ToString();
                        fechaNacimiento = reader["fechaNacimiento"].ToString();
                    }

                    resp = new
                    {
                        resultCode = 0,
                        resultDesc = "OK.",
                        data = new
                        {
                            Nombre = nombre,
                            ApellidoPaterno = apellidoPaterno,
                            ApellidoMaterno = apellidoMaterno,
                            FechaNacimiento = DateTime.Parse(fechaNacimiento),
                        }
                    };

                    //Cerramos la conexion
                    await ConexionBD.Destroy();
                    reader.Close();
                    _sqlConnection.Close();
                    return Ok(resp);
                }
                //No encontramos la CURP
                else
                {

                    reader.Close();

                    string username = "";
                    string password = "";

                    //Obtenemos las credenciales
                    cmd = new SqlCommand("SELECT username, passwordd FROM dbo.LicenciaAPICURP;", _sqlConnection);
                    reader = await cmd.ExecuteReaderAsync();
                    while (reader.Read())
                    {
                        //TODO: Corregir el nombre de las columnas en la BD
                        username = reader["username"].ToString();
                        password = reader["passwordd"].ToString();
                    }
                    reader.Close();


                    //Implementar API Nubarium
                    var client = new HttpClient();
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic",
                    Convert.ToBase64String(Encoding.ASCII.GetBytes($"{username}:{password}")));
                    //
                    var response = await client.PostAsJsonAsync("https://curp.nubarium.com/renapo/v3/valida_curp", new { documento = "0", curp = parData.CURP });

                    if (response.IsSuccessStatusCode)
                    {

                        //Leemos la respuesta de la APIh
                        var result = await response.Content.ReadFromJsonAsync<RespuestaRenapo>();

                        if (result.codigoMensaje != "0")
                        {
                            resp = new
                            {
                                resultCode = 2,
                                resultDesc = "Esta CURP no es valida",
                                data = new
                                {
                                    Nombre = "",
                                    ApellidoPaterno = "",
                                    ApellidoMaterno = "",
                                    FechaNacimiento = "",
                                }
                            };
                            await ConexionBD.Destroy();
                            _sqlConnection.Close();
                            return Ok(resp);
                        }

                        if (result != null)
                        {

                            //Cerramos la conexion
                            reader.Close();

                            //Almacenar en la BD curpConsultas
                            cmd = new SqlCommand("INSERT INTO dbo.CurpConsultadas (estatus, codigoValidacion, " + "CURP, Nombre, ApellidoPaterno, ApellidoMaterno, sexo, fechaNacimiento, paisNacimiento," +
                            " estadoNacimiento, docProbatorio, entidadRegistro, tomo, claveMunicipioRegistro, anioReg, " +
                            "claveEntidadRegistro, foja, numActa, libro, municipioRegistro, estatusCurp, codigoMensaje) VALUES (@estatus, @codigoValidacion, " +
                            "@CURP, @Nombre, @ApellidoPaterno, @ApellidoMaterno, @sexo, @fechaNacimiento, @paisNacimiento," +
                            " @estadoNacimiento, @docProbatorio, @entidadRegistro, @tomo, @claveMunicipioRegistro, @anioReg, " +
                            "@claveEntidadRegistro, @foja, @numActa, @libro, @municipioRegistro, @estatusCurp, @codigoMensaje)", _sqlConnection);

                            cmd.Parameters.AddWithValue("@estatus", result.estatus);
                            cmd.Parameters.AddWithValue("@codigoValidacion", result.codigoValidacion);
                            cmd.Parameters.AddWithValue("@CURP", result.curp);
                            cmd.Parameters.AddWithValue("@Nombre", result.nombre);
                            cmd.Parameters.AddWithValue("@ApellidoPaterno", result.apellidoPaterno);
                            cmd.Parameters.AddWithValue("@ApellidoMaterno", result.apellidoMaterno);
                            cmd.Parameters.AddWithValue("@sexo", result.sexo);
                            cmd.Parameters.AddWithValue("@fechaNacimiento", result.fechaNacimiento);
                            cmd.Parameters.AddWithValue("@paisNacimiento", result.paisNacimiento);
                            cmd.Parameters.AddWithValue("@estadoNacimiento", result.estadoNacimiento);
                            cmd.Parameters.AddWithValue("@docProbatorio", result.docProbatorio);
                            cmd.Parameters.AddWithValue("@entidadRegistro", result.datosDocProbatorio.entidadRegistro);
                            cmd.Parameters.AddWithValue("@tomo", result.datosDocProbatorio.tomo);
                            cmd.Parameters.AddWithValue("@claveMunicipioRegistro", result.datosDocProbatorio.claveMunicipioRegistro);
                            cmd.Parameters.AddWithValue("@anioReg", result.datosDocProbatorio.anioReg);
                            cmd.Parameters.AddWithValue("@claveEntidadRegistro", result.datosDocProbatorio.claveEntidadRegistro);
                            cmd.Parameters.AddWithValue("@foja", result.datosDocProbatorio.foja);
                            cmd.Parameters.AddWithValue("@numActa", result.datosDocProbatorio.numActa);
                            cmd.Parameters.AddWithValue("@libro", result.datosDocProbatorio.libro);
                            cmd.Parameters.AddWithValue("@municipioRegistro", result.datosDocProbatorio.municipioRegistro);
                            cmd.Parameters.AddWithValue("@estatusCurp", result.estatusCurp);
                            cmd.Parameters.AddWithValue("@codigoMensaje", result.codigoMensaje);
                            await cmd.ExecuteNonQueryAsync();
                        }

                        resp = new
                        {
                            resultCode = 0,
                            resultDesc = "OK.",
                            data = new
                            {
                                Nombre = result.nombre,
                                ApellidoPaterno = result.apellidoPaterno,
                                ApellidoMaterno = result.apellidoMaterno == null ? "N/A" : result.apellidoMaterno,
                                FechaNacimiento = DateTime.Parse(result.fechaNacimiento),
                            }
                        };

                        await ConexionBD.Destroy();
                        _sqlConnection.Close();
                        return Ok(resp);
                    }
                    else
                    {
                        resp = new
                        {
                            resultCode = -1,
                            resultDesc = "Error al verificar la CURP",
                            data = new { error = "Error al verificar la CURP" }
                        };
                        await ConexionBD.Destroy();
                        _sqlConnection.Close();
                        return BadRequest(resp);
                    }
                }
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                _sqlConnection.Close();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { error = "Error al verificar la CURP" }
                });
            }
        }



    }

}