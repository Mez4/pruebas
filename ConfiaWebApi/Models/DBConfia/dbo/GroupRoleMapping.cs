using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.GROUP_ROLE_MAPPING")]
    [ExplicitColumns]
    [PrimaryKey("GROUP_ID,ROLE_ID", AutoIncrement=false)]
    public class GROUP_ROLE_MAPPING
    {
              
        
        [Column("ROLE_ID")]
        public string ROLE_ID { get; set; }
      
        
        [Column("GROUP_ID")]
        public string GROUP_ID { get; set; }


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
