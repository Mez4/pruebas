using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.ModlesSP.Creditos
{
    [ExplicitColumns]
    public class SaldoClienteTable
    {
        [Column("ClienteID")]
        public long ClienteID { get; set; }

        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }

        [Column("ImporteTotal")]
        public decimal ImporteTotal { get; set; }

        [Column("SaldoActual")]
        public decimal SaldoActual { get; set; }

        [Column("Interes")]
        public decimal Interes { get; set; }

        [Column("Porc_Int")]
        public decimal Porc_Int { get; set; }

        [Column("A_Condonar")]
        public decimal A_Condonar { get; set; }

        [Column("A_Pagar")]
        public decimal A_Pagar { get; set; }

          [Column("DistribuidorID")]
        public long DistribuidorID { get; set; }

         [Column("Distribuidor")]
        public string Distribuidor { get; set; }

          [Column("CreditoID")]
        public long CreditoID { get; set; }
    }
}

