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
    public class MonedaSatController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public MonedaSatController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        private object ObjectMonedaSAT(MonedaSAT moneda)
        {
            var res = new
            {
                moneda.MonedaSatID,
                moneda.NombreMoneda,
                moneda.TipoCambio,
                moneda.ClaveMonedaSat,
                Fecha = moneda.Fecha.ToString("dd/MM/yyyy")
            };
            return res;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Tesoreria.MonedaSat.Get parData)
        {
            if (parData.id != 0)
            {
                var SatMoneda = await DBContext.database.SingleByIdAsync<MonedaSAT>(parData.id);
                await DBContext.Destroy();
                return Ok(ObjectMonedaSAT(SatMoneda));
            }

            List<object> respList = new List<object>();
            var ListSatMoneda = await DBContext.database.FetchAsync<MonedaSAT>();
            foreach (var item in ListSatMoneda)
            {
                respList.Add(ObjectMonedaSAT(item));
            }
            await DBContext.Destroy();
            return Ok(respList);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Tesoreria.MonedaSat.Add parData)
        {
            try
            {
                var SatMoneda = new MonedaSAT()
                {
                    ClaveMonedaSat = parData.ClaveMonedaSat,
                    Fecha = parData.Fecha,
                    NombreMoneda = parData.NombreMoneda,
                    TipoCambio = parData.TipoCambio,
                };
                await DBContext.database.InsertAsync<MonedaSAT>(SatMoneda);
                await DBContext.Destroy();
                return Ok(ObjectMonedaSAT(SatMoneda));
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Tesoreria.MonedaSat.Update parData)
        {
            try
            {
                var SatMoneda = await DBContext.database.SingleByIdAsync<MonedaSAT>(parData.MonedaSatID);
                SatMoneda.Fecha = parData.Fecha;
                SatMoneda.ClaveMonedaSat = parData.ClaveMonedaSat;
                SatMoneda.NombreMoneda = parData.NombreMoneda;
                SatMoneda.TipoCambio = parData.TipoCambio;
                await DBContext.database.UpdateAsync(SatMoneda);
                await DBContext.Destroy();
                return Ok(ObjectMonedaSAT(SatMoneda));
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }
    }
}
