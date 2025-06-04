using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using ConfiaWebApi.PeticionesRest.SOMA.TraspasoEntreCuentasZonales;
using ConfiaWebApi.PeticionesRest.Creditos.CanjeaVale;
using DBContext.DBConfia.Distribuidores;

namespace ConfiaWebApi.Controllers.Creditos
{
    [Authorize]
    [ApiController]
    [Route("api/Creditos/[controller]")]
    public class GrupoDetalleController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public GrupoDetalleController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.Creditos.GruposDetalle.Get parData)
        {
            if (parData.GrupoID != 0)
            {
                try
                {
                    var resS = await DBContext.database.FetchAsync<GruposDetalle_VW>("WHERE (GrupoID = @0) AND (Estatus = 1) AND ((Reasignar is Null ) OR (Reasignar = 0) OR (Reasignar = 1))", parData.GrupoID);
                    await DBContext.Destroy();
                    return Ok(resS);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }
            }

            var res = await DBContext.database.FetchAsync<GruposDetalle_VW>();
            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("getAgregarSocias")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetAgregarSocias(PeticionesRest.Creditos.GruposDetalle.Get parData)
        {
            try
            {
                var resS = await DBContext.database.FetchAsync<GruposDetalle_VW>("WHERE (GrupoID = @0) AND (Estatus = 1)", parData.GrupoID);
                await DBContext.Destroy();
                return Ok(resS);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }
        [HttpPost]
        [Route("getDistribuidores")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getDistribuidores(PeticionesRest.Creditos.GruposDetalle.GetDistribuidores parData)
        {
            try
            {
                if (parData.tipoUsuario == 3)
                {
                    var resS = await DBContext.database.FetchAsync<GruposDistribuidores_VW>("WHERE (ProductoID = @ProductoID OR @ProductoID=0) AND (SucursalID=@SucursalID OR @SucursalID=0) AND (ConGrupo = 0) ", parData);
                    await DBContext.Destroy();
                    return Ok(resS);
                }
                else
                {
                    var resS = await DBContext.database.FetchAsync<GruposDistribuidores_VW>("WHERE (ProductoID = @ProductoID OR @ProductoID=0) AND (SucursalID=@SucursalID OR @SucursalID=0) AND (ConGrupo = 0)", parData);
                    await DBContext.Destroy();
                    return Ok(resS);
                }
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("getReasignar")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getReasignar(PeticionesRest.Creditos.GruposDetalle.Get parData)
        {
            if (parData.GrupoID != 0)
            {
                try
                {
                    var resS = await DBContext.database.FetchAsync<GruposDetalle_VW>("WHERE (GrupoID = @0) AND (Estatus = 1) AND ((Reasignar is Null ) OR (Reasignar = 0))", parData.GrupoID);
                    await DBContext.Destroy();
                    return Ok(resS);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }
            }

            var res = await DBContext.database.FetchAsync<GruposDetalle_VW>();
            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("getdistribuidor")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Getdistribuidor(PeticionesRest.Creditos.GruposDetalle.Get parData)
        {
            try
            {
                var res = await DBContext.database.QueryAsync<GruposDetalle_VW>("WHERE (DistribuidorID = @DistribuidorID) AND (SucursalID = @SucursalID OR @SucursalID = 0) AND" +
                "(ProductoID = @ProductoID  OR @ProductoID = 0) AND (Estatus = 1)", parData).FirstOrDefaultAsync();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(PeticionesRest.Creditos.GruposDetalle.Add parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var GruposDetalle = await DBContext.database.QueryAsync<GruposDetalle_VW>("WHERE (DistribuidorID = @1) AND (Estatus = 1)", parData.GrupoID, parData.DistribuidorID).FirstOrDefaultAsync();

                if (GruposDetalle != null)
                {
                    var res = new
                    {
                        res = 0,
                        msj = "La socia ya se encuentra asignado al grupo: " + GruposDetalle.GrupoID.ToString(),
                        Data = GruposDetalle
                    };
                    await DBContext.Destroy();
                    return Ok(res);
                }
                else
                {
                    GruposDetalle gruposDetalle = new()
                    {
                        GrupoID = parData.GrupoID,
                        DistribuidorID = parData.DistribuidorID,
                        Estatus = parData.Estatus,
                        UsuarioCreoID = UsuarioActual.UsuarioID,
                        FechaCreacion = DateTime.Now
                    };

                    await DBContext.database.InsertAsync(gruposDetalle);

                    var obj = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Distribuidores.Distribuidores>(parData.DistribuidorID);
                    obj.ConGrupo = true;
                    await DBContext.database.UpdateAsync(obj);

                    GruposDetalle = await DBContext.database.QueryAsync<GruposDetalle_VW>("WHERE (GrupoID = @0) AND (DistribuidorID = @1)", gruposDetalle.GrupoID, gruposDetalle.DistribuidorID).FirstOrDefaultAsync();

                    var res = new
                    {
                        res = 1,
                        msj = "La socia fue asignado al grupo: " + GruposDetalle.GrupoID.ToString(),
                        Data = GruposDetalle
                    };

                    await DBContext.Destroy();
                    return Ok(res);
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
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Update(PeticionesRest.Creditos.GruposDetalle.Update parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var GruposDetalle = await DBContext.database.SingleByIdAsync<GruposDetalle>(parData.GrupoID);
                GruposDetalle.GrupoID = parData.GrupoID;
                GruposDetalle.DistribuidorID = parData.DistribuidorID;
                GruposDetalle.Estatus = parData.Estatus;
                GruposDetalle.UsuarioModificoID = UsuarioActual.UsuarioID;
                GruposDetalle.FechaModificacion = DateTime.Now;
                await DBContext.database.UpdateAsync(GruposDetalle);
                var res = await DBContext.database.QueryAsync<GruposDetalle_VW>("WHERE (GrupoID = @0) AND (DistribuidorID = @1)", GruposDetalle.GrupoID, GruposDetalle.DistribuidorID).FirstOrDefaultAsync();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("traspasar")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Traspasar(PeticionesRest.Creditos.GruposDetalle.Traspasar parData)
        {
            try
            {
                if (parData.GrupoID == parData.GrupoDestinoID)
                {
                    var res = new
                    {
                        res = 0,
                        msj = "El grupo origen y el grupo destino es el mismo",
                        Data = new { }
                    };
                    await DBContext.Destroy();
                    return Ok(res);
                }
                else
                {

                    var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                    var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                    int ProductoID = 9999;
                    int.TryParse(Request.Headers["ProductoID"], out ProductoID);

                    var coordinador_emisor = await DBContext.database.QueryAsync<Coordinadores>("WHERE GrupoID = @0", parData.GrupoID).FirstOrDefaultAsync();
                    if (coordinador_emisor == null)
                    {
                        return BadRequest(new
                        {
                            res = 0,
                            msj = "El coordinador no tiene grupo asignado",
                            data = new { }
                        });

                    }
                    var coordinador_receptor = await DBContext.database.QueryAsync<Coordinadores>("WHERE GrupoID = @0", parData.GrupoDestinoID).FirstOrDefaultAsync();
                    if (coordinador_receptor == null)
                    {
                        return BadRequest(new
                        {
                            res = 0,
                            msj = "",
                            data = new { }
                        });
                    }
                    var colocadoSocia = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.Contratos>("WHERE DistribuidorID IN (@0) AND ProductoID = @1", parData.Distribuidores, ProductoID).ToArrayAsync();
                    var GruposDetalle = await DBContext.database.QueryAsync<GruposDetalle>("WHERE (GrupoID = @0) AND DistribuidorID IN (@1)", parData.GrupoID, parData.Distribuidores).OrderBy(x => x.DistribuidorID).ToArrayAsync();

                    // Hacemos una sumatoria de los montos de los contratos de las socias a traspasar
                    decimal MontoTotal = 0;
                    foreach (var item in colocadoSocia)
                    {
                        MontoTotal += item.LineaCredito;
                    }
                    // Insertamos en la tabla de distribuidoras.traspasosocia
                    var traspaso = new TraspasoSocia
                    {
                        Colocado = MontoTotal,
                        Distribuidoras = parData.Distribuidores.Count(),
                        CoordinadorID_emisor = coordinador_emisor.CoordinadorID,
                        SucursalID_emisor = coordinador_emisor.SucursalID,
                        CoordinadorID_receptor = coordinador_receptor.CoordinadorID,
                        SucursalID_receptor = coordinador_receptor.SucursalID,
                        Fecha_registro = DateTime.Now,
                        UsuarioCreador = UsuarioActual.UsuarioID,
                        tipoTraspasoID = parData.tipotraspaso
                    };
                    //Insertamos en la tabla
                    await DBContext.database.InsertAsync(traspaso);
                    // obtener el id del registro de anterior
                    var idTraspaso = traspaso.TraspasoSociaID;

                    foreach (var detalletraspaso in colocadoSocia)
                    {
                        var traspasoDetalle = new TraspasoSociaDetalle
                        {
                            TraspasoSociaID = idTraspaso,
                            DistribuidorID = detalletraspaso.DistribuidorID.Value,
                            Colocado = detalletraspaso.LineaCredito
                        };
                        await DBContext.database.InsertAsync(traspasoDetalle);

                    }

                    foreach (var Detalle in GruposDetalle)
                    {
                        Detalle.Estatus = false;
                        Detalle.UsuarioModificoID = UsuarioActual.UsuarioID;
                        Detalle.FechaModificacion = DateTime.Now;
                        await DBContext.database.UpdateAsync(Detalle);

                        var DetalleDestino = await DBContext.database.QueryAsync<GruposDetalle>("WHERE (GrupoID = @0) AND (DistribuidorID = @1)", parData.GrupoDestinoID, Detalle.DistribuidorID).FirstOrDefaultAsync();

                        if (DetalleDestino != null)
                        {
                            DetalleDestino.Estatus = true;
                            DetalleDestino.UsuarioModificoID = UsuarioActual.UsuarioID;
                            DetalleDestino.FechaModificacion = DateTime.Now;
                            DetalleDestino.Reasignar = true;
                            await DBContext.database.UpdateAsync(DetalleDestino);
                        }
                        else
                        {
                            DetalleDestino = new()
                            {
                                GrupoID = parData.GrupoDestinoID,
                                DistribuidorID = Detalle.DistribuidorID,
                                Estatus = true,
                                UsuarioCreoID = UsuarioActual.UsuarioID,
                                Reasignar = true,
                                FechaCreacion = DateTime.Now
                            };
                            await DBContext.database.InsertAsync(DetalleDestino);
                        }
                    }

                    var Data = await DBContext.database.FetchAsync<GruposDetalle_VW>("WHERE (GrupoID = @0) AND (Estatus = 1)", parData.GrupoID);

                    var res = new
                    {
                        res = 1,
                        msj = "El grupo origen y el grupo destino es el mismo.",
                        Data
                    };

                    await DBContext.Destroy();
                    return Ok(res);
                }
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("TipoUsuario")]
        [Authorize]
        // [Code.TProteccionProducto]
        public async Task<IActionResult> TipoUsuario()
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();


                var stored = "SELECT Creditos.GetTipoUsuario(@0) as [tipoUsuario]";
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.PeticionesRest.Creditos.Reportes.TipoUsuarioRelaciones>(stored, UsuarioActual.UsuarioID).FirstOrDefaultAsync();

                await DBContext.Destroy();

                var obj = new
                {
                    res.tipoUsuario,
                };

                return Ok(obj);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}

