using System.Data.Common;
using System.Net;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;

using DBContext.DBConfia;
using DBContext.DBConfia.Tesoreria;

using System.Net.Http;
using System.Collections.Generic;
using System.Collections;
using System.Globalization;
using System.IO;
using ConfiaWebApi.Code;
using System.Diagnostics;
using DBContext.DBConfia.Custom.Tesoreria;

namespace ConfiaWebApi.Controllers.Sistema
{
    [Authorize]
    [ApiController]
    [Route("api/SOMA/[controller]")]
    public class TraspasoEntreCuentasZonalesController : ControllerBase

    {
        // TODO::
        // Validar funcion de eliminar cuenta... ??, valido, util ?
        // Segundo, se pueden eliminar las bovedas ??, se pueden actualizar hasta que nivel? (Nombre y Clave o solo nombre?)

        /// <summary>
        /// Conexion a base de datos
        /// </summary>
        private DBConfiaContext DBContext;

        /// <summary>
        /// Constructor del controlador
        /// </summary>
        /// <param name="_DBContext">Conexión de datos para el controlador</param>
        public TraspasoEntreCuentasZonalesController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("obtenerCuentasRetiro")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> cuentasMovimientosRetiro(ConfiaWebApi.PeticionesRest.SOMA.TraspasoEntreCuentasZonales.cuentasRetiro parData)
        {
            try
            {
                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
                var zona = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.General.Sucursales>(parData.SucursalID);

                parData.ProductoID = ProductoID;
                //parData.SucursalID = zona.SucursalID;

                var cuentasRetiro2 = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.TipoOperacion_VW>("WHERE CajaID=@0 AND ProductoID=@1 AND PuedeSacar = 1", parData.CajaID, parData.ProductoID).ToArrayAsync();
                await DBContext.Destroy();
                return Ok(cuentasRetiro2);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        [Route("obtenerCuentasDeposito")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> cuentasMovimientosDeposito(ConfiaWebApi.PeticionesRest.SOMA.TraspasoEntreCuentasZonales.cuentasDeposito parData)
        {
            try
            {
                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
                var zona = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.General.Sucursales>(parData.SucursalID);

                parData.ZonaID = zona.ZonaID;
                parData.ProductoID = ProductoID;
                //var cuentasRetiro = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.TipoOperacion_VW>("WHERE ProductoID = @0 AND ZonaID = @0 AND PuedeRecibir = 1", parData.ZonaID, parData.ProductoID).ToArrayAsync();
                var cuentasRetiro = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.TipoOperacion_VW>("WHERE CajaID = @0 AND ProductoID=@1 AND PuedeRecibir = 1", parData.CajaID, parData.ProductoID).ToArrayAsync();
                await DBContext.Destroy();
                return Ok(cuentasRetiro);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("TraspasoZonal")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> TraspasoZonal(ConfiaWebApi.PeticionesRest.SOMA.TraspasoEntreCuentasZonales.Traspaso parData)
        {
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            try
            {
                var obj = new { CuentaBancoID = parData.CuentaOrigenID };
                var obj2 = new { CuentaBancoID = parData.CuentaDestinoID };
                var Cuentaorigen = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Bancos.CatalogoCuentasBancos>(obj.CuentaBancoID);
                var Cuentadestino = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Bancos.CatalogoCuentasBancos>(obj2.CuentaBancoID);

                var saldoOrigenAnt = Cuentaorigen.SaldoActual;
                var saldoDestinoAnt = Cuentadestino.SaldoActual;

                var totalorigen = Cuentaorigen.SaldoActual - parData.Cantidad;
                var totaldestino = Cuentadestino.SaldoActual + parData.Cantidad;

                if (parData.CuentaOrigenID != parData.CuentaDestinoID)
                {
                    if (totalorigen >= Cuentaorigen.SaldoMinimo && totalorigen <= Cuentaorigen.SaldoMaximo)
                    {
                        if (totaldestino >= Cuentadestino.SaldoMinimo && totaldestino <= Cuentadestino.SaldoMaximo)
                        {
                            Cuentaorigen.SaldoActual = totalorigen;
                            Cuentadestino.SaldoActual = totaldestino;

                            await DBContext.database.UpdateAsync(Cuentaorigen);
                            await DBContext.database.UpdateAsync(Cuentadestino);

                            var traspaso = new DBContext.DBConfia.Bancos.MovimientosTraspasos()
                            {
                                SucursalID = parData.SucursalID,
                                CajaID = parData.CajaID,
                                FechaTraspaso = DateTime.Now,
                                Accion = "Traspaso de Cuenta: " + Cuentaorigen.NumeroCuenta + " a Cuenta: " + Cuentadestino.NumeroCuenta + " por la cantidad de: $" + parData.Cantidad,
                                PersonaID = (long)usuarioActual.PersonaID,
                                UsuarioID = usuarioActual.UsuarioID,
                                CuentaOrigenID = parData.CuentaOrigenID,
                                CuentaDestinoID = parData.CuentaDestinoID,
                                Monto = parData.Cantidad,
                                SaldoOrigenAnt = saldoOrigenAnt,
                                SaldoOrigenNvo = totalorigen,
                                SaldoDestinoAnt = saldoDestinoAnt,
                                SaldoDestinoNvo = totaldestino,
                                Concepto = parData.Concepto,
                            };
                            await DBContext.database.InsertAsync(traspaso);

                            var res = new
                            {
                                msj = "Traspaso Exitoso",
                            };
                            await DBContext.Destroy();
                            return Ok(res);
                        }
                        else
                        {
                            await DBContext.Destroy();
                            return BadRequest("CUENTA DESTINO-SALDOS EXCEDIDOS ");
                        }
                    }
                    else
                    {

                        await DBContext.Destroy();
                        return BadRequest("CUENTA ORIGEN-SALDOS EXCEDIDOS");
                    }
                }
                else
                {
                    await DBContext.Destroy();
                    return BadRequest("LAS CUENTAS DEBEN SER DIFERENTES");
                }

            }

            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("imprimir-traspaso")]
        [Authorize]
        [Code.TProteccionProducto]

        public async Task<ActionResult> ImprimirTraspaso(PeticionesRest.SOMA.TraspasoEntreCuentasZonales.Imprimir parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            int ProductoID = 9999;
            int.TryParse(Request.Headers["ProductoID"], out ProductoID);

            var obj = new { CuentaBancoID = parData.CuentaOrigenID };
            var obj2 = new { CuentaBancoID = parData.CuentaDestinoID };
            var obj3 = new { CuentaBancoId = parData.CuentaOrigenID };
            var obj4 = new { CuentaBancoId = parData.CuentaDestinoID };
            var Cuentaorigen = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Bancos.CatalogoCuentasBancos>(obj.CuentaBancoID);
            var Cuentadestino = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Bancos.CatalogoCuentasBancos>(obj2.CuentaBancoID);
            var cajaOrigen = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.TipoOperacion_VW>("WHERE CuentaBancoId=@0", obj3.CuentaBancoId).SingleOrDefaultAsync();
            var cajaDestino = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.TipoOperacion_VW>("WHERE CuentaBancoId=@0", obj4.CuentaBancoId).SingleOrDefaultAsync();
            var Producto = await DBContext.database.SingleOrDefaultByIdAsync<DBContext.DBConfia.Creditos.Productos>(ProductoID);

            var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");
            var listado_archivos = new List<string>();
            var Count = 0;
            var headerConDetalle = "";
            var DatosConDetalle = "";
            var FooterDetalle = "";
            var listado_imagenes = new List<string>();
            var logo = Producto.Logo;

            Guid g = Guid.NewGuid();
            CultureInfo myCI = new CultureInfo("en-US", false);

            var logoname = string.Concat("logo", "_" + g.ToString() + ".jpeg");
            await System.IO.File.WriteAllBytesAsync(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "LogoImg", logoname), logo);
            listado_imagenes.Add(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "LogoImg", logoname));

            var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Polizas", "Traspaso.html"));

            headerConDetalle += "<tr>";
            headerConDetalle += "<th class=\"text-center fs-6\" style=\"width: 18% !important;\">" + "Cuenta Origen" + "</th>";
            headerConDetalle += "<th class=\"text-center fs-6\" style=\"width: 18% !important;\">" + "Cuenta Destino" + "</th>";
            headerConDetalle += "<th class=\"text-center fs-6\" style=\"width: 18% !important;\">" + "Concepto" + "</th>";
            headerConDetalle += "<th class=\"text-center fs-6\" style=\"width: 16% !important;\">" + "Cargo" + "</th>";
            headerConDetalle += "<th class=\"text-center fs-6\" style=\"width: 16% !important;\">" + "Abono" + "</th>";
            headerConDetalle += "</tr>";

            DatosConDetalle += "<tr>";
            DatosConDetalle += "<td class=\"text-center fs-6\"style=\"text-align: center\">" + parData.CuentaOrigenID + ": " + cajaOrigen.NombreCaja.ToString() + " - Nº Cta: " + Cuentaorigen.NumeroCuenta.ToString() + " - " + cajaOrigen.TipoMovimiento.ToString() + "</td>";
            DatosConDetalle += "<td class=\"text-center fs-6\"style=\"text-align: center\">" + " - " + "</td>";
            DatosConDetalle += "<td class=\"text-center fs-6\"style=\"text-align: center\">" + parData.Concepto.ToString() + "</td>";
            DatosConDetalle += "<td class=\"text-center fs-6\"style=\"text-align: center\">" + "-" + parData.Cantidad.ToString("C", new CultureInfo("en-US")) + "</td>";
            DatosConDetalle += "<td class=\"text-center fs-6\">" + "  " + "</td>";
            DatosConDetalle += "</tr>";

            FooterDetalle += "<tr>";
            FooterDetalle += "<td class=\"text-center fs-6\"style=\"text-align: center\">" + " - " + "</td>";
            FooterDetalle += "<td class=\"text-center fs-6\"style=\"text-align: center\">" + parData.CuentaDestinoID + ": " + cajaDestino.NombreCaja.ToString() + " - Nº Cta: " + Cuentadestino.NumeroCuenta.ToString() + " - " + cajaDestino.TipoMovimiento.ToString() + "</td>";
            FooterDetalle += "<td class=\"text-center fs-6\"style=\"text-align: center\">" + parData.Concepto.ToString() + "</td>";
            FooterDetalle += "<td class=\"text-center fs-6\">" + "  " + "</td>";
            FooterDetalle += "<td class=\"text-center fs-6\"style=\"text-align: center\">" + parData.Cantidad.ToString("C", new CultureInfo("en-US")) + "</td>";
            FooterDetalle += "</tr>";

            html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
            html = html.Replace("@@IMPRIMIO", UsuarioActual.Nombre);
            html = html.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
            html = html.Replace("@@HEADER_DETALLE", headerConDetalle);
            html = html.Replace("@@DATOS_DETALLE", DatosConDetalle);
            html = html.Replace("@@FOOTER_DETALLE", FooterDetalle);
            html = html.Replace("@@LOGO", logoname);

            try
            {

                await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")), html);

                listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")));
                // Ejecutamos el proceso de wkhtmltopdf
                Process p = new()
                {
                    StartInfo = new ProcessStartInfo(PDF.RUTA_WKHTMLTOPDF())
                };
                p.StartInfo.Arguments = string.Concat("-O landscape --encoding utf-8", " ",
                string.Join(" ", listado_archivos), " ",
                Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
                p.StartInfo.CreateNoWindow = true;
                p.Start();
                await p.WaitForExitAsync();

                // Obtenemos el contenido de nuestro archivo de PDF
                var pdf = await System.IO.File.ReadAllBytesAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
                //var pdf = await System.IO.File.ReadAllBytesAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF_signed.pdf")));

                // Obtenemos nuestro PDF
                var pdfStream = new MemoryStream();
                pdfStream.Write(pdf, 0, pdf.Length);
                pdfStream.Position = 0;

                // Limpiamos los archivos que se utilizaron
                foreach (var archivo in listado_archivos)
                    System.IO.File.Delete(archivo);

                // Eliminamos el PDF
                System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
                //System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF_signed.pdf")));

                // Enviamos el PDF a la UI
                return new FileStreamResult(pdfStream, "application/pdf");
            }
            catch (Exception ex)
            {
                return BadRequest("Error al ingresar el movimiento: " + ex.Message);
            }

        }

    }
}