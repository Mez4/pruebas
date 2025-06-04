using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospectos
{
    [TableName("Prospectos.TipoDocumento")]
    [ExplicitColumns]
    [PrimaryKey("id")]
    public class TipoDocumento
    {
              
        
        [Column("id")]
        public int id { get; set; }
      
        
        [Column("clave")]
        public string clave { get; set; }
      
        
        [Column("orden")]
        public int orden { get; set; }
      
        
        [Column("status")]
        public string status { get; set; }


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
