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
    public class ValeraEstatusController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public ValeraEstatusController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Distribuidores.ValeraEstatus.Get parData)
        {
            if (parData.id != 0)
            {
                var res = await DBContext.database.SingleByIdAsync<ValerasEstatus>(parData.id);
                await DBContext.Destroy();
                return Ok(res);
            }
            var res1 = await DBContext.database.FetchAsync<ValerasEstatus>();
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Distribuidores.ValeraEstatus.Add parData)
        {
            try
            {
                var ValeraStatus = new ValerasEstatus()
                {
                    ValeraEstatusID = parData.ValeraEstatusID,
                    ValeraEstatus = parData.ValeraEstatus,
                    PuedeCanjear = parData.PuedeCanjear,
                    AsignaUsuario = parData.AsignaUsuario, 
                    Orden = parData.Orden
                };
                await DBContext.database.InsertAsync<ValerasEstatus>(ValeraStatus);
                await DBContext.Destroy();
                return Ok(ValeraStatus);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Distribuidores.ValeraEstatus.Update parData)
        {
            try
            {
                var ValeraStatus = await DBContext.database.SingleByIdAsync<ValerasEstatus>(parData.ValeraEstatusID);
                ValeraStatus.ValeraEstatusID = parData.ValeraEstatusID;
                ValeraStatus.ValeraEstatus = parData.ValeraEstatus;
                ValeraStatus.PuedeCanjear = parData.PuedeCanjear;
                ValeraStatus.AsignaUsuario = parData.AsignaUsuario;
                ValeraStatus.Orden = parData.Orden;
                await DBContext.database.UpdateAsync(ValeraStatus);
                await DBContext.Destroy();
                return Ok(ValeraStatus);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }
    }
}
