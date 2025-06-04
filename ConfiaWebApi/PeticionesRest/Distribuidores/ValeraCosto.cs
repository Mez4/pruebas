using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Distribuidores.ValeraCosto
{
    public class Get
    {
        [Range(minimum: 0, maximum: 999999)]
        public int id { get; set; }
    }

    public class Add
    {
        [Required]
        public decimal Costo { get; set; }
    }

    public class Update
    {
        [Required]
        public int ValeraCostoID { get; set; }
        [Required]
        public decimal Costo { get; set; }

    }
}
