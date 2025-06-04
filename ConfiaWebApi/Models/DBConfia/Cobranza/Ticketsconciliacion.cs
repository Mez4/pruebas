using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.TicketsConciliacion")]
    [ExplicitColumns]
    [PrimaryKey("ticketID")]
    public class TicketsConciliacion
    {
              
        
        [Column("ticketID")]
        public Int64 ticketID { get; set; }
      
        
        [Column("totalTickets")]
        public int totalTickets { get; set; }
      
        
        [Column("conciliaTickets")]
        public int conciliaTickets { get; set; }
      
        
        [Column("fechaConciliacion")]
        public DateTime fechaConciliacion { get; set; }
      
        
        [Column("monto")]
        public decimal? monto { get; set; }


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
