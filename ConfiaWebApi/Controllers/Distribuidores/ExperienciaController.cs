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
    [Route("api/Distribuidores/[controller]")]
    public class ExperienciaController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public ExperienciaController(DBConfiaContext _DBContext)
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
                var res = await DBContext.database.FetchAsync<DBContext.DBConfia.Distribuidores.Experiencia>("WHERE  (DistribuidorID = @0)", DistribuidorID);
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
                var persona = await DBContext.database.QueryAsync<Distribuidores_VW>("WHERE  (DistribuidorID = @0)", DistribuidorID).FirstOrDefaultAsync();
                var res = await DBContext.database.FetchAsync<DBContext.DBConfia.Prospeccion.ProspectosExperienciaVentas_VW>("WHERE  (PersonaID = @0)", persona.PersonaID);
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
