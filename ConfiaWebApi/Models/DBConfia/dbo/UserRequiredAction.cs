using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.USER_REQUIRED_ACTION")]
    [ExplicitColumns]
    [PrimaryKey("REQUIRED_ACTION,USER_ID", AutoIncrement=false)]
    public class USER_REQUIRED_ACTION
    {
              
        
        [Column("USER_ID")]
        public string USER_ID { get; set; }
      
        
        [Column("REQUIRED_ACTION")]
        public string REQUIRED_ACTION { get; set; }


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
