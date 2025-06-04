using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.MesaCredito.EstatusCredito
{
    public class Get
    {
        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int id { get; set; }

    }

    public class Add
    {
       
        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string estatusCredito { get; set; }
    }

    public class Update
    {
        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int id { get; set; }


        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string estatusCredito { get; set; }
    }


}
