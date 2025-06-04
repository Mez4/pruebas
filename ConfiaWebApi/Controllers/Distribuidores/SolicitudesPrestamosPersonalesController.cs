using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Distribuidores;
using DBContext.DBConfia.Sistema;
using System.Collections;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Creditos;
using Newtonsoft.Json;
using ConfiaWebApi.RespuestasPersonalizadas.Distribuidores.Lealtad;
using ConfiaWebApi.Code;
using System.Collections.Generic;
using DBContext.DBConfia.Seguridad;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.IO;
using System.Net.Http.Headers;
using System.Net;
using ConfiaWebApi.PeticionesRest.Prospeccion.Documentos;
using ConfiaWebApi.PeticionesRest.Distribuidores.SolicitudPrestamosPersonales;
using ConfiaWebApi.PeticionesRest.Creditos.SolicitudCreditosPersonales;
using ConfiaWebApi.PeticionesRest.General.Personas;
using DBContext.DBConfia.Compras;
using ConfiaWebApi.PeticionesRest.Distribuidores.Distribuidor;
using iText.Layout.Borders;
using Microsoft.OpenApi.Any;



namespace ConfiaWebApi.Controllers.Distribuidores
{

    [Authorize]
    [ApiController]
    [Route("api/Distribuidores/[controller]")]
    public class SolicitudesPrestamosPersonalesController : ControllerBase
    {

        private DBConfiaContext DBContext;
        private IConfiguration Configuracion;

        public SolicitudesPrestamosPersonalesController(IConfiguration _Configuration, DBConfiaContext _DBContext)
        {
            this.Configuracion = _Configuration;

            DBContext = _DBContext;
        }

        [HttpGet]
        [Route("GetSucursalesSelect")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetSucursalesSelect()
        {
            try
            {
                var sucursales = await DBContext.database.FetchAsync<Sucursales_VW>();
                await DBContext.Destroy();
                return Ok(sucursales);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("obtenerEstatusPrestamo")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> obtenerEstatusPrestamo()
        {
            try
            {
                var estatusPrestamo = await DBContext.database.FetchAsync<DBContext.DBConfia.Distribuidores.SolicitudesPrestamosPersonalesEstatus>();
                await DBContext.Destroy();
                return Ok(estatusPrestamo);
            }
            catch (Exception ex)
            {

                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        //Obtenemos la línea de crédito del distribuidor cuando sea P.Personal
        [HttpGet]
        [Route("obtenerContrato/{DistribuidorID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> obtenerContrato(int DistribuidorID)
        {
            try
            {
                var contrato = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.Contratos_VW>("WHERE DistribuidorID = @0 AND ProductoNombre LIKE @1", DistribuidorID, "%P. Personal%").FirstOrDefaultAsync();
                //var contrato = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.Contratos_VW>("WHERE DistribuidorID=@0 AND ProductoNombre = 'P. Personal'", DistribuidorID).FirstOrDefaultAsync();
                await DBContext.Destroy();
                return Ok(contrato);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("altaSolicitudPrestamo")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Alta(PeticionesRest.Distribuidores.SolicitudPrestamosPersonales.altaSolicitudPrestamo parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            try
            {

                var solicitudesMismoCorte = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesPrestamos_VW>("WHERE DistribuidorID = @0 AND EstatusID NOT IN (3) AND FechaSolicitud > DATEADD(DAY, -15, GETDATE())", parData.DistribuidorID).ToArrayAsync();
                if (solicitudesMismoCorte.Length > 0)
                {
                    return BadRequest("No es posible realizar la solicitud porque ya se tiene una pendiente de este corte");
                }

                var solicitudesReest = await DBContext.database.QueryAsync<dynamic>(@"
                    SELECT count(*) AS 'HDR' FROM 
                        Reestructura.HerramientasDeRescate hdr
                    WHERE 
                        DATEADD(DAY, hdr.Plazos * 15, hdr.FechaRegistro) > GETDATE()
                        AND hdr.DistribuidorID = @0;
                    ", parData.DistribuidorID).FirstOrDefaultAsync();

                if (solicitudesReest.HDR > 0)
                {
                    return BadRequest("La socia está en reestructura, no puede solicitar préstamos personales");
                }
                var prestamo = new DBContext.DBConfia.Distribuidores.SolicitudesPrestamosPersonales();
                //var LineaActualizada = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.Contratos>("WHERE ProductoID = @0 AND DistribuidorID = @1 ", parData.ProductoID, parData.DistribuidorID).FirstOrDefaultAsync();

                //Tomamos la linea de contrato de la persona
                var contrato = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.Contratos_VW>("WHERE DistribuidorID = @0 AND ProductoNombre LIKE @1", parData.DistribuidorID, "%P. Personal%").FirstOrDefaultAsync();
                //descomentar var Sucursal = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Distribuidores_VW>("WHERE DistribuidorID=@DistribuidorID AND ProductoID=@ProductoID", parData).FirstOrDefaultAsync();
                var contrato2 = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.Contratos_VW>("WHERE DistribuidorID=@0", parData.DistribuidorID).FirstOrDefaultAsync();

                var Sucursal = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Distribuidores_VW>("WHERE DistribuidorID=@0", parData.DistribuidorID).FirstOrDefaultAsync();
                var producto = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.ProductosVW>("WHERE EmpresaId=@0 AND PrestamoPersonal = 1", parData.EmpresaId).FirstOrDefaultAsync();

                prestamo.FechaSolicitud = DateTime.Now;
                prestamo.ProductoID = producto.ProductoID;
                prestamo.SucursalID = Sucursal.SucursalID;
                prestamo.DistribuidorID = parData.DistribuidorID;
                prestamo.ContratoID = contrato.ContratoID;
                prestamo.ContratoPlanPagos = contrato2.ContratoID;
                prestamo.PrestamoSolicitado = parData.PrestamoSolicitado;
                prestamo.EstatusID = 4;
                prestamo.UsuarioSolicitoID = UsuarioActual.UsuarioID;
                prestamo.Observaciones = parData.Observaciones;
                prestamo.PlazoSolicitado = parData.PlazoSolicitado;

                if (parData.TipoDesembolso == 2)
                {
                    prestamo.SPEI = true;
                }
                else
                {
                    prestamo.SPEI = false;
                }


                await DBContext.database.InsertAsync(prestamo);
                var objeto = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesPrestamos_VW>("WHERE SolicitudPrestamoPersonalID = @0", prestamo.SolicitudPrestamoPersonalID).SingleOrDefaultAsync();

                var resultAuto = await DBContext.database.QueryAsync<SolicitudesPrestamosPersonalesCheck>("EXEC Distribuidores.pa_PrestamoPersonal @0", prestamo.SolicitudPrestamoPersonalID).FirstOrDefaultAsync();
                prestamo.Observaciones = resultAuto.status <= 0 ? $"{parData.Observaciones}. Razón de revisión: {resultAuto.msg}" : parData.Observaciones;

                await DBContext.database.UpdateAsync(prestamo);
                if (resultAuto.status > 0)
                {
                    PrestamoM thisData = new()
                    {
                        SolicitudPrestamoPersonalID = prestamo.SolicitudPrestamoPersonalID
                    };
                    await AceptarSolicitud(thisData);
                    await DBContext.Destroy();
                    return Ok(objeto);

                }
                else
                {
                    await DBContext.Destroy();
                    return Ok(new
                    {
                        status = 401,
                        data = $"Razón de revisión: {resultAuto.msg}. Recuerde adjuntar la evidencia corresponidente. ",
                        SolicitudID = prestamo.SolicitudPrestamoPersonalID
                    });
                }

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        //Obtener el plan de pagos para cada solicitud
        [HttpGet]
        [Route("obtenerPlanDePagos/{SolicitudPrestamoPersonalID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> obtenerPlanDePagos(int SolicitudPrestamoPersonalID)
        {
            try
            {
                var prestamo = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesPrestamosPersonalesNoPagos>("WHERE SolicitudPrestamoPersonalID=@0 AND Capital > 99 ", SolicitudPrestamoPersonalID).ToArrayAsync();

                ArrayList res = new();
                foreach (var A in prestamo)
                {
                    res.Add(new
                    {
                        DistribuidorID = A.DistribuidorID,
                        SolicitudPrestamoPersonalID = A.SolicitudPrestamoPersonalID,
                        NoPago = A.NoPago,
                        Capital = A.Capital,
                        Interes = A.Interes,
                        ImporteTotal = A.ImporteTotal,
                    });
                }

                await DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }




        [HttpGet]
        [Route("getPrestamoDistribuidor/{DistribuidorID}")]
        [Authorize]
        [Code.TProteccionProducto]
        // [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> getPrestamoDistribuidor(int DistribuidorID)
        {
            try
            {
                var prestamo = await DBContext.database.FetchAsync<DBContext.DBConfia.Distribuidores.SolicitudesPrestamosPersonalesNoPagos>("WHERE  (DistribuidorID = @0)", DistribuidorID);
                await DBContext.Destroy();
                return Ok(prestamo);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }


        [HttpGet]
        [Route("obtenerSolicitudPrestamo")]
        [Authorize]
        [Code.TProteccionProducto]

        public async Task<IActionResult> GetPrestamos()
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var prestamo = await DBContext.database.FetchAsync<DBContext.DBConfia.Distribuidores.SolicitudesPrestamos_VW>();

                ArrayList res = new();
                foreach (var A in prestamo)
                {
                    res.Add(new
                    {
                        ContratoID = A.ContratoID,
                        DistribuidorID = A.DistribuidorID,
                        CreditoID = A.CreditoID,
                        Estatus = A.Estatus,
                        EstatusID = A.EstatusID,
                        FechaAutorizacion = A.FechaAutorizacion,
                        FechaCancelacion = A.FechaCancelacion,
                        FechaModifica = A.FechaModifica,
                        FechaSolicitud = A.FechaSolicitud,
                        MotivoCancelacion = A.MotivoCancelacion,
                        NombreSucursal = A.NombreSucursal,
                        Observaciones = A.Observaciones,
                        PersonaNombre = A.PersonaNombre,
                        PrestamoAutorizado = A.PrestamoAutorizado,
                        PrestamoSolicitado = A.PrestamoSolicitado,
                        PlazoSolicitado = A.PlazoSolicitado,
                        Producto = A.Producto,
                        ProductoID = A.ProductoID,
                        SolicitudPrestamoPersonalID = A.SolicitudPrestamoPersonalID,
                        SucursalID = A.SucursalID,
                        UsuarioAutorizoID = A.UsuarioAutorizoID,
                        UsuarioCanceloID = A.UsuarioCanceloID,
                        UsuarioCancelo = A.UsuarioCancelo,
                        UsuarioModifica = A.UsuarioModifica,
                        UsuarioModificaID = A.UsuarioModificaID,
                        UsuarioSolicito = A.UsuarioSolicito,
                        UsuarioSolicitoID = A.UsuarioSolicitoID,
                        Evidencias = (await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesPrestamosPersonalesDocumentos>("WHERE SolicitudPrestamoPersonalID=@0", A.SolicitudPrestamoPersonalID).ToArrayAsync())
                    });
                }

                await DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("AceptarSolicitud")]
        [Code.TProteccionProducto]
        [Authorize]
        public async Task<IActionResult> AceptarSolicitud(PeticionesRest.Distribuidores.SolicitudPrestamosPersonales.PrestamoM parData)
        {

            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            try
            {
                var registro = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesPrestamosPersonales>("WHERE SolicitudPrestamoPersonalID=@0", parData.SolicitudPrestamoPersonalID).SingleOrDefaultAsync();
                int ProductoID = 9999;
                int.TryParse(Request.Headers["ProductoID"], out ProductoID);

                var contrato2 = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.Contratos>("WHERE DistribuidorID=@0 AND ProductoID IN(58,60,77,86,117)", registro.DistribuidorID).FirstOrDefaultAsync();


                if (registro.SPEI == true)
                {
                    var obj = new
                    {
                        ProductoId = ProductoID,
                        DistribuidorId = registro.DistribuidorID,
                        ClienteId = registro.DistribuidorID,
                        Capital = registro.PrestamoSolicitado - registro.InteresFinal ?? registro.PrestamoSolicitado,
                        UsuarioId = UsuarioActual.UsuarioID,
                        Plazos = registro.PlazoSolicitado
                    };

                    string stored = "EXEC Creditos.pa_CreaCreditoPrestamoPersonal_Ins @ProductoId, @DistribuidorId, @ClienteId, @Capital, @Plazos, @UsuarioId";
                    var res = await DBContext.database.QueryAsync<AceptarPrestamoPersonal>(stored, obj).FirstOrDefaultAsync();

                    if (res.regresa != 1)
                    {
                        await DBContext.Destroy();
                        return BadRequest(res.msj);
                    }

                    registro.EstatusID = 1;
                    registro.PrestamoAutorizado = registro.PrestamoSolicitado;
                    registro.FechaAutorizacion = DateTime.Now;
                    registro.UsuarioAutorizoID = UsuarioActual.UsuarioID;
                    registro.CreditoID = res.CreditoId;


                    await DBContext.database.UpdateAsync(registro);
                    //var Solicitud2 = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesIncrementos_VW>("WHERE SolicitudID = @0", parData.SolicitudID).SingleOrDefaultAsync();
                    await DBContext.Destroy();
                    return Ok(new
                    {
                        status = true,
                        message = "Credito aceptado y generado correctamente. La dispersion de su credito tarda un lapso maximo de 4 horas. DUDAS CONTACTAR CON TESORERIA",
                        data = new { }
                    });
                }
                else
                {
                    registro.UsuarioAceptaID = UsuarioActual.UsuarioID;
                    registro.FechaAceptacion = DateTime.Now;
                    registro.EstatusID = 2;
                    await DBContext.database.UpdateAsync(registro);
                    // contrato2.LineaCredito -= registro.PrestamoSolicitado;
                    
                    // await DBContext.database.UpdateAsync(contrato2);
                     await DBContext.Destroy();

                    return Ok(new
                    {
                        status = true,
                        message = "Solicitud aceptada correctamente",
                        data = new { }
                    });
                }



            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }







        [HttpPost]
        [Route("AceptarPrestamo")]
        [Code.TProteccionProducto]
        [Authorize]
        public async Task<IActionResult> AceptarPrestamo(PeticionesRest.Distribuidores.SolicitudPrestamosPersonales.AceptarPrestamo parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                int ProductoID = 9999;
                int.TryParse(Request.Headers["ProductoID"], out ProductoID);

                var limite = await DBContext.database.QueryAsync<DBContext.DBConfia.Catalogos.VariablesGlobales>("WHERE varName = 'Prestamo_Limite'").SingleOrDefaultAsync();
                //OBTENER EL limite.varvalue y convertirlo a decimal
                decimal limiteCred = decimal.Parse((string)limite.varValue);
                if (parData.PrestamoSolicitado > limiteCred)
                {
                    return BadRequest("El prestamo solicitado sobrepasa el limite autorizado");
                }
                var Solicitud = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesPrestamosPersonales>("WHERE DistribuidorID = @0 AND SolicitudPrestamoPersonalID = @1 AND PrestamoAutorizado IS NULL", parData.DistribuidorID, parData.SolicitudPrestamoPersonalID).FirstOrDefaultAsync();
                // var Solicitud = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesPrestamosPersonales>("WHERE DistribuidorID = @0 AND PrestamoAutorizado IS NULL", parData.DistribuidorID).FirstOrDefaultAsync();
                // var contrato = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.Contratos_VW>("WHERE DistribuidorID=@0 AND ProductoNombre = 'P. Personal'", parData.DistribuidorID).FirstOrDefaultAsync();
                var contrato2 = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.Contratos>("WHERE DistribuidorID=@0 AND ProductoID=@1", parData.DistribuidorID, parData.ProductoID).FirstOrDefaultAsync();
                var producto = await DBContext.database.QueryAsync<Distribuidores_VW>("WHERE DistribuidorID = @0", parData.DistribuidorID).FirstOrDefaultAsync();
                var registro = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesPrestamosPersonales>("WHERE SolicitudPrestamoPersonalID=@0", parData.SolicitudPrestamoPersonalID).SingleOrDefaultAsync();
                
                var sucursalDesembolso = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CatalogoCajas>("WHERE CajaID=@0", parData.CajaID).SingleOrDefaultAsync();

                parData.UsuarioId = UsuarioActual.UsuarioID;

                //Restamos el monto del prestamo a la linea de credito
                // contrato2.LineaCredito -= parData.PrestamoSolicitado;
                // await DBContext.database.UpdateAsync(contrato2);

                if(Solicitud?.CambioEfectivo == true)
                {
                    var obj = new
                    {
                        ProductoId = ProductoID,
                        DistribuidorId = parData.DistribuidorID,
                        ClienteId = parData.DistribuidorID,
                        Capital = parData.PrestamoSolicitado - registro.InteresFinal ?? parData.PrestamoSolicitado,
                        UsuarioId = parData.UsuarioId,
                        Plazos = Solicitud.PlazoSolicitado,
                        CajaID = parData.CajaID,
                        Desembolso = 1,
                        SolicitudID = Solicitud.SolicitudPrestamoPersonalID
                    };
                     string stored = "EXEC Creditos.pa_CreaCreditoPrestamoPersonal_Ins @ProductoId, @DistribuidorId, @ClienteId, @Capital, @Plazos, @UsuarioId, @CajaID, @Desembolso, @SolicitudID";

                    var res = await DBContext.database.QueryAsync<AceptarPrestamoPersonal>(stored, obj).FirstOrDefaultAsync();

                    if (res.regresa != 1)
                    {
                        await DBContext.Destroy();
                        return BadRequest(res.msj);
                    }

                    registro.EstatusID = 1;
                    registro.PrestamoAutorizado = registro.PrestamoSolicitado;
                    registro.FechaAutorizacion = DateTime.Now;
                    registro.UsuarioAutorizoID = UsuarioActual.UsuarioID;
                    await DBContext.database.UpdateAsync(registro);

                    var credito = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoID=@0", Solicitud.CreditoID).SingleOrDefaultAsync();

                    credito.EstatusID = "A";
                    await DBContext.database.UpdateAsync(credito);
                }
                else
                {
                    var obj = new
                    {
                        ProductoId = ProductoID,
                        DistribuidorId = parData.DistribuidorID,
                        ClienteId = parData.DistribuidorID,
                        Capital = parData.PrestamoSolicitado - registro.InteresFinal ?? parData.PrestamoSolicitado,
                        UsuarioId = parData.UsuarioId,
                        Plazos = Solicitud.PlazoSolicitado,
                        CajaID = parData.CajaID,
                    };

                    string stored = "EXEC Creditos.pa_CreaCreditoPrestamoPersonal_Ins @ProductoId, @DistribuidorId, @ClienteId, @Capital, @Plazos, @UsuarioId, @CajaID";
                    var res = await DBContext.database.QueryAsync<AceptarPrestamoPersonal>(stored, obj).FirstOrDefaultAsync();

                    if (res.regresa != 1)
                    {
                        await DBContext.Destroy();
                        return BadRequest(res.msj);
                    }

                    registro.EstatusID = 1;
                    registro.PrestamoAutorizado = registro.PrestamoSolicitado;
                    registro.FechaAutorizacion = DateTime.Now;
                    registro.UsuarioAutorizoID = UsuarioActual.UsuarioID;
                    registro.CreditoID = res.CreditoId;


                    await DBContext.database.UpdateAsync(registro);
                }
                await DBContext.Destroy();
                return Ok(registro);
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
        public async Task<IActionResult> Cancelacion(ConfiaWebApi.PeticionesRest.Distribuidores.SolicitudPrestamosPersonales.Cancelacion parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            try
            {
                var registro = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesPrestamosPersonales>("WHERE SolicitudPrestamoPersonalID=@0", parData.SolicitudPrestamoPersonalID).SingleOrDefaultAsync();

                registro.MotivoCancelacion = parData.MotivoCancelacion;
                registro.EstatusID = 3;
                registro.FechaCancelacion = DateTime.Now;
                registro.UsuarioCanceloID = UsuarioActual.UsuarioID;



                await DBContext.database.UpdateAsync(registro);
                var Solicitud = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesPrestamos_VW>("WHERE SolicitudPrestamoPersonalID = @0", parData.SolicitudPrestamoPersonalID).SingleOrDefaultAsync();
                await DBContext.Destroy();
                return Ok(Solicitud);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("updatePrestamo")]
        [Code.TProteccionProducto]
        [Authorize]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Distribuidores.SolicitudPrestamosPersonales.updatePrestamo parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            try
            {
                var registro = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesPrestamosPersonales>("WHERE SolicitudPrestamoPersonalID=@0", parData.SolicitudPrestamoPersonalID).SingleOrDefaultAsync();
                registro.Interes = parData.Interes;

                if (registro.Interes > 0)
                {
                    var Interes = (double)parData.Interes / 100;
                    var InteresCalculado = parData.PrestamoSolicitado * Interes;
                    var PrestamoFinal = parData.PrestamoSolicitado + (decimal)InteresCalculado;
                    registro.PrestamoSolicitado = PrestamoFinal;
                    registro.InteresFinal = (decimal)InteresCalculado;
                    await DBContext.database.UpdateAsync(registro);
                }
                else
                {
                    registro.PrestamoSolicitado = parData.PrestamoSolicitado;
                    registro.PlazoSolicitado = parData.PlazoSolicitado;
                    registro.Observaciones = parData.Observaciones;
                    registro.FechaModifica = DateTime.Now;
                    registro.UsuarioModificaID = UsuarioActual.UsuarioID;
                    registro.InteresFinal = 0;
                }

                await DBContext.database.UpdateAsync(registro);
                var Solicitud = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesPrestamos_VW>("WHERE SolicitudPrestamoPersonalID = @0", parData.SolicitudPrestamoPersonalID).SingleOrDefaultAsync();
                await DBContext.Destroy();
                return Ok(Solicitud);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("getPrestamosPersona/{personaID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getPrestamosPersona(int personaID)
        {
            try
            {
                var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesPrestamos_VW>("WHERE DistribuidorID = @0", personaID).ToArrayAsync();
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
        [Route("AceptarMuchos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> AceptarMuchos(ConfiaWebApi.PeticionesRest.Distribuidores.SolicitudPrestamosPersonales.AceptarMuchos parData)
        {

            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                string msj = "";
                foreach (var item in parData.Prestamo)
                {
                    var Solicitud = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesPrestamosPersonales>("WHERE SolicitudPrestamoPersonalID = @0", item.SolicitudPrestamoPersonalID).SingleOrDefaultAsync();


                    var obj = new
                    {
                        DistribuidorID = Solicitud.DistribuidorID,
                        ContratoID = Solicitud.ContratoID,
                        ProductoID = Solicitud.ProductoID,
                        UsuarioID = UsuarioActual.UsuarioID,
                        PrestamoQuincena = Solicitud.PrestamoSolicitado,
                        regresa = parData.regresa,
                        msj = parData.msj

                    };
                    // var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Creditos.ContratoRes>("EXEC Distribuidores.pa_IncrementoLineaCredito_Ins @DistribuidorID, @ContratoID, @ProductoID, @UsuarioID, @IncrementoQuincena, @regresa, @msj", obj).FirstOrDefaultAsync();

                    var registro = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesIncrementos>("WHERE SolicitudPrestamoPersonalID=@0", item.SolicitudPrestamoPersonalID).SingleOrDefaultAsync();

                    var empresa = await DBContext.database.QueryAsync<Productos>("WHERE ProductoID = @0", Solicitud.ProductoID).SingleOrDefaultAsync();
                    var productos = await DBContext.database.QueryAsync<Productos>("WHERE EmpresaId = @0 AND PrestamoPersonal = 1", empresa.EmpresaId).SingleOrDefaultAsync();
                    var LineaActualizada = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.Contratos>("WHERE ProductoID = @0 AND DistribuidorID = @1 ", Solicitud.ProductoID, Solicitud.DistribuidorID).SingleOrDefaultAsync();
                    var contrato = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.Contratos>("WHERE ProductoID = @0 AND DistribuidorID = @1", productos.ProductoID, Solicitud.DistribuidorID).SingleOrDefaultAsync();


                    registro.EstatusID = 1;
                    registro.IncrementoAutorizado = registro.IncrementoSolicitado;
                    registro.FechaAutorizacion = DateTime.Now;
                    registro.UsuarioAutorizoID = UsuarioActual.UsuarioID;

                    // if (res.regresa == 1)
                    // {

                    //     registro.EstatusID = 1;
                    //     registro.IncrementoAutorizado = registro.IncrementoSolicitado;
                    //     registro.FechaAutorizacion = DateTime.Now;
                    //     registro.UsuarioAutorizoID = UsuarioActual.UsuarioID;

                    //     if (contrato != null)
                    //     {

                    //         contrato.LineaCredito = LineaActualizada.LineaCredito * 10 / 100;
                    //         await DBContext.database.UpdateAsync(contrato);


                    //     }
                    // }
                    await DBContext.database.UpdateAsync(registro);

                    // if (res.regresa == 1)
                    // {
                    //     msj = "Aceptación de Solicitudes Éxitosa";
                    // }
                    // else
                    // {
                    //     msj = "Aceptación de Solicitudes Éxitosa, Verifique Estatus";
                    // }
                }

                await DBContext.Destroy();
                return Ok(msj);


            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }

        }


        [HttpPost]
        [Route("getEvidencia")]
        // [Code.TProteccionProducto]
        public async Task<IActionResult> GetEvidencia(ConfiaWebApi.PeticionesRest.Distribuidores.SolicitudPrestamosPersonales.GetEvidencia parData)
        {
            var transaccion = false;
            try
            {
                var src = "";
                var srcBC = "";
                var Documento = await DBContext.database.QueryAsync<SolicitudesPrestamosPersonalesDocumentos>("WHERE Firmado = 1 AND SolicitudPrestamoPersonalID=@0 AND DocumentoID=@1", parData.DocumentoID, parData.SolicitudPrestamoPersonalID).SingleOrDefaultAsync();

                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                var basicToken = Convert.ToBase64String(plainTextBytes);
                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicToken); ;
                    var response = await client.GetAsync($"{Configuracion["BucketApi:url"]}{Configuracion["BucketApi:getRequest"]}?expireIn=10&path={Documento.Ruta}");
                    if (response.IsSuccessStatusCode)
                    {
                        var jsonString = await response.Content.ReadAsStringAsync();
                        var request = JsonConvert.DeserializeObject<BucketGet>(jsonString);
                        src = request.url;
                        srcBC = request.url;
                        WebClient MyWebClient = new WebClient();
                        MyWebClient.Credentials = new NetworkCredential(Configuracion["userFtpConfia"], Configuracion["passFtpConfia"]);
                        byte[] BytesFile = MyWebClient.DownloadData(srcBC);
                        string srcB64 = Convert.ToBase64String(BytesFile, 0, BytesFile.Length);
                        DBContext.database.BeginTransaction();
                        transaccion = true;
                        var res = new
                        {
                            res = 2,
                            msj = $"Consulta correcta del documento {parData.DocumentoID}",
                            src = $"{srcBC}"
                        };

                        DBContext.database.CompleteTransaction();
                        await DBContext.Destroy();
                        return Ok(res);
                    }
                    else
                    {
                        if (transaccion) DBContext.database.AbortTransaction();
                        await DBContext.Destroy();
                        return BadRequest(response.StatusCode);
                    }
                }
            }
            catch (Exception ex)
            {
                if (transaccion) DBContext.database.AbortTransaction();
                await DBContext.Destroy();
                return BadRequest("ERROR AL GUARDAR LOS DATOS: " + ex.Message);
            }
        }


        [Consumes("multipart/form-data")]
        [HttpPost]
        [Route("subirEvidencia")]
        // [Code.TProteccionProducto]
        public async Task<IActionResult> UpdateEvidencia([FromForm] ConfiaWebApi.PeticionesRest.Distribuidores.SolicitudPrestamosPersonales.UploadFiles parData)
        {
            try
            {

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                var basicToken = Convert.ToBase64String(plainTextBytes);
                string path = $"{Configuracion["BucketApi:AwsPath_Aclaraciones"]}/A{parData.SolicitudPrestamoPersonalID}";
                var ext = Path.GetExtension(parData.doc.FileName);
                string file_name = $"{parData.SolicitudPrestamoPersonalID}_{DateTime.Now.ToString("dd_MM_yyyy_hh_mm_ss")}{ext}";
                byte[] file_byte = FilesManager.ConvertFiletoByteArray(parData.doc);

                long DocumentoIDAux = 0;

                HttpContent bytesContent = new ByteArrayContent(file_byte);
                HttpContent stringContent = new StringContent(path);

                using (var client = new HttpClient())
                using (var formData = new MultipartFormDataContent())
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicToken); ;
                    formData.Add(stringContent, "path");
                    formData.Add(bytesContent, "file", $"{file_name}");
                    var response = await client.PostAsync($"{Configuracion["BucketApi:url"]}{Configuracion["BucketApi:uploadRequest"]}", formData);
                    if (response.IsSuccessStatusCode)
                    {
                        var Documento = new SolicitudesPrestamosPersonalesDocumentos();
                        Documento.Ruta = $"{path}/{file_name}";
                        Documento.Firmado = true;
                        Documento.SolicitudPrestamoPersonalID = parData.SolicitudPrestamoPersonalID;
                        await DBContext.database.InsertAsync(Documento);
                    }
                    else
                    {
                        await DBContext.Destroy();
                        return BadRequest(response.StatusCode);
                    }
                }
                await DBContext.Destroy();
                return Ok();
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("obtenerSolicitudPrestamoFiltro")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetPrestamosFiltro(ConfiaWebApi.PeticionesRest.Distribuidores.SolicitudPrestamosPersonales.FiltroPrestamo parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var obj = new
                {
                    SucursalID = parData.SucursalID,
                    FechaInicio = parData.FechaInicio.ToString("dd/MM/yyyy 00:00:00"),
                    FechaFin = parData.FechaFin.ToString("dd/MM/yyyy 23:59:59")
                };
                //ConvenioID = @ConvenioID OR @ConvenioID = 0
                var prestamo = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesPrestamos_VW>(
                    "WHERE FechaSolicitud BETWEEN @FechaInicio AND @FechaFin AND (SucursalID = @SucursalID OR @SucursalID = 0) AND  EstatusID IN (3 , 4)", obj).ToArrayAsync();

                var res = await Task.WhenAll(prestamo.Select(async A => new
                {
                    ContratoID = A.ContratoID,
                    DistribuidorID = A.DistribuidorID,
                    CreditoID = A.CreditoID,
                    Estatus = A.Estatus,
                    EstatusID = A.EstatusID,
                    FechaAutorizacion = A.FechaAutorizacion,
                    FechaCancelacion = A.FechaCancelacion,
                    FechaModifica = A.FechaModifica,
                    FechaSolicitud = A.FechaSolicitud,
                    MotivoCancelacion = A.MotivoCancelacion,
                    NombreSucursal = A.NombreSucursal,
                    Observaciones = A.Observaciones,
                    PersonaNombre = A.PersonaNombre,
                    PrestamoAutorizado = A.PrestamoAutorizado,
                    PrestamoSolicitado = A.PrestamoSolicitado,
                    PlazoSolicitado = A.PlazoSolicitado,
                    Producto = A.Producto,
                    ProductoID = A.ProductoID,
                    SolicitudPrestamoPersonalID = A.SolicitudPrestamoPersonalID,
                    SucursalID = A.SucursalID,
                    UsuarioAutorizoID = A.UsuarioAutorizoID,
                    UsuarioCanceloID = A.UsuarioCanceloID,
                    UsuarioCancelo = A.UsuarioCancelo,
                    UsuarioModifica = A.UsuarioModifica,
                    UsuarioModificaID = A.UsuarioModificaID,
                    UsuarioSolicito = A.UsuarioSolicito,
                    UsuarioSolicitoID = A.UsuarioSolicitoID,
                    Evidencias = (await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesPrestamosPersonalesDocumentos>("WHERE SolicitudPrestamoPersonalID=@0", A.SolicitudPrestamoPersonalID).ToArrayAsync())
                }));
                var resList = res.ToList();

                await DBContext.Destroy();
                return Ok(resList);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("obtenerSolicitudPrestamoCartera")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetPrestamosCartera(ConfiaWebApi.PeticionesRest.Distribuidores.SolicitudPrestamosPersonales.FiltroPrestamoCartera parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                parData.UsuarioID = UsuarioActual.UsuarioID;
                var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.SolicitudesPrestamos_VW>(
                    @"SELECT sp.* 
                    FROM Distribuidores.SolicitudesPrestamos_VW sp
                    JOIN Creditos.GruposDetalle gd ON sp.DistribuidorID = gd.DistribuidorID
                    JOIN Creditos.GruposUsuarios gu ON gd.GrupoID = gu.GrupoID
                    AND gu.UsuarioID = @UsuarioID
                    WHERE sp.FechaSolicitud BETWEEN @FechaInicio AND @FechaFin 
                    AND sp.EstatusID IN (3, 4)", parData).ToArrayAsync();

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
        [Route("lectorHuellaSucursal")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> LectorHuellaSucursal(ConfiaWebApi.PeticionesRest.Distribuidores.SolicitudPrestamosPersonales.SensorHuellasRequest parData)
        {
            try
            {
                var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.RespHuellas>(
                    @"SELECT s.LectorHuellas AS 'LectorHuellas' FROM General.Sucursales s 
                    WHERE s.SucursalID = 
                    (SELECT dv.SucursalID FROM Distribuidores.Distribuidores_VW dv 
                    WHERE dv.DistribuidorID = @DistribuidorID)",
                    parData).FirstOrDefaultAsync();
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
        [Route("lectorHuellaBySucursal")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> LectorHuellaBySucursal(ConfiaWebApi.PeticionesRest.Distribuidores.SolicitudPrestamosPersonales.SensorHuellasRequest parData)
        {
            try
            {
                var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.RespHuellas>(
                    @"SELECT s.LectorHuellas FROM General.Sucursales s 
                    WHERE s.SucursalID = @DistribuidorID",
                    parData).FirstOrDefaultAsync();
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
        [Route("lectorHuellaByClienteID")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> LectorHuellaByCliente(ConfiaWebApi.PeticionesRest.Distribuidores.SolicitudPrestamosPersonales.SensorHuellasCliente parData)
        {
            try
            {
                var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.RespHuellas>(
                    @"SELECT count(*) as 'LectorHuellas' FROM Sistema.HuellasDigitales hd WHERE hd.Curp= (SELECT cv.CURP FROM Creditos.Clientes_VW cv where cv.ClienteID = @ClienteID)", parData).FirstOrDefaultAsync();
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
        [Route("lectorHuellaByDistribuidorID")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> LectorHuellaByDistribuidorID(ConfiaWebApi.PeticionesRest.Distribuidores.SolicitudPrestamosPersonales.SensorHuellasCliente parData)
        {
            try
            {
                var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.RespHuellas>(
                    @"SELECT count(*) as 'LectorHuellas' FROM Sistema.HuellasDigitales hd WHERE hd.Curp= (SELECT p.CURP FROM General.Personas p WHERE p.PersonaID = @ClienteID)", parData).FirstOrDefaultAsync();
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


