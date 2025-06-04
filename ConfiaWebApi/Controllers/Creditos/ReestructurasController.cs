using ConfiaWebApi.Code;
using ConfiaWebApi.ModlesSP.Creditos;
using ConfiaWebApi.ModlesSP.General;
using ConfiaWebApi.PeticionesRest.Prospeccion.Documentos;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Distribuidores;
using DBContext.DBConfia.General;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.Creditos
{
    [Authorize]
    [ApiController]
    [Route("api/Creditos/[controller]")]
    public class ReestructurasController : ControllerBase
    {
        private DBConfiaContext ConexionBD;

        private IConfiguration Configuracion;

        private readonly IWebHostEnvironment _env;

        public ReestructurasController(IConfiguration _Configuration, DBConfiaContext _DBContext, IWebHostEnvironment env)
        {
            this.Configuracion = _Configuration;
            ConexionBD = _DBContext;
            _env = env;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Distribuidores.ValeraCabeceraEstatus.Get parData)
        {
            if (parData.id != 0)
            {
                var res = await ConexionBD.database.SingleByIdAsync<TipoReestructura>(parData.id);
                await ConexionBD.Destroy();
                return Ok(res);
            }
            var res1 = await ConexionBD.database.FetchAsync<TipoReestructura>();
            await ConexionBD.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("getEstatus")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetEstatus(ConfiaWebApi.PeticionesRest.Distribuidores.ValeraCabeceraEstatus.Get parData)
        {
            if (parData.id != 0)
            {
                var res = await ConexionBD.database.SingleByIdAsync<EstatusReestructura>(parData.id);
                await ConexionBD.Destroy();
                return Ok(res);
            }
            var res1 = await ConexionBD.database.FetchAsync<EstatusReestructura>();
            await ConexionBD.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("getEncargados")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getEncargados(ConfiaWebApi.PeticionesRest.Distribuidores.ValeraCabeceraEstatus.Get parData)
        {
            if (parData.id != 0)
            {
                var res = await ConexionBD.database.SingleByIdAsync<ReestructuraEncargados_VW>(parData.id);
                await ConexionBD.Destroy();
                return Ok(res);
            }
            var res1 = await ConexionBD.database.FetchAsync<ReestructuraEncargados_VW>();
            await ConexionBD.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("getAnalistasAll")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getAnalistasAll(ConfiaWebApi.PeticionesRest.Distribuidores.ValeraCabeceraEstatus.Get parData)
        {
            if (parData.id != 0)
            {
                var res = await ConexionBD.database.SingleByIdAsync<ReestructuraAnalistas_VW>(parData.id);
                await ConexionBD.Destroy();
                return Ok(res);
            }
            var res1 = await ConexionBD.database.FetchAsync<ReestructuraAnalistas_VW>();
            await ConexionBD.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("getPlazosReestructura")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getPlazosReestructura(ConfiaWebApi.PeticionesRest.Distribuidores.ValeraCabeceraEstatus.Get parData)
        {
            if (parData.id != 0)
            {
                var res = await ConexionBD.database.SingleByIdAsync<PlazosReestructura>(parData.id);
                await ConexionBD.Destroy();
                return Ok(res);
            }
            var res1 = await ConexionBD.database.QueryAsync<PlazosReestructura>("WHERE Activo=@0", 1).ToArrayAsync();
            await ConexionBD.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("getConceptoReestructura")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Distribuidores.ValeraEstatus.Get parData)
        {
            if (parData.id != 0)
            {
                var res = await ConexionBD.database.SingleByIdAsync<ConceptosReestructura>(parData.id);
                await ConexionBD.Destroy();
                return Ok(res);
            }
            var res1 = await ConexionBD.database.FetchAsync<ConceptosReestructura>();
            await ConexionBD.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("getAmortizacionRelacion")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> getAmortizacionRelacion(PeticionesRest.Creditos.ReestructuraRelacion.getAmortizacionRelacion parData)
        {

            try
            {
                var solicitudesPend = await ConexionBD.database.QueryAsync<SolicitudReestructura>("WHERE EstatusReestructuraID NOT IN (5,6,7) AND DistribuidorID = @0", parData.DistribuidorId).ToArrayAsync();

                var cantSol = solicitudesPend.Count();
                if (parData.ValAnt == 1) cantSol = 0;

                if (cantSol == 0)
                {


                    var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                    var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                    int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());

                    var obj = new { ProductoID, parData.DistribuidorId, parData.Plazos, UsuarioActual.UsuarioID, UsuarioActual.PersonaID, parData.FechaPago };
                    string Stored = "EXEC Creditos.pa_ReestructuraSaldoAmortizacion @ProductoID, @DistribuidorId, @Plazos, @UsuarioID, @PersonaID, @FechaPago";
                    var res = await ConexionBD.database.QueryAsync<ReestructuraSaldoAmortizacion>(Stored, obj).ToArrayAsync();
                    await ConexionBD.Destroy();

                    var resp = new
                    {
                        regresa = res.FirstOrDefault().regresa,
                        msj = res.FirstOrDefault().msj,
                        data = res
                    };
                    await ConexionBD.Destroy();
                    return Ok(resp);
                }
                else
                {
                    await ConexionBD.Destroy();
                    return BadRequest($"ESTA SOCIA DV TIENE UNA SOLICITUD DE REESTRUCTURA PENDIENTE");
                }

            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        [Route("getFileSolcitud")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getFile(PeticionesRest.Creditos.ReestructuraRelacion.DownLoadFile parData)
        {
            try
            {
                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());

                Distribuidores_VW distribuidor = await ConexionBD.database.QueryAsync<Distribuidores_VW>("WHERE DistribuidorID=@0 AND ProductoID = @1", parData.DistribuidorID, ProductoID).SingleOrDefaultAsync();
                var producto = await ConexionBD.database.QueryAsync<ProductosVW>("WHERE ProductoID = @0", ProductoID).SingleOrDefaultAsync();
                var sqlDirec = "SELECT top(1) * FROM General.Direcciones_VW dv WHERE PersonaID = @0 ORDER BY dv.CreacionFecha DESC";
                var dir = await ConexionBD.database.QueryAsync<Direcciones_VW>(sqlDirec, distribuidor.DistribuidorID).SingleOrDefaultAsync();
                var numDist = ProductoID != 33 ? distribuidor.DistAntNumero : distribuidor.DistAntNumero2;

                //PDF
                var prefijo_archivo = string.Concat(System.Guid.NewGuid().ToString().Replace("-", ""), "__");
                var listado_archivos = new string[1];

                var listado_imagenes = new List<string>();
                var logo = producto.Logo;
                Guid g = Guid.NewGuid();
                var logoname = string.Concat("logo", "_" + g.ToString() + ".jpeg");
                await System.IO.File.WriteAllBytesAsync(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "LogoImg", logoname), logo);
                listado_imagenes.Add(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "LogoImg", logoname));

                var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Reestructura", "solicitud.html"));
                html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);

                html = html.Replace("@@SUCURSAL", distribuidor.Sucursal_Nombre);
                html = html.Replace("@@FECHA_ENTREGA", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                html = html.Replace("@@DV", distribuidor.PersonaNombre);
                html = html.Replace("@@NUMDIST", $"{numDist}");
                html = html.Replace("@@TELEFONOM", distribuidor.TelefonoMovil);
                html = html.Replace("@@DIRECCION", $"{dir.vialidadTipo} {dir.NombreVialidad} #{dir.NumeroExterior} {dir.NumeroInterior} {dir.Asentamiento} C.P. {dir.CodigoPostal} {dir.Municipio}, {dir.Estado}.");
                html = html.Replace("@@PRODUCTO", $"{producto.Producto}");
                html = html.Replace("@@EMPRESA", $"{producto.EmpresaNombre}");
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

        [HttpPost]
        [Route("getFileMachote")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getFileMachote(PeticionesRest.Creditos.ReestructuraRelacion.DownLoadFileMachote parData)
        {
            try
            {
                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());

                Distribuidores_VW distribuidor = await ConexionBD.database.QueryAsync<Distribuidores_VW>("WHERE DistribuidorID=@0 AND ProductoID = @1", parData.DistribuidorID, ProductoID).SingleOrDefaultAsync();
                var producto = await ConexionBD.database.QueryAsync<ProductosVW>("WHERE ProductoID = @0", ProductoID).SingleOrDefaultAsync();
                var sqlDirec = "SELECT top(1) * FROM General.Direcciones_VW dv WHERE PersonaID = @0 ORDER BY dv.CreacionFecha DESC";
                var dir = await ConexionBD.database.QueryAsync<Direcciones_VW>(sqlDirec, distribuidor.DistribuidorID).SingleOrDefaultAsync();
                var numDist = ProductoID != 33 ? distribuidor.DistAntNumero : distribuidor.DistAntNumero2;
                Contratos_VW contrato = await ConexionBD.database.QueryAsync<Contratos_VW>("WHERE DistribuidorID=@0 AND Activo = 1 AND Principal = 1 AND ProductoID = @1", parData.DistribuidorID, ProductoID).SingleOrDefaultAsync();
                var clientes = await ConexionBD.database.FetchAsync<ClienteSaldo_VW>($"WHERE DistribuidorID = {parData.DistribuidorID} AND ProductoID = {ProductoID} AND ClienteID != {parData.DistribuidorID}");
                string query = $"WHERE DistribuidorID = {parData.DistribuidorID} AND ClienteID != {parData.DistribuidorID} AND CreditoID IN ({String.Join(",", parData.Clientes)})";
                var creditos = await ConexionBD.database.QueryAsync<Creditos_VW>(query).ToArrayAsync();

                //PDF
                var prefijo_archivo = string.Concat(System.Guid.NewGuid().ToString().Replace("-", ""), "__");
                var listado_archivos = new string[1];

                var listado_imagenes = new List<string>();
                var logo = producto.Logo;
                Guid g = Guid.NewGuid();
                var logoname = string.Concat("logo", "_" + g.ToString() + ".jpeg");
                await System.IO.File.WriteAllBytesAsync(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "LogoImg", logoname), logo);
                listado_imagenes.Add(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "LogoImg", logoname));

                var fila = "";
                var items = 0;
                var saldo = 0.00M;
                var atraso = 0.00M;

                foreach (var item in creditos)
                {
                    fila += "<table class=\"table table-sm\" style=\"border: #ffffff;\" > ";
                    fila += "<thead>";
                    fila += "<tr>";
                    fila += "<th class=\"text-center fs-6 bg-secondary text-white\"> CREDITO</th>";
                    fila += "<th class=\"text-center fs-6 bg-secondary text-white\">CLIENTE</th>";
                    fila += "<th class=\"text-center fs-6 bg-secondary text-white\">NOMBRE. CLIENTE</th>";
                    fila += "<th class=\"text-center fs-6 bg-secondary text-white\">SALDO</th>";
                    fila += "<th class=\"text-center fs-6 bg-secondary text-white\"> ATRASADO</th>";
                    fila += "</tr>";
                    fila += "</thead>";
                    fila += "<tbody>";
                    fila += "<tr>";
                    fila += "<td class=\"text-center fs-3\">#" + item.CreditoID + "</td>";
                    fila += "<td class=\"text-center fs-3\">No. " + item.ClienteID + "</td>";
                    fila += "<td class=\"text-center fs-3\">" + $"{item.NombreCompleto}" + "</td>";
                    fila += "<td class=\"text-center fs-3\">" + $"{item.SaldoActual.ToString("C", new CultureInfo("en-US"))}" + "</td>";
                    fila += "<td class=\"text-center fs-3\">" + $"{item.SaldoAtrasado.ToString("C", new CultureInfo("en-US"))}" + "</td>";
                    fila += "</tr>";
                    fila += "<tr style=\"border-bottom: 1px solid gray; height: 20px;\">";
                    fila += "<td class=\"text-center fs-3 bg-secondary text-white\"><strong>MOTIVO DE ATRASO</strong></td>";
                    fila += "<td class=\"text-center fs-3 bg-light\"></td>";
                    fila += "<td class=\"text-center fs-3 bg-light\"></td>";
                    fila += "<td class=\"text-center fs-3 bg-light\"></td>";
                    fila += "<td class=\"text-center fs-3 bg-light\"></td>";
                    fila += "</tr>";

                    items += 1;
                    saldo += item.SaldoActual;
                    atraso += item.SaldoAtrasado;
                    if (items == creditos.Count())
                    {
                        fila += "<tr style=\"height: 20px;\">";
                        fila += "<td class=\"text-center fs-3 bg-light\"></td>";
                        fila += "<td class=\"text-center fs-3 bg-light\"></td>";
                        fila += "<td class=\"text-center fs-3 bg-light\"></td>";
                        fila += "<td class=\"text-center fs-3 bg-light\"></td>";
                        fila += "<td class=\"text-center fs-3 bg-light\"></td>";
                        fila += "</tr>";
                        fila += "<tr>";
                        fila += "<td class=\"text-center fs-3 bg-light\"></td>";
                        fila += "<td class=\"text-center fs-3 bg-light\"></td>";
                        fila += "<td class=\"text-center fs-3 bg-secondary text-white\"><strong>TOTALES</strong></td>";
                        fila += "<td class=\"text-center fs-3 bg-light\">" + $"{saldo.ToString("C", new CultureInfo("en-US"))}" + "</td>";
                        fila += "<td class=\"text-center fs-3 bg-light\">" + $"{atraso.ToString("C", new CultureInfo("en-US"))}" + "</td>";
                        fila += "</tr>";
                    }
                    fila += "</tbody>";
                    fila += "</table>";
                }

                var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Reestructura", "machote.html"));
                html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);

                html = html.Replace("@@SUCURSAL", distribuidor.Sucursal_Nombre);
                html = html.Replace("@@FECHA_ENTREGA", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                html = html.Replace("@@DV", distribuidor.PersonaNombre);
                html = html.Replace("@@NUMDIST", $"{numDist}");
                html = html.Replace("@@TELEFONOM", distribuidor.TelefonoMovil);
                html = html.Replace("@@DIRECCION", $"{dir.vialidadTipo} {dir.NombreVialidad} #{dir.NumeroExterior} {dir.NumeroInterior} {dir.Asentamiento} C.P. {dir.CodigoPostal} {dir.Municipio}, {dir.Estado}.");
                html = html.Replace("@@PRODUCTO", $"{producto.Producto}");
                html = html.Replace("@@EMPRESA", $"{producto.EmpresaNombre}");
                html = html.Replace("@@LOGO", logoname);
                html = html.Replace("@@SALDO", $"{contrato.SaldoActual?.ToString("C", new CultureInfo("en-US"))}");
                html = html.Replace("@@ATRASADO", $"{contrato.SaldoAtrasado.ToString("C", new CultureInfo("en-US"))}");
                html = html.Replace("@@CLIENTESTOTAL", $"{clientes.Count()}");
                html = html.Replace("@@CLIENTESCOUNT", $"{parData.Clientes.Count()}");
                html = html.Replace("@@TABLA_CLIENTES", fila);

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
        [Route("reestructuraRelacion")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> reestructuraRelacion([FromForm] PeticionesRest.Creditos.ReestructuraRelacion.reestructuraRelacion parData)
        {
            try
            {
                var solicitudesPend = await ConexionBD.database.QueryAsync<SolicitudReestructura>("WHERE EstatusReestructuraID NOT IN (5,6,7) AND DistribuidorID = @0", parData.DistribuidorId).ToArrayAsync();
                if (solicitudesPend.Count() == 0)
                {
                    var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                    var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                    int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());

                    var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                    var basicToken = Convert.ToBase64String(plainTextBytes);
                    string path = Configuracion["BucketApi:AwsPath_ReestructuraSolicitud"];
                    var solicitudesPrev = await ConexionBD.database.QueryAsync<SolicitudReestructura>("WHERE EstatusReestructuraID IN (5,6,7) AND DistribuidorID = @0", parData.DistribuidorId).ToArrayAsync();
                    var ext = Path.GetExtension(parData.doc.FileName);
                    string file_name = $"{solicitudesPrev.Count()}_{parData.DistribuidorId}{ext}";
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

                            var obj = new { ProductoID, pagoCorte = "C" };
                            var spr = await ConexionBD.database.QueryAsync<FechaCorteActual>("EXEC General.pa_Fecha_Corte_Ultimo  @ProductoID, @pagoCorte", obj).FirstOrDefaultAsync();

                            var solicitud = new SolicitudReestructura()
                            {
                                ProductoID = ProductoID,
                                DistribuidorID = parData.DistribuidorId,
                                Plazos = parData.Plazos,
                                AltaUsuarioID = UsuarioActual.UsuarioID,
                                AltaPersonaID = (long)UsuarioActual.PersonaID,
                                AnalistaUsuarioID = null,
                                AnalistaPersonaID = null,
                                Fecha = DateTime.Now,
                                ConceptoReestructuraID = parData.ConceptoId,
                                SolicitudFilePath = $"{path}/{file_name}",
                                EstatusReestructuraID = 1,
                                TipoReestructuraID = 1,
                                SaldoAReestructurar = parData.Monto,
                                SucursalID = parData.SucursalId,
                                FechaCorte = spr.fecha,
                            };
                            await ConexionBD.database.InsertAsync(solicitud);

                            var res = new
                            {
                                regresa = 1,
                                msj = $"OK",
                                data = new { path = $"REESTRUCTURA SOLICITADA CON ÉXITO" }
                            };
                            await ConexionBD.Destroy();
                            return Ok(res);
                        }
                        else
                        {
                            await ConexionBD.Destroy();
                            return BadRequest(response.StatusCode);
                        }
                    }
                }
                else
                {
                    await ConexionBD.Destroy();
                    return BadRequest($"ESTA SOCIA DV TIENE UNA SOLICITUD DE REESTRUCTURA PENDIENTE");
                }
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        [Route("getSolicitudActual")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getSolicitudActual(PeticionesRest.Creditos.ReestructuraRelacion.getSolicitudActual parData)
        {
            try
            {
                var solicitudesPend = await ConexionBD.database.QueryAsync<ReestructurasSolicitudes_VW>("WHERE EstatusReestructuraID NOT IN (5,6,7) AND DistribuidorID = @0", parData.DistribuidorId).FirstOrDefaultAsync();
                await ConexionBD.Destroy();
                return Ok(solicitudesPend);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("getDoc")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetDoc(PeticionesRest.Creditos.ReestructuraRelacion.getDoc parData)
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

        [Consumes("multipart/form-data")]
        [HttpPost]
        [Route("subirDoc")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> subirDoc([FromForm] PeticionesRest.Creditos.ReestructuraRelacion.subirDoc parData)
        {
            try
            {
                var solicitud = await ConexionBD.database.QueryAsync<SolicitudReestructura>("WHERE EstatusReestructuraID NOT IN (5,6,7) AND DistribuidorID = @0", parData.DistribuidorId).FirstOrDefaultAsync();

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());

                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                var basicToken = Convert.ToBase64String(plainTextBytes);
                string path = Configuracion["BucketApi:AwsPath_ReestructuraDocumento"];
                var ext = Path.GetExtension(parData.doc.FileName);
                string file_name = $"{parData.identificador}_{parData.DistribuidorId}{ext}";
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
                        switch (parData.identificador)
                        {
                            case 1:
                                solicitud.IneFrente = $"{path}/{file_name}";
                                break;
                            case 2:
                                solicitud.IneReverso = $"{path}/{file_name}";
                                break;
                            case 3:
                                solicitud.Firma = $"{path}/{file_name}";
                                break;
                            default:
                                break;
                        }

                        if (solicitud.IneFrente != null && solicitud.IneReverso != null && solicitud.Firma != null)
                        {
                            solicitud.EstatusReestructuraID = 2; //SOLICITADA
                        }

                        await ConexionBD.database.UpdateAsync(solicitud);
                        await ConexionBD.Destroy();

                        var res = new
                        {
                            regresa = 1,
                            msj = $"OK",
                            data = new { path = $"DOCUMENTO SUBIDO CON ÉXITO" }
                        };
                        await ConexionBD.Destroy();
                        return Ok(res);
                    }
                    else
                    {
                        await ConexionBD.Destroy();
                        return BadRequest(response.StatusCode);
                    }
                }
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        [Route("getSolicitudes")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getSolicitudes(PeticionesRest.Creditos.ReestructuraRelacion.getSolicitudes parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());

                if (parData.id != 0)
                {
                    var res = await ConexionBD.database.SingleByIdAsync<ReestructurasSolicitudes_VW>(parData.id);
                    await ConexionBD.Destroy();
                    return Ok(res);
                }

                var query = NPoco.Sql.Builder.Select("*").From("Creditos.ReestructurasSolicitudes_VW");
                query = query.Where("ProductoID = @0 AND NOT EstatusReestructuraID = 1", ProductoID);

                query = query.OrderBy("Fecha DESC");
                var res1 = await ConexionBD.database.QueryAsync<ReestructurasSolicitudes_VW>(query).ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(res1);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("getAnalistas")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getAnalistas(PeticionesRest.Creditos.ReestructuraRelacion.getSolicitudes parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var query = "";
                var Encargado = await ConexionBD.database.QueryAsync<ReestructuraEncargado>("WHERE EncargadoID = @0", UsuarioActual.PersonaID).FirstOrDefaultAsync();
                if (Encargado == null)
                {
                    var Analista = await ConexionBD.database.QueryAsync<ReestructuraAnalista>("WHERE AnalistaID = @0", UsuarioActual.PersonaID).FirstOrDefaultAsync();
                    query = Analista != null ? $"WHERE AnalistaID = @0" : query;
                }
                var res = await ConexionBD.database.QueryAsync<ReestructuraAnalistas_VW>(query, UsuarioActual.PersonaID).ToArrayAsync();
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
        [Route("AsignaAnalista")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> AsignaAnalista(PeticionesRest.Creditos.ReestructuraRelacion.add parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var obj = new { UsuarioActual.UsuarioID, parData.SolicitudReestructuraID, parData.PersonaAnalistaID };
                var res = await ConexionBD.database.QueryAsync<SolicitudReestructuraSP>("EXEC Creditos.pa_RE_Asigna_Analista  @UsuarioID, @SolicitudReestructuraID, @PersonaAnalistaID", obj).FirstOrDefaultAsync();
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
        [Route("getDocsByCode")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getDocsByCode(PeticionesRest.Creditos.ReestructuraRelacion.getDocsByCode parData)
        {
            try
            {
                var src = "";
                var Documento = await ConexionBD.database.SingleByIdAsync<SolicitudReestructura>(parData.SolicitudReestructuraID);
                var path = "";

                switch (parData.Code)
                {
                    case 0:
                        if (Documento.IneFrente == null) return BadRequest("Error al Conseguir INE");
                        path = Documento.IneFrente;
                        break;
                    case 1:
                        if (Documento.IneReverso == null) return BadRequest("Error al Conseguir INE REVERSO");
                        path = Documento.IneReverso;
                        break;
                    case 2:
                        if (Documento.MachoteFilePath == null) return BadRequest("Error al Conseguir MACHOTE (SOLO EN REESTRUCTURA DE CLIENTES)");
                        path = Documento.MachoteFilePath;
                        break;
                    case 3:
                        if (Documento.SolicitudFilePath == null) return BadRequest("Error al Conseguir SOLICITUD");
                        path = Documento.SolicitudFilePath;
                        break;
                    case 4:
                        if (Documento.Firma == null) return BadRequest("Error al Conseguir la Firma");
                        path = Documento.Firma;
                        break;
                    default:
                        return BadRequest("Error de código");
                }

                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                var basicToken = Convert.ToBase64String(plainTextBytes);
                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicToken); ;
                    var response = await client.GetAsync($"{Configuracion["BucketApi:url"]}{Configuracion["BucketApi:getRequest"]}?expireIn=1&path={path}");
                    if (response.IsSuccessStatusCode)
                    {
                        var estCancel = await ConexionBD.database.QueryAsync<EstatusReestructura>("WHERE Clave = @0", "REV-0").FirstOrDefaultAsync();

                        if (Documento.EstatusReestructuraID < 4)
                        {
                            ConexionBD.database.BeginTransaction();
                            Documento.EstatusReestructuraID = estCancel.EstatusReestructuraID;
                            await ConexionBD.database.UpdateAsync(Documento);
                            ConexionBD.database.CompleteTransaction();
                        }
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
                    msj = $"Consulta correcta del documento {parData.Code}",
                    src = $"{src}"
                };
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("ERROR AL OBTENER DOCUMENTOS: " + ex.Message);
            }

        }

        [HttpPost]
        [Route("cancelarSolicitud")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> cancelarSolicitud(PeticionesRest.Creditos.ReestructuraRelacion.cancelar parData)
        {
            try
            {
                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
                var solicitud = await ConexionBD.database.SingleByIdAsync<SolicitudReestructura>(parData.SolicitudReestructuraID);
                var estCancel = await ConexionBD.database.QueryAsync<EstatusReestructura>("WHERE Clave = @0", "CAN-0").FirstOrDefaultAsync();

                ConexionBD.database.BeginTransaction();
                solicitud.EstatusReestructuraID = estCancel.EstatusReestructuraID;
                await ConexionBD.database.UpdateAsync(solicitud);

                var res = await ConexionBD.database.QueryAsync<ReestructurasSolicitudes_VW>("WHERE SolicitudReestructuraID = @0", parData.SolicitudReestructuraID).FirstOrDefaultAsync();
                ConexionBD.database.CompleteTransaction();
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
        [Route("aplicarSolicitud")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> aplicarSolicitud(PeticionesRest.Creditos.ReestructuraRelacion.aplicar parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var obj = new { UsuarioActual.UsuarioID, parData.SolicitudReestructuraID };
                var res = await ConexionBD.database.QueryAsync<SolicitudReestructuraSP>("EXEC Creditos.pa_ReestructuraSaldo @SolicitudReestructuraID, @UsuarioID", obj).FirstOrDefaultAsync();
                if (res.regresa == 1)
                {
                    var res2 = await ConexionBD.database.QueryAsync<ReestructurasSolicitudes_VW>("WHERE SolicitudReestructuraID = @0", parData.SolicitudReestructuraID).FirstOrDefaultAsync();
                    await ConexionBD.Destroy();
                    return Ok(res2);
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
        [Route("getClienteSaldo")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetClienteSaldo(PeticionesRest.Creditos.ReestructuraRelacion.GetClienteSaldo parData)
        {
            try
            {
                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());

                var res1 = await ConexionBD.database.FetchAsync<ClienteSaldo_VW>($"WHERE DistribuidorID = {parData.DistribuidorId} AND ProductoID = {ProductoID} AND ClienteID != {parData.DistribuidorId}");
                await ConexionBD.Destroy();
                return Ok(res1);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);

            }

        }

        [HttpPost]
        [Route("getAmortizacionCliente")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> getAmortizacionCliente(PeticionesRest.Creditos.ReestructuraRelacion.getAmortizacionClientes parData)
        {

            try
            {
                var solicitudesPend = await ConexionBD.database.QueryAsync<SolicitudReestructura>("WHERE EstatusReestructuraID NOT IN (5,6,7) AND DistribuidorID = @0", parData.DistribuidorId).ToArrayAsync();

                var cantSol = solicitudesPend.Count();
                if (parData.ValAnt == 1) cantSol = 0;

                if (cantSol == 0)
                {
                    var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                    var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                    int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());

                    DataTable dt = new DataTable();
                    dt.Columns.Add("ID", typeof(int));
                    foreach (var item in parData.Clientes)
                        dt.Rows.Add(item);

                    SqlParameter param = new SqlParameter("@IDList", SqlDbType.Structured)
                    {
                        TypeName = "dbo.IDList",
                        Value = dt
                    };

                    var obj = new { ProductoID, parData.DistribuidorId, parData.Plazos, UsuarioActual.UsuarioID, UsuarioActual.PersonaID, parData.FechaPago, ids = param };
                    string Stored = "EXEC Creditos.pa_ReestructuraClienteAmortizacion @ProductoID, @DistribuidorId, @Plazos, @UsuarioID, @PersonaID, @FechaPago, @ids";

                    var res = await ConexionBD.database.QueryAsync<ReestructuraSaldoAmortizacion>(Stored, obj).ToArrayAsync();

                    await ConexionBD.Destroy();

                    var resp = new
                    {
                        regresa = res.FirstOrDefault().regresa,
                        msj = res.FirstOrDefault().msj,
                        data = res
                    };
                    await ConexionBD.Destroy();
                    return Ok(resp);
                }
                else
                {
                    await ConexionBD.Destroy();
                    return BadRequest($"ESTA SOCIA DV TIENE UNA SOLICITUD DE REESTRUCTURA PENDIENTE");
                }

            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        [Route("getCreditosAmortizacionCliente")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> getCreditosAmortizacionCliente(PeticionesRest.Creditos.ReestructuraRelacion.aplicar parData)
        {

            try
            {
                var creditos = await ConexionBD.database.QueryAsync<SolicitudReestructuraClientes>("WHERE SolicitudReestructuraID = @0", parData.SolicitudReestructuraID).ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(creditos);

            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [Consumes("multipart/form-data")]
        [HttpPost]
        [Route("reestructuraCliente")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<ActionResult> reestructuraCliente([FromForm] PeticionesRest.Creditos.ReestructuraRelacion.reestructuraClientes parData)
        {


            try
            {
                var solicitudesPend = await ConexionBD.database.QueryAsync<SolicitudReestructura>("WHERE EstatusReestructuraID NOT IN (5,6,7) AND DistribuidorID = @0", parData.DistribuidorId).ToArrayAsync();
                if (solicitudesPend.Count() == 0)
                {
                    var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                    var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                    int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());

                    var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                    var basicToken = Convert.ToBase64String(plainTextBytes);
                    string path = Configuracion["BucketApi:AwsPath_ReestructuraSolicitud"];
                    var solicitudesPrev = await ConexionBD.database.QueryAsync<SolicitudReestructura>("WHERE EstatusReestructuraID IN (5,6,7) AND DistribuidorID = @0", parData.DistribuidorId).ToArrayAsync();
                    var ext = Path.GetExtension(parData.doc.FileName);
                    string file_name = $"{solicitudesPrev.Count()}_{parData.DistribuidorId}{ext}";
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
                            ext = Path.GetExtension(parData.doc2.FileName);
                            file_name = $"{0}_{parData.DistribuidorId}{ext}";
                            file_byte = FilesManager.ConvertFiletoByteArray(parData.doc2);

                            bytesContent = new ByteArrayContent(file_byte);
                            stringContent = new StringContent(path);

                            using (var client2 = new HttpClient())
                            using (var formData2 = new MultipartFormDataContent())
                            {
                                client2.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicToken); ;
                                formData2.Add(stringContent, "path");
                                formData2.Add(bytesContent, "file", $"{file_name}");
                                response = await client2.PostAsync($"{Configuracion["BucketApi:url"]}{Configuracion["BucketApi:uploadRequest"]}", formData2);
                                if (response.IsSuccessStatusCode)
                                {
                                    var obj = new { ProductoID, pagoCorte = "C" };
                                    var spr = await ConexionBD.database.QueryAsync<FechaCorteActual>("EXEC General.pa_Fecha_Corte_Ultimo  @ProductoID, @pagoCorte", obj).FirstOrDefaultAsync();

                                    ConexionBD.database.BeginTransaction();
                                    var solicitud = new SolicitudReestructura()
                                    {
                                        ProductoID = ProductoID,
                                        DistribuidorID = parData.DistribuidorId,
                                        Plazos = parData.Plazos,
                                        AltaUsuarioID = UsuarioActual.UsuarioID,
                                        AltaPersonaID = (long)UsuarioActual.PersonaID,
                                        AnalistaUsuarioID = null,
                                        AnalistaPersonaID = null,
                                        Fecha = DateTime.Now,
                                        ConceptoReestructuraID = parData.ConceptoId,
                                        SolicitudFilePath = pathSolicitud,
                                        MachoteFilePath = $"{path}/{file_name}",
                                        EstatusReestructuraID = 1,
                                        TipoReestructuraID = 2,
                                        SaldoAReestructurar = parData.Monto,
                                        SucursalID = parData.SucursalId,
                                        FechaCorte = spr.fecha,
                                    };
                                    await ConexionBD.database.InsertAsync(solicitud);

                                    var creditoList = JsonConvert.DeserializeObject<List<int>>(parData.Clientes);
                                    foreach (var item in creditoList)
                                    {
                                        var cliente = new SolicitudReestructuraClientes()
                                        {
                                            SolicitudReestructuraID = solicitud.SolicitudReestructuraID,
                                            CreditoID = item
                                        };
                                        await ConexionBD.database.InsertAsync(cliente);
                                    }
                                    ConexionBD.database.CompleteTransaction();

                                    var res = new
                                    {
                                        regresa = 1,
                                        msj = $"OK",
                                        //data = new { path = $"DOCUMENTO GUARDADO EN {path}/{file_name}" }
                                        data = new { path = $"REESTRUCTURA SOLICITADA CON ÉXITO" }
                                    };
                                    await ConexionBD.Destroy();
                                    return Ok(res);
                                }
                                else
                                {
                                    await ConexionBD.Destroy();
                                    return BadRequest($"Machote Path {response.StatusCode} {response.ReasonPhrase}");
                                }
                            }
                        }
                        else
                        {
                            await ConexionBD.Destroy();
                            return BadRequest($"Solcitud Path {response.StatusCode} {response.ReasonPhrase}");
                        }
                    }
                }
                else
                {
                    await ConexionBD.Destroy();
                    return BadRequest($"ESTA SOCIA DV TIENE UNA SOLICITUD DE REESTRUCTURA PENDIENTE");
                }
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        [Route("aplicarSolicitudCliente")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> aplicarSolicitudCliente(PeticionesRest.Creditos.ReestructuraRelacion.aplicar parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var obj = new { UsuarioActual.UsuarioID, parData.SolicitudReestructuraID };
                var res = await ConexionBD.database.QueryAsync<SolicitudReestructuraSP>("EXEC Creditos.pa_ReestructuraCliente @SolicitudReestructuraID, @UsuarioID", obj).FirstOrDefaultAsync();
                if (res.regresa == 1)
                {
                    var res2 = await ConexionBD.database.QueryAsync<ReestructurasSolicitudes_VW>("WHERE SolicitudReestructuraID = @0", parData.SolicitudReestructuraID).FirstOrDefaultAsync();
                    await ConexionBD.Destroy();
                    return Ok(res2);
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

    }

}
