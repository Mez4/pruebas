using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Sistema;
using DBContext.DBConfia.Seguridad;
using System.Collections;
using DBContext.DBConfia.dbo;
using DBContext.DBConfia.Distribuidores;
using DBContext.DBConfia.General;
using ConfiaWebApi.PeticionesRest.Aclaraciones.AnalistaSucursal;
using DBContext.DBConfia.Prospeccion;

namespace ConfiaWebApi.Controllers.Creditos
{
    [Authorize]
    [ApiController]
    [Route("api/Creditos/[controller]")]
    public class PromotorController : ControllerBase
    {
        private DBConfiaContext ConexionBD;

        public PromotorController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.Creditos.Promotor.Get parData)
        {
            if (parData.Id != 0)
            {
                try
                {
                    var Promotor = await ConexionBD.database.SingleByIdAsync<Promotores>(parData.Id);
                    var Usuario = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", Promotor.usuarioIdRegistro).FirstOrDefaultAsync();
                    // var Usuario = await ConexionBD.database.SingleByIdAsync<USER_ENTITY>(Promotor.usuarioIdRegistro);

                    var res = new
                    {
                        Promotor.creditoPromotorId,
                        Promotor.creditoPromotorNombre,
                        Promotor.activo,
                        fhRegistro = Promotor.fhRegistro.ToString("dd/MM/yyyy"),
                        Promotor.usuarioIdRegistro,
                        Usuario = new
                        {
                            UsuarioID = Usuario.UsuarioID,
                            Usuario = Usuario.Usuario,
                            Nombre = Usuario.Nombre
                        }
                    };

                    await ConexionBD.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await ConexionBD.Destroy();
                    return NotFound(ex.Message);
                }

            }
            else
            {
                try
                {
                    int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
                    var Promotor = await ConexionBD.database.FetchAsync<Promotores>("SELECT p.* FROM Creditos.Promotores p WHERE p.ProductoID = @0", ProductoID);
                    var Usuarios = await ConexionBD.database.FetchAsync<UsuariosVW>();

                    ArrayList res = new();

                    foreach (var T in Promotor)
                    {
                        var Usuario = Usuarios.Where(x => x.UsuarioID == T.usuarioIdRegistro).FirstOrDefault();
                        var sucursal = (await T.CH__SUCURSAL(ConexionBD)).FirstOrDefault();
                        res.Add(new
                        {
                            T.creditoPromotorId,
                            T.creditoPromotorNombre,
                            T.activo,
                            fhRegistro = T.fhRegistro.ToString("dd/MM/yyyy"),
                            T.usuarioIdRegistro,
                            sucursal,
                            Usuario = new
                            {
                                UsuarioID = Usuario.UsuarioID,
                                Usuario = Usuario.Usuario,
                                Nombre = Usuario.Nombre
                            }
                        });
                    }

                    await ConexionBD.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await ConexionBD.Destroy();
                    return BadRequest(ex.Message);
                }
            }
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(PeticionesRest.Creditos.Promotor.Add parData)
        {
            try
            {
                var fhRegistro = DateTime.Now;
                //var usuarioIdRegistro = int.Parse(HttpContext.User.Claims.Where(x => x.Type == "Id").FirstOrDefault().Value);
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                // var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                //var UsuarioActual = await DBContext.database.QueryAsync<USER_ENTITY>("WHERE EMAIL=@0", UserName).FirstOrDefaultAsync();
                //var PersonaActual = await DBContext.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.ID).FirstOrDefaultAsync();

                var Promotor = new Promotores()
                {
                    creditoPromotorNombre = parData.creditoPromotorNombre,
                    activo = parData.activo,
                    fhRegistro = fhRegistro,
                    usuarioIdRegistro = UsuarioActual.UsuarioID
                };

                await ConexionBD.database.InsertAsync(Promotor);

                var Usuario = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", Promotor.usuarioIdRegistro).FirstOrDefaultAsync();

                var res = new
                {
                    Promotor.creditoPromotorId,
                    Promotor.creditoPromotorNombre,
                    Promotor.activo,
                    fhRegistro = Promotor.fhRegistro.ToString("dd/MM/yyyy"),
                    Promotor.usuarioIdRegistro,
                    Usuario = new
                    {
                        Usuario.UsuarioID,
                        Usuario.Usuario,
                        Usuario.Nombre
                    }
                };

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
        [Route("AddPromotor")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> AddPromotor(PeticionesRest.Creditos.Promotor.AddPromotor parData)
        {
            try
            {
                var fhRegistro = DateTime.Now;
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());

                var UsuarioPromotor = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", parData.UsuarioID).FirstOrDefaultAsync();
                var sucursalPromotor = await ConexionBD.database.QueryAsync<DBContext.DBConfia.General.Sucursales>("WHERE SucursalID=@0", parData.SucursalID).FirstOrDefaultAsync();

                var Promotor = new Promotores()
                {
                    creditoPromotorId = UsuarioPromotor.PersonaID ?? 0,
                    creditoPromotorNombre = UsuarioPromotor.NombreCompleto,
                    activo = true,
                    fhRegistro = fhRegistro,
                    usuarioIdRegistro = UsuarioActual.UsuarioID,
                    SucursalID = parData.SucursalID,
                    ProductoID = ProductoID
                };
                await ConexionBD.database.InsertAsync(Promotor);

                var Usuario = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", Promotor.usuarioIdRegistro).FirstOrDefaultAsync();

                var BitAccesoPromotoria = await ConexionBD.database.QueryAsync<Usuarios>("WHERE UsuarioID=@0", parData.UsuarioID).FirstOrDefaultAsync();
                BitAccesoPromotoria.AccesoAppPromotoria = true;
                await ConexionBD.database.UpdateAsync(BitAccesoPromotoria);

                var res = new
                {
                    Promotor.creditoPromotorId,
                    Promotor.creditoPromotorNombre,
                    Promotor.activo,
                    fhRegistro = Promotor.fhRegistro.ToString("dd/MM/yyyy"),
                    Promotor.usuarioIdRegistro,
                    sucursal = new
                    {
                        sucursalPromotor.SucursalID,
                        sucursalPromotor.Nombre
                    },
                    Usuario = new
                    {
                        Usuario.UsuarioID,
                        Usuario.Usuario,
                        Usuario.Nombre
                    }
                };

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
        [Route("update")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Update(PeticionesRest.Creditos.Promotor.Update parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                parData.UsuarioActualizaID = UsuarioActual.UsuarioID;

                var storedProcedure = "EXEC Seguridad.pa_UpdatePromotor @PromotorID, @UsuarioActualizaID, @Activo, @SucursalID";
                // Actualiza el usuario
                var resultado = await ConexionBD.database.QueryAsync<dynamic>(storedProcedure, parData).FirstOrDefaultAsync();
                // Cerramos las conexiones
                await this.ConexionBD.Destroy();

                // Regresamos el mensaje de respuesta del sp
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return BadRequest("Error al actualizar promotor: " + ex.Message);
            }
        }

        //Obtener Promotores
        [HttpPost]
        [Route("getPromotores")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetPromotoresAdm(PeticionesRest.Creditos.Promotor.GetPromotor parData)
        {
            try
            {
                var res = await ConexionBD.database.FetchAsync<Promotores_VW>("WHERE (Activo = 1)", parData);
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }

        }

        //Sucursales - Promotores 
        [HttpPost]
        [Route("getBySucursal")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetBySucursal(PeticionesRest.Creditos.Promotor.GetSucursal parData)
        {
            try
            {
                var res = await ConexionBD.database.FetchAsync<Promotores_VW>("WHERE  (SucursalID = @SucursalID) AND Activo = 1", parData);
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("get2")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get2(PeticionesRest.Creditos.Promotor.GetPromotor parData)
        {

            var res = await ConexionBD.database.QueryAsync<Promotores_VW>("WHERE  (ProductoID = @ProductoID OR @ProductoID = 0) AND (SucursalID = @SucursalID OR " +
            "@SucursalID = 0) AND (creditoPromotorId = @creditoPromotorId OR " +
            "@creditoPromotorId = 0) AND (Activo = 1) ", parData).ToArrayAsync();
            await ConexionBD.Destroy();
            return Ok(res);
        }

        //Traspasar Prospectos a Promotor.
        [HttpPost]
        [Route("traspasarProspecto")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> TraspasarProspecto(PeticionesRest.Creditos.Promotor.TraspasarProspecto parData)
        {
            try
            {
                if (parData.PromotorID == parData.PromotorDestinoID)
                {
                    var res = new
                    {
                        res = 0,
                        msj = "El Promotor Origen y el Promotor Destino es el mismo",
                        Data = new { }
                    };
                    await ConexionBD.Destroy();
                    return Ok(res);
                }
                else
                {

                    var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                    var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                    var Prospectos = await ConexionBD.database.QueryAsync<Prospectos>("WHERE ProspectoID IN (@1)", parData.PromotorID, parData.Prospectos).OrderBy(x => x.ProspectoID).ToArrayAsync();

                    var PromotorUsuario = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE PersonaID=@0", parData.PromotorDestinoID).FirstOrDefaultAsync();

                    foreach (var Traspaso in Prospectos)
                    {
                        // Traspaso.Activo = false; 
                        //Detalle.UsuarioModificoID = UsuarioActual.UsuarioID;
                        //Detalle.FechaModificacion = DateTime.Now;
                        await ConexionBD.database.UpdateAsync(Traspaso);

                        //Aquí
                        var TraspasoDestino = await ConexionBD.database.QueryAsync<Prospectos>(" WHERE ProspectoID = @1", parData.PromotorDestinoID, Traspaso.ProspectoID).FirstOrDefaultAsync();

                        if (TraspasoDestino != null)
                        {
                            Traspaso.PromotorPersonaID = parData.PromotorDestinoID;
                            TraspasoDestino.Activo = true;
                            Traspaso.PromotorUsuarioID = PromotorUsuario.UsuarioID;
                            //DetalleDestino.UsuarioModificoID = UsuarioActual.UsuarioID;
                            TraspasoDestino.fechaUltimaActualizacion = DateTime.Now;
                            TraspasoDestino.Reasignar = true;
                            await ConexionBD.database.UpdateAsync(Traspaso);
                        }
                        else
                        {
                            TraspasoDestino = new()
                            {
                                PromotorPersonaID = parData.PromotorDestinoID,
                                ProspectoID = Traspaso.ProspectoID,
                                Activo = true,
                                //UsuarioCreoID = UsuarioActual.UsuarioID,
                                Reasignar = true,
                                fechaCreacion = DateTime.Now
                            };
                            await ConexionBD.database.InsertAsync(TraspasoDestino);
                        }
                    }

                    var Data = await ConexionBD.database.FetchAsync<Prospectos_VW>("WHERE Activo = 1", parData.PromotorID);

                    var res = new
                    {
                        res = 1,
                        msj = "El Promotor Origen y el Promotor Destino es el mismo.",
                        Data
                    };

                    await ConexionBD.Destroy();
                    return Ok(res);
                }
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("traspasarInteresado")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> TraspasarInteresado(PeticionesRest.Creditos.Promotor.TraspasarInteresado parData)
        {
            try
            {
                if (parData.PromotorID == parData.PromotorDestinoID)
                {
                    var res = new
                    {
                        res = 0,
                        msj = "El Promotor Origen y el Promotor Destino es el mismo",
                        Data = new { }
                    };
                    await ConexionBD.Destroy();
                    return Ok(res);
                }
                else
                {

                    var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                    var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                    var Prospectos = await ConexionBD.database.QueryAsync<Interesados>("WHERE InteresadosID IN (@1)", parData.PromotorID, parData.Interesados).OrderBy(x => x.InteresadosID).ToArrayAsync();

                    foreach (var Traspaso in Prospectos)
                    {
                        // Traspaso.InicioProceso = false; 
                        //Detalle.UsuarioModificoID = UsuarioActual.UsuarioID;
                        //Detalle.FechaModificacion = DateTime.Now;
                        await ConexionBD.database.UpdateAsync(Traspaso); //Aquí

                        //Aquí
                        var TraspasoDestino = await ConexionBD.database.QueryAsync<Interesados>(" WHERE InteresadosID = @1", parData.PromotorDestinoID, Traspaso.InteresadosID).FirstOrDefaultAsync();

                        if (TraspasoDestino != null)
                        {
                            Traspaso.CreacionPersonaID = parData.PromotorDestinoID;
                            TraspasoDestino.InicioProceso = true;
                            //DetalleDestino.UsuarioModificoID = UsuarioActual.UsuarioID;
                            // TraspasoDestino.fechaUltimaActualizacion = DateTime.Now;
                            // TraspasoDestino.Reasignar = true;
                            await ConexionBD.database.UpdateAsync(Traspaso);
                        }
                        else
                        {
                            TraspasoDestino = new()
                            {
                                CreacionPersonaID = parData.PromotorDestinoID,
                                InteresadosID = Traspaso.InteresadosID,
                                InicioProceso = true,
                                //UsuarioCreoID = UsuarioActual.UsuarioID,
                                //Reasignar = true,
                                CreacionFecha = DateTime.Now
                            };
                            await ConexionBD.database.InsertAsync(TraspasoDestino);
                        }
                    }

                    var Data = await ConexionBD.database.FetchAsync<Interesados_VW>("WHERE InicioProceso = 1", parData.PromotorID);

                    var res = new
                    {
                        res = 1,
                        msj = "El Promotor Origen y el Promotor Destino es el mismo.",
                        Data
                    };

                    await ConexionBD.Destroy();
                    return Ok(res);
                }
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

    }

}
