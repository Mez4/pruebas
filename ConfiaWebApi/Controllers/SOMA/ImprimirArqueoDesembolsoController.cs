using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using System.IO;
using ConfiaWebApi.Code;
using Microsoft.Extensions.Configuration;
using iText.Kernel.Pdf;
using iText.Kernel.Geom;
using Microsoft.AspNetCore.Hosting;
using iText.IO.Image;
using iText.Layout.Properties;
using iText.Kernel.Pdf.Canvas.Draw;
using iText.Layout.Borders;
using iText.Kernel.Colors;
using System.Globalization;
using Path = System.IO.Path;
using System.Collections;
using DBContext.DBConfia.Creditos;
using iText.Layout.Element;
using iText.Layout;
using NPoco.Expressions;
using DBContext.DBConfia.Tesoreria;
//using Creditos_VW = DBContext.DBConfia.Creditos.Creditos_VW;

namespace ConfiaWebApi.Controllers.Sistema
{
    [Authorize]
    [ApiController]
    [Route("api/SOMA/[Controller]")]

    public class ImprimirArqueoDesembolsoController : ControllerBase
    {
        private DBConfiaContext DBContext;

        private IConfiguration Configuracion;
        private readonly IWebHostEnvironment _env;

        public ImprimirArqueoDesembolsoController(IConfiguration _Configuration, DBConfiaContext _DBContext, IWebHostEnvironment env)
        {
            this.Configuracion = _Configuration;
            DBContext = _DBContext;
            _env = env;
        }

