using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.Distribuidores;
using System.Collections;
using DBContext.DBConfia.General;
using DBContext.DBConfia.AppVale;
using DBContext.DBConfia.Creditos;
using DBContext.DBConfia.Cortes;
using DBContext.DBConfia.Seguridad;
using Clientes = DBContext.DBConfia.Creditos.Clientes;
using Distribuidor = DBContext.DBConfia.Distribuidores.Clientes;

namespace ConfiaWebApi.Controllers.AppValeActivacionDV
{
    [ApiController]
    [Route("api/AppVale/[controller]")]
    public class AppValeActivacionDV : ControllerBase
    {
        private DBConfiaContext DBContext;

        public AppValeActivacionDV(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }


        [HttpPost]
        [Route("obtenerDatosDV")]
        
        public async Task<IActionResult> Get(PeticionesRest.AppValePeticiones.AppValeActivacionDV.DatosDV parData)
        {
            try
            {
                bool existe = false;

                var dvExiste = await DBContext.database.QueryAsync<Distribuidores_VW>("WHERE TelefonoMovil = @0", parData.telefono).FirstOrDefaultAsync();
                var usuarioVW = await DBContext.database.QueryAsync<UsuariosVW>("WHERE DistribuidorID = @0", dvExiste.DistribuidorID).FirstOrDefaultAsync();

                if (usuarioVW != null)
                {
                    existe = true;
                }

                if (existe)
                {
                    await DBContext.Destroy();
                    return BadRequest("Socia ya registrada");
                }
                else
                {
                    var persona = await DBContext.database.QueryAsync<Personas_VW>("WHERE TelefonoMovil = @0", parData.telefono).FirstOrDefaultAsync();
                    if (persona == null)
                    {
                        await DBContext.Destroy();
                        return BadRequest("No se encontro la socia");
                    }
                    else
                    {
                        var distribuidor = await DBContext.database.QueryAsync<Distribuidores_VW>("WHERE PersonaID = @0", persona.PersonaID).FirstOrDefaultAsync();
                        if (distribuidor == null)
                        {
                            await DBContext.Destroy();
                            return BadRequest("No se encontro la socia");
                        }
                        else
                        {
                            var res = new
                            {
                                resultCode = 0,
                                resultDesc = "OK.",
                                data = persona
                            };
                            await DBContext.Destroy();
                            return Ok(res);
                        }

                    }
                }


            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }


        }
    }
}
