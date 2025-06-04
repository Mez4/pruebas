using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Distribuidores;
using DBContext.DBConfia.Prospeccion;
using DBContext.DBConfia.Sistema;

namespace ConfiaWebApi.Controllers.Distribuidores
{
    [Authorize]
    [ApiController]
    [Route("api/Distribuidores/[controller]")]
    public class NivelController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public NivelController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.Distribuidores.Nivel.Get parData)
        {
            if (parData.Id != 0)
            {
                try
                {
                    var res = await DBContext.database.SingleByIdAsync<Niveles>(parData.Id);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            var res1 = await DBContext.database.FetchAsync<Niveles>();
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("getNB")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> getNB(PeticionesRest.Distribuidores.Nivel.Get parData)
        {
            if (parData.Id != 0)
            {
                try
                {
                    var res = await DBContext.database.SingleByIdAsync<NivelOrigen_Buro_LC_VW>(parData.Id);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            var res1 = await DBContext.database.FetchAsync<NivelOrigen_Buro_LC_VW>();
            await DBContext.Destroy();
            return Ok(res1);
        }
        [HttpPost]
        [Route("getNivelesO")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetNivelesO(PeticionesRest.Prospeccion.NivelesOrigen.Get parData)
        {
            if (parData.Id != 0)
            {
                try
                {
                    var res = await DBContext.database.SingleByIdAsync<NivelesOrigen>(parData.Id);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            // if (parData.Cat == 0)
            // {
            //     try
            //     {
            //         var res = await DBContext.database.FetchAsync<NivelesOrigen>("Where Activo = 1 ");
            //         await DBContext.Destroy();
            //         return Ok(res);
            //     }
            //     catch (Exception ex)
            //     {
            //         await DBContext.Destroy();
            //         return NotFound(ex.Message);
            //     }
            // }
            var res1 = await DBContext.database.FetchAsync<NivelesOrigen>("order by 1");
            await DBContext.Destroy();
            return Ok(res1);
        }

        [HttpPost]
        [Route("addNivelesO")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> AddNivelesO(PeticionesRest.Prospeccion.NivelesOrigen.AddNivel parData)
        {
            try
            {
                var Niveles = new NivelesOrigen()
                {
                    DistribuidorNivel = parData.DistribuidorNivel,
                    PorcComisionBase = parData.PorcComisionBase,
                    CapitalColocadoMinimo = parData.CapitalColocadoMinimo,
                    CapitalColocadoMaximo = parData.CapitalColocadoMaximo,
                    ImporteProteccionSaldo = parData.ImporteProteccionSaldo,
                    importeMaxCanje = parData.importeMaxCanje,
                    maximoPrestamoPersonal = parData.maximoPrestamoPersonal,
                    maximoImporteCanjeCliente = parData.maximoImporteCanjeCliente,
                    maximoImporteCanjeAval = parData.maximoImporteCanjeAval,
                    Activo = parData.Activo
                };
                await DBContext.database.InsertAsync<NivelesOrigen>(Niveles);
                await DBContext.Destroy();
                return Ok(Niveles);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }

        }

        [HttpPost]
        [Route("updNivelesO")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> UpdNivelesO(PeticionesRest.Prospeccion.NivelesOrigen.UpdNivel parData)
        {
            try
            {
                var Niveles = await DBContext.database.SingleByIdAsync<NivelesOrigen>(parData.DistribuidorNivelID);


                Niveles.DistribuidorNivel = parData.DistribuidorNivel;
                Niveles.PorcComisionBase = parData.PorcComisionBase;
                Niveles.CapitalColocadoMinimo = parData.CapitalColocadoMinimo;
                Niveles.CapitalColocadoMaximo = parData.CapitalColocadoMaximo;
                Niveles.ImporteProteccionSaldo = parData.ImporteProteccionSaldo;
                Niveles.importeMaxCanje = parData.importeMaxCanje;
                Niveles.maximoPrestamoPersonal = parData.maximoPrestamoPersonal;
                Niveles.maximoImporteCanjeCliente = parData.maximoImporteCanjeCliente;
                Niveles.maximoImporteCanjeAval = parData.maximoImporteCanjeAval;
                Niveles.Activo = parData.Activo;
                await DBContext.database.UpdateAsync(Niveles);
                await DBContext.Destroy();
                return Ok(Niveles);

            }

            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }

        }

    }
}
