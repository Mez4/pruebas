using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Prospeccion.TuberiaResultado
{
    public class get
    {
        [Range(minimum: 0, maximum: 999999)]
        public int id { get; set; }
    }
    public class add
    {
        public string Resultado { get; set; }
    }

    public class update
    {
        [Required]
        public int TuberiaResultadoID { get; set; }

        [Required]
        public string Resultado { get; set; }


    }
}

