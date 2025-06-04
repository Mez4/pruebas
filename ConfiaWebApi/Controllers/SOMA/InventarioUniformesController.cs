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
using DBContext.DBConfia.Tesoreria;
using DBContext.DBConfia.Bancos;
using DBContext.DBConfia.Balances;
using DBContext.DBConfia.Compras;



using DBContext.DBConfia.dbo;
using DBContext.DBConfia.Custom.Tesoreria;

using System.Net.Http;
using System.Collections.Generic;
using System.Text.Json;
using System.Collections;

namespace ConfiaWebApi.Controllers.Sistema
{
    [ApiController]
    [Route("api/SOMA/[controller]")]

    public class InventarioUniformes : ControllerBase
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
        public InventarioUniformes(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }
        // Obtenemos los balances
        [HttpGet]
        [Route("obtenerMovimientos")]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Obtener()
        {
            try
            {
                var InventarioUniformes_VW = await DBContext.database.FetchAsync<InventarioUniformes_VW>();
                await DBContext.Destroy();
                return Ok(InventarioUniformes_VW);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        [Route("obtenerProductos")]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerProductos()
        {
            try
            {
                var InventarioUniformes_VW = await DBContext.database.FetchAsync<DBContext.DBConfia.Compras.Producto>();
                await DBContext.Destroy();
                return Ok(InventarioUniformes_VW);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("guardarMovimiento")]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GuardarMov(ConfiaWebApi.PeticionesRest.SOMA.InventarioUniformes.Agregar parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();


                var InventarioAgregar = new DBContext.DBConfia.Compras.InventarioUniformes();
                InventarioAgregar.NumeroPiezas = parData.TipoMov == "ENT" ? parData.NumeroPiezas : parData.NumeroPiezas * -1;
                InventarioAgregar.ProductoUniformeID = parData.Producto;
                InventarioAgregar.TipoMov = parData.TipoMov;
                InventarioAgregar.PersonaID = (long)UsuarioActual.PersonaID;
                InventarioAgregar.FechaCaptura = DateTime.Now;
                await DBContext.database.InsertAsync(InventarioAgregar);

                var itemInventarioVW_Actualizado = await DBContext.database.QueryAsync<InventarioUniformes_VW>
                ("WHERE InventarioID=@0", InventarioAgregar.InventarioID).FirstOrDefaultAsync();

                await DBContext.Destroy();
                return Ok(itemInventarioVW_Actualizado);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

    }
}
