using System;
using System.Linq;
using DBContext.DBConfia;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DBContext.DBConfia.Seguridad;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;
using ConfiaWebApi.PeticionesRest.Creditos.SolicitudPrimerCanje;
using DBContext.DBConfia.Creditos;
using ConfiaWebApi.ModlesSP.Creditos;
using DBContext.DBConfia.Custom.Creditos;



namespace ConfiaWebApi.Controllers.Distribuidores
{

    [Authorize]
    [ApiController]
    [Route("api/Distribuidores/[controller]")]
    public class SolicitudesPrimerCanjeController : ControllerBase
    {

        private DBConfiaContext DBContext;
        private IConfiguration Configuracion;

        public SolicitudesPrimerCanjeController(IConfiguration _Configuration, DBConfiaContext _DBContext)
        {
            this.Configuracion = _Configuration;

            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("obtenerSolicitudesPrimerCanje")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetPrimerosCanjes(ConfiaWebApi.PeticionesRest.Creditos.SolicitudPrimerCanje.Get parData)
        {
            try
            {
                int ProductoID = 9999;
                int.TryParse(Request.Headers["ProductoID"], out ProductoID);
                parData.ProductoID = ProductoID;
                string query = "EXEC Creditos.pa_MuestraPrimerCanjeapp  @ProductoID";
                var res = await DBContext.database.QueryAsync<SpSolicitudPrimerCanje>(query, parData).ToArrayAsync();
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
        [Route("obtenerIneSolicitudPrestamo")]
        [Authorize]
        [Code.TProteccionProducto]

        public async Task<IActionResult> obtenerIneSolicitudPrestamo(ConfiaWebApi.PeticionesRest.Creditos.SolicitudPrimerCanje.GetIne parData)
        {
            try
            {

                await DBContext.Destroy();
                return Ok(new { });
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("AceptarSolicitud")]
        [Code.TProteccionProducto]
        [Authorize]
        public async Task<IActionResult> AceptarSolicitud(ConfiaWebApi.PeticionesRest.Creditos.SolicitudPrimerCanje.Aceptar parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var solicitud = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Creditos.SolicitudCreditosCV>("WHERE SolicitudCreditoID=@0", parData.SolicitudPrimerCanjeID).SingleOrDefaultAsync();

                // var parms = new
                // {
                //     ProductoID = solicitud.SistemaID,
                //     DistribuidorId = solicitud.DistribuidorID,
                //     ClienteId = solicitud.ClienteID,
                //     SucursalId = solicitud.SucursalID,
                //     CajaID = 2,
                //     SerieId = "-1",
                //     Folio = "",  // Define un valor adecuado si 'Folio' es necesario
                //     Capital = solicitud.Monto,
                //     Plazos = solicitud.Plazos,
                //     UsuarioId = UsuarioActual.UsuarioID,
                //     TipoDesembolsoID = 7,
                //     PersonaID = UsuarioActual.PersonaID,
                //     MovimientoID = "", // Define si es necesario
                //     FechaExpedicion = DateTime.Now, // Define si es necesario
                //     NombreBeneficiario = "", // Define si es necesario
                //     ApellidoPaternoBeneficiario = "", // Define si es necesario
                //     ApellidoMaternoBeneficiario = "", // Define si es necesario
                //     ParentescoBeneficiario = "", // Define si es necesario
                //     FechaNacimientoBeneficiario = "", // Define si es necesario
                //     Monto = solicitud.Monto, // Asegúrate de que este valor esté correcto
                //     Validado = true // Define si es necesario
                // };

                // string Stored = "EXEC Creditos.pa_CanjeaValePrimerCanje_Ins @ProductoID, @DistribuidorId, @ClienteId, @SucursalId, @CajaID, @SerieId, @Folio, @Capital, @Plazos, @UsuarioId, @TipoDesembolsoID, @PersonaID, @MovimientoID, @FechaExpedicion, @NombreBeneficiario, @ApellidoPaternoBeneficiario, @ApellidoMaternoBeneficiario, @ParentescoBeneficiario, @FechaNacimientoBeneficiario, @Monto, @Validado";

                // // Ejecutar el procedimiento almacenado con 'parms'
                // var res = await DBContext.database.QueryAsync<CanjeaValeRes>(Stored, parms).FirstOrDefaultAsync();


                // if (res.regresa != 1)
                // {
                //     DBContext.database.AbortTransaction();
                //     return Ok(res);
                // }


                // solicitud.EstatusID = "A";
                // solicitud.UsuarioIDAutoriza = UsuarioActual.UsuarioID;
                // solicitud.FechaHoraAutoriza = DateTime.Now;
                // solicitud.CreditoID = res.CreditoId;

                // await DBContext.database.UpdateAsync(solicitud);
                await DBContext.Destroy();
                return Ok(new
                {
                    estatus = 1,
                    // mensaje = "Solicitud primer canje aceptada correctamente con el Credito No: " + res.CreditoId,
                    data = new { }
                });

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("Cancelacion")]
        [Code.TProteccionProducto]
        [Authorize]
        public async Task<IActionResult> Cancelacion(ConfiaWebApi.PeticionesRest.Creditos.SolicitudPrimerCanje.Rechazar parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var solicitud = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Creditos.SolicitudCreditosCV>("WHERE SolicitudCreditoID=@0", parData.SolicitudPrimerCanjeID).SingleOrDefaultAsync();

                // solicitud.EstatusID = "C";
                // solicitud.FechaHoraCancela = DateTime.Now;
                // solicitud.UsuarioIDCancela = UsuarioActual.UsuarioID;

                // await DBContext.database.UpdateAsync(solicitud);
                await DBContext.Destroy();

                return Ok(new
                {
                    estatus = 1,
                    mensaje = "Solicitud primer canje cancelada correctamente",
                    data = new { }
                });

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("obtenerIneCliente/{ClienteID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> obtenerIneCliente(Int64 ClienteID)
        {
            try
            {
                var cliente = await DBContext.database.FirstAsync<Clientes_VW>("WHERE ClienteID=@0", ClienteID);
                var ine = await DBContext.database.FirstAsync<dynamic>("SELECT o.frenteIne, o.reversoIne FROM  DBConfia_Personas.dbo.OCRIne o WHERE curp=@0", cliente.CURP);
                return Ok(ine);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

    }
}

