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

namespace ConfiaWebApi.Controllers.TiposAclaraciones
{
    [Authorize]
    [ApiController]
    [Route("api/Aclaraciones/[controller]")]
    public class TiposAclaraciones : ControllerBase
    {
        private DBConfiaContext DBContext;

        public TiposAclaraciones(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpGet]
        [Route("obtenerTiposSolicitud")]
        [Code.TProteccionProducto]
        [Authorize]
        public async Task<IActionResult> GetTiposSolicitud()
        {
            try
            {
                var obj = await DBContext.database.FetchAsync<DBContext.DBConfia.Aclaraciones.TipoSolicitud>();
                await DBContext.Destroy();
                return Ok(obj);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("obtenerBitacora")]
        [Code.TProteccionProducto]
        [Authorize]
        public async Task<IActionResult> obtenerBitacora()
        {
            try
            {
                var obj = await DBContext.database.FetchAsync<DBContext.DBConfia.Aclaraciones.Bitacora_VW>();
                await DBContext.Destroy();
                return Ok(obj);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
        [HttpGet]
        [Route("ObtenerTiposMovimientos")]
        [Code.TProteccionProducto]
        [Authorize]
        public async Task<IActionResult> ObtenerTiposMovimientos()
        {
            try
            {
                var obj = await DBContext.database.FetchAsync<DBContext.DBConfia.Aclaraciones.TipoMovimientos>();
                await DBContext.Destroy();
                return Ok(obj);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("obtenerTiposSolicitudAdmin")]
        [Code.TProteccionAdmin]
        [Authorize]
        public async Task<IActionResult> GetTiposSolicitudAdmin()
        {
            try
            {
                var obj = await DBContext.database.FetchAsync<DBContext.DBConfia.Aclaraciones.TipoSolicitud>();
                await DBContext.Destroy();
                return Ok(obj);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("actualizarTipoSolicitud")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> UpdateTipoSolicitud(PeticionesRest.Aclaraciones.TiposAclaraciones.ActualizarTipoAclaracion pardata)
        {
            try
            {
                var obj = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Aclaraciones.TipoSolicitud>(pardata.TipoSolicitudID);
                if (obj != null)
                {
                    obj.Descripcion = pardata.Descripcion;
                    obj.ClaveSolicitud = pardata.ClaveSolicitud;
                    await DBContext.database.UpdateAsync(obj);
                    await DBContext.Destroy();
                    return Ok(obj);
                }
                else
                {
                    await DBContext.Destroy();
                    return BadRequest("No se encontro el tipo de solicitud");
                }
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("actualizarTipoMovimiento")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> actualizarTipoMovimiento(PeticionesRest.Aclaraciones.TiposAclaraciones.ActualizarTipoMovimiento pardata)
        {
            try
            {
                var obj = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Aclaraciones.TipoMovimientos>(pardata.TipoMovimientoID);
                if (obj != null)
                {
                    obj.DescripcionMov = pardata.DescripcionMov;
                    obj.ClaveMovimiento = pardata.ClaveMovimiento;
                    await DBContext.database.UpdateAsync(obj);
                    await DBContext.Destroy();
                    return Ok(obj);
                }
                else
                {
                    await DBContext.Destroy();
                    return BadRequest("No se encontro el tipo de solicitud");
                }
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("altaTipoSolicitud")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> altaTipoSolicitud(PeticionesRest.Aclaraciones.TiposAclaraciones.AltaTipoAclaracion pardata)
        {
            try
            {
                var obj = new DBContext.DBConfia.Aclaraciones.TipoSolicitud();
                obj.Descripcion = pardata.Descripcion;
                obj.ClaveSolicitud = pardata.ClaveSolicitud;
                await DBContext.database.InsertAsync(obj);
                await DBContext.Destroy();
                return Ok(obj);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("altaTipoMovimiento")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> altaTipoMovimiento(PeticionesRest.Aclaraciones.TiposAclaraciones.AltaTipoMovimiento pardata)
        {
            try
            {
                var obj = new DBContext.DBConfia.Aclaraciones.TipoMovimientos();
                obj.DescripcionMov = pardata.DescripcionMov;
                obj.ClaveMovimiento = pardata.ClaveMovimiento;
                await DBContext.database.InsertAsync(obj);
                await DBContext.Destroy();
                return Ok(obj);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}