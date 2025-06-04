using DBContext.DBConfia;
using DBContext.DBConfia.Cobranza;
using DBContext.DBConfia.dbo;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.Cobranza
{
    [Authorize]
    [ApiController]
    [Route("api/Cobranza/[controller]")]
    public class TabDiasMoraController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public TabDiasMoraController(DBConfiaContext _DBContext)

        {
            DBContext = _DBContext;
        }

        //protected async Task<object> ObjectSerie(tabDiasMora datos)
        //{


        //    var res = new
        //    {
        //        datos.idTabMora,
        //        datos.ProductoID,
        //        datos.limInferiorDias,
        //        datos.limSuperiorDias,
        //        diasMoraCartera = datos.limSuperiorDias,
        //        datos.Activo,
        //        producto = (await datos.CH__PRODUCTO(DBContext)).FirstOrDefault(),

        //    };
        //    return res;
        //}

        [HttpPost]
        [Route("get")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Cobranza.TabDiasMora.get parData)

        {

            try
            {
                var obj = new { ProductoID = parData.ProductoID };
                var res = await DBContext.database.FetchAsync<tabDiasMora>("WHERE ProductoID = @ProductoID", obj);

                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }


            //if (parData.id != 0)
            //{
            //    var datos = await DBContext.database.SingleByIdAsync<tabDiasMora>(parData.id);
            //    return Ok(await ObjectSerie(datos));
            //}

            //List<object> respList = new List<object>();
            //var ListSeries = await DBContext.database.FetchAsync<tabDiasMora>();
            //foreach (var item in ListSeries)
            //{
            //    respList.Add(await ObjectSerie(item));
            //}
            //return Ok(respList);
        }


        [HttpPost]
        [Route("add")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Cobranza.TabDiasMora.add parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, PersonaId = UsuarioActual.PersonaID, idTabMora = parData.idTabMora, limInferiorDias = parData.limInferiorDias, limSuperiorDias = parData.limSuperiorDias, diasMoraCartera = parData.diasMoraCartera, Activo = parData.Activo, regresa = parData.regresa, msj = parData.msj };
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Cobranza.spActualizarTabDiasMora>("EXEC Cobranza.AgregarTabDiasMora @Usu, @PersonaId, @limInferiorDias, @limSuperiorDias, @diasMoraCartera, @Activo, @regresa, @msj", obj).FirstOrDefaultAsync();

                await DBContext.Destroy();

                if (res.regresa == 1)
                    return Ok(res);
                else
                    return BadRequest(res.msj);
            }

            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }



            //try
            //{
            //    var tabDiasMora = new tabDiasMora() { ProductoID = 1, limInferiorDias = parData.limInferiorDias, limSuperiorDias = parData.limSuperiorDias, diasMoraCartera = parData.diasMoraCartera, Activo = parData.Activo };
            //    await DBContext.database.InsertAsync<tabDiasMora>(tabDiasMora);
            //    await DBContext.Destroy();
            //    return Ok(await ObjectSerie(tabDiasMora));
            //}
            //catch (Exception ex)
            //{
            //    await DBContext.Destroy();
            //    return BadRequest(ex.Message);
            //}

        }

        [HttpPost]
        [Route("update")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Cobranza.TabDiasMora.update parData)
        {


            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, PersonaId = UsuarioActual.PersonaID, idTabMora = parData.idTabMora, limInferiorDias = parData.limInferiorDias, limSuperiorDias = parData.limSuperiorDias, diasMoraCartera = parData.diasMoraCartera, Activo = parData.Activo, regresa = parData.regresa, msj = parData.msj };
                var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Cobranza.spActualizarTabDiasMora>("EXEC Cobranza.ActualizarTabDiasMora  @Usu, @PersonaId, @idTabMora, @limInferiorDias, @limSuperiorDias, @diasMoraCartera, @Activo, @regresa, @msj", obj).FirstOrDefaultAsync();

                await DBContext.Destroy();

                if (res.regresa == 1)
                    return Ok(res);
                else
                    return BadRequest(res.msj);
            }

            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }


            //try
            //{
            //    var tabDiasMora = await DBContext.database.SingleByIdAsync<tabDiasMora>(parData.idTabMora);
            //    tabDiasMora.limInferiorDias = parData.limInferiorDias;
            //    tabDiasMora.limSuperiorDias = parData.limSuperiorDias;
            //    tabDiasMora.diasMoraCartera = parData.diasMoraCartera;
            //    tabDiasMora.Activo = parData.Activo;
            //    await DBContext.database.UpdateAsync(tabDiasMora);
            //    var res = await ObjectSerie(tabDiasMora);
            //    await DBContext.Destroy();
            //    return Ok(res);
            //}
            //catch (Exception ex)
            //{
            //    await DBContext.Destroy();
            //    return BadRequest(ex.Message);
            //}
        }


        [HttpPost]
        [Route("getInicial")]
        [Code.TProteccionProducto]
        //[Authorize]
        //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> getInicial(ConfiaWebApi.PeticionesRest.Cobranza.TabDiasMora.getInicial parData)
        {
            try
            {
                var ListlimSuperiorDias = await DBContext.database.FetchAsync<tabDiasMora>("WHERE (ProductoID = @ProductoID) ORDER BY limInferiorDias", parData);

                if (ListlimSuperiorDias.Count == 0)
                    return Ok(new { limSuperiorDiasSiguiente = 1 });
                await DBContext.Destroy();
                return Ok(new { limSuperiorDiasSiguiente = ListlimSuperiorDias.Last().limSuperiorDias + 1 });
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}


