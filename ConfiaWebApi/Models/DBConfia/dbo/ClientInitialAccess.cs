using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.CLIENT_INITIAL_ACCESS")]
    [ExplicitColumns]
    [PrimaryKey("ID", AutoIncrement=false)]
    public class CLIENT_INITIAL_ACCESS
    {
              
        
        [Column("ID")]
        public string ID { get; set; }
      
        
        [Column("REALM_ID")]
        public string REALM_ID { get; set; }
      
        
        [Column("TIMESTAMP")]
        public int? TIMESTAMP { get; set; }
      
        
        [Column("EXPIRATION")]
        public int? EXPIRATION { get; set; }
      
        
        [Column("COUNT")]
        public int? COUNT { get; set; }
      
        
        [Column("REMAINING_COUNT")]
        public int? REMAINING_COUNT { get; set; }


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
