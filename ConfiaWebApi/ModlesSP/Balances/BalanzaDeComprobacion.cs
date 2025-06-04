using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
namespace DBContext.DBConfia.Custom.Balances
{
    [ExplicitColumns]
    public class BalanzaDeComprobacion
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

        [Column("DeudorMov")]
        public decimal DeudorMov { get; set; }

        [Column("AcreedorMov")]
        public decimal AcreedorMov { get; set; }

        [Column("DeudorSaldo")]
        public decimal DeudorSaldo { get; set; }

        [Column("AcreedorSaldo")]
        public decimal AcreedorSaldo { get; set; }

    }


}
