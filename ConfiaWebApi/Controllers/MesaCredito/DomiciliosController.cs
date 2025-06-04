using ConfiaWebApi.PeticionesRest.MesaCredito;
using DBContext.DBConfia;
using DBContext.DBConfia.MesaCredito;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.MesaCredito
{
    [Authorize]
    [ApiController]
    [Route("api/Mesacredito/[controller]")]
    public class DomiciliosController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public DomiciliosController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(PeticionesRest.MesaCredito.Domicilios.Get parData)
        {
            if (parData.id != 0)
            {
                try
                {
                    var res = await DBContext.database.SingleByIdAsync<Domicilio>(parData.id);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            var res1 = await DBContext.database.FetchAsync<Domicilio>();
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(string json_parameters)
        {
            //ConfiaWebApi.PeticionesRest.MesaCredito.Domicilios.Add parData
            List<DomiciliosParameters> expven = JsonConvert.DeserializeObject<List<DomiciliosParameters>>(json_parameters);

            try
            {

                foreach (var a in expven)
                {


                    var domicilio = new Domicilio()
                    {

                        idPersona = a.idPersona,
                        idTipoPersona = a.idTipoPersona,
                        calle = a.calle,
                        numeroInterior = a.numeroInterior,
                        numeroExterior = a.numeroExterior,
                        colonia = a.colonia,
                        localidad = a.localidad,
                        cp = a.cp,
                        municipio = a.municipio,
                        estado = a.estado
                    };
                    await DBContext.database.InsertAsync(domicilio);


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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.MesaCredito.Domicilios.Update parData)
        {
            try
            {
                var Dom = await DBContext.database.SingleByIdAsync<Domicilio>(parData.id);
                Dom.idPersona = parData.idPersona;
                Dom.idTipoPersona = parData.idTipoPersona; ;
                Dom.calle = parData.calle;
                Dom.numeroInterior = parData.numeroInterior;
                Dom.numeroExterior = parData.numeroExterior;
                Dom.colonia = parData.colonia;
                Dom.localidad = parData.localidad;
                Dom.cp = parData.cp;
                Dom.municipio = parData.municipio;
                Dom.estado = parData.estado;
                await DBContext.database.UpdateAsync(Dom);
                await DBContext.Destroy();
                return Ok(Dom);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

    }
}
