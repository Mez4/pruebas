using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;


namespace ConfiaWebApi.PeticionesRest.General.SucursalFisica
{
    public class Get
    {
        [Range(minimum: 0, maximum: 999999)]
        public int SucursalFisicaID { get; set; }
    }

    public class Add
    {
        [Required]
        [MinLength(1)]
        [MaxLength(35)]
        public string Nombre { get; set; }

        [MinLength(0)]
        [MaxLength(18)]
        public string Telefono { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 2147483647)]
        public long AsentamientoID { get; set; }

        [Required]
        [Range(1, 999999)]
        public int vialidadTipoId { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(120)]
        public string NombreVialidad { get; set; }

        [Required]
        [Range(1, 999999)]
        public int orientacionVialidadTipoId { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(120)]
        public string NumeroExterior { get; set; }

        [MinLength(0)]
        [MaxLength(120)]
        public string NumeroInterior { get; set; }

        [Required]
        [MinLength(10)]
        [MaxLength(120)]
        public string ReferenciasGeograficas { get; set; }

        [Required]
        [Range(1, 999999)]
        public int ViviendaTipoId { get; set; }

        [MinLength(1)]
        [MaxLength(10)]
        public string codigoPostal { get; set; }

    }

    public class Update
    {
        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int SucursalFisicaID { get; set; }

        //[Required]
        //public long DireccionID { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(35)]
        public string Nombre { get; set; }

        [MinLength(0)]
        [MaxLength(18)]
        public string Telefono { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 2147483647)]
        public long AsentamientoID { get; set; }

        [Required]
        [Range(1, 999999)]
        public int vialidadTipoId { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(120)]
        public string NombreVialidad { get; set; }

        [Required]
        [Range(1, 999999)]
        public int orientacionVialidadTipoId { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(120)]
        public string NumeroExterior { get; set; }

        [MinLength(0)]
        [MaxLength(120)]
        public string NumeroInterior { get; set; }

        [Required]
        [MinLength(10)]
        [MaxLength(120)]
        public string ReferenciasGeograficas { get; set; }

        [Required]
        [Range(1, 999999)]
        public int ViviendaTipoId { get; set; }

        [MinLength(1)]
        [MaxLength(10)]
        public string codigoPostal { get; set; }

    }
}
