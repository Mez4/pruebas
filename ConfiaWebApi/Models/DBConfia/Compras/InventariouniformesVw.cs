using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Compras
{
    [TableName("Compras.InventarioUniformes_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class InventarioUniformes_VW
    {
              
        
        [Column("InventarioID")]
        public int InventarioID { get; set; }
      
        
        [Column("ProductoUniformeID")]
        public int? ProductoUniformeID { get; set; }
      
        
        [Column("ProductoUniformeDesc")]
        public string ProductoUniformeDesc { get; set; }
      
        
        [Column("TipoMov")]
        public string TipoMov { get; set; }
      
        
        [Column("NumeroPiezas")]
        public int NumeroPiezas { get; set; }
      
        
        [Column("NombreCompleto")]
        public string NombreCompleto { get; set; }
      
        
        [Column("FechaCaptura")]
        public DateTime FechaCaptura { get; set; }


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
