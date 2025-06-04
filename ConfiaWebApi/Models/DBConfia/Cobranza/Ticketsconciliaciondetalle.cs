using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.TicketsConciliacionDetalle")]
    [ExplicitColumns]
    [PrimaryKey("detalleID")]
    public class TicketsConciliacionDetalle
    {
              
        
        [Column("detalleID")]
        public Int64 detalleID { get; set; }
      
        
        [Column("porCobrarId")]
        public Int64 porCobrarId { get; set; }
      
        
        [Column("creditoId")]
        public Int64 creditoId { get; set; }
      
        
        [Column("productoId")]
        public int productoId { get; set; }
      
        
        [Column("sucursalId")]
        public int sucursalId { get; set; }
      
        
        [Column("cobradorAsignado")]
        public string cobradorAsignado { get; set; }
      
        
        [Column("nombreCompleto")]
        public string nombreCompleto { get; set; }
      
        
        [Column("celular")]
        public string celular { get; set; }
      
        
        [Column("domicilio")]
        public string domicilio { get; set; }
      
        
        [Column("tipoCredito")]
        public string tipoCredito { get; set; }
      
        
        [Column("montoCobrar")]
        public decimal montoCobrar { get; set; }
      
        
        [Column("montoAbonado")]
        public decimal montoAbonado { get; set; }
      
        
        [Column("fechaUltimoPago")]
        public DateTime fechaUltimoPago { get; set; }
      
        
        [Column("estatus")]
        public string estatus { get; set; }
      
        
        [Column("puedeRealizarQuita")]
        public bool puedeRealizarQuita { get; set; }
      
        
        [Column("quitaPorcRangoMin")]
        public decimal quitaPorcRangoMin { get; set; }
      
        
        [Column("quitaPorcRangoMax")]
        public decimal quitaPorcRangoMax { get; set; }
      
        
        [Column("creacionFecha")]
        public DateTime creacionFecha { get; set; }
      
        
        [Column("ticketID")]
        public Int64? ticketID { get; set; }


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
