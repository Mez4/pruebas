using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Creditos.Proteccion
{
    public class Get
    {

        [Range(minimum: 0, maximum: 99999)]
        public int ProteccionID { get; set; }


    }
    public class Get2
    {

        [Range(minimum: 0, maximum: 99999)]
        public int ProteccionID { get; set; }


    }

    public class Add
    {

        [Range(minimum: 0, maximum: 99999)]
        public int ProteccionID { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int Minimo { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int Maximo { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int Monto { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 255)]
        public int DistribuidorNivelID { get; set; }

        public int OrigenNivelID { get; set; }


    }



    public class Update
    {

        [Range(minimum: 0, maximum: 99999)]
        public int ProteccionID { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int Minimo { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int Maximo { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int Monto { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 255)]
        public int DistribuidorNivelID { get; set; }

        public int OrigenNivelID { get; set; }
    }
}