using DBContext.DBConfia;
using DBContext.DBConfia.Catalogos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;


namespace ConfiaWebApi.Controllers.Catalogos
{
    [Authorize]
    [ApiController]
    [Route("api/Catalogos/[controller]")]
    public class EstadoCivilController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public EstadoCivilController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        //[Code.TProteccionAdmin]
        // [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Catalogos.EstadoCivil.Get parData)
        {
            if (parData.Id != 0)
            {
                try
                {
                    var res = await DBContext.database.SingleByIdAsync<EstadosCiviles>(parData.Id);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            var res2 = await DBContext.database.FetchAsync<EstadosCiviles>();
            await DBContext.Destroy();
            return Ok(res2);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Catalogos.EstadoCivil.Add parData)
        {
            try
            {
                var Estadosciviles = new EstadosCiviles() { EstadoCivilID = parData.EstadoCivilID, EstadoCivil = parData.EstadoCivil };
                await DBContext.database.InsertAsync(Estadosciviles);
                await DBContext.Destroy();
                return Ok(Estadosciviles);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Catalogos.EstadoCivil.Update parData)
        {
            try
            {
                var Estadosciviles = await DBContext.database.SingleByIdAsync<EstadosCiviles>(parData.EstadoCivilID);
                Estadosciviles.EstadoCivilID = parData.EstadoCivilID;
                Estadosciviles.EstadoCivil = parData.EstadoCivil;
                await DBContext.database.UpdateAsync(Estadosciviles);
                await DBContext.Destroy();
                return Ok(Estadosciviles);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}
