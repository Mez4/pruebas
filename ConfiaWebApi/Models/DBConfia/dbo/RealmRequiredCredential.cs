using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.REALM_REQUIRED_CREDENTIAL")]
    [ExplicitColumns]
    [PrimaryKey("REALM_ID,TYPE", AutoIncrement=false)]
    public class REALM_REQUIRED_CREDENTIAL
    {
              
        
        [Column("TYPE")]
        public string TYPE { get; set; }
      
        
        [Column("FORM_LABEL")]
        public string FORM_LABEL { get; set; }
      
        
        [Column("INPUT")]
        public bool INPUT { get; set; }
      
        
        [Column("SECRET")]
        public bool SECRET { get; set; }
      
        
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
