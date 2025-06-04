using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Prospeccion.MatrizProcesos
{
    public class get
    {
        [Range(minimum: 0, maximum: 999999)]
        public int id { get; set; }
    }
    public class add
    {
        public int ProductoId { get; set; }

        public bool Activo { get; set; }
    }

    public class update
    {
        [Required]
        public int MatrizProcesosID { get; set; }

        [Required]
        public int ProductoId { get; set; }

        [Required]
        public bool Activo { get; set; }


    }
}
