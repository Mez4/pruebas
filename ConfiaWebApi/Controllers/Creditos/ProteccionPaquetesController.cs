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
    public class ProteccionPaquetesController : ControllerBase
    {
        private DBConfiaContext ConexionBD;

        public ProteccionPaquetesController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }



        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.Creditos.Proteccion.Get parData)
        {

            try
            {
                var obj = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Creditos.Potecciones_VW>();
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
        [Route("get2")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get2(PeticionesRest.Creditos.Proteccion.Get2 parData)
        {
            if (parData.ProteccionID != 0)
            {
                try
                {
                    var Proteccion = await ConexionBD.database.SingleByIdAsync<Protecciones>(new { parData.ProteccionID });
                    var UsuarioRegistro = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", Proteccion.UsuarioCaptura).FirstOrDefaultAsync();
                    var UsuarioModifico = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", Proteccion.UsuarioModifica).FirstOrDefaultAsync();

                    var res = new
                    {
                        Proteccion.ProteccionID,
                        Proteccion.Minimo,
                        Proteccion.Maximo,
                        Proteccion.Monto,
                        Proteccion.DistribuidorNivelID,
                        Proteccion.OrigenNivelID,
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
                    return NotFound(ex.Message);
                }
            }
            else
            {
                try
                {
                    var Protecciones = await ConexionBD.database.FetchAsync<Protecciones>();

                    ArrayList res = new();

                    foreach (var T in Protecciones)
                    {
                        var UsuarioRegistro = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", T.UsuarioCaptura).FirstOrDefaultAsync();
                        var UsuarioModifico = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", T.UsuarioModifica).FirstOrDefaultAsync();
                        var Distribuidores = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Distribuidores.Niveles>("WHERE DistribuidorNivelID= @0", T.DistribuidorNivelID).FirstOrDefaultAsync();
                        var NivelesOrigen = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Prospeccion.NivelesOrigen>("WHERE DistribuidorNivelID= @0", T.OrigenNivelID).FirstOrDefaultAsync();

                        res.Add(new
                        {
                            T.ProteccionID,
                            T.Minimo,
                            T.Maximo,
                            T.Monto,
                            Distribuidores = new
                            {
                                Distribuidores.DistribuidorNivelID,
                                Nombre = Distribuidores.DistribuidorNivel
                            },
                            NivelesOrigen = new
                            {
                                NivelesOrigen.DistribuidorNivelID,
                                Nombre = NivelesOrigen.DistribuidorNivel
                            },
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

        }

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
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(PeticionesRest.Creditos.Proteccion.Add parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();


                var Proteccion = new Protecciones()
                {
                    Minimo = parData.Minimo,
                    Maximo = parData.Maximo,
                    Monto = parData.Monto,
                    DistribuidorNivelID = parData.DistribuidorNivelID,
                    OrigenNivelID = parData.OrigenNivelID,
                    UsuarioCaptura = UsuarioActual.UsuarioID
                };

                await ConexionBD.database.InsertAsync(Proteccion);

                var Paquetes = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Potecciones_VW>("WHERE ProteccionID=@0", Proteccion.ProteccionID).SingleOrDefaultAsync();

                var res = new
                {
                    Paquetes.ProteccionID,
                    Paquetes.Minimo,
                    Paquetes.Maximo,
                    Paquetes.Monto,
                    Paquetes.DistribuidorNivel,
                    Paquetes.DistribuidorNivelOrigen,
                    Paquetes.NombreCaptura,
                    Paquetes.NombreModifica

                };

                await ConexionBD.Destroy();
                return Ok(Paquetes);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();

                return BadRequest(ex.Message);
            }
        }




        /*[HttpPost]
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
                    registro.Monto = parData.Monto;
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
        }*/

        [HttpPost]
        [Route("update")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Update(PeticionesRest.Creditos.Proteccion.Update parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var Proteccion = await ConexionBD.database.QueryAsync<Protecciones>("WHERE ProteccionID=@0", parData.ProteccionID).SingleOrDefaultAsync();

                Proteccion.Minimo = parData.Minimo;
                Proteccion.Maximo = parData.Maximo;
                Proteccion.Monto = parData.Monto;
                Proteccion.DistribuidorNivelID = parData.DistribuidorNivelID;
                Proteccion.OrigenNivelID = parData.OrigenNivelID;
                Proteccion.UsuarioModifica = UsuarioActual.UsuarioID;


                await ConexionBD.database.UpdateAsync(Proteccion);

                var Paquetes = await ConexionBD.database.QueryAsync<Potecciones_VW>("WHERE ProteccionID=@0", parData.ProteccionID).SingleOrDefaultAsync();

                var res = new
                {
                    Paquetes.ProteccionID,
                    Paquetes.Minimo,
                    Paquetes.Maximo,
                    Paquetes.Monto,
                    Paquetes.DistribuidorNivel,
                    Paquetes.DistribuidorNivelOrigen,
                    Paquetes.NombreCaptura,
                    Paquetes.NombreModifica

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
    }
}