        [HttpGet]
        [Route("GetArqueosDesembolso")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetArqueoDesembolso()
        {
            try
            {
                var ArqueoDesembolso = await DBContext.database.FetchAsync<DBContext.DBConfia.Creditos.Creditos_VW>();

                await DBContext.Destroy();
                return Ok(ArqueoDesembolso);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("consultaArqueosDesembolso2")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> consultaArqueosDesembolso(ConfiaWebApi.PeticionesRest.SOMA.ImprimirArqueosDesembolso.consulta parData)
        {
            try
            {
                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());

                var stored = "EXEC Tesoreria.GetImprimirArqueosDesembolso @SucursalID, @Fecha, @ProductoID";

                var obj = new
                {
                    SucursalID = parData.SucursalID,
                    Fecha = parData.FechaInicio,
                    ProductoID = ProductoID
                };

                var res = await DBContext.database.QueryAsync<dynamic>(stored, obj).ToArrayAsync();

                // var res = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.ArqueosDesembolso_VW>("WHERE CAST(FechaReporte as DATE)=CAST(@FechaInicio as DATE) AND " +
                // "(SucursalID = @SucursalID OR @SucursalID = 0) AND (ProductoID=@ProductoID)", parData);
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
        [Route("CancelarArqueo")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> CancelarArqueo(ConfiaWebApi.PeticionesRest.SOMA.ImprimirArqueosDesembolso.Cancelacion parData)
        {
            try
            {

                var res = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Tesoreria.ArqueosDesembolso>(parData.ArqueosDesembolsoID);

                res.Cancelado = true;
                await DBContext.database.UpdateAsync(res);

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
        [Route("imprimirPDF")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> imprimirPDF(PeticionesRest.SOMA.ImprimirArqueosDesembolso.pdf parData)
        {
            try
            {

                var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");

                string dest = Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf"));
                PdfWriter pw = new(dest);

                PdfDocument pdfDocument = new(pw);

                Document doc = new(pdfDocument, PageSize.LEDGER);
                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
                parData.ProductoID = ProductoID;

                //doc.SetMargins(40, 50, 40, 50);

                var Producto = await DBContext.database.SingleByIdAsync<Productos>(ProductoID);
                var logo = Producto.Logo;

                var arq = await DBContext.database.QueryAsync<ArqueosDesembolso_VW>("WHERE ArqueosDesembolsoID = @ArqueosDesembolsoID", parData).FirstOrDefaultAsync();

                var ArqueoDetalle = await DBContext.database.QueryAsync<ArqueosDesembolsoDetalle_VW>("WHERE (ArqueosDesembolsoID = @0)", parData.ArqueosDesembolsoID).ToArrayAsync();

                ImageData data = ImageDataFactory.Create(logo);

                Image img = new(data);

                img.SetWidth(130);
                img.SetHeight(50);

                Paragraph salto = new(new Text("\n"));

                float[] pointColumnWidths = { 340, 100F, 150F };

                Table table = new(pointColumnWidths);

                Cell c1 = new();
                c1.SetBackgroundColor(ColorConstants.WHITE);
                c1.SetBorder(Border.NO_BORDER);
                c1.Add(img);

                Cell c3 = new();
                c3.Add(new Paragraph("ARQUEOS DESEMBOLSO"));
                c3.SetBackgroundColor(ColorConstants.WHITE);
                c3.SetBorder(Border.NO_BORDER);
                c3.SetTextAlignment(TextAlignment.CENTER);
                c3.SetFontSize(16);
                c3.SetBold();

                float[] pointColumnWidths2 = { 700, 150F, 150F, 200 };
                Table table2 = new(pointColumnWidths2);

                Text text1 = new Text("FECHA: " + DateTime.Now.ToString())
                    .SetBold();

                Cell c5tx1 = new();
                c5tx1.Add(new Paragraph(text1));
                c5tx1.SetBorder(Border.NO_BORDER);
                c5tx1.SetFontSize(10);

                Text text2 = new Text("Sucursal: " + arq.Nombre.ToString())
                    .SetBold();

                Cell c5tx2 = new();
                c5tx2.Add(new Paragraph(text2));
                c5tx2.SetBorder(Border.NO_BORDER);
                c5tx2.SetFontSize(10);

                Text text3 = new Text("Realiza Corte: " + arq.NombreCompleto.ToString())
                    .SetBold();

                Cell c5tx3 = new();
                c5tx3.Add(new Paragraph(text3));
                c5tx3.SetBorder(Border.NO_BORDER);
                c5tx3.SetFontSize(10);

                Text text4 = new Text("Detalles: ")
                    .SetBold();

                Cell c5tx4 = new();
                c5tx4.Add(new Paragraph(text4));
                c5tx4.SetBorder(Border.NO_BORDER);
                c5tx4.SetFontSize(10);

                Text text4_1 = new Text("Observaciones: " + arq.Observaciones)
                    .SetBold();

                Cell c5tx5 = new();
                c5tx5.Add(new Paragraph(text4_1));
                c5tx5.SetBorder(Border.NO_BORDER);
                c5tx5.SetFontSize(10);

                table.AddCell(c1);
                table.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table.AddCell(c3);
                table2.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table2.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table2.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table2.AddCell(c5tx1);
                table2.AddCell(c5tx2);
                table2.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table2.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table2.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table2.AddCell(c5tx3);
                table2.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table2.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table2.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table2.AddCell(c5tx5);
                table2.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table2.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table2.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table2.AddCell(c5tx4);

                float[] pointColumnWidths0 = { 300, 30, 110, 80, 20, 110, 100 };
                Table table0 = new(pointColumnWidths0);

                Text text1t0 = new Text("Vales Desembolsados: ")
                    .SetBold();

                Cell c1tx1 = new();
                c1tx1.Add(new Paragraph(text1t0));
                c1tx1.SetFontSize(9);

                Text text2t0 = new Text(arq.ValesDesembolsados.ToString())
                    .SetBold();

                Cell c1tx2 = new();
                c1tx2.Add(new Paragraph(text2t0));
                c1tx2.SetTextAlignment(TextAlignment.CENTER);
                c1tx2.SetFontSize(9);

                Text text3t0 = new Text("Total Efectivo Capturado: ")
                    .SetBold();

                Cell c1tx3 = new();
                c1tx3.Add(new Paragraph(text3t0));
                c1tx3.SetFontSize(9);

                Text text4t0 = new Text(arq.ImporteDesembolsado.ToString("C", new CultureInfo("en-US")))
                    .SetBold();

                Cell c1tx4 = new();
                c1tx4.Add(new Paragraph(text4t0));
                c1tx4.SetTextAlignment(TextAlignment.CENTER);
                c1tx4.SetFontSize(9);

                Text text5t0 = new Text("Vales Total Capturados: ")
                    .SetBold();

                Cell c1tx5 = new();
                c1tx5.Add(new Paragraph(text5t0));
                c1tx5.SetFontSize(9);

                Text text6t0 = new Text(arq.ValesCapturados.ToString())
                    .SetBold();

                Cell c1tx6 = new();
                c1tx6.Add(new Paragraph(text6t0));
                c1tx6.SetTextAlignment(TextAlignment.CENTER);
                c1tx6.SetFontSize(9);

                Text text7t0 = new Text("Total Desembolso Sistema: ")
                    .SetBold();

                Cell c1tx7 = new();
                c1tx7.Add(new Paragraph(text7t0));
                c1tx7.SetFontSize(9);

                Text text8t0 = new Text(arq.ImporteDesembolsadoSistema.ToString("C", new CultureInfo("en-US")))
                    .SetBold();

                Cell c1tx8 = new();
                c1tx8.Add(new Paragraph(text8t0));
                c1tx8.SetTextAlignment(TextAlignment.CENTER);
                c1tx8.SetFontSize(9);

                Text text9t0 = new Text("Diferencia: ")
                    .SetBold();

                Cell c1tx9 = new();
                c1tx9.Add(new Paragraph(text9t0));
                c1tx9.SetFontSize(9);

                Text text10t0 = new Text(Math.Abs(arq.DiferenciaVales).ToString())
                    .SetBold();

                Cell c1tx10 = new();
                c1tx10.Add(new Paragraph(text10t0));
                c1tx10.SetTextAlignment(TextAlignment.CENTER);
                c1tx10.SetFontSize(9);

                Text text11t0 = new Text("Diferencia: ")
                    .SetBold();

                Cell c1tx11 = new();
                c1tx11.Add(new Paragraph(text11t0));
                c1tx11.SetFontSize(9);

                Text text12t0 = new Text(Math.Abs(arq.DiferenciaImporte).ToString("C", new CultureInfo("en-US")))
                    .SetBold();

                Cell c1tx12 = new();
                c1tx12.Add(new Paragraph(text12t0));
                c1tx12.SetTextAlignment(TextAlignment.CENTER);
                c1tx12.SetFontSize(9);

                table0.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table0.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table0.AddCell(c1tx1);
                table0.AddCell(c1tx2);
                table0.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table0.AddCell(c1tx3);
                table0.AddCell(c1tx4);
                table0.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table0.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table0.AddCell(c1tx5);
                table0.AddCell(c1tx6);
                table0.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table0.AddCell(c1tx7);
                table0.AddCell(c1tx8);
                table0.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table0.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table0.AddCell(c1tx9);
                table0.AddCell(c1tx10);
                table0.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table0.AddCell(c1tx11);
                table0.AddCell(c1tx12);

                float[] pointColumnWidths3 = { 70, 130, 100, 100, 100, 100, 100, 100, 100, 100, 130};
                Table table3 = new(pointColumnWidths3);

                Cell c4 = new();
                c4.Add(new Paragraph("CreditoID"));
                c4.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
                c4.SetTextAlignment(TextAlignment.CENTER);
                c4.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c4.SetFontSize(9);
                c4.SetBold();

                Cell c6 = new();
                c6.Add(new Paragraph("Cliente"));
                c6.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
                c6.SetTextAlignment(TextAlignment.CENTER);
                c6.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c6.SetFontSize(9);
                c6.SetBold();

                Cell c7 = new();
                c7.Add(new Paragraph("Folio Vale"));
                c7.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
                c7.SetTextAlignment(TextAlignment.CENTER);
                c7.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c7.SetFontSize(9);
                c7.SetBold();

                Cell c8 = new();
                c8.Add(new Paragraph("Estatus"));
                c8.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
                c8.SetTextAlignment(TextAlignment.CENTER);
                c8.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c8.SetFontSize(9);
                c8.SetBold();

                Cell c9 = new();
                c9.Add(new Paragraph("Tipo Desembolso"));
                c9.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
                c9.SetTextAlignment(TextAlignment.CENTER);
                c9.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c9.SetFontSize(9);
                c9.SetBold();

                Cell c10 = new();
                c10.Add(new Paragraph("Capital"));
                c10.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
                c10.SetTextAlignment(TextAlignment.CENTER);
                c10.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c10.SetFontSize(9);
                c10.SetBold();

                Cell c11 = new();
                c11.Add(new Paragraph("Fecha Activación"));
                c11.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
                c11.SetTextAlignment(TextAlignment.CENTER);
                c11.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c11.SetFontSize(9);
                c11.SetBold();

                Cell c12 = new();
                c12.Add(new Paragraph("Usuario Captura"));
                c12.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
                c12.SetTextAlignment(TextAlignment.CENTER);
                c12.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c12.SetFontSize(9);
                c12.SetBold();

                Cell c13 = new();
                c13.Add(new Paragraph("Fecha Registro"));
                c13.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
                c13.SetTextAlignment(TextAlignment.CENTER);
                c13.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c13.SetFontSize(9);
                c13.SetBold();

                Cell c14 = new();
                c14.Add(new Paragraph("SociaID"));
                c14.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
                c14.SetTextAlignment(TextAlignment.CENTER);
                c14.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c14.SetFontSize(9);
                c14.SetBold();

                Cell c15 = new();
                c15.Add(new Paragraph("Socia"));
                c15.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
                c15.SetTextAlignment(TextAlignment.CENTER);
                c15.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c15.SetFontSize(9);
                c15.SetBold();

                table3.AddCell(c4);
                table3.AddCell(c6);
                table3.AddCell(c7);
                table3.AddCell(c8);
                table3.AddCell(c9);
                table3.AddCell(c10);
                table3.AddCell(c11);
                table3.AddCell(c12);
                table3.AddCell(c13);
                table3.AddCell(c14);
                table3.AddCell(c15);

                foreach (var item in ArqueoDetalle)
                {
                    Cell c = new();
                    c.Add(new Paragraph(item.CreditoID.ToString()));
                    c.SetBackgroundColor(ColorConstants.WHITE);
                    c.SetTextAlignment(TextAlignment.CENTER);
                    c.SetFontSize(8);

                    Cell cli = new();
                    cli.Add(new Paragraph(item.NombreCompleto.ToString()));
                    cli.SetBackgroundColor(ColorConstants.WHITE);
                    cli.SetTextAlignment(TextAlignment.CENTER);
                    cli.SetFontSize(8);

                    Cell fv = new();
                    fv.Add(new Paragraph(item.ValeCanje.ToString()));
                    fv.SetBackgroundColor(ColorConstants.WHITE);
                    fv.SetTextAlignment(TextAlignment.CENTER);
                    fv.SetFontSize(8);

                    Cell est = new();
                    est.Add(new Paragraph(item.EstatusNombre.ToString()));
                    est.SetBackgroundColor(ColorConstants.WHITE);
                    est.SetTextAlignment(TextAlignment.CENTER);
                    est.SetFontSize(8);

                    Cell td = new();
                    td.Add(new Paragraph(item.TipoDesembolso.ToString()));
                    td.SetBackgroundColor(ColorConstants.WHITE);
                    td.SetTextAlignment(TextAlignment.CENTER);
                    td.SetFontSize(8);

                    Cell mon = new();
                    mon.Add(new Paragraph(item.Capital?.ToString("C", new CultureInfo("en-US"))));
                    mon.SetBackgroundColor(ColorConstants.WHITE);
                    mon.SetTextAlignment(TextAlignment.CENTER);
                    mon.SetFontSize(8);

                    Cell fha = new();
                    fha.Add(new Paragraph(item.fechaHoraActivacion.ToString()));
                    fha.SetBackgroundColor(ColorConstants.WHITE);
                    fha.SetTextAlignment(TextAlignment.CENTER);
                    fha.SetFontSize(8);

                    Cell nd = new();
                    nd.Add(new Paragraph(item.NombreCompletoRegistra.ToString()));
                    nd.SetBackgroundColor(ColorConstants.WHITE);
                    nd.SetTextAlignment(TextAlignment.CENTER);
                    nd.SetFontSize(8);

                    Cell fhr = new();
                    fhr.Add(new Paragraph(item.FechaHoraRegistro.ToString()));
                    fhr.SetBackgroundColor(ColorConstants.WHITE);
                    fhr.SetTextAlignment(TextAlignment.CENTER);
                    fhr.SetFontSize(8);

                    Cell so = new();
                    so.Add(new Paragraph(item.DistribuidorID.ToString()));
                    so.SetBackgroundColor(ColorConstants.WHITE);
                    so.SetTextAlignment(TextAlignment.CENTER);
                    so.SetFontSize(8);

                    Cell sn = new();
                    sn.Add(new Paragraph(item.Distribuidor.ToString()));
                    sn.SetBackgroundColor(ColorConstants.WHITE);
                    sn.SetTextAlignment(TextAlignment.CENTER);
                    sn.SetFontSize(8);

                    table3.AddCell(c);
                    table3.AddCell(cli);
                    table3.AddCell(fv);
                    table3.AddCell(est);
                    table3.AddCell(td);
                    table3.AddCell(mon);
                    table3.AddCell(fha);
                    table3.AddCell(nd);
                    table3.AddCell(fhr);
                    table3.AddCell(so);
                    table3.AddCell(sn);
                }

                 float[] pointColumnWidths4 = { 400, 60, 400 };
                Table table4 = new(pointColumnWidths4);
                table4.SetMargins(50, 100, 0, 100);


                Text text3t4 = new Text("_______________________________")
                    .SetBold();

                Cell c1tx3t4 = new();
                c1tx3t4.Add(new Paragraph(text3t4));
                c1tx3t4.SetBorder(Border.NO_BORDER);
                c1tx3t4.SetTextAlignment(TextAlignment.CENTER);
                c1tx3t4.SetFontSize(10);

                Text text4t4 = new Text("_______________________________")
                    .SetBold();

                Cell c1tx4t4 = new();
                c1tx4t4.Add(new Paragraph(text4t4));
                c1tx4t4.SetBorder(Border.NO_BORDER);
                c1tx4t4.SetTextAlignment(TextAlignment.CENTER);
                c1tx4t4.SetFontSize(10);

                Text text1t4 = new Text("Firma Gerente")
                    .SetBold();

                Cell c1tx1t4 = new();
                c1tx1t4.Add(new Paragraph(text1t4));
                c1tx1t4.SetBorder(Border.NO_BORDER);
                c1tx1t4.SetTextAlignment(TextAlignment.CENTER);
                c1tx1t4.SetFontSize(10);

                Text text2t4 = new Text("Firma Cajera")
                    .SetBold();

                Cell c1tx2t4 = new();
                c1tx2t4.Add(new Paragraph(text2t4));
                c1tx2t4.SetBorder(Border.NO_BORDER);
                c1tx2t4.SetTextAlignment(TextAlignment.CENTER);
                c1tx2t4.SetFontSize(10);

                table4.AddCell(c1tx3t4);
                table4.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table4.AddCell(c1tx4t4);
                table4.AddCell(c1tx1t4);
                table4.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table4.AddCell(c1tx2t4);

                doc.Add(table);
                doc.Add(new Paragraph());
                doc.Add(table2);
                doc.Add(table0);
                doc.Add(salto);
                doc.Add(table3);
                doc.Add(salto);
                doc.Add(salto);
                doc.Add(table4);  

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

                await DBContext.Destroy();

                return File(pdfStream, "application/pdf");

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}