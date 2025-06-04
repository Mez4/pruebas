using System;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

// Namespace
namespace ConfiaWebApi.Code
{
    public class TProteccionAdmin : TypeFilterAttribute
    {
        public TProteccionAdmin() : base(typeof(ProteccionAdmin))
        {
            Arguments = new object[] { };
        }
    }

    // Always authorize user roles agains DB
    public class ProteccionAdmin : IAsyncAuthorizationFilter
    {
        // Constructor
        public ProteccionAdmin()
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

                // Obtenemos la conexión de base de datos
                var dbContext = context.HttpContext.RequestServices.GetService(typeof(DBContext.DBConfia.DBConfiaContext)) as DBContext.DBConfia.DBConfiaContext;

                // Obteneos el ID del usuario
                var usuarioID = int.Parse(context.HttpContext.User.Claims.Where(x => x.Type == "UsuarioID").FirstOrDefault().Value);

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

                // Obtenemos los permisos del usuario (Donde el Producto es nulo)
                var permisosUsuario = await dbContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosPermisosVW>()
                    .Where(x =>
                        x.UsuarioID == Usuario.UsuarioID &&
                        x.ProductoID == null &&
                        x.PermisoRestUrl.ToUpper().Trim() == UrlQuery.ToUpper().Trim() &&
                        x.PermisoRestMetodo.ToUpper() == UrlMetodo.ToUpper().Trim()
                    )
                    .ToArray();


                // Validamos si tenemos acceso en este producto
                if (permisosUsuario.Count() <= 0)
                {

                    var Permiso = await dbContext.database.QueryAsync<DBContext.DBConfia.Sistema.Permisos_VW>().Where(
                        x =>
                            x.PermisoRestUrl.ToUpper().Trim() == UrlQuery.ToUpper().Trim() &&
                            x.PermisoRestMetodo.ToUpper().Trim() == UrlMetodo.ToUpper().Trim()
                        ).FirstOrDefault();

                    context.HttpContext.Response.StatusCode = 401;
                    context.Result = new ObjectResult(Newtonsoft.Json.JsonConvert.SerializeObject(new
                    {
                        Mensaje = string.Format(
                        "{0} :: {1}, No cuenta con el permiso: {2}", Usuario.Usuario, Permiso.PermisoID.ToString(), Permiso.PermisoNombre
                    )
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