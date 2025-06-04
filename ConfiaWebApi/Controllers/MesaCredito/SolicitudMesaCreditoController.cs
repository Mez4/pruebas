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
    public class SolicitudMesaCreditoController : ControllerBase
    {
        private DBConfiaContext DBContext;


        public SolicitudMesaCreditoController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }
        [HttpPost]
        [Route("get")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(string EstatusValidacion = null, string FechaHoraRegistro = null)
        {
            if (EstatusValidacion != null && FechaHoraRegistro != null)
            {
                PeticionesRest.MesaCredito.SolicitudMesaCredito.Get sg = new PeticionesRest.MesaCredito.SolicitudMesaCredito.Get();

                sg.EstatusValidacion = EstatusValidacion;
                sg.FechaHoraRegistro = FechaHoraRegistro;

                try
                {
                    var res1 = await DBContext.database.QueryAsync<ConfiaWebApi.PeticionesRest.MesaCredito.SolicitudMesaCredito.Respuesta>("EXEC sp_GetSolicitudMesaCredito @EstatusValidacion, @FechaHoraRegistro", sg).ToListAsync();
                    await DBContext.Destroy();
                    return Ok(res1);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            else if (EstatusValidacion != null && FechaHoraRegistro == null)
            {
                PeticionesRest.MesaCredito.SolicitudMesaCredito.Get sg = new PeticionesRest.MesaCredito.SolicitudMesaCredito.Get();

                sg.EstatusValidacion = EstatusValidacion;

                try
                {
                    var res2 = await DBContext.database.QueryAsync<ConfiaWebApi.PeticionesRest.MesaCredito.SolicitudMesaCredito.Respuesta>("EXEC sp_GetSolicitudMesaCredito @EstatusValidacion", sg).ToListAsync();
                    await DBContext.Destroy();
                    return Ok(res2);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }
            }
            else if (EstatusValidacion == null && FechaHoraRegistro != null)
            {
                PeticionesRest.MesaCredito.SolicitudMesaCredito.Get sg = new PeticionesRest.MesaCredito.SolicitudMesaCredito.Get();


                sg.FechaHoraRegistro = FechaHoraRegistro;
                try
                {
                    var res3 = await DBContext.database.QueryAsync<ConfiaWebApi.PeticionesRest.MesaCredito.SolicitudMesaCredito.Respuesta>("EXEC sp_GetSolicitudMesaCredito null , @FechaHoraRegistro", sg).ToListAsync();
                    await DBContext.Destroy();
                    return Ok(res3);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }
            }
            var res = await DBContext.database.QueryAsync<ConfiaWebApi.PeticionesRest.MesaCredito.SolicitudMesaCredito.Respuesta>("EXEC sp_GetSolicitudMesaCredito").ToListAsync();
            await DBContext.Destroy();
            return Ok(res);
        }
        //[HttpPost]
        //[Route("get")]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        //public async Task<IActionResult> Get(PeticionesRest.MesaCredito.SolicitudMesaCredito.Get parData)
        //{
        //    if (parData.SolicitudMesaCreditoID != 0)
        //    {
        //        try
        //        {
        //            return Ok(await DBContext.database.SingleByIdAsync<SolicitudMesaCredito>(parData.SolicitudMesaCreditoID));
        //        }
        //        catch (Exception ex)
        //        {
        //            return NotFound(ex.Message);
        //        }

        //    }

        //    return Ok(await DBContext.database.FetchAsync<SolicitudMesaCredito>());
        //}

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.MesaCredito.SolicitudMesaCredito.Add parData)
        {
            try
            {
                var solicitudmesacredito = new SolicitudMesaCredito()
                {
                    PersonaID = parData.PersonaID,
                    ProductoID = parData.ProductoID,
                    SucursalID = parData.SucursalID,
                    UsuarioRegistraID = parData.UsuarioRegistraID,
                    FechaHoraRegistro = parData.FechaHoraRegistro,
                    FechaHoraResolucion = parData.FechaHoraResolucion,
                    EstatusValidacionID = parData.EstatusValidacionID,
                    GrupoID = parData.GrupoID,
                    CreditoID = parData.CreditoID,
                    PersonaRegistraID = parData.PersonaRegistraID
                };
                await DBContext.database.InsertAsync(solicitudmesacredito);
                await DBContext.Destroy();
                return Ok(solicitudmesacredito);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.MesaCredito.SolicitudMesaCredito.Update parData)
        {
            try
            {
                var solicitudmesacredito = await DBContext.database.SingleByIdAsync<SolicitudMesaCredito>(parData.SolicitudMesaCreditoID);
                solicitudmesacredito.PersonaID = parData.PersonaID;
                solicitudmesacredito.ProductoID = parData.ProductoID;
                solicitudmesacredito.SucursalID = parData.SucursalID;
                solicitudmesacredito.UsuarioRegistraID = parData.UsuarioRegistraID;
                solicitudmesacredito.FechaHoraRegistro = parData.FechaHoraRegistro;
                solicitudmesacredito.FechaHoraResolucion = parData.FechaHoraResolucion;
                solicitudmesacredito.EstatusValidacionID = parData.EstatusValidacionID;
                solicitudmesacredito.GrupoID = parData.GrupoID;
                solicitudmesacredito.CreditoID = parData.CreditoID;
                solicitudmesacredito.PersonaRegistraID = parData.PersonaRegistraID;

                await DBContext.database.UpdateAsync(solicitudmesacredito);
                await DBContext.Destroy();
                return Ok(solicitudmesacredito);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }




    }
}
