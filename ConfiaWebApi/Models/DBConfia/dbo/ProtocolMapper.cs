using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.PROTOCOL_MAPPER")]
    [ExplicitColumns]
    [PrimaryKey("ID", AutoIncrement=false)]
    public class PROTOCOL_MAPPER
    {
              
        
        [Column("ID")]
        public string ID { get; set; }
      
        
        [Column("NAME")]
        public string NAME { get; set; }
      
        
        [Column("PROTOCOL")]
        public string PROTOCOL { get; set; }
      
        
        [Column("PROTOCOL_MAPPER_NAME")]
        public string PROTOCOL_MAPPER_NAME { get; set; }
      
        
        [Column("CLIENT_ID")]
        public string CLIENT_ID { get; set; }
      
        
        [Column("CLIENT_SCOPE_ID")]
        public string CLIENT_SCOPE_ID { get; set; }


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
