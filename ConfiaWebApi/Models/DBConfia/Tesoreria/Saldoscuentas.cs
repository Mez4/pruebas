using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.SaldosCuentas")]
    [ExplicitColumns]
    [PrimaryKey("RegistroID")]
    public class SaldosCuentas
    {
              
        
        [Column("RegistroID")]
        public int RegistroID { get; set; }
      
        
        [Column("CuentaBancoID")]
        public int CuentaBancoID { get; set; }
      
        
        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }
      
        
        [Column("TotalMovsA")]
        public int TotalMovsA { get; set; }
      
        
        [Column("TotalMovsC")]
        public int TotalMovsC { get; set; }
      
        
        [Column("Total")]
        public decimal Total { get; set; }
      
        
        [Column("FechaCaptura")]
        public DateTime FechaCaptura { get; set; }
      
        
        [Column("CajaID")]
        public int? CajaID { get; set; }
      
        
        [Column("SaldoAnterior")]
        public decimal SaldoAnterior { get; set; }
      
        
        [Column("EsBoveda")]
        public bool EsBoveda { get; set; }
      
        
        [Column("Apertura")]
        public bool Apertura { get; set; }


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
