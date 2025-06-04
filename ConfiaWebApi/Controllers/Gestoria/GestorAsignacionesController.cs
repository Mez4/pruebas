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
    public class GestorAsignacionesController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public GestorAsignacionesController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        

        [HttpGet]
        [Route("GetZonales")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetZonales()
        {
            try
            {
                var obj = new {
                    RegionalDetalleID = 0
                } ;
                var resultado = await DBContext.database.FetchAsync<dynamic>("EXEC Gestoria.pa_UsuariosZonales @RegionalDetalleID", obj);

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

        [HttpPost]
        [Route("getResponsables")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetResponsables(ConfiaWebApi.PeticionesRest.Gestoria.Asignaciones.responsables parData)
        {
            try
            {
                if(parData.Zonal == true)
                {
                    var res = (await DBContext.database.QueryAsync<Responsables>("EXEC Gestoria.pa_GetRegionales @0", parData.Nombre).ToArrayAsync()).Select(x => new { x.ResponsableId, x.ResponsableNombre }).ToArray(); ;
                    await DBContext.Destroy();
                    return Ok(res);
                }
                else
                {
                    var res = (await DBContext.database.QueryAsync<Responsables>("EXEC Gestoria.pa_GetZonales @0", parData.Nombre).ToArrayAsync()).Select(x => new { x.ResponsableId, x.ResponsableNombre }).ToArray(); ;
                    await DBContext.Destroy();
                    return Ok(res);
                }
                
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
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Gestoria.Asignaciones.Add parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                
                if(parData.Zonal == true)
                { 
                    var Codigo = new RegionalDetalle() { 
                        RegionalID = parData.ResponsableId,
                        ZonalID = parData.ZonalID ?? 0,
                        Estatus = true,
                        UsuarioIDAsigna = UsuarioActual.UsuarioID,
                        PersonaIDAsigna = UsuarioActual.PersonaID,
                        FechaHoraAsigna = DateTime.Now
                    };
                    await DBContext.database.InsertAsync(Codigo);

                    var obj = new
                    {
                        RegionalDetalleID = Codigo.RegionalDetalleID
                    };
                    var res = await DBContext.database.QueryAsync<dynamic>("EXEC Gestoria.pa_UsuariosZonales @RegionalDetalleID", obj).FirstOrDefaultAsync();
                    await DBContext.Destroy();
                    return Ok(res);
                }
                else
                {
                    var Codigo = new ZonalDetalle() { 
                        ZonalID = parData.ResponsableId,
                        GestorID = parData.GestorID ?? 0,
                        Estatus = true,
                        UsuarioIDAsigna = UsuarioActual.UsuarioID,
                        PersonaIDAsigna = UsuarioActual.PersonaID,
                        FechaHoraAsigna = DateTime.Now
                    };
                    await DBContext.database.InsertAsync(Codigo);

                    var obj = new
                    {
                        ZonalDetalleID = Codigo.ZonalDetalleID
                    };
                    var res = await DBContext.database.QueryAsync<dynamic>("EXEC Gestoria.pa_UsuariosGestores @ZonalDetalleID", obj).FirstOrDefaultAsync();
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
        [Route("update")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Gestoria.Asignaciones.Add parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                
                if(parData.Zonal == true)
                {
                    var Codigo = await DBContext.database.SingleByIdAsync<RegionalDetalle>(parData.Id);

                    Codigo.Estatus = false;
                    await DBContext.database.UpdateAsync(Codigo);

                    var rg = new RegionalDetalle() { 
                        RegionalID = parData.ResponsableId,
                        ZonalID = parData.ZonalID ?? 0,
                        Estatus = true,
                        UsuarioIDAsigna = UsuarioActual.UsuarioID,
                        PersonaIDAsigna = UsuarioActual.PersonaID,
                        FechaHoraAsigna = DateTime.Now
                    };
                    await DBContext.database.InsertAsync(rg);
                    
                    var obj = new
                    {
                        RegionalDetalleID = rg.RegionalDetalleID
                    };
                    var res = await DBContext.database.QueryAsync<dynamic>("EXEC Gestoria.pa_UsuariosZonales @RegionalDetalleID", obj).FirstOrDefaultAsync();
                    
                    await DBContext.Destroy();
                    return Ok(res);
                }
                else
                {
                    var Codigo = await DBContext.database.SingleByIdAsync<ZonalDetalle>(parData.Id);

                    Codigo.Estatus = false;
                    await DBContext.database.UpdateAsync(Codigo);

                    var rg = new ZonalDetalle() { 
                        ZonalID = parData.ResponsableId,
                        GestorID = parData.GestorID ?? 0,
                        Estatus = true,
                        UsuarioIDAsigna = UsuarioActual.UsuarioID,
                        PersonaIDAsigna = UsuarioActual.PersonaID,
                        FechaHoraAsigna = DateTime.Now
                    };
                    await DBContext.database.InsertAsync(rg);
                    
                    var obj = new
                    {
                        ZonalDetalleID = rg.ZonalDetalleID
                    };
                    var res = await DBContext.database.QueryAsync<dynamic>("EXEC Gestoria.pa_UsuariosGestores @ZonalDetalleID", obj).FirstOrDefaultAsync();
                    
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


        [HttpGet]
        [Route("GetGestores")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetGestores()
        {
            try
            {
                var obj = new {
                    ZonalDetalleID = 0
                } ;
                var resultado = await DBContext.database.FetchAsync<dynamic>("EXEC Gestoria.pa_UsuariosGestores @ZonalDetalleID", obj);

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
