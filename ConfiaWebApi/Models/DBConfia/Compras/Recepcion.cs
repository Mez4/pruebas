using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Compras
{
    [TableName("Compras.Recepcion")]
    [ExplicitColumns]
    [PrimaryKey("RecepcionID")]
    public class Recepcion
    {
              
        
        [Column("RecepcionID")]
        public int RecepcionID { get; set; }
      
        
        [Column("RecibeID")]
        public int? RecibeID { get; set; }
      
        
        [Column("SolicitudID")]
        public int? SolicitudID { get; set; }
      
        
        [Column("SurteID")]
        public int? SurteID { get; set; }
      
        
        [Column("CancelaID")]
        public int? CancelaID { get; set; }
      
        
        [Column("DevuelveID")]
        public int? DevuelveID { get; set; }
      
        
        [Column("FechaSurtido")]
        public DateTime? FechaSurtido { get; set; }
      
        
        [Column("FechaRecepcion")]
        public DateTime? FechaRecepcion { get; set; }
      
        
        [Column("FechaCancelacion")]
        public DateTime? FechaCancelacion { get; set; }
      
        
        [Column("FechaDevolucion")]
        public DateTime? FechaDevolucion { get; set; }
      
        
        [Column("EstatusID")]
        public int EstatusID { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("Cancelada")]
        public bool Cancelada { get; set; }
      
        
        [Column("RecepcionParcial")]
        public bool RecepcionParcial { get; set; }
      
        
        [Column("Devolucion")]
        public bool Devolucion { get; set; }
      
        
        [Column("OrdenID")]
        public int? OrdenID { get; set; }
      
        
        [Column("ReOrdenID")]
        public int? ReOrdenID { get; set; }
      
        
        [Column("SurtidoID")]
        public int? SurtidoID { get; set; }
      
        
        [Column("DevolucionID")]
        public int? DevolucionID { get; set; }
      
        
        [Column("ComprobanteDoc")]
        public string ComprobanteDoc { get; set; }
      
        
        [Column("DocumentoID")]
        public int? DocumentoID { get; set; }
      
        
        [Column("ComprobanteFirma")]
        public string ComprobanteFirma { get; set; }
      
        
        [Column("FirmaDocID")]
        public int? FirmaDocID { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("Pendientes")]
        public bool Pendientes { get; set; }


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
