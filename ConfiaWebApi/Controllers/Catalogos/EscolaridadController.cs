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
    public class EscolaridadController : ControllerBase
    {

        private DBConfiaContext DBContext;

        public EscolaridadController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }


        [HttpPost]
        [Route("get")]
        [Authorize]
        //[Code.TProteccionAdmin]
        // [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Catalogos.Escolaridad.Get parData)
        {
            if (parData.id != 0)
            {
                var res1 = await DBContext.database.SingleByIdAsync<Escolaridades>(parData.id);
                await DBContext.Destroy();
                return Ok(res1);
            }
            var res = await DBContext.database.FetchAsync<Escolaridades>();
            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CAT_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Catalogos.Escolaridad.Add parData)
        {
            try
            {
                var Escolaridad = new Escolaridades() { Escolaridad = parData.Escolaridad };
                await DBContext.database.InsertAsync(Escolaridad);
                await DBContext.Destroy();
                return Ok(Escolaridad);
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
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CAT_ADMIN" })]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Catalogos.Escolaridad.Update parData)
        {
            try
            {
                var Escolaridad = await DBContext.database.SingleByIdAsync<Escolaridades>(parData.EscolaridadID);
                Escolaridad.Escolaridad = parData.Escolaridad;
                await DBContext.database.UpdateAsync(Escolaridad);
                await DBContext.Destroy();
                return Ok(Escolaridad);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }
    }
}
