using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.SOMA.BitacoraCambios
{
    public class Get
    {
        [Range(minimum: 0, maximum: 999999)]
        public int AgrupacionID { get; set; }

    }

    public class Agregar
    {
        [Required]
        [MinLength(3)]
        [MaxLength(50)]
        public string Accion { get; set; }


        [Required]
        [MinLength(3)]
        [MaxLength(50)]
        public string Modulo { get; set; }




    }

    public class Actualizar : Agregar
    {



    }
}
