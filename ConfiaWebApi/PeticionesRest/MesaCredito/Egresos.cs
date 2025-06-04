using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.MesaCredito.Egresos
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
        [Range(typeof(decimal), "0", "79228162514264337593543950335")]
        public decimal egresos { get; set; }
        
        [Required]
        [Range(typeof(decimal), "0", "79228162514264337593543950335")]
        public decimal alimentacion { get; set; }

        [Required]
        [Range(typeof(decimal), "0", "79228162514264337593543950335")]
        public decimal tarjetaCreido { get; set; }

        [Required]
        [Range(typeof(decimal), "0", "79228162514264337593543950335")]
        public decimal rentaPagoVivienda { get; set; }

        [Required]
        [Range(typeof(decimal), "0", "79228162514264337593543950335")]
        public decimal serviciosDomesticos { get; set; }

        [Required]
        [Range(typeof(decimal), "0", "79228162514264337593543950335")]
        public decimal otros { get; set; }

        [Required]
        [Range(typeof(decimal), "0", "79228162514264337593543950335")]
        public decimal egresoTotal { get; set; }
    }

    public class Update 
    {
        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int id { get; set; }
        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int idPersona { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int idTipoPersona { get; set; }

        [Required]
        [Range(typeof(decimal), "0", "79228162514264337593543950335")]
        public decimal egresos { get; set; }

        [Required]
        [Range(typeof(decimal), "0", "79228162514264337593543950335")]
        public decimal alimentacion { get; set; }

        [Required]
        [Range(typeof(decimal), "0", "79228162514264337593543950335")]
        public decimal tarjetaCreido { get; set; }

        [Required]
        [Range(typeof(decimal), "0", "79228162514264337593543950335")]
        public decimal rentaPagoVivienda { get; set; }

        [Required]
        [Range(typeof(decimal), "0", "79228162514264337593543950335")]
        public decimal serviciosDomesticos { get; set; }

        [Required]
        [Range(typeof(decimal), "0", "79228162514264337593543950335")]
        public decimal otros { get; set; }

        [Required]
        [Range(typeof(decimal), "0", "79228162514264337593543950335")]
        public decimal egresoTotal { get; set; }
    }
}
