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

namespace ConfiaWebApi.Controllers.Distribuidores
{
    [Authorize]
    [ApiController]
    [Route("api/Distribuidores/[controller]")]
    public class DistribuidoresClienteController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public DistribuidoresClienteController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }


        [HttpPost]
        [Route("getDist")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetDist(PeticionesRest.Distribuidores.DistribuidoresCliente.Get parData)
        {
            if (parData.Nombre != null)
            {
                try
                {
                    parData.Nombre += "%";
                    //return Ok(await DBContext.database.FetchAsync<Personas_VW>("SELECT TOP (100) * FROM General.Personas_VW AS p INNER JOIN Distribuidores.Clientes AS d ON p.PersonaID = d.PersonaID WHERE(NombreCompleto LIKE @Nombre) AND (d.DistribuidorID = @DistribuidorID) AND (d.EsttausId = 1)", parData));

                    var Clientes = await DBContext.database.FetchAsync<Personas_VW>("SELECT TOP (100) p.PersonaID, Nombre, ApellidoPaterno, ApellidoMaterno, NombreCompleto, FechaNacimiento, LugarNacimiento, CURP, RFC, SexoID, Sexo, EstadoCivilID, EstadoCivil, Escolaridad, IngresosMensuales, DependientesEconomicos, TelefonoDomicilio, TelefonoMovil, CorreoElectronico, NombreConyuge FROM General.Personas_VW AS p INNER JOIN Creditos.GruposDistribuidores AS d ON p.PersonaID = d.DistribuidorID WHERE(NombreCompleto LIKE @Nombre) AND (d.DistribuidorID = @DistribuidorID OR @DistribuidorID = 0) GROUP BY p.PersonaID, Nombre, ApellidoPaterno, ApellidoMaterno, NombreCompleto, FechaNacimiento, LugarNacimiento, CURP, RFC, SexoID, Sexo, EstadoCivilID, EstadoCivil, Escolaridad, IngresosMensuales, DependientesEconomicos, TelefonoDomicilio, TelefonoMovil, CorreoElectronico, NombreConyuge", parData);

                    ArrayList res = new();

                    foreach (var Cliente in Clientes)
                    {
                        var PersonaDireccion = await DBContext.database.QueryAsync<PersonasDirecciones>("WHERE  (PersonaID = @PersonaID)", Cliente).FirstOrDefaultAsync();

                        Direcciones_VW Direccion;

                        if (PersonaDireccion != null)
                        {
                            Direccion = await DBContext.database.QueryAsync<Direcciones_VW>("WHERE  (DireccionID = @DireccionID)", PersonaDireccion).FirstOrDefaultAsync();
                        }
                        else
                        {
                            Direccion = new Direcciones_VW { };
                        }

                        res.Add(new
                        {
                            Cliente.PersonaID,
                            Cliente.Nombre,
                            Cliente.ApellidoPaterno,
                            Cliente.ApellidoMaterno,
                            Cliente.NombreCompleto,
                            Cliente.FechaNacimiento,
                            Cliente.LugarNacimiento,
                            Cliente.CURP,
                            Cliente.RFC,
                            Cliente.SexoID,
                            Cliente.Sexo,
                            Cliente.EstadoCivilID,
                            Cliente.EstadoCivil,
                            Cliente.Escolaridad,
                            Cliente.IngresosMensuales,
                            Cliente.DependientesEconomicos,
                            Cliente.TelefonoDomicilio,
                            Cliente.TelefonoMovil,
                            Cliente.CorreoElectronico,
                            Cliente.NombreConyuge,
                            Direccion,
                        });
                    }

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
                    var res = await DBContext.database.FetchAsync<Personas_VW>();
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
    }
}
