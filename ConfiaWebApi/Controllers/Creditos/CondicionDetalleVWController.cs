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

namespace ConfiaWebApi.Controllers.Creditos
{
    [Authorize]
    [ApiController]
    [Route("api/Creditos/[controller]")]
    public class CondicionDetalleVWController : ControllerBase
    {
        private DBConfiaContext DBContext;
        public CondicionDetalleVWController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.Creditos.CondicionDetalleVW.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {

            try
            {
                parData.ProductoID = producto;

                var res = await DBContext.database.FetchAsync<CondicionesDetalle_VW>(@"SELECT ProductoID, CondicionesID, Descripcion, SucursalId, DistribuidorNivelId,DistribuidorNivelOrigenID, MIN(PlazosMinimos) AS PlazosMinimos, MAX(PlazosMaximos) AS PlazosMaximos, MIN(ImporteMinimo) AS ImporteMinimo, MAX(ImporteMaximo) AS ImporteMaximo,
                                                                                            MIN(ImporteMaximo1erCanje) AS ImporteMaximo1erCanje, MAX(ImporteMaximo2doCanje) AS ImporteMaximo2doCanje, PorcTasaPlazo, SeguroPlazo, PorcIVA, Cargo, ManejoCuenta, PlazosFijos, PorcTasaMensual, PorcTasaAnual,
                                                                                            MIN(PagoXMilMinimo) AS PagoXMilMinimo, MAX(PagoXMilMaximo) AS PagoXMilMaximo, PlazosEspeciales, DistribuidorID, DistribuidorNivel, MAX(CapitalCorte) AS CapitalCorte
                                                                                        FROM     Creditos.CondicionesDetalle_VW
                                                                                        Where ProductoID = @ProductoID AND SucursalId = @SucursalId AND (DistribuidorID = @DistribuidorID OR @DistribuidorID = 0)
                                                                                        GROUP BY ProductoID, CondicionesID, Descripcion, SucursalId, DistribuidorNivelId,DistribuidorNivelOrigenID, PorcTasaPlazo, SeguroPlazo, PorcIVA, Cargo, ManejoCuenta, PlazosFijos, PorcTasaMensual, PorcTasaAnual, PlazosEspeciales, DistribuidorID, DistribuidorNivel
                                                                                        ORDER BY PlazosMinimos, PlazosMaximos,ImporteMinimo,ImporteMaximo", parData);

                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("getbyprod")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetbyProd(PeticionesRest.Creditos.CondicionDetalleVW.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {

            try
            {
                //parData.ProductoID = producto;

                var res = await DBContext.database.FetchAsync<CondicionesDetalle_VW>(@"SELECT ProductoID, CondicionesID, Descripcion, SucursalId, DistribuidorNivelId,DistribuidorNivelOrigenID, MIN(PlazosMinimos) AS PlazosMinimos, MAX(PlazosMaximos) AS PlazosMaximos, MIN(ImporteMinimo) AS ImporteMinimo, MAX(ImporteMaximo) AS ImporteMaximo,
                                                                                            MIN(ImporteMaximo1erCanje) AS ImporteMaximo1erCanje, MAX(ImporteMaximo2doCanje) AS ImporteMaximo2doCanje, PorcTasaPlazo, SeguroPlazo, PorcIVA, Cargo, ManejoCuenta, PlazosFijos, PorcTasaMensual, PorcTasaAnual,
                                                                                            MIN(PagoXMilMinimo) AS PagoXMilMinimo, MAX(PagoXMilMaximo) AS PagoXMilMaximo, PlazosEspeciales, DistribuidorID, DistribuidorNivel, MAX(CapitalCorte) AS CapitalCorte
                                                                                        FROM     Creditos.CondicionesDetalle_VW
                                                                                        Where ProductoID = @ProductoID AND SucursalId = @SucursalId AND (@DistribuidorID = 0)
                                                                                        GROUP BY ProductoID, CondicionesID, Descripcion, SucursalId, DistribuidorNivelId,DistribuidorNivelOrigenID, PorcTasaPlazo, SeguroPlazo, PorcIVA, Cargo, ManejoCuenta, PlazosFijos, PorcTasaMensual, PorcTasaAnual, PlazosEspeciales, DistribuidorID, DistribuidorNivel
                                                                                        ORDER BY PlazosMinimos, PlazosMaximos", parData);

                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("getAdmin")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetAdmin(PeticionesRest.Creditos.CondicionDetalleVW.Get parData)
        {
            try
            {
                var res = await DBContext.database.FetchAsync<CondicionesDetalle_VW>(@"SELECT ProductoID, CondicionesID, Descripcion, SucursalId, DistribuidorNivelId,DistribuidorNivelOrigenID, MIN(PlazosMinimos) AS PlazosMinimos, MAX(PlazosMaximos) AS PlazosMaximos, MIN(ImporteMinimo) AS ImporteMinimo, MAX(ImporteMaximo) AS ImporteMaximo,
                                                                                        MIN(ImporteMaximo1erCanje) AS ImporteMaximo1erCanje, MAX(ImporteMaximo2doCanje) AS ImporteMaximo2doCanje, PorcTasaPlazo, SeguroPlazo, PorcIVA, Cargo, ManejoCuenta, PlazosFijos, PorcTasaMensual, PorcTasaAnual,
                                                                                        MIN(PagoXMilMinimo) AS PagoXMilMinimo, MAX(PagoXMilMaximo) AS PagoXMilMaximo, PlazosEspeciales, DistribuidorID, DistribuidorNivel, MAX(CapitalCorte) AS CapitalCorte
                                                                                        FROM     Creditos.CondicionesDetalle_VW
                                                                                        Where ProductoID = @ProductoID AND SucursalId = @SucursalId AND (DistribuidorID = @DistribuidorID OR @DistribuidorID = 0)
                                                                                        GROUP BY ProductoID, CondicionesID, Descripcion, SucursalId, DistribuidorNivelId,DistribuidorNivelOrigenID, PorcTasaPlazo, SeguroPlazo, PorcIVA, Cargo, ManejoCuenta, PlazosFijos, PorcTasaMensual, PorcTasaAnual, PlazosEspeciales, DistribuidorID, DistribuidorNivel", parData);

                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("getAdminProd")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetAdminProd(PeticionesRest.Creditos.CondicionDetalleVW.Get parData)
        {
            try
            {
                var res = await DBContext.database.FetchAsync<CondicionesDetalle_VW>(@"SELECT ProductoID, CondicionesID, Descripcion, SucursalId, DistribuidorNivelId,DistribuidorNivelOrigenID, MIN(PlazosMinimos) AS PlazosMinimos, MAX(PlazosMaximos) AS PlazosMaximos, MIN(ImporteMinimo) AS ImporteMinimo, MAX(ImporteMaximo) AS ImporteMaximo,
                                                                                            MIN(ImporteMaximo1erCanje) AS ImporteMaximo1erCanje, MAX(ImporteMaximo2doCanje) AS ImporteMaximo2doCanje, PorcTasaPlazo, SeguroPlazo, PorcIVA, Cargo, ManejoCuenta, PlazosFijos, PorcTasaMensual, PorcTasaAnual,
                                                                                            MIN(PagoXMilMinimo) AS PagoXMilMinimo, MAX(PagoXMilMaximo) AS PagoXMilMaximo, PlazosEspeciales, DistribuidorID, DistribuidorNivel, MAX(CapitalCorte) AS CapitalCorte
                                                                                        FROM     Creditos.CondicionesDetalle_VW
                                                                                        Where ProductoID = @ProductoID AND SucursalId = @SucursalId AND (DistribuidorID = @DistribuidorID OR @DistribuidorID = 0)
                                                                                        GROUP BY ProductoID, CondicionesID, Descripcion, SucursalId, DistribuidorNivelId,DistribuidorNivelOrigenID, PorcTasaPlazo, SeguroPlazo, PorcIVA, Cargo, ManejoCuenta, PlazosFijos, PorcTasaMensual, PorcTasaAnual, PlazosEspeciales, DistribuidorID, DistribuidorNivel", parData);

                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}