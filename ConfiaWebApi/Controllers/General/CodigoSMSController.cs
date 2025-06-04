using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.General;
using Microsoft.AspNetCore.Hosting;
using DBContext.DBConfia.Catalogos;
using Microsoft.Data.SqlClient;
using ConfiaWebApi;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using ConfiaWebApi.RespuestasPersonalizadas.AppVale;
using System.Text.Json;

namespace ConfiaWebApi.Controllers.General
{
    [Authorize]
    [ApiController]
    [ApiExplorerSettings(IgnoreApi = true)]
    [Route("api/General/[controller]")]
    public class CodigoSMSController : ControllerBase
    {
        private DBConfiaContext DBContext;
        private readonly IWebHostEnvironment _env;
        private readonly SqlConnection sqlConnection;
        private readonly SqlConnection sqlConnectionSMS;
        public CodigoSMSController(DBConfiaContext _DBContext, IWebHostEnvironment env)
        {
            DBContext = _DBContext;
            _env = env;

            IConfiguration Configuration;

            Configuration = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json", false, true)
                .Build();

            var sqlServerConfig = Configuration.GetSection("ConnectionStrings");
            string conn = sqlServerConfig["BDVR_Notificaciones"];
            string connSMS = sqlServerConfig["DBAgente"];
            sqlConnection = new SqlConnection(conn);
            sqlConnectionSMS = new SqlConnection(connSMS);
        }

