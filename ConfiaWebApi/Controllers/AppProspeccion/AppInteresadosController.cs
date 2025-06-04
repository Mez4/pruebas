using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Prospeccion;
using DBContext.DBConfia.Seguridad;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace ConfiaWebApi.Controllers.AppProspeccion
{
    [Authorize]
    [ApiController]
    [Route("api/AppProspeccion/[controller]")]
    public class AppInteresadosController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public AppInteresadosController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("getInteresados")]
        [Authorize]
        public async Task<IActionResult> GetInteresados()
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosApp_VW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            var obj = new { CreacionUsuarioID = UsuarioActual.UsuarioID };
            try
            {
                var data = await DBContext.database.QueryAsync<InteresadosApp_VW>("WHERE CreacionUsuarioID = @0 AND InicioProceso = @1 AND  (Descartado = 0 OR Descartado is NULL) ORDER BY CreacionFecha desc", obj.CreacionUsuarioID, false).ToArrayAsync();
                var resp = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                await DBContext.Destroy();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { error = "Error al obtener la lista de interesados " }
                });
            }
        }
        [HttpPost]
        [Route("getInteresadosDescartados")]
        [Authorize]
        public async Task<IActionResult> GetInteresadosDescartados()
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosApp_VW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            var obj = new { CreacionUsuarioID = UsuarioActual.UsuarioID };
            try
            {
                var data = await DBContext.database.QueryAsync<InteresadosApp_VW>("WHERE CreacionUsuarioID = @0 AND InicioProceso = @1 AND Descartado = 1", obj.CreacionUsuarioID, false).ToArrayAsync();
                var resp = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                await DBContext.Destroy();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { error = "Error al obtener la lista de interesados " }
                });
            }
        }

        [HttpPost]
        [Route("setDescartadoByIdInteresado")]
        [Authorize]
        public async Task<IActionResult> setDescartadoByIdInteresado(PeticionesRest.Prospeccion.Interesados.UpdateDescartado parData)
        {
            try
            {
                DBContext.database.BeginTransaction();
                var Interesados = await DBContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Interesados>("WHERE (InteresadosID = @0) AND InicioProceso = 0", parData.InteresadosID).FirstOrDefaultAsync();
                if (parData.Descartado == true && Interesados != null)
                {
                    Interesados.FechaDescarte = DateTime.Now;
                    Interesados.ObservacionesDescartado = parData.ObservacionesDescartado;
                    Interesados.Descartado = true;
                    await DBContext.database.UpdateAsync(Interesados);
                }
                else if (Interesados == null)
                {
                    var resps = new
                    {
                        resultCode = -1,
                        resultDesc = "OK.",
                        msj = "Interesado no encontrado",
                        data = new { }
                    };

                    await DBContext.Destroy();
                    return Ok(resps);
                }
                else
                {
                    Interesados.FechaDescarte = DateTime.Parse("01-01-1990");
                    Interesados.ObservacionesDescartado = "N/A";
                    Interesados.Descartado = false;
                    await DBContext.database.UpdateAsync(Interesados);
                }


                DBContext.database.CompleteTransaction();
                var data = await DBContext.database.QueryAsync<InteresadosApp_VW>("WHERE (InteresadosID = @0) AND InicioProceso = 0", Interesados.InteresadosID).FirstOrDefaultAsync();
                var resp = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                await DBContext.Destroy();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                DBContext.database.AbortTransaction();
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { error = "Error al actualizar la informacion" }
                });
            }
        }

        [HttpPost]
        [Route("getIntereadoByID")]
        [Authorize]
        public async Task<IActionResult> GetIntereadoByID(PeticionesRest.Prospeccion.Interesados.Update parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosApp_VW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            var obj = new { CreacionUsuarioID = UsuarioActual.UsuarioID, parData.InteresadosID };

            try
            {
                var gerente = await DBContext.database.QueryAsync<DBContext.DBConfia.General.Gerentes>("WHERE UsuarioID=@0", UsuarioActual.UsuarioID).FirstOrDefaultAsync();

                if (gerente == null)
                {
                    var interesado = await DBContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.InteresadosDetalleApp_VW>("WHERE CreacionUsuarioID = @0 AND InteresadosID =@1", obj.CreacionUsuarioID, obj.InteresadosID).FirstOrDefaultAsync();
                    var data = (new
                    {
                        PersonaID = interesado.InteresadosID,
                        interesado.Nombre,
                        interesado.ApellidoPaterno,
                        interesado.ApellidoMaterno,
                        interesado.SexoID,
                        interesado.FechaNacimiento,
                        interesado.LugarNacimiento,
                        interesado.AsentamientoID,
                        interesado.TelefonoMovil,
                        interesado.TelefonoDomicilio,
                        interesado.calle,
                        interesado.localidad,
                        interesado.numeroExterior,
                        interesado.estadoPaisId,
                        interesado.CodigoPostal
                    });
                    var resp = new
                    {
                        resultCode = 0,
                        resultDesc = "OK.",
                        data
                    };

                    await DBContext.Destroy();
                    return Ok(resp);

                }
                else
                {
                    var interesado = await DBContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.InteresadosDetalleApp_VW>("WHERE InteresadosID =@0", obj.InteresadosID).FirstOrDefaultAsync();
                    var data = (new
                    {
                        PersonaID = interesado.InteresadosID,
                        interesado.Nombre,
                        interesado.ApellidoPaterno,
                        interesado.ApellidoMaterno,
                        interesado.SexoID,
                        interesado.FechaNacimiento,
                        interesado.LugarNacimiento,
                        interesado.AsentamientoID,
                        interesado.TelefonoMovil,
                        interesado.TelefonoDomicilio,
                        interesado.calle,
                        interesado.localidad,
                        interesado.numeroExterior,
                        interesado.estadoPaisId,
                        interesado.CodigoPostal
                    });
                    var resp = new
                    {
                        resultCode = 0,
                        resultDesc = "OK.",
                        data
                    };

                    await DBContext.Destroy();
                    return Ok(resp);
                }

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { error = "Error al obtener la informacion del interesado " }
                });
            }
        }

        [HttpPost]
        [Route("setInteresadoInicioProceso")]
        [Authorize]
        public async Task<IActionResult> SetInteresadoInicioProceso(PeticionesRest.Prospeccion.Interesados.Update parData)
        {
            try
            {
                var Interesados = await DBContext.database.QueryAsync<Interesados>("WHERE (InteresadosID = @0)", parData.InteresadosID).FirstOrDefaultAsync();

                Interesados.InicioProceso = parData.InicioProceso;

                await DBContext.database.UpdateAsync(Interesados);
                var data = await DBContext.database.QueryAsync<InteresadosApp_VW>("WHERE (InteresadosID = @0)", Interesados.InteresadosID).FirstOrDefaultAsync();
                var resp = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                await DBContext.Destroy();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { error = "Error al actualizar la informacion" }
                });
            }
        }

        [HttpPost]
        [Route("insertInteresado")]
        [Authorize]
        public async Task<ActionResult> InsertInteresado(PeticionesRest.Prospeccion.Interesados.Agregar parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<UsuariosApp_VW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var FechaNacimientoact = parData.FechaNacimiento.AddHours(+6);
                var promotor = await DBContext.database.QueryAsync<Promotores>("WHERE creditoPromotorId = @0", UsuarioActual.PersonaID).SingleOrDefaultAsync();


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
                    Descartado = false,
                    ObservacionesDescartado = "N/A",
                    FechaDescarte = DateTime.Parse("01-01-1990")
                };
                await DBContext.database.InsertAsync(Interesados);

                var resp = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = new { }
                };

                await DBContext.Destroy();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
        [HttpPost]
        [Route("UpdateInteresado")]
        [Authorize]
        public async Task<ActionResult> UpdateInteresado(PeticionesRest.Prospeccion.Interesados.Agregar parData)
        {
            try
            {
                var FechaNacimientoact = parData.FechaNacimiento.AddHours(+6);
                var Interesados = await DBContext.database.QueryAsync<DBContext.DBConfia.Prospeccion.Interesados>("WHERE (InteresadosID = @0)", parData.interesadoId).FirstOrDefaultAsync();
                Interesados.Nombre = parData.Nombre.ToUpper();
                Interesados.ApellidoPaterno = parData.ApellidoPaterno.ToUpper();
                Interesados.ApellidoMaterno = parData.ApellidoMaterno.ToUpper();
                Interesados.FechaNacimiento = FechaNacimientoact;
                Interesados.SexoID = parData.SexoID;
                Interesados.TelefonoMovil = parData.TelefonoMovil;
                Interesados.LugarNacimiento = parData.LugarNacimiento.ToUpper();
                Interesados.AsentamientoID = parData.AsentamientoID;
                Interesados.calle = parData.calle.ToUpper();
                Interesados.localidad = parData.localidad.ToUpper();
                Interesados.numeroExterior = parData.numeroExterior.ToUpper();
                Interesados.TelefonoDomicilio = parData.TelefonoDomicilio;
                await DBContext.database.UpdateAsync(Interesados);
                var data = await DBContext.database.QueryAsync<InteresadosApp_VW>("WHERE (InteresadosID = @0)", Interesados.InteresadosID).FirstOrDefaultAsync();
                var resp = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                await DBContext.Destroy();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { error = "Error al actualizar la informacion" }
                });
            }
        }
    }
}