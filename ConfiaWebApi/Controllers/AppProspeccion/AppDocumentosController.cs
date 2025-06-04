using DBContext.DBConfia;
using DBContext.DBConfia.Prospeccion;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using System;
using System.Linq;

using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.AppProspeccion
{
    [Authorize]
    [ApiController]
    [Route("api/AppProspeccion/[controller]")]
    public class AppDocumentosController : ControllerBase
    {
        private DBConfiaContext ConexionBD;

        public AppDocumentosController(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }

        [HttpPost]
        [Route("getDocumentosProspecto")]
        [Authorize]
        public async Task<IActionResult> GetDocsProspecto(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.GetDocs parData)
        {
            try
            {
                var docs = await ConexionBD.database.QueryAsync<ProspectosDocumentosApp_VW>("EXEC Prospeccion.pa_ObtenerDocsProspecto @ProspectoID", parData).ToArrayAsync();
                var resp = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = docs
                };

                await ConexionBD.Destroy();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { error = "Error al obtener info " }
                });
            }
        }

        [HttpPost]
        [Route("deleteDoc")]
        [Authorize]
        public async Task<IActionResult> deleteDoc(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.GetDoc parData){
            try {
                // Eliminamos el registro
                await ConexionBD.database.ExecuteAsync("DELETE FROM Prospeccion.Documentos WHERE DocumentoID = @DocumentoID", parData);
                await ConexionBD.Destroy();
                return Ok (
                    
                    new {
                        resultCode = 0,
                        resultDesc = "OK.",
                        msj = "Se ah eliminado el documento con éxito",
                        
                    });
            }catch(Exception e){
                return BadRequest(new {
                    resultCode = -1,
                    resultDesc = "OK.",
                    msj = "Error al eliminar el documento, intente mas tarde,error " + e.Message,
                });
            }
        }

    }
}