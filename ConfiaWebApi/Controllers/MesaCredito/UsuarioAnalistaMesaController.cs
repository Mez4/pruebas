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
    [Route("api/MesaCredito/[controller]")]
    public class UsuarioAnalistaMesaController : ControllerBase
    {
        private DBConfiaContext DBContext;


        public UsuarioAnalistaMesaController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(PeticionesRest.MesaCredito.UsuarioAnalistaMesa.Get parData)
        {
            if (parData.UsuarioAnalistaMesaID != 0)
            {
                try
                {
                    var res = await DBContext.database.SingleByIdAsync<UsuarioAnalistaMesa>(parData.UsuarioAnalistaMesaID);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }

            await DBContext.Destroy();
            var res1 = await DBContext.database.FetchAsync<UsuarioAnalistaMesa>();
            return Ok(res1);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.MesaCredito.UsuarioAnalistaMesa.Add parData)
        {
            try
            {
                var usuarioAnalistaMesa = new UsuarioAnalistaMesa()
                {
                    UsuarioID = parData.UsuarioID,
                    MesaCreditoID = parData.MesaCreditoID,
                    Activo = parData.Activo,
                    PersonaID = parData.PersonaID

                };
                await DBContext.database.InsertAsync(usuarioAnalistaMesa);
                await DBContext.Destroy();
                return Ok(usuarioAnalistaMesa);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.MesaCredito.UsuarioAnalistaMesa.Update parData)
        {
            try
            {
                var usuarioAnalistaMesa = await DBContext.database.SingleByIdAsync<UsuarioAnalistaMesa>(parData.UsuarioAnalistaMesaID);
                usuarioAnalistaMesa.UsuarioID = parData.UsuarioID;
                usuarioAnalistaMesa.MesaCreditoID = parData.MesaCreditoID;
                usuarioAnalistaMesa.Activo = parData.Activo;
                usuarioAnalistaMesa.PersonaID = parData.PersonaID;



                await DBContext.database.UpdateAsync(usuarioAnalistaMesa);
                await DBContext.Destroy();
                return Ok(usuarioAnalistaMesa);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

    }
}
