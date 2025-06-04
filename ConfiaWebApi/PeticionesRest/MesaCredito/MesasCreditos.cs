using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.MesaCredito.MesasCreditos
{
 
    public class Get
    {
        [Range(minimum: 0, maximum: 9999)]
        public int MesaCreditoID { get; set; }
    }

    public class Add
    {

    
        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string Nombre { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string Clave { get; set; }


        [Required]
        public bool Activo { get; set; }






    }

    public class Update
    {
        [Range(minimum: 0, maximum: 9999)]
        public int MesaCreditoID { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string Nombre { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string Clave { get; set; }


        [Required]
        public bool Activo { get; set; }

    }

}
