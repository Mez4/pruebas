using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.ProteccionesRelacion_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class ProteccionesRelacion_VW
    {
              
        
        [Column("ProteccionIDDetalle")]
        public Int64 ProteccionIDDetalle { get; set; }
      
        
        [Column("ProteccionCabeceroDetalle")]
        public int? ProteccionCabeceroDetalle { get; set; }
      
        
        [Column("ProteccionDetalle")]
        public Int64? ProteccionDetalle { get; set; }
      
        
        [Column("MinimoDetalle")]
        public decimal? MinimoDetalle { get; set; }
      
        
        [Column("MaximoDetalle")]
        public decimal? MaximoDetalle { get; set; }
      
        
        [Column("MontoDetalle")]
        public decimal? MontoDetalle { get; set; }
      
        
        [Column("NivelOrigenDetalle")]
        public string NivelOrigenDetalle { get; set; }
      
        
        [Column("DistribuidorNivelDetalle")]
        public string DistribuidorNivelDetalle { get; set; }
      
        
        [Column("DescripcionDetalle")]
        public string DescripcionDetalle { get; set; }
      
        
        [Column("FechaCapturaDetalle")]
        public DateTime FechaCapturaDetalle { get; set; }
      
        
        [Column("FechaModificaDetalle")]
        public DateTime? FechaModificaDetalle { get; set; }
      
        
        [Column("NombreCapturaDetalle")]
        public string NombreCapturaDetalle { get; set; }
      
        
        [Column("NombreModificaDetalle")]
        public string NombreModificaDetalle { get; set; }


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
