using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Sistema;

namespace ConfiaWebApi.Controllers.Creditos
{
    [Authorize]
    [ApiController]
    [Route("api/Creditos/[controller]")]
    public class MotivoCancelacionController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public MotivoCancelacionController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.Creditos.MotivoCancelacion.Get parData)
        {
            if (parData.Id != 0)
            {
                try
                {
                    var resS = await DBContext.database.SingleByIdAsync<MotivosCancelacion>(parData.Id);
                    await DBContext.Destroy();
                    return Ok(resS);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            var res = await DBContext.database.FetchAsync<MotivosCancelacion>();
            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(PeticionesRest.Creditos.MotivoCancelacion.Add parData)
        {
            try
            {
                var MotivoCancelacion = new MotivosCancelacion() { MotivoCancelacion = parData.MotivoCancelacion, genMovBanco = parData.genMovBanco };
                await DBContext.database.InsertAsync(MotivoCancelacion);
                await DBContext.Destroy();
                return Ok(MotivoCancelacion);
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
        public async Task<IActionResult> Update(PeticionesRest.Creditos.MotivoCancelacion.Update parData)
        {
            try
            {
                var MotivoCancelacion = await DBContext.database.SingleByIdAsync<MotivosCancelacion>(parData.MotivoCancelacionID);
                MotivoCancelacion.MotivoCancelacion = parData.MotivoCancelacion;
                MotivoCancelacion.genMovBanco = parData.genMovBanco;
                await DBContext.database.UpdateAsync(MotivoCancelacion);
                await DBContext.Destroy();
                return Ok(MotivoCancelacion);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}
