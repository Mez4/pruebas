using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.DATABASECHANGELOG")]
    [ExplicitColumns]
    // No primary key detected
    public class DATABASECHANGELOG
    {
              
        
        [Column("ID")]
        public string ID { get; set; }
      
        
        [Column("AUTHOR")]
        public string AUTHOR { get; set; }
      
        
        [Column("FILENAME")]
        public string FILENAME { get; set; }
      
        
        [Column("DATEEXECUTED")]
        public DateTime DATEEXECUTED { get; set; }
      
        
        [Column("ORDEREXECUTED")]
        public int ORDEREXECUTED { get; set; }
      
        
        [Column("EXECTYPE")]
        public string EXECTYPE { get; set; }
      
        
        [Column("MD5SUM")]
        public string MD5SUM { get; set; }
      
        
        [Column("DESCRIPTION")]
        public string DESCRIPTION { get; set; }
      
        
        [Column("COMMENTS")]
        public string COMMENTS { get; set; }
      
        
        [Column("TAG")]
        public string TAG { get; set; }
      
        
        [Column("LIQUIBASE")]
        public string LIQUIBASE { get; set; }
      
        
        [Column("CONTEXTS")]
        public string CONTEXTS { get; set; }
      
        
        [Column("LABELS")]
        public string LABELS { get; set; }
      
        
        [Column("DEPLOYMENT_ID")]
        public string DEPLOYMENT_ID { get; set; }


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
