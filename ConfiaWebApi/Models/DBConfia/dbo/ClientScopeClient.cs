using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.CLIENT_SCOPE_CLIENT")]
    [ExplicitColumns]
    [PrimaryKey("CLIENT_ID,SCOPE_ID", AutoIncrement=false)]
    public class CLIENT_SCOPE_CLIENT
    {
              
        
        [Column("CLIENT_ID")]
        public string CLIENT_ID { get; set; }
      
        
        [Column("SCOPE_ID")]
        public string SCOPE_ID { get; set; }
      
        
        [Column("DEFAULT_SCOPE")]
        public bool DEFAULT_SCOPE { get; set; }


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
