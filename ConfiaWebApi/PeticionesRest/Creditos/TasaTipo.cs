using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Creditos.TasaTipo
{
    public class Get
    {
        [MaxLength(1)]
        public string Id { get; set; }
    }

    public class Add
    {
        [Required]
        [MinLength(1)]
        [MaxLength(1)]
        public string TasaTipoId { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(19)]
        public string TasaTipo { get; set; }

        [Required]
        public int capitalizacionesPorMes { get; set; }

        [Required]
        public int capitalizacionesPorAnio { get; set; }

    }

    public class Update
    {
        [Required]
        [MinLength(1)]
        [MaxLength(1)]
        public string TasaTipoId { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(19)]
        public string TasaTipo { get; set; }

        [Required]
        public int capitalizacionesPorMes { get; set; }

        [Required]
        public int capitalizacionesPorAnio { get; set; }

    }
}
