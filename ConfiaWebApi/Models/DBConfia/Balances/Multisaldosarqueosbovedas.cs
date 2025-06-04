using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Balances
{
    [TableName("Balances.MultiSaldosArqueosBovedas")]
    [ExplicitColumns]
    [PrimaryKey("MultiSaldoArqueoBovedaID")]
    public class MultiSaldosArqueosBovedas
    {
              
        
        [Column("MultiSaldoArqueoBovedaID")]
        public int MultiSaldoArqueoBovedaID { get; set; }
      
        
        [Column("FechaGeneracion")]
        public DateTime FechaGeneracion { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }


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
