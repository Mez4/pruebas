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
    public class TipoPersonaController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public TipoPersonaController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Prospeccion.TipoPersona.get parData)
        {
            if (parData.id != 0)
            {
                var res = await DBContext.database.SingleByIdAsync<TipoPersona>(parData.id);
                await DBContext.Destroy();
                return Ok(res);
            }
            var res1 = await DBContext.database.FetchAsync<TipoPersona>();
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Prospeccion.TipoPersona.add parData)
        {
            try
            {
                var tipoPersona = new TipoPersona() { Clave = parData.Clave, Descripcion = parData.Descripcion };
                await DBContext.database.InsertAsync<TipoPersona>(tipoPersona);
                await DBContext.Destroy();
                return Ok(tipoPersona);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Prospeccion.TipoPersona.update parData)
        {
            try
            {
                var tipoPersona = await DBContext.database.SingleByIdAsync<TipoPersona>(parData.TipoPersonaID);
                tipoPersona.Clave = parData.Clave;
                tipoPersona.Descripcion = parData.Descripcion;
                await DBContext.database.UpdateAsync(tipoPersona);
                await DBContext.Destroy();
                return Ok(tipoPersona);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }
    }
}
