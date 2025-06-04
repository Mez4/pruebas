using DBContext.DBConfia;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DBContext.DBConfia.Pagos;
using DBContext.DBConfia.dbo;

namespace ConfiaWebApi.Controllers.Pagos
{
    [Authorize]
    [ApiController]
    [Route("api/Pagos/[controller]")]
    public class CodigosAutorizacionController : ControllerBase
    {
        private DBConfiaContext ConexionBD;

        public CodigosAutorizacionController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> Get(PeticionesRest.Pagos.CodigoAutorizacion.Get parData)
        {
            if (parData.Id != 0)
            {
                try
                {
                    var resS = await ConexionBD.database.SingleByIdAsync<CodigosAutorizacion_VW>(parData.Id);
                    await ConexionBD.Destroy();
                    return Ok(resS);
                }
                catch (Exception ex)
                {
                    await ConexionBD.Destroy();
                    return NotFound(ex.Message);
                }

            }
            var res = await ConexionBD.database.FetchAsync<CodigosAutorizacion_VW>();
            await ConexionBD.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> Add(PeticionesRest.Pagos.CodigoAutorizacion.Add parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            // var UsuarioActual = await DBContext.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
            //var PersonaActual = await DBContext.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.ID).FirstOrDefaultAsync();

            var codigo = await ConexionBD.database.QueryAsync<string>("select ([Pagos].[CodigoVerificacion]([Pagos].[CodigoVerificacionBase](getdate()),(36)))").FirstOrDefaultAsync();

            try
            {
                var CodigosAutorizacion = new CodigosAutorizacion()
                {
                    AutorizacionTipoID = parData.AutorizacionTipoID,
                    FHGeneracion = DateTime.Now,
                    Fecha = parData.Fecha,
                    UsuarioIDUtiliza = parData.UsuarioIDUtiliza,
                    Referencia = parData.Referencia,
                    Observaciones = parData.Observaciones,
                    USUGenera = UsuarioActual.UsuarioID,
                    CODIGO = codigo
                };
                await ConexionBD.database.InsertAsync(CodigosAutorizacion);
                //return Ok(CodigosAutorizacion);
                var res = await ConexionBD.database.QueryAsync<CodigosAutorizacion_VW>("WHERE (CodigoAutorizacionID = @0)", CodigosAutorizacion.CodigoAutorizacionID).FirstOrDefaultAsync();
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
        [Route("cancel")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> Update(PeticionesRest.Pagos.CodigoAutorizacion.Cancel parData)
        {
            try
            {
                var CodigosAutorizacion = await ConexionBD.database.SingleByIdAsync<CodigosAutorizacion>(parData.CodigoAutorizacionID);
                CodigosAutorizacion.Cancelado = true;
                await ConexionBD.database.UpdateAsync(CodigosAutorizacion);
                //return Ok(CodigosAutorizacion);
                var code = await ConexionBD.database.QueryAsync<CodigosAutorizacion_VW>("WHERE (CodigoAutorizacionID = @0)", CodigosAutorizacion.CodigoAutorizacionID).FirstOrDefaultAsync();
                var res = new
                {
                    res = 1,
                    msj = "Se cancelo el código con el Id: " + code.CodigoAutorizacionID.ToString(),
                    Data = code
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

    }
}
