using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
namespace DBContext.DBConfia.Custom.Balances
{
    [ExplicitColumns]
    public class SaldosPorBalanza
    {

        [Column("BalanzaTempID")]
        public int BalanzaTempID { get; set; }

        [Column("BalanzaID")]
        public int BalanzaID { get; set; }

        [Column("CuentaBancoID")]
        public int CuentaBancoID { get; set; }

        [Column("Producto")]
        public string Producto { get; set; }

        [Column("CtaBanco")]
        public string CtaBanco { get; set; }

        [Column("TipoMovimientoDesc")]
        public string TipoMovimientoDesc { get; set; }

        [Column("Saldo")]
        public decimal Saldo { get; set; }

        [Column("Factor")]
        public decimal Factor { get; set; }



    }

}
