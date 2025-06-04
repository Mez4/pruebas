using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.FEDERATED_USER")]
    [ExplicitColumns]
    [PrimaryKey("ID", AutoIncrement=false)]
    public class FEDERATED_USER
    {
              
        
        [Column("ID")]
        public string ID { get; set; }
      
        
        [Column("STORAGE_PROVIDER_ID")]
        public string STORAGE_PROVIDER_ID { get; set; }
      
        
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
