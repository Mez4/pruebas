using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Catalogos.TipoVialidad
{
    public class get
    {
        [Range(minimum:0, maximum:9999)]
        public int Id { get; set; }
    }

    public class add
    {
        [Required]
        [MinLength(3)]
        [MaxLength(30)]
        public string vialidadTipo { get; set; }
    }

    public class update
    {
        [Required]
        public int vialidadTipoId { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(30)]
        public string vialidadTipo { get; set; }
    }
}
