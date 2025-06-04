using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Creditos.CondicionDetalleVW
{
    public class Get
    {
        // [Required]
        // [Range(minimum: 0, maximum: 99999)]
        public int ProductoID { get; set; }


        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int SucursalId { get; set; }


        [Required]
        [Range(minimum: 0, maximum: 99999999)]
        public int DistribuidorID { get; set; }


        public int importe { get; set; }

    }
}
