using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.CLIENT")]
    [ExplicitColumns]
    [PrimaryKey("ID", AutoIncrement=false)]
    public class CLIENT
    {
              
        
        [Column("ID")]
        public string ID { get; set; }
      
        
        [Column("ENABLED")]
        public bool ENABLED { get; set; }
      
        
        [Column("FULL_SCOPE_ALLOWED")]
        public bool FULL_SCOPE_ALLOWED { get; set; }
      
        
        [Column("CLIENT_ID")]
        public string CLIENT_ID { get; set; }
      
        
        [Column("NOT_BEFORE")]
        public int? NOT_BEFORE { get; set; }
      
        
        [Column("PUBLIC_CLIENT")]
        public bool PUBLIC_CLIENT { get; set; }
      
        
        [Column("SECRET")]
        public string SECRET { get; set; }
      
        
        [Column("BASE_URL")]
        public string BASE_URL { get; set; }
      
        
        [Column("BEARER_ONLY")]
        public bool BEARER_ONLY { get; set; }
      
        
        [Column("MANAGEMENT_URL")]
        public string MANAGEMENT_URL { get; set; }
      
        
        [Column("SURROGATE_AUTH_REQUIRED")]
        public bool SURROGATE_AUTH_REQUIRED { get; set; }
      
        
        [Column("REALM_ID")]
        public string REALM_ID { get; set; }
      
        
        [Column("PROTOCOL")]
        public string PROTOCOL { get; set; }
      
        
        [Column("NODE_REREG_TIMEOUT")]
        public int? NODE_REREG_TIMEOUT { get; set; }
      
        
        [Column("FRONTCHANNEL_LOGOUT")]
        public bool FRONTCHANNEL_LOGOUT { get; set; }
      
        
        [Column("CONSENT_REQUIRED")]
        public bool CONSENT_REQUIRED { get; set; }
      
        
        [Column("NAME")]
        public string NAME { get; set; }
      
        
        [Column("SERVICE_ACCOUNTS_ENABLED")]
        public bool SERVICE_ACCOUNTS_ENABLED { get; set; }
      
        
        [Column("CLIENT_AUTHENTICATOR_TYPE")]
        public string CLIENT_AUTHENTICATOR_TYPE { get; set; }
      
        
        [Column("ROOT_URL")]
        public string ROOT_URL { get; set; }
      
        
        [Column("DESCRIPTION")]
        public string DESCRIPTION { get; set; }
      
        
        [Column("REGISTRATION_TOKEN")]
        public string REGISTRATION_TOKEN { get; set; }
      
        
        [Column("STANDARD_FLOW_ENABLED")]
        public bool STANDARD_FLOW_ENABLED { get; set; }
      
        
        [Column("IMPLICIT_FLOW_ENABLED")]
        public bool IMPLICIT_FLOW_ENABLED { get; set; }
      
        
        [Column("DIRECT_ACCESS_GRANTS_ENABLED")]
        public bool DIRECT_ACCESS_GRANTS_ENABLED { get; set; }
      
        
        [Column("ALWAYS_DISPLAY_IN_CONSOLE")]
        public bool ALWAYS_DISPLAY_IN_CONSOLE { get; set; }


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
