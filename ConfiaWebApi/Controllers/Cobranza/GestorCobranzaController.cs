using DBContext.DBConfia;
using DBContext.DBConfia.Catalogos;
using DBContext.DBConfia.Cobranza;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.Cobranza
{
    [Authorize]
    [ApiController]
    [Route("api/Cobranza/[controller]")]
    public class GestorCobranzaController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public GestorCobranzaController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }


        /*************************************************************************************************************************************************************************************************************/
        /*******************************************VALIDACION DIRECTOR COBRANZA**************************************************************************************************************************************/
        /*************************************************************************************************************************************************************************************************************/
        //Esta sera la funcion que se usara en toda cobranza para la validacion de un director.
        [HttpGet]
        [Route("getValidacion")]
        [Code.TProteccionProducto]
        [Authorize]
        public async Task<ActionResult> GetValidacion()
        {
            try
            {
                //Obtenemos el Usuario con el cual se ingreso
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                //Consultamos los datos correspondientes al yusuario correspondiente
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario = @0", UserName).FirstOrDefaultAsync();
                // Verificamos En la tabla Directores si el usuario existe
                var verificacion = await DBContext.database.QueryAsync<DBContext.DBConfia.General.Directores>("WHERE PersonaID=@0", UsuarioActual.PersonaID).FirstOrDefaultAsync();
                //Si el usuario existe entonces regresamos la respuesta obtenida para poder empezar a habilitar opciones en el FRONTEND
                if (verificacion != null) { await DBContext.Destroy(); return Ok(verificacion); }
                //Si no existe el usuario en la tabla Directores, entonces simplemente regresamos un mensaje indicando que existe un error al verifiacar que es un director
                else { await DBContext.Destroy(); return BadRequest("Error al verificar director"); }
            }
            catch
            {
                await DBContext.Destroy();
                return BadRequest("Error");
            }
        }
        /*************************************************************************************************************************************************************************************************************/
        /*************************************************************************************************************************************************************************************************************/



        [HttpPost]
        [Route("getMesa")]
        [Authorize]
        [Code.TProteccionProducto]
        ///[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        //[ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> GetMesa(ConfiaWebApi.PeticionesRest.Cobranza.GestorCobranza.get parData)
        {
            try
            {
                var res = await DBContext.database.FetchAsync<MesaCobranza>("WHERE Activo = 1");
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }

        }


        [HttpPost]
        [Route("getGestorCobranzaIndex")]
        [Authorize]
        [Code.TProteccionProducto]
        ///[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        //[ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> GetGestorCobranzaIndex(ConfiaWebApi.PeticionesRest.Cobranza.GestorCobranza.get parData)
        {
            try
            {
                var res = await DBContext.database.FetchAsync<DBContext.DBConfia.Cobranza.GestoresCobranza_VW>();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }

        }

        [HttpPost]
        [Route("getMesaCobranza")]
        [Code.TProteccionProducto]
        [Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        //[ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> GetMesaCobranza(ConfiaWebApi.PeticionesRest.Cobranza.MesaCobranza.get parData)
        {

            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            var obj = new { PersonaId = UsuarioActual.PersonaID };
            var res = await DBContext.database.FetchAsync<RelacionEncargadoMesa_VW>("WHERE DirectorMesaCobranzaID = @PersonaId", obj);
            await DBContext.Destroy();
            return Ok(res);

        }

        [HttpPost]
        [Route("getGestores")]
        [Code.TProteccionProducto]
        [Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> GetGestores(ConfiaWebApi.PeticionesRest.Seguridad.UsuariospersonaspuestosVw.get parData)
        {
            if (parData.id != 0)
            {
                var resultado = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Seguridad.UsuariosPersonasPuestosVW>(parData.id);
                await DBContext.Destroy();
                return Ok(resultado);
            }
            // var res = await DBContext.database.FetchAsync<DBContext.DBConfia.Seguridad.UsuariosPersonasPuestosVW>("WHERE PuestoCV = 128");
            var res = await DBContext.database.FetchAsync<DBContext.DBConfia.Seguridad.UsuariosPersonasPuestosVW>("WHERE EsGestor = 1 AND Ocupacion IS NOT NULL ");
            await DBContext.Destroy();
            return Ok(res);

        }

        [HttpPost]
        [Route("getGestoresMesa")]
        [Code.TProteccionProducto]
        [Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> GetGestoresMesa(ConfiaWebApi.PeticionesRest.Cobranza.GestorCobranza.get parData)
        {

            try
            {
                var res = await DBContext.database.FetchAsync<DBContext.DBConfia.Cobranza.GestoresCobranza_VW>("WHERE Activo = 1");
                await DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }

        }



        [HttpPost]
        [Route("addGestor")]
        [Code.TProteccionProducto]
        [Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> addGestor(ConfiaWebApi.PeticionesRest.Cobranza.GestorCobranza.add parData)
        {
            try
            {
                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, ProductoID = ProductoID, PersonaID = parData.PersonaID, MesaCobranzaID = parData.MesaCobranzaID, Activo = parData.Activo, regresa = parData.regresa, msj = parData.msj };
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Cobranza.spAltaGestor>("EXEC Cobranza.AltaGestor @Usu, @ProductoID, @PersonaID, @MesaCobranzaID, @Activo, @regresa, @msj", obj).FirstOrDefaultAsync();
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
        }

        [HttpPost]
        [Route("addPersonaGestor")]
        [Code.TProteccionProducto]
        [Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Cobranza.GestorCobranza.addPersonaGestor parData)
        {

            try
            {
                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, ProductoID = ProductoID, Nombre = parData.Nombre, ApellidoPaterno = parData.ApellidoPaterno, ApellidoMaterno = parData.ApellidoMaterno, FechaNacimiento = parData.FechaNacimiento, SexoID = parData.SexoID, CURP = parData.CURP, RFC = parData.RFC, EstadoCivilID = parData.EstadoCivilID, NombreConyuge = parData.NombreConyuge, EscolaridadID = parData.EscolaridadID, TelefonoMovil = parData.TelefonoMovil, CorreoElectronico = parData.CorreoElectronico, LugarNacimiento = parData.LugarNacimiento, AsentamientoID = parData.AsentamientoID, Calle = parData.Calle, NumeroExterior = parData.NumeroExterior, TelefonoDomicilio = parData.TelefonoDomicilio, Observaciones = parData.Observaciones, identificacionTipoId = parData.identificacionTipoId, identificacionNumero = parData.identificacionNumero, MesaCobranzaID = parData.MesaCobranzaID, vialidadTipoId = parData.vialidadTipoId, orientacionVialidadTipoId = parData.orientacionVialidadTipoId, viviendaTipoId = parData.viviendaTipoId, Contrasena = BCrypt.Net.BCrypt.HashPassword("Confia123"), regresa = parData.regresa, msj = parData.msj };
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Cobranza.spAltaGestor>("EXEC Cobranza.AltaPersonaGestor @Usu, @ProductoID, @Nombre, @ApellidoPaterno, @ApellidoMaterno, @FechaNacimiento, @SexoID, @CURP, @RFC, @EstadoCivilID, @NombreConyuge, @EscolaridadID, @TelefonoMovil, @CorreoElectronico, @LugarNacimiento, @AsentamientoID, @Calle, @NumeroExterior, @TelefonoDomicilio, @Observaciones, @identificacionTipoId, @identificacionNumero, @MesaCobranzaID, @vialidadTipoId, @orientacionVialidadTipoId, @viviendaTipoId, @Contrasena, @regresa, @msj", obj).FirstOrDefaultAsync();
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
        }


        // [HttpPost]
        // [Route("validacionAltaGestorCobranza")]
        // [Code.TProteccionProducto]
        // [Authorize]
        // //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        // public async Task<IActionResult> validacion(ConfiaWebApi.PeticionesRest.Cobranza.GestorCobranza.validacionAltaGestorCobranza parData)
        // {
        //     try
        //     {
        //     //    Consultamos el usuario
        //         var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
        //         var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
        //         var obj = new { Usu = UsuarioActual.UsuarioID, regresa = parData.regresa, msj = parData.msj, valida = parData.valida };
        //         //Definimos la variable msj en donde almacenaremos el mensaje a mandar
        //         // var msj = "";
        //         // //Obtenemos el gestor de la mesa
        //         // var gestMesa = await DBContext.database.QueryAsync<DBContext.DBConfia.Catalogos.VariablesGlobales>(" WHERE varName = 'CAMBIAR_GESTOR_MESA'").FirstOrDefaultAsync();
        //         // // Iniciamos la transaccion a
        //         // DBContext.database.BeginTransaction();
        //         // var personaId = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios_Personas>("WHERE	UsuarioID = @Usu", obj).FirstOrDefaultAsync();
        //         // //Se valida si la persona esta en la tabla 
        //         // var directorCob = await DBContext.database.QueryAsync<DBContext.DBConfia.Cobranza.DirectorMesaCobranza>("WHERE	DIRECTORMESACOBRANZAID	= @0", personaId.UsuarioID).FirstOrDefaultAsync();
        //         // if(directorCob == null ){
        //         //     if(UsuarioActual.UsuarioID != 33){msj = "Esta accion solo la pueden realizar los encargados";}}
        //         //     else{ if(parData.valida == true){if(gestMesa.varName == "0"){msj = "Esta accion solo la pueden realizar los encargados";}}
        //         //     else{ msj = "Exito al realizar la validacion";}}

        //         // DBContext.database.CompleteTransaction();
        //         // await DBContext.Destroy();
        //         // return Ok(msj);               
        //         var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Cobranza.spValida>("EXEC Cobranza.ValidacionAltaGestorCobranza @Usu, @valida, @regresa, @msj", obj).FirstOrDefaultAsync();

        //         await DBContext.Destroy();
        //         if (res.regresa == 1)
        //             return Ok(res);
        //         else
        //             await DBContext.Destroy();
        //         return BadRequest(res.msj);
        //     }
        //     catch (Exception ex)
        //     {
        //         DBContext.database.AbortTransaction();
        //         await DBContext.Destroy();
        //         return BadRequest(ex.Message);
        //     }

        // }

        [HttpPost]
        [Route("updGestor")]
        [Code.TProteccionProducto]
        [Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> UpdGestor(ConfiaWebApi.PeticionesRest.Cobranza.GestorCobranza.upd parData)
        {
            try
            {
                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var mesaCobranza = await DBContext.database.QueryAsync<DBContext.DBConfia.Cobranza.MesaCobranza>("WHERE MesaCobranzaID = @0", parData.MesaCobranzaID).FirstOrDefaultAsync();
                var obj = new
                {
                    UsuarioId = UsuarioActual.UsuarioID,
                    GestorId = parData.PersonaID,
                    MesaCobranzaId = parData.MesaCobranzaID,
                    MesaAnteriorId = parData.MesaAnteriorId,
                    // Nombre = parData.NombreCompleto, 
                    mesaCobranza = mesaCobranza.Nombre,
                    Activo = parData.Activo,
                    regresa = parData.regresa,
                    msj = parData.msj
                };
                var consulta = await DBContext.database.QueryAsync<DBContext.DBConfia.Cobranza.GestorCobranza>("WHERE GestorCobranzaID = @GestorId AND MesaCobranzaID = @MesaCobranzaId AND Activo = @Activo", obj).FirstOrDefaultAsync();

                if (consulta != null)
                {
                    await DBContext.Destroy();
                    return BadRequest("El usuario ya existe asignado a esta mesa de cobranza");
                }
                else
                {
                    var viejaMesa = await DBContext.database.QueryAsync<DBContext.DBConfia.Cobranza.GestorCobranza>("WHERE GestorCobranzaID = @GestorId AND MesaCobranzaID = @MesaAnteriorId AND Activo = @Activo", obj).FirstOrDefaultAsync();
                    var obj2 = new
                    {
                        Gestor = parData.PersonaID,
                        mesaAnterior = parData.MesaAnteriorId,
                        mesaActual = parData.MesaCobranzaID

                    };
                    DBContext.database.BeginTransaction();

                    var Actualizacion = await DBContext.database.QueryAsync<DBContext.DBConfia.Cobranza.GestorCobranza>("WHERE MesaCobranzaID = @mesaAnterior AND GestorCobranzaID = @Gestor", obj2).FirstOrDefaultAsync();
                    if (Actualizacion != null)
                    {
                        Actualizacion.MesaCobranzaID = parData.MesaCobranzaID;
                        var result = await DBContext.database.UpdateAsync(Actualizacion);

                        // var bitacora = new DBContext.DBConfia.Cobranza.Bitacora(){
                        //     Usuario = UsuarioActual.UsuarioID,
                        //     UsuarioPersona = Int32.Parse(UserName),
                        //     MesaCobranzaID = null,
                        //     GestorId = parData.PersonaID,
                        //     DistribuidorID = null,
                        //     EncargadoId = null,
                        //     Clave = "ACGC01",
                        //     Fecha = DateTime.Now

                        // };

                        // await DBContext.database.InsertAsync(bitacora);


                        DBContext.database.CompleteTransaction();
                        await DBContext.Destroy();
                        return Ok("La mesa de cobranza fue asignada correctamente");
                    }
                    else
                    {
                        DBContext.database.AbortTransaction();
                        await DBContext.Destroy();
                        return BadRequest();
                    }
                }

            }
            catch (Exception ex)
            {
                DBContext.database.AbortTransaction();
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        // [HttpPost]
        // [Route("getGestor")]
        // [Authorize]
        // [Code.TProteccionAdmin]
        // // [Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        // public async Task<IActionResult> Get(PeticionesRest.Cobranza.GestorCobranza.getGestor parData)
        // {
        //     // // if (parData.ProductoID != 0) {
        //     //   var gestor = await DBContext.database.FetchAsync<DBContext.DBConfia.Distribuidores.Distribuidores>("WHERE (DistribuidorID = @DistribuidorID)", parData);

        //     //     return Ok(await DBContext.database.FetchAsync<GestoresCobranza_VW>("WHERE (GestorCobranzaID = @GestorCobranzaID)", parData));
        //     // // }

        //     // // return Ok(await DBContext.database.FetchAsync<CatalogoConvenios>());

        //     try
        //     {
        //         var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Distribuidores>("WHERE DistribuidorID=@0", parData.DistribuidorID).FirstOrDefaultAsync();
        //         await DBContext.Destroy();
        //         return Ok(res);
        //     }
        //     catch (Exception ex)
        //     {
        //         await DBContext.Destroy();
        //         return NotFound(ex.Message);
        //     }

        // }
        [HttpGet]
        [Route("getGestor/{DistribuidorID}")]
        [Authorize]
        [Code.TProteccionAdmin]
        // [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> getGestor(int DistribuidorID)
        {
            try
            {
                var dist = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Distribuidores>("WHERE  (DistribuidorID = @0)", DistribuidorID).FirstOrDefaultAsync();
                var gestor = await DBContext.database.FetchAsync<GestoresCobranza_VW>("WHERE (GestorCobranzaID = @0)", dist.GestorID);
                await DBContext.Destroy();
                return Ok(gestor);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpGet]
        [Route("getGestorDist/{DistribuidorID}")]
        [Authorize]
        // [Code.TProteccionProducto]
        // [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> getGestorDist(int DistribuidorID)
        {
            try
            {
                var dist = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Distribuidores>("WHERE  (DistribuidorID = @0)", DistribuidorID).FirstOrDefaultAsync();
                string Stored = "";
                Stored = "EXEC Gestoria.GetLogGestores @0";
                var gestor = await DBContext.database.QueryAsync<ConfiaWebApi.PeticionesRest.Gestoria.Gestor.GetGestor>(Stored, DistribuidorID).ToArrayAsync();
                await DBContext.Destroy();
                return Ok(gestor);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }
    }
}
