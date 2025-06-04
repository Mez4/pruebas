using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.CLIENT_SCOPE_ATTRIBUTES")]
    [ExplicitColumns]
    [PrimaryKey("NAME,SCOPE_ID", AutoIncrement=false)]
    public class CLIENT_SCOPE_ATTRIBUTES
    {
              
        
        [Column("SCOPE_ID")]
        public string SCOPE_ID { get; set; }
      
        
        [Column("VALUE")]
        public string VALUE { get; set; }
      
        
        [Column("NAME")]
        public string NAME { get; set; }


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
