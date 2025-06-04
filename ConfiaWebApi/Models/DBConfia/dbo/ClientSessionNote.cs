using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.CLIENT_SESSION_NOTE")]
    [ExplicitColumns]
    [PrimaryKey("CLIENT_SESSION,NAME", AutoIncrement=false)]
    public class CLIENT_SESSION_NOTE
    {
              
        
        [Column("NAME")]
        public string NAME { get; set; }
      
        
        [Column("VALUE")]
        public string VALUE { get; set; }
      
        
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
