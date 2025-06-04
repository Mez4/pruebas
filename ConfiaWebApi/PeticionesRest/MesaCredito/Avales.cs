using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.MesaCredito.Avales
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
        public int idProspecto { get; set; }

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
        public string rfc { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string segundoApellido { get; set; }

        public DateTime fechaNacimiento { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string idSexo { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string curp { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string correo { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string telefono { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string celular { get; set; }

        [Range(minimum: 0, maximum: 9999)]
        public int idEstadoCivil { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string dependientesEconomicos { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string nombreConyuge { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string parentesco { get; set; }


        [MinLength(1)]
        [MaxLength(255)]
        public string status { get; set; }





    }

    public class Update
    {
        [Range(minimum: 0, maximum: 9999)]
        public int id { get; set; }


        [Required]
        [Range(minimum: 0, maximum: 9999)]
        public int idProspecto { get; set; }

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
        public string rfc { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string segundoApellido { get; set; }

        public DateTime fechaNacimiento { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string idSexo { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string curp { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string correo { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string telefono { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string celular { get; set; }

        [Range(minimum: 0, maximum: 9999)]
        public int idEstadoCivil { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string dependientesEconomicos { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string nombreConyuge { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(255)]
        public string parentesco { get; set; }


        [MinLength(1)]
        [MaxLength(255)]
        public string status { get; set; }
    }
}
