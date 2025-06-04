using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.MesaCredito.Tuberia
{
    public class Get
    {
        [Range(minimum: 0, maximum: 9999)]
        public int id { get; set; }

    }

    public class Add
    {
        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int idPersona { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int idTipoPersona { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string proceso { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string resultado { get; set; }

    }

    public class Update
    {
        [Range(minimum: 0, maximum: 9999)]
        public int id { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int idPersona { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int idTipoPersona { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string proceso { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string resultado { get; set; }
    }
}
