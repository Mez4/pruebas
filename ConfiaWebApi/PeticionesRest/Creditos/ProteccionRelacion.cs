using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Creditos.ProteccionRelacion
{
    public class Get
    {
        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int ProteccionCabeceroDetalle { get; set; }


    }

    public class Add
    {

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int ProteccionCabeceroID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int ProteccionID { get; set; }

        public List<int> ProteccionIDS { get; set; }

    }
    public class AddRelacion
    {
        [Range(minimum: 0, maximum: 99999)]
        public int ProteccionIDDetalle { get; set; }

        [Range(minimum: 0, maximum: 99999)]
        public int ProteccionID { get; set; }

        [Range(minimum: 0, maximum: 99999)]
        public int ProteccionCabeceroID { get; set; }

        public List<int> ProteccionIDS { get; set; }
    }
}