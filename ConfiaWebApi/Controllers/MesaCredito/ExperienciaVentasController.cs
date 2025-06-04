using DBContext.DBConfia;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DBContext.DBConfia.MesaCredito;
using Newtonsoft.Json;
using ConfiaWebApi.PeticionesRest.MesaCredito;

namespace ConfiaWebApi.Controllers.MesaCredito
{
    [Authorize]
    [ApiController]
    [Route("api/MesaCredito/[controller]")]
    public class ExperienciaVentasController : ControllerBase
    {
        private DBConfiaContext DBContext;


        public ExperienciaVentasController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(PeticionesRest.MesaCredito.ExperienciaVentas.Get parData)
        {
            if (parData.id != 0)
            {
                try
                {
                    var res = await DBContext.database.SingleByIdAsync<ExperienciaVentas>(parData.id);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            var res1 = await DBContext.database.FetchAsync<ExperienciaVentas>();
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(string json_parameters)
        {


            List<ExperinciaVentasParameters> expven = JsonConvert.DeserializeObject<List<ExperinciaVentasParameters>>(json_parameters);

            try
            {

                foreach (var a in expven)
                {


                    var experienciaventa = new ExperienciaVentas()
                    {
                        idPersona = a.idPersona,
                        idTipoPersona = a.idTipoPersona,
                        nombreEmpresa = a.nombreEmpresa,
                        fechaIngreso = a.fechaIngreso,
                        limiteCredito = a.limiteCredito,
                        creditoDisponible = a.creditoDisponible,
                        status = a.status
                    };
                    await DBContext.database.InsertAsync(experienciaventa);


                }
                await DBContext.Destroy();
                return Ok();
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.MesaCredito.ExperienciaVentas.Update parData)
        {
            try
            {
                var experienciaventa = await DBContext.database.SingleByIdAsync<ExperienciaVentas>(parData.id);
                experienciaventa.idPersona = parData.idPersona;
                experienciaventa.idTipoPersona = parData.idTipoPersona;
                experienciaventa.nombreEmpresa = parData.nombreEmpresa;
                experienciaventa.fechaIngreso = parData.fechaIngreso;
                experienciaventa.limiteCredito = parData.limiteCredito;
                experienciaventa.creditoDisponible = parData.creditoDisponible;
                experienciaventa.status = parData.status;
                await DBContext.database.UpdateAsync(experienciaventa);
                await DBContext.Destroy();
                return Ok(experienciaventa);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}
