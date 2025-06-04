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

namespace ConfiaWebApi.Controllers.Creditos
{
    [ApiController]
    [Route("api/AppGestion/[controller]")]
    public class AppReportesController : ControllerBase
    {
        private DBConfiaContext ConexionBD;

        /// <summary>
        /// Constructor del controlador
        /// </summary>
        /// <param name="_DBContext">Conexión de datos para el controlador</param>
        public AppReportesController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        [HttpPost]
        [Route("reporte1549")]
        [Authorize]
        //[Code.TProteccionProducto]
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
                var data = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.Reporte1549>(stored, obj).ToArrayAsync();
                await ConexionBD.Destroy();

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }
        }

        [HttpPost]
        [Route("IndicadoresSociasPendientes")]
        [Authorize]
        //[Code.TProteccionProducto]
        public async Task<IActionResult> IndicadoresSociasPendientes(ConfiaWebApi.PeticionesRest.Creditos.Grupos.Get parData)
        {
            try
            {
                var obj = new
                {
                    parData.GrupoID,
                };
                var stored = "EXEC Creditos.pa_Indicadores_parte2  @GrupoID";
                var data = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.IndicadoresSociasPendientes>(stored, obj).ToArrayAsync();
                await ConexionBD.Destroy();

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }
        }

        [HttpPost]
        [Route("IndicadoresSociasLiquidadas")]
        [Authorize]
        //[Code.TProteccionProducto]
        public async Task<IActionResult> IndicadoresSociasLiquidadas(ConfiaWebApi.PeticionesRest.Creditos.Grupos.Get parData)
        {
            try
            {
                var obj = new
                {
                    parData.GrupoID,
                };
                var stored = "EXEC Creditos.pa_Indicadores_parte3  @GrupoID";
                var data = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.IndicadoresSociasPendientes>(stored, obj).ToArrayAsync();
                await ConexionBD.Destroy();

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
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
                var obj = new
                {
                    DistribuidorID = parData.DistribuidorID,
                    ZonaID = parData.ZonaID,
                    SucursalID = parData.SucursalID,
                    ProductoID = parData.ProductoID,
                    GrupoID = parData.GrupoID,
                    Fecha = parData.fechaCorte.Year != 1 ? parData.fechaCorte : DateTime.Now // en esta ocasion la fecha corte es para buscar desde esa fecha
                };
                var stored = "EXEC Creditos.pa_Reporte1506_CierreValesDist @DistribuidorID, @ZonaID, @SucursalID, @ProductoID, @GrupoID, @Fecha";
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.Reporte1506>(stored, obj).ToArrayAsync();
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
        [Route("gettipousuario")]
        [Authorize]
        public async Task<IActionResult> GetTipoUsuario()
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                // UsuarioActual.UsuarioID = 270;

                var stored = "SELECT Creditos.GetTipoUsuario(@0) as [tipoUsuario]";
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.TipoUsuario>(stored, UsuarioActual.UsuarioID).FirstOrDefaultAsync();

                var DirectorID = 0;
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
                        ZonaID = ZonaBD.ZonaID;
                        DirectorID = (int)ZonaBD.PersonaResponsableID;
                        break;
                    case 3:
                        var GerenteDB = await ConexionBD.database.QueryAsync<DBContext.DBConfia.General.Gerentes>("WHERE UsuarioID = @0", UsuarioActual.UsuarioID).FirstOrDefaultAsync();
                        var SucursalBD2 = await ConexionBD.database.QueryAsync<DBContext.DBConfia.General.Sucursales>("WHERE SucursalID = @0", GerenteDB.SucursalID).FirstOrDefaultAsync();
                        var ZonaDB = await ConexionBD.database.QueryAsync<DBContext.DBConfia.General.Zonas>("WHERE ZonaID = @0", SucursalBD2.ZonaID).FirstOrDefaultAsync();
                        SucursalID = GerenteDB.SucursalID;
                        ZonaID = SucursalBD2.ZonaID;
                        DirectorID = (int)ZonaDB.PersonaResponsableID;
                        break;
                    case 4:
                        var CoordinadorDB = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Coordinadores>("WHERE CoordinadorID = @0", UsuarioActual.PersonaID).FirstOrDefaultAsync();
                        var SucursalCoordBD = await ConexionBD.database.QueryAsync<DBContext.DBConfia.General.Sucursales>("WHERE SucursalID = @0", CoordinadorDB.SucursalID).FirstOrDefaultAsync();
                        var ZonaCoordDB = await ConexionBD.database.QueryAsync<DBContext.DBConfia.General.Zonas>("WHERE ZonaID = @0", SucursalCoordBD.ZonaID).FirstOrDefaultAsync();
                        var GrupoIDDB = await ConexionBD.database.QueryAsync<Grupos>("WHERE CoordinadorID = @0", CoordinadorDB.CoordinadorID).FirstOrDefaultAsync();
                        SucursalID = CoordinadorDB.SucursalID;
                        ZonaID = SucursalCoordBD.ZonaID;
                        DirectorID = (int)ZonaCoordDB.PersonaResponsableID;
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

                        SucursalID = CoordinadorDB.SucursalID;
                        CoordinadorID = (int)CoordinadorDB.CoordinadorID;
                        break;
                }

                await ConexionBD.Destroy();

                var obj = new
                {
                    UsuarioActual.UsuarioID,
                    res.tipoUsuario,
                    SucursalID,
                    CoordinadorID,

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

                var obj = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Reporte191_VW>(" WHERE  (ProductoID = @ProductoID OR @ProductoID = 0) AND (SucursalID = @SucursalID OR " +
                    "@SucursalID = 0) AND (ZonaID = @ZonaID OR " +
                    "@ZonaID = 0) AND (DistribuidorID = @DistribuidorID OR " +
                    "@DistribuidorID = 0) AND (GrupoID = @GrupoID OR " +
                    "@GrupoID = 0) ORDER BY ZonaID", parData).ToArrayAsync();
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
                var obj = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Reporte221_VW>("WHERE  (ProductoID = @ProductoID OR @ProductoID = 0) AND (SucursalID = @SucursalID OR " +
                    "@SucursalID = 0) AND (ZonaID = @ZonaID OR " +
                    "@ZonaID = 0) AND (DistribuidorID = @DistribuidorID OR " +
                    "@DistribuidorID = 0) AND (GrupoID = @GrupoID OR " +
                    "@GrupoID = 0) AND ((Fecha_Registro >= @FechaInicio OR @FechaInicio IS NULL) AND " +
                    "(Fecha_Registro <= @FechaFin OR @FechaFin IS NULL)) ORDER BY ZonaID", parData).ToArrayAsync();
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
    }
}