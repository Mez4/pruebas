using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.CajaTipoOperacion_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class CajaTipoOperacion_VW
    {
              
        
        [Column("CajaID")]
        public int? CajaID { get; set; }
      
        
        [Column("Nombre")]
        public string Nombre { get; set; }
      
        
        [Column("CuentaBancoID")]
        public int? CuentaBancoID { get; set; }
      
        
        [Column("NumeroCuentaCB")]
        public string NumeroCuentaCB { get; set; }
      
        
        [Column("ProductoID")]
        public int? ProductoID { get; set; }
      
        
        [Column("Producto")]
        public string Producto { get; set; }
      
        
        [Column("PuedeGenGastos")]
        public bool? PuedeGenGastos { get; set; }
      
        
        [Column("CuentaBancariaPrincipalID")]
        public int? CuentaBancariaPrincipalID { get; set; }
      
        
        [Column("NumeroCuentaCBP")]
        public string NumeroCuentaCBP { get; set; }
      
        
        [Column("Id")]
        public int? Id { get; set; }
      
        
        [Column("CveMovimientoID")]
        public string CveMovimientoID { get; set; }
      
        
        [Column("TipoMovimiento")]
        public string TipoMovimiento { get; set; }
      
        
        [Column("ManejaEfectivo")]
        public bool? ManejaEfectivo { get; set; }
      
        
        [Column("EsBoveda")]
        public bool? EsBoveda { get; set; }
      
        
        [Column("SucursalID")]
        public int? SucursalID { get; set; }


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
