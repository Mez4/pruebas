using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Bancos;
using DBContext.DBConfia.Sistema;
using System.Collections;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Kernel.Geom;
using iText.Layout.Element;
using System.IO;
using iText.IO.Image;
using Microsoft.AspNetCore.Hosting;
using iText.Layout.Properties;
using iText.Kernel.Pdf.Canvas;
using iText.Kernel.Pdf.Canvas.Draw;
using ConfiaWebApi.ModlesSP.General;
using System.Collections.Generic;


namespace ConfiaWebApi.Controllers.General
{
    [Authorize]
    [ApiController]
    [Route("api/General/[controller]")]
    public class PersonaDatosBancariosController : ControllerBase
    {
        private DBConfiaContext DBContext;

        private readonly IWebHostEnvironment _env;

        public PersonaDatosBancariosController(DBConfiaContext _DBContext, IWebHostEnvironment env)
        {
            DBContext = _DBContext;
            _env = env;
        }

        [HttpGet]
        [Route("getById/{Id}")]
        [Authorize]
        // [Code.TProteccionProducto]
        public async Task<IActionResult> getById(long Id)
        {
            try
            {
                var res = await DBContext.database.SingleByIdAsync<PersonasDatosBancarios>(Id);
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
        [Route("GetDatosBancActivo")]
        [Authorize]
        // [Code.TProteccionProducto]
        public async Task<IActionResult> GetDatosBancActivo(PeticionesRest.General.PersonaDatosBancarios.Get parData)
        {
            try
            {

                var res = await DBContext.database.QueryAsync<Creditos_VW>("WHERE (PersonaID=@0) AND (TipoDesembolsoID = 7) AND (EstatusID='A')", parData.personaID).ToArrayAsync();
                await DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }
        [HttpGet]
        [Route("getByPersona/{personaID}")]
        [Authorize]
        // [Code.TProteccionProducto]
        public async Task<IActionResult> getByPersona(int personaID)
        {
            try
            {
                var res = await DBContext.database.FetchAsync<PersonasDatosBancarios>("WHERE  (personaID = @0)", personaID);
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpGet]
        [Route("getDatosancariosByPersona/{personaID}")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> getDatosancariosByPersona(int personaID)
        {
            try
            {
                // var res = await DBContext.database.FetchAsync<PersonasDatosBancarios_VW>("SELECT  DISTINCT dbpv.datoTipoDesc,dbpv.BancoNombre,dbpv.datoBancario FROM General.DatosBancariosPersonas_VW dbpv WHERE  (personaID = @0)", personaID);
                var res = await DBContext.database.FetchAsync<DatosBancariosPersonas_VW>("WHERE  (personaID = @0) AND activo = 1", personaID);
                await DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpGet]
        [Route("getDatosancariosPersona/{personaID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getDatosancariosPersona(int personaID)
        {
            try
            {
                // var res = await DBContext.database.FetchAsync<PersonasDatosBancarios_VW>("SELECT  DISTINCT dbpv.datoTipoDesc,dbpv.BancoNombre,dbpv.datoBancario FROM General.DatosBancariosPersonas_VW dbpv WHERE  (personaID = @0)", personaID);
                var res = await DBContext.database.FetchAsync<DatosBancariosPersonas_VW>("WHERE  (personaID = @0) AND activo = 1", personaID);
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
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.General.PersonaDatosBancarios.Get parData)
        {

            if (parData.cveBancoRef != 0 && parData.datoTipoID != 0)
            {
                try
                {
                    var resS = await DBContext.database.FetchAsync<PersonasDatosBancarios>("WHERE (personaID = @personaID) AND (cveBancoRef = @cveBancoRef) AND (datoTipoID = @datoTipoID)", parData);
                    await DBContext.Destroy();
                    return Ok(resS);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }

            if (parData.datoTipoID != 0 && parData.datoBancario != null)
            {
                try
                {
                    var resS = await DBContext.database.SingleByIdAsync<PersonasDatosBancarios>(new { parData.personaID, parData.datoTipoID, parData.datoBancario });
                    await DBContext.Destroy();
                    return Ok(resS);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }

            if (parData.cveBancoRef != 0)
            {
                try
                {
                    var resS = await DBContext.database.FetchAsync<PersonasDatosBancarios>("WHERE (personaID = @personaID) AND (cveBancoRef = @cveBancoRef)", parData);
                    await DBContext.Destroy();
                    return Ok(resS);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }


            var persona = await DBContext.database.QueryAsync<Personas_VW>("SELECT PersonaID, TelefonoMovil FROM General.Personas_VW WHERE (PersonaID = @0)", parData.personaID).FirstOrDefaultAsync();

            var bancos = await DBContext.database.FetchAsync<CatalogoBancos>("SELECT cb.BancoID, cb.Nombre FROM General.PersonasDatosBancarios AS db INNER JOIN Bancos.CatalogoBancos AS cb ON db.cveBancoRef = cb.BancoID WHERE (db.personaID = @0) AND (db.activo = 1) GROUP BY cb.BancoID, cb.Nombre", parData.personaID);

            // var datos = await DBContext.database.FetchAsync<PersonasDatosBancarios>("WHERE personaID = @0 ", parData.personaID);
             var datosBan = await DBContext.database.QueryAsync<PersonasDatosBancarios>("WHERE (personaID = @0) AND (activo = 1)", parData.personaID).FirstOrDefaultAsync();

            // ArrayList DatosBancarios = new();

            // foreach (var dato in datos)
            // {
            //    DatosBancarios.Add(new
            //    {
            //        dato.datoTipoID,
            //        dato.datoBancario
            //    });
            // }

             if (datosBan == null)
                {
                    return NotFound("No se encontraron datos bancarios activos.");
                }

            var res = new
            {
                persona.PersonaID,
                persona.TelefonoMovil,
                bancos,
                datosBan.datoBancario,
                datosBan.cveBancoRef,
                datosBan.datoTipoID
                
            };

            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("getbyprod")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetbyProd(PeticionesRest.General.PersonaDatosBancarios.Get parData)
        {

            if (parData.cveBancoRef != 0 && parData.datoTipoID != 0)
            {
                try
                {
                    var resS = await DBContext.database.FetchAsync<PersonasDatosBancarios>("WHERE (personaID = @personaID) AND (cveBancoRef = @cveBancoRef) AND (datoTipoID = @datoTipoID)", parData);
                    await DBContext.Destroy();
                    return Ok(resS);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }

            if (parData.datoTipoID != 0 && parData.datoBancario != null)
            {
                try
                {
                    var resS = await DBContext.database.SingleByIdAsync<PersonasDatosBancarios>(new { parData.personaID, parData.datoTipoID, parData.datoBancario });
                    await DBContext.Destroy();
                    return Ok(resS);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }

            if (parData.cveBancoRef != 0)
            {
                try
                {
                    var resS = await DBContext.database.FetchAsync<PersonasDatosBancarios>("WHERE (personaID = @personaID) AND (cveBancoRef = @cveBancoRef)", parData);
                    await DBContext.Destroy();
                    return Ok(resS);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }


            var persona = await DBContext.database.QueryAsync<Personas_VW>("SELECT PersonaID, TelefonoMovil FROM General.Personas_VW WHERE (PersonaID = @0)", parData.personaID).FirstOrDefaultAsync();

            var bancos = await DBContext.database.FetchAsync<CatalogoBancos>("SELECT cb.BancoID, cb.Nombre FROM General.PersonasDatosBancarios AS db INNER JOIN Bancos.CatalogoBancos AS cb ON db.cveBancoRef = cb.BancoID WHERE (db.personaID = @0) GROUP BY cb.BancoID, cb.Nombre", parData.personaID);

            //var datos = await DBContext.database.FetchAsync<PersonasDatosBancarios>("WHERE personaID = @0 ", parData.personaID);

            //ArrayList DatosBancarios = new();

            //foreach (var dato in datos)
            //{
            //    DatosBancarios.Add(new
            //    {
            //        dato.datoTipoID,
            //        dato.datoBancario
            //    });
            //}

            var res = new
            {
                persona.PersonaID,
                persona.TelefonoMovil,
                bancos
            };

            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(PeticionesRest.General.PersonaDatosBancarios.Add parData)
        {
            try
            {
                var Persona = await DBContext.database.SingleByIdAsync<Personas>(parData.personaID);
                //Persona.TelefonoMovil = parData.TelefonoMovil;

                //await DBContext.database.UpdateAsync(Persona);

                ArrayList res = new();

                foreach (var DatoBancario in parData.DatosBancarios)
                {
                    //var PersonaDatosBancarios = await DBContext.database.SingleOrDefaultByIdAsync<PersonasDatosBancarios>(new { parData.personaID, DatoBancario.datoTipoID, DatoBancario.datoBancario });

                    var PersonaDatosBancarios = await DBContext.database.QueryAsync<PersonasDatosBancarios>("WHERE personaID = @0 AND datoTipoID = @1 AND cveBancoRef = @2", parData.personaID, DatoBancario.datoTipoID, parData.cveBancoRef).FirstOrDefaultAsync();

                    if (PersonaDatosBancarios == null)
                    {
                        if (DatoBancario.datoBancario.Length > 0)
                        {

                            PersonaDatosBancarios = new PersonasDatosBancarios()
                            {
                                personaID = parData.personaID,
                                datoTipoID = DatoBancario.datoTipoID,
                                cveBancoRef = parData.cveBancoRef,
                                datoBancario = DatoBancario.datoBancario,
                                fechaRegistro = DateTime.Now,
                                activo = true
                            };

                            await DBContext.database.InsertAsync(PersonaDatosBancarios);

                            res.Add(new
                            {
                                PersonaDatosBancarios
                            });
                        }
                    }
                    else
                    {
                        if (DatoBancario.datoBancario.Length > 0)
                        {
                            PersonaDatosBancarios.cveBancoRef = parData.cveBancoRef;
                            PersonaDatosBancarios.datoBancario = DatoBancario.datoBancario;

                            await DBContext.database.UpdateAsync(PersonaDatosBancarios);

                            res.Add(new
                            {
                                PersonaDatosBancarios
                            });
                        }
                    }
                }

                await DBContext.Destroy();
                return Ok(new { Persona, res });
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
        
        [HttpPost]
        [Route("addReplace")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> AddReplace(PeticionesRest.General.PersonaDatosBancarios.AddReplace parData)
        {
            try
            {
                var Persona = await DBContext.database.SingleByIdAsync<Personas>(parData.personaID);

                var Stored = "EXEC General.Pa_ActualizarTelefonoMovilPersona @PersonaID, @Telefono, @UsuarioIDModifica";

                var objValues = new
                {
                    PersonaID = parData.personaID,
                    Telefono = parData.TelefonoMovil,
                    UsuarioIDModifica = parData.UsuarioModificaID
                };

                await DBContext.database.QueryAsync<ActualizaTel>(Stored, objValues).ToArrayAsync();

                ArrayList res = new();
                List<string> mensajes = new();

                foreach (var DatoBancario in parData.DatosBancarios)
                {
                    if (DatoBancario.datoBancario.Length > 0)
                    {
                        // Verificar si ya existe activo
                        var existeActivo = await DBContext.database.QueryAsync<PersonasDatosBancarios>(
                            "WHERE personaID = @0 AND datoTipoID = @1 AND cveBancoRef = @2 AND datoBancario = @3 AND activo = 1",
                            parData.personaID, DatoBancario.datoTipoID, parData.cveBancoRef, DatoBancario.datoBancario
                        ).AnyAsync();

                        if (existeActivo)
                        {
                            mensajes.Add($"El dato bancario '{DatoBancario.datoBancario}' ya existe y está activo.");
                            continue;
                        }

                        // Verificar si ya existe inactivo
                        var existeInactivo = await DBContext.database.QueryAsync<PersonasDatosBancarios>(
                            "WHERE personaID = @0 AND datoTipoID = @1 AND cveBancoRef = @2 AND datoBancario = @3 AND activo = 0",
                            parData.personaID, DatoBancario.datoTipoID, parData.cveBancoRef, DatoBancario.datoBancario
                        ).AnyAsync();

                        if (existeInactivo)
                        {
                            mensajes.Add($"El dato bancario '{DatoBancario.datoBancario}' ya existe pero está deshabilitado. No se insertó nuevamente.");
                            continue;
                        }

                        // Insertar nuevo dato bancario
                        var nuevoDato = new PersonasDatosBancarios()
                        {
                            personaID = parData.personaID,
                            datoTipoID = DatoBancario.datoTipoID,
                            cveBancoRef = parData.cveBancoRef,
                            datoBancario = DatoBancario.datoBancario,
                            fechaRegistro = DateTime.Now,
                            activo = true
                        };

                        await DBContext.database.InsertAsync(nuevoDato);

                        res.Add(new
                        {
                            PersonaDatosBancarios = nuevoDato
                        });
                    }
                }

                await DBContext.Destroy();
                return Ok(new { Persona, DatosInsertados = res, Mensajes = mensajes });

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }



        [HttpPost]
        [Route("pdf")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> Pdf(PeticionesRest.General.PersonaDatosBancarios.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                var Producto = await DBContext.database.SingleByIdAsync<Productos>(producto);

                var persona = await DBContext.database.QueryAsync<Personas_VW>("SELECT NombreCompleto, PersonaID, TelefonoMovil FROM General.Personas_VW WHERE (PersonaID = @0)", parData.personaID).FirstOrDefaultAsync();

                var datos = await DBContext.database.FetchAsync<PersonasDatosBancarios>("WHERE personaID = @0 AND cveBancoRef = @1 AND activo = 1", parData.personaID, parData.cveBancoRef);

                var clabe = (from dato in datos
                             where dato.datoTipoID == 1
                             select dato).FirstOrDefault();

                var tarjeta = (from dato in datos
                               where dato.datoTipoID == 2
                               select dato).FirstOrDefault();

                var cuenta = (from dato in datos
                              where dato.datoTipoID == 3
                              select dato).FirstOrDefault();

                var banco = await DBContext.database.SingleByIdAsync<CatalogoBancos>(parData.cveBancoRef);

                var logo = Producto.Logo;

                MemoryStream ms = new();

                PdfWriter pw = new(ms);

                PdfDocument pdfDocument = new(pw);

                Document doc = new(pdfDocument, PageSize.LETTER);

                LineSeparator ls = new(new SolidLine());

                ls.SetMarginLeft(100);

                ls.SetMarginRight(100);

                Paragraph newline = new(new Text("\n\n\n\n\n\n\n"));

                //PdfPage pdfPage = pdfDocument.AddNewPage();

                //PdfCanvas canvas = new(pdfPage);

                //canvas.MoveTo(150, 200);

                //canvas.LineTo(450, 200);

                //canvas.ClosePathStroke();

                doc.SetMargins(75, 75, 75, 75);

                // var imageFile = System.IO.Path.Combine(_env.ContentRootPath, "wwwroot/Sources", "logo4.png");

                byte[] imageFile = Producto.Logo;

                ImageData data = ImageDataFactory.Create(imageFile);

                Image img = new(data);

                img.SetHeight(60);

                Paragraph date = new Paragraph("Fecha: " + DateTime.Now.ToString("dd/MM/yyyy hh:mm"))
                .SetTextAlignment(TextAlignment.RIGHT)
                .SetFontSize(10);

                Paragraph title = new Paragraph("Confirmación de Datos")
                .SetTextAlignment(TextAlignment.CENTER)
                .SetFontSize(16)
                .SetBold();

                Paragraph name = new Paragraph("Nombre del cliente: " + persona.NombreCompleto)
                .SetTextAlignment(TextAlignment.LEFT)
                .SetFontSize(10);

                Paragraph tel = new Paragraph("Teléfono celular: " + persona.TelefonoMovil)
                .SetTextAlignment(TextAlignment.LEFT)
                .SetFontSize(10);

                Paragraph cia = new Paragraph("Compañia celular: " + parData.telefonia)
                .SetTextAlignment(TextAlignment.LEFT)
                .SetFontSize(10);

                Paragraph ban = new Paragraph("Banco: " + banco.Nombre)
                .SetTextAlignment(TextAlignment.LEFT)
                .SetFontSize(10);

                Paragraph card = new Paragraph("Número de tarjeta bancaria: " + tarjeta?.datoBancario)
                .SetTextAlignment(TextAlignment.LEFT)
                .SetFontSize(10);

                Paragraph sbc = new Paragraph("Clabe cuenta bancaria: " + clabe?.datoBancario)
                .SetTextAlignment(TextAlignment.LEFT)
                .SetFontSize(10);

                Paragraph account = new Paragraph("Número de cuenta bancaria: " + cuenta?.datoBancario)
                .SetTextAlignment(TextAlignment.LEFT)
                .SetFontSize(10);

                Paragraph parr1 = new Paragraph("***Reconozco que la información proporcionada de mis datos telefónicos y bancarios son verídicos y la línea de celular está a mi nombre para poder recibir código.")
                .SetTextAlignment(TextAlignment.JUSTIFIED)
                .SetFontSize(10);

                Paragraph parr2 = new Paragraph("***NOTA: La empresa no se hace responsable de comisiones cobradas por la instiltución bancaria proporcionada, en caso de que el usuario cuente con algún adeudo.")
                .SetTextAlignment(TextAlignment.JUSTIFIED)
                .SetFontSize(10);

                Paragraph parr3 = new Paragraph("***Reconozco que en ningún momento proporcioné el código de seguridad de mi tarjeta bancaria al personal de la empresa.")
                .SetTextAlignment(TextAlignment.JUSTIFIED)
                .SetFontSize(10);

                Paragraph sign = new Paragraph(persona.NombreCompleto + "\nFirma")
                   .SetTextAlignment(TextAlignment.CENTER);

                doc.Add(date);
                doc.Add(img);
                doc.Add(new Paragraph());
                doc.Add(new Paragraph());
                doc.Add(title);
                doc.Add(new Paragraph());
                doc.Add(name);
                doc.Add(tel);
                doc.Add(cia);
                doc.Add(ban);
                doc.Add(card);
                doc.Add(sbc);
                doc.Add(account);
                doc.Add(new Paragraph());
                doc.Add(new Paragraph());
                doc.Add(new Paragraph());
                doc.Add(parr1);
                doc.Add(parr2);
                doc.Add(parr3);
                doc.Add(newline);
                doc.Add(ls);
                doc.Add(sign);

                data = ImageDataFactory.Create(logo);

                Image wmImg = new(data);

                float pWith = pdfDocument.GetDefaultPageSize().GetWidth();

                float iWith = wmImg.GetImageWidth();

                float pHeight = pdfDocument.GetDefaultPageSize().GetHeight();

                float iHeight = wmImg.GetImageHeight();

                wmImg.SetFixedPosition((pWith / 2f) - (iWith / 2f), (pHeight / 2f) - (iHeight / 2f));
                wmImg.SetOpacity(0.2f);

                doc.Add(wmImg);

                doc.Close();

                byte[] byteStream = ms.ToArray();
                ms = new MemoryStream();
                ms.Write(byteStream, 0, byteStream.Length);
                ms.Position = 0;

                await DBContext.Destroy();
                return new FileStreamResult(ms, "application/pdf");
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }

        }

        protected async Task<object> ObjectpersonasDatosBancarios(PersonasDatosBancarios personasDatosBancarios)
        {
            var res = new
            {
                // personasDatosBancarios.personasDatosBancariosID,
                personaID = (await personasDatosBancarios.CH__PERSONA(DBContext)).FirstOrDefault(),
                datoTipoID = (await personasDatosBancarios.CH__DATO_BANCARIO_TIPO(DBContext)).FirstOrDefault(),
                cveBancoRef = (await personasDatosBancarios.CH__CNB(DBContext)).FirstOrDefault(),
                personasDatosBancarios.datoBancario,
                personasDatosBancarios.fechaRegistro,
                personasDatosBancarios.activo,

            };
            await DBContext.Destroy();
            return res;
        }
        protected async Task<object> ObjectpersonasDatosBancariosvw(PersonasDatosBancarios_VW personasDatosBancariosvw)
        {
            var res = new
            {
                // personasDatosBancarios.personasDatosBancariosID,
                personasDatosBancariosvw.personaID,
                personasDatosBancariosvw.datoTipoDesc,
                personasDatosBancariosvw.BancoNombre,
                personasDatosBancariosvw.datoBancario

            };
            await DBContext.Destroy();
            return res;
        }

        [HttpPost]
        [Route("pdfSPEI")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> PdfSPEI(PeticionesRest.General.PersonaDatosBancarios.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                var Producto = await DBContext.database.SingleByIdAsync<Productos>(producto);

                var CreditoSpei = await DBContext.database.QueryAsync<Creditos_VW>("WHERE CreditoId=@0", parData.CreditoId).FirstOrDefaultAsync();

                var PersonaID = CreditoSpei.PersonaID;

                var persona = await DBContext.database.QueryAsync<Personas_VW>("SELECT NombreCompleto, PersonaID, TelefonoMovil FROM General.Personas_VW WHERE (PersonaID = @0)", PersonaID).FirstOrDefaultAsync();

                var bancoSpei = DBContext.database.QueryAsync<PersonasDatosBancarios_VW>("WHERE personaID = @0", PersonaID).FirstOrDefaultAsync();

                var DatosBancarios = DBContext.database.QueryAsync<PersonasDatosBancarios_VW>("WHERE personasDatosBancariosID = @0", parData.personasDatosBancariosID).FirstOrDefaultAsync();

                var datos = await DBContext.database.FetchAsync<PersonasDatosBancarios_VW>("WHERE personaID = @0", PersonaID);

                var BancoIDPersona = await DBContext.database.QueryAsync<PersonasDatosBancarios_VW>("WHERE personaID = @0", PersonaID).FirstOrDefaultAsync();


                var clabe = (from dato in datos
                             where dato.datoTipoID == 1
                             select dato).FirstOrDefault();

                var tarjeta = (from dato in datos
                               where dato.datoTipoID == 2
                               select dato).FirstOrDefault();

                var cuenta = (from dato in datos
                              where dato.datoTipoID == 3
                              select dato).FirstOrDefault();

                var banco = await DBContext.database.QueryAsync<CatalogoBancos>("WHERE BancoID=@0", BancoIDPersona.BancoID).FirstOrDefaultAsync();

                var logo = Producto.Logo;

                MemoryStream ms = new();

                PdfWriter pw = new(ms);

                PdfDocument pdfDocument = new(pw);

                Document doc = new(pdfDocument, PageSize.LETTER);

                LineSeparator ls = new(new SolidLine());

                ls.SetMarginLeft(100);

                ls.SetMarginRight(100);

                Paragraph newline = new(new Text("\n\n\n\n\n\n\n"));

                //PdfPage pdfPage = pdfDocument.AddNewPage();

                //PdfCanvas canvas = new(pdfPage);

                //canvas.MoveTo(150, 200);

                //canvas.LineTo(450, 200);

                //canvas.ClosePathStroke();

                doc.SetMargins(75, 75, 75, 75);

                // var imageFile = System.IO.Path.Combine(_env.ContentRootPath, "wwwroot/Sources", "logo4.png");

                byte[] imageFile = Producto.Logo;

                ImageData data = ImageDataFactory.Create(imageFile);

                Image img = new(data);

                img.SetHeight(60);

                Paragraph date = new Paragraph("Fecha: " + DateTime.Now.ToString("dd/MM/yyyy hh:mm"))
                .SetTextAlignment(TextAlignment.RIGHT)
                .SetFontSize(10);

                Paragraph title = new Paragraph("Confirmación de Datos")
                .SetTextAlignment(TextAlignment.CENTER)
                .SetFontSize(16)
                .SetBold();

                Paragraph name = new Paragraph("Nombre del cliente: " + persona.NombreCompleto)
                .SetTextAlignment(TextAlignment.LEFT)
                .SetFontSize(10);

                Paragraph tel = new Paragraph("Teléfono celular: " + persona.TelefonoMovil)
                .SetTextAlignment(TextAlignment.LEFT)
                .SetFontSize(10);

                Paragraph cia = new Paragraph("Compañia celular: " + parData.telefonia)
                .SetTextAlignment(TextAlignment.LEFT)
                .SetFontSize(10);

                Paragraph ban = new Paragraph("Banco: " + banco.Nombre)
                .SetTextAlignment(TextAlignment.LEFT)
                .SetFontSize(10);

                Paragraph card = new Paragraph("Número de tarjeta bancaria: " + tarjeta?.datoBancario)
                .SetTextAlignment(TextAlignment.LEFT)
                .SetFontSize(10);

                Paragraph sbc = new Paragraph("Clabe cuenta bancaria: " + clabe?.datoBancario)
                .SetTextAlignment(TextAlignment.LEFT)
                .SetFontSize(10);

                Paragraph account = new Paragraph("Número de cuenta bancaria: " + cuenta?.datoBancario)
                .SetTextAlignment(TextAlignment.LEFT)
                .SetFontSize(10);

                Paragraph parr1 = new Paragraph("***Reconozco que la información proporcionada de mis datos telefónicos y bancarios son verídicos y la línea de celular está a mi nombre para poder recibir código.")
                .SetTextAlignment(TextAlignment.JUSTIFIED)
                .SetFontSize(10);

                Paragraph parr2 = new Paragraph("***NOTA: La empresa no se hace responsable de comisiones cobradas por la instiltución bancaria proporcionada, en caso de que el usuario cuente con algún adeudo.")
                .SetTextAlignment(TextAlignment.JUSTIFIED)
                .SetFontSize(10);

                Paragraph parr3 = new Paragraph("***Reconozco que en ningún momento proporcioné el código de seguridad de mi tarjeta bancaria al personal de la empresa.")
                .SetTextAlignment(TextAlignment.JUSTIFIED)
                .SetFontSize(10);

                Paragraph sign = new Paragraph(persona.NombreCompleto + "\nFirma")
                   .SetTextAlignment(TextAlignment.CENTER);

                doc.Add(date);
                doc.Add(img);
                doc.Add(new Paragraph());
                doc.Add(new Paragraph());
                doc.Add(title);
                doc.Add(new Paragraph());
                doc.Add(name);
                doc.Add(tel);
                doc.Add(cia);
                doc.Add(ban);
                doc.Add(card);
                doc.Add(sbc);
                doc.Add(account);
                doc.Add(new Paragraph());
                doc.Add(new Paragraph());
                doc.Add(new Paragraph());
                doc.Add(parr1);
                doc.Add(parr2);
                doc.Add(parr3);
                doc.Add(newline);
                doc.Add(ls);
                doc.Add(sign);

                data = ImageDataFactory.Create(logo);

                Image wmImg = new(data);

                float pWith = pdfDocument.GetDefaultPageSize().GetWidth();

                float iWith = wmImg.GetImageWidth();

                float pHeight = pdfDocument.GetDefaultPageSize().GetHeight();

                float iHeight = wmImg.GetImageHeight();

                wmImg.SetFixedPosition((pWith / 2f) - (iWith / 2f), (pHeight / 2f) - (iHeight / 2f));
                wmImg.SetOpacity(0.2f);

                doc.Add(wmImg);

                doc.Close();

                byte[] byteStream = ms.ToArray();
                ms = new MemoryStream();
                ms.Write(byteStream, 0, byteStream.Length);
                ms.Position = 0;

                await DBContext.Destroy();
                return new FileStreamResult(ms, "application/pdf");
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }

        }

        protected async Task<object> ObjectpersonasDatosBancariosspei(PersonasDatosBancarios personasDatosBancarios)
        {
            var res = new
            {
                // personasDatosBancarios.personasDatosBancariosID,
                personaID = (await personasDatosBancarios.CH__PERSONA(DBContext)).FirstOrDefault(),
                datoTipoID = (await personasDatosBancarios.CH__DATO_BANCARIO_TIPO(DBContext)).FirstOrDefault(),
                cveBancoRef = (await personasDatosBancarios.CH__CNB(DBContext)).FirstOrDefault(),
                personasDatosBancarios.datoBancario,
                personasDatosBancarios.fechaRegistro,
                personasDatosBancarios.activo,

            };
            await DBContext.Destroy();
            return res;
        }
        protected async Task<object> ObjectpersonasDatosBancariosvwspei(PersonasDatosBancarios_VW personasDatosBancariosvw)
        {
            var res = new
            {
                // personasDatosBancarios.personasDatosBancariosID,
                personasDatosBancariosvw.personaID,
                personasDatosBancariosvw.datoTipoDesc,
                personasDatosBancariosvw.BancoNombre,
                personasDatosBancariosvw.datoBancario

            };
            await DBContext.Destroy();
            return res;
        }

        [HttpPost]
        [Route("addDatosBancarios")]
        [Authorize]
        [Code.TProteccionAdmin]
        // [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> add(PeticionesRest.General.PersonaDatosBancarios.addDatosBancarios parData)
        {
            try
            {
                var PersonasDatosBancarios = new PersonasDatosBancarios()
                {
                    personaID = parData.personaID,
                    datoTipoID = parData.datoTipoID,
                    cveBancoRef = parData.cveBancoRef,
                    datoBancario = parData.datoBancario,
                    fechaRegistro = DateTime.Now,
                    activo = true
                };
                await DBContext.database.InsertAsync(PersonasDatosBancarios);

                // var personasdatos = await DBContext.database.QueryAsync<PersonasDatosBancarios_VW>("WHERE personaID = @0", PersonasDatosBancarios.personaID).LastAsync();
                var personasdatos = await DBContext.database.QueryAsync<DatosBancariosPersonas_VW>("WHERE personaID = @0", PersonasDatosBancarios.personaID).LastAsync();

                var res = new
                {
                    personasdatos.personaID,
                    personasdatos.datoTipoID,
                    personasdatos.datoTipoDesc,
                    personasdatos.BancoNombre,
                    personasdatos.datoBancario
                };

                await DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }

        }

        // [HttpGet]
        // [Route("deshabilitar")]
        // [Authorize]
        // public async Task<IActionResult> DeshabilitarInput([FromQuery] int personaID)
        // {
        //     try
        //     {
        //         var sql = @"
        //             SELECT TOP 1 1
        //             FROM General.PersonasDatosBancarios pdb
        //             JOIN General.Personas p ON pdb.personaID = p.PersonaID
        //             WHERE p.ProductoID IS NOT NULL AND p.PersonaID = @0 and pdb.activo = 1
        //         ";

        //         var tieneDatosBancarios = false;

        //         await foreach (var resultado in DBContext.database.QueryAsync<int>(sql, personaID))
        //         {
        //             tieneDatosBancarios = resultado == 1;
        //             break; // Solo necesitamos el primero
        //         }

        //             return Ok(new { existe = tieneDatosBancarios });
        //         }
        //     catch (Exception ex)
        //     {
        //         return BadRequest(new { error = ex.Message });
        //     }
        //     finally
        //     {
        //         await DBContext.Destroy();
        //     }
        // }

        [HttpGet]
        [Route("deshabilitar")]
        [Authorize]
        public async Task<IActionResult> DeshabilitarInput([FromQuery] int PersonaID)
        {
            try
            {
                //Verifica si la persona ya tiene un dato bancario.
                var sql = @"
                   SELECT TOP 1
                        1
                        FROM General.PersonasDatosBancarios pdb
                        JOIN General.Personas p
                        ON pdb.personaID = p.PersonaID
                        WHERE p.PersonaID = @0 AND pdb.activo = 1
                ";

                // Ejecutar la consulta y verificar si existen datos bancarios.
                var tieneDatosBancarios = await DBContext.database.QueryAsync<int>(sql, PersonaID).FirstOrDefaultAsync() == 1;
                await DBContext.Destroy();

                // Devolver un objeto con el resultado de la verificación.
                return Ok(new { existe = tieneDatosBancarios });
            }
            catch (Exception ex)
            {
                // Manejar cualquier excepción y devolver un error.
                await DBContext.Destroy();
                return BadRequest(new { error = ex.Message });
            }
        }  

    }
}
