using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.ProductoMatrizProcesos_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class ProductoMatrizProcesos_VW
    {
              
        
        [Column("MatrizProcesosDetalleID")]
        public int? MatrizProcesosDetalleID { get; set; }
      
        
        [Column("MatrizProcesosID")]
        public int? MatrizProcesosID { get; set; }
      
        
        [Column("StatusProcesoID")]
        public Int64 StatusProcesoID { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("CapturaObligatoria")]
        public bool? CapturaObligatoria { get; set; }
      
        
        [Column("Notificacion")]
        public bool? Notificacion { get; set; }
      
        
        [Column("NotaObligatoria")]
        public bool? NotaObligatoria { get; set; }
      
        
        [Column("DictamenObligatorio")]
        public bool? DictamenObligatorio { get; set; }
      
        
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
