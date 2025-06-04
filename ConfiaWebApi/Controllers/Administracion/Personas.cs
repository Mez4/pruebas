using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Prospeccion;
using DBContext.DBConfia.Catalogos;
using DBContext.DBConfia.Seguridad;
using System.IO;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using ConfiaWebApi.PeticionesRest.Prospeccion.Documentos;
using ConfiaWebApi.ModlesSP.Prospeccion;
using System.Net;
using System.Collections;
using IdentityServer4.Models;
using System.Runtime.InteropServices;
using DBContext.DBConfia.Sistema;


namespace ConfiaWebApi.Controllers.Administracion.Bancos
{
    [Authorize]
    [ApiController]
    [Route("api/Administracion/[controller]")]
    public class PersonasController : ControllerBase
    {
        private DBConfiaContext ConexionBD;
        private IConfiguration Configuracion;

        public PersonasController(IConfiguration _Configuration, DBConfiaContext _ConexionBD) { this.Configuracion = _Configuration; ConexionBD = _ConexionBD; }

        /// <summary>
        /// Proceso para generar los PDFs (proceso inicial)
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("perfil")]
        [Authorize]
        public async Task<IActionResult> Perfil()
        {
            try
            {
                // Generamos un prefijo del nombre de archivo
                var prefijo_archivo = string.Concat(System.Guid.NewGuid().ToString().Replace("-", ""), "__");
                var listado_archivos = new string[3];

                // Generamos la hoja 1
                var html1 = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Contrato", "1.html"));
                html1 = html1.Replace("@@SERVER", HttpContext.Request.Host.Value);
                await System.IO.File.WriteAllTextAsync(Path.Combine(ConfiaWebApi.Code.PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1.html")), html1);
                listado_archivos[0] = Path.Combine(ConfiaWebApi.Code.PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1.html"));

                // Generamos la hoja 2
                var html2 = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Contrato", "2.html"));
                html2 = html2.Replace("@@SERVER", HttpContext.Request.Host.Value);
                await System.IO.File.WriteAllTextAsync(Path.Combine(ConfiaWebApi.Code.PDF.RUTA_BASE, string.Concat(prefijo_archivo, "2.html")), html2);
                listado_archivos[1] = Path.Combine(ConfiaWebApi.Code.PDF.RUTA_BASE, string.Concat(prefijo_archivo, "2.html"));

                // Generamos la hoja 3
                var html3 = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Contrato", "3.html"));
                html3 = html3.Replace("@@SERVER", HttpContext.Request.Host.Value);
                await System.IO.File.WriteAllTextAsync(Path.Combine(ConfiaWebApi.Code.PDF.RUTA_BASE, string.Concat(prefijo_archivo, "3.html")), html3);
                listado_archivos[2] = Path.Combine(ConfiaWebApi.Code.PDF.RUTA_BASE, string.Concat(prefijo_archivo, "3.html"));

                // Regresamos nuestro archivo PDF

                return await Code.PDF.GenerarPDF(listado_archivos, Motivo: "Contrato crediticio", Localizacion: "Torreon, Coahuila, MEXICO", Contacto: "correo@contacto.com");
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("ERROR: " + ex.Message);
            }
        }

        [HttpPost]
        [Route("CurpCheck")]
        [Authorize]
        public async Task<IActionResult> CurpCheck(PeticionesRest.Administracion.Personas.CurpCheck parData)
        {
            try
            {
                var persona = await ConexionBD.database.QueryAsync<Personas>("WHERE CURP = @CURP", parData).SingleOrDefaultAsync();
                var result = new { exist = persona != null };
                await ConexionBD.Destroy();
                return Ok(result);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("MovilCheck")]
        [Authorize]
        public async Task<IActionResult> MovilCheck(PeticionesRest.Administracion.Personas.MovilCheck parData)
        {
            try
            {
                var persona = await ConexionBD.database.QueryAsync<Personas>("WHERE TelefonoMovil = @Telefono", parData).SingleOrDefaultAsync();
                var result = new { exist = persona != null };
                await ConexionBD.Destroy();
                return Ok(result);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }
        //nuevo endpoint para la creacion de un director
        [HttpPost]
        [Route("addDirector")]
        [Authorize]
        public async Task<IActionResult> AddDirector(PeticionesRest.Administracion.Personas.Agregar parData)
        {
            try
            {
                var personExists = 0;
                // var clientExists = 0;
                var ExisteDirector = 0;

                var personQuery = await ConexionBD.database.QueryAsync<Personas>("WHERE (CURP = @CURP) AND (RFC = @RFC) AND (TelefonoMovil = @TelefonoMovil)", parData).SingleOrDefaultAsync();
                // SE COMPRUEBA QUE EL USUARIO YA EXISTA EN LA BASE DE DATOS Y EL PARAMETRO QUE LE LLEGA SEA VERDADERO
                if (personQuery?.PersonaID > 0 && parData.AgregarCliente.CrearCliente == true)
                {
                    // DECLARAMOS QUE LA PERSONA SI EXISTE
                    personExists = 1;
                    // SE HARA UNA CONSULTA PARA COMPROBAR SI EXISTE UN CLIENTE CON LOS DATOS DE LA CONSULTA ANTERIOR
                    var client = await ConexionBD.database.QueryAsync<Clientes>("WHERE (ClienteID = @0)", personQuery.PersonaID).SingleOrDefaultAsync();
                    // SI LA CONSULTA DEL CLIENTE NO VIENE VACIA
                    if (client != null)
                    {
                        // TAMBIEN SI EL CLIENTE ID ES MAYOR DE 0
                        if (client.ClienteID > 0)
                        {
                            // DECLARAMOS QUE YA EXISTE UN CLIENTE
                            // clientExists = 1;
                            // SE HARA UNA CONSULTA PARA COMPROBAR SI EXISTE UN DISTRIBUIDOR CON LOS DATOS ANTERIORES
                            var distributor = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Distribuidores.Clientes>("WHERE (PersonaID = @0) AND (EstatusId = 1)", client.ClienteID).SingleOrDefaultAsync();
                            // SI EL DISTRIBUIDORID ES MAYOR DE 0, SI EXISTE
                            if (distributor.DistribuidorID > 0)
                            {
                                //    CERRAMOS LA CONEXION DE BASE DE DATOS 
                                await ConexionBD.Destroy();
                                return BadRequest
                                    (new
                                    {
                                        res = 2,
                                        status = false,
                                        data = personQuery,
                                        msj = "El cliente ya existe con el ID" + client.ClienteID.ToString()
                                        + "y se encuenta relacionado con la socia: " + distributor.DistribuidorID
                                    });
                            }
                        }

                    }
                }
                else
                {
                    // EN CASO DE QUE NO TENGA CLIENTE, PREGUNTAMOS SI OBTUVO UNA RESPUESTA DE LA CONSULTA DE PERSONA
                    if (personQuery?.PersonaID > 0)
                    {
                        await ConexionBD.Destroy();
                        return BadRequest(new { res = 2, status = false, msj = "La persona ya existe con el ID: " + personQuery.PersonaID.ToString() });
                    }
                }
                // AHORA SE HARA BUSQUEDA DE UN DIRECTOR EXISTENTE
                if (personQuery?.PersonaID > 0 && parData.AgregarDirector.CrearDirector == true)
                {
                    personExists = 1;
                    // CONSULTA PARA OBTENER UN REGISTRO DEL DIRECTOR
                    var director = await ConexionBD.database.QueryAsync<Directores>("WHERE  (DirectorID = @0)", personQuery.PersonaID).SingleOrDefaultAsync();
                    // Si SE ENCUENTRA ALGUN REGISTRO
                    if (director.DirectorID > 0)
                    {
                        await ConexionBD.Destroy();
                        return BadRequest(new
                        {
                            status = false,
                            msj = "El director ya existe con el ID : " + director.DirectorID.ToString(),
                            data = personQuery
                        });
                    }

                }
                else
                {
                    // PREGUNTAMOS SI SOLO EXISTE EL USUARIO AUNQUE NO SEA CLIENTE, DISTRIBUIDOR O DIRECTOR
                    if (personQuery?.PersonaID > 0 && parData.AgregarCliente.CrearCliente == false)
                    {
                        await ConexionBD.Destroy();
                        return BadRequest(new
                        {
                            status = false,
                            msj = "La persona ya existe con el ID: " + personQuery.PersonaID.ToString(),
                            data = new { }
                        });
                    }
                }

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                // Comenzamos la transaccion
                ConexionBD.database.BeginTransaction();
                // Agregamos seis horas mas a la zona horaria
                var birthdate = parData.FechaNacimiento.AddHours(+6);
                // VERIFICAMOS QUE LA CURP NO ESTE REPETIDA
                var curp = await ConexionBD.database.QueryAsync<Personas>("WHERE (CURP = @0)", parData.CURP.ToUpper()).SingleOrDefaultAsync();
                var phone = await ConexionBD.database.QueryAsync<Personas>("WHERE TelefonoMovil = @0", parData.TelefonoMovil).SingleOrDefaultAsync();
                if (curp != null)
                {
                    await ConexionBD.Destroy();
                    return BadRequest(new
                    {
                        status = false,
                        msj = "La persona con el CURP: " + parData.CURP + " ya existe",
                    });
                }
                else if (phone != null)
                {
                    await ConexionBD.Destroy();
                    return BadRequest(new
                    {
                        status = false,
                        msj = "La persona con el telefono: " + parData.TelefonoMovil + " ya existe",
                    });
                }
                // SE INSTANCIA UN OBJETO DE TIPO ´PERSONAS´
                var newPerson = new Personas()
                {
                    Nombre = parData.Nombre.ToUpper(),
                    ApellidoPaterno = parData.ApellidoPaterno.ToUpper(),
                    ApellidoMaterno = parData.ApellidoMaterno.ToUpper(),
                    FechaNacimiento = birthdate,
                    CURP = parData.CURP.ToUpper(),
                    RFC = parData.RFC.ToUpper(),
                    LugarNacimiento = parData.LugarNacimiento,
                    SexoID = parData.SexoID,
                    EstadoCivilID = parData.EstadoCivilID,
                    EscolaridadID = parData.EscolaridadID,
                    DependientesEconomicos = parData.DependientesEconomicos,
                    TelefonoDomicilio = parData.TelefonoDomicilio,
                    TelefonoMovil = parData.TelefonoMovil,
                    CorreoElectronico = parData.CorreoElectronico,
                    NombreConyuge = parData.NombreConyuge.ToUpper(),
                    Observaciones = parData.Observaciones,
                    identificacionTipoId = parData.identificacionTipoId,
                    identificacionNumero = parData.identificacionNumero,
                    CreacionPersonaID = (long)UsuarioActual.PersonaID,
                    CreacionFecha = DateTime.Now,
                    BuroInternoEstatusID = 1,
                    //   IngresosMensuales = parData.AgregarProspecto.Laboral__SueldoMensual
                };
                // Si la variable se mantuvo en cero
                if (personExists == 0)
                {
                    await ConexionBD.database.InsertAsync(newPerson);
                    if (!parData.AgregarProspecto.CrearProspecto)
                    {
                        parData.AgregarDireccion.PersonaID = newPerson.PersonaID;
                        var resD = await AddDireccion(parData.AgregarDireccion);
                        if (resD == 0)
                        {
                            throw new Exception();
                        }
                        parData.AgregarEmpleo.PersonaID = newPerson.PersonaID;
                        var resE = await AddEmpleo(parData.AgregarEmpleo);
                        if (resE == 0)
                        {
                            throw new Exception();
                        }
                    }
                }
                else
                {
                    newPerson.PersonaID = personQuery.PersonaID;
                }

                if (parData.AgregarDirector.CrearDirector == true)
                {
                    var Directores = new Directores()
                    {
                        DirectorID = newPerson.PersonaID,
                        PersonaID = newPerson.PersonaID,
                        LineaCreditoPersonal = parData.AgregarDirector.LineaCreditoPersonal,
                        PagareEstatusId = parData.AgregarDirector.PagareEstatusId,
                        PagareCantidad = parData.AgregarDirector.PagareCantidad,
                        CreacionPersonaID = (long)UsuarioActual.PersonaID,
                        CreacionFecha = DateTime.Now,
                        CreacionUsuarioID = UsuarioActual.UsuarioID,
                        IdentificadorAnterior = parData.AgregarDirector.IdentificadorAnterior,
                        FechaUltimoCredito = null
                    };

                    if (ExisteDirector == 0)
                    {
                        await ConexionBD.database.InsertAsync(Directores);
                    }
                }
                // SE CREA EL COMMIT DE LA TRANSACCION
                ConexionBD.database.CompleteTransaction();
                var dataNow = await ConexionBD.database.QueryAsync<Personas_VW>("WHERE PersonaID = @0", newPerson.PersonaID).SingleOrDefaultAsync();
                await ConexionBD.Destroy();
                return Ok(new
                {
                    res = 1,
                    msj = "Se creo la persona con el id: " + newPerson.PersonaID,
                    dataNow
                });


            }
            catch (System.Exception ex)
            {
                ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(PeticionesRest.Administracion.Personas.Agregar parData, [FromHeader(Name = "ProductoID")] int producto)
        // public async Task<IActionResult> Add(PeticionesRest.Administracion.Personas.Agregar parData )
        {
            //producto
            //promotor
            var ExistePersona = 0;
            var ExisteCliente = 0;
            var ExisteDirector = 0;
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            var Person = await ConexionBD.database.QueryAsync<Personas>("WHERE  (CURP = @0) AND ProductoID = @1", parData.CURP, producto).SingleOrDefaultAsync();
            var GerenciaSucursal = await ConexionBD.database.QueryAsync<DBContext.DBConfia.General.Gerentes>("WHERE UsuarioID=@0", UsuarioActual.UsuarioID).FirstOrDefaultAsync();
            if (GerenciaSucursal != null) parData.SucursalID = GerenciaSucursal.SucursalID;
            var promotor = await ConexionBD.database.QueryAsync<Promotores>("WHERE creditoPromotorId = @0 AND ProductoID = @1 AND activo = 1", UsuarioActual.PersonaID, producto).SingleOrDefaultAsync();

            if (parData.SucursalID == 0 && GerenciaSucursal == null && promotor == null)
            {
                throw new Exception($"Error, favor de seleccionar una sucursal");
            }
            if (Person?.PersonaID > 0 && parData.AgregarCliente.CrearCliente == true)
            {
                ExistePersona = 1;
                var Client = await ConexionBD.database.QueryAsync<Clientes>("WHERE  (ClienteID = @0)", Person.PersonaID).SingleOrDefaultAsync();

                if (Client != null)
                {
                    if (Client.ClienteID > 0)
                    {
                        ExisteCliente = 1;

                        var Distrib = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Distribuidores.Clientes>("WHERE (PersonaID = @0) AND (EsttausId = 1)", Client.ClienteID).SingleOrDefaultAsync();

                        if (Distrib == null)
                        {
                            var res = new
                            {
                                res = 2,
                                msj = "Cliente existente con el ID: " + Client.ClienteID.ToString() + " y se encuentra inactivo ",
                                Data = Person
                            };
                            await ConexionBD.Destroy();//AA
                            return Ok(res);
                        }

                        else
                        {
                            if (Distrib.DistribuidorID > 0)
                            {
                                var res = new
                                {
                                    res = 2,
                                    msj = "El cliente ya existe con el ID: " + Client.ClienteID.ToString() + " y se encuentra relacionado a la socia: " + Distrib.DistribuidorID.ToString(),
                                    Data = Person
                                };
                                await ConexionBD.Destroy();//AA
                                return Ok(res);
                            }

                        }

                    }
                }

            }
            else
            {
                if (Person?.PersonaID > 0)
                {

                    var res = new
                    {
                        res = 2,
                        msj = "La persona ya existe con el ID: " + Person.PersonaID.ToString() +
                        " CURP: " + Person.CURP,
                        Data = new { }
                    };
                    await ConexionBD.Destroy();
                    return Ok(res);
                }
            }

            if (Person?.PersonaID > 0 && parData.AgregarDirector.CrearDirector == true)
            {
                ExistePersona = 1;
                var Dire = await ConexionBD.database.QueryAsync<Directores>("WHERE  (DirectorID = @0)", Person.PersonaID).SingleOrDefaultAsync();
                if (Dire.DirectorID > 0)
                {
                    ExisteDirector = 1;

                    var direc = await ConexionBD.database.QueryAsync<DBContext.DBConfia.General.Directores>("WHERE  (DirectorID = @0)", Dire.DirectorID).SingleOrDefaultAsync();

                    if (direc.DirectorID > 0)
                    {
                        var res = new
                        {
                            res = 2,
                            msj = "El director ya existe con el ID: " + Dire.DirectorID.ToString(),
                            Data = Person
                        };
                        await ConexionBD.Destroy();
                        return Ok(res);
                    }
                }
            }
            else
            {
                if (Person?.PersonaID > 0 && parData.AgregarCliente.CrearCliente == false)
                {

                    var res = new
                    {
                        res = 2,
                        msj = "La persona ya existe con el ID: " + Person.PersonaID.ToString(),
                        Data = new { }
                    };
                    await ConexionBD.Destroy();
                    return Ok(res);
                }
            }

            // Generamos el registro de empleado
            try
            {
                // Obtenemos el email del usuario de los claims
                // var usuarioActualEmail = Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
                // var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", usuarioActualEmail).SingleOrDefaultAsync();
                // Comenzamos una transaccion
                ConexionBD.database.BeginTransaction();

                // Obtenemos el registro de la persona
                //var Persona = await ConexionBD.database.SingleByIdAsync<Personas>(parData.PersonaID);

                var FechaNacimientoact = parData.FechaNacimiento.AddHours(+6);

                var Persona = new Personas()
                {
                    Nombre = parData.Nombre?.ToUpper(),
                    ApellidoPaterno = parData.ApellidoPaterno?.ToUpper(),
                    ApellidoMaterno = parData.ApellidoMaterno?.ToUpper(),
                    FechaNacimiento = FechaNacimientoact,
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
                    BuroInternoEstatusID = 1,
                    IngresosMensuales = parData.AgregarProspecto.Laboral__SueldoMensual,
                    ProductoID = producto

                };

                if (ExistePersona == 0)
                {
                    // Actualizamos contra la base de datos
                    await ConexionBD.database.InsertAsync(Persona);

                    //El prospecto solo se guarda como persona sin direccion, ni info laboral hasta que sea dv
                    if (!parData.AgregarProspecto.CrearProspecto)
                    {
                        parData.AgregarDireccion.PersonaID = Persona.PersonaID;

                        var resD = await AddDireccion(parData.AgregarDireccion);

                        if (resD == 0)
                        {
                            throw new Exception();
                            //ConexionBD.database.AbortTransaction();
                        }

                        parData.AgregarEmpleo.PersonaID = Persona.PersonaID;

                        var resE = await AddEmpleo(parData.AgregarEmpleo);

                        if (resE == 0)
                        {
                            throw new Exception();
                            //ConexionBD.database.AbortTransaction();
                        }
                    }
                }
                else
                {
                    Persona.PersonaID = Person.PersonaID;
                }

                if (parData.AgregarProspecto.CrearProspecto)
                {
                    if (GerenciaSucursal == null && promotor == null)
                    {
                        throw new Exception($"Error, la persona actual logueada ({UsuarioActual.PersonaID}) no es gerente ni promotor en la sucursal ({parData.SucursalID})");
                    }

                    //se verifica si el usuario es promotor
                    if (promotor == null && GerenciaSucursal == null)
                    {
                        throw new Exception($"Error, la persona actual logueada ({UsuarioActual.PersonaID}) no es promotor en el producto ({producto})");
                    }


                    var Prospecto = new Prospectos()
                    {
                        ProspectoID = Persona.PersonaID,
                        SucursalID = (int)(parData.SucursalID == 0 || parData.SucursalID == null ? promotor.SucursalID : parData.SucursalID),
                        ComoSeEntero = "PROMOTOR",
                        StatusProcesoID = 1,
                        Activo = true,
                        fechaCreacion = DateTime.Now,
                        PromotorPersonaID = (long)UsuarioActual.PersonaID,
                        PromotorUsuarioID = UsuarioActual.UsuarioID,
                        fechaUltimaActualizacion = DateTime.Now,
                        EstatusAsignacionID = 1,
                        ProductoID = producto,
                        EstatusConsultaBuroID = 1,
                        DistribuidorTiposID = 1,

                    };

                    await ConexionBD.database.InsertAsync(Prospecto);

                    parData.AgregarProspecto.PersonaID = Persona.PersonaID;
                    var resIP = await AddProspectoInfo(parData.AgregarProspecto);

                    var Tuberia = new Tuberia()
                    {
                        PersonaID = Persona.PersonaID,
                        TipoPersonaID = 1,
                        StatusProcesoID = 1,
                        TuberiaResultadoID = 2,
                        Validado = true,
                        FechaRegistro = DateTime.Now,
                        FechaValidacion = DateTime.Now,
                        PersonaAnalistaID = (long)UsuarioActual.PersonaID,
                        UsuarioAnalistaID = UsuarioActual.UsuarioID,
                    };
                    await ConexionBD.database.InsertAsync(Tuberia);

                    if (resIP.Length > 0)
                    {
                        throw new Exception(resIP);
                    }
                }

                if (parData.AgregarCliente.CrearCliente == true)
                {
                    var Cliente = new Clientes()
                    {
                        ClienteID = Persona.PersonaID,
                        PersonaID = Persona.PersonaID,
                        LineaCreditoPersonal = parData.AgregarCliente.LineaCreditoPersonal,
                        PagareEstatusId = parData.AgregarCliente.PagareEstatusId,
                        PagareCantidad = parData.AgregarCliente.PagareCantidad,
                        CreacionPersonaID = (long)UsuarioActual.PersonaID,
                        CreacionFecha = DateTime.Now,
                        CreacionUsuarioID = UsuarioActual.UsuarioID,
                        IdentificadorAnterior = parData.AgregarCliente.IdentificadorAnterior,
                        FechaUltimoCredito = null,
                        CanjeaVale = true,
                    };

                    if (ExisteCliente == 0)
                    {
                        await ConexionBD.database.InsertAsync(Cliente);
                    }

                    var DistribuidorCliente = new DBContext.DBConfia.Distribuidores.Clientes()
                    {
                        // ProductoID = 0,
                        ProductoID = producto,
                        DistribuidorID = parData.AgregarCliente.DistribuidorID,
                        PersonaID = Cliente.ClienteID,
                        EsttausId = true,
                        AsignacionFecha = DateTime.Now,
                        bloqueado = false
                    };

                    await ConexionBD.database.InsertAsync(DistribuidorCliente);

                    //var huellaDigital = await ConexionBD.database.QueryAsync<HuellasDigitales>("WHERE ProductoID=@0 and Curp=@1", producto, parData.CURP).FirstAsync();

                    // if (huellaDigital != null)
                    // {
                    //     huellaDigital.PersonaID = Cliente.PersonaID;
                    //     await ConexionBD.database.UpdateAsync(huellaDigital);
                    // }


                }


                if (parData.AgregarDirector.CrearDirector == true)
                {
                    var Directores = new Directores()
                    {
                        DirectorID = Persona.PersonaID,
                        PersonaID = Persona.PersonaID,
                        LineaCreditoPersonal = parData.AgregarDirector.LineaCreditoPersonal,
                        PagareEstatusId = parData.AgregarDirector.PagareEstatusId,
                        PagareCantidad = parData.AgregarDirector.PagareCantidad,
                        CreacionPersonaID = (long)UsuarioActual.PersonaID,
                        CreacionFecha = DateTime.Now,
                        CreacionUsuarioID = UsuarioActual.UsuarioID,
                        IdentificadorAnterior = parData.AgregarDirector.IdentificadorAnterior,
                        FechaUltimoCredito = null
                    };

                    if (ExisteDirector == 0)
                    {
                        await ConexionBD.database.InsertAsync(Directores);
                    }
                }

                // Hacemos el commit a la transaccion
                ConexionBD.database.CompleteTransaction();

                // Regresamos el nuevo empleo ingresado
                var Data = await ConexionBD.database.QueryAsync<Personas_VW>("WHERE PersonaID=@0", Persona.PersonaID).SingleOrDefaultAsync();

                var res = new
                {
                    res = 1,
                    msj = "Se creó la persona con el id: " + Persona.PersonaID,
                    Data
                };

                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Proceso para generar los PDFs (proceso inicial)
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("edit")]
        // [Authorize]
        // [Code.TProteccionProducto]
        public async Task<IActionResult> Editar(PeticionesRest.Administracion.Personas.Editar parData)
        {

            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            // Generamos el registro de empleado
            try
            {
                // Comenzamos una transaccion
                ConexionBD.database.BeginTransaction();

                // Obtenemos el registro de la persona
                var Persona = await ConexionBD.database.SingleByIdAsync<Personas>(parData.PersonaID);

                // Actualizamos los datos
                Persona.Nombre = parData.Nombre;
                Persona.ApellidoPaterno = parData.ApellidoPaterno;
                Persona.ApellidoMaterno = parData.ApellidoMaterno;
                Persona.FechaNacimiento = parData.FechaNacimiento;
                Persona.CURP = parData.CURP;
                Persona.RFC = parData.RFC;
                Persona.SexoID = parData.SexoID;
                Persona.EstadoCivilID = parData.EstadoCivilID;
                Persona.EscolaridadID = parData.EscolaridadID;
                Persona.DependientesEconomicos = parData.DependientesEconomicos;
                Persona.TelefonoDomicilio = parData.TelefonoDomicilio;
                Persona.TelefonoMovil = parData.TelefonoMovil;
                Persona.LugarNacimiento = parData.LugarNacimiento;
                Persona.CorreoElectronico = parData.CorreoElectronico;
                Persona.NombreConyuge = parData.NombreConyuge;
                Persona.Observaciones = parData.Observaciones ?? "";
                Persona.identificacionTipoId = parData.identificacionTipoId;
                Persona.identificacionNumero = parData.identificacionNumero;
                Persona.ModificacionPersonaID = UsuarioActual.PersonaID;
                Persona.ModificacionUsuarioID = UsuarioActual.UsuarioID;
                Persona.CreacionFecha = DateTime.Now;


                // Actualizamos contra la base de datos
                await ConexionBD.database.UpdateAsync(Persona);

                // Hacemos el commit a la transaccion
                ConexionBD.database.CompleteTransaction();

                // Regresamos el nuevo empleo ingresado
                return Ok(await ConexionBD.database.QueryAsync<Personas_VW>("WHERE PersonaID=@0", parData.PersonaID).SingleOrDefaultAsync());
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("ERROR AL MODIFICAR EL USUARIO: " + ex.Message);
            }
        }

        [HttpGet]
        [Route("GetUser")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetUser(PeticionesRest.Administracion.Personas.Editar parData)
        {

            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            // Generamos el registro de empleado
            try
            {

                ConexionBD.database.CompleteTransaction();

                // Regresamos el nuevo empleo ingresado
                return Ok(UsuarioActual);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("ERROR AL MODIFICAR EL USUARIO: " + ex.Message);
            }
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.Administracion.Personas.Get parData)
        {
            try
            {
                // Obtenemos nuestro productoId
                int ProductoID = 9999;
                int.TryParse(Request.Headers["ProductoID"], out ProductoID);
                ConexionBD.database.CommandTimeout = 9999;

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

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
                    // DBContext.DBConfia.Distribuidores.Distribuidores_VW distribuidor = null;
                    long[] personas_direcciones = null;
                    Direcciones_VW[] direcciones = null;
                    Empleos_VW[] empleos = null;
                    Creditos_VW[] contCreditos = null;
                    DireccionesMigradas[] direccionesMigradas = null;
                    //Creditos_VW[] creditos = null;

                    // Obtenemos los datos basicos
                    personas_direcciones = (await ConexionBD.database.QueryAsync<PersonasDirecciones>("WHERE PersonaID=@0", persona.PersonaID).ToArrayAsync()).Select(x => x.DireccionID).ToArray();
                    direcciones = await ConexionBD.database.QueryAsync<Direcciones_VW>("WHERE DireccionID IN(@0)", personas_direcciones).OrderByDescending(x => x.CreacionFecha).ToArrayAsync();
                    direccionesMigradas = await ConexionBD.database.QueryAsync<DireccionesMigradas>("WHERE PersonaID IN(@0)", persona.PersonaID).OrderByDescending(x => x.IDDireccion).ToArrayAsync();
                    empleos = await ConexionBD.database.QueryAsync<Empleos_VW>("WHERE PersonaID=@0", persona.PersonaID).OrderByDescending(x => x.CreacionFecha).ToArrayAsync();
                    //creditos = await ConexionBD.database.QueryAsync<Creditos_VW>("WHERE PersonaID=@0", persona.PersonaID).ToArrayAsync();
                    contCreditos = await ConexionBD.database.QueryAsync<Creditos_VW>("SELECT TOP(5) * FROM Creditos.Creditos_VW WHERE (PersonaID=@0) order by CreditoID DESC", persona.PersonaID).ToArrayAsync();

                    // Obtenemos Documentos
                    // var ine = ""; //String.Format("{0}://{1}{2}/wwwroot/Archivos/FirmaDistribuidor/{3}", Request.Scheme, Request.Host, Request.PathBase, "ine.png");
                    // var firma = ""; //String.Format("{0}://{1}{2}/wwwroot/Archivos/FirmaDistribuidor/{3}", Request.Scheme, Request.Host, Request.PathBase, "firma.png");

                    parData.PersonaID = parData.PersonaID;
                    var documentos = await getIne(parData);

                    // Regresamos los datos a la UI
                    await ConexionBD.Destroy();
                    return Ok(new { persona, direcciones, empleos, documentos, creditos, contCreditos, cliente, direccionesMigradas });

                }
                else
                {
                    object parDataRevisado = new
                    {
                        ProductoID,
                        Nombre = string.IsNullOrEmpty(parData.Nombre) ? "" : parData.Nombre.Trim(),
                        DistribuidorIDVR = string.IsNullOrEmpty(parData.DistribuidorIDVR) ? "" : parData.DistribuidorIDVR.Trim(),
                        RFC = string.IsNullOrEmpty(parData.RFC) ? "" : parData.RFC.Trim(),
                        CURP = string.IsNullOrEmpty(parData.CURP) ? "" : parData.CURP.Trim(),
                        DistribuidorID = string.IsNullOrEmpty(parData.DistribuidorID) ? "" : parData.DistribuidorID.Trim(),
                        SexoID = parData.SexoID == null ? "" : parData.SexoID.Trim(),
                        // OcupacionID = parData.OcupacionID == null ? 0 : parData.OcupacionID, -- COLUMNA NO EXISTE EN VISTA 
                        EscolaridadID = parData.EscolaridadID == null ? 0 : parData.EscolaridadID,
                        EstadoCivilID = parData.EstadoCivilID == null ? "" : parData.EstadoCivilID.Trim(),
                        Distribuidor = parData.Distribuidor == null ? false : parData.Distribuidor,
                        Cliente = parData.Cliente == null ? false : parData.Cliente,
                        Coordinador = parData.Coordinador == null ? false : parData.Coordinador,
                        Prospecto = parData.Prospecto == null ? false : parData.Prospecto,
                        Sac = parData.Sac == null ? false : parData.Sac,
                        UsuarioActual.UsuarioID
                    };

                    var res = await ConexionBD.database.QueryAsync<Personas_VW>("EXEC General.GetConsultaPersonaData @ProductoID, @Nombre, @DistribuidorIDVR, @RFC, @CURP, @DistribuidorID, @SexoID, @EscolaridadID, @EstadoCivilID, @Distribuidor, @Cliente, @Coordinador, @Prospecto, @Sac, @UsuarioID", parDataRevisado).ToArrayAsync();
                    await ConexionBD.Destroy();
                    return Ok(res);
                }
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        /*  [HttpPost]
         [Route("get")]
         [Authorize]
         [Code.TProteccionProducto]
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
                     // DBContext.DBConfia.Distribuidores.Distribuidores_VW distribuidor = null;
                     long[] personas_direcciones = null;
                     Direcciones_VW[] direcciones = null;
                     Empleos_VW[] empleos = null;
                     Creditos_VW[] contCreditos = null;
                     //Creditos_VW[] creditos = null;

                     // Obtenemos los datos basicos
                     personas_direcciones = (await ConexionBD.database.QueryAsync<PersonasDirecciones>("WHERE PersonaID=@0", persona.PersonaID).ToArrayAsync()).Select(x => x.DireccionID).ToArray();
                     direcciones = await ConexionBD.database.QueryAsync<Direcciones_VW>("WHERE DireccionID IN(@0)", personas_direcciones).OrderByDescending(x => x.CreacionFecha).ToArrayAsync();
                     empleos = await ConexionBD.database.QueryAsync<Empleos_VW>("WHERE PersonaID=@0", persona.PersonaID).OrderByDescending(x => x.CreacionFecha).ToArrayAsync();
                     //creditos = await ConexionBD.database.QueryAsync<Creditos_VW>("WHERE PersonaID=@0", persona.PersonaID).ToArrayAsync();
                     contCreditos = await ConexionBD.database.QueryAsync<Creditos_VW>("SELECT TOP(5) * FROM Creditos.Creditos_VW WHERE (PersonaID=@0) order by CreditoID DESC", persona.PersonaID).ToArrayAsync();

                     // Obtenemos Documentos
                     // var ine = ""; //String.Format("{0}://{1}{2}/wwwroot/Archivos/FirmaDistribuidor/{3}", Request.Scheme, Request.Host, Request.PathBase, "ine.png");
                     // var firma = ""; //String.Format("{0}://{1}{2}/wwwroot/Archivos/FirmaDistribuidor/{3}", Request.Scheme, Request.Host, Request.PathBase, "firma.png");

                     parData.PersonaID = parData.PersonaID;
                     var documentos = await getIne(parData);

                     // Regresamos los datos a la UI
                     await ConexionBD.Destroy();
                     return Ok(new { persona, direcciones, empleos, documentos, creditos, contCreditos, cliente });

                 }
                 else
                 {
                     //generar query
                     var usuario = await ConexionBD.database.QueryAsync<TipoPersona_VW>("SELECT * FROM dbo.GetUsuarioTipoId(@0)", parData.usuario_id).FirstAsync();
                     //var query = NPoco.Sql.Builder.Select("PersonaID", "NombreCompleto", "RFC", "CURP", "DistribuidorID", "ClienteID", "CoordinadorID", "DistribuidoresEstatusID", "DistribuidoresEstatus", "TelefonoMovil", "FechaHoraRegistro").From("General.Personas_VW");
                     var query = NPoco.Sql.Builder.Select("PersonaID", "NombreCompleto", "RFC", "CURP", "DistribuidorID", "DistribuidoresEstatusID", "DistribuidoresEstatus", "TelefonoMovil", "FechaHoraRegistro").From("Creditos.DistribuidoresUsuarioSucursal_VW");
                     //Si tenemos la variable de nombre

                     if(usuario.TipoUsuario == "MT")
                         //query = query.Where("dbo.Levenshtein(UPPER(RFC), UPPER(@0), 10) <= 1", parData.RFC);
                     if(usuario.TipoUsuario == "GR" || usuario.TipoUsuario == "CJ")
                         query = query.Where("SucursalID = @0", usuario.sucursal_id);
                     if(usuario.TipoUsuario == "CD")
                         query = query.Where("GrupoID = @0", usuario.grupo_id);    


                     if (!string.IsNullOrEmpty(parData.Nombre))
                         query = query.Where(
                             @"(dbo.Levenshtein(UPPER(NombreCompleto), UPPER(@0), 3) <= 3 OR NombreCompleto LIKE '%' + UPPER(@0) + '%'
                         )", parData.Nombre);

                     // Si tenemos la variable de RFC
                     if (!string.IsNullOrEmpty(parData.RFC))
                         query = query.Where("dbo.Levenshtein(UPPER(RFC), UPPER(@0), 10) <= 1", parData.RFC);

                     // Si tenemos la variable de curp
                     if (!string.IsNullOrEmpty(parData.CURP))
                         query = query.Where("dbo.Levenshtein(UPPER(CURP), UPPER(@0), 10) <= 1", parData.CURP);

                     // Si tenemos la variable de curp
                     if (parData.SexoID != null)
                         query = query.Where("SexoID = @0", parData.SexoID);

                     // Si tenemos la variable de curp
                     if (parData.OcupacionID != null)
                         query = query.Where("OcupacionID = @0", parData.OcupacionID);

                     // Si tenemos la variable de curp
                     // if (parData.EscolaridadID != null)
                     //     query = query.Where("EscolaridadID = @0", parData.EscolaridadID);

                     // Si tenemos la variable de curp
                     if (parData.EstadoCivilID != null)
                         query = query.Where("EstadoCivilID = @0", parData.EstadoCivilID);

                     // Clientes
                     if (parData.Distribuidor != null)
                         query = query.Where("DistribuidorID IS NOT NULL AND DistribuidorID IN (SELECT subq.DistribuidorID FROM Distribuidores.Distribuidores_VW subq WHERE ProductoID = @0)", ProductoID);

                     // Distribuidor
                     // if (parData.Cliente != null)
                     //     query = query.Where("ClienteID IS NOT NULL AND ClienteID IN (SELECT subq.PersonaID FROM Distribuidores.Clientes subq WHERE ProductoID = @0)", ProductoID);

                     // Coordinadores
                     if (parData.Coordinador != null)
                         query = query.Where("- IN (SELECT subq.CoordinadorID FROM Creditos.Grupos subq WHERE ProductoID = @0)", ProductoID);

                     // Prospectos
                     if (parData.Prospecto != null)
                         query = query.Where("ProspectoID IS NOT NULL AND ProspectoID IN (SELECT subq.ProspectoID FROM Prospeccion.Prospectos subq WHERE ProductoID = @0", ProductoID);

                     if (parData.Sac == true)
                         query = query.Where("SACId IS NOT NULL");

                     // Validamos nuestra peticion
                     var res = await ConexionBD.database.QueryAsync<DistribuidorTipoUsuario>(query).ToArrayAsync();
                     await ConexionBD.Destroy();
                     return Ok(res);
                 }
             }
             catch (Exception ex)
             {
                 await ConexionBD.Destroy();
                 return BadRequest(ex.Message);
             }
         } */

        [HttpPost]
        [Route("getPersonaProducto")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getPersonaProducto(PeticionesRest.Administracion.Personas.Get parData)
        {
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();
            var empresaID = UsuarioActual.usuario_empresaId;
            if (parData.PersonaID != null)
            {
                try
                {
                    // Registro de persona
                    var persona = await ConexionBD.database.QueryAsync<DBContext.DBConfia.General.Personas_VW>("WHERE PersonaID=@0", parData.PersonaID).SingleOrDefaultAsync();
                    var creditos = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos_VW>("WHERE PersonaID=@0", parData.PersonaID).SingleOrDefaultAsync();

                    // Obtenemos los datos dynamicos de la personaº
                    // DBContext.DBConfia.Distribuidores.Distribuidores_VW distribuidor = null;
                    long[] personas_direcciones = null;
                    Direcciones_VW[] direcciones = null;
                    Empleos_VW[] empleos = null;
                    //Creditos_VW[] creditos = null;

                    // Obtenemos los datos basicos
                    personas_direcciones = (await ConexionBD.database.QueryAsync<PersonasDirecciones>("WHERE PersonaID=@0", persona.PersonaID).ToArrayAsync()).Select(x => x.DireccionID).ToArray();
                    direcciones = await ConexionBD.database.QueryAsync<Direcciones_VW>("WHERE DireccionID IN(@0)", personas_direcciones).OrderByDescending(x => x.CreacionFecha).ToArrayAsync();
                    empleos = await ConexionBD.database.QueryAsync<Empleos_VW>("WHERE PersonaID=@0", persona.PersonaID).OrderByDescending(x => x.CreacionFecha).ToArrayAsync();
                    //creditos = await ConexionBD.database.QueryAsync<Creditos_VW>("WHERE PersonaID=@0", persona.PersonaID).ToArrayAsync();


                    // Obtenemos Documentos
                    // var ine = ""; //String.Format("{0}://{1}{2}/wwwroot/Archivos/FirmaDistribuidor/{3}", Request.Scheme, Request.Host, Request.PathBase, "ine.png");
                    // var firma = ""; //String.Format("{0}://{1}{2}/wwwroot/Archivos/FirmaDistribuidor/{3}", Request.Scheme, Request.Host, Request.PathBase, "firma.png");

                    parData.PersonaID = parData.PersonaID;
                    var documentos = await getIne(parData);

                    // Regresamos los datos a la UI
                    await ConexionBD.Destroy();
                    return Ok(new { persona, direcciones, empleos, documentos, creditos });
                }
                catch (Exception ex)
                {
                    await ConexionBD.Destroy();
                    return NotFound(ex.Message);
                }
            }
            else
            {
                try
                {
                    if (empresaID == 6)
                    {
                        var query = NPoco.Sql.Builder.Select("PersonaID", "NombreCompleto", "RFC", "CURP", "DistribuidorID", "ClienteID", "CoordinadorID", "DistribuidoresEstatusID", "DistribuidoresEstatus", "EmpresaID").From("General.PersonasProducto_VW").Where("EmpresaID = @0", empresaID);

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

                        // Si tenemos la variable de curp
                        if (parData.SexoID != null)
                            query = query.Where("SexoID = @0", parData.SexoID);

                        // Si tenemos la variable de curp
                        if (parData.OcupacionID != null)
                            query = query.Where("OcupacionID = @0", parData.OcupacionID);

                        // Si tenemos la variable de curp
                        if (parData.EscolaridadID != null)
                            query = query.Where("EscolaridadID = @0", parData.EscolaridadID);

                        // Si tenemos la variable de curp
                        if (parData.EstadoCivilID != null)
                            query = query.Where("EstadoCivilID = @0", parData.EstadoCivilID);

                        // Clientes
                        if (parData.Distribuidor != null)
                            query = query.Where("DistribuidorID IS NOT NULL", parData.EstadoCivilID);

                        // Distribuidor
                        if (parData.Cliente != null)
                            query = query.Where("ClienteID IS NOT NULL", parData.EstadoCivilID);

                        // Coordinadores
                        if (parData.Coordinador != null)
                            query = query.Where("CoordinadorID IS NOT NULL", parData.EstadoCivilID);

                        // Prospectos
                        if (parData.Prospecto != null)
                            query = query.Where("ProspectoID IS NOT NULL", parData.EstadoCivilID);

                        // Validamos nuestra peticion
                        var res = await ConexionBD.database.QueryAsync<PersonasProducto_VW>(query).ToArrayAsync();
                        await ConexionBD.Destroy();
                        return Ok(res);

                    }
                    else
                    {
                        var query = NPoco.Sql.Builder.Select("PersonaID", "NombreCompleto", "RFC", "CURP", "DistribuidorID", "ClienteID", "CoordinadorID", "DistribuidoresEstatusID", "DistribuidoresEstatus", "EmpresaID").From("General.PersonasProducto_VW").Where("EmpresaID != 6");

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

                        // Si tenemos la variable de curp
                        if (parData.SexoID != null)
                            query = query.Where("SexoID = @0", parData.SexoID);

                        // Si tenemos la variable de curp
                        if (parData.OcupacionID != null)
                            query = query.Where("OcupacionID = @0", parData.OcupacionID);

                        // Si tenemos la variable de curp
                        if (parData.EscolaridadID != null)
                            query = query.Where("EscolaridadID = @0", parData.EscolaridadID);

                        // Si tenemos la variable de curp
                        if (parData.EstadoCivilID != null)
                            query = query.Where("EstadoCivilID = @0", parData.EstadoCivilID);

                        // Clientes
                        if (parData.Distribuidor != null)
                            query = query.Where("DistribuidorID IS NOT NULL", parData.EstadoCivilID);

                        // Distribuidor
                        if (parData.Cliente != null)
                            query = query.Where("ClienteID IS NOT NULL", parData.EstadoCivilID);

                        // Coordinadores
                        if (parData.Coordinador != null)
                            query = query.Where("CoordinadorID IS NOT NULL", parData.EstadoCivilID);

                        // Prospectos
                        if (parData.Prospecto != null)
                            query = query.Where("ProspectoID IS NOT NULL", parData.EstadoCivilID);

                        // Validamos nuestra peticion
                        var res = await ConexionBD.database.QueryAsync<PersonasProducto_VW>(query).ToArrayAsync();
                        await ConexionBD.Destroy();
                        return Ok(res);
                    }


                }
                catch (Exception ex)
                {
                    await ConexionBD.Destroy();
                    return NotFound(ex.Message);
                }

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






        [HttpPost]
        [Route("perfil/cliente/get")]
        [Authorize]
        public async Task<IActionResult> PerfilClienteGet(PeticionesRest.Administracion.Personas.Interactuar parData)
        {
            // Obtenemos la vista del cliente
            var cliente = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Clientes_VW>("WHERE ClienteID=@0", parData.PersonaID).ToArrayAsync();
            await ConexionBD.Destroy();
            // Mandamos el cliente a la UI
            return Ok(cliente);
        }


        [HttpPost]
        [Route("getWithSAC")]
        [Authorize]
        [Code.KeycloakSecurityAttributes(new string[] { "ADMINISTRACION" })]
        public async Task<IActionResult> getWithSAC(PeticionesRest.Administracion.Personas.getSAC parData)
        {
            if (parData.NombreCompleto != null)
            {
                try
                {
                    parData.NombreCompleto += "%";

                    if (parData.isSucursal == true)
                    {
                        var res = await ConexionBD.database.FetchAsync<Personas>("SELECT A.* FROM GENERAL.PERSONAS A JOIN Creditos.Coordinadores B ON A.PersonaID = B.CoordinadorID WHERE (SACId IS NOT NULL OR SACId > 0) AND (NombreCompleto LIKE @0)", parData.NombreCompleto);
                        await ConexionBD.Destroy();
                        return Ok(res);
                    }
                    else
                    {
                        var res = await ConexionBD.database.FetchAsync<Personas>("SELECT * FROM GENERAL.PERSONAS WHERE (SACId IS NOT NULL OR SACId > 0) AND (NombreCompleto LIKE @0)", parData.NombreCompleto);
                        await ConexionBD.Destroy();
                        return Ok(res);
                    }

                }
                catch (Exception ex)
                {
                    await ConexionBD.Destroy();
                    return NotFound(ex.Message);
                }

            }
            else
            {
                try
                {
                    var res = await ConexionBD.database.FetchAsync<Personas>("WHERE SACId is not null ", parData.PersonaID);
                    await ConexionBD.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await ConexionBD.Destroy();
                    return BadRequest(ex.Message);
                }
            }
        }

        [HttpPost]
        [Route("empleo/add")]
        [Authorize]
        public async Task<IActionResult> AgregarEmpleo(PeticionesRest.Administracion.Personas.AgregarEmpleo parData)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            // Generamos el registro de empleado
            try
            {
                // Comenzamos una transaccion
                ConexionBD.database.BeginTransaction();

                // Direccion 
                var DireccionEmpleo = new Direcciones()
                {
                    vialidadTipoId = parData.DireccionEmpleo_vialidadTipoId,
                    orientacionVialidadTipoId = parData.DireccionEmpleo_orientacionVialidadTipoId,
                    AsentamientoID = parData.DireccionEmpleo_AsentamientoID,
                    NombreVialidad = parData.DireccionEmpleo_NombreVialidad,
                    NumeroExterior = parData.DireccionEmpleo_NumeroExterior,
                    NumeroInterior = parData.DireccionEmpleo_NumeroInterior,
                    ReferenciasGeograficas = parData.DireccionEmpleo_ReferenciaGeografica,
                    ViviendaTipoId = parData.DireccionEmpleo_viviendaTipoId,
                    CreacionFecha = DateTime.Now,
                    CreacionPersonaID = (long)UsuarioActual.PersonaID,
                    CreacionUsuarioID = UsuarioActual.UsuarioID
                };

                // Ingresamos la persona a la BD
                await ConexionBD.database.InsertAsync(DireccionEmpleo);


                var FechaIngresoActu = parData.FormaEmpleo__FechaIngreso.AddHours(+6);

                var Empleo = new Empleos()
                {
                    PersonaID = parData.PersonaID,
                    OcupacionID = parData.FormaEmpleo__OcupacionID,
                    Empresa = parData.FormaEmpleo__Empresa,
                    Puesto = parData.FormaEmpleo__Puesto,
                    Telefono = parData.FormaEmpleo__Telefono,
                    DireccionID = DireccionEmpleo.DireccionID,
                    FechaIngreso = FechaIngresoActu,
                    FechaTermino = parData.FormaEmpleo__FechaTermino,
                    SueldoMensual = parData.FormaEmpleo__SueldoMensual,
                    CreacionFecha = DateTime.Now,
                    CreacionPersonaID = (long)UsuarioActual.PersonaID,
                    CreacionUsuarioID = UsuarioActual.UsuarioID
                };

                // Insertamos un nuevo empleo
                await ConexionBD.database.InsertAsync(Empleo);

                // Hacemos el commit a la transaccion
                ConexionBD.database.CompleteTransaction();

                var res = await AddEmpleo(parData);

                if (res == 1)
                {
                    // Regresamos el nuevo empleo ingresado
                    return Ok(await ConexionBD.database.QueryAsync<Empleos_VW>("WHERE PersonaID=@0", parData.PersonaID).OrderByDescending(x => x.CreacionFecha).ToArrayAsync());
                }
                else
                {
                    await ConexionBD.Destroy();
                    return BadRequest("ERROR AL PROCESAR EMPLEO");
                }
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("ERROR AL PROCESAR EMPLEO");
            }
        }

        protected async Task<String> AddProspectoInfo(PeticionesRest.Prospeccion.Prospecto.Agregar parData)
        {
            int bandera = 0;
            try
            {
                // Comenzamos una transaccion
                ConexionBD.database.BeginTransaction();

                var direccionProspecto = new Domicilios()
                {
                    PersonaID = parData.PersonaID,
                    TipoPersonaID = 1,

                    AsentamientoID = parData.DireccionPersona_AsentamientoID,
                    calle = parData.DireccionPersona_NombreVialidad?.ToUpper(),
                    localidad = parData.DireccionPersona_Localidad?.ToUpper(),
                    numeroExterior = parData.DireccionPersona_NumeroExterior?.ToUpper(),
                };
                await ConexionBD.database.InsertAsync(direccionProspecto);

                if (parData.Laboral_Trabaja)
                {
                    bandera = 1;
                    var empleoProspecto = new InformacionLaboral()
                    {
                        PersonaID = parData.PersonaID,
                        TipoPersonaID = 1,

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
                    await ConexionBD.database.InsertAsync(empleoProspecto);
                }

                if (parData.Conyuge_Trabaja)
                {
                    bandera = 2;
                    var empleoConyuge = new InformacionLaboral()
                    {
                        PersonaID = parData.PersonaID,
                        TipoPersonaID = 2,

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

                return "";
            }
            catch (Exception ex)
            {
                return $"{ex.Message} " + (bandera == 0 ? "Error al guardar Direccion" : bandera == 1 ? "Error al guarda Info. Laboral" : "Error al guardar Info. Laboral Conyuge");
                throw new Exception("Error al guardar AddProspectoInfo"); ;
            }

        }

        protected async Task<int> AddEmpleo(PeticionesRest.Administracion.Personas.AgregarEmpleo parData)
        {
            // Obtenemos el email del usuario de los claims
            // var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            // var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            // Generamos el registro de empleado
            try
            {
                // Comenzamos una transaccion
                ConexionBD.database.BeginTransaction();

                // Direccion
                var DireccionEmpleo = new Direcciones()
                {
                    vialidadTipoId = parData.DireccionEmpleo_vialidadTipoId,
                    orientacionVialidadTipoId = parData.DireccionEmpleo_orientacionVialidadTipoId,
                    AsentamientoID = parData.DireccionEmpleo_AsentamientoID,
                    NombreVialidad = parData.DireccionEmpleo_NombreVialidad,
                    NumeroExterior = parData.DireccionEmpleo_NumeroExterior,
                    NumeroInterior = parData.DireccionEmpleo_NumeroInterior,
                    ReferenciasGeograficas = parData.DireccionEmpleo_ReferenciaGeografica,
                    ViviendaTipoId = parData.DireccionEmpleo_viviendaTipoId,
                    CreacionFecha = DateTime.Now,
                    CreacionPersonaID = (long)UsuarioActual.PersonaID,
                    CreacionUsuarioID = UsuarioActual.UsuarioID
                };

                // Ingresamos la persona a la BD
                await ConexionBD.database.InsertAsync(DireccionEmpleo);

                var Empleo = new Empleos()
                {
                    PersonaID = parData.PersonaID,
                    OcupacionID = parData.FormaEmpleo__OcupacionID,
                    Empresa = parData.FormaEmpleo__Empresa,
                    Puesto = parData.FormaEmpleo__Puesto,
                    Telefono = parData.FormaEmpleo__Telefono,
                    DireccionID = DireccionEmpleo.DireccionID,
                    FechaIngreso = parData.FormaEmpleo__FechaIngreso,
                    FechaTermino = parData.FormaEmpleo__FechaTermino,
                    SueldoMensual = parData.FormaEmpleo__SueldoMensual,
                    CreacionFecha = DateTime.Now,
                    CreacionPersonaID = (long)UsuarioActual.PersonaID,
                    CreacionUsuarioID = UsuarioActual.UsuarioID
                };

                // Insertamos un nuevo empleo
                await ConexionBD.database.InsertAsync(Empleo);

                // Hacemos el commit a la transaccion
                ConexionBD.database.CompleteTransaction();

                return 1;

            }
            catch (Exception ex)
            {
                return 0;
            }
        }

        [HttpPost]
        [Route("direccion/add")]
        [Authorize]
        public async Task<IActionResult> AgregarDireccion(PeticionesRest.Administracion.Personas.AgregarDireccion parData)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            // Generamos el registro de empleado
            try
            {
                // Direccion
                var Direccion = new Direcciones()
                {
                    vialidadTipoId = parData.DireccionPersona_viviendaTipoId,
                    orientacionVialidadTipoId = parData.DireccionPersona_orientacionVialidadTipoId,
                    AsentamientoID = parData.DireccionPersona_AsentamientoID,
                    NombreVialidad = parData.DireccionPersona_NombreVialidad,
                    NumeroExterior = parData.DireccionPersona_NumeroExterior,
                    NumeroInterior = parData.DireccionPersona_NumeroInterior,
                    ReferenciasGeograficas = parData.DireccionPersona_ReferenciaGeografica,
                    ViviendaTipoId = parData.DireccionPersona_viviendaTipoId,
                    CreacionFecha = DateTime.Now,
                    CreacionPersonaID = (long)UsuarioActual.PersonaID,
                    CreacionUsuarioID = UsuarioActual.UsuarioID
                };

                // Comenzamos una transaccion
                ConexionBD.database.BeginTransaction();

                // Ingresamos la persona a la BD
                await ConexionBD.database.InsertAsync(Direccion);

                // Insertamos la relacion a la direccion de la persona
                await ConexionBD.database.InsertAsync(new PersonasDirecciones() { PersonaID = parData.PersonaID, DireccionID = Direccion.DireccionID });

                // Hacemos el commit a la transaccion
                ConexionBD.database.CompleteTransaction();

                var res = await AddDireccion(parData);

                if (res == 1)
                {
                    // Obtenemos los id de direcciones de la empresa
                    var DireccionesIds = (await ConexionBD.database.QueryAsync<PersonasDirecciones>("WHERE PersonaID=@0", parData.PersonaID).ToArrayAsync()).Select(x => x.DireccionID).ToArray();
                    var direcc1 = await ConexionBD.database.QueryAsync<Direcciones_VW>("WHERE DireccionID IN (@0)", DireccionesIds).OrderByDescending(x => x.CreacionFecha).ToArrayAsync();
                    await ConexionBD.Destroy();
                    return Ok();
                }
                else
                {
                    await ConexionBD.Destroy();
                    return BadRequest("ERROR AL PROCESAR LA DIRECCION ");
                }
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("ERROR AL PROCESAR LA DIRECCION ");
            }

        }

        protected async Task<int> AddDireccion(PeticionesRest.Administracion.Personas.AgregarDireccion parData)
        {
            // Obtenemos el email del usuario de los claims
            // var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            // var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            // Generamos el registro de empleado
            try
            {
                // Direccion
                var Direccion = new Direcciones()
                {
                    vialidadTipoId = parData.DireccionPersona_vialidadTipoId,
                    orientacionVialidadTipoId = parData.DireccionPersona_orientacionVialidadTipoId,
                    AsentamientoID = parData.DireccionPersona_AsentamientoID,
                    NombreVialidad = parData.DireccionPersona_NombreVialidad,
                    NumeroExterior = parData.DireccionPersona_NumeroExterior,
                    NumeroInterior = parData.DireccionPersona_NumeroInterior,
                    ReferenciasGeograficas = parData.DireccionPersona_ReferenciaGeografica,
                    ViviendaTipoId = parData.DireccionPersona_viviendaTipoId,
                    CreacionFecha = DateTime.Now,
                    CreacionPersonaID = (long)UsuarioActual.PersonaID,
                    CreacionUsuarioID = UsuarioActual.UsuarioID
                };

                // Comenzamos una transaccion
                ConexionBD.database.BeginTransaction();

                // Ingresamos la persona a la BD
                await ConexionBD.database.InsertAsync(Direccion);

                // Insertamos la relacion a la direccion de la persona
                await ConexionBD.database.InsertAsync(new PersonasDirecciones() { PersonaID = parData.PersonaID, DireccionID = Direccion.DireccionID });

                // Hacemos el commit a la transaccion
                ConexionBD.database.CompleteTransaction();

                return 1;
            }
            catch (Exception ex)
            {
                return 0;
            }
        }

        [HttpPost]
        [Route("creditos/get")]
        [Authorize]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> CreditosGet(PeticionesRest.Administracion.Personas.CreditosGet parData)
        {
            // Obtenemos el detalle del cliente
            var Cliente = await ConexionBD.database.QueryAsync<Clientes_VW>("WHERE ClienteID=@0", parData.ClienteID).SingleOrDefaultAsync();

            // Si el cliente es nulo
            if (Cliente == null)
                await ConexionBD.Destroy();
            return BadRequest("La persona no es un cliente");


            // Variable para almacenar los creditos recientes
            DBContext.DBConfia.Creditos.Creditos_VW[] Creditos = null;

            // Checamos el tipo de peticion
            if (parData.Recientes)
                Creditos = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos_VW>("WHERE ClienteID=@0 AND FechaHoraRegistro >= @1", Cliente.ClienteID, DateTime.Now.Date.AddMonths(-3)).ToArrayAsync();
            else
            {
                // Generamos un nuevo query para las personas
                var query = NPoco.Sql.Builder.Where("ClienteID=@0 AND FechaHoraRegistro >= @1 AND FechaHoraRegistro <= @2", Cliente.ClienteID, parData.FechaInicio.Value.Date, parData.FechaFin.Value.Date);
                if (!string.IsNullOrEmpty(parData.EstatusID))
                {
                    query = query.Where("EstatusID=@0", parData.EstatusID);
                }
                Creditos = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos_VW>(query).ToArrayAsync();
            }

            // Regresamos el detalle del usuario
            return Ok(new { Cliente, Creditos });
        }

        // [HttpGet]
        // [Route("getDocumentosByPersona/{personaID}")]
        // [Authorize]
        // public async Task<IActionResult> getDocumentosByPersona(int personaID)
        // {
        //     try
        //     {
        //         return Ok(await ConexionBD.database.FetchAsync<DBContext.DBConfia.General.PersonasDoc>("WHERE PersonaID = @0", personaID));
        //     }
        //     catch (Exception ex)
        //     {
        //         return NotFound(ex.Message);
        //     }
        // }



        [HttpPost]
        [Route("getDocumentos")]
        [Authorize]
        [Code.TProteccionProducto]
        // [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> GetDocs(ConfiaWebApi.PeticionesRest.General.ObtenerDocsDistribuidor.getDocumentos parData)
        {

            try
            {
                var obj = new { PersonaID = parData.PersonaID, TipoPersona = 1 };
                var res = await ConexionBD.database.QueryAsync<ObtenerDocsDistibuidor>("EXEC General.pa_ObtenerDocsDistribuidor @PersonaID, @TipoPersona", obj).ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (System.Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("ERROR AL MOSTRAR DATOS: " + ex.Message);
                // throw;
            }

        }




        [HttpPost]
        [Route("getDocumentosPersona")]
        [Authorize]
        [Code.TProteccionProducto]
        // [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> GetDocsPersona(ConfiaWebApi.PeticionesRest.General.ObtenerDocsDistribuidor.getDocumentos parData)
        {

            try
            {
                var obj = new { PersonaID = parData.PersonaID, TipoPersona = 1 };
                var res = await ConexionBD.database.QueryAsync<PersonasDoc>("WHERE PersonaID = @0", parData.PersonaID).ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (System.Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("ERROR AL MOSTRAR DATOS: " + ex.Message);
                // throw;
            }

        }

        [HttpPost]
        [Route("getDoc")]
        // [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> GetDoc(PeticionesRest.Administracion.Personas.GetDoc parData)
        {
            try
            {


                var src = "";

                var DocTipo = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Catalogos.TipoDocumento>("SELECT * FROM General.PersonasDoc pd INNER JOIN Catalogos.TipoDocumento td  ON pd.TiposDocumentoID = td.TipoDocumentoID  WHERE pd.PersonasDocID =  @0 ", parData.PersonasDocID);

                foreach (var item in DocTipo)
                {
                    if (item.Clave != "D042")
                    {
                        var Documento = await ConexionBD.database.SingleByIdAsync<PersonasDoc>(parData.PersonasDocID);
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
                                src = request.url;
                            }
                            else
                            {
                                await ConexionBD.Destroy();
                                return BadRequest(response.StatusCode);
                            }
                        }
                        var res = new
                        {
                            res = 1,
                            msj = $"Consulta correcta del documento {parData.PersonasDocID}",
                            src = $"{src}"
                        };
                        await ConexionBD.Destroy();
                        return Ok(res);
                    }
                    else
                    {
                        //  var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                        // var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                        // var result = await ConexionBD.database.QueryAsync<ConsultaBuro>("WHERE PersonaID=@0", parData.ProspectoID).FirstOrDefaultAsync();

                        // if (result.ResultCode == 0)
                        // {

                        var Documento = await ConexionBD.database.SingleByIdAsync<PersonasDoc>(parData.PersonasDocID);
                        var srcBC = Documento.RutaDoc; //await ConexionBD.database.FetchAsync<Documentos>("SELECT d.* FROM Prospeccion.Documentos d INNER JOIN Prospeccion.TipoDocumento tp ON d.TipoDocumentoID = tp.TipoDocumentoID INNER JOIN Catalogos.TipoDocumento td ON tp.CatalogoTipoDocumentoID = td.TipoDocumentoID WHERE d.PersonaID = @0 AND td.Clave = 'D042'", parData.ProspectoID);


                        WebClient MyWebClient = new WebClient();
                        // WebClient MyWebClient = new WebClient();
                        MyWebClient.Credentials = new NetworkCredential(Configuracion["userFtpConfia"], Configuracion["passFtpConfia"]);
                        byte[] BytesFile = MyWebClient.DownloadData(srcBC);
                        string srcB64 = Convert.ToBase64String(BytesFile, 0, BytesFile.Length);

                        var res = new
                        {
                            res = 2,
                            msj = $"Consulta correcta del documento {parData.PersonasDocID}",
                            src = $"{srcB64}"
                        };

                        await ConexionBD.Destroy();
                        return Ok(res);
                        // }
                        // else 
                        // {
                        //     var res = new
                        //     {
                        //         result = result,
                        //         src = ""
                        //     };

                        //     return Ok(res);
                        // }
                    }
                }
                await ConexionBD.Destroy();
                return Ok(DocTipo);


            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("ERROR AL GUARDAR LOS DATOS ECONOMICOS DE LA PERSONA: " + ex.Message);
            }

        }


        [HttpPost]
        [Route("getBC")]
        [Authorize]
        public async Task<IActionResult> GetBC(PeticionesRest.Prospeccion.Prospecto.GetPerfil parData)
        {
            if (parData.ProspectoID != null)
            {
                try
                {
                    var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                    var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                    var result = await ConexionBD.database.QueryAsync<ConsultaBuro>("WHERE PersonaID=@0", parData.ProspectoID).FirstOrDefaultAsync();

                    if (result.ResultCode == 0)
                    {
                        var srcBC = await ConexionBD.database.FetchAsync<Documentos>("SELECT d.* FROM Prospeccion.Documentos d INNER JOIN Prospeccion.TipoDocumento tp ON d.TipoDocumentoID = tp.TipoDocumentoID INNER JOIN Catalogos.TipoDocumento td ON tp.CatalogoTipoDocumentoID = td.TipoDocumentoID WHERE d.PersonaID = @0 AND td.Clave = 'D042'", parData.ProspectoID);

                        WebClient MyWebClient = new WebClient();
                        // WebClient MyWebClient = new WebClient();
                        MyWebClient.Credentials = new NetworkCredential(Configuracion["userFtpConfia"], Configuracion["passFtpConfia"]);
                        byte[] BytesFile = MyWebClient.DownloadData(srcBC[0].Ruta);
                        string srcB64 = Convert.ToBase64String(BytesFile, 0, BytesFile.Length);

                        var res = new
                        {
                            result = result,
                            src = srcB64
                        };
                        await ConexionBD.Destroy();
                        return Ok(res);
                    }
                    else
                    {
                        var res = new
                        {
                            result = result,
                            src = ""
                        };
                        await ConexionBD.Destroy();
                        return Ok(res);
                    }
                }
                catch (Exception ex)
                {
                    await ConexionBD.Destroy();
                    return BadRequest(ex.Message);
                }
            }
            else
            {
                return NotFound("Acción No Valida");
            }
        }

        [HttpGet]
        [Route("getBuroByPersona/{personaID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getBuroByPersona(int personaID)
        {
            try
            {
                var buro = await ConexionBD.database.FetchAsync<DBContext.DBConfia.General.ConsultaBuro>("WHERE PersonaID = @0", personaID);
                await ConexionBD.Destroy();
                return Ok(buro);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("AddDireccion")]
        [Authorize]
        [Code.TProteccionProducto]

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
                    res = 1,
                    msj = "Se creó la Dirección (persona) con el id:" + PersonaDireccion.DireccionID,
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
        [Route("AddCoordi")]
        [Authorize]
        [Code.TProteccionProducto]
        // [Code.KeycloakSecurityAttributes(new string[] { "DISTRIBUIDORES" })]

        public async Task<IActionResult> AddCoordi(PeticionesRest.Administracion.Personas.AddCoordi parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            var permiso = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Catalogos.OcupacionCoord_VW>("WHERE PersonaID=CoordinadorID AND EsCoordinador=@1", parData.CoordinadorID).FirstOrDefaultAsync();


            if (permiso == null)
            {
                await ConexionBD.Destroy();
                return BadRequest("ERROR AL CREAR COORDINADOR: ");
            }
            else
            {
                try
                {

                    var NewCoordi = new DBContext.DBConfia.Creditos.Coordinadores()
                    {

                        CoordinadorID = parData.CoordinadorID,
                        SucursalID = parData.SucursalID,
                        GrupoID = '1',
                        CarteraVencida = false,
                        ImprimirRelacionesMasivas = true,
                        EstadoCoordinadorId = "A",
                        CreacionFecha = DateTime.Now,
                        CreacionPersonaId = UsuarioActual.PersonaID,
                        ModificacionPersonaId = null,
                        CreacionUsuarioId = null,
                        ModificacionUsuarioId = null

                    };

                    await ConexionBD.database.InsertAsync(NewCoordi);
                    await ConexionBD.Destroy();
                    return Ok(NewCoordi);
                }
                catch (Exception ex)
                {
                    ConexionBD.database.AbortTransaction();
                    return BadRequest("ERROR AL CREAR COORDINADOR: " + ex.Message);
                }
            }
            return BadRequest("ERROR AL CREAR COORDINADOR: ");


        }


        [HttpPost]
        [Route("CanjePlus")]
        [Authorize]
        [Code.TProteccionProducto]
        // [Code.KeycloakSecurityAttributes(new string[] { "DISTRIBUIDORES" })]

        public async Task<IActionResult> CanjePlus(PeticionesRest.Administracion.Personas.AddCoordi parData)
        {

            try
            {
                var CanjePlus = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Distribuidores.Distribuidores>("WHERE DistribuidorID=@0", parData.PersonaID).FirstOrDefaultAsync();
                    if (CanjePlus != null)
                    {
                        CanjePlus.CanjePlus = true;
                        await ConexionBD.database.UpdateAsync(CanjePlus);
                    }
                return Ok(CanjePlus);
            }
            catch (Exception ex)
            {

                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("UpdateCoordi")]
        [Authorize]
        [Code.TProteccionProducto]
        // [Code.KeycloakSecurityAttributes(new string[] { "DISTRIBUIDORES" })]

        public async Task<IActionResult> UpdateCoordi(PeticionesRest.Administracion.Personas.AddCoordi parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();


            try
            {
                var Update = await ConexionBD.database.SingleByIdAsync<Coordinadores>(parData.CoordinadorID);
                if (Update != null)
                {
                    Update.EstadoCoordinadorId = "A";
                    ConexionBD.database.BeginTransaction();
                    await ConexionBD.database.UpdateAsync(Update);
                    ConexionBD.database.CompleteTransaction();
                    await ConexionBD.Destroy();
                }
                return Ok(Update);
            }
            catch (Exception ex)
            {

                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
            return Ok();
        }





        [HttpPost]
        [Route("AddEmpleo")]
        [Authorize]
        [Code.TProteccionProducto]
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
                    res = 1,
                    msj = "Se creó la persona (Empleo) con el id: " + Empleo.EmpleoID,
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
        [Route("actualizarContrasena")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ActualizarContrasena(PeticionesRest.Administracion.Personas.ActualizaContra parData)
        {

            // var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            // var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();
            // var empresaID = UsuarioActual.usuario_empresaId;
            //usuarioModifica
            //PersonaModifica


            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var PersonaUsuarioActual = await ConexionBD.database.QueryAsync<Usuarios_Personas>("WHERE PersonaID=@0", UsuarioActual.PersonaID).SingleOrDefaultAsync();
                //Persona
                var Persona = await ConexionBD.database.QueryAsync<Usuarios_Personas>("WHERE PersonaID=@0", parData.PersonaID).SingleOrDefaultAsync();


                // Comenzamos una transaccion
                ConexionBD.database.BeginTransaction();

                // Obtenemos el registro de la persona
                //el id de el usuario a actalizar
                var Usuario = await ConexionBD.database.SingleByIdAsync<Usuarios>(Persona.UsuarioID);
                // Actualizamos los datos
                Usuario.Contrasena = BCrypt.Net.BCrypt.HashPassword(parData.Contrasena);

                await ConexionBD.database.UpdateAsync(Usuario);
                // Persona.CreacionFecha = DateTime.Now;

                var LogContrasenas = new LogContrasenas()
                {
                    //  LogContrasenaID p
                    PersonaID = Persona.PersonaID,
                    PersonaIDModifica = PersonaUsuarioActual.PersonaID,
                    UsuarioIDModifica = UsuarioActual.UsuarioID,
                    FechaHora = DateTime.Now
                    // PersonaID
                    // PersonaIDModifica
                    // UsuarioIDModifica
                    // FechaHora

                };
                await ConexionBD.database.InsertAsync(LogContrasenas);
                // return Ok(Escolaridad);

                // Hacemos el commit a la transaccion
                ConexionBD.database.CompleteTransaction();

                // Regresamos el nuevo empleo ingresado
                return Ok(await ConexionBD.database.QueryAsync<Usuarios>("WHERE UsuarioID=@0", Usuario.UsuarioID).SingleOrDefaultAsync());
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("ERROR AL MODIFICAR EL USUARIO: " + ex.Message);
            }
        }
        [HttpGet]
        [Route("getbyId/{PersonaID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerPorId(int PersonaID)
        {
            try
            {
                var res = await ConexionBD.database.QueryAsync<DBContext.DBConfia.General.Personas_VW>("WHERE PersonaID=@0", PersonaID).FirstOrDefaultAsync();
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