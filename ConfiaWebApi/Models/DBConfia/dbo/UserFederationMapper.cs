using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.USER_FEDERATION_MAPPER")]
    [ExplicitColumns]
    [PrimaryKey("ID", AutoIncrement=false)]
    public class USER_FEDERATION_MAPPER
    {
              
        
        [Column("ID")]
        public string ID { get; set; }
      
        
        [Column("NAME")]
        public string NAME { get; set; }
      
        
        [Column("FEDERATION_PROVIDER_ID")]
        public string FEDERATION_PROVIDER_ID { get; set; }
      
        
        [Column("FEDERATION_MAPPER_TYPE")]
        public string FEDERATION_MAPPER_TYPE { get; set; }
      
        
        [Column("REALM_ID")]
        public string REALM_ID { get; set; }


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
