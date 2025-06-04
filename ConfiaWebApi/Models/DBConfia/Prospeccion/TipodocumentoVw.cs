using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.TipoDocumento_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class TipoDocumento_VW
    {
              
        
        [Column("TipoDocumentoID")]
        public Int64? TipoDocumentoID { get; set; }
      
        
        [Column("CatalogoTipoDocumentoID")]
        public Int64 CatalogoTipoDocumentoID { get; set; }
      
        
        [Column("Orden")]
        public int? Orden { get; set; }
      
        
        [Column("Activo")]
        public bool? Activo { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("ConsultaBuro")]
        public bool? ConsultaBuro { get; set; }
      
        
        [Column("Opcional")]
        public bool? Opcional { get; set; }
      
        
        [Column("NombreDocumento")]
        public string NombreDocumento { get; set; }


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
