using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Reestructura
{
    [TableName("Reestructura.TipoDocumento")]
    [ExplicitColumns]
    [PrimaryKey("TipoDocumentoID")]
    public class TipoDocumento
    {
              
        
        [Column("TipoDocumentoID")]
        public Int64 TipoDocumentoID { get; set; }
      
        
        [Column("NombreDocumento")]
        public string NombreDocumento { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }


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
