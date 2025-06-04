using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.SaldosCajaPorProducto_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class SaldosCajaPorProducto_VW
    {
              
        
        [Column("CajaID")]
        public int? CajaID { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("TipoMovimiento")]
        public string TipoMovimiento { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("Producto")]
        public string Producto { get; set; }
      
        
        [Column("CuentaBancoID")]
        public int? CuentaBancoID { get; set; }
      
        
        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }
      
        
        [Column("SaldoActual")]
        public decimal? SaldoActual { get; set; }


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
