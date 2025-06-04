using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.AUTHENTICATION_EXECUTION")]
    [ExplicitColumns]
    [PrimaryKey("ID", AutoIncrement=false)]
    public class AUTHENTICATION_EXECUTION
    {
              
        
        [Column("ID")]
        public string ID { get; set; }
      
        
        [Column("ALIAS")]
        public string ALIAS { get; set; }
      
        
        [Column("AUTHENTICATOR")]
        public string AUTHENTICATOR { get; set; }
      
        
        [Column("REALM_ID")]
        public string REALM_ID { get; set; }
      
        
        [Column("FLOW_ID")]
        public string FLOW_ID { get; set; }
      
        
        [Column("REQUIREMENT")]
        public int? REQUIREMENT { get; set; }
      
        
        [Column("PRIORITY")]
        public int? PRIORITY { get; set; }
      
        
        [Column("AUTHENTICATOR_FLOW")]
        public bool AUTHENTICATOR_FLOW { get; set; }
      
        
        [Column("AUTH_FLOW_ID")]
        public string AUTH_FLOW_ID { get; set; }
      
        
        [Column("AUTH_CONFIG")]
        public string AUTH_CONFIG { get; set; }


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
