using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.USER_ROLE_MAPPING")]
    [ExplicitColumns]
    [PrimaryKey("ROLE_ID,USER_ID", AutoIncrement=false)]
    public class USER_ROLE_MAPPING
    {
              
        
        [Column("ROLE_ID")]
        public string ROLE_ID { get; set; }
      
        
        [Column("USER_ID")]
        public string USER_ID { get; set; }


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
