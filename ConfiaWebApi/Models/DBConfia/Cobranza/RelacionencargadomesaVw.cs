using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.RelacionEncargadoMesa_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class RelacionEncargadoMesa_VW
    {
              
        
        [Column("DirectorMesaCobranzaID")]
        public Int64 DirectorMesaCobranzaID { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("MesaCobranzaID")]
        public int? MesaCobranzaID { get; set; }
      
        
        [Column("MesaCobranzaDesc")]
        public string MesaCobranzaDesc { get; set; }


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
