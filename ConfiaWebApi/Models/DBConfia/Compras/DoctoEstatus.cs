using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Compras
{
    [TableName("Compras.docto_estatus")]
    [ExplicitColumns]
    // No primary key detected
    public class docto_estatus
    {
              
        
        [Column("id_estatus")]
        public int? id_estatus { get; set; }
      
        
        [Column("clave")]
        public string clave { get; set; }
      
        
        [Column("estatus")]
        public string estatus { get; set; }


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
