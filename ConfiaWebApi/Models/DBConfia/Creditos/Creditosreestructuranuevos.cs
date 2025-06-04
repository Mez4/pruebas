using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.CreditosReestructuraNuevos")]
    [ExplicitColumns]
    [PrimaryKey("ReestructuraLiquidadosNuevosID")]
    public class CreditosReestructuraNuevos
    {
              
        
        [Column("ReestructuraLiquidadosNuevosID")]
        public Int64 ReestructuraLiquidadosNuevosID { get; set; }
      
        
        [Column("ContratoID")]
        public Int64 ContratoID { get; set; }
      
        
        [Column("CreditoID")]
        public Int64? CreditoID { get; set; }
      
        
        [Column("ReestructuraLiquidadosID")]
        public Int64 ReestructuraLiquidadosID { get; set; }
      
        
        [Column("Capital")]
        public decimal Capital { get; set; }
      
        
        [Column("Interes")]
        public decimal Interes { get; set; }
      
        
        [Column("ManejoCuenta")]
        public decimal ManejoCuenta { get; set; }
      
        
        [Column("Seguro")]
        public decimal Seguro { get; set; }
      
        
        [Column("Cargo")]
        public decimal Cargo { get; set; }
      
        
        [Column("IVA")]
        public decimal IVA { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("ImporteTotal")]
        public decimal? ImporteTotal { get; set; }
      
        
        [Column("Abonos")]
        public decimal Abonos { get; set; }
      
        
        [Column("Comision")]
        public decimal? Comision { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("SaldoActual")]
        public decimal? SaldoActual { get; set; }
      
        
        [Column("SaldoAtrasado")]
        public decimal SaldoAtrasado { get; set; }
      
        
        [Column("CapitalPagado")]
        public decimal CapitalPagado { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("CapitalPendientes")]
        public decimal? CapitalPendientes { get; set; }
      
        
        [Column("InteresPagado")]
        public decimal InteresPagado { get; set; }
      
        
        [Column("IVAPagado")]
        public decimal IVAPagado { get; set; }
      
        
        [Column("ManejoCuentaPagado")]
        public decimal ManejoCuentaPagado { get; set; }
      
        
        [Column("SeguroPagado")]
        public decimal SeguroPagado { get; set; }
      
        
        [Column("CargoPagado")]
        public decimal CargoPagado { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("PorcCapital")]
        public decimal? PorcCapital { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("PorcInteres")]
        public decimal? PorcInteres { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("PorcManejoCuenta")]
        public decimal? PorcManejoCuenta { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("PorcCargo")]
        public decimal? PorcCargo { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("PorcIVA")]
        public decimal? PorcIVA { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("PorcSeguro")]
        public decimal? PorcSeguro { get; set; }
      
        
        [Column("TasaInteres")]
        public decimal TasaInteres { get; set; }
      
        
        [Column("TasaIVA")]
        public decimal TasaIVA { get; set; }
      
        
        [Column("CostoSeguroPlazo")]
        public decimal CostoSeguroPlazo { get; set; }
      
        
        [Column("CostoSeguroDistribuidorXMil")]
        public decimal CostoSeguroDistribuidorXMil { get; set; }
      
        
        [Column("PrimaSeguro")]
        public decimal PrimaSeguro { get; set; }
      
        
        [Column("CapitalPendienteDisponible")]
        public decimal CapitalPendienteDisponible { get; set; }
      
        
        [Column("DiasAtraso")]
        public int DiasAtraso { get; set; }
      
        
        [Column("CreditosIDLiquidados")]
        public Int64? CreditosIDLiquidados { get; set; }


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
