using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.SCOPE_POLICY")]
    [ExplicitColumns]
    [PrimaryKey("POLICY_ID,SCOPE_ID", AutoIncrement=false)]
    public class SCOPE_POLICY
    {
              
        
        [Column("SCOPE_ID")]
        public string SCOPE_ID { get; set; }
      
        
        [Column("POLICY_ID")]
        public string POLICY_ID { get; set; }


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
