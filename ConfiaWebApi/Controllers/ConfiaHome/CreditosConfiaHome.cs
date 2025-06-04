using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using System.Collections;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Seguridad;


namespace ConfiaWebApi.Controllers.CreditosConfiaHome
{
    public class creditoConfiaHome : ControllerBase
    {
        private DBConfiaContext ConexionBD;
        public creditoConfiaHome(DBConfiaContext _ConexionBD)
        {
            ConexionBD = _ConexionBD;
        }
    

        [HttpPost]
        [Route("CreditoConfiaHome")]
        //[Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> CreditoConfiaHome(PeticionesRest.Creditos.Credito.CrediConfiaHome parData)
        {
            try
            {
                string query = "EXEC Creditos.pa_CreaCreditoConfiaHome_Ins @DistribuidorId, @Capital";
                var res = await ConexionBD.database.FetchAsync<dynamic>(query, parData);

                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }



    
    
    
    }
}
