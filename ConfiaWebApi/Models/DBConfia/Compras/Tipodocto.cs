using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Compras
{
    [TableName("Compras.TipoDocto")]
    [ExplicitColumns]
    // No primary key detected
    public class TipoDocto
    {
              
        
        [Column("id_tipodocto")]
        public int? id_tipodocto { get; set; }
      
        
        [Column("clave")]
        public string clave { get; set; }
      
        
        [Column("documento")]
        public string documento { get; set; }


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
