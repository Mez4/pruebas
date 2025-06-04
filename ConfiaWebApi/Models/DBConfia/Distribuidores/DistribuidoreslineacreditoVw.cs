using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.DistribuidoresLineaCredito_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class DistribuidoresLineaCredito_VW
    {
              
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("LineaCreditoMaximo")]
        public int? LineaCreditoMaximo { get; set; }
      
        
        [Column("LineaCreditoMinimo")]
        public int? LineaCreditoMinimo { get; set; }


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
