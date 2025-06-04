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
    public class TuberiaController : ControllerBase
    {
        private DBConfiaContext DBContext;


        public TuberiaController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(PeticionesRest.MesaCredito.Tuberia.Get parData)
        {
            if (parData.id != 0)
            {
                try
                {
                    var res = await DBContext.database.SingleByIdAsync<Tuberia>(parData.id);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            var res1 = await DBContext.database.FetchAsync<Tuberia>();
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.MesaCredito.Tuberia.Add parData)
        {
            try
            {
                var tuberia = new Tuberia()
                {
                    idPersona = parData.idPersona,
                    idTipoPersona = parData.idTipoPersona,
                    proceso = parData.proceso,
                    resultado = parData.resultado
                };
                await DBContext.database.InsertAsync(tuberia);
                await DBContext.Destroy();
                return Ok(tuberia);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.MesaCredito.Tuberia.Update parData)
        {
            try
            {
                var tuberia = await DBContext.database.SingleByIdAsync<Tuberia>(parData.id);
                tuberia.id = parData.id;
                tuberia.idPersona = parData.idPersona;
                tuberia.idTipoPersona = parData.idTipoPersona;
                tuberia.proceso = parData.proceso;
                tuberia.resultado = parData.resultado;
                await DBContext.database.UpdateAsync(tuberia);
                await DBContext.Destroy();
                return Ok(tuberia);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}
