using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.RESOURCE_SERVER_SCOPE")]
    [ExplicitColumns]
    [PrimaryKey("ID", AutoIncrement=false)]
    public class RESOURCE_SERVER_SCOPE
    {
              
        
        [Column("ID")]
        public string ID { get; set; }
      
        
        [Column("NAME")]
        public string NAME { get; set; }
      
        
        [Column("ICON_URI")]
        public string ICON_URI { get; set; }
      
        
        [Column("RESOURCE_SERVER_ID")]
        public string RESOURCE_SERVER_ID { get; set; }
      
        
        [Column("DISPLAY_NAME")]
        public string DISPLAY_NAME { get; set; }


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
