using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.AvalesDocumentos_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class AvalesDocumentos_VW
    {
              
        
        [Column("TipoDocumentoAvalID")]
        public Int64 TipoDocumentoAvalID { get; set; }
      
        
        [Column("NombreDocumento")]
        public string NombreDocumento { get; set; }
      
        
        [Column("Clave")]
        public string Clave { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("Orden")]
        public int? Orden { get; set; }
      
        
        [Column("DocumentoAvalID")]
        public Int64? DocumentoAvalID { get; set; }
      
        
        [Column("PersonaID")]
        public Int64? PersonaID { get; set; }
      
        
        [Column("TipoPersonaID")]
        public int? TipoPersonaID { get; set; }
      
        
        [Column("Ruta")]
        public string Ruta { get; set; }
      
        
        [Column("Autorizado")]
        public bool? Autorizado { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }


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
