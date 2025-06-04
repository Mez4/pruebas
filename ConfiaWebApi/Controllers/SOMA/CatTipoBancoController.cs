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
using DBContext.DBConfia.Bancos;

using System.Net.Http;
using System.Collections.Generic;
using System.Text.Json;
using System.Collections;
using ConfiaWebApi.PeticionesRest.SOMA.CatTipoBanco;
// using SaldoReal = DBContext.DBConfia.Bancos.SaldoReal;


namespace ConfiaWebApi.Controllers.Sistema
{
    [Authorize]
    [ApiController]
    [Route("api/SOMA/[controller]")]
    public class CatTipoBancoController : ControllerBase
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
        public CatTipoBancoController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        // Obtenemos los balances
        [HttpGet]
        [Route("find-all")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Obtener()
        {
            var sucursales = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.CatalogoTipoBanco>();
            var result = sucursales.Select(c => new { tipoBancoID = c.TipoBancoId, descripcion = c.Descripcion, clave = c.Clave }).ToList();
            await DBContext.Destroy();
            return Ok(result);
        }
        ///
        [HttpGet]
        [Route("find/{tipoBancoID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerPorId(int tipoBancoID)
        {
            var sucursales = await DBContext.database.FetchAsync<DBContext.DBConfia.Bancos.CatalogoTipoBanco>();
            var result = sucursales.Where(u => u.TipoBancoId == tipoBancoID).Select(c => new { tipoBancoID = c.TipoBancoId, descripcion = c.Descripcion }).Single();
            await DBContext.Destroy();
            return Ok(result);
        }

        // Agrega una caja a la base de datos
        [HttpPost]
        [Route("create")]
        [Authorize]
        [Code.TProteccionProducto]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Agregar(PeticionesRest.SOMA.CatTipoBanco.Add parData)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            // Generamos el registro de el estado civil
            var catTipoBanco = new DBContext.DBConfia.Bancos.CatalogoTipoBanco()
            {
                Descripcion = parData.descripcion,
            };
            try
            {
                // Ingresamos la ocupación a la bd
                await DBContext.database.InsertAsync(catTipoBanco);
                await DBContext.Destroy();
                // Regresamos el registro a la UI
                return Ok(catTipoBanco);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest("Error al ingresar el sexo al sistema: " + ex.Message);
            }
        }

        //Método para actualizar una denominación
        [HttpPut]
        [Route("update/{TipoBancoId}")]
        [Authorize]
        [Code.TProteccionProducto]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Actualizar(PeticionesRest.SOMA.CatTipoBanco.Update parData, int TipoBancoId)
        {
            // Obtenemos el email del usuario de los claims

            // Generamos el registro de bobeda
            var bancoT = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Bancos.CatalogoTipoBanco>(TipoBancoId);

            try
            {
                // Actualizamos el registro
                bancoT.Descripcion = parData.descripcion;

                // Ingresamos la bobeda a la bd
                await DBContext.database.UpdateAsync(bancoT);
                await DBContext.Destroy();
                // Regresamos el registro a la UI
                return Ok(bancoT);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest("Error al actualizar el tipo de banco: " + ex.Message);
            }
        }

        [HttpDelete]
        [Route("delete/{TipoBancoId}")]
        [Authorize]
        [Code.TProteccionProducto]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> EliminarRegistro(int TipoBancoId)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            //var agrupacion = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Tesoreria.CatalogoDenomEfectivo>(CatDenomEfectivoID);
            try
            {
                // Eliminamos el registro
                await DBContext.database.ExecuteAsync("DELETE FROM Bancos.CatalogoTipoBanco WHERE TipoBancoId=@0", TipoBancoId);
                await DBContext.Destroy();
                return Ok(true);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest("Error al elimnar el tipo de banco: " + ex.Message);
            }
        }

        [HttpPost]
        [Route("GetSaldoReal")]
        [Authorize]
        [Code.TProteccionProducto]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> GetSaldoReal(PeticionesRest.SOMA.CatTipoBanco.SaldoReal2 parData)
        {

            try
            {

                var obj = new
                {
                    parData.CajaID
                };

                //  var stored = await DBContext.database.FirstOrDefaultAsync<PeticionesRest.SOMA.CatTipoBanco.SaldosSP>("EXEC Tesoreria.getSaldosReales @CajaID", obj);
                var res = await DBContext.database.QueryAsync<SaldoReal>("EXEC Tesoreria.getSaldosReales @CajaID", obj).ToArrayAsync();
                // SaldosReales = await DBContext.database.QueryAsync<SaldoReal>(stored,parData).ToArrayAsync(); 
                var data = new ArrayList();

                // foreach (var saldoreal in res)
                // {
                //     data.Add(new
                //     {
                //         saldoreal.ProductoId,
                //         saldoreal.Id,
                //         saldoreal.TipoMovimiento,
                //         saldoreal.CajaId,
                //         saldoreal.NombreCaja,
                //         saldoreal.Total,
                //         saldoreal.Producto,
                //         saldoreal.SaldoFinal
                //     });
                // }


                await DBContext.Destroy();
                // Regresamos el registro a la UI
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest("Error: " + ex.Message);
            }
        }


    }
}