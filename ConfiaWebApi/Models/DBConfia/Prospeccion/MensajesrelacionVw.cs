using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.MensajesRelacion_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class MensajesRelacion_VW
    {
              
        
        [Column("StatusProcesoID")]
        public Int64 StatusProcesoID { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("MensajeID")]
        public int? MensajeID { get; set; }
      
        
        [Column("TipoDocumentoID")]
        public Int64? TipoDocumentoID { get; set; }
      
        
        [Column("Mensaje")]
        public string Mensaje { get; set; }
      
        
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
