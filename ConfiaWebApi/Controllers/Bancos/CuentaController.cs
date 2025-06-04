
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
using DBContext.DBConfia.dbo;
using DBContext.DBConfia.Creditos;
//using DBContext.DBConfia.IntegracionKeycloak;

namespace ConfiaWebApi.Controllers.Bancos
{
    [Authorize]
    [ApiController]
    [Route("api/Bancos/[controller]")]
    public class CuentaController : ControllerBase
    {
        private DBConfiaContext ConexionBD;

        public CuentaController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.Bancos.Cuenta.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            parData.ProductoID = producto;
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            // var PersonaActual = await DBContext.database.QueryAsync<PersonasUsuarios_VW>("WHERE UsuarioID=@0", UsuarioActual.ID).FirstOrDefaultAsync();

            if (parData.ProductoID > 0 && parData.SucursalId > 0)
            {
                var res = await ConexionBD.database.FetchAsync<CatalogoCuentasBancos>(@"SELECT cb.CuentaBancoID, cb.NumeroCuenta 
                    FROM Tesoreria.CatalogoCajas AS c 
                    INNER JOIN Tesoreria.CajaTipoOperacion co ON c.CajaID =  co.CajaID
                    inner join Bancos.TiposMovimientos tm ON co.TipoMovimientoID = tm.Id
                    INNER JOIN Bancos.CatalogoCuentasBancos AS cb ON co.CuentaBancoId = cb.CuentaBancoID 
                    INNER JOIN General.SucursalProductos sp ON C.SucursalID = sp.SucursalID AND sp.ProductoID = @0 
                    WHERE (c.SucursalID = @1) AND (c.UsuarioID = @2) AND (c.Estatus = 1) AND (cb.EsBoveda = 0)
                    AND tm.CveMovimientoID = 'APLC'", parData.ProductoID, parData.SucursalId, UsuarioActual.UsuarioID);
                await ConexionBD.Destroy();
                return Ok(res);
            }
            else
            {
                var res = await ConexionBD.database.FetchAsync<CatalogoCuentasBancos>("WHERE (SucursalID = @SucursalId OR @SucursalId = 0) AND (EsBoveda = 0)", parData);
                await ConexionBD.Destroy();
                return Ok(res);
            }
        }

        //[HttpPost]
        //[Route("get")]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "BANCOS_USUARIO_ADMIN" })]
        //public async Task<IActionResult> Get(PeticionesRest.Bancos.Cuenta.Get parData)
        //{

        //    if (parData.Id != 0)
        //    {
        //        try
        //        {
        //            var Cuenta = await DBContext.database.QueryAsync<Cuentas>("WHERE CuentaID=@Id", parData).FirstOrDefaultAsync();
        //            var Banco = (await Cuenta.CH__BANCO(DBContext)).FirstOrDefault();
        //            var Usuario = await DBContext.database.FetchAsync<Usuarios>("WHERE UsuarioID = @0", Cuenta.UsuarioId);

        //            var res = new
        //            {
        //                Cuenta.CuentaID,
        //                Cuenta.BancoID,
        //                Cuenta.Cuenta,
        //                Cuenta.NombreCuenta,
        //                Cuenta.UsuarioId,
        //                Cuenta.DispersionConvenio,
        //                Cuenta.PuedeDispersar,
        //                Cuenta.LogoImg,
        //                Cuenta.activa,
        //                Cuenta.global,
        //                Cuenta.orden,
        //                Cuenta.importeEnBalance,
        //                Cuenta.importePendienteBalance,
        //                Banco,
        //                Usuario = new
        //                {
        //                    Usuario[0].UsuarioID,
        //                    Usuario[0].Usuario,
        //                    Usuario[0].Nombre
        //                }
        //            };

        //            return Ok(res);
        //        }
        //        catch (Exception ex)
        //        {
        //            return NotFound(ex.Message);
        //        }

        //    }
        //    else
        //    {
        //        try
        //        {

        //            var Cuenta = await DBContext.database.FetchAsync<Cuentas>();
        //            var Usuarios = await DBContext.database.FetchAsync<Usuarios>();

        //            ArrayList res = new();

        //            foreach (var T in Cuenta)
        //            {
        //                var Usuario = Usuarios.Where(x => x.UsuarioID == T.UsuarioId).FirstOrDefault();
        //                res.Add(new
        //                {
        //                    T.CuentaID,
        //                    T.BancoID,
        //                    T.Cuenta,
        //                    T.NombreCuenta,
        //                    T.UsuarioId,
        //                    T.DispersionConvenio,
        //                    T.PuedeDispersar,
        //                    T.LogoImg,
        //                    T.activa,
        //                    T.global,
        //                    T.orden,
        //                    T.importeEnBalance,
        //                    T.importePendienteBalance,
        //                    Banco = (await T.CH__BANCO(this.DBContext)).FirstOrDefault(),
        //                    Usuario = new
        //                    {
        //                        Usuario.UsuarioID,
        //                        Usuario.Usuario,
        //                        Usuario.Nombre
        //                    }
        //                });
        //            }

