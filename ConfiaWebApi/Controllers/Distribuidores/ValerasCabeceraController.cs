using ConfiaWebApi.Code;
using ConfiaWebApi.ModlesSP.Distribuidores;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.dbo;
using DBContext.DBConfia.Distribuidores;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.Distribuidores
{
    [Authorize]
    [ApiController]
    [Route("api/Distribuidor/[controller]")]
    public class ValerasCabeceraController : ControllerBase
    {
        private DBConfiaContext DBContext;
        public ValerasCabeceraController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        protected async Task<object> ObjectValeraCabecera(ValeraCabecera cabecera)
        {
            var res = new
            {
                cabecera.ValeraCabeceraID,
                Producto = (await cabecera.CH__PRODUCTO(DBContext)).FirstOrDefault(),
                Serie = (await cabecera.CH__SERIE(DBContext)).FirstOrDefault(),
                cabecera.FolioInicial,
                cabecera.FolioFinal,
                cabecera.Estatus,
                RegistroFecha = cabecera.RegistroFecha.ToString("dd/MM/yyyy"),
                cabecera.RegistroUsuarioId,
                cabecera.RegistroPersonaID,
                Fraccion = (await cabecera.CH__FRACCION(DBContext)).FirstOrDefault(),
                Tracking = (await cabecera.CH__TRACKING(DBContext)).FirstOrDefault(),
            };
            await DBContext.Destroy();
            return res;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Distribuidores.ValerasCabecera.Get parData)
        {
            if (parData.id != 0)
            {
                var cabecera = await DBContext.database.SingleByIdAsync<ValeraCabecera>(parData.id);
                var res = await ObjectValeraCabecera(cabecera);
                await DBContext.Destroy();
                return Ok(res);
            }


            List<object> respList = new List<object>();
            int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
            var ListCabeceras = await DBContext.database.QueryAsync<ValerasCabecera_VW>("WHERE ProductoID = @0", ProductoID).ToArrayAsync();
            foreach (var item in ListCabeceras)
            {
                var res = new
                {
                    item.ValeraCabeceraID,
                    Producto = new { item.ProductoID, item.Producto },
                    Serie = new { item.serieId, item.serie },
                    item.FolioInicial,
                    item.FolioFinal,
                    item.Estatus,
                    RegistroFecha = item.RegistroFecha.ToString("dd/MM/yyyy"),
                    item.RegistroUsuarioId,
                    item.RegistroPersonaID,
                    Fraccion = new { item.ValerasFraccionID, item.Fraccion },
                    Tracking = new { item.ValeraTrackingEstatusID, item.TrackingEstatus, item.Color, item.Descripcion },
                };
                respList.Add(res);
                //respList.Add(await ObjectValeraCabecera(item));
            }
            await DBContext.Destroy();
            return Ok(respList);
        }

        [HttpPost]
        [Route("getFolioInicial")]
        [Authorize]
        [Code.TProteccionProducto]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> getFolioInicial(ConfiaWebApi.PeticionesRest.Distribuidores.ValerasCabecera.GetFolioInicial parData)
        {
            try
            {
                var ListValera = await DBContext.database.FetchAsync<ValeraCabecera>("WHERE  (serieId = @serieId) ORDER BY FolioFinal", parData);
                await DBContext.Destroy();
                if (ListValera.Count == 0)
                    return Ok(new { folioSiguiente = 1 });

                return Ok(new { folioSiguiente = ListValera.Last().FolioFinal + 1 });
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Distribuidores.ValerasCabecera.Add parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                parData.UsuarioId = UsuarioActual.UsuarioID;

                var res = await DBContext.database.QueryAsync<ValeraCabeceraInsRes>("EXEC Distribuidores.pa_Valera_Cabecera_Ins @ProductoID, @serieId, @FolioInicial, @FolioFinal, @UsuarioId, @ValerasFraccionID", parData).FirstOrDefaultAsync();

                //ESTAS DOS LINEAS HAY QUE COMENTARLAS Y/O BORRARLAS CUANDO SE HABILITE EL CODIGO DE BARRAS
                //var res2 = await DBContext.database.QueryAsync<ValeraCabeceraTracking>("EXEC Distribuidores.pa_Valera_Cabecera_Tracking @RegistroUsuarioId, @ValeraCabeceraID, 1", res).FirstOrDefaultAsync();
                //var res3 = await DBContext.database.QueryAsync<ValeraCabeceraTracking>("EXEC Distribuidores.pa_Valera_Cabecera_Tracking @RegistroUsuarioId, @ValeraCabeceraID, 2", res).FirstOrDefaultAsync();

                var cabecera = new ValeraCabecera()
                {
                    ValeraCabeceraID = res.ValeraCabeceraID,
                    ProductoID = res.ProductoID,
                    serieId = res.serieId,
                    FolioInicial = res.FolioInicial,
                    FolioFinal = res.FolioFinal,
                    Estatus = res.Estatus,
                    RegistroFecha = res.RegistroFecha,
                    RegistroUsuarioId = res.RegistroUsuarioId,
                    RegistroPersonaID = res.RegistroPersonaID,
                    ValerasFraccionID = res.ValerasFraccionID,
                    ValeraTrackingEstatusID = res.ValeraTrackingEstatusID, //<-- regresar a res.ValeraTrackingEstatusID
                };
                if (res.regresa == 1)
                {
                    var res1 = await ObjectValeraCabecera(cabecera);
                    await DBContext.Destroy();
                    return Ok(res1);
                }
                else
                {
                    await DBContext.Destroy();
                    return BadRequest(res.msj);
                }
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("accion")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Accion(ConfiaWebApi.PeticionesRest.Distribuidores.ValerasCabecera.Accion parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var obj = new { usuario = UsuarioActual.UsuarioID, ValeraCabeceraID = parData.ValeraCabeceraID, Evento = parData.Evento };
                var res = await DBContext.database.QueryAsync<ValeraCabeceraTracking>("EXEC Distribuidores.pa_Valera_Cabecera_Tracking @usuario, @ValeraCabeceraID, @Evento", obj).FirstOrDefaultAsync();

                var cabecera = new ValeraCabecera()
                {
                    ValeraCabeceraID = res.ValeraCabeceraID,
                    ProductoID = res.ProductoID,
                    serieId = res.serieId,
                    FolioInicial = res.FolioInicial,
                    FolioFinal = res.FolioFinal,
                    Estatus = res.Estatus,
                    RegistroFecha = res.RegistroFecha,
                    RegistroUsuarioId = res.RegistroUsuarioId,
                    RegistroPersonaID = res.RegistroPersonaID,
                    ValerasFraccionID = res.ValerasFraccionID,
                    ValeraTrackingEstatusID = res.ValeraTrackingEstatusID,
                };
                if (res.regresa == 1)
                {
                    var res1 = await ObjectValeraCabecera(cabecera);
                    await DBContext.Destroy();
                    return Ok(res1);
                }
                else
                {
                    await DBContext.Destroy();
                    return BadRequest(res.msj);
                }
                await DBContext.Destroy();
                return BadRequest("NOT IMPLEMENTED");
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("getFileM")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getFileM(ConfiaWebApi.PeticionesRest.Distribuidores.ValerasCabecera.DownLoadFileM parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                // var UsuarioActual = await ConexionBD.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());

                string SubjectCorreo = "Notificaci&oacute;n de Valeras";
                string TituloCorreo = "";
                string BodyCorreo = "";

                var producto = await DBContext.database.SingleByIdAsync<Productos>(ProductoID);
                var inQuery = string.Join(",", parData.ValeraCabeceraID);
                var valeras = await DBContext.database.FetchAsync<Valeras_VW>($"WHERE ValeraCabeceraID IN ({inQuery}) ORDER BY ValeraID ASC");
                var valeraCabecera = await DBContext.database.SingleByIdAsync<ValeraCabecera>(parData.ValeraCabeceraID);

                var fila = "";
                foreach (var item in valeras)
                {
                    fila += "<tr>";
                    fila += "<td class=\"text-center fs-3\">" + item.CodigoBarras + "</td>";
                    fila += "<td class=\"text-center fs-3\">" + item.SucNombre + "</td>";
                    fila += "<td class=\"text-center fs-3\">" + $"{item.Producto}/{item.serie}" + "</td>";
                    fila += "<td class=\"text-center fs-3\">" + item.FolioInicial + "</td>";
                    fila += "<td class=\"text-center fs-3\">" + item.FolioFinal + "</td>";
                    fila += "<td class=\"text-center fs-3\">" + item.TrackingEstatus + "</td>";
                    fila += "</tr>";
                }

                var valesXvalera = (valeraCabecera.FolioFinal + 1) - valeraCabecera.FolioInicial;
                valesXvalera = valesXvalera / valeras.Count();

                TituloCorreo = "Informaci&oacute;n de Lote de Valeras";
                BodyCorreo = $"<strong>Valera:</strong> {parData.ValeraCabeceraID}.&nbsp;&nbsp; <strong>Folios</strong>: {valeraCabecera.FolioInicial} - {valeraCabecera.FolioFinal}.&nbsp;&nbsp; " +
                    $"  <strong>Cantidad de Valeras</strong>: {valeras.Count()}.&nbsp;&nbsp; <strong>Producto</strong>: {valeras[0].Producto}.&nbsp;&nbsp; <strong>Serie</strong>: {valeras[0].serie}.&nbsp;&nbsp; <strong>Vales por Valera</strong>: {valesXvalera}";

                //PDF
                var prefijo_archivo = string.Concat(System.Guid.NewGuid().ToString().Replace("-", ""), "__");
                var listado_archivos = new string[1];

                var listado_imagenes = new List<string>();
                var logo = producto.Logo;
                Guid g = Guid.NewGuid();
                var logoname = string.Concat("logo", "_" + g.ToString() + ".jpeg");
                await System.IO.File.WriteAllBytesAsync(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "LogoImg", logoname), logo);
                listado_imagenes.Add(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "LogoImg", logoname));

                var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Distribuidores", "Valeras.html"));
                html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);

                html = html.Replace("@@FECHA", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                html = html.Replace("@@TABLA_BONIFICACION", fila);
                html = html.Replace("@@TITULO", SubjectCorreo);
                html = html.Replace("@@SUBTITULO", TituloCorreo);
                html = html.Replace("@@BODY", BodyCorreo);
                html = html.Replace("@@PERSONA", UsuarioActual.Nombre);
                html = html.Replace("@@LOGO", logoname);

                await System.IO.File.WriteAllTextAsync(Path.Combine(ConfiaWebApi.Code.PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1.html")), html);
                listado_archivos[0] = Path.Combine(ConfiaWebApi.Code.PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1.html"));

                var file_pdf = await Code.PDF.GenerarPDF(listado_archivos, Motivo: "Informaci&oacute;n de valeras", Localizacion: "Torreon, Coahuila, MEXICO", Contacto: "correo@contacto.com");

                List<string> correos = new List<string> { UsuarioActual.Correo };
                string Subject = "Notificación de Valeras";
                string Titulo = $"<h3>{TituloCorreo}</h3>";
                string Body = $"<label>{BodyCorreo}</label>";
                string subElements = "<p><i>Por favor no responda este mensaje, este correo fue enviado de una cuenta no supervisada.</i></p>";

                await MailSender.Enviar__Correo(correos, Subject, Titulo, Body, subElements, file_pdf.FileStream);
                await DBContext.Destroy();
                foreach (var imagen in listado_imagenes)
                    System.IO.File.Delete(imagen);
                return file_pdf;
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest("ERROR: " + ex.Message);
            }
        }
    }
}
