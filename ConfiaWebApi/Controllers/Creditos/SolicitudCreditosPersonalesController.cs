using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Prospeccion;
using DBContext.DBConfia.Catalogos;
using DBContext.DBConfia.Seguridad;
using System.IO;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using ConfiaWebApi.PeticionesRest.Prospeccion.Documentos;
using ConfiaWebApi.ModlesSP.Prospeccion;
using System.Net;
using System.Collections;

namespace ConfiaWebApi.Controllers.Creditos.SolicitudCreditosPersonales
{
    [Authorize]
    [ApiController]
    [Route("api/Creditos/[controller]")]

    public class SolicitudCreditosPersonalesController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public SolicitudCreditosPersonalesController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("getSolicitudCreditosPersonales")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get()
        {
            int ProductoID = 9999;
            int.TryParse(Request.Headers["ProductoID"], out ProductoID);

            try
            {
                var obj2 = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.SolicitudCreditosPersonales_VW>("WHERE ProductoId = @0", ProductoID).ToArrayAsync();
                //var obj2 = await DBContext.database.FetchAsync<DBContext.DBConfia.Creditos.SolicitudCreditosPersonales_VW>();
                await DBContext.Destroy();
                return Ok(obj2);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("Aceptar")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Aceptar(PeticionesRest.Creditos.SolicitudCreditosPersonales.Aceptar parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var Solicitudes = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.SolicitudCreditosPersonales>("WHERE (SolicitudCreditosPersonalesID = @0)", parData.SolicitudCreditosPersonalesID).FirstOrDefaultAsync();

                DBContext.database.BeginTransaction();

                parData.ProductoID = Solicitudes.ProductoId;
                parData.DistribuidorId = ((int)Solicitudes.DistribuidorId);
                parData.ClienteId = ((int)Solicitudes.DistribuidorId);
                parData.SucursalId = Solicitudes.SucursalId;
                parData.CajaID = Solicitudes.CajaID;
                parData.Capital = ((int)Solicitudes.Capital);
                parData.Plazos = Solicitudes.Plazos;
                parData.UsuarioId = Solicitudes.UsuarioSolicitaID;
                parData.TipoDesembolsoID = Solicitudes.TipoDesembolsoID;
                parData.PersonaID = Solicitudes.PersonaSolicitaID;

                if (parData.personasDatosBancariosID != 0)
                {
                    parData.personasDatosBancariosID = Solicitudes.personaDatosBancariosID.Value;
                }

                if (parData.VentaId == 0)
                {
                    var Venta = new Ventas()
                    {
                        UsuarioIDRegistro = UsuarioActual.UsuarioID,
                        PersonaIDRegistro = (long)UsuarioActual.UsuarioID,
                        FechaHoraRegistro = DateTime.Now
                    };

                    await DBContext.database.InsertAsync(Venta);

                    parData.VentaId = Venta.VentaId;
                }

                int? DistribuidorId = parData.DistribuidorId == 0 ? null : parData.DistribuidorId;
                int? ClienteId = parData.DistribuidorId == 0 ? null : parData.ClienteId;
                long? SerieId = parData.SerieId == 0 ? null : parData.SerieId;
                long? Folio = parData.Folio == 0 ? null : parData.Folio;

                var parms = new
                {
                    parData.ProductoID,
                    parData.SucursalId,
                    parData.CajaID,
                    parData.Capital,
                    parData.Plazos,
                    parData.UsuarioId,
                    parData.TipoDesembolsoID,
                    parData.PersonaID,
                    parData.MovimientoID,
                    parData.CuentaId,
                    parData.JsonTda,
                    DistribuidorId,
                    ClienteId,
                    SerieId,
                    Folio
                };

                string Stored = "";

                Stored = "EXEC Creditos.pa_PrestamoDistribuidor_Ins @ProductoID ,@DistribuidorId ,@ClienteId ,@SucursalId ,@CajaID ,@Capital ,@Plazos ,@UsuarioId ,@TipoDesembolsoID ,@PersonaID ,@MovimientoID ,@PrestamoNomina ";

                var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Custom.Creditos.CanjeaValeRes>(Stored, parData).FirstOrDefaultAsync();

                if (res.regresa != 1)
                {
                    DBContext.database.AbortTransaction();
                    return Ok(res);
                }

                var Credito = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoID = @0", res.CreditoId).FirstOrDefaultAsync();

                Credito.VentaId = parData.VentaId;

                if (parData.personasDatosBancariosID != 0)
                {
                    Credito.personasDatosBancariosID = parData.personasDatosBancariosID;
                }

                await DBContext.database.UpdateAsync(Credito);

                DBContext.database.CompleteTransaction();

                res.VentaId = parData.VentaId;


                if (res.regresa == 1)
                {
                    Solicitudes.Estatus = true;
                    Solicitudes.UsuarioEstatusID = UsuarioActual.UsuarioID;
                    Solicitudes.PersonaEstatusID = (long)UsuarioActual.PersonaID;
                    Solicitudes.FechaEstatus = DateTime.Now;
                    Solicitudes.CreditoId = ((int)Credito.CreditoID);

                }

                await DBContext.database.UpdateAsync(Solicitudes);
                var res2 = await DBContext.database.QueryAsync<SolicitudCreditosPersonales_VW>("WHERE (SolicitudCreditosPersonalesID = @0)", Solicitudes.SolicitudCreditosPersonalesID).FirstOrDefaultAsync();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("Rechazar")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Rechazar(PeticionesRest.Creditos.SolicitudCreditosPersonales.Rechazar parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var Solicitudes = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.SolicitudCreditosPersonales>("WHERE (SolicitudCreditosPersonalesID = @0)", parData.SolicitudCreditosPersonalesID).FirstOrDefaultAsync();

                Solicitudes.Estatus = false;
                Solicitudes.UsuarioEstatusID = UsuarioActual.UsuarioID;
                Solicitudes.PersonaEstatusID = (long)UsuarioActual.PersonaID;
                Solicitudes.FechaEstatus = DateTime.Now;

                await DBContext.database.UpdateAsync(Solicitudes);
                var res = await DBContext.database.QueryAsync<SolicitudCreditosPersonales_VW>("WHERE (SolicitudCreditosPersonalesID = @0)", Solicitudes.SolicitudCreditosPersonalesID).FirstOrDefaultAsync();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

    }
}