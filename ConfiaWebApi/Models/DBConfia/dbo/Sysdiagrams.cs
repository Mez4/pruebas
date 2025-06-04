using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.sysdiagrams")]
    [ExplicitColumns]
    [PrimaryKey("diagram_id")]
    public class sysdiagrams
    {
              
        
        [Column("name")]
        public string name { get; set; }
      
        
        [Column("principal_id")]
        public int principal_id { get; set; }
      
        
        [Column("diagram_id")]
        public int diagram_id { get; set; }
      
        
        [Column("version")]
        public int? version { get; set; }
      
        
        [Column("definition")]
        public byte[] definition { get; set; }


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
