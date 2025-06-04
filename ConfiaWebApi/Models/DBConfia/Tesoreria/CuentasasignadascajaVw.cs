using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.CuentasAsignadasCaja_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class CuentasAsignadasCaja_VW
    {
              
        
        [Column("Estatus")]
        public int Estatus { get; set; }
      
        
        [Column("SucursalID")]
        public int? SucursalID { get; set; }
      
        
        [Column("NombreCaja")]
        public string NombreCaja { get; set; }
      
        
        [Column("CajaId")]
        public int CajaId { get; set; }
      
        
        [Column("Disponible")]
        public bool Disponible { get; set; }
      
        
        [Column("CuentaBancoID")]
        public int? CuentaBancoID { get; set; }
      
        
        [Column("NumeroCuenta")]
        public string NumeroCuenta { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }
      
        
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
