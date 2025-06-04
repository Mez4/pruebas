using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.General;
using System.Collections;
using System.Collections.Generic;
using ConfiaWebApi.ModlesSP.Creditos;
using DBContext.DBConfia.dbo;
using DBContext.DBConfia.Catalogos;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Kernel.Geom;
using iText.Layout.Element;
using System.IO;
using iText.IO.Image;
using iText.Layout.Properties;
using iText.Kernel.Pdf.Canvas.Draw;
using iText.Layout.Borders;
using iText.Kernel.Colors;
using ConfiaWebApi.Code;
using System.Globalization;
using iText.Kernel.Pdf.Canvas;
using Path = System.IO.Path;
using DBContext.DBConfia.Bancos;
using DBContext.DBConfia.Creditos;
using Movimientos_VW = DBContext.DBConfia.Catalogos.Movimientos_VW;
using Newtonsoft.Json;

namespace ConfiaWebApi.Controllers.Creditos
{
    [Authorize]
    [ApiController]
    [Route("api/Creditos/[controller]")]
    public class SaldoClienteController : ControllerBase
    {
        private DBConfiaContext ConexionBD;

        public SaldoClienteController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        [HttpPost]
        [Route("getById")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetById(PeticionesRest.Creditos.Cliente.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                var Producto = await ConexionBD.database.SingleByIdAsync<Productos>(producto);
                parData.EmpresaId = Producto.EmpresaId;
                /* 
                                var Cliente = await ConexionBD.database.SingleAsync<Creditos_VW>("WHERE ClienteID = @0", parData.ClienteID);
                                var Contrato = await ConexionBD.database.SingleAsync<Contratos_VW>("WHERE ContratoID = @0",Cliente.ContratoID);

                                var DistribuidorID = Contrato.DistribuidorID; */

                SaldoClienteTable res = await ConexionBD.database.QueryAsync<SaldoClienteTable>("FROM Pagos.Saldo_Liquidar_Cliente(@ClienteID, @EmpresaId)", parData).FirstOrDefaultAsync();
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }

        }

