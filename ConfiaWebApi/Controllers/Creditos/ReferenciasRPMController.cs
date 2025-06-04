using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Text.Json;
using Newtonsoft.Json;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Net.Http.Headers;
using DBContext.DBConfia;
using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;
using DBContext.DBConfia.General;
using Newtonsoft.Json.Linq;
using DBContext.DBConfia.Pagos;
using DBContext.DBConfia.Creditos;
using System.Net.Mail;



namespace ConfiaWebApi.Controllers.Creditos
{
    [ApiController]
    [Route("api/Creditos/[controller]")]

    public class ReferenciasRPMController : ControllerBase
    {
       
        //Conexión a DBCONFIA
        private DBConfiaContext DBContext;
        private IConfiguration Configuracion;

         private SmtpClient client;
         private MailMessage mail;

        public ReferenciasRPMController(IConfiguration _Configuration, DBConfiaContext _DBContext)
        {
            
                this.Configuracion = _Configuration;
                DBContext = _DBContext;   
                client = new SmtpClient("smtp.gmail.com");
                mail = new MailMessage("you@example.com", "brianjoshuadiaz@gmail.com"); 
        }

        [HttpGet]
        [Route("GenerarClabeRPM")]
        public async Task<IActionResult> Hook()
        {
            try
            {
                SqlConnection sqlConnection = null;

                //Almacenamos las primeras 10 referencias con estatus P
                var sintaxisSql = "SELECT TOP 10 * FROM RPM_ReferenciasSPEI WHERE Estatus = 'P'";

                //Conexión a la base de datos
                using (sqlConnection = new SqlConnection (Configuracion["ConnectionStrings:DBConfia_Personas"]))
                {
                    //Abrimos la base de datos
                    await sqlConnection.OpenAsync();
                    //Pasamos la consulta y la conexión
                    using (SqlCommand sqlCommand = new SqlCommand(sintaxisSql, sqlConnection))
                    {
                        //Leemos los campos de la tabla RPM_ReferenciasSPEI
                         using(SqlDataReader reader = await sqlCommand.ExecuteReaderAsync())
                        {
                            while(await reader.ReadAsync())
                            {
                               var referenciasSinClabe = new 
                               {
                                   Account = reader["Account"].ToString(),
                                   CustomerEmail = reader["CustomerEmail"].ToString(),
                                   CustomerName = reader["CustomerName"].ToString(),
                                   Estatus = reader["Estatus"].ToString(),
                                   clabe_spei = reader["clabe_spei"].ToString(),
                                   fhGeneracion = reader["fhGeneracion"].ToString(),
                                   prefijoPagoSoriana = reader["prefijoPagoSoriana"].ToString(),
                               };
    	                    
                            //Hasta aquí leímos la primera referencia
                            //Selecciona todo donde el prestadorID coincida con prefijoPagoSoriana
                            var sintaxisSqlCredenciales = "SELECT * FROM rpmmxSTPCredenciales WHERE PrestadorID = " + referenciasSinClabe.prefijoPagoSoriana;
                            

                            //Usamos otra nueva conexión
                            using (SqlConnection sqlConnectionCredenciales = new SqlConnection(Configuracion["ConnectionStrings:DBConfia_Personas"]))
                            {
                                 await sqlConnectionCredenciales.OpenAsync();   
                                 //Le pasamos la consulta y la conexión de las credenciales
                                 using (SqlCommand sqlCommandCredenciales = new SqlCommand(sintaxisSqlCredenciales, sqlConnectionCredenciales))
                                 {
                                    using (SqlDataReader readerCredenciales = await  sqlCommandCredenciales.ExecuteReaderAsync())
                                    {
                                         while (await readerCredenciales.ReadAsync())
                                         {
                                            var credenciales = new
                                            {
                                                usuario = readerCredenciales["usuario"].ToString(),
                                                contrasena = readerCredenciales["contrasena"].ToString()
                                            };

                                            if(credenciales != null)
                                            {
                                                string url = "https://qa.clubpago.site/auth/api/auth";
                                                var client = new HttpClient();
                                                
                                                RequestPostAutenticacionToken post = new RequestPostAutenticacionToken()
                                                {
                                                    User = credenciales.usuario,
                                                    Pswd = credenciales.contrasena
                                                };

                                                var data = System.Text.Json.JsonSerializer.Serialize<RequestPostAutenticacionToken>(post);
                                                
                                                
                                                var content = new StringContent(data, System.Text.Encoding.UTF8, "application/json");

                                                var httpResponse = await client.PostAsync(url, content);

                                                if(httpResponse.IsSuccessStatusCode)
                                                {
                                                   var result = await httpResponse.Content.ReadAsStringAsync();

                                                   var postResult = System.Text.Json.JsonSerializer.Deserialize<ResponseToken>(result);

                                                    if(postResult.Message == "Exito")
                                                    {
                                                         string url2 = "https://qa.clubpago.site/referencegenerator/svc/generator/reference";
                                                         var client2 = new HttpClient();
                                                         client2.DefaultRequestHeaders.Clear();
                                                         client2.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", postResult.Token);

                                                         RequestPostReferencia post2 = new RequestPostReferencia()
                                                        {
                                                            Description = "Referencia de pago",
                                                            Amount = 10000,
                                                            Account = referenciasSinClabe.Account,
                                                            CustomerEmail = referenciasSinClabe.CustomerEmail,
                                                            CustomerName = referenciasSinClabe.CustomerName.Substring(0, Math.Min(referenciasSinClabe.CustomerName.Length, 50)),
                                                            ExpirationDate = "",
                                                            RequestClabe = 1
                                                        };

                                                            var data2 = System.Text.Json.JsonSerializer.Serialize<RequestPostReferencia>(post2);

                                                            var content2 = new StringContent(data2, System.Text.Encoding.UTF8, "application/json");

                                                            var httpResponse2 = await client2.PostAsync(url2, content2);

                                                            if (httpResponse2.IsSuccessStatusCode)
                                                            {
                                       
                                                                var result2 = await httpResponse2.Content.ReadAsStringAsync();
                                                                var postResult2 = System.Text.Json.JsonSerializer.Deserialize<ResponseReferencia>(result);
                                                                dynamic objResponse = JsonConvert.DeserializeObject(result2);

                                                                 if (postResult2.Message == "Exito")
                                                                {
                                                                     var actualizarReferencia = "UPDATE RPM_ReferenciasSPEI SET Estatus = @Estatus, clabe_spei = @Clabe, fhGeneracion = @FhGeneracion WHERE Account = @Account";

                                                                     using (SqlConnection sqlConnection1 = new SqlConnection (Configuracion["ConnectionStrings:DBConfia_Personas"]))
                                                                     {
                                                                        await sqlConnection1.OpenAsync();
                                                                        using(SqlCommand updateCommand = new SqlCommand(actualizarReferencia, sqlConnection1))
                                                                        {
                                                                            updateCommand.Parameters.AddWithValue("@Estatus","G");
                                                                            updateCommand.Parameters.AddWithValue("@Clabe", objResponse.Clabe.ToString());
                                                                            updateCommand.Parameters.AddWithValue("@FhGeneracion", DateTime.Now); 
                                                                            updateCommand.Parameters.AddWithValue("@Account", referenciasSinClabe.Account);

                                                                            await updateCommand.ExecuteNonQueryAsync();
                                                                        }
                                                                     }                                                            
                                                                }
                                                         }
                                                     else
                                                        {
                                                            return Ok(new { result = "Error", message = "Error al generar clabe", data = httpResponse2.ToString() });
                                                        }
                                                    }
                                                }
                                            }
                                         }
                                    }
                                 }
                            }
                        }
                   }
                }
            }
            return Ok();
         }
          catch(Exception ex)
          {
                return BadRequest(ex.Message);
          }
        }


