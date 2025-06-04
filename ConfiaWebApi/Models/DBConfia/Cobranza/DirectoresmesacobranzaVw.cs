using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.DirectoresMesaCobranza_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class DirectoresMesaCobranza_VW
    {
              
        
        [Column("DirectorMesaCobranzaID")]
        public Int64 DirectorMesaCobranzaID { get; set; }
      
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }


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
