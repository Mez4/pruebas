using DBContext.DBConfia;
using DBContext.DBConfia.Tesoreria;
//using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.General;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DBContext.DBConfia.Custom.Tesoreria;

namespace ConfiaWebApi.Controllers.Tesoreria
{
    [Authorize]
    [ApiController]
    [Route("api/Tesoreria/[controller]")]
    public class DesembolsoFiniquitoController : ControllerBase
    {
        private DBConfiaContext ConexionDB;

        public DesembolsoFiniquitoController(DBConfiaContext _DBContext)
        {
            ConexionDB = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.Tesoreria.DesembolsoFiniquito.Get parData)
        {
            var res = await ConexionDB.database.FetchAsync<DesembolsosFiniquitos_VW>("WHERE (SucursalID = @SucursalID OR @SucursalID = 0) AND (SACId = @SACId OR @SACId = 0) AND (CuentaBancoID = @CuentaBancoID OR @CuentaBancoID = 0) AND (Desembolsado = 0 OR @Todos = 1) AND (Cancelado = 0)", parData);
            await ConexionDB.Destroy();
            return Ok(res);

        }

        [HttpPost]
        [Route("CambiarCuenta")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> CambiarCuenta(PeticionesRest.Tesoreria.DesembolsoFiniquito.CambiarCuenta parData)
        {
            try
            {
                //var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                //var UsuarioActual = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                //parData.UsuarioId = UsuarioActual.UsuarioID;
                //parData.PersonaRegistroID = UsuarioActual.PersonaID.Value;

                string Stored = "EXEC [Tesoreria].pa_CambiaCtaDesembolsoFiniquito_udp @SolicitudID, @CuentaBancoID";

                var res = await ConexionDB.database.QueryAsync<DesembolsoFiniquitoRes>(Stored, parData).FirstOrDefaultAsync();

                var Solicitud = await ConexionDB.database.QueryAsync<DesembolsosFiniquitos_VW>("WHERE (Id = @0)", parData.SolicitudID).FirstOrDefaultAsync();

                var response = new
                {
                    res = res.regresa,
                    msj = res.msj,
                    Data = Solicitud
                };

                await ConexionDB.Destroy();

                return Ok(response);

            }
            catch (Exception ex)
            {
                await ConexionDB.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("desembolsar")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.Tesoreria.DesembolsoFiniquito.Desembolsar parData)
        {

            try
            {
                
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                parData.UsuarioId = UsuarioActual.UsuarioID;
                parData.PersonaRegistroID = UsuarioActual.PersonaID.Value;

                string Stored = "EXEC [Tesoreria].pa_DesembolsoFiniquito_Ins @ProductoId, @SolicitudID, @TipoDesembolsoID, @UsuarioId, @PersonaRegistroID, @CajaID";

                var res = await ConexionDB.database.QueryAsync<DesembolsoFiniquitoRes>(Stored, parData).FirstOrDefaultAsync();

                var Solicitud = await ConexionDB.database.QueryAsync<DesembolsosFiniquitos_VW>("WHERE (Id = @0)", parData.SolicitudID).FirstOrDefaultAsync();
                
                var response = new
                {
                    res = res.regresa,
                    msj = res.msj,
                    Data = Solicitud
                };

                await ConexionDB.Destroy();

                return Ok(response);

            }
            catch (Exception ex)
            {
                await ConexionDB.Destroy();
                return BadRequest(ex.Message);
            }

        }
    }
}
