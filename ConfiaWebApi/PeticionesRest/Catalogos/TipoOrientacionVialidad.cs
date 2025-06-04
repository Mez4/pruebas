using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Catalogos.TipoOrientacionVialidad
{
    public class Get
    {
        //[Range(minimum:1, maximum:9999)]
        public int id { get; set; }
    }

    public class Add
    {
        [Required]
        [MinLength(3)]
        [MaxLength(30)]
        public string orientacionVialidadTipo { get; set; }
    }

    public class Update
    {
        [Required]
        public int orientacionVialidadTipoId { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(30)]
        public string orientacionVialidadTipo { get; set; }
    }
}
