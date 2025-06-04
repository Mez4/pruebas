using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.RelacionDirectorMesa")]
    [ExplicitColumns]
    // No primary key detected
    public class RelacionDirectorMesa
    {
              
        
        [Column("DirectorMesaCobranzaID")]
        public Int64 DirectorMesaCobranzaID { get; set; }
      
        
        [Column("MesaCobranzaID")]
        public int MesaCobranzaID { get; set; }


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
