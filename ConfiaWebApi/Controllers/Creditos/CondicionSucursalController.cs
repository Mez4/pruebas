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
    public class CondicionSucursalController : ControllerBase
    {
        private DBConfiaContext ConexionBD;

        public CondicionSucursalController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.Creditos.CondicionSucursal.Get parData)
        {
            try
            {
                var res = await ConexionBD.database.FetchAsync<Condicionessucursales_VW>("WHERE (ProductoID = @ProductoID OR @ProductoID = 0) AND (SucursalID = @SucursalID OR " +
                "@SucursalID = 0) AND (CondicionesID = @CondicionesID OR @CondicionesID = 0)", parData);
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
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(PeticionesRest.Creditos.CondicionSucursal.Add parData)
        {
            try
            {
                //var userId = int.Parse(HttpContext.User.Claims.Where(x => x.Type == "Id").FirstOrDefault().Value);
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                //var UsuarioActual = await DBContext.database.QueryAsync<USER_ENTITY>("WHERE EMAIL=@0", UserName).FirstOrDefaultAsync();
                // var PersonaActual = await DBContext.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.ID).FirstOrDefaultAsync();

                var existCondicionSucursal = await ConexionBD.database.QueryAsync<CondicionesSucursal>("WHERE ProductoID=@ProductoID AND SucursalId=@SucursalId", parData).ToArrayAsync();
                if (existCondicionSucursal.Length > 0)
                {
                    await ConexionBD.Destroy();
                    return BadRequest("Ya existe una relación Producto-Sucursal");
                }

                var CondicionSucursal = new CondicionesSucursal()
                {
                    ProductoID = parData.ProductoID,
                    SucursalId = parData.SucursalId,
                    CondicionesID = parData.CondicionesID,
                    RegistroFecha = DateTime.Now,
                    RegistroUsuarioId = UsuarioActual.UsuarioID,
                    ModificaFecha = DateTime.Now,
                    ModificaUsuarioId = UsuarioActual.UsuarioID,
                    PersonaIDRegistro = (long)UsuarioActual.UsuarioID

                };
                await ConexionBD.database.InsertAsync(CondicionSucursal);

                var res = await ConexionBD.database.QueryAsync<Condicionessucursales_VW>("WHERE ProductoID =@ProductoID AND SucursalId=@SucursalId", CondicionSucursal).FirstOrDefaultAsync();

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
        public async Task<IActionResult> Update(PeticionesRest.Creditos.CondicionSucursal.Update parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var CondicionSucursal = await ConexionBD.database.SingleByIdAsync<CondicionesSucursal>(new { parData.ProductoID, parData.SucursalId });
                CondicionSucursal.CondicionesID = parData.CondicionesID;
                CondicionSucursal.ModificaFecha = DateTime.Now;
                CondicionSucursal.ModificaUsuarioId = UsuarioActual.UsuarioID;

                await ConexionBD.database.UpdateAsync(CondicionSucursal);

                var res = await ConexionBD.database.QueryAsync<Condicionessucursales_VW>("WHERE ProductoID=@ProductoID AND SucursalId=@SucursalId", CondicionSucursal).FirstOrDefaultAsync();

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
        [Route("GuardarCondicionesCsv")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GuardarCondicionesCsv(PeticionesRest.Creditos.CondicionSucursal.GuardarCondicionesCsv parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                parData.UsuarioID = UsuarioActual.UsuarioID;

                var res = await ConexionBD.database.QueryAsync<dynamic>("EXEC Creditos.pa_CsvGuardarCondicionesDetalle @UsuarioID,@CondicionesList",parData).FirstOrDefaultAsync();
                
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
