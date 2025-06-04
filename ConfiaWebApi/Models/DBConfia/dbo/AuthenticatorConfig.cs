using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.AUTHENTICATOR_CONFIG")]
    [ExplicitColumns]
    [PrimaryKey("ID", AutoIncrement=false)]
    public class AUTHENTICATOR_CONFIG
    {
              
        
        [Column("ID")]
        public string ID { get; set; }
      
        
        [Column("ALIAS")]
        public string ALIAS { get; set; }
      
        
        [Column("REALM_ID")]
        public string REALM_ID { get; set; }


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
