using Common.Logging;
using DBContext.DBConfia;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.AppGestion
{
    [Authorize]
    [ApiController]
    [Route("api/AppGestion/[controller]")]
    public class AppGestionController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public AppGestionController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetDestinos()
        {
            try
            {
                List<Object> data = new List<object>{
                    new { nombreIndicador = "Por visitar", valor = "92.3%", icono = "shield-alt", color = "blue", nombreDelIndicdor = "POR_VISIsTAR"},
                    new { nombreIndicador = "Compromiso", valor = "75%", icono = "chart-bar", color = "blue", nombreDelIndicdor = "COMPROMISO_META"},
                    new { nombreIndicador = "Total de socias", valor = "91", icono = "users", color = "blue", nombreDelIndicdor = "TOTAL_DE_SOCIAS"},
                    new { nombreIndicador = "Activaciones", valor = "2/5", icono = "user-circle", color = "blue", nombreDelIndicdor = "ACTIVACIONES"},
                };

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = data
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
                    data = new { error = "Error al obtener indicadores" }
                });
            }

        }

        [HttpPost]
        [Route("getDetalle")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getDetalle(ConfiaWebApi.PeticionesRest.AppGestion.AppGestion.getDetalle pardata)
        {
            try
            {
                List<Object> data = new List<object>{
                    new { createdAt = "2023-04-03T13:16:47.393Z", name = "Margarita", lastName = "Perez Felix", id = "1", direccion = "calle #001 Colonia CP 0000 Estatdo, Pais"},
                    new { createdAt = "2022-09-04T20:19:31.867Z", name = "Juana", lastName = "Lopez Vazquez", id = "2", direccion = "calle #001 Colonia CP 0000 Estatdo, Pais"},
                    new { createdAt = "2022-09-05T03:24:48.998Z", name = "Maria de los angeles", lastName = "Gutierrez Lopez", id = "3", direccion = "calle #001 Colonia CP 0000 Estatdo, Pais" },
                    new { createdAt = "2022-09-05T03:24:48.998Z", name = "Ignacia", lastName = "Ibarra Beltran", id = "4", direccion = "calle #001 Colonia CP 0000 Estatdo, Pais" },
                    new { createdAt = "2022-09-05T03:24:48.998Z", name = "Jose", lastName = "Sanchez Beltran", id = "5", direccion = "calle #001 Colonia CP 0000 Estatdo, Pais"},
                };

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = data
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
                    data = new { error = "Error al obtener detalle de indicadores" }
                });
            }

        }
    }
}
