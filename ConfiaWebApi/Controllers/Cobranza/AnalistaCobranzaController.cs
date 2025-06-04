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
    public class AnalistaCobranzaController : ControllerBase
    {
        private DBConfiaContext DBContext;
        
        public AnalistaCobranzaController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }


        [HttpPost]
        [Route("ValidacionAltaEncargados")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> validacion(ConfiaWebApi.PeticionesRest.Cobranza.EncargadosMesaCobranza.ValidacionAltaEncargados parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, regresa = parData.regresa, msj = parData.msj };
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Cobranza.spValida>("EXEC Cobranza.ValidacionAltaEncargados @Usu, @regresa, @msj", obj).FirstOrDefaultAsync();
                await DBContext.Destroy();
                if (res.regresa == 1)
                    return Ok(res);
                else
                    return BadRequest(res.msj);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
        

        [HttpPost]
        [Route("getAnalistaCobranza")]
        [Authorize]
        [Code.TProteccionProducto]
        ///[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        //[ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> GetAnalistaCobranza(ConfiaWebApi.PeticionesRest.Cobranza.GestorCobranza.get parData)
        {
            try
            {
                var res = await DBContext.database.FetchAsync<DBContext.DBConfia.Cobranza.GestoresCobranza_VW>(); //Falta agregar el where pero no se cual id pertenece a Analista de Credito 
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
        //[Authorize]
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
    }
}