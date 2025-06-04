using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.REALM_LOCALIZATIONS")]
    [ExplicitColumns]
    [PrimaryKey("LOCALE,REALM_ID", AutoIncrement=false)]
    public class REALM_LOCALIZATIONS
    {
              
        
        [Column("REALM_ID")]
        public string REALM_ID { get; set; }
      
        
        [Column("LOCALE")]
        public string LOCALE { get; set; }
      
        
        [Column("TEXTS")]
        public string TEXTS { get; set; }


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
