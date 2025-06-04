using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.PersonasDoc_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class PersonasDoc_VW
    {
              
        
        [Column("PersonasDocID")]
        public Int64 PersonasDocID { get; set; }
      
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("TiposDocumentoID")]
        public Int64 TiposDocumentoID { get; set; }
      
        
        [Column("RutaDoc")]
        public string RutaDoc { get; set; }
      
        
        [Column("Fecha")]
        public DateTime Fecha { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("NomDoc")]
        public string NomDoc { get; set; }
      
        
        [Column("PersonaIDRegistro")]
        public Int64 PersonaIDRegistro { get; set; }
      
        
        [Column("UsuarioIDRegistro")]
        public int UsuarioIDRegistro { get; set; }
      
        
        [Column("Clave")]
        public string Clave { get; set; }


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
