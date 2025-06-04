using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.MensajesSMS_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class MensajesSMS_VW
    {
              
        
        [Column("SMSId")]
        public Int64 SMSId { get; set; }
      
        
        [Column("mensaje")]
        public string mensaje { get; set; }
      
        
        [Column("estatusEnvioID")]
        public string estatusEnvioID { get; set; }
      
        
        [Column("fhRegistro")]
        public DateTime? fhRegistro { get; set; }
      
        
        [Column("fhEnviado")]
        public DateTime? fhEnviado { get; set; }
      
        
        [Column("ultimoResultado")]
        public string ultimoResultado { get; set; }
      
        
        [Column("fhUltimoIntentoEnvio")]
        public DateTime? fhUltimoIntentoEnvio { get; set; }
      
        
        [Column("fhEnviar")]
        public DateTime? fhEnviar { get; set; }
      
        
        [Column("Intentos")]
        public int? Intentos { get; set; }
      
        
        [Column("sistemaId")]
        public int sistemaId { get; set; }
      
        
        [Column("provedorID")]
        public int provedorID { get; set; }


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
