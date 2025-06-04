using DBContext.DBConfia;
using DBContext.DBConfia.Catalogos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.Catalogos
{
    [Authorize]
    [ApiController]
    [Route("api/Catalogos/[controller]")]
    public class SexoController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public SexoController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        //[Code.TProteccionAdmin]
        // [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Catalogos.Sexos.get parData)
        {
            if (parData.id != null)
            {
                var res = await DBContext.database.SingleByIdAsync<Sexos>(parData.id);
                await DBContext.Destroy();
                return Ok(res);
            }
            var res2 = await DBContext.database.FetchAsync<Sexos>();
            await DBContext.Destroy();
            return Ok(res2);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Catalogos.Sexos.add parData)
        {
            try
            {
                var Sexo = new Sexos() { Sexo = parData.Sexo, SexoID = parData.SexoID };
                await DBContext.database.InsertAsync<Sexos>(Sexo);
                await DBContext.Destroy();
                return Ok(Sexo);
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
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Catalogos.Sexos.update parData)
        {
            try
            {
                var Sexo = await DBContext.database.SingleByIdAsync<Sexos>(parData.SexoID);
                Sexo.Sexo = parData.Sexo;
                await DBContext.database.UpdateAsync(Sexo);
                await DBContext.Destroy();
                return Ok(Sexo);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }
    }
}
