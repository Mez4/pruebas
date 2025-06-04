using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Distribuidores;
using System.Collections;
using DBContext.DBConfia.General;
using DBContext.DBConfia.AppVale;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Bancos;
using ConfiaWebApi.Code;
using DBContext.DBConfia.Custom.Creditos;
using DBContext.DBConfia.Tesoreria;
using ConfiaWebApi.Controllers.General;
using ConfiaWebApi.PeticionesRest.General.CodigoSMS;
using DBContext.DBConfia.Custom.AppVale;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Filters;
using DBContext.DBConfia.Catalogos;
using System.Collections.Generic;
using ConfiaWebApi.ModlesSP.Creditos;
using DBContext.DBConfia.Seguridad;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.Data.SqlClient;
using System.Data;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Net.Http.Json;
using ConfiaWebApi.RespuestasPersonalizadas.AppVale;
//using ConfiaWebApi.Models.DBConfia.Tesoreria;

namespace ConfiaWebApi.Controllers.AppDistribuidores
{
    [Authorize]
    [ApiController]
    [Route("api/AppVale/[controller]")]
    public class AppCreditosController : ControllerBase
    {
        private DBConfiaContext DBContext;
        private IConfiguration Configuracion;
        private readonly SqlConnection sqlConnection;
        private readonly SqlConnection sqlConnectionKYC;
        private readonly IWebHostEnvironment env;

        public AppCreditosController(DBConfiaContext _DBContext, IWebHostEnvironment _env, IConfiguration _Configuration)
        {
            this.Configuracion = _Configuration;
            IConfiguration Configuration;

            Configuration = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json", false, true)
                .Build();

            var sqlServerConfig = Configuration.GetSection("ConnectionStrings");
            string conn = sqlServerConfig["DBConfia"];
            string conn2 = sqlServerConfig["DBSistemaKYC"];

            sqlConnection = new(conn);
            sqlConnectionKYC = new(conn2);
            DBContext = _DBContext;
            env = _env;


            //context = _context;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        // [Code.TProteccionProducto]
        //   [Code.TProteccionAppVales]
        public async Task<IActionResult> Get(PeticionesRest.AppValePeticiones.AppCreditos.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                parData.ProductoID = producto;
                var Creditos = await DBContext.database.FetchAsync<AppCreditos_VW>("WHERE (ProductoID = @ProductoID) AND (DistribuidorID = @DistribuidorID)AND EstatusID NOT IN ('C','P') ", parData);

                var data = new ArrayList();

                foreach (var Credito in Creditos)
                {
                    var Vale = await DBContext.database.QueryAsync<AppValesDistribuidor_VW>("WHERE (Folio = @ValeCanje)", Credito).FirstOrDefaultAsync();
                    var Clente = await DBContext.database.QueryAsync<AppClientes_VW>("WHERE (ClienteID = @ClienteID)", Credito).FirstOrDefaultAsync();

                    var valeId = (Vale != null) ? Vale.ValeraID : 0;

                    var fhRegistro = Credito.fechaHoraActivacion?.ToString("dd/MM/yyyy");

                    var cancelado = (Vale != null) ? (Vale.Estatus == "C" ? true : false) : false;

                    var fhCancelacion = (Vale != null) ? Vale.CanceladoFecha?.ToString("dd/MM/yyyy") : null;

                    var valeraDetalleId = (Vale != null) ? Vale.Folio : 0;

                    var nombreCliente = (Clente != null) ? Clente.NombreCompleto : "";

                    var canjeId = (Vale != null) ? Vale.Folio : 0;

                    data.Add(new
                    {
                        valeId,
                        fhRegistro,
                        cancelado,
                        fhCancelacion,
                        valeraDetalleId,
                        nombreCliente,
                        importe = Credito.ImporteTotal,
                        plazos = Credito.Plazos,
                        codigoVale = "",
                        canjeId,
                        status = Credito.EstatusNombre,
                        creditoId = Credito.CreditoID,
                        folio = Credito.ValeCanje,
                        STPEnviado = Credito.EnvioSTPEstatusID != null ? true : false,
                        Credito.TipoDesembolsoID
                    });

                }



                var canjesApp = await DBContext.database.FetchAsync<CanjesValeApp_VW>("WHERE (DistribuidorID = @DistribuidorID) AND (status != 'Activo') AND Completado = 1", parData);

                foreach (var canje in canjesApp)
                {

                    data.Add(new
                    {
                        valeId = canje.valeId,
                        fhRegistro = canje.fhRegistro.ToString("dd/MM/yyyy"),
                        cancelado = canje.cancelado == "C" ? true : false,
                        fhCancelacion = canje.fhCancelacion?.ToString("dd/MM/yyyy"),
                        valeraDetalleId = canje.valeraDetalleId,
                        nombreCliente = canje.nombreCliente,
                        importe = canje.importe,
                        plazos = canje.Plazos,
                        codigoVale = canje.codigoVale,
                        canjeId = canje.canjeId,
                        status = canje.status,
                        creditoId = canje.creditoId,
                        folio = canje.Folio,
                        STPEnviado = false,
                        TipoDesembolsoID = 0

                    });
                }



                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                await DBContext.Destroy();

                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }

        }


        [HttpPost]
        [Route("gedetalle")]
        [Authorize]
        // [Code.TProteccionProducto]
        //   [Code.TProteccionAppVales]
        public async Task<IActionResult> GetDetalle(PeticionesRest.AppValePeticiones.AppCreditos.GetDetalle parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {

                if (parData.isCanje == 1)
                {
                    var canjesApp = await DBContext.database.QueryAsync<CanjesValeApp_VW>("WHERE (canjeId = @CreditoID)", parData).FirstOrDefaultAsync();
                    var Cliente2 = await DBContext.database.QueryAsync<AppClientes_VW>("WHERE (ClienteID = @0)", canjesApp.ClienteID).FirstOrDefaultAsync();

                    var data2 = new
                    {
                        plazos = canjesApp.Plazos,
                        plazoActual = 0,
                        folio = canjesApp.Folio,
                        saldoPagado = 0.00,
                        saldoActual = canjesApp.importe,
                        montoPago = (decimal)(canjesApp.importe / canjesApp.Plazos),
                        telefono = Cliente2.telefono,
                        noCredito = canjesApp.canjeId,
                        noCliente = canjesApp.ClienteID,
                        nombreCliente = canjesApp.nombreCliente,
                        fechaCredito = canjesApp.fhRegistro,
                        status = canjesApp.status,
                        monto = canjesApp.importe,
                        codigoValeDig = canjesApp.codigoValeDig,
                    };

                    // res = new
                    // {
                    //     resultCode = 0,
                    //     resultDesc = "OK.",
                    //     data
                    // };

                    await DBContext.Destroy();
                    // return Ok(res);
                    return Ok(new
                    {
                        resultCode = 0,
                        resultDesc = "OK.",
                        data = data2
                    });


                }
                var Credito = await DBContext.database.QueryAsync<AppCreditos_VW>("WHERE (CreditoID = @CreditoID) ", parData).FirstOrDefaultAsync();

                var Cliente = await DBContext.database.QueryAsync<AppClientes_VW>("WHERE (ClienteID = @ClienteID)", Credito).FirstOrDefaultAsync();
                var PlanPagos = await DBContext.database.FetchAsync<PlanPagos>("WHERE (CreditoID = @CreditoID)", Credito);

                //   var detalleVenta = new ArrayList();

                var telefono = Cliente != null ? Cliente.telefono : "";

                var nombreCliente = Cliente != null ? Cliente.NombreCompleto : "";

                var data = new
                {
                    plazos = Credito.Plazos == null || Credito.Plazos == 0 ? 0 : Credito.Plazos,
                    plazoActual = PlanPagos.Where(x => x.SaldoActual > 1).OrderBy(x => x.NoPago).Select(x => x.NoPago).FirstOrDefault() == 0 || PlanPagos.Where(x => x.SaldoActual > 1).OrderBy(x => x.NoPago).Select(x => x.NoPago).FirstOrDefault() == null ? 0 : PlanPagos.Where(x => x.SaldoActual > 1).OrderBy(x => x.NoPago).Select(x => x.NoPago).FirstOrDefault(),
                    folio = Credito.ValeCanje,
                    saldoPagado = Credito.Abonos,
                    saldoActual = Credito.SaldoActual,
                    montoPago = PlanPagos[0].ImporteTotal,
                    telefono,
                    //  detalleVenta,
                    noCredito = Credito.CreditoID,
                    noCliente = Credito.ClienteID,
                    nombreCliente,
                    fechaCredito = Credito.fechaHoraActivacion,
                    status = Credito.EstatusNombre,
                    monto = Credito.ImporteTotal,
                    codigoValeDig = Credito.codigoValeDig
                };

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                await DBContext.Destroy();

                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }

        }


