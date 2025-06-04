
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Bancos;
using DBContext.DBConfia.Sistema;
using System.Collections;
using DBContext.DBConfia.dbo;
//using DBContext.DBConfia.IntegracionKeycloak;
using DBContext.DBConfia.Seguridad;

namespace ConfiaWebApi.Controllers.Bancos
{
    [Authorize]
    [ApiController]
    [Route("api/Bancos/[controller]")]
    public class TipoDesembolsoSucursalController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public TipoDesembolsoSucursalController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get()
        {
            try
            {
                var res = await DBContext.database.FetchAsync<TiposDesembolsoSucursal_VW>();
                await DBContext.Destroy();
                return Ok(res);
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
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(PeticionesRest.Bancos.TipoDesembolsoSucursal.Add parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                ArrayList res = new();

                foreach (var TipoDesembolsoID in parData.TipoDesembolsoIds)
                {
                    var TiposDesembolsoSucursal = await DBContext.database.SingleOrDefaultByIdAsync<TiposDesembolsoSucursal>(new { parData.ProductoID, parData.SucursalId, TipoDesembolsoID });

                    if (TiposDesembolsoSucursal == null)
                    {
                        TiposDesembolsoSucursal = new TiposDesembolsoSucursal()
                        {
                            SucursalId = parData.SucursalId,
                            TipoDesembolsoID = TipoDesembolsoID,
                            ProductoID = parData.ProductoID,
                            RegistroFecha = DateTime.Now,
                            RegistroUsuarioId = UsuarioActual.UsuarioID,
                            //PersonaIDRegistro = PersonaActual.PersonaID
                        };

                        await DBContext.database.InsertAsync(TiposDesembolsoSucursal);

                        res.Add(new
                        {
                            TiposDesembolsoSucursal
                        });
                    }

                }
                var TiposDesembolsoSucursal_VW = await DBContext.database.FetchAsync<TiposDesembolsoSucursal_VW>();
                await DBContext.Destroy();
                return Ok(TiposDesembolsoSucursal_VW);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

    }
}
