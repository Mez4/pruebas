using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.SCOPE_MAPPING")]
    [ExplicitColumns]
    [PrimaryKey("CLIENT_ID,ROLE_ID", AutoIncrement=false)]
    public class SCOPE_MAPPING
    {
              
        
        [Column("CLIENT_ID")]
        public string CLIENT_ID { get; set; }
      
        
        [Column("ROLE_ID")]
        public string ROLE_ID { get; set; }


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
