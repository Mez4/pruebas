using DBContext.DBConfia;
using DBContext.DBConfia.Tesoreria;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.Tesoreria
{
    [Authorize]
    [ApiController]
    [Route("api/tesoreria/[controller]")]
    public class RubroController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public RubroController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "TESORERIA_USUARIO_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Tesoreria.Rubro.Get parData)
        {
            try
            {
                if (parData.RubroID != 0)
                {
                    var res = await DBContext.database.SingleByIdAsync<Rubro>(parData.RubroID);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                var res2 = await DBContext.database.FetchAsync<Rubro>();
                await DBContext.Destroy();
                return Ok(res2);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "TESORERIA_USUARIO_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Tesoreria.Rubro.Add parData)
        {
            try
            {
                var rubro = new Rubro() { Descripcion = parData.Descripcion };
                await DBContext.database.InsertAsync(rubro);
                await DBContext.Destroy();
                return Ok(rubro);
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
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "TESORERIA_USUARIO_ADMIN" })]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Tesoreria.Rubro.Update parData)
        {
            try
            {
                var rubro = await DBContext.database.SingleByIdAsync<Rubro>(parData.RubroID);
                rubro.Descripcion = parData.Descripcion;

                await DBContext.database.UpdateAsync(rubro);
                await DBContext.Destroy();
                return Ok(rubro);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}
