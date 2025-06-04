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
    public class ReferenciasController : ControllerBase
    {
        private DBConfiaContext DBContext;


        public ReferenciasController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(PeticionesRest.MesaCredito.Referencias.Get parData)
        {
            if (parData.id != 0)
            {
                try
                {
                    var res = await DBContext.database.SingleByIdAsync<Referencias>(parData.id);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            var res1 = await DBContext.database.FetchAsync<Referencias>();
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.MesaCredito.Referencias.Add parData)
        {
            try
            {
                var referencia = new Referencias()
                {

                    idPersona = parData.idPersona,
                    idTipoPersona = parData.idTipoPersona,
                    numeroReferencia = parData.numeroReferencia,
                    nombre = parData.nombre,
                    primerApellido = parData.primerApellido,
                    segundoApellido = parData.segundoApellido,
                    parentesco = parData.parentesco,
                    celular = parData.celular,
                    domicilio = parData.domicilio,
                    edad = parData.edad,
                    status = parData.status
                };
                await DBContext.database.InsertAsync(referencia);
                await DBContext.Destroy();
                return Ok(referencia);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.MesaCredito.Referencias.Update parData)
        {
            try
            {
                var referencia = await DBContext.database.SingleByIdAsync<Referencias>(parData.id);
                referencia.id = parData.id;
                referencia.idPersona = parData.idPersona;
                referencia.idTipoPersona = parData.idTipoPersona;
                referencia.numeroReferencia = parData.numeroReferencia;
                referencia.nombre = parData.nombre;
                referencia.primerApellido = parData.primerApellido;
                referencia.segundoApellido = parData.segundoApellido;
                referencia.parentesco = parData.parentesco;
                referencia.celular = parData.celular;
                referencia.domicilio = parData.domicilio;
                referencia.edad = parData.edad;
                referencia.status = parData.status;
                await DBContext.database.UpdateAsync(referencia);
                await DBContext.Destroy();
                return Ok(referencia);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}
