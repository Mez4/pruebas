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
    public class MatrizProcesosController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public MatrizProcesosController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        protected async Task<object> ObjectSerie(MatrizProcesos datos)
        {
            var res = new
            {
                datos.MatrizProcesosID,
                datos.ProductoID,
                datos.Activo,
                producto = (await datos.CH__PRODUCTO(DBContext)).FirstOrDefault(),
            };
            return res;
        }


        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Prospeccion.MatrizProcesos.get parData)
        {
            if (parData.id != 0)
            {
                //return Ok(await DBContext.database.SingleByIdAsync<MatrizProcesos>(parData.id));

                var datos = await DBContext.database.SingleByIdAsync<MatrizProcesos>(parData.id);
                var res = await ObjectSerie(datos);
                await DBContext.Destroy();
                return Ok(res);
            }

            List<object> respList = new List<object>();
            var ListSeries = await DBContext.database.FetchAsync<MatrizProcesos>();
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
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Prospeccion.MatrizProcesos.add parData)
        {
            try
            {
                var matrizProcesos = new MatrizProcesos()
                {
                    ProductoID = parData.ProductoId,
                    Activo = parData.Activo,
                };

                //var matrizProcesos = new MatrizProcesos() { ProductoID = parData.ProductoId, Activo = parData.Activo };
                await DBContext.database.InsertAsync<MatrizProcesos>(matrizProcesos);
                await DBContext.Destroy();
                return Ok(await ObjectSerie(matrizProcesos));
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Prospeccion.MatrizProcesos.update parData)
        {
            try
            {
                var matrizProcesos = await DBContext.database.SingleByIdAsync<MatrizProcesos>(parData.MatrizProcesosID);
                matrizProcesos.ProductoID = parData.ProductoId;
                matrizProcesos.Activo = parData.Activo;
                await DBContext.database.UpdateAsync(matrizProcesos);
                var res = await ObjectSerie(matrizProcesos);
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
