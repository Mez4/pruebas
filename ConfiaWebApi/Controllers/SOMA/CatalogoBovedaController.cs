
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Tesoreria;
using System.Collections;

namespace ConfiaWebApi.Controllers.Sistema
{
    [Authorize]
    [ApiController]
    [Route("api/SOMA/[controller]")]
    public class CatalogoBovedaController : ControllerBase
    {
        // TODO::

        /// <summary>
        /// </summary>
        private DBConfiaContext ConexionBD;

        /// <summary>
        /// Constructor del controlador
        /// </summary>
        /// <param name="_ConexionBD">Conexión de datos para el controlador</param>
        public CatalogoBovedaController(DBConfiaContext _ConexionBD) { this.ConexionBD = _ConexionBD; }

        [HttpGet]
        [Route("bovedas-psucursal/{sucursal}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerBovedasPSucursal(int sucursal)
        {
            try
            {
                var bovedas = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.BovedaXSucursal_VW>("WHERE SucursalID=@0  AND BovedaID NOT IN (SELECT BovedaID FROM Tesoreria.CatalogoCajas cc)", sucursal).ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(bovedas);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }
        [HttpGet]
        [Route("bovedas-psucursal2/{sucursal}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerBovedasPSucursal2(int sucursal)
        {
            try
            {
                var bovedas = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.BovedaXSucursal_VW>("WHERE SucursalID=@0 ", sucursal).ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(bovedas);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("obtener")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Obtener()
        {
            try
            {
                var bovedas = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Tesoreria.CatalogoBoveda_VW>();
                await ConexionBD.Destroy();
                return Ok(bovedas);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("obtener-csucursales")]
        [Authorize]
        public async Task<IActionResult> ObtenerBovedasConSucursales()
        {
            try
            {
                var bovedas = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.CatalogoBoveda_VW>("WHERE SucursalID IS NOT NULL").ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(bovedas);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("obtenerCat")]
        [Authorize]
        public async Task<IActionResult> Catalogo()
        {
            var res2 = await ConexionBD.database.FetchAsync<CatalogoBoveda>();
            await ConexionBD.Destroy();
            return Ok(res2);
        }

        [HttpGet]
        [Route("bancos")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> CatalogoBancos()
        {
            var res3 = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Bancos.CatalogoBancos>("WHERE TipoBancoId=2").ToArrayAsync();
            await ConexionBD.Destroy();
            return Ok(res3);
        }


        // Obtenemos las bodedas
        [HttpGet]
        [Route("obtener/{BovedaID}")]
        [Authorize]
        public async Task<IActionResult> ObtenerPorId(int BovedaID)
        {
            var bovedas = await ConexionBD.database.QueryAsync<CatalogoBoveda>("WHERE BovedaID=@0", BovedaID).ToArrayAsync();
            ArrayList res = new();

            var personas = await ConexionBD.database.FetchAsync<DBContext.DBConfia.General.Personas>();
            var ctaBoveda = await ConexionBD.database.FetchAsync<CuentasBoveda>();
            foreach (var T in bovedas)
            {
                res.Add(new
                {
                    bovedaID = T.BovedaID,
                    nombre = T.Nombre,
                    clave = T.Clave,
                    fechaHora = T.FechaHora,
                    usuario = T.UsuarioID,
                    persona = (await T.CH__PERSONA(ConexionBD)).Select(sc =>
                     new
                     {
                         personaId = sc.PersonaID,
                         nombre = sc.Nombre,
                         apellidoPaterno = sc.ApellidoPaterno,
                         apellidoMaterno = sc.ApellidoMaterno,
                         usuario = personas.Where(w => w.PersonaID == T.PersonaID).Select(se => new { usuarioId = se.CreacionUsuarioID, username = se.Nombre }).SingleOrDefault(),
                         cuentasBanco = ctaBoveda.Where(w => w.BovedaId == T.BovedaID).ToArray()
                     })
                });

            }
            await ConexionBD.Destroy();
            return Ok(res);
        }

        //Agrega una boveda a la base de datos
        [HttpPost]
        [Route("agregar")]
        [Authorize]
        public async Task<IActionResult> Agregar(PeticionesRest.SOMA.Bovedas.Actualizar parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            try
            {

                ConexionBD.database.BeginTransaction();
                var boveda = new DBContext.DBConfia.Tesoreria.CatalogoBoveda()
                {
                    Activa = parData.Activa,
                    Nombre = parData.Nombre,
                    Clave = parData.Clave,
                    CuentaID = parData.CuentaID,
                    FechaHora = DateTime.Now,
                    PersonaID = parData.PersonaID,
                    UsuarioID = UsuarioActual.UsuarioID,
                    SucursalID = parData.SucursalID
                };
                await ConexionBD.Destroy();
                await ConexionBD.database.InsertAsync(boveda);

                var cuentaBanco = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Bancos.CatalogoCuentasBancos>("WHERE CuentaBancoID=@0", parData.CuentaID).SingleOrDefaultAsync();
                cuentaBanco.Disponible = false;
                await ConexionBD.database.UpdateAsync(cuentaBanco);


                var bitacoraCambios = new BitacoraCambios()
                {
                    Accion = "Creacion de bóveda ID: " + boveda.BovedaID + " " + boveda.Nombre,
                    Modulo = "Tesoreria",
                    PersonaID = (long)UsuarioActual.UsuarioID,
                    FechaAfectacion = DateTime.Now
                };
                await ConexionBD.database.InsertAsync(bitacoraCambios);
                ConexionBD.database.CompleteTransaction();
                var boveda2 = await ConexionBD.database.QueryAsync<CatalogoBoveda_VW>("WHERE BovedaID=@0", boveda.BovedaID).SingleOrDefaultAsync();
                await ConexionBD.Destroy();
                return Ok(boveda2);
            }
            catch (Exception ex)
            {
                ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest("Error al ingresar la boveda al sistema: " + ex.Message);
            }
        }

        // Actualiza una boveda en la base de datos
        [HttpPut]
        [Route("actualizar/{BovedaID}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new∫ string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> ActualizarBovedas(PeticionesRest.SOMA.Bovedas.Actualizar parData, int BovedaID)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            ConexionBD.database.BeginTransaction();
            var boveda = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Tesoreria.CatalogoBoveda>(BovedaID);
            var bovedaNombreAnt = boveda.Nombre;
            var bovedaClaveAnt = boveda.Clave;
            try
            {
                boveda.Nombre = parData.Nombre;
                boveda.Clave = parData.Clave;
                boveda.Activa = parData.Activa;
                boveda.CuentaID = parData.CuentaID;
                boveda.PersonaID = parData.PersonaID;
                boveda.FechaHora = DateTime.Now;
                boveda.UsuarioID = UsuarioActual.UsuarioID;

                await ConexionBD.database.UpdateAsync(boveda);

                if (!bovedaNombreAnt.Equals(parData.Nombre))
                {
                    var bitacoraCambios = new BitacoraCambios()
                    {
                        Accion = "Actualización de nombre de boveda ID: " + boveda.BovedaID + " '" + bovedaNombreAnt + "' a '" + parData.Nombre + "'",
                        Modulo = "Tesoreria",
                        PersonaID = (long)UsuarioActual.UsuarioID,
                        FechaAfectacion = DateTime.Now
                    };
                    await ConexionBD.database.InsertAsync(bitacoraCambios);

                }

                if (!bovedaClaveAnt.Equals(parData.Clave))
                {
                    var bitacoraCambios = new BitacoraCambios()
                    {
                        Accion = "Actualización de clave de boveda ID: " + boveda.BovedaID + " '" + bovedaClaveAnt + "' a '" + parData.Clave + "'",
                        Modulo = "Tesoreria",
                        PersonaID = (long)UsuarioActual.UsuarioID,
                        FechaAfectacion = DateTime.Now
                    };
                    await ConexionBD.database.InsertAsync(bitacoraCambios);
                }
                ConexionBD.database.CompleteTransaction();
                var boveda2 = await ConexionBD.database.QueryAsync<CatalogoBoveda_VW>("WHERE BovedaID=@0", boveda.BovedaID).SingleOrDefaultAsync();
                await ConexionBD.Destroy();
                return Ok(boveda2);
            }
            catch (Exception ex)
            {
                ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest("Error al actualizar la boveda: " + ex.Message);
            }
        }

        [HttpDelete]
        [Route("eliminar-cuenta/{cuentaBancoID}")]
        [Authorize]
        [Code.TProteccionProducto]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new∫ string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> EliminarCuentaBoveda(int cuentaBancoID)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
            // var UsuarioActual = await ConexionBD.database.QueryAsync<USER_ENTITY>("WHERE USERNAME=@0", UserName).FirstOrDefaultAsync();
            var PersonaActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE UsuarioID=@0", UsuarioActual.UsuarioID).FirstOrDefaultAsync();

            try
            {
                var cuentaBanco = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Bancos.CatalogoCuentasBancos>(cuentaBancoID);

                await ConexionBD.database.ExecuteAsync("DELETE FROM Tesoreria.CuentasBoveda WHERE CuentaBancoId=@0", cuentaBancoID);
                var bitacoraCambios = new BitacoraCambios()
                {
                    Accion = "Eliminación de cuenta banco ID: " + cuentaBanco.CuentaBancoID + " " + cuentaBanco.NumeroCuenta,
                    Modulo = "Tesoreria",
                    PersonaID = PersonaActual.UsuarioID,
                    FechaAfectacion = DateTime.Now
                };
                await ConexionBD.database.InsertAsync(bitacoraCambios);
                await ConexionBD.Destroy();
                return Ok(true);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("Error al actualizar la boveda: " + ex.Message);
            }
        }
    }
}