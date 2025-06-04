using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.General.Zonas
{
    public class Get
    {
        [Range(minimum: 0, maximum: 99999)]
        public int ZonaID { get; set; }

        public int DirectorID { get; set; }
    }

    public class GetByEncargado
    {
        [Range(minimum: 0, maximum: 99999)]
        public int PersonaID { get; set; }
    }

    public class Add
    {
        [Required]
        [MinLength(1)]
        [MaxLength(120)]
        public string ZonaNombre { get; set; } = "";

        [Required]
        public int PersonaResponsableID { get; set; } = 0;

        [Required]
        public bool Activa { get; set; } = false;

        [Required]
        public DateTime CreacionFecha { get; set; } = DateTime.Now;

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int CreacionUsuarioID { get; set; } = 0;


    }

    public class Update
    {
        [Range(minimum: 0, maximum: 99999)]
        public int ZonaID { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(120)]
        public string ZonaNombre { get; set; } = "";

        [Required]
        public bool Activa { get; set; } = false;

        [Required]
        public DateTime CreacionFecha { get; set; } = DateTime.Now;

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int CreacionUsuarioID { get; set; } = 0;

        [Required]
        public int PersonaResponsableID { get; set; } = 0;
    }

    public class addSucursal
    {
        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int ZonaID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int id { get; set; }
    }
}
