using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Seguridad;
using DBContext.DBConfia.Distribuidores;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Sistema;
using System.Collections;
using System.Collections.Generic;

namespace ConfiaWebApi.Controllers.Creditos
{
    [Authorize]
    [ApiController]
    [Route("api/Creditos/[controller]")]
    public class SucursalProteccionController : ControllerBase
    {
        private DBConfiaContext ConexionBD;

        public SucursalProteccionController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        [HttpPost]
        [Route("getVista")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getVista(PeticionesRest.Creditos.SucursalesProteccion.Get parData)
        {

            try
            {
                var obj = await ConexionBD.database.FetchAsync<SucursalesProtecciones_VW>("Where ProteccionCabeceroIDVista = @ProteccionCabeceroIDVista", parData);

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
        [Route("getVista")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getVista(PeticionesRest.Creditos.SucursalesProteccion.Get parData)
        {
            if (parData.SucursalProteccionID != 0)
            {
                try
                {
                    var SucursalProteccion = await ConexionBD.database.SingleByIdAsync<SucursalesProtecciones>(new { parData.SucursalProteccionID });
                    var UsuarioRegistro = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", SucursalProteccion.UsuarioCaptura).FirstOrDefaultAsync();
                    var SucursalesProteccionesVW = await ConexionBD.database.QueryAsync<SucursalesProtecciones_VW>("WHERE SucursalProteccionIDVista=@0", SucursalProteccion.SucursalProteccionID).FirstOrDefaultAsync();

                    var res = new
                    {
                        SucursalProteccion.SucursalProteccionID,
                        SucursalProteccion.ProductoID,
                        SucursalProteccion.ProteccionCabeceroID,
                        SucursalProteccion.SucursalID,
                        FechaCaptura = SucursalProteccion.FechaCaptura.ToString("dd/MM/yyyy"),
                        FechaModifica = SucursalProteccion.FechaModifica?.ToString("dd/MM/yyyy"),
                        SucursalesProteccionesVW,
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
            }
            else
            {
                try
                {
                    var SucursalesProteccion = await ConexionBD.database.FetchAsync<SucursalesProtecciones>();

                    ArrayList res = new();

                    foreach (var T in SucursalesProteccion)
                    {
                        var UsuarioRegistro = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", T.UsuarioCaptura).FirstOrDefaultAsync();
                        var SucursalesProteccionesVW = await ConexionBD.database.QueryAsync<SucursalesProtecciones_VW>("WHERE SucursalProteccionIDVista=@00", T.SucursalProteccionID).FirstOrDefaultAsync();

                        res.Add(new
                        {
                            T.SucursalProteccionID,
                            T.ProductoID,
                            T.ProteccionCabeceroID,
                            T.SucursalID,
                            FechaCaptura = T.FechaCaptura.ToString("dd/MM/yyyy"),
                            SucursalesProteccionesVW,
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

        /*[HttpPost]
        [Route("getVista")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getVista(PeticionesRest.Creditos.SucursalesProteccion.Get parData)
        {
            if (parData.SucursalProteccionID != 0)
            {
                try
                {
                    var SucursalProteccion = await ConexionBD.database.SingleByIdAsync<SucursalesProtecciones>(new { parData.SucursalProteccionID });
                    var UsuarioRegistro = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", SucursalProteccion.UsuarioCaptura).FirstOrDefaultAsync();
                    var SucursalesProteccionesVW = await ConexionBD.database.QueryAsync<SucursalesProtecciones_VW>("WHERE SucursalProteccionIDVista=@0", SucursalProteccion.SucursalProteccionID).FirstOrDefaultAsync();

                    var res = new
                    {
                        SucursalProteccion.SucursalProteccionID,
                        SucursalProteccion.ProductoID,
                        SucursalProteccion.ProteccionCabeceroID,
                        SucursalProteccion.SucursalID,
                        FechaCaptura = SucursalProteccion.FechaCaptura.ToString("dd/MM/yyyy"),
                        FechaModifica = SucursalProteccion.FechaModifica?.ToString("dd/MM/yyyy"),
                        SucursalesProteccionesVW = new
                             {
                                SucursalesProteccionesVW.SucursalProteccionIDVista,
                                Descripcion = SucursalesProteccionesVW.DescripcionVista,
                                Producto = SucursalesProteccionesVW.ProductoVista,
                                Sucursal = SucursalesProteccionesVW.SucursalVista
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
            }
            else
            {
                try
                {
                    var SucursalesProteccion = await ConexionBD.database.FetchAsync<SucursalesProtecciones>();


                    ArrayList res = new();

                    foreach (var T in SucursalesProteccion)
                    {
                        var UsuarioRegistro = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE UsuarioID=@0", T.UsuarioCaptura).FirstOrDefaultAsync();
                        var SucursalesProteccionesVW = await ConexionBD.database.QueryAsync<SucursalesProtecciones_VW>("WHERE SucursalProteccionIDVista=@0", T.SucursalProteccionID).FirstOrDefaultAsync();

                        res.Add(new
                        {
                            T.SucursalProteccionID,
                            T.ProductoID,
                            T.ProteccionCabeceroID,
                            T.SucursalID,
                            FechaCaptura = T.FechaCaptura.ToString("dd/MM/yyyy"),
                            SucursalesProteccionesVW = new
                             {
                                SucursalesProteccionesVW.SucursalProteccionIDVista,
                                Descripcion = SucursalesProteccionesVW.DescripcionVista,
                                Producto = SucursalesProteccionesVW.ProductoVista,
                                Sucursal = SucursalesProteccionesVW.SucursalVista
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
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(PeticionesRest.Creditos.SucursalesProteccion.Add parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                ArrayList res = new();

                foreach (var ProductoID in parData.ProductosIDS)
                {
                    var SucursalesProteccion = await ConexionBD.database.QueryAsync<SucursalesProtecciones>("WHERE ProductoID = @0 AND ProteccionCabeceroID = @1 AND SucursalID = @2", ProductoID, parData.ProteccionCabeceroID, parData.ProductoID).FirstOrDefaultAsync();

                    if (SucursalesProteccion == null)
                    {
                        var SucursalProteccion2 = new SucursalesProtecciones()
                        {
                            ProductoID = ProductoID,
                            ProteccionCabeceroID = parData.ProteccionCabeceroID,
                            SucursalID = parData.ProductoID,
                            FechaCaptura = DateTime.Now,
                            UsuarioCaptura = UsuarioActual.UsuarioID,
                        };

                        await ConexionBD.database.InsertAsync(SucursalProteccion2);

                        var RelacionSucursalesVW = await ConexionBD.database.QueryAsync<SucursalesProtecciones_VW>("WHERE SucursalProteccionIDVista =@0", SucursalProteccion2.SucursalProteccionID).FirstOrDefaultAsync();

                        res.Add(new
                        {
                            RelacionSucursalesVW.SucursalProteccionIDVista,
                            RelacionSucursalesVW.ProductoVista,
                            RelacionSucursalesVW.DescripcionVista,
                            RelacionSucursalesVW.SucursalVista,
                            RelacionSucursalesVW.NombreCapturaVista,
                            RelacionSucursalesVW.FechaCapturaVista
                        });
                    }
                }
                //var RelacionSucursalesVW = await ConexionBD.database.FetchAsync<SucursalesProtecciones_VW>("WHERE ProteccionCabeceroIDVista =@ProteccionCabeceroID");

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

        [HttpPost]
        [Route("getByProducto")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetByProducto(PeticionesRest.Creditos.Condicion.GetSucursales parData)
        {
            try
            {
                var res = await ConexionBD.database.QueryAsync<SucursalProductos_VW>("WHERE  (SucursalID = @SucursalID)", parData).ToArrayAsync();
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
        [Route("GetProducto")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetProducto(PeticionesRest.Creditos.Proteccion.Get parData)
        {

            try
            {
                var obj = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Creditos.ProductosVW>();
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
        [Route("GetSucursal")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetSucursal(PeticionesRest.Creditos.Proteccion.Get parData)
        {

            try
            {
                var obj = await ConexionBD.database.FetchAsync<DBContext.DBConfia.General.Sucursales_VW>();
                await ConexionBD.Destroy();
                return Ok(obj);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }

        }

    }
}