using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.ArqueoSaldosCuentas")]
    [ExplicitColumns]
    [PrimaryKey("RegistroID")]
    public class ArqueoSaldosCuentas
    {
              
        
        [Column("RegistroID")]
        public Int64 RegistroID { get; set; }
      
        
        [Column("ArqueoID")]
        public int ArqueoID { get; set; }
      
        
        [Column("FechaCaptura")]
        public DateTime? FechaCaptura { get; set; }
      
        
        [Column("CuentaBancoID")]
        public int CuentaBancoID { get; set; }
      
        
        [Column("SaldoCierre")]
        public decimal SaldoCierre { get; set; }
      
        
        [Column("UsuarioID")]
        public int UsuarioID { get; set; }
      
        
        [Column("TipoMovimiento")]
        public int TipoMovimiento { get; set; }
      
        
        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }
      
        
        [Column("Producto")]
        public string Producto { get; set; }
      
        
        [Column("CveMovDesc")]
        public string CveMovDesc { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("SaldoInicial")]
        public decimal? SaldoInicial { get; set; }


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
