using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Distribuidores;
using DBContext.DBConfia.General;
using System.Collections;
using System.Collections.Generic;
using DBContext.DBConfia.Seguridad;

using DBContext.DBConfia.Custom.Creditos;

namespace ConfiaWebApi.Controllers.Creditos
{
    [Authorize]
    [ApiController]
    [Route("api/Creditos/[controller]")]
    public class NotasRapidasController : ControllerBase
    {
        private DBConfiaContext DBContext;
        public NotasRapidasController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("addNotas")]
        [Authorize]
        public async Task<IActionResult> Add(PeticionesRest.Creditos.NotasRapidas.Add parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var notaRapida = new DBContext.DBConfia.Creditos.NotasRapidas()
                {
                    FechaRegistro = DateTime.Now,
                    Descripcion = parData.Descripcion,
                    DistribuidorID = parData.DistribuidorID,
                    TipoNotaID = parData.TipoNotaID,
                    UsuarioRegistra = UsuarioActual.UsuarioID
                };
                await DBContext.database.InsertAsync(notaRapida);

                await DBContext.Destroy();
                return Ok(notaRapida);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("getTipoNotas")]
        [Authorize]
        public async Task<IActionResult> GetTipoNotas()
        {
            try
            {
                var obj = await DBContext.database.FetchAsync<DBContext.DBConfia.Creditos.TiposNotas>();
                await DBContext.Destroy();
                return Ok(obj);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("getNotas")]
        [Authorize]
        public async Task<IActionResult> GetNotas(PeticionesRest.Creditos.NotasRapidas.GetNotasRapidas parData)
        {
            try
            {
                var obj = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.NotasRapidas_VW>("WHERE DistribuidorID = @0", parData.DistribuidorID).ToArrayAsync();
                await DBContext.Destroy();
                return Ok(obj);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}