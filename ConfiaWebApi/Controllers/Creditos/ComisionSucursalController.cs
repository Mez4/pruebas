using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Distribuidores;
using DBContext.DBConfia.General;
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
    public class ComisionSucursalController : ControllerBase
    {
        private DBConfiaContext ConexionBD;

        public ComisionSucursalController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.Creditos.ComisionSucursal.Get parData)
        {
            if (parData.ProductoID != 0 && parData.SucursalId != 0 && parData.ComisionesID != 0)
            {
                try
                {
                    var ComisionSucursal = await ConexionBD.database.SingleByIdAsync<ComisionesSucursal>(new { parData.ProductoID, parData.SucursalId, parData.ComisionesID });
                    var Producto = await ConexionBD.database.SingleByIdAsync<Productos>(ComisionSucursal.ProductoID);
                    var Sucursal = await ConexionBD.database.SingleByIdAsync<Sucursales>(ComisionSucursal.SucursalId);
                    var Comision = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Creditos.Comisiones>(ComisionSucursal.ComisionesID);

                    var UsuarioRegistro = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", ComisionSucursal.RegistroUsuarioId).FirstOrDefaultAsync();
                    var UsuarioModifico = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", ComisionSucursal.ModificaFecha).FirstOrDefaultAsync();


                    var res = new
                    {
                        ComisionSucursal.ProductoID,
                        ComisionSucursal.SucursalId,
                        ComisionSucursal.ComisionesID,
                        RegistroFecha = ComisionSucursal.RegistroFecha.ToString("dd/MM/yyyy"),
                        ComisionSucursal.RegistroUsuarioId,
                        ModificoFecha = ComisionSucursal.ModificaFecha.ToString("dd/MM/yyyy"),
                        ComisionSucursal.ModificaUsuarioId,
                        Producto,
                        Sucursal,
                        Comision,
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
                    var ComisionesSucursal = await ConexionBD.database.FetchAsync<ComisionesSucursal>("Where ProductoID = @ProductoID AND ComisionesID = @ComisionesID", parData);
                    //var ComisionesSucursal = await DBContext.database.FetchAsync<ComisionesSucursal>();
                    var Productos = await ConexionBD.database.FetchAsync<Productos>();

                    ArrayList res = new();

                    foreach (var T in ComisionesSucursal)
                    {
                        var Producto = Productos.Where(x => x.ProductoID == T.ProductoID).FirstOrDefault();
                        var Sucursal = await ConexionBD.database.SingleByIdAsync<Sucursales>(T.SucursalId);
                        var Comision = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Creditos.Comisiones>(new { T.ProductoID, T.ComisionesID });
                        var UsuarioRegistro = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", T.RegistroUsuarioId).FirstOrDefaultAsync();
                        var UsuarioModifico = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", T.ModificaUsuarioId).FirstOrDefaultAsync();

                        res.Add(new
                        {
                            T.ProductoID,
                            T.SucursalId,
                            T.ComisionesID,
                            T.RegistroUsuarioId,
                            RegistroFecha = T.RegistroFecha.ToString("dd/MM/yyyy"),
                            T.ModificaUsuarioId,
                            ModificoFecha = T.ModificaFecha.ToString("dd/MM/yyyy"),
                            Producto,
                            Sucursal,
                            Comision,
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
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(PeticionesRest.Creditos.ComisionSucursal.Add parData)
        {
            try
            {
                //var userId = int.Parse(HttpContext.User.Claims.Where(x => x.Type == "Id").FirstOrDefault().Value);
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                //var UsuarioActual = await DBContext.database.QueryAsync<USER_ENTITY>("WHERE EMAIL=@0", UserName).FirstOrDefaultAsync();
                // var PersonaActual = await DBContext.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.ID).FirstOrDefaultAsync();

                var Producto = await ConexionBD.database.SingleByIdAsync<Productos>(parData.ProductoID);

                var Comision = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Creditos.Comisiones>(new { parData.ProductoID, parData.ComisionesID });

                var UsuarioRegistro = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", Comision.RegistroUsuarioId).FirstOrDefaultAsync();
                var UsuarioModifico = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", Comision.ModificaUsuarioId).FirstOrDefaultAsync();


                ArrayList res = new();

                foreach (var SucursalId in parData.SucursalesIds)
                {
                    var ComisionSucursal = await ConexionBD.database.SingleOrDefaultByIdAsync<ComisionesSucursal>(new { parData.ProductoID, parData.ComisionesID, SucursalId });

                    if (ComisionSucursal == null)
                    {

                        ComisionSucursal = new ComisionesSucursal()
                        {
                            ProductoID = parData.ProductoID,
                            ComisionesID = parData.ComisionesID,
                            SucursalId = SucursalId,
                            RegistroFecha = DateTime.Now,
                            RegistroUsuarioId = UsuarioActual.UsuarioID,
                            ModificaFecha = DateTime.Now,
                            ModificaUsuarioId = UsuarioActual.UsuarioID,
                            PersonaIDRegistro = (long)UsuarioActual.UsuarioID

                        };

                        await ConexionBD.database.InsertAsync(ComisionSucursal);

                        var Sucursal = await ConexionBD.database.SingleByIdAsync<Sucursales>(ComisionSucursal.SucursalId);

                        res.Add(new
                        {
                            ComisionSucursal.ProductoID,
                            ComisionSucursal.SucursalId,
                            ComisionSucursal.ComisionesID,
                            ComisionSucursal.RegistroUsuarioId,
                            RegistroFecha = ComisionSucursal.RegistroFecha.ToString("dd/MM/yyyy"),
                            ComisionSucursal.ModificaUsuarioId,
                            ModificoFecha = ComisionSucursal.ModificaFecha.ToString("dd/MM/yyyy"),
                            Producto,
                            Sucursal,
                            Comision,
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


        //[HttpPost]
        //[Route("add")]
        //[Authorize]
        //[Code.TProteccionProducto]
        //public async Task<IActionResult> Add(PeticionesRest.Creditos.ComisionSucursal.Add parData)
        //{
        //    try
        //    {
        //        var userId = int.Parse(HttpContext.User.Claims.Where(x => x.Type == "Id").FirstOrDefault().Value);

        //        var ComisionSucursal = new ComisionesSucursal()
        //        {
        //            ProductoID = parData.ProductoID,
        //            SucursalId = parData.SucursalId,
        //            ComisionesID = parData.ComisionesID,
        //            RegistroFecha = DateTime.Now,
        //            RegistroUsuarioId = userId,
        //            ModificaFecha = DateTime.Now,
        //            ModificaUsuarioId = userId

        //        };
        //        await DBContext.database.InsertAsync(ComisionSucursal);

        //        var Producto = await DBContext.database.SingleByIdAsync<Productos>(ComisionSucursal.ProductoID);

        //        var Sucursal = await DBContext.database.SingleByIdAsync<Sucursales>(ComisionSucursal.SucursalId);

        //        var Comision = await DBContext.database.SingleByIdAsync<Comisiones>(new { parData.ProductoID, parData.ComisionesID });

        //        var UsuarioRegistro = await DBContext.database.SingleByIdAsync<Usuarios>(ComisionSucursal.RegistroUsuarioId);

        //        var UsuarioModifico = await DBContext.database.SingleByIdAsync<Usuarios>(ComisionSucursal.ModificaUsuarioId);

        //        var res = new
        //        {
        //            ComisionSucursal.ProductoID,
        //            ComisionSucursal.SucursalId,
        //            ComisionSucursal.ComisionesID,
        //            ComisionSucursal.RegistroUsuarioId,
        //            RegistroFecha = ComisionSucursal.RegistroFecha.ToString("dd/MM/yyyy"),
        //            ComisionSucursal.ModificaUsuarioId,
        //            ModificoFecha = ComisionSucursal.ModificaFecha.ToString("dd/MM/yyyy"),
        //            Producto,
        //            Sucursal,
        //            Comision,
        //            UsuarioRegistro = new
        //            {
        //                UsuarioRegistro.UsuarioID,
        //                UsuarioRegistro.Usuario,
        //                UsuarioRegistro.Nombre
        //            },
        //            UsuarioModifico = new
        //            {
        //                UsuarioModifico.UsuarioID,
        //                UsuarioModifico.Usuario,
        //                UsuarioModifico.Nombre
        //            }
        //        };

        //        return Ok(res);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}

        [HttpPost]
        [Route("update")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Update(PeticionesRest.Creditos.ComisionSucursal.Update parData)
        {
            try
            {
                //var userId = int.Parse(HttpContext.User.Claims.Where(x => x.Type == "Id").FirstOrDefault().Value);
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                //var UsuarioActual = await DBContext.database.QueryAsync<USER_ENTITY>("WHERE EMAIL=@0", UserName).FirstOrDefaultAsync();
                // var PersonaActual = await DBContext.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.ID).FirstOrDefaultAsync();

                var ComisionSucursal = await ConexionBD.database.SingleByIdAsync<ComisionesSucursal>(new { parData.ProductoID, parData.SucursalId });
                ComisionSucursal.ComisionesID = parData.ComisionesID;
                ComisionSucursal.ModificaFecha = DateTime.Now;
                ComisionSucursal.ModificaUsuarioId = UsuarioActual.UsuarioID;

                await ConexionBD.database.UpdateAsync(ComisionSucursal);

                var Producto = await ConexionBD.database.SingleByIdAsync<Productos>(ComisionSucursal.ProductoID);

                var Sucursal = await ConexionBD.database.SingleByIdAsync<Sucursales>(ComisionSucursal.SucursalId);

                var Comision = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Creditos.Comisiones>(new { parData.ProductoID, parData.ComisionesID });

                var UsuarioRegistro = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", ComisionSucursal.RegistroUsuarioId).FirstOrDefaultAsync();
                var UsuarioModifico = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", ComisionSucursal.ModificaUsuarioId).FirstOrDefaultAsync();


                var res = new
                {
                    ComisionSucursal.ProductoID,
                    ComisionSucursal.SucursalId,
                    ComisionSucursal.ComisionesID,
                    ComisionSucursal.RegistroUsuarioId,
                    RegistroFecha = ComisionSucursal.RegistroFecha.ToString("dd/MM/yyyy"),
                    ComisionSucursal.ModificaUsuarioId,
                    ModificoFecha = ComisionSucursal.ModificaFecha.ToString("dd/MM/yyyy"),
                    Producto,
                    Sucursal,
                    Comision,
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

        
        [HttpPost]
        [Route("GuardarComisionesCsv")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GuardarComisionesCsv(PeticionesRest.Creditos.ComisionSucursal.GuardarComisionesCsv parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                parData.UsuarioID = UsuarioActual.UsuarioID;

                var res = await ConexionBD.database.QueryAsync<dynamic>("EXEC Creditos.pa_CsvGuardarComisionesDetalle @UsuarioID,@ComisionesList",parData).FirstOrDefaultAsync();
                
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
