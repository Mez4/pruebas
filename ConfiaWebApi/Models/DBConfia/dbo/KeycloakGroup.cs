using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.KEYCLOAK_GROUP")]
    [ExplicitColumns]
    [PrimaryKey("ID", AutoIncrement=false)]
    public class KEYCLOAK_GROUP
    {
              
        
        [Column("ID")]
        public string ID { get; set; }
      
        
        [Column("NAME")]
        public string NAME { get; set; }
      
        
        [Column("PARENT_GROUP")]
        public string PARENT_GROUP { get; set; }
      
        
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
