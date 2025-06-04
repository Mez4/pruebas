using DBContext.DBConfia;
using DBContext.DBConfia.Distribuidores;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.Distribuidores
{
    [Authorize]
    [ApiController]
    [Route("api/Distribuidores/[controller]")]
    public class EstatusController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public EstatusController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        // [Code.TProteccionAdmin]
        public async Task<IActionResult> Get(PeticionesRest.Distribuidores.Estatus.Get parData)
        {
            if (parData.Id != 0)
            {
                try
                {
                    var res1 = await DBContext.database.SingleByIdAsync<Estatus>(parData.Id);
                    await DBContext.Destroy();
                    return Ok(res1);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            var res = await DBContext.database.FetchAsync<Estatus>();
            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("update")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Update(PeticionesRest.Distribuidores.Estatus.Update parData)
        {
            try
            {
                var distribuidor = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Distribuidores.Distribuidores>(parData.DistribuidorID);
                distribuidor.DistribuidoresEstatusID = parData.DistribuidoresEstatusID;
                await DBContext.database.UpdateAsync(distribuidor, i => new { i.DistribuidoresEstatusID });
                await DBContext.Destroy();
                return Ok(distribuidor);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }
    }
}
