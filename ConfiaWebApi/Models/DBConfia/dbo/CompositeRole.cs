using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.COMPOSITE_ROLE")]
    [ExplicitColumns]
    [PrimaryKey("CHILD_ROLE,COMPOSITE", AutoIncrement=false)]
    public class COMPOSITE_ROLE
    {
              
        
        [Column("COMPOSITE")]
        public string COMPOSITE { get; set; }
      
        
        [Column("CHILD_ROLE")]
        public string CHILD_ROLE { get; set; }


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
