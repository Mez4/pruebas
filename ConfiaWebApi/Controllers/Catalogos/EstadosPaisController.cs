using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;

using DBContext.DBConfia;
using DBContext.DBConfia.Catalogos;
using DBContext.DBConfia.Sistema;

namespace ConfiaWebApi.Controllers.Catalogos
{
    [Authorize]
    [ApiController]
    [Route("api/Catalogos/[controller]")]
    public class EstadosPaisController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public EstadosPaisController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Catalogos.EstadosPais.Get parData)
        {
            if (parData.estadoPaisId != 0)
            {
                var res = await DBContext.database.SingleByIdAsync<EstadosPais>(parData.estadoPaisId);
                await DBContext.Destroy();
                return Ok(res);
            }
            // return Ok(DBContext.database.QueryAsync<EstadosPais>("WHERE Id IN @0", parData).ToListAsync());
            var res2 = await DBContext.database.FetchAsync<EstadosPais>();
            await DBContext.Destroy();
            return Ok(res2);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Catalogos.EstadosPais.Add parData)
        {
            try
            {
                var EstadosPaisTipo = new EstadosPais() { estadoPaisNombre = parData.estadoPaisNombre, abreviatura = parData.abreviatura, estadoPaisCodigo = parData.estadoPaisCodigo };
                await DBContext.database.InsertAsync(EstadosPaisTipo);
                await DBContext.Destroy();
                return Ok(EstadosPaisTipo);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Catalogos.EstadosPais.Update parData)
        {
            try
            {
                var EstadosPaisTipo = await DBContext.database.SingleByIdAsync<EstadosPais>(parData.estadoPaisId);
                EstadosPaisTipo.estadoPaisNombre = parData.estadoPaisNombre;
                EstadosPaisTipo.abreviatura = parData.abreviatura;
                EstadosPaisTipo.estadoPaisCodigo = parData.estadoPaisCodigo;
                await DBContext.database.UpdateAsync(EstadosPaisTipo);
                await DBContext.Destroy();
                return Ok(EstadosPaisTipo);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}