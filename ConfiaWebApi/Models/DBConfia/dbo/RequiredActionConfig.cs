using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.REQUIRED_ACTION_CONFIG")]
    [ExplicitColumns]
    [PrimaryKey("NAME,REQUIRED_ACTION_ID", AutoIncrement=false)]
    public class REQUIRED_ACTION_CONFIG
    {
              
        
        [Column("REQUIRED_ACTION_ID")]
        public string REQUIRED_ACTION_ID { get; set; }
      
        
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
