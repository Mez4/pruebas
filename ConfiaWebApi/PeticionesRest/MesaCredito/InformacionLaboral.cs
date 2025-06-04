using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.MesaCredito.InformacionLaboral
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
        [MaxLength(50)]
        public string tipoPersona { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(150)]
        public string empresa { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(150)]
        public string puesto { get; set; }

        [Required]
        [Range(typeof(decimal), "0", "79228162514264337593543950335")]
        public decimal sueldo { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(150)]
        public string antiguedad { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(20)]
        public string telefono { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string calle { get; set; }

   
        [MinLength(1)]
        [MaxLength(50)]
        public string numeroInterior { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string numeroExterior { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int idAsentamiento { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string localidad { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(5)]
        public string cp { get; set; }
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
        [MaxLength(50)]
        public string tipoPersona { get; set; }

  
        [MinLength(1)]
        [MaxLength(150)]
        public string empresa { get; set; }

     
        [MinLength(1)]
        [MaxLength(150)]
        public string puesto { get; set; }

   
        [Range(typeof(decimal), "0", "79228162514264337593543950335")]
        public decimal sueldo { get; set; }

    
        [MinLength(1)]
        [MaxLength(150)]
        public string antiguedad { get; set; }

    
        [MinLength(1)]
        [MaxLength(20)]
        public string telefono { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string calle { get; set; }

        [MinLength(1)]
        [MaxLength(50)]
        public string numeroInterior { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string numeroExterior { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int idAsentamiento { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string localidad { get; set; }


        [MinLength(1)]
        [MaxLength(5)]
        public string cp { get; set; }
    }
}
