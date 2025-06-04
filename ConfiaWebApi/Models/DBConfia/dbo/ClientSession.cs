using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.CLIENT_SESSION")]
    [ExplicitColumns]
    [PrimaryKey("ID", AutoIncrement=false)]
    public class CLIENT_SESSION
    {
              
        
        [Column("ID")]
        public string ID { get; set; }
      
        
        [Column("CLIENT_ID")]
        public string CLIENT_ID { get; set; }
      
        
        [Column("REDIRECT_URI")]
        public string REDIRECT_URI { get; set; }
      
        
        [Column("STATE")]
        public string STATE { get; set; }
      
        
        [Column("TIMESTAMP")]
        public int? TIMESTAMP { get; set; }
      
        
        [Column("SESSION_ID")]
        public string SESSION_ID { get; set; }
      
        
        [Column("AUTH_METHOD")]
        public string AUTH_METHOD { get; set; }
      
        
        [Column("REALM_ID")]
        public string REALM_ID { get; set; }
      
        
        [Column("AUTH_USER_ID")]
        public string AUTH_USER_ID { get; set; }
      
        
        [Column("CURRENT_ACTION")]
        public string CURRENT_ACTION { get; set; }


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
