using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.USER_ENTITY")]
    [ExplicitColumns]
    [PrimaryKey("ID", AutoIncrement=false)]
    public class USER_ENTITY
    {
              
        
        [Column("ID")]
        public string ID { get; set; }
      
        
        [Column("EMAIL")]
        public string EMAIL { get; set; }
      
        
        [Column("EMAIL_CONSTRAINT")]
        public string EMAIL_CONSTRAINT { get; set; }
      
        
        [Column("EMAIL_VERIFIED")]
        public bool EMAIL_VERIFIED { get; set; }
      
        
        [Column("ENABLED")]
        public bool ENABLED { get; set; }
      
        
        [Column("FEDERATION_LINK")]
        public string FEDERATION_LINK { get; set; }
      
        
        [Column("FIRST_NAME")]
        public string FIRST_NAME { get; set; }
      
        
        [Column("LAST_NAME")]
        public string LAST_NAME { get; set; }
      
        
        [Column("REALM_ID")]
        public string REALM_ID { get; set; }
      
        
        [Column("USERNAME")]
        public string USERNAME { get; set; }
      
        
        [Column("CREATED_TIMESTAMP")]
        public Int64? CREATED_TIMESTAMP { get; set; }
      
        
        [Column("SERVICE_ACCOUNT_CLIENT_LINK")]
        public string SERVICE_ACCOUNT_CLIENT_LINK { get; set; }
      
        
        [Column("NOT_BEFORE")]
        public int NOT_BEFORE { get; set; }


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
