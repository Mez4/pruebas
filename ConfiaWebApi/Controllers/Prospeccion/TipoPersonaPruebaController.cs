using DBContext.DBConfia;
using DBContext.DBConfia.Prospeccion;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.Prospeccion
{
    [Authorize]
    [ApiController]
    [Route("api/Prospeccion/[controller]")]
    public class TipoPersonaPruebaController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public TipoPersonaPruebaController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Prospeccion.TipoPersona.get parData)
        {
            if (parData.id != 0)
            {
                var res = await DBContext.database.SingleByIdAsync<TipoPersonaPrueba>(parData.id);
                await DBContext.Destroy();
                return Ok(res);
            }
            var res1 = await DBContext.database.FetchAsync<TipoPersonaPrueba>();
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Prospeccion.TipoPersonaPrueba.add parData)
        {
            try
            {
                var tipoPersonaPrueba = new TipoPersonaPrueba() { Clave = parData.Clave, Descripcion = parData.Descripcion };
                await DBContext.database.InsertAsync<TipoPersonaPrueba>(tipoPersonaPrueba);
                var contra = BCrypt.Net.BCrypt.HashPassword("alicia");
                await DBContext.Destroy();
                return Ok(tipoPersonaPrueba);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Prospeccion.TipoPersonaPrueba.update parData)
        {
            try
            {
                var tipoPersona = await DBContext.database.SingleByIdAsync<TipoPersonaPrueba>(parData.TipoPersonaID);
                tipoPersona.Clave = parData.Clave;
                tipoPersona.Descripcion = parData.Descripcion;
                await DBContext.database.UpdateAsync(tipoPersona);
                await DBContext.Destroy();
                return Ok(tipoPersona);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }
    }
}
