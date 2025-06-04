using DBContext.DBConfia;
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
    [Route("api/Distribuidor/[controller]")]
    public class ValeraSeriesController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public ValeraSeriesController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        protected async Task<object> ObjectSerie(ValeraSeries serie)
        {
            var res = new
            {
                serie.serieId,
                serie.serie,
                serie.serieDesc,
                serie.activo,
                producto = (await serie.CH__PRODUCTO(DBContext)).FirstOrDefault(),
                tipo = (await serie.CH__TIPO(DBContext)).FirstOrDefault(),
            };
            return res;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Distribuidores.ValeraSeries.get parData)
        {
            if (parData.id != 0)
            {
                var serie = await DBContext.database.SingleByIdAsync<ValeraSeries>(parData.id);
                var res = await ObjectSerie(serie);
                await DBContext.Destroy();
                return Ok(res);
            }

            List<object> respList = new List<object>();
            int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
            var ListSeries = await DBContext.database.QueryAsync<ValeraSeries>("WHERE ProductoID = @0", ProductoID).ToArrayAsync();
            foreach (var item in ListSeries)
            {
                respList.Add(await ObjectSerie(item));
            }
            await DBContext.Destroy();
            return Ok(respList);
        }

        [HttpPost]
        [Route("getByProduct")]
        [Authorize]
        [Code.TProteccionProducto]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> GetByProduct(ConfiaWebApi.PeticionesRest.Distribuidores.ValeraSeries.get parData)
        {
            try
            {
                List<object> respList = new List<object>();
                var ListSeries = await DBContext.database.FetchAsync<ValeraSeries>("WHERE  (ProductoID = @id)", parData);
                foreach (var item in ListSeries)
                {
                    respList.Add(await ObjectSerie(item));
                }
                return Ok(respList);
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
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Distribuidores.ValeraSeries.Add parData)
        {
            try
            {
                var valeraSerie = new ValeraSeries()
                {
                    serie = parData.serie,
                    serieDesc = parData.serieDesc,
                    activo = parData.activo,
                    ProductoID = parData.ProductoID,
                    ValeraSeriesTiposID = parData.ValeraSeriesTiposID,
                };
                await DBContext.database.InsertAsync<ValeraSeries>(valeraSerie);
                var res = await ObjectSerie(valeraSerie);
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("update")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Distribuidores.ValeraSeries.Update parData)
        {
            try
            {
                var valeraSerie = await DBContext.database.SingleByIdAsync<ValeraSeries>(parData.serieId);
                valeraSerie.serie = parData.serie;
                valeraSerie.serieDesc = parData.serieDesc;
                valeraSerie.activo = parData.activo;
                valeraSerie.ProductoID = parData.ProductoID;
                valeraSerie.ValeraSeriesTiposID = parData.ValeraSeriesTiposID;
                await DBContext.database.UpdateAsync(valeraSerie);
                var res = await ObjectSerie(valeraSerie);
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }
    }
}
