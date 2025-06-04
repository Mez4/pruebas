using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
namespace DBContext.DBConfia.Custom.Balances
{
    [ExplicitColumns]
    public class MovsBalanza
    {

        [Column("TipoMovimientoDesc")]
        public string TipoMovimientoDesc { get; set; }

        [Column("BalanzaID")]
        public int BalanzaID { get; set; }

        [Column("SaldoImporte")]
        public decimal SaldoImporte { get; set; }


        [Column("Factor")]
        public decimal Factor { get; set; }

        [Column("Observaciones")]
        public string Observaciones { get; set; }



    }


}
