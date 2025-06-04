using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Aclaraciones
{
    [TableName("Aclaraciones.LogMensajes_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class LogMensajes_VW
    {
              
        
        [Column("LogMensajeID")]
        public int LogMensajeID { get; set; }
      
        
        [Column("Mensaje")]
        public string Mensaje { get; set; }
      
        
        [Column("Fecha_hora")]
        public DateTime Fecha_hora { get; set; }
      
        
        [Column("Leido")]
        public bool Leido { get; set; }
      
        
        [Column("EnviadoDesdePantalla")]
        public bool EnviadoDesdePantalla { get; set; }
      
        
        [Column("AclaracionID")]
        public int? AclaracionID { get; set; }
      
        
        [Column("DescripcionAclaracion")]
        public string DescripcionAclaracion { get; set; }


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