        //            return Ok(res);
        //        }
        //        catch (Exception ex)
        //        {
        //            return BadRequest(ex.Message);
        //        }
        //    }
        //}

        //[HttpPost]
        //[Route("add")]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "BANCOS_USUARIO_ADMIN" })]
        //public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Bancos.Cuenta.Add parData)
        //{
        //    try
        //    {
        //        //var userId = int.Parse(HttpContext.User.Claims.Where(x => x.Type == "Id").FirstOrDefault().Value);

        //        var Cuenta = new Cuentas()
        //        {
        //            BancoID = parData.BancoID,
        //            Cuenta = parData.Cuenta,
        //            NombreCuenta = parData.NombreCuenta,
        //            UsuarioId = parData.UsuarioId,
        //            DispersionConvenio = parData.DispersionConvenio,
        //            PuedeDispersar = parData.PuedeDispersar,
        //            LogoImg = parData.LogoImg,
        //            activa = parData.activa,
        //            global = parData.global,
        //            orden = parData.orden,
        //            importeEnBalance = parData.importeEnBalance,
        //            importePendienteBalance = parData.importePendienteBalance
        //        };

        //        await DBContext.database.InsertAsync(Cuenta);

        //        var Banco = (await Cuenta.CH__BANCO(DBContext)).FirstOrDefault();

        //        var Usuario = await DBContext.database.FetchAsync<Usuarios>("WHERE UsuarioID = @0", Cuenta.UsuarioId);

        //        var res = new
        //        {
        //            Cuenta.CuentaID,
        //            Cuenta.BancoID,
        //            Cuenta.Cuenta,
        //            Cuenta.NombreCuenta,
        //            Cuenta.UsuarioId,
        //            Cuenta.DispersionConvenio,
        //            Cuenta.PuedeDispersar,
        //            Cuenta.LogoImg,
        //            Cuenta.activa,
        //            Cuenta.global,
        //            Cuenta.orden,
        //            Cuenta.importeEnBalance,
        //            Cuenta.importePendienteBalance,
        //            Banco,
        //            Usuario = new
        //            {
        //                Usuario[0].UsuarioID,
        //                Usuario[0].Usuario,
        //                Usuario[0].Nombre
        //            }
        //        };

        //        return Ok(res);

        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}

        //[HttpPost]
        //[Route("update")]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "BANCOS_USUARIO_ADMIN" })]
        //public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Bancos.Cuenta.Update parData)
        //{
        //    try
        //    {
        //        //var userId = int.Parse(HttpContext.User.Claims.Where(x => x.Type == "Id").FirstOrDefault().Value);

        //        var Cuenta = await DBContext.database.SingleByIdAsync<Cuentas>(parData.CuentaID);
        //        Cuenta.BancoID = parData.BancoID;
        //        Cuenta.Cuenta = parData.Cuenta;
        //        Cuenta.NombreCuenta = parData.NombreCuenta;
        //        Cuenta.UsuarioId = parData.UsuarioId;
        //        Cuenta.DispersionConvenio = parData.DispersionConvenio;
        //        Cuenta.PuedeDispersar = parData.PuedeDispersar;
        //        Cuenta.LogoImg = parData.LogoImg;
        //        Cuenta.activa = parData.activa;
        //        Cuenta.global = parData.global;
        //        Cuenta.orden = parData.orden;
        //        Cuenta.importeEnBalance = parData.importeEnBalance;
        //        Cuenta.importePendienteBalance = parData.importePendienteBalance;

        //        await DBContext.database.UpdateAsync(Cuenta);

        //        var Banco = (await Cuenta.CH__BANCO(DBContext)).FirstOrDefault();

        //        var Usuario = await DBContext.database.FetchAsync<Usuarios>("WHERE UsuarioID = @0", Cuenta.UsuarioId);

        //        var res = new
        //        {
        //            Cuenta.CuentaID,
        //            Cuenta.BancoID,
        //            Cuenta.Cuenta,
        //            Cuenta.NombreCuenta,
        //            Cuenta.UsuarioId,
        //            Cuenta.DispersionConvenio,
        //            Cuenta.PuedeDispersar,
        //            Cuenta.LogoImg,
        //            Cuenta.activa,
        //            Cuenta.global,
        //            Cuenta.orden,
        //            Cuenta.importeEnBalance,
        //            Cuenta.importePendienteBalance,
        //            Banco,
        //            Usuario = new
        //            {
        //                Usuario[0].UsuarioID,
        //                Usuario[0].Usuario,
        //                Usuario[0].Nombre
        //            }
        //        };

        //        return Ok(res);
        //        //return Ok(Ciudad);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //}
    }
}

