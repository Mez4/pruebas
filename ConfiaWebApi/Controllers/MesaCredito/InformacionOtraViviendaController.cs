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
    public class InformacionOtraViviendaController : ControllerBase
    {
        private DBConfiaContext DBContext;


        public InformacionOtraViviendaController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(PeticionesRest.MesaCredito.InformacionOtraVivienda.Get parData)
        {
            if (parData.id != 0)
            {
                try
                {
                    var res = await DBContext.database.SingleByIdAsync<InformacionOtraVivienda>(parData.id);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            var res1 = await DBContext.database.FetchAsync<InformacionOtraVivienda>();
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.MesaCredito.InformacionOtraVivienda.Add parData)
        {
            try
            {
                var informacionotravivienda = new InformacionOtraVivienda()
                {
                    idPersona = parData.idPersona,
                    idTipoPersona = parData.idTipoPersona,
                    idTipoVivienda = parData.idTipoVivienda,
                    idAsentamiento = parData.idAsentamiento,
                    calle = parData.calle,
                    numero = parData.numero,
                    localidad = parData.localidad,
                    direccion = parData.direccion,
                    valorAproximado = parData.valorAproximado
                };
                await DBContext.database.InsertAsync(informacionotravivienda);
                await DBContext.Destroy();
                return Ok(informacionotravivienda);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.MesaCredito.InformacionOtraVivienda.Update parData)
        {
            try
            {
                var informacionotravivienda = await DBContext.database.SingleByIdAsync<InformacionOtraVivienda>(parData.id);
                informacionotravivienda.idPersona = parData.idPersona;
                informacionotravivienda.idTipoPersona = parData.idTipoPersona;
                informacionotravivienda.idTipoVivienda = parData.idTipoVivienda;
                informacionotravivienda.idAsentamiento = parData.idAsentamiento;
                informacionotravivienda.calle = parData.calle;
                informacionotravivienda.numero = parData.numero;
                informacionotravivienda.localidad = parData.localidad;
                informacionotravivienda.direccion = parData.direccion;
                informacionotravivienda.valorAproximado = parData.valorAproximado;

                await DBContext.database.UpdateAsync(informacionotravivienda);
                await DBContext.Destroy();
                return Ok(informacionotravivienda);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}
