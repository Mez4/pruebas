using DBContext.DBConfia;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.MesaCredito
{
    [Authorize]
    [ApiController]
    [Route("api/MesaCredito/[controller]")]
    public class AsignaAnalistaProspectoController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public AsignaAnalistaProspectoController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }


        [HttpPost]
        [Route("GetAsignaAnalistaProspecto")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> GetAnalistas(ConfiaWebApi.PeticionesRest.MesaCredito.AsignaAnalistaProspecto.GetParams parData)
        {

            try
            {
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.PeticionesRest.MesaCredito.AsignaAnalistaProspecto.GetAsignaAnalistaProspecto>("EXEC sp_AsignaAnalistaProspecto @SolicitudMesaCreditoID  ,@AsignaAnalistaID  ,@enSucursal  ,@CatValidacionMesaID ", parData).ToListAsync();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }


        }
        [HttpPost]
        [Route("GetDistribuidoresNiveles")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> GetDistribuidoresNiveles()
        {

            try
            {
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.PeticionesRest.MesaCredito.AsignaAnalistaProspecto.GetDistribuidoresNiveles>("EXEC sp_DistribuidoresNiveles").ToListAsync();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }


        }

        [HttpPost]
        [Route("GetDistribuidoresEstatus")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> GetDistribuidoresEstatus()
        {

            try
            {
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.PeticionesRest.MesaCredito.AsignaAnalistaProspecto.GetDistribuidoresEstatus>("EXEC sp_DistribuidoresEstatus").ToListAsync();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }
    }
}

