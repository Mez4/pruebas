using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using System.Globalization;
using System.Collections.Generic;
using DBContext.DBConfia.Distribuidores;

namespace ConfiaWebApi.Controllers.Indicadores
{
    [Authorize]
    [ApiController]
    [Route("api/AppGestion/[controller]")]
    public class AppCoordinadorController : ControllerBase
    {
        private DBConfiaContext ConexionBD;
        private CultureInfo provider = CultureInfo.InvariantCulture;

        public AppCoordinadorController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        [HttpPost]
        [Route("comparativoContraQuincena")]
        [Authorize]
        public async Task<IActionResult> ComparativoContraQuincena(ConfiaWebApi.PeticionesRest.Creditos.Grupos.Get parData)
        {
            try
            {
                // Consultas a la base de datos
                var Sucursal = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Grupos_VW>("WHERE GrupoID=@0", parData.Id).FirstOrDefaultAsync();

                var relCortes = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Cortes.RelacionCortes>("SELECT TOP 3 fechaCorte FROM Cortes.RelacionCortes GROUP BY fechaCorte ORDER BY fechaCorte DESC").ToArrayAsync();

                var stored = "EXEC Creditos.pa_Reporte1549_DistPagosVencimiento @DistribuidorID, @isGerente, @ZonaID, @SucursalID, @ProductoID, @GrupoID, @FechaCorte";

                // Inicialzacion de arreglos para obtener los ultimos 3 cortes
                var arrayVigente = new List<ConfiaWebApi.PeticionesRest.Creditos.Reportes.Reporte1549>();
                var arrayPasado = new List<ConfiaWebApi.PeticionesRest.Creditos.Reportes.Reporte1549>();
                var arrayAntePasado = new List<ConfiaWebApi.PeticionesRest.Creditos.Reportes.Reporte1549>();

                int vuelta = 0;
                foreach (var relCorte in relCortes)
                {

                    var obj = new
                    {
                        DistribuidorID = parData.DistribuidorID,
                        isGerente = false,
                        ZonaID = 0,
                        SucursalID = Sucursal == null ? 0 : Sucursal.SucursalID,
                        ProductoID = parData.ProductoID,
                        GrupoID = Sucursal == null ? 0 : Sucursal.GrupoID,
                        FechaCorte = relCorte.fechaCorte
                    };

                    switch (vuelta)
                    {
                        case 0:
                            var reporte0 = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.Reporte1549>(stored, obj).ToArrayAsync();
                            foreach (var item in reporte0)
                            {
                                item.fechaCorte = relCorte.fechaCorte;
                                arrayVigente.Add(item);
                            }
                            break;
                        case 1:
                            var reporte1 = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.Reporte1549>(stored, obj).ToArrayAsync();
                            foreach (var item in reporte1)
                            {
                                item.fechaCorte = relCorte.fechaCorte;
                                arrayPasado.Add(item);
                            }
                            break;
                        case 2:
                            var reporte2 = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.Reporte1549>(stored, obj).ToArrayAsync();
                            foreach (var item in reporte2)
                            {
                                item.fechaCorte = relCorte.fechaCorte;
                                arrayAntePasado.Add(item);
                            }
                            break;
                    }
                    vuelta++;
                }

                await ConexionBD.Destroy();
                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = new
                    {
                        arrayVigente,
                        arrayPasado,
                        arrayAntePasado
                    }

                };
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("Semaforo")]
        [Authorize]
        public async Task<IActionResult> SemaforoIndicadores(ConfiaWebApi.PeticionesRest.Creditos.Grupos.Get parData)
        {
            try
            {
                var obj = new
                {
                    GrupoID = parData.GrupoID,
                };
                var storedAnticipada = "EXEC Creditos.pa_Indicadores_SemaforoAnticipada @GrupoID";
                var Anticipada = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.IndicadoresSemaforo>(storedAnticipada, obj).ToArrayAsync();

                var storedPuntual = "EXEC Creditos.pa_Indicadores_SemaforoPuntual @GrupoID";
                var Puntual = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.IndicadoresSemaforo>(storedPuntual, obj).ToArrayAsync();

                var storedTardia = "EXEC Creditos.pa_Indicadores_SemaforoTardia @GrupoID";
                var Tardia = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.IndicadoresSemaforo>(storedTardia, obj).ToArrayAsync();

                var storedFinal = "EXEC Creditos.pa_Indicadores_SemaforoFinal @GrupoID";
                var Final = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.IndicadoresSemaforo>(storedFinal, obj).ToArrayAsync();

                var storedMora = "EXEC Creditos.pa_Indicadores_SemaforoMora @GrupoID";
                var Mora = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.IndicadoresMora>(storedMora, obj).ToArrayAsync();

                await ConexionBD.Destroy();

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = new { Anticipada, Puntual, Tardia, Final, Mora }
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
        [Route("comparativoContraQuincena2")]
        [Authorize]
        public async Task<IActionResult> ComparativoContraQuincena2(ConfiaWebApi.PeticionesRest.Creditos.Grupos.Get parData)
        {
            try
            {
                var obj = new
                {
                    GrupoID = parData.GrupoID,
                    SucursalID = parData.SucursalID,
                    ProductoID = parData.ProductoID,
                };

                var storedVigente = "EXEC Creditos.pa_Indicadores_ComparativaContraQuincenaVigente @GrupoID, @SucursalID, @ProductoID";
                var arrayVigente = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.IndicadoresComparativaContraQuincenaVigente>(storedVigente, obj).ToArrayAsync();

                var storedPasado = "EXEC Creditos.pa_Indicadores_ComparativaContraQuincenaPasado @GrupoID, @SucursalID, @ProductoID";
                var arrayPasado = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.IndicadoresComparativaContraQuincenaPasado>(storedPasado, obj).ToArrayAsync();

                await ConexionBD.Destroy();
                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = new { arrayVigente, arrayPasado }
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
        [Route("cumpleaniosSocias")]
        [Authorize]
        public async Task<IActionResult> CumpleaniosSocias(ConfiaWebApi.PeticionesRest.Creditos.Grupos.Get parData)
        {
            try
            {
                var obj = new
                {
                    GrupoID = parData.GrupoID,
                };
                var stored = "EXEC Creditos.pa_Indicadores_CumpleSocia @GrupoID";
                var data = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.IndicadoresCumpleSocias>(stored, obj).ToArrayAsync();

                await ConexionBD.Destroy();
                var response = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                return Ok(response);
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
        [Route("resumenQuincenaVigentes")]
        [Authorize]
        public async Task<IActionResult> resumenQuincenaVigentes(ConfiaWebApi.PeticionesRest.Creditos.Reportes.Reporte1549 parData)
        {
            try
            {
                var stored = "EXEC Creditos.pa_Indicadores_parte1 @ZonaID, @ProductoID, @GrupoID, @msj";

                var obj = new
                {
                    ZonaID = 0,
                    ProductoID = parData.ProductoID,
                    GrupoID = parData.GrupoID,
                    msj = ""
                };
                // Inicialzacion de arreglos para obtener los ultimos 3 cortes
                var data = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.Reporte1549parte1>(stored, obj).ToArrayAsync();

                await ConexionBD.Destroy();
                var response = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                return Ok(response);
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
    }

}