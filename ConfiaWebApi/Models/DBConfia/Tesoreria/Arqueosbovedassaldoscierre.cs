using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.ArqueosBovedasSaldosCierre")]
    [ExplicitColumns]
    [PrimaryKey("RegistroID")]
    public class ArqueosBovedasSaldosCierre
    {
              
        
        [Column("RegistroID")]
        public int RegistroID { get; set; }
      
        
        [Column("ArqueoBovedaID")]
        public int ArqueoBovedaID { get; set; }
      
        
        [Column("CuentaBancoID")]
        public int CuentaBancoID { get; set; }
      
        
        [Column("FechaCaptura")]
        public DateTime FechaCaptura { get; set; }
      
        
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
