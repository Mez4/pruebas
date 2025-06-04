using DBContext.DBConfia;
using DBContext.DBConfia.MesaCredito;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace ConfiaWebApi.Controllers.MesaCredito
{
    [Authorize]
    [ApiController]
    [Route("api/Catalogos/[controller]")]
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
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(PeticionesRest.MesaCredito.TipoPersona.Get parData)
        {
            if (parData.id != 0)
            {
                try
                {
                    var res = await DBContext.database.SingleByIdAsync<TipoPersona>(parData.id);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            var res1 = await DBContext.database.FetchAsync<TipoPersona>();
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.MesaCredito.TipoPersona.Add parData)
        {
            try
            {
                var tipopersona = new TipoPersona()
                {

                    clave = parData.clave,
                    descripcion = parData.descripcion
                };
                await DBContext.database.InsertAsync(tipopersona);
                await DBContext.Destroy();
                return Ok(tipopersona);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.MesaCredito.TipoPersona.Update parData)
        {
            try
            {
                var tipopersona = await DBContext.database.SingleByIdAsync<TipoPersona>(parData.id);
                tipopersona.id = parData.id;
                tipopersona.clave = parData.clave;
                tipopersona.descripcion = parData.descripcion;
                await DBContext.database.UpdateAsync(tipopersona);
                await DBContext.Destroy();
                return Ok(tipopersona);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}
