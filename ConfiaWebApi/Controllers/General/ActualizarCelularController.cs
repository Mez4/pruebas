
using DBContext.DBConfia;
using DBContext.DBConfia.Prospeccion;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.Prospeccion
{
    [Authorize]
    [ApiController]
    [Route("api/General/[controller]")]
    public class ActualizarCelularController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public ActualizarCelularController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("update")]
        [Authorize]

        [Code.TProteccionProducto]
        // [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> update(ConfiaWebApi.PeticionesRest.General.ActualizaCelular.update parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { DistribuidorID = parData.DistribuidorID, Celular = parData.Celular, UsuarioIDModifica = UsuarioActual.UsuarioID, regresa = parData.regresa, msj = parData.msj };
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.General.ActualizaCelular>("EXEC General.pa_ActualizarCelular @DistribuidorID, @Celular, @UsuarioIDModifica, @regresa, @msj", obj).FirstOrDefaultAsync();
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
        [Route("updateRFC")]
        [Authorize]

        [Code.TProteccionProducto]
        // [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> updateRFC(ConfiaWebApi.PeticionesRest.General.ActualizaCelular.updateRFC parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { PersonaID = parData.PersonaID, RFC = parData.RFC.ToUpper(), UsuarioIDModifica = UsuarioActual.UsuarioID, regresa = parData.regresa, msj = parData.msj };
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.General.ActualizarGeneral>("EXEC General.pa_ActualizarRFC @PersonaID, @RFC, @UsuarioIDModifica, @regresa, @msj", obj).FirstOrDefaultAsync();
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
        [Route("updateCurp")]
        [Authorize]

        [Code.TProteccionProducto]
        // [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> updateCurp(ConfiaWebApi.PeticionesRest.General.ActualizaCelular.updateCurp parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { PersonaID = parData.PersonaID, Curp = parData.Curp.ToUpper(), UsuarioIDModifica = UsuarioActual.UsuarioID, regresa = parData.regresa, msj = parData.msj };
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.General.ActualizarGeneral>("EXEC General.pa_ActualizarCurp @PersonaID, @Curp, @UsuarioIDModifica, @regresa, @msj", obj).FirstOrDefaultAsync();
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
        [Route("updateNombre")]
        [Authorize]

        [Code.TProteccionProducto]
        // [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> updateNombre(ConfiaWebApi.PeticionesRest.General.ActualizaCelular.updateNombre parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { PersonaID = parData.PersonaID, Nombre = parData.Nombre.ToUpper(), ApellidoPaterno = parData.ApellidoPaterno.ToUpper(), ApellidoMaterno = parData.ApellidoMaterno.ToUpper(), UsuarioIDModifica = UsuarioActual.UsuarioID, regresa = parData.regresa, msj = parData.msj };
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.General.ActualizarGeneral>("EXEC General.pa_ActualizarNombre @PersonaID, @Nombre, @ApellidoPaterno, @ApellidoMaterno, @UsuarioIDModifica, @regresa, @msj", obj).FirstOrDefaultAsync();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

    }
}

