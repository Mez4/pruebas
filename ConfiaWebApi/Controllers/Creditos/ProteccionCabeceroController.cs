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
    public class ProteccionCabeceroController : ControllerBase
    {
        private DBConfiaContext ConexionBD;

        public ProteccionCabeceroController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }



        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.Creditos.ProteccionCabecero.Get parData)
        {

            try
            {
                var obj = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Creditos.ProteccionCabecero_VW>();
                await ConexionBD.Destroy();
                return Ok(obj);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }

        }

        /*[HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.Creditos.ProteccionCabecero.Get parData)
        {

            if (parData.ProteccionCabeceroID != 0)
            {
                try
                {
                    var ProteccionCabecero = await ConexionBD.database.SingleByIdAsync<ProteccionesCabecero>(new { parData.ProteccionCabeceroID});
                    var UsuarioRegistro = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", ProteccionCabecero.UsuarioCaptura).FirstOrDefaultAsync();
                    var UsuarioModifico = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", ProteccionCabecero.UsuarioModifica).FirstOrDefaultAsync();

                    var res = new
                    {
                        ProteccionCabecero.ProteccionCabeceroID,
                        ProteccionCabecero.Descripcion,
                        ProteccionCabecero.UsuarioCaptura,
                        FechaCaptura = ProteccionCabecero.FechaCaptura.ToString("dd/MM/yyyy"),
                        FechaModifica = ProteccionCabecero.FechaModifica?.ToString("dd/MM/yyyy"),
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
                    var ProteccionCabecero = await ConexionBD.database.FetchAsync<ProteccionesCabecero>();

                    ArrayList res = new();

                    foreach (var T in ProteccionCabecero)
                    {
                        var UsuarioRegistro = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", T.UsuarioCaptura).FirstOrDefaultAsync();
                        var UsuarioModifico = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", T.UsuarioModifica).FirstOrDefaultAsync();

                        res.Add(new
                        {
                            T.ProteccionCabeceroID,
                            T.Descripcion,
                            FechaCaptura = T.FechaCaptura.ToString("dd/MM/yyyy"),
                            FechaModifica = T.FechaModifica?.ToString("dd/MM/yyyy"),
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

        }*/


        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(PeticionesRest.Creditos.ProteccionCabecero.Add parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                //var ProteccionCabeceroLast = await ConexionBD.database.QueryAsync<ProteccionesCabecero>("ORDER BY ProteccionCabeceroID DESC", parData).FirstOrDefaultAsync();

                var ProteccionCabecero = new ProteccionesCabecero()
                {
                    Descripcion = parData.Descripcion,
                    UsuarioCaptura = UsuarioActual.UsuarioID,
                    FechaCaptura = DateTime.Now
                };

                await ConexionBD.database.InsertAsync(ProteccionCabecero);

                var ProteccionCabeceroVW = await ConexionBD.database.QueryAsync<ProteccionCabecero_VW>("WHERE ProteccionCabeceroID = @0", ProteccionCabecero.ProteccionCabeceroID).SingleOrDefaultAsync();
                await ConexionBD.Destroy();

                return Ok(ProteccionCabeceroVW);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();

                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("update")]
        [Code.TProteccionProducto]
        [Authorize]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Creditos.ProteccionCabecero.Update parData)
        {
            var transaccion = false;

            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var registro = await ConexionBD.database.QueryAsync<ProteccionesCabecero>("WHERE ProteccionCabeceroID=@0", parData.ProteccionCabeceroID).SingleOrDefaultAsync();
                if (registro != null)
                {
                    registro.Descripcion = parData.Descripcion;
                    registro.FechaModifica = DateTime.Now;
                    registro.UsuarioModifica = UsuarioActual.UsuarioID;
                };

                await ConexionBD.database.UpdateAsync(registro);
                var ProteccionCabecero = await ConexionBD.database.QueryAsync<ProteccionCabecero_VW>("WHERE ProteccionCabeceroID = @0", parData.ProteccionCabeceroID).SingleOrDefaultAsync();
                await ConexionBD.Destroy();
                return Ok(ProteccionCabecero);
            }
            catch (Exception ex)
            {
                if (transaccion) ; ConexionBD.database.AbortTransaction();
                return BadRequest(ex.Message);
            }
        }

        /*[HttpPost]
        [Route("update")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Update(PeticionesRest.Creditos.ProteccionCabecero.Update parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var ProteccionCabecero = await ConexionBD.database.QueryAsync<ProteccionesCabecero>("WHERE ProteccionCabeceroID=@0", parData.ProteccionCabeceroID).SingleOrDefaultAsync();

                ProteccionCabecero.Descripcion = parData.Descripcion;
                ProteccionCabecero.UsuarioModifica = UsuarioActual.UsuarioID;
                ProteccionCabecero.FechaModifica = DateTime.Now;

                await ConexionBD.database.UpdateAsync(ProteccionCabecero);

                var ProteccionCabeceroVW = await ConexionBD.database.SingleByIdAsync<ProteccionCabecero_VW>(parData.ProteccionCabeceroID);

                var res = new
                {
                    ProteccionCabeceroVW.ProteccionCabeceroID,
                    ProteccionCabeceroVW.Descripcion,
                    ProteccionCabeceroVW.NombreModifica,
                    ProteccionCabeceroVW.FechaModifica

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
    }
}