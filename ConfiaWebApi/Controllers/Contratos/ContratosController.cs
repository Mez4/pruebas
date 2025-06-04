using DBContext.DBConfia;
using DBContext.DBConfia.Catalogos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using System.Linq;
using DBContext.DBConfia.Seguridad;
using DBContext.DBConfia.Creditos;
using ConfiaWebApi.ModlesSP.Creditos;

namespace ConfiaWebApi.Controllers.Contratos
{
    [Authorize]
    [ApiController]
    [Route("api/Contratos/[controller]")]
    public class ContratosController : ControllerBase
    {
        private DBConfiaContext ConexionBD;

        public ContratosController(DBConfiaContext _ConexionBD)
        {
            ConexionBD = _ConexionBD;
        }

        /// <summary>
        /// Ruta para obtener un contrato en especifico
        /// </summary>
        /// <param name="ContratoID"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("obtener/{ContratoID}")]
        [Authorize]
        [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Obtener(int ContratoID)
        {
            var res = await ConexionBD.database.SingleByIdAsync<DBContext.DBConfia.Creditos.Contratos_VW>(ContratoID);
            await ConexionBD.Destroy();
            return Ok(res);
        }

        /// <summary>
        /// Ruta para consultar contratos en la base de datos
        /// </summary>
        /// <param name="parData"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("obtener")]
        [Authorize]
        [Code.TProteccionProducto]
        // [ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        public async Task<IActionResult> Obtener([FromQuery] ConfiaWebApi.PeticionesRest.Contratos.Contratos.Get parData)
        {
            //   var usuarioActualEmail = ConfiaWebApi.Code.Generic.ObtenerEmailClaims(HttpContext.User.Claims);
            //     var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE CorreoElectronico=@0", usuarioActualEmail).SingleOrDefaultAsync();
            //     var empresaID = UsuarioActual.usuario_empresaId;
            // Generamos un nuevo query para las personas
            var query = NPoco.Sql.Builder.From("Creditos.Contratos_VW");
            //.Where(@"EmpresaID =@0",empresaID);

            // Contratos de un distribuidor en especifico
            if (parData.DistribuidorID != null)
                query = query.Where(@"DistribuidorID =@0", parData.DistribuidorID);

            // Si la fehca fin esta definida
            if (parData.FechaFin != null)
                query = query.Where(@"FechaHoraRegistro <=@0", parData.FechaFin);

            // Si la fehca inicio esta definida
            if (parData.FechaFin != null)
                query = query.Where(@"FechaHoraRegistro >=@0", parData.FechaInicio);

            if (parData.PersonaIDRegistro != null)
                query = query.Where(@"PersonaIDRegistro =@0", parData.PersonaIDRegistro);

            // Si tenemos la variable de RFC
            if (parData.ProductoID != null)
                query = query.Where("ProductoID = @0", parData.ProductoID);

            // Si estamos especificando el usuario de registro
            if (parData.UsuarioIDRegistro != null)
                query = query.Where("UsuarioIDRegistro = @0", parData.UsuarioIDRegistro);

            // Validamos nuestra peticion
            var res2 = await ConexionBD.database.QueryAsync<DBContext.DBConfia.Creditos.Contratos_VW>(query).ToArrayAsync();
            await ConexionBD.Destroy();
            return Ok(res2);
        }

        [HttpPost]
        [Route("increase")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Increase(PeticionesRest.Contratos.Contratos.Increase parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                parData.UsuarioID = UsuarioActual.UsuarioID;

                ConexionBD.database.CommandTimeout = 360;

                var res = await ConexionBD.database.QueryAsync<ContratoRes>("EXEC Distribuidores.pa_IncrementoLineaCredito_Ins @DistribuidorID, @ContratoID, @ProductoID, @UsuarioID, @IncrementoQuincena, @regresa, @msj", parData).FirstOrDefaultAsync();

                await ConexionBD.Destroy();

                return Ok(res);

            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }

        [HttpPost]
        [Route("decrease")]
        [Authorize]
        [Code.TProteccionProducto]
        public async Task<IActionResult> Decrease(PeticionesRest.Contratos.Contratos.Decrease parData)
        {
            try
            {
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = await ConexionBD.database.QueryAsync<UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();

                parData.UsuarioID = UsuarioActual.UsuarioID;

                ConexionBD.database.CommandTimeout = 360;

                var res = await ConexionBD.database.QueryAsync<ContratoRes>("EXEC Distribuidores.pa_DecrementoLineaCredito_Ins @DistribuidorID, @ContratoID, @ProductoID, @UsuarioID, @Decremento, @regresa, @msj", parData).FirstOrDefaultAsync();

                await ConexionBD.Destroy();

                return Ok(res);

            }
            catch (Exception ex)
            {
                await ConexionBD.Destroy();
                return NotFound(ex.Message);
            }
        }
    }
}
