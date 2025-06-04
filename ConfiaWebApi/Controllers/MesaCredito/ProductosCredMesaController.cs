using DBContext.DBConfia;
using DBContext.DBConfia.MesaCredito;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.MesaCredito
{
    [Authorize]
    [ApiController]
    [Route("api/MesaCredito/[controller]")]
    public class ProductosCredMesaController : ControllerBase
    {
        private DBConfiaContext DBContext;


        public ProductosCredMesaController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(PeticionesRest.MesaCredito.ProductosCredMesa.Get parData)
        {
            if (parData.ProdCredMesaID != 0)
            {
                try
                {
                    var res = await DBContext.database.SingleByIdAsync<ProductosCredMesa>(parData.ProdCredMesaID);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            var res1 = await DBContext.database.FetchAsync<ProductosCredMesa>();
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.MesaCredito.ProductosCredMesa.Add parData)
        {
            try
            {
                var productoscredmesa = new ProductosCredMesa()
                {

                    MesaCreditoID = parData.MesaCreditoID,
                    ProductoID = parData.ProductoID,
                    Activo = parData.Activo
                };
                await DBContext.database.InsertAsync(productoscredmesa);
                await DBContext.Destroy();
                return Ok(productoscredmesa);
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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.MesaCredito.ProductosCredMesa.Update parData)
        {
            try
            {
                var productoscredmesa = await DBContext.database.SingleByIdAsync<ProductosCredMesa>(parData.ProdCredMesaID);
                productoscredmesa.ProdCredMesaID = parData.ProdCredMesaID;
                productoscredmesa.MesaCreditoID = parData.MesaCreditoID;
                productoscredmesa.ProductoID = parData.ProductoID;
                productoscredmesa.Activo = parData.Activo;

                await DBContext.database.UpdateAsync(productoscredmesa);
                await DBContext.Destroy();
                return Ok(productoscredmesa);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}