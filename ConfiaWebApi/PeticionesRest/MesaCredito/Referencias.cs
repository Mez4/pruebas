using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;


namespace ConfiaWebApi.PeticionesRest.MesaCredito.Referencias
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
        [Range(minimum: 0, maximum: 9999)]
        public int numeroReferencia { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string nombre { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string primerApellido { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string segundoApellido { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string parentesco { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string celular { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(200)]
        public string domicilio { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string edad { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string status { get; set; }

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
        [Range(minimum: 0, maximum: 9999)]
        public int numeroReferencia { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string nombre { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string primerApellido { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string segundoApellido { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string parentesco { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string celular { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(200)]
        public string domicilio { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string edad { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string status { get; set; }
    }


}
