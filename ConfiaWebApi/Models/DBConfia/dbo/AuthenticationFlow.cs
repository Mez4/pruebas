using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.AUTHENTICATION_FLOW")]
    [ExplicitColumns]
    [PrimaryKey("ID", AutoIncrement=false)]
    public class AUTHENTICATION_FLOW
    {
              
        
        [Column("ID")]
        public string ID { get; set; }
      
        
        [Column("ALIAS")]
        public string ALIAS { get; set; }
      
        
        [Column("DESCRIPTION")]
        public string DESCRIPTION { get; set; }
      
        
        [Column("REALM_ID")]
        public string REALM_ID { get; set; }
      
        
        [Column("PROVIDER_ID")]
        public string PROVIDER_ID { get; set; }
      
        
        [Column("TOP_LEVEL")]
        public bool TOP_LEVEL { get; set; }
      
        
        [Column("BUILT_IN")]
        public bool BUILT_IN { get; set; }


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
