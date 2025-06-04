using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.IDENTITY_PROVIDER")]
    [ExplicitColumns]
    [PrimaryKey("INTERNAL_ID", AutoIncrement=false)]
    public class IDENTITY_PROVIDER
    {
              
        
        [Column("INTERNAL_ID")]
        public string INTERNAL_ID { get; set; }
      
        
        [Column("ENABLED")]
        public bool ENABLED { get; set; }
      
        
        [Column("PROVIDER_ALIAS")]
        public string PROVIDER_ALIAS { get; set; }
      
        
        [Column("PROVIDER_ID")]
        public string PROVIDER_ID { get; set; }
      
        
        [Column("STORE_TOKEN")]
        public bool STORE_TOKEN { get; set; }
      
        
        [Column("AUTHENTICATE_BY_DEFAULT")]
        public bool AUTHENTICATE_BY_DEFAULT { get; set; }
      
        
        [Column("REALM_ID")]
        public string REALM_ID { get; set; }
      
        
        [Column("ADD_TOKEN_ROLE")]
        public bool ADD_TOKEN_ROLE { get; set; }
      
        
        [Column("TRUST_EMAIL")]
        public bool TRUST_EMAIL { get; set; }
      
        
        [Column("FIRST_BROKER_LOGIN_FLOW_ID")]
        public string FIRST_BROKER_LOGIN_FLOW_ID { get; set; }
      
        
        [Column("POST_BROKER_LOGIN_FLOW_ID")]
        public string POST_BROKER_LOGIN_FLOW_ID { get; set; }
      
        
        [Column("PROVIDER_DISPLAY_NAME")]
        public string PROVIDER_DISPLAY_NAME { get; set; }
      
        
        [Column("LINK_ONLY")]
        public bool LINK_ONLY { get; set; }


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
