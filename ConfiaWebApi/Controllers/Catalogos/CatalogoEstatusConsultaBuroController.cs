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
    public class CatalogoEstatusConsultaBuroController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public CatalogoEstatusConsultaBuroController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Catalogos.CatalogoEstatusConsultaBuroID.Get parData)
        {
            if (parData.EstatusConsultaBuroID != 0)
            {
                var res2 = await DBContext.database.SingleByIdAsync<EstatusConsultaBuro>(parData.EstatusConsultaBuroID);
                await DBContext.Destroy();
                return Ok(res2);
            }
            var res = await DBContext.database.FetchAsync<EstatusConsultaBuro>();
            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Catalogos.CatalogoEstatusConsultaBuroID.Add parData)
        {
            try
            {
                var estatusConsultaBuro = new EstatusConsultaBuro() { Descripcion = parData.Descripcion };
                await DBContext.database.InsertAsync(estatusConsultaBuro);
                await DBContext.Destroy();
                return Ok(estatusConsultaBuro);
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
        // [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Catalogos.CatalogoEstatusConsultaBuroID.Update parData)
        {
            try
            {
                var estatusConsultaBuro = await DBContext.database.SingleByIdAsync<EstatusConsultaBuro>(parData.EstatusConsultaBuroID);
                estatusConsultaBuro.Descripcion = parData.Descripcion;
                await DBContext.database.UpdateAsync(estatusConsultaBuro);
                await DBContext.Destroy();
                return Ok(estatusConsultaBuro);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}
