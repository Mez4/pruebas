using System.ComponentModel.DataAnnotations;
using System;

namespace ConfiaWebApi.PeticionesRest.Sistema.Usuarios
{
    public class Obtener
    {
        [Range(minimum: 0, maximum: 9999)]
        public int Id { get; set; }
    }

    public class Interactuar
    {
        [Required]
        [MinLength(5)]
        public string Usuario { get; set; }
    }

    public class Confirmar
    {
        [Required]
        [MinLength(5)]
        public string Usuario { get; set; }

        [Required]
        [MinLength(6)]
        public string Codigo { get; set; }

        [Required]
        [MinLength(6)]
        public string Contrasena { get; set; }
    }

    public class AgregarRol
    {
        public int RolID { get; set; }
        public int? ProductoID { get; set; }
    }

    public class AgregarPermisosEspeciales
    {
        public int? ProductoID { get; set; }
        public int[] PermisosIDs { get; set; }
    }
}