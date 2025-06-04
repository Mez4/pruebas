using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using System.Globalization;
using System.Collections.Generic;
using DBContext.DBConfia.Distribuidores;

namespace ConfiaWebApi.Controllers.Indicadores
{
    [Authorize]
    [ApiController]
    [Route("api/AppGestion/[controller]")]
    public class AppFechaCorteController : ControllerBase
    {
        private DBConfiaContext ConexionBD;
        public AppFechaCorteController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        [HttpPost]
        [Route("get2")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get2(PeticionesRest.Cortes.Relacion.GetFecha parData)
        {
            try
            {
                var relCortes = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Cortes.RelacionCortes>("SELECT TOP 1 fechaCorte FROM Cortes.RelacionCortes GROUP BY fechaCorte ORDER BY fechaCorte DESC").SingleOrDefaultAsync();

                await ConexionBD.Destroy();

                var response = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = relCortes
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }

        }
    }
}