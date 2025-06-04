using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Compras
{
    [TableName("Compras.Solicitud_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Solicitud_VW
    {
              
        
        [Column("SolicitudID")]
        public int SolicitudID { get; set; }
      
        
        [Column("SolicitanteID")]
        public int SolicitanteID { get; set; }
      
        
        [Column("NombreSolicita")]
        public string NombreSolicita { get; set; }
      
        
        [Column("RecepcionaID")]
        public int? RecepcionaID { get; set; }
      
        
        [Column("NombreRecepciona")]
        public string NombreRecepciona { get; set; }
      
        
        [Column("CancelaID")]
        public int? CancelaID { get; set; }
      
        
        [Column("NombreCancela")]
        public string NombreCancela { get; set; }
      
        
        [Column("FechaSolicitud")]
        public DateTime FechaSolicitud { get; set; }
      
        
        [Column("FechaRecepcion")]
        public DateTime? FechaRecepcion { get; set; }
      
        
        [Column("FechaCancelacion")]
        public DateTime? FechaCancelacion { get; set; }
      
        
        [Column("EstatusID")]
        public int EstatusID { get; set; }
      
        
        [Column("EstatusDes")]
        public string EstatusDes { get; set; }
      
        
        [Column("Piezas")]
        public int Piezas { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("OrdenID")]
        public int? OrdenID { get; set; }
      
        
        [Column("ReOrdenID")]
        public int? ReOrdenID { get; set; }
      
        
        [Column("RecepcionID")]
        public int? RecepcionID { get; set; }
      
        
        [Column("Recepcionado")]
        public bool Recepcionado { get; set; }
      
        
        [Column("Aprobado")]
        public bool Aprobado { get; set; }
      
        
        [Column("RecepcionParcialID")]
        public int? RecepcionParcialID { get; set; }
      
        
        [Column("DevolucionID")]
        public int? DevolucionID { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("EmpresaId")]
        public int? EmpresaId { get; set; }


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
