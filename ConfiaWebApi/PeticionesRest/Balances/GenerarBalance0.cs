using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Balances.GenerarBalances0
{
    public class Get
    {


    }
    public class Add
    {
        [Required]
        public int periodoId { get; set; }

        [Required]
        public int ctaBanco { get; set; }

        [Required]
        public int producto { get; set; }

        [Required]
        public int tipoMovimiento { get; set; }

        [Required]
        public int accion { get; set; }

        [Required]
        public int BalanceIDTemp { get; set; }



    }

    public class Update
    {


    }
}
