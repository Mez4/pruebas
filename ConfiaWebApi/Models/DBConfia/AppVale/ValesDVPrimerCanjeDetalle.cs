using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.AppVale
{

    // View, no primary key needed
    public class ValesDVPrimerCanjeDetalle
    {


        [Column("plazos")]
        public int plazos { get; set; }
        [Column("plazoActual")]
        public int plazoActual { get; set; }

        [Column("saldoPagado")]
        public decimal saldoPagado { get; set; }
        [Column("saldoActual")]
        public decimal saldoActual { get; set; }

        [Column("folio")]
        public String folio { get; set; }
        [Column("montoPago")]
        public decimal montoPago { get; set; }
        [Column("telefono")]
        public string telefono { get; set; }
        [Column("detalleVenta")]
        public decimal detalleVenta { get; set; }
        [Column("noCredito")]
        public Int64 noCredito { get; set; }
        [Column("noCliente")]
        public Int64 noCliente { get; set; }
        [Column("nombreCliente")]
        public string nombreCliente { get; set; }
        [Column("fechaCredito")]
        public DateTime fechaCredito { get; set; }
        [Column("Status")]
        public string Status { get; set; }
        [Column("Monto")]
        public decimal Monto { get; set; }
        [Column("codigoValeDig")]
        public string codigoValeDig { get; set; }

    }
}
