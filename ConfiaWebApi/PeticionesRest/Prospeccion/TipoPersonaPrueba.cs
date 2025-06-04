using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Prospeccion.TipoPersonaPrueba
{
    public class get
    {
        [Range(minimum: 0, maximum: 999999)]
        public int id { get; set; }
    }

    public class add
    {
        public string Clave { get; set; }
        public string Descripcion { get; set; }
    }

    public class update
    {
        [Required]
        public int TipoPersonaID { get; set; }

        [Required]
        public string Clave { get; set; }
        [Required]
        public string Descripcion { get; set; }
    }
}
