using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Compras
{
    [TableName("Compras.Producto")]
    [ExplicitColumns]
    [PrimaryKey("ProductoUniformeID")]
    public class Producto
    {
              
        
        [Column("ProductoUniformeID")]
        public int ProductoUniformeID { get; set; }
      
        
        [Column("ProductoUniformeDesc")]
        public string ProductoUniformeDesc { get; set; }
      
        
        [Column("Clave")]
        public string Clave { get; set; }
      
        
        [Column("Existencia")]
        public int Existencia { get; set; }
      
        
        [Column("Activo")]
        public bool Activo { get; set; }


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
