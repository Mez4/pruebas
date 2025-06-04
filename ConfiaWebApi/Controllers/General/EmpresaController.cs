using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Sistema;

namespace ConfiaWebApi.Controllers.General
{
    [Authorize]
    [ApiController]
    [Route("api/General/[controller]")]
    public class EmpresaController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public EmpresaController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> Get(PeticionesRest.General.Empresa.Get parData)
        {
            if (parData.Id != 0)
            {
                try
                {
                    var resS = await DBContext.database.SingleByIdAsync<Empresas>(parData.Id);
                    await DBContext.Destroy();
                    return Ok(resS);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            var res = await DBContext.database.FetchAsync<Empresas>();
            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("get2")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> Get2(PeticionesRest.General.Empresa.Get parData)
        {
            try
            {
                var res = await DBContext.database.FetchAsync<Empresas_VW>();
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
        [Code.TProteccionAdmin]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.General.Empresa.Add parData)
        {
            try
            {
                var empresa = new Empresas() { empresaNombre = parData.EmpresaNombre , empresaRfc = parData.EmpresaRfc, 
                empresaDireccionFiscal = parData.EmpresaDireccionFiscal, empresaRegistroPatronal = parData.EmpresaRegistroPatronal, 
                empresaRazonSocial = parData.EmpresaRazonSocial, TipoEmpresaID = parData.TipoEmpresaID };
                await DBContext.database.InsertAsync(empresa);
                await DBContext.Destroy();
                return Ok(empresa);
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
        [Code.TProteccionAdmin]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.General.Empresa.Update parData)
        {
            try
            {
                var empresa = await DBContext.database.SingleByIdAsync<Empresas>(parData.EmpresaId);

                empresa.empresaNombre = parData.EmpresaNombre;
                empresa.empresaRfc = parData.EmpresaRfc;
                empresa.empresaDireccionFiscal = parData.EmpresaDireccionFiscal;
                empresa.empresaRegistroPatronal = parData.EmpresaRegistroPatronal;
                empresa.empresaRazonSocial = parData.EmpresaRazonSocial;
                empresa.TipoEmpresaID = parData.TipoEmpresaID;
                
                await DBContext.database.UpdateAsync(empresa);
                await DBContext.Destroy();
                return Ok(empresa);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpPost]
        [Route("getEmpresas")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> Get()
        {
            try
            {
                var res = await DBContext.database.FetchAsync<TiposEmpresas>();
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
