using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.EVENT_ENTITY")]
    [ExplicitColumns]
    [PrimaryKey("ID", AutoIncrement=false)]
    public class EVENT_ENTITY
    {
              
        
        [Column("ID")]
        public string ID { get; set; }
      
        
        [Column("CLIENT_ID")]
        public string CLIENT_ID { get; set; }
      
        
        [Column("DETAILS_JSON")]
        public string DETAILS_JSON { get; set; }
      
        
        [Column("ERROR")]
        public string ERROR { get; set; }
      
        
        [Column("IP_ADDRESS")]
        public string IP_ADDRESS { get; set; }
      
        
        [Column("REALM_ID")]
        public string REALM_ID { get; set; }
      
        
        [Column("SESSION_ID")]
        public string SESSION_ID { get; set; }
      
        
        [Column("EVENT_TIME")]
        public Int64? EVENT_TIME { get; set; }
      
        
        [Column("TYPE")]
        public string TYPE { get; set; }
      
        
        [Column("USER_ID")]
        public string USER_ID { get; set; }


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
