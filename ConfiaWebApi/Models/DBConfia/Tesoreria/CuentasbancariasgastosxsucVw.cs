using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.CuentasBancariasGastosXSuc_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class CuentasBancariasGastosXSuc_VW
    {
              
        
        [Column("CuentaBancoID")]
        public int? CuentaBancoID { get; set; }
      
        
        [Column("PuedeGenGastos")]
        public bool? PuedeGenGastos { get; set; }
      
        
        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }
      
        
        [Column("DescripcionCuenta")]
        public string DescripcionCuenta { get; set; }
      
        
        [Column("CuentaBancariaPrincipalID")]
        public int? CuentaBancariaPrincipalID { get; set; }
      
        
        [Column("NumeroCuentaPrincipal")]
        public string NumeroCuentaPrincipal { get; set; }
      
        
        [Column("CajaID")]
        public int CajaID { get; set; }
      
        
        [Column("NombreCaja")]
        public string NombreCaja { get; set; }


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
