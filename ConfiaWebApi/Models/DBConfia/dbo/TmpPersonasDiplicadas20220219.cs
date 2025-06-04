using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.tmp_Personas_Diplicadas_20220219")]
    [ExplicitColumns]
    // No primary key detected
    public class tmp_Personas_Diplicadas_20220219
    {
              
        
        [Column("PersonaID")]
        public Int64? PersonaID { get; set; }
      
        
        [Column("PersonaID1")]
        public Int64 PersonaID1 { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }


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
