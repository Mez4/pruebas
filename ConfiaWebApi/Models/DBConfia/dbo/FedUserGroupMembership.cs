using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.FED_USER_GROUP_MEMBERSHIP")]
    [ExplicitColumns]
    [PrimaryKey("GROUP_ID,USER_ID", AutoIncrement=false)]
    public class FED_USER_GROUP_MEMBERSHIP
    {
              
        
        [Column("GROUP_ID")]
        public string GROUP_ID { get; set; }
      
        
        [Column("USER_ID")]
        public string USER_ID { get; set; }
      
        
        [Column("REALM_ID")]
        public string REALM_ID { get; set; }
      
        
        [Column("STORAGE_PROVIDER_ID")]
        public string STORAGE_PROVIDER_ID { get; set; }


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
