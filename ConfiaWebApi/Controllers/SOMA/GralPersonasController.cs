using System.Data.Common;
using System.Net;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;

using DBContext.DBConfia;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Seguridad;
using DBContext.DBConfia.dbo;

using System.Net.Http;
using System.Collections.Generic;
using System.Text.Json;
using System.Collections;

namespace ConfiaWebApi.Controllers.Sistema
{
    [Authorize]
    [ApiController]
    [Route("api/SOMA/[controller]")]
    public class GralPersonasController : ControllerBase
    {
        // TODO::
        // Validar funcion de eliminar cuenta... ??, valido, util ?
        // Segundo, se pueden eliminar las bovedas ??, se pueden actualizar hasta que nivel? (Nombre y Clave o solo nombre?)

        /// <summary>
        /// Conexion a base de datos
        /// </summary>
        private DBConfiaContext ConexionBD;

        /// <summary>
        /// Constructor del controlador
        /// </summary>
        /// <param name="_DBContext">Conexión de datos para el controlador</param>
        public GralPersonasController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        // Obtenemos los balances
        [HttpGet]
        [Route("find-all")]
        [Authorize]
        public async Task<IActionResult> Obtener()
        {



            var personas = await ConexionBD.database.FetchAsync<DBContext.DBConfia.General.Personas>();
            var sexos = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Catalogos.Sexos>();
            ArrayList res = new();
            try
            {
                /*    var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                   var UsuarioActual = await DBContext.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
                   var PersonaActual = await DBContext.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.ID).FirstOrDefaultAsync();
    */
                foreach (var T in personas)
                {
                    res.Add(new
                    {
                        personaID = T.PersonaID,
                        nombre = T.Nombre,
                        apellidoPaterno = T.ApellidoPaterno,
                        apellidoMaterno = T.ApellidoMaterno,
                        fechaNac = T.FechaNacimiento,
                        lugarNac = T.LugarNacimiento,
                        curp = T.CURP,
                        rfc = T.RFC,
                        sexo = sexos.Where(ws => ws.SexoID == T.SexoID).Select(sc => new { sexoID = sc.SexoID, sexo = sc.Sexo }).SingleOrDefault(),
                        edoCivilID = T.EstadoCivilID,
                        escolaridadID = T.EscolaridadID,
                        ingresosMensuales = T.IngresosMensuales,
                        dependientes = T.DependientesEconomicos,
                        teleDom = T.TelefonoDomicilio,
                        teleMov = T.TelefonoMovil,
                        correo = T.CorreoElectronico,
                        fechaReg = T.CreacionFecha,
                        nombreCompleto = T.NombreCompleto,
                        nombreConyuge = T.NombreConyuge,
                        burointernoID = T.BuroInternoEstatusID,
                        observaciones = T.Observaciones,
                        identificacionTipoID = T.identificacionTipoId,
                        identificacionNumero = T.identificacionNumero,
                        canjeaValeSolicitudId = T.canjeValeSolicitudId,
                        sacid = T.SACId,
                        creacionUsuarioID = T.CreacionUsuarioID,
                        grupoID = T.GrupoID,
                        soundexNombre = T.SoundexNombre,
                        soundexAPaterno = T.SoundexAPaterno,
                        soundexAMaterno = T.SoundexAMaterno,
                        canajeValeSolID = T.canjeValeSolicitudId
                    });
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

        [HttpGet]
        [Route("find-by-id/{PersonaID}")]
        [Authorize]
        public async Task<IActionResult> ObtenerPorId(int PersonaID)
        {
            var T = await ConexionBD.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE PersonaID=@0", PersonaID).SingleOrDefaultAsync();
            var sexos = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Catalogos.Sexos>();
            ArrayList res = new();
            try
            {
                res.Add(new
                {
                    personaID = T.PersonaID,
                    nombre = T.Nombre,
                    apellidoPaterno = T.ApellidoPaterno,
                    apellidoMaterno = T.ApellidoMaterno,
                    fechaNac = T.FechaNacimiento,
                    lugarNac = T.LugarNacimiento,
                    curp = T.CURP,
                    rfc = T.RFC,
                    sexo = sexos.Where(ws => ws.SexoID == T.SexoID).Select(sc => new { sexoID = sc.SexoID, sexo = sc.Sexo }).SingleOrDefault(),
                    edoCivilID = T.EstadoCivilID,
                    escolaridadID = T.EscolaridadID,
                    ingresosMensuales = T.IngresosMensuales,
                    dependientes = T.DependientesEconomicos,
                    teleDom = T.TelefonoDomicilio,
                    teleMov = T.TelefonoMovil,
                    correo = T.CorreoElectronico,
                    fechaReg = T.CreacionFecha,
                    nombreCompleto = T.NombreCompleto,
                    nombreConyuge = T.NombreConyuge,
                    burointernoID = T.BuroInternoEstatusID,
                    observaciones = T.Observaciones,
                    identificacionTipoID = T.identificacionTipoId,
                    identificacionNumero = T.identificacionNumero,
                    canjeaValeSolicitudId = T.canjeValeSolicitudId,
                    sacid = T.SACId,
                    creacionUsuarioID = T.CreacionUsuarioID,
                    grupoID = T.GrupoID,
                    soundexNombre = T.SoundexNombre,
                    soundexAPaterno = T.SoundexAPaterno,
                    soundexAMaterno = T.SoundexAMaterno,
                    canajeValeSolID = T.canjeValeSolicitudId
                });
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        [Route("find-all/Sexo/{SexoID}")]
        [Authorize]
        public async Task<IActionResult> FiltrarPorSexo(String SexoID)
        {
            var personas = await ConexionBD.database.QueryAsync<DBContext.DBConfia.General.Personas>("WHERE SexoID=@0", SexoID).ToArrayAsync();
            var sexos = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Catalogos.Sexos>();
            ArrayList res = new();
            try
            {
                if (personas.Length <= 0)
                {
                    res.Add(new
                    {
                        Error = "Sin resultados"
                    });
                }
                else
                {
                    var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                    var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                    // var UsuarioActual = await ConexionBD.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
                    var PersonaActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE UsuarioID=@0", UsuarioActual.UsuarioID).FirstOrDefaultAsync();

                    foreach (var T in personas)
                    {
                        res.Add(new
                        {
                            personaID = T.PersonaID,
                            nombre = T.Nombre,
                            apellidoPaterno = T.ApellidoPaterno,
                            apellidoMaterno = T.ApellidoMaterno,
                            fechaNac = T.FechaNacimiento,
                            lugarNac = T.LugarNacimiento,
                            curp = T.CURP,
                            rfc = T.RFC,
                            sexo = sexos.Where(ws => ws.SexoID == T.SexoID).Select(sc => new { sexoID = sc.SexoID, sexo = sc.Sexo }).SingleOrDefault(),
                            edoCivilID = T.EstadoCivilID,
                            escolaridadID = T.EscolaridadID,
                            ingresosMensuales = T.IngresosMensuales,
                            dependientes = T.DependientesEconomicos,
                            teleDom = T.TelefonoDomicilio,
                            teleMov = T.TelefonoMovil,
                            correo = T.CorreoElectronico,
                            fechaReg = T.CreacionFecha,
                            nombreCompleto = T.NombreCompleto,
                            nombreConyuge = T.NombreConyuge,
                            burointernoID = T.BuroInternoEstatusID,
                            observaciones = T.Observaciones,
                            identificacionTipoID = T.identificacionTipoId,
                            identificacionNumero = T.identificacionNumero,
                            canjeaValeSolicitudId = T.canjeValeSolicitudId,
                            sacid = T.SACId,
                            creacionUsuarioID = T.CreacionUsuarioID,
                            grupoID = T.GrupoID,
                            soundexNombre = T.SoundexNombre,
                            soundexAPaterno = T.SoundexAPaterno,
                            soundexAMaterno = T.SoundexAMaterno,
                            canajeValeSolID = T.canjeValeSolicitudId
                        });
                    }
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



        // Agrega una caja a la base de datos
        [HttpPost]
        [Route("create")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Agregar(PeticionesRest.SOMA.GralPersonas.Agregar parData)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            // var UsuarioActual2 = await ConexionBD.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
            // var PersonaActual = await ConexionBD.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.UsuarioID).FirstOrDefaultAsync();
            // Generamos el registro de el estado civil
            var persona = new DBContext.DBConfia.General.Personas()
            {
                Nombre = parData.Nombre,
                ApellidoPaterno = parData.ApellidoPaterno,
                ApellidoMaterno = parData.ApellidoPaterno,
                FechaNacimiento = parData.FechaNacimiento,
                LugarNacimiento = parData.LugarNacimiento,
                CURP = parData.CURP,
                RFC = parData.RFC,
                SexoID = parData.SexoID,
                EstadoCivilID = parData.EstadoCivilID,
                EscolaridadID = parData.EscolaridadID,
                IngresosMensuales = parData.IngresosMensuales,
                DependientesEconomicos = parData.DependientesEconomicos,
                TelefonoDomicilio = parData.TelefonoDomicilio,
                TelefonoMovil = parData.TelefonoMovil,
                CorreoElectronico = parData.CorreoElectronico,
                NombreConyuge = parData.NombreConyuge,
                BuroInternoEstatusID = parData.BuroInternoEstatusID,
                Observaciones = parData.Observaciones,
                identificacionTipoId = parData.identificacionTipoId,
                identificacionNumero = parData.identificacionNumero,
                canjeValeSolicitudId = parData.canjeValeSolicitudId,
                GrupoID = parData.GrupoID,
                NombreCompleto = parData.NombreCompleto,
                CreacionFecha = DateTime.Now,
                CreacionPersonaID = (long)UsuarioActual.UsuarioID,
                CreacionUsuarioID = UsuarioActual.UsuarioID,
                // TODO: VALIDAR
                SoundexNombre = parData.SoundexNombre,
                SoundexAPaterno = parData.SoundexAPaterno,
                SoundexAMaterno = parData.SoundexAMaterno,
                SACId = parData.SACId,

            };
            try
            {
                // Ingresamos la ocupación a la bd
                await ConexionBD.database.InsertAsync(persona);

                // Regresamos el registro a la UI
                await ConexionBD.Destroy();
                return Ok(persona);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("Error al ingresar el la persona al sistema: " + ex.Message);
            }
        }

        //Método para actualizar una denominación
        [HttpPut]
        [Route("update/{PersonaID}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Actualizar(PeticionesRest.SOMA.GralPersonas.Update parData, int PersonaID)
        {
            // Obtenemos el email del usuario de los claims
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", usuarioActualEmail).FirstOrDefaultAsync();

            // var usuarioActual = await DBContext.database.QueryAsync<PersonasUsuarios_VW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();
            // var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            // var UsuarioActual2 = await DBContext.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
            // var PersonaActual = await DBContext.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual2.ID).FirstOrDefaultAsync();

            // Generamos el registro de la persona
            var persona = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.General.Personas>(PersonaID);

            try
            {
                // Actualizamos el registro
                persona.Nombre = parData.Nombre;
                persona.ApellidoPaterno = parData.ApellidoPaterno;
                persona.ApellidoMaterno = parData.ApellidoPaterno;
                persona.FechaNacimiento = parData.FechaNacimiento;
                persona.LugarNacimiento = parData.LugarNacimiento;
                persona.CURP = parData.CURP;
                persona.RFC = parData.RFC;
                persona.SexoID = parData.SexoID;
                persona.EstadoCivilID = parData.EstadoCivilID;
                persona.EscolaridadID = parData.EscolaridadID;
                persona.IngresosMensuales = parData.IngresosMensuales;
                persona.DependientesEconomicos = parData.DependientesEconomicos;
                persona.TelefonoDomicilio = parData.TelefonoDomicilio;
                persona.TelefonoMovil = parData.TelefonoMovil;
                persona.CorreoElectronico = parData.CorreoElectronico;
                persona.NombreConyuge = parData.NombreConyuge;
                persona.BuroInternoEstatusID = parData.BuroInternoEstatusID;
                persona.Observaciones = parData.Observaciones;
                persona.identificacionTipoId = parData.identificacionTipoId;
                persona.identificacionNumero = parData.identificacionNumero;
                persona.canjeValeSolicitudId = parData.canjeValeSolicitudId;
                persona.GrupoID = parData.GrupoID;
                persona.NombreCompleto = parData.NombreCompleto;
                /*   persona.CreacionFecha = DateTime.Now;
                  persona.CreacionPersonaID = PersonaActual.PersonaID;
                  persona.CreacionUsuarioID = UsuarioActual2.ID.ToString();
                  */
                persona.SoundexNombre = parData.SoundexNombre;
                persona.SoundexAPaterno = parData.SoundexAPaterno;
                persona.SoundexAMaterno = parData.SoundexAMaterno;
                persona.SACId = parData.SACId;
                persona.ModificacionFecha = DateTime.Now;
                persona.ModificacionPersonaID = (long)UsuarioActual.UsuarioID;
                persona.ModificacionUsuarioID = UsuarioActual.UsuarioID;

                // Ingresamos la bobeda a la bd
                await ConexionBD.database.UpdateAsync(persona);

                // Regresamos el registro a la UI
                await ConexionBD.Destroy();
                return Ok(persona);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("Error al actualizar el sexo: " + ex.Message);
            }
        }

        [HttpDelete]
        [Route("delete/{PersonaID}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> EliminarRegistro(int PersonaID)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            //var agrupacion = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Tesoreria.CatalogoDenomEfectivo>(CatDenomEfectivoID);
            try
            {

                var query = NPoco.Sql.Builder.Append("DELETE FROM General.Personas WHERE PersonaID=@0", PersonaID);
                var res = await ConexionBD.database.QueryAsync<DBContext.DBConfia.General.Personas>(query).ToArrayAsync();
                var res2 = res.Where(ws => ws.PersonaID == PersonaID).LongCount();
                if (res2 >= 1)
                {
                    return Ok("Registro eliminado exitosamente");

                }
                else
                {
                    return NotFound("Ocurriò un problema al eliminar el registro");


                }


            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("Error al eliminar la persona: " + ex.Message);
            }
        }
    }
}