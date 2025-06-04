using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using ConfiaWebApi.PeticionesRest.SOMA.TraspasoEntreSistemas;
using DBContext.DBConfia;
using DBContext.DBConfia.Bancos;
using DBContext.DBConfia.Custom.Bancos;
using DBContext.DBConfia.Custom.Tesoreria;
using DBContext.DBConfia.Seguridad;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace ConfiaWebApi.Controllers.Sistema
{
    [Authorize]
    [ApiController]
    [Route("api/SOMA/[controller]")]
    public class TraspasoEntreSistemasController : ControllerBase
    {
        // private readonly HttpClient _httpClient;
        // private const string ApiKey = "123456";
        private DBConfiaContext DBContext;

         public TraspasoEntreSistemasController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;

            // _httpClient = new HttpClient
            // {
            //     BaseAddress = new Uri("http://localhost:3000/Catalogo")
            // };
            // _httpClient.DefaultRequestHeaders.Add("ApiKey", ApiKey);

        }
[HttpGet]
        [Route("sistemas")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> sistemas()
        {
            try
            {

              var handler = new HttpClientHandler
                {
                    ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true
                };
                using (var client = new HttpClient(handler))
                {
                    var request = new HttpRequestMessage(HttpMethod.Get, "https://apitesoreria.grupoconfia.mx/api/Catalogo/Sistemas");
                    request.Headers.Add("X-Api-Key", "a20d2455");

                    var response = await client.SendAsync(request);
                    response.EnsureSuccessStatusCode();

                    var body = await response.Content.ReadAsStringAsync();

                     var objeto = System.Text.Json.JsonSerializer.Deserialize<ApiResponse>(body);


                    await DBContext.Destroy();
                    return Ok(objeto.data);
                }
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("cuentasOrigen")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> cuentasOrigen(PeticionesRest.SOMA.TraspasoEntreSistemas.GetCuentasOrigen parData)
        {
            try
            {
                if (parData.SistemaOrigenID == 14)
                {
                    var res = await DBContext.database.QueryAsync<CatalogoCuentasBancos>("WHERE Activo=1 Order By NumeroCuenta").ToArrayAsync();
                    await DBContext.Destroy();
                    return Ok(res);
                }
                else
                {
                    var handler = new HttpClientHandler
                    {
                        ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true
                    };

                    using (var client = new HttpClient(handler))
                    {
                        client.DefaultRequestHeaders.Add("X-Api-Key", "a20d2455");

                        var response = await client.PostAsync(
                            $"https://apitesoreria.grupoconfia.mx/api/Catalogo/Cuentas?sistemaID={parData.SistemaOrigenID}",
                            null
                        );
                        // $"https://apitesoreria.grupoconfia.mx/api/Catalogo/Cuentas?sistemaID={parData.SistemaOrigenID}",

                        response.EnsureSuccessStatusCode();

                        var body = await response.Content.ReadAsStringAsync();
                        var objeto = System.Text.Json.JsonSerializer.Deserialize<ApiResponseCuentas>(body);

                        await DBContext.Destroy();
                        return Ok(objeto.data);
                    }
                }
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("cuentasDestino")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> cuentasDestino(PeticionesRest.SOMA.TraspasoEntreSistemas.GetCuentasDestino parData)
        {
            try
            {
                if (parData.SistemaDestinoID == 14)
                {
                    var res = await DBContext.database.QueryAsync<CatalogoCuentasBancos>("WHERE Activo=1 Order By NumeroCuenta").ToArrayAsync();
                    await DBContext.Destroy();
                    return Ok(res);
                }
                else
                {
                    var handler = new HttpClientHandler
                    {
                        ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true
                    };

                    using (var client = new HttpClient(handler))
                    {
                        client.DefaultRequestHeaders.Add("X-Api-Key", "a20d2455");

                        var response = await client.PostAsync(
                           $"https://apitesoreria.grupoconfia.mx/api/Catalogo/Cuentas?sistemaID={parData.SistemaDestinoID}",
                            null
                        );

                        response.EnsureSuccessStatusCode();

                        var body = await response.Content.ReadAsStringAsync();
                        var objeto = System.Text.Json.JsonSerializer.Deserialize<ApiResponseCuentas>(body);

                        await DBContext.Destroy();
                        return Ok(objeto.data);
                    }
                }
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("SaldosOrigen")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> SaldosOrigen(PeticionesRest.SOMA.TraspasoEntreSistemas.GetSaldosOrigen parData)
        {
            try
            {
                if (parData.SistemaOrigenID == 14)
                {
                    var cuentas = await DBContext.database.QueryAsync<spMultisaldosCuenta>("exec Tesoreria.ObtenerMultisaldosCuenta @0", parData.CuentaOrigenID).SingleOrDefaultAsync();
                    await DBContext.Destroy();
                    return Ok(cuentas.saldoTotalCuenta);
                }
                else
                {
                    var handler = new HttpClientHandler
                    {
                        ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true
                    };

                    using (var client = new HttpClient(handler))
                    {
                        client.DefaultRequestHeaders.Add("X-Api-Key", "a20d2455");

                        var response = await client.PostAsync(
                           $"https://apitesoreria.grupoconfia.mx/api/Catalogo/Saldos?sistemaID={parData.SistemaOrigenID}&cuentaID={parData.CuentaOrigenID}",
                            null
                        );

                        response.EnsureSuccessStatusCode();

                        var body = await response.Content.ReadAsStringAsync();
                        var objeto = System.Text.Json.JsonSerializer.Deserialize<ApiResponseSaldos>(body);

                        await DBContext.Destroy();
                        return Ok(objeto.data);
                    }
                }
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("SaldosDestino")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> SaldosDestino(PeticionesRest.SOMA.TraspasoEntreSistemas.GetSaldosDestino parData)
        {
            try
            {
                if (parData.SistemaDestinoID == 14)
                {
                    var cuentas = await DBContext.database.QueryAsync<spMultisaldosCuenta>("exec Tesoreria.ObtenerMultisaldosCuenta @0", parData.CuentaDestinoID).SingleOrDefaultAsync();
                    await DBContext.Destroy();
                    return Ok(cuentas.saldoTotalCuenta);
                }
                else
                {
                    var handler = new HttpClientHandler
                    {
                        ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true
                    };

                    using (var client = new HttpClient(handler))
                    {
                        client.DefaultRequestHeaders.Add("X-Api-Key", "a20d2455");

                        var response = await client.PostAsync(
                             $"https://apitesoreria.grupoconfia.mx/api/Catalogo/Saldos?sistemaID={parData.SistemaDestinoID}&cuentaID={parData.CuentaDestinoID}",
                            null
                        );

                        response.EnsureSuccessStatusCode();

                        var body = await response.Content.ReadAsStringAsync();
                        var objeto = System.Text.Json.JsonSerializer.Deserialize<ApiResponseSaldos>(body);

                        await DBContext.Destroy();
                        return Ok(objeto.data);
                    }
                }
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> add(PeticionesRest.SOMA.TraspasoEntreSistemas.Add parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                parData.Observaciones = parData.Observaciones + " -Usuario:" +  UsuarioActual.UsuarioID.ToString();

                long regresaF = 0;

                if((parData.SistemaDestinoID == parData.SistemaOrigenID) && (parData.CuentaDestinoID == parData.CuentaOrigenID))
                {
                    await DBContext.Destroy();
                    return BadRequest("LOS CAMPOS SELECCIONADOS SISTEMAS/CUENTAS SON ASI MISMOS");
                }
                DBContext.database.BeginTransaction();
                //************************ CARGO ******************************//
                if (parData.SistemaOrigenID == 14)
                {
                    var Datos = new {
                        UsuarioActual.UsuarioID,
                        UsuarioActual.PersonaID,
                        parData.Observaciones,
                        CuentaID = parData.CuentaOrigenID,
                        parData.Monto,
                        Cargo = 1
                    };
                    var cuentas = await DBContext.database.QueryAsync<spTraspaso>("exec Bancos.pa_TraspasoEntreSistemas @UsuarioID,@PersonaID,@Observaciones,@CuentaID,@Monto, @Cargo", Datos).SingleOrDefaultAsync();

                    regresaF = cuentas.MovimientoID;
                }
                else
                {
                    var handler = new HttpClientHandler
                    {
                        ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true
                    };

                    using (var client = new HttpClient(handler))
                    {
                        client.DefaultRequestHeaders.Add("X-Api-Key", "a20d2455");

                        var Json = new
                        {
                            solicita = parData.Observaciones,
                            descripcion = parData.Observaciones,
                            observaciones = parData.Observaciones,
                            cant = parData.Monto,
                            pre_uni = parData.Monto,
                            importe = parData.Monto
                        };
                        parData.Json = JsonConvert.SerializeObject(Json);

                        var response = await client.PostAsync(
                           $"https://apitesoreria.grupoconfia.mx/api/Tesoreria/CargoAbono?sistemaID={parData.SistemaOrigenID}&cuentaID={parData.CuentaOrigenID}&monto={parData.Monto}&tipoMovimiento={2}&observaciones={parData.Observaciones}&jsonCargo={parData.Json}",
                            null
                        );

                        response.EnsureSuccessStatusCode();

                        var body = await response.Content.ReadAsStringAsync();
                        var objeto = System.Text.Json.JsonSerializer.Deserialize<ApiResponseMovimiento>(body);

                        regresaF = objeto.data[0].movimientoID;

                    }
                }

                //************************** ABONO ***************************//
                if(regresaF > 0)
                {
                    if (parData.SistemaDestinoID == 14)
                    {
                        var Datos = new {
                            UsuarioActual.UsuarioID,
                            UsuarioActual.PersonaID,
                            parData.Observaciones,
                            CuentaID = parData.CuentaDestinoID,
                            parData.Monto,
                            Cargo = 0
                        };
                        var cuentas = await DBContext.database.QueryAsync<spTraspaso>("exec Bancos.pa_TraspasoEntreSistemas @UsuarioID,@PersonaID,@Observaciones,@CuentaID,@Monto, @Cargo", Datos).SingleOrDefaultAsync();

                        if(cuentas.MovimientoID > 0)
                        {
                            DBContext.database.CompleteTransaction();
                        }
                        else
                        {
                            DBContext.database.AbortTransaction();
                        }
                        
                        var movs = new {
                            MovimientoOrigen = regresaF,
                            MovimientoDestino = cuentas.MovimientoID
                        };

                        var log = new DBContext.DBConfia.Tesoreria.TraspasoEntreSistemasLog()
                        {
                            SistemaOrigenID = parData.SistemaOrigenID,
                            CuentaOrigenID = parData.CuentaOrigenID,
                            SistemaDestinoID = parData.SistemaDestinoID,
                            CuentaDestinoID = parData.CuentaDestinoID,
                            Monto = parData.Monto,
                            Observaciones = parData.Observaciones,
                            FechaHoraRegistra = DateTime.Now,
                            PersonaRegistraID = (long)UsuarioActual.PersonaID,
                            UsuarioRegistraID = UsuarioActual.UsuarioID
                        };
                        await DBContext.database.InsertAsync(log);

                        await DBContext.Destroy();
                        return Ok(movs);
                    }
                    else
                    {
                        var handler = new HttpClientHandler
                        {
                            ServerCertificateCustomValidationCallback = (message, cert, chain, errors) => true
                        };

                        using (var client = new HttpClient(handler))
                        {
                            client.DefaultRequestHeaders.Add("X-Api-Key", "a20d2455");

                            var Json = new
                            {
                                solicita = parData.Observaciones,
                                descripcion = parData.Observaciones,
                                observaciones = parData.Observaciones,
                                cant = parData.Monto,
                                pre_uni = parData.Monto,
                                importe = parData.Monto
                            };
                            parData.Json = JsonConvert.SerializeObject(Json);

                            var response = await client.PostAsync(
                            $"https://apitesoreria.grupoconfia.mx/api/Tesoreria/CargoAbono?sistemaID={parData.SistemaDestinoID}&cuentaID={parData.CuentaDestinoID}&monto={parData.Monto}&tipoMovimiento={1}&observaciones={parData.Observaciones}&jsonCargo={parData.Json}",
                            null
                        );

                            response.EnsureSuccessStatusCode();

                            var body = await response.Content.ReadAsStringAsync();
                            var objeto = System.Text.Json.JsonSerializer.Deserialize<ApiResponseMovimiento>(body);
                            
                            if(objeto.data[0].movimientoID > 0)
                            {
                                DBContext.database.CompleteTransaction();
                            }
                            else
                            {
                                DBContext.database.AbortTransaction();
                            }

                            var movs = new {
                                MovimientoOrigen = regresaF,
                                MovimientoDestino = objeto.data[0].movimientoID
                            };

                            var log = new DBContext.DBConfia.Tesoreria.TraspasoEntreSistemasLog()
                            {
                                SistemaOrigenID = parData.SistemaOrigenID,
                                CuentaOrigenID = parData.CuentaOrigenID,
                                SistemaDestinoID = parData.SistemaDestinoID,
                                CuentaDestinoID = parData.CuentaDestinoID,
                                Monto = parData.Monto,
                                Observaciones = parData.Observaciones,
                                FechaHoraRegistra = DateTime.Now,
                                PersonaRegistraID = (long)UsuarioActual.PersonaID,
                                UsuarioRegistraID = UsuarioActual.UsuarioID
                            };
                            await DBContext.database.InsertAsync(log);

                            await DBContext.Destroy();
                            return Ok(movs);
                        }
                    }
                }
                else
                {
                    DBContext.database.AbortTransaction();
                    await DBContext.Destroy();
                    return BadRequest("ERROR AL CREAR CARGO");
                }
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }


        


        // public async Task<List<TuModelo>> GetDatosAsync()
        // {
        //     try
        //     {
        //         var response = await _httpClient.GetAsync("catalogo/sistemas");
        //         response.EnsureSuccessStatusCode();

        //         return await response.Content.ReadFromJsonAsync<List<TuModelo>>();
        //     }
        //     catch (Exception ex)
        //     {
        //         Console.WriteLine($"Error al obtener datos: {ex.Message}");
        //         return null;
        //     }
        // }

        // public async Task<bool> CrearDatoAsync(TuModelo nuevoDato)
        // {
        //     try
        //     {
        //         var jsonContent = new StringContent(JsonSerializer.Serialize(nuevoDato), Encoding.UTF8, "application/json");
        //         var response = await _httpClient.PostAsync("tesoreria-abono", jsonContent);

        //         return response.IsSuccessStatusCode;
        //     }
        //     catch (Exception ex)
        //     {
        //         Console.WriteLine($"Error al crear dato: {ex.Message}");
        //         return false;
        //     }
        // }


    }

}

