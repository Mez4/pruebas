using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Distribuidores.ValeraSeriesTipos
{
    public class get
    {
        [Range(minimum: 0, maximum: 999999)]
        public int id { get; set; }
    }

    public class add
    {
        [Required]
        public string Tipo { get; set; }
    }

    public class update
    {
        [Required]
        public int ValeraSeriesTiposID { get; set; }
        
        [Required]
        public string Tipo { get; set; }
    }
}
