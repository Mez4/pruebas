/*
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Bancos;
using DBContext.DBConfia.Seguridad;
using System.Collections;
using System.Security.Claims;


//namespace ConfiaWebApi.Models.DBConfia.Bancos
//{
//    [Authorize]
//    [ApiController]
//    [Route("api/Bancos/[controller]")]
//    public class CuentaCorteController : ControllerBase
//    {
//        private DBConfiaContext DBContext;

//        public CuentaCorteController(DBConfiaContext _DBContext)
//        {
//            DBContext = _DBContext;
//        }

//        [HttpPost]
//        [Route("get")]
//        [Authorize]
//        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "BANCOS_USUARIO_ADMIN" })]
//        public async Task<IActionResult> Get(PeticionesRest.Bancos.CuentaCorte.Get parData)
//        {

//            if (parData.Id != 0)
//            {
//                try
//                {
//                    var CuentaCorte = await DBContext.database.QueryAsync<CuentasCortes>("WHERE corteId=@Id", parData).FirstOrDefaultAsync();
//                    var Cuenta = (await CuentaCorte.CH__CUENTAS(DBContext)).FirstOrDefault();
//                    var Usuario = (await CuentaCorte.CH__USUARIO(DBContext)).FirstOrDefault();

//                    var res = new
//                    {
//                        CuentaCorte.corteId,
//                        CuentaCorte.cuentaId,
//                        fecha = CuentaCorte.fecha.ToString("dd/MM/yyyy"),
//                        CuentaCorte.usuarioID,
//                        CuentaCorte.observaciones,
//                        CuentaCorte.importeSistema,
//                        CuentaCorte.importeFisico,
//                        CuentaCorte.diferencia,
//                        fechaCaptura = CuentaCorte.fechaCaptura.ToString("dd/MM/yyyy"),
//                        CuentaCorte.saldoInicial,
//                        CuentaCorte.cancelado,
//                        CuentaCorte.usuarioIdCancela,
//                        CuentaCorte.comentarioCancela,
//                        CuentaCorte.importeSistemaAnt,
//                        CuentaCorte.importeFisicoAnt,
//                        fechaAnt = CuentaCorte.fechaAnt.HasValue ? CuentaCorte.fechaAnt.Value.ToString("dd/MM/yyyy") : "N/A",
//                        Cuenta,
//                        Usuario = new
//                        {
//                            Usuario.UsuarioID,
//                            Usuario.Usuario,
//                            Usuario.Nombre
//                        }
//                    };

//                    return Ok(res);
//                }
//                catch (Exception ex)
//                {
//                    return NotFound(ex.Message);
//                }

//            }
//            else
//            {
//                try
//                {

//                    var CuentaCorte = await DBContext.database.FetchAsync<CuentasCortes>();

//                    ArrayList res = new();

//                    foreach (var T in CuentaCorte)
//                    {
//                        var Usuario = (await T.CH__USUARIO(this.DBContext)).FirstOrDefault();
//                        res.Add(new
//                        {
//                            T.corteId,
//                            T.cuentaId,
//                            fecha = T.fecha.ToString("dd/MM/yyyy"),
//                            T.usuarioID,
//                            T.observaciones,
//                            T.importeSistema,
//                            T.importeFisico,
//                            T.diferencia,
//                            fechaCaptura = T.fechaCaptura.ToString("dd/MM/yyyy"),
//                            T.saldoInicial,
//                            T.cancelado,
//                            T.usuarioIdCancela,
//                            T.comentarioCancela,
//                            T.importeSistemaAnt,
//                            T.importeFisicoAnt,
//                            fechaAnt = T.fechaAnt.HasValue ? T.fechaAnt.Value.ToString("dd/MM/yyyy") : "N/A",
//                            Cuenta = (await T.CH__CUENTAS(this.DBContext)).FirstOrDefault(),
//                            Usuario = new
//                            {
//                                Usuario.UsuarioID,
//                                Usuario.Usuario,
//                                Usuario.Nombre
//                            }
//                        });
//                    }

//                    return Ok(res);
//                }
//                catch (Exception ex)
//                {
//                    return BadRequest(ex.Message);
//                }
//            }
//        }

//        [HttpPost]
//        [Route("add")]
//        [Authorize]
//        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "BANCOS_USUARIO_ADMIN" })]
//        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Bancos.CuentaCorte.Add parData)
//        {
//            try
//            {

//                var CuentaCorteAnt = await DBContext.database.QueryAsync<CuentasCortes>("WHERE (cancelado = 0) ORDER BY corteId DESC", parData).FirstOrDefaultAsync();
//                var userId = int.Parse(HttpContext.User.Claims.Where(x => x.Type == "Id").FirstOrDefault().Value);
//                var saldoInicial = (await CuentaCorteAnt.CH__CUENTAS(DBContext)).FirstOrDefault().importeEnBalance;

//                var CuentaCorte = new CuentasCortes()
//                {
//                    cuentaId = parData.cuentaId,
//                    fecha = parData.fecha,
//                    usuarioID = userId,
//                    observaciones = parData.observaciones,
//                    importeSistema = parData.importeSistema,
//                    importeFisico = parData.importeFisico,
//                    fechaCaptura = DateTime.Now,
//                    saldoInicial = saldoInicial,
//                    cancelado = false,
//                    usuarioIdCancela = null,
//                    comentarioCancela = null,
//                    importeSistemaAnt = CuentaCorteAnt.importeSistema,
//                    importeFisicoAnt = CuentaCorteAnt.importeFisico,
//                    fechaAnt = CuentaCorteAnt.fecha
//                };

//                await DBContext.database.InsertAsync(CuentaCorte);

//                var Cuenta = (await CuentaCorte.CH__CUENTAS(DBContext)).FirstOrDefault();

//                var Usuario = (await CuentaCorte.CH__USUARIO(DBContext)).FirstOrDefault();

//                var res = new
//                {
//                    CuentaCorte.corteId,
//                    CuentaCorte.cuentaId,
//                    fecha = CuentaCorte.fecha.ToString("dd/MM/yyyy"),
//                    CuentaCorte.usuarioID,
//                    CuentaCorte.observaciones,
//                    CuentaCorte.importeSistema,
//                    CuentaCorte.importeFisico,
//                    CuentaCorte.diferencia,
//                    fechaCaptura = CuentaCorte.fechaCaptura.ToString("dd/MM/yyyy"),
//                    CuentaCorte.saldoInicial,
//                    CuentaCorte.cancelado,
//                    CuentaCorte.usuarioIdCancela,
//                    CuentaCorte.comentarioCancela,
//                    CuentaCorte.importeSistemaAnt,
//                    CuentaCorte.importeFisicoAnt,
//                    fechaAnt = CuentaCorte.fechaAnt.HasValue ? CuentaCorte.fechaAnt.Value.ToString("dd/MM/yyyy") : "N/A",
//                    Cuenta,
//                    Usuario = new
//                    {
//                        Usuario.UsuarioID,
//                        Usuario.Usuario,
//                        Usuario.Nombre
//                    }
//                };

//                return Ok(res);

//            }
//            catch (Exception ex)
//            {
//                return BadRequest(ex.Message);
//            }
//        }

//        [HttpPost]
//        [Route("update")]
//        [Authorize]
//        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "BANCOS_USUARIO_ADMIN" })]
//        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Bancos.CuentaCorte.Update parData)
//        {
//            try
//            {
//                //var userId = int.Parse(HttpContext.User.Claims.Where(x => x.Type == "Id").FirstOrDefault().Value);

//                var CuentaCorte = await DBContext.database.SingleByIdAsync<CuentasCortes>(parData.corteId);
//                CuentaCorte.cuentaId = parData.cuentaId;
//                CuentaCorte.fecha = parData.fecha;
//                CuentaCorte.usuarioID = parData.usuarioID;
//                CuentaCorte.observaciones = parData.observaciones;
//                CuentaCorte.importeSistema = parData.importeSistema;
//                CuentaCorte.importeFisico = parData.importeFisico;
//                CuentaCorte.diferencia = parData.diferencia;
//                CuentaCorte.fechaCaptura = parData.fechaCaptura;
//                CuentaCorte.saldoInicial = parData.saldoInicial;
//                CuentaCorte.cancelado = parData.cancelado;
//                CuentaCorte.usuarioIdCancela = parData.usuarioIdCancela;
//                CuentaCorte.comentarioCancela = parData.comentarioCancela;
//                CuentaCorte.importeSistemaAnt = parData.importeSistemaAnt;
//                CuentaCorte.importeFisicoAnt = parData.importeFisicoAnt;
//                CuentaCorte.fechaAnt = parData.fechaAnt;

//                await DBContext.database.UpdateAsync(CuentaCorte);

//                var Cuenta = (await CuentaCorte.CH__CUENTAS(DBContext)).FirstOrDefault();

//                var Usuario = (await CuentaCorte.CH__USUARIO(DBContext)).FirstOrDefault();

//                var res = new
//                {
//                    CuentaCorte.corteId,
//                    CuentaCorte.cuentaId,
//                    CuentaCorte.fecha,
//                    CuentaCorte.usuarioID,
//                    CuentaCorte.observaciones,
//                    CuentaCorte.importeSistema,
//                    CuentaCorte.importeFisico,
//                    CuentaCorte.diferencia,
//                    CuentaCorte.fechaCaptura,
//                    CuentaCorte.saldoInicial,
//                    CuentaCorte.cancelado,
//                    CuentaCorte.usuarioIdCancela,
//                    CuentaCorte.comentarioCancela,
//                    CuentaCorte.importeSistemaAnt,
//                    CuentaCorte.importeFisicoAnt,
//                    fechaAnt = CuentaCorte.fechaAnt.HasValue ? CuentaCorte.fechaAnt.Value.ToString("dd/MM/yyyy") : "N/A",
//                    Cuenta,
//                    Usuario = new
//                    {
//                        Usuario.UsuarioID,
//                        Usuario.Usuario,
//                        Usuario.Nombre
//                    }
//                };

//                return Ok(res);
//                //return Ok(Ciudad);
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(ex.Message);
//            }
//        }

    }
}
*/
