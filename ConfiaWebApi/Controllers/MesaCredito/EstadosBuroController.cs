using DBContext.DBConfia;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DBContext.DBConfia.MesaCredito;


namespace ConfiaWebApi.Controllers.MesaCredito
{
    [Authorize]
    [ApiController]
    [Route("api/MesaCredito/[controller]")]
    public class EstadosBuroController : ControllerBase
    {

        private DBConfiaContext DBContext;


        public EstadosBuroController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(PeticionesRest.MesaCredito.EstadosBuros.Get parData)
        {
            if (parData.id != 0)
            {
                try
                {
                    var res = await DBContext.database.SingleByIdAsync<EstadoBuro>(parData.id);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            var res1 = await DBContext.database.FetchAsync<EstadoBuro>();
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.MesaCredito.EstadosBuros.Add parData)
        {
            try
            {
                var estadoburo = new EstadoBuro()
                {
                    idEstado = parData.idEstado,
                    abreviaturaBuro = parData.abreviaturaBuro,

                };
                await DBContext.database.InsertAsync(estadoburo);
                await DBContext.Destroy();
                return Ok(estadoburo);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.MesaCredito.EstadosBuros.Update parData)
        {
            try
            {
                var estadoBuro = await DBContext.database.SingleByIdAsync<EstadoBuro>(parData.id);
                estadoBuro.idEstado = parData.idEstado;
                estadoBuro.abreviaturaBuro = parData.abreviaturaBuro;

                await DBContext.database.UpdateAsync(estadoBuro);
                await DBContext.Destroy();
                return Ok(estadoBuro);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}
