using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Catalogos;
using DBContext.DBConfia.Sistema;

namespace ConfiaWebApi.Controllers.Catalogos
{
    [Authorize]
    [ApiController]
    [Route("api/Catalogos/[controller]")]
    public class VariableGlobalController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public VariableGlobalController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        public async Task<IActionResult> Get(PeticionesRest.Catalogos.VariableGlobal.Get parData)
        {
            if (parData.varName != "")
            {
                try
                {
                    var res = await DBContext.database.QueryAsync<VariablesGlobales>("WHERE  (varName = @varName)", parData).FirstOrDefaultAsync();
                    await DBContext.Destroy();

                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }

            if (parData.Id != 0)
            {
                try
                {
                    var res = await DBContext.database.SingleByIdAsync<VariablesGlobales>(parData.Id);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }

            // return Ok(DBContext.database.QueryAsync<Variablesglobales>("WHERE Id IN @0", parData).ToListAsync());
            var resM = await DBContext.database.FetchAsync<VariablesGlobales>();
            await DBContext.Destroy();
            return Ok(resM);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Catalogos.VariableGlobal.Add parData)
        {
            try
            {
                var Variablesglobales = new VariablesGlobales() { varName = parData.varName, varValue = parData.varValue, usuario = parData.usuario };
                await DBContext.database.InsertAsync(Variablesglobales);
                await DBContext.Destroy();
                return Ok(Variablesglobales);
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
        // [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Catalogos.VariableGlobal.Update parData)
        {
            try
            {
                var VariableGlobal = await DBContext.database.SingleByIdAsync<VariablesGlobales>(parData.Id);
                VariableGlobal.varName = parData.varName;
                VariableGlobal.varValue = parData.varValue;
                VariableGlobal.usuario = parData.usuario;
                await DBContext.database.UpdateAsync(VariableGlobal);
                await DBContext.Destroy();
                return Ok(VariableGlobal);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}
