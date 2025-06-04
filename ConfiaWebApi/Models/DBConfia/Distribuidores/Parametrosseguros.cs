using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.ParametrosSeguros")]
    [ExplicitColumns]
    // No primary key detected
    public class ParametrosSeguros
    {
              
        
        [Column("MinLineaCredito")]
        public decimal MinLineaCredito { get; set; }
      
        
        [Column("MaxLineaCredito")]
        public decimal MaxLineaCredito { get; set; }
      
        
        [Column("Costo")]
        public decimal Costo { get; set; }
      
        
        [Column("MinimoPagoRelacion")]
        public decimal MinimoPagoRelacion { get; set; }


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
