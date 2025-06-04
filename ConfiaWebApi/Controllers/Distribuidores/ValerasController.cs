using ConfiaWebApi.Code;
using ConfiaWebApi.ModlesSP.Distribuidores;
using ConfiaWebApi.PeticionesRest.Prospeccion.Documentos;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.dbo;
using DBContext.DBConfia.Distribuidores;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Tesoreria;

//using DBContext.DBConfia.IntegracionKeycloak;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.Distribuidores
{
    [Authorize]
    [ApiController]
    [Route("api/Distribuidor/[controller]")]
    public class ValerasController : ControllerBase
    {
        private DBConfiaContext ConexionBD;

        private IConfiguration Configuracion;

        public ValerasController(IConfiguration _Configuration, DBConfiaContext _DBContext)
        {
            this.Configuracion = _Configuration;
            ConexionBD = _DBContext;
        }



        protected async Task<object> ObjectValera(Valera valera)

        {

            var res = new
            {
                valera.ValeraID,
                //valera.ProductoID,
                producto = (await valera.CH__PRODUCTOS(ConexionBD)).FirstOrDefault(),
                valera.DistribuidorID,
                serie = (await valera.CH__VALERA_SERIE(ConexionBD)).FirstOrDefault(),
                valera.FolioInicial,
                valera.FolioFinal,
                valera.Estatus,
                RegistroFecha = valera.RegistroFecha.ToString("dd/MM/yyyy"),
                valera.RegistroUsuarioId,
                AsignaSucursal = (await ConexionBD.database.SingleByIdAsync<Sucursales>(valera.AsignaSucursalId)),
                AsignaSucursalFecha = valera.AsignaSucursalFecha?.ToString("dd/MM/yyyy"),
                valera.AsignaSucursalUsuarioId,
                ReciboSucursalFecha = valera.ReciboSucursalFecha?.ToString("dd/MM/yyyy"),
                valera.ReciboSucursalUsuarioId,
                AsignaDistribudiorFecha = valera.AsignaDistribudiorFecha?.ToString("dd/MM/yyyy"),
                valera.AsignaDistribudiorUsuarioId,
                CanceladoFecha = valera.CanceladoFecha?.ToString("dd/MM/yyyy"),
                valera.CanceladoUsuarioId,
                valeraTrackingEstatus = (await valera.CH__TRACKING(ConexionBD)).FirstOrDefault(),
                valera.EnvioSucursalNota,
                valera.ReciboSucursalNota,
                valera.CodigoBarras,
                SucursalEnviaValera = (await ConexionBD.database.SingleByIdAsync<Sucursales>(valera.SucursalEnviaValera)),
                valera.EnvioSucursalFecha
            };
            await ConexionBD.Destroy();
            return res;
        }

        [HttpPost]
        [Route("TipoUsuario")]
        [Authorize]
        // [Code.TProteccionProducto]
        public async Task<IActionResult> TipoUsuario([FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();


                var stored = "SELECT Creditos.GetTipoUsuario(@0) as [tipoUsuario]";
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Distribuidores.Valeras.TipoUsuarioCajera>(stored, UsuarioActual.UsuarioID).FirstOrDefaultAsync();

                var ProductoID = 0;
                var SucursalID = 0;
                if (res.tipoUsuario == 6)
                {
                    var CajasUsuarios = await ConexionBD.database.QueryAsync<CatalogoCajasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.UsuarioID).FirstOrDefaultAsync();
                    ProductoID = CajasUsuarios.ProductoID;
                    SucursalID = CajasUsuarios.SucursalID;
                }
                if (res.tipoUsuario == 3)
                {
                    var Gerente = await ConexionBD.database.QueryAsync<Gerentes>("WHERE UsuarioID=@0", UsuarioActual.UsuarioID).FirstOrDefaultAsync();
                    ProductoID = producto;
                    SucursalID = Gerente.SucursalID;
                }
                await ConexionBD.Destroy();

                var obj = new
                {
                    res.tipoUsuario,
                    ProductoID,
                    SucursalID
                };

                return Ok(obj);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Distribuidores.Valeras.Get parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            List<object> respList = new List<object>();

            if (parData.id != 0)
            {
                var valera = await ConexionBD.database.SingleByIdAsync<Valera>(parData.id);
                var res = await ObjectValera(valera);
                await ConexionBD.Destroy();
                return Ok(res);
            }

            // var query = "WHERE ProductoID = @0";
            // var sucursal = 0;
            // var Gerente = await ConexionBD.database.QueryAsync<Gerentes>("WHERE UsuarioID = @0", UsuarioActual.UsuarioID).FirstOrDefaultAsync();
            // sucursal = Gerente != null ? Gerente.SucursalID : 0;
            // query = sucursal > 0 ? $"{query} AND AsignaSucursalId = @1" : query;

            // int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());

            var spData = new {
                ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString()), 
                UsuarioID = UsuarioActual.UsuarioID
            };
            var ListValeras = await ConexionBD.database.QueryAsync<Valeras_VW>("EXEC Distribuidores.pa_GetValerasSucursal @ProductoID, @UsuarioID", spData).ToArrayAsync();
            // var ListValeras = await ConexionBD.database.QueryAsync<Valeras_VW>(query, ProductoID, sucursal).ToArrayAsync();
            foreach (var item in ListValeras)
            {
                var res = new
                {
                    item.ValeraID,
                    producto = new { item.ProductoID, item.Producto },
                    item.DistribuidorID,
                    serie = new { item.serieId, item.serie, item.serieDesc },
                    item.FolioInicial,
                    item.FolioFinal,
                    item.Estatus,
                    RegistroFecha = item.RegistroFecha.ToString("dd/MM/yyyy"),
                    item.RegistroUsuarioId,
                    AsignaSucursal = new { SucursalID = item.AsignaSucursalId, Nombre = item.SucNombre, item.DiasDeEntregaAprox },
                    AsignaSucursalFecha = "",
                    item.AsignaSucursalUsuarioId,
                    ReciboSucursalFecha = "",
                    item.ReciboSucursalUsuarioId,
                    AsignaDistribudiorFecha = "",
                    item.AsignaDistribudiorUsuarioId,
                    CanceladoFecha = "",
                    item.CanceladoUsuarioId,
                    valeraTrackingEstatus = new { item.ValeraTrackingEstatusID, item.TrackingEstatus, item.Color, item.Descripcion },
                    item.EnvioSucursalNota,
                    item.ReciboSucursalNota,
                    item.CodigoBarras,
                    SucursalEnviaValera = new { SucursalID = item.SucursalEnviaValera, Nombre = item.SucEnviaNombre },
                    item.EnvioSucursalFecha
                };
                respList.Add(res);
                //respList.Add(await ObjectValera(item));
            }
            await ConexionBD.Destroy();
             //Se comprimen los datos antes de mandarse
            byte[] compRespList;
            string base64CompressedString;
            byte[] bytes = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(respList));

            using (var memoryStream = new MemoryStream())
            {
                using (var gzipStream = new GZipStream(memoryStream, CompressionLevel.Optimal))
                {
                    gzipStream.Write(bytes, 0, bytes.Length);
                }
                compRespList = memoryStream.ToArray();
            }

            // Convert the compressed byte array to a Base64 string
            base64CompressedString = Convert.ToBase64String(compRespList);

            return Ok(base64CompressedString);

        }

        [HttpPost]
        [Route("updateSucursalM")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> UpdateSucursalM(ConfiaWebApi.PeticionesRest.Distribuidores.Valeras.UpdateSucursalM parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                // var UsuarioActual = await ConexionBD.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();

                DataTable dt = new DataTable();
                dt.Columns.Add("ID", typeof(int));
                foreach (var item in parData.Valeras)
                    dt.Rows.Add(item);

                SqlParameter param = new SqlParameter("@IDList", SqlDbType.Structured)
                {
                    TypeName = "dbo.IDList",
                    Value = dt
                };

                var obj = new { sucursalId = parData.AsignaSucursalId, ids = param, evento = 1, usuario = UsuarioActual.UsuarioID, nota = "" };
                var res = await ConexionBD.database.QueryAsync<ValeraAccionLote>("EXEC Distribuidores.pa_Valera_Accion_Lote @sucursalId, @ids, @evento, @usuario, @nota", obj).FirstOrDefaultAsync();
                await ConexionBD.Destroy();
                if (res.regresa == 1)
                    return Ok(res);
                else
                    await ConexionBD.Destroy();
                return BadRequest(res.msj);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("reupdateSucursalM")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> REUpdateSucursalM(ConfiaWebApi.PeticionesRest.Distribuidores.Valeras.UpdateSucursalM parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                // var UsuarioActual = await ConexionBD.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();

                DataTable dt = new DataTable();
                dt.Columns.Add("ID", typeof(int));
                foreach (var item in parData.Valeras)
                    dt.Rows.Add(item);

                SqlParameter param = new SqlParameter("@IDList", SqlDbType.Structured)
                {
                    TypeName = "dbo.IDList",
                    Value = dt
                };

                var obj = new { sucursalId = parData.AsignaSucursalId, ids = param, evento = 4, usuario = UsuarioActual.UsuarioID, nota = "" };
                var res = await ConexionBD.database.QueryAsync<ValeraAccionLote>("EXEC Distribuidores.pa_Valera_Accion_Lote_v2 @sucursalId, @ids, @evento, @usuario, @nota", obj).FirstOrDefaultAsync();
                await ConexionBD.Destroy();
                if (res.regresa == 1)
                    return Ok(res);
                else
                    return BadRequest(res.msj);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("updateEnvioM")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> UpdateEnvioM(ConfiaWebApi.PeticionesRest.Distribuidores.Valeras.UpdateEnvioM parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                // var UsuarioActual = await ConexionBD.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();

                DataTable dt = new DataTable();
                dt.Columns.Add("ID", typeof(int));
                foreach (var item in parData.Valeras)
                    dt.Rows.Add(item);

                SqlParameter param = new SqlParameter("@IDList", SqlDbType.Structured)
                {
                    TypeName = "dbo.IDList",
                    Value = dt
                };

                var obj = new { sucursalId = 0, ids = param, evento = 2, usuario = UsuarioActual.UsuarioID, nota = parData.EnvioSucursalNota };
                var res = await ConexionBD.database.QueryAsync<ValeraAccionLote>("EXEC Distribuidores.pa_Valera_Accion_Lote_v2 @sucursalId, @ids, @evento, @usuario, @nota", obj).FirstOrDefaultAsync();
                await ConexionBD.Destroy();
                if (res.regresa == 1)
                    return Ok(res);
                else
                    await ConexionBD.Destroy();
                return BadRequest(res.msj);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("updateReciboM")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> updateReciboM(ConfiaWebApi.PeticionesRest.Distribuidores.Valeras.UpdateReciboM parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                // var UsuarioActual = await ConexionBD.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();

                DataTable dt = new DataTable();
                dt.Columns.Add("ID", typeof(int));
                foreach (var item in parData.Valeras)
                    dt.Rows.Add(item);

                SqlParameter param = new SqlParameter("@IDList", SqlDbType.Structured)
                {
                    TypeName = "dbo.IDList",
                    Value = dt
                };

                var obj = new { sucursalId = 0, ids = param, evento = 3, usuario = UsuarioActual.UsuarioID, nota = parData.ReciboSucursalNota };
                var res = await ConexionBD.database.QueryAsync<ValeraAccionLote>("EXEC Distribuidores.pa_Valera_Accion_Lote @sucursalId, @ids, @evento, @usuario, @nota", obj).FirstOrDefaultAsync();
                await ConexionBD.Destroy();
                if (res.regresa == 1)
                    return Ok(res);
                else
                    await ConexionBD.Destroy();
                return BadRequest(res.msj);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("updateREEnvioM")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> UpdateREEnvioM(ConfiaWebApi.PeticionesRest.Distribuidores.Valeras.UpdateEnvioM parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                // var UsuarioActual = await ConexionBD.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();

                DataTable dt = new DataTable();
                dt.Columns.Add("ID", typeof(int));
                foreach (var item in parData.Valeras)
                    dt.Rows.Add(item);

                SqlParameter param = new SqlParameter("@IDList", SqlDbType.Structured)
                {
                    TypeName = "dbo.IDList",
                    Value = dt
                };

                var obj = new { sucursalId = parData.AsignaSucursalId, ids = param, evento = 5, usuario = UsuarioActual.UsuarioID, nota = parData.EnvioSucursalNota };
                var res = await ConexionBD.database.QueryAsync<ValeraAccionLote>("EXEC Distribuidores.pa_Valera_Accion_Lote_v2 @sucursalId, @ids, @evento, @usuario, @nota", obj).FirstOrDefaultAsync();
                await ConexionBD.Destroy();
                if (res.regresa == 1)
                    return Ok(res);
                else
                    await ConexionBD.Destroy();
                return BadRequest(res.msj);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("getFileM")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getFileM(ConfiaWebApi.PeticionesRest.Distribuidores.Valeras.DownLoadFileM parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                // var UsuarioActual = await ConexionBD.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());

                string SubjectCorreo = "Notificaci&oacute;n de Valeras";
                string TituloCorreo = "";
                string BodyCorreo = "";

                var producto = await ConexionBD.database.SingleByIdAsync<Productos>(ProductoID);
                var inQuery = string.Join(",", parData.Valeras);
                var valeras = await ConexionBD.database.FetchAsync<Valeras_VW>($"WHERE ValeraID IN ({inQuery})");

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

                int estatus = valeras[0].ValeraTrackingEstatusID;

                switch (estatus)
                {
                    case 4:
                        TituloCorreo = "Asignaci&oacute;n de Valeras a Sucursal";
                        BodyCorreo = $"Las siguientes valeras han sido asigandas a la sucursal {valeras[0].SucNombre}, es necesario que se inicie el proceso de env&iacute;o a su sucursal corresponiente.";
                        break;
                    case 5:
                        TituloCorreo = "Env&iacute;o de Valeras";
                        BodyCorreo = $"Las siguientes valeras han sido enviadas a su sucursal asignada, revisar en el sistema el detalle del env&iacute;o. NOTA: {valeras[0].EnvioSucursalNota}.";
                        break;
                    case 6:
                        TituloCorreo = "Recepci&oacute;n de Valeras";
                        BodyCorreo = $"Se han confirmado las siguientes valeras como recibidas en su sucursal asignada ({valeras[0].SucNombre}), ya es posible asignarlas a las socias desde el sistema. NOTA: {valeras[0].EnvioSucursalNota}.";
                        break;
                    case 11:
                        TituloCorreo = "Reasignaci&oacute;n de Valeras";
                        BodyCorreo = $"Las siguientes valeras han sido Reasigandas de la sucursal {valeras[0].SucEnviaNombre} a la sucursal {valeras[0].SucNombre}, es necesario que se inicie el proceso de env&iacute;o a su sucursal corresponiente (favor de coordinarse con las personas involucradas).";
                        break;
                    default:
                        TituloCorreo = "Movimiento de Valeras";
                        BodyCorreo = "Las siguientes valeras han sido ajustadas";
                        break;
                }

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

                var file_pdf = await Code.PDF.GenerarPDF(listado_archivos, Motivo: "Movimiento valera", Localizacion: "Torreon, Coahuila, MEXICO", Contacto: "correo@contacto.com");

                List<string> correos = new List<string> { UsuarioActual.Correo };
                string Subject = "Notificación de Valeras";
                string Titulo = $"<h3>{TituloCorreo}</h3>";
                string Body = $"<label>{BodyCorreo}</label>";
                string subElements = "<p><i>Por favor no responda este mensaje, este correo fue enviado de una cuenta no supervisada.</i></p>";

                //await MailSender.Enviar__Correo(correos, Subject, Titulo, Body, subElements, file_pdf.FileStream);
                await ConexionBD.Destroy();
                foreach (var imagen in listado_imagenes)
                    System.IO.File.Delete(imagen);
                return file_pdf;
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("ERROR: " + ex.Message);
            }
        }

        /*
        *****************************
        VALIDAR, CORRECCIÓN PENDIENTE
        *****************************
        **/
        [HttpPost]
        [Route("updateDistribuidor")]
        [Authorize]
        [Code.TProteccionProducto]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> UpdateDistribuidor(ConfiaWebApi.PeticionesRest.Distribuidores.Valeras.UpdateDistribuidor parData)
        {
            try
            {
                //return BadRequest("NOT IMPLEMENTED");

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
                //var UsuarioActual = await DBContext.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();

                var obj = new { usuario = UsuarioActual.UsuarioID, valeraID = parData.ValeraID, DistribuidoraID = parData.DistribuidorID, ProductoID, evento = 1, path = "", path2 = "", };
                var res = await ConexionBD.database.QueryAsync<ValeraAccion>("EXEC Distribuidores.pa_Valera_Accion @usuario, @valeraID, @DistribuidoraID, @ProductoID, @evento, @path, @path2", obj).FirstOrDefaultAsync();

                var valera = new Valera()
                {
                    ValeraID = res.ValeraID,
                    ProductoID = res.producto,
                    DistribuidorID = res.DistribuidorID,
                    serieId = res.serie,
                    FolioInicial = res.FolioInicial,
                    FolioFinal = res.FolioFinal,
                    Estatus = res.Estatus,
                    RegistroFecha = res.RegistroFecha,
                    RegistroUsuarioId = res.RegistroUsuarioId,
                    AsignaSucursalId = res.AsignaSucursalId,
                    AsignaSucursalFecha = res.AsignaSucursalFecha,
                    AsignaSucursalUsuarioId = res.AsignaSucursalUsuarioId,
                    ReciboSucursalFecha = res.ReciboSucursalFecha,
                    ReciboSucursalUsuarioId = res.ReciboSucursalUsuarioId,
                    AsignaDistribudiorFecha = res.AsignaDistribudiorFecha,
                    AsignaDistribudiorUsuarioId = res.AsignaDistribudiorUsuarioId,
                    CanceladoFecha = res.CanceladoFecha,
                    CanceladoUsuarioId = res.CanceladoUsuarioId,
                    ValeraTrackingEstatusID = res.valeraTrackingEstatus,
                    EnvioSucursalNota = res.EnvioSucursalNota,
                    ReciboSucursalNota = res.ReciboSucursalNota,
                    CodigoBarras = res.CodigoBarras,
                    SucursalEnviaValera = res.SucursalEnviaValera,


                };

                if (res.regresa == 1)
                {
                    var res1 = await ObjectValera(valera);
                    await ConexionBD.Destroy();
                    return Ok(res1);
                }
                else
                {
                    await ConexionBD.Destroy();
                    return BadRequest(res.msj);
                }
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("getFile")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getFile(ConfiaWebApi.PeticionesRest.Distribuidores.Valeras.DownLoadFile parData)
        {
            try
            {
                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());

                var distribuidor = await ConexionBD.database.QueryAsync<Distribuidores_VW>("WHERE DistribuidorID=@0 AND ProductoID = @1", parData.DistribuidorID, ProductoID).SingleOrDefaultAsync();
                var valera = await ConexionBD.database.SingleByIdAsync<Valera>(parData.ValeraID);
                var producto = (await valera.CH__PRODUCTOS(ConexionBD)).FirstOrDefault();
                var serie = (await valera.CH__VALERA_SERIE(ConexionBD)).FirstOrDefault();

                //PDF
                var prefijo_archivo = string.Concat(System.Guid.NewGuid().ToString().Replace("-", ""), "__");
                var listado_archivos = new string[1];

                var listado_imagenes = new List<string>();
                var logo = producto.Logo;
                Guid g = Guid.NewGuid();
                var logoname = string.Concat("logo", "_" + g.ToString() + ".jpeg");
                await System.IO.File.WriteAllBytesAsync(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "LogoImg", logoname), logo);
                listado_imagenes.Add(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "LogoImg", logoname));

                var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Distribuidores", "Caratula.html"));
                html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);

                html = html.Replace("@@FECHA_ENTREGA", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                html = html.Replace("@@DV", distribuidor.PersonaNombre);
                html = html.Replace("@@NDV", $"{distribuidor.DistribuidorID}");
                html = html.Replace("@@Producto", $"{producto.Producto}");
                html = html.Replace("@@SUCURSAL", distribuidor.Sucursal_Nombre);
                html = html.Replace("@@F_INICIAL", $"{valera.FolioInicial}");
                html = html.Replace("@@F_FINAL", $"{valera.FolioFinal}");
                html = html.Replace("@@PRODUCTO", $"{producto.Producto}");
                html = html.Replace("@@SERIE", $"{serie.serie}");
                html = html.Replace("@@LOGO", logoname);

                await System.IO.File.WriteAllTextAsync(Path.Combine(ConfiaWebApi.Code.PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1.html")), html);
                listado_archivos[0] = Path.Combine(ConfiaWebApi.Code.PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1.html"));
                await ConexionBD.Destroy();

                var pdfStream = await Code.PDF.GenerarPDF(listado_archivos, Motivo: "Contrato valera", Localizacion: "Torreon, Coahuila, MEXICO", Contacto: "correo@contacto.com");
                foreach (var imagen in listado_imagenes)
                    System.IO.File.Delete(imagen);
                return pdfStream;
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("ERROR: " + ex.Message);
            }
        }

        [Consumes("multipart/form-data")]
        [HttpPost]
        [Route("subirExpediente")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> SubirExpediente([FromForm] ConfiaWebApi.PeticionesRest.Distribuidores.Valeras.UploadFile parData)
        {
            try
            {

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var objEv = new { valeraID = parData.ValeraID };
                var resEv = await ConexionBD.database.QueryAsync<ValeraAccion>("EXEC Distribuidores.pa_GetEvidenciaEntregaValera @valeraID", objEv).ToArrayAsync();
                if (resEv.Length == 0)
                {
                    await ConexionBD.Destroy();
                    return BadRequest("NO SE HA SUBIDO EVIDENCIA DE ENTREGA DE VALERA"); ;
                    throw new Exception("NO SE HA SUBIDO EVIDENCIA DE ENTREGA DE VALERA");

                }

                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                var basicToken = Convert.ToBase64String(plainTextBytes);
                string path = Configuracion["BucketApi:AwsPath_Valeras"];
                var ext = Path.GetExtension(parData.doc.FileName);
                string file_name = $"{parData.ValeraID}{ext}";
                byte[] file_byte = FilesManager.ConvertFiletoByteArray(parData.doc);

                HttpContent bytesContent = new ByteArrayContent(file_byte);
                HttpContent stringContent = new StringContent(path);

                using (var client = new HttpClient())
                using (var formData = new MultipartFormDataContent())
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicToken); ;
                    formData.Add(stringContent, "path");
                    formData.Add(bytesContent, "file", $"{file_name}");
                    var response = await client.PostAsync($"{Configuracion["BucketApi:url"]}{Configuracion["BucketApi:uploadRequest"]}", formData);
                    if (response.IsSuccessStatusCode)
                    {
                        string pathSolicitud = $"{path}/{file_name}";
                        int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
                        var obj = new { usuario = UsuarioActual.UsuarioID, valeraID = parData.ValeraID, DistribuidoraID = 0, ProductoID, evento = 4, path = pathSolicitud, path2 = "" };
                        var res = await ConexionBD.database.QueryAsync<ValeraAccion>("EXEC Distribuidores.pa_Valera_Accion @usuario, @valeraID, @DistribuidoraID,@ProductoID, @evento, @path, @path2", obj).FirstOrDefaultAsync();

                        var valera = new Valera()
                        {
                            ValeraID = res.ValeraID,
                            ProductoID = res.producto,
                            DistribuidorID = res.DistribuidorID,
                            serieId = res.serie,
                            FolioInicial = res.FolioInicial,
                            FolioFinal = res.FolioFinal,
                            Estatus = res.Estatus,
                            RegistroFecha = res.RegistroFecha,
                            RegistroUsuarioId = res.RegistroUsuarioId,
                            AsignaSucursalId = res.AsignaSucursalId,
                            AsignaSucursalFecha = res.AsignaSucursalFecha,
                            AsignaSucursalUsuarioId = res.AsignaSucursalUsuarioId,
                            ReciboSucursalFecha = res.ReciboSucursalFecha,
                            ReciboSucursalUsuarioId = res.ReciboSucursalUsuarioId,
                            AsignaDistribudiorFecha = res.AsignaDistribudiorFecha,
                            AsignaDistribudiorUsuarioId = res.AsignaDistribudiorUsuarioId,
                            CanceladoFecha = res.CanceladoFecha,
                            CanceladoUsuarioId = res.CanceladoUsuarioId,
                            ValeraTrackingEstatusID = res.valeraTrackingEstatus,
                            EnvioSucursalNota = res.EnvioSucursalNota,
                            ReciboSucursalNota = res.ReciboSucursalNota,
                            CodigoBarras = res.CodigoBarras,
                            SucursalEnviaValera = res.SucursalEnviaValera,
                        };

                        if (res.regresa == 1)
                        {
                            var res1 = await ObjectValera(valera);
                            await ConexionBD.Destroy();
                            return Ok(res1);
                        }
                        else
                        {
                            await ConexionBD.Destroy();
                            return BadRequest(res.msj);
                        }

                    }
                    else
                    {
                        await ConexionBD.Destroy();
                        return BadRequest($"Archivo Path {response.StatusCode} {response.ReasonPhrase}"); ;
                    }
                }
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("cancelValera")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> CancelValera(ConfiaWebApi.PeticionesRest.Distribuidores.Valeras.CancelValera parData)
        {
            try
            {

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
                var obj = new { usuario = UsuarioActual.UsuarioID, valeraID = parData.ValeraID, DistribuidoraID = 0, ProductoID, evento = 3, path = "", path2 = "", };
                var res = await ConexionBD.database.QueryAsync<ValeraAccion>("EXEC Distribuidores.pa_Valera_Accion @usuario, @valeraID, @DistribuidoraID,@ProductoID, @evento, @path, @path2", obj).FirstOrDefaultAsync();

                var valera = new Valera()
                {
                    ValeraID = res.ValeraID,
                    ProductoID = res.producto,
                    DistribuidorID = res.DistribuidorID,
                    serieId = res.serie,
                    FolioInicial = res.FolioInicial,
                    FolioFinal = res.FolioFinal,
                    Estatus = res.Estatus,
                    RegistroFecha = res.RegistroFecha,
                    RegistroUsuarioId = res.RegistroUsuarioId,
                    AsignaSucursalId = res.AsignaSucursalId,
                    AsignaSucursalFecha = res.AsignaSucursalFecha,
                    AsignaSucursalUsuarioId = res.AsignaSucursalUsuarioId,
                    ReciboSucursalFecha = res.ReciboSucursalFecha,
                    ReciboSucursalUsuarioId = res.ReciboSucursalUsuarioId,
                    AsignaDistribudiorFecha = res.AsignaDistribudiorFecha,
                    AsignaDistribudiorUsuarioId = res.AsignaDistribudiorUsuarioId,
                    CanceladoFecha = res.CanceladoFecha,
                    CanceladoUsuarioId = res.CanceladoUsuarioId,
                    ValeraTrackingEstatusID = res.valeraTrackingEstatus,
                    EnvioSucursalNota = res.EnvioSucursalNota,
                    ReciboSucursalNota = res.ReciboSucursalNota,
                    CodigoBarras = res.CodigoBarras,
                    SucursalEnviaValera = res.SucursalEnviaValera,
                };

                if (res.regresa == 1)
                {
                    var res1 = await ObjectValera(valera);
                    await ConexionBD.Destroy();
                    return Ok(res1);
                }
                else
                {
                    await ConexionBD.Destroy();
                    return BadRequest(res.msj);
                }
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }


        [HttpGet]
        [Route("getValeraByDistribuidor/{DistribuidorID}")]
        [Authorize]
        [Code.TProteccionAdmin]
        // [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> getValeraByDistribuidor(int DistribuidorID)
        {
            try
            {
                var valera = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Distribuidores.Valeras_VW>("WHERE  (DistribuidorID = @0)", DistribuidorID);
                await ConexionBD.Destroy();
                return Ok(valera);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpGet]
        [Route("getValeraDistribuidor/{DistribuidorID}")]
        [Authorize]
        [Code.TProteccionProducto]
        // [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> getValeraDistribuidor(int DistribuidorID)
        {
            try
            {
                var valera = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Distribuidores.Valeras_VW>("WHERE  (DistribuidorID = @0)", DistribuidorID);
                await ConexionBD.Destroy();
                return Ok(valera);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("getRevision")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getRevision(ConfiaWebApi.PeticionesRest.Distribuidores.Valeras.Get parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            if (parData.id != 0)
            {
                var valera = await ConexionBD.database.SingleByIdAsync<Valera>(parData.id);
                var res = await ObjectValera(valera);
                await ConexionBD.Destroy();
                return Ok(res);
            }

            var query = "WHERE ProductoID = @0 AND ValeraTrackingEstatusID = 12";
            var sucursal = 0;
            var Gerente = await ConexionBD.database.QueryAsync<Gerentes>("WHERE UsuarioID = @0", UsuarioActual.UsuarioID).FirstOrDefaultAsync();
            sucursal = Gerente != null ? Gerente.SucursalID : 0;
            query = sucursal > 0 ? $"{query} AND AsignaSucursalId = @1" : query;

            List<object> respList = new List<object>();
            int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
            var ListValeras = await ConexionBD.database.QueryAsync<Valeras_VW>(query, ProductoID, sucursal).ToArrayAsync();
            foreach (var item in ListValeras)
            {
                var res = new
                {
                    item.ValeraID,
                    producto = new { item.ProductoID, item.Producto },
                    item.DistribuidorID,
                    serie = new { item.serieId, item.serie, item.serieDesc },
                    item.FolioInicial,
                    item.FolioFinal,
                    item.Estatus,
                    RegistroFecha = item.RegistroFecha.ToString("dd/MM/yyyy"),
                    item.RegistroUsuarioId,
                    AsignaSucursal = new { SucursalID = item.AsignaSucursalId, Nombre = item.SucNombre, item.DiasDeEntregaAprox },
                    AsignaSucursalFecha = "",
                    item.AsignaSucursalUsuarioId,
                    ReciboSucursalFecha = "",
                    item.ReciboSucursalUsuarioId,
                    AsignaDistribudiorFecha = "",
                    item.AsignaDistribudiorUsuarioId,
                    CanceladoFecha = "",
                    item.CanceladoUsuarioId,
                    valeraTrackingEstatus = new { item.ValeraTrackingEstatusID, item.TrackingEstatus, item.Color, item.Descripcion },
                    item.EnvioSucursalNota,
                    item.ReciboSucursalNota,
                    item.CodigoBarras,
                    SucursalEnviaValera = new { SucursalID = item.SucursalEnviaValera, Nombre = item.SucEnviaNombre },
                    item.EnvioSucursalFecha
                };
                respList.Add(res);
                //respList.Add(await ObjectValera(item));
            }
            await ConexionBD.Destroy();
            return Ok(respList);
        }

        [HttpPost]
        [Route("ValidaEvidenciaDocs")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ValidaEvidenciaDocs(ConfiaWebApi.PeticionesRest.Distribuidores.Valeras.UpdateReciboSucursal parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
                var obj = new { usuario = UsuarioActual.UsuarioID, valeraID = parData.ValeraID, DistribuidoraID = 0, ProductoID, evento = 2, path = "", path2 = "" };
                var res = await ConexionBD.database.QueryAsync<ValeraAccion>("EXEC Distribuidores.pa_Valera_Accion @usuario, @valeraID, @DistribuidoraID,@ProductoID, @evento, @path, @path2", obj).FirstOrDefaultAsync();

                var valera = new Valera()
                {
                    ValeraID = res.ValeraID,
                    ProductoID = res.producto,
                    DistribuidorID = res.DistribuidorID,
                    serieId = res.serie,
                    FolioInicial = res.FolioInicial,
                    FolioFinal = res.FolioFinal,
                    Estatus = res.Estatus,
                    RegistroFecha = res.RegistroFecha,
                    RegistroUsuarioId = res.RegistroUsuarioId,
                    AsignaSucursalId = res.AsignaSucursalId,
                    AsignaSucursalFecha = res.AsignaSucursalFecha,
                    AsignaSucursalUsuarioId = res.AsignaSucursalUsuarioId,
                    ReciboSucursalFecha = res.ReciboSucursalFecha,
                    ReciboSucursalUsuarioId = res.ReciboSucursalUsuarioId,
                    AsignaDistribudiorFecha = res.AsignaDistribudiorFecha,
                    AsignaDistribudiorUsuarioId = res.AsignaDistribudiorUsuarioId,
                    CanceladoFecha = res.CanceladoFecha,
                    CanceladoUsuarioId = res.CanceladoUsuarioId,
                    ValeraTrackingEstatusID = res.valeraTrackingEstatus,
                    EnvioSucursalNota = res.EnvioSucursalNota,
                    ReciboSucursalNota = res.ReciboSucursalNota,
                    CodigoBarras = res.CodigoBarras,
                    SucursalEnviaValera = res.SucursalEnviaValera,
                };

                if (res.regresa == 1)
                {
                    var res1 = await ObjectValera(valera);
                    await ConexionBD.Destroy();
                    return Ok(res);
                }
                else
                {
                    await ConexionBD.Destroy();
                    return Ok(res);
                }

            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [Consumes("multipart/form-data")]
        [HttpPost]
        [Route("subirExpedienteEvidencia")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> subirExpedienteEvidencia([FromForm] ConfiaWebApi.PeticionesRest.Distribuidores.Valeras.UploadFile parData)
        {
            try
            {

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                var basicToken = Convert.ToBase64String(plainTextBytes);
                string path = Configuracion["BucketApi:AwsPath_Valeras"];
                string date = DateTime.Now.ToString("hh.mm.ss.ffffff");
                var ext = Path.GetExtension(parData.doc.FileName);
                string file_name = $"ev_{parData.ValeraID}_{date}{ext}";
                byte[] file_byte = FilesManager.ConvertFiletoByteArray(parData.doc);

                HttpContent bytesContent = new ByteArrayContent(file_byte);
                HttpContent stringContent = new StringContent(path);

                using (var client = new HttpClient())
                using (var formData = new MultipartFormDataContent())
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicToken); ;
                    formData.Add(stringContent, "path");
                    formData.Add(bytesContent, "file", $"{file_name}");
                    var response = await client.PostAsync($"{Configuracion["BucketApi:url"]}{Configuracion["BucketApi:uploadRequest"]}", formData);
                    if (response.IsSuccessStatusCode)
                    {
                        string pathEv = $"{path}/{file_name}";
                        int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
                        var obj = new { valeraID = parData.ValeraID, path = pathEv, regresa = 0, msj = "" };
                        var res = await ConexionBD.database.QueryAsync<ValeraAccion>("EXEC Distribuidores.pa_GuardarEvidenciaEntregaValera @valeraID, @path, @regresa, @msj", obj).FirstOrDefaultAsync();

                        if (res.regresa == 1)
                        {
                            await ConexionBD.Destroy();
                            return Ok(res);
                        }
                        else
                        {
                            await ConexionBD.Destroy();
                            return BadRequest(res.msj);
                        }

                    }
                    else
                    {
                        await ConexionBD.Destroy();
                        return BadRequest($"Archivo Path {response.StatusCode} {response.ReasonPhrase}"); ;
                    }
                }
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("GetDocsByValeraID")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetDocsByValeraID(ConfiaWebApi.PeticionesRest.Distribuidores.Valeras.UpdateReciboSucursal parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
                var obj = new { valeraID = parData.ValeraID };
                var res = await ConexionBD.database.QueryAsync<ValeraAccion>("EXEC Distribuidores.pa_GetEvidenciaEntregaValera @valeraID", obj).ToArrayAsync();

                return Ok(res);


            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("GetImgByValeraID")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetImgByValeraID(ConfiaWebApi.PeticionesRest.Distribuidores.Valeras.UpdateReciboSucursal parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
                var obj = new { valeraID = parData.ValeraID };
                var img = await ConexionBD.database.QueryAsync<ValeraEvidenciaDocs>().Where(x => x.ValeraID == parData.ValeraID).ToArray();
                var catalogo = await ConexionBD.database.QueryAsync<catalogoImagen>().ToArray();

                if (img.Length == 0)
                {
                    await ConexionBD.Destroy();
                    return Ok(catalogo);
                }

                var imgCatalogo = from i in img
                                  join cat in catalogo on i.CatalogoImagenID equals cat.IdCatalogoImagen
                                  select new { i.CatalogoImagenID, i.ValeraDocsEntregaID, i.Ruta, cat.IdCatalogoImagen, cat.NombreImagen, i.ValeraID };



                if (imgCatalogo.Count() < 3)
                {
                    var datos = new object[] { };

                    var imagenesCatalogo = catalogo.Where(x => !imgCatalogo.Select(y => y.CatalogoImagenID).Contains(x.IdCatalogoImagen)).ToArray();
                    var datosImagenes = imgCatalogo.ToArray();

                    var res = datos.Concat(datosImagenes).Concat(imagenesCatalogo).ToArray();

                    await ConexionBD.Destroy();
                    return Ok(res);
                }

                return Ok(imgCatalogo);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [Consumes("multipart/form-data")]
        [HttpPost]
        [Route("subirExpedienteEvidenciaImg")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> subirExpedienteEvidenciaImg([FromForm] ConfiaWebApi.PeticionesRest.Distribuidores.Valeras.UploadFile parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                var basicToken = Convert.ToBase64String(plainTextBytes);
                string path = Configuracion["BucketApi:AwsPath_Valeras"];
                string date = DateTime.Now.ToString("hh.mm.ss.ffffff");
                var ext = Path.GetExtension(parData.doc.FileName);
                string file_name = $"ev_{parData.ValeraID}_{date}{ext}";
                byte[] file_byte = FilesManager.ConvertFiletoByteArray(parData.doc);

                HttpContent bytesContent = new ByteArrayContent(file_byte);
                HttpContent stringContent = new StringContent(path);

                using (var client = new HttpClient())
                using (var formData = new MultipartFormDataContent())
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicToken); ;
                    formData.Add(stringContent, "path");
                    formData.Add(bytesContent, "file", $"{file_name}");
                    var response = await client.PostAsync($"{Configuracion["BucketApi:url"]}{Configuracion["BucketApi:uploadRequest"]}", formData);
                    if (response.IsSuccessStatusCode)
                    {
                        string pathEv = $"{path}/{file_name}";
                        int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
                        var obj = new { valeraID = parData.ValeraID, Ruta = pathEv, regresa = 0, msj = "", imagenID = parData.IdCatalogoImagen };
                        var res = await ConexionBD.database.QueryAsync<ValeraAccion>("EXEC Distribuidores.pa_GuardarEvidenciaEntregaValera @valeraID ,@Ruta, @regresa, @msj, @imagenID", obj).FirstOrDefaultAsync();

                        if (res.regresa == 1)
                        {
                            await ConexionBD.Destroy();
                            return Ok(res);
                        }
                        else
                        {
                            await ConexionBD.Destroy();
                            return BadRequest(res.msj);
                        }

                    }
                    else
                    {
                        await ConexionBD.Destroy();
                        return BadRequest($"Archivo Path {response.StatusCode} {response.ReasonPhrase}"); ;
                    }
                }
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("GetDocsByDocumentoPath")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetDocsByDocumentoPath(PeticionesRest.Prospeccion.Prospecto.getDocActivacion parData)
        {
            try
            {
                var src = "";

                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                var basicToken = Convert.ToBase64String(plainTextBytes);
                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicToken); ;
                    var response = await client.GetAsync($"{Configuracion["BucketApi:url"]}{Configuracion["BucketApi:getRequest"]}?expireIn=1&path={parData.DocumentoPath}");
                    if (response.IsSuccessStatusCode)
                    {
                        var jsonString = await response.Content.ReadAsStringAsync();
                        var request = JsonConvert.DeserializeObject<BucketGet>(jsonString);
                        src = request.url;
                    }
                    else
                    {
                        await ConexionBD.Destroy();
                        return BadRequest(response.StatusCode);
                    }
                }
                var res = new
                {
                    res = 1,
                    msj = $"Consulta correcta del documento",
                    src = $"{src}"
                };
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("ERROR AL GUARDAR LOS DATOS ECONOMICOS DE LA PERSONA: " + ex.Message);
            }
        }


    }
}
