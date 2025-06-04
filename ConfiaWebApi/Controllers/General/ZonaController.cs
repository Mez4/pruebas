using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Sistema;
using DBContext.DBConfia.Prospeccion;
using System.Collections.Generic;
using DBContext.DBConfia.Catalogos;

namespace ConfiaWebApi.Controllers.General
{
    [Authorize]
    [ApiController]
    [Route("api/General/[controller]")]
    public class ZonaController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public ZonaController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("GetbyProd")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetbyProd(PeticionesRest.General.Zonas.Get parData)
        {
            if (parData.DirectorID != 0)
            {
                try
                {
                   var resD = await DBContext.database.SingleByIdAsync<Directores>(parData.DirectorID);
                    var resZ = await DBContext.database.FetchAsync<Zonas_VW>("WHERE ZonaID = @0", resD.ZonaID);
                    await DBContext.Destroy();
                    return Ok(resZ);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }
            }
            if (parData.ZonaID != 0)
            {
                try
                {
                    var resS = await DBContext.database.SingleByIdAsync<Zonas_VW>(parData.ZonaID);
                    await DBContext.Destroy();
                    return Ok(resS);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }

            var res = await DBContext.database.FetchAsync<Zonas>();
            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        //[Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.General.Zonas.Get parData)
        {
            if (parData.ZonaID != 0)
            {
                try
                {
                    var resS = await DBContext.database.SingleByIdAsync<Zonas_VW>(parData.ZonaID);
                    await DBContext.Destroy();
                    return Ok(resS);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }

            var res = await DBContext.database.FetchAsync<Zonas>();
            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("getByEncargado")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> GetByEncargado(PeticionesRest.General.Zonas.GetByEncargado parData)
        {
            if (parData.PersonaID == 0)
            {
                try
                {
                    var res = await DBContext.database.FetchAsync<Zonas_VW>("SELECT * FROM General.Zonas_VW AS e ", parData);
                    await DBContext.Destroy();
                    return Ok(res);

                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            else
            {
                try
                {
                    var res = await DBContext.database.FetchAsync<Zonas_VW>("WHERE (PersonaID = @0)", parData.PersonaID);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return BadRequest(ex.Message);
                }
            }
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.General.Zonas.Add parData)
        {
            try
            {

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                parData.CreacionUsuarioID = UsuarioActual.UsuarioID;

                var zona = new Zonas() { Nombre = parData.ZonaNombre, Activa = parData.Activa, CreacionFecha = parData.CreacionFecha, CreacionUsuarioID = parData.CreacionUsuarioID, PersonaResponsableID = parData.PersonaResponsableID };
                await DBContext.database.InsertAsync(zona);
                await DBContext.Destroy();
                return Ok(zona);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.General.Zonas.Update parData)
        {
            try
            {

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                parData.CreacionUsuarioID = UsuarioActual.UsuarioID;

                var zona = await DBContext.database.SingleByIdAsync<Zonas>(parData.ZonaID);
                zona.Nombre = parData.ZonaNombre;
                zona.Activa = parData.Activa;
                zona.CreacionFecha = parData.CreacionFecha;
                zona.CreacionUsuarioID = parData.CreacionUsuarioID;
                zona.PersonaResponsableID = parData.PersonaResponsableID;
                await DBContext.database.UpdateAsync(zona);
                await DBContext.Destroy();
                return Ok(zona);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("getZonas")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> getZonas(ConfiaWebApi.PeticionesRest.Prospeccion.Mensajes.get parData)
        {
            if (parData.id != 0)
            {
                var res1 = await DBContext.database.SingleByIdAsync<Zonas_VW>(parData.id);
                await DBContext.Destroy();
                return Ok(res1);
            }
            var res = await DBContext.database.FetchAsync<Zonas_VW>();
            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("getZonasByMensaje")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> getStatusByMensaje(ConfiaWebApi.PeticionesRest.Prospeccion.Mensajes.getStatusByMensaje parData)
        {
            if (parData.id != 0)
            {
                var res = await DBContext.database.QueryAsync<DBContext.DBConfia.General.Sucursales>("WHERE ZonaID=@id", parData).ToArrayAsync();
                await DBContext.Destroy();
                return Ok(res);
            }

            return Ok(new List<int>());
        }

        [HttpPost]
        [Route("addSucursal")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> addSucursal(ConfiaWebApi.PeticionesRest.General.Zonas.addSucursal parData)
        {
            if (parData.id != 0)
            {
                var res = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.General.Sucursales>(parData.id);
                res.ZonaID = parData.ZonaID;
                await DBContext.database.UpdateAsync(res);
                await DBContext.Destroy();
                return Ok(res);
            }

            return Ok(new List<int>());
        }
    }
}

