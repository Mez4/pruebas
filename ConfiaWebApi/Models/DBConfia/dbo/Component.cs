using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.COMPONENT")]
    [ExplicitColumns]
    [PrimaryKey("ID", AutoIncrement=false)]
    public class COMPONENT
    {
              
        
        [Column("ID")]
        public string ID { get; set; }
      
        
        [Column("NAME")]
        public string NAME { get; set; }
      
        
        [Column("PARENT_ID")]
        public string PARENT_ID { get; set; }
      
        
        [Column("PROVIDER_ID")]
        public string PROVIDER_ID { get; set; }
      
        
        [Column("PROVIDER_TYPE")]
        public string PROVIDER_TYPE { get; set; }
      
        
        [Column("REALM_ID")]
        public string REALM_ID { get; set; }
      
        
        [Column("SUB_TYPE")]
        public string SUB_TYPE { get; set; }


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
