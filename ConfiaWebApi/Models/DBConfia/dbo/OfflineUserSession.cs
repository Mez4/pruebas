using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.OFFLINE_USER_SESSION")]
    [ExplicitColumns]
    [PrimaryKey("OFFLINE_FLAG,USER_SESSION_ID", AutoIncrement=false)]
    public class OFFLINE_USER_SESSION
    {
              
        
        [Column("USER_SESSION_ID")]
        public string USER_SESSION_ID { get; set; }
      
        
        [Column("USER_ID")]
        public string USER_ID { get; set; }
      
        
        [Column("REALM_ID")]
        public string REALM_ID { get; set; }
      
        
        [Column("CREATED_ON")]
        public int CREATED_ON { get; set; }
      
        
        [Column("OFFLINE_FLAG")]
        public string OFFLINE_FLAG { get; set; }
      
        
        [Column("DATA")]
        public string DATA { get; set; }
      
        
        [Column("LAST_SESSION_REFRESH")]
        public int LAST_SESSION_REFRESH { get; set; }


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
