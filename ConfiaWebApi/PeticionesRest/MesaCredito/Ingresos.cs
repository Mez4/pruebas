using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.MesaCredito.Ingresos
{
    public class Get
    {
        [Range(minimum: 0, maximum: 9999)]
        public int id { get; set; }
    }

    public class Add 
    {
        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int idPersona { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int idTipoPersona { get; set; }

        [Required]
        public float ingresoSueldo { get; set; }

        [Required]
        public float gananciasDV { get; set; }

        [Required]
        public float ingresoConyuge { get; set; }

        [Required]
        public float otrosIngresos { get; set; }

        [Required]
        public float ingresoTotal { get; set; }
    }

    public class Update 
    {
        [Range(minimum: 0, maximum: 9999)]
        public int id { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int idPersona { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int idTipoPersona { get; set; }

        [Required]
        public float ingresoSueldo { get; set; }

        [Required]
        public float gananciasDV { get; set; }

        [Required]
        public float ingresoConyuge { get; set; }

        [Required]
        public float otrosIngresos { get; set; }

        [Required]
        public float ingresoTotal { get; set; }
    }
}
