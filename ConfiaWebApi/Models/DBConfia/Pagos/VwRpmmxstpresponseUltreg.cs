using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Pagos
{
    [TableName("Pagos.VW_rpmmxSTPResponse_UltReg")]
    [ExplicitColumns]
    // View, no primary key needed
    public class VW_rpmmxSTPResponse_UltReg
    {
              
        
        [Column("reference")]
        public string reference { get; set; }
      
        
        [Column("fhRegistro")]
        public DateTime? fhRegistro { get; set; }


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
