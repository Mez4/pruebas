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
using DBContext.DBConfia.Bancos;
using DBContext.DBConfia.Balances;
using DBContext.DBConfia.Compras;
using DBContext.DBConfia.Seguridad;


using DBContext.DBConfia.dbo;
using DBContext.DBConfia.Custom.Tesoreria;

using System.Net.Http;
using System.Collections.Generic;
using System.Text.Json;
using System.Collections;

using System.IO;
using ConfiaWebApi.Code;
using System.Diagnostics;
using System.Globalization;

namespace ConfiaWebApi.Controllers.Sistema
{
    [ApiController]
    [Route("api/SOMA/[controller]")]

    public class SolicitudOrdenCompraController : ControllerBase
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
        public SolicitudOrdenCompraController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        [HttpGet]
        [Route("obtenerOrden")]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Obtener()
        {
            var transaccion = false;
            try
            {
                ArrayList solsDetalle = new();
                var obj = new object();
                var SolicitudOrden = await ConexionBD.database.FetchAsync<Orden_VW>();
                if (SolicitudOrden != null)
                {
                    foreach (var item in SolicitudOrden)
                    {
                        solsDetalle.Add(new
                        {
                            OrdenID = item.OrdenID,
                            SolicitudID = item.SolicitudID,
                            ApruebaID = item.ApruebaID,
                            NombreAprueba = item.NombreAprueba,
                            AutorizaID = item.AutorizaID,
                            NombreAutoriza = item.NombreAutoriza,
                            FechaAprobado = item.FechaAprobado,
                            FechaAutorizado = item.FechaAutorizado,
                            EstatusID = item.EstatusID,
                            EstatusDes = item.EstatusDes,
                            Pendientes = item.Pendientes,
                            AprobadoID = item.AprobadoID,
                            ProductoID = item.ProductoID,
                            DetalleOrden = (await ConexionBD.database.QueryAsync<OrdenDetalle_VW>("WHERE OrdenID=@0", item.OrdenID).ToArrayAsync())
                        });
                    }
                }
                await ConexionBD.Destroy();
                return Ok(solsDetalle);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpPut]
        [Route("actualizarPiezasAutorizadas")]
        [Code.TProteccionProducto]
        public async Task<IActionResult> actualizar(ConfiaWebApi.PeticionesRest.SOMA.SolicitudOrdenCompra.Agregar parData)
        {
            var transaccion = false;
            var usuarioActualEmail = Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();
            int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
            try
            {
                var OrdenID = 0;
                //ACTUALIZA TABLA DE ORDEN
                var ActualizaOrden = await ConexionBD.database.SingleByIdAsync<Orden>(parData.OrdenID);
                if (ActualizaOrden != null)
                {
                    ActualizaOrden.AutorizaID = UsuarioActual.UsuarioID;
                    ActualizaOrden.FechaAutorizado = DateTime.Now;
                    ActualizaOrden.EstatusID = 11;
                    await ConexionBD.database.UpdateAsync(ActualizaOrden);
                }
                OrdenID = ActualizaOrden.OrdenID;

                //ACTUALIZAMOS LA TABLA APROBACION
                var ActualizaAprobacion = await ConexionBD.database.SingleByIdAsync<Aprobacion>(ActualizaOrden.SolicitudID);
                if (ActualizaAprobacion != null)
                {
                    ActualizaAprobacion.EstatusID = 11;
                    await ConexionBD.database.UpdateAsync(ActualizaAprobacion);
                }

                //ACTUALIZAMOS LA TABLA SOLICITUD
                var ActualizaSolicitud = await ConexionBD.database.SingleByIdAsync<Solicitud>(ActualizaOrden.SolicitudID);
                if (ActualizaSolicitud != null)
                {
                    ActualizaSolicitud.EstatusID = 11;
                    OrdenID = OrdenID;
                    await ConexionBD.database.UpdateAsync(ActualizaSolicitud);
                }

                //INSERT A LA TABLA SURTIR
                var SurtidoID = 0;
                var InsertSurtido = new DBContext.DBConfia.Compras.Surtido()
                {
                    SolicitudID = ActualizaOrden.SolicitudID,
                    AutorizaID = ActualizaOrden.AutorizaID,
                    FechaAutorizado = ActualizaOrden.FechaAutorizado,
                    EstatusID = 11,
                    Descripcion = ActualizaSolicitud.Descripcion,
                    OrdenID = OrdenID,
                    ProductoID = ProductoID
                };
                await ConexionBD.database.InsertAsync(InsertSurtido);
                SurtidoID = InsertSurtido.SurtidoID;

                // SABER SI LA SOLICITU Y/U LA ORDEN TIENEN PIEZAS PENDIENTES
                var suma = 0;

                //ACTUALIZA TABLA DE ORDEN DETALLE Y INSERT A LA TABLA SURTIDO DETALLE
                foreach (var item in parData.DetalleOrden)
                {
                    //ACTUALIZAR TABLA ORDEN DETALLE
                    var OrdenDetalle = await ConexionBD.database.SingleByIdAsync<OrdenDetalle>(item.OrdenDetalleID);
                    if (OrdenDetalle != null)
                    {
                        OrdenDetalle.PiezasAutorizadas = item.PiezasAutorizadas;
                        OrdenDetalle.PiezasPendientes = item.PiezasPendientes;
                        //SI SUMA TIENE VALOR HAY PIEZAS PENDIENTES
                        suma = suma + item.PiezasPendientes;
                    }
                    await ConexionBD.database.UpdateAsync(OrdenDetalle);

                    //INSERT A LA TABLA SURTIDO DETALLE
                    var SurtidoDetalle = new DBContext.DBConfia.Compras.SurtidoDetalle()
                    {
                        SurtidoID = SurtidoID,
                        SolicitudDetalleID = OrdenDetalle.SolicitudDetalleID,
                        OrdenDetalleID = OrdenDetalle.OrdenDetalleID,
                        ProductoUniformeID = OrdenDetalle.ProductoUniformeID,
                        PiezasAutorizadas = OrdenDetalle.PiezasAutorizadas,
                        PiezasPendientes = OrdenDetalle.PiezasPendientes,
                    };
                    await ConexionBD.database.InsertAsync(SurtidoDetalle);
                }

                var PreReOrden = await ConexionBD.database.SingleByIdAsync<Surtido>(InsertSurtido.SurtidoID);
                {
                    if (suma > 0)
                    {
                        PreReOrden.Pendientes = true;
                    }
                };
                await ConexionBD.database.UpdateAsync(PreReOrden);

                //SI EXTISTEN PIEZAS PENDIENTES ACTUALIZAREMOS LA TABLA VISTA DE ORDEN
                var OrdenPiezasPendiente = await ConexionBD.database.SingleByIdAsync<Orden>(parData.OrdenID);
                if (suma > 0)
                {
                    OrdenPiezasPendiente.Pendientes = true;
                    await ConexionBD.database.UpdateAsync(OrdenPiezasPendiente);
                }

                var solOrden = await ConexionBD.database.QueryAsync<Orden_VW>("WHERE OrdenID = @0", OrdenID).SingleOrDefaultAsync();
                if (solOrden != null)
                {
                    var solsDetalle = new
                    {
                        OrdenID = solOrden.OrdenID,
                        SolicitudID = solOrden.SolicitudID,
                        ApruebaID = solOrden.ApruebaID,
                        NombreAprueba = solOrden,
                        AutorizaID = solOrden.AutorizaID,
                        NombreAutoriza = solOrden.NombreAutoriza,
                        FechaAprobado = solOrden.FechaAprobado,
                        FechaAutorizado = solOrden.FechaAutorizado,
                        EstatusID = solOrden.EstatusID,
                        EstatusDes = solOrden.EstatusDes,
                        Pendientes = solOrden.Pendientes,
                        AprobadoID = solOrden.AprobadoID,
                        ProductoID = solOrden.ProductoID,
                        DetalleOrden = (await ConexionBD.database.QueryAsync<OrdenDetalle_VW>("WHERE OrdenID=@0", OrdenID).ToArrayAsync())
                    };
                }
                ConexionBD.database.BeginTransaction();
                transaccion = true;
                ConexionBD.database.CompleteTransaction();
                await ConexionBD.Destroy();
                return Ok(solOrden);
            }
            catch (Exception ex)
            {
                if (transaccion) ; ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("imprimir-morden-compra")]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ImprimirOrdenCompra(ConfiaWebApi.PeticionesRest.SOMA.SolicitudOrdenCompra.Agregar parData)

        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            var prefijo_archivo = string.Concat(Guid.NewGuid().ToString().Replace("-", ""), "__");
            var listado_archivos = new List<string>();
            var Count = 0;
            var tabla1 = "";
            var tabla2 = "";
            var headerTabla2 = "";
            var DatosConDetalle = "";
            var cantRegistros = 0;
            var ord = parData.OrdenID;
            var estatusdes = "";
            int ordenAnterior = 0;
            var solicita = "";
            var solici = false;
            int longitudRespuesta = 0;

            CultureInfo myCI = new CultureInfo("en-US", false);

            var detOrden = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Compras.Orden>("WHERE OrdenID = @0", parData.OrdenID).ToArrayAsync();
            foreach (var item in detOrden)
            {
                var Solun = await ConexionBD.database.QueryAsync<Orden_VW>("WHERE OrdenID = @0", item.OrdenID).SingleOrDefaultAsync();
                solici = Solun.Pendientes;
                estatusdes = Solun.EstatusDes;
            }

            try
            {
                if (parData.OrdenID != 0)
                {
                    var detalleOrden = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Compras.OrdenDetalle_VW>("WHERE OrdenID = @0", parData.OrdenID).ToArrayAsync();
                    var Orden = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Compras.Orden_VW>("WHERE OrdenID = @0", parData.OrdenID).SingleOrDefaultAsync();

                    if (detalleOrden == null)
                    {
                        return BadRequest("No se encontró la orden de la compra");
                    }
                    longitudRespuesta = detalleOrden.Count();
                    var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "OrdenCompra", "Caratula.html"));

                    if (solici == true)
                    {
                        tabla1 += "<tr>";
                        tabla1 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !icmportant;\">" + "Solicitud" + "</th>";
                        tabla1 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Nombre Solicita" + "</th>";
                        tabla1 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !icmportant;\">" + "Corte" + "</th>";
                        tabla1 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Piezas Solicitadas" + "</th>";
                        tabla1 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Piezas Aprobadas" + "</th>";
                        tabla1 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Piezas Autorizadas" + "</th>";
                        tabla1 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Piezas Pendientes" + "</th>";
                        tabla1 += "</tr>";

                        foreach (var item in detalleOrden)
                        {
                            cantRegistros++;
                            if (cantRegistros < 10)
                            {
                                if (ordenAnterior == 0)
                                {
                                    tabla1 += "<tr>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + Orden.SolicitudID + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + Orden.NombreSolicita + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + item.ProductoUniformeDesc + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + item.PiezasSolicitadas + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + (item.PiezasAprobadas != 0 ? item.PiezasAprobadas : "No se aprobo ninguna") + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + (item.PiezasAutorizadas != 0 ? item.PiezasAutorizadas : "No se autorizo ninguna") + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + (item.PiezasPendientes != 0 ? item.PiezasPendientes : "No hay ninguna pendiente") + "</td>";

                                    tabla1 += "</tr>";

                                    ordenAnterior = item.OrdenID.Value;
                                    solicita = Orden.NombreSolicita;
                                }
                                else
                                {
                                    if (ordenAnterior == item.OrdenID.Value || ordenAnterior == Orden.SolicitudID || solicita == Orden.NombreSolicita)
                                    {
                                        tabla1 += "<tr \"border-bottom: 1px solid black;\">";
                                        tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\"></td>";
                                        tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\"></td>";
                                        tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + item.ProductoUniformeDesc + "</td>";
                                        tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + item.PiezasSolicitadas + "</td>";
                                        tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + (item.PiezasAprobadas != 0 ? item.PiezasAprobadas : "No se aprobo ninguna") + "</td>";
                                        tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + (item.PiezasAutorizadas != 0 ? item.PiezasAutorizadas : "No se autorizo ninguna") + "</td>";
                                        tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + (item.PiezasPendientes != 0 ? item.PiezasPendientes : "No hay ninguna pendiente") + "</td>";
                                        tabla1 += "</tr>";
                                        ordenAnterior = item.OrdenID.Value;
                                        solicita = Orden.NombreSolicita;
                                    }
                                    else
                                    {
                                        //Filtrar los datos de la tabla por unv alor especifico
                                        var detalleOrdenesFiltrado = detalleOrden.Where(x => x.OrdenID == ordenAnterior).ToList();
                                        //Sumar valores de las column
                                        tabla1 += "<tr>";
                                        tabla1 += "<td class=\"text-center fs-6 border-bottom: 1px solid black;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6 border-bottom: 1px solid black;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6 border-bottom: 1px solid black;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6 border-bottom: 1px solid black;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6 border-bottom: 1px solid black;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6 border-bottom: 1px solid black;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6 border-bottom: 1px solid black;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "</tr>";
                                        //Tr para nuevo producto

                                        tabla1 += "<tr>";
                                        tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + Orden.SolicitudID + "</td>";
                                        tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + Orden.NombreSolicita + "</td>";
                                        tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + item.ProductoUniformeDesc + "</td>";
                                        tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + item.PiezasSolicitadas + "</td>";
                                        tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + (item.PiezasAprobadas != 0 ? item.PiezasAprobadas : "No se aprobo ninguna") + "</td>";
                                        tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + (item.PiezasAutorizadas != 0 ? item.PiezasAutorizadas : "No se aprobo ninguna") + "</td>";
                                        tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + (item.PiezasPendientes != 0 ? item.PiezasPendientes : "No hay ninguna pendiente") + "</td>";
                                        tabla1 += "</tr>";
                                        ordenAnterior = item.OrdenID.Value;
                                        solicita = Orden.NombreSolicita;
                                    }
                                }
                            }
                            else
                            {
                                if (ordenAnterior == 0)
                                {
                                    tabla2 += "<tr>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + Orden.SolicitudID + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + Orden.NombreSolicita + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + item.ProductoUniformeDesc + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + item.PiezasSolicitadas + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + (item.PiezasAprobadas != 0 ? item.PiezasAprobadas : "No se aprobo ninguna") + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + (item.PiezasAutorizadas != 0 ? item.PiezasAutorizadas : "No se aprobo ninguna") + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + (item.PiezasPendientes != 0 ? item.PiezasPendientes : "No hay ninguna pendiente") + "</td>";
                                    tabla2 += "</tr>";
                                    ordenAnterior = item.OrdenID.Value;
                                    solicita = Orden.NombreSolicita;
                                }
                                else
                                {
                                    //Filtrar los datos de la tabla por unv alor especifico
                                    var detalleOrdenesFiltrado = detalleOrden.Where(x => x.OrdenID == item.OrdenID).ToList();
                                    //Sumar valores de las columnas del detalle filtrado
                                    tabla2 += "<tr>";
                                    tabla2 += "<td class=\"text-center fs-6 border-bottom: 1px solid black;\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6 border-bottom: 1px solid black;\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6 border-bottom: 1px solid black;\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6 border-bottom: 1px solid black;\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6 border-bottom: 1px solid black;\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6 border-bottom: 1px solid black;\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6 border-bottom: 1px solid black;\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "</tr>";
                                    //Tr para nuevo producto
                                    tabla2 += "<tr>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important; border-bottom: 1px solid black;\">" + Orden.SolicitudID + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important; border-bottom: 1px solid black;\">" + Orden.NombreSolicita + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important; border-bottom: 1px solid black;\">" + item.ProductoUniformeDesc + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important; border-bottom: 1px solid black;\">" + item.PiezasSolicitadas + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important; border-bottom: 1px solid black;\">" + (item.PiezasAprobadas != 0 ? item.PiezasAprobadas : "No se aprobo ninguna") + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important; border-bottom: 1px solid black;\">" + (item.PiezasAutorizadas != 0 ? item.PiezasAutorizadas : "No se aprobo ninguna") + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important; border-bottom: 1px solid black;\">" + (item.PiezasPendientes != 0 ? item.PiezasPendientes : "No hay ninguna pendiente") + "</td>";
                                    tabla2 += "</tr>";
                                    ordenAnterior = item.OrdenID.Value;
                                    solicita = Orden.NombreSolicita;
                                }
                            }
                        }


                    }
                    else
                    {
                        tabla1 += "<tr>";
                        tabla1 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !icmportant;\">" + "Solicitud" + "</th>";
                        tabla1 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Nombre Solicita" + "</th>";
                        tabla1 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !icmportant;\">" + "Corte" + "</th>";
                        tabla1 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Piezas Solicitadas" + "</th>";
                        tabla1 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Piezas Aprobadas" + "</th>";
                        tabla1 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Piezas Autorizadas" + "</th>";
                        tabla1 += "</tr>";

                        foreach (var item in detalleOrden)
                        {
                            cantRegistros++;
                            if (cantRegistros < 10)
                            {
                                if (ordenAnterior == 0)
                                {
                                    tabla1 += "<tr>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + Orden.SolicitudID + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + Orden.NombreSolicita + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + item.ProductoUniformeDesc + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + item.PiezasSolicitadas + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + (item.PiezasAprobadas != 0 ? item.PiezasAprobadas : "No se aprobo ninguna") + "</td>";
                                    tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + (item.PiezasAutorizadas != 0 ? item.PiezasAutorizadas : "No se autorizo ninguna") + "</td>";
                                    tabla1 += "</tr>";

                                    ordenAnterior = item.OrdenID.Value;
                                    solicita = Orden.NombreSolicita;
                                }
                                else
                                {
                                    if (ordenAnterior == item.OrdenID.Value || ordenAnterior == Orden.SolicitudID || solicita == Orden.NombreSolicita)
                                    {
                                        tabla1 += "<tr \"border-bottom: 1px solid black;\">";
                                        tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\"></td>";
                                        tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;\"></td>";
                                        tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + item.ProductoUniformeDesc + "</td>";
                                        tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + item.PiezasSolicitadas + "</td>";
                                        tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + (item.PiezasAprobadas != 0 ? item.PiezasAprobadas : "No se aprobo ninguna") + "</td>";
                                        tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + (item.PiezasAutorizadas != 0 ? item.PiezasAutorizadas : "No se autorizo ninguna") + "</td>";
                                        tabla1 += "</tr>";
                                        ordenAnterior = item.OrdenID.Value;
                                        solicita = Orden.NombreSolicita;
                                    }
                                    else
                                    {
                                        //Filtrar los datos de la tabla por unv alor especifico
                                        var detalleOrdenesFiltrado = detalleOrden.Where(x => x.OrdenID == ordenAnterior).ToList();
                                        //Sumar valores de las column
                                        tabla1 += "<tr>";
                                        tabla1 += "<td class=\"text-center fs-6 border-bottom: 1px solid black;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6 border-bottom: 1px solid black;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6 border-bottom: 1px solid black;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6 border-bottom: 1px solid black;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6 border-bottom: 1px solid black;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "<td class=\"text-center fs-6 border-bottom: 1px solid black;\"><strong>" + " " + "</strong></td>";
                                        tabla1 += "</tr>";
                                        //Tr para nuevo producto

                                        tabla1 += "<tr>";
                                        tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + Orden.SolicitudID + "</td>";
                                        tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + Orden.NombreSolicita + "</td>";
                                        tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + item.ProductoUniformeDesc + "</td>";
                                        tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + item.PiezasSolicitadas + "</td>";
                                        tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + (item.PiezasAprobadas != 0 ? item.PiezasAprobadas : "No se aprobo ninguna") + "</td>";
                                        tabla1 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + (item.PiezasAutorizadas != 0 ? item.PiezasAutorizadas : "No se aprobo ninguna") + "</td>";
                                        tabla1 += "</tr>";
                                        ordenAnterior = item.OrdenID.Value;
                                        solicita = Orden.NombreSolicita;
                                    }
                                }
                            }
                            else
                            {
                                if (ordenAnterior == 0)
                                {
                                    tabla2 += "<tr>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + Orden.SolicitudID + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + Orden.NombreSolicita + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + item.ProductoUniformeDesc + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + item.PiezasSolicitadas + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + (item.PiezasAprobadas != 0 ? item.PiezasAprobadas : "No se aprobo ninguna") + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important;border-bottom: 1px solid black;\">" + (item.PiezasAutorizadas != 0 ? item.PiezasAutorizadas : "No se aprobo ninguna") + "</td>";
                                    tabla2 += "</tr>";
                                    ordenAnterior = item.OrdenID.Value;
                                    solicita = Orden.NombreSolicita;
                                }
                                else
                                {
                                    //Filtrar los datos de la tabla por unv alor especifico
                                    var detalleOrdenesFiltrado = detalleOrden.Where(x => x.OrdenID == item.OrdenID).ToList();
                                    //Sumar valores de las columnas del detalle filtrado
                                    tabla2 += "<tr>";
                                    tabla2 += "<td class=\"text-center fs-6 border-bottom: 1px solid black;\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6 border-bottom: 1px solid black;\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6 border-bottom: 1px solid black;\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6 border-bottom: 1px solid black;\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6 border-bottom: 1px solid black;\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "<td class=\"text-center fs-6 border-bottom: 1px solid black;\"><strong>" + " " + "</strong></td>";
                                    tabla2 += "</tr>";
                                    //Tr para nuevo producto
                                    tabla2 += "<tr>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important; border-bottom: 1px solid black;\">" + Orden.SolicitudID + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important; border-bottom: 1px solid black;\">" + Orden.NombreSolicita + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important; border-bottom: 1px solid black;\">" + item.ProductoUniformeDesc + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important; border-bottom: 1px solid black;\">" + item.PiezasSolicitadas + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important; border-bottom: 1px solid black;\">" + (item.PiezasAprobadas != 0 ? item.PiezasAprobadas : "No se aprobo ninguna") + "</td>";
                                    tabla2 += "<td class=\"text-center fs-6\" style=\"width: 12.5% !important; border-bottom: 1px solid black;\">" + (item.PiezasAutorizadas != 0 ? item.PiezasAutorizadas : "No se aprobo ninguna") + "</td>";
                                    tabla2 += "</tr>";
                                    ordenAnterior = item.OrdenID.Value;
                                    solicita = Orden.NombreSolicita;
                                }
                            }
                        }
                    }
                    if (cantRegistros < 9)
                    {
                        html = html.Replace("@@HEADER_DETALLE", tabla1);
                        html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                        html = html.Replace("@@IMPRIMIO", UsuarioActual.Nombre);
                        html = html.Replace("@@ORDEN", ord.ToString());
                        html = html.Replace("@@ESTATUS", estatusdes);
                        html = html.Replace("@@FECHAGENERADO", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                        html = html.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                        html = html.Replace("@@DATOS_DETALLE", DatosConDetalle);
                        await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")), html);
                        listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")));
                    }
                    else
                    {
                        if (parData.ReOrden == true)
                        {
                            html = html.Replace("@@HEADER_DETALLE", tabla1);
                            html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                            html = html.Replace("@@IMPRIMIO", UsuarioActual.Nombre);
                            html = html.Replace("@@ORDEN", ord.ToString());
                            html = html.Replace("@@FECHAGENERADO", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                            html = html.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                            html = html.Replace("@@DATOS_DETALLE", DatosConDetalle);
                            await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")), html);
                            listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")));

                            headerTabla2 += "<tr>";
                            headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !icmportant;\">" + "Orden ID" + "</th>";
                            headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Orden Detalle" + "</th>";
                            headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Solicitud Detalle" + "</th>";
                            headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Descripcion" + "</th>";
                            headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Piezas Solicitadas" + "</th>";
                            headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Piezas Aprobadas" + "</th>";
                            headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Piezas Autorizadas" + "</th>";
                            headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Piezas Pendientes" + "</th>";
                            headerTabla2 += "</tr>";


                            // html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Balances", "Detalle.html"));
                            // html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                            // html = html.Replace("@@DATOS_DETALLE2", tabla2);
                            // html = html.Replace("@@HEADER_DETALLE", headerTabla2);

                            await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "2_" + Count.ToString() + ".html")), html);
                            listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "2_" + Count.ToString() + ".html")));
                        }
                        else
                        {
                            html = html.Replace("@@HEADER_DETALLE", tabla1);
                            html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                            html = html.Replace("@@IMPRIMIO", UsuarioActual.Nombre);
                            html = html.Replace("@@ORDEN", ord.ToString());
                            html = html.Replace("@@FECHAGENERADO", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                            html = html.Replace("@@FECHA_PRINT", DateTime.Now.ToString("dd/MM/yyyy hh:mm:ss tt"));
                            html = html.Replace("@@DATOS_DETALLE", DatosConDetalle);
                            await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")), html);
                            listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "1_" + Count.ToString() + ".html")));

                            headerTabla2 += "<tr>";
                            headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !icmportant;\">" + "Orden ID" + "</th>";
                            headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Orden Detalle" + "</th>";
                            headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Solicitud Detalle" + "</th>";
                            headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Descripcion" + "</th>";
                            headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Piezas Solicitadas" + "</th>";
                            headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Piezas Aprobadas" + "</th>";
                            headerTabla2 += "<th class=\"text-center fs-6\" style=\"width: 12.5% !important;\">" + "Piezas Autorizadas" + "</th>";
                            headerTabla2 += "</tr>";


                            // html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Balances", "Detalle.html"));
                            // html = html.Replace("@@SERVER", HttpContext.Request.Host.Value);
                            // html = html.Replace("@@DATOS_DETALLE2", tabla2);
                            // html = html.Replace("@@HEADER_DETALLE", headerTabla2);

                            await System.IO.File.WriteAllTextAsync(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "2_" + Count.ToString() + ".html")), html);
                            listado_archivos.Add(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "2_" + Count.ToString() + ".html")));
                        }

                    }



                }



                var lenght = cantRegistros;
                var lenght2333 = longitudRespuesta;


                Process p = new()
                {
                    StartInfo = new ProcessStartInfo(PDF.RUTA_WKHTMLTOPDF())
                };
                p.StartInfo.Arguments = string.Concat("--footer-center [page]/[topage] -O landscape --encoding utf-8", " ",
                string.Join(" ", listado_archivos), " ",
                Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));
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
                // Eliminamos el PDF
                System.IO.File.Delete(Path.Combine(PDF.RUTA_BASE, string.Concat(prefijo_archivo, "PDF.pdf")));

                // Enviamos el PDF a la UI
                return new FileStreamResult(pdfStream, "application/pdf");
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }
    }
}