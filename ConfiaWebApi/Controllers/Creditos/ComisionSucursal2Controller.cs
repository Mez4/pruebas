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

    public class ComisionSucursal2Controller : ControllerBase
    {
        private DBConfiaContext ConexionBD;

        public ComisionSucursal2Controller(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.Creditos.ComisionSucursal2.Get parData)
        {
            try
            {
                var res = await ConexionBD.database.FetchAsync<ComisionesSucursales_VW>("WHERE (ProductoID = @ProductoID OR @ProductoID = 0) AND (SucursalID = @SucursalID OR " +
                "@SucursalID = 0) AND (ComisionesID = @ComisionesID OR @ComisionesID = 0)", parData);
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
        public async Task<IActionResult> Add(PeticionesRest.Creditos.ComisionSucursal2.Add parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();


                var existComisionSucursal = await ConexionBD.database.QueryAsync<ComisionesSucursal>("WHERE ProductoID=@ProductoID AND SucursalId=@SucursalId", parData).ToArrayAsync();
                if (existComisionSucursal.Length > 0)
                {
                    await ConexionBD.Destroy();
                    return BadRequest("Ya existe una relación Producto-Sucursal");
                }

                var ComisionSucursal = new ComisionesSucursal()
                {
                    ProductoID = parData.ProductoID,
                    SucursalId = parData.SucursalId,
                    ComisionesID = parData.ComisionesID,
                    RegistroFecha = DateTime.Now,
                    RegistroUsuarioId = UsuarioActual.UsuarioID,
                    ModificaFecha = DateTime.Now,
                    ModificaUsuarioId = UsuarioActual.UsuarioID,
                    PersonaIDRegistro = (long)UsuarioActual.PersonaID
                };
                await ConexionBD.database.InsertAsync(ComisionSucursal);


                var res = await ConexionBD.database.QueryAsync<ComisionesSucursales_VW>("WHERE ProductoID=@ProductoID AND SucursalId =@SucursalId", ComisionSucursal).FirstOrDefaultAsync();


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
        public async Task<IActionResult> Update(PeticionesRest.Creditos.ComisionSucursal2.Update parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                //var upd = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.ComisionesSucursal>("WHERE ProductoID=@0 AND SucursalId=@1", parData.ProductoID, parData.SucursalId).SingleOrDefaultAsync();
                var upd = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Creditos.ComisionesSucursal>(new { parData.ProductoID, parData.SucursalId });
                upd.ComisionesID = parData.ComisionesID;
                upd.ModificaFecha = DateTime.Now;
                upd.ModificaUsuarioId = UsuarioActual.UsuarioID;
                //upd.ComisionesID = parData.ComisionesID;
                //ComisionSucursal2.ModificaFecha = DateTime.Now;
                //ComisionSucursal2.ModificaUsuarioId = UsuarioActual.UsuarioID;

                await ConexionBD.database.UpdateAsync(upd);

                var res = await ConexionBD.database.QueryAsync<ComisionesSucursales_VW>("WHERE ProductoID=@ProductoID AND SucursalId=@SucursalId", upd).FirstOrDefaultAsync();

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