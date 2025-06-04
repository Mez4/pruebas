using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Prospeccion.EstatusValidacion
{
    public class get
    {
        [Range(minimum: 0, maximum: 999999)]
        public int id { get; set; }
    }
    public class add
    {
        public string Estatus { get; set; }
    }

    public class update
    {
        [Required]
        public int EstatusValidacionID { get; set; }

        [Required]
        public string Estatus { get; set; }


    }
}

