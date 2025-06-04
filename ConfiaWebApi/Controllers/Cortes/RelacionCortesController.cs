using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Cortes;
using System.Collections.Generic;
using DBContext.DBConfia.Custom.Creditos;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Draw;
using iText.Kernel.Pdf.Canvas;
using iText.Layout;
using iText.Kernel.Geom;
using iText.Layout.Element;
using System.IO;
using iText.IO.Image;
using Microsoft.AspNetCore.Hosting;
using iText.Layout.Properties;
using iText.Layout.Borders;
using iText.Kernel.Colors;
using ConfiaWebApi.Code;
using System.Globalization;
using DBContext.DBConfia.dbo;
using System.Diagnostics;
using Path = System.IO.Path;
using System.Web;
using MimeKit;
using MailKit.Net.Smtp;
using MimeKit.Text;
using MailKit.Security;
using Newtonsoft.Json;
using ConfiaWebApi.RespuestasPersonalizadas.Distribuidores.Lealtad;
using Microsoft.Extensions.Configuration;
using DBContext.DBConfia.Catalogos;
using System.Drawing.Imaging;
using ConfiaWebApi.ModlesSP.Creditos;
using ConfiaWebApi.ModlesSP.Cortes;
using ConfiaWebApi.PeticionesRest.SOMA.AprobacionSolicitudUniforme;
using DBContext.DBConfia.Distribuidores;
using System.ComponentModel;

namespace ConfiaWebApi.Controllers.Cortes
{
    [Authorize]
    [ApiController]
    [Route("api/Cortes/[controller]")]
    [KeycloakSecurityAttributes(new string[] { "CREDITOS" })]
    public class RelacionCortesController : ControllerBase
    {
        private DBConfiaContext ConexionBD;
        private IConfiguration Configuracion;

        private readonly IWebHostEnvironment _env;

        public RelacionCortesController(IConfiguration _Configuration, DBConfiaContext _DBContext, IWebHostEnvironment env)
        {
            ConexionBD = _DBContext;
            this.Configuracion = _Configuration;
            _env = env;
        }

        //protected Bitmap Barcode(string codigo) {
        //    BarcodeWriter br = new();
        //    br.Format = BarcodeFormat.CODE_128;
        //    Bitmap bm = new(br.Write(codigo), 300, 300);
        //    return bm;
        //}

        [HttpPost]
        [Route("recalculo")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> Recalculo(PeticionesRest.Cortes.Relacion.Recalculo parData)
        {

            try
            {
                //var userName = HttpContext.User.Claims.Where(x => x.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier").FirstOrDefault().Value;

                //var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                //var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                //parData.UsuarioID = UsuarioActual.UsuarioID;

                //DBContext.database.BeginTransaction();
                Distribuidores_VW Distribuidores_Consulta = null;
                if (parData.SucursalID == 0)
                {
                    Distribuidores_Consulta = await ConexionBD.database.QueryAsync<Distribuidores_VW>("WHERE DistribuidorID=@0", parData.DistribuidorID).FirstOrDefaultAsync();
                    parData.SucursalID = Distribuidores_Consulta.SucursalID;
                }

                parData.swForzar = false;
                parData.regresa = 0;
                parData.msj = "";

                string Stored = "EXEC Cortes.pa_RelacionCortesRecalculo_Ins @fechaCorte, @SucursalID, @DistribuidorID, @swForzar, @regresa, @msj";

                var res = await ConexionBD.database.QueryAsync<RelacionCortesRecalculooRes>(Stored, parData).FirstOrDefaultAsync();

                //if (res.regresa != 1)
                //{
                //    DBContext.database.AbortTransaction();
                //}

                await ConexionBD.Destroy();

                return Ok(res);

            }
            catch (Exception ex)
            {
                //DBContext.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        [Route("print")]
        [Authorize]
        [TProteccionProducto]
        public async Task<IActionResult> Print(PeticionesRest.Cortes.Relacion.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                parData.ProductoID = producto;
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                // var UsuarioActual = await ConexionBD.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
                // var PersonaActual = await ConexionBD.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.ID).FirstOrDefaultAsync();

                var Producto = await ConexionBD.database.SingleOrDefaultByIdAsync<Productos>(parData.ProductoID);
                var Sucursal = await ConexionBD.database.QueryAsync<Sucursales_VW>("WHERE SucursalID = @SucursalID", parData).SingleOrDefaultAsync();

                // var RelacionCortes = await ConexionBD.database.QueryAsync<RelacionCortes_VW>("WHERE (SucursalID = @0) AND (fechaCorte = CONVERT(DATETIME, @1, 103)) AND DistribuidorID IN (@2)", parData.SucursalID, parData.fecha, parData.Distribuidores).OrderBy(x => x.DistribuidorID).ToArrayAsync();
                // var RelacionCortesDetalle = await ConexionBD.database.QueryAsync<RelacionCortesDetalle_VW>("WHERE (SucursalID = @0) AND (DistribuidorID IN (@1)) AND (saldoPlazo > 1) AND (fechaCorte = CONVERT(DATETIME, @2, 103))", parData.SucursalID, parData.Distribuidores, parData.fecha).OrderBy(x => x.DistribuidorID).ToArrayAsync();

                var RelacionCortes = await ConexionBD.database.QueryAsync<RelacionCortes_VW>("WHERE (ProductoID = @0) AND (SucursalID = @1) AND (fechaCorte = CONVERT(DATETIME, @2, 103)) AND DistribuidorID IN (@3)", parData.ProductoID, parData.SucursalID, parData.fecha, parData.Distribuidores).OrderBy(x => x.DistribuidorID).ToArrayAsync();
                var RelacionCortesDetalle = await ConexionBD.database.QueryAsync<RelacionCortesDetalle_VW>("WHERE (SucursalID = @0) AND (DistribuidorID IN (@1)) AND (saldoPlazo >= 0) AND (fechaCorte = CONVERT(DATETIME, @2, 103)) ", parData.SucursalID, parData.Distribuidores, parData.fecha, producto).OrderBy(x => x.DistribuidorID).ToArrayAsync();
                var Corresponsales = await ConexionBD.database.FetchAsync<Corresponsales_VW>("WHERE (Activo = 1)");


                var token = JsonConvert.DeserializeObject<Auth>(ConfiaShop.LealtadAuth("jjaramillo@fconfia.com", "jjaramillo"));

                var variale = await ConexionBD.database.QueryAsync<VariablesGlobales>("WHERE  (varName = @0)", "RELACIONES_LIMITE_DETALLE").FirstOrDefaultAsync();

                var DscDistribuidor = await ConexionBD.database.QueryAsync<VariablesGlobales>("WHERE (varName = @0)", "DESCRIPCION_DISTRIBUIDOR").FirstOrDefaultAsync();

                int limiteReg = int.Parse(variale.varValue.ToString());

                // Generamos un prefijo del nombre de archivo
                var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");
                var listado_archivos = new List<string>();
                var listado_imagenes = new List<string>();
                var Count = 0;

                var ColorPS = "#1DA1F2";
                var ColorCONFIA = "#9ACD32";

                var logo = Producto.Logo;

                Guid g = Guid.NewGuid();

                var logoname = string.Concat("logo", "_" + g.ToString() + ".jpeg");

                await System.IO.File.WriteAllBytesAsync(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "LogoImg", logoname), logo);

                listado_imagenes.Add(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "LogoImg", logoname));

                NumberFormatInfo nfi = new CultureInfo(CultureInfo.CurrentCulture.ToString(), false).NumberFormat;
                nfi.PercentDecimalDigits = 0;

                if (parData.tipo == 1)
                {
                    if (parData.formato == 1)
                    {
                        parData.formato = 3;
                    }
                    else if (parData.formato == 2)
                    {
                        parData.formato = 6;
                    }
                    else
                    {
                        parData.formato = 8;
                    }

                    foreach (var RelacionCorte in RelacionCortes)
                    {

                        parData.DistribuidorID = RelacionCorte.DistribuidorID;

                        //var FechaCorte = DateTime.ParseExact(parData.fecha, "dd/MM/yyyy", CultureInfo.InvariantCulture);

                        //var RelacionCorte = await DBContext.database.QueryAsync<RelacionCortes_VW>("WHERE (SucursalID = @SucursalID) AND (DistribuidorID = @DistribuidorID) AND (fechaCorte = CONVERT(DATETIME, @fecha, 103))", parData).FirstOrDefaultAsync();

                        if (RelacionCorte != null)
                        {
                            Count++;

                            decimal monedero = 0;

                            /*var lealtad = JsonConvert.DeserializeObject<List<Get>>(ConfiaShop.LealtadSel(token.token, RelacionCorte.DistribuidorID));

                            if (lealtad.Count > 0)
                            {
                                monedero = lealtad[0].saldo;
                            }*/

                            //var RelacionCortesDetalle = await DBContext.database.FetchAsync<RelacionCortesDetalle_VW>("WHERE (SucursalID = @SucursalID) AND (DistribuidorID = @DistribuidorID) AND (fechaCorte = CONVERT(DATETIME, @fecha, 103))", parData);

                            parData.DistribuidorNivelID = RelacionCorte.DistribuidorNivelID.Value;

                            parData.DistribuidorNivelIDOrigen = RelacionCorte.DistribuidorNivelIDOrigen.Value;

                            //parData.DistribuidorNivelID = (Producto.EmpresaId == 6) ? RelacionCorte.DistribuidorNivelID2.Value : RelacionCorte.DistribuidorNivelID.Value;



                            var RelacionCortesTablaDias = await ConexionBD.database.FetchAsync<RelacionCortesTablaDias_VW>("WHERE  (fechaCorte = CONVERT(DATETIME, @fecha, 103)) AND (DistribuidorNivelID = @DistribuidorNivelID) AND (DistribuidorNivelIDOrigen = @DistribuidorNivelIDOrigen) AND (Renglon <= @formato) AND (ProductoID = @ProductoID) AND (SucursalID = @SucursalID)", parData);

                            UsuarioActual.Nombre = HttpUtility.HtmlEncode(UsuarioActual.Nombre);
                            //StringExtensions.SinTildes(RelacionCortes.NombreCompleto);

                            // Obtenemos el HTML de nuestro contrato
                            //var path = Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Relacion", "Caratula", "Caratula.html");
                            var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Relacion", "Caratula.html"));
                            html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                            html = html.Replace("@@IMPRIMIO", UsuarioActual.Nombre.ToString());
                            html = html.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                            html = html.Replace("@@ID_DIST", RelacionCorte.DistribuidorID.ToString());
                            //html = html.Replace("@@ID_DIST", Producto.EmpresaId == 6 ? RelacionCorte.DistAntNumero2.ToString() : RelacionCorte.DistAntNumero.ToString());
                            html = html.Replace("@@NOMBRE_DIST", RelacionCorte.NombreCompleto.ToUpper());
                            html = html.Replace("@@TELEFONO_DIST", RelacionCorte.TelefonoMovil);
                            html = html.Replace("@@FECHA_CORTE", RelacionCorte.fechaCorte/*.ToString("dd/MM/yyyy")*/);
                            html = html.Replace("@@ACUMULADO", monedero.ToString("C", CultureInfo.CurrentCulture));
                            html = html.Replace("@@LIMITE", RelacionCorte.LineaCredito.Value.ToString("C", CultureInfo.CurrentCulture));
                            html = html.Replace("@@COLOCADO", RelacionCorte.Colocado.Value.ToString("C", CultureInfo.CurrentCulture));
                            html = html.Replace("@@DISPONIBLE", RelacionCorte.LineaCreditoDisponible.Value.ToString("C", CultureInfo.CurrentCulture));
                            html = html.Replace("@@NIVEL", RelacionCorte.DistribuidorNivel);
                            html = html.Replace("@@PUNTOS", "0");
                            html = html.Replace("@@MONTO", "0");
                            html = html.Replace("@@SALDO", "0");
                            html = html.Replace("@@SUCURSAL", Sucursal.Nombre);
                            html = html.Replace("@@DscDist", DscDistribuidor.varValue.ToString());
                            html = html.Replace("@@LOGO", logoname);
                            html = html.Replace("@@ESLOGAN", Producto.EmpresaId == 6 ? "" : "Donde m&aacute;s ganas");
                            html = html.Replace("@@COLOR", Producto.EmpresaId == 6 ? ColorPS : ColorCONFIA);
                            if (Count == 1)
                            {
                                html = html.Replace("@@JQUERY", "<script type=\"text/javascript\" src=\"https://code.jquery.com/jquery.min.js\"></script>");
                            }
                            else
                            {
                                html = html.Replace("@@JQUERY", "");
                            }

                            var registros_detalle = 0;
                            decimal importeT = 0;
                            decimal saldoT = 0;
                            decimal atrasoT = 0;
                            decimal pagoT = 0;
                            decimal pagoCom = 0;
                            decimal remanenteT = 0;

                            var c = 0;
                            decimal importe = 0;
                            decimal saldo = 0;
                            decimal atraso = 0;
                            decimal pago = 0;
                            decimal remanente = 0;

                            var fila_relacion_detalle = "";
                            var fila_relacion_detalle_2 = "";

                            var Productos = RelacionCortesDetalle.Where(x => x.DistribuidorID == RelacionCorte.DistribuidorID).OrderBy(x => x.ProductoID).GroupBy(x => x.ProductoID).Select(x => x.First()).ToArray();

                            var FstProd = true;

                            var second_table = "";

                            var detailRead = false;

                            foreach (var ProdDetalle in Productos)
                            {
                                fila_relacion_detalle_2 = "";
                                c = 0;
                                importe = 0;
                                saldo = 0;
                                atraso = 0;
                                pago = 0;
                                remanente = 0;

                                if (!FstProd)
                                {
                                    second_table += "</tfoot>";
                                    second_table += "</table>";
                                    second_table += "</div>";
                                    second_table += "</div>";
                                    // second_table += "<br>";
                                }

                                foreach (var detalle in RelacionCortesDetalle.Where(x => x.DistribuidorID == RelacionCorte.DistribuidorID && x.ProductoID == ProdDetalle.ProductoID))
                                {
                                    registros_detalle += 1;
                                    importeT += detalle.ImporteTotal.Value;
                                    saldoT += detalle.saldoCredito.Value;
                                    atrasoT += detalle.saldoAtrasado.Value;
                                    pagoT += detalle.importePlazo.Value;
                                    pagoCom += detalle.SaldoComisionPlazo.Value;
                                    remanenteT += Math.Abs(detalle.SldDspPago.Value);

                                    c += 1;
                                    importe += detalle.ImporteTotal.Value;
                                    saldo += detalle.saldoCredito.Value;
                                    atraso += detalle.saldoAtrasado.Value;
                                    pago += detalle.importePlazo.Value;
                                    remanente += Math.Abs(detalle.SldDspPago.Value);

                                    if (registros_detalle < (limiteReg + 1) && FstProd)
                                    {
                                        fila_relacion_detalle += "<tr>";
                                        fila_relacion_detalle += "<td class=\"text-center fs-6\">" + detalle.FechaCanje?.ToString("dd/MM/yyyy") + "</td>";
                                        //fila_relacion_detalle += "<td class=\"text-center fs-6\">" + HttpUtility.HtmlEncode(detalle.Nombre) + "</td>";
                                        fila_relacion_detalle += "<td class=\"text-center fs-6\">" + detalle.CreditoID.ToString() + "</td>";
                                        fila_relacion_detalle += "<td class=\"text-center fs-6\">" + detalle.ValeCanje?.ToString() + "</td>";
                                        fila_relacion_detalle += "<td colspan=\"2\" class=\"text-center\" style=\"font-size:13px;\">" + HttpUtility.HtmlEncode(detalle.Cliente) + "</td>";
                                        fila_relacion_detalle += "<td class=\"text-center fs-6\">" + detalle.ImporteTotal?.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                        fila_relacion_detalle += "<td class=\"text-center fs-6\">" + detalle.saldoCredito?.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                        fila_relacion_detalle += "<td class=\"text-center fs-6\">" + detalle.saldoAtrasado?.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                        fila_relacion_detalle += "<td class=\"text-center fs-6\">" + detalle.importePlazo?.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                        fila_relacion_detalle += "<td class=\"text-center fs-6\">" + detalle.SldDspPago?.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                        fila_relacion_detalle += "<td class=\"text-center\" style=\"font-size:13px;\">" + detalle.PagoPlazo + "</td>";
                                        fila_relacion_detalle += "</tr>";
                                    }
                                    else
                                    {
                                        fila_relacion_detalle_2 += "<tr>";
                                        fila_relacion_detalle_2 += "<td class=\"text-center fs-6\">" + detalle.FechaCanje?.ToString("dd/MM/yyyy") + "</td>";
                                        //fila_relacion_detalle += "<td class=\"text-center fs-6\">" + HttpUtility.HtmlEncode(detalle.Nombre) + "</td>";
                                        fila_relacion_detalle_2 += "<td class=\"text-center fs-6\">" + detalle.CreditoID.ToString() + "</td>";
                                        fila_relacion_detalle_2 += "<td class=\"text-center fs-6\">" + detalle.ValeCanje?.ToString() + "</td>";
                                        fila_relacion_detalle_2 += "<td colspan=\"2\" class=\"text-center\" style=\"font-size:13px;\">" + HttpUtility.HtmlEncode(detalle.Cliente) + "</td>";
                                        fila_relacion_detalle_2 += "<td class=\"text-center fs-6\">" + detalle.ImporteTotal?.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                        fila_relacion_detalle_2 += "<td class=\"text-center fs-6\">" + detalle.saldoCredito?.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                        fila_relacion_detalle_2 += "<td class=\"text-center fs-6\">" + detalle.saldoAtrasado?.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                        fila_relacion_detalle_2 += "<td class=\"text-center fs-6\">" + detalle.importePlazo?.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                        fila_relacion_detalle_2 += "<td class=\"text-center fs-6\">" + detalle.SldDspPago?.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                        fila_relacion_detalle_2 += "<td class=\"text-center\" style=\"font-size:13px;\">" + detalle.PagoPlazo + "</td>";
                                        fila_relacion_detalle_2 += "</tr>";
                                    }
                                }

                                if (FstProd)
                                {
                                    html = html.Replace("@@DETALLE_RELACION", fila_relacion_detalle);

                                    html = html.Replace("@@PRODUCTO", ProdDetalle.Producto);
                                    html = html.Replace("@@COUNT", c.ToString());
                                    html = html.Replace("@@TIMPORTE", importe.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@TSALDO", saldo.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@TATRASO", atraso.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@TPAGO", pago.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@TREMANENTE", remanente.ToString("C", CultureInfo.CurrentCulture));

                                    if (Productos.Length > 1 || registros_detalle > limiteReg)
                                    {
                                        html = html.Replace("@@GRAN_TOTAL", "");
                                    }
                                    else
                                    {
                                        var grantotal = "<tr>";
                                        grantotal += "<th class=\"text-center fs-6\" colspan=\"4\" scope=\"row\">TOTAL</th> ";
                                        grantotal += "<th class=\"text-center fs-6\">REGISTROS: @@TCOUNT</th>";
                                        grantotal += "<th class=\"text-center fs-6\">@@TTIMPORTE</th>";
                                        grantotal += "<th class=\"text-center fs-6\">@@TTSALDO</th>";
                                        grantotal += "<th class=\"text-center fs-6\">@@TTATRASO</th>";
                                        grantotal += "<th class=\"text-center fs-6\">@@TTPAGO</th>";
                                        grantotal += "<th class=\"text-center fs-6\">@@TTREMANENTE</th>";
                                        grantotal += "<th></th>";
                                        grantotal += "</tr>";

                                        grantotal = grantotal.Replace("@@TCOUNT", registros_detalle.ToString());
                                        grantotal = grantotal.Replace("@@TTIMPORTE", importeT.ToString("C", CultureInfo.CurrentCulture));
                                        grantotal = grantotal.Replace("@@TTSALDO", saldoT.ToString("C", CultureInfo.CurrentCulture));
                                        grantotal = grantotal.Replace("@@TTATRASO", atrasoT.ToString("C", CultureInfo.CurrentCulture));
                                        grantotal = grantotal.Replace("@@TTPAGO", pagoT.ToString("C", CultureInfo.CurrentCulture));
                                        grantotal = grantotal.Replace("@@TTREMANENTE", remanenteT.ToString("C", CultureInfo.CurrentCulture));

                                        html = html.Replace("@@GRAN_TOTAL", grantotal);
                                    }

                                    // Guardamos los archivos temporalmente
                                    await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")), html);

                                    listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")));
                                }

                                if (registros_detalle > limiteReg || !FstProd)
                                {
                                    if (!detailRead)
                                    {
                                        html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Relacion", "Detalle.html"));
                                        html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                                        html = html.Replace("@@LOGO", logoname);
                                        second_table = "<div>";
                                        detailRead = false;
                                    }
                                    // second_table += "<div class=\"row m-0 mb-2 d-table-row\"><div class=\"col-sm-12  ps-3 pe-3 w-100 d-table-cell\"><strong>@@PRODUCTO</strong></div></div>";
                                    second_table += "<div class=\"row m-0 mb-2 d-table-row\">";
                                    second_table += "<div class=\"col-sm-12 text-center ps-3 pe-3 w-100 d-table-cell\">";
                                    second_table += "<table class=\"table table-sm\" style=\"border: #ffffff;\">";
                                    second_table += "<thead><tr><th class=\"text-center fs-6\" scope=\"col\">Fecha Canje</th>";
                                    second_table += "<th class=\"text-center fs-6\" scope=\"col\">Cr&eacute;dito</th>";
                                    second_table += "<th class=\"text-center fs-6\" scope=\"col\">Folio Vale</th>";
                                    second_table += "<th class=\"text-center fs-6\" scope=\"col\" colspan=\"2\">Cliente</th>";
                                    second_table += "<th class=\"text-center fs-6\" scope=\"col\">Importe</th>";
                                    second_table += "<th class=\"text-center fs-6\" scope=\"col\">Saldo</th>";
                                    second_table += "<th class=\"text-center fs-6\" scope=\"col\">Atraso</th>";
                                    second_table += "<th class=\"text-center fs-6\" scope=\"col\">Pago</th>";
                                    second_table += "<th class=\"text-center fs-6\" scope=\"col\">Sld Dsp P</th>";
                                    second_table += "<th class=\"text-center fs-6\" scope=\"col\">Plazo</th></tr></thead>";
                                    second_table += "<tbody>@@DETALLE_RELACION_2</tbody>";
                                    second_table += "<tfoot><tr>";
                                    second_table += "<th class=\"text-center fs-6\" colspan=\"4\" scope=\"row\">TOTAL @@PRODUCTO</th>";
                                    second_table += "<th class=\"text-center fs-6\">REGISTROS: @@COUNT</th>";
                                    second_table += "<th class=\"text-center fs-6\">@@TIMPORTE</th>";
                                    second_table += "<th class=\"text-center fs-6\">@@TSALDO</th>";
                                    second_table += "<th class=\"text-center fs-6\">@@TATRASO</th>";
                                    second_table += "<th class=\"text-center fs-6\">@@TPAGO</th>";
                                    second_table += "<th class=\"text-center fs-6\">@@TREMANENTE</th>";
                                    second_table += "<th></th></tr>";
                                    // second_table += "</tfoot>";
                                    // second_table += "</table>";
                                    // second_table += "</div>";
                                    // second_table += "</div>";
                                    // second_table += "<br>";

                                    second_table = second_table.Replace("@@DETALLE_RELACION_2", fila_relacion_detalle_2);

                                    second_table = second_table.Replace("@@PRODUCTO", ProdDetalle.Producto);
                                    second_table = second_table.Replace("@@COUNT", c.ToString());
                                    second_table = second_table.Replace("@@TIMPORTE", importe.ToString("C", CultureInfo.CurrentCulture));
                                    second_table = second_table.Replace("@@TSALDO", saldo.ToString("C", CultureInfo.CurrentCulture));
                                    second_table = second_table.Replace("@@TATRASO", atraso.ToString("C", CultureInfo.CurrentCulture));
                                    second_table = second_table.Replace("@@TPAGO", pago.ToString("C", CultureInfo.CurrentCulture));
                                    second_table = second_table.Replace("@@TREMANENTE", remanente.ToString("C", CultureInfo.CurrentCulture));

                                }

                                FstProd = false;
                            }

                            if (registros_detalle > limiteReg || Productos.Length > 1)
                            {
                                // second_table += "<tfoot>";
                                second_table += "<tr>";
                                second_table += "<th class=\"text-center fs-6\" colspan=\"4\" scope=\"row\">TOTAL</th> ";
                                second_table += "<th class=\"text-center fs-6\">REGISTROS: @@TCOUNT</th>";
                                second_table += "<th class=\"text-center fs-6\">@@TTIMPORTE</th>";
                                second_table += "<th class=\"text-center fs-6\">@@TTSALDO</th>";
                                second_table += "<th class=\"text-center fs-6\">@@TTATRASO</th>";
                                second_table += "<th class=\"text-center fs-6\">@@TTPAGO</th>";
                                second_table += "<th class=\"text-center fs-6\">@@TTREMANENTE</th>";
                                second_table += "<th></th>";
                                second_table += "</tr>";
                                second_table += "</tfoot>";


                                second_table += "</table>";
                                second_table += "</div>";
                                second_table += "</div>";
                                // second_table += "<br>";
                                second_table += "</div>";

                                second_table = second_table.Replace("@@TCOUNT", registros_detalle.ToString());
                                second_table = second_table.Replace("@@TTIMPORTE", importeT.ToString("C", CultureInfo.CurrentCulture));
                                second_table = second_table.Replace("@@TTSALDO", saldoT.ToString("C", CultureInfo.CurrentCulture));
                                second_table = second_table.Replace("@@TTATRASO", atrasoT.ToString("C", CultureInfo.CurrentCulture));
                                second_table = second_table.Replace("@@TTPAGO", pagoT.ToString("C", CultureInfo.CurrentCulture));
                                second_table = second_table.Replace("@@TTREMANENTE", remanenteT.ToString("C", CultureInfo.CurrentCulture));

                                // var total_table  = "<div class=\"row m-0 mb-2 d-table-row\">";
                                // total_table  += "<div class=\"col-sm-12 text-center ps-3 pe-3 w-100 d-table-cell\">";
                                // total_table += "<table class=\"table table-sm\" style=\"border: #ffffff;\">";
                                // total_table += "<thead>";
                                // total_table += "<tr>";
                                // total_table += "<th class=\"text-center fs-6\" scope=\"col\">Fecha Canje</th>";
                                // total_table += "<th class=\"text-center fs-6\" scope=\"col\">Cr&eacute;dito</th>";
                                // total_table += "<th class=\"text-center fs-6\" scope=\"col\">Folio Vale</th>";
                                // total_table += "<th class=\"text-center fs-6\" scope=\"col\" colspan=\"2\">Cliente</th>";
                                // total_table += "<th class=\"text-center fs-6\" scope=\"col\">Importe</th>";
                                // total_table += "<th class=\"text-center fs-6\" scope=\"col\">Saldo</th>";
                                // total_table += "<th class=\"text-center fs-6\" scope=\"col\">Atraso</th>";
                                // total_table += "<th class=\"text-center fs-6\" scope=\"col\">Pago</th>";
                                // total_table += "<th class=\"text-center fs-6\" scope=\"col\">Sld Dsp P</th>";
                                // total_table += "<th class=\"text-center fs-6\" scope=\"col\">Plazo</th>";
                                // total_table += "</tr>";
                                // total_table += "</thead>";
                                // total_table += "<tfoot>";
                                // total_table += "<tr>";
                                // total_table += "<th class=\"text-center fs-6\" colspan=\"4\" scope=\"row\">TOTAL</th> ";
                                // total_table += "<th class=\"text-center fs-6\" colspan=\"2\" scope=\"row\">REGISTROS: @@TCOUNT</th>";
                                // total_table += "<th class=\"text-center fs-6\">@@TTIMPORTE</th>";
                                // total_table += "<th class=\"text-center fs-6\">@@TTSALDO</th>";
                                // total_table += "<th class=\"text-center fs-6\">@@TTATRASO</th>";
                                // total_table += "<th class=\"text-center fs-6\">@@TTPAGO</th>";
                                // total_table += "<th class=\"text-center fs-6\">@@TTREMANENTE</th>";
                                // total_table += "<th></th>";
                                // total_table += "</tr>";
                                // total_table += "</tfoot>";
                                // total_table += "</table>";
                                // total_table += "</div>";
                                // total_table += "</div>";

                                // total_table = total_table.Replace("@@TCOUNT", registros_detalle.ToString());
                                // total_table = total_table.Replace("@@TTIMPORTE", importeT.ToString("C", CultureInfo.CurrentCulture));
                                // total_table = total_table.Replace("@@TTSALDO", saldoT.ToString("C", CultureInfo.CurrentCulture));
                                // total_table = total_table.Replace("@@TTATRASO", atrasoT.ToString("C", CultureInfo.CurrentCulture));
                                // total_table = total_table.Replace("@@TTPAGO", pagoT.ToString("C", CultureInfo.CurrentCulture));
                                // total_table = total_table.Replace("@@TTREMANENTE", remanenteT.ToString("C", CultureInfo.CurrentCulture));

                                // // second_table += "</div>";
                                // total_table += "</div>";

                                html = html.Replace("@@RESTO_DETALLE", second_table);
                                html = html.Replace("@@LOGO", logoname);
                                // html = html.Replace("@@GRANTOTAL", total_table);
                                // html = html.Replace("@@DETALLE_RELACION_2", fila_relacion_detalle_2);

                                // html = html.Replace("@@COUNT", registros_detalle.ToString());
                                // html = html.Replace("@@TIMPORTE", importe.ToString("C", CultureInfo.CurrentCulture));
                                // html = html.Replace("@@TSALDO", saldo.ToString("C", CultureInfo.CurrentCulture));
                                // html = html.Replace("@@TATRASO", atraso.ToString("C", CultureInfo.CurrentCulture));
                                // html = html.Replace("@@TPAGO", pago.ToString("C", CultureInfo.CurrentCulture));
                                // html = html.Replace("@@TREMANENTE", remanente.ToString("C", CultureInfo.CurrentCulture));

                                //// Guardamos los archivos temporalmente
                                await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "5_" + Count.ToString() + ".html")), html);

                                listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "5_" + Count.ToString() + ".html")));
                            }

