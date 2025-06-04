using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Creditos.ComisionDetalle
{
    public class Get
    {
        [Range(minimum: 0, maximum: 99999)]
        public int ProductoID { get; set; }


        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int ComisionesID { get; set; }


        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int RenglonId { get; set; }

    }

    public class Add
    {
        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int ProductoID { get; set; }


        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int ComisionesID { get; set; }


        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int RenglonId { get; set; }


        [Required]
        [Range(minimum: 0, maximum: 255)]
        public int DistribuidorNivelID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 255)]
        public int DistribuidorNivelIDOrigen { get; set; }


        public bool Activo { get; set; } = true;


        [Required]
        [Range(minimum: -9999999, maximum: 9999999)]
        public int DiasMin { get; set; }


        [Required]
        [Range(minimum: -9999999, maximum: 9999999)]
        public int DiasMax { get; set; }

        [Required]
        public decimal PorcComision { get; set; }

        [Required]
        public decimal PorcComisionReal { get; set; }

        [Required]
        public decimal porcMonedero { get; set; }

        [Required]
        public decimal porcMonederoReal { get; set; }

    }

    public class Update
    {
        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int ProductoID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int ComisionesID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int RenglonId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 255)]
        public int DistribuidorNivelID { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 255)]
        public int DistribuidorNivelIDOrigen { get; set; }

        public bool Activo { get; set; } = true;

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int DiasMin { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 99999)]
        public int DiasMax { get; set; }

        [Required]
        public decimal PorcComision { get; set; }

        [Required]
        public decimal PorcComisionReal { get; set; }

        [Required]
        public decimal porcMonedero { get; set; }

        [Required]
        public decimal porcMonederoReal { get; set; }
    }
}
