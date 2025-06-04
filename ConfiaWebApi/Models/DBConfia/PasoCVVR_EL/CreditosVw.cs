using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.PasoCVVR_EL
{
    [TableName("PasoCVVR_EL.Creditos_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Creditos_VW
    {
              
        
        [Column("IDClienteVR")]
        public string IDClienteVR { get; set; }
      
        
        [Column("IDClienteCV")]
        public Int64 IDClienteCV { get; set; }
      
        
        [Column("DistribuidorIDCV")]
        public Int64? DistribuidorIDCV { get; set; }
      
        
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
      
        
        [Column("MovimientoID")]
        public string MovimientoID { get; set; }
      
        
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
