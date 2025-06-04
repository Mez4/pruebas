using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;

using DBContext.DBConfia;
using DBContext.DBConfia.Catalogos;
using DBContext.DBConfia.Creditos;

namespace ConfiaWebApi.Controllers.Catalogos
{
    [Authorize]
    [ApiController]
    [Route("api/Catalogos/[controller]")]
    public class EstatusCreditoController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public EstatusCreditoController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        public async Task<IActionResult> Get()
        {
            var res = await DBContext.database.FetchAsync<Estatus>();
            await DBContext.Destroy();
            return Ok(res);
        }
    }
}