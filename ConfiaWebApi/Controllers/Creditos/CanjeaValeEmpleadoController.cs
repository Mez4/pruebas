using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.General;
using System.Collections.Generic;
using DBContext.DBConfia.Custom.Creditos;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Kernel.Geom;
using iText.Layout.Element;
using System.IO;
using iText.IO.Image;
using Microsoft.AspNetCore.Hosting;
using iText.Layout.Properties;
using iText.Kernel.Pdf.Canvas.Draw;
using iText.Layout.Borders;
using iText.Kernel.Colors;
using ConfiaWebApi.Code;
using System.Globalization;
using DBContext.DBConfia.dbo;
using iText.Kernel.Pdf.Canvas;
using Path = System.IO.Path;
using System.Diagnostics;
using DBContext.DBConfia.Catalogos;
using DBContext.DBConfia.Bancos;
using Movimientos_VW = DBContext.DBConfia.Catalogos.Movimientos_VW;

namespace ConfiaWebApi.Controllers.Creditos
{
    [Authorize]
    [ApiController]
    [Route("api/Creditos/[controller]")]
    public class CanjeaValeEmpleadoController : ControllerBase
    {
        private DBConfiaContext ConexionDB;

        private readonly IWebHostEnvironment _env;

        public CanjeaValeEmpleadoController(DBConfiaContext _DBContext, IWebHostEnvironment env)
        {
            ConexionDB = _DBContext;
            _env = env;
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> Add(PeticionesRest.Creditos.CanjeaValeEmpleado.Add parData)
        {

            try
            {
                //var userName = HttpContext.User.Claims.Where(x => x.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier").FirstOrDefault().Value;

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                parData.UsuarioId = UsuarioActual.UsuarioID;
                parData.PersonaID = UsuarioActual.PersonaID.Value;

                ConexionDB.database.BeginTransaction();


                var parms = new
                {
                    parData.SucursalId,
                    parData.CajaID,
                    parData.EmpleadoId,
                    parData.ProductoID,
                    parData.Motivo,
                    parData.Capital,
                    parData.Interes,
                    parData.Manejocta,
                    parData.IVA,
                    parData.Plazos,
                    parData.TipoDesembolsoID,
                    parData.UsuarioId,
                    parData.PersonaID,
                    MovimientoID = 0,
                    PrestamoNomina = true
                };

                string Stored = "EXEC Creditos.pa_CanjeaValeEmpleado_Ins  @SucursalId, @CajaID, @EmpleadoId, @ProductoID, @Motivo, @Capital, @Interes, @Manejocta, @IVA, @Plazos, @TipoDesembolsoID, @UsuarioId, @PersonaID, @MovimientoID, @PrestamoNomina";


                var res = await ConexionDB.database.QueryAsync<CanjeaValeRes>(Stored, parData).FirstOrDefaultAsync();

                if (res.regresa != 1)
                {
                    ConexionDB.database.AbortTransaction();
                    return Ok(res);
                }


                var Credito = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoID = @0", res.CreditoId).FirstOrDefaultAsync();

                await ConexionDB.database.UpdateAsync(Credito);

                ConexionDB.database.CompleteTransaction();

                await ConexionDB.Destroy();

                return Ok(res);

            }
            catch (Exception ex)
            {
                ConexionDB.database.AbortTransaction();
                await ConexionDB.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        [Route("update")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> Update(PeticionesRest.Creditos.CanjeaValeEmpleado.Update parData)
        {

            try
            {
                //var userName = HttpContext.User.Claims.Where(x => x.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier").FirstOrDefault().Value;

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                parData.UsuarioId = UsuarioActual.UsuarioID;
                parData.PersonaID = UsuarioActual.PersonaID.Value;

                ConexionDB.database.BeginTransaction();

                var parms = new
                {
                    parData.CreditoID,
                    parData.SucursalId,
                    parData.CajaID,
                    parData.EmpleadoId,
                    parData.ProductoID,
                    parData.Motivo,
                    parData.Capital,
                    parData.Interes,
                    parData.Manejocta,
                    parData.IVA,
                    parData.Plazos,
                    parData.TipoDesembolsoID,
                    parData.UsuarioId,
                    parData.PersonaID,
                    MovimientoID = 0,
                    PrestamoNomina = true

                };

                string Stored = "EXEC Creditos.pa_CanjeaValeEmpleado_Upd  @CreditoID, @SucursalId, @CajaID, @EmpleadoId, @ProductoID, @Motivo, @Capital, @Interes, @Manejocta, @IVA, @Plazos, @TipoDesembolsoID, @UsuarioId, @PersonaID, @MovimientoID, @PrestamoNomina";

                var res = await ConexionDB.database.QueryAsync<CanjeaValeRes>(Stored, parms).FirstOrDefaultAsync();

                if (res.regresa != 1)
                {
                    ConexionDB.database.AbortTransaction();
                    return Ok(res);
                }


                var Credito = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE CreditoID = @0", res.CreditoId).FirstOrDefaultAsync();

                await ConexionDB.database.UpdateAsync(Credito);

                ConexionDB.database.CompleteTransaction();

                res.Credito = await ConexionDB.database.QueryAsync<Creditos_VW>("WHERE CreditoID = @0", res.CreditoId).FirstOrDefaultAsync();

                await ConexionDB.Destroy();

                return Ok(res);

            }
            catch (Exception ex)
            {
                ConexionDB.database.AbortTransaction();
                await ConexionDB.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        [Route("pdf")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Pdf(PeticionesRest.Creditos.CanjeaVale.Get parData)
        {
            try
            {
                var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");

                string dest = Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf"));

                //MemoryStream ms = new();

                PdfWriter pw = new(dest);

                PdfDocument pdfDocument = new(pw);

                Document doc = new(pdfDocument, PageSize.LETTER);

                doc.SetMargins(40, 55, 40, 55);

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var PersonaActual = await ConexionDB.database.QueryAsync<Personas_VW>("WHERE PersonaID=@0", UsuarioActual.PersonaID).FirstOrDefaultAsync();
                // var UsuarioActual = await ConexionDB.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
                // var PersonaActual = await ConexionDB.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.ID).FirstOrDefaultAsync();

                var Producto = await ConexionDB.database.SingleByIdAsync<Productos>(parData.ProductoID);

                var Credito = await ConexionDB.database.QueryAsync<Creditos_VW>("WHERE CreditoID = @CreditoID", parData).FirstOrDefaultAsync();

                var Credito2 = await ConexionDB.database.QueryAsync<Creditos_VW>("WHERE CreditoID = @CreditoID_2", parData).FirstOrDefaultAsync();

                var Pagos = await ConexionDB.database.FetchAsync<PlanPagos>("WHERE CreditoID = @CreditoID", parData);

                var Pagos2 = await ConexionDB.database.FetchAsync<PlanPagos>("WHERE CreditoID = @CreditoID_2", parData);

                var logo = Producto.Logo;

                LogImpresionDocumentos LogImpresion;

                LogImpresion = new LogImpresionDocumentos() { UsuarioId = UsuarioActual.UsuarioID, PersonaId = (long)UsuarioActual.UsuarioID, Fecha = DateTime.Now, CreditoID = Credito.CreditoID, TipoDocumentoId = 1 };

                await ConexionDB.database.InsertAsync(LogImpresion);

                GenerarArchivo(ref doc, pdfDocument, Credito, Pagos, logo, Credito2, Pagos2);

                if (Credito.FormatoImpresionExtra == true)
                {

                    var Movimiento = await ConexionDB.database.QueryAsync<Movimientos_VW>("WHERE MovimientoID = @MovimientoID", Credito).FirstOrDefaultAsync();

                    if (Movimiento != null)
                    {
                        switch (Movimiento.CveMovimientoID)
                        {
                            case "DSM":
                                //var Movimiento = await ConexionDB.database.QueryAsync<Movimientos_VW>("WHERE MovimientoID = @MovimientoID", Credito).FirstOrDefaultAsync();

                                LogImpresion = new LogImpresionDocumentos() { UsuarioId = UsuarioActual.UsuarioID, PersonaId = (long)UsuarioActual.UsuarioID, Fecha = DateTime.Now, CreditoID = Credito.CreditoID, TipoDocumentoId = 3 };

                                await ConexionDB.database.InsertAsync(LogImpresion);

                                PdfPage pdfPage = pdfDocument.AddNewPage();

                                PdfCanvas canvas = new(pdfPage);

                                canvas.Rectangle(30, 40, 550, 720);

                                canvas.Stroke();

                                MOVCTA(ref doc, pdfDocument, Movimiento, LogImpresion, PersonaActual, logo);

                                break;
                            case "SPEI":
                                Console.WriteLine("SPEI");
                                break;
                            case "ODP":
                                LogImpresion = new LogImpresionDocumentos() { UsuarioId = UsuarioActual.UsuarioID, PersonaId = PersonaActual.PersonaID, Fecha = DateTime.Now, CreditoID = Credito.CreditoID, TipoDocumentoId = 2 };

                                await ConexionDB.database.InsertAsync(LogImpresion);

                                ODP(ref doc, pdfDocument, Credito, logo);

                                break;
                            default:
                                break;
                        }
                    }
                }

                //var otro = true;

                //if (parData.CreditoID_2 > 0)
                //{

                //    AreaBreak aB = new();

                //    doc.Add(aB);

                //    var Credito2 = await DBContext.database.QueryAsync<Creditos_VW>("WHERE CreditoID = 10").FirstOrDefaultAsync();

                //    var Pagos2 = await DBContext.database.FetchAsync<PlanPagos>("WHERE CreditoID = 10");

                //    LogImpresion = new LogImpresionDocumentos() { UsuarioId = UsuarioActual.ID, PersonaId = PersonaActual.PersonaID, Fecha = DateTime.Now, CreditoID = Credito2.CreditoID, TipoDocumentoId = 1 };

                //    await DBContext.database.InsertAsync(LogImpresion);

                //    GenerarArchivo(ref doc, Credito2, Pagos2, logo);
                //}

                doc.Close();

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

                System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
                System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF_signed.pdf")));

                //byte[] byteStream = ms.ToArray();
                //ms = new MemoryStream();
                //ms.Write(byteStream, 0, byteStream.Length);
                //ms.Position = 0;

                await ConexionDB.Destroy();

                return File(pdfStream, "application/pdf");

            }
            catch (Exception ex)
            {
                await ConexionDB.Destroy();

                return BadRequest(ex.Message);
            }
        }

        private void ODP(ref Document doc, PdfDocument pdfDoc, Creditos_VW Credito, byte[] Logo)
        {
            LineSeparator ls = new(new SolidLine());

            //var imageFile = System.IO.Path.Combine(_env.ContentRootPath, "wwwroot/Archivos/LogoBancos", "5a270db16c215158268.png");

            //ImageData data = ImageDataFactory.Create(imageFile);

            ImageData data = ImageDataFactory.Create(Credito.LogoBanco);

            Image img = new(data);

            img.SetHeight(40);

            float[] pointColumnWidths = { 200, 150F, 150F };

            Table table = new(pointColumnWidths);

            Cell c1 = new();
            c1.SetBackgroundColor(ColorConstants.WHITE);
            c1.SetBorder(Border.NO_BORDER);
            c1.Add(img.SetAutoScale(true));

            Cell c2 = new();
            c2.Add(new Paragraph("ORDEN DE PAGO PARA COBRO EN " + Credito.NombreBanco.ToUpper()));
            c2.SetBackgroundColor(ColorConstants.WHITE);
            c2.SetBorder(Border.NO_BORDER);
            c2.SetTextAlignment(TextAlignment.CENTER);
            c2.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c2.SetFontSize(11);
            c2.SetBold();

            Cell c3 = new();
            c3.Add(new Paragraph(Credito.empresaNombre.ToUpper()));
            c3.SetBackgroundColor(ColorConstants.WHITE);
            c3.SetBorder(Border.NO_BORDER);
            c3.SetTextAlignment(TextAlignment.CENTER);
            c3.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c3.SetFontSize(10);
            c3.SetBold();

            table.AddCell(c1);
            table.AddCell(c2);
            table.AddCell(c3);


            float[] pointColumnWidths2 = { 375, 85, 300 };
            Table table2 = new(pointColumnWidths2);

            Text text1 = new("CRÉDITO:              " + Credito.CreditoID.ToString());

            Text text2 = new("CONVENIO:         " + Credito.DispersionConvenio);

            Text text3 = new("BENEFICIARIO:     " + Credito.NombreCompleto);

            Text text4 = new Text("IMPORTE:            " + Funciones.Truncate(Credito.Capital, 2).ToString("C", CultureInfo.CurrentCulture))
                .SetBold();

            Text text5 = new Text("REFERENCIA:       " + Credito.Referencia)
                .SetBold();

            Text text6 = new Text("CONCEPTO:         " + Credito.Concepto)
                .SetBold();

            Text text7 = new("GRUPO:            ");

            Text text8 = new("IMPRESION:          " + DateTime.Now.ToString("yyyy/MM/dd hh:mm:ss tt"));

            Cell c4 = new();
            c4.Add(new Paragraph(text1));
            c4.SetBorder(Border.NO_BORDER);
            c4.SetFontSize(9);

            Cell c5 = new();
            c5.Add(new Paragraph(text2));
            c5.SetBorder(Border.NO_BORDER);
            c5.SetBold();
            c5.SetFontSize(9);

            Cell c6 = new();
            c6.Add(new Paragraph(text3));
            c6.SetBorder(Border.NO_BORDER);
            c6.SetFontSize(9);

            Cell c7 = new();
            c7.Add(new Paragraph(text4));
            c7.SetBorder(Border.NO_BORDER);
            c7.SetBold();
            c7.SetFontSize(9);

            Cell c8 = new();
            c8.Add(new Paragraph(text5));
            c8.SetBorder(Border.NO_BORDER);
            c8.SetBold();
            c8.SetFontSize(9);

            Cell c9 = new();
            c9.Add(new Paragraph(text6));
            c9.SetBorder(Border.NO_BORDER);
            c9.SetBold();
            c9.SetFontSize(9);

            Cell c10 = new();
            c10.Add(new Paragraph(text7));
            c10.SetBorder(Border.NO_BORDER);
            c10.SetFontSize(9);

            Cell c11 = new();
            c11.Add(new Paragraph(text8));
            c11.SetBorder(Border.NO_BORDER);
            c11.SetFontSize(9);

            table2.AddCell(c4);
            table2.AddCell(new Cell().SetBorder(Border.NO_BORDER));
            table2.AddCell(c5);
            table2.AddCell(c6);
            table2.AddCell(new Cell().SetBorder(Border.NO_BORDER));
            table2.AddCell(c7);
            table2.AddCell(c8);
            table2.AddCell(new Cell().SetBorder(Border.NO_BORDER));
            table2.AddCell(c9);

            if (Credito.RequiereGrupo == true)
            {
                table2.AddCell(c10);
                table2.AddCell(new Cell());
                table2.AddCell(new Cell());
            }

            table2.AddCell(c11);

            Paragraph parr1 = new Paragraph("SE REQUIERE IDENTIFICACION OFICIAL VIGENTE PARA EL COBRO EN BANCO.\nVERIFIQUE QUE EL NOMBRE EN ESTE FORMATO SEA IGUAL AL DE SU IDENTIFICACION OFICIAL.\nVALIDO SOLO 5 DIAS NATURALES DESPUES DE SU FECHA DE EXPECION.")
             .SetFontSize(8)
             .SetTextAlignment(TextAlignment.CENTER);

            AreaBreak aB = new();

            doc.Add(aB);
            doc.Add(table);
            doc.Add(new Paragraph());
            doc.Add(table2);
            doc.Add(new Paragraph());
            doc.Add(parr1);
            doc.Add(ls);

            data = ImageDataFactory.Create(Logo);

            Image wmImg = new(data);

            float pWith = pdfDoc.GetDefaultPageSize().GetWidth();

            float iWith = wmImg.GetImageWidth();

            float pHeight = pdfDoc.GetDefaultPageSize().GetHeight();

            float iHeight = wmImg.GetImageHeight();

            wmImg.SetFixedPosition((pWith / 2f) - (iWith / 2f), (pHeight / 2f) - (iHeight / 2f));
            wmImg.SetOpacity(0.3f);

            doc.Add(wmImg);
        }

        private void MOVCTA(ref Document doc, PdfDocument pdfDoc, Movimientos_VW Movimiento, LogImpresionDocumentos LogImpresion, Personas_VW Persona, byte[] Logo)
        {
            LineSeparator ls = new(new SolidLine());

            Paragraph salto1 = new(new Text("\n"));

            Paragraph salto3 = new(new Text("\n\n\n"));

            Paragraph salto4 = new(new Text("\n\n\n\n"));

            Paragraph title = new Paragraph("DETALLE DE MOVIMIENTO DE CUENTA")
                .SetFontSize(14)
                .SetBold()
                .SetTextAlignment(TextAlignment.CENTER);


            float[] pointColumnWidths = { 25, 100, 175, 50, 150 };

            Table table = new(pointColumnWidths);

            Cell c1 = new();
            c1.Add(new Paragraph("ID:"));
            c1.SetBackgroundColor(ColorConstants.WHITE);
            //c1.SetBorder(Border.NO_BORDER);
            c1.SetTextAlignment(TextAlignment.CENTER);
            c1.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c1.SetFontSize(10);
            c1.SetBold();

            Cell c2 = new();
            c2.Add(new Paragraph(Movimiento.MovimientoID.ToString()));
            c2.SetBackgroundColor(ColorConstants.WHITE);
            //c2.SetBorder(Border.NO_BORDER);
            c2.SetTextAlignment(TextAlignment.CENTER);
            c2.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c2.SetFontSize(10);
            //c2.SetBold();

            Cell c3 = new();
            c3.Add(new Paragraph());
            c3.SetBackgroundColor(ColorConstants.WHITE);
            c3.SetBorder(Border.NO_BORDER);

            Cell c4 = new();
            c4.Add(new Paragraph("TIPO MOVIMIENTO:"));
            c4.SetBackgroundColor(ColorConstants.WHITE);
            //c1.SetBorder(Border.NO_BORDER);
            c4.SetTextAlignment(TextAlignment.CENTER);
            c4.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c4.SetFontSize(10);
            c4.SetBold();

            Cell c5 = new();
            c5.Add(new Paragraph(Movimiento.CveMovimientoID));
            c5.SetBackgroundColor(ColorConstants.WHITE);
            //c2.SetBorder(Border.NO_BORDER);
            c5.SetTextAlignment(TextAlignment.CENTER);
            c5.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c5.SetFontSize(10);
            //c2.SetBold();

            Cell c6 = new();
            c6.Add(new Paragraph(Movimiento.TipoMovimiento));
            c6.SetBackgroundColor(ColorConstants.WHITE);
            //c2.SetBorder(Border.NO_BORDER);
            c6.SetTextAlignment(TextAlignment.CENTER);
            c6.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c6.SetFontSize(10);
            //c2.SetBold();

            table.AddCell(c1);
            table.AddCell(c2);
            //table.AddCell(c3);
            table.AddCell(c4);
            table.AddCell(c5);
            table.AddCell(c6);

            float[] pointColumnWidths2 = { 200, 100, 300 };
            Table table2 = new(pointColumnWidths2);

            Cell c7 = new();
            c7.Add(new Paragraph("CUENTA:"));
            c7.SetBackgroundColor(ColorConstants.WHITE);
            c7.SetTextAlignment(TextAlignment.CENTER);
            c7.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c7.SetFontSize(10);
            c7.SetBold();

            Cell c8 = new();
            c8.Add(new Paragraph(Movimiento.NumeroCuenta));
            c8.SetBackgroundColor(ColorConstants.WHITE);
            c8.SetTextAlignment(TextAlignment.CENTER);
            c8.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c8.SetFontSize(10);

            Cell c9 = new();
            c9.Add(new Paragraph(Movimiento.Descripcion));
            c9.SetBackgroundColor(ColorConstants.WHITE);
            c9.SetTextAlignment(TextAlignment.CENTER);
            c9.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c9.SetFontSize(10);

            table2.AddCell(c7);
            table2.AddCell(c8);
            table2.AddCell(c9);

            float[] pointColumnWidths4 = { 100, 225, 25, 150 };
            Table table4 = new(pointColumnWidths4);

            Cell c13 = new();
            c13.Add(new Paragraph("PRODUCTO:"));
            c13.SetBackgroundColor(ColorConstants.WHITE);
            c13.SetTextAlignment(TextAlignment.CENTER);
            c13.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c13.SetFontSize(10);
            c13.SetBold();

            Cell c14 = new();
            c14.Add(new Paragraph(Movimiento.Producto));
            c14.SetBackgroundColor(ColorConstants.WHITE);
            c14.SetTextAlignment(TextAlignment.CENTER);
            c14.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c14.SetFontSize(10);

            Cell c15 = new();
            c15.Add(new Paragraph("IMPORTE:"));
            c15.SetBackgroundColor(ColorConstants.WHITE);
            c15.SetTextAlignment(TextAlignment.CENTER);
            c15.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c15.SetFontSize(10);
            c15.SetBold();

            Cell c16 = new();
            c16.Add(new Paragraph("DESCRIPCION:"));
            c16.SetBackgroundColor(ColorConstants.WHITE);
            c16.SetTextAlignment(TextAlignment.CENTER);
            c16.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c16.SetFontSize(10);
            c16.SetBold();

            Cell c17 = new();
            c17.Add(new Paragraph("PAG. P.I. " + Movimiento.CreditoID.ToString() + " / " + Movimiento.Cliente));
            c17.SetBackgroundColor(ColorConstants.WHITE);
            c17.SetTextAlignment(TextAlignment.CENTER);
            c17.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c17.SetFontSize(10);

            Cell c18 = new();
            c18.Add(new Paragraph(Funciones.Truncate(Movimiento.Importe, 2).ToString("C", CultureInfo.CurrentCulture)));
            c18.SetBackgroundColor(ColorConstants.WHITE);
            c18.SetTextAlignment(TextAlignment.CENTER);
            c18.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c18.SetFontSize(10);

            table4.AddCell(c13);
            table4.AddCell(c14);
            table4.AddCell(c3);
            table4.AddCell(c15);
            table4.AddCell(c16);
            table4.AddCell(c17);
            table4.AddCell(c3);
            table4.AddCell(c18);

            float[] pointColumnWidths5 = { 70, 55, 200 };
            Table table5 = new(pointColumnWidths5);

            Cell c19 = new();
            c19.Add(new Paragraph("CAPTURA:"));
            c19.SetBackgroundColor(ColorConstants.WHITE);
            c19.SetTextAlignment(TextAlignment.CENTER);
            c19.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c19.SetFontSize(10);
            c19.SetBold();

            Cell c20 = new();
            c20.Add(new Paragraph(Movimiento.PersonaIDRegistro.ToString()));
            c20.SetBackgroundColor(ColorConstants.WHITE);
            c20.SetTextAlignment(TextAlignment.CENTER);
            c20.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c20.SetFontSize(10);

            Cell c21 = new();
            c21.Add(new Paragraph(Movimiento.capturo));
            c21.SetBackgroundColor(ColorConstants.WHITE);
            c21.SetTextAlignment(TextAlignment.CENTER);
            c21.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c21.SetFontSize(10);

            table5.AddCell(c19);
            table5.AddCell(c20);
            table5.AddCell(c21);

            float[] pointColumnWidths6 = { 100, 100, 200, 200 };
            Table table6 = new(pointColumnWidths6);

            var fechaAfectacion = Movimiento.FechaCaptura.Year == 1900 ? String.Empty : Movimiento.FechaAfectacion?.ToString("dd/MM/yyyy hh:mm:ss tt");

            Cell c22 = new();
            c22.Add(new Paragraph("FECHA MOV:"));
            c22.SetBackgroundColor(ColorConstants.WHITE);
            c22.SetTextAlignment(TextAlignment.CENTER);
            c22.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c22.SetFontSize(10);
            c22.SetBold();

            Cell c23 = new();
            c23.Add(new Paragraph(fechaAfectacion));
            c23.SetBackgroundColor(ColorConstants.WHITE);
            c23.SetTextAlignment(TextAlignment.CENTER);
            c23.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c23.SetFontSize(10);

            var fechaCaptura = Movimiento.FechaCaptura.Year == 1900 ? String.Empty : Movimiento.FechaCaptura.ToString("dd/MM/yyyy hh:mm:ss tt");

            Cell c24 = new();
            c24.Add(new Paragraph("FECHA CAPTURA:"));
            c24.SetBackgroundColor(ColorConstants.WHITE);
            c24.SetTextAlignment(TextAlignment.CENTER);
            c24.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c24.SetFontSize(10);
            c24.SetBold();

            Cell c25 = new();
            c25.Add(new Paragraph(fechaCaptura));
            c25.SetBackgroundColor(ColorConstants.WHITE);
            c25.SetTextAlignment(TextAlignment.CENTER);
            c25.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c25.SetFontSize(10);

            table6.AddCell(c22);
            table6.AddCell(c23);
            table6.AddCell(c24);
            table6.AddCell(c25);

            float[] pointColumnWidths7 = { 75, 75, 185, 90, 75 };
            Table table7 = new(pointColumnWidths7);

            Cell c26 = new();
            c26.Add(new Paragraph("CLIENTE:"));
            c26.SetBackgroundColor(ColorConstants.WHITE);
            c26.SetTextAlignment(TextAlignment.CENTER);
            c26.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c26.SetFontSize(10);
            c26.SetBold();

            Cell c27 = new();
            c27.Add(new Paragraph(Movimiento.ClienteID.ToString()));
            c27.SetBackgroundColor(ColorConstants.WHITE);
            c27.SetTextAlignment(TextAlignment.CENTER);
            c27.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c27.SetFontSize(10);

            Cell c28 = new();
            c28.Add(new Paragraph(Movimiento.Cliente));
            c28.SetBackgroundColor(ColorConstants.WHITE);
            c28.SetTextAlignment(TextAlignment.CENTER);
            c28.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c28.SetFontSize(10);

            Cell c29a = new();
            c29a.Add(new Paragraph("MOVIMIENTOS:"));
            c29a.SetBackgroundColor(ColorConstants.WHITE);
            c29a.SetTextAlignment(TextAlignment.CENTER);
            c29a.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c29a.SetFontSize(10);
            c29a.SetBold();

            Cell c29 = new();
            c29.Add(new Paragraph(Movimiento.CreditosActivos.ToString()));
            c29.SetBackgroundColor(ColorConstants.WHITE);
            c29.SetTextAlignment(TextAlignment.CENTER);
            c29.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c29.SetFontSize(10);

            table7.AddCell(c26);
            table7.AddCell(c27);
            table7.AddCell(c28);
            table7.AddCell(c29a);
            table7.AddCell(c29);

            float[] pointColumnWidths8 = { 100, 50, 200 };
            Table table8 = new(pointColumnWidths8);

            if (Movimiento.RequiereGrupo == true)
            {
                Cell c30 = new();
                c30.Add(new Paragraph("GRUPO:"));
                c30.SetBackgroundColor(ColorConstants.WHITE);
                c30.SetTextAlignment(TextAlignment.CENTER);
                c30.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c30.SetFontSize(10);
                c30.SetBold();

                Cell c31 = new();
                c31.Add(new Paragraph(Movimiento.GrupoID.ToString()));
                c31.SetBackgroundColor(ColorConstants.WHITE);
                c31.SetTextAlignment(TextAlignment.CENTER);
                c31.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c31.SetFontSize(10);

                Cell c32 = new();
                c32.Add(new Paragraph(Movimiento.NombreGrupo));
                c32.SetBackgroundColor(ColorConstants.WHITE);
                c32.SetTextAlignment(TextAlignment.CENTER);
                c32.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c32.SetFontSize(10);

                table8.AddCell(c30);
                table8.AddCell(c31);
                table8.AddCell(c32);
            }

            float[] pointColumnWidths9 = { 100, 100, 100 };
            Table table9 = new(pointColumnWidths9);

            Cell c33 = new();
            c33.Add(new Paragraph("REFERENCIAS:"));
            c33.SetBackgroundColor(ColorConstants.WHITE);
            c33.SetTextAlignment(TextAlignment.CENTER);
            c33.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c33.SetFontSize(10);
            c33.SetBold();

            Cell c34 = new();
            c34.Add(new Paragraph("Crédito"));
            c34.SetBackgroundColor(ColorConstants.WHITE);
            c34.SetTextAlignment(TextAlignment.CENTER);
            c34.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c34.SetFontSize(10);

            Cell c35 = new();
            c35.Add(new Paragraph(Movimiento.CreditoID.ToString()));
            c35.SetBackgroundColor(ColorConstants.WHITE);
            c35.SetTextAlignment(TextAlignment.CENTER);
            c35.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c35.SetFontSize(10);

            table9.AddCell(c33);
            table9.AddCell(c34);
            table9.AddCell(c35);

            float[] pointColumnWidths10 = { 100, 200, 75, 225 };
            Table table10 = new(pointColumnWidths10);

            Cell c36 = new();
            c36.Add(new Paragraph("IMPRESION:"));
            c36.SetBackgroundColor(ColorConstants.WHITE);
            c36.SetTextAlignment(TextAlignment.CENTER);
            c36.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c36.SetFontSize(10);
            c36.SetBold();

            Cell c37 = new();
            c37.Add(new Paragraph(LogImpresion.Fecha.ToString("dd/MM/yyyy hh:mm:ss tt")));
            c37.SetBackgroundColor(ColorConstants.WHITE);
            c37.SetTextAlignment(TextAlignment.CENTER);
            c37.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c37.SetFontSize(10);

            Cell c38 = new();
            c38.Add(new Paragraph(LogImpresion.PersonaId.ToString()));
            c38.SetBackgroundColor(ColorConstants.WHITE);
            c38.SetTextAlignment(TextAlignment.CENTER);
            c38.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c38.SetFontSize(10);

            Cell c39 = new();
            c39.Add(new Paragraph(Persona.NombreCompleto));
            c39.SetBackgroundColor(ColorConstants.WHITE);
            c39.SetTextAlignment(TextAlignment.CENTER);
            c39.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c39.SetFontSize(10);

            table10.AddCell(c36);
            table10.AddCell(c37);
            table10.AddCell(c38);
            table10.AddCell(c39);

            float[] pointColumnWidths11 = { 250, 250 };
            Table table11 = new(pointColumnWidths11);

            LineSeparator rl = new(new SolidLine());
            //rl.SetMarginRight(250);

            LineSeparator lfl = new(new SolidLine());
            //lfl.SetMarginLeft(250);

            Cell c40 = new();
            c40.Add(new Paragraph("ENTREGUE"));
            c40.SetBackgroundColor(ColorConstants.WHITE);
            c40.SetTextAlignment(TextAlignment.CENTER);
            c40.SetVerticalAlignment(VerticalAlignment.TOP);
            c40.SetBorder(Border.NO_BORDER);
            c40.SetFontSize(10);

            Cell c41 = new();
            c41.Add(new Paragraph("RECIBI"));
            c41.SetBackgroundColor(ColorConstants.WHITE);
            c41.SetTextAlignment(TextAlignment.CENTER);
            c41.SetVerticalAlignment(VerticalAlignment.TOP);
            c41.SetBorder(Border.NO_BORDER);
            c41.SetFontSize(10);

            Cell c42 = new();
            c42.Add(rl);
            c42.SetBackgroundColor(ColorConstants.WHITE);
            c42.SetTextAlignment(TextAlignment.CENTER);
            c42.SetVerticalAlignment(VerticalAlignment.BOTTOM);
            c42.SetBorder(Border.NO_BORDER);
            c42.SetFontSize(10);

            Cell c43 = new();
            c43.Add(lfl);
            c43.SetBackgroundColor(ColorConstants.WHITE);
            c43.SetTextAlignment(TextAlignment.CENTER);
            c43.SetVerticalAlignment(VerticalAlignment.BOTTOM);
            c43.SetBorder(Border.NO_BORDER);
            c43.SetFontSize(10);

            table11.AddCell(c42);
            table11.AddCell(c43);
            table11.AddCell(c40);
            table11.AddCell(c41);

            AreaBreak aB = new();

            doc.Add(aB);
            doc.Add(ls);
            doc.Add(title);
            doc.Add(ls);
            doc.Add(salto3);
            doc.Add(table);
            doc.Add(salto1);
            doc.Add(table2);
            doc.Add(salto1);
            doc.Add(table4);
            doc.Add(salto1);
            doc.Add(table5);
            doc.Add(salto1);
            doc.Add(table6);
            doc.Add(salto1);
            doc.Add(table7);
            doc.Add(salto1);
            if (Movimiento.RequiereGrupo == true)
            {
                doc.Add(table8);
                doc.Add(salto1);
            }
            doc.Add(table9);
            doc.Add(salto1);
            doc.Add(table10);
            doc.Add(salto4);
            doc.Add(table11);

            ImageData data = ImageDataFactory.Create(Logo);

            Image wmImg = new(data);

            float pWith = pdfDoc.GetDefaultPageSize().GetWidth();

            float iWith = wmImg.GetImageWidth();

            float pHeight = pdfDoc.GetDefaultPageSize().GetHeight();

            float iHeight = wmImg.GetImageHeight();

            wmImg.SetFixedPosition((pWith / 2f) - (iWith / 2f), (pHeight / 2f) - (iHeight / 2f));
            wmImg.SetOpacity(0.3f);

            doc.Add(wmImg);

        }

        private void GenerarArchivo(ref Document doc, PdfDocument pdfDoc, Creditos_VW Credito, List<PlanPagos> Pagos, byte[] Logo, Creditos_VW Credito2, List<PlanPagos> Pagos2)
        {
            decimal Capital2 = 0;
            decimal Importe2 = 0;

            if (Credito2 != null)
            {
                Capital2 = Credito2.Capital;
                Importe2 = Credito2.ImporteTotal;
            }

            LineSeparator ls = new(new SolidLine());

            ls.SetMarginLeft(100);

            ls.SetMarginRight(100);

            LineSeparator lfl = new(new SolidLine());

            lfl.SetMarginLeft(255);

            //lfl.SetMarginRight(150);

            LineSeparator dl = new(new DashedLine());

            SolidLine line = new(1f);
            line.SetColor(ColorConstants.LIGHT_GRAY);

            LineSeparator sl = new(line);

            Paragraph salto2 = new(new Text("\n"));

            Paragraph salto3 = new(new Text("\n\n\n"));

            Paragraph salto4 = new(new Text("\n\n\n\n"));

            //PdfPage pdfPage = pdfDocument.AddNewPage();

            //PdfCanvas canvas = new(pdfPage);

            //canvas.MoveTo(150, 200);

            //canvas.LineTo(450, 200);

            //canvas.ClosePathStroke();

            //var imageFile = System.IO.Path.Combine(_env.ContentRootPath, "wwwroot/Sources", "logoVale.png");

            ImageData data = ImageDataFactory.Create(Logo);

            Image img = new(data);

            img.SetHeight(60);

            //PdfFont font = PdfFontFactory.CreateFont(FontConstants.HELVETICA);

            Paragraph date = new Paragraph(DateTime.Now.ToString("yyyy/MM/dd hh:mm:ss tt"))
                .SetTextAlignment(TextAlignment.RIGHT)
                .SetFontSize(7);

            Text titletext1 = new Text("Estimado(a): ")
                .SetBold();

            Text titletext2 = new(Credito.NombreCompleto.ToUpper());

            Text titletext3 = new Text("                                                                                            ")
                .SetBold();

            Text titletext4 = new Text("N° Crédito: ")
                .SetBold();

            Text titletext5 = new(Credito.CreditoID.ToString());

            Text titletext6 = new Text("Folio Vale: ")
                .SetBold();

            Text titletext7 = new(Credito.ValeCanje.ToString());

            Paragraph title = new Paragraph()
               .SetFontSize(9);

            title.Add(titletext1);
            title.Add(titletext2);
            title.Add(titletext3);
            title.Add(titletext4);
            title.Add(titletext5);
            title.Add("\n");
            title.Add(titletext6);
            title.Add(titletext7);

            Paragraph parr1 = new Paragraph("LA SOCIA: " + /*Credito.Distribuidor.ToUpper() +*/ ", HA ENTREGADO UN VALE PARA QUE LO PUEDAS CANJEAR EN NUESTRAS SUCURSALES. EL VALOR DE TU PRESTAMO ES DE: " + Funciones.Truncate((Credito.Capital + Capital2), 2).ToString() + " PESOS M.N., Y HAS DECIDIDO PAGARLO EN " + Credito.Plazos.ToString() + " PLAZOS DE FORMA " + Credito.TasaTipo.ToUpper() + ". ES TU RESPONSABILIDAD ABONARLE A " + /*Credito.Distribuidor.ToUpper() +*/ " ANTES DE CADA MARTES DE LA SEMANA EL MONTO SEÑALADO EN LA TABLA QUE SE ENCUENTRA A CONTINUACION:")
            .SetTextAlignment(TextAlignment.JUSTIFIED)
            .SetFontSize(8);

            Paragraph parr2 = new Paragraph("DE TUS PAGOS PUNTUALES DEPENDERÁ TU BUEN HISTORIAL Y LA POSIBILIDAD DE ACCEDER A FUTUROS CREDITOS.")
            .SetTextAlignment(TextAlignment.JUSTIFIED)
            .SetFontSize(9)
            .SetBold();

            float[] pointColumnWidths = { 75F, 250F, 150F, 125F, 150F };
            Table table = new(pointColumnWidths);

            Cell c1 = new();
            c1.Add(new Paragraph("# PAGO"));
            c1.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
            c1.SetBorder(Border.NO_BORDER);
            c1.SetTextAlignment(TextAlignment.CENTER);
            c1.SetBold();

            Cell c2 = new();
            c2.Add(new Paragraph("FECHA LIMITE DE PAGO"));
            c2.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
            c2.SetBorder(Border.NO_BORDER);
            c2.SetTextAlignment(TextAlignment.CENTER);
            c2.SetBold();

            Cell c3 = new();
            c3.Add(new Paragraph("SALDO INICIAL"));
            c3.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
            c3.SetBorder(Border.NO_BORDER);
            c3.SetTextAlignment(TextAlignment.CENTER);
            c3.SetBold();

            Cell c4 = new();
            c4.Add(new Paragraph("ABONO"));
            c4.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
            c4.SetBorder(Border.NO_BORDER);
            c4.SetTextAlignment(TextAlignment.CENTER);
            c4.SetBold();

            Cell c5 = new();
            c5.Add(new Paragraph("SALDO FINAL"));
            c5.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
            c5.SetBorder(Border.NO_BORDER);
            c5.SetTextAlignment(TextAlignment.CENTER);
            c5.SetBold();

            // Adding cells to the table       
            table.AddCell(c1);
            table.AddCell(c2);
            table.AddCell(c3);
            table.AddCell(c4);
            table.AddCell(c5);

            var importe = Credito.ImporteTotal + Importe2;

            var c = 0;

            foreach (var Pago in Pagos)
            {
                decimal abono2 = 0;

                if (Pagos2.Count > 0)
                {
                    abono2 = Pagos2[c].ImporteTotal.Value;
                }

                c++;

                var importeTotalT = Pago.ImporteTotal ?? 0;
                var abono = importeTotalT + abono2;

                Cell nP = new();
                nP.Add(new Paragraph(Pago.NoPago.ToString()));
                nP.SetBackgroundColor(ColorConstants.WHITE);
                nP.SetBorder(Border.NO_BORDER);
                nP.SetTextAlignment(TextAlignment.CENTER);

                Cell fch = new();
                fch.Add(new Paragraph(Pago.FechaVencimiento.ToString("yyyy/MM/dd")));
                fch.SetBackgroundColor(ColorConstants.WHITE);
                fch.SetBorder(Border.NO_BORDER);
                fch.SetTextAlignment(TextAlignment.CENTER);

                Cell sI = new();
                sI.Add(new Paragraph(Funciones.Truncate((decimal)importe, 2).ToString()));
                sI.SetBackgroundColor(ColorConstants.WHITE);
                sI.SetBorder(Border.NO_BORDER);
                sI.SetTextAlignment(TextAlignment.CENTER);

                Cell ab = new();
                ab.Add(new Paragraph(Funciones.Truncate((decimal)abono, 2).ToString()));
                ab.SetBackgroundColor(ColorConstants.WHITE);
                ab.SetBorder(Border.NO_BORDER);
                ab.SetTextAlignment(TextAlignment.CENTER);

                importe = importe - abono;

                Cell sf = new();
                sf.Add(new Paragraph(Funciones.Truncate((decimal)importe, 2).ToString()));
                sf.SetBackgroundColor(ColorConstants.WHITE);
                sf.SetBorder(Border.NO_BORDER);
                sf.SetTextAlignment(TextAlignment.CENTER);

                table.AddCell(nP);
                table.AddCell(fch);
                table.AddCell(sI);
                table.AddCell(ab);
                table.AddCell(sf);
            }

            var dia = DateTime.Now.Day;
            var mes = DateTime.Now.Month;
            var año = DateTime.Now.Year;

            var diaf = Pagos[c - 1].FechaVencimientoClienteFinal.Value.Day;
            var mesf = Pagos[c - 1].FechaVencimientoClienteFinal.Value.Month;
            var añof = Pagos[c - 1].FechaVencimientoClienteFinal.Value.Year;

            //var diaf = Credito.UltimoVencimiento.Value.Day;
            //var mesf = Credito.UltimoVencimiento.Value.Month;
            //var añof = Credito.UltimoVencimiento.Value.Year;

            Paragraph parr3 = new Paragraph("EN_____________________,____________________, A LOS " + dia.ToString() + " (" + Funciones.NumeroALetras(dia, false) + ") DIAS DEL MES DE " + Funciones.ObtenerNombreMesNumero(mes).ToUpper() + " DE " + año.ToString() + " (" + Funciones.NumeroALetras(año, false) + "), POR ESTE PAGARÉ DEBO Y ME OBLIGO INCONDICIONALMENTE A PAGAR A LA ORDEN DE_________________________________, EN SUS OFICINAS UBICADAS EN______________________________, EN_____________________________, ___________________________, EL DÍA " + diaf.ToString() + " (" + Funciones.NumeroALetras(diaf, false) + ") DEL MES DE " + Funciones.ObtenerNombreMesNumero(mesf).ToUpper() + " DE " + añof.ToString() + " (" + Funciones.NumeroALetras(añof, false) + "), LA CANTIDAD DE " + (Credito.ImporteTotal + Importe2).ToString("C", CultureInfo.CurrentCulture) + " (" + Funciones.NumeroALetras((decimal)Credito.ImporteTotal + Importe2, true) + "), CANTIDAD RECIBIDA A MI ENTERA SATISFACCIÓN. SI EL IMPORTE DEL PRESENTE NO FUERE CUBIERTO A LA FECHA DE SU VENCIMIENTO, CAUSARA INTERESES MORATORIOS AL TIPO DEL_____________% MENSUAL.")
                .SetTextAlignment(TextAlignment.JUSTIFIED)
                .SetFontSize(8);

            Paragraph sign = new Paragraph()
              .SetFontSize(7)
              .SetBold()
              .SetTextAlignment(TextAlignment.CENTER)
              .Add(titletext2);

            Paragraph parr4 = new Paragraph("REALIZA EL PAGO A: " + /*Credito.Distribuidor.ToUpper() +*/ ", TELÉFONO: "/* + Credito.CelularDistribuidor.ToUpper()*/)
             .SetFontSize(8)
             .SetBold();

            Paragraph title2 = new Paragraph("Beneficiario")
             .SetFontSize(15)
             .SetBold()
             .SetTextAlignment(TextAlignment.CENTER);

            Paragraph parr5 = new Paragraph("DESIGNACIÓN DE BENEFICIARIO")
            .SetFontSize(9)
            .SetBold();


            Text titletext8 = new Text("NOMBRE: ")
                .SetBold();

            Text titletext9 = new Text("___________________________________________________________________________________________")
                .SetFontColor(ColorConstants.LIGHT_GRAY);

            Paragraph parr6 = new Paragraph()
              .SetFontSize(9);

            Text titletext10 = new Text("PARENTESCO: ")
               .SetBold();

            Text titletext11 = new Text("__________________________________________")
                .SetFontColor(ColorConstants.LIGHT_GRAY);

            Text titletext12 = new Text(" FECHA DE NACIMIENTO: ")
              .SetBold();

            Text titletext13 = new Text("______________________")
                .SetFontColor(ColorConstants.LIGHT_GRAY);

            Paragraph parr7 = new Paragraph()
              .SetFontSize(9);

            parr6.Add(titletext8);
            parr6.Add(titletext9);

            parr7.Add(titletext10);
            parr7.Add(titletext11);
            parr7.Add(titletext12);
            parr7.Add(titletext13);

            float[] pointColumnWidths2 = { 375, 372 };
            Table table2 = new(pointColumnWidths2);

            Paragraph sign2 = new Paragraph()
            .SetFontSize(7)
            .SetBold()
            .SetTextAlignment(TextAlignment.CENTER)
            .Add(new Text("FIRMA DE AUTORIZACIÓN POR PARTE DEL CLIENTE\nACEPTO LAS CONDICIONES DE ENTREGA DE IMPORTE\nAL BENEFICIARIO EN CASO DE MI FALLECIMIENTO."));

            Cell t2c1 = new();
            t2c1.Add(new Paragraph(""));
            t2c1.SetBorder(Border.NO_BORDER);
            t2c1.SetTextAlignment(TextAlignment.CENTER);
            t2c1.SetBold();

            Cell t2c2 = new();
            t2c2.Add(sign2);
            t2c2.SetBorder(Border.NO_BORDER);
            t2c2.SetTextAlignment(TextAlignment.CENTER);
            t2c2.SetBold();

            table2.AddCell(t2c1);
            table2.AddCell(t2c2);

            Paragraph parr8 = new Paragraph("Nota: El apoyo de gastos funerarios será por la cantidad de $ 6,000 (son Seis mil pesos 00/100 mn), de la cual se descontará el adeudo vigente a la fecha del deceso, no aplica en casos de Muerte Violenta (Homicidio, Suicidio o accidentes de cualquier tipo) o Enfermedad Terminal (Cáncer, Diabetes, Cardiovasculares o sida). El tramite deberá realizarse en un plazo no mayor a 30 días naturales a partir de la fecha de la defunción.")
             .SetFontSize(8)
             .SetBold()
             .SetTextAlignment(TextAlignment.JUSTIFIED);

            Paragraph title3 = new Paragraph("CARTA RESPONSIVA")
           .SetFontSize(14)
           .SetBold()
           .SetTextAlignment(TextAlignment.CENTER);

            Text text1 = new Text("Aceptar ser ")
                .SetFontColor(ColorConstants.DARK_GRAY);

            Text text2 = new Text("testaferro ")
                .SetFontColor(ColorConstants.DARK_GRAY)
                .SetBold();

            Text text3 = new Text("o ")
                .SetFontColor(ColorConstants.DARK_GRAY);

            Text text4 = new Text("prestanombres")
               .SetFontColor(ColorConstants.DARK_GRAY)
               .SetBold();

            Text text5 = new Text(", puede traer consecuencias graves como ser acusado de cómplice en diversos delitos fiscales o fraudes, por eso la ")
               .SetFontColor(ColorConstants.DARK_GRAY);

            Text text6 = new Text("Comisión Nacional para la Protección y Defensa de los Usuarios de Servicios Financieros (Condusef) ")
               .SetFontColor(ColorConstants.DARK_GRAY)
               .SetBold();

            Text text7 = new Text("recomienda pensar dos veces antes de aceptar serlo.")
                .SetFontColor(ColorConstants.DARK_GRAY);

            Paragraph parr9 = new Paragraph()
              .SetTextAlignment(TextAlignment.JUSTIFIED)
              .SetFontSize(12);

            parr9.Add(text1);
            parr9.Add(text2);
            parr9.Add(text3);
            parr9.Add(text4);
            parr9.Add(text5);
            parr9.Add(text6);
            parr9.Add(text7);

            Text text8 = new Text("Prestanombres")
              .SetFontColor(ColorConstants.DARK_GRAY)
              .SetBold();

            Text text9 = new Text(", es aquel individuo que finge realizar transacciones financieras por cuenta propia asumiendo las obligaciones como si fueran suyas, pero el dinero es para otra persona.")
              .SetFontColor(ColorConstants.DARK_GRAY);

            Paragraph parr10 = new Paragraph()
              .SetFontSize(12)
              .SetTextAlignment(TextAlignment.JUSTIFIED);

            parr10.Add(text8);
            parr10.Add(text9);

            Paragraph parr11 = new Paragraph("Además, corre el riesgo de robo de identidad y se pueden adquirir endeudamientos ajenos a la voluntad.")
              .SetTextAlignment(TextAlignment.JUSTIFIED)
              .SetFontColor(ColorConstants.DARK_GRAY)
              .SetFontSize(12);

            Paragraph parr12 = new Paragraph("Toma en cuenta que si solicitas un préstamo a tu nombre y el sujeto que te pidió el favor de hacerlo, se retrasa o no lo paga, TÚ serás el único responsable de la deuda.")
              .SetTextAlignment(TextAlignment.JUSTIFIED)
              .SetFontColor(ColorConstants.DARK_GRAY)
              .SetFontSize(12);

            Paragraph parr13 = new Paragraph("NO PERMITAS QUE TUS DATOS PERSONALES SEAN ROBADOS")
             .SetTextAlignment(TextAlignment.JUSTIFIED)
             .SetFontColor(ColorConstants.DARK_GRAY)
             .SetFontSize(12);

            Paragraph parr14 = new Paragraph("Nombre y firma del cliente")
             .SetFontColor(ColorConstants.DARK_GRAY)
             .SetFontSize(12)
             .SetTextAlignment(TextAlignment.CENTER);

            Paragraph parr15 = new Paragraph("A la firma de este documento hago constar que los datos personales proporcionados son verídicos, así mismo asumo responsabilidad en la obligación de pago que he contraído.")
             .SetFontColor(ColorConstants.DARK_GRAY)
             .SetFontSize(10)
             .SetTextAlignment(TextAlignment.CENTER);

            AreaBreak aB = new();

            doc.Add(date);
            doc.Add(img);
            doc.Add(title);
            doc.Add(parr1);
            doc.Add(parr2);
            doc.Add(new Paragraph());
            doc.Add(table);

            Image wmImg = new(data);

            float pWith = pdfDoc.GetDefaultPageSize().GetWidth();

            float iWith = wmImg.GetImageWidth();

            float pHeight = pdfDoc.GetDefaultPageSize().GetHeight();

            float iHeight = wmImg.GetImageHeight();

            wmImg.SetFixedPosition((pWith / 2f) - (iWith / 2f), (pHeight / 2f) - (iHeight / 2f));
            wmImg.SetOpacity(0.3f);

            doc.Add(wmImg);

            doc.Add(aB);

            doc.Add(parr3);
            doc.Add(salto3);
            doc.Add(ls);
            doc.Add(sign);
            doc.Add(new Paragraph());
            doc.Add(parr4);
            doc.Add(dl);
            doc.Add(title2);
            doc.Add(sl);
            doc.Add(parr5);
            doc.Add(parr6);
            doc.Add(parr7);
            doc.Add(salto2);
            doc.Add(lfl);
            doc.Add(table2);
            doc.Add(parr8);

            doc.Add(wmImg);

            doc.Add(aB);

            img.SetHeight(80);
            doc.Add(img);
            doc.Add(salto2);
            doc.Add(title3);
            doc.Add(salto2);
            doc.Add(parr9);
            doc.Add(new Paragraph());
            doc.Add(parr10);
            doc.Add(new Paragraph());
            doc.Add(parr11);
            doc.Add(new Paragraph());
            doc.Add(parr12);
            doc.Add(new Paragraph());
            doc.Add(parr13);
            doc.Add(salto4);
            ls.SetMarginLeft(175);
            ls.SetMarginRight(175);
            doc.Add(ls);
            doc.Add(parr14);
            doc.Add(salto4);
            doc.Add(parr15);

            doc.Add(wmImg);
        }


    }
}
