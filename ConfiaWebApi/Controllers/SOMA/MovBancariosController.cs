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
    public class MovBancariosController : ControllerBase
    {
        // TODO::
        // Validar funcion de eliminar cuenta... ??, valido, util ?
        // Segundo, se pueden eliminar las bovedas ??, se pueden actualizar hasta que nivel? (Nombre y Clave o solo nombre?)

        /// <summary>
        /// Conexion a base de datos
        /// </summary>
        private DBConfiaContext ConexionBD;

        /// <summary>
        /// Constructor del controlador
        /// </summary>
        /// <param name="_DBContext">Conexión de datos para el controlador</param>
        public MovBancariosController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        // Obtenemos los balances
        [HttpGet]
        [Route("find-all")]
        [Authorize]
        public async Task<IActionResult> Obtener()
        {
            var bancos = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Bancos.MovimientosBancarios>();
            await ConexionBD.Destroy();
            return Ok(bancos);
        }

        [HttpGet]
        [Route("find-by-id/{MovBancarioID}")]
        [Authorize]
        public async Task<IActionResult> ObtenerPorId(int MovBancarioID)
        {
            var movBa = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Bancos.MovimientosBancarios>();
            var result = movBa.Where(ws => ws.MovBancarioID == MovBancarioID).SingleOrDefault();
            await ConexionBD.Destroy();
            return Ok(result);
        }

        [HttpGet]
        [Route("find-by-idCred/{CreditoID}")]
        [Authorize]
        public async Task<IActionResult> ObtenerPorIDCredito(int CreditoID)
        {
            var movBa = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Bancos.MovimientosBancarios>();
            var result = movBa.Where(ws => ws.CreditoID == CreditoID).SingleOrDefault();
            await ConexionBD.Destroy();
            return Ok(result);
        }

        [HttpGet]
        [Route("find-by-idPoliza/{PolizaID}")]
        [Authorize]
        public async Task<IActionResult> ObtenerPorIDPoliza(int PolizaID)
        {
            var movBa = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Bancos.MovimientosBancarios>();
            var result = movBa.Where(ws => ws.PolizaID == PolizaID).SingleOrDefault();
            await ConexionBD.Destroy();
            return Ok(result);
        }



        ///PENDIENTE DE VER CON SOMA LA INSERCION DEL MOVIMIENTO BANCARIO
        [HttpPost]
        [Route("create")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Agregar(PeticionesRest.SOMA.MovBancarios.Add parData)
        {
            // Obtenemos el email del usuario de los claims
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            // var UsuarioActual = await DBContext.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            // var PersonaActual = await DBContext.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.ID).FirstOrDefaultAsync();

            // Generamos el registro de el estado civil
            var catSexo = new DBContext.DBConfia.Bancos.MovimientosBancarios()
            {
                CatTipoMovID = parData.CatTipoMovID,
                UsuarioID = UsuarioActual.UsuarioID,
                Concepto = parData.Concepto,
                Conciliado = parData.Conciliado,
                Consecutivo = parData.Consecutivo,
                Beneficiario = parData.Beneficiario,
                PersonaID = parData.PersonaID,
                CreditoID = parData.CreditoID,
                PolizaID = parData.PolizaID,
                CuentaBancoID = parData.CuentaBancoID
            };
            try
            {
                // Ingresamos la ocupación a la bd
                await ConexionBD.database.InsertAsync(catSexo);

                // Regresamos el registro a la UI
                await ConexionBD.Destroy();
                return Ok(catSexo);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("Error al ingresar el movimiento al sistema: " + ex.Message);
            }
        }

        //Método para actualizar una denominación
        [HttpPut]
        [Route("update/{MovBancarioID}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Actualizar(PeticionesRest.SOMA.MovBancarios.Update parData, int MovBancarioID)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            // var UsuarioActual = await ConexionBD.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            // var PersonaActual = await ConexionBD.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.ID).FirstOrDefaultAsync();


            // Generamos el registro de bobeda
            var movBancario = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Bancos.MovimientosBancarios>(MovBancarioID);

            try
            {
                // Actualizamos el movimiento
                movBancario.CatTipoMovID = parData.CatTipoMovID;
                movBancario.UsuarioID = UsuarioActual.UsuarioID;
                movBancario.Concepto = parData.Concepto;
                movBancario.Conciliado = parData.Conciliado;
                movBancario.Consecutivo = parData.Consecutivo;
                movBancario.Beneficiario = parData.Beneficiario;
                movBancario.PersonaID = parData.PersonaID;
                movBancario.CreditoID = parData.CreditoID;
                movBancario.PolizaID = parData.PolizaID;
                movBancario.CuentaBancoID = parData.CuentaBancoID;

                // Ingresamos la bobeda a la bd
                await ConexionBD.database.UpdateAsync(movBancario);

                // Regresamos el registro a la UI
                await ConexionBD.Destroy();
                return Ok(movBancario);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("Error al actualizar el sexo: " + ex.Message);
            }
        }

        [HttpDelete]
        [Route("delete/{MovBancarioID}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> EliminarRegistro(int MovBancarioID)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            try
            {
                var res = await ConexionBD.database.ExecuteAsync("DELETE FROM Bancos.MovimientosBancarios WHERE MovBancarioID=@0", MovBancarioID);
                await ConexionBD.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("Error al elimnar el movimiento bancario: " + ex.Message);
            }
        }
    }
}