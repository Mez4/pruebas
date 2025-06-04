using DBContext.DBConfia;
using DBContext.DBConfia.Catalogos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.AppDirecciones
{
    [Authorize]
    [ApiController]
    [Route("api/AppGestion/[controller]")]
    public class AppDireccionesController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public AppDireccionesController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpGet]
        [Route("getViviendasTipos")]
        [Authorize]
        public async Task<IActionResult> GetViviendasTipos()
        {
            try
            {
                var data = await DBContext.database.FetchAsync<ViviendasTipos>();
                var resp = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                await DBContext.Destroy();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { error = "Error al obtener info " }
                });
            }
        }

        [HttpGet]
        [Route("getOrientacionVialidadTipos")]
        [Authorize]
        public async Task<IActionResult> GetOrientacionVialidadTipos()
        {

            try
            {
                var data = await DBContext.database.FetchAsync<OrientacionVialidadTipos>();
                var resp = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                await DBContext.Destroy();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { error = "Error al obtener info " }
                });
            }

        }

        [HttpGet]
        [Authorize]
        [Route("getTipoVialidad")]
        public async Task<IActionResult> GetTipoVialidad()
        {
            try
            {
                var data = await DBContext.database.FetchAsync<VialidadesTipos>();

                var resp = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                await DBContext.Destroy();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { error = "Error al obtener info " }
                });
            }
        }

        [HttpPost]
        [Route("getdireccionbycp")]
        [Authorize]
        public async Task<IActionResult> GetDireccionByCP(PeticionesRest.Catalogos.Asentamiento.GetbyCP parData)
        {
            try
            {

                var data = await DBContext.database.FetchAsync<Asentamientos>("WHERE (CodigoPostal = @CodigoPostal)", parData);

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                await DBContext.Destroy();

                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }

        }
    }
}