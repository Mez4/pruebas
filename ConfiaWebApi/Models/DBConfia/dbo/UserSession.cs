using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.USER_SESSION")]
    [ExplicitColumns]
    [PrimaryKey("ID", AutoIncrement=false)]
    public class USER_SESSION
    {
              
        
        [Column("ID")]
        public string ID { get; set; }
      
        
        [Column("AUTH_METHOD")]
        public string AUTH_METHOD { get; set; }
      
        
        [Column("IP_ADDRESS")]
        public string IP_ADDRESS { get; set; }
      
        
        [Column("LAST_SESSION_REFRESH")]
        public int? LAST_SESSION_REFRESH { get; set; }
      
        
        [Column("LOGIN_USERNAME")]
        public string LOGIN_USERNAME { get; set; }
      
        
        [Column("REALM_ID")]
        public string REALM_ID { get; set; }
      
        
        [Column("REMEMBER_ME")]
        public bool REMEMBER_ME { get; set; }
      
        
        [Column("STARTED")]
        public int? STARTED { get; set; }
      
        
        [Column("USER_ID")]
        public string USER_ID { get; set; }
      
        
        [Column("USER_SESSION_STATE")]
        public int? USER_SESSION_STATE { get; set; }
      
        
        [Column("BROKER_SESSION_ID")]
        public string BROKER_SESSION_ID { get; set; }
      
        
        [Column("BROKER_USER_ID")]
        public string BROKER_USER_ID { get; set; }


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
