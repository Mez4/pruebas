using DBContext.DBConfia.Creditos;
using NPoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConfiaWebApi.ModlesSP.Reestructuras
{
    [ExplicitColumns]
    public class PlanPagosRes
    {
        [Column("TotalCapital")]
        public decimal TotalCapital { get; set; }

        [Column("DistribuidorID")]
        public int DistribuidorID { get; set; }

        [Column("NoPago")]
        public int NoPago { get; set; }

        [Column("FechaVencimiento")]
        public DateTime FechaVencimiento { get; set; }

        [Column("NumeroPago")]
        public int NumeroPago { get; set; }
    }

     public class SaldoReconvenio
    {
        [Column("TotalCapital")]
        public decimal TotalCapital { get; set; }

        [Column("DistribuidorID")]
        public int DistribuidorID { get; set; }

        [Column("SaldoAtrasado")]
        public decimal SaldoAtrasado { get; set; }
    }
}
