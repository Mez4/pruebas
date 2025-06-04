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

using System.Net.Http;
using System.Collections.Generic;
using System.Text.Json;
using System.Collections;

namespace ConfiaWebApi.Controllers.Sistema
{
    [Authorize]
    [ApiController]
    [Route("api/SOMA/[controller]")]
    public class CatSucursalesRestController : ControllerBase
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
        public CatSucursalesRestController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        // Obtenemos los balances
        [HttpGet]
        [Route("show")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Obtener()
        {
            var sucursales = await DBContext.database.FetchAsync<DBContext.DBConfia.General.Sucursales>();
            var result = sucursales.Select(sc => new
            {
                sucursalId = sc.SucursalID,
                sucursal = sc.Nombre
            }).ToArray();
            var res2 = sucursales.Select(sc => new
            {
                sucursalId = sc.SucursalID,
                sucursal = sc.Nombre
            }).ToArray();
            await DBContext.Destroy();
            return Ok(result);
        }

        [HttpPost]
        [Route("suc")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetProdSuc(PeticionesRest.General.Sucursal.GetView parData)
        {
                int ProductoID = 9999;
                int.TryParse(Request.Headers["ProductoID"], out ProductoID);
            
            parData.ProductoID = ProductoID;

             var result = await DBContext.database.QueryAsync<DBContext.DBConfia.General.SucursalesProductos_VW>("WHERE ProductoID = @0",parData.ProductoID).ToArrayAsync();

            await DBContext.Destroy();
            return Ok(result);
        }
        ///
        [HttpGet]
        [Route("all")]
        [Authorize]
        public async Task<IActionResult> ObtenerPorId()
        {

            var sucursales = await DBContext.database.FetchAsync<DBContext.DBConfia.General.Sucursales>();
            var result = sucursales.Select(c => new { sucursalId = c.SucursalID, sucursal = c.Nombre }).ToList();
            await DBContext.Destroy();
            return Ok(result);
        }

    }
}