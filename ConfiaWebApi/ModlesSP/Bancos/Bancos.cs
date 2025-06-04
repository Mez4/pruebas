using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Custom.Bancos
{
    [ExplicitColumns]
    public class BancosDetalle
    {


        [Column("MovimientoID")]
        public Int64 MovimientoID { get; set; }


        [Column("CreditoID")]
        public Int64? CreditoID { get; set; }


        [Column("NoPago")]
        public int? NoPago { get; set; }


        [Column("Capital")]
        public decimal Capital { get; set; }


        [Column("Interes")]
        public decimal Interes { get; set; }


        [Column("Comision")]
        public decimal Comision { get; set; }


        [Column("Seguro")]
        public decimal Seguro { get; set; }


        [Column("Cargo")]
        public decimal Cargo { get; set; }


        [Column("IVA")]
        public decimal IVA { get; set; }



        [Column("noPagoCan")]
        public int? noPagoCan { get; set; }


        [Column("capitalCan")]
        public decimal? capitalCan { get; set; }


        [Column("interesCan")]
        public decimal? interesCan { get; set; }


        [Column("comisionCan")]
        public decimal? comisionCan { get; set; }


        [Column("seguroCan")]
        public decimal? seguroCan { get; set; }


        [Column("cargoCan")]
        public decimal? cargoCan { get; set; }


        [Column("IVACan")]
        public decimal? IVACan { get; set; }


        [Column("PolizaMovId")]
        public Int64? PolizaMovId { get; set; }



        // ###############################################
        // <<
        // Parent foreing keys
        // ###############################################

        // ###############################################
        // Child foreing keys
        // >>
        // ###############################################

        // ###############################################
        // <<
        // Child foreing keys
        // ###############################################

    }
}
