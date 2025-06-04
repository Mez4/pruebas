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
using DBContext.DBConfia.Sistema;
using System.Collections;
using System.Collections.Generic;
using DBContext.DBConfia.Seguridad;
using DBContext.DBConfia.dbo;

namespace ConfiaWebApi.Controllers.Creditos
{
    [Authorize]
    [ApiController]
    [Route("api/Creditos/[controller]")]

    public class SpeiController : ControllerBase
    {
        private DBConfiaContext ConexionBD;

        public SpeiController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        [HttpPost]
        [Route("getSpeiGenerados")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getSpeiGenerados(PeticionesRest.Creditos.Credito.GetCreditosSpei parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                parData.UsuarioID = UsuarioActual.UsuarioID;

                string query = "EXEC Tesoreria.pa_GetSpeiGenerados @SucursalID, @UsuarioID, @FechaInicio, @FechaFin";
                var res = await ConexionBD.database.FetchAsync<dynamic>(query, parData);

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
        [Route("getCreditosSpei")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getCreditosSpei(PeticionesRest.Creditos.CreditoSpei.GetCreditos parData)
        {
            try
            {
                string query = "EXEC Tesoreria.pa_GetCreditosBySpei @EnvioSTPID";
                var res = await ConexionBD.database.FetchAsync<dynamic>(query, parData);

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
        [Route("GetSpeiFile")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetSpeiFile(PeticionesRest.Creditos.CreditoSpei.GetSpeiFile parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                parData.Usu = UsuarioActual.UsuarioID;
                string query = "EXEC Tesoreria.STPGeneraArchivoSPEI @Usu,@STPEnvioID";
                var res = await ConexionBD.database.FetchAsync<dynamic>(query, parData);
                var values = res.Select(x => x.header);

                string rawString = "";
                foreach (var reg in values) rawString += reg + "\n";
                
                
                string queryStpData = "EXEC Tesoreria.pa_GetStpEnvioData @STPEnvioID";
                var resName = await ConexionBD.database.QueryAsync<ConfiaWebApi.ModlesSP.Creditos.CreditoSpei>(queryStpData, parData).FirstOrDefaultAsync();

                await ConexionBD.Destroy();
                return Ok(new 
                {
                    CsvString = rawString,
                    NameFile = resName.Archivo
                });
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("DispersarSpei")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> DispersarSpei(PeticionesRest.Creditos.CreditoSpei.DispersarPagos parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                parData.UsuarioID = UsuarioActual.UsuarioID;
                string query = "EXEC Tesoreria.pa_DispersarPagosSpei @PagosList,@UsuarioID";
                var res = await ConexionBD.database.QueryAsync<dynamic>(query, parData).FirstOrDefaultAsync();

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