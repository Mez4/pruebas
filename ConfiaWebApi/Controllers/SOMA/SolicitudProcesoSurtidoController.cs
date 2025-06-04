using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;

using DBContext.DBConfia;
using DBContext.DBConfia.Compras;
using DBContext.DBConfia.Seguridad;

using System.Net.Http;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Diagnostics;
using System.Globalization;
using ConfiaWebApi.Code;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using ConfiaWebApi.PeticionesRest.Prospeccion.Documentos;
using System.Net;

namespace ConfiaWebApi.Controllers.Sistema
{
    [ApiController]
    [Route("api/SOMA/[controller]")]

    public class SolicitudProcesoSurtidoController : ControllerBase
    {
        // TODO::
        // Validar funcion de eliminar cuenta... ??, valido, util ?
        // Segundo, se pueden eliminar las bovedas ??, se pueden actualizar hasta que nivel? (Nombre y Clave o solo nombre?)

        /// <summary>
        /// Conexion a base de datos
        /// </summary>
        private DBConfiaContext ConexionBD;
        private IConfiguration Configuracion;
        /// <summary>
        /// Constructor del controlador
        /// </summary>
        /// <param name="_DBContext">Conexión de datos para el controlador</param>
        public SolicitudProcesoSurtidoController(IConfiguration _Configuration, DBConfiaContext _DBContext)
        {
            this.Configuracion = _Configuration;
            ConexionBD = _DBContext;
        }

