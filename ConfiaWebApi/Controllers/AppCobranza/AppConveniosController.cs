using ConfiaWebApi.Code;
using ConfiaWebApi.ModlesSP.Cobranza;
using DBContext.DBConfia;
using DBContext.DBConfia.AppVale;
using DBContext.DBConfia.Cobranza;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using iText.Kernel.Pdf;
using iText.Layout;
using iText.Kernel.Geom;
using iText.Layout.Element;
using iText.IO.Image;
using iText.Layout.Properties;
using iText.Kernel.Pdf.Canvas.Draw;
using iText.Layout.Borders;
using iText.Kernel.Colors;
using iText.Kernel.Pdf.Canvas;
using Path = System.IO.Path;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Catalogos;
using iText.Kernel.Pdf.Xobject;
using System.Globalization;
using System.IO;

namespace ConfiaWebApi.Controllers.AppConvenios
{
    [Authorize]
    [ApiController]
    [Route("api/AppCobranza/[controller]")]
    public class AppConveniosController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public AppConveniosController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }


        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        [Code.TProteccionAppVales]
        public async Task<ActionResult> GetConvenio(PeticionesRest.Cobranza.Convenio.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                parData.ProductoID = producto;
                var data = await DBContext.database.QueryAsync<Convenios_VW>("WHERE (DistribuidorID = @DistribuidorID) AND (ProductoID = @ProductoID) AND (ConvenioID = @ConvenioID OR @ConvenioID = 0)", parData).OrderByDescending(x => x.ConvenioID).ToArrayAsync();

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                await DBContext.Destroy();

                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }
        }

        [HttpPost]
        [Route("getdetalle")]
        [Authorize]
        [Code.TProteccionProducto]
        [Code.TProteccionAppVales]
        public async Task<ActionResult> GetDetalle(PeticionesRest.Cobranza.Convenio.GetDetalle parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                parData.ProductoID = producto;
                ConvenioDetalle[] ConveniosDetalle = null;

                if (parData.ConvenioID > 0)
                {

                    ConveniosDetalle = await DBContext.database.QueryAsync<ConvenioDetalle>("WHERE (ConvenioID = @ConvenioID)", parData).ToArrayAsync();

                }
                else
                {
                    string Stored = "";
                    parData.error = 0;
                    parData.resultado = "";
                    parData.PorcPagInt = Math.Round(parData.PorcPagInt, 2);

                    Stored = "EXEC Cobranza.pa_GenerarConvenioDetalle_sel @error ,@resultado ,@DistribuidorID ,@ProductoID ,@SucursalID ,@PorcPagInt ,@PorcBon ,@Plazos";

                    ConveniosDetalle = await DBContext.database.QueryAsync<ConvenioDetalle>(Stored, parData).ToArrayAsync();
                }

                var data = new ArrayList();

                foreach (var Detalle in ConveniosDetalle)
                {
                    data.Add(new
                    {
                        Detalle.ConvenioID,
                        Detalle.NoPago,
                        FechaVencimiento = Detalle.FechaVencimiento.ToString("dd/MM/yyyy"),
                        Detalle.Importe,
                        Detalle.Saldo_Dep,
                        Detalle.Saldo_Plazo,
                        FechaDeposito = Detalle.FechaDeposito?.ToString("dd/MM/yyyy"),
                        Detalle.DiasAtraso
                    });
                }

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                await DBContext.Destroy();

                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }
        }

        [HttpPost]
        [Route("getsaldorelacion")]
        [Authorize]
        [Code.TProteccionProducto]
        [Code.TProteccionAppVales]
        public async Task<IActionResult> GetSaldoRelacion(PeticionesRest.AppValePeticiones.AppDistribuidores.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                parData.ProductoID = producto;

                var RelacionCortes = await DBContext.database.QueryAsync<AppRelacionCortes_VW>("WHERE (DistribuidorID = @0) AND (ProductoID = @1)", parData.DistribuidorID, producto).SingleOrDefaultAsync();

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = RelacionCortes
                };

                await DBContext.Destroy();

                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }

        }

        [HttpPost]
        [Route("cancelarconvenio")]
        [Authorize]
        [Code.TProteccionProducto]
        [Code.TProteccionAppVales]
        public async Task<ActionResult> CancelarConvenio(PeticionesRest.Cobranza.Convenio.Cancel parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                Convenios Convenio = await DBContext.database.SingleByIdAsync<Convenios>(parData.ConvenioID);

                if (Convenio.Activo == false)
                {
                    Convenio.Activo = false;
                    Convenio.Liquidado = false;
                    Convenio.EstatusId = 5;
                    Convenio.UsuarioCancela = UsuarioActual.UsuarioID;
                    Convenio.FechaCancelacion = DateTime.Now;

                    await DBContext.database.UpdateAsync(Convenio);

                    var data = await DBContext.database.QueryAsync<Convenios_VW>("WHERE (ConvenioID = @ConvenioID)", Convenio).SingleOrDefaultAsync();

                    var res = new
                    {
                        resultCode = 0,
                        resultDesc = "OK.",
                        data
                    };

                    await DBContext.Destroy();

                    return Ok(res);
                }
                else
                {
                    // Reversa no implementado
                    var res = new
                    {
                        resultCode = -1,
                        resultDesc = "No se puede canelar el convenio ya que se encuentra activo.",
                        data = new { }
                    };

                    await DBContext.Destroy();

                    return Ok(res);
                }

            }
            catch (Exception ex)
            {

                await DBContext.Destroy();

                return BadRequest(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });

            }
        }

        [HttpPost]
        [Route("solicitarconvenio")]
        [Authorize]
        [Code.TProteccionProducto]
        [Code.TProteccionAppVales]
        public async Task<ActionResult> SolicitarConvenio(PeticionesRest.Cobranza.Convenio.Add parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {

                parData.ProductoID = producto;

                Convenios Convenio = await DBContext.database.QueryAsync<Convenios>("WHERE (ProductoID = @ProductoID) AND (SucursalID = @SucursalID) AND (DistribuidorID = @DistribuidorID) AND (Activo = 0) AND (Liquidado = 0) AND (EstatusId = 1 OR EstatusId = 2)", parData).OrderByDescending(x => x.ConvenioID).FirstOrDefaultAsync();

                if (Convenio != null)
                {
                    await DBContext.Destroy();

                    return Ok(new
                    {
                        resultCode = 1,
                        resultDesc = "Ya existe una solicitud de convenio previa, cancelela o solicite su autorizacion, id: " + Convenio.ConvenioID.ToString() + ".",
                        data = Convenio
                    });
                }

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                parData.UsuarioID = UsuarioActual.UsuarioID;

                var RelacionCortes = await DBContext.database.QueryAsync<AppRelacionCortes_VW>("WHERE (DistribuidorID = @0) AND (ProductoID = @1)", parData.DistribuidorID, producto).SingleOrDefaultAsync();

                parData.PorcPagInt = Math.Round(parData.PorcPagInt, 2);

                Convenio = new Convenios();
                Convenio.ProductoID = producto;
                Convenio.SucursalID = parData.SucursalID;
                Convenio.DistribuidorID = parData.DistribuidorID;
                Convenio.SaldoConveniado = RelacionCortes.SaldoActual ?? 0;
                Convenio.DiasAtraso = RelacionCortes.DiasAtraso;
                Convenio.PorcBon = parData.PorcBon;
                Convenio.PorcPagInt = parData.PorcPagInt;
                Convenio.PagoIntencion = (RelacionCortes.SaldoActual) * parData.PorcPagInt;
                Convenio.ImporteBonificar = (RelacionCortes.SaldoActual - Convenio.PagoIntencion) * parData.PorcBon;
                Convenio.Plazos = parData.Plazos;
                Convenio.PlazosTotales = parData.Plazos + (parData.PorcBon > 0 ? 1 : 0) + (parData.PorcPagInt > 0 ? 1 : 0);
                Convenio.Activo = false;
                Convenio.Liquidado = false;
                Convenio.EstatusId = 1;
                Convenio.UsuarioID = parData.UsuarioID;
                Convenio.FechaRegistro = DateTime.Now;

                await DBContext.database.InsertAsync(Convenio);

                var data = await DBContext.database.QueryAsync<Convenios_VW>("WHERE (ConvenioID = @ConvenioID)", Convenio).SingleOrDefaultAsync();

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                await DBContext.Destroy();

                return Ok(res);
            }
            catch (Exception ex)
            {

                await DBContext.Destroy();

                return BadRequest(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });

            }
        }

        [HttpPost]
        [Route("creaconvenio")]
        [Authorize]
        [Code.TProteccionProducto]
        [Code.TProteccionAppVales]
        public async Task<ActionResult> CreaConvenio(PeticionesRest.Cobranza.Convenio.Autorizar parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {

                parData.ProductoID = producto;

                Convenios Convenio = await DBContext.database.QueryAsync<Convenios>("WHERE (ConvenioID = @ConvenioID) AND (ProductoID = @ProductoID) AND (SucursalID = @SucursalID) AND (DistribuidorID = @DistribuidorID) AND (Activo = 0) AND (Liquidado = 0) AND (EstatusId = 1)", parData).OrderByDescending(x => x.ConvenioID).FirstOrDefaultAsync();

                if (Convenio == null)
                {
                    await DBContext.Destroy();

                    return Ok(new
                    {
                        resultCode = 1,
                        resultDesc = "No existe la solicitud de convenio o ya ha sido autorizada, verifique.",
                        data = Convenio
                    });
                }

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                parData.UsuarioID = UsuarioActual.UsuarioID;

                var RelacionCortes = await DBContext.database.QueryAsync<AppRelacionCortes_VW>("WHERE (DistribuidorID = @0) AND (ProductoID = @1)", parData.DistribuidorID, producto).SingleOrDefaultAsync();

                parData.PorcPagInt = Math.Round(parData.PorcPagInt, 2);

                // parData.PorcPagInt = Funciones.Truncate(parData.PorcPagInt, 4);

                // Convenio = new Convenios();
                // Convenio.ProductoID = producto;
                // Convenio.SucursalID = parData.SucursalID;
                // Convenio.DistribuidorID = parData.DistribuidorID;
                Convenio.SaldoConveniado = RelacionCortes.SaldoActual ?? 0;
                Convenio.DiasAtraso = RelacionCortes.DiasAtraso;
                Convenio.PorcBon = parData.PorcBon;
                Convenio.PorcPagInt = parData.PorcPagInt;
                Convenio.PagoIntencion = (RelacionCortes.SaldoActual) * parData.PorcPagInt;
                Convenio.ImporteBonificar = (RelacionCortes.SaldoActual - Convenio.PagoIntencion) * parData.PorcBon;
                Convenio.Plazos = parData.Plazos;
                Convenio.PlazosTotales = parData.Plazos + (parData.PorcBon > 0 ? 1 : 0) + (parData.PorcPagInt > 0 ? 1 : 0);
                Convenio.Activo = false;
                Convenio.Liquidado = false;
                Convenio.EstatusId = 2;
                Convenio.UsuarioPreAutoriza = parData.UsuarioID;
                Convenio.FechaPreAutorizacion = DateTime.Now;

                await DBContext.database.UpdateAsync(Convenio);

                var data = await DBContext.database.QueryAsync<Convenios_VW>("WHERE (ConvenioID = @ConvenioID)", Convenio).SingleOrDefaultAsync();

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                await DBContext.Destroy();

                return Ok(res);
            }
            catch (Exception ex)
            {

                await DBContext.Destroy();

                return BadRequest(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });

            }
        }


        [HttpPost]
        [Route("autorizaconvenio")]
        [Authorize]
        [Code.TProteccionProducto]
        [Code.TProteccionAppVales]
        public async Task<ActionResult> AutorizaConvenio(PeticionesRest.Cobranza.Convenio.Autorizar parData, [FromHeader(Name = "ProductoID")] int producto)
        {

            try
            {
                parData.ProductoID = producto;
                Convenios Convenio = new Convenios();

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                parData.UsuarioID = UsuarioActual.UsuarioID;
                parData.PersonaIDRegistro = UsuarioActual.PersonaID.Value;

                Convenio = await DBContext.database.QueryAsync<Convenios>("WHERE (ProductoID = @ProductoID) AND (SucursalID = @SucursalID) AND (DistribuidorID = @DistribuidorID) AND (ConvenioID = @ConvenioID) AND (Activo = 0) AND (Liquidado = 0) AND (EstatusId = 2)", parData).FirstOrDefaultAsync();

                // Convenio = await DBContext.database.QueryAsync<Convenios>("WHERE (ProductoID = @ProductoID) AND (SucursalID = @SucursalID) AND (DistribuidorID = @DistribuidorID) AND (Activo = 1) AND (Liquidado = 0)", parData).OrderByDescending(x => x.ConvenioID).FirstOrDefaultAsync();

                // parData.ConvenioID = Convenio.ConvenioID;

                if (Convenio == null)
                {
                    await DBContext.Destroy();

                    return BadRequest(new
                    {
                        resultCode = 1,
                        resultDesc = "No se encontro ninguna solicitud de convenio pendiente de autorizar, favor de verificar.",
                        data = Convenio
                    });
                }

                parData.ConvenioID = Convenio.ConvenioID;
                parData.DistribuidorID = Convenio.DistribuidorID;
                parData.SucursalID = Convenio.SucursalID;
                parData.ProductoID = Convenio.ProductoID;

                parData.PorcPagInt = Math.Round(parData.PorcPagInt, 2);

                parData.error = 0;
                parData.resultado = "";

                // parData.PorcPagInt = Funciones.Truncate(parData.PorcPagInt, 4);

                // if(parData.Editar == false){
                // parData.PorcPagInt = Convenio.PorcPagInt;
                // parData.PorcBon = Convenio.PorcBon;
                // parData.Plazos = Convenio.Plazos;
                // }

                // DBContext.database.BeginTransaction();

                string Stored = "";

                Stored = "EXEC Cobranza.pa_RegistraConvenio_Ins @error ,@resultado ,@ConvenioID ,@UsuarioID ,@DistribuidorID ,@ProductoID ,@SucursalID ,@PorcPagInt ,@PorcBon ,@Plazos ,@PersonaIDRegistro";

                var data = await DBContext.database.QueryAsync<spConvenio>(Stored, parData).FirstOrDefaultAsync();

                if (data.error != 0)
                {
                    // DBContext.database.AbortTransaction();
                    return Ok(new
                    {
                        resultCode = data.error,
                        resultDesc = data.resultado,
                        data = new { }
                    });
                }

                // DBContext.database.CompleteTransaction();

                Convenio = await DBContext.database.SingleByIdAsync<Convenios>(data.ConvenioID);

                await DBContext.Destroy();

                var res = new
                {
                    resultCode = data.error,
                    resultDesc = data.resultado,
                    data = Convenio
                };
                await DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                // DBContext.database.AbortTransaction();

                await DBContext.Destroy();

                return BadRequest(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }

        }

        [HttpPost]
        [Route("getplazos")]
        [Authorize]
        [Code.TProteccionProducto]
        [Code.TProteccionAppVales]
        public async Task<IActionResult> GetPlazos(PeticionesRest.Cobranza.Convenio.GetPlazo parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                // parData.ProductoID = producto;

                var ConveniosTabulador = await DBContext.database.QueryAsync<ConveniosTabulador>(@"WHERE (DiasAtrMin <= @DiasAtraso) AND (DiasAtrMax >= @DiasAtraso) AND (SaldoMin <= @Saldo) AND (SaldoMax >= @Saldo)", parData).ToArrayAsync();

                var data = new ArrayList();

                foreach (var ConvenioTabulador in ConveniosTabulador)
                {

                    // ArrayList plazos = new();

                    for (int x = ConvenioTabulador.PlazosMin; x <= ConvenioTabulador.PlazosMax; x += 2)
                    {
                        // plazos.Add(x);
                        data.Add(new
                        {
                            plazo = x,
                        });
                    }

                    // foreach (int plazo in plazos)
                    // {
                    //     data.Add(new
                    //     {
                    //         plazo = plazo,
                    //     });
                    // }
                }

                if (data.Count == 0)
                {
                    data.Add(new
                    {
                        plazo = 0,
                    });
                }

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                await DBContext.Destroy();

                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }

        }

        [HttpPost]
        [Route("getporcquita")]
        [Authorize]
        [Code.TProteccionProducto]
        [Code.TProteccionAppVales]
        public async Task<IActionResult> GetPorcQuita(PeticionesRest.Cobranza.Convenio.GetPlazo parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                // parData.ProductoID = producto;

                var ConveniosTabulador = await DBContext.database.QueryAsync<ConveniosTabulador>(@"WHERE (DiasAtrMin <= @DiasAtraso) AND (DiasAtrMax >= @DiasAtraso) AND (SaldoMin <= @Saldo) AND (SaldoMax >= @Saldo)", parData).ToArrayAsync();

                var data = new ArrayList();

                data.Add(new
                {
                    porquita = 0,
                    porquitaDsc = "0 %",
                });

                foreach (var ConvenioTabulador in ConveniosTabulador)
                {

                    ArrayList porquitas = new();


                    for (double x = (double)ConvenioTabulador.PorcQuita; x <= (double)ConvenioTabulador.PorcQuita; x += 0.05)
                    {
                        // porquitas.Add(x);
                        data.Add(new
                        {
                            porquita = x,
                            porquitaDsc = (x * 100).ToString() + " %",
                        });
                    }

                    // foreach (int porquita in porquitas)
                    // {
                    //     data.Add(new
                    //     {
                    //         porquita = porquita,
                    //         porquitaDsc = (porquita * 100).ToString() + " %",
                    //     });
                    // }
                }

                // if(data.Count == 0)
                // {                    
                //     data.Add(new
                //     {
                //         porquita = 0,
                //         porquitaDsc = "0 %",
                //     });
                // }

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                await DBContext.Destroy();

                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }

        }

        [HttpPost]
        [Route("pdf")]
        [Authorize]
        [Code.TProteccionProducto]
        [Code.TProteccionAppVales]
        public async Task<IActionResult> Pdf(PeticionesRest.Cobranza.Convenio.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                parData.ProductoID = producto;

                var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");

                string dest = Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf"));

                //MemoryStream ms = new();

                PdfWriter pw = new(dest);

                PdfDocument pdfDocument = new(pw);

                Document doc = new(pdfDocument, PageSize.LEGAL);

                doc.SetMargins(55, 77, 14, 80);

                var Producto = await DBContext.database.QueryAsync<ProductosVW>("WHERE (ProductoID = @ProductoID)", parData).FirstOrDefaultAsync();

                var Convenio = await DBContext.database.QueryAsync<Convenios_VW>("WHERE ConvenioID = @ConvenioID", parData).FirstOrDefaultAsync();

                // var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE UsuarioID=@0", Convenio.UsuarioAutoriza).FirstOrDefaultAsync();
                var PersonaActual = await DBContext.database.QueryAsync<Personas_VW>("WHERE PersonaID=@0", UsuarioActual.PersonaID).FirstOrDefaultAsync();

                var DscDistribuidor = await DBContext.database.QueryAsync<VariablesGlobales>("WHERE (varName = @0)", "DESCRIPCION_DISTRIBUIDOR").FirstOrDefaultAsync();

                var logo = Producto.Logo;

                ImageData data = ImageDataFactory.Create(logo);

                Image img = new(data);

                // img.SetFixedPosition(0, -50);
                // Rectangle rectangle = new Rectangle(163, 50);
                // PdfFormXObject template = new PdfFormXObject(rectangle);
                // Canvas canvas = new Canvas(template, pdfDocument);
                // canvas.Add(img);
                // Image croppedImage = new Image(template);

                GenerarArchivo(ref doc, Convenio, img, DscDistribuidor.varValue.ToString(), Producto.empresaRazonSocial, PersonaActual.NombreCompleto.ToUpper());

                doc.Close();

                // Obtenemos el contenido de nuestro archivo de PDF
                var pdf = await System.IO.File.ReadAllBytesAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
                //var pdf = await System.IO.File.ReadAllBytesAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF_signed.pdf")));

                // Obtenemos nuestro PDF
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

        private void GenerarArchivo(ref Document doc, Convenios_VW Convenio, Image img, string DscDistribuidor, string Empresa, string NombreGerente)
        {
            LineSeparator ls = new(new SolidLine());

            ls.SetMarginLeft(125);

            ls.SetMarginRight(125);

            LineSeparator lfl = new(new SolidLine());

            lfl.SetMarginLeft(255);

            LineSeparator dl = new(new DashedLine());

            SolidLine line = new(1f);
            line.SetColor(ColorConstants.LIGHT_GRAY);

            LineSeparator sl = new(line);

            Paragraph salto1 = new(new Text("\n"));

            Paragraph salto2 = new(new Text("\n\n"));

            Paragraph salto3 = new(new Text("\n\n\n"));

            Paragraph salto4 = new(new Text("\n\n\n\n"));

            // ImageData data = ImageDataFactory.Create(Logo);

            // Image img = new(data);

            // img.SetFixedPosition(-20, -320);
            // Rectangle rectangle = new Rectangle(300, 300);
            // PdfFormXObject template = new PdfFormXObject(rectangle);
            // Canvas canvas = new Canvas(template, doc);
            // canvas.add(image);
            // Image croppedImage = new Image(template);

            img.SetHeight(50);

            img.SetWidth(163);

            // img.SetPadding(0);

            // img.SetMargins(0, 0, 0, 0);

            Paragraph title = new Paragraph("SOLICITUD DE CONVENIO DE SALIDA")
            .SetFontSize(12)
            .SetBold()
            .SetTextAlignment(TextAlignment.CENTER);

            Paragraph title2 = new Paragraph()
            .SetFontSize(11)
            .SetItalic()
            .SetTextAlignment(TextAlignment.RIGHT)
            .Add(new Text("Ciudad y fecha: __________________________________"));

            Paragraph title3 = new Paragraph("Solicitante")
            .SetItalic()
            .SetFontSize(11);

            Paragraph title4 = new Paragraph("Nombre: ")
            .SetItalic()
            .SetFontSize(11);

            title4.Add(new Text($"{Convenio.Distribuidor}").SetUnderline());

            Paragraph title5 = new Paragraph($"# de {DscDistribuidor}: ")
            .SetItalic()
            .SetFontSize(11);

            title5.Add(new Text($"{Convenio.NumeroDistribuidor}").SetUnderline());

            Paragraph title6 = new Paragraph("Número Telefónico: ")
            .SetItalic()
            .SetFontSize(11);

            title6.Add(new Text($"{Convenio.TelefonoMovil}").SetUnderline());

            Text text1 = new Text("Por medio del presente se establece que el interesado(a) solicita un convenio de salida para cubrir el adeudo que tiene con la empresa ");

            Text text2 = new Text($"{Empresa}, ")
            .SetBold();

            Text text3 = new Text($"que asciende al momento de la elaboración de este escrito a la cantidad de:");

            Paragraph parr1 = new Paragraph()
            .SetTextAlignment(TextAlignment.JUSTIFIED)
            .SetItalic()
            .SetFontSize(10);

            parr1.Add(text1);
            parr1.Add(text2);
            parr1.Add(text3);

            Paragraph parrM = new Paragraph()
            .SetTextAlignment(TextAlignment.JUSTIFIED)
            .SetItalic()
            .SetBold()
            // .SetUnderline()
            .SetFontSize(11);

            parrM.Add(new Text($"{Convenio.SaldoConveniado.ToString("C", CultureInfo.CurrentCulture)}").SetUnderline());
            parrM.Add(new Text("  ("));
            parrM.Add(new Text($"{Funciones.NumeroALetras(Convenio.SaldoConveniado, true)}").SetUnderline());
            parrM.Add(new Text(")"));

            Paragraph parr2 = new Paragraph("Como antecedente de la cuenta, se establecen los motivos por los cuales se requiere tal apoyo:")
            .SetTextAlignment(TextAlignment.JUSTIFIED)
            .SetItalic()
            .SetFontSize(11);

            Paragraph parr3 = new Paragraph("Al momento de la solicitud de convenio, el solicitante cubrirá la cantidad de:")
            .SetItalic()
            .SetTextAlignment(TextAlignment.JUSTIFIED)
            .SetFontSize(11);

            Paragraph parr4 = new Paragraph("Este pago inicial es con el fin de demostrar su verdadera intención de pago y comprobar la capacidad de cumplimiento de los pagos venideros.")
            .SetItalic()
            .SetTextAlignment(TextAlignment.JUSTIFIED)
            .SetFontSize(11);

            Text text4 = new Text("Una vez autorizado el convenio y recibido el último abono, se hará entrega a ");

            Text text5 = new Text("\"EL CLIENTE\"")
            .SetBold();

            Text text6 = new Text("de la CARTA DE NO ADEUDO correspondiente, por parte de ");

            Text text7 = new Text("\"LA EMPRESA\"")
            .SetBold();

            Text text8 = new Text(", como respaldo jurídico de la liquidación del adeudo.");

            Paragraph parr5 = new Paragraph()
            .SetTextAlignment(TextAlignment.JUSTIFIED)
            .SetItalic()
            .SetFontSize(11);

            parr5.Add(text4);
            parr5.Add(text5);
            parr5.Add(text6);
            parr5.Add(text7);
            parr5.Add(text8);

            Paragraph sign = new Paragraph()
            .SetFontSize(11)
            .SetItalic()
            .SetTextAlignment(TextAlignment.CENTER)
            .Add("SOLICITANTE");

            float[] pointColumnWidths = { 350F, 350F };
            Table table = new(pointColumnWidths);

            Cell c1 = new(1, 2);
            c1.Add(new Paragraph("Para llenado exclusivo por la sucursal (En base a tabla de % y plazos)"));
            c1.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
            c1.SetFontSize(12);
            c1.SetTextAlignment(TextAlignment.CENTER);
            c1.SetBold();
            c1.SetItalic();

            Cell c2 = new();
            c2.Add(new Paragraph("Monto a conveniarse (después de pago de intención)"));
            c2.SetBackgroundColor(ColorConstants.WHITE);
            c1.SetFontSize(12);
            c2.SetTextAlignment(TextAlignment.CENTER);
            c2.SetItalic();

            Cell c3 = new();
            c3.SetBackgroundColor(ColorConstants.WHITE);
            c3.SetFontSize(12);
            c3.SetTextAlignment(TextAlignment.CENTER);
            c3.SetItalic();

            var SldDspPagInt = (Convenio.SaldoConveniado - Convenio.PagoIntencion);

            Paragraph pc3 = new Paragraph();
            pc3.Add(new Text($"{SldDspPagInt.Value.ToString("C", CultureInfo.CurrentCulture)}").SetUnderline());
            c3.Add(pc3);

            Cell c4 = new();
            c4.Add(new Paragraph("Plazo Solicitado"));
            c4.SetBackgroundColor(ColorConstants.WHITE);
            c4.SetFontSize(12);
            c4.SetTextAlignment(TextAlignment.CENTER);
            c4.SetItalic();

            Cell c5 = new();
            c5.SetBackgroundColor(ColorConstants.WHITE);
            c5.SetFontSize(12);
            c5.SetTextAlignment(TextAlignment.CENTER);
            c5.SetItalic();

            Paragraph pc5 = new Paragraph();
            pc5.Add(new Text($"{Convenio.Plazos}").SetUnderline());
            pc5.Add(new Text(" quincenas"));
            c5.Add(pc5);

            Cell c6 = new();
            c6.Add(new Paragraph("% de descuento solicitado"));
            c6.SetBackgroundColor(ColorConstants.WHITE);
            c6.SetFontSize(12);
            c6.SetTextAlignment(TextAlignment.CENTER);
            c6.SetItalic();

            Cell c7 = new();
            c7.SetBackgroundColor(ColorConstants.WHITE);
            c7.SetFontSize(12);
            c7.SetTextAlignment(TextAlignment.CENTER);
            c7.SetItalic();

            Paragraph pc7 = new Paragraph();
            pc7.Add(new Text($"{Funciones.Truncate((Convenio.PorcBon * 100), 0)}").SetUnderline());
            pc7.Add(new Text(" %"));
            c7.Add(pc7);

            table.AddCell(c1);
            table.AddCell(c2);
            table.AddCell(c3);
            table.AddCell(c4);
            table.AddCell(c5);
            table.AddCell(c6);
            table.AddCell(c7);

            Paragraph sign2 = new Paragraph()
            .SetFontSize(11)
            .SetItalic()
            .SetTextAlignment(TextAlignment.CENTER);

            sign2.Add(new Text(NombreGerente).SetUnderline());
            sign2.Add("\n");
            // sign2.Add(ls);
            // sign2.Add("\n");
            sign2.Add("NOMBRE Y FIRMA GERENTE DE SUCURSAL");

            // doc.Add(date);
            doc.Add(img);
            doc.Add(title);
            doc.Add(title2);
            doc.Add(title3);
            doc.Add(title4);
            doc.Add(title5);
            doc.Add(title6);
            doc.Add(new Paragraph());
            doc.Add(parr1);
            doc.Add(new Paragraph());
            doc.Add(parrM);
            doc.Add(parr2);
            // doc.Add(salto1);    
            doc.Add(new Paragraph());
            doc.Add(new Paragraph());
            // doc.Add(new Paragraph());    
            doc.Add(sl);
            // doc.Add(salto1);
            doc.Add(new Paragraph());
            doc.Add(new Paragraph());
            doc.Add(new Paragraph());
            doc.Add(sl);
            // doc.Add(salto1);  
            doc.Add(new Paragraph());
            doc.Add(new Paragraph());
            doc.Add(new Paragraph());
            doc.Add(sl);
            // doc.Add(salto1);
            doc.Add(new Paragraph());
            doc.Add(new Paragraph());
            doc.Add(new Paragraph());
            doc.Add(sl);
            // doc.Add(salto1);
            doc.Add(new Paragraph());
            doc.Add(new Paragraph());
            doc.Add(new Paragraph());
            doc.Add(sl);
            // doc.Add(salto1);
            doc.Add(new Paragraph());
            doc.Add(new Paragraph());
            // doc.Add(new Paragraph());    
            doc.Add(parr3);
            doc.Add(parrM);
            doc.Add(parr4);
            // doc.Add(salto1);
            doc.Add(new Paragraph());
            // doc.Add(new Paragraph()); 
            // doc.Add(new Paragraph());     
            doc.Add(parr5);
            doc.Add(salto2);
            // doc.Add(new Paragraph());
            // doc.Add(new Paragraph()); 
            // doc.Add(new Paragraph());  
            // doc.Add(new Paragraph()); 
            // doc.Add(new Paragraph());  
            doc.Add(ls);
            doc.Add(sign);
            // doc.Add(salto1);             
            doc.Add(new Paragraph());
            doc.Add(new Paragraph());
            doc.Add(table);
            doc.Add(salto2);
            // doc.Add(new Paragraph());
            // doc.Add(new Paragraph()); 
            // doc.Add(new Paragraph());  
            // doc.Add(ls);
            doc.Add(sign2);
        }


    }
}
