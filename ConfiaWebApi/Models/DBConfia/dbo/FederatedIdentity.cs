using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.FEDERATED_IDENTITY")]
    [ExplicitColumns]
    [PrimaryKey("IDENTITY_PROVIDER,USER_ID", AutoIncrement=false)]
    public class FEDERATED_IDENTITY
    {
              
        
        [Column("IDENTITY_PROVIDER")]
        public string IDENTITY_PROVIDER { get; set; }
      
        
        [Column("REALM_ID")]
        public string REALM_ID { get; set; }
      
        
        [Column("FEDERATED_USER_ID")]
        public string FEDERATED_USER_ID { get; set; }
      
        
        [Column("FEDERATED_USERNAME")]
        public string FEDERATED_USERNAME { get; set; }
      
        
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
