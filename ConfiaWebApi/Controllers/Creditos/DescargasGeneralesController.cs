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
    public class DescargasGeneralesController : ControllerBase
    {
        private DBConfiaContext ConexionBD;

        public DescargasGeneralesController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        [HttpPost]
        [Route("getdocs")]
        [Authorize]
        public async Task<IActionResult> GetDocs(PeticionesRest.Creditos.DescargasGenerales.Get parData)
        {
            try
            {
                var res = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Catalogos.DocumentosGenerales>("WHERE Activo=1").ToArrayAsync();

                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}