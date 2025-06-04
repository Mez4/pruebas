using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
namespace DBContext.DBConfia.Custom.Balances
{
    [ExplicitColumns]
    public class MultiSaldosArqueosBovedasW
    {
        //COLUMNA ProductoID
        [Column("ProductoID")]
        public int ProductoID { get; set; }

        [Column("MensajeID")]
        public int MensajeID { get; set; }

        [Column("MultiSaldoDetalleID")]
        public int MultiSaldoDetalleID { get; set; }

        [Column("PeriodoID")]
        public string PeriodoID { get; set; }

        [Column("CuentaBancoID")]
        public int CuentaBancoID { get; set; }

        [Column("NombreBanco")]
        public string NombreBanco { get; set; }

        [Column("EsBoveda")]
        public bool EsBoveda { get; set; }

        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }

        [Column("SaldoAceptado")]
        public decimal SaldoAceptado { get; set; }

        [Column("Abonos")]
        public decimal Abonos { get; set; }


        [Column("Cargos")]
        public decimal Cargos { get; set; }


        [Column("SaldoSinAceptar")]
        public decimal SaldoSinAceptar { get; set; }


        [Column("SaldoActual")]
        public decimal SaldoActual { get; set; }

        [Column("MultiSaldoID")]
        public int MultiSaldoID { get; set; }
    }


}
