using System.Data.Common;
using System.Net;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;

using DBContext.DBConfia;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Seguridad;
using DBContext.DBConfia.dbo;
using DBContext.DBConfia.Custom.Tesoreria;

using System.Net.Http;
using System.Collections.Generic;
using System.Text.Json;
using System.Collections;
using DBContext.DBConfia.Balances;

using DBContext.DBConfia.Custom.MovimeintosCuentas;
using ConfiaWebApi.PeticionesRest.Creditos.Credito;
using System.IO;
using ConfiaWebApi.Code;
using System.Diagnostics;
using DBContext.DBConfia.Catalogos;
using System.Globalization;

namespace ConfiaWebApi.Controllers.Sistema
{
    [Authorize]
    [ApiController]
    [Route("api/SOMA/[controller]")]
    public class ReplicarCuentasController : ControllerBase
    {
        // TODO::
        //Introducción de nuevas cuentas

        /// <summary>
        /// Conexion a base de datos
        /// </summary>
        private DBConfiaContext DBContext;

        /// <summary>
        /// Constructor del controlador
        /// </summary>
        /// <param name="_DBContext">Conexión de datos para el controlador</param>
        public ReplicarCuentasController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }


        public class SaldoTotal
        {
            public decimal SaldoTotalCuenta { get; set; }
        }


