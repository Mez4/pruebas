using System.Linq;
namespace ConfiaWebApi.Code
{
    public class Generic
    {
        public static string ObtenerEmailClaims(System.Collections.Generic.IEnumerable<System.Security.Claims.Claim> claims)
        {
            return claims.Where(x => x.Type == "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress").FirstOrDefault().Value;
        }
    }
}