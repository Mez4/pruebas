using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Distribuidores;
using DBContext.DBConfia.General;
using System.Collections;
using System.Collections.Generic;
using DBContext.DBConfia.Seguridad;
using DBContext.DBConfia.Custom.Creditos;
using ConfiaWebApi.ModlesSP.Creditos;
using DBContext.DBConfia.Aclaraciones;

namespace ConfiaWebApi.Controllers.Creditos
{
    [Authorize]
    [ApiController]
    [Route("api/Creditos/[controller]")]
    public class GlobalController : ControllerBase
    {
        private DBConfiaContext ConexionBD;

        public GlobalController(DBConfiaContext _ConexionBD)
        {
            ConexionBD = _ConexionBD;
        }

        [HttpGet]
        [Route("get/{CreditoID}")]
        [Authorize]
        public async Task<IActionResult> ObtenerPorId(int CreditoID)
        {
            var Credito = await ConexionBD.database.QueryAsync<CreditosPlanPagos>("WHERE CreditoID = @0", CreditoID).FirstOrDefaultAsync();
            var PlanPagos = await ConexionBD.database.FetchAsync<PlanPagos>("WHERE CreditoID = @0", CreditoID);
            Credito.PlanPagos = PlanPagos;
            await ConexionBD.Destroy();
            return Ok(Credito);
        }

        [HttpPost]
        [Route("GetAclaraciones")]
        [Authorize]
        public async Task<IActionResult> GetAclaraciones(PeticionesRest.Creditos.GlobalVW.GetAclaraciones parData)
        {
            var Credito = await ConexionBD.database.QueryAsync<Aclaracion_VW>("WHERE DistribuidorID = @0", parData.DistribuidorID).ToArrayAsync();
            await ConexionBD.Destroy();
            return Ok(Credito);
        }

        [HttpGet]
        [Route("get")]
        [Authorize]
        [Code.KeycloakSecurityAttributes(new string[] { "CREDITOS" })]
        public async Task<IActionResult> Get(PeticionesRest.Creditos.Credito.Get parData)
        {
            await ConexionBD.Destroy();
            return Ok();
        }

        //ver como se va a ajustar con la vista del global de vr

