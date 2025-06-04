using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Sistema;
using DBContext.DBConfia.Gestoria;
using DBContext.DBConfia.Distribuidores;
using ConfiaWebApi.ModlesSP.Responsables;

namespace ConfiaWebApi.Controllers.Gestoria
{
    [Authorize]
    [ApiController]
    [Route("api/Gestoria/[controller]")]
    public class GrupoGestorDetalleController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public GrupoGestorDetalleController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(PeticionesRest.Gestoria.GrupoGestorDetalle.AddMany parData)
        {
            try
            {

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var Gestor = await DBContext.database.QueryAsync<GestorUsuarios>("WHERE UsuarioID = @0", parData.UsuarioID).FirstAsync();

                foreach (int DistribuidorItem in parData.Distribuidores)
                {

                    var obj2 = new
                    {
                        DistribuidorID = DistribuidorItem,
                        GestorID = Gestor.GestorID,
                        UsuarioActualiza = UsuarioActual.UsuarioID,
                        FechaActualiza = DateTime.Now
                    };
                    var Gestorin = await DBContext.database.QueryAsync<ResponsablesAsignacion>("EXEC Gestoria.InsertarLogGestor @DistribuidorID, @GestorID, @UsuarioActualiza, @FechaActualiza", obj2).FirstOrDefaultAsync();

                    
                    var obj = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Distribuidores.Distribuidores>(DistribuidorItem);

                        
                        obj.ResponsableID = Gestor.GestorID;
                        await DBContext.database.UpdateAsync(obj);
                }

                var res = new
                {
                    res = 1,
                    msj = "Las socias fueron asignadas al gestor correctamente",
                };
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(new
                {
                    res = 0,
                    msj = ex.Message,
                });
            }
        }

    }
}
