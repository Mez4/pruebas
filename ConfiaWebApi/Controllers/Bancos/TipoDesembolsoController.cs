
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Bancos;
using DBContext.DBConfia.Sistema;
using System.Collections;

namespace ConfiaWebApi.Controllers.Bancos
{
    [Authorize]
    [ApiController]
    [Route("api/Bancos/[controller]")]
    public class TipoDesembolsoController : ControllerBase
    {
        private DBConfiaContext DBContext;
        public TipoDesembolsoController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.Bancos.TipoDesembolso.Get parData)
        {
            if (parData.Id != 0)
            {
                try
                {
                    var TipoDesembolso = await DBContext.database.SingleByIdAsync<TiposDesembolso>(parData.Id);
                    var TipoMovimiento = await DBContext.database.QueryAsync<TiposMovimientos>("WHERE Id = @0", TipoDesembolso.TipoMovimientoID).FirstOrDefaultAsync();
                    var res = new
                    {
                        TipoDesembolso.TipoDesembolsoID,
                        TipoDesembolso.TipoDesembolso,
                        TipoDesembolso.Activo,
                        TipoDesembolso.TipoMovimientoID,
                        TipoDesembolso.FormatoImpresionExtra,
                        TipoDesembolso.RequiereDatosBancarios,
                        TipoMovimiento,
                    };
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }
            }
            try
            {
                var TiposDesembolso = await DBContext.database.FetchAsync<TiposDesembolso>();
                var TiposMovimientos = await DBContext.database.FetchAsync<TiposMovimientos>();
                ArrayList res = new();
                foreach (var TipoDesembolso in TiposDesembolso)
                {
                    var TipoMovimiento = TiposMovimientos.Where(x => x.Id == TipoDesembolso.TipoMovimientoID).FirstOrDefault();
                    res.Add(new
                    {
                        TipoDesembolso.TipoDesembolsoID,
                        TipoDesembolso.TipoDesembolso,
                        TipoDesembolso.Activo,
                        TipoDesembolso.TipoMovimientoID,
                        TipoDesembolso.FormatoImpresionExtra,
                        TipoDesembolso.RequiereDatosBancarios,
                        TipoMovimiento
                    });
                }
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
        [Route("getBySucursal")]
        [Authorize]
        [Code.TProteccionProducto]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> GetBySucursal(PeticionesRest.Bancos.TipoDesembolso.Get parData)
        {
            try
            {
                var TiposDesembolso = await DBContext.database.FetchAsync<TiposDesembolso>("SELECT tds.TipoDesembolsoID, td.TipoDesembolso, td.Activo, td.TipoMovimientoID, td.FormatoImpresionExtra, td.RequiereDatosBancarios FROM Bancos.TiposDesembolsoSucursal AS tds INNER JOIN Bancos.TiposDesembolso AS td ON tds.TipoDesembolsoID = td.TipoDesembolsoID WHERE (tds.SucursalId = @SucursalId) AND (td.Activo = 1)", parData);
                ArrayList res = new();
                foreach (var TipoDesembolso in TiposDesembolso)
                {
                    res.Add(new
                    {
                        TipoDesembolso.TipoDesembolsoID,
                        TipoDesembolso.TipoDesembolso,
                        TipoDesembolso.Activo,
                        TipoDesembolso.TipoMovimientoID,
                        TipoDesembolso.FormatoImpresionExtra,
                        TipoDesembolso.RequiereDatosBancarios
                    });
                }
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
        [Route("getBySucursalProducto")]
        [Authorize]
        [Code.TProteccionAdmin]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> GetBySucursalProducto(PeticionesRest.Bancos.TipoDesembolso.Get parData)
        {
            try
            {
                var res = await DBContext.database.FetchAsync<TiposDesembolso>("SELECT tds.TipoDesembolsoID, td.TipoDesembolso, td.Activo, td.TipoMovimientoID, td.FormatoImpresionExtra, td.RequiereDatosBancarios FROM Bancos.TiposDesembolsoSucursal AS tds INNER JOIN Bancos.TiposDesembolso AS td ON tds.TipoDesembolsoID = td.TipoDesembolsoID WHERE (tds.SucursalId = @SucursalId) AND (td.Activo = 1) AND (tds.ProductoID = @ProductoID)", parData);
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
        [Route("getSucursalProducto")]
        [Authorize]
        [Code.TProteccionProducto]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> GetSucursalProducto(PeticionesRest.Bancos.TipoDesembolso.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                //parData.ProductoID = producto;
                var res = await DBContext.database.FetchAsync<TiposDesembolso>("SELECT tds.TipoDesembolsoID, td.TipoDesembolso, td.Activo, td.TipoMovimientoID, td.FormatoImpresionExtra, td.RequiereDatosBancarios FROM Bancos.TiposDesembolsoSucursal AS tds INNER JOIN Bancos.TiposDesembolso AS td ON tds.TipoDesembolsoID = td.TipoDesembolsoID WHERE (tds.SucursalId = @SucursalId) AND (td.Activo = 1) AND (tds.ProductoID = @ProductoID OR @ProductoID = 0) AND tds.OcultarEnCanje = 0", parData);
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
        [Route("getSucursalProductoModificable")]
        [Authorize]
        [Code.TProteccionProducto]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> GetSucursalProductoModificable(PeticionesRest.Bancos.TipoDesembolso.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                //parData.ProductoID = producto;
                var res = await DBContext.database.FetchAsync<TiposDesembolso>("SELECT tds.TipoDesembolsoID, td.TipoDesembolso, td.Activo, td.TipoMovimientoID, td.FormatoImpresionExtra, td.RequiereDatosBancarios FROM Bancos.TiposDesembolsoSucursal AS tds INNER JOIN Bancos.TiposDesembolso AS td ON tds.TipoDesembolsoID = td.TipoDesembolsoID WHERE (tds.SucursalId = @SucursalId) AND (td.Activo = 1) AND (tds.ProductoID = @ProductoID OR @ProductoID = 0) AND (Modificable = 1)", parData);
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
        public async Task<IActionResult> Add(PeticionesRest.Bancos.TipoDesembolso.Add parData)
        {
            try
            {
                var TipoDesembolso = new TiposDesembolso() { TipoDesembolso = parData.TipoDesembolso, Activo = parData.Activo, TipoMovimientoID = parData.TipoMovimientoID, FormatoImpresionExtra = parData.FormatoImpresionExtra, RequiereDatosBancarios = parData.RequiereDatosBancarios };
                await DBContext.database.InsertAsync(TipoDesembolso);
                var TipoMovimiento = await DBContext.database.QueryAsync<TiposMovimientos>("WHERE Id = @0", TipoDesembolso.TipoMovimientoID).FirstOrDefaultAsync();
                var res = new
                {
                    TipoDesembolso.TipoDesembolsoID,
                    TipoDesembolso.TipoDesembolso,
                    TipoDesembolso.Activo,
                    TipoDesembolso.TipoMovimientoID,
                    TipoDesembolso.FormatoImpresionExtra,
                    TipoDesembolso.RequiereDatosBancarios,
                    TipoMovimiento,
                };
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
        [Code.TProteccionProducto]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Bancos.TipoDesembolso.Update parData)
        {
            try
            {
                var TipoDesembolso = await DBContext.database.SingleByIdAsync<TiposDesembolso>(parData.TipoDesembolsoID);
                TipoDesembolso.TipoDesembolso = parData.TipoDesembolso;
                TipoDesembolso.Activo = parData.Activo;
                TipoDesembolso.TipoMovimientoID = parData.TipoMovimientoID;
                TipoDesembolso.FormatoImpresionExtra = parData.FormatoImpresionExtra;
                TipoDesembolso.RequiereDatosBancarios = parData.RequiereDatosBancarios;
                await DBContext.database.UpdateAsync(TipoDesembolso);
                var TipoMovimiento = await DBContext.database.QueryAsync<TiposMovimientos>("WHERE Id = @0", TipoDesembolso.TipoMovimientoID).FirstOrDefaultAsync();
                var res = new
                {
                    TipoDesembolso.TipoDesembolsoID,
                    TipoDesembolso.TipoDesembolso,
                    TipoDesembolso.Activo,
                    TipoDesembolso.TipoMovimientoID,
                    TipoDesembolso.FormatoImpresionExtra,
                    TipoDesembolso.RequiereDatosBancarios,
                    TipoMovimiento,
                };
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
        [Route("getTienditaSocia")]
        [Authorize]
        [Code.TProteccionProducto]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> getTienditaSocia(PeticionesRest.Bancos.TipoDesembolso.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                parData.ProductoID = producto;
                var res = await DBContext.database.FetchAsync<TiposDesembolso>("SELECT tds.TipoDesembolsoID, td.TipoDesembolso, td.Activo, td.TipoMovimientoID, td.FormatoImpresionExtra, td.RequiereDatosBancarios FROM Bancos.TiposDesembolsoSucursal AS tds INNER JOIN Bancos.TiposDesembolso AS td ON tds.TipoDesembolsoID = td.TipoDesembolsoID WHERE (tds.SucursalId = @SucursalId) AND (td.Activo = 1) AND (tds.ProductoID = @ProductoID OR @ProductoID = 0) AND td.TipoDesembolso = 'MERCANCIA CONFIASHOP'", parData);

                if(res.Count == 0)
                {
                    await DBContext.Destroy();
                    return Ok(new
                    {
                        status = false,
                        msj = "No hay tipo de desembolso Tiendita para la sucursal seleccionada"
                    });
                }
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }
    }
}