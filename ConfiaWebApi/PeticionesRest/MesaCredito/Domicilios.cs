using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.MesaCredito.Domicilios
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
        [MaxLength(255)]
        public string calle { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string numeroInterior { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string numeroExterior { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string colonia { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string localidad { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(5)]
        public char[] cp { get; set; }


        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string municipio { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string estado { get; set; }
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
        [MinLength(1)]
        [MaxLength(255)]
        public string calle { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string numeroInterior { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string numeroExterior { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string colonia { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string localidad { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(5)]
        public string cp { get; set; }


        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string municipio { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string estado { get; set; }

    }

}
