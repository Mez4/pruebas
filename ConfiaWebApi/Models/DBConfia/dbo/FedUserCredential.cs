using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.FED_USER_CREDENTIAL")]
    [ExplicitColumns]
    [PrimaryKey("ID", AutoIncrement=false)]
    public class FED_USER_CREDENTIAL
    {
              
        
        [Column("ID")]
        public string ID { get; set; }
      
        
        [Column("SALT")]
        public byte[] SALT { get; set; }
      
        
        [Column("TYPE")]
        public string TYPE { get; set; }
      
        
        [Column("CREATED_DATE")]
        public Int64? CREATED_DATE { get; set; }
      
        
        [Column("USER_ID")]
        public string USER_ID { get; set; }
      
        
        [Column("REALM_ID")]
        public string REALM_ID { get; set; }
      
        
        [Column("STORAGE_PROVIDER_ID")]
        public string STORAGE_PROVIDER_ID { get; set; }
      
        
        [Column("USER_LABEL")]
        public string USER_LABEL { get; set; }
      
        
        [Column("SECRET_DATA")]
        public string SECRET_DATA { get; set; }
      
        
        [Column("CREDENTIAL_DATA")]
        public string CREDENTIAL_DATA { get; set; }
      
        
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
