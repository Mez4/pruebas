using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.USER_ROLES_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class USER_ROLES_VW
    {
              
        
        [Column("ID")]
        public string ID { get; set; }
      
        
        [Column("EMAIL")]
        public string EMAIL { get; set; }
      
        
        [Column("USERNAME")]
        public string USERNAME { get; set; }
      
        
        [Column("ENABLED")]
        public bool ENABLED { get; set; }
      
        
        [Column("FIRST_NAME")]
        public string FIRST_NAME { get; set; }
      
        
        [Column("LAST_NAME")]
        public string LAST_NAME { get; set; }
      
        
        [Column("NAME")]
        public string NAME { get; set; }
      
        
        [Column("ROLE_ID")]
        public string ROLE_ID { get; set; }
      
        
        [Column("ROLE_NAME")]
        public string ROLE_NAME { get; set; }
      
        
        [Column("ROLE_DESCRIPTION")]
        public string ROLE_DESCRIPTION { get; set; }
      
        
        [Column("CLIENT")]
        public string CLIENT { get; set; }


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
