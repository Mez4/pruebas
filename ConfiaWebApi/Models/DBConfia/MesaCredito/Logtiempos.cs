using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.MesaCredito
{
    [TableName("MesaCredito.LogTiempos")]
    [ExplicitColumns]
    [PrimaryKey("TiempoID")]
    public class LogTiempos
    {
              
        
        [Column("TiempoID")]
        public int TiempoID { get; set; }
      
        
        [Column("AsignaAnalistaID")]
        public int AsignaAnalistaID { get; set; }
      
        
        [Column("Tiempo")]
        public DateTime Tiempo { get; set; }
      
        
        [Column("Motivo")]
        public string Motivo { get; set; }


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
