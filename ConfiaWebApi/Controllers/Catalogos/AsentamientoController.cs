using DBContext.DBConfia;
using DBContext.DBConfia.Catalogos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.Catalogos
{
    [Authorize]
    [ApiController]
    [Route("api/Catalogos/[controller]")]
    public class AsentamientoController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public AsentamientoController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        // [Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(PeticionesRest.Catalogos.Asentamiento.Get parData)
        {
            if (parData.EstadoId != 0 && parData.MunicipioId != 0)
            {
                var res = await DBContext.database.QueryAsync<Asentamientos>("WHERE (id_estado = @0) AND (id_municipio = @1) AND (CodigoPostal = @2 OR @2 = 0) AND (id_tipo_asentamiento = @3 OR @3 = 0)", parData.EstadoId, parData.MunicipioId, parData.CodigoPostalID, parData.TipoAsentamientoId).ToArrayAsync();
                await DBContext.Destroy();
                return Ok(res);
            }

            if (parData.AsentamientoID != 0)
            {
                try
                {
                    var res = await DBContext.database.SingleByIdAsync<Asentamientos>(parData.AsentamientoID);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            var resM = await DBContext.database.FetchAsync<Asentamientos>();
            await DBContext.Destroy();
            return Ok(resM);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        // [Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(PeticionesRest.Catalogos.Asentamiento.Add parData)
        {
            try
            {
                var EstadosPais = await DBContext.database.SingleByIdAsync<EstadosPais>(parData.id_estado);
                parData.Estado = EstadosPais.estadoPaisNombre;

                var Ciudad = await DBContext.database.SingleByIdAsync<CiudadesEstado>(parData.id_ciudad);
                parData.Ciudad = Ciudad.ciudadEstadoNombre;
                parData.Municipio = Ciudad.ciudadEstadoNombre;

                var Asentamientos = new Asentamientos()
                {
                    CodigoPostal = parData.CodigoPostal,
                    Asentamiento = parData.Asentamiento,
                    Tipo_asenta = parData.Tipo_asenta,
                    Municipio = parData.Municipio,
                    Estado = parData.Estado,
                    Ciudad = parData.Ciudad,
                    oficina_postal = parData.oficina_postal,
                    id_estado = parData.id_estado,
                    id_oficina_postal = parData.id_oficina_postal,
                    c_CP = parData.c_CP,
                    id_tipo_asentamiento = parData.id_tipo_asentamiento,
                    id_municipio = parData.id_municipio,
                    id_asentamiento = parData.id_asentamiento,
                    zona = parData.zona,
                    id_ciudad = parData.id_ciudad
                };
                await DBContext.database.InsertAsync(Asentamientos);
                await DBContext.Destroy();
                return Ok(Asentamientos);
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
        // [Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Update(PeticionesRest.Catalogos.Asentamiento.Update parData)
        {
            try
            {
                var EstadosPais = await DBContext.database.SingleByIdAsync<EstadosPais>(parData.id_estado);
                parData.Estado = EstadosPais.estadoPaisNombre;

                // VALIDAR !!!
                var Ciudad = await DBContext.database.SingleByIdAsync<EstadosPais>(parData.id_ciudad);
                parData.Ciudad = parData.Ciudad; //  Ciudad.ciudadEstadoNombre;
                parData.Municipio = parData.Municipio; // Ciudad.ciudadEstadoNombre;

                var Asentamientos = await DBContext.database.SingleByIdAsync<Asentamientos>(parData.AsentamientoID);
                Asentamientos.CodigoPostal = parData.CodigoPostal;
                Asentamientos.Asentamiento = parData.Asentamiento;
                Asentamientos.Tipo_asenta = parData.Tipo_asenta;
                Asentamientos.Municipio = parData.Municipio;
                Asentamientos.Estado = parData.Estado;
                Asentamientos.Ciudad = parData.Ciudad;
                Asentamientos.oficina_postal = parData.oficina_postal;
                Asentamientos.id_estado = parData.id_estado;
                Asentamientos.id_oficina_postal = parData.id_oficina_postal;
                Asentamientos.c_CP = parData.c_CP;
                Asentamientos.id_tipo_asentamiento = parData.id_tipo_asentamiento;
                Asentamientos.id_municipio = parData.id_municipio;
                Asentamientos.id_asentamiento = parData.id_asentamiento;
                Asentamientos.zona = parData.zona;
                Asentamientos.id_ciudad = parData.id_ciudad;

                await DBContext.database.UpdateAsync(Asentamientos);
                await DBContext.Destroy();
                return Ok(Asentamientos);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}
