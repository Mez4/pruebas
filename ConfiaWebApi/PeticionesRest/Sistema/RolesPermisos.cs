using System.ComponentModel.DataAnnotations;
using System;

namespace ConfiaWebApi.PeticionesRest.Sistema.RolesPermisos
{
    public class Rol
    {
        [MinLength(6)]
        [MaxLength(120)]
        [Required]
        public string Nombre { get; set; }

        [MinLength(6)]
        [MaxLength(25)]
        [Required]
        public string Icono { get; set; }

        [MinLength(6)]
        [MaxLength(120)]
        [Required]
        public string Descripcion { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 2)]
        public int Tipo { get; set; }
    }

    public class AsignarPermiso
    {
        [Required]
        [Range(minimum: 1, maximum: int.MaxValue)]
        public int PermisoID { get; set; }
    }

    public class Permiso
    {
        [Required]
        [Range(minimum: 1, maximum: int.MaxValue)]
        public int PantallaID { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(255)]
        public string Nombre { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(120)]
        public string Descripcion { get; set; }

        public Boolean Especial { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(255)]
        public string Url { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(10)]
        public string Metodo { get; set; }
    }

    public class Pantalla
    {
        [Required]
        [Range(minimum: 1, maximum: int.MaxValue)]
        public int ModuloID { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(255)]
        public string Nombre { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(120)]
        public string Descripcion { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(255)]
        public string Ruta { get; set; }
    }
}