using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.MesaCredito.UsuarioAnalistaMesa
{
    public class Get
    {
        [Range(minimum: 0, maximum: 9999)]
        public int UsuarioAnalistaMesaID { get; set; }
    }

    public class Add
    {

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public int UsuarioID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int MesaCreditoID { get; set; }

        [Required]
        public bool Activo { get; set; }


        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public Int64? PersonaID { get; set; }






    }

    public class Update
    {
        [Range(minimum: 0, maximum: 9999)]
        public int UsuarioAnalistaMesaID { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public int UsuarioID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int MesaCreditoID { get; set; }

        [Required]
        public bool Activo { get; set; }


        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public Int64? PersonaID { get; set; }
    }
}
