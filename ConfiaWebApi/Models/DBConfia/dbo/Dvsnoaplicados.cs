using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.dbo
{
    [TableName("dbo.DvsNoAplicados")]
    [ExplicitColumns]
    // No primary key detected
    public class DvsNoAplicados
    {
              
        
        [Column("Distribuidorid")]
        public Int64? Distribuidorid { get; set; }
      
        
        [Column("SucursalID")]
        public int? SucursalID { get; set; }
      
        
        [Column("Importe")]
        public decimal? Importe { get; set; }
      
        
        [Column("FechaPago")]
        public DateTime? FechaPago { get; set; }
      
        
        [Column("CajaID")]
        public int? CajaID { get; set; }


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
