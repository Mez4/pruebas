using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Distribuidores;
using System.Collections;
using DBContext.DBConfia.General;
using DBContext.DBConfia.AppVale;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Cortes;
using DBContext.DBConfia.Catalogos;
using DBContext.DBConfia.Bancos;
using System.Net.Http;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using ConfiaWebApi.Controllers.General;
using ConfiaWebApi.PeticionesRest.General.CodigoSMS;
using Microsoft.AspNetCore.Hosting;
using DBContext.DBConfia.Seguridad;

namespace ConfiaWebApi.Controllers.AppDistribuidores
{
    [ApiController]
    [Route("api/AppGestionLogin/[controller]")]
    public class AppGestionLoginController : ControllerBase
    {
        private DBConfiaContext DBContext;
        private readonly IWebHostEnvironment env;
        public AppGestionLoginController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("iniciarSesion")]
        public async Task<IActionResult> IniciarSesion(ConfiaWebApi.PeticionesRest.AppLogin.AppLogin.LoginAutenticacion pardata)
        {
            try
            {
                String aux = pardata.username;
                bool isNotNumber = pardata.username.Contains('@');


                if (!isNotNumber)
                {
                    var usuarioWithUseranme = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE PersonaTelefonoMovil = @0", pardata.username).SingleOrDefaultAsync();
                    var respuestaSalidaTemp = new
                    {
                        username = usuarioWithUseranme.Usuario,

                    };
                    aux = respuestaSalidaTemp.username;
                }


                string url_token = "https://kc.fconfia.com/realms/SistemaCV_Demo/protocol/openid-connect/token";
                var nvc = new List<KeyValuePair<string, string>>();
                nvc.Add(new KeyValuePair<string, string>("client_id", "uicv"));
                nvc.Add(new KeyValuePair<string, string>("username", aux));
                nvc.Add(new KeyValuePair<string, string>("password", pardata.password));
                nvc.Add(new KeyValuePair<string, string>("grant_type", "password"));
                var client = new HttpClient();
                var req = new HttpRequestMessage(HttpMethod.Post, url_token) { Content = new FormUrlEncodedContent(nvc) };
                var res = await client.SendAsync(req);

                if (res.IsSuccessStatusCode)
                {
                    var content = await res.Content.ReadAsStringAsync();
                    var json = Newtonsoft.Json.Linq.JObject.Parse(content);
                    var access_token = json["access_token"].ToString();
                    var refresh_token = json["refresh_token"].ToString();
                    var handler = new JwtSecurityTokenHandler();
                    var token_decode = handler.ReadJwtToken(access_token);
                    var payload = token_decode.Payload;
                    var sub = payload["sub"].ToString();
                    var sid = payload["sid"].ToString();

                    
                    var usuario = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario = @0", aux).SingleOrDefaultAsync();
                    var respuestaSalida = new
                    {
                        Nombre = usuario.NombreCompleto,
                        usuario.DistribuidorID,
                        usuario.GrupoID,
                        usuario.PersonaID,
                        usuario.ProductoID,                        
                        UsuarioID = usuario.UsuarioID,
                        EmpresaID = usuario.empresaId,
                        Empresa = usuario.empresaNombre,
                        usuario.creditoPromotorId,
                        usuario.SucursalIDPromotor,
                        usuario.ProductoIDPromotor,
                        AccessToken = access_token,
                        RefreshToken = refresh_token,
                        sub,
                        sid,
                        usuario.MasterUser
                    };
                    var responseContent = await res.Content.ReadAsStringAsync();
                    await DBContext.Destroy();
                    return Ok(respuestaSalida);
                }
                else
                {
                    await DBContext.Destroy();
                    return BadRequest();

                }

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }

        }

        [HttpPost]
        [Route("enviarcodigodv")]
        public async Task<IActionResult> EnviarCodigoCliente(PeticionesRest.AppCobranzaPeticiones.EnviarCodigoDV.EnviarCodigo parData)
        {
            try
            {

                var variable = await DBContext.database.QueryAsync<VariablesGlobales>("WHERE  (varName = @0)", "TIEMPO_EXPIRACION_CODIGO_SMS").FirstOrDefaultAsync();

                DBContext.database.BeginTransaction();

                var LogCelular = new LogCelular()
                {
                    PersonaID = parData.PersonaID,
                    Celular = parData.Telefono,
                    PersonaIDModifica = 1,
                    UsuarioIDModifica = 1,
                    FechaHora = DateTime.Now,
                };

                int tiempoExp = Int32.Parse((string)variable.varValue);

                Random generator = new();
                var code = generator.Next(0, 10000000).ToString("D6");

                var CodigoSMS = new CodigoSMS()
                {
                    PersonaID = parData.PersonaID,
                    Codigo = code,
                    FechaEnvio = DateTime.Now,
                    FechaCaduca = DateTime.Now.AddMinutes(tiempoExp),
                    Confirmado = false,
                    SMSId = null,
                };

                await DBContext.database.InsertAsync(CodigoSMS);

                CodigoSMSController CodSMS = new(DBContext, env);

                SMS DataSMS = new()
                {
                    PersonaID = parData.PersonaID,
                    TelefonoMovil = parData.Telefono,
                    MSG = $"{parData.src} INGRESA EL SIG. CODIGO PARA CONTINUAR TU REGISTRO. {code}.",
                    Referencia = "CODIGO",
                };

                var r = await CodSMS.SMS(DataSMS);

                if (r < 1)
                {
                    throw new Exception("No fue posible enviar el código por SMS");
                }

                CodigoSMS.SMSId = r;

                await DBContext.database.UpdateAsync(CodigoSMS);

                DBContext.database.CompleteTransaction();

                await DBContext.Destroy();

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = CodigoSMS
                };
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                DBContext.database.AbortTransaction();
                await DBContext.Destroy();
                return BadRequest(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }

        }

       
    }
}
