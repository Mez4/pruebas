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

namespace ConfiaWebApi.Controllers.Bonificaciones
{
    [Authorize]
    [ApiController]
    [Route("api/Aclaraciones/[controller]")]
    public class Bonificaciones : ControllerBase
    {
        private DBConfiaContext DBContext;

        public Bonificaciones(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpGet]
        [Route("obtenerBonificacion")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getBonificaciones()
        {
            try
            {
                var res = await DBContext.database.FetchAsync<DBContext.DBConfia.Aclaraciones.Bonificaciones>();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception e)
            {
                await DBContext.Destroy();
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        [Route("actualizaBonificacion")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> UpdateBonificaciones(PeticionesRest.Aclaraciones.Bonificaciones.ActualizarBonificacion pardata)
        {

            try
            {
                var obj = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Aclaraciones.Bonificaciones>(pardata.BonificacionID);
                if (obj != null)
                {
                    obj.PorcentajeBonificacion = pardata.PorcentajeBonificacion;
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
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("altaBonificacion")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> addBonificaciones(PeticionesRest.Aclaraciones.Bonificaciones.AltaBonificacion pardata)
        {
            try
            {
                var obj = new DBContext.DBConfia.Aclaraciones.Bonificaciones();
                obj.PorcentajeBonificacion = pardata.PorcentajeBonificacion;
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