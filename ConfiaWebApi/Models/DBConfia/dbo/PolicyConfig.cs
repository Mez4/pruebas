using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.POLICY_CONFIG")]
    [ExplicitColumns]
    [PrimaryKey("NAME,POLICY_ID", AutoIncrement=false)]
    public class POLICY_CONFIG
    {
              
        
        [Column("POLICY_ID")]
        public string POLICY_ID { get; set; }
      
        
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
