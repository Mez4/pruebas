using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Catalogos;
using DBContext.DBConfia.Bancos;

namespace ConfiaWebApi.Controllers.Bancos
{
    [Authorize]
    [ApiController]
    [Route("api/Bancos/[controller]")]
    public class DatosBancariosTipoController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public DatosBancariosTipoController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpGet]
        [Route("esDistribuidor/{personaID}")]
        [Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> EsDistribuidor(int personaID)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var distribuidor = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Distribuidores>("WHERE DistribuidorID = @0", personaID).ToArrayAsync();
                await this.DBContext.Destroy();

                if (distribuidor.Length > 0)
                {
                    var obj = new { Distribuidor = true };
                    await DBContext.Destroy();
                    return Ok(obj);
                }
                else
                {
                    var obj = new { Distribuidor = false };
                    await DBContext.Destroy();
                    return Ok(obj);
                }

            }
            catch (Exception ex)
            {
                await this.DBContext.Destroy();
                return BadRequest(ex);
            }

        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionAdmin]

        // [Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get()
        {
            var res = await DBContext.database.FetchAsync<DatosBancariosTipos>();
            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("getTipoBanco")]
        [Authorize]
        [Code.TProteccionProducto]

        // [Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> GetTipoBanco()
        {
            var res1 = await DBContext.database.FetchAsync<DatosBancariosTipos>();
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("getbyprod")]
        [Authorize]
        [Code.TProteccionProducto]

        // [Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> GetbyProd()
        {
            var res2 = await DBContext.database.FetchAsync<DatosBancariosTipos>();
            await DBContext.Destroy();
            return Ok(res2);
        }

    }
}