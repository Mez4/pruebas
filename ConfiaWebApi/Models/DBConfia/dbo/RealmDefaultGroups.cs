using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.REALM_DEFAULT_GROUPS")]
    [ExplicitColumns]
    [PrimaryKey("GROUP_ID,REALM_ID", AutoIncrement=false)]
    public class REALM_DEFAULT_GROUPS
    {
              
        
        [Column("REALM_ID")]
        public string REALM_ID { get; set; }
      
        
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