        // Obtenemos los balances
        [HttpGet]
        [Route("obtenerSolicitudes")]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Obtener()
        {
            var transaccion = false;
            try
            {
                ArrayList solsDetalle = new();
                var obj = new object();
                var SolicitudSurtido = await ConexionBD.database.FetchAsync<Surtido_VW>();
                if (SolicitudSurtido != null)
                {
                    foreach (var item in SolicitudSurtido)
                    {
                        solsDetalle.Add(new
                        {
                            SurtidoID = item.SurtidoID,
                            SolicitudID = item.SolicitudID,
                            AutorizaID = item.AutorizaID,
                            NombreAutoriza = item.NombreAutoriza,
                            SurteID = item.SurteID,
                            NombreSurte = item.NombreSurte,
                            CancelaID = item.CancelaID,
                            NombreCancela = item.NombreCancela,
                            FechaAutorizado = item.FechaAutorizado,
                            FechaSurtido = item.FechaSurtido,
                            FechaCancelacion = item.FechaCancelacion,
                            EstatusID = item.EstatusID,
                            EstatusDes = item.EstatusDes,
                            Descripcion = item.Descripcion,
                            Cancelada = item.Cancelada,
                            ReOrden = item.ReOrden,
                            OrdenID = item.OrdenID,
                            ReOrdenID = item.ReOrdenID,
                            ComprobanteDoc = item.ComprobanteDoc,
                            DocumentoID = item.DocumentoID,
                            ComprobanteFirma = item.ComprobanteFirma,
                            FirmaDocID = item.FirmaDocID,
                            ProductoID = item.ProductoID,
                            EmpresaId = item.EmpresaId,
                            Pendientes = item.Pendientes,
                            DetalleSurtido = (await ConexionBD.database.QueryAsync<SurtidoDetalle_VW>("WHERE SurtidoID=@0", item.SurtidoID).ToArrayAsync())
                        });
                    }
                }
                await ConexionBD.Destroy();
                return Ok(solsDetalle);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("ReOrden")]
        [Code.TProteccionProducto]
        public async Task<IActionResult> insertar(ConfiaWebApi.PeticionesRest.SOMA.SolicitudProcesoSurtido.Agregar parData)
        {
            var transaccion = false;
            var usuarioActualEmail = Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();
            int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
            try
            {
                var solSurtidos = "";
                //SACAMOS LOS DATOS DATOS DE LA TABLA SURTIDO PARA ACTUALIZAR 
                var ActualizaSurtido = await ConexionBD.database.SingleByIdAsync<Surtido>(parData.SurtidoID);

                if (ActualizaSurtido.Pendientes == false && ActualizaSurtido.EstatusID == 11)
                {
                    //ACTUALIZAMOS EL SURTIDO DEPENDIENDO SI TIENE PIEZAS PENDIENTES
                    ActualizaSurtido.SurteID = UsuarioActual.UsuarioID;
                    ActualizaSurtido.FechaSurtido = DateTime.Now;
                    ActualizaSurtido.EstatusID = 12;
                    await ConexionBD.database.UpdateAsync(ActualizaSurtido);

                    //ACTUALIZAMOS TABLA DE ORDEN
                    var ActualizaOrden = await ConexionBD.database.SingleByIdAsync<Orden>(ActualizaSurtido.SolicitudID);
                    ActualizaOrden.EstatusID = 12;
                    await ConexionBD.database.UpdateAsync(ActualizaOrden);

                    //ACTUALIZAMOS TABLA APROBACION
                    var ActualizaAprobacion = await ConexionBD.database.SingleByIdAsync<Aprobacion>(ActualizaSurtido.SolicitudID);
                    ActualizaAprobacion.EstatusID = 12;
                    await ConexionBD.database.UpdateAsync(ActualizaAprobacion);

                    //ACTUALIZAMOS TABLA SOLICITUD
                    var ActualizarSolicitud = await ConexionBD.database.SingleByIdAsync<Solicitud>(ActualizaSurtido.SolicitudID);
                    ActualizarSolicitud.EstatusID = 12;
                    await ConexionBD.database.UpdateAsync(ActualizarSolicitud);

                    //INSERT A TABLA RECEPCION
                    var RecepcionID = 0;
                    var InsertRecepcion = new DBContext.DBConfia.Compras.Recepcion()
                    {
                        SolicitudID = ActualizaSurtido.SolicitudID,
                        SurteID = ActualizaSurtido.SurteID,
                        FechaSurtido = ActualizaSurtido.FechaSurtido,
                        EstatusID = 12,
                        Descripcion = ActualizaSurtido.Descripcion,
                        SurtidoID = ActualizaSurtido.SurtidoID,
                        OrdenID = ActualizaOrden.OrdenID,
                    };
                    await ConexionBD.database.InsertAsync(InsertRecepcion);
                    RecepcionID = InsertRecepcion.RecepcionID;

                    //ACTUALIZAMOS TABLA SURTIDO DETALLE Y INSERT A LA TABLA RECEPCION DETALLE
                    foreach (var item in parData.DetalleSurtido)
                    {
                        //ACTUALIZAMOS TABLA SURTIDO DETALLE 
                        var SurtidoDetalle = await ConexionBD.database.SingleByIdAsync<SurtidoDetalle>(item.SurtidoDetalleID);
                        SurtidoDetalle.PiezasSurtidas = item.PiezasAutorizadas;
                        await ConexionBD.database.UpdateAsync(SurtidoDetalle);

                        //SACAMOS PIEZAS SOLICITADAS PARA INSERTAR EN  LA TABLA RECEPCION DETALLE
                        var SolicitudDetalle = await ConexionBD.database.SingleByIdAsync<SolicitudDetalle>(SurtidoDetalle.SolicitudDetalleID);

                        //INSERT A LA TABLA RECEPCION DETALLE
                        var RecepcionDetalle = new DBContext.DBConfia.Compras.RecepcionDetalle()
                        {
                            RecepcionID = RecepcionID,
                            SolicitudDetalleID = SurtidoDetalle.SolicitudDetalleID,
                            SurtidoDetalleID = SurtidoDetalle.SurtidoDetalleID,
                            ProductoUniformeID = SurtidoDetalle.ProductoUniformeID,
                            PiezasSolicitadas = SolicitudDetalle.PiezasSolicitadas,
                            PiezasSurtidas = SurtidoDetalle.PiezasSurtidas,
                        };
                        await ConexionBD.database.InsertAsync(RecepcionDetalle);
                    }
                }
                var SurtidoID = 0;
                var SurtidoReOrdenID = 0;
                if (ActualizaSurtido.Pendientes == true && ActualizaSurtido.EstatusID == 11)
                {
                    //ACTUALIZAMOS EL SURTIDO DEPENDIENDO SI TIENE PIEZAS PENDIENTES
                    ActualizaSurtido.SurteID = UsuarioActual.UsuarioID;
                    ActualizaSurtido.FechaSurtido = DateTime.Now;
                    ActualizaSurtido.EstatusID = 16;
                    ActualizaSurtido.ReOrden = true;
                    await ConexionBD.database.UpdateAsync(ActualizaSurtido);
                    SurtidoID = ActualizaSurtido.SurtidoID;

                    //ACTUALIZAMOS TABLA DE ORDEN
                    var OrdenID = 0;
                    var ActualizaOrden = await ConexionBD.database.SingleByIdAsync<Orden>(ActualizaSurtido.SolicitudID);
                    ActualizaOrden.EstatusID = 16;
                    await ConexionBD.database.UpdateAsync(ActualizaOrden);
                    OrdenID = ActualizaOrden.OrdenID;

                    //INSERT PARA NUEVA ORDEN POR LAS PIEZAS PENDIENTES
                    var ReOrdenID = 0;
                    var InsertReOrden = new DBContext.DBConfia.Compras.Orden()
                    {
                        SolicitudID = ActualizaSurtido.SolicitudID,
                        ApruebaID = UsuarioActual.UsuarioID,
                        AutorizaID = UsuarioActual.UsuarioID,
                        FechaAprobado = DateTime.Now,
                        FechaAutorizado = DateTime.Now,
                        EstatusID = 15,
                        AprobadoID = ActualizaOrden.AprobadoID,
                        ProductoID = ProductoID,
                    };
                    await ConexionBD.database.InsertAsync(InsertReOrden);
                    ReOrdenID = InsertReOrden.OrdenID;

                    //INSERT A LA TABLA SURTIDO DE LA NUEVA ORDEN POR LAS PIEZAS PENDIENTES
                    var InsertSurtidoReOrden = new DBContext.DBConfia.Compras.Surtido()
                    {
                        SolicitudID = ActualizaSurtido.SolicitudID,
                        AutorizaID = UsuarioActual.UsuarioID,
                        FechaAutorizado = DateTime.Now,
                        EstatusID = 15,
                        Descripcion = ActualizaSurtido.Descripcion,
                        ReOrden = true,
                        OrdenID = OrdenID,
                        ReOrdenID = ReOrdenID,
                        ProductoID = ProductoID
                    };
                    await ConexionBD.database.InsertAsync(InsertSurtidoReOrden);
                    SurtidoReOrdenID = InsertSurtidoReOrden.SurtidoID;

                    //VOLVEMOS A ACTUALIZAR EL SURTIDO
                    ActualizaSurtido.ReOrdenID = ReOrdenID;
                    await ConexionBD.database.UpdateAsync(ActualizaSurtido);

                    //ACTUALIZAMOS LA REORDEN EN LA TABLA SOLICITUD
                    var ActualizaSolicitud = await ConexionBD.database.SingleByIdAsync<Solicitud>(ActualizaSurtido.SolicitudID);
                    ActualizaSolicitud.ReOrdenID = ReOrdenID;
                    await ConexionBD.database.UpdateAsync(ActualizaSolicitud);

                    // INSERT A LA TABLA RECEPCION 
                    var RecepcionID = 0;
                    var InsertRecepcion = new DBContext.DBConfia.Compras.Recepcion()
                    {
                        SolicitudID = ActualizaSurtido.SolicitudID,
                        SurteID = ActualizaSurtido.SurteID,
                        FechaSurtido = ActualizaSurtido.FechaSurtido,
                        EstatusID = 16,
                        Descripcion = ActualizaSurtido.Descripcion,
                        OrdenID = OrdenID,
                        ReOrdenID = ReOrdenID,
                        SurtidoID = ActualizaSurtido.SurtidoID,
                        ProductoID = ProductoID,
                        Pendientes = true
                    };
                    await ConexionBD.database.InsertAsync(InsertRecepcion);
                    RecepcionID = InsertRecepcion.RecepcionID;

                    //ACTUALIZAMOS E INSERTAMOS TODOS LOS DETALLES CORRESPONDIENTES
                    foreach (var item in parData.DetalleSurtido)
                    {
                        //ACTUALIZAMOS LA TABLA SURTIDO DETALLE

                        var SurtidoDetalle = await ConexionBD.database.SingleByIdAsync<SurtidoDetalle>(item.SurtidoDetalleID);
                        SurtidoDetalle.PiezasSurtidas = item.PiezasAutorizadas;
                        SurtidoDetalle.PiezasPendientes = item.PiezasPendientes;
                        SurtidoDetalle.FechaCompromiso = item.FechaCompromiso;
                        SurtidoDetalle.Observaciones = item.Observaciones;
                        await ConexionBD.database.UpdateAsync(SurtidoDetalle);

                        //ACTUALIZAMOS LA ORDEN DE LAS PIEZAS AUTORIZADAS
                        var OrdenDetalle = await ConexionBD.database.SingleByIdAsync<OrdenDetalle>(OrdenID);
                        OrdenDetalle.FechaCompromiso = item.FechaCompromiso;
                        OrdenDetalle.Observaciones = item.Observaciones;
                        await ConexionBD.database.UpdateAsync(OrdenDetalle);

                        // SACAMOS EL DETALLE DE LA APROBACION
                        var AprobacionDetalle = await ConexionBD.database.SingleByIdAsync<AprobacionDetalle>(SurtidoDetalle.SolicitudDetalleID);

                        if (item.PiezasPendientes != 0)
                        {
                            //INSERTAMOS LA NUEVA REORDEN POR LAS PIEZAS PENDIENTES
                            var ReOrdenDetalle = new DBContext.DBConfia.Compras.OrdenDetalle()
                            {
                                OrdenID = ReOrdenID,
                                SolicitudDetalleID = SurtidoDetalle.SolicitudDetalleID,
                                AprobadoDetalleID = AprobacionDetalle.AprobadoDetalleID,
                                ProductoUniformeID = SurtidoDetalle.ProductoUniformeID,
                                PiezasAprobadas = item.PiezasPendientes,
                                PiezasAutorizadas = item.PiezasPendientes,
                                FechaCompromiso = item.FechaCompromiso,
                                Observaciones = item.Observaciones,
                            };
                            await ConexionBD.database.InsertAsync(ReOrdenDetalle);

                            //ACTUALIZAMOS EL SURTIDO DETALLE DE LA REORDEN 
                            var SurtidoDetalleReOrden = new DBContext.DBConfia.Compras.SurtidoDetalle()
                            {

                                SurtidoID = SurtidoReOrdenID,
                                SolicitudDetalleID = item.SurtidoDetalleID,
                                OrdenDetalleID = ReOrdenDetalle.OrdenDetalleID,
                                ProductoUniformeID = SurtidoDetalle.ProductoUniformeID,
                                PiezasAutorizadas = ReOrdenDetalle.PiezasAutorizadas,
                                FechaCompromiso = item.FechaCompromiso,
                                Observaciones = item.Observaciones,
                            };
                            await ConexionBD.database.InsertAsync(SurtidoDetalleReOrden);

                            //SACAMOS PIEZAS SOLICITADAS PARA INSERTAR EN  LA TABLA RECEPCION DETALLE
                            var SolicitudDetalle = await ConexionBD.database.SingleByIdAsync<SolicitudDetalle>(SurtidoDetalle.SolicitudDetalleID);

                            //INSERT A LA TABLA RECEPCION DETALLE
                            var RecepcionDetalle = new DBContext.DBConfia.Compras.RecepcionDetalle()
                            {
                                RecepcionID = RecepcionID,
                                SolicitudDetalleID = SurtidoDetalle.SolicitudDetalleID,
                                SurtidoDetalleID = SurtidoDetalle.SurtidoDetalleID,
                                ProductoUniformeID = SurtidoDetalle.ProductoUniformeID,
                                PiezasSolicitadas = SolicitudDetalle.PiezasSolicitadas,
                                PiezasSurtidas = SurtidoDetalle.PiezasSurtidas,
                                PiezasPendientes = item.PiezasPendientes,
                            };
                            await ConexionBD.database.InsertAsync(RecepcionDetalle);
                        }
                    }
                }

                var ActualizaSurtidoReOrden = await ConexionBD.database.SingleByIdAsync<Surtido>(ActualizaSurtido.SurtidoID);
                if (ActualizaSurtido.Pendientes == false && ActualizaSurtido.EstatusID == 15 && ActualizaSurtido.ReOrden == true)
                {
                    //ACTUALIZAMOS EL SURTIDO DE LA REORDEN
                    ActualizaSurtidoReOrden.SurteID = UsuarioActual.UsuarioID;
                    ActualizaSurtidoReOrden.FechaSurtido = DateTime.Now;
                    ActualizaSurtidoReOrden.EstatusID = 12;
                    await ConexionBD.database.UpdateAsync(ActualizaSurtidoReOrden);

                    //ACTUALIZAMOS EL ESTADO DEL SURTIDO DE LA ORDEN ANTERIOR
                    var ActualizaSurtidoOr = await ConexionBD.database.QueryAsync<Surtido>(" WHERE Pendientes = 1 AND OrdenID=@0", ActualizaSurtido.OrdenID).SingleOrDefaultAsync();
                    ActualizaSurtidoOr.EstatusID = 12;
                    await ConexionBD.database.UpdateAsync(ActualizaSurtidoOr);

                    //ACTUALIZAMOS TABLA DE ORDEN ANTERIOR
                    var OrdenID = 0;
                    var ActualizaOrden = await ConexionBD.database.SingleByIdAsync<Orden>(ActualizaSurtido.OrdenID);
                    ActualizaOrden.EstatusID = 12;
                    await ConexionBD.database.UpdateAsync(ActualizaOrden);
                    OrdenID = ActualizaOrden.OrdenID;

                    //ACTUALIZAMOS EL ESTADO DE LA REORDEN
                    var ReOrdenID = 0;
                    var ActualizaReOrden = await ConexionBD.database.QueryAsync<Orden>("WHERE OrdenID=@0", ActualizaSurtido.ReOrdenID).SingleOrDefaultAsync();
                    ActualizaReOrden.EstatusID = 12;
                    await ConexionBD.database.UpdateAsync(ActualizaReOrden);
                    ReOrdenID = ActualizaReOrden.OrdenID;

                    //ACTUALIZAMOS LA TABLA APROBACION
                    var ActualizaAprobacion = await ConexionBD.database.SingleByIdAsync<Aprobacion>(ActualizaSurtido.SolicitudID);
                    ActualizaAprobacion.EstatusID = 12;
                    await ConexionBD.database.UpdateAsync(ActualizaAprobacion);

                    //ACTUALIZAMOS LA TABLA SOLICITUD
                    var ActualizaSolicitud = await ConexionBD.database.SingleByIdAsync<Solicitud>(ActualizaSurtido.SolicitudID);
                    ActualizaSolicitud.EstatusID = 12;
                    await ConexionBD.database.UpdateAsync(ActualizaSolicitud);

                    // HAY QUE ACTUALIZAR EL ESTATUS DE LA RECEPCION DEL SURTIDO DE LA ORDEN ANTERIOR
                    var ActualizaRecepcion = await ConexionBD.database.QueryAsync<Recepcion>("WHERE Pendientes = 1 AND OrdenID=@0", ActualizaSurtido.OrdenID).SingleOrDefaultAsync();
                    ActualizaRecepcion.EstatusID = 12;
                    await ConexionBD.database.UpdateAsync(ActualizaRecepcion);

                    //INSERT DE LA RECEPCION DE LAS PIEZAS PENDIENTES
                    var RecepcionReOrdenID = 0;
                    var InsertRecepcionReOrden = new DBContext.DBConfia.Compras.Recepcion()
                    {
                        SolicitudID = ActualizaSurtido.SolicitudID,
                        SurteID = UsuarioActual.UsuarioID,
                        FechaSurtido = DateTime.Now,
                        EstatusID = 12,
                        Descripcion = ActualizaSurtido.Descripcion,
                        OrdenID = ActualizaRecepcion.OrdenID,
                        ReOrdenID = ActualizaRecepcion.ReOrdenID,
                        SurtidoID = ActualizaSurtido.SurtidoID,
                        ProductoID = ProductoID,
                    };
                    await ConexionBD.database.InsertAsync(InsertRecepcionReOrden);
                    RecepcionReOrdenID = InsertRecepcionReOrden.RecepcionID;

                    //ACTUALIZAMOS E INSERTAMOS TODOS LOS DETALLES CORRESPONDIENTES
                    foreach (var item in parData.DetalleSurtido)
                    {
                        //SACAMOS EL SURTIDO DETALLE DE LA REORDEN
                        var SurtidoDetalleReOrden = await ConexionBD.database.SingleByIdAsync<SurtidoDetalle>(item.SurtidoDetalleID);
                        SurtidoDetalleReOrden.PiezasSurtidas = SurtidoDetalleReOrden.PiezasAutorizadas;
                        await ConexionBD.database.UpdateAsync(SurtidoDetalleReOrden);

                        //INSERT A LA TABLA RECEPCION DETALLE
                        var RecepcionDetalle = new DBContext.DBConfia.Compras.RecepcionDetalle()
                        {
                            RecepcionID = RecepcionReOrdenID,
                            SolicitudDetalleID = item.SolicitudDetalleID,
                            SurtidoDetalleID = item.SurtidoDetalleID,
                            ProductoUniformeID = item.CorteID,
                            PiezasSolicitadas = SurtidoDetalleReOrden.PiezasAutorizadas,
                            PiezasSurtidas = SurtidoDetalleReOrden.PiezasSurtidas,
                        };
                        await ConexionBD.database.InsertAsync(RecepcionDetalle);
                    }
                }
                ConexionBD.database.BeginTransaction();
                ConexionBD.database.CompleteTransaction();
                await ConexionBD.Destroy();
                return Ok();
            }
            catch (Exception ex)
            {
                if (transaccion) ; ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPut]
        [Route("cancelarPiezas")]
        [Code.TProteccionProducto]
        public async Task<IActionResult> cancelar(ConfiaWebApi.PeticionesRest.SOMA.SolicitudProcesoSurtido.Agregar parData)
        {
            var transaccion = false;
            var usuarioActualEmail = Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();
            try
            {
                var OrdenesID = 0;
                var ActualizaSurtido = await ConexionBD.database.SingleByIdAsync<Surtido>(parData.SurtidoID);
                ActualizaSurtido.Pendientes = false;
                await ConexionBD.database.UpdateAsync(ActualizaSurtido);

                foreach (var item in parData.DetalleSurtido)
                {

                    var ActualizaSurtidoDetalle = await ConexionBD.database.SingleByIdAsync<SurtidoDetalle>(item.SurtidoDetalleID);
                    ActualizaSurtidoDetalle.PiezasPendientes = 0;
                    ActualizaSurtidoDetalle.FechaCompromiso = "";
                    ActualizaSurtidoDetalle.Observaciones = "";
                    await ConexionBD.database.UpdateAsync(ActualizaSurtidoDetalle);

                    var ActualizaOrdenDetalle = await ConexionBD.database.SingleByIdAsync<OrdenDetalle>(ActualizaSurtidoDetalle.OrdenDetalleID);
                    ActualizaOrdenDetalle.PiezasPendientes = 0;
                    ActualizaOrdenDetalle.FechaCompromiso = "";
                    ActualizaOrdenDetalle.Observaciones = "";
                    await ConexionBD.database.UpdateAsync(ActualizaOrdenDetalle);
                }
                ConexionBD.database.BeginTransaction();
                var solSurtido = await ConexionBD.database.QueryAsync<Surtido_VW>("WHERE SurtidoID = @0", ActualizaSurtido.SurtidoID).SingleOrDefaultAsync();
                if (solSurtido != null)
                {
                    var solsDetalle = new
                    {
                        SurtidoID = solSurtido.SurtidoID,
                        SolicitudID = solSurtido.SolicitudID,
                        AutorizaID = solSurtido.AutorizaID,
                        NombreAutoriza = solSurtido.NombreAutoriza,
                        SurteID = solSurtido.SurteID,
                        NombreSurte = solSurtido.NombreSurte,
                        CancelaID = solSurtido.CancelaID,
                        NombreCancela = solSurtido.NombreCancela,
                        FechaAutorizado = solSurtido.FechaAutorizado,
                        FechaSurtido = solSurtido.FechaSurtido,
                        FechaCancelacion = solSurtido.FechaCancelacion,
                        EstatusID = solSurtido.EstatusID,
                        EstatusDes = solSurtido.EstatusDes,
                        Descripcion = solSurtido.Descripcion,
                        Cancelada = solSurtido.Cancelada,
                        ReOrden = solSurtido.ReOrden,
                        OrdenID = solSurtido.OrdenID,
                        ReOrdenID = solSurtido.ReOrdenID,
                        ComprobanteDoc = solSurtido.ComprobanteDoc,
                        DocumentoID = solSurtido.DocumentoID,
                        ComprobanteFirma = solSurtido.ComprobanteFirma,
                        FirmaDocID = solSurtido.FirmaDocID,
                        ProductoID = solSurtido.ProductoID,
                        EmpresaId = solSurtido.EmpresaId,
                        Pendientes = solSurtido.Pendientes,
                        DetalleSurtido = (await ConexionBD.database.QueryAsync<SurtidoDetalle_VW>("WHERE SurtidoId=@0", ActualizaSurtido.SurtidoID).ToArrayAsync())
                    };
                }
                transaccion = true;
                ConexionBD.database.CompleteTransaction();
                await ConexionBD.Destroy();
                return Ok(solSurtido);
            }
            catch (Exception ex)
            {
                if (transaccion) ; ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpPut]
        [Route("cancelarSurtido")]
        [Code.TProteccionProducto]
        public async Task<IActionResult> cancelarSurtido(ConfiaWebApi.PeticionesRest.SOMA.SolicitudProcesoSurtido.Agregar parData)
        {
            var transaccion = false;
            var usuarioActualEmail = Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();
            try
            {
                //ACTUALIZAMOS EL SURTIDO PARA CANCELAR LA ORDEN
                var ActualizaSurtido = await ConexionBD.database.SingleByIdAsync<Surtido>(parData.SurtidoID);
                ActualizaSurtido.CancelaID = UsuarioActual.UsuarioID;
                ActualizaSurtido.FechaCancelacion = DateTime.Now;
                ActualizaSurtido.EstatusID = 2;
                ActualizaSurtido.Cancelada = true;
                await ConexionBD.database.UpdateAsync(ActualizaSurtido);

                //ACTUALIZAMOS LA ORDEN DE COMPRA
                var ActualizaOrden = await ConexionBD.database.SingleByIdAsync<Orden>(ActualizaSurtido.OrdenID);
                ActualizaOrden.EstatusID = 2;
                await ConexionBD.database.UpdateAsync(ActualizaOrden);

                //ACTUALIZAMOS LA TABLA DE APROBACION
                var ActualizaAprobacion = await ConexionBD.database.SingleByIdAsync<Aprobacion>(ActualizaOrden.AprobadoID);
                ActualizaAprobacion.EstatusID = 2;
                await ConexionBD.database.UpdateAsync(ActualizaAprobacion);

                //ACTUALIZAMOS LA TABLA DE SOLICITUD
                var ActualizaSolicitud = await ConexionBD.database.SingleByIdAsync<Solicitud>(ActualizaAprobacion.SolicitudID);
                ActualizaSolicitud.CancelaID = ActualizaSurtido.CancelaID;
                ActualizaSolicitud.FechaCancelacion = ActualizaSurtido.FechaCancelacion;
                ActualizaSolicitud.EstatusID = 2;
                await ConexionBD.database.UpdateAsync(ActualizaSolicitud);

                ConexionBD.database.BeginTransaction();
                var solSurtido = await ConexionBD.database.QueryAsync<Surtido_VW>("WHERE SurtidoID = @0", ActualizaSurtido.SurtidoID).SingleOrDefaultAsync();
                if (solSurtido != null)
                {
                    var solsDetalle = new
                    {
                        SurtidoID = solSurtido.SurtidoID,
                        SolicitudID = solSurtido.SolicitudID,
                        AutorizaID = solSurtido.AutorizaID,
                        NombreAutoriza = solSurtido.NombreAutoriza,
                        SurteID = solSurtido.SurteID,
                        NombreSurte = solSurtido.NombreSurte,
                        CancelaID = solSurtido.CancelaID,
                        NombreCancela = solSurtido.NombreCancela,
                        FechaAutorizado = solSurtido.FechaAutorizado,
                        FechaSurtido = solSurtido.FechaSurtido,
                        FechaCancelacion = solSurtido.FechaCancelacion,
                        EstatusID = solSurtido.EstatusID,
                        EstatusDes = solSurtido.EstatusDes,
                        Descripcion = solSurtido.Descripcion,
                        Cancelada = solSurtido.Cancelada,
                        ReOrden = solSurtido.ReOrden,
                        OrdenID = solSurtido.OrdenID,
                        ReOrdenID = solSurtido.ReOrdenID,
                        ComprobanteDoc = solSurtido.ComprobanteDoc,
                        DocumentoID = solSurtido.DocumentoID,
                        ComprobanteFirma = solSurtido.ComprobanteFirma,
                        FirmaDocID = solSurtido.FirmaDocID,
                        ProductoID = solSurtido.ProductoID,
                        EmpresaId = solSurtido.EmpresaId,
                        Pendientes = solSurtido.Pendientes,
                        DetalleSurtido = (await ConexionBD.database.QueryAsync<SurtidoDetalle_VW>("WHERE SurtidoId=@0", ActualizaSurtido.SurtidoID).ToArrayAsync())
                    };
                }
                transaccion = true;

                ConexionBD.database.CompleteTransaction();
                await ConexionBD.Destroy();
                return Ok(solSurtido);
            }
            catch (Exception ex)
            {
                if (transaccion) ; ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("getDoc")]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetDoc(ConfiaWebApi.PeticionesRest.SOMA.SolicitudProcesoSurtido.GetDoc parData)
        {
            var transaccion = false;

            try
            {
                var src = "";
                var srcBC = "";
                var Documento = await ConexionBD.database.QueryAsync<DocumentosUniformes>("WHERE SurtidoID=@0 AND Firmado IS NULL", parData.SurtidoID).SingleOrDefaultAsync();

                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                var basicToken = Convert.ToBase64String(plainTextBytes);
                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicToken); ;
                    var response = await client.GetAsync($"{Configuracion["BucketApi:url"]}{Configuracion["BucketApi:getRequest"]}?expireIn=10&path={Documento.Ruta}");
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
                        ConexionBD.database.BeginTransaction();
                        transaccion = true;
                        var res = new
                        {
                            res = 2,
                            msj = $"Consulta correcta del documento {parData.DocumentoID}",
                            src = $"{srcB64}"
                        };

                        ConexionBD.database.CompleteTransaction();
                        await ConexionBD.Destroy();
                        return Ok(res);
                    }
                    else
                    {
                        if (transaccion) ; ConexionBD.database.AbortTransaction();
                        await ConexionBD.Destroy();
                        return BadRequest(response.StatusCode);
                    }
                }

            }
            catch (Exception ex)
            {
                if (transaccion) ; ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest("ERROR AL GUARDAR LOS DATOS: " + ex.Message);
            }

        }

        [Consumes("multipart/form-data")]
        [HttpPost]
        [Route("subirEvidencia")]
        [Code.TProteccionProducto]
        public async Task<IActionResult> SubirExpediente([FromForm] ConfiaWebApi.PeticionesRest.SOMA.SolicitudProcesoSurtido.UploadFile parData)

        {
            var transaccion = false;
            try
            {

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                var basicToken = Convert.ToBase64String(plainTextBytes);
                string path = Configuracion["BucketApi:AwsPath_DocsUniforme"];
                string file_name = $"SD{parData.SurtidoID}_{DateTime.Now.ToString("dd_MM_yyyy")}.pdf";
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
                        if (parData.DocumentoID == 0)
                        {
                            var Documento = new DocumentosUniformes()
                            {
                                SurtidoID = parData.SurtidoID,
                                Ruta = $"{path}/{file_name}",
                                Autorizado = true,
                            };
                            await ConexionBD.database.InsertAsync<DocumentosUniformes>(Documento);
                            DocumentoIDAux = Documento.DocumentoID;
                        }
                        else
                        {
                            var Documento = await ConexionBD.database.SingleByIdAsync<DocumentosUniformes>(parData.DocumentoID);
                            Documento.Ruta = $"{path}/{file_name}";
                            Documento.Autorizado = true;
                            await ConexionBD.database.UpdateAsync(Documento);
                            DocumentoIDAux = Documento.DocumentoID;
                        }
                    }
                    else
                    {
                        await ConexionBD.Destroy();
                        return BadRequest(response.StatusCode);
                    }
                }
                var resSolici = await ConexionBD.database.QueryAsync<Surtido>("WHERE SurtidoID=@0", parData.SurtidoID).SingleOrDefaultAsync();
                resSolici.ComprobanteDoc = $"{path}/{file_name}";
                resSolici.DocumentoID = ((int)DocumentoIDAux);

                ConexionBD.database.BeginTransaction();
                transaccion = true;

                await ConexionBD.database.UpdateAsync(resSolici);

                ConexionBD.database.CompleteTransaction();
                await ConexionBD.Destroy();

                return Ok(resSolici);
            }
            catch (Exception ex)
            {
                if (transaccion) ; ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [Consumes("multipart/form-data")]
        [HttpPost]
        [Route("subirFirma")]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetFirma([FromForm] ConfiaWebApi.PeticionesRest.SOMA.SolicitudProcesoSurtido.UploadFiles parData)
        {
            var transaccion = false;
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                var basicToken = Convert.ToBase64String(plainTextBytes);
                string path = Configuracion["BucketApi:AwsPath_DocsUniforme"];
                string file_name = $"SF{parData.SurtidoID}_{DateTime.Now.ToString("dd_MM_yyyy")}.png";
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
                        if (parData.DocumentoID == 0)
                        {
                            var Documento = new DocumentosUniformes()
                            {
                                SurtidoID = parData.SurtidoID,
                                Ruta = $"{path}/{file_name}",
                                Autorizado = true,
                                Firmado = true
                            };
                            await ConexionBD.database.InsertAsync<DocumentosUniformes>(Documento);
                            DocumentoIDAux = Documento.DocumentoID;
                        }
                        else
                        {
                            var Documento = await ConexionBD.database.SingleByIdAsync<DocumentosUniformes>(parData.DocumentoID);
                            Documento.Ruta = $"{path}/{file_name}";
                            Documento.Autorizado = true;
                            await ConexionBD.database.UpdateAsync(Documento);
                            DocumentoIDAux = Documento.DocumentoID;
                        }
                    }
                    else
                    {
                        await ConexionBD.Destroy();
                        return BadRequest(response.StatusCode);
                    }
                }
                var resSolici = await ConexionBD.database.QueryAsync<Surtido>("WHERE SurtidoID=@0", parData.SurtidoID).SingleOrDefaultAsync();
                resSolici.ComprobanteFirma = $"{path}/{file_name}";
                resSolici.FirmaDocID = ((int)DocumentoIDAux);

