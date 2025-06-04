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
    [Route("api/Catalogos/[controller]")]
    public class SolicitudesCreditoController : ControllerBase
    {
        private DBConfiaContext DBContext;


        public SolicitudesCreditoController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(PeticionesRest.MesaCredito.SolicitudesCredito.Get parData)
        {
            if (parData.ID != 0)
            {
                try
                {
                    var res = await DBContext.database.SingleByIdAsync<SolicitudesCredito>(parData.ID);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            var res1 = await DBContext.database.FetchAsync<SolicitudesCredito>();
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.MesaCredito.SolicitudesCredito.Add parData)
        {
            try
            {
                var solicitudes = new SolicitudesCredito()
                {


                    PersonaID = parData.PersonaID,
                    ProductoID = parData.ProductoID,
                    SucursalID = parData.SucursalID,
                    ProspectoID = parData.ProspectoID,
                    UsuarioRegistraID = parData.UsuarioRegistraID,
                    FechaHoraRegistro = parData.FechaHoraRegistro,
                    FechaHoraResolucion = parData.FechaHoraResolucion,
                    EstatusValidacionID = parData.EstatusValidacionID,
                    EstatusAsignacionID = parData.EstatusAsignacionID
                };
                await DBContext.database.InsertAsync(solicitudes);
                await DBContext.Destroy();
                return Ok(solicitudes);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.MesaCredito.SolicitudesCredito.Update parData)
        {
            try
            {
                var solicitud = await DBContext.database.SingleByIdAsync<SolicitudesCredito>(parData.ID);
                solicitud.ID = parData.ID;
                solicitud.PersonaID = parData.PersonaID;
                solicitud.ProductoID = parData.ProductoID;
                solicitud.SucursalID = parData.SucursalID;
                solicitud.ProspectoID = parData.ProspectoID;
                solicitud.UsuarioRegistraID = parData.UsuarioRegistraID;
                solicitud.FechaHoraRegistro = parData.FechaHoraRegistro;
                solicitud.FechaHoraResolucion = parData.FechaHoraResolucion;
                solicitud.EstatusValidacionID = parData.EstatusValidacionID;
                solicitud.EstatusAsignacionID = parData.EstatusAsignacionID;
                await DBContext.database.UpdateAsync(solicitud);
                await DBContext.Destroy();
                return Ok(solicitud);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }



        [HttpPost]
        [Route("getsc")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> GetSC()
        {
            try
            {
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.PeticionesRest.MesaCredito.SolicitudesCredito.GetSC>("EXEC sp_MesaCredito_Solicitud_Credito").ToListAsync();
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
