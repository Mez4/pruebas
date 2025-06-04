using NPoco;
using System;

namespace ConfiaWebApi.ModlesSP.Creditos
{
    [ExplicitColumns]
    public class ReestructuraSaldoAmortizacion
    {
        [Column("regresa")]
        public int regresa { get; set; }

        [Column("msj")]
        public string msj { get; set; }

        [Column("NoPago")]
        public int NoPago { get; set; }

        [Column("FechaVencimiento")]
        public DateTime FechaVencimiento { get; set; }

        [Column("FechaVencimientoClienteFinal")]
        public DateTime FechaVencimientoClienteFinal { get; set; }

        [Column("Capital")]
        public Decimal Capital { get; set; }

        [Column("SaldoTotalInicial")]
        public Decimal SaldoTotalInicial { get; set; }

        [Column("SaldoTotalFinal")]
        public Decimal SaldoTotalFinal { get; set; }
    }
}
