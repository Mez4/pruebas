using System;
using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.Catalogos
{
    public class ReferenciasTipos
    {
        public class Get
        {
            [Range(minimum: 0, maximum: 9999)]
            public int referenciaTipoId { get; set; }
        }

        public class Add
        {
            [Required]
            [MinLength(3)]
            [MaxLength(30)]
            public string referenciaTipo { get; set; }

            public bool Activo { get; set; } = true;

            public bool esFamiliar { get; set; } = true;

            public bool esAval { get; set; } = true;


        }
        public class Update
        {


            [Range(minimum: 0, maximum: 9999)]
            public int referenciaTipoId { get; set; }

            [Required]
            [MinLength(3)]
            [MaxLength(30)]
            public string referenciaTipo { get; set; }

            public bool Activo { get; set; } = true;

            public bool esFamiliar { get; set; } = true;

            public bool esAval { get; set; } = true;



        }
    }
}
