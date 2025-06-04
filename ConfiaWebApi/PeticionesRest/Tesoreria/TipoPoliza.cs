using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Tesoreria.TipoPoliza
{
    public class Get
    {
        [Range(minimum:0, maximum:1)]
        public int id { get; set; }
    }

    public class Add
    {
        [Required]
        [MinLength(3)]
        [MaxLength(30)]
        public string Descripcion { get; set; }
    }

    public class Update
    {
        [Required]
        [Range(minimum:0, maximum:9999)]
        public int TipoPolizaID { get; set; }
        [Required]
        [MinLength(3)]
        [MaxLength(30)]
        public string Descripcion { get; set; }
    }
}
