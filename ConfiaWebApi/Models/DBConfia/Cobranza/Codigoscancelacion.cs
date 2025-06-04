using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Cobranza
{
    [TableName("Cobranza.CodigosCancelacion")]
    [ExplicitColumns]
    // No primary key detected
    public class CodigosCancelacion
    {
              
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }
      
        
        [Column("PersonaID")]
        public int PersonaID { get; set; }
      
        
        [Column("DistribuidorID")]
        public Int64 DistribuidorID { get; set; }
      
        
        [Column("TicketID")]
        public int TicketID { get; set; }
      
        
        [Column("Abono")]
        public decimal Abono { get; set; }
      
        
        [Column("Fecha")]
        public DateTime? Fecha { get; set; }
      
        
        [Column("FechaCaduca")]
        public DateTime FechaCaduca { get; set; }
      
        
        [Column("Codigo")]
        public string Codigo { get; set; }
      
        
        [Column("SMSId")]
        public Int64? SMSId { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }


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
