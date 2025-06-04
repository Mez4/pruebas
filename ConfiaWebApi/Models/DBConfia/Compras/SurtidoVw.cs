using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Compras
{
    [TableName("Compras.Surtido_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Surtido_VW
    {
              
        
        [Column("SurtidoID")]
        public int SurtidoID { get; set; }
      
        
        [Column("SolicitudID")]
        public int? SolicitudID { get; set; }
      
        
        [Column("AutorizaID")]
        public int? AutorizaID { get; set; }
      
        
        [Column("NombreAutoriza")]
        public string NombreAutoriza { get; set; }
      
        
        [Column("SurteID")]
        public int? SurteID { get; set; }
      
        
        [Column("NombreSurte")]
        public string NombreSurte { get; set; }
      
        
        [Column("CancelaID")]
        public int? CancelaID { get; set; }
      
        
        [Column("NombreCancela")]
        public string NombreCancela { get; set; }
      
        
        [Column("FechaAutorizado")]
        public DateTime? FechaAutorizado { get; set; }
      
        
        [Column("FechaSurtido")]
        public DateTime? FechaSurtido { get; set; }
      
        
        [Column("FechaCancelacion")]
        public DateTime? FechaCancelacion { get; set; }
      
        
        [Column("EstatusID")]
        public int EstatusID { get; set; }
      
        
        [Column("EstatusDes")]
        public string EstatusDes { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("Cancelada")]
        public bool Cancelada { get; set; }
      
        
        [Column("ReOrden")]
        public bool ReOrden { get; set; }
      
        
        [Column("OrdenID")]
        public int? OrdenID { get; set; }
      
        
        [Column("ReOrdenID")]
        public int? ReOrdenID { get; set; }
      
        
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
      
        
        [Column("EmpresaId")]
        public int? EmpresaId { get; set; }
      
        
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
