using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.SaldosCuentasArqueos")]
    [ExplicitColumns]
    // View, no primary key needed
    public class SaldosCuentasArqueos
    {
              
        
        [Column("CajaID")]
        public int CajaID { get; set; }
      
        
        [Column("CuentaBancoId")]
        public int? CuentaBancoId { get; set; }
      
        
        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }
      
        
        [Column("Producto")]
        public string Producto { get; set; }
      
        
        [Column("SaldoCierre")]
        public decimal? SaldoCierre { get; set; }
      
        
        [Column("CveMovDesc")]
        public string CveMovDesc { get; set; }


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
