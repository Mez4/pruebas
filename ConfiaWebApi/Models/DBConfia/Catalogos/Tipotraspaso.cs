using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Catalogos
{
    [TableName("Catalogos.TipoTraspaso")]
    [ExplicitColumns]
    // No primary key detected
    public class TipoTraspaso
    {
              
        
        [Column("tipoTraspasoID")]
        public int tipoTraspasoID { get; set; }
      
        
        [Column("nombre")]
        public string nombre { get; set; }
      
        
        [Column("activo")]
        public bool? activo { get; set; }


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
