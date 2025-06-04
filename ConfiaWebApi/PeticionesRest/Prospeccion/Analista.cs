using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Prospeccion.Analista
{
    public class get
    {
        [Range(minimum: 0, maximum: 999999)]
        public int id { get; set; }

    }


      public class add
    {

          [Required]
        public int PersonaID { get; set; }
        
        [Required]
        public int MesaCreditoID { get; set; }
        
        
        [Required]
        public bool Activo { get; set; }
    }
}
