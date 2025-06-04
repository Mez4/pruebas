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
    public class TipoDocumentoAvalController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public TipoDocumentoAvalController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        protected async Task<object> ObjectSerie(TipoDocumentoAval tipoDocumentoAval)
        {
            var res = new
            {
                tipoDocumentoAval.TipoDocumentoAvalID,
                tipoDocumentoAval.CatalogoTipoDocumentoID,
                documentoTipo = (await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Catalogos.TipoDocumento>(tipoDocumentoAval.CatalogoTipoDocumentoID)),
                tipoDocumentoAval.Orden,
                tipoDocumentoAval.Activo

            };
            await DBContext.Destroy();
            return res;
        }
        protected async Task<object> ObjectCatTipoDocumento(DBContext.DBConfia.Catalogos.TipoDocumento CatTipoDocumento)
        {
            var res = new
            {

                CatTipoDocumento.TipoDocumentoID,
                CatTipoDocumento.NombreDocumento,
                CatTipoDocumento.Clave,
                CatTipoDocumento.Descripcion,
                CatTipoDocumento.Activo
                // tipoDocumento.TipoDocumentoID,
                // //documentoTipo.
                // documentoTipo = (await tipoDocumento.CH__TIPO_DOCUMENTO(DBContext)).FirstOrDefault(),
                // tipoDocumento.Orden,
                // tipoDocumento.Activo

            };
            await DBContext.Destroy();
            return res;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Prospeccion.TipoDocumentoAval.get parData)
        {
            if (parData.id != 0)
            {
                var serie = await DBContext.database.SingleByIdAsync<TipoDocumentoAval>(parData.id);
                var res = await ObjectSerie(serie);
                await DBContext.Destroy();
                return Ok(res);
            }

            List<object> respList = new List<object>();
            var ListSeries = await DBContext.database.FetchAsync<TipoDocumentoAval>();
            foreach (var item in ListSeries)
            {
                respList.Add(await ObjectSerie(item));
            }
            await DBContext.Destroy();
            return Ok(respList);
        }

        //#######################
        [HttpPost]
        [Route("getDocs")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetDocs(ConfiaWebApi.PeticionesRest.Prospeccion.TipoDocumentoAval.get parData)
        {
            int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());

            var obj = new { ProductoID = ProductoID };
            var matrizProcesos = await DBContext.database.QueryAsync<TipoDocumento>("WHERE ProductoID = @ProductoID ", obj).FirstOrDefaultAsync();
            if (matrizProcesos == null)
            {
                await DBContext.Destroy();
                return Ok(new List<ObtenerDocumentosProducto>());
            }
            var Procs = await DBContext.database.QueryAsync<ObtenerDocumentosProducto>("EXEC Prospeccion.pa_ObtenerDocumentosProducto @ProductoID, 1", obj).ToArrayAsync();
            await DBContext.Destroy();
            return Ok(Procs);
        }

        [HttpPost]
        [Route("updateCapturaObligatoria")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Prospeccion.TipoDocumento.updateCapturaObligatoria parData)
        {
            int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
            try
            {
                var tipoDoc = await DBContext.database.QueryAsync<TipoDocumentoAval>("WHERE ProductoID = @0 AND CatalogoTipoDocumentoID = @1 ", ProductoID, parData.CatalogoTipoDocumentoID).FirstOrDefaultAsync();
                if (tipoDoc == null)
                {
                    var obj = new { ProductoID = ProductoID };
                    var tipoDocNew = new TipoDocumentoAval()
                    {
                        Activo = true,
                        CatalogoTipoDocumentoID = parData.CatalogoTipoDocumentoID,
                        ProductoID = ProductoID
                    };

                    await DBContext.database.InsertAsync<TipoDocumentoAval>(tipoDocNew);
                    await DBContext.Destroy();
                    return Ok(tipoDocNew);
                }
                else
                {
                    //var tipoDoc = await DBContext.database.SingleByIdAsync<TipoDocumentoAval>(parData.TipoDocumentoID);
                    tipoDoc.Activo = parData.CapturaObligatoria;
                    await DBContext.database.UpdateAsync(tipoDoc);
                    await DBContext.Destroy();
                    return Ok(tipoDoc);

                }
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }


        [HttpPost]
        [Route("getByCatTipoDocumento")]
        [Authorize]
        [Code.TProteccionProducto]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> GetByCatTipoDocumento(ConfiaWebApi.PeticionesRest.Catalogos.TipoDocumento.Get parData)
        {
            try
            {
                List<object> respList = new List<object>();
                var ListSeries = await DBContext.database.QueryAsync<DBContext.DBConfia.Catalogos.TipoDocumento>("WHERE NombreDocumento LIKE '%aval%'").ToArrayAsync();
                //var ListSeries = await DBContext.database.FetchAsync<DBContext.DBConfia.Catalogos.TipoDocumento>();
                foreach (var item in ListSeries)
                {
                    respList.Add(await ObjectCatTipoDocumento(item));
                }
                await DBContext.Destroy();
                return Ok(respList);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }




        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> add(ConfiaWebApi.PeticionesRest.Prospeccion.TipoDocumentoAval.add parData)
        {
            try
            {
                var tipoDocumentoAval = new TipoDocumentoAval()
                {
                    CatalogoTipoDocumentoID = parData.CatalogoTipoDocumentoID,
                    Orden = parData.Orden,
                    Activo = parData.Activo
                };
                await DBContext.database.InsertAsync<TipoDocumentoAval>(tipoDocumentoAval);
                var res = await ObjectSerie(tipoDocumentoAval);
                await DBContext.Destroy();
                return Ok(res);
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
        [Code.TProteccionProducto]
        public async Task<IActionResult> update(ConfiaWebApi.PeticionesRest.Prospeccion.TipoDocumentoAval.update parData)
        {
            try
            {

                var tipoDocumentoAval = await DBContext.database.SingleByIdAsync<TipoDocumentoAval>(parData.TipoDocumentoAvalID);
                tipoDocumentoAval.CatalogoTipoDocumentoID = parData.CatalogoTipoDocumentoID;
                tipoDocumentoAval.Orden = parData.Orden;
                tipoDocumentoAval.Activo = parData.Activo;
                await DBContext.database.UpdateAsync(tipoDocumentoAval);
                var res = await ObjectSerie(tipoDocumentoAval);
                await DBContext.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }
    }
}
