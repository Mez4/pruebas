using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.RESOURCE_SERVER_POLICY")]
    [ExplicitColumns]
    [PrimaryKey("ID", AutoIncrement=false)]
    public class RESOURCE_SERVER_POLICY
    {
              
        
        [Column("ID")]
        public string ID { get; set; }
      
        
        [Column("NAME")]
        public string NAME { get; set; }
      
        
        [Column("DESCRIPTION")]
        public string DESCRIPTION { get; set; }
      
        
        [Column("TYPE")]
        public string TYPE { get; set; }
      
        
        [Column("DECISION_STRATEGY")]
        public string DECISION_STRATEGY { get; set; }
      
        
        [Column("LOGIC")]
        public string LOGIC { get; set; }
      
        
        [Column("RESOURCE_SERVER_ID")]
        public string RESOURCE_SERVER_ID { get; set; }
      
        
        [Column("OWNER")]
        public string OWNER { get; set; }


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
