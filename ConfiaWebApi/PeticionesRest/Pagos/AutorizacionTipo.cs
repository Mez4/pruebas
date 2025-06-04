using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.Pagos.AutorizacionTipo
{
    public class Get
    {
        [Range(minimum: 0, maximum: 9999)]
        public int Id { get; set; }
    }

    public class Add
    {
        [Required]
        [MinLength(1)]
        [MaxLength(64)]
        public string AutorizacionTipo { get; set; }

        [Required]
        public decimal Parametro { get; set; }

        public bool Activo { get; set; } = true;

        [Required]
        public decimal Parametro2 { get; set; }

    }

    public class Update
    {
        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int AutorizacionTipoID { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(64)]
        public string AutorizacionTipo { get; set; }

        [Required]
        public decimal Parametro { get; set; }

        public bool Activo { get; set; } = true;

        [Required]
        public decimal Parametro2 { get; set; }

    }
}
