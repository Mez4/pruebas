
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
    public class TuberiaResultadoController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public TuberiaResultadoController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }
        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Prospeccion.TuberiaResultado.get parData)
        {
            if (parData.id != 0)
            {
                var res = await DBContext.database.SingleByIdAsync<TuberiaResultado>(parData.id);
                await DBContext.Destroy();
                return Ok(res);
            }
            var res1 = await DBContext.database.FetchAsync<TuberiaResultado>();
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Prospeccion.TuberiaResultado.add parData)
        {
            try
            {
                var tuberiaResultado = new TuberiaResultado() { Resultado = parData.Resultado };
                await DBContext.database.InsertAsync<TuberiaResultado>(tuberiaResultado);
                await DBContext.Destroy();
                return Ok(tuberiaResultado);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Prospeccion.TuberiaResultado.update parData)
        {
            try
            {
                var tuberiaResultado = await DBContext.database.SingleByIdAsync<TuberiaResultado>(parData.TuberiaResultadoID);
                tuberiaResultado.Resultado = parData.Resultado;
                await DBContext.database.UpdateAsync(tuberiaResultado);
                await DBContext.Destroy();
                return Ok(tuberiaResultado);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }
    }
}