        [HttpPost]
        [Route("verificar")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Verificar(PeticionesRest.General.CodigoSMS.Get parData)
        {
            try
            {
                parData.FechaCaduca = DateTime.Now;

                var CodigoSMS = await DBContext.database.QueryAsync<CodigoSMS>("WHERE (Id = @Id) AND (Codigo = @Codigo) AND (FechaCaduca >= @FechaCaduca) AND (Confirmado = 0)", parData).FirstOrDefaultAsync();

                if (CodigoSMS != null)
                {
                    CodigoSMS.Confirmado = true;

                    await DBContext.database.UpdateAsync(CodigoSMS);
                }

                await DBContext.Destroy();
                return Ok(CodigoSMS);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        // [Code.TProteccionProducto]
        public async Task<IActionResult> Add(PeticionesRest.General.CodigoSMS.Add parData)
        {
            try
            {
                 //Obtenemos el tiempo de expiracion del codigo
                var variable = await DBContext.database.QueryAsync<VariablesGlobales>("WHERE  (varName = @0)", "TIEMPO_EXPIRACION_CODIGO_SMS").FirstOrDefaultAsync();

                int tiempoExp = Int32.Parse((string)variable.varValue);

                //Generamos el codigo
                Random generator = new();
                var code = generator.Next(1000000, 9999999).ToString("D6");


                var LogCelular = new LogCelular()
                {
                    PersonaID = parData.PersonaID,
                    Celular = parData.TelefonoMovil,
                    PersonaIDModifica = 1,
                    UsuarioIDModifica = 1,
                    FechaHora = DateTime.Now,
                };

                //Tipo de codigo
                var tipoCodigo = await DBContext.database.QueryAsync<TipoCodigoSMS>("WHERE (clave = @0)", "DTB").SingleOrDefaultAsync();

                var CodigoSMS = new CodigoSMS()
                {
                    PersonaID = parData.PersonaID,
                    Codigo = code,
                    FechaEnvio = DateTime.Now,
                    FechaCaduca = DateTime.Now.AddMinutes(tiempoExp),
                    TipoID = tipoCodigo.TipoID,
                    Confirmado = false,
                    SMSId = null,
                };

                await DBContext.database.InsertAsync(CodigoSMS);

                string apiKey;
                using (var context = new NPoco.Database(sqlConnectionSMS))
                {
                    await sqlConnectionSMS.OpenAsync();
                    const string query = "SELECT Apikey_Pass FROM ApiKey";
                    apiKey = await context.QueryAsync<string>(query).FirstOrDefaultAsync();
                }

                if (string.IsNullOrEmpty(apiKey))
                {
                    throw new Exception("No se pudo obtener la API Key de la base de datos.");
                }


                string urlSms = "https://apisms.grupoconfia.mx/api/GrupoConfia/SMS/SendSMS";
                var dataSMS = new
                {
                    mensaje = CodigoSMS.Codigo,
                    destinatarios = new List<object>
            {
                new { cellphone = parData.TelefonoMovil.Replace("(", "").Replace(")", "").Replace("-", "").Replace(" ", "") }
            }
                };

                using var client = new HttpClient();
                client.DefaultRequestHeaders.Add("apiKey", apiKey);

                var smsResponse = await client.PostAsJsonAsync(urlSms, dataSMS);

                if (!smsResponse.IsSuccessStatusCode)
                {
                    var errorContent = await smsResponse.Content.ReadAsStringAsync();
                    var errorResponse = JsonSerializer.Deserialize<ErrorResponse>(errorContent);

                    string mensajeError = errorResponse?.errors?.FirstOrDefault().Value?.FirstOrDefault()?.ToUpper()
                        ?? JsonSerializer.Deserialize<ResponseSMSAgent>(errorContent)?.msg?.ToUpper()
                        ?? "Error desconocido.";

                    throw new Exception($"Error al enviar SMS: {mensajeError}");
                }

                var content = await smsResponse.Content.ReadAsStringAsync();
                var response = JsonSerializer.Deserialize<ResponseSMSAgent>(content);

                if (response.code < 1)
                {
                    throw new Exception("No fue posible enviar el código por SMS");
                }

                CodigoSMS.SMSId = response.code;

                await DBContext.database.UpdateAsync(CodigoSMS);

                DBContext.database.CompleteTransaction();

                await DBContext.Destroy();

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

        [HttpPost]
        [Route("sendsms")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> SendSMS(PeticionesRest.General.CodigoSMS.SMS parData)
        {
            try
            {
                var r = await SMS(parData);

                if (r == 0)
                {
                    throw new Exception();
                }

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                };
                await DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        public async Task<int> SMS(PeticionesRest.General.CodigoSMS.SMS parData)
        {
            try
            {
                // if (sqlConnection == null)
                // {
                //     throw new InvalidOperationException("La conexión SQL no está inicializada.");
                // }

                // using (var context = new NPoco.Database(sqlConnection))
                // {
                //     await sqlConnection.OpenAsync();

                // var SMS = new
                // {
                //     mensaje = parData.MSG,
                //     estatusEnvioID = "P",
                //     fhRegistro = DateTime.Now,
                //     fhEnviar = DateTime.Now,
                //     sistemaId = 1,
                //     provedorID = 1
                // };

                //     int SMSId = await context.ExecuteScalarAsync<int>(
                //         @"INSERT INTO [dbo].[VC_SMS] ([mensaje], [estatusEnvioID], [fhRegistro], [fhEnviar], [sistemaId], [provedorID]) 
                //   VALUES (@mensaje, @estatusEnvioID, @fhRegistro, @fhEnviar, @sistemaId, @provedorID) 
                //   SELECT SCOPE_IDENTITY() AS [ID]",
                //         SMS);

                //     if (SMSId < 1)
                //     {
                //         throw new Exception("Fallo al insertar SMS.");
                //     }

                // var Destinatario = new
                // {
                //     SMSId,
                //     Destinatario = parData.TelefonoMovil,
                //     RefV = parData.Referencia,
                //     RefI = parData.PersonaID,
                //     IDProridadMensajes = 1
                // };

                //     int DestinatarioId = await context.ExecuteScalarAsync<int>(
                //         @"INSERT INTO [dbo].[VC_SMSDestinatarios] ([SMSId], [Destinatario], [RefV], [RefI], [IDProridadMensajes]) 
                //   VALUES (@SMSId, @Destinatario, @RefV, @RefI, @IDProridadMensajes) 
                //   SELECT SCOPE_IDENTITY() AS [ID]",
                //         Destinatario);

                //     if (DestinatarioId < 1)
                //     {
                //         throw new Exception("Fallo al insertar destinatario.");
                //     }


                string apiKey;
                using (var context = new NPoco.Database(sqlConnectionSMS))
                {
                    await sqlConnectionSMS.OpenAsync();
                    const string query = "SELECT Apikey_Pass FROM ApiKey";
                    apiKey = await context.QueryAsync<string>(query).FirstOrDefaultAsync();
                }

                if (string.IsNullOrEmpty(apiKey))
                {
                    throw new Exception("No se pudo obtener la API Key de la base de datos.");
                }


                string urlSms = "https://apisms.grupoconfia.mx/api/GrupoConfia/SMS/SendSMS";
                var dataSMS = new
                {
                    mensaje = parData.MSG,
                    destinatarios = new List<object>
            {
                new { cellphone = parData.TelefonoMovil.Replace("(", "").Replace(")", "").Replace("-", "").Replace(" ", "") }
            }
                };

                using var client = new HttpClient();
                client.DefaultRequestHeaders.Add("apiKey", apiKey);

                var smsResponse = await client.PostAsJsonAsync(urlSms, dataSMS);

                if (!smsResponse.IsSuccessStatusCode)
                {
                    var errorContent = await smsResponse.Content.ReadAsStringAsync();
                    var errorResponse = JsonSerializer.Deserialize<ErrorResponse>(errorContent);

                    string mensajeError = errorResponse?.errors?.FirstOrDefault().Value?.FirstOrDefault()?.ToUpper()
                        ?? JsonSerializer.Deserialize<ResponseSMSAgent>(errorContent)?.msg?.ToUpper()
                        ?? "Error desconocido.";

                    throw new Exception($"Error al enviar SMS: {mensajeError}");
                }

                var content = await smsResponse.Content.ReadAsStringAsync();
                var response = JsonSerializer.Deserialize<ResponseSMSAgent>(content);
                return response?.responseSMS?.campaign ?? 0;
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error en SMS: {ex.Message}");
                return 0;
            }
        }




        [HttpPost]
        [Route("addTiendita")]
        [Authorize]
        // [Code.TProteccionProducto]
        public async Task<IActionResult> AddTiendita(PeticionesRest.General.CodigoSMS.Add parData)
        {
            try
            {
                var Persona = await DBContext.database.SingleByIdAsync<Personas>(parData.PersonaID);
                Persona.TelefonoMovil = parData.TelefonoMovil;

                var variable = await DBContext.database.QueryAsync<VariablesGlobales>("WHERE  (varName = @0)", "TIEMPO_EXPIRACION_CODIGO_SMS").FirstOrDefaultAsync();

                DBContext.database.BeginTransaction();

                await DBContext.database.UpdateAsync(Persona);

                int tiempoExp = Int32.Parse((string)variable.varValue);

                Random generator = new();
                var code = generator.Next(0, 10000000).ToString("D6");

                var tipo = await DBContext.database.QueryAsync<TipoCodigoSMS>("WHERE Clave=@0", "TCF").FirstOrDefaultAsync();

                var CodigoSMS = new CodigoSMS()
                {
                    PersonaID = parData.PersonaID,
                    Codigo = code,
                    FechaEnvio = DateTime.Now,
                    FechaCaduca = DateTime.Now.AddMinutes(tiempoExp),
                    Confirmado = false,
                    SMSId = null,
                    TipoID = tipo.TipoID,
                };

                await DBContext.database.InsertAsync(CodigoSMS);

                var SMS = new //MensajesSMS_VW()
                {
                    mensaje = parData.src + " CODIGO VERIFICADOR DE DATOS " + code + ".",
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
                    Destinatario = Persona.TelefonoMovil,
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

                CodigoSMS.SMSId = SMSId;

                await DBContext.database.UpdateAsync(CodigoSMS);

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

        [HttpPost]
        [Route("verificarTiendita")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> VerificarTiendita(PeticionesRest.General.CodigoSMS.Get parData)
        {
            try
            {
                parData.FechaCaduca = DateTime.Now;

                var tipo = await DBContext.database.QueryAsync<TipoCodigoSMS>("WHERE Clave=@0", "TCF").FirstOrDefaultAsync();
                parData.TipoID = tipo.TipoID;

                var CodigoSMS = await DBContext.database.QueryAsync<CodigoSMS>("WHERE (Id = @Id) AND (Codigo = @Codigo) AND (FechaCaduca >= @FechaCaduca) AND (Confirmado = 0) AND (TipoID = @TipoID)", parData).FirstOrDefaultAsync();

                if (CodigoSMS != null)
                {
                    CodigoSMS.Confirmado = true;

                    await DBContext.database.UpdateAsync(CodigoSMS);
                }

                await DBContext.Destroy();
                return Ok(CodigoSMS);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

    }
}
