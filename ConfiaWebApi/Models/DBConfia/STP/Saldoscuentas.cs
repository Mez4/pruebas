using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.STP
{
    [TableName("STP.SaldosCuentas")]
    [ExplicitColumns]
    [PrimaryKey("SaldoCuentaID")]
    public class SaldosCuentas
    {
              
        
        [Column("SaldoCuentaID")]
        public Int64 SaldoCuentaID { get; set; }
      
        
        [Column("Cuenta")]
        public string Cuenta { get; set; }
      
        
        [Column("Saldo")]
        public decimal Saldo { get; set; }
      
        
        [Column("CargosPendientes")]
        public decimal CargosPendientes { get; set; }
      
        
        [Column("FechaConsulta")]
        public DateTime FechaConsulta { get; set; }


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