        [HttpGet]
        [Route("obtenerMultisaldosCuenta/{iD}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> MultiSaldosCuenta(int iD)
        {
            var cuentas = await DBContext.database.QueryAsync<spMultisaldosCuenta>("exec Tesoreria.ObtenerMultisaldosCuenta @0", iD).SingleOrDefaultAsync();
            await DBContext.Destroy();
            return Ok(cuentas);
        }

        [HttpGet]
        [Route("obtenerMultisaldosCuentaV2/{iD}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> MultiSaldosCuentaV2(int iD)
        {
            var cuentas = await DBContext.database.QueryAsync<spMultisaldosCuentaV2>("exec Creditos.pa_Multisaldos_V2 @0", iD).ToArrayAsync();
            await DBContext.Destroy();
            return Ok(cuentas);
        }


        [HttpGet]
        [Route("cuentas-replicar/{CuentaBancariaPrincipalID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerCuentas(int CuentaBancariaPrincipalID)
        {
            var cuentas = await DBContext.database.QueryAsync<DBContext.DBConfia.Bancos.CatalogoCuentasBancos_VW>("WHERE CuentaBancariaPrincipalID = @0", CuentaBancariaPrincipalID).ToArrayAsync();
            await DBContext.Destroy();
            return Ok(cuentas);
        }


        // [HttpGet]
        // [Route("cuentas-movimientos/{CuentaBancariaPrincipalID}")]
        // [Authorize]
        // [Code.TProteccionProducto]
        // public async Task<IActionResult> ObtenerCuentasmov(int CuentaBancariaPrincipalID, DateTime FechaInicio, DateTime FechaFinal )
        // {
        //     try
        //     {
        //         //var AuxFechaInicio = Pa.FechaInicio//.Date //.ToString("dd/MM/yyyy");
        //         //var AuxFechaFinal = FechaFinal//.Date//.ToString("dd/MM/yyyy");
        //         if (FechaInicio == '')
        //         {
        //             FechaInicio = ''
        //         }      
                          
        //         var stored = "EXEC Bancos.pa_GetMovimientosCuentas @0,@1, @2";
        //         var data = await DBContext.database.QueryAsync<MovimeintosCuentas>(stored, CuentaBancariaPrincipalID, FechaInicio, FechaFinal).ToArrayAsync(); 

        //         return Ok(data);
        //     }
        //     catch (Exception ex)
        //     {
        //         await DBContext.Destroy();
        //         return BadRequest(new
        //         {
        //             resultCode = -1,
        //             resultDesc = ex.Message,
        //             data = new { }
        //         });
        //     }
        // }
        [HttpGet]
        [Route("cuentas-movimientos/{CuentaBancariaPrincipalID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerCuentasmov(int CuentaBancariaPrincipalID, DateTime? FechaInicio, DateTime? FechaFinal)
        {
            try
            {
                // Asignar fechas por defecto si no vienen
                if (!FechaInicio.HasValue)
                    FechaInicio = new DateTime(1900, 1, 1); // Fecha genérica

                if (!FechaFinal.HasValue)
                    FechaFinal = DateTime.Now; // Fecha actual

                var stored = "EXEC Bancos.pa_GetMovimientosCuentas @0, @1, @2";
                var data = await DBContext.database
                    .QueryAsync<MovimeintosCuentas>(stored, CuentaBancariaPrincipalID, FechaInicio.Value, FechaFinal.Value)
                    .ToArrayAsync();

             var cuentas = new DBContext.DBConfia.Bancos.Movimientos_VW[] { };

            // if (cuentaActual.EsBoveda)
            // {
            //     cuentas = await DBContext.database.QueryAsync<DBContext.DBConfia.Bancos.Movimientos_VW>("WHERE CuentaID = @0"
            //         + " and TipoMovimientoID in (60, 40)", CuentaBancariaPrincipalID).ToArrayAsync();
            // }
            // else
            // {
            //     cuentas = await DBContext.database.QueryAsync<DBContext.DBConfia.Bancos.Movimientos_VW>("WHERE CuentaID = @0"
            //         + " and TipoMovimientoID in (60, 40, 11, 6)", CuentaBancariaPrincipalID).ToArrayAsync();
            // }
            await DBContext.Destroy();
            return Ok(data);
        }
         catch (Exception ex)
            {
                DBContext.database.AbortTransaction();
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
            }



        [HttpGet]
        [Route("cuentas-principal")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerCuentasPrincipal()
        {
            var cuentas = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.CuentasBancariasPrincipal_VW>();
            await DBContext.Destroy();
            return Ok(cuentas);
        }

        [HttpGet]
        [Route("cuentas-Movimientos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerCuentasMov()
        {
            var cuentas = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.CatalogoCuentasBancos>("Select * from bancos.CatalogoCuentasBancos WHERE activo = 1 Order by NumeroCuenta ASC  ");
            await DBContext.Destroy();
            return Ok(cuentas);
        }


        [HttpGet]
        [Route("cuentas-MovimientosV2")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerCuentasMovV2()
        {
            var cuentas = await DBContext.database.FetchAsync<DBContext.DBConfia.Balances.BalancesProductos>("Select * from Balances.BalancesProductos");
            await DBContext.Destroy();
            return Ok(cuentas);
        }

        [HttpGet]
        [Route("sucursales")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerSucursales()
        {
            var cuentas = await DBContext.database.FetchAsync<DBContext.DBConfia.General.Sucursales_VW>();
            await DBContext.Destroy();
            return Ok(cuentas);
        }

        [HttpGet]
        [Route("productos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerProductos()
        {
            var cuentas = await DBContext.database.FetchAsync<DBContext.DBConfia.Creditos.ProductosVW>();
            await DBContext.Destroy();
            return Ok(cuentas);
        }

        [HttpPost]
        [Route("guardar-cuenta")]
        [Authorize]
        public async Task<IActionResult> GuardarCuenta(PeticionesRest.SOMA.ReplicarCuentas.GuardarCuenta parData)
        {
            try
            {
                DBContext.database.BeginTransaction();
                var cuentaDatos = await DBContext.database.SingleOrDefaultAsync<DBContext.DBConfia.Bancos.CatalogoCuentasBancos>("WHERE CuentaBancoID = @0", parData.CuentaBancoID);
                var cuenta = new DBContext.DBConfia.Bancos.CatalogoCuentasBancos()
                {
                    NumeroCuenta = parData.NumeroCuenta,
                    CuentaID = cuentaDatos.CuentaID,
                    Activo = cuentaDatos.Activo,
                    DispersionConvenio = cuentaDatos.DispersionConvenio,
                    Global = cuentaDatos.Global,
                    PuedeDispersar = cuentaDatos.PuedeDispersar,
                    SaldoMinimo = cuentaDatos.SaldoMinimo,
                    SaldoMaximo = cuentaDatos.SaldoMaximo,
                    ExcedenteSaldo = cuentaDatos.ExcedenteSaldo,
                    AgrupacionID = cuentaDatos.AgrupacionID,
                    SaldoActual = 0,
                    InstitucionOperante = cuentaDatos.InstitucionOperante,
                    InstitucionContraparte = cuentaDatos.InstitucionContraparte,
                    DescripcionCuenta = parData.Descripcion,
                    CobranzaConvenio = cuentaDatos.CobranzaConvenio,
                    ProductoID = parData.ProductoID,
                    Disponible = true,
                    EsBoveda = cuentaDatos.EsBoveda,
                    SucursalID = parData.SucursalID,
                    CuentaBancariaPrincipalID = cuentaDatos.CuentaBancariaPrincipalID,
                    PuedeGenGastos = cuentaDatos.PuedeGenGastos,

                };

                await DBContext.database.InsertAsync(cuenta);
                var cuentaNueva = await DBContext.database.SingleOrDefaultAsync<DBContext.DBConfia.Bancos.CatalogoCuentasBancos_VW>("WHERE CuentaBancoID = @0", cuenta.CuentaBancoID);
                DBContext.database.CompleteTransaction();
                await DBContext.Destroy();
                return Ok(cuentaNueva);

            }
            catch (Exception ex)
            {
                DBContext.database.AbortTransaction();
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("cancel")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Cancelar(PeticionesRest.SOMA.ReplicarCuentas.Cancel parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var obj = new
                {
                    MovimientoID = parData.Id,
                    UsuarioID = UsuarioActual.UsuarioID,
                    PersonaID = UsuarioActual.PersonaID,
                    Motivo = parData.MvCancelacion,
                    ProductoID = producto,
                };

                string Stored = "EXEC Bancos.pa_CancelarMovimiento @MovimientoID, @UsuarioID, @PersonaID, @Motivo, @ProductoID";

                var res = await DBContext.database.QueryAsync<CancelRes>(Stored, obj).FirstOrDefaultAsync();

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
        [Route("getEstadoCuentaPDF")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getEstadoCuentaPDF(PeticionesRest.SOMA.ReplicarCuentas.EstadoCuentaPDF parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            var listado_archivos = new List<string>();
            var listado_imagenes = new List<string>();
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var Cuenta = await DBContext.database.QueryAsync<DBContext.DBConfia.Bancos.CatalogoCuentasBancos>(@"Select CuentaBancoID,NumeroCuenta,DescripcionCuenta,BalanceVinculado FROM Bancos.CatalogoCuentasBancos WHERE CuentaBancoID = @0", parData.CuentaBancoID).FirstOrDefaultAsync();
                var Balance = await DBContext.database.QueryAsync<Balance>(@"SELECT BalanceID,NombreBalance FROM Balances.Balance WHERE BalanceID = @0", Cuenta.BalanceVinculado).FirstOrDefaultAsync();
                var variableLimite = await DBContext.database.QueryAsync<VariablesGlobales>("WHERE  (varName = @0)", "ESTADO_CUENTA_LIMITE_DETALLE").FirstOrDefaultAsync();
                int limiteReg = int.Parse(variableLimite.varValue.ToString());

                string Stored = "EXEC Tesoreria.EstadoDeCuentaXCuenta @0";
                var MovimientosEstadoCuenta = await DBContext.database.QueryAsync<dynamic>(Stored, parData.CuentaBancoID).ToArrayAsync();

                if (MovimientosEstadoCuenta == null)
                {
                    return BadRequest("No se encontraron movimientos para la cuenta seleccionada");
                }

                // Generamos un prefijo del nombre de archivo
                var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");
                var Count = 0;
                var CountMovimientosPorPagina = 0;

                var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Balances", "EstadoCuentaMovimientos.html"));
                html = html.Replace("@SERVER", HttpContext.Request.Host.Value);
                html = html.Replace("@CUENTA", Cuenta.CuentaBancoID.ToString() + " - " + Cuenta.NumeroCuenta.ToString() + " - " + Cuenta.DescripcionCuenta.ToString());
                html = html.Replace("@IMPRIMIO", UsuarioActual.UsuarioID + " - " + UsuarioActual.Nombre.ToString());
                html = html.Replace("@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                html = html.Replace("@BALANCE", (Balance != null ? Balance.BalanceID + " - " + Balance.NombreBalance.ToString() : "SIN BALANCE VINCULADO"));
                html = html.Replace("@JQUERY", "<script type=\"text/javascript\" src=\"https://code.jquery.com/jquery.min.js\"></script>");

                var TABLAMOVIMIENTOS = "";
                for (int i = 0; i < MovimientosEstadoCuenta.Length; i++)
                {
                    var movimiento = MovimientosEstadoCuenta[i];
                    bool isLast = (i == MovimientosEstadoCuenta.Length - 1); // Check if it's the last item

                    if (isLast)
                    {
                        TABLAMOVIMIENTOS += $@"<tr style='font-weight: bold;'>
                        <td colspan='4'>{" "}</td>
                        <td>{movimiento.CveMovimientoID ?? " "}</td>
                        <td class='text-center'>{movimiento.Observaciones ?? " "}</td>
                        <td class='text-center'>{movimiento.UsuarioIDRegistra ?? " "}</td>
                        <td class='text-end'>{" "}</td>
                        <td class='text-center'>{(movimiento.Importe != null ? movimiento.Importe.ToString("C", CultureInfo.CurrentCulture) : " ")}</td>
                        <td class='text-end'>{(movimiento.Abonos != null ? movimiento.Abonos.ToString("C", CultureInfo.CurrentCulture) : " ")}</td>
                        <td class='text-end'>{(movimiento.Cargos != null ? movimiento.Cargos.ToString("C", CultureInfo.CurrentCulture) : " ")}</td>
                        <td>{" "}</td>
                        </tr>";
                    }
                    else
                    {
                        TABLAMOVIMIENTOS += $@"<tr>
                            <td style='width: 10%;'>{movimiento.FechaCaptura ?? " "}</td>
                            <td style='width: 4%;'>{movimiento.MovimientoID ?? " "}</td>
                            <td style='width: 4%;'>{movimiento.CveMovimientoID ?? " "}</td>
                            <td style='width: 10%;'>{movimiento.FechaCaptura ?? " "}</td>
                            <td style='width: 28%;'>{movimiento.Observaciones ?? " "}</td>
                            <td style='width: 5%;'>{movimiento.UsuarioIDRegistra ?? " "}</td>
                            <td style='width: 4%;' class='text-center'>{movimiento.RefApl ?? " "}</td>
                            <td style='width: 7%;' class='text-end'>{""}</td>
                            <td style='width: 7%;' class='text-end'>{(movimiento.Importe != null ? movimiento.Importe.ToString("C", CultureInfo.CurrentCulture) : " ")}</td>
                            <td style='width: 7%;' class='text-end'>{(movimiento.Abonos != null ? movimiento.Abonos.ToString("C", CultureInfo.CurrentCulture) : " ")}</td>
                            <td style='width: 7%;' class='text-end'>{(movimiento.Cargos != null ? movimiento.Cargos.ToString("C", CultureInfo.CurrentCulture) : " ")}</td>
                            <td style='width: 7%;' class='text-end'>{(movimiento.Acumulado != null ? movimiento.Acumulado.ToString("C", CultureInfo.CurrentCulture) : " ")}</td>
                        </tr>";
                    }

                    // if (CountMovimientosPorPagina >= limiteReg && !isLast)
                    // {
                    //     html = html.Replace("@TABLAMOVIMIENTOS", TABLAMOVIMIENTOS);
                    //     await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, $"{prefijo_archivo}4_{Count}.html"), html);
                    //     listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, $"{prefijo_archivo}4_{Count}.html"));

                    //     html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Balances", "EstadoCuentaMovimientos.html"));
                    //     html = html.Replace("@SERVER", HttpContext.Request.Host.Value);
                    //     html = html.Replace("@CUENTA", $"{Cuenta.CuentaBancoID} - {Cuenta.NumeroCuenta} - {Cuenta.DescripcionCuenta}");
                    //     html = html.Replace("@IMPRIMIO", $"{UsuarioActual.UsuarioID} - {UsuarioActual.Nombre}");
                    //     html = html.Replace("@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                    //     html = html.Replace("@JQUERY", "<script type=\"text/javascript\" src=\"https://code.jquery.com/jquery.min.js\"></script>");

                    Count++;
                    //     TABLAMOVIMIENTOS = "";
                    //     CountMovimientosPorPagina = 0;
                    // }

                    CountMovimientosPorPagina++;
                }


                html = html.Replace("@TABLAMOVIMIENTOS", TABLAMOVIMIENTOS);

                await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "5_" + Count.ToString() + ".html")), html);
                listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "5_" + Count.ToString() + ".html")));

                if (Count > 0)
                {
                    // Ejecutamos el proceso de wkhtmltopdf
                    Process p = new()
                    {
                        StartInfo = new ProcessStartInfo(PDF.RUTA_WKHTMLTOPDF())
                    };

                    p.StartInfo.Arguments = string.Concat("--header-right [page]/[topage] -O landscape --encoding utf-8", " ",
                    string.Join(" ", listado_archivos), " ",
                    Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
                    p.StartInfo.CreateNoWindow = true;
                    p.Start();
                    await p.WaitForExitAsync();

                    // Obtenemos el contenido de nuestro archivo de PDF
                    var pdf = await System.IO.File.ReadAllBytesAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));

                    // Obtenemos nuestro PDF
                    var pdfStream = new MemoryStream();
                    pdfStream.Write(pdf, 0, pdf.Length);
                    pdfStream.Position = 0;

                    // Limpiamos los archivos que se utilizaron
                    foreach (var archivo in listado_archivos)
                        System.IO.File.Delete(archivo);

                    foreach (var imagen in listado_imagenes)
                        System.IO.File.Delete(imagen);

                    // Eliminamos el PDF
                    System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
                    //System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF_signed.pdf")));

                    await DBContext.Destroy();
                    // Enviamos el PDF a la UI
                    return new FileStreamResult(pdfStream, "application/pdf");
                }

                await DBContext.Destroy();
                return BadRequest("ERROR AL OBTENER - FAVOR DE REPORTAR A SISTEMAS");
            }
            catch (Exception ex)
            {
                // Limpiamos los archivos que se utilizaron
                foreach (var archivo in listado_archivos)
                    System.IO.File.Delete(archivo);

                foreach (var imagen in listado_imagenes)
                    System.IO.File.Delete(imagen);

                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}
