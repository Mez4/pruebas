using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.REQUIRED_ACTION_PROVIDER")]
    [ExplicitColumns]
    [PrimaryKey("ID", AutoIncrement=false)]
    public class REQUIRED_ACTION_PROVIDER
    {
              
        
        [Column("ID")]
        public string ID { get; set; }
      
        
        [Column("ALIAS")]
        public string ALIAS { get; set; }
      
        
        [Column("NAME")]
        public string NAME { get; set; }
      
        
        [Column("REALM_ID")]
        public string REALM_ID { get; set; }
      
        
        [Column("ENABLED")]
        public bool ENABLED { get; set; }
      
        
        [Column("DEFAULT_ACTION")]
        public bool DEFAULT_ACTION { get; set; }
      
        
        [Column("PROVIDER_ID")]
        public string PROVIDER_ID { get; set; }
      
        
        [Column("PRIORITY")]
        public int? PRIORITY { get; set; }


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
