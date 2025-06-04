using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.IDP_MAPPER_CONFIG")]
    [ExplicitColumns]
    [PrimaryKey("IDP_MAPPER_ID,NAME", AutoIncrement=false)]
    public class IDP_MAPPER_CONFIG
    {
              
        
        [Column("IDP_MAPPER_ID")]
        public string IDP_MAPPER_ID { get; set; }
      
        
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
