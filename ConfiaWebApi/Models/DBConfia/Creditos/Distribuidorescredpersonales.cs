using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.DistribuidoresCredPersonales")]
    [ExplicitColumns]
    // View, no primary key needed
    public class DistribuidoresCredPersonales
    {
              
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("numCreditosPersonales")]
        public int? numCreditosPersonales { get; set; }
      
        
        [Column("saldoPresPersonal")]
        public decimal? saldoPresPersonal { get; set; }


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
