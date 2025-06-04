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
    public class EmpresasExperienciaController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public EmpresasExperienciaController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }
        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Prospeccion.EmpresasExperiencia.get parData)
        {
            if (parData.id != 0)
            {
                var res = await DBContext.database.SingleByIdAsync<EmpresasExperiencia>(parData.id);
                await DBContext.Destroy();
                return Ok(res);
            }
            var res1 = await DBContext.database.FetchAsync<EmpresasExperiencia>();
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Prospeccion.EmpresasExperiencia.add parData)
        {
            try
            {
                var empresasExperiencia = new EmpresasExperiencia() { Descripcion = parData.Descripcion, Activo = parData.Activo };
                await DBContext.database.InsertAsync<EmpresasExperiencia>(empresasExperiencia);
                await DBContext.Destroy();
                return Ok(empresasExperiencia);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Prospeccion.EmpresasExperiencia.update parData)
        {
            try
            {
                var empresasExperiencia = await DBContext.database.SingleByIdAsync<EmpresasExperiencia>(parData.EmpresaExperienciaID);
                empresasExperiencia.Descripcion = parData.Descripcion;
                empresasExperiencia.Activo = parData.Activo;
                await DBContext.database.UpdateAsync(empresasExperiencia);
                await DBContext.Destroy();
                return Ok(empresasExperiencia);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }
    }
}