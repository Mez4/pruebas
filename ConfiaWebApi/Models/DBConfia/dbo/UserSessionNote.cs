using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.USER_SESSION_NOTE")]
    [ExplicitColumns]
    [PrimaryKey("NAME,USER_SESSION", AutoIncrement=false)]
    public class USER_SESSION_NOTE
    {
              
        
        [Column("USER_SESSION")]
        public string USER_SESSION { get; set; }
      
        
        [Column("NAME")]
        public string NAME { get; set; }
      
        
        [Column("VALUE")]
        public string VALUE { get; set; }


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
