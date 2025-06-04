using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.SaldosCuentasCierre")]
    [ExplicitColumns]
    // No primary key detected
    public class SaldosCuentasCierre
    {
              
        
        [Column("RegistroID")]
        public int RegistroID { get; set; }
      
        
        [Column("BalanceTempID")]
        public int BalanceTempID { get; set; }
      
        
        [Column("CuentaBancoID")]
        public int CuentaBancoID { get; set; }
      
        
        [Column("SaldoCierre")]
        public decimal SaldoCierre { get; set; }


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
