using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.PeticionesRest.Balances.BalancesCierres
{
    public class Get 
    {
        [Range(minimum: 0, maximum: 999999999999)]
        public Int64 balanceCierreid { get; set; }
    }

    public class Add
    {
        [Range(minimum: 0, maximum: 9999)]
        public Int16 balanceId { get; set; }

        public decimal importeTotal { get; set; }

        public DateTime fhRegistro { get; set; }

        [Required]
        public decimal importeAjustes { get; set; }

        [Required]
        public decimal importeCreditos { get; set; }

        [Required]
        public decimal importeMovsCancelaciones { get; set; }

        [Required]
        public decimal importeMovsBancos { get; set; }

        [Required]
        public decimal improteCargosAdicionales { get; set; }
    }

    public class Update 
    {
        [Range(minimum: 0, maximum: 999999999999)]
        public Int64 balanceCierreid { get; set; }

        [Range(minimum: 0, maximum: 9999)]
        public Int16 balanceId { get; set; }

        public decimal importeTotal { get; set; }

        public DateTime fhRegistro { get; set; }

        [Required]
        public decimal importeAjustes { get; set; }

        [Required]
        public decimal importeCreditos { get; set; }

        [Required]
        public decimal importeMovsCancelaciones { get; set; }

        [Required]
        public decimal importeMovsBancos { get; set; }

        [Required]
        public decimal improteCargosAdicionales { get; set; }
    }

}