        [HttpPost]
        [Route("getbyfiltros")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetbyFiltros(PeticionesRest.Creditos.GlobalVW.Get parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            parData.UsuarioID = UsuarioActual.UsuarioID;
            //aa
            try
            {
                switch (parData.Tipo)
                {
                    case 4:
                        var Grupos = await ConexionBD.database.QueryAsync<Global>("EXEC Creditos.pa_GenerarGlobal_sel @DirectorID, @ProductoID, @ZonaID, @SucursalID, @GrupoID, @DistribuidorID, @ClienteID, @UsuarioID, @Tipo, @tipoDias", parData).ToArrayAsync();
                        parData.Tipo = 5;
                        var Distribuidores = await ConexionBD.database.QueryAsync<Global>("EXEC Creditos.pa_GenerarGlobal_sel @DirectorID, @ProductoID, @ZonaID, @SucursalID, @GrupoID, @DistribuidorID, @ClienteID, @UsuarioID, @Tipo, @tipoDias", parData).ToArrayAsync();

                        foreach (var item in Grupos)
                        {
                            item.Detalle = (Distribuidores.Where(ws => ws.GrupoID == item.GrupoID).ToList());
                            item.Total = new Global()
                            {
                                UsuarioID = 0,
                                DirectorID = 0,
                                NombreDirector = "",
                                ProductoID = 0,
                                Producto = "",
                                SucursalID = 0,
                                Nombre = "",
                                GrupoID = 0,
                                ClasificadorGrupoID = 0,
                                Descripcion = "",
                                CoordinadorID = 0,
                                Coordinador = "",
                                DistribuidorID = 0,
                                NombreCompleto = "TOTAL",
                                LimiteDeCredito = 0,
                                Disponible = 0,
                                SaldoActual = 0,
                                Cartera = 0,
                                SaldoAtrasado = 0,
                                CreditosAtrasados = 0,
                                saldoEnRiesgo = 0,
                                Recuperado = 0,
                                Capital = 0,
                                CapLiquidado = 0,
                                CarteraEnRiesgo = 0,
                                Colocado = 0,
                                Detalle = { }
                            };
                        }

                        await ConexionBD.Destroy();
                        return Ok(Grupos);

                    default:

                        ConexionBD.database.CommandTimeout = 360;

                        var res = await ConexionBD.database.QueryAsync<Global>("EXEC Creditos.pa_GenerarGlobal_sel @DirectorID, @ProductoID, @ZonaID, @SucursalID, @GrupoID, @DistribuidorID, @ClienteID, @UsuarioID, @Tipo, @tipoDias", parData).ToArrayAsync();

                        // var res = await ConexionBD.database.FetchAsync<Global_VW>(
                        //     "WHERE  (ProductoID = @ProductoID OR @ProductoID = 0)  AND (SucursalID = @SucursalID OR " +
                        //     "@SucursalID = 0) AND (ZonaID = @ZonaID OR " + "@ZonaID = 0) AND (GrupoID = @GrupoID OR " +
                        //     "@GrupoID = 0) AND (DistribuidorID = @DistribuidorID OR " +
                        //     "@DistribuidorID = 0) AND " + "(UsuarioID = " + UsuarioActual.UsuarioID + "OR @UsuarioID = 0)", parData);

                        await ConexionBD.Destroy();
                        return Ok(res);
                }


            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }



        [HttpPost]
        [Route("getdataGlobal")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getdataGlobal(PeticionesRest.Creditos.GlobalVW.Get parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            parData.UsuarioID = UsuarioActual.UsuarioID;

            try
            {

                ConexionBD.database.CommandTimeout = 360;

                // var res = await ConexionBD.database.QueryAsync<GlobalExp_VW>("SELECT  DATEADD(HOUR, 6, FechaPrimerCanje) AS FechaPrimerCanje, * FROM  Creditos.GlobalExp_VW WHERE UsuarioID =@0", UsuarioActual.UsuarioID).ToArrayAsync();

                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.ModlesSP.Creditos.GlobalExp>("EXEC Creditos.GlobalExp_Sel @DirectorID, @ProductoID, @ZonaID, @SucursalID, @GrupoID, @DistribuidorID, @ClienteID, @UsuarioID, @Tipo, @tipoDias", parData).ToArrayAsync();

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
        [Route("getbyfiltros2")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetbyFiltros2(PeticionesRest.Creditos.GlobalVW.Get parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            parData.UsuarioID = UsuarioActual.UsuarioID;

            try
            {
                switch (parData.Tipo)
                {
                    case 1:
                        var Grupos = await ConexionBD.database.QueryAsync<Global>("SELECT DirectorID, NombreDirector, ProductoID, Producto, SucursalID, Nombre, SUM(LimiteDeCredito) AS LimiteDeCredito, SUM(Disponible) AS Disponible, SUM(SaldoActual) AS SaldoActual, SUM(Cartera) AS Cartera," +
                             "SUM(SaldoAtrasado) AS SaldoAtrasado, SUM(CreditosAtrasados) AS CreditosAtrasados, SUM(saldoEnRiesgo) AS saldoEnRiesgo, SUM(Recuperado) AS Recuperado, SUM(Capital) AS Capital, SUM(CapLiquidado) AS CapLiquidado, SUM(CarteraEnRiesgo) AS CarteraEnRiesgo, SUM(Colocado) AS Colocado" +
                             "FROM Creditos.Global_VW GROUP BY  DirectorID, NombreDirector ORDER BY  DirectorID", parData).ToArrayAsync();
                        await ConexionBD.Destroy();
                        return Ok(Grupos);
                    case 2:


                    default:

                        ConexionBD.database.CommandTimeout = 360;

                        var res = await ConexionBD.database.QueryAsync<Global>("EXEC Creditos.pa_GenerarGlobal_sel @DirectorID, @ProductoID, @ZonaID, @SucursalID, @GrupoID, @DistribuidorID, @ClienteID, @UsuarioID, @Tipo, @tipoDias", parData).ToArrayAsync();

                        // var res = await ConexionBD.database.FetchAsync<Global_VW>(
                        //     "WHERE  (ProductoID = @ProductoID OR @ProductoID = 0)  AND (SucursalID = @SucursalID OR " +
                        //     "@SucursalID = 0) AND (ZonaID = @ZonaID OR " + "@ZonaID = 0) AND (GrupoID = @GrupoID OR " +
                        //     "@GrupoID = 0) AND (DistribuidorID = @DistribuidorID OR " +
                        //     "@DistribuidorID = 0) AND " + "(UsuarioID = " + UsuarioActual.UsuarioID + "OR @UsuarioID = 0)", parData);

                        await ConexionBD.Destroy();
                        return Ok(res);
                }


            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }


        [HttpPost]
        [Route("gettipousuario")]
        [Authorize]
        public async Task<IActionResult> GetTipoUsuario(ConfiaWebApi.PeticionesRest.Creditos.Reportes.TipoUsuario parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                //UsuarioActual.UsuarioID = 271;

                var stored = "SELECT Creditos.GetTipoUsuario(@0) as [tipoUsuario]";
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.TipoUsuario>(stored, UsuarioActual.UsuarioID).FirstOrDefaultAsync();

                var ZonaID = 0;
                var SucursalID = 0;
                if (res.tipoUsuario == 2)
                {
                    var zonaBD = await ConexionBD.database.QueryAsync<DBContext.DBConfia.General.Zonas>("WHERE PersonaResponsableID = @0", UsuarioActual.UsuarioID).FirstOrDefaultAsync();
                    ZonaID = zonaBD.ZonaID;
                }
                if (res.tipoUsuario == 3)
                {
                    var SucursalBD = await ConexionBD.database.QueryAsync<DBContext.DBConfia.General.Sucursales>("WHERE PersonaResponsableID = @0", UsuarioActual.UsuarioID).FirstOrDefaultAsync();
                    SucursalID = SucursalBD.SucursalID;
                    ZonaID = SucursalBD.ZonaID;
                }

                await ConexionBD.Destroy();

                var obj = new
                {
                    UsuarioActual.UsuarioID,
                    res.tipoUsuario,
                    SucursalID,
                    ZonaID
                };

                return Ok(obj);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}
