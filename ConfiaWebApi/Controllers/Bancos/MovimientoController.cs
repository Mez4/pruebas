/*
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Bancos;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Catalogos;
using DBContext.DBConfia.Seguridad;
using System.Collections;
using System.Security.Claims;

//namespace ConfiaWebApi.Controllers.Bancos
//{
//    [Authorize]
//    [ApiController]
//    [Route("api/Bancos/[controller]")]
//    public class MovimientoController : ControllerBase
//    {
//        private DBConfiaContext DBContext;

//        public MovimientoController(DBConfiaContext _DBContext)
//        {
//            DBContext = _DBContext;
//        }

//        [HttpPost]
//        [Route("get")]
//        [Authorize]
//        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "BANCOS_USUARIO_ADMIN" })]
//        public async Task<IActionResult> Get(PeticionesRest.Bancos.Movimiento.Get parData)
//        {

//            if (parData.Id != 0)
//            {
//                try
//                {
//                    var Movimiento = await DBContext.database.QueryAsync<Movimientos>("WHERE MovimientoID=@Id", parData).FirstOrDefaultAsync();
//                    var Cuenta = (await Movimiento.CH__CUENTA(DBContext)).FirstOrDefault();
//                    var GastoRubro = (await Movimiento.CH__GASTOS_RUBRO(DBContext)).FirstOrDefault();
//                    var Sucursal = (await Movimiento.CH__SUCURSAL(DBContext)).FirstOrDefault();
//                    var Corresponsal = (await Movimiento.CH__CORRESPONSAL_PAGO(DBContext)).FirstOrDefault();
//                    var CuentaCorte = (await Movimiento.CH__CUENTAS_CORTE(DBContext)).FirstOrDefault();
//                    //var BalanceCierre = (await Movimiento.CH__BALANCE_CIERRE(DBContext)).FirstOrDefault();

//                    var res = new
//                    {
//                        Movimiento.MovimientoID,
//                        Movimiento.CuentaID,
//                        FechaAfectacion = Movimiento.FechaAfectacion.ToString("dd/MM/yyyy"),
//                        FechaCaptura = Movimiento.FechaCaptura.ToString("dd/MM/yyyy"),
//                        Movimiento.Importe,
//                        Movimiento.Observaciones,
//                        Movimiento.TipoMovimientoID,
//                        Movimiento.RefApl,
//                        Movimiento.UsuarioIDRegistra,
//                        Movimiento.CorresponsalId,
//                        Movimiento.gastosRubroID,
//                        Movimiento.gastoSucursal,
//                        Movimiento.movimientoIdTraspaso,
//                        Movimiento.corteId,
//                        Movimiento.cancelacionObservacion,
//                        Movimiento.cancelacionUsuario,
//                        Movimiento.cancelacionImporte,
//                        cancelacionFhRegistro = Movimiento.cancelacionFhRegistro.HasValue ? Movimiento.cancelacionFhRegistro.Value.ToString("yyyy-MM-dd hh:mm:ss") : "[N/A]",
//                        Movimiento.cancelacionTipMovimiento,
//                        Movimiento.balanceCierreId,
//                        Cuenta,
//                        GastoRubro,
//                        Sucursal,
//                        Corresponsal,
//                        CuentaCorte
//                        //Usuario = new
//                        //{
//                        //    Usuario.UsuarioID,
//                        //    Usuario.Usuario,
//                        //    Usuario.Nombre
//                        //}
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

//                    var Movimiento = await DBContext.database.FetchAsync<Movimientos>();
//                    var TipoMovimientos = await DBContext.database.FetchAsync<TiposMovimientos>();


//                    ArrayList res = new();

//                    foreach (var T in Movimiento)
//                    {
//                        Cuentas Cuenta = (await T.CH__CUENTA(this.DBContext)).FirstOrDefault();
//                        GastosRubros GastoRubro = (await T.CH__GASTOS_RUBRO(DBContext)).FirstOrDefault();
//                        Sucursales Sucursal = (await T.CH__SUCURSAL(DBContext)).FirstOrDefault();
//                        CorresponsalesPago Corresponsal = (await T.CH__CORRESPONSAL_PAGO(DBContext)).FirstOrDefault();
//                        CuentasCortes CuentaCorte = (await T.CH__CUENTAS_CORTE(DBContext)).FirstOrDefault();
//                        TiposMovimientos TipoMovimiento = TipoMovimientos.Where(x => x.Id == T.TipoMovimientoID).FirstOrDefault();

//                        res.Add(new
//                        {
//                            T.MovimientoID,
//                            T.CuentaID,
//                            FechaAfectacion = T.FechaAfectacion.ToString("dd/MM/yyyy"),
//                            FechaCaptura = T.FechaCaptura.ToString("dd/MM/yyyy"),
//                            T.Importe,
//                            T.Observaciones,
//                            T.TipoMovimientoID,
//                            T.RefApl,
//                            T.UsuarioIDRegistra,
//                            T.CorresponsalId,
//                            T.gastosRubroID,
//                            T.gastoSucursal,
//                            T.movimientoIdTraspaso,
//                            T.corteId,
//                            T.cancelacionObservacion,
//                            T.cancelacionUsuario,
//                            T.cancelacionImporte,
//                            cancelacionFhRegistro = T.cancelacionFhRegistro.HasValue ? T.cancelacionFhRegistro.Value.ToString("yyyy-MM-dd hh:mm:ss") : "[N/A]",
//                            T.cancelacionTipMovimiento,
//                            T.balanceCierreId,
//                            Cuenta,
//                            TipoMovimiento,
//                            GastoRubro = GastoRubro is not null ? GastoRubro : new GastosRubros { },
//                            Sucursal = Sucursal is not null ? Sucursal : new Sucursales { },
//                            Corresponsal = Corresponsal is not null ? Corresponsal : new CorresponsalesPago { },
//                            CuentaCorte = CuentaCorte is not null ? CuentaCorte : new CuentasCortes { }
//                            //Usuario = new
//                            //{
//                            //    Usuario.UsuarioID,
//                            //    Usuario.Usuario,
//                            //    Usuario.Nombre
//                            //}
//                        });
//                    }

//                        res.Add(new
//                        {
//                            T.MovimientoID,
//                            T.CuentaID,
//                            FechaAfectacion = T.FechaAfectacion.ToString("dd/MM/yyyy"),
//                            FechaCaptura = T.FechaCaptura.ToString("dd/MM/yyyy"),
//                            T.Importe,
//                            T.Observaciones,
//                            T.TipoMovimientoID,
//                            T.RefApl,
//                            T.UsuarioIDRegistra,
//                            T.CorresponsalId,
//                            T.gastosRubroID,
//                            T.gastoSucursal,
//                            T.movimientoIdTraspaso,
//                            T.corteId,
//                            T.cancelacionObservacion,
//                            T.cancelacionUsuario,
//                            T.cancelacionImporte,
//                            cancelacionFhRegistro = T.cancelacionFhRegistro.HasValue ? T.cancelacionFhRegistro.Value.ToString("yyyy-MM-dd hh:mm:ss") : "[N/A]",
//                            T.cancelacionTipMovimiento,
//                            T.balanceCierreId,
//                            Cuenta,
//                            TipoMovimiento,
//                            GastoRubro = GastoRubro is not null ? GastoRubro : new GastosRubros { },
//                            Sucursal = Sucursal is not null ? Sucursal : new Sucursales { },
//                            Corresponsal = Corresponsal is not null ? Corresponsal : new CorresponsalesPago { },
//                            CuentaCorte = CuentaCorte is not null ? CuentaCorte : new CuentasCortes { }
//                            //Usuario = new
//                            //{
//                            //    Usuario.UsuarioID,
//                            //    Usuario.Usuario,
//                            //    Usuario.Nombre
//                            //}
//                        });
//                    }

                    return Ok(res);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
        }
    }
}
*/
