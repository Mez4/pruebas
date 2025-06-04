using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.DistribuidoresCreditos")]
    [ExplicitColumns]
    // View, no primary key needed
    public class DistribuidoresCreditos
    {
              
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
        [Column("ContratoID")]
        public Int64 ContratoID { get; set; }
      
        
        [Column("SaldoActual")]
        public decimal? SaldoActual { get; set; }
      
        
        [Column("Cartera")]
        public decimal? Cartera { get; set; }
      
        
        [Column("SaldoAtrasado")]
        public decimal? SaldoAtrasado { get; set; }
      
        
        [Column("DiasAtraso")]
        public int? DiasAtraso { get; set; }
      
        
        [Column("PagosAtrasados")]
        public int? PagosAtrasados { get; set; }
      
        
        [Column("CreditosAtrasados")]
        public int? CreditosAtrasados { get; set; }
      
        
        [Column("Capital")]
        public decimal? Capital { get; set; }
      
        
        [Column("Colocado")]
        public decimal? Colocado { get; set; }
      
        
        [Column("Interes")]
        public decimal? Interes { get; set; }
      
        
        [Column("Seguro")]
        public decimal? Seguro { get; set; }
      
        
        [Column("CapLiquidado")]
        public decimal? CapLiquidado { get; set; }
      
        
        [Column("CarteraEnRiesgo")]
        public decimal? CarteraEnRiesgo { get; set; }
      
        
        [Column("saldoEnRiesgo")]
        public decimal? saldoEnRiesgo { get; set; }
      
        
        [Column("DiasDesdeUltPago")]
        public int? DiasDesdeUltPago { get; set; }
      
        
        [Column("FechaUltimoPago")]
        public DateTime? FechaUltimoPago { get; set; }
      
        
        [Column("EstatusID")]
        public string EstatusID { get; set; }
      
        
        [Column("TipoDesembolsoID")]
        public int? TipoDesembolsoID { get; set; }


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
