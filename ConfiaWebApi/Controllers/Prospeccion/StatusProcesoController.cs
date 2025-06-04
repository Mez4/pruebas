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
    public class StatusProcesoController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public StatusProcesoController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Prospeccion.StatusProceso.get parData)
        {
            if (parData.id != 0)
            {
                var res = await DBContext.database.SingleByIdAsync<StatusProceso>(parData.id);
                await DBContext.Destroy();
                return Ok(res);
            }
            var res1 = await DBContext.database.FetchAsync<StatusProceso>();
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Prospeccion.StatusProceso.add parData)
        {
            try
            {
                var StatusProceso = new StatusProceso() { Descripcion = parData.Descripcion, Activo = parData.Activo };
                await DBContext.database.InsertAsync<StatusProceso>(StatusProceso);
                await DBContext.Destroy();
                return Ok(StatusProceso);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Prospeccion.StatusProceso.update parData)
        {
            try
            {
                var StatusProceso = await DBContext.database.SingleByIdAsync<StatusProceso>(parData.StatusProcesoID);
                StatusProceso.Descripcion = parData.Descripcion;
                StatusProceso.Activo = parData.Activo;
                await DBContext.database.UpdateAsync(StatusProceso);
                await DBContext.Destroy();
                return Ok(StatusProceso);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }
    }
}
