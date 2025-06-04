using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.USER_FEDERATION_PROVIDER")]
    [ExplicitColumns]
    [PrimaryKey("ID", AutoIncrement=false)]
    public class USER_FEDERATION_PROVIDER
    {
              
        
        [Column("ID")]
        public string ID { get; set; }
      
        
        [Column("CHANGED_SYNC_PERIOD")]
        public int? CHANGED_SYNC_PERIOD { get; set; }
      
        
        [Column("DISPLAY_NAME")]
        public string DISPLAY_NAME { get; set; }
      
        
        [Column("FULL_SYNC_PERIOD")]
        public int? FULL_SYNC_PERIOD { get; set; }
      
        
        [Column("LAST_SYNC")]
        public int? LAST_SYNC { get; set; }
      
        
        [Column("PRIORITY")]
        public int? PRIORITY { get; set; }
      
        
        [Column("PROVIDER_NAME")]
        public string PROVIDER_NAME { get; set; }
      
        
        [Column("REALM_ID")]
        public string REALM_ID { get; set; }


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