                            if (Producto.ProductoID != 33)
                            {
                                ////path = Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Relacion", "Pagina1", "Pagina1.html");
                                html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Relacion", "Pagina1.html"));
                                html = html.Replace("@@ID_DIST", RelacionCorte.DistribuidorID.ToString());
                                html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                                html = html.Replace("@@COLOR", Producto.EmpresaId == 6 ? ColorPS : ColorCONFIA);
                                html = html.Replace("@@LOGO", logoname);

                                //// Guardamos los archivos temporalmente
                                await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "2_" + Count.ToString() + ".html")), html);

                                listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "2_" + Count.ToString() + ".html")));
                            }

                            ////path = Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Relacion", "Pagina2", "Pagina2.html");
                            html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Relacion", "Pagina2.html"));
                            html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                            html = html.Replace("@@COLOR", Producto.EmpresaId == 6 ? ColorPS : ColorCONFIA);
                            html = html.Replace("@@LOGO", logoname);

                            var fila_tabla_bonificacion = "";

                            //var cult = CultureInfo.CurrentCulture.ToString();

                            foreach (var detalle in RelacionCortesTablaDias)
                            {
                                fila_tabla_bonificacion += "<tr>";
                                fila_tabla_bonificacion += "<td class=\"text-center fs-10\" style=\"font-size:larger;\">" + detalle.FechaPago.Value.ToString("dd/MM/yyyy") + "</td>";
                                fila_tabla_bonificacion += "<td class=\"text-center fs-10\" style=\"font-size:larger;\">" + pagoT.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                fila_tabla_bonificacion += "<td class=\"text-center fs-10\" style=\"font-size:larger;\">" + detalle.PorcComision.ToString("P", nfi) + "</td>";
                                fila_tabla_bonificacion += "<td class=\"text-center fs-10\" style=\"font-size:larger;\">" + (detalle.PorcComision * pagoCom).ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                fila_tabla_bonificacion += "<td class=\"text-center fs-10\" style=\"font-size:larger;\">" + (pagoT - detalle.PorcComision * pagoCom).ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                fila_tabla_bonificacion += "<td class=\"text-center fs-10\" style=\"font-size:larger;\">" + (detalle.PorcMonedero).ToString("P", nfi) + "</td>";
                                fila_tabla_bonificacion += "<td class=\"text-center fs-10\" style=\"font-size:larger;\">" + ((pagoT - detalle.PorcComision * pagoCom) * (detalle.PorcMonedero)).ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                fila_tabla_bonificacion += "<td class=\"text-center fs-10\"></td>";
                                fila_tabla_bonificacion += "<td class=\"text-center fs-10\" style=\"font-size:larger;\">" + detalle.FechaPago.Value.ToString("dd/MM/yyyy") + "</td>";
                                foreach (var Corresponsal in Corresponsales.OrderBy(x => x.CorresponsalID))
                                {
                                    var pagcom = pagoT - detalle.PorcComision * pagoCom;

                                    var PagoCorresponsal = 0.0m;

                                    if (Corresponsal.TipoPorcentaje)
                                    {
                                        try
                                        {
                                            PagoCorresponsal = pagcom + (pagcom * Corresponsal.Porcentaje.Value);
                                        }
                                        catch (Exception)
                                        {
                                            PagoCorresponsal = 0.0m;
                                        }
                                    }
                                    else if (Corresponsal.TipoMontoFijo && Corresponsal.TipoMontoCorte)
                                    {
                                        try
                                        {
                                            var quot = Math.Truncate(pagcom / Corresponsal.MontoCorte.Value);
                                            var mod = pagcom % Corresponsal.MontoCorte.Value;
                                            var corte = quot + (mod > 0 ? 1 : 0);

                                            PagoCorresponsal = pagcom + (Corresponsal.MontoFijo.Value * corte);
                                        }
                                        catch (Exception)
                                        {
                                            PagoCorresponsal = 0.0m;
                                        }
                                    }
                                    else if (Corresponsal.TipoMontoFijo && !Corresponsal.TipoMontoCorte)
                                    {
                                        try
                                        {
                                            PagoCorresponsal = pagcom + Corresponsal.MontoFijo.Value;
                                        }
                                        catch (Exception)
                                        {
                                            PagoCorresponsal = 0.0m;
                                        }
                                    }

                                    fila_tabla_bonificacion += "<td class=\"text-center fs-10\" style=\"font-size:larger;\">" + PagoCorresponsal.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                }
                                fila_tabla_bonificacion += "</tr>";
                            }

                            html = html.Replace("@@TABLA_BONIFICACION", fila_tabla_bonificacion);
                            html = html.Replace("@@ID_DIST", RelacionCorte.DistribuidorID.ToString());
                            html = html.Replace("@@NOMBRE_DIST", RelacionCorte.NombreCompleto.ToUpper());
                            html = html.Replace("@@CONTRATO_CIE", RelacionCorte.ContratoCIE);
                            html = html.Replace("@@REF_BANCOMER", RelacionCorte.refBancomer);
                            html = html.Replace("@@SPEI", RelacionCorte.refSPEI);
                            //html = html.Replace("@@REF_CAJERO_CONFIA", RelacionCorte.refBancomer);

                            // var tabla_corresponsales = "<table class=\"table table-sm\" style=\"border: #ffffff;\">";

                            // var fila_cabecera_corresponsales = "<thead><tr>";
                            // fila_cabecera_corresponsales += "<th class=\"text-center fs-4\" scope=\"col\">FECHA PAGO</th>";

                            // foreach (var Corresponsal in Corresponsales.OrderBy(x => x.CorresponsalID))
                            // {
                            //     fila_cabecera_corresponsales += $"<th class=\"text-center fs-4\" scope=\"col\">{Corresponsal.Nombre.ToUpper()}</th>";
                            // }

                            // fila_cabecera_corresponsales += "</tr></thead>";

                            // var fila_tabla_corresponsales = "<tbody>";

                            // foreach (var detalle in RelacionCortesTablaDias)
                            // {
                            //     fila_tabla_corresponsales += "<tr>";
                            //     fila_tabla_corresponsales += "<td class=\"text-center fs-6\">" + detalle.FechaPago.Value.ToString("dd/MM/yyyy") + "</td>";

                            //     foreach (var Corresponsal in Corresponsales.OrderBy(x => x.CorresponsalID))
                            //     {
                            //         var pagcom = (pagoT - detalle.PorcComision * pagoT);

                            //         var PagoCorresponsal = 0.0m;

                            //         if (Corresponsal.TipoPorcentaje)
                            //         {
                            //             try
                            //             {
                            //                 PagoCorresponsal = pagcom + (pagcom * Corresponsal.Porcentaje.Value);
                            //             }
                            //             catch (Exception)
                            //             {
                            //                 PagoCorresponsal = 0.0m;
                            //             }
                            //         }
                            //         else if (Corresponsal.TipoMontoFijo && Corresponsal.TipoMontoCorte)
                            //         {
                            //             try
                            //             {
                            //                 var quot = Math.Truncate(pagcom / Corresponsal.MontoCorte.Value);
                            //                 var mod = pagcom % Corresponsal.MontoCorte.Value;
                            //                 var corte = quot + (mod > 0 ? 1 : 0);

                            //                 PagoCorresponsal = pagcom + (Corresponsal.MontoFijo.Value * corte);
                            //             }
                            //             catch (Exception)
                            //             {
                            //                 PagoCorresponsal = 0.0m;
                            //             }
                            //         }
                            //         else if (Corresponsal.TipoMontoFijo && !Corresponsal.TipoMontoCorte)
                            //         {
                            //             try
                            //             {
                            //                 PagoCorresponsal = pagcom + Corresponsal.MontoFijo.Value;
                            //             }
                            //             catch (Exception)
                            //             {
                            //                 PagoCorresponsal = 0.0m;
                            //             }
                            //         }

                            //         fila_tabla_corresponsales += $"<td class=\"text-center fs-6\" >{PagoCorresponsal.ToString("C", CultureInfo.CurrentCulture)}</td>";
                            //     }

                            //     fila_tabla_corresponsales += "</tr>";
                            // }

                            // fila_tabla_corresponsales += "</tbody>";

                            // tabla_corresponsales += fila_cabecera_corresponsales + fila_tabla_corresponsales + "</table> ";

                            // html = html.Replace("@@TABLA_CORRESPONSALES", tabla_corresponsales);


                            // Guardamos los archivos temporalmente
                            //await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "3_" + Count.ToString() + ".html")), html);

                            //listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "3_" + Count.ToString() + ".html")));

                            //path = Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Relacion", "Pagina2", "Pagina3.html");

                            //No mostrar pagina numero 4 en blanco
                            //html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Relacion", "Pagina3.html"));
                            var PagoCajero = "<div class=\"rcorners\"><figure class=\"text-center\"><h2><strong>PAGO CAJERO CONFIA</strong></h2><h4><strong>@@ID_DIST - @@NOMBRE_DIST</strong></h4><table class=\"table table-borderless\"><tbody style=\"border: #ffffff;\"><tr><td class=\"text-center fs-4\"><img style=\"max-height: 100px; max-width: 200px\" src=\"https://@@SERVER/pdf/LogoImg/@@LOGO\" /></td><td class=\"text-center fs-4\"><img style=\"max-height: 100px; max-width: 200px\" src=\"https://@@SERVER/pdf/ImageBarcode/@@REF_CAJERO_CONFIA\" /></td></tr></tbody></table></figure></div>";

                            html = html.Replace("@@PAGOCAJERO", Producto.EmpresaId == 6 ? "" : PagoCajero);
                            html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                            html = html.Replace("@@ID_DIST", RelacionCorte.DistribuidorID.ToString());
                            html = html.Replace("@@NOMBRE_DIST", RelacionCorte.NombreCompleto.ToUpper());
                            html = html.Replace("@@REF_OXXO", RelacionCorte.refOxxo);
                            html = html.Replace("@@REF_BANCOMER", RelacionCorte.refBancomer);
                            html = html.Replace("@@SPEI", RelacionCorte.refSPEI);
                            //html = html.Replace("@@REF_SORIANA", RelacionCorte.refSoriana);
                            //html = html.Replace("@@REF_CAJERO_CONFIA", RelacionCorte.refBancomer);
                            html = html.Replace("@@CONTRATO_CIE", RelacionCorte.ContratoCIE);
                            html = html.Replace("@@COLOR", Producto.EmpresaId == 6 ? ColorPS : ColorCONFIA);
                            html = html.Replace("@@LOGO", logoname);

                            if (RelacionCorte.refOxxo != null)
                            {
                                var code = Funciones.Barcode(RelacionCorte.refOxxo, 300, 200);

                                var image = string.Concat(prefijo_archivo, "refOxxo_", RelacionCorte.DistribuidorID.ToString(), ".png");

#pragma warning disable CA1416 // Validar la compatibilidad de la plataforma
                                code.Save(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "ImageBarcode", image), ImageFormat.Png);
#pragma warning restore CA1416 // Validar la compatibilidad de la plataforma

                                listado_imagenes.Add(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "ImageBarcode", image));

                                html = html.Replace("@@REFOXXOCODE", image);
                            }

                            //                             if (RelacionCorte.refSoriana != null)
                            //                             {
                            //                                 var code = Funciones.Barcode(RelacionCorte.refSoriana, 600, 200);

                            //                                 var image = string.Concat(prefijo_archivo, "refSoriana_", RelacionCorte.DistribuidorID.ToString(), ".png");

                            // #pragma warning disable CA1416 // Validar la compatibilidad de la plataforma
                            //                                 code.Save(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "ImageBarcode", image), ImageFormat.Png);
                            // #pragma warning restore CA1416 // Validar la compatibilidad de la plataforma

                            //                                 //Mostrar codigo de barras soriana
                            //                                 listado_imagenes.Add(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "ImageBarcode", image));
                            //                                 html = html.Replace("@@REF_SORIANA", image);
                            //                             }

                            if (RelacionCorte.refBancomer != null)
                            {
                                var code = Funciones.Barcode(RelacionCorte.refBancomer, 300, 200);

                                var image = string.Concat(prefijo_archivo, "refBancomer_", RelacionCorte.DistribuidorID.ToString(), ".png");

#pragma warning disable CA1416 // Validar la compatibilidad de la plataforma
                                code.Save(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "ImageBarcode", image), ImageFormat.Png);
