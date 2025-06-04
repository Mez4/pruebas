using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.MesaCredito.ExperienciaVentas
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
        [MinLength(1)]
        [MaxLength(100)]
        public string nombreEmpresa { get; set; }

        [Required]
        public DateTime fechaIngreso { get; set; }


        [Required]
        [Range(typeof(decimal), "0", "79228162514264337593543950335")]
        public decimal limiteCredito { get; set; }


        [Required]
        [Range(typeof(decimal), "0", "79228162514264337593543950335")]
        public decimal creditoDisponible { get; set; }


        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string status { get; set; }
    }

    public class Masivo
    {
      

        [Required]
        public string parametros { get; set; }

       
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
        [MinLength(1)]
        [MaxLength(100)]
        public string nombreEmpresa { get; set; }

        [Required]
        public DateTime fechaIngreso { get; set; }


        [Required]
        [Range(typeof(decimal), "0", "79228162514264337593543950335")]
        public decimal limiteCredito { get; set; }


        [Required]
        [Range(typeof(decimal), "0", "79228162514264337593543950335")]
        public decimal creditoDisponible { get; set; }


        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string status { get; set; }
    }
}
