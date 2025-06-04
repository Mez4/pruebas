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
    public class EgresosController : ControllerBase
    {
        private DBConfiaContext DBContext;


        public EgresosController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(PeticionesRest.MesaCredito.Egresos.Get parData)
        {
            if (parData.id != 0)
            {
                try
                {
                    var res = await DBContext.database.SingleByIdAsync<Egresos>(parData.id);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            var res1 = await DBContext.database.FetchAsync<Egresos>();
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.MesaCredito.Egresos.Add parData)
        {
            try
            {
                var egreso = new Egresos()
                {

                    idPersona = parData.idPersona,
                    idTipoPersona = parData.idTipoPersona,
                    egresos = parData.egresos,
                    alimentacion = parData.alimentacion,
                    tarjetaCreido = parData.tarjetaCreido,
                    rentaPagoVivienda = parData.rentaPagoVivienda,
                    serviciosDomesticos = parData.serviciosDomesticos,
                    otros = parData.otros,
                    egresoTotal = parData.egresoTotal
                };
                await DBContext.database.InsertAsync(egreso);
                await DBContext.Destroy();
                return Ok(egreso);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.MesaCredito.Egresos.Update parData)
        {
            try
            {
                var Egreso = await DBContext.database.SingleByIdAsync<Egresos>(parData.id);

                Egreso.idPersona = parData.idPersona;
                Egreso.idTipoPersona = parData.idTipoPersona;
                Egreso.egresos = parData.egresos;
                Egreso.alimentacion = parData.alimentacion;
                Egreso.tarjetaCreido = parData.tarjetaCreido;
                Egreso.rentaPagoVivienda = parData.rentaPagoVivienda;
                Egreso.serviciosDomesticos = parData.serviciosDomesticos;
                Egreso.otros = parData.otros;
                Egreso.egresoTotal = parData.egresoTotal;
                await DBContext.database.UpdateAsync(Egreso);
                await DBContext.Destroy();
                return Ok(Egreso);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}
