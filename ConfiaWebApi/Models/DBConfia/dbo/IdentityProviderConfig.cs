using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.IDENTITY_PROVIDER_CONFIG")]
    [ExplicitColumns]
    [PrimaryKey("IDENTITY_PROVIDER_ID,NAME", AutoIncrement=false)]
    public class IDENTITY_PROVIDER_CONFIG
    {
              
        
        [Column("IDENTITY_PROVIDER_ID")]
        public string IDENTITY_PROVIDER_ID { get; set; }
      
        
        [Column("VALUE")]
        public string VALUE { get; set; }
      
        
        [Column("NAME")]
        public string NAME { get; set; }


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
