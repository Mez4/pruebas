using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using ConfiaWebApi.PeticionesRest.General.Personas;

namespace ConfiaWebApi.PeticionesRest.General.Renapo
{
    public class Get
    {
        // [Range(minimum: 1, maximum: 99999999)]
        //  [MinLength(18)]
        // [MaxLength(18)]
        public string CURP { get; set; }

        public bool status { get; set; }

        public int? ProductoID { get; set; }
    }
}
