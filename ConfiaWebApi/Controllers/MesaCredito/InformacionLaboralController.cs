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
    public class InformacionLaboralController : ControllerBase
    {
        private DBConfiaContext DBContext;


        public InformacionLaboralController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(PeticionesRest.MesaCredito.InformacionLaboral.Get parData)
        {
            if (parData.id != 0)
            {
                try
                {
                    var res = await DBContext.database.SingleByIdAsync<InformacionLaboral>(parData.id);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            var res1 = await DBContext.database.FetchAsync<InformacionLaboral>();
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.MesaCredito.InformacionLaboral.Add parData)
        {
            try
            {
                var informacionlaboral = new InformacionLaboral()
                {
                    idPersona = parData.idPersona,
                    idTipoPersona = parData.idTipoPersona,
                    tipoPersona = parData.tipoPersona,
                    empresa = parData.empresa,
                    puesto = parData.puesto,
                    sueldo = parData.sueldo,
                    antiguedad = parData.antiguedad,
                    telefono = parData.telefono,
                    calle = parData.calle,
                    numeroInterior = parData.numeroInterior,
                    numeroExterior = parData.numeroExterior,
                    idAsentamiento = parData.idAsentamiento,
                    localidad = parData.localidad,
                    cp = parData.cp
                };
                await DBContext.database.InsertAsync(informacionlaboral);
                await DBContext.Destroy();
                return Ok(informacionlaboral);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.MesaCredito.InformacionLaboral.Update parData)
        {
            try
            {
                var informacionlaboral = await DBContext.database.SingleByIdAsync<InformacionLaboral>(parData.id);
                informacionlaboral.idPersona = parData.idPersona;
                informacionlaboral.idTipoPersona = parData.idTipoPersona;
                informacionlaboral.tipoPersona = parData.tipoPersona;
                informacionlaboral.empresa = parData.empresa;
                informacionlaboral.puesto = parData.puesto;
                informacionlaboral.sueldo = parData.sueldo;
                informacionlaboral.antiguedad = parData.antiguedad;
                informacionlaboral.telefono = parData.telefono;
                informacionlaboral.calle = parData.calle;
                informacionlaboral.numeroInterior = parData.numeroInterior;
                informacionlaboral.numeroExterior = parData.numeroExterior;
                informacionlaboral.idAsentamiento = parData.idAsentamiento;
                informacionlaboral.localidad = parData.localidad;
                informacionlaboral.cp = parData.cp;
                await DBContext.database.UpdateAsync(informacionlaboral);
                await DBContext.Destroy();
                return Ok(informacionlaboral);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}
