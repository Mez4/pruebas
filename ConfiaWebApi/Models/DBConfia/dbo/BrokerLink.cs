using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.BROKER_LINK")]
    [ExplicitColumns]
    [PrimaryKey("IDENTITY_PROVIDER,USER_ID", AutoIncrement=false)]
    public class BROKER_LINK
    {
              
        
        [Column("IDENTITY_PROVIDER")]
        public string IDENTITY_PROVIDER { get; set; }
      
        
        [Column("STORAGE_PROVIDER_ID")]
        public string STORAGE_PROVIDER_ID { get; set; }
      
        
        [Column("REALM_ID")]
        public string REALM_ID { get; set; }
      
        
        [Column("BROKER_USER_ID")]
        public string BROKER_USER_ID { get; set; }
      
        
        [Column("BROKER_USERNAME")]
        public string BROKER_USERNAME { get; set; }
      
        
        [Column("TOKEN")]
        public string TOKEN { get; set; }
      
        
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
