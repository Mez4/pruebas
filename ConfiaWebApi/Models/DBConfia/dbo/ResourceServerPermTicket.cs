using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.RESOURCE_SERVER_PERM_TICKET")]
    [ExplicitColumns]
    [PrimaryKey("ID", AutoIncrement=false)]
    public class RESOURCE_SERVER_PERM_TICKET
    {
              
        
        [Column("ID")]
        public string ID { get; set; }
      
        
        [Column("OWNER")]
        public string OWNER { get; set; }
      
        
        [Column("REQUESTER")]
        public string REQUESTER { get; set; }
      
        
        [Column("CREATED_TIMESTAMP")]
        public Int64 CREATED_TIMESTAMP { get; set; }
      
        
        [Column("GRANTED_TIMESTAMP")]
        public Int64? GRANTED_TIMESTAMP { get; set; }
      
        
        [Column("RESOURCE_ID")]
        public string RESOURCE_ID { get; set; }
      
        
        [Column("SCOPE_ID")]
        public string SCOPE_ID { get; set; }
      
        
        [Column("RESOURCE_SERVER_ID")]
        public string RESOURCE_SERVER_ID { get; set; }
      
        
        [Column("POLICY_ID")]
        public string POLICY_ID { get; set; }


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
