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
using DBContext.DBConfia.Seguridad;

namespace ConfiaWebApi.Controllers.Creditos
{
    [Authorize]
    [ApiController]
    [Route("api/Creditos/[controller]")]
    public class ComisionDetalleController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public ComisionDetalleController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.Creditos.ComisionDetalle.Get parData)
        {
            try
            {
                var ComisionesDetalle = await DBContext.database.FetchAsync<ComisionesDetalle_VW3>("Where ProductoID = @ProductoID AND ComisionesID = @ComisionesID ORDER BY ProductoID, ComisionesID, DistribuidorNivelIDOrigen, DistribuidorNivelID, DiasMin, DiasMax", parData);

                await DBContext.Destroy();
                return Ok(ComisionesDetalle);
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
        public async Task<IActionResult> Add(PeticionesRest.Creditos.ComisionDetalle.Add parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var existComision = await DBContext.database.QueryAsync<ComisionesDetalle>("WHERE ProductoID=@ProductoID AND ComisionesID=@ComisionesID AND DistribuidorNivelID=@DistribuidorNivelID AND DistribuidorNivelIDOrigen=@DistribuidorNivelIDOrigen", parData).ToArrayAsync();
                if (existComision.Length > 0)
                {
                    await DBContext.Destroy();
                    return BadRequest("YA EXISTE UNA LÍNEA DE NIVEL Y NIVEL ORIGEN");
                }
                else
                {

                    var ComisionDetalleLast = await DBContext.database.QueryAsync<ComisionesDetalle>("Where ProductoID = @ProductoID AND ComisionesID = @ComisionesID ORDER BY RenglonId DESC", parData).FirstOrDefaultAsync();

                    int RenglonId;

                    try
                    {
                        RenglonId = ComisionDetalleLast.RenglonId;
                    }
                    catch (Exception)
                    {
                        RenglonId = 0;
                    }

                    var ComisionDetalle = new ComisionesDetalle()
                    {
                        ProductoID = parData.ProductoID,
                        ComisionesID = parData.ComisionesID,
                        RenglonId = RenglonId + 1,
                        DistribuidorNivelID = parData.DistribuidorNivelID,
                        DistribuidorNivelIDOrigen = parData.DistribuidorNivelIDOrigen,
                        Activo = parData.Activo,
                        DiasMin = parData.DiasMin,
                        DiasMax = parData.DiasMax,
                        PorcComision = parData.PorcComision,
                        PorcComisionReal = parData.PorcComisionReal,
                        porcMonedero = parData.porcMonedero,
                        porcMonederoReal = parData.porcMonederoReal,
                        fhRegitro = DateTime.Now,
                        fhMoficiacion = DateTime.Now,
                        RegistroUsuarioId = UsuarioActual.UsuarioID,
                        PersonaIDRegistro = UsuarioActual.PersonaID

                    };
                    await DBContext.database.InsertAsync(ComisionDetalle);

                    var Producto = await DBContext.database.SingleByIdAsync<Productos>(ComisionDetalle.ProductoID);
                    var Nivel = await DBContext.database.SingleByIdAsync<Niveles>(ComisionDetalle.DistribuidorNivelID);
                    var ComisionesDetalleVW = await DBContext.database.QueryAsync<ComisionesDetalle_VW3>("Where ProductoID = @0 AND ComisionesID = @1 AND RenglonId=@2", parData.ProductoID, parData.ComisionesID, ComisionDetalle.RenglonId).FirstOrDefaultAsync();

                    var res = new
                    {
                        ComisionDetalle.ProductoID,
                        ComisionDetalle.ComisionesID,
                        ComisionDetalle.RenglonId,
                        ComisionDetalle.DistribuidorNivelID,
                        ComisionesDetalleVW.DistribuidorNivelOrigen,
                        ComisionDetalle.Activo,
                        ComisionDetalle.DiasMin,
                        ComisionDetalle.DiasMax,
                        ComisionDetalle.PorcComision,
                        ComisionDetalle.PorcComisionReal,
                        ComisionDetalle.porcMonedero,
                        ComisionDetalle.porcMonederoReal,
                        ComisionDetalle.DistribuidorNivelIDOrigen,
                        fhRegitro = ComisionDetalle.fhRegitro.ToString("dd/MM/yyyy"),
                        fhMoficiacion = ComisionDetalle.fhMoficiacion.ToString("dd/MM/yyyy"),
                        Producto,
                        Nivel,
                        Nivel.DistribuidorNivel
                    };

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
        public async Task<IActionResult> Update(PeticionesRest.Creditos.ComisionDetalle.Update parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var ComisionDetalle = await DBContext.database.SingleByIdAsync<ComisionesDetalle>(new { parData.ProductoID, parData.ComisionesID, parData.RenglonId, parData.DistribuidorNivelID, parData.DistribuidorNivelIDOrigen });

                ComisionDetalle.Activo = parData.Activo;
                ComisionDetalle.DiasMin = parData.DiasMin;
                ComisionDetalle.DiasMax = parData.DiasMax;
                ComisionDetalle.PorcComision = parData.PorcComision;
                ComisionDetalle.PorcComisionReal = parData.PorcComisionReal;
                ComisionDetalle.porcMonedero = parData.porcMonedero;
                ComisionDetalle.porcMonederoReal = parData.porcMonederoReal;
                ComisionDetalle.fhMoficiacion = DateTime.Now;
                ComisionDetalle.ModificaUsuarioId = UsuarioActual.UsuarioID;

                await DBContext.database.UpdateAsync(ComisionDetalle);

                var Producto = await DBContext.database.SingleByIdAsync<Productos>(ComisionDetalle.ProductoID);
                var Nivel = await DBContext.database.SingleByIdAsync<Niveles>(ComisionDetalle.DistribuidorNivelID);
                var ComisionesDetalleVW = await DBContext.database.QueryAsync<ComisionesDetalle_VW3>("Where ProductoID = @0 AND ComisionesID = @1 AND RenglonId=@2", parData.ProductoID, parData.ComisionesID, ComisionDetalle.RenglonId).FirstOrDefaultAsync();

                var res = new
                {
                    ComisionDetalle.ProductoID,
                    ComisionDetalle.ComisionesID,
                    ComisionDetalle.RenglonId,
                    ComisionDetalle.DistribuidorNivelID,
                    ComisionesDetalleVW.DistribuidorNivelOrigen,
                    ComisionDetalle.Activo,
                    ComisionDetalle.DiasMin,
                    ComisionDetalle.DiasMax,
                    ComisionDetalle.PorcComision,
                    ComisionDetalle.PorcComisionReal,
                    ComisionDetalle.porcMonedero,
                    ComisionDetalle.porcMonederoReal,
                    ComisionDetalle.DistribuidorNivelIDOrigen,
                    fhRegitro = ComisionDetalle.fhRegitro.ToString("dd/MM/yyyy"),
                    fhMoficiacion = ComisionDetalle.fhMoficiacion.ToString("dd/MM/yyyy"),
                    Producto,
                    Nivel,
                    Nivel.DistribuidorNivel
                };

                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();

                return BadRequest(ex.Message);
            }
        }
    }
}
