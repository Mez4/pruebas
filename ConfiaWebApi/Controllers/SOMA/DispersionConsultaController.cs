using System.Data.Common;
using System.Net;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using System.Diagnostics; //Método de Debugusing System.Text.Json;


using DBContext.DBConfia;
using DBContext.DBConfia.Bancos;
using DBContext.DBConfia.dbo;
using DBContext.DBConfia.Custom.Tesoreria;
using DBContext.DBConfia.Custom.Creditos;
using System.Net.Http;
using System.Collections.Generic;
using System.Text.Json;
using System.Collections;
using DBContext.DBConfia.Tesoreria;
using System.Data;
using DBContext.DBConfia.Seguridad;
using registraOrden;
using System.Text.RegularExpressions;
using System.Text;
using DBContext.DBConfia.STP;
using System.Globalization;
using System.IO;
using ConfiaWebApi.Code;

namespace ConfiaWebApi.Controllers.Sistema
{
    [ApiController]
    [Route("api/SOMA/[controller]")]
    public class DispersionConsultaController : ControllerBase
    {
        // TODO::
        // Validar funcion de eliminar cuenta... ??, valido, util ?
        // Segundo, se pueden eliminar las bovedas ??, se pueden actualizar hasta que nivel? (Nombre y Clave o solo nombre?)
        /// <summary>
        /// Conexion a base de datos
        /// </summary>
        private DBConfiaContext ConexionBD;

        /// <summary>
        /// Constructor del controlador
        /// </summary>
        /// <param name="_DBContext">Conexión de datos para el controlador</param>
        public DispersionConsultaController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        [HttpGet]
        [Route("EstatusDispersiones")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> EstatusDispersiones()
        {
            try

            {

                var Estatus = await ConexionBD.database.QueryAsync<DBContext.DBConfia.STP.CatalogoEstadoDispersion>().ToArray();
                await ConexionBD.Destroy();
                return Ok(Estatus);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpGet]
        [Route("TipoCuentaBancario")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> TipoCuentaBancario()
        {
            try
            {
                var TipoCuenta = await ConexionBD.database.QueryAsync<DBContext.DBConfia.STP.CatalogoTipoCuenta>().ToArray();
                await ConexionBD.Destroy();
                return Ok(TipoCuenta);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpGet]
        [Route("CuentaOrdenante")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> CuentaOrdenante()
        {
            try
            {
                var CuentaOrd = await ConexionBD.database.QueryAsync<DBContext.DBConfia.STP.Dispersiones_VW>("SELECT DISTINCT (CuentaOrdenante) AS CuentaOrdenante FROM STP.Dispersiones_VW").ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(CuentaOrd);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpGet]
        [Route("NombreOrdenante")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> NombreOrdenante()
        {
            try
            {
                var CuentaOrd = await ConexionBD.database.QueryAsync<DBContext.DBConfia.STP.Dispersiones_VW>("SELECT DISTINCT (NombreOrdenante) AS NombreOrdenante FROM STP.Dispersiones_VW").ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(CuentaOrd);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpGet]
        [Route("imprimirdispersion")]
        [Authorize]
        public async Task<IActionResult> imprimirdispersion(int DispersionID)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");
                var listado_archivos = new List<string>();
                var Count = 0;

                var DatosDispersion = await ConexionBD.database.QueryAsync<Dispersiones_VW>("SELECT ClaveDispersionSTP, ClaveRastreo, NombreCompleto, Capital,"
                + " CuentaBeneficiario, DescripcionTipoCuenta ,BancoNombre, EstadoDisp, CausaDevolucion, FechaRegistro,"
                + " FechaActualizacion FROM STP.Dispersiones_VW", DispersionID).ToArrayAsync();

                NumberFormatInfo nfi = new CultureInfo(CultureInfo.CurrentCulture.ToString(), false).NumberFormat;
                var fila_dispersion = "";
                var DatosDetalle = "";


                foreach (var item in DatosDispersion)
                {
                    fila_dispersion += "<tr>";
                    fila_dispersion += "<td class=\"text-center fs-6\">" + item.ClaveDispersionSTP.ToString() + "</td>";
                    fila_dispersion += "<td class=\"text-center fs-6\">" + item.ClaveRastreo.ToString() + "</td>";
                    fila_dispersion += "<td class=\"text-center fs-6\">" + item.NombreCompleto.ToString() + "</td>";
                    fila_dispersion += "<td class=\"text-center fs-6\">" + item.Capital.ToString() + "</td>";
                    fila_dispersion += "<td class=\"text-center fs-6\">" + item.CuentaBeneficiario.ToString() + "</td>";
                    fila_dispersion += "<td class=\"text-center fs-6\">" + item.DescripcionTipoCuenta.ToString() + "</td>";
                    fila_dispersion += "<td class=\"text-center fs-6\">" + item.BancoNombre.ToString() + "</td>";
                    fila_dispersion += "<td class=\"text-center fs-6\">" + item.EstadoDisp.ToString() + "</td>";
                    fila_dispersion += "<td class=\"text-center fs-6\">" + item.CausaDevolucion.ToString() + "</td>";
                    fila_dispersion += "<td class=\"text-center fs-6\">" + item.FechaRegistro.ToString() + "</td>";
                    fila_dispersion += "<td class=\"text-center fs-6\">" + item.FechaActualizacion.ToString() + "</td>";
                    fila_dispersion += "</tr>";

                }

                var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Dispersion", "Caratula.html"));
                html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                html = html.Replace("@@IMPRIMIO", UsuarioActual.Nombre);
                html = html.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                html = html.Replace("@@DATOS_DETALLE", fila_dispersion);


                await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")), html);

                listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")));

                Process p = new()
                {
                    StartInfo = new ProcessStartInfo(PDF.RUTA_WKHTMLTOPDF())
                };
                p.StartInfo.Arguments = string.Concat("--footer-center [page]/[topage] -O landscape --encoding utf-8", " ",
                string.Join(" ", listado_archivos), " ", Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
                p.StartInfo.CreateNoWindow = true;
                p.Start();
                await p.WaitForExitAsync();

                var pdf = await System.IO.File.ReadAllBytesAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));

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
                await this.ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

    }
}