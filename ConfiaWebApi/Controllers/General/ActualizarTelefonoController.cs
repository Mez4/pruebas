
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
    public class ActualizarTelefonoController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public ActualizarTelefonoController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("update")]
        [Authorize]
        [Code.TProteccionAdmin]
        // [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> update(ConfiaWebApi.PeticionesRest.General.ActualizaTelefono.update parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { DistribuidorID = parData.DistribuidorID, Telefono = parData.Telefono, UsuarioIDModifica = UsuarioActual.UsuarioID, regresa = parData.regresa, msj = parData.msj };
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.General.ActualizaTel>("EXEC General.pa_ActualizarTelefono @DistribuidorID, @Telefono, @UsuarioIDModifica, @regresa, @msj", obj).FirstOrDefaultAsync();

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

