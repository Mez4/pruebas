using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.DistribuidoresTicket")]
    [ExplicitColumns]
    [PrimaryKey("TicketID")]
    public class DistribuidoresTicket
    {
              
        
        [Column("TicketID")]
        public int TicketID { get; set; }
      
        
        [Column("Usuario_Logueado")]
        public int? Usuario_Logueado { get; set; }
      
        
        [Column("persona_Logueada")]
        public int? persona_Logueada { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("Monto")]
        public decimal Monto { get; set; }
      
        
        [Column("Ruta")]
        public string Ruta { get; set; }
      
        
        [Column("FechaRegistro")]
        public DateTime FechaRegistro { get; set; }
      
        
        [Column("Activo")]
        public bool? Activo { get; set; }
      
        
        [Column("GestorID")]
        public Int64? GestorID { get; set; }
      
        
        [Column("OrigenVR")]
        public bool? OrigenVR { get; set; }
      
        
        [Column("Aplicado")]
        public bool? Aplicado { get; set; }
      
        
        [Column("SaldoAntes")]
        public decimal? SaldoAntes { get; set; }
      
        [ComputedColumn(ComputedColumnType.Always)]
        [Column("SaldoDespues")]
        public decimal? SaldoDespues { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("Mercancia")]
        public bool? Mercancia { get; set; }
      
        
        [Column("TipoActivo")]
        public int? TipoActivo { get; set; }
      
        
        [Column("ObservacionesActivo")]
        public string ObservacionesActivo { get; set; }
      
        
        [Column("SistemaVR")]
        public int? SistemaVR { get; set; }
      
        
        [Column("DescSistemaVR")]
        public string DescSistemaVR { get; set; }


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
