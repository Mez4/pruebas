using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using System.Globalization;
using Newtonsoft.Json;
using ConfiaWebApi.PeticionesRest.Sistema.Usuarios;

using DBContext.DBConfia;
using System.Collections.Generic;
using System.IO;
using DBContext.DBConfia.Seguridad;
using System.Collections;
using Microsoft.AspNetCore.Server.HttpSys;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Text.RegularExpressions;
using DBContext.DBConfia.Custom.Seguridad;
using ConfiaWebApi.PeticionesRest.Sistema.AccesosWebCobranza;
using ConfiaWebApi.PeticionesRest.Sistema.AccesoCarteraCompleta;

namespace ConfiaWebApi.Controllers.Sistema
{
    [Authorize]
    [ApiController]
    [Route("api/Sistema/[controller]")]
    public class UsuariosController : ControllerBase
    {
        /// <summary>
        /// Conexion a base de datos
        /// </summary>
        private DBConfiaContext ConexionBD;

        /// <summary>
        /// Configuracion del servicio
        /// </summary>
        private IConfiguration Configuracion;

        /// <summary>
        /// Constructor del controlador
        /// </summary>
        /// <param name="_ConexionBD">Conexión de datos para el controlador</param>
        public UsuariosController(DBConfiaContext _ConexionBD, IConfiguration _Configuration)
        {
            this.ConexionBD = _ConexionBD;
            this.Configuracion = _Configuration;
        }

        #region Operaciones usuario

        /// <summary>
        /// Agrega un usaurio a la base de datos incluyendo el registro de persona
        /// </summary>
        /// <param name="pData">Detalle del usuario/persona</param>
        /// <returns></returns>

        //Nuevo endpoint para descargar biometricos
        [HttpGet]
        [Route("obtenerBiometricos")]
        [Authorize]
        public async Task<IActionResult> getBiometricos()
        {
           //Descargar archivo de wwwwroot el archivo Biometricos.msi
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "Descargables/Biometricos_CV.zip");
            var fileBytes = await System.IO.File.ReadAllBytesAsync(filePath);
            var fileName = Path.GetFileName(filePath);
            return File(fileBytes, "application/octet-stream", fileName);
         
        }

        [HttpPost]
        [Route("aplicarPermisosEspeciales")]
        [Authorize]
        public async Task<IActionResult> postAplicarPermisos()
        {
            var productos = await this.ConexionBD.database.FetchAsync<DBContext.DBConfia.Creditos.ProductosVW>();
            await ConexionBD.Destroy();
            return Ok(productos);

        }

        [HttpGet]
        [Route("obtenerProductosDisponibles")]
        [Authorize]
        public async Task<IActionResult> getProductos()
        {
            var productos = await this.ConexionBD.database.FetchAsync<DBContext.DBConfia.Creditos.ProductosVW>();
            await ConexionBD.Destroy();
            return Ok(productos);

        }

