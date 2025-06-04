using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Bancos
{
    public class CorresponsalesPago
    {
        public class Get
        {
            [Range(minimum: 0, maximum: 9999)]
            public int CorresponsalId { get; set; }
        }
        public class Add
        {
            [Required]
            [MinLength(1)]
            [MaxLength(64)]
            public string CorresponsalDesc { get; set; }
            public decimal comision { get; set; } = 0;
            public int ordenEnTabla { get; set; } = 0;
            public bool mostrarEnTabla { get; set; } = true;
            public decimal montoMaximoPago { get; set; } = 0;

        }
        public class Update
        {
            [Required]
            [Range(minimum: 1, maximum: 9999)]
            public byte CorresponsalId { get; set; }

            [Required]
            [MinLength(1)]
            [MaxLength(64)]
            public string CorresponsalDesc { get; set; }
            public decimal comision { get; set; } = 0;
            public int ordenEnTabla { get; set; } = 0;
            public bool mostrarEnTabla { get; set; } = true;
            public decimal montoMaximoPago { get; set; } = 0;
        }
    }
}
