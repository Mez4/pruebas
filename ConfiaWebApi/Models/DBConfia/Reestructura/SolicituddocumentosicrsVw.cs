using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Reestructura
{
    [TableName("Reestructura.SolicitudDocumentosiCRS_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class SolicitudDocumentosiCRS_VW
    {
              
        
        [Column("SolicitudRCID")]
        public Int64? SolicitudRCID { get; set; }
      
        
        [Column("DocumentoID")]
        public Int64? DocumentoID { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64? DistribuidorID { get; set; }
      
        
        [Column("Ruta")]
        public string Ruta { get; set; }
      
        
        [Column("Autorizado")]
        public bool? Autorizado { get; set; }
      
        
        [Column("TipoDocumentoID")]
        public Int64? TipoDocumentoID { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("Opcional")]
        public bool? Opcional { get; set; }
      
        
        [Column("NombreDocumento")]
        public string NombreDocumento { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }


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
