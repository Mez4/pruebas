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
    public class TasaTipoController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public TasaTipoController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.Creditos.TasaTipo.Get parData)
        {
            if (parData.Id != null)
            {
                try
                {
                    var resS = await DBContext.database.SingleByIdAsync<TasasTipos>(parData.Id);
                    await DBContext.Destroy();
                    return Ok(resS);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            var res = await DBContext.database.FetchAsync<TasasTipos>();
            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(PeticionesRest.Creditos.TasaTipo.Add parData)
        {
            try
            {
                var TasaTipo = new TasasTipos() 
                { 
                    TasaTipoId = parData.TasaTipoId, 
                    TasaTipo = parData.TasaTipo, 
                    capitalizacionesPorMes = parData.capitalizacionesPorMes, 
                    capitalizacionesPorAnio = parData.capitalizacionesPorAnio 
                };
                await DBContext.database.InsertAsync(TasaTipo);
                await DBContext.Destroy();
                return Ok(TasaTipo);
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
        public async Task<IActionResult> Update(PeticionesRest.Creditos.TasaTipo.Update parData)
        {
            try
            {
                var TasaTipo = await DBContext.database.SingleByIdAsync<TasasTipos>(parData.TasaTipoId);
                TasaTipo.TasaTipo = parData.TasaTipo;
                TasaTipo.capitalizacionesPorMes = parData.capitalizacionesPorMes;
                TasaTipo.capitalizacionesPorAnio = parData.capitalizacionesPorAnio;
                await DBContext.database.UpdateAsync(TasaTipo);
                await DBContext.Destroy();
                return Ok(TasaTipo);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}
