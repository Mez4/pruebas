using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Catalogos;
using DBContext.DBConfia.Sistema;

namespace ConfiaWebApi.Controllers.Catalogos
{
    [Authorize]
    [ApiController]
    [Route("api/Catalogos/[controller]")]
    public class EventosTiposController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public EventosTiposController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }


        [HttpPost]
        [Route("get")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Catalogos.EventosTipos.Get parData)
        {
            if (parData.eventoTipoId != 0)
            {
                var res = await DBContext.database.SingleByIdAsync<EventosTipos>(parData.eventoTipoId);
                await DBContext.Destroy();
                return Ok(res);
            }
            // return Ok(DBContext.database.QueryAsync<Viviendastipos>("WHERE Id IN @0", parData).ToListAsync());
            var res2 = await DBContext.database.FetchAsync<EventosTipos>();
            await DBContext.Destroy();
            return Ok(res2);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Catalogos.EventosTipos.Add parData)
        {
            try
            {
                var eventostipos = new EventosTipos() { eventoTipo = parData.eventoTipo };
                await DBContext.database.InsertAsync(eventostipos);
                await DBContext.Destroy();
                return Ok(eventostipos);
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
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Catalogos.EventosTipos.Update parData)
        {
            try
            {
                var eventostipos = await DBContext.database.SingleByIdAsync<EventosTipos>(parData.eventoTipoId);
                eventostipos.eventoTipo = parData.eventoTipo;
                await DBContext.database.UpdateAsync(eventostipos);
                await DBContext.Destroy();
                return Ok(eventostipos);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}
