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
using DBContext.DBConfia.Cobranza;
using DBContext.DBConfia.Creditos;
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

namespace ConfiaWebApi.Controllers.Cobranza
{
    [Authorize]
    [ApiController]
    [Route("api/Cobranza/[controller]")]
    public class ConsultarCobranzaAppMovilController : ControllerBase
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
        public ConsultarCobranzaAppMovilController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }


        [HttpGet]
        [Route("GetProductos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetProductos()
        {
            try
            {
                var Datos = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Productos>().ToArray();
                await ConexionBD.Destroy();
                return Ok(Datos);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpGet]
        [Route("GetProductoYEmpresa")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetProductoYEmpresa()
        {
            try
            {
                var Datos = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.ProductosVW>().ToArray();
                await ConexionBD.Destroy();
                return Ok(Datos);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }
        [HttpGet]
        [Route("GetCreditos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetCreditos()
        {
            try
            {
                var Credito = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>().ToArray();
                await ConexionBD.Destroy();
                return Ok(Credito);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }
        [HttpGet]
        [Route("GetPorCobrar")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetPorCobrar()
        {
            try
            {
                var Credito = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Cobranza.PorCobrar>().ToArray();
                await ConexionBD.Destroy();
                return Ok(Credito);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("ConsultaCobranza")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ConsultaCobranza(ConfiaWebApi.PeticionesRest.Cobranza.ConsultarCobranzaAppMovil.ConsultaCobranza parData)
        {
            try
            {

                var res = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Cobranza.PorCobrar>("WHERE porCobrarId  LIKE  '%' + UPPER(@porCobrarId) +'%'"
                + " AND (creditoId  LIKE  '%' + UPPER(@creditoId) +'%')AND ((productoId = @productoId OR @productoId = 0 )AND (sucursalId = @sucursalId OR @sucursalId = 0 )"
                + " AND (cobradorAsignado = @cobradorAsignado OR @cobradorAsignado = '' ) AND (tipoCredito = @tipoCredito OR @tipoCredito = '' )"
                + " AND (estatus = @estatus OR @estatus = '' )AND (creacionFecha >= @FechaInicio OR @FechaInicio IS NULL) AND (creacionFecha <= @FechaFin OR @FechaFin IS NULL))", parData);
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();

                return BadRequest(ex.Message);
            }
        }
        [HttpGet]
        [Route("imprimircobranza")]
        [Authorize]
        public async Task<IActionResult> imprimircobranza(int porCobrarId)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");
                var listado_archivos = new List<string>();
                var Count = 0;

                var DatosCobranza = await ConexionBD.database.QueryAsync<PorCobrar>("SELECT porCobrarId,creditoId,productoId,sucursalId,cobradorAsignado,nombreCompleto,celular,"
                + " domicilio,tipoCredito,montoCobrar,montoAbonado,fechaUltimoPago,estatus,puedeRealizarQuita,quitaPorcRangoMin,quitaPorcRangoMax,creacionFecha FROM Cobranza.PorCobrar", porCobrarId).ToArrayAsync();

                NumberFormatInfo nfi = new CultureInfo(CultureInfo.CurrentCulture.ToString(), false).NumberFormat;
                var fila_dispersion = "";
                var DatosDetalle = "";


                foreach (var item in DatosCobranza)
                {
                    fila_dispersion += "<tr>";
                    fila_dispersion += "<td class=\"text-center fs-6\">" + item.porCobrarId.ToString() + "</td>";
                    fila_dispersion += "<td class=\"text-center fs-6\">" + item.creditoId.ToString() + "</td>";
                    fila_dispersion += "<td class=\"text-center fs-6\">" + item.productoId.ToString() + "</td>";
                    fila_dispersion += "<td class=\"text-center fs-6\">" + item.sucursalId.ToString() + "</td>";
                    fila_dispersion += "<td class=\"text-center fs-6\">" + item.cobradorAsignado.ToString() + "</td>";
                    fila_dispersion += "<td class=\"text-center fs-6\">" + item.nombreCompleto.ToString() + "</td>";
                    fila_dispersion += "<td class=\"text-center fs-6\">" + item.celular.ToString() + "</td>";
                    fila_dispersion += "<td class=\"text-center fs-6\">" + item.domicilio.ToString() + "</td>";
                    fila_dispersion += "<td class=\"text-center fs-6\">" + item.tipoCredito.ToString() + "</td>";
                    fila_dispersion += "<td class=\"text-center fs-6\">" + item.montoCobrar.ToString() + "</td>";
                    fila_dispersion += "<td class=\"text-center fs-6\">" + item.montoAbonado.ToString() + "</td>";
                    fila_dispersion += "<td class=\"text-center fs-6\">" + item.fechaUltimoPago.ToString() + "</td>";
                    fila_dispersion += "<td class=\"text-center fs-6\">" + item.estatus.ToString() + "</td>";
                    fila_dispersion += "<td class=\"text-center fs-6\">" + item.puedeRealizarQuita.ToString() + "</td>";
                    fila_dispersion += "<td class=\"text-center fs-6\">" + item.quitaPorcRangoMin.ToString() + "</td>";
                    fila_dispersion += "<td class=\"text-center fs-6\">" + item.quitaPorcRangoMax.ToString() + "</td>";
                    fila_dispersion += "<td class=\"text-center fs-6\">" + item.creacionFecha.ToString() + "</td>";

                    fila_dispersion += "</tr>";

                }

                var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "AppCobranza", "Caratula.html"));
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

