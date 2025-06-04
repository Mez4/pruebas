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

//namespace ConfiaWebApi.Controllers.Catalogos
//{
//    //[Authorize]
//    [ApiController]
//    [Route("api/Bancos/[controller]")]
//    public class DispersionController : ControllerBase
//    {
//        private DBConfiaContext DBContext;

//        public DispersionController(DBConfiaContext _DBContext)
//        {
//            DBContext = _DBContext;
//        }

//        [HttpPost]
//        [Route("get")]
//        [Authorize]
//        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "BANCOS_USUARIO_ADMIN" })]
//        public async Task<IActionResult> Get(PeticionesRest.Bancos.Dispersion.Get parData)
//        {

//            if (parData.Id != 0)
//            {
//                try
//                {
//                    var Dispersion = await DBContext.database.QueryAsync<Dispersiones>("WHERE CuentaID=@Id", parData).FirstOrDefaultAsync();
//                    var Cuenta = (await Dispersion.CH__CUENTA(DBContext)).FirstOrDefault();
//                    var Usuario = (await Dispersion.CH__USUARIO(DBContext)).FirstOrDefault();
//                    var DispersionStatus = (await Dispersion.CH__DISPERCION_STATUS(DBContext)).FirstOrDefault();

//                    var res = new
//                    {
//                        Dispersion.DispersionID,
//                        Dispersion.CuentaID,
//                        FHRegistro = Dispersion.FHRegistro.ToString("dd/MM/yyyy"),
//                        Dispersion.ConsecutivoDia,
//                        Dispersion.ImporteTotal,
//                        Dispersion.CantidadMovimientos,
//                        Dispersion.UsuarioID,
//                        Dispersion.Cancelacion,
//                        Dispersion.DispersionEstatusID,
//                        Cuenta,
//                        Usuario = new
//                        {
//                            Usuario.UsuarioID,
//                            Usuario.Usuario,
//                            Usuario.Nombre
//                        },
//                        DispersionStatus
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

//                    var Dispersion = await DBContext.database.FetchAsync<Dispersiones>();

//                    ArrayList res = new();

//                    foreach (var T in Dispersion)
//                    {
//                        var Usuario = (await T.CH__USUARIO(this.DBContext)).FirstOrDefault();
//                        res.Add(new
//                        {
//                            T.DispersionID,
//                            T.CuentaID,
//                            FHRegistro = T.FHRegistro.ToString("dd/MM/yyyy"),
//                            T.ConsecutivoDia,
//                            T.ImporteTotal,
//                            T.CantidadMovimientos,
//                            T.UsuarioID,
//                            T.Cancelacion,
//                            T.DispersionEstatusID,
//                            Cuenta = (await T.CH__CUENTA(this.DBContext)).FirstOrDefault(),
//                            Usuario = new
//                            {
//                                Usuario.UsuarioID,
//                                Usuario.Usuario,
//                                Usuario.Nombre
//                            },
//                            DispersionEstatus = (await T.CH__DISPERCION_STATUS(this.DBContext)).FirstOrDefault()
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


    }
}
*/