#pragma warning restore CA1416 // Validar la compatibilidad de la plataforma

                                listado_imagenes.Add(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "ImageBarcode", image));
                                html = html.Replace("@@REF_CAJERO_CONFIA", image);
                            }

                            // Guardamos los archivos temporalmente
                            await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "4_" + Count.ToString() + ".html")), html);

                            listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "4_" + Count.ToString() + ".html")));

                        }
                    }
                }
                else
                {
                    var recibos = "";

                    var rc = 0;

                    foreach (var RelacionCorte in RelacionCortes)
                    {

                        parData.DistribuidorID = RelacionCorte.DistribuidorID;

                        //var FechaCorte = DateTime.ParseExact(parData.fecha, "dd/MM/yyyy", CultureInfo.InvariantCulture);

                        //var RelacionCorte = await DBContext.database.QueryAsync<RelacionCortes_VW>("WHERE (SucursalID = @SucursalID) AND (DistribuidorID = @DistribuidorID) AND (fechaCorte = CONVERT(DATETIME, @fecha, 103))", parData).FirstOrDefaultAsync();

                        if (RelacionCorte != null)
                        {
                            Count++;

                            //var RelacionCortesDetalle = await DBContext.database.FetchAsync<RelacionCortesDetalle_VW>("WHERE (SucursalID = @SucursalID) AND (DistribuidorID = @DistribuidorID) AND (fechaCorte = CONVERT(DATETIME, @fecha, 103))", parData);

                            foreach (var detalle in RelacionCortesDetalle.Where(x => x.DistribuidorID == RelacionCorte.DistribuidorID))
                            {
                                rc++;

                                if (rc % 2 != 0 && rc > 1)
                                {
                                    recibos += "</div>";
                                    recibos += "<br />";
                                    if (parData.formato == 2)
                                    {
                                        recibos += "<br />";
                                    }
                                    recibos += "<div class=\"row m-0 mb-2 d-table-row\">";
                                }

                                recibos += "<div class=\"col-sm-6 ps-3 pe-3 w-50 d-table-cell\">";

                                if (parData.formato == 1)
                                {
                                    recibos += "<div class=\"text-end\">";
                                    recibos += "<strong>" + detalle.fechaCorte/*.ToString("dd/MM/yyyy")*/ + "</strong></div><div>";
                                    recibos += "<div class=\"row m-0 mb-2 d-table-row\">";
                                    recibos += "<div class=\"col-sm-12 ps-3 pe-3 w-100 d-table-cell\">";
                                    recibos += "<br />" + HttpUtility.HtmlEncode(RelacionCorte.NombreCompleto) + "<br />";
                                    recibos += "<br />CLIENTE:<br /></div></div></div>";
                                    recibos += "<div class=\"text-center\">";
                                    recibos += detalle.ClienteID.ToString() + " - " + HttpUtility.HtmlEncode(detalle.Cliente);
                                    recibos += "</div><strong><hr /></strong><br />";
                                    recibos += "<div class=\"row m-0 mb-2 d-table-row\">";
                                    recibos += "<div class=\"col-sm-12 ps-3 pe-3 w-100 d-table-cell\">";
                                    recibos += "<div class=\"row m-0 mb-2 d-table-row\">";
                                    recibos += "<div class=\"col-sm-12 ps-0 pe-3 w-100 d-table-cell\">";
                                    recibos += "NUM. DE VALE:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + (detalle.ValeCanje != null ? detalle.ValeCanje.Value.ToString() : "NA");
                                    recibos += "</div></div>";
                                    recibos += "<div class=\"row m-0 mb-2 d-table-row\">";
                                    recibos += "<div class=\"col-sm-12 ps-0 pe-3 w-100 d-table-cell\">";
                                    recibos += "CR&Eacute;DITO:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + detalle.CreditoID.ToString().Trim();
                                    recibos += "</div></div>";
                                    recibos += "<div class=\"row m-0 mb-2 d-table-row\">";
                                    recibos += "<div class=\"col-sm-12 ps-0 pe-3 w-100 d-table-cell\">";
                                    recibos += "PLAZO:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + detalle.PagoPlazo;
                                    recibos += "</div></div></div></div><div>";
                                    recibos += "<div class=\"row m-0 mb-2 d-table-row\">";
                                    recibos += "<div class=\"col-sm-6 ps-3 pe-3 w-50 d-table-cell\">";
                                    recibos += "FECHA LIMITE DE PAGO:<br />";
                                    recibos += "<strong>" + detalle.FechaVencimiento.Value.AddDays(-5).ToString("dd/MM/yyyy") + "</strong></div>";
                                    recibos += "<div class=\"col-sm-6 ps-3 pe-3 w-50 d-table-cell\">";
                                    recibos += "SALDO&nbsp;ANTERIOR:<br />";
                                    recibos += "ATRASADO:<br />";
                                    recibos += "PAGO:<br />";
                                    recibos += "SALDO NUEVO:</div>";
                                    recibos += "<div class=\"col-sm-3 ps-3 pe-3 w-25 d-table-cell\">";
                                    recibos += detalle.saldoCredito.Value.ToString("C", CultureInfo.CurrentCulture) + "<br />";
                                    recibos += detalle.saldoAtrasado.Value.ToString("C", CultureInfo.CurrentCulture) + "<br />";
                                    recibos += detalle.importePlazo.Value.ToString("C", CultureInfo.CurrentCulture) + "<br />";
                                    recibos += detalle.SldDspPago.Value.ToString("C", CultureInfo.CurrentCulture) + "</div>";
                                    recibos += "</div></div>";
                                }
                                else
                                {
                                    recibos += "<div class=\"text-end\">";
                                    recibos += "<h1><strong>" + detalle.fechaCorte/*.ToString("dd/MM/yyyy")*/ + "</strong></h1>";
                                    recibos += "</div>";
                                    recibos += "<br /><br /><br />";
                                    recibos += "<table style=\"border: #ffffff;\">";
                                    recibos += "<tbody>";
                                    recibos += "<tr>";
                                    recibos += "<td colspan=\"4\" style=\"font-size:12px;\">" + HttpUtility.HtmlEncode(RelacionCorte.NombreCompleto) + "</td>";
                                    recibos += "</tr>";
                                    recibos += "<tr>";
                                    recibos += "<td colspan=\"4\" style=\"font-size:12px;\"><strong>CLIENTE:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + detalle.ClienteID.ToString() + " - " + HttpUtility.HtmlEncode(detalle.Cliente) + "</td>";
                                    recibos += "</tr>";
                                    recibos += "<tr>";
                                    recibos += "<td style=\"font-size:12px;\"><strong>NUM. DE VALE:</strong></td>";
                                    recibos += "<td style=\"font-size:12px;\">&nbsp;&nbsp;&nbsp;" + detalle.ValeCanje.Value.ToString() + "</td>";
                                    recibos += "<td style=\"font-size:12px;\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>SALDO ANTERIOR:</strong></td>";
                                    recibos += "<td class=\"text-end\"  style=\"font-size:12px;\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + detalle.saldoCredito.Value.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                    recibos += "</tr>";
                                    recibos += "<tr>";
                                    recibos += "<td  style=\"font-size:12px;\"><strong>CR&Eacute;DITO:</strong></td>";
                                    recibos += "<td  style=\"font-size:12px;\">&nbsp;&nbsp;&nbsp;" + detalle.CreditoID.ToString().Trim() + "</td>";
                                    recibos += "<td  style=\"font-size:12px;\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>ATRASADO:</strong></td>";
                                    recibos += "<td class=\"text-end\"  style=\"font-size:12px;\">" + detalle.saldoAtrasado.Value.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                    recibos += "</tr>";
                                    recibos += "<tr>";
                                    recibos += "<td style=\"font-size:12px;\"><strong>PLAZO:</strong></td>";
                                    recibos += "<td style=\"font-size:12px;\">&nbsp;&nbsp;&nbsp;" + detalle.PagoPlazo + "</td>";
                                    recibos += "<td style=\"font-size:12px;\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>PAGO:</strong></td>";
                                    recibos += "<td class=\"text-end\" style=\"font-size:12px;\">" + detalle.importePlazo.Value.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                    recibos += "</tr>";
                                    recibos += "<tr>";
                                    recibos += "<td style=\"font-size:12px;\"><strong>FECHA LIMITE DE PAGO:</strong></td>";
                                    recibos += "<td style=\"font-size:12px;\">&nbsp;&nbsp;&nbsp;" + detalle.FechaVencimiento.Value.AddDays(-5).ToString("dd/MM/yyyy") + "</td>";
                                    recibos += "<td style=\"font-size:12px;\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>SALDO NUEVO:</strong></td>";
                                    recibos += "<td class=\"text-end\" style=\"font-size:12px;\">" + detalle.SldDspPago.Value.ToString("C", CultureInfo.CurrentCulture) + " </td>";
                                    recibos += "</tr>";
                                    recibos += "</tbody>";
                                    recibos += "</table>";
                                }
                                recibos += "</div>";
                            }

                        }
                    }

                    if (rc % 2 != 0)
                    {
                        recibos += "<div class=\"col-sm-6 ps-3 pe-3 w-50 d-table-cell\"></div>";
                    }

                    ////path = Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Relacion", "Pagina1", "Pagina1.html");
                    var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Relacion", "Recibo_" + parData.formato.ToString() + ".html"));
                    html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                    html = html.Replace("@@RECIBOS", recibos);
                    html = html.Replace("@@LOGO", logoname);

                    //// Guardamos los archivos temporalmente
                    ///_" + Count.ToString() + "
                    await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1.html")), html);

                    listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1.html")));
                }

                if (Count > 0)
                {
                    // Ejecutamos el proceso de wkhtmltopdf
                    Process p = new()
                    {
                        StartInfo = new ProcessStartInfo(PDF.RUTA_WKHTMLTOPDF())
                    };
                    p.StartInfo.Arguments = string.Concat("", string.Join(" ", listado_archivos), " ", Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
                    p.StartInfo.CreateNoWindow = true;
                    p.Start();
                    await p.WaitForExitAsync();

                    // Ejecutamos el proceso de formado digital del PDF
                    //Process p2 = new()
                    //{
                    //    StartInfo = new ProcessStartInfo("java")
                    //};
                    //p2.StartInfo.Arguments = string.Concat(
                    //    "-jar ",
                    //    PDF.RUTA_JSIGNPDF, " ",
                    //    Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")), " ",
                    //    "-ksf ", Path.Combine(PDF.RUTA_BASE, "keystore", "confia.pdf.keystore"), " ",
                    //    "-ksp Mexico2021 ",
                    //    "-ka confia_pdf ",
                    //    "-ksp Mexico2021 ",
                    //    "-d ", PDF.RUTA_BASE, " ",
                    //    "-r 'Validación de documentos' ",
                    //    "-l 'Torreon Coahuila' ",
                    //    "-c 'Detalle de contacto' ",
                    //    "-cl CERTIFIED_NO_CHANGES_ALLOWED ",
                    //    "-ha SHA512 ",
                    //    "-pg 1 ",
                    //    "-llx 35.0 ",
                    //    "-lly 830.0 ",
                    //    "-urx 345 ",
                    //    "-ury 762 ",
                    //    "--render-mode DESCRIPTION_ONLY ",
                    //    "-fs 8.0 ",
                    //    "-V ",
                    //    "-q"
                    //);
                    //p2.StartInfo.CreateNoWindow = true;
                    //p2.Start();
                    //await p2.WaitForExitAsync();


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

                    foreach (var imagen in listado_imagenes)
                        System.IO.File.Delete(imagen);

                    // Eliminamos el PDF
                    System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
                    //System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF_signed.pdf")));

                    await ConexionBD.Destroy();

                    // Enviamos el PDF a la UI
                    return new FileStreamResult(pdfStream, "application/pdf");
                }

                await ConexionBD.Destroy();

                return Ok("No se encontro información");

                //return new NotFoundObjectResult(new { Id = 2, error = "No se encontro intormación" });
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("ERROR: " + ex.Message);
            }
        }


        [HttpPost]
        [Route("print2")]
        [Authorize]
        [TProteccionProducto]
        public async Task<IActionResult> Print2(PeticionesRest.Cortes.Relacion.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                parData.ProductoID = producto;
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var Producto = await ConexionBD.database.SingleOrDefaultByIdAsync<Productos>(parData.ProductoID);
                var Sucursal = await ConexionBD.database.QueryAsync<Sucursales_VW>("WHERE SucursalID = @SucursalID", parData).SingleOrDefaultAsync();
                Sucursal.Eslogan = HttpUtility.HtmlEncode(Sucursal.Eslogan);
                // var RelacionCortes = await ConexionBD.database.QueryAsync<RelacionCortes_VW>("WHERE (SucursalID = @0) AND (fechaCorte = CONVERT(DATETIME, @1, 103)) AND DistribuidorID IN (@2)", parData.SucursalID, parData.fecha, parData.Distribuidores).OrderBy(x => x.DistribuidorID).ToArrayAsync();
                // var RelacionCortesDetalle = await ConexionBD.database.QueryAsync<RelacionCortesDetalle_VW>("WHERE (SucursalID = @0) AND (DistribuidorID IN (@1)) AND (saldoPlazo > 1) AND (fechaCorte = CONVERT(DATETIME, @2, 103))", parData.SucursalID, parData.Distribuidores, parData.fecha).OrderBy(x => x.DistribuidorID).ToArrayAsync();

                var RelacionCortes = await ConexionBD.database.QueryAsync<RelacionCortes_VW>("WHERE (ProductoID = @0) AND (SucursalID = @1) AND (fechaCorte = CONVERT(DATETIME, @2, 103)) AND DistribuidorID IN (@3)", parData.ProductoID, parData.SucursalID, parData.fecha, parData.Distribuidores).OrderBy(x => x.DistribuidorID).ToArrayAsync();
                var RelacionCortesDetalle = await ConexionBD.database.QueryAsync<RelacionCortesDetalle2_VW>("WHERE (SucursalID = @0) AND (DistribuidorID IN (@1)) AND (saldoPlazo >= 0) AND (fechaCorte = CONVERT(DATETIME, @2, 103)) ", parData.SucursalID, parData.Distribuidores, parData.fecha, producto).OrderBy(x => x.DistribuidorID).ToArrayAsync();
                var Corresponsales = await ConexionBD.database.FetchAsync<Corresponsales_VW>("WHERE (Activo = 1)");

                var token = JsonConvert.DeserializeObject<Auth>(ConfiaShop.LealtadAuth("jjaramillo@fconfia.com", "jjaramillo"));

                var variale = await ConexionBD.database.QueryAsync<VariablesGlobales>("WHERE  (varName = @0)", "RELACIONES_LIMITE_DETALLE").FirstOrDefaultAsync();
                var costGlobal = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Catalogos.VariablesGlobales>("WHERE varName ='VALERAS_COSTO'").SingleOrDefaultAsync();
                var DscDistribuidor = await ConexionBD.database.QueryAsync<VariablesGlobales>("WHERE (varName = @0)", "DESCRIPCION_DISTRIBUIDOR").FirstOrDefaultAsync();

                int limiteReg = int.Parse(variale.varValue.ToString());

                // Generamos un prefijo del nombre de archivo
                var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");
                var listado_archivos = new List<string>();
                var listado_imagenes = new List<string>();
                var Count = 0;

                var ColorPS = "#1DA1F2";
                var ColorCONFIA = "#9ACD32";

                var logo = Producto.Logo;

                Guid g = Guid.NewGuid();

                var logoname = string.Concat("logo", "_" + g.ToString() + ".jpeg");

                await System.IO.File.WriteAllBytesAsync(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "LogoImg", logoname), logo);

                listado_imagenes.Add(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "LogoImg", logoname));

                NumberFormatInfo nfi = new CultureInfo(CultureInfo.CurrentCulture.ToString(), false).NumberFormat;
                nfi.PercentDecimalDigits = 0;

                if (parData.tipo == 1)
                {
                    if (parData.formato == 1)
                    {
                        parData.formato = 3;
                    }
                    else if (parData.formato == 2)
                    {
                        parData.formato = 6;
                    }
                    else
                    {
                        parData.formato = 8;
                    }

                    foreach (var RelacionCorte in RelacionCortes)
                    {

                        parData.DistribuidorID = RelacionCorte.DistribuidorID;

                        var LineaCredito = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Contratos_VW>("WHERE DistribuidorID=@0 AND Principal=1", RelacionCorte.DistribuidorID).FirstOrDefaultAsync();

                        //var FechaCorte = DateTime.ParseExact(parData.fecha, "dd/MM/yyyy", CultureInfo.InvariantCulture);

                        //var RelacionCorte = await DBContext.database.QueryAsync<RelacionCortes_VW>("WHERE (SucursalID = @SucursalID) AND (DistribuidorID = @DistribuidorID) AND (fechaCorte = CONVERT(DATETIME, @fecha, 103))", parData).FirstOrDefaultAsync();

                        if (RelacionCorte != null)
                        {
                            Count++;

                            decimal monedero = 0;

                            /*var lealtad = JsonConvert.DeserializeObject<List<Get>>(ConfiaShop.LealtadSel(token.token, RelacionCorte.DistribuidorID));

                            if (lealtad.Count > 0)
                            {
                                monedero = lealtad[0].saldo;
                            }*/

                            //var RelacionCortesDetalle = await DBContext.database.FetchAsync<RelacionCortesDetalle_VW>("WHERE (SucursalID = @SucursalID) AND (DistribuidorID = @DistribuidorID) AND (fechaCorte = CONVERT(DATETIME, @fecha, 103))", parData);

                            parData.DistribuidorNivelID = RelacionCorte.DistribuidorNivelID.Value;

                            parData.DistribuidorNivelIDOrigen = RelacionCorte.DistribuidorNivelIDOrigen.Value;

                            //parData.DistribuidorNivelID = (Producto.EmpresaId == 6) ? RelacionCorte.DistribuidorNivelID2.Value : RelacionCorte.DistribuidorNivelID.Value;



                            var RelacionCortesTablaDias = await ConexionBD.database.FetchAsync<RelacionCortesTablaDias_VW>("WHERE  (fechaCorte = CONVERT(DATETIME, @fecha, 103)) AND (DistribuidorNivelID = @DistribuidorNivelID) AND (DistribuidorNivelIDOrigen = @DistribuidorNivelIDOrigen) AND (Renglon <= @formato) AND (ProductoID = @ProductoID) AND (SucursalID = @SucursalID)", parData);

                            UsuarioActual.Nombre = HttpUtility.HtmlEncode(UsuarioActual.Nombre);
                            //StringExtensions.SinTildes(RelacionCortes.NombreCompleto);

                            // Obtenemos el HTML de nuestro contrato
                            //var path = Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Relacion", "Caratula", "Caratula.html");
                            var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Relacion", "Caratula.html"));
                            html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                            html = html.Replace("@@IMPRIMIO", UsuarioActual.Nombre.ToString());
                            html = html.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                            html = html.Replace("@@ID_DIST", RelacionCorte.DistribuidorID.ToString());
                            //html = html.Replace("@@ID_DIST", Producto.EmpresaId == 6 ? RelacionCorte.DistAntNumero2.ToString() : RelacionCorte.DistAntNumero.ToString());
                            html = html.Replace("@@NOMBRE_DIST", RelacionCorte.NombreCompleto.ToUpper());
                            html = html.Replace("@@TELEFONO_DIST", RelacionCorte.TelefonoMovil);
                            html = html.Replace("@@FECHA_CORTE", RelacionCorte.fechaCorte/*.ToString("dd/MM/yyyy")*/);
                            html = html.Replace("@@ACUMULADO", monedero.ToString("C", CultureInfo.CurrentCulture));
                            html = html.Replace("@@LIMITE", LineaCredito.LineaCredito.ToString("C", CultureInfo.CurrentCulture));
                            html = html.Replace("@@COLOCADO", LineaCredito.Capital.ToString("C", CultureInfo.CurrentCulture));
                            html = html.Replace("@@DISPONIBLE", LineaCredito.LineaCreditoDisponible.Value.ToString("C", CultureInfo.CurrentCulture));
                            html = html.Replace("@@NIVEL", RelacionCorte.DistribuidorNivel);
                            html = html.Replace("@@PUNTOS", "0");
                            html = html.Replace("@@MONTO", "0");
                            html = html.Replace("@@SALDO", "0");
                            html = html.Replace("@@SUCURSAL", Sucursal.Nombre);
                            html = html.Replace("@@DscDist", DscDistribuidor.varValue.ToString());
                            html = html.Replace("@@LOGO", logoname);
                            html = html.Replace("@@ESLOGAN", Producto.EmpresaId == 6 ? "" : "Donde m&aacute;s ganas");
                            html = html.Replace("@@COLOR", Producto.EmpresaId == 6 ? ColorPS : ColorCONFIA);
                            if (Count == 1)
                            {
                                html = html.Replace("@@JQUERY", "<script type=\"text/javascript\" src=\"https://code.jquery.com/jquery.min.js\"></script>");
                            }
                            else
                            {
                                html = html.Replace("@@JQUERY", "");
                            }

                            var registros_detalle = 0;
                            decimal importeT = 0;
                            decimal saldoT = 0;
                            decimal atrasoT = 0;
                            decimal pagoT = 0;
                            decimal pagoCom = 0;
                            decimal remanenteT = 0;

                            var c = 0;
                            decimal importe = 0;
                            decimal saldo = 0;
                            decimal atraso = 0;
                            decimal pago = 0;
                            decimal remanente = 0;
                            var espacio = "";

                            var fila_relacion_detalle = "";
                            var fila_relacion_detalle_2 = "";

                            var Productos = RelacionCortesDetalle.Where(x => x.DistribuidorID == RelacionCorte.DistribuidorID).OrderBy(x => x.ProductoID).GroupBy(x => x.ProductoID).Select(x => x.First()).ToArray();

                            var FstProd = true;

                            var second_table = "";

                            var detailRead = false;

                            foreach (var ProdDetalle in Productos)
                            {
                                fila_relacion_detalle_2 = "";
                                c = 0;
                                importe = 0;
                                saldo = 0;
                                atraso = 0;
                                pago = 0;
                                remanente = 0;
                                espacio = "";

                                if (!FstProd)
                                {
                                    second_table += "</tfoot>";
                                    second_table += "</table>";
                                    second_table += "</div>";
                                    second_table += "</div>";
                                    // second_table += "<br>";
                                }

                                foreach (var detalle in RelacionCortesDetalle.Where(x => x.DistribuidorID == RelacionCorte.DistribuidorID && x.ProductoID == ProdDetalle.ProductoID))
                                {
                                    registros_detalle += 1;
                                    importeT += detalle.ImporteTotal.Value;
                                    saldoT += detalle.saldoCredito.Value;
                                    atrasoT += detalle.saldoAtrasado.Value;
                                    pagoT += detalle.importePlazo.Value;
                                    pagoCom += detalle.SaldoComisionPlazo.Value;
                                    remanenteT += Math.Abs(detalle.SldDspPago.Value);

                                    c += 1;
                                    importe += detalle.ImporteTotal.Value;
                                    saldo += detalle.saldoCredito.Value;
                                    atraso += detalle.saldoAtrasado.Value;
                                    pago += detalle.importePlazo.Value;
                                    remanente += Math.Abs(detalle.SldDspPago.Value);

                                    if (registros_detalle < (limiteReg + 1) && FstProd)
                                    {
                                        fila_relacion_detalle += "<tr>";
                                        fila_relacion_detalle += "<td class=\"text-center\" style=\"font-size:12px;\">" + detalle.FechaCanje?.ToString("dd/MM/yyyy") + "</td>";
                                        //fila_relacion_detalle += "<td class=\"text-center fs-6\">" + HttpUtility.HtmlEncode(detalle.Nombre) + "</td>";
                                        fila_relacion_detalle += "<td class=\"text-center\" style=\"font-size:12px;\">" + detalle.CreditoID.ToString() + "</td>";
                                        fila_relacion_detalle += "<td class=\"text-center\" style=\"font-size:12px;\">" + detalle.ValeCanje?.ToString() + "</td>";
                                        fila_relacion_detalle += "<td class=\"text-center\" style=\"font-size:12px;\">" + HttpUtility.HtmlEncode(detalle.Cliente) + "</td>";
                                        fila_relacion_detalle += "<td class=\"text-center\" style=\"font-size:12px;\">" + detalle.ImporteTotal?.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                        fila_relacion_detalle += "<td class=\"text-center\" style=\"font-size:12px;\">" + detalle.saldoCredito?.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                        fila_relacion_detalle += "<td class=\"text-center\" style=\"font-size:12px;\">" + detalle.saldoAtrasado?.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                        fila_relacion_detalle += "<td class=\"text-center\" style=\"font-size:12px;\">" + detalle.importePlazo?.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                        fila_relacion_detalle += "<td class=\"text-center\" style=\"font-size:12px;\">" + detalle.SldDspPago?.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                        fila_relacion_detalle += "<td class=\"text-center\" style=\"font-size:12px;\">" + detalle.PagoPlazo + "</td>";
                                        fila_relacion_detalle += "</tr>";
                                    }
                                    else
                                    {
                                        fila_relacion_detalle_2 += "<tr>";
                                        fila_relacion_detalle_2 += "<td class=\"text-center\" style=\"font-size:12px;\">" + detalle.FechaCanje?.ToString("dd/MM/yyyy") + "</td>";
                                        //fila_relacion_detalle += "<td class=\"text-center fs-6\">" + HttpUtility.HtmlEncode(detalle.Nombre) + "</td>";
                                        fila_relacion_detalle_2 += "<td class=\"text-center\" style=\"font-size:12px;\">" + detalle.CreditoID.ToString() + "</td>";
                                        fila_relacion_detalle_2 += "<td class=\"text-center\" style=\"font-size:12px;\">" + detalle.ValeCanje?.ToString() + "</td>";
                                        fila_relacion_detalle_2 += "<td class=\"text-center\" style=\"font-size:12px;\">" + HttpUtility.HtmlEncode(detalle.Cliente) + "</td>";
                                        fila_relacion_detalle_2 += "<td class=\"text-center\" style=\"font-size:12px;\">" + detalle.ImporteTotal?.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                        fila_relacion_detalle_2 += "<td class=\"text-center\" style=\"font-size:12px;\">" + detalle.saldoCredito?.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                        fila_relacion_detalle_2 += "<td class=\"text-center\" style=\"font-size:12px;\">" + detalle.saldoAtrasado?.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                        fila_relacion_detalle_2 += "<td class=\"text-center\" style=\"font-size:12px;\">" + detalle.importePlazo?.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                        fila_relacion_detalle_2 += "<td class=\"text-center\" style=\"font-size:12px;\">" + detalle.SldDspPago?.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                        fila_relacion_detalle_2 += "<td class=\"text-center\" style=\"font-size:12px;\">" + detalle.PagoPlazo + "</td>";
                                        fila_relacion_detalle_2 += "</tr>";
                                    }
                                }

                                if (FstProd)
                                {
                                    html = html.Replace("@@DETALLE_RELACION", fila_relacion_detalle);

                                    html = html.Replace("@@PRODUCTO", ProdDetalle.Producto);
                                    html = html.Replace("@@COUNT", c.ToString());
                                    html = html.Replace("@@TIMPORTE", importe.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@TSALDO", saldo.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@TATRASO", atraso.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@TPAGO", pago.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@TREMANENTE", remanente.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@ESPACIO", espacio);

                                    if (Productos.Length > 1 || registros_detalle > limiteReg)
                                    {
                                        // html = html.Replace("@@GRAN_TOTAL", "");
                                    }
                                    else
                                    {
                                        var grantotal = "<tr>";
                                        grantotal += "<th class=\"text-center style=\"font-size:11px;\" colspan=\"4\" scope=\"row\">TOTAL</th> ";
                                        grantotal += "<th class=\"text-center style=\"font-size:11px;\">REGISTROS: @@TCOUNT</th>";
                                        grantotal += "<th class=\"text-center style=\"font-size:11px;\">@@TTIMPORTE</th>";
                                        grantotal += "<th class=\"text-center style=\"font-size:11px;\">@@TTSALDO</th>";
                                        grantotal += "<th class=\"text-center style=\"font-size:11px;\">@@TTATRASO</th>";
                                        grantotal += "<th class=\"text-center style=\"font-size:11px;\">@@TTPAGO</th>";
                                        grantotal += "<th class=\"text-center style=\"font-size:11px;\">@@TTREMANENTE</th>";
                                        grantotal += "<th></th>";
                                        grantotal += "</tr>";

                                        grantotal = grantotal.Replace("@@TCOUNT", registros_detalle.ToString());
                                        grantotal = grantotal.Replace("@@TTIMPORTE", importeT.ToString("C", CultureInfo.CurrentCulture));
                                        grantotal = grantotal.Replace("@@TTSALDO", saldoT.ToString("C", CultureInfo.CurrentCulture));
                                        grantotal = grantotal.Replace("@@TTATRASO", atrasoT.ToString("C", CultureInfo.CurrentCulture));
                                        grantotal = grantotal.Replace("@@TTPAGO", pagoT.ToString("C", CultureInfo.CurrentCulture));
                                        grantotal = grantotal.Replace("@@TTREMANENTE", remanenteT.ToString("C", CultureInfo.CurrentCulture));

                                        //html = html.Replace("@@GRAN_TOTAL", grantotal);
                                    }

                                    // Guardamos los archivos temporalmente
                                    await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")), html);

                                    listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")));
                                }

                                if (registros_detalle > limiteReg || !FstProd)
                                {
                                    if (!detailRead)
                                    {
                                        // html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Relacion", "Detalle.html"));
                                        //html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                                        //html = html.Replace("@@LOGO", logoname);
                                        second_table = "<div>";
                                        detailRead = false;
                                    }
                                    // second_table += "<div class=\"row m-0 mb-2 d-table-row\"><div class=\"col-sm-12  ps-3 pe-3 w-100 d-table-cell\"><strong>@@PRODUCTO</strong></div></div>";
                                    second_table += "<div class=\"row m-0 mb-2 d-table-row\">";
                                    second_table += "<div class=\"col-sm-12 text-center ps-3 pe-3 w-100 d-table-cell\">";
                                    second_table += "<table class=\"table table-sm\" style=\"border: #ffffff;\">";
                                    second_table += "<thead><tr><th class=\"text-center\" style=\"font-size:12px;\" scope=\"col\">Fecha Canje</th>";
                                    second_table += "<th class=\"text-center style=\"font-size:12px;\"  fs-6\" scope=\"col\">Cr&eacute;dito</th>";
                                    second_table += "<th class=\"text-center style=\"font-size:12px;\"  fs-6\" scope=\"col\">Folio Vale</th>";
                                    second_table += "<th class=\"text-center style=\"font-size:12px;\"  fs-6\" scope=\"col\">Cliente</th>";
                                    second_table += "<th class=\"text-center style=\"font-size:12px;\"  fs-6\" scope=\"col\">Importe</th>";
                                    second_table += "<th class=\"text-center style=\"font-size:12px;\"  fs-6\" scope=\"col\">Saldo</th>";
                                    second_table += "<th class=\"text-center style=\"font-size:12px;\"  fs-6\" scope=\"col\">Atraso</th>";
                                    second_table += "<th class=\"text-center style=\"font-size:12px;\"  fs-6\" scope=\"col\">Pago</th>";
                                    second_table += "<th class=\"text-center style=\"font-size:12px;\"  fs-6\" scope=\"col\">Sld Dsp P</th>";
                                    second_table += "<th class=\"text-center style=\"font-size:12px;\"  fs-6\" scope=\"col\">Plazo</th></tr></thead>";
                                    second_table += "<tbody>@@DETALLE_RELACION_2</tbody>";
                                    second_table += "<tfoot><tr>";
                                    second_table += "<th class=\"text-center style=\"font-size:12px;\"  fs-6\">TOTAL @@PRODUCTO</th>";
                                    second_table += "<th class=\"text-center style=\"font-size:12px;\"  fs-6\">REGISTROS: @@COUNT</th>";
                                    second_table += "<th class=\"text-center style=\"font-size:12px;\"  fs-6\">@@TIMPORTE</th>";
                                    second_table += "<th class=\"text-center style=\"font-size:12px;\"  fs-6\">@@TSALDO</th>";
                                    second_table += "<th class=\"text-center style=\"font-size:12px;\"  fs-6\">@@TATRASO</th>";
                                    second_table += "<th class=\"text-center style=\"font-size:12px;\"  fs-6\">@@TPAGO</th>";
                                    second_table += "<th class=\"text-center style=\"font-size:12px;\"  fs-6\">@@TREMANENTE</th>";
                                    second_table += "<th class=\"text-center style=\"font-size:12px;\"  fs-6\">@@ESPACIO</th>";
                                    second_table += "<th></th></tr>";
                                    // second_table += "</tfoot>";
                                    // second_table += "</table>";
                                    // second_table += "</div>";
                                    // second_table += "</div>";
                                    // second_table += "<br>";

                                    second_table = second_table.Replace("@@DETALLE_RELACION_2", fila_relacion_detalle_2);

                                    second_table = second_table.Replace("@@PRODUCTO", ProdDetalle.Producto);
                                    second_table = second_table.Replace("@@COUNT", c.ToString());
                                    second_table = second_table.Replace("@@TIMPORTE", importe.ToString("C", CultureInfo.CurrentCulture));
                                    second_table = second_table.Replace("@@TSALDO", saldo.ToString("C", CultureInfo.CurrentCulture));
                                    second_table = second_table.Replace("@@TATRASO", atraso.ToString("C", CultureInfo.CurrentCulture));
                                    second_table = second_table.Replace("@@TPAGO", pago.ToString("C", CultureInfo.CurrentCulture));
                                    second_table = second_table.Replace("@@TREMANENTE", remanente.ToString("C", CultureInfo.CurrentCulture));

                                }

                                FstProd = false;
                            }

                            if (registros_detalle > limiteReg || Productos.Length > 1)
                            {
                                // second_table += "<tfoot>";
                                second_table += "<tr>";
                                second_table += "<th class=\"text-center\" style=\"font-size:12px;\"  colspan=\"4\" scope=\"row\">TOTAL</th> ";
                                second_table += "<th class=\"text-center\" style=\"font-size:12px;\" >REGISTROS: @@TCOUNT</th>";
                                second_table += "<th class=\"text-center\" style=\"font-size:12px;\" >@@TTIMPORTE</th>";
                                second_table += "<th class=\"text-center\" style=\"font-size:12px;\" >@@TTSALDO</th>";
                                second_table += "<th class=\"text-center\" style=\"font-size:12px;\" >@@TTATRASO</th>";
                                second_table += "<th class=\"text-center\" style=\"font-size:12px;\" >@@TTPAGO</th>";
                                second_table += "<th class=\"text-center\" style=\"font-size:12px;\" >@@TTREMANENTE</th>";
                                second_table += "<th></th>";
                                second_table += "</tr>";
                                second_table += "</tfoot>";


                                second_table += "</table>";
                                second_table += "</div>";
                                second_table += "</div>";
                                // second_table += "<br>";
                                second_table += "</div>";

                                second_table = second_table.Replace("@@TCOUNT", registros_detalle.ToString());
                                second_table = second_table.Replace("@@TTIMPORTE", importeT.ToString("C", CultureInfo.CurrentCulture));
                                second_table = second_table.Replace("@@TTSALDO", saldoT.ToString("C", CultureInfo.CurrentCulture));
                                second_table = second_table.Replace("@@TTATRASO", atrasoT.ToString("C", CultureInfo.CurrentCulture));
                                second_table = second_table.Replace("@@TTPAGO", pagoT.ToString("C", CultureInfo.CurrentCulture));
                                second_table = second_table.Replace("@@TTREMANENTE", remanenteT.ToString("C", CultureInfo.CurrentCulture));

                                // var total_table  = "<div class=\"row m-0 mb-2 d-table-row\">";
                                // total_table  += "<div class=\"col-sm-12 text-center ps-3 pe-3 w-100 d-table-cell\">";
                                // total_table += "<table class=\"table table-sm\" style=\"border: #ffffff;\">";
                                // total_table += "<thead>";
                                // total_table += "<tr>";
                                // total_table += "<th class=\"text-center fs-6\" scope=\"col\">Fecha Canje</th>";
                                // total_table += "<th class=\"text-center fs-6\" scope=\"col\">Cr&eacute;dito</th>";
                                // total_table += "<th class=\"text-center fs-6\" scope=\"col\">Folio Vale</th>";
                                // total_table += "<th class=\"text-center fs-6\" scope=\"col\" colspan=\"2\">Cliente</th>";
                                // total_table += "<th class=\"text-center fs-6\" scope=\"col\">Importe</th>";
                                // total_table += "<th class=\"text-center fs-6\" scope=\"col\">Saldo</th>";
                                // total_table += "<th class=\"text-center fs-6\" scope=\"col\">Atraso</th>";
                                // total_table += "<th class=\"text-center fs-6\" scope=\"col\">Pago</th>";
                                // total_table += "<th class=\"text-center fs-6\" scope=\"col\">Sld Dsp P</th>";
                                // total_table += "<th class=\"text-center fs-6\" scope=\"col\">Plazo</th>";
                                // total_table += "</tr>";
                                // total_table += "</thead>";
                                // total_table += "<tfoot>";
                                // total_table += "<tr>";
                                // total_table += "<th class=\"text-center fs-6\" colspan=\"4\" scope=\"row\">TOTAL</th> ";
                                // total_table += "<th class=\"text-center fs-6\" colspan=\"2\" scope=\"row\">REGISTROS: @@TCOUNT</th>";
                                // total_table += "<th class=\"text-center fs-6\">@@TTIMPORTE</th>";
                                // total_table += "<th class=\"text-center fs-6\">@@TTSALDO</th>";
                                // total_table += "<th class=\"text-center fs-6\">@@TTATRASO</th>";
                                // total_table += "<th class=\"text-center fs-6\">@@TTPAGO</th>";
                                // total_table += "<th class=\"text-center fs-6\">@@TTREMANENTE</th>";
                                // total_table += "<th></th>";
                                // total_table += "</tr>";
                                // total_table += "</tfoot>";
                                // total_table += "</table>";
                                // total_table += "</div>";
                                // total_table += "</div>";

                                // total_table = total_table.Replace("@@TCOUNT", registros_detalle.ToString());
                                // total_table = total_table.Replace("@@TTIMPORTE", importeT.ToString("C", CultureInfo.CurrentCulture));
                                // total_table = total_table.Replace("@@TTSALDO", saldoT.ToString("C", CultureInfo.CurrentCulture));
                                // total_table = total_table.Replace("@@TTATRASO", atrasoT.ToString("C", CultureInfo.CurrentCulture));
                                // total_table = total_table.Replace("@@TTPAGO", pagoT.ToString("C", CultureInfo.CurrentCulture));
                                // total_table = total_table.Replace("@@TTREMANENTE", remanenteT.ToString("C", CultureInfo.CurrentCulture));

                                // // second_table += "</div>";
                                // total_table += "</div>";

                                //html = html.Replace("@@RESTO_DETALLE", second_table);
                                //html = html.Replace("@@LOGO", logoname);
                                // html = html.Replace("@@GRANTOTAL", total_table);
                                // html = html.Replace("@@DETALLE_RELACION_2", fila_relacion_detalle_2);

                                // html = html.Replace("@@COUNT", registros_detalle.ToString());
                                // html = html.Replace("@@TIMPORTE", importe.ToString("C", CultureInfo.CurrentCulture));
                                // html = html.Replace("@@TSALDO", saldo.ToString("C", CultureInfo.CurrentCulture));
                                // html = html.Replace("@@TATRASO", atraso.ToString("C", CultureInfo.CurrentCulture));
                                // html = html.Replace("@@TPAGO", pago.ToString("C", CultureInfo.CurrentCulture));
                                // html = html.Replace("@@TREMANENTE", remanente.ToString("C", CultureInfo.CurrentCulture));

                                //// Guardamos los archivos temporalmente
                                //await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "5_" + Count.ToString() + ".html")), html);

                                //listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "5_" + Count.ToString() + ".html")));
                            }

                            if (Producto.ProductoID != 33)
                            {
                                ////path = Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Relacion", "Pagina1", "Pagina1.html");
                                //html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Relacion", "Caratula.html"));
                                html = html.Replace("@@ID_DIST", RelacionCorte.DistribuidorID.ToString());
                                html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                                html = html.Replace("@@COLOR", Producto.EmpresaId == 6 ? ColorPS : ColorCONFIA);
                                html = html.Replace("@@LOGO", logoname);

                                //// Guardamos los archivos temporalmente
                                //await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "2_" + Count.ToString() + ".html")), html);

                                //listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "2_" + Count.ToString() + ".html")));
                            }

                            ////path = Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Relacion", "Pagina2", "Pagina2.html");
                            html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Relacion", "Pagina2.html"));
                            html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                            html = html.Replace("@@COLOR", Producto.EmpresaId == 6 ? ColorPS : ColorCONFIA);
                            html = html.Replace("@@LOGO", logoname);

                            var fila_tabla_bonificacion = "";

                            //var cult = CultureInfo.CurrentCulture.ToString();

                            foreach (var detalle in RelacionCortesTablaDias)
                            {
                                fila_tabla_bonificacion += "<tr>";
                                fila_tabla_bonificacion += "<td class=\"text-center fs-10\" style=\"font-size:larger;\">" + detalle.FechaPago.Value.ToString("dd/MM/yyyy") + "</td>";
                                fila_tabla_bonificacion += "<td class=\"text-center fs-10\" style=\"font-size: larger;\">" + pagoT.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                //PREGUNTAMOS SI EL PAGO ES POR TENER EL 22.09 DE LA VALERA

                                // decimal n2 = Math.Round(pagoT, 2);
                                if (costGlobal != null)
                                {
                                    var costValera = costGlobal.varValue;
                                    var costValeraNumber = decimal.Parse((string)costValera);
                                    detalle.PorcComision = Math.Round(pagoT, 2) == costValeraNumber ? 0 : detalle.PorcComision;

                                }

                                fila_tabla_bonificacion += "<td class=\"text-center fs-10\" style=\"font-size: larger;\">" + detalle.PorcComision.ToString("P", nfi) + "</td>";
                                // COLUMNA DE BONIFICACION
                                fila_tabla_bonificacion += "<td class=\"text-center fs-10\" style=\"font-size: larger;\">" + (detalle.PorcComision * pagoCom).ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                fila_tabla_bonificacion += "<td class=\"text-center fs-10\" style=\"font-size: larger;\">" + (pagoT - (detalle.PorcComision * pagoCom)).ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                // fila_tabla_bonificacion += "<td class=\"text-center fs-10\" style=\"font-size: larger;\">" + (detalle.PorcMonedero).ToString("P", nfi) + "</td>";
                                //fila_tabla_bonificacion += "<td class=\"text-center fs-10\" style=\"font-size: larger;\">" + ((pagoT - detalle.PorcComision * pagoCom) * (detalle.PorcMonedero)).ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                fila_tabla_bonificacion += "<td class=\"text-center fs-10\"></td>";
                                fila_tabla_bonificacion += "<td class=\"text-center fs-10\" style=\"font-size: larger;\">" + detalle.FechaPago.Value.ToString("dd/MM/yyyy") + "</td>";
                                foreach (var Corresponsal in Corresponsales.OrderBy(x => x.CorresponsalID))
                                {
                                    var pagcom = pagoT - detalle.PorcComision * pagoCom;

                                    var PagoCorresponsal = 0.0m;

                                    if (Corresponsal.TipoPorcentaje)
                                    {
                                        try
                                        {
                                            PagoCorresponsal = pagcom + (pagcom * Corresponsal.Porcentaje.Value);
                                        }
                                        catch (Exception)
                                        {
                                            PagoCorresponsal = 0.0m;
                                        }
                                    }
                                    else if (Corresponsal.TipoMontoFijo && Corresponsal.TipoMontoCorte)
                                    {
                                        try
                                        {
                                            var quot = Math.Truncate(pagcom / Corresponsal.MontoCorte.Value);
                                            var mod = pagcom % Corresponsal.MontoCorte.Value;
                                            var corte = quot + (mod > 0 ? 1 : 0);

                                            PagoCorresponsal = pagcom + (Corresponsal.MontoFijo.Value * corte);
                                        }
                                        catch (Exception)
                                        {
                                            PagoCorresponsal = 0.0m;
                                        }
                                    }
                                    else if (Corresponsal.TipoMontoFijo && !Corresponsal.TipoMontoCorte)
                                    {
                                        try
                                        {
                                            PagoCorresponsal = pagcom + Corresponsal.MontoFijo.Value;
                                        }
                                        catch (Exception)
                                        {
                                            PagoCorresponsal = 0.0m;
                                        }
                                    }

                                    fila_tabla_bonificacion += "<td class=\"text-center fs-10\" style=\"font-size:larger;\">" + PagoCorresponsal.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                }
                                fila_tabla_bonificacion += "</tr>";
                            }

                            html = html.Replace("@@TABLA_BONIFICACION", fila_tabla_bonificacion);
                            html = html.Replace("@@ID_DIST", RelacionCorte.DistribuidorID.ToString());
                            html = html.Replace("@@NOMBRE_DIST", RelacionCorte.NombreCompleto.ToUpper());
                            html = html.Replace("@@CONTRATO_CIE", RelacionCorte.ContratoCIE);
                            html = html.Replace("@@REF_BANCOMER", RelacionCorte.refBancomer);
                            html = html.Replace("@@SPEI", RelacionCorte.refSPEI);
                            //html = html.Replace("@@REF_CAJERO_CONFIA", RelacionCorte.refBancomer);

                            // var tabla_corresponsales = "<table class=\"table table-sm\" style=\"border: #ffffff;\">";

                            // var fila_cabecera_corresponsales = "<thead><tr>";
                            // fila_cabecera_corresponsales += "<th class=\"text-center fs-4\" scope=\"col\">FECHA PAGO</th>";

                            // foreach (var Corresponsal in Corresponsales.OrderBy(x => x.CorresponsalID))
                            // {
                            //     fila_cabecera_corresponsales += $"<th class=\"text-center fs-4\" scope=\"col\">{Corresponsal.Nombre.ToUpper()}</th>";
                            // }

                            // fila_cabecera_corresponsales += "</tr></thead>";

                            // var fila_tabla_corresponsales = "<tbody>";

                            // foreach (var detalle in RelacionCortesTablaDias)
                            // {
                            //     fila_tabla_corresponsales += "<tr>";
                            //     fila_tabla_corresponsales += "<td class=\"text-center fs-6\">" + detalle.FechaPago.Value.ToString("dd/MM/yyyy") + "</td>";

                            //     foreach (var Corresponsal in Corresponsales.OrderBy(x => x.CorresponsalID))
                            //     {
                            //         var pagcom = (pagoT - detalle.PorcComision * pagoT);

                            //         var PagoCorresponsal = 0.0m;

                            //         if (Corresponsal.TipoPorcentaje)
                            //         {
                            //             try
                            //             {
                            //                 PagoCorresponsal = pagcom + (pagcom * Corresponsal.Porcentaje.Value);
                            //             }
                            //             catch (Exception)
                            //             {
                            //                 PagoCorresponsal = 0.0m;
                            //             }
                            //         }
                            //         else if (Corresponsal.TipoMontoFijo && Corresponsal.TipoMontoCorte)
                            //         {
                            //             try
                            //             {
                            //                 var quot = Math.Truncate(pagcom / Corresponsal.MontoCorte.Value);
                            //                 var mod = pagcom % Corresponsal.MontoCorte.Value;
                            //                 var corte = quot + (mod > 0 ? 1 : 0);

                            //                 PagoCorresponsal = pagcom + (Corresponsal.MontoFijo.Value * corte);
                            //             }
                            //             catch (Exception)
                            //             {
                            //                 PagoCorresponsal = 0.0m;
                            //             }
                            //         }
                            //         else if (Corresponsal.TipoMontoFijo && !Corresponsal.TipoMontoCorte)
                            //         {
                            //             try
                            //             {
                            //                 PagoCorresponsal = pagcom + Corresponsal.MontoFijo.Value;
                            //             }
                            //             catch (Exception)
                            //             {
                            //                 PagoCorresponsal = 0.0m;
                            //             }
                            //         }

                            //         fila_tabla_corresponsales += $"<td class=\"text-center fs-6\" >{PagoCorresponsal.ToString("C", CultureInfo.CurrentCulture)}</td>";
                            //     }

                            //     fila_tabla_corresponsales += "</tr>";
                            // }

                            // fila_tabla_corresponsales += "</tbody>";

                            // tabla_corresponsales += fila_cabecera_corresponsales + fila_tabla_corresponsales + "</table> ";

                            // html = html.Replace("@@TABLA_CORRESPONSALES", tabla_corresponsales);


                            // Guardamos los archivos temporalmente
                            //await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "3_" + Count.ToString() + ".html")), html);

                            //listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "3_" + Count.ToString() + ".html")));

                            //path = Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Relacion", "Pagina2", "Pagina3.html");

                            //No mostrar pagina numero 4 en blanco
                            //html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Relacion", "Pagina3.html"));
                            var PagoCajero = "<div class=\"rcorners\"><figure class=\"text-center\"><h2><strong>PAGO CAJERO CONFIA</strong></h2><h4><strong>@@ID_DIST - @@NOMBRE_DIST</strong></h4><table class=\"table table-borderless\"><tbody style=\"border: #ffffff;\"><tr><td class=\"text-center fs-4\"><img style=\"max-height: 100px; max-width: 200px\" src=\"https://@@SERVER/pdf/LogoImg/@@LOGO\" /></td><td class=\"text-center fs-4\"><img style=\"max-height: 100px; max-width: 200px\" src=\"https://@@SERVER/pdf/ImageBarcode/@@REF_CAJERO_CONFIA\" /></td></tr></tbody></table></figure></div>";

                            html = html.Replace("@@PAGOCAJERO", Producto.EmpresaId == 6 ? "" : PagoCajero);
                            html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                            html = html.Replace("@@ID_DIST", RelacionCorte.DistribuidorID.ToString());
                            html = html.Replace("@@NOMBRE_DIST", RelacionCorte.NombreCompleto.ToUpper());
                            html = html.Replace("@@REF_OXXO", RelacionCorte.refOxxo);
                            html = html.Replace("@@REF_BANCOMER", RelacionCorte.refBancomer);
                            html = html.Replace("@@SPEI", RelacionCorte.refSPEI);
                            //html = html.Replace("@@REF_SORIANA", RelacionCorte.refSoriana);
                            //html = html.Replace("@@REF_CAJERO_CONFIA", RelacionCorte.refBancomer);
                            html = html.Replace("@@CONTRATO_CIE", RelacionCorte.ContratoCIE);
                            html = html.Replace("@@COLOR", Producto.EmpresaId == 6 ? ColorPS : ColorCONFIA);
                            html = html.Replace("@@LOGO", logoname);

                            if (RelacionCorte.refOxxo != null)
                            {
                                var code = Funciones.Barcode(RelacionCorte.refOxxo, 300, 200);

                                var image = string.Concat(prefijo_archivo, "refOxxo_", RelacionCorte.DistribuidorID.ToString(), ".png");

#pragma warning disable CA1416 // Validar la compatibilidad de la plataforma
                                code.Save(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "ImageBarcode", image), ImageFormat.Png);
#pragma warning restore CA1416 // Validar la compatibilidad de la plataforma

                                listado_imagenes.Add(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "ImageBarcode", image));

                                html = html.Replace("@@REFOXXOCODE", image);
                            }

                            if (RelacionCorte.refSoriana != null)
                            {
                                var code = Funciones.Barcode(RelacionCorte.refSoriana, 600, 200);

                                var image = string.Concat(prefijo_archivo, "refSoriana_", RelacionCorte.DistribuidorID.ToString(), ".png");

#pragma warning disable CA1416 // Validar la compatibilidad de la plataforma
                                code.Save(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "ImageBarcode", image), ImageFormat.Png);
#pragma warning restore CA1416 // Validar la compatibilidad de la plataforma

                                //Mostrar codigo de barras soriana
                                listado_imagenes.Add(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "ImageBarcode", image));
                                html = html.Replace("@@REF_SORIANA", image);
                            }

                            if (RelacionCorte.refBancomer != null)
                            {
                                var code = Funciones.Barcode(RelacionCorte.refBancomer, 300, 200);

                                var image = string.Concat(prefijo_archivo, "refBancomer_", RelacionCorte.DistribuidorID.ToString(), ".png");

#pragma warning disable CA1416 // Validar la compatibilidad de la plataforma
                                code.Save(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "ImageBarcode", image), ImageFormat.Png);
