using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.SaldosCuentasBoveda_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class SaldosCuentasBoveda_VW
    {
              
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("Producto")]
        public string Producto { get; set; }
      
        
        [Column("SucursalID")]
        public int? SucursalID { get; set; }
      
        
        [Column("NombreSucursal")]
        public string NombreSucursal { get; set; }
      
        
        [Column("CuentaBancariaPrincipalID")]
        public int? CuentaBancariaPrincipalID { get; set; }
      
        
        [Column("NumCuentaPR")]
        public string NumCuentaPR { get; set; }
      
        
        [Column("DescCuentaPR")]
        public string DescCuentaPR { get; set; }
      
        
        [Column("CajaID")]
        public int? CajaID { get; set; }
      
        
        [Column("NombreCaja")]
        public string NombreCaja { get; set; }
      
        
        [Column("CuentaBancoID")]
        public int? CuentaBancoID { get; set; }
      
        
        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }
      
        
        [Column("DescripcionCuenta")]
        public string DescripcionCuenta { get; set; }
      
        
        [Column("SaldoActual")]
        public decimal? SaldoActual { get; set; }
      
        
        [Column("SaldoMinimo")]
        public decimal? SaldoMinimo { get; set; }
      
        
        [Column("SaldoMaximo")]
        public decimal? SaldoMaximo { get; set; }
      
        
        [Column("ExcedenteSaldo")]
        public decimal? ExcedenteSaldo { get; set; }


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
