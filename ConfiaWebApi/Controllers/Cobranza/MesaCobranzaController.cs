using ConfiaWebApi.PeticionesRest.Archivo.Estatus;
using DBContext.DBConfia;
using DBContext.DBConfia.Cobranza;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.Controllers.Cobranza
{
    [Authorize]
    [ApiController]
    [Route("api/Cobranza/[controller]")]
    public class MesaCobranzaController : ControllerBase
    {
        private DBConfiaContext DBContext;

        public MesaCobranzaController(DBConfiaContext _DBContext)
        {
            DBContext = _DBContext;
        }


/*************************************************************************************************************************************************************************************************************/
/*******************************************VALIDACION DIRECTOR COBRANZA**************************************************************************************************************************************/
/*************************************************************************************************************************************************************************************************************/
        //Esta sera la funcion que se usara en toda cobranza para la validacion de un director.
        [HttpGet]
        [Route("getValidacion")]
        [Code.TProteccionProducto]
        [Authorize]
        public async Task<ActionResult> GetValidacion()
        {
            try{
                   //Obtenemos el Usuario con el cual se ingreso
                   var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                   //Consultamos los datos correspondientes al yusuario correspondiente
                   var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario = @0", UserName).FirstOrDefaultAsync();
                   // Verificamos En la tabla Directores si el usuario existe
                   var verificacion = await DBContext.database.QueryAsync<DBContext.DBConfia.General.Directores>("WHERE PersonaID=@0", UsuarioActual.PersonaID).FirstOrDefaultAsync();
                   //Si el usuario existe entonces regresamos la respuesta obtenida para poder empezar a habilitar opciones en el FRONTEND
                   if(verificacion != null){ await DBContext.Destroy();return Ok(verificacion);}
                   //Si no existe el usuario en la tabla Directores, entonces simplemente regresamos un mensaje indicando que existe un error al verifiacar que es un director
                   else{await DBContext.Destroy();return BadRequest("Error al verificar director");}
            }
            catch{
                await DBContext.Destroy();
                return BadRequest("Error");
            }
        }
/*************************************************************************************************************************************************************************************************************/
/*************************************************************************************************************************************************************************************************************/

        [HttpPost]
        [Route("get")]
        [Code.TProteccionProducto]
        [Authorize]
        public async Task<IActionResult> Get(ConfiaWebApi.PeticionesRest.Cobranza.MesaCobranza.get parData)
        {
            int ProductoID = int.Parse(HttpContext.Request.Headers["ProductoID"].ToString());
            var obj = new { ProductoID = ProductoID };
            //La consulta se encontraba apuntada hacia la vista Cobranza.CatalogoMesaProducto_VW, de ser necesario cambiarlo
            var res = await DBContext.database.FetchAsync<DBContext.DBConfia.Cobranza.MesaCobranza>();
            await DBContext.Destroy();
            return Ok(res);
        }


        [HttpPost]
        [Route("insert")]
        [Code.TProteccionProducto]
        [Authorize]
        public async Task<IActionResult> Insert(ConfiaWebApi.PeticionesRest.Cobranza.MesaCobranza.add parData)
        {
            try{
                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var UsuarioActual = DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
                var consultaExistencia = await DBContext.database.QueryAsync<DBContext.DBConfia.Cobranza.MesaCobranza>("", parData).FirstOrDefaultAsync();
                if(consultaExistencia == null){
                    var datosInsert = new DBContext.DBConfia.Cobranza.MesaCobranza {Activo = parData.Activo,Clave = parData.Clave,Nombre = parData.Nombre};
                    await DBContext.database.InsertAsync(datosInsert);
                    await DBContext.Destroy();
                    return Ok("Se inserto la mesa correctamente");
                }
                else {await DBContext.Destroy();return BadRequest("Error al realizar el insert");}
            }
            catch{
                await DBContext.Destroy();
                return BadRequest();
            }
        }


        [HttpPost]
        [Route("actualizaMesa")]
        [Code.TProteccionProducto]
        [Authorize]
        public async Task<IActionResult>UpdateMesaCobranza(ConfiaWebApi.PeticionesRest.Cobranza.MesaCobranza.update pardata)
        {
            try{

                var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
                var usuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("Usuario=@0", UserName).FirstOrDefaultAsync();
                var obj = new {MesaCobranza = pardata.MesaCobranzaID};
                var consultaActualizacion = await DBContext.database.QueryAsync<DBContext.DBConfia.Cobranza.MesaCobranza>("MesaCobranzaID=@0", obj).FirstOrDefaultAsync();
                if(consultaActualizacion != null){
                    DBContext.database.BeginTransaction();


                await DBContext.Destroy();
                return Ok("Exito al actualizar mesa de cobranza");
                }
                else{DBContext.database.AbortTransaction();await DBContext.Destroy(); return BadRequest("Error al actualizar usuario");}

                
            }
            catch{
                DBContext.database.AbortTransaction();
                await DBContext.Destroy();
                return BadRequest("Error al acyualizar mesa de cobranza");
            }
        }



        // [HttpPost]
        // [Route("update")]
        // [Code.TProteccionProducto]
        // //[Authorize]
        // //[ConfiaWebApi.Code.KeycloakSecurityAttributes(new string[] { "CATALOGOS_ADMIN" })]
        // public async Task<IActionResult> Update(ConfiaWebApi.PeticionesRest.Cobranza.MesaCobranza.update parData)
        // {
        //     try
        //     {
        //         var UserName = HttpContext.User.Claims.Where(x => x.Type == "preferred_username").FirstOrDefault().Value;
        //         var UsuarioActual = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE Usuario=@0", UserName).FirstOrDefaultAsync();
        //         var obj = new { Usu = UsuarioActual.UsuarioID, MesaCobranzaID = parData.MesaCobranzaID, Nombre = parData.Nombre, Clave = parData.Clave, Activo = parData.Activo, regresa = parData.regresa, msj = parData.msj };
        //         // var res = await DBContext.database.QueryAsync<ConfiaWebApi.ModlesSP.Cobranza.spActualizarMesaCobranza>("EXEC Cobranza.ActualizarMesaCobranza @Usu, @MesaCobranzaID, @Nombre, @Clave, @Activo, @regresa, @msj", obj).FirstOrDefaultAsync();
                
        //         var personaId = await DBContext.database.QueryAsync<DBContext.DBConfia.Seguridad.Usuarios_Personas>("WHERE UsuarioID = @0", obj.Usu).FirstOrDefaultAsync();

        //             DBContext.database.BeginTransaction();
        //             var consultAct = await DBContext.database.QueryAsync<DBContext.DBConfia.Cobranza.MesaCobranza>("MesaCobranzaID = @0", obj.MesaCobranzaID).SingleOrDefaultAsync();
        //                 consultAct.Nombre = parData.Nombre;
        //                 consultAct.Clave = parData.Clave;
        //                 consultAct.Activo = parData.Activo;
        //             await DBContext.database.UpdateAsync(consultAct);
                                    

        //          DBContext.database.CompleteTransaction();
        //          await DBContext.Destroy();
        //          return Ok("Se realizo con exito la actualizacion");
        //     }
        //     catch (Exception ex)
        //     {
        //         DBContext.database.AbortTransaction();
        //         await DBContext.Destroy();
        //         return BadRequest(ex.Message);
        //     }
        // }



    }
}
