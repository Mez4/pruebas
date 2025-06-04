using ConfiaWebApi.ModlesSP.Prospeccion;
using DBContext.DBConfia;
using DBContext.DBConfia.Prospeccion;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.Prospeccion
{
    [Authorize]
    [ApiController]
    [Route("api/Prospeccion/[controller]")]
    public class BuroDeCreditoController : ControllerBase
    {
        private DBConfiaContext ConexionBD;

        private IConfiguration Configuracion;
        public BuroDeCreditoController(IConfiguration _Configuration, DBConfiaContext _DBContext)
        {
            this.Configuracion = _Configuration;
            ConexionBD = _DBContext;
        }

        [HttpPost]
        [Route("updateConfirmarBuroDeCredito")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetDocs(ConfiaWebApi.PeticionesRest.Prospeccion.BuroDeCredito.updateConfirmarBuroDeCredito parData)
        {
            try
            {
                var prospectoValida = await ConexionBD.database.SingleByIdAsync<Prospectos>(parData.ProspectoID);
                if (!prospectoValida.Activo)
                {
                    await ConexionBD.Destroy();
                    return BadRequest("Este prospecto esta cancelado");//throw new Exception("Este prospecto esta cancelado");
                }
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, ProspectoID = parData.ProspectoID, Identificador = parData.Identificador, regresa = parData.regresa, msj = parData.msj };
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.ModlesSP.Prospeccion.Confirmar>("EXEC Prospeccion.pa_TuberiaProceso @Usu, @ProspectoID, @Identificador, @regresa, @msj", obj).FirstOrDefaultAsync();
                await ConexionBD.Destroy();
                if (res.regresa == 1)
                    return Ok(res);
                else
                    return BadRequest(res.msj);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("ArchivarProspecto")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ArchivarProspecto(ConfiaWebApi.PeticionesRest.Prospeccion.BuroDeCredito.ArchivarProspecto parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            try
            {
                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
                var prospecto = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Prospeccion.Prospectos>("WHERE ProspectoID = @0",parData.ProspectoID).SingleOrDefaultAsync();

                var tipo = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Prospeccion.CatalogoTipoArchivados>("WHERE TipoArchivadoID = @0",parData.TipoArchivadoID).SingleOrDefaultAsync();

                if(tipo.Clave == "OTR" && (parData.Motivo == "" || parData.Motivo == null))
                {
                    await ConexionBD.Destroy();
                    return BadRequest("Favor de ingresar motivo");
                }
                else
                {
                    prospecto.Archivado = true;
                await ConexionBD.database.UpdateAsync(prospecto);

                var log = new DBContext.DBConfia.Prospeccion.LogArchivados()
                {
                    ProspectoID = parData.ProspectoID,
                    Descripcion = "ARCHIVADO",
                    TipoArchivadoID = parData.TipoArchivadoID,
                    Motivo = parData.Motivo,
                    FechaRegistra = DateTime.Now,
                    UsuarioIDRegistra = UsuarioActual.UsuarioID,
                    PersonaIDRegistra = (long)UsuarioActual.PersonaID
                };
                await ConexionBD.database.InsertAsync(log);

                await ConexionBD.Destroy();
                return Ok();

                }


                
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("DesarchivarProspecto")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> DesarchivarProspecto(ConfiaWebApi.PeticionesRest.Prospeccion.BuroDeCredito.updateConfirmarBuroDeCredito parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            try
            {
                int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
                var prospecto = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Prospeccion.Prospectos>("WHERE ProspectoID = @0",parData.ProspectoID).SingleOrDefaultAsync();

                prospecto.Archivado = false;
                await ConexionBD.database.UpdateAsync(prospecto);

                var log = new DBContext.DBConfia.Prospeccion.LogArchivados()
                {
                    ProspectoID = parData.ProspectoID,
                    Descripcion = "DESARCHIVADO",
                    FechaRegistra = DateTime.Now,
                    UsuarioIDRegistra = UsuarioActual.UsuarioID,
                    PersonaIDRegistra = (long)UsuarioActual.PersonaID
                };
                await ConexionBD.database.InsertAsync(log);

                await ConexionBD.Destroy();
                return Ok();
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("getDocs")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetDocs(ConfiaWebApi.PeticionesRest.Prospeccion.Prospecto.GetDocs parData)
        {
            var Docs = await ConexionBD.database.QueryAsync<ObtenerDocProspecto>("EXEC Prospeccion.pa_ObtenerDocsProspecto @ProspectoID", parData).ToArrayAsync();
            List<ObtenerDocProspecto> DocsBuro = new List<ObtenerDocProspecto>();
            foreach (var item in Docs)
            {
                if(item.ConsultaBuro == true)
                {
                    DocsBuro.Add(item);
                }
            }

            await ConexionBD.Destroy();
            return Ok(DocsBuro);
        }

        [HttpPost]
        [Route("updateValidarBuroDeCredito")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetDocs(ConfiaWebApi.PeticionesRest.Prospeccion.BuroDeCredito.updateValidarBuroDeCredito parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, ProspectoID = parData.ProspectoID, BuroInternoEstatusID = parData.BuroInternoEstatusID, regresa = parData.regresa, msj = parData.msj };

                
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.ModlesSP.Prospeccion.Confirmar>("EXEC Prospeccion.pa_ValidarBuroDeCredito @ProspectoID, @BuroInternoEstatusID ,@regresa, @msj", obj).FirstOrDefaultAsync();

                

                if (res.regresa == 1)
                {
                    var obj2 = new { parData.ProspectoID, Nota = "POR FAVOR AGREGUE EL RESTO DE LOS DOCUMENTOS REQUERIDOS PARA CONTINUAR CON LA ACTIVACIÓN DE LA SOCIA DV", UsuarioActual.UsuarioID, TipoMesa = 1 };
                    var validacion2 = await ConexionBD.database.QueryAsync<LogMensajesVW>("EXEC Prospeccion.pa_AgregarNota @ProspectoID, @Nota, 1, @UsuarioID, @TipoMesa, 1", obj2).FirstOrDefaultAsync();
                    var LogDate = await ConexionBD.database.QueryAsync<LogTiemposPeriodo>("EXEC Prospeccion.pa_LogTiemposPeriodo @0, @1, @2, @3, @4", parData.ProspectoID, null, 1, 2, null).FirstOrDefaultAsync();
                    await ConexionBD.Destroy();
                    return Ok(res);
                }
                else
                {
                    await ConexionBD.Destroy();
                    return BadRequest(res.msj);
                }
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex);
            }
        }
    }
}
