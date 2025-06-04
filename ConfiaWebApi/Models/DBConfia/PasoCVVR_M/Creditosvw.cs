using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.PasoCVVR_M
{
    [TableName("PasoCVVR_M.CreditosVW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class CreditosVW
    {
              
        
        [Column("DistribuidorCV")]
        public Int64? DistribuidorCV { get; set; }
      
        
        [Column("ClienteVR")]
        public string ClienteVR { get; set; }
      
        
        [Column("ClienteCV")]
        public Int64 ClienteCV { get; set; }
      
        
        [Column("CreditoID")]
        public int? CreditoID { get; set; }
      
        
        [Column("Capital")]
        public decimal? Capital { get; set; }
      
        
        [Column("Abonos")]
        public decimal? Abonos { get; set; }
      
        
        [Column("ImporteTotal")]
        public decimal? ImporteTotal { get; set; }
      
        
        [Column("SaldoActual")]
        public decimal? SaldoActual { get; set; }
      
        
        [Column("SaldoAtrasado")]
        public decimal? SaldoAtrasado { get; set; }
      
        
        [Column("DiasAtraso")]
        public int? DiasAtraso { get; set; }
      
        
        [Column("FechaRegistro")]
        public DateTime? FechaRegistro { get; set; }
      
        
        [Column("EstatusID")]
        public string EstatusID { get; set; }
      
        
        [Column("EstatusNombre")]
        public string EstatusNombre { get; set; }
      
        
        [Column("Color")]
        public string Color { get; set; }


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
