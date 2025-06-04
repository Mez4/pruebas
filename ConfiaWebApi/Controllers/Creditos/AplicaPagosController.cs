using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using Microsoft.AspNetCore.Hosting;
using ConfiaWebApi.ModlesSP.Creditos;
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
using Path = System.IO.Path;
using DBContext.DBConfia.Catalogos;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Seguridad;
using DBContext.DBConfia.Bancos;
using Movimientos_VW = DBContext.DBConfia.Catalogos.Movimientos_VW;
using BMovimientos_VW = DBContext.DBConfia.Bancos.Movimientos_VW;
using BMovimientos_VW2 = DBContext.DBConfia.Bancos.Movimientos_VW;
using System.Collections;
using DBContext.DBConfia.General;
using DBContext.DBConfia.BuroCredito;
using DBContext.DBConfia.Distribuidores;
using DBContext.DBConfia.Tesoreria;
using Newtonsoft.Json;
using DBContext.DBConfia.Aclaraciones;
using System.Collections.Generic;
using System.Dynamic;

namespace ConfiaWebApi.Controllers.Creditos
{
    [Authorize]
    [ApiController]
    [Route("api/Creditos/[controller]")]
    public class AplicaPagosController : ControllerBase
    {
        private DBConfiaContext ConexionBD;

        private readonly IWebHostEnvironment _env;

        public AplicaPagosController(DBConfiaContext _DBContext, IWebHostEnvironment env)
        {
            ConexionBD = _DBContext;
            _env = env;
        }

