using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Balances.GenerarBalanza
{
    public class Get
    {


    }
    public class Add
    {


        [Required]
        public string FechaInicio { get; set; }

        [Required]
        public string FechaFin { get; set; }

        [Required]
        public int ProductoID { get; set; }




    }

    public class Update
    {


    }
}
