using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.CLIENT_SESSION_AUTH_STATUS")]
    [ExplicitColumns]
    [PrimaryKey("AUTHENTICATOR,CLIENT_SESSION", AutoIncrement=false)]
    public class CLIENT_SESSION_AUTH_STATUS
    {
              
        
        [Column("AUTHENTICATOR")]
        public string AUTHENTICATOR { get; set; }
      
        
        [Column("STATUS")]
        public int? STATUS { get; set; }
      
        
        [Column("CLIENT_SESSION")]
        public string CLIENT_SESSION { get; set; }


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
