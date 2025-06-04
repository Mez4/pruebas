using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Distribuidores;
using System.Collections;
using DBContext.DBConfia.General;
using DBContext.DBConfia.AppVale;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Aclaraciones;
using DBContext.DBConfia.Seguridad;
using Clientes = DBContext.DBConfia.Creditos.Clientes;
using Distribuidor = DBContext.DBConfia.Distribuidores.Clientes;
using DBContext.DBConfia.Cobranza;
using System.Collections.Generic;

namespace ConfiaWebApi.Controllers.AnalistaSucursalController
{
    [Authorize]
    [ApiController]
    [Route("api/Aclaraciones/[controller]")]
    public class AnalistaSucursal : ControllerBase
    {
        private DBConfiaContext DBContext;

        public AnalistaSucursal(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }


        [HttpPost]
        [Route("guardarSucursalesAnalista")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> saveSucursalesAnalista(ConfiaWebApi.PeticionesRest.Aclaraciones.AnalistaSucursal.guardarSucursalesAnalista parData)
        {
            try
            {
                if (parData.Sucursales.Count > 0)
                {
                    DBContext.database.BeginTransaction();
                    foreach (var item in parData.Sucursales)
                    {
                        var analistaSucursal = new DBContext.DBConfia.Aclaraciones.AnalistasSucursales();
                        analistaSucursal.AnalistaID = item.AnalistaID;
                        analistaSucursal.SucursalID = item.SucursalID;
                        await DBContext.database.InsertAsync(analistaSucursal);

                    }
                    DBContext.database.CompleteTransaction();
                    return Ok();
                }
                else
                {
                    DBContext.database.AbortTransaction();
                    return BadRequest("Nada que guardar");
                }
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("actualizarSucursalesAnalista")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> updateSucursalesAnalista(ConfiaWebApi.PeticionesRest.Aclaraciones.AnalistaSucursal.guardarSucursalesAnalista parData)
        {
            try
            {
                if (parData.Sucursales.Count > 0)
                {
                    DBContext.database.BeginTransaction();
                    foreach (var item in parData.Sucursales)
                    {
                        if (item.Estatus == 2)
                        {
                            var itemNuevoAnalistaSucursal = new DBContext.DBConfia.Aclaraciones.AnalistasSucursales();
                            itemNuevoAnalistaSucursal.AnalistaID = item.AnalistaID;
                            itemNuevoAnalistaSucursal.SucursalID = item.SucursalID;
                            await DBContext.database.InsertAsync(itemNuevoAnalistaSucursal);
                        }
                        if (item.Estatus == 3)
                        {
                            var analistaSucursalElement = await DBContext.database.QueryAsync<DBContext.DBConfia.Aclaraciones.AnalistasSucursales>("WHERE AnalistaID=@0 AND SucursalID=@1", item.AnalistaID, item.SucursalID).SingleOrDefaultAsync();
                            if (analistaSucursalElement != null) await DBContext.database.DeleteAsync(analistaSucursalElement);
                        }
                    }
                    DBContext.database.CompleteTransaction();
                    await DBContext.Destroy();
                    return Ok();
                }
                else
                {
                    DBContext.database.AbortTransaction();
                    return BadRequest("Nada que guardar");
                }
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("obtenerSucursalesSinAnalista")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getSucursalesSelect()
        {
            try
            {
                var analistas = await DBContext.database.FetchAsync<DBContext.DBConfia.Aclaraciones.SucursalesSinAnalista_VW>();
                await DBContext.Destroy();
                return Ok(analistas);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }


        [HttpGet]
        [Route("obtenerAnalistaSelect")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getAnalistaSelect()
        {
            try
            {
                var analistas = await DBContext.database.FetchAsync<DBContext.DBConfia.Aclaraciones.AnalistasSinSucursal_VW>();
                await DBContext.Destroy();
                return Ok(analistas);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }





        [HttpGet]
        [Route("obtenerAnalistas")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getAnalistas()
        {
            try
            {
                var analistas = await DBContext.database.FetchAsync<DBContext.DBConfia.Aclaraciones.AnalistasConSucursal_VW>();
                ArrayList res = new();
                foreach (var T in analistas)
                {
                    res.Add(new
                    {
                        T.AnalistaID,
                        T.NombreCompleto,
                        T.PersonaID,
                        Sucursales = (await DBContext.database.QueryAsync<DBContext.DBConfia.Aclaraciones.SucursalesAnalistas_VW>("WHERE AnalistaID=@0", T.AnalistaID).ToArrayAsync())
                    });
                }
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception error)
            {
                await DBContext.Destroy();
                return BadRequest(error.Message);
            }
        }


        [HttpGet]
        [Route("obtenerSucursales")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getSucursales()
        {
            try
            {
                var sucursales = await DBContext.database.FetchAsync<DBContext.DBConfia.General.Sucursales_VW>();
                await DBContext.Destroy();
                return Ok(sucursales);
            }

            catch (Exception error)
            {
                await DBContext.Destroy();
                return BadRequest(error.Message);
            }
        }

    }
}