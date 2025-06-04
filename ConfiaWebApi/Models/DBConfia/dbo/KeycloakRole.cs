using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.KEYCLOAK_ROLE")]
    [ExplicitColumns]
    [PrimaryKey("ID", AutoIncrement=false)]
    public class KEYCLOAK_ROLE
    {
              
        
        [Column("ID")]
        public string ID { get; set; }
      
        
        [Column("CLIENT_REALM_CONSTRAINT")]
        public string CLIENT_REALM_CONSTRAINT { get; set; }
      
        
        [Column("CLIENT_ROLE")]
        public bool CLIENT_ROLE { get; set; }
      
        
        [Column("DESCRIPTION")]
        public string DESCRIPTION { get; set; }
      
        
        [Column("NAME")]
        public string NAME { get; set; }
      
        
        [Column("REALM_ID")]
        public string REALM_ID { get; set; }
      
        
        [Column("CLIENT")]
        public string CLIENT { get; set; }
      
        
        [Column("REALM")]
        public string REALM { get; set; }


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
