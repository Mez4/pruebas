using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.EncargadosMesasCobranza_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class EncargadosMesasCobranza_VW
    {
              
        
        [Column("Encargado")]
        public Int64 Encargado { get; set; }
      
        
        [Column("GestorCobranzaID")]
        public Int64 GestorCobranzaID { get; set; }
      
        
        [Column("PersonaID")]
        public Int64? PersonaID { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }
      
        
        [Column("MesaCobranzaID")]
        public int MesaCobranzaID { get; set; }
      
        
        [Column("mesaCobranza")]
        public string mesaCobranza { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("ProductoIDGrupo")]
        public int? ProductoIDGrupo { get; set; }
      
        
        [Column("DistribuidoresTotal")]
        public int? DistribuidoresTotal { get; set; }


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
