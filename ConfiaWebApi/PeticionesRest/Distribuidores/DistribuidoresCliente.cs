using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Distribuidores.DistribuidoresCliente
{
    public class Get
    {
        [Range(minimum: 0, maximum: 99999)]
        public int DistribuidorID { get; set; }

        [Range(minimum: 0, maximum: 99999)]
        public int ClienteID { get; set; }
        public string Nombre { get; set; }
    }


    // public class Agregar
    // {
    //     //public long ClienteID { get; set; }

    //     //public long PersonaID { get; set; }

    //     public bool CrearCliente { get; set; } = false;

    //     public decimal LineaCreditoPersonal { get; set; }

    //     public int PagareEstatusId { get; set; }

    //     public decimal PagareCantidad { get; set; }

    //     [MinLength(0)]
    //     [MaxLength(250)]
    //     public string IdentificadorAnterior { get; set; }

    //     public int DistribuidorID { get; set; }
    // }
}
