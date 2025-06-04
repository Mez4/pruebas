using System.Data.Common;
using System.Net;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;

using DBContext.DBConfia;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Seguridad;
using DBContext.DBConfia.dbo;
using DBContext.DBConfia.Custom.Tesoreria;

using System.Net.Http;
using System.Collections.Generic;
using System.Text.Json;
using System.Collections;

namespace ConfiaWebApi.Controllers.Sistema
{
    [Authorize]
    [ApiController]
    [Route("api/SOMA/[controller]")]
    public class SaldosRestController : ControllerBase
    {
        // TODO::
        // Validar funcion de eliminar cuenta... ??, valido, util ?
        // Segundo, se pueden eliminar las bovedas ??, se pueden actualizar hasta que nivel? (Nombre y Clave o solo nombre?)

        /// <summary>
        /// Conexion a base de datos
        /// </summary>
        private DBConfiaContext DBContext;

        /// <summary>
        /// Constructor del controlador
        /// </summary>
        /// <param name="_DBContext">Conexión de datos para el controlador</param>
        public SaldosRestController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }
        [HttpGet]
        [Route("saldos")]
        [Authorize]
        public async Task<IActionResult> SaldosBovedasXSucursal()
        {
            var SucursalesXBovedas = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.SaldosBovedas_VW>("SELECT DISTINCT SucursalID, NombreSucursal FROM Tesoreria.SaldosBovedas_VW").ToArrayAsync();
            ArrayList BovedasConCaja = new();

            foreach (var item in SucursalesXBovedas)
            {
                BovedasConCaja.Add(new
                {
                    SucursalID = item.SucursalID,
                    NombreSucursal = item.NombreSucursal,
                    Bovedas = (await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.SaldosBovedas_VW>("WHERE SucursalID = @0", item.SucursalID).ToArrayAsync()),
                    NumeroBovedas = (await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.SaldosBovedas_VW>("WHERE SucursalID = @0", item.SucursalID).CountAsync()),
                    NumeroCajas = (await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.CatalogoCajas>("WHERE SucursalID=@0", item.SucursalID).CountAsync()),
                    TotalBovedas = (await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.SaldosBovedas_VW>(" SELECT SUM(SaldoActual) as SaldoActual from Tesoreria.SaldosBovedas_VW vw WHERE vw.SucursalID = @0", item.SucursalID).SingleOrDefaultAsync()),

                });
            }
            await DBContext.Destroy();
            return Ok(BovedasConCaja);
        }


        [HttpGet]
        [Route("saldos-totales")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> SaldosBC()
        {
            List<ModeloCajas> saldoCaja2 = new();
            List<ModeloBovedas> BovedasConCaja = new();
            ArrayList BovedasConCajaF = new();
            ArrayList Final = new();

            var saldoBoveda = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.SaldosBovedas_VW>();
            var sucursales = await DBContext.database.QueryAsync<DBContext.DBConfia.General.Sucursales>("WHERE SucursalID IN (SELECT SucursalID FROM Tesoreria.SaldosBovedas_VW)").ToArrayAsync();
            var saldoCaja = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.SaldosCajas_VW>();
            var saldosCajaProducto = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.SaldosCajaPorProducto_VW>();
            var SaldosBovedas = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.SaldosPorBoveda_VW>();


            foreach (var item in saldoCaja)
            {
                saldoCaja2.Add(new ModeloCajas()
                {
                    Estatus = item.Estatus,
                    SucursalID = item.SucursalID,
                    NombreSucursal = item.NombreSucursal,
                    CajaID = item.CajaID,
                    Nombre = item.Nombre,
                    EnOperacion = item.EnOperacion,
                    BovedaID = item.BovedaID,
                    NombreBoveda = item.NombreBoveda,
                    TotalCaja = item.TotalCaja,
                    DetalleProductos = (saldosCajaProducto.Where(ws => ws.CajaID == item.CajaID).ToList())
                });
            }

            foreach (var item in saldoBoveda)
            {
                BovedasConCaja.Add(new ModeloBovedas()
                {
                    SucursalID = item.SucursalID,
                    NombreSucursal = item.NombreSucursal,
                    BovedaID = item.BovedaID,
                    Activa = item.Activa,
                    NombreBoveda = item.Nombre,
                    SaldoBoveda = item.SaldoActual,
                    CuentaBancoID = item.CuentaBancoID,
                    NumeroCuenta = item.NumeroCuenta,
                    ProductoCuentaID = item.ProductoID,
                    ProductoCuenta = item.Producto,
                    SaldoTotalCajas = ((saldoCaja.Where(ws => ws.BovedaID == item.BovedaID).Sum(qty => qty.TotalCaja))),
                    Cajas = (saldoCaja2.Where(ws => ws.BovedaID == item.BovedaID).ToList()),
                    NumeroCajas = (saldoCaja.Where(ws => ws.BovedaID == item.BovedaID).Count()),

                });
            }


            foreach (var item in sucursales)
            {
                BovedasConCajaF.Add(new
                {
                    SucursalID = item.SucursalID,
                    NombreSucursal = item.Nombre,
                    NumeroCajas = (BovedasConCaja.Where(ws => ws.SucursalID == item.SucursalID).Sum(qty => qty.NumeroCajas)),
                    SaldoCajas = (saldoCaja.Where(ws => ws.SucursalID == item.SucursalID).Sum(qty => qty.TotalCaja)),
                    NumeroBovedas = (BovedasConCaja.Where(ws => ws.SucursalID == item.SucursalID).Count()),
                    SaldoBoveda = (SaldosBovedas.Where(ws => ws.SucursalID == item.SucursalID).Sum(sc => sc.SaldoTotal)),
                    Bovedas = (BovedasConCaja.Where(ws => ws.SucursalID == item.SucursalID)),
                });
            }
            await DBContext.Destroy();
            return Ok(BovedasConCajaF);

        }

        [HttpGet]
        [Route("saldos-producto/{CajaID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> SaldoPorProducto(int CajaID)
        {
            //   var saldoBoveda = await DBContext.database.QueryAsync<SaldoBovedaW>("EXEC Tesoreria.spSaldoBovedas").ToArrayAsync();
            var SaldosProductos = await DBContext.database.QueryAsync<DBContext.DBConfia.Tesoreria.SaldosCajaPorProducto_VW>("WHERE CajaID =@0", CajaID).ToArrayAsync();
            await DBContext.Destroy();
            return Ok(SaldosProductos);

        }
        // Obtenemos los balances
        [HttpGet]
        [Route("boveda")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Boveda()
        {
            //   var saldoBoveda = await DBContext.database.QueryAsync<SaldoBovedaW>("EXEC Tesoreria.spSaldoBovedas").ToArrayAsync();
            var saldoBoveda = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.SaldosBovedas_VW>();
            await DBContext.Destroy();
            return Ok(saldoBoveda);

        }

        [HttpGet]
        [Route("caja")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Cajas()
        {
            var saldoCaja = await DBContext.database.FetchAsync<DBContext.DBConfia.Tesoreria.SaldosCajas_VW>();
            await DBContext.Destroy();
            return Ok(saldoCaja);

        }
    }
}