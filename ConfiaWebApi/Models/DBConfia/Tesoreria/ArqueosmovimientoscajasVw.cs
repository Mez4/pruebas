using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.ArqueosMovimientosCajas_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class ArqueosMovimientosCajas_VW
    {
              
        
        [Column("ArqueoID")]
        public int ArqueoID { get; set; }
      
        
        [Column("NumeroCuentaPrincipal")]
        public string NumeroCuentaPrincipal { get; set; }
      
        
        [Column("Producto")]
        public string Producto { get; set; }
      
        
        [Column("CuentaBancoID")]
        public int? CuentaBancoID { get; set; }
      
        
        [Column("CajaID")]
        public int CajaID { get; set; }
      
        
        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }
      
        
        [Column("Total")]
        public decimal Total { get; set; }
      
        
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
