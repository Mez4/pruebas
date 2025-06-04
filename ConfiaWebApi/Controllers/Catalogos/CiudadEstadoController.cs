using DBContext.DBConfia;
using DBContext.DBConfia.Catalogos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.Catalogos
{
    [Authorize]
    [ApiController]
    [Route("api/Catalogos/[controller]")]
    public class CiudadEstadoController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public CiudadEstadoController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Catalogos.Ciudad.Get parData)
        {

            if (parData.Id != 0)
            {
                try
                {
                    //return Ok(await DBContext.database.SingleByIdAsync<CiudadesEstado>(parData.Id));
                    //var Ciudad = await DBContext.database.QueryAsync<CiudadesEstado>("WHERE ciudadEstadoId=@Id", parData).FirstOrDefaultAsync();
                    //var edo = await Ciudad.CH__ESTADO_PAIS(DBContext);

                    var Ciudad = await DBContext.database.QueryAsync<CiudadesEstado>("WHERE ciudadEstadoId=@Id", parData).FirstOrDefaultAsync();
                    var estado = (await Ciudad.CH__ESTADO_PAIS(DBContext)).FirstOrDefault();

                    var res = new
                    {
                        Ciudad.ciudadEstadoId,
                        Ciudad.ciudadEstadoNombre,
                        Ciudad.estadoPaisId,
                        estado
                    };

                    //var Ciudad = await DBContext.database.QueryAsync<CiudadesEstado>("SELECT c.ciudadEstadoId, c.ciudadEstadoNombre, c.estadoPaisId, e.estadoPaisNombre FROM Catalogos.CiudadesEstado AS c INNER JOIN Catalogos.EstadosPais AS e ON c.estadoPaisId = e.estadoPaisId WHERE(c.ciudadEstadoId = @Id)", parData).FirstOrDefaultAsync();

                    //return Ok(Ciudad);
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            else
            {
                try
                {

                    //var Ciudad = await DBContext.database.Query<Ciudadesestado>().Include(i => i.Estadospais)
                    //        .ToListAsync();

                    //var Ciudad = await DBContext.database.QueryAsync<CiudadesEstado>("SELECT c.ciudadEstadoId, c.ciudadEstadoNombre, c.estadoPaisId, e.estadoPaisNombre FROM Catalogos.CiudadesEstado AS c INNER JOIN Catalogos.EstadosPais AS e ON c.estadoPaisId = e.estadoPaisId", parData).ToListAsync();

                    //return Ok(Ciudad);

                    //var Ciudad = await DBContext.database.FetchAsync<CiudadesEstado>();

                    var Ciudad = await DBContext.database.FetchAsync<CiudadesEstado>();

                    // Op 1
                    //ArrayList res = new();

                    //Ciudad.ForEach(async T =>
                    //      {
                    //          res.Add(new
                    //          {
                    //              T.ciudadEstadoId,
                    //              T.ciudadEstadoNombre,
                    //              T.estadoPaisId,
                    //              estado = (await T.CH__ESTADO_PAIS(this.DBContext)).FirstOrDefault()
                    //          });
                    //      }
                    //  );

                    // Op 2
                    //var res = Ciudad.Select(async T =>
                    //{
                    //    return new
                    //    {
                    //        T.ciudadEstadoId,
                    //        T.ciudadEstadoNombre,
                    //        T.estadoPaisId,
                    //        estado = (await T.CH__ESTADO_PAIS(this.DBContext)).FirstOrDefault()
                    //    };
                    //});

                    // Op 3
                    ArrayList res = new();

                    foreach (var T in Ciudad)
                    {
                        res.Add(new
                        {
                            T.ciudadEstadoId,
                            T.ciudadEstadoNombre,
                            T.estadoPaisId,
                            estado = (await T.CH__ESTADO_PAIS(this.DBContext)).FirstOrDefault()
                        });
                    }
                    await DBContext.Destroy();
                    return Ok(res);
                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return BadRequest(ex.Message);
                }
            }

        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Add(ConfiaWebApi.PeticionesRest.Catalogos.Ciudad.Add parData)
        {
            try
            {
                var Ciudad = new CiudadesEstado() { ciudadEstadoNombre = parData.ciudadEstadoNombre, estadoPaisId = parData.estadoPaisId };
                await DBContext.database.InsertAsync(Ciudad);
                var estado = (await Ciudad.CH__ESTADO_PAIS(DBContext)).FirstOrDefault();
                var res = new
                {
                    Ciudad.ciudadEstadoId,
                    Ciudad.ciudadEstadoNombre,
                    Ciudad.estadoPaisId,
                    estado
                };
                await DBContext.Destroy();
                return Ok(res);

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
        public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Catalogos.Ciudad.Update parData)
        {
            try
            {
                var Ciudad = await DBContext.database.SingleByIdAsync<CiudadesEstado>(parData.ciudadEstadoId);
                Ciudad.ciudadEstadoNombre = parData.ciudadEstadoNombre;
                Ciudad.estadoPaisId = parData.estadoPaisId;
                await DBContext.database.UpdateAsync(Ciudad);
                var estado = (await Ciudad.CH__ESTADO_PAIS(DBContext)).FirstOrDefault();
                var res = new
                {
                    Ciudad.ciudadEstadoId,
                    Ciudad.ciudadEstadoNombre,
                    Ciudad.estadoPaisId,
                    estado
                };
                await DBContext.Destroy();
                return Ok(res);
                //return Ok(Ciudad);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }
    }
}
