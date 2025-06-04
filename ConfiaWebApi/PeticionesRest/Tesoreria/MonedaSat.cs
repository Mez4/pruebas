using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Tesoreria.MonedaSat
{
    public class Get
    {
        [Range(minimum:0, maximum:9999)]
        public int id { get; set; }
    }


    public class Add
    {
        [Required]
        public string NombreMoneda { get; set; }
        [Required]
        public decimal TipoCambio { get; set; }
        [Required]
        public DateTime Fecha { get; set; }
        [Required] 
        public string ClaveMonedaSat { get; set; }
    }

    public class Update
    {
        
        [Required]
        [Range(minimum: 1, maximum: 9999)]
        public int MonedaSatID { get; set; }
        [Required] 
        public string NombreMoneda { get; set; }
        [Required] 
        public decimal TipoCambio { get; set; }
        [Required] 
        public DateTime Fecha { get; set; }
        [Required] 
        public string ClaveMonedaSat { get; set; }
    }
}