        [HttpPost]
        [Route("getSaldos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> GetSaldos(PeticionesRest.Creditos.AplicaPagos.Add parData)
        {

            try
            {
                //var userName = HttpContext.User.Claims.Where(x => x.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier").FirstOrDefault().Value;
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                // var UsuarioActual = await DBContext.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
                //var UsuarioActual = await DBContext.database.QueryAsync<USER_ENTITY>("WHERE EMAIL=@0", UserName).FirstOrDefaultAsync();
                //var PersonaActual = await ConexionBD.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.UsuarioID).FirstOrDefaultAsync();
                var Sucursal = await ConexionBD.database.QueryAsync<Distribuidores_VW>("WHERE DistribuidorID = @0", parData.DistribuidorId).FirstOrDefaultAsync();

                parData.SucursalId = Sucursal.SucursalID;
                parData.UsuarioId = UsuarioActual.UsuarioID;
                //parData.PersonaID = PersonaActual.PersonaID;

                //DBContext.database.BeginTransaction();

                string Stored = "EXEC Creditos.pa_SaldosRelacionDistribuidor_Sel @ProductoId, @DistribuidorId, @SucursalId, @CuentaId, @FechaPago, @Importe, @UsuarioId, @CodigoAut, @GenPPI";

                var res = await ConexionBD.database.QueryAsync<AplicaPagoRes>(Stored, parData).FirstOrDefaultAsync();
                res.Abono = res.Importe + res.Dif_Pago;
                await ConexionBD.Destroy();
                //DBContext.database.CloseSharedConnection();

                return Ok(res);

            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        [Route("getSaldosAclaracion")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> GetSaldosAclaracion(PeticionesRest.Creditos.AplicaPagos.AddAclaracion parData)
        {

            try
            {
                //var userName = HttpContext.User.Claims.Where(x => x.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier").FirstOrDefault().Value;
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                // var UsuarioActual = await DBContext.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
                //var UsuarioActual = await DBContext.database.QueryAsync<USER_ENTITY>("WHERE EMAIL=@0", UserName).FirstOrDefaultAsync();
                //var PersonaActual = await ConexionBD.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.UsuarioID).FirstOrDefaultAsync();

                parData.UsuarioId = UsuarioActual.UsuarioID;
                //parData.PersonaID = PersonaActual.PersonaID;

                //DBContext.database.BeginTransaction();

                string Stored = "EXEC Creditos.pa_SaldosRelacionAclaracion_Sel @ProductoId, @DistribuidorId, @SucursalId, @CuentaId, @FechaPago, @Importe, @UsuarioId, @CodigoAut, @GenPPI, @BonificacionID";

                var res = await ConexionBD.database.QueryAsync<AplicaPagoAclaracionRes>(Stored, parData).FirstOrDefaultAsync();
                res.Abono = res.Importe + res.Dif_Pago;
                await ConexionBD.Destroy();
                //DBContext.database.CloseSharedConnection();

                return Ok(res);

            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> Add(PeticionesRest.Creditos.AplicaPagos.Add parData)
        {

            try
            {


                ConexionBD.database.CommandTimeout = 9999;
                //var userName = HttpContext.User.Claims.Where(x => x.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier").FirstOrDefault().Value;

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                // var UsuarioActual = await ConexionBD.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
                // var UsuarioActual = await DBContext.database.QueryAsync<USER_ENTITY>("WHERE EMAIL=@0", UserName).FirstOrDefaultAsync();
                //var PersonaActual = await ConexionBD.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.UsuarioID).FirstOrDefaultAsync();//
                var Sucursal = await ConexionBD.database.QueryAsync<CatalogoCajas>("WHERE CajaID = @0", parData.CajaID).FirstOrDefaultAsync();

                parData.UsuarioId = UsuarioActual.UsuarioID;
                //parData.PersonaID = PersonaActual.PersonaID;

                //DBContext.database.BeginTransaction();
                parData.GenerarCOM = true;
                parData.FechaPago = DateTime.Now;
                parData.GenerarDNI = true;

                var obj = new
                {
                    ProductoId = parData.ProductoId,
                    DistribuidorId = parData.DistribuidorId,
                    SucursalId = Sucursal.SucursalID,
                    CajaID = parData.CajaID,
                    FechaPago = parData.FechaPago,
                    Importe = parData.Importe,
                    UsuarioId = parData.UsuarioId,
                    GenerarDNI = parData.GenerarDNI,
                    CodigoAut = parData.CodigoAut,
                    GenerarCOM = parData.GenerarCOM,
                    GenPPI = parData.GenPPI,
                    EsPagoAtrasado = parData.EsPagoAtrasado
                };

                string Stored = "EXEC Creditos.pa_AplicacionPago_Ins @ProductoId, @DistribuidorId, @SucursalId, @CajaID, @FechaPago, @Importe, @UsuarioId, @GenerarDNI, @CodigoAut, @GenerarCOM, @GenPPI, @EsPagoAtrasado";

                var res = await ConexionBD.database.QueryAsync<AplicaPagoRes>(Stored, obj).FirstOrDefaultAsync(); //parData

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
        [Route("addaclaracion")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> Addaclaracion(PeticionesRest.Creditos.AplicaPagos.AddAclaracion2 parData)
        {

            try
            {
                //var userName = HttpContext.User.Claims.Where(x => x.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier").FirstOrDefault().Value;

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                parData.UsuarioId = UsuarioActual.UsuarioID;
                //parData.PersonaID = PersonaActual.PersonaID;
                //DBContext.database.BeginTransaction();
                parData.GenerarCOM = true;
                parData.GenerarDNI = true;

                var obj = new
                {
                    ProductoId = parData.ProductoId,
                    DistribuidorId = parData.DistribuidorId,
                    SucursalId = parData.SucursalId,
                    CajaID = parData.CajaID,
                    FechaPago = parData.FechaPago,
                    Importe = parData.Importe,
                    UsuarioId = parData.UsuarioId,
                    GenerarDNI = parData.GenerarDNI,
                    CodigoAut = parData.CodigoAut,
                    GenerarCOM = parData.GenerarCOM,
                    PagoOrigen = 3,
                    EsPagoAtrasado = 0,
                    GenPPI = parData.GenPPI,
                    CuentaBancoID = parData.CuentaBancoID,
                    BonificacionID = parData.BonificacionID,
                    Observacion = parData.Observacion,
                    TipoCodigoID = parData.TipoCodigoID,
                    FechaCorte = parData.FechaCorte,
                };

                ConexionBD.database.CommandTimeout = 360;

                string Stored = "EXEC Creditos.pa_AplicacionPagoAclaracion_Ins_Nuevo @ProductoId, @DistribuidorId, @SucursalId, @CajaID, @FechaPago, @Importe, @UsuarioId, @GenerarDNI, @CodigoAut, @GenerarCOM, @PagoOrigen, @GenPPI,@EsPagoAtrasado, @CuentaBancoID, @Observacion, @BonificacionID, @TipoCodigoID, @FechaCorte";
                // string Stored = "EXEC Creditos.pa_AplicacionPagoAclaracion_Ins @ProductoId, @DistribuidorId, @SucursalId, @CajaID, @FechaPago, @Importe, @UsuarioId, @GenerarDNI, @CodigoAut, @GenerarCOM, @GenPPI, @PagoOrigen, @EsPagoAtrasado, @CuentaId, @Observacion";
                var res = await ConexionBD.database.QueryAsync<AplicaPagoRes>(Stored, obj).FirstOrDefaultAsync(); //ParData

                await ConexionBD.Destroy();

                return Ok(res);

            }
            catch (Exception ex)
            {
                //DBContext.database.AbortTransaction();
                await ConexionBD.Destroy();
                //return BadRequest(ex.Message);
                return Ok(new
                {
                    regresa = 0,
                    msj = ex.Message
                });
            }

        }

        [HttpPost]
        [Route("getsucursales")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetSucursales([FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var Cajas = await ConexionBD.database.QueryAsync<CatalogoCajasUsuarios_VW>("WHERE (UsuarioID = @0) AND (ProductoID = @1) AND (Activo = 1)", UsuarioActual.UsuarioID, producto).ToArrayAsync();

                var res = Cajas.OrderBy(x => x.SucursalID).GroupBy(x => x.SucursalID).Select(x => x.First()).ToArray();

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
        [Route("AddPagoTicket")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> AddPagoTicket(PeticionesRest.Creditos.AplicaPagos.AddTicket parData)
        {

            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();


                parData.UsuarioId = UsuarioActual.UsuarioID;

                //DBContext.database.BeginTransaction();
                parData.GenPPI = false;
                parData.GenerarCOM = true;
                parData.EsPagoAtrasado = false;
                parData.GenerarDNI = true;
                parData.PagoOrigen = 3;
                parData.CuentaId = 0;
                parData.Observacion = parData.Observacion ?? null;
                parData.TicketsJSON = JsonConvert.SerializeObject(parData.MovimientoIDs);
                string Stored = "EXEC Creditos.pa_AplicacionPagoAclaracionTickets_Ins @ProductoId, @DistribuidorId, @SucursalId, @CajaID, @FechaPago, @Importe, @UsuarioId, @GenerarDNI, @GenerarCOM, @GenPPI, @PagoOrigen, @EsPagoAtrasado, @CuentaBancoID, @Observacion, @TicketsJSON";

                var res = await ConexionBD.database.QueryAsync<AplicaPagosTicketRes>(Stored, parData).FirstOrDefaultAsync();

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
        [Route("addpagodni")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> AddPagoDNI(PeticionesRest.Creditos.AplicaPagos.AddDNI parData)
        {

            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();


                parData.UsuarioId = UsuarioActual.UsuarioID;
                ConexionBD.database.CommandTimeout = 99999;

                //DBContext.database.BeginTransaction();
                parData.GenPPI = false;
                parData.GenerarCOM = true;
                parData.EsPagoAtrasado = false;
                parData.PagoOrigen = 3;
                parData.CuentaId = parData.CuentaBancoID;
                parData.Observacion = parData.Observacion ?? null;
                parData.DnisJSON = JsonConvert.SerializeObject(parData.MovimientoIDs);
                string Stored = "EXEC Creditos.pa_AplicacionPagoAclaracionDNI_Ins @ProductoId, @DistribuidorId, @SucursalId, @CajaID, @FechaPago, @Importe, @UsuarioId, @GenerarDNI, @GenerarCOM, @GenPPI, @PagoOrigen, @EsPagoAtrasado, @CuentaId, @Observacion, @DnisJSON";

                var res = await ConexionBD.database.QueryAsync<AplicaPagosDNIRes>(Stored, parData).FirstOrDefaultAsync();

                // if (res.regresa == 1)
                // {
                //     foreach (var MovimientoID in parData.MovimientoIDs)
                //     {
                //         var Movimiento = await ConexionBD.database.SingleByIdAsync<Movimientos>(MovimientoID);
                //         Movimiento.Estatus = "A";
                //         Movimiento.FechaAfectacion = DateTime.Now;
                //         Movimiento.CatEstatusMovID = 1;
                //         Movimiento.bitAplicado = true;
                //         Movimiento.AplicacionAfecta = int.Parse(res.AplicacionID);
                //         await ConexionBD.database.UpdateAsync(Movimiento);
                //     }
                //     //    DBContext.database.AbortTransaction();
                // }
                // return BadRequest("servicio no disponible");

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
                Console.WriteLine("DNI" + parData.dni);
                var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");

                string dest = Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf"));

                //MemoryStream ms = new();

                PdfWriter pw = new(dest);

                PdfDocument pdfDocument = new(pw);



                Document doc = new(pdfDocument, PageSize.LETTER);

                doc.SetMargins(40, 55, 40, 55);

                //var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                //var UsuarioActual = await DBContext.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
                //var PersonaActual = await DBContext.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.ID).FirstOrDefaultAsync();

                //LogImpresionDocumentos LogImpresion;
                //LogImpresion = new LogImpresionDocumentos() { UsuarioId = UsuarioActual.ID, PersonaId = PersonaActual.PersonaID, Fecha = DateTime.Now, CreditoID = Credito.CreditoID, TipoDocumentoId = 1 };
                //await DBContext.database.InsertAsync(LogImpresion);

                var Movimiento = await ConexionBD.database.QueryAsync<Movimientos_VW>("WHERE MovimientoID = @MovimientoID", parData).FirstOrDefaultAsync();

                var Aplicacion2 = await ConexionBD.database.QueryAsync<Aplicaciones_VW>("WHERE MovimientoidPago = @MovimientoID", parData).FirstOrDefaultAsync();


                var DscDistribuidor = await ConexionBD.database.QueryAsync<VariablesGlobales>("WHERE (varName = @0)", "DESCRIPCION_DISTRIBUIDOR").FirstOrDefaultAsync();

                //PdfPage pdfPage = pdfDocument.AddNewPage();

                //PdfCanvas canvas = new(pdfPage);

                //canvas.Rectangle(30, 40, 550, 720);

                //canvas.Stroke();

                var Producto = await ConexionBD.database.SingleByIdAsync<Productos>(Movimiento.ProductoId);

                var logo = Producto.Logo;

                Recibo(ref doc, pdfDocument, Movimiento, Aplicacion2, parData.dni, DscDistribuidor.varValue.ToString(), logo);

                Paragraph salto = new(new Text("\n"));

                doc.Add(salto);

                LineSeparator ls = new(new SolidLine());
                doc.Add(ls);

                Recibo(ref doc, pdfDocument, Movimiento, Aplicacion2, parData.dni, DscDistribuidor.varValue.ToString(), logo);

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

        private void Recibo(ref Document doc, PdfDocument pdfDoc, Movimientos_VW Movimiento, Aplicaciones_VW Aplicacion2, decimal dni, string DscDistribuidor, byte[] Logo)
        {

            LineSeparator ls = new(new SolidLine());
            ls.SetMarginLeft(150);
            ls.SetMarginRight(150);

            //var imageFile = System.IO.Path.Combine(_env.ContentRootPath, "wwwroot/Archivos/LogoBancos", "5a270db16c215158268.png");

            //ImageData data = ImageDataFactory.Create(imageFile);

            ImageData data = ImageDataFactory.Create(Movimiento.Logo);

            Image img = new(data);

            img.SetWidth(70);
            img.SetHeight(30);

            Paragraph salto = new(new Text("\n"));

            float[] pointColumnWidths = { 200, 150F, 150F };

            Table table = new(pointColumnWidths);

            Cell c1 = new();
            c1.SetBackgroundColor(ColorConstants.WHITE);
            c1.SetBorder(Border.NO_BORDER);
            c1.Add(img);
            //c1.Add(img.SetAutoScale(true));

            Cell c3 = new();
            c3.Add(new Paragraph("RECIBO DE PAGO"));
            c3.SetBackgroundColor(ColorConstants.WHITE);
            c3.SetBorder(Border.NO_BORDER);
            c3.SetTextAlignment(TextAlignment.CENTER);
            c3.SetVerticalAlignment(VerticalAlignment.MIDDLE);
            c3.SetFontSize(12);
            c3.SetBold();


            float[] pointColumnWidths2 = { 375, 125, 250 };
            Table table2 = new(pointColumnWidths2);

            Text text1 = new(DscDistribuidor.ToUpper() + Movimiento.RefApl.ToString() + " - " + Movimiento.NombreCompleto);

            Text text2 = new("FOLIO: " + Movimiento.RefApl.ToString() + " - " + Movimiento.MovimientoID.ToString());

            Text text3 = new("NOMBRE CAJERA: " + Movimiento.capturo);

            Text text4 = new Text("FECHA/HORA: " + Movimiento.FechaAfectacion?.ToString("yyyy/MM/dd hh:mm:ss tt"))
                .SetBold();

            Text text5 = new("IMPORTE RECIBIDO EN EFECTIVO: " + Aplicacion2.Pago?.ToString("C", CultureInfo.CurrentCulture));

            Cell c4 = new();
            c4.Add(new Paragraph(text1));
            c4.SetBorder(Border.NO_BORDER);
            c4.SetFontSize(10);

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

            table.AddCell(c1);
            table.AddCell(new Cell().SetBorder(Border.NO_BORDER));
            table.AddCell(c3);
            table2.AddCell(c4);
            table2.AddCell(new Cell().SetBorder(Border.NO_BORDER));
            table2.AddCell(c5);
            table2.AddCell(c6);
            table2.AddCell(new Cell().SetBorder(Border.NO_BORDER));
            table2.AddCell(new Cell().SetBorder(Border.NO_BORDER));
            table2.AddCell(c7);
            //table2.AddCell(c8);
            table2.AddCell(new Cell().SetBorder(Border.NO_BORDER));

            Paragraph parr0 = new Paragraph(text5)
           .SetFontSize(10)
           .SetBold()
           .SetTextAlignment(TextAlignment.CENTER);

            float[] pointColumnWidths3 = { 350, 390 };
            Table table3 = new(pointColumnWidths3);

            Cell t2c1 = new();
            t2c1.Add(new Paragraph(""));
            t2c1.SetBorder(Border.NO_BORDER);
            t2c1.SetTextAlignment(TextAlignment.CENTER);
            t2c1.SetBold();

            Cell t2c2 = new();
            t2c2.Add(parr0);
            t2c2.SetBorder(Border.NO_BORDER);
            t2c2.SetTextAlignment(TextAlignment.CENTER);
            t2c2.SetBold();

            table3.AddCell(t2c1);
            table3.AddCell(t2c2);

            Paragraph parr1 = new Paragraph("FIRMA Y SELLO DE CAJA")
             .SetFontSize(10)
             .SetBold()
             .SetTextAlignment(TextAlignment.CENTER);

            Paragraph parr2 = new Paragraph("ESTE RECIBO NO SERÁ VALIDO SIN LA FIRMA DEL CAJERO Y SELLO DE LA EMPRESA")
            .SetFontSize(10)
            .SetBold()
            .SetTextAlignment(TextAlignment.CENTER);

            //AreaBreak aB = new();

            //doc.Add(aB);
            doc.Add(table);
            doc.Add(new Paragraph());
            doc.Add(table2);
            doc.Add(salto);
            //doc.Add(parr0);
            doc.Add(table3);
            doc.Add(salto);
            doc.Add(salto);
            doc.Add(salto);
            doc.Add(salto);
            doc.Add(ls);
            doc.Add(parr1);
            doc.Add(parr2);
            doc.Add(salto);
            //doc.Add(salto);
            //doc.Add(salto);

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

        [HttpPost]
        [Route("getAplicaciones")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetAplicaciones(PeticionesRest.Creditos.AplicaPagos.GetAplicacion parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            parData.ProductoID = producto;

            //var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            //var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            //parData.UsuarioID = UsuarioActual.UsuarioID;

            try
            {
                var res = await ConexionBD.database.FetchAsync<Aplicaciones_VW>("WHERE  (ProductoID = @ProductoID) AND " +
                    " (ClienteID = @ClienteID OR @ClienteID = 0) AND " +
                    " (SucursalID = @SucursalID OR @SucursalID = 0) AND " +
                    " (DistribuidorID = @DistribuidorID OR @DistribuidorID = 0) AND " +
                    " ((FechaAplicacion >= @FechaInicio OR @FechaInicio IS NULL) AND " +
                    " (FechaAplicacion <= @FechaFin OR @FechaFin IS NULL)) AND " +
                    " (Activo = @Activo)", parData);

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
        [Route("getAplicacionesDNI")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetAplicacionesDNI(PeticionesRest.Creditos.AplicaPagos.GetAplicacionDNI parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            parData.ProductoID = producto;
            try
            {
                var query = @"SELECT * FROM Bancos.Movimientos_VW mv
                JOIN Distribuidores.Distribuidores d ON  mv.RefApl = d.DistribuidorID 
                WHERE (mv.TipoMovimientoID = 19) 
                AND (SucursalID = @SucursalID OR @SucursalID = 0) 
                AND (RefApl = @DistribuidorID OR @DistribuidorID = 0) 
                AND ((FechaAfectacion >= @FechaInicio OR @FechaInicio IS NULL) 
                AND (FechaAfectacion <= @FechaFin OR @FechaFin IS NULL)) 
                AND (CatEstatusMovID = @EstatusMovimiento OR @EstatusMovimiento = 0)";
                var res = await ConexionBD.database.FetchAsync<BMovimientos_VW>(query, parData);
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
        [Route("GetAdministraTickets")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetAdministraTickets(PeticionesRest.Creditos.AplicaPagos.GetAdministraTickets parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            parData.ProductoID = producto;
            try
            {
                string Stored = "EXEC Bancos.pa_GetTickets @GestorID, @ProductoID";

                var res = await ConexionBD.database.FetchAsync<dynamic>(Stored, parData);
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
        [Route("getAplicacionesCanalesPago")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetAplicacioneCanalesPago(PeticionesRest.Creditos.AplicaPagos.GetAplicacionCanalesPago parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            parData.ProductoID = producto;
            try
            {
                parData.FechaInicio = parData.FechaInicio.AddHours(-6);
                parData.FechaFin = parData.FechaFin.AddHours(-6);
                string Stored = "EXEC Creditos.pa_AplicacionesCanalesPago_Sel @ProductoID, @DistribuidorID, @FechaInicio, @FechaFin, @SucursalID, @CanalPago";
                var res = await ConexionBD.database.QueryAsync<AplicaPagosCanalesPagRes>(Stored, parData).ToArrayAsync();
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
        [Route("CancelarTicket")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> CancelarTicket(PeticionesRest.Creditos.AplicaPagos.ModificarTicket parData)
        {

            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                
                parData.UsuarioId = UsuarioActual.UsuarioID;
                parData.Cancelacion = true;

                string Stored = "EXEC Creditos.pa_ModificarTicket @MovimientoID, @UsuarioId, @MotivoCancelacion, @Cancelacion";

                var res = await ConexionBD.database.QueryAsync<dynamic>(Stored, parData).FirstOrDefaultAsync();

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
        [Route("AplicarTicket")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> AplicarTicket(PeticionesRest.Creditos.AplicaPagos.ModificarTicket parData)
        {

            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                
                parData.UsuarioId = UsuarioActual.UsuarioID;
                parData.Cancelacion = false;
                
                string Stored = "EXEC Creditos.pa_ModificarTicket @MovimientoID, @UsuarioId, @MotivoCancelacion, @Cancelacion";

                var res = await ConexionBD.database.QueryAsync<dynamic>(Stored, parData).FirstOrDefaultAsync();

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
        [Route("getAplicacionesDistribuidor")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetAplicacionesDistribuidor(PeticionesRest.Creditos.AplicaPagos.GetAplicacion parData)
        {
            try
            {
                int ProductoID = 9999;
                int.TryParse(Request.Headers["ProductoID"], out ProductoID);

                var obj = new
                {
                    ProductoID = ProductoID,
                    DistribuidorID = parData.DistribuidorID
                };
                var res = await ConexionBD.database.QueryAsync<Aplicaciones_VW>("WHERE " +
                    " (DistribuidorID = @DistribuidorID) AND (ProductoID = @ProductoID )", obj).ToArrayAsync();

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
        [Route("getAbonos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetAbonos(PeticionesRest.Creditos.AplicaPagos.GetAbonos parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                var res = await ConexionBD.database.FetchAsync<Abonos_VW>("WHERE (AplicacionID = @AplicacionID)", parData);
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                // return NotFound(ex.Message);
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("desaplicapago")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> DesaplicaPago(PeticionesRest.Creditos.AplicaPagos.Desaplica parData, [FromHeader(Name = "ProductoID")] int producto)
        {

            try
            {
                //var userName = HttpContext.User.Claims.Where(x => x.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier").FirstOrDefault().Value;

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                parData.UsuarioId = UsuarioActual.UsuarioID;
                //parData.PersonaID = PersonaActual.PersonaID;

                string Stored = "EXEC Creditos.pa_DesaplicarPagos_Ins @AplicacionID, @UsuarioId, @MotivoCancelacion";

                var res = await ConexionBD.database.QueryAsync<DesaplicaPagoRes>(Stored, parData).FirstOrDefaultAsync();

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
        [Route("desaplicaDNI")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> DesaplicaDNI(PeticionesRest.Creditos.AplicaPagos.DesaplicaDNI parData, [FromHeader(Name = "ProductoID")] int producto)
        {

            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                
                parData.UsuarioId = UsuarioActual.UsuarioID;

                string Stored = "EXEC Creditos.pa_DesaplicarDNI_Ins @MovimientoID, @UsuarioId, @MotivoCancelacion";

                var res = await ConexionBD.database.QueryAsync<dynamic>(Stored, parData).FirstOrDefaultAsync();


                // var Movimiento = await ConexionBD.database.SingleByIdAsync<Movimientos>(parData.MovimientoID);
                // Movimiento.Estatus = "C";
                // Movimiento.CatEstatusMovID = 2;
                // Movimiento.cancelacionUsuario = UsuarioActual.UsuarioID;
                // Movimiento.cancelacionFhRegistro = DateTime.Now;
                // Movimiento.cancelacionTipMovimiento = 19;
                // Movimiento.cancelacionObservacion = parData.MotivoCancelacion;
                // var res = await ConexionBD.database.UpdateAsync(Movimiento);

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
        [Route("getTickets")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getTickets(PeticionesRest.Creditos.AplicaPagos.GetTickets parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                var Movimientos = await ConexionBD.database.QueryAsync<BMovimientos_VW2>("EXEC Bancos.pa_GetTicketAplicaciones @0, @1", parData.DistribuidorId, 0).ToArrayAsync();

                var newMovs = Movimientos.Select(mov =>
                {
                    dynamic obj = new ExpandoObject();
                    foreach (var prop in mov.GetType().GetProperties())
                        ((IDictionary<string, object>)obj)[prop.Name] = prop.GetValue(mov);

                    obj.FechaAfectacion = mov.FechaAfectacion != null ? mov.FechaAfectacion?.ToString("dd/MM/yyyy") : "N/A";
                    obj.FechaCaptura = mov.FechaCaptura.ToString("dd/MM/yyyy");
                    obj.Color = mov.CatEstatusMovID switch
                    {
                        1 => "Green",
                        2 => "Red",
                        3 => "Orange",
                        _ => "Gray"
                    };
                    return obj;
                });

                await ConexionBD.Destroy();
                return Ok(newMovs);
            }
            catch (Exception ex)
            {
                // return NotFound(ex.Message);
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("getDNIs")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getDNIs(PeticionesRest.Creditos.AplicaPagos.GetDNI parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                var variale = await ConexionBD.database.QueryAsync<VariablesGlobales>("WHERE  (varName = @0)", "COD_TIPO_MOV_DNI").FirstOrDefaultAsync();

                parData.TipoMovimientoID = int.Parse(variale.varValue.ToString());

                ArrayList res = new();

                var Movimientos = await ConexionBD.database.FetchAsync<BMovimientos_VW>("WHERE (RefApl = @DistribuidorId OR @DistribuidorId = 0) AND (TipoMovimientoID = @TipoMovimientoID) AND ((CatEstatusMovID = (1) AND bitAplicado = 0) OR (CatEstatusMovID = 4 OR bitAplicadoResto = 0))", parData);

                foreach (var Movimiento in Movimientos)
                {
                    res.Add(new
                    {
                        Movimiento.MovimientoID,
                        Movimiento.CuentaID,
                        Movimiento.SucursalId,
                        Movimiento.CuentaDestinoID,
                        FechaAfectacion = Movimiento.FechaAfectacion?.ToString("dd/MM/yyyy"),
                        FechaCaptura = Movimiento.FechaCaptura.ToString("dd/MM/yyyy"),
                        Movimiento.Importe,
                        Movimiento.Observaciones,
                        Movimiento.TipoMovimientoID,
                        Movimiento.ProductoId,
                        Movimiento.RefApl,
                        Movimiento.gastoSucursal,
                        Movimiento.movimientoIdTraspaso,
                        Movimiento.cancelacionObservacion,
                        Movimiento.cancelacionUsuario,
                        Movimiento.cancelacionImporte,
                        Movimiento.cancelacionFhRegistro,
                        Movimiento.cancelacionTipMovimiento,
                        Movimiento.PolizaId,
                        Movimiento.Estatus,
                        Movimiento.Contabilizado,
                        Movimiento.CajaId,
                        Movimiento.PersonaIDRegistro,
                        Movimiento.PeriodoID,
                        Movimiento.ObservacionesUsuario,
                        Movimiento.CatEstatusMovID,
                        Movimiento.FechaCancelacion,
                        Movimiento.UsuarioIDRegistra,
                        Movimiento.MovimientoBoveda,
                        Movimiento.TipoMovimiento,
                        Movimiento.EstDsc,
                        Movimiento.Distribuidor,
                        Movimiento.DistribuidorID,
                        Movimiento.restoDNI,
                        Movimiento.bitAplicado,
                        Movimiento.bitAplicadoResto,
                        ColorEst = Movimiento.CatEstatusMovID switch
                        {
                            1 => "Green",
                            2 => "Red",
                            4 => "Orange",
                            _ => "Gray"
                        }
                    });
                }

                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                // return NotFound(ex.Message);
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("getClienteTickets")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getClienteTickets(PeticionesRest.Creditos.AplicaPagos.GetClienteTicket parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                var Movimientos = await ConexionBD.database.QueryAsync<BMovimientos_VW>("EXEC Bancos.pa_GetTicketAplicaciones @0, @1", 0, parData.ClienteID).ToArrayAsync();

                var newMovs = Movimientos.Select(mov =>
                {
                    dynamic obj = new ExpandoObject();
                    foreach (var prop in mov.GetType().GetProperties())
                        ((IDictionary<string, object>)obj)[prop.Name] = prop.GetValue(mov);

                    obj.FechaAfectacion = mov.FechaAfectacion != null ? mov.FechaAfectacion?.ToString("dd/MM/yyyy") : "N/A";
                    obj.FechaCaptura = mov.FechaCaptura.ToString("dd/MM/yyyy");
                    obj.Color = mov.CatEstatusMovID switch
                    {
                        1 => "Green",
                        2 => "Red",
                        3 => "Orange",
                        _ => "Gray"
                    };
                    return obj;
                });

                await ConexionBD.Destroy();
                return Ok(newMovs);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("getClienteDNIs")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getClienteDNIs(PeticionesRest.Creditos.AplicaPagos.GetClienteDNI parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                var variale = await ConexionBD.database.QueryAsync<VariablesGlobales>("WHERE  (varName = @0)", "COD_TIPO_MOV_DNI").FirstOrDefaultAsync();

                parData.TipoMovimientoID = int.Parse(variale.varValue.ToString());

                ArrayList res = new();

                var Movimientos = await ConexionBD.database.FetchAsync<BMovimientos_VW>("WHERE (RefApl = @ClienteID OR @ClienteID = 0) AND (TipoMovimientoID = @TipoMovimientoID) AND ((CatEstatusMovID = (1) AND bitAplicado = 0) OR (CatEstatusMovID = 4 OR bitAplicadoResto = 0))", parData);

                foreach (var Movimiento in Movimientos)
                {
                    res.Add(new
                    {
                        Movimiento.MovimientoID,
                        Movimiento.CuentaID,
                        Movimiento.SucursalId,
                        Movimiento.CuentaDestinoID,
                        FechaAfectacion = Movimiento.FechaAfectacion?.ToString("dd/MM/yyyy"),
                        FechaCaptura = Movimiento.FechaCaptura.ToString("dd/MM/yyyy"),
                        Movimiento.Importe,
                        Movimiento.Observaciones,
                        Movimiento.TipoMovimientoID,
                        Movimiento.ProductoId,
                        Movimiento.RefApl,
                        Movimiento.gastoSucursal,
                        Movimiento.movimientoIdTraspaso,
                        Movimiento.cancelacionObservacion,
                        Movimiento.cancelacionUsuario,
                        Movimiento.cancelacionImporte,
                        Movimiento.cancelacionFhRegistro,
                        Movimiento.cancelacionTipMovimiento,
                        Movimiento.PolizaId,
                        Movimiento.Estatus,
                        Movimiento.Contabilizado,
                        Movimiento.CajaId,
                        Movimiento.PersonaIDRegistro,
                        Movimiento.PeriodoID,
                        Movimiento.ObservacionesUsuario,
                        Movimiento.CatEstatusMovID,
                        Movimiento.FechaCancelacion,
                        Movimiento.UsuarioIDRegistra,
                        Movimiento.MovimientoBoveda,
                        Movimiento.TipoMovimiento,
                        Movimiento.EstDsc,
                        Movimiento.Distribuidor,
                        Movimiento.DistribuidorID,
                        Movimiento.restoDNI,
                        Movimiento.bitAplicado,
                        Movimiento.bitAplicadoResto,
                        ColorEst = Movimiento.CatEstatusMovID switch
                        {
                            1 => "Green",
                            2 => "Red",
                            4 => "Orange",
                            _ => "Gray"
                        }
                    });
                }

                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                // return NotFound(ex.Message);
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("ValidaBoletosEstelares")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> ValidaBoletosEstelares(PeticionesRest.Creditos.AplicaPagos.Valida parData)
        {

            try
            {
                var obj = new
                {
                    DistribuidorID = parData.DistribuidorID,
                    RangoAsignado = ""
                };

                string Stored = "EXEC Raspadito.ValidarBoletosEstelares @DistribuidorID, @RangoAsignado";

                var res = await ConexionBD.database.QueryAsync<ValidaBoletosEstelares>(Stored, obj).FirstOrDefaultAsync(); //parData

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
        [Route("VerificaBoletosEstelares")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> VerificaBoletosEstelares(PeticionesRest.Creditos.AplicaPagos.Verifica parData)
        {

            try
            {
                var obj = new
                {
                    DistribuidorID = parData.DistribuidorID,
                    FolioInterno = parData.Folio,
                    MontoGanado = 0
                };

                string Stored = "EXEC Raspadito.ValidaRecompensaBoleto @DistribuidorID, @FolioInterno, @MontoGanado";

                var res = await ConexionBD.database.QueryAsync<VerificaBoletosEstelares>(Stored, obj).FirstOrDefaultAsync(); //parData

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
        [Route("CanjeaBoletosEstelares")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> CanjeaBoletosEstelares(PeticionesRest.Creditos.AplicaPagos.Canjea parData)
        {

            try
            {
                int ProductoID = 9999;
                int.TryParse(Request.Headers["ProductoID"], out ProductoID);

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var obj = new
                {
                    DistribuidorID = parData.DistribuidorID,
                    FolioInterno = parData.Folio,
                    Monto = parData.Monto,
                    ProductoID = ProductoID,
                    UsuarioID = UsuarioActual.UsuarioID,
                    PersonaIDRegistra = UsuarioActual.PersonaID
                };

                string Stored = "EXEC Raspadito.CanjeaBoletos @DistribuidorID, @FolioInterno, @Monto, @ProductoID, @UsuarioID, @PersonaIDRegistra";

                var res = await ConexionBD.database.QueryAsync<CanjeaBoletosEstelares>(Stored, obj).FirstOrDefaultAsync(); //parData

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

        [HttpGet]
        [Route("getCuentasBancarias")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getCuentasBancarias()
        {
            try
            { 
                int ProductoID = 9999;
                int.TryParse(Request.Headers["ProductoID"], out ProductoID);
                var res = await ConexionBD.database.QueryAsync<CatalogoCuentasBancos>("WHERE ProductoID = @0 and bitConcentradora = 1 AND Activo = 1", ProductoID).ToArrayAsync();
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
        [Route("getBonificaciones")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getBonificaciones()
        {
            try
            {
                var res = await ConexionBD.database.QueryAsync<CatalogoBonificaciones>("WHERE Activo = 1").ToArrayAsync();
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
        [Route("getTiposCodigo")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getTiposCodigo()
        {
            try
            {
                var res = await ConexionBD.database.QueryAsync<TiposCodigos>("WHERE Activo = 1").ToArrayAsync();
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
        [Route("getEstatusMovimiento")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getEstatusMovimiento()
        {
            try
            {
                var res = await ConexionBD.database.FetchAsync<EstatusMovimiento>();
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
        [Route("getAplicacionesSociaVrCv")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getAplicacionesSociaVrCv(PeticionesRest.Creditos.AplicaPagos.GetUltimasAplicaciones parData)
        {
            try
            {
                int ProductoID = 9999;
                int.TryParse(Request.Headers["ProductoID"], out ProductoID);
                parData.ProductoID = ProductoID;
                string query = "EXEC Creditos.paGetAplicacionesVRxCV @DistribuidorID, @SucursalID, @ProductoID";
                var res = await ConexionBD.database.QueryAsync<UltimasAplicaciones>(query, parData).ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }
    }
}
