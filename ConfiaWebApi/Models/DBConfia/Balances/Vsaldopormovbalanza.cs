using System;
using NPoco;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace DBContext.DBConfia.Balances
{
    [TableName("Balances.vSaldoPorMovBalanza")]
    [ExplicitColumns]
    // View, no primary key needed
    public class vSaldoPorMovBalanza
    {
              
        
        [Column("Factor")]
        public decimal? Factor { get; set; }
      
        
        [Column("TipoMovimientoDesc")]
        public string TipoMovimientoDesc { get; set; }
      
        
        [Column("SaldoImporte")]
        public decimal SaldoImporte { get; set; }


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
