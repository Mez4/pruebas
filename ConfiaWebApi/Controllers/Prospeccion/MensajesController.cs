using ConfiaWebApi.ModlesSP.Prospeccion;
using DBContext.DBConfia;
using DBContext.DBConfia.Prospeccion;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.Prospeccion
{
    [Authorize]
    [ApiController]
    [Route("api/Prospeccion/[controller]")]
    public class MensajesController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public MensajesController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Prospeccion.Mensajes.get parData)
        {
            if (parData.id != 0)
            {
                var res1 = await DBContext.database.SingleByIdAsync<Mensajes>(parData.id);
                await DBContext.Destroy();
                return Ok(res1);
            }
            var res = await DBContext.database.FetchAsync<Mensajes>();
            await DBContext.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("getStatusByMensaje")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getStatusByMensaje(ConfiaWebApi.PeticionesRest.Prospeccion.Mensajes.getStatusByMensaje parData)
        {
            if (parData.id != 0)
            {
                var Status = await DBContext.database.QueryAsync<MensajesRelacion_VW>("EXEC Prospeccion.pa_ObtenerProcesosMensajes @id", parData).ToArrayAsync();
                await DBContext.Destroy();
                return Ok(Status);
            }
            
            return Ok(new List<int>());
        }

        [HttpPost]
        [Route("getDocsByStatus")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getDocsByStatus(ConfiaWebApi.PeticionesRest.Prospeccion.Mensajes.getDocsByStatus parData)
        {
            if (parData.id != 0)
            {
                var StatusValida = await DBContext.database.QueryAsync<StatusProceso>("WHERE StatusProcesoID = @idP AND Descripcion LIKE '%DOCUMENTOS%' ", parData).SingleOrDefaultAsync();
                if (StatusValida == null)
                {
                    await DBContext.Destroy();
                    return Ok(new List<int>());
                }
                var aval = parData.idP == 16 ? 1 : 0;
                var Status = await DBContext.database.QueryAsync<MensajesRelacionDocumento_VW>("EXEC Prospeccion.pa_ObtenerDocumentosMensajes @id, @idP, @1", parData, aval).ToArrayAsync();
                await DBContext.Destroy();
                return Ok(Status);
            }

            return Ok(new List<int>());
        }

        [HttpPost]
        [Route("checkProceso")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> checkProceso(ConfiaWebApi.PeticionesRest.Prospeccion.Mensajes.checkProceso parData)
        {
            var Status = await DBContext.database.QueryAsync<SP_ProspeccionVW>("EXEC Prospeccion.pa_ActualizaProcesoMensaje @idP,@id,@check", parData).ToArrayAsync();
            await DBContext.Destroy();
            return Ok(Status);
        }

        [HttpPost]
        [Route("checkDoc")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> checkProceso(ConfiaWebApi.PeticionesRest.Prospeccion.Mensajes.checkDocumuento parData)
        {
            try
            {
                var valida = await DBContext.database.QueryAsync<MensajesRelacion>("WHERE MensajeID = @id AND StatusProcesoID = @idP AND TipoDocumentoID = @idD ", parData).SingleOrDefaultAsync();
                if(valida == null)
                {
                    var relacion = new MensajesRelacion()
                    {
                        MensajeID = parData.id,
                        StatusProcesoID = parData.idP,
                        TipoDocumentoID = parData.idD,
                        Activo = parData.check == 1
                    };
                    await DBContext.database.InsertAsync(relacion);
                }
                else 
                {
                    valida.Activo = parData.check == 1;
                    await DBContext.database.ExecuteAsync("UPDATE Prospeccion.MensajesRelacion SET Activo=@Activo WHERE MensajeID=@MensajeID AND StatusProcesoID=@StatusProcesoID AND TipoDocumentoID=@TipoDocumentoID", valida);
                }
                
                var res = new { msj = "OK" };
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest("ERROR AL GUARDAR LOS DATOS ECONOMICOS DE LA PERSONA: " + ex.Message);
            }
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Prospeccion.Mensajes.add parData)
        {
            try
            {
                var mensaje = new Mensajes() { Mensaje = parData.Mensaje.ToUpper() };
                await DBContext.database.InsertAsync<Mensajes>(mensaje);
                await DBContext.Destroy();
                return Ok(mensaje);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("getResumen")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getResumen(ConfiaWebApi.PeticionesRest.Prospeccion.Mensajes.get parData)
        {
            if (parData.id != 0)
            {
                var res1 = await DBContext.database.SingleByIdAsync<MensajesRelacion_VW>(parData.id);
                await DBContext.Destroy();
                return Ok(res1);
            }
            //var ListValera = await DBContext.database.FetchAsync<ValeraCabecera>("WHERE  (serieId = @serieId) ORDER BY FolioFinal", parData);
            var res = await DBContext.database.FetchAsync<MensajesRelacion_VW>("WHERE MensajeID IS NOT NULL ORDER BY MensajeID");
            await DBContext.Destroy();
            return Ok(res);
        }

    }
}
