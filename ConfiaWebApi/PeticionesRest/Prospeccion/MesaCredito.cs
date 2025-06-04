using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Prospeccion.MesaCredito
{
    public class get
    {
        // [Range(minimum: 0, maximum: 999999)]
        public int id { get; set; }

    }

    public class add
    {

        public string Nombre { get; set; }
        public string Clave { get; set; }

        public bool Activo { get; set; }
    }

    public class update
    {
        // [Required]
        public int MesaCreditoID { get; set; }


        [Required]
        public string Nombre { get; set; }

        [Required]
        public string Clave { get; set; }

        [Required]
        public bool Activo { get; set; }

    }

    public class getProceso
    {
        // [Range(minimum: 0, maximum: 999999)]
        public int id { get; set; }

    }

}
