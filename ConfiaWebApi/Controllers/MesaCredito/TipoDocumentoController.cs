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
    [Route("api/MesaCredito/[controller]")]
    public class TipoDocumentoController : ControllerBase
    {
        private DBConfiaContext DBContext;


        public TipoDocumentoController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(PeticionesRest.MesaCredito.TipoDocumento.Get parData)
        {
            if (parData.id != 0)
            {
                try
                {
                    var res = await DBContext.database.SingleByIdAsync<TipoDocumento>(parData.id);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            var res1 = await DBContext.database.FetchAsync<TipoDocumento>();
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.MesaCredito.TipoDocumento.Add parData)
        {
            try
            {
                var tipodocumento = new TipoDocumento()
                {


                    clave = parData.clave,
                    descripcion = parData.descripcion,
                    status = parData.status
                };
                await DBContext.database.InsertAsync(tipodocumento);
                await DBContext.Destroy();
                return Ok(tipodocumento);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.MesaCredito.TipoDocumento.Update parData)
        {
            try
            {
                var tipodocumento = await DBContext.database.SingleByIdAsync<TipoDocumento>(parData.id);
                tipodocumento.id = parData.id;
                tipodocumento.clave = parData.clave;
                tipodocumento.descripcion = parData.descripcion;
                tipodocumento.status = parData.status;
                await DBContext.database.UpdateAsync(tipodocumento);
                await DBContext.Destroy();
                return Ok(tipodocumento);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}
