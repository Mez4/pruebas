using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Aclaraciones;
using DBContext.DBConfia.General;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using System.Net;
using System.IO;
using ConfiaWebApi.Code;
using Microsoft.Extensions.Configuration;
using ConfiaWebApi.PeticionesRest.Prospeccion.Documentos;
using DBContext.DBConfia.Seguridad;
using System.Collections;
using System.Collections.Generic;

namespace ConfiaWebApi.Controllers.Sistema

{
    // [Authorize]
    [ApiController]
    [Route("api/Aclaraciones/[controller]")]
    public class AclaracionController : ControllerBase
    {

        private DBConfiaContext DBContext;
        private IConfiguration Configuracion;

        /// <summary>
        /// Constructor del controlador
        /// </summary>
        /// <param name="_DBContext">Conexión de datos para el controlador</param>
        public AclaracionController(IConfiguration _Configuration, DBConfiaContext _DBContext)
        {
            this.Configuracion = _Configuration;

            DBContext = _DBContext;
        }

        [HttpGet]
        [Route("esEncargado")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> validaEncargado()
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                if (UsuarioActual.MasterUser)
                {
                    return StatusCode(200, new
                    {
                        PuedeAsignar = true,
                    });
                }
                else
                {
                    var encargadoAnalistas = await DBContext.database.QueryAsync<DBContext.DBConfia.Aclaraciones.Encargados>("WHERE EncargadoID=@0", UsuarioActual.PersonaID).ToListAsync();
                    var analista = await DBContext.database.QueryAsync<DBContext.DBConfia.Aclaraciones.Analistas>("WHERE AnalistaID=@0", UsuarioActual.PersonaID).FirstOrDefaultAsync();
                    if (encargadoAnalistas != null)
                    {
                        return StatusCode(200, new
                        {
                            PuedeAsignar = true,
                        });
                    }
                    else
                    {
                        return StatusCode(200, new
                        {
                            PuedeAsignar = false,
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
        [HttpGet]
        [Route("obtenerSucursalesSelect")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get()
        {
            try
            {
                var sucursales = await DBContext.database.FetchAsync<Sucursales_VW>();
                await DBContext.Destroy();
                return Ok(sucursales);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("obtenerEstatusAclaracion")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> obtenerEstatusAclaracion()
        {
            try
            {
                var _estatusAclaracion = await DBContext.database.FetchAsync<DBContext.DBConfia.Aclaraciones.Estatus>();
                await DBContext.Destroy();
                return Ok(_estatusAclaracion);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("actualizarEstatusAclaracion")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> actualizarEstatu(ConfiaWebApi.PeticionesRest.Aclaraciones.Aclaracion.ActualizarAclaracion parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            try
            {

                var _estatusAclaracion = await DBContext.database.QueryAsync<DBContext.DBConfia.Aclaraciones.Aclaraciones>("WHERE AclaracionID=@0", parData.AclaracionID).SingleOrDefaultAsync();
                _estatusAclaracion.EstatusID = parData.EstatusID;
                await DBContext.database.UpdateAsync(_estatusAclaracion);

                var final = await DBContext.database.QueryAsync<DBContext.DBConfia.Aclaraciones.Aclaraciones>("WHERE AclaracionID=@0", parData.AclaracionID).SingleOrDefaultAsync();

                if (final.FechaFinalizacionSolicitud == null)
                {
                    final.FechaFinalizacionSolicitud = DateTime.Now;
                    //Diferencia de tiempo
                    TimeSpan? duration = final.FechaFinalizacionSolicitud - final.FechaInicioAsignacion;

                    if (duration.HasValue)
                    {
                        final.TiempoTotalSolicitud = (int)duration.Value.TotalMinutes;
                    }

                    await DBContext.database.UpdateAsync(final);
                }

                var _aclaracionVista = await DBContext.database.QueryAsync<DBContext.DBConfia.Aclaraciones.Aclaracion_VW>("WHERE AclaracionID=@0", parData.AclaracionID).SingleOrDefaultAsync();
                var movbitacora = new DBContext.DBConfia.Aclaraciones.Bitacora()
                {
                    AclaracionID = parData.AclaracionID,
                    Modifico = UsuarioActual.NombreCompleto,
                    Fecha = DateTime.Now,
                    TipoMovimientoID = "2"
                };
                await DBContext.database.InsertAsync(movbitacora);

                var movbitacorafinacl = new DBContext.DBConfia.Aclaraciones.Bitacora()
                {
                    AclaracionID = parData.AclaracionID,
                    Modifico = UsuarioActual.NombreCompleto,
                    Fecha = DateTime.Now,
                    TipoMovimientoID = "6"
                };
                await DBContext.database.InsertAsync(movbitacorafinacl);
                await DBContext.Destroy();

                await DBContext.Destroy();
                return Ok(_aclaracionVista);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("asignarAclaracion")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> asignarSolicitud(ConfiaWebApi.PeticionesRest.Aclaraciones.Aclaracion.AsignarAnalista parData)
        {

            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            try
            {
                var aclaracionAsignar = await DBContext.database.QueryAsync<DBContext.DBConfia.Aclaraciones.Aclaraciones>("WHERE AclaracionID = @0", parData.AclaracionID).SingleOrDefaultAsync();
                if (aclaracionAsignar != null)
                {
                    aclaracionAsignar.FechaInicioAsignacion = DateTime.Now;
                    aclaracionAsignar.AnalistaID = parData.AnalistaID;
                    await DBContext.database.UpdateAsync(aclaracionAsignar);
                    var getMensajes = await DBContext.database.FetchAsync<DBContext.DBConfia.Aclaraciones.LogMensajes>("WHERE AclaracionID = @0", parData.AclaracionID);
                    var T = await DBContext.database.QueryAsync<DBContext.DBConfia.Aclaraciones.Aclaracion_VW>("WHERE AclaracionID = @0", parData.AclaracionID).SingleOrDefaultAsync();
                    var objetoPersonalizado = (new
                    {
                        AclaracionID = T.AclaracionID,
                        DistribuidorID = T.DistribuidorID,
                        Distribuidor = T.NombreDistribuidor,
                        SucursalID = T.SucursalID,
                        NombreSucursal = T.NombreSucursal,
                        FechaCaptura = T.FechaCaptura,
                        FechaAsignacion = T.FechaAsignacion,
                        DescTipoSolicitud = T.DescTipoSolicitud,
                        AnalistaNombre = T.NombreAnalista,
                        AnalistaID = T.AnalistaID,
                        MensajesSinLeer = (getMensajes.Where(c => c.Leido == false && c.AclaracionID == T.AclaracionID && c.EnviadoDesdePantalla == true).Count() > 0) ? true : false,
                        CantidadMensajesSinLeer = getMensajes.Where(c => c.Leido == false && c.AclaracionID == T.AclaracionID && c.EnviadoDesdePantalla == true).Count(),
                        Evidencias = (await DBContext.database.QueryAsync<DBContext.DBConfia.Aclaraciones.DocumentosAclaracion>("WHERE AclaracionID=@0", T.AclaracionID).ToArrayAsync())
                    });
                    var movbitacora = new DBContext.DBConfia.Aclaraciones.Bitacora()
                    {
                        AclaracionID = parData.AclaracionID,
                        Modifico = UsuarioActual.NombreCompleto,
                        Fecha = DateTime.Now,
                        TipoMovimientoID = "1"
                    };
                    await DBContext.database.InsertAsync(movbitacora);
                    await DBContext.Destroy();


                    return Ok(objetoPersonalizado);
                }

                await DBContext.Destroy();
                return Ok();
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("readMensajes")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> readMensajes(ConfiaWebApi.PeticionesRest.Aclaraciones.Aclaracion.LeerMensajes parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            if (UsuarioActual.MasterUser == false)
            {
                var Analista = await DBContext.database.QueryAsync<DBContext.DBConfia.Aclaraciones.Aclaracion_VW>("WHERE AclaracionID = @0", parData.AclaracionID).FirstOrDefaultAsync();
                if (Analista == null)
                {
                    return Ok("NULL");
                }
                if (Analista.AnalistaID > 0)
                {
                    try
                    {
                        var mensajesxLeer = await DBContext.database.QueryAsync<DBContext.DBConfia.Aclaraciones.LogMensajes>("WHERE AclaracionID = @0 AND EnviadoDesdePantalla = @1", parData.AclaracionID, parData.EnviadoDesdePantalla).ToArrayAsync();
                        foreach (var mensaje in mensajesxLeer)
                        {
                            mensaje.Leido = true;
                            await DBContext.database.UpdateAsync(mensaje);
                        }
                        var Inicio = await DBContext.database.QueryAsync<DBContext.DBConfia.Aclaraciones.Aclaraciones>("WHERE AclaracionID = @0", parData.AclaracionID).FirstOrDefaultAsync();
                        if (Inicio.FechaAperturaSolicitud == null)
                        {
                            Inicio.FechaAperturaSolicitud = DateTime.Now;
                            await DBContext.database.UpdateAsync(Inicio);

                            var movbitacorainicioacl = new DBContext.DBConfia.Aclaraciones.Bitacora()
                            {
                                AclaracionID = parData.AclaracionID,
                                Modifico = UsuarioActual.NombreCompleto,
                                Fecha = DateTime.Now,
                                TipoMovimientoID = "5"
                            };
                            await DBContext.database.InsertAsync(movbitacorainicioacl);
                        }

                        var T = await DBContext.database.QueryAsync<DBContext.DBConfia.Aclaraciones.Aclaracion_VW>("WHERE AclaracionID = @0", parData.AclaracionID).FirstOrDefaultAsync();
                        ArrayList res2 = new ArrayList();


                        if (T != null)
                        {
                            res2.Add(new
                            {
                                AclaracionID = T.AclaracionID,
                                DistribuidorID = T.DistribuidorID,
                                Distribuidor = T.NombreDistribuidor,
                                SucursalID = T.SucursalID,
                                NombreSucursal = T.NombreSucursal,
                                FechaCaptura = T.FechaCaptura,
                                FechaAsignacion = T.FechaAsignacion,
                                DescTipoSolicitud = T.DescTipoSolicitud,
                                AnalistaNombre = T.NombreAnalista,
                                AnalistaID = T.AnalistaID,
                                MensajesSinLeer = false,
                                CantidadMensajesSinLeer = 0,
                                Evidencias = (await DBContext.database.QueryAsync<DBContext.DBConfia.Aclaraciones.DocumentosAclaracion>("WHERE AclaracionID=@0", T.AclaracionID).ToArrayAsync())
                            });
                        };
                        await DBContext.Destroy();
                        return Ok(res2);
                    }
                    catch (Exception ex)
                    {
                        await DBContext.Destroy();
                        return BadRequest(ex.Message);
                    }
                }
                return Ok();
            }
            else
            {
                return Ok("ENTRA AL MASTER USER");

            }
        }


        [HttpPost]
        [Route("getMensajes")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getMensajes(ConfiaWebApi.PeticionesRest.Aclaraciones.Aclaracion.ObtenerMensajes parData)
        {
            try
            {
                DBContext.database.BeginTransaction();
                var res = await DBContext.database.QueryAsync<LogMensajes_VW>("WHERE AclaracionID = @0", parData.AclaracionID).ToArrayAsync();
                ArrayList res2 = new();
                foreach (var T in res)
                {
                    res2.Add(new
                    {
                        T.AclaracionID,
                        T.DescripcionAclaracion,
                        T.EnviadoDesdePantalla,
                        T.Fecha_hora,
                        T.Leido,
                        T.LogMensajeID,
                        MensajerSinLeer = (res.Where(x => x.Leido == true).ToArray()).Count() > 0 ? true : false
                    });
                }
                DBContext.database.CompleteTransaction();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                DBContext.database.AbortTransaction();
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }
        [HttpPost]
        [Route("consultaBitacora")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> consultaBitacora(ConfiaWebApi.PeticionesRest.Aclaraciones.Aclaracion.Filtros parData)
        {
            try
            {
                var res = await DBContext.database.FetchAsync<DBContext.DBConfia.Aclaraciones.Bitacora_VW>("WHERE ((Fecha >= @FechaInicio OR @FechaInicio IS NULL) AND (Fecha <= @FechaFin OR @FechaFin IS NULL) AND (TipoMovimientoID = @TipoMovimientoID OR " +
                         "@TipoMovimientoID = NULL)) ", parData);
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("sendMensaje")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> sendMensaje(ConfiaWebApi.PeticionesRest.Aclaraciones.Aclaracion.EnviarMensajes parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            try
            {
                var mensajeNuevo = new DBContext.DBConfia.Aclaraciones.LogMensajes();
                mensajeNuevo.AclaracionID = parData.AclaracionID;
                mensajeNuevo.EnviadoDesdePantalla = parData.EnviadoDesdePantalla;
                mensajeNuevo.Mensaje = parData.Mensaje;
                mensajeNuevo.Fecha_hora = DateTime.Now;
                mensajeNuevo.Leido = false;
                await DBContext.database.InsertAsync(mensajeNuevo);

                var movbitacora = new DBContext.DBConfia.Aclaraciones.Bitacora()
                {
                    AclaracionID = parData.AclaracionID,
                    Modifico = UsuarioActual.NombreCompleto,
                    Fecha = DateTime.Now,
                    TipoMovimientoID = "3"
                };
                await DBContext.database.InsertAsync(movbitacora);
                await DBContext.Destroy();

                await DBContext.Destroy();
                return Ok();
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpGet]
        [Route("obtenerProductos/{personaID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getProductos(int personaID)
        {
            try
            {
                var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Aclaraciones.ProductosDistribuidoraPrincipal_VW>("WHERE DistribuidorID = @0", personaID).ToArrayAsync();
                await DBContext.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }

        }

        [Authorize]
        [HttpPost]
        [Route("show")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerAsyncrono(PeticionesRest.Aclaraciones.Analistas.BusquedaAnalista parData)
        {
            parData.Nombre += "%";
            var tiposMovs = await DBContext.database.QueryAsync<DBContext.DBConfia.General.Personas_VW>("WHERE NombreCompleto LIKE @0", parData.Nombre).ToArrayAsync();
            try
            {
                var result = tiposMovs.Select(c => new
                {
                    PersonaID = c.PersonaID,
                    NombreCompleto = c.NombreCompleto,
                }).ToArray();
                await DBContext.Destroy();
                return Ok(result);
            }
            catch (Exception error)
            {
                await DBContext.Destroy();
                return BadRequest(error.Message);
            }
        }

        [Authorize]
        [HttpPost]
        [Route("obtenerMesas")]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerMesas()
        {
            try
            {
                var mesasDeAclaracion = await DBContext.database.FetchAsync<DBContext.DBConfia.Aclaraciones.MesaAclaracion_VW>();
                await DBContext.Destroy();
                return Ok(mesasDeAclaracion);
            }

            catch (Exception error)
            {
                await DBContext.Destroy();
                return BadRequest(error.Message);
            }
        }

        [Authorize]
        [HttpPost]
        [Route("showSucursal")]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerAsyncrono(PeticionesRest.Aclaraciones.Aclaracion.BusquedaSucursal parData)
        {
            parData.Nombre += "%";
            var tiposMovs = await DBContext.database.QueryAsync<DBContext.DBConfia.General.Sucursales_VW>("WHERE Nombre LIKE @0", parData.Nombre).ToArrayAsync();
            try
            {
                var result = tiposMovs.Select(c => new
                {
                    SucursalID = c.SucursalID,
                    Nombre = c.Nombre,
                }).ToArray();
                await DBContext.Destroy();
                return Ok(result);
            }
            catch (Exception error)
            {
                await DBContext.Destroy();
                return BadRequest(error.Message);
            }
        }

        [HttpGet]
        [Route("getAclaracionPersona/{personaID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getDatosancariosPgetAclaracionPersonaersona(int personaID)
        {
            try
            {
                var res = await DBContext.database.FetchAsync<Aclaracion_VW>("WHERE DistribuidorID = @0", personaID);
                ArrayList res2 = new ArrayList();
                foreach (var T in res)
                {
                    var getMensajes = await DBContext.database.FetchAsync<DBContext.DBConfia.Aclaraciones.LogMensajes>("WHERE AclaracionID = @0", T.AclaracionID);
                    res2.Add(new
                    {
                        T.AclaracionID,
                        T.FechaCaptura,
                        T.SucursalID,
                        T.NombreSucursal,
                        T.DistribuidorID,
                        T.NombreDistribuidor,
                        T.CreditoID,
                        T.DescripcionAclaracion,
                        T.EstatusID,
                        T.ClaveEstatus,
                        T.DescripcionEstatus,
                        T.NotasTesoreria,
                        T.Observaciones,
                        T.MesaAclaracionID,
                        T.BonificacionID,
                        T.PorcentajeBonificacion,
                        T.SolicitaID,
                        T.NombreAnalista,
                        T.FechaAsignacion,
                        T.AnalistaID,
                        T.GerenteID,
                        T.NombreGerente,
                        T.Asiganada,
                        T.ProductoID,
                        T.Producto,
                        T.ClaveSolicitud,
                        T.DescTipoSolicitud,
                        MensajesSinLeer = (getMensajes.Where(c => c.Leido == false && c.AclaracionID == T.AclaracionID && c.EnviadoDesdePantalla == false).Count() > 0) ? true : false,
                        CantidadMensajesSinLeer = getMensajes.Where(c => c.Leido == false && c.AclaracionID == T.AclaracionID && c.EnviadoDesdePantalla == false).Count(),


                    });

                }
                await DBContext.Destroy();
                return Ok(res2);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpGet]
        [Route("obtenerAclaracion")]
        [Authorize]
        [Code.TProteccionProducto]
        // [Code.TProteccionProducto]
        public async Task<IActionResult> GetAclaracion()
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var encargado = await DBContext.database.QueryAsync<DBContext.DBConfia.Aclaraciones.Encargados>("WHERE EncargadoID = @0", UsuarioActual.PersonaID).FirstOrDefaultAsync();
                var analista = await DBContext.database.QueryAsync<DBContext.DBConfia.Aclaraciones.Analistas>("WHERE AnalistaID = @0", UsuarioActual.PersonaID).FirstOrDefaultAsync();

                if (UsuarioActual.MasterUser)
                {
                    var aclaracion = await DBContext.database.FetchAsync<DBContext.DBConfia.Aclaraciones.Aclaracion_VW>();
                    ArrayList res = new();
                    foreach (var T in aclaracion)
                    {
                        var getMensajes = await DBContext.database.FetchAsync<DBContext.DBConfia.Aclaraciones.LogMensajes>("WHERE AclaracionID = @0", T.AclaracionID);
                        res.Add(new
                        {
                            AclaracionID = T.AclaracionID,
                            DistribuidorID = T.DistribuidorID,
                            Distribuidor = T.NombreDistribuidor,
                            SucursalID = T.SucursalID,
                            NombreSucursal = T.NombreSucursal,
                            FechaCaptura = T.FechaCaptura,
                            FechaAsignacion = T.FechaAsignacion,
                            DescTipoSolicitud = T.DescTipoSolicitud,
                            AnalistaNombre = T.NombreAnalista,
                            TiempoTotalSolicitud = T.TiempoTotalSolicitud,
                            FechaInicioAsignacion = T.FechaInicioAsignacion,
                            AnalistaID = T.AnalistaID,
                            ClaveEstatus = T.ClaveEstatus,
                            DescripcionEstatus = T.DescripcionEstatus,
                            EstatusID = T.EstatusID,
                            MensajesSinLeer = (getMensajes.Where(c => c.Leido == false && c.AclaracionID == T.AclaracionID && c.EnviadoDesdePantalla == true).Count() > 0) ? true : false,
                            CantidadMensajesSinLeer = getMensajes.Where(c => c.Leido == false && c.AclaracionID == T.AclaracionID && c.EnviadoDesdePantalla == true).Count(),
                            Evidencias = (await DBContext.database.QueryAsync<DBContext.DBConfia.Aclaraciones.DocumentosAclaracion>("WHERE AclaracionID=@0", T.AclaracionID).ToArrayAsync())
                        });

                    }
                    await DBContext.Destroy();
                    return Ok(res);
                }
                else if (encargado != null)
                {
                    var aclaracion = await DBContext.database.FetchAsync<DBContext.DBConfia.Aclaraciones.Aclaracion_VW>();
                    ArrayList res = new();
                    foreach (var T in aclaracion)
                    {
                        var getMensajes = await DBContext.database.FetchAsync<DBContext.DBConfia.Aclaraciones.LogMensajes>("WHERE AclaracionID = @0", T.AclaracionID);
                        res.Add(new
                        {
                            AclaracionID = T.AclaracionID,
                            DistribuidorID = T.DistribuidorID,
                            Distribuidor = T.NombreDistribuidor,
                            SucursalID = T.SucursalID,
                            NombreSucursal = T.NombreSucursal,
                            FechaCaptura = T.FechaCaptura,
                            FechaAsignacion = T.FechaAsignacion,
                            DescTipoSolicitud = T.DescTipoSolicitud,
                            AnalistaNombre = T.NombreAnalista,
                            AnalistaID = T.AnalistaID,
                            ClaveEstatus = T.ClaveEstatus,
                            DescripcionEstatus = T.DescripcionEstatus,
                            EstatusID = T.EstatusID,
                            MensajesSinLeer = (getMensajes.Where(c => c.Leido == false && c.AclaracionID == T.AclaracionID && c.EnviadoDesdePantalla == true).Count() > 0) ? true : false,
                            CantidadMensajesSinLeer = getMensajes.Where(c => c.Leido == false && c.AclaracionID == T.AclaracionID && c.EnviadoDesdePantalla == true).Count(),
                            Evidencias = (await DBContext.database.QueryAsync<DBContext.DBConfia.Aclaraciones.DocumentosAclaracion>("WHERE AclaracionID=@0", T.AclaracionID).ToArrayAsync())
                        });

                    }
                    await DBContext.Destroy();
                    return Ok(res);
                }
                else if (analista != null)
                {
                    var aclaracion = await DBContext.database.QueryAsync<DBContext.DBConfia.Aclaraciones.Aclaracion_VW>("WHERE AnalistaID = @0", analista.AnalistaID).ToArrayAsync();
                    ArrayList res = new();
                    foreach (var T in aclaracion)
                    {
                        var getMensajes = await DBContext.database.FetchAsync<DBContext.DBConfia.Aclaraciones.LogMensajes>("WHERE AclaracionID = @0", T.AclaracionID);
                        res.Add(new
                        {
                            AclaracionID = T.AclaracionID,
                            DistribuidorID = T.DistribuidorID,
                            Distribuidor = T.NombreDistribuidor,
                            SucursalID = T.SucursalID,
                            NombreSucursal = T.NombreSucursal,
                            FechaCaptura = T.FechaCaptura,
                            FechaAsignacion = T.FechaAsignacion,
                            DescTipoSolicitud = T.DescTipoSolicitud,
                            AnalistaNombre = T.NombreAnalista,
                            AnalistaID = T.AnalistaID,
                            ClaveEstatus = T.ClaveEstatus,
                            DescripcionEstatus = T.DescripcionEstatus,
                            EstatusID = T.EstatusID,
                            MensajesSinLeer = (getMensajes.Where(c => c.Leido == false && c.AclaracionID == T.AclaracionID && c.EnviadoDesdePantalla == true).Count() > 0) ? true : false,
                            CantidadMensajesSinLeer = getMensajes.Where(c => c.Leido == false && c.AclaracionID == T.AclaracionID && c.EnviadoDesdePantalla == true).Count(),
                            Evidencias = (await DBContext.database.QueryAsync<DBContext.DBConfia.Aclaraciones.DocumentosAclaracion>("WHERE AclaracionID=@0", T.AclaracionID).ToArrayAsync())
                        });

                    }
                    await DBContext.Destroy();
                    return Ok(res);
                }
                else
                {
                    await DBContext.Destroy();
                    return StatusCode(200, new
                    {
                        mensajePeticion = "No cuentas con los permisos necesarios.",
                    });
                }


            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("actualizaAclaracion")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Actualizar(PeticionesRest.Aclaraciones.Aclaracion.ActualizarAclaracion pardata)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var aclaracion = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Aclaraciones.Aclaraciones>(pardata.AclaracionID);
                if (aclaracion != null)
                {
                    aclaracion.FechaCaptura = DateTime.Now;
                    aclaracion.SucursalID = pardata.SucursalID;
                    aclaracion.DistribuidorID = pardata.DistribuidorID;
                    aclaracion.CreditoID = pardata.CreditoID;
                    aclaracion.DescripcionAclaracion = pardata.DescripcionAclaracion;
                    aclaracion.EstatusID = pardata.EstatusID;
                    aclaracion.NotasTesoreria = pardata.NotasTesoreria;
                    aclaracion.Observaciones = pardata.Observaciones;
                    aclaracion.DocumentoID = pardata.DocumentoID;
                    aclaracion.MesaAclaracionID = pardata.MesaAclaracionID;
                    aclaracion.BonificacionID = pardata.BonificacionID; //Bonificacion
                    aclaracion.SolicitaID = pardata.SolicitaID;
                    aclaracion.GerenteID = pardata.GerenteID;
                    aclaracion.FechaAsignacion = DateTime.Now;
                    await DBContext.database.UpdateAsync(aclaracion);
                    var objeto = await DBContext.database.QueryAsync<DBContext.DBConfia.Aclaraciones.Aclaracion_VW>("WHERE AclaracionID = @0", aclaracion.AclaracionID).SingleOrDefaultAsync();
                    await DBContext.Destroy();
                    return Ok(objeto);
                }
                else
                {
                    await DBContext.Destroy();
                    return BadRequest("No se encontro el tipo de solicitud");
                }
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("altaAclaracion")]
        [Authorize]
        public async Task<IActionResult> Alta(PeticionesRest.Aclaraciones.Aclaracion.AltaAclaracion pardata)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var aclaracion = new DBContext.DBConfia.Aclaraciones.Aclaraciones();
                aclaracion.TipoSolicitudID = pardata.TipoSolicitudID;
                aclaracion.FechaCaptura = DateTime.Now;
                aclaracion.SucursalID = pardata.SucursalID;
                aclaracion.ProductoID = pardata.ProductoID;
                aclaracion.DistribuidorID = pardata.DistribuidorID;
                aclaracion.DescripcionAclaracion = pardata.DescripcionAclaracion;
                aclaracion.EstatusID = 1;
                aclaracion.NotasTesoreria = pardata.NotasTesoreria;
                aclaracion.Observaciones = pardata.Observaciones;
                aclaracion.DocumentoID = pardata.DocumentoID;
                aclaracion.BonificacionID = pardata.BonificacionID; //Bonificacion
                aclaracion.SolicitaID = pardata.SolicitaID;
                var analistaOperandoSucursal = await DBContext.database.QueryAsync<DBContext.DBConfia.Aclaraciones.AnalistasSucursales>("WHERE SucursalID=@0", pardata.SucursalID).SingleOrDefaultAsync();
                if (analistaOperandoSucursal != null)
                {
                    aclaracion.AnalistaID = analistaOperandoSucursal.AnalistaID;
                    aclaracion.FechaAsignacion = DateTime.Now;
                }
                aclaracion.GerenteID = pardata.GerenteID;
                await DBContext.database.InsertAsync(aclaracion);
                var objeto = await DBContext.database.QueryAsync<DBContext.DBConfia.Aclaraciones.Aclaracion_VW>("WHERE AclaracionID = @0", aclaracion.AclaracionID).SingleOrDefaultAsync();
                await DBContext.Destroy();
                return Ok(objeto);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        /*****************************************************************************************************************/
        /*                      OBTENER EVIDENCIA                     */
        [HttpPost]
        [Route("getEvidencia")]
        // [Code.TProteccionProducto]
        public async Task<IActionResult> GetEvidencia(ConfiaWebApi.PeticionesRest.Aclaraciones.Aclaracion.GetEvidencia parData)
        {
            var transaccion = false;
            try
            {
                var src = "";
                var srcBC = "";
                var Documento = await DBContext.database.QueryAsync<DocumentosAclaracion>("WHERE Firmado = 1 AND AclaracionID=@0 AND DocumentoID=@1", parData.DocumentoID, parData.AclaracionID).SingleOrDefaultAsync();

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
                        DBContext.database.BeginTransaction();
                        transaccion = true;
                        var res = new
                        {
                            res = 2,
                            msj = $"Consulta correcta del documento {parData.DocumentoID}",
                            src = $"{srcBC}"
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
        /************************************SUBIR EVIDENCIA************************************************/
        [Consumes("multipart/form-data")]
        [HttpPost]
        [Route("subirEvidencia")]
        // [Code.TProteccionProducto]
        public async Task<IActionResult> UpdateEvidencia([FromForm] ConfiaWebApi.PeticionesRest.Aclaraciones.Aclaracion.UploadFiles parData)
        {
            try
            {

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                var basicToken = Convert.ToBase64String(plainTextBytes);
                string path = $"{Configuracion["BucketApi:AwsPath_Aclaraciones"]}/A{parData.AclaracionID}";
                var ext = Path.GetExtension(parData.doc.FileName);
                string file_name = $"{parData.AclaracionID}_{DateTime.Now.ToString("dd_MM_yyyy_hh_mm_ss")}{ext}";
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
                        var Documento = new DocumentosAclaracion();
                        Documento.Ruta = $"{path}/{file_name}";
                        Documento.Firmado = true;
                        Documento.AclaracionID = parData.AclaracionID;
                        await DBContext.database.InsertAsync(Documento);
                    }
                    else
                    {
                        await DBContext.Destroy();
                        return BadRequest(response.StatusCode);
                    }
                }
                await DBContext.Destroy();
                return Ok();
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}