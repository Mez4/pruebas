using ConfiaWebApi.Code;
using ConfiaWebApi.ModlesSP.Prospeccion;
using ConfiaWebApi.PeticionesRest.Distribuidores.SolicitudIncrementos;
using ConfiaWebApi.PeticionesRest.Prospeccion.Documentos;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Prospeccion;
using DBContext.DBConfia.Seguridad;
using DBContext.ModlesSP.Prospeccion;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.Prospeccion
{
    [Authorize]
    [ApiController]
    [Route("api/Prospeccion/[controller]")]
    public class ProspectosController : ControllerBase
    {
        private DBConfiaContext ConexionBD;

        private IConfiguration Configuracion;

        public ProspectosController(IConfiguration _Configuration, DBConfiaContext _DBContext)
        {
            this.Configuracion = _Configuration;
            ConexionBD = _DBContext;
        }


        [HttpGet]
        [Route("getProspects")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getProspects()
        {
            try
            {
                var prospecto = await ConexionBD.database.FetchAsync<ProspectosDatosGenereles_VW>();
                return Ok(prospecto);
            }
            catch (System.Exception)
            {
                throw;

            }
            // return prospecto;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.get parData)
        {
            //validate rol from user
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());

            var esGerente = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios_Roles>("WHERE UsuarioID=@0 AND RolID=@1", UsuarioActual.UsuarioID, 82).FirstOrDefaultAsync();

            if (UsuarioActual.MasterUser == true)
            {
                var respros = await ConexionBD.database.QueryAsync<Prospectos_VW>("WHERE ProductoID = @0 AND (@1 = 0 OR SucursalID = @1) ", ProductoID, parData.SucursalID).ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(respros);
            }
            else
            {

                if (esGerente != null)
                {
                    var gerenteDatos = await ConexionBD.database.QueryAsync<DBContext.DBConfia.General.Gerentes>("WHERE UsuarioID=@0", UsuarioActual.UsuarioID).FirstOrDefaultAsync();
                    if (gerenteDatos != null)
                    {

                        ConexionBD.database.CommandTimeout = 9999;
                        var queryProspectos = @"SELECT pv.* 
                        FROM Prospeccion.Prospectos_VW AS pv 
                        JOIN General.Gerentes AS g ON pv.SucursalID = g.SucursalID 
                        WHERE g.UsuarioID = @0
                        AND (@1 = 0 OR g.SucursalID = @1)
                        ORDER BY ProspectoID DESC";
                        var res1 = await ConexionBD.database.QueryAsync<Prospectos_VW>(queryProspectos, UsuarioActual.UsuarioID, parData.SucursalID).ToArrayAsync();
                        await ConexionBD.Destroy();
                        return Ok(res1);
                    }
                    else
                    {
                        await ConexionBD.Destroy();
                        return NotFound();
                    }
                }

                if (parData.Id != 0)
                {
                    var res1 = await ConexionBD.database.SingleByIdAsync<Prospectos_VW>(parData.Id);
                    await ConexionBD.Destroy();
                    return Ok(res1);
                }

                var usuarioActualEmail = Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
                var query = NPoco.Sql.Builder.Select("PromotorUsuarioID", "ProspectoID", "NombreProspecto", "Descripcion", "EnMesa", "MsjNoLeidosSucP", "Consolidacion", "ProductoID", "Nombre").From("Prospeccion.Prospectos_VW");

                // Si tenemos la variable de nombre
                if (!string.IsNullOrEmpty(parData.Nombre))
                    query = query.Where(
                        @"(
                            dbo.Levenshtein(UPPER(NombrePila), UPPER(@0), 1) <= 1 OR NombrePila LIKE '%' + UPPER(@0) + '%'
                            OR dbo.Levenshtein(UPPER(ApellidoPaterno), UPPER(@0), 1) <= 1 OR ApellidoPaterno LIKE '%' + UPPER(@0) + '%'
                            OR dbo.Levenshtein(UPPER(ApellidoMaterno), UPPER(@0), 1) <= 1 OR ApellidoMaterno LIKE '%' + UPPER(@0) + '%'
                            OR dbo.Levenshtein(UPPER(NombreProspecto), UPPER(@0), 3) <= 3 OR NombreProspecto LIKE '%' + UPPER(@0) + '%'
                        )", parData.Nombre);

                // Si tenemos la variable de RFC
                if (!string.IsNullOrEmpty(parData.RFC))
                    query = query.Where("dbo.Levenshtein(UPPER(RFC), UPPER(@0), 10) <= 1", parData.RFC);

                // Si tenemos la variable de curp
                if (!string.IsNullOrEmpty(parData.CURP))
                    query = query.Where("dbo.Levenshtein(UPPER(CURP), UPPER(@0), 10) <= 1", parData.CURP);

                // Si tenemos la variable de curp
                if (parData.StatusProcesoID != null)
                    query = query.Where("StatusProcesoID = @0", parData.StatusProcesoID);

                query = query.Where("PromotorUsuarioID = @0", UsuarioActual.UsuarioID);

                query = query.Where("ProductoID = @0", ProductoID);

                query = query.OrderBy("ProspectoID DESC");
                // Validamos nuestra peticion
                var res = await ConexionBD.database.QueryAsync<Prospectos_VW>(query).ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(res);
            }
        }

        [HttpPost]
        [Route("getByCoordinador")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getByCoordinador(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.get2 parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());

            var obj = new
            {
                UsuarioID = UsuarioActual.UsuarioID,
                PersonaID = UsuarioActual.PersonaID,
                ProductoID = ProductoID,
                Nombre = parData.Nombre,
                RFC = parData.RFC,
                CURP = parData.CURP
            };
            string query = "EXEC Prospeccion.paGetProspectosByCoordinador @UsuarioID, @PersonaID, @ProductoID, @Nombre, @RFC, @CURP";

            var res = await ConexionBD.database.QueryAsync<spProspectosCoordinador>(query, obj).ToArrayAsync();
            await ConexionBD.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("getByProduct")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getByProduct(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.get2 parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());

            var obj = new { Usu = UsuarioActual.UsuarioID, PersonaID = UsuarioActual.PersonaID, ProductoID = ProductoID };

            if (UsuarioActual.MasterUser == true)
            {
                var respros = await ConexionBD.database.QueryAsync<Prospectos_VW>("WHERE ProductoID = @0 AND (@1 = 0 OR SucursalID = @1) ", ProductoID, parData.SucursalID).ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(respros);
            }
            var listaResultados = new List<Prospectos_VW>();
            //Comprobar si es un gerente
            var gerentes = await ConexionBD.database.QueryAsync<DBContext.DBConfia.General.Gerentes>("WHERE UsuarioID = @0 AND (@1 = 0 OR SucursalID = @1)", UsuarioActual.UsuarioID, parData.SucursalID).ToArrayAsync();
            //Si hay datos del gerente en la tabla
            if (gerentes.Length > 0)
            {
                foreach (var gerente in gerentes)
                {
                    // Realiza la consulta para cada gerente y obtiene los prospectos
                    var res_gerente = await ConexionBD.database.FetchAsync<Prospectos_VW>("WHERE SucursalID = @0 Order by ProspectoID DESC", gerente.SucursalID);

                    // Se agregan los resultados a la lista de prospeccion
                    listaResultados.AddRange(res_gerente);
                }
                await ConexionBD.Destroy();
                return Ok(listaResultados);
            }

            var prospectos = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Prospeccion.Prospectos>("WHERE PromotorUsuarioID = @Usu Order by ProspectoID ASC", obj);
            //int ProductoID = in t.Parse(HttpContext.Request.Headers["ProductoID"].ToString());

            if (prospectos.Count > 0)
            {
                var res1 = await ConexionBD.database.FetchAsync<Prospectos_VW>("WHERE ProductoID = @ProductoID AND PromotorUsuarioID = @Usu Order by ProspectoID DESC", obj);
                await ConexionBD.Destroy();
                return Ok(res1);
            }

            var query = NPoco.Sql.Builder.Select("ProspectoID", "NombreProspecto", "Nombre", "EstatusConsultaBuroID", "EnMesa", "FechaEnMesa", "RevisionDocumentos", "Dictamen", "Consolidacion", "ProductoID", "PrimerCanje").From("Prospeccion.Prospectos_VW");

            // Si tenemos la variable de nombre
            if (!string.IsNullOrEmpty(parData.Nombre))
                query = query.Where(
                    @"(  
                            dbo.Levenshtein(UPPER(NombrePila), UPPER(@0), 1) <= 1 OR NombrePila LIKE '%' + UPPER(@0) + '%'
                            OR dbo.Levenshtein(UPPER(ApellidoPaterno), UPPER(@0), 1) <= 1 OR ApellidoPaterno LIKE '%' + UPPER(@0) + '%'
                            OR dbo.Levenshtein(UPPER(ApellidoMaterno), UPPER(@0), 1) <= 1 OR ApellidoMaterno LIKE '%' + UPPER(@0) + '%'
                            OR dbo.Levenshtein(UPPER(NombreProspecto), UPPER(@0), 3) <= 3 OR NombreProspecto LIKE '%' + UPPER(@0) + '%'
                        )", parData.Nombre);

            // Si tenemos la variable de RFC
            if (!string.IsNullOrEmpty(parData.RFC))
                query = query.Where("dbo.Levenshtein(UPPER(RFC), UPPER(@0), 10) <= 1", parData.RFC);

            // Si tenemos la variable de curp
            if (!string.IsNullOrEmpty(parData.CURP))
                query = query.Where("dbo.Levenshtein(UPPER(CURP), UPPER(@0), 10) <= 1", parData.CURP);

            query = query.Where("ProductoID = @0", ProductoID);

            query = query.OrderBy("ProspectoID DESC");
            // Validamos nuestra peticion
            var res = await ConexionBD.database.QueryAsync<Prospectos_VW>(query).ToArrayAsync();
            await ConexionBD.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("editar")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Editar(PeticionesRest.Administracion.Personas.Agregar parData)
        {
            try
            {
                ConexionBD.database.BeginTransaction();

                //PERSONA
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

                var actualiza = await ConexionBD.database.QueryAsync<Prospectos>("WHERE ProspectoID = @0", parData.AgregarProspecto.PersonaID).SingleOrDefaultAsync();

                actualiza.fechaUltimaActualizacion = DateTime.Now;
                await ConexionBD.database.UpdateAsync(actualiza);

                ConexionBD.database.CompleteTransaction();

                var res = new
                {
                    res = 1,
                    msj = $"Se actualizo la informacion del Prospecto {parData.AgregarProspecto.PersonaID}"
                };
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest("ERROR AL EDITAR LOS DATOS GENERALES DE LA PERSONA: " + ex.Message);
            }
        }

        [HttpPost]
        [Route("AddDatosEconomicos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> AddDatosEconomicos(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.DatosEconomicos parData)
        {
            try
            {
                var usuarioActualEmail = Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

                var ingresoMensual = (parData.ingresoSueldo + parData.ingresoGananciasDV + parData.ingresoConyuge + parData.ingresoOtro);
                ConexionBD.database.BeginTransaction();

                var personaProspecto = await ConexionBD.database.SingleByIdAsync<Personas>(parData.prospectoID);
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
                prospecto.fechaUltimaActualizacion = DateTime.Now;
                await ConexionBD.database.UpdateAsync(prospecto);

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
                            FechaIngreso = DateTime.ParseExact(experiencia.fecha, "dd/MM/yyyy", null),
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

                ConexionBD.database.CompleteTransaction();

                var res = new
                {
                    res = 1,
                    msj = $"Se actualizo la informacion del Prospecto {parData.prospectoID}"
                };
                await ConexionBD.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest("ERROR AL GUARDAR LOS DATOS ECONOMICOS DE LA PERSONA: " + ex.Message);
            }
        }

        [HttpPost]
        [Route("EditDatosEconomicos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> EditDatosEconomicos(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.DatosEconomicos parData)
        {
            try
            {
                var usuarioActualEmail = Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

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
                prospecto.fechaUltimaActualizacion = DateTime.Now;
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

                ConexionBD.database.CompleteTransaction();

                var res = new
                {
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

        //ADAL
        [HttpPost]
        [Route("getDocsP")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetDocsP(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.GetDocs parData)
        {
            try
            {
                var Docs = await ConexionBD.database.QueryAsync<ProspectosDocumentos_VW>("EXEC Prospeccion.pa_ObtenerDocsProspecto @ProspectoID", parData).ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(new
                {
                    status = true,
                    msj = "OK",
                    data = Docs
                });
            }
            catch (Exception e)
            {
                return BadRequest(new
                {
                    status = false,
                    msj = "No se encontro documentos",
                    err = e.Message,
                    data = new Array[0]
                });
            }
        }


        [HttpPost]
        [Route("getDocs")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetDocs(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.GetDocs parData)
        {
            var Docs = await ConexionBD.database.QueryAsync<ObtenerDocProspecto>("EXEC Prospeccion.pa_ObtenerDocsProspecto @ProspectoID", parData).ToArrayAsync();
            await ConexionBD.Destroy();
            return Ok(Docs);
        }
        // FUNCION PARA ELIMINAR EL DOCUMENTO SELECCIONADO
        [HttpPost]
        [Route("deleteDoc")]
        [Authorize]
        // [Code.TProteccionProducto]
        public async Task<IActionResult> deleteDoc(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.GetDoc parData)
        {
            try
            {
                // Eliminamos el registro
                await ConexionBD.database.ExecuteAsync("DELETE FROM Prospeccion.Documentos WHERE DocumentoID = @DocumentoID", parData);
                await ConexionBD.Destroy();
                return Ok(new
                {
                    status = true,
                    msj = "Se ah eliminado el documento con éxito",
                    data = new string[0]
                });
            }
            catch (Exception e)
            {
                return BadRequest(new
                {
                    status = false,
                    msj = "Error al eliminar el documento, intente mas tarde",
                    err = e.Message
                });
            }
        }

        [HttpPost]
        [Route("getDoc")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetDoc(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.GetDoc parData)
        {
            try
            {
                var src = "";
                var Documento = await ConexionBD.database.SingleByIdAsync<Documentos>(parData.DocumentoID);

                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
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
                        await ConexionBD.Destroy();
                        return BadRequest(response.StatusCode);
                    }
                }
                var res = new
                {
                    res = 1,
                    msj = $"Consulta correcta del documento {parData.DocumentoID}",
                    src = $"{src}"
                };
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("Error al conseguir la firma" + ex.Message);
            }

        }

        [Consumes("multipart/form-data")]
        [HttpPost]
        [Route("subirExpediente")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> SubirExpediente([FromForm] ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.UploadFile parData)
        {
            try
            {

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

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
                // CONCATENAR CON VARIABLE GLOBAL DE BASE DE DATOS
                string path = $"{Configuracion["BucketApi:AwsPath_DocsExpediente"]}/{parData.PersonaID}";
                var ext = Path.GetExtension(parData.doc.FileName);
                string file_name = $"{parData.PersonaID}_{parData.TipoDocumentoID}{ext}";
                byte[] file_byte = FilesManager.ConvertFiletoByteArray(parData.doc);


                long DocumentoIDAux = 0;

                HttpContent bytesContent = new ByteArrayContent(file_byte);
                HttpContent stringContent = new StringContent(path);

                long tamaDoc = parData.doc.Length;
                double tamenkb = tamaDoc / 1024;

                if (tamenkb > 2000)
                {
                    await ConexionBD.Destroy();
                    return Ok(new
                    {
                        msj = "EL ARCHIVO SUPERA LOS 2 MB, INTENTE BAJAR EL PESO DEL ARCHIVO"
                    });
                }

                else
                {

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

                                var prospecto = await ConexionBD.database.QueryAsync<Prospectos>("WHERE ProspectoID = @0", parData.PersonaID).SingleOrDefaultAsync();

                                prospecto.fechaUltimaActualizacion = DateTime.Now;
                                await ConexionBD.database.UpdateAsync(prospecto);

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
        [Code.TProteccionProducto]
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
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

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
                prospecto.fechaUltimaActualizacion = DateTime.Now;
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

                var Data = await ConexionBD.database.QueryAsync<Personas_VW>("WHERE PersonaID=@0", Persona.PersonaID).SingleOrDefaultAsync();

                var res = new
                {
                    res = 1,
                    msj = "Se creó la persona (aval) con el id: " + Persona.PersonaID,
                    Data
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

        [HttpPost]
        [Route("EditAval")]
        [Authorize]
        [Code.TProteccionProducto]
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
            catch (Exception ex)
            {
                ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return 0;
                throw new Exception("Error al guardar AddProspectoInfo"); ;
            }

        }

        [HttpPost]
        [Route("ValidarDocumentos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ValidarDocumentos(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.ValidarDocumentos parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var obj = new { parData.ProspectoID, UsuarioActual.UsuarioID };
                var validacion = await ConexionBD.database.QueryAsync<Confirmar>("EXEC Prospeccion.pa_Validacion_DocumentosCaptura @ProspectoID, @UsuarioID", obj).FirstOrDefaultAsync();

                var res = new
                {
                    res = validacion.regresa,
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
        [Code.TProteccionProducto]
        public async Task<IActionResult> ValidarDocumentosCompletos(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.ValidarDocumentos parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());

                var obj = new { parData.ProspectoID, UsuarioActual.UsuarioID, ProductoID };
                var validacion = await ConexionBD.database.QueryAsync<Confirmar>("EXEC Prospeccion.pa_ValidarDocumentacionCompleta @ProspectoID, @ProductoID", obj).FirstOrDefaultAsync();

                var res = new
                {
                    res = validacion.regresa,
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
        [Route("ValidarDocumentosAvales")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ValidarDocumentosAvales(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.ValidarDocumentosAvales parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var obj = new { parData.ProspectoID, UsuarioActual.UsuarioID };
                var validacion = await ConexionBD.database.QueryAsync<Confirmar>("EXEC Prospeccion.pa_Validacion_DocumentosAvalCaptura @ProspectoID, @UsuarioID", obj).FirstOrDefaultAsync();

                var res = new
                {
                    res = validacion.regresa,
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

        [HttpPost]
        [Route("ValidarReferenciasAvales")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ValidarReferenciasAvales(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.ValidarReferenciasAvales parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var obj = new { parData.ProspectoID, UsuarioActual.UsuarioID };
                var validacion = await ConexionBD.database.QueryAsync<ValidarReferenciasAvales>("EXEC Prospeccion.pa_Validacion_ReferenciasAvalCaptura @ProspectoID, @UsuarioID", obj).FirstOrDefaultAsync();

                var res = new
                {
                    res = validacion.regresa,
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
        [Route("ValidarProspecto")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ValidarProspecto(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.ValidarProspecto parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var obj = new { parData.ProspectoID, UsuarioActual.UsuarioID };

                var validacion = await ConexionBD.database.QueryAsync<ValidarProspecto>("EXEC Prospeccion.pa_Validacion_Prospecto @ProspectoID, @UsuarioID", obj).FirstOrDefaultAsync();
                var LogDate = await ConexionBD.database.QueryAsync<LogTiemposPeriodo>("EXEC Prospeccion.pa_LogTiemposPeriodo @0, @1, @2, @3, @4", parData.ProspectoID, null, 1, 1, null).FirstOrDefaultAsync();
                var res = new
                {
                    res = validacion.regresa,
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
        [Route("subirDocActivacion")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> subirDocActivacion([FromForm] ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.subirDocActivacion parData)
        {
            try
            {
                var prospecto = await ConexionBD.database.SingleByIdAsync<Prospectos>(parData.ProspectoID);
                if (!prospecto.Activo)
                {
                    await ConexionBD.Destroy();
                    return BadRequest("Este prospecto esta cancelado");//throw new Exception("Este prospecto esta cancelado");
                }
                var status = await ConexionBD.database.QueryAsync<Tuberia>("WHERE PersonaID = @0 AND StatusProcesoID = 17 AND Validado = 1", parData.ProspectoID).FirstOrDefaultAsync();
                if (status == null)
                {
                    await ConexionBD.Destroy();
                    return BadRequest("Este prospecto no esta en  proceso de activacion");//throw new Exception("Este prospecto esta cancelado");
                }

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());

                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                var basicToken = Convert.ToBase64String(plainTextBytes);
                string path = $"{Configuracion["BucketApi:AwsPath_DocsExpediente"]}/{parData.ProspectoID}";
                var ext = Path.GetExtension(parData.doc.FileName);
                string file_name = $"a_{parData.identificador}_{parData.ProspectoID}{ext}";
                byte[] file_byte = FilesManager.ConvertFiletoByteArray(parData.doc);

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
                        switch (parData.identificador)
                        {
                            case 1:
                                prospecto.Contrato = $"{path}/{file_name}";
                                break;
                            case 2:
                                prospecto.Pagare = $"{path}/{file_name}";
                                break;
                            case 3:
                                prospecto.PagareReverso = $"{path}/{file_name}";
                                break;
                            default:
                                break;
                        }

                        if (prospecto.Contrato != null && prospecto.Pagare != null && prospecto.PagareReverso != null)
                        {
                            var obj = new { parData.ProspectoID, Nota = "SE HAN SUBIDO EL CONTRATO Y EL PAGARÉ", UsuarioActual.UsuarioID, TipoMesa = 2 };
                            var validacion = await ConexionBD.database.QueryAsync<LogMensajesVW>("EXEC Prospeccion.pa_AgregarNota @ProspectoID, @Nota, 0, @UsuarioID, @TipoMesa", obj).FirstOrDefaultAsync();
                        }

                        prospecto.fechaUltimaActualizacion = DateTime.Now;
                        await ConexionBD.database.UpdateAsync(prospecto);
                        await ConexionBD.Destroy();

                        var res = new
                        {
                            regresa = 1,
                            msj = $"OK",
                            data = new { path = $"DOCUMENTO SUBIDO CON ÉXITO" }
                        };

                        return Ok(res);
                    }
                    else
                    {
                        await ConexionBD.Destroy();
                        return BadRequest($"{response.StatusCode} - {response.ReasonPhrase}");
                    }
                }
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        [Route("getDocActivacion")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getDocActivacion(PeticionesRest.Prospeccion.Prospecto.getDocActivacion parData)
        {
            if (parData.DocumentoPath.Contains(".pdf") == true)
            {
                var transaccion = false;

                try
                {
                    var src = "";
                    var srcBC = "";

                    var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                    var basicToken = Convert.ToBase64String(plainTextBytes);
                    using (var client = new HttpClient())
                    {
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicToken); ;
                        var response = await client.GetAsync($"{Configuracion["BucketApi:url"]}{Configuracion["BucketApi:getRequest"]}?expireIn=10&path={parData.DocumentoPath}");
                        if (response.IsSuccessStatusCode)
                        {
                            var jsonString = await response.Content.ReadAsStringAsync();
                            var request = JsonConvert.DeserializeObject<BucketGet>(jsonString);
                            src = request.url;

                            srcBC = request.url;

                            WebClient MyWebClient = new WebClient();
                            MyWebClient.Credentials = new NetworkCredential(Configuracion["userFtpConfia"], Configuracion["passFtpConfia"]);
                            byte[] BytesFile = MyWebClient.DownloadData(srcBC);
                            string srcB64 = Convert.ToBase64String(BytesFile, 0, BytesFile.Length);
                            ConexionBD.database.BeginTransaction();
                            transaccion = true;
                            var res = new
                            {
                                res = 2,
                                msj = $"Consulta correcta del documento {parData.DocumentoPath}",
                                src = $"{srcB64}"
                            };

                            ConexionBD.database.CompleteTransaction();
                            await ConexionBD.Destroy();
                            return Ok(res);
                        }
                        else
                        {
                            if (transaccion) ; ConexionBD.database.AbortTransaction();
                            await ConexionBD.Destroy();
                            return BadRequest(response.StatusCode);
                        }
                    }

                }
                catch (Exception ex)
                {
                    if (transaccion) ; ConexionBD.database.AbortTransaction();
                    await ConexionBD.Destroy();
                    return BadRequest("ERROR AL GUARDAR LOS DATOS: " + ex.Message);
                }
            }
            else
            {
                try
                {
                    var src = "";

                    var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                    var basicToken = Convert.ToBase64String(plainTextBytes);
                    using (var client = new HttpClient())
                    {
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicToken); ;
                        var response = await client.GetAsync($"{Configuracion["BucketApi:url"]}{Configuracion["BucketApi:getRequest"]}?expireIn=1&path={parData.DocumentoPath}");
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
                        msj = $"Consulta correcta del documento",
                        src = $"{src}"
                    };
                    await ConexionBD.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await ConexionBD.Destroy();
                    return BadRequest("ERROR AL GUARDAR LOS DATOS ECONOMICOS DE LA PERSONA: " + ex.Message);
                }
            }
        }

        [HttpPost]
        [Route("GetProcesos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetProcesos(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.GetProcesos parData)
        {
            var Procesos = await ConexionBD.database.QueryAsync<ProcesoProspecto>("EXEC Prospeccion.pa_Proceso_Prospecto @ProspectoID", parData).ToArrayAsync();
            await ConexionBD.Destroy();
            return Ok(Procesos);
        }




        [HttpPost]
        [Route("GetNotificaciones")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetNotificaciones(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.GetNotificaciones parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());

                //var promotor = await ConexionBD.database.SingleByIdAsync<Promotores>(UsuarioActual.PersonaID);
                var RolID = 82;
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

                var Notificaciones = await ConexionBD.database.QueryAsync<LogMensajes_VW>(query, obj)/*.OrderByDescending(x => x.LogMensajeID)*/.ToArrayAsync();

                var NotifNoLeidas = await ConexionBD.database.QueryAsync<LogMensajes_VW>("WHERE PromotorUsuarioID =@0 AND (Leido IS NULL OR Leido = 0) AND EnviadoDesdeMesa = 1 AND ProductoID = @1", UsuarioActual.UsuarioID, ProductoID).ToArrayAsync();

                var Prospectos = await ConexionBD.database.QueryAsync<LogMensajesNoLeidosProspecto_VW>("WHERE PromotorUsuarioID =@0 AND ProductoID = @1", UsuarioActual.UsuarioID, ProductoID).ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(new
                {
                    data = Notificaciones,
                    cantidad = NotifNoLeidas.Count(),
                    Prospectos
                });
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("GetMesajesByProspectoID")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetMesajesByProspectoID(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.GetNotificaciones parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var obj = new { parData.ProspectoID, UsuarioActual.UsuarioID };

                // var validaUser = await ConexionBD.database.QueryAsync<ProspectosAsignaciones_VW>("WHERE ProspectoID = @ProspectoID AND (AnalistaBuroUsuarioID = @UsuarioID OR AnalistaLlamadaUsuarioID = @UsuarioID OR AnalistaMesaUsuarioID = @UsuarioID) ", obj).FirstOrDefaultAsync();
                // if (validaUser == null)
                // {
                //     await ConexionBD.Destroy();
                //     return BadRequest($"El usuario actual no esta asignado a este Prospecto {parData.ProspectoID}");
                // }
                var Notificaciones = await ConexionBD.database.QueryAsync<LogMensajes_VW>("WHERE ProspectoID = @ProspectoID", obj)/*.OrderByDescending(x => x.LogMensajeID)*/.ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(new
                {
                    data = Notificaciones,
                });
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
        [Code.TProteccionProducto]
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
        [Route("GetPerfilProspecto")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetPerfilProspecto(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.GetProcesos parData)
        {
            var Procesos = await ConexionBD.database.QueryAsync<Prospectos_VW>("Where ProspectoID = @ProspectoID", parData).SingleOrDefaultAsync();

            await ConexionBD.Destroy();
            return Ok(Procesos);
        }

        [HttpPost]
        [Route("getPerfil")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetPerfil(PeticionesRest.Prospeccion.Prospecto.GetPerfil parData)
        {
            if (parData.ProspectoID != null)
            {
                try
                {
                    var ValidadoAMesa = await ConexionBD.database.QueryAsync<Tuberia>("WHERE PersonaID=@0 AND StatusProcesoID = 8", parData.ProspectoID).SingleOrDefaultAsync();
                    var DatosGenerales = await ConexionBD.database.QueryAsync<ProspectosDatosGenereles_VW>("WHERE PersonaID=@0", parData.ProspectoID).SingleOrDefaultAsync();
                    var DatosSocioeconomicos = await ConexionBD.database.QueryAsync<ProspectosDatosSocioeconomicos_VW>("WHERE PersonaID=@0", parData.ProspectoID).SingleOrDefaultAsync();
                    var Vehiculos = await ConexionBD.database.QueryAsync<RelacionAutoMoto>("WHERE PersonaID=@0 AND TipoPersonaID = 1", parData.ProspectoID).ToArrayAsync();
                    var Experiencia = await ConexionBD.database.QueryAsync<ProspectosExperienciaVentas_VW>("WHERE PersonaID=@0 AND TipoPersonaID = 1", parData.ProspectoID).ToArrayAsync();
                    var Referencias = await ConexionBD.database.QueryAsync<Referencias>("WHERE PersonaID=@0 AND TipoPersonaID = 1", parData.ProspectoID).ToArrayAsync();
                    var Documentos = await ConexionBD.database.QueryAsync<ProspectosDocumentos_VW>("WHERE PersonaID=@0 AND TipoPersonaID = 1", parData.ProspectoID).ToArrayAsync();
                    var Avales = await ConexionBD.database.QueryAsync<Avales_VW>("WHERE ProspectoID=@0", parData.ProspectoID).ToArrayAsync();
                    var Firma = await GetFirma(parData.ProspectoID);

                    var res = new
                    {
                        Validado = ValidadoAMesa != null,
                        DatosGenerales,
                        DatosSocioeconomicos,
                        Vehiculos,
                        Experiencia,
                        Referencias,
                        Documentos,
                        Avales,
                        Firma,
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
            else
            {
                await ConexionBD.Destroy();
                return NotFound("Acción No Valida");
            }
        }

        protected async Task<string> GetFirma(int? ProspectoID)
        {
            try
            {
                var src = "";
                var Documento = await ConexionBD.database.QueryAsync<ProspectosDocumentos_VW>("WHERE PersonaID = @0 AND Clave = 'D044'", ProspectoID).FirstOrDefaultAsync();
                //var Documento = await ConexionBD.database.SingleByIdAsync<ProspectosDocumentos_VW>(parData.DocumentoID);
                if (Documento == null) throw new Exception("SIN FIRMA");
                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
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
                return "";
            }

        }

        [HttpPost]
        [Route("EviarMsjPromotorSucursal")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> EviarMsjPromotorSucursal(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.AddMsjSucursalPromotor parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var obj = new { parData.ProspectoID, parData.Nota, UsuarioActual.UsuarioID, parData.TipoMesa };
                var validacion = await ConexionBD.database.QueryAsync<LogMensajesVW>("EXEC Prospeccion.pa_AgregarNota @ProspectoID, @Nota, 0, @UsuarioID, @TipoMesa", obj).FirstOrDefaultAsync();

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
        [Route("getBC")]
        [Authorize]
        [Code.TProteccionProducto]
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
                        var srcBC = await ConexionBD.database.FetchAsync<Documentos>("SELECT d.* FROM Prospeccion.Documentos d INNER JOIN Prospeccion.TipoDocumento td ON d.TipoDocumentoID = td.TipoDocumentoID INNER JOIN catalogos.TipoDocumento td1 ON td.CatalogoTipoDocumentoID = td1.TipoDocumentoID WHERE d.PersonaID = @0 AND td1.Clave = 'D042'", parData.ProspectoID);

                        WebClient MyWebClient = new WebClient();
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
                await ConexionBD.Destroy();
                return NotFound("Acción No Valida");
            }
        }

        [HttpPost]
        [Route("DictaminarProspecto")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> DictaminarProspecto(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.DictaminarProspecto parData)
        {
            try
            {
                var prospectoValida = await ConexionBD.database.SingleByIdAsync<Prospectos>(parData.ProspectoID);
                if (!prospectoValida.Activo)
                {
                    await ConexionBD.Destroy();
                    return BadRequest("Este prospecto esta cancelado");//throw new Exception("Este prospecto esta cancelado");
                }
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                parData.Monto = 1;

                var obj = new { parData.ProspectoID, UsuarioActual.UsuarioID, parData.DistribuidorNivelID, parData.Monto, DistribuidoresEstatusID = ""/*parData.DistribuidoresEstatusID*/ };
                var validacion = await ConexionBD.database.QueryAsync<SP_ProspeccionVW>("EXEC Prospeccion.pa_DictamenProspecto @ProspectoID, @UsuarioID, @DistribuidorNivelID, @Monto, @DistribuidoresEstatusID", obj).FirstOrDefaultAsync();

                if (validacion.regresa == 1)
                {
                    var BuroProspecto = await ConexionBD.database.SingleAsync<Prospectos>("Where ProspectoID=@0", parData.ProspectoID);
                    var DistribuidorNivelInterno = await ConexionBD.database.SingleAsync<NivelOrigen_Buro_LC>("Where DistribuidorNivelOrigenID=@0 AND BuroInternoEstatusID=@1", parData.DistribuidorNivelID, BuroProspecto.BuroInternoEstatusID);

                    parData.DistribuidorNivelID = DistribuidorNivelInterno.DistribuidorNivelID;
                    parData.Monto = DistribuidorNivelInterno.LineaCredito;

                    var ProspectoUpd = await ConexionBD.database.SingleByIdAsync<Prospectos>(parData.ProspectoID);

                    if (ProspectoUpd != null)
                    {
                        ProspectoUpd.MontoDictaminado = parData.Monto;
                        ProspectoUpd.DistribuidorNivelInternoID = parData.DistribuidorNivelID;
                        ProspectoUpd.NivelOrigen_BuroID = DistribuidorNivelInterno.NivelOrigen_BuroID;



                        await ConexionBD.database.UpdateAsync(ProspectoUpd);

                        var obj2 = new { parData.ProspectoID, Nota = "POR FAVOR DESCARGUE EL CONTRATO DESDE EL PERFIL DEL PROSPECTO Y SUBALO FIRMADO CON EL PAGARÉ PARA PODER CONTINUAR CON EL PROCESO DE ACTIVACIÓN", UsuarioActual.UsuarioID, TipoMesa = 2 };
                        var validacion2 = await ConexionBD.database.QueryAsync<LogMensajesVW>("EXEC Prospeccion.pa_AgregarNota @ProspectoID, @Nota, 1, @UsuarioID, @TipoMesa, 1", obj2).FirstOrDefaultAsync();
                        return Ok(obj2);
                    }
                    else
                    {

                    }

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
        [Route("ConsolidarProspecto")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ConsolidarProspecto(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.ConsolidarProspecto parData)
        {
            try
            {
                var prospectoValida = await ConexionBD.database.SingleByIdAsync<Prospectos>(parData.ProspectoID);
                if (!prospectoValida.Activo)
                {
                    await ConexionBD.Destroy();
                    return BadRequest("Este prospecto esta cancelado");//throw new Exception("Este prospecto esta cancelado");
                }
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var obj = new { parData.ProspectoID, UsuarioActual.UsuarioID, parData.DistribuidorNivelID, parData.Monto, parData.DistribuidoresEstatusID };

                var validacion = await ConexionBD.database.QueryAsync<SP_ProspeccionVW>("EXEC Prospeccion.pa_ConsolidacionProspecto @ProspectoID, @UsuarioID, @DistribuidorNivelID, @Monto, @DistribuidoresEstatusID", obj).FirstOrDefaultAsync();


                if (validacion.regresa == 1)
                {
                    var DistribuidorUpd = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Distribuidores.Distribuidores>(parData.ProspectoID);

                    if (DistribuidorUpd != null)
                    {
                        DistribuidorUpd.DistribuidorNivelOrigenID = parData.DistribuidorNivelID;
                        DistribuidorUpd.DistribuidorNivelID = parData.DistribuidorNivelID2;
                        DistribuidorUpd.DistribuidoresEstatusID = parData.DistribuidoresEstatusID;


                        await ConexionBD.database.UpdateAsync(DistribuidorUpd);

                    }
                }

                if (validacion.regresa == 1)
                {
                    var cliente = new DBContext.DBConfia.Distribuidores.Clientes()
                    {

                        ProductoID = parData.ProductoID,
                        DistribuidorID = parData.ProspectoID,
                        PersonaID = parData.ProspectoID,
                        EsttausId = true,
                        AsignacionFecha = DateTime.Now,
                        bloqueado = false
                    };
                    await ConexionBD.database.InsertAsync(cliente);

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
        [Route("CancelarProspecto")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> CancelarProspecto(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.AddMsjSucursalPromotor parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                parData.Nota = $"{parData.Nota} -- PROSPECTO CANCELADO";
                var obj = new { parData.ProspectoID, parData.Nota, UsuarioActual.UsuarioID, parData.TipoMesa };
                var validacion = await ConexionBD.database.QueryAsync<LogMensajesVW>("EXEC Prospeccion.pa_AgregarNota @ProspectoID, @Nota, 1, @UsuarioID, @TipoMesa", obj).FirstOrDefaultAsync();

                var prospecto = await ConexionBD.database.SingleByIdAsync<Prospectos>(parData.ProspectoID);
                prospecto.Activo = false;
                await ConexionBD.database.UpdateAsync(prospecto);

                if (validacion.regresa == 1)
                {
                    var prospectores = await ConexionBD.database.QueryAsync<Prospectos_VW>("WHERE ProspectoID=@0", parData.ProspectoID).SingleOrDefaultAsync();
                    await ConexionBD.Destroy();
                    return Ok(prospectores);
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

        // Obtener Prospectos
        // Obtener Prospectos
        [HttpPost]
        [Route("getProspectos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetProspectos(PeticionesRest.Prospeccion.Prospecto.GetProspecto parData)
        {
            try
            {

                var resP = await ConexionBD.database.FetchAsync<Prospectos_VW>("WHERE (PromotorPersonaID = @0) AND (Activo = 1)", parData.PromotorPersonaID);
                await ConexionBD.Destroy();
                return Ok(resP);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("getSucursalesPromotor")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getSucursalesPromotor()
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());

                var sucursalesQuery = @"
                SELECT sv.SucursalID,sv.Nombre AS Sucursal  FROM General.Sucursales_VW sv
                JOIN General.Gerentes g ON sv.SucursalID = g.SucursalID
                JOIN General.SucursalProductos sp ON g.SucursalID = sp.SucursalID
                WHERE g.UsuarioID = @0 and sp.ProductoID = @1";

                if (UsuarioActual.MasterUser == true)
                {
                    sucursalesQuery = @"
                    SELECT sv.SucursalID,sv.Nombre AS Sucursal 
                    FROM General.Sucursales sv
                    JOIN General.SucursalProductos sp ON sv.SucursalID = sp.SucursalID
                    JOIN Creditos.Grupos g ON sv.SucursalID = g.SucursalID
                    JOIN Sistema.FnGetGruposUsuario(@0) fggu ON g.GrupoID IN (fggu.GrupoID)
                    WHERE sp.ProductoID = @1";

                }
                var promotoresQuery = @"
                SELECT sv.SucursalID,sv.Nombre AS Sucursal FROM Creditos.Promotores p 
                JOIN Seguridad.Usuarios u ON p.creditoPromotorId = u.PersonaID
                JOIN General.Sucursales_VW sv ON p.SucursalID = sv.SucursalID
                WHERE u.UsuarioID = @0 AND p.ProductoID = @1";

                var sucursales = await ConexionBD.database.FetchAsync<dynamic>(sucursalesQuery, UsuarioActual.UsuarioID, ProductoID);
                var promotores = await ConexionBD.database.FetchAsync<dynamic>(promotoresQuery, UsuarioActual.UsuarioID, ProductoID);

                var combinedResults = sucursales
                    .Concat(promotores)
                    .GroupBy(item => new { item.SucursalID })
                    .Select(group => group.First())
                    .ToList();

                await ConexionBD.Destroy();
                return Ok(combinedResults);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }

    }
}