#pragma warning restore CA1416 // Validar la compatibilidad de la plataforma

                                listado_imagenes.Add(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "ImageBarcode", image));
                                html = html.Replace("@@REF_CAJERO_CONFIA", image);
                            }

                            // Guardamos los archivos temporalmente
                            await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "4_" + Count.ToString() + ".html")), html);

                            listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "4_" + Count.ToString() + ".html")));

                        }
                    }
                }
                else
                {
                    var recibos = "";

                    var rc = 0;

                    foreach (var RelacionCorte in RelacionCortes)
                    {

                        parData.DistribuidorID = RelacionCorte.DistribuidorID;

                        //var FechaCorte = DateTime.ParseExact(parData.fecha, "dd/MM/yyyy", CultureInfo.InvariantCulture);

                        //var RelacionCorte = await DBContext.database.QueryAsync<RelacionCortes_VW>("WHERE (SucursalID = @SucursalID) AND (DistribuidorID = @DistribuidorID) AND (fechaCorte = CONVERT(DATETIME, @fecha, 103))", parData).FirstOrDefaultAsync();

                        if (RelacionCorte != null)
                        {
                            Count++;

                            //var RelacionCortesDetalle = await DBContext.database.FetchAsync<RelacionCortesDetalle_VW>("WHERE (SucursalID = @SucursalID) AND (DistribuidorID = @DistribuidorID) AND (fechaCorte = CONVERT(DATETIME, @fecha, 103))", parData);

                            foreach (var detalle in RelacionCortesDetalle.Where(x => x.DistribuidorID == RelacionCorte.DistribuidorID))
                            {
                                rc++;

                                if (rc % 2 != 0 && rc > 1)
                                {
                                    recibos += "</div>";
                                    recibos += "<br />";
                                    if (parData.formato == 2)
                                    {
                                        recibos += "<br />";
                                    }
                                    recibos += "<div class=\"row m-0 mb-2 d-table-row\">";
                                }

                                recibos += "<div class=\"col-sm-6 ps-3 pe-3 w-50 d-table-cell\">";

                                if (parData.formato == 1)
                                {
                                    recibos += "<div class=\"text-end\">";
                                    recibos += "<strong>" + detalle.fechaCorte/*.ToString("dd/MM/yyyy")*/ + "</strong></div><div>";
                                    recibos += "<div class=\"row m-0 mb-2 d-table-row\">";
                                    recibos += "<div class=\"col-sm-12 ps-3 pe-3 w-100 d-table-cell\">";
                                    recibos += "<br />" + HttpUtility.HtmlEncode(RelacionCorte.NombreCompleto) + "<br />";
                                    recibos += "<br />CLIENTE:<br /></div></div></div>";
                                    recibos += "<div class=\"text-center\">";
                                    recibos += detalle.ClienteID.ToString() + " - " + HttpUtility.HtmlEncode(detalle.Cliente);
                                    recibos += "</div><strong><hr /></strong><br />";
                                    recibos += "<div class=\"row m-0 mb-2 d-table-row\">";
                                    recibos += "<div class=\"col-sm-12 ps-3 pe-3 w-100 d-table-cell\">";
                                    recibos += "<div class=\"row m-0 mb-2 d-table-row\">";
                                    recibos += "<div class=\"col-sm-12 ps-0 pe-3 w-100 d-table-cell\">";
                                    recibos += "NUM. DE VALE:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + (detalle.ValeCanje != null ? detalle.ValeCanje.Value.ToString() : "NA");
                                    recibos += "</div></div>";
                                    recibos += "<div class=\"row m-0 mb-2 d-table-row\">";
                                    recibos += "<div class=\"col-sm-12 ps-0 pe-3 w-100 d-table-cell\">";
                                    recibos += "CR&Eacute;DITO:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + detalle.CreditoID.ToString().Trim();
                                    recibos += "</div></div>";
                                    recibos += "<div class=\"row m-0 mb-2 d-table-row\">";
                                    recibos += "<div class=\"col-sm-12 ps-0 pe-3 w-100 d-table-cell\">";
                                    recibos += "PLAZO:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + detalle.PagoPlazo;
                                    recibos += "</div></div></div></div><div>";
                                    recibos += "<div class=\"row m-0 mb-2 d-table-row\">";
                                    recibos += "<div class=\"col-sm-6 ps-3 pe-3 w-50 d-table-cell\">";
                                    recibos += "FECHA LIMITE DE PAGO:<br />";
                                    recibos += "<strong>" + detalle.FechaVencimiento.Value.AddDays(-5).ToString("dd/MM/yyyy") + "</strong></div>";
                                    recibos += "<div class=\"col-sm-6 ps-3 pe-3 w-50 d-table-cell\">";
                                    recibos += "SALDO&nbsp;ANTERIOR:<br />";
                                    recibos += "ATRASADO:<br />";
                                    recibos += "PAGO:<br />";
                                    recibos += "SALDO NUEVO:</div>";
                                    recibos += "<div class=\"col-sm-3 ps-3 pe-3 w-25 d-table-cell\">";
                                    recibos += detalle.saldoCredito.Value.ToString("C", CultureInfo.CurrentCulture) + "<br />";
                                    recibos += detalle.saldoAtrasado.Value.ToString("C", CultureInfo.CurrentCulture) + "<br />";
                                    recibos += detalle.importePlazo.Value.ToString("C", CultureInfo.CurrentCulture) + "<br />";
                                    recibos += detalle.SldDspPago.Value.ToString("C", CultureInfo.CurrentCulture) + "</div>";
                                    recibos += "</div></div>";
                                }
                                else
                                {
                                    recibos += "<div class=\"text-end\">";
                                    recibos += "<h1><strong>" + detalle.fechaCorte/*.ToString("dd/MM/yyyy")*/ + "</strong></h1>";
                                    recibos += "</div>";
                                    recibos += "<br /><br /><br />";
                                    recibos += "<table style=\"border: #ffffff;\">";
                                    recibos += "<tbody>";
                                    recibos += "<tr>";
                                    recibos += "<td colspan=\"4\" style=\"font-size:12px;\">" + HttpUtility.HtmlEncode(RelacionCorte.NombreCompleto) + "</td>";
                                    recibos += "</tr>";
                                    recibos += "<tr>";
                                    recibos += "<td colspan=\"4\" style=\"font-size:12px;\"><strong>CLIENTE:</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + detalle.ClienteID.ToString() + " - " + HttpUtility.HtmlEncode(detalle.Cliente) + "</td>";
                                    recibos += "</tr>";
                                    recibos += "<tr>";
                                    recibos += "<td style=\"font-size:12px;\"><strong>NUM. DE VALE:</strong></td>";
                                    recibos += "<td style=\"font-size:12px;\">&nbsp;&nbsp;&nbsp;" + detalle.ValeCanje.Value.ToString() + "</td>";
                                    recibos += "<td style=\"font-size:12px;\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>SALDO ANTERIOR:</strong></td>";
                                    recibos += "<td class=\"text-end\"  style=\"font-size:12px;\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + detalle.saldoCredito.Value.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                    recibos += "</tr>";
                                    recibos += "<tr>";
                                    recibos += "<td  style=\"font-size:12px;\"><strong>CR&Eacute;DITO:</strong></td>";
                                    recibos += "<td  style=\"font-size:12px;\">&nbsp;&nbsp;&nbsp;" + detalle.CreditoID.ToString().Trim() + "</td>";
                                    recibos += "<td  style=\"font-size:12px;\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>ATRASADO:</strong></td>";
                                    recibos += "<td class=\"text-end\"  style=\"font-size:12px;\">" + detalle.saldoAtrasado.Value.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                    recibos += "</tr>";
                                    recibos += "<tr>";
                                    recibos += "<td style=\"font-size:12px;\"><strong>PLAZO:</strong></td>";
                                    recibos += "<td style=\"font-size:12px;\">&nbsp;&nbsp;&nbsp;" + detalle.PagoPlazo + "</td>";
                                    recibos += "<td style=\"font-size:12px;\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>PAGO:</strong></td>";
                                    recibos += "<td class=\"text-end\" style=\"font-size:12px;\">" + detalle.importePlazo.Value.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                    recibos += "</tr>";
                                    recibos += "<tr>";
                                    recibos += "<td style=\"font-size:12px;\"><strong>FECHA LIMITE DE PAGO:</strong></td>";
                                    recibos += "<td style=\"font-size:12px;\">&nbsp;&nbsp;&nbsp;" + detalle.FechaVencimiento.Value.AddDays(-5).ToString("dd/MM/yyyy") + "</td>";
                                    recibos += "<td style=\"font-size:12px;\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<strong>SALDO NUEVO:</strong></td>";
                                    recibos += "<td class=\"text-end\" style=\"font-size:12px;\">" + detalle.SldDspPago.Value.ToString("C", CultureInfo.CurrentCulture) + " </td>";
                                    recibos += "</tr>";
                                    recibos += "</tbody>";
                                    recibos += "</table>";
                                }
                                recibos += "</div>";
                            }

                        }
                    }

                    if (rc % 2 != 0)
                    {
                        recibos += "<div class=\"col-sm-6 ps-3 pe-3 w-50 d-table-cell\"></div>";
                    }

                    ////path = Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Relacion", "Pagina1", "Pagina1.html");
                    var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Relacion", "Recibo_" + parData.formato.ToString() + ".html"));
                    html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                    html = html.Replace("@@RECIBOS", recibos);
                    html = html.Replace("@@LOGO", logoname);

                    //// Guardamos los archivos temporalmente
                    ///_" + Count.ToString() + "
                    await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1.html")), html);

                    listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1.html")));
                }

                if (Count > 0)
                {
                    // Ejecutamos el proceso de wkhtmltopdf
                    Process p = new()
                    {
                        StartInfo = new ProcessStartInfo(PDF.RUTA_WKHTMLTOPDF())
                    };
                    p.StartInfo.Arguments = string.Concat("", string.Join(" ", listado_archivos), " ", Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
                    p.StartInfo.CreateNoWindow = true;
                    p.Start();
                    await p.WaitForExitAsync();

                    // Ejecutamos el proceso de formado digital del PDF
                    //Process p2 = new()
                    //{
                    //    StartInfo = new ProcessStartInfo("java")
                    //};
                    //p2.StartInfo.Arguments = string.Concat(
                    //    "-jar ",
                    //    PDF.RUTA_JSIGNPDF, " ",
                    //    Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")), " ",
                    //    "-ksf ", Path.Combine(PDF.RUTA_BASE, "keystore", "confia.pdf.keystore"), " ",
                    //    "-ksp Mexico2021 ",
                    //    "-ka confia_pdf ",
                    //    "-ksp Mexico2021 ",
                    //    "-d ", PDF.RUTA_BASE, " ",
                    //    "-r 'Validación de documentos' ",
                    //    "-l 'Torreon Coahuila' ",
                    //    "-c 'Detalle de contacto' ",
                    //    "-cl CERTIFIED_NO_CHANGES_ALLOWED ",
                    //    "-ha SHA512 ",
                    //    "-pg 1 ",
                    //    "-llx 35.0 ",
                    //    "-lly 830.0 ",
                    //    "-urx 345 ",
                    //    "-ury 762 ",
                    //    "--render-mode DESCRIPTION_ONLY ",
                    //    "-fs 8.0 ",
                    //    "-V ",
                    //    "-q"
                    //);
                    //p2.StartInfo.CreateNoWindow = true;
                    //p2.Start();
                    //await p2.WaitForExitAsync();


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

                    foreach (var imagen in listado_imagenes)
                        System.IO.File.Delete(imagen);

                    // Eliminamos el PDF
                    System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
                    //System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF_signed.pdf")));

                    await ConexionBD.Destroy();

                    // Enviamos el PDF a la UI
                    return new FileStreamResult(pdfStream, "application/pdf");
                }

                await ConexionBD.Destroy();

                return Ok("No se encontro información");

                //return new NotFoundObjectResult(new { Id = 2, error = "No se encontro intormación" });
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("ERROR: " + ex.Message);
            }
        }


        [HttpPost]
        [Route("bloquear")]
        public async Task<IActionResult> bloquear()
        {
            try
            {
                // Obtenemos el usuario activo
                var RelacionBloqueada = await ConexionBD.database.QueryAsync<VariablesGlobales>("WHERE varName = 'Bloqueo_Relaciones'").SingleOrDefaultAsync();
                string bloquedo = RelacionBloqueada.varValue.ToString();

                if (bloquedo == "0")
                {
                    RelacionBloqueada.varValue = 1;
                    await ConexionBD.database.UpdateAsync(RelacionBloqueada);

                }
                else
                {
                    RelacionBloqueada.varValue = 0;
                    await ConexionBD.database.UpdateAsync(RelacionBloqueada);
                }

                await this.ConexionBD.Destroy();
                return Ok("Se bloquearon/desbloquearon relaciones correctamente");
            }
            catch (Exception ex)
            {
                await this.ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("desbloquearproducto")]
        public async Task<IActionResult> desbloquearproducto(PeticionesRest.Cortes.Relacion.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                // Obtenemos el usuario activo
                // var RelacionBloqueada = await ConexionBD.database.QueryAsync<VariablesGlobales>("WHERE varName = 'Bloqueo_Relaciones'").SingleOrDefaultAsync();
                var RelacionBloqueada = await ConexionBD.database.QueryAsync<Productos>("WHERE ProductoID=@0", parData.ProductoID).SingleOrDefaultAsync();
                // string bloquedo = RelacionBloqueada.varValue.ToString();

                if (RelacionBloqueada.Relacionesbloqueadas == true)
                {
                    RelacionBloqueada.Relacionesbloqueadas = false;
                    await ConexionBD.database.UpdateAsync(RelacionBloqueada);

                }
                else
                {
                    RelacionBloqueada.Relacionesbloqueadas = true;
                    await ConexionBD.database.UpdateAsync(RelacionBloqueada);
                }

                await this.ConexionBD.Destroy();
                return Ok("Se bloquearon/desbloquearon relaciones correctamente");
            }
            catch (Exception ex)
            {
                await this.ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("print3")]
        [Authorize]
        [TProteccionProducto]
        public async Task<IActionResult> Print3(PeticionesRest.Cortes.Relacion.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                var RelacionBloqueada = await ConexionBD.database.QueryAsync<VariablesGlobales>("WHERE varName = 'Bloqueo_Relaciones'", parData).SingleOrDefaultAsync();
                string bloquedo = RelacionBloqueada.varValue.ToString();
                var UserName2 = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual2 = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName2).FirstOrDefaultAsync();

                if (bloquedo == "0" || UsuarioActual2.MasterUser == true)
                {
                    ConexionBD.database.CommandTimeout = 9999;
                    parData.ProductoID = producto;
                    var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                    var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                    var Producto = await ConexionBD.database.SingleOrDefaultByIdAsync<Productos>(parData.ProductoID);
                    var ProductoCont = await ConexionBD.database.SingleOrDefaultByIdAsync<Productos>(2);


                    if (Producto.Relacionesbloqueadas == true & UsuarioActual2.MasterUser == false)
                    {
                        throw new Exception("RELACIONES BLOQUEADAS");
                    }
                    else
                    {
                        var ProductoTiendita = await ConexionBD.database.QueryAsync<Productos>("WHERE EmpresaId = @0 AND Tiendita = 1", Producto.EmpresaId).SingleOrDefaultAsync();
                        var ProductoPrestamoPersonal = await ConexionBD.database.QueryAsync<Productos>("WHERE EmpresaId = @0 AND PrestamoPersonal = 1", Producto.EmpresaId).SingleOrDefaultAsync();
                        var Sucursal = await ConexionBD.database.QueryAsync<Sucursales_VW>("WHERE SucursalID = @SucursalID", parData).SingleOrDefaultAsync();
                         if (Sucursal != null && Sucursal.Eslogan != null && Sucursal.SucursalID != 228)
                        {
                            
                            byte[] bytes = System.Text.Encoding.Default.GetBytes(Sucursal.Eslogan);
                            Sucursal.Eslogan = System.Text.Encoding.UTF8.GetString(bytes);
                            Sucursal.Eslogan = HttpUtility.HtmlEncode(Sucursal.Eslogan);
                        }

                        if (Sucursal.SucursalID == 228)
                        {
                            Sucursal.Eslogan = "Directo a tu bolsillo";
                        }

                        //var RelacionCortes = await ConexionBD.database.QueryAsync<RelacionCortes_VW>("WHERE (ProductoID = @0) AND (SucursalID = @1) AND (fechaCorte = CONVERT(DATETIME, @2, 103)) AND DistribuidorID IN (@3)", parData.ProductoID, parData.SucursalID, parData.fecha, parData.Distribuidores).OrderBy(x => x.DistribuidorID).ToArrayAsync();
                        // var RelacionCortesDetalle = await ConexionBD.database.QueryAsync<RelacionCortesDetalle2_VW>("WHERE (SucursalID = @0) AND (DistribuidorID IN (@1)) AND (saldoPlazo >= 0) AND (fechaCorte = CONVERT(DATETIME, @2, 103)) ORDER BY CreditoID, PagoPlazo ASC ", parData.SucursalID, parData.Distribuidores, parData.fecha, producto).OrderBy(x => x.DistribuidorID).ToArrayAsync();

                        string listaDist = string.Join(",", parData.Distribuidores);
                        var RelacionCortes = await ConexionBD.database.QueryAsync<RelacionesCortesData>("EXEC Cortes.getRelacionesCorteNuevo @0, @1, @2, @3", parData.fecha, parData.SucursalID, parData.ProductoID, listaDist).ToArrayAsync();
                        var Corresponsales = await ConexionBD.database.FetchAsync<Corresponsales_VW>("WHERE (Activo = 1)");

                        var token = JsonConvert.DeserializeObject<Auth>(ConfiaShop.LealtadAuth("jjaramillo@fconfia.com", "jjaramillo"));

                        var variale = await ConexionBD.database.QueryAsync<VariablesGlobales>("WHERE  (varName = @0)", "RELACIONES_LIMITE_DETALLE_NUEVO").FirstOrDefaultAsync();
                        var costGlobal = await ConexionBD.database.QueryAsync<VariablesGlobales>("WHERE varName ='VALERAS_COSTO'").SingleOrDefaultAsync();
                        var DscDistribuidor = await ConexionBD.database.QueryAsync<VariablesGlobales>("WHERE (varName = @0)", "DESCRIPCION_DISTRIBUIDOR").FirstOrDefaultAsync();

                        int limiteReg = int.Parse(variale.varValue.ToString());

                        // Generamos un prefijo del nombre de archivo
                        var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");
                        var listado_archivos = new List<string>();
                        var listado_imagenes = new List<string>();
                        var Count = 0;

                        var colorDocumento = "";
                        var nombreTiendita = "";
                        var nombreConfiaHome = "";
                        var nombreTienditaEncabezado = "";
                        var nombreConfiaHomeEncabezado = "";
                        var esVision = false;
                        var estiloCampaniaCancun = "";
                        var datosImproductivos = "";
                        var datosCancun2025 = "";
                        var IMAGENBANNER = "";
                        var SucursalesCampaniaCancun2025 = await ConexionBD.database.QueryAsync<dynamic>("EXEC Cortes.SucursalesCampaniaCancun2025").ToArrayAsync();
                        var SociasImp2025 = await ConexionBD.database.QueryAsync<dynamic>("EXEC Cortes.ObtenerSociasImp2025").ToArrayAsync();
                        switch (Producto.EmpresaId)
                        {
                            case 9:
                                IMAGENBANNER = "BANNERPRESTASTAR3.jpg";
                                nombreTienditaEncabezado = "Tienda Estelar";
                                nombreTiendita = nombreTienditaEncabezado;
                                nombreConfiaHomeEncabezado = "StarShop";
                                nombreConfiaHome = "Cr&eacute;dito " + nombreConfiaHomeEncabezado;
                                DscDistribuidor.varValue = "Estrella";
                                colorDocumento = "#BE56BE";
                                estiloCampaniaCancun = "";
                                break;
                            case 10:
                                IMAGENBANNER = "BANNERVISIONJT.jpg";
                                nombreTienditaEncabezado = "Tiendita";
                                nombreTiendita = nombreTienditaEncabezado;
                                nombreConfiaHomeEncabezado = "";
                                nombreConfiaHome = nombreConfiaHomeEncabezado;
                                colorDocumento = "#F7944C";
                                esVision = true;
                                estiloCampaniaCancun = "";
                                break;
                            case 15:
                                nombreTienditaEncabezado = "Tiendita";
                                nombreTiendita = nombreTienditaEncabezado;
                                nombreConfiaHomeEncabezado = "";
                                nombreConfiaHome = nombreConfiaHomeEncabezado;
                                colorDocumento = "#F7944C";
                                esVision = true;
                                estiloCampaniaCancun = "";
                                break;
                            case 16:
                                nombreTienditaEncabezado = "La Tiendita";
                                nombreTiendita = nombreTienditaEncabezado;
                                nombreConfiaHomeEncabezado = "ConfiaHome";
                                nombreConfiaHome = "Cr&eacute;dito " + nombreConfiaHomeEncabezado;
                                colorDocumento = "#1DA1F2";
                                estiloCampaniaCancun = "";
                                break;
                            default:
                                colorDocumento = "#1DA1F2";
                                estiloCampaniaCancun = "";
                                break;
                        }

                         var logo = Producto.Logo;
                        if (parData.SucursalID == 228)
                        {
                            logo = ProductoCont.Logo;
                        }

                        Guid g = Guid.NewGuid();

                        var logoname = string.Concat("logo", "_" + g.ToString() + ".jpeg");

                        await System.IO.File.WriteAllBytesAsync(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "LogoImg", logoname), logo);

                        listado_imagenes.Add(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "LogoImg", logoname));

                        NumberFormatInfo nfi = new CultureInfo(CultureInfo.CurrentCulture.ToString(), false).NumberFormat;
                        nfi.PercentDecimalDigits = 0;

                        string fechaCorteString = parData.fecha;
                        string formato = "dd/MM/yyyy";
                        DateTime fecha = DateTime.ParseExact(fechaCorteString, formato, CultureInfo.InvariantCulture);
                        int diasmes = DateTime.DaysInMonth(fecha.Year, fecha.Month);

                        var formato2 = parData.formato;
                        if (parData.tipo == 1)
                        {
                            if (parData.formato == 1)
                            {
                                if (fecha.Day == 23 && diasmes == 31)
                                {
                                    parData.formato = 14;
                                }
                                else
                                {
                                    parData.formato = 13;
                                }
                            }

                            else if (parData.formato == 2)
                            {
                                if (fecha.Day == 23 && diasmes == 31)
                                {
                                    parData.formato = 17;
                                }
                                else
                                {
                                    parData.formato = 16;
                                }
                            }
                            else
                            {
                                if (fecha.Day == 23 && diasmes == 31)
                                {
                                    parData.formato = 21;
                                }
                                else
                                {
                                    parData.formato = 20;
                                }
                            }

                            // CICLO FOR CONTENIENDO LA CABECERA RELACION CORTE DE LOS DVS SELECCIONADOS
                            foreach (var RelacionCorte in RelacionCortes)
                            {
                                var sucursalValidar = RelacionCorte.SucursalID;
                                var sociaIDValidar = RelacionCorte.DistribuidorID;
                                var colocado = SociasImp2025.FirstOrDefault(item => item.DistribuidorID == sociaIDValidar);
                                datosImproductivos = "";
                                datosCancun2025 = "";
                                if (SociasImp2025.Any(s => s.DistribuidorID == sociaIDValidar))
                                {
                                    IMAGENBANNER = "BANNERIMPRODUCTIVAS.jpg";
                                    datosImproductivos = "<p style=\"position: absolute; left: 115px; top: 200px; margin: 0;\">" + sociaIDValidar.ToString() + "</p>" +
                             "<br>" +
                             "<p style=\"position: absolute; left: 115px; top: 240px; margin: 0;\">" + colocado.Colocado.ToString() + "</p>";
                                    IMAGENBANNER = "BANNERIMPRODUCTIVAS.jpg";

                                }

                                if (SucursalesCampaniaCancun2025.Any(s => s.SucursalID == sucursalValidar))
                                {
                                    datosCancun2025 = "<p style=\"position: absolute; left: 205px; top: 1165px; margin: 0;\">" + sociaIDValidar.ToString() + "</p>" +
                            "<br>" +
                            "<p style=\"position: absolute; left: 600px; top: 1165px; margin: 0;\">0.00</p>";
                                    estiloCampaniaCancun = "" +
                                    ".imageDIV2 {" +
                                        "page-break-inside: avoid;" +
                                        "break-inside: avoid;" +
                                        "position: relative;" +
                                        "width: 100%;" +
                                        "height: 100%;" +
                                        "overflow: hidden;" +
                                    "}" +

                                    ".imageDIV2::before {" +
                                        "border-radius: 25px;" +
                                        "content: \"\";" +
                                        "position: absolute;" +
                                        "top: 0;" +
                                        "left: 0;" +
                                        "width: 100%;" +
                                        "height: 100%;" +
                                        "background: url(\"https://@@SERVER/pdf/CampanaCancun.jpeg\");" +
                                        "background-repeat: no-repeat;" +
                                        "background-position: center;" +
                                        "background-size: 100% 100%;" +
                                        "opacity: 1;" +
                                        "z-index: 1;" +
                                        "transform: scale(1);" +
                                        "overflow: hidden;" +
                                    "}";
                                }

                                parData.DistribuidorID = RelacionCorte.DistribuidorID;

                                var LineaCredito = await ConexionBD.database.QueryAsync<Contratos_VW>("WHERE DistribuidorID=@0 AND Principal=1", RelacionCorte.DistribuidorID).FirstOrDefaultAsync();
                                var LineaCreditoPrestamo = await ConexionBD.database.QueryAsync<Contratos_VW>("WHERE DistribuidorID=@0 AND ProductoID=@1", RelacionCorte.DistribuidorID, ProductoPrestamoPersonal.ProductoID).FirstOrDefaultAsync();
                                var LineaCreditoTiendita = await ConexionBD.database.QueryAsync<Contratos_VW>("WHERE DistribuidorID=@0 AND ProductoID=@1", RelacionCorte.DistribuidorID, ProductoTiendita.ProductoID).FirstOrDefaultAsync();

                                if (RelacionCorte != null)
                                {
                                    Count++;
                                    parData.DistribuidorNivelID = RelacionCorte.DistribuidorNivelID.Value;
                                    parData.DistribuidorNivelIDOrigen = RelacionCorte.DistribuidorNivelIDOrigen.Value;
                                    var tabla_productos = "";
                                    switch (parData.ProductoID)
                                    {
                                        case 120:
                                            tabla_productos = @"
                                            <thead style=""background-color: @@COLOR"">
                                                <tr style=""color: white"">
                                                    <th class=""text-center"">Producto</th>
                                                    <th class=""text-center"">Vale Dinero</th>
                                                    <th class=""text-center"">Linea de prestamos</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td class=""text-center"">Disponible</td>
                                                    <td class=""text-center"">@@DISPONIBLE</td>
                                                    <td class=""text-center"">@@LINEAPRESTAMO</td>
                                                </tr>
                                            </tbody>";
                                            break;
                                        case 75:
                                        case 56:
                                            tabla_productos = @"
                                            <thead style=""background-color: @@COLOR"">
                                                <tr style=""color: white"">
                                                    <th class=""text-center"">Producto</th>
                                                    <th class=""text-center"">Vale Dinero</th>
                                                    <th class=""text-center"">Linea de prestamos</th>
                                                    <th class=""text-center"">@@NOMBREENCABEZADOTIENDITA</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td class=""text-center"">Disponible</td>
                                                    <td class=""text-center"">@@DISPONIBLE</td>
                                                    <td class=""text-center"">@@LINEAPRESTAMO</td>
                                                    <td class=""text-center"">@@LINEATIENDITA</td>
                                                </tr>
                                            </tbody>";
                                            break;
                                        default:
                                            tabla_productos = @"
                                            <thead style=""background-color: @@COLOR"">
                                                <tr style=""color: white"">
                                                    <th class=""text-center"">Producto</th>
                                                    <th class=""text-center"">Vale Dinero</th>
                                                    <th class=""text-center"">Linea de prestamos</th>
                                                    <th class=""text-center"">@@NOMBREENCABEZADOTIENDITA</th>
                                                    <th class=""text-center"">@@NOMBREENCABEZADOCONFIAHOME</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td class=""text-center"">Disponible</td>
                                                    <td class=""text-center"">@@DISPONIBLE</td>
                                                    <td class=""text-center"">@@LINEAPRESTAMO</td>
                                                    <td class=""text-center"">@@LINEATIENDITA</td>
                                                    <td class=""text-center"">@@LINEACONFIAHOME</td>
                                                </tr>
                                            </tbody>";
                                            break;
                                    }
                                    // var RelacionCortesTablaDias = formato2 == 1 ? await ConexionBD.database.FetchAsync<RelacionCortesTablaDias_VW>("SELECT top 4 * FROM Cortes.RelacionCortesTablaDias_VW WHERE  (fechaCorte = CONVERT(DATETIME, @fecha, 103)) AND (DistribuidorNivelID = @DistribuidorNivelID) AND (DistribuidorNivelIDOrigen = @DistribuidorNivelIDOrigen) AND (Renglon between 10 and @formato) AND (ProductoID = @ProductoID) AND (SucursalID = @SucursalID)", parData) : formato2 == 2 ? await ConexionBD.database.FetchAsync<RelacionCortesTablaDias_VW>("SELECT top 7 * FROM Cortes.RelacionCortesTablaDias_VW WHERE  (fechaCorte = CONVERT(DATETIME, @fecha, 103)) AND (DistribuidorNivelID = @DistribuidorNivelID) AND (DistribuidorNivelIDOrigen = @DistribuidorNivelIDOrigen) AND (Renglon between 10 and @formato) AND (ProductoID = @ProductoID) AND (SucursalID = @SucursalID)", parData) : await ConexionBD.database.FetchAsync<RelacionCortesTablaDias_VW>("SELECT top 9 * FROM Cortes.RelacionCortesTablaDias_VW WHERE  (fechaCorte = CONVERT(DATETIME, @fecha, 103)) AND (DistribuidorNivelID = @DistribuidorNivelID) AND (DistribuidorNivelIDOrigen = @DistribuidorNivelIDOrigen) AND (Renglon between 10 and @formato) AND (ProductoID = @ProductoID) AND (SucursalID = @SucursalID)", parData);
                                    //CambioParaDiasRelacion
                                    List<RelacionCortesTablaDias_VW> RelacionCortesTablaDias = null;
                                    switch (formato2)
                                    {
                                        case 1:
                                            RelacionCortesTablaDias = await ConexionBD.database.FetchAsync<RelacionCortesTablaDias_VW>(@"SELECT top 4 * 
                                            FROM Cortes.RelacionCortesTablaDias_VW 
                                            WHERE (fechaCorte = CONVERT(DATETIME, @fecha, 103)) 
                                            AND (DistribuidorNivelID = @DistribuidorNivelID) 
                                            AND (DistribuidorNivelIDOrigen = @DistribuidorNivelIDOrigen) 
                                            AND (Renglon between 10 AND @formato) 
                                            AND (ProductoID = @ProductoID) 
                                            AND (SucursalID = @SucursalID)", parData);
                                            break;
                                        case 2:
                                            RelacionCortesTablaDias = await ConexionBD.database.FetchAsync<RelacionCortesTablaDias_VW>(@"SELECT top 7 * 
                                            FROM Cortes.RelacionCortesTablaDias_VW 
                                            WHERE (fechaCorte = CONVERT(DATETIME, @fecha, 103)) 
                                            AND (DistribuidorNivelID = @DistribuidorNivelID) 
                                            AND (DistribuidorNivelIDOrigen = @DistribuidorNivelIDOrigen) 
                                            AND (Renglon between 10 AND @formato) 
                                            AND (ProductoID = @ProductoID) 
                                            AND (SucursalID = @SucursalID)", parData);
                                            break;
                                        case 3:
                                            RelacionCortesTablaDias = await ConexionBD.database.FetchAsync<RelacionCortesTablaDias_VW>(@"SELECT top 9 * 
                                            FROM Cortes.RelacionCortesTablaDias_VW WHERE (fechaCorte = CONVERT(DATETIME, @fecha, 103)) 
                                            AND (DistribuidorNivelID = @DistribuidorNivelID) 
                                            AND (DistribuidorNivelIDOrigen = @DistribuidorNivelIDOrigen) 
                                            AND (Renglon between 11 AND @formato)
                                            AND (ProductoID = @ProductoID) 
                                            AND (SucursalID = @SucursalID)", parData);
                                            break;
                                        default:
                                            throw new Exception("FORMATO NO VALIDO");
                                    }
                                    var RelacionCorteTablaDiasFirst = RelacionCortesTablaDias[0];
                                    var monederoSociaFromSP = await ConexionBD.database.QueryAsync<MonederoSocia>("EXEC Cortes.GetMonederoSocia @0, @1", RelacionCorte.DistribuidorID, RelacionCorte.SucursalID).ToArrayAsync();

                                    UsuarioActual.Nombre = HttpUtility.HtmlEncode(UsuarioActual.Nombre);
                                    // SE EMPIEZA A REEMPLAZAR LAS VARIABLES DE LA PLANTILLA DEL HTML
                                    var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Relacion", "RelacionCortePag1.html"));
                                    html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                                    html = html.Replace("@@IMPRIMIO", UsuarioActual.Nombre.ToString());
                                    html = html.Replace("@@TABLAPRODUCTOSCABECERA", tabla_productos);
                                    html = html.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                                    html = html.Replace("@@ID_DIST", RelacionCorte.DistribuidorID.ToString());
                                    if (RelacionCorte != null && RelacionCorte.NombreCompleto != null)
                                    {
                                        byte[] bytes = System.Text.Encoding.Default.GetBytes(RelacionCorte.NombreCompleto);
                                        RelacionCorte.NombreCompleto = System.Text.Encoding.UTF8.GetString(bytes);
                                        RelacionCorte.NombreCompleto = HttpUtility.HtmlEncode(RelacionCorte.NombreCompleto);
                                    }
                                    html = html.Replace("@@NOMBRE_DIST", RelacionCorte.NombreCompleto.ToUpper());
                                    html = html.Replace("@@TELEFONO_DIST", RelacionCorte.TelefonoMovil);
                                    html = html.Replace("@@FECHA_CORTE", RelacionCorte.fechaCorte);
                                    if (RelacionCorte?.FechaVencimiento != null)
                                    {
                                        DateOnly fechaVencimiento = DateOnly.FromDateTime(RelacionCorte.FechaVencimiento.Value);
                                        fechaVencimiento = fechaVencimiento.AddDays(-5);
                                        html = html.Replace("@@FECHA_LIMITE", fechaVencimiento.ToString("dd/MM/yyyy"));
                                    }
                                    else
                                    {
                                        html = html.Replace("@@FECHA_LIMITE", "");
                                    }
                                    decimal acumuladoValue = 0m;

                                    // Accumulate values if the result is not null
                                    if (monederoSociaFromSP != null)
                                    {
                                        foreach (var item in monederoSociaFromSP)
                                        {
                                            if (decimal.TryParse(item.Monedero, out decimal parsedValue))
                                            {
                                                acumuladoValue += parsedValue;
                                            }
                                        }
                                    }

                                    // Replace @@ACUMULADO in the HTML string with the formatted currency value
                                    html = html.Replace("@@ACUMULADO", acumuladoValue.ToString("C", CultureInfo.CurrentCulture));

                                    html = html.Replace("@@AHORRO", "$0.00");
                                    html = html.Replace("@@DISPONIBLE", LineaCredito.LineaCreditoDisponible.Value.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@LINEAPRESTAMO", LineaCreditoPrestamo.LineaCreditoDisponible.Value.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@LINEATIENDITA", LineaCreditoTiendita.LineaCreditoDisponible.Value.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@NOMBREENCABEZADOTIENDITA", nombreTienditaEncabezado);
                                    html = html.Replace("@@NOMBREENCABEZADOCONFIAHOME", nombreConfiaHomeEncabezado);

                                    html = html.Replace("@@DscDist", DscDistribuidor.varValue.ToString());
                                    html = html.Replace("@@LOGO", logoname);
                                    html = html.Replace("@@ESLOGAN", Sucursal.Eslogan == null ? "" : Sucursal.Eslogan);
                                    html = html.Replace("@@COLOR", colorDocumento);
                                    if (Count == 1)
                                    {
                                        html = html.Replace("@@JQUERY", "<script type=\"text/javascript\" src=\"https://code.jquery.com/jquery.min.js\"></script>");
                                    }
                                    else
                                    {
                                        html = html.Replace("@@JQUERY", "");
                                    }

                                    var registros_detalle_producto_principal = 0;
                                    decimal pagoT = 0;
                                    decimal pagoCom = 0;
                                    decimal importe = 0;
                                    decimal saldo = 0;
                                    decimal pago = 0;
                                    decimal remanente = 0;

                                    decimal importeCreditosPersonales = 0;
                                    decimal importeAtrasoCreditosPersonales = 0;
                                    decimal saldoCreditosPersonales = 0;
                                    decimal pagoCreditosPersonales = 0;
                                    decimal remanenteCreditosPersonales = 0;

                                    decimal proteccionCorte = 0;
                                    decimal totalCobranza = 0;

                                    decimal cobroValera = 0;
                                    decimal cobroFaltante = 0;
                                    decimal saldoFavor = 0;
                                    decimal creditoTienditaTotal = 0;
                                    decimal creditoPrestamoConfiaHome = 0;

                                    string tabla_creditosPersonales = "";
                                         //
                                    tabla_creditosPersonales += "<div class=\"d-table-row\" style=\"width: 100%\">";
                                    tabla_creditosPersonales += "  <div class=\"text-center d-table-cell\">";
                                    tabla_creditosPersonales += "    <figure class=\"text-center\">";
                                    tabla_creditosPersonales += "      <div";
                                    tabla_creditosPersonales += "        class=\"card-subtitle\"";
                                    tabla_creditosPersonales += "        style=\"color: black; background-color:" + colorDocumento + "\"";
                                    tabla_creditosPersonales += "      >";
                                    tabla_creditosPersonales += "        <h8><strong>Cr&eacute;ditos Personales</strong></h8>";
                                    tabla_creditosPersonales += "      </div>";
                                    tabla_creditosPersonales += "      <table class=\"table table-sm\" style=\"border: #ffffff; width: 100%;font-size: 11px\">";
                                    tabla_creditosPersonales += "        <thead>";
                                    tabla_creditosPersonales += "          <tr>";
                                    tabla_creditosPersonales += "            <th class=\"text-center\">Producto</th>";
                                    tabla_creditosPersonales += "            <th class=\"text-center\">Fecha de cr&eacute;dito</th>";
                                    tabla_creditosPersonales += "            <th class=\"text-center\">NoCda</th>";
                                    tabla_creditosPersonales += "            <th class=\"text-center\">Importe</th>";
                                    tabla_creditosPersonales += "            <th class=\"text-center\">Saldo</th>";
                                    tabla_creditosPersonales += "            <th class=\"text-center\">Atraso</th>";
                                    tabla_creditosPersonales += "            <th class=\"text-center\">Pago Plazo</th>";
                                    tabla_creditosPersonales += "            <th class=\"text-center\">Saldo desp. de pago</th>";
                                    tabla_creditosPersonales += "            <th class=\"text-center\">Plazo</th>";
                                    tabla_creditosPersonales += "          </tr>";
                                    tabla_creditosPersonales += "        </thead>";
                                    tabla_creditosPersonales += "        <tbody>";
                                    tabla_creditosPersonales += "          @@DETALLE_CREDITOS_PERSONALES";
                                    tabla_creditosPersonales += "        </tbody>";
                                    tabla_creditosPersonales += "        <tfoot>";
                                    tabla_creditosPersonales += "          @@FOOTERROWCREDITOSPERSONALES";
                                    tabla_creditosPersonales += "        </tfoot>";
                                    tabla_creditosPersonales += "      </table>";
                                    tabla_creditosPersonales += "    </figure>";
                                    tabla_creditosPersonales += "  </div>";
                                    tabla_creditosPersonales += "</div>";
                                    string tabla_cobranza = "";
                                    tabla_cobranza += "<div class=\"d-table-row\" style=\"width: 100%\">";
                                    tabla_cobranza += "  <div class=\"text-center d-table-cell\">";
                                    tabla_cobranza += "    <figure class=\"text-center\">";
                                    tabla_cobranza += "      <div";
                                    tabla_cobranza += "        class=\"card-subtitle\"";
                                    tabla_cobranza += "        style=\"color: black; background-color:" + colorDocumento + "\"";
                                    tabla_cobranza += "      >";
                                    tabla_cobranza += "        <h8><strong>VALE DE COBRANZA</strong></h8>";
                                    tabla_cobranza += "      </div>";
                                    tabla_cobranza += "      <table class=\"table table-sm\" style=\"border: #ffffff; width: 100%\">";
                                    tabla_cobranza += "        <thead style=\"font-size: 12px\">";
                                    tabla_cobranza += "          <tr>";
                                    tabla_cobranza += "            <th class=\"text-center\">Capital + Inter&eacute;s</th>";
                                    tabla_cobranza += "            <th class=\"text-center\">Complementos (USV + IVA)</th>";
                                    tabla_cobranza += "            <th class=\"text-center\">Tienda CF</th>";
                                    tabla_cobranza += "            <th class=\"text-center\">Total</th>";
                                    tabla_cobranza += "          </tr>";
                                    tabla_cobranza += "        </thead>";
                                    tabla_cobranza += "        <tbody>";
                                    tabla_cobranza += "          @@DETALLE_COBRANZA";
                                    tabla_cobranza += "        </tbody>";
                                    tabla_cobranza += "      </table>";
                                    tabla_cobranza += "    </figure>";
                                    tabla_cobranza += "  </div>";
                                    tabla_cobranza += "</div>";
                                    string footer_tabla_creditos_personales = "";
                                    var fila_relacion_detalle = "";
                                    var fila_relacion_detalle_2 = "";
                                    var fila_creditos_personales = "";
                                    var fila_tabla_cobranza = "";

                                    var relacionCorteFromSP = await ConexionBD.database.QueryAsync<ParteArribaRelacion>("EXEC Cortes.ParteArribaRelacion @0, @1", RelacionCorte.fechaCorte, RelacionCorte.DistribuidorID).ToArrayAsync();
                                    var detalleProductoPrincipal = relacionCorteFromSP.Where(x => x.EsPersonal == false && x.SaldoPlazo > 0.90m);
                                    var detalleProductoCreditosPersonales = relacionCorteFromSP.Where(x => x.EsPersonal == true && x.SaldoPlazo > 0.90m);

                                    decimal basecomisionCorte = 0;
                                    decimal basecomisionTiendita = 0;
                                    decimal baseComisionTienditaCorteActual = 0;
                                    decimal complementosCorte = 0;
                                    decimal creditoPrestamoPersonal = 0;
                                    decimal interesPagado = 0;
                                    decimal capitalPagado = 0;
                                    decimal otros = 0;
                                    int ultimoCredito = 0;
                                    foreach (var detalle in detalleProductoPrincipal)
                                    {
                                        var CreditoOtraSocia = await ConexionBD.database.QueryAsync<Creditos_VW>("WHERE ClienteID = @0 AND DistribuidorID != @1", detalle.ClienteID, RelacionCorte.DistribuidorID).FirstOrDefaultAsync();
                                        // var textoMasDeUnVale = CreditoOtraSocia != null ? "Si" : "";
                                        var textoMasDeUnVale = "";
                                        var PlanPagosDetalle = await ConexionBD.database.QueryAsync<PlanPagos>("WHERE CreditoID = @0 AND NoPago = @1", detalle.CreditoID, detalle.NoPago).FirstOrDefaultAsync();

                                        decimal baseComisionUnitario = detalle.CapitalPendiente + detalle.InteresPendiente;
                                        decimal complementoCorteUnitario = detalle.IvaPendiente + detalle.SeguroPendiente + detalle.CargoPendiente + detalle.ManejoCuentaPendiente;

                                        if (detalle.FechaVencimiento == RelacionCorte.FechaVencimiento)
                                        {
                                            pagoCom += baseComisionUnitario;
                                            interesPagado += detalle.CapitalAbonado;
                                            capitalPagado += detalle.InteresAbonado;
                                            baseComisionTienditaCorteActual += detalle.TienditaPendiente;
                                        }

                                        basecomisionTiendita += detalle.TienditaPendiente;
                                        basecomisionCorte += baseComisionUnitario;
                                        complementosCorte += complementoCorteUnitario;

                                        registros_detalle_producto_principal += 1;
                                        pagoT += detalle.SaldoPlazo;
                                        decimal saldoDespuesPago = detalle.SaldoActual - detalle.SaldoPlazo;
                                        importe += detalle.ImporteTotal;
                                        saldo += detalle.SaldoActual;
                                        pago += detalle.SaldoPlazo;
                                        remanente += Math.Abs(saldoDespuesPago);

                                        //ITERADO DE REGISTROS LLENADO DEL BODY VALE DINERO

                                        if (registros_detalle_producto_principal < (limiteReg + 1))
                                        {
                                            fila_relacion_detalle += "<tr style=\"font-size:12px;\">";
                                            fila_relacion_detalle += "<td class=\"text-center\">" + textoMasDeUnVale + "</td>";
                                            fila_relacion_detalle += "<td class=\"text-center\"></td>";
                                            fila_relacion_detalle += "<td class=\"text-center\"></td>";
                                            fila_relacion_detalle += "<td class=\"text-center\">" + detalle.FechaCanje.ToString("dd/MM/yyyy") + "</td>";
                                            fila_relacion_detalle += "<td class=\"text-center\">" + detalle.CreditoID.ToString() + "</td>";
                                            fila_relacion_detalle += "<td class=\"text-center\">" + detalle.ValeCanje.ToString() + "</td>";
                                            fila_relacion_detalle += "<td class=\"text-center\" style=\"font-size:10px;\">" + HttpUtility.HtmlEncode(detalle.NombreCompleto) + "</td>";
                                            fila_relacion_detalle += "<td class=\"text-center\">0</td>";
                                            fila_relacion_detalle += "<td class=\"text-center\">" + detalle.ImporteTotal.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                            fila_relacion_detalle += "<td class=\"text-center\">" + detalle.SaldoActual.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                            fila_relacion_detalle += "<td class=\"text-center\">" + detalle.SaldoPlazo.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                            fila_relacion_detalle += "<td class=\"text-center\">" + saldoDespuesPago.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                            fila_relacion_detalle += "<td class=\"text-center\" style=\"white-space:nowrap;" + (ultimoCredito == detalle.CreditoID ? "background:#d3d3d3;" : "") + "\">" + detalle.NoPago + " / " + detalle.Plazos + "</td>";
                                            fila_relacion_detalle += "</tr>";
                                        }
                                        else
                                        {
                                            fila_relacion_detalle_2 += "<tr style=\"font-size:12px;\">";
                                            fila_relacion_detalle_2 += "<td class=\"text-center\">" + textoMasDeUnVale + "</td>";
                                            fila_relacion_detalle_2 += "<td class=\"text-center\"></td>";
                                            fila_relacion_detalle_2 += "<td class=\"text-center\"></td>";
                                            fila_relacion_detalle_2 += "<td class=\"text-center\">" + detalle.FechaCanje.ToString("dd/MM/yyyy") + "</td>";
                                            fila_relacion_detalle_2 += "<td class=\"text-center\">" + detalle.CreditoID.ToString() + "</td>";
                                            fila_relacion_detalle_2 += "<td class=\"text-center\">" + detalle.ValeCanje.ToString() + "</td>";
                                            fila_relacion_detalle_2 += "<td class=\"text-center\" style=\"font-size:10px;\">" + HttpUtility.HtmlEncode(detalle.NombreCompleto) + "</td>";
                                            fila_relacion_detalle_2 += "<td class=\"text-center\">0</td>";
                                            fila_relacion_detalle_2 += "<td class=\"text-center\">" + detalle.ImporteTotal.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                            fila_relacion_detalle_2 += "<td class=\"text-center\">" + detalle.SaldoActual.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                            fila_relacion_detalle_2 += "<td class=\"text-center\">" + detalle.SaldoPlazo.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                            fila_relacion_detalle_2 += "<td class=\"text-center\">" + saldoDespuesPago.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                            fila_relacion_detalle_2 += "<td class=\"text-center\" style=\"white-space:nowrap;" + (ultimoCredito == detalle.CreditoID ? "background:#d3d3d3;" : "") + "\">" + detalle.NoPago + " / " + detalle.Plazos + "</td>";
                                            fila_relacion_detalle_2 += "</tr>";
                                        }
                                        ultimoCredito = detalle.CreditoID;
                                    }

                                    foreach (var detalle in detalleProductoCreditosPersonales)
                                    {
                                        switch (detalle.TipoCreditoID)
                                        {
                                            case 5:
                                                creditoPrestamoPersonal += detalle.SaldoPlazo;
                                                break;
                                            case 6:
                                                creditoTienditaTotal += detalle.SaldoPlazo;
                                                break;
                                            case 8:
                                                proteccionCorte += detalle.SaldoPlazo;
                                                break;
                                            case 7:
                                                cobroValera += detalle.SaldoPlazo;
                                                break;
                                            case 10:
                                                cobroFaltante += detalle.SaldoPlazo;
                                                break;
                                            case 3:
                                            case 19:
                                                creditoPrestamoConfiaHome += detalle.SaldoPlazo;
                                                break;
                                            case 9:
                                            case 11:
                                            case 12:
                                            case 13:
                                            case 15:
                                            case 17:
                                            case 18:
                                                otros += detalle.SaldoPlazo;
                                                break;
                                        }
                                        pagoT += detalle.SaldoPlazo;
                                        decimal saldoDespuesPago = detalle.SaldoActual - detalle.SaldoPlazo;
                                        importeCreditosPersonales += detalle.ImporteTotal;
                                        importeAtrasoCreditosPersonales += detalle.SaldoAtrasado;
                                        saldoCreditosPersonales += detalle.SaldoActual;
                                        pagoCreditosPersonales += detalle.SaldoPlazo;
                                        remanenteCreditosPersonales += Math.Abs(saldoDespuesPago);

                                        //LLENADO DEL BOY DE CREDITOS PRESONALES

                                        fila_creditos_personales += "<tr style=\"font-size:12px;\">";
                                        fila_creditos_personales += "<td class=\"text-center\">" + detalle.Descripcion.ToString() + "</td>";
                                        fila_creditos_personales += "<td class=\"text-center\">" + detalle.FechaCanje.ToString("dd/MM/yyyy") + "</td>";
                                        fila_creditos_personales += "<td class=\"text-center\">" + detalle.CreditoID.ToString() + "</td>";
                                        fila_creditos_personales += "<td class=\"text-center\">" + detalle.ImporteTotal.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                        fila_creditos_personales += "<td class=\"text-center\">" + detalle.SaldoActual.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                        fila_creditos_personales += "<td class=\"text-center\">" + detalle.SaldoAtrasado.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                        fila_creditos_personales += "<td class=\"text-center\">" + detalle.SaldoPlazo.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                        fila_creditos_personales += "<td class=\"text-center\">" + saldoDespuesPago.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                        fila_creditos_personales += "<td class=\"text-center\" style=\"white-space:nowrap;\">" + detalle.NoPago + " / " + detalle.Plazos + "</td>";
                                        fila_creditos_personales += "</tr>";
                                    }

                                    footer_tabla_creditos_personales += "<tr>";
                                    footer_tabla_creditos_personales += "<th class=\"text-center\" colspan=\"3\" scope=\"row\">TOTAL</th>";
                                    footer_tabla_creditos_personales += $"<th class=\"text-center\">{importeCreditosPersonales.ToString("C", CultureInfo.CurrentCulture)}</th>";
                                    footer_tabla_creditos_personales += $"<th class=\"text-center\">{saldoCreditosPersonales.ToString("C", CultureInfo.CurrentCulture)}</th>";
                                    footer_tabla_creditos_personales += $"<th class=\"text-center\">{importeAtrasoCreditosPersonales.ToString("C", CultureInfo.CurrentCulture)}</th>";
                                    footer_tabla_creditos_personales += $"<th class=\"text-center\">{pagoCreditosPersonales.ToString("C", CultureInfo.CurrentCulture)}</th>";
                                    footer_tabla_creditos_personales += $"<th class=\"text-center\">{remanenteCreditosPersonales.ToString("C", CultureInfo.CurrentCulture)}</th>";
                                    footer_tabla_creditos_personales += "<th class=\"text-center\"></th>";
                                    footer_tabla_creditos_personales += "</tr>";

                                    totalCobranza = basecomisionCorte + complementosCorte + basecomisionTiendita;
                                    fila_tabla_cobranza += "<tr>";
                                    fila_tabla_cobranza += "<td class=\"text-center\">" + basecomisionCorte.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                    fila_tabla_cobranza += $"<td class=\"text-center\">{complementosCorte.ToString("C", CultureInfo.CurrentCulture)}</td>";
                                    fila_tabla_cobranza += $"<td class=\"text-center\">{basecomisionTiendita.ToString("C", CultureInfo.CurrentCulture)}</td>";
                                    fila_tabla_cobranza += $"<td class=\"text-center\">{totalCobranza.ToString("C", CultureInfo.CurrentCulture)}</td>";
                                    fila_tabla_cobranza += "</tr>";
                                    tabla_cobranza = tabla_cobranza.Replace("@@DETALLE_COBRANZA", fila_tabla_cobranza);

                                    tabla_creditosPersonales = tabla_creditosPersonales.Replace("@@DETALLE_CREDITOS_PERSONALES", fila_creditos_personales);
                                    tabla_creditosPersonales = tabla_creditosPersonales.Replace("@@FOOTERROWCREDITOSPERSONALES", footer_tabla_creditos_personales);

                                    if (registros_detalle_producto_principal >= limiteReg)
                                    {
                                        html = html.Replace("@@CREDITOSPERSONALESTABLA", "");
                                        html = html.Replace("@@VALECOBRANZATABLA", "");
                                    }
                                    else
                                    {
                                        html = html.Replace("@@CREDITOSPERSONALESTABLA", tabla_creditosPersonales);
                                        html = html.Replace("@@VALECOBRANZATABLA", tabla_cobranza);
                                    }
                                    html = html.Replace("@@DETALLE_RELACION", fila_relacion_detalle);
                                    html = html.Replace("@@COUNT", registros_detalle_producto_principal.ToString());
                                    html = html.Replace("@@TIMPORTE", importe.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@TSALDO", saldo.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@TPAGO", pago.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@TREMANENTE", remanente.ToString("C", CultureInfo.CurrentCulture));
                                    decimal LINEACONFIAHOME = (LineaCredito.LineaCreditoDisponible.Value * 0.60m) - creditoPrestamoConfiaHome;
                                    html = html.Replace("@@LINEACONFIAHOME", !esVision ? LINEACONFIAHOME.ToString("C", CultureInfo.CurrentCulture) : "");

                                    // Guardamos los archivos temporalmente
                                    await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")), html);
                                    listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")));


                                    if (registros_detalle_producto_principal >= limiteReg)
                                    {
                                        html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Relacion", "RelacionCortePagIntermedia.html"));
                                        html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                                        html = html.Replace("@@IMPRIMIO", UsuarioActual.Nombre.ToString());
                                        html = html.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                                        html = html.Replace("@@ID_DIST", RelacionCorte.DistribuidorID.ToString());

                                        html = html.Replace("@@LOGO", logoname);
                                        html = html.Replace("@@ESLOGAN", Sucursal.Eslogan == null ? "" : Sucursal.Eslogan);
                                        html = html.Replace("@@COLOR", colorDocumento);

                                        html = html.Replace("@@DETALLE_RELACION_2", fila_relacion_detalle_2);
                                        html = html.Replace("@@COUNT", registros_detalle_producto_principal.ToString());
                                        html = html.Replace("@@TIMPORTE", importe.ToString("C", CultureInfo.CurrentCulture));
                                        html = html.Replace("@@TSALDO", saldo.ToString("C", CultureInfo.CurrentCulture));
                                        html = html.Replace("@@TPAGO", pago.ToString("C", CultureInfo.CurrentCulture));
                                        html = html.Replace("@@TREMANENTE", remanente.ToString("C", CultureInfo.CurrentCulture));
                                        html = html.Replace("@@CREDITOSPERSONALESTABLA", tabla_creditosPersonales);
                                        html = html.Replace("@@VALECOBRANZATABLA", tabla_cobranza);

                                        // Guardamos los archivos temporalmente
                                        await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "5_" + Count.ToString() + ".html")), html);
                                        listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "5_" + Count.ToString() + ".html")));
                                    }

                                    // html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Relacion", "Pagina2.html"));
                                    html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Relacion", "RelacionCortePagFinal.html"));

                                    html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                                    html = html.Replace("@@COLOR", colorDocumento);
                                    html = html.Replace("@@LOGO", logoname);

                                    var fila_tabla_bonificacion = "";
                                    var fila_tabla_corresponsales = "";

                                    //var cult = CultureInfo.CurrentCulture.ToString();
                                    decimal PorcComisionAnterior = 0;
                                    decimal bonificacionTiendita = baseComisionTienditaCorteActual * RelacionCorteTablaDiasFirst.PorcComision;
                                    pagoCom += baseComisionTienditaCorteActual;
                                    pagoCom += interesPagado;
                                    pagoCom += capitalPagado;

                                    foreach (var detalle in RelacionCortesTablaDias)
                                    {
                                        if (fecha.Day == 23 && diasmes == 31)
                                        {
                                            DateTime fechaActual = detalle.FechaPago ?? DateTime.MinValue;
                                            int diasmes2 = DateTime.DaysInMonth(fechaActual.Year, fechaActual.Month);

                                            // Obtener el día del mes
                                            int dia = fechaActual.Day;

                                            fila_tabla_bonificacion += "<tr class=\"text-center\"font-size:13px\">";
                                            fila_tabla_bonificacion += "<td>" + detalle.FechaPago.Value.ToString("dd/MM/yyyy") + "</td>";
                                            fila_tabla_bonificacion += "<td>" + pagoT.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                            //PREGUNTAMOS SI EL PAGO ES POR TENER EL 22.09 DE LA VALERA

                                            // decimal n2 = Math.Round(pagoT, 2);
                                            if (costGlobal != null)
                                            {
                                                var costValera = costGlobal.varValue;
                                                var costValeraNumber = decimal.Parse((string)costValera);
                                                detalle.PorcComision = Math.Round(pagoT, 2) == costValeraNumber ? 0 : detalle.PorcComision;
                                            }

                                            fila_tabla_bonificacion += "<td>" + (dia >= 31 ? PorcComisionAnterior.ToString("P", nfi) : detalle.PorcComision.ToString("P", nfi)) + "</td>";

                                            // COLUMNA DE BONIFICACION
                                            fila_tabla_bonificacion += "<td>" + (dia == 31 ? (PorcComisionAnterior * pagoCom).ToString("C", CultureInfo.CurrentCulture) : (detalle.PorcComision * pagoCom).ToString("C", CultureInfo.CurrentCulture)) + "</td>";
                                            var porPagar = dia == 31 ? pagoT - (PorcComisionAnterior * pagoCom) : pagoT - (detalle.PorcComision * pagoCom);
                                            porPagar = porPagar < 0 ? 0.1m : porPagar;
                                            fila_tabla_bonificacion += "<td>" + porPagar.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                            fila_tabla_bonificacion += "</tr>";


                                            fila_tabla_corresponsales += "<tr class=\"text-center\"font-size:13px\">";
                                            fila_tabla_corresponsales += "<td>" + detalle.FechaPago.Value.ToString("dd/MM/yyyy") + "</td>";
                                            foreach (var Corresponsal in Corresponsales.OrderBy(x => x.CorresponsalID))
                                            {
                                                var pagcom = dia >= 31 ? pagoT - PorcComisionAnterior * pagoCom : pagoT - detalle.PorcComision * pagoCom;

                                                var PagoCorresponsal = 0.0m;

                                                if (Corresponsal.TipoPorcentaje)
                                                {
                                                    try
                                                    {
                                                        PagoCorresponsal = pagcom + (pagcom * Corresponsal.Porcentaje.Value);
                                                    }
                                                    catch (Exception)
                                                    {
                                                        PagoCorresponsal = 0.0m;
                                                    }
                                                }
                                                else if (Corresponsal.TipoMontoFijo && Corresponsal.TipoMontoCorte)
                                                {
                                                    try
                                                    {
                                                        var quot = Math.Truncate(pagcom / Corresponsal.MontoCorte.Value);
                                                        var mod = pagcom % Corresponsal.MontoCorte.Value;
                                                        var corte = quot + (mod > 0 ? 1 : 0);

                                                        PagoCorresponsal = pagcom + (Corresponsal.MontoFijo.Value * corte);
                                                    }
                                                    catch (Exception)
                                                    {
                                                        PagoCorresponsal = 0.0m;
                                                    }
                                                }
                                                else if (Corresponsal.TipoMontoFijo && !Corresponsal.TipoMontoCorte)
                                                {
                                                    try
                                                    {
                                                        PagoCorresponsal = pagcom + Corresponsal.MontoFijo.Value;
                                                    }
                                                    catch (Exception)
                                                    {
                                                        PagoCorresponsal = 0.0m;
                                                    }
                                                }
                                                PagoCorresponsal = PagoCorresponsal < 0 ? 0.1m : PagoCorresponsal;
                                                fila_tabla_corresponsales += "<td>" + PagoCorresponsal.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                            }
                                            fila_tabla_corresponsales += "</tr>";
                                        }
                                        else
                                        {
                                            fila_tabla_bonificacion += "<tr class=\"text-center\"font-size:13px\">";
                                            fila_tabla_bonificacion += "<td>" + detalle.FechaPago.Value.ToString("dd/MM/yyyy") + "</td>";
                                            fila_tabla_bonificacion += "<td>" + pagoT.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                            //PREGUNTAMOS SI EL PAGO ES POR TENER EL 22.09 DE LA VALERA

                                            // decimal n2 = Math.Round(pagoT, 2);
                                            if (costGlobal != null)
                                            {
                                                var costValera = costGlobal.varValue;
                                                var costValeraNumber = decimal.Parse((string)costValera);
                                                detalle.PorcComision = Math.Round(pagoT, 2) == costValeraNumber ? 0 : detalle.PorcComision;
                                            }

                                            fila_tabla_bonificacion += "<td>" + detalle.PorcComision.ToString("P", nfi) + "</td>";
                                            // COLUMNA DE BONIFICACION
                                            fila_tabla_bonificacion += "<td>" + (detalle.PorcComision * pagoCom).ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                            var porPagar = pagoT - (detalle.PorcComision * pagoCom);
                                            porPagar = porPagar < 0 ? 0.1m : porPagar;
                                            fila_tabla_bonificacion += "<td>" + porPagar.ToString("C", CultureInfo.CurrentCulture) + "</td>";

                                            fila_tabla_corresponsales += "<tr class=\"text-center\">";
                                            fila_tabla_corresponsales += "<td>" + detalle.FechaPago.Value.ToString("dd/MM/yyyy") + "</td>";
                                            foreach (var Corresponsal in Corresponsales.OrderBy(x => x.CorresponsalID))
                                            {
                                                var pagcom = pagoT - detalle.PorcComision * pagoCom;

                                                var PagoCorresponsal = 0.0m;

                                                if (Corresponsal.TipoPorcentaje)
                                                {
                                                    try
                                                    {
                                                        PagoCorresponsal = pagcom + (pagcom * Corresponsal.Porcentaje.Value);
                                                    }
                                                    catch (Exception)
                                                    {
                                                        PagoCorresponsal = 0.0m;
                                                    }
                                                }
                                                else if (Corresponsal.TipoMontoFijo && Corresponsal.TipoMontoCorte)
                                                {
                                                    try
                                                    {
                                                        var quot = Math.Truncate(pagcom / Corresponsal.MontoCorte.Value);
                                                        var mod = pagcom % Corresponsal.MontoCorte.Value;
                                                        var corte = quot + (mod > 0 ? 1 : 0);

                                                        PagoCorresponsal = pagcom + (Corresponsal.MontoFijo.Value * corte);
                                                    }
                                                    catch (Exception)
                                                    {
                                                        PagoCorresponsal = 0.0m;
                                                    }
                                                }
                                                else if (Corresponsal.TipoMontoFijo && !Corresponsal.TipoMontoCorte)
                                                {
                                                    try
                                                    {
                                                        PagoCorresponsal = pagcom + Corresponsal.MontoFijo.Value;
                                                    }
                                                    catch (Exception)
                                                    {
                                                        PagoCorresponsal = 0.0m;
                                                    }
                                                }

                                                PagoCorresponsal = PagoCorresponsal < 0 ? 0.1m : PagoCorresponsal;
                                                fila_tabla_corresponsales += "<td>" + PagoCorresponsal.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                                            }
                                            fila_tabla_corresponsales += "</tr>";
                                        }

                                        PorcComisionAnterior = detalle.PorcComision;
                                        // PagComisionAnterior = detalle.pa
                                    }
                                    pagoCom -= baseComisionTienditaCorteActual;
                                    html = html.Replace("@@TABLA_BONIFICACION", fila_tabla_bonificacion);
                                    html = html.Replace("@@BASECOMISION", basecomisionCorte.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@PORCENTAJECOMISION", RelacionCorteTablaDiasFirst.PorcComision.ToString("P", nfi));
                                    decimal bonificacionSobreComision = RelacionCorteTablaDiasFirst.PorcComision * pagoCom;
                                    html = html.Replace("@@BONIFICACIONSOBRECOMISION", bonificacionSobreComision.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@TOTALTIENDITA", basecomisionTiendita.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@BONIFICACIONTIENDITA", bonificacionTiendita.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@SUBTOTAL", (pagoCom - bonificacionSobreComision + basecomisionTiendita - bonificacionTiendita).ToString("C", CultureInfo.CurrentCulture));

                                    html = html.Replace("@@COMPLEMENTOS", complementosCorte.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@PROTECCIONSALDO", proteccionCorte.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@COSTOVALERA", cobroValera.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@TOTALFALTANTE", cobroFaltante.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@PRESTAMOSPERSONALES", creditoPrestamoPersonal.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@CREDITOTIENDITA", creditoTienditaTotal.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@CREDITOCONFIAHOME", creditoPrestamoConfiaHome.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@CREDITOSOTROS", otros.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@SALDOFAVOR", saldoFavor.ToString("C", CultureInfo.CurrentCulture));
                                    decimal porPagarDesglose = totalCobranza - bonificacionSobreComision - bonificacionTiendita + proteccionCorte + cobroValera + cobroFaltante + creditoPrestamoPersonal + creditoTienditaTotal + creditoPrestamoConfiaHome + otros;
                                    porPagarDesglose = porPagarDesglose < 0 ? 0.1m : porPagarDesglose;
                                    html = html.Replace("@@TOTALACOBRAR", porPagarDesglose.ToString("C", CultureInfo.CurrentCulture));
                                    html = html.Replace("@@NOMBRETIENDITA", nombreTiendita);
                                    html = html.Replace("@@NOMBRECONFIAHOME", nombreConfiaHome);

                                    // INTERPOLACION METAS CAMPAÑA PON TU META EN ALTO (EN PAUSA DE MOMENTO)
                                    // html = html.Replace("@@METABAJA", 10.ToString());
                                    // html = html.Replace("@@METAMEDIA", 10.ToString());
                                    // html = html.Replace("@@METAALTA", 10.ToString());
                                    // html = html.Replace("@@METAACUMULADA", 10.ToString());
                                    html = html.Replace("@@IMAGENBANNER", IMAGENBANNER);
                                    html = html.Replace("@@estiloCampaniaCancun", estiloCampaniaCancun);
                                    html = html.Replace("@@datosImproductivas", datosImproductivos);
                                    html = html.Replace("@@datosCancun2025", datosCancun2025);


                                    html = html.Replace("@@ID_DIST", RelacionCorte.DistribuidorID.ToString());
                                    html = html.Replace("@@TABLA_CORRESPONDIENTE", fila_tabla_corresponsales);
                                    html = html.Replace("@@NOMBRE_DIST", RelacionCorte.NombreCompleto.ToUpper());
                                    html = html.Replace("@@CONTRATO_CIE", RelacionCorte.ContratoCIE);
                                    html = html.Replace("@@REF_BANCOMER", RelacionCorte.refBancomer);
                                    //Show
                                    html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                                    html = html.Replace("@@NOMBRE_DIST", RelacionCorte.NombreCompleto.ToUpper());
                                    html = html.Replace("@@REF_OXXO", RelacionCorte.refOxxo);

                                    html = html.Replace("@@CONTRATO_CIE", RelacionCorte.ContratoCIE);
                                    html = html.Replace("@@COLOR", colorDocumento);
                                    html = html.Replace("@@LOGO", logoname);

                                    var textoSpei = @"<h6 style=""text-align: center"">
                                    <strong> NO DISPONIBLE </strong>
                                    </h6>";
                                    if (RelacionCorte.refSPEI != null)
                                    {
                                        //GENERACION DE SPEI
                                        textoSpei = @"
                                    
                                    <h6>Si lo prefieres, puedes hacer tu pago por:</h6>
                                    <img
                                        style=""max-height: 120px; max-width: 120px""
                                        src=""https://" + HttpContext.Request.Host.Value + @"/pdf/image-012.jpg""
                                    />
                                    <h6>CLABE: <strong>" + RelacionCorte.refSPEI + @"</strong></h6>";
                                    }
                                    html = html.Replace("@@INTERPOLARSPEI", textoSpei);

                                    // Conekkkkta
                                    if (RelacionCorte.refOxxo != null)
                                    {
                                        var code = Funciones.Barcode(RelacionCorte.refOxxo, 200, 100);

                                        var image = string.Concat(prefijo_archivo, "refOxxo_", RelacionCorte.DistribuidorID.ToString(), ".png");

#pragma warning disable CA1416 // Validar la compatibilidad de la plataforma
                                        code.Save(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "ImageBarcode", image), ImageFormat.Png);
#pragma warning restore CA1416 // Validar la compatibilidad de la plataforma

                                        listado_imagenes.Add(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "ImageBarcode", image));

                                        html = html.Replace("@@REFOXXOCODE", image);
                                    }

                                    if (RelacionCorte.refSoriana != null)
                                    {
                                        var code = Funciones.Barcode(RelacionCorte.refSoriana, 600, 200);

                                        var image = string.Concat(prefijo_archivo, "refSoriana_", RelacionCorte.DistribuidorID.ToString(), ".png");

#pragma warning disable CA1416 // Validar la compatibilidad de la plataforma
                                        code.Save(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "ImageBarcode", image), ImageFormat.Png);
#pragma warning restore CA1416 // Validar la compatibilidad de la plataforma

                                        //Mostrar codigo de barras soriana
                                        listado_imagenes.Add(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "ImageBarcode", image));
                                        html = html.Replace("@@REF_SORIANA", image);
                                    }

                                    // Guardamos los archivos temporalmente
                                    await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "4_" + Count.ToString() + ".html")), html);
                                    listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "4_" + Count.ToString() + ".html")));
                                }
                            }
                        }
                        else
                        {

                            //GENERACION DE RECIBO
                            var recibos = "";

                            var rc = 0;
                            var rch2 = 0;
                            foreach (var RelacionCorte in RelacionCortes)
                            {
                                parData.DistribuidorID = RelacionCorte.DistribuidorID;
                                if (RelacionCorte != null)
                                {
                                    Count++;
                                    rch2 = 0;
                                    var RelacionCortesDetalle = await ConexionBD.database.FetchAsync<RelacionCortesDetalle2_VW>("WHERE DistribuidorID = @0 AND fechaCorte = CONVERT(DATETIME, @1, 103)", RelacionCorte.DistribuidorID, RelacionCorte.fechaCorte);

                                    foreach (var detalle in RelacionCortesDetalle.Where(x => x.DistribuidorID == RelacionCorte.DistribuidorID && x.saldoPlazo > 0.9m))
                                    {
                                        if (parData.formato == 1)
                                        {
                                            if (rc % 2 == 0)
                                            {
                                                switch (rch2)
                                                {
                                                    case 0:
                                                        if (rc == 0)
                                                        {
                                                            //Impresion de recibos 
                                                             recibos += "<div class=\"d-table d-table-third-class\" style=\"width: 100%; font-size:13px; \">";
                                                            recibos += "<div class=\"d-table-row\" style=\"width: 100%\">";
                                                            recibos += "<div class=\"d-table-cell\" style=\"width: 100%\">";
                                                            recibos += "&nbsp;";
                                                            recibos += "</div>";
                                                            recibos += "</div>";
                                                            recibos += "</div>";
                                                            // recibos += "<div class=\"d-table d-table-second-class\" style=\"width: 100%;font-size:15px;margin-bottom:2rem;\">";

                                                            // recibos += "<div class=\"d-table-row\" style=\"width: 100%\">";
                                                            // recibos += "<div class=\"d-table-cell\" style=\"width: 100%\">";
                                                            // recibos += "&nbsp;";
                                                            // recibos += "</div>";
                                                            // recibos += "</div>";
                                                            // recibos += "</div>";


                                                        }
                                                        else
                                                        {
                                                            // SEGUNDA VUELTA
                                                            recibos += "<div class=\"d-table d-table-third-class\" style=\"width: 100%;margin-bottom:5rem; font-size:13px;\">";
                                                            // recibos += "<div class=\"d-table d-table-third-class\" style=\"width: 100%; font-size:13px;margin-bottom:5rem;\">";
                                                            recibos += "<div class=\"d-table-row\" style=\"width: 100%\">";
                                                            recibos += "<div class=\"d-table-cell\" style=\"width: 100%\">";
                                                            recibos += "&nbsp;";
                                                            recibos += "</div>";
                                                            recibos += "</div>";
                                                            recibos += "</div>";

                                                        }
                                                        break;
                                                    case 2:
                                                    case 4:

                                                        recibos += "<div class=\"d-table d-table-third-class\" style=\"width: 100%;margin-bottom:7rem; font-size:13px;\">";
                                                        recibos += "<div class=\"d-table-row\" style=\"width: 100%\">";
                                                        recibos += "<div class=\"d-table-cell\" style=\"width: 100%\">";
                                                        recibos += "&nbsp;";
                                                        recibos += "</div>";
                                                        recibos += "</div>";
                                                        recibos += "</div>";

                                                        break;
                                                    default:
                                                        recibos += "";
                                                        break;
                                                }

                                                recibos += "<div class=\"d-table\" style=\"width:100%;font-size:13px;\">";
                                                recibos += "<div class=\"d-table-row\">";

                                            }

                                            //lLLENADO DE DATOS RECIBO (CASO 6 )                                          
                                            recibos += "<div class=\"d-table-cell d-table-first-class\" style=\"width:46%; height:9%; font-size:13px;\">";//TABLE CELL OPEN
                                             // recibos += "<div class=\"d-table d-table-second-class\" style=\"width:100%;\">";//TABLE OPEN                                          
                                            recibos += "<br>";
                                            recibos += "<div class=\"d-table d-table-second-class\" style=\"width:100%; position: relative;\">";//TABLE OPEN
                                             //Parametro TOP: -15; se declara negativo para recorrer la fecha hacia arriba y cuadre con el formato
                                            recibos += "<div class=\"d-table-row text-end\" style=\"position: absolute;top: -15; right: 0;\"><strong>" + detalle.fechaCorte + "</strong></div>";

                                            recibos += "<br><br><br>";

                                            recibos += "<br><br>";

                                            recibos += "<div class=\"d-table-row\">";
                                            recibos += "<div class=\"d-table-cell\">";
                                            recibos += "<div class=\"text-center\" style=\"font-weight:bold;\" >" + HttpUtility.HtmlEncode(RelacionCorte.NombreCompleto) + "</div>";
                                            recibos += "<br><br><br>";
                                            recibos += "</div>";
                                            recibos += "</div>";


                                            recibos += "<div class=\"d-table-row\">";
                                            recibos += "<div class=\"d-table-cell\">";
                                            recibos += "<div class=\"text-center\" style=\"font-weight:bold;\">CLIENTE: " + detalle.ClienteID.ToString() + " - " + HttpUtility.HtmlEncode(detalle.Cliente) + "</div>";
                                            recibos += "<br><br>";
                                            recibos += "</div>";
                                            recibos += "</div>";

                                            recibos += "<table style=\"width:100%;font-size:13px;\" style=\"font-weight:bold;\">";
                                            recibos += "<thead>";
                                            recibos += "<th></th><th></th><th></th><th></th>";
                                            recibos += "</thead>";

                                            recibos += "<tbody>";
                                            recibos += "<tr><td colspan=\"1\"><strong>NUM. DE VALE:</strong></td>";
                                            recibos += "<td colspan=\"1\" style=\"font-weight:bold;\">" + (detalle.ValeCanje != null ? detalle.ValeCanje.Value.ToString() : "NA") + "</td>";
                                            recibos += "<td colspan=\"1\"><strong>SALDO ANTERIOR:</strong></td>";
                                            recibos += "<td colspan=\"1\" class=\"text-end\" style=\"font-weight:bold;\" >" + detalle.saldoCredito.Value.ToString("C", CultureInfo.CurrentCulture) + "</td></tr>"; //SALDO ANTERIOR
                                            recibos += "<tr><td><strong>CR&Eacute;DITO:</strong></td>";
                                            recibos += "<td style=\"font-weight:bold;\" >" + detalle.CreditoID.ToString().Trim() + "</td>";
                                            recibos += "<td><strong>ATRASADO:</strong></td>";
                                            recibos += "<td class=\"text-end\"style=\"font-weight:bold;\" >" + detalle.saldoAtrasado.Value.ToString("C", CultureInfo.CurrentCulture) + "</td></tr>";
                                            recibos += "<tr><td><strong>PLAZO:</strong></td>";
                                            recibos += "<td style=\"font-weight:bold;\" >" + detalle.PagoPlazo + "</td>";  //PLAZOS
                                            recibos += "<td><strong>PAGO:</strong></td>";
                                            recibos += "<td class=\"text-end\" style=\"font-weight:bold;\">" + detalle.saldoPlazo.Value.ToString("C", CultureInfo.CurrentCulture) + "</td></tr>";
                                            recibos += "<tr><td><strong>FECHA LIMITE DE PAGO:</strong></td>";
                                            recibos += "<td style=\"font-weight:bold;\" >" + detalle.FechaVencimiento.Value.AddDays(-5).ToString("dd/MM/yyyy") + "</td>"; //FECHA LIMITE DE PAGO
                                            recibos += "<td><strong>SALDO NUEVO:</strong></td>";
                                            recibos += "<td class=\"text-end\" style=\"font-weight:bold;\">" + detalle.SldDspPago.Value.ToString("C", CultureInfo.CurrentCulture) + " </td></tr>";
                                            recibos += "</tbody></table>";

                                            recibos += "</div>";//TABLE CLOSE
                                            recibos += "</div>";//TABLE CELL CLOSE

                                            rch2++;
                                            rc++;

                                            //FORMATO DE IMPRESIN DE HOJA DE 6
                                            if (rc % 2 == 0)
                                            {

                                                recibos += "</div>";
                                                recibos += "</div>";
                                                if (rch2 >= 5)
                                                {
                                                    rch2 = 0;
                                                }
                                            }
                                            else
                                            {
                                                recibos += "<div class=\"d-table-cell d-table-first-class\" style=\"width:8%;\">";
                                                recibos += "</div>";

                                            }
                                        }
                                        else
                                        {
                                            //EN CASO DE SER EL FORMATO DE 8 EN HOJA
                                            switch (rch2)
                                            {
                                                case 0:
                                                case 2:
                                                    //PRIMER BLOQUE DE 4
                                                    recibos += "<div class=\"d-table d-table-second-class\" style=\"width: 100%;font-size:13px; margin-bottom:1rem;\">";
                                                    recibos += "<div class=\"d-table-row\" style=\"width: 100%\">";
                                                    recibos += "<div class=\"d-table-cell\" style=\"width: 100%\">";
                                                    recibos += "&nbsp;";
                                                    recibos += "</div>";
                                                    recibos += "</div>";
                                                    recibos += "</div>";
                                                    break;
                                                case 4:
                                                case 6:
                                                    //SEGUNDO BLOQUE DE 4
                                                    //Se añade margi-bottom:rem; para poder bajar el segundo bloque de 4 
                                                    recibos += "<div class=\"d-table d-table-first-class\" style=\"width: 100%;font-size:13px; margin-bottom:2rem;\">";
                                                    recibos += "<div class=\"d-table-row\" style=\"width: 100%\">";
                                                    recibos += "<div class=\"d-table-cell\" style=\"width: 100%\">";
                                                    recibos += "&nbsp;";
                                                    recibos += "</div>";
                                                    recibos += "</div>";
                                                    recibos += "</div>";
                                                    break;
                                                default:
                                                    recibos += "";
                                                    break;
                                            }
                                            if (rc % 2 == 0)
                                            {
                                                recibos += "<div class=\"d-table\" style=\"width: 100%;font-size:13px;\">";
                                                recibos += "<div class=\"d-table-row\" style=\"width: 100%;font-size:13px;\">";
                                            }

                                            recibos += "<div class=\"d-table-cell w-block\" style=\"width: 40%\">";
                                            recibos += "<div class=\"text-end\">";

                                            recibos += "<h2><strong>" + detalle.fechaCorte + "</strong></h2>";
                                            recibos += "</div>";
                                            recibos += "<div>";
                                            recibos += "<h1>&nbsp;</h1>";
                                            recibos += "</div>";
                                            recibos += "<table style=\"width:100%;font-size:13px;\">";
                                            recibos += "<thead>";
                                            recibos += "<th></th><th></th><th></th><th></th>";
                                            recibos += "</thead>";
                                            recibos += "<tbody>";
                                            recibos += "<tr style=\"font-size:16px;\"><td colspan=\"4\"><strong> " + HttpUtility.HtmlEncode(RelacionCorte.NombreCompleto) + "</strong></td></tr>";
                                            recibos += "<tr style=\"font-size:13px;\"><td colspan=\"1\"><strong>CLIENTE:</strong></td>";
                                            recibos += "<td colspan=\"3\" style=\"font-size:12px;\"><strong> " + detalle.ClienteID.ToString() + " - " + HttpUtility.HtmlEncode(detalle.Cliente) + "</strong></td></tr>";
                                            recibos += "<tr><td colspan=\"1\"><strong>NUM. DE VALE:</strong></td>";
                                            recibos += "<td colspan=\"1\" style=\"font-weight:bold;\">" + (detalle.ValeCanje != null ? detalle.ValeCanje.Value.ToString() : "NA") + "</td>";
                                            recibos += "<td colspan=\"1\"><strong>SALDO ANTERIOR:</strong></td>";
                                            recibos += "<td colspan=\"1\" class=\"text-end\" style=\"font-weight:bold;\">" + detalle.saldoCredito.Value.ToString("C", CultureInfo.CurrentCulture) + "</td></tr>";
                                            recibos += "<tr><td><strong>CR&Eacute;DITO:</strong></td>";
                                            recibos += "<td style=\"font-weight:bold;\">" + detalle.CreditoID.ToString().Trim() + "</td>";
                                            recibos += "<td><strong>ATRASADO:</strong></td>";
                                            recibos += "<td class=\"text-end\"style=\"font-weight:bold;\" >" + detalle.saldoAtrasado.Value.ToString("C", CultureInfo.CurrentCulture) + "</td></tr>";
                                            recibos += "<tr><td><strong>PLAZO:</strong></td>";
                                            recibos += "<td style=\"font-weight:bold;\">" + detalle.PagoPlazo + "</td>";
                                            recibos += "<td><strong>PAGO:</strong></td>";
                                            recibos += "<td class=\"text-end\" style=\"font-weight:bold;\">" + detalle.saldoPlazo.Value.ToString("C", CultureInfo.CurrentCulture) + "</td></tr>";
                                            recibos += "<tr><td><strong>FECHA LIMITE DE PAGO:</strong></td>";
                                            recibos += "<td style=\"font-weight:bold;\">" + detalle.FechaVencimiento.Value.AddDays(-5).ToString("dd/MM/yyyy") + "</td>";
                                            recibos += "<td><strong>SALDO NUEVO:</strong></td>";
                                            recibos += "<td class=\"text-end\" style=\"font-weight:bold;\">" + detalle.SldDspPago.Value.ToString("C", CultureInfo.CurrentCulture) + " </td></tr>";
                                            recibos += "</tbody></table>";
                                            recibos += "</div>";

                                            rc++;
                                            rch2++;
                                            if (rc % 2 == 0)
                                            {
                                                recibos += "</div>";
                                                recibos += "</div>";
                                                recibos += "<div class=\"d-table d-table-third-class\" style=\"width: 100%;font-size:13px;\">";
                                                recibos += "<div class=\"d-table-row\" style=\"width: 100%\">";
                                                recibos += "<div class=\"d-table-cell\" style=\"width: 100%\">";
                                                recibos += "&nbsp;";
                                                recibos += "</div>";
                                                recibos += "</div>";
                                                recibos += "</div>";

                                                //FORMATO DE IMPRESION DE 8 
                                                if (rch2 >= 5)
                                                {
                                                    rch2 = 0;
                                                }
                                            }
                                            else
                                            //Salto de linea(?)
                                            {

                                                recibos += "<div class=\"d-table-cell w-block p-2\" style=\"width: 10%;font-size:13px;\">";
                                                recibos += "&nbsp;";
                                                recibos += "</div>";
                                            }
                                        }
                                    }
                                }
                            }

                            if (rc % 2 != 0)
                            {
                                if (parData.formato == 1)
                                {
                                    recibos += "<div class=\"d-table-cell d-table-first-class\" style=\"width:46%; height:100%;\">";
                                    recibos += "</div>";
                                }
                                else
                                {
                                    recibos += "<div class=\"d-table-cell w-block\" style=\"width: 40%\">";
                                    recibos += "</div>";

                                    recibos += "</br>";
                                }
                                recibos += "</div>";
                            }

                            ////path = Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Relacion", "Pagina1", "Pagina1.html");
                            var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Relacion", "Recibo_" + parData.formato.ToString() + ".html"));
                            html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                            html = html.Replace("@@RECIBOS", recibos);
                            html = html.Replace("@@LOGO", logoname);

                            //// Guardamos los archivos temporalmente
                            ///_" + Count.ToString() + "
                            await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1.html")), html);

                            listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1.html")));
                        }

                        if (Count > 0)
                        {
                            // Ejecutamos el proceso de wkhtmltopdf
                            Process p = new()
                            {
                                StartInfo = new ProcessStartInfo(PDF.RUTA_WKHTMLTOPDF())
                            };
                            p.StartInfo.Arguments = string.Concat("", string.Join(" ", listado_archivos), " ", Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
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

                            await ConexionBD.Destroy();

                            // Enviamos el PDF a la UI
                            return new FileStreamResult(pdfStream, "application/pdf");
                        }
                        else
                        {
                            await ConexionBD.Destroy();
                            throw new Exception("No se encontro información");
                        }
                    }
                }
                else
                {
                    throw new Exception("RELACIONES BLOQUEADAS");
                }
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(new
                {
                    message = ex.Message,
                    error = ex.StackTrace
                });
            }

        }

        //[HttpPost]
        //[Route("pdf")]
        //[Authorize]
        //[KeycloakSecurityAttributes(new string[] { "CREDITOS" })]
        //public async Task<IActionResult> Pdf(PeticionesRest.Cortes.Relacion.Get parData)
        //{
        //    try
        //    {

        //        var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");

        //        string dest = Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf"));

        //        //MemoryStream ms = new();

        //        PdfWriter pw = new(dest);

        //        PdfDocument pdfDocument = new(pw);

        //        Document doc = new(pdfDocument, PageSize.LETTER);

        //        doc.SetMargins(35, 40, 35, 40);

        //        var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
        //        var UsuarioActual = await DBContext.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
        //        var PersonaActual = await DBContext.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.ID).FirstOrDefaultAsync();

        //        var Producto = await DBContext.database.SingleByIdAsync<Productos>(parData.ProductoID);

        //        var RelacionCortes = await DBContext.database.QueryAsync<RelacionCortes_VW>("WHERE (SucursalID = @SucursalID) AND (DistribuidorID = @DistribuidorID) AND (fechaCorte = CONVERT(DATETIME, @fecha, 103))", parData).FirstOrDefaultAsync();

        //        //var RelacionCortesDetalle = await DBContext.database.FetchAsync<RelacionCortesDetalle_VW>("WHERE (SucursalID = @SucursalID) AND DistribuidorID = @DistribuidorID", parData);

        //        var RelacionCortesDetalle = await DBContext.database.FetchAsync<RelacionCortesDetalle_VW>("WHERE (SucursalID = @SucursalID) AND (DistribuidorID = @DistribuidorID) AND (fechaCorte = CONVERT(DATETIME, @fecha, 103))", parData);

        //        var logo = Producto.Logo;

        //        //LogImpresionDocumentos LogImpresion;

        //        //LogImpresion = new LogImpresionDocumentos() { UsuarioId = UsuarioActual.ID, PersonaId = PersonaActual.PersonaID, Fecha = DateTime.Now, CreditoID = 0, TipoDocumentoId = 1 };

        //        //await DBContext.database.InsertAsync(LogImpresion);

        //        GenerarArchivo(ref doc, RelacionCortes, RelacionCortesDetalle, logo, PersonaActual);

        //        //if (RelacionCortes.FormatoImpresionExtra == true)
        //        //{

        //        //    switch (RelacionCortes.TipoMovimientoID)
        //        //    {
        //        //        case 3:
        //        //            var Movimiento = await DBContext.database.QueryAsync<Movimientos_VW>("WHERE MovimientoID = @MovimientoID", RelacionCortes).FirstOrDefaultAsync();

        //        //            LogImpresion = new LogImpresionDocumentos() { UsuarioId = UsuarioActual.ID, PersonaId = PersonaActual.PersonaID, Fecha = DateTime.Now, CreditoID = RelacionCortes.CreditoID, TipoDocumentoId = 3 };

        //        //            await DBContext.database.InsertAsync(LogImpresion);

        //        //            PdfPage pdfPage = pdfDocument.AddNewPage();

        //        //            PdfCanvas canvas = new(pdfPage);

        //        //            canvas.Rectangle(30, 40, 550, 720);

        //        //            canvas.Stroke();

        //        //            //MOVCTA(ref doc, Movimiento, LogImpresion, PersonaActual);

        //        //            break;
        //        //        case 13:
        //        //            Console.WriteLine("SPEI");
        //        //            break;
        //        //        case 14:
        //        //            LogImpresion = new LogImpresionDocumentos() { UsuarioId = UsuarioActual.ID, PersonaId = PersonaActual.PersonaID, Fecha = DateTime.Now, CreditoID = RelacionCortes.CreditoID, TipoDocumentoId = 2 };

        //        //            await DBContext.database.InsertAsync(LogImpresion);

        //        //            //ODP(ref doc, Credito);
        //        //            break;
        //        //        default:
        //        //            break;
        //        //    }
        //        //}

        //        //var otro = true;

        //        doc.Close();

        //        Process p2 = new()
        //        {
        //            StartInfo = new ProcessStartInfo("java")
        //        };
        //        p2.StartInfo.Arguments = string.Concat(
        //            "-jar ",
        //            PDF.RUTA_JSIGNPDF, " ",
        //            Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")), " ",
        //            "-ksf ", Path.Combine(PDF.RUTA_BASE, "keystore", "confia.pdf.keystore"), " ",
        //            "-ksp Mexico2021 ",
        //            "-ka confia_pdf ",
        //            "-ksp Mexico2021 ",
        //            "-d ", PDF.RUTA_BASE, " ",
        //            "-r 'Validación de documentos' ",
        //            "-l 'Torreon Coahuila' ",
        //            "-c 'Detalle de contacto' ",
        //            "-cl CERTIFIED_NO_CHANGES_ALLOWED ",
        //            "-ha SHA512 ",
        //            "-pg 1 ",
        //            "-llx 35.0 ",
        //            "-lly 830.0 ",
        //            "-urx 345 ",
        //            "-ury 762 ",
        //            "--render-mode DESCRIPTION_ONLY ",
        //            "-fs 8.0 ",
        //            "-V ",
        //            "-q"
        //        );
        //        p2.StartInfo.CreateNoWindow = true;
        //        p2.Start();
        //        await p2.WaitForExitAsync();

        //        // Obtenemos el contenido de nuestro archivo de PDF
        //        //var pdf = await System.IO.File.ReadAllBytesAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
        //        var pdf = await System.IO.File.ReadAllBytesAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF_signed.pdf")));

        //        // Obtenemos nuestro PDF
        //        var pdfStream = new MemoryStream();
        //        pdfStream.Write(pdf, 0, pdf.Length);
        //        pdfStream.Position = 0;

        //        System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
        //        System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF_signed.pdf")));

        //        //byte[] byteStream = ms.ToArray();
        //        //ms = new MemoryStream();
        //        //ms.Write(byteStream, 0, byteStream.Length);
        //        //ms.Position = 0;

        //        return File(pdfStream, "application/pdf");

        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}

        //private void GenerarArchivo(ref Document doc, RelacionCortes_VW RelacionCortes, List<RelacionCortesDetalle_VW> RelacionCortesDetalle, byte[] Logo, PersonasUsuarios_VW PersonaActual)
        //{
        //    LineSeparator ls = new(new SolidLine());

        //    //ls.SetMarginLeft(100);

        //    //ls.SetMarginRight(100);

        //    LineSeparator lfl = new(new SolidLine());

        //    lfl.SetMarginLeft(255);

        //    //lfl.SetMarginRight(150);

        //    LineSeparator dl = new(new DashedLine());

        //    SolidLine line = new(1f);
        //    line.SetColor(ColorConstants.LIGHT_GRAY);

        //    LineSeparator sl = new(line);

        //    Paragraph salto2 = new(new Text("\n"));

        //    Paragraph salto3 = new(new Text("\n\n\n"));

        //    Paragraph salto4 = new(new Text("\n\n\n\n"));

        //    //PdfPage pdfPage = pdfDocument.AddNewPage();

        //    //PdfCanvas canvas = new(pdfPage);

        //    //canvas.MoveTo(150, 200);

        //    //canvas.LineTo(450, 200);

        //    //canvas.ClosePathStroke();

        //    //var imageFile = System.IO.Path.Combine(_env.ContentRootPath, "wwwroot/Sources", "logoVale.png");

        //    Paragraph date = new Paragraph("EMISION: " + PersonaActual.NombreCompleto.ToUpper() + " " + DateTime.Now.ToString("yyyy/MM/dd hh:mm:ss"))
        //       .SetTextAlignment(TextAlignment.RIGHT)
        //       .SetFontSize(7);

        //    ImageData data = ImageDataFactory.Create(Logo);

        //    Image img = new(data);

        //    img.SetHeight(60);

        //    Table tabletitle = new(new float[] { 175, 375 });

        //    Text titletext1 = new Text("RELACIÓN DE COBRANZA")
        //        .SetFontSize(17);

        //    Text titletext2 = new Text("Nombre de socia")
        //        .SetFontSize(10);

        //    Paragraph title = new();

        //    title.Add(titletext1);
        //    title.Add("\n");
        //    title.Add(titletext2);

        //    Cell c1 = new();
        //    c1.Add(img.SetAutoScale(true));
        //    c1.SetBorder(Border.NO_BORDER);
        //    c1.SetTextAlignment(TextAlignment.CENTER);
        //    c1.SetVerticalAlignment(VerticalAlignment.MIDDLE);

        //    Cell c2 = new();
        //    c2.Add(title);
        //    c2.SetBackgroundColor(ColorConstants.WHITE);
        //    c2.SetBorder(Border.NO_BORDER);
        //    c2.SetTextAlignment(TextAlignment.CENTER);
        //    c2.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    c2.SetBold();

        //    Cell c3 = new();
        //    c3.Add(new Paragraph("\"Donde más ganas\""));
        //    c3.SetBorder(Border.NO_BORDER);
        //    c3.SetTextAlignment(TextAlignment.CENTER);
        //    c3.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    c3.SetBold();
        //    c3.SetFontSize(14);

        //    Cell c4 = new();
        //    c4.Add(new Paragraph(RelacionCortes.DistribuidorID.ToString() + " - " +RelacionCortes.NombreCompleto.ToUpper()));
        //    c4.SetNextRenderer(new RoundedBorderCellRenderer(c4));
        //    c4.SetBorder(Border.NO_BORDER);
        //    c4.SetTextAlignment(TextAlignment.CENTER);
        //    c4.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    c4.SetBold();
        //    //c4.SetFontSize(14);

        //    tabletitle.AddCell(c1);
        //    tabletitle.AddCell(c2);
        //    tabletitle.AddCell(c3);
        //    tabletitle.AddCell(c4);

        //    //PdfFont font = PdfFontFactory.CreateFont(FontConstants.HELVETICA);

        //    Table tableHead1 = new(new float[] { 180F, 180F, 15F, 175F });

        //    Table table1 = new(new float[] { 500 });

        //    Cell c5 = new();
        //    c5.Add(new Paragraph("Teléfono"));
        //    //c5.SetBackgroundColor(ColorConstants.GREEN);
        //    c5.SetNextRenderer(new RoundedBorderCellRenderer(c5));
        //    c5.SetBorder(Border.NO_BORDER);
        //    c5.SetTextAlignment(TextAlignment.CENTER);
        //    c5.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    c5.SetBold();

        //    Cell c6 = new();
        //    c6.Add(new Paragraph(RelacionCortes.TelefonoMovil));
        //    c6.SetNextRenderer(new RoundedBorderCellRenderer(c6));
        //    c6.SetBorder(Border.NO_BORDER);
        //    c6.SetTextAlignment(TextAlignment.CENTER);
        //    c6.SetVerticalAlignment(VerticalAlignment.MIDDLE);

        //    table1.AddCell(c5);
        //    table1.AddCell(c6);


        //    Table table2 = new(new float[] { 500 });

        //    Cell c7 = new();
        //    c7.Add(new Paragraph("Fecha de Corte"));
        //    //c7.SetBackgroundColor(ColorConstants.GREEN);
        //    c7.SetNextRenderer(new RoundedBorderCellRenderer(c7));
        //    c7.SetBorder(Border.NO_BORDER);
        //    c7.SetTextAlignment(TextAlignment.CENTER);
        //    c7.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    c7.SetBold();

        //    Cell c8 = new();
        //    c8.Add(new Paragraph(RelacionCortes.fechaCorte.ToString("dd/MM/yyyy")));
        //    c8.SetNextRenderer(new RoundedBorderCellRenderer(c8));
        //    c8.SetBorder(Border.NO_BORDER);
        //    c8.SetTextAlignment(TextAlignment.CENTER);
        //    c8.SetVerticalAlignment(VerticalAlignment.MIDDLE);

        //    table2.AddCell(c7);
        //    table2.AddCell(c8);

        //    Table table3 = new(new float[] { 250, 250 });

        //    Cell c9 = new(1, 2);
        //    c9.Add(new Paragraph("Monedero Electronico:"));
        //    //c7.SetBackgroundColor(ColorConstants.GREEN);
        //    c9.SetNextRenderer(new RoundedBorderCellRenderer(c9));
        //    c9.SetBorder(Border.NO_BORDER);
        //    c9.SetTextAlignment(TextAlignment.CENTER);
        //    c9.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    c9.SetBold();

        //    Cell c10 = new();
        //    c10.Add(new Paragraph("Acumulado:"));
        //    c10.SetNextRenderer(new RoundedBorderCellRenderer(c10));
        //    c10.SetBorder(Border.NO_BORDER);
        //    c10.SetTextAlignment(TextAlignment.CENTER);
        //    c10.SetVerticalAlignment(VerticalAlignment.MIDDLE);

        //    Cell c11 = new();
        //    c11.Add(new Paragraph("0.00"));
        //    c11.SetNextRenderer(new RoundedBorderCellRenderer(c11));
        //    c11.SetBorder(Border.NO_BORDER);
        //    c11.SetTextAlignment(TextAlignment.CENTER);
        //    c11.SetVerticalAlignment(VerticalAlignment.MIDDLE);

        //    table3.AddCell(c9);
        //    table3.AddCell(c10);
        //    table3.AddCell(c11);

        //    tableHead1.AddCell(new Cell().Add(table1).SetBorder(Border.NO_BORDER));
        //    tableHead1.AddCell(new Cell().Add(table2).SetBorder(Border.NO_BORDER));
        //    tableHead1.AddCell(new Cell().SetBorder(Border.NO_BORDER));
        //    tableHead1.AddCell(new Cell().Add(table3).SetBorder(Border.NO_BORDER));


        //    Table tableHead2 = new(new float[] { 360F, 15F, 170F });

        //    Table table4 = new(new float[] { 75F, 75F, 75F, 70F, 70F });

        //    Cell c12 = new(1, 5);
        //    c12.Add(new Paragraph("Información Línea de Crédito"));
        //    //c7.SetBackgroundColor(ColorConstants.GREEN);
        //    c12.SetNextRenderer(new RoundedBorderCellRenderer(c12));
        //    c12.SetBorder(Border.NO_BORDER);
        //    c12.SetTextAlignment(TextAlignment.CENTER);
        //    c12.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    c12.SetBold();

        //    Cell c13 = new();
        //    c13.Add(new Paragraph("Límite"));
        //    c13.SetNextRenderer(new RoundedBorderCellRenderer(c13));
        //    c13.SetBorder(Border.NO_BORDER);
        //    c13.SetTextAlignment(TextAlignment.CENTER);
        //    c13.SetVerticalAlignment(VerticalAlignment.MIDDLE);

        //    Cell c14 = new();
        //    c14.Add(new Paragraph("Colocado"));
        //    c14.SetNextRenderer(new RoundedBorderCellRenderer(c14));
        //    c14.SetBorder(Border.NO_BORDER);
        //    c14.SetTextAlignment(TextAlignment.CENTER);
        //    c14.SetVerticalAlignment(VerticalAlignment.MIDDLE);

        //    Cell c15 = new();
        //    c15.Add(new Paragraph("Disponible"));
        //    c15.SetNextRenderer(new RoundedBorderCellRenderer(c15));
        //    c15.SetBorder(Border.NO_BORDER);
        //    c15.SetTextAlignment(TextAlignment.CENTER);
        //    c15.SetVerticalAlignment(VerticalAlignment.MIDDLE);

        //    Cell c16 = new();
        //    c16.Add(new Paragraph("Nivel"));
        //    c16.SetNextRenderer(new RoundedBorderCellRenderer(c16));
        //    c16.SetBorder(Border.NO_BORDER);
        //    c16.SetTextAlignment(TextAlignment.CENTER);
        //    c16.SetVerticalAlignment(VerticalAlignment.MIDDLE);

        //    Cell c17 = new();
        //    c17.Add(new Paragraph("Puntos"));
        //    c17.SetNextRenderer(new RoundedBorderCellRenderer(c17));
        //    c17.SetBorder(Border.NO_BORDER);
        //    c17.SetTextAlignment(TextAlignment.CENTER);
        //    c17.SetVerticalAlignment(VerticalAlignment.MIDDLE);

        //    Cell c18 = new();
        //    c18.Add(new Paragraph(RelacionCortes.LineaCredito.Value.ToString("C", CultureInfo.CurrentCulture)));
        //    c18.SetNextRenderer(new RoundedBorderCellRenderer(c18));
        //    c18.SetBorder(Border.NO_BORDER);
        //    c18.SetTextAlignment(TextAlignment.CENTER);
        //    c18.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    c18.SetFontSize(12);

        //    Cell c19 = new();
        //    c19.Add(new Paragraph(RelacionCortes.LineaCredito.Value.ToString("C", CultureInfo.CurrentCulture)));
        //    c19.SetNextRenderer(new RoundedBorderCellRenderer(c19));
        //    c19.SetBorder(Border.NO_BORDER);
        //    c19.SetTextAlignment(TextAlignment.CENTER);
        //    c19.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    c19.SetFontSize(12);

        //    Cell c20 = new();
        //    c20.Add(new Paragraph(RelacionCortes.CapitalPlazo.Value.ToString("C", CultureInfo.CurrentCulture)));
        //    c20.SetNextRenderer(new RoundedBorderCellRenderer(c20));
        //    c20.SetBorder(Border.NO_BORDER);
        //    c20.SetTextAlignment(TextAlignment.CENTER);
        //    c20.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    c20.SetFontSize(12);

        //    Cell c21 = new();
        //    c21.Add(new Paragraph(RelacionCortes.DistribuidorNivel));
        //    c21.SetNextRenderer(new RoundedBorderCellRenderer(c21));
        //    c21.SetBorder(Border.NO_BORDER);
        //    c21.SetTextAlignment(TextAlignment.CENTER);
        //    c21.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    c21.SetFontSize(12);

        //    Cell c22 = new();
        //    c22.Add(new Paragraph("0"));
        //    c22.SetNextRenderer(new RoundedBorderCellRenderer(c22));
        //    c22.SetBorder(Border.NO_BORDER);
        //    c22.SetTextAlignment(TextAlignment.CENTER);
        //    c22.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    c22.SetFontSize(12);

        //    table4.AddCell(c12);
        //    table4.AddCell(c13);
        //    table4.AddCell(c14);
        //    table4.AddCell(c15);
        //    table4.AddCell(c16);
        //    table4.AddCell(c17);
        //    table4.AddCell(c18);
        //    table4.AddCell(c19);
        //    table4.AddCell(c20);
        //    table4.AddCell(c21);
        //    table4.AddCell(c22);

        //    Table table5 = new(new float[] { 250, 250 });

        //    Cell c23 = new(1, 2);
        //    c23.Add(new Paragraph("Prestamo Personal"));
        //    //c7.SetBackgroundColor(ColorConstants.GREEN);
        //    c23.SetNextRenderer(new RoundedBorderCellRenderer(c23));
        //    c23.SetBorder(Border.NO_BORDER);
        //    c23.SetTextAlignment(TextAlignment.CENTER);
        //    c23.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    c23.SetBold();

        //    Cell c24 = new();
        //    c24.Add(new Paragraph("Monto"));
        //    c24.SetNextRenderer(new RoundedBorderCellRenderer(c24));
        //    c24.SetBorder(Border.NO_BORDER);
        //    c24.SetTextAlignment(TextAlignment.CENTER);
        //    c24.SetVerticalAlignment(VerticalAlignment.MIDDLE);

        //    Cell c25 = new();
        //    c25.Add(new Paragraph("Saldo"));
        //    c25.SetNextRenderer(new RoundedBorderCellRenderer(c25));
        //    c25.SetBorder(Border.NO_BORDER);
        //    c25.SetTextAlignment(TextAlignment.CENTER);
        //    c25.SetVerticalAlignment(VerticalAlignment.MIDDLE);

        //    Cell c26 = new();
        //    c26.Add(new Paragraph("50.00"));
        //    c26.SetNextRenderer(new RoundedBorderCellRenderer(c26));
        //    c26.SetBorder(Border.NO_BORDER);
        //    c26.SetTextAlignment(TextAlignment.CENTER);
        //    c26.SetVerticalAlignment(VerticalAlignment.MIDDLE);

        //    Cell c27 = new();
        //    c27.Add(new Paragraph("0.00"));
        //    c27.SetNextRenderer(new RoundedBorderCellRenderer(c27));
        //    c27.SetBorder(Border.NO_BORDER);
        //    c27.SetTextAlignment(TextAlignment.CENTER);
        //    c27.SetVerticalAlignment(VerticalAlignment.MIDDLE);

        //    table5.AddCell(c23);
        //    table5.AddCell(c24);
        //    table5.AddCell(c25);
        //    table5.AddCell(c26);
        //    table5.AddCell(c27);

        //    tableHead2.AddCell(new Cell().Add(table4).SetBorder(Border.NO_BORDER));
        //    tableHead2.AddCell(new Cell().SetBorder(Border.NO_BORDER));
        //    tableHead2.AddCell(new Cell().Add(table5).SetBorder(Border.NO_BORDER));


        //    Table tableHead3 = new(new float[] { 550F });

        //    Table tableSubHead1 = new(new float[] { 300F, 225F, 25F });

        //    Table table6 = new(new float[] { 50F, 50F, 50F, 50F, 100F });

        //    Table table7 = new(new float[] { 50F, 50F, 25F, 50F, 50F });

        //    Table table8 = new(new float[] { 25F });

        //    Cell c28 = new();
        //    c28.Add(new Paragraph("Fecha Canje"));
        //    c28.SetBackgroundColor(ColorConstants.WHITE);
        //    c28.SetBorder(Border.NO_BORDER);
        //    c28.SetTextAlignment(TextAlignment.CENTER);
        //    c28.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    c28.SetFontSize(7);
        //    //c28.SetBold();

        //    Cell c29 = new();
        //    c29.Add(new Paragraph("Sucursal"));
        //    c29.SetBackgroundColor(ColorConstants.WHITE);
        //    c29.SetBorder(Border.NO_BORDER);
        //    c29.SetTextAlignment(TextAlignment.CENTER);
        //    c29.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    c29.SetFontSize(7);
        //    //c2.SetBold();

        //    Cell c30 = new();
        //    c30.Add(new Paragraph("Crédito"));
        //    c30.SetBackgroundColor(ColorConstants.WHITE);
        //    c30.SetBorder(Border.NO_BORDER);
        //    c30.SetTextAlignment(TextAlignment.CENTER);
        //    c30.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    c30.SetFontSize(7);
        //    //c3.SetBold();

        //    Cell c31 = new();
        //    c31.Add(new Paragraph("Folio Vale"));
        //    c31.SetBackgroundColor(ColorConstants.WHITE);
        //    c31.SetBorder(Border.NO_BORDER);
        //    c31.SetTextAlignment(TextAlignment.CENTER);
        //    c31.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    c31.SetFontSize(7);
        //    //c4.SetBold();

        //    Cell c32 = new();
        //    c32.Add(new Paragraph("Cliente"));
        //    c32.SetBackgroundColor(ColorConstants.WHITE);
        //    c32.SetBorder(Border.NO_BORDER);
        //    c32.SetTextAlignment(TextAlignment.CENTER);
        //    c32.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    c32.SetFontSize(7);
        //    //c5.SetBold();

        //    Cell c33 = new();
        //    c33.Add(new Paragraph("Importe"));
        //    c33.SetBackgroundColor(ColorConstants.WHITE);
        //    c33.SetBorder(Border.NO_BORDER);
        //    c33.SetTextAlignment(TextAlignment.CENTER);
        //    c33.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    c33.SetFontSize(7);

        //    Cell c34 = new();
        //    c34.Add(new Paragraph("Saldo"));
        //    c34.SetBackgroundColor(ColorConstants.WHITE);
        //    c34.SetBorder(Border.NO_BORDER);
        //    c34.SetTextAlignment(TextAlignment.CENTER);
        //    c34.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    c34.SetFontSize(7);

        //    Cell c35 = new();
        //    c35.Add(new Paragraph("Atraso"));
        //    c35.SetBackgroundColor(ColorConstants.WHITE);
        //    c35.SetBorder(Border.NO_BORDER);
        //    c35.SetTextAlignment(TextAlignment.CENTER);
        //    c35.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    c35.SetFontSize(7);

        //    Cell c36 = new();
        //    c36.Add(new Paragraph("Pago"));
        //    c36.SetBackgroundColor(ColorConstants.WHITE);
        //    c36.SetBorder(Border.NO_BORDER);
        //    c36.SetTextAlignment(TextAlignment.CENTER);
        //    c36.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    c36.SetFontSize(7);

        //    Cell c37 = new();
        //    c37.Add(new Paragraph("Saldo Desp. de Pago"));
        //    c37.SetBackgroundColor(ColorConstants.WHITE);
        //    c37.SetBorder(Border.NO_BORDER);
        //    c37.SetTextAlignment(TextAlignment.CENTER);
        //    c37.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    c37.SetFontSize(7);

        //    Cell c38 = new();
        //    c38.Add(new Paragraph("Plazo"));
        //    c38.SetBackgroundColor(ColorConstants.WHITE);
        //    c38.SetBorder(Border.NO_BORDER);
        //    c38.SetTextAlignment(TextAlignment.CENTER);
        //    c38.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    c38.SetFontSize(7);

        //    // // Adding cells to the table
        //    table6.AddCell(c28);
        //    table6.AddCell(c29);
        //    table6.AddCell(c30);
        //    table6.AddCell(c31);
        //    table6.AddCell(c32);

        //    table7.AddCell(c33);
        //    table7.AddCell(c34);
        //    table7.AddCell(c35);
        //    table7.AddCell(c36);
        //    table7.AddCell(c37);

        //    table8.AddCell(c38);

        //    tableSubHead1.AddCell(new Cell().Add(table6).SetBorder(Border.NO_BORDER));
        //    tableSubHead1.AddCell(new Cell().Add(table7).SetBorder(Border.NO_BORDER));
        //    tableSubHead1.AddCell(new Cell().Add(table8).SetBorder(Border.NO_BORDER));

        //    Cell c39 = new();
        //    c39.Add(tableSubHead1);
        //    //c7.SetBackgroundColor(ColorConstants.GREEN);
        //    c39.SetNextRenderer(new RoundedBorderCellRenderer(c39));
        //    c39.SetBorder(Border.NO_BORDER);
        //    c39.SetTextAlignment(TextAlignment.CENTER);
        //    c39.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    //c34.SetBold();

        //    tableHead3.AddCell(c39);

        //    Table tableHead4 = new(new float[] { 550F });

        //    Cell c40 = new();
        //    c40.Add(new Paragraph("CANJES: " + RelacionCortes.NombreCompleto));
        //    //c7.SetBackgroundColor(ColorConstants.GREEN);
        //    //c40.SetNextRenderer(new RoundedBorderCellRenderer(c40));
        //    //c40.SetBorder(Border.NO_BORDER);
        //    c40.SetTextAlignment(TextAlignment.CENTER);
        //    c40.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    c40.SetFontSize(13);
        //    c40.SetBold();

        //    Cell c41 = new();
        //    c41.Add(new Paragraph("CANJES: DINERO"));
        //    //c7.SetBackgroundColor(ColorConstants.GREEN);
        //    //c40.SetNextRenderer(new RoundedBorderCellRenderer(c41));
        //    //c40.SetBorder(Border.NO_BORDER);
        //    c41.SetTextAlignment(TextAlignment.CENTER);
        //    c41.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    c41.SetFontSize(13);
        //    c41.SetBold();

        //    Table tableSubHead2 = new(new float[] { 300F, 225F, 25F });

        //    Table table9 = new(new float[] { 50F, 50F, 50F, 50F, 100F });

        //    Table table10 = new(new float[] { 50F, 50F, 25F, 50F, 50F });

        //    Table table11 = new(new float[] { 25F });

        //    var count = 0;
        //    decimal importe = 0;
        //    decimal saldo = 0;
        //    decimal atraso = 0;
        //    decimal pago = 0;
        //    decimal remanente = 0;

        //    foreach (var detalle in RelacionCortesDetalle)
        //    {
        //        //var abono = detalle.ImporteTotal;

        //        count += 1;
        //        importe += detalle.ImporteTotal.Value;
        //        saldo += detalle.saldoCredito.Value;
        //        atraso += detalle.saldoAtrasado.Value;
        //        pago += detalle.importePlazo.Value;
        //        remanente += detalle.SldDspPago.Value;


        //        Cell fhc = new();
        //        fhc.Add(new Paragraph(detalle.FechaCanje.Value.ToString("dd/MM/yyyy")));
        //        fhc.SetBackgroundColor(ColorConstants.WHITE);
        //        fhc.SetBorder(Border.NO_BORDER);
        //        fhc.SetTextAlignment(TextAlignment.CENTER);
        //        fhc.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //        fhc.SetFontSize(8);
        //        //c28.SetBold();

        //        Cell suc = new();
        //        suc.Add(new Paragraph(detalle.Nombre));
        //        suc.SetBackgroundColor(ColorConstants.WHITE);
        //        suc.SetBorder(Border.NO_BORDER);
        //        suc.SetTextAlignment(TextAlignment.CENTER);
        //        suc.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //        suc.SetFontSize(8);
        //        //c2.SetBold();

        //        Cell crd = new();
        //        crd.Add(new Paragraph(detalle.CreditoID.ToString()));
        //        crd.SetBackgroundColor(ColorConstants.WHITE);
        //        crd.SetBorder(Border.NO_BORDER);
        //        crd.SetTextAlignment(TextAlignment.CENTER);
        //        crd.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //        crd.SetFontSize(8);
        //        //c3.SetBold();

        //        Cell fol = new();
        //        fol.Add(new Paragraph(detalle.ValeCanje.Value.ToString()));
        //        fol.SetBackgroundColor(ColorConstants.WHITE);
        //        fol.SetBorder(Border.NO_BORDER);
        //        fol.SetTextAlignment(TextAlignment.CENTER);
        //        fol.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //        fol.SetFontSize(8);
        //        //c4.SetBold();

        //        Cell cl = new();
        //        cl.Add(new Paragraph(detalle.Cliente));
        //        cl.SetBackgroundColor(ColorConstants.WHITE);
        //        cl.SetBorder(Border.NO_BORDER);
        //        cl.SetTextAlignment(TextAlignment.CENTER);
        //        cl.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //        cl.SetFontSize(7);
        //        //c5.SetBold();

        //        Cell imp = new();
        //        imp.Add(new Paragraph(detalle.ImporteTotal.Value.ToString("C", CultureInfo.CurrentCulture)));
        //        imp.SetBackgroundColor(ColorConstants.WHITE);
        //        imp.SetBorder(Border.NO_BORDER);
        //        imp.SetTextAlignment(TextAlignment.CENTER);
        //        imp.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //        imp.SetFontSize(8);

        //        Cell sld = new();
        //        sld.Add(new Paragraph(detalle.saldoCredito.Value.ToString("C", CultureInfo.CurrentCulture)));
        //        sld.SetBackgroundColor(ColorConstants.WHITE);
        //        sld.SetBorder(Border.NO_BORDER);
        //        sld.SetTextAlignment(TextAlignment.CENTER);
        //        sld.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //        sld.SetFontSize(8);

        //        Cell atr = new();
        //        atr.Add(new Paragraph(detalle.saldoAtrasado.Value.ToString("C", CultureInfo.CurrentCulture)));
        //        atr.SetBackgroundColor(ColorConstants.WHITE);
        //        atr.SetBorder(Border.NO_BORDER);
        //        atr.SetTextAlignment(TextAlignment.CENTER);
        //        atr.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //        atr.SetFontSize(8);

        //        Cell pag = new();
        //        pag.Add(new Paragraph(detalle.importePlazo.Value.ToString("C", CultureInfo.CurrentCulture)));
        //        pag.SetBackgroundColor(ColorConstants.WHITE);
        //        pag.SetBorder(Border.NO_BORDER);
        //        pag.SetTextAlignment(TextAlignment.CENTER);
        //        pag.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //        pag.SetFontSize(8);

        //        Cell rmn = new();
        //        rmn.Add(new Paragraph(detalle.SldDspPago.Value.ToString("C", CultureInfo.CurrentCulture)));
        //        rmn.SetBackgroundColor(ColorConstants.WHITE);
        //        rmn.SetBorder(Border.NO_BORDER);
        //        rmn.SetTextAlignment(TextAlignment.CENTER);
        //        rmn.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //        rmn.SetFontSize(8);

        //        Cell plz = new();
        //        plz.Add(new Paragraph(detalle.PagoPlazo));
        //        plz.SetBackgroundColor(ColorConstants.WHITE);
        //        plz.SetBorder(Border.NO_BORDER);
        //        plz.SetTextAlignment(TextAlignment.CENTER);
        //        plz.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //        plz.SetFontSize(6);

        //        // // Adding cells to the table
        //        table9.AddCell(fhc);
        //        table9.AddCell(suc);
        //        table9.AddCell(crd);
        //        table9.AddCell(fol);
        //        table9.AddCell(cl);

        //        table10.AddCell(imp);
        //        table10.AddCell(sld);
        //        table10.AddCell(atr);
        //        table10.AddCell(pag);
        //        table10.AddCell(rmn);

        //        table11.AddCell(plz);

        //    }

        //    tableSubHead2.AddCell(new Cell().Add(table9).SetBorder(Border.NO_BORDER));
        //    tableSubHead2.AddCell(new Cell().Add(table10).SetBorder(Border.NO_BORDER));
        //    tableSubHead2.AddCell(new Cell().Add(table11).SetBorder(Border.NO_BORDER));

        //    Cell c42 = new();
        //    c42.Add(tableSubHead2);
        //    //c7.SetBackgroundColor(ColorConstants.GREEN);
        //    //c42.SetNextRenderer(new RoundedBorderCellRenderer(c39));
        //    c42.SetBorder(Border.NO_BORDER);
        //    c42.SetTextAlignment(TextAlignment.CENTER);
        //    c42.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    //c34.SetBold();

        //    Cell c43 = new(1,3);
        //    c43.Add(ls);
        //    //c43.SetBackgroundColor(ColorConstants.WHITE);
        //    //c43.SetTextAlignment(TextAlignment.CENTER);
        //    //c43.SetVerticalAlignment(VerticalAlignment.TOP);
        //    c43.SetBorder(Border.NO_BORDER);

        //    Table tableSubHead3 = new(new float[] { 200F, 100F, 250F });

        //    Cell c44 = new();
        //    c44.Add(new Paragraph("TOTAL TIPO DE CANJE: ValeDinero"));
        //    c44.SetBackgroundColor(ColorConstants.WHITE);
        //    c44.SetTextAlignment(TextAlignment.CENTER);
        //    c44.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    c44.SetBorder(Border.NO_BORDER);
        //    c44.SetFontSize(8);
        //    c44.SetBold();

        //    Cell c45 = new();
        //    c45.Add(new Paragraph("REGISTROS: " + count.ToString()));
        //    c45.SetBackgroundColor(ColorConstants.WHITE);
        //    c45.SetTextAlignment(TextAlignment.CENTER);
        //    c45.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    c45.SetBorder(Border.NO_BORDER);
        //    c45.SetFontSize(8);
        //    c45.SetBold();

        //    Table table12 = new(new float[] { 50F, 50F, 25F, 50F, 50F });

        //    Cell c46 = new();
        //    c46.Add(new Paragraph(importe.ToString("C", CultureInfo.CurrentCulture)));
        //    c46.SetBackgroundColor(ColorConstants.WHITE);
        //    c46.SetBorder(Border.NO_BORDER);
        //    c46.SetTextAlignment(TextAlignment.CENTER);
        //    c46.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    c46.SetFontSize(8);
        //    c46.SetBold();

        //    Cell c47 = new();
        //    c47.Add(new Paragraph(saldo.ToString("C", CultureInfo.CurrentCulture)));
        //    c47.SetBackgroundColor(ColorConstants.WHITE);
        //    c47.SetBorder(Border.NO_BORDER);
        //    c47.SetTextAlignment(TextAlignment.CENTER);
        //    c47.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    c47.SetFontSize(8);
        //    c47.SetBold();

        //    Cell c48 = new();
        //    c48.Add(new Paragraph(atraso.ToString("C", CultureInfo.CurrentCulture)));
        //    c48.SetBackgroundColor(ColorConstants.WHITE);
        //    c48.SetBorder(Border.NO_BORDER);
        //    c48.SetTextAlignment(TextAlignment.CENTER);
        //    c48.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    c48.SetFontSize(8);
        //    c48.SetBold();

        //    Cell c49 = new();
        //    c49.Add(new Paragraph(pago.ToString("C", CultureInfo.CurrentCulture)));
        //    c49.SetBackgroundColor(ColorConstants.WHITE);
        //    c49.SetBorder(Border.NO_BORDER);
        //    c49.SetTextAlignment(TextAlignment.CENTER);
        //    c49.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    c49.SetFontSize(8);
        //    c49.SetBold();

        //    Cell c50 = new();
        //    c50.Add(new Paragraph(remanente.ToString("C", CultureInfo.CurrentCulture)));
        //    c50.SetBackgroundColor(ColorConstants.WHITE);
        //    c50.SetBorder(Border.NO_BORDER);
        //    c50.SetTextAlignment(TextAlignment.CENTER);
        //    c50.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    c50.SetFontSize(8);
        //    c50.SetBold();

        //    table12.AddCell(c46);
        //    table12.AddCell(c47);
        //    table12.AddCell(c48);
        //    table12.AddCell(c49);
        //    table12.AddCell(c50);

        //    Cell c52 = new(1, 3);
        //    c52.Add(ls);
        //    //c43.SetBackgroundColor(ColorConstants.WHITE);
        //    //c43.SetTextAlignment(TextAlignment.CENTER);
        //    //c43.SetVerticalAlignment(VerticalAlignment.TOP);
        //    c52.SetBorder(Border.NO_BORDER);

        //    tableSubHead3.AddCell(c43);
        //    tableSubHead3.AddCell(c44);
        //    tableSubHead3.AddCell(c45);
        //    tableSubHead3.AddCell(table12);
        //    tableSubHead3.AddCell(c52);

        //    Cell c51 = new();
        //    c51.Add(tableSubHead3);
        //    //c7.SetBackgroundColor(ColorConstants.GREEN);
        //    //c42.SetNextRenderer(new RoundedBorderCellRenderer(c39));
        //    c51.SetBorder(Border.NO_BORDER);
        //    c51.SetTextAlignment(TextAlignment.CENTER);
        //    c51.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    //c34.SetBold();

        //    tableHead4.AddCell(c40);
        //    tableHead4.AddCell(c41);
        //    tableHead4.AddCell(c42);
        //    tableHead4.AddCell(c51);

        //    // var dia = DateTime.Now.Day;
        //    // var mes = DateTime.Now.Month;
        //    // var año = DateTime.Now.Year;

        //    // var diaf = Credito.UltimoVencimiento.Value.Day;
        //    // var mesf = Credito.UltimoVencimiento.Value.Month;
        //    // var añof = Credito.UltimoVencimiento.Value.Year;

        //    // Paragraph parr3 = new Paragraph("EN_____________________,____________________, A LOS " + dia.ToString() + " (" + Funciones.NumeroALetras(dia, false) + ") DIAS DEL MES DE " + Funciones.ObtenerNombreMesNumero(mes).ToUpper() + " DE " + año.ToString() + " (" + Funciones.NumeroALetras(año, false) + "), POR ESTE PAGARÉ DEBO Y ME OBLIGO INCONDICIONALMENTE A PAGAR A LA ORDEN DE_________________________________, EN SUS OFICINAS UBICADAS EN______________________________, EN_____________________________, ___________________________, EL DÍA " + diaf.ToString() + " (" + Funciones.NumeroALetras(diaf, false) + ") DEL MES DE " + Funciones.ObtenerNombreMesNumero(mesf).ToUpper() + " DE " + añof.ToString() + " (" + Funciones.NumeroALetras(añof, false) + "), LA CANTIDAD DE " + Credito.ImporteTotal.Value.ToString("C", CultureInfo.CurrentCulture) + " (" + Funciones.NumeroALetras((decimal)Credito.ImporteTotal, true) + "), CANTIDAD RECIBIDA A MI ENTERA SATISFACCIÓN. SI EL IMPORTE DEL PRESENTE NO FUERE CUBIERTO A LA FECHA DE SU VENCIMIENTO, CAUSARA INTERESES MORATORIOS AL TIPO DEL_____________% MENSUAL.")
        //    //     .SetTextAlignment(TextAlignment.JUSTIFIED)
        //    //     .SetFontSize(8);

        //    // Paragraph sign = new Paragraph()
        //    //   .SetFontSize(7)
        //    //   .SetBold()
        //    //   .SetTextAlignment(TextAlignment.CENTER)
        //    //   .Add(titletext2);

        //    // Paragraph parr4 = new Paragraph("REALIZA EL PAGO A: " + Credito.Distribuidor.ToUpper() + ", TELÉFONO: " + Credito.CelularDistribuidor.ToUpper())
        //    //  .SetFontSize(8)
        //    //  .SetBold();

        //    // Paragraph title2 = new Paragraph("Beneficiario")
        //    //  .SetFontSize(15)
        //    //  .SetBold()
        //    //  .SetTextAlignment(TextAlignment.CENTER);

        //    // Paragraph parr5 = new Paragraph("DESIGNACIÓN DE BENEFICIARIO")
        //    // .SetFontSize(9)
        //    // .SetBold();


        //    // Text titletext8 = new Text("NOMBRE: ")
        //    //     .SetBold();

        //    // Text titletext9 = new Text("___________________________________________________________________________________________")
        //    //     .SetFontColor(ColorConstants.LIGHT_GRAY);

        //    // Paragraph parr6 = new Paragraph()
        //    //   .SetFontSize(9);

        //    // Text titletext10 = new Text("PARENTESCO: ")
        //    //    .SetBold();

        //    // Text titletext11 = new Text("__________________________________________")
        //    //     .SetFontColor(ColorConstants.LIGHT_GRAY);

        //    // Text titletext12 = new Text(" FECHA DE NACIMIENTO: ")
        //    //   .SetBold();

        //    // Text titletext13 = new Text("______________________")
        //    //     .SetFontColor(ColorConstants.LIGHT_GRAY);

        //    // Paragraph parr7 = new Paragraph()
        //    //   .SetFontSize(9);

        //    // parr6.Add(titletext8);
        //    // parr6.Add(titletext9);

        //    // parr7.Add(titletext10);
        //    // parr7.Add(titletext11);
        //    // parr7.Add(titletext12);
        //    // parr7.Add(titletext13);

        //    // float[] pointColumnWidths2 = { 375, 372 };
        //    // Table table2 = new(pointColumnWidths2);

        //    // Paragraph sign2 = new Paragraph()
        //    // .SetFontSize(7)
        //    // .SetBold()
        //    // .SetTextAlignment(TextAlignment.CENTER)
        //    // .Add(new Text("FIRMA DE AUTORIZACIÓN POR PARTE DEL CLIENTE\nACEPTO LAS CONDICIONES DE ENTREGA DE IMPORTE\nAL BENEFICIARIO EN CASO DE MI FALLECIMIENTO."));

        //    // Cell t2c1 = new();
        //    // t2c1.Add(new Paragraph(""));
        //    // t2c1.SetBorder(Border.NO_BORDER);
        //    // t2c1.SetTextAlignment(TextAlignment.CENTER);
        //    // t2c1.SetBold();

        //    // Cell t2c2 = new();
        //    // t2c2.Add(sign2);
        //    // t2c2.SetBorder(Border.NO_BORDER);
        //    // t2c2.SetTextAlignment(TextAlignment.CENTER);
        //    // t2c2.SetBold();

        //    // table2.AddCell(t2c1);
        //    // table2.AddCell(t2c2);

        //    // Paragraph parr8 = new Paragraph("Nota: El apoyo de gastos funerarios será por la cantidad de $ 6,000 (son Seis mil pesos 00/100 mn), de la cual se descontará el adeudo vigente a la fecha del deceso, no aplica en casos de Muerte Violenta (Homicidio, Suicidio o accidentes de cualquier tipo) o Enfermedad Terminal (Cáncer, Diabetes, Cardiovasculares o sida). El tramite deberá realizarse en un plazo no mayor a 30 días naturales a partir de la fecha de la defunción.")
        //    //  .SetFontSize(8)
        //    //  .SetBold()
        //    //  .SetTextAlignment(TextAlignment.JUSTIFIED);

        //    // Paragraph title3 = new Paragraph("CARTA RESPONSIVA")
        //    //.SetFontSize(14)
        //    //.SetBold()
        //    //.SetTextAlignment(TextAlignment.CENTER);

        //    // Text text1 = new Text("Aceptar ser ")
        //    //     .SetFontColor(ColorConstants.DARK_GRAY);

        //    // Text text2 = new Text("testaferro ")
        //    //     .SetFontColor(ColorConstants.DARK_GRAY)
        //    //     .SetBold();

        //    // Text text3 = new Text("o ")
        //    //     .SetFontColor(ColorConstants.DARK_GRAY);

        //    // Text text4 = new Text("prestanombres")
        //    //    .SetFontColor(ColorConstants.DARK_GRAY)
        //    //    .SetBold();

        //    // Text text5 = new Text(", puede traer consecuencias graves como ser acusado de cómplice en diversos delitos fiscales o fraudes, por eso la ")
        //    //    .SetFontColor(ColorConstants.DARK_GRAY);

        //    // Text text6 = new Text("Comisión Nacional para la Protección y Defensa de los Usuarios de Servicios Financieros (Condusef) ")
        //    //    .SetFontColor(ColorConstants.DARK_GRAY)
        //    //    .SetBold();

        //    // Text text7 = new Text("recomienda pensar dos veces antes de aceptar serlo.")
        //    //     .SetFontColor(ColorConstants.DARK_GRAY);

        //    // Paragraph parr9 = new Paragraph()
        //    //   .SetTextAlignment(TextAlignment.JUSTIFIED)
        //    //   .SetFontSize(12);

        //    // parr9.Add(text1);
        //    // parr9.Add(text2);
        //    // parr9.Add(text3);
        //    // parr9.Add(text4);
        //    // parr9.Add(text5);
        //    // parr9.Add(text6);
        //    // parr9.Add(text7);

        //    // Text text8 = new Text("Prestanombres")
        //    //   .SetFontColor(ColorConstants.DARK_GRAY)
        //    //   .SetBold();

        //    // Text text9 = new Text(", es aquel individuo que finge realizar transacciones financieras por cuenta propia asumiendo las obligaciones como si fueran suyas, pero el dinero es para otra persona.")
        //    //   .SetFontColor(ColorConstants.DARK_GRAY);

        //    // Paragraph parr10 = new Paragraph()
        //    //   .SetFontSize(12)
        //    //   .SetTextAlignment(TextAlignment.JUSTIFIED);

        //    // parr10.Add(text8);
        //    // parr10.Add(text9);

        //    // Paragraph parr11 = new Paragraph("Además, corre el riesgo de robo de identidad y se pueden adquirir endeudamientos ajenos a la voluntad.")
        //    //   .SetTextAlignment(TextAlignment.JUSTIFIED)
        //    //   .SetFontColor(ColorConstants.DARK_GRAY)
        //    //   .SetFontSize(12);

        //    // Paragraph parr12 = new Paragraph("Toma en cuenta que si solicitas un préstamo a tu nombre y el sujeto que te pidió el favor de hacerlo, se retrasa o no lo paga, TÚ serás el único responsable de la deuda.")
        //    //   .SetTextAlignment(TextAlignment.JUSTIFIED)
        //    //   .SetFontColor(ColorConstants.DARK_GRAY)
        //    //   .SetFontSize(12);

        //    // Paragraph parr13 = new Paragraph("NO PERMITAS QUE TUS DATOS PERSONALES SEAN ROBADOS")
        //    //  .SetTextAlignment(TextAlignment.JUSTIFIED)
        //    //  .SetFontColor(ColorConstants.DARK_GRAY)
        //    //  .SetFontSize(12);

        //    // Paragraph parr14 = new Paragraph("Nombre y firma del cliente")
        //    //  .SetFontColor(ColorConstants.DARK_GRAY)
        //    //  .SetFontSize(12)
        //    //  .SetTextAlignment(TextAlignment.CENTER);

        //    // Paragraph parr15 = new Paragraph("A la firma de este documento hago constar que los datos personales proporcionados son verídicos, así mismo asumo responsabilidad en la obligación de pago que he contraído.")
        //    //  .SetFontColor(ColorConstants.DARK_GRAY)
        //    //  .SetFontSize(10)
        //    //  .SetTextAlignment(TextAlignment.CENTER);

        //    // AreaBreak aB = new();

        //    doc.Add(date);
        //    doc.Add(tabletitle);
        //    doc.Add(new Paragraph());
        //    doc.Add(tableHead1);
        //    doc.Add(tableHead2);
        //    doc.Add(new Paragraph());
        //    doc.Add(tableHead3);
        //    doc.Add(tableHead4);
        //    //doc.Add(aB);

        //    //doc.Add(parr3);
        //    //doc.Add(salto3);
        //    //doc.Add(ls);
        //    //doc.Add(sign);
        //    //doc.Add(new Paragraph());
        //    //doc.Add(parr4);
        //    //doc.Add(dl);
        //    //doc.Add(title2);
        //    //doc.Add(sl);
        //    //doc.Add(parr5);
        //    //doc.Add(parr6);
        //    //doc.Add(parr7);
        //    //doc.Add(salto2);
        //    //doc.Add(lfl);
        //    //doc.Add(table2);
        //    //doc.Add(parr8);

        //    //doc.Add(aB);

        //    //img.SetHeight(80);
        //    //doc.Add(img);
        //    //doc.Add(salto2);
        //    //doc.Add(title3);
        //    //doc.Add(salto2);
        //    //doc.Add(parr9);
        //    //doc.Add(new Paragraph());
        //    //doc.Add(parr10);
        //    //doc.Add(new Paragraph());
        //    //doc.Add(parr11);
        //    //doc.Add(new Paragraph());
        //    //doc.Add(parr12);
        //    //doc.Add(new Paragraph());
        //    //doc.Add(parr13);
        //    //doc.Add(salto4);
        //    //ls.SetMarginLeft(175);
        //    //ls.SetMarginRight(175);
        //    //doc.Add(ls);
        //    //doc.Add(parr14);
        //    //doc.Add(salto4);
        //    //doc.Add(parr15);
        //}


    }
}