        [HttpPut]
        [Route("agregar")]
        [Authorize]
        public async Task<IActionResult> AgregarUsuario(PeticionesRest.Seguridad.Usuarios.Agregar parData)
        {
            // Asignamos un codigo de validación por password
            var codigoValidacion = Guid.NewGuid().ToString().Split("-")[0].Substring(0, 6).ToUpper();

            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            var Person = await ConexionBD.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE  (CURP = @CURP) AND (RFC = @RFC)", parData).SingleOrDefaultAsync();
            if (Person != null)
            {
                await this.ConexionBD.Destroy();
                return BadRequest("Ya existe una parsona con ese RFC y/o CURP");
            }

            try
            {
                // Insert a person
                var persona = new DBContext.DBConfia.General.Personas()
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
                    CreacionFecha = DateTime.Now,
                    BuroInternoEstatusID = 1
                };

                // Generamos el registro de empleado
                try
                {
                    // Comenzamos una transaccion
                    ConexionBD.database.BeginTransaction();

                    // Insertamos el usuario y persona
                    await ConexionBD.database.InsertAsync(persona);

                    var usuario = new DBContext.DBConfia.Seguridad.Usuarios()
                    {
                        Bloqueado = false,
                        BloqueadoPermanente = false,
                        comentarioBloqueo = "",
                        Contrasena = Guid.NewGuid().ToString(),
                        ContratantePagos = 0,
                        fhAlta = DateTime.Now,
                        fhBloqueo = null,
                        fhUltimoAcceso = null,
                        fhUltimoCambioContrasena = null,
                        MasterPagos = false,
                        MasterUser = false,
                        SupportUser = false,
                        SystemUser = false,
                        TodosLosCoordinadores = false,
                        Usuario = parData.tipoUsuario == 1 ? parData.CorreoElectronico : parData.TelefonoMovil,
                        usuarioIdBloquea = null,
                        Validacion = true,
                        ValidacionCodigo = BCrypt.Net.BCrypt.HashPassword(codigoValidacion),
                        ValidacionFecha = null,
                        Nombre = parData.Nombre + " " + parData.ApellidoPaterno + " " + parData.ApellidoMaterno,
                        Correo = parData.CorreoElectronico,
                        PersonaID = persona.PersonaID,
                        UsuarioRapido = false
                    };

                    await ConexionBD.database.InsertAsync(usuario);
                    await ConexionBD.database.InsertAsync(new DBContext.DBConfia.Seguridad.Usuarios_Personas()
                    {
                        Activo = true,
                        FechaAlta = DateTime.Now,
                        PersonaID = persona.PersonaID,
                        UsuarioID = usuario.UsuarioID,
                        FechaBaja = new DateTime(1970, 1, 1),
                        FechaModificacion = DateTime.Now
                    });

                    // Completamos la transacción
                    ConexionBD.database.CompleteTransaction();

                    // Get our user
                    var return_user = await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>().Where(x => x.UsuarioID == usuario.UsuarioID).FirstOrDefault();

                    // Destroy our connection
                    await ConexionBD.Destroy();

                    // Enviamos el codigo del nuevo usuario
                    await Code.MailSender.Usuarios__Nuevo(return_user.Usuario, codigoValidacion);

                    // Details
                    return Ok("USUARIO REGISTRADO EXITOSAMENTE" + return_user);

                }
                catch (Exception ex)
                {

                    // Comenzamos una transaccion
                    ConexionBD.database.AbortTransaction();

                    // Details
                    await this.ConexionBD.Destroy();

                    return BadRequest("Error al procesar el nuevo usuario: " + ex.Message);

                }

            }
            catch (Exception ex)
            {
                return BadRequest("Error al procesar el nuevo usuario: " + ex.Message);
            }
        }

        [HttpPost]
        [Route("agregarRapido")]
        [Authorize]
        public async Task<IActionResult> AgregarUsuarioRapido(PeticionesRest.Seguridad.Usuarios.AgregarRapido parData)
        {

            // Obtenemos el email del usuario de los claims
            var UserName2 = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName2).FirstOrDefaultAsync();

            var Person = await ConexionBD.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE  (CURP = @CURP)", parData).SingleOrDefaultAsync();
            if (Person != null)
            {
                await this.ConexionBD.Destroy();
                return BadRequest("Ya existe una parsona con ese RFC y/o CURP");
            }
            parData.ArrayIds = "1";
            parData.SucursalID = 0;
            // parData.ArrayIds = JsonConvert.SerializeObject(parData.ArrayIds);
            parData.ArrayIds = " ";
            parData.CreacionUsuarioID = UsuarioActual.UsuarioID;
            try
            {
                var CrearUsuarioRespuesta = await ConexionBD.database.QueryAsync<CrearUsuarioResp>("EXEC Creditos.pa_CreaUsuarioSistema @Nombre, @ApellidoPat, @ApellidoMat, @CorreoElectronico, @CURP, @ProductoID, @SucursalID, @ArrayIds, @CreacionUsuarioID, @FechaNacimiento, @SACId", parData).FirstOrDefaultAsync();
                if (CrearUsuarioRespuesta.IDRespuesta != 1)
                {
                    await this.ConexionBD.Destroy();
                    return BadRequest("Error al crear usuario, favor de reportar a sistemas");
                }
                var return_user = await this.ConexionBD.database.QueryAsync<UsuariosVW>().Where(x => x.UsuarioID == CrearUsuarioRespuesta.UsuarioID).FirstOrDefault();
                //return Ok("USUARIO REGISTRADO EXITOSAMENTE");
                return Ok(return_user);

            }
            catch (Exception ex)
            {
                return BadRequest("Error al procesar el nuevo usuario: " + ex.Message);
            }
        }

        [HttpPut]
        [Route("actualizar")]
        [Authorize]
        public async Task<IActionResult> actualizar(PeticionesRest.Seguridad.Usuarios.Actualizar parData)
        {
            var transaccion = false;
            try
            {
                //var newcontrasena = Guid.NewGuid().ToString().Replace("-", "").Substring(new Random().Next(0, 25), 12);
                var newcontrasena = "ConfiaCV";
                var Usuario = await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>().Where(x => x.UsuarioID == parData.UsuarioID).FirstOrDefault();
                if (Usuario != null)
                {
                    Usuario.Contrasena = BCrypt.Net.BCrypt.HashPassword(newcontrasena);
                    Usuario.CambiarContrasena = false;
                    ConexionBD.database.BeginTransaction();
                    Usuario.CambiarContrasena = true;
                    transaccion = true;
                    await ConexionBD.database.UpdateAsync(Usuario);
                    ConexionBD.database.CompleteTransaction();
                    await ConexionBD.Destroy();
                }
                Usuario.Contrasena = newcontrasena;
                return Ok(Usuario);

            }
            catch (Exception ex)
            {
                if (transaccion) ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("UpdateUsuario")]
        [Authorize]
        public async Task<IActionResult> UpdateUsuario(PeticionesRest.Seguridad.Usuarios.ActualizarUsuario parData)
        {
            var UserName2 = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActualiza = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName2).FirstOrDefaultAsync();

            parData.UsuarioIDActualiza = UsuarioActualiza.UsuarioID;
            try
            {
                // Actualiza el usuario
                var resultado = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.AdminUsuarios>("EXEC Seguridad.pa_UpdateUsuario @UsuarioID, @UsuarioIDActualiza, @Usuario, @CorreoElectronico, @NombrePersona, @ApellidoPaterno, @ApellidoMaterno, @ProductoID", parData).FirstOrDefaultAsync();

                // Cerramos las conexiones
                await this.ConexionBD.Destroy();

                // Regresamos el mensaje de respuesta del sp
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                await this.ConexionBD.Destroy();
                // Cerramos las conexiones
                return BadRequest("Error al actualizar usuario: " + ex.Message);
            }
        }

        [HttpPut]
        [Route("RestablecerContra")]
        [Authorize]
        public async Task<IActionResult> RestablecerContra(PeticionesRest.Seguridad.Usuarios.Actualizar parData)
        {
            var transaccion = false;
            try
            {
                //var newcontrasena = Guid.NewGuid().ToString().Replace("-", "").Substring(new Random().Next(0, 25), 12);
                var newcontrasena = parData.Contrasena;
                var Usuario = await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>().Where(x => x.UsuarioID == parData.UsuarioID).FirstOrDefault();
                if (Usuario != null)
                {
                    Usuario.Contrasena = BCrypt.Net.BCrypt.HashPassword(newcontrasena);
                    Usuario.CambiarContrasena = false;
                    ConexionBD.database.BeginTransaction();
                    Usuario.CambiarContrasena = false;
                    transaccion = true;
                    await ConexionBD.database.UpdateAsync(Usuario);
                    ConexionBD.database.CompleteTransaction();
                    await ConexionBD.Destroy();
                }
                Usuario.Contrasena = newcontrasena;
                return Ok(Usuario);

            }
            catch (Exception ex)
            {
                if (transaccion) ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("updateContrasena")]
        [Authorize]
        public async Task<IActionResult> updateContrasena(PeticionesRest.Seguridad.Usuarios.Actualizar parData)
        {

            var transaccion = false;
            try
            {
                var newcontrasena = parData.Contrasena;

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var Usuario = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                if (Usuario != null)
                {
                    Usuario.Contrasena = BCrypt.Net.BCrypt.HashPassword(newcontrasena);
                    Usuario.CambiarContrasena = true;
                    ConexionBD.database.BeginTransaction();
                    transaccion = true;
                    await ConexionBD.database.UpdateAsync(Usuario);
                    ConexionBD.database.CompleteTransaction();
                    await ConexionBD.Destroy();
                }

                return Ok(Usuario);

            }

            catch (Exception ex)
            {
                if (transaccion) ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpGet]
        [Authorize]
        [Route("GetUsuarios")]
        public async Task<IActionResult> GetUsuarios()
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var resultado = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                // Obtenemos los usuarios
                // var resultado = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Seguridad.Usuarios>();
                // Cerramos las conexiones
                await this.ConexionBD.Destroy();
                // Regresamos los usuarios
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                // Cerramos las conexiones
                await this.ConexionBD.Destroy();
                return BadRequest("Error al obtener los usuarios: " + ex.Message);
            }
        }



        /// <summary>
        /// Obtenemos los permisos del usuario
        /// </summary>
        /// <param name="id">Id del usuario</param>
        /// <returns>Instancia del usuario</returns>
        [HttpGet("pa/{id:int}")]
        [Authorize]
        public async Task<IActionResult> PermisosActuales(int id)
        {
            try
            {
                // Validamos nuestro usuario actual
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                if (UsuarioActual != null)
                {
                    // Obtener la dirección IP del usuario
                    var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();

                    // Obtener el User-Agent (si está disponible)
                    var userAgent = HttpContext.Request.Headers["User-Agent"].ToString();

                    // Obtener el Hostname del usuario a partir de la IP
                    string hostName = "Desconocido";
                    if (!string.IsNullOrEmpty(ipAddress))
                    {
                        try
                        {
                            var entry = System.Net.Dns.GetHostEntry(ipAddress);
                            hostName = entry.HostName;
                        }
                        catch
                        {
                            // Si no se puede resolver, dejamos "Desconocido"
                        }
                    }

                    // Ejecutar el procedimiento almacenado para registrar el login
                    //await ConexionBD.database.ExecuteAsync("EXEC RegisterLogin @0, @1, @2, @3",
                      //  UserName, ipAddress, userAgent, hostName);
                }
                // Permisos
                dynamic Resultado = null;

                //Obtener de appsettings.json la cadena de conexion
                var cadena = Configuracion.GetConnectionString("DBConfia");
                // Definir el patrón de expresión regular para buscar una dirección IP después de "Server="
                string patron = @"Server=(\d+\.\d+\.\d+\.\d+)";

                // Buscar coincidencias en la cadena utilizando la expresión regular
                Match match = Regex.Match(cadena, patron);
                var ipFinal = "";

                // Verificar si se encontró una coincidencia y obtener la dirección IP
                if (match.Success)
                {
                    string direccionIP = match.Groups[1].Value;
                    //Ahora solo me interesa saber el ultimo segmento xxx.xxx.xxx.xxx 
                    direccionIP = direccionIP.Substring(direccionIP.LastIndexOf(".") + 1);
                    ipFinal = direccionIP;
                    Console.WriteLine("Dirección IP: " + direccionIP);
                }

                // Procesamos
                if (UsuarioActual.MasterUser)
                {
                    Resultado = new
                    {
                        DireccionIP = ipFinal,
                        PermisosGenerales = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.PermisosGlobalesVW>().Where(x => x.ModuloRequiereProducto == false && x.ProductoActivo == true && x.ProductoPrincipal == true).ToArray(),
                        PermisosProductos = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.PermisosGlobalesVW>().Where(x => x.ModuloRequiereProducto == true && x.ProductoActivo == true && x.ProductoPrincipal == true).OrderBy(x => x.ProductoNombre).ThenBy(x => x.EmpresaId).ToArray(),
                        // PermisosExportar = await ConexionBD.database.QueryAsync<dynamic>("SELECT * FROM General.PermisosExcel pe WHERE pe.Activo = 1 and (pe.UsuarioID = @0)", UsuarioActual.UsuarioID).ToArrayAsync()
                    };
                }
                else
                {
                    //nuevo if !Usuario.permiso
                    // OBTENEMOS LA HORA INICIAL EN VARIABLESGLOBALES - ESTE PEDAZO DE CODIGO SE PUEDE MEJORAR A UN PROCEDIMIENTO ALMACENADO
                    var start_close_hour = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Catalogos.VariablesGlobales>("WHERE varName ='HORA_INICIO_APERTURA'").SingleOrDefaultAsync();
                    // OBTENEMOS TAMBIEN LA HORA FINAL
                    var start_open = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Catalogos.VariablesGlobales>("WHERE varName ='HORA_FIN_APERTURA'").SingleOrDefaultAsync();
                    // SI NINGUNO LLEGA NULO
                    if (start_close_hour != null && start_open != null)
                    {
                        // ASIGNAMOS LAS HORAS EN LAS NUEVAS VARIABLES
                        var startHour = start_close_hour.varValue;
                        var endHour = start_open.varValue;
                        // SE HARA EL PROCEDIMIENTO PARA OBTENER SOLO EL NUMERO DE HORA DE LA CADENA EJ: 18:00:00
                        DateTime timeParseStart;
                        DateTime timeParseEnd;
                        if (DateTime.TryParseExact((string)startHour, "HH:mm:ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out timeParseStart) &&
                            DateTime.TryParseExact((string)endHour, "HH:mm:ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out timeParseEnd))
                        {
                            int numberStart = timeParseStart.Hour;
                            int numberEnd = timeParseEnd.Hour;
                            //  DateTime.Now.Hour               1       18                       1      21
                            // PREGUNTAMOS SI LA HORA ACTUAL ESTA FUERA DEL HORARIO LABORAL
                            if (DateTime.Now.Hour >= numberEnd || DateTime.Now.Hour <= numberStart)
                            {
                                // PREGUNTAMOS SI TIENE ALGUN PERMISO PARA CONTINUAR
                                if (UsuarioActual.Acceso == false)
                                {
                                    // context.Result = new ObjectResult("Usuario no permitido fuera del horario establecido") { StatusCode = 401 };
                                    await ConexionBD.Destroy();
                                    return Ok(new
                                    {
                                        status = false,
                                        accion = 1,
                                        err = ""
                                    });
                                }

                            }
                        }
                    }
                    Resultado = new
                    {
                        DireccionIP = ipFinal,
                        PermisosGenerales = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosPermisosVW>().Where(x => x.UsuarioID == id && x.ModuloRequiereProducto == false).ToArray(),
                        PermisosProductos = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosPermisosVW>().Where(x => x.UsuarioID == id && x.ModuloRequiereProducto == true).ToArray(),
                    };
                }

                // Close the connection
                await this.ConexionBD.Destroy();

                // Regresamos los usuarios
                return Ok(new
                {
                    status = true,
                    accion = 0,
                    data = Resultado
                });
            }
            catch (Exception ex)
            {
                return Ok(new
                {
                    status = false,
                    accion = 2,
                    err = ex.Message
                });
                // return BadRequest(string.Format("Error al obtener el usuario: {0}", ex.Message));
            }
        }

        /// <summary>
        /// Obtenemos un usuario con su Id
        /// </summary>
        /// <param name="id">Id del usuario</param>
        /// <returns>Instancia del usuario</returns>
        [HttpGet("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Get(int id)
        {
            try
            {
                // Get the user
                var res = await ConexionBD.database.FirstOrDefaultAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE UsuarioID=@0", id);

                // Close the connection
                await this.ConexionBD.Destroy();

                // Regresamos los usuarios
                return Ok(res);
            }
            catch (Exception ex)
            {
                return BadRequest(string.Format("Error al obtener el usuario: {0}", ex.Message));
            }
        }

        /// <summary>
        /// Obtenemos todos los usuarios de la base de datos
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> Get()
        {
            try
            {
                // Obtenemos los usuarios
                var resultado = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Seguridad.UsuariosVW>();

                // Cerramos las conexiones
                await this.ConexionBD.Destroy();

                // Regresamos los usuarios
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return BadRequest("Error al obtener los usuarios: " + ex.Message);
            }
        }

        [HttpGet]
        [Route("GetAdminUsuarios")]
        [Authorize]
        public async Task<IActionResult> GetAdminUsuarios()
        {
            try
            {
                // Obtenemos los usuarios
                /* var resultado = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Seguridad.UsuariosVW>(); */
                var resultado = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.AdminUsuarios>("EXEC Seguridad.pa_getAdminUsuarios").ToArrayAsync();

                // Cerramos las conexiones
                await this.ConexionBD.Destroy();

                // Regresamos los usuarios
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return BadRequest("Error al obtener los usuarios: " + ex.Message);
            }
        }

        [HttpPut]
        [Route("ActivarWebCobranza")]
        [Authorize]
        public async Task<IActionResult> ActivarWebCobranza(ActivarWebCobranza parData)
        {
            try
            {
                // Actualiza el usuario
                var resultado = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.AdminUsuarios>("EXEC Seguridad.pa_UpdateAccesosWebCobranza @esDirectorCobranzaWeb, @esSubdirectorCobranzaWeb, @esZonalCobranzaWeb, @esGerenteCobranzaWeb, @esCoordinadorCobranzaWeb, @esGestorCobranzaWeb, @UsuarioID", parData).FirstOrDefaultAsync();

                // Cerramos las conexiones
                await this.ConexionBD.Destroy();

                // Regresamos el mensaje de respuesta del sp
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return BadRequest("Error al actualizar accesos: " + ex.Message);
            }
        }

        [HttpPut]
        [Route("UpdateCarteraCompleta")]
        [Authorize]
        public async Task<IActionResult> UpdateCarteraCompleta(ActivarAccesoCarteraCompleta parData)
        {
            try
            {
                // Actualiza el usuario
                var resultado = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.AdminUsuarios>("EXEC Seguridad.pa_UpdateAccesoCarteraCompleta @AccesoCarteraCompleta, @UsuarioID", parData).FirstOrDefaultAsync();

                // Cerramos las conexiones
                await this.ConexionBD.Destroy();

                // Regresamos el mensaje de respuesta del sp
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return BadRequest("Error al actualizar acceso a cartera completa: " + ex.Message);
            }
        }

        /// <summary>
        /// Bloqueamos un usuario
        /// </summary>
        /// <param name="parData">Nombre de usuario</param>
        /// <returns>Usuario bloqueado</returns>
        [HttpPost]
        [Route("bloquear")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> Bloquear(ConfiaWebApi.PeticionesRest.Sistema.Usuarios.Interactuar parData)
        {
            try
            {
                // Validamos nuestro usuario actual
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                // Obtenemos el usuario activo
                var UsuarioBD = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE Usuario=@0", parData.Usuario).SingleOrDefaultAsync();

                // Obtenemos el ID del usuario
                if (UsuarioBD is null)
                    return BadRequest("No cuenta con usuarios activos");

                // Actualizamos el usuario
                UsuarioBD.Bloqueado = true;
                UsuarioBD.usuarioIdBloquea = UsuarioActual.UsuarioID;
                UsuarioBD.BloqueadoPermanente = false;
                UsuarioBD.fhBloqueo = DateTime.Now;
                await ConexionBD.database.UpdateAsync(UsuarioBD);

                // Regresa el usuario
                var res = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE UsuarioID=@0", UsuarioBD.UsuarioID).FirstOrDefaultAsync();
                await this.ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Enviamos un correo para reseteo de password, este proceso bloquea (soft) el usuario
        /// </summary>
        /// <param name="parData">Usuario a bloquear</param>
        /// <returns>Usuario Bloqueado</returns>
        [HttpPost]
        [Route("correoConfirmacion")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> CorreoConfirmacion(ConfiaWebApi.PeticionesRest.Sistema.Usuarios.Interactuar parData)
        {
            try
            {
                // Obtenemos el usuario activo
                var UsuarioBD = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE Usuario=@0", parData.Usuario).SingleOrDefaultAsync();

                // Obtenemos el ID del usuario
                if (UsuarioBD is null)
                    return BadRequest("No cuenta con usuarios activos");

                var CodigoValidacion = System.Guid.NewGuid().ToString().Substring(0, 6).ToUpper();

                // Actualizamos el usuario
                UsuarioBD.Validacion = false;
                UsuarioBD.ValidacionCodigo = BCrypt.Net.BCrypt.HashPassword(CodigoValidacion);
                UsuarioBD.Contrasena = System.Guid.NewGuid().ToString();
                await ConexionBD.database.UpdateAsync(UsuarioBD);

                await Code.MailSender.Usuarios__OlvidoPassword(UsuarioBD.Usuario, CodigoValidacion);

                // Regresa el usuario
                var res = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE UsuarioID=@0", UsuarioBD.UsuarioID).FirstOrDefaultAsync();
                await this.ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Desbloqueamos un usuario
        /// </summary>
        /// <param name="parData">Usuario a desbloquear</param>
        [HttpPost]
        [Route("desbloquear")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> Desbloquear(ConfiaWebApi.PeticionesRest.Sistema.Usuarios.Interactuar parData)
        {
            try
            {
                // Validamos nuestro usuario actual
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                // Obtenemos el usuario activo
                var UsuarioBD = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE Usuario=@0", parData.Usuario).SingleOrDefaultAsync();

                // Validamos
                if (UsuarioBD.BloqueadoPermanente)
                    return BadRequest("Usuario con bloqueo permanente");

                // Actualizamos el usuario
                UsuarioBD.Bloqueado = false;
                UsuarioBD.usuarioIdBloquea = UsuarioActual.UsuarioID;
                UsuarioBD.BloqueadoPermanente = false;
                UsuarioBD.fhBloqueo = DateTime.Now;
                await ConexionBD.database.UpdateAsync(UsuarioBD);

                // Regresa el usuario
                var res1 = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE UsuarioID=@0", UsuarioBD.UsuarioID).FirstOrDefaultAsync();
                await this.ConexionBD.Destroy();
                return Ok(res1);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        #endregion Operaciones usuario

        #region Operaciones de Roles

        /// <summary>
        /// Obtiene los roles de seguridad
        /// </summary>
        /// <param name="admin"></param>
        /// <returns></returns>
        [HttpGet]
        [Authorize]
        [Route("roles")]
        public async Task<IActionResult> ObtenerRoles(int admin)
        {

            // Listado de regreso
            var _ret = await this.ConexionBD.database.FetchAsync<DBContext.DBConfia.Seguridad.Roles>();

            // Close the Databases
            await this.ConexionBD.Destroy();
            await this.ConexionBD.Destroy();

            // Regresamos el resultado
            return Ok(_ret);
        }

        [HttpGet]
        [Authorize]
        [Route("PermisosUsuario")]
        public async Task<IActionResult> PermisosUsuario(int admin)
        {

            // Listado de regreso
            var _ret = await this.ConexionBD.database.FetchAsync<DBContext.DBConfia.Seguridad.Roles>();

            // Close the Databases
            await this.ConexionBD.Destroy();
            await this.ConexionBD.Destroy();

            // Regresamos el resultado
            return Ok(_ret);
        }
        [HttpGet]
        [Authorize]
        [Route("Modulos")]
        public async Task<IActionResult> Modulos(int admin)
        {

            // Listado de regreso
            var _ret = await this.ConexionBD.database.FetchAsync<DBContext.DBConfia.Sistema.Modulos>();

            // Close the Databases
            await this.ConexionBD.Destroy();
            await this.ConexionBD.Destroy();

            // Regresamos el resultado
            return Ok(_ret);
        }
        [HttpGet]
        [Authorize]
        [Route("PerEsp")]
        public async Task<IActionResult> PerEsp()
        {

            // Listado de regreso
            var _ret = await this.ConexionBD.database.FetchAsync<DBContext.DBConfia.Seguridad.UsuariosPermisosVW>();

            // Close the Databases
            await this.ConexionBD.Destroy();
            await this.ConexionBD.Destroy();

            // Regresamos el resultado
            return Ok(_ret);
        }

        /// <summary>
        /// Obtiene los roles de seguridad a los cuales tiene acceso un usuario
        /// </summary>
        /// <param name="UsuarioID">Id del usuario a obtener los roles</param>
        /// <param name="rolAdministrativo">Define el tipo de rol a obtener</param>
        /// <returns>Listado de entero conteniendo los roles</returns>
        [HttpGet]
        [Authorize]
        [Route("roles/{UsuarioID:int}/{ProductoID:int?}")]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> ObtenerRoles(int UsuarioID, int? ProductoID)
        {

            // Listado de regreso
            var _ret = (await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios_Roles>().Where(x => x.UsuarioID == UsuarioID && x.ProductoID == ProductoID).ToArray()).Select(x => x.RolID).ToArray();

            // Close the Databases
            await this.ConexionBD.Destroy();

            // Regresamos el resultado
            return Ok(_ret);
        }

        /// <summary>
        /// Asigna un rol a un usuario
        /// </summary>
        /// <param name="UsuarioID">Id del usuario a obtener los roles</param>
        /// <param name="rolAdministrativo">Define el tipo de rol a obtener</param>
        /// <returns>Listado de entero conteniendo los roles</returns>
        [HttpPut]
        [Authorize]
        [Route("roles/{UsuarioID:int}")]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> AsignarRol(int UsuarioID, AgregarRol parDatos)
        {

            // Validamos nuestro usuario actual
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            // Validamos si el usuario ya tiene el permiso asignado
            var Permisos = this.ConexionBD.database.Query<DBContext.DBConfia.Seguridad.Usuarios_Roles>().Where(x => x.UsuarioID == UsuarioID && x.ProductoID == parDatos.ProductoID && x.RolID == parDatos.RolID).Count();
            if (Permisos > 0)
            {
                return Ok(new { Mensaje = "Usuario cuenta con el permiso", Codigo = 0 });
            }

            try
            {
                // Asignamos el rol al usuario
                await this.ConexionBD.database.InsertAsync(new DBContext.DBConfia.Seguridad.Usuarios_Roles()
                {
                    UsuarioID = UsuarioID,
                    CreacionFecha = DateTime.Now,
                    CreacionUsuarioID = UsuarioActual.UsuarioID,
                    ProductoID = parDatos.ProductoID,
                    RolID = parDatos.RolID,
                });

                // Close the Databases
                await this.ConexionBD.Destroy();
                await this.ConexionBD.Destroy();

            }
            catch (Exception ex)
            {

                if (this.ConexionBD.database.Connection.State == System.Data.ConnectionState.Open)
                    await this.ConexionBD.Destroy();

                if (this.ConexionBD.database.Connection.State == System.Data.ConnectionState.Open)
                    await this.ConexionBD.Destroy();

                return BadRequest(new { Mensaje = "Error al procesar", Error = ex.Message, Codigo = 1 });
            }

            // Regresamos el resultado
            return Ok(new { Mensaje = "Permiso Asignado" });
        }

        /// <summary>
        /// Asigna un rol a un usuario
        /// </summary>
        /// <param name="usuarioId">Id del usuario a obtener los roles</param>
        /// <param name="rolAdministrativo">Define el tipo de rol a obtener</param>
        /// <returns>Listado de entero conteniendo los roles</returns>
        [HttpDelete]
        [Authorize]
        [Route("roles/{usuarioId:int}/{RolID:int}/{ProductoID:int?}")]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> EliminarRol(int usuarioId, int RolID, int? ProductoID)
        {

            // Validamos nuestro usuario actual
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            // Validamos si el usuario ya tiene el permiso asignado
            var Permiso = await this.ConexionBD.database.Query<DBContext.DBConfia.Seguridad.Usuarios_Roles>().Where(x => x.UsuarioID == usuarioId && x.ProductoID == ProductoID && x.RolID == RolID).SingleOrDefaultAsync();
            if (Permiso is null)
            {
                // Close the Databases
                await this.ConexionBD.Destroy();
                await this.ConexionBD.Destroy();
                return Ok(new { Mensaje = "Permiso eliminado", Codigo = 0 });
            }

            try
            {
                // Elimina el permiso
                await this.ConexionBD.database.DeleteAsync(Permiso);

                // Close the Databases
                await this.ConexionBD.Destroy();
                await this.ConexionBD.Destroy();

            }
            catch (Exception ex)
            {

                if (this.ConexionBD.database.Connection.State == System.Data.ConnectionState.Open)
                    await this.ConexionBD.Destroy();

                if (this.ConexionBD.database.Connection.State == System.Data.ConnectionState.Open)
                    await this.ConexionBD.Destroy();

                return BadRequest(new { Mensaje = "Error al procesar", Error = ex.Message, Codigo = 1 });
            }

            // Regresamos el resultado
            return Ok(new { Mensaje = "Permiso Asignado" });
        }



        #endregion

        #region Operaciones de Permisos especiales

        /// <summary>
        /// Se obtienen los roles especiales a los cuales tiene acceso un usuario
        /// </summary>
        /// <param name="UsuarioID">Usuario del cual queremos los permisos especiales</param>
        /// <param name="ProductoID">ProductoID si queremos los permisos especiales en algún producto</param>
        /// <returns>Listado de Permisos_VW</returns>
        [HttpGet]
        [Authorize]
        [Route("permisos/especiales/{UsuarioID:int}/{ProductoID:int?}")]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> ObtenerPermisosEspeciales(int UsuarioID, int? ProductoID)
        {

            // Obtenemos los Id's de pantallas a los que tiene acceso el usuario
            var pantallasIDs = await this.ConexionBD.database.QueryAsync<int>("SELECT DISTINCT ISNULL(PantallaID, 0) FROM Seguridad.UsuariosPermisosVW WHERE UsuarioID = @0 AND ProductoID = @1", UsuarioID, ProductoID).ToArrayAsync();

            // Obtiene todos los permisos especiales, la UI ya tiene el listado de accesos del usuario, extrapolar no es dificil
            var _ret = await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Sistema.Permisos_VW>().Where(x => x.PermisoEspecial == true && pantallasIDs.Contains(x.PantallaID) && x.ModuloRequiereProducto == (ProductoID == null ? false : true)).OrderBy(x => x.ModuloID).ThenBy(x => x.PantallaID).ThenBy(x => x.PermisoID).ToArray();

            // Close the Databases
            await this.ConexionBD.Destroy();

            // Regresamos el resultado
            return Ok(_ret);
        }

        /// <summary>
        /// Asignamos permisos especiales a nuestro usuario
        /// </summary>
        /// <param name="UsuarioID">Usuario al cual vamos a agregar los permisos especiales</param>
        /// <param name="pData">Detalle de Producto y Permisos</param>
        /// <returns>Listado de Permisos_VW</returns>
        [HttpPut]
        [Authorize]
        [Route("permisos/especiales/{UsuarioID:int}")]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> DefinirPermisosEspeciales(int UsuarioID, AgregarPermisosEspeciales pData)
        {
            // Validamos nuestro usuario actual
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            // Obtenemos los Id's de los permisos especiales del usuario
            var permisosEspeciales = (await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosPermisosVW>().Where(x => x.UsuarioID == UsuarioID && x.ProductoID == pData.ProductoID && x.PermisoEspecial == true).OrderBy(x => x.ModuloID).ThenBy(x => x.PantallaID).ThenBy(x => x.PermisoID).ToArray()).Select(x => x.PermisoID);

            // Quitamos del arreglo los Id's ya encontrados
            var permisosInsertar = pData.PermisosIDs.ToList().Where(x => !permisosEspeciales.Contains(x)).Select(x => new DBContext.DBConfia.Seguridad.Usuarios_PermisosEspeciales()
            {
                CreacionFecha = DateTime.Now,
                CreacionUsuarioID = UsuarioActual.UsuarioID,
                PermisoID = x,
                ProductoID = pData.ProductoID,
                UsuarioID = UsuarioID
            });

            // Insertamos los permisos especiales
            try
            {
                // Insertamos el listado de roles
                await this.ConexionBD.database.InsertBatchAsync<DBContext.DBConfia.Seguridad.Usuarios_PermisosEspeciales>(permisosInsertar);

                // Eliminamos los permisos no seleccionados para el usuario
                var PermisosEliminar = await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios_PermisosEspeciales>().Where(x => x.UsuarioID == UsuarioID && x.ProductoID == pData.ProductoID && !pData.PermisosIDs.Contains(x.PermisoID)).ToArray();

                // Los eliminamos
                await this.ConexionBD.database.ExecuteAsync("DELETE FROM Seguridad.Usuarios_PermisosEspeciales WHERE PermisoID IN (@0)", PermisosEliminar.Select(x => x.PermisoID));

                // Ontenemos los roles
                var _ret = await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosPermisosVW>("WHERE UsuarioID=@0 AND ProductoID " + (pData.ProductoID == null ? "IS NULL" : "IS NOT NULL"), UsuarioID).ToArrayAsync();

                // Close the Databases
                await this.ConexionBD.Destroy();
                await this.ConexionBD.Destroy();

                // Regresamos el resultado
                return Ok(_ret);
            }
            catch (Exception ex)
            {

                if (this.ConexionBD.database.Connection.State == System.Data.ConnectionState.Open)
                    await this.ConexionBD.Destroy();

                if (this.ConexionBD.database.Connection.State == System.Data.ConnectionState.Open)
                    await this.ConexionBD.Destroy();

                return BadRequest(new { Mensaje = "Error al insertar los permisos especiales", Error = ex.Message, Codigo = 1 });
            }
        }

        /// <summary>
        /// Obtiene los roles de seguridad a los cuales tiene acceso un usuario
        /// </summary>
        /// <param name="usuarioId">Id del usuario a obtener los roles</param>
        /// <param name="rolAdministrativo">Define el tipo de rol a obtener</param>
        /// <returns>Listado de entero conteniendo los roles</returns>
        [HttpGet]
        [Authorize]
        [Route("permisos/{UsuarioID:int}/{ProductoID:int?}")]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> ObtenerPermisos(int UsuarioID, int? ProductoID)
        {

            // Listado de regreso
            var _ret = await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosPermisosVW>().Where(x => x.UsuarioID == UsuarioID && x.ProductoID == ProductoID).OrderBy(x => x.ModuloID).ThenBy(x => x.PantallaID).ThenBy(x => x.PermisoID).ToArray();

            // Close the Databases
            await this.ConexionBD.Destroy();
            await this.ConexionBD.Destroy();

            // Regresamos el resultado
            return Ok(_ret);
        }

        /// <summary>
        /// Obteniene los grupos de la base de datos
        /// </summary>
        /// <param name="parData">datos de REST</param>
        /// <returns>Listado de usuarios (omitiendo el usuario que realiza la petición)</returns>
        [HttpGet]
        [Route("permisos")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> ObtenerPermisos()
        {
            try
            {
                // Return to our UI
                var res = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Sistema.Permisos_VW>();
                await this.ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await this.ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }
        [HttpGet]
        [Route("GetContra")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> GetContra(PeticionesRest.Seguridad.Usuarios.Actualizar parData)
        {
            try
            {
                // Return to our UI
                var res = await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>().Where(x => x.UsuarioID == parData.UsuarioID).FirstOrDefault();
                await this.ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await this.ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        #endregion

        #region Funciones generales

        /// <summary>
        /// Obtiene los modulos del sistema
        /// </summary>
        /// <param name="parData">datos de REST</param>
        /// <returns>Listado de usuarios (omitiendo el usuario que realiza la petición)</returns>

        /// <summary>
        /// Obtiene el token de acceso
        /// </summary>
        /// <param name="parClient"></param>
        /// <returns></returns>
        [HttpGet("productos")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> ObtenerProductos()
        {
            try
            {
                var res1 = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Creditos.ProductosVW>("WHERE Principal = 1");
                await this.ConexionBD.Destroy();
                return Ok(res1);
            }
            catch (Exception ex)
            {
                await this.ConexionBD.Destroy();
                return BadRequest("Error al obtener los productos: " + ex.Message);
            }
        }
        [HttpGet("GetProducto")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> GetProducto()
        {
            try
            {
                var res1 = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Creditos.Productos>();
                await this.ConexionBD.Destroy();
                return Ok(res1);
            }
            catch (Exception ex)
            {
                await this.ConexionBD.Destroy();
                return BadRequest("Error al obtener los productos: " + ex.Message);
            }
        }

        [HttpGet("GetProductoPrincipales")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> GetProductoPrincipales()
        {
            try
            {
                var res1 = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Creditos.ProductosVW>("WHERE Principal = 1");
                await this.ConexionBD.Destroy();
                return Ok(res1);
            }
            catch (Exception ex)
            {
                await this.ConexionBD.Destroy();
                return BadRequest("Error al obtener los productos: " + ex.Message);
            }
        }

        [HttpGet("GetProdEsp")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> GetProdEsp()
        {
            try
            {
                var res1 = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Seguridad.UsuariosPermisosVW>();
                await this.ConexionBD.Destroy();
                return Ok(res1);
            }
            catch (Exception ex)
            {
                await this.ConexionBD.Destroy();
                return BadRequest("Error al obtener los productos: " + ex.Message);
            }
        }
        [HttpGet("GetModulo")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> GetModulo()
        {
            try
            {
                var res1 = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Sistema.Modulos>();
                await this.ConexionBD.Destroy();
                return Ok(res1);
            }
            catch (Exception ex)
            {
                await this.ConexionBD.Destroy();
                return BadRequest("Error al obtener los modulos: " + ex.Message);
            }
        }
        [HttpGet]
        [Route("modulos")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> ObtenerModulos()
        {
            try
            {
                // Return to our UI
                var res = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Sistema.Modulos>();
                await this.ConexionBD.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await this.ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetPantalla")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> GetPantalla(/* PeticionesRest.Seguridad.Usuarios.GetModulo parData */)
        {
            try
            {
                // Return to our UI
                /*  var res = await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Sistema.Pantallas>().Where(x => x.ModuloID == parData.ModuloID).FirstOrDefault();
  */
                var res = await this.ConexionBD.database.FetchAsync<DBContext.DBConfia.Sistema.Pantallas_VW>();
                await this.ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await this.ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetPermisosEso")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> GetPermisosEso(/* PeticionesRest.Seguridad.Usuarios.GetModulo parData */)
        {
            try
            {
                // Return to our UI
                /*  var res = await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Sistema.Pantallas>().Where(x => x.ModuloID == parData.ModuloID).FirstOrDefault();
  */
                var res = await this.ConexionBD.database.FetchAsync<DBContext.DBConfia.Sistema.PermisosEspeciales_VW>();
                await this.ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await this.ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        [Route("GetPermisosEspecialesDisponibles/{UsuarioID}")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> GetPermisosEspDispUsuario(int UsuarioID)
        {
            try
            {

                var usuarioActualEmail = Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();
                var res = await this.ConexionBD.database.FetchAsync<DBContext.DBConfia.Sistema.PermisosEspeciales_VW>();
                ArrayList res2 = new ArrayList();
                var permisosAsignados = await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios_PEspeciales_Asignados_VW>("Where UsuarioID = @0", UsuarioID).ToArrayAsync();
                var productos = await this.ConexionBD.database.FetchAsync<DBContext.DBConfia.Creditos.ProductosVW>();
                var productos2 = productos.Select(x => new { value = x.ProductoID, label = x.Producto, disabled = false }).ToList();
                ArrayList res3 = new ArrayList();
                //productos2.Where(x => !permisosAsignados.Any(y => y.PermisoID == item.PermisoID && y.ProductoID == x.value)).ToList(),
                foreach (var item in res)
                {
                    res2.Add(new
                    {
                        item.PermisoID,
                        item.Nombre,
                        item.Descripcion,
                        Productos =
                        productos2.Select(x => new { value = x.value, label = x.label, disabled = permisosAsignados.Any(y => y.PermisoID == item.PermisoID && y.ProductoID == x.value) }).ToList(),
                        ProductosSeleccionados = res3,
                    });
                }
                await ConexionBD.Destroy();
                return Ok(res2);
            }
            catch (Exception ex)
            {
                await this.ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("AddPermisosEspecialesDisponibles")]
        [Authorize]
        [Code.TProteccionAdmin]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> AddPermisosEspecialesDisponibles(PeticionesRest.Seguridad.Usuarios.PermisosCL parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                ConexionBD.database.BeginTransaction();
                {
                    foreach (var item in parData.Permisos)
                    {
                        foreach (var item2 in item.ProductosSeleccionados)
                        {
                            var PermisoEsp = new Usuarios_PermisosEspeciales()
                            {
                                UsuarioID = parData.UsuarioID,
                                PermisoID = item.PermisoID,
                                ProductoID = item2.value,
                                CreacionFecha = DateTime.Now,
                                CreacionUsuarioID = UsuarioActual.UsuarioID,

                            };
                            await ConexionBD.database.InsertAsync(PermisoEsp);
                        }
                    }

                    ConexionBD.database.CompleteTransaction();
                    await this.ConexionBD.Destroy();
                    return Ok();
                }

            }
            catch (Exception ex)
            {
                ConexionBD.database.AbortTransaction();
                await this.ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }


        [HttpGet]
        [Route("GetPermisosEspUsuario/{UsuarioID}")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> GetPermisosEspUsuario(int UsuarioID)
        {
            try
            {

                var res = await this.ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios_PEspeciales_Asignados_VW>
                ("WHERE UsuarioID=@0", UsuarioID).ToArrayAsync();
                //Order res by UsuarioPermisoEspecialID desc
                res.OrderBy(o => o.UsuarioPermisoEspecialID);
                await this.ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await this.ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }



        [HttpPost]
        [Route("GetPantallaModulo")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetPantallaModulo(ConfiaWebApi.PeticionesRest.Seguridad.Usuarios.GetModulo parData)
        {
            try
            {

                var res = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Seguridad.UsuariosPermisosVW>("WHERE ModuloID = @0", parData.ModuloID);
                await ConexionBD.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();

                return BadRequest(ex.Message);
            }
        }

        /* [HttpPost]
        [Route("AddPermisoEspecial")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> AddPermisoEspecial(ConfiaWebApi.PeticionesRest.Seguridad.Usuarios.
        {

            var usuarioActualEmail = Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            try
            {

                foreach (var item in parData.PermisoEspecial)
                {

                    var PermisosEspecialesAgg = new DBContext.DBConfia.Seguridad.Usuarios_PermisosEspeciales()
                    {
                        UsuarioID = item.UsuarioID,
                        ProductoID = item.ProductoID,
                        PermisoID = item.PermisoID,
                        CreacionFecha = DateTime.Now,
                        CreacionUsuarioID = UsuarioActual.UsuarioID
                    };
                    await ConexionBD.database.InsertAsync(PermisosEspecialesAgg);
                    return Ok();

                }
                return Ok();

            }


            catch (Exception ex)
            {
                await ConexionBD.Destroy();

                return BadRequest(ex.Message);
            }
        } */

        #endregion

        [HttpPost]
        [Route("ObtenerUsuarios")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> ObtenerUsuarios()
        {
            try
            {
                // Obtenemos los usuarios
                var resultado = (await ConexionBD.database.FetchAsync<Usuarios>()).Where(x => x.Bloqueado == false).ToList();

                // Cerramos las conexiones
                await ConexionBD.Destroy();

                // Regresamos los usuarios
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return BadRequest("Error al obtener los usuarios: " + ex.Message);
            }
        }

        [HttpPost]
        [Route("obtenerMasterUser")]
        [Authorize]

        public async Task<IActionResult> ObtenerMasterUser(ConfiaWebApi.PeticionesRest.Seguridad.Usuarios.USerMaster parData)
        {
            var data = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE MasterUser = 1 AND UsuarioID = @0", parData.IDUsuario);

            try
            {
                var result = data.Select(d => new { MasterUser = d.MasterUser }).ToArray();
                await ConexionBD.Destroy();
                return Ok(result);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("addPermisosCartera")]
        [Authorize]
        // [Code.TProteccionProducto]
        public async Task<IActionResult> addPermisosCartera(ConfiaWebApi.PeticionesRest.Seguridad.Usuarios.addPermisosCartera parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<Usuarios>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var registros = (parData.SucursalesIds ?? new List<int?>())
                .Where(id => id.HasValue)
                .Select(sucursalID => new
                {
                    SucursalID = sucursalID.Value
                })
                .ToList();

                var jsonRegistros = System.Text.Json.JsonSerializer.Serialize(registros);
                
                var registros2 = (parData.ProductosIds ?? new List<int?>())
                .Where(id => id.HasValue)
                .Select(productoID => new
                {
                    ProductoID = productoID.Value
                })
                .ToList();

                var jsonRegistros2 = System.Text.Json.JsonSerializer.Serialize(registros2);

                var parametros = new
                {
                    JsonSucursales = jsonRegistros,
                    JsonProductos = jsonRegistros2,
                    UsuarioID = parData.UsuarioID,
                    UsuarioIDRegistra = UsuarioActual.UsuarioID,
                    PersonaIDRegistra = UsuarioActual.PersonaID
                };

                var res = await ConexionBD.database.QueryAsync<dynamic>("EXEC Seguridad.pa_AccesosCartera @JsonSucursales,@JsonProductos, @UsuarioID,@UsuarioIDRegistra,@PersonaIDRegistra", parametros).ToListAsync();

                await ConexionBD.Destroy();
                return Ok();
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("GetAccesos")]
        [Authorize]
        public async Task<IActionResult> GetAccesos(ConfiaWebApi.PeticionesRest.Seguridad.Usuarios.getAccesos parData)
        {
            try
            {
                var res = await ConexionBD.database.QueryAsync<dynamic>("EXEC Seguridad.GetAccesosSucursal @UsuarioID", parData).ToArrayAsync();

                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("GetAccesosP")]
        [Authorize]
        public async Task<IActionResult> GetAccesosP(ConfiaWebApi.PeticionesRest.Seguridad.Usuarios.getAccesos parData)
        {
            try
            {
                var res = await ConexionBD.database.QueryAsync<dynamic>("EXEC Seguridad.GetAccesosProductos @UsuarioID", parData).ToArrayAsync();

                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }

    }


}