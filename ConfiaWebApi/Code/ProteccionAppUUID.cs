using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
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
using DBContext.DBConfia.Custom.Tesoreria;

using System.Net.Http;
using System.Collections.Generic;
using System.Text.Json;
using System.Collections;

// Namespace
namespace ConfiaWebApi.Code
{
    public class TProteccionAppUUID : TypeFilterAttribute
    {
        public TProteccionAppUUID() : base(typeof(ProteccionAppVales))
        {
            Arguments = new object[] { };
        }
    }

    // Always authorize user roles agains DB
    public class ProteccionAppUUID : IAsyncAuthorizationFilter
    {
        // Constructor
        public ProteccionAppUUID()
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
                string UUID = "";

                // Obtenemos el Id del producto de los headers
                try
                {
                    var tmpa = context.HttpContext.Request.Headers["UUID"];
                    UUID = context.HttpContext.Request.Headers["ProductoID"].ToString();
                }
                catch (Exception ex)
                {
                    context.Result = new ForbidResult("No se encontro el header correcto del UUID" + ex.Message);
                    return;
                }

                // Obtenemos la conexión de base de datos
                var dbContext = context.HttpContext.RequestServices.GetService(typeof(DBContext.DBConfia.DBConfiaContext)) as DBContext.DBConfia.DBConfiaContext;

                // Obteneos el ID del usuario
                var usuarioID = int.Parse(context.HttpContext.User.Claims.Where(x => x.Type == "UsuarioID").FirstOrDefault().Value);

                // Obtenemos el usuario
                var Usuario = await dbContext.database.QueryAsync<DBContext.DBConfia.Seguridad.UsuariosVW>("WHERE UsuarioID = @0", usuarioID).SingleOrDefaultAsync();
              
                // Validamos si el usuario esta bloqueado
                if (Usuario.Bloqueado)
                {
                    context.Result = new ForbidResult("Usuario bloqueado");
                    await dbContext.Destroy();
                    return;
                }

                if (Usuario.UUID != UUID)
                {
                    context.Result = new ForbidResult("UUID no coincide");
                    await dbContext.Destroy();
                    return;
                }

                // Destroy the connection with the database
                await dbContext.Destroy();
            }
            catch (Exception ex)
            {
                context.Result = new ForbidResult(ex.Message);
            }
        }
    }
}