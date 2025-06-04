using ConfiaWebApi.Code;
using ConfiaWebApi.PeticionesRest.Cobranza.RelacionMesaCreditoProducto;
using DBContext.DBConfia;
using DBContext.DBConfia.Catalogos;
using DBContext.DBConfia.Cobranza;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.General;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.Cobranza
{

    [Authorize]
    [ApiController]
    [Route("api/Cobranza/[controller]")]

    public class CarteraGestoresController : ControllerBase
    {
        private DBConfiaContext DBContext;
        private IConfiguration Configuracion;
        private readonly SqlConnection sqlConnection;

        public CarteraGestoresController(IConfiguration _Configuration, DBConfiaContext _DBContext)

        {
            this.Configuracion = _Configuration;
            DBContext = _DBContext;

            IConfiguration Configuration;

            Configuration = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json", false, true)
                .Build();

            var sqlServerConfig = Configuration.GetSection("ConnectionStrings");
            string conn = sqlServerConfig["BDVR_Notificaciones"];

            sqlConnection = new(conn);
        }


        [HttpPost]
        [Route("getGestoresDistribuidores")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Cobranza.CarteraGestores.getGestoresDistribuidores parData)
        {
            try
            {
                var obj = new { GestorID = parData.GestorID, ProductoID = parData.ProductoID };
                var res = await DBContext.database.FetchAsync<RelacionGestoresDistribuidores_VW>("WHERE GestorID = @GestorID AND (Activo = 1 OR ConvenioID IS NOT NULL) AND ProductoID = @ProductoID AND ProductoIDGrupo = @ProductoID ORDER BY SucursalID, ClasificadorGrupoID DESC", obj);

                List<object> respList = new List<object>();
                int i = 0;
                for (i = 0; i < res.Count; i++)
                {
                    var resultado = new
                    {
                        GestorID = res[i].GestorID,
                        DistribuidorID = res[i].DistribuidorID,
                        DistribuidorDesc = res[i].DistribuidorDesc,
                        SucursalID = res[i].SucursalID,
                        SucursaDesc = res[i].SucursaDesc,
                        Grupo = res[i].Grupo,
                        FechaAsignacion = res[i].FechaAsignacion.ToString("dd/MM/yyyy"),
                        DiasAtrasoAsignado = res[i].DiasAtrasoAsignado,
                        DiasAtraso = res[i].DiasAtraso,
                        TelefonoMovil = res[i].TelefonoMovil,
                        //TicketID = res[i].TicketID,
                        //Direccion = res[i].Direccion,
                        SaldoAtrasado = res[i].SaldoAtrasado,
                        ClasificadorGrupoID = res[i].ClasificadorGrupoID,
                        FechaFiltro = res[i].FechaAsignacion,
                        Sucursal = res[i].SucursaDesc,
                        ColorTicket = res[i].ColorTicket,
                        ColorReferencias = res[i].ColorReferencias,
                        ColorReferenciasAvales = res[i].ColorReferenciasAvales,
                        ColorEstConv = res[i].ColorEstConv,
                        SaldoActual = res[i].SaldoActual,
                        ConvenioID = res[i].ConvenioID,
                    };
                    respList.Add(resultado);
                }
                await DBContext.Destroy();
                return Ok(respList);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("DistribuidoresClientes")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Cobranza.CarteraGestores.getDistribuidoresClientes parData)
        {
            try
            {
                var obj = new { DistribuidorID = parData.DistribuidorID, ProductoID = parData.ProductoID };
                var res = await DBContext.database.FetchAsync<RelacionDistribuidoresClientes_VW>("WHERE DistribuidorID = @DistribuidorID AND EstatusID = 'A' AND ProductoID = @ProductoID", obj);

                List<object> respList = new List<object>();
                int i = 0;
                for (i = 0; i < res.Count; i++)
                {
                    var resultado = new
                    {
                        DistribuidorID = res[i].DistribuidorID,
                        DistribuidorDesc = res[i].DistribuidorDesc,
                        ClienteID = res[i].ClienteID,
                        ClienteDesc = res[i].ClienteDesc,
                        FechaAsignacion = res[i].FechaAsignacion.ToString("dd/MM/yyyy"),
                        TelefonoMovil = res[i].TelefonoMovil,
                        Direccion = res[i].Direccion,
                        ContratoID = res[i].ContratoID,
                        DiasAtraso = res[i].DiasAtraso,
                        SaldoActual = res[i].SaldoActual,
                        SaldoAtrasado = res[i].SaldoAtrasado,
                        ProductoID = res[i].ProductoID,
                        CreditoID = res[i].CreditoID

                    };
                    respList.Add(resultado);
                }
                await DBContext.Destroy();
                return Ok(respList);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("getPersonas")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Cobranza.CarteraGestores.getPersonas parData)
        {
            try
            {
                var obj = new { PersonaID = parData.PersonaID };
                var res = await DBContext.database.FetchAsync<Personas>("Select * from General.Personas WITH (NOLOCK) WHERE PersonaID = @PersonaID", obj);

                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        //[HttpPost]
        //[Route("getGestores")]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        //public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Cobranza.CarteraGestores.getGestores parData)
        //{
        //    try
        //    {
        //        var obj = new { DistribuidorID = parData.DistribuidorID, ProductoID = parData.ProductoID };
        //        var res = await DBContext.database.FetchAsync<RelacionGestoresDistribuidores_VW>("WHERE DistribuidorID = @DistribuidorID AND ProductoID = @ProductoID", obj);

        //        await DBContext.Destroy();
        //        return Ok(res);
        //    }
        //    catch (Exception ex)
        //    {
        //        await DBContext.Destroy();
        //        return BadRequest(ex.Message);
        //    }
        //}

        [Consumes("multipart/form-data")]
        [HttpPost]
        [Route("subirTicket")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> SubirExpediente([FromForm] ConfiaWebApi.PeticionesRest.Cobranza.CarteraGestores.UploadFile parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                if (parData.doc == null)
                {
                    return BadRequest("Error: DEBE SUBIR UN TICKET");
                }
                //var TicketValida = new DistribuidoresTicket();
                //if (parData.DocumentoID > 0)
                //{
                //    DocValida = await DBContext.database.SingleByIdAsync<Documentos>(parData.DocumentoID); ;
                //    if (DocValida.Autorizado == true)
                //        return BadRequest("Este Documento ya fue validado por Mesa de Crédito y no puede ser actualizado");
                //}

                //Random rand = new Random();

                //int numero = rand.Next(26);

                //char letra = (char)(((int)'A') + numero);

                var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                var Charsarr = new char[8];
                var random = new Random();

                for (int i = 0; i < Charsarr.Length; i++)
                {
                    Charsarr[i] = characters[random.Next(characters.Length)];
                }

                var resultString = new String(Charsarr);

                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                var basicToken = Convert.ToBase64String(plainTextBytes);
                string path = $"{Configuracion["BucketApi:AwsPath_Ticket"]}/{parData.DistribuidorID}";
                var ext = Path.GetExtension(parData.doc.FileName);
                string file_name = $"{resultString}{ext}";
                byte[] file_byte = FilesManager.ConvertFiletoByteArray(parData.doc);

                //long DocumentoIDAux = 0;

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

                        try
                        {

                            //var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                            //var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                            int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
                            var obj = new { Usu = UsuarioActual.UsuarioID, PersonaID = UsuarioActual.PersonaID, DistribuidorID = parData.DistribuidorID, GestorID = parData.GestorID, TicketID = parData.TicketID, Monto = parData.Monto, UltRelacionImporte = parData.UltRelacionImporte, Ruta = $"{path}/{file_name}", ProductoID = ProductoID, FechaCorte = parData.FechaCorte, regresa = parData.regresa, msj = parData.msj };
                            var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Cobranza.spSubirTicket>("EXEC Cobranza.SubirTicket @Usu, @PersonaID, @DistribuidorID, @GestorID, @TicketID, @Ruta,  @Monto, @UltRelacionImporte, @ProductoID, @FechaCorte, @regresa, @msj", obj).FirstOrDefaultAsync();

                            //var TicketID2 = res.TicketID2;
                            //string file_namee = $"{parData.DistribuidorID}_{TicketID2}{ext}";

                            //var Ticket = await DBContext.database.SingleByIdAsync<DistribuidoresTicket>(TicketID2);
                            //Ticket.Ruta = $"{path}/{file_name}";
                            //await DBContext.database.UpdateAsync(Ticket);
                            //var res = await DBContext.database.FetchAsync<DistribuidoresTicket>("WHERE TicketID = @TicketID", obj);
                            //await DBContext.Destroy();
                            //return Ok(res);
                            await DBContext.Destroy();

                            if (res.regresa == 1)
                            {
                                //var resultado = new
                                //{

                                //    GestorID = res.GestorID,
                                //    GestorDesc = res.GestorDesc,
                                //    DistribuidorID = parData.DistribuidorID,
                                //    DistribuidorDesc = res.DistribuidorDesc,
                                //    SucursalID = res.SucursalID,
                                //    Sucursal = res.Sucursal,
                                //    Grupo = res.Grupo,
                                //    ClasificadorGrupoID = res.ClasificadorGrupoID,
                                //    FechaAsignacion = res.FechaAsignacion.ToString("dd/MM/yyyy"),
                                //    DiasAtrasoAsignado = res.DiasAtrasoAsignado,
                                //    DiasAtraso = res.DiasAtraso,
                                //    ProductoID = res.ProductoID,
                                //    TelefonoMovil = res.TelefonoMovil,
                                //    SaldoAtrasado = res.SaldoAtrasado,
                                //    Activo = res.Activo,
                                //    ColorTicket = res.ColorTicket,
                                //    ColorReferencias = res.ColorReferencias,
                                //    ColorReferenciasAvales = res.ColorReferenciasAvales,
                                //    regresa = res.regresa,
                                //    msj = res.msj


                                //    //TicketID = res.TicketID,
                                //    //DistribuidorID = res.DistribuidorID,
                                //    //Ruta = res.Ruta,
                                //    //FechaRegistro = res.FechaRegistro.ToString("dd/MM/yyyy"),
                                //    //Activo = res.Activo,
                                //    //regresa = res.regresa,
                                //    //msj = res.msj
                                //};
                                await DBContext.Destroy();
                                return Ok(res);
                            }

                            await DBContext.Destroy();
                            return BadRequest(res.msj);
                        }
                        catch (Exception ex)
                        {
                            await DBContext.Destroy();
                            return BadRequest(ex.Message);
                        }


                        //if (parData.TicketID == 0)
                        //{
                        //    var Ticket = new DistribuidoresTicket()
                        //    {
                        //        DistribuidorID = parData.DistribuidorID,
                        //        Ruta = $"{path}/{file_name}",
                        //    };
                        //    await DBContext.database.InsertAsync<DistribuidoresTicket>(Ticket);
                        //    DocumentoIDAux = Ticket.TicketID;

                        //    var Bitacora = new Bitacora { Usuario = UsuarioActual.UsuarioID, UsuarioPersona = Convert.ToInt32(UsuarioActual.PersonaID), Clave = "TIK00", Fecha = DateTime.Now, DistribuidorID = parData.DistribuidorID };
                        //    await DBContext.database.InsertAsync<Bitacora>(Bitacora);
                        //}
                        //else
                        //{
                        //    //var Documento = await ConexionBD.database.SingleByIdAsync<Documentos>(parData.DocumentoID);
                        //    var Ticket = TicketValida;
                        //    Ticket.DistribuidorID = parData.DistribuidorID;
                        //    Ticket.Ruta = $"{path}/{file_name}";
                        //    Ticket.TicketID = parData.TicketID;
                        //    await DBContext.database.UpdateAsync(Ticket);
                        //    DocumentoIDAux = Ticket.TicketID;

                        //    var Bitacora = new Bitacora { Usuario = UsuarioActual.UsuarioID, UsuarioPersona = Convert.ToInt32(UsuarioActual.PersonaID), Clave = "TIKU0", Fecha = DateTime.Now, DistribuidorID = parData.DistribuidorID };
                        //    await DBContext.database.InsertAsync<Bitacora>(Bitacora);

                        //}
                    }
                    else
                    {
                        await DBContext.Destroy();
                        return BadRequest(response.StatusCode);
                    }
                }
            }

            //    int TicketID;
            //    string Ruta;

            //    var ticket = await DBContext.database.FetchAsync<DistribuidoresTicket>("WHERE DistribuidorID = @DistribuidorID ", parData);
            //    TicketID = ticket[0].TicketID; Ruta = ticket[0].Ruta;
            //    //return Ok(res);

            //    var res = new
            //    {
            //        GestorID = parData.GestorID,
            //        DistribuidorID = parData.DistribuidorID,
            //        DistribuidorDesc = parData.DistribuidorDesc,
            //        //SucursaDesc = parData.SucursaDesc,
            //        Grupo = parData.Grupo,
            //        FechaAsignacion = parData.FechaAsignacion.ToString("dd/MM/yyyy"),
            //        DiasAtrasoAsignado = parData.DiasAtrasoAsignado,
            //        DiasAtraso = parData.DiasAtraso,
            //        TelefonoMovil = parData.TelefonoMovil,
            //        TicketID = TicketID,
            //        Direccion = parData.Direccion,
            //        SaldoAtrasado = parData.SaldoAtrasado,
            //        Ruta = Ruta,
            //    };

            //    return Ok(res);
            //}
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }



        [HttpPost]
        [Route("GetVerTicket")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> GetDoc(ConfiaWebApi.PeticionesRest.Cobranza.CarteraGestores.GetVerTicket parData)
        {
            try
            {
                var src = "";
                var Ticket = await DBContext.database.QueryAsync<DistribuidoresTicket>("WHERE  (TicketID = @TicketID)", parData).LastOrDefaultAsync();

                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                var basicToken = Convert.ToBase64String(plainTextBytes);
                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicToken); ;
                    var response = await client.GetAsync($"{Configuracion["BucketApi:url"]}{Configuracion["BucketApi:getRequest"]}?expireIn=1&path={Ticket.Ruta}");
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
                Console.WriteLine(Ticket.Ruta);
                var res = new
                {
                    res = 1,
                    msj = $"Consulta correcta del documento {parData.TicketID}",
                    src = $"{src}",
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
        [Route("getGestoresinex")]
        [Authorize]
        [Code.TProteccionProducto]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        //[ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> getGestoresinex(ConfiaWebApi.PeticionesRest.Cobranza.CarteraGestores.getGestoresinex parData)
        {

            try
            {
                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, PersonaID = UsuarioActual.PersonaID, ProductoID = ProductoID };

                // var usuario = await DBContext.database.FetchAsync<DBContext.DBConfia.Seguridad.UsuariosPersonasPuestosVW>("WHERE UsuarioID = @Usu AND PuestoCV = 129", obj);
                var usuario = await DBContext.database.FetchAsync<DBContext.DBConfia.Seguridad.UsuariosPersonasPuestosVW>("WHERE UsuarioID = @Usu AND EsDirector = 1 AND Ocupacion IS NULL", obj);

                if (usuario.Count > 0)
                {
                    var res = await DBContext.database.FetchAsync<DBContext.DBConfia.Cobranza.EncargadosMesasCobranza_VW>("WHERE ProductoID = @ProductoID AND ProductoIDGrupo = @ProductoID", obj);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                else
                {
                    var Encargado = await DBContext.database.FetchAsync<DBContext.DBConfia.Cobranza.EncargadosMesasCobranza_VW>("WHERE Encargado = @PersonaID AND Activo = 1 AND ProductoID = @ProductoID AND ProductoIDGrupo = @ProductoID", obj);

                    if (Encargado.Count > 0)
                    {
                        var res = await DBContext.database.FetchAsync<DBContext.DBConfia.Cobranza.EncargadosMesasCobranza_VW>("WHERE Encargado = @PersonaID AND Activo = 1 AND ProductoID = @ProductoID AND ProductoIDGrupo = @ProductoID", obj);
                        await DBContext.Destroy();
                        return Ok(res);
                    }
                    else
                    {
                        var res = await DBContext.database.FetchAsync<DBContext.DBConfia.Cobranza.EncargadosMesasCobranza_VW>("WHERE GestorCobranzaID = @PersonaID AND Activo = 1 AND ProductoID = @ProductoID AND ProductoIDGrupo = @ProductoID", obj);
                        await DBContext.Destroy();
                        return Ok(res);
                    }
                }
            }

            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("getListaTicket")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Cobranza.CarteraGestores.getListaTicket parData)
        {
            try
            {
                var obj = new { DistribuidorID = parData.DistribuidorID };
                var res = await DBContext.database.FetchAsync<DistribuidoresTicket>("WHERE DistribuidorID = @DistribuidorID ORDER BY Activo DESC, TicketID DESC", obj);


                List<object> respList = new List<object>();
                int i = 0;
                for (i = 0; i < res.Count; i++)
                {
                    var resultado = new
                    {
                        TicketID = res[i].TicketID,
                        DistribuidorID = res[i].DistribuidorID,
                        FechaRegistro = res[i].FechaRegistro.ToString("dd/MM/yyyy"),
                        Activo = res[i].Activo,
                        Monto = res[i].Monto
                    };
                    respList.Add(resultado);
                }
                await DBContext.Destroy();
                return Ok(respList);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("getMonto")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Cobranza.CarteraGestores.getMonto parData)
        {
            try
            {
                var obj = new { DistribuidorID = parData.DistribuidorID };
                var res = await DBContext.database.FetchAsync<AbonosGestores_VW>("WHERE DistribuidorID = @DistribuidorID", obj);
                await DBContext.Destroy();
                return Ok(res);
            }

            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }

            //List<object> respList = new List<object>();
            //int i = 0;
            //for (i = 0; i < res.Count; i++)
            //{
            //    var resultado = new
            //    {
            //        DistribuidorID = res[i].DistribuidorID,
            //        Fecha = res[i].Fecha.ToString("dd/MM/yyyy"),
            //        UltRelacionImporte = res[i].UltRelacionImporte,
            //        FechaCorte = res[i].FechaCorte
            //    };
            //    respList.Add(resultado);
            //}
            //await DBContext.Destroy();
            //return Ok(respList);



            //await DBContext.Destroy();
            //return Ok(res);
        }

        [HttpPost]
        [Route("CancelarTicket")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Cobranza.CarteraGestores.CancelarTicket parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, PersonaID = UsuarioActual.PersonaID, TicketID = parData.TicketID, Monto = parData.Monto, DistribuidorID = parData.DistribuidorID, CodigoCancelacion = parData.CodigoCancelacion, regresa = parData.regresa, msj = parData.msj };
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Cobranza.spCancelarTicket>("EXEC Cobranza.CancelarTicket @Usu, @PersonaID, @TicketID, @Monto, @DistribuidorID, @CodigoCancelacion, @regresa, @msj", obj).FirstOrDefaultAsync();
                await DBContext.Destroy();
                if (res.regresa == 1)

                    return Ok(res);
                else
                    await DBContext.Destroy();
                return BadRequest(res.msj);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
            //var obj = new { TicketID = parData.TicketID, Monto = parData.Monto };

            //var cancelarTicket = await DBContext.database.SingleByIdAsync<DistribuidoresTicket>(parData.TicketID);
            //cancelarTicket.Activo = false;
            //await DBContext.database.UpdateAsync(cancelarTicket);
            //var res = await DBContext.database.FetchAsync<DistribuidoresTicket>("WHERE TicketID = @TicketID", obj);
            //await DBContext.Destroy();
            //return Ok(res);
        }

        [HttpPost]
        [Route("CodigoSMS")]
        //[Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Cobranza.CarteraGestores.CodigoSMS parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var Cancela = await DBContext.database.FetchAsync<CodigosCancelacion>("WHERE TicketID = @TicketID AND Activo = 1", parData);

                if (Cancela.Count > 0)
                {
                    var FechaCaduca = Convert.ToDateTime(Cancela[0].FechaCaduca.ToString("hh:mm tt"));

                    if (Cancela[0].Activo == true)
                    {
                        await DBContext.Destroy();
                        return BadRequest("EL SMS DE CANCELACION YA SE ENVIO ANTERIORMENTE, POR LO CUAL VENCE" + ' ' + FechaCaduca.AddMinutes(1));
                    }
                }

                var Persona = await DBContext.database.SingleByIdAsync<Personas>(UsuarioActual.PersonaID);
                var TelefonoMovi = Persona.TelefonoMovil;


                var variable = await DBContext.database.QueryAsync<VariablesGlobales>("WHERE  (varName = @0)", "TIEMPO_EXPIRACION_CODIGO_SMS").FirstOrDefaultAsync();

                DBContext.database.BeginTransaction();

                //        await DBContext.database.UpdateAsync(Persona);

                int tiempoExp = Int32.Parse((string)variable.varValue);

                Random generator = new();
                var code = generator.Next(0, 10000000).ToString();

                //var CodigoSMS = new CodigoSMS()
                //{
                //    PersonaID = parData.DistribuidorID,
                //    Codigo = code,
                //    FechaEnvio = DateTime.Now,
                //    FechaCaduca = DateTime.Now.AddMinutes(tiempoExp),
                //    Confirmado = false,
                //    SMSId = null
                //};

                //await DBContext.database.InsertAsync(CodigoSMS);


                var SMS = new //MensajesSMS_VW()
                {
                    mensaje = "CV CODIGO DE CANCELACION " + code + ".",
                    estatusEnvioID = "P",
                    fhRegistro = DateTime.Now,
                    //fhEnviado = null,
                    //ultimoResultado = null,
                    //fhUltimoIntentoEnvio = null,
                    fhEnviar = DateTime.Now,
                    //Intentos = null,
                    sistemaId = 1,
                    provedorID = 1
                };

                var context = new NPoco.Database(sqlConnection);

                await sqlConnection.OpenAsync();

                context.BeginTransaction();

                int SMSId = await context.ExecuteScalarAsync<int>("INSERT INTO [dbo].[VC_SMS] ([mensaje] ,[estatusEnvioID] ,[fhRegistro] ,[fhEnviar] ,[sistemaId] ,[provedorID]) VALUES(@mensaje ,@estatusEnvioID ,@fhRegistro ,@fhEnviar ,@sistemaId ,@provedorID) SELECT SCOPE_IDENTITY() AS [ID]", SMS);

                if (SMSId < 1)
                {
                    context.AbortTransaction();
                    throw new Exception();
                }

                var Destinatario = new
                {
                    SMSId,
                    Destinatario = TelefonoMovi,
                    RefV = "CODIGO",
                    RefI = 1,
                    IDProridadMensajes = 1
                };

                int DestinatarioId = await context.ExecuteScalarAsync<int>("INSERT INTO [dbo].[VC_SMSDestinatarios] ([SMSId] ,[Destinatario] ,[RefV] ,[RefI] ,[IDProridadMensajes]) VALUES (@SMSId, @Destinatario, @RefV, @RefI, @IDProridadMensajes ) SELECT SCOPE_IDENTITY() AS [ID]", Destinatario);

                if (DestinatarioId < 1)
                {
                    context.AbortTransaction();
                    throw new Exception();
                }

                var CodigoSMS = new CodigosCancelacion()
                {
                    UsuarioID = UsuarioActual.UsuarioID,
                    PersonaID = Convert.ToInt32(UsuarioActual.PersonaID),
                    DistribuidorID = parData.DistribuidorID,
                    TicketID = parData.TicketID,
                    Abono = parData.Abono,
                    Fecha = DateTime.Now,
                    FechaCaduca = DateTime.Now.AddMinutes(tiempoExp),
                    Codigo = code,
                    SMSId = SMSId,
                    Activo = true
                };

                await DBContext.database.InsertAsync(CodigoSMS);

                //CodigoSMS.SMSId = SMSId;
                //await DBContext.database.UpdateAsync(CodigoSMS);


                context.CompleteTransaction();

                await sqlConnection.CloseAsync();

                await sqlConnection.DisposeAsync();

                sqlConnection.Dispose();

                DBContext.database.CompleteTransaction();

                await DBContext.Destroy();

                return Ok(CodigoSMS);

            }
            catch (Exception ex)
            {
                DBContext.database.AbortTransaction();

                await sqlConnection.CloseAsync();

                await sqlConnection.DisposeAsync();

                sqlConnection.Dispose();

                await DBContext.Destroy();

                return BadRequest(ex.Message);
            }
        }

    }

}

