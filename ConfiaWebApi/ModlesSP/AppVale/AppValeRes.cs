using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Custom.AppVale
{
    [ExplicitColumns]
    public class AppValeRes
    {
        [Column("regresa")]
        public int regresa { get; set; }

        [Column("msj")]
        public string msj { get; set; }

        [Column("Folio")]
        public long Folio { get; set; }

        [Column("Codigo")]
        public string Codigo { get; set; }

        [Column("CreditoId")]
        public long CreditoId { get; set; }

        [Column("MovimientoID")]
        public long MovimientoID { get; set; }

        [Column("CajaId")]
        public string CajaId { get; set; }

        [Column("CanjeAppId")]
        public long CanjeAppId { get; set; }

    }
    public class AppValeQR
    {
        [Column("Size")]
        public double Size { get; set; } = 100;

        [Column("DataQR")]
        public string DataQR { get; set; } = "";
        [Column("Descripcion")]
        public string Descripcion { get; set; }
        [Column("ColorQR")]
        public string ColorQR { get; set; }
        [Column("QRound")]
        public bool QRound { get; set; } = true;
    }


    public class ReciboClienteResponse
    {
        [Column("msg")]
        public string msg { get; set; } = string.Empty;

        [Column("Error")]
        public int Error { get; set; } = 0;

        [Column("Cliente")]
        public string? Cliente { get; set; } = string.Empty;

        [Column("CreditoID")]
        public long? CreditoID { get; set; } = 0;

        [Column("ValeCanje")]
        public long? ValeCanje { get; set; } = 0;

        [Column("FechaLimitePago")]
        public DateTime? FechaLimitePago { get; set; } = DateTime.Now;

        [Column("Plazo")]
        public string? Plazo { get; set; } = "";
        [Column("SaldoAnterior")]
        public decimal? SaldoAnterior { get; set; } = 0;
        [Column("saldoAtrasado")]
        public decimal? saldoAtrasado { get; set; } = 0;
        [Column("Pago")]
        public decimal? Pago { get; set; } = 0;
        [Column("SaldoNuevo")]
        public decimal? SaldoNuevo { get; set; } = 0;
    }
}
