using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.STP
{
    [TableName("STP.LogEventos")]
    [ExplicitColumns]
    [PrimaryKey("EventoID")]
    public class LogEventos
    {
              
        
        [Column("EventoID")]
        public Int64 EventoID { get; set; }
      
        
        [Column("TipoEventoID")]
        public int TipoEventoID { get; set; }
      
        
        [Column("Origen")]
        public string Origen { get; set; }
      
        
        [Column("IP")]
        public string IP { get; set; }
      
        
        [Column("FechaRegistro")]
        public DateTime FechaRegistro { get; set; }
      
        
        [Column("BodyRequest")]
        public string BodyRequest { get; set; }


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
