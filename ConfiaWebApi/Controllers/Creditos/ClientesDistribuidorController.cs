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
using System.Collections;
using System.Collections.Generic;
using DBContext.DBConfia.Seguridad;
using DBContext.DBConfia.Custom.Creditos;

namespace ConfiaWebApi.Controllers.Creditos
{
    [Authorize]
    [ApiController]
    [Route("api/Creditos/[controller]")]
    public class ClientesDistribuidorController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public ClientesDistribuidorController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.Creditos.ClientesDistribuidor.Get parData)
        {

            try
            {
                var Clientes = await DBContext.database.FetchAsync<DistribuidoresClientesGlobalVW>("WHERE (ProductoID = @ProductoID) AND (DistribuidorID = @DistribuidorID) AND (ClienteID = @ClienteID OR @ClienteID = 0) AND SaldoActual > 0", parData);

                ArrayList res = new();

                foreach (var Cliente in Clientes)
                {

                    var Creditos = await DBContext.database.FetchAsync<DBContext.DBConfia.Creditos.Creditos>("WHERE (ClienteID = @0) AND (EstatusID = 'A')", Cliente.ClienteID);

                    //List<long> CreditosIds = new();

                    //foreach (var Credito in Creditos)
                    //{
                    //    CreditosIds.Add(Credito.CreditoID);
                    //}

                    res.Add(new
                    {
                        Cliente.ProductoGrupoID,
                        Cliente.ProductoID,
                        Cliente.SucursalID,
                        Cliente.ClienteID,
                        Cliente.DistribuidorID,
                        Cliente.NombreCompleto,
                        Cliente.MovCli,
                        Cliente.ImporteTotal,
                        Cliente.SaldoActual,
                        Cliente.PagosAtrasados,
                        Cliente.SaldoAtrasado,
                        Cliente.DiasAtraso,
                        Cliente.FechaHoraUltimoPago,
                        Cliente.Capital,
                        Cliente.Interes,
                        Cliente.Seguro,
                        Cliente.PagoMod,
                        Creditos
                        //CreditosIds
                    });
                }


                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("getClientesProducto")]
        [Authorize]
        [Code.TProteccionProducto]
        // [Code.KeycloakSecurityAttributes(new string[] { "CREDITOS" })]
        public async Task<IActionResult> getClientesProducto(PeticionesRest.Creditos.ClientesDistribuidor.Get parData)
        {

            try
            {
                // var dist = await DBContext.database.QueryAsync<DistribuidoresInfo>("WHERE DistribuidorID=@0", parData.DistribuidorID).FirstOrDefaultAsync();

                var res = await DBContext.database.FetchAsync<DistClientesProductoVW>("WHERE (DistribuidorID = @DistribuidorID) AND (ProductoID = @ProductoID OR @ProductoID = 0)", parData);
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                // return BadRequest(ex);
                // return BadRequest(ex);
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("getInfClientesProducto")]
        [Authorize]
        [Code.TProteccionProducto]
        // [Code.KeycloakSecurityAttributes(new string[] { "CREDITOS" })]
        public async Task<IActionResult> getInfClientesProducto(PeticionesRest.Creditos.ClientesDistribuidor.Get parData)
        {

            try
            {
                // var dist = await DBContext.database.QueryAsync<DistribuidoresInfo>("WHERE DistribuidorID=@0", parData.DistribuidorID).FirstOrDefaultAsync();

                var res = await DBContext.database.FetchAsync<DistClientesProductoVW>("WHERE (DistribuidorID = @DistribuidorID) AND (ProductoID = @ProductoID OR @ProductoID = 0)", parData);
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                // return BadRequest(ex);
                // return BadRequest(ex);
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("getCreditosCliente")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetCreditosCliente(PeticionesRest.Creditos.Credito.GetCreditosCliente parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {

                    parData.ProductoID = producto;

                var res = await DBContext.database.QueryAsync<Creditos_VW>("EXEC Creditos.pa_getCreditosPagosClientes @ProductoID,@DistribuidorID ,@ClienteID", parData).ToArrayAsync();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                // return NotFound(ex.Message);
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("getDetallesCliente")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetDetallesCliente(PeticionesRest.Creditos.Credito.GetDetallesCliente parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                if (parData.ProductoID.Value == 0)
                    parData.ProductoID = producto;
                var res = await DBContext.database.FetchAsync<Creditos_VW>("WHERE (ProductoID = @ProductoID OR @Todos = 1) AND (DistribuidorID = @DistribuidorID OR @DistribuidorID = 0) AND (ClienteID = @ClienteID) AND (EstatusID = 'A')", parData);
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                // return NotFound(ex.Message);
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }



        [HttpPost]
        [Route("getCreditosPrductoCliente")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> GetCreditosPrductoCliente(PeticionesRest.Creditos.Credito.GetCreditosCliente parData)
        {
            try
            {
                var res = await DBContext.database.FetchAsync<Creditos_VW>("WHERE ClienteID = @ClienteID", parData);
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                // return NotFound(ex.Message);
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("getCreditosProdCliente")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetCreditosProdCliente(PeticionesRest.Creditos.Credito.GetCreditosCliente parData,[FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                
                parData.ProductoID = producto;                
                //var res = await DBContext.database.FetchAsync<Creditos_VW>("WHERE ClienteID = @ClienteID", parData);
                var res = await DBContext.database.FetchAsync<Creditos_VW>(" WHERE ClienteID = @ClienteID AND (ProductoID = @ProductoID OR @ProductoID = 0)", parData);
                await DBContext.Destroy(); 
                return Ok(res);
            }
            catch (Exception ex)
            {
                // return NotFound(ex.Message);
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("getInfoDistribuidor")]
        [Authorize]
        [Code.TProteccionAdmin]
        // [Code.KeycloakSecurityAttributes(new string[] { "CREDITOS" })]
        public async Task<IActionResult> GetInfoDistribuidor(PeticionesRest.Creditos.GetDistInfo.GetDistribuidorInfo parData)
        {
            try
            {
                // var res = await DBContext.database.FetchAsync<DistribuidoresInfo>("WHERE DistribuidorID = @DistribuidorID", parData);
                var dist = await DBContext.database.QueryAsync<DistribuidoresInfo>("WHERE DistribuidorID=@0", parData.DistribuidorID).FirstOrDefaultAsync();
                await DBContext.Destroy();
                return Ok(dist);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
                // return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("getInfDistribuidor")]
        [Authorize]
        [Code.TProteccionProducto]
        // [Code.KeycloakSecurityAttributes(new string[] { "CREDITOS" })]
        public async Task<IActionResult> GetInfDistribuidor(PeticionesRest.Creditos.GetDistInfo.GetDistribuidorInfo parData)
        {
            try
            {
                // var res = await DBContext.database.FetchAsync<DistribuidoresInfo>("WHERE DistribuidorID = @DistribuidorID", parData);
                var dist = await DBContext.database.QueryAsync<DistribuidoresInfo>("WHERE DistribuidorID=@0", parData.DistribuidorID).FirstOrDefaultAsync();
                await DBContext.Destroy();
                return Ok(dist);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
                // return NotFound(ex.Message);
            }
        }
    }
}
