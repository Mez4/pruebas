using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Balances.Balances
{
    public class Get
    {
        
        [Range(minimum: 0, maximum: 9999)]
        public int balanceId { get; set; }

    }
    public class Add 
    {
        [Required]
        [MinLength(1)]
        [MaxLength(64)]
        public string balanceNombre { get; set; }

        public bool balanceCancelado { get; set; } = false;

    }

    public class Update 
    {
        [Range(minimum: 0, maximum: 9999)]
        public int balanceId { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(64)]
        public string balanceNombre { get; set; }

        public bool balanceCancelado { get; set; } = false;


    }
}
