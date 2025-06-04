using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.SolicitudesAumentoNivel_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class SolicitudesAumentoNivel_VW
    {
              
        
        [Column("SolicitudAumentoNivID")]
        public Int64 SolicitudAumentoNivID { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("SucursalID")]
        public int? SucursalID { get; set; }
      
        
        [Column("Sucursal")]
        public string Sucursal { get; set; }
      
        
        [Column("UsuarioSolicita")]
        public string UsuarioSolicita { get; set; }
      
        
        [Column("EstatusID")]
        public int? EstatusID { get; set; }
      
        
        [Column("Estatus")]
        public string Estatus { get; set; }
      
        
        [Column("FechaSolicitud")]
        public DateTime? FechaSolicitud { get; set; }
      
        
        [Column("FechaRespuesta")]
        public DateTime? FechaRespuesta { get; set; }
      
        
        [Column("UsuarioResponde")]
        public string UsuarioResponde { get; set; }
      
        
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
