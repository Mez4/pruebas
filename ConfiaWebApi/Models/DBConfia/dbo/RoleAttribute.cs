using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.ROLE_ATTRIBUTE")]
    [ExplicitColumns]
    [PrimaryKey("ID", AutoIncrement=false)]
    public class ROLE_ATTRIBUTE
    {
              
        
        [Column("ID")]
        public string ID { get; set; }
      
        
        [Column("ROLE_ID")]
        public string ROLE_ID { get; set; }
      
        
        [Column("NAME")]
        public string NAME { get; set; }
      
        
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
