using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.ArqueosBovedasSaldos")]
    [ExplicitColumns]
    [PrimaryKey("RegistroID")]
    public class ArqueosBovedasSaldos
    {
              
        
        [Column("RegistroID")]
        public int RegistroID { get; set; }
      
        
        [Column("ArqueoBovedaID")]
        public int ArqueoBovedaID { get; set; }
      
        
        [Column("BovedaID")]
        public int? BovedaID { get; set; }
      
        
        [Column("CuentaBancoID")]
        public int CuentaBancoID { get; set; }
      
        
        [Column("SaldoCuenta")]
        public decimal SaldoCuenta { get; set; }
      
        
        [Column("FechaCaptura")]
        public DateTime FechaCaptura { get; set; }
      
        
        [Column("TipoMovimiento")]
        public string TipoMovimiento { get; set; }


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
