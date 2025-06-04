using ConfiaWebApi.PeticionesRest.Prospeccion.Referencia;
using DBContext.DBConfia;
using DBContext.DBConfia.Prospeccion;
using DBContext.DBConfia.Seguridad;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.AppProspeccion
{
    [Authorize]
    [ApiController]
    [Route("api/AppProspeccion/[controller]")]
    public class AppReferenciasController : ControllerBase
    {
        private DBConfiaContext ConexionBD;

        private IConfiguration Configuracion;

        public AppReferenciasController(IConfiguration _Configuration, DBConfiaContext _DBContext)
        {
            this.Configuracion = _Configuration;
            ConexionBD = _DBContext;
        }

        [HttpPost]
        [Route("addReferenciaProspecto")]
        [Authorize]
        public async Task<IActionResult> AddReferenciaProspecto(ConfiaWebApi.PeticionesRest.Prospeccion.Referencia.saveReferencia parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                ConexionBD.database.BeginTransaction();
                await guardarReferencia(parData);

                var TuberiaHistory = await ConexionBD.database.QueryAsync<Tuberia>("WHERE PersonaID=@0 AND StatusProcesoID = 6", parData.prospectoID).SingleOrDefaultAsync();

                if (TuberiaHistory == null)
                {
                    await saveTuberia(parData, UsuarioActual);
                }

                var resp = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = new { }
                };
                ConexionBD.database.CompleteTransaction();
                await ConexionBD.Destroy();
                return Ok(resp);

            }
            catch (Exception ex)
            {
                ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { error = "Error al obtener info " }
                });
            }
        }

        private async Task guardarReferencia(saveReferencia parData)
        {
            if (parData.ReferenciaID == 0)
            {
                await insertReferencia(parData);
            }
            else
            {
                await updateReferencia(parData);

            }
        }

        private async Task saveTuberia(saveReferencia parData, UsuariosVW UsuarioActual)
        {
            var Tuberia = new Tuberia()
            {
                PersonaID = parData.prospectoID,
                TipoPersonaID = 1,
                StatusProcesoID = 6,
                TuberiaResultadoID = 2,
                Validado = true,
                FechaRegistro = DateTime.Now,
                FechaValidacion = DateTime.Now,
                PersonaAnalistaID = (long)UsuarioActual.PersonaID,
                UsuarioAnalistaID = UsuarioActual.UsuarioID,
            };
            await ConexionBD.database.InsertAsync(Tuberia);
        }

        private async Task insertReferencia(saveReferencia parData)
        {
            var Referencia = new Referencias()
            {
                PersonaID = parData.prospectoID,
                TipoPersonaID = parData.TipoPersona,
                Activo = true,
                celular = parData.Celular,
                domicilio = parData.Domicilio.ToUpper(),
                edad = parData.Edad,
                nombre = parData.Nombre.ToUpper(),
                primerApellido = parData.PrimerApellido.ToUpper(),
                segundoApellido = parData.SegundoApellido.ToUpper(),
                parentesco = parData.Parentesco.ToUpper(),
                numeroReferencia = 1,
            };
            await ConexionBD.database.InsertAsync<Referencias>(Referencia);

            var prospecto = await ConexionBD.database.SingleByIdAsync<Prospectos>(parData.prospectoID);
            prospecto.StatusProcesoID = 6;
            await ConexionBD.database.UpdateAsync(prospecto);
        }

        private async Task updateReferencia(saveReferencia parData)
        {
            var Referencia = await ConexionBD.database.SingleByIdAsync<Referencias>(parData.ReferenciaID);
            Referencia.nombre = parData.Nombre.ToUpper();
            Referencia.primerApellido = parData.PrimerApellido.ToUpper();
            Referencia.segundoApellido = parData.SegundoApellido.ToUpper();
            Referencia.parentesco = parData.Parentesco.ToUpper();
            Referencia.edad = parData.Edad;
            Referencia.celular = parData.Celular;
            Referencia.domicilio = parData.Domicilio.ToUpper();
            await ConexionBD.database.UpdateAsync(Referencia);
        }

        [HttpPost]
        [Route("getReferenciaByPersonaID")]
        [Authorize]
        public async Task<IActionResult> GetReferenciaByPersonaID(ConfiaWebApi.PeticionesRest.Prospeccion.Referencia.getByReferenciaID parData)
        {
            try
            {
                var referencia = await ConexionBD.database.SingleOrDefaultAsync<ReferenciasApp_VW>("WHERE ReferenciaID = @ReferenciaID", parData);
                var resp = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = referencia
                };

                await ConexionBD.Destroy();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { error = "Error al obtener info " }
                });
            }
        }
        [HttpPost]
        [Route("getByAval")]
        [Authorize]
       // [Code.TProteccionProducto]
        public async Task<IActionResult> GetByAval(ConfiaWebApi.PeticionesRest.Prospeccion.Referencia.getByAval parData)
        {
            try
            {
                var res = await ConexionBD.database.QueryAsync<ReferenciasApp_VW>("WHERE PersonaID = @AvalID", parData).ToArrayAsync();
                var resp = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = res
                };
                await ConexionBD.Destroy();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }
        [HttpPost]
        [Route("getByReferenciaID")]
        [Authorize]
       // [Code.TProteccionProducto]
        public async Task<IActionResult> getByReferenciaID(ConfiaWebApi.PeticionesRest.Prospeccion.Referencia.getByReferenciaID parData)
        {
            try
            {
                var res = await ConexionBD.database.SingleOrDefaultAsync<ReferenciasApp_VW>("WHERE ReferenciaID = @ReferenciaID", parData);
                var resp = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = res
                };
                await ConexionBD.Destroy();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }
          [HttpPost]
        [Route("AddReferenciaAval")]
        [Authorize]
       // [Code.TProteccionProducto]
        public async Task<IActionResult> AddReferenciaAval(ConfiaWebApi.PeticionesRest.Prospeccion.Referencia.AddReferenciaAval parData)
        {
            try
            {
                var esAval = await ConexionBD.database.QueryAsync<Avales>("WHERE AvalID=@0", parData.PersonaID).FirstOrDefaultAsync();

                var Referencia = new Referencias()
                {
                    PersonaID = parData.PersonaID,
                    TipoPersonaID = esAval == null ? 1 : 3,
                    Activo = true,
                    celular = parData.Celular,
                    domicilio = parData.Domicilio.ToUpper(),
                    edad = parData.Edad,
                    nombre = parData.Nombre.ToUpper(),
                    primerApellido = parData.PrimerApellido.ToUpper(),
                    segundoApellido = parData.SegundoApellido.ToUpper(),
                    parentesco = parData.parentesco.ToUpper(),
                    numeroReferencia = 1,
                };
                await ConexionBD.database.InsertAsync<Referencias>(Referencia);
                await ConexionBD.Destroy();
                var resp = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = Referencia
                };
                return Ok(resp);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("Error al agregar la referencia al aval " + ex.Message); ;
            }
        }
        [HttpPost]
        [Route("UpdateReferenciaAval")]
        [Authorize]
        //[Code.TProteccionProducto]
        public async Task<IActionResult> UpdateReferenciaAval(ConfiaWebApi.PeticionesRest.Prospeccion.Referencia.UpdateReferenciaAval parData)
        {
            try
            {

                var Referencia = await ConexionBD.database.SingleByIdAsync<Referencias>(parData.ReferenciaID);
                Referencia.nombre = parData.Nombre.ToUpper();
                Referencia.primerApellido = parData.PrimerApellido.ToUpper();
                Referencia.segundoApellido = parData.SegundoApellido.ToUpper();
                Referencia.parentesco = parData.parentesco.ToUpper();
                Referencia.edad = parData.Edad;
                Referencia.celular = parData.Celular;
                Referencia.domicilio = parData.Domicilio.ToUpper();

                await ConexionBD.database.UpdateAsync(Referencia);
                await ConexionBD.Destroy();
                     var resp = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = Referencia
                };
                return Ok(resp);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("Error al actualizar la referencia al aval " + ex.Message);
            }
        }
    }
}