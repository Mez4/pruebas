using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Cobranza.Motivos
{
    public class get
    {
        [Range(minimum: 0, maximum: 999999)]
        public int id { get; set; }
    }

    public class add
    {
        public string Motivo { get; set; }

        public Boolean Activo { get; set; }
    }

    public class update
    {
        [Required]
        public int MotivoID { get; set; }

        [Required]
        public string Motivo { get; set; }
        [Required]
        public Boolean Activo { get; set; }
    }

}
