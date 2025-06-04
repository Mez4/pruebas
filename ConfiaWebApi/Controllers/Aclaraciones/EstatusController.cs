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

namespace ConfiaWebApi.Controllers.EstatusController
{
    [Authorize]
    [ApiController]
    [Route("api/Aclaraciones/[controller]")]
    public class Estatus : ControllerBase
    {
        private DBConfiaContext DBContext;
        public Estatus(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpGet]
        [Route("obtenerEstatus")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetEstatus()
        {
            try
            {
                var estatus = await DBContext.database.FetchAsync<DBContext.DBConfia.Aclaraciones.Estatus>();
                await DBContext.Destroy();
                return Ok(estatus);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("actualizaEstatus")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ActualizarEstatus(PeticionesRest.Aclaraciones.Estatus.ActualizarEstatus pardata)
        {
            try
            {
                var estatus = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Aclaraciones.Estatus>(pardata.EstatusID);
                if (estatus != null)
                {
                    estatus.Clave = pardata.Clave;
                    estatus.Descripcion = pardata.Descripcion;
                    await DBContext.database.UpdateAsync(estatus);
                    await DBContext.Destroy();
                    return Ok(estatus);
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
        [Route("altaEstatus")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> AltaEstatus(PeticionesRest.Aclaraciones.Estatus.AltaEstatus pardata)
        {
            try
            {
                //Alta de Mesa de Aclacracion
                var estatus = new DBContext.DBConfia.Aclaraciones.Estatus();
                estatus.Clave = pardata.Clave;
                estatus.Descripcion = pardata.Descripcion;
                await DBContext.database.InsertAsync(estatus);
                await DBContext.Destroy();
                return Ok(estatus);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}