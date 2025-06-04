/*
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
    public class CuentaDesembolsoTipoController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public CuentaDesembolsoTipoController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "BANCOS_USUARIO_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Bancos.CuentaDesembolsoTipo.Get parData)
        {
            if (parData.Id != 0)
            {
                try
                {
                    var CuentaDesembolsoTipo = await DBContext.database.QueryAsync<CuentasDesembolsosTipos>("WHERE Id=@Id", parData).FirstOrDefaultAsync();
                    var Cuenta = (await CuentaDesembolsoTipo.CH__CUENTA(DBContext)).FirstOrDefault();
                    var TipoDesembolso = (await CuentaDesembolsoTipo.CH__TIPO_DESENBOLSO(DBContext)).FirstOrDefault();

                    var res = new
                    {
                        CuentaDesembolsoTipo.Id,
                        CuentaDesembolsoTipo.cuentaId,
                        CuentaDesembolsoTipo.tipoDesembolsoId,
                        CuentaDesembolsoTipo.activo,
                        Cuenta,
                        TipoDesembolso
                    };

                    return Ok(res);

                }
                catch (Exception ex)
                {
                    return NotFound(ex.Message);
                }

            }
            else
            {
                try
                {

                    var Cuenta = await DBContext.database.FetchAsync<CuentasDesembolsosTipos>();

                    ArrayList res = new();

                    foreach (var T in Cuenta)
                    {
                        res.Add(new
                        {
                            T.Id,
                            T.cuentaId,
                            T.tipoDesembolsoId,
                            T.activo,
                            Cuenta = (await T.CH__CUENTA(this.DBContext)).FirstOrDefault(),
                            TipoDesembolso = (await T.CH__TIPO_DESENBOLSO(this.DBContext)).FirstOrDefault()
                        });
                    }

                    return Ok(res);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }

            //return Ok(await DBContext.database.FetchAsync<CuentasDesembolsosTipos>());
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "BANCOS_USUARIO_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Bancos.CuentaDesembolsoTipo.Add parData)
        {
            try
            {
                var CuentaDesembolsoTipo = new CuentasDesembolsosTipos() { cuentaId = parData.cuentaId, tipoDesembolsoId = parData.tipoDesembolsoId, activo = parData.activo };

                await DBContext.database.InsertAsync(CuentaDesembolsoTipo);

                var Cuenta = (await CuentaDesembolsoTipo.CH__CUENTA(DBContext)).FirstOrDefault();

                var TipoDesembolso = (await CuentaDesembolsoTipo.CH__TIPO_DESENBOLSO(DBContext)).FirstOrDefault();

                var res = new
                {
                    CuentaDesembolsoTipo.Id,
                    CuentaDesembolsoTipo.cuentaId,
                    CuentaDesembolsoTipo.tipoDesembolsoId,
                    CuentaDesembolsoTipo.activo,
                    Cuenta,
                    TipoDesembolso
                };

                return Ok(res);

                //return Ok(CuentaDesembolsoTipo);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("update")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "BANCOS_USUARIO_ADMIN" })]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Bancos.CuentaDesembolsoTipo.Update parData)
        {
            try
            {
                var CuentaDesembolsoTipo = await DBContext.database.SingleByIdAsync<CuentasDesembolsosTipos>(parData.Id);
                CuentaDesembolsoTipo.cuentaId = parData.cuentaId;
                CuentaDesembolsoTipo.tipoDesembolsoId = parData.tipoDesembolsoId;
                CuentaDesembolsoTipo.activo = parData.activo;

                await DBContext.database.UpdateAsync(CuentaDesembolsoTipo);

                var Cuenta = (await CuentaDesembolsoTipo.CH__CUENTA(DBContext)).FirstOrDefault();

                var TipoDesembolso = (await CuentaDesembolsoTipo.CH__TIPO_DESENBOLSO(DBContext)).FirstOrDefault();

                var res = new
                {
                    CuentaDesembolsoTipo.Id,
                    CuentaDesembolsoTipo.cuentaId,
                    CuentaDesembolsoTipo.tipoDesembolsoId,
                    CuentaDesembolsoTipo.activo,
                    Cuenta,
                    TipoDesembolso
                };

                return Ok(res);

                //return Ok(CuentaDesembolsoTipo);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
*/
