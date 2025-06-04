using System.Data.Common;
using System.Net;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;
using System.Diagnostics; //Método de Debugusing System.Text.Json;


using DBContext.DBConfia;
using DBContext.DBConfia.Bancos;
using DBContext.DBConfia.dbo;
using DBContext.DBConfia.Custom.Tesoreria;
using DBContext.DBConfia.Custom.Creditos;
using System.Net.Http;
using System.Collections.Generic;
using System.Text.Json;
using System.Collections;
using DBContext.DBConfia.Tesoreria;
using System.Data;
using DBContext.DBConfia.Seguridad;
using registraOrden;
using System.Text.RegularExpressions;
using System.Text;
using DBContext.DBConfia.STP;
using System.Globalization;
using System.IO;
using ConfiaWebApi.Code;
using iText.Layout.Renderer;
using DBContext.DBConfia.Creditos;
using ConfiaWebApi.PeticionesRest.Creditos.Reportes;
using System.Dynamic;
using NPoco;
using Newtonsoft.Json;
using ConfiaWebApi.ModlesSP.General;

namespace ConfiaWebApi.Controllers.Creditos
{
    [ApiController]
    [Route("api/Creditos/[controller]")]
    public class ReportesController : ControllerBase
    {
        private DBConfiaContext ConexionBD;

