using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.MesaCredito.TipoPersona
{
    public class Get
    {
        [Range(minimum: 0, maximum: 9999)]
        public int id { get; set; }
    }

    public class Add
    {
        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string clave { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string descripcion { get; set; }
    }

    public class Update
    {

        [Range(minimum: 0, maximum: 9999)]
        public int id { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string clave { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string descripcion { get; set; }
    }

}
