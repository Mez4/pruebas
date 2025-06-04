using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.SolicitudesAumentoNivel")]
    [ExplicitColumns]
    [PrimaryKey("SolicitudAumentoNivID")]
    public class SolicitudesAumentoNivel
    {
              
        
        [Column("SolicitudAumentoNivID")]
        public Int64 SolicitudAumentoNivID { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("DistribuidorNivelID")]
        public int DistribuidorNivelID { get; set; }
      
        
        [Column("FechaSolicitud")]
        public DateTime? FechaSolicitud { get; set; }
      
        
        [Column("EstatusID")]
        public int EstatusID { get; set; }
      
        
        [Column("FechaRespuesta")]
        public DateTime? FechaRespuesta { get; set; }
      
        
        [Column("UsuarioSolicito")]
        public int UsuarioSolicito { get; set; }
      
        
        [Column("UsuarioRespondio")]
        public int? UsuarioRespondio { get; set; }
      
        
        [Column("Observaciones")]
        public string Observaciones { get; set; }
      
        
        [Column("MotivoCancelacion")]
        public string MotivoCancelacion { get; set; }


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
