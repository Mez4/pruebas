using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Catalogos
{
    [TableName("Catalogos.DocumentosTipos")]
    [ExplicitColumns]
    [PrimaryKey("documentosTipoId")]
    public class DocumentosTipos
    {
              
        
        [Column("documentosTipoId")]
        public int documentosTipoId { get; set; }
      
        
        [Column("documentosTipoNombre")]
        public string documentosTipoNombre { get; set; }
      
        
        [Column("soloIMG")]
        public bool soloIMG { get; set; }
      
        
        [Column("activo")]
        public bool activo { get; set; }
      
        
        [Column("claveDoc")]
        public string claveDoc { get; set; }
      
        
        [Column("ordenSistema")]
        public int ordenSistema { get; set; }


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
