using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.USER_CONSENT_CLIENT_SCOPE")]
    [ExplicitColumns]
    [PrimaryKey("SCOPE_ID,USER_CONSENT_ID", AutoIncrement=false)]
    public class USER_CONSENT_CLIENT_SCOPE
    {
              
        
        [Column("USER_CONSENT_ID")]
        public string USER_CONSENT_ID { get; set; }
      
        
        [Column("SCOPE_ID")]
        public string SCOPE_ID { get; set; }


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
