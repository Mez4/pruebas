using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Sistema;

namespace ConfiaWebApi.Controllers.Creditos
{
    [Authorize]
    [ApiController]
    [Route("api/Creditos/[controller]")]
    public class GestorController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public GestorController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.Creditos.Gestor.Get parData)
        {
            if (parData.Id != 0)
            {
                try
                {
                    var resS = await DBContext.database.SingleByIdAsync<Gestores>(parData.Id);
                    await DBContext.Destroy();
                    return Ok(resS);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }

            var res = await DBContext.database.FetchAsync<Gestores>();
            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(PeticionesRest.Creditos.Gestor.Add parData)
        {
            try
            {
                var Gestor = new Gestores() { Gestor = parData.Gestor, Activo = parData.Activo };
                await DBContext.database.InsertAsync(Gestor);
                await DBContext.Destroy();
                return Ok(Gestor);
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
        [Code.TProteccionProducto]
        public async Task<IActionResult> Update(PeticionesRest.Creditos.Gestor.Update parData)
        {
            try
            {
                var Gestor = await DBContext.database.SingleByIdAsync<Gestores>(parData.GestorID);
                Gestor.Gestor = parData.Gestor;
                Gestor.Activo = parData.Activo;
                await DBContext.database.UpdateAsync(Gestor);
                await DBContext.Destroy();
                return Ok(Gestor);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}
