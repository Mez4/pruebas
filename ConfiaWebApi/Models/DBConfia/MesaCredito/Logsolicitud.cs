using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.MesaCredito
{
    [TableName("MesaCredito.LogSolicitud")]
    [ExplicitColumns]
    [PrimaryKey("LogID")]
    public class LogSolicitud
    {
              
        
        [Column("LogID")]
        public int LogID { get; set; }
      
        
        [Column("FechaCreacion")]
        public DateTime FechaCreacion { get; set; }
      
        
        [Column("Nota")]
        public string Nota { get; set; }
      
        
        [Column("SolicitudMesaCreditoID")]
        public int SolicitudMesaCreditoID { get; set; }


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
