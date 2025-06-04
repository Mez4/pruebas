using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.General.Directores
{
    public class Get
    {
        [Range(minimum: 0, maximum: 99999)]
        public int PersonaID { get; set; }
    }

    public class getByName
    {
        [Range(minimum: 0, maximum: 99999)]
        public int PersonaID { get; set; }

        public string NombreCompleto { get; set; }
    }
    public class Agregar
    {
        //public long DirectorID { get; set; }

        //public long PersonaID { get; set; }

        public bool CrearDirector { get; set; } = false;

        public decimal LineaCreditoPersonal { get; set; }

        public int PagareEstatusId { get; set; }

        public decimal PagareCantidad { get; set; }

        [MinLength(0)]
        [MaxLength(250)]
        public string IdentificadorAnterior { get; set; }

      // public int DistribuidorID { get; set; }

    
    }
}
