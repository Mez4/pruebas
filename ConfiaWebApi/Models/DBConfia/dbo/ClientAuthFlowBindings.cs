using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.CLIENT_AUTH_FLOW_BINDINGS")]
    [ExplicitColumns]
    [PrimaryKey("BINDING_NAME,CLIENT_ID", AutoIncrement=false)]
    public class CLIENT_AUTH_FLOW_BINDINGS
    {
              
        
        [Column("CLIENT_ID")]
        public string CLIENT_ID { get; set; }
      
        
        [Column("FLOW_ID")]
        public string FLOW_ID { get; set; }
      
        
        [Column("BINDING_NAME")]
        public string BINDING_NAME { get; set; }


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
