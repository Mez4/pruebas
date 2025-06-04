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
using DBContext.DBConfia.dbo;
using DBContext.DBConfia.Custom.Tesoreria;

using System.Net.Http;
using System.Collections.Generic;
using System.Text.Json;
using System.Collections;

namespace ConfiaWebApi.Controllers.Sistema
{
    [Authorize]
    [ApiController]
    [Route("api/SOMA/[controller]")]
    public class CatNaturalezaController : ControllerBase
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
        public CatNaturalezaController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        // Obtenemos los balances
        [HttpGet]
        [Route("naturalezas")]
        [Authorize]
        [Code.TProteccionProducto]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> CatalogoNaturalezas()
        {

            //var empresas = await DBContext.database.FetchAsync<DBContext.DBConfia.General.Empresas>();

            try
            {
                var naturalezas = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.Naturaleza>();
                await DBContext.Destroy();
                return Ok(naturalezas);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        [Route("naturalezas")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> AgregarNat(PeticionesRest.SOMA.CatNaturalezas.Add parData)
        {
            var naturaleza = new DBContext.DBConfia.Tesoreria.Naturaleza()
            {
                Descripcion = parData.Descripcion,

            };

            try
            {
                // Ingresamos la caja a la bd
                await DBContext.database.InsertAsync(naturaleza);
                await DBContext.Destroy();
                // Regresamos el registro a la UI
                return Ok(naturaleza);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpPut]
        [Route("naturalezas/{NaturalezaID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ActualizarNat(PeticionesRest.SOMA.CatNaturalezas.Update parData, int NaturalezaID)
        {
            try
            {
                var naturaleza = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Tesoreria.Naturaleza>(NaturalezaID);

                naturaleza.Descripcion = parData.Descripcion;
                //Banco.Logo = FilesManager.ConvertFiletoByteArray(parData.Logo);

                await DBContext.database.UpdateAsync(naturaleza);
                await DBContext.Destroy();
                return Ok(naturaleza);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }

        }

    }
}