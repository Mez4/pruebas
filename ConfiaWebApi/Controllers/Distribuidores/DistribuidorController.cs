using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Distribuidores;
using DBContext.DBConfia.Sistema;
using System.Collections;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Creditos;
using Newtonsoft.Json;
using ConfiaWebApi.RespuestasPersonalizadas.Distribuidores.Lealtad;
using ConfiaWebApi.Code;
using System.Collections.Generic;
using DBContext.DBConfia.Seguridad;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.IO;
using System.Net.Http.Headers;
using System.Net;
using iText.Layout.Properties;
using DBContext.DBConfia.Compras;
using ConfiaWebApi.PeticionesRest.Prospeccion.Documentos;
using System.Globalization;
using System.Web;
using System.Diagnostics;
using DBContext.DBConfia.Reestructura;
using DBContext.DBConfia.Cortes;




//using conekta;

namespace ConfiaWebApi.Controllers.Distribuidores
{
    [Authorize]
    [ApiController]
    [Route("api/Distribuidores/[controller]")]
    public class DistribuidorController : ControllerBase
    {
        private DBConfiaContext DBContext;
        private IConfiguration Configuracion;


        public DistribuidorController(DBConfiaContext _DBContext, IConfiguration _Configuration)
        {
            this.Configuracion = _Configuration;
            DBContext = _DBContext;
        }

        [HttpGet]
        [Route("get/{DistribuidorID}")]
        [Authorize]
        [Code.TProteccionProducto]



        public async Task<IActionResult> ObtenerPorId(int DistribuidorID)
        {
            try
            {
                var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Distribuidores_VW>("WHERE DistribuidorID=@0", DistribuidorID).FirstOrDefaultAsync();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        // [HttpPost]
        // [Route("getserievalera/{DistribuidorID}")]
        // [Authorize]
        // [Code.TProteccionProducto]
        // public async Task<IActionResult> getserievalera(int DistribuidorID)
        // {
        //     try
        //     {
        //         var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.ValeraSeries>(
        //             "SELECT * FROM Distribuidores.Valera v JOIN Distribuidores.ValeraSeries vs ON v.serieId = vs.serieId WHERE DistribuidorID=@0",
        //             DistribuidorID
        //         ).FirstOrDefaultAsync();

        //         await DBContext.Destroy();
        //         return Ok(res);
        //     }
        //     catch (Exception ex)
        //     {
        //         await DBContext.Destroy();
        //         return NotFound(ex.Message);
        //     }
        // }

        [HttpPost]
[Route("getserievalera/{DistribuidorID}")]
[Authorize]
[Code.TProteccionProducto]
public async Task<IActionResult> getserievalera(int DistribuidorID)
{
    try
    {
        // Ejecutar procedimiento almacenado con el parámetro DistribuidorID
        var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.ValeraSeries>(
            "EXEC Creditos.pa_GetValeraSeriesByDistribuidor @DistribuidorID", 
            new { DistribuidorID }  // Pasar el parámetro al procedimiento
        ).FirstOrDefaultAsync();

        await DBContext.Destroy();

        // Verificar si se encontró un resultado
     
        return Ok(res);
    }
    catch (Exception ex)
    {
        await DBContext.Destroy();
        return StatusCode(500, $"Error interno del servidor: {ex.Message}");
    }
}



        [HttpPost]
        [Route("getPDF")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetPDF(PeticionesRest.Distribuidores.Distribuidor.Get parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var DistribuidorID = parData.Id;

                var Distribuidores_VW = await DBContext.database.QueryAsync<Distribuidores_VW>("WHERE DistribuidorID=@0", DistribuidorID).FirstOrDefaultAsync();
                var Producto = await DBContext.database.SingleOrDefaultByIdAsync<Productos>(Distribuidores_VW.ProductoID);
                var Personas_VW = await DBContext.database.QueryAsync<Personas_VW>("WHERE PersonaID=@0", DistribuidorID).SingleOrDefaultAsync();
                var Contratos_VW = await DBContext.database.QueryAsync<Contratos_VW>("WHERE DistribuidorID=@0", DistribuidorID).ToArrayAsync();
                var Valeras_VW = await DBContext.database.QueryAsync<Valeras_VW>("WHERE  (DistribuidorID = @0)", DistribuidorID).ToArrayAsync();
                var Creditos_VW = await DBContext.database.QueryAsync<Creditos_VW>("WHERE DistribuidorID = @0 AND EstatusID = 'A' ", DistribuidorID).ToArrayAsync();
                var ClientesLista = Creditos_VW.Where(x => x.ClienteID != DistribuidorID);
                var clienteIds = ClientesLista.Select(x => x.ClienteID).ToList();
                Direcciones_VW[] DireccionesClientes = await DBContext.database.QueryAsync<Direcciones_VW>("WHERE PersonaID IN (@0)", clienteIds).ToArrayAsync();
                DireccionesMigradas[] DireccionesMigradasClientes = await DBContext.database.QueryAsync<DireccionesMigradas>("WHERE PersonaID IN (@0)", clienteIds).ToArrayAsync();

                Direcciones_VW Direccion = await DBContext.database.QueryAsync<Direcciones_VW>("WHERE (PersonaID = @0)", Distribuidores_VW.DistribuidorID).SingleOrDefaultAsync();
                var DireccionesMigradasDV = await DBContext.database.QueryAsync<DireccionesMigradas>("WHERE PersonaID IN(@0)", Distribuidores_VW.DistribuidorID).SingleOrDefaultAsync();
                var GpoDistribuidorCoordinador = await DBContext.database.QueryAsync<GpoDistribuidorCoordinador>("WHERE (DistribuidorID = @0)", DistribuidorID).SingleOrDefaultAsync();
                var Aplicaciones_VW = await DBContext.database.QueryAsync<Aplicaciones_VW>("WHERE DistribuidorID = @0", DistribuidorID).ToArrayAsync();
                var SolicitudReestructurasConveniosDP_VW = await DBContext.database.QueryAsync<SolicitudReestructurasConveniosDP_VW>("WHERE DistribuidorID = @0", DistribuidorID).ToArrayAsync();

                var Sucursal = await DBContext.database.QueryAsync<Sucursales_VW>("WHERE SucursalID = @0", Distribuidores_VW.SucursalID).SingleOrDefaultAsync();
                if (Sucursal != null && Sucursal.Eslogan != null)
                {
                    byte[] bytes = System.Text.Encoding.Default.GetBytes(Sucursal.Eslogan);
                    Sucursal.Eslogan = System.Text.Encoding.UTF8.GetString(bytes);
                    Sucursal.Eslogan = HttpUtility.HtmlEncode(Sucursal.Eslogan);
                }

                // // Generamos un prefijo del nombre de archivo
                var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");
                var listado_archivos = new List<string>();
                var listado_imagenes = new List<string>();
                var Count = 1;

                var colorDocumento = "";
                switch (Producto.EmpresaId)
                {
                    case 10:
                    case 15:
                        colorDocumento = "#F7944C";
                        break;
                    case 9:
                        colorDocumento = "#BE56BE";
                        break;
                    default:
                        colorDocumento = "#1DA1F2";
                        break;
                }

                var logo = Producto.Logo;

                Guid g = Guid.NewGuid();

                var logoname = string.Concat("logo", "_" + g.ToString() + ".jpeg");

                NumberFormatInfo nfi = new CultureInfo(CultureInfo.CurrentCulture.ToString(), false).NumberFormat;
                nfi.PercentDecimalDigits = 0;

                await System.IO.File.WriteAllBytesAsync(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "LogoImg", logoname), logo);
                listado_imagenes.Add(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "LogoImg", logoname));

                // SE EMPIEZA A REEMPLAZAR LAS VARIABLES DE LA PLANTILLA DEL HTML
                var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Distribuidores", "Perfil.html"));
                html = html.Replace("@@SUCURSAL", Sucursal.Nombre);
                html = html.Replace("@@LOGO", logoname);
                html = html.Replace("@@ESLOGAN", Sucursal.Eslogan == null ? "" : Sucursal.Eslogan);
                html = html.Replace("@@COLOR", colorDocumento);
                html = html.Replace("@@JQUERY", "<script type=\"text/javascript\" src=\"https://code.jquery.com/jquery.min.js\"></script>");

                html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                html = html.Replace("@@IMPRIMIO", UsuarioActual.Nombre.ToString());
                html = html.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));

