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

using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Text;

namespace ConfiaWebApi.Controllers.AppVale.v2
{
    [ApiController]
    [Route("api/AppVale/v2/[controller]")]
    public class AppAuthController : ControllerBase
    {
        private DBConfiaContext DBContext;
        private readonly IWebHostEnvironment env;
        public AppAuthController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("obtenerDatosDV")]
        public async Task<IActionResult> getDatosDV(PeticionesRest.AppLogin.AppLogin.ObtenerDatosDV pardata)
        {
            try
            {
                // var usuarioWith = await DBContext.database.QueryAsync<UsuariosVW>("WHERE (PersonaTelefonoMovil = @0)", pardata.Telefono).SingleOrDefaultAsync();
                // var respuestaSalidaTemp = new
                // {
                //     username = usuarioWith.Usuario,
                //     prefijo = usuarioWith.usuario_empresaPrefijoApp

                // };
                var tel = pardata.Telefono;//d[5..];

                var persona = await DBContext.database.QueryAsync<DBContext.DBConfia.General.Personas_VW>("WHERE TelefonoMovil = @0", tel).SingleOrDefaultAsync();

                if (persona == null)
                {
                    await DBContext.Destroy();
                    return BadRequest(new
                    {
                        resultCode = -1,
                        resultDesc = "No se encontro ninguna persona con ese número de telefono."
                    });
                }
                else
                {
                    var PrefijoApp = pardata.Telefono;//[..5];
                    // var usuarioWithUseranme = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE PersonaTelefonoMovil = @0", pardata).SingleOrDefaultAsync();

                    // var PrefijoApp = respuestaSalidaTemp.prefijo;

                    // var Empresa = await DBContext.database.QueryAsync<Empresas>("WHERE (PrefijoApp = @0)", PrefijoApp).SingleOrDefaultAsync();

                    // var distribuidor = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Distribuidores_VW>("WHERE DistribuidorID = @0 AND (EmpresaId = @1)", persona.DistribuidorID, Empresa.empresaId).SingleOrDefaultAsync();
                    var distribuidor = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Distribuidores_VW>("WHERE DistribuidorID = @0 AND (telefonoMovil = @1)", persona.DistribuidorID, PrefijoApp).SingleOrDefaultAsync();
                    if (distribuidor == null)
                    {
                        await DBContext.Destroy();
                        return BadRequest(new
                        {
                            resultCode = -1,
                            resultDesc = "No se encontró la socia."
                        });

                    }
                    else
                    {
                        var res = new
                        {
                            resultCode = 0,
                            resultDesc = "OK.",
                            data = persona
                        };
                        await DBContext.Destroy();
                        return Ok(res);
                    }
                }
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = "Error al obtener los datos de la socia."
                });
            }
        }


        //Inicio de sesion
        [HttpPost]
        [Route("signin")]
        public async Task<IActionResult> GetTokenDV(PeticionesRest.AppLogin.AppLogin.LoginDV pardata)
        {
            try
            {
                //Verificar datos
                if (pardata.telefono.Contains('@'))
                {
                    await DBContext.Destroy();
                    return BadRequest(new
                    {
                        resultCode = -1,
                        resultDesc = "El usuario no es valido",
                    });
                }


                //Verificar usuario
                var usuario = await DBContext.database.QueryAsync<UsuariosApp_VW>("WHERE PersonaTelefonoMovil = @0", pardata.telefono).SingleOrDefaultAsync();

                if (usuario == null)
                {
                    await DBContext.Destroy();
                    return BadRequest(new
                    {
                        resultCode = -1,
                        resultDesc = "No se encontro el usuario",
                    });
                }

                //Verificar que sea socia
                if (usuario.DistribuidorID == null)
                {
                    await DBContext.Destroy();
                    return BadRequest(new
                    {
                        resultCode = -1,
                        resultDesc = "El usuario no es una socia",
                    });
                }

                //Verificar contraseña
                var usuarioWithUseranme = await DBContext.database.QueryAsync<UsuariosVW>("WHERE PersonaTelefonoMovil = @0", pardata.telefono).SingleOrDefaultAsync();

                if (!await ValidarCredenciales(usuarioWithUseranme.Usuario, pardata.contrasena))
                {
                    await DBContext.Destroy();
                    return BadRequest(new
                    {
                        resultCode = -1,
                        resultDesc = "Las credenciales son incorrectas",
                    });
                }

                //Verificar acceso
                var distribuidores = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Distribuidores>("WHERE DistribuidorID = @0", usuario.DistribuidorID).SingleOrDefaultAsync();

                if (distribuidores.AccesoAppVales == false || distribuidores.AccesoAppVales2 == false)
                {
                    await DBContext.Destroy();
                    return BadRequest(new
                    {
                        resultCode = -1,
                        resultDesc = "No tiene acceso a la aplicación",
                    });
                }

                //Verificar UUID
                if (usuario.UUID != pardata.UUID)
                {
                    await DBContext.Destroy();
                    return BadRequest(new
                    {
                        resultCode = -1,
                        resultDesc = "El dispositivo no esta registrado para este usuario",
                    });
                }

                //Verificar validacion
                if (!usuario.Validacion)
                {
                    await DBContext.Destroy();
                    return BadRequest(new
                    {
                        resultCode = -1,
                        resultDesc = "El usuario no ha sido validado",
                    });
                }

                string url_token = "https://kc.fconfia.com/realms/SistemaCV_Demo/protocol/openid-connect/token";
                var nvc = new List<KeyValuePair<string, string>>
                {
                    new KeyValuePair<string, string>("client_id", "uicv"),
                    new KeyValuePair<string, string>("username", usuarioWithUseranme.Usuario),
                    new KeyValuePair<string, string>("password", pardata.contrasena),
                    new KeyValuePair<string, string>("grant_type", "password")
                };
                var client = new HttpClient();
                var req = new HttpRequestMessage(HttpMethod.Post, url_token) { Content = new FormUrlEncodedContent(nvc) };
                var res = await client.SendAsync(req);

                if (!res.IsSuccessStatusCode)
                {
                    await DBContext.Destroy();
                    return BadRequest(new
                    {
                        resultCode = -1,
                        resultDesc = "Las credenciales son incorrectas, verifique su usuario y contraseña",
                    });
                }


                var content = await res.Content.ReadAsStringAsync();
                var json = JObject.Parse(content);
                var access_token = json["access_token"].ToString();
                var refresh_token = json["refresh_token"].ToString();
                var handler = new JwtSecurityTokenHandler();
                var token_decode = handler.ReadJwtToken(access_token);
                var payload = token_decode.Payload;
                var sub = payload["sub"].ToString();
                var sid = payload["sid"].ToString();


                //Configuracion de colores App
                var colores = await DBContext.database.QueryAsync<ColoresProductoApp_VW>("WHERE EmpresaId = @0", usuario.empresaId).ToArrayAsync();

                //Crear Diccionario de colores
                Dictionary<string, long> coloresConfig = new Dictionary<string, long>
                {
                    //Valor de TipoEmpresaId
                    { "TipoEmpresaId", (colores == null | colores.Length == 0) ? 1 : colores[0].TipoEmpresaId }
                };

                //Arreglo de colores
                foreach (var color in colores)
                {
                    coloresConfig.Add(color.NombreColor, (long)color.ValorColor);
                }

                var respuestaSalida = new
                {
                    Nombre = usuario.NombreCompleto,
                    DistribuidorID = usuario.DistribuidorID,
                    GrupoID = usuario.GrupoID,
                    PersonaID = usuario.PersonaID,
                    //ProductoID era null
                    ProductoID = usuario.ProductoID,
                    GestorCobranzaID = usuario.GestorCobranzaID,
                    UsuarioID = usuario.UsuarioID,
                    EmpresaID = usuario.empresaId,
                    Empresa = usuario.empresaNombre,
                    creditoPromotorId = usuario.creditoPromotorId,
                    SucursalIDPromotor = usuario.SucursalIDPromotor,
                    ProductoIDPromotor = usuario.ProductoIDPromotor,
                    AccesoAppCobranza = true,
                    AccesoAppPromotoria = usuario.AccesoAppPromotoria == null || usuario.AccesoAppPromotoria == false ? false : true,
                    // AccesoAppCobranza = usuario.AccesoAppCobranza,
                    AccesoAppVales = usuario.AccesoAppVales,
                    AccessToken = access_token,
                    RefreshToken = refresh_token,
                    sub = sub,
                    sid = sid,
                    CambiarContrasena = usuario.CambiarContrasena,
                    Configuraciones = coloresConfig

                };

                var responseContent = await res.Content.ReadAsStringAsync();
                await DBContext.Destroy();

                return Ok(new { resultCode = 0, resultDesc = "OK", data = respuestaSalida });

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = "Ha ocurrido un error al iniciar sesion, intentelo de nuevo mas tarde",
                });
            }
        }

        //Codigo de verificacion
        [HttpPost]
        [Route("enviarcodigodv")]
        public async Task<IActionResult> EnviarCodigoCliente(PeticionesRest.AppCobranzaPeticiones.EnviarCodigoDV.EnviarCodigo parData)
        {
            try
            {
                //Verficar si el usuario no esta activo
                var usuario = await DBContext.database.QueryAsync<Usuarios>("WHERE PersonaID = @0", parData.PersonaID).SingleOrDefaultAsync();

                if (usuario.Validacion)
                {

                    await DBContext.Destroy();
                    return Ok(new
                    {
                        resultCode = -1,
                        resultDesc = "Este usuario ya ha sido activado",
                        data = new { }
                    });
                }

                //Si el usuario no esta activado
                var variable = await DBContext.database.QueryAsync<VariablesGlobales>("WHERE  (varName = @0)", "TIEMPO_EXPIRACION_CODIGO_SMS").FirstOrDefaultAsync();

                DBContext.database.BeginTransaction();

                var LogCelular = new LogCelular()
                {
                    PersonaID = parData.PersonaID,
                    Celular = parData.Telefono,
                    //TODO: PREGUNTAR SI PARA EL LOG ES NECESARIO EL PERSONAID REAL 
                    PersonaIDModifica = 1,
                    UsuarioIDModifica = 1,
                    FechaHora = DateTime.Now,
                };

                int tiempoExp = Int32.Parse((string)variable.varValue);

                Random generator = new();
                var code = generator.Next(1000000, 9999999).ToString("D6");

                //Tipo de codigo
                var tipoCodigo = await DBContext.database.QueryAsync<TipoCodigoSMS>("WHERE (clave = @0)", "ACT").SingleOrDefaultAsync();

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

        //Codigo de recuperacion contraseña
        [HttpPost]
        [Route("CodigoRecuperacion")]
        public async Task<IActionResult> EnviarCodigoRecuperacion(PeticionesRest.AppLogin.AppLogin.CodigoRecuperacion parData)
        {
            try
            {
                //Verficar si el usuario existe
                var usuario = await DBContext.database.QueryAsync<Usuarios>("WHERE PersonaID = @0", parData.PersonaID).SingleOrDefaultAsync();

                if (usuario == null)
                {

                    await DBContext.Destroy();
                    return Ok(new
                    {
                        resultCode = -1,
                        resultDesc = "Este usuario no existe",
                        data = new { }
                    });
                }

                //Verficar si el UUID del dipositivo coincide con el usuario
                if (usuario.UUID != parData.UUID)
                {

                    await DBContext.Destroy();
                    return Ok(new
                    {
                        resultCode = -1,
                        resultDesc = "Este dispositivo no esta registrado para este usuario",
                        data = new { }
                    });
                }

                //Caso de todo correcto
                var variable = await DBContext.database.QueryAsync<VariablesGlobales>("WHERE  (varName = @0)", "TIEMPO_EXPIRACION_CODIGO_SMS").FirstOrDefaultAsync();

                DBContext.database.BeginTransaction();

                var LogCelular = new LogCelular()
                {
                    PersonaID = parData.PersonaID,
                    Celular = parData.Telefono,
                    //TODO: PREGUNTAR SI PARA EL LOG ES NECESARIO EL PERSONAID REAL 
                    PersonaIDModifica = 1,
                    UsuarioIDModifica = 1,
                    FechaHora = DateTime.Now,
                };

                int tiempoExp = Int32.Parse((string)variable.varValue);

                Random generator = new();
                var code = generator.Next(1000000, 9999999).ToString("D6");

                //Tipo de codigo
                var tipoCodigo = await DBContext.database.QueryAsync<TipoCodigoSMS>("WHERE (clave = @0)", "PAS").SingleOrDefaultAsync();

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

        [HttpPost]
        [Route("registrarDV")]
        public async Task<IActionResult> registrarUSuario(PeticionesRest.AppLogin.AppLogin.CreacionUsuarioDV pardata)
        {
            try
            {


                var Distribuidor = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Distribuidores_VW>("WHERE DistribuidorID = @0", pardata.DistribuidorID).SingleOrDefaultAsync();
                if (Distribuidor == null)
                {
                    await DBContext.Destroy();
                    return BadRequest(new
                    {
                        resultCode = -1,
                        resultDesc = "No existe la socia",
                        data = new { }
                    });
                }
                else
                {

                    var registrado = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE PersonaID = @0 AND (PersonaTelefonoMovil = @1)", Distribuidor.PersonaID, pardata.Telefono).SingleOrDefaultAsync();
                    if (registrado != null)
                    {
                        var parms = new
                        {
                            FechaCaduca = DateTime.Now,
                            PersonaID = pardata.DistribuidorID,
                            Codigo = pardata.Codigo,
                        };

                        var CodigoSMS = await DBContext.database.QueryAsync<CodigoSMS>("WHERE (PersonaID = @PersonaID) AND (Codigo = @Codigo) AND (FechaCaduca >= @FechaCaduca) AND (Confirmado = 0)", parms).FirstOrDefaultAsync();

                        if (CodigoSMS == null)
                        {
                            await DBContext.Destroy();
                            return BadRequest(new
                            {
                                resultCode = -3,
                                resultDesc = "Código Invalido",
                                data = new { }
                            });
                        }
                        else
                        {
                            var NuevaContraseña = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Seguridad.Usuarios>(registrado.UsuarioID);
                            NuevaContraseña.Contrasena = BCrypt.Net.BCrypt.HashPassword(pardata.Password);
                            await DBContext.database.UpdateAsync(NuevaContraseña);
                            await DBContext.Destroy();

                            return Ok(new
                            {
                                resultCode = 0,
                                resultDesc = "Se actualizó la Contraseña.",
                                data = new { }
                            });
                        }

                    }
                    else
                    {

                        var parms = new
                        {
                            FechaCaduca = DateTime.Now,
                            PersonaID = pardata.DistribuidorID,
                            Codigo = pardata.Codigo,
                        };

                        var CodigoSMS = await DBContext.database.QueryAsync<CodigoSMS>("WHERE (PersonaID = @PersonaID) AND (Codigo = @Codigo) AND (FechaCaduca >= @FechaCaduca) AND (Confirmado = 0)", parms).FirstOrDefaultAsync();

                        if (CodigoSMS == null)
                        {
                            await DBContext.Destroy();
                            return BadRequest(new
                            {
                                resultCode = -3,
                                resultDesc = "Código Invalido",
                                data = new { }
                            });
                        }
                        else
                        {
                            DBContext.database.BeginTransaction();

                            var DatosPersona = await DBContext.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE PersonaID = @0", Distribuidor.PersonaID).SingleOrDefaultAsync();

                            var tel = pardata.Telefono;//.Substring(5, pardata.Telefono.Length - 5);

                            if (tel != DatosPersona.TelefonoMovil)
                            {
                                await DBContext.Destroy();
                                return BadRequest(new
                                {
                                    resultCode = -4,
                                    resultDesc = "El teléfono proporcionado es diferente al que se le registró a la socia, verifique",
                                    data = new { }
                                });
                            }
                            else
                            {

                                var passEncriptada = BCrypt.Net.BCrypt.HashPassword(pardata.Password);

                                CodigoSMS.Confirmado = true;

                                await DBContext.database.UpdateAsync(CodigoSMS);

                                var Usuario = new DBContext.DBConfia.Seguridad.Usuarios()
                                {
                                    PersonaID = (long)Distribuidor.PersonaID,
                                    Usuario = tel, //DatosPersona.TelefonoMovil,
                                    Contrasena = passEncriptada,
                                    Nombre = DatosPersona.Nombre + " " + DatosPersona.ApellidoPaterno + " " + DatosPersona.ApellidoMaterno,
                                    Correo = DatosPersona.CorreoElectronico.Length > 1 ? DatosPersona.CorreoElectronico : null,
                                    Bloqueado = false,
                                    BloqueadoPermanente = false,
                                    MasterUser = false,
                                    SystemUser = false,
                                    SupportUser = false,
                                    TodosLosCoordinadores = false,
                                    fhAlta = DateTime.Now,
                                    ValidacionFecha = DateTime.Now,
                                    MasterPagos = false,
                                    ContrasenaRestablecida = false,
                                    AccesoAppCobranzaPS = false,
                                    AccesoAppValesPS = true, //Empresa.empresaId == 6 ? true : false,
                                    empresaId = Distribuidor.EmpresaId,
                                    // empresaId = Empresa.empresaId,
                                    UUID = pardata.UUID
                                };

                                await DBContext.database.InsertAsync(Usuario);

                                if (Usuario.UsuarioID == 0)
                                {
                                    throw new Exception();
                                }

                                var relacionPersonaUsuario = new DBContext.DBConfia.Seguridad.Usuarios_Personas()
                                {
                                    PersonaID = (long)Distribuidor.PersonaID,
                                    UsuarioID = Usuario.UsuarioID,
                                    Activo = true,
                                    FechaAlta = DateTime.Now,
                                    FechaBaja = DateTime.Now,
                                    FechaModificacion = DateTime.Now,
                                };

                                await DBContext.database.InsertAsync(relacionPersonaUsuario);

                                var DistribuidorActualizar = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Distribuidores>("WHERE DistribuidorID = @0", Distribuidor.DistribuidorID).SingleOrDefaultAsync();

                                DistribuidorActualizar.AccesoAppVales = true;
                                DistribuidorActualizar.AccesoAppVales2 = true;

                                await DBContext.database.UpdateAsync(DistribuidorActualizar);

                                // try
                                // {                         
                                // var PrefijoApp = (Usuario.Usuario.Substring(0, 4));
                                // var Empresa = await DBContext.database.QueryAsync<Empresas>("WHERE (PrefijoApp = @0)", PrefijoApp).SingleOrDefaultAsync();

                                var Producto = await DBContext.database.QueryAsync<Productos>("WHERE (EmpresaId = @0) AND (Principal = 1)", Distribuidor.EmpresaId).SingleOrDefaultAsync();
                                // var Producto = await DBContext.database.QueryAsync<Productos>("WHERE (EmpresaId = @0) AND (Principal = 1)", Empresa.empresaId).SingleOrDefaultAsync();

                                var Usuarios_Roles = new DBContext.DBConfia.Seguridad.Usuarios_Roles()
                                {
                                    UsuarioID = Usuario.UsuarioID,
                                    ProductoID = Producto.ProductoID,
                                    RolID = 56,
                                    CreacionFecha = DateTime.Now,
                                    CreacionUsuarioID = Usuario.UsuarioID,
                                };

                                await DBContext.database.InsertAsync(Usuarios_Roles);

                                if (Usuarios_Roles.UsuarioRolID == 0)
                                {
                                    throw new Exception();
                                }

                                var Roles_Permisos = await DBContext.database.FetchAsync<DBContext.DBConfia.Seguridad.Roles_Permisos>("WHERE (RolID = @0)", Usuarios_Roles.RolID);

                                foreach (var permiso in Roles_Permisos)
                                {
                                    var Usuarios_Permisos = new DBContext.DBConfia.Seguridad.Usuarios_PermisosEspeciales()
                                    {
                                        UsuarioID = Usuario.UsuarioID,
                                        ProductoID = Producto.ProductoID,
                                        PermisoID = permiso.PermisoID,
                                        CreacionFecha = DateTime.Now,
                                        CreacionUsuarioID = Usuario.UsuarioID,
                                    };

                                    await DBContext.database.InsertAsync(Usuarios_Permisos);

                                    if (Usuarios_Permisos.UsuarioPermisoEspecialID == 0)
                                    {
                                        throw new Exception();
                                    }
                                }

                                // } catch(Exception ex) {
                                //     Console.WriteLine(ex.Message);
                                // }

                                DBContext.database.CompleteTransaction();

                                await DBContext.Destroy();
                                var res = new
                                {
                                    resultCode = 0,
                                    resultDesc = "OK.",
                                    data = "Usuario registrado"
                                };
                                return Ok(res);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                DBContext.database.AbortTransaction();
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        // [HttpPost]
        // [Route("actualizarContrasena")]
        // public async Task<IActionResult> RecuperarContrasena(PeticionesRest.AppLogin.AppLogin.C pardata)
        // {
        //     try
        //     {

        //         //Buscar usuario
        //         var usuario = await DBContext.database.QueryAsync<Usuarios>("WHERE PersonaID = @0", pardata.DistribuidorID).SingleOrDefaultAsync();


        //         //Verificar el ID del dispositivo
        //         if (usuario.UUID != pardata.UUID)
        //         {
        //             await DBContext.Destroy();
        //             return BadRequest(new
        //             {
        //                 resultCode = -1,
        //                 resultDesc = "El dispositivo no esta registrado para este usuario",
        //             });
        //         }

        //         //Buscar codigo
        //         var code = await DBContext.database.QueryAsync<CodigoSMS>("WHERE (PersonaID = @0) AND (Codigo = @1) AND (Confirmado = 0)", pardata.DistribuidorID, pardata.Codigo).SingleOrDefaultAsync();

        //         //Verificar si el codigo es valido
        //         if (code == null)
        //         {
        //             await DBContext.Destroy();
        //             return BadRequest(new
        //             {
        //                 resultCode = -1,
        //                 resultDesc = "Codigo invalido",
        //             });
        //         }

        //         //Verificar si el codigo ha caducado
        //         if (code.FechaCaduca < DateTime.Now)
        //         {
        //             await DBContext.Destroy();
        //             return BadRequest(new
        //             {
        //                 resultCode = -1,
        //                 resultDesc = "Codigo caducado",
        //             });
        //         }

        //         //Caducar codigo
        //         code.Confirmado = true;
        //         await DBContext.database.UpdateAsync(code);

        //         //Actualizar contraseña
        //         var passEncriptada = BCrypt.Net.BCrypt.HashPassword(pardata.Password);
        //         usuario.Contrasena = passEncriptada;
        //         await DBContext.database.UpdateAsync(usuario);

        //         await DBContext.Destroy();

        //         return Ok(new
        //         {
        //             resultCode = 0,
        //             resultDesc = "Contraseña actualizada",
        //         });
        //     }
        //     catch (Exception ex)
        //     {
        //         await DBContext.Destroy();
        //         return BadRequest(new
        //         {
        //             resultCode = -1,
        //             resultDesc = ex.Message,
        //         });
        //     }
        // }

        [HttpPost]
        [Route("validarSocia")]
        public async Task<IActionResult> ValidarSocia(PeticionesRest.AppLogin.AppLogin.ValidacionDv pardata)
        {
            try
            {
                //Verificar si el usuario existe
                var Distribuidor = await DBContext.database.QueryAsync<Distribuidores_VW>("WHERE DistribuidorID = @0", pardata.DistribuidorID).SingleOrDefaultAsync();

                if (Distribuidor == null)
                {
                    await DBContext.Destroy();
                    return BadRequest(new
                    {
                        resultCode = -1,
                        resultDesc = "No existe la socia",
                    });
                }

                //Verificar que el telefono sea el mismo
                var Persona = await DBContext.database.QueryAsync<Personas>("WHERE PersonaID = @0", Distribuidor.PersonaID).SingleOrDefaultAsync();

                if (pardata.Telefono != Persona.TelefonoMovil)
                {
                    await DBContext.Destroy();
                    return BadRequest(new
                    {
                        resultCode = -1,
                        resultDesc = "El teléfono proporcionado es diferente al que se le registró a la socia, verifique",
                    });
                }

                var usuario = await DBContext.database.QueryAsync<Usuarios>("WHERE PersonaID = @0", pardata.DistribuidorID).SingleOrDefaultAsync();

                //Validamos que no este validado
                if (usuario.Validacion)
                {
                    await DBContext.Destroy();
                    return BadRequest(new
                    {
                        resultCode = -1,
                        resultDesc = "Este usuario ya ha sido activado",
                    });
                }


                //Validamos que la contraseña sea la misma
                var usuarioWithUseranme = await DBContext.database.QueryAsync<UsuariosVW>("WHERE PersonaTelefonoMovil = @0", pardata.Telefono).SingleOrDefaultAsync();

                if (!await ValidarCredenciales(usuarioWithUseranme.Usuario, pardata.Password))
                {
                    await DBContext.Destroy();
                    return BadRequest(new
                    {
                        resultCode = -1,
                        resultDesc = "Las credenciales son incorrectas, por favor verifique su usuario y contraseña",
                    });
                }

                //Buscar codigo
                var code = await DBContext.database.QueryAsync<CodigoSMS>("WHERE (PersonaID = @0) AND (Codigo = @1) AND (Confirmado = 0)", pardata.DistribuidorID, pardata.Codigo).SingleOrDefaultAsync();

                //Verificar si el codigo es valido
                if (code == null)
                {
                    await DBContext.Destroy();
                    return BadRequest(new
                    {
                        resultCode = -1,
                        resultDesc = "Codigo invalido",
                    });
                }

                //Verificar si el codigo ha caducado
                if (code.FechaCaduca < DateTime.Now)
                {
                    await DBContext.Destroy();
                    return BadRequest(new
                    {
                        resultCode = -1,
                        resultDesc = "Este codigo ha caducado",
                    });
                }

                //Caducar codigo
                code.Confirmado = true;
                await DBContext.database.UpdateAsync(code);

                usuario.Validacion = true;
                usuario.UUID = pardata.UUID;
                usuario.ValidacionFecha = DateTime.Now;
                usuario.AccesoAppValesPS = true;

                //Actualizamos el usuario
                await DBContext.database.UpdateAsync(usuario);

                var relacionPersonaUsuario = new Usuarios_Personas()
                {
                    PersonaID = (long)Distribuidor.PersonaID,
                    UsuarioID = usuario.UsuarioID,
                    Activo = true,
                    FechaAlta = DateTime.Now,
                    FechaBaja = DateTime.Now,
                    FechaModificacion = DateTime.Now,
                };

                //ERROR AQUI PORQUE YA SE ENCUENTRA REGISTRADO USUARIO 104
                await DBContext.database.InsertAsync(relacionPersonaUsuario);

                var DistribuidorActualizar = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Distribuidores>("WHERE DistribuidorID = @0", Distribuidor.DistribuidorID).SingleOrDefaultAsync();
                DistribuidorActualizar.AccesoAppVales = true;
                DistribuidorActualizar.AccesoAppVales2 = true;
                await DBContext.database.UpdateAsync(DistribuidorActualizar);

                //Cerrar transaccion                
                await DBContext.Destroy();

                return Ok(new
                {
                    resultCode = 0,
                    resultDesc = "Usuario validado",
                });

            }
            catch (Exception ex)
            {
                DBContext.database.AbortTransaction();
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = "Error al validar el usuario",
                });

            }
        }

        #region Funciones

        //Funcion para validar credenciales
        private async Task<bool> ValidarCredenciales(string Usuario, string Password)
        {
            try
            {
                var res = await GetTokenLclAsync(Usuario, Password);
                var ret = res.IsSuccessStatusCode;

                //Cerrar token
                var resLog = await LogOutToken(res);

                return ret;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return false;
            }
        }

        //Funcion para obtener el token de un usuario
        private async Task<HttpResponseMessage> GetTokenLclAsync(string Usuario, string Password)
        {
            try
            {
                //Validamos que la contraseña sea la misma
                string url_token = "https://kc.fconfia.com/realms/SistemaCV_Demo/protocol/openid-connect/token";
                var nvc = new List<KeyValuePair<string, string>>
                {
                    new KeyValuePair<string, string>("client_id", "uicv"),
                    new KeyValuePair<string, string>("username", Usuario),
                    new KeyValuePair<string, string>("password", Password),
                    new KeyValuePair<string, string>("grant_type", "password")
                };

                var client = new HttpClient();
                var req = new HttpRequestMessage(HttpMethod.Post, url_token) { Content = new FormUrlEncodedContent(nvc) };
                var res = await client.SendAsync(req);

                return res;

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }

        }

        //Funcion para caducar un token
        private async Task<HttpResponseMessage> LogOutToken(HttpResponseMessage data)
        {
            try
            {
                var content = await data.Content.ReadAsStringAsync();
                var json = JObject.Parse(content);
                var access_token = json["access_token"].ToString();
                var handler = new JwtSecurityTokenHandler();
                var token_decode = handler.ReadJwtToken(access_token);
                var payload = token_decode.Payload;
                var sub = payload["sub"].ToString();
                var sid = payload["sid"].ToString();

                string urlLogOut = "https://kc.fconfia.com/realms/SistemaCV_Demo/ConfiaRestID/logout__token_id";
                var nvc = new List<KeyValuePair<string, string>>
                {
                    new KeyValuePair<string, string>("sub", sub),
                    new KeyValuePair<string, string>("sid", sid)
                };

                var client = new HttpClient();
                var req = new HttpRequestMessage(HttpMethod.Post, urlLogOut) { Content = new FormUrlEncodedContent(nvc) };
                var res = await client.SendAsync(req);

                return res;

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

        #endregion
    }
}
