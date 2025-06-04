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
using System.Collections.Generic;
using DBContext.DBConfia.Cortes;
using DBContext.DBConfia.Creditos;

using Path = System.IO.Path;
using System.IO;

namespace ConfiaWebApi.Controllers.Distribuidores
{
    [Authorize]
    [ApiController]
    [Route("api/Distribuidores/[controller]")]
    public class ClienteController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public ClienteController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }


        [HttpPost]
        [Route("getClienteById")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetClienteById(PeticionesRest.Creditos.Cliente.Get parData, [FromHeader(Name = "Id")] int Id)
        {
            if (parData.ClienteID != 0)
            {
                try
                {
                    var res = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.Clientes>("WHERE ClienteID = @0", parData.ClienteID).FirstOrDefaultAsync();
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
                    var Clientes = await DBContext.database.FetchAsync<DBContext.DBConfia.Creditos.Clientes_VW>();
                    ArrayList res = new();
                    foreach (var Cliente in Clientes)
                    {
                        res.Add(new
                        {
                            Cliente.ClienteID,
                            // Cliente.CanjeaVale,
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
        [Route("get")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Get(PeticionesRest.Distribuidores.Cliente.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            if (parData.Nombre != null)
            {
                try
                {
                    parData.ProductoID = producto;
                    parData.Nombre += "%";
                    //return Ok(await DBContext.database.FetchAsync<Personas_VW>("SELECT TOP (100) * FROM General.Personas_VW AS p INNER JOIN Distribuidores.Clientes AS d ON p.PersonaID = d.PersonaID WHERE(NombreCompleto LIKE @Nombre) AND (d.DistribuidorID = @DistribuidorID) AND (d.EsttausId = 1)", parData));

                    // var Clientes = await DBContext.database.FetchAsync<Personas_VW>("SELECT TOP (100) p.PersonaID, Nombre, ApellidoPaterno, ApellidoMaterno, NombreCompleto, FechaNacimiento, LugarNacimiento, CURP, RFC, SexoID, Sexo, EstadoCivilID, EstadoCivil, Escolaridad, IngresosMensuales, DependientesEconomicos, TelefonoDomicilio, TelefonoMovil, CorreoElectronico, NombreConyuge FROM General.Personas_VW AS p INNER JOIN Distribuidores.Clientes AS d ON p.PersonaID = d.PersonaID WHERE(NombreCompleto LIKE @Nombre) AND (d.DistribuidorID = @DistribuidorID OR @DistribuidorID = 0) AND (d.EsttausId = 1) GROUP BY p.PersonaID, Nombre, ApellidoPaterno, ApellidoMaterno, NombreCompleto, FechaNacimiento, LugarNacimiento, CURP, RFC, SexoID, Sexo, EstadoCivilID, EstadoCivil, Escolaridad, IngresosMensuales, DependientesEconomicos, TelefonoDomicilio, TelefonoMovil, CorreoElectronico, NombreConyuge", parData);

                    var Clientes = await DBContext.database.FetchAsync<DBContext.DBConfia.Creditos.Clientes_VW>("SELECT TOP (100) * FROM Distribuidores.Clientes_VW WHERE (ProductoID = @ProductoID) AND (NombreCompleto LIKE @Nombre) AND (DistribuidorID = @DistribuidorID OR @DistribuidorID = 0) AND (EsttausId = 1)", parData);

                    // ArrayList res = new();

                    // foreach (var Cliente in Clientes)
                    // {
                    //     var PersonaDireccion = await DBContext.database.QueryAsync<PersonasDirecciones>("WHERE  (PersonaID = @PersonaID)", Cliente).FirstOrDefaultAsync();

                    //     Direcciones_VW Direccion;

                    //     if (PersonaDireccion != null)
                    //     {
                    //         Direccion = await DBContext.database.QueryAsync<Direcciones_VW>("WHERE  (DireccionID = @DireccionID)", PersonaDireccion).FirstOrDefaultAsync();
                    //     }
                    //     else {
                    //         Direccion = new Direcciones_VW { };
                    //     }

                    //     res.Add(new
                    //     {
                    //         Cliente.PersonaID,
                    //         Cliente.Nombre,
                    //         Cliente.ApellidoPaterno,
                    //         Cliente.ApellidoMaterno,
                    //         Cliente.NombreCompleto,
                    //         Cliente.FechaNacimiento,
                    //         Cliente.LugarNacimiento,
                    //         Cliente.CURP,
                    //         Cliente.RFC,
                    //         Cliente.SexoID,
                    //         Cliente.Sexo,
                    //         Cliente.EstadoCivilID,
                    //         Cliente.EstadoCivil,
                    //         Cliente.Escolaridad,
                    //         Cliente.IngresosMensuales,
                    //         Cliente.DependientesEconomicos,
                    //         Cliente.TelefonoDomicilio,
                    //         Cliente.TelefonoMovil,
                    //         Cliente.CorreoElectronico,
                    //         Cliente.NombreConyuge,
                    //         Direccion, 
                    //     });
                    // }

                    await DBContext.Destroy();
                    return Ok(Clientes);

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

        [HttpPost]
        [Route("getDistinct")]
        [Authorize]
        public async Task<IActionResult> GetDistinct(PeticionesRest.Distribuidores.Cliente.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            try
            {
                parData.ProductoID = producto;
                parData.Nombre += "%";
                var Clientes = await DBContext.database.FetchAsync<DBContext.DBConfia.Creditos.Clientes_VW>("SELECT TOP (100) * FROM Distribuidores.Clientes_VW WHERE (ProductoID = @ProductoID) AND (NombreCompleto LIKE @Nombre) AND (DistribuidorID <> @DistribuidorID) AND (EsttausId = 1)", parData);
                await DBContext.Destroy();
                return Ok(Clientes);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("asignarClienteADistribuidor")]
        [Authorize]
        public async Task<IActionResult> AsignarClienteADistribuidor(PeticionesRest.Distribuidores.Cliente.Get parData, [FromHeader(Name = "ProductoID")] int ProductoID)
        {
            try
            {

                var cliente = await DBContext.database.QueryAsync<dynamic>("EXEC PA_VinculacionSocioCliente @0, @1 ,@2", parData.ClienteID, parData.DistribuidorID, ProductoID).FirstOrDefaultAsync();


                await DBContext.Destroy();
                return Ok(cliente);
            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("getbyid")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetById(PeticionesRest.Distribuidores.Cliente.GetSingle parData, [FromHeader(Name = "ProductoID")] int producto)
        {

            try
            {
                parData.ProductoID = producto;

                var Clientes = await DBContext.database.QueryAsync<DBContext.DBConfia.Creditos.Clientes_VW>("WHERE ClienteID = @ClienteID AND (ProductoID = @ProductoID) AND (DistribuidorID = @DistribuidorID OR @DistribuidorID = 0) AND (EsttausId = 1)", parData).SingleOrDefaultAsync();

                await DBContext.Destroy();

                return Ok(Clientes);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }


        }

        [HttpPost]
        [Route("cancelartempc")]
        [Authorize]
        //[Code.TProteccionProducto]
        public async Task<IActionResult> CancelarTempC(PeticionesRest.Distribuidores.Cliente.CancelarTempC parData)
        {
            try
            {
                var Cliente = await DBContext.database.SingleByIdAsync<DBContext.DBConfia.Creditos.Clientes>(parData.Id);
                Cliente.CanjeaVale = !Cliente.CanjeaVale;
                await DBContext.database.UpdateAsync(Cliente);
                await DBContext.Destroy();
                return Ok(Cliente);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }

        }

        [HttpPost]
        [Route("getbyzona")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetbyZona(PeticionesRest.Distribuidores.Cliente.Get parData, [FromHeader(Name = "ProductoID")] int producto)
        {
            if (parData.Nombre != null)
            {
                try
                {
                    parData.ProductoID = producto;
                    parData.Nombre += "%";

                    var Sucursal = await DBContext.database.SingleByIdAsync<Sucursales>(parData.SucursalID);

                    parData.ZonaID = Sucursal.ZonaID;

                    var Clientes = await DBContext.database.FetchAsync<ClientesZonas_VW>("SELECT TOP (100) * FROM Distribuidores.ClientesZonas_VW WHERE (ProductoID = @ProductoID) AND (ZonaID = @ZonaID) AND (NombreCompleto LIKE @Nombre) AND (DistribuidorID = @DistribuidorID OR @DistribuidorID = 0) AND (EsttausId = 1)", parData);

                    await DBContext.Destroy();
                    return Ok(Clientes);

                }
                catch (Exception ex)
                {
                    await DBContext.Destroy();
                    return NotFound(ex.Message);
                }

            }
            else
            {
                ArrayList res = new();
                return Ok(res);
            }
        }

        [HttpPost]
        [Route("getdistbyclienteid")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GeDisttByClienteId(PeticionesRest.Distribuidores.Cliente.GetSingle parData, [FromHeader(Name = "ProductoID")] int producto)
        {

            try
            {
                parData.ProductoID = producto;

                var Clientes = await DBContext.database.QueryAsync<ClientesZonas_VW>("WHERE (ClienteID = @ClienteID) AND (ProductoID = @ProductoID) AND (EsttausId = 1) AND (bloqueado = 0)", parData).SingleOrDefaultAsync();

                await DBContext.Destroy();

                return Ok(Clientes);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }


        }

        [HttpGet]
        [Route("getClienteLiquidado/{DistribuidorID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetClienteLiqudidado(int DistribuidorID)
        {
            try
            {

                var Clientes = await DBContext.database.QueryAsync<ClientesLiquidados_VW>("WHERE DistribuidorID = @0 ", DistribuidorID).ToArrayAsync();



                return Ok(Clientes);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }


        }

        [HttpGet]
        [Route("getCreditoActivo/{DistribuidorID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetCreditoActivo(int DistribuidorID)
        {
            try
            {
                var Clientes = await DBContext.database.QueryAsync<Creditos_VW>("WHERE DistribuidorID = @0 AND EstatusID = 'A' ", DistribuidorID).ToArrayAsync();
                var hh2 = 1;

                return Ok(Clientes);

            }
            catch (Exception ex)
            {
                await DBContext.Destroy();
                return NotFound(ex.Message);
            }
        }

        //PDF Créditos Activos
        // [HttpPost]
        // [Route("imprimir-creditos-activos")]
        // [Authorize]
        // [Code.TProteccionProducto]
        // public async Task<IActionResult> ImprimirCreditosActivos(ConfiaWebApi.PeticionesRest.Balances.MultiSaldos.Print parData)
        // {
        //     var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
        //     var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

        //     var tabla1 = "";
        //     var html = await System.IO.File.ReadAllTextAsync(Path.Combine(Directory.GetCurrentDirectory(), "DocumentosPDF", "Relacion", "Caratula.html"));

        //     tabla1 += "<tr>";
        //     tabla1 += "<th class=\"text-center fs-6\" style=\"width: 4% !important;\">" + "CVECON" + "</th>";
        //     tabla1 += "<th class=\"text-center fs-6\" style=\"width: 4% !important;\">" + "CANT" + "</th>";
        //     tabla1 += "<th class=\"text-center fs-6\" style=\"width: 10% !important;\">" + "CONCEPTO" + "</th>";
        //     tabla1 += "<th class=\"text-center fs-6\" style=\"width: 7% !important;\">" + "PRE. UNI." + "</th>";
        //     tabla1 += "<th class=\"text-center fs-6\" style=\"width: 4% !important;\">" + "PLAZOS" + "</th>";
        //     tabla1 += "<th class=\"text-center fs-6\" style=\"width: 7% !important;\">" + "IMPORTE" + "</th>";
        //     tabla1 += "<th class=\"text-center fs-6\" style=\"width: 7% !important;\">" + "COSTO U." + "</th>";
        //     tabla1 += "<th class=\"text-center fs-6\" style=\"width: 7% !important;\">" + "PAG X PLA" + "</th>";
        //     tabla1 += "<th class=\"text-center fs-6\" style=\"width: 14% !important;\">" + "OBSERVACION" + "</th>";
        //     tabla1 += "</tr>";

        //     html = html.Replace("@@SERVER", tabla1);
        //     return Ok();    
        // }
    }
}
