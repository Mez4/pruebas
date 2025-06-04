using DBContext.DBConfia;
using DBContext.DBConfia.Prospeccion;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.AppProspeccion
{
     [Authorize]
    [ApiController]
    [Route("api/AppProspeccion/[controller]")]
    public class AppTipoViviendaController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public AppTipoViviendaController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Prospeccion.TipoVivienda.get parData)
        {
            if (parData.id != 0)
            {
                var res = await DBContext.database.SingleByIdAsync<TipoVivienda>(parData.id);
                await DBContext.Destroy();
                return Ok(res);
            }
            var res1 = await DBContext.database.FetchAsync<TipoVivienda>();
            await DBContext.Destroy();
            var resp = new
                    {
                        resultCode = 0,
                        resultDesc = "OK.",
                        data = res1
                    };
            return Ok(resp);
        }
    
    }

}