        [HttpPost]
        [Route("OxxoReferencia")]
        public async Task<IActionResult> CrearCliente()
        {
            try
            {
                //Se crea una instancia de HttpClient
                var client = new HttpClient();

                //Debemos obtener a los distribuidores a los que se les generará la referencia de Conekta.
                var distribuidores =  await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Distribuidores_VW>(" SELECT TOP 5 * FROM Distribuidores.Distribuidores_VW WHERE Reference IS NULL").ToArrayAsync();

                foreach (var info in distribuidores)
                {
                    //Variable para definir el correo
                    var correo = !string.IsNullOrEmpty(info.CorreoElectronico) ? info.CorreoElectronico : "correo@dummy.com";

                    //Representa la solicitud que se enviará al servidor
                    var request = new HttpRequestMessage
                    {
                        //Se específica que el método de la solicitud es POST
                        Method = System.Net.Http.HttpMethod.Post,
                        //Url a la que se enviará la solicitud
                        RequestUri = new Uri("https://api.conekta.io/customers/test?="),

                        //Se configuran los headers de la solicitud
                        Headers =
                        {
                                { "Accept", "application/vnd.conekta-v2.0.0+json" },
                                { "cache-control", "no-cache" },
                                { "Authorization", "Basic a2V5X2dRUmVaVTZEb3dOTmpWOFd5a2U0Tk5K" },
                        },
                    

                        //Se configura el contenido de la solicitud con un objeto JSON
                         Content = new StringContent("{\n\t\"name\": \"" + info.PersonaNombre + "\",\n\t\"email\": \""+ correo+"\",\n\t\"phone\": \"" + info.TelefonoMovil + "\",\n\t\"payment_sources\": [\n\t\t{\n\t\t\t\"type\": \"oxxo_recurrent\"\n\t\t}\n\t]\n}")
                        {
                            //Se indica que el contenido es de tipo JSON
                            Headers =
                            {
                                ContentType = new MediaTypeHeaderValue("application/json")
                            }
                        }
                    };

                    //Se envía la solicitud al servidor
                    using (var response = await client.SendAsync(request))
                    {
                        //Se verifica que la respuesta del servidor sea exitosa
                        response.EnsureSuccessStatusCode();
                        //Se lee el contenido de la respuesta
                        var body = await response.Content.ReadAsStringAsync();
                        
                        //Parseamos el cuerpo de la respuesta JSON
                        JObject responseObject = JObject.Parse(body);
                        //Extraer la referencia del objeto de respuesta
                        string referenciaConekta = (string)responseObject["payment_sources"]["data"][0]["reference"];
                        string nombreCliente = (string)responseObject["name"];
                        string telefonoCliente = (string)responseObject["phone"];
                        string correoCliente = (string)responseObject["email"];
                        string barcode_url = (string)responseObject["payment_sources"]["data"][0]["barcode_url"];
                        string provider = (string)responseObject["payment_sources"]["data"][0]["provider"];
                        string type = (string)responseObject["payment_sources"]["data"][0]["type"];
                        string obj = (string)responseObject["payment_sources"]["data"][0]["object"];
                        string barcode = (string)responseObject["payment_sources"]["data"][0]["barcode"];




                        //Actualizamos la referencia de Conekta a la tabla ReferenciasPagosPersonas
                        // using(var sqlConnectionDB = new SqlConnection(Configuracion["ConnectionStrings:DBConfia"]))
                        // {
                        //     await sqlConnectionDB.OpenAsync();
                        //     //Se actualiza la referencia de Conekta en la base de datos
                        //     var sintaxisSql = "UPDATE Creditos.ReferenciasPagosPersonas SET ReferenciaOxxo = @ReferenciaConekta WHERE ReferenciaOxxo IS NULL AND ProspectoID = " + info.DistribuidorID;
                        //     using(var sqlCommand = new SqlCommand(sintaxisSql, sqlConnectionDB))
                        //     {
                        //         sqlCommand.Parameters.AddWithValue("@ReferenciaConekta", referenciaConekta);
                        //         await sqlCommand.ExecuteNonQueryAsync();
                        //     }
                        // }

                         using(var sqlConnectionDB = new SqlConnection(Configuracion["ConnectionStrings:DBConfia_Personas"]))
                        {
                            await sqlConnectionDB.OpenAsync();
                            //Se actualiza la referencia de Conekta en la base de datos
                            var sintaxisSql = "INSERT INTO ConektaResponse (name, email, phone, object, provider, type, reference, barcode, barcode_url) VALUES ( @name, @email, @phone, @object, @provider, @type, @reference, @barcode, @barcode_url)";
                            using(var sqlCommand = new SqlCommand(sintaxisSql, sqlConnectionDB))
                            {
                                sqlCommand.Parameters.AddWithValue("@name", nombreCliente);
                                sqlCommand.Parameters.AddWithValue("@email", correoCliente);
                                sqlCommand.Parameters.AddWithValue("@phone", telefonoCliente);
                                sqlCommand.Parameters.AddWithValue("@object", obj);
                                sqlCommand.Parameters.AddWithValue("@provider", provider);
                                sqlCommand.Parameters.AddWithValue("@type", type);
                                sqlCommand.Parameters.AddWithValue("@reference", referenciaConekta);
                                sqlCommand.Parameters.AddWithValue("@barcode", barcode);
                                sqlCommand.Parameters.AddWithValue("@barcode_url", barcode_url);

                                await sqlCommand.ExecuteNonQueryAsync();
                            }
                        }

                        using(var sqlConnectionDBPersonas = new SqlConnection(Configuracion["ConnectionStrings:DBConfia_Personas"]))
                        {
                            await sqlConnectionDBPersonas.OpenAsync();
                            // Se inserta un nuevo registro en la base de datos
                            var sintaxisSql2 = "INSERT INTO ReferenciasConekta (Reference, Nombre, Telefono, Correo, Barcode_url, FechaRegistro, DistribuidorID) VALUES (@ReferenciaConekta, @Nombre, @Telefono, @Correo, @Barcode_url, @FechaRegistro, @DistribuidorID)";
                            using(var sqlCommand = new SqlCommand(sintaxisSql2, sqlConnectionDBPersonas))
                            {
                                sqlCommand.Parameters.AddWithValue("@ReferenciaConekta", referenciaConekta);
                                sqlCommand.Parameters.AddWithValue("@Nombre", nombreCliente);
                                sqlCommand.Parameters.AddWithValue("@Telefono", telefonoCliente);
                                sqlCommand.Parameters.AddWithValue("@Correo", correoCliente);
                                sqlCommand.Parameters.AddWithValue("@Barcode_url", barcode_url);
                                sqlCommand.Parameters.AddWithValue("@FechaRegistro", DateTime.Now);
                                sqlCommand.Parameters.AddWithValue("@DistribuidorID", info.DistribuidorID);
                                                        
                                await sqlCommand.ExecuteNonQueryAsync();
                            }
                        }
                    }
                }
                //Se retorna una respuesta exitosa
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}