using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.CuentasBancoDisponibles_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class CuentasBancoDisponibles_VW
    {
              
        
        [Column("SucursalID")]
        public int? SucursalID { get; set; }
      
        
        [Column("CuentaContableID")]
        public int? CuentaContableID { get; set; }
      
        
        [Column("CuentaBancoID")]
        public int CuentaBancoID { get; set; }
      
        
        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }
      
        
        [Column("EsBoveda")]
        public bool EsBoveda { get; set; }
      
        
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
