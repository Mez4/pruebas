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
    public class sp_DocumentosController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public sp_DocumentosController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }


        [HttpPost]
        [Route("Getsp_Documentos")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Getsp_Documentos(ConfiaWebApi.PeticionesRest.MesaCredito.sp_Documentos.GetParams parData)
        {

            try
            {
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.PeticionesRest.MesaCredito.sp_Documentos.Getsp_Documentos>("EXEC sp_Documentos @SolicitudMesaCreditoID , @tipo", parData).ToListAsync();
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
        [Route("Getsp_DocumentosInsert")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Getsp_DocumentosInsert(ConfiaWebApi.PeticionesRest.MesaCredito.sp_Documentos.GetParams parData)
        {

            try
            {
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.PeticionesRest.MesaCredito.sp_Documentos.Getsp_DocumentosInsert>("EXEC sp_Documentos @SolicitudMesaCreditoID , @tipo", parData).ToListAsync();
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

