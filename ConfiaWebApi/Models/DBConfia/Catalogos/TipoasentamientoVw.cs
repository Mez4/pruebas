using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Catalogos
{
    [TableName("Catalogos.TipoAsentamiento_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class TipoAsentamiento_VW
    {
              
        
        [Column("id_tipo_asentamiento")]
        public int? id_tipo_asentamiento { get; set; }
      
        
        [Column("Tipo_asenta")]
        public string Tipo_asenta { get; set; }


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
