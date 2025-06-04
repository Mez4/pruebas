using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace ConfiaWebApi.PeticionesRest.SOMA.GralPersonas
{
    public class Get
    {
        [Range(minimum: 0, maximum: 999999)]
        public int PersonaID { get; set; }

    }

    public class Agregar
    {
        [Required]
        [MinLength(3)]
        [MaxLength(50)]
        public string Nombre { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(50)]
        public string ApellidoPaterno { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(50)]
        public string ApellidoMaterno { get; set; }

        [Required]
        public DateTime FechaNacimiento { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(50)]
        public string LugarNacimiento { get; set; }


        [Required]
        [MinLength(3)]
        [MaxLength(50)]
        public string CURP { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(50)]
        public string RFC { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(1)]
        public string SexoID { get; set; }

        [Required]
        [MinLength(1)]
        [MaxLength(1)]
        public string EstadoCivilID { get; set; }

        [Required]
        [Range(minimum: 1, maximum: 999999)]
        public int EscolaridadID { get; set; }


        [Required]
        public decimal IngresosMensuales { get; set; }


        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int DependientesEconomicos { get; set; }

        [Required]
        [MinLength(10)]
        [MaxLength(18)]
        public string TelefonoDomicilio { get; set; }


        [Required]
        [MinLength(10)]
        [MaxLength(18)]
        public string TelefonoMovil { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(50)]
        public string CorreoElectronico { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(50)]
        public string NombreConyuge { get; set; }


        [Range(minimum: 0, maximum: 999999)]
        public int? BuroInternoEstatusID { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(50)]
        public string Observaciones { get; set; }

        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public int identificacionTipoId { get; set; }


        [Required]
        [MinLength(3)]
        [MaxLength(50)]
        public string identificacionNumero { get; set; }


        [Range(minimum: 0, maximum: 999999)]
        public Int64? canjeValeSolicitudId { get; set; }


        [Range(minimum: 0, maximum: 999999)]
        public int? GrupoID { get; set; }

        [Required]
        [MinLength(3)]
        [MaxLength(60)]
        public string NombreCompleto { get; set; }


        [Required]
        public DateTime CreacionFecha { get; set; }


        [Required]
        [Range(minimum: 0, maximum: 999999)]
        public Int64 CreacionPersonaID { get; set; }


        [MinLength(3)]
        [MaxLength(60)]
        public string CreacionUsuarioID { get; set; }

        [MinLength(3)]
        [MaxLength(60)]
        public string SoundexNombre { get; set; }

        [MinLength(3)]
        [MaxLength(60)]
        public string SoundexAPaterno { get; set; }

        [MinLength(3)]
        [MaxLength(60)]
        public string SoundexAMaterno { get; set; }


        [Range(minimum: 0, maximum: 999999)]
        public Int64? SACId { get; set; }


        public DateTime? ModificacionFecha { get; set; }


        [Range(minimum: 0, maximum: 999999)]
        public Int64? ModificacionPersonaID { get; set; }


        [Range(minimum: 0, maximum: 999999)]
        public string ModificacionUsuarioID { get; set; }




    }

    public class Update : Agregar
    {


    }
}
