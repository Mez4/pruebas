using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.PasoCVVR_C
{
    [TableName("PasoCVVR_C.Clientes_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Clientes_VW
    {
              
        
        [Column("DistribuidorCV")]
        public Int64? DistribuidorCV { get; set; }
      
        
        [Column("DistribuidorVR")]
        public Int64? DistribuidorVR { get; set; }
      
        
        [Column("ClienteCV")]
        public Int64 ClienteCV { get; set; }
      
        
        [Column("ClienteVR")]
        public string ClienteVR { get; set; }
      
        
        [Column("Nombre_Completo")]
        public string Nombre_Completo { get; set; }
      
        
        [Column("Importe")]
        public decimal? Importe { get; set; }
      
        
        [Column("Saldo_Actual")]
        public decimal? Saldo_Actual { get; set; }
      
        
        [Column("Saldo_Atrasado")]
        public decimal? Saldo_Atrasado { get; set; }
      
        
        [Column("Dias_Atrasados")]
        public int? Dias_Atrasados { get; set; }
      
        
        [Column("Fecha_Ultimpo_Pago")]
        public DateTime? Fecha_Ultimpo_Pago { get; set; }
      
        
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
