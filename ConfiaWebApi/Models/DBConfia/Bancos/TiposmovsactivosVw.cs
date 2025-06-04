using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Bancos
{
    [TableName("Bancos.TiposMovsActivos_VW")]
    [ExplicitColumns]
    // View, no primary key needed
    public class TiposMovsActivos_VW
    {
              
        
        [Column("ProductoIDMov")]
        public int? ProductoIDMov { get; set; }
      
        
        [Column("ProductoMovimiento")]
        public string ProductoMovimiento { get; set; }
      
        
        [Column("tipoMovID")]
        public int tipoMovID { get; set; }
      
        
        [Column("tipoMovimientoID")]
        public string tipoMovimientoID { get; set; }
      
        
        [Column("tipoMovimiento")]
        public string tipoMovimiento { get; set; }


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
