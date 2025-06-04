using ConfiaWebApi.ModlesSP.Distribuidores;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.dbo;
using DBContext.DBConfia.Distribuidores;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.Distribuidores
{
    [Authorize]
    [ApiController]
    [Route("api/Distribuidores/[controller]")]
    public class ValeraDetalleController : ControllerBase
    {
        private DBConfiaContext ConexionBD;

        public ValeraDetalleController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        [HttpPost]
        [Route("getFoliosByValera")]
        [Authorize]
        [Code.TProteccionAdmin]
        // [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> getFoliosByValera(PeticionesRest.Distribuidores.ValeraDetalle.getFoliosByValera parData)
        {
            try
            {
                var res = await ConexionBD.database.FetchAsync<ValeraDetalle>("WHERE ValeraID = @ValeraId", parData);
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }

        }

        [HttpPost]
        [Route("getfoliosvalera")]
        [Authorize]
        [Code.TProteccionProducto]
        // [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> getFoliosValera(PeticionesRest.Distribuidores.ValeraDetalle.getFoliosByValera parData)
        {
            try
            {
                var res = await ConexionBD.database.FetchAsync<ValeraDetalle>("WHERE ValeraID = @ValeraId", parData);
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }

        }

        [HttpPost]
        [Route("cancelFolio")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> cancelFolio(PeticionesRest.Distribuidores.ValeraDetalle.cancelFolio parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                // var UsuarioActual = await DBContext.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();

                var obj = new { usuario = UsuarioActual.UsuarioID, valeraID = parData.ValeraId, Folio = parData.Folio, evento = 1 };
                var res = await ConexionBD.database.QueryAsync<ValeraDetalleAccion>("EXEC Distribuidores.pa_Valera_Detalle_Accion @usuario, @valeraID, @Folio, @evento", obj).FirstOrDefaultAsync();

                var Vale = new ValeraDetalle()
                {
                    ValeraID = res.ValeraID,
                    Folio = res.Folio,
                    Estatus = res.Estatus,
                };
                await ConexionBD.Destroy();
                if (res.regresa == 1)
                    return Ok(Vale);
                else
                    return BadRequest(res.msj);

            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        [Route("getProducto")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.Creditos.Producto.Get parData)
        {
            if (parData.ProductoID != 0)
            {
                try
                {
                    var res = await ConexionBD.database.SingleByIdAsync<ProductosVW>(parData.ProductoID);
                    await ConexionBD.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await ConexionBD.Destroy();
                    return NotFound(ex.Message);
                }

            }
            else
            {
                try
                {
                    int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
                    var Productos = await ConexionBD.database.QueryAsync<ProductosVW>("WHERE ProductoID = @0", ProductoID).ToArrayAsync();
                    await ConexionBD.Destroy();

                    return Ok(Productos);
                }
                catch (Exception ex)
                {
                    await ConexionBD.Destroy();
                    return NotFound(ex.Message);
                }
            }
        }

        [HttpPost]
        [Route("getvale")]
        [Authorize]
        [Code.TProteccionProducto]
        // [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> getVale(PeticionesRest.Distribuidores.ValeraDetalle.getVale parData)
        {
            try
            {
                var res = await ConexionBD.database.QueryAsync<ValeraDetalle_VW>("WHERE serieId = @SerieId AND (Folio = @ValeCanje)", parData).SingleOrDefaultAsync();
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }

        }
    }
}
