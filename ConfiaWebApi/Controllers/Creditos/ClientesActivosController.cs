using System;
using System.Linq;
using System.Threading.Tasks;
using DBContext.DBConfia;

using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.PasoCVVR_JC;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ConfiaWebApi.Controllers.ClientesActivos
{
    [Route("api/Clientes/[controller]")]
    [ApiController]
    public class ClientesActivosController : ControllerBase
    {
        private DBConfiaContext DBContext;
        
        public ClientesActivosController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpGet]
        [Route("getClienteActivo/{clienteId}")]
        [Authorize]
        public async Task<IActionResult> GetClientesActivo(int clienteId)
        {
            // TODO: Implement logic to create a new client
            try
            {
                var sql = "SELECT ClienteID, NombreCompleto, CreacionFecha FROM Creditos.Clientes_VW WHERE DistribuidorID = @0 AND EsttausId = 1";
                var Clientes = await DBContext.database.QueryAsync<CreditosActivos_VW>(sql, clienteId).ToArrayAsync();


                return Ok(Clientes);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpGet]
        [Route("getClienteCreditos/{clienteId}")]
        [Authorize]
        public async Task<IActionResult> GetClientesCreditos(int clienteId)
        {
            // TODO: Implement logic to create a new client
            try
            {
                var creditosId = await DBContext.database.QueryAsync<ClientesCreditosVw>("WHERE ClienteID = @0", clienteId).ToArrayAsync();

                return Ok(creditosId); 

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpGet]
        [Route("getPlanPagos/{creditoId}")]
        [Authorize]
        public async Task<IActionResult> GetPlanPagos(int creditoId)
        {
            // TODO: Implement logic to create a new client
            try
            {
                var creditos = await DBContext.database.QueryAsync<PlanPagos>("WHERE CreditoID = @0", creditoId).ToArrayAsync();
                return Ok(creditos);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }
    }
}
