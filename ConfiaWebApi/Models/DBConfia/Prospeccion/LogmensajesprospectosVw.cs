using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.LogMensajesProspectos_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class LogMensajesProspectos_VW
    {
              
        
        [Column("LogMensajeID")]
        public int LogMensajeID { get; set; }
      
        
        [Column("Mensaje")]
        public string Mensaje { get; set; }
      
        
        [Column("Fecha_hora")]
        public DateTime Fecha_hora { get; set; }
      
        
        [Column("ValidacionMesaID")]
        public int? ValidacionMesaID { get; set; }
      
        
        [Column("PersonaID")]
        public Int64 PersonaID { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }
      
        
        [Column("ProspectoID")]
        public Int64 ProspectoID { get; set; }
      
        
        [Column("StatusProcesoID")]
        public Int64? StatusProcesoID { get; set; }
      
        
        [Column("Descripcion")]
        public string Descripcion { get; set; }


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
