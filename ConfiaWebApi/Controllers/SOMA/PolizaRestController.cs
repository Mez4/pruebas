using System.Data.Common;
using System.Net;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;

using DBContext.DBConfia;
using DBContext.DBConfia.General;
using DBContext.DBConfia;
using DBContext.DBConfia.Tesoreria;

using DBContext.DBConfia.dbo;
using DBContext.DBConfia.Custom.Polizas;

using System.Net.Http;
using System.Collections.Generic;
using System.Text.Json;
using System.Collections;
using System.Globalization;
using System.IO;
using ConfiaWebApi.Code;
using System.Diagnostics;
using DBContext.DBConfia.Custom.Tesoreria;

namespace ConfiaWebApi.Controllers.Sistema
{
    [ApiController]
    [Route("api/SOMA/[controller]")]

    public class PolizaRestController : ControllerBase
    {
        // TODO::
        // Validar funcion de eliminar cuenta... ??, valido, util ?
        // Segundo, se pueden eliminar las bovedas ??, se pueden actualizar hasta que nivel? (Nombre y Clave o solo nombre?)

        /// <summary>
        /// Conexion a base de datos
        /// </summary>
        private DBConfiaContext ConexionBD;

        /// <summary>
        /// Constructor del controlador
        /// </summary>
        /// <param name="_DBContext">Conexión de datos para el controlador</param>
        public PolizaRestController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        // Obtenemos los balances
        [HttpGet]
        [Route("polizas")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Obtener()
        {
            var polizas = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Tesoreria.Polizas>();
            var vEstatus = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Tesoreria.EstatusMovimiento>();
            var vTipoPoliza = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Tesoreria.TipoPoliza>();
            var vBancos = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Bancos.Movimientos>();
            var vTMovimientoPolizas = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Tesoreria.Movimientopolizas>();
            var vCtasContables = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Tesoreria.CuentasContables>();
            var vTEstatusMovs = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Tesoreria.EstatusMovimiento>();

            ArrayList res = new();

            foreach (var sc in polizas)
            {

                res.Add(new
                {
                    polizaId = sc.PolizaID,
                    referencia = sc.Referencia,
                    usuarioID = sc.UsuarioID,
                    numero = sc.Numero,
                    fecha = sc.Fecha.ToString("yyyy/MM/dd"),
                    concepto = sc.Concepto,
                    estatus = vEstatus.Where(ws => ws.CatEstatusMovID == sc.CatEstatusMovID).Select(sc1 => new
                    {
                        estatusMovId = sc1.CatEstatusMovID,
                        caracter = sc1.Caracter,
                        descripcion = sc1.Descripcion
                    }).SingleOrDefault(),
                    tipoPoliza = vTipoPoliza.Where(ws1 => ws1.TipoPolizaID == sc.TipoPolizaID).Select(sc2 => new
                    {
                        tipoPolizaID = sc2.TipoPolizaID,
                        descripcion = sc2.Descripcion
                    }).SingleOrDefault(),
                    personaID = sc.PersonaID,
                    listMovPoliza = vTMovimientoPolizas.Where(ws2 => ws2.PolizaID == sc.PolizaID).Select(sc3 => new
                    {
                        movPolID = sc3.MovimientoPolizaID,
                        descripcion = sc3.Descripcion,
                        cuenta = vCtasContables.Where(ws4 => ws4.CuentaID == sc3.CuentaID).Select(sc4 => new
                        {
                            id = sc4.CuentaID,
                            cuenta = sc4.Cuenta,
                            nombre = sc4.Nombre,
                            tipoId = sc4.TipoID,
                            tipoBancoId = sc4.TipoBancoId
                        }).SingleOrDefault(),
                        referencia = sc3.Referencia,
                        estatus = vTEstatusMovs.Where(ws5 => ws5.CatEstatusMovID == sc3.CatEstatusMovID).Select(sc6 => new
                        {
                            estatusMovId = sc6.CatEstatusMovID,
                            caracter = sc6.Caracter,
                            descripcion = sc6.Descripcion
                        }).SingleOrDefault(),
                        debe = sc3.Debe,
                        haber = sc3.Haber
                    }).SingleOrDefault()
                });
            }
            await ConexionBD.Destroy();
            return Ok(res);
        }

        [HttpGet]
        [Route("polizas/{PolizaID}")]
        [Authorize]
        public async Task<IActionResult> ObtenerPorId(int PolizaID)
        {

            ArrayList res = new();


            var queryPolizas = "	SELECT p.PolizaID, p.Referencia , p.Numero , CONVERT(date, p.Fecha) as Fecha, tp.TipoPolizaID,"
                      + " tp.Descripcion 'TipoPolizaDesc', em.Descripcion 'Estatus',  p.CatEstatusMovID , m.MovimientoPolizaID , m.Descripcion 'DescMovimientoPoliza',"
                      + "	ccb.CuentaBancoID, ccb.NumeroCuenta , ccb.DescripcionCuenta, m.Referencia 'RefMovPoliza', m.Debe , m.Haber "
                      + "	FROM Tesoreria.Polizas p (NOLOCK)"
                      + "	JOIN Tesoreria.Movimientopolizas m(NOLOCK)"
                      + "	ON p.PolizaID = m.PolizaID "
                      + "	JOIN Bancos.CatalogoCuentasBancos ccb (NOLOCK)"
                      + "	ON m.CuentaID = ccb.CuentaBancoID "
                      + "	JOIN Tesoreria.EstatusMovimiento em (NOLOCK)"
                      + "	ON em.CatEstatusMovID = p.CatEstatusMovID "
                      + "	JOIN Tesoreria.TipoPoliza tp (NOLOCK)"
                      + "	ON tp.TipoPolizaID = p.TipoPolizaID "
                      + "	WHERE p.PolizaID =@0";
            var DetallePol = await ConexionBD.database.QueryAsync<DetallePolizas>(queryPolizas, PolizaID).ToArrayAsync();


            await ConexionBD.Destroy();
            return Ok(DetallePol);
        }

        [HttpGet]
        [Route("polizas/tipo-poliza")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> PolizasTipo()
        {

            var vTipoPoliza = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Tesoreria.TipoPoliza>();
            var res = vTipoPoliza.Select(sc => new { tipoPolizaID = sc.TipoPolizaID, descripcion = sc.Descripcion });
            await ConexionBD.Destroy();
            return Ok(res);
        }

        [HttpGet]
        [Route("tipos-movimientos/mostrar/{CuentaBancoID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> TiposMovsCuenta(int CuentaBancoID)
        {
            var query = "SELECT tm.*  FROM Bancos.CatalogoCuentasBancos cb  "
               + " JOIN Bancos.TiposMovimientos tm  ON cb.ProductoID = tm.ProductoId "
               + "WHERE cb.CuentaBancoID = @0";
            var tiposMovs = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Bancos.TiposMovimientos>(query, CuentaBancoID).ToArrayAsync();
            await ConexionBD.Destroy();
            return Ok(tiposMovs);
        }



        [HttpGet]
        [Route("polizas/{fechaIni}/{fechaFin}/{tipo}/{numero}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> PolizaFecha(string fechaIni, string fechaFin, string tipo, string numero)
        {

            ArrayList res = new();


            var polizas = await ConexionBD.database.QueryAsync<FiltroPoliza>("EXEC Tesoreria.SpsPolizasFiltra @0, @1, @2, @3", fechaIni, fechaFin, tipo, numero).ToArrayAsync();
            var queryPolizas = "	SELECT p.PolizaID, p.Referencia , p.Numero , CONVERT(date, p.Fecha) as Fecha, tp.TipoPolizaID,"
                      + " tp.Descripcion 'TipoPolizaDesc', em.Descripcion 'Estatus', m.MovimientoPolizaID , m.Descripcion 'DescMovimientoPoliza',"
                      + "	ccb.CuentaBancoID, ccb.NumeroCuenta , ccb.DescripcionCuenta, m.Referencia 'RefMovPoliza', m.Debe , m.Haber "
                      + "	FROM Tesoreria.Polizas p (NOLOCK)"
                      + "	JOIN Tesoreria.Movimientopolizas m(NOLOCK)"
                      + "	ON p.PolizaID = m.PolizaID "
                      + "	JOIN Bancos.CatalogoCuentasBancos ccb (NOLOCK)"
                      + "	ON m.CuentaID = ccb.CuentaBancoID "
                      + "	JOIN Tesoreria.EstatusMovimiento em (NOLOCK)"
                      + "	ON em.CatEstatusMovID = p.CatEstatusMovID "
                      + "	JOIN Tesoreria.TipoPoliza tp (NOLOCK)"
                      + "	ON tp.TipoPolizaID = p.TipoPolizaID "
                      + "	WHERE p.PolizaID =@0";

            foreach (var item in polizas)
            {
                var DetallePol = await ConexionBD.database.QueryAsync<DetallePolizas>(queryPolizas, item.PolizaID).ToArrayAsync();
                var tipoPoliza = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.TipoPoliza>("WHERE TipoPolizaID=@0", item.TipoPolizaID).SingleOrDefaultAsync();
                var estatusDesc = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.EstatusMovimiento>("WHERE CatEstatusMovID = @0", item.CatEstatusMovID).SingleOrDefaultAsync();

                res.Add(new
                {
                    PolizaID = item.PolizaID,
                    Fecha = item.Fecha.ToString("yyyy-MM-dd"),
                    TipoID = item.TipoPolizaID,
                    Tipo = tipoPoliza.Descripcion,
                    Numero = item.Numero,
                    Concepto = item.Concepto,
                    Estatus = estatusDesc.Descripcion,
                    EstatusID = item.CatEstatusMovID,
                    MovimientosPoliza = DetallePol

                });
            }
            await ConexionBD.Destroy();
            return Ok(res);
        }


        [HttpPost]
        [Route("polizas")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Agregar(PeticionesRest.SOMA.MovPolizas.Update parData, int crPoliza)
        {
            // Obtenemos el email del usuario de los claims
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            // var UsuarioActual = await ConexionBD.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
            // var PersonaActual = await ConexionBD.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.ID).FirstOrDefaultAsync();
            ArrayList res = new();
            try
            {
                if (crPoliza != 0)
                {
                    var movPoliza = new DBContext.DBConfia.Tesoreria.Polizas()
                    {

                    };
                    await ConexionBD.database.InsertAsync(movPoliza);
                    await ConexionBD.Destroy();
                    // Regresamos el registro a la UI
                    return Ok(movPoliza);
                }
                // Generamos el registro de el estado civil
                else
                {
                    await ConexionBD.Destroy();
                    return BadRequest("Póliza inválida");
                }
                // Ingresamos la poliza  a la bd

            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("Error al ingresar el movimiento: " + ex.Message);
            }
        }

        //Método para actualizar una denominación
        [HttpPut]
        [Route("update/{MovimientoPolizaID}/{PolizaID}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Actualizar(PeticionesRest.SOMA.MovPolizas.Update parData, int MovimientoPolizaID, int PolizaID)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            // var UsuarioActual = await ConexionBD.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
            // var PersonaActual = await ConexionBD.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.ID).FirstOrDefaultAsync();


            // Generamos el registro de bobeda
            var movsPolizas = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.Movimientopolizas>
            ("WHERE MovimientoPolizaID=@0 AND PolizaID=@1 ", MovimientoPolizaID, PolizaID).SingleOrDefaultAsync();

            try
            {
                // Actualizamos el movimiento
                movsPolizas.Descripcion = parData.descripcion;
                movsPolizas.CuentaID = parData.cuenta;
                movsPolizas.Referencia = parData.referencia;
                movsPolizas.CatEstatusMovID = parData.estatus;
                movsPolizas.Debe = parData.debe;
                movsPolizas.Haber = parData.haber;

                // Ingresamos la bobeda a la bd
                await ConexionBD.database.UpdateAsync(movsPolizas);
                await ConexionBD.Destroy();
                // Regresamos el registro a la UI
                return Ok(movsPolizas);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("Error al actualizar el movimiento: " + ex.Message);
            }
        }

        [HttpPut]
        [Route("cancelar/{PolizaID}")]
        [Code.TProteccionProducto]

        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> CancelarPoliza(int PolizaID)
        {
            try
            {
                ConexionBD.database.BeginTransaction();
                var polizas = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.Polizas>
                ("WHERE PolizaID=@0 ", PolizaID).SingleOrDefaultAsync();
                var movsBancos = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Bancos.Movimientos>
                ("WHERE PolizaId=@0 ", PolizaID).ToArrayAsync();
                var movsPoliza = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.Movimientopolizas>
                ("WHERE PolizaID=@0 ", PolizaID).ToArrayAsync();
                if (polizas.CatEstatusMovID == 2)
                {
                    return StatusCode(204, new
                    {
                        mensaje = "La póliza " + polizas.PolizaID + " ya se encuentra cancelada"
                    });
                }

                polizas.CatEstatusMovID = 2;
                if (movsPoliza.LongCount() > 0)
                {
                    foreach (var item in movsPoliza)
                    {
                        decimal debe = (item.Debe) * (-1);
                        decimal haber = (item.Haber) * (-1);
                        Movimientopolizas movPol = new Movimientopolizas()
                        {
                            PolizaID = item.PolizaID,
                            Descripcion = "Cancelado " + DateTime.Now.ToString("yyyy/MM/dd"),
                            CuentaID = item.CuentaID,
                            Referencia = item.Referencia,
                            CatEstatusMovID = 2,
                            Debe = debe,
                            Haber = haber,
                            PeriodoID = item.PeriodoID
                        };
                        await ConexionBD.database.InsertAsync(movPol);
                    }
                }
                if (movsBancos.LongCount() > 0)
                {
                    await ConexionBD.database.ExecuteAsync("UPDATE Bancos.Movimientos SET Estatus='C', CatEstatusMovID=2 WHERE PolizaId=@0", polizas.PolizaID);
                }
                await ConexionBD.database.UpdateAsync(polizas);

                ConexionBD.database.CompleteTransaction();
                await ConexionBD.Destroy();
                return StatusCode(201, new
                {
                    polizaid = polizas.PolizaID
                });
            }
            catch (Exception ex)
            {
                ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return StatusCode(400, new
                {
                    error = "Ha ocurrido un problema al actualizar la póliza: " + ex.Message
                });
            }
        }

        [HttpPost]
        [Route("imprimir-poliza")]
        [Authorize]
        [Code.TProteccionProducto]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> ImprimirPoliza(PeticionesRest.SOMA.MovPolizas.Imprimir parData)
        {
            // Obtenemos el email del usuario de los claims
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            // var UsuarioActual = await ConexionBD.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
            // var PersonaActual = await ConexionBD.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.ID).FirstOrDefaultAsync();
            var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");
            var listado_archivos = new List<string>();
            var Count = 0;
            var headerConDetalle = "";
            var DatosConDetalle = "";
            var FooterDetalle = "";
            decimal TotalDebe = 0;
            decimal TotalHaber = 0;


            var registros_detalle = 0;
            var ctaBancoAnterior = "";
            var ctaContableAnterior = "";
            var productoAnterior = "";
            var tipoMovAnterior = "";
            CultureInfo myCI = new CultureInfo("en-US", false);
            var queryDetSup = "SELECT p.PolizaID, p.Referencia, p.Concepto ,p.Fecha, p2.NombreCompleto,"
            + " em.Descripcion as DescripcionEstatus, tp.Descripcion as DescripcionPoliza "
            + "FROM Tesoreria.Polizas p "
            + "JOIN General.Personas p2 on p.PersonaID = p2.PersonaID "
            + "JOIN Tesoreria.EstatusMovimiento em on p.CatEstatusMovID = em.CatEstatusMovID "
            + "JOIN Tesoreria.TipoPoliza tp on p.TipoPolizaID = tp.TipoPolizaID WHERE p.PolizaID =@0";

            var queryDetMov = "	SELECT m.MovimientoPolizaID, m.Descripcion , ccb.NumeroCuenta as 'Cuenta', ccb.DescripcionCuenta as 'Nombre' , "
            + " m.Referencia , m.Debe , m.Haber FROM Tesoreria.Movimientopolizas m "
            + "JOIN Bancos.CatalogoCuentasBancos ccb ON ccb.CuentaBancoID = m.CuentaID WHERE PolizaID = @0";

            var resPoliza = await ConexionBD.database.QueryAsync<PolizaDetSup>(queryDetSup, parData.polizaId).FirstOrDefaultAsync();

            var resPolizaMovs = await ConexionBD.database.QueryAsync<PolizaDetMov>(queryDetMov, parData.polizaId).ToArrayAsync();

            var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Polizas", "Caratula.html"));

            headerConDetalle += "<tr>";
            headerConDetalle += "<th class=\"text-center fs-6\">" + "Mov ID" + "</th>";
            headerConDetalle += "<th class=\"text-center fs-6\">" + "Descripci&oacute;n" + "</th>";
            headerConDetalle += "<th class=\"text-center fs-6\">" + "Cuenta" + "</th>";
            headerConDetalle += "<th class=\"text-center fs-6\">" + "Nombre" + "</th>";
            headerConDetalle += "<th class=\"text-center fs-6\">" + "Referencia" + "</th>";
            headerConDetalle += "<th class=\"text-center fs-6\">" + "Debe" + "</th>";
            headerConDetalle += "<th class=\"text-center fs-6\">" + "Haber" + "</th>";
            headerConDetalle += "</tr>";

            foreach (var item in resPolizaMovs)
            {
                DatosConDetalle += "<tr>";
                DatosConDetalle += "<td class=\"text-center fs-6\">" + item.MovimientoPolizaID.ToString() + "</td>";
                DatosConDetalle += "<td class=\"text-center fs-6\">" + item.Descripcion.ToString() + "</td>";
                DatosConDetalle += "<td class=\"text-center fs-6\">" + item.Cuenta.ToString() + "</td>";
                DatosConDetalle += "<td class=\"text-center fs-6\">" + item.Nombre.ToString() + "</td>";
                if (item.Referencia == null)
                {
                    DatosConDetalle += "<td class=\"text-center fs-6\"></td>";
                }
                else
                {
                    DatosConDetalle += "<td class=\"text-center fs-6\">" + item.Referencia.ToString() + "</td>";
                }
                DatosConDetalle += "<td class=\"text-center fs-6\">" + item.Debe.ToString("C", new CultureInfo("en-US")) + "</td>";
                DatosConDetalle += "<td class=\"text-center fs-6\">" + item.Haber.ToString("C", new CultureInfo("en-US")) + "</td>";
                DatosConDetalle += "</tr>";
                TotalDebe += item.Debe;
                TotalHaber += item.Haber;
            }
            FooterDetalle += "<tr>";
            FooterDetalle += "<th class=\"text-center fs-6\"></th>";
            FooterDetalle += "<th class=\"text-center fs-6\"></th>";
            FooterDetalle += "<th class=\"text-center fs-6\"></th>";
            FooterDetalle += "<th class=\"text-center fs-6\"></th>";
            FooterDetalle += "<th class=\"text-center fs-6\">" + "Totales" + "</th>";
            FooterDetalle += "<th class=\"text-center fs-6\">" + TotalDebe.ToString("C", new CultureInfo("en-US")) + "</th>";
            FooterDetalle += "<th class=\"text-center fs-6\">" + TotalHaber.ToString("C", new CultureInfo("en-US")) + "</th>";
            FooterDetalle += "</tr>";




            html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
            html = html.Replace("@@IMPRIMIO", UsuarioActual.Nombre);
            html = html.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
            html = html.Replace("@@INT", resPoliza.PolizaID.ToString());
            html = html.Replace("@@REFERENCIA", resPoliza.Referencia.ToString());
            html = html.Replace("@@CONCEPTO", resPoliza.Concepto.ToString());
            html = html.Replace("@@TIPO", resPoliza.DescripcionPoliza.ToString());
            html = html.Replace("@@ESTATUS", resPoliza.DescripcionEstatus.ToString());
            html = html.Replace("@@USR_CREA", resPoliza.NombreCompleto.ToString());
            html = html.Replace("@@FCH_CREA", resPoliza.Fecha.ToString());
            html = html.Replace("@@HEADER_DETALLE", headerConDetalle);
            html = html.Replace("@@DATOS_DETALLE", DatosConDetalle);
            html = html.Replace("@@FOOTER_DETALLE", FooterDetalle);



            try
            {

                await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")), html);

                listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")));

                /* html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Balances", "Detalle.html"));
                html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);


                await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "2_" + Count.ToString() + ".html")), html);
                listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "2_" + Count.ToString() + ".html")));
    */

                // Ejecutamos el proceso de wkhtmltopdf
                Process p = new()
                {
                    StartInfo = new ProcessStartInfo(PDF.RUTA_WKHTMLTOPDF())
                };
                p.StartInfo.Arguments = string.Concat("-O landscape --encoding utf-8", " ",
                string.Join(" ", listado_archivos), " ",
                Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
                p.StartInfo.CreateNoWindow = true;
                p.Start();
                await p.WaitForExitAsync();

                // Obtenemos el contenido de nuestro archivo de PDF
                var pdf = await System.IO.File.ReadAllBytesAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
                //var pdf = await System.IO.File.ReadAllBytesAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF_signed.pdf")));

                // Obtenemos nuestro PDF
                var pdfStream = new MemoryStream();
                pdfStream.Write(pdf, 0, pdf.Length);
                pdfStream.Position = 0;

                // Limpiamos los archivos que se utilizaron
                foreach (var archivo in listado_archivos)
                    System.IO.File.Delete(archivo);

                // Eliminamos el PDF
                System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
                //System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF_signed.pdf")));

                // Enviamos el PDF a la UI
                return new FileStreamResult(pdfStream, "application/pdf");
            }
            catch (Exception ex)
            {
                return BadRequest("Error al ingresar el movimiento: " + ex.Message);
            }
        }

        [HttpPost]
        [Route("conciliacion-polizas")]
        [Authorize]
        [Code.TProteccionProducto]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> ObtenerMovsPolizas(PeticionesRest.SOMA.MovPolizas.ObtPolizaCon parData)
        {
            try
            {
                if (parData.TipoMovID == 0)
                {
                    parData.TipoMovID = null;
                }
                if (parData.CtaBancoID == 0)
                {
                    parData.CtaBancoID = null;
                }
                //Execute raw query

                var st = await ConexionBD.database.ExecuteAsync("SET DATEFORMAT 'YMD'");
                var corteDeCaja = await ConexionBD.database.QueryAsync<FnsPolizasConciliacion>("SELECT * FROM Tesoreria.FnsConciliacionPoliza(@FechaInicial, @FechaFinal, @Producto, @TipoMovID, @CtaBancoID)", parData).ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(corteDeCaja);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("tipos-movimientos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerProductos()

        {
            try
            {
                ConexionBD.database.BeginTransaction();
                var query = "select Id , TipoMovimiento FROM Bancos.TiposMovimientos tm order by Id desc";
                var res = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Bancos.TiposMovimientos>(query).ToArrayAsync();
                ConexionBD.database.CompleteTransaction();
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception err)
            {
                ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest(err.Message);
            }

        }

        [HttpGet]
        [Route("cuentas-bancos/{ProductoID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerCuentas(int ProductoID)
        {
            try
            {
                ConexionBD.database.BeginTransaction();
                var query = "select CuentaBancoID, NumeroCuenta from Bancos.CatalogoCuentasBancos ccb WHERE ProductoID = @0";
                var res = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Bancos.CatalogoCuentasBancos>(query, ProductoID).ToArrayAsync();
                ConexionBD.database.CompleteTransaction();
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception err)
            {
                ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest(err.Message);
            }

        }

        [HttpPost]
        [Route("contabilizar-poliza")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ContabilizarPolizas(PeticionesRest.SOMA.MovPolizas.ContabilizacionDePolizas pardata)
        {

            try
            {


                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                foreach (var item in pardata.movsContabilizar)
                {
                    ConexionBD.database.BeginTransaction();
                    var concepto = "Conciliación de Pólizas - " + item.TipoMovimiento + " - Desembolso Realizado";
                    var movimiento = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Bancos.Movimientos>(item.MovimientoID);
                    var periodoID = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.Periodo2>("WHERE ProductoID=@0 AND Estatus='A' AND ReAbierto=0", movimiento.ProductoId).SingleAsync();
                    if (periodoID != null)
                    {

                        var Poliza = new DBContext.DBConfia.Tesoreria.Polizas()
                        {
                            UsuarioID = UsuarioActual.UsuarioID,
                            Fecha = DateTime.Now,
                            Concepto = concepto,
                            CatEstatusMovID = 1,
                            PersonaID = (long)UsuarioActual.PersonaID,
                            TipoPolizaID = 1
                        };
                        await ConexionBD.database.InsertAsync(Poliza);

                        var movimientoPolizaHaber = new DBContext.DBConfia.Tesoreria.Movimientopolizas()
                        {

                            PolizaID = Poliza.PolizaID,
                            Descripcion = concepto,
                            CuentaID = item.CuentaOrigenID,
                            CatEstatusMovID = 1,
                            Debe = 0,
                            Haber = item.Importe,
                            PeriodoID = periodoID.PeriodoID
                        };
                        await ConexionBD.database.InsertAsync(movimientoPolizaHaber);

                        var movimientoPolizaDebe = new DBContext.DBConfia.Tesoreria.Movimientopolizas()
                        {
                            PolizaID = Poliza.PolizaID,
                            Descripcion = concepto,
                            CuentaID = item.CuentaOrigenID,
                            CatEstatusMovID = 1,
                            Debe = item.Importe,
                            Haber = 0,
                            PeriodoID = periodoID.PeriodoID
                        };
                        await ConexionBD.database.InsertAsync(movimientoPolizaDebe);


                        movimiento.Contabilizado = true;
                        movimiento.PolizaId = Poliza.PolizaID;
                        await ConexionBD.database.UpdateAsync(movimiento);
                        ConexionBD.database.CompleteTransaction();
                        // await ConexionBD.Destroy();
                    }
                    else
                    {
                        ConexionBD.database.AbortTransaction();
                        await ConexionBD.Destroy();
                        return BadRequest();
                    }
                }
                await ConexionBD.Destroy();
                return Ok();
            }
            catch (Exception ex)
            {
                ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

    }
}