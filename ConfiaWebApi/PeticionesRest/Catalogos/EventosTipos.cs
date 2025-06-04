using System;
using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.Catalogos
{
    public class EventosTipos
    {
        public class Get
        {
            [Range(minimum: 0, maximum: 9999)]
            public int eventoTipoId { get; set; }
        }

        public class Add
        {
            [Required]
            [MinLength(3)]
            [MaxLength(64)]
            public string eventoTipo { get; set; }

        }
        public class Update
        {


            [Range(minimum: 0, maximum: 9999)]
            public int eventoTipoId { get; set; }

            [Required]
            [MinLength(3)]
            [MaxLength(64)]
            public string eventoTipo { get; set; }

 

        }
    }
}
