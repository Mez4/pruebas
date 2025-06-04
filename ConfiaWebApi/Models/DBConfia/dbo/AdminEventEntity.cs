using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.ADMIN_EVENT_ENTITY")]
    [ExplicitColumns]
    [PrimaryKey("ID", AutoIncrement=false)]
    public class ADMIN_EVENT_ENTITY
    {
              
        
        [Column("ID")]
        public string ID { get; set; }
      
        
        [Column("ADMIN_EVENT_TIME")]
        public Int64? ADMIN_EVENT_TIME { get; set; }
      
        
        [Column("REALM_ID")]
        public string REALM_ID { get; set; }
      
        
        [Column("OPERATION_TYPE")]
        public string OPERATION_TYPE { get; set; }
      
        
        [Column("AUTH_REALM_ID")]
        public string AUTH_REALM_ID { get; set; }
      
        
        [Column("AUTH_CLIENT_ID")]
        public string AUTH_CLIENT_ID { get; set; }
      
        
        [Column("AUTH_USER_ID")]
        public string AUTH_USER_ID { get; set; }
      
        
        [Column("IP_ADDRESS")]
        public string IP_ADDRESS { get; set; }
      
        
        [Column("RESOURCE_PATH")]
        public string RESOURCE_PATH { get; set; }
      
        
        [Column("REPRESENTATION")]
        public string REPRESENTATION { get; set; }
      
        
        [Column("ERROR")]
        public string ERROR { get; set; }
      
        
        [Column("RESOURCE_TYPE")]
        public string RESOURCE_TYPE { get; set; }


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
