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
    [Route("api/tesoreria/[controller]")]
    public class NaturalezaController : ControllerBase
    {

        private DBConfiaContext DBContext;

        public NaturalezaController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }


        [HttpPost]
        [Route("get")]
        [Authorize]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Tesoreria.Naturaleza.Get parData)
        {
            try
            {
                if (parData.NaturalezaId != 0)
                {
                    var res = await DBContext.database.SingleByIdAsync<Naturaleza>(parData.NaturalezaId);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                var res2 = await DBContext.database.FetchAsync<Naturaleza>();
                await DBContext.Destroy();
                return Ok(res2);
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
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Tesoreria.Naturaleza.Add parData)
        {
            try
            {
                var naturaleza = new Naturaleza() { Descripcion = parData.Descripcion };
                await DBContext.database.InsertAsync(naturaleza);
                await DBContext.Destroy();
                return Ok(naturaleza);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Tesoreria.Naturaleza.Update parData)
        {
            try
            {
                var naturaleza = await DBContext.database.SingleByIdAsync<Naturaleza>(parData.NaturalezaId);
                naturaleza.Descripcion = parData.Descripcion;

                await DBContext.database.UpdateAsync(naturaleza);
                await DBContext.Destroy();
                return Ok(naturaleza);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

    }
}