                html = html.Replace("@@NOMBRE_DV", Personas_VW.NombreCompleto);
                html = html.Replace("@@ID_DV", Personas_VW.DistribuidorID.ToString());
                html = html.Replace("@@ID_VR", Personas_VW.DistribuidorIDVR != null && Personas_VW.DistribuidorIDVR != "0" ? Personas_VW.DistribuidorIDVR.ToString() : " - ");
                html = html.Replace("@@TELEFONO_DV", Personas_VW.TelefonoMovil);
                html = html.Replace("@@DVESTATUS", Personas_VW.DistribuidoresEstatus);
                if (Direccion != null)
                {
                    html = html.Replace("@@DIRECCION", (Direccion.NombreVialidad != null ? Direccion.NombreVialidad.ToUpper() : "") + " " + (Direccion.NumeroExterior != null ? Direccion.NumeroExterior.ToUpper() : "") + ", " + (Direccion.Asentamiento != null ? Direccion.Asentamiento.ToUpper() : "") + ", C.P." + (Direccion.CodigoPostal != null ? Direccion.CodigoPostal.ToString().ToUpper() : ""));
                    html = html.Replace("@@CIUDAD", Direccion.Ciudad);
                    html = html.Replace("@@ESTADO", Direccion.Estado);
                }
                else if (DireccionesMigradasDV != null)
                {
                    html = html.Replace("@@DIRECCION", DireccionesMigradasDV.Direccion.ToUpper());
                    html = html.Replace("@@CIUDAD", DireccionesMigradasDV.Ciudad.ToUpper());
                    html = html.Replace("@@ESTADO", "SIN INFORMACION");
                }
                else
                {
                    html = html.Replace("@@DIRECCION", "SIN INFORMACION");
                    html = html.Replace("@@CIUDAD", "SIN INFORMACION");
                    html = html.Replace("@@ESTADO", "SIN INFORMACION");
                }

                html = html.Replace("@@COORDINADORID", GpoDistribuidorCoordinador.CoordinadorID != 0 ? GpoDistribuidorCoordinador.CoordinadorID.ToString() : " - ");
                html = html.Replace("@@COORDINADORNOMBRE", GpoDistribuidorCoordinador.NombreCompleto != null ? GpoDistribuidorCoordinador.NombreCompleto : " - ");
                html = html.Replace("@@GRUPOID", GpoDistribuidorCoordinador.GrupoID != null ? GpoDistribuidorCoordinador.GrupoID.ToString() : " - ");
                html = html.Replace("@@GRUPODESCRIPCION", GpoDistribuidorCoordinador.Descripcion != null ? GpoDistribuidorCoordinador.Descripcion : " - ");
                html = html.Replace("@@SUCURSAL", Distribuidores_VW.Sucursal_Nombre);

                html = html.Replace("@@NIVELINTERNO", Distribuidores_VW.Nivel_DistribuidorNivel);
                html = html.Replace("@@NIVELORIGEN", Distribuidores_VW.DistribuidorNivel);

                html = html.Replace("@@LINEACREDITO", Distribuidores_VW.LineaCredito?.ToString("C", CultureInfo.CurrentCulture));
                html = html.Replace("@@PROTECCIONCOSTO", Distribuidores_VW.Nivel_ImporteProteccionSaldo?.ToString("C", CultureInfo.CurrentCulture));
                html = html.Replace("@@CANJEAVAL", Distribuidores_VW.Nivel_maximoImporteCanjeAval?.ToString("C", CultureInfo.CurrentCulture));
                html = html.Replace("@@CANJECLIENTE", Distribuidores_VW.Nivel_maximoImporteCanjeCliente?.ToString("C", CultureInfo.CurrentCulture));
                html = html.Replace("@@MAXPPERSONAL", Distribuidores_VW.Nivel_maximoPrestamoPersonal?.ToString("C", CultureInfo.CurrentCulture));
                html = html.Replace("@@COMISIONBASE", Distribuidores_VW.Nivel_PorcComisionBase?.ToString("C", CultureInfo.CurrentCulture));

                html = html.Replace("@@RFC", Personas_VW.RFC);
                html = html.Replace("@@CURP", Personas_VW.CURP);
                html = html.Replace("@@FECHANACIMIENTO", Personas_VW.FechaNacimiento.ToString("dd/MM/yyyy hh:mm:ss tt"));
                html = html.Replace("@@SEXODV", Personas_VW.Sexo);

                //  RENDER CONTRATOS
                var filasContratos = "";
                foreach (var item in Contratos_VW)
                {
                    filasContratos += "<tr class=\"text-center\" style=\"border:none\">";
                    filasContratos += "<td>" + item.ProductoNombre + "</td>";
                    filasContratos += "<td>" + (item.Activo == true ? "SI" : "NO") + "</td>";
                    filasContratos += "<td>" + item.ImporteTotal?.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                    filasContratos += "<td>" + item.SaldoActual?.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                    filasContratos += "<td>" + item.LineaCredito.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                    filasContratos += "<td>" + item.LineaCreditoDisponible?.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                    filasContratos += "</tr>";
                }
                html = html.Replace("@@SALDOS", filasContratos);

                var filasValeras = "";
                if (Valeras_VW.Length > 0)
                {
                    foreach (var item in Valeras_VW)
                    {
                        filasValeras += "<tr class=\"text-center\" style=\"border:none\">";
                        filasValeras += "<td>" + item.ValeraID + "</td>";
                        filasValeras += "<td>" + item.Estatus + "</td>";
                        filasValeras += "<td>" + item.Producto + "</td>";
                        filasValeras += "<td>" + item.serieDesc + "</td>";
                        filasValeras += "<td>" + item.FolioInicial + "</td>";
                        filasValeras += "<td>" + item.FolioFinal + "</td>";
                        filasValeras += "</tr>";
                    }
                }
                else
                {
                    filasValeras += "<tr class=\"text-center\" style=\"border:none\">";
                    filasValeras += "<td colspan=\"6\">SIN REGISTROS</td>";
                    filasValeras += "</tr>";
                }
                html = html.Replace("@@VALERAS", filasValeras);

                var filasCreditos = "";
                if (Creditos_VW.Length > 0)
                {
                    foreach (var item in Creditos_VW)
                    {
                        filasCreditos += "<tr class=\"text-center\" style=\"border:none\">";
                        filasCreditos += "<td>" + item.CreditoID.ToString() + "</td>";
                        filasCreditos += "<td>" + item.PersonaID.ToString() + "</td>";
                        filasCreditos += "<td>" + item.NombreCompleto + "</td>";
                        filasCreditos += "<td>" + item.TipoCreditoDescripcion + "</td>";
                        filasCreditos += "<td>" + item.ImporteTotal.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                        filasCreditos += "<td>" + item.SaldoActual.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                        filasCreditos += "<td>" + item.Plazos.ToString() + "</td>";
                        filasCreditos += "<td>" + item.DiasAtraso.ToString() + "</td>";
                        filasCreditos += "<td>" + item.FechaHoraUltimoPago.ToString("dd/MM/yyyy hh:mm:ss tt") + "</td>";
                        filasCreditos += "<td>" + item.fechaHoraActivacion?.ToString("dd/MM/yyyy hh:mm:ss tt") + "</td>";
                        filasCreditos += "</tr>";
                    }
                }
                else
                {
                    filasCreditos += "<tr class=\"text-center\" style=\"border:none\">";
                    filasCreditos += "<td colspan=\"7\">SIN REGISTROS</td>";
                    filasCreditos += "</tr>";
                }
                html = html.Replace("@@CREDITOS", filasCreditos);

                var filasAplicaciones = "";
                if (Aplicaciones_VW.Length > 0)
                {
                    foreach (var item in Aplicaciones_VW)
                    {
                        filasAplicaciones += "<tr class=\"text-center\" style=\"border:none\">";
                        filasAplicaciones += "<td>" + item.AplicacionID.ToString() + "</td>";
                        filasAplicaciones += "<td>" + item.NombreCaptura + "</td>";
                        filasAplicaciones += "<td>" + item.FechaRegistro.ToString("dd/MM/yyyy hh:mm:ss tt") + "</td>";
                        filasAplicaciones += "<td>" + item.FechaAplicacion.ToString("dd/MM/yyyy hh:mm:ss tt") + "</td>";
                        filasAplicaciones += "<td>" + item.Pago?.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                        filasAplicaciones += "<td>" + item.ImporteBonificacion?.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                        filasAplicaciones += "<td>" + item.ImporteDNI.ToString("C", CultureInfo.CurrentCulture) + "</td>";
                        filasAplicaciones += "<td>" + (item.Activo == true ? "A" : "C") + "</td>";
                        filasAplicaciones += "<td>" + (item.PagoMigrado == true ? "Aclaracion / Bancos" : "Caja") + "</td>";
                        filasAplicaciones += "</tr>";
                    }
                }
                else
                {
                    filasAplicaciones += "<tr class=\"text-center\" style=\"border:none\">";
                    filasAplicaciones += "<td colspan=\"9\">SIN REGISTROS</td>";
                    filasAplicaciones += "</tr>";
                }
                html = html.Replace("@@APLICACIONES", filasAplicaciones);

