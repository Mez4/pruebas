using DBContext.DBConfia;
using DBContext.DBConfia.Custom.Tesoreria;
using DBContext.DBConfia.Seguridad;
using DBContext.DBConfia.Tesoreria;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.Tesoreria
{
    [Authorize]
    [ApiController]
    [Route("api/tesoreria/[controller]")]
    public class TraspasoCajaBovedaController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public TraspasoCajaBovedaController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Tesoreria.TraspasoCajaBoveda.Add parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                if (!UsuarioActual.MasterUser)
                {
                    var mensaje = new
                    {
                        message = "El usuario no cuenta con permisos para realizar esta acción"
                    };

                    return BadRequest(mensaje);
                }
                var reqData = new
                {
                    OrigenBovedaID = parData.BovedaID,
                    DestinoCajaID = parData.CajaID,
                    UsuarioID = UsuarioActual.UsuarioID,
                    ObservacionesUsuario = parData.Observaciones,
                    Importe = parData.Importe,
                    Accion = parData.Accion,
                };
                var saldoBoveda = await DBContext.database.QueryAsync<SaldoBovedaW>("EXEC Tesoreria.TraspasoDesdeBoveda @OrigenBovedaID"
                                      + " ,@DestinoCajaID"
                                      + " ,@UsuarioID"
                                      + " ,@ObservacionesUsuario"
                                      + " ,@Importe"
                                      + " ,@Accion"
                                      , reqData).ToArrayAsync();
                await DBContext.Destroy();
                return Ok(new
                {
                    resultCode = 1,
                    message = "Traspaso realizado correctamente",
                    data = saldoBoveda
                });
            }
            catch (System.Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(new
                {
                    resultCode = -1,
                    message = ex.Message,
                });

            }

        }

    }
}