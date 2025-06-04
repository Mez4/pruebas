using DBContext.DBConfia;
using DBContext.DBConfia.MesaCredito;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.MesaCredito
{
    [Authorize]
    [ApiController]
    [Route("api/Catalogos/[controller]")]
    public class UsuariosPermitidosController : ControllerBase
    {
        private DBConfiaContext DBContext;


        public UsuariosPermitidosController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(PeticionesRest.MesaCredito.UsuariosPermitidos.Get parData)
        {
            if (parData.id != 0)
            {
                try
                {
                    var res = await DBContext.database.SingleByIdAsync<UsuariosPermitidos>(parData.id);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            var res1 = await DBContext.database.FetchAsync<UsuariosPermitidos>();
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.MesaCredito.UsuariosPermitidos.Add parData)
        {
            try
            {
                var usuariopermitido = new UsuariosPermitidos()
                {

                    idUsuario = parData.idUsuario
                };
                await DBContext.database.InsertAsync(usuariopermitido);
                await DBContext.Destroy();
                return Ok(usuariopermitido);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("update")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.MesaCredito.UsuariosPermitidos.Update parData)
        {
            try
            {
                var usuariospermitido = await DBContext.database.SingleByIdAsync<UsuariosPermitidos>(parData.id);
                usuariospermitido.id = parData.id;
                usuariospermitido.idUsuario = parData.idUsuario;
                await DBContext.database.UpdateAsync(usuariospermitido);
                await DBContext.Destroy();
                return Ok(usuariospermitido);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}
