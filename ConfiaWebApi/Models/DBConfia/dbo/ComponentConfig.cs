using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.COMPONENT_CONFIG")]
    [ExplicitColumns]
    [PrimaryKey("ID", AutoIncrement=false)]
    public class COMPONENT_CONFIG
    {
              
        
        [Column("ID")]
        public string ID { get; set; }
      
        
        [Column("COMPONENT_ID")]
        public string COMPONENT_ID { get; set; }
      
        
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
