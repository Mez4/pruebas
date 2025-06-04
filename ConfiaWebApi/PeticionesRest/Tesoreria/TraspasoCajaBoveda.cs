using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Tesoreria.TraspasoCajaBoveda
{
    public class Get
    {
        [Range(minimum: 0, maximum: 9999)]
        public int CuentaID { get; set; }
    }
    public class Add
    {
        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int CajaID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int BovedaID { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string Observaciones { get; set; }

        [Range(minimum: 0, maximum: 9999999)]
        public int Importe { get; set; }

        [Range(minimum: 0, maximum: 9999)]
        public int Accion { get; set; }
    }
}
