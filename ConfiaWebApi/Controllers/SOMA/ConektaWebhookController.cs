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
using DBContext.DBConfia.Seguridad;
using DBContext.DBConfia.Creditos;

using DBContext.DBConfia.dbo;

using System.Net.Http;
using System.Collections.Generic;
using System.Text.Json;
using System.Collections;
using System.IO;
using Newtonsoft.Json.Linq;

namespace ConfiaWebApi.Controllers.Sistema
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConektaWebhookController : ControllerBase
    {
        // TODO::
        // Validar funcion de eliminar cuenta... ??, valido, util ?
        // Segundo, se pueden eliminar las bovedas ??, se pueden actualizar hasta que nivel? (Nombre y Clave o solo nombre?)

        /// <summary>
        /// Conexion a base de datos
        /// </summary>
        private DBConfiaContext DBContext;

        /// <summary>
        /// Constructor del controlador
        /// </summary>
        /// <param name="_DBContext">Conexión de datos para el controlador</param>
        public ConektaWebhookController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        // Obtenemos los balances
        [HttpPost]
        [Route("WebhookTest")]
        public async Task<IActionResult> Obtener()
        {

            try
            {
                Stream req = Request.Body;

                req.Seek(0, System.IO.SeekOrigin.Begin);

                string json = new StreamReader(req).ReadToEnd();
                var obj = JObject.Parse(json);
                var data = obj.SelectToken("data");
                await DBContext.Destroy();
                return Ok(data);



            }

            catch (Exception error)
            {
                await DBContext.Destroy();
                return BadRequest(error.Message);
            }
        }
    }
}
