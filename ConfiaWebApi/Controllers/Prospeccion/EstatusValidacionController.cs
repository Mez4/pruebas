using DBContext.DBConfia;
using DBContext.DBConfia.Prospeccion;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.Prospeccion
{
    [Authorize]
    [ApiController]
    [Route("api/Prospeccion/[controller]")]
    public class EstatusValidacionController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public EstatusValidacionController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Prospeccion.EstatusValidacion.get parData)
        {
            if (parData.id != 0)
            {
                var res = await DBContext.database.SingleByIdAsync<EstatusValidacion>(parData.id);
                await DBContext.Destroy();
                return Ok(res);
            }
            var res1 = await DBContext.database.FetchAsync<EstatusValidacion>();
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Prospeccion.EstatusValidacion.add parData)
        {
            try
            {
                var estatusValidacion = new EstatusValidacion() { Estatus = parData.Estatus };
                await DBContext.database.InsertAsync<EstatusValidacion>(estatusValidacion);
                await DBContext.Destroy();
                return Ok(estatusValidacion);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Prospeccion.EstatusValidacion.update parData)
        {
            try
            {
                var estatusValidacion = await DBContext.database.SingleByIdAsync<EstatusValidacion>(parData.EstatusValidacionID);
                estatusValidacion.Estatus = parData.Estatus;
                await DBContext.database.UpdateAsync(estatusValidacion);
                await DBContext.Destroy();
                return Ok(estatusValidacion);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }
    }
}