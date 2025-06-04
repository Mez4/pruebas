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

namespace ConfiaWebApi.Controllers.EncargadosController
{
    [Authorize]
    [ApiController]
    [Route("api/Aclaraciones/[controller]")]
    public class Encargado : ControllerBase
    {
        private DBConfiaContext DBContext;
        public Encargado(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [Authorize]
        [HttpPost]
        [Route("show")]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerAsyncrono(PeticionesRest.Aclaraciones.Encargado.BusquedaEncargado parData)
        {
            parData.Nombre += "%";
            var tiposMovs = await DBContext.database.QueryAsync<DBContext.DBConfia.General.Personas_VW>("WHERE NombreCompleto LIKE @0", parData.Nombre).ToArrayAsync();
            try
            {
                var result = tiposMovs.Select(c => new
                {
                    PersonaID = c.PersonaID,
                    NombreCompleto = c.NombreCompleto,
                }).ToArray();
                await DBContext.Destroy();
                return Ok(result);
            }
            catch (Exception error)
            {
                await DBContext.Destroy();
                return BadRequest(error.Message);
            }
        }

        [HttpGet]
        [Route("obtenerEncargado")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getEncargado()
        {
            try
            {
                var res = await DBContext.database.FetchAsync<DBContext.DBConfia.Aclaraciones.Encargados_VW>();
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
        [Route("actualizaEncargado")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> UpdateEncargado(PeticionesRest.Aclaraciones.Encargado.ActualizarEncargado pardata)
        {
            try
            {
                var encargado = await DBContext.database.QueryAsync<DBContext.DBConfia.Aclaraciones.Encargados>("WHERE EncargadoID = @0", pardata.EncargadoID).SingleOrDefaultAsync();
                if (encargado != null)
                {
                    //encargado.MesaAclaracionID = pardata.MesaAclaracionID;
                    encargado.FechaRegistro = DateTime.Now;
                    encargado.Activo = pardata.Activo;
                    await DBContext.database.UpdateAsync(encargado);
                    var objeto = await DBContext.database.QueryAsync<DBContext.DBConfia.Aclaraciones.Encargados_VW>("WHERE EncargadoID = @0", encargado.EncargadoID).SingleOrDefaultAsync();
                    await DBContext.Destroy();
                    return Ok(objeto);
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
        [Route("altaEncargado")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> AltaEncargados(PeticionesRest.Aclaraciones.Encargado.AltaEncargado pardata)
        {
            try
            {

                var encargado = new DBContext.DBConfia.Aclaraciones.Encargados();
                encargado.EncargadoID = pardata.EncargadoID;
                //encargado.MesaAclaracionID = pardata.MesaAclaracionID;
                encargado.Activo = pardata.Activo;
                encargado.FechaRegistro = DateTime.Now;
                await DBContext.database.InsertAsync(encargado);
                var objeto = await DBContext.database.QueryAsync<DBContext.DBConfia.Aclaraciones.Encargados_VW>("WHERE EncargadoID = @0", encargado.EncargadoID).SingleOrDefaultAsync();
                await DBContext.Destroy();
                return Ok(objeto);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}