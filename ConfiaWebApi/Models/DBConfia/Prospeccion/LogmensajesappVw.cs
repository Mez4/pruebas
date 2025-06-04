using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.LogMensajesApp_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class LogMensajesApp_VW
    {
              
        
        [Column("LogMensajeID")]
        public int LogMensajeID { get; set; }
      
        
        [Column("Mensaje")]
        public string Mensaje { get; set; }
      
        
        [Column("Fecha_hora")]
        public DateTime Fecha_hora { get; set; }
      
        
        [Column("AnalistaPersonaID")]
        public Int64 AnalistaPersonaID { get; set; }
      
        
        [Column("AnalistaUsuarioID")]
        public int AnalistaUsuarioID { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("Leido")]
        public bool? Leido { get; set; }
      
        
        [Column("PromotorPersonaID")]
        public Int64? PromotorPersonaID { get; set; }
      
        
        [Column("PromotorUsuarioID")]
        public int? PromotorUsuarioID { get; set; }
      
        
        [Column("ProspectoID")]
        public Int64? ProspectoID { get; set; }
      
        
        [Column("NombreProspecto")]
        public string NombreProspecto { get; set; }
      
        
        [Column("StatusProcesoID")]
        public Int64? StatusProcesoID { get; set; }
      
        
        [Column("Proceso")]
        public string Proceso { get; set; }
      
        
        [Column("SucursalID")]
        public int? SucursalID { get; set; }
      
        
        [Column("EnviadoDesdeMesa")]
        public bool EnviadoDesdeMesa { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }


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
