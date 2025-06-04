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
    public class ValeraSeriesTiposController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public ValeraSeriesTiposController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Distribuidores.ValeraSeriesTipos.get parData)
        {
            if (parData.id != 0)
            {
                var res = await DBContext.database.SingleByIdAsync<ValeraSeriesTipos>(parData.id);
                await DBContext.Destroy();
                return Ok(res);
            }
            var res1 = await DBContext.database.FetchAsync<ValeraSeriesTipos>();
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Distribuidores.ValeraSeriesTipos.add parData)
        {
            try
            {
                var tipoSerie = new ValeraSeriesTipos() { Tipo = parData.Tipo };
                await DBContext.database.InsertAsync<ValeraSeriesTipos>(tipoSerie);
                await DBContext.Destroy();
                return Ok(tipoSerie);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Distribuidores.ValeraSeriesTipos.update parData)
        {
            try
            {
                var tipoSerie = await DBContext.database.SingleByIdAsync<ValeraSeriesTipos>(parData.ValeraSeriesTiposID);
                tipoSerie.Tipo = parData.Tipo;
                await DBContext.database.UpdateAsync(tipoSerie);
                await DBContext.Destroy();
                return Ok(tipoSerie);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

    }
}
