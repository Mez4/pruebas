using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.CLIENT_SCOPE_ROLE_MAPPING")]
    [ExplicitColumns]
    [PrimaryKey("ROLE_ID,SCOPE_ID", AutoIncrement=false)]
    public class CLIENT_SCOPE_ROLE_MAPPING
    {
              
        
        [Column("SCOPE_ID")]
        public string SCOPE_ID { get; set; }
      
        
        [Column("ROLE_ID")]
        public string ROLE_ID { get; set; }


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
