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

namespace ConfiaWebApi.Controllers.ConceptosController
{
    [Authorize]
    [ApiController]
    [Route("api/Aclaraciones/[controller]")]
    public class Conceptos : ControllerBase
    {
        private DBConfiaContext DBContext;
        public Conceptos(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpGet]
        [Route("obtenerConcepto")]
        [Authorize]
        // [Code.TProteccionProducto]
        public async Task<IActionResult> GetConcepto()
        {
            try
            {
                var concepto = await DBContext.database.FetchAsync<DBContext.DBConfia.Aclaraciones.Conceptos>();
                await DBContext.Destroy();
                return Ok(concepto);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("actualizaConcepto")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ActualizarConcepto(PeticionesRest.Aclaraciones.Conceptos.ActualizarConcepto pardata)
        {
            try
            {
                var concepto = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Aclaraciones.Conceptos>(pardata.ConceptoID);
                if (concepto != null)
                {
                    concepto.Clave = pardata.Clave;
                    concepto.DescripcionConcepto = pardata.DescripcionConcepto;
                    await DBContext.database.UpdateAsync(concepto);
                    await DBContext.Destroy();
                    return Ok(concepto);
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
        [Route("altaConcepto")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> AltaConcepto(PeticionesRest.Aclaraciones.Conceptos.AltaConcepto pardata)
        {
            try
            {
                //Alta de Mesa de Aclacracion
                var concepto = new DBContext.DBConfia.Aclaraciones.Conceptos();
                concepto.Clave = pardata.Clave;
                concepto.DescripcionConcepto = pardata.DescripcionConcepto;
                await DBContext.database.InsertAsync(concepto);
                await DBContext.Destroy();
                return Ok(concepto);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}