using DBContext.DBConfia;
using DBContext.DBConfia.Prospeccion;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.Prospeccion
{
    [Authorize]
    [ApiController]
    [Route("api/Prospeccion/[controller]")]
    public class ReferenciasController : ControllerBase
    {
        private DBConfiaContext ConexionBD;

        private IConfiguration Configuracion;

        public ReferenciasController(IConfiguration _Configuration, DBConfiaContext _DBContext)
        {
            this.Configuracion = _Configuration;
            ConexionBD = _DBContext;
        }

        [HttpPost]
        [Route("AddReferencia")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> AddReferencia(ConfiaWebApi.PeticionesRest.Prospeccion.Referencia.AddReferencia parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                ConexionBD.database.BeginTransaction();

                var Referencia = new Referencias() { 
                    PersonaID       = parData.prospectoID,
                    TipoPersonaID   = parData.TipoPersona,
                    Activo          = true,
                    celular         = parData.Celular,
                    domicilio       = parData.Domicilio.ToUpper(),
                    edad            = parData.Edad,
                    nombre          = parData.Nombre.ToUpper(),
                    primerApellido  = parData.PrimerApellido.ToUpper(),
                    segundoApellido = parData.SegundoApellido.ToUpper(),
                    parentesco      = parData.Parentezco.ToUpper(),
                    numeroReferencia= 1,
                };
                await ConexionBD.database.InsertAsync<Referencias>(Referencia);

                var prospecto = await ConexionBD.database.SingleByIdAsync<Prospectos>(parData.prospectoID);
                prospecto.StatusProcesoID = 6;
                prospecto.fechaUltimaActualizacion = DateTime.Now;
                await ConexionBD.database.UpdateAsync(prospecto);

                var TuberiaHistory = await ConexionBD.database.QueryAsync<Tuberia>("WHERE PersonaID=@0 AND StatusProcesoID = 6", parData.prospectoID).SingleOrDefaultAsync();

                if (TuberiaHistory == null)
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
                ConexionBD.database.CompleteTransaction();

                var res = new
                {
                    res = 1,
                    msj = $"Se Agregó la referencia al propspecto {parData.prospectoID}"
                };
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                ConexionBD.database.AbortTransaction();
                var res = new
                {
                    res = 0,
                    msj = $"Error al agregar la referencia al propspecto {ex.Message}"
                };
                await ConexionBD.Destroy();
                return Ok(res);
            }
        }

        [HttpPost]
        [Route("getByAval")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetByAval(ConfiaWebApi.PeticionesRest.Prospeccion.Referencia.getByAval parData)
        {
            try
            {
                var res = await ConexionBD.database.QueryAsync<Referencias>("WHERE PersonaID = @AvalID", parData).ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(res);
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
        [Code.TProteccionProducto]
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
                return Ok(Referencia);
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
        [Code.TProteccionProducto]
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
                return Ok(Referencia);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("Error al actualizar la referencia al aval " + ex.Message);
            }
        }
    }
}
