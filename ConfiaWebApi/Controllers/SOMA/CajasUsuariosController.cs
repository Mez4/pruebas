using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Tesoreria;
using iText.Layout;
using DBContext.DBConfia.Bancos;

namespace ConfiaWebApi.Controllers.Sistema
{
    [Authorize]
    [ApiController]
    [Route("api/SOMA/[controller]")]
    public class CajasUsuariosController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public CajasUsuariosController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        // [Code.TProteccionProducto]
        public async Task<IActionResult> GetCajas(PeticionesRest.SOMA.CajaUsuario.Get parData)
        {
            try
            {
                var res = await DBContext.database.FetchAsync<CatalogoCajasUsuarios_VW>("WHERE (UsuarioID = @UsuarioID)", parData);
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
        [Route("getcajas")]
        [Authorize]
        // [Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.SOMA.CajaUsuario.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                parData.UsuarioID = UsuarioActual.UsuarioID;
                parData.ProductoID = producto;

                var res = await DBContext.database.FetchAsync<CatalogoCajas_VW>();
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
        [Route("getcajaspermisos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetPermisos(PeticionesRest.SOMA.CajaUsuario.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                parData.UsuarioID = UsuarioActual.UsuarioID;
                parData.ProductoID = producto;

                var res = await DBContext.database.FetchAsync<CatalogoCajasUsuarios_VW>("WHERE (UsuarioID = @UsuarioID) AND (ProductoID = @ProductoID)", parData);
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
        [Route("getbysucursal")]
        [Authorize]
        // [Code.TProteccionProducto]
        public async Task<IActionResult> GetCajasbySucursal(PeticionesRest.SOMA.CajaUsuario.GetbySuc parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                parData.UsuarioID = UsuarioActual.UsuarioID;
                parData.ProductoID = producto;

                var res = await DBContext.database.FetchAsync<CatalogoCajasUsuarios_VW>("WHERE (UsuarioID = @UsuarioID) AND (SucursalID = @SucursalID) AND (ProductoID = @ProductoID)", parData);
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
        [Route("getbysucursalsaldo")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetCajasbySucursalSaldo(PeticionesRest.SOMA.CajaUsuario.GetbySuc parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                parData.UsuarioID = UsuarioActual.UsuarioID;
                parData.ProductoID = producto;

                var Cajas = await DBContext.database.FetchAsync<CatalogoCajasUsuariosSaldos_VW>("WHERE (UsuarioID = @UsuarioID) AND (SucursalID = @SucursalID) AND (ProductoID = @ProductoID)", parData);
                var res = Cajas.MaxBy(x => x.SaldoActual);

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
        [Route("getsucursales")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetSucursales([FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var Cajas = await DBContext.database.QueryAsync<CatalogoCajasUsuarios_VW>("WHERE (UsuarioID = @0) AND (ProductoID = @1) AND (Activo = 1)", UsuarioActual.UsuarioID, producto).ToArrayAsync();

                var res = Cajas.OrderBy(x => x.SucursalID).GroupBy(x => x.SucursalID).Select(x => x.First()).ToArray();

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
        [Route("getcuentas")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetCuentas([FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var Cajas = await DBContext.database.QueryAsync<CatalogoCuentasBancos>("WHERE bitConcentradora = 1").ToArrayAsync();

                var res = Cajas.OrderBy(x => x.CuentaBancoID).GroupBy(x => x.CuentaBancoID).Select(x => x.First()).ToArray();

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
        // [Code.TProteccionProducto]
        public async Task<IActionResult> Add(PeticionesRest.SOMA.CajaUsuario.Add parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                // var r = await DBContext.database.QueryAsync<CatalogoCajasUsuarios_VW>("WHERE (UsuarioID = @UsuarioID) AND (CajaID = @CajaID)", parData).FirstOrDefaultAsync();

                // if(r != null)
                // {
                //     return BadRequest($"Usuario ya cuenta con acceso a la caja {r.CajaID} {r.Descripcion}");
                // }

                var CatalogoCajasUsuarios = new CatalogoCajasUsuarios()
                {
                    CajaID = parData.CajaID,
                    UsuarioID = parData.UsuarioID,
                    Activo = parData.Activo,
                    UsuarioRegistroID = UsuarioActual.UsuarioID,
                    FechaRegistro = DateTime.Now
                };
                await DBContext.database.InsertAsync(CatalogoCajasUsuarios);
                var res = await DBContext.database.QueryAsync<CatalogoCajasUsuarios_VW>("WHERE (UsuarioID = @UsuarioID) AND (CajaID = @CajaID)", CatalogoCajasUsuarios).FirstOrDefaultAsync();
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
        [Route("update")]
        [Authorize]
        // [Code.TProteccionProducto]
        public async Task<IActionResult> Update(PeticionesRest.SOMA.CajaUsuario.Update parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var CatalogoCajasUsuarios = await DBContext.database.QueryAsync<CatalogoCajasUsuarios>("WHERE (UsuarioID = @UsuarioID) AND (CajaID = @CajaID)", parData).FirstOrDefaultAsync();

                CatalogoCajasUsuarios.Activo = parData.Activo;
                CatalogoCajasUsuarios.PuedeDesembolsar = parData.PuedeDesembolsar;
                CatalogoCajasUsuarios.UsuarioModificoID = UsuarioActual.UsuarioID;
                CatalogoCajasUsuarios.FechaModifico = DateTime.Now;

                await DBContext.database.UpdateAsync(CatalogoCajasUsuarios);
                var res = await DBContext.database.QueryAsync<CatalogoCajasUsuarios_VW>("WHERE (UsuarioID = @UsuarioID) AND (CajaID = @CajaID)", CatalogoCajasUsuarios).FirstOrDefaultAsync();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        // [HttpPost]
        // [Authorize]
        // [Route("getusuarios")]
        // [Code.TProteccionProducto]
        // public async Task<IActionResult> GetUsuarios()
        // {
        //     try
        //     {
        //         var resultado = await DBContext.database.FetchAsync<DBContext.DBConfia.Seguridad.UsuariosVW>();

        //         await this.DBContext.Destroy();

        //         return Ok(resultado);
        //     }
        //     catch (Exception ex)
        //     {
        //         return BadRequest("Error al obtener los usuarios: " + ex.Message);
        //     }
        // }
    }
























}
