using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Prospeccion
{
    [TableName("Prospeccion.LogTiemposPorPantalla")]
    [ExplicitColumns]
    [PrimaryKey("LogTiemposPorPantallaID")]
    public class LogTiemposPorPantalla
    {
              
        
        [Column("LogTiemposPorPantallaID")]
        public int LogTiemposPorPantallaID { get; set; }
      
        
        [Column("FechaInicio")]
        public DateTime? FechaInicio { get; set; }
      
        
        [Column("FechaFinal")]
        public DateTime? FechaFinal { get; set; }
      
        
        [Column("PantallaProcesoID")]
        public int? PantallaProcesoID { get; set; }
      
        
        [Column("ProspectoID")]
        public Int64? ProspectoID { get; set; }
      
        
        [Column("AsignaAnalistaID")]
        public int? AsignaAnalistaID { get; set; }
      
        
        [Column("RevisionBuro_Tiempo")]
        public string RevisionBuro_Tiempo { get; set; }
      
        
        [Column("VerificacionLlamadas_Tiempo")]
        public string VerificacionLlamadas_Tiempo { get; set; }
      
        
        [Column("ExpedienteActivacion_Tiempo")]
        public string ExpedienteActivacion_Tiempo { get; set; }


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
