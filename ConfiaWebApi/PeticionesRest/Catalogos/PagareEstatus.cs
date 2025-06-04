using System;
using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.Catalogos
{
    public class PagareEstatus
    {
        public class Get
        {
            [Range(minimum: 0, maximum: 9999)]
            public int pagareEstatusId { get; set; }
        }

        public class Add
        {
            [Required]
            [MinLength(3)]
            [MaxLength(64)]
            public string pagareEstatusDesc { get; set; }

        }
        public class Update
        {


            [Range(minimum: 0, maximum: 9999)]
            public int pagareEstatusId { get; set; }


            [Required]
            [MinLength(3)]
            [MaxLength(64)]
            public string pagareEstatusDesc { get; set; }


        }
    }
}
