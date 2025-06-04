using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Tesoreria
{
    [TableName("Tesoreria.ProductosMovimiento")]
    [ExplicitColumns]
    [PrimaryKey("ProdMovId")]
    public class ProductosMovimiento
    {
              
        
        [Column("ProdMovId")]
        public int ProdMovId { get; set; }
      
        
        [Column("MovimientoID")]
        public int MovimientoID { get; set; }
      
        
        [Column("ProductoID")]
        public int ProductoID { get; set; }


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
