using ConfiaWebApi.ModlesSP.Prospeccion;
using DBContext.DBConfia;
using DBContext.DBConfia.Prospeccion;
using DBContext.DBConfia.Seguridad;
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
    public class MatrizProcesosDetalleController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public MatrizProcesosDetalleController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }
        protected async Task<object> ObjectSerie(MatrizProcesosDetalle datos)
        {
            var res = new
            {
                datos.MatrizProcesosDetalleID,
                MatrizProcesoID = (await datos.CH__MATRIZPROCESO(DBContext)).FirstOrDefault(),
                StatusProcesoId = (await datos.CH__STATUS_PROCESO(DBContext)).FirstOrDefault(),
                datos.CapturaObligatoria,
                datos.Notificacion,
                datos.NotaObligatoria,
                datos.DictamenObligatorio,
            };
            await DBContext.Destroy();
            return res;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Prospeccion.MatrizProcesosDetalle.get parData)
        {
            if (parData.id != 0)
            {
                //return Ok(await DBContext.database.SingleByIdAsync<MatrizProcesos>(parData.id));

                var datos = await DBContext.database.SingleByIdAsync<MatrizProcesosDetalle>(parData.id);
                var res = await ObjectSerie(datos);
                await DBContext.Destroy();
                return Ok(res);
            }

            List<object> respList = new List<object>();
            var ListSeries = await DBContext.database.FetchAsync<MatrizProcesosDetalle>();
            foreach (var item in ListSeries)
            {
                respList.Add(await ObjectSerie(item));
            }
            await DBContext.Destroy();
            return Ok(respList);
        }


        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Prospeccion.MatrizProcesosDetalle.add parData)
        {
            try
            {
                var matrizProcesosDetalle = new MatrizProcesosDetalle()
                {

                    MatrizProcesosID = 4,
                    StatusProcesoID = parData.StatusProcesoID,
                    CapturaObligatoria = parData.CapturaObligatoria,
                    Notificacion = parData.Notificacion,
                    NotaObligatoria = parData.NotaObligatoria,
                    DictamenObligatorio = parData.DictamenObligatorio,


                };

                //var matrizProcesos = new MatrizProcesos() { ProductoID = parData.ProductoId, Activo = parData.Activo };
                await DBContext.database.InsertAsync<MatrizProcesosDetalle>(matrizProcesosDetalle);
                await DBContext.Destroy();
                return Ok(await ObjectSerie(matrizProcesosDetalle));
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

        //#######################
        [HttpPost]
        [Route("getProcesos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetDocs(ConfiaWebApi.PeticionesRest.Prospeccion.MatrizProcesosDetalle.get parData)
        {
            var usuarioActualEmail = Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var UsuarioActual = await DBContext.database.QueryAsync<UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();
            int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());

            var obj = new { ProductoID = ProductoID };
            var matrizProcesos = await DBContext.database.QueryAsync<MatrizProcesos>("WHERE ProductoID = @ProductoID ", obj).FirstOrDefaultAsync();
            if (matrizProcesos == null)
            {
                await DBContext.Destroy();
                return Ok(new List<ObtenerProcesosProducto>());
            }
            var Procs = await DBContext.database.QueryAsync<ObtenerProcesosProducto>("EXEC Prospeccion.pa_ObtenerProcesosProducto @ProductoID", obj).ToArrayAsync();
            await DBContext.Destroy();
            return Ok(Procs);
        }
        
        [HttpPost]
        [Route("getTiempos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetData(ConfiaWebApi.PeticionesRest.Prospeccion.LogTiemposPorPantalla.Info parData)
        {
            try
            {
                var res = await DBContext.database.QueryAsync<LogTiemposPeriodoGet>("EXEC Prospeccion.pa_LogTiemposPeriodo @0, @1, @2, @3, @4", parData.ProspectoID, null, 1, 4, null).ToArrayAsync();

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
        [Route("updateCapturaObligatoria")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Prospeccion.MatrizProcesosDetalle.updateCapturaObligatoria parData)
        {
            int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
            try
            {
                if (parData.MatrizProcesosDetalleID == 0)
                {
                    var obj = new { ProductoID = ProductoID };
                    var matrizProcesos = await DBContext.database.QueryAsync<MatrizProcesos>("WHERE ProductoID = @ProductoID ", obj).FirstOrDefaultAsync();
                    var matrizProcesosDetalle = new MatrizProcesosDetalle()
                    {
                        MatrizProcesosID = matrizProcesos.MatrizProcesosID,
                        StatusProcesoID = parData.StatusProcesoID,
                        CapturaObligatoria = parData.CapturaObligatoria
                    };

                    await DBContext.database.InsertAsync<MatrizProcesosDetalle>(matrizProcesosDetalle);
                    await DBContext.Destroy();
                    return Ok(await ObjectSerie(matrizProcesosDetalle));
                }
                else
                {
                    var matrizProcesosDetalle = await DBContext.database.SingleByIdAsync<MatrizProcesosDetalle>(parData.MatrizProcesosDetalleID);
                    matrizProcesosDetalle.CapturaObligatoria = parData.CapturaObligatoria;
                    await DBContext.database.UpdateAsync(matrizProcesosDetalle);
                    await DBContext.Destroy();
                    return Ok(await ObjectSerie(matrizProcesosDetalle));

                }
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("updateNotificacion")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Prospeccion.MatrizProcesosDetalle.updateNotificacion parData)
        {
            int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
            try
            {
                if (parData.MatrizProcesosDetalleID == 0)
                {
                    var obj = new { ProductoID = ProductoID };
                    var matrizProcesos = await DBContext.database.QueryAsync<MatrizProcesos>("WHERE ProductoID = @ProductoID ", obj).FirstOrDefaultAsync();
                    var matrizProcesosDetalle = new MatrizProcesosDetalle()
                    {
                        MatrizProcesosID = matrizProcesos.MatrizProcesosID,
                        StatusProcesoID = parData.StatusProcesoID,
                        Notificacion = parData.Notificacion
                    };

                    await DBContext.database.InsertAsync<MatrizProcesosDetalle>(matrizProcesosDetalle);
                    await DBContext.Destroy();
                    return Ok(await ObjectSerie(matrizProcesosDetalle));
                }
                else
                {
                    var matrizProcesosDetalle = await DBContext.database.SingleByIdAsync<MatrizProcesosDetalle>(parData.MatrizProcesosDetalleID);
                    matrizProcesosDetalle.Notificacion = parData.Notificacion;
                    await DBContext.database.UpdateAsync(matrizProcesosDetalle);
                    await DBContext.Destroy();
                    return Ok(await ObjectSerie(matrizProcesosDetalle));
                }
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("updateNotaObligatoria")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Prospeccion.MatrizProcesosDetalle.updateNotaObligatoria parData)
        {
            int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
            try
            {
                if (parData.MatrizProcesosDetalleID == 0)
                {
                    var obj = new { ProductoID = ProductoID };
                    var matrizProcesos = await DBContext.database.QueryAsync<MatrizProcesos>("WHERE ProductoID = @ProductoID ", obj).FirstOrDefaultAsync();
                    var matrizProcesosDetalle = new MatrizProcesosDetalle()
                    {
                        MatrizProcesosID = matrizProcesos.MatrizProcesosID,
                        StatusProcesoID = parData.StatusProcesoID,
                        NotaObligatoria = parData.NotaObligatoria
                    };

                    await DBContext.database.InsertAsync<MatrizProcesosDetalle>(matrizProcesosDetalle);
                    await DBContext.Destroy();
                    return Ok(await ObjectSerie(matrizProcesosDetalle));
                }
                else
                {
                    var matrizProcesosDetalle = await DBContext.database.SingleByIdAsync<MatrizProcesosDetalle>(parData.MatrizProcesosDetalleID);
                    matrizProcesosDetalle.NotaObligatoria = parData.NotaObligatoria;
                    await DBContext.database.UpdateAsync(matrizProcesosDetalle);
                    await DBContext.Destroy();
                    return Ok(await ObjectSerie(matrizProcesosDetalle));
                }
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }


        [HttpPost]
        [Route("updateDictamenObligatorio")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Prospeccion.MatrizProcesosDetalle.updateDictamenObligatorio parData)
        {
            int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
            try
            {
                if (parData.MatrizProcesosDetalleID == 0)
                {
                    var obj = new { ProductoID = ProductoID };
                    var matrizProcesos = await DBContext.database.QueryAsync<MatrizProcesos>("WHERE ProductoID = @ProductoID ", obj).FirstOrDefaultAsync();
                    var matrizProcesosDetalle = new MatrizProcesosDetalle()
                    {
                        MatrizProcesosID = matrizProcesos.MatrizProcesosID,
                        StatusProcesoID = parData.StatusProcesoID,
                        DictamenObligatorio = parData.DictamenObligatorio
                    };

                    await DBContext.database.InsertAsync<MatrizProcesosDetalle>(matrizProcesosDetalle);
                    await DBContext.Destroy();
                    return Ok(await ObjectSerie(matrizProcesosDetalle));
                }
                else
                {
                    var matrizProcesosDetalle = await DBContext.database.SingleByIdAsync<MatrizProcesosDetalle>(parData.MatrizProcesosDetalleID);
                    matrizProcesosDetalle.DictamenObligatorio = parData.DictamenObligatorio;
                    await DBContext.database.UpdateAsync(matrizProcesosDetalle);
                    await DBContext.Destroy();
                    return Ok(await ObjectSerie(matrizProcesosDetalle));
                }
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

        [HttpPost]
        [Route("ActivarMartriz")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ActivarMartriz(ConfiaWebApi.PeticionesRest.Prospeccion.MatrizProcesosDetalle.add parData)
        {
            int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
            try
            {
                var matrizProceso = new MatrizProcesos()
                {
                    ProductoID = ProductoID,
                    Activo = true
                };

                await DBContext.database.InsertAsync<MatrizProcesos>(matrizProceso);
                await DBContext.Destroy();
                return Ok(matrizProceso);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex);
            }
        }

    }
}


