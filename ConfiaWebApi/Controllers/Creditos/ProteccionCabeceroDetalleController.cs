using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Sistema;
using System.Collections;
using System.Collections.Generic;
using DBContext.DBConfia.Seguridad;
using DBContext.DBConfia.dbo;

namespace ConfiaWebApi.Controllers.Creditos
{
    [Authorize]
    [ApiController]
    [Route("api/Creditos/[controller]")]
    public class ProteccionCabeceroDetalleController : ControllerBase
    {
        private DBConfiaContext ConexionBD;

        public ProteccionCabeceroDetalleController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }



        [HttpPost]
        [Route("getRelaciones")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getRelaciones(PeticionesRest.Creditos.ProteccionRelacion.Get parData)
        {


            try
            {
                var obj = await ConexionBD.database.FetchAsync<ProteccionesRelacion_VW>("Where ProteccionCabeceroDetalle = @ProteccionCabeceroDetalle", parData);
                //var ComisionesDetalle = await DBContext.database.FetchAsync<ComisionesDetalle>();


                ArrayList res = new();

                foreach (var T in obj)
                {
                    res.Add(new
                    {
                        T.ProteccionIDDetalle,
                        T.ProteccionCabeceroDetalle,
                        T.ProteccionDetalle,
                        T.MinimoDetalle,
                        T.MaximoDetalle,
                        T.MontoDetalle,
                        T.NivelOrigenDetalle,
                        T.DistribuidorNivelDetalle,
                        T.DescripcionDetalle,
                        FechaCapturaDetalle = T.FechaCapturaDetalle.ToString("dd/MM/yyyy"),
                        T.NombreCapturaDetalle,
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

        /*[HttpPost]
        [Route("getRelaciones")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getRelaciones(PeticionesRest.Creditos.ProteccionRelacion.Get parData)
        {

            if (parData.ProteccionDetalleID != 0)
            {
                try
                {
                    var Relacion = await ConexionBD.database.SingleByIdAsync<ProteccionesRelacion>(new { parData.ProteccionDetalleID });
                    var UsuarioRegistro = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", Relacion.UsuarioCaptura).FirstOrDefaultAsync();
                    var UsuarioModifico = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", Relacion.UsuarioModifica).FirstOrDefaultAsync();

                    var res = new
                    {
                        Relacion.ProteccionDetalleID,
                        Relacion.ProteccionCabeceroID,
                        Relacion.ProteccionID,
                        FechaCaptura = Relacion.FechaCaptura.ToString("dd/MM/yyyy"),
                        FechaModifica = Relacion.FechaModifica?.ToString("dd/MM/yyyy"),
                        UsuarioRegistro = new
                        {
                            UsuarioRegistro.UsuarioID,
                            Usuario = UsuarioRegistro.Usuario,
                            Nombre = UsuarioRegistro.Nombre
                        },
                        UsuarioModifico = new
                        {
                            UsuarioModifico.UsuarioID,
                            Usuario = UsuarioModifico.Usuario,
                            Nombre = UsuarioModifico.Nombre
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
            else
            {
                try
                {
                    var Relacion = await ConexionBD.database.FetchAsync<ProteccionesRelacion>();

                    ArrayList res = new();

                    foreach (var T in Relacion)
                    {
                        var UsuarioRegistro = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", T.UsuarioCaptura).FirstOrDefaultAsync();
                        var RelacionVW = await ConexionBD.database.QueryAsync<ProteccionesRelacion_VW>("WHERE ProteccionIDDetalle=@0", T.ProteccionDetalleID).FirstOrDefaultAsync();

                        res.Add(new
                        {
                            T.ProteccionDetalleID,
                            T.ProteccionCabeceroID,
                            T.ProteccionID,
                            FechaCaptura = T.FechaCaptura.ToString("dd/MM/yyyy"),
                            RelacionVW = new
                            {
                                RelacionVW.ProteccionIDDetalle,
                                Minimo = RelacionVW.MinimoDetalle,
                                Maximo = RelacionVW.MaximoDetalle,
                                Monto = RelacionVW.MontoDetalle,
                                Distribuidor = RelacionVW.DistribuidorNivelDetalle,
                                Origen = RelacionVW.NivelOrigenDetalle,
                                Descripcion = RelacionVW.DescripcionDetalle,
                            },
                            UsuarioRegistro = new
                            {
                                UsuarioRegistro.UsuarioID,
                                Usuario = UsuarioRegistro.Usuario,
                                Nombre = UsuarioRegistro.Nombre
                            },

                        });

                    }
                    await ConexionBD.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await ConexionBD.Destroy();
                    return NotFound(ex.Message);
                }
            }
            

        }*/


        [HttpPost]
        [Route("GetDistribuidoraNivel")]
        [Authorize]
        [Code.TProteccionProducto]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> GetDistribuidoraNivel(PeticionesRest.Creditos.Proteccion.Get parData)
        {
            var transaccion = false;
            try
            {
                ConexionBD.database.BeginTransaction();
                transaccion = true;
                var obj = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Distribuidores.Niveles>();
                ConexionBD.database.CompleteTransaction();
                await ConexionBD.Destroy();
                return Ok(obj);
            }
            catch (Exception ex)
            {
                if (transaccion) ; ConexionBD.database.AbortTransaction();
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> get(PeticionesRest.Creditos.Proteccion.Get parData)
        {

            try
            {
                var obj = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Creditos.ProteccionesForm_VW>();
                await ConexionBD.Destroy();
                return Ok(obj);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }

        }

        [HttpPost]
        [Route("GetDistribuidoraNivelOrigen")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetDistribuidoraNivelOrigen(PeticionesRest.Creditos.Proteccion.Get parData)
        {

            try
            {
                var obj = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Prospeccion.NivelesOrigen>();
                await ConexionBD.Destroy();
                return Ok(obj);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }

        }


        [HttpPost]
        [Route("addRelacion2")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> addRelacion2(PeticionesRest.Creditos.ProteccionRelacion.AddRelacion parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var ProteccionCabeceroLast = await ConexionBD.database.QueryAsync<ProteccionesRelacion>("ORDER BY ProteccionDetalleID DESC", parData).FirstOrDefaultAsync();

                var Proteccion = new ProteccionesRelacion()
                {
                    ProteccionCabeceroID = parData.ProteccionCabeceroID,
                    ProteccionID = 1,
                    UsuarioCaptura = UsuarioActual.UsuarioID,
                    FechaCaptura = DateTime.Now,
                };

                await ConexionBD.database.InsertAsync(Proteccion);



                await ConexionBD.Destroy();

                return Ok(Proteccion);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();

                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("addRelacion")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> addRelacion(PeticionesRest.Creditos.ProteccionRelacion.AddRelacion parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();



                ArrayList res = new();

                foreach (var ProteccionID in parData.ProteccionIDS)
                {

                    var ProteccionRelacion = await ConexionBD.database.QueryAsync<ProteccionesRelacion>("WHERE ProteccionID = @0 AND ProteccionCabeceroID = @1", ProteccionID, parData.ProteccionCabeceroID).FirstOrDefaultAsync();

                    if (ProteccionRelacion == null)
                    {

                        var ProteccionRelacion2 = new ProteccionesRelacion()
                        {
                            ProteccionID = ProteccionID,
                            ProteccionCabeceroID = parData.ProteccionCabeceroID,
                            UsuarioCaptura = UsuarioActual.UsuarioID,
                            FechaCaptura = DateTime.Now,

                        };

                        await ConexionBD.database.InsertAsync(ProteccionRelacion2);
                        var RelacionVW = await ConexionBD.database.QueryAsync<ProteccionesRelacion_VW>("WHERE ProteccionIDDetalle = @0", ProteccionRelacion2.ProteccionDetalleID).FirstOrDefaultAsync();

                        res.Add(new
                        {
                            RelacionVW.ProteccionIDDetalle,
                            RelacionVW.ProteccionCabeceroDetalle,
                            RelacionVW.ProteccionDetalle,
                            RelacionVW.MinimoDetalle,
                            RelacionVW.MaximoDetalle,
                            RelacionVW.MontoDetalle,
                            RelacionVW.NivelOrigenDetalle,
                            RelacionVW.DistribuidorNivelDetalle,
                            RelacionVW.DescripcionDetalle,
                            RelacionVW.NombreCapturaDetalle,
                            RelacionVW.FechaCapturaDetalle
                        });
                    }



                }

                await ConexionBD.Destroy();

                return Ok(res);

            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                var res = new
                {
                    res = 2,
                    msj = "La relacion entre los productos al cabecero es existente, intente con otros paquetes"

                };

                return BadRequest(ex.Message);
            }
        }

        /*[HttpPost]
        [Route("AddRelacion")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> AddRelacion(PeticionesRest.Creditos.ProteccionRelacion.AddRelacion parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var ProteccionR = await ConexionBD.database.FetchAsync<ProteccionesRelacion>();


                ArrayList res = new();

                foreach (var ProteccionID in parData.ProteccionIDS)
                {

                    var ProteccionRelacion = await ConexionBD.database.QueryAsync<ProteccionesRelacion>("WHERE ProteccionID = @0 AND ProteccionCabeceroID = @1", ProteccionID, parData.ProteccionCabeceroID).FirstOrDefaultAsync();

                    if (ProteccionRelacion == null)
                    {

                        var ProteccionRelacion2 = new ProteccionesRelacion()
                        {
                            ProteccionID = ProteccionID,
                            ProteccionCabeceroID = parData.ProteccionCabeceroID,
                            UsuarioCaptura = UsuarioActual.UsuarioID,
                            FechaCaptura = DateTime.Now,

                        };

                        await ConexionBD.database.InsertAsync(ProteccionRelacion2);

                        var UsuarioRegistro = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", ProteccionRelacion2.UsuarioCaptura).FirstOrDefaultAsync();
                        //var Cabecero = await ConexionBD.database.QueryAsync<ProteccionesCabecero>("WHERE ProteccionCabeceroID=@0", T.ProteccionCabeceroID).FirstOrDefaultAsync();
                        //var Proteccion = await ConexionBD.database.QueryAsync<Protecciones>("WHERE ProteccionID=@0", T.ProteccionDetalleID).FirstOrDefaultAsync();
                        var RelacionVW = await ConexionBD.database.QueryAsync<ProteccionesRelacion_VW>("WHERE ProteccionIDDetalle=@0", ProteccionRelacion2.ProteccionDetalleID).FirstOrDefaultAsync();



                        await ConexionBD.Destroy();

                        return Ok(RelacionVW);

                    }

                }

                await ConexionBD.Destroy();

                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                var res = new
                {
                    res = 2,
                    msj = "La relacion entre los productos al cabecero es existente, intente con otros paquetes"

                };

                return BadRequest(ex.Message);
            }
        }*/


        /*[HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(PeticionesRest.Creditos.ProteccionRelacion.Add parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                //var ProteccionCabeceroLast = await ConexionBD.database.QueryAsync<Protecciones>("ORDER BY ProteccionID DESC", parData).FirstOrDefaultAsync();

                var Relacion = new ProteccionesRelacion()
                {
                    ProteccionCabeceroID = parData.ProteccionCabeceroID,
                    ProteccionID = parData.ProteccionID,
                    FechaCaptura = DateTime.Now,
                    UsuarioCaptura = UsuarioActual.UsuarioID,
                };

                await ConexionBD.database.InsertAsync(Relacion);
                
                var UsuarioRegistro = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", Relacion.UsuarioCaptura).FirstOrDefaultAsync();
                var RelacionVW = await ConexionBD.database.QueryAsync<ProteccionesRelacion_VW>("WHERE ProteccionIDDetalle=@0", Relacion.ProteccionDetalleID).FirstOrDefaultAsync();

                var res = new
                {
                    Relacion.ProteccionDetalleID,
                    Relacion.ProteccionCabeceroID,
                    Relacion.ProteccionID,
                    FechaCaptura = Relacion.FechaCaptura.ToString("dd/MM/yyyy"),
                    RelacionVW = new
                    {
                        RelacionVW.ProteccionIDDetalle,
                        Minimo = RelacionVW.MinimoDetalle,
                        Maximo = RelacionVW.MaximoDetalle,
                        Monto = RelacionVW.MontoDetalle,
                        Distribuidor = RelacionVW.DistribuidorNivelDetalle,
                        Origen = RelacionVW.NivelOrigenDetalle,
                        Descripcion = RelacionVW.DescripcionDetalle,
                    },
                    UsuarioRegistro = new
                    {
                        UsuarioRegistro.UsuarioID,
                        Usuario = UsuarioRegistro.Usuario,
                        Nombre = UsuarioRegistro.Nombre
                    },

                };


                await ConexionBD.Destroy();

                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();

                return BadRequest(ex.Message);
            }
        }*/


        [HttpPost]
        [Route("update")]
        [Code.TProteccionProducto]
        [Authorize]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Creditos.Proteccion.Update parData)
        {
            var transaccion = false;

            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var registro = await ConexionBD.database.QueryAsync<Protecciones>("WHERE ProteccionID=@0", parData.ProteccionID).SingleOrDefaultAsync();
                if (registro != null)
                {
                    registro.Minimo = parData.Minimo;
                    registro.Maximo = parData.Maximo;
                    registro.DistribuidorNivelID = parData.DistribuidorNivelID;
                    registro.OrigenNivelID = parData.OrigenNivelID;
                    registro.UsuarioModifica = UsuarioActual.UsuarioID;
                };

                await ConexionBD.database.UpdateAsync(registro);
                await ConexionBD.Destroy();
                return Ok(registro);
            }
            catch (Exception ex)
            {
                if (transaccion) ; ConexionBD.database.AbortTransaction();
                return BadRequest(ex.Message);
            }
        }

        /* [HttpPost]
        [Route("update")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Update(PeticionesRest.Creditos.ProteccionCabecero.Update parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                
                var ProteccionCabecero = await ConexionBD.database.SingleByIdAsync<ProteccionesCabecero>(new { parData.ProteccionCabeceroID });

                ProteccionCabecero.Descripcion = parData.Descripcion;
                ProteccionCabecero.UsuarioModifica = UsuarioActual.UsuarioID;
                ProteccionCabecero.FechaModifica = DateTime.Now;

                await ConexionBD.database.UpdateAsync(ProteccionCabecero);

                var CapturaUsuario = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", ProteccionCabecero.UsuarioCaptura).FirstOrDefaultAsync();

                var ModificaUsuario = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", ProteccionCabecero.UsuarioModifica).FirstOrDefaultAsync();

                var res = new
                {
                    ProteccionCabecero.Descripcion,
                    FechaCaptura = ProteccionCabecero.FechaCaptura.ToString("dd/MM/yyyy"),
                    ProteccionCabecero.UsuarioModifica,
                    FechaModifica = ProteccionCabecero.FechaModifica?.ToString("dd/MM/yyyy"),
                    CapturaUsuario = new 
                    {
                        CapturaUsuario.UsuarioID,
                        CapturaUsuario.Usuario,
                        CapturaUsuario.Nombre
                    },
                    ModificaUsuario = new 
                    {
                        ModificaUsuario.UsuarioID,
                        ModificaUsuario.Usuario,
                        ModificaUsuario.Nombre
                    },
                    
                };

                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        } */
    }
}