                var filasConvenios = "";
                if (SolicitudReestructurasConveniosDP_VW.Length > 0)
                {
                    foreach (var item in SolicitudReestructurasConveniosDP_VW)
                    {
                        var herramientaTexto = "";
                        switch (item.Accion)
                        {
                            case 1:
                                herramientaTexto = "Convenio Salida";
                                break;
                            case 2:
                                herramientaTexto = "Reest. Emergencia: " + item.TipoReestructura;
                                break;
                            case 3:
                                herramientaTexto = "Reest. Salida";
                                break;
                            default:
                                herramientaTexto = "Reest. Cliente F.";
                                break;
                        }
                        filasConvenios += "<tr class=\"text-center\" style=\"border:none\">";
                        filasConvenios += "<td>" + herramientaTexto + "</td>";
                        filasConvenios += "<td>" + item.Quincenas + "</td>";
                        filasConvenios += "<td>" + item.Motivo + "</td>";
                        filasConvenios += "<td>" + item.Estatus + "</td>";
                        filasConvenios += "<td>" + item.FechaRegistro.ToString("dd/MM/yyyy hh:mm:ss tt") + "</td>";
                        filasConvenios += "<td>" + item.FechaAceptacion?.ToString("dd/MM/yyyy hh:mm:ss tt") + "</td>";
                        filasConvenios += "</tr>";
                    }
                }
                else
                {
                    filasConvenios += "<tr class=\"text-center\" style=\"border:none\">";
                    filasConvenios += "<td colspan=\"6\">SIN REGISTROS</td>";
                    filasConvenios += "</tr>";
                }
                html = html.Replace("@@SOLICITUDESCONVENIOSYMAS", filasConvenios);

                var filasDireccionesClientes = "";
                if (Creditos_VW.Length > 0)
                {
                    foreach (var item in Creditos_VW)
                    {
                        if (item.PersonaID == DistribuidorID) continue;

                        Direcciones_VW DireccionCliente = DireccionesClientes.Where(x => x.PersonaID == item.PersonaID).FirstOrDefault();
                        DireccionesMigradas DireccionMigradaCliente = DireccionesMigradasClientes.Where(x => x.PersonaID == item.PersonaID).FirstOrDefault();
                        filasDireccionesClientes += "<tr class=\"text-center\" style=\"border:none\">";
                        filasDireccionesClientes += "<td>" + item.PersonaID + "</td>";
                        filasDireccionesClientes += "<td>" + item.NombreCompleto + "</td>";
                        filasDireccionesClientes += "<td>" + item.TelefonoMovil + "</td>";
                        if (DireccionCliente != null)
                        {
                            filasDireccionesClientes += "<td>" + (DireccionCliente.NombreVialidad != null ? DireccionCliente.NombreVialidad.ToUpper() : "") + " " + (DireccionCliente.NumeroExterior != null ? DireccionCliente.NumeroExterior.ToUpper() : "") + ", " + (DireccionCliente.Asentamiento != null ? DireccionCliente.Asentamiento.ToUpper() : "") + ", C.P." + (DireccionCliente.CodigoPostal != null ? DireccionCliente.CodigoPostal.ToString().ToUpper() : "") + "</td>";
                            filasDireccionesClientes += "<td>" + DireccionCliente.Ciudad + "</td>";
                            filasDireccionesClientes += "<td>" + DireccionCliente.ReferenciasGeograficas + "</td>";
                        }
                        else if (DireccionMigradaCliente != null)
                        {
                            filasDireccionesClientes += "<td>" + DireccionMigradaCliente.Direccion + "</td>";
                            filasDireccionesClientes += "<td>" + DireccionMigradaCliente.Ciudad + "</td>";
                            filasDireccionesClientes += "<td> - </td>";
                        }
                        else
                        {
                            filasDireccionesClientes += "<td colspan=\"3\">SIN REGISTRO</td>";
                        }
                        filasDireccionesClientes += "</tr>";
                    }
                }
                else
                {
                    filasDireccionesClientes += "<tr class=\"text-center\" style=\"border:none\">";
                    filasDireccionesClientes += "<td colspan=\"5\">SIN REGISTROS</td>";
                    filasDireccionesClientes += "</tr>";
                }
                html = html.Replace("@@CLIENTESACTIVOSDIRECCIONES", filasDireccionesClientes);

                await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1.html")), html);
                listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1.html")));

                if (Count > 0)
                {
                    // Ejecutamos el proceso de wkhtmltopdf
                    Process p = new()
                    {
                        StartInfo = new ProcessStartInfo(PDF.RUTA_WKHTMLTOPDF())
                    };
                    p.StartInfo.Arguments = string.Concat("", string.Join(" ", listado_archivos), " ", Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
                    p.StartInfo.CreateNoWindow = true;
                    p.Start();
                    await p.WaitForExitAsync();

                    // Obtenemos el contenido de nuestro archivo de PDF
                    var pdf = await System.IO.File.ReadAllBytesAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));

                    // Obtenemos nuestro PDF
                    var pdfStream = new MemoryStream();
                    pdfStream.Write(pdf, 0, pdf.Length);
                    pdfStream.Position = 0;

                    // Limpiamos los archivos que se utilizaron
                    foreach (var archivo in listado_archivos)
                        System.IO.File.Delete(archivo);

                    foreach (var imagen in listado_imagenes)
                        System.IO.File.Delete(imagen);

