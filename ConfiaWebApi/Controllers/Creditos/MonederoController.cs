using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;

namespace ConfiaWebApi.Controllers.Creditos
{
    [Authorize]
    [ApiController]
    [Route("api/Creditos/[controller]")]
    public class MonederoController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public MonederoController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("addMecanicas")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> addMecanicas(PeticionesRest.Creditos.Monedero.Get parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var mecanica = new MecanicasMonedero()
                {
                    Descripcion = parData.Descripcion,
                    MontoBase = parData.MontoBase,
                    MontoRecompensa = parData.MontoRecompensa,
                    FechaInicio = parData.FechaInicio,
                    FechaFin = parData.FechaFin,
                    UsuarioIDRegistro = UsuarioActual.UsuarioID,
                    FechaRegistro = DateTime.Now,
                    UsuarioModificacion = UsuarioActual.UsuarioID,
                    FechaModificacion = DateTime.Now
                };

                await DBContext.database.InsertAsync(mecanica);
                await DBContext.Destroy();

                return Ok(mecanica);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("getMecanicas")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getMecanicas(PeticionesRest.Creditos.Monedero.Get parData)
        {
            try
            {
                var mecanica = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.MecanicasMonedero>().ToArray();

                await DBContext.Destroy();
                return Ok(mecanica);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("getMecanicasActivas")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getMecanicasActivas(PeticionesRest.Creditos.Monedero.Get parData)
        {
            try
            {
                var mecanica = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.MecanicasMonedero>("WHERE FechaFin > CONVERT(DATE,getdate())").ToArrayAsync();

                await DBContext.Destroy();
                return Ok(mecanica);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("editarMecanicasActivas")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> editarMecanicasActivas(PeticionesRest.Creditos.Monedero.Get parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var mecanica = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.MecanicasMonedero>("WHERE MecanicaID = @0", parData.MecanicaID).FirstOrDefaultAsync();

                mecanica.Descripcion = parData.Descripcion;
                mecanica.FechaInicio = parData.FechaInicio;
                mecanica.FechaFin = parData.FechaFin;
                mecanica.MontoBase = parData.MontoBase;
                mecanica.MontoRecompensa = parData.MontoRecompensa;
                mecanica.FechaModificacion = DateTime.Now;
                mecanica.UsuarioModificacion = UsuarioActual.UsuarioID;

                await DBContext.database.UpdateAsync(mecanica);
                await DBContext.Destroy();
                return Ok(mecanica);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("asignarMecanica")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> asignarMecanica(PeticionesRest.Creditos.Monedero.GetMecanicaAsignada parData)
        {
            try
            {
                var newMecanica = new MecanicasZonas()
                {
                    ZonaID = parData.ZonaID,
                    MecanicaID = parData.MecanicaID,
                    ProductoID = parData.ProductoID,
                    DistribuidorNivelID = parData.DistribuidorNivelID
                };

                var mecanicas = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.MecanicasZonas>("WHERE ZonaID = @ZonaID AND MecanicaID = @MecanicaID AND ProductoID = @ProductoID AND DistribuidorNivelID = @DistribuidorNivelID", parData).ToArrayAsync();
                if (mecanicas.Length != 0) return Ok(new { code = 204, msg = "Ya esta dada de alta esa dinamica" });

                await DBContext.database.InsertAsync(newMecanica);

                await DBContext.Destroy();
                return Ok();
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("editarMecanica")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> editarMecanica(PeticionesRest.Creditos.Monedero.GetMecanicaAsignada parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var newMecanica = new MecanicasZonas()
                {
                    ZonaID = parData.ZonaID,
                    MecanicaID = parData.MecanicaID,
                    ProductoID = parData.ProductoID,
                    DistribuidorNivelID = parData.DistribuidorNivelID
                };

                var mecanicas = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.MecanicasZonas>("WHERE ZonaID = @ZonaID AND MecanicaID = @MecanicaID AND ProductoID = @ProductoID AND DistribuidorNivelID = @DistribuidorNivelID", parData).ToArrayAsync();
                if (mecanicas.Length != 0) return Ok(new { code = 204, msg = "Ya esta dada de alta esa dinamica" });

                var mecanicaEditar = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.MecanicasZonas>("WHERE ID = @0", parData.ID).FirstOrDefaultAsync();

                mecanicaEditar.DistribuidorNivelID = parData.DistribuidorNivelID;
                mecanicaEditar.MecanicaID = parData.MecanicaID;
                mecanicaEditar.ZonaID = parData.ZonaID;

                await DBContext.database.UpdateAsync(mecanicaEditar);
                await DBContext.Destroy();
                return Ok(mecanicaEditar);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("getMecanicasAsignadas")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getMecanicasAsignadas(PeticionesRest.Creditos.Monedero.GetMecanicaAsignada parData)
        {
            try
            {
                var mecanica = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.MecanicasMonedero_VW>("WHERE ProductoID = @0", parData.ProductoID).ToArrayAsync();

                await DBContext.Destroy();
                return Ok(mecanica);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}