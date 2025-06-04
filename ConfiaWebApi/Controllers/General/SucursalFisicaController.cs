using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using DBContext.DBConfia;
using DBContext.DBConfia.General;
using DBContext.DBConfia.Sistema;

namespace ConfiaWebApi.Controllers.General
{
    [Authorize]
    [ApiController]
    [Route("api/General/[controller]")]
    public class SucursalFisicaController : ControllerBase
    {
        private DBConfiaContext ConexionDB;

        public SucursalFisicaController(DBConfiaContext _DBContext)
        {
            ConexionDB = _DBContext;
        }

        [HttpPost]
        [Route("get")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> Get(PeticionesRest.General.SucursalFisica.Get parData)
        {
            if (parData.SucursalFisicaID != 0)
            {
                try
                {
                    var resS = await ConexionDB.database.QueryAsync<SucursalesFisicas_VW>("WHERE SucursalFisicaID = @SucursalFisicaID", parData).SingleOrDefaultAsync();
                    await ConexionDB.Destroy();
                    return Ok(resS);
                }
                catch (Exception ex)
                {
                    await ConexionDB.Destroy();
                    return NotFound(ex.Message);
                }

            }

            var res = await ConexionDB.database.FetchAsync<SucursalesFisicas_VW>();
            await ConexionDB.Destroy();
            return Ok(res);
        }

        [HttpPost]
        [Route("add")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> Add(PeticionesRest.General.SucursalFisica.Add parData)
        {
            // Obtenemos el email del usuario de los claims
            var usuarioActualEmail = Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            var UsuarioActual = await ConexionDB.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0 OR Correo=@0", usuarioActualEmail).FirstOrDefaultAsync();

            // Generamos el registro de empleado
            try
            {
                // Direccion
                var Direccion = new Direcciones()
                {
                    vialidadTipoId = parData.vialidadTipoId,
                    orientacionVialidadTipoId = parData.orientacionVialidadTipoId,
                    AsentamientoID = parData.AsentamientoID,
                    NombreVialidad = parData.NombreVialidad,
                    NumeroExterior = parData.NumeroExterior,
                    NumeroInterior = parData.NumeroInterior,
                    ReferenciasGeograficas = parData.ReferenciasGeograficas,
                    ViviendaTipoId = parData.ViviendaTipoId,
                    CreacionFecha = DateTime.Now,
                    CreacionPersonaID = (long)UsuarioActual.PersonaID,
                    CreacionUsuarioID = UsuarioActual.UsuarioID
                };

                // Comenzamos una transaccion
                ConexionDB.database.BeginTransaction();

                // Ingresamos la persona a la BD
                await ConexionDB.database.InsertAsync(Direccion);

                var SucursalFisica = new SucursalesFisicas()
                {
                    Nombre = parData.Nombre,
                    DireccionID = Direccion.DireccionID,
                    Telefono = parData.Telefono
                };

                // Insertamos la relacion a la direccion de la persona
                await ConexionDB.database.InsertAsync(SucursalFisica);

                // Hacemos el commit a la transaccion
                ConexionDB.database.CompleteTransaction();

                //var res = new
                //{
                //    SucursalFisica.SucursalFisicaID,
                //    SucursalFisica.Nombre,
                //    SucursalFisica.DireccionID,
                //    Direccion
                //};

                //return Ok(res);

                var res = await ConexionDB.database.QueryAsync<SucursalesFisicas_VW>("WHERE SucursalFisicaID = @SucursalFisicaID", SucursalFisica).SingleOrDefaultAsync();

                await ConexionDB.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await ConexionDB.Destroy();
                return BadRequest("ERROR AL PROCESAR LA SUCURSAL FISICA: " + ex.Message);
            }
        }

        [HttpPost]
        [Route("update")]
        [Authorize]
        [Code.TProteccionAdmin]
        public async Task<IActionResult> Update(PeticionesRest.General.SucursalFisica.Update parData)
        {
            // Obtenemos el email del usuario de los claims
            //var usuarioActualEmail = Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            //var UsuarioActual = await DBContext.database.QueryAsync<PersonasUsuarios_VW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();

            // Generamos el registro de empleado
            try
            {

                var SucursalFisica = await ConexionDB.database.SingleByIdAsync<SucursalesFisicas>(parData.SucursalFisicaID);

                var Direccion = await ConexionDB.database.SingleByIdAsync<Direcciones>(SucursalFisica.DireccionID);

                Direccion.vialidadTipoId = parData.vialidadTipoId;
                Direccion.orientacionVialidadTipoId = parData.orientacionVialidadTipoId;
                Direccion.AsentamientoID = parData.AsentamientoID;
                Direccion.NombreVialidad = parData.NombreVialidad;
                Direccion.NumeroExterior = parData.NumeroExterior;
                Direccion.NumeroInterior = parData.NumeroInterior;
                Direccion.ReferenciasGeograficas = parData.ReferenciasGeograficas;
                Direccion.ViviendaTipoId = parData.ViviendaTipoId;

                // Comenzamos una transaccion
                ConexionDB.database.BeginTransaction();

                // Ingresamos la persona a la BD
                await ConexionDB.database.UpdateAsync(Direccion);

                SucursalFisica.Nombre = parData.Nombre;
                SucursalFisica.Telefono = parData.Telefono;
                //SucursalFisica.DireccionID = Direccion.DireccionID;

                // Insertamos la relacion a la direccion de la persona
                await ConexionDB.database.UpdateAsync(SucursalFisica);

                // Hacemos el commit a la transaccion
                ConexionDB.database.CompleteTransaction();

                //var res = new
                //{
                //    SucursalFisica.SucursalFisicaID,
                //    SucursalFisica.Nombre,
                //    SucursalFisica.DireccionID,
                //    Direccion
                //};

                //return Ok(res);
                var res = await ConexionDB.database.QueryAsync<SucursalesFisicas_VW>("WHERE SucursalFisicaID = @SucursalFisicaID", SucursalFisica).SingleOrDefaultAsync();
                await ConexionDB.Destroy();
                return Ok(res);

            }
            catch (Exception ex)
            {
                await ConexionDB.Destroy();
                return BadRequest("ERROR AL PROCESAR LA SUCURSAL FISICA: " + ex.Message);
            }
        }

    }
}
