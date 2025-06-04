using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.TraspasoEntreSistemasLog")]
    [ExplicitColumns]
    [PrimaryKey("LogID")]
    public class TraspasoEntreSistemasLog
    {
              
        
        [Column("LogID")]
        public Int64 LogID { get; set; }
      
        
        [Column("SistemaOrigenID")]
        public int SistemaOrigenID { get; set; }
      
        
        [Column("CuentaOrigenID")]
        public Int64 CuentaOrigenID { get; set; }
      
        
        [Column("SistemaDestinoID")]
        public int SistemaDestinoID { get; set; }
      
        
        [Column("CuentaDestinoID")]
        public Int64 CuentaDestinoID { get; set; }
      
        
        [Column("Monto")]
        public decimal Monto { get; set; }
      
        
        [Column("Observaciones")]
        public string Observaciones { get; set; }
      
        
        [Column("FechaHoraRegistra")]
        public DateTime FechaHoraRegistra { get; set; }
      
        
        [Column("PersonaRegistraID")]
        public Int64 PersonaRegistraID { get; set; }
      
        
        [Column("UsuarioRegistraID")]
        public int UsuarioRegistraID { get; set; }


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
