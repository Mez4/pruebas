using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Globalization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

// Namespace
namespace ConfiaWebApi.Code
{
    public class TProteccionProducto : TypeFilterAttribute
    {
        public TProteccionProducto() : base(typeof(ProteccionProducto))
        {
            Arguments = new object[] { };
        }
    }

    // Always authorize user roles agains DB
    public class ProteccionProducto : IAsyncAuthorizationFilter
    {
        // Constructor
        public ProteccionProducto()
        {
        }

        // En petición de authorización asincrona
        public async Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            try
            {
                // Obtenemos el nombre de nuestra ruta
                var UrlQuery = context.ActionDescriptor.AttributeRouteInfo.Name ?? context.ActionDescriptor.AttributeRouteInfo.Template;
                var UrlMetodo = context.HttpContext.Request.Method;

                // Obtenemos el Id del producto
                int ProductoID = 999999;

                // Obtenemos el Id del producto de los headers
                try
                {
                    var tmpa = context.HttpContext.Request.Headers["ProductoID"];
                    ProductoID = int.Parse(context.HttpContext.Request.Headers["ProductoID"].ToString());
                }
                catch(Exception e)
                {
                    // var data = new {
                    //    status = false,
                    //    msg = e.Message,
                    //    data = context
                    // };
                    // context.Result = new ObjectResult("No se encontro el header correcto del Producto ID") { StatusCode = 401 };
                    context.Result = new ObjectResult(e.Message) { StatusCode = 401 };
                    return;
                }

                // Obtenemos la conexión de base de datos
                var dbContext = context.HttpContext.RequestServices.GetService(typeof(DBContext.DBConfia.DBConfiaContext)) as DBContext.DBConfia.DBConfiaContext;

                // Obteneos el ID del usuario
                var usuarioID = int.Parse(context.HttpContext.User.Claims.Where(x => x.Type == "UsuarioID").FirstOrDefault().Value);
                var connectionString = dbContext.database.ConnectionString;

                //Find the text "Application Name=" in the connection string and next add value "HOLA"
                var index = connectionString.IndexOf("Application Name=");
                if (index >= 0)
                {
                    connectionString = connectionString.Insert(index + 17, "-" + usuarioID.ToString());
                }


                // Obtenemos el usuario
                var Usuario = await dbContext.database.SingleByIdAsync<DBContext.DBConfia.Seguridad.Usuarios>(usuarioID);

                // Validamos si el usuario esta bloqueado
                if (Usuario.Bloqueado)
                {
                    context.Result = new ObjectResult("Usuario Bloqueado") { StatusCode = 401 };
                    await dbContext.Destroy();
                    return;
                }

                // Terminamos la validación si el usuario es tiene Master en las propiedades
                else if (Usuario.MasterUser)
                {
                    await dbContext.Destroy();
                    return;
                }
                //nuevo if !Usuario.permiso
                // OBTENEMOS LA HORA INICIAL EN VARIABLESGLOBALES - ESTE PEDAZO DE CODIGO SE PUEDE MEJORAR A UN PROCEDIMIENTO ALMACENADO
                // var start_close_hour = await dbContext.database.QueryAsync<DBContext.DBConfia.Catalogos.VariablesGlobales>("WHERE varName ='HORA_INICIO_CIERRE'").SingleOrDefaultAsync();
                // // OBTENEMOS TAMBIEN LA HORA FINAL
                // var end_close_hour = await dbContext.database.QueryAsync<DBContext.DBConfia.Catalogos.VariablesGlobales>("WHERE varName ='HORA_FINAL_CIERRE'").SingleOrDefaultAsync();
                // // SI NINGUNO LLEGA NULO
                // if (start_close_hour != null && end_close_hour != null)
                // {
                //     // ASIGNAMOS LAS HORAS EN LAS NUEVAS VARIABLES
                //     var startHour = start_close_hour.varValue;
                //     var endHour = end_close_hour.varValue;
                //     // SE HARA EL PROCEDIMIENTO PARA OBTENER SOLO EL NUMERO DE HORA DE LA CADENA EJ: 18:00:00
                //     DateTime timeParseStart;
                //     DateTime timeParseEnd;
                //     if (DateTime.TryParseExact((string)startHour, "HH:mm:ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out timeParseStart) &&
                //         DateTime.TryParseExact((string)endHour, "HH:mm:ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out timeParseEnd))
                //     {
                //         int numberStart = timeParseStart.Hour;
                //         int numberEnd = timeParseEnd.Hour;  
                //         //                 10       18                       10       21
                //         // PREGUNTAMOS SI LA HORA ACTUAL ESTA FUERA DEL HORARIO LABORAL
                //         if (DateTime.Now.Hour >= numberStart && DateTime.Now.Hour <= numberEnd){
                //             // PREGUNTAMOS SI TIENE ALGUN PERMISO PARA CONTINUAR
                //             if(Usuario.Acceso == false){
                //                 context.Result = new ObjectResult("Usuario no permitido fuera del horario establecido") { StatusCode = 401 };
                //                 await dbContext.Destroy();
                //                 return;
                //             }

                //         }      
                //     }
                // }
                
                // Obtenemos los permisos del usuario (Del producto actual)
                var permisosUsuario = await dbContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosPermisosVW>()
                    .Where(x =>
                        x.UsuarioID == Usuario.UsuarioID &&
                        x.ProductoID == ProductoID &&
                        x.PermisoRestUrl.ToUpper().Trim() == UrlQuery.ToUpper().Trim() &&
                        x.PermisoRestMetodo.ToUpper() == UrlMetodo.ToUpper().Trim()
                    ).ToArray();

                // Validamos si tenemos acceso en este producto
                if (permisosUsuario.Count() <= 0)
                {
                    var Permiso = await dbContext.database.QueryAsync<DBContext.DBConfia.Sistema.Permisos_VW>().Where(
                        x =>
                            x.PermisoRestUrl.ToUpper().Trim() == UrlQuery.ToUpper().Trim() &&
                            x.PermisoRestMetodo.ToUpper().Trim() == UrlMetodo.ToUpper().Trim()
                        ).FirstOrDefault();

                    var Producto = await dbContext.database.QueryAsync<DBContext.DBConfia.Creditos.Productos>().Where(x => x.ProductoID == ProductoID).FirstOrDefault();

                    context.HttpContext.Response.StatusCode = 401;
                    context.Result = new ObjectResult(Newtonsoft.Json.JsonConvert.SerializeObject(new
                    {
                        Mensaje = string.Format("{0}/{1} :: {2}/{3}, No cuenta con el permiso {4}",
                        Usuario.Usuario,
                        Producto.Producto,
                        ProductoID.ToString(),
                        Permiso != null ? Permiso.PermisoID.ToString() : "0",
                        UrlQuery.ToUpper().Trim())
                    }))
                    {
                        StatusCode = 401
                    };
                    return;
                }

                // Destroy the connection with the database
                await dbContext.Destroy();
            }
            catch (Exception ex)
            {
                context.Result = new ObjectResult(ex.Message) { StatusCode = 401 };
            }
        }
    }
}
