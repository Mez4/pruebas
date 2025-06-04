using ConfiaWebApi.PeticionesRest.Administracion.Personas;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Prospeccion;
using DBContext.DBConfia.Seguridad;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.AppProspeccion
{
    [Authorize]
    [ApiController]
    [Route("api/AppProspeccion/[controller]")]
    public class AppPersonasController : ControllerBase
    {
        private DBConfiaContext ConexionBD;

        private IConfiguration Configuracion;

        public AppPersonasController(IConfiguration _Configuration, DBConfiaContext _DBContext)
        {
            this.Configuracion = _Configuration;
            ConexionBD = _DBContext;
        }

        [HttpPost]
        [Route("addPersona")]
        [Authorize]
        public async Task<IActionResult> AddPersona(PeticionesRest.Administracion.Personas.Agregar parData)
        {
            try
            {
                var Person = await ConexionBD.database.QueryAsync<Personas>("WHERE  (CURP = @CURP) AND (RFC = @RFC) AND (TelefonoMovil = @TelefonoMovil)", parData).SingleOrDefaultAsync();
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosApp_VW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                ConexionBD.database.BeginTransaction();

                if (Person == null || Person.PersonaID == 0)
                {
                    await insertProspecto(parData, UsuarioActual);
                }
                else
                {
                    await updateProspecto(parData);

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
                    data = new { error = "Error al guardar " }
                });
            }
        }

        private async Task updateProspecto(Agregar parData)
        {
            var validaProspecto = await ConexionBD.database.QueryAsync<Prospectos_VW>("WHERE ProspectoID=@0", parData.AgregarProspecto.PersonaID).SingleOrDefaultAsync();
            var personaProspecto = await ConexionBD.database.SingleByIdAsync<Personas>(parData.AgregarProspecto.PersonaID);
            if (validaProspecto.EstatusConsultaBuroID != 2)
            {
                personaProspecto.Nombre = parData.Nombre?.ToUpper();
                personaProspecto.ApellidoPaterno = parData.ApellidoPaterno?.ToUpper();
                personaProspecto.ApellidoMaterno = parData.ApellidoMaterno?.ToUpper();
                personaProspecto.FechaNacimiento = parData.FechaNacimiento;
                personaProspecto.CURP = parData.CURP?.ToUpper();
                personaProspecto.RFC = parData.RFC?.ToUpper();
                personaProspecto.SexoID = parData.SexoID;
            }
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
            var domicilioProspecto = await ConexionBD.database.QueryAsync<Domicilios>("WHERE PersonaID=@0 AND TipoPersonaID = 1", parData.AgregarProspecto.PersonaID).SingleOrDefaultAsync();
            domicilioProspecto.AsentamientoID = parData.AgregarProspecto.DireccionPersona_AsentamientoID;
            domicilioProspecto.calle = parData.AgregarProspecto.DireccionPersona_NombreVialidad?.ToUpper();
            domicilioProspecto.localidad = parData.AgregarProspecto.DireccionPersona_Localidad?.ToUpper();
            domicilioProspecto.numeroExterior = parData.AgregarProspecto.DireccionPersona_NumeroExterior?.ToUpper();
            await ConexionBD.database.UpdateAsync(domicilioProspecto);

            //EMPLEO
            if (parData.AgregarProspecto.Laboral_Trabaja)
            {
                var infoLaboralProspecto = await ConexionBD.database.QueryAsync<InformacionLaboral>("WHERE PersonaID=@0 AND TipoPersonaID = 1", parData.AgregarProspecto.PersonaID).SingleOrDefaultAsync();
                if (infoLaboralProspecto != null)
                {
                    infoLaboralProspecto.Antiguedad = parData.AgregarProspecto.Laboral__Antiguedad;
                    infoLaboralProspecto.Empresa = parData.AgregarProspecto.Laboral__Empresa?.ToUpper();
                    infoLaboralProspecto.OcupacionID = parData.AgregarProspecto.Laboral__OcupacionID;
                    infoLaboralProspecto.Sueldo = parData.AgregarProspecto.Laboral__SueldoMensual;
                    infoLaboralProspecto.Telefono = parData.AgregarProspecto.Laboral__Telefono;

                    infoLaboralProspecto.AsentamientoID = parData.AgregarProspecto.DireccionLaboral_AsentamientoID;
                    infoLaboralProspecto.Calle = parData.AgregarProspecto.DireccionLaboral_NombreVialidad?.ToUpper();
                    infoLaboralProspecto.localidad = parData.AgregarProspecto.DireccionLaboral_LocalidadLaboral?.ToUpper();
                    infoLaboralProspecto.NumeroExterior = parData.AgregarProspecto.DireccionLaboral_NumeroExterior?.ToUpper();
                    await ConexionBD.database.UpdateAsync(infoLaboralProspecto);
                }
                else
                {
                    var empleoProspecto = new InformacionLaboral()
                    {
                        PersonaID = parData.AgregarProspecto.PersonaID,
                        TipoPersonaID = 1,

                        Antiguedad = parData.AgregarProspecto.Laboral__Antiguedad,
                        Empresa = parData.AgregarProspecto.Laboral__Empresa?.ToUpper(),
                        OcupacionID = parData.AgregarProspecto.Laboral__OcupacionID,
                        Sueldo = parData.AgregarProspecto.Laboral__SueldoMensual,
                        Telefono = parData.AgregarProspecto.Laboral__Telefono,

                        AsentamientoID = parData.AgregarProspecto.DireccionLaboral_AsentamientoID,
                        Calle = parData.AgregarProspecto.DireccionLaboral_NombreVialidad?.ToUpper(),
                        localidad = parData.AgregarProspecto.DireccionLaboral_LocalidadLaboral?.ToUpper(),
                        NumeroExterior = parData.AgregarProspecto.DireccionLaboral_NumeroExterior?.ToUpper(),
                    };
                    await ConexionBD.database.InsertAsync(empleoProspecto);
                }
            }
            else
            {
                var infoLaboralProspecto = await ConexionBD.database.QueryAsync<InformacionLaboral>("WHERE PersonaID=@0 AND TipoPersonaID = 1", parData.AgregarProspecto.PersonaID).SingleOrDefaultAsync();
                if (infoLaboralProspecto != null)
                {
                    await ConexionBD.database.DeleteAsync(infoLaboralProspecto);
                }
            }

            //EMPLEO CONYUGE
            if (parData.AgregarProspecto.Conyuge_Trabaja)
            {
                var infoLaboralConyuge = await ConexionBD.database.QueryAsync<InformacionLaboral>("WHERE PersonaID=@0 AND TipoPersonaID = 2", parData.AgregarProspecto.PersonaID).SingleOrDefaultAsync();
                if (infoLaboralConyuge != null)
                {
                    infoLaboralConyuge.Antiguedad = parData.AgregarProspecto.Conyuge_AntiguedadConyuge.ToUpper();
                    infoLaboralConyuge.Empresa = parData.AgregarProspecto.Conyuge_EmpresaConyuge?.ToUpper();
                    infoLaboralConyuge.OcupacionID = parData.AgregarProspecto.Conyuge_OcupacionIDConyuge;
                    infoLaboralConyuge.Sueldo = parData.AgregarProspecto.Conyuge_SueldoMensualConyuge;
                    infoLaboralConyuge.Telefono = parData.AgregarProspecto.Conyuge_TelefonoLaboralConyuge;

                    infoLaboralConyuge.AsentamientoID = parData.AgregarProspecto.Conyuge_AsentamientoIDLaboralConyuge;
                    infoLaboralConyuge.Calle = parData.AgregarProspecto.Conyuge_CalleLaboralConyuge?.ToUpper();
                    infoLaboralConyuge.localidad = parData.AgregarProspecto.Conyuge_LocalidadLaboralConyuge?.ToUpper();
                    infoLaboralConyuge.NumeroExterior = parData.AgregarProspecto.Conyuge_NumeroExteriorLaboralConyuge?.ToUpper();
                    await ConexionBD.database.UpdateAsync(infoLaboralConyuge);
                }
                else
                {
                    var empleoConyuge = new InformacionLaboral()
                    {
                        PersonaID = parData.AgregarProspecto.PersonaID,
                        TipoPersonaID = 2,

                        Antiguedad = parData.AgregarProspecto.Conyuge_AntiguedadConyuge.ToUpper(),
                        Empresa = parData.AgregarProspecto.Conyuge_EmpresaConyuge?.ToUpper(),
                        OcupacionID = parData.AgregarProspecto.Conyuge_OcupacionIDConyuge,
                        Sueldo = parData.AgregarProspecto.Conyuge_SueldoMensualConyuge,
                        Telefono = parData.AgregarProspecto.Conyuge_TelefonoLaboralConyuge,

                        AsentamientoID = parData.AgregarProspecto.Conyuge_AsentamientoIDLaboralConyuge,
                        Calle = parData.AgregarProspecto.Conyuge_CalleLaboralConyuge?.ToUpper(),
                        localidad = parData.AgregarProspecto.Conyuge_LocalidadLaboralConyuge?.ToUpper(),
                        NumeroExterior = parData.AgregarProspecto.Conyuge_NumeroExteriorLaboralConyuge?.ToUpper(),
                    };
                    await ConexionBD.database.InsertAsync(empleoConyuge);
                }
            }
            else
            {
                var infoLaboralConyuge = await ConexionBD.database.QueryAsync<InformacionLaboral>("WHERE PersonaID=@0 AND TipoPersonaID = 2", parData.AgregarProspecto.PersonaID).SingleOrDefaultAsync();
                if (infoLaboralConyuge != null)
                {
                    await ConexionBD.database.DeleteAsync(infoLaboralConyuge);
                }
            }
        }
        
        private async Task insertProspecto(Agregar parData, UsuariosApp_VW UsuarioActual)
        {
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
                IngresosMensuales = parData.AgregarProspecto.Laboral__SueldoMensual

            };
            await ConexionBD.database.InsertAsync(Persona);
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
            if (parData.AgregarProspecto.CrearProspecto)
            {
                var promotor = await ConexionBD.database.QueryAsync<Promotores>("WHERE creditoPromotorId = @0", UsuarioActual.PersonaID).SingleOrDefaultAsync();
                if (promotor == null)
                {
                    throw new Exception($"Error, la persona actual logueada ({UsuarioActual.PersonaID}) no es promotor");
                }

                var Prospecto = new Prospectos()
                {
                    ProspectoID = Persona.PersonaID,
                    SucursalID = promotor.SucursalID,
                    ComoSeEntero = "PROMOTOR",
                    StatusProcesoID = 1,
                    Activo = true,
                    fechaCreacion = DateTime.Now,
                    PromotorPersonaID = (long)UsuarioActual.PersonaID,
                    PromotorUsuarioID = UsuarioActual.UsuarioID,
                    fechaUltimaActualizacion = DateTime.Now,
                    EstatusAsignacionID = 1,
                    ProductoID = promotor.ProductoID,
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
            }
        }

        protected async Task<int> AddDireccion(PeticionesRest.Administracion.Personas.AgregarDireccion parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosApp_VW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
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
            catch (Exception)
            {
                return 0;
            }
        }

        protected async Task<String> AddProspectoInfo(PeticionesRest.Prospeccion.Prospecto.Agregar parData)
        {
            int bandera = 0;
            try
            {
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
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosApp_VW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                ConexionBD.database.BeginTransaction();
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
                await ConexionBD.database.InsertAsync(Empleo);
                ConexionBD.database.CompleteTransaction();
                return 1;

            }
            catch (Exception)
            {
                return 0;
            }
        }

    }
}