using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Reestructura
{
    [TableName("Reestructura.ClientesFinales")]
    [ExplicitColumns]
    [PrimaryKey("ClienteFinalID")]
    public class ClientesFinales
    {
              
        
        [Column("ClienteFinalID")]
        public int ClienteFinalID { get; set; }
      
        
        [Column("ClienteID")]
        public Int64? ClienteID { get; set; }
      
        
        [Column("CreditoID")]
        public Int64? CreditoID { get; set; }
      
        
        [Column("SaldoActual")]
        public decimal? SaldoActual { get; set; }
      
        
        [Column("PersonaRegistraID")]
        public Int64? PersonaRegistraID { get; set; }
      
        
        [Column("UsuarioRegistraID")]
        public int? UsuarioRegistraID { get; set; }
      
        
        [Column("FechaRegistra")]
        public DateTime? FechaRegistra { get; set; }
      
        
        [Column("SolicitudID")]
        public Int64? SolicitudID { get; set; }


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
