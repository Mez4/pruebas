using DBContext.DBConfia;
using DBContext.DBConfia.Catalogos;
using DBContext.DBConfia.Prospeccion;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.AppProspeccion
{
    [Authorize]
    [ApiController]
    [Route("api/AppProspeccion/[controller]")]
    public class AppCatalogosController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public AppCatalogosController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("getCatalogoSexos")]
        [Authorize]
        public async Task<IActionResult> GetCatalogoSexos(ConfiaWebApi.PeticionesRest.Catalogos.Sexos.get parData)
        {
            try
            {
                var catalogoSexos = await DBContext.database.FetchAsync<Sexos>();
                var resp = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = catalogoSexos
                };

                await DBContext.Destroy();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { error = "Error al obtener el catalogo de sexos " }
                });
            }
        }

        [HttpPost]
        [Route("getEstados")]
        [Authorize]
        public async Task<IActionResult> GetEstados(ConfiaWebApi.PeticionesRest.Catalogos.EstadosPais.Get parData)
        {
            try
            {
                var estadosPais = await DBContext.database.FetchAsync<EstadosPais>();
                var resp = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = estadosPais
                };

                await DBContext.Destroy();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { error = "Error al obtener los estados " }
                });
            }
        }

        [HttpPost]
        [Route("getDireccionByCP")]
        [Authorize]
        public async Task<IActionResult> GetDireccionByCP(PeticionesRest.Catalogos.Asentamiento.GetbyCP parData)
        {
            try
            {

                var data = await DBContext.database.FetchAsync<Asentamientos>("WHERE (CodigoPostal = @CodigoPostal)", parData);

                var res = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data
                };

                await DBContext.Destroy();

                return Ok(res);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { }
                });
            }

        }

        [HttpPost]
        [Route("getOcupaciones")]
        [Authorize]
        public async Task<IActionResult> GetOcupaciones(ConfiaWebApi.PeticionesRest.Catalogos.Ocupacion.Get parData)
        {
            try
            {
                var ocupaciones = await DBContext.database.FetchAsync<Ocupaciones>();
                var resp = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = ocupaciones
                };

                await DBContext.Destroy();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { error = "Error al obtener las ocupaciones " }
                });
            }
        }

        [HttpPost]
        [Route("getEstadosCiviles")]
        [Authorize]
        public async Task<IActionResult> GetEstadosCiviles(ConfiaWebApi.PeticionesRest.Catalogos.EstadoCivil.Get parData)
        {
            try
            {
                var estadosCiviles = await DBContext.database.FetchAsync<EstadosCiviles>();
                var resp = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = estadosCiviles
                };

                await DBContext.Destroy();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { error = "Error al obtener las ocupaciones " }
                });
            }
        }
        [HttpPost]
        [Route("getDistribudoresTipos")]
        [Authorize]
        public async Task<IActionResult> GetDistribudoresTipos(PeticionesRest.Catalogos.DistribuidoresTipos.Get parData)
        {
            try
            {
                var distribudoresTipos = await DBContext.database.FetchAsync<DistribuidoresTipos>();
                var resp = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = distribudoresTipos
                };

                await DBContext.Destroy();
                return Ok(resp);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { error = "Error al obtener info " }
                });
            }
        }

        [HttpPost]
        [Route("getEmpresasExperiencia")]
        [Authorize]
        public async Task<IActionResult> GetEmpresasExperiencia(ConfiaWebApi.PeticionesRest.Prospeccion.EmpresasExperiencia.get parData)
        {
            try
            {
                var empresas = await DBContext.database.FetchAsync<EmpresasExperiencia>("ORDER BY Descripcion ASC");
                var resp = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    data = empresas
                };

                await DBContext.Destroy();
                return Ok(resp);
            }
            catch (System.Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { error = "Error al obtener info " }
                });
            }
        }

        //Verificar si CURP es Habilitada
        [HttpPost]
        [Route("getCURPHabilitada")]
        [Authorize]
        public async Task<IActionResult> GetCURPHabilitada()
        {
            try
            {
                //Solo obtener el primer registro
                var curpHabilitada = await DBContext.database.FirstOrDefaultAsync<VariablesGlobales>("WHERE (varName = 'CURP_HABILITADA')");

                var resp = new
                {
                    resultCode = 0,
                    resultDesc = "OK.",
                    msj = "CURP Habilitada",
                    data = curpHabilitada.varValue.ToString()
                };

                await DBContext.Destroy();
                return Ok(resp);
            }
            catch (System.Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(new
                {
                    resultCode = -1,
                    resultDesc = ex.Message,
                    data = new { error = "Error al obtener info" }
                });
            }
        }


    }
}