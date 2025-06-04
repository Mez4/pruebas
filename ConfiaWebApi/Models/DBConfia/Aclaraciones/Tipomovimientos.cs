using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Aclaraciones
{
    [TableName("Aclaraciones.TipoMovimientos")]
    [ExplicitColumns]
    [PrimaryKey("TipoMovimientoID")]
    public class TipoMovimientos
    {
              
        
        [Column("TipoMovimientoID")]
        public int TipoMovimientoID { get; set; }
      
        
        [Column("ClaveMovimiento")]
        public string ClaveMovimiento { get; set; }
      
        
        [Column("DescripcionMov")]
        public string DescripcionMov { get; set; }


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
