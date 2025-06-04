using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Prospeccion;
using DBContext.DBConfia.Catalogos;
using DBContext.DBConfia.Seguridad;
using System.IO;
using Microsoft.Extensions.Configuration;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using ConfiaWebApi.PeticionesRest.Prospeccion.Documentos;
using ConfiaWebApi.ModlesSP.Prospeccion;
using System.Net;
using System.Collections;
using DBContext.DBConfia.dbo;

namespace ConfiaWebApi.Controllers.Prospeccion.Interesados
{
    [Authorize]
    [ApiController]
    [Route("api/Prospeccion/[controller]")]
    public class InteresadosController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public InteresadosController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("add")]
        // [Authorize]
        // [Code.TProteccionProducto]
        public async Task<ActionResult> Add(PeticionesRest.Prospeccion.Interesados.Agregar parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var FechaNacimientoact = parData.FechaNacimiento.AddHours(+6);
                var promotor = await DBContext.database.QueryAsync<Promotores>("WHERE creditoPromotorId = @0", UsuarioActual.PersonaID).SingleOrDefaultAsync();
                if (promotor == null)
                {
                    throw new Exception("Usuario actual no es promotor de la sucursal");
                }

                var Interesados = new DBContext.DBConfia.Prospeccion.Interesados()
                {
                    Nombre = parData.Nombre.ToUpper(),
                    SucursalID = promotor.SucursalID,
                    ApellidoPaterno = parData.ApellidoPaterno.ToUpper(),
                    ApellidoMaterno = parData.ApellidoMaterno.ToUpper(),
                    FechaNacimiento = FechaNacimientoact,
                    SexoID = parData.SexoID,
                    TelefonoMovil = parData.TelefonoMovil,
                    LugarNacimiento = parData.LugarNacimiento.ToUpper(),
                    AsentamientoID = parData.AsentamientoID,
                    calle = parData.calle.ToUpper(),
                    localidad = parData.localidad.ToUpper(),
                    numeroExterior = parData.numeroExterior.ToUpper(),
                    TelefonoDomicilio = parData.TelefonoDomicilio,
                    InicioProceso = false,
                    CreacionFecha = DateTime.Now,
                    CreacionPersonaID = (long)UsuarioActual.PersonaID,
                    CreacionUsuarioID = UsuarioActual.UsuarioID,
                    CURP = parData.CURP.ToUpper(),
                    
                };
                await DBContext.database.InsertAsync(Interesados);

                var res = new
                {
                    res = 1,
                    msj = "Se creó la persona con el id: " + Interesados.InteresadosID,
                };

                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(new
                {
                    message = ex.Message,
                });
            }
        }

        [HttpPost]
        [Route("getInteresados")]
        // [Authorize]
        // [Code.TProteccionProducto]
        public async Task<IActionResult> Get()
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            var obj = new { CreacionUsuarioID = UsuarioActual.UsuarioID };
            try
            {
                var obj2 = await DBContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Interesados_VW>("WHERE CreacionUsuarioID = @0", obj.CreacionUsuarioID).ToArrayAsync();

                await DBContext.Destroy();
                return Ok(obj2);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        /**************************************************************************************************************************************************************************************************/
        /******************************************************************************VERIFICACION GERENTE************************************************************************************************/
        /**************************************************************************************************************************************************************************************************/
        [HttpGet]
        [Route("getVerifGerente")]
        // [Authorize]
        // [Code.TProteccionProducto]
        public async Task<IActionResult> Verifgerente()
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            var obj = new { CreacionUsuarioID = UsuarioActual.UsuarioID };
            try
            {
                var obj2 = await DBContext.database.QueryAsync<DBContext.DBConfia.General.Gerentes>("WHERE UsuarioID = @0", obj.CreacionUsuarioID).FirstOrDefaultAsync();
                await DBContext.Destroy();
                return Ok(obj2);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
        /**************************************************************************************************************************************************************************************************/
        /************************************************************************PETICION DE SUCURSALES POR GERENTE****************************************************************************************/
        /**************************************************************************************************************************************************************************************************/
        [HttpPost]
        [Route("getInteresadosGerente")]
        // [Code.TProteccionProducto]
        // [Authorize]
        public async Task<IActionResult> GetInteresadoGerente(PeticionesRest.Prospeccion.Interesados.InteresadoGerente pardata)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            try
            {
                var interesaos = await DBContext.database.QueryAsync<Interesados_VW>("WHERE CreacionUsuarioID = @0", UsuarioActual.UsuarioID).ToArrayAsync();
                await DBContext.Destroy();
                return Ok(interesaos);
            }
            catch
            {
                await DBContext.Destroy();
                return BadRequest("Error al obtener los interesados relacionados al gerente");
            }
        }
        /*************************************************************************************************************************************************************************************************/
        /*************************************************************************************************************************************************************************************************/
        [HttpPost]
        [Route("getInteresadosEdi")]
        // [Authorize]
        // [Code.TProteccionProducto]
        public async Task<IActionResult> GetIntereadosEdit(PeticionesRest.Prospeccion.Interesados.Update parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            var obj = new { CreacionUsuarioID = UsuarioActual.UsuarioID, parData.InteresadosID };

            try
            {
                var gerente = await DBContext.database.QueryAsync<DBContext.DBConfia.General.Gerentes>("WHERE UsuarioID=@0", UsuarioActual.UsuarioID).FirstOrDefaultAsync();

                if (gerente == null)
                {
                    var obj2 = await DBContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Interesados>("WHERE CreacionUsuarioID = @0 AND InteresadosID =@1", obj.CreacionUsuarioID, obj.InteresadosID).FirstOrDefaultAsync();
                    var objetoRealizado = (new
                    {
                        PersonaID = obj2.InteresadosID,
                        Nombre = obj2.Nombre,
                        ApellidoPaterno = obj2.ApellidoPaterno,
                        ApellidoMaterno = obj2.ApellidoMaterno,
                        SexoID = obj2.SexoID,
                        FechaNacimiento = obj2.FechaNacimiento,
                        LugarNacimiento = obj2.LugarNacimiento,
                        AsentamientoID = obj2.AsentamientoID,
                        TelefonoMovil = obj2.TelefonoMovil,
                        TelefonoDomicilio = obj2.TelefonoDomicilio,
                        calle = obj2.calle,
                        localidad = obj2.localidad,
                        numeroExterior = obj2.numeroExterior,
                        CURP = obj2.CURP,
                    });
                    await DBContext.Destroy();
                    return Ok(objetoRealizado);

                }
                else
                {
                    var obj2 = await DBContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Interesados>("WHERE InteresadosID =@0", obj.InteresadosID).FirstOrDefaultAsync();
                    var objetoRealizado = (new
                    {
                        PersonaID = obj2.InteresadosID,
                        Nombre = obj2.Nombre,
                        ApellidoPaterno = obj2.ApellidoPaterno,
                        ApellidoMaterno = obj2.ApellidoMaterno,
                        SexoID = obj2.SexoID,
                        FechaNacimiento = obj2.FechaNacimiento,
                        LugarNacimiento = obj2.LugarNacimiento,
                        AsentamientoID = obj2.AsentamientoID,
                        TelefonoMovil = obj2.TelefonoMovil,
                        TelefonoDomicilio = obj2.TelefonoDomicilio,
                        calle = obj2.calle,
                        localidad = obj2.localidad,
                        numeroExterior = obj2.numeroExterior,
                        CURP = obj2.CURP,

                    });
                    await DBContext.Destroy();
                    return Ok(objetoRealizado);
                }

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("update")]
        // [Authorize]
        // [Code.TProteccionProducto]
        public async Task<IActionResult> Update(PeticionesRest.Prospeccion.Interesados.Update parData)
        {
            try
            {
                var Interesados = await DBContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Interesados>("WHERE (InteresadosID = @0)", parData.InteresadosID).FirstOrDefaultAsync();

                Interesados.InicioProceso = parData.InicioProceso;

                await DBContext.database.UpdateAsync(Interesados);
                var res = await DBContext.database.QueryAsync<Interesados_VW>("WHERE (InteresadosID = @0)", Interesados.InteresadosID).FirstOrDefaultAsync();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
        /**************************************************************************************************************************************************************************************************/
        /******************************************************************************MIGRAR PROMOTOR************************************************************************************************/
        /**************************************************************************************************************************************************************************************************/

        //Traspasar Interesados
        [HttpPost]
        [Route("getInteresadosTraspaso")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetProspectos(PeticionesRest.Prospeccion.Interesados.GetInteresado parData)
        {
            try
            {
                var res = await DBContext.database.FetchAsync<Interesados_VW>("WHERE (CreacionPersonaID = @0) AND (InicioProceso = 1)", parData.CreacionPersonaID);
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

    }
}