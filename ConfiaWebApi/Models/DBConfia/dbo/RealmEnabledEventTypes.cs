using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.REALM_ENABLED_EVENT_TYPES")]
    [ExplicitColumns]
    [PrimaryKey("REALM_ID,VALUE", AutoIncrement=false)]
    public class REALM_ENABLED_EVENT_TYPES
    {
              
        
        [Column("REALM_ID")]
        public string REALM_ID { get; set; }
      
        
        [Column("VALUE")]
        public string VALUE { get; set; }


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
