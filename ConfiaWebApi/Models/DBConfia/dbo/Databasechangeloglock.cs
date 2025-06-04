using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.DATABASECHANGELOGLOCK")]
    [ExplicitColumns]
    [PrimaryKey("ID", AutoIncrement=false)]
    public class DATABASECHANGELOGLOCK
    {
              
        
        [Column("ID")]
        public int ID { get; set; }
      
        
        [Column("LOCKED")]
        public bool LOCKED { get; set; }
      
        
        [Column("LOCKGRANTED")]
        public DateTime? LOCKGRANTED { get; set; }
      
        
        [Column("LOCKEDBY")]
        public string LOCKEDBY { get; set; }


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
