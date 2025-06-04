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
    [Route("api/Tesoreria/[controller]")]
    public class TipoCuentaController : ControllerBase
    {
        private DBConfiaContext DBContext;
        public TipoCuentaController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Tesoreria.TipoCuenta.Get parData)
        {
            if (parData.id != 0)
            {
                var res = await DBContext.database.SingleByIdAsync<TipoCuenta>(parData.id);
                await DBContext.Destroy();
                return Ok(res);
            }
            var res2 = await DBContext.database.FetchAsync<TipoCuenta>();
            await DBContext.Destroy();
            return Ok(res2);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Tesoreria.TipoCuenta.Add parData)
        {
            try
            {
                var CuentaTipo = new TipoCuenta() { Descripcion = parData.Descripcion };
                await DBContext.database.InsertAsync(CuentaTipo);
                await DBContext.Destroy();
                return Ok(CuentaTipo);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Tesoreria.TipoCuenta.Update parData)
        {
            try
            {
                var CuentaTipo = await DBContext.database.SingleByIdAsync<TipoCuenta>(parData.TipoID);
                CuentaTipo.Descripcion = parData.Descripcion;
                await DBContext.database.UpdateAsync(CuentaTipo);
                await DBContext.Destroy();
                return Ok(CuentaTipo);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }
    }
}
