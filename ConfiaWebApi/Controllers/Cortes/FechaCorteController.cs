using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Cortes;
using DBContext.DBConfia.Sistema;
using ConfiaWebApi.PeticionesRest.Cortes.Relacion;

namespace ConfiaWebApi.Controllers.Cortes
{
    [Authorize]
    [ApiController]
    [Route("api/Cortes/[controller]")]
    public class FechaCorteController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public FechaCorteController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(GetFecha parData)
        {
            var fechas = await DBContext.database.FetchAsync<FechaCorte_VW>("WHERE (SucursalID = @SucursalID OR @SucursalID = 0) ORDER BY fecha DESC", parData);
            var res = fechas.GroupBy(x => new { x.fecha, x.fechaCorte }).Select(i => new
            {
                i.Key.fecha,
                i.Key.fechaCorte
            }).ToArray();
            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("get2")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get2(GetFecha parData)
        {
            var relCortes = await DBContext.database.QueryAsync<DBContext.DBConfia.Cortes.RelacionCortes>("SELECT TOP 1 fechaCorte FROM Cortes.RelacionCortes GROUP BY fechaCorte ORDER BY fechaCorte DESC").SingleOrDefaultAsync();

            await DBContext.Destroy();
            return Ok(relCortes);
        }



        [HttpPost]
        [Route("gethistorico")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetHistorico(GetFecha parData)
        {
            var res = await DBContext.database.FetchAsync<FechaCorteHistorico_VW>("WHERE (SucursalID = @SucursalID OR @SucursalID = 0) ORDER BY fecha DESC", parData);
            await DBContext.Destroy();
            return Ok(res);
        }
    }
}