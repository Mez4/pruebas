using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Catalogos
{
    public class IdentificacionesTipos
    {
        public class Get
        {
            [Range(minimum: 0, maximum: 9999)]
            public int IdentificacionTipoId { get; set; }
        }
        public class Add
        {
            [Required]
            [MinLength(3)]
            [MaxLength(32)]
            public string IdentificacionDesc { get; set; }


            public bool Activo { get; set; } = true;
        }
        public class Update
        {


            [Range(minimum: 0, maximum: 9999)]



            public int IdentificacionTipoId { get; set; }


            [Required]
            [MinLength(3)]
            [MaxLength(32)]
            public string IdentificacionDesc { get; set; }


            public bool Activo { get; set; } = true;
        }

    }
}
