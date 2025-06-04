using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cortes
{
    [TableName("Cortes.RelacionCortesDetalle2_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class RelacionCortesDetalle2_VW
    {


        [Column("fechaCorte")]
        public string fechaCorte { get; set; }


        [Column("SucursalID")]
        public int SucursalID { get; set; }


        [Column("ProductoID")]
        public int ProductoID { get; set; }


        [Column("CreditoID")]
        public Int64 CreditoID { get; set; }


        [Column("TipoCreditoID")]
        public int TipoCreditoID { get; set; }


        [Column("Descripcion")]
        public string Descripcion { get; set; }
        

        [Column("NoPago")]
        public int NoPago { get; set; }


        [Column("saldoCredito")]
        public decimal? saldoCredito { get; set; }


        [Column("FechaVencimiento")]
        public DateTime? FechaVencimiento { get; set; }


        [Column("plazoVencido")]
        public int? plazoVencido { get; set; }


        [Column("saldoVencidoTotal")]
        public decimal? saldoVencidoTotal { get; set; }


        [Column("saldoAtrasado")]
        public decimal? saldoAtrasado { get; set; }


        [Column("importePlazo")]
        public decimal? importePlazo { get; set; }


        [Column("saldoPlazo")]
        public decimal? saldoPlazo { get; set; }


        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }


        [Column("ImporteTotal")]
        public decimal? ImporteTotal { get; set; }


        [Column("Atraso")]
        public decimal? Atraso { get; set; }


        [Column("PagoPlazo")]
        public string PagoPlazo { get; set; }


        [Column("ValeCanje")]
        public Int64? ValeCanje { get; set; }


        [Column("SldDspPago")]
        public decimal? SldDspPago { get; set; }


        [Column("Nombre")]
        public string Nombre { get; set; }


        [Column("FechaCanje")]
        public DateTime? FechaCanje { get; set; }


        [Column("ClienteID")]
        public Int64? ClienteID { get; set; }


        [Column("Cliente")]
        public string Cliente { get; set; }


        [Column("Producto")]
        public string Producto { get; set; }


        [Column("SaldoComisionPlazo")]
        public decimal? SaldoComisionPlazo { get; set; }


        // ###############################################
        // Parent foreing keys
        // >>
        // ###############################################

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
