using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using System.Collections;
using DBContext.DBConfia.General;

namespace ConfiaWebApi.Controllers.Creditos
{
    [Authorize]
    [ApiController]
    [Route("api/Creditos/[controller]")]
    public class CreditoTienditaCodigosController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public CreditoTienditaCodigosController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }
        //a
        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.Creditos.TienditaCodigos.Get parData)
        {
            var obj = new
            {
                CodigoID = 0

            };

            var res = await DBContext.database.FetchAsync<ConfiaWebApi.ModlesSP.Creditos.CodigosTienditaRes>("EXEC Creditos.pa_CodigosTiendita @CodigoID", obj);

            await DBContext.Destroy();

            return Ok(res);
        }
[HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(PeticionesRest.Creditos.TienditaCodigos.Add parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                Guid miGuid = Guid.NewGuid();
                string token = Convert.ToBase64String(miGuid.ToByteArray());
                token = token.Replace("=", "").Replace("+", "");
                
                var Codigo = new CodigosTiendita() { 
                    SKU = parData.SKU, 
                    Descuento = parData.Descuento,
                    PersonaRegistraID = (long)UsuarioActual.PersonaID,
                    UsuarioRegistraID = UsuarioActual.UsuarioID, 
                    FechaRegistra = DateTime.Now,
                    Estatus="P",
                    Codigo = token.Substring(0, 6).ToUpper(),
                    SucursalID = parData.SucursalID,
                    DistribuidorID = parData.DistribuidorID,
                    ClienteID   =   parData.ClienteID,
                    Motivo = parData.Motivo,
                };

                await DBContext.database.InsertAsync(Codigo);

                var obj = new
                {
                    CodigoID = Codigo.CodigoID

                };

                var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Creditos.CodigosTienditaRes>("EXEC Creditos.pa_CodigosTiendita @CodigoID", obj).FirstOrDefaultAsync();
                
                var res2 = new 
                {
                    CodigoID = Codigo.CodigoID,
                    SKU =   res.SKU,
                    Descuento = res.Descuento,
                    PersonaRegistra = res.PersonaRegistra,
                    FechaRegistra = res.FechaRegistra,
                    // Activo = res.Activo
                };
                
                await DBContext.Destroy();
                return Ok(res);
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
        [Code.TProteccionProducto]
        public async Task<IActionResult> Update(PeticionesRest.Creditos.TienditaCodigos.Update parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                
                var Codigo = await DBContext.database.SingleByIdAsync<CodigosTiendita>(parData.CodigoID);

                Codigo.Descuento = parData.Descuento;
                Codigo.UsuarioModificaID = UsuarioActual.UsuarioID;
                Codigo.PersonaModificaID = (long)UsuarioActual.PersonaID;
                Codigo.FechaModifica = DateTime.Now;
                
                await DBContext.database.UpdateAsync(Codigo);
                
               var obj = new
                {
                    CodigoID = parData.CodigoID
                };
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Creditos.CodigosTienditaRes>("EXEC Creditos.pa_CodigosTiendita @CodigoID", obj).FirstOrDefaultAsync();
                
                var res2 = new 
                {
                    CodigoID = parData.CodigoID,
                    SKU =   res.SKU,
                    Descuento = res.Descuento,
                    PersonaRegistra = res.PersonaRegistra,
                    FechaRegistra = res.FechaRegistra,
                    PersonaModifica = res.PersonaModifica,
                    FechaModifica = res.FechaModifica,
                    // Activo = res.Activo
                };
               
                await DBContext.Destroy();
                return Ok(res2);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("ActivarDesactivar")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ActivarDesactivar(PeticionesRest.Creditos.TienditaCodigos.Activar parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
               
                // var Codigo = await DBContext.database.SingleByIdAsync<CodigosTiendita>(parData.CodigoID);

                // if(Codigo.Activo == 'P') Codigo.Activo = 'C';
                // else throw new Exception("El codigo ya ha sido utilizado en un credito");
                // Codigo.PersonaModificaID = (long)UsuarioActual.PersonaID;
                // Codigo.UsuarioModificaID = UsuarioActual.UsuarioID;
                // Codigo.FechaModifica = DateTime.Now;

                // await DBContext.database.UpdateAsync(Codigo);
                
                var obj = new
                {
                    CodigoID = parData.CodigoID,
                    UsuarioID = UsuarioActual.UsuarioID
                };

                var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Creditos.CodigosTienditaRes>("EXEC Creditos.pa_CambiarEstatusCodigosTiendita @UsuarioID,@CodigoID", obj).FirstOrDefaultAsync();
                
                // var res2 = new 
                // {
                //     CodigoID = parData.CodigoID,
                //     SKU =   res.SKU,
                //     Descuento = res.Descuento,
                //     PersonaRegistra = res.PersonaRegistra,
                //     FechaRegistra = res.FechaRegistra,
                //     PersonaModifica = res.PersonaModifica,
                //     FechaModifica = res.FechaModifica,
                //     // Activo = res.Activo
                // };
               
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("validarCodigo")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> validarCodigo(PeticionesRest.Creditos.TienditaCodigos.ValidarCodigo parData)
        {
            try
            {
                string storedP = "EXEC Creditos.pa_ValidarCodigosTiendita @SKU, @DistribuidorID, @ClienteID, @Codigo";
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Creditos.DescuentoTiendita>(storedP, parData).FirstOrDefaultAsync();

                await DBContext.Destroy();

                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("Descuento")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Descuento(PeticionesRest.Creditos.TienditaCodigos.Descuento parData)
        {
            var obj = new
            {
                SKU = parData.id

            };

            var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Creditos.DescuentoTiendita>("EXEC Creditos.pa_ObtenerDescuentoTiendita @SKU", obj).FirstOrDefaultAsync();

            await DBContext.Destroy();

            return Ok(res);
        }

    }
}
