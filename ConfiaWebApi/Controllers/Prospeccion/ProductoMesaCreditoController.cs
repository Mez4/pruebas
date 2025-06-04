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
    public class ProductoMesaCreditoController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public ProductoMesaCreditoController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        protected async Task<object> ObjectProductoMesa(ProductoMesaCredito productoMesaCredito)
        {
            var res = new
            {
                productoMesaCredito.ProductoMesaCreditoID,
                mesaCredito = (await productoMesaCredito.CH__MESA_CREDITO(DBContext)).FirstOrDefault(),
                producto = (await productoMesaCredito.CH__PRODUCTO(DBContext)).FirstOrDefault(),
                productoMesaCredito.Activo

            };
            return res;
        }
        protected async Task<object> ObjectMesaCredito(DBContext.DBConfia.Prospeccion.MesaCredito mesacredito)
        {
            var res = new
            {

                mesacredito.MesaCreditoID,
                mesacredito.Nombre,
                mesacredito.Clave,
                mesacredito.Activo

            };
            await DBContext.Destroy();
            return res;
        }

        protected async Task<object> ObjectProducto(DBContext.DBConfia.Creditos.Productos producto)
        {
            var res = new
            {

                producto.ProductoID,
                producto.Producto

            };
            await DBContext.Destroy();
            return res;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Prospeccion.ProductoMesaCredito.get parData)
        {
            if (parData.id != 0)
            {
                var prodMesa = await DBContext.database.SingleByIdAsync<ProductoMesaCredito>(parData.id);
                var res = await ObjectProductoMesa(prodMesa);
                await DBContext.Destroy();
                return Ok(res);
            }

            List<object> respList = new List<object>();
            var ListSeries = await DBContext.database.FetchAsync<ProductoMesaCredito>();
            foreach (var item in ListSeries)
            {
                respList.Add(await ObjectProductoMesa(item));
            }
            await DBContext.Destroy();
            return Ok(respList);
        }



        [HttpPost]
        [Route("getMesaCredito")]
        [Authorize]
        [Code.TProteccionProducto]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> GetMesaCredito(ConfiaWebApi.PeticionesRest.Prospeccion.MesaCredito.get parData)
        {
            try
            {
                List<object> respList = new List<object>();
                var ListSeries = await DBContext.database.FetchAsync<DBContext.DBConfia.Prospeccion.MesaCredito>();
                foreach (var item in ListSeries)
                {
                    respList.Add(await ObjectMesaCredito(item));
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
        [Route("getProductos")]
        [Authorize]
        [Code.TProteccionProducto]
        [ApiExplorerSettings(IgnoreApi = true)]
        public async Task<IActionResult> GetProductos(ConfiaWebApi.PeticionesRest.Creditos.Producto.Get parData)
        {
            try
            {
                List<object> respList = new List<object>();
                var ListSeries = await DBContext.database.FetchAsync<DBContext.DBConfia.Creditos.Productos>();
                foreach (var item in ListSeries)
                {
                    respList.Add(await ObjectProducto(item));
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
        public async Task<IActionResult> add(ConfiaWebApi.PeticionesRest.Prospeccion.ProductoMesaCredito.add parData)
        {
            try
            {
                var productoMesaCredito = new ProductoMesaCredito()
                {

                    MesaCreditoID = parData.MesaCreditoID,
                    ProductoID = parData.ProductoID,
                    Activo = parData.Activo
                };
                await DBContext.database.InsertAsync<ProductoMesaCredito>(productoMesaCredito);
                var res = await ObjectProductoMesa(productoMesaCredito);
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
        public async Task<IActionResult> update(ConfiaWebApi.PeticionesRest.Prospeccion.ProductoMesaCredito.update parData)
        {
            try
            {

                var productoMesaCredito = await DBContext.database.SingleByIdAsync<ProductoMesaCredito>(parData.ProductoMesaCreditoID);
                productoMesaCredito.MesaCreditoID = parData.MesaCreditoID;
                productoMesaCredito.ProductoID = parData.ProductoID;
                productoMesaCredito.Activo = parData.Activo;
                await DBContext.database.UpdateAsync(productoMesaCredito);
                var res = await ObjectProductoMesa(productoMesaCredito);
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
