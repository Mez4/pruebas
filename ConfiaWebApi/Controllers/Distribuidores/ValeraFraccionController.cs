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
    public class ValeraFraccionController : ControllerBase
    {
        private DBConfiaContext DBContext;
        public ValeraFraccionController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Distribuidores.ValeraFraccion.Get parData)
        {
            if (parData.id != 0)
            {
                var res = await DBContext.database.SingleByIdAsync<ValerasFraccion>(parData.id);
                await DBContext.Destroy();
                return Ok(res);
            }
            var res1 = await DBContext.database.FetchAsync<ValerasFraccion>();
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Distribuidores.ValeraFraccion.Add parData)
        {
            try
            {
                var fraccion = new ValerasFraccion() { Fraccion = parData.Fraccion };
                await DBContext.database.InsertAsync<ValerasFraccion>(fraccion);
                await DBContext.Destroy();
                return Ok(fraccion);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Distribuidores.ValeraFraccion.Update parData)
        {
            try
            {
                var fraccion = await DBContext.database.SingleByIdAsync<ValerasFraccion>(parData.ValerasFraccionID);
                fraccion.Fraccion = parData.Fraccion;
                await DBContext.database.UpdateAsync(fraccion);
                await DBContext.Destroy();
                return Ok(fraccion);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }
    }
}
