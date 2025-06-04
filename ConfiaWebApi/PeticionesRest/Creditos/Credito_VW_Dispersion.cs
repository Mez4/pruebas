using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Creditos.CreditoDispersion
{
    public class Get
    {

        ////////
        [Range(0, 9999999999)]
        public int? ProductoID { get; set; }
        /////
        [Range(0, 9999999999)]
        public int? ClienteID { get; set; }
        //////
        [Range(0, 9999999999)]
        public int? SucursalID { get; set; }
        //////
        [Range(0, 9999999999)]
        public int? ZonaID { get; set; }
        ///////
        [Range(0, 9999999999)]
        public int? EmpresaId { get; set; }
        /////////
        [Range(0, 9999999999)]
        public int? DistribuidorID { get; set; }
        ////////
        [Range(0, 9999999999)]
        public int? CoordinadorID { get; set; }
        ///////
        [Range(0, 9999999999)]
        public int? ContratoID { get; set; }
        //////
        [MinLength(0)]
        [MaxLength(1)]
        public string EstatusID { get; set; }
        ///////
        [Range(0, 9999999999)]
        public int? DistribuidorNivelID { get; set; }

        public DateTime? FechaInicio { get; set; }

        public DateTime? FechaFin { get; set; }

        public int UsuarioID { get; set; }
    }
    public class GetCreditosCliente
    {
        [Range(0, 999999999900)]
        public int? ProductoID { get; set; }

        [Range(0, 999999999900)]
        public int? ClienteID { get; set; }

        [Range(0, 999999999900)]
        public int? DistribuidorID { get; set; }

        public bool Todos { get; set; } = false;
    }

    public class Cancel
    {
        public int CreditoID { get; set; }
    }

    public class Desembolso
    {
        [Required]
        [Range(minimum: 1, maximum: 9999999999999)]
        public int CreditoID { get; set; }

        //[Required]
        //[Range(minimum: 1, maximum: 9999999)]
        public int CajaID { get; set; }
    }
}
