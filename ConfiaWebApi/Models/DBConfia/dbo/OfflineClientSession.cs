using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.OFFLINE_CLIENT_SESSION")]
    [ExplicitColumns]
    [PrimaryKey("CLIENT_ID,CLIENT_STORAGE_PROVIDER,EXTERNAL_CLIENT_ID,OFFLINE_FLAG,USER_SESSION_ID", AutoIncrement=false)]
    public class OFFLINE_CLIENT_SESSION
    {
              
        
        [Column("USER_SESSION_ID")]
        public string USER_SESSION_ID { get; set; }
      
        
        [Column("CLIENT_ID")]
        public string CLIENT_ID { get; set; }
      
        
        [Column("OFFLINE_FLAG")]
        public string OFFLINE_FLAG { get; set; }
      
        
        [Column("TIMESTAMP")]
        public int? TIMESTAMP { get; set; }
      
        
        [Column("DATA")]
        public string DATA { get; set; }
      
        
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
