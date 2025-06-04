using DBContext.DBConfia;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DBContext.DBConfia.MesaCredito;

namespace ConfiaWebApi.Controllers.MesaCredito
{
    [Authorize]
    [ApiController]
    [Route("api/MesaCredito/[controller]")]
    public class InformacionViviendaController : ControllerBase
    {
        private DBConfiaContext DBContext;


        public InformacionViviendaController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(PeticionesRest.MesaCredito.InformacionVivienda.Get parData)
        {
            if (parData.id != 0)
            {
                try
                {
                    var res = await DBContext.database.SingleByIdAsync<InformacionVivienda>(parData.id);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }

            var res1 = await DBContext.database.FetchAsync<InformacionVivienda>();
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.MesaCredito.InformacionVivienda.Add parData)
        {
            try
            {
                var informacionvivienda = new InformacionVivienda()
                {
                    idPersona = parData.idPersona,
                    idTipoPersona = parData.idTipoPersona,
                    idTipoVivienda = parData.idTipoVivienda,
                    tieneOtraVivienda = parData.tieneOtraVivienda,
                    numeroPersonasHabitan = parData.numeroPersonasHabitan,
                    valorAproximado = parData.valorAproximado
                };
                await DBContext.database.InsertAsync(informacionvivienda);
                await DBContext.Destroy();
                return Ok(informacionvivienda);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.MesaCredito.InformacionVivienda.Update parData)
        {
            try
            {
                var informacionvivienda = await DBContext.database.SingleByIdAsync<InformacionVivienda>(parData.id);
                informacionvivienda.id = parData.id;
                informacionvivienda.idPersona = parData.idPersona;
                informacionvivienda.idTipoPersona = parData.idTipoPersona;
                informacionvivienda.idTipoVivienda = parData.idTipoVivienda;
                informacionvivienda.tieneOtraVivienda = parData.tieneOtraVivienda;
                informacionvivienda.numeroPersonasHabitan = parData.numeroPersonasHabitan;
                informacionvivienda.valorAproximado = parData.valorAproximado;
                await DBContext.database.UpdateAsync(informacionvivienda);
                await DBContext.Destroy();
                return Ok(informacionvivienda);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}