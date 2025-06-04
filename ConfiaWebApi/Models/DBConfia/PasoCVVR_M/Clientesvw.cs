using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.PasoCVVR_M
{
    [TableName("PasoCVVR_M.ClientesVW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class ClientesVW
    {
              
        
        [Column("DistribuidorCV")]
        public Int64? DistribuidorCV { get; set; }
      
        
        [Column("DistribuidorVR")]
        public Int64? DistribuidorVR { get; set; }
      
        
        [Column("ClienteCV")]
        public Int64 ClienteCV { get; set; }
      
        
        [Column("ClienteVR")]
        public string ClienteVR { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("Importe")]
        public decimal? Importe { get; set; }
      
        
        [Column("SaldoActual")]
        public decimal? SaldoActual { get; set; }
      
        
        [Column("SaldoAtrasado")]
        public decimal? SaldoAtrasado { get; set; }
      
        
        [Column("DiasAtraso")]
        public int? DiasAtraso { get; set; }
      
        
        [Column("FecUltimoPago")]
        public DateTime? FecUltimoPago { get; set; }
      
        
        [Column("Capital")]
        public decimal? Capital { get; set; }


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
