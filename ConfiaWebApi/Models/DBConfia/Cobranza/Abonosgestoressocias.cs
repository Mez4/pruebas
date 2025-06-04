using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.AbonosGestoresSocias")]
    [ExplicitColumns]
    // No primary key detected
    public class AbonosGestoresSocias
    {
              
        
        [Column("GestorID")]
        public int? GestorID { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("TicketID")]
        public int? TicketID { get; set; }
      
        
        [Column("Abono")]
        public decimal? Abono { get; set; }
      
        
        [Column("TotalRelacion")]
        public decimal? TotalRelacion { get; set; }
      
        
        [Column("PendienteRelacion")]
        public decimal? PendienteRelacion { get; set; }
      
        
        [Column("Fecha")]
        public DateTime Fecha { get; set; }
      
        
        [Column("FechaCancela")]
        public DateTime? FechaCancela { get; set; }
      
        
        [Column("FechaCorte")]
        public DateTime? FechaCorte { get; set; }
      
        
        [Column("Activo")]
        public bool? Activo { get; set; }


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
