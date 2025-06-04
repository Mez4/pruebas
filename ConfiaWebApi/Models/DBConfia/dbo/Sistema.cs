using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.Sistema")]
    [ExplicitColumns]
    // No primary key detected
    public class Sistema
    {
              
        
        [Column("SistemaId")]
        public int SistemaId { get; set; }
      
        
        [Column("NombreSistema")]
        public string NombreSistema { get; set; }
      
        
        [Column("AbrevSistema")]
        public string AbrevSistema { get; set; }


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
