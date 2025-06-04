using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using ConfiaWebApi.PeticionesRest.General.Personas;

namespace ConfiaWebApi.PeticionesRest.Archivo.ArchivoPersona
{
    public class Get
    {
        [Range(minimum: 1, maximum: 99999999)]
        public int? PersonaID { get; set; }
        public string NombreCompleto { get; set; }
        public int? DistribuidorID { get; set; }
        public int? ClienteID { get; set; }
        public int? CoordinadorID { get; set; }

        public int? creditoPromotorId { get; set; }
        public int? AnalistaID { get; set; }
        public int? DirectorMesaCreditoID { get; set; }
        public int? GestorCobranzaID { get; set; }
        public int? DirectorMesaCobranzaID { get; set; }

        [Range(minimum: 1, maximum: 99999999)]
        public int? EstatusID { get; set; }
        public string? Estatus { get; set; }
        public string? Clave { get; set; }

        public string? FechaHoraRegistro { get; set; }

        public bool? Distribuidor { get; set; }
        public bool? Cliente { get; set; }

        public bool? Coordinador { get; set; }
        public bool? Promotor { get; set; }

        public bool? Analista { get; set; }

        public bool? DirectorMesaCredito { get; set; }

        public bool? GestorCobranza { get; set; }

        public bool? DirectorMesaCobranza { get; set; }



    }
}