                ConexionBD.database.BeginTransaction();
                transaccion = true;

                await ConexionBD.database.UpdateAsync(resSolici);

                ConexionBD.database.CompleteTransaction();
                await ConexionBD.Destroy();

                return Ok(resSolici);
            }
            catch (Exception ex)
            {
                if (transaccion) ; ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("getFirma")]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetFirma(ConfiaWebApi.PeticionesRest.SOMA.SolicitudProcesoSurtido.GetFirma parData)
        {
            var transaccion = false;

            try
            {
                var src = "";
                var srcBC = "";
                var Documento = await ConexionBD.database.QueryAsync<DocumentosUniformes>("WHERE Firmado = 1 AND SurtidoID=@0", parData.SurtidoID).SingleOrDefaultAsync();

                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                var basicToken = Convert.ToBase64String(plainTextBytes);
                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicToken); ;
                    var response = await client.GetAsync($"{Configuracion["BucketApi:url"]}{Configuracion["BucketApi:getRequest"]}?expireIn=10&path={Documento.Ruta}");
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
                        ConexionBD.database.BeginTransaction();
                        transaccion = true;
                        var res = new
                        {
                            res = 2,
                            msj = $"Consulta correcta del documento {parData.FirmaDocID}",
                            src = $"{srcBC}"
                        };

                        ConexionBD.database.CompleteTransaction();
                        await ConexionBD.Destroy();
                        return Ok(res);
                    }
                    else
                    {
                        if (transaccion) ; ConexionBD.database.AbortTransaction();
                        await ConexionBD.Destroy();
                        return BadRequest(response.StatusCode);
                    }
                }
            }
            catch (Exception ex)
            {
                if (transaccion) ; ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest("ERROR AL GUARDAR LOS DATOS: " + ex.Message);
            }
        }
    }
}
