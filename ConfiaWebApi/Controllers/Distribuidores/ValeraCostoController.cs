using DBContext.DBConfia;
using DBContext.DBConfia.Distribuidores;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.Distribuidores
{
    [Authorize]
    [ApiController]
    [Route("api/Distribuidor/[controller]")]
    public class ValeraCostoController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public ValeraCostoController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get()
        {
            var res = await DBContext.database.FetchAsync<ValeraCostos_VW>();
            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Distribuidores.ValeraCosto.Add parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var Costo = new ValerasCosto()
                {
                    Costo = parData.Costo,
                    FechaRegistra = DateTime.Now,
                    PersonaRegistraID = (long)UsuarioActual.PersonaID,
                    UsuarioRegistraID = UsuarioActual.UsuarioID
                };
                await DBContext.database.InsertAsync(Costo);
                var objeto = await DBContext.database.QueryAsync<ValeraCostos_VW>("WHERE ValeraCostoID = @0", Costo.ValeraCostoID).SingleOrDefaultAsync();

                await DBContext.Destroy();

                return Ok(objeto);
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
        [Code.TProteccionProducto]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Distribuidores.ValeraCosto.Update parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var costo = await DBContext.database.SingleByIdAsync<ValerasCosto>(parData.ValeraCostoID);
                costo.Costo = parData.Costo;
                costo.FechaModifica = DateTime.Now;
                costo.PersonaModificaID = UsuarioActual.PersonaID;
                costo.UsuarioModificaID = UsuarioActual.UsuarioID;

                await DBContext.database.UpdateAsync(costo);

                var objeto = await DBContext.database.QueryAsync<ValeraCostos_VW>("WHERE ValeraCostoID = @0", costo.ValeraCostoID).SingleOrDefaultAsync();

                await DBContext.Destroy();
                return Ok(objeto);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }


    }
}
