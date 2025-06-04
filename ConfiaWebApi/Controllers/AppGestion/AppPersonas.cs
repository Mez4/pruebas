using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Creditos;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using ConfiaWebApi.PeticionesRest.Prospeccion.Documentos;
using DBContext.DBConfia.Distribuidores;
using ConfiaWebApi.Code;
using System.IO;
using System.Collections;
using DBContext.DBConfia.Catalogos;

namespace ConfiaWebApi.Controllers.AppPersonas
{
    [Authorize]
    [ApiController]
    [Route("api/AppGestion/[controller]")]
    public class AppPersonasController : ControllerBase
    {
        private DBConfiaContext ConexionBD;
        private IConfiguration Configuracion;
        public AppPersonasController(DBConfiaContext _DBContext, IConfiguration _Configuration)
        {
            ConexionBD = _DBContext;
            Configuracion = _Configuration;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        public async Task<IActionResult> Get(PeticionesRest.Administracion.Personas.Get parData)
        {
            try
            {
                // Obtenemos nuestro productoId
                int ProductoID = 9999;
                int.TryParse(Request.Headers["ProductoID"], out ProductoID);

                if (parData.PersonaID != null)
                {

                    // Registro de persona
                    var persona = await ConexionBD.database.QueryAsync<DBContext.DBConfia.General.Personas_VW>("WHERE PersonaID=@0", parData.PersonaID).SingleOrDefaultAsync();
                    var creditos = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos_VW>("WHERE PersonaID=@0 AND EstatusID='P'", parData.PersonaID).ToArrayAsync();
                    if (creditos == null)
                    {
                        creditos = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos_VW>("WHERE PersonaID=@0 AND EstatusID='A'", parData.PersonaID).ToArrayAsync();

                    }
                    var cliente = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Clientes>("WHERE ClienteID = @0", parData.PersonaID).FirstOrDefaultAsync();

                    // Obtenemos los datos dynamicos de la persona
                    long[] personas_direcciones = null;
                    Direcciones_VW[] direcciones = null;
                    Empleos_VW[] empleos = null;
                    Creditos_VW[] contCreditos = null;

                    // Obtenemos los datos basicos
                    personas_direcciones = (await ConexionBD.database.QueryAsync<PersonasDirecciones>("WHERE PersonaID=@0", persona.PersonaID).ToArrayAsync()).Select(x => x.DireccionID).ToArray();
                    direcciones = await ConexionBD.database.QueryAsync<Direcciones_VW>("WHERE DireccionID IN(@0)", personas_direcciones).OrderByDescending(x => x.CreacionFecha).ToArrayAsync();
                    empleos = await ConexionBD.database.QueryAsync<Empleos_VW>("WHERE PersonaID=@0", persona.PersonaID).OrderByDescending(x => x.CreacionFecha).ToArrayAsync();
                    //creditos = await ConexionBD.database.QueryAsync<Creditos_VW>("WHERE PersonaID=@0", persona.PersonaID).ToArrayAsync();
                    contCreditos = await ConexionBD.database.QueryAsync<Creditos_VW>("SELECT TOP(5) * FROM Creditos.Creditos_VW WHERE (PersonaID=@0) order by CreditoID DESC", persona.PersonaID).ToArrayAsync();

                    // Obtenemos Documentos
                    parData.PersonaID = parData.PersonaID;
                    var documentos = await getIne(parData);

                    // Regresamos los datos a la UI
                    var resp = new
                    {
                        resultCode = 0,
                        resultDesc = "OK.",
                        data = new { persona, direcciones, empleos, documentos, creditos, contCreditos, cliente }
                    };

                    await ConexionBD.Destroy();
                    return Ok(resp);
                }
                else
                {
                    // Generamos un nuevo query para las personas
                    var query = NPoco.Sql.Builder.Select("PersonaID", "NombreCompleto", "RFC", "CURP", "DistribuidorID", "ClienteID", "CoordinadorID", "DistribuidoresEstatusID", "DistribuidoresEstatus", "TelefonoMovil", "FechaHoraRegistro").From("General.Personas_VW");

                    // Si tenemos la variable de nombre
                    if (!string.IsNullOrEmpty(parData.Nombre))
                        query = query.Where(
                            @"(
                            dbo.Levenshtein(UPPER(Nombre), UPPER(@0), 1) <= 1 OR Nombre LIKE '%' + UPPER(@0) + '%'
                            OR dbo.Levenshtein(UPPER(ApellidoPaterno), UPPER(@0), 1) <= 1 OR ApellidoPaterno LIKE '%' + UPPER(@0) + '%'
                            OR dbo.Levenshtein(UPPER(ApellidoMaterno), UPPER(@0), 1) <= 1 OR ApellidoMaterno LIKE '%' + UPPER(@0) + '%'
                            OR dbo.Levenshtein(UPPER(NombreCompleto), UPPER(@0), 3) <= 3 OR NombreCompleto LIKE '%' + UPPER(@0) + '%'
                        )", parData.Nombre);

                    // Si tenemos la variable de RFC
                    if (!string.IsNullOrEmpty(parData.RFC))
                        query = query.Where("dbo.Levenshtein(UPPER(RFC), UPPER(@0), 10) <= 1", parData.RFC);

                    // Si tenemos la variable de curp
                    if (!string.IsNullOrEmpty(parData.CURP))
                        query = query.Where("dbo.Levenshtein(UPPER(CURP), UPPER(@0), 10) <= 1", parData.CURP);

                    // Si tenemos la variable de sexo
                    if (parData.SexoID != null)
                        query = query.Where("SexoID = @0", parData.SexoID);

                    // Si tenemos la variable de ocupacion
                    if (parData.OcupacionID != null)
                        query = query.Where("OcupacionID = @0", parData.OcupacionID);

                    // Si tenemos la variable de escolaridad
                    if (parData.EscolaridadID != null)
                        query = query.Where("EscolaridadID = @0", parData.EscolaridadID);

                    // Si tenemos la variable de estado civil
                    if (parData.EstadoCivilID != null)
                        query = query.Where("EstadoCivilID = @0", parData.EstadoCivilID);

                    // Clientes
                    if (parData.Distribuidor != null)
                        query = query.Where("DistribuidorID IS NOT NULL AND DistribuidorID IN (SELECT subq.DistribuidorID FROM Distribuidores.Distribuidores_VW subq WHERE ProductoID = @0)", ProductoID);

                    // Distribuidor
                    if (parData.Cliente != null)
                        query = query.Where("ClienteID IS NOT NULL AND ClienteID IN (SELECT subq.PersonaID FROM Distribuidores.Clientes subq WHERE ProductoID = @0)", ProductoID);

                    // Coordinadores
                    if (parData.Coordinador != null)
                        query = query.Where("- IN (SELECT subq.CoordinadorID FROM Creditos.Grupos subq WHERE ProductoID = @0)", ProductoID);

                    // Prospectos
                    if (parData.Prospecto != null)
                        query = query.Where("ProspectoID IS NOT NULL AND ProspectoID IN (SELECT subq.ProspectoID FROM Prospeccion.Prospectos subq WHERE ProductoID = @0", ProductoID);

                    if (parData.Sac == true)
                        query = query.Where("SACId IS NOT NULL");

                    // Validamos nuestra peticion
                    var data = await ConexionBD.database.QueryAsync<Personas_VW>(query).ToArrayAsync();

                    var resp = new
                    {
                        resultCode = 0,
                        resultDesc = "OK.",
                        data
                    };

                    await ConexionBD.Destroy();
                    return Ok(resp);
                }
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { error = "Error al obtener info " }
                });
            }
        }

