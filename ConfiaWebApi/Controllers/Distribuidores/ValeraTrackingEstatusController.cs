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
    public class ValeraTrackingEstatusController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public ValeraTrackingEstatusController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Distribuidores.ValeraTrackingEstatus.Get parData)
        {
            if (parData.id != 0)
            {
                var res = await DBContext.database.SingleByIdAsync<ValeraTrackingEstatus>(parData.id);
                await DBContext.Destroy();
                return Ok(res);
            }
            var res1 = await DBContext.database.FetchAsync<ValeraTrackingEstatus>();
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Distribuidores.ValeraTrackingEstatus.Add parData)
        {
            try
            {
                var trackingEstatus = new ValeraTrackingEstatus() { TrackingEstatus = parData.TrackingEstatus, Color = parData.Color, Descripcion = parData.Descripcion };
                await DBContext.database.InsertAsync<ValeraTrackingEstatus>(trackingEstatus);
                await DBContext.Destroy();
                return Ok(trackingEstatus);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Distribuidores.ValeraTrackingEstatus.Update parData)
        {
            try
            {
                var trackingEstatus = await DBContext.database.SingleByIdAsync<ValeraTrackingEstatus>(parData.ValeraTrackingEstatusID);
                trackingEstatus.TrackingEstatus = parData.TrackingEstatus;
                trackingEstatus.Color = parData.Color;
                trackingEstatus.Descripcion = parData.Descripcion;
                await DBContext.database.UpdateAsync(trackingEstatus);
                await DBContext.Destroy();
                return Ok(trackingEstatus);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }
    }
}
