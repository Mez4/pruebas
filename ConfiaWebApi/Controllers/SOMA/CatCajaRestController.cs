using System.Data.Common;
using System.Net;
using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Configuration;

using DBContext.DBConfia;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Seguridad;
using DBContext.DBConfia.dbo;

using System.Net.Http;
using System.Collections.Generic;
using System.Text.Json;
using System.Collections;
using ConfiaWebApi.Code;

namespace ConfiaWebApi.Controllers.Sistema
{
    [Authorize]
    [ApiController]
    [Route("api/SOMA/[controller]")]
    public class CatCajaRest : ControllerBase
    {
        // TODO::
        // Validar funcion de eliminar cuenta... ??, valido, util ?
        // Segundo, se pueden eliminar las bovedas ??, se pueden actualizar hasta que nivel? (Nombre y Clave o solo nombre?)

        /// <summary>
        /// Conexion a base de datos
        /// </summary>
        private DBConfiaContext ConexionBD;

        /// <summary>
        /// Constructor del controlador
        /// </summary>
        /// <param name="_DBContext">Conexión de datos para el controlador</param>
        public CatCajaRest(DBConfiaContext _DBContext)
        {
            ConexionBD = _DBContext;
        }


        
        [HttpGet]
        [Route("checkcaja/{cajaid}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ChecarCaja(int CajaID){
            try {
                var checkCaja = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.CatalogoCajas>("WHERE CajaID =  @0", CajaID).SingleOrDefaultAsync();
                await ConexionBD.Destroy();
                return Ok( new 
                {
                    status = true,
                    msj = "OK",
                    data = checkCaja
                });
            } catch (System.Exception ex) {
                await ConexionBD.Destroy();
                return BadRequest(new 
                {
                    status = false,
                    msj = ex.Message,
                    data = Array.Empty<int>()
                });
            }

           
        }

        [HttpGet]
        [Route("cajasBySucursal/{SucursalID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> GetBySucursal(int SucursalID){
            try {
                var checkCaja = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.CatalogoCajas>("WHERE SucursalID=@0", SucursalID).ToArrayAsync();
                await ConexionBD.Destroy();
                return Ok(checkCaja);
            } catch (System.Exception ex) {
                await ConexionBD.Destroy();
                return BadRequest(Array.Empty<int>());
            }
        }

        [HttpGet]
        [Route("abrir-caja/{CajaID}")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ReAbrirCaja(int CajaID)
        {
            var catCaja = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.CatalogoCajas>("WHERE CajaID=@0", CajaID).SingleOrDefaultAsync();
            catCaja.Cerrada = false;
            await ConexionBD.database.UpdateAsync(catCaja);
            var caja = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.CatalogoCajas_VW>("WHERE CajaID=@0", CajaID).SingleOrDefaultAsync();
            await ConexionBD.Destroy();
            return Ok(caja);
        }

        [HttpGet]
        [Route("show")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Obtener()
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            if (UsuarioActual.MasterUser)
            {
                var ress = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Tesoreria.CatalogoCajas_VW>();
                await ConexionBD.Destroy();
                return Ok(ress);
            }

            var permisosCajas = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.CatalogoCajasUsuarios>("WHERE UsuarioID=@0", UsuarioActual.UsuarioID).ToArrayAsync();
            var res = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Tesoreria.CatalogoCajas_VW>();
            //Filter res when CajaID appears on permisosCajas
            var res2 = res.Where(x => permisosCajas.Any(y => y.CajaID == x.CajaID)).ToArray();
            await ConexionBD.Destroy();
            return Ok(res2);
        }



        [HttpGet]
        [Route("show2")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> show()
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                var cuentasCaja = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Tesoreria.CatalogoCajas_VW>();
                ArrayList res = new();

                foreach (var T in cuentasCaja)
                {
                    res.Add(new
                    {
                        Id = T.CajaID,
                        Nombre = T.Nombre,
                        Clave = T.Clave,
                        Descripcion = T.Descripcion,
                        Cerrada = T.Cerrada,
                        Estatus = T.Estatus,
                        Gastos = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.SolicitudesGastosXCaja_VW>("WHERE CajaID=@0", T.CajaID).ToArrayAsync()
                    });
                }

                var res2 = new
                {
                    ValoresCaja = res,
                    CajaNombre = cuentasCaja.FirstOrDefault().Nombre,
                    CajaID = cuentasCaja.FirstOrDefault().CajaID
                };
                await this.ConexionBD.Destroy();
                return Ok(res2);
            }
            catch (Exception ex)
            {
                await this.ConexionBD.Destroy();
                return BadRequest(ex);
            }

        }
        [HttpGet]
        [Route("show-activa")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> ObtenerTodosActivos()
        {
            try
            {
                var cajas = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Tesoreria.CajasActivas_VW>();
                await ConexionBD.Destroy();
                return Ok(cajas);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        [Route("show-operando")]
        [Authorize]
        [Code.TProteccionProducto]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> ObtenerConOperacion()
        {
            try
            {
                var cajas = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Tesoreria.CajasOperando_VW>();
                ArrayList res = new();

                foreach (var T in cajas)
                {
                    res.Add(new
                    {
                        CajaID = T.CajaID,
                        DescripcionCaja = T.Descripcion,
                        Nombre = T.Nombre,
                        Clave = T.Clave,
                        Estatus = T.Estatus,
                        BovedaID = T.BovedaID,
                        TiposOperacion = (await ConexionBD.database.QueryAsync<DBContext.DBConfia.Tesoreria.TipoOperacion_VW>("WHERE CajaID=@0", T.CajaID).ToArrayAsync())
                    });
                }
                await ConexionBD.Destroy();
                return Ok(res);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("show/{CajaID}")]
        [Authorize]
        public async Task<IActionResult> ObtenerPorID(int CajaID)
        {
            try
            {
                var res1 = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Tesoreria.CatalogoCajas>(CajaID);
                await ConexionBD.Destroy();
                return Ok(res1);

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        [Route("GastosHoy")]
        [Authorize]
        public async Task<IActionResult> GastosHoy()
        {
            try
            {
                var res1 = await ConexionBD.database.FetchAsync<DBContext.DBConfia.Tesoreria.SolicitudesGastosXCaja_VW>("Where CAST (FechaAplicado  AS DATE) = CAST (GETDATE()AS DATE ");
                await ConexionBD.Destroy();
                return Ok(res1);

            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        public async Task<IActionResult> Agregar(PeticionesRest.SOMA.Cajas.Agregar parData)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            try
            {
                ConexionBD.database.BeginTransaction();
                var caja = new DBContext.DBConfia.Tesoreria.CatalogoCajas()
                {
                    Descripcion = parData.Descripcion,
                    SucursalID = parData.SucursalID,
                    Estatus = parData.Estatus,
                    Nombre = parData.Nombre,
                    Clave = parData.Clave,
                    CanalesCobranza = parData.CanalesCobranza,

                };
                await ConexionBD.database.InsertAsync(caja);

                var bitacoraCambios = new BitacoraCambios()
                {
                    Accion = "Creación de caja ID: " + caja.CajaID + " " + caja.Nombre,
                    Modulo = "Tesoreria",
                    PersonaID = (long)UsuarioActual.PersonaID,
                    FechaAfectacion = DateTime.Now
                };
                await ConexionBD.database.InsertAsync(bitacoraCambios);
                ConexionBD.database.CompleteTransaction();
                await ConexionBD.Destroy();
                return Ok(caja);
            }
            catch (Exception ex)
            {
                ConexionBD.database.AbortTransaction();
                await ConexionBD.Destroy();
                return BadRequest("Error al ingresar la caja al sistema: " + ex.Message);
            }
        }

        [HttpPut]
        [Route("update/{CajaID}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> Actualizar(PeticionesRest.SOMA.Cajas.Actualizar parData, int CajaID)
        {
            var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
            var UsuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

            var caja = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Tesoreria.CatalogoCajas>(CajaID);
            var cajaNombreAnt = caja.Nombre;
            bool estatusCajaAnt = caja.Estatus;
            var cajaDscAnt = caja.Descripcion;
            try
            {
                caja.Descripcion = parData.Descripcion;
                caja.SucursalID = parData.SucursalID;
                caja.Estatus = parData.Estatus;
                caja.Nombre = parData.Nombre;
                caja.Clave = parData.Clave;
                /*  caja.BovedaID = parData.BovedaID;
                 //caja.CuentaID = parData.CuentaID;
                 caja.PersonaID = parData.UsuarioIDSeg; */
                caja.UsuarioID = UsuarioActual.UsuarioID;

                if (!cajaNombreAnt.Equals(parData.Nombre))
                {
                    var bitacoraCambios = new BitacoraCambios()
                    {
                        Accion = "Actualización de nombre de caja ID: " + caja.CajaID + " '" + cajaNombreAnt + "' a '" + parData.Nombre + "'",
                        Modulo = "Tesoreria",
                        PersonaID = (long)UsuarioActual.PersonaID,
                        FechaAfectacion = DateTime.Now,
                        Dato = "Nombre",
                        DatoAnt = cajaNombreAnt,
                        DatoNvo = parData.Nombre

                    };
                    await ConexionBD.database.InsertAsync(bitacoraCambios);
                }

                if (!estatusCajaAnt == parData.Estatus)
                {
                    var bitacoraCambios = new BitacoraCambios()
                    {
                        Accion = "Actualización de estatus de caja ID: " + caja.CajaID + " de " + estatusCajaAnt + " a " + caja.Estatus,
                        Modulo = "Tesoreria",
                        PersonaID = (long)UsuarioActual.PersonaID,
                        FechaAfectacion = DateTime.Now,
                        Dato = "Estatus",
                        DatoAnt = estatusCajaAnt.ToString(),
                        DatoNvo = caja.Estatus.ToString()

                    };
                    await ConexionBD.database.InsertAsync(bitacoraCambios);

                }
                if (!cajaDscAnt.Equals(parData.Descripcion))
                {
                    var bitacoraCambios = new BitacoraCambios()
                    {
                        Accion = "Actualización de descripción de caja ID: " + caja.CajaID + " '" + cajaDscAnt + "' a '" + parData.Descripcion + "'",
                        Modulo = "Tesoreria",
                        PersonaID = (long)UsuarioActual.PersonaID,
                        FechaAfectacion = DateTime.Now,
                        Dato = "Descripción",
                        DatoAnt = cajaDscAnt,
                        DatoNvo = parData.Descripcion

                    };
                    await ConexionBD.database.InsertAsync(bitacoraCambios);
                }

                await ConexionBD.database.UpdateAsync(caja);
                await ConexionBD.Destroy();
                return Ok(caja);

            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("Error al actualizar la caja: " + ex.Message);
            }
        }


        [HttpPost]
        [Route("update/{BuroInternoEstatusID}")]
        [Authorize]
        public async Task<IActionResult> Update(PeticionesRest.SOMA.BuroInternoEstatus.Actualizar parData, int BuroInternoEstatusID)
        {
            try
            {
                var buro = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Catalogos.BuroInternoEstatus>(BuroInternoEstatusID);

                buro.Nombre = parData.Nombre;
                buro.Color = parData.Color;
                buro.PuedeCanjear = parData.PuedeCanjear;

                await ConexionBD.database.UpdateAsync(buro);
                await ConexionBD.Destroy();
                return Ok(buro);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest(ex.Message);
            }
        }

        [HttpPost]
        [Route("delete/{BuroInternoEstatusID}")]
        [Authorize]
        // [ConfiaWebApi.Code.KeycloakSecurityRealmAttributes(new string[] { "ADMINISTRACION", "SOPORTE" })]
        public async Task<IActionResult> EliminarRegistro(int BuroInternoEstatusID)
        {
            var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var usuarioActual = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();
            var dispersion = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Catalogos.BuroInternoEstatus>(BuroInternoEstatusID);

            try
            {
                await ConexionBD.database.ExecuteAsync("DELETE FROM Catalogos.BuroInternoEstatus WHERE BuroInternoEstatusID=@0", BuroInternoEstatusID);
                await ConexionBD.Destroy();
                return Ok(true);
            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return BadRequest("Error al elimnar la dispersion: " + ex.Message);
            }
        }

    }
}