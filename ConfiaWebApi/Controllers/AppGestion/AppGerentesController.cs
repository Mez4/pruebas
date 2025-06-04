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
    public class AppGerentesController : ControllerBase
    {
        private DBConfiaContext ConexionBD;
        public AppGerentesController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        [HttpPost]
        [Route("resumenQuincenaVigentesGerente")]
        [Authorize]
        public async Task<IActionResult> resumenQuincenaVigentesGerente(ConfiaWebApi.PeticionesRest.Creditos.Reportes.IndicadoresGerente_parte1ParData parData)
        {
            try
            {
                var stored = "EXEC Creditos.pa_IndicadoresGerente_parte1 @GrupoID, @SucursalID";

                var obj = new
                {
                    GrupoID = parData.GrupoID,
                    SucursalID = parData.SucursalID,
                };
                // Inicialzacion de arreglos para obtener los ultimos 3 cortes
                var data = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.IndicadoresGerente_parte1>(stored, obj).ToArrayAsync();

                var resp = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                await ConexionBD.Destroy();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { error = "Error al obtener info " }
                });
            }
        }

        [HttpPost]
        [Route("sociasPendientesGerente")]
        [Authorize]
        public async Task<IActionResult> SociasPendientesGerente(ConfiaWebApi.PeticionesRest.Creditos.Reportes.IndicadoresGerente_parte2ParData parData)
        {
            try
            {
                var stored = "EXEC Creditos.pa_IndicadoresGerente_parte2 @GrupoID, @SucursalID";

                var obj = new
                {
                    GrupoID = parData.GrupoID,
                    SucursalID = parData.SucursalID,
                };

                var data = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.IndicadoresGerente_parte2>(stored, obj).ToArrayAsync();

                var resp = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                await ConexionBD.Destroy();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { error = "Error al obtener info " }
                });
            }
        }

        [HttpPost]
        [Route("detalleSociasPendientesGerente")]
        [Authorize]
        public async Task<IActionResult> DetalleSociasPendientesGerente(ConfiaWebApi.PeticionesRest.Creditos.Reportes.IndicadoresGerente_parte3ParData parData)
        {
            try
            {
                var stored = "EXEC Creditos.pa_IndicadoresGerente_parte3 @GrupoID, @SucursalID";

                var obj = new
                {
                    GrupoID = parData.GrupoID,
                    SucursalID = parData.SucursalID,
                };
                var data = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.IndicadoresGerente_parte3>(stored, obj).ToArrayAsync();

                var resp = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = data
                };

                await ConexionBD.Destroy();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { error = "Error al obtener info " }
                });
            }
        }

        [HttpPost]
        [Route("comparativoContraQuincenaGerente")]
        [Authorize]
        public async Task<IActionResult> ComparativoContraQuincenaGerente(ConfiaWebApi.PeticionesRest.Creditos.Grupos.Get parData)
        {
            try
            {
                var obj = new
                {
                    GrupoID = parData.GrupoID,
                    SucursalID = parData.SucursalID,
                };

                var storedPasado = "EXEC Creditos.pa_IndicadoresGerente_ComparativoPasado @GrupoID, @SucursalID";
                var arrayPasado = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.InidicadoresGerenteComparativaPasada>(storedPasado, obj).ToArrayAsync();

                var storedVigente = "EXEC Creditos.pa_IndicadoresGerente_ComparativaVigente @GrupoID, @SucursalID";
                var arrayVigente = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.InidicadoresGerenteComparativaVigente>(storedVigente, obj).ToArrayAsync();

                var resp = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = new { arrayPasado, arrayVigente }
                };

                await ConexionBD.Destroy();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { error = "Error al obtener info " }
                });
            }
        }

    }
}