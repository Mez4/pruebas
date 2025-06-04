using DBContext.DBConfia;
using DBContext.DBConfia.Cobranza;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.Cobranza
{
    [Authorize]
    [ApiController]
    [Route("api/Cobranza/[controller]")]
    public class ClasificadorController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public ClasificadorController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Cobranza.Clasificador.get parData)
        {
            if (parData.id != 0)
            {
                var resultado = await DBContext.database.SingleByIdAsync<Clasificadores>(parData.id);
                await DBContext.Destroy();
                return Ok(resultado);
            }

            var res = await DBContext.database.FetchAsync<Clasificadores>();
            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("add")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Cobranza.Clasificador.add parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var Bitacora = new Bitacora { Usuario = UsuarioActual.UsuarioID, UsuarioPersona = Convert.ToInt32(UsuarioActual.PersonaID), Clave = "CI000", Fecha = DateTime.Now };
                await DBContext.database.InsertAsync<Bitacora>(Bitacora);

                var clasificadores = new Clasificadores() { Clasificador = parData.Clasificador, Activo = parData.Activo };
                await DBContext.database.InsertAsync<Clasificadores>(clasificadores);
                await DBContext.Destroy();
                return Ok(clasificadores);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("update")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Cobranza.Clasificador.update parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var Bitacora = new Bitacora { Usuario = UsuarioActual.UsuarioID, UsuarioPersona = Convert.ToInt32(UsuarioActual.PersonaID), Clave = "CA000", Fecha = DateTime.Now };
                await DBContext.database.InsertAsync<Bitacora>(Bitacora);


                var clasificadores = await DBContext.database.SingleByIdAsync<Clasificadores>(parData.ClasificadorID);
                clasificadores.Clasificador = parData.Clasificador;
                clasificadores.Activo = parData.Activo;
                await DBContext.database.UpdateAsync(clasificadores);
                await DBContext.Destroy();
                return Ok(clasificadores);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }
    }
}
