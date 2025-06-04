using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Sistema;

namespace ConfiaWebApi.Controllers.General
{
    [Authorize]
    [ApiController]
    [Route("api/General/[controller]")]
    public class DirectorController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public DirectorController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> Get(PeticionesRest.General.Directores.Get parData)
        {
            if (parData.PersonaID != 0)
            {
                try
                {
                    var resS = await DBContext.database.SingleByIdAsync<Directores_VW>(parData.PersonaID);
                    await DBContext.Destroy();
                    return Ok(resS);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            var res = await DBContext.database.QueryAsync<Directores_VW>().ToArray();
            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("getByName")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> getByName(PeticionesRest.General.Directores.getByName parData)
        {
            if (parData.NombreCompleto != null)
            {
                try
                {
                    parData.NombreCompleto += "%";

                    var res = await DBContext.database.FetchAsync<Directores_VW>("SELECT * FROM General.Directores_VW WHERE (NombreCompleto LIKE @0)", parData.NombreCompleto);

                    await DBContext.Destroy();
                    return Ok(res);

                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            else
            {
                try
                {
                    var res = await DBContext.database.FetchAsync<Directores_VW>("SELECT * FROM General.Directores_VW ", parData);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return BadRequest(ex.Message);
                }
            }
        }

        [HttpPost]
        [Route("getprod")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetProd(PeticionesRest.General.Directores.Get parData)
        {
            if (parData.PersonaID != 0)
            {
                try
                {
                    var resS = await DBContext.database.SingleByIdAsync<Directores_VW>(parData.PersonaID);
                    await DBContext.Destroy();
                    return Ok(resS);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            var res = await DBContext.database.FetchAsync<Directores_VW>();
            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("getByNameProd")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getByNameProd(PeticionesRest.General.Directores.getByName parData)
        {
            if (parData.NombreCompleto != null)
            {
                try
                {
                    parData.NombreCompleto += "%";

                    var res = await DBContext.database.FetchAsync<Directores_VW>("SELECT * FROM General.Directores_VW WHERE (NombreCompleto LIKE @0)", parData.NombreCompleto);

                    await DBContext.Destroy();
                    return Ok(res);

                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            else
            {
                try
                {
                    var res = await DBContext.database.FetchAsync<Directores_VW>("SELECT * FROM General.Directores_VW ", parData);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return BadRequest(ex.Message);
                }
            }
        }
    }
}

