using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Distribuidores.Cliente
{
    public class Get
    {
        public int Id { get; set; }
        public int DistribuidorID { get; set; }

        [Range(minimum: 0, maximum: 99999)]
        public int ProductoID { get; set; }

        public string Nombre { get; set; }

        public int ClienteID { get; set; }

        public int SucursalID { get; set; }

        public int ZonaID { get; set; }
    }

    public class GetGastos
    {
        public int CajaID { get; set; }

    }

    public class GetGastosDetalle
    {
        public int SolicitudGastoID { get; set; }

    }

    public class GetSingle
    {
        [Required]
        [Range(minimum: 1, maximum: 9999999)]
        public int ClienteID { get; set; }

        public int DistribuidorID { get; set; }

        [Range(minimum: 0, maximum: 99999)]
        public int ProductoID { get; set; }

        //public string Nombre { get; set; }
    }

    public class CancelarTempC
    {
        public int Id { get; set; }
        public bool CanjeaVale { get; set; }
    }


    public class Agregar
    {
        //public long ClienteID { get; set; }

        //public long PersonaID { get; set; }

        public bool CrearCliente { get; set; } = false;

        public decimal LineaCreditoPersonal { get; set; }

        public int PagareEstatusId { get; set; }

        public decimal PagareCantidad { get; set; }

        [MinLength(0)]
        [MaxLength(250)]
        public string IdentificadorAnterior { get; set; }

        public int DistribuidorID { get; set; }
    }
}
