using DBContext.DBConfia;
using DBContext.DBConfia.Tesoreria;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.Tesoreria
{
    [Authorize]
    [ApiController]
    [Route("api/tesoreria/[controller]")]
    public class CuentasContablesController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public CuentasContablesController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "TESORERIA_USUARIO_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Tesoreria.CuentasContables.Get parData)
        {
            try
            {
                if (parData.CuentaID != 0)
                {
                    var res = await DBContext.database.SingleByIdAsync<CuentasContables>(parData.CuentaID);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                var res1 = await DBContext.database.FetchAsync<CuentasContables>();
                await DBContext.Destroy();
                return Ok(res1);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "TESORERIA_USUARIO_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Tesoreria.CuentasContables.Add parData)
        {
            try
            {
                var cuentascontables = new CuentasContables() { Cuenta = parData.Cuenta, AcumulaCuentaID = parData.AcumulaCuentaID, Nombre = parData.Nombre, TipoID = parData.TipoID, NaturalezaID = parData.NaturalezaID, RubroID = parData.RubroID, EmpresaID = parData.EmpresaID, CatMonedaSatID = parData.CatMonedaSatID, Activa = parData.Activa, FechaRegistro = parData.FechaRegistro };
                await DBContext.database.InsertAsync(cuentascontables);
                await DBContext.Destroy();
                return Ok(cuentascontables);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("update")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "TESORERIA_USUARIO_ADMIN" })]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Tesoreria.CuentasContables.Update parData)
        {
            try
            {
                var cuentascontables = await DBContext.database.SingleByIdAsync<CuentasContables>(parData.CuentaID);
                cuentascontables.Cuenta = parData.Cuenta;
                cuentascontables.AcumulaCuentaID = parData.AcumulaCuentaID;
                cuentascontables.Nombre = parData.Nombre;
                cuentascontables.TipoID = parData.TipoID;
                cuentascontables.NaturalezaID = parData.NaturalezaID;
                cuentascontables.RubroID = parData.RubroID;
                cuentascontables.EmpresaID = parData.EmpresaID;
                cuentascontables.CatMonedaSatID = parData.CatMonedaSatID;
                cuentascontables.Activa = parData.Activa;
                cuentascontables.FechaRegistro = parData.FechaRegistro;

                await DBContext.database.UpdateAsync(cuentascontables);
                await DBContext.Destroy();
                return Ok(cuentascontables);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }


}
