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
    public class AvalesController : ControllerBase
    {
        private DBConfiaContext DBContext;


        public AvalesController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(PeticionesRest.MesaCredito.Avales.Get parData)
        {
            if (parData.id != 0)
            {
                try
                {
                    var res = await DBContext.database.SingleByIdAsync<Avales>(parData.id);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            var res1 = await DBContext.database.FetchAsync<Avales>();
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.MesaCredito.Avales.Add parData)
        {
            try
            {
                var Avaltipo = new Avales()
                {
                    idProspecto = parData.idProspecto,
                    nombre = parData.nombre,
                    primerApellido = parData.primerApellido,
                    rfc = parData.rfc,
                    segundoApellido = parData.segundoApellido,
                    fechaNacimiento = parData.fechaNacimiento,
                    idSexo = parData.idSexo,
                    curp = parData.curp,
                    correo = parData.correo,
                    telefono = parData.telefono,
                    celular = parData.celular,
                    idEstadoCivil = parData.idEstadoCivil,
                    dependientesEconomicos = parData.dependientesEconomicos,
                    nombreConyuge = parData.nombreConyuge,
                    parentesco = parData.parentesco,
                    status = parData.status
                };
                await DBContext.database.InsertAsync(Avaltipo);
                await DBContext.Destroy();
                return Ok(Avaltipo);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.MesaCredito.Avales.Update parData)
        {
            try
            {
                var Aval = await DBContext.database.SingleByIdAsync<Avales>(parData.id);
                Aval.idProspecto = parData.idProspecto;
                Aval.nombre = parData.nombre;
                Aval.primerApellido = parData.primerApellido;
                Aval.rfc = parData.rfc;
                Aval.segundoApellido = parData.segundoApellido;
                Aval.fechaNacimiento = parData.fechaNacimiento;
                Aval.idSexo = parData.idSexo;
                Aval.curp = parData.curp;
                Aval.correo = parData.correo;
                Aval.telefono = parData.telefono;
                Aval.celular = parData.celular;
                Aval.idEstadoCivil = parData.idEstadoCivil;
                Aval.dependientesEconomicos = parData.dependientesEconomicos;
                Aval.nombreConyuge = parData.nombreConyuge;
                Aval.parentesco = parData.parentesco;
                Aval.status = parData.status;
                await DBContext.database.UpdateAsync(Aval);
                await DBContext.Destroy();
                return Ok(Aval);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

    }
}
