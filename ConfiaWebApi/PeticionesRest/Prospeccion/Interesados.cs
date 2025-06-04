using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Prospeccion.Interesados
{
    public class Agregar
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
        [MinLength(1)]
        [MaxLength(1)]
        public string SexoID { get; set; }

        public string TelefonoDomicilio { get; set; }


        [Required]
        [MinLength(10)]
        [MaxLength(10)]
        public string TelefonoMovil { get; set; }
        public int AsentamientoID { get; set; }
        public string calle { get; set; }
        public string numeroExterior { get; set; }
        public string localidad { get; set; }
        public int interesadoId { get; set; }

        public string CURP { get; set; }
    }

    public class InteresadoGerente
    {
        public int GereneteId { get; set; }
    }
    public class Update
    {
        public int InteresadosID { get; set; }

        public bool InicioProceso { get; set; }

        public int GerenteID { get; set; }
    }
    public class UpdateDescartado
    {
        [Required]
        public int InteresadosID { get; set; }
        public bool Descartado { get; set; }
        public string ObservacionesDescartado { get; set; }


    }

    public class GetInteresado
    {
        public int CreacionPersonaID { get; set; }

        public int InteresadosID { get; set; }

        public int SucursalID { get; set; }
    }

    public class VerificarCURP
    {
        public string CURP { get; set; }
    }
}