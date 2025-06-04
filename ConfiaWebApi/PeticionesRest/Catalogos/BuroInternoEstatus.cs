using System;
using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.Catalogos
{
    public class BuroInternoEstatus
    {
        public class Get
        {
            [Range(minimum: 0, maximum: 9999)]
            public int BuroInternoEstatusID { get; set; }
        }

        public class Add
        {
            [Required]
            [MinLength(3)]
            [MaxLength(64)]
            public string Nombre { get; set; }

            [Required]
            [MinLength(3)]
            [MaxLength(120)]
            public string Color { get; set; }
        }
        public class Update
        {
            [Range(minimum: 0, maximum: 9999)]
            public int BuroInternoEstatusID { get; set; }

            [Required]
            [MinLength(3)]
            [MaxLength(64)]
            public string Nombre { get; set; }

            [Required]
            [MinLength(3)]
            [MaxLength(120)]
            public string Color { get; set; }
        }

    }
}
