using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Distribuidores
{
    [TableName("Distribuidores.TipoPago")]
    [ExplicitColumns]
    // No primary key detected
    public class TipoPago
    {
              
        
        [Column("TipoPagoID")]
        public string TipoPagoID { get; set; }
      
        
        [Column("TipoPagoDesc")]
        public string TipoPagoDesc { get; set; }
      
        
        [Column("Orden")]
        public int? Orden { get; set; }


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
