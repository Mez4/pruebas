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
    public class CarpetaController : ControllerBase
    {
        private DBConfiaContext DBContext;


        public CarpetaController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(PeticionesRest.MesaCredito.Carpeta.Get parData)
        {
            if (parData.id != 0)
            {
                try
                {
                    var res = await DBContext.database.SingleByIdAsync<Carpeta>(parData.id);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            var res1 = await DBContext.database.FetchAsync<Carpeta>();
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.MesaCredito.Carpeta.Add parData)
        {
            try
            {
                var carpeta = new Carpeta()
                {

                    carpeta = parData.carpeta,
                    productoId = parData.productoId,
                    estatusCreditoId = parData.estatusCreditoId,
                    solicitudCreditoId = parData.solicitudCreditoId,
                    fechaAlta = parData.fechaAlta,
                    fechaMod = parData.fechaMod,
                    fechaBaja = parData.fechaBaja,
                    usuarioID = parData.usuarioID,
                    activo = parData.activo

                };
                await DBContext.database.InsertAsync(carpeta);
                await DBContext.Destroy();
                return Ok(carpeta);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.MesaCredito.Carpeta.Update parData)
        {
            try
            {
                var carpeta = await DBContext.database.SingleByIdAsync<Carpeta>(parData.id);

                carpeta.id = parData.id;
                carpeta.carpeta = parData.carpeta;
                carpeta.productoId = parData.productoId;
                carpeta.estatusCreditoId = parData.estatusCreditoId;
                carpeta.solicitudCreditoId = parData.solicitudCreditoId;
                carpeta.fechaAlta = parData.fechaAlta;
                carpeta.fechaMod = parData.fechaMod;
                carpeta.fechaBaja = parData.fechaBaja;
                carpeta.usuarioID = parData.usuarioID;
                carpeta.activo = parData.activo;
                await DBContext.database.UpdateAsync(carpeta);
                await DBContext.Destroy();
                return Ok(carpeta);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}
