using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Compras
{
    [TableName("Compras.SolicitudUniformesDetalle")]
    [ExplicitColumns]
    [PrimaryKey("SolicitudUniformeDetalleID")]
    public class SolicitudUniformesDetalle
    {
              
        
        [Column("SolicitudUniformeDetalleID")]
        public int SolicitudUniformeDetalleID { get; set; }
      
        
        [Column("SolicitudUniformeID")]
        public int? SolicitudUniformeID { get; set; }
      
        
        [Column("ColorID")]
        public int ColorID { get; set; }
      
        
        [Column("CorteID")]
        public int CorteID { get; set; }
      
        
        [Column("TallaID")]
        public int TallaID { get; set; }
      
        
        [Column("TipoID")]
        public int TipoID { get; set; }
      
        
        [Column("Piezas")]
        public int Piezas { get; set; }
      
        
        [Column("PiezasAprobadas")]
        public int PiezasAprobadas { get; set; }
      
        
        [Column("PiezasAutorizadas")]
        public int PiezasAutorizadas { get; set; }
      
        
        [Column("PiezasPendientes")]
        public int PiezasPendientes { get; set; }
      
        
        [Column("observaciones")]
        public string observaciones { get; set; }
      
        
        [Column("FechaCompromiso")]
        public string FechaCompromiso { get; set; }


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
