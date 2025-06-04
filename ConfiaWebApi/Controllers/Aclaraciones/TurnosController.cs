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
    public class Turnos : ControllerBase
    {
        private DBConfiaContext DBContext;

        public Turnos(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpGet]
        [Route("obtenerTurnos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> obtenerTurnos()
        {
            try
            {
                var res = await DBContext.database.FetchAsync<DBContext.DBConfia.Aclaraciones.Turnos>();
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
        [Route("actualizaTurno")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> actualizaTurno(PeticionesRest.Aclaraciones.Turnos.ActualizarTurno pardata)
        {

            try
            {
                var obj = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Aclaraciones.Turnos>(pardata.IdTurnos);
                if (obj != null)
                {
                    obj.Turno = pardata.Turno;
                    obj.HoraEntrada = pardata.HoraEntrada;
                    obj.HoraSalida = pardata.HoraSalida;
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
        [Route("altaTurno")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> altaTurno(PeticionesRest.Aclaraciones.Turnos.AltaTurno pardata)
        {
            try
            {
                var obj = new DBContext.DBConfia.Aclaraciones.Turnos();
                obj.Turno = pardata.Turno;
                obj.HoraEntrada = pardata.HoraEntrada;
                obj.HoraSalida = pardata.HoraSalida;
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