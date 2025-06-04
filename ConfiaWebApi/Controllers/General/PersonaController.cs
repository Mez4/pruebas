using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Catalogos;
using DBContext.DBConfia.Sistema;
using System.Collections;
using DBContext.DBConfia.Seguridad;

namespace ConfiaWebApi.Controllers.General
{
    [Authorize]
    [ApiController]
    [Route("api/General/[controller]")]
    public class PersonaController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public PersonaController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }

        // [HttpGet]
        // [Route("show")]
        // [Authorize]
        // // [Code.TProteccionProducto]
        // public async Task<IActionResult> Obtener()
        // {
        //     var tiposMovs = await DBContext.database.FetchAsync<DBContext.DBConfia.General.Personas_VW>();

        //     try
        //     {

        //         var result = tiposMovs.Select(c => new
        //         {
        //             personaID = c.PersonaID,
        //             nombre = c.Nombre,
        //             apellidoPaterno = c.ApellidoPaterno,
        //             apellidoMaterno = c.ApellidoMaterno,
        //             usuarioID = c.CreacionUsuarioID
        //         }).ToArray();
        //         await DBContext.Destroy();
        //         return Ok(result);
        //     }

        //     catch (Exception error)
        //     {
        //         await DBContext.Destroy();
        //         return BadRequest(error.Message);
        //     }
        // }

        [HttpPost]
        [Route("show")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerAsyncrono(PeticionesRest.General.Personas.Persona parData)
        {
            parData.NombreCompleto += "%";
            var tiposMovs = await DBContext.database.QueryAsync<DBContext.DBConfia.General.Personas_VW>("WHERE NombreCompleto LIKE @0", parData.NombreCompleto).ToArrayAsync();

            try
            {
                var result = tiposMovs.Select(c => new
                {
                    PersonaID = c.PersonaID,
                    NombreCompleto = c.NombreCompleto,
                }).ToArray();
                await DBContext.Destroy();
                return Ok(result);
            }

            catch (Exception error)
            {
                await DBContext.Destroy();
                return BadRequest(error.Message);
            }
        }

        [HttpPost]
        [Route("obtenerProducto")]
        [Authorize]
        public async Task<IActionResult> ObtenerProducto(ConfiaWebApi.PeticionesRest.Creditos.Grupos.Get parData)
        {
            try
            {
                var productId = await DBContext.database.QueryAsync<DBContext.DBConfia.General.SucursalesProductos_VW>("WHERE SucursalID = @0", parData.SucursalID).SingleOrDefaultAsync();
                return Ok(productId);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return BadRequest(ex.Message);
            }
        }



        //[HttpPost]
        //[Route("get")]
        //[Authorize]
        //[Code.RoleSecurityAttributes(new string[] { "USUARIO_ADMIN" })]
        //public async Task<IActionResult> Get(PeticionesRest.General.Persona.Get parData)

        //{
        //    if (parData.Id != 0)
        //    {
        //        try
        //        {
        //            return Ok(await DBContext.database.SingleByIdAsync<Personas>(parData.Id));
        //        }
        //        catch (Exception ex)
        //        {
        //            return NotFound(ex.Message);
        //        }

        //    }
        //    else
        //    {
        //        try
        //        {
        //            var Personas = await DBContext.database.FetchAsync<Personas>();

        //            ArrayList res = new();

        //            foreach (var Persona in Personas)
        //            {
        //                var Asentamiento = await DBContext.database.SingleByIdAsync<Asentamientos>(Persona.AsentamientoID);

        //                res.Add(new
        //                {
        //                    Persona.PersonaID,
        //                    //...Datos restantes
        //                    Persona.NombreCompleto,
        //                    Asentamiento,
        //                });
        //            }

        //            return Ok(res);
        //        }
        //        catch (Exception ex)
        //        {
        //            return BadRequest(ex.Message);
        //        }
        //    }
        //}

    }
}
