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
    public class ProspectosController : ControllerBase
    {
        private DBConfiaContext DBContext;


        public ProspectosController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(PeticionesRest.MesaCredito.Prospectos.Get parData)
        {
            if (parData.id != 0)
            {
                try
                {
                    var res = await DBContext.database.SingleByIdAsync<Prospectos>(parData.id);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            var res1 = await DBContext.database.FetchAsync<Prospectos>();
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.MesaCredito.Prospectos.Add parData)
        {
            List<Prospectos> respuesta = new List<Prospectos>();



            try
            {
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.PeticionesRest.MesaCredito.Prospectos.respuesta>("EXEC sp_MesaCredito_Prospecto @nombre ,@segundoNombre ,@primerApellido ,@segundoApellido ,@fechaNacimiento ,@resultadoBuroCredito ,@idPromotor  ,@idConsulta  ,@idSucursal  ,@comoSeEntero ,@idSexo ,@curp  ,@rfc  ,@correo ,@telefono  ,@celular ,@idEstadoCivil,@dependientesEconomicos ,@nombreConyuge ,@tieneAuto  ,@cantidadAuto  ,@marcaAuto  ,@modeloAuto ", parData).FirstOrDefaultAsync();


                if (res.msj == "YA EXISTE UNA PERSONA  CON ESE CURP")
                {
                    await DBContext.Destroy();
                    return BadRequest(res.msj);
                }
                else if (res.msj == "YA EXISTE UN PROSPECTO  CON ESE CURP")
                {
                    await DBContext.Destroy();
                    return BadRequest(res.msj);
                }
                else if (res.prospectoid == -1)
                {
                    await DBContext.Destroy();
                    return BadRequest(res.msj);
                }
                else
                {
                    await DBContext.Destroy();
                    return Ok(res);
                }


            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }








            //try
            //{
            //    var prospecto = new Prospectos()
            //    {

            //        nombre = parData.nombre,
            //        segundoNombre = parData.segundoApellido,
            //        primerApellido = parData.primerApellido,
            //        segundoApellido = parData.segundoApellido,
            //        fechaNacimiento = parData.fechaNacimiento,
            //        resultadoBuroCredito = parData.resultadoBuroCredito,
            //        idPromotor = parData.idPromotor,
            //        idConsulta = parData.idConsulta,
            //        idSucursal = parData.idSucursal,
            //        comoSeEntero = parData.comoSeEntero,
            //        idSexo = parData.idSexo,
            //        curp = parData.curp,
            //        rfc = parData.rfc,
            //        correo = parData.correo,
            //        telefono = parData.telefono,
            //        celular = parData.celular,
            //        idEstadoCivil = parData.idEstadoCivil,
            //        dependientesEconomicos = parData.dependientesEconomicos,
            //        nombreConyuge = parData.nombreConyuge,
            //        tieneAuto = parData.tieneAuto,
            //        cantidadAuto = parData.cantidadAuto,
            //        marcaAuto = parData.marcaAuto,
            //        modeloAuto = parData.modeloAuto,
            //        status = parData.status,
            //        fechaCreacion = parData.fechaCreacion
            //    };
            //    await DBContext.database.InsertAsync(prospecto);

            //    respuesta.Add(prospecto);
            //    return Ok(respuesta.Select(x => x.id));
            //}
            //catch (Exception ex)
            //{
            //    return BadRequest(ex.Message);
            //}
        }

        [HttpPost]
        [Route("update")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.MesaCredito.Prospectos.Update parData)
        {
            try
            {
                var prospecto = await DBContext.database.SingleByIdAsync<Prospectos>(parData.id);
                prospecto.id = parData.id;
                prospecto.nombre = parData.nombre;
                prospecto.segundoNombre = parData.segundoApellido;
                prospecto.primerApellido = parData.primerApellido;
                prospecto.segundoApellido = parData.segundoApellido;
                prospecto.fechaNacimiento = parData.fechaNacimiento;
                prospecto.resultadoBuroCredito = parData.resultadoBuroCredito;
                prospecto.idPromotor = parData.idPromotor;
                prospecto.idConsulta = parData.idConsulta;
                prospecto.idSucursal = parData.idSucursal;
                prospecto.comoSeEntero = parData.comoSeEntero;
                prospecto.idSexo = parData.idSexo;
                prospecto.curp = parData.curp;
                prospecto.rfc = parData.rfc;
                prospecto.correo = parData.correo;
                prospecto.telefono = parData.telefono;
                prospecto.celular = parData.celular;
                //prospecto.idEstadoCivil = parData.idEstadoCivil;
                prospecto.dependientesEconomicos = parData.dependientesEconomicos;
                prospecto.nombreConyuge = parData.nombreConyuge;
                prospecto.tieneAuto = parData.tieneAuto;
                prospecto.cantidadAuto = parData.cantidadAuto;
                prospecto.marcaAuto = parData.marcaAuto;
                prospecto.modeloAuto = parData.modeloAuto;
                prospecto.status = parData.status;
                prospecto.fechaCreacion = parData.fechaCreacion;
                await DBContext.database.UpdateAsync(prospecto);
                await DBContext.Destroy();
                return Ok(prospecto);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}
