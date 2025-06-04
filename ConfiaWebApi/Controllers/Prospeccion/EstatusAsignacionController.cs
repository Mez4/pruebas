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
    public class EstatusAsignacionController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public EstatusAsignacionController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Prospeccion.EstatusAsignacion.get parData)
        {
            if (parData.id != 0)
            {
                var res = await DBContext.database.SingleByIdAsync<EstatusAsignacion>(parData.id);
                await DBContext.Destroy();
                return Ok(res);
            }
            var res1 = await DBContext.database.FetchAsync<EstatusAsignacion>();
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Prospeccion.EstatusAsignacion.add parData)
        {
            try
            {
                var estatusAsignacion = new EstatusAsignacion() { Estatus = parData.Estatus };
                await DBContext.database.InsertAsync<EstatusAsignacion>(estatusAsignacion);
                await DBContext.Destroy();
                return Ok(estatusAsignacion);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Prospeccion.EstatusAsignacion.update parData)
        {
            try
            {
                var estatusAsignacion = await DBContext.database.SingleByIdAsync<EstatusAsignacion>(parData.EstatusAsignacionID);
                estatusAsignacion.Estatus = parData.Estatus;
                await DBContext.database.UpdateAsync(estatusAsignacion);
                await DBContext.Destroy();
                return Ok(estatusAsignacion);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }
    }
}