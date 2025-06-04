using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.MesaCredito.Carpeta
{
    public class Get
    {
        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int id { get; set; }
    }
    public class Add
    {
        [Required]
        [MinLength(1)]
        [MaxLength(100)]
        public string carpeta { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int productoId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int estatusCreditoId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int solicitudCreditoId { get; set; }

        [Required]
        public DateTime fechaAlta { get; set; }

        [Required]
        public DateTime fechaMod { get; set; }

        [Required]
        public DateTime fechaBaja { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int usuarioID { get; set; }

        [Required]
        public bool activo { get; set; }
    }

    public class Update
    {
        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int id { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(100)]
        public string carpeta { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int productoId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int estatusCreditoId { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int solicitudCreditoId { get; set; }

        [Required]
        public DateTime fechaAlta { get; set; }

        [Required]
        public DateTime fechaMod { get; set; }

        [Required]
        public DateTime fechaBaja { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int usuarioID { get; set; }

        [Required]
        public bool activo { get; set; }

    }


}
