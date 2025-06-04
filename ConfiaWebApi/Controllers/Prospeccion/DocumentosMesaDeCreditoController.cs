using Chilkat;
using ConfiaWebApi.ModlesSP.Prospeccion;
using ConfiaWebApi.PeticionesRest.Prospeccion.Documentos;
using DBContext.DBConfia;
using DBContext.DBConfia.Prospeccion;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.Prospeccion
{
    [Authorize]
    [ApiController]
    [Route("api/Prospeccion/[controller]")]


    public class DocumentosMesaDeCreditoController : ControllerBase
    {
        private DBConfiaContext ConexionBD;

        private IConfiguration Configuracion;

        public DocumentosMesaDeCreditoController(IConfiguration _Configuration, DBConfiaContext _DBContext)
        {
            this.Configuracion = _Configuration;
            ConexionBD = _DBContext;
        }

        [HttpPost]
        [Route("getDocumentos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetDocs(ConfiaWebApi.PeticionesRest.Prospeccion.DocumentosMesaDeCredito.getDocumentos parData)
        {   

            try
            {
                //var Docs = await ConexionBD.database.QueryAsync<spDocumentosMesaDeCredito>("EXEC Prospeccion.pa_ObtenerDocsProspecto @ProspectoID", parData).ToArrayAsync();
                var Docs = await ConexionBD.database.QueryAsync<spDocumentosMesaDeCredito>("EXEC Prospeccion.pa_ObtenerDocs @ProspectoID", parData).ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(Docs);
            }
            catch (System.Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("ERROR AL GUARDAR LOS DATOS  DE LA PERSONA: " + ex.Message);
                // throw;
            }
         
        }

        [HttpPost]
        [Route("GetVerDocumentos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetDoc(ConfiaWebApi.PeticionesRest.Prospeccion.DocumentosMesaDeCredito.GetVerDocumentos parData)
        {
            try
            {
                var src = "";
                var Documento  = await ConexionBD.database.QueryAsync<DocumentosNotas>("WHERE  (DocumentoID = @DocumentoID)", parData).LastOrDefaultAsync();
                var tipoDocumento = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Catalogos.TipoDocumento>("SELECT td1.TipoDocumentoID, td1.NombreDocumento, td1.Clave FROM Prospeccion.Documentos d INNER JOIN Prospeccion.TipoDocumento td ON d.TipoDocumentoID = td.TipoDocumentoID INNER JOIN Catalogos.TipoDocumento td1 ON td.CatalogoTipoDocumentoID = td1.TipoDocumentoID WHERE d.DocumentoID = @0", parData.DocumentoID);

                var plainTextBytes = System.Text.Encoding.UTF8.GetBytes($"{Configuracion["BucketApi:permissions:basic"]}:{Configuracion["BucketApi:permissions:secret"]}");
                var basicToken = Convert.ToBase64String(plainTextBytes);
                using (var client = new HttpClient())
                {
                    client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", basicToken); ;
                    var response = await client.GetAsync($"{Configuracion["BucketApi:url"]}{Configuracion["BucketApi:getRequest"]}?expireIn=1&path={Documento.Ruta}");
                    if (response.IsSuccessStatusCode)
                    {
                        var jsonString = await response.Content.ReadAsStringAsync();
                        var request = JsonConvert.DeserializeObject<BucketGet>(jsonString);
                        src = request.url;
                    }
                    else
                    {
                        await ConexionBD.Destroy();
                        return BadRequest(response.StatusCode);
                    }
                }
                Console.WriteLine(Documento.Ruta);
                var res = new
                {
                    res = 1,
                    msj = $"Consulta correcta del documento {parData.DocumentoID}",
                    src = $"{src}",
                    Nota = Documento.Observacion,
                    CatalogoTipoDocumentoID = tipoDocumento[0]?.TipoDocumentoID,
                };
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("ERROR AL GUARDAR LOS DATOS ECONOMICOS DE LA PERSONA: " + ex.Message);
            }

        }

        [HttpPost]
        [Route("updateAutorizaDocumeto")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetDocs(ConfiaWebApi.PeticionesRest.Prospeccion.DocumentosMesaDeCredito.updateAutorizaDocumeto parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu=UsuarioActual.UsuarioID, DocumentoID=parData.DocumentoID, regresa=parData.regresa, msj=parData.msj};
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.ModlesSP.Prospeccion.spAutorizaDocumento>("EXEC Prospeccion.AutorizarDocumento @Usu, @DocumentoID, @regresa, @msj", obj).FirstOrDefaultAsync();

                await ConexionBD.Destroy();
                if (res.regresa == 1)
                    return Ok(res.msj);
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
        [Route("updateRechazaDocumento")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetDocs(ConfiaWebApi.PeticionesRest.Prospeccion.DocumentosMesaDeCredito.updateRechazaDocumento parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, DocumentoID = parData.DocumentoID, Nota=parData.Nota ,regresa = parData.regresa, msj = parData.msj };
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.ModlesSP.Prospeccion.spAutorizaDocumento>("EXEC Prospeccion.RechazarDocumento @Usu, @DocumentoID, @Nota, @regresa, @msj", obj).FirstOrDefaultAsync();

                await ConexionBD.Destroy();
                if (res.regresa == 1)
                    return Ok(res.msj);
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
        [Route("updateProceso")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetDocs(ConfiaWebApi.PeticionesRest.Prospeccion.DocumentosMesaDeCredito.updateProceso parData)
        {
            try
            {
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
        [Route("updateValidarDocumentos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetDocs(ConfiaWebApi.PeticionesRest.Prospeccion.DocumentosMesaDeCredito.updateValidarDocumentos parData)
        {
            try
            {
                var LogDate= new LogTiemposPeriodo();
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new { Usu = UsuarioActual.UsuarioID, ProspectoID = parData.ProspectoID, regresa = parData.regresa, msj = parData.msj };
                //var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.ModlesSP.Prospeccion.Confirmar>("EXEC Prospeccion.pa_ValidarDocumentos @ProspectoID, @regresa, @msj", obj).FirstOrDefaultAsync();
                var res = await ConexionBD.database.QueryAsync<ConfiaWebApi.ModlesSP.Prospeccion.Confirmar>("EXEC Prospeccion.pa_ValidarDocumentosGeneral @ProspectoID", obj).FirstOrDefaultAsync();
                if (res.regresa==1)
                {
                      LogDate = await ConexionBD.database.QueryAsync<LogTiemposPeriodo>("EXEC Prospeccion.pa_LogTiemposPeriodo @0, @1, @2, @3, @4", parData.ProspectoID, null, 3, 2,null).FirstOrDefaultAsync();
                }
               var date = LogDate;
               
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
        [Route("updateConfirmarDocumentos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetDocs(ConfiaWebApi.PeticionesRest.Prospeccion.DocumentosMesaDeCredito.updateConfirmarDocumentos parData)
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

    }
}

 
