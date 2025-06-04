using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.MesaCredito.ProductosCredMesa
{
    public class Get
    {
        [Range(minimum: 0, maximum: 9999)]
        public int ProdCredMesaID { get; set; }
    }

    public class Add
    {
        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int MesaCreditoID { get; set; }


        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int ProductoID { get; set; }


        [Required]
        public bool Activo { get; set; }

    }

    public class Update
    {
        [Range(minimum: 0, maximum: 9999)]
        public int ProdCredMesaID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int MesaCreditoID { get; set; }


        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int ProductoID { get; set; }


        [Required]
        public bool Activo { get; set; }

    }


}
