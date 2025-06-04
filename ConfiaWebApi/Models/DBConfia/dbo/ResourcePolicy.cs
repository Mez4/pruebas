using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.RESOURCE_POLICY")]
    [ExplicitColumns]
    [PrimaryKey("POLICY_ID,RESOURCE_ID", AutoIncrement=false)]
    public class RESOURCE_POLICY
    {
              
        
        [Column("RESOURCE_ID")]
        public string RESOURCE_ID { get; set; }
      
        
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
