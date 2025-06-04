using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.MIGRATION_MODEL")]
    [ExplicitColumns]
    [PrimaryKey("ID", AutoIncrement=false)]
    public class MIGRATION_MODEL
    {
              
        
        [Column("ID")]
        public string ID { get; set; }
      
        
        [Column("VERSION")]
        public string VERSION { get; set; }
      
        
        [Column("UPDATE_TIME")]
        public Int64 UPDATE_TIME { get; set; }


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
