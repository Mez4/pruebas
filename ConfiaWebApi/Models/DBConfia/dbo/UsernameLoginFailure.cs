using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.USERNAME_LOGIN_FAILURE")]
    [ExplicitColumns]
    [PrimaryKey("REALM_ID,USERNAME", AutoIncrement=false)]
    public class USERNAME_LOGIN_FAILURE
    {
              
        
        [Column("REALM_ID")]
        public string REALM_ID { get; set; }
      
        
        [Column("USERNAME")]
        public string USERNAME { get; set; }
      
        
        [Column("FAILED_LOGIN_NOT_BEFORE")]
        public int? FAILED_LOGIN_NOT_BEFORE { get; set; }
      
        
        [Column("LAST_FAILURE")]
        public Int64? LAST_FAILURE { get; set; }
      
        
        [Column("LAST_IP_FAILURE")]
        public string LAST_IP_FAILURE { get; set; }
      
        
        [Column("NUM_FAILURES")]
        public int? NUM_FAILURES { get; set; }


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
