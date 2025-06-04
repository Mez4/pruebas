using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.DistribuidoresTicket_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class DistribuidoresTicket_VW
    {
              
        
        [Column("TicketID")]
        public int TicketID { get; set; }
      
        
        [Column("Monto")]
        public decimal Monto { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("Mercancia")]
        public bool? Mercancia { get; set; }
      
        
        [Column("TipoActivo")]
        public int? TipoActivo { get; set; }
      
        
        [Column("NombreDistribuidor")]
        public string NombreDistribuidor { get; set; }
      
        
        [Column("GestorID")]
        public Int64? GestorID { get; set; }
      
        
        [Column("NombreGestor")]
        public string NombreGestor { get; set; }
      
        
        [Column("Activo")]
        public bool? Activo { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("Ruta")]
        public string Ruta { get; set; }
      
        
        [Column("FechaRegistro")]
        public DateTime FechaRegistro { get; set; }
      
        
        [Column("SaldoAntes")]
        public decimal? SaldoAntes { get; set; }


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
