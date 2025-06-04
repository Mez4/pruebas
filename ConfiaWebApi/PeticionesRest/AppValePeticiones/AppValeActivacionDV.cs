using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.AppValePeticiones.AppValeActivacionDV
{
    public class DatosDV
    {
        [Required]
        //    [StringLength(10)]
        public string telefono { get; set; }


    }

}
