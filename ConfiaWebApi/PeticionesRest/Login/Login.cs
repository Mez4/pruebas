using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.Login
{
    public class IniciarSesion
    {
        [EmailAddress]
        [Required]
        public string Correo { get; set; }

        [Required]
        [MinLength(6)]
        [MaxLength(18)]
        public string Contrasena { get; set; }
    }

    public class Confirmar
    {
        [Required]
        public string Usuario { get; set; }

        [Required]
        [MinLength(5)]
        [MaxLength(5)]
        public string Codigo { get; set; }

        [Required]
        [MinLength(6)]
        [MaxLength(18)]
        public string Contrasena { get; set; }
    }

    public class Recuperar
    {
        [Required]
        public string Usuario { get; set; }

    }
}
