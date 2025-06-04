using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Creditos.SucursalesProteccionVW
{
    public class Get
    {
        public int ProductoID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int SucursalID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int ProteccionCabeceroID { get; set; }
    }
}