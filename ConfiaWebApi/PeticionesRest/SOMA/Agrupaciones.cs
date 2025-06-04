using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.SOMA.Agrupaciones
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
        public string descripcion { get; set; }


        [Required]
        public bool activo { get; set; }




    }

    public class Actualizar : Agregar
    {

        [Range(minimum: 0, maximum: 999999)]
        public int AgrupacionID { get; set; }

    }
}
