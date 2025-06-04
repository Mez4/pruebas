using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.SaldosCuentasTemporal")]
    [ExplicitColumns]
    [PrimaryKey("RegistroID")]
    public class SaldosCuentasTemporal
    {
              
        
        [Column("RegistroID")]
        public int RegistroID { get; set; }
      
        
        [Column("BalanceTempID")]
        public Int64 BalanceTempID { get; set; }
      
        
        [Column("TipoCuenta")]
        public string TipoCuenta { get; set; }
      
        
        [Column("Producto")]
        public string Producto { get; set; }
      
        
        [Column("CuentaBancariaPrincipalID")]
        public int CuentaBancariaPrincipalID { get; set; }
      
        
        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }
      
        
        [Column("DescripcionCuenta")]
        public string DescripcionCuenta { get; set; }
      
        
        [Column("TipoMovimiento")]
        public string TipoMovimiento { get; set; }
      
        
        [Column("CajaID")]
        public int CajaID { get; set; }
      
        
        [Column("CajaNombre")]
        public string CajaNombre { get; set; }
      
        
        [Column("Operacion")]
        public string Operacion { get; set; }
      
        
        [Column("CuentaBancoID")]
        public int CuentaBancoID { get; set; }
      
        
        [Column("DescripcionCuentaF")]
        public string DescripcionCuentaF { get; set; }
      
        
        [Column("NumeroCuentaF")]
        public string NumeroCuentaF { get; set; }
      
        
        [Column("SaldoAceptado")]
        public decimal SaldoAceptado { get; set; }
      
        
        [Column("SaldoActual")]
        public decimal SaldoActual { get; set; }
      
        
        [Column("MovimientoEntSal")]
        public bool MovimientoEntSal { get; set; }
      
        
        [Column("SaldoCierreAnterior")]
        public decimal SaldoCierreAnterior { get; set; }


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