                    // Eliminamos el PDF
                    System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));

                    await DBContext.Destroy();

                    // Enviamos el PDF a la UI
                    return new FileStreamResult(pdfStream, "application/pdf");
                }

                await DBContext.Destroy();

                return Ok("No se encontro información");
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("getCartaCobro")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetCartaCobro(PeticionesRest.Distribuidores.Distribuidor.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var DistribuidorID = parData.Id;
                parData.ProductoID = producto;

                var Distribuidores_VW = await DBContext.database.QueryAsync<Distribuidores_VW>("WHERE DistribuidorID=@0", DistribuidorID).FirstOrDefaultAsync();
                var Producto = await DBContext.database.SingleOrDefaultByIdAsync<Productos>(Distribuidores_VW.ProductoID);
                var Personas_VW = await DBContext.database.QueryAsync<Personas_VW>("WHERE PersonaID=@0", DistribuidorID).SingleOrDefaultAsync();
                var UltimaFechaCorte = await DBContext.database.QueryAsync<FechaCorte_VW>("WHERE (SucursalID = @0) ORDER BY fecha DESC", Distribuidores_VW.SucursalID).FirstOrDefaultAsync();
                var RelacionCortes_VW = await DBContext.database.QueryAsync<RelacionCortes_VW>("WHERE (ProductoID = @0) AND (SucursalID = @1) AND (fechaCorte = CONVERT(DATETIME, @2, 103)) AND DistribuidorID IN (@3)", parData.ProductoID, Distribuidores_VW.SucursalID, UltimaFechaCorte.fechaCorte, DistribuidorID).FirstOrDefaultAsync();

                var Sucursal = await DBContext.database.QueryAsync<Sucursales_VW>("WHERE SucursalID = @0", Distribuidores_VW.SucursalID).SingleOrDefaultAsync();
                if (Sucursal != null && Sucursal.Eslogan != null)
                {
                    byte[] bytes = System.Text.Encoding.Default.GetBytes(Sucursal.Eslogan);
                    Sucursal.Eslogan = System.Text.Encoding.UTF8.GetString(bytes);
                    Sucursal.Eslogan = HttpUtility.HtmlEncode(Sucursal.Eslogan);
                }

                // // Generamos un prefijo del nombre de archivo
                var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");
                var listado_archivos = new List<string>();
                var listado_imagenes = new List<string>();
                var Count = 1;

                var colorDocumento = "";
                switch (Producto.EmpresaId)
                {
                    case 10:
                    case 15:
                        colorDocumento = "#F7944C";
                        break;
                    case 9:
                        colorDocumento = "#BE56BE";
                        break;
                    default:
                        colorDocumento = "#1DA1F2";
                        break;
                }

                var logo = Producto.Logo;

                Guid g = Guid.NewGuid();

                var logoname = string.Concat("logo", "_" + g.ToString() + ".jpeg");

                NumberFormatInfo nfi = new CultureInfo(CultureInfo.CurrentCulture.ToString(), false).NumberFormat;
                nfi.PercentDecimalDigits = 0;

                await System.IO.File.WriteAllBytesAsync(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "LogoImg", logoname), logo);
                listado_imagenes.Add(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "RecursosPDF", "LogoImg", logoname));

                // SE EMPIEZA A REEMPLAZAR LAS VARIABLES DE LA PLANTILLA DEL HTML
                var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Distribuidores", "CartaCobro.html"));
                html = html.Replace("@@SUCURSAL", Sucursal.Nombre);
                html = html.Replace("@@LOGO", logoname);
                html = html.Replace("@@ESLOGAN", Sucursal.Eslogan == null ? "" : Sucursal.Eslogan);
                html = html.Replace("@@COLOR", colorDocumento);
                html = html.Replace("@@JQUERY", "<script type=\"text/javascript\" src=\"https://code.jquery.com/jquery.min.js\"></script>");

                html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                html = html.Replace("@@IMPRIMIO", UsuarioActual.Nombre.ToString());
                html = html.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                html = html.Replace("@@DIAACTUAL", DateTime.Now.ToString("dd"));
                html = html.Replace("@@MESACTUAL", DateTime.Now.ToString("MM"));
                html = html.Replace("@@ANIOACTUAL", DateTime.Now.ToString("yyyy"));
                html = html.Replace("@@NOMBREDV", Personas_VW.NombreCompleto);
                html = html.Replace("@@CANTIDADCOBRO", Convert.ToDecimal(RelacionCortes_VW.saldoVencidoTotal).ToString("C", CultureInfo.CurrentCulture));

                await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1.html")), html);
                listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1.html")));

                if (Count > 0)
                {
                    // Ejecutamos el proceso de wkhtmltopdf
                    Process p = new()
                    {
                        StartInfo = new ProcessStartInfo(PDF.RUTA_WKHTMLTOPDF())
                    };
                    p.StartInfo.Arguments = string.Concat("", string.Join(" ", listado_archivos), " ", Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
                    p.StartInfo.CreateNoWindow = true;
                    p.Start();
                    await p.WaitForExitAsync();

                    // Obtenemos el contenido de nuestro archivo de PDF
                    var pdf = await System.IO.File.ReadAllBytesAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));

                    // Obtenemos nuestro PDF
                    var pdfStream = new MemoryStream();
                    pdfStream.Write(pdf, 0, pdf.Length);
                    pdfStream.Position = 0;

                    // Limpiamos los archivos que se utilizaron
                    foreach (var archivo in listado_archivos)
                        System.IO.File.Delete(archivo);

                    foreach (var imagen in listado_imagenes)
                        System.IO.File.Delete(imagen);

                    // Eliminamos el PDF
                    System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));

                    await DBContext.Destroy();

                    // Enviamos el PDF a la UI
                    return new FileStreamResult(pdfStream, "application/pdf");
                }

                await DBContext.Destroy();

                return Ok("No se encontro información");
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpGet]
        [Route("getDist/{DistribuidorID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerDistPorId(int DistribuidorID)
        {
            try
            {
                var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Distribuidores_VW>("WHERE DistribuidorID=@0", DistribuidorID).FirstOrDefaultAsync();
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
        [Route("montgetDist/{DistribuidorID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerDistPorIdMontos(int DistribuidorID)
        {
            try
            {
                var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Prospectos_VW>("WHERE ProspectoID=@0", DistribuidorID).FirstOrDefaultAsync();
                if (res != null)
                {
                    var nivel = res.NivelOrigen_BuroID;

                    var Montos = await DBContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.NivelOrigen_Buro_LC_VW>("WHERE NivelOrigen_BuroID=@0", nivel).FirstOrDefaultAsync();
                    await DBContext.Destroy();
                    return Ok(Montos);
                }
                else
                {

                    return Ok();
                }
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpGet]
        [Route("getDistribuidorEmpresa/{DistribuidorID}")]
        [Authorize]
        // [Code.TProteccionAdmin]
        public async Task<IActionResult> ObtenerPorIdEmpresa(int DistribuidorID)
        {
            try
            {
                var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();
                var empresaID = UsuarioActual.usuario_empresaId;
                // if (empresaID == 6)
                // {
                //      var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Distribuidores_VW>("WHERE (DistribuidorID=@0) AND (EmpresaId=6)", DistribuidorID).FirstOrDefaultAsync();                                                                                   // ("WHERE  (id_estado = @0) AND (id_municipio = @1)", parData.EstadoId, parData.MunicipioId));
                //     await DBContext.Destroy();
                //     return Ok(res);
                // }else{
                var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Distribuidores.Distribuidores_VW>("WHERE DistribuidorID=@0", DistribuidorID).FirstOrDefaultAsync();                                                                         // ("WHERE  (id_estado = @0) AND (id_municipio = @1)", parData.EstadoId, parData.MunicipioId));
                await DBContext.Destroy();
                return Ok(res);
                // }
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
        public async Task<IActionResult> Get(PeticionesRest.Distribuidores.Distribuidor.Get parData)
        {
            if (parData.Id != 0)
            {
                try
                {
                    var res = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Distribuidores.Distribuidores>(parData.Id);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }
            }
            else
            {
                try
                {
                    var Distribuidores = await DBContext.database.FetchAsync<Distribuidores_VW>();
                    ArrayList res = new();
                    foreach (var Distribuidor in Distribuidores)
                    {
                        res.Add(new
                        {
                            Distribuidor.DistribuidorID,
                            Distribuidor.DistribuidoresEstatusID,
                            Distribuidor.DistribuidorNivelID,
                            Distribuidor.NoCreditosActivos,
                            Distribuidor.FechaHoraRegistro,
                            Distribuidor.UsuarioIDRegistro,
                            Distribuidor.SucursalID,
                            Distribuidor.NumeroDist,
                            Distribuidor.GestorID,
                            Distribuidor.ValidaContrato,
                            Distribuidor.tipoRelacionID,
                            Distribuidor.ReferenciaContable,
                            Distribuidor.creditoPromotorId,
                            Distribuidor.validaContratoUsuarioId,
                            Distribuidor.fechaHoraValidaContrato,
                            Distribuidor.usuarioIdValidaContrato,
                            Distribuidor.numCreditosPersonales,
                            Distribuidor.PlazosEspeciales,
                            Distribuidor.Sucursal_Nombre,
                            Distribuidor.PersonaNombre,
                            //Persona = await DBContext.database.SingleByIdAsync<Personas>(Distribuidor.DistribuidorID),
                            FirmaDistribuidor = ""//String.Format("{0}://{1}{2}/wwwroot/Archivos/FirmaDistribuidor/{3}", Request.Scheme, Request.Host, Request.PathBase, "firma.png")
                        });
                    }
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return BadRequest(ex.Message);
                }
            }
        }

        [HttpPost]
        [Route("getDistribuidores")]
        [Authorize]
        // [Code.TProteccionProducto]
        public async Task<IActionResult> getDistribuidores(PeticionesRest.Distribuidores.Distribuidor.Get parData)
        {
            // if (parData.Id != 0)
            // {
            try
            {
                var res = await DBContext.database.FetchAsync<DBContext.DBConfia.Distribuidores.Distribuidores>();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
            // }
        }

        [HttpPost]
        [Route("getinfo")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetInfo()
        {
            try
            {
                var res = await DBContext.database.FetchAsync<DistribuidoresInfo>();
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
        [Route("getBySucursal")]
        [Authorize]
        [Code.TProteccionAdmin]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> GetBySucursal(PeticionesRest.Distribuidores.Distribuidor.Get parData)
        {
            try
            {
                var Distribuidores = await DBContext.database.FetchAsync<Distribuidores_VW>("WHERE (SucursalID = @SucursalID OR @SucursalID = 0) AND (GrupoID = @GrupoID OR @GrupoID = 0)", parData);
                ArrayList res = new();
                foreach (var Distribuidor in Distribuidores)
                {
                    res.Add(new
                    {
                        Distribuidor.DistribuidorID,
                        Distribuidor.DistribuidoresEstatusID,
                        Distribuidor.DistribuidorNivelID,
                        Distribuidor.NoCreditosActivos,
                        Distribuidor.FechaHoraRegistro,
                        Distribuidor.UsuarioIDRegistro,
                        Distribuidor.SucursalID,
                        Distribuidor.NumeroDist,
                        Distribuidor.GestorID,
                        Distribuidor.ValidaContrato,
                        Distribuidor.tipoRelacionID,
                        Distribuidor.ReferenciaContable,
                        Distribuidor.creditoPromotorId,
                        Distribuidor.validaContratoUsuarioId,
                        Distribuidor.fechaHoraValidaContrato,
                        Distribuidor.usuarioIdValidaContrato,
                        Distribuidor.numCreditosPersonales,
                        Distribuidor.PlazosEspeciales,
                        Distribuidor.PersonaNombre,
                        //Persona = new { Distribuidor.PersonaID,  Distribuidor.PersonaNombre, Distribuidor.PersonaIDRegistro, Distribuidor.PersonaIDValidaContrato },
                        //Persona = await DBContext.database.SingleByIdAsync<Personas>(Distribuidor.DistribuidorID), //(await Distribuidor.CH__PERSONA(this.DBContext)).FirstOrDefault(),
                        FirmaDistribuidor = "" //string.Format("{0}://{1}{2}/wwwroot/Archivos/FirmaDistribuidor/{3}", Request.Scheme, Request.Host, Request.PathBase, "firma.png")
                    });
                }
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
        [Route("getByZonaProd")]
        [Authorize]
        [Code.TProteccionProducto]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> getByZonaProd(PeticionesRest.Distribuidores.Distribuidor.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {

                //  parData.ProductoID = producto;
                // var Distribuidores = await DBContext.database.FetchAsync<Distribuidores_VW>("WHERE (ProductoID = @ProductoID) AND (SucursalID = @SucursalID OR @SucursalID = 0) AND (GrupoID = @GrupoID OR @GrupoID = 0)", parData);
                var ZonaID = await DBContext.database.FetchAsync<Distribuidores_VW>("WHERE SucursalID = @SucursalID", parData);
                var zona_id = (ZonaID != null && ZonaID.Any()) ? ZonaID.First().ZonaID : 0;
                var Distribuidores = await DBContext.database.FetchAsync<Distribuidores_VW>("WHERE ZonaID = @0", zona_id);

                ArrayList res = new();
                foreach (var Distribuidor in Distribuidores)
                {
                    res.Add(new
                    {
                        Distribuidor.DistribuidorID,
                        Distribuidor.DistribuidoresEstatusID,
                        Distribuidor.DistribuidorNivelID,
                        Distribuidor.NoCreditosActivos,
                        Distribuidor.FechaHoraRegistro,
                        Distribuidor.UsuarioIDRegistro,
                        Distribuidor.SucursalID,
                        Distribuidor.NumeroDist,
                        Distribuidor.GestorID,
                        Distribuidor.ValidaContrato,
                        Distribuidor.tipoRelacionID,
                        Distribuidor.ReferenciaContable,
                        Distribuidor.creditoPromotorId,
                        Distribuidor.validaContratoUsuarioId,
                        Distribuidor.fechaHoraValidaContrato,
                        Distribuidor.usuarioIdValidaContrato,
                        Distribuidor.numCreditosPersonales,
                        Distribuidor.PlazosEspeciales,
                        Distribuidor.PersonaNombre,
                        //Persona = new { Distribuidor.PersonaID,  Distribuidor.PersonaNombre, Distribuidor.PersonaIDRegistro, Distribuidor.PersonaIDValidaContrato },
                        //Persona = await DBContext.database.SingleByIdAsync<Personas>(Distribuidor.DistribuidorID), //(await Distribuidor.CH__PERSONA(this.DBContext)).FirstOrDefault(),
                        FirmaDistribuidor = "" //string.Format("{0}://{1}{2}/wwwroot/Archivos/FirmaDistribuidor/{3}", Request.Scheme, Request.Host, Request.PathBase, "firma.png")
                    });

                }

                await DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("getBySucursalProd")]
        [Authorize]
        [Code.TProteccionProducto]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> GetBySucursalProd(PeticionesRest.Distribuidores.Distribuidor.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {

                //  parData.ProductoID = producto;
                // var Distribuidores = await DBContext.database.FetchAsync<Distribuidores_VW>("WHERE (ProductoID = @ProductoID) AND (SucursalID = @SucursalID OR @SucursalID = 0) AND (GrupoID = @GrupoID OR @GrupoID = 0)", parData);
                var ZonaID = await DBContext.database.FetchAsync<Distribuidores_VW>("WHERE SucursalID = @SucursalID", parData);
                var zona_id = (ZonaID != null && ZonaID.Any()) ? ZonaID.First().ZonaID : 0;
                var Distribuidores = await DBContext.database.FetchAsync<Distribuidores_VW>("WHERE ZonaID = @0", parData.SucursalID);

                ArrayList res = new();
                foreach (var Distribuidor in Distribuidores)
                {
                    res.Add(new
                    {
                        Distribuidor.DistribuidorID,
                        Distribuidor.DistribuidoresEstatusID,
                        Distribuidor.DistribuidorNivelID,
                        Distribuidor.NoCreditosActivos,
                        Distribuidor.FechaHoraRegistro,
                        Distribuidor.UsuarioIDRegistro,
                        Distribuidor.SucursalID,
                        Distribuidor.NumeroDist,
                        Distribuidor.GestorID,
                        Distribuidor.ValidaContrato,
                        Distribuidor.tipoRelacionID,
                        Distribuidor.ReferenciaContable,
                        Distribuidor.creditoPromotorId,
                        Distribuidor.validaContratoUsuarioId,
                        Distribuidor.fechaHoraValidaContrato,
                        Distribuidor.usuarioIdValidaContrato,
                        Distribuidor.numCreditosPersonales,
                        Distribuidor.PlazosEspeciales,
                        Distribuidor.PersonaNombre,
                        //Persona = new { Distribuidor.PersonaID,  Distribuidor.PersonaNombre, Distribuidor.PersonaIDRegistro, Distribuidor.PersonaIDValidaContrato },
                        //Persona = await DBContext.database.SingleByIdAsync<Personas>(Distribuidor.DistribuidorID), //(await Distribuidor.CH__PERSONA(this.DBContext)).FirstOrDefault(),
                        FirmaDistribuidor = "" //string.Format("{0}://{1}{2}/wwwroot/Archivos/FirmaDistribuidor/{3}", Request.Scheme, Request.Host, Request.PathBase, "firma.png")
                    });

                }

                await DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost("getByCoordinador")]
        [Authorize]
        [Code.TProteccionProducto]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> getByCoordinador(PeticionesRest.Distribuidores.Distribuidor.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                DBContext.database.CommandTimeout = 9999;
                parData.ProductoID = producto;
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                parData.UsuarioID = UsuarioActual.UsuarioID;

                var res = await DBContext.database.QueryAsync<CoordinadoresDistribuidores_VW>("EXEC Gestoria.pa_ObtenerSocias @SucursalID,@CoordinadorID,@ProductoID", parData).ToArrayAsync();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return Ok(ex);
                // return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("getByCoordinadorSucursal")]
        [Authorize]
        [Code.TProteccionProducto]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> GetByCoordinadorSucursal(PeticionesRest.Distribuidores.Distribuidor.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                DBContext.database.CommandTimeout = 9999;
                parData.ProductoID = producto;
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                parData.UsuarioID = UsuarioActual.UsuarioID;
                //var relCortes = await DBContext.database.QueryAsync<DBContext.DBConfia.Cortes.RelacionCortes>("SELECT TOP 1 fechaCorte FROM Cortes.RelacionCortes GROUP BY fechaCorte ORDER BY fechaCorte DESC").SingleOrDefaultAsync();
                //parData.fechaCorte = relCortes.fechaCorte.ToString();

                string query = "EXEC Creditos.pa_GetRelDistribuidoresByCoordinador @CoordinadorID,@ProductoID,@SucursalID,@UsuarioID,@fechaCorte";
                var res = await DBContext.database.QueryAsync<CoordinadoresDistribuidores_VW>(query, parData).ToArrayAsync();
                // var res = await DBContext.database.FetchAsync<CoordinadoresDistribuidores_VW>("WHERE (ProductoID = @ProductoID) AND (SucursalID = @SucursalID) AND (CoordinadorID = @CoordinadorID) AND (UsuarioID = @UsuarioID) AND (fechaCorte = @fechaCorte OR fechaCorte IS NULL) AND (saldoPlazo>0) ", parData);
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
        [Route("getByCoordinadorSucursalHistorico")]
        [Authorize]
        [Code.TProteccionProducto]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> GetByCoordinadorSucursalHistorico(PeticionesRest.Distribuidores.Distribuidor.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                parData.ProductoID = producto;

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                parData.UsuarioID = UsuarioActual.UsuarioID;

                var res = await DBContext.database.FetchAsync<CoordinadoresDistribuidoresHistorico_VW>("WHERE (ProductoID = @ProductoID) AND (SucursalID = @SucursalID) AND (CoordinadorID = @CoordinadorID) AND (fechaCorte = @fechaCorte OR fechaCorte IS NULL) AND (UsuarioID = @UsuarioID)", parData);
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
        [Route("getFoliosValera")]
        [Authorize]
        [Code.TProteccionProducto]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> GetFoliosValera(PeticionesRest.Distribuidores.Distribuidor.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                var res = await DBContext.database.FetchAsync<ValeraDetalle>("SELECT vd.ValeDigital, vd.ValeraID, vd.Folio, vd.Estatus, vd.DigitalFolio, vd.DigitalImporte, vd.DigitalPlazo, vd.DigitalTipoDesembolsoId, vd.AdicProductoId, vd.AdicImporte, vd.CanjeUsuarioId, vd.CanjeFecha, vd.CanceladoUsuarioId, vd.CanceladoFecha FROM  Distribuidores.ValeraDetalle AS vd INNER JOIN Distribuidores.Valera AS v ON vd.ValeraID = v.ValeraID WHERE (v.DistribuidorID = @0) AND (vd.Folio = @1) AND (v.serieId = @2) AND (ProductoID = @3)", parData.Id, parData.Folio, parData.SerieId, producto);
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
        [Route("getNivelProducto")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetNivelProducto(PeticionesRest.Distribuidores.Distribuidor.Get parData)
        {
            try
            {
                var Distribuidor = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Distribuidores.Distribuidores>(parData.Id);
                var res = await DBContext.database.SingleOrDefaultByIdAsync<NivelesProductos>(new { parData.ProductoID, Distribuidor.DistribuidorNivelID });
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
        [Route("AddAval")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> AddAval(PeticionesRest.Distribuidores.Distribuidor.AddAval parData)
        {
            var Person = await DBContext.database.QueryAsync<Personas>("WHERE  (CURP = @CURP) AND (RFC = @RFC)", parData).SingleOrDefaultAsync();
            if (Person?.PersonaID > 0)
            {
                var res = new
                {
                    res = 2,
                    msj = "La persona ya existe con el ID: " + Person.PersonaID.ToString(),
                    Data = new { }
                };
            }
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            try
            {
                DBContext.database.BeginTransaction();
                var Persona = new Personas()
                {
                    Nombre = parData.Nombre?.ToUpper(),
                    ApellidoPaterno = parData.ApellidoPaterno?.ToUpper(),
                    ApellidoMaterno = parData.ApellidoMaterno?.ToUpper(),
                    FechaNacimiento = parData.FechaNacimiento,
                    CURP = parData.CURP?.ToUpper(),
                    RFC = parData.RFC?.ToUpper(),
                    SexoID = parData.SexoID,
                    EstadoCivilID = parData.EstadoCivilID,
                    // NombreConyuge = parData.NombreConyuge,
                    EscolaridadID = parData.EscolaridadID,
                    DependientesEconomicos = parData.DependientesEconomicos,
                    TelefonoDomicilio = parData.TelefonoDomicilio,
                    TelefonoMovil = parData.TelefonoMovil,
                    LugarNacimiento = parData.LugarNacimiento,
                    CorreoElectronico = parData.CorreoElectronico?.ToUpper(),
                    NombreConyuge = parData.NombreConyuge?.ToUpper(),
                    Observaciones = parData.Observaciones ?? "",
                    identificacionTipoId = parData.identificacionTipoId,
                    identificacionNumero = parData.identificacionNumero,
                    CreacionPersonaID = (long)UsuarioActual.PersonaID,
                    CreacionUsuarioID = UsuarioActual.UsuarioID,
                    CreacionFecha = DateTime.Now
                };
                await DBContext.database.InsertAsync(Persona);
                var Aval = new DBContext.DBConfia.Distribuidores.Avales()
                {
                    DistribuidorID = parData.DistribuidorID,
                    PersonaID = Persona.PersonaID,
                    FechaHoraRegistro = DateTime.Now,
                    TipoAvalID = 1,
                    PersonaIDRegistro = (long)UsuarioActual.PersonaID,
                    UsuarioIDRegistro = UsuarioActual.UsuarioID,
                };
                await DBContext.database.InsertAsync(Aval);
                var asentamiento = await DBContext.database.QueryAsync<DBContext.DBConfia.Catalogos.Asentamientos>("WHERE AsentamientoID=@0", parData.AgregarAval.DireccionPersona_AsentamientoID).FirstOrDefaultAsync();
                var Direccion = new DBContext.DBConfia.General.Direcciones()
                {
                    // DireccionID
                    vialidadTipoId = parData.AgregarAval.DireccionPersona_vialidadTipoId,
                    orientacionVialidadTipoId = parData.AgregarAval.DireccionPersona_orientacionVialidadTipoId,
                    AsentamientoID = parData.AgregarAval.DireccionPersona_AsentamientoID,
                    NombreVialidad = parData.AgregarAval.DireccionPersona_NombreVialidad,
                    NumeroExterior = parData.AgregarAval.DireccionPersona_NumeroExterior,
                    NumeroInterior = parData.AgregarAval.DireccionPersona_NumeroInterior,
                    // ReferenciasGeograficas
                    ViviendaTipoId = parData.AgregarAval.DireccionPersona_ViviendaTipoId,
                    CreacionFecha = DateTime.Now,
                    CreacionPersonaID = (long)UsuarioActual.PersonaID,
                    codigoPostal = asentamiento.CodigoPostal.ToString(),
                    CreacionUsuarioID = UsuarioActual.UsuarioID,
                };
                await DBContext.database.InsertAsync(Direccion);
                // PersonasDirecciones
                var PersonaDireccion = new DBContext.DBConfia.General.PersonasDirecciones()
                {
                    PersonaID = Aval.PersonaID,
                    DireccionID = Direccion.DireccionID
                };
                await DBContext.database.InsertAsync(PersonaDireccion);
                //DIRECCION LABORAL
                if (parData.AgregarAval.Laboral_Trabaja == true)
                {
                    var asentamientoLaboral = await DBContext.database.QueryAsync<DBContext.DBConfia.Catalogos.Asentamientos>("WHERE AsentamientoID=@0", parData.AgregarAval.DireccionLaboral_AsentamientoID).FirstOrDefaultAsync();
                    var vialidadTipoId = parData.AgregarAval;
                    //.DireccionLaboral_vialidadTipoId;
                    var orientacionVialidadTipoId = parData.AgregarAval.DireccionPersona_orientacionVialidadTipoId;
                    var ViviendaTipoId = parData.AgregarAval.DireccionLaboral_viviendaTipoId;
                    var DireccionLaboral = new DBContext.DBConfia.General.Direcciones()
                    {
                        // DireccionID
                        vialidadTipoId = parData.AgregarAval.DireccionLaboral_vialidadTipoId,
                        orientacionVialidadTipoId = parData.AgregarAval.DireccionPersona_orientacionVialidadTipoId,
                        AsentamientoID = parData.AgregarAval.DireccionLaboral_AsentamientoID,
                        NombreVialidad = parData.AgregarAval.DireccionLaboral_NombreVialidad,
                        NumeroExterior = parData.AgregarAval.DireccionLaboral_NumeroExterior,
                        NumeroInterior = parData.AgregarAval.DireccionLaboral_NumeroInteriorLaboral,
                        ReferenciasGeograficas = "",
                        ViviendaTipoId = parData.AgregarAval.DireccionLaboral_viviendaTipoId,
                        CreacionFecha = DateTime.Now,
                        CreacionPersonaID = (long)UsuarioActual.PersonaID,
                        codigoPostal = asentamientoLaboral.CodigoPostal.ToString(),
                        CreacionUsuarioID = UsuarioActual.UsuarioID,
                    };
                    await DBContext.database.InsertAsync(DireccionLaboral);
                    var PersonaDireccionLaboral = new DBContext.DBConfia.General.PersonasDirecciones()
                    {
                        PersonaID = Aval.PersonaID,
                        DireccionID = DireccionLaboral.DireccionID
                    };
                    await DBContext.database.InsertAsync(PersonaDireccionLaboral);
                    var ocupacion = await DBContext.database.QueryAsync<DBContext.DBConfia.Catalogos.Ocupaciones>("WHERE Id=@0", parData.AgregarAval.Laboral_OcupacionID).FirstOrDefaultAsync();
                    var Empleo = new DBContext.DBConfia.General.Empleos()
                    {
                        //   EmpleoID
                        PersonaID = Aval.PersonaID,
                        OcupacionID = parData.AgregarAval.Laboral_OcupacionID,
                        Empresa = parData.AgregarAval.Laboral_Empresa,
                        Puesto = ocupacion.Ocupacion,
                        Telefono = parData.AgregarAval.Laboral_Telefono,
                        DireccionID = DireccionLaboral.DireccionID,
                        FechaIngreso = DateTime.Now,
                        //   FechaTermino = null,
                        SueldoMensual = parData.AgregarAval.Laboral_SueldoMensual,
                        Activo = true,
                        CreacionFecha = DateTime.Now,
                        CreacionPersonaID = (long)UsuarioActual.PersonaID,
                        CreacionUsuarioID = UsuarioActual.UsuarioID,
                    };
                    await DBContext.database.InsertAsync(Empleo);
                }
                DBContext.database.CompleteTransaction();
                // var Data = await DBContext.database.QueryAsync<Personas_VW>("WHERE PersonaID=@0", Persona.PersonaID).SingleOrDefaultAsync();
                var Data = await DBContext.database.QueryAsync<AvalesDistribuidor_VW>("WHERE PersonaID=@0", Persona.PersonaID).SingleOrDefaultAsync();
                var res = new
                {
                    res = 1,
                    msj = "Se creó la persona (aval) con el id: " + Persona.PersonaID,
                    Data
                };
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                DBContext.database.AbortTransaction();
                return BadRequest("ERROR AL GUARDAR LA PERSONA: " + ex.Message);
            }
        }

        [HttpPost]
        [Route("getdistsuc")]
        [Authorize]
        //[Code.TProteccionProducto]
        public async Task<IActionResult> GetDistSucursal(PeticionesRest.Distribuidores.Cliente.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                parData.ProductoID = producto;
                parData.Nombre = "%" + parData.Nombre + "%";

                var Distribuidor = await DBContext.database.FetchAsync<DistribuidoresSucursal_VW>("SELECT TOP (100) * FROM Distribuidores.DistribuidoresSucursal_VW WHERE (ProductoID = @ProductoID) AND (Distribuidor LIKE @Nombre)", parData);

                await DBContext.Destroy();
                return Ok(Distribuidor);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }

        }

        [HttpPost]
        [Route("cancelartemp")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> CancelarTemp(PeticionesRest.Distribuidores.Distribuidor.CancelarTemp parData)
        {
            try
            {
                var Distribuidor = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Distribuidores.Distribuidores>(parData.Id);
                Distribuidor.DistribuidoresEstatusID = "T";
                await DBContext.database.UpdateAsync(Distribuidor);
                await DBContext.Destroy();
                return Ok(Distribuidor);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("activar")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Activar(PeticionesRest.Distribuidores.Distribuidor.CancelarTemp parData)
        {
            try
            {
                var Distribuidor = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Distribuidores.Distribuidores>(parData.Id);
                Distribuidor.DistribuidoresEstatusID = "N";
                await DBContext.database.UpdateAsync(Distribuidor);
                await DBContext.Destroy();
                return Ok(Distribuidor);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("cancelarpermanente")]
        [Authorize]
        //[Code.TProteccionProducto]
        public async Task<IActionResult> CancelarPermanente(PeticionesRest.Distribuidores.Distribuidor.CancelarPermanente parData)
        {
            try
            {
                var Distribuidor = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Distribuidores.Distribuidores>(parData.Id);
                Distribuidor.DistribuidoresEstatusID = parData.DistribuidoresEstatusID;
                await DBContext.database.UpdateAsync(Distribuidor);
                await DBContext.Destroy();
                return Ok(Distribuidor);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("AceptarSolicitud")]
        [Authorize]
        //[Code.TProteccionProducto]
        public async Task<IActionResult> AceptarSolicitud(PeticionesRest.Distribuidores.Distribuidor.AceptarSolicitud parData)
        {
            try
            {
                var Distribuidor = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Distribuidores.Distribuidores>(parData.DistribuidorID);
                Distribuidor.DistribuidoresEstatusID = "T";
                await DBContext.database.UpdateAsync(Distribuidor);

                var Solicitud = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Distribuidores.SolicitudCancelTemp>(parData.SolicitudID);
                Solicitud.EstatusSolicitud = "A";
                await DBContext.database.UpdateAsync(Solicitud);

                await DBContext.Destroy();
                return Ok(Solicitud);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }


        [HttpPost]
        [Route("AceptarSolicitudFallecida")]
        [Authorize]
        //[Code.TProteccionProducto]
        public async Task<IActionResult> AceptarSolicitudFallecida(PeticionesRest.Distribuidores.Distribuidor.AceptarSolicitud parData)
        {
            try
            {
                var Distribuidor = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Distribuidores.Distribuidores>(parData.DistribuidorID);
                Distribuidor.DistribuidoresEstatusID = "F";
                await DBContext.database.UpdateAsync(Distribuidor);

                var Solicitud = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Distribuidores.SolicitudFallecida>(parData.SolicitudID);
                Solicitud.EstatusSolicitud = "A";
                await DBContext.database.UpdateAsync(Solicitud);

                await DBContext.Destroy();
                return Ok(Solicitud);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("CancelarSolicitudFallecida")]
        [Authorize]
        //[Code.TProteccionProducto]
        public async Task<IActionResult> CancelarSolicitudFallecida(PeticionesRest.Distribuidores.Distribuidor.AceptarSolicitud parData)
        {
            try
            {
                var Distribuidor = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Distribuidores.SolicitudFallecida>(parData.SolicitudID);
                Distribuidor.EstatusSolicitud = "C";
                await DBContext.database.UpdateAsync(Distribuidor);
                await DBContext.Destroy();
                return Ok(Distribuidor);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("CancelarSolicitud")]
        [Authorize]
        //[Code.TProteccionProducto]
        public async Task<IActionResult> CancelarSolicitud(PeticionesRest.Distribuidores.Distribuidor.AceptarSolicitud parData)
        {
            try
            {
                var Distribuidor = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Distribuidores.SolicitudCancelTemp>(parData.SolicitudID);
                Distribuidor.EstatusSolicitud = "C";
                await DBContext.database.UpdateAsync(Distribuidor);
                await DBContext.Destroy();
                return Ok(Distribuidor);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPut]
        [Route("DisableAppSocia")]
        [Authorize]
        //[Code.TProteccionProducto]
        public async Task<IActionResult> DisableAppSocia(PeticionesRest.Distribuidores.Distribuidor.ValidaAtraso parData)
        {
            try
            {
                DBContext.database.BeginTransaction();
                var Distribuidor = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Distribuidores.Distribuidores>(parData.DistribuidorID);
                Distribuidor.AccesoAppVales = false;
                Distribuidor.AccesoAppVales2 = false;
                await DBContext.database.UpdateAsync(Distribuidor);
                DBContext.database.CompleteTransaction();
                await DBContext.Destroy();
                return Ok(Distribuidor);
            }
            catch (Exception ex)
            {
                DBContext.database.AbortTransaction();
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("getbyzona")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetbyZona(PeticionesRest.Distribuidores.Distribuidor.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            //if (parData.Nombre != null)
            //{
            try
            {
                parData.ProductoID = producto;
                //parData.Nombre += "%";

                var Sucursal = await DBContext.database.SingleByIdAsync<Sucursales>(parData.SucursalID);

                parData.ZonaID = Sucursal.ZonaID;

                var Distribuidores = await DBContext.database.FetchAsync<Distribuidores_VW>("WHERE (ProductoID = @ProductoID) AND (ZonaID = @ZonaID) AND (DistribuidorID = @DistribuidorID OR @DistribuidorID = 0)", parData);

                await DBContext.Destroy();
                return Ok(Distribuidores);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }

            //}
            //else
            //{
            //    ArrayList res = new();
            //    return Ok(res);
            //}
        }

        [Consumes("multipart/form-data")]
        [HttpPost]
        [Route("subirExpediente")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> SubirExpediente([FromForm] ConfiaWebApi.PeticionesRest.Distribuidores.Distribuidor.UploadFile parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var DocValida = new SolicitudFallecida();
                if (parData.SolicitudID > 0)
                {
                    DocValida = await DBContext.database.SingleByIdAsync<SolicitudFallecida>(parData.SolicitudID);
                    if (DocValida.Autorizado == true)
                    {
                        await DBContext.Destroy();
                        return BadRequest("Este Documento ya fue validado");
                    }
                }

                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                var basicToken = Convert.ToBase64String(plainTextBytes);
                string path = $"{Configuracion["BucketApi:AwsPath_DocsExpediente"]}/{parData.DistribuidorID}";
                var ext = Path.GetExtension(parData.doc.FileName);
                string file_name = $"{parData.DistribuidorID}{ext}";
                byte[] file_byte = FilesManager.ConvertFiletoByteArray(parData.doc);

                long DocumentoIDAux = 0;

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
                        var Consulta = await DBContext.database.QueryAsync<SolicitudFallecida>("WHERE DistribuidorID = @0", parData.DistribuidorID).FirstOrDefaultAsync();
                        if (Consulta == null)
                        {
                            //Solicitud Fallecida
                            var Solicitud = new SolicitudFallecida()
                            {
                                DistribuidorID = parData.DistribuidorID,
                                Ruta = $"{path}/{file_name}",
                                Observaciones = parData.Observaciones == "" ? null : parData.Observaciones,
                                UsuarioRegistraID = UsuarioActual.UsuarioID,
                                PersonaRegistraID = (long)UsuarioActual.PersonaID,
                                FechaRegistra = DateTime.Now,
                                // EstatusID = 2,
                                // EstatusSolicitud = null
                            };
                            await DBContext.database.InsertAsync(Solicitud);
                            DocumentoIDAux = Solicitud.SolicitudID;

                            await DBContext.Destroy();
                            return Ok("Documento Guardado Correctamente");
                        }
                        else
                        {
                            var Consulta2 = await DBContext.database.QueryAsync<SolicitudFallecida>("WHERE DistribuidorID = @0", parData.DistribuidorID).SingleOrDefaultAsync();
                            Consulta2.Ruta = $"{path}/{file_name}";
                            Consulta2.Observaciones = parData.Observaciones == "" ? null : parData.Observaciones;
                            Consulta2.UsuarioRegistraID = UsuarioActual.UsuarioID;
                            Consulta2.PersonaRegistraID = (long)UsuarioActual.PersonaID;
                            Consulta2.FechaRegistra = DateTime.Now;
                            // Consulta2.EstatusID = 2;
                            Consulta.EstatusSolicitud = null;
                            await DBContext.database.UpdateAsync(Consulta2);

                            await DBContext.Destroy();
                            return Ok("Documento Actualizado Correctamente");
                        }


                    }
                    else
                    {
                        await DBContext.Destroy();
                        return BadRequest(response.StatusCode);
                    }
                }
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("cancelTempObs")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> CancelTempObs(PeticionesRest.Distribuidores.Distribuidor.CancelTempObs parData)
        {
            try
            {
                var userName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", userName).FirstOrDefaultAsync();

                var Consulta = await DBContext.database.QueryAsync<SolicitudCancelTemp>("WHERE DistribuidorID = @0", parData.DistribuidorID).FirstOrDefaultAsync();
                if (Consulta == null)
                {
                    var Solicitud = new SolicitudCancelTemp();
                    {
                        Solicitud.DistribuidorID = parData.DistribuidorID;
                        Solicitud.Observaciones = parData.Observaciones == "" ? null : parData.Observaciones;
                        Solicitud.UsuarioRegistraID = UsuarioActual.UsuarioID;
                        Solicitud.PersonaRegistraID = (long)UsuarioActual.PersonaID;
                        Solicitud.FechaRegistra = DateTime.Now;
                        Solicitud.EstatusID = 1;
                        Solicitud.EstatusSolicitud = null;

                        await DBContext.database.InsertAsync(Solicitud);
                        await DBContext.Destroy();
                    }
                    ;
                    return Ok("Solicitud guardada correctamente");
                }
                else
                {
                    {
                        Consulta.DistribuidorID = parData.DistribuidorID;
                        Consulta.Observaciones = parData.Observaciones == "" ? null : parData.Observaciones;
                        Consulta.UsuarioRegistraID = UsuarioActual.UsuarioID;
                        Consulta.PersonaRegistraID = (long)UsuarioActual.PersonaID;
                        Consulta.FechaRegistra = DateTime.Now;
                        Consulta.EstatusID = 1;
                        Consulta.EstatusSolicitud = null;
                        await DBContext.database.UpdateAsync(Consulta);
                        await DBContext.Destroy();
                    }
                    ;
                    return Ok("Solicitud guardada correctamente");
                }
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("obtenerEstatusSolicitud")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> obtenerEstatusSolicitudes()
        {
            try
            {
                var estatusSolicitud = await DBContext.database.FetchAsync<DBContext.DBConfia.Distribuidores.EstatusSolicitudes>();
                await DBContext.Destroy();
                return Ok(estatusSolicitud);
            }
            catch (Exception ex)
            {

                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("obtenerSolicitudSociaCancelada")]
        [Authorize]
        [Code.TProteccionProducto]

        public async Task<IActionResult> GetSolicitudSociaCancelada(PeticionesRest.Distribuidores.Distribuidor.Get parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var solicitud = await DBContext.database.FetchAsync<DBContext.DBConfia.Distribuidores.SolicitudCancelTemp_VW>("WHERE EstatusSolicitud is null");
                await DBContext.Destroy();
                return Ok(solicitud);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("obtenerSolicitudSociaFallecida")]
        [Authorize]
        [Code.TProteccionProducto]

        public async Task<IActionResult> GetSolicitudSociaFallecida(PeticionesRest.Distribuidores.Distribuidor.Get parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var solicitud = await DBContext.database.FetchAsync<DBContext.DBConfia.Distribuidores.SolicitudFallecida_VW>("WHERE EstatusSolicitud is null");
                await DBContext.Destroy();
                return Ok(solicitud);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("GetEvidencia")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetEvidencia(PeticionesRest.Distribuidores.Distribuidor.GetEvidencia parData)
        {
            if (parData.Ruta.Contains(".pdf") == true)
            {
                var transaccion = false;

                try
                {
                    var src = "";
                    var srcBC = "";

                    var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                    var basicToken = Convert.ToBase64String(plainTextBytes);
                    using (var client = new HttpClient())
                    {
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicToken); ;
                        var response = await client.GetAsync($"{Configuracion["BucketApi:url"]}{Configuracion["BucketApi:getRequest"]}?expireIn=10&path={parData.Ruta}");
                        if (response.IsSuccessStatusCode)
                        {
                            var jsonString = await response.Content.ReadAsStringAsync();
                            var request = JsonConvert.DeserializeObject<BucketGet>(jsonString);
                            src = request.url;

                            srcBC = request.url;

                            WebClient MyWebClient = new WebClient();
                            MyWebClient.Credentials = new NetworkCredential(Configuracion["userFtpConfia"], Configuracion["passFtpConfia"]);
                            byte[] BytesFile = MyWebClient.DownloadData(srcBC);
                            string srcB64 = Convert.ToBase64String(BytesFile, 0, BytesFile.Length);
                            DBContext.database.BeginTransaction();
                            transaccion = true;
                            var res = new
                            {
                                res = 2,
                                msj = $"Consulta correcta del documento {parData.Ruta}",
                                src = $"{srcB64}"
                            };

                            DBContext.database.CompleteTransaction();
                            await DBContext.Destroy();
                            return Ok(res);
                        }
                        else
                        {
                            if (transaccion) ; DBContext.database.AbortTransaction();
                            await DBContext.Destroy();
                            return BadRequest(response.StatusCode);
                        }
                    }

                }
                catch (Exception ex)
                {
                    if (transaccion) ; DBContext.database.AbortTransaction();
                    await DBContext.Destroy();
                    return BadRequest("ERROR AL GUARDAR LOS DATOS: " + ex.Message);
                }
            }
            else
            {
                try
                {
                    var src = "";

                    var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                    var basicToken = Convert.ToBase64String(plainTextBytes);
                    using (var client = new HttpClient())
                    {
                        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicToken); ;
                        var response = await client.GetAsync($"{Configuracion["BucketApi:url"]}{Configuracion["BucketApi:getRequest"]}?expireIn=1&path={parData.Ruta}");
                        if (response.IsSuccessStatusCode)
                        {
                            var jsonString = await response.Content.ReadAsStringAsync();
                            var request = JsonConvert.DeserializeObject<BucketGet>(jsonString);
                            src = request.url;
                        }
                        else
                        {
                            await DBContext.Destroy();
                            return BadRequest(response.StatusCode);
                        }
                    }
                    var res = new
                    {
                        res = 1,
                        msj = $"Consulta correcta del documento",
                        src = $"{src}"
                    };
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return BadRequest("ERROR AL GUARDAR LOS DATOS ECONOMICOS DE LA PERSONA: " + ex.Message);
                }
            }
        }

        [HttpPost]
        [Route("getNivelTiendita")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getNivelTiendita(PeticionesRest.Distribuidores.Distribuidor.GetDistribuidorTiendita parData)
        {
            try
            {
                var res = await DBContext.database.FirstOrDefaultAsync<DBContext.DBConfia.Creditos.Contratos>("WHERE ProductoID=@ProductoID AND DistribuidorID = @DistribuidorID", parData);
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
        [Route("getMonederoTiendita")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getMonederoTiendita(PeticionesRest.Distribuidores.Distribuidor.GetDistribuidorTiendita parData)
        {
            try
            {
                /* var res = await DBContext.database.FirstOrDefaultAsync<DBContext.DBConfia.Creditos.Contratos>("WHERE ProductoID=@ProductoID AND DistribuidorID = @DistribuidorID", parData); */
                var res = await DBContext.database.QueryAsync<dynamic>("EXEC Creditos.pa_GetMonederoTiendita @DistribuidorID, @ProductoID", parData).FirstOrDefaultAsync();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }
    }
}