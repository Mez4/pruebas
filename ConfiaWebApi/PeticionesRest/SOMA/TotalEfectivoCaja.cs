using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.SOMA.TotalEfectivoCaja
{
    public class totalEfectivoCaja
    {
        public int CajaID { set; get; }
        public int cantidad { set; get; }
        public int catDenomEfectivoID { set; get; }

        public decimal totalXEfectivo { set; get; }

    }
    public class Get
    {


    }

    public class Add
    {
        [Required]

        public int cajaID { get; set; }
        [Required]
        public List<totalEfectivoCaja> totalEfectivoCaja { set; get; }

        /*         public int catDenomEfectivo { get; set; }
                [Required]

                public int cantidad { get; set; }

                [Required]

                public decimal totalXEfectivo { get; set; }

                [Required]

                public int cajaId { get; set; } */

    }

    public class Update : Add
    {



    }
}
