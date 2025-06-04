using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Creditos
{
    [TableName("Creditos.TipoProductos")]
    [ExplicitColumns]
    [PrimaryKey("TipoProductoID")]
    public class TipoProductos
    {
              
        
        [Column("TipoProductoID")]
        public int TipoProductoID { get; set; }
      
        
        [Column("TipoProducto")]
        public string TipoProducto { get; set; }


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
