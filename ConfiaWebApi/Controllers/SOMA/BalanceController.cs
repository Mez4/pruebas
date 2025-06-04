using System.Data.Common;
using System.Net;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;

using DBContext.DBConfia;
using DBContext.DBConfia.Balances;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Tesoreria;
using DBContext.DBConfia.dbo;

using System.Net.Http;
using System.Collections.Generic;
using System.Text.Json;
using System.Collections;
using DBContext.DBConfia.Custom.Balances;

using System.IO;
using ConfiaWebApi.Code;
using System.Diagnostics;
using System.Globalization;
using iText.Kernel.Pdf;
using iText.Kernel.Geom;

using Path = System.IO.Path;
using iText.Layout.Element;
using iText.Layout;
using iText.Layout.Properties;
using iText.IO.Image;
using iText.Kernel.Colors;
using iText.Layout.Borders;
using Microsoft.AspNetCore.Hosting;
using System.Security.Principal;
using Microsoft.AspNetCore.Identity;
using DBContext.DBConfia.Creditos;

using CtasCobranza = DBContext.DBConfia.Custom.Balances3.CobranzaCuentas;
using CtasDni = DBContext.DBConfia.Custom.Balances3.DniCuentas;
using CtasDeposito = DBContext.DBConfia.Custom.Balances3.DepositosCuentas;
using CtasRetiros = DBContext.DBConfia.Custom.Balances3.RetirosCuentas;
using CtasDesembolso = DBContext.DBConfia.Custom.Balances3.DesembolsoCuentas;
using CtasCuentas = DBContext.DBConfia.Custom.Balances3.CuentasBalance;
using CtasNuevosPrestamos = DBContext.DBConfia.Custom.Balances3.NuevosPrestamos;
using CtasTiendita = DBContext.DBConfia.Custom.Balances3.Tiendita;
using CtasProtecciones = DBContext.DBConfia.Custom.Balances3.Protecciones;
using BalCancelaciones = DBContext.DBConfia.Custom.Balances3.CancelacionesBalance;
using IntGeneralCuentas = DBContext.DBConfia.Custom.Balances3.GeneralCuentas;
using TotalesCuentas = DBContext.DBConfia.Custom.Balances3.SumaTotalCuentas;
using SucursalComisiones = DBContext.DBConfia.Custom.Balances3.SucursalComisiones;
using TasasSeguros = DBContext.DBConfia.Custom.Balances3.TasasSeguros;
using CobranzaCF = DBContext.DBConfia.Custom.Balances3.CobranzaCF;
using TasasComisiones = DBContext.DBConfia.Custom.Balances3.TasasComisiones;
using MultisaldosCuentas = DBContext.DBConfia.Custom.Balances3.Multisaldos;
using MultisaldosCuentas2 = DBContext.DBConfia.Custom.Balances3.Multisaldos2;
using MultisaldosCuentasefec = DBContext.DBConfia.Custom.Balances3.Multisaldosefec;
using MultisaldosCuentascorres = DBContext.DBConfia.Custom.Balances3.MultisaldosCorres;
using GastosNuevo = DBContext.DBConfia.Custom.Balances3.GastosNuevo;
using DepositosDNICuentas = DBContext.DBConfia.Custom.Balances3.DepositosDNICuentas;
using CanjesDigitales = DBContext.DBConfia.Custom.Balances3.CanjesDigitales;
using DepositosBalance = DBContext.DBConfia.Custom.Balances3.DepositosBalance;
using NPoco.Expressions;
using System.Text;

namespace ConfiaWebApi.Controllers.Sistema
{
    [Authorize]
    [ApiController]
    [Route("api/SOMA/[controller]")]
    public class BalanceController : ControllerBase
    {
        // TODO::
        // Validar funcion de eliminar cuenta... ??, valido, util ?
        // Segundo, se pueden eliminar las bovedas ??, se pueden actualizar hasta que nivel? (Nombre y Clave o solo nombre?)

        /// <summary>
        /// Conexion a base de datos
        /// </summary>
        private DBConfiaContext ConexionBD;

        /// <summary>
        /// /// Constructor del controlador
        /// </summary>
        /// <param name="_ConexionBD">Conexión de datos para el controlador</param>
        public BalanceController(DBConfiaContext _ConexionBD) { this.ConexionBD = _ConexionBD; }

        [HttpGet]
        [Route("obtenerBalances")]
        [Authorize]
        public async Task<IActionResult> obtenerBalances()
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            try
            {
                //raw query para obtener los balances de 
                //SELECT * FROM Balances.BalancesProductos bp WITH (NOLOCK)
                var query = NPoco.Sql.Builder.Select("*").From("Balances.BalancesProductos with (nolock)");
                var res1 = await ConexionBD.database.FetchAsync<Dictionary<string, object>>(query);
                return Ok(res1);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }


        [HttpGet]
        [Route("generar-tmultisaldos")]
        [Authorize]
        public async Task<IActionResult> GenerarTSaldos()
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            try
            {
                ArrayList res = new();
                var productos = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Creditos.Productos>();

                foreach (var item in productos)
                {
                    var detalle = await ConexionBD.database.QueryAsync<MultiSaldosW>("EXEC Balances.pa_Multisaldos_SEL2 @0, @1", item.ProductoID, UsuarioActual.UsuarioID).ToArrayAsync();
                    res.Add(new
                    {
                        ProductoID = item.ProductoID,
                        NombreProducto = item.Producto,
                        Detalle = detalle
                    });

                }
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }

        }

        [HttpPost]
        [Route("generar-msaldos-cierrediario")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GenerarMSaldosCierreDiario(ConfiaWebApi.PeticionesRest.Balances.MultiSaldos.CierreMultiSaldosGet parData)

        {
            var cabecero = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Balances.MultiSaldos>("WHERE CierreDiario = 1 AND CAST(FechaCaptura AS DATE) =CAST(@0 as DATE) ", parData.FechaInicio).FirstOrDefaultAsync();
            if (cabecero != null)
            {
                var detalleMultiSaldos = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Balances.MultiSaldosDetalle>("WHERE MultiSaldoID = @0 ORDER BY ProductoID", cabecero.MultiSaldoID).ToArrayAsync();
                await ConexionBD.Destroy();
                var a = new
                {
                    TipoRespuesta = 1,
                    Detalle = detalleMultiSaldos
                };
                await ConexionBD.Destroy();
                return Ok(a);
            }
            else
            {
                var a = new
                {
                    TipoRespuesta = 2
                };
                await ConexionBD.Destroy();
                return Ok(a);

            }
        }

        [HttpGet]
        [Route("obtener-nombrebalance/{balanceTempID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> obtenerNombreBalance(int balanceTempID)

        {
            var nombre = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Balances.Balance2>("WHERE BalanceTempID=@0", balanceTempID).FirstOrDefaultAsync();
            var nombreBalance = nombre.NombreBalance;
            await ConexionBD.Destroy();
            return Ok(nombreBalance);
        }

        [HttpPost]
        [Route("getBalances")]
        [Authorize]
        public async Task<IActionResult> getBalances()
        {
            try
            {
                var balance = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Balances.BalancesProductos>();
                await ConexionBD.Destroy();
                return Ok(balance);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpGet]
        [Route("obtener-periodo/{balanceTempID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerPeriodo(int balanceTempID)

        {
            var periodo = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Balances.Balance2>("WHERE BalanceTempID=@0", balanceTempID).FirstOrDefaultAsync();
            await ConexionBD.Destroy();
            return Ok(periodo);
        }

        [HttpPost]
        [Route("imprimir-msaldos-bovedas")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ImprimirMultiSaldosBovedas(ConfiaWebApi.PeticionesRest.Balances.MultiSaldos.Print parData)

        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");
            var listado_archivos = new List<string>();
            var Count = 0;
            var tabla1 = "";
            var tabla2 = "";
            var headerTabla2 = "";
            var DatosConDetalle = "";
            var cantRegistros = 0;
            decimal totalSaldoFisico = 0;
            decimal totalSaldoSistema = 0;
            decimal totalDiferencia = 0;
            int cajaAnterior = 0;
            int productoAnterior = 0;
            int longitudRespuesta = 0;

            CultureInfo myCI = new CultureInfo("en-US", false);

            try
            {
                if (parData.MultiSaldoID != 0)
                {
                    var detalleMultisaldo = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.MultiSaldosBovedasDetalle>("WHERE MultiSaldoBovedaID = @0", parData.MultiSaldoID).ToArrayAsync();
                    if (detalleMultisaldo == null)
                    {
                        return BadRequest("No se encontró el periodo");
                    }
                    longitudRespuesta = detalleMultisaldo.Count();
                    var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "MultiSaldosBovedas", "Caratula.html"));

                    tabla1 += "<tr>";
                    tabla1 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !icmportant;\">" + "Producto" + "</th>";
                    tabla1 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Sucursal" + "</th>";
                    tabla1 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Núm de Cuenta" + "</th>";
                    tabla1 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Desc Cuenta" + "</th>";
                    tabla1 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Caja" + "</th>";
                    tabla1 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Cuenta Banco" + "</th>";
                    tabla1 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Núm de Cuenta" + "</th>";
                    tabla1 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Saldo Actual" + "</th>";
                    tabla1 += "</tr>";


                    foreach (var item in detalleMultisaldo)
                    {
                        cantRegistros = cantRegistros + 1;
                        if (cantRegistros < 10)
                        {
                            if (productoAnterior == 0)
                            {
                                tabla1 += "<tr>";
                                tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\"><strong>" + item.Producto + "</strong></td>";
                                tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.NombreSucursal + "</td>";
                                tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.NumCuentaPR + "</td>";
                                tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.DescCuentaPR + "</td>";
                                tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.NombreCaja + "</td>";
                                tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.DescripcionCuenta + "</td>";
                                tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.NumeroCuenta + "</td>";
                                tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.SaldoActual.ToString("C", myCI) + "</td>";
                                tabla1 += "</tr>";
                                cajaAnterior = item.CajaID;
                                productoAnterior = item.ProductoID;
                            }
                            else
                            {
                                if (productoAnterior == item.ProductoID)
                                {
                                    tabla1 += "<tr>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\"><strong>" + item.Producto + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.NombreSucursal + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.NumCuentaPR + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.DescCuentaPR + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.NombreCaja + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.DescripcionCuenta + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.NumeroCuenta + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.SaldoActual.ToString("C", myCI) + "</td>";
                                    tabla1 += "</tr>";
                                    cajaAnterior = item.CajaID;
                                    productoAnterior = item.ProductoID;

                                    if (cantRegistros == detalleMultisaldo.Count())
                                    {
                                        //Filtrar los datos de la tabla por unv alor especifico
                                        var detalleMultiSaldosFiltrado2 = detalleMultisaldo.Where(x => x.ProductoID == item.ProductoID).ToList();
                                        //Sumar valores de las columnas del detalle filtrado
                                        var sumaTotalFisico2 = detalleMultiSaldosFiltrado2.Sum(x => x.SaldoActual);
                                        //Pintar en un tr los totales
                                        tabla1 += "<tr>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5s% !important;\"><strong>" + "" + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5s% !important;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5s% !important;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5s% !important;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5s% !important;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5s% !important;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5s% !important;\"><strong>" + "Total " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5s% !important;\"><strong>" + sumaTotalFisico2.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                        tabla1 += "</tr>";
                                    }

                                }
                                else
                                {
                                    //Filtrar los datos de la tabla por unv alor especifico
                                    var detalleMultiSaldosFiltrado = detalleMultisaldo.Where(x => x.ProductoID == productoAnterior).ToList();
                                    //Sumar valores de las columnas del detalle filtrado
                                    var sumaTotalFisico = detalleMultiSaldosFiltrado.Sum(x => x.SaldoActual);
                                    // var sumaTotalSistema = detalleMultiSaldosFiltrado.Sum(x => x.SaldoSistemaUltA);


                                    //Pintar en un tr los totales
                                    tabla1 += "<tr>";
                                    tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10s% !important;\"><strong>" + "" + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10s% !important;\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10s% !important;\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10s% !important;\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10s% !important;\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10s% !important;\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10s% !important;\"><strong>" + "Total " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10s% !important;\"><strong>" + sumaTotalFisico.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                    tabla1 += "</tr>";


                                    //Tr con br para espaciar
                                    tabla1 += "<tr>";
                                    tabla1 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "</tr>";


                                    //Tr para nuevo producto
                                    tabla1 += "<tr>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\"><strong>" + item.Producto + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.NombreSucursal + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.NumCuentaPR + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.DescCuentaPR + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.NombreCaja + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.DescripcionCuenta + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.NumeroCuenta + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.SaldoActual.ToString("C", myCI) + "</td>";
                                    tabla1 += "</tr>";

                                    productoAnterior = item.ProductoID;
                                    cajaAnterior = item.CajaID;

                                    var total = detalleMultisaldo.Count();

                                    if (cantRegistros == detalleMultisaldo.Count())
                                    {
                                        //Filtrar los datos de la tabla por unv alor especifico
                                        var detalleMultiSaldosFiltrado2 = detalleMultisaldo.Where(x => x.ProductoID == item.ProductoID).ToList();
                                        //Sumar valores de las columnas del detalle filtrado
                                        var sumaTotalFisico2 = detalleMultiSaldosFiltrado2.Sum(x => x.SaldoActual);
                                        //Pintar en un tr los totales
                                        tabla1 += "<tr>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5s% !important;\"><strong>" + "" + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5s% !important;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5s% !important;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5s% !important;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5s% !important;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5s% !important;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5s% !important;\"><strong>" + "Total " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5s% !important;\"><strong>" + sumaTotalFisico2.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                        tabla1 += "</tr>";
                                    }



                                }

                            }
                        }
                        else
                        {
                            if (productoAnterior == 0)
                            {
                                tabla2 += "<tr>";
                                tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\"><strong>" + item.Producto + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.NombreSucursal + "</td>";
                                tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.NumCuentaPR + "</td>";
                                tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.DescCuentaPR + "</td>";
                                tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.NombreCaja + "</td>";
                                tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.DescripcionCuenta + "</td>";
                                tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.NumeroCuenta + "</td>";
                                tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.SaldoActual.ToString("C", myCI) + "</td>";
                                tabla2 += "</tr>"; tabla2 += "</tr>";
                                cajaAnterior = item.CajaID;
                                productoAnterior = item.ProductoID;
                            }
                            else
                            {
                                if (productoAnterior == item.ProductoID)
                                {
                                    tabla2 += "<tr>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\"><strong>" + item.Producto + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.NombreSucursal + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.NumCuentaPR + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.DescCuentaPR + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.NombreCaja + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.DescripcionCuenta + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.NumeroCuenta + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.SaldoActual.ToString("C", myCI) + "</td>";
                                    tabla2 += "</tr>";
                                    cajaAnterior = item.CajaID;
                                    productoAnterior = item.ProductoID;
                                }
                                else
                                {
                                    //Filtrar los datos de la tabla por unv alor especifico
                                    var detalleMultiSaldosFiltrado = detalleMultisaldo.Where(x => x.ProductoID == productoAnterior).ToList();
                                    //Sumar valores de las columnas del detalle filtrado
                                    var sumaTotalFisico = detalleMultiSaldosFiltrado.Sum(x => x.SaldoActual);
                                    //var sumaTotalSistema = detalleMultiSaldosFiltrado.Sum(x => x.SaldoSistemaUltA);


                                    //Pintar en un tr los totales
                                    tabla2 += "<tr>";
                                    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10s% !important;\"><strong>" + "" + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10s% !important;\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10s% !important;\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10s% !important;\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10s% !important;\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10s% !important;\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10s% !important;\"><strong>" + "Total " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10s% !important;\"><strong>" + sumaTotalFisico.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                    tabla2 += "</tr>";


                                    //Tr con br para espaciar
                                    tabla2 += "<tr>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "</tr>";


                                    //Tr para nuevo producto
                                    tabla2 += "<tr>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\"><strong>" + item.Producto + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.NombreSucursal + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.NumCuentaPR + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.DescCuentaPR + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.NombreCaja + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.DescripcionCuenta + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.NumeroCuenta + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.SaldoActual.ToString("C", myCI) + "</td>";
                                    tabla2 += "</tr>";

                                    cajaAnterior = item.CajaID;
                                    productoAnterior = item.ProductoID;

                                    if (cantRegistros == detalleMultisaldo.Count())
                                    {
                                        //Filtrar los datos de la tabla por unv alor especifico
                                        var detalleMultiSaldosFiltrado2 = detalleMultisaldo.Where(x => x.ProductoID == item.ProductoID).ToList();
                                        //Sumar valores de las columnas del detalle filtrado
                                        var sumaTotalFisico2 = detalleMultiSaldosFiltrado.Sum(x => x.SaldoActual);
                                        tabla2 += "<tr>";
                                        tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + "" + "</strong></td>";
                                        tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + " " + "</strong></td>";
                                        tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + " " + "</strong></td>";
                                        tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + " " + "</strong></td>";
                                        tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + " " + "</strong></td>";
                                        tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + " " + "</strong></td>";
                                        tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + " " + "</strong></td>";
                                        tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + "Total " + "</strong></td>";
                                        tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + sumaTotalFisico2.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                        tabla2 += "</tr>";
                                    }



                                }

                            }

                        }


                    }
                    if (cantRegistros < 10)
                    {
                        html = html.Replace("@@HEADER_DETALLE", tabla1);
                        html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                        html = html.Replace("@@IMPRIMIO", UsuarioActual.Nombre);
                        html = html.Replace("@@FECHAGENERADO", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                        html = html.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                        html = html.Replace("@@DATOS_DETALLE", DatosConDetalle);
                        await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")), html);
                        listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")));
                    }
                    else
                    {
                        html = html.Replace("@@HEADER_DETALLE", tabla1);
                        html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                        html = html.Replace("@@IMPRIMIO", UsuarioActual.Nombre);
                        html = html.Replace("@@FECHAGENERADO", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                        html = html.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                        html = html.Replace("@@DATOS_DETALLE", DatosConDetalle);
                        await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")), html);
                        listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")));



                        headerTabla2 += "<tr>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 10% !icmportant;\">" + "Nombre Sucursal" + "</th>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Nombre Caja" + "</th>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Cerrada" + "</th>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Estatus" + "</th>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Fecha Últ. Arq." + "</th>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Realiza" + "</th>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Número Cuenta" + "</th>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Desc. Cuenta" + "</th>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Saldo Físico" + "</th>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Saldo Sistema" + "</th>";
                        headerTabla2 += "</tr>";


                        html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Balances", "Detalle.html"));
                        html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                        html = html.Replace("@@DATOS_DETALLE2", tabla2);
                        html = html.Replace("@@HEADER_DETALLE", headerTabla2);

                        await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "2_" + Count.ToString() + ".html")), html);
                        listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "2_" + Count.ToString() + ".html")));

                    }



                }



                var lenght = cantRegistros;
                var lenght2333 = longitudRespuesta;


                Process p = new()
                {
                    StartInfo = new ProcessStartInfo(PDF.RUTA_WKHTMLTOPDF())
                };
                p.StartInfo.Arguments = string.Concat("--footer-center [page]/[topage] -O landscape --encoding utf-8", " ",
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
                // Eliminamos el PDF
                System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));

                // Enviamos el PDF a la UI
                return new FileStreamResult(pdfStream, "application/pdf");
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }



        [HttpPost]
        [Route("imprimir-msaldos-arqueos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ImprimirMultiSaldosArqueos(ConfiaWebApi.PeticionesRest.Balances.MultiSaldos.Print parData)

        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");
            var listado_archivos = new List<string>();
            var Count = 0;
            var tabla1 = "";
            var tabla2 = "";
            var headerTabla2 = "";
            var DatosConDetalle = "";
            var cantRegistros = 0;
            decimal totalSaldoFisico = 0;
            decimal totalSaldoSistema = 0;
            decimal totalDiferencia = 0;
            int cajaAnterior = 0;
            int sucursalAnterior = 0;
            int longitudRespuesta = 0;

            CultureInfo myCI = new CultureInfo("en-US", false);

            try
            {
                if (parData.MultiSaldoID != 0)
                {
                    var detalleMultisaldo = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Balances.MultiSaldosArqueosDetalle>("WHERE MultiSaldoArqueoID = @0", parData.MultiSaldoID).ToArrayAsync();
                    if (detalleMultisaldo == null)
                    {
                        return BadRequest("No se encontró el periodo");
                    }
                    longitudRespuesta = detalleMultisaldo.Count();
                    var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "MultiSaldosArqueos", "Caratula.html"));

                    tabla1 += "<tr>";
                    tabla1 += "<th class=\"text-center fs-6\" style=\"width: 10% !icmportant;\">" + "Nombre Sucursal" + "</th>";
                    tabla1 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Nombre Caja" + "</th>";
                    tabla1 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Cerrada" + "</th>";
                    tabla1 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Estatus" + "</th>";
                    tabla1 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Fecha Últ. Arq." + "</th>";
                    tabla1 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Realiza" + "</th>";
                    tabla1 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Número Cuenta" + "</th>";
                    tabla1 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Desc. Cuenta" + "</th>";
                    tabla1 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Saldo Físico" + "</th>";
                    tabla1 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Saldo Sistema" + "</th>";
                    tabla1 += "</tr>";


                    foreach (var item in detalleMultisaldo)
                    {
                        cantRegistros++;
                        if (cantRegistros < 10)
                        {
                            if (sucursalAnterior == 0)
                            {
                                tabla1 += "<tr>";
                                tabla1 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\"><strong>" + item.NombreSucursal + "</strong></td>";
                                tabla1 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + item.NombreCaja + "</td>";
                                tabla1 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + (item.Cerrada ? "Si" : "No") + "</td>";
                                tabla1 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + (item.Estatus ? "Activa" : "Inactiva") + "</td>";
                                tabla1 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + (item.FechaUltimoArqueo != null ? item.FechaUltimoArqueo.ToString() : "No se ha realizado.") + "</td>";
                                tabla1 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + item.UsuarioRealiza + "</td>";
                                tabla1 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + item.NombreCuenta + "</td>";
                                tabla1 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + item.DescCuenta + "</td>";
                                tabla1 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + item.SaldoFisicoUltA.ToString("C", myCI) + "</td>";
                                tabla1 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + item.SaldoSistemaUltA.ToString("C", myCI) + "</td>";
                                tabla1 += "</tr>";
                                cajaAnterior = item.CajaID;
                                sucursalAnterior = item.SucursalID;
                            }
                            else
                            {
                                if (sucursalAnterior == item.SucursalID)
                                {
                                    tabla1 += "<tr>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\"><strong>-</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + (item.CajaID == cajaAnterior ? "-" : item.NombreCaja) + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + (item.Cerrada ? "Si" : "No") + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + (item.Estatus ? "Activa" : "Inactiva") + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + (item.FechaUltimoArqueo != null ? item.FechaUltimoArqueo.ToString() : "No se ha realizado.") + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + item.UsuarioRealiza + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + item.NombreCuenta + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + item.DescCuenta + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + item.SaldoFisicoUltA.ToString("C", new CultureInfo("en-US")) + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + item.SaldoSistemaUltA.ToString("C", myCI) + "</td>";
                                    tabla1 += "</tr>";
                                    cajaAnterior = item.CajaID;
                                    sucursalAnterior = item.SucursalID;
                                }
                                else
                                {
                                    //Filtrar los datos de la tabla por unv alor especifico
                                    var detalleMultiSaldosFiltrado = detalleMultisaldo.Where(x => x.SucursalID == sucursalAnterior).ToList();
                                    //Sumar valores de las columnas del detalle filtrado
                                    var sumaTotalFisico = detalleMultiSaldosFiltrado.Sum(x => x.SaldoFisicoUltA);
                                    var sumaTotalSistema = detalleMultiSaldosFiltrado.Sum(x => x.SaldoSistemaUltA);


                                    //Pintar en un tr los totales
                                    tabla1 += "<tr>";
                                    tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10s% !important;\"><strong>" + "" + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10s% !important;\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10s% !important;\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10s% !important;\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10s% !important;\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10s% !important;\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10s% !important;\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10s% !important;\"><strong>" + "Total " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10s% !important;\"><strong>" + sumaTotalFisico.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10s% !important;\"><strong>" + sumaTotalSistema.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                    tabla1 += "</tr>";


                                    //Tr con br para espaciar
                                    tabla1 += "<tr>";
                                    tabla1 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "</tr>";


                                    //Tr para nuevo producto
                                    tabla1 += "<tr>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\"><strong>" + item.NombreSucursal + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + item.NombreCaja + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + (item.Cerrada ? "Si" : "No") + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + (item.Estatus ? "Activa" : "Inactiva") + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + (item.FechaUltimoArqueo != null ? item.FechaUltimoArqueo.ToString() : "No se ha realizado.") + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + item.UsuarioRealiza + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + item.NombreCuenta + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + item.DescCuenta + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + item.SaldoFisicoUltA.ToString("C", new CultureInfo("en-US")) + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + item.SaldoSistemaUltA.ToString("C", myCI) + "</td>";
                                    tabla1 += "</tr>";

                                    sucursalAnterior = item.SucursalID;
                                    cajaAnterior = item.CajaID;

                                    if (cantRegistros == detalleMultisaldo.Count())
                                    {
                                        //Filtrar los datos de la tabla por unv alor especifico
                                        var detalleMultiSaldosFiltrado2 = detalleMultisaldo.Where(x => x.SucursalID == item.SucursalID).ToList();
                                        //Sumar valores de las columnas del detalle filtrado
                                        var sumaTotalFisico2 = detalleMultiSaldosFiltrado.Sum(x => x.SaldoFisicoUltA);
                                        var sumaTotalSistema2 = detalleMultiSaldosFiltrado.Sum(x => x.SaldoSistemaUltA);
                                        //Pintar en un tr los totales
                                        tabla1 += "<tr>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + "" + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + "Total " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + sumaTotalFisico2.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + sumaTotalSistema2.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                        tabla1 += "</tr>";
                                    }



                                }

                            }
                        }
                        else
                        {
                            if (sucursalAnterior == 0)
                            {
                                tabla2 += "<tr>";
                                tabla2 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\"><strong>" + item.NombreSucursal + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + item.NombreCaja + "</td>";
                                tabla2 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + (item.Cerrada ? "Si" : "No") + "</td>";
                                tabla2 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + (item.Estatus ? "Activa" : "Inactiva") + "</td>";
                                tabla2 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + (item.FechaUltimoArqueo != null ? item.FechaUltimoArqueo.ToString() : "No se ha realizado.") + "</td>";
                                tabla2 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + item.UsuarioRealiza + "</td>";
                                tabla2 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + item.NombreCuenta + "</td>";
                                tabla2 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + item.DescCuenta + "</td>";
                                tabla2 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + item.SaldoFisicoUltA.ToString("C", myCI) + "</td>";
                                tabla2 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + item.SaldoSistemaUltA.ToString("C", myCI) + "</td>";
                                tabla2 += "</tr>";
                                cajaAnterior = item.CajaID;
                                sucursalAnterior = item.SucursalID;
                            }
                            else
                            {
                                if (sucursalAnterior == item.SucursalID)
                                {
                                    tabla2 += "<tr>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\"><strong>-</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + (item.CajaID == cajaAnterior ? "-" : item.NombreCaja) + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + (item.Cerrada ? "Si" : "No") + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + (item.Estatus ? "Activa" : "Inactiva") + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + (item.FechaUltimoArqueo != null ? item.FechaUltimoArqueo.ToString() : "No se ha realizado.") + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + item.UsuarioRealiza + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + item.NombreCuenta + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + item.DescCuenta + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + item.SaldoFisicoUltA.ToString("C", myCI) + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + item.SaldoSistemaUltA.ToString("C", myCI) + "</td>";
                                    tabla2 += "</tr>";
                                    cajaAnterior = item.CajaID;
                                    sucursalAnterior = item.SucursalID;
                                }
                                else
                                {
                                    //Filtrar los datos de la tabla por unv alor especifico
                                    var detalleMultiSaldosFiltrado = detalleMultisaldo.Where(x => x.CajaID == sucursalAnterior).ToList();
                                    //Sumar valores de las columnas del detalle filtrado
                                    var sumaTotalFisico = detalleMultiSaldosFiltrado.Sum(x => x.SaldoFisicoUltA);
                                    var sumaTotalSistema = detalleMultiSaldosFiltrado.Sum(x => x.SaldoSistemaUltA);


                                    //Pintar en un tr los totales
                                    tabla2 += "<tr>";
                                    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + "" + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + "Total " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + sumaTotalFisico.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + sumaTotalSistema.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                    //    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5% !important;\"><strong>" + sumaTotalDiferencia.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                    tabla2 += "</tr>";


                                    //Tr con br para espaciar
                                    tabla2 += "<tr>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "</tr>";


                                    //Tr para nuevo producto
                                    tabla2 += "<tr>";
                                    tabla2 += "<tr>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\"><strong>" + item.NombreSucursal + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + item.NombreCaja + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + (item.Cerrada ? "Si" : "No") + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + (item.Estatus ? "Activa" : "Inactiva") + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + (item.FechaUltimoArqueo != null ? item.FechaUltimoArqueo.ToString() : "No se ha realizado.") + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + item.UsuarioRealiza + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + item.NombreCuenta + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + item.DescCuenta + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + item.SaldoFisicoUltA.ToString("C", myCI) + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 10% !important;\">" + item.SaldoSistemaUltA.ToString("C", myCI) + "</td>";
                                    tabla2 += "</tr>";
                                    tabla2 += "</tr>";

                                    cajaAnterior = item.CajaID;
                                    sucursalAnterior = item.SucursalID;

                                    if (cantRegistros == detalleMultisaldo.Count())
                                    {
                                        //Filtrar los datos de la tabla por unv alor especifico
                                        var detalleMultiSaldosFiltrado2 = detalleMultisaldo.Where(x => x.SucursalID == item.SucursalID).ToList();
                                        //Sumar valores de las columnas del detalle filtrado
                                        var sumaTotalFisico2 = detalleMultiSaldosFiltrado.Sum(x => x.SaldoFisicoUltA);
                                        var sumaTotalSistema2 = detalleMultiSaldosFiltrado.Sum(x => x.SaldoSistemaUltA);
                                        //Pintar en un tr los totales
                                        tabla2 += "<tr>";
                                        tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + "" + "</strong></td>";
                                        tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + " " + "</strong></td>";
                                        tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + " " + "</strong></td>";
                                        tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + " " + "</strong></td>";
                                        tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + " " + "</strong></td>";
                                        tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + " " + "</strong></td>";
                                        tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + " " + "</strong></td>";
                                        tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + "Total " + "</strong></td>";
                                        tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + sumaTotalFisico2.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                        tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 10% !important;\"><strong>" + sumaTotalSistema2.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                        // tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5% !important;\"><strong>" + sumaTotalDiferencia2.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                        tabla2 += "</tr>";
                                    }



                                }

                            }

                        }


                    }
                    if (cantRegistros < 10)
                    {
                        html = html.Replace("@@HEADER_DETALLE", tabla1);
                        html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                        html = html.Replace("@@IMPRIMIO", UsuarioActual.Nombre);
                        html = html.Replace("@@FECHAGENERADO", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                        html = html.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                        html = html.Replace("@@DATOS_DETALLE", DatosConDetalle);
                        await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")), html);
                        listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")));
                    }
                    else
                    {
                        html = html.Replace("@@HEADER_DETALLE", tabla1);
                        html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                        html = html.Replace("@@IMPRIMIO", UsuarioActual.Nombre);
                        html = html.Replace("@@FECHAGENERADO", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                        html = html.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                        html = html.Replace("@@DATOS_DETALLE", DatosConDetalle);
                        await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")), html);
                        listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")));



                        headerTabla2 += "<tr>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 10% !icmportant;\">" + "Nombre Sucursal" + "</th>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Nombre Caja" + "</th>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Cerrada" + "</th>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Estatus" + "</th>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Fecha Últ. Arq." + "</th>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Realiza" + "</th>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Número Cuenta" + "</th>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Desc. Cuenta" + "</th>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Saldo Físico" + "</th>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Saldo Sistema" + "</th>";
                        headerTabla2 += "</tr>";


                        html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Balances", "Detalle.html"));
                        html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                        html = html.Replace("@@DATOS_DETALLE2", tabla2);
                        html = html.Replace("@@HEADER_DETALLE", headerTabla2);

                        await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "2_" + Count.ToString() + ".html")), html);
                        listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "2_" + Count.ToString() + ".html")));

                    }



                }



                var lenght = cantRegistros;
                var lenght2333 = longitudRespuesta;


                Process p = new()
                {
                    StartInfo = new ProcessStartInfo(PDF.RUTA_WKHTMLTOPDF())
                };
                p.StartInfo.Arguments = string.Concat("--footer-center [page]/[topage] -O landscape --encoding utf-8", " ",
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
                // Eliminamos el PDF
                System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));

                // Enviamos el PDF a la UI
                return new FileStreamResult(pdfStream, "application/pdf");
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }


        [HttpPost]
        [Route("imprimir-msaldos-arqueos-bovedas")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> imprimirPDF(PeticionesRest.Balances.MultiSaldos.PrintArqueosBovedas parData)
        {
            try
            {
                var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");

                string dest = Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf"));
                PdfWriter pw = new(dest);

                PdfDocument pdfDocument = new(pw);

                Document doc = new(pdfDocument, PageSize.LETTER);
                int ProductoID = 2;
                doc.SetMargins(40, 50, 40, 50);

                var Producto = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Creditos.Productos>(ProductoID);
                var logo = Producto.Logo;

                var multbov = await ConexionBD.database.QueryAsync<MultiSaldosArqueosBovedas>("WHERE MultiSaldoArqueoBovedaID = @MultiSaldoArqueoBovedaID", parData).FirstOrDefaultAsync();
                var multbovDetalle = await ConexionBD.database.QueryAsync<MultiSaldosArqueosBovedasDetalle>("WHERE MultiSaldoArqueoBovedaID = @0", parData.MultiSaldoArqueoBovedaID).ToArrayAsync();

                var totalSaldoSistema = multbovDetalle.Sum(x => x.SaldoSistemaUltAB);
                var totalSaldoFisico = multbovDetalle.Sum(x => x.SaldoFisicoUltAB);
                var totalDiferencia = multbovDetalle.Sum(x => x.Diferencia);
                int cajaAnterior = 0;
                int? sucursalAnterior = 0;

                ImageData data = ImageDataFactory.Create(logo);
                Image img = new(data);
                img.SetWidth(105);
                img.SetHeight(30);

                Paragraph salto = new(new Text("\n"));

                float[] pointColumnWidths = { 40, 60F, 130F };

                Table table = new(pointColumnWidths);

                Cell c1 = new();
                c1.SetBackgroundColor(ColorConstants.WHITE);
                c1.SetBorder(Border.NO_BORDER);
                c1.Add(img);

                Cell c3 = new();
                c3.Add(new Paragraph("MULTISALDOS ARQUEOS BÓVEDAS"));
                c3.SetBackgroundColor(ColorConstants.WHITE);
                c3.SetBorder(Border.NO_BORDER);
                c3.SetTextAlignment(TextAlignment.CENTER);
                c3.SetFontSize(12);
                c3.SetBold();

                float[] pointColumnWidths2 = { 200, 150F, 150F, 100 };
                Table table2 = new(pointColumnWidths2);

                Text text1 = new Text("FECHA: " + DateTime.Now.ToString())
                    .SetBold();

                Cell c4tx1 = new();
                c4tx1.Add(new Paragraph(text1));
                c4tx1.SetBorder(Border.NO_BORDER);
                c4tx1.SetFontSize(8);

                float[] pointColumnWidths3 = { 100, 100, 70, 70, 100, 100, 100, 100, 100 };
                Table table3 = new(pointColumnWidths3);
                //table3.SetWidth(500);

                Cell c4 = new();
                c4.Add(new Paragraph("Sucursal"));
                c4.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
                c4.SetTextAlignment(TextAlignment.CENTER);
                c4.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c4.SetBorder(Border.NO_BORDER);
                c4.SetFontSize(8);
                c4.SetBold();

                Cell c5 = new();
                c5.Add(new Paragraph("Caja"));
                c5.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
                c5.SetTextAlignment(TextAlignment.CENTER);
                c5.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c5.SetBorder(Border.NO_BORDER);
                c5.SetFontSize(8);
                c5.SetBold();

                Cell c6 = new();
                c6.Add(new Paragraph("Cuenta BancoID"));
                c6.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
                c6.SetTextAlignment(TextAlignment.CENTER);
                c6.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c6.SetBorder(Border.NO_BORDER);
                c6.SetFontSize(8);
                c6.SetBold();

                Cell c7 = new();
                c7.Add(new Paragraph("Número Cuenta"));
                c7.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
                c7.SetTextAlignment(TextAlignment.CENTER);
                c7.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c7.SetBorder(Border.NO_BORDER);
                c7.SetBorder(Border.NO_BORDER);
                c7.SetFontSize(8);
                c7.SetBold();

                Cell c8 = new();
                c8.Add(new Paragraph("Usuario Realizo"));
                c8.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
                c8.SetTextAlignment(TextAlignment.CENTER);
                c8.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c8.SetBorder(Border.NO_BORDER);
                c8.SetFontSize(8);
                c8.SetBold();

                Cell c9 = new();
                c9.Add(new Paragraph("Fecha Realizo"));
                c9.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
                c9.SetTextAlignment(TextAlignment.CENTER);
                c9.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c9.SetBorder(Border.NO_BORDER);
                c9.SetFontSize(8);
                c9.SetBold();

                Cell c10 = new();
                c10.Add(new Paragraph("Saldo Sistema"));
                c10.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
                c10.SetTextAlignment(TextAlignment.CENTER);
                c10.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c10.SetBorder(Border.NO_BORDER);
                c10.SetFontSize(8);
                c10.SetBold();

                Cell c11 = new();
                c11.Add(new Paragraph("Saldo Físico"));
                c11.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
                c11.SetTextAlignment(TextAlignment.CENTER);
                c11.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c11.SetBorder(Border.NO_BORDER);
                c11.SetFontSize(8);
                c11.SetBold();

                Cell c12 = new();
                c12.Add(new Paragraph("Diferencia"));
                c12.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
                c12.SetTextAlignment(TextAlignment.CENTER);
                c12.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c12.SetBorder(Border.NO_BORDER);
                c12.SetFontSize(8);
                c12.SetBold();

                table.AddCell(c1);
                table.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table.AddCell(c3);
                table2.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table2.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table2.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table2.AddCell(c4tx1);
                table3.AddCell(c4);
                table3.AddCell(c5);
                table3.AddCell(c6);
                table3.AddCell(c7);
                table3.AddCell(c8);
                table3.AddCell(c9);
                table3.AddCell(c10);
                table3.AddCell(c11);
                table3.AddCell(c12);

                foreach (var item in multbovDetalle)
                {
                    Cell s = new();
                    s.Add(new Paragraph(item.SucursalID == sucursalAnterior ? "" : item.NombreSucursal.ToString()));
                    s.SetBackgroundColor(ColorConstants.WHITE);
                    s.SetTextAlignment(TextAlignment.CENTER);
                    s.SetBorder(Border.NO_BORDER);
                    s.SetFontSize(7);
                    s.SetBold();

                    Cell c = new();
                    c.Add(new Paragraph(item.CajaID == cajaAnterior ? "" : item.NombreCaja.ToString()));
                    c.SetBackgroundColor(ColorConstants.WHITE);
                    c.SetTextAlignment(TextAlignment.CENTER);
                    c.SetBorder(Border.NO_BORDER);
                    c.SetFontSize(7);
                    c.SetBold();

                    Cell cb = new();
                    cb.Add(new Paragraph(item.CuentaBancoID.ToString()));
                    cb.SetBackgroundColor(ColorConstants.WHITE);
                    cb.SetTextAlignment(TextAlignment.CENTER);
                    cb.SetBorder(Border.NO_BORDER);
                    cb.SetFontSize(7);

                    Cell nc = new();
                    nc.Add(new Paragraph(item.NombreCuenta.ToString()));
                    nc.SetBackgroundColor(ColorConstants.WHITE);
                    nc.SetTextAlignment(TextAlignment.CENTER);
                    nc.SetBorder(Border.NO_BORDER);
                    nc.SetFontSize(7);

                    Cell u = new();
                    u.Add(new Paragraph(item.UsuarioRealiza.ToString()));
                    u.SetBackgroundColor(ColorConstants.WHITE);
                    u.SetTextAlignment(TextAlignment.CENTER);
                    u.SetBorder(Border.NO_BORDER);
                    u.SetFontSize(7);

                    Cell fch = new();
                    fch.Add(new Paragraph(item.FechaUltimoArqueoBoveda.ToString()));
                    fch.SetBackgroundColor(ColorConstants.WHITE);
                    fch.SetTextAlignment(TextAlignment.CENTER);
                    fch.SetBorder(Border.NO_BORDER);
                    fch.SetFontSize(7);

                    Cell ss = new();
                    ss.Add(new Paragraph(item.SaldoSistemaUltAB.ToString("C", new CultureInfo("en-US"))));
                    ss.SetBackgroundColor(ColorConstants.WHITE);
                    ss.SetTextAlignment(TextAlignment.CENTER);
                    ss.SetBorder(Border.NO_BORDER);
                    ss.SetFontSize(7);

                    Cell sf = new();
                    sf.Add(new Paragraph(item.SaldoFisicoUltAB.ToString("C", new CultureInfo("en-US"))));
                    sf.SetBackgroundColor(ColorConstants.WHITE);
                    sf.SetTextAlignment(TextAlignment.CENTER);
                    sf.SetBorder(Border.NO_BORDER);
                    sf.SetFontSize(7);

                    Cell d = new();
                    d.Add(new Paragraph(item.Diferencia?.ToString("C", new CultureInfo("en-US"))));
                    d.SetBackgroundColor(ColorConstants.WHITE);
                    d.SetTextAlignment(TextAlignment.CENTER);
                    d.SetBorder(Border.NO_BORDER);
                    d.SetFontSize(7);

                    sucursalAnterior = item.SucursalID;
                    cajaAnterior = item.CajaID;

                    table3.AddCell(s);
                    table3.AddCell(c);
                    table3.AddCell(cb);
                    table3.AddCell(nc);
                    table3.AddCell(u);
                    table3.AddCell(fch);
                    table3.AddCell(ss);
                    table3.AddCell(sf);
                    table3.AddCell(d);
                }

                Cell espacio = new();
                espacio.Add(new Paragraph(""));
                espacio.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
                espacio.SetTextAlignment(TextAlignment.CENTER);
                espacio.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                espacio.SetBorder(Border.NO_BORDER);
                espacio.SetFontSize(8);
                espacio.SetBold();

                Cell espacio2 = new();
                espacio2.Add(new Paragraph(""));
                espacio2.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
                espacio2.SetTextAlignment(TextAlignment.CENTER);
                espacio2.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                espacio2.SetBorder(Border.NO_BORDER);
                espacio2.SetFontSize(8);
                espacio2.SetBold();

                Cell espacio3 = new();
                espacio3.Add(new Paragraph(""));
                espacio3.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
                espacio3.SetTextAlignment(TextAlignment.CENTER);
                espacio3.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                espacio3.SetBorder(Border.NO_BORDER);
                espacio3.SetFontSize(8);
                espacio3.SetBold();

                Cell espacio4 = new();
                espacio4.Add(new Paragraph(""));
                espacio4.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
                espacio4.SetTextAlignment(TextAlignment.CENTER);
                espacio4.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                espacio4.SetBorder(Border.NO_BORDER);
                espacio4.SetFontSize(8);
                espacio4.SetBold();

                Cell espacio5 = new();
                espacio5.Add(new Paragraph(""));
                espacio5.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
                espacio5.SetTextAlignment(TextAlignment.CENTER);
                espacio5.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                espacio5.SetBorder(Border.NO_BORDER);
                espacio5.SetFontSize(8);
                espacio5.SetBold();

                Cell total = new();
                total.Add(new Paragraph("Totales:"));
                total.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
                total.SetTextAlignment(TextAlignment.CENTER);
                total.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                total.SetBorder(Border.NO_BORDER);
                total.SetFontSize(8);
                total.SetBold();

                Cell tss = new();
                tss.Add(new Paragraph(totalSaldoSistema.ToString("C", new CultureInfo("en-US"))));
                tss.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
                tss.SetTextAlignment(TextAlignment.CENTER);
                tss.SetBorder(Border.NO_BORDER);
                tss.SetFontSize(7);
                tss.SetBold();

                Cell tsf = new();
                tsf.Add(new Paragraph(totalSaldoFisico.ToString("C", new CultureInfo("en-US"))));
                tsf.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
                tsf.SetTextAlignment(TextAlignment.CENTER);
                tsf.SetBorder(Border.NO_BORDER);
                tsf.SetFontSize(7);
                tsf.SetBold();

                Cell dif = new();
                dif.Add(new Paragraph(totalDiferencia?.ToString("C", new CultureInfo("en-US"))));
                dif.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
                dif.SetTextAlignment(TextAlignment.CENTER);
                dif.SetBorder(Border.NO_BORDER);
                dif.SetFontSize(7);
                dif.SetBold();

                table3.AddCell(espacio);
                table3.AddCell(espacio2);
                table3.AddCell(espacio3);
                table3.AddCell(espacio4);
                table3.AddCell(espacio5);
                table3.AddCell(total);
                table3.AddCell(tss);
                table3.AddCell(tsf);
                table3.AddCell(dif);

                doc.Add(table);
                doc.Add(table2);
                doc.Add(salto);
                doc.Add(table3);

                data = ImageDataFactory.Create(logo);

                Image wmImg = new(data);
                float pWith = pdfDocument.GetDefaultPageSize().GetWidth();
                float iWith = wmImg.GetImageWidth();
                float pHeight = pdfDocument.GetDefaultPageSize().GetHeight();
                float iHeight = wmImg.GetImageHeight();

                wmImg.SetFixedPosition((pWith / 2f) - (iWith / 2f), (pHeight / 2f) - (iHeight / 2f));
                wmImg.SetOpacity(0.3f);

                doc.Add(wmImg);
                doc.Close();

                var pdf = await System.IO.File.ReadAllBytesAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));

                var pdfStream = new MemoryStream();
                pdfStream.Write(pdf, 0, pdf.Length);
                pdfStream.Position = 0;

                System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
                System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF_signed.pdf")));

                await ConexionBD.Destroy();

                return File(pdfStream, "application/pdf");

            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("imprimir-msaldos-cajas")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ImprimirMultiSaldosCajas(ConfiaWebApi.PeticionesRest.Balances.MultiSaldos.PrintCaja parData)

        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");
            var listado_archivos = new List<string>();
            var Count = 0;
            var tabla1 = "";
            var tabla2 = "";
            var headerTabla2 = "";
            var DatosConDetalle = "";
            var cantRegistros = 0;
            decimal totalSaldoFisico = 0;
            decimal totalSaldoSistema = 0;
            decimal totalDiferencia = 0;
            int cajaAnterior = 0;
            int longitudRespuesta = 0;

            CultureInfo myCI = new CultureInfo("en-US", false);

            try
            {
                if (parData.MultiSaldoCajaID != 0)
                {
                    var detalleMultisaldo = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Balances.MultisaldosCajaDetalle>("WHERE MultisaldosCajaID = @0", parData.MultiSaldoCajaID).ToArrayAsync();
                    if (detalleMultisaldo == null)
                    {
                        return BadRequest("No se encontró el periodo");
                    }
                    longitudRespuesta = detalleMultisaldo.Count();
                    var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "MultiSaldosCajas", "Caratula.html"));

                    tabla1 += "<tr>";
                    tabla1 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !icmportant;\">" + "Nombre Caja" + "</th>";
                    tabla1 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Cuenta ID" + "</th>";
                    tabla1 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Número Cuenta" + "</th>";
                    tabla1 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Tipo Mov" + "</th>";
                    tabla1 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Fecha Últ. Arq." + "</th>";
                    tabla1 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Saldo Últ. Arq." + "</th>";
                    tabla1 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Saldo Físico" + "</th>";
                    tabla1 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Diferencia" + "</th>";
                    tabla1 += "</tr>";


                    foreach (var item in detalleMultisaldo)
                    {
                        cantRegistros++;
                        if (cantRegistros < 13)
                        {
                            if (cajaAnterior == 0)
                            {
                                tabla1 += "<tr>";
                                tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5 !important;\"><strong>" + item.NombreCaja + "</strong></td>";
                                tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5 !important;\">" + item.CuentaBancoID + "</td>";
                                tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.NumeroCuenta + "</td>";
                                tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.TipoMovDesc + "</td>";
                                tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + (item.FechaUltimoArqueo != null ? item.FechaUltimoArqueo.ToString() : "No se ha realizado.") + "</td>";
                                tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.SaldoArqueoAnterior.ToString("C", myCI) + "</td>";
                                tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.SaldoFisico.ToString("C", myCI) + "</td>";
                                tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.Diferencia.ToString("C", myCI) + "</td>";
                                tabla1 += "</tr>";
                                cajaAnterior = item.CajaID;
                            }
                            else
                            {
                                if (cajaAnterior == item.CajaID)
                                {
                                    tabla1 += "<tr>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\"></td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.CuentaBancoID + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.NumeroCuenta + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.TipoMovDesc + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + (item.FechaUltimoArqueo != null ? item.FechaUltimoArqueo.ToString() : "No se ha realizado.") + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.SaldoArqueoAnterior.ToString("C", myCI) + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.SaldoFisico.ToString("C", myCI) + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.Diferencia.ToString("C", myCI) + "</td>";
                                    tabla1 += "</tr>";
                                    cajaAnterior = item.CajaID;
                                }
                                else
                                {
                                    //Filtrar los datos de la tabla por unv alor especifico
                                    var detalleMultiSaldosFiltrado = detalleMultisaldo.Where(x => x.CajaID == cajaAnterior).ToList();
                                    //Sumar valores de las columnas del detalle filtrado
                                    var sumaTotalSistema = detalleMultiSaldosFiltrado.Sum(x => x.SaldoArqueoAnterior);
                                    var sumaTotalFisico = detalleMultiSaldosFiltrado.Sum(x => x.SaldoFisico);
                                    var sumaTotalDiferencia = detalleMultiSaldosFiltrado.Sum(x => x.Diferencia);


                                    //Pintar en un tr los totales
                                    tabla1 += "<tr>";
                                    tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5% !important;\"><strong>" + "" + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5% !important;\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5% !important;\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5% !important;\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5% !important;\"><strong>" + "Total " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5% !important;\"><strong>" + sumaTotalSistema.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5% !important;\"><strong>" + sumaTotalFisico.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5% !important;\"><strong>" + sumaTotalDiferencia.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                    tabla1 += "</tr>";


                                    //Tr con br para espaciar
                                    tabla1 += "<tr>";
                                    tabla1 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "</tr>";


                                    //Tr para nuevo producto
                                    tabla1 += "<tr>";
                                    tabla1 += "<tr>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\"><strong>" + item.NombreCaja + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.CuentaBancoID + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.NumeroCuenta + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.TipoMovDesc + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + (item.FechaUltimoArqueo != null ? item.FechaUltimoArqueo.ToString() : "No se ha realizado.") + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.SaldoArqueoAnterior.ToString("C", myCI) + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.SaldoFisico.ToString("C", myCI) + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.Diferencia.ToString("C", myCI) + "</td>";
                                    tabla1 += "</tr>";
                                    tabla1 += "</tr>";

                                    cajaAnterior = item.CajaID;

                                    if (cantRegistros == detalleMultisaldo.Count())
                                    {
                                        //Filtrar los datos de la tabla por unv alor especifico
                                        var detalleMultiSaldosFiltrado2 = detalleMultisaldo.Where(x => x.CajaID == item.CajaID).ToList();
                                        //Sumar valores de las columnas del detalle filtrado
                                        var sumaTotalSistema2 = detalleMultiSaldosFiltrado2.Sum(x => x.SaldoArqueoAnterior);
                                        var sumaTotalFisico2 = detalleMultiSaldosFiltrado2.Sum(x => x.SaldoFisico);
                                        var sumaTotalDiferencia2 = detalleMultiSaldosFiltrado2.Sum(x => x.Diferencia);
                                        //Pintar en un tr los totales
                                        tabla1 += "<tr>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5% !important;\"><strong>" + "" + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5% !important;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5% !important;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5% !important;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5% !important;\"><strong>" + "Total " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5% !important;\"><strong>" + sumaTotalSistema2.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5% !important;\"><strong>" + sumaTotalFisico2.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5% !important;\"><strong>" + sumaTotalDiferencia2.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                        tabla1 += "</tr>";
                                    }



                                }

                            }
                        }
                        else
                        {
                            if (cajaAnterior == 0)
                            {
                                tabla2 += "<tr>";
                                tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5 !important;\"><strong>" + item.NombreCaja + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5 !important;\">" + item.CuentaBancoID + "</td>";
                                tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.NumeroCuenta + "</td>";
                                tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.TipoMovDesc + "</td>";
                                tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + (item.FechaUltimoArqueo != null ? item.FechaUltimoArqueo.ToString() : "No se ha realizado.") + "</td>";
                                tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.SaldoArqueoAnterior.ToString("C", myCI) + "</td>";
                                tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.SaldoFisico.ToString("C", myCI) + "</td>";
                                tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.Diferencia.ToString("C", myCI) + "</td>";
                                tabla2 += "</tr>";
                                cajaAnterior = item.CajaID;
                            }
                            else
                            {
                                if (cajaAnterior == item.CajaID)
                                {
                                    tabla2 += "<tr>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\"></td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.CuentaBancoID + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.NumeroCuenta + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.TipoMovDesc + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + (item.FechaUltimoArqueo != null ? item.FechaUltimoArqueo.ToString() : "No se ha realizado.") + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.SaldoArqueoAnterior.ToString("C", myCI) + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.SaldoFisico.ToString("C", myCI) + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.Diferencia.ToString("C", myCI) + "</td>";
                                    tabla2 += "</tr>";
                                    cajaAnterior = item.CajaID;
                                }
                                else
                                {
                                    //Filtrar los datos de la tabla por unv alor especifico
                                    var detalleMultiSaldosFiltrado = detalleMultisaldo.Where(x => x.CajaID == cajaAnterior).ToList();
                                    //Sumar valores de las columnas del detalle filtrado
                                    var sumaTotalSistema = detalleMultiSaldosFiltrado.Sum(x => x.SaldoArqueoAnterior);
                                    var sumaTotalFisico = detalleMultiSaldosFiltrado.Sum(x => x.SaldoFisico);
                                    var sumaTotalDiferencia = detalleMultiSaldosFiltrado.Sum(x => x.Diferencia);


                                    //Pintar en un tr los totales
                                    tabla2 += "<tr>";
                                    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5% !important;\"><strong>" + "" + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5% !important;\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5% !important;\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5% !important;\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5% !important;\"><strong>" + "Total " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5% !important;\"><strong>" + sumaTotalSistema.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5% !important;\"><strong>" + sumaTotalFisico.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5% !important;\"><strong>" + sumaTotalDiferencia.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                    tabla2 += "</tr>";


                                    //Tr con br para espaciar
                                    tabla2 += "<tr>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "</tr>";


                                    //Tr para nuevo producto
                                    tabla2 += "<tr>";
                                    tabla2 += "<tr>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\"><strong>" + item.NombreCaja + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.CuentaBancoID + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.NumeroCuenta + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.TipoMovDesc + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + (item.FechaUltimoArqueo != null ? item.FechaUltimoArqueo.ToString() : "No se ha realizado.") + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.SaldoArqueoAnterior.ToString("C", myCI) + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.SaldoFisico.ToString("C", myCI) + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + item.Diferencia.ToString("C", myCI) + "</td>";
                                    tabla2 += "</tr>";
                                    tabla2 += "</tr>";

                                    cajaAnterior = item.CajaID;

                                    if (cantRegistros == detalleMultisaldo.Count())
                                    {
                                        //Filtrar los datos de la tabla por unv alor especifico
                                        var detalleMultiSaldosFiltrado2 = detalleMultisaldo.Where(x => x.CajaID == item.CajaID).ToList();
                                        //Sumar valores de las columnas del detalle filtrado
                                        var sumaTotalSistema2 = detalleMultiSaldosFiltrado2.Sum(x => x.SaldoArqueoAnterior);
                                        var sumaTotalFisico2 = detalleMultiSaldosFiltrado2.Sum(x => x.SaldoFisico);
                                        var sumaTotalDiferencia2 = detalleMultiSaldosFiltrado2.Sum(x => x.Diferencia);
                                        //Pintar en un tr los totales
                                        tabla2 += "<tr>";
                                        tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5% !important;\"><strong>" + "" + "</strong></td>";
                                        tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5% !important;\"><strong>" + " " + "</strong></td>";
                                        tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5% !important;\"><strong>" + " " + "</strong></td>";
                                        tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5% !important;\"><strong>" + " " + "</strong></td>";
                                        tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5% !important;\"><strong>" + "Total " + "</strong></td>";
                                        tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5% !important;\"><strong>" + sumaTotalSistema2.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                        tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5% !important;\"><strong>" + sumaTotalFisico2.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                        tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 12.5% !important;\"><strong>" + sumaTotalDiferencia2.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                        tabla2 += "</tr>";
                                    }
                                }
                            }
                        }
                    }
                    if (cantRegistros < 12)
                    {
                        html = html.Replace("@@HEADER_DETALLE", tabla1);
                        html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                        html = html.Replace("@@IMPRIMIO", UsuarioActual.Nombre);
                        html = html.Replace("@@FECHAGENERADO", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                        html = html.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                        html = html.Replace("@@DATOS_DETALLE", DatosConDetalle);
                        await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")), html);
                        listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")));
                    }
                    else
                    {
                        html = html.Replace("@@HEADER_DETALLE", tabla1);
                        html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                        html = html.Replace("@@IMPRIMIO", UsuarioActual.Nombre);
                        html = html.Replace("@@FECHAGENERADO", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                        html = html.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                        html = html.Replace("@@DATOS_DETALLE", DatosConDetalle);
                        await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")), html);
                        listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")));

                        headerTabla2 += "<tr>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !icmportant;\">" + "Nombre Caja" + "</th>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Cuenta ID" + "</th>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Número Cuenta" + "</th>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Tipo Mov" + "</th>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Fecha Últ. Arq." + "</th>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Saldo Últ. Arq." + "</th>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Saldo Físico" + "</th>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Diferencia" + "</th>";
                        headerTabla2 += "</tr>";


                        html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Balances", "Detalle.html"));
                        html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                        html = html.Replace("@@DATOS_DETALLE2", tabla2);
                        html = html.Replace("@@HEADER_DETALLE", headerTabla2);

                        await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "2_" + Count.ToString() + ".html")), html);
                        listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "2_" + Count.ToString() + ".html")));

                    }



                }



                var lenght = cantRegistros;
                var lenght2333 = longitudRespuesta;


                Process p = new()
                {
                    StartInfo = new ProcessStartInfo(PDF.RUTA_WKHTMLTOPDF())
                };
                p.StartInfo.Arguments = string.Concat("--footer-center [page]/[topage] -O landscape --encoding utf-8", " ",
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
                // Eliminamos el PDF
                System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));

                // Enviamos el PDF a la UI
                return new FileStreamResult(pdfStream, "application/pdf");
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("getMovimientos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetMovimientos(PeticionesRest.Balances.MultiSaldos.Movimientos parData)
        {

            try
            {
                var obj = new
                {
                    ProductoId = parData.ProductoID,
                    CuentaID = parData.CuentaBancoID
                };

                var Movimientos = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Tesoreria.Multisaldos_MovimientosVW>("SELECT TOP(5) * FROM Tesoreria.Multisaldos_MovimientosVW WHERE (ProductoId=@ProductoId) AND (CuentaID=@CuentaID) order by MovimientoID DESC", obj);



                await ConexionBD.Destroy();
                return Ok(Movimientos);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("getMovimientosTraspasos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetMovimientosTraspasos(PeticionesRest.Balances.MultiSaldos.MovimientosTraspasos parData)
        {
            try
            {
                var obj = new
                {
                    CuentaDestinoID = parData.CuentaBancoID,
                    CuentaOrigenID = parData.CuentaBancoID,
                };
                var MovimientosTraspasos = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Bancos.MovimientosTraspasos_VW>("SELECT TOP(5) * FROM Bancos.MovimientosTraspasos_VW WHERE (CuentaOrigenID=@CuentaOrigenID) OR (CuentaDestinoID=@CuentaDestinoID) order by TraspasoID DESC", obj);

                await ConexionBD.Destroy();
                return Ok(MovimientosTraspasos);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("getMovimientosBalance")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetMovimientosBalance(PeticionesRest.Balances.MultiSaldos.MovimientosBalance parData)
        {

            try
            {
                int ProductoID = 9999;
                int.TryParse(Request.Headers["ProductoID"], out ProductoID);


                var obj = new
                {
                    ProductoId = ProductoID,
                    CuentaID = parData.CuentaBancoID
                };


                var Movimientos = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Tesoreria.Multisaldos_MovimientosVW>("SELECT TOP(5) * FROM Tesoreria.Multisaldos_MovimientosVW WHERE (ProductoId=@ProductoId) AND (CuentaID=@CuentaID) order by MovimientoID DESC", obj);

                await ConexionBD.Destroy();
                return Ok(Movimientos);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("imprimir-msaldos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ImprimirMultiSaldos(ConfiaWebApi.PeticionesRest.Balances.MultiSaldos.Print parData)

        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");
            var listado_archivos = new List<string>();
            var Count = 0;
            var tabla1 = "";
            var tabla2 = "";
            var headerTabla2 = "";
            var DatosConDetalle = "";
            var cantRegistros = 0;
            decimal SaldoAceptado = 0;
            decimal Abonos = 0;
            decimal Cargos = 0;
            decimal SaldoSinAceptar = 0;
            decimal SaldoActual = 0;
            int productoAnterior = 0;

            CultureInfo myCI = new CultureInfo("en-US", false);

            try
            {
                if (parData.MultiSaldoID != 0)
                {
                    var multiSaldos = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Balances.MultiSaldos>("WHERE MultiSaldoID = @0", parData.MultiSaldoID).FirstOrDefaultAsync();
                    if (multiSaldos == null)
                    {
                        return BadRequest("No se encontró el periodo");
                    }
                    var producto = multiSaldos.ProductoID;
                    var detalleMultiSaldos = await ConexionBD.database.QueryAsync<MultiSaldosDetalle>("WHERE MultiSaldoID = @0 ORDER BY ProductoID", multiSaldos.MultiSaldoID).ToArrayAsync();

                    var DatosProducto = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Creditos.Productos>();
                    var res = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Balances.MultiSaldosDetalle>("WHERE MultiSaldoID = @0", parData.MultiSaldoID).ToArrayAsync();
                    var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "MultiSaldos", "Caratula.html"));

                    tabla1 += "<tr>";
                    tabla1 += "<th class=\"text-center fs-6\" style=\"width: 7% !important;\">" + "Periodo ID" + "</th>";
                    tabla1 += "<th class=\"text-center fs-6\" style=\"width: 7% !important;\">" + "Cuenta Banco ID" + "</th>";
                    tabla1 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Banco" + "</th>";
                    tabla1 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Tipo" + "</th>";
                    tabla1 += "<th class=\"text-center fs-6\" style=\"width: 16% !important;\">" + "Número Cuenta" + "</th>";
                    tabla1 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Saldo Aceptado" + "</th>";
                    tabla1 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Abonos" + "</th>";
                    tabla1 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Cargos" + "</th>";
                    tabla1 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Saldo s/Aceptar" + "</th>";
                    tabla1 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Saldo Actual" + "</th>";
                    tabla1 += "</tr>";



                    foreach (var item in detalleMultiSaldos)
                    {
                        cantRegistros++;
                        if (cantRegistros < 13)
                        {
                            if (productoAnterior == 0)
                            {
                                tabla1 += "<tr>";
                                tabla1 += "<td class=\"text-center fs-6\">" + item.PeriodoID.ToString() + "</td>";
                                tabla1 += "<td class=\"text-center fs-6\">" + item.CuentaBancoID.ToString() + "</td>";
                                tabla1 += "<td class=\"text-center fs-6\">" + item.NombreBanco.ToString() + "</td>";
                                tabla1 += "<td class=\"text-center fs-6\">" + (item.EsBoveda ? "Bóveda" : "Caja") + "</td>";
                                tabla1 += "<td class=\"text-center fs-6\">" + item.NumeroCuenta.ToString() + "</td>";
                                tabla1 += "<td class=\"text-center fs-6\">" + item.SaldoAceptado.ToString("C", new CultureInfo("en-US")) + "</td>";
                                tabla1 += "<td class=\"text-center fs-6\">" + item.Abonos.ToString("C", new CultureInfo("en-US")) + "</td>";
                                tabla1 += "<td class=\"text-center fs-6\">" + item.Cargos.ToString("C", new CultureInfo("en-US")) + "</td>";
                                tabla1 += "<td class=\"text-center fs-6\">" + item.SaldoSinAceptar.ToString("C", new CultureInfo("en-US")) + "</td>";
                                tabla1 += "<td class=\"text-center fs-6\">" + item.SaldoActual.ToString("C", new CultureInfo("en-US")) + "</td>";
                                tabla1 += "</tr>";
                                productoAnterior = item.ProductoID;
                            }
                            else
                            {
                                if (productoAnterior == item.ProductoID)
                                {
                                    tabla1 += "<tr>";
                                    tabla1 += "<td class=\"text-center fs-6\">" + item.PeriodoID.ToString() + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\">" + item.CuentaBancoID.ToString() + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\">" + item.NombreBanco.ToString() + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\">" + (item.EsBoveda ? "Bóveda" : "Caja") + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\">" + item.NumeroCuenta.ToString() + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\">" + item.SaldoAceptado.ToString("C", new CultureInfo("en-US")) + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\">" + item.Abonos.ToString("C", new CultureInfo("en-US")) + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\">" + item.Cargos.ToString("C", new CultureInfo("en-US")) + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\">" + item.SaldoSinAceptar.ToString("C", new CultureInfo("en-US")) + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\">" + item.SaldoActual.ToString("C", new CultureInfo("en-US")) + "</td>";
                                    tabla1 += "</tr>";
                                    productoAnterior = item.ProductoID;
                                }
                                else
                                {
                                    //Filtrar los datos de la tabla por unv alor especifico
                                    var detalleMultiSaldosFiltrado = detalleMultiSaldos.Where(x => x.ProductoID == productoAnterior).ToList();
                                    //Sumar valores de las columnas del detalle filtrado
                                    var sumaAbonos = detalleMultiSaldosFiltrado.Sum(x => x.Abonos);
                                    var sumaCargos = detalleMultiSaldosFiltrado.Sum(x => x.Cargos);
                                    var sumaSaldoAceptado = detalleMultiSaldosFiltrado.Sum(x => x.SaldoAceptado);
                                    var sumaSaldoSinAceptar = detalleMultiSaldosFiltrado.Sum(x => x.SaldoSinAceptar);
                                    var sumaSaldoActual = detalleMultiSaldosFiltrado.Sum(x => x.SaldoActual);
                                    var NombreProducto = DatosProducto.Where(x => x.ProductoID == productoAnterior).FirstOrDefault();
                                    var StringProducto = NombreProducto.Producto.ToString();

                                    //Pintar en un tr los totales
                                    tabla1 += "<tr>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 20% !important;\">><strong>" + "" + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 20% !important;\">><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 20% !important;\">><strong>" + "Total " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 20% !important;\">><strong>" + "del " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 20% !important;\">><strong>" + "producto " + StringProducto + " :</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 20% !important;\">><strong>" + sumaSaldoAceptado.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 20% !important;\">><strong>" + sumaAbonos.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 20% !important;\">><strong>" + sumaCargos.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 20% !important;\">><strong>" + sumaSaldoSinAceptar.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 20% !important;\">><strong>" + sumaSaldoActual.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                    tabla1 += "</tr>";


                                    //Tr con br para espaciar
                                    tabla1 += "<tr>";
                                    tabla1 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla1 += "</tr>";


                                    //Tr para nuevo producto
                                    tabla1 += "<tr>";
                                    tabla1 += "<td class=\"text-center fs-6\">" + item.PeriodoID.ToString() + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\">" + item.CuentaBancoID.ToString() + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\">" + item.NombreBanco.ToString() + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\">" + (item.EsBoveda ? "Bóveda" : "Caja") + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\">" + item.NumeroCuenta.ToString() + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\">" + item.SaldoAceptado.ToString("C", new CultureInfo("en-US")) + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\">" + item.Abonos.ToString("C", new CultureInfo("en-US")) + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\">" + item.Cargos.ToString("C", new CultureInfo("en-US")) + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\">" + item.SaldoSinAceptar.ToString("C", new CultureInfo("en-US")) + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\">" + item.SaldoActual.ToString("C", new CultureInfo("en-US")) + "</td>";
                                    tabla1 += "</tr>";

                                    productoAnterior = item.ProductoID;

                                    if (cantRegistros == detalleMultiSaldos.Count())
                                    {
                                        //Filtrar los datos de la tabla por unv alor especifico
                                        var detalleMultiSaldosFiltrado2 = detalleMultiSaldos.Where(x => x.ProductoID == item.ProductoID).ToList();
                                        //Sumar valores de las columnas del detalle filtrado
                                        var sumaAbonos2 = detalleMultiSaldosFiltrado2.Sum(x => x.Abonos);
                                        var sumaCargos2 = detalleMultiSaldosFiltrado2.Sum(x => x.Cargos);
                                        var sumaSaldoAceptado2 = detalleMultiSaldosFiltrado2.Sum(x => x.SaldoAceptado);
                                        var sumaSaldoSinAceptar2 = detalleMultiSaldosFiltrado2.Sum(x => x.SaldoSinAceptar);
                                        var sumaSaldoActual2 = detalleMultiSaldosFiltrado2.Sum(x => x.SaldoActual);
                                        var NombreProducto2 = DatosProducto.Where(x => x.ProductoID == item.ProductoID).FirstOrDefault();
                                        var StringProducto2 = NombreProducto2.Producto.ToString();

                                        //Pintar en un tr los totales
                                        tabla1 += "<tr>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + "Total" + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + "" + StringProducto2 + " :</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + sumaSaldoAceptado2.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + sumaAbonos2.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + sumaCargos2.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + sumaSaldoSinAceptar2.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + sumaSaldoActual2.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                        tabla1 += "</tr>";

                                        var sumaAbonos3 = detalleMultiSaldos.Sum(x => x.Abonos);
                                        var sumaCargos3 = detalleMultiSaldos.Sum(x => x.Cargos);
                                        var sumaSaldoAceptado3 = detalleMultiSaldos.Sum(x => x.SaldoAceptado);
                                        var sumaSaldoSinAceptar3 = detalleMultiSaldos.Sum(x => x.SaldoSinAceptar);
                                        var sumaSaldoActual3 = detalleMultiSaldos.Sum(x => x.SaldoActual);

                                        //Pintar en un tr los totales
                                        tabla1 += "<tr>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + "Total" + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + "Empresa :" + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + sumaSaldoAceptado3.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + sumaAbonos3.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + sumaCargos3.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + sumaSaldoSinAceptar3.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + sumaSaldoActual3.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                        tabla1 += "</tr>";
                                    }



                                }
                            }
                            var lenght = detalleMultiSaldos.Count();

                            if (cantRegistros == lenght)
                            {
                                //Filtrar los datos de la tabla por unv alor especifico
                                var detalleMultiSaldosFiltrado2 = detalleMultiSaldos.Where(x => x.ProductoID == item.ProductoID).ToList();
                                //Sumar valores de las columnas del detalle filtrado
                                var sumaAbonos2 = detalleMultiSaldosFiltrado2.Sum(x => x.Abonos);
                                var sumaCargos2 = detalleMultiSaldosFiltrado2.Sum(x => x.Cargos);
                                var sumaSaldoAceptado2 = detalleMultiSaldosFiltrado2.Sum(x => x.SaldoAceptado);
                                var sumaSaldoSinAceptar2 = detalleMultiSaldosFiltrado2.Sum(x => x.SaldoSinAceptar);
                                var sumaSaldoActual2 = detalleMultiSaldosFiltrado2.Sum(x => x.SaldoActual);
                                var NombreProducto2 = DatosProducto.Where(x => x.ProductoID == item.ProductoID).FirstOrDefault();
                                var StringProducto2 = NombreProducto2.Producto.ToString();

                                //Pintar en un tr los totales
                                tabla2 += "<tr>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + " " + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + " " + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + " " + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + "Total" + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + "" + StringProducto2 + " :</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + sumaSaldoAceptado2.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + sumaAbonos2.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + sumaCargos2.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + sumaSaldoSinAceptar2.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + sumaSaldoActual2.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                tabla2 += "</tr>";

                                //Suma total de las columnas
                                var sumaAbonos3 = detalleMultiSaldos.Sum(x => x.Abonos);
                                var sumaCargos3 = detalleMultiSaldos.Sum(x => x.Cargos);
                                var sumaSaldoAceptado3 = detalleMultiSaldos.Sum(x => x.SaldoAceptado);
                                var sumaSaldoSinAceptar3 = detalleMultiSaldos.Sum(x => x.SaldoSinAceptar);
                                var sumaSaldoActual3 = detalleMultiSaldos.Sum(x => x.SaldoActual);

                                //Pintar en un tr los totales
                                tabla2 += "<tr>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + " " + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + " " + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + " " + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + "Total" + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + "Empresa :" + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + sumaSaldoAceptado3.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + sumaAbonos3.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + sumaCargos3.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + sumaSaldoSinAceptar3.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + sumaSaldoActual3.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                tabla2 += "</tr>";




                            }
                        }
                        else
                        {
                            if (productoAnterior == 0)
                            {
                                tabla2 += "<tr>";
                                tabla2 += "<td class=\"text-center fs-6\">" + item.PeriodoID.ToString() + "</td>";
                                tabla2 += "<td class=\"text-center fs-6\">" + item.CuentaBancoID.ToString() + "</td>";
                                tabla2 += "<td class=\"text-center fs-6\">" + item.NombreBanco.ToString() + "</td>";
                                tabla2 += "<td class=\"text-center fs-6\">" + (item.EsBoveda ? "Bóveda" : "Caja") + "</td>";
                                tabla2 += "<td class=\"text-center fs-6\">" + item.NumeroCuenta.ToString() + "</td>";
                                tabla2 += "<td class=\"text-center fs-6\">" + item.SaldoAceptado.ToString("C", new CultureInfo("en-US")) + "</td>";
                                tabla2 += "<td class=\"text-center fs-6\">" + item.Abonos.ToString("C", new CultureInfo("en-US")) + "</td>";
                                tabla2 += "<td class=\"text-center fs-6\">" + item.Cargos.ToString("C", new CultureInfo("en-US")) + "</td>";
                                tabla2 += "<td class=\"text-center fs-6\">" + item.SaldoSinAceptar.ToString("C", new CultureInfo("en-US")) + "</td>";
                                tabla2 += "<td class=\"text-center fs-6\">" + item.SaldoActual.ToString("C", new CultureInfo("en-US")) + "</td>";
                                tabla2 += "</tr>";
                                productoAnterior = item.ProductoID;
                            }
                            else
                            {
                                if (productoAnterior == item.ProductoID)
                                {
                                    tabla2 += "<tr>";
                                    tabla2 += "<td class=\"text-center fs-6\">" + item.PeriodoID.ToString() + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\">" + item.CuentaBancoID.ToString() + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\">" + item.NombreBanco.ToString() + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\">" + (item.EsBoveda ? "Bóveda" : "Caja") + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\">" + item.NumeroCuenta.ToString() + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\">" + item.SaldoAceptado.ToString("C", new CultureInfo("en-US")) + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\">" + item.Abonos.ToString("C", new CultureInfo("en-US")) + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\">" + item.Cargos.ToString("C", new CultureInfo("en-US")) + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\">" + item.SaldoSinAceptar.ToString("C", new CultureInfo("en-US")) + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\">" + item.SaldoActual.ToString("C", new CultureInfo("en-US")) + "</td>";
                                    tabla2 += "</tr>";
                                    productoAnterior = item.ProductoID;
                                }
                                else
                                {
                                    //Filtrar los datos de la tabla por unv alor especifico
                                    var detalleMultiSaldosFiltrado = detalleMultiSaldos.Where(x => x.ProductoID == productoAnterior).ToList();
                                    //Sumar valores de las columnas del detalle filtrado
                                    var sumaAbonos = detalleMultiSaldosFiltrado.Sum(x => x.Abonos);
                                    var sumaCargos = detalleMultiSaldosFiltrado.Sum(x => x.Cargos);
                                    var sumaSaldoAceptado = detalleMultiSaldosFiltrado.Sum(x => x.SaldoAceptado);
                                    var sumaSaldoSinAceptar = detalleMultiSaldosFiltrado.Sum(x => x.SaldoSinAceptar);
                                    var sumaSaldoActual = detalleMultiSaldosFiltrado.Sum(x => x.SaldoActual);
                                    var NombreProducto = DatosProducto.Where(x => x.ProductoID == productoAnterior).FirstOrDefault();
                                    var StringProducto = NombreProducto.Producto.ToString();
                                    //Pintar en un tr los totales
                                    tabla2 += "<tr>";
                                    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + "" + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + "Total" + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + "" + StringProducto + " :</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + sumaSaldoAceptado.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + sumaAbonos.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + sumaCargos.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + sumaSaldoSinAceptar.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + sumaSaldoActual.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                    tabla2 += "</tr>";

                                    //Tr con br para espaciar
                                    tabla2 += "<tr>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "</tr>";

                                    //Tr para nuevo producto
                                    tabla2 += "<tr>";
                                    tabla2 += "<td class=\"text-center fs-6\">" + item.PeriodoID.ToString() + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\">" + item.CuentaBancoID.ToString() + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\">" + item.NombreBanco.ToString() + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\">" + (item.EsBoveda ? "Bóveda" : "Caja") + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\">" + item.NumeroCuenta.ToString() + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\">" + item.SaldoAceptado.ToString("C", new CultureInfo("en-US")) + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\">" + item.Abonos.ToString("C", new CultureInfo("en-US")) + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\">" + item.Cargos.ToString("C", new CultureInfo("en-US")) + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\">" + item.SaldoSinAceptar.ToString("C", new CultureInfo("en-US")) + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\">" + item.SaldoActual.ToString("C", new CultureInfo("en-US")) + "</td>";
                                    tabla2 += "</tr>";

                                    productoAnterior = item.ProductoID;

                                    //Lenght of detallemultisaldos




                                }
                            }

                            var lenght = detalleMultiSaldos.Count();

                            if (cantRegistros == lenght)
                            {
                                //Filtrar los datos de la tabla por unv alor especifico
                                var detalleMultiSaldosFiltrado2 = detalleMultiSaldos.Where(x => x.ProductoID == item.ProductoID).ToList();
                                //Sumar valores de las columnas del detalle filtrado
                                var sumaAbonos2 = detalleMultiSaldosFiltrado2.Sum(x => x.Abonos);
                                var sumaCargos2 = detalleMultiSaldosFiltrado2.Sum(x => x.Cargos);
                                var sumaSaldoAceptado2 = detalleMultiSaldosFiltrado2.Sum(x => x.SaldoAceptado);
                                var sumaSaldoSinAceptar2 = detalleMultiSaldosFiltrado2.Sum(x => x.SaldoSinAceptar);
                                var sumaSaldoActual2 = detalleMultiSaldosFiltrado2.Sum(x => x.SaldoActual);
                                var NombreProducto2 = DatosProducto.Where(x => x.ProductoID == item.ProductoID).FirstOrDefault();
                                var StringProducto2 = NombreProducto2.Producto.ToString();

                                //Pintar en un tr los totales
                                tabla2 += "<tr>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + " " + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + " " + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + " " + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + "Total" + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + "" + StringProducto2 + " :</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + sumaSaldoAceptado2.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + sumaAbonos2.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + sumaCargos2.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + sumaSaldoSinAceptar2.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + sumaSaldoActual2.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                tabla2 += "</tr>";

                                //Suma total de las columnas
                                var sumaAbonos3 = detalleMultiSaldos.Sum(x => x.Abonos);
                                var sumaCargos3 = detalleMultiSaldos.Sum(x => x.Cargos);
                                var sumaSaldoAceptado3 = detalleMultiSaldos.Sum(x => x.SaldoAceptado);
                                var sumaSaldoSinAceptar3 = detalleMultiSaldos.Sum(x => x.SaldoSinAceptar);
                                var sumaSaldoActual3 = detalleMultiSaldos.Sum(x => x.SaldoActual);

                                //Pintar en un tr los totales
                                tabla2 += "<tr>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + " " + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + " " + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + " " + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + "Total" + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + "Empresa :" + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + sumaSaldoAceptado3.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + sumaAbonos3.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + sumaCargos3.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + sumaSaldoSinAceptar3.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                tabla2 += "<td class=\"text-center fs-6\"style=\"border-top: 1px solid black !important; background: #DFDFDF;\"><strong>" + sumaSaldoActual3.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                                tabla2 += "</tr>";

                            }

                        }

                    }
                    var length = detalleMultiSaldos.Count();
                    if (cantRegistros < 12)
                    {
                        html = html.Replace("@@HEADER_DETALLE", tabla1);
                        html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                        html = html.Replace("@@IMPRIMIO", UsuarioActual.Nombre);
                        html = html.Replace("@@FECHAGENERADO", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                        html = html.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                        html = html.Replace("@@DATOS_DETALLE", DatosConDetalle);
                        await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")), html);
                        listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")));
                    }
                    else
                    {
                        html = html.Replace("@@HEADER_DETALLE", tabla1);
                        html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                        html = html.Replace("@@IMPRIMIO", UsuarioActual.Nombre);
                        html = html.Replace("@@FECHAGENERADO", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                        html = html.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                        html = html.Replace("@@DATOS_DETALLE", DatosConDetalle);
                        await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")), html);
                        listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")));

                        headerTabla2 += "<tr>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 7% !important;\">" + "Periodo ID" + "</th>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 7% !important;\">" + "Cuenta Banco ID" + "</th>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Banco" + "</th>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Tipo" + "</th>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 16% !important;\">" + "Número Cuenta" + "</th>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Saldo Aceptado" + "</th>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Abonos" + "</th>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Cargos" + "</th>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Saldo s/Aceptar" + "</th>";
                        headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "Saldo Actual" + "</th>";
                        headerTabla2 += "</tr>";


                        html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Balances", "Detalle.html"));
                        html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                        html = html.Replace("@@DATOS_DETALLE2", tabla2);
                        html = html.Replace("@@HEADER_DETALLE", headerTabla2);

                        await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "2_" + Count.ToString() + ".html")), html);
                        listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "2_" + Count.ToString() + ".html")));

                    }

                    Process p = new()
                    {
                        StartInfo = new ProcessStartInfo(PDF.RUTA_WKHTMLTOPDF())
                    };
                    p.StartInfo.Arguments = string.Concat("--footer-center [page]/[topage] -O landscape --encoding utf-8", " ",
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
                    // Eliminamos el PDF
                    System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));

                    // Enviamos el PDF a la UI
                    return new FileStreamResult(pdfStream, "application/pdf");

                }
                else
                {
                    return BadRequest("No se encontró el ID del multisaldo");
                }

            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }

        }

        [HttpGet]
        [Route("generar-msaldos-cajas")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerMultiSaldosCajas()

        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            try
            {
                var res = await ConexionBD.database.QueryAsync<MultiSaldosCajasW>("EXEC Balances.pa_MultisaldosCaja_SEL @0", UsuarioActual.UsuarioID).ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }

        }
        [HttpGet]
        [Route("obtener-balance/{PeriodoID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerBalanzaID(int PeriodoID)

        {
            try
            {
                var balance = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Balances.Balance2>("WHERE PeriodoID = @0", PeriodoID).FirstOrDefaultAsync();
                if (balance != null) { return Ok(balance); }
                else
                {
                    await ConexionBD.Destroy();
                    return BadRequest("No se encontró el ID del balance");
                }
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }


        [HttpGet]
        [Route("generar-msaldos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerMultiSaldos()

        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            try
            {
                var res = await ConexionBD.database.QueryAsync<MultiSaldosArqueosBovedasW>("EXEC Balances.pa_Multisaldos_SEL @0, @1", UsuarioActual.UsuarioID, 0).ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(res);


            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }

        }

        [HttpGet]
        [Route("generar-msaldos-arqueos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerMultiSaldosArqueos()

        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            try
            {
                var res = await ConexionBD.database.QueryAsync<MultiSaldosArqueosSP>("EXEC Balances.pa_MultiSaldosArqueos_SEL @0", UsuarioActual.UsuarioID).ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("Multisaldos_General")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Multisaldos_General(ConfiaWebApi.PeticionesRest.Balances.MultiSaldos.ObtenerBalance parData)
        {
            try
            {
                var res = await ConexionBD.database.QueryAsync<dynamic>("EXEC Tesoreria.pa_ObtenerMultisaldos @BalanceID",parData).ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("Multisaldos_GeneralPDF")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Multisaldos_GeneralPDF(ConfiaWebApi.PeticionesRest.Balances.MultiSaldos.ObtenerBalance parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario = @0", UserName).FirstOrDefaultAsync();
                // var res = await ConexionBD.database.QueryAsync<MultiSaldosGeneral>("EXEC sp_ObtenerBalanceCuentas").ToArrayAsync();
                var res = await ConexionBD.database.QueryAsync<dynamic>("EXEC Tesoreria.pa_ObtenerMultisaldos @BalanceID",parData).ToArrayAsync();

                var listado_archivos = new List<string>();
                var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");
                NumberFormatInfo nfi = new CultureInfo(CultureInfo.CurrentCulture.ToString(), false).NumberFormat;
                nfi.PercentDecimalDigits = 0;

                var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Balances", "MultisaldosGeneral.html"));

                html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                html = html.Replace("@@IMPRIMIO", UsuarioActual.Nombre.ToString());
                html = html.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                html = html.Replace("@@JQUERY", "<script type=\"text/javascript\" src=\"https://code.jquery.com/jquery.min.js\"></script>");
                var TablaSaldos = "";

                foreach (var saldo in res)
                {
                    TablaSaldos += "<tr style=\"font-size:13px;\">";
                    TablaSaldos += "<td class=\"text-center\">" + saldo.NombreBalance.ToString() + "</td>";
                    TablaSaldos += "<td class=\"text-center\">" + saldo.CUENTAID.ToString() + "</td>";
                    TablaSaldos += "<td class=\"text-center\">" + saldo.CUENTA.ToString() + "</td>";
                    TablaSaldos += "<td class=\"text-end\">" + saldo.CARGOS.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                    TablaSaldos += "<td class=\"text-end\">" + saldo.ABONOS.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                    TablaSaldos += "<td class=\"text-end\">" + saldo.SALDOENMOVS.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                    TablaSaldos += "<td class=\"text-end\">" + saldo.SALDOACTUAL.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                    TablaSaldos += "</tr>";
                }
                html = html.Replace("@@TABLASALDOS", TablaSaldos);

                await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1.html")), html);
                listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1.html")));

                if (res != null)
                {
                    // Ejecutamos el proceso de wkhtmltopdf
                    Process p = new()
                    {
                        StartInfo = new ProcessStartInfo(PDF.RUTA_WKHTMLTOPDF())
                    };
                    p.StartInfo.Arguments = string.Concat("--footer-center [page]/[topage] -O landscape --encoding utf-8", " ",
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

                    // Eliminamos el PDF
                    System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));

                    await ConexionBD.Destroy();

                    // Enviamos el PDF a la UI
                    return new FileStreamResult(pdfStream, "application/pdf");
                }

                await ConexionBD.Destroy();
                return Ok("No se encontro información");
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }


        [HttpGet]
        [Route("generar-msaldos-arqueos-bovedas2")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerMultiSaldosArqueosBovedas()

        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            try
            {
                var res = await ConexionBD.database.QueryAsync<MultiSaldosArqueosSP>("EXEC Balances.pa_MultisaldosArqueosBovedas2_SEL @0", UsuarioActual.UsuarioID).ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("generar-msaldos-bovedas")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerMultiSaldosBovedas(ConfiaWebApi.PeticionesRest.SOMA.Balances.MultiSaldosGet parData)

        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            try
            {

                if (parData.TipoMultiSaldos == 1)
                {
                    var res = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.MultiSaldosBovedasDetalle>("EXEC Tesoreria.pa_MultiSaldosBovedas_SEL 1,0").ToArrayAsync();

                    var obj = new
                    {
                        Existe = true,
                        Data = res
                    };
                    await ConexionBD.Destroy();
                    return Ok(res);
                }
                else
                {
                    //Convert fecha to string 'yyyy-MM-dd'
                    var fecha = parData.FechaInicio.ToString("yyyy-MM-dd");

                    var res = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.MultiSaldosBovedas>("WHERE cast(FechaGenerado as Date) = @0 order by FechaGenerado DESC  ", fecha).FirstOrDefaultAsync();
                    if (res != null)
                    {
                        var res2 = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.MultiSaldosBovedasDetalle>("WHERE MultiSaldoBovedaID = @0", res.MultiSaldoBovedaID).ToArrayAsync();
                        await ConexionBD.Destroy();

                        return Ok(res2);
                    }
                    else
                    {

                        var obj = new
                        {
                            Existe = false,
                            Data = res
                        };
                        var array = new ArrayList();
                        await ConexionBD.Destroy();
                        return Ok(array);
                    }
                }

            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }

        }


        [HttpPost]
        [Route("generar-balance2")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GenerarBalance2(ConfiaWebApi.PeticionesRest.Balances.GenerarBalances0.Add parData)

        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            try
            {
                if (parData.accion == 0)
                {
                    var res = await ConexionBD.database.QueryAsync<ObtenerBalanceID>("EXEC Balances.pa_GenerarBalance_SEL_v2 @0, 0, 0, 0, 0", parData.periodoId).ToArrayAsync();
                    await ConexionBD.Destroy();
                    return Ok(res);
                }
                if (parData.accion == 1)
                {
                    var res = await ConexionBD.database.QueryAsync<BalancesPrincipalAccion1>("EXEC Balances.pa_GenerarBalance_SEL_v2 0, 0, 0, @0, 1", parData.BalanceIDTemp).ToArrayAsync();
                    await ConexionBD.Destroy();
                    return Ok(res);
                }
                //irfghnjofkgnsdkols
                if (parData.accion == 2)
                {
                    //Hola cambio desde mi compu
                    var res = await ConexionBD.database.QueryAsync<BalancesPrincipalAccion2>("EXEC Balances.pa_GenerarBalance_SEL_v2 0, 0, 0, @0, 2", parData.BalanceIDTemp).ToArrayAsync();
                    await ConexionBD.Destroy();
                    return Ok(res);
                }
                if (parData.accion == 3)
                {
                    var res = await ConexionBD.database.QueryAsync<BalancesPrincipalAccion3>("EXEC Balances.pa_GenerarBalance_SEL_v2 0, @0, 0, @1, 3", parData.producto, parData.BalanceIDTemp).ToArrayAsync();
                    await ConexionBD.Destroy();
                    return Ok(res);
                }
                if (parData.accion == 4)
                {
                    // var res = await ConexionBD.database.QueryAsync<BalancesPrincipalAccion4>("EXEC Balances.pa_GenerarBalance_SEL_v2 @0, 0, @1, @2, 4", parData.periodoId, parData.BalanceIDTemp,UsuarioActual.UsuarioID).ToArrayAsync();

                    var res = await ConexionBD.database.QueryAsync<BalancesPrincipalAccion4>("EXEC Balances.pa_GenerarBalance_SEL_v2 @0, 0, 0, @1, 4", parData.periodoId, parData.BalanceIDTemp).ToArrayAsync();
                    if (res[0].Mensaje == "Sin movimientos")
                    {
                        await ConexionBD.Destroy();
                        return Ok(res);
                    }
                    else if (res[0].Mensaje == "Ocurrió un error y no se pudo concluir el cierre.")
                    {
                        await ConexionBD.Destroy();
                        return Ok(res);
                    }
                    else
                    {
                        ConexionBD.database.BeginTransaction();
                        var periodo = await ConexionBD.database.QueryAsync<Periodo2>("WHERE PeriodoID=@0", parData.periodoId).FirstOrDefaultAsync();
                        periodo.Estatus = "C";
                        periodo.ReAbierto = 0;
                        periodo.PersonaIDCierre = UsuarioActual.PersonaID;
                        periodo.UsuarioIDCierre = UsuarioActual.UsuarioID;
                        periodo.FechaCierre = DateTime.Now;
                        await ConexionBD.database.UpdateAsync(periodo);

                        var bitacoraCambios = new BitacoraCambios()
                        {
                            Accion = "Cierre de periodo ID: " + periodo.PeriodoID + " " + periodo.Ejercicio,
                            Modulo = "Tesoreria",
                            PersonaID = (long)UsuarioActual.PersonaID,
                            FechaAfectacion = DateTime.Now
                        };
                        await ConexionBD.database.InsertAsync(bitacoraCambios);

                        int consecutivoPeriodo = 0;
                        var numeroPeriodoAnterior = await ConexionBD.database.QueryAsync<Periodo2>().OrderByDescending(t => t.PeriodoID).FirstOrDefault();
                        if (numeroPeriodoAnterior == null)
                        {
                            consecutivoPeriodo = 1;
                        }
                        else
                        {
                            consecutivoPeriodo = numeroPeriodoAnterior.NumeroPeriodo;
                        }
                        if (res[0].MensajeID.Equals("2"))
                        {
                            //Aquí es donde se inserta el nuevo periodo
                            //Está tronando porque se le está mandando el usuarioID en vez de PersonaID
                            var nperiodo = new Periodo2()
                            {
                                NumeroPeriodo = consecutivoPeriodo + 1,
                                FechaApertura = DateTime.Now,
                                FechaInicio = DateTime.Now,
                                DiasGracia = 0,
                                Estatus = "A",
                                Ejercicio = DateTime.Now.ToString("yyyy"),
                                UsuarioIDApertura = UsuarioActual.UsuarioID,
                                AgrupacionID = periodo.AgrupacionID,
                                PersonaIDApertura = (long)UsuarioActual.PersonaID,
                                ProductoID = (int)periodo.ProductoID,
                                ReAbierto = 0
                            };
                            await ConexionBD.database.InsertAsync(nperiodo);

                            if (res[0].Diferencia == true)
                            {
                                int Periodo = 0;
                                int Producto = 0;
                                int BalanceIDTemp = 0;
                                BalanceIDTemp = res[0].BalanceID;
                                Producto = res[0].ProductoID;
                                Periodo = res[0].PeriodoID;
                                var res2 = await ConexionBD.database.QueryAsync<MoverMovimientos>("EXEC Balances.pa_MovimientosFueraBalance_UPD @0, @1, @2, @3", Producto, BalanceIDTemp, Periodo, nperiodo.PeriodoID).ToArrayAsync();

                                //Lo mismo aquí
                                var bitacoraCambios2 = new BitacoraCambios()
                                {
                                    Accion = "Apertura de periodo ID: " + nperiodo.PeriodoID + " " + nperiodo.Ejercicio,
                                    Modulo = "Tesoreria",
                                    PersonaID = (long)UsuarioActual.PersonaID,
                                    FechaAfectacion = DateTime.Now
                                };
                                await ConexionBD.database.InsertAsync(bitacoraCambios2);

                                if (res2[0].MensajeID == 1)
                                {
                                    ConexionBD.database.CompleteTransaction();
                                }
                                else
                                {
                                    ConexionBD.database.AbortTransaction();
                                }
                            }


                        }
                        ConexionBD.database.CompleteTransaction();
                    }
                    await ConexionBD.Destroy();
                    return Ok(res);

                }
                await ConexionBD.Destroy();
                return Ok();
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }

        }


        // Obtenemos los balances
        [HttpPost]
        [Route("generar-balance")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Obtener(ConfiaWebApi.PeticionesRest.Balances.GenerarBalances0.Add parData)

        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            try
            {
                if (parData.accion == 0)
                {
                    var res = await ConexionBD.database.QueryAsync<Balances4>("EXEC Balances.pa_GenerarBalance_SEL @0, 0, 0, 0, 0, 0", parData.periodoId).ToArrayAsync();
                    await ConexionBD.Destroy();
                    return Ok(res);
                }
                if (parData.accion == 1)
                {
                    var res = await ConexionBD.database.QueryAsync<Balances>("EXEC Balances.pa_GenerarBalance_SEL @0, 0, 0, 0, @1, 1", parData.periodoId, parData.BalanceIDTemp).ToArrayAsync();
                    await ConexionBD.Destroy();
                    return Ok(res);
                }
                if (parData.accion == 2)
                {
                    var res = await ConexionBD.database.QueryAsync<Balances1>("EXEC Balances.pa_GenerarBalance_SEL @periodoId, @ctaBanco, 0, 0, @BalanceIDTemp, @accion", parData).ToArrayAsync();
                    await ConexionBD.Destroy();
                    return Ok(res);
                }
                if (parData.accion == 3)
                {
                    var res = await ConexionBD.database.QueryAsync<Balances2>("EXEC Balances.pa_GenerarBalance_SEL @periodoId, @ctaBanco, @producto, 0, @BalanceIDTemp, @accion", parData).ToArrayAsync();
                    await ConexionBD.Destroy();
                    return Ok(res);
                }
                if (parData.accion == 4)
                {
                    var res = await ConexionBD.database.QueryAsync<Balances3>("EXEC Balances.pa_GenerarBalance_SEL @periodoId, @ctaBanco, @producto, @tipoMovimiento, @BalanceIDTemp, @accion", parData).ToArrayAsync();
                    await ConexionBD.Destroy();
                    return Ok(res);
                }
                if (parData.accion == 5)
                {
                    var res = await ConexionBD.database.QueryAsync<Balances4>("EXEC Balances.pa_GenerarBalance_SEL @periodoId, @ctaBanco, @producto, @tipoMovimiento, @BalanceIDTemp, @accion", parData).ToArrayAsync();
                    if (res[0].Mensaje == "Sin movimientos")
                    {
                        await ConexionBD.Destroy();
                        return Ok(res);
                    }
                    else if (res[0].Mensaje == "Ocurrió un error y no se pudo concluir el cierre.")
                    {
                        await ConexionBD.Destroy();
                        return Ok(res);
                    }
                    else
                    {
                        ConexionBD.database.BeginTransaction();
                        var periodo = await ConexionBD.database.QueryAsync<Periodo2>("WHERE PeriodoID=@0", parData.periodoId).FirstOrDefaultAsync();
                        periodo.Estatus = "C";
                        periodo.ReAbierto = 0;
                        periodo.PersonaIDCierre = UsuarioActual.UsuarioID;
                        periodo.UsuarioIDCierre = UsuarioActual.UsuarioID;
                        periodo.FechaCierre = DateTime.Now;
                        await ConexionBD.database.UpdateAsync(periodo);

                        var bitacoraCambios = new BitacoraCambios()
                        {
                            Accion = "Cierre de periodo ID: " + periodo.PeriodoID + " " + periodo.Ejercicio,
                            Modulo = "Tesoreria",
                            PersonaID = (long)UsuarioActual.UsuarioID,
                            FechaAfectacion = DateTime.Now
                        };
                        await ConexionBD.database.InsertAsync(bitacoraCambios);

                        int consecutivoPeriodo = 0;
                        var numeroPeriodoAnterior = await ConexionBD.database.QueryAsync<Periodo2>().OrderByDescending(t => t.PeriodoID).FirstOrDefault();
                        if (numeroPeriodoAnterior == null)
                        {
                            consecutivoPeriodo = 1;
                        }
                        else
                        {
                            consecutivoPeriodo = numeroPeriodoAnterior.NumeroPeriodo;
                        }
                        if (!res[0].MensajeID.Equals("2"))
                        {
                            var nperiodo = new Periodo2()
                            {
                                NumeroPeriodo = consecutivoPeriodo + 1,
                                FechaApertura = DateTime.Now,
                                FechaInicio = DateTime.Now,
                                DiasGracia = 0,
                                Estatus = "A",
                                Ejercicio = DateTime.Now.ToString("yyyy"),
                                UsuarioIDApertura = UsuarioActual.UsuarioID,
                                AgrupacionID = periodo.AgrupacionID,
                                PersonaIDApertura = (long)UsuarioActual.UsuarioID,
                                ProductoID = (int)periodo.ProductoID,
                                ReAbierto = 0
                            };
                            await ConexionBD.database.InsertAsync(nperiodo);

                            if (res[0].Diferencia == true)
                            {
                                int Periodo = 0;
                                int Producto = 0;
                                int BalanceIDTemp = 0;
                                BalanceIDTemp = res[0].BalanceID;
                                Producto = res[0].ProductoID;
                                Periodo = res[0].PeriodoID;
                                var res2 = await ConexionBD.database.QueryAsync<MoverMovimientos>("EXEC Balances.pa_MovimientosFueraBalance_UPD @0, @1, @2, @3", Producto, BalanceIDTemp, Periodo, nperiodo.PeriodoID).ToArrayAsync();

                                var bitacoraCambios2 = new BitacoraCambios()
                                {
                                    Accion = "Apertura de periodo ID: " + nperiodo.PeriodoID + " " + nperiodo.Ejercicio,
                                    Modulo = "Tesoreria",
                                    PersonaID = (long)UsuarioActual.UsuarioID,
                                    FechaAfectacion = DateTime.Now
                                };
                                await ConexionBD.database.InsertAsync(bitacoraCambios2);

                                if (res2[0].MensajeID == 1)
                                {
                                    ConexionBD.database.CompleteTransaction();
                                }
                                else
                                {
                                    ConexionBD.database.AbortTransaction();
                                }
                            }


                        }
                        ConexionBD.database.CompleteTransaction();
                    }
                    await ConexionBD.Destroy();
                    return Ok(res);


                }
                await ConexionBD.Destroy();
                return Ok();

            }
            catch (Exception err)
            {
                await ConexionBD.Destroy();
                return BadRequest(err.Message);
            }

        }
        public static String DatoAnterior(string DatoAnterior, string DatoActual)
        {
            var res = "";
            if (DatoAnterior.Equals(DatoActual.ToString()))
            {
                res = "<td class=\"text-center fs-6\"><div style=\"height: 200px;width: 1px;display: inline;border-left: solid black;\">&nbsp;</div></td>";
            }
            else
            {
                res = "<td class=\"text-center fs-6\">" + DatoActual.ToString() + "</td>";
            }
            return res;
        }

        public static String CuentaSeparador(string DatoAnterior, string DatoActual)
        {
            var res = "";
            if (DatoAnterior.Equals(DatoActual.ToString()))
            {
                res = "<td class=\"text-center fs-6\"><div style=\"height: 200px;width: 1px;display: inline;border-left: solid black;\">&nbsp;</div></td>";
            }
            else
            {
                res = "<td class=\"text-center fs-6\">" + DatoActual.ToString() + "</td>";
            }
            return res;
        }

        [HttpPost]
        [Route("cerrarBalanceFinal")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> cerradaBalance(ConfiaWebApi.PeticionesRest.Balances.GenerarBalances1.GenerarPDF2 parData)
        {
            try
            {
                var resultado = await ConexionBD.database.QueryAsync<dynamic>("EXEC Balances.CompararMovimientosConBalanceTemp @0", parData.BTemporalID).ToListAsync();
                // Tomar el primer resultado
                var mensaje = resultado.FirstOrDefault();

                if (mensaje != null)
                {
                    return Ok(new
                    {
                        Mensaje = mensaje.MENSAJE,
                        Codigo = mensaje.CODIGO
                    });
                }
                else
                {
                    return Ok(new
                    {
                        Mensaje = "No se obtuvo respuesta.",
                        Codigo = -1
                    });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("validarCajasAbiertas")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> validarCajas(ConfiaWebApi.PeticionesRest.Balances.GenerarBalances1.GenerarPDF2 parData)

        {
            try
            {
                var resultado = await ConexionBD.database.QueryAsync<dynamic>("EXEC Balances.ValidarCajasCerradasBalance @0", parData.BalanceSeleccionado).ToListAsync();

                // Tomar el primer resultado
                var mensaje = resultado.FirstOrDefault();

                if (mensaje != null)
                {
                    return Ok(new
                    {
                        Mensaje = mensaje.MENSAJE,
                        Codigo = mensaje.CODIGO
                    });
                }
                else
                {
                    return Ok(new
                    {
                        Mensaje = "No se obtuvo respuesta.",
                        Codigo = -1
                    });
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("guardarBalanceTemporal")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> balanceTemporal(ConfiaWebApi.PeticionesRest.Balances.GenerarBalances1.GenerarPDF2 parData)

        {
            try
            {
                var balanceTemporalID = "";
                var resultado = await ConexionBD.database.QueryAsync<dynamic>("EXEC Balances.BalanceTemporal @0", parData.BalanceSeleccionado).ToListAsync();

                var respuestaBalanceTemp = resultado.FirstOrDefault();
                if (respuestaBalanceTemp != null)
                {
                    balanceTemporalID = respuestaBalanceTemp.BalanceTempID.ToString();
                }
                else
                {
                    return Ok(new
                    {
                        Mensaje = "No se obtuvo respuesta.",
                        Codigo = -1
                    });
                }
                return Ok(
                    new
                    {
                        Codigo = 1,
                        BalanceTemporalID = balanceTemporalID
                    }
                );
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("imprimir-balance3")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Imprimir2(ConfiaWebApi.PeticionesRest.Balances.GenerarBalances1.GenerarPDF2 parData)

        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var PersonaActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                //  var getProducto = await ConexionBD.database.QueryAsync<BalancesPrincipalAccion2>("EXEC Balances.pa_GenerarBalance_SEL_v2 0, 0, 0, @0, 5", parData.BalanceIDTemp).ToArrayAsync();
                string Producto = "PS7 - Vales Q";
                var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");
                var listado_archivos = new List<string>();
                var Count = 0;

                //Parte izquierda
                int CuentaBanco = 0;
                var Cuenta = "";
                var cuentaAnterior = "";
                int MovimientoAnterior = 0;
                var TipoMovimientoAnterior = "";
                int Subtotal = 0;
                var TDeposito = "DEPOSITOS";
                decimal TotalDepositoI = 0;
                var TDesembolso = "DESEMBOLSO";
                decimal TotalDVA = 0;
                var TDepositoTraspaso = "DEPOSITO POR TRASPASO";
                decimal TotalDepositoTraspaso = 0;
                var TRetiros = "RETIROS";
                decimal TotalRetirosI = 0;
                var TRetirosTraspaso = "RETIROS POR TRASPASO";
                decimal TotalRTraspaso = 0;
                var TCobranza = "COBRANZA";
                decimal TotalCobranza = 0;
                decimal TotalCobranzaClienteFinal = 0;
                decimal TotalCobranzaTotal = 0;
                var TDNI = "Depósitos No Identificados";
                decimal TDNICuentas = 0;
                decimal TotalCajas = 0;
                decimal TotalBancos = 0;
                decimal SaldoAnterior = 0;

                //Parte derecha
                var Cancelaciones = "";
                decimal TotalCancelaciones = 0;
                var Depositos = "";
                decimal TotalDepositos = 0;
                var DNI = "";
                decimal TotalDNI = 0;
                var Retiros = "";
                decimal TotalRetiros = 0;
                var DesembolsoVales = "";
                decimal TotalDV = 0;
                var NuevasVentas = "";
                decimal TotalNV = 0;
                var Tiendita = "";
                decimal TotalTiendita = 0;
                var RetirosXT = "";
                decimal TotalRxT = 0;
                var USV = "";
                decimal TotalUSV = 0;
                var Total = "";
                decimal TTotal = 0;
                var SaldoCuentas = "";
                decimal TSaldoCuentas = 0;
                var SaldoBancos = "";
                decimal TotalSBancos = 0;
                var ResultadoBalance = "";
                decimal TRBalance = 0;
                var Diferencia = "";
                decimal TDif = 0;
                var Clasificacion = "";
                var CVencida = "";
                decimal TVencida = 0;
                var Normal = "";
                decimal TNormal = 0;
                var Normal2 = "";
                decimal TNormal2 = 0;
                var Resultado = "";
                DateTime BalanceAnterior = DateTime.Now;
                decimal CantidadBalanceAnterior = 0;
                decimal TotalBAnterior = 0;
                var CuentasBancos = "";
                decimal TCuentasBancos = 0;

                //Cancelaciones
                var CreditosCancelados = "";

                //Pólizas de Contratistas
                var PolizasContratistas = "";
                var nombreAnterior = "";

                //Variables PDF Desglose de Gastos
                var DesgloseDeGastos = "";
                var TipoEmpresaAnterior = "";
                var RubroAnterior = "";
                var TotalRegistrosRubro = 0;
                var TotalRegistrosEmpresa = 0;
                decimal TotalCantidadRubro = 0;
                decimal TotalCantidadEmpresa = 0;
                decimal TotalTodasEmpresas = 0;

                //Variables PDF Pólizas de Contratistas.
                string nombreCompleto = "";
                string DescripcionRubroAnterior = "";

                //VariablesResultados por Rubro
                var FResultadoBalance = "";


                int Periodo = 0;
                DateTime FechaApertura = DateTime.Now;
                DateTime? FechaCierre = DateTime.Now;
                int Accion = 0; //Indicamos si el periodo está abierto o cerrado para los traspasos

                //Obtener saldo anterior
                var saldoAnterior = await ConexionBD.database.QueryAsync<Balance2>("SELECT * FROM Balances.BalGetUltimoSaldoBalance(@0) bgusb", parData.BalanceSeleccionado).SingleOrDefaultAsync();
                if (saldoAnterior == null)
                {
                    CantidadBalanceAnterior = 0;
                }
                else
                {
                    CantidadBalanceAnterior = saldoAnterior.SaldoTotalBalance;
                }
                var balanceTemporalID = 0;
                var NuevoNombreBalance = "";
                var NombreResponsable = "";

                //Obtener nombre del balance
                var nombreBalance = await ConexionBD.database.QueryAsync<dynamic>("SELECT bp.NombreBalance, p.NombreCompleto FROM Balances.BalancesProductos bp JOIN General.Personas p ON bp.ResponsableBalance = p.PersonaID  where BalanceID = @0", parData.BalanceSeleccionado).SingleOrDefaultAsync();
                if (nombreBalance == null)
                {
                    return BadRequest("No se encontró el ID del balance");
                }
                else
                {
                    NuevoNombreBalance = nombreBalance.NombreBalance;
                    NombreResponsable = nombreBalance.Nombrecompleto;
                }

                CultureInfo myCI = new CultureInfo("en-US", false);
                parData.Accion = 1;
                //Filtro 1
                if (parData.Accion == 1)
                {

                    var res = await ConexionBD.database.QueryAsync<BancoBalance>("EXEC Balances.pa_BancosBalance @0", parData.BalanceSeleccionado).ToArrayAsync();

                    //Inicio PDF Principal
                    if (res.Length > 0)
                    {
                        var CuentaBancoID_Iterando = 0;
                        for (var i = 0; i <= res.Length; i++)
                        {
                            if (i < res.Length)
                            {
                                Count += 1;
                                CuentaBancoID_Iterando = res[i].CuentaBancoID;

                                if (res[i].DescripcionCuenta != cuentaAnterior)
                                {
                                    Cuenta += "</div>";
                                    if (res[i].DescripcionCuenta != cuentaAnterior && cuentaAnterior != "")
                                    {
                                        Cuenta += "<div style=\"border-bottom: 2px solid black; width: 650px; margin-left: 25px;\"></div>";

                                        Cuenta += "<div style=\"position: relative; width: 650px; margin-left: 25px;\">";
                                        // Primer elemento
                                        Cuenta += "<div style=\"display: inline-block; vertical-align: top;\">";
                                        Cuenta += "<p style=\"font-size: 15px; font-weight: bold;\">TOTAL " + cuentaAnterior + ":</p>";
                                        Cuenta += "</div>";

                                        //Suma total de la cuenta
                                        Cuenta += "<div style=\"position: absolute; top: 0; left: 530px;\">";
                                        Cuenta += "<p style=\"font-size: 15px; font-weight: bold;\">" + TotalCajas.ToString("C") + "</p>";
                                        Cuenta += "</div>";
                                        Cuenta += "</div>";
                                        TotalBancos += TotalCajas;
                                        TotalCajas = 0;
                                    }
                                    Cuenta += "<div style=\"\">";
                                    Cuenta += "<p class=\"\" style=\"font-size: 18px; font-weight: bold; margin-right: 50px;\">" + res[i].DescripcionCuenta + " - " + res[i].CuentaBancoID + "</p>";
                                    Cuenta += "<div style=\"border-bottom: 2px solid black; width: 650px; margin-left: 25px;\"></div>";
                                    Cuenta += "<p class=\"\" style=\"font-size: 15px; margin-bottom: 0; margin-right: 530px;\">" + "SALDO ANT" + "</p>";

                                    Cuenta += "<div style=\"display: inline-block; vertical-align: top; position: relative; left: -225px;\">";
                                    Cuenta += "<div style=\"display: inline-block; vertical-align: top;\">";
                                    Cuenta += "<p class=\"d-inline\" style=\"font-size: 15px; margin-bottom: 0;\">";
                                    Cuenta += "SALDO ANTERIOR:" + "</p>";
                                    Cuenta += "</div>";

                                    // if(Periodo == 59 && res[i].NombreCaja == "CAJA 01 CONSTITUCION" || res[i].NombreCaja == "CAJA 01 CUAHUTEMOC" || res[i].NombreCaja == "CAJA 01 CAMARGO" || res[i].NombreCaja == "CAJA 01 FRESNILLO" || res[i].NombreCaja == "CAJA 01 CULIACAN" || res[i].NombreCaja == "CAJA 01 RIO GRANDE") 
                                    // {
                                    //     decimal Saldo = res[i].SaldoActualReal * 0;
                                    //     Cuenta += "<div style=\"display: inline-block; vertical-align: top; position: absolute; left: 525px;\">";
                                    //     Cuenta += "<p class=\"d-inline\" style=\"font-size: 15px; margin-bottom: 0; white-space: nowrap;\">";
                                    //     Cuenta += Saldo.ToString("C") + "</p>";
                                    //     Cuenta +=  "<div style=\"border-bottom: 1px solid black; width: 100px; margin-left: 5px;\"></div>";
                                    //     Cuenta += "</div>";
                                    //     Cuenta += "</div>";
                                    //     TotalCajas += Saldo;

                                    //     Cuenta += "<div style=\" vertical-align: top; position: relative; left: 75px;\">";
                                    //     Cuenta += "<div style=\"display: inline-block; vertical-align: top;\">";
                                    //     Cuenta += "<p class=\"d-inline\" style=\"font-size: 15px; margin-bottom: 0; font-weight: bold;\">";
                                    //     Cuenta += "SUBTOTAL SALDO ANT:" + "</p>";
                                    //     Cuenta += "</div>";

                                    //     Cuenta += "<div style=\"display: inline-block; vertical-align: top; position: absolute; left: 504px;\">";
                                    //     Cuenta += "<p class=\"d-inline\" style=\"font-size: 15px; margin-bottom: 0; white-space: nowrap; font-weight: bold;\">";
                                    //     Cuenta +=  Saldo.ToString("C") + "</p>";
                                    //     Cuenta += "</div>";
                                    //     Cuenta += "</div>";         
                                    // }
                                    // else
                                    // {
                                    Cuenta += "<div style=\"display: inline-block; vertical-align: top; position: absolute; left: 512px;\">";
                                    Cuenta += "<p class=\"d-inline\" style=\"font-size: 13px; margin-bottom: 0; white-space: nowrap;\">";
                                    Cuenta += res[i].SaldoInicial.ToString("C") + "</p>";
                                    Cuenta += "<div style=\"border-bottom: 1px solid black; width: 100px; margin-left: 5px;\"></div>";
                                    Cuenta += "</div>";
                                    Cuenta += "</div>";
                                    TotalCajas += res[i].SaldoInicial;

                                    Cuenta += "<div style=\" vertical-align: top; position: relative; left: 75px;\">";
                                    Cuenta += "<div style=\"display: inline-block; vertical-align: top;\">";
                                    Cuenta += "<p class=\"d-inline\" style=\"font-size: 15px; margin-bottom: 0; font-weight: bold;\">";
                                    Cuenta += "SUBTOTAL SALDO ANT:" + "</p>";
                                    Cuenta += "</div>";

                                    Cuenta += "<div style=\"display: inline-block; vertical-align: top; position: absolute; left: 512px;\">";
                                    Cuenta += "<p class=\"d-inline\" style=\"font-size: 13px; margin-bottom: 0; white-space: nowrap; font-weight: bold;\">";
                                    Cuenta += res[i].SaldoInicial.ToString("C") + "</p>";
                                    Cuenta += "</div>";
                                    Cuenta += "</div>";
                                    // }


                                    //Asignamos la cuenta de banco de la iteración.
                                    CuentaBanco = res[i].CuentaBancoID;
                                    Console.WriteLine("CuentaBanco: " + CuentaBanco);

                                    //Cobranza
                                    var resCobranza = await ConexionBD.database.QueryAsync<CobranzaCuentas>("EXEC Balances.pa_Cobranza @0", CuentaBancoID_Iterando).ToArrayAsync();
                                    var TCobranza2 = "";

                                    for (var a = 0; a <= resCobranza.Length; a++)
                                    {
                                        if (a < resCobranza.Length)
                                        {
                                            if (resCobranza[a].CuentaID == CuentaBanco)
                                            {
                                                if (TCobranza != "")
                                                {
                                                    Cuenta += "<p class=\"d-inline\" style=\"font-size: 13px; margin-bottom: 0; margin-left: -565px; font-weight: bold;\">" + TCobranza + "</p>";
                                                    Cuenta += "<br>";
                                                    TCobranza = "";
                                                }
                                                TCobranza2 = "";

                                                //Suma solo cuando la columna Cliente Final sea 0
                                                if (resCobranza[a].ClienteFinal == false)
                                                {
                                                    TotalCobranza += resCobranza[a].Importe;

                                                }
                                                else
                                                {
                                                    TotalCobranzaClienteFinal += resCobranza[a].Importe;

                                                }
                                                CuentaBanco = resCobranza[a].CuentaID;
                                            }
                                        }
                                        else
                                        {
                                            if (TCobranza == "" && TCobranza2 == "")
                                            {
                                                // Cuenta +=  "<br>";
                                                Cuenta += "<div style=\"display: inline-block; vertical-align: top; position: relative; left: -240px;\">";
                                                Cuenta += "<div style=\"display: inline-block; vertical-align: top;\">";
                                                Cuenta += "<p class=\"d-inline\" style=\"font-size: 13px; margin-bottom: 0;\">";
                                                Cuenta += "COBRANZA VALES" + "</p>";
                                                Cuenta += "</div>";

                                                Cuenta += "<div style=\"display: inline-block; vertical-align: top; position: absolute; left: 545px;\">";
                                                Cuenta += "<p class=\"d-inline\" style=\"font-size: 13px; margin-bottom: 0; white-space: nowrap;\">";
                                                Cuenta += TotalCobranza.ToString("C") + "</p>";
                                                Cuenta += "</div>";
                                                Cuenta += "</div>";

                                                Cuenta += "<div style=\"border-bottom: 1px solid black; width: 100px; margin-left: 580px;\"></div>";
                                                Cuenta += "<div style=\"position: relative; width: 650px; margin-left: 25px;\">";

                                                // Primer elemento
                                                Cuenta += "<div style=\"display: inline-block; vertical-align: top;\">";
                                                Cuenta += "<p style=\"font-size: 13px; font-weight: bold;\">SUBTOTAL COBRANZA VALES" + ":</p>";
                                                Cuenta += "</div>";

                                                //Suma total de la cuenta
                                                Cuenta += "<div style=\"position: absolute; top: 0; left: 560px;\">";
                                                Cuenta += $"<p style=\"font-size: 13px; font-weight: bold;\">{TotalCobranza.ToString("C")}</p>";
                                                Cuenta += "</div>";
                                                Cuenta += "</div>";
                                                TotalCajas += TotalCobranza;

                                                Cuenta += "<div style=\"display: inline-block; vertical-align: top; position: relative; left: -240px;\">";
                                                Cuenta += "<div style=\"display: inline-block; vertical-align: top;\">";
                                                Cuenta += "<p class=\"d-inline\" style=\"font-size: 13px; margin-bottom: 0;\">";
                                                Cuenta += "COBRANZA CLIENTE FINAL" + "</p>";
                                                Cuenta += "</div>";

                                                Cuenta += "<div style=\"display: inline-block; vertical-align: top; position: absolute; left: 545px;\">";
                                                Cuenta += "<p class=\"d-inline\" style=\"font-size: 13px; margin-bottom: 0; white-space: nowrap;\">";
                                                Cuenta += TotalCobranzaClienteFinal.ToString("C") + "</p>";
                                                Cuenta += "</div>";
                                                Cuenta += "</div>";
                                                TotalCajas += TotalCobranzaClienteFinal;


                                                Cuenta += "<div style=\"border-bottom: 1px solid black; width: 100px; margin-left: 580px;\"></div>";
                                                Cuenta += "<div style=\"position: relative; width: 650px; margin-left: 25px;\">";

                                                // Primer elemento
                                                Cuenta += "<div style=\"display: inline-block; vertical-align: top;\">";
                                                Cuenta += "<p style=\"font-size: 13px; font-weight: bold;\">SUBTOTAL COBRANZA CLIENTE FINAL" + ":</p>";
                                                Cuenta += "</div>";

                                                //Suma total de la cuenta
                                                Cuenta += "<div style=\"position: absolute; top: 0; left: 560px;\">";
                                                Cuenta += $"<p style=\"font-size: 13px; font-weight: bold;\">{TotalCobranzaClienteFinal.ToString("C")}</p>";
                                                Cuenta += "</div>";
                                                Cuenta += "</div>";


                                                Cuenta += "<div style=\"border-bottom: 1px solid black; width: 100px; margin-left: 580px;\"></div>";
                                                Cuenta += "<div style=\"position: relative; width: 650px; margin-left: 25px;\">";
                                                // Primer elemento
                                                Cuenta += "<div style=\"display: inline-block; vertical-align: top;\">";
                                                Cuenta += "<p style=\"font-size: 13px; font-weight: bold;\">TOTAL COBRANZA RECIBIDA" + ":</p>";
                                                Cuenta += "</div>";

                                                TotalCobranzaTotal = TotalCobranza + TotalCobranzaClienteFinal;

                                                //Suma total de la cuenta
                                                Cuenta += "<div style=\"position: absolute; top: 0; left: 560px;\">";
                                                Cuenta += $"<p style=\"font-size: 13px; font-weight: bold;\">{TotalCobranzaTotal.ToString("C")}</p>";
                                                Cuenta += "</div>";
                                                Cuenta += "</div>";
                                                TotalCobranzaClienteFinal = 0;

                                            }

                                            if (TCobranza2 == "A")
                                            {
                                                Cuenta += "<div style=\"border-bottom: 1px solid black; width: 100px; margin-left: 580px;\"></div>";
                                                Cuenta += "<div style=\"position: relative; width: 650px; margin-left: 25px;\">";

                                                // Primer elemento
                                                Cuenta += "<div style=\"display: inline-block; vertical-align: top;\">";
                                                Cuenta += "<p style=\"font-size: 13px; font-weight: bold;\">SUBTOTAL COBRANZA" + ":</p>";
                                                Cuenta += "</div>";

                                                //Suma total de la cuenta
                                                Cuenta += "<div style=\"position: absolute; top: 0; left: 560px;\">";
                                                Cuenta += $"<p style=\"font-size: 13px; font-weight: bold;\">{TotalCobranza.ToString("C")}</p>";
                                                Cuenta += "</div>";
                                                Cuenta += "</div>";
                                                TotalCajas += TotalCobranza;
                                            }
                                            TotalCobranza = 0;
                                            TCobranza = "COBRANZA";
                                        }
                                    }

                                    //DepositosDNI
                                    var resDNICuentas = await ConexionBD.database.QueryAsync<DepositosDNI>("EXEC Balances.pa_DepositosDNI @0", CuentaBancoID_Iterando).ToArrayAsync();
                                    for (var b = 0; b <= resDNICuentas.Length; b++)
                                    {
                                        if (b < resDNICuentas.Length)
                                        {
                                            if (resDNICuentas[b].CuentaID == CuentaBanco)
                                            {
                                                //Condición para que solo ponga un título
                                                if (TDNI != "")
                                                {
                                                    // Cuenta +=    "<br>";
                                                    Cuenta += "<p class=\"d-inline\" style=\"font-size: 13px; margin-bottom: 0; margin-left: -435px; font-weight: bold;\">" + TDNI + "</p>";
                                                    Cuenta += "<br>";
                                                    TDNI = "";
                                                }
                                                //Suma
                                                TDNICuentas += resDNICuentas[b].Importe;
                                                CuentaBanco = resDNICuentas[b].CuentaID;
                                            }
                                        }
                                        else
                                        {
                                            //Bandera para que ponga el SUBTOTAL
                                            if (TDNI == "")
                                            {
                                                Cuenta += "<div style=\"display: inline-block; vertical-align: top; position: relative; left: -275px;\">";
                                                Cuenta += "<div style=\"display: inline-block; vertical-align: top;\">";
                                                Cuenta += "<p class=\"d-inline\" style=\"font-size: 13px; margin-bottom: 0;\">";
                                                Cuenta += "DNIs" + "</p>";
                                                Cuenta += "</div>";

                                                Cuenta += "<div style=\"display: inline-block; vertical-align: top; position: absolute; left: 535px;\">";
                                                Cuenta += "<p class=\"d-inline\" style=\"font-size: 13px; margin-bottom: 0; white-space: nowrap;\">";
                                                Cuenta += TDNICuentas.ToString("C") + "</p>";
                                                Cuenta += "</div>";
                                                Cuenta += "</div>";

                                                Cuenta += "<div style=\"border-bottom: 1px solid black; width: 100px; margin-left: 580px;\"></div>";
                                                Cuenta += "<div style=\"position: relative; width: 650px; margin-left: 25px;\">";

                                                // Primer elemento
                                                Cuenta += "<div style=\"display: inline-block; vertical-align: top;\">";
                                                Cuenta += "<p style=\"font-size: 13px; font-weight: bold;\">SUBTOTAL DNI" + ":</p>";
                                                Cuenta += "</div>";

                                                //Suma total de la cuenta
                                                Cuenta += "<div style=\"position: absolute; top: 0; left: 560px;\">";
                                                Cuenta += $"<p style=\"font-size: 13px; font-weight: bold;\">{TDNICuentas.ToString("C")}</p>";
                                                Cuenta += "</div>";
                                                Cuenta += "</div>";
                                                TotalCajas += TDNICuentas;

                                                TDNICuentas = 0;
                                            }
                                            TDNI = "DNI";
                                        }
                                    }

                                    //Depositos
                                    var resDepositosCuentas = await ConexionBD.database.QueryAsync<DepositosCuentas>("EXEC Balances.pa_DepositosCuentas @0", CuentaBancoID_Iterando).ToArrayAsync();

                                    for (var j = 0; j <= resDepositosCuentas.Length; j++)
                                    {
                                        if (j < resDepositosCuentas.Length)
                                        {
                                            //resDepositosCuentas[j].CuentaID == CuentaBanco
                                            Console.WriteLine("CuentaBanco: " + resDepositosCuentas[j].CuentaID);
                                            if (resDepositosCuentas[j].CuentaID == CuentaBanco)
                                            {
                                                //Bandera para colocar el título.
                                                if (TDeposito != "")
                                                {
                                                    Cuenta += "<p class=\"d-inline\" style=\"font-size: 13px; margin-bottom: 0; margin-left: -575px; font-weight: bold;\">" + TDeposito + "</p>";
                                                    TDeposito = "";
                                                }
                                                Cuenta += "<br>";
                                                Cuenta += "<div style=\"display: inline-block; vertical-align: top; position: relative; left: -275px;\">";
                                                Cuenta += "<div style=\"display: inline-block; vertical-align: top;\">";
                                                Cuenta += "<p class=\"d-inline\" style=\"font-size: 13px; margin-bottom: 0;\">";
                                                Cuenta += resDepositosCuentas[j].FechaAfectacion.ToString("dd/MM/yyyy") + "</p>";
                                                Cuenta += "</div>";

                                                string RestoDepositoDescripcion = resDepositosCuentas[j].Observaciones;
                                                string descSimplificada = RestoDepositoDescripcion.Length > 64 ? RestoDepositoDescripcion.Substring(0, 64) : RestoDepositoDescripcion;
                                                Cuenta += "<div style=\"display: inline-block; vertical-align: top; position: absolute; left: 75px;\">";
                                                Cuenta += "<p class=\"d-inline\" style=\"font-size: 13px; margin-bottom: 0; white-space: nowrap;\">";
                                                Cuenta += descSimplificada + "</p>";
                                                Cuenta += "</div>";

                                                //  Cuenta += "<div style=\"display: inline-block; vertical-align: top; position: absolute; left: 75px;\">";
                                                // Cuenta += "<p class=\"d-inline\" style=\"font-size: 13px; margin-bottom: 0; white-space: nowrap;\">";
                                                // Cuenta += resDepositosCuentas[j].NumeroCuenta + "</p>";
                                                // Cuenta += "</div>";

                                                Cuenta += "<div style=\"display: inline-block; vertical-align: top; position: absolute; left: 555px;\">";
                                                Cuenta += "<p class=\"d-inline\" style=\"font-size: 13px; margin-bottom: 0; white-space: nowrap;\">";
                                                Cuenta += resDepositosCuentas[j].Importe.ToString("C") + "</p>";
                                                Cuenta += "</div>";
                                                Cuenta += "</div>";


                                                TotalDepositoI += resDepositosCuentas[j].Importe;
                                                CuentaBanco = resDepositosCuentas[j].CuentaID;
                                            }
                                        }
                                        else
                                        {
                                            //Bandera para que ponga el SUBTOTAL
                                            if (TDeposito == "")
                                            {
                                                Cuenta += "<div style=\"border-bottom: 1px solid black; width: 100px; margin-left: 580px;\"></div>";
                                                Cuenta += "<div style=\"position: relative; width: 650px; margin-left: 25px;\">";

                                                // Primer elemento
                                                Cuenta += "<div style=\"display: inline-block; vertical-align: top;\">";
                                                Cuenta += "<p style=\"font-size: 13px; font-weight: bold;\">SUBTOTAL DEPOSITOS" + ":</p>";
                                                Cuenta += "</div>";

                                                //Suma total de la cuenta
                                                Cuenta += "<div style=\"position: absolute; top: 0; left: 560px;\">";
                                                Cuenta += $"<p style=\"font-size: 13px; font-weight: bold;\">{TotalDepositoI.ToString("C")}</p>";
                                                Cuenta += "</div>";
                                                Cuenta += "</div>";
                                                TotalCajas += TotalDepositoI;
                                            }
                                            TotalDepositoI = 0;
                                            TDeposito = "DEPOSITOS";
                                        }
                                    }

                                    // //Desembolso Vales
                                    var resDesembolsoV = await ConexionBD.database.QueryAsync<DesembolsoVales>("EXEC Balances.pa_DesembolsoVales @0", CuentaBancoID_Iterando).ToArrayAsync();

                                    for (var b = 0; b <= resDesembolsoV.Length; b++)
                                    {
                                        if (b < resDesembolsoV.Length)
                                        {
                                            if (resDesembolsoV[b].CuentaID == CuentaBanco)
                                            {
                                                //Condición para que solo ponga un título
                                                if (TDesembolso != "")
                                                {
                                                    // Cuenta +=    "<br>";
                                                    Cuenta += "<p class=\"d-inline\" style=\"font-size: 13px; margin-bottom: 0; margin-left: -555px; font-weight: bold;\">" + TDesembolso + "</p>";
                                                    Cuenta += "<br>";
                                                    TDesembolso = "";
                                                }
                                                //Suma
                                                TotalDVA += resDesembolsoV[b].Capital;
                                                CuentaBanco = resDesembolsoV[b].CuentaID;
                                            }
                                        }
                                        else
                                        {
                                            //Bandera para que ponga el SUBTOTAL
                                            if (TDesembolso == "")
                                            {
                                                Cuenta += "<div style=\"display: inline-block; vertical-align: top; position: relative; left: -250px;\">";
                                                Cuenta += "<div style=\"display: inline-block; vertical-align: top;\">";
                                                Cuenta += "<p class=\"d-inline\" style=\"font-size: 13px; margin-bottom: 0;\">";
                                                Cuenta += "Desembolsos" + "</p>";
                                                Cuenta += "</div>";

                                                decimal TotalDVA2 = TotalDVA * -1;
                                                Cuenta += "<div style=\"display: inline-block; vertical-align: top; position: absolute; left: 535px;\">";
                                                Cuenta += "<p class=\"d-inline\" style=\"font-size: 13px; margin-bottom: 0; white-space: nowrap;\">";
                                                Cuenta += TotalDVA2.ToString("C") + "</p>";
                                                Cuenta += "</div>";
                                                Cuenta += "</div>";

                                                Cuenta += "<div style=\"border-bottom: 1px solid black; width: 100px; margin-left: 580px;\"></div>";
                                                Cuenta += "<div style=\"position: relative; width: 650px; margin-left: 25px;\">";

                                                // Primer elemento
                                                Cuenta += "<div style=\"display: inline-block; vertical-align: top;\">";
                                                Cuenta += "<p style=\"font-size: 13px; font-weight: bold;\">SUBTOTAL DESEMBOLSOS" + ":</p>";
                                                Cuenta += "</div>";

                                                //Suma total de la cuenta
                                                Cuenta += "<div style=\"position: absolute; top: 0; left: 555px;\">";
                                                Cuenta += $"<p style=\"font-size: 13px; font-weight: bold;\">{TotalDVA2.ToString("C")}</p>";
                                                Cuenta += "</div>";
                                                Cuenta += "</div>";
                                                TotalCajas += TotalDVA2;

                                                TotalDVA = 0;
                                            }
                                            TDesembolso = "DESEMBOLSO";
                                        }
                                    }

                                    //Retiros
                                    var resRetirosCuentas = await ConexionBD.database.QueryAsync<BalanceDesgloseGastos>("EXEC Balances.pa_DesgloseGastos @0", CuentaBancoID_Iterando).ToArrayAsync();

                                    for (var y = 0; y <= resRetirosCuentas.Length; y++)
                                    {
                                        if (y < resRetirosCuentas.Length)
                                        {
                                            //Si la cuenta de banco de la iteración es igual a la almacenada en la variable, los datos son de esta cuenta, e insertamos.
                                            if (resRetirosCuentas[y].CuentaID == CuentaBanco)
                                            {
                                                //Bandera para colocar el titulo.
                                                if (TRetiros != "")
                                                {
                                                    Cuenta += "<p class=\"d-inline\" style=\"font-size: 13px; margin-bottom: 0; margin-left: -575px; font-weight: bold;\">" + TRetiros + "</p>";
                                                    TRetiros = "";
                                                }
                                                Cuenta += "<br>";
                                                Cuenta += "<div style=\"display: inline-block; vertical-align: top; position: relative; left: -275px;\">";
                                                Cuenta += "<div style=\"display: inline-block; vertical-align: top;\">";
                                                Cuenta += "<p class=\"d-inline\" style=\"font-size: 13px; margin-bottom: 0;\">";
                                                Cuenta += resRetirosCuentas[y].FechaAfectacion.ToString("dd/MM/yyyy") + "</p>";
                                                Cuenta += "</div>";


                                                string RestoRetirosDescripcion = resRetirosCuentas[y].ObservacionesSolicitudes;
                                                string retiSimplificada = RestoRetirosDescripcion.Length > 64 ? RestoRetirosDescripcion.Substring(0, 64) : RestoRetirosDescripcion;
                                                Cuenta += "<div style=\"display: inline-block; vertical-align: top; position: absolute; left: 75px;\">";
                                                Cuenta += "<p class=\"d-inline\" style=\"font-size: 13px; margin-bottom: 0; white-space: nowrap;\">";
                                                Cuenta += retiSimplificada + "</p>";
                                                Cuenta += "</div>";

                                                Cuenta += "<div style=\"display: inline-block; vertical-align: top; position: absolute; left: 560px;\">";
                                                Cuenta += "<p class=\"d-inline\" style=\"font-size: 15px; margin-bottom: 0; white-space: nowrap;\">";
                                                Cuenta += (resRetirosCuentas[y].MontoAutorizado * -1).ToString("C") + "</p>";
                                                Cuenta += "</div>";
                                                Cuenta += "</div>";

                                                TotalRetirosI += resRetirosCuentas[y].MontoAutorizado;
                                                CuentaBanco = resRetirosCuentas[y].CuentaID;
                                            }
                                        }
                                        else
                                        {
                                            //Bandera para poner el subtotal.
                                            if (TRetiros == "")
                                            {
                                                Cuenta += "<div style=\"border-bottom: 1px solid black; width: 100px; margin-left: 580px;\"></div>";
                                                Cuenta += "<div style=\"position: relative; width: 650px; margin-left: 25px;\">";

                                                // Primer elemento
                                                Cuenta += "<div style=\"display: inline-block; vertical-align: top;\">";
                                                Cuenta += "<p style=\"font-size: 13px; font-weight: bold;\">SUBTOTAL RETIROS" + ":</p>";
                                                Cuenta += "</div>";

                                                //Suma total de la cuenta
                                                TotalRetirosI *= -1;
                                                Cuenta += "<div style=\"position: absolute; top: 0; left: 560px;\">";
                                                Cuenta += $"<p style=\"font-size: 13px; font-weight: bold;\">" + TotalRetirosI.ToString("C") + "</p>";
                                                Cuenta += "</div>";
                                                Cuenta += "</div>";
                                                TotalCajas += TotalRetirosI;
                                            }
                                            TRetiros = "RETIROS";
                                            TotalRetirosI = 0;
                                        }
                                    }

                                    cuentaAnterior = res[i].NombreCaja;

                                    if (i == res.Length - 1)
                                    {
                                        Cuenta += "<br>";
                                        Cuenta += "</div>";
                                        Cuenta += "<br>";
                                        Cuenta += "<div style=\"border-bottom: 2px solid black; width: 650px; margin-left: 25px;\"></div>";
                                        Cuenta += "<p class=\"d-inline m-5\" style=\"font-size: 15px; font-weight: bold; margin-right: 50px;\">" + "TOTAL " + cuentaAnterior + ":" + " </p>";
                                        Cuenta += "<p class=\"d-inline\" style=\"font-size: 15px; margin-left: 15px; font-weight: bold;\">" + TotalCajas.ToString("C") + "</p>";
                                        Cuenta += "<br/>";
                                        Cuenta += "<br/>";
                                        Subtotal = 0;
                                        TotalBancos += TotalCajas;
                                    }
                                }
                                else
                                {
                                    cuentaAnterior = res[i].NombreCaja;
                                    //último registro
                                    if (i == res.Length - 1)
                                    {

                                        Cuenta += "</div>";
                                        Cuenta += "<div style=\"border-bottom: 2px solid black; width: 650px; margin-left: 25px;\"></div>";
                                        Cuenta += "<p class=\"d-inline m-5\" style=\"font-size: 15px; font-weight: bold; margin-right: 50px;\">" + "TOTAL " + cuentaAnterior + ":" + " </p>";
                                        Cuenta += "<p class=\"d-inline\" style=\"font-size: 15px; margin-left: 15px; font-weight: bold;\">" + TotalCajas.ToString("C") + "</p>";
                                        Cuenta += "<br/>";
                                        Cuenta += "<br/>";
                                        Subtotal = 0;
                                        TotalBancos += TotalCajas;
                                    }
                                }

                            }

                        }
                    }

                    //Parte derecha
                    var BAnterior = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Balances.Balance2>("SELECT SaldoTotalBalance FROM Balances.Balance2 WHERE PeriodoID = @0", Periodo).ToArrayAsync();

                    //Cancelaciones
                    var resCancelaciones = await ConexionBD.database.QueryAsync<BalanceCreditosCancelados>("EXEC Balances.pa_CreditosCancelados @0", parData.BalanceSeleccionado).ToArrayAsync();

                    if (resCancelaciones.Length > 0)
                    {
                        for (var i = 0; i <= resCancelaciones.Length; i++)
                        {
                            if (i < resCancelaciones.Length)
                            {

                                Cancelaciones += "<div style=\"position: relative; left: -262px;\">"; // Añadido margen inferior para separación
                                Cancelaciones += "<div style=\"display: inline-block;\">"; // Cambiado a display block
                                Cancelaciones += "<p style=\" font-size: 13px; margin-bottom: 0; white-space: nowrap;\">";
                                Cancelaciones += resCancelaciones[i].DistribuidorID + "</p>";
                                Cancelaciones += "</div>";

                                Cancelaciones += "<div style=\"display: inline-block; vertical-align: top; position: absolute; left: 470px;\">";
                                Cancelaciones += "<p class=\"d-inline\" style=\"font-size: 13px; margin-bottom: 0; white-space: nowrap;\">";
                                Cancelaciones += resCancelaciones[i].NombreCompleto + "</p>";
                                Cancelaciones += "</div>";

                                Cancelaciones += "<div style=\"display: inline-block; vertical-align: top; position: absolute; left: 1030px;\">";
                                Cancelaciones += "<p class=\"d-inline\" style=\"font-size: 13px; margin-bottom: 0; white-space: nowrap;\">";
                                Cancelaciones += (-resCancelaciones[i].Capital).ToString("C") + "</p>";
                                Cancelaciones += "</div>";

                                Cancelaciones += "</div>";

                                TotalCancelaciones += resCancelaciones[i].Capital * -1;

                            }
                        }
                        TotalBAnterior += TotalCancelaciones;
                    }

                    //Depositos
                    var resDepositos = await ConexionBD.database.QueryAsync<DepositosCuentas>("EXEC Balances.pa_DepositosCuentas 0,@0,@1,@2", 1, parData.BalanceTempID, parData.BalanceSeleccionado).ToArrayAsync();
                    /*                     var resDXT = await ConexionBD.database.QueryAsync<Depositos>("EXEC Balances.pa_Traspasos @0, @1, @2, @3", Producto, FechaApertura, FechaCierre, Accion).ToArrayAsync();
                     */
                    decimal SumaDepositos = 0;
                    decimal SumaTotalDepositos = 0;

                    if (resDepositos.Length > 0)
                    {
                        SumaDepositos = resDepositos.Sum(deposito => deposito.Importe);

                        Depositos += "<div style=\"position: relative; left: -255px;\">";
                        Depositos += "<div style=\"display: inline-block;\">";
                        Depositos += "<p style=\" font-size: 13px; margin-bottom: 0; white-space: nowrap;\">";
                        Depositos += "Depósitos</p>";
                        Depositos += "</div>";

                        Depositos += "<div style=\"display: inline-block; vertical-align: top; position: absolute; left:  1000px;\">";
                        Depositos += "<p class=\"d-inline\" style=\"font-size: 13px; margin-bottom: -50px; \">";
                        Depositos += SumaDepositos.ToString("C") + "</p>";
                        Depositos += "</div>";

                        Depositos += "</div>";
                        SumaTotalDepositos = SumaDepositos;

                        /*              for (var i = 0; i <= resDXT.Length; i++)
                                     {
                                         if (i < resDXT.Length)
                                         {
                                             Depositos += "<div style=\"position: relative; left: 140px; width: 250px;\">";
                                             Depositos += "<div style=\" width: 100%; display: inline-block; text-align: left;\">";
                                             Depositos += "<p style=\" font-size: 13px; margin-bottom: 0; white-space: nowrap;\">";
                                             Depositos += resDXT[i].NumeroCuentaDestino + " -> " + resDXT[i].NumeroCuentaOrigen + "</p>";
                                             Depositos += "</div>";

                                             Depositos += "<div style=\"display: inline-block; vertical-align: top; position: absolute; left: 605px;\">";
                                             Depositos += "<p class=\"d-inline\" style=\"font-size: 13px; margin-bottom: -50px; \">";
                                             Depositos += resDXT[i].Monto.ToString("C") + "</p>";
                                             Depositos += "</div>";

                                             Depositos += "</div>";
                                             SumaTotalDepositos += resDXT[i].Monto;
                                             TotalDepositos = SumaDepositos + SumaTotalDepositos;

                                         }
                                         else
                                         {
                                             //En caso de que no tenga traspasos
                                             TotalDepositos = SumaDepositos;
                                         }
                                     } */
                        TotalBAnterior += TotalDepositos;
                        TotalDepositos = SumaDepositos;
                    }

                    //Depositos DNI
                    var resDNI = await ConexionBD.database.QueryAsync<DepositosDNI>("EXEC Balances.pa_DepositosDNI 0,1,@0", parData.BalanceSeleccionado).ToArrayAsync();
                    int Anterior = 0;
                    decimal SumaCuenta = 0;
                    decimal SumaDNI = 0;

                    if (resDNI.Length > 0)
                    {
                        for (var i = 0; i <= resDNI.Length; i++)
                        {

                            if (i < resDNI.Length)
                            {
                                if (Anterior != resDNI[i].CuentaID && Anterior != 0)
                                {
                                    DNI += "<div style=\"position: relative; left: 150px; width: 1px; \">";
                                    DNI += "<div style=\"display: inline-block; vertical-align: top; position: absolute; left: 590px;\">";
                                    DNI += "<p class=\"d-inline\" style=\"font-size: 13px; margin-bottom: 0; white-space: nowrap;\">";
                                    DNI += SumaCuenta.ToString("C") + "</p>";
                                    DNI += "</div>";
                                    DNI += "</div>";

                                    SumaCuenta = 0;

                                }

                                if (Anterior != resDNI[i].CuentaID)
                                {
                                    string FechaCaptura = resDNI[i].FechaCaptura.ToString("dd/MM/yyyy");
                                    string RestoDNIDescripcion = resDNI[i].Descripcion;
                                    string simplificada = RestoDNIDescripcion.Length > 64 ? RestoDNIDescripcion.Substring(0, 64) : RestoDNIDescripcion;
                                    DNI += "<div style=\"position: relative; left: 150px; width: 1px;\">"; // Añadido margen inferior para separación
                                    DNI += @$"<table style='width: 550px;'>
                                        <tr>
                                            <td style='font-size: 10px; margin-bottom: 0; width: 5px;'>.</td>
                                            <td style='font-size: 13px; margin-bottom: 0; width: 470px;'>{simplificada}</td>
                                            <td style='font-size: 13px; margin-bottom: 0;'width: 25px;'>{FechaCaptura}</td>
                                        </tr>
                                    </table>";
                                    // DNI += "<div style=\"width: 1%;  text-align: left;\">"; // Cambiado a display block
                                    // DNI += "<p style=\" font-size: 10px; margin-bottom: 0; white-space: nowrap;\">";
                                    // DNI += " . " + "</p>";
                                    // DNI += "</div>";

                                    // DNI += "<div style=\"vertical-align: top; position: absolute; left: 470px;\">";
                                    // DNI += "<p class=\"\" style=\"font-size: 13px; margin-bottom: 0; white-space: nowrap;\">";
                                    // DNI += resDNI[i].FechaCaptura.ToString("dd/MM/yyyy") + "</p>";
                                    // DNI += "</div>";

                                    // DNI += "<div style=\"vertical-align: top; position: absolute; left: 0px;\">";
                                    // DNI += "<span> <p class=\"\" style=\"font-size: 13px; margin-bottom: 0;  white-space: nowrap;\">";
                                    // DNI += resDNI[i].Descripcion + "</p></span>";
                                    // DNI += "</div>";
                                    DNI += "</div>";
                                }

                                SumaCuenta += resDNI[i].Importe;
                                TotalDNI += resDNI[i].Importe;

                                Anterior = resDNI[i].CuentaID;

                            }
                            if (i == resDNI.Length - 1)
                            {
                                DNI += "<div style=\" vertical-align: top; position: absolute; left: 1470px; top: -13px;\">";
                                DNI += "<p class=\"\" style=\"font-size: 13px; margin-bottom: 0; white-space: nowrap;\">";
                                DNI += SumaCuenta.ToString("C") + "</p>";
                                DNI += "</div>";

                            }
                        }
                        DNI += "</br>";
                        TotalBAnterior += TotalDNI;
                    }

                    //Retiros
                    var resRetiros = await ConexionBD.database.QueryAsync<BalanceDesgloseGastos>("EXEC Balances.pa_DesgloseGastos  0,1,@0", parData.BalanceSeleccionado).ToArrayAsync();
                    if (resRetiros.Length > 0)
                    {
                        for (var i = 0; i < resRetiros.Length; i++)
                        {
                            TotalRetiros += resRetiros[i].MontoAutorizado * -1;
                        }
                        Retiros += "<div style=\"position: relative; left: 150px; width: 1px;\">";
                        Retiros += "<div style=\"width: 1%;  text-align: left;\">";
                        Retiros += "<p style=\" font-size: 10px; margin-bottom: 0; white-space: nowrap;\">";
                        Retiros += "TOTAL RETIROS </p>";
                        Retiros += "</div>";

                        Retiros += "<div style=\"vertical-align: top; position: absolute; left: -210px;\">";
                        Retiros += "<p class=\"\" style=\"font-size: 13px; margin-bottom: 0; white-space: nowrap;\">";
                        Retiros += "..</p>";
                        Retiros += "</div>";

                        Retiros += "<div style=\"vertical-align: top; position: absolute; left: 260px;\">";
                        Retiros += "<p class=\"\" style=\"font-size: 13px; margin-bottom: 0; white-space: nowrap;\">";
                        Retiros += "..</p>";
                        Retiros += "</div>";

                        Retiros += "<div style=\"vertical-align: top; position: absolute; left: 385px;\">";
                        Retiros += "<p class=\"\" style=\"font-size: 13px; margin-bottom: 0; white-space: nowrap;\">";
                        Retiros += ((TotalRetiros).ToString("C")) + "</p>";
                        Retiros += "</div>";
                        Retiros += "</div>";

                        TotalBAnterior += TotalRetiros;
                    }

                    //Desembolsos Vales
                    //Total
                    var resDV = await ConexionBD.database.QueryAsync<DesembolsoVales>("EXEC Balances.pa_DesembolsoVales 0,1, @0", parData.BalanceSeleccionado).ToArrayAsync();
                    decimal CapitalInteres = 0;
                    if (resDV.Length > 0)
                    {
                        for (var i = 0; i <= resDV.Length; i++)
                        {
                            if (i < resDV.Length)
                            {
                                TotalDV += resDV[i].Capital;
                                CapitalInteres += resDV[i].SaldoCapInt;
                            }
                        }
                        DesembolsoVales += "<div style=\"position: relative; left: -50px;\">";
                        DesembolsoVales += "<div style=\"display: inline-block;\">";
                        DesembolsoVales += "<p style=\" font-size: 13px; margin-bottom: 0; white-space: nowrap;\">";
                        DesembolsoVales += "CAPITAL CANJES VALES" + "</p>";
                        DesembolsoVales += "</div>";

                        DesembolsoVales += "<div style=\"display: inline-block; vertical-align: top; position: absolute; left: 575px;\">";
                        DesembolsoVales += "<p class=\"d-inline\" style=\"font-size: 13px; margin-bottom: 0; white-space: nowrap;\">";
                        DesembolsoVales += TotalDV.ToString("C") + "</p>";
                        DesembolsoVales += "</div>";
                        DesembolsoVales += "</div>";

                        DesembolsoVales += "<div style=\"position: relative; left: -50px;\">";
                        DesembolsoVales += "<div style=\"display: inline-block;\">";
                        DesembolsoVales += "<p style=\" font-size: 13px; margin-bottom: 0; white-space: nowrap;\">";
                        DesembolsoVales += "CAPITAL CANJES + INTERES VALES" + "</p>";
                        DesembolsoVales += "</div>";

                        DesembolsoVales += "<div style=\"display: inline-block; vertical-align: top; position: absolute; left: 575px;\">";
                        DesembolsoVales += "<p class=\"d-inline\" style=\"font-size: 13px; margin-bottom: 0; white-space: nowrap;\">";
                        DesembolsoVales += CapitalInteres.ToString("C") + "</p>";
                        DesembolsoVales += "</div>";
                        DesembolsoVales += "</div>";
                    }
                    TotalBAnterior += TotalDV;

                    var resNV = await ConexionBD.database.QueryAsync<NuevasVentas>("EXEC Balances.pa_NuevasVentas @0", parData.BalanceSeleccionado).ToArrayAsync();

                    if (resNV.Length > 0)
                    {
                        for (var i = 0; i <= resNV.Length; i++)
                        {
                            if (i < resNV.Length)
                            {
                                NuevasVentas += "<div style=\"position: relative; left: -262px;\">";
                                NuevasVentas += "<div style=\"display: inline-block;\">";
                                NuevasVentas += "<p style=\" font-size: 13px; margin-bottom: 0; white-space: nowrap;\">";
                                NuevasVentas += resNV[i].CreditoID + "</p>";
                                NuevasVentas += "</div>";

                                NuevasVentas += "<div style=\"display: inline-block; vertical-align: top; position: absolute; left: 470px;\">";
                                NuevasVentas += "<p class=\"d-inline\" style=\"font-size: 13px; margin-bottom: 0; white-space: nowrap;\">";
                                NuevasVentas += resNV[i].NombreCompleto + "</p>";
                                NuevasVentas += "</div>";

                                NuevasVentas += "<div style=\"display: inline-block; vertical-align: top; position: absolute; left: 1030px;\">";
                                NuevasVentas += "<p class=\"d-inline\" style=\"font-size: 13px; margin-bottom: 0; white-space: nowrap;\">";
                                NuevasVentas += resNV[i].ImporteTotal.ToString("C") + "</p>";
                                NuevasVentas += "</div>";

                                NuevasVentas += "</div>";
                                TotalNV += resNV[i].ImporteTotal;
                            }
                        }
                        TotalBAnterior += TotalNV;
                    }

                    //Tiendita
                    var resTiendita = await ConexionBD.database.QueryAsync<Tiendita>("EXEC Balances.pa_Tiendita @0, @1, @2, @3, @4", Producto, Periodo, FechaApertura, FechaCierre, parData.BalanceSeleccionado).ToArrayAsync();

                    if (resTiendita.Length > 0)
                    {
                        for (var i = 0; i <= resTiendita.Length; i++)
                        {
                            if (i < resTiendita.Length)
                            {
                                Tiendita += "<div style=\"position: relative; left: -262px;\">";
                                Tiendita += "<div style=\"display: inline-block;\">";
                                Tiendita += "<p style=\" font-size: 13px; margin-bottom: 0; white-space: nowrap;\">";
                                Tiendita += resTiendita[i].CreditoID + "</p>";
                                Tiendita += "</div>";

                                Tiendita += "<div style=\"display: inline-block; vertical-align: top; position: absolute; left: 470px;\">";
                                Tiendita += "<p class=\"d-inline\" style=\"font-size: 13px; margin-bottom: 0; white-space: nowrap;\">";
                                Tiendita += resTiendita[i].NombreCompleto + "</p>";
                                Tiendita += "</div>";



                                Tiendita += "<div style=\"display: inline-block; vertical-align: top; position: absolute; left: 1030px;\">";
                                Tiendita += "<p class=\"d-inline\" style=\"font-size: 13px; margin-bottom: 0; white-space: nowrap;\">";
                                Tiendita += resTiendita[i].ImporteTotal.ToString("C") + "</p>";
                                Tiendita += "</div>";


                                Tiendita += "</div>";
                                TotalTiendita += resTiendita[i].ImporteTotal;
                            }
                        }
                        TotalBAnterior += TotalTiendita;
                    }

                    //Retiros x Traspasos
                    var resRxT = await ConexionBD.database.QueryAsync<Depositos>("EXEC Balances.pa_Traspasos @0, @1, @2, @3", Producto, FechaApertura, FechaCierre, Accion).ToArrayAsync();

                    if (resRxT.Length > 0)
                    {
                        for (var i = 0; i <= resRxT.Length; i++)
                        {
                            if (i < resRxT.Length)
                            {

                                RetirosXT += "<div style=\"position: relative; left: 150px; width: 1px;\">";
                                RetirosXT += "<div style=\"width: 1%;  text-align: left;\">";
                                RetirosXT += "<p style=\" font-size: 10px; margin-bottom: 0; white-space: nowrap;\">";
                                RetirosXT += " . " + "</p>";
                                RetirosXT += "</div>";

                                RetirosXT += "<div style=\"vertical-align: top; position: absolute; left: -200px;\">";
                                RetirosXT += "<p class=\"\" style=\"font-size: 13px; margin-bottom: 0; white-space: nowrap;\">";
                                RetirosXT += resRxT[i].NumeroCuentaOrigen + " -> " + resRxT[i].NumeroCuentaDestino + "</p>";
                                RetirosXT += "</div>";


                                // ((resRetiros[i].MontoAutorizado * -1).ToString("C")) 
                                RetirosXT += "<div style=\"vertical-align: top; position: absolute; left: 395px;\">";
                                RetirosXT += "<p class=\"\" style=\"font-size: 13px; margin-bottom: 0; white-space: nowrap;\">";
                                RetirosXT += ((resRxT[i].Monto * -1).ToString("C")) + "</p>";
                                RetirosXT += "</div>";
                                RetirosXT += "</div>";
                                TotalRxT += resRxT[i].Monto * -1;
                            }
                        }

                        RetirosXT += "</br>";
                        TotalBAnterior += TotalRxT;
                    }

                    //USV
                    var resUSV = await ConexionBD.database.QueryAsync<USV>("EXEC Balances.pa_USV @0", parData.BalanceSeleccionado).ToArrayAsync();

                    if (resUSV.Length > 0)
                    {
                        for (var i = 0; i <= resUSV.Length; i++)
                        {
                            if (i < resUSV.Length)
                            {
                                TotalUSV += resUSV[i].Seguro;
                            }
                        }
                        USV += "<div style=\"position: relative; left: -50px;\">"; // Añadido margen inferior para separación
                        USV += "<div style=\"display: inline-block;\">"; // Cambiado a display block
                        USV += "<p style=\" font-size: 13px; margin-bottom: 0; white-space: nowrap;\">";
                        USV += "COBRO DE USV" + "</p>";
                        USV += "</div>";

                        USV += "<div style=\"display: inline-block; vertical-align: top; position: absolute; left: 580px;\">";
                        USV += "<p class=\"d-inline\" style=\"font-size: 13px; margin-bottom: 0; white-space: nowrap;\">";
                        USV += TotalUSV.ToString("C") + "</p>";
                        USV += "</div>";

                        USV += "</div>";
                    }
                    TotalBAnterior += TotalUSV;
                    TRBalance = TotalBAnterior;


                    Total += "<div style=\"position: relative; left: 250px;\">"; // Añadido margen inferior para separación
                    Total += "<div style=\"display: inline-block;\">"; // Cambiado a display block
                    Total += "<p style=\" font-size: 15px; font-weight: bold; margin-bottom: 0; white-space: nowrap;\">";
                    Total += "TOTAL" + "</p>";
                    Total += "</div>";

                    Total += "<div style=\"display: inline-block; vertical-align: top; position: absolute; left: 150px;\">";
                    Total += "<p class=\"d-inline\" style=\"font-size: 15px; margin-bottom: 0; white-space: nowrap;\">";
                    Total += TotalBAnterior.ToString("C") + "</p>";
                    Total += "</div>";

                    Total += "</div>";
                    Resultado += "<div>";

                    var resTotales = await ConexionBD.database.QueryAsync<Totales>("EXEC Balances.pa_TotalCartera @0, 1", parData.BalanceSeleccionado).ToArrayAsync();
                    TVencida = resTotales[0].TotalSaldoActual;

                    var resTotales2 = await ConexionBD.database.QueryAsync<Totales>("EXEC Balances.pa_TotalCartera @0,  2", parData.BalanceSeleccionado).ToArrayAsync();
                    TNormal = resTotales2[0].TotalSaldoActual;

                    TNormal2 = TVencida + TNormal;
                    TSaldoCuentas = TNormal2;

                    // SALDO EN CUENTAS POR COBRAR
                    SaldoCuentas += "<div style=\"position: relative; left: -25px;\">";
                    SaldoCuentas += "<div style=\"display: inline-block;\">";
                    SaldoCuentas += "<p style=\"font-size: 15px; font-weight: bold; margin-bottom: 0; white-space: nowrap;\">";
                    SaldoCuentas += "SALDO EN CUENTAS POR COBRAR" + "</p>";
                    SaldoCuentas += "</div>";

                    SaldoCuentas += "<div style=\"display: inline-block; vertical-align: top; position: absolute; left: 525px;\">";
                    SaldoCuentas += "<p class=\"d-inline\" style=\"font-size: 15px; margin-bottom: 0; white-space: nowrap; font-weight: bold;\">";
                    SaldoCuentas += TSaldoCuentas.ToString("C") + "</p>";
                    SaldoCuentas += "</div>";
                    SaldoCuentas += "</div>";

                    // SALDO EN BANCOS
                    SaldoBancos += "<div style=\"position: relative; left: -25px;\">";
                    SaldoBancos += "<div style=\"display: inline-block;\">";
                    SaldoBancos += "<p style=\"font-size: 15px; font-weight: bold; margin-bottom: 0; white-space: nowrap;\">";
                    SaldoBancos += "+ SALDO EN BANCOS" + "</p>";
                    SaldoBancos += "</div>";

                    SaldoBancos += "<div style=\"display: inline-block; vertical-align: top; position: absolute; left: 525px;\">";
                    SaldoBancos += "<p class=\"d-inline\" style=\"font-size: 15px; margin-bottom: 0; white-space: nowrap;\">";
                    SaldoBancos += TotalBancos.ToString("C") + "</p>";
                    SaldoBancos += "</div>";

                    SaldoBancos += "</div>";

                    TCuentasBancos = TSaldoCuentas + TotalBancos;
                    TDif = TCuentasBancos - TRBalance;

                    CuentasBancos += "<div style=\"display: inline-block; vertical-align: top; position: absolute; left: 490px;\">";
                    CuentasBancos += "<p class=\"d-inline\" style=\"font-size: 15px; margin-bottom: 0; white-space: nowrap;\">";
                    CuentasBancos += TCuentasBancos.ToString("C") + "</p>";
                    CuentasBancos += "</div>";

                    // RESULTADO BALANCE
                    ResultadoBalance += "<div style=\"position: relative; left: -25px;\">";
                    ResultadoBalance += "<div style=\"display: inline-block;\">";
                    ResultadoBalance += "<p style=\"font-size: 15px; font-weight: bold; margin-bottom: 0; white-space: nowrap;\">";
                    ResultadoBalance += "RESULTADO BALANCE" + "</p>";
                    ResultadoBalance += "</div>";

                    ResultadoBalance += "<div style=\"display: inline-block; vertical-align: top; position: absolute; left: 525px;\">";
                    ResultadoBalance += "<p class=\"d-inline\" style=\"font-size: 15px; margin-bottom: 0; white-space: nowrap; font-weight: bold;\">";
                    ResultadoBalance += TRBalance.ToString("C") + "</p>";
                    ResultadoBalance += "</div>";

                    FResultadoBalance = TRBalance.ToString("C");


                    ResultadoBalance += "</div>";

                    // DIFERENCIA
                    Diferencia += "<div style=\"position: relative; left: -25px;\">";
                    Diferencia += "<div style=\"display: inline-block;\">";
                    Diferencia += "<p style=\"font-size: 15px; font-weight: bold; margin-bottom: 0; white-space: nowrap;\">";
                    Diferencia += "DIFERENCIA" + "</p>";
                    Diferencia += "</div>";

                    Diferencia += "<div style=\"display: inline-block; vertical-align: top; position: absolute; left: 525px;\">";
                    Diferencia += "<p class=\"d-inline\" style=\"font-size: 15px; margin: 5px; white-space: nowrap; border: 2px solid black; font-weight: bold;\">";
                    Diferencia += TDif.ToString("C") + "</p>";
                    Diferencia += "</div>";

                    Diferencia += "</div>";

                    // CLASIFICACIÓN
                    Clasificacion += "<div style=\"position: relative; left: -25px;\">";
                    Clasificacion += "<div style=\"display: inline-block;\">";
                    Clasificacion += "<p style=\"font-size: 15px; font-weight: bold; margin-bottom: 0; white-space: nowrap;\">";
                    Clasificacion += "CLASIFICACION DE CARTERA" + "</p>";
                    Clasificacion += "</div>";

                    Clasificacion += "<div style=\"display: inline-block; vertical-align: top; position: absolute; left: 525px;\">";
                    Clasificacion += "<p class=\"d-inline\" style=\"font-size: 15px; font-weight: bold; margin: 5px; white-space: nowrap;\">";
                    Clasificacion += "IMPORTE" + "</p>";
                    Clasificacion += "</div>";

                    Clasificacion += "</div>";

                    // CARTERA VENCIDA (90 DIAS O MÁS)
                    CVencida += "<div style=\"position: relative; left: -25px;\">";
                    CVencida += "<div style=\"display: inline-block;\">";
                    CVencida += "<p style=\"font-size: 15px; margin-bottom: 0; white-space: nowrap;\">";
                    CVencida += "CARTERA VENCIDA (90 DIAS O MÁS)" + "</p>";
                    CVencida += "</div>";

                    CVencida += "<div style=\"display: inline-block; vertical-align: top; position: absolute; left: 525px;\">";
                    CVencida += "<p class=\"d-inline\" style=\"font-size: 15px; margin: 5px; white-space: nowrap;\">";
                    CVencida += TVencida.ToString("C") + "</p>";
                    CVencida += "</div>";

                    CVencida += "</div>";

                    // NORMAL
                    Normal += "<div style=\"position: relative; left: -25px;\">";
                    Normal += "<div style=\"display: inline-block;\">";
                    Normal += "<p style=\"font-size: 15px; margin-bottom: 0; white-space: nowrap;\">";
                    Normal += "NORMAL" + "</p>";
                    Normal += "</div>";

                    Normal += "<div style=\"display: inline-block; vertical-align: top; position: absolute; left: 525px;\">";
                    Normal += "<p class=\"d-inline\" style=\"font-size: 15px; margin: 5px; white-space: nowrap;\">";
                    Normal += TNormal.ToString("C") + "</p>";
                    Normal += "</div>";

                    Normal += "</div>";

                    // NORMAL2
                    Normal2 += "<div style=\"position: relative; left: 70px;\">";
                    Normal2 += "<div style=\"display: inline-block;\">";
                    Normal2 += "<p style=\"font-size: 15px; margin-bottom: 0; white-space: nowrap;\">";
                    Normal2 += "NORMAL" + "</p>";
                    Normal2 += "</div>";

                    Normal2 += "<div style=\"display: inline-block; vertical-align: top; position: absolute; left: 430px;\">";
                    Normal2 += "<p class=\"d-inline\" style=\"font-size: 15px; margin: 5px; white-space: nowrap;\">";
                    Normal2 += TNormal2.ToString("C") + "</p>";
                    Normal2 += "</div>";

                    Normal2 += "</div>";

                    Resultado += "</div>";

                    //update Tesorera.BalanceTemp where BalanceTempID = pardata.BalanceTemporalID
                    var balanceTemporal = await ConexionBD.database.QueryAsync<BalanceTemp>("WHERE BalanceTempID = @0", parData.BalanceTempID).SingleOrDefaultAsync();

                    balanceTemporal.ResultadoBalance = TRBalance.ToString("C");
                    balanceTemporal.DiferenciaBalance = TDif.ToString("C");
                    balanceTemporal.Cartera090 = TNormal.ToString("C");
                    balanceTemporal.Cartera90 = TVencida.ToString("C");
                    balanceTemporal.BalanceVinculado = parData.BalanceSeleccionado;

                    await ConexionBD.database.UpdateAsync(balanceTemporal);



                    //Inicio PDF Cancelaciones
                    //Llamada al SP de Creditos Cancelados
                    var res2 = await ConexionBD.database.QueryAsync<BalanceCreditosCancelados>("EXEC Balances.pa_CreditosCancelados @0", parData.BalanceSeleccionado).ToArrayAsync();

                    if (res2.Length > 0)
                    {
                        Count = 0;
                        //Declaramos variables para calcular la suma total de algunas cantidades
                        decimal totalImporte = 0;
                        decimal totalSaldoActual = 0;

                        for (var i = 0; i <= res2.Length; i++)
                        {
                            if (i < res2.Length)
                            {
                                //Asignamos valor a totalImporte y a totalSaldoActual.
                                totalImporte = totalImporte + res2[i].ImporteTotal;
                                totalSaldoActual = totalSaldoActual + res2[i].Capital;

                                //Mostramos los datos en la tabla
                                CreditosCancelados += "<tr>";
                                CreditosCancelados += "<td  class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px; \" > " + res2[i].CreditoID + "</td>";
                                CreditosCancelados += "<td  class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px;\" > " + res2[i].DistribuidorID + "</td>";
                                /*                                 CreditosCancelados += "<td  class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px;\" > " + res2[i].MovimientoID + "</td>";*/
                                CreditosCancelados += "<td  class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px;\" > " + res2[i].NombreCompleto + "</td>";
                                /*    CreditosCancelados += "<td  class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px;\" > " + res2[i].FechaAfectacion + "</td>";
                                */
                                CreditosCancelados += "<td  class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px;\" >" + Math.Round(res2[i].ImporteTotal, 2).ToString("C") + "</td>";
                                CreditosCancelados += "<td  class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px;\" >" + Math.Round(res2[i].Capital, 2).ToString("C") + "</td>";
                                CreditosCancelados += "<td  class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px;\" > " + res2[i].TipoCancelacion + "</td>";
                                CreditosCancelados += "<td  class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px;\" > " + res2[i].UsrCancela + "</td>";
                                CreditosCancelados += "<td  class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px;\" > " + res2[i].MvCancelacion + "</td>";
                                CreditosCancelados += "</tr>";

                                Count += 1;

                                //Cuando se llgue al final de los registros, muestra el total.
                                if (res2.Length == Count)
                                {
                                    CreditosCancelados += "<tr>";
                                    CreditosCancelados += "<td class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px; background: #DFDFDF !important; \"><strong>" + "" + "</strong></td>";
                                    CreditosCancelados += "<td class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px; background: #DFDFDF !important; \"><strong>" + "TOTALES: " + "</strong></td>";
                                    CreditosCancelados += "<td class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px; background: #DFDFDF !important; \"><strong>" + "" + "</strong></td>";
                                    CreditosCancelados += "<td class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px; background: #DFDFDF !important; \"><strong>" + Math.Round(totalImporte, 2).ToString("C") + "</strong></td>";
                                    CreditosCancelados += "<td class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px; background: #DFDFDF !important; \"><strong>" + Math.Round(totalSaldoActual, 2).ToString("C") + "</strong></td>";
                                    CreditosCancelados += "<td class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px; background: #DFDFDF !important; \"><strong>" + "" + "</strong></td>";
                                    CreditosCancelados += "<td class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px; background: #DFDFDF !important; \"><strong>" + "" + "</strong></td>";
                                    CreditosCancelados += "<td class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px; background: #DFDFDF !important; \"><strong>" + "" + "</strong></td>";
                                    CreditosCancelados += "<td class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px; background: #DFDFDF !important; \"><strong>" + "" + "</strong></td>";
                                    CreditosCancelados += "<td class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px; background: #DFDFDF !important; \"><strong>" + "" + "</strong></td>";
                                    CreditosCancelados += "<td class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px; background: #DFDFDF !important; \"><strong>" + "" + "</strong></td>";
                                    CreditosCancelados += "<td class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px; background: #DFDFDF !important; \"><strong>" + "" + "</strong></td>";
                                    CreditosCancelados += "</tr>";
                                }
                            }
                        }

                    }

                    //PDF Desglose de Gastos 
                    var desgloseGastos = await ConexionBD.database.QueryAsync<BalanceDesgloseGastos2>("EXEC Tesoreria.pa_GetDesgloseGastosBalance @0, @1", parData.BalanceSeleccionado, 0).ToArrayAsync();
                    var totalDesglose = await ConexionBD.database.QueryAsync<BalanceDesgloseGastosTotal>("EXEC Tesoreria.pa_GetDesgloseGastosBalance @0, @1", parData.BalanceSeleccionado, 1).ToArrayAsync();

                    string __estiloBordes__ = "border: 1px solid black !important; border-collapse: collapse; font-size: 9px; background: #FFFFFF !important;";

                    if (totalDesglose.Length > 0)
                    {
                        DesgloseDeGastos += "<div style='display: flex; flex-direction: column !important;'>";
                        foreach (var rubro in totalDesglose)
                        {
                            string MontoTotal = Math.Round(rubro.MontoTotal, 2).ToString("C");

                            // DesgloseDeGastos += $"<div>";
                            DesgloseDeGastos += $"<div> <p style='font-size: 10px; font-weight: bold;'>RUBRO: {rubro.Descripcion}<p>";
                            DesgloseDeGastos += "<table style='border-collapse: collapse;'>";
                            // Dibujado de la tabla de gastos del rubro
                            foreach (var gastos in desgloseGastos.Where(reg => reg.RubroGastosID == rubro.RubroGastosID))
                            {
                                string Fecha = gastos.FechaAfectacion.ToString("dd/MM/yyyy");
                                string Util = gastos.Util ? "SI" : "NO";
                                string MontoAutorizado = Math.Round(gastos.MontoAutorizado, 2).ToString("C");

                                DesgloseDeGastos += $"<tr>";
                                // DesgloseDeGastos += $"<td style='width: 100px; {__estiloBordes__} text-align: center;' rowspan='2'>{rubro.Descripcion}</td>";
                                DesgloseDeGastos += $"<td style='width: 40px;  {__estiloBordes__} text-align: center;' rowspan='2'>{Util}</td>";
                                DesgloseDeGastos += $"<td style='width: 90px;  {__estiloBordes__}'>{Fecha}</td>";
                                DesgloseDeGastos += $"<td style='width: 300px; {__estiloBordes__}'>{gastos.Cuenta}</td>";
                                DesgloseDeGastos += $"<td style='width: 750px; {__estiloBordes__}' rowspan='2'>{gastos.Observaciones}</td>";
                                DesgloseDeGastos += $"<td style='width: 200px; {__estiloBordes__}' rowspan='2'>{gastos.Solicitante}</td>";
                                DesgloseDeGastos += $"<td style='width: 200px; {__estiloBordes__} text-align: end;' rowspan='2'>{MontoAutorizado}</td>";
                                DesgloseDeGastos += $"</tr>";

                                DesgloseDeGastos += $"<tr>";
                                DesgloseDeGastos += $"<td style='{__estiloBordes__}'>{gastos.MovimientoID}</td>";
                                DesgloseDeGastos += $"<td style='{__estiloBordes__}'>{gastos.SucursalNombre}</td>";
                                DesgloseDeGastos += $"</tr>";
                            }

                            DesgloseDeGastos += $"<tr>";
                            DesgloseDeGastos += $"<td colspan='2' style='font-size: 9px;'>REGISTROS: {rubro.TotalRegistros}</td>";
                            DesgloseDeGastos += $"<td></td>";
                            DesgloseDeGastos += $"<td></td>";
                            DesgloseDeGastos += $"<td style='text-align: end; font-size: 9px;'>TOTAL {rubro.Descripcion}:  </td>";
                            DesgloseDeGastos += $"<td style='text-align: end; {__estiloBordes__}'>{MontoTotal}</td>";
                            DesgloseDeGastos += $"</tr>";
                            DesgloseDeGastos += "</table>";
                            DesgloseDeGastos += "</div>";
                        }
                        DesgloseDeGastos += "</div>";
                    }

                    //PDF Pólizas Contratistas
                    //var res4 = await ConexionBD.database.QueryAsync<BalancePolizasContratistas>("EXEC Balances.pa_PolizasContratistas", parData.BalanceIDTemp).ToArrayAsync();

                    // if (res4.Length > 0)
                    // {
                    //    Count = 0;
                    //     decimal totalImporte = 0;

                    //     for (var i= 0; i <= res4.Length; i++)
                    //     {
                    //              if(i < res4.Length )
                    //             {
                    //                 nombreCompleto = res4[i].Nombre + " " + res4[i].ApellidoPaterno + " " + res4[i].ApellidoMaterno;
                    //                 // totalImporte = totalImporte + res4[i].Importe;
                    //                 Count += 1;


                    //                     PolizasContratistas += "<tr>";
                    //                     if(nombreCompleto == nombreAnterior)
                    //                     {
                    //                         PolizasContratistas += "<td  class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px; \" > " + " " + "</td>";
                    //                         if(res4[i].DescripcionRubro == DescripcionRubroAnterior)
                    //                         {
                    //                             PolizasContratistas += "<td  class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px; \" > " + " " + "</td>";
                    //                             DescripcionRubroAnterior = res4[i].DescripcionRubro;
                    //                         }
                    //                         else
                    //                         {
                    //                             PolizasContratistas += "<td  class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px;\" > "  + res4[i].DescripcionRubro + "</td>";
                    //                             DescripcionRubroAnterior = res4[i].DescripcionRubro;
                    //                         }
                    //                         PolizasContratistas += "<td  class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px;\" > "  + " " +"</td>";
                    //                     }
                    //                     else
                    //                     {
                    //                         PolizasContratistas += "<td  class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px; \" > " + nombreCompleto + "</td>";
                    //                         if(res4[i].DescripcionRubro == DescripcionRubroAnterior && nombreCompleto == nombreAnterior)
                    //                         {
                    //                              PolizasContratistas += "<td  class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px; \" > " + " " + "</td>";
                    //                              DescripcionRubroAnterior = res4[i].DescripcionRubro;
                    //                         }
                    //                         else
                    //                         {
                    //                             PolizasContratistas += "<td  class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px;\" > "  + res4[i].DescripcionRubro + "</td>";
                    //                             DescripcionRubroAnterior = res4[i].DescripcionRubro;
                    //                         }
                    //                         PolizasContratistas += "<td  class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px;\" > " + res4[i].DeudaInicial.ToString("C") + "</td>";
                    //                     }
                    //                         // PolizasContratistas += "<td  class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px;\" > " + nombreCompleto + "</td>";
                    //                         PolizasContratistas += "<td  class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px;\" > " + res4[i].FechaAlta + "</td>";
                    //                     if(res4[i].TipoMovimiento == "1")
                    //                     {
                    //                         PolizasContratistas += "<td  class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px;\" > " + "ABONO"+ "</td>";
                    //                         PolizasContratistas += "<td  class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px;\" > " + res4[i].MontoAPagar.ToString("C") + "</td>";
                    //                     }
                    //                     else
                    //                     {
                    //                         PolizasContratistas += "<td  class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px;\" > " + "CARGO"+ "</td>";
                    //                         PolizasContratistas += "<td  class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px;\" > " + res4[i].CargoAgregado.ToString("C") + "</td>";
                    //                     }
                    //                         PolizasContratistas += "<td  class=\"text-center \" style=\"border-top: 1px solid black !important; font-size: 15px;\" > " + res4[i].DeudaActual.ToString("C")+ "</td>";
                    //                         PolizasContratistas += "</tr>";

                    //                     nombreAnterior = nombreCompleto;
                    //         }
                    //     }

                    // }
                }

                //Páginas de los PDF

                var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Balances", "Principal.html"));
                html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                html = html.Replace("@@IMPRIMIO", PersonaActual.Nombre);
                html = html.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy"));
                html = html.Replace("@@NOMBRE_BALANCE", NuevoNombreBalance.ToString());//
                html = html.Replace("@@NOMBRE_RESPONSABLE", NombreResponsable.ToString());

                //Parte Izquierda
                html = html.Replace("@@CUENTA", Cuenta);
                html = html.Replace("@@TBANCOS", TotalBancos.ToString("C"));

                //Parte derecha
                html = html.Replace("@@CANCELACIONES", Cancelaciones);
                html = html.Replace("@@TOTALCANCELACIONES", TotalCancelaciones.ToString("C"));
                html = html.Replace("@@DEPOSITOS", Depositos);
                html = html.Replace("@@TOTALDEPOSITOS", TotalDepositos.ToString("C"));
                html = html.Replace("@@DNI", DNI);
                html = html.Replace("@@TOTALDNI", TotalDNI.ToString("C"));
                html = html.Replace("@@RETIROS", Retiros);
                html = html.Replace("@@TOTALRETIROS", TotalRetiros.ToString("C"));
                html = html.Replace("@@DESEMBOLSOVALES", DesembolsoVales);
                html = html.Replace("@@TOTALDV", TotalDV.ToString("C"));
                html = html.Replace("@@NUEVASVENTAS", NuevasVentas);
                html = html.Replace("@@TOTALNV", TotalNV.ToString("C"));
                html = html.Replace("@@TIENDITA", Tiendita);
                html = html.Replace("@@TTDTA", TotalTiendita.ToString("C"));
                html = html.Replace("@@RXT", RetirosXT);
                html = html.Replace("@@TOTALRXT", TotalRxT.ToString("C"));
                html = html.Replace("@@USV", USV);
                html = html.Replace("@@TOTALUSV", TotalUSV.ToString("C"));
                html = html.Replace("@@TOTAL", Total);
                html = html.Replace("@@SUMA", TTotal.ToString("C"));
                html = html.Replace("@@SALDOCUENTAS", SaldoCuentas);
                html = html.Replace("@@SASALDOC", TSaldoCuentas.ToString("C"));
                html = html.Replace("@@SBANCOS", SaldoBancos);
                html = html.Replace("@@TLBANCOS", TotalSBancos.ToString("C"));
                html = html.Replace("@@RESULTADOB", ResultadoBalance);
                html = html.Replace("@@TRBALANCE", TRBalance.ToString("C"));
                html = html.Replace("@@DIFERENCIA", Diferencia);
                html = html.Replace("@@TDIF", TDif.ToString("C"));
                html = html.Replace("@@CLASIFICACION", Clasificacion);
                html = html.Replace("@@CVENCIDA", CVencida);
                html = html.Replace("@@TVENCIDA", TVencida.ToString("C"));
                html = html.Replace("@@NORMAL", Normal);
                html = html.Replace("@@TNormal", TNormal.ToString("C"));
                html = html.Replace("@@NRMAL2", Normal2);
                html = html.Replace("@@TNRMAL2", TNormal2.ToString("C"));
                html = html.Replace("@@BALANCEANTERIOR", BalanceAnterior.ToString("dd/MM/yyyy"));
                html = html.Replace("@@TANTERIOR", CantidadBalanceAnterior.ToString("C"));
                html = html.Replace("@@TCB", TCuentasBancos.ToString("C"));
                await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")), html);
                listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")));

                //PDF de Cancelaciones
                var html2 = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Balances", "Cancelaciones.html"));
                html2 = html2.Replace("@@SERVER", HttpContext.Request.Host.Value);
                html2 = html2.Replace("@@IMPRIMIO", PersonaActual.Nombre);
                html2 = html2.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                html2 = html2.Replace("@@NOMBRE_BALANCE", parData.NombreBalance.ToString());
                html2 = html2.Replace("@@DATOS_PRIMERA", CreditosCancelados);
                html2 = html2.Replace("@@DATOS_SEGUNDA", CreditosCancelados);
                await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "2_" + Count.ToString() + ".html")), html2);
                listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "2_" + Count.ToString() + ".html")));

                //PDF Desglose de Gastos
                var html3 = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Balances", "DesgloseGastos.html"));
                //EVALUA LA EMPRESA PARA ESCOGER EL LOGO -
                // html = (Producto == "Vale Confía - V.Quincenal") ?  html.Replace("@@IMG", "logo4.png") : html.Replace("@@IMG", "ps7fondo.png");
                html3 = html3.Replace("@@SERVER", HttpContext.Request.Host.Value);
                html3 = html3.Replace("@@IMPRIMIO", PersonaActual.Nombre);
                html3 = html3.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                html3 = html3.Replace("@@REGISTROS", Count.ToString());
                html3 = html3.Replace("@@NOMBRE_BALANCE", parData.NombreBalance.ToString());
                html3 = html3.Replace("@@DATOS_PRIMERAA", DesgloseDeGastos);
                html3 = html3.Replace("@@REGISTROS", Count.ToString());
                await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "3_" + Count.ToString() + ".html")), html3);
                listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "3_" + Count.ToString() + ".html")));

                //PDF Polizas Contratistas
                // var html4 = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Balances", "PolizasContratistas.html"));
                // //EVALUA LA EMPRESA PARA ESCOGER EL LOGO -
                // // html = (Producto == "Vale Confía - V.Quincenal") ?  html.Replace("@@IMG", "logo4.png") : html.Replace("@@IMG", "ps7fondo.png");
                // html4 = html4.Replace("@@SERVER", HttpContext.Request.Host.Value);
                // html4 = html4.Replace("@@IMPRIMIO", PersonaActual.Nombre);
                // html4 = html4.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                // html4 = html4.Replace("@@NOMBRE_BALANCE", parData.NombreBalance.ToString());
                // html4 = html4.Replace("@@DATOS_PRIMERA", PolizasContratistas);
                // await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "4_" + Count.ToString() + ".html")), html4);
                // listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "4_" + Count.ToString() + ".html")));

                Process p = new()
                {
                    StartInfo = new ProcessStartInfo(PDF.RUTA_WKHTMLTOPDF())
                };
                var ProductoObj = await ConexionBD.database.SingleOrDefaultByIdAsync<Productos>(nombreBalance.ProductoID);
                var listado_imagenes = new List<string>();

                var logo = ProductoObj.Logo;
                Guid g = Guid.NewGuid();
                var logoname = string.Concat("logo", "_" + g.ToString() + ".jpeg");
                await System.IO.File.WriteAllBytesAsync(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "LogoImg", logoname), logo);
                listado_imagenes.Add(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "LogoImg", logoname));

                string fechaActual = "\"Generado: " + DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss") + "\"";
                string logoUrl = $"https://{HttpContext.Request.Host.Value}/pdf/LogoImg/{logoname}";
                var headerPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "header-h.html");
                var headerHtml = $@"<!DOCTYPE HTML><html>
                        <body style='margin: auto; padding: 0; text-align: left; width: 100% !important;'>
                            <img style='max-height: 50px; max-width: 140px;display: block;margin-left: auto;margin-right: auto;' src='{logoUrl}' />
                        </body>
                    </html>";

                await System.IO.File.WriteAllTextAsync(headerPath, headerHtml);

                listado_imagenes.Add(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "header-h.html"));

                p.StartInfo.Arguments = string.Concat(
                    "--footer-left '", fechaActual,
                    " --footer-font-size 8 --footer-right [page]/[topage] -O landscape --encoding utf-8 --page-size Letter "
                    , "--header-html ", headerPath, " ",
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

                // Enviamos el PDF a la UI
                return new FileStreamResult(pdfStream, "application/pdf");


            }
            catch (Exception err)
            {
                return BadRequest(err.Message);
            }
        }


        [HttpPost]
        [Route("imprimir-balance")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Imprimir(ConfiaWebApi.PeticionesRest.Balances.GenerarBalances1.Add parData)

        {

            var sqlQueryDetalle = "SELECT ccb.NumeroCuenta 'CtaBanco', cc.Cuenta 'CtaContable', p.Producto, "
        + "	tm.CveMovimientoID 'TipoMovimiento', 	(tm.Factor * m.Importe) as 'SaldoSistema', m.Observaciones, "
        + "	COALESCE((SELECT ccb.NumeroCuenta FROM Bancos.CatalogoCuentasBancos ccb2 "
        + "	WHERE m.CuentaDestinoID = ccb2.CuentaBancoID), '--') 'CuentaDestino', m.FechaAfectacion, "
        + "  m.FechaCaptura FROM Bancos.Movimientos m JOIN Bancos.CatalogoCuentasBancos ccb "
        + "	ON m.CuentaID = ccb.CuentaBancoID JOIN Tesoreria.CuentasContables cc ON ccb.CuentaID = cc.CuentaID "
        + "	JOIN Creditos.Productos p ON m.ProductoId = p.ProductoID JOIN Bancos.TiposMovimientos tm"
        + "	ON m.TipoMovimientoID = tm.Id "
        + "	WHERE ccb.CuentaBancoID =@0"
        + "	AND m.PeriodoID = @1"
        + "	AND m.ProductoId =@2"
        + "	AND m.Estatus = 'A' ";

            var sqlQuerySinDetalle = "SELECT tm.Id, ccb.CuentaBancoID 'CtaBancoId', p.ProductoID, ccb.NumeroCuenta 'CtaBanco', cc.Cuenta 'CtaContable', p.Producto,"
        + "	tm.CveMovimientoID 'TipoMovimiento',sum(m.Importe * tm.Factor) 'SaldoSistema' "
        + "	FROM Bancos.Movimientos m JOIN Bancos.CatalogoCuentasBancos ccb "
        + "	ON m.CuentaID = ccb.CuentaBancoID JOIN Tesoreria.CuentasContables cc "
        + "	ON ccb.CuentaID = cc.CuentaID JOIN Creditos.Productos p ON m.ProductoId = p.ProductoID "
        + "	JOIN Bancos.TiposMovimientos tm	ON m.TipoMovimientoID = tm.Id "
        + "  WHERE ccb.CuentaBancoID = @0"
        + "	AND m.PeriodoID = @1"
        + "	AND m.ProductoId = @2"
        + "	AND m.Estatus = 'A'"
        + "	GROUP BY ccb.NumeroCuenta, cc.Cuenta, "
        + "	p.Producto, tm.CveMovimientoID, tm.Factor, tm.Id, p.ProductoID, ccb.CuentaBancoID";



            var sqlDetalleCuenta = "SELECT ccb.NumeroCuenta 'CtaBanco', cc.Cuenta 'CtaContable', p.Producto, "
        + "tm.CveMovimientoID 'TipoMovimiento', (tm.Factor * m.Importe) as 'SaldoSistema', m.Observaciones, "
        + " COALESCE((SELECT ccb.NumeroCuenta FROM Bancos.CatalogoCuentasBancos ccb2 "
        + " WHERE m.CuentaDestinoID = ccb2.CuentaBancoID), '--') 'CuentaDestino', m.FechaAfectacion, m.FechaCaptura "
        + " FROM Bancos.Movimientos m JOIN Bancos.CatalogoCuentasBancos ccb "
        + "	ON m.CuentaID = ccb.CuentaBancoID JOIN Tesoreria.CuentasContables cc ON ccb.CuentaID = cc.CuentaID "
        + "	JOIN Creditos.Productos p ON m.ProductoId = p.ProductoID JOIN Bancos.TiposMovimientos tm"
        + "	ON m.TipoMovimientoID = tm.Id WHERE ccb.CuentaBancoID =@0 AND m.PeriodoID = @1 AND (m.Estatus = 'A' or m.CatEstatusMovID = 1) ORDER BY p.Producto";

            var sqlSinDetalleCuenta = "SELECT ccb.NumeroCuenta 'CtaBanco', cc.Cuenta 'CtaContable', p.Producto, "
        + " tm.CveMovimientoID 'TipoMovimiento', (tm.Factor * m.Importe) as 'SaldoSistema', m.Observaciones, "
        + " COALESCE((SELECT ccb.NumeroCuenta FROM Bancos.CatalogoCuentasBancos ccb2 "
        + " WHERE m.CuentaDestinoID = ccb2.CuentaBancoID), '--') 'CuentaDestino', m.FechaAfectacion, m.FechaCaptura "
        + "FROM Bancos.Movimientos m JOIN Bancos.CatalogoCuentasBancos ccb "
        + "	ON m.CuentaID = ccb.CuentaBancoID JOIN Tesoreria.CuentasContables cc ON ccb.CuentaID = cc.CuentaID "
        + "	JOIN Creditos.Productos p ON m.ProductoId = p.ProductoID JOIN Bancos.TiposMovimientos tm "
        + " ON m.TipoMovimientoID = tm.Id WHERE ccb.CuentaBancoID =@0 AND m.PeriodoID = @1 "
        + "	AND m.Estatus = 'A' ORDEr BY p.Producto ";

            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                // var UsuarioActual = await ConexionBD.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
                var PersonaActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");
                var listado_archivos = new List<string>();
                var Count = 0;
                var cuentaBancoDetalleAnterior = "";
                var headerConDetalle = "";
                var DatosConDetalle = "";
                var DatosConDetalle2 = "";
                var registros_detalle = 0;
                var ctaBancoAnterior = "";
                var ctaContableAnterior = "";
                var productoAnterior = "";
                var tipoMovAnterior = "";
                CultureInfo myCI = new CultureInfo("en-US", false);


                if (parData.esReporteCuenta == 1)
                {
                    if (parData.incMovs == 1 && parData.incDetalle == 1)
                    {
                        headerConDetalle += "<tr>";
                        headerConDetalle += "<th class=\"text-center fs-6\" style=\"width: 9% !important;\">" + "Cuenta Banco" + "</th>";
                        headerConDetalle += "<th class=\"text-center fs-6\" style=\"width: 9% !important;\">" + "Cuenta Contable" + "</th>";
                        headerConDetalle += "<th class=\"text-center fs-6\" style=\"width: 9% !important;\">" + "Producto" + "</th>";
                        headerConDetalle += "<th class=\"text-center fs-6\" style=\"width: 9% !important;\">" + "Tipo Movimiento" + "</th>";
                        headerConDetalle += "<th class=\"text-center fs-6\" style=\"width: 9% !important;\">" + "Saldo Sistema" + "</th>";
                        headerConDetalle += "<th class=\"text-center fs-6\" style=\"width: 28% !important;\">" + "Observaciones" + "</th>";
                        headerConDetalle += "<th class=\"text-center fs-6\" style=\"width: 9% !important;\">" + "Cuenta Destino" + "</th>";
                        headerConDetalle += "<th class=\"text-center fs-6\" style=\"width: 9% !important;\">" + "Fecha Afectaci&oacute;n" + "</th>";
                        headerConDetalle += "<th class=\"text-center fs-6\" style=\"width: 9% !important;\">" + "Fecha Captura" + "</th>";
                        headerConDetalle += "</tr>";
                        foreach (var item in parData.cuentas_seleccionadas)
                        {
                            var res = await ConexionBD.database.QueryAsync<Balances3>(sqlDetalleCuenta, item.CtaBancoId, parData.periodoId).ToArrayAsync();
                            registros_detalle += 1;

                            foreach (var item2 in res)
                            {
                                Count += 1;
                                if (Count < 11)
                                {
                                    if (cuentaBancoDetalleAnterior.Equals(""))
                                    {
                                        DatosConDetalle += "<tr>";
                                        DatosConDetalle += DatoAnterior(ctaBancoAnterior, item2.CtaBanco);
                                        DatosConDetalle += DatoAnterior(ctaContableAnterior, item2.CtaContable);
                                        DatosConDetalle += DatoAnterior(productoAnterior, item2.Producto);
                                        DatosConDetalle += DatoAnterior(tipoMovAnterior, item2.TipoMovimiento);
                                        DatosConDetalle += "<td class=\"text-center fs-6\">" + item2.SaldoSistema.ToString("C", new CultureInfo("en-US")) + "</td>";
                                        DatosConDetalle += "<td class=\"text-center fs-6\">" + item2.Observaciones + "</td>";
                                        DatosConDetalle += "<td class=\"text-center fs-6\">" + item2.CuentaDestino + "</td>";
                                        DatosConDetalle += "<td class=\"text-center fs-6\">" + item2.FechaAfectacion + "</td>";
                                        DatosConDetalle += "<td class=\"text-center fs-6\">" + item2.FechaCaptura + "</td>";
                                        DatosConDetalle += "</tr>";
                                        ctaBancoAnterior = item2.CtaBanco.ToString();
                                        ctaContableAnterior = item2.CtaContable.ToString();
                                        productoAnterior = item2.Producto.ToString();
                                        tipoMovAnterior = item2.TipoMovimiento.ToString();
                                        cuentaBancoDetalleAnterior = item2.CtaBanco.ToString();
                                    }
                                    else
                                    {
                                        if (cuentaBancoDetalleAnterior.Equals(item2.CtaBanco))
                                        {
                                            DatosConDetalle += "<tr>";
                                            DatosConDetalle += DatoAnterior(ctaBancoAnterior, item2.CtaBanco);
                                            DatosConDetalle += DatoAnterior(ctaContableAnterior, item2.CtaContable);
                                            DatosConDetalle += DatoAnterior(productoAnterior, item2.Producto);
                                            DatosConDetalle += DatoAnterior(tipoMovAnterior, item2.TipoMovimiento);
                                            DatosConDetalle += "<td class=\"text-center fs-6\">" + item2.SaldoSistema.ToString("C", new CultureInfo("en-US")) + "</td>";
                                            DatosConDetalle += "<td class=\"text-center fs-6\">" + item2.Observaciones + "</td>";
                                            DatosConDetalle += "<td class=\"text-center fs-6\">" + item2.CuentaDestino + "</td>";
                                            DatosConDetalle += "<td class=\"text-center fs-6\">" + item2.FechaAfectacion + "</td>";
                                            DatosConDetalle += "<td class=\"text-center fs-6\">" + item2.FechaCaptura + "</td>";
                                            DatosConDetalle += "</tr>";
                                            ctaBancoAnterior = item2.CtaBanco.ToString();
                                            ctaContableAnterior = item2.CtaContable.ToString();
                                            productoAnterior = item2.Producto.ToString();
                                            tipoMovAnterior = item2.TipoMovimiento.ToString();
                                            cuentaBancoDetalleAnterior = item2.CtaBanco.ToString();
                                        }
                                        else
                                        {
                                            DatosConDetalle += "<tr style=\"background-color: gray\">";
                                            DatosConDetalle += "<td class=\"text-center fs-6\"></td>";
                                            DatosConDetalle += "<td class=\"text-center fs-6\"></td>";
                                            DatosConDetalle += "<td class=\"text-center fs-6\"></td>";
                                            DatosConDetalle += "<td class=\"text-center fs-6\"></td>";
                                            DatosConDetalle += "<td class=\"text-center fs-6\"></td>";
                                            DatosConDetalle += "<td class=\"text-center fs-6\"></td>";
                                            DatosConDetalle += "<td class=\"text-center fs-6\"></td>";
                                            DatosConDetalle += "<td class=\"text-center fs-6\"></td>";
                                            DatosConDetalle += "<td class=\"text-center fs-6\"></td>";
                                            DatosConDetalle += "</tr>";
                                            ctaBancoAnterior = "";
                                            ctaContableAnterior = "";
                                            productoAnterior = "";
                                            tipoMovAnterior = "";
                                            cuentaBancoDetalleAnterior = "";
                                            DatosConDetalle += "<tr>";
                                            DatosConDetalle += DatoAnterior(ctaBancoAnterior, item2.CtaBanco);
                                            DatosConDetalle += DatoAnterior(ctaContableAnterior, item2.CtaContable);
                                            DatosConDetalle += DatoAnterior(productoAnterior, item2.Producto);
                                            DatosConDetalle += DatoAnterior(tipoMovAnterior, item2.TipoMovimiento);
                                            DatosConDetalle += "<td class=\"text-center fs-6\">" + item2.SaldoSistema.ToString("C", new CultureInfo("en-US")) + "</td>";
                                            DatosConDetalle += "<td class=\"text-center fs-6\">" + item2.Observaciones + "</td>";
                                            DatosConDetalle += "<td class=\"text-center fs-6\">" + item2.CuentaDestino + "</td>";
                                            DatosConDetalle += "<td class=\"text-center fs-6\">" + item2.FechaAfectacion + "</td>";
                                            DatosConDetalle += "<td class=\"text-center fs-6\">" + item2.FechaCaptura + "</td>";
                                            DatosConDetalle += "</tr>";
                                            ctaBancoAnterior = item2.CtaBanco.ToString();
                                            ctaContableAnterior = item2.CtaContable.ToString();
                                            productoAnterior = item2.Producto.ToString();
                                            tipoMovAnterior = item2.TipoMovimiento.ToString();
                                            cuentaBancoDetalleAnterior = item2.CtaBanco.ToString();
                                        }
                                    }
                                }
                                else
                                {
                                    if (cuentaBancoDetalleAnterior.Equals(""))
                                    {
                                        DatosConDetalle2 += "<tr>";
                                        DatosConDetalle2 += DatoAnterior(ctaBancoAnterior, item2.CtaBanco);
                                        DatosConDetalle2 += DatoAnterior(ctaContableAnterior, item2.CtaContable);
                                        DatosConDetalle2 += DatoAnterior(productoAnterior, item2.Producto);
                                        DatosConDetalle2 += DatoAnterior(tipoMovAnterior, item2.TipoMovimiento);
                                        DatosConDetalle2 += "<td class=\"text-center fs-6\">" + item2.SaldoSistema.ToString("C", new CultureInfo("en-US")) + "</td>";
                                        DatosConDetalle2 += "<td class=\"text-center fs-6\">" + item2.Observaciones + "</td>";
                                        DatosConDetalle2 += "<td class=\"text-center fs-6\">" + item2.CuentaDestino + "</td>";
                                        DatosConDetalle2 += "<td class=\"text-center fs-6\">" + item2.FechaAfectacion + "</td>";
                                        DatosConDetalle2 += "<td class=\"text-center fs-6\">" + item2.FechaCaptura + "</td>";
                                        DatosConDetalle2 += "</tr>";
                                        ctaBancoAnterior = item2.CtaBanco.ToString();
                                        ctaContableAnterior = item2.CtaContable.ToString();
                                        productoAnterior = item2.Producto.ToString();
                                        tipoMovAnterior = item2.TipoMovimiento.ToString();
                                        cuentaBancoDetalleAnterior = item2.CtaBanco.ToString();
                                    }
                                    else
                                    {
                                        if (cuentaBancoDetalleAnterior.Equals(item2.CtaBanco))
                                        {
                                            DatosConDetalle2 += "<tr>";
                                            DatosConDetalle2 += DatoAnterior(ctaBancoAnterior, item2.CtaBanco);
                                            DatosConDetalle2 += DatoAnterior(ctaContableAnterior, item2.CtaContable);
                                            DatosConDetalle2 += DatoAnterior(productoAnterior, item2.Producto);
                                            DatosConDetalle2 += DatoAnterior(tipoMovAnterior, item2.TipoMovimiento);
                                            DatosConDetalle2 += "<td class=\"text-center fs-6\">" + item2.SaldoSistema.ToString("C", new CultureInfo("en-US")) + "</td>";
                                            DatosConDetalle2 += "<td class=\"text-center fs-6\">" + item2.Observaciones + "</td>";
                                            DatosConDetalle2 += "<td class=\"text-center fs-6\">" + item2.CuentaDestino + "</td>";
                                            DatosConDetalle2 += "<td class=\"text-center fs-6\">" + item2.FechaAfectacion + "</td>";
                                            DatosConDetalle2 += "<td class=\"text-center fs-6\">" + item2.FechaCaptura + "</td>";
                                            DatosConDetalle2 += "</tr>";
                                            ctaBancoAnterior = item2.CtaBanco.ToString();
                                            ctaContableAnterior = item2.CtaContable.ToString();
                                            productoAnterior = item2.Producto.ToString();
                                            tipoMovAnterior = item2.TipoMovimiento.ToString();
                                            cuentaBancoDetalleAnterior = item2.CtaBanco.ToString();
                                        }
                                        else
                                        {
                                            DatosConDetalle2 += "<tr style=\"background-color: gray\">";
                                            DatosConDetalle2 += "<td class=\"text-center fs-6\"></td>";
                                            DatosConDetalle2 += "<td class=\"text-center fs-6\"></td>";
                                            DatosConDetalle2 += "<td class=\"text-center fs-6\"></td>";
                                            DatosConDetalle2 += "<td class=\"text-center fs-6\"></td>";
                                            DatosConDetalle2 += "<td class=\"text-center fs-6\"></td>";
                                            DatosConDetalle2 += "<td class=\"text-center fs-6\"></td>";
                                            DatosConDetalle2 += "<td class=\"text-center fs-6\"></td>";
                                            DatosConDetalle2 += "<td class=\"text-center fs-6\"></td>";
                                            DatosConDetalle2 += "<td class=\"text-center fs-6\"></td>";
                                            DatosConDetalle2 += "</tr>";
                                            ctaBancoAnterior = "";
                                            ctaContableAnterior = "";
                                            productoAnterior = "";
                                            tipoMovAnterior = "";
                                            cuentaBancoDetalleAnterior = "";
                                            DatosConDetalle2 += "<tr>";
                                            DatosConDetalle2 += DatoAnterior(ctaBancoAnterior, item2.CtaBanco);
                                            DatosConDetalle2 += DatoAnterior(ctaContableAnterior, item2.CtaContable);
                                            DatosConDetalle2 += DatoAnterior(productoAnterior, item2.Producto);
                                            DatosConDetalle2 += DatoAnterior(tipoMovAnterior, item2.TipoMovimiento);
                                            DatosConDetalle2 += "<td class=\"text-center fs-6\">" + item2.SaldoSistema.ToString("C", new CultureInfo("en-US")) + "</td>";
                                            DatosConDetalle2 += "<td class=\"text-center fs-6\">" + item2.Observaciones + "</td>";
                                            DatosConDetalle2 += "<td class=\"text-center fs-6\">" + item2.CuentaDestino + "</td>";
                                            DatosConDetalle2 += "<td class=\"text-center fs-6\">" + item2.FechaAfectacion + "</td>";
                                            DatosConDetalle2 += "<td class=\"text-center fs-6\">" + item2.FechaCaptura + "</td>";
                                            DatosConDetalle2 += "</tr>";
                                            ctaBancoAnterior = item2.CtaBanco.ToString();
                                            ctaContableAnterior = item2.CtaContable.ToString();
                                            productoAnterior = item2.Producto.ToString();
                                            tipoMovAnterior = item2.TipoMovimiento.ToString();
                                            cuentaBancoDetalleAnterior = item2.CtaBanco.ToString();
                                        }

                                    }
                                }
                            }
                        }
                    }

                    if (parData.incMovs == 1 && parData.incDetalle == 2)
                    {

                        headerConDetalle += "<tr>";
                        headerConDetalle += "<th class=\"text-center fs-6\">" + "Cuenta Banco" + "</th>";
                        headerConDetalle += "<th class=\"text-center fs-6\">" + "Cuenta Contable" + "</th>";
                        headerConDetalle += "<th class=\"text-center fs-6\">" + "Producto" + "</th>";
                        headerConDetalle += "<th class=\"text-center fs-6\">" + "Tipo Mov" + "</th>";
                        headerConDetalle += "<th class=\"text-center fs-6\">" + "Saldo Sistema" + "</th>";
                        headerConDetalle += "</tr>";
                        foreach (var item in parData.cuentas_seleccionadas)
                        {
                            var res = await ConexionBD.database.QueryAsync<Balances2>(sqlSinDetalleCuenta, item.CtaBancoId, parData.periodoId).ToArrayAsync();
                            registros_detalle += 1;
                            foreach (var item2 in res)
                            {
                                Count += 1;
                                if (Count < 18)
                                {
                                    if (cuentaBancoDetalleAnterior.Equals(""))
                                    {
                                        DatosConDetalle += "<tr>";
                                        DatosConDetalle += DatoAnterior(ctaBancoAnterior, item2.CtaBanco);
                                        DatosConDetalle += DatoAnterior(ctaContableAnterior, item2.CtaContable);
                                        DatosConDetalle += DatoAnterior(productoAnterior, item2.Producto);
                                        DatosConDetalle += DatoAnterior(tipoMovAnterior, item2.TipoMovimiento);
                                        DatosConDetalle += "<td class=\"text-center fs-6\">" + item2.SaldoSistema.ToString("C", new CultureInfo("en-US")) + "</td>";
                                        DatosConDetalle += "</tr>";
                                        ctaBancoAnterior = item2.CtaBanco.ToString();
                                        ctaContableAnterior = item2.CtaContable.ToString();
                                        productoAnterior = item2.Producto.ToString();
                                        tipoMovAnterior = item2.TipoMovimiento.ToString();
                                        cuentaBancoDetalleAnterior = item2.CtaBanco.ToString();
                                    }
                                    else
                                    {
                                        if (cuentaBancoDetalleAnterior.Equals(item2.CtaBanco))
                                        {
                                            DatosConDetalle += "<tr>";
                                            DatosConDetalle += DatoAnterior(ctaBancoAnterior, item2.CtaBanco);
                                            DatosConDetalle += DatoAnterior(ctaContableAnterior, item2.CtaContable);
                                            DatosConDetalle += DatoAnterior(productoAnterior, item2.Producto);
                                            DatosConDetalle += DatoAnterior(tipoMovAnterior, item2.TipoMovimiento);
                                            DatosConDetalle += "<td class=\"text-center fs-6\">" + item2.SaldoSistema.ToString("C", new CultureInfo("en-US")) + "</td>";
                                            DatosConDetalle += "</tr>";
                                            ctaBancoAnterior = item2.CtaBanco.ToString();
                                            ctaContableAnterior = item2.CtaContable.ToString();
                                            productoAnterior = item2.Producto.ToString();
                                            tipoMovAnterior = item2.TipoMovimiento.ToString();
                                            cuentaBancoDetalleAnterior = item2.CtaBanco.ToString();
                                        }
                                        else
                                        {
                                            DatosConDetalle += "<tr style=\"background-color: gray\">";
                                            DatosConDetalle += "<td class=\"text-center fs-6\"></td>";
                                            DatosConDetalle += "<td class=\"text-center fs-6\"></td>";
                                            DatosConDetalle += "<td class=\"text-center fs-6\"></td>";
                                            DatosConDetalle += "<td class=\"text-center fs-6\"></td>";
                                            DatosConDetalle += "<td class=\"text-center fs-6\"></td>";
                                            DatosConDetalle += "</tr>";
                                            DatosConDetalle += "<tr>";
                                            DatosConDetalle += DatoAnterior(ctaBancoAnterior, item2.CtaBanco);
                                            DatosConDetalle += DatoAnterior(ctaContableAnterior, item2.CtaContable);
                                            DatosConDetalle += DatoAnterior(productoAnterior, item2.Producto);
                                            DatosConDetalle += DatoAnterior(tipoMovAnterior, item2.TipoMovimiento);
                                            DatosConDetalle += "<td class=\"text-center fs-6\">" + item2.SaldoSistema.ToString("C", new CultureInfo("en-US")) + "</td>";
                                            DatosConDetalle += "</tr>";
                                            ctaBancoAnterior = item2.CtaBanco.ToString();
                                            ctaContableAnterior = item2.CtaContable.ToString();
                                            productoAnterior = item2.Producto.ToString();
                                            tipoMovAnterior = item2.TipoMovimiento.ToString();
                                            cuentaBancoDetalleAnterior = item2.CtaBanco.ToString();
                                        }

                                    }
                                }
                                else
                                {
                                    if (cuentaBancoDetalleAnterior.Equals(""))
                                    {
                                        DatosConDetalle2 += "<tr>";
                                        DatosConDetalle2 += DatoAnterior(ctaBancoAnterior, item2.CtaBanco);
                                        DatosConDetalle2 += DatoAnterior(ctaContableAnterior, item2.CtaContable);
                                        DatosConDetalle2 += DatoAnterior(productoAnterior, item2.Producto);
                                        DatosConDetalle2 += DatoAnterior(tipoMovAnterior, item2.TipoMovimiento);
                                        DatosConDetalle2 += "<td class=\"text-center fs-6\">" + item2.SaldoSistema.ToString("C", new CultureInfo("en-US")) + "</td>";
                                        DatosConDetalle2 += "</tr>";
                                        ctaBancoAnterior = item2.CtaBanco.ToString();
                                        ctaContableAnterior = item2.CtaContable.ToString();
                                        productoAnterior = item2.Producto.ToString();
                                        tipoMovAnterior = item2.TipoMovimiento.ToString();
                                        cuentaBancoDetalleAnterior = item2.CtaBanco.ToString();
                                    }
                                    else
                                    {
                                        if (cuentaBancoDetalleAnterior.Equals(item2.CtaBanco))
                                        {
                                            DatosConDetalle2 += "<tr>";
                                            DatosConDetalle2 += DatoAnterior(ctaBancoAnterior, item2.CtaBanco);
                                            DatosConDetalle2 += DatoAnterior(ctaContableAnterior, item2.CtaContable);
                                            DatosConDetalle2 += DatoAnterior(productoAnterior, item2.Producto);
                                            DatosConDetalle2 += DatoAnterior(tipoMovAnterior, item2.TipoMovimiento);
                                            DatosConDetalle2 += "<td class=\"text-center fs-6\">" + item2.SaldoSistema.ToString("C", new CultureInfo("en-US")) + "</td>";
                                            DatosConDetalle2 += "</tr>";
                                            ctaBancoAnterior = item2.CtaBanco.ToString();
                                            ctaContableAnterior = item2.CtaContable.ToString();
                                            productoAnterior = item2.Producto.ToString();
                                            tipoMovAnterior = item2.TipoMovimiento.ToString();
                                            cuentaBancoDetalleAnterior = item2.CtaBanco.ToString();
                                        }
                                        else
                                        {
                                            DatosConDetalle2 += "<tr style=\"background-color: gray\">";
                                            DatosConDetalle2 += "<td class=\"text-center fs-6\"></td>";
                                            DatosConDetalle2 += "<td class=\"text-center fs-6\"></td>";
                                            DatosConDetalle2 += "<td class=\"text-center fs-6\"></td>";
                                            DatosConDetalle2 += "<td class=\"text-center fs-6\"></td>";
                                            DatosConDetalle2 += "<td class=\"text-center fs-6\"></td>";
                                            DatosConDetalle2 += "</tr>";
                                            DatosConDetalle2 += "<tr>";
                                            DatosConDetalle2 += DatoAnterior(ctaBancoAnterior, item2.CtaBanco);
                                            DatosConDetalle2 += DatoAnterior(ctaContableAnterior, item2.CtaContable);
                                            DatosConDetalle2 += DatoAnterior(productoAnterior, item2.Producto);
                                            DatosConDetalle2 += DatoAnterior(tipoMovAnterior, item2.TipoMovimiento);
                                            DatosConDetalle2 += "<td class=\"text-center fs-6\">" + item2.SaldoSistema.ToString("C", new CultureInfo("en-US")) + "</td>";
                                            DatosConDetalle2 += "</tr>";
                                            ctaBancoAnterior = item2.CtaBanco.ToString();
                                            ctaContableAnterior = item2.CtaContable.ToString();
                                            productoAnterior = item2.Producto.ToString();
                                            tipoMovAnterior = item2.TipoMovimiento.ToString();
                                            cuentaBancoDetalleAnterior = item2.CtaBanco.ToString();
                                        }
                                    }
                                }
                            }
                        }
                    }

                    if (parData.incMovs == 2)
                    {
                        headerConDetalle += "<tr>";
                        headerConDetalle += "<th class=\"text-center fs-6\">" + "Cuenta Banco" + "</th>";
                        headerConDetalle += "<th class=\"text-center fs-6\">" + "Cuenta Contable" + "</th>";
                        headerConDetalle += "<th class=\"text-center fs-6\">" + "Producto" + "</th>";
                        headerConDetalle += "<th class=\"text-center fs-6\">" + "Saldo Sistema" + "</th>";
                        headerConDetalle += "</tr>";
                        foreach (var item in parData.cuentas_seleccionadas)
                        {
                            var res = await ConexionBD.database.QueryAsync<Balances1>("EXEC Balances.spGeneraBalance2 @0, @1, 0, 0, 1", parData.periodoId, item.CtaBancoId).ToArrayAsync();
                            registros_detalle += 1;
                            foreach (var item2 in res)
                            {

                                Count += 1;
                                if (Count < 18)
                                {
                                    if (ctaBancoAnterior.Equals(""))
                                    {
                                        DatosConDetalle += "<tr>";
                                        DatosConDetalle += CuentaSeparador(ctaBancoAnterior, item2.CtaBanco);
                                        DatosConDetalle += DatoAnterior(ctaContableAnterior, item2.CtaContable);
                                        DatosConDetalle += DatoAnterior(productoAnterior, item2.Producto);
                                        DatosConDetalle += "<td class=\"text-center fs-6\">" + item2.SaldoSistema.ToString("C", new CultureInfo("en-US")) + "</td>";
                                        DatosConDetalle += "</tr>";
                                        ctaBancoAnterior = item2.CtaBanco.ToString();
                                        ctaContableAnterior = item2.CtaContable.ToString();
                                        productoAnterior = item2.Producto.ToString();
                                    }
                                    else
                                    {
                                        if (ctaBancoAnterior.Equals(item2.CtaBanco))
                                        {
                                            DatosConDetalle += "<tr>";
                                            DatosConDetalle += CuentaSeparador(ctaBancoAnterior, item2.CtaBanco);
                                            DatosConDetalle += DatoAnterior(ctaContableAnterior, item2.CtaContable);
                                            DatosConDetalle += DatoAnterior(productoAnterior, item2.Producto);
                                            DatosConDetalle += "<td class=\"text-center fs-6\">" + item2.SaldoSistema.ToString("C", new CultureInfo("en-US")) + "</td>";
                                            DatosConDetalle += "</tr>";
                                            ctaBancoAnterior = item2.CtaBanco.ToString();
                                            ctaContableAnterior = item2.CtaContable.ToString();
                                            productoAnterior = item2.Producto.ToString();
                                        }
                                        else
                                        {
                                            DatosConDetalle += "<tr style=\"background-color: gray\">";
                                            DatosConDetalle += "<td class=\"text-center fs-6\"></td>";
                                            DatosConDetalle += "<td class=\"text-center fs-6\"></td>";
                                            DatosConDetalle += "<td class=\"text-center fs-6\"></td>";
                                            DatosConDetalle += "<td class=\"text-center fs-6\"></td>";
                                            DatosConDetalle += "</tr>";
                                            ctaBancoAnterior = "";
                                            ctaContableAnterior = "";
                                            productoAnterior = "";
                                            DatosConDetalle += "<tr>";
                                            DatosConDetalle += "<tr>";
                                            DatosConDetalle += CuentaSeparador(ctaBancoAnterior, item2.CtaBanco);
                                            DatosConDetalle += DatoAnterior(ctaContableAnterior, item2.CtaContable);
                                            DatosConDetalle += DatoAnterior(productoAnterior, item2.Producto);
                                            DatosConDetalle += "<td class=\"text-center fs-6\">" + item2.SaldoSistema.ToString("C", new CultureInfo("en-US")) + "</td>";
                                            DatosConDetalle += "</tr>";
                                            ctaBancoAnterior = item2.CtaBanco.ToString();
                                            ctaContableAnterior = item2.CtaContable.ToString();
                                            productoAnterior = item2.Producto.ToString();
                                        }

                                    }

                                }
                                else
                                {
                                    DatosConDetalle2 += "<tr>";
                                    DatosConDetalle += CuentaSeparador(ctaBancoAnterior, item2.CtaBanco);
                                    DatosConDetalle2 += DatoAnterior(ctaContableAnterior, item2.CtaContable);
                                    DatosConDetalle2 += DatoAnterior(productoAnterior, item2.Producto);
                                    DatosConDetalle2 += "<td class=\"text-center fs-6\">" + item2.SaldoSistema.ToString("C", new CultureInfo("en-US")) + "</td>";
                                    DatosConDetalle2 += "</tr>";
                                    ctaBancoAnterior = item2.CtaBanco.ToString();
                                    ctaContableAnterior = item2.CtaContable.ToString();
                                    productoAnterior = item2.Producto.ToString();
                                }
                            }
                        }
                    }
                }
                else
                {
                    if (parData.incMovs == 1 && parData.incDetalle == 1)
                    {

                        headerConDetalle += "<tr>";
                        headerConDetalle += "<th class=\"text-center fs-6\">" + "Cuenta Banco" + "</th>";
                        headerConDetalle += "<th class=\"text-center fs-6\">" + "Cuenta Contable" + "</th>";
                        headerConDetalle += "<th class=\"text-center fs-6\">" + "Producto" + "</th>";
                        headerConDetalle += "<th class=\"text-center fs-6\">" + "Tipo Mov" + "</th>";
                        headerConDetalle += "<th class=\"text-center fs-6\">" + "Saldo Sistema" + "</th>";
                        headerConDetalle += "<th class=\"text-center fs-6 \">" + "Observaciones" + "</th>";
                        headerConDetalle += "<th class=\"text-center fs-6\">" + "Cuenta Destino" + "</th>";
                        headerConDetalle += "<th class=\"text-center fs-6\">" + "Fecha Afectaci&oacute;n" + "</th>";
                        headerConDetalle += "<th class=\"text-center fs-6\">" + "Fecha Captura" + "</th>";
                        headerConDetalle += "</tr>";
                        foreach (var item in parData.productos_seleccionados)
                        {
                            var cuentaBancoId = item.cuentaBancoId;
                            var periodoId = item.periodoId;
                            var productoId = item.productoId;
                            var res = await ConexionBD.database.QueryAsync<Balances3>(sqlQueryDetalle, item.cuentaBancoId, item.periodoId, item.productoId).ToArrayAsync();
                            registros_detalle += 1;
                            foreach (var item2 in res)
                            {
                                Count += 1;
                                if (Count < 13)
                                {
                                    DatosConDetalle += "<tr>";
                                    DatosConDetalle += DatoAnterior(ctaBancoAnterior, item2.CtaBanco);
                                    DatosConDetalle += DatoAnterior(ctaContableAnterior, item2.CtaContable);
                                    DatosConDetalle += DatoAnterior(productoAnterior, item2.Producto);
                                    DatosConDetalle += DatoAnterior(tipoMovAnterior, item2.TipoMovimiento);
                                    DatosConDetalle += "<td class=\"text-center fs-6\">" + item2.SaldoSistema.ToString("C", new CultureInfo("en-US")) + "</td>";
                                    DatosConDetalle += "<td class=\"text-center fs-6\">" + item2.Observaciones + "</td>";
                                    DatosConDetalle += "<td class=\"text-center fs-6\">" + item2.CuentaDestino + "</td>";
                                    DatosConDetalle += "<td class=\"text-center fs-6\">" + item2.FechaAfectacion + "</td>";
                                    DatosConDetalle += "<td class=\"text-center fs-6\">" + item2.FechaCaptura + "</td>";
                                    DatosConDetalle += "</tr>";
                                    ctaBancoAnterior = item2.CtaBanco.ToString();
                                    ctaContableAnterior = item2.CtaContable.ToString();
                                    productoAnterior = item2.Producto.ToString();
                                    tipoMovAnterior = item2.TipoMovimiento.ToString();
                                }
                                else
                                {
                                    {
                                        DatosConDetalle2 += "<tr>";
                                        DatosConDetalle2 += DatoAnterior(ctaBancoAnterior, item2.CtaBanco);
                                        DatosConDetalle2 += DatoAnterior(ctaContableAnterior, item2.CtaContable);
                                        DatosConDetalle2 += DatoAnterior(productoAnterior, item2.Producto);
                                        DatosConDetalle2 += DatoAnterior(tipoMovAnterior, item2.TipoMovimiento);
                                        DatosConDetalle2 += "<td class=\"text-center fs-6\">" + item2.SaldoSistema.ToString("C", new CultureInfo("en-US")) + "</td>";
                                        DatosConDetalle2 += "<td class=\"text-center fs-6\">" + item2.Observaciones + "</td>";
                                        DatosConDetalle2 += "<td class=\"text-center fs-6\">" + item2.CuentaDestino + "</td>";
                                        DatosConDetalle2 += "<td class=\"text-center fs-6\">" + item2.FechaAfectacion + "</td>";
                                        DatosConDetalle2 += "<td class=\"text-center fs-6\">" + item2.FechaCaptura + "</td>";
                                        DatosConDetalle2 += "</tr>";
                                        ctaBancoAnterior = item2.CtaBanco.ToString();
                                        ctaContableAnterior = item2.CtaContable.ToString();
                                        productoAnterior = item2.Producto.ToString();
                                        tipoMovAnterior = item2.TipoMovimiento.ToString();

                                    }

                                }
                            }

                        }
                    }

                    if (parData.incMovs == 1 && parData.incDetalle == 2)
                    {

                        headerConDetalle += "<tr>";
                        headerConDetalle += "<th class=\"text-center fs-6\">" + "Cuenta Banco" + "</th>";
                        headerConDetalle += "<th class=\"text-center fs-6\">" + "Cuenta Contable" + "</th>";
                        headerConDetalle += "<th class=\"text-center fs-6\">" + "Producto" + "</th>";
                        headerConDetalle += "<th class=\"text-center fs-6\">" + "Tipo Mov" + "</th>";
                        headerConDetalle += "<th class=\"text-center fs-6\">" + "Saldo Sistema" + "</th>";
                        headerConDetalle += "</tr>";
                        foreach (var item in parData.productos_seleccionados)
                        {
                            var res = await ConexionBD.database.QueryAsync<Balances2>(sqlQuerySinDetalle, item.cuentaBancoId, item.periodoId, item.productoId).ToArrayAsync();
                            registros_detalle += 1;
                            foreach (var item2 in res)
                            {
                                Count += 1;
                                if (Count < 13)
                                {
                                    DatosConDetalle += "<tr>";
                                    DatosConDetalle += DatoAnterior(ctaBancoAnterior, item2.CtaBanco);
                                    DatosConDetalle += DatoAnterior(ctaContableAnterior, item2.CtaContable);
                                    DatosConDetalle += DatoAnterior(productoAnterior, item2.Producto);
                                    DatosConDetalle += DatoAnterior(tipoMovAnterior, item2.TipoMovimiento);
                                    DatosConDetalle += "<td class=\"text-center fs-6\">" + item2.SaldoSistema.ToString("C", new CultureInfo("en-US")) + "</td>";
                                    DatosConDetalle += "</tr>";
                                    ctaBancoAnterior = item2.CtaBanco.ToString();
                                    ctaContableAnterior = item2.CtaContable.ToString();
                                    productoAnterior = item2.Producto.ToString();
                                    tipoMovAnterior = item2.TipoMovimiento.ToString();
                                }
                                else
                                {
                                    DatosConDetalle2 += "<tr>";
                                    DatosConDetalle2 += DatoAnterior(ctaBancoAnterior, item2.CtaBanco);
                                    DatosConDetalle2 += DatoAnterior(ctaContableAnterior, item2.CtaContable);
                                    DatosConDetalle2 += DatoAnterior(productoAnterior, item2.Producto);
                                    DatosConDetalle2 += DatoAnterior(tipoMovAnterior, item2.TipoMovimiento);
                                    DatosConDetalle2 += "<td class=\"text-center fs-6\">" + item2.SaldoSistema.ToString("C", new CultureInfo("en-US")) + "</td>";
                                    DatosConDetalle2 += "</tr>";
                                    ctaBancoAnterior = item2.CtaBanco.ToString();
                                    ctaContableAnterior = item2.CtaContable.ToString();
                                    productoAnterior = item2.Producto.ToString();
                                    tipoMovAnterior = item2.TipoMovimiento.ToString();
                                }
                            }
                        }
                    }

                    if (parData.incMovs == 2)
                    {
                        headerConDetalle += "<tr>";
                        headerConDetalle += "<th class=\"text-center fs-6\">" + "Cuenta Banco" + "</th>";
                        headerConDetalle += "<th class=\"text-center fs-6\">" + "Cuenta Contable" + "</th>";
                        headerConDetalle += "<th class=\"text-center fs-6\">" + "Producto" + "</th>";
                        headerConDetalle += "<th class=\"text-center fs-6\">" + "Saldo Sistema" + "</th>";
                        headerConDetalle += "</tr>";

                        if (parData.productos_seleccionados.Count > 1)
                        {
                            var res = await ConexionBD.database.QueryAsync<Balances1>("EXEC Balances.spGeneraBalance2 @0, @1, 0, 0, 1", parData.productos_seleccionados[0].periodoId, parData.productos_seleccionados[0].cuentaBancoId).ToArrayAsync();
                            registros_detalle += 1;

                            Count += 1;
                            foreach (var item2 in res)
                            {
                                if (Count < 13)
                                {
                                    DatosConDetalle += "<tr>";
                                    DatosConDetalle += DatoAnterior(ctaBancoAnterior, item2.CtaBanco);
                                    DatosConDetalle += DatoAnterior(ctaContableAnterior, item2.CtaContable);
                                    DatosConDetalle += DatoAnterior(productoAnterior, item2.Producto);
                                    DatosConDetalle += "<td class=\"text-center fs-6\">" + item2.SaldoSistema.ToString("C", new CultureInfo("en-US")) + "</td>";
                                    DatosConDetalle += "</tr>";
                                    ctaBancoAnterior = item2.CtaBanco.ToString();
                                    ctaContableAnterior = item2.CtaContable.ToString();
                                    productoAnterior = item2.Producto.ToString();

                                }
                                else
                                {
                                    DatosConDetalle2 += "<tr>";
                                    DatosConDetalle2 += DatoAnterior(ctaBancoAnterior, item2.CtaBanco);
                                    DatosConDetalle2 += DatoAnterior(ctaContableAnterior, item2.CtaContable);
                                    DatosConDetalle2 += DatoAnterior(productoAnterior, item2.Producto);
                                    DatosConDetalle2 += "<td class=\"text-center fs-6\">" + item2.SaldoSistema.ToString("C", new CultureInfo("en-US")) + "</td>";
                                    DatosConDetalle2 += "</tr>";
                                    ctaBancoAnterior = item2.CtaBanco.ToString();
                                    ctaContableAnterior = item2.CtaContable.ToString();
                                    productoAnterior = item2.Producto.ToString();
                                }

                            }
                        }




                    }

                }

                if (parData.incMovs == 1 && parData.incDetalle == 1)
                {
                    if (Count > 9)
                    {
                        var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Balances", "Caratula.html"));
                        html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                        html = html.Replace("@@IMPRIMIO", PersonaActual.Nombre);
                        html = html.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                        html = html.Replace("@@NOMBRE_BALANCE", parData.nombreBalance.ToString());
                        html = html.Replace("@@HEADER_DETALLE", headerConDetalle);
                        html = html.Replace("@@DATOS_DETALLE", DatosConDetalle);
                        await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")), html);
                        listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")));

                        html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Balances", "Detalle.html"));
                        html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                        html = html.Replace("@@DATOS_DETALLE2", DatosConDetalle2);
                        html = html.Replace("@@HEADER_DETALLE", headerConDetalle);

                        await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "2_" + Count.ToString() + ".html")), html);
                        listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "2_" + Count.ToString() + ".html")));

                        // Ejecutamos el proceso de wkhtmltopdf

                    }
                    else
                    {
                        var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Balances", "Caratula.html"));
                        html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                        html = html.Replace("@@IMPRIMIO", PersonaActual.Nombre);
                        html = html.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                        html = html.Replace("@@NOMBRE_BALANCE", parData.nombreBalance.ToString());
                        html = html.Replace("@@HEADER_DETALLE", headerConDetalle);
                        html = html.Replace("@@DATOS_DETALLE", DatosConDetalle);
                        await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "2_" + Count.ToString() + ".html")), html);
                        listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "2_" + Count.ToString() + ".html")));

                    }

                }
                else
                {
                    if (Count > 17)
                    {
                        var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Balances", "Caratula.html"));
                        html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                        html = html.Replace("@@IMPRIMIO", PersonaActual.Nombre);
                        html = html.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                        html = html.Replace("@@NOMBRE_BALANCE", parData.nombreBalance.ToString());
                        html = html.Replace("@@HEADER_DETALLE", headerConDetalle);
                        html = html.Replace("@@DATOS_DETALLE", DatosConDetalle);
                        await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")), html);
                        listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")));

                        html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Balances", "Detalle.html"));
                        html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                        html = html.Replace("@@DATOS_DETALLE2", DatosConDetalle2);
                        html = html.Replace("@@HEADER_DETALLE", headerConDetalle);

                        await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "2_" + Count.ToString() + ".html")), html);
                        listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "2_" + Count.ToString() + ".html")));
                    }
                    else
                    {
                        var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Balances", "Caratula.html"));
                        html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                        html = html.Replace("@@IMPRIMIO", PersonaActual.Nombre);
                        html = html.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                        html = html.Replace("@@NOMBRE_BALANCE", parData.nombreBalance.ToString());
                        html = html.Replace("@@HEADER_DETALLE", headerConDetalle);
                        html = html.Replace("@@DATOS_DETALLE", DatosConDetalle);
                        await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "2_" + Count.ToString() + ".html")), html);
                        listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "2_" + Count.ToString() + ".html")));
                    }

                }

                Process p = new()
                {
                    StartInfo = new ProcessStartInfo(PDF.RUTA_WKHTMLTOPDF())
                };
                p.StartInfo.Arguments = string.Concat("--footer-center [page]/[topage] -O landscape --encoding utf-8", " ",
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
                // Eliminamos el PDF
                System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));

                // Enviamos el PDF a la UI
                return new FileStreamResult(pdfStream, "application/pdf");


            }
            catch (Exception err)
            {
                return BadRequest(err.Message);
            }

        }


        [HttpPost]
        [Route("imprimir-balance-periodo")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ImprimirDesdePeriodos(PeticionesRest.SOMA.Periodos.Get parData)

        {
            try
            {
                var resBalances = await ConexionBD.database.QueryAsync<Balance2>("WHERE PeriodoID=@0", parData.PeriodoID).ToArrayAsync();

                var balance = resBalances.OrderBy(x => x.BalanceID).Last();

                var cuentas = await ConexionBD.database.QueryAsync<BalanceResumen2>("WHERE BalanceID=@0", balance.BalanceID).ToArrayAsync();
                var productos_seleccionados = new ArrayList();
                var cuentasEnviar = new ArrayList();
                foreach (var item in cuentas)
                {
                    var cuentasBalance = new
                    {
                        CtaBancoId = item.CtaBancoId
                    };
                    cuentasEnviar.Add(cuentasBalance);
                }
                var aregloEnviar = new
                {
                    periodoId = parData.PeriodoID,
                    incMovs = 1,
                    incDetalle = 1,
                    nombreBalance = balance.NombreBalance,
                    esReporteCuenta = 1,
                    cuentas_seleccionadas = cuentasEnviar,
                    productos_seleccionados = productos_seleccionados

                };
                await ConexionBD.Destroy();
                return Ok(aregloEnviar);
            }
            catch (Exception err)
            {
                await ConexionBD.Destroy();
                return BadRequest(err.Message);
            }
        }

        [HttpPost]
        [Route("generar-balanza-comprobacion")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GenerarBalanza(ConfiaWebApi.PeticionesRest.Balances.GenerarBalanza.Add parData)

        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            // var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            // var PersonaActual = await ConexionBD.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.ID).FirstOrDefaultAsync();

            try
            {
                ConexionBD.database.BeginTransaction();
                var res = await ConexionBD.database.QueryAsync<BalanzaDeComprobacion>("EXEC Balances.spBalanzaComprobacion2 1, @0, @1, @2, @3", UsuarioActual.Nombre, parData.FechaInicio, parData.FechaFin, parData.ProductoID).ToArrayAsync();
                ConexionBD.database.CompleteTransaction();
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception err)
            {
                ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest(err.Message);
            }
        }

        [HttpGet]
        [Route("detalle-balanza/{ctaBancoId}/{balanzaID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> DetalleBalanza(int ctaBancoId, int balanzaID)
        {
            try
            {
                ConexionBD.database.BeginTransaction();
                var res = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Balances.BalanzaDetalle>("WHERE CuentaBancoID=@0 AND BalanzaID=@1", ctaBancoId, balanzaID).ToArrayAsync();
                ConexionBD.database.CompleteTransaction();
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception err)
            {
                ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest(err.Message);
            }

        }



        [HttpGet]
        [Route("obtener-balanzas")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerBalanzas()
        {
            try
            {
                ConexionBD.database.BeginTransaction();
                var res = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Balances.Balanza>();
                ConexionBD.database.CompleteTransaction();
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception err)
            {
                ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest(err.Message);
            }

        }


        [HttpGet]
        [Route("productos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerProductos()

        {
            try
            {
                ConexionBD.database.BeginTransaction();
                var query = "SELECT ProductoID, Producto, EmpresaNombre from Creditos.ProductosVW order by ProductoID desc";
                var res = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.ProductosVW>(query).ToArrayAsync();
                ConexionBD.database.CompleteTransaction();
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception err)
            {
                ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest(err.Message);
            }

        }

        [HttpGet]
        [Route("obtener-producto-balanza/{BalanzaID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerProductoBalanza(int BalanzaID)

        {
            try
            {
                ConexionBD.database.BeginTransaction();
                var query = "SELECT Producto from Balances.Balanza where BalanzaID=@0";
                var res = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Balances.Balanza>(query, BalanzaID).SingleOrDefaultAsync();
                ConexionBD.database.CompleteTransaction();
                await ConexionBD.Destroy();
                return Ok(res.Producto);
            }
            catch (Exception err)
            {
                ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest(err.Message);
            }

        }


        [HttpPost]
        [Route("imprimir-balanza")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ImprimiBalanza(PeticionesRest.SOMA.Balances.Balanza parData)

        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                // var UsuarioActual = await ConexionBD.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
                var PersonaActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");
                var listado_archivos = new List<string>();
                var Count = 0;
                var BalanzaID = "";
                var headerConDetalle = "";
                CultureInfo myCI = new CultureInfo("en-US", false);
                BalanzaID = parData.BalanzaID.ToString();

                var resFechas = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Balances.Balanza>("WHERE BalanzaID =@0", parData.BalanzaID).SingleOrDefaultAsync();

                var FechaInicio = resFechas.FechaInicio.ToString("dd/MM/yyyy");
                var FechaFin = resFechas.FechaFin.ToString("dd/MM/yyyy");
                var RangoFechas = "" + FechaInicio + "-" + FechaFin + "";

                var res = await ConexionBD.database.QueryAsync<BalanzaDeComprobacion>("EXEC Balances.spBalanzaComprobacion2 2, @0, '', '', 1, @1", PersonaActual.Nombre, parData.BalanzaID).ToArrayAsync();

                if (parData.incMovs == 1 && parData.incDetalle == 1)
                {
                    foreach (var item in res)
                    {
                        headerConDetalle += "<table class=\"table table-sm\" style=\"border: #ffffff;\">";
                        headerConDetalle += "<thead>";
                        headerConDetalle += "<tr>";
                        headerConDetalle += "<th colspan=\"5\" class=\"fs-6\" style=\"vertical-align: center !important; text-align: start !important; background: #CDCDCD !important; width: 100% !important;\"><p><strong>&nbsp; " + item.CtaBanco.ToString() + "</strong></p></th>";
                        headerConDetalle += "</tr>";
                        headerConDetalle += "</thead>";
                        headerConDetalle += " <tbody>";

                        var resDetalleBalanza = await ConexionBD.database.QueryAsync<MovsBalanza>("select Factor, TipoMovimientoDesc, SaldoImporte , Observaciones from Balances.BalanzaDetalle bd where BalanzaID = @0 and CuentaBancoID=@1 order by TipoMovimientoDesc", item.BalanzaID, item.CuentaBancoID).ToArrayAsync();
                        foreach (var item2 in resDetalleBalanza)
                        {
                            headerConDetalle += "<tr>";
                            headerConDetalle += "<td colspan=\"3\" class=\"text-center fs-6\" style=\"width: 70% !important;\"><p><strong>Mov: </strong>" + item2.TipoMovimientoDesc.ToString() + " <strong>Observaciones: </strong>" + item2.Observaciones.ToString() + "</p></td>";
                            headerConDetalle += "<td colspan=\"2\" class=\"text-center fs-6\" style=\"width: 30% !important;\"><p><strong>Importe: </strong>" + item2.SaldoImporte.ToString("C", new CultureInfo("en-US")) + "</p></td>";
                            headerConDetalle += "</tr>";
                        }

                        headerConDetalle += "<tr style=\"border-top: 1px solid black !important;\">";
                        headerConDetalle += "<td colspan=\"1\" class=\"text-center fs-6\" style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 20% !important;\"><strong>" + "Saldos: " + "</strong></td>";
                        headerConDetalle += "<td colspan=\"1\" class=\"text-center fs-6\" style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 20% !important;\"><strong>" + "Mov. Deudor: " + item.DeudorMov.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                        headerConDetalle += "<td colspan=\"1\" class=\"text-center fs-6\" style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 20% !important;\"><strong>" + " Mov. Acreedor:  " + item.AcreedorMov.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                        headerConDetalle += "<td colspan=\"1\" class=\"text-center fs-6\" style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 20% !important;\"><strong>" + "Deudor Saldo: " + item.DeudorSaldo.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                        headerConDetalle += "<td colspan=\"1\" class=\"text-center fs-6\" style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 20% !important;\"><strong>" + " Acreedor Saldo: " + item.AcreedorSaldo.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                        headerConDetalle += "</tr>";
                        headerConDetalle += " </tbody >";
                        headerConDetalle += " </table >";
                    }
                }
                if (parData.incMovs == 1 && parData.incDetalle == 2)
                {
                    foreach (var item in res)
                    {
                        headerConDetalle += "<table class=\"table table-sm\" style=\"border: #ffffff;\">";
                        headerConDetalle += "<thead>";
                        headerConDetalle += "<tr>";
                        headerConDetalle += "<th colspan=\"5\" class=\"fs-6\" style=\"vertical-align: center !important; text-align: start !important; background: #CDCDCD !important; width: 100% !important;\"><p><strong>&nbsp; Cuenta: " + item.CtaBanco.ToString() + "</strong></p></th>";
                        headerConDetalle += "</tr>";
                        headerConDetalle += "</thead>";
                        headerConDetalle += " <tbody>";
                        var resDetalleBalanza = await ConexionBD.database.QueryAsync<SaldosPorBalanza>("EXEC Balances.spSaldosPorMovBalanza @0, @1", item.BalanzaID, item.CuentaBancoID).ToArrayAsync();
                        foreach (var item2 in resDetalleBalanza)
                        {
                            headerConDetalle += "<tr>";
                            headerConDetalle += "<td colspan=\"2\" class=\"text-center fs-6\" style=\"width: 50% !important;\">" + item2.TipoMovimientoDesc.ToString() + "</td>";
                            headerConDetalle += "<td colspan=\"3\" class=\"text-center fs-6\" style=\"width: 50% !important;\">" + item2.Saldo.ToString("C", new CultureInfo("en-US")) + "</td>";
                            headerConDetalle += "</tr>";
                        }

                        headerConDetalle += "<tr style=\"border-top: 1px solid black !important;\">";
                        headerConDetalle += "<td colspan=\"1\" class=\"text-center fs-6\" style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 20% !important;\"><strong>" + "Saldos: " + "</strong></td>";
                        headerConDetalle += "<td colspan=\"1\" class=\"text-center fs-6\" style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 20% !important;\"><strong>" + "Mov. Deudor: " + item.DeudorMov.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                        headerConDetalle += "<td colspan=\"1\" class=\"text-center fs-6\" style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 20% !important;\"><strong>" + " Mov. Acreedor:  " + item.AcreedorMov.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                        headerConDetalle += "<td colspan=\"1\" class=\"text-center fs-6\" style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 20% !important;\"><strong>" + "Deudor Saldo: " + item.DeudorSaldo.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                        headerConDetalle += "<td colspan=\"1\" class=\"text-center fs-6\" style=\"border-top: 1px solid black !important; background: #DFDFDF !important; width: 20% !important;\"><strong>" + " Acreedor Saldo: " + item.AcreedorSaldo.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                        headerConDetalle += "</tr>";

                        headerConDetalle += " </tbody >";
                        headerConDetalle += " </table >";
                    }
                }

                if (parData.incMovs == 2)
                {
                    decimal TotalMovD = 0;
                    decimal TotalMovA = 0;
                    decimal TotalSalD = 0;
                    decimal TotalSalA = 0;
                    headerConDetalle += "<table class=\"table table-sm\" style=\"border: #ffffff;\">";
                    headerConDetalle += "<thead>";
                    headerConDetalle += "<tr>";
                    headerConDetalle += "<th class=\"text-center fs-6\" style=\" background: #CDCDCD !important; width: 20% !important;\"><p><strong>Cuenta</strong></p></th>";
                    headerConDetalle += "<th class=\"text-center fs-6\" style=\" background: #CDCDCD !important; width: 20% !important;\"><p><strong>Mov. Deudor</strong></p></th>";
                    headerConDetalle += "<th class=\"text-center fs-6\" style=\" background: #CDCDCD !important; width: 20% !important;\"><p><strong>Mov. Acreedor</strong></p></th>";
                    headerConDetalle += "<th class=\"text-center fs-6\" style=\" background: #CDCDCD !important; width: 20% !important;\"><p><strong>Saldo Deudor</strong></p></th>";
                    headerConDetalle += "<th class=\"text-center fs-6\" style=\" background: #CDCDCD !important; width: 20% !important;\"><p><strong>Saldo Acreedor</strong></p></th>";
                    headerConDetalle += "</tr>";
                    headerConDetalle += "</thead>";
                    headerConDetalle += " <tbody>";

                    foreach (var item in res)
                    {
                        TotalMovD += item.DeudorMov;
                        TotalMovA += item.AcreedorMov;
                        TotalSalA += item.AcreedorSaldo;
                        TotalSalD += item.DeudorSaldo;
                        headerConDetalle += "<tr>";
                        headerConDetalle += "<td class=\"text-center fs-6\" style=\"width: 20% !important;\">" + item.CtaBanco.ToString() + "</td>";
                        headerConDetalle += "<td class=\"text-center fs-6\" style=\"width: 20% !important;\">" + item.DeudorMov.ToString("C", new CultureInfo("en-US")) + "</td>";
                        headerConDetalle += "<td class=\"text-center fs-6\" style=\"width: 20% !important;\">" + item.AcreedorMov.ToString("C", new CultureInfo("en-US")) + "</td>";
                        headerConDetalle += "<td class=\"text-center fs-6\" style=\"width: 20% !important;\">" + item.DeudorSaldo.ToString("C", new CultureInfo("en-US")) + "</td>";
                        headerConDetalle += "<td class=\"text-center fs-6\" style=\"width: 20% !important;\">" + item.AcreedorSaldo.ToString("C", new CultureInfo("en-US")) + "</td>";
                        headerConDetalle += "</tr>";
                    }
                    headerConDetalle += "<tr>";
                    headerConDetalle += "<td class=\"text-center fs-6\" style=\"background: #DFDFDF !important; width: 20% !important;\"><strong>Total: </strong></td>";
                    headerConDetalle += "<td class=\"text-center fs-6\" style=\"background: #DFDFDF !important; width: 20% !important;\"><strong>" + TotalMovD.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                    headerConDetalle += "<td class=\"text-center fs-6\" style=\"background: #DFDFDF !important; width: 20% !important;\"><strong>" + TotalMovA.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                    headerConDetalle += "<td class=\"text-center fs-6\" style=\"background: #DFDFDF !important; width: 20% !important;\"><strong>" + TotalSalD.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                    headerConDetalle += "<td class=\"text-center fs-6\" style=\"background: #DFDFDF !important; width: 20% !important;\"><strong>" + TotalSalA.ToString("C", new CultureInfo("en-US")) + "</strong></td>";
                    headerConDetalle += "</tr>";
                    headerConDetalle += " </tbody >";
                    headerConDetalle += " </table >";
                }

                var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Balanzas", "Caratula.html"));
                html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                html = html.Replace("@@TABLA", headerConDetalle);
                html = html.Replace("@@BALANZAID", BalanzaID);
                html = html.Replace("@@FECHAS", RangoFechas);
                html = html.Replace("@@IMPRIMIO", PersonaActual.Nombre);
                html = html.Replace("@@PRODUCTO", resFechas.Producto);
                html = html.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));

                await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")), html);
                listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")));

                Process p = new()
                {
                    StartInfo = new ProcessStartInfo(PDF.RUTA_WKHTMLTOPDF())
                };
                p.StartInfo.Arguments = string.Concat("--footer-center [page]/[topage] -O landscape --encoding utf-8", " ",
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
                // Eliminamos el PDF
                System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
                // Enviamos el PDF a la UI
                return new FileStreamResult(pdfStream, "application/pdf");
                //return Ok(res);
            }
            catch (System.Exception)
            {

                throw;
            }
        }

        [HttpPost]
        [Route("imprimir-balance2")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Imprimir3(ConfiaWebApi.PeticionesRest.Balances.GenerarBalances1.GenerarPDF2 parData)

        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;

                var UsuarioActual = await ConexionBD.database
                    .QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName)
                    .FirstOrDefaultAsync();
                var PersonaActual = await ConexionBD.database
                    .QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName)
                    .FirstOrDefaultAsync();


                var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");
                var listado_archivos = new List<string>();
                var Count = 0;



                /***  INICIALIZAMOS EL DOCUMENTO HTML  ***/
                var balanceHtml1 = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Balances3.0", "Principal.html"));

                /***  ELEMENTOS HTML  ***/
                string __separador__ = "<div style='height: 2px; background-color: black; width: 50%; margin-top: 2px; margin-left: 50%; margin-bottom: 2px;'></div>";
                string __separadorLight__ = "<div style='height: 1px; background-color: black; width: 100%; margin-top: 2px; margin-bottom: 2px;'></div>";
                string __separadorCantidad__ = "<div style='border-bottom: 1px solid black; margin-top: 2px; margin-bottom: 2px;'></div>";
                string _w100 = "width: 100%;";
                string style33 = "class='d-inline' style='font-size: 14px; width: 33.33%; text-align: center;'";
                string style20 = "class='d-inline' style='font-size: 14px; width: 20%; text-align: center;'";
                string labelsStyle = "class='d-inline' style='font-size: 14px; width: 80%;'";
                string valuesStyle = "class='d-inline' style='font-size: 14px; width: 20%; text-align: right; vertical-align: bottom;'";
                string labelTotalStyle = "class='d-inline' style='font-weight: bold; font-size: 14px; width: 80%; text-align: right;'";
                string valueTotalStyle = "class='d-inline' style='font-weight: bold; font-size: 14px; width: 20%; text-align: right;'";
                string totalFont = "class='d-inline' style='font-weight: bold; font-size: 14px;'";
                string __estiloBordes__2 = "border: 1px solid black !important; border-collapse: collapse; font-size: 9px; background: #FFFFFF !important;";


                int Periodo = 0;
                DateTime FechaApertura = DateTime.Now;
                DateTime? FechaCierre = DateTime.Now;
                int Accion = 0; //Indicamos si el periodo está abierto o cerrado para los traspasos

                //Obtener saldo anterior
                var BalanceAnterior = await ConexionBD.database
                    .QueryAsync<Balance2>("SELECT * FROM Balances.BalGetUltimoSaldoBalance(@0) bgusb", parData.BalanceSeleccionado)
                    .SingleOrDefaultAsync();


                decimal ImporteBalanceAnt = BalanceAnterior == null ? 0 : BalanceAnterior.SaldoTotalBalance;
                string FechaBalanceAnt = (BalanceAnterior == null ? new DateTime() : BalanceAnterior.FechaCreacion).ToString("dd/MM/yyyy");

                //Obtener nombre del balance
                var nombreBalance = await ConexionBD.database
                    .QueryAsync<dynamic>("SELECT * FROM Balances.BalancesProductos where BalanceID = @0", parData.BalanceSeleccionado)
                    .SingleOrDefaultAsync();

                if (nombreBalance == null)
                    throw new Exception("No se encontró el ID del balance");


                balanceHtml1 = balanceHtml1.Replace("@@ImporteBalanceAnt", ImporteBalanceAnt.ToString("C"));
                balanceHtml1 = balanceHtml1.Replace("@@FechaBalanceAnt", FechaBalanceAnt);
                balanceHtml1 = balanceHtml1.Replace("@@NOMBRE_BALANCE", parData.BalanceTempID + " - " + nombreBalance.NombreBalance);


                CultureInfo myCI = new CultureInfo("en-US", false);
                parData.Accion = 1;


                /***  SON TODAS LAS CUENTAS QUE HAY EN SISTEMA  ***/
                var CuentasList = await ConexionBD.database.QueryAsync<CtasCuentas>("EXEC Balances.pa_BancosBalanceM @0", parData.BalanceSeleccionado).ToArrayAsync();

                var spData = new { BalanceVinculado = parData.BalanceSeleccionado, BalanceTempID = parData.BalanceTempID };
                string spVariables = "@BalanceVinculado, @BalanceTempID";

                /***  DESPUES DE ESO OBTENEMOS TODOS LOS VALORES QUE VAMOS A ITERAR (DEBIDO A QUE ES MENOS PESADO QUE HACERLO DENTRO DEL FOREACH)  ***/
                var CobranzaList = await ConexionBD.database.QueryAsync<CtasCobranza>($"EXEC Balances.pa_GetCobranzaCuentasM {spVariables}", spData)
                    .ToArrayAsync();
                var DniList = await ConexionBD.database.QueryAsync<CtasDni>($"EXEC Balances.pa_DepositosDNIM {spVariables}", spData)
                    .ToArrayAsync();
                var DepositoList = await ConexionBD.database.QueryAsync<CtasDeposito>($"EXEC Balances.pa_DepositosCuentasM {spVariables}", spData)
                    .ToArrayAsync();
                var RetirosList = await ConexionBD.database.QueryAsync<CtasRetiros>($"EXEC Balances.pa_DesgloseGastosM {spVariables}", spData)
                    .ToArrayAsync();
                var CancelacionesList = await ConexionBD.database.QueryAsync<BalCancelaciones>($"EXEC Balances.pa_CreditosCanceladosM {spVariables}", spData)
                    .ToArrayAsync();
                var DesembolsosList = await ConexionBD.database.QueryAsync<CtasDesembolso>($"EXEC Balances.pa_DesembolsoValesM {spVariables}", spData)
                    .ToArrayAsync();
                var NuevosPrestamosList = await ConexionBD.database.QueryAsync<CtasNuevosPrestamos>($"EXEC Balances.pa_NuevasVentasM {spVariables}", spData)
                    .ToArrayAsync();
                var TienditaList = await ConexionBD.database.QueryAsync<CtasTiendita>($"EXEC Balances.pa_TienditaM {spVariables}", spData)
                    .ToArrayAsync();
                var ProteccionesList = await ConexionBD.database.QueryAsync<CtasProtecciones>($"EXEC Balances.pa_USVM {spVariables}", spData)
                    .ToArrayAsync();
                var ComisionesList = await ConexionBD.database.QueryAsync<SucursalComisiones>($"EXEC Balances.pa_MaximasMinimasComisiones {spVariables}", spData)
                    .ToArrayAsync();
                var TasasSegurosList = await ConexionBD.database.QueryAsync<TasasSeguros>($"EXEC Balances.pa_MaximasMinimasTasasSeguros {spVariables}", spData)
                    .ToArrayAsync();
                var TotalesCuentasList = await ConexionBD.database.QueryAsync<TotalesCuentas>($"EXEC Balances.pa_SumaTotalesCuentas {spVariables}", spData)
                    .ToArrayAsync();
                var CobranzaCfList = await ConexionBD.database.QueryAsync<CobranzaCF>($"EXEC Balances.pa_TotalCarteraClienteFinal {spVariables}", spData)
                    .ToArrayAsync();


                var CancelacionesListDes = await ConexionBD.database.QueryAsync<BalanceCreditosCancelados>("EXEC Balances.pa_CreditosCancelados @0", parData.BalanceSeleccionado)
                    .ToArrayAsync();

                var DesgloseGastosList = await ConexionBD.database.QueryAsync<BalanceDesgloseGastos2>("EXEC Tesoreria.pa_GetDesgloseGastosBalance @0, @1", parData.BalanceSeleccionado, 0)
                    .ToArrayAsync();


                //OBTENEMOS LAS CUENTAS Y AGRUPAMOS POR SUCURSAL PARA OPTIMIZAR LA ITERACIÓN DE LAS CUENTAS
                var CuentasPorSucursal = CuentasList.GroupBy(prev => prev.Sucursal).OrderBy(reg => reg.Key);

                decimal TOTAL_BALANCE = 0;

                //Inicio PDF Principal
                if (CuentasList.Length > 0)
                {
                    string CuentaHTML = "";
                    foreach (var cuentasDeSucursal in CuentasPorSucursal)
                    {

                        var comisionSucursal = ComisionesList.Where(cob => cob.Sucursal == cuentasDeSucursal.Key)
                            .ToArray();

                        string comisionSucursalHTML = "";

                        if (comisionSucursal.Length > 0)
                        {
                            string max = (comisionSucursal[0].MaxComision * 100).ToString("0.##");
                            string min = (comisionSucursal[0].MinComision * 100).ToString("0.##");
                            // comisionSucursalHTML = $@": MAX: {max}% - MIN: {min}%";
                            comisionSucursalHTML = $@": MAX: {max}%";
                        }

                        /*** MOSTRAMOS EL NOMBRE DE LA SUCURSAL ***/
                        CuentaHTML += $@"
                    <div class='no-salto' style='margin-top: 15px; justify-content: center;'>
                        <h3 style='font-size: 18px; font-weight: bold; width: 100%; text-align: center;'> 
                            {cuentasDeSucursal.Key} {comisionSucursalHTML}
                        </h3>
                        <div style='border: 2px solid black; padding: 3px'>
                        ";

                        /***  SON TODAS LAS CUENTAS QUE SE MUESTRAN DEL LADO IZQUIERDO  ***/
                        foreach (var cuentaBanco in cuentasDeSucursal)
                        {
                            string cuentaId = cuentaBanco.CuentaBancoID.ToString();
                            string cuentaNombre = cuentaBanco.DescripcionCuenta;
                            string cuentaSaldoInicial = cuentaBanco.SaldoInicial.ToString("C");

                            var cuentaCobranza = CobranzaList.Where(cob => cob.CuentaID == cuentaBanco.CuentaBancoID)
                                .ToArray();
                            var cuentaDni = DniList.Where(cob => cob.CuentaID == cuentaBanco.CuentaBancoID)
                                .ToArray();
                            var cuentaDepositos = DepositoList.Where(cob => cob.CuentaID == cuentaBanco.CuentaBancoID)
                                .ToArray();
                            var cuentaRetiros = RetirosList.Where(cob => cob.CuentaID == cuentaBanco.CuentaBancoID)
                                .ToArray();
                            var cuentaDesembolsos = DesembolsosList.Where(cob => cob.CuentaID == cuentaBanco.CuentaBancoID)
                                .ToArray();
                            var _totales_ = TotalesCuentasList.Where(cob => cob.CuentaID == cuentaBanco.CuentaBancoID)
                                .ToArray();

                            string totalCuenta = _totales_.Length > 0 ? _totales_.Sum(t => t.Importe).ToString("C") : "$0.0";

                            /***  INICIO LISTADO CUENTA  ***/
                            CuentaHTML += $@"
                            <div>
                                <div>
                                    <div>{__estiloBordes__2}
                                        <div style='font-size: 14px; font-weight: bold; text-align: start;'> {cuentaNombre} : {cuentaId} </div>
                                        {__separadorLight__}
                                    </div>
                                    <table style='width: 100%;'>
                                        <tr style='justify-content: space-between;'>
                                            <td {labelsStyle}>SALDO ANTERIOR</td>
                                            <td {valuesStyle}>{cuentaSaldoInicial}</td>
                                        </tr>
                                        <tr style='justify-content: space-between;'>
                                            <td {labelTotalStyle}>SUBTOTAL SALDO ANT:</td>
                                            <td {valueTotalStyle}>
                                                <div style='padding-left: 10px;'>{__separadorCantidad__}</div>
                                                <div>{cuentaSaldoInicial}</div>
                                            </td>
                                        </tr>";


                            /***  INICIA COBRANZA DE VALES Y CLIENTES  ***/
                            if (cuentaCobranza.Length > 0)
                            {
                                var cobranza = cuentaCobranza[0];
                                string importeCobranzaTotal = (cobranza.ImporteVales + cobranza.ImporteCliente).ToString("C");

                                CuentaHTML += $@"
                                    <tr style='justify-content: space-between;'>
                                        <td class='d-inline' style='font-weight: bold; font-size: 14px; width: 80%;'>COBRANZA</td>
                                        <td {valuesStyle}>{"."}</td>
                                    </tr>";

                                /***  LISTADO COBRANZA VALES  ***/
                                if (cobranza.TieneImporteVales)
                                {
                                    string importeCobranzaVales = cobranza.ImporteVales.ToString("C");
                                    CuentaHTML += $@"
                                    <tr style='justify-content: space-between;'>
                                        <td {labelsStyle}>COBRANZA DE VALES</td>
                                        <td {valuesStyle}>{importeCobranzaVales}</td>
                                    </tr>
                                    <tr style='justify-content: space-between;'>
                                        <td {labelTotalStyle}>SUBTOTAL COBRANZA DE VALES:</td>
                                        <td {valueTotalStyle}>
                                            <div style='padding-left: 10px;'>{__separadorCantidad__}</div>
                                            <div>{importeCobranzaVales}</div>
                                        </td>
                                    </tr>";
                                }

                                /***  LISTADO COBRANZA CLIENTE FINAL  ***/
                                if (cobranza.TieneImporteCliente)
                                {
                                    string importeCobranzaClienteF = cobranza.ImporteCliente.ToString("C");
                                    CuentaHTML += $@"
                                    <tr style='justify-content: space-between;'>
                                        <td {labelsStyle}>COBRANZA CLIENTE FINAL</td>
                                        <td {valuesStyle}>{importeCobranzaClienteF}</td>
                                    </tr>
                                    <tr style='justify-content: space-between;'>
                                        <td {labelTotalStyle}>SUBTOTAL COBRANZA CLIENTE FINAL:</td>
                                        <td {valueTotalStyle}>
                                            <div style='padding-left: 10px;'>{__separadorCantidad__}</div>
                                            <div>{importeCobranzaClienteF}</div>
                                        </td>
                                    </tr>";
                                }

                                CuentaHTML += $@"
                                    <tr style='justify-content: space-between;'>
                                        <td {labelTotalStyle}>TOTAL COBRANZA RECIBIDA</td>
                                        <td {valueTotalStyle}>
                                            <div style='padding-left: 10px;'>{__separadorCantidad__}</div>
                                            <div>{importeCobranzaTotal}</div>
                                        </td>
                                    </tr>";
                            }


                            /***  INICIA EL LISTADO DE LOS DNI  ***/
                            if (cuentaDni.Length > 0)
                            {
                                string importeDniTotal = cuentaDni.Select(dni => dni.Importe)
                                    .Aggregate((decimal lat, decimal curr) => lat + curr)
                                    .ToString("C");


                                CuentaHTML += $@"
                                    <tr style='justify-content: space-between;'>
                                        <td class='d-inline' style='font-weight: bold; font-size: 14px; width: 80%;'>DNIS</td>
                                        <td {valuesStyle}>{"."}</td>
                                    </tr>";

                                /***  LISTADO DNI  ***/
                                foreach (var dni in cuentaDni)
                                {
                                    string importeDni = dni.Importe.ToString("C");
                                    CuentaHTML += $@"
                                    <tr style='justify-content: space-between;'>
                                        <td {labelsStyle}>{dni.Descripcion}</td>
                                        <td {valuesStyle}>{importeDni}</td>
                                    </tr>";
                                }

                                CuentaHTML += $@"
                                    <tr style='justify-content: space-between;'>
                                        <td {labelTotalStyle}> SUBTOTAL DNIS </td>
                                        <td {valueTotalStyle}>
                                            <div style='padding-left: 10px;'>{__separadorCantidad__}</div>
                                            <div>{importeDniTotal}</div>
                                        </td>
                                    </tr>";
                            }

                            /***  INICIA EL LISTADO DE LOS DEPOSITOS  ***/
                            if (cuentaDepositos.Length > 0)
                            {
                                string importeDepositoTotal = cuentaDepositos.Select(dni => dni.Importe)
                                    .Aggregate((decimal lat, decimal curr) => lat + curr)
                                    .ToString("C");


                                CuentaHTML += $@"
                                    <tr style='justify-content: space-between;'>
                                        <td class='d-inline' style='font-weight: bold; font-size: 14px; width: 80%;'>DEPOSITOS</td>
                                        <td {valuesStyle}>{"."}</td>
                                    </tr>";

                                /***  LISTADO DEPOSITOS  ***/
                                foreach (var deposito in cuentaDepositos)
                                {
                                    string importeDeposito = deposito.Importe.ToString("C");
                                    string fechaDeposito = deposito.FechaAfectacion?.ToString("dd/MM/yyyy");

                                    CuentaHTML += $@"
                                    <tr style='justify-content: space-between;'>
                                        <td {labelsStyle}>{fechaDeposito} {deposito.Descripcion}</td>
                                        <td {valuesStyle}>{importeDeposito}</td>
                                    </tr>";
                                }

                                CuentaHTML += $@"
                                    <tr style='justify-content: space-between;'>
                                        <td {labelTotalStyle}> SUBTOTAL DEPOSITOS </td>
                                        <td {valueTotalStyle}>
                                            <div style='padding-left: 10px;'>{__separadorCantidad__}</div>
                                            <div>{importeDepositoTotal}</div>
                                        </td>
                                    </tr>";
                            }

                            /***  INICIA EL LISTADO DE LOS DESEMBOLSOS  ***/
                            if (cuentaDesembolsos.Length > 0)
                            {
                                string importeDesembolsosTotal = cuentaDesembolsos.Select(dsm => dsm.Importe)
                                    .Aggregate((decimal lat, decimal curr) => lat + curr)
                                    .ToString("C");


                                CuentaHTML += $@"
                                    <tr style='justify-content: space-between;'>
                                        <td class='d-inline' style='font-weight: bold; font-size: 14px; width: 80%;'>DESEMBOLSOS</td>
                                        <td {valuesStyle}>{"."}</td>
                                    </tr>
                                    <tr style='justify-content: space-between;'>
                                        <td {labelsStyle}>DESEMBOLSOS</td>
                                        <td {valuesStyle}>{importeDesembolsosTotal}</td>
                                    </tr>
                                    <tr style='justify-content: space-between;'>
                                        <td {labelTotalStyle}> SUBTOTAL DESEMBOLSOS </td>
                                        <td {valueTotalStyle}>
                                            <div style='padding-left: 10px;'>{__separadorCantidad__}</div>
                                            <div>{importeDesembolsosTotal}</div>
                                        </td>
                                    </tr>
                                ";
                            }

                            /***  INICIA EL LISTADO DE LOS RETIROS  ***/
                            if (cuentaRetiros.Length > 0)
                            {
                                string importeRetirosTotal = cuentaRetiros.Select(ret => ret.Importe)
                                    .Aggregate((decimal lat, decimal curr) => lat + curr)
                                    .ToString("C");


                                CuentaHTML += $@"
                                    <tr style='justify-content: space-between;'>
                                        <td class='d-inline' style='font-weight: bold; font-size: 14px; width: 80%;'>RETIROS</td>
                                        <td {valuesStyle}>{"."}</td>
                                    </tr>";

                                /***  LISTADO RETIROS  ***/
                                foreach (var retiros in cuentaRetiros)
                                {
                                    string importeRetiros = retiros.Importe.ToString("C");
                                    // string fechaRetiros = retiros.FechaAfectacion.ToString("dd/MM/yyyy");
                                    CuentaHTML += $@"
                                    <tr style='justify-content: space-between;'>
                                        <td {labelsStyle}>{retiros.Descripcion}</td>
                                        <td {valuesStyle}>{importeRetiros}</td>
                                    </tr>";
                                }

                                CuentaHTML += $@"
                                    <tr style='justify-content: space-between;'>
                                        <td {labelTotalStyle}> SUBTOTAL RETIROS </td>
                                        <td {valueTotalStyle}>
                                            <div style='padding-left: 10px;'>{__separadorCantidad__}</div>
                                            <div>{importeRetirosTotal}</div>
                                        </td>
                                    </tr>";
                            }


                            /***  FIN LISTADO CUENTA ***/
                            CuentaHTML += $@"
                                    </table>
                                </div>
                                {__separador__}
                                <table style='width: 100%;'>
                                    <tr style='justify-content: space-between;'>
                                        <td {labelTotalStyle}>TOTAL:</td>
                                        <td {valueTotalStyle}>
                                            <div>{totalCuenta}</div>
                                        </td>
                                    </tr>
                                </table>
                            </div>";
                        }


                        CuentaHTML += $@"
                        </div>
                    </div>";
                    }

                    decimal TotalCuentasBancosD = TotalesCuentasList.Length > 0 ? TotalesCuentasList.Select(a => a.Importe).Aggregate((a, b) => a + b) : 0;
                    string TotalCuentasBancos = TotalCuentasBancosD.ToString("C");
                    // TOTAL_BALANCE += TotalCuentasBancosD;

                    balanceHtml1 = balanceHtml1.Replace("@@CUENTA", CuentaHTML);
                    balanceHtml1 = balanceHtml1.Replace("@@TBANCOS", TotalCuentasBancos);



                    /***  SON TODOS LOS MOVIMIENTOS QUE SE MUESTRAN DEL LADO DERECHO ***/
                    TOTAL_BALANCE = SumaListasBal(TOTAL_BALANCE, CancelacionesList);
                    balanceHtml1 = BalanceGenerarDesglose(balanceHtml1, CancelacionesList, "@@ImporteCancelaciones", "@@RowsCancelaciones");

                    TOTAL_BALANCE = SumaListasBal(TOTAL_BALANCE, DepositoList);

                    string DepositosHTML_R = $@"
                        <tr style='justify-content: space-between;'>
                            <td {labelsStyle}'>DEPOSITOS TOTALES</td>
                            <td {valuesStyle}'>{SumaListasBal(0, DepositoList).ToString("C")}</td>
                        </tr>
                    ";
                    balanceHtml1 = balanceHtml1.Replace("@@RowsDepositos", DepositosHTML_R);
                    balanceHtml1 = balanceHtml1.Replace("@@ImporteDepositos", SumaListasBal(0, DepositoList).ToString("C"));

                    // balanceHtml1 = BalanceGenerarDesglose(balanceHtml1, DepositoList, "@@ImporteDepositos", "@@RowsDepositos");

                    /***  SE CALCULAN LOS CANJES DE VALES ***/

                    string DesembolsosHTML = DesembolsosList.Length > 0 ? DesembolsosList.Select(reg =>
                    {
                        if (reg.TipoCreditoID == 2) return reg;
                        reg.TipoCredito = "CANJE FISICO";
                        return reg;
                    }).GroupBy(reg => reg.TipoCredito).Select(reg =>
                    {
                        string importe = reg.Select(dsm => dsm.Importe).Aggregate((decimal lat, decimal curr) => lat + curr)
                            .ToString("C");

                        return $@"
                            <tr style='justify-content: space-between;'>
                                <td {labelsStyle}>{reg.Key}</td>
                                <td {valuesStyle}>{importe}</td>
                            </tr>
                        ";
                    }).Aggregate((lat, curr) => lat + curr) : "";

                    decimal importeCanjeValesD = DesembolsosList.Length > 0 ? DesembolsosList.Select(dsm => dsm.Importe)
                        .Aggregate((decimal lat, decimal curr) => lat + curr) : 0;
                    string importeCanjeVales = importeCanjeValesD.ToString("C");

                    string importeCanjeValesInteres = (DesembolsosList.Length > 0 ? DesembolsosList.Select(dsm => dsm.SaldoCapitalInteres)
                        .Aggregate((decimal lat, decimal curr) => lat + curr) : 0).ToString("C");

                    TOTAL_BALANCE += importeCanjeValesD;
                    balanceHtml1 = balanceHtml1.Replace("@@DesembolsosRows", DesembolsosHTML);
                    balanceHtml1 = balanceHtml1.Replace("@@DesembolsoValesTotal", importeCanjeVales);
                    balanceHtml1 = balanceHtml1.Replace("@@DesembolsoCapitalTotal", importeCanjeValesInteres);
                    //balanceHtml1 = balanceHtml1.Replace("@@DesembolsoFisicoDesc", "CAPITAL CANJE FISICO");
                    // balanceHtml1 = balanceHtml1.Replace("@@DesembolsoCapitalDesc", "CAPITAL CANJES + INTERES VALES");

                    /***  SON TODOS LOS MOVIMIENTOS QUE SE MUESTRAN DEL LADO DERECHO  ***/
                    TOTAL_BALANCE = SumaListasBal(TOTAL_BALANCE, NuevosPrestamosList);
                    balanceHtml1 = BalanceGenerarDesglose(balanceHtml1, NuevosPrestamosList, "@@ImporteNuevosPrestamos", "@@RowsNuevosPrestamos", MostrarFecha: false);

                    string RetirosHTML_R = RetirosList.Length > 0 ? RetirosList.GroupBy(reg => reg.Sucursal).OrderBy(_s => _s.Key)
                        .Select(_sucursal =>
                        {
                            string tempString = $@"
                                <tr style='justify-content: space-between;'>
                                    <td class='d-inline' style='font-weight: bold; font-size: 14px;' col-span='2'>{_sucursal.Key}</td>
                                </tr>";

                            tempString += _sucursal.GroupBy(_s => _s.CuentaID).Select(_cuenta =>
                            {
                                string nombreCuenta = CuentasList.Where(reg => reg.CuentaBancoID == _cuenta.Key)
                                    .Select(reg => reg.DescripcionCuenta).FirstOrDefault();
                                decimal totalRetirosCuenta = _cuenta.Select(reg => reg.Importe)
                                    .Aggregate((lat, curr) => lat + curr);

                                string tempStringCuenta = $@"
                                <tr style='justify-content: space-between;'>
                                    <td class='d-inline' style='padding-left: 20px; font-size: 13px; width: 80%;'>{nombreCuenta}</td>
                                    <td class='d-inline' style='padding-left: 20px; font-size: 13px; width: 20%; text-align: right;'>{totalRetirosCuenta.ToString("C")}</td>
                                </tr>";

                                return tempStringCuenta;
                            }).Aggregate((lat, curr) => lat + curr);

                            decimal totalDniSucursal = _sucursal.Select(reg => reg.Importe).Aggregate((lat, curr) => lat + curr);

                            tempString += $@"<tr style='justify-content: space-between;'>
                                    <td {labelTotalStyle}>SUBTOTAL {_sucursal.Key}</td>
                                    <td {valueTotalStyle}>
                                        <div style='padding-left: 10px;'>{__separadorCantidad__}</div>
                                        <div>{totalDniSucursal.ToString("C")}</div>
                                    </td>
                                </tr>";

                            return tempString;
                        }).Aggregate((lat, curr) => lat + curr) : "";

                    balanceHtml1 = balanceHtml1.Replace("@@RowsRetiros", RetirosHTML_R);
                    balanceHtml1 = balanceHtml1.Replace("@@ImporteRetiros", SumaListasBal(0, DniList).ToString("C"));

                    if (DniList.Length > 0)
                    {
                        /***  SE HACE EL MAPEO DE LOS DNI AGRUPADOS POR SUCURSAL  ***/
                        string DniHTML_R = DniList.GroupBy(reg => reg.Sucursal).OrderBy(_s => _s.Key)
                            .Select(_sucursal =>
                            {
                                string tempString = $@"<tr style='justify-content: space-between;'>
                                    <td class='d-inline' style='font-weight: bold; font-size: 14px;' col-span='2'>{_sucursal.Key}</td>
                                </tr>";

                                tempString += _sucursal.Select(reg => $@"<tr style='justify-content: space-between;'>
                                    <td class='d-inline' style='font-size: 13px; width: 80%;'>{reg.Descripcion}</td>
                                    <td class='d-inline' style='font-size: 13px; width: 20%; text-align: right;'>{reg.Importe.ToString("C")}</td>
                                </tr>").Aggregate((lat, curr) => lat + curr);

                                decimal totalDniSucursal = _sucursal.Select(reg => reg.Importe).Aggregate((lat, curr) => lat + curr);

                                tempString += $@"<tr style='justify-content: space-between;'>
                                    <td {labelTotalStyle}>SUBTOTAL {_sucursal.Key}</td>
                                    <td {valueTotalStyle}>
                                        <div style='padding-left: 10px;'>{__separadorCantidad__}</div>
                                        <div>{totalDniSucursal.ToString("C")}</div>
                                    </td>
                                </tr>";

                                return tempString;
                            }).Aggregate((lat, curr) => lat + curr);

                        balanceHtml1 = balanceHtml1.Replace("@@RowsDni", DniHTML_R);
                        balanceHtml1 = balanceHtml1.Replace("@@ImporteDni", SumaListasBal(0, DniList).ToString("C"));

                    }
                    else
                    {
                        balanceHtml1 = balanceHtml1.Replace("@@ImporteDni", 0.ToString("C"));
                    }

                    /***  SON TODOS LOS CREDITOS DE TIENDITA AGRUPADOS POR SUCURSAL  ***/
                    string TienditaHTML = TienditaList.Length > 0 ? TienditaList.GroupBy(val => val.Sucursal)
                        .OrderByDescending(_s => _s.Select(_t => _t.Importe).Aggregate((a, b) => a + b))
                        .Select(_sucursal =>
                        {
                            string tempTotal = _sucursal.Select(reg => reg.Importe).Aggregate((a, b) => a + b).ToString("C");
                            var totalCliente = _sucursal.Where(reg => reg.Tipo.ToUpper() == "CLIENTE").FirstOrDefault();

                            var totalDistribuidor = _sucursal.Where(reg => reg.Tipo.ToUpper() == "DISTRIBUIDOR").FirstOrDefault();

                            string tempString = $@"
                                <tr style='justify-content: space-between;'>
                                    <td class='d-inline' style='font-weight: bold; font-size: 14px; width: 20%;'>{_sucursal.Key}</td>
                                    <td class='d-inline' style='font-size: 13px; width: 20%; text-align: right;'>{(totalCliente != null ? totalCliente.Aprovechamiento : 0).ToString("0.##")}%</td>
                                ";


                            tempString += $@"
                                    <td class='d-inline' style='font-size: 13px; width: 20%; text-align: right;'>{(totalCliente != null ? totalCliente.Importe : 0).ToString("C")}
                                    </td>
                                    <td class='d-inline' style='font-size: 13px; width: 20%; text-align: right;'>{(totalDistribuidor != null ? totalDistribuidor.Importe : 0).ToString("C")}
                                    </td>
                                ";

                            tempString += $@"
                                    <td class='d-inline' style='font-size: 13px; width: 20%; text-align: right;'>{tempTotal}</td>
                                </tr>
                                ";

                            return tempString;
                        }).Aggregate((lat, curr) => lat + curr) : "";

                    decimal ImporteTotalTienditaD = TienditaList.Length > 0 ? TienditaList.Select(tipo => tipo.Importe)
                        .Aggregate((decimal lat, decimal curr) => lat + curr) : 0;
                    string ImporteTotalTiendita = ImporteTotalTienditaD.ToString("C");

                    balanceHtml1 = balanceHtml1.Replace("@@RowsTiendita", TienditaHTML);
                    balanceHtml1 = balanceHtml1.Replace("@@ImporteTiendita", ImporteTotalTiendita);

                    /***  SON TODA LA COBRANZA AGRUPADOS POR SUCURSAL  ***/
                    var CobranzaCfHTML = CobranzaCfList.Length > 0 ? CobranzaCfList.GroupBy(val => val.Sucursal)
                        .Select(_sucursal =>
                        {
                            string tempString = $@"
                                <tr style='justify-content: space-between;'>
                                    <td class='d-inline' style='font-weight: bold; font-size: 14px; width: 31%;'>{_sucursal.Key}</td>
                                ";
                            tempString += _sucursal.Select(_tipo => $@"
                                    <td class='d-inline' style='font-size: 13px; width: 23%; text-align: right;'>{_tipo.Gestoria.ToString("C")}</td>
                                    <td class='d-inline' style='font-size: 13px; width: 23%; text-align: right;'>{_tipo.Ordinaria.ToString("C")}</td>
                                    <td class='d-inline' style='font-size: 13px; width: 23%; text-align: right;'>{_tipo.Total.ToString("C")}</td>
                                ").Aggregate((lat, curr) => lat + curr);

                            tempString += $@"
                                </tr>";
                            return tempString;
                        }).Aggregate((lat, curr) => lat + curr) : "";

                    string ImporteTotalCobranzaCf = (CobranzaCfList.Length > 0 ? CobranzaCfList.Select(tipo => tipo.Total)
                        .Aggregate((decimal lat, decimal curr) => lat + curr) : 0).ToString("C");

                    balanceHtml1 = balanceHtml1.Replace("@@RowsCobranzaCF", CobranzaCfHTML);
                    balanceHtml1 = balanceHtml1.Replace("@@ImporteCobranzaCF", ImporteTotalCobranzaCf);


                    /***  ES LA SUMA DE LAS PROTECCIONES  ***/
                    string ProteccionesHTML = "";
                    decimal ImporteTotalProteccionesD = 0;
                    string ImporteTotalProtecciones = "$0.00";

                    if (ProteccionesList.Length > 0)
                        ImporteTotalProteccionesD = ProteccionesList.Select(prot => prot.Importe)
                            .Aggregate((decimal lat, decimal curr) => lat + curr);

                    TOTAL_BALANCE += ImporteTotalProteccionesD;
                    ImporteTotalProteccionesD.ToString("C");

                    ProteccionesHTML += $@"
                            <tr style='justify-content: space-between;'>
                                <td {labelsStyle}>COBRO DE USV</td>
                                <td {valuesStyle}>{ImporteTotalProtecciones}</td>
                            </tr>";

                    balanceHtml1 = balanceHtml1.Replace("@@RowsProtecciones", ProteccionesHTML);
                    balanceHtml1 = balanceHtml1.Replace("@@ImporteProtecciones", ImporteTotalProtecciones);




                    var resTotales = await ConexionBD.database.QueryAsync<Totales>("EXEC Balances.pa_TotalCartera @0, 1", parData.BalanceSeleccionado).FirstAsync();
                    decimal TotalVencida = resTotales.TotalSaldoActual;

                    var resTotales2 = await ConexionBD.database.QueryAsync<Totales>("EXEC Balances.pa_TotalCartera @0,  2", parData.BalanceSeleccionado).FirstAsync();
                    decimal TotalNormal = resTotales2.TotalSaldoActual;


                    string TotalCuentasPorCobrar = (TotalVencida + TotalNormal).ToString("C");

                    decimal TotalCuentas = TotalCuentasBancosD + TotalVencida + TotalNormal;
                    decimal DiferenciaBalance = TotalCuentas - TOTAL_BALANCE;

                    string TotalesBalance = $@"
                            <tr style='justify-content: space-between;'>
                                <td {totalFont}>SUBTOTAL SALDO EN CUENTAS POR COBRAR</td>
                                <td {valueTotalStyle}>{TotalCuentasPorCobrar}</td>
                            </tr>
                            <tr style='justify-content: space-between;'>
                                <td {totalFont}>SUBTOTAL SALDO EN CUENTAS DE SUCURSAL</td>
                                <td {valueTotalStyle}>{TotalCuentasBancos}</td>
                            </tr>
                            <tr style='justify-content: space-between;'>
                                <td {totalFont}>SALDO TOTAL</td>
                                <td {valueTotalStyle}>
                                    {__separador__}
                                    {TotalCuentas.ToString("C")}
                                </td>
                            </tr>
                            <tr style='justify-content: space-between;'><td {totalFont}>-</td><td {valueTotalStyle}>-</td>
                            </tr>
                            <tr style='justify-content: space-between;'>
                                <td {totalFont}>RESULTADO BALANCE</td>
                                <td {valueTotalStyle}>{TOTAL_BALANCE.ToString("C")}</td>
                            </tr>
                            <tr style='justify-content: space-between;'>
                                <td {totalFont}>DIFERENCIA</td>
                                <td {valueTotalStyle}>
                                    <div style='border: 1px solid black; padding: 1px;'>
                                    {DiferenciaBalance.ToString("C")}
                                    </div>
                                </td>
                            </tr>
                        ";

                    var balanceTemporal = await ConexionBD.database.QueryAsync<BalanceTemp>("WHERE BalanceTempID = @0", parData.BalanceTempID).SingleOrDefaultAsync();

                    balanceTemporal.ResultadoBalance = TOTAL_BALANCE.ToString("C");
                    balanceTemporal.DiferenciaBalance = DiferenciaBalance.ToString("C");
                    balanceTemporal.Cartera090 = TotalNormal.ToString("C");
                    balanceTemporal.Cartera90 = TotalVencida.ToString("C");
                    balanceTemporal.BalanceVinculado = parData.BalanceSeleccionado;

                    await ConexionBD.database.UpdateAsync(balanceTemporal);

                    balanceHtml1 = balanceHtml1.Replace("@@TOTALES_BALANCE", TotalesBalance);

                    string clasifCarteraHTML = $@"
                            <tr style='justify-content: space-between;'>
                                <td {labelsStyle}>CARTERA VENCIDA (+90 DIAS)</td>
                                <td {valuesStyle}>{TotalVencida.ToString("C")}</td>
                            </tr>
                            <tr style='justify-content: space-between;'>
                                <td {labelsStyle}>CARTERA NORMAL</td>
                                <td {valuesStyle}>{TotalNormal.ToString("C")}</td>
                            </tr>
                            <tr style='justify-content: space-between;'>
                                <td {labelTotalStyle}> TOTAL CARTERA </td>
                                <td {valueTotalStyle}>
                                    <div style='padding-left: 10px;'>{__separadorCantidad__}</div>
                                    <div>{TotalCuentasPorCobrar}</div>
                                </td>
                            </tr>
                            
                        ";

                    balanceHtml1 = balanceHtml1.Replace("@@CLASIF_CARTERA", clasifCarteraHTML);

                    string ComisionesHTML = ComisionesList
                        .Select(com => $@"
                                <tr style='justify-content: space-between;'>
                                    <td class='d-inline' style='font-size: 14px; width: 33.33%;'>{com.Sucursal}</td>
                                    <td {style33}>%{(com.MinComision).ToString("P")}</td>
                                    <td {style33}>%{(com.MaxComision).ToString("P")}</td>
                                </tr>")
                        .Aggregate((lat, curr) => lat + curr);

                    balanceHtml1 = balanceHtml1.Replace("@@RowsComisiones", ComisionesHTML);

                    string TasasSegurosHTML = TasasSegurosList
                        .Select(com => $@"
                                <tr style='justify-content: space-between;'>
                                    <td class='d-inline' style='font-size: 14px; width: 20%;'>{com.Sucursal}</td>
                                    <td {style20}>%{com.MinTasa.ToString("P")}</td>
                                    <td {style20}>%{com.MinSeguro.ToString("P")}</td>
                                    <td {style20}>{com.MaxSeguro.ToString("C")}</td>
                                    <td {style20}>{com.MinSeguro.ToString("C")}</td>
                                </tr>")
                        .Aggregate((lat, curr) => lat + curr);

                    balanceHtml1 = balanceHtml1.Replace("@@RowsTasaSeguro", TasasSegurosHTML);
                }

                string CancDesHTML = "";
                if (CancelacionesListDes.Length > 0)
                {
                    CancDesHTML += CancelacionesListDes.Select(reg => $@"
                        <tr style='justify-content: space-between;'>
                            <td class='d-inline' style='font-size: 14px; width: 5%; vertical-align: center;'>{reg.CreditoID}</td>
                            <td class='d-inline' style='font-size: 14px; width: 5%; vertical-align: center;'>{reg.DistribuidorID}</td>
                            <td class='d-inline' style='font-size: 14px; width: 20%; vertical-align: center;'>{reg.NombreCompleto}</td>
                            <td class='d-inline' style='font-size: 14px; width: 15%; vertical-align: center;'>{reg.TipoCancelacion}</td>
                            <td class='d-inline' style='font-size: 14px; width: 10%; vertical-align: center;'>{reg.UsrCancela}</td>
                            <td class='d-inline' style='font-size: 14px; width: 15%; vertical-align: center;'>{reg.MvCancelacion}</td>
                            <td class='d-inline' style='font-size: 14px; width: 10%; vertical-align: center; text-align: right;'>{reg.ImporteTotal.ToString("C")}</td>
                            <td class='d-inline' style='font-size: 14px; width: 10%; vertical-align: center; text-align: right;'>{reg.Capital.ToString("C")}</td>
                        </tr>
                    ").Aggregate((lat, curr) => lat + curr);

                    var totalCancelaciones = CancelacionesListDes.Aggregate((a, b) => new BalanceCreditosCancelados
                    {
                        ImporteTotal = a.ImporteTotal + b.ImporteTotal,
                        Capital = a.Capital + b.Capital
                    });

                    CancDesHTML += $@"<tr style='justify-content: space-between;'>
                            <td class='d-inline' style='font-size: 14px; width: 10%; vertical-align: center; text-align: right;' colspan='6'>TOTALES</td>
                            <td class='d-inline' style='font-size: 14px; width: 10%; vertical-align: center; text-align: right;'>{totalCancelaciones.ImporteTotal.ToString("C")}</td>
                            <td class='d-inline' style='font-size: 14px; width: 10%; vertical-align: center; text-align: right;'>{totalCancelaciones.Capital.ToString("C")}</td>
                        </tr>";

                }
                balanceHtml1 = balanceHtml1.Replace("@@TABLA_CANCELACIONES_DES", CancDesHTML);

                string DesgloseGastosHTML = "";
                if (DesgloseGastosList.Length > 0)
                {
                    string __estiloBordes__ = "border: 1px solid black !important; border-collapse: collapse; font-size: 9px; background: #FFFFFF !important;";

                    // DesgloseGastosTotal.Aggregate()
                    DesgloseGastosHTML += DesgloseGastosList.GroupBy(reg => new { reg.Rubro, reg.RubroGastosID })
                        .Select(rubro =>
                        {
                            string tempString = $@"
                            <div> <p style='font-size: 10px; font-weight: bold;'>RUBRO: {rubro.Key.Rubro}<p>
                            <table style='border-collapse: collapse;'>
                            ";
                            tempString += rubro.Select(gastos =>
                            {
                                string Fecha = gastos.FechaAfectacion.ToString("dd/MM/yyyy");
                                string Util = gastos.Util ? "SI" : "NO";
                                string MontoAutorizado = Math.Round(gastos.MontoAutorizado, 2).ToString("C");
                                return $@"
                                <tr>
                                    <td style='width: 40px;  {__estiloBordes__} text-align: center;' rowspan='2'>{Util}</td>
                                    <td style='width: 90px;  {__estiloBordes__}'>{Fecha}</td>
                                    <td style='width: 300px; {__estiloBordes__}'>{gastos.Cuenta}</td>
                                    <td style='width: 750px; {__estiloBordes__}' rowspan='2'>{gastos.Observaciones}</td>
                                    <td style='width: 200px; {__estiloBordes__}' rowspan='2'>{gastos.Solicitante}</td>
                                    <td style='width: 200px; {__estiloBordes__} text-align: end;' rowspan='2'>{MontoAutorizado}</td>
                                </tr>
                                <tr>
                                    <td style='{__estiloBordes__}'>{gastos.MovimientoID}</td>
                                    <td style='{__estiloBordes__}'>{gastos.SucursalNombre}</td>
                                </tr>";
                            }).Aggregate((lat, curr) => lat + curr);

                            string totalRubro = rubro.Select(reg => reg.MontoAutorizado).Aggregate((a, b) => a + b).ToString("C");
                            tempString += $@"
                                <tr>
                                    <td colspan='2' style='font-size: 9px;'>REGISTROS: {rubro.Count()}</td>
                                    <td></td>
                                    <td></td>
                                    <td style='text-align: end; font-size: 9px;'>TOTAL {rubro.Key.Rubro}:  </td>
                                    <td style='text-align: end; {__estiloBordes__}'>{totalRubro}</td>
                                </tr>
                            </table>
                            ";
                            return tempString;
                        }).Aggregate((lat, curr) => lat + curr);



                }
                balanceHtml1 = balanceHtml1.Replace("@@TABLA_DESGLOSE_GASTOS", DesgloseGastosHTML);



                await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")), balanceHtml1);
                listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")));

                Process p = new() { StartInfo = new ProcessStartInfo(PDF.RUTA_WKHTMLTOPDF()) };

                var ProductoObj = await ConexionBD.database.SingleOrDefaultByIdAsync<Productos>(nombreBalance.ProductoID);
                var listado_imagenes = new List<string>();


                var logo = ProductoObj.Logo;
                Guid g = Guid.NewGuid();
                var logoname = string.Concat("logo", "_" + g.ToString() + ".jpeg");
                await System.IO.File.WriteAllBytesAsync(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "LogoImg", logoname), logo);
                listado_imagenes.Add(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "LogoImg", logoname));

                string fechaActual = "\"Generado: " + DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss") + "\"";
                string logoUrl = $"https://{HttpContext.Request.Host.Value}/pdf/LogoImg/{logoname}";
                var headerPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "header-h.html");
                var headerHtml = $@"<!DOCTYPE HTML><html>
                        <body style='margin: auto; padding: 0; text-align: left; width: 100% !important;'>
                        <table>
                            <table style='width: 100%;'> 
                                <tr> 
                                    <td style='width: 33.33%;'>{DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss")}</td>
                                    <td align='center'  style='width: 33.33%;'>
                                        <img style='max-height: 50px; max-width: 140px; margin-right: auto;' src='{logoUrl}' />
                                    </td>
                                    <td style='width: 33.33%; style='font-size: 8px'>.</td>
                                </tr> 
                            </table>
                        </table>
                        </body>
                    </html>";

                var footerPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "footer-f.html");
                var footerHtml = $@"<!DOCTYPE HTML><html>
                        <body style='margin: auto; padding: 0; text-align: left; width: 100% !important; height:25px !important;'></body>
                    </html>";
                listado_archivos.Add(headerPath);
                listado_archivos.Add(footerPath);

                // <img style='max-height: 50px; max-width: 140px;display: block;margin-left: auto;margin-right: auto;' src='{logoUrl}' />
                await System.IO.File.WriteAllTextAsync(headerPath, headerHtml);
                await System.IO.File.WriteAllTextAsync(footerPath, footerHtml);

                p.StartInfo.Arguments = string.Concat(
                    " --header-font-size 8 --header-right [page]/[topage] -O landscape --encoding utf-8 --page-size Letter "
                    , "--header-html ", headerPath, "  "
                    , "--footer-html ", footerPath, "  "
                    , string.Join(" ", listado_archivos), " ",
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
                foreach (var archivo in listado_archivos) System.IO.File.Delete(archivo);

                foreach (var imagen in listado_imagenes) System.IO.File.Delete(imagen);

                // Eliminamos el PDF
                System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));

                // Enviamos el PDF a la UI
                return new FileStreamResult(pdfStream, "application/pdf");

            }
            catch (Exception err)
            {
                return BadRequest(new
                {
                    err.Message,
                    err.StackTrace
                });
            }
        }


        [HttpPost]
        [Route("imprimir-balance4")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Imprimir4(ConfiaWebApi.PeticionesRest.Balances.GenerarBalances1.GenerarPDF2 parData)

        {
            try
            {
                ConexionBD.database.CommandTimeout = 9999;
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;

                var UsuarioActual = await ConexionBD.database
                    .QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName)
                    .FirstOrDefaultAsync();
                var PersonaActual = await ConexionBD.database
                    .QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName)
                    .FirstOrDefaultAsync();


                var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");
                var listado_archivos = new List<string>();
                var Count = 0;



                /***  INICIALIZAMOS EL DOCUMENTO HTML  ***/
                var balanceHtml1 = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Balances4.0", "Principal.html"));

                /***  ELEMENTOS HTML  ***/
                string __separador__ = "<div style='height: 2px; background-color: black; width: 50%; margin-top: 2px; margin-left: 50%; margin-bottom: 2px;'></div>";
                string __separadorLight__ = "<div style='height: 1px; background-color: black; width: 100%; margin-top: 2px; margin-bottom: 2px;'></div>";
                string __separadorCantidad__ = "<div style='border-bottom: 1px solid black; margin-top: 2px; margin-bottom: 2px;'></div>";
                string _w100 = "width: 100%;";
                string style33 = "class='d-inline' style='font-size: 14px; width: 33.33%; text-align: center;'";
                string style20 = "class='d-inline' style='font-size: 14px; width: 20%; text-align: center;'";
                string labelsStyle = "class='d-inline' style='font-size: 14px; width: 80%;'";
                string valuesStyle = "class='d-inline' style='font-size: 14px; width: 20%; text-align: right; vertical-align: bottom;'";
                string labelTotalStyle = "class='d-inline' style='font-weight: bold; font-size: 14px; width: 80%; text-align: right;'";
                string valueTotalStyle = "class='d-inline' style='font-weight: bold; font-size: 14px; width: 20%; text-align: right;'";
                string totalFont = "class='d-inline' style='font-weight: bold; font-size: 14px;'";


                int Periodo = 0;
                DateTime FechaApertura = DateTime.Now;
                DateTime? FechaCierre = DateTime.Now;
                int Accion = 0; //Indicamos si el periodo está abierto o cerrado para los traspasos

                //Obtener saldo anterior
                var BalanceAnterior = await ConexionBD.database
                    .QueryAsync<Balance2>("SELECT * FROM Balances.BalGetUltimoSaldoBalance(@0) bgusb", parData.BalanceSeleccionado)
                    .SingleOrDefaultAsync();

                var BalancePenultimo = await ConexionBD.database
                .QueryAsync<Balance2>("SELECT * FROM Balances.BalGetPenUltimoSaldoBalance(@0) bgusb", parData.BalanceSeleccionado)
                .SingleOrDefaultAsync();

                var BalanceAntePenultimo = await ConexionBD.database
                .QueryAsync<Balance2>("SELECT * FROM Balances.BalGetAntePenUltimoSaldoBalance(@0) bgusb", parData.BalanceSeleccionado)
                .SingleOrDefaultAsync();


                decimal ImporteBalanceAnt = BalanceAnterior == null ? 0 : BalanceAnterior.SaldoTotalBalance;
                string FechaBalanceAnt = (BalanceAnterior == null ? new DateTime() : BalanceAnterior.FechaCreacion).ToString("dd/MM/yyyy");
                string FechaBalancePenUlt = (BalancePenultimo == null ? new DateTime() : BalancePenultimo.FechaCreacion).ToString("dd/MM/yyyy");
                string FechaBalanceAntPenUlt = (BalanceAntePenultimo == null ? new DateTime() : BalanceAntePenultimo.FechaCreacion).ToString("dd/MM/yyyy");




                //Obtener nombre del balance
                var nombreBalance = await ConexionBD.database
                    .QueryAsync<dynamic>("SELECT bp.NombreBalance, p.NombreCompleto, bp.ProductoID FROM Balances.BalancesProductos bp JOIN General.Personas p ON bp.ResponsableBalance = p.PersonaID  where BalanceID = @0", parData.BalanceSeleccionado)
                    .SingleOrDefaultAsync();

                if (nombreBalance == null)
                    throw new Exception("No se encontró el ID del balance");


                balanceHtml1 = balanceHtml1.Replace("@@ImporteBalanceAnt", ImporteBalanceAnt.ToString("C"));
                balanceHtml1 = balanceHtml1.Replace("@@FechaBalanceAnt", FechaBalanceAnt);
                balanceHtml1 = balanceHtml1.Replace("@@FechaBalancePentUlt", FechaBalancePenUlt);
                balanceHtml1 = balanceHtml1.Replace("@@FechaBalanceAnatePentUlt", FechaBalanceAntPenUlt);




                balanceHtml1 = balanceHtml1.Replace("@@NOMBRE_BALANCE", parData.BalanceTempID + " - " + nombreBalance.NombreBalance + " - " + nombreBalance.NombreCompleto);
                balanceHtml1 = balanceHtml1.Replace("@@SERVER", HttpContext.Request.Host.Value);
                balanceHtml1 = balanceHtml1.Replace("@@FECHA_BALANCE", DateTime.Now.ToString("dd/MM/yyyy"));

                CultureInfo myCI = new CultureInfo("en-US", false);
                parData.Accion = 1;


                /***  SON TODAS LAS CUENTAS QUE HAY EN SISTEMA  ***/
                var CuentasList = await ConexionBD.database.QueryAsync<CtasCuentas>("EXEC Balances.pa_BancosBalanceM @0", parData.BalanceSeleccionado).ToArrayAsync();

                var spData = new { BalanceVinculado = parData.BalanceSeleccionado, BalanceTempID = parData.BalanceTempID };
                string spVariables = "@BalanceVinculado, @BalanceTempID";

                /***  DESPUES DE ESO OBTENEMOS TODOS LOS VALORES QUE VAMOS A ITERAR (DEBIDO A QUE ES MENOS PESADO QUE HACERLO DENTRO DEL FOREACH)  ***/
                var CobranzaList = await ConexionBD.database.QueryAsync<CtasCobranza>($"EXEC Balances.pa_GetCobranzaCuentasM {spVariables}", spData)
                    .ToArrayAsync();
                var DniList = await ConexionBD.database.QueryAsync<CtasDni>($"EXEC Balances.pa_DepositosDNIM {spVariables}", spData)
                    .ToArrayAsync();
                var DepositoList = await ConexionBD.database.QueryAsync<CtasDeposito>($"EXEC Balances.pa_DepositosCuentasM {spVariables}", spData)
                    .ToArrayAsync();
                var RetirosList = await ConexionBD.database.QueryAsync<CtasRetiros>($"EXEC Balances.pa_DesgloseGastosM {spVariables}", spData)
                    .ToArrayAsync();
                var CancelacionesList = await ConexionBD.database.QueryAsync<BalCancelaciones>($"EXEC Balances.pa_CreditosCanceladosM {spVariables}", spData)
                    .ToArrayAsync();
                var DesembolsosList = await ConexionBD.database.QueryAsync<CtasDesembolso>($"EXEC Balances.pa_DesembolsoValesM {spVariables}", spData)
                    .ToArrayAsync();
                var NuevosPrestamosList = await ConexionBD.database.QueryAsync<CtasNuevosPrestamos>($"EXEC Balances.pa_NuevasVentasM {spVariables}", spData)
                    .ToArrayAsync();
                var TienditaList = await ConexionBD.database.QueryAsync<CtasTiendita>($"EXEC Balances.pa_TienditaM {spVariables}", spData)
                    .ToArrayAsync();
                var ProteccionesList = await ConexionBD.database.QueryAsync<CtasProtecciones>($"EXEC Balances.pa_USVM {spVariables}", spData)
                    .ToArrayAsync();
                var ComisionesList = await ConexionBD.database.QueryAsync<SucursalComisiones>($"EXEC Balances.pa_MaximasMinimasComisiones {spVariables}", spData)
                    .ToArrayAsync();
                var TasasSegurosList = await ConexionBD.database.QueryAsync<TasasSeguros>($"EXEC Balances.pa_MaximasMinimasTasasSeguros {spVariables}", spData)
                    .ToArrayAsync();
                var TotalesCuentasList = await ConexionBD.database.QueryAsync<TotalesCuentas>($"EXEC Balances.pa_SumaTotalesCuentas {spVariables}", spData)
                    .ToArrayAsync();
                var CobranzaCfList = await ConexionBD.database.QueryAsync<CobranzaCF>($"EXEC Balances.pa_TotalCarteraClienteFinal {spVariables}", spData)
                    .ToArrayAsync();

                var CancelacionesListDes = await ConexionBD.database.QueryAsync<BalanceCreditosCancelados>("EXEC Balances.pa_CreditosCancelados @0", parData.BalanceSeleccionado)
                    .ToArrayAsync();

                var DesgloseGastosList = await ConexionBD.database.QueryAsync<BalanceDesgloseGastos2>("EXEC Tesoreria.pa_GetDesgloseGastosBalance @0, @1", parData.BalanceSeleccionado, 0)
                    .ToArrayAsync();

                var TasasComisionesList = await ConexionBD.database.QueryAsync<TasasComisiones>("EXEC Balances.paGetComisionesTasasSucursal @0", parData.BalanceSeleccionado)
                    .ToArrayAsync();

                var MultisaldosCuentasListBancaria = await ConexionBD.database.QueryAsync<MultisaldosCuentas>($"EXEC Balances.paGetSaldosAntDespTotal {spVariables}", spData)
                    .ToArrayAsync();

                var MultisaldosCuentasListBancaria2 = await ConexionBD.database.QueryAsync<MultisaldosCuentas2>($"EXEC Balances.pa_SaldosAnterioresBalancesCuentas @0", parData.BalanceSeleccionado)
                     .ToArrayAsync();
                var MultisaldosCuentasListEfectivo = await ConexionBD.database.QueryAsync<MultisaldosCuentasefec>($"EXEC Balances.paGetSaldosAntDespTotalEfectivo {spVariables}", spData)
                   .ToArrayAsync();

                var MultisaldosCuentasListCorresponsal = await ConexionBD.database.QueryAsync<MultisaldosCuentascorres>($"EXEC Balances.paGetSaldosAntDespTotalCorresponsal {spVariables}", spData)
                    .ToArrayAsync();

                var MultisaldosCuentasTotales = await ConexionBD.database.QueryAsync<MultisaldosCuentascorres>($"EXEC Balances.paGetSaldosAntDespTotalFinal {spVariables}", spData)
                    .ToArrayAsync();

                var NuevoGastosBalance = await ConexionBD.database.QueryAsync<GastosNuevo>($"EXEC Tesoreria.pa_ReporteGastosBalance {spVariables}", spData)
                     .ToArrayAsync();

                var DepositosDNICuentasList = await ConexionBD.database.QueryAsync<DepositosDNICuentas>($"EXEC Balances.pa_CierreDepositosDNIAplicados @0", parData.BalanceSeleccionado)
                    .ToArrayAsync();

                var DepositosDNICuentasList2 = await ConexionBD.database.QueryAsync<DepositosBalance>($"EXEC Tesoreria.DNIReporteBalance @0", parData.BalanceSeleccionado)
                     .ToArrayAsync();

                var ValerasList = await ConexionBD.database.QueryAsync<CtasProtecciones>($"EXEC Balances.pa_ImpValera {spVariables}", spData)
                    .ToArrayAsync();

                var CanjesDigitales = await ConexionBD.database.QueryAsync<CanjesDigitales>($"EXEC Tesoreria.ObtCanjeDigitalBalance @0", parData.BalanceSeleccionado)
                     .ToArrayAsync();

                var ProteccionesDeSaldo = await ConexionBD.database.QueryAsync<CanjesDigitales>($"EXEC Tesoreria.ProteccionDeSaldosReporte @0", parData.BalanceSeleccionado)
                    .ToArrayAsync();


                //OBTENEMOS LAS CUENTAS Y AGRUPAMOS POR SUCURSAL PARA OPTIMIZAR LA ITERACIÓN DE LAS CUENTAS
                // var CuentasPorSucursal = CuentasList.GroupBy(prev => prev.Sucursal).OrderBy(reg => reg.Key);

                var CuentasPorSucursal = CuentasList
                .GroupBy(cuenta => new { cuenta.TipoCuenta, cuenta.Sucursal });  // Agrupar por una clave compuesta
                                                                     // .OrderBy(group => group.Key.TipoCuenta)  // Ordenar por TipoCuenta
                                                                     // .ThenBy(group => group.Key.Sucursal);  // Ordenar por Sucursal dentro de cada TipoCuenta


                decimal TOTAL_BALANCE = 0;
                int cuentaIndex = 0; // Índice de la cuenta actual
                int totalCuentas = CuentasPorSucursal.Count();
                //Inicio PDF Principal
                if (CuentasList.Length > 0)
                {
                    string CuentaHTML = "";
                    int SucursalIndex = 0;
                    int SucursalesCount = CuentasPorSucursal.ToArray().Length;
                    foreach (var cuentasDeSucursal in CuentasPorSucursal)
                    {
                        SucursalIndex++;
                        var comisionSucursal = ComisionesList.Where(cob => cob.Sucursal == cuentasDeSucursal.Key.Sucursal)
                            .ToArray();

                        string comisionSucursalHTML = "";

                        if (comisionSucursal.Length > 0)
                        {
                            string max = (comisionSucursal[0].MaxComision * 100).ToString("0.##");
                            string min = (comisionSucursal[0].MinComision * 100).ToString("0.##");
                            // comisionSucursalHTML = $@": MAX: {max}% - MIN: {min}%";
                            comisionSucursalHTML = $@": MAX: {max} // PP: 5.3% // CF: N/A%";
                        }

                        if (SucursalIndex < (totalCuentas - 2))
                        {
                            CuentaHTML += $@"
        
                            <div>
                            
                        <div style='border: 0px solid black; justify-content: center;' class='CONTAINER_CUENTAS'>
                        <h3 style='font-size: 18px; font-weight: bold; width: 100%; text-align: center;'> 
                           {cuentasDeSucursal.Key.Sucursal} {comisionSucursalHTML} 
                        </h3>
                        <table style='width: 100%;' class='TABLA_CUENTAS'>
                            @@ROWS_TABLA_CUENTAS
                        </table>
                         </div>
                         </div>
                         <div class='PAGE_BREAK'>.</div>
                        ";
                        }
                        else
                        {
                            CuentaHTML += $@"
        
                            <div>
                        <div style='border: 0px solid black; justify-content: center;' class='CONTAINER_CUENTAS'>
                        <h3 style='font-size: 18px; font-weight: bold; width: 100%; text-align: center;'> 
                           {cuentasDeSucursal.Key.Sucursal} {comisionSucursalHTML} 
                        </h3>
                        <table style='width: 100%;' class='TABLA_CUENTAS'>
                            @@ROWS_TABLA_CUENTAS
                        </table>
                         </div>
                         </div>
                         
                        ";
                        }
                        // }
                        // else
                        // {
                        //     /*** MOSTRAMOS EL NOMBRE DE LA SUCURSAL ***/
                        //     CuentaHTML += $@"

                        //     <div>
                        // <div style='border: 0px solid black; justify-content: center;' class='CONTAINER_CUENTAS'>
                        // <h3 style='font-size: 18px; font-weight: bold; width: 100%; text-align: center;'> 
                        //    {cuentasDeSucursal.Key.Sucursal} {comisionSucursalHTML} 
                        // </h3>
                        // <table style='width: 100%;' class='TABLA_CUENTAS'>
                        //     @@ROWS_TABLA_CUENTAS
                        // </table>
                        //  </div>
                        //  </div>

                        // ";
                        // }

                        // <td style='width: 50%; vertical-align: bottom; background:red;'>
                        //     <table style='width: 100%;'>
                        //         @@TABLA_IZQUIERDA
                        //     </table>
                        // </td>
                        // <td style='width: 50%; vertical-align: bottom; background:green;'>
                        //     <table style='width: 100%;'>
                        //         @@TABLA_DERECHA
                        //     </table>
                        // </td>

                        int CuentaIndex = 0;
                        string CuentasHTMLList = ""/* , CuentasDerecha = "", CuentasIzquierda = "" */;
                        /***  SON TODAS LAS CUENTAS QUE SE MUESTRAN DEL LADO IZQUIERDO  ***/
                        foreach (var cuentaBanco in cuentasDeSucursal)
                        {
                            CuentaIndex++;
                            string cuentaId = cuentaBanco.CuentaBancoID.ToString();
                            string cuentaNombre = cuentaBanco.DescripcionCuenta;
                            string cuentaSaldoInicial = cuentaBanco.SaldoInicial.ToString("C");

                            var cuentaCobranza = CobranzaList.Where(cob => cob.CuentaID == cuentaBanco.CuentaBancoID)
                                .ToArray();
                            var cuentaDni = DniList.Where(cob => cob.CuentaID == cuentaBanco.CuentaBancoID)
                                .ToArray();
                            var cuentaDepositos = DepositoList.Where(cob => cob.CuentaID == cuentaBanco.CuentaBancoID)
                                .ToArray();
                            var cuentaRetiros = RetirosList.Where(cob => cob.CuentaID == cuentaBanco.CuentaBancoID)
                                .ToArray();
                            var cuentaDesembolsos = DesembolsosList.Where(cob => cob.CuentaID == cuentaBanco.CuentaBancoID)
                                .ToArray();
                            var _totales_ = TotalesCuentasList.Where(cob => cob.CuentaID == cuentaBanco.CuentaBancoID)
                                .ToArray();

                            string totalCuenta = _totales_.Length > 0 ? _totales_.Sum(t => t.Importe).ToString("C") : "$0.0";

                            string totalfinal ="$0.0";

                            // if(CuentaIndex % 2 == 0) CuentasHTMLList = CuentasDerecha;
                            if (CuentaIndex % 2 != 0)
                            {
                                // CuentasHTMLList = CuentasIzquierda;
                                CuentasHTMLList += "<tr>";

                            }

                            /***  INICIO LISTADO CUENTA  ***/
                            CuentasHTMLList += $@"
                            
                            <td style='width: 50%; vertical-align: top;'>
                                <div>
                                    <div>
                                      {__separadorLight__}
                                        <div style='font-size: 14px; font-weight: bold; text-align: start;'>   {cuentaNombre} : {cuentaId} </div>
                                        {__separadorLight__}
                                    </div>
                                    <table style='width: 100%;'>
                                        <tr style='justify-content: space-between;'>
                                            <td {labelsStyle}>SALDO ANTERIOR</td>
                                            <td {valuesStyle}>{cuentaSaldoInicial}</td>
                                        </tr>
                                        <tr style='justify-content: space-between;'>
                                            <td {labelTotalStyle}>SUBTOTAL SALDO ANT:</td>
                                            <td {valueTotalStyle}>
                                                <div style='padding-left: 10px;'>{__separadorCantidad__}</div>
                                                <div>{cuentaSaldoInicial}</div>
                                            </td>
                                        </tr>";


                            /***  INICIA COBRANZA DE VALES Y CLIENTES  ***/
                            if (cuentaCobranza.Length > 0)
                            {
                                var cobranza = cuentaCobranza[0];
                                string importeCobranzaTotal = (cobranza.ImporteVales + cobranza.ImporteCliente).ToString("C");

                                CuentasHTMLList += $@"
                                    <tr style='justify-content: space-between;'>
                                        <td class='d-inline' style='font-weight: bold; font-size: 14px; width: 80%;'>COBRANZA</td>
                                        <td {valuesStyle}>{"."}</td>
                                    </tr>";

                                /***  LISTADO COBRANZA VALES  ***/
                                if (cobranza.TieneImporteVales)
                                {
                                    string importeCobranzaVales = cobranza.ImporteVales.ToString("C");
                                    CuentasHTMLList += $@"
                                    <tr style='justify-content: space-between;'>
                                        <td {labelsStyle}>COBRANZA DE VALES</td>
                                        <td {valuesStyle}>{importeCobranzaVales}</td>
                                    </tr>
                                    <tr style='justify-content: space-between;'>
                                        <td {labelTotalStyle}>SUBTOTAL COBRANZA DE VALES:</td>
                                        <td {valueTotalStyle}>
                                            <div style='padding-left: 10px;'>{__separadorCantidad__}</div>
                                            <div>{importeCobranzaVales}</div>
                                        </td>
                                    </tr>";
                                }

                                /***  LISTADO COBRANZA CLIENTE FINAL  ***/
                                if (cobranza.TieneImporteCliente)
                                {
                                    string importeCobranzaClienteF = cobranza.ImporteCliente.ToString("C");
                                    CuentasHTMLList += $@"
                                    <tr style='justify-content: space-between;'>
                                        <td {labelsStyle}>COBRANZA CLIENTE FINAL</td>
                                        <td {valuesStyle}>{importeCobranzaClienteF}</td>
                                    </tr>
                                    <tr style='justify-content: space-between;'>
                                        <td {labelTotalStyle}>SUBTOTAL COBRANZA CLIENTE FINAL:</td>
                                        <td {valueTotalStyle}>
                                            <div style='padding-left: 10px;'>{__separadorCantidad__}</div>
                                            <div>{importeCobranzaClienteF}</div>
                                        </td>
                                    </tr>";
                                }

                                CuentasHTMLList += $@"
                                    <tr style='justify-content: space-between;'>
                                        <td {labelTotalStyle}>TOTAL COBRANZA RECIBIDA</td>
                                        <td {valueTotalStyle}>
                                            <div style='padding-left: 10px;'>{__separadorCantidad__}</div>
                                            <div>{importeCobranzaTotal}</div>
                                        </td>
                                    </tr>";
                            }


                            /***  INICIA EL LISTADO DE LOS DNI  ***/
                            if (cuentaDni.Length > 0)
                            {
                                string importeDniTotal = cuentaDni.Select(dni => dni.Importe)
                                    .Aggregate((decimal lat, decimal curr) => lat + curr)
                                    .ToString("C");


                                CuentasHTMLList += $@"
                                    <tr style='justify-content: space-between;'>
                                        <td class='d-inline' style='font-weight: bold; font-size: 14px; width: 80%;'>DNIS</td>
                                        <td {valuesStyle}>{"."}</td>
                                    </tr>";

                                /***  LISTADO DNI  ***/
                                foreach (var dni in cuentaDni)
                                {
                                    string importeDni = dni.Importe.ToString("C");
                                    CuentasHTMLList += $@"
                                    <tr style='justify-content: space-between;'>
                                        <td {labelsStyle}>{dni.Descripcion}</td>
                                        <td {valuesStyle}>{importeDni}</td>
                                    </tr>";
                                }

                                CuentasHTMLList += $@"
                                    <tr style='justify-content: space-between;'>
                                        <td {labelTotalStyle}> SUBTOTAL DNIS </td>
                                        <td {valueTotalStyle}>
                                            <div style='padding-left: 10px;'>{__separadorCantidad__}</div>
                                            <div>{importeDniTotal}</div>
                                        </td>
                                    </tr>";
                            }

                            /***  INICIA EL LISTADO DE LOS DEPOSITOS  ***/
                            if (cuentaDepositos.Length > 0)
                            {
                                string importeDepositoTotal = cuentaDepositos.Select(dni => dni.Importe)
                                    .Aggregate((decimal lat, decimal curr) => lat + curr)
                                    .ToString("C");


                                CuentasHTMLList += $@"
                                    <tr style='justify-content: space-between;'>
                                        <td class='d-inline' style='font-weight: bold; font-size: 14px; width: 80%;'>DEPOSITOS</td>
                                        <td {valuesStyle}>{"."}</td>
                                    </tr>";

                                /***  LISTADO DEPOSITOS  ***/
                                foreach (var deposito in cuentaDepositos)
                                {
                                    string importeDeposito = deposito.Importe.ToString("C");
                                    string fechaDeposito = deposito.FechaAfectacion?.ToString("dd/MM/yyyy");

                                    CuentasHTMLList += $@"
                                    <tr style='justify-content: space-between;'>
                                        <td {labelsStyle}>{fechaDeposito} {deposito.Descripcion}</td>
                                        <td {valuesStyle}>{importeDeposito}</td>
                                    </tr>";
                                }

                                CuentasHTMLList += $@"
                                    <tr style='justify-content: space-between;'>
                                        <td {labelTotalStyle}> SUBTOTAL DEPOSITOS </td>
                                        <td {valueTotalStyle}>
                                            <div style='padding-left: 10px;'>{__separadorCantidad__}</div>
                                            <div>{importeDepositoTotal}</div>
                                        </td>
                                    </tr>";
                            }

                            /***  INICIA EL LISTADO DE LOS DESEMBOLSOS  ***/
                            if (cuentaDesembolsos.Length > 0)
                            {
                                string importeDesembolsosTotal = cuentaDesembolsos.Select(dsm => dsm.Importe)
                                    .Aggregate((decimal lat, decimal curr) => lat + curr)
                                    .ToString("C");


                                CuentasHTMLList += $@"
                                    <tr style='justify-content: space-between;'>
                                        <td class='d-inline' style='font-weight: bold; font-size: 14px; width: 80%;'>DESEMBOLSOS</td>
                                        <td {valuesStyle}>{"."}</td>
                                    </tr>
                                    <tr style='justify-content: space-between;'>
                                        <td {labelsStyle}>DESEMBOLSOS</td>
                                        <td {valuesStyle}>{importeDesembolsosTotal}</td>
                                    </tr>
                                    <tr style='justify-content: space-between;'>
                                        <td {labelTotalStyle}> SUBTOTAL DESEMBOLSOS </td>
                                        <td {valueTotalStyle}>
                                            <div style='padding-left: 10px;'>{__separadorCantidad__}</div>
                                            <div>{importeDesembolsosTotal}</div>
                                        </td>
                                    </tr>
                                ";
                            }

                            /***  INICIA EL LISTADO DE LOS RETIROS  ***/
                            if (cuentaRetiros.Length > 0)
                            {
                                string importeRetirosTotal = cuentaRetiros.Select(ret => ret.Importe)
                                    .Aggregate((decimal lat, decimal curr) => lat + curr)
                                    .ToString("C");


                                CuentasHTMLList += $@"
                                    <tr style='justify-content: space-between;'>
                                        <td class='d-inline' style='font-weight: bold; font-size: 14px; width: 80%;'>RETIROS</td>
                                        
                                        <td {valuesStyle}>{"."}</td>
                                    </tr>";

                                /***  LISTADO RETIROS  ***/
                                foreach (var retiros in cuentaRetiros)
                                {
                                    string importeRetiros = retiros.Importe.ToString("C");
                                    // string fechaRetiros = retiros.FechaAfectacion.ToString("dd/MM/yyyy");
                                    CuentasHTMLList += $@"
                                    <tr style='justify-content: space-between;'>
                                        <td {labelsStyle}>{retiros.Descripcion}-{retiros.Observacion}</td>
                                        <td {valuesStyle}>{importeRetiros}</td>
                                    </tr>";
                                }

                                CuentasHTMLList += $@"
                                    <tr style='justify-content: space-between;'>
                                        <td {labelTotalStyle}> SUBTOTAL RETIROS </td>
                                        <td {valueTotalStyle}>
                                            <div style='padding-left: 10px;'>{__separadorCantidad__}</div>
                                            <div>{importeRetirosTotal}</div>
                                        </td>
                                    </tr>";
                            }
                                    totalfinal = (_totales_.Length > 0 
                                        ? (_totales_.Sum(t => t.Importe) + cuentaBanco.SaldoInicial).ToString("C") 
                                        : cuentaBanco.SaldoInicial.ToString("C"));

                               

                            /***  FIN LISTADO CUENTA ***/
                            CuentasHTMLList += $@"
                                    </table>
                                </div>
                                {__separador__}
                                <table style='width: 100%;'>
                                    <tr style='justify-content: space-between;'>
                                        <td {labelTotalStyle}>TOTAL:</td>
                                        <td {valueTotalStyle}>
                                            <div>{totalCuenta}</div>
                                        </td>
                                    </tr>
                                </table>
                                <table style='width: 100%;'>
                                    <tr style='justify-content: space-between;'>
                                        <td {labelTotalStyle}>TOTAL FINAL:</td>
                                        <td {valueTotalStyle}>
                                            <div>{totalfinal}</div>
                                        </td>
                                    </tr>
                                </table>
                            </td>";

                            if (CuentaIndex % 2 == 0)
                            {
                                // CuentasHTMLList = CuentasIzquierda;
                                CuentasHTMLList += "</tr>";

                            }

                            // if(CuentaIndex % 2 == 0) CuentasDerecha = CuentasHTMLList;
                            // if(CuentaIndex % 2 != 0) CuentasIzquierda = CuentasHTMLList;
                        }

                        CuentaHTML = CuentaHTML.Replace("@@ROWS_TABLA_CUENTAS", CuentasHTMLList);
                        // CuentaHTML = CuentaHTML.Replace("@@TABLA_IZQUIERDA", CuentasIzquierda);
                        // CuentaHTML = CuentaHTML.Replace("@@TABLA_DERECHA", CuentasDerecha);

                        //     if (SucursalIndex != SucursalesCount)
                        //         CuentaHTML += $@"<div class='PAGE_BREAK'>.</div>";
                        //     CuentaHTML += $@"
                        // </div>";
                    }

                    decimal TotalCuentasBancosD = TotalesCuentasList.Length > 0 ? TotalesCuentasList.Select(a => a.Importe).Aggregate((a, b) => a + b) : 0;
                    string TotalCuentasBancos = TotalCuentasBancosD.ToString("C");
                    // TOTAL_BALANCE += TotalCuentasBancosD;

                    balanceHtml1 = balanceHtml1.Replace("@@CUENTA", CuentaHTML);
                    balanceHtml1 = balanceHtml1.Replace("@@TBANCOS", TotalCuentasBancos);


                    string TasasComisionesString = "";
                    // TasasComisionesList = TasasComisionesList;
                    if (TasasComisionesList.Length > 0)
                        TasasComisionesString = TasasComisionesList.Select(_sucursal =>
                            {
                                // return @$"
                                //     <tr>  
                                //         <td style='font-size: 15px;'>{_sucursal.Sucursal}</td>
                                //         <td style='font-size: 15px; text-align: center;'>{_sucursal.Principiante.ToString("P")}</td>
                                //         <td style='font-size: 15px; text-align: center;'>{_sucursal.Bronce.ToString("P")}</td>
                                //         <td style='font-size: 15px; text-align: center;'>{_sucursal.Plata.ToString("P")}</td>
                                //         <td style='font-size: 15px; text-align: center;'>{_sucursal.Oro.ToString("P")}</td>
                                //         <td style='font-size: 15px; text-align: center;'>{_sucursal.Diamante.ToString("P")}</td>
                                //         <td style='font-size: 15px; text-align: center;'>{_sucursal.Platino.ToString("P")}</td>
                                //         <td style='font-size: 15px; text-align: center;'>{_sucursal.MaxPorcTasa.ToString("P")}</td>
                                //     </tr>";
                                // <td>{_sucursal.MaxLimiteCanje.ToString("C")}</td>
                                return @$"
<tr>  
    <td style='font-size: 15px;'>{_sucursal.Sucursal}</td>
    <td style='font-size: 14px; text-align: center;'>{_sucursal.Principiante.ToString("P")} - {_sucursal.PrincipianteMin.ToString("P")}</td>
    <td style='font-size: 14px; text-align: center;'>{_sucursal.Bronce.ToString("P")} - {_sucursal.BronceMin.ToString("P")}</td>
    <td style='font-size: 14px; text-align: center;'>{_sucursal.Plata.ToString("P")} - {_sucursal.PlataMin.ToString("P")}</td>
    <td style='font-size: 14px; text-align: center;'>{_sucursal.Oro.ToString("P")} - {_sucursal.OroMin.ToString("P")}</td>
    <td style='font-size: 14px; text-align: center;'>{_sucursal.Diamante.ToString("P")} - {_sucursal.DiamanteMin.ToString("P")}</td>
    <td style='font-size: 14px; text-align: center;'>{_sucursal.Platino.ToString("P")} - {_sucursal.PlatinoMin.ToString("P")}</td>
    <td style='font-size: 15px; text-align: center;'>{_sucursal.MaxPorcTasa.ToString("P")} - {_sucursal.MinPorcTasa.ToString("P")} </td>
        <td style='font-size: 15px; text-align: center;'>{_sucursal.ProtMin.ToString("C")} - {_sucursal.ProtMax.ToString("C")} </td>

</tr>";

                            })
                            .Aggregate((lat, curr) => lat + curr);

                    balanceHtml1 = balanceHtml1.Replace("@@TABLA_TASAS_COMISIONES", TasasComisionesString);
                    //MULTISALDOS BANCARIOSSS
                    string MultisaldosString = "";
                    string MULTISALDOS_ANTES = "$0.00";
                    string MULTISALDOS_AHORA = "$0.00";
                    string MULTISALDOS_PENUL = "$0.00";
                    string MULTISALDOS_ANTEPEN = "$0.00";

                    if (MultisaldosCuentasListBancaria.Length > 0 && MultisaldosCuentasListBancaria2.Length > 0)
                    {
                        var cuentasJoin = from cuenta in MultisaldosCuentasListBancaria
                                          join cuenta2 in MultisaldosCuentasListBancaria2
                                          on cuenta.CuentaBancoID equals cuenta2.CuentaBancoID
                                          select new { cuenta, cuenta2 };

                        MultisaldosString = string.Join("", cuentasJoin.Select(c => $@"
        <tr>  
            <td style='font-size: 20px; text-align: center;'>{c.cuenta.NumeroCuenta}</td>
            <td style='font-size: 15px; text-align: center;'>{c.cuenta2.SaldoAntesAntepenultimo.ToString("C")}</td>
            <td style='font-size: 15px; text-align: center;'>{c.cuenta2.SaldoAntepenultimo.ToString("C")}</td>
            <td style='font-size: 15px; text-align: center;'>{c.cuenta.ImporteBalAnterior.ToString("C")}</td>
            <td style='font-size: 15px; text-align: center;'>{c.cuenta.ImporteBalActual.ToString("C")}</td>
        </tr>"
                        ));

                        MULTISALDOS_ANTES = MultisaldosCuentasListBancaria.Sum(r => r.ImporteBalAnterior).ToString("C");
                        MULTISALDOS_AHORA = MultisaldosCuentasListBancaria.Sum(r => r.ImporteBalActual).ToString("C");
                        MULTISALDOS_PENUL = MultisaldosCuentasListBancaria2.Sum(r => r.SaldoAntepenultimo).ToString("C");
                        MULTISALDOS_ANTEPEN = MultisaldosCuentasListBancaria2.Sum(r => r.SaldoAntesAntepenultimo).ToString("C");
                    }


                    balanceHtml1 = balanceHtml1.Replace("@@TABLA_MULTISALDOS", MultisaldosString);
                    balanceHtml1 = balanceHtml1.Replace("@@MULTISALDOS_ANTES", MULTISALDOS_ANTES);
                    balanceHtml1 = balanceHtml1.Replace("@@MULTISALDOS_AHORA", MULTISALDOS_AHORA);
                    balanceHtml1 = balanceHtml1.Replace("@@MULTISALDOS_PEN", MULTISALDOS_PENUL);
                    balanceHtml1 = balanceHtml1.Replace("@@MULTISALDOS_ANPE", MULTISALDOS_ANTEPEN);



                    //MULTISALDOS EFECTIVO
                    string MultisaldosEfectivoString = "";
                    string MULTISALDOSEfectivo_ANTES = "$0.00";
                    string MULTISALDOSEfectivo_AHORA = "$0.00";
                    // MultisaldosList = MultisaldosList;
                    if (MultisaldosCuentasListEfectivo.Length > 0 && MultisaldosCuentasListBancaria2.Length > 0)
                    {

                                 var cuentasJoin = from cuenta in MultisaldosCuentasListEfectivo
                                          join cuenta2 in MultisaldosCuentasListBancaria2
                                          on cuenta.CuentaBancoID equals cuenta2.CuentaBancoID
                                          select new { cuenta, cuenta2 };

                        MultisaldosEfectivoString = string.Join("", cuentasJoin.Select(c => $@"
                                    <tr>  
                                        <td style='font-size: 20px text-align: center ;'>{c.cuenta.NumeroCuenta}</td>
                                        <td style='font-size: 15px; text-align: center;'>{c.cuenta2.SaldoAntesAntepenultimo.ToString("C")}</td>
                                        <td style='font-size: 15px; text-align: center;'>{c.cuenta2.SaldoAntepenultimo.ToString("C")}</td>
                                        <td style='font-size: 15px; text-align: center;'>{c.cuenta.ImporteBalAnterior.ToString("C")}</td>
                                        <td style='font-size: 15px; text-align: center;'>{c.cuenta.ImporteBalActual.ToString("C")}</td>
                                    </tr>"
                            ));


                        MULTISALDOSEfectivo_ANTES = MultisaldosCuentasListEfectivo.Sum(r => r.ImporteBalAnterior).ToString("C");
                        MULTISALDOSEfectivo_AHORA = MultisaldosCuentasListEfectivo.Sum(r => r.ImporteBalActual).ToString("C");
                    }

                    balanceHtml1 = balanceHtml1.Replace("@@TABLA_MFectivo", MultisaldosEfectivoString);
                    balanceHtml1 = balanceHtml1.Replace("@@MULTISALDOSANTESEfectivo", MULTISALDOSEfectivo_ANTES);
                    balanceHtml1 = balanceHtml1.Replace("@@MULTISALDOSAHORAEfectivo", MULTISALDOSEfectivo_AHORA);

                    //MULTISALDOS Corresponsal
                    string MultisaldosCorresponsalesString = "";
                    string MULTISALDOSCorresponsales_ANTES = "$0.00";
                    string MULTISALDOSCorresponsales_AHORA = "$0.00";
                    // MultisaldosList = MultisaldosList;
                    if (MultisaldosCuentasListCorresponsal.Length > 0 && MultisaldosCuentasListBancaria2.Length > 0)
                    {
                         var cuentasJoin = from cuenta in MultisaldosCuentasListCorresponsal
                                          join cuenta2 in MultisaldosCuentasListBancaria2
                                          on cuenta.CuentaBancoID equals cuenta2.CuentaBancoID
                                          select new { cuenta, cuenta2 };

                        MultisaldosCorresponsalesString = string.Join("", cuentasJoin.Select(c => $@"
                                    <tr>  
                                        <td style='font-size: 20px text-align: center ;'>{c.cuenta.NumeroCuenta}</td>
                                        <td style='font-size: 15px; text-align: center;'>{c.cuenta2.SaldoAntesAntepenultimo.ToString("C")}</td>
                                        <td style='font-size: 15px; text-align: center;'>{c.cuenta2.SaldoAntepenultimo.ToString("C")}</td>
                                        <td style='font-size: 15px; text-align: center;'>{c.cuenta.ImporteBalAnterior.ToString("C")}</td>
                                        <td style='font-size: 15px; text-align: center;'>{c.cuenta.ImporteBalActual.ToString("C")}</td>
                                    </tr>"
                            ));

                        MULTISALDOSCorresponsales_ANTES = MultisaldosCuentasListCorresponsal.Sum(r => r.ImporteBalAnterior).ToString("C");
                        MULTISALDOSCorresponsales_AHORA = MultisaldosCuentasListCorresponsal.Sum(r => r.ImporteBalActual).ToString("C");
                    }

                    balanceHtml1 = balanceHtml1.Replace("@@TABLA_MSCorresponsal", MultisaldosCorresponsalesString);
                    balanceHtml1 = balanceHtml1.Replace("@@MULTISALDOS_Corresponsal", MULTISALDOSCorresponsales_ANTES);
                    balanceHtml1 = balanceHtml1.Replace("@@MULTISALDOSCorresponsal", MULTISALDOSCorresponsales_AHORA);

                    //MULTISALDOS Corresponsal
                    string MULTISALDOSFinal = "$0.00";

                    // MultisaldosList = MultisaldosList;
                    if (MultisaldosCuentasTotales.Length > 0)
                    {

                        MULTISALDOSFinal = MultisaldosCuentasTotales.Sum(r => r.ImporteBalActual).ToString("C");
                    }

                    balanceHtml1 = balanceHtml1.Replace("@@TABLA_MSTotalFinal", MULTISALDOSFinal);


                    string TablaDniCuentas = "";
                    string C_DNI_APLICADOS = "$0.00";
                    string C_DNI_PENDIENTES = "$0.00";
                    string C_DNI_ACT = "$0.00";
                    string C_DNI_SALINI = "$0.00";
                    // MultisaldosList = MultisaldosList;
                    if (DepositosDNICuentasList2.Length > 0)
                    {
                        TablaDniCuentas = DepositosDNICuentasList2.Select(_cuenta =>
                            {
                                return @$"
                                    <tr>
                                        <td style='font-size: 15px;'>{_cuenta.NumeroCuenta}</td>
                                        <td style='font-size: 15px; text-align: center;'>{_cuenta.SaldoInicialDNI.ToString("C")}</td>
                                        <td style='font-size: 15px; text-align: center;'>{_cuenta.TotalDNIBalanceActual.ToString("C")}</td>
                                        <td style='font-size: 15px; text-align: center;'>{_cuenta.DNIsAplicadosBalanceActual.ToString("C")}</td>
                                        <td style='font-size: 15px; text-align: center;'>{_cuenta.SaldoPendienteAplicar.ToString("C")}</td>

                                    </tr>";
                            })
                            .Aggregate((lat, curr) => lat + curr);

                        C_DNI_APLICADOS = DepositosDNICuentasList2.Sum(r => r.DNIsAplicadosBalanceActual).ToString("C");
                        C_DNI_PENDIENTES = DepositosDNICuentasList2.Sum(r => r.SaldoPendienteAplicar).ToString("C");
                        C_DNI_ACT = DepositosDNICuentasList2.Sum(r => r.TotalDNIBalanceActual).ToString("C");
                        C_DNI_SALINI = DepositosDNICuentasList2.Sum(r => r.SaldoInicialDNI).ToString("C");

                    }

                    balanceHtml1 = balanceHtml1.Replace("@@C_DNI_APLICADOS", C_DNI_APLICADOS);
                    balanceHtml1 = balanceHtml1.Replace("@@C_DNI_PENDIENTES", C_DNI_PENDIENTES);
                    balanceHtml1 = balanceHtml1.Replace("@@C_DNI_ACT", C_DNI_ACT);
                    balanceHtml1 = balanceHtml1.Replace("@@C_DNI_SALINI", C_DNI_SALINI);
                    balanceHtml1 = balanceHtml1.Replace("@@TABLA_DNI_CUENTAS", TablaDniCuentas);


                    string tablaCanjesDigitales = "";
                    string TotalCanjes = "$0.00";
                    string TotalMonto = "$0.00";
                    string TotalSociasConApp = "";
                    string TotalValera = "$0.00";





                    if (CanjesDigitales.Length > 0)
                    {
                        tablaCanjesDigitales = CanjesDigitales.Select(canje =>
                        {
                            return @$"
            <tr>
                <td style='font-size: 15px;'>{canje.EmpresaNombre}</td>
                <td style='font-size: 15px;'>{canje.Zona}</td>
                <td style='font-size: 15px;'>{canje.SucursalNombre}</td>
                <td style='font-size: 15px; text-align: center;'>{canje.SociasNuevas.ToString()}</td>
                <td style='font-size: 15px; text-align: center;'>{canje.TotalSocias.ToString()}</td>
                <td style='font-size: 15px; text-align: center;'>{canje.SociasConApp.ToString()}</td>
                <td style='font-size: 15px; text-align: center;'>{canje.PorcentajeSociasApp.ToString("0.00")}%</td>
                <td style='font-size: 15px; text-align: center;'>{canje.CanjeNuevo.ToString("0")}</td>
                <td style='font-size: 15px; text-align: center;'>{canje.CapitalCanjeNuevo.ToString("0")}</td>
                <td style='font-size: 15px; text-align: center;'>{canje.CanjeRenova.ToString("0")}</td>
                <td style='font-size: 15px; text-align: center;'>{canje.CapitalRenovacion.ToString("0")}</td>
                <td style='font-size: 15px; text-align: center;'>{canje.TotalCanjes.ToString("0")}</td>
                <td style='font-size: 15px; text-align: center;'>{canje.TotalColocado.ToString("0")}</td>
            </tr>";
                        }).Aggregate((lat, curr) => lat + curr);

                    }


                    // Ahora puedes usar 'tablaCanjesDigitales' para reemplazar en el HTML final
                    TotalMonto = CanjesDigitales.Sum(r => r.TotalColocado).ToString("C");
                    TotalSociasConApp = CanjesDigitales.Sum(r => r.SociasConApp).ToString();
                    TotalCanjes = CanjesDigitales.Sum(r => r.TotalCanjes).ToString();
                    TotalValera = ValerasList.Sum(r => r.TotalValera).ToString("C");



                    balanceHtml1 = balanceHtml1.Replace("@@TABLA_CANJES_DIGITALES", tablaCanjesDigitales);
                    balanceHtml1 = balanceHtml1.Replace("@@TOTALMONTO", TotalMonto);
                    balanceHtml1 = balanceHtml1.Replace("@@TOTALCANJESDIGITAL", TotalCanjes);
                    balanceHtml1 = balanceHtml1.Replace("@@TOTALSOCIASAPP", TotalSociasConApp);
                    balanceHtml1 = balanceHtml1.Replace("@@TOTALVALERA", TotalValera);

                      string tablaGastosSucursal = "";
                    string Totalgasto = "$0.00";

                    Totalgasto = NuevoGastosBalance.Sum(r => r.Total).ToString("C");
                    if (NuevoGastosBalance.Length > 0)
                    {
                        tablaGastosSucursal = NuevoGastosBalance.Select(gasto =>
                        {
                            return @$"
            <tr>
                <td style='font-size: 15px; text-align: center;'>{gasto.NombreSucursal}</td>
                <td style='font-size: 15px; text-align: center;'>{gasto.Descripcion}</td>
                <td style='font-size: 15px; text-align: center;'>{gasto.Observaciones}</td>
                <td style='font-size: 15px; text-align: center;'>{gasto.Total.ToString("0.00")}</td>
                <td style='font-size: 15px; text-align: center;'>{gasto.FechaAplicado.ToString()}</td
            </tr>";
                        }).Aggregate((lat, curr) => lat + curr);

                    }


                    balanceHtml1 = balanceHtml1.Replace("@@TABLA_GASTOS", tablaGastosSucursal);
                    balanceHtml1 = balanceHtml1.Replace("@@TOTALGASTOS", Totalgasto);


                    /***  SON TODOS LOS MOVIMIENTOS QUE SE MUESTRAN DEL LADO DERECHO ***/
                    TOTAL_BALANCE = SumaListasBal(TOTAL_BALANCE, CancelacionesList);
                    balanceHtml1 = BalanceGenerarDesglose(balanceHtml1, CancelacionesList, "@@ImporteCancelaciones", "@@RowsCancelaciones");

                    TOTAL_BALANCE = SumaListasBal(TOTAL_BALANCE, DepositoList);

                    string DepositosHTML_R = $@"
                        <tr style='justify-content: space-between;'>
                            <td {labelsStyle}'>DEPOSITOS TOTALES</td>
                            <td {valuesStyle}'>{SumaListasBal(0, DepositoList).ToString("C")}</td>
                        </tr>
                    ";
                    balanceHtml1 = balanceHtml1.Replace("@@RowsDepositos", DepositosHTML_R);
                    balanceHtml1 = balanceHtml1.Replace("@@ImporteDepositos", SumaListasBal(0, DepositoList).ToString("C"));

                    // balanceHtml1 = BalanceGenerarDesglose(balanceHtml1, DepositoList, "@@ImporteDepositos", "@@RowsDepositos");

                    /***  SE CALCULAN LOS CANJES DE VALES ***/

                    string DesembolsosHTML = DesembolsosList.Length > 0 ? DesembolsosList.Select(reg =>
                    {
                        if (reg.TipoCreditoID == 2) return reg;
                        reg.TipoCredito = "CANJE FISICO";
                        return reg;
                    }).GroupBy(reg => reg.TipoCredito).Select(reg =>
                    {
                        string importe = reg.Select(dsm => dsm.Importe).Aggregate((decimal lat, decimal curr) => lat + curr)
                            .ToString("C");

                        return $@"
                            <tr style='justify-content: space-between;'>
                                <td {labelsStyle}>{reg.Key}</td>
                                <td {valuesStyle}>{importe}</td>
                            </tr>
                        ";
                    }).Aggregate((lat, curr) => lat + curr) : "";

                    decimal importeCanjeValesD = DesembolsosList.Length > 0 ? DesembolsosList.Select(dsm => dsm.Importe)
                        .Aggregate((decimal lat, decimal curr) => lat + curr) : 0;
                    string importeCanjeVales = importeCanjeValesD.ToString("C");

                    string importeCanjeValesInteres = (DesembolsosList.Length > 0 ? DesembolsosList.Select(dsm => dsm.SaldoCapitalInteres)
                        .Aggregate((decimal lat, decimal curr) => lat + curr) : 0).ToString("C");

                    TOTAL_BALANCE += importeCanjeValesD;
                    balanceHtml1 = balanceHtml1.Replace("@@DesembolsosRows", DesembolsosHTML);
                    balanceHtml1 = balanceHtml1.Replace("@@DesembolsoValesTotal", importeCanjeVales);
                    balanceHtml1 = balanceHtml1.Replace("@@DesembolsoCapitalTotal", importeCanjeValesInteres);
                    //balanceHtml1 = balanceHtml1.Replace("@@DesembolsoFisicoDesc", "CAPITAL CANJE FISICO");
                    // balanceHtml1 = balanceHtml1.Replace("@@DesembolsoCapitalDesc", "CAPITAL CANJES + INTERES VALES");

                    /***  SON TODOS LOS MOVIMIENTOS QUE SE MUESTRAN DEL LADO DERECHO  ***/
                    string NPPDesHTML = "";
                    if (NuevosPrestamosList.Length > 0)
                    {
                        NPPDesHTML += NuevosPrestamosList.Select(reg => $@"
                        <tr style='justify-content: space-between;'>
                            <td class='d-inline' style='font-size: 14px; width: 20%; vertical-align: center; text-align: center;'>{reg.Sucursal}</td>
                            <td class='d-inline' style='font-size: 14px; width: 10%; vertical-align: center; text-align: center;'>{reg.DistribuidorID}</td>
                            <td class='d-inline' style='font-size: 14px; width: 40%; vertical-align: center; text-align: center;'>{reg.Descripcion}</td>
                            <td class='d-inline' style='font-size: 14px; width: 25%; vertical-align: center; text-align: center;'>{reg.Capital.ToString("C")}</td>
                            <td class='d-inline' style='font-size: 14px; width: 25%; vertical-align: center; text-align: center;'>{reg.Importe.ToString("C")}</td>
                            <td class='d-inline' style='font-size: 14px; width: 10%; vertical-align: center; text-align: center;'>{reg.Plazos}</td>
                            

                            
                        </tr>
                    ").Aggregate((lat, curr) => lat + curr);
                 var totalCancelaciones = CancelacionesListDes
    ?.DefaultIfEmpty(new BalanceCreditosCancelados())
    .Aggregate((a, b) => new BalanceCreditosCancelados
    {
        ImporteTotal = a.ImporteTotal + b.ImporteTotal,
        Capital = a.Capital + b.Capital
    }) ?? new BalanceCreditosCancelados();

                        string importeCapital = (NuevosPrestamosList.Length > 0 ? NuevosPrestamosList.Select(dsm => dsm.Capital)
                        .Aggregate((decimal lat, decimal curr) => lat + curr) : 0).ToString("C");

                        string importeTotal = (NuevosPrestamosList.Length > 0 ? NuevosPrestamosList.Select(dsm => dsm.Importe)
                                           .Aggregate((decimal lat, decimal curr) => lat + curr) : 0).ToString("C");

                        balanceHtml1 = balanceHtml1.Replace("@@ImporteCapital", importeCapital);


                    }
                    balanceHtml1 = balanceHtml1.Replace("@@TABLA_PRESTAMOS", NPPDesHTML);
                    TOTAL_BALANCE = SumaListasBal(TOTAL_BALANCE, NuevosPrestamosList);
                    balanceHtml1 = BalanceGenerarDesglose(balanceHtml1, NuevosPrestamosList, "@@ImporteNuevosPrestamos", "@@RowsNuevosPrestamos", MostrarFecha: false);
                    string RetirosHTML_R = RetirosList.Length > 0 ? RetirosList.GroupBy(reg => reg.Sucursal).OrderBy(_s => _s.Key)
                        .Select(_sucursal =>
                        {
                            string tempString = $@"
                                <tr style='justify-content: space-between;'>
                                    <td class='d-inline' style='font-weight: bold; font-size: 14px;' col-span='2'>{_sucursal.Key}</td>
                                </tr>";

                            tempString += _sucursal.GroupBy(_s => _s.CuentaID).Select(_cuenta =>
                            {
                                string nombreCuenta = CuentasList.Where(reg => reg.CuentaBancoID == _cuenta.Key)
                                    .Select(reg => reg.DescripcionCuenta).FirstOrDefault();
                                decimal totalRetirosCuenta = _cuenta.Select(reg => reg.Importe)
                                    .Aggregate((lat, curr) => lat + curr);

                                string tempStringCuenta = $@"
                                <tr style='justify-content: space-between;'>
                                    <td class='d-inline' style='padding-left: 20px; font-size: 13px; width: 80%;'>{nombreCuenta}</td>
                                    <td class='d-inline' style='padding-left: 20px; font-size: 13px; width: 20%; text-align: right;'>{totalRetirosCuenta.ToString("C")}</td>
                                </tr>";

                                return tempStringCuenta;
                            }).Aggregate((lat, curr) => lat + curr);

                            decimal totalDniSucursal = _sucursal.Select(reg => reg.Importe).Aggregate((lat, curr) => lat + curr);

                            tempString += $@"<tr style='justify-content: space-between;'>
                                    <td {labelTotalStyle}>SUBTOTAL {_sucursal.Key}</td>
                                    <td {valueTotalStyle}>
                                        <div style='padding-left: 10px;'>{__separadorCantidad__}</div>
                                        <div>{totalDniSucursal.ToString("C")}</div>
                                    </td>
                                </tr>";

                            return tempString;
                        }).Aggregate((lat, curr) => lat + curr) : "";

                    balanceHtml1 = balanceHtml1.Replace("@@RowsRetiros", RetirosHTML_R);
                    balanceHtml1 = balanceHtml1.Replace("@@ImporteRetiros", SumaListasBal(0, RetirosList).ToString("C"));


                    if (DniList.Length > 0)
                    {
                        /***  SE HACE EL MAPEO DE LOS DNI AGRUPADOS POR SUCURSAL  ***/
                        string DniHTML_R = DniList.GroupBy(reg => reg.Sucursal).OrderBy(_s => _s.Key)
                            .Select(_sucursal =>
                            {
                                string tempString = $@"<tr style='justify-content: space-between;'>
                                    <td class='d-inline' style='font-weight: bold; font-size: 14px;' col-span='2'>{_sucursal.Key}</td>
                                </tr>";

                                tempString += _sucursal.Select(reg => $@"<tr style='justify-content: space-between;'>
                                    <td class='d-inline' style='font-size: 13px; width: 80%;'>{reg.Descripcion}</td>
                                    <td class='d-inline' style='font-size: 13px; width: 20%; text-align: right;'>{reg.Importe.ToString("C")}</td>
                                </tr>").Aggregate((lat, curr) => lat + curr);

                                decimal totalDniSucursal = _sucursal.Select(reg => reg.Importe).Aggregate((lat, curr) => lat + curr);

                                tempString += $@"<tr style='justify-content: space-between;'>
                                    <td {labelTotalStyle}>SUBTOTAL {_sucursal.Key}</td>
                                    <td {valueTotalStyle}>
                                        <div style='padding-left: 10px;'>{__separadorCantidad__}</div>
                                        <div>{totalDniSucursal.ToString("C")}</div>
                                    </td>
                                </tr>";

                                return tempString;
                            }).Aggregate((lat, curr) => lat + curr);

                        balanceHtml1 = balanceHtml1.Replace("@@RowsDni", DniHTML_R);
                        balanceHtml1 = balanceHtml1.Replace("@@ImporteDni", SumaListasBal(0, DniList).ToString("C"));

                    }
                    else
                    {
                        balanceHtml1 = balanceHtml1.Replace("@@ImporteDni", 0.ToString("C"));
                    }

                    /***  SON TODOS LOS CREDITOS DE TIENDITA AGRUPADOS POR SUCURSAL  ***/
                    // string TienditaHTML = TienditaList.Length > 0 ? TienditaList.GroupBy(val => val.Sucursal)
                    //     .OrderByDescending(_s => _s.Select(_t => _t.Importe).Aggregate((a, b) => a + b))
                    //     .Select(_sucursal =>
                    //     {
                    //         string tempTotal = _sucursal.Select(reg => reg.Importe).Aggregate((a, b) => a + b).ToString("C");
                    //         var totalCliente = _sucursal.Where(reg => reg.Tipo.ToUpper() == "CLIENTE").FirstOrDefault();

                    //         var totalDistribuidor = _sucursal.Where(reg => reg.Tipo.ToUpper() == "DISTRIBUIDOR").FirstOrDefault();

                    //         string tempString = $@"
                    //             <tr style='justify-content: space-between;'>
                    //                 <td class='d-inline' style='font-weight: bold; font-size: 14px; width: 20%;'>{_sucursal.Key}</td>
                    //                 <td class='d-inline' style='font-size: 13px; width: 20%; text-align: right;'>{(totalCliente != null ? totalCliente.Aprovechamiento : 0).ToString("0.##")}%</td>
                    //             ";


                    //         tempString += $@"
                    //                 <td class='d-inline' style='font-size: 13px; width: 20%; text-align: right;'>{(totalCliente != null ? totalCliente.Importe : 0).ToString("C")}
                    //                 </td>
                    //                 <td class='d-inline' style='font-size: 13px; width: 20%; text-align: right;'>{(totalDistribuidor != null ? totalDistribuidor.Importe : 0).ToString("C")}
                    //                 </td>
                    //             ";

                    //         tempString += $@"
                    //                 <td class='d-inline' style='font-size: 13px; width: 20%; text-align: right;'>{tempTotal}</td>
                    //             </tr>
                    //             ";

                    //         return tempString;
                    //     }).Aggregate((lat, curr) => lat + curr) : "";

                    // decimal ImporteTotalTienditaD = TienditaList.Length > 0 ? TienditaList.Select(tipo => tipo.Importe)
                    //     .Aggregate((decimal lat, decimal curr) => lat + curr) : 0;
                    // string ImporteTotalTiendita = ImporteTotalTienditaD.ToString("C");

                    // balanceHtml1 = balanceHtml1.Replace("@@RowsTiendita", TienditaHTML);
                    // balanceHtml1 = balanceHtml1.Replace("@@ImporteTiendita", ImporteTotalTiendita);

                    // Inicializa la variable para almacenar la suma de los importes de los clientes
                    // Inicializa las variables para almacenar la suma de los importes de los clientes y distribuidores
                    decimal ImporteClienteTotal = 0;
                    decimal ImporteDistribuidorTotal = 0;

                    // Genera las filas HTML para cada Sucursal y calcula la suma de los importes de CLIENTE y DISTRIBUIDOR
                    string TienditaHTML = TienditaList.Length > 0
                        ? TienditaList
                            .GroupBy(val => val.Sucursal)
                            .OrderByDescending(_s => _s.Sum(_t => _t.Importe)) // Ordena por la suma de los importes
                            .Select(_sucursal =>
                            {
                                // Total Importe para la Sucursal
                                decimal tempTotal = _sucursal.Sum(reg => reg.Importe);
                                string tempTotalFormatted = tempTotal.ToString("C");

                                // Obtiene el primer registro de CLIENTE y DISTRIBUIDOR
                                var totalCliente = _sucursal.FirstOrDefault(reg => reg.Tipo.ToUpper() == "CLIENTE");
                                var totalDistribuidor = _sucursal.FirstOrDefault(reg => reg.Tipo.ToUpper() == "DISTRIBUIDOR");

                                // Acumula los importes de los clientes y distribuidores para las variables correspondientes
                                if (totalCliente != null)
                                {
                                    ImporteClienteTotal += totalCliente.Importe;  // Suma el Importe de CLIENTE
                                }

                                if (totalDistribuidor != null)
                                {
                                    ImporteDistribuidorTotal += totalDistribuidor.Importe;  // Suma el Importe de DISTRIBUIDOR
                                }

                                // Genera la fila HTML para cada Sucursal
                                return $@"
                <tr style='justify-content: space-between;'>
                    <td class='d-inline' style='font-weight: bold; font-size: 14px; width: 20%;'>{_sucursal.Key}</td>
                    <td class='d-inline' style='font-size: 13px; width: 20%; text-align: right;'>
                        {(totalCliente != null ? totalCliente.Aprovechamiento : 0).ToString("0.##")}%
                    </td>
                    <td class='d-inline' style='font-size: 13px; width: 20%; text-align: right;'>
                        {(totalCliente != null ? totalCliente.Importe : 0).ToString("C")}
                    </td>
                    <td class='d-inline' style='font-size: 13px; width: 20%; text-align: right;'>
                        {(totalDistribuidor != null ? totalDistribuidor.Importe : 0).ToString("C")}
                    </td>
                    <td class='d-inline' style='font-size: 13px; width: 20%; text-align: right;'>
                        {tempTotalFormatted}
                    </td>
                </tr>";
                            })
                            .Aggregate((lat, curr) => lat + curr) // Combina todas las filas en una sola cadena
                        : "";

                    // Formatea la suma total de CLIENTE como moneda
                    string ImporteCliente = ImporteClienteTotal.ToString("C");

                    // Formatea la suma total de DISTRIBUIDOR como moneda
                    string ImporteDistribuidor = ImporteDistribuidorTotal.ToString("C");

                    // Calcula el total de Importe para todos los elementos en TienditaList
                    decimal ImporteTotalTienditaD = TienditaList.Length > 0
                        ? TienditaList.Sum(tipo => tipo.Importe) // Usando Sum para la suma total
                        : 0;

                    // Formatea el total de Importe para Tiendita
                    string ImporteTotalTiendita = ImporteTotalTienditaD.ToString("C");

                    // Reemplaza los placeholders en balanceHtml1
                    balanceHtml1 = balanceHtml1.Replace("@@RowsTiendita", TienditaHTML);
                    balanceHtml1 = balanceHtml1.Replace("@@ImporteTiendita", ImporteTotalTiendita);
                    balanceHtml1 = balanceHtml1.Replace("@@ImporteCliente", ImporteCliente);  // Reemplaza el marcador @@ImporteCliente con la suma formateada
                    balanceHtml1 = balanceHtml1.Replace("@@ImporteDistribuidor", ImporteDistribuidor);  // Reemplaza el marcador @@ImporteDistribuidor con la suma formateada

                    /***  SON TODA LA COBRANZA AGRUPADOS POR SUCURSAL  ***/
                    // var CobranzaCfHTML = CobranzaCfList.Length > 0 ? CobranzaCfList.GroupBy(val => val.Sucursal)
                    //     .Select(_sucursal =>
                    //     {
                    //         string tempString = $@"
                    //             <tr style='justify-content: space-between;'>
                    //                 <td class='d-inline' style='font-weight: bold; font-size: 14px; width: 31%;'>{_sucursal.Key}</td>
                    //             ";
                    //         tempString += _sucursal.Select(_tipo => $@"
                    //                 <td class='d-inline' style='font-size: 13px; width: 23%; text-align: right;'>{_tipo.Gestoria.ToString("C")}</td>
                    //                 <td class='d-inline' style='font-size: 13px; width: 23%; text-align: right;'>{_tipo.Ordinaria.ToString("C")}</td>
                    //                 <td class='d-inline' style='font-size: 13px; width: 23%; text-align: right;'>{_tipo.Total.ToString("C")}</td>
                    //             ").Aggregate((lat, curr) => lat + curr);

                    //         tempString += $@"
                    //             </tr>";
                    //         return tempString;
                    //     }).Aggregate((lat, curr) => lat + curr) : "";

                    // string ImporteTotalCobranzaCf = (CobranzaCfList.Length > 0 ? CobranzaCfList.Select(tipo => tipo.Total)
                    //     .Aggregate((decimal lat, decimal curr) => lat + curr) : 0).ToString("C");

                    // balanceHtml1 = balanceHtml1.Replace("@@RowsCobranzaCF", CobranzaCfHTML);
                    // balanceHtml1 = balanceHtml1.Replace("@@ImporteCobranzaCF", ImporteTotalCobranzaCf);
                    // Usamos StringBuilder para la concatenación eficiente de las filas HTML
                    StringBuilder CobranzaCfHTML = new StringBuilder();

                    // Inicializamos las variables para acumular las sumas de Gestoria y Ordinaria
                    decimal GestoriaTotal = 0;
                    decimal OrdinariaTotal = 0;

                    if (CobranzaCfList.Length > 0)
                    {
                        // Agrupar por Sucursal
                        var groupedData = CobranzaCfList.GroupBy(val => val.Sucursal);

                        foreach (var _sucursal in groupedData)
                        {
                            // Comienza la fila
                            string tempString = $@"
            <tr style='justify-content: space-between;'>
                <td class='d-inline' style='font-weight: bold; font-size: 14px; width: 31%;'>{_sucursal.Key}</td>
            ";

                            // Agrega las celdas para cada registro en la sucursal
                            foreach (var _tipo in _sucursal)
                            {
                                tempString += $@"
                <td class='d-inline' style='font-size: 13px; width: 23%; text-align: right;'>{_tipo.Gestoria.ToString("C")}</td>
                <td class='d-inline' style='font-size: 13px; width: 23%; text-align: right;'>{_tipo.Ordinaria.ToString("C")}</td>
                <td class='d-inline' style='font-size: 13px; width: 23%; text-align: right;'>{_tipo.Total.ToString("C")}</td>
            ";

                                // Acumula las sumas de Gestoria y Ordinaria
                                GestoriaTotal += _tipo.Gestoria;
                                OrdinariaTotal += _tipo.Ordinaria;
                            }

                            // Cierra la fila
                            tempString += "</tr>";

                            // Agrega la fila generada al StringBuilder
                            CobranzaCfHTML.Append(tempString);
                        }

                        // Calcular el total usando Sum en lugar de Aggregate para obtener el total de "Total"
                        decimal ImporteTotalCobranzaCfD = CobranzaCfList.Length > 0 ? CobranzaCfList.Sum(tipo => tipo.Total) : 0;

                        // Formatear el total como moneda
                        string ImporteTotalCobranzaCf = ImporteTotalCobranzaCfD.ToString("C");

                        // Formatear las sumas de Gestoria y Ordinaria como moneda
                        string GestoriaTotalFormatted = GestoriaTotal.ToString("C");
                        string OrdinariaTotalFormatted = OrdinariaTotal.ToString("C");

                        // Reemplazar los placeholders en balanceHtml1
                        balanceHtml1 = balanceHtml1.Replace("@@RowsCobranzaCF", CobranzaCfHTML.ToString());
                        balanceHtml1 = balanceHtml1.Replace("@@ImporteCobranzaCF", ImporteTotalCobranzaCf);
                        balanceHtml1 = balanceHtml1.Replace("@@GestoriaTotal", GestoriaTotalFormatted);  // Reemplaza el marcador @@GestoriaTotal con la suma formateada
                        balanceHtml1 = balanceHtml1.Replace("@@OrdinariaTotal", OrdinariaTotalFormatted);  // Reemplaza el marcador @@OrdinariaTotal con la suma formateada
                    }



                    /***  ES LA SUMA DE LAS PROTECCIONES  ***/
                    string ProteccionesHTML = "";
                    decimal ImporteTotalProteccionesD = 0;
                    string ImporteTotalProtecciones = "$0.00";

                    if (ProteccionesList.Length > 0)
                        ImporteTotalProteccionesD = ProteccionesList.Select(prot => prot.Importe)
                            .Aggregate((decimal lat, decimal curr) => lat + curr);

                    TOTAL_BALANCE += ImporteTotalProteccionesD;
                    ImporteTotalProteccionesD.ToString("C");

                    ProteccionesHTML += $@"
                            <tr style='justify-content: space-between;'>
                                <td {labelsStyle}>COBRO DE USV</td>
                                <td {valuesStyle}>{ImporteTotalProtecciones}</td>
                            </tr>";

                    balanceHtml1 = balanceHtml1.Replace("@@RowsProtecciones", ProteccionesHTML);
                    balanceHtml1 = balanceHtml1.Replace("@@ImporteProtecciones", ImporteTotalProtecciones);




                    var resTotales = await ConexionBD.database.QueryAsync<Totales>("EXEC Balances.pa_TotalCartera @0, 1", parData.BalanceSeleccionado).FirstAsync();
                    decimal TotalVencida = resTotales.TotalSaldoActual;

                    var resTotales2 = await ConexionBD.database.QueryAsync<Totales>("EXEC Balances.pa_TotalCartera @0,  2", parData.BalanceSeleccionado).FirstAsync();
                    decimal TotalNormal = resTotales2.TotalSaldoActual;

                    var resTotales3 = await ConexionBD.database.QueryAsync<Totales>("EXEC Balances.pa_TotalCartera @0,  3", parData.BalanceSeleccionado).FirstAsync();
                    decimal Total1a45 = resTotales3.TotalSaldoActual;

                    var resTotales4 = await ConexionBD.database.QueryAsync<Totales>("EXEC Balances.pa_TotalCartera @0,  4", parData.BalanceSeleccionado).FirstAsync();
                    decimal Total0 = resTotales4.TotalSaldoActual;


                    string TotalCuentasPorCobrar = (TotalVencida + TotalNormal + Total1a45 + Total0).ToString("C");

                    decimal TotalCuentas = TotalCuentasBancosD + TotalVencida + TotalNormal + Total1a45 + Total0;
                    decimal DiferenciaBalance = TotalCuentas - TOTAL_BALANCE;

                    var totalCancelaciones2 = CancelacionesListDes.Any()
    ? CancelacionesListDes.Aggregate((a, b) => new BalanceCreditosCancelados
        {
            ImporteTotal = a.ImporteTotal + b.ImporteTotal,
            Capital = a.Capital + b.Capital,
            SaldoActual = a.SaldoActual + b.SaldoActual
        })
    : new BalanceCreditosCancelados(); // objeto con ceros por defecto



                    string TotalesBalance = $@"
                            <tr style='justify-content: space-between;'>
                                <td {totalFont}>SUBTOTAL SALDO EN CUENTAS POR COBRAR</td>
                                <td {valueTotalStyle}>{TotalCuentasPorCobrar}</td>
                            </tr>
                            <tr style='justify-content: space-between;'>
                                <td {totalFont}>SUBTOTAL SALDO EN CUENTAS DE SUCURSAL</td>
                                <td {valueTotalStyle}>{TotalCuentasBancos}</td>
                            </tr>
                            <tr style='justify-content: space-between;'>
                                <td {totalFont}>SALDO TOTAL</td>
                                <td {valueTotalStyle}>
                                    {__separador__}
                                    {TotalCuentas.ToString("C")}
                                </td>
                            </tr>
                            <tr style='justify-content: space-between;'><td {totalFont}>-</td><td {valueTotalStyle}>-</td>
                             </tr>
                             <tr style='justify-content: space-between;'>
                                <td {totalFont}>TOTAL DEPOSITOS</td>
                            <td {valuesStyle}'>{SumaListasBal(0, DepositoList).ToString("C")}</td>
                            </tr>
                             <tr style='justify-content: space-between;'>
                                <td {totalFont}>TOTAL DESEMBOLSOS</td>
                            <td {valuesStyle}'>{SumaListasBal(0, DesembolsosList).ToString("C")}</td>
                            </tr>
                             <tr style='justify-content: space-between;'>
                                <td {totalFont}>TOTAL PRESTAMOS</td>
                            <td {valuesStyle}'>{SumaListasBal(0, NuevosPrestamosList).ToString("C")}</td>
                            </tr>
                             <tr style='justify-content: space-between;'>
                                <td {totalFont}>TOTAL CANCELACIONES</td>
                                <td {valuesStyle}>{totalCancelaciones2.SaldoActual.ToString("C")}</td>
                            </tr>
                            <tr style='justify-content: space-between;'>
                                                             <div style='padding-left: 10px;'>{__separadorCantidad__}</div>

                                <td {totalFont}>RESULTADO BALANCE</td>
                                <td {valueTotalStyle}>
                                 <div style='padding-left: 10px;'>{__separadorCantidad__}
                                 </div>{TOTAL_BALANCE.ToString("C")}</td>
                            </tr>
                            <tr style='justify-content: space-between;'>
                                <td {totalFont}>DIFERENCIA</td>
                                <td {valueTotalStyle}>
                                    <div style='border: 1px solid black; padding: 1px;'>
                                    {DiferenciaBalance.ToString("C")}
                                    </div>
                                </td>
                            </tr>
                        ";

                    var balanceTemporal = await ConexionBD.database.QueryAsync<BalanceTemp>("WHERE BalanceTempID = @0", parData.BalanceTempID).SingleOrDefaultAsync();

                    balanceTemporal.ResultadoBalance = TOTAL_BALANCE.ToString("C");
                    balanceTemporal.DiferenciaBalance = DiferenciaBalance.ToString("C");
                    balanceTemporal.Cartera090 = TotalNormal.ToString("C");
                    balanceTemporal.Cartera90 = TotalVencida.ToString("C");
                    balanceTemporal.BalanceVinculado = parData.BalanceSeleccionado;
                    balanceTemporal.Cartera045 = Total1a45.ToString("C");
                    balanceTemporal.Cartera0 = Total0.ToString("C");

                    // balanceTemporal.Porc90 = Total1a45 * 
                    ;

                    await ConexionBD.database.UpdateAsync(balanceTemporal);

                    balanceHtml1 = balanceHtml1.Replace("@@TOTALES_BALANCE", TotalesBalance);
// Supongamos que todos son tipo decimal
decimal TotalCuentasPorCobrar2 = TotalVencida + TotalNormal + Total1a45 + Total0;

// Construcción del HTML con porcentaje incluido


string clasifCarteraHTML = $@"
<tr style='justify-content: space-between;'>
        <td {labelsStyle}>CARTERA 0</td>
        <td {valuesStyle}>
            {Total0.ToString("C")}
            <span style='font-size: 0.8em; color: gray;'>({(TotalCuentasPorCobrar2 > 0 ? (Total0 / TotalCuentasPorCobrar2 * 100).ToString("0.##") : "0")}%)</span>
        </td>
    </tr>
    <tr style='justify-content: space-between;'>
        <td {labelsStyle}>CARTERA 1-45</td>
        <td {valuesStyle}>
            {Total1a45.ToString("C")}
            <span style='font-size: 0.8em; color: gray;'>({(TotalCuentasPorCobrar2 > 0 ? (Total1a45 / TotalCuentasPorCobrar2 * 100).ToString("0.##") : "0")}%)</span>
        </td>
    </tr>
      <tr style='justify-content: space-between;'>
        <td {labelsStyle}>CARTERA 46-90</td>
        <td {valuesStyle}>
            {TotalNormal.ToString("C")}
            <span style='font-size: 0.8em; color: gray;'>({(TotalCuentasPorCobrar2 > 0 ? (TotalNormal / TotalCuentasPorCobrar2 * 100).ToString("0.##") : "0")}%)</span>
        </td>
    </tr>
    <tr style='justify-content: space-between;'>
        <td {labelsStyle}>CARTERA VENCIDA (+90 DÍAS)</td>
        <td {valuesStyle}>
            {TotalVencida.ToString("C")}
            <span style='font-size: 0.8em; color: gray;'>({(TotalCuentasPorCobrar2 > 0 ? (TotalVencida / TotalCuentasPorCobrar2 * 100).ToString("0.##") : "0")}%)</span>
        </td>
    </tr>    
   <tr style='justify-content: space-between;'>
    <td {labelTotalStyle}> TOTAL CARTERA </td>
    <td {valueTotalStyle}>
        <div style='padding-left: 10px;'>{__separadorCantidad__}</div>
        <div>{TotalCuentasPorCobrar2.ToString("C", new System.Globalization.CultureInfo("es-MX"))}</div>
    </td>
</tr>

";



                    balanceHtml1 = balanceHtml1.Replace("@@CLASIF_CARTERA", clasifCarteraHTML);

                    string ComisionesHTML = ComisionesList
                        .Select(com => $@"
                                <tr style='justify-content: space-between;'>
                                    <td class='d-inline' style='font-size: 14px; width: 33.33%;'>{com.Sucursal}</td>
                                    <td {style33}>%{(com.MinComision).ToString("P")}</td>
                                    <td {style33}>%{(com.MaxComision).ToString("P")}</td>
                                </tr>")
                        .Aggregate((lat, curr) => lat + curr);

                    balanceHtml1 = balanceHtml1.Replace("@@RowsComisiones", ComisionesHTML);

                    string TasasSegurosHTML = TasasSegurosList
                        .Select(com => $@"
                                <tr style='justify-content: space-between;'>
                                    <td class='d-inline' style='font-size: 14px; width: 20%;'>{com.Sucursal}</td>
                                    <td {style20}>%{com.MinTasa.ToString("P")}</td>
                                    <td {style20}>%{com.MinSeguro.ToString("P")}</td>
                                    <td {style20}>{com.MaxSeguro.ToString("C")}</td>
                                    <td {style20}>{com.MinSeguro.ToString("C")}</td>
                                </tr>")
                        .Aggregate((lat, curr) => lat + curr);

                    balanceHtml1 = balanceHtml1.Replace("@@RowsTasaSeguro", TasasSegurosHTML);
                }

                string CancDesHTML = "";
                if (CancelacionesListDes.Length > 0)
                {
                    CancDesHTML += CancelacionesListDes.Select(reg => $@"
                        <tr style='justify-content: space-between;'>
                            <td class='d-inline' style='font-size: 14px; width: 5%; vertical-align: center;'>{reg.CreditoID}</td>
                            <td class='d-inline' style='font-size: 14px; width: 5%; vertical-align: center;'>{reg.DistribuidorID}</td>
                            <td class='d-inline' style='font-size: 14px; width: 20%; vertical-align: center;'>{reg.NombreCompleto}</td>
                            <td class='d-inline' style='font-size: 14px; width: 15%; vertical-align: center;'>{reg.TipoCancelacion}</td>
                            <td class='d-inline' style='font-size: 14px; width: 10%; vertical-align: center;'>{reg.UsrCancela}</td>
                            <td class='d-inline' style='font-size: 14px; width: 15%; vertical-align: center;'>{reg.MvCancelacion}</td>
                            <td class='d-inline' style='font-size: 14px; width: 10%; vertical-align: center; text-align: right;'>{reg.ImporteTotal.ToString("C")}</td>
                            <td class='d-inline' style='font-size: 14px; width: 10%; vertical-align: center; text-align: right;'>{reg.SaldoActual.ToString("C")}</td>
                            <td class='d-inline' style='font-size: 14px; width: 10%; vertical-align: center; text-align: right;'>{reg.Capital.ToString("C")}</td>
                            <td class='d-inline' style='font-size: 14px; width: 10%; vertical-align: center; text-align: right;'>0/{reg.Plazos}</td>
                        </tr>
                    ").Aggregate((lat, curr) => lat + curr);

                    var totalCancelaciones = CancelacionesListDes.Aggregate((a, b) => new BalanceCreditosCancelados
                    {
                        ImporteTotal = a.ImporteTotal + b.ImporteTotal,
                        Capital = a.Capital + b.Capital,
                        SaldoActual = a.SaldoActual + b.SaldoActual
                    });

                    CancDesHTML += $@"<tr style='justify-content: space-between;'>
                            <td class='d-inline' style='font-size: 14px; width: 10%; vertical-align: center; text-align: right;'background:rgb(255, 255, 255) !important; colspan='6'>TOTALES</td>
                            <td class='d-inline' style='font-size: 14px; width: 10%; vertical-align: center; text-align: right; background:rgb(255, 255, 255) !important;'>{totalCancelaciones.ImporteTotal.ToString("C")}</td>
                                                        <td class='d-inline' style='font-size: 14px; width: 10%; vertical-align: center; text-align: right; background:rgb(255, 255, 255) !important;'>{totalCancelaciones.SaldoActual.ToString("C")}</td>
                            <td class='d-inline' style='font-size: 14px; width: 10%; vertical-align: center; text-align: right; background:rgb(255, 255, 255) !important;'>{totalCancelaciones.Capital.ToString("C")}</td>
                        </tr>";

                }
                balanceHtml1 = balanceHtml1.Replace("@@TABLA_CANCELACIONES_DES", CancDesHTML);

                string DesgloseGastosHTML = "";
                if (DesgloseGastosList.Length > 0)
                {
                    string __estiloBordes__ = "border: 1px solid black !important; border-collapse: collapse; font-size: 9px; background: #FFFFFF !important;";

                    // DesgloseGastosTotal.Aggregate()
                    DesgloseGastosHTML += DesgloseGastosList.GroupBy(reg => new { reg.Rubro, reg.RubroGastosID })
                        .Select(rubro =>
                        {
                            string tempString = $@"
                            <div> <p style='font-size: 10px; font-weight: bold;'>RUBRO: {rubro.Key.Rubro}<p>
                            <table style='border-collapse: collapse;'>
                            ";
                            tempString += rubro.Select(gastos =>
                            {
                                string Fecha = gastos.FechaAfectacion.ToString("dd/MM/yyyy");
                                string Util = gastos.Util ? "SI" : "NO";
                                string MontoAutorizado = Math.Round(gastos.MontoAutorizado, 2).ToString("C");
                                return $@"
                                <thead>
                                <tr>
                                    <td style='width: 40px;  {__estiloBordes__} text-align: center;' rowspan='2'>{Util}</td>
                                    <td style='width: 90px;  {__estiloBordes__}'>{Fecha}</td>
                                    <td style='width: 290px; {__estiloBordes__}'>{gastos.Cuenta}</td>
                                    <td style='width: 740px; {__estiloBordes__}' rowspan='2'>{gastos.Observaciones}</td>
                                    <td style='width: 90px; {__estiloBordes__}' rowspan='2'>{gastos.Solicitante}</td>
                                    <td style='width: 90px; {__estiloBordes__}' rowspan='2'>{gastos.Autoriza}</td>
                                    <td style='width: 90px; {__estiloBordes__}' rowspan='2'>{gastos.Aplica}</td>
                                    <td style='width: 200px; {__estiloBordes__} text-align: end;' rowspan='2'>{MontoAutorizado}</td>
                                </tr>
                                <tr>
                                    <td style='{__estiloBordes__}'>{gastos.MovimientoID}</td>
                                    <td style='{__estiloBordes__}'>{gastos.SucursalNombre}</td>
                                </tr>
                                </thead>"
                                ;
                            }).Aggregate((lat, curr) => lat + curr);

                            string totalRubro = rubro.Select(reg => reg.MontoAutorizado).Aggregate((a, b) => a + b).ToString("C");
                            tempString += $@"
                                <tr>
                                    <td colspan='2' style='font-size: 9px;'>REGISTROS: {rubro.Count()}</td>
                                    <td></td>
                                    <td></td>
                                     <td></td>
                                     <td></td>
                                    <td style='text-align: end; font-size: 9px;'>TOTAL {rubro.Key.Rubro}:  </td>
                                    <td style='text-align: end; {__estiloBordes__}'>{totalRubro}</td>
                                </tr>
                            </table>
                            ";
                            return tempString;
                        }).Aggregate((lat, curr) => lat + curr);



                }
                balanceHtml1 = balanceHtml1.Replace("@@TABLA_DESGLOSE_GASTOS", DesgloseGastosHTML);



                await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")), balanceHtml1);
                listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")));

                Process p = new() { StartInfo = new ProcessStartInfo(PDF.RUTA_WKHTMLTOPDF()) };

                var ProductoObj = await ConexionBD.database.SingleOrDefaultByIdAsync<Productos>(nombreBalance.ProductoID);
                var listado_imagenes = new List<string>();


                var logo = ProductoObj.Logo;
                Guid g = Guid.NewGuid();
                var logoname = string.Concat("logo", "_" + g.ToString() + ".jpeg");
                await System.IO.File.WriteAllBytesAsync(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "LogoImg", logoname), logo);
                listado_imagenes.Add(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "LogoImg", logoname));

                string fechaActual = "\"Generado: " + DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss") + "\"";
                string logoUrl = $"https://{HttpContext.Request.Host.Value}/pdf/LogoImg/{logoname}";
                var headerPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "header-h.html");
                var headerHtml = $@"<!DOCTYPE HTML><html>
                        <body style='margin: auto; padding: 0; text-align: left; width: 100% !important;'>
                        <table>
                            <table style='width: 100%;'> 
                                <tr> 
                                    <td style='width: 33.33%;'>{DateTime.Now.ToString("dd/MM/yyyy HH:mm:ss")}</td>
                                    <td align='center'  style='width: 33.33%;'>
                                        <img style='max-height: 50px; max-width: 140px; margin-right: auto;' src='{logoUrl}' />
                                    </td>
                                    <td style='width: 33.33%; style='font-size: 8px'>.</td>
                                </tr> 
                            </table>
                        </table>
                        </body>
                    </html>";

                var footerPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "footer-f.html");
                var footerHtml = $@"<!DOCTYPE HTML><html>
                        <body style='margin: auto; padding: 0; text-align: left; width: 100% !important; height:25px !important;'></body>
                    </html>";
                listado_archivos.Add(headerPath);
                listado_archivos.Add(footerPath);

                // <img style='max-height: 50px; max-width: 140px;display: block;margin-left: auto;margin-right: auto;' src='{logoUrl}' />
                await System.IO.File.WriteAllTextAsync(headerPath, headerHtml);
                await System.IO.File.WriteAllTextAsync(footerPath, footerHtml);

                p.StartInfo.Arguments = string.Concat(
                    " --header-font-size 8 --footer-center [page]/[topage] -O landscape --encoding utf-8 --page-size Letter "
                    , "--header-html ", headerPath, "  "
                    , "--footer-html ", footerPath, "  "
                    , string.Join(" ", listado_archivos), " ",
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
                foreach (var archivo in listado_archivos) System.IO.File.Delete(archivo);

                foreach (var imagen in listado_imagenes) System.IO.File.Delete(imagen);

                // Eliminamos el PDF
                System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));

                // Enviamos el PDF a la UI
                return new FileStreamResult(pdfStream, "application/pdf");

            }
            catch (Exception err)
            {
                return BadRequest(new
                {
                    err.Message,
                    err.StackTrace
                });
            }
        }


        public decimal SumaListasBal(decimal TotalD, IntGeneralCuentas[] DataList)
        {
            if (DataList.Length == 0)
                TotalD += 0;
            else
            {
                decimal totalMain = DataList.Select(canc => canc.Importe)
                    .Aggregate((decimal lat, decimal curr) => lat + curr);

                TotalD += totalMain;
            }
            return TotalD;
        }

        public string BalanceGenerarDesglose(string HTML, IntGeneralCuentas[] DataList, string TotalRef, string ListRef, bool MostrarFecha = true)
        {

            string labelsStyle = "class='d-inline' style='font-size: 14px; width: 80%;'";
            string valuesStyle = "class='d-inline' style='font-size: 14px; width: 20%; text-align: right; vertical-align: bottom;'";

            /***  LISTADO DE INFORMACIÓN GENERICA  ***/
            string DnisHTML = "";
            if (DataList.Length == 0)
            {
                HTML = HTML.Replace(TotalRef, "$0.00");
            }
            else
            {
                decimal totalMain = DataList.Select(canc => canc.Importe)
                    .Aggregate((decimal lat, decimal curr) => lat + curr);

                string importeTotal = totalMain.ToString("C");


                HTML = HTML.Replace(TotalRef, importeTotal);

                foreach (var registro in DataList)
                {
                    // string importeDni = registro.Importe.ToString("C");
                    string importe = registro.Importe.ToString("C");
                    string fecha = MostrarFecha ? registro.FechaAfectacion?.ToString("dd/MM/yyyy") : "";
                    DnisHTML += $@"
                            <tr style='justify-content: space-between;'>
                                <td {labelsStyle}>{fecha} {registro.Descripcion}</td>
                                <td {valuesStyle}>{importe}</td>
                            </tr>";
                }
            }
            HTML = HTML.Replace(ListRef, DnisHTML);
            return HTML;
        }

    }


}

