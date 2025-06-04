using System.Text;
using System.IO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using DBContext.DBConfia;
using DBContext.DBConfia.Seguridad;

// Namespace
namespace ConfiaWebApi.Code
{
    public class KeycloakSecurityAttributes : TypeFilterAttribute
    {
        public KeycloakSecurityAttributes(string[] roles) : base(typeof(KeycloakSecurity))
        {
            Arguments = new object[] { roles };
        }
    }

    // Always authorize user roles agains DB
    public class KeycloakSecurity : IAuthorizationFilter
    {
        // Variables
        private readonly string[] roles;

        // Constructor
        public KeycloakSecurity(string[] _roles) { this.roles = _roles; }

        // En petición de authorización asincrona
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            try
            {
                /*
                // Validamos el rol de master user
                if (context.HttpContext.User.Claims.Where(x => x.Type == "realm_roles").Select(c => c.Value).Contains("MASTER"))
                    return;

                // The application has no client roles
                if (context.HttpContext.User.Claims.Where(x => x.Type == "client_roles").Count() <= 0)
                {
                    context.Result = new ForbidResult();
                    return;
                }

                // Obtenemos los roles de cliente
                var roles_usuario = context.HttpContext.User.Claims.Where(x => x.Type == "client_roles").Select(x => x.Value).ToArray();
                if (!roles_usuario.Intersect(this.roles).Any())
                {
                    context.Result = new ForbidResult();
                }
                */
            }
            catch (Exception ex)
            {
                context.Result = new ObjectResult(ex.Message) { StatusCode = 401 };
            }
        }
    }
}