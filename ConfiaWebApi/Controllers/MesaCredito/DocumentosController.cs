using ConfiaWebApi.PeticionesRest.MesaCredito;
using DBContext.DBConfia;
using DBContext.DBConfia.MesaCredito;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.MesaCredito
{
    [Authorize]
    [ApiController]
    [Route("api/MesaCredito/[controller]")]
    public class DocumentosController : ControllerBase
    {
        private DBConfiaContext DBContext;


        public DocumentosController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(PeticionesRest.MesaCredito.Documentos.Get parData)
        {
            if (parData.id != 0)
            {
                try
                {
                    var res = await DBContext.database.SingleByIdAsync<Documentos>(parData.id);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            var res1 = await DBContext.database.FetchAsync<Documentos>();
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(string json_parameters)
        {
            //  ConfiaWebApi.PeticionesRest.MesaCredito.Documentos.Add parData
            List<DocumentosParameters> expven = JsonConvert.DeserializeObject<List<DocumentosParameters>>(json_parameters);

            try
            {

                foreach (var a in expven)
                {


                    var documento = new Documentos()
                    {

                        documentoTipoId = a.documentoTipoId,
                        carpetaId = a.carpetaId,
                        url = a.url,
                        fechaAlta = a.fechaAlta,
                        fechaMod = a.fechaMod,
                        fechaBaja = a.fechaBaja,
                        usuarioID = a.usuarioID,
                        activo = a.activo
                    };
                    await DBContext.database.InsertAsync(documento);


                }
                await DBContext.Destroy();
                return Ok();
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }


        }

        [HttpPost]
        [Route("update")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.MesaCredito.Documentos.Update parData)
        {
            try
            {
                var documento = await DBContext.database.SingleByIdAsync<Documentos>(parData.id);
                documento.id = parData.id;
                documento.documentoTipoId = parData.documentoTipoId;
                documento.carpetaId = parData.carpetaId;
                documento.url = parData.url;
                documento.fechaAlta = parData.fechaAlta;
                documento.fechaMod = parData.fechaMod;
                documento.fechaBaja = parData.fechaBaja;
                documento.usuarioID = parData.usuarioID;
                documento.activo = parData.activo;
                await DBContext.database.UpdateAsync(documento);
                await DBContext.Destroy();
                return Ok(documento);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}
