using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.PasoCVVR_EL
{
    [TableName("PasoCVVR_EL.Clientes_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Clientes_VW
    {
              
        
        [Column("DistribuidorIDCV")]
        public Int64? DistribuidorIDCV { get; set; }
      
        
        [Column("DistribuidorIDVR")]
        public Int64? DistribuidorIDVR { get; set; }
      
        
        [Column("IdClienteCV")]
        public Int64 IdClienteCV { get; set; }
      
        
        [Column("IdClienteVR")]
        public string IdClienteVR { get; set; }
      
        
        [Column("NombreCliente")]
        public string NombreCliente { get; set; }
      
        
        [Column("ImporteT")]
        public decimal? ImporteT { get; set; }
      
        
        [Column("Saldo")]
        public decimal? Saldo { get; set; }
      
        
        [Column("Atraso")]
        public decimal? Atraso { get; set; }
      
        
        [Column("DiasAtr")]
        public int? DiasAtr { get; set; }
      
        
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
