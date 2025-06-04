using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.PROTOCOL_MAPPER_CONFIG")]
    [ExplicitColumns]
    [PrimaryKey("NAME,PROTOCOL_MAPPER_ID", AutoIncrement=false)]
    public class PROTOCOL_MAPPER_CONFIG
    {
              
        
        [Column("PROTOCOL_MAPPER_ID")]
        public string PROTOCOL_MAPPER_ID { get; set; }
      
        
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
