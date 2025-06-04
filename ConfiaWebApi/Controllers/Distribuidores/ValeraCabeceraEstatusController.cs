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
    public class ValeraCabeceraEstatusController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public ValeraCabeceraEstatusController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Distribuidores.ValeraCabeceraEstatus.Get parData)
        {
            if (parData.id != 0)
            {
                var res = await DBContext.database.SingleByIdAsync<ValerasCabeceraEstatus>(parData.id);
                await DBContext.Destroy();
                return Ok(res);
            }
            var res1 = await DBContext.database.FetchAsync<ValerasCabeceraEstatus>();
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Distribuidores.ValeraCabeceraEstatus.Add parData)
        {
            try
            {
                var estatus = new ValerasCabeceraEstatus()
                {
                    ValerasCabeceraEstatusID = parData.ValerasCabeceraEstatusID,
                    Estatus = parData.Estatus
                };
                await DBContext.database.InsertAsync<ValerasCabeceraEstatus>(estatus);
                await DBContext.Destroy();
                return Ok(estatus);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Distribuidores.ValeraCabeceraEstatus.Update parData)
        {
            try
            {
                var estatus = await DBContext.database.SingleByIdAsync<ValerasCabeceraEstatus>(parData.ValerasCabeceraEstatusID);
                estatus.ValerasCabeceraEstatusID = parData.ValerasCabeceraEstatusID;
                estatus.Estatus = parData.Estatus;
                await DBContext.database.UpdateAsync(estatus);
                await DBContext.Destroy();
                return Ok(estatus);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }


    }
}
