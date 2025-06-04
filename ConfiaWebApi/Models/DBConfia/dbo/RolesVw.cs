using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.ROLES_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class ROLES_VW
    {
              
        
        [Column("ID")]
        public string ID { get; set; }
      
        
        [Column("DESCRIPTION")]
        public string DESCRIPTION { get; set; }
      
        
        [Column("NAME")]
        public string NAME { get; set; }
      
        
        [Column("REALM_ID")]
        public string REALM_ID { get; set; }
      
        
        [Column("CLIENT")]
        public string CLIENT { get; set; }
      
        
        [Column("PARENT_ID")]
        public string PARENT_ID { get; set; }
      
        
        [Column("PARENT_NAME")]
        public string PARENT_NAME { get; set; }


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
