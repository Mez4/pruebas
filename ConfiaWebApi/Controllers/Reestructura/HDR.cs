
using System.Collections.Generic;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using Chilkat;
using ConfiaWebApi.PeticionesRest.Reestructura.HDR;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Reestructura;
using NPoco.Expressions;
using DBContext.DBConfia.Seguridad;
using System.Globalization;
using System.Linq;

using System;
using System.IO;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using iText.Kernel.Events;

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
//using iTextSharp.text.pdf;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Xobject;
using iText.Pdfa;
using ConfiaWebApi.PeticionesRest.Creditos.CanjeaVale;
using ConfiaWebApi.PeticionesRest.Tesoreria.Corresponsales;
using static iText.Svg.SvgConstants;
using System.Collections;
using NPoco.fastJSON;
using PDF = ConfiaWebApi.Code.PDF;
using Newtonsoft.Json;
using Microsoft.Data.SqlClient;
using System.Data;
using NPoco;
using ConfiaWebApi.PeticionesRest.Aclaraciones.AnalistaSucursal;
using DBContext.DBConfia.Compras;
using DBContext.DBConfia.Seguridad;
using DBContext.DBConfia.Tesoreria;
using Microsoft.IdentityModel.Tokens;

namespace ConfiaWebApi.Controllers
{
    [ApiController]
    [Route("api/Reestructura/[controller]")]
    public class HDRController : ControllerBase
    {
        private DBConfiaContext DBContext;
        public HDRController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpGet]
        [Route("obtenerQuitaPorcentaje")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerQuitaPorcentaje()
        {
            try
            {
                // string sql = "SELECT * FROM Reestructura.QuitaPorcentajes";
                var quita = await DBContext.database.FetchAsync<DBContext.DBConfia.Reestructura.QuitaPorcentajes>();
                return Ok(quita);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

       [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Reestructura.HDR.AddHDR parData)
        {
            try
            {

                var usuarioActualEmail = Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

                int ProductoID = 9999;
                int.TryParse(Request.Headers["ProductoID"], out ProductoID);

                var solicitud2 = await DBContext.database.QueryAsync<SolicitudReestructurasConvenios>("WHERE SolicitudRCID=@SolicitudRCID AND DistribuidorID=@DistribuidorID", parData).FirstOrDefaultAsync();

                if (solicitud2.Accion == 4)
                {
                    var obj = new
                    {
                        DistribuidorID = parData.DistribuidorID,
                        ProductoID = ProductoID,
                        Accion = solicitud2.Accion,
                        SaldoActual = solicitud2.SaldoActual,
                        SaldoAtrasado = 0,
                        PlazoID = solicitud2.PlazoID,
                        QuitaID = parData.QuitaID,
                        PagoIntencion = parData.PagoIntencion,
                        Observaciones = "",
                        UsuarioRegistraID = (long)UsuarioActual.UsuarioID,
                        PersonaRegistraID = UsuarioActual.PersonaID,
                        SolicitudID = parData.SolicitudRCID
                    };
                    DBContext.database.CommandTimeout = 360;

                    var stored = "EXEC Reestructura.ConveniosReestructuras @DistribuidorID, @ProductoID, @Accion, @SaldoActual, @SaldoAtrasado, @QuitaID, @PagoIntencion, @PlazoID, @Observaciones ,@UsuarioRegistraID, @PersonaRegistraID, @SolicitudID";
                    var res = await DBContext.database.QueryAsync<ConfiaWebApi.PeticionesRest.Reestructura.HDR.HerramientaID>(stored, obj).FirstOrDefaultAsync();

                    if (res.regresa == 1)
                    {
                        var solicitud = await DBContext.database.QueryAsync<SolicitudReestructurasConvenios>("WHERE SolicitudRCID = @0 AND Estatus = 'V'", parData.SolicitudRCID).FirstOrDefaultAsync();
                        if (solicitud == null)
                        {
                            await DBContext.Destroy();
                            return BadRequest(new
                            {
                                status = false,
                                msg = "No se encontro la solicitud"
                            });
                        }
                        solicitud.FechaAceptacion = DateTime.Now;
                        solicitud.ObservacionesAdicionales = parData.Observaciones_Adicionales;
                        solicitud.QuitaID = parData.QuitaID;
                        solicitud.PlazoID = parData.PlazoID;
                        solicitud.Estatus = "A";
                        solicitud.PersonaAceptaID = (long)UsuarioActual.PersonaID;

                        await DBContext.database.UpdateAsync(solicitud);
                    }
                    else
                    {
                        await DBContext.Destroy();
                        return BadRequest(new
                        {
                            status = false,
                            msg = res.msj
                        });
                    }

                }
                else
                {
                    var obj = new
                    {
                        DistribuidorID = parData.DistribuidorID,
                        ProductoID = ProductoID,
                        Accion = parData.Accion,
                        SaldoActual = parData.SaldoActual,
                        SaldoAtrasado = parData.SaldoAtrasado,
                        QuitaID = parData.QuitaID,
                        PagoIntencion = parData.PagoIntencion,
                        PlazoID = parData.PlazoID,
                        Observaciones = parData.Observaciones,
                        UsuarioRegistraID = (long)UsuarioActual.UsuarioID,
                        PersonaRegistraID = UsuarioActual.PersonaID,
                        SolicitudID = 0
                    };
                    DBContext.database.CommandTimeout = 360;
                    
                    if(solicitud2.Accion == 2)
                    {
                        var stored = "EXEC Reestructura.pa_ReestructuraEmergencia @DistribuidorID, @ProductoID, @Accion, @SaldoActual, @SaldoAtrasado, @QuitaID, @PagoIntencion, @PlazoID, @Observaciones ,@UsuarioRegistraID, @PersonaRegistraID, @SolicitudID";
                        var res = await DBContext.database.QueryAsync<ConfiaWebApi.PeticionesRest.Reestructura.HDR.HerramientaID>(stored, obj).FirstOrDefaultAsync();

                        if (res.regresa == 1)
                        {
                            var solicitud = await DBContext.database.QueryAsync<SolicitudReestructurasConvenios>("WHERE SolicitudRCID = @0 AND Estatus = 'V'", parData.SolicitudRCID).FirstOrDefaultAsync();
                            if (solicitud == null)
                            {
                                await DBContext.Destroy();
                                return BadRequest(new
                                {
                                    status = false,
                                    msg = "No se encontro la solicitud"
                                });
                            }
                            solicitud.FechaAceptacion = DateTime.Now;
                            solicitud.ObservacionesAdicionales = parData.Observaciones_Adicionales;
                            solicitud.QuitaID = parData.QuitaID;
                            solicitud.PlazoID = parData.PlazoID;
                            solicitud.Estatus = "A";
                            await DBContext.database.UpdateAsync(solicitud);
                        }
                        else
                        {
                            await DBContext.Destroy();
                            return BadRequest(new
                            {
                                status = false,
                                msg = res.msj
                            });
                        }
                    }
                    else if(solicitud2.Accion == 5)
                    {
                        var stored = "EXEC Reestructura.pa_Reconvenios @DistribuidorID, @ProductoID, @Accion, @SaldoActual, @SaldoAtrasado, @QuitaID, @PagoIntencion, @PlazoID, @Observaciones ,@UsuarioRegistraID, @PersonaRegistraID, @SolicitudID";
                        var res = await DBContext.database.QueryAsync<ConfiaWebApi.PeticionesRest.Reestructura.HDR.HerramientaID>(stored, obj).FirstOrDefaultAsync();

                        if (res.regresa == 1)
                        {
                            var solicitud = await DBContext.database.QueryAsync<SolicitudReestructurasConvenios>("WHERE SolicitudRCID = @0 AND Estatus = 'V'", parData.SolicitudRCID).FirstOrDefaultAsync();
                            if (solicitud == null)
                            {
                                await DBContext.Destroy();
                                return BadRequest(new
                                {
                                    status = false,
                                    msg = "No se encontro la solicitud"
                                });
                            }
                            solicitud.FechaAceptacion = DateTime.Now;
                            solicitud.ObservacionesAdicionales = parData.Observaciones_Adicionales;
                            solicitud.QuitaID = parData.QuitaID;
                            solicitud.PlazoID = parData.PlazoID;
                            solicitud.Estatus = "A";
                            await DBContext.database.UpdateAsync(solicitud);
                        }
                        else
                        {
                            await DBContext.Destroy();
                            return BadRequest(new
                            {
                                status = false,
                                msg = res.msj
                            });
                        }
                    }
                    else if(solicitud2.Accion == 1)
                    {
                        var stored = "EXEC Reestructura.pa_ConvenioSalida @DistribuidorID, @ProductoID, @Accion, @SaldoActual, @SaldoAtrasado, @QuitaID, @PagoIntencion, @PlazoID, @Observaciones ,@UsuarioRegistraID, @PersonaRegistraID, @SolicitudID";
                        var res = await DBContext.database.QueryAsync<ConfiaWebApi.PeticionesRest.Reestructura.HDR.HerramientaID>(stored, obj).FirstOrDefaultAsync();

                        if (res.regresa == 1)
                        {
                            var solicitud = await DBContext.database.QueryAsync<SolicitudReestructurasConvenios>("WHERE SolicitudRCID = @0 AND Estatus = 'V'", parData.SolicitudRCID).FirstOrDefaultAsync();
                            if (solicitud == null)
                            {
                                await DBContext.Destroy();
                                return BadRequest(new
                                {
                                    status = false,
                                    msg = "No se encontro la solicitud"
                                });
                            }
                            solicitud.FechaAceptacion = DateTime.Now;
                            solicitud.ObservacionesAdicionales = parData.Observaciones_Adicionales;
                            solicitud.QuitaID = parData.QuitaID;
                            solicitud.PlazoID = parData.PlazoID;
                            solicitud.Estatus = "A";
                            await DBContext.database.UpdateAsync(solicitud);
                        }
                        else
                        {
                            await DBContext.Destroy();
                            return BadRequest(new
                            {
                                status = false,
                                msg = res.msj
                            });
                        }
                    }
                    else if(solicitud2.Accion == 3)
                    {
                        var stored = "EXEC Reestructura.pa_ReestructuraSalida @DistribuidorID, @ProductoID, @Accion, @SaldoActual, @SaldoAtrasado, @QuitaID, @PagoIntencion, @PlazoID, @Observaciones ,@UsuarioRegistraID, @PersonaRegistraID, @SolicitudID";
                        var res = await DBContext.database.QueryAsync<ConfiaWebApi.PeticionesRest.Reestructura.HDR.HerramientaID>(stored, obj).FirstOrDefaultAsync();

                        if (res.regresa == 1)
                        {
                            var solicitud = await DBContext.database.QueryAsync<SolicitudReestructurasConvenios>("WHERE SolicitudRCID = @0 AND Estatus = 'V'", parData.SolicitudRCID).FirstOrDefaultAsync();
                            if (solicitud == null)
                            {
                                await DBContext.Destroy();
                                return BadRequest(new
                                {
                                    status = false,
                                    msg = "No se encontro la solicitud"
                                });
                            }
                            solicitud.FechaAceptacion = DateTime.Now;
                            solicitud.ObservacionesAdicionales = parData.Observaciones_Adicionales;
                            solicitud.QuitaID = parData.QuitaID;
                            solicitud.PlazoID = parData.PlazoID;
                            solicitud.Estatus = "A";
                            await DBContext.database.UpdateAsync(solicitud);
                        }
                        else
                        {
                            await DBContext.Destroy();
                            return BadRequest(new
                            {
                                status = false,
                                msg = res.msj
                            });
                        }
                    }
                    else
                    { 
                        var stored = "EXEC Reestructura.ConveniosReestructuras @DistribuidorID, @ProductoID, @Accion, @SaldoActual, @SaldoAtrasado, @QuitaID, @PagoIntencion, @PlazoID, @Observaciones ,@UsuarioRegistraID, @PersonaRegistraID, @SolicitudID";
                        var res = await DBContext.database.QueryAsync<ConfiaWebApi.PeticionesRest.Reestructura.HDR.HerramientaID>(stored, obj).FirstOrDefaultAsync();

                        if (res.regresa == 1)
                        {
                            var solicitud = await DBContext.database.QueryAsync<SolicitudReestructurasConvenios>("WHERE SolicitudRCID = @0 AND Estatus = 'V'", parData.SolicitudRCID).FirstOrDefaultAsync();
                            if (solicitud == null)
                            {
                                await DBContext.Destroy();
                                return BadRequest(new
                                {
                                    status = false,
                                    msg = "No se encontro la solicitud"
                                });
                            }
                            solicitud.FechaAceptacion = DateTime.Now;
                            solicitud.ObservacionesAdicionales = parData.Observaciones_Adicionales;
                            solicitud.QuitaID = parData.QuitaID;
                            solicitud.PlazoID = parData.PlazoID;
                            solicitud.Estatus = "A";
                            await DBContext.database.UpdateAsync(solicitud);
                        }
                        else
                        {
                            await DBContext.Destroy();
                            return BadRequest(new
                            {
                                status = false,
                                msg = res.msj
                            });
                        }
                    }

                };


                await DBContext.Destroy();
                return Ok(new
                {
                    status = "OK",
                    msg = "Se ha registrado con exito !! "
                });


            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }



        [HttpPost]
        [Route("obtenerPlazos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerPlazos()
        {
            try
            {
                var plazos = await DBContext.database.FetchAsync<DBContext.DBConfia.Reestructura.Plazos>();
                await DBContext.Destroy();
                return Ok(plazos);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("obtenerPlazoSimulacion")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> obtenerPlazoSimulacion(ConfiaWebApi.PeticionesRest.Reestructura.HDR.PlazoSimulacion parData)
        {
            try
            {
                int ProductoID = 9999;
                int.TryParse(Request.Headers["ProductoID"], out ProductoID);

                var obj = new
                {
                    parData.SaldoActual,
                    parData.QuitaID,
                    parData.PlazoID,
                    parData.MontoIntencion,
                    parData.accion,
                    ProductoId = ProductoID,
                    DistribuidorID = parData.DistribuidorID
                };

                var plazos = await DBContext.database.QueryAsync<ConfiaWebApi.PeticionesRest.Reestructura.HDR.Plazos>("EXEC Reestructura.fn_PagosSimulacion @SaldoActual, @QuitaID, @PlazoID, @MontoIntencion, @accion, @ProductoId, @DistribuidorID", obj).ToArrayAsync();
                // var plazo = plazos.Where(x => x.IDPlazo == pagos.IDPlazo).FirstOrDefault();
                await DBContext.Destroy();
                return Ok(plazos);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpGet]
        [Route("obtenerSolicitud/{solicitudRCID}")]
        [Authorize]
        [Code.TProteccionProducto]

        public async Task<ActionResult> obtenerSolicitud(int solicitudRCID)
        {
            try
            {
                // ESTA PETICION ES IGUAL QUE LA DE COMPROBARSOLICITUD/{distribuidorID} PERO NO SE USA
                var res = await DBContext.database.QueryAsync<SolicitudReestructurasConvenios>("WHERE SolicitudRCID = @0", solicitudRCID).FirstOrDefaultAsync();
                await DBContext.Destroy();
                if (res == null)
                {
                    var obj = new
                    {
                        Accion = -1
                    };
                    return Ok(obj);
                }

                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("getHerramientas/{personaID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getHerramientas(int personaID)
        {
            try
            {

                var res = await DBContext.database.QueryAsync<SolicitudReestructurasConveniosDP_VW>("WHERE DistribuidorID = @0", personaID).ToArrayAsync();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }


        [HttpPost]
        [Route("ValidarSolicitud")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> ValidarSolicitud(ConfiaWebApi.PeticionesRest.Reestructura.HDR.EstatusSolicitud parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();


                var solicitud = await DBContext.database.SingleByIdAsync<SolicitudReestructurasConvenios>(parData.SolicitudRCID);
                if(solicitud.Completado == true)
                {
                    solicitud.Estatus = "V";
                    solicitud.FechaValidacion = DateTime.Now;
                    solicitud.PersonaValidaID = (long)UsuarioActual.PersonaID;
                    await DBContext.database.UpdateAsync(solicitud);
                    await DBContext.Destroy();
                    return Ok();
                }
                else
                {
                    await DBContext.Destroy();
                    return BadRequest("Favor de terminar el proceso y Enviar Solicitud");
                }
                
                
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("RechazarSolicitud")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> RechazarSolicitud(ConfiaWebApi.PeticionesRest.Reestructura.HDR.EstatusSolicitud parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
              
                var solicitud = await DBContext.database.SingleByIdAsync<SolicitudReestructurasConvenios>(parData.SolicitudRCID);
                solicitud.Estatus = "R";
                solicitud.FechaRechazo = DateTime.Now;
                solicitud.PersonaRechazaID = (long)UsuarioActual.PersonaID;
                await DBContext.database.UpdateAsync(solicitud);
                await DBContext.Destroy();
                return Ok();
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("ReValidarSolicitud")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> ReValidaSolicitud(ConfiaWebApi.PeticionesRest.Reestructura.HDR.EstatusSolicitud parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
              
                var solicitud = await DBContext.database.SingleByIdAsync<SolicitudReestructurasConvenios>(parData.SolicitudRCID);
                solicitud.Estatus = "X";
                solicitud.FechaReValidacion = DateTime.Now;
                solicitud.PersonaRevalidaID = (long)UsuarioActual.PersonaID;
                await DBContext.database.UpdateAsync(solicitud);
                await DBContext.Destroy();
                return Ok();
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }


        [HttpPost]
        [Route("pdf")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Pdf(ConfiaWebApi.PeticionesRest.Reestructura.HDR.EstatusSolicitud parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");

                string dest = Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf"));
                PdfWriter pw = new(dest);

                PdfDocument pdfDocument = new(pw);

                Document doc = new(pdfDocument, PageSize.LETTER);

                var Producto = await DBContext.database.SingleByIdAsync<Productos>(producto);
                var logo = Producto.Logo;

                var solicitud = await DBContext.database.QueryAsync<SolicitudReestructurasConveniosDP_VW>("WHERE SolicitudRCID = @0", parData.SolicitudRCID).FirstOrDefaultAsync();

                
                var dia = solicitud.FechaAceptacion.Value.Day;
                var mes = solicitud.FechaAceptacion.Value.Month;
                var yyyy = solicitud.FechaAceptacion.Value.Year;
                var fecha = solicitud.FechaAceptacion;
                string nombreDelMes = CultureInfo.GetCultureInfo("es-ES").DateTimeFormat.GetMonthName(mes);
                string nombreDelDia = fecha.Value.ToString("dddd", new CultureInfo("es-ES"));

                Paragraph salto = new(new Text("\n"));

                float[] pointColumnWidths = { 400, 100F, 100F,200 };

                Table table = new(pointColumnWidths);
                // table.SetMargins(0, 100, 0, 100);
                // Cell c1 = new();
                // c1.SetBackgroundColor(ColorConstants.WHITE);
                // c1.SetBorder(Border.NO_BORDER);
                // c1.Add(img);

                Cell c3 = new();
                c3.Add(new Paragraph("CONVENIO DISTRIBUIDOR"));
                c3.SetBackgroundColor(ColorConstants.WHITE);
                c3.SetBorder(Border.NO_BORDER);
                c3.SetFontSize(14);
                c3.SetBold();

                float[] pointColumnWidths2 = { 800 };
                Table table2 = new(pointColumnWidths2);

                Text text1 = new Text(dia + " DE " + nombreDelMes.ToUpper() + " DE " + yyyy)
                    .SetBold();
                Cell c5tx1 = new();
                c5tx1.Add(new Paragraph(text1));
                c5tx1.SetBorder(Border.NO_BORDER);
                c5tx1.SetFontSize(8);
                c5tx1.SetTextAlignment(TextAlignment.RIGHT);

                Text text4 = new Text("Convenio de salida celebrado entre  como acreditante a quien en lo sucesivo se le designará como 'la empresa' y c. " + (solicitud.PersonaNombre).ToUpper() +" como acreditado, a quien en lo sucesivo se le denominará como 'el cliente', al tenor de las siguientes:");

                Cell c5tx4 = new();
                c5tx4.Add(new Paragraph(text4));
                c5tx1.SetBackgroundColor(ColorConstants.WHITE);
                c5tx4.SetBorder(Border.NO_BORDER);
                c5tx4.SetFontSize(9);

                 table.AddCell(c3);
                table.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table.AddCell(c5tx1);
                
                table2.AddCell(c5tx4);

                float[] pointColumnWidths0 = { 300, 300, 100 };
                Table table0 = new(pointColumnWidths0);

                Text text1t0 = new Text("CLAUSULAS: ")
                    .SetBold();

                Cell c1tx1 = new();
                c1tx1.Add(new Paragraph(text1t0));
                c1tx1.SetBorder(Border.NO_BORDER);
                c1tx1.SetFontSize(9);

               
                table0.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table0.AddCell(c1tx1);
                table0.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                

                float[] pointColumnWidths3 = { 800 };
                Table table3 = new(pointColumnWidths3);

                Text text5 = new Text("PRIMERA. Se establece que la c. " + (solicitud.PersonaNombre).ToUpper() +" realiza el día " + nombreDelDia.ToUpper() +  " del " + dia + " DE " + nombreDelMes.ToUpper() + " DE " + yyyy +" un convenio de salida para cubrir el adeudo que tiene con la empresa  siendo este por la cantidad " + solicitud.SaldoActual.ToString("C", new CultureInfo("en-US")) + " considerado que " + solicitud.SaldoActual.ToString("C", new CultureInfo("en-US")) + " son de vale efectivo y $0.00 de préstamo personal.");

                Cell c1tx3 = new();
                c1tx3.Add(new Paragraph(text5));
                c1tx3.SetBackgroundColor(ColorConstants.WHITE);
                c1tx3.SetBorder(Border.NO_BORDER);
                c1tx3.SetFontSize(9);

                Text text6 = new Text("SEGUNDA. el convenio de salida es liquidar con la cantidad de " + solicitud.SaldoActual.ToString("C", new CultureInfo("en-US")) + " ya que al cumplimiento se del mismo en tiempo y forma será aplicado un descuento del " + solicitud.PorcientoQuita + "% realizando los pagos como se indican:");

                Cell c2tx3 = new();
                c2tx3.Add(new Paragraph(text6));
                c2tx3.SetBackgroundColor(ColorConstants.WHITE);
                c2tx3.SetBorder(Border.NO_BORDER);
                c2tx3.SetFontSize(9);

                table3.AddCell(c1tx3);
                table3.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table3.AddCell(c2tx3);
                table3.AddCell(new Cell().SetBorder(Border.NO_BORDER));

                float[] pointColumnWidths5 = { 120,100,100,100,50 };
                Table table5 = new(pointColumnWidths5);

                Text text7 = new Text("NoPlazo")
                    .SetBold();

                Cell c1tx5 = new();
                c1tx5.Add(new Paragraph(text7));
                c1tx5.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
                c1tx5.SetTextAlignment(TextAlignment.CENTER);
                c1tx5.SetVerticalAlignment(VerticalAlignment.MIDDLE);
                c1tx5.SetFontSize(9);

                Text text8 = new Text("Fecha Pago")
                    .SetBold();

                Cell c2tx5 = new();
                c2tx5.Add(new Paragraph(text8));
                c2tx5.SetBackgroundColor(ColorConstants.WHITE);
                c2tx5.SetFontSize(9);
                c2tx5.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
                c2tx5.SetTextAlignment(TextAlignment.CENTER);
                c2tx5.SetVerticalAlignment(VerticalAlignment.MIDDLE);

                Text text9 = new Text("Importe")
                    .SetBold();

                Cell c3tx5 = new();
                c3tx5.Add(new Paragraph(text9));
                c3tx5.SetBackgroundColor(ColorConstants.WHITE);
                c3tx5.SetFontSize(9);
                c3tx5.SetBackgroundColor(ColorConstants.LIGHT_GRAY);
                c3tx5.SetTextAlignment(TextAlignment.CENTER);
                c3tx5.SetVerticalAlignment(VerticalAlignment.MIDDLE);

                table5.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table5.AddCell(c1tx5);
                table5.AddCell(c2tx5);
                table5.AddCell(c3tx5);
                table5.AddCell(new Cell().SetBorder(Border.NO_BORDER));

                var obj = new
                {
                    DistribuidorID = solicitud.DistribuidorID

                };
            var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Reestructuras.PlanPagosRes>("EXEC Reestructura.pa_PlanPagosConvenios @DistribuidorID", obj).ToArrayAsync();

                foreach (var item in res)
                {
                    Cell np = new();
                    np.Add(new Paragraph(item.NumeroPago.ToString()));
                    np.SetBackgroundColor(ColorConstants.WHITE);
                    np.SetTextAlignment(TextAlignment.CENTER);
                    np.SetFontSize(8);

                    Cell fchP = new();
                    fchP.Add(new Paragraph(item.FechaVencimiento.ToString("dd/MM/yyyy")));
                    fchP.SetBackgroundColor(ColorConstants.WHITE);
                    fchP.SetTextAlignment(TextAlignment.CENTER);
                    fchP.SetFontSize(8);

                    Cell Imp = new();
                    Imp.Add(new Paragraph(item.TotalCapital.ToString("C", new CultureInfo("en-US"))));
                    Imp.SetBackgroundColor(ColorConstants.WHITE);
                    Imp.SetTextAlignment(TextAlignment.CENTER);
                    Imp.SetFontSize(8);

                    table5.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                    table5.AddCell(np);
                    table5.AddCell(fchP);
                    table5.AddCell(Imp);
                    table5.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                }

                    doc.Add(table);
                    doc.Add(table2);
                    doc.Add(salto);
                    doc.Add(table0);
                    doc.Add(table3);
                    doc.Add(salto);
                    doc.Add(table5);
                    doc.Add(salto);

               if (res.Count() > 8)
                {
                    pdfDocument.AddNewPage();

                    doc.Add(new AreaBreak(AreaBreakType.NEXT_PAGE));

                    float[] pointColumnWidths6 = { 800 };
                    Table table6 = new(pointColumnWidths6);

                    Text text10 = new Text("TERCERA.  Una vez recibido el ultimo abono, se hará devolución a 'EL CLIENTE' del pagare suscrito por el mismo, el cual obra en poder de 'LA EMPRESA', como respaldo jurídico del adeudo.");

                    Cell c1tx6 = new();
                    c1tx6.Add(new Paragraph(text10));
                    c1tx6.SetBackgroundColor(ColorConstants.WHITE);
                    c1tx6.SetBorder(Border.NO_BORDER);
                    c1tx6.SetFontSize(9);

                    Text text11 = new Text("CUARTA.  Cabe mencionar que dicho convenio debe cumplirse en las fechas estipuladas para aplicar la liquidación mencionada, ya que de lo contrario se tomara como negativa de pago, por lo que se invalidara este convenio y se cobrara el saldo total de la deuda que al día de hoy es de " + solicitud.SaldoActual.ToString("C", new CultureInfo("en-US")) + ", más los cargos que se generen.");

                    Cell c2tx6 = new();
                    c2tx6.Add(new Paragraph(text11));
                    c2tx6.SetBackgroundColor(ColorConstants.WHITE);
                    c2tx6.SetBorder(Border.NO_BORDER);
                    c2tx6.SetFontSize(9);

                    Text text12 = new Text("Ambas partes estando conformes con el contenido y clausulado del presente convenio de salida lo firman el día " + nombreDelDia.ToUpper() + " del " + dia + " DE " + nombreDelMes.ToUpper() + " DE " + yyyy + " al margen en cada una de sus hojas y al final en esta ultima para todos los efectos legales a que haya lugar.");

                    Cell c3tx6 = new();
                    c3tx6.Add(new Paragraph(text12));
                    c3tx6.SetBackgroundColor(ColorConstants.WHITE);
                    c3tx6.SetBorder(Border.NO_BORDER);
                    c3tx6.SetFontSize(9);

                    table6.AddCell(c1tx6);
                    table6.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                    table6.AddCell(c2tx6);
                    table6.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                    table6.AddCell(c3tx6);
                    table6.AddCell(new Cell().SetBorder(Border.NO_BORDER));

                    float[] pointColumnWidths4 = { 90, 350, 80, 350, 80 };
                    Table table4 = new(pointColumnWidths4);

                    Text text3t4 = new Text("_______________________________").SetBold();

                    Cell c1tx3t4 = new();
                    c1tx3t4.Add(new Paragraph(text3t4));
                    c1tx3t4.SetBorder(Border.NO_BORDER);
                    c1tx3t4.SetTextAlignment(TextAlignment.CENTER);
                    c1tx3t4.SetFontSize(10);

                    Text text4t4 = new Text("_______________________________").SetBold();

                    Cell c1tx4t4 = new();
                    c1tx4t4.Add(new Paragraph(text4t4));
                    c1tx4t4.SetBorder(Border.NO_BORDER);
                    c1tx4t4.SetTextAlignment(TextAlignment.CENTER);
                    c1tx4t4.SetFontSize(10);

                    Text text1t4 = new Text("CLIENTE");

                    Cell c1tx1t4 = new();
                    c1tx1t4.Add(new Paragraph(text1t4));
                    c1tx1t4.SetBorder(Border.NO_BORDER);
                    c1tx1t4.SetTextAlignment(TextAlignment.CENTER);
                    c1tx1t4.SetFontSize(10);

                    Text text2t4 = new Text("EMPRESA");

                    Cell c1tx2t4 = new();
                    c1tx2t4.Add(new Paragraph(text2t4));
                    c1tx2t4.SetBorder(Border.NO_BORDER);
                    c1tx2t4.SetTextAlignment(TextAlignment.CENTER);
                    c1tx2t4.SetFontSize(10);

                    Text text5t4 = new Text(solicitud.PersonaNombre.ToUpper());

                    Cell c1tx5t4 = new();
                    c1tx5t4.Add(new Paragraph(text5t4));
                    c1tx5t4.SetBorder(Border.NO_BORDER);
                    c1tx5t4.SetTextAlignment(TextAlignment.CENTER);
                    c1tx5t4.SetFontSize(10);

                    table4.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                    table4.AddCell(c1tx3t4);
                    table4.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                    table4.AddCell(c1tx4t4);
                    table4.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                    table4.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                    table4.AddCell(c1tx1t4);
                    table4.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                    table4.AddCell(c1tx2t4);
                    table4.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                    table4.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                    table4.AddCell(c1tx5t4);

                    doc.Add(table6);
                    // doc.Add(new AreaBreak(AreaBreakType.NEXT_PAGE)); // Salto de página
                    doc.Add(table4);
                }
                else
                {
                       float[] pointColumnWidths6 = { 800 };
                Table table6 = new(pointColumnWidths6);

                Text text10 = new Text("TERCERA.  Una vez recibido el ultimo abono , se hará devolución a 'EL CLIENTE' del pagare suscrito por el mismo, el cual obra en poder de 'LA EMPRESA', como respaldo jurídico del adeudo.");

                Cell c1tx6 = new();
                c1tx6.Add(new Paragraph(text10));
                c1tx6.SetBackgroundColor(ColorConstants.WHITE);
                c1tx6.SetBorder(Border.NO_BORDER);
                c1tx6.SetFontSize(9);

                Text text11 = new Text("CUARTA.  Cabe mencionar que dicho convenio debe cumplirse en las fechas estipuladas para aplicar la liquidación mencionada, ya que de lo contrario se tomara como negativa de pago, por lo que se invalidara este convenio y se cobrara el saldo total de la deuda que al día de hoy es de " + solicitud.SaldoActual.ToString("C", new CultureInfo("en-US")) + ", mas los cargos que se generen.");

                Cell c2tx6 = new();
                c2tx6.Add(new Paragraph(text11));
                c2tx6.SetBackgroundColor(ColorConstants.WHITE);
                c2tx6.SetBorder(Border.NO_BORDER);
                c2tx6.SetFontSize(9);

                Text text12 = new Text("Ambas partes estando conformes con el contenido y clausulado del presente convenio de salida lo firman el día " + nombreDelDia.ToUpper() +  " del " + dia + " DE " + nombreDelMes.ToUpper() + " DE " + yyyy +" al margen en cada una de sus hojas y al final en esta ultima para todos los efectos legales a que haya lugar.");

                Cell c3tx6 = new();
                c3tx6.Add(new Paragraph(text12));
                c3tx6.SetBackgroundColor(ColorConstants.WHITE);
                c3tx6.SetBorder(Border.NO_BORDER);
                c3tx6.SetFontSize(9);

                table6.AddCell(c1tx6);
                table6.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table6.AddCell(c2tx6);
                table6.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table6.AddCell(c3tx6);
                table6.AddCell(new Cell().SetBorder(Border.NO_BORDER));

                float[] pointColumnWidths4 = { 90,350, 80, 350,80 };
                Table table4 = new(pointColumnWidths4);
//8 para arriba en otra pag

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

                Text text1t4 = new Text("CLIENTE");

                Cell c1tx1t4 = new();
                c1tx1t4.Add(new Paragraph(text1t4));
                c1tx1t4.SetBorder(Border.NO_BORDER);
                c1tx1t4.SetTextAlignment(TextAlignment.CENTER);
                c1tx1t4.SetFontSize(10);

                Text text2t4 = new Text("EMPRESA");

                Cell c1tx2t4 = new();
                c1tx2t4.Add(new Paragraph(text2t4));
                c1tx2t4.SetBorder(Border.NO_BORDER);
                c1tx2t4.SetTextAlignment(TextAlignment.CENTER);
                c1tx2t4.SetFontSize(10);

                 Text text5t4 = new Text(solicitud.PersonaNombre.ToUpper());

                Cell c1tx5t4 = new();
                c1tx5t4.Add(new Paragraph(text5t4));
                c1tx5t4.SetBorder(Border.NO_BORDER);
                c1tx5t4.SetTextAlignment(TextAlignment.CENTER);
                c1tx5t4.SetFontSize(10);

                table4.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table4.AddCell(c1tx3t4);
                table4.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table4.AddCell(c1tx4t4);
                table4.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table4.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table4.AddCell(c1tx1t4);
                table4.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table4.AddCell(c1tx2t4);
                table4.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table4.AddCell(new Cell().SetBorder(Border.NO_BORDER));
                table4.AddCell(c1tx5t4);


                    doc.Add(table6);
                    doc.Add(salto);
                    doc.Add(salto);
                    doc.Add(table4);
                }

               
               

                // data = ImageDataFactory.Create(logo);

                // Image wmImg = new(data);
                
     
               

                float pWith = pdfDocument.GetDefaultPageSize().GetWidth();

                // float iWith = wmImg.GetImageWidth();

                float pHeight = pdfDocument.GetDefaultPageSize().GetHeight();

                // float iHeight = wmImg.GetImageHeight();

                // wmImg.SetFixedPosition((pWith / 2f) - (iWith / 2f), (pHeight / 2f) - (iHeight / 2f));
                // wmImg.SetOpacity(0.3f);
                // doc.Add(wmImg);
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

        [HttpPost]
        [Route("VerConvenioPP")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> VerConvenioPP(ConfiaWebApi.PeticionesRest.Reestructura.HDR.VerconvenioPP parData)
        {
            try
            {
                var obj = new
                {
                    parData.DistribuidorID
                };

                var plazos = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Reestructuras.PlanPagosRes>("EXEC Reestructura.pa_PlanPagosConvenios @DistribuidorID", obj).ToArrayAsync();
                // var plazo = plazos.Where(x => x.IDPlazo == pagos.IDPlazo).FirstOrDefault();
                await DBContext.Destroy();
                return Ok(plazos);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }


    }
}