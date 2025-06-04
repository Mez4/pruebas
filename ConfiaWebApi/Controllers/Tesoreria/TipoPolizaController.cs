using DBContext.DBConfia;
using DBContext.DBConfia.Tesoreria;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.Tesoreria
{
    [Authorize]
    [ApiController]
    [Route("api/Tesoreria/[controller]")]
    public class TipoPolizaController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public TipoPolizaController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Tesoreria.TipoPoliza.Get parData)
        {
            if (parData.id != 0)
            {
                var res = await DBContext.database.SingleByIdAsync<TipoPoliza>(parData.id);
                await DBContext.Destroy();
                return Ok(res);
            }
            var res2 = await DBContext.database.FetchAsync<TipoPoliza>();
            await DBContext.Destroy();
            return Ok(res2);

        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Tesoreria.TipoPoliza.Add parData)
        {
            try
            {
                var PolizaTipo = new TipoPoliza() { Descripcion = parData.Descripcion };
                await DBContext.database.InsertAsync(PolizaTipo);
                await DBContext.Destroy();
                return Ok(PolizaTipo);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Tesoreria.TipoPoliza.Update parData)
        {
            try
            {
                var PolizaTipo = await DBContext.database.SingleByIdAsync<TipoPoliza>(parData.TipoPolizaID);
                PolizaTipo.Descripcion = parData.Descripcion;
                await DBContext.database.UpdateAsync(PolizaTipo);
                await DBContext.Destroy();
                return Ok(PolizaTipo);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }
    }
}
