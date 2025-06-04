using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.Destinatarios_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class Destinatarios_VW
    {
              
        
        [Column("DestinatarioId")]
        public Int64 DestinatarioId { get; set; }
      
        
        [Column("SMSId")]
        public Int64 SMSId { get; set; }
      
        
        [Column("Destinatario")]
        public Int64 Destinatario { get; set; }
      
        
        [Column("RefV")]
        public string RefV { get; set; }
      
        
        [Column("RefI")]
        public Int64? RefI { get; set; }
      
        
        [Column("IDProridadMensajes")]
        public int? IDProridadMensajes { get; set; }


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
