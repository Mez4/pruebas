using DBContext.DBConfia;
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
    public class EncargadoMesaCobranzaController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public EncargadoMesaCobranzaController(DBConfiaContext _DBContext)
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
            try{
                   //Obtenemos el Usuario con el cual se ingreso
                   var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                   //Consultamos los datos correspondientes al yusuario correspondiente
                   var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario = @0", UserName).FirstOrDefaultAsync();
                   // Verificamos En la tabla Directores si el usuario existe
                   var verificacion = await DBContext.database.QueryAsync<DBContext.DBConfia.General.Directores>("WHERE PersonaID=@0", UsuarioActual.PersonaID).FirstOrDefaultAsync();
                   //Si el usuario existe entonces regresamos la respuesta obtenida para poder empezar a habilitar opciones en el FRONTEND
                   if(verificacion != null){ await DBContext.Destroy();return Ok(verificacion);}
                   //Si no existe el usuario en la tabla Directores, entonces simplemente regresamos un mensaje indicando que existe un error al verifiacar que es un director
                   else{await DBContext.Destroy();return BadRequest("Error al verificar director");}
            }
            catch{
                await DBContext.Destroy();
                return BadRequest("Error");
            }
        }
/*************************************************************************************************************************************************************************************************************/
/*************************************************************************************************************************************************************************************************************/


        [HttpPost]
        [Route("get")]
        [Code.TProteccionProducto]
        [Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        //[ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> get(ConfiaWebApi.PeticionesRest.Cobranza.EncargadosMesaCobranza.get parData)
        {
            try
            {
                var res = await DBContext.database.FetchAsync<DBContext.DBConfia.Cobranza.DirectoresMesaCobranza_VW>();
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
        [Route("getEncargados")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> GetEncargados(ConfiaWebApi.PeticionesRest.Seguridad.UsuariospersonaspuestosVw.get parData)
        {
            if (parData.id != 0)
            {
                var resultado = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Seguridad.UsuariosPersonasPuestosVW>(parData.id);
                await DBContext.Destroy();
                return Ok(resultado);
            }

            var res = await DBContext.database.FetchAsync<DBContext.DBConfia.Seguridad.UsuariosPersonasPuestosVW>("WHERE PuestoCV = 28");
            await DBContext.Destroy();
            return Ok(res);

        }

        [HttpPost]
        [Route("addEncargados")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> addDirector(ConfiaWebApi.PeticionesRest.Cobranza.EncargadosMesaCobranza.add parData)

        {
            try
            {
                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, ProductoID = ProductoID, DirectorMesaCobranzaID = parData.DirectorMesaCobranzaID, Activo = parData.Activo, regresa = parData.regresa, msj = parData.msj };
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Cobranza.spAgregarEncargado>("EXEC Cobranza.AgregarEncargado @Usu, @ProductoID, @DirectorMesaCobranzaID, @Activo, @regresa, @msj", obj).FirstOrDefaultAsync();
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
        [Route("updEncargados")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> updEncargados(ConfiaWebApi.PeticionesRest.Cobranza.EncargadosMesaCobranza.UpdEncargados parData)
        {
            try
            {
                // int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var Bitacora = new Bitacora { Usuario = UsuarioActual.UsuarioID, UsuarioPersona = Convert.ToInt32(UsuarioActual.PersonaID), Clave = "EIU00", Fecha = DateTime.Now };
                await DBContext.database.InsertAsync<Bitacora>(Bitacora);

                var encargado = await DBContext.database.SingleByIdAsync<DirectorMesaCobranza>(parData.DirectorMesaCobranzaID);
                encargado.DirectorMesaCobranzaID = parData.DirectorMesaCobranzaID;
                encargado.Activo = parData.Activo;
                await DBContext.database.UpdateAsync(encargado);

                var encargadovw = await DBContext.database.QueryAsync<DBContext.DBConfia.Cobranza.DirectoresMesaCobranza_VW>("where DirectorMesaCobranzaID=@0", encargado.DirectorMesaCobranzaID).SingleOrDefaultAsync();
                await DBContext.Destroy();
                return Ok(encargadovw);
                // if (res.regresa == 1)
                //     return Ok(res);
                // else
                //     return BadRequest(res.msj);
            }
            catch (Exception ex)
            {
                // await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("addPersonaEncargado")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Cobranza.EncargadosMesaCobranza.addPersonaEncargado parData)
        {
            try
            {
                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, ProductoID = ProductoID, Nombre = parData.Nombre, ApellidoPaterno = parData.ApellidoPaterno, ApellidoMaterno = parData.ApellidoMaterno, FechaNacimiento = parData.FechaNacimiento, SexoID = parData.SexoID, CURP = parData.CURP, RFC = parData.RFC, EstadoCivilID = parData.EstadoCivilID, NombreConyuge = parData.NombreConyuge, EscolaridadID = parData.EscolaridadID, TelefonoMovil = parData.TelefonoMovil, CorreoElectronico = parData.CorreoElectronico, LugarNacimiento = parData.LugarNacimiento, AsentamientoID = parData.AsentamientoID, Calle = parData.Calle, NumeroExterior = parData.NumeroExterior, TelefonoDomicilio = parData.TelefonoDomicilio, Observaciones = parData.Observaciones, identificacionTipoId = parData.identificacionTipoId, identificacionNumero = parData.identificacionNumero, vialidadTipoId = parData.vialidadTipoId, orientacionVialidadTipoId = parData.orientacionVialidadTipoId, viviendaTipoId = parData.viviendaTipoId, Contrasena = BCrypt.Net.BCrypt.HashPassword("Confia123"), regresa = parData.regresa, msj = parData.msj };
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Cobranza.spAltaPersonaEncargado>("EXEC Cobranza.AltaPersonaEncargado @Usu, @ProductoID, @Nombre, @ApellidoPaterno, @ApellidoMaterno, @FechaNacimiento, @SexoID, @CURP, @RFC, @EstadoCivilID, @NombreConyuge, @EscolaridadID, @TelefonoMovil, @CorreoElectronico, @LugarNacimiento, @AsentamientoID, @Calle, @NumeroExterior, @TelefonoDomicilio, @Observaciones, @identificacionTipoId, @identificacionNumero, @vialidadTipoId, @orientacionVialidadTipoId, @viviendaTipoId, @Contrasena, @regresa, @msj", obj).FirstOrDefaultAsync();
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
        // [Route("ValidacionAltaEncargados")]
        // [Code.TProteccionProducto]
        // [Authorize]
        // //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        // public async Task<IActionResult> validacion(ConfiaWebApi.PeticionesRest.Cobranza.EncargadosMesaCobranza.ValidacionAltaEncargados parData)
        // {
        //     try
        //     {
        //         var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
        //         var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
        //         var UsuarioActual2 = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosPersonasPuestosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

        //         var obj = new
        //         {
        //             Usu = UsuarioActual.UsuarioID,
        //             regresa = parData.regresa,
        //             msj = parData.msj
        //         };

        //         if (UsuarioActual2 != null
        //             && UsuarioActual2.PuestoCV == 129)
        //         {
        //             return Ok(UsuarioActual2);
        //         }
        //         else
        //             await DBContext.Destroy();
        //         return BadRequest();
        //     }
        //     catch (Exception ex)
        //     {
        //         await DBContext.Destroy();
        //         return BadRequest(ex.Message);
        //     }
        // }
    }
}
