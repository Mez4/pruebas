using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cortes
{
    [TableName("Cortes.RelacionCortesDetalle_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class RelacionCortesDetalle_VW
    {
              
        
        [Column("fechaCorte")]
        public string fechaCorte { get; set; }
      
        
        [Column("SucursalID")]
        public int SucursalID { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("ComisionesId")]
        public int? ComisionesId { get; set; }
      
        
        [Column("DistribuidorNivelID")]
        public int? DistribuidorNivelID { get; set; }
      
        
        [Column("DistribuidorNivelIDOrigen")]
        public int? DistribuidorNivelIDOrigen { get; set; }
      
        
        [Column("ContratoID")]
        public Int64 ContratoID { get; set; }
      
        
        [Column("CreditoID")]
        public Int64 CreditoID { get; set; }
      
        
        [Column("NoPago")]
        public int? NoPago { get; set; }
      
        
        [Column("creditoClasificacionId")]
        public int? creditoClasificacionId { get; set; }
      
        
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
      
        
        [Column("CapitalPlazo")]
        public decimal? CapitalPlazo { get; set; }
      
        
        [Column("InteresPlazo")]
        public decimal? InteresPlazo { get; set; }
      
        
        [Column("ManejoCuentaPlazo")]
        public decimal? ManejoCuentaPlazo { get; set; }
      
        
        [Column("SeguroPlazo")]
        public decimal? SeguroPlazo { get; set; }
      
        
        [Column("ComisionPlazo")]
        public decimal? ComisionPlazo { get; set; }
      
        
        [Column("CargoPlazo")]
        public decimal? CargoPlazo { get; set; }
      
        
        [Column("IvaPlazo")]
        public decimal? IvaPlazo { get; set; }
      
        
        [Column("AbonosPlazo")]
        public decimal? AbonosPlazo { get; set; }
      
        
        [Column("baseComision")]
        public decimal? baseComision { get; set; }
      
        
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
