using System;
using System.ComponentModel.DataAnnotations;

namespace ConfiaWebApi.PeticionesRest.SOMA.MovimientosAgrupa
{
    public class Get
    {
        [Range(minimum: 0, maximum: 9999)]
        [Required]
        public int movAgrupaId { get; set; }
    }

    public class Add
    {
        [Required]
        public string clave { get; set; }

        [Required]
        public string nombre { get; set; }


        [Required]
        public bool estatus { get; set; }


    }

    public class Update : Add
    {

    }
}
