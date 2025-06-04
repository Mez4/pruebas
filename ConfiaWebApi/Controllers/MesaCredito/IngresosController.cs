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
    public class IngresosController : ControllerBase
    {
        private DBConfiaContext DBContext;


        public IngresosController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(PeticionesRest.MesaCredito.Ingresos.Get parData)
        {


            if (parData.id != 0)
            {
                try
                {
                    var res = await DBContext.database.SingleByIdAsync<Ingresos>(parData.id);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            var res1 = await DBContext.database.FetchAsync<Ingresos>();
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(string json_parameters)
        {
            //ConfiaWebApi.PeticionesRest.MesaCredito.Ingresos.Add parData

            List<IngresosParameters> expven = JsonConvert.DeserializeObject<List<IngresosParameters>>(json_parameters);

            List<Ingresos> respuesta = new List<Ingresos>();

            try
            {

                foreach (var a in expven)
                {


                    var ingreso = new Ingresos()
                    {
                        idPersona = a.idPersona,
                        idTipoPersona = a.idTipoPersona,
                        ingresoSueldo = a.ingresoSueldo,
                        gananciasDV = a.gananciasDV,
                        ingresoConyuge = a.ingresoConyuge,
                        otrosIngresos = a.otrosIngresos,
                        ingresoTotal = a.ingresoTotal
                    };
                    await DBContext.database.InsertAsync(ingreso);
                    respuesta.Add(ingreso);

                }
                await DBContext.Destroy();
                return Ok(respuesta.Select(x => x.id));
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.MesaCredito.Ingresos.Update parData)
        {
            try
            {
                var ingreso = await DBContext.database.SingleByIdAsync<Ingresos>(parData.id);
                ingreso.id = parData.id;
                ingreso.idPersona = parData.idPersona;
                ingreso.idTipoPersona = parData.idTipoPersona;
                ingreso.ingresoSueldo = parData.ingresoSueldo;
                ingreso.gananciasDV = parData.gananciasDV;
                ingreso.ingresoConyuge = parData.ingresoConyuge;
                ingreso.otrosIngresos = parData.otrosIngresos;
                ingreso.ingresoTotal = parData.ingresoTotal;
                await DBContext.database.UpdateAsync(ingreso);
                await DBContext.Destroy();
                return Ok(ingreso);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}
