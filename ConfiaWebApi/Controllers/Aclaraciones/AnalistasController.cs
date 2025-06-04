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

namespace ConfiaWebApi.Controllers.AnalistasController
{
    [Authorize]
    [ApiController]
    [Route("api/Aclaraciones/[controller]")]
    public class Analistas : ControllerBase
    {
        private DBConfiaContext DBContext;
        public Analistas(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [Authorize]
        [HttpGet]
        [Route("analistaSelect")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> obtenerAnalistas()
        {
            try
            {
                var analistas = await DBContext.database.FetchAsync<DBContext.DBConfia.Aclaraciones.Analistas_VW>();
                await DBContext.Destroy();
                return Ok(analistas);
            }
            catch (Exception error)
            {
                await DBContext.Destroy();
                return BadRequest(error.Message);
            }
        }

        [Authorize]
        [HttpPost]
        [Route("show")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerAsyncrono(PeticionesRest.Aclaraciones.Analistas.BusquedaAnalista parData)
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
        [Route("obtenerAnalista")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getAnalista()
        {
            try
            {
                var res = await DBContext.database.FetchAsync<DBContext.DBConfia.Aclaraciones.Analistas_VW>();
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception e)
            {
                await DBContext.Destroy();
                return BadRequest(e.Message);
            }
        }


        [HttpGet]
        [Route("obtenerAnalistaAdmin")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> getAnalistaAdmin()
        {
            try
            {
                var res = await DBContext.database.FetchAsync<DBContext.DBConfia.Aclaraciones.Analistas_VW>();
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
        [Route("actualizaAnalista")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> UpdateAnalista(PeticionesRest.Aclaraciones.Analistas.ActualizarAnalista pardata)
        {
            try
            {
                var analista = await DBContext.database.QueryAsync<DBContext.DBConfia.Aclaraciones.Analistas>("WHERE AnalistaID = @0", pardata.AnalistaID).SingleOrDefaultAsync();
                if (analista != null)
                {
                    analista.Activo = pardata.Activo;
                    await DBContext.database.UpdateAsync(analista);
                    var objeto = await DBContext.database.QueryAsync<DBContext.DBConfia.Aclaraciones.Analistas_VW>("WHERE AnalistaID = @0", analista.AnalistaID).SingleOrDefaultAsync();
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
        [Route("altaTipoAnalista")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> AltaAnalista(PeticionesRest.Aclaraciones.Analistas.AltaAnalista pardata)
        {

            try
            {
                var analista = new DBContext.DBConfia.Aclaraciones.Analistas();
                analista.AnalistaID = pardata.AnalistaID;
                analista.Activo = pardata.Activo;
                analista.FechaRegistro = DateTime.Now;
                await DBContext.database.InsertAsync(analista);
                var objeto = await DBContext.database.QueryAsync<DBContext.DBConfia.Aclaraciones.Analistas_VW>("WHERE AnalistaID = @0", analista.AnalistaID).SingleOrDefaultAsync();
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