        [HttpPost]
        [Route("getplazos")]
        [Authorize]
        // [Code.TProteccionProducto]
        //   [Code.TProteccionAppVales]
        public async Task<IActionResult> GetPlazos(PeticionesRest.Creditos.CondicionDetalleVW.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try

            {
                parData.ProductoID = producto;
                decimal importeMax2 = 0;
                var Producto = await DBContext.database.QueryAsync<Productos>("WHERE (ProductoID = @ProductoID)", parData).FirstOrDefaultAsync();
                var ImporteMinimo = await DBContext.database.ExecuteScalarAsync<int>(
                    "SELECT MIN(ImporteMinimo)AS MontoMinimo FROM Creditos.CondicionesDetalle_VW WHERE ProductoID = @ProductoID AND SucursalId = @SucursalId AND DistribuidorID = @DistribuidorID",
                    parData);
                CondicionesDetalle_VW[] CondicionesDetalle = null;

                CondicionesDetalle = await DBContext.database.QueryAsync<CondicionesDetalle_VW>(@"SELECT ProductoID, CondicionesID, Descripcion, SucursalId, DistribuidorNivelId, MIN(PlazosMinimos) AS PlazosMinimos, MAX(PlazosMaximos) AS PlazosMaximos, MIN(ImporteMinimo) AS ImporteMinimo, MAX(ImporteMaximo) AS ImporteMaximo,
                MIN(ImporteMaximo1erCanje) AS ImporteMaximo1erCanje, MAX(ImporteMaximo2doCanje) AS ImporteMaximo2doCanje, PorcTasaPlazo, SeguroPlazo, PorcIVA, Cargo, ManejoCuenta, PlazosFijos, PorcTasaMensual, PorcTasaAnual, MIN(PagoXMilMinimo) AS PagoXMilMinimo, MAX(PagoXMilMaximo) AS PagoXMilMaximo, PlazosEspeciales, DistribuidorID, DistribuidorNivel, MAX(CapitalCorte) AS CapitalCorte
                FROM     Creditos.CondicionesDetalle_VW
                Where (ProductoID = @ProductoID) AND (SucursalId = @SucursalId) AND (DistribuidorID = @DistribuidorID)and @importe BETWEEN ImporteMinimo and ImporteMaximo
                GROUP BY ProductoID, CondicionesID, Descripcion, SucursalId, DistribuidorNivelId, PorcTasaPlazo, SeguroPlazo, PorcIVA, Cargo, ManejoCuenta, PlazosFijos, PorcTasaMensual, PorcTasaAnual, PlazosEspeciales, DistribuidorID, DistribuidorNivel
                ORDER BY PlazosMinimos, PlazosMaximos", parData).ToArrayAsync();
                if (CondicionesDetalle.Length == 0)
                {
                    parData.importe = ImporteMinimo;
                    CondicionesDetalle = await DBContext.database.QueryAsync<CondicionesDetalle_VW>(@"SELECT ProductoID, CondicionesID, Descripcion, SucursalId, DistribuidorNivelId, MIN(PlazosMinimos) AS PlazosMinimos, MAX(PlazosMaximos) AS PlazosMaximos, MIN(ImporteMinimo) AS ImporteMinimo, MAX(ImporteMaximo) AS ImporteMaximo,
                MIN(ImporteMaximo1erCanje) AS ImporteMaximo1erCanje, MAX(ImporteMaximo2doCanje) AS ImporteMaximo2doCanje, PorcTasaPlazo, SeguroPlazo, PorcIVA, Cargo, ManejoCuenta, PlazosFijos, PorcTasaMensual, PorcTasaAnual, MIN(PagoXMilMinimo) AS PagoXMilMinimo, MAX(PagoXMilMaximo) AS PagoXMilMaximo, PlazosEspeciales, DistribuidorID, DistribuidorNivel, MAX(CapitalCorte) AS CapitalCorte
                FROM     Creditos.CondicionesDetalle_VW
                Where (ProductoID = @ProductoID) AND (SucursalId = @SucursalId) AND (DistribuidorID = @DistribuidorID)and  @importe BETWEEN ImporteMinimo and ImporteMaximo
                GROUP BY ProductoID, CondicionesID, Descripcion, SucursalId, DistribuidorNivelId, PorcTasaPlazo, SeguroPlazo, PorcIVA, Cargo, ManejoCuenta, PlazosFijos, PorcTasaMensual, PorcTasaAnual, PlazosEspeciales, DistribuidorID, DistribuidorNivel
                ORDER BY PlazosMinimos, PlazosMaximos", parData).ToArrayAsync();
                }


                importeMax2 = await DBContext.database.ExecuteScalarAsync<decimal>(
                    "SELECT MAX(ImporteMaximo) FROM Creditos.CondicionesDetalle_VW WHERE ProductoID = @ProductoID AND SucursalId = @SucursalId AND DistribuidorID = @DistribuidorID",
                    parData);
                // var CondicionesDetalle = await DBContext.database.QueryAsync<CondicionesDetalle_VW>(@"SELECT ProductoID, CondicionesID, Descripcion, SucursalId, DistribuidorNivelId, MIN(PlazosMinimos) AS PlazosMinimos, MAX(PlazosMaximos) AS PlazosMaximos, MIN(ImporteMinimo) AS ImporteMinimo, MAX(ImporteMaximo) AS ImporteMaximo,importeMax2 = (SELECT MAX(ImporteMaximo) FROM Creditos.CondicionesDetalle_VW WHERE ProductoID = @ProductoID AND SucursalId = @SucursalId AND DistribuidorID = @DistribuidorID),
                // MIN(ImporteMaximo1erCanje) AS ImporteMaximo1erCanje, MAX(ImporteMaximo2doCanje) AS ImporteMaximo2doCanje, PorcTasaPlazo, SeguroPlazo, PorcIVA, Cargo, ManejoCuenta, PlazosFijos, PorcTasaMensual, PorcTasaAnual, MIN(PagoXMilMinimo) AS PagoXMilMinimo, MAX(PagoXMilMaximo) AS PagoXMilMaximo, PlazosEspeciales, DistribuidorID, DistribuidorNivel, MAX(CapitalCorte) AS CapitalCorte
                // FROM     Creditos.CondicionesDetalle_VW
                // Where (ProductoID = @ProductoID) AND (SucursalId = @SucursalId) AND (DistribuidorID = @DistribuidorID)
                // GROUP BY ProductoID, CondicionesID, Descripcion, SucursalId, DistribuidorNivelId, PorcTasaPlazo, SeguroPlazo, PorcIVA, Cargo, ManejoCuenta, PlazosFijos, PorcTasaMensual, PorcTasaAnual, PlazosEspeciales, DistribuidorID, DistribuidorNivel
                // ORDER BY PlazosMinimos, PlazosMaximos", parData).ToArrayAsync();


                var data = new ArrayList();
                foreach (var CondicionDetalle in CondicionesDetalle)
                {

                    double PorcTasaPlazo = (double)CondicionDetalle.PorcTasaPlazo; //Taza mensual
                    double SeguroPlazo = (double)CondicionDetalle.SeguroPlazo; //Seguro Plazo
                    double PorcIVA = (double)CondicionDetalle.PorcIVA; //IVA 1.16
                    //NOTE : DIFERENETE -> 6.07
                    double Cargo = (double)CondicionDetalle.Cargo;
                    double ManejoCuenta = (double)CondicionDetalle.ManejoCuenta;
                    double IVA = 0.0;
                    double cred_Interes = 0.0;
                    double cred_Seguro = 0.0;
                    //  double IvaSeguro = 0.0;
                    double cred_ManejoCuenta = 0.0;

                    // var capitales = Enumerable.Range((int) CondicionesDetalle.ImporteMinimo, (int) CondicionesDetalle.ImporteMaximo ).Select(x => x + 500);

                    // var plazos = Enumerable.Range((int) CondicionesDetalle.PlazosMinimos, (int) CondicionesDetalle.PlazosMaximos).Select(x => x + 2);

                    ArrayList capitales = new();
                    ArrayList plazos = new();
                    for (double x = (double)CondicionDetalle.ImporteMinimo; x <= (double)CondicionDetalle.ImporteMaximo; x += 500)
                    {
                        capitales.Add(x);
                    }

                    for (int x = CondicionDetalle.PlazosMinimos; x <= CondicionDetalle.PlazosMaximos; x += 2)
                    {
                        plazos.Add(x);
                    }

                    foreach (int plazo in plazos)
                    {
                        var tipoPlazos = new ArrayList();
                        var importes = new ArrayList();
                        //TODO: Multiplicar por %IVA
                        cred_Seguro = Sdiv(SeguroPlazo, 1.16);
                        cred_ManejoCuenta = (double)(plazo * ManejoCuenta);

                        foreach (double capital in capitales)
                        {
                            IVA = 0.0;
                            Cargo = 0.0;
                            cred_Interes = capital * ((PorcTasaPlazo * 12) / 24) * plazo;

                            if (Producto.AplicaIVAInteres == true)
                            {
                                IVA = cred_Interes - Sdiv(cred_Interes, 1.16);
                            }

                            if (Producto.AplicaIVASeguro == true)
                            {
                                Cargo = SeguroPlazo - cred_Seguro;
                            }

                            cred_Interes = Math.Floor(cred_Interes); // Round down the value to remove decimal digits

                            //  var CapitalPlazo = capital / plazo;
                            cred_Interes = cred_Interes / 1.16;
                            // IvaSeguro = Cargo * 0.16;
                            var importeprestamo = capital + cred_Interes + IVA + (plazo * Math.Round(Cargo, 2)) + (plazo * Math.Floor(cred_Seguro));

                            if (Producto.AplicaIVAManejoCuenta == true)
                            {
                                importeprestamo += cred_ManejoCuenta;
                            }

                            var importePagoPlazo = importeprestamo / plazo;

                            importes.Add(new
                            {
                                importe = capital,
                                importePagoPlazo = Funciones.Truncate((decimal)importePagoPlazo, 2),

                            });
                        }

                        tipoPlazos.Add(new
                        {
                            tipoPlazoId = Producto.TasaTipoId,
                            importes
                        });

                        data.Add(new
                        {
                            plazo = plazo,
                            tipoPlazos,
                            importeMax2 = importeMax2
                        });
                    }
                }


                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                await DBContext.Destroy();

                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }

        }
        static double Sdiv(double dividendo, double divisor)
        {
            if (divisor == 0 || dividendo == 0)
                return 0.00;

            double resultado = dividendo / divisor;
            return Math.Round(resultado, 2);
        }
        // [HttpPost]
        // [Route("getplazos")]
        // [Authorize]
        // [Code.TProteccionProducto]
        // [Code.TProteccionAppVales]
        // public async Task<IActionResult> GetPlazos(PeticionesRest.Creditos.CondicionDetalleVW.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        // {
        //     try
        //     {
        //         parData.ProductoID = producto;
        //         var Producto = await DBContext.database.QueryAsync<Productos>("WHERE (ProductoID = @ProductoID)", parData).FirstOrDefaultAsync();
        //         var CondicionesDetalle = await DBContext.database.QueryAsync<CondicionesDetalle_VW>(@"SELECT ProductoID, CondicionesID, Descripcion, SucursalId, DistribuidorNivelId, MIN(PlazosMinimos) AS PlazosMinimos, MAX(PlazosMaximos) AS PlazosMaximos, MIN(ImporteMinimo) AS ImporteMinimo, MAX(ImporteMaximo) AS ImporteMaximo,
        //                                                                                                 MIN(ImporteMaximo1erCanje) AS ImporteMaximo1erCanje, MAX(ImporteMaximo2doCanje) AS ImporteMaximo2doCanje, PorcTasaPlazo, SeguroPlazo, PorcIVA, Cargo, ManejoCuenta, PlazosFijos, PorcTasaMensual, PorcTasaAnual,
        //                                                                                                 MIN(PagoXMilMinimo) AS PagoXMilMinimo, MAX(PagoXMilMaximo) AS PagoXMilMaximo, PlazosEspeciales, DistribuidorID, DistribuidorNivel, MAX(CapitalCorte) AS CapitalCorte
        //                                                                                             FROM     Creditos.CondicionesDetalle_VW
        //                                                                                             Where (ProductoID = @ProductoID) AND (SucursalId = @SucursalId) AND (DistribuidorID = @DistribuidorID)
        //                                                                                             GROUP BY ProductoID, CondicionesID, Descripcion, SucursalId, DistribuidorNivelId, PorcTasaPlazo, SeguroPlazo, PorcIVA, Cargo, ManejoCuenta, PlazosFijos, PorcTasaMensual, PorcTasaAnual, PlazosEspeciales, DistribuidorID, DistribuidorNivel
        //                                                                                             ORDER BY PlazosMinimos, PlazosMaximos", parData).FirstOrDefaultAsync();

        //         double PorcTasaPlazo = (double)CondicionesDetalle.PorcTasaPlazo;
        //         double SeguroPlazo = (double)CondicionesDetalle.SeguroPlazo;
        //         double PorcIVA = (double)CondicionesDetalle.PorcIVA;
        //         double Cargo = (double)CondicionesDetalle.Cargo;
        //         double ManejoCuenta = (double)CondicionesDetalle.ManejoCuenta;
        //         double IVA = 0.0;
        //         double cred_Interes = 0.0;
        //         double cred_Seguro = 0.0;
        //         double cred_ManejoCuenta = 0.0;

        //         // var capitales = Enumerable.Range((int) CondicionesDetalle.ImporteMinimo, (int) CondicionesDetalle.ImporteMaximo ).Select(x => x + 500);

        //         // var plazos = Enumerable.Range((int) CondicionesDetalle.PlazosMinimos, (int) CondicionesDetalle.PlazosMaximos).Select(x => x + 2);

        //         ArrayList capitales = new();

        //         ArrayList plazos = new();

        //         for (double x = (double)CondicionesDetalle.ImporteMinimo; x <= (double)CondicionesDetalle.ImporteMaximo; x += 500)
        //         {
        //             capitales.Add(x);
        //         }

        //         for (int x = CondicionesDetalle.PlazosMinimos; x <= CondicionesDetalle.PlazosMaximos; x += 2)
        //         {
        //             plazos.Add(x);
        //         }

        //         var data = new ArrayList();

        //         foreach (int plazo in plazos)
        //         {
        //             var tipoPlazos = new ArrayList();
        //             var importes = new ArrayList();
        //             cred_Seguro = (double)(plazo * SeguroPlazo);
        //             cred_ManejoCuenta = (double)(plazo * cred_ManejoCuenta);

        //             foreach (double capital in capitales)
        //             {
        //                 IVA = 0.0;
        //                 cred_Interes = ((double)capital * (double)PorcTasaPlazo * plazo);

        //                 if (Producto.AplicaIVAInteres == true)
        //                 {
        //                     IVA += cred_Interes;
        //                 }

        //                 if (Producto.AplicaIVASeguro == true)
        //                 {
        //                     IVA += cred_Seguro;
        //                 }

        //                 if (Producto.AplicaIVAManejoCuenta == true)
        //                 {
        //                     IVA += cred_ManejoCuenta;
        //                 }

        //                 IVA = IVA * (double)PorcIVA;
        //                 var importePagoPlazo = (capital + IVA + Cargo + cred_Interes + cred_Seguro + cred_ManejoCuenta) / plazo;

        //                 importes.Add(new
        //                 {
        //                     importe = capital,
        //                     importePagoPlazo = Funciones.Truncate((decimal)importePagoPlazo, 2),

        //                 });
        //             }

        //             tipoPlazos.Add(new
        //             {
        //                 tipoPlazoId = Producto.TasaTipoId,
        //                 importes
        //             });

        //             data.Add(new
        //             {
        //                 plazo = plazo,
        //                 tipoPlazos
        //             });
        //         }

        //         var res = new
        //         {
        //             resultCode = 0,
        //             resultDesc = "OK.",
        //             data
        //         };

        //         await DBContext.Destroy();

        //         return Ok(res);
        //     }
        //     catch (Exception ex)
        //     {
        //         await DBContext.Destroy();
        //         return NotFound(new {
        //             resultCode = -1,
        //             resultDesc = ex.Message,
        //             data = new { }
        //         });
        //     }

        // }

        [HttpPost]
        [Route("canjevaleapp")]
        [Authorize]
        // [Code.TProteccionProducto]
        //   [Code.TProteccionAppVales]
        public async Task<ActionResult> CanjeValeApp(PeticionesRest.AppValePeticiones.AppCreditos.Add parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                var DvCliente = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Clientes>("WHERE (PersonaID = @1) AND (DistribuidorID = @0)", parData.DistribuidorID, parData.ClienteID).SingleOrDefaultAsync();
                if (DvCliente.bloqueado == true)
                {
                    await DBContext.Destroy();
                    return BadRequest(new
                    {
                        resultCode = -16,
                        resultDesc = "Cliente Bloqueado",
                        data = new { }
                    });
                }
                if (parData.ClienteID == parData.DistribuidorID)
                {
                    await DBContext.Destroy();
                    return BadRequest(new
                    {
                        resultCode = -16,
                        resultDesc = "NO PUEDE OTORGARSE UN VALE DIGITAL COMO DISTRIBUIDOR",
                        data = new { }
                    });
                }
                parData.ProductoID = producto;

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var Persona = await DBContext.database.SingleByIdAsync<Personas>(parData.ClienteID);
                var TiposDesembolso = await DBContext.database.SingleByIdAsync<TiposDesembolso>(parData.TipoDesembolsoID);

                parData.RequiereDatosBancarios = TiposDesembolso.RequiereDatosBancarios;

                parData.UsuarioID = UsuarioActual.UsuarioID;
                parData.PersonaID = UsuarioActual.PersonaID.Value;

                DBContext.database.BeginTransaction();



                string Stored = "";

                Stored = "EXEC AppVale.pa_CanjeValeApp_Ins @ProductoID ,@DistribuidorID ,@ClienteID ,@SucursalID ,@Capital ,@Plazos ,@UsuarioID ,@TipoDesembolsoID ,@PersonaID ,@personasDatosBancariosID, @VentaId, @RequiereDatosBancarios";
                //   Stored = "EXEC AppVale.pa_CanjeValeApp_Ins_Refac @ProductoID ,@DistribuidorID ,@ClienteID ,@SucursalID ,@Capital ,@Plazos ,@UsuarioID ,@TipoDesembolsoID ,@PersonaID ,@personasDatosBancariosID, @VentaId, @RequiereDatosBancarios , @ValidacionCanje";

                var data = await DBContext.database.QueryAsync<AppValeRes>(Stored, parData).FirstOrDefaultAsync();

                if (data.regresa != 1)
                {
                    DBContext.database.AbortTransaction();
                    await DBContext.Destroy();
                    return Ok(new
                    {
                        resultCode = 2,
                        resultDesc = data.msj,
                        data
                    });
                }

                if (!parData.ValidacionCanje)
                {
                    if (parData.VentaId == 0)
                    {
                        var Venta = new Ventas()
                        {
                            UsuarioIDRegistro = UsuarioActual.UsuarioID,
                            PersonaIDRegistro = (long)UsuarioActual.UsuarioID, // VALIDAR
                            FechaHoraRegistro = DateTime.Now
                        };

                        await DBContext.database.InsertAsync(Venta);

                        parData.VentaId = Venta.VentaId;
                    }
                }


                CodigoSMSController CodSMS = new(DBContext, env);

                var reference = "";
                var msg = "";

                if (TiposDesembolso.RequiereDatosBancarios == false)
                {
                    reference = "FOLIO DIGITAL";
                    msg = reference + " EXITOSO PARA " + Persona.NombreCompleto + ", IMPORTE: " + parData.Capital.ToString("C") + " (VALEID: " + data.Folio + ", CODIGO FOLIO: " + data.Codigo + ")";
                }
                else
                {
                    reference = "VALE DIGITAL";
                    var PersonaDatosBancarios = await DBContext.database.QueryAsync<PersonasDatosBancarios>("where (personaID = @0) AND activo = 1", Persona.PersonaID).FirstOrDefaultAsync();

                    // if (parData.personasDatosBancariosID > 0)
                    // {
                    if (PersonaDatosBancarios == null)
                    {
                        //  msg = reference + ": LE INFORMAMOS QUE SE HA ORDENADO UN SPEI A SU TARJETA ,POR LA CANTIDAD DE " + parData.Capital.ToString("C") + ", GRACIAS POR SU PREFERENCIA.";
                        msg = reference + ": LE INFORMAMOS QUE SE HA ORDENADO UN SPEI, POR LA CANTIDAD DE " + parData.Capital.ToString("C") + ", FAVOR DE PASAR A SUCURSAL PARA PROPORCIONAR SUS DATOS BANCARIOS, GRACIAS POR SU PREFERENCIA.";
                    }
                    else
                    {
                        var numTarjeta = PersonaDatosBancarios.datoBancario.Substring(PersonaDatosBancarios.datoBancario.Length - 4);
                        msg = reference + ": LE INFORMAMOS QUE SE HA ORDENADO UN SPEI A SU TARJETA CON TERMINACION: " + numTarjeta + ",POR LA CANTIDAD DE " + parData.Capital.ToString("C") + ", GRACIAS POR SU PREFERENCIA.";
                    }
                    // }
                    // else
                    // {
                    // }
                }

                SMS DataSMS = new()
                {
                    PersonaID = parData.ClienteID,
                    TelefonoMovil = Persona.TelefonoMovil,
                    MSG = msg,
                    Referencia = reference,
                };


                if (!parData.ValidacionCanje)
                {
                    var r = await CodSMS.SMS(DataSMS);
                    // var L = await DBContext.database.ExecuteAsync("DELETE FROM Creditos.CanjesValeApp WHERE ClienteID = @ClienteID AND DistribuidorID = @DistribuidorID AND ProductoID = @ProductoID AND estatus = 'T'", parData);

                }



                DBContext.database.CompleteTransaction();

                // res.VentaId = parData.VentaId;


                var res = new
                {
                    resultCode = data.regresa == 1 ? 0 : data.regresa,
                    resultDesc = data.msj,
                    data = new
                    {
                        parData.VentaId,
                        data.Folio,
                        data.Codigo,
                        data.CreditoId,
                        data.MovimientoID,
                        data.CanjeAppId,
                    }
                };
                await DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                DBContext.database.AbortTransaction();
                await DBContext.Destroy();
                return BadRequest(new
                {
                    resultCode = -15,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }

        }

        [HttpPost]
        [Route("enviarcodigocliente")]
        [Authorize]
        // [Code.TProteccionProducto]
        //   [Code.TProteccionAppVales]
        public async Task<IActionResult> EnviarCodigoCliente(PeticionesRest.AppValePeticiones.AppCreditos.EnviarCodigo parData)
        {
            try
            {
                //NOTE: Datos del usuario logueado
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                if (UsuarioActual.PersonaID == 104)
                {
                    await DBContext.Destroy();
                    return Ok(
                        new
                        {
                            resultCode = 0,
                            resultDesc = "OK.",
                            data = new CodigoSMS()
                            {
                                Id = 1,
                                Codigo = "123456",
                                FechaEnvio = DateTime.Now,
                                FechaCaduca = DateTime.Now.AddMinutes(5),
                                Confirmado = false,
                                SMSId = 0,
                                CanjeAppId = 0,
                                TipoID = 0,
                            }
                        }
                    );
                }

                //NOTE: Datos de la persona a la que se le enviará el código
                var Persona = await DBContext.database.SingleByIdAsync<Personas>(parData.PersonaID);

                //ASK: ¿Por qué se manda entonces el teléfono si ya se tiene la persona?
                Persona.TelefonoMovil = parData.Telefono;

                //Tiempo de duracion del codigo
                var variable = await DBContext.database.QueryAsync<VariablesGlobales>("WHERE  (varName = @0)", "TIEMPO_EXPIRACION_CODIGO_SMS").FirstOrDefaultAsync();

                DBContext.database.BeginTransaction();

                //ASK: ¿Porque se actualiza persona?
                await DBContext.database.UpdateAsync(Persona);

                var LogCelular = new LogCelular()
                {
                    //CAMBIAR A PERSONAID DE LA SOCIA
                    PersonaID = (long)UsuarioActual.PersonaID, //parData.PersonaID,
                    Celular = parData.Telefono,
                    PersonaIDModifica = UsuarioActual.PersonaID.Value,
                    UsuarioIDModifica = UsuarioActual.UsuarioID,
                    FechaHora = DateTime.Now,
                };

                int tiempoExp = Int32.Parse((string)variable.varValue);

                Random generator = new();
                var code = generator.Next(0, 10000000).ToString("D6");

                if (code.Length < 7)
                {
                    code = code.PadLeft(7, '0');
                }

                //Tipo de codigo
                var tipoCodigo = await DBContext.database.QueryAsync<TipoCodigoSMS>("WHERE (clave = @0)", "VAL").SingleOrDefaultAsync();

                var CodigoSMS = new CodigoSMS()
                {
                    //CAMBIAR A PERSONAID DE LA SOCIA
                    PersonaID = (long)UsuarioActual.PersonaID, //parData.PersonaID,
                    Codigo = code,
                    FechaEnvio = DateTime.Now,
                    FechaCaduca = DateTime.Now.AddMinutes(tiempoExp),
                    Confirmado = false,
                    SMSId = null,
                    CanjeAppId = parData.CanjeAppId,
                    TipoID = tipoCodigo.TipoID,
                };

                await DBContext.database.InsertAsync(CodigoSMS);
                var empresa = await DBContext.database.QueryAsync<Empresas>("WHERE (empresaId = @0)", UsuarioActual.empresaId).SingleOrDefaultAsync();
                parData.src = empresa == null ? "" : empresa.TipoEmpresaID == 1 ? "VALE CONFIA" : empresa.TipoEmpresaID == 2 ? "PRESTA STAR" : "VALE VISIÓN";
                CodigoSMSController CodSMS = new(DBContext, env);

                SMS DataSMS = new()
                {
                    PersonaID = parData.PersonaID,
                    TelefonoMovil = Persona.TelefonoMovil,
                    MSG = $"{parData.src}: EL CODIGO PARA GENERAR SU VALE ES EL {code}.",
                    Referencia = "CODIGO",
                };

                var r = await CodSMS.SMS(DataSMS);

                if (r < 1)
                {
                    return BadRequest(new
                    {
                        resultCode = -2,
                        resultDesc = "No fue posible enviar el código por SMS, intente de nuevo mas tarde.",
                    });
                }

                CodigoSMS.SMSId = r;

                await DBContext.database.UpdateAsync(CodigoSMS);

                // var CanjeValeApp = await DBContext.database.SingleByIdAsync<CanjesValeApp>(parData.CanjeAppId);
                // CanjeValeApp.estatus = "P";
                // await DBContext.database.UpdateAsync(CanjeValeApp);

                DBContext.database.CompleteTransaction();

                await DBContext.Destroy();

                return Ok(
                    new
                    {
                        resultCode = 0,
                        resultDesc = "OK.",
                        data = CodigoSMS
                    }
                );
            }
            catch (Exception ex)
            {
                DBContext.database.AbortTransaction();
                await DBContext.Destroy();
                return BadRequest(new
                {
                    resultCode = -1,
                    resultDesc = "Ha ocurrido un error, intente de nuevo mas tarde.",
                    data = new { }
                });
            }

        }
        // [HttpPost]
        // [Route("enviaSMS1erCanje")]
        // [Authorize]
        // public async Task<IActionResult> enviaSMS1erCanje(PeticionesRest.AppValePeticiones.AppCreditos.Add parData, [FromHeader(Name = "ProductoID")] int producto)
        // {
        //     try
        //     {
        //         //NOTE: Datos del usuario logueado
        //         String linkCanje = "https://www.fconfia.com/valeconfia/";
        //         var Distribuidor = await DBContext.database.QueryAsync<Distribuidores_VW>("WHERE DistribuidorID = @0", parData.DistribuidorID).SingleOrDefaultAsync();
        //         var Cliente = await DBContext.database.SingleByIdAsync<Personas>(parData.ClienteID);
        //         var variable = await DBContext.database.QueryAsync<VariablesGlobales>("WHERE  (varName = @0)", "TIEMPO_EXPIRACION_CODIGO_SMS").FirstOrDefaultAsync();
        //         DBContext.database.BeginTransaction();
        //         int tiempoExp = Int32.Parse((string)variable.varValue);
        //         var tipoCodigo = await DBContext.database.QueryAsync<TipoCodigoSMS>("WHERE (clave = @0)", "VAL").SingleOrDefaultAsync();

        //         var CodigoSMS = new CodigoSMS()
        //         {
        //             PersonaID = (long)Distribuidor.PersonaID,
        //             FechaEnvio = DateTime.Now,
        //             FechaCaduca = DateTime.Now.AddMinutes(tiempoExp),
        //             Confirmado = false,
        //             SMSId = null,
        //             TipoID = tipoCodigo.TipoID,
        //         };

        //         await DBContext.database.InsertAsync(CodigoSMS);
        //         var empresa = await DBContext.database.QueryAsync<Empresas>("WHERE (empresaId = @0)", Distribuidor.EmpresaId).SingleOrDefaultAsync();
        //         //   parData.src = empresa == null ? "" : empresa.TipoEmpresaID == 1 ? "VALE CONFIA" : "PRESTA STAR";
        //         CodigoSMSController CodSMS = new(DBContext, env);

        //         SMS DataSMS = new()
        //         {
        //             PersonaID = (long)Distribuidor.PersonaID,
        //             TelefonoMovil = Cliente.TelefonoMovil,
        //             MSG = $"{(empresa == null ? "" : empresa.TipoEmpresaID == 1 ? "VALE CONFIA" : "PRESTA STAR")}: PARA CONCLUIR CON SU PROCESO DE CANJE ACCEDA AL SIGUIENTE ENLACE {linkCanje}.",
        //             Referencia = "PRIMER CANJE",
        //         };

        //         var r = await CodSMS.SMS(DataSMS);

        //         if (r < 1)
        //         {
        //             return BadRequest(new
        //             {
        //                 resultCode = -2,
        //                 resultDesc = "No fue posible enviar el código por SMS, intente de nuevo mas tarde.",
        //             });
        //         }

        //         CodigoSMS.SMSId = r;
        //         await DBContext.database.UpdateAsync(CodigoSMS);
        //         DBContext.database.CompleteTransaction();

        //         await DBContext.Destroy();

        //         return Ok(
        //             new
        //             {
        //                 resultCode = 0,
        //                 resultDesc = "OK.",
        //                 data = CodigoSMS
        //             }
        //         );
        //     }
        //     catch (Exception ex)
        //     {
        //         DBContext.database.AbortTransaction();
        //         await DBContext.Destroy();
        //         return BadRequest(new
        //         {
        //             resultCode = -1,
        //             resultDesc = "Ha ocurrido un error, intente de nuevo mas tarde.",
        //             data = new { }
        //         });
        //     }

        // }

        [HttpPost]
        [Route("verificarcodigo")]
        [Authorize]
        // [Code.TProteccionProducto]
        //   [Code.TProteccionAppVales]
        public async Task<IActionResult> VerificarCodigo(PeticionesRest.AppValePeticiones.AppCreditos.VerificarCodigo parData)
        {
            try
            {

                if (parData.isPrimerCanje)
                {
                    parData.FechaCaduca = DateTime.Now;

                    var CodigoSMS2 = await DBContext.database.QueryAsync<CodigoSMS>("WHERE  (Codigo = @Codigo) AND (FechaCaduca >= @FechaCaduca) AND (Confirmado = 0)", parData).FirstOrDefaultAsync();

                    var res2 = new Dictionary<string, dynamic>
                    {
                        ["resultCode"] = 0,
                        ["resultDesc"] = "",
                        ["data"] = new CodigoSMS()
                    };

                    if (CodigoSMS2 != null)
                    {

                        CodigoSMS2.Confirmado = true;

                        await DBContext.database.UpdateAsync(CodigoSMS2);
                        res2["resultCode"] = 0;
                        res2["resultDesc"] = "Ok.";
                        res2["data"] = CodigoSMS2;



                    }
                    else
                    {
                        res2["resultCode"] = -1;
                        res2["resultDesc"] = "Código Invalido";
                        res2["data"] = CodigoSMS2;
                    }

                    await DBContext.Destroy();

                    return Ok(res2);
                }

                //NOTE: Datos del usuario logueado
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                // if (UsuarioActual.PersonaID == 104)
                // {

                //     var CanjeValeApp = await DBContext.database.SingleByIdAsync<CanjesValeApp>(parData.CanjeAppId);
                //     CanjeValeApp.estatus = "P";
                //     await DBContext.database.UpdateAsync(CanjeValeApp);

                //     await DBContext.Destroy();
                //     return Ok(
                //         new
                //         {
                //             resultCode = 0,
                //             resultDesc = "OK.",
                //             data = new CodigoSMS()
                //             {
                //                 Id = 1,
                //                 Codigo = "123456",
                //                 FechaEnvio = DateTime.Now,
                //                 FechaCaduca = DateTime.Now.AddMinutes(5),
                //                 Confirmado = true,
                //                 SMSId = 0,
                //                 CanjeAppId = 0,
                //                 TipoID = 0,
                //             }
                //         }
                //     );
                // }

                parData.FechaCaduca = DateTime.Now;

                var CodigoSMS = await DBContext.database.QueryAsync<CodigoSMS>("WHERE (CanjeAppId = @CanjeAppId) AND (Codigo = @Codigo) AND (FechaCaduca >= @FechaCaduca) AND (Confirmado = 0)", parData).FirstOrDefaultAsync();

                var res = new Dictionary<string, dynamic>
                {
                    ["resultCode"] = 0,
                    ["resultDesc"] = "",
                    ["data"] = new CodigoSMS()
                };

                if (CodigoSMS != null)
                {


                    CodigoSMS.Confirmado = true;

                    await DBContext.database.UpdateAsync(CodigoSMS);

                    var CanjeValeApp = await DBContext.database.SingleByIdAsync<CanjesValeApp>(parData.CanjeAppId);
                    CanjeValeApp.estatus = "P";
                    await DBContext.database.UpdateAsync(CanjeValeApp);

                    // var Persona = await DBContext.database.SingleByIdAsync<Personas>(CanjeValeApp.ClienteID);

                    // var TiposDesembolso = await DBContext.database.SingleByIdAsync<TiposDesembolso>(CanjeValeApp.TipoDesembolsoID);

                    // CodigoSMSController CodSMS = new(DBContext, env);

                    // var reference = "";
                    // var msg = "";

                    // if (TiposDesembolso.RequiereDatosBancarios == false)
                    // {
                    //     reference = "FOLIO DIGITAL";
                    //     msg = $"{reference} EXITOSO PARA {Persona.NombreCompleto}, IMPORTE: {CanjeValeApp.Capital.ToString("C")} (VALEID: {CanjeValeApp.Folio}, CODIGO FOLIO: {CanjeValeApp.codigoValeDig})";
                    // }
                    // else
                    // {
                    //     reference = "VALE DIGITAL";
                    //     var PersonaDatosBancarios = await DBContext.database.QueryAsync<PersonasDatosBancarios>("WHERE  personasDatosBancariosID = @0", CanjeValeApp.personasDatosBancariosID).OrderByDescending(x => x.personasDatosBancariosID).FirstOrDefaultAsync();

                    //     if (CanjeValeApp.personasDatosBancariosID > 0 && PersonaDatosBancarios != null)
                    //     {
                    //         var numTarjeta = PersonaDatosBancarios.datoBancario.Substring(PersonaDatosBancarios.datoBancario.Length - 4);
                    //         msg = $"{reference}: LE INFORMAMOS QUE SE HA ORDENADO UN SPEI A SU TARJETA CON TERMINACION: {numTarjeta}, POR LA CANTIDAD DE {CanjeValeApp.Capital.ToString("C")}, GRACIAS POR SU PREFERENCIA.";
                    //     }
                    //     else
                    //     {
                    //         msg = $"{reference}: LE INFORMAMOS QUE SE HA ORDENADO UN SPEI, POR LA CANTIDAD DE {CanjeValeApp.Capital.ToString("C")}, FAVOR DE PASAR A SUCURSAL PARA PROPORCIONAR SUS DATOS BANCARIOS, GRACIAS POR SU PREFERENCIA.";
                    //     }
                    // }


                    res["resultCode"] = 0;
                    res["resultDesc"] = "Ok.";
                    res["data"] = CodigoSMS;



                }
                else
                {
                    res["resultCode"] = -1;
                    res["resultDesc"] = "Código Invalido";
                    res["data"] = CodigoSMS;
                }

                await DBContext.Destroy();

                return Ok(res);
            }
            catch (Exception ex)
            {

                await DBContext.Destroy();
                return BadRequest(new
                {
                    resultCode = -3,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }
        }

        //Cancelar Valee
        [HttpPost]
        [Route("cancelarvale")]
        [Authorize]
        public async Task<IActionResult> CancelarVale(PeticionesRest.AppValePeticiones.AppCreditos.CancelarVale parData)
        {
            try
            {
                CanjesValeApp vale = await DBContext.database.QueryAsync<CanjesValeApp>("WHERE (CanjeAppId = @0)", parData.CanjeAppId).FirstOrDefaultAsync();

                //Distribuidor persona
                var usuario = await DBContext.database.QueryAsync<UsuariosApp_VW>("WHERE DistribuidorID = @0", parData.DistribuidorID).SingleOrDefaultAsync();

                if (vale == null)
                {
                    await DBContext.Destroy();
                    return Ok(new
                    {
                        resultCode = 2,
                        resultDesc = $"Este vale no fue generado desde la app. No puede ser cancelado",
                    });
                }

                if (vale.estatus == "C")
                {
                    await DBContext.Destroy();
                    return Ok(new
                    {
                        resultCode = 1,
                        resultDesc = $"Este vale ya ha sido cancelado.",
                    });
                }

                //Verificar si el vale es del distribuidor
                if (vale.DistribuidorID != parData.DistribuidorID)
                {
                    await DBContext.Destroy();
                    return Ok(new
                    {
                        resultCode = 2,
                        resultDesc = $"Este vale no pertenece a este distribuidor.",
                    });
                }

                //Si el vale esta como pendinte se puede cancelar
                if (vale.estatus == "P")
                {
                    vale.estatus = "C";
                    vale.fechaCancelacion = DateTime.Now;
                    vale.idUsuarioCancelacion = usuario.UsuarioID;
                    await DBContext.database.UpdateAsync(vale);
                    await DBContext.Destroy();
                    return Ok(new
                    {
                        resultCode = 0,
                        resultDesc = $"El vale ha sido cancelado exitosamente.",
                    });
                }
                else
                {
                    await DBContext.Destroy();
                    return Ok(new
                    {
                        resultCode = 1,
                        resultDesc = "Este vale ya no se puede cancelar.",
                    });
                }
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(new
                {
                    resultCode = -1,
                    resultDesc = "Ha ocurrido un error, intente de nuevo mas tarde." + ex.Message,
                });
            }
        }

        [HttpPost]
        [Route("canjevalecv")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> CanjeValeCV(PeticionesRest.AppValePeticiones.AppCreditos.Canje parData, [FromHeader(Name = "ProductoID")] int producto)
        {

            try
            {

                parData.ProductoID = producto;

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var Usuario = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                parData.UsuarioID = Usuario.UsuarioID;

                //var Cajas = await DBContext.database.QueryAsync<CatalogoCajas>("WHERE (UsuarioID = @0) AND (Estatus = 1)", Usuario.UsuarioID).FirstOrDefaultAsync();

                //parData.SucursalID = Cajas.SucursalID;

                //parData.Codigo = parData.Codigo.ToUpper();

                DBContext.database.BeginTransaction();

                var datos = await DBContext.database.QueryAsync<DatosValeRes>("EXEC [AppVale].[pa_RecuperaDatosFolioDigital_sel] @ProductoID, @SucursalID, @UsuarioID, @Codigo", parData).FirstOrDefaultAsync();

                if (datos.regresa < 1)
                {
                    DBContext.database.AbortTransaction();
                    return Ok(datos);
                }

                var parms = new
                {
                    datos.CanjeAppId,
                    datos.ProductoID,
                    datos.DistribuidorID,
                    datos.ClienteID,
                    datos.SucursalID,
                    datos.SerieId,
                    datos.Folio,
                    datos.Capital,
                    datos.Plazos,
                    Usuario.UsuarioID,
                    datos.TipoDesembolsoID,
                    personasDatosBancariosID = datos.personasDatosBancariosID > 0 ? datos.personasDatosBancariosID : null,
                    datos.valeDigital,
                    Usuario.PersonaID,
                    datos.VentaId,
                    datos.MovimientoID,
                    datos.CreditoID,
                    datos.regresa,
                    datos.msj,
                };

                string Stored = "EXEC AppVale.pa_CreaCreditosApp_Ins @ProductoID, @DistribuidorID, @ClienteID, @SucursalID, @SerieId, @Folio, @Capital, @Plazos, @UsuarioID, @TipoDesembolsoID, @personasDatosBancariosID, @valeDigital, @PersonaID, @VentaId, @MovimientoID, @CreditoID, @regresa, @msj";

                var res = await DBContext.database.QueryAsync<CanjeaValeRes>(Stored, parms).FirstOrDefaultAsync();

                if (res.regresa != 1)
                {
                    DBContext.database.AbortTransaction();
                    return Ok(res);
                }

                var CanjeValeApp = await DBContext.database.SingleByIdAsync<CanjesValeApp>(datos.CanjeAppId);
                CanjeValeApp.CreditoID = res.CreditoId;
                CanjeValeApp.MovimientoID = res.MovimientoID;
                CanjeValeApp.estatus = "A";
                CanjeValeApp.fechaRegistro = DateTime.Now;
                await DBContext.database.UpdateAsync(CanjeValeApp);

                var Credito = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoID = @0", res.CreditoId).FirstOrDefaultAsync();
                var Persona = await DBContext.database.SingleByIdAsync<Personas>(Credito.ClienteID);
                var Contrato = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Creditos.Contratos>(Credito.ContratoID);

                Credito.VentaId = datos.VentaId;

                await DBContext.database.UpdateAsync(Credito);

                CodigoSMSController CodSMS = new(DBContext, env);

                var reference = "";
                var msg = "";

                msg = "INFO: EL VALE No " + datos.Folio.ToString() + ", FUE CANJEADO POR " + Persona.NombreCompleto + ", POR LA CANTIDAD DE " + Credito.Capital.ToString() + ", REF: " + res.MovimientoID.ToString() + ", TU DISPONIBLE ES DE: " + Contrato.LineaCreditoDisponible.ToString();

                SMS DataSMS = new()
                {
                    PersonaID = datos.ClienteID,
                    TelefonoMovil = Persona.TelefonoMovil,
                    MSG = msg,
                    Referencia = reference,
                };

                var r = await CodSMS.SMS(DataSMS);

                DBContext.database.CompleteTransaction();

                // datos.VentaId = parData.VentaId;

                await DBContext.Destroy();

                return Ok(res);

            }
            catch (Exception ex)
            {
                DBContext.database.AbortTransaction();
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        [Route("getDatos")]
        [Authorize]
        //[Code.TProteccionProducto]
        public async Task<ActionResult> GetDatos(PeticionesRest.AppValePeticiones.AppCreditos.GetDatos parData, [FromHeader(Name = "ProductoID")] int producto)
        {

            try
            {
                parData.ProductoID = producto;

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var Usuario = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                parData.UsuarioID = Usuario.UsuarioID;

                //var Cajas = await DBContext.database.QueryAsync<CatalogoCajas>("WHERE (UsuarioID = @0) AND (Estatus = 1)", Usuario.UsuarioID).FirstOrDefaultAsync();

                //parData.SucursalID = Cajas.SucursalID;

                //parData.Codigo = parData.Codigo.ToUpper();

                var datos = await DBContext.database.QueryAsync<DatosValeRes>("EXEC [AppVale].[pa_RecuperaDatosFolioDigital_sel] @ProductoID, @SucursalID, @UsuarioID, @Codigo", parData).FirstOrDefaultAsync();

                await DBContext.Destroy();

                return Ok(datos);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }

        }


        //         [HttpPost]
        //         [Route("primerCanje")]
        //         [Authorize]
        //         //[Code.TProteccionProducto]
        //         public async Task<ActionResult> primerCanje(PeticionesRest.AppValePeticiones.AppCreditos.Add parData, [FromHeader(Name = "ProductoID")] int producto)
        //         {
        //             try
        //             {
        //                 parData.ProductoID = producto;
        //                 var data = new
        //                 {

        //                     DistribuidorID = parData.DistribuidorID,
        //                     ProductoID = parData.ProductoID,
        //                     ClienteID = parData.ClienteID,
        //                     SucursalID = parData.SucursalID,
        //                     Capital = parData.Capital,
        //                     Plazos = parData.Plazos,
        //                     PersonasDatosBancariosID = parData.personasDatosBancariosID,
        //                     TipoDesembolsoID = parData.TipoDesembolsoID,
        //                     ValidacionCanje = 1,
        //                     CoordenadasLong =
        //                     parData.longitud,
        //                     CoordenadasLati = parData.latitud,
        //                 };


        //                 int resp = 0;
        //                 String Msj = "";
        //                 long folioVale = 0;

        //                 var options = new JsonSerializerOptions
        //                 {
        //                     DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull, // Ignora propiedades nulas.
        //                     WriteIndented = false, // Controla la indentación del JSON (false para no indentar).
        //                                            //   PropertyNamingPolicy = JsonNamingPolicy.Equals // Nombres de propiedades en camelCase.
        //                 };

        //                 string jsonData = JsonSerializer.Serialize(data, options);

        //                 using (SqlCommand cmd = new SqlCommand("Creditos.pa_PrimerCanjeClienteCV", sqlConnection)
        // )
        //                 {
        //                     cmd.CommandType = CommandType.StoredProcedure;
        //                     var errorParam2 = cmd.Parameters.Add("@Error", SqlDbType.Int);
        //                     errorParam2.Direction = ParameterDirection.Output;

        //                     var msjParam2 = cmd.Parameters.Add("@Msj", SqlDbType.VarChar, 500);
        //                     msjParam2.Direction = ParameterDirection.Output;


        //                     cmd.Parameters.Add(new SqlParameter("@JsonData", SqlDbType.VarChar)
        //                     {
        //                         Value = jsonData
        //                     });
        //                     await sqlConnection.OpenAsync();
        //                     using (var reader = await cmd.ExecuteReaderAsync())
        //                     {
        //                         if (reader.HasRows)

        //                             while (await reader.ReadAsync())
        //                             {
        //                                 // folioVale = (string)reader["FolioVale"];
        //                                 folioVale = Convert.ToInt64(reader["FolioVale"] == DBNull.Value ? 0 : reader["FolioVale"]);
        //                             }
        //                     }
        //                     resp = (int)(errorParam2.Value ?? 0);
        //                     Msj = msjParam2.Value.ToString();
        //                 }
        //                 await sqlConnection.CloseAsync();

        //                 if (resp < 0)
        //                 {

        //                     return Ok(new
        //                     {
        //                         resultCode = 2,
        //                         resultDesc = Msj,
        //                         data = new
        //                         {
        //                             resultCode = 2,
        //                             msj = Msj,
        //                             folioSolicitud = 0
        //                         }
        //                     });
        //                 }



        //                 var Clente = await DBContext.database.QueryAsync<AppClientes_VW>("WHERE (ClienteID = @0)", parData.ClienteID).FirstOrDefaultAsync();


        //                 CodigoSMSController CodSMS = new(DBContext, env);

        //                 SMS DataSMS = new()
        //                 {
        //                     PersonaID = parData.ClienteID,
        //                     TelefonoMovil = Clente.telefono,
        //                     MSG = "SU SOLICITUD HA SIDO ENVIADA,AHORA NUESTRO EQUIPO CONTINUARA CON EL PROCESO",
        //                     Referencia = "SOLICITUD CANJE",
        //                 };

        //                 var r = await CodSMS.SMS(DataSMS);

        //                 // if (r < 1)
        //                 // {
        //                 //     return BadRequest(new
        //                 //     {
        //                 //         resultCode = -2,
        //                 //         resultDesc = "No fue posible enviar el código por SMS, intente de nuevo mas tarde.",
        //                 //         data = new
        //                 //         {

        //                 //         }
        //                 //     });
        //                 // }

        //                 var res = new
        //                 {

        //                     resultCode = 0,

        //                     resultDesc = Msj,
        //                     data = new
        //                     {
        //                         resultCode = 0,
        //                         msj = Msj,
        //                         folioSolicitud = folioVale

        //                     }
        //                 };
        //                 await DBContext.Destroy();
        //                 return Ok(res);
        //             }
        //             catch (Exception ex)
        //             {
        //                 //Cerrar conexion
        //                 await DBContext.Destroy();
        //                 await sqlConnection.CloseAsync();
        //                 return BadRequest(new
        //                 {
        //                     resultCode = -15,
        //                     resultDesc = ex.Message,
        //                     data = new { }
        //                 });
        //             }
        //         }
        [HttpPost]
        [Route("primerCanje")]
        [Authorize]
        public async Task<ActionResult> primerCanje(PeticionesRest.AppValePeticiones.AppCreditos.Add parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                parData.ProductoID = producto;
                String direccion = "N/A";
                var dataPerson = await DBContext.database.SingleByIdAsync<Personas>(parData.ClienteID);
                var datoBancario = await DBContext.database.QueryAsync<PersonasDatosBancarios_VW>("WHERE personaID = @0", parData.ClienteID).FirstOrDefaultAsync();
                var distrib = await DBContext.database.SingleByIdAsync<Personas>(parData.DistribuidorID);
                var distribuidorDireccion = await DBContext.database.QueryAsync<Direcciones_VW>("WHERE PersonaID = @0", parData.DistribuidorID).FirstOrDefaultAsync();
                if (distribuidorDireccion != null)
                {
                    direccion = $"VIALIDAD: {distribuidorDireccion.NombreVialidad}, ASENTAMIENTO: {distribuidorDireccion.Asentamiento},MUNICIPIO: {distribuidorDireccion.Municipio}, CIUDAD: {distribuidorDireccion.Ciudad} ,CP: {distribuidorDireccion.CodigoPostal.ToString()}";
                }
                if (dataPerson == null)
                    return Ok(new
                    {
                        resultCode = 2,
                        resultDesc = "Cliente no encontrado.",
                        data = new
                        {
                            resultCode = 2,
                            msj = "Cliente no encontrado.",
                            folioSolicitud = (long)0
                        }
                    });

                var Persona = new
                {
                    Nombre = dataPerson.Nombre,
                    PrimerApellido = dataPerson.ApellidoPaterno,
                    SegundoApellido = dataPerson.ApellidoMaterno,
                    Curp = dataPerson.CURP,
                    SexoID = dataPerson.SexoID == "M" ? 1 : dataPerson.SexoID == "F" ? 2 : 3,
                    Telefono = dataPerson.TelefonoMovil,
                    OrigenSistema = 30,
                    PersonasDatosBancariosID = (datoBancario == null || datoBancario.personasDatosBancariosID == null) ? 0 : datoBancario.personasDatosBancariosID,
                    DatoBancario = (datoBancario == null || String.IsNullOrEmpty(datoBancario.datoBancario)) ? "N/A" : datoBancario.datoBancario

                };
                var Solicitud = new
                {
                    ClienteID = parData.ClienteID,
                    DistribuidorID = parData.DistribuidorID,
                    SucursalID = parData.SucursalID,
                    SistemaID = parData.ProductoID,
                    Monto = parData.Capital,
                    Plazos = parData.Plazos,
                    PersonasDatosBancariosID = parData.personasDatosBancariosID,
                    TipoDesembolsoID = parData.TipoDesembolsoID,
                    CoordenadasLong = parData.longitud,
                    CoordenadasLati = parData.latitud,
                    NombreDistribuidor = distrib.NombreCompleto,
                    DireccionDistribuidor = direccion
                };
                var data = new
                {
                    Persona,
                    Solicitud
                };

                dynamic userMovilKYC;
                using (var context = new NPoco.Database(sqlConnectionKYC))
                {
                    await sqlConnectionKYC.OpenAsync();
                    const string query = "SELECT Credencial,Valor FROM CredencialesKyc WITH (NOLOCK) WHERE Llave = 'moviles_crs'";
                    userMovilKYC = await context.QueryAsync<dynamic>(query).FirstOrDefaultAsync();
                }

                if (userMovilKYC == null)
                {
                    throw new Exception("No se pudo obtener las credenciales de la base de datos.");
                }
                string url_token = "https://apikyc.grupoconfia.mx/api/validacion/GenerarSolicitudM";
                //    string url_token = "http://192.168.220.81:45455/api/validacion/GenerarSolicitudM";
                var client = new HttpClient();
                client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic",
                    Convert.ToBase64String(Encoding.ASCII.GetBytes($"{userMovilKYC.Credencial}:{userMovilKYC.Valor}")));

                var response = await client.PostAsJsonAsync(url_token, data);

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    var errorResponse = JsonSerializer.Deserialize<ErrorResponse>(errorContent);

                    string mensaje = "";
                    if (errorResponse?.errors != null && errorResponse.errors.Count > 0)
                    {
                        var firstError = errorResponse.errors.First();
                        mensaje = $"{firstError.Key}: {firstError.Value.FirstOrDefault()}".ToUpper();
                    }
                    else
                    {
                        var smsError = JsonSerializer.Deserialize<ResponseChava>(errorContent);
                        if (smsError?.mensaje != null)
                        {
                            mensaje = smsError.mensaje.ToUpper();
                        }
                    }
                    return Ok(new
                    {
                        resultCode = 2,
                        resultDesc = $"NO SE PUDO GENERAR LA SOLICITUD, {mensaje}",
                        data = new
                        {
                            resultCode = 2,
                            msj = $"NO SE PUDO GENERAR LA SOLICITUD, {mensaje}",
                            folioSolicitud = (long)0
                        }
                    });
                }

                var result = await response.Content.ReadFromJsonAsync<ResponseChava>();

                string texto = $"BUEN DIA {dataPerson.Nombre} {dataPerson.ApellidoPaterno}. INGRESA AL SIGUIENTE LINK PARA CONTINUAR CON TU PROCESO: {result.Url}";
                CodigoSMSController CodSMS = new(DBContext, env);
                SMS DataSMS = new()
                {
                    PersonaID = parData.PersonaID,
                    TelefonoMovil = dataPerson.TelefonoMovil,
                    MSG = texto,
                    Referencia = "SOLICITUD VALE",
                };
                var r = await CodSMS.SMS(DataSMS);

                if (r < 1)
                {

                    return Ok(new
                    {
                        resultCode = 2,
                        resultDesc = "SE GENERO LA SOLICITUD PERO NO SE PUDO ENVIAR EL SMS",
                        data = new
                        {
                            resultCode = 2,
                            msj = "SE GENERO LA SOLICITUD PERO NO SE PUDO ENVIAR EL SMS",
                            folioSolicitud = result.folioSolicitud
                        }
                    });
                }

                var regreso = new
                {
                    resultCode = 0,
                    resultDesc = result.mensaje != null ? result.mensaje.ToUpper() : "ÉXITO",
                    data = new
                    {
                        resultCode = 0,
                        msj = result.mensaje != null ? result.mensaje.ToUpper() : "ÉXITO",
                        folioSolicitud = result.folioSolicitud
                    }
                };

                await DBContext.Destroy();
                return Ok(regreso);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                await sqlConnectionKYC.CloseAsync();
                await sqlConnectionKYC.DisposeAsync();
                return BadRequest(new
                {
                    resultCode = -15,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }
        }


        [HttpPost]
        [Route("updateClienteDatos")]
        [Authorize]
        //[Code.TProteccionProducto]
        public async Task<ActionResult> updateClienteDatos(PeticionesRest.Administracion.Personas.Agregar parData, [FromHeader(Name = "ProductoID")] int producto)
        {

            try
            {
                DBContext.database.BeginTransaction();
                var persona = await DBContext.database.SingleByIdAsync<Personas>(parData.AgregarDireccion.PersonaID);
                var personaDireccion = await DBContext.database.QueryAsync<PersonasDirecciones>("WHERE PersonaID=@0", persona.PersonaID).FirstOrDefaultAsync();
                var direccion = await DBContext.database.SingleByIdAsync<Direcciones>(personaDireccion.DireccionID);

                persona.Nombre = parData.Nombre;
                persona.ApellidoPaterno = parData.ApellidoPaterno;
                persona.ApellidoMaterno = parData.ApellidoMaterno;
                persona.FechaNacimiento = parData.FechaNacimiento;
                persona.LugarNacimiento = parData.LugarNacimiento;
                persona.NombreConyuge = parData.NombreConyuge;
                persona.identificacionTipoId = parData.identificacionTipoId;
                persona.identificacionNumero = parData.identificacionNumero;

                persona.CURP = parData.CURP;
                persona.RFC = "NOSEAGREGARF";
                persona.SexoID = parData.SexoID;
                persona.EstadoCivilID = parData.EstadoCivilID;
                persona.EscolaridadID = parData.EscolaridadID;

                persona.TelefonoDomicilio = parData.TelefonoDomicilio;
                persona.TelefonoMovil = parData.TelefonoMovil;
                persona.CorreoElectronico = parData.CorreoElectronico;
                persona.DependientesEconomicos = parData.DependientesEconomicos;
                persona.Observaciones = parData.Observaciones;

                await DBContext.database.UpdateAsync(persona);

                direccion.vialidadTipoId = parData.AgregarDireccion.DireccionPersona_vialidadTipoId;
                direccion.NombreVialidad = parData.AgregarDireccion.DireccionPersona_NombreVialidad;
                direccion.orientacionVialidadTipoId = parData.AgregarDireccion.DireccionPersona_orientacionVialidadTipoId;
                direccion.NumeroExterior = parData.AgregarDireccion.DireccionPersona_NumeroExterior;
                direccion.NumeroInterior = parData.AgregarDireccion.DireccionPersona_NumeroInterior;
                direccion.ReferenciasGeograficas = parData.AgregarDireccion.DireccionPersona_ReferenciaGeografica;
                direccion.AsentamientoID = parData.AgregarDireccion.DireccionPersona_AsentamientoID;
                direccion.ViviendaTipoId = parData.AgregarDireccion.DireccionPersona_viviendaTipoId;

                await DBContext.database.UpdateAsync(direccion);
                DBContext.database.CompleteTransaction();
                var res = new
                {
                    res = 1,
                    msj = $"Información Confirmada Correctamente",

                };
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
        [Route("PresDistApp")]
        [Authorize]
        // [Code.TProteccionProducto]
        //   [Code.TProteccionAppVales]
        public async Task<ActionResult> PresDistApp(PeticionesRest.AppValePeticiones.AppCreditos.PresDistApp parData, [FromHeader(Name = "ProductoID")] int producto)
        {

            try
            {
                var cajaInfo = await DBContext.database.QueryAsync<SucursalCajasOcupacion_VW>("WHERE (SucursalID = @SucursalID)", parData).FirstOrDefaultAsync();
                var ProductoID = producto;

                if (cajaInfo.CajaID < 1)
                    return BadRequest($"La Sucursal {cajaInfo.SucursalID} no cuenta con caja o cajera configurada");

                var parms = new
                {
                    ProductoID,
                    parData.SucursalId, //R
                    CajaID = cajaInfo.CajaID,
                    parData.Capital, //R
                    parData.Plazos, //R
                    UsuarioId = cajaInfo.UsuarioID,
                    parData.TipoDesembolsoID, //R
                    PersonaID = cajaInfo.PersonaID,
                    MovimientoID = 0,
                    DistribuidorId = parData.DistribuidorId, //R
                    ClienteId = parData.DistribuidorId,//R
                    PrestamoNomina = 0
                };

                string Stored = "";

                Stored = "EXEC Creditos.pa_PrestamoDistribuidor_Ins @ProductoID ,@DistribuidorId ,@ClienteId ,@SucursalId ,@CajaID ,@Capital ,@Plazos ,@UsuarioId ,@TipoDesembolsoID ,@PersonaID ,@MovimientoID ,@PrestamoNomina ";

                var res = await DBContext.database.QueryAsync<CanjeaValeRes>(Stored, parData).FirstOrDefaultAsync();

                if (res.regresa != 1)
                {
                    var creditoApp = new CreditosApp() { CreditoID = res.CreditoId, Fecha = DateTime.Now };
                    await DBContext.database.InsertAsync(creditoApp);

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
        [Route("getPrimerCanje")]
        [Authorize]
        public async Task<IActionResult> getPrimerCanje(ConfiaWebApi.PeticionesRest.AppValePeticiones.AppCreditos.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                parData.ProductoID = producto;
                string Stored = "";

                Stored = "EXEC Creditos.pa_MuestraPrimerCanjeappV2 @DistribuidorID ,@ProductoID";

                var Creditos = await DBContext.database.FetchAsync<ValesDVPrimerCanje>(Stored, parData);

                if (Creditos == null || !Creditos.Any())
                {
                    return Ok(new
                    {
                        resultCode = 2,
                        resultDesc = "No se encontraron datos.",
                        data = new List<object>() // Cambié a una lista vacía
                    });
                }

                var data = new List<object>(); // Usar List en lugar de ArrayList

                foreach (var Credito in Creditos)
                {
                    data.Add(new
                    {
                        valeId = Credito.valeId,
                        fhRegistro = Credito.fhRegistro.ToString("dd/MM/yyyy"),
                        cancelado = Credito.cancelado,
                        fhCancelacion = Credito.fhCancelacion?.ToString("dd/MM/yyyy"),
                        valeraDetalleId = Credito.valeraDetalleId,
                        nombreCliente = Credito.nombreCliente,
                        importe = Credito.importe,
                        plazos = Credito.plazos,
                        codigoVale = "",
                        canjeId = Credito.canjeId,
                        status = Credito.status,
                        creditoId = Credito.creditoId,
                        folio = 0,
                        folioPrimerCanje = Credito.folio,
                    });
                }

                await DBContext.Destroy(); // Asegúrate de que este método sea necesario

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                return Ok(res);


            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }

        }
        [HttpPost]
        [Route("gedetallePrimerCanje")]
        [Authorize]
        //     [Code.TProteccionProducto]
        //     [Code.TProteccionAppVales]
        public async Task<IActionResult> GetDetallePrimerCanje(PeticionesRest.AppValePeticiones.AppCreditos.GetDetalle parData, [FromHeader(Name = "ProductoID")] int producto)
        //   public async Task<IActionResult> GetDetalle(int CreditoID, int ProductoID, int isCanje)
        {
            try
            {
                parData.ProductoID = producto;
                string Stored = "";

                Stored = "EXEC Creditos.pa_MuestraPrimerCanjeappDetalle @0 ,@1 , @2";

                var Detalle = await DBContext.database.FetchAsync<ValesDVPrimerCanjeDetalle>(Stored, parData.DistribuidorID, parData.ProductoID, parData.folioPrimerCanje);

                if (Detalle == null || !Detalle.Any())
                {
                    return Ok(new
                    {
                        resultCode = 2,
                        resultDesc = "No se encontraron datos.",
                        data = new List<object>()
                    });
                }
                var firstDetalle = Detalle.First();

                var data2 = new
                {
                    plazos = firstDetalle.plazos,
                    plazoActual = 0,
                    folio = 0,
                    folioPrimerCanje = firstDetalle.folio,
                    saldoPagado = 0.00,
                    saldoActual = firstDetalle.saldoActual,
                    montoPago = (decimal)(firstDetalle.montoPago / firstDetalle.plazos),
                    telefono = firstDetalle.telefono,
                    noCredito = firstDetalle.noCredito,
                    noCliente = firstDetalle.noCliente,
                    nombreCliente = firstDetalle.nombreCliente,
                    fechaCredito = firstDetalle.fechaCredito,
                    status = firstDetalle.Status,
                    monto = firstDetalle.Monto,
                    codigoValeDig = firstDetalle.codigoValeDig,
                };


                await DBContext.Destroy();

                return Ok(new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = data2
                });

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }

        }
    }
}
