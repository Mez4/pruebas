using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Distribuidores;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Sistema;
using System.Collections;
using System.Collections.Generic;
using DBContext.DBConfia.Seguridad;
using DBContext.DBConfia.dbo;
using ConfiaWebApi.ModlesSP.Creditos;
using ConfiaWebApi.PeticionesRest.Creditos.AplicaPagos;

namespace ConfiaWebApi.Controllers.Creditos
{
    [Authorize]
    [ApiController]
    [Route("api/Creditos/[controller]")]

    public class AplicacionTicketController : ControllerBase
    {
        private DBConfiaContext ConexionBD;

        public AplicacionTicketController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        [HttpPost]
        [Route("getTicketsUsuarios")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getTicketsUsuarios(GetTicketsUsuarios parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                parData.UsuarioID = UsuarioActual.UsuarioID;

                string query = "EXEC Creditos.pa_GetTicketsPorUsuario @CajaID, @UsuarioID";
                var res = await ConexionBD.database.FetchAsync<TicketsUsuarios>(query, parData);

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
        [Route("getTicketsByUsuario")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getTicketsByUsuario(GetTicketsPorUsuario parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                string query = "EXEC Creditos.pa_GetListaTickets @CajaID, @UsuarioID";
                var res = await ConexionBD.database.FetchAsync<Tickets>(query, parData);

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
        [Route("aplicarTicketsByUsuario")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> aplicarTicketsByUsuario(AplicaTicketsMasivos parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                
                parData.UsuarioId = UsuarioActual.UsuarioID;
                parData.ProductoId = producto;

                string query = "EXEC Creditos.pa_AplicacionTicketsMasivos_Ins @ProductoId, @SucursalId, @CajaID, @FechaPago, @UsuarioId, @CuentaBancoID, @Observacion, @TicketsJSON";
                var res = await ConexionBD.database.FirstAsync<dynamic>(query, parData);

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
}