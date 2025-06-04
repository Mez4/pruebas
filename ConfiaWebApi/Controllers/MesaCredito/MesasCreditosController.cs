using DBContext.DBConfia;
using DBContext.DBConfia.MesaCredito;
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
    public class MesasCreditosController : ControllerBase
    {
        private DBConfiaContext DBContext;


        public MesasCreditosController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(PeticionesRest.MesaCredito.MesasCreditos.Get parData)
        {
            if (parData.MesaCreditoID != 0)
            {
                try
                {
                    var res = await DBContext.database.SingleByIdAsync<MesasCreditos>(parData.MesaCreditoID);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            var res1 = await DBContext.database.FetchAsync<MesasCreditos>();
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.MesaCredito.MesasCreditos.Add parData)
        {
            try
            {
                var mesacredito = new MesasCreditos()
                {

                    Nombre = parData.Nombre,
                    Clave = parData.Clave,
                    Activo = parData.Activo
                };
                await DBContext.database.InsertAsync(mesacredito);
                await DBContext.Destroy();
                return Ok(mesacredito);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("update")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.MesaCredito.MesasCreditos.Update parData)
        {
            try
            {
                var mesacredito = await DBContext.database.SingleByIdAsync<MesasCreditos>(parData.MesaCreditoID);
                mesacredito.MesaCreditoID = parData.MesaCreditoID;
                mesacredito.Nombre = parData.Nombre;
                mesacredito.Clave = parData.Clave;
                mesacredito.Activo = parData.Activo;

                await DBContext.database.UpdateAsync(mesacredito);
                await DBContext.Destroy();
                return Ok(mesacredito);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

    }
}
