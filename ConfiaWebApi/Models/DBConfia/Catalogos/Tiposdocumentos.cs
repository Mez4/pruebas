using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Catalogos
{
    [TableName("Catalogos.TiposDocumentos")]
    [ExplicitColumns]
    // No primary key detected
    public class TiposDocumentos
    {
              
        
        [Column("documentosTipoId")]
        public int documentosTipoId { get; set; }
      
        
        [Column("documentosTipoNombre")]
        public string documentosTipoNombre { get; set; }
      
        
        [Column("productoID")]
        public int productoID { get; set; }
      
        
        [Column("extencion")]
        public string extencion { get; set; }
      
        
        [Column("subtipo")]
        public string subtipo { get; set; }
      
        
        [Column("activo")]
        public bool activo { get; set; }
      
        
        [Column("claveDoc")]
        public string claveDoc { get; set; }
      
        
        [Column("nombreCorto")]
        public string nombreCorto { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("documento")]
        public string documento { get; set; }
      
        
        [Column("requeridoValidacion")]
        public bool requeridoValidacion { get; set; }


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
