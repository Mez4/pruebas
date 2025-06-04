using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.RESOURCE_SCOPE")]
    [ExplicitColumns]
    [PrimaryKey("RESOURCE_ID,SCOPE_ID", AutoIncrement=false)]
    public class RESOURCE_SCOPE
    {
              
        
        [Column("RESOURCE_ID")]
        public string RESOURCE_ID { get; set; }
      
        
        [Column("SCOPE_ID")]
        public string SCOPE_ID { get; set; }


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
