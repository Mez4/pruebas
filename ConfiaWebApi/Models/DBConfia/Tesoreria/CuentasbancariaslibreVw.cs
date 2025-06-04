using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.CuentasBancariasLibre_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class CuentasBancariasLibre_VW
    {
              
        
        [Column("TipoCuenta")]
        public string TipoCuenta { get; set; }
      
        
        [Column("CuentaBancariaPrincipalID")]
        public int? CuentaBancariaPrincipalID { get; set; }
      
        
        [Column("CuentaBancariaP")]
        public string CuentaBancariaP { get; set; }
      
        
        [Column("CuentaBancoID")]
        public int CuentaBancoID { get; set; }
      
        
        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("Producto")]
        public string Producto { get; set; }


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