        /// <summary>
        /// Constructor del controlador
        /// </summary>
        /// <param name="_DBContext">Conexión de datos para el controlador</param>
        public ReportesController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        [HttpGet]
        [Route("GetReportesRapidos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetReportesRapidos()
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            var querys = await ConexionBD.database.QueryAsync<ConsultasReportes>("EXEC Sistema.pa_GetConsultasRapidas @0", UsuarioActual.UsuarioID).ToArrayAsync();
            return Ok(querys);
        }

        [HttpPost]
        [Route("GeneradorReportesRapidos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GeneradorReportesRapidos(ConfiaWebApi.PeticionesRest.Creditos.Reportes.GeneradorReportesRapidos parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());

                if (parData.Accion == 0)
                {

                    string queryGetModule = "SELECT Nombre FROM Sistema.ConsultasReportes WHERE Activo=1 and PantallaID=@0";
                    var moduleInfo = await ConexionBD.database.QueryAsync<GetReportesRapidos>(queryGetModule, parData.PantallaID).FirstAsync();

                    var componentList = await ConexionBD.database.QueryAsync<GetReportesRapidos>("EXEC Sistema.pa_GetConsultaReporte @PantallaID, @Accion", parData)
                        .ToArrayAsync();

                    var response0 = new
                    {
                        Componentes = componentList,
                        Modulo = moduleInfo
                    };
                    return Ok(response0);
                }
                else
                {
                    var getStoredP = new
                    {
                        Accion = parData.Accion,
                        PantallaID = parData.PantallaID
                    };
                    ConexionBD.database.CommandTimeout = 9999;
                    var storedP = await ConexionBD.database.QueryAsync<GetReportesRapidos>("EXEC Sistema.pa_GetConsultaReporte @PantallaID, @Accion", parData)
                        .FirstAsync();

                    var jsonArray = JsonDocument.Parse(parData.JsonData).RootElement.EnumerateObject();

                    var objs = new Dictionary<string, object>();

                    foreach (var prop in jsonArray)
                    {
                        objs[prop.Name] = prop.Value.ToString();

                        if (prop.Name == "UsuarioID")
                            objs[prop.Name] = UsuarioActual.UsuarioID;
                        if (prop.Name == "ProductoID" && prop.Value.ToString() == "")
                            objs[prop.Name] = ProductoID;

                    }


                    var res = await ConexionBD.database.QueryAsync<dynamic>(storedP.SQL, objs).ToArrayAsync();
                    await ConexionBD.Destroy();
                    return Ok(res);
                }
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(new
                {
                    message = ex.Message,
                    status = 0
                });
            }
        }

        [HttpPost]
        [Route("reporte1549")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Reporte1549(ConfiaWebApi.PeticionesRest.Creditos.Reportes.Reporte1549 parData)
        {
            try
            {
                var obj = new
                {
                    parData.DistribuidorID,
                    isGerente = parData.isGerente ? 1 : 0,
                    parData.ZonaID,
                    parData.SucursalID,
                    parData.ProductoID,
                    parData.GrupoID,
                };
                var stored = "EXEC Creditos.pa_Reporte1549_DistPagosVencimiento @DistribuidorID, @isGerente, @ZonaID, @SucursalID, @ProductoID, @GrupoID";
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.Reporte1549>(stored, obj).ToArrayAsync();
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
        [Route("tienditasComisiones")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ReporteTienditaComisiones(ConfiaWebApi.PeticionesRest.Creditos.Reportes.ReporteTienditaComisiones parData)
        {
            try
            {
                var obj = new
                {
                    fecha_ini = parData.FechaInicio,
                    fecha_fin = parData.FechaFin,
                };
                var stored = "EXEC pa_Tienditas_Reporte_Comisiones @fecha_ini, @fecha_fin";
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.ReporteTienditaComisionesRes>(stored, obj).ToArrayAsync();
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
        [Route("reporte1600")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Reporte1600(ConfiaWebApi.PeticionesRest.Creditos.Reportes.Reporte1600 parData)
        {
            try
            {
                var obj = new { parData.SucursalID };
                var stored = "EXEC Creditos.pa_Reporte1600_Convenios @SucursalID";
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.Reporte1600>(stored, obj).ToArrayAsync();
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
        [Route("reportependientecapital")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Reportependientecapital(ConfiaWebApi.PeticionesRest.Creditos.Reportes.Reportependientecapital parData)
        {
            try
            {
                var obj = new { Fecha = parData.FechaCapital };
                var stored = "EXEC Creditos.pa_CapitalPendienteAlDia @Fecha";
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.Reportependientecapital>(stored, obj).ToArrayAsync();
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
        [Route("reporte1549_2")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Reporte1549_2(ConfiaWebApi.PeticionesRest.Creditos.Reportes.Reporte1549_2 parData)
        {
            parData.FechaVencimiento = parData.FechaVencimiento.AddHours(-6);
            DateTime fechaVencimientoValidar = parData.FechaVencimiento;
            int day = fechaVencimientoValidar.Day;

            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            ConexionBD.database.CommandTimeout = 9999;
            try
            {
                var obj = new
                {
                    FechaVencimiento = parData.FechaVencimiento.ToString("dd/MM/yyyy"),
                    UsuarioActual.UsuarioID
                };
                if (day == 5)
                {
                    var stored = "EXEC Creditos.Distribucion_pago_por_vencimiento_2_1549 @FechaVencimiento, @UsuarioID";
                    var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.Reporte1549_RespuestaQuincena1>(stored, obj).ToArrayAsync();
                    await ConexionBD.Destroy();
                    return Ok(res);
                }
                else
                {
                    var stored = "EXEC Creditos.Distribucion_pago_por_vencimiento_2_1549 @FechaVencimiento, @UsuarioID";
                    var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.Reporte1549_RespuestaQuincena2>(stored, obj).ToArrayAsync();
                    await ConexionBD.Destroy();
                    return Ok(res);
                }
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("GlobalExe")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GlobalExe(ConfiaWebApi.PeticionesRest.Creditos.Reportes.Reporte1549_2 parData)
        {
            parData.FechaVencimiento = parData.FechaVencimiento.AddHours(-6);
            DateTime fechaVencimientoValidar = parData.FechaVencimiento;
            int day = fechaVencimientoValidar.Day;

            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            ConexionBD.database.CommandTimeout = 9999;
            try
            {

                var stored = "EXEC Creditos.Distribucion_pago_por_vencimiento_2_1549 @FechaVencimiento, @UsuarioID";
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.ReporteDetalle>(stored).ToArrayAsync();
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
        [Route("reporte1625_3")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> FNReporte1625_3(ConfiaWebApi.PeticionesRest.Creditos.Reportes.FNReporte1625_3 parData)
        {
            parData.FechaVencimiento = parData.FechaVencimiento.AddHours(-6);
            DateTime fechaVencimientoValidar = parData.FechaVencimiento;
            int day = fechaVencimientoValidar.Day;

            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            ConexionBD.database.CommandTimeout = 9999;
            try
            {
                var obj = new
                {
                    parData.FechaVencimiento,
                    UsuarioActual.UsuarioID
                };
                if (day == 5)
                {
                    var stored = "EXEC Creditos.Distribucion_pago_por_vencimiento_3_1625 @FechaVencimiento, @UsuarioID";
                    var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.Reporte1625_RespuestaQuincena1>(stored, obj).ToArrayAsync();
                    await ConexionBD.Destroy();
                    return Ok(res);
                }
                else
                {
                    var stored = "EXEC Creditos.Distribucion_pago_por_vencimiento_3_1625 @FechaVencimiento, @UsuarioID";
                    var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.Reporte1625_RespuestaQuincena2>(stored, obj).ToArrayAsync();
                    await ConexionBD.Destroy();
                    return Ok(res);
                }
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("UltimaActualizacion")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> UltimaActualizacion()
        {
            try
            {
                var stored = "EXEC Creditos.pa_UltimaActualizacion1625";
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.UltimaActualizacion>(stored).FirstOrDefaultAsync();

                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("UltimaActualizacionGlobal")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> UltimaActualizacionGlobal()
        {
            try
            {
                var stored = "EXEC Creditos.pa_UltimaActualizacionGlobal";
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.UltimaActualizacionGlobal>(stored).FirstOrDefaultAsync();

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
        [Route("reporteLineasCreditoDistribuidoras")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ReporteLineasCreditoDistribuidoras(ConfiaWebApi.PeticionesRest.Creditos.Reportes.ReporteLineasCreditoDistribuidorasResp parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario = @0", UserName).FirstOrDefaultAsync();
            try
            {
                var obj = new
                {
                    Usuario = UsuarioActual.UsuarioID
                };
                var stored = "EXEC Creditos.DistribuidoresLineaCredito @Usuario";
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.ReporteLineasCreditoDistribuidorasResp>(stored, obj).ToArrayAsync();
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
        [Route("reporte1495")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Reporte1495(ConfiaWebApi.PeticionesRest.Creditos.Reportes.Reporte1495 parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                parData.ProductoID = producto;

                var obj = new
                {
                    parData.SucursalID,
                    parData.ProductoID,
                    parData.FechaInicio,
                    parData.FechaFin
                };
                var stored = "EXEC Creditos.pa_Reporte1495 @SucursalID, @ProductoID, @FechaInicio, @FechaFin";
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.ResReporte1495>(stored, obj).ToArrayAsync();
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
        [Route("IndicadoresSociasPendientes")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> IndicadoresSociasPendientes(ConfiaWebApi.PeticionesRest.Creditos.Grupos.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                parData.ProductoID = producto;

                var obj = new
                {
                    parData.GrupoID,
                    parData.ProductoID,
                    parData.SucursalID,
                };
                var stored = "EXEC Creditos.pa_Indicadores_parte2  @GrupoID, @ProductoID, @SucursalID";
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.IndicadoresSociasPendientes>(stored, obj).ToArrayAsync();
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
        [Route("IndicadoresSociasLiquidadas")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> IndicadoresSociasLiquidadas(ConfiaWebApi.PeticionesRest.Creditos.Grupos.Get parData)
        {
            try
            {
                var obj = new
                {
                    parData.GrupoID,
                };
                var stored = "EXEC Creditos.pa_Indicadores_parte3  @GrupoID";
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.IndicadoresSociasPendientes>(stored, obj).ToArrayAsync();
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
        [Route("reporte1506")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Reporte1506(ConfiaWebApi.PeticionesRest.Creditos.Reportes.Reporte1549 parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario = @0", UserName).FirstOrDefaultAsync();

                var fechaobtener = parData.fechaCorte;
                var director = parData.DirectorID;
                var obj = new
                {
                    DirectorID = parData.DirectorID,
                    ZonaID = parData.ZonaID,
                    SucursalID = parData.SucursalID,
                    ProductoID = parData.ProductoID,
                    GrupoID = parData.GrupoID,
                    Fecha = fechaobtener.ToString("dd/MM/yyyy"), // en esta ocasion la fecha corte es para buscar desde esa fecha
                    tipoDias = parData.tipoDias,
                    CoordinadorID = parData.CoordinadorID,
                    JOB = 0,
                    UsuarioID = UsuarioActual.UsuarioID
                    //Fecha = parData.fechaCorte
                };
                var stored = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.Reporte1506>
                ("EXEC Creditos.pa_Reporte1506_CierreValesDist_v2 @DirectorID, @ZonaID, @SucursalID, @ProductoID, @GrupoID, @Fecha, @tipoDias, @CoordinadorID, @JOB, @UsuarioID", obj).ToArrayAsync();
                // var stored = "EXEC Creditos.pa_Reporte1506_CierreValesDist @ZonaID, @SucursalID, @ProductoID, @GrupoID, @tipoDias, @CoordinadorID";
                //var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.Reporte1506>(stored, obj).ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(stored);

            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }
        [HttpPost]
        [Route("reporte1625")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Reporte1625(ConfiaWebApi.PeticionesRest.Creditos.Reportes.Reporte1625 parData)
        {
            try
            {
                var fechaobtener = parData.fechaCorte;
                var obj = new
                {
                    DirectorID = parData.DirectorID,
                    ZonaID = parData.ZonaID,
                    SucursalID = parData.SucursalID,
                    ProductoID = parData.ProductoID,
                    GrupoID = parData.GrupoID,
                    Fecha = fechaobtener.ToString("dd/MM/yyyy"),
                    tipoDias = parData.tipoDias,
                    CoordinadorID = parData.CoordinadorID,
                };
                var stored = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.Reporte1625>
                ("EXEC Creditos.pa_Reporte1625_CierreValesDist_v2 @DirectorID, @ZonaID, @SucursalID, @ProductoID, @GrupoID, @Fecha, @tipoDias, @CoordinadorID", obj).ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(stored);

            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("gettipousuario")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetTipoUsuario(ConfiaWebApi.PeticionesRest.Creditos.Reportes.TipoUsuario parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                // UsuarioActual.UsuarioID = 270;

                var stored = "SELECT Creditos.GetTipoUsuario(@0) as [tipoUsuario]";
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.TipoUsuario>(stored, UsuarioActual.UsuarioID).FirstOrDefaultAsync();

                Int64 DirectorID = 0;
                var ZonaID = 0;
                var SucursalID = 0;
                var GrupoID = 0;
                switch (res.tipoUsuario)
                {
                    case 1:
                        var Director = await ConexionBD.database.QueryAsync<DBContext.DBConfia.General.Directores>("WHERE DirectorID = @0", UsuarioActual.PersonaID).FirstOrDefaultAsync();
                        ZonaID = (int)Director.ZonaID;
                        DirectorID = (int)Director.DirectorID;
                        break;
                    case 2:
                        var ZonaBD = await ConexionBD.database.QueryAsync<DBContext.DBConfia.General.Zonas>("WHERE PersonaResponsableID = @0", UsuarioActual.UsuarioID).FirstOrDefaultAsync();
                        var Dire1 = await ConexionBD.database.QueryAsync<DBContext.DBConfia.General.Directores>("WHERE DirectorID = @0", (int)ZonaBD.PersonaResponsableID).FirstOrDefaultAsync();
                        ZonaID = ZonaBD.ZonaID;
                        DirectorID = Dire1 != null ? Dire1.DirectorID : 0;
                        // DirectorID = (int)ZonaBD.PersonaResponsableID;
                        break;
                    case 3:
                        var GerenteDB = await ConexionBD.database.QueryAsync<DBContext.DBConfia.General.Gerentes>("WHERE UsuarioID = @0", UsuarioActual.UsuarioID).FirstOrDefaultAsync();
                        var SucursalBD2 = await ConexionBD.database.QueryAsync<DBContext.DBConfia.General.Sucursales>("WHERE SucursalID = @0", GerenteDB.SucursalID).FirstOrDefaultAsync();
                        var ZonaDB = await ConexionBD.database.QueryAsync<DBContext.DBConfia.General.Zonas>("WHERE ZonaID = @0", SucursalBD2.ZonaID).FirstOrDefaultAsync();
                        var Dire2 = await ConexionBD.database.QueryAsync<DBContext.DBConfia.General.Directores>("WHERE DirectorID = @0", (int)ZonaDB.PersonaResponsableID).FirstOrDefaultAsync();
                        SucursalID = GerenteDB.SucursalID;
                        ZonaID = SucursalBD2.ZonaID;
                        DirectorID = Dire2 != null ? Dire2.DirectorID : 0;
                        break;
                    case 4:
                        var CoordinadorDB = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Coordinadores>("WHERE CoordinadorID = @0", UsuarioActual.PersonaID).FirstOrDefaultAsync();
                        var SucursalCoordBD = await ConexionBD.database.QueryAsync<DBContext.DBConfia.General.Sucursales>("WHERE SucursalID = @0", CoordinadorDB.SucursalID).FirstOrDefaultAsync();
                        var ZonaCoordDB = await ConexionBD.database.QueryAsync<DBContext.DBConfia.General.Zonas>("WHERE ZonaID = @0", SucursalCoordBD.ZonaID).FirstOrDefaultAsync();
                        var GrupoIDDB = await ConexionBD.database.QueryAsync<Grupos>("WHERE CoordinadorID = @0", CoordinadorDB.CoordinadorID).FirstOrDefaultAsync();
                        var Dire3 = await ConexionBD.database.QueryAsync<DBContext.DBConfia.General.Directores>("WHERE DirectorID = @0", (int)ZonaCoordDB.PersonaResponsableID).FirstOrDefaultAsync();
                        SucursalID = CoordinadorDB.SucursalID;
                        ZonaID = SucursalCoordBD.ZonaID;
                        DirectorID = Dire3 != null ? Dire3.DirectorID : 0;
                        GrupoID = GrupoIDDB.GrupoID;
                        break;
                }

                await ConexionBD.Destroy();

                var obj = new
                {
                    UsuarioActual.UsuarioID,
                    res.tipoUsuario,
                    SucursalID,
                    ZonaID,
                    DirectorID,
                    GrupoID
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
        [Route("gettipousuarioRelaciones")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetTipoUsuarioRelaciones(ConfiaWebApi.PeticionesRest.Creditos.Reportes.TipoUsuarioRelaciones parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var stored = "SELECT Creditos.GetTipoUsuario(@0) as [tipoUsuario]";
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.TipoUsuarioRelaciones>(stored, UsuarioActual.UsuarioID).FirstOrDefaultAsync();

                var SucursalID = 0;
                var CoordinadorID = 0;
                var fechaCorte = "";

                switch (res.tipoUsuario)
                {
                    case 3:
                        var GerenteDB = await ConexionBD.database.QueryAsync<DBContext.DBConfia.General.Gerentes>("WHERE UsuarioID = @0", UsuarioActual.UsuarioID).FirstOrDefaultAsync();
                        var SucursalBD2 = await ConexionBD.database.QueryAsync<DBContext.DBConfia.General.Sucursales>("WHERE SucursalID = @0", GerenteDB.SucursalID).FirstOrDefaultAsync();
                        SucursalID = GerenteDB.SucursalID;
                        break;
                    case 4:
                        var CoordinadorDB = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Coordinadores_VW>("WHERE PersonaID = @0", UsuarioActual.PersonaID).FirstOrDefaultAsync();
                        var SucursalBD3 = await ConexionBD.database.QueryAsync<DBContext.DBConfia.General.Sucursales>("WHERE SucursalID = @0", CoordinadorDB.SucursalID).FirstOrDefaultAsync();
                        var relCortes = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Cortes.FechaCorte_VW>("WHERE (SucursalID = @0 OR @0 = 0) ORDER BY fecha DESC", CoordinadorDB.SucursalID).FirstOrDefaultAsync();

                        SucursalID = CoordinadorDB.SucursalID;
                        CoordinadorID = (int)CoordinadorDB.CoordinadorID;
                        fechaCorte = relCortes.fechaCorte;
                        break;
                }

                await ConexionBD.Destroy();

                var obj = new
                {
                    UsuarioActual.UsuarioID,
                    res.tipoUsuario,
                    SucursalID,
                    CoordinadorID,
                    fechaCorte,
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
        [Route("reporte191")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Reporte191(ConfiaWebApi.PeticionesRest.Creditos.Reportes.Reporte191 parData)
        {
            try
            {
                ConexionBD.database.CommandTimeout = 9999;
                // var obj = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Reporte191_VW>(" WHERE  (ProductoID = @ProductoID OR @ProductoID = 0) AND (SucursalID = @SucursalID OR " +
                //     "@SucursalID = 0) AND (ZonaID = @ZonaID OR " +
                //     "@ZonaID = 0) AND (DistribuidorID = @DistribuidorID OR " +
                //     "@DistribuidorID = 0) AND (GrupoID = @GrupoID OR " +
                //     "@GrupoID = 0) ORDER BY ZonaID", parData).ToArrayAsync();
                var obj = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.GetReporte191>
               ("EXEC Creditos.pa_Reporte191 @ProductoID,@SucursalID, @ZonaID, @DistribuidorID,  @GrupoID", parData).ToArrayAsync();

                await ConexionBD.Destroy();
                return Ok(obj);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("reporte221")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Reporte221(ConfiaWebApi.PeticionesRest.Creditos.Reportes.Reporte221 parData)
        {
            try
            {
                ConexionBD.database.CommandTimeout = 9999;


                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var obj = new
                {
                    UsuarioActual.UsuarioID,
                    FechaInicio = parData.FechaInicio?.Date,  
                    FechaFin = parData.FechaFin?.Date

                };
                var stored = "exec Creditos.pa_ObtenerNotasRapidasFinal @UsuarioID, @FechaInicio, @FechaFin";

                var res = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Reporte221_VW>(stored,obj ).ToArrayAsync();                                  
  
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
        [Route("obtenerDias")]
        [Authorize]
        [Code.TProteccionProducto]

        public async Task<IActionResult> ObtenerDias(PeticionesRest.Creditos.Reportes.Dia parData)
        {
            try
            {
                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());

                parData.ProductoID = ProductoID;

                var productoPrincipal = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Productos>("WHERE ProductoID=@0", parData.ProductoID).SingleOrDefaultAsync();
                parData.EmpresaId = productoPrincipal.EmpresaId;


                var detalles = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Reporte314_VW>("WHERE  (ProductoID = @ProductoID OR @ProductoID = 0) AND (EmpresaId = @EmpresaId OR " +
                    "@EmpresaId = 0) AND (DistribuidorID = @DistribuidorID OR " +
                    "@DistribuidorID = 0) GROUP BY DiaID", parData).ToArrayAsync();

                await ConexionBD.Destroy();
                return Ok(detalles);

            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("getGlobalNew")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getGlobalNew()
        {

            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();


            try
            {

                var obj = new
                {
                    UsuarioID = UsuarioActual.UsuarioID

                };
                var stored = "EXEC Creditos.pa_GetGlobalNuevo @UsuarioID";
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.GlobalNuevo>(stored, obj).ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpGet]
        [Route("getGlobalNewGestoria")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getGlobalNewGestoria()
        {

            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();


            try
            {

                var obj = new
                {
                    UsuarioID = UsuarioActual.UsuarioID

                };
                var stored = "EXEC Creditos.pa_GetGlobalGestoria @UsuarioID";
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.GlobalNuevo>(stored, obj).ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }



        [HttpPost]
        [Route("getbyfiltroDetalle")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getbyfiltrosPersonal(PeticionesRest.Creditos.Reportes.Reporte314 parData)
        {
            int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());

            parData.ProductoID = ProductoID;
            var productoPrincipal = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Productos>("WHERE ProductoID=@0", parData.ProductoID).SingleOrDefaultAsync();
            parData.EmpresaId = productoPrincipal.EmpresaId;

            try
            {

                var obj = new
                {
                    DistribuidorID = parData.DistribuidorID,
                    ProductoID = parData.ProductoID,
                    EmpresaId = parData.EmpresaId,
                    DiaID = parData.DiaID,
                    MesID = parData.MesID,
                    AID = parData.AID,

                };
                var stored = "EXEC Creditos.pa_Reporte314_DetallesRelacion @DistribuidorID, @ProductoID, @EmpresaId, @DiaID, @MesID, @AID";
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.Reporte314>(stored, obj).ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }


        [HttpPost]
        [Route("reporte194")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Reporte194(PeticionesRest.Creditos.Reportes.Reporte194 parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new
                {
                    FechaInicial = parData.FechaInicio.ToString("dd/MM/yyyy"),
                    FechaFinal = parData.FechaFin.ToString("dd/MM/yyyy"),
                    Usuario = UsuarioActual.UsuarioID,
                    parData.SucursalID
                };
                var stored = "EXEC Creditos.Vales_Desembolsados_Entre_Dos_Fechas_194 @FechaInicial, @FechaFinal, @Usuario, @SucursalID";
                var res = await ConexionBD.database.QueryAsync<PeticionesRest.Creditos.Reportes.resReporte194>(stored, obj).ToArrayAsync();
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
        [Route("reporteCreditosTiendita")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ReporteCreditosTiendita(PeticionesRest.Creditos.Reportes.ReporteCreditosTiendita parData)
        {
            try
            {

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var obj = new
                {
                    FechaVencimiento = parData.FechaVencimiento.ToString("dd/MM/yyyy"),
                    Usuario = UsuarioActual.UsuarioID
                };

                var stored = "EXEC Creditos.pa_ReporteCreditoTiendita @FechaVencimiento, @Usuario";
                var res = await ConexionBD.database.QueryAsync<PeticionesRest.Creditos.Reportes.resReporteCreditosTiendita>(stored, obj).ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}