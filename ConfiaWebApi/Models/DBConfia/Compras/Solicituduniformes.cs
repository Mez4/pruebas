using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Compras
{
    [TableName("Compras.SolicitudUniformes")]
    [ExplicitColumns]
    [PrimaryKey("SolicitudUniformeID")]
    public class SolicitudUniformes
    {
              
        
        [Column("SolicitudUniformeID")]
        public int SolicitudUniformeID { get; set; }
      
        
        [Column("SolicitanteID")]
        public int SolicitanteID { get; set; }
      
        
        [Column("AutorizadoID")]
        public int? AutorizadoID { get; set; }
      
        
        [Column("CanceladoID")]
        public int? CanceladoID { get; set; }
      
        
        [Column("FechaSolicitud")]
        public DateTime FechaSolicitud { get; set; }
      
        
        [Column("FechaAutorizado")]
        public DateTime? FechaAutorizado { get; set; }
      
        
        [Column("Estatus")]
        public int Estatus { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }
      
        
        [Column("Piezas")]
        public int Piezas { get; set; }
      
        
        [Column("FechaCancelacion")]
        public DateTime? FechaCancelacion { get; set; }
      
        
        [Column("AprobadoID")]
        public int? AprobadoID { get; set; }
      
        
        [Column("SurtidoID")]
        public int? SurtidoID { get; set; }
      
        
        [Column("FechaAprobado")]
        public DateTime? FechaAprobado { get; set; }
      
        
        [Column("FechaSurtido")]
        public DateTime? FechaSurtido { get; set; }
      
        
        [Column("Comprobante")]
        public string Comprobante { get; set; }
      
        
        [Column("EstatusDes")]
        public string EstatusDes { get; set; }
      
        
        [Column("ReOrden")]
        public bool ReOrden { get; set; }
      
        
        [Column("Cancelada")]
        public bool Cancelada { get; set; }
      
        
        [Column("OrdenID")]
        public int? OrdenID { get; set; }
      
        
        [Column("DocumentoID")]
        public int? DocumentoID { get; set; }
      
        
        [Column("FirmaDocID")]
        public int? FirmaDocID { get; set; }


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
