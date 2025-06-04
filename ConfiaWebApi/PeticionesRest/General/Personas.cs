using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.General.Personas
{
    public class Persona
    {
        [Required]
        [MinLength(3)]
        [MaxLength(120)]
        public string Nombre { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(120)]
        public string ApellidoPaterno { get; set; }

        //[Required]
        //[MinLength(0)]
        //[MaxLength(120)]
        public string ApellidoMaterno { get; set; }

        [Required]
        public DateTime FechaNacimiento { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(120)]
        public string LugarNacimiento { get; set; }

        [Required]
        [MinLength(18)]
        [MaxLength(18)]
        public string CURP { get; set; }

        [Required]
        [MinLength(12)]
        [MaxLength(13)]
        public string RFC { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(1)]
        public string SexoID { get; set; }

        //[Range(minimum: 1, maximum: 9999999)]
        public string EstadoCivilID { get; set; }

        public int EscolaridadID { get; set; }


        public int DependientesEconomicos { get; set; }


        public string TelefonoDomicilio { get; set; }

        [Required]
        [MinLength(10)]
        [MaxLength(17)]
        public string TelefonoMovil { get; set; }

        public string CorreoElectronico { get; set; }

        [MinLength(0)]
        [MaxLength(250)]
        public string NombreConyuge { get; set; }

        // [Required]
        // [MinLength(0)]
        [MaxLength(250)]
        public string Observaciones { get; set; }

        [Required]
        [Range(minimum: 1, 99999)]
        public int identificacionTipoId { get; set; }

        [Required]
        [MinLength(10)]
        [MaxLength(250)]
        public string identificacionNumero { get; set; }

        // [Required]
        // [MinLength(3)]
        // [MaxLength(250)]
        public string NombreCompleto { get; set; }

        public Distribuidores.Cliente.Agregar AgregarCliente { get; set; }

        public Prospeccion.Prospecto.Agregar AgregarProspecto { get; set; }

        public General.Directores.Agregar AgregarDirector { get; set; }
    }
}