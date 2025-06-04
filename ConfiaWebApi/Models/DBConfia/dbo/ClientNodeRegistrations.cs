using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.CLIENT_NODE_REGISTRATIONS")]
    [ExplicitColumns]
    [PrimaryKey("CLIENT_ID,NAME", AutoIncrement=false)]
    public class CLIENT_NODE_REGISTRATIONS
    {
              
        
        [Column("CLIENT_ID")]
        public string CLIENT_ID { get; set; }
      
        
        [Column("VALUE")]
        public int? VALUE { get; set; }
      
        
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
