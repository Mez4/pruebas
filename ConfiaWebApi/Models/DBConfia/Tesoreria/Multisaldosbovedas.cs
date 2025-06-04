using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.MultiSaldosBovedas")]
    [ExplicitColumns]
    [PrimaryKey("MultiSaldoBovedaID")]
    public class MultiSaldosBovedas
    {
              
        
        [Column("MultiSaldoBovedaID")]
        public int MultiSaldoBovedaID { get; set; }
      
        
        [Column("FechaGenerado")]
        public DateTime FechaGenerado { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }
      
        
        [Column("Job")]
        public bool? Job { get; set; }


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