        [HttpPost]
        [Route("cancelartemp")]
        [Authorize]
        //[Code.TProteccionProducto]
        public async Task<IActionResult> CancelarTemp(PeticionesRest.Distribuidores.Distribuidor.CancelarTemp parData)
        {
            try
            {
                var Distribuidor = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Distribuidores.Distribuidores>(parData.Id);
                Distribuidor.DistribuidoresEstatusID = "T";
                await ConexionBD.database.UpdateAsync(Distribuidor);
                var resp = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    Distribuidor
                };

                await ConexionBD.Destroy();
                return Ok(resp);

            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { error = "Error al obtener info " }
                });
            }
        }

        [HttpPost]
        [Route("activar")]
        [Authorize]
        //[Code.TProteccionProducto]
        public async Task<IActionResult> Activar(PeticionesRest.Distribuidores.Distribuidor.CancelarTemp parData)
        {
            try
            {
                var Distribuidor = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Distribuidores.Distribuidores>(parData.Id);
                Distribuidor.DistribuidoresEstatusID = "N";
                await ConexionBD.database.UpdateAsync(Distribuidor);
                var resp = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    Distribuidor
                };

                await ConexionBD.Destroy();
                return Ok(resp);

            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { error = "Error al obtener info " }
                });
            }
        }

        [Consumes("multipart/form-data")]
        [HttpPost]
        [Route("subirExpediente")]
        [Authorize]
        //[Code.TProteccionProducto]
        public async Task<IActionResult> SubirExpediente([FromForm] ConfiaWebApi.PeticionesRest.Distribuidores.Distribuidor.UploadFile parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var DocValida = new SolicitudFallecida();
                if (parData.SolicitudID > 0)
                {
                    DocValida = await ConexionBD.database.SingleByIdAsync<SolicitudFallecida>(parData.SolicitudID);
                    if (DocValida.Autorizado == true)
                    {
                        await ConexionBD.Destroy();
                        return BadRequest("Este Documento ya fue validado");
                    }
                }

                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                var basicToken = Convert.ToBase64String(plainTextBytes);
                string path = $"{Configuracion["BucketApi:AwsPath_DocsExpediente"]}/{parData.DistribuidorID}";
                var ext = Path.GetExtension(parData.doc.FileName);
                string file_name = $"{parData.DistribuidorID}{ext}";
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
                        var Consulta = await ConexionBD.database.QueryAsync<SolicitudFallecida>("WHERE DistribuidorID = @0", parData.DistribuidorID).FirstOrDefaultAsync();
                        if (Consulta == null)
                        {
                            var Solicitud = new SolicitudFallecida()
                            {
                                DistribuidorID = parData.DistribuidorID,
                                Ruta = $"{path}/{file_name}",
                                Observaciones = parData.Observaciones == "" ? null : parData.Observaciones,
                                UsuarioRegistraID = UsuarioActual.UsuarioID,
                                PersonaRegistraID = (long)UsuarioActual.PersonaID,
                                FechaRegistra = DateTime.Now
                            };
                            await ConexionBD.database.InsertAsync(Solicitud);
                            DocumentoIDAux = Solicitud.SolicitudID;

                            await ConexionBD.Destroy();
                            return Ok("Documento Guardado Correctamente");


                        }
                        else
                        {
                            var Consulta2 = await ConexionBD.database.QueryAsync<SolicitudFallecida>("WHERE DistribuidorID = @0", parData.DistribuidorID).SingleOrDefaultAsync();
                            Consulta2.Ruta = $"{path}/{file_name}";
                            Consulta2.Observaciones = parData.Observaciones == "" ? null : parData.Observaciones;
                            Consulta2.UsuarioRegistraID = UsuarioActual.UsuarioID;
                            Consulta2.PersonaRegistraID = (long)UsuarioActual.PersonaID;
                            Consulta2.FechaRegistra = DateTime.Now;
                            await ConexionBD.database.UpdateAsync(Consulta2);

                            await ConexionBD.Destroy();
                            return Ok("Documento Actualizado Correctamente");
                        }


                    }
                    else
                    {
                        await ConexionBD.Destroy();
                        return BadRequest(response.StatusCode);
                    }
                }
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { error = "Error al cargar el documento" }
                });
            }
        }

        protected async Task<object> getIne(PeticionesRest.Administracion.Personas.Get parData)
        {
            ConexionBD.database.BeginTransaction();
            var docs = await ConexionBD.database.QueryAsync<PersonasDoc>("WHERE PersonaID=@0 ", parData.PersonaID).ToArrayAsync();

            // Obtenemos Documentos
            var ine = ""; //String.Format("{0}://{1}{2}/wwwroot/Archivos/FirmaDistribuidor/{3}", Request.Scheme, Request.Host, Request.PathBase, "ine.png");
            var firma = ""; //String.Format("{0}://{1}{2}/wwwroot/Archivos/FirmaDistribuidor/{3}", Request.Scheme, Request.Host, Request.PathBase, "firma.png");
            var flag = 1;

            foreach (var item in docs)
            {

                if (item.TiposDocumentoID == 1)
                {
                    ConexionBD.database.BeginTransaction();
                    var DocTipos = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Catalogos.TipoDocumento>("SELECT * FROM General.PersonasDoc pd INNER JOIN Catalogos.TipoDocumento td  ON pd.TiposDocumentoID = td.TipoDocumentoID  WHERE pd.PersonasDocID =  @0 ", item.PersonasDocID);

                    foreach (var item2 in DocTipos)
                    {
                        if (item2.Clave != "D042")
                        {
                            var Documento = await ConexionBD.database.SingleByIdAsync<PersonasDoc>(item.PersonasDocID);
                            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                            var basicToken = Convert.ToBase64String(plainTextBytes);
                            using (var client = new HttpClient())
                            {
                                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicToken); ;
                                var response = await client.GetAsync($"{Configuracion["BucketApi:url"]}{Configuracion["BucketApi:getRequest"]}?expireIn=1&path={Documento.RutaDoc}");
                                if (response.IsSuccessStatusCode)
                                {
                                    var jsonString = await response.Content.ReadAsStringAsync();
                                    var request = JsonConvert.DeserializeObject<BucketGet>(jsonString);
                                    ine = request.url;
                                }
                                else
                                {
                                    // return BadRequest(response.StatusCode);
                                    return 0;
                                    throw new Exception("Error al obtener el Documento"); ;
                                }
                            }

                            ine = $"{ine}";

                        }
                        ConexionBD.database.CompleteTransaction();
                    }

                }
                if (item.TiposDocumentoID == 8)
                {
                    ConexionBD.database.BeginTransaction();

                    var DocTipos = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Catalogos.TipoDocumento>("SELECT * FROM General.PersonasDoc pd INNER JOIN Catalogos.TipoDocumento td  ON pd.TiposDocumentoID = td.TipoDocumentoID  WHERE pd.PersonasDocID =  @0 ", item.PersonasDocID);
                    foreach (var item2 in DocTipos)
                    {
                        if (item2.Clave != "D042")
                        {
                            var Documento = await ConexionBD.database.SingleByIdAsync<PersonasDoc>(item.PersonasDocID);
                            var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                            var basicToken = Convert.ToBase64String(plainTextBytes);
                            using (var client = new HttpClient())
                            {
                                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicToken); ;
                                var response = await client.GetAsync($"{Configuracion["BucketApi:url"]}{Configuracion["BucketApi:getRequest"]}?expireIn=1&path={Documento.RutaDoc}");
                                if (response.IsSuccessStatusCode)
                                {
                                    var jsonString = await response.Content.ReadAsStringAsync();
                                    var request = JsonConvert.DeserializeObject<BucketGet>(jsonString);
                                    firma = request.url;
                                }
                                else
                                {
                                    // return BadRequest(response.StatusCode);
                                    return 0;
                                    throw new Exception("Error al obtener el Documento"); ;
                                }
                            }
                            firma = $"{firma}";
                        }
                        ConexionBD.database.CompleteTransaction();
                    }

                }
            }


            if (ine == "" && firma == "")
            {
                ine = "/images/noimagen.png";
                firma = "/images/noimagen.png";
                flag = 4;
                var documentos = new { ine, firma, flag };
                ConexionBD.database.CompleteTransaction();
                await ConexionBD.Destroy();
                return documentos;

            }
            if (ine == "")
            {
                ine = "/images/noimagen.png";
                // firma;
                flag = 2;
                var documentos = new { ine, firma, flag };
                ConexionBD.database.CompleteTransaction();
                await ConexionBD.Destroy();
                return documentos;

            }

            if (firma == "")
            {
                // ine = ine;
                firma = "/images/noimagen.png";
                flag = 3;
                var documentos = new { ine, firma, flag };
                ConexionBD.database.CompleteTransaction();
                await ConexionBD.Destroy();
                return documentos;

            }
            else
            {
                var documentos = new { ine, firma, flag };
                ConexionBD.database.CompleteTransaction();
                await ConexionBD.Destroy();
                return documentos;
            }
        }

        [HttpGet]
        [Route("getOcupaciones")]
        [Authorize]
        public async Task<IActionResult> GetOcupaciones()
        {
            try
            {

                var Ocupaciones = await ConexionBD.database.FetchAsync<Ocupaciones>();

                var data = new ArrayList();

                foreach (var Ocupacion in Ocupaciones)
                {
                    data.Add(new
                    {
                        ocupacionId = Ocupacion.Id,
                        ocupacionDesc = Ocupacion.Ocupacion
                    });
                }

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                await ConexionBD.Destroy();

                return Ok(res);

            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }
        }

        [HttpPost]
        [Route("AddDireccion")]
        [Authorize]
        //[Code.TProteccionProducto]
        public async Task<IActionResult> AddDireccion(PeticionesRest.Administracion.Personas.AgregarDireccionPersona parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            try
            {
                ConexionBD.database.BeginTransaction();


                var asentamiento = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Catalogos.Asentamientos>("WHERE AsentamientoID=@0", parData.DireccionPersona_AsentamientoID).FirstOrDefaultAsync();

                var Direccion = new DBContext.DBConfia.General.Direcciones()
                {
                    // DireccionID
                    vialidadTipoId = parData.DireccionPersona_vialidadTipoId,
                    orientacionVialidadTipoId = parData.DireccionPersona_orientacionVialidadTipoId,
                    AsentamientoID = parData.DireccionPersona_AsentamientoID,
                    NombreVialidad = parData.DireccionPersona_NombreVialidad,
                    NumeroExterior = parData.DireccionPersona_NumeroExterior,
                    NumeroInterior = parData.DireccionPersona_NumeroInterior,
                    ReferenciasGeograficas = "",
                    ViviendaTipoId = parData.DireccionPersona_ViviendaTipoId,
                    CreacionFecha = DateTime.Now,
                    CreacionPersonaID = (long)UsuarioActual.PersonaID,
                    codigoPostal = asentamiento.CodigoPostal.ToString(),
                    CreacionUsuarioID = UsuarioActual.UsuarioID,
                };

                await ConexionBD.database.InsertAsync(Direccion);
                // PersonasDirecciones

                var PersonaDireccion = new DBContext.DBConfia.General.PersonasDirecciones()
                {
                    PersonaID = parData.PersonaID,
                    DireccionID = Direccion.DireccionID
                };
                await ConexionBD.database.InsertAsync(PersonaDireccion);

                ConexionBD.database.CompleteTransaction();

                var Data = await ConexionBD.database.QueryAsync<Direcciones_VW>("WHERE DireccionID=@0", PersonaDireccion.DireccionID).SingleOrDefaultAsync();

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "Se creó la Dirección (persona) con el id:" + PersonaDireccion.DireccionID,
                    Data
                };
                await ConexionBD.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                ConexionBD.database.AbortTransaction();
                return BadRequest("ERROR AL GUARDAR LA PERSONA: " + ex.Message);
            }
        }

        [HttpPost]
        [Route("AddEmpleo")]
        [Authorize]
        //[Code.TProteccionProducto]
        public async Task<IActionResult> AddEmpleo(PeticionesRest.Administracion.Personas.AgregarEmpleoPersona parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            try
            {
                ConexionBD.database.BeginTransaction();


                var asentamientoLaboral = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Catalogos.Asentamientos>("WHERE AsentamientoID=@0", parData.DireccionLaboral_AsentamientoID).FirstOrDefaultAsync();

                var DireccionLaboral = new DBContext.DBConfia.General.Direcciones()
                {
                    // DireccionID
                    vialidadTipoId = parData.DireccionLaboral_vialidadTipoId,
                    orientacionVialidadTipoId = parData.DireccionLaboral_orientacionVialidadTipoId,
                    AsentamientoID = parData.DireccionLaboral_AsentamientoID,
                    NombreVialidad = parData.DireccionLaboral_NombreVialidad,
                    NumeroExterior = parData.DireccionLaboral_NumeroExterior,
                    NumeroInterior = parData.DireccionLaboral_NumeroInteriorLaboral,
                    ReferenciasGeograficas = "",
                    ViviendaTipoId = parData.DireccionLaboral_viviendaTipoId,
                    CreacionFecha = DateTime.Now,
                    CreacionPersonaID = (long)UsuarioActual.PersonaID,
                    codigoPostal = asentamientoLaboral.CodigoPostal.ToString(),
                    CreacionUsuarioID = UsuarioActual.UsuarioID,
                };

                await ConexionBD.database.InsertAsync(DireccionLaboral);

                var ocupacion = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Catalogos.Ocupaciones>("WHERE Id=@0", parData.Laboral_OcupacionID).FirstOrDefaultAsync();


                var Empleo = new DBContext.DBConfia.General.Empleos()
                {
                    //   EmpleoID
                    PersonaID = parData.PersonaID,
                    OcupacionID = parData.Laboral_OcupacionID,
                    Empresa = parData.Laboral_Empresa,
                    Puesto = ocupacion.Ocupacion,
                    Telefono = parData.Laboral_Telefono,
                    DireccionID = DireccionLaboral.DireccionID,
                    FechaIngreso = DateTime.Now,
                    //   FechaTermino = null,
                    SueldoMensual = parData.Laboral_SueldoMensual,
                    Activo = true,
                    CreacionFecha = DateTime.Now,
                    CreacionPersonaID = (long)UsuarioActual.PersonaID,
                    CreacionUsuarioID = UsuarioActual.UsuarioID,
                };
                await ConexionBD.database.InsertAsync(Empleo);


                ConexionBD.database.CompleteTransaction();
                var Data = await ConexionBD.database.QueryAsync<Empleos_VW>("WHERE EmpleoID=@0", Empleo.EmpleoID).SingleOrDefaultAsync();
                var res = new
                {
                    resultCode = 0,
                    resultDesc = "Se creó la persona (Empleo) con el id: ",
                    Data
                };
                await ConexionBD.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                ConexionBD.database.AbortTransaction();
                return BadRequest("ERROR AL GUARDAR LA PERSONA: " + ex.Message);
            }
        }
    }
}