using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Tesoreria.Rubro
{
    public class Get
    {
        [Range(minimum: 0, maximum: 9999)]
        public int RubroID { get; set; }
    }
    public class Add 
    {
        [Required]
        [MinLength(1)]
        [MaxLength(10)]
        public string Descripcion { get; set; }
    }
    public class Update 
    {

        [Range(minimum: 0, maximum: 9999)]
        public int RubroID { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(10)]
        public string Descripcion { get; set; }

    }
}
