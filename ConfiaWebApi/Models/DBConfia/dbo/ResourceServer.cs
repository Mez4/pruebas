using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.RESOURCE_SERVER")]
    [ExplicitColumns]
    [PrimaryKey("ID", AutoIncrement=false)]
    public class RESOURCE_SERVER
    {
              
        
        [Column("ID")]
        public string ID { get; set; }
      
        
        [Column("ALLOW_RS_REMOTE_MGMT")]
        public bool ALLOW_RS_REMOTE_MGMT { get; set; }
      
        
        [Column("POLICY_ENFORCE_MODE")]
        public string POLICY_ENFORCE_MODE { get; set; }
      
        
        [Column("DECISION_STRATEGY")]
        public int DECISION_STRATEGY { get; set; }


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
