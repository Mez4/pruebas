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

namespace ConfiaWebApi.Controllers.Sistema
{
    [ApiController]
    [Route("api/SOMA/[controller]")]

    public class SolicitudUniformeController : ControllerBase
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
        public SolicitudUniformeController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }


        [HttpGet]
        [Route("obtenerProducto")]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerCortes()
        {
            try
            {
                var Cortes = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Compras.Producto>();
                //Destroy connection
                await ConexionBD.Destroy();
                return Ok(Cortes);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
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
                var SolicitudUniformes = await ConexionBD.database.FetchAsync<Solicitud_VW>();
                if (SolicitudUniformes != null)
                {
                    foreach (var item in SolicitudUniformes)
                    {
                        solsDetalle.Add(new
                        {
                            SolicitudID = item.SolicitudID,
                            SolicitanteID = item.SolicitanteID,
                            NombreSolicita = item.NombreSolicita,
                            RecepcionaID = item.RecepcionaID,
                            NombreRecepciona = item.NombreRecepciona,
                            CancelaID = item.CancelaID,
                            NombreCancela = item.NombreCancela,
                            FechaSolicitud = item.FechaSolicitud,
                            FechaRecepcion = item.FechaRecepcion,
                            FechaCancelacion = item.FechaCancelacion,
                            EstatusID = item.EstatusID,
                            EstatusDes = item.EstatusDes,
                            Piezas = item.Piezas,
                            Descripcion = item.Descripcion,
                            OrdenID = item.OrdenID,
                            ReOrdenID = item.ReOrdenID,
                            RecepcionID = item.RecepcionID,
                            Recepcionado = item.Recepcionado,
                            Aprobado = item.Aprobado,
                            RecepcionParcialID = item.RecepcionParcialID,
                            DevolucionID = item.DevolucionID,
                            ProductoID = item.ProductoID,
                            EmpresaId = item.EmpresaId,
                            DetalleSolicitud = (await ConexionBD.database.QueryAsync<SolicitudDetalle_VW>("WHERE SolicitudID=@0", item.SolicitudID).ToArrayAsync())
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

        [HttpPost]
        [Route("insertarSolicitud")]
        [Code.TProteccionProducto]
        public async Task<IActionResult> insertar(ConfiaWebApi.PeticionesRest.SOMA.SolicitudUniforme.Agregar parData)
        {

            var transaccion = false;
            var usuarioActualEmail = Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();
            int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
            try
            {

                var SolicitudID = 0;
                var Solicitud = new DBContext.DBConfia.Compras.Solicitud()
                {
                    SolicitanteID = UsuarioActual.UsuarioID,
                    FechaSolicitud = DateTime.Now,
                    EstatusID = 1,
                    Piezas = parData.DetalleSolicitud.Count(),
                    Descripcion = parData.Descripcion,
                    ProductoID = ProductoID,

                };
                await ConexionBD.database.InsertAsync(Solicitud);
                SolicitudID = Solicitud.SolicitudID;

                //INSERTA A LA TABLA DE APROBACION (CABECERO)
                var AprobadoID = 0;
                var Aprobado = new DBContext.DBConfia.Compras.Aprobacion()
                {
                    SolicitudID = SolicitudID,
                    SolicitanteID = Solicitud.SolicitanteID,
                    FechaSolicitud = Solicitud.FechaSolicitud,
                    EstatusID = Solicitud.EstatusID,
                    Descripcion = Solicitud.Descripcion,
                    ProductoID = Solicitud.ProductoID,
                };
                ConexionBD.database.BeginTransaction();
                transaccion = true;
                await ConexionBD.database.InsertAsync(Aprobado);
                AprobadoID = Aprobado.AprobadoID;

                //INSERTA A LA TABLA DETALLE DE SOLICITUD y TABLA DETALLE DE APROBACION
                foreach (var item in parData.DetalleSolicitud)
                {
                    var SolicitudDetalle = new DBContext.DBConfia.Compras.SolicitudDetalle()
                    {
                        SolicitudID = SolicitudID,
                        ProductoUniformeID = item.ProductoUniformeID,
                        PiezasSolicitadas = item.PiezasSolicitadas,
                    };
                    await ConexionBD.database.InsertAsync(SolicitudDetalle);

                    var AprobacionDetalle = new DBContext.DBConfia.Compras.AprobacionDetalle()
                    {
                        AprobadoID = AprobadoID,
                        SolicitudDetalleID = SolicitudDetalle.SolicitudDetalleID,
                        ProductoUniformeID = SolicitudDetalle.ProductoUniformeID,
                        PiezasSolicitadas = SolicitudDetalle.PiezasSolicitadas,
                    };
                    await ConexionBD.database.InsertAsync(AprobacionDetalle);
                }

                ArrayList solsDetalle = new();
                //var obj = new object();
                var solvw = await ConexionBD.database.QueryAsync<Solicitud_VW>("WHERE SolicitudID = @0", SolicitudID).SingleOrDefaultAsync();
                if (solvw != null)
                {
                    solsDetalle.Add(new
                    {
                        SolicitudID = solvw.SolicitudID,
                        SolicitanteID = solvw.SolicitanteID,
                        NombreSolicita = solvw.NombreSolicita,
                        RecepcionaID = solvw.RecepcionaID,
                        NombreRecepciona = solvw.NombreRecepciona,
                        CancelaID = solvw.CancelaID,
                        NombreCancela = solvw.NombreCancela,
                        FechaSolicitud = solvw.FechaSolicitud,
                        FechaRecepcion = solvw.FechaRecepcion,
                        FechaCancelacion = solvw.FechaCancelacion,
                        EstatusID = solvw.EstatusID,
                        EstatusDes = solvw.EstatusDes,
                        Piezas = solvw.Piezas,
                        Descripcion = solvw.Descripcion,
                        OrdenID = solvw.OrdenID,
                        ReOrdenID = solvw.ReOrdenID,
                        RecepcionID = solvw.RecepcionID,
                        Recepcionado = solvw.Recepcionado,
                        Aprobado = solvw.Aprobado,
                        RecepcionParcialID = solvw.RecepcionParcialID,
                        DevolucionID = solvw.DevolucionID,
                        ProductoID = solvw.ProductoID,
                        EmpresaId = solvw.EmpresaId,
                        DetalleSolicitud = (await ConexionBD.database.QueryAsync<SolicitudDetalle_VW>("WHERE SolicitudID=@0", SolicitudID).ToArrayAsync())
                    });

                }
                ConexionBD.database.CompleteTransaction();
                await ConexionBD.Destroy();
                return Ok(solsDetalle);
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
