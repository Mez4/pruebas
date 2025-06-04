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
    public class AplicacionesController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public AplicacionesController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpGet]
        [Route("getAplicacionId/{AplicacionID}/{mostrar}")]
        [Authorize]
        public async Task<IActionResult> getByDistribuidor(int AplicacionID, int mostrar) 
        {
            try
            {
                var sql = "SELECT * FROM Creditos.Aplicaciones_VW WHERE DistribuidorID = @0 AND Activo = @1";
                var res = await DBContext.database.FetchAsync<DBContext.DBConfia.Creditos.Aplicaciones_VW>(sql, AplicacionID, mostrar);
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
        [Route("getAplicacionesCliente/{ClienteID}")]
        [Authorize]
        public async Task<IActionResult> getAplicacionesCliente(int ClienteID) 
        {
            try
            {
                var res = await DBContext.database.FetchAsync<DBContext.DBConfia.Creditos.Aplicaciones_VW>("WHERE ClienteID = @0", ClienteID);
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
