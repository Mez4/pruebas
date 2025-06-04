using DBContext.DBConfia.Custom.Seguridad;

namespace ConfiaWebApi.RespuestasPersonalizadas
{
    /// <summary>
    /// Respuesta a la API del usuario, se genero para evitar enviar una respuesta
    /// con toda la información del usuario
    /// </summary>
    public class RespuestaLogin
    {
        public User Usuario { get; set; }
        public UsuarioObtenerRoles[] Acceso { get; set; }
        public string Token { get; set; }
    }

    /// <summary>
    /// Versión menor (segura) de la clase de usuario para enviar al frontend
    /// </summary>
    public class User
    {
        public string Usuario { get; set; }
        public string Nombre { get; set; }
    }
}