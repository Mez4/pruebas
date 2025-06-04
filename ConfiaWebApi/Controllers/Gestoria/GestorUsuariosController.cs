using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Sistema;
using DBContext.DBConfia.Seguridad;
using DBContext.DBConfia.Gestoria;
using ConfiaWebApi.ModlesSP.Responsables;

namespace ConfiaWebApi.Controllers.Gestoria
{
    [Authorize]
    [ApiController]
    [Route("api/Gestoria/[controller]")]
    public class GestorUsuariosController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public GestorUsuariosController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpGet]
        [Route("getUsuarios")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetUsuaris()
        {
            try
            {
                var res = await DBContext.database.FetchAsync<Usuarios>("WHERE Bloqueado=0");
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> VincularUsuarioGestor(ConfiaWebApi.PeticionesRest.Gestoria.GestorUsuario.Add parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                
                var gestor = await DBContext.database.QueryAsync<GestorUsuarios>("WHERE UsuarioID=@0 AND Estatus = 1", parData.UsuarioID).SingleOrDefaultAsync();

                if (gestor == null)
                {
                    var res = new GestorUsuarios
                    {
                        UsuarioID = parData.UsuarioID,
                        GestorID = parData.ResponsableId,
                        UsuarioCreoID = UsuarioActual.UsuarioID,
                        FechaCreacion = DateTime.Now,
                        Estatus = true,
                        TipoUsuarioID = parData.TipoUsuarioID
                    };
                    await DBContext.database.InsertAsync(res);

                    // var grupoGestorRes = new {
                    //     ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString()),
                    //     UsuarioID = parData.UsuarioID
                    // };

                    // await DBContext.database.QueryAsync<dynamic>("EXEC Gestoria.pa_CreaGrupoGestor @ProductoID, @UsuarioID", grupoGestorRes).FirstOrDefaultAsync();
                    
                    await DBContext.Destroy();
                    return Ok(res);
                  
                }
                else
                {
                    
                        gestor.GestorID = parData.ResponsableId;
                        gestor.UsuarioModificoID = UsuarioActual.UsuarioID;
                        gestor.FechaModificacion = DateTime.Now;
                        gestor.TipoUsuarioID = parData.TipoUsuarioID;
                    
                    await DBContext.database.UpdateAsync(gestor);

                    await DBContext.Destroy();
                    return Ok(gestor);
                }
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }


        [HttpGet]
        [Route("getResponsables")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetResponsablesActivos()
        {
            try
            {
                var res = await DBContext.database.QueryAsync<ResponsablesActivos>("EXEC Gestoria.sp_getResponsablesActivos").ToArrayAsync();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpGet]
        [Route("getResponsables/{NombreRes}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetResponsables(string NombreRes)
        {
            try
            {
                var res = (await DBContext.database.QueryAsync<Responsables>("EXEC Gestoria.sp_getResponsablesSinUsuario @0", NombreRes).ToArrayAsync()).Select(x => new { x.ResponsableId, x.ResponsableNombre }).ToArray(); ;
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("reporte1549_2")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Reporte1549_2(ConfiaWebApi.PeticionesRest.Creditos.Reportes.Reporte1549_2 parData)
        {
            parData.FechaVencimiento = parData.FechaVencimiento.AddHours(-6);
            DateTime fechaVencimientoValidar = parData.FechaVencimiento;
            int day = fechaVencimientoValidar.Day;

            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            DBContext.database.CommandTimeout = 9999;
            try
            {
                var obj = new
                {
                    parData.FechaVencimiento,
                    UsuarioActual.UsuarioID
                };
                if (day == 5)
                {
                    var stored = "EXEC Gestoria.Distribucion_pago_por_vencimiento_2_1549 @FechaVencimiento, @UsuarioID";
                    var res = await DBContext.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.Reporte1549_RespuestaQuincena1>(stored, obj).ToArrayAsync();
                    await DBContext.Destroy();
                    return Ok(res);
                }
                else
                {
                    var stored = "EXEC Gestoria.Distribucion_pago_por_vencimiento_2_1549 @FechaVencimiento, @UsuarioID";
                    var res = await DBContext.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.Reporte1549_RespuestaQuincena2>(stored, obj).ToArrayAsync();
                    await DBContext.Destroy();
                    return Ok(res);
                }
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("getTipos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getTipos()
        {
            
            var res = await DBContext.database.FetchAsync<TiposUsuario>();
            
            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpGet]
        [Route("Get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get()
        {
            try
            {
                // Obtenemos los usuarios
                var resultado = await DBContext.database.FetchAsync<DBContext.DBConfia.Seguridad.Usuarios>();

                // Cerramos las conexiones
                await this.DBContext.Destroy();

                // Regresamos los usuarios
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return BadRequest("Error al obtener los usuarios: " + ex.Message);
            }
        }

    }
}
