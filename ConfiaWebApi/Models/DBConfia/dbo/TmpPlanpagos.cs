using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.tmp_planpagos")]
    [ExplicitColumns]
    // No primary key detected
    public class tmp_planpagos
    {
              
        
        [Column("CreditoID")]
        public Int64 CreditoID { get; set; }
      
        
        [Column("NoPago")]
        public int NoPago { get; set; }
      
        
        [Column("FechaVencimiento")]
        public DateTime FechaVencimiento { get; set; }
      
        
        [Column("FechaVencimientoClienteFinal")]
        public DateTime? FechaVencimientoClienteFinal { get; set; }
      
        
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
      
        
        [Column("ImporteTotal")]
        public decimal? ImporteTotal { get; set; }
      
        
        [Column("Abonos")]
        public decimal Abonos { get; set; }
      
        
        [Column("Comision")]
        public decimal Comision { get; set; }
      
        
        [Column("SaldoActual")]
        public decimal? SaldoActual { get; set; }
      
        
        [Column("FechaLiquidacion")]
        public DateTime? FechaLiquidacion { get; set; }
      
        
        [Column("DiasAtraso")]
        public int? DiasAtraso { get; set; }
      
        
        [Column("FechaHoraUltimoPago")]
        public DateTime? FechaHoraUltimoPago { get; set; }
      
        
        [Column("PlazoAdicional")]
        public bool PlazoAdicional { get; set; }
      
        
        [Column("CapitalOriginal")]
        public decimal? CapitalOriginal { get; set; }
      
        
        [Column("InteresOriginal")]
        public decimal? InteresOriginal { get; set; }
      
        
        [Column("ManejoCuentaOriginal")]
        public decimal? ManejoCuentaOriginal { get; set; }
      
        
        [Column("SeguroOriginal")]
        public decimal? SeguroOriginal { get; set; }
      
        
        [Column("CargoOriginal")]
        public decimal? CargoOriginal { get; set; }
      
        
        [Column("IVAOriginal")]
        public decimal? IVAOriginal { get; set; }
      
        
        [Column("FechaVencimientoOriginal")]
        public DateTime? FechaVencimientoOriginal { get; set; }
      
        
        [Column("FechaVencimientoClienteFinalOriginal")]
        public DateTime? FechaVencimientoClienteFinalOriginal { get; set; }
      
        
        [Column("monto")]
        public decimal? monto { get; set; }
      
        
        [Column("imp_total")]
        public decimal? imp_total { get; set; }
      
        
        [Column("plazos_real")]
        public decimal? plazos_real { get; set; }


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
