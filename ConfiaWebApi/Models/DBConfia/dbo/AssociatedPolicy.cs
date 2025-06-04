using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.ASSOCIATED_POLICY")]
    [ExplicitColumns]
    [PrimaryKey("ASSOCIATED_POLICY_ID,POLICY_ID", AutoIncrement=false)]
    public class ASSOCIATED_POLICY
    {
              
        
        [Column("POLICY_ID")]
        public string POLICY_ID { get; set; }
      
        
        [Column("ASSOCIATED_POLICY_ID")]
        public string ASSOCIATED_POLICY_ID { get; set; }


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
