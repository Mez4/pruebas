using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.FED_USER_CONSENT")]
    [ExplicitColumns]
    [PrimaryKey("ID", AutoIncrement=false)]
    public class FED_USER_CONSENT
    {
              
        
        [Column("ID")]
        public string ID { get; set; }
      
        
        [Column("CLIENT_ID")]
        public string CLIENT_ID { get; set; }
      
        
        [Column("USER_ID")]
        public string USER_ID { get; set; }
      
        
        [Column("REALM_ID")]
        public string REALM_ID { get; set; }
      
        
        [Column("STORAGE_PROVIDER_ID")]
        public string STORAGE_PROVIDER_ID { get; set; }
      
        
        [Column("CREATED_DATE")]
        public Int64? CREATED_DATE { get; set; }
      
        
        [Column("LAST_UPDATED_DATE")]
        public Int64? LAST_UPDATED_DATE { get; set; }
      
        
        [Column("CLIENT_STORAGE_PROVIDER")]
        public string CLIENT_STORAGE_PROVIDER { get; set; }
      
        
        [Column("EXTERNAL_CLIENT_ID")]
        public string EXTERNAL_CLIENT_ID { get; set; }


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
