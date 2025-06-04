using DBContext.DBConfia;
using DBContext.DBConfia.Catalogos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.Catalogos
{
    [Authorize]
    [ApiController]
    [Route("api/Catalogos/[controller]")]
    public class TipoDocumentoController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public TipoDocumentoController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }


        [HttpPost]
        [Route("get")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Catalogos.TipoDocumento.Get parData)
        {
            if (parData.id != 0)
            {
                var res = await DBContext.database.SingleByIdAsync<TipoDocumento>(parData.id);
                await DBContext.Destroy();
                return Ok(res);
            }
            var res2 = await DBContext.database.FetchAsync<TipoDocumento>();
            await DBContext.Destroy();
            return Ok(res2);
        }


        // [HttpPost]
        // [Route("get")]
        // [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        // public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Catalogos.TipoDocumento.Get parData)
        // {
        //     if (parData.id != 0)
        //         return Ok(await DBContext.database.SingleByIdAsync<DocumentosTipos>(parData.id));

        //     return Ok(await DBContext.database.FetchAsync<DocumentosTipos>());
        // }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Catalogos.TipoDocumento.Add parData)
        {
            try
            {
                var DocumentoTipo = new DocumentosTipos()
                {
                    activo = parData.activo,
                    claveDoc = parData.claveDoc,
                    documentosTipoNombre = parData.documentosTipoNombre,
                    ordenSistema = parData.ordenSistema,
                    soloIMG = parData.soloIMG
                };
                await DBContext.database.InsertAsync(DocumentoTipo);
                await DBContext.Destroy();
                return Ok(DocumentoTipo);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("update")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Catalogos.TipoDocumento.Update parData)
        {
            try
            {
                var DocumentoTipo = await DBContext.database.SingleByIdAsync<DocumentosTipos>(parData.documentosTipoId);
                DocumentoTipo.activo = parData.activo;
                DocumentoTipo.claveDoc = parData.claveDoc;
                DocumentoTipo.documentosTipoNombre = parData.documentosTipoNombre;
                DocumentoTipo.ordenSistema = parData.ordenSistema;
                DocumentoTipo.soloIMG = parData.soloIMG;
                await DBContext.database.UpdateAsync(DocumentoTipo);
                await DBContext.Destroy();
                return Ok(DocumentoTipo);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

    }
}
