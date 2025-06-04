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

namespace ConfiaWebApi.Controllers.Sistema
{
    [ApiController]
    [Route("api/SOMA/[controller]")]

    public class AprobacionSolicitudUniformeController : ControllerBase
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
        public AprobacionSolicitudUniformeController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        [HttpGet]
        [Route("obtenerSolicitudes")]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Obtener()
        {
            var transaccion = false;
            try
            {
                ArrayList solsDetalle = new();
                //var obj = new object();
                var Aprobacionvw = await ConexionBD.database.FetchAsync<Aprobacion_VW>();
                if (Aprobacionvw != null)
                {
                    foreach (var item in Aprobacionvw)
                    {
                        solsDetalle.Add(new
                        {
                            AprobadoID = item.AprobadoID,
                            SolicitudID = item.SolicitudID,
                            SolicitanteID = item.SolicitanteID,
                            NombreSolicita = item.NombreSolicita,
                            ApruebaID = item.ApruebaID,
                            NombreAprueba = item.NombreAprueba,
                            FechaSolicitud = item.FechaSolicitud,
                            FechaAprobado = item.FechaAprobado,
                            EstatusID = item.EstatusID,
                            EstatusDes = item.EstatusDes,
                            Descripcion = item.Descripcion,
                            ProductoID = item.ProductoID,
                            DetalleAprobacion = (await ConexionBD.database.QueryAsync<AprobacionDetalle_VW>("WHERE AprobadoID=@0", item.AprobadoID).ToArrayAsync())
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

        [HttpPut]
        [Route("actualizarPiezasAprobadas")]
        [Code.TProteccionProducto]
        public async Task<IActionResult> actualizar(ConfiaWebApi.PeticionesRest.SOMA.AprobacionSolicitudUniforme.Agregar parData)
        {
            var transaccion = false;
            var usuarioActualEmail = Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();
            int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
            try
            {
                //ACTUALIZAR LA TABLA DE APROBACION
                var AprobadoID = 0;
                var ActualizaAprobar = await ConexionBD.database.SingleByIdAsync<Aprobacion>(parData.AprobadoID);
                if (ActualizaAprobar != null)
                {
                    ActualizaAprobar.ApruebaID = UsuarioActual.UsuarioID;
                    ActualizaAprobar.FechaAprobado = DateTime.Now;
                    ActualizaAprobar.EstatusID = 3;
                    ConexionBD.database.BeginTransaction();
                    transaccion = true;
                    await ConexionBD.database.UpdateAsync(ActualizaAprobar);
                }
                AprobadoID = ActualizaAprobar.AprobadoID;

                //ACTUALIZAMOS LA TABLA SOLICITUD
                var ActualizaSolicitud = await ConexionBD.database.SingleByIdAsync<Solicitud>(ActualizaAprobar.SolicitudID);
                if (ActualizaSolicitud != null)
                {
                    ActualizaSolicitud.EstatusID = 3;
                    ActualizaSolicitud.Aprobado = true;
                    await ConexionBD.database.UpdateAsync(ActualizaSolicitud);
                }

                //INSERTAMOS EN LA TABLA DE ORDEN 
                var OrdenID = 0;
                var ActualizaOrden = new DBContext.DBConfia.Compras.Orden()
                {
                    SolicitudID = ActualizaAprobar.SolicitudID,
                    ApruebaID = ActualizaAprobar.ApruebaID,
                    FechaAprobado = ActualizaAprobar.FechaAprobado,
                    EstatusID = 3,
                    AprobadoID = AprobadoID,
                    ProductoID = ProductoID
                };
                await ConexionBD.database.InsertAsync(ActualizaOrden);

                OrdenID = ActualizaOrden.OrdenID;

                // ACTUALIZA TABLA APROBACION DETALLE Y INSERT A LA TABLA ORDEN DETALLE
                foreach (var item in parData.DetalleAprobacion)
                {
                    //ACTUALIZAR TABLA DETALLE DE APROBACION
                    var AprobacionDetalle = await ConexionBD.database.SingleByIdAsync<AprobacionDetalle>(item.AprobadoDetalleID);
                    {
                        AprobacionDetalle.PiezasAprobadas = item.PiezasAprobadas;
                    };
                    await ConexionBD.database.UpdateAsync(AprobacionDetalle);

                    //INSERT A LA TABLA DE ORDEN DETALLE
                    var OrdenDetalle = new DBContext.DBConfia.Compras.OrdenDetalle()
                    {
                        OrdenID = ActualizaOrden.OrdenID,
                        SolicitudDetalleID = AprobacionDetalle.SolicitudDetalleID,
                        AprobadoDetalleID = AprobacionDetalle.AprobadoDetalleID,
                        ProductoUniformeID = AprobacionDetalle.ProductoUniformeID,
                        PiezasAprobadas = AprobacionDetalle.PiezasAprobadas,
                    };
                    await ConexionBD.database.InsertAsync(OrdenDetalle);

                    //ACTUALIZAMOS LA SOLICITUD DETALLE 
                    var SolicitudDetalle = await ConexionBD.database.SingleByIdAsync<SolicitudDetalle>(AprobacionDetalle.SolicitudDetalleID);
                    {
                        SolicitudDetalle.PiezasAprobadas = item.PiezasAprobadas;
                    };
                    await ConexionBD.database.UpdateAsync(SolicitudDetalle);
                }

                var solAprobacion = await ConexionBD.database.QueryAsync<Aprobacion_VW>("WHERE AprobadoID = @0", ActualizaAprobar.AprobadoID).SingleOrDefaultAsync();
                if (solAprobacion != null)
                {
                    var solsDetalle = new
                    {
                        AprobadoID = solAprobacion.AprobadoID
                        ,
                        SolicitudID = solAprobacion.SolicitudID
                        ,
                        SolicitanteID = solAprobacion.SolicitanteID
                        ,
                        NombreSolicita = solAprobacion.NombreSolicita
                        ,
                        ApruebaID = solAprobacion.ApruebaID
                        ,
                        NombreAprueba = solAprobacion.NombreAprueba
                        ,
                        FechaSolicitud = solAprobacion.FechaSolicitud
                        ,
                        FechaAprobado = solAprobacion.FechaAprobado
                        ,
                        EstatusID = solAprobacion.EstatusID
                        ,
                        EstatusDes = solAprobacion.EstatusDes
                        ,
                        Descripcion = solAprobacion.Descripcion
                        ,
                        ProductoID = solAprobacion.ProductoID
                        ,
                        DetalleAprobacion = (await ConexionBD.database.QueryAsync<AprobacionDetalle_VW>("WHERE AprobadoID=@0", ActualizaAprobar.AprobadoID).ToArrayAsync())
                    };
                }

                ConexionBD.database.CompleteTransaction();
                await ConexionBD.Destroy();
                return Ok(solAprobacion);
            }
            catch (Exception ex)
            {
                if (transaccion) ; ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}
