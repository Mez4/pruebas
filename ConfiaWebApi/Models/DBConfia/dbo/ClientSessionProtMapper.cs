using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.CLIENT_SESSION_PROT_MAPPER")]
    [ExplicitColumns]
    [PrimaryKey("CLIENT_SESSION,PROTOCOL_MAPPER_ID", AutoIncrement=false)]
    public class CLIENT_SESSION_PROT_MAPPER
    {
              
        
        [Column("PROTOCOL_MAPPER_ID")]
        public string PROTOCOL_MAPPER_ID { get; set; }
      
        
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
