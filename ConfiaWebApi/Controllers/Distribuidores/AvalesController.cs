using DBContext.DBConfia;
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
    [Route("api/Distribuidores/[controller]")]
    public class AvalesController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public AvalesController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpGet]
        [Route("getByDistribuidor/{DistribuidorID}")]
        [Authorize]
        [Code.TProteccionAdmin]
        // [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> getByDistribuidor(int DistribuidorID) 
        {
            try
            {
                var res = await DBContext.database.FetchAsync<DBContext.DBConfia.Distribuidores.AvalesDistribuidor_VW>("WHERE  (DistribuidorID = @0)", DistribuidorID);
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpGet]
        [Route("getDistribuidor/{DistribuidorID}")]
        [Authorize]
        [Code.TProteccionProducto]
        // [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> getDistribuidor(int DistribuidorID) 
        {
            try
            {
                var res = await DBContext.database.FetchAsync<DBContext.DBConfia.Distribuidores.AvalesDistribuidor_VW>("WHERE  (DistribuidorID = @0)", DistribuidorID);
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }


         [HttpGet]
        [Route("getDistribuidorRef/{DistribuidorID}")]
        [Authorize]
        [Code.TProteccionProducto]
        // [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> getDistribuidorRef(int DistribuidorID) 
        {
            try
            {
                var res = await DBContext.database.FetchAsync<DBContext.DBConfia.Prospeccion.Referencias>("WHERE  (PersonaID = @0)", DistribuidorID);
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }
    }
}