        [HttpPost]
        [Route("getByIdCredito")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetByIdCredito(PeticionesRest.Creditos.Cliente.GetCredito parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                var Producto = await ConexionBD.database.SingleByIdAsync<Productos>(producto);
                parData.EmpresaId = Producto.EmpresaId;
                /* 
                                var Cliente = await ConexionBD.database.SingleAsync<Creditos_VW>("WHERE ClienteID = @0", parData.ClienteID);
                                var Contrato = await ConexionBD.database.SingleAsync<Contratos_VW>("WHERE ContratoID = @0",Cliente.ContratoID);

                                var DistribuidorID = Contrato.DistribuidorID; */

                SaldoClienteTable res = await ConexionBD.database.QueryAsync<SaldoClienteTable>("FROM Pagos.Saldo_Liquidar_Credito(@ClienteID, @EmpresaId,@CreditoID)", parData).FirstOrDefaultAsync();
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }

        }


        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> Add(PeticionesRest.Creditos.Cliente.Add parData)
        {

            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                parData.UsuarioId = UsuarioActual.UsuarioID;
                parData.accion = 4;
                parData.CuentaBancoID = parData.CuentaBancoID == 0 ? null : parData.CuentaBancoID;
                parData.msj = "";
                parData.DnisJSON = parData.MovimientoIDs != null ? JsonConvert.SerializeObject(parData.MovimientoIDs) : "[]";
                parData.TicketsJSON = parData.TicketIDs != null ? JsonConvert.SerializeObject(parData.TicketIDs) : "[]";

                string Stored = "";

                if (parData.Comision == true)
                {
                    Stored = "EXEC Creditos.pa_LiquidaSaldoCredito_Ins @ClienteID, @ProductoId, @UsuarioId, @SucursalId, @CajaID, @A_Pagar, @Liquida, @FechaPago, @CreditoID, @DnisJSON, @CuentaBancoID, @TicketsJSON";
                }
                else
                {
                    Stored = "EXEC Creditos.pa_LiquidaSaldoCredito_SinComision_Ins @ClienteID, @ProductoId, @UsuarioId, @SucursalId, @CajaID, @A_Pagar, @Liquida, @FechaPago, @accion,@ConvenioID2, @regresa OUT, @msj OUT, @DistribuidorID, @CreditoID, @DnisJSON, @CuentaBancoID, @TicketsJSON";
                }

                var res = await ConexionBD.database.QueryAsync<SaldoClienteRes>(Stored, parData).FirstOrDefaultAsync();
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("add2")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> Add2(PeticionesRest.Creditos.Cliente.Add2 parData)
        {

            try
            {
                //var userName = HttpContext.User.Claims.Where(x => x.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier").FirstOrDefault().Value;
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                // var UsuarioActual = await DBContext.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
                //var UsuarioActual = await DBContext.database.QueryAsync<USER_ENTITY>("WHERE EMAIL=@0", UserName).FirstOrDefaultAsync();
                // var PersonaActual = await ConexionBD.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.ID).FirstOrDefaultAsync();

                parData.UsuarioId = UsuarioActual.UsuarioID;
                parData.FechaPago = DateTime.Now;
                //parData.PersonaID = PersonaActual.PersonaID;
                parData.accion = 4;
                parData.msj = "";
                //DBContext.database.BeginTransaction();

                string Stored = "";


                Stored = "EXEC Creditos.pa_LiquidaSaldoClienteAclaracion_Ins @ClienteID, @ProductoId, @UsuarioId, @CuentaBancoID, @A_Pagar, @Liquida, @FechaPago";




                var res = await ConexionBD.database.QueryAsync<SaldoClienteRes>(Stored, parData).FirstOrDefaultAsync();

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
        [Route("pdf")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Pdf(PeticionesRest.Creditos.AplicaPagos.Pdf parData)
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
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                // var UsuarioActual = await ConexionBD.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
                // var PersonaActual = await ConexionBD.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.ID).FirstOrDefaultAsync();

                //var LogImpresion = new LogImpresionDocumentos() { UsuarioId = UsuarioActual.ID, PersonaId = PersonaActual.PersonaID, Fecha = DateTime.Now, CreditoID = 0, TipoDocumentoId = 1 };
                //await DBContext.database.InsertAsync(LogImpresion);

                var Movimiento = await ConexionBD.database.QueryAsync<Movimientos_VW>("WHERE MovimientoID = @MovimientoID", parData).FirstOrDefaultAsync();
                var MovimientosDetalle = await ConexionBD.database.FetchAsync<MovimientosDetalle>("WHERE MovimientoID = @MovimientoID", parData);

                var Producto = await ConexionBD.database.SingleByIdAsync<Productos>(Movimiento.ProductoId);
                var varfz = await ConexionBD.database.QueryAsync<VariablesGlobales>("WHERE (varName=@0)", "FONTSIZE_SAL_CON").FirstOrDefaultAsync();
                var varsr = await ConexionBD.database.QueryAsync<VariablesGlobales>("WHERE (varName=@0)", "FONTRANGE_SAL_CON").FirstOrDefaultAsync();
                var varrd = await ConexionBD.database.QueryAsync<VariablesGlobales>("WHERE (varName=@0)", "FONTRANGE_DIFF").FirstOrDefaultAsync();

                var logo = Producto.Logo;

                float fontSize = float.Parse(varfz.varValue.ToString(), CultureInfo.InvariantCulture.NumberFormat);

                float FontRange = float.Parse(varsr.varValue.ToString(), CultureInfo.InvariantCulture.NumberFormat);

                float rangeDiff = float.Parse(varrd.varValue.ToString(), CultureInfo.InvariantCulture.NumberFormat);

                PdfPage pdfPage = pdfDocument.AddNewPage();

                PdfCanvas canvas = new(pdfPage);
                var NombreRef = await ConexionBD.database.QueryAsync<DBContext.DBConfia.General.Personas_VW>("Where PersonaID = @0", Movimiento.RefApl).SingleOrDefaultAsync();
                var NombreCompleto = "";
                if (NombreRef != null) NombreCompleto = NombreRef.NombreCompleto.ToString();



                //canvas.Rectangle(30, 500, 100, 100);

                //canvas.Stroke();

                Recibo(ref doc, pdfDocument, Movimiento, MovimientosDetalle, UsuarioActual, logo, NombreCompleto, fontSize, FontRange, rangeDiff);

                if (MovimientosDetalle.Count > 6)
                {
                    // AreaBreak aB = new();
                    // doc.Add(aB);
                    Paragraph salto = new(new Text("\n"));
                    LineSeparator ls = new(new SolidLine());

                    //  doc.Add(salto);
                    doc.Add(salto);
                    doc.Add(ls);
                    doc.Add(salto);
                }
                else
                {
                    Paragraph salto = new(new Text("\n"));
                    LineSeparator ls = new(new SolidLine());

                    //   doc.Add(salto);
                    doc.Add(salto);
                    doc.Add(ls);
                    doc.Add(salto);
                }

                //PdfPage pdfPage = pdfDocument.AddNewPage();

                //PdfCanvas canvas = new(pdfPage);

                //canvas.Rectangle(30, 40, 550, 720);

                //canvas.Stroke();

                Recibo(ref doc, pdfDocument, Movimiento, MovimientosDetalle, UsuarioActual, logo, NombreCompleto, fontSize, FontRange, rangeDiff);

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

                // Obtenemos nuestro PDF
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

        private void Recibo(ref Document doc, PdfDocument pdfDoc, Movimientos_VW Movimiento, List<MovimientosDetalle> MovimientosDetalle, DBContext.DBConfia.Seguridad.UsuariosVW Persona, byte[] Logo, String NombreCompleto, float fontSize, float FontRange, float rangeDiff)
        {
            LineSeparator ls = new(new SolidLine());

            Paragraph salto1 = new(new Text("\n"));

            //Paragraph salto3 = new(new Text("\n\n\n"));

            //Paragraph salto4 = new(new Text("\n\n\n\n"));

            float[] pointColumnWidths = { 100, 100, 100, 100, 100 };

            Table table = new(pointColumnWidths);

            float[] pointColumnWidths2 = { 100, 100, 100 };

            Table tableDet = new(pointColumnWidths2);

            float[] pointColumnWidths3 = { 50, 50, 50, 50 };

            Table tableSld = new(pointColumnWidths3);

            float[] pointColumnWidths4 = { 100, 100, 100 };

            Table tableSec = new(pointColumnWidths4);


            Cell c1 = new(1, 3);
            c1.Add(new Paragraph("RECIBO DE CAJA"));
            c1.SetBackgroundColor(ColorConstants.WHITE);
            c1.SetTextAlignment(TextAlignment.CENTER);
            c1.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c1.SetFontSize(12);
            c1.SetBold();

            Cell c2 = new();
            c2.Add(new Paragraph("FECHA: " + Movimiento.FechaCaptura.ToString("dd/MM/yyyy hh:mm:ss tt")));
            c2.SetBackgroundColor(ColorConstants.WHITE);
            c2.SetTextAlignment(TextAlignment.CENTER);
            c2.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c2.SetFontSize(10);

            Cell c3 = new();
            c3.Add(new Paragraph("FOLIO: " + Movimiento.MovimientoID.ToString()));
            c3.SetBackgroundColor(ColorConstants.WHITE);
            c3.SetTextAlignment(TextAlignment.CENTER);
            c3.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c3.SetFontSize(10);
            c3.SetBold();

            Cell c4 = new(1, 2);
            c4.Add(new Paragraph("RECIBE: " + Movimiento.capturo.ToString()));
            c4.SetBackgroundColor(ColorConstants.WHITE);
            c4.SetTextAlignment(TextAlignment.CENTER);
            c4.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c4.SetFontSize(10);
            //c4.SetBold();

            Cell c5 = new(1, 2);
            c5.Add(new Paragraph("CLIENTE: " + Movimiento.RefApl + " - " + NombreCompleto));
            c5.SetBackgroundColor(ColorConstants.WHITE);
            //c2.SetBorder(Border.NO_BORDER);
            c5.SetTextAlignment(TextAlignment.CENTER);
            c5.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c5.SetFontSize(10);
            //c2.SetBold();

            Cell c6 = new();
            c6.Add(new Paragraph("IMPRESION: " + DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt")));
            c6.SetBackgroundColor(ColorConstants.WHITE);
            //c2.SetBorder(Border.NO_BORDER);
            c6.SetTextAlignment(TextAlignment.CENTER);
            c6.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c6.SetFontSize(10);
            //c2.SetBold();

            Cell c8 = new(1, 4);
            c8.Add(new Paragraph("IMPORTE EN LETRA: " + Funciones.NumeroALetras((decimal)Movimiento.Importe, true)));
            c8.SetBackgroundColor(ColorConstants.WHITE);
            c8.SetTextAlignment(TextAlignment.CENTER);
            c8.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c8.SetFontSize(10);

            Cell c9 = new();
            c9.Add(new Paragraph());
            c9.SetBackgroundColor(ColorConstants.WHITE);
            c9.SetTextAlignment(TextAlignment.CENTER);
            c9.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c9.SetFontSize(10);

            Cell c10 = new(1, 3);
            c10.Add(new Paragraph("DETALLE DEL PAGO RECIBIDO"));
            c10.SetBackgroundColor(ColorConstants.WHITE);
            c10.SetTextAlignment(TextAlignment.CENTER);
            c10.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c10.SetBorder(Border.NO_BORDER);
            c10.SetFontSize(10);
            c10.SetBold();

            Cell c11 = new(1, 2);
            c11.Add(new Paragraph("SALDOS A LA FECHA/HORA IMPRESION"));
            c11.SetBackgroundColor(ColorConstants.WHITE);
            c11.SetTextAlignment(TextAlignment.CENTER);
            c11.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c11.SetBorder(Border.NO_BORDER);
            c11.SetFontSize(9);
            c11.SetBold();
            c11.SetMarginBottom(6);

            // Paragraph salto = new(new Text("\n"));
            // if (MovimientosDetalle.Count > 25) { doc.Add(salto); }

            table.AddCell(c1);
            table.AddCell(c2);
            table.AddCell(c3);
            table.AddCell(c4);
            table.AddCell(c5);
            table.AddCell(c6);
            //table.AddCell(c7);
            table.AddCell(c8);
            table.AddCell(c9);
            table.AddCell(c10);
            table.AddCell(c11);

            Cell c12 = new();
            c12.Add(new Paragraph("N° CREDITO"));
            c12.SetBackgroundColor(ColorConstants.WHITE);
            c12.SetTextAlignment(TextAlignment.CENTER);
            c12.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            // c12.SetFontSize(9);
            c12.SetBorder(Border.NO_BORDER);
            c12.SetBold();

            Cell c13 = new();
            c13.Add(new Paragraph("PLAZO"));
            c13.SetBackgroundColor(ColorConstants.WHITE);
            c13.SetTextAlignment(TextAlignment.CENTER);
            c13.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            // c13.SetFontSize(9);
            c13.SetBorder(Border.NO_BORDER);
            c13.SetBold();

            Cell c14 = new();
            c14.Add(new Paragraph("IMPORTE"));
            c14.SetBackgroundColor(ColorConstants.WHITE);
            c14.SetTextAlignment(TextAlignment.CENTER);
            c14.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            // c14.SetFontSize(9);
            c14.SetBorder(Border.NO_BORDER);
            c14.SetBold();

            tableDet.AddCell(c12);
            tableDet.AddCell(c13);
            tableDet.AddCell(c14);

            var c = 0;

            decimal totImporte = 0;
            /***************************************************/
            if (MovimientosDetalle.Count > 25)
            {
                table.SetFontSize(2);
                tableSld.SetFontSize(2);
                tableDet.SetFontSize(2);
                tableSec.SetFontSize(2);
                tableSec.SetMarginTop(20);

                for (var k = 0; k < MovimientosDetalle.Count; k++)
                {
                    totImporte += MovimientosDetalle[k].Importe.Value;
                    //Console.WriteLine(totImporte);
                }

                for (var i = 0; i < 26; i++)
                {
                    // Console.WriteLine(i);
                    // Console.WriteLine(MovimientosDetalle[i].Capital);
                    Cell cd1 = new();
                    cd1.Add(new Paragraph(MovimientosDetalle[i].CreditoID.ToString()));
                    cd1.SetBackgroundColor(ColorConstants.WHITE);
                    cd1.SetBorder(Border.NO_BORDER);
                    cd1.SetTextAlignment(TextAlignment.CENTER);

                    Cell cd2 = new();
                    cd2.Add(new Paragraph(MovimientosDetalle[i].NoPago.ToString()));
                    cd2.SetBackgroundColor(ColorConstants.WHITE);
                    cd2.SetBorder(Border.NO_BORDER);
                    cd2.SetTextAlignment(TextAlignment.CENTER);

                    Cell cd3 = new();
                    cd3.Add(new Paragraph(Funciones.Truncate((decimal)MovimientosDetalle[i].Importe, 2).ToString()));
                    cd3.SetBackgroundColor(ColorConstants.WHITE);
                    cd3.SetBorder(Border.NO_BORDER);
                    cd3.SetTextAlignment(TextAlignment.CENTER);

                    tableDet.AddCell(cd1);
                    tableDet.AddCell(cd2);
                    tableDet.AddCell(cd3);

                }


                for (var j = 26; j < MovimientosDetalle.Count; j++)
                {
                    // table.SetFontSize(fontSize);
                    // tableSld.SetFontSize(fontSize);
                    // tableDet.SetFontSize(fontSize);

                    Cell cd6 = new();
                    cd6.Add(new Paragraph(MovimientosDetalle[j].CreditoID.ToString()));
                    cd6.SetBackgroundColor(ColorConstants.WHITE);
                    cd6.SetBorder(Border.NO_BORDER);
                    cd6.SetTextAlignment(TextAlignment.CENTER);

                    Cell cd7 = new();
                    cd7.Add(new Paragraph(MovimientosDetalle[j].NoPago.ToString()));
                    cd7.SetBackgroundColor(ColorConstants.WHITE);
                    cd7.SetBorder(Border.NO_BORDER);
                    cd7.SetTextAlignment(TextAlignment.CENTER);

                    Cell cd8 = new();
                    cd8.Add(new Paragraph(Funciones.Truncate((decimal)MovimientosDetalle[j].Importe, 2).ToString()));
                    cd8.SetBackgroundColor(ColorConstants.WHITE);
                    cd8.SetBorder(Border.NO_BORDER);
                    cd8.SetTextAlignment(TextAlignment.CENTER);

                    tableSec.AddCell(cd6);
                    tableSec.AddCell(cd7);
                    tableSec.AddCell(cd8);

                }

                tableDet.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                tableDet.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                //      doc.Add(tableDet);

                Cell cd4 = new(1, 3);
                cd4.Add(new Paragraph(Funciones.Truncate((decimal)totImporte, 2).ToString()));
                cd4.SetBorder(Border.NO_BORDER);
                cd4.SetBold();

                tableDet.AddCell(cd4);

                Cell c15 = new(1, 3);
                c15.Add(tableDet);
                c15.SetBorder(Border.NO_BORDER);

                // table.AddCell(c15);
                //doc.Add(table);

                tableSec.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                tableSec.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                // doc.Add(tableSec);

                // Cell cd5 = new(1, 3);
                // cd5.Add(new Paragraph(Funciones.Truncate((decimal)totImporte, 2).ToString()));
                // cd5.SetBorder(Border.NO_BORDER);
                // cd5.SetBold();

                // tableSec.AddCell(cd5);

                Cell c16 = new(1, 3);
                c16.Add(tableSec);
                c16.SetBorder(Border.NO_BORDER);

                table.AddCell(c15);
                table.AddCell(c16);
                doc.Add(table);

            }

            /**************************************************/
            else
            {
                foreach (var Detalle in MovimientosDetalle)
                {
                    c++;

                    totImporte += Detalle.Importe.Value;

                    if (MovimientosDetalle.Count > 6 && MovimientosDetalle.Count < 25)
                    {
                        float Diference = (MovimientosDetalle.Count - 6);
                        var DIFFERV = (Diference) * (FontRange - ((Diference * 2) / 100f));
                        if (DIFFERV > rangeDiff)
                        {
                            DIFFERV = rangeDiff;
                        }
                        table.SetFontSize(fontSize - DIFFERV);
                        tableSld.SetFontSize(fontSize - DIFFERV);
                        tableDet.SetFontSize(fontSize - DIFFERV);
                    }

                    else
                    {
                        table.SetFontSize(fontSize);
                        tableSld.SetFontSize(fontSize);
                        tableDet.SetFontSize(fontSize);
                    }


                    Cell cd1 = new();
                    cd1.Add(new Paragraph(Detalle.CreditoID.ToString()));
                    cd1.SetBackgroundColor(ColorConstants.WHITE);
                    cd1.SetBorder(Border.NO_BORDER);
                    cd1.SetTextAlignment(TextAlignment.CENTER);

                    Cell cd2 = new();
                    cd2.Add(new Paragraph(Detalle.NoPago.ToString()));
                    cd2.SetBackgroundColor(ColorConstants.WHITE);
                    cd2.SetBorder(Border.NO_BORDER);
                    cd2.SetTextAlignment(TextAlignment.CENTER);

                    Cell cd3 = new();
                    cd3.Add(new Paragraph(Funciones.Truncate((decimal)Detalle.Importe, 2).ToString()));
                    cd3.SetBackgroundColor(ColorConstants.WHITE);
                    cd3.SetBorder(Border.NO_BORDER);
                    cd3.SetTextAlignment(TextAlignment.CENTER);

                    tableDet.AddCell(cd1);
                    tableDet.AddCell(cd2);
                    tableDet.AddCell(cd3);
                }

                tableDet.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                tableDet.AddCell(new Cell().SetBorder(Border.NO_BORDER));

                Cell cd4 = new(1, 3);
                cd4.Add(new Paragraph(Funciones.Truncate((decimal)totImporte, 2).ToString()));
                cd4.SetBorder(Border.NO_BORDER);
                cd4.SetBold();

                tableDet.AddCell(cd4);

                Cell c15 = new(1, 3);
                c15.Add(tableDet);
                c15.SetBorder(Border.NO_BORDER);

                table.AddCell(c15);

                Cell cs1 = new();
                cs1.Add(new Paragraph("SALDO"));
                cs1.SetBackgroundColor(ColorConstants.WHITE);
                cs1.SetTextAlignment(TextAlignment.CENTER);
                cs1.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                // cs1.SetFontSize(9);
                cs1.SetBorder(Border.NO_BORDER);
                cs1.SetBold();

                Cell cs2 = new();
                cs2.Add(new Paragraph("ATR"));
                cs2.SetBackgroundColor(ColorConstants.WHITE);
                cs2.SetTextAlignment(TextAlignment.CENTER);
                cs2.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                // cs2.SetFontSize(9);
                cs2.SetBorder(Border.NO_BORDER);
                cs2.SetBold();

                Cell cs3 = new();
                cs3.Add(new Paragraph("SALDO ATR"));
                cs3.SetBackgroundColor(ColorConstants.WHITE);
                cs3.SetTextAlignment(TextAlignment.CENTER);
                cs3.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                // cs3.SetFontSize(9);
                cs3.SetBorder(Border.NO_BORDER);
                cs3.SetBold();

                Cell cs4 = new();
                cs4.Add(new Paragraph("PROX PAG"));
                cs4.SetBackgroundColor(ColorConstants.WHITE);
                cs4.SetTextAlignment(TextAlignment.CENTER);
                cs4.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                // cs4.SetFontSize(9);
                cs4.SetBorder(Border.NO_BORDER);
                cs4.SetBold();

                Cell cs5 = new();
                cs5.Add(new Paragraph("0"));
                cs5.SetBackgroundColor(ColorConstants.WHITE);
                cs5.SetTextAlignment(TextAlignment.JUSTIFIED_ALL);
                cs5.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                // cs5.SetFontSize(9);
                cs5.SetBorder(Border.NO_BORDER);
                //cs5.SetBold();

                Cell cs6 = new();
                cs6.Add(new Paragraph("0"));
                cs6.SetBackgroundColor(ColorConstants.WHITE);
                cs6.SetTextAlignment(TextAlignment.CENTER);
                cs6.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                // cs6.SetFontSize(9);
                cs6.SetBorder(Border.NO_BORDER);
                //cs6.SetBold();

                Cell cs7 = new();
                cs7.Add(new Paragraph("0"));
                cs7.SetBackgroundColor(ColorConstants.WHITE);
                cs7.SetTextAlignment(TextAlignment.CENTER);
                cs7.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                // cs7.SetFontSize(9);
                cs7.SetBorder(Border.NO_BORDER);
                //cs7.SetBold();

                Cell cs8 = new();
                cs8.Add(new Paragraph(""));
                cs8.SetBackgroundColor(ColorConstants.WHITE);
                cs8.SetTextAlignment(TextAlignment.CENTER);
                cs8.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                // cs8.SetFontSize(9);
                cs8.SetBorder(Border.NO_BORDER);
                //cs8.SetBold();

                tableSld.AddCell(cs1);
                tableSld.AddCell(cs2);
                tableSld.AddCell(cs3);
                tableSld.AddCell(cs4);
                tableSld.AddCell(cs5);
                tableSld.AddCell(cs6);
                tableSld.AddCell(cs7);
                tableSld.AddCell(cs8);

                Cell c16 = new(1, 2);
                c16.SetBorder(Border.NO_BORDER);
                c16.Add(tableSld);

                table.AddCell(c16);

                doc.Add(table);

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
        }
        //private void Recibo(ref Document doc, Movimientos_VW Movimiento)
        //{
        //    LineSeparator ls = new(new SolidLine());
        //    ls.SetMarginLeft(150);
        //    ls.SetMarginRight(150);

        //    //var imageFile = System.IO.Path.Combine(_env.ContentRootPath, "wwwroot/Archivos/LogoBancos", "5a270db16c215158268.png");

        //    //ImageData data = ImageDataFactory.Create(imageFile);

        //    ImageData data = ImageDataFactory.Create(Movimiento.Logo);

        //    Image img = new(data);

        //    img.SetWidth(70);
        //    img.SetHeight(30);

        //    Paragraph salto = new(new Text("\n"));

        //    float[] pointColumnWidths = { 200, 150F, 150F };

        //    Table table = new(pointColumnWidths);

        //    Cell c1 = new();
        //    c1.SetBackgroundColor(ColorConstants.WHITE);
        //    c1.SetBorder(Border.NO_BORDER);
        //    c1.Add(img);
        //    //c1.Add(img.SetAutoScale(true));

        //    Cell c3 = new();
        //    c3.Add(new Paragraph("RECIBO DE PAGO"));
        //    c3.SetBackgroundColor(ColorConstants.WHITE);
        //    c3.SetBorder(Border.NO_BORDER);
        //    c3.SetTextAlignment(TextAlignment.CENTER);
        //    c3.SetVerticalAlignment(VerticalAlignment.MIDDLE);
        //    c3.SetFontSize(12);
        //    c3.SetBold();

        //    float[] pointColumnWidths2 = { 375, 125, 250 };
        //    Table table2 = new(pointColumnWidths2);

        //    Text text1 = new("SOCIA: " + Movimiento.RefApl.ToString() + " - " + Movimiento.NombreCompleto);

        //    Text text2 = new("FOLIO: " + Movimiento.RefApl.ToString() + " - " + Movimiento.MovimientoID.ToString());

        //    Text text3 = new("NOMBRE CAJERA: " + Movimiento.capturo);

        //    Text text4 = new Text("FECHA/HORA: " + Movimiento.FechaAfectacion.ToString("yyyy/MM/dd hh:mm:ss tt"))
        //        .SetBold();

        //    Text text5 = new("IMPORTE RECIBIDO EN EFECTIVO: " + Funciones.Truncate(Movimiento.Importe, 2).ToString("C", CultureInfo.CurrentCulture));

        //    Cell c4 = new();
        //    c4.Add(new Paragraph(text1));
        //    c4.SetBorder(Border.NO_BORDER);
        //    c4.SetFontSize(10);

        //    Cell c5 = new();
        //    c5.Add(new Paragraph(text2));
        //    c5.SetBorder(Border.NO_BORDER);
        //    c5.SetBold();
        //    c5.SetFontSize(9);

        //    Cell c6 = new();
        //    c6.Add(new Paragraph(text3));
        //    c6.SetBorder(Border.NO_BORDER);
        //    c6.SetFontSize(9);

        //    Cell c7 = new();
        //    c7.Add(new Paragraph(text4));
        //    c7.SetBorder(Border.NO_BORDER);
        //    c7.SetBold();
        //    c7.SetFontSize(9);

        //    table.AddCell(c1);
        //    table.AddCell(new Cell().SetBorder(Border.NO_BORDER));
        //    table.AddCell(c3);
        //    table2.AddCell(c4);
        //    table2.AddCell(new Cell().SetBorder(Border.NO_BORDER));
        //    table2.AddCell(c5);
        //    table2.AddCell(c6);
        //    table2.AddCell(new Cell().SetBorder(Border.NO_BORDER));
        //    table2.AddCell(new Cell().SetBorder(Border.NO_BORDER));
        //    table2.AddCell(c7);
        //    //table2.AddCell(c8);
        //    table2.AddCell(new Cell().SetBorder(Border.NO_BORDER));

        //    Paragraph parr0 = new Paragraph(text5)
        //   .SetFontSize(10)
        //   .SetBold()
        //   .SetTextAlignment(TextAlignment.CENTER);

        //    float[] pointColumnWidths3 = { 350, 390 };
        //    Table table3 = new(pointColumnWidths3);

        //    Cell t2c1 = new();
        //    t2c1.Add(new Paragraph(""));
        //    t2c1.SetBorder(Border.NO_BORDER);
        //    t2c1.SetTextAlignment(TextAlignment.CENTER);
        //    t2c1.SetBold();

        //    Cell t2c2 = new();
        //    t2c2.Add(parr0);
        //    t2c2.SetBorder(Border.NO_BORDER);
        //    t2c2.SetTextAlignment(TextAlignment.CENTER);
        //    t2c2.SetBold();

        //    table3.AddCell(t2c1);
        //    table3.AddCell(t2c2);

        //    Paragraph parr1 = new Paragraph("FIRMA Y SELLO DE CAJA")
        //     .SetFontSize(10)
        //     .SetBold()
        //     .SetTextAlignment(TextAlignment.CENTER);

        //    Paragraph parr2 = new Paragraph("ESTE RECIBO NO SERÁ VALIDO SIN LA FIRMA DEL CAJERO Y SELLO DE LA EMPRESA")
        //    .SetFontSize(10)
        //    .SetBold()
        //    .SetTextAlignment(TextAlignment.CENTER);

        //    //AreaBreak aB = new();

        //    //doc.Add(aB);
        //    doc.Add(table);
        //    doc.Add(new Paragraph());
        //    doc.Add(table2);
        //    doc.Add(salto);
        //    //doc.Add(parr0);
        //    doc.Add(table3);
        //    doc.Add(salto);
        //    doc.Add(salto);
        //    doc.Add(salto);
        //    doc.Add(salto);
        //    doc.Add(ls);
        //    doc.Add(parr1);
        //    doc.Add(parr2);
        //    doc.Add(salto);
        //    //doc.Add(salto);
        //    //doc.Add(salto);
        //}

    }
}
