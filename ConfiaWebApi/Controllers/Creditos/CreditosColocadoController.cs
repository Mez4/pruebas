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


namespace ConfiaWebApi.Controllers.Creditos
{
    [ApiController]
    [Route("api/Creditos/[controller]")]

    public class CreditosColocadoController : ControllerBase
    {
        private DBConfiaContext ConexionBD;
        /// <summary>
        /// Constructor del controlador
        /// </summary>
        /// <param name="_DBContext">Conexión de datos para el controlador</param>
        public CreditosColocadoController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        [HttpPost]
        [Route("CreditoColocacion")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> CreditoColocacion(ConfiaWebApi.PeticionesRest.Creditos.Reportes.CreditosColocacion parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            try
            {
                ConexionBD.database.CommandTimeout = 9999;
                var obj = new
                {
                    parData.FechaInicio,
                    parData.FechaFin,
                    UsuarioActual.UsuarioID

                };
                var stored = "EXEC Creditos.Colocacion @FechaInicio, @FechaFin, @UsuarioID";
                var data = await ConexionBD.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.CreditosColocacion>(stored, obj).ToArrayAsync();
                await ConexionBD.Destroy();

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = data
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